<?php

namespace App\Models\News;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsTag extends Model
{
    use HasFactory;

    protected $table = 'news_tags';

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Get the articles that use the tag.
     */

    public function articles()
    {
        return $this->belongsToMany(NewsArticle::class, 'news_article_tag', 'news_tag_id', 'news_article_id');
    }
}
