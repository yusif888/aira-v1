<?php

namespace App\Services;

use App\Models\WebsiteKnowledge;
use Illuminate\Support\Facades\DB;
use App\Services\SearchResult;
use App\Services\Search\SearchHelper;
use App\Services\Search\StopWordDictionary;
use App\Services\Search\SynonymDirectory;

class WebsiteKnowledgeService
{
    private $minimumScore = 0.28;
    private $candidateLimit = 200;
    private $stopWords;
    private $synonymMap;
    protected $searchHelper;
    

    public function __construct(SearchHelper $searchHelper)
    {
        $this->searchHelper = $searchHelper;
        $this->stopWords = StopWordDictionary::getWords();
        $this->synonymMap = SynonymDirectory::getMap();
    }

    public function search($pertanyaan)
    {
        $query = $this->searchHelper->prepareText($pertanyaan, $this->stopWords, $this->synonymMap);

        if ($query['normalized'] === '') {
            return SearchResult::empty();
        }

        $bestMatch = $this->findBestCandidate($query);

        if ($bestMatch === null || $bestMatch['score'] < $this->minimumScore) {
            return SearchResult::empty();
        }

        $sourceInfo = $this->getSourceInfo($bestMatch['knowledge']);
        $sourceInfo['score'] = $bestMatch['score'];
        $sourceInfo['matched_field'] = $bestMatch['matched_field'];
        $sourceInfo['matched_text'] = $bestMatch['matched_text'];

        return SearchResult::success(
            $bestMatch['score'],
            'website',
            $this->formatJawaban($bestMatch['knowledge'], $query),
            $sourceInfo
        );
    }

    /**
     * Cari informasi berdasarkan pertanyaan user
     * 
     * @param string $pertanyaan
     * @return array|null [jawaban, source_info]
     */
    public function getJawaban($pertanyaan)
    {
        $result = $this->search($pertanyaan);

        if (!$result->found()) {
            return null;
        }

        return [
            'jawaban' => $result->answer,
            'source' => $result->source,
            'source_info' => $result->sourceInfo,
        ];

    }

    /**
     * Format jawaban dari knowledge base
     */
    private function formatJawaban(WebsiteKnowledge $knowledge, ?array $query = null)
    {
        $answer = $this->buildExtractiveAnswer($knowledge, $query);

        if ($answer === '') {
            $answer = $this->cleanText($knowledge->summary ?: $knowledge->content);
        }

        $answer = $this->limitText($answer, 700);
        $sourceTitle = trim((string) $knowledge->title);

        if ($sourceTitle !== '') {
            return $answer . "\n\nSumber: " . $sourceTitle;
        }

        return $answer;
    }

    /**
     * Get source info untuk tracking
     */
    private function getSourceInfo(WebsiteKnowledge $knowledge)
    {
        return [
            'id' => $knowledge->id,
            'type' => $knowledge->source_type,
            'title' => $knowledge->title,
            'url' => $knowledge->url,
        ];
    }

    /**
     * Get label untuk source type
     */
    private function getSourceTypeLabel($sourceType)
    {
        $labels = [
            'news' => 'Berita',
            'document' => 'Dokumen',
            'portal_data' => 'Portal Data',
            'page' => 'Halaman',
        ];

        return $labels[$sourceType] ?? ucfirst($sourceType);
    }

    private function findBestCandidate(array $query)
    {
        $candidates = $this->getCandidates($query);
        $bestMatch = null;

        foreach ($candidates as $knowledge) {
            $scoreData = $this->scoreKnowledge($query, $knowledge);

            if ($bestMatch === null || $scoreData['score'] > $bestMatch['score']) {
                $bestMatch = [
                    'knowledge' => $knowledge,
                    'score' => $scoreData['score'],
                    'matched_field' => $scoreData['matched_field'],
                    'matched_text' => $scoreData['matched_text'],
                ];
            }
        }

        return $bestMatch;
    }

