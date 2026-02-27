<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WebsiteKnowledge;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class IndexWebsiteContent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'aira:index-website {--fresh : Force re-index entire database}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Index content from dpuair_sisda database into AIRA knowledge base';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info('🚀 Starting Website Content Indexing...');

        try {
            // Test connection
            try {
                DB::connection('dpuair_sisda')->getPdo();
                $this->info('✅ Connected to website database.');
            } catch (\Exception $e) {
                $this->error('❌ Could not connect to dpuair_sisda database.');
                $this->error($e->getMessage());
                return;
            }

            // Fresh option: truncate existing news knowledge
            if ($this->option('fresh')) {
                $this->info('Cleaning up old news data...');
                WebsiteKnowledge::where('source_type', 'news')->delete();
            }

            // Fetch articles
            // Adjust status check if necessary. Usually 'published' or 1.
            // Let's assume 'published' string based on varchar type.
            $query = DB::connection('dpuair_sisda')
                ->table('news_articles')
                ->where('status', 'published') // Adjust this value if needed (e.g. 'PUBLISHED', 'active', 1)
                ->whereNull('deleted_at')
                ->orderBy('published_at', 'desc');

            $total = $query->count();
            $this->info("Found {$total} published articles.");

            $bar = $this->output->createProgressBar($total);
            $bar->start();

            $articles = $query->cursor();

            $count = 0;
            foreach ($articles as $article) {
                $this->indexArticle($article);
                $bar->advance();
                $count++;
            }

            $bar->finish();
            $this->info(''); // Replacement for newLine
            $this->info("✅ Successfully indexed {$count} articles.");

        } catch (\Exception $e) {
            $this->error('An error occurred: ' . $e->getMessage());
            \Illuminate\Support\Facades\Log::error($e);
        }
    }

    /**
     * Process single article
     */
    private function indexArticle($article)
    {
        // Clean content
        $cleanContent = strip_tags($article->content);
        $cleanContent = html_entity_decode($cleanContent);
        // Remove extra spaces
        $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);
        $cleanContent = trim($cleanContent);

        // Prepare Summary
        $summary = $article->excerpt;
        if (empty($summary)) {
            $summary = Str::limit($cleanContent, 200);
        }

        // Prepare Keywords
        $keywords = [];
        if (!empty($article->meta_keywords)) {
            $keywords = array_map('trim', explode(',', $article->meta_keywords));
        }
        
        // Add words from title to keywords
        $titleWords = explode(' ', strtolower($article->title));
        $keywords = array_unique(array_merge($keywords, $titleWords));
        
        // Remove short words
        $keywords = array_filter($keywords, function($w) {
            return strlen($w) > 3;
        });

        // Determine URL (Assuming structure, configurable)
        // Adjust this base URL to the actual public website
        $baseUrl = 'https://dpuair.jatimprov.go.id/berita/detail'; 
        $url = "{$baseUrl}/{$article->slug}";

        // Update or Create
        WebsiteKnowledge::updateOrCreate(
            [
                'source_type' => 'news',
                'source_id' => $article->id,
            ],
            [
                'title' => $article->title,
                'content' => $cleanContent,
                'summary' => $summary,
                'keywords' => array_values($keywords),
                'url' => $url,
                'is_active' => true,
                'source_updated_at' => $article->updated_at ?? $article->created_at,
                'metadata' => [
                    'author_id' => $article->user_id,
                    'view_count' => $article->view_count,
                    'featured' => $article->is_featured,
                    'published_at' => $article->published_at
                ]
            ]
        );
    }
}
