<?php

namespace App\Services;

use App\Services\SearchResult;
use App\Services\Search\SearchHelper;
use App\Services\Search\StopWordDictionary;
use App\Services\Search\SynonymDirectory;

class KamusService
{
    protected $searchHelper;
    private $kamusData = [];
    private $minimumScore = 0.55;
    private $stopWords;
    private $synonymMap;

    public function __construct(SearchHelper $searchHelper)
    {
        $this->loadKamus();
        $this->searchHelper = $searchHelper;
        $this->stopWords = StopWordDictionary::getWords();
        $this->synonymMap = SynonymDirectory::getMap();
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
        $result = $this->search($pertanyaan);

        return $result->found()
            ? $result->answer
            : null;
    }

    public function search($pertanyaan)
    {
        $bestMatch = $this->getBestMatch($pertanyaan);
    
        if ($bestMatch === null) {
            return SearchResult::empty();
        }
    
        return SearchResult::success(
            $bestMatch['score'],
            'kamus',
            $bestMatch['jawaban'],
            [
                'matched_question' => $bestMatch['matched_question'],
                'entry_index' => $bestMatch['entry_index'],
            ]
        );
    }

    /**
     * Cari FAQ paling relevan memakai scoring lokal tanpa AI/API eksternal.
     *
     * @param string $pertanyaan
     * @return array|null
     */
    public function getBestMatch($pertanyaan)
    {
        $query = $this->searchHelper->prepareText($pertanyaan, $this->stopWords, $this->synonymMap);
        $bestMatch = null;

        if ($query['normalized'] === '') {
            return null;
        }

        foreach ($this->kamusData as $index => $entry) {
            $questions = isset($entry['pertanyaan']) && is_array($entry['pertanyaan'])
                ? $entry['pertanyaan']
                : [];

            foreach ($questions as $question) {
                $candidate = $this->searchHelper->prepareText($question, $this->stopWords, $this->synonymMap);
                $score = $this->searchHelper->calculateScore($query, $candidate);

                \Log::info('KAMUS SCORE', [
                    'question' => $question,
                    'score' => $score,
                ]);

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

    private function normalizeAnswer($answer)
    {
        if (is_array($answer)) {
            return implode("\n", $answer);
        }

        return (string) $answer;
    }
}
