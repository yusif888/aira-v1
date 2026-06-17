<?php

namespace App\Models\News;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NewsComment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'news_comments';

    protected $fillable = [
        'news_article_id',
        'parent_id',
        'commenter_name',
        'commenter_email',
        'user_id',
        'content',
        'status',
    ];

    public function article()
    {
        return $this->belongsTo(NewsArticle::class, 'news_article_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function parent()
    {
        return $this->belongsTo(NewsComment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(NewsComment::class, 'parent_id');
    }
}