    private function getCandidates(array $query)
    {
        $tokens = array_slice($query['expanded_tokens'], 0, 8);

        $importantTokens = $this->getImportantTokens($tokens);

        \Log::info('Important Tokens', [

            'query' => $query['normalized'],

            'tokens' => $tokens,

            'important' => $importantTokens

        ]);

        $builder = WebsiteKnowledge::active();

        if (!empty($tokens)) {
            $builder->where(function($q) use ($tokens) {
                foreach ($tokens as $token) {
                    $q->orWhereRaw('LOWER(title) LIKE ?', ["%{$token}%"])
                      ->orWhereRaw('LOWER(summary) LIKE ?', ["%{$token}%"])
                      ->orWhereRaw('LOWER(content) LIKE ?', ["%{$token}%"])
                      ->orWhereRaw('LOWER(keywords) LIKE ?', ["%{$token}%"]);
                }
            });
        } else {
            $builder->where(function($q) use ($query) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$query['normalized']}%"])
                    ->orWhereRaw('LOWER(summary) LIKE ?', ["%{$query['normalized']}%"]);
            });
        }

        $candidates = $builder
            ->latest('updated_at')
            ->limit($this->candidateLimit)
            ->get();
        
        \Log::info('Candidate List', [

            'count' => $candidates->count(),

            'titles' => $candidates->pluck('title')->toArray()

        ]);

        return $candidates;
    }

    private function getImportantTokens(array $tokens)
    {
        $ignored = [
            'kepala',
            'bidang',
            'kabid',
            'kadis',
            'sekretaris',
            'pimpinan'
        ];
    
        return array_values(
            array_diff($tokens, $ignored)
        );
    }

    private function scoreKnowledge(array $query, WebsiteKnowledge $knowledge)
    {
        $fields = [
            'title' => [
                'text' => $knowledge->title,
                'weight' => 1.0,
            ],
            'summary' => [
                'text' => $knowledge->summary,
                'weight' => 0.82,
            ],
            'keywords' => [
                'text' => $this->keywordsToText($knowledge->keywords),
                'weight' => 0.78,
            ],
            'content' => [
                'text' => substr(strip_tags((string) $knowledge->content), 0, 1800),
                'weight' => 0.55,
            ],
        ];

        $best = [
            'score' => 0,
            'matched_field' => null,
            'matched_text' => null,
        ];

        foreach ($fields as $field => $data) {
            $prepared = $this->searchHelper->prepareText($data['text'], $this->stopWords, $this->synonymMap);
            $score = $this->searchHelper->calculateScore($query, $prepared) * $data['weight'];

            if ($score > $best['score']) {
                $best = [
                    'score' => $score,
                    'matched_field' => $field,
                    'matched_text' => $this->shortenMatchedText($data['text']),
                ];
            }
        }

        return $best;
    }

    private function buildExtractiveAnswer(WebsiteKnowledge $knowledge, ?array $query = null)
    {
        if ($query === null) {
            return $this->cleanText($knowledge->summary ?: $knowledge->content);
        }

        $chunks = $this->extractAnswerChunks($knowledge);

        if (empty($chunks)) {
            return '';
        }

        $rankedChunks = [];

        foreach ($chunks as $chunk) {
            $prepared = $this->searchHelper->prepareText($chunk, $this->stopWords, $this->synonymMap);
            $score = $this->searchHelper->calculateScore($query, $prepared);

            if ($score > 0) {
                $rankedChunks[] = [
                    'text' => $chunk,
                    'score' => $score,
                ];
            }
        }

        usort($rankedChunks, function($a, $b) {
            if ($a['score'] == $b['score']) {
                return 0;
            }

            return $a['score'] < $b['score'] ? 1 : -1;
        });

        $selected = [];
        foreach ($rankedChunks as $chunk) {
            if (count($selected) >= 3) {
                break;
            }

            if ($this->isDuplicateChunk($chunk['text'], $selected)) {
                continue;
            }

            $selected[] = $chunk['text'];
        }

        if (empty($selected)) {
            $fallback = $this->cleanText($knowledge->summary ?: $knowledge->content);
            return $fallback;
        }

        $answer = implode(' ', $selected);
        $answer = $this->makeAnswerIntro($knowledge, $answer);

        return $answer;
    }

    private function extractAnswerChunks(WebsiteKnowledge $knowledge)
    {
        $textParts = [];

        if (!empty($knowledge->summary)) {
            $textParts[] = $knowledge->summary;
        }

        if (!empty($knowledge->content)) {
            $textParts[] = $knowledge->content;
        }

        $text = $this->cleanText(implode("\n", $textParts));

        if ($text === '') {
            return [];
        }

        $rawChunks = preg_split('/(?<=[.!?])\s+|\n+/', $text);
        $chunks = [];

        foreach ($rawChunks as $chunk) {
            $chunk = $this->cleanText($chunk);
            $length = strlen($chunk);

            if ($length < 35 || $length > 420) {
                continue;
            }

            if ($this->looksLikeNavigationText($chunk)) {
                continue;
            }

            $chunks[] = $chunk;
        }

        return array_values(array_unique($chunks));
    }

    private function makeAnswerIntro(WebsiteKnowledge $knowledge, $answer)
    {
        $title = trim((string) $knowledge->title);

        if ($title === '') {
            return $answer;
        }

        $lowerAnswer = strtolower($answer);
        $lowerTitle = strtolower($title);

        if (strpos($lowerAnswer, $lowerTitle) !== false) {
            return $answer;
        }

        return "Berdasarkan informasi \"" . $title . "\", " . lcfirst($answer);
    }

    private function cleanText($text)
    {
        $text = html_entity_decode(strip_tags((string) $text), ENT_QUOTES, 'UTF-8');
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+/', ' ', $text);
        $text = preg_replace('/\n{2,}/', "\n", $text);

        return trim($text);
    }

    private function limitText($text, $limit)
    {
        $text = trim((string) $text);

        if (strlen($text) <= $limit) {
            return $text;
        }

        $cut = substr($text, 0, $limit);
        $lastPeriod = strrpos($cut, '.');

        if ($lastPeriod !== false && $lastPeriod > ($limit * 0.55)) {
            return substr($cut, 0, $lastPeriod + 1);
        }

        return rtrim($cut) . '...';
    }

    private function isDuplicateChunk($chunk, array $selected)
    {
        $chunkTokens = $this->searchHelper->prepareText($chunk, $this->stopWords, $this->synonymMap)['expanded_tokens'];

        foreach ($selected as $selectedChunk) {
            $selectedTokens = $this->searchHelper->prepareText($selectedChunk, $this->stopWords, $this->synonymMap)['expanded_tokens'];
            $score = $this->searchHelper->calculateTokenScore($chunkTokens, $selectedTokens);

            if ($score > 0.78) {
                return true;
            }
        }

        return false;
    }

    private function looksLikeNavigationText($text)
    {
        $lower = strtolower($text);
        $navigationWords = ['login', 'register', 'dashboard', 'copyright', 'javascript', 'menu', 'breadcrumb'];

        foreach ($navigationWords as $word) {
            if (strpos($lower, $word) !== false) {
                return true;
            }
        }

        return false;
    }

    private function keywordsToText($keywords)
    {
        if (is_array($keywords)) {
            return implode(' ', $keywords);
        }

        if (is_string($keywords)) {
            $decoded = json_decode($keywords, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return implode(' ', $decoded);
            }
        }

        return (string) $keywords;
    }

    private function shortenMatchedText($text)
    {
        $text = preg_replace('/\s+/', ' ', strip_tags((string) $text));

        if (strlen($text) > 160) {
            return substr($text, 0, 160) . '...';
        }

        return $text;
    }

    /**
     * Get semua knowledge entries
     */
    public function getAllKnowledge()
    {
        return WebsiteKnowledge::active()
            ->orderBy('source_type')
            ->orderBy('title')
            ->get();
    }

    /**
     * Get knowledge by type
     */
    public function getByType($type)
    {
        return WebsiteKnowledge::active()
            ->ofType($type)
            ->orderBy('title')
            ->get();
    }

    /**
     * Statistik knowledge base
     */
    public function getStatistics()
    {
        return [
            'total' => WebsiteKnowledge::active()->count(),
            'by_type' => WebsiteKnowledge::active()
                ->select('source_type', DB::raw('count(*) as total'))
                ->groupBy('source_type')
                ->pluck('total', 'source_type')
                ->toArray(),
            'last_updated' => WebsiteKnowledge::active()
                ->latest('updated_at')
                ->value('updated_at'),
        ];
    }
}
