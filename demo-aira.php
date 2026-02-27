#!/usr/bin/env php
<?php

/**
 * Demo AIRA - Test Pertanyaan yang Bisa Dijawab
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\KamusService;
use App\Services\WebsiteKnowledgeService;

echo "\n";
echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║        DEMO AIRA - Pertanyaan yang Bisa Dijawab             ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n";
echo "\n";

$kamusService = new KamusService();
$knowledgeService = new WebsiteKnowledgeService();

$demoQueries = [
    ["kategori" => "Organisasi", "pertanyaan" => "Apa itu Dinas PU SDA Jatim?"],
    ["kategori" => "Visi Misi", "pertanyaan" => "Apa visi misi dinas?"],
    ["kategori" => "Struktur", "pertanyaan" => "Bagaimana struktur organisasi dinas?"],
    ["kategori" => "Sekretariat", "pertanyaan" => "Tugas sekretariat apa saja?"],
    ["kategori" => "Operasional", "pertanyaan" => "Jam kerja dinas berapa?"],
    ["kategori" => "Kontak", "pertanyaan" => "Bagaimana cara menghubungi dinas?"],
    ["kategori" => "Layanan", "pertanyaan" => "Layanan apa yang disediakan?"],
    ["kategori" => "Program", "pertanyaan" => "Program prioritas dinas apa?"],
    ["kategori" => "Irigasi", "pertanyaan" => "Berapa luas irigasi Jawa Timur?"],
    ["kategori" => "Waduk", "pertanyaan" => "Waduk apa saja di Jatim?"],
    ["kategori" => "AIRA", "pertanyaan" => "Apa itu AIRA?"],
];

foreach ($demoQueries as $index => $query) {
    $num = $index + 1;
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "📌 Test #{$num}: {$query['kategori']}\n";
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    echo "❓ Pertanyaan: \"{$query['pertanyaan']}\"\n\n";
    
    // Simulate ChatController flow
    $response = $kamusService->getJawaban($query['pertanyaan']);
    $source = 'kamus';
    
    if (!$response) {
        $knowledgeResult = $knowledgeService->getJawaban($query['pertanyaan']);
        if ($knowledgeResult) {
            $response = $knowledgeResult['jawaban'];
            $source = $knowledgeResult['source'];
        }
    }
    
    if (!$response) {
        $response = '❌ Maaf, belum ada informasi tentang pertanyaan ini.';
        $source = 'default';
    }
    
    // Format output
    $sourceEmoji = [
        'kamus' => '📖',
        'website_exact' => '🌐',
        'website_keyword' => '🔍',
        'website_fulltext' => '🔎',
        'default' => '⚠️'
    ];
    
    $sourceLabel = $sourceEmoji[$source] ?? '❓';
    
    echo "💬 Jawaban AIRA:\n";
    echo str_repeat("─", 62) . "\n";
    
    // Limit response untuk display
    $displayResponse = strlen($response) > 300 
        ? substr($response, 0, 300) . "...\n\n[Response dipotong untuk tampilan. Lihat full di browser]" 
        : $response;
    
    echo wordwrap($displayResponse, 60) . "\n";
    echo str_repeat("─", 62) . "\n";
    echo "{$sourceLabel} Sumber: " . strtoupper($source) . "\n\n";
    
    // Delay untuk readability
    usleep(500000); // 0.5 detik
}

echo "\n";
echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║        DEMO SELESAI                                          ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n";
echo "\n";

echo "📊 Ringkasan:\n";
echo "   - Total Pertanyaan: " . count($demoQueries) . "\n";
echo "   - Kategori: 11 (Organisasi, Visi, Struktur, dll)\n";
echo "\n";

echo "🌐 Test via Browser:\n";
echo "   1. Buka: http://localhost:8001\n";
echo "   2. Ketik pertanyaan dari list di atas\n";
echo "   3. Lihat response lengkap dari AIRA\n";
echo "\n";

echo "📝 Tambah Konten:\n";
echo "   - Isi database dpuair_sisda dengan berita/dokumen\n";
echo "   - Jalankan: php artisan aira:index-website --fresh\n";
echo "   - AIRA akan semakin pintar!\n";
echo "\n";
