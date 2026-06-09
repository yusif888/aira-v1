<?php

namespace App\Services;

use App\Models\WebsiteKnowledge;
use Illuminate\Support\Facades\DB;

class WebsiteKnowledgeService
{
    /**
     * Cari informasi berdasarkan pertanyaan user
     * 
     * @param string $pertanyaan
     * @return array|null [jawaban, source_info]
     */
    public function getJawaban($pertanyaan)
    {
        // 1. Coba pencarian exact match di title
        $exactMatch = WebsiteKnowledge::active()
            ->whereRaw('LOWER(title) = ?', [strtolower($pertanyaan)])
            ->first();
            
        if ($exactMatch) {
            return [
                'jawaban' => $this->formatJawaban($exactMatch, $pertanyaan),
                'source' => 'website_exact',
                'source_info' => $this->getSourceInfo($exactMatch)
            ];
        }

        // 2. Coba pencarian dengan full phrase keyword matching
        $keywordMatch = WebsiteKnowledge::active()
            ->searchKeywords($pertanyaan)
            ->orderByRaw('
                CASE 
                    WHEN LOWER(title) LIKE ? THEN 1
                    WHEN LOWER(summary) LIKE ? THEN 2
                    WHEN LOWER(content) LIKE ? THEN 3
                    ELSE 4
                END
            ', [
                '%' . strtolower($pertanyaan) . '%',
                '%' . strtolower($pertanyaan) . '%',
                '%' . strtolower($pertanyaan) . '%'
            ])
            ->first();

            if ($keywordMatch) {
            return [
                'jawaban' => $this->formatJawaban($keywordMatch, $pertanyaan),
                'source' => 'website_keyword',
                'source_info' => $this->getSourceInfo($keywordMatch)
            ];
        }

        // 3. Coba pencarian dengan split words (any word match)
        $words = $this->extractImportantWords($pertanyaan);
        if (!empty($words)) {
           $wordMatch = $this->searchByKeywords($words);

            if ($wordMatch) {
                \Log::info('Word Match Title: ' . $wordMatch->title);
                return [
                    'jawaban' => $this->formatJawaban($wordMatch, $pertanyaan),
                    'source' => 'website_keyword',
                    'source_info' => $this->getSourceInfo($wordMatch)
                ];
            }
        }

        // 3. Coba pencarian dengan full-text search (hanya untuk MySQL)
        // SQLite tidak support FULLTEXT, jadi di-skip
        if (config('database.default') === 'mysql') {
            try {
                $fullTextMatch = WebsiteKnowledge::active()
                    ->search($pertanyaan)
                    ->first();

                if ($fullTextMatch) {
                    return [
                        'jawaban' => $this->formatJawaban($fullTextMatch),
                        'source' => 'website_fulltext',
                        'source_info' => $this->getSourceInfo($fullTextMatch)
                    ];
                }
            } catch (\Exception $e) {
                // Full-text search tidak didukung
            }
        }

        return null;
    }

    /**
     * Format jawaban dari knowledge base
     */
    private function formatJawaban(WebsiteKnowledge $knowledge, $question = null)
    {
        $content = strip_tags($knowledge->content);

        if (!$question) {
            return substr($content, 0, 500);
        }

        $keywords = $this->extractImportantWords($question);

        $paragraphs = preg_split('/[\r\n]+/', $content);

        $bestParagraph = null;
        $bestScore = 0;

        foreach ($paragraphs as $paragraph) {

            $score = 0;

            foreach ($keywords as $keyword) {

                if (stripos($paragraph, $keyword) !== false) {
                    $score += 10;
                }
            }

            // Longer paragraphs usually contain actual information
            $score += min(strlen($paragraph) / 100, 10);

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestParagraph = trim($paragraph);
            }
        }

        if ($bestParagraph && strlen($bestParagraph) > 50) {

            // Skip title-only paragraphs
            if (strlen($bestParagraph) < 100 && count($paragraphs) > 1) {
                $bestParagraph = trim($paragraphs[1]);
            }

            return $knowledge->title .
                "\n\nRingkasan:\n" .
                $this->summarizeContent($bestParagraph) .
                "\n\nBaca selengkapnya:\n" .
                $knowledge->url;
        }

    return $knowledge->title .
        "\n\nRingkasan:\n" .
        $this->summarizeContent($content) .
        "\n\nBaca selengkapnya:\n" .
        $knowledge->url;
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

    /**
     * Extract important words from question (remove stop words)
     */
    private function extractImportantWords($text)
    {
        // Lowercase
        $text = strtolower($text);
        
        // Remove punctuation
        $text = preg_replace('/[^a-z0-9\s]/u', ' ', $text);
        
        // Split into words
        $words = preg_split('/\s+/', $text);
        
        // Stop words Indonesia yang umum
        $stopWords = [
            'apa', 'adalah', 'ada', 'akan', 'atau', 'dan', 'di', 'dari', 'yang', 
            'ke', 'untuk', 'pada', 'oleh', 'dengan', 'ini', 'itu', 'tersebut',
            'dapat', 'sudah', 'telah', 'juga', 'kamu', 'anda', 'saya', 'mereka',
            'kami', 'kita', 'ia', 'dia', 'nya', 'mu', 'ku', 'saja', 'lagi', 'pula',
            'bagaimana', 'siapa', 'dimana', 'kapan', 'mengapa', 'kenapa', 'berapa',
            'tentang', 'mengenai', 'menjelaskan', 'ceritakan', 'jelaskan'
        ];
        
        // Filter: minimal 3 karakter, bukan stop words
        $keywords = array_filter($words, function($word) use ($stopWords) {
            return strlen($word) >= 3 && !in_array($word, $stopWords);
        });
        
        return array_values($keywords);
    }

    private function searchByKeywords(array $words)
    {
        $query = WebsiteKnowledge::active();
    
        $scoreSql = [];
        $bindings = [];
    
        foreach ($words as $word) {
    
            $scoreSql[] = "
                (CASE WHEN LOWER(title) LIKE ? THEN 20 ELSE 0 END)
                +
                (CASE WHEN LOWER(summary) LIKE ? THEN 10 ELSE 0 END)
                +
                (CASE WHEN LOWER(content) LIKE ? THEN 5 ELSE 0 END)
            ";
    
            $bindings[] = "%{$word}%";
            $bindings[] = "%{$word}%";
            $bindings[] = "%{$word}%";
        }
    
        return $query
            ->selectRaw(
                '*, (' . implode(' + ', $scoreSql) . ') as relevance',
                $bindings
            )
            ->orderByDesc('relevance')
            ->first();
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

    private function summarizeContent($content)
    {
        $content = strip_tags($content);

        // Remove duplicate spaces
        $content = preg_replace('/\s+/', ' ', $content);

        // Split into sentences
        $content = preg_replace('/^.*?SURABAYA\s*[–-]\s*HUMAS\s*\|/iu', '', $content);
        $sentences = preg_split('/(?<=[.!?])\s+/', $content);

        if (count($sentences) > 1 && strlen($sentences[0]) < 120) {
            array_shift($sentences);
        }

        return implode(' ', array_slice($sentences, 0, 3));
    }
}
