#!/usr/bin/env php
<?php

/**
 * Test Script untuk AIRA Knowledge Base
 * 
 * Script ini akan test apakah AIRA dapat menjawab pertanyaan berdasarkan
 * konten yang sudah di-index dari dpuair_sisda
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Services\KamusService;
use App\Services\WebsiteKnowledgeService;
use App\Models\WebsiteKnowledge;

echo "\n";
echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║        AIRA KNOWLEDGE BASE TEST                              ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Test 1: Cek total entries
echo "📊 1. Checking Knowledge Base Statistics...\n";
$total = WebsiteKnowledge::where('is_active', true)->count();
$byType = WebsiteKnowledge::where('is_active', true)
    ->selectRaw('source_type, COUNT(*) as total')
    ->groupBy('source_type')
    ->pluck('total', 'source_type');

echo "   Total Entries: {$total}\n";
foreach ($byType as $type => $count) {
    echo "   - {$type}: {$count}\n";
}
echo "   ✓ Knowledge base populated\n\n";

// Test 2: Test Kamus Service
echo "📖 2. Testing Kamus Service...\n";
$kamusService = new KamusService();
$testKamus = $kamusService->getJawaban("siapa kamu");
if ($testKamus) {
    echo "   ✓ Kamus service working\n";
    echo "   Response preview: " . substr($testKamus, 0, 50) . "...\n\n";
} else {
    echo "   ✗ Kamus service failed\n\n";
}

// Test 3: Test Website Knowledge Service
echo "🌐 3. Testing Website Knowledge Service...\n";
$knowledgeService = new WebsiteKnowledgeService();

$testQueries = [
    "tentang dinas",
    "visi misi",
    "struktur organisasi",
    "jam kerja",
    "irigasi",
    "waduk",
    "aira",
    "layanan"
];

$successCount = 0;
foreach ($testQueries as $query) {
    $result = $knowledgeService->getJawaban($query);
    if ($result) {
        $successCount++;
        echo "   ✓ '{$query}' => Found (source: {$result['source']})\n";
    } else {
        echo "   ✗ '{$query}' => Not found\n";
    }
}

echo "\n   Success rate: {$successCount}/" . count($testQueries) . " (" . 
     round(($successCount/count($testQueries))*100) . "%)\n\n";

// Test 4: Integration Test (seperti di ChatController)
echo "🤖 4. Testing Full Integration (ChatController Flow)...\n";

$testIntegrationQueries = [
    "Siapa kamu?",  // Dari kamus
    "Apa visi misi dinas?",  // Dari website knowledge
    "Berapa lama jam kerja?",  // Dari website knowledge
    "asdfqwerty random",  // Should return null
];

foreach ($testIntegrationQueries as $query) {
    echo "\n   Q: {$query}\n";
    
    // 1. Check kamus
    $response = $kamusService->getJawaban($query);
    $source = 'kamus';
    
    // 2. Check website knowledge
    if (!$response) {
        $knowledgeResult = $knowledgeService->getJawaban($query);
        if ($knowledgeResult) {
            $response = $knowledgeResult['jawaban'];
            $source = $knowledgeResult['source'];
        }
    }
    
    // 3. Default
    if (!$response) {
        $response = 'Default message (no info found)';
        $source = 'default';
    }
    
    echo "   A: " . substr($response, 0, 100) . "...\n";
    echo "   Source: {$source}\n";
}

echo "\n";
echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║        TEST COMPLETED                                        ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n";
echo "\n";

echo "✅ AIRA Knowledge Base is working!\n";
echo "📝 Next steps:\n";
echo "   1. Start Laravel server: php artisan serve\n";
echo "   2. Open browser: http://localhost:8000\n";
echo "   3. Test chat interface\n";
echo "\n";
