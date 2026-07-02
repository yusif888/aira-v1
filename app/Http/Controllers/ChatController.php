<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\ChatLearningData;
use App\Services\SearchEngine;
use App\Services\IrigasiService;
// use App\Services\DeepSeekService; // DINONAKTIFKAN - Fokus pada kamus dan website knowledge
// use Illuminate\Support\Facades\RateLimiter; // Not available in L5.8 as Facade

class ChatController extends Controller
{
    //bawah ini jangan
    protected $searchEngine;
    protected $irigasiService;

    // protected $deepSeekService; // DINONAKTIFKAN

    public function __construct(SearchEngine $searchEngine, IrigasiService $irigasiService)
    {
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
        
        $this->searchEngine = $searchEngine;
        $this->irigasiService = $irigasiService;
        // $this->deepSeekService = $deepSeekService; // DINONAKTIFKAN
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

            // Simpan pesan user
            Chat::create([
                'session_id' => $sessionId,
                'sender' => 'user',
                'message' => $userMessage,
                'source' => 'user'
            ]);

            // PRIORITAS
            // 1. Data Irigasi
            // 2. SearchEngine (Kamus + Website)
            // 3. Default
            
            $botResponse = null;
            $source = null;
            $sourceInfo = null; // Inisialisasi variabel sourceInfo untuk menghindari error undefined variable
            // 1. Cek Data Irigasi Spesifik (Bendung/Intake)
            $result = $this->irigasiService->search($userMessage);

            if ($result->found()) {
                $botResponse = $result->answer;
                $source = $result->source;
                $sourceInfo = $result->sourceInfo;
            }


            if ($botResponse === null) {

                $result = $this->searchEngine->search($userMessage);

                if ($result->found()) {

                    $botResponse = $result->answer;

                    $source = $result->source;

                    $sourceInfo = $result->sourceInfo;
                }

            }

            // 5. Jika tidak ada di mana-mana, berikan pesan default
            if ($botResponse === null) {
                $botResponse = "Untuk informasi lebih lanjut, silakan hubungi DISPUAIR melalui:\n\nEmail:\ninfo@pusda-jatim.go.id\nInstagram: @dpuairjatim\nTikTok: @dpuairjatim";
                $source = 'default';
            }

            // Simpan response bot
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
        
        // Ambil semua chat untuk session ini
        $chats = Chat::where('session_id', $sessionId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Jika ada chat, simpan ke learning data
        if ($chats->count() > 0) {
            $conversation = $chats->map(function($chat) {
                return [
                    'sender' => $chat->sender,
                    'message' => $chat->message,
                    'source' => $chat->source ?? null,
                    'timestamp' => $chat->created_at->toISOString(),
                ];
            })->toArray();

            // Simpan ke learning data
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

        // Hapus chat history
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
        // Tidak ada operasi database, hanya response untuk frontend
        return response()->json([
            'success' => true,
            'message' => 'Chat minimized'
        ]);
    }
}

