<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use GuzzleHttp\Client;

class DeepSeekService
{
    private $apiKey;
    private $apiUrl;

    public function __construct()
    {
        $this->apiKey = env('DEEPSEEK_API_KEY');
        $this->apiUrl = env('DEEPSEEK_API_URL', 'https://api.deepseek.com/v1/chat/completions');
        
        if (empty($this->apiKey)) {
            throw new \Exception('DEEPSEEK_API_KEY tidak ditemukan di .env');
        }
    }

    /**
     * Send message to DeepSeek API
     * 
     * @param string $message
     * @return string
     */
    public function sendMessage($message)
    {
        try {
            $client = new Client();

            $response = $client->post($this->apiUrl, [
                'headers' => [
                    'Content-Type'  => 'application/json',
                    'Authorization' => 'Bearer ' . $this->apiKey,
                ],
                'json' => [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are AIRA, a helpful assistant for Dinas PU Sumber Daya Air Provinsi Jawa Timur. Answer in Bahasa Indonesia.'
                        ],
                        [
                            'role' => 'user',
                            'content' => $message
                        ]
                    ]
                ]
            ]);

            // $response = Http::withHeaders([
            //     'Content-Type' => 'application/json',
            //     'Authorization' => 'Bearer ' . $this->apiKey,
            // ])->post($this->apiUrl, [
            //     'model' => 'deepseek-chat',
            //     'messages' => [
            //         [
            //             'role' => 'system',
            //             'content' => 'You are AIRA, a helpful assistant for Dinas PU Sumber Daya Air Provinsi Jawa Timur. Answer in Bahasa Indonesia.'
            //         ],
            //         [
            //             'role' => 'user',
            //             'content' => $message
            //         ]
            //     ]
            // ]);

            $status = $response->getStatusCode();
            $body = $response->getBody()->getContents();
            $data = json_decode($body, true);

            if ($status >= 200 && $status < 300) {
                return $data['choices'][0]['message']['content'] ?? 'Tidak ada jawaban dari API.';
            } else {
                return 'Gagal menghubungi API (status: ' . $status . ')';
            }
            
        } catch (\Exception $e) {
            return 'Terjadi kesalahan: ' . $e->getMessage();
        }
    }
}
