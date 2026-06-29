<?php

namespace App\Services;

class KamusService
{
    private $kamusData = [];
    private $minimumScore = 0.34;
    private $stopWords = [
        'apa', 'apakah', 'adalah', 'ada', 'akan', 'atau', 'dan', 'di', 'dari',
        'yang', 'ke', 'untuk', 'pada', 'oleh', 'dengan', 'ini', 'itu',
        'tersebut', 'dapat', 'sudah', 'telah', 'juga', 'kamu', 'anda', 'saya',
        'kami', 'kita', 'mereka', 'nya', 'mu', 'ku', 'saja', 'lagi', 'pula',
        'bagaimana', 'gimana', 'siapa', 'dimana', 'di mana', 'kapan',
        'mengapa', 'kenapa', 'berapa', 'mana', 'tentang', 'mengenai',
        'jelaskan', 'ceritakan', 'tolong', 'mohon', 'dong', 'ya', 'nih',
        'kah', 'bisa', 'mau', 'ingin', 'langsung', 'kesana', 'sana',
        'dinas', 'pusda', 'dispuair', 'pu', 'sda', 'jatim', 'jawa', 'timur'
    ];

    private $synonymGroups = [
        ['alamat', 'lokasi', 'letak', 'tempat', 'kantor', 'kantornya', 'posisi'],
        ['jam', 'waktu', 'pukul', 'operasional', 'buka', 'tutup', 'layanan', 'pagi', 'siang', 'sore', 'malam'],
        ['telepon', 'telp', 'telfon', 'nomor', 'nomer', 'no', 'hp', 'wa', 'whatsapp'],
        ['email', 'surel', 'mail'],
        ['website', 'web', 'situs', 'laman'],
        ['pengaduan', 'lapor', 'keluhan', 'aduan', 'komplain'],
        ['magang', 'pkl', 'internship', 'praktik', 'kerja', 'lapangan'],
        ['data', 'hidrologi', 'curah', 'hujan', 'debit', 'sungai', 'kualitas', 'air'],
        ['kepala', 'kadis', 'pimpinan'],
        ['sekretaris', 'sekdin'],
        ['terima', 'makasih', 'thanks', 'thank', 'nuwun'],
    ];
    private $synonymMap = [];

    public function __construct()
    {
        $this->buildSynonymMap();
        $this->loadKamus();
    }

    /**
     * Load kamus dari file JSON
     */
    private function loadKamus()
    {
        $kamusPath = public_path('assets/kamus.json');
        
        if (file_exists($kamusPath)) {
            $jsonContent = file_get_contents($kamusPath);
            $decoded = json_decode($jsonContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                // If JSON invalid, fallback to empty array and log the error to laravel log
                logger()->error('KamusService: invalid kamus.json - ' . json_last_error_msg());
                $this->kamusData = [];
            } else {
                $this->kamusData = $decoded;
            }
        }
    }

    /**
     * Cari jawaban berdasarkan pertanyaan user
     * 
     * @param string $pertanyaan
     * @return string|null
     */
    public function getJawaban($pertanyaan)
    {
        $result = $this->getBestMatch($pertanyaan);

        return $result ? $result['jawaban'] : null;
    }

    /**
     * Cari FAQ paling relevan memakai scoring lokal tanpa AI/API eksternal.
     *
     * @param string $pertanyaan
     * @return array|null
     */
    public function getBestMatch($pertanyaan)
    {
        $query = $this->prepareText($pertanyaan);
        $bestMatch = null;

        if ($query['normalized'] === '') {
            return null;
        }

        foreach ($this->kamusData as $index => $entry) {
            $questions = isset($entry['pertanyaan']) && is_array($entry['pertanyaan'])
                ? $entry['pertanyaan']
                : [];

            foreach ($questions as $question) {
                $candidate = $this->prepareText($question);
                $score = $this->calculateScore($query, $candidate);

                if ($bestMatch === null || $score > $bestMatch['score']) {
                    $bestMatch = [
                        'jawaban' => $this->normalizeAnswer($entry['jawaban']),
                        'score' => $score,
                        'matched_question' => $question,
                        'entry_index' => $index,
                    ];
                }
            }
        }

        if ($bestMatch === null || $bestMatch['score'] < $this->minimumScore) {
            return null;
        }

        return $bestMatch;
    }

    /**
     * Get all kamus data
     * 
     * @return array
     */
    public function getAllKamus()
    {
        return $this->kamusData;
    }

