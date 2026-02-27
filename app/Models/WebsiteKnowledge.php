<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebsiteKnowledge extends Model
{
    // use HasFactory;

    protected $table = 'website_knowledge';

    protected $fillable = [
        'source_type',
        'source_id',
        'title',
        'content',
        'summary',
        'keywords',
        'url',
        'metadata',
        'is_active',
        'source_updated_at',
    ];

    protected $casts = [
        'keywords' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'source_updated_at' => 'datetime',
    ];

    /**
     * Scope untuk filter berdasarkan source type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('source_type', $type);
    }

    /**
     * Scope untuk hanya data aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Pencarian full-text
     */
    public function scopeSearch($query, $searchTerm)
    {
        return $query->whereRaw(
            "MATCH(title, content, summary) AGAINST(? IN NATURAL LANGUAGE MODE)",
            [$searchTerm]
        );
    }

    /**
     * Pencarian dengan keyword matching
     */
    public function scopeSearchKeywords($query, $searchTerm)
    {
        $searchLower = strtolower($searchTerm);
        
        return $query->where(function($q) use ($searchLower) {
            $q->whereRaw('LOWER(title) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(content) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(summary) LIKE ?', ["%{$searchLower}%"])
              ->orWhereRaw('LOWER(keywords) LIKE ?', ["%{$searchLower}%"]); // SQLite compatible
        });
    }
}
