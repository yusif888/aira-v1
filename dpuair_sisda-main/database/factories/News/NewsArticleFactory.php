<?php

namespace Database\Factories\News;

use App\Models\News\NewsCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News\NewsArticle>
 */
class NewsArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->unique()->sentence();
        return [
            'news_category_id' => NewsCategory::factory(),
            'user_id' => User::first() ?? User::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'excerpt' => $this->faker->paragraph,
            'content' => $this->faker->paragraphs(5, true),
            'featured_image_path' => 'seeders/news/news-placeholder.jpg',
            'status' => $this->faker->randomElement(['draft', 'published']),
            'published_at' => now(),
            'is_featured' => $this->faker->boolean(20),
            'view_count' => $this->faker->numberBetween(100, 10000),
            'meta_title' => $title,
            'meta_description' => $this->faker->sentence,
            'meta_keywords' => implode(', ', $this->faker->words(5)),
        ];
    }
}
