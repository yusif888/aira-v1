<?php

namespace App\Models\PortalData;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PortalDataDatasets extends Model
{
    use HasFactory;

    protected $table = 'portaldata_datasets';

    protected $fillable = [
        'slug',
        'view_path',
        'title',
        'description',
        'json_data',
        'metadata',
        'status',
        'author_id',
    ];

    protected $casts = [
        'json_data' => 'array',
        'metadata' => 'array',
    ];

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Scope a query to only include published datasets.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Get the author of the dataset.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Get the formatted metadata as a readable string.
     *
     * @return string
     */
    public function getFormattedMetadataAttribute()
    {
        if (!$this->metadata) {
            return '';
        }

        $parts = [];
        foreach ($this->metadata as $key => $value) {
            $parts[] = ucfirst(str_replace('_', ' ', $key)) . ': ' . $value;
        }

        return implode(' • ', $parts);
    }

    /**
     * Get the source from metadata.
     *
     * @return string|null
     */
    public function getSourceAttribute()
    {
        return $this->metadata['sumber'] ?? null;
    }

    /**
     * Get the responsible party from metadata.
     *
     * @return string|null
     */
    public function getResponsiblePartyAttribute()
    {
        return $this->metadata['penanggung_jawab'] ?? null;
    }

    /**
     * Get the period from metadata.
     *
     * @return string|null
     */
    public function getPeriodAttribute()
    {
        return $this->metadata['periode'] ?? null;
    }
}
