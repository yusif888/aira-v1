<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ConnectException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class QwenAIService
{
    /**
     * @var Client
     */
    protected $client;

    /**
     * @var string
     */
    protected $apiUrl;

    /**
     * @var string
     */
    protected $model;

    /**
     * @var string|null
     */
    protected $apiKey;

    /**
     * @var int
     */
    protected $timeout;

    /**
     * @var bool
     */
    protected $enabled;

    /**
     * @var bool
     */
    protected $mock;

    /**
     * @var float
     */
    protected $temperature;

    /**
     * @var int
     */
    protected $maxTokens;

    /**
     * Constructor
     *
     * @param Client|null $client
     */
    public function __construct($client = null)
    {
        $this->apiUrl = config('services.qwen.url', env('QWEN_API_URL', env('VLLM_API_URL', 'http://127.0.0.1:8000/v1/chat/completions')));
        $this->model = config('services.qwen.model', env('QWEN_MODEL', 'Qwen/Qwen2.5-7B-Instruct'));
        $this->apiKey = config('services.qwen.api_key', env('QWEN_API_KEY', 'none'));
        $this->timeout = (int) config('services.qwen.timeout', env('QWEN_TIMEOUT', 30));
        $this->enabled = (bool) config('services.qwen.enabled', env('QWEN_ENABLED', true));
        $this->mock = (bool) config('services.qwen.mock', env('QWEN_MOCK', false));
        $this->temperature = (float) config('services.qwen.temperature', env('QWEN_TEMPERATURE', 0.3));
        $this->maxTokens = (int) config('services.qwen.max_tokens', env('QWEN_MAX_TOKENS', 800));

        $this->client = $client ?: new Client([
            'timeout' => $this->timeout,
            'connect_timeout' => min(5, $this->timeout),
            'http_errors' => false,
        ]);
    }

    /**
     * Check if Qwen AI service is enabled
     *
     * @return bool
     */
    public function isEnabled()
    {
        return $this->enabled;
    }

    /**
     * Check if mock mode is active
     *
     * @return bool
     */
    public function isMock()
    {
        return $this->mock;
    }

    /**
     * Generate response from Qwen 2.5 Instruct model
     *
     * @param string $userMessage
     * @param array $conversationHistory Array of ['sender' => 'user'|'bot', 'message' => '...']
     * @param array $contextChunks Relevant document / API snippets for RAG
     * @return string|null
     */
    public function generateResponse($userMessage, array $conversationHistory = [], array $contextChunks = [])
    {
        if (!$this->enabled) {
            return null;
        }

        // Mock mode for local testing without GPU
        if ($this->mock) {
            return $this->mockResponse($userMessage, $contextChunks);
        }

        try {
            $messages = [];

            // 1. System Prompt with RAG Context
            $messages[] = [
                'role' => 'system',
                'content' => $this->buildSystemPrompt($contextChunks)
            ];

            // 2. Conversation History (ambil maksimal 6 pesan terakhir untuk menjaga context window)
            $recentHistory = array_slice($conversationHistory, -6);
            foreach ($recentHistory as $chat) {
                $role = ($chat['sender'] === 'bot') ? 'assistant' : 'user';
                $messages[] = [
                    'role' => $role,
                    'content' => (string) $chat['message']
                ];
            }

            // 3. Current User Message
            $messages[] = [
                'role' => 'user',
                'content' => (string) $userMessage
            ];

            // 4. Build OpenAI-Compatible Request Payload for vLLM
            $payload = [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => $this->temperature,
                'max_tokens' => $this->maxTokens,
                'top_p' => 0.85,
                'stream' => false
            ];

            $headers = [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ];

            if (!empty($this->apiKey) && $this->apiKey !== 'none') {
                $headers['Authorization'] = 'Bearer ' . $this->apiKey;
            }

            $response = $this->client->post($this->apiUrl, [
                'headers' => $headers,
                'json' => $payload
            ]);

            $statusCode = $response->getStatusCode();
            $body = (string) $response->getBody();

            if ($statusCode >= 200 && $statusCode < 300) {
                $data = json_decode($body, true);
                if (isset($data['choices'][0]['message']['content'])) {
                    $reply = trim($data['choices'][0]['message']['content']);
                    if (!empty($reply)) {
                        return $reply;
                    }
                }
                Log::warning('QwenAIService: Empty choices returned from vLLM', ['body' => substr($body, 0, 300)]);
                return null;
            }

            Log::error("QwenAIService HTTP {$statusCode}: " . substr($body, 0, 500));
            return null;

        } catch (ConnectException $e) {
            Log::warning('QwenAIService Connection Failed (vLLM offline/unreachable): ' . $e->getMessage());
            return null;
        } catch (RequestException $e) {
            Log::error('QwenAIService RequestException: ' . $e->getMessage());
            return null;
        } catch (\Exception $e) {
            Log::error('QwenAIService Unexpected Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Build standard PUSDA Jatim system prompt with optional RAG context
     *
     * @param array $contextChunks
     * @return string
     */
    public function buildSystemPrompt(array $contextChunks = [])
    {
        $prompt = "Anda adalah AIRA (Asisten Virtual Resmi Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur).\n"
            . "Tugas utama Anda adalah memberikan informasi yang akurat, santun, dan solutif kepada masyarakat serta pegawai mengenai pengelolaan sumber daya air, bendung, daerah irigasi, sungai, pantai, perizinan, dan layanan kedinasan.\n\n"
            . "PEDOMAN KOMUNIKASI & ETIKA DINAS:\n"
            . "1. Gunakan Bahasa Indonesia formal yang ramah, santun, lugas, dan berwibawa sesuai tata naskah dinas Pemerintah Provinsi Jawa Timur.\n"
            . "2. Prioritaskan kebenaran fakta berdasarkan data resmi yang disediakan di bawah ini. Jangan pernah berhalusinasi atau mengarang data teknis (seperti angka debit air atau status izin).\n"
            . "3. Jika pertanyaan di luar lingkup kedinasan atau informasi tidak tersedia pada data rujukan, sampaikan dengan jujur dan santun bahwa data belum tersedia, lalu arahkan pemohon ke kanal layanan resmi:\n"
            . "   - Alamat Kantor: Jl. Gayung Kebonsari No. 169, Gayungan, Surabaya, Jawa Timur 60235\n"
            . "   - Telepon: (031) 8292419\n"
            . "   - Email: pusdajawatimur@gmail.com\n"
            . "   - Website: dpuair.jatimprov.go.id\n"
            . "4. Jawablah secara terstruktur, to-the-point, dan mudah dipahami oleh masyarakat umum.";

        if (!empty($contextChunks)) {
            $prompt .= "\n\n========================================\n"
                . "DATA DOKUMEN & INFORMASI RESMI RUJUKAN (RAG CONTEXT):\n"
                . "========================================\n";

            $index = 1;
            foreach ($contextChunks as $chunk) {
                $title = isset($chunk['title']) ? "Judul: " . $chunk['title'] . "\n" : "";
                $content = isset($chunk['content']) ? $chunk['content'] : (is_string($chunk) ? $chunk : json_encode($chunk));
                $prompt .= "[Rujukan {$index}]:\n" . $title . trim($content) . "\n\n";
                $index++;
            }

            $prompt .= "Instruksi Khusus: Rangkum dan jelaskan informasi di atas untuk menjawab pertanyaan pengguna dengan kalimat yang luwes dan padat.";
        }

        return $prompt;
    }

    /**
     * Generate emulated mock response for local environment (when no GPU is active)
     *
     * @param string $userMessage
     * @param array $contextChunks
     * @return string
     */
    protected function mockResponse($userMessage, array $contextChunks = [])
    {
        $lower = strtolower($userMessage);

        if (!empty($contextChunks)) {
            $firstChunk = $contextChunks[0];
            $title = is_array($firstChunk) && isset($firstChunk['title']) ? $firstChunk['title'] : 'informasi kedinasan';
            return "Berdasarkan rujukan resmi terkait {$title}, Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur mengelola hal tersebut sesuai dengan ketentuan yang berlaku. Untuk konsultasi lebih lanjut, silakan menghubungi Sekretariat di (031) 8292419.";
        }

        if (stripos($lower, 'izin') !== false || stripos($lower, 'rekomtek') !== false) {
            return "Untuk permohonan Rekomendasi Teknis (Rekomtek) atau izin pemanfaatan sumber daya air di wilayah Jawa Timur, pemohon dapat mengajukan berkas persyaratan melalui loket pelayanan perizinan Dinas PU SDA Jatim di Jl. Gayung Kebonsari No. 169 Surabaya atau memantau portal pelayanan resmi.";
        }

        return "Halo! Saya AIRA (Asisten Virtual Dinas PU SDA Jatim didukung Qwen 2.5). Pertanyaan Anda: \"{$userMessage}\" telah diterima. Ada yang dapat kami bantu lebih lanjut mengenai layanan sumber daya air di Jawa Timur?";
    }

    /**
     * Get current configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return [
            'api_url' => $this->apiUrl,
            'model' => $this->model,
            'enabled' => $this->enabled,
            'mock' => $this->mock,
            'timeout' => $this->timeout,
            'temperature' => $this->temperature,
            'max_tokens' => $this->maxTokens,
        ];
    }
}
