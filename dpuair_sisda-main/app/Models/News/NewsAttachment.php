<?php

namespace App\Models\News;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsAttachment extends Model
{
    use HasFactory;

    protected $table = 'news_attachments';

    protected $fillable = [
        'news_article_id',
        'display_name',
        'file_path',
        'file_type',
        'file_size',
    ];

    public function article()
    {
        return $this->belongsTo(NewsArticle::class, 'news_article_id');
    }
}
