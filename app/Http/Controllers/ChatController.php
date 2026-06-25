<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\ChatLearningData;
use App\Services\KamusService;
use App\Services\WebsiteKnowledgeService;
use App\Models\IrigasiData; // Added IrigasiData model
// use App\Services\DeepSeekService; // DINONAKTIFKAN - Fokus pada kamus dan website knowledge
// use Illuminate\Support\Facades\RateLimiter; // Not available in L5.8 as Facade
use Illuminate\Support\Str;

class ChatController extends Controller
{
    protected $kamusService;
    protected $websiteKnowledgeService;
    // protected $deepSeekService; // DINONAKTIFKAN

    public function __construct(KamusService $kamusService, WebsiteKnowledgeService $websiteKnowledgeService)
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
        
        $this->kamusService = $kamusService;
        $this->websiteKnowledgeService = $websiteKnowledgeService;
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

            // PRIORITAS PENCARIAN JAWABAN:
            // 1. Kamus (JSON) - Jawaban manual yang sudah didefinisikan
            // 2. Website Knowledge - Konten dari dpuair_sisda
            // 3. Default message - Jika tidak ada di mana-mana
            
            $botResponse = null;
            $source = null;
            $sourceInfo = null; // Inisialisasi variabel sourceInfo untuk menghindari error undefined variable
            // 1. Cek Data Irigasi Spesifik (Bendung/Intake)
            if (stripos($userMessage, 'bendung') !== false || stripos($userMessage, 'irigasi') !== false || stripos($userMessage, 'intake') !== false) {
                 // Ekstrak nama bendung (Sederhana: ambil kata setelah "bendung" atau cari match di database)
                 // Untuk MVP, kita iterasi semua bendung di DB dan cek mana yang disebut user
                 $allIrigasi = IrigasiData::select('daerah_irigasi')->get();
                 foreach($allIrigasi as $irigasi) {
                     if (stripos($userMessage, $irigasi->daerah_irigasi) !== false) {
                         try {
                            // Found match
                            $data = IrigasiData::where('daerah_irigasi', $irigasi->daerah_irigasi)->first();
                            
                            if (!$data) {
                                $botResponse = "Data untuk bendung " . $irigasi->daerah_irigasi . " tidak ditemukan di database detail.";
                                break;
                            }

                            $num = function($val) {
                                return number_format((float)$val, 2, ',', '.');
                            };
                            
                            // Deteksi Quarter (TW) tertentu
                            $targetTw = null;
                            if (preg_match('/TW\s*(\d)/i', $userMessage, $matches)) {
                                $targetTw = (int)$matches[1];
                            }

                            // Format Judul
                            // Format Output String
                            $linesInfo = [];
                            $linesInfo[] = "Nama Bendung : " . $data->daerah_irigasi;
                            $linesInfo[] = "Kewenangan : " . $data->upt_name;
                            
                            $headerStr = implode("\n", $linesInfo) . "\n\n";

                            // Logic Tampilan Per TW atau Semua
                            $sections = [];

                            // Jika user tanya spesifik keandalan/persentase
                            $isKeandalan = stripos($userMessage, 'keandalan') !== false || stripos($userMessage, 'persentase') !== false;
                            $isKebutuhan = stripos($userMessage, 'kebutuhan') !== false;
                            $isIntake = stripos($userMessage, 'intake') !== false;
                            
                            // Jika tidak ada spesifik, tampilkan semua (Default)
                            if (!$isKeandalan && !$isKebutuhan && !$isIntake) {
                                $isKeandalan = $isKebutuhan = $isIntake = true;
                            }

                            // Section Intake
                            if ($isIntake) {
                                $lines = [];
                                if ($targetTw) {
                                    $val = $data->{"debit_intake_tw{$targetTw}"};
                                    $lines[] = "- TW {$targetTw}: " . $num($val);
                                } else {
                                    for($i=1; $i<=4; $i++) $lines[] = "- TW {$i}: " . $num($data->{"debit_intake_tw{$i}"});
                                }
                                $sections[] = "Debit Intake (Lt/dt):\n" . implode("\n", $lines);
                            }

                            // Section Kebutuhan
                            if ($isKebutuhan) {
                                $lines = [];
                                if ($targetTw) {
                                    $val = $data->{"debit_kebutuhan_tw{$targetTw}"};
                                    $lines[] = "- TW {$targetTw}: " . $num($val);
                                } else {
                                    for($i=1; $i<=4; $i++) $lines[] = "- TW {$i}: " . $num($data->{"debit_kebutuhan_tw{$i}"});
                                }
                                $sections[] = "Debit Kebutuhan (Lt/dt):\n" . implode("\n", $lines);
                            }

                            // Section Keandalan
                            if ($isKeandalan) {
                                $lines = [];
                                if ($targetTw) {
                                    $val = $data->{"keandalan_tw{$targetTw}"};
                                    $lines[] = "- TW {$targetTw}: " . $num($val) . "%";
                                } else {
                                    for($i=1; $i<=4; $i++) $lines[] = "- TW {$i}: " . $num($data->{"keandalan_tw{$i}"}) . "%";
                                }
                                $sections[] = "Persentase Keandalan (%):\n" . implode("\n", $lines);
                            }

                            $sectionsStr = "";
                            if (!empty($sections)) {
                                $sectionsStr = implode("\n\n", $sections) . "\n\n";
                            }

                            // Kesimpulan
                            $conclusions = [];
                            $tws = $targetTw ? [$targetTw] : [1,2,3,4];
                            
                            foreach($tws as $tw) {
                                $val = $data->{"keandalan_tw{$tw}"};
                                $status = ($val >= 80) ? "terpenuhi" : "tidak terpenuhi";
                                $conclusions[] = "- Pada TW {$tw} persentase keandalan sebesar " . $num($val) . "% ({$status})";
                            }
                            
                            $footerStr = "Kesimpulan :\n" . implode("\n", $conclusions);
                            
                            $botResponse = $headerStr . $sectionsStr . $footerStr;
                            
                            $source = 'irigasi_database';
                            break;
                         } catch (\Exception $ex) {
                            \Illuminate\Support\Facades\Log::error("Irigasi Query Error: " . $ex->getMessage());
                            $botResponse = "Maaf, terjadi kesalahan saat mengambil data irigasi.";
                             break;
                         }
                     }
                 }
            }

            // 2. Cek di kamus terlebih dahulu (jika belum ketemu)
            if ($botResponse === null) {
                $botResponse = $this->kamusService->getJawaban($userMessage);
                if ($botResponse !== null) {
                    $source = 'kamus';
                }
            }

            // 2. Jika tidak ada di kamus, cari di website knowledge base
            if ($botResponse === null) {
                $knowledgeResult = $this->websiteKnowledgeService->getJawaban($userMessage);
                if ($knowledgeResult !== null) {
                    $botResponse = $knowledgeResult['jawaban'];
                    $source = $knowledgeResult['source'];
                    $sourceInfo = $knowledgeResult['source_info'];
                }
            }

            // 3. Jika tidak ada di mana-mana, berikan pesan default
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

