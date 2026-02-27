<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\WebsiteKnowledge;

$testQuery = "dinas pu sda";

echo "\n🔍 Testing Search for: '{$testQuery}'\n\n";

// Test 1: Exact match
echo "1. Exact Match Test:\n";
$exact = WebsiteKnowledge::active()
    ->whereRaw('LOWER(title) = ?', [strtolower($testQuery)])
    ->first();
echo $exact ? "   ✓ Found: {$exact->title}\n" : "   ✗ Not found\n";

// Test 2: Title LIKE
echo "\n2. Title LIKE Test:\n";
$titleLike = WebsiteKnowledge::active()
    ->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($testQuery) . '%'])
    ->first();
echo $titleLike ? "   ✓ Found: {$titleLike->title}\n" : "   ✗ Not found\n";

// Test 3: Keywords JSON search (SQLite style)
echo "\n3. Keywords JSON Test:\n";
$keywordSearch = WebsiteKnowledge::active()
    ->whereRaw('LOWER(keywords) LIKE ?', ['%' . strtolower('dinas') . '%'])
    ->first();
echo $keywordSearch ? "   ✓ Found: {$keywordSearch->title}\n" : "   ✗ Not found\n";

// Test 4: Any word match
echo "\n4. Any Word Match Test:\n";
$words = explode(' ', strtolower($testQuery));
$anyWord = WebsiteKnowledge::active()
    ->where(function($q) use ($words) {
        foreach ($words as $word) {
            $q->orWhereRaw('LOWER(title) LIKE ?', ["%{$word}%"])
              ->orWhereRaw('LOWER(content) LIKE ?', ["%{$word}%"])
              ->orWhereRaw('LOWER(keywords) LIKE ?', ["%{$word}%"]);
        }
    })
    ->get();

echo "   Found " . $anyWord->count() . " results:\n";
foreach ($anyWord->take(3) as $result) {
    echo "   - {$result->title}\n";
}

echo "\n✅ Analysis complete!\n";
