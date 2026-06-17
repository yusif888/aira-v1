<?php

namespace Database\Seeders;

use App\Models\News\NewsArticle;
use App\Models\News\NewsCategory;
use App\Models\News\NewsTag;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Bersihkan data lama jika ada
        // NewsArticle::query()->delete();
        // NewsCategory::query()->delete();
        // NewsTag::query()->delete();

        // 2. Siapkan direktori untuk gambar placeholder
        Storage::disk('public')->makeDirectory('seeders/news');

        // 3. Buat Kategori Berita
        $categories = NewsCategory::factory(5)->create();

        // 4. Buat Tag Berita
        $tags = NewsTag::factory(10)->create();

        // 5. Buat Artikel Berita
        NewsArticle::factory(20)->create()->each(function ($article) use ($tags, $categories) {
            // Attach kategori secara acak dari yang sudah dibuat
            $article->news_category_id = $categories->random()->id;
            $article->save();

            // Attach 1 sampai 3 tag secara acak
            $article->tags()->attach(
                $tags->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
