<?php
// Merge website_knowledge entries into public/assets/kamus.json as kamus entries
$dbPath = __DIR__ . '/../database/database.sqlite';
$kamusPath = __DIR__ . '/../public/assets/kamus.json';
if (!file_exists($dbPath)) {
    echo "ERROR: database file not found at $dbPath\n";
    exit(1);
}
if (!file_exists($kamusPath)) {
    echo "ERROR: kamus.json not found at $kamusPath\n";
    exit(1);
}
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $pdo->query("SELECT id, title, source_type, url, content FROM website_knowledge ORDER BY id ASC");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!$rows) {
        echo "No website_knowledge rows found.\n";
        exit(0);
    }
    $kamusJson = file_get_contents($kamusPath);
    $kamus = json_decode($kamusJson, true);
    if (!is_array($kamus)) {
        echo "ERROR: kamus.json is not a valid JSON array.\n";
        exit(1);
    }
    $existingSignatures = [];
    foreach ($kamus as $entry) {
        if (isset($entry['pertanyaan']) && is_array($entry['pertanyaan'])) {
            foreach ($entry['pertanyaan'] as $q) {
                $existingSignatures[strtolower(trim($q))] = true;
            }
        }
    }
    $added = 0;
    foreach ($rows as $r) {
        $title = trim($r['title'] ?? '');
        $url = $r['url'] ?? '';
        $content = $r['content'] ?? '';
        // create question variants
        $questions = [];
        if ($title !== '') {
            $questions[] = $title;
            $questions[] = strtolower($title);
            $questions[] = 'tentang ' . $title;
            $questions[] = 'apa itu ' . strtolower($title);
        }
        // extract path from URL
        if ($url) {
            $path = parse_url($url, PHP_URL_PATH) ?: $url;
            $path = trim($path, "/ ");
            if ($path) {
                $questions[] = $path;
                $parts = explode('/', $path);
                foreach ($parts as $p) {
                    if ($p && strlen($p) > 3) $questions[] = $p;
                }
            }
        }
        // normalize questions
        $questions = array_values(array_unique(array_filter(array_map('trim', $questions))));
        // skip if any question already exists
        $skip = false;
        foreach ($questions as $q) {
            if (isset($existingSignatures[strtolower($q)])) {
                $skip = true; break;
            }
        }
        if ($skip) continue;
        // prepare answer: strip tags and limit
        $answer = strip_tags($content);
        $answer = trim($answer);
        if ($answer === '') {
            $answer = $title;
        }
        if (strlen($answer) > 800) $answer = substr($answer, 0, 800) . '...';
        // Only append source if URL is external (not localhost) and has a host
        $appendSource = false;
        if ($url) {
            $host = @parse_url($url, PHP_URL_HOST);
            if ($host && strtolower($host) !== 'localhost') {
                $appendSource = true;
            }
        }
        if ($appendSource) {
            $answer .= "\n\nSumber: " . $url;
        }
        $newEntry = [
            'pertanyaan' => $questions,
            'jawaban' => $answer
        ];
        $kamus[] = $newEntry;
        // register signatures
        foreach ($questions as $q) $existingSignatures[strtolower($q)] = true;
        $added++;
    }
    if ($added > 0) {
        // write back pretty JSON
        $newJson = json_encode($kamus, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        file_put_contents($kamusPath, $newJson);
    }
    echo "Done. Added: $added entries to kamus.json\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
