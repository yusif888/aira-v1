<?php

namespace App\Models\InfrastrukturSDA;

use Illuminate\Database\Eloquent\Model;

class InfrastrukturCategory extends Model
{
    protected $fillable = [
        'code',
        'name',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Relasi ke data infrastruktur
     */
    public function infrastruktur()
    {
        return $this->hasMany(DataInfrastrukturSDA::class, 'category_id');
    }

    /**
     * Alias untuk relasi infrastruktur (untuk konsistensi API)
     */
    public function data()
    {
        return $this->hasMany(DataInfrastrukturSDA::class, 'category_id');
    }
}
