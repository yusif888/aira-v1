<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use DOMDocument;
use DOMXPath;
use App\Models\WebsiteKnowledge; // Pastikan model ini ada atau kita buat
use Illuminate\Support\Facades\DB;

class CrawlWebsite extends Command
{
    protected $signature = 'aira:crawl {url=https://dpuair.jatimprov.go.id/} {--limit=10}';
    protected $description = 'Crawl website content and save to knowledge base';

    public function handle()
    {
        $startUrl = $this->argument('url');
        $limit = $this->option('limit');
        
        $this->info("Starting crawl for: $startUrl");
        
        // Setup Client
        $client = new Client([
            'verify' => false,
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            ]
        ]); 
        
        // 1. Fetch Homepage to discover dynamic links (Inertia Props)
        try {
            $this->info("Connecting to $startUrl ...");
            $response = $client->get($startUrl);
            $html = (string) $response->getBody();
            
            // Extract Inertia data
            $pageData = $this->extractInertiaData($html);
            $links = [];
            
            // A. Add Static Important Links (Known from Ziggy analysis)
            $staticPaths = [
                'profil/selayang-pandang',
                'profil/visi-misi',
                'profil/tupoksi',
                'profil/dasar-hukum',
                'profil/pimpinan',
                'organisasi/struktur',
                'organisasi/irigasi',
                'organisasi/sungai-waduk',
                'pelayanan',
                'berita'
            ];
            
            foreach($staticPaths as $path) {
                $links[] = $this->normalizeUrl($path, $startUrl);
            }
            
            // B. Discover Dynamic Links (News) from Homepage props
            $props = $pageData['props'] ?? [];
            
            if (isset($props['latestNews']) && is_array($props['latestNews'])) {
                foreach($props['latestNews'] as $news) {
                    if (isset($news['slug'])) {
                        $links[] = $this->normalizeUrl('berita/details/' . $news['slug'], $startUrl);
                    }
                }
            }
            if (isset($props['heroNews']) && is_array($props['heroNews'])) {
                foreach($props['heroNews'] as $news) {
                    if (isset($news['slug'])) {
                        $links[] = $this->normalizeUrl('berita/details/' . $news['slug'], $startUrl);
                    }
                }
            }

            $links = array_unique($links);
            $links = array_slice($links, 0, $limit); 
            
            $this->info("Found " . count($links) . " potential pages.");
            
            if (count($links) > 0) {
                $bar = $this->output->createProgressBar(count($links));
                
                foreach ($links as $link) {
                    $this->processPageInertia($client, $link);
                    $bar->advance();
                }
                
                $bar->finish();
                $this->info("\nCrawl finished! Data saved to 'website_knowledge' table.");
            }
            
        } catch (\Exception $e) {
            $this->error("Error crawling homepage: " . $e->getMessage());
        }
    }
    
    // Extract data-page JSON from HTML
    private function extractInertiaData($html) {
        // Regex to find data-page attribute value
        // Note: html_entity_decode is crucial because quotes usually escaped
        if (preg_match('/data-page="([^"]+)"/', $html, $matches)) {
            $jsonStr = html_entity_decode($matches[1], ENT_QUOTES, 'UTF-8');
            return json_decode($jsonStr, true) ?? [];
        }
        return [];
    }

    private function processPageInertia($client, $url)
    {
        try {
            sleep(1); 
            $response = $client->get($url);
            $html = (string) $response->getBody();
            $data = $this->extractInertiaData($html);
            
            if (empty($data)) return;

            // Determine Title & Content from Props
            $props = $data['props'] ?? [];
            
            $title = ucwords(basename($url)); // Default title
            $contentParts = [];
            
            // 1. Handle News Details (Specific structure: props.article)
            if (strpos($url, '/berita/details/') !== false && isset($props['article'])) {
                $article = $props['article'];
                $title = $article['title'] ?? $title;
                $contentParts[] = $title;
                $contentParts[] = strip_tags($article['content'] ?? '');
                $contentParts[] = $article['excerpt'] ?? '';
            }
            // 2. Handle Generic Pages (Visi Misi, Tupoksi, etc)
            else {
                // Recursively find strings in props to build content
                $this->extractStringsRecursive($props, $contentParts);
                
                // Clean content parts
                $contentParts = array_filter($contentParts, function($val) {
                    // Filter code-like bits
                    return strlen($val) > 20 
                        && strpos($val, '{') === false 
                        && strpos($val, 'http') === false
                        && strpos($val, 'admin/') === false;
                });
            }
            
            $content = implode("\n\n", array_unique($contentParts));
            
            // Cleanup Title
            $title = str_replace('-', ' ', $title);
            
            if (strlen($content) > 50) {
                DB::table('website_knowledge')->updateOrInsert(
                    ['url' => $url],
                    [
                        'source_type' => 'website_crawl',
                        'title' => substr($title, 0, 255),
                        'content' => $content,
                        'created_at' => now(),
                        'updated_at' => now(),
                        'is_active' => true
                    ]
                );
            }
            
        } catch (\Exception $e) {
             // Continue silent
        }
    }
    
    private function extractStringsRecursive($array, &$results, $ignoreKeys = ['ziggy', 'routes', 'auth', 'flash', 'errors', 'impersonate', 'menu']) {
        foreach ($array as $key => $value) {
            if (in_array($key, $ignoreKeys, true)) continue;
            
            if (is_array($value)) {
                $this->extractStringsRecursive($value, $results, $ignoreKeys);
            } else if (is_string($value)) {
                // Heuristic: Logic to keep meaningful text
                $clean = strip_tags($value);
                // Ensure it looks like sentence/content, not a path
                if (strlen($clean) > 30 && strpos($clean, '/') === false) {
                     $results[] = $clean;
                }
            }
        }
    }

    private function normalizeUrl($url, $baseUrl) {
        if (strpos($url, 'http') === 0) return $url;
        
        return rtrim($baseUrl, '/') . '/' . ltrim($url, '/');
    }
}