    private function buildSynonymMap()
    {
        foreach ($this->synonymGroups as $group) {
            $canonical = $group[0];
            foreach ($group as $word) {
                $this->synonymMap[$word] = $canonical;
            }
        }
    }

    private function prepareText($text)
    {
        $normalized = $this->normalizeText($text);
        $tokens = $this->tokenize($normalized);
        $expandedTokens = $this->expandTokens($tokens);

        return [
            'normalized' => $normalized,
            'tokens' => $tokens,
            'expanded_tokens' => $expandedTokens,
        ];
    }

    private function normalizeText($text)
    {
        $text = strtolower((string) $text);
        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    private function tokenize($text)
    {
        if ($text === '') {
            return [];
        }

        $rawTokens = preg_split('/\s+/', $text);
        $tokens = [];

        foreach ($rawTokens as $token) {
            $token = $this->normalizeToken($token);

            if (strlen($token) < 2 || in_array($token, $this->stopWords)) {
                continue;
            }

            $tokens[] = $token;
        }

        return array_values(array_unique($tokens));
    }

    private function normalizeToken($token)
    {
        $token = trim($token);

        if (strlen($token) > 4 && substr($token, -3) === 'nya') {
            $token = substr($token, 0, -3);
        }

        if (strlen($token) > 5 && substr($token, -3) === 'kan') {
            $token = substr($token, 0, -3);
        }

        if (strlen($token) > 5 && substr($token, -1) === 'i') {
            $token = substr($token, 0, -1);
        }

        return $token;
    }

    private function expandTokens(array $tokens)
    {
        $expanded = [];

        foreach ($tokens as $token) {
            $expanded[] = isset($this->synonymMap[$token])
                ? $this->synonymMap[$token]
                : $token;
        }

        return array_values(array_unique($expanded));
    }

    private function calculateScore(array $query, array $candidate)
    {
        if ($candidate['normalized'] === '') {
            return 0;
        }

        if ($query['normalized'] === $candidate['normalized']) {
            return 1.0;
        }

        $phraseScore = $this->calculatePhraseScore(
            $query['normalized'],
            $candidate['normalized'],
            count($candidate['tokens'])
        );

        $tokenScore = $this->calculateTokenScore(
            $query['expanded_tokens'],
            $candidate['expanded_tokens']
        );

        $fuzzyScore = $this->calculateFuzzyScore(
            $query['tokens'],
            $candidate['tokens']
        );

        return max($phraseScore, ($tokenScore * 0.75) + ($fuzzyScore * 0.25));
    }

    private function calculatePhraseScore($queryText, $candidateText, $candidateTokenCount)
    {
        $score = 0;

        if (strpos($queryText, $candidateText) !== false) {
            $score = $candidateTokenCount <= 1 ? 0.72 : 0.92;
        } elseif (strpos($candidateText, $queryText) !== false) {
            $score = 0.82;
        }

        return $score;
    }

    private function calculateTokenScore(array $queryTokens, array $candidateTokens)
    {
        if (empty($queryTokens) || empty($candidateTokens)) {
            return 0;
        }

        $intersection = array_intersect($queryTokens, $candidateTokens);
        $intersectionCount = count($intersection);

        if ($intersectionCount === 0) {
            return 0;
        }

        $dice = (2 * $intersectionCount) / (count($queryTokens) + count($candidateTokens));
        $queryCoverage = $intersectionCount / count($queryTokens);
        $candidateCoverage = $intersectionCount / count($candidateTokens);

        return ($dice * 0.45) + ($queryCoverage * 0.25) + ($candidateCoverage * 0.30);
    }

    private function calculateFuzzyScore(array $queryTokens, array $candidateTokens)
    {
        if (empty($queryTokens) || empty($candidateTokens)) {
            return 0;
        }

        $matches = 0;

        foreach ($candidateTokens as $candidateToken) {
            foreach ($queryTokens as $queryToken) {
                if ($this->isSimilarToken($queryToken, $candidateToken)) {
                    $matches++;
                    break;
                }
            }
        }

        return $matches / count($candidateTokens);
    }

    private function isSimilarToken($first, $second)
    {
        if ($first === $second) {
            return true;
        }

        $minLength = min(strlen($first), strlen($second));

        if ($minLength < 5) {
            return false;
        }

        $distance = levenshtein($first, $second);

        return $distance <= ($minLength >= 8 ? 2 : 1);
    }

    private function normalizeAnswer($answer)
    {
        if (is_array($answer)) {
            return implode("\n", $answer);
        }

        return (string) $answer;
    }
}
