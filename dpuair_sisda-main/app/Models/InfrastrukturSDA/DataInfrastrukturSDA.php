<?php

namespace App\Models\InfrastrukturSDA;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataInfrastrukturSDA extends Model
{
    use SoftDeletes;

    protected $table = 'data_infrastruktur_sda';

    protected $fillable = [
        'category_id',
        'name',
        'code',
        'type',
        'legend_color',
        'description',
        'latitude',
        'longitude',
        'geojson',
        'file_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'geojson' => 'array',
    ];

    /**
     * Relasi ke category
     */
    public function category()
    {
        return $this->belongsTo(InfrastrukturCategory::class, 'category_id');
    }
}
