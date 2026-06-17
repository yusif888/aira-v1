<?php

namespace App\Models\Pelayanan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JenisKunjungan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'jenis_kunjungan';

    protected $fillable = [
        'kode',
        'nama',
        'deskripsi',
        'urutan',
        'aktif',
    ];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function pelayanans()
    {
        return $this->hasMany(Pelayanan::class, 'jenis_kunjungan_id');
    }

    public static function aktif()
    {
        return static::where('aktif', true)->orderBy('urutan')->orderBy('nama')->get();
    }
}
