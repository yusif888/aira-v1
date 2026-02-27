<?php
// Simple script to list entries from website_knowledge table
$dbPath = __DIR__ . '/../database/database.sqlite';
if (!file_exists($dbPath)) {
    echo "ERROR: database file not found at $dbPath\n";
    exit(1);
}
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $pdo->query("SELECT id, title, source_type, url, created_at FROM website_knowledge ORDER BY id DESC LIMIT 200");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!$rows) {
        echo "No entries found in website_knowledge.\n";
        exit(0);
    }
    foreach ($rows as $r) {
        echo sprintf("[%d] (%s) %s - %s\n", $r['id'], $r['source_type'], $r['title'], $r['url'] ?? '-');
    }
    echo "\nTotal: " . count($rows) . " entries shown.\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
