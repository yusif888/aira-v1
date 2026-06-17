<?php

namespace App\Models\News;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsImage extends Model
{
    use HasFactory;

    protected $table = 'news_images';

    protected $fillable = [
        'news_article_id',
        'image_path',
        'caption',
        'order_column',
    ];

    public function article()
    {
        return $this->belongsTo(NewsArticle::class, 'news_article_id');
    }
}
