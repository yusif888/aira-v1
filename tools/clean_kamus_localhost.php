<?php
$kamusPath = __DIR__ . '/../public/assets/kamus.json';
if (!file_exists($kamusPath)) {
    echo "ERROR: kamus.json not found at $kamusPath\n";
    exit(1);
}
$kamusJson = file_get_contents($kamusPath);
$kamus = json_decode($kamusJson, true);
if (!is_array($kamus)) {
    echo "ERROR: kamus.json is not a valid JSON array.\n";
    exit(1);
}
$changed = 0;
foreach ($kamus as &$entry) {
    if (isset($entry['jawaban']) && is_string($entry['jawaban'])) {
        $old = $entry['jawaban'];
        // Remove lines that start with 'Sumber: http://localhost' or 'Sumber: https://localhost' (and any trailing path)
        $new = preg_replace('/\n\s*Sumber:\s*https?:\/\/localhost[^\n]*/i', '', $old);
        if ($new !== $old) {
            $entry['jawaban'] = trim($new);
            $changed++;
        }
    }
}
if ($changed > 0) {
    $newJson = json_encode($kamus, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($kamusPath, $newJson);
}
echo "Done. Cleaned $changed entries.\n";