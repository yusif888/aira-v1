#!/usr/bin/env php
<?php

/**
 * Quick Test AIRA Response
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\KamusService;
use App\Services\WebsiteKnowledgeService;

$kamusService = new KamusService();
$knowledgeService = new WebsiteKnowledgeService();

$testQueries = [
    "Apa itu dinas PU SDA?",
    "Struktur organisasi",
    "Waduk di Jatim",
    "Siapa kamu?"
];

echo "\n╔══════════════════════════════════════════════════════════════╗\n";
echo "║        QUICK TEST AIRA - Format Bersih                       ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n\n";

foreach ($testQueries as $query) {
    echo "❓ {$query}\n";
    echo str_repeat("─", 62) . "\n";
    
    // Simulate ChatController
    $response = $kamusService->getJawaban($query);
    $source = '📖 Kamus';
    
    if (!$response) {
        $knowledgeResult = $knowledgeService->getJawaban($query);
        if ($knowledgeResult) {
            $response = $knowledgeResult['jawaban'];
            $source = '🌐 Website';
        }
    }
    
    if (!$response) {
        $response = 'Maaf, belum ada informasi tentang pertanyaan ini.';
        $source = '⚠️  Default';
    }
    
    echo "💬 " . wordwrap($response, 58) . "\n";
    echo "   [{$source}]\n\n";
}

echo "✅ Test selesai! Response lebih bersih tanpa 'Sumber' dan 'Selengkapnya'\n\n";
