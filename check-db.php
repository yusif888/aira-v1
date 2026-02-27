<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "\n📋 KNOWLEDGE BASE CONTENTS:\n\n";

$entries = DB::table('website_knowledge')->select('id', 'title', 'keywords')->get();

echo "Total: " . $entries->count() . " entries\n\n";

foreach ($entries as $entry) {
    echo "{$entry->id}. {$entry->title}\n";
    $keywords = json_decode($entry->keywords, true);
    echo "   Keywords: " . implode(', ', array_slice($keywords ?? [], 0, 5)) . "\n\n";
}
