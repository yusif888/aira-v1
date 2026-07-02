<?php

namespace App\Services;

class SearchEngine
{
    /**
     * @var KamusService
     */
    protected $kamusService;

    /**
     * @var WebsiteKnowledgeService
     */
    protected $websiteKnowledgeService;

    public function __construct(
        KamusService $kamusService,
        WebsiteKnowledgeService $websiteKnowledgeService
    ) {
        $this->kamusService = $kamusService;
        $this->websiteKnowledgeService = $websiteKnowledgeService;
    }

    /**
     * Cari jawaban terbaik dari seluruh knowledge source.
     *
     * @param string $query
     * @return SearchResult
     */
    public function search($query)
    {
        $results = [];

        // Kamus
        $results[] = $this->kamusService->search($query);

        // Website Knowledge
        $results[] = $this->websiteKnowledgeService->search($query);

        // Ambil hanya yang menemukan jawaban
        $results = array_filter($results, function ($result) {
            return $result->found();
        });

        if (empty($results)) {
            return SearchResult::empty();
        }

        return $this->getBestResult($results);
    }

    private function getBestResult(array $results)
    {
        usort($results, function ($a, $b) {

            if ($a->score == $b->score) {
                return 0;
            }

            return ($a->score < $b->score) ? 1 : -1;
        });

        return $results[0];
    }
}