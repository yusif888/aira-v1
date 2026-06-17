<?php

namespace App\Models\Documents;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentsCategory extends Model
{
    use HasFactory;

    protected $table = 'documents_categories';

    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function types(): HasMany
    {
        return $this->hasMany(DocumentsType::class, 'category_id');
    }

    /**
     * Get documents count for this category
     */
    public function getDocumentsCountAttribute(): int
    {
        // If types are already loaded with entries count, use that
        if ($this->relationLoaded('types')) {
            return $this->types->sum(function ($type) {
                return $type->entries_count ?? $type->entries->count();
            });
        }
        
        // Otherwise query directly from database
        return \App\Models\Documents\DocumentsEntry::whereIn('type_id', $this->types()->pluck('id'))->count();
    }

    /**
     * Scope for active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
