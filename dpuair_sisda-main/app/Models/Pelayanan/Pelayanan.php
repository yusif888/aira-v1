<?php

namespace App\Models\Pelayanan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Database\Factories\PelayananFactory;
use Illuminate\Support\Facades\DB;

class Pelayanan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'kode_antrian',
        'jenis_kunjungan_id',
        'nama_lengkap',
        'email',
        'instansi_asal',
        'nomor_whatsapp',
        'catatan',
        'tanggal_kedatangan',
        'status',
    ];

    protected $casts = [
        'tanggal_kedatangan' => 'date',
    ];

    protected static function newFactory()
    {
        return PelayananFactory::new();
    }

    const STATUS_PENDING    = 'pending';
    const STATUS_DIPROSES   = 'diproses';
    const STATUS_SELESAI    = 'selesai';
    const STATUS_DIBATALKAN = 'dibatalkan';

    public static function getStatusOptions(): array
    {
        return [
            self::STATUS_PENDING    => 'Pending',
            self::STATUS_DIPROSES   => 'Diproses',
            self::STATUS_SELESAI    => 'Selesai',
            self::STATUS_DIBATALKAN => 'Dibatalkan',
        ];
    }

    public function jenisKunjungan()
    {
        return $this->belongsTo(JenisKunjungan::class, 'jenis_kunjungan_id');
    }

    /**
     * Generate kode antrian.
     * Format: {KODE}{YYYYMMDD}{XXX} — contoh: FHD20260514001
     * Reset per hari per jenis kunjungan.
     */
    public static function generateKodeAntrian(JenisKunjungan $jenisKunjungan): string
    {
        return DB::transaction(function () use ($jenisKunjungan) {
            $prefix = strtoupper($jenisKunjungan->kode);
            $today  = now()->format('Ymd');

            $last = self::withTrashed()
                ->where('kode_antrian', 'like', "{$prefix}{$today}%")
                ->lockForUpdate()
                ->orderBy('kode_antrian', 'desc')
                ->value('kode_antrian');

            $nomorUrut = $last ? (intval(substr($last, -3)) + 1) : 1;

            return $prefix . $today . str_pad($nomorUrut, 3, '0', STR_PAD_LEFT);
        });
    }
}
