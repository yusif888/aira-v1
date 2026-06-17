<?php

namespace App\Models\News;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsCategory extends Model
{
    use HasFactory;

    protected $table = 'news_categories';

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Get the articles for the category.
     */

    public function articles()
    {
        return $this->hasMany(NewsArticle::class, 'news_category_id');
    }
}
