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
                'jawaban' => $this->formatJawaban($exactMatch),
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
                'jawaban' => $this->formatJawaban($keywordMatch),
                'source' => 'website_keyword',
                'source_info' => $this->getSourceInfo($keywordMatch)
            ];
        }

        // 3. Coba pencarian dengan split words (any word match)
        $words = $this->extractImportantWords($pertanyaan);
        if (!empty($words)) {
            $wordMatch = WebsiteKnowledge::active()
                ->where(function($q) use ($words) {
                    foreach ($words as $word) {
                        $q->orWhereRaw('LOWER(title) LIKE ?', ["%{$word}%"])
                          ->orWhereRaw('LOWER(content) LIKE ?', ["%{$word}%"])
                          ->orWhereRaw('LOWER(keywords) LIKE ?', ["%{$word}%"]);
                    }
                })
                ->first();

            if ($wordMatch) {
                return [
                    'jawaban' => $this->formatJawaban($wordMatch),
                    'source' => 'website_keyword',
                    'source_info' => $this->getSourceInfo($wordMatch)
                ];
            }
        }

        // 4. Coba pencarian dengan full-text search (hanya untuk MySQL)
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
     * Ambil potongan artikel/dokumen relevan untuk RAG Context (Qwen 2.5)
     *
     * @param string $pertanyaan
     * @param int $limit
     * @return array
     */
    public function getRelevantChunks($pertanyaan, $limit = 3)
    {
        $chunks = [];
        $words = $this->extractImportantWords($pertanyaan);

        $query = WebsiteKnowledge::active();

        if (!empty($words)) {
            $query->where(function($q) use ($words) {
                foreach ($words as $word) {
                    $q->orWhereRaw('LOWER(title) LIKE ?', ["%{$word}%"])
                      ->orWhereRaw('LOWER(content) LIKE ?', ["%{$word}%"])
                      ->orWhereRaw('LOWER(keywords) LIKE ?', ["%{$word}%"]);
                }
            });
        }

        $results = $query->limit($limit)->get();

        foreach ($results as $item) {
            $snippet = !empty($item->summary) ? $item->summary : strip_tags($item->content);
            if (strlen($snippet) > 600) {
                $snippet = substr($snippet, 0, 600) . '...';
            }
            $chunks[] = [
                'id' => $item->id,
                'title' => $item->title,
                'content' => $snippet,
                'url' => $item->url,
                'source_type' => $item->source_type,
            ];
        }

        return $chunks;
    }

    /**
     * Format jawaban dari knowledge base
     */
    private function formatJawaban(WebsiteKnowledge $knowledge)
    {
        // Gunakan summary jika ada, kalau tidak pakai content (dipotong)
        if (!empty($knowledge->summary)) {
            $jawaban = $knowledge->summary;
        } else {
            // Ambil 500 karakter pertama dari content
            $content = strip_tags($knowledge->content);
            $jawaban = strlen($content) > 500 
                ? substr($content, 0, 500) . '...' 
                : $content;
        }

        return $jawaban;
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
