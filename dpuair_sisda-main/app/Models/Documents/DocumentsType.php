<?php

namespace App\Models\Documents;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentsType extends Model
{
    use HasFactory;

    protected $table = 'documents_types';

    protected $fillable = [
        'category_id',
        'name',
        'icon',
        'status',
        'is_active',
    ];

    protected $casts = [
        'status' => 'string',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(DocumentsCategory::class, 'category_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(DocumentsEntry::class, 'type_id');
    }

    /**
     * Scope for active types
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get documents count for this type
     */
    public function getDocumentsCountAttribute(): int
    {
        return $this->entries()->count();
    }

    /**
     * Get is_active attribute
     */
    public function getIsActiveAttribute($value)
    {
        return (bool) $value;
    }

    /**
     * Set is_active attribute and sync status
     */
    public function setIsActiveAttribute($value)
    {
        $this->attributes['is_active'] = (bool) $value;
        // Sync status with is_active
        $this->attributes['status'] = $value ? 'active' : 'inactive';
    }

    /**
     * Get status attribute
     */
    public function getStatusAttribute($value)
    {
        return $value ?? 'active';
    }

    /**
     * Set status attribute
     */
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = $value ?? 'active';
    }
}
