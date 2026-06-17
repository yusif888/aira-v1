<?php

namespace App\Console\Commands;

use App\Models\News\NewsArticle;
use App\Models\News\NewsCategory;
use App\Models\News\NewsTag;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CheckNewsData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:check-data {--create : Create sample data if empty}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check news data in database and optionally create sample data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking news data in database...');
        
        try {
            $newsCount = NewsArticle::count();
            $categoryCount = NewsCategory::count();
            $tagCount = NewsTag::count();
            $userCount = User::count();
            
            $this->table(
                ['Table', 'Count'],
                [
                    ['Users', $userCount],
                    ['News Categories', $categoryCount],
                    ['News Tags', $tagCount],
                    ['News Articles', $newsCount],
                ]
            );
            
            if ($newsCount === 0 && $this->option('create')) {
                $this->info('No news data found. Creating sample data...');
                $this->createSampleData();
            } elseif ($newsCount === 0) {
                $this->warn('No news data found. Use --create option to create sample data.');
            } else {
                $this->info('News data found!');
            }
            
        } catch (\Exception $e) {
            $this->error('Error checking data: ' . $e->getMessage());
            Log::error('Error in CheckNewsData command', ['message' => $e->getMessage()]);
            return 1;
        }
        
        return 0;
    }
    
    private function createSampleData()
    {
        try {
            // Create user if none exists
            $user = User::first();
            if (!$user) {
                $user = User::create([
                    'name' => 'Admin SISDA',
                    'email' => 'admin@sisda.local',
                    'password' => bcrypt('password'),
                ]);
                $this->info('Created user: ' . $user->name);
            }
            
            // Create categories
            $categories = [
                'Pembangunan & Infrastruktur' => 'Berita terkait pembangunan infrastruktur SDA',
                'Operasi & Pemeliharaan' => 'Kegiatan O&P infrastruktur sumber daya air',
                'Siaga Bencana & Penanggulangan' => 'Informasi kebencanaan hidrometeorologi',
                'Konservasi & Lingkungan' => 'Konservasi sumber daya air',
                'Kegiatan Seremonial & Kelembagaan' => 'Kegiatan kelembagaan dan seremonial',
            ];
            
            foreach ($categories as $name => $description) {
                NewsCategory::firstOrCreate(
                    ['name' => $name],
                    ['description' => $description, 'slug' => Str::slug($name)]
                );
            }
            $this->info('Created/verified categories');
            
            // Create tags
            $tagNames = ['infrastruktur', 'op', 'banjir', 'konservasi', 'kegiatan', 'irigasi', 'waduk'];
            foreach ($tagNames as $tagName) {
                NewsTag::firstOrCreate(
                    ['name' => ucfirst($tagName)],
                    ['slug' => Str::slug($tagName)]
                );
            }
            $this->info('Created/verified tags');
            
            // Create sample articles
            $sampleArticles = [
                [
                    'title' => 'Peresmian Peningkatan Jaringan Irigasi Primer',
                    'excerpt' => 'Jaringan irigasi primer resmi ditingkatkan untuk mendukung layanan irigasi yang andal.',
                    'content' => 'Pemerintah Provinsi melalui Dinas PU Sumber Daya Air meresmikan peningkatan jaringan irigasi primer. Pekerjaan meliputi perkuatan tanggul, perbaikan bangunan bagi, serta normalisasi saluran untuk meningkatkan efisiensi distribusi air ke lahan pertanian.',
                    'status' => 'published',
                    'is_featured' => true,
                ],
                [
                    'title' => 'Operasi dan Pemeliharaan Waduk Menjelang Musim Hujan',
                    'excerpt' => 'Tim O&P melakukan inspeksi dan kalibrasi peralatan untuk kesiapsiagaan musim hujan.',
                    'content' => 'Menjelang musim hujan, UPT terkait melakukan inspeksi menyeluruh pada waduk-waduk utama, termasuk pemeriksaan pintu air, spillway, dan instrumen pemantauan TMA.',
                    'status' => 'published',
                    'is_featured' => false,
                ],
            ];
            
            $category = NewsCategory::first();
            foreach ($sampleArticles as $articleData) {
                NewsArticle::create([
                    'title' => $articleData['title'],
                    'excerpt' => $articleData['excerpt'],
                    'content' => $articleData['content'],
                    'news_category_id' => $category->id,
                    'status' => $articleData['status'],
                    'is_featured' => $articleData['is_featured'],
                    'user_id' => $user->id,
                    'slug' => Str::slug($articleData['title']),
                    'published_at' => now(),
                    'view_count' => rand(10, 100),
                ]);
            }
            $this->info('Created sample articles');
            
            $this->info('Sample data created successfully!');
            
        } catch (\Exception $e) {
            $this->error('Error creating sample data: ' . $e->getMessage());
            throw $e;
        }
    }
}
