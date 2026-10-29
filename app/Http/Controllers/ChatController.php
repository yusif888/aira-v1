<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\ChatLearningData;
use App\Models\IrigasiData;
use App\Services\KamusService;
use App\Services\WebsiteKnowledgeService;
use App\Services\QwenAIService;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    /**
     * @var KamusService
     */
    protected $kamusService;

    /**
     * @var WebsiteKnowledgeService
     */
    protected $websiteKnowledgeService;

    /**
     * @var QwenAIService
     */
    protected $qwenService;

    /**
     * Constructor with Dependency Injection
     *
     * @param KamusService $kamusService
     * @param WebsiteKnowledgeService $websiteKnowledgeService
     * @param QwenAIService $qwenService
     */
    public function __construct(
        KamusService $kamusService,
        WebsiteKnowledgeService $websiteKnowledgeService,
        QwenAIService $qwenService
    ) {
        // Rate limiting: 20 pesan per menit per IP
        $this->middleware(function ($request, $next) {
            $key = 'chat-' . $request->ip();
            $limiter = app('Illuminate\Cache\RateLimiter');
            
            if ($limiter->tooManyAttempts($key, 20)) {
                $seconds = $limiter->availableIn($key);
                return response()->json([
                    'success' => false,
                    'message' => "Terlalu banyak permintaan. Coba lagi dalam {$seconds} detik."
                ], 429);
            }
            
            $limiter->hit($key, 60);
            return $next($request);
        })->only(['sendMessage']);
        
        $this->kamusService = $kamusService;
        $this->websiteKnowledgeService = $websiteKnowledgeService;
        $this->qwenService = $qwenService;
    }

    /**
     * Tampilkan halaman chat
     */
    public function index()
    {
        return view('chat.index');
    }

    /**
     * Get chat history
     */
    public function getHistory(Request $request)
    {
        $sessionId = $request->session()->getId();
        
        $chats = Chat::where('session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'chats' => $chats
        ]);
    }

    /**
     * Handle incoming message
     */
    public function sendMessage(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string|max:1000|min:1'
            ]);
            
            // Sanitasi input
            $userMessage = strip_tags($request->input('message'));
            $userMessage = htmlspecialchars($userMessage, ENT_QUOTES, 'UTF-8');

            $sessionId = $request->session()->getId();

            // Ambil riwayat percakapan sebelum pesan baru dimasukkan (untuk context window AI)
            $existingHistory = Chat::where('session_id', $sessionId)
                ->orderBy('created_at', 'asc')
                ->take(10)
                ->get()
                ->map(function ($chat) {
                    return [
                        'sender' => $chat->sender,
                        'message' => $chat->message,
                    ];
                })
                ->toArray();

            // Simpan pesan user
            Chat::create([
                'session_id' => $sessionId,
                'sender' => 'user',
                'message' => $userMessage,
                'source' => 'user'
            ]);

            // ========================================================
            // PRIORITAS PENCARIAN JAWABAN (WATERFALL RETRIEVAL):
            // 1. Database Irigasi Spesifik (Data teknis angka bendung)
            // 2. Kamus FAQ Lokal (Jawaban instan FAQ dasar dinas)
            // 3. Qwen 2.5 AI Model (RAG Context dari Dokumen & Berita)
            // 4. Fallback Website Knowledge (Pencarian teks statis jika AI offline)
            // 5. Default Message (Jika seluruh kanal tidak menemukan jawaban)
            // ========================================================

            $botResponse = null;
            $source = null;
            $sourceInfo = null;

            // --------------------------------------------------------
            // 1. Cek Data Irigasi Spesifik (Bendung / Intake / Keandalan)
            // --------------------------------------------------------
            if (stripos($userMessage, 'bendung') !== false || stripos($userMessage, 'irigasi') !== false || stripos($userMessage, 'intake') !== false) {
                try {
                    $allIrigasi = IrigasiData::select('daerah_irigasi')->get();
                    foreach ($allIrigasi as $irigasi) {
                        if (stripos($userMessage, $irigasi->daerah_irigasi) !== false) {
                            $data = IrigasiData::where('daerah_irigasi', $irigasi->daerah_irigasi)->first();
                            if ($data) {
                                $num = function ($val) {
                                    return number_format((float)$val, 2, ',', '.');
                                };

                                $targetTw = null;
                                if (preg_match('/TW\s*(\d)/i', $userMessage, $matches)) {
                                    $targetTw = (int)$matches[1];
                                }

                                $linesInfo = [];
                                $linesInfo[] = "Nama Bendung : " . $data->daerah_irigasi;
                                $linesInfo[] = "Kewenangan : " . $data->upt_name;
                                $headerStr = implode("\n", $linesInfo) . "\n\n";

                                $sections = [];
                                $isKeandalan = stripos($userMessage, 'keandalan') !== false || stripos($userMessage, 'persentase') !== false;
                                $isKebutuhan = stripos($userMessage, 'kebutuhan') !== false;
                                $isIntake = stripos($userMessage, 'intake') !== false;

                                if (!$isKeandalan && !$isKebutuhan && !$isIntake) {
                                    $isKeandalan = $isKebutuhan = $isIntake = true;
                                }

                                if ($isIntake) {
                                    $lines = [];
                                    if ($targetTw) {
                                        $val = $data->{"debit_intake_tw{$targetTw}"};
                                        $lines[] = "- TW {$targetTw}: " . $num($val);
                                    } else {
                                        for ($i = 1; $i <= 4; $i++) {
                                            $lines[] = "- TW {$i}: " . $num($data->{"debit_intake_tw{$i}"});
                                        }
                                    }
                                    $sections[] = "Debit Intake (Lt/dt):\n" . implode("\n", $lines);
                                }

                                if ($isKebutuhan) {
                                    $lines = [];
                                    if ($targetTw) {
                                        $val = $data->{"debit_kebutuhan_tw{$targetTw}"};
                                        $lines[] = "- TW {$targetTw}: " . $num($val);
                                    } else {
                                        for ($i = 1; $i <= 4; $i++) {
                                            $lines[] = "- TW {$i}: " . $num($data->{"debit_kebutuhan_tw{$i}"});
                                        }
                                    }
                                    $sections[] = "Debit Kebutuhan (Lt/dt):\n" . implode("\n", $lines);
                                }

                                if ($isKeandalan) {
                                    $lines = [];
                                    if ($targetTw) {
                                        $val = $data->{"keandalan_tw{$targetTw}"};
                                        $lines[] = "- TW {$targetTw}: " . $num($val) . "%";
                                    } else {
                                        for ($i = 1; $i <= 4; $i++) {
                                            $lines[] = "- TW {$i}: " . $num($data->{"keandalan_tw{$i}"}) . "%";
                                        }
                                    }
                                    $sections[] = "Persentase Keandalan (%):\n" . implode("\n", $lines);
                                }

                                $sectionsStr = (!empty($sections)) ? implode("\n\n", $sections) . "\n\n" : "";

                                $conclusions = [];
                                $tws = $targetTw ? [$targetTw] : [1, 2, 3, 4];
                                foreach ($tws as $tw) {
                                    $val = $data->{"keandalan_tw{$tw}"};
                                    $status = ($val >= 80) ? "terpenuhi" : "tidak terpenuhi";
                                    $conclusions[] = "- Pada TW {$tw} persentase keandalan sebesar " . $num($val) . "% ({$status})";
                                }
                                $footerStr = "Kesimpulan :\n" . implode("\n", $conclusions);

                                $botResponse = $headerStr . $sectionsStr . $footerStr;
                                $source = 'irigasi_database';
                                $sourceInfo = ['daerah_irigasi' => $data->daerah_irigasi, 'upt' => $data->upt_name];
                                break;
                            }
                        }
                    }
                } catch (\Exception $ex) {
                    \Illuminate\Support\Facades\Log::error("Irigasi Query Error: " . $ex->getMessage());
                }
            }

            // --------------------------------------------------------
            // 2. Cek di Kamus FAQ Lokal (Respon Instan)
            // --------------------------------------------------------
            if ($botResponse === null) {
                $botResponse = $this->kamusService->getJawaban($userMessage);
                if ($botResponse !== null) {
                    $source = 'kamus';
                    $sourceInfo = ['type' => 'local_faq'];
                }
            }

            // --------------------------------------------------------
            // 3. Qwen 2.5 Instruct LLM (Dengan RAG Context Dokumen & Berita)
            // --------------------------------------------------------
            if ($botResponse === null && $this->qwenService->isEnabled()) {
                // Ambil potongan konteks relevan dari database artikel/dokumen web
                $relevantChunks = $this->websiteKnowledgeService->getRelevantChunks($userMessage, 3);

                $aiReply = $this->qwenService->generateResponse($userMessage, $existingHistory, $relevantChunks);
                if (!empty($aiReply)) {
                    $botResponse = $aiReply;
                    $source = 'qwen_ai';
                    $sourceInfo = [
                        'engine' => 'vLLM',
                        'model' => config('services.qwen.model', 'Qwen/Qwen2.5-7B-Instruct'),
                        'context_count' => count($relevantChunks),
                    ];
                }
            }

            // --------------------------------------------------------
            // 4. Fallback Website Knowledge (Pencarian Teks Manual jika AI Offline)
            // --------------------------------------------------------
            if ($botResponse === null) {
                $knowledgeResult = $this->websiteKnowledgeService->getJawaban($userMessage);
                if ($knowledgeResult !== null) {
                    $botResponse = $knowledgeResult['jawaban'];
                    $source = $knowledgeResult['source'];
                    $sourceInfo = $knowledgeResult['source_info'];
                }
            }

            // --------------------------------------------------------
            // 5. Default Message (Jika Seluruh Jalur Tidak Menemukan Informasi)
            // --------------------------------------------------------
            if ($botResponse === null) {
                $botResponse = "Mohon maaf, saya belum memiliki informasi mengenai hal tersebut. Untuk bantuan lebih lanjut, silakan menghubungi Sekretariat Dinas PU Sumber Daya Air Provinsi Jawa Timur di nomor telepon (031) 8292419 atau email ke pusdajawatimur@gmail.com.";
                $source = 'default';
            }

            // Simpan respon bot ke database
            $botChat = Chat::create([
                'session_id' => $sessionId,
                'sender' => 'bot',
                'message' => $botResponse,
                'source' => $source
            ]);

            return response()->json([
                'success' => true,
                'message' => $botResponse,
                'source' => $source,
                'source_info' => $sourceInfo
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Chat Error: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear chat history (dipanggil saat tombol Close)
     * Simpan conversation ke learning data
     */
    public function clearHistory(Request $request)
    {
        $sessionId = $request->session()->getId();
        
        $chats = Chat::where('session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($chats->count() > 0) {
            $conversation = $chats->map(function ($chat) {
                return [
                    'sender' => $chat->sender,
                    'message' => $chat->message,
                    'source' => $chat->source ?? null,
                    'timestamp' => $chat->created_at->toISOString(),
                ];
            })->toArray();

            ChatLearningData::create([
                'session_id' => $sessionId,
                'user_ip' => $request->ip(),
                'conversation' => $conversation,
                'message_count' => $chats->count(),
                'started_at' => $chats->first()->created_at,
                'ended_at' => $chats->last()->created_at,
                'is_processed' => false,
                'metadata' => [
                    'user_agent' => $request->userAgent(),
                    'saved_at' => now()->toISOString(),
                ],
            ]);
        }

        Chat::where('session_id', $sessionId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Chat history saved for learning and cleared'
        ]);
    }

    /**
     * Minimize chat (tidak hapus history, hanya minimize UI)
     */
    public function minimizeChat(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Chat minimized'
        ]);
    }
}
