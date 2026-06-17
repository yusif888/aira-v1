<?php

namespace App\Models\Documents;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;
class DocumentsTag extends Model
{
    use HasFactory;

    protected $table = 'documents_tags';

    protected $fillable = [
        'name',
        'slug',
    ];

    protected $casts = [
        'name' => 'string',
        'slug' => 'string',
    ];

    protected $appends = ['formatted_name'];

    public function entries(): BelongsToMany
    {
        return $this->belongsToMany(
            DocumentsEntry::class, 
            'document_entry_tag', 
            'tag_id', 
            'document_entry_id'
        );
    }

    public function scopeSearch($query, $search)
    {
        $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
        return $query->where('name', $like, '%' . $search . '%')
                     ->orWhere('slug', $like, '%' . $search . '%');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug)) {
                $tag->slug = Str::slug($tag->name);
            }
        });

        static::updating(function ($tag) {
            if ($tag->isDirty('name')) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    public function getFormattedNameAttribute()
    {
        return ucwords($this->name);
    }

    public function setNameAttribute($value)
    {
        $this->attributes['name'] = trim($value);
    }
}