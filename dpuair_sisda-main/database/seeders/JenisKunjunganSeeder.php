<?php

namespace Database\Seeders;

use App\Models\Pelayanan\JenisKunjungan;
use Illuminate\Database\Seeder;

class JenisKunjunganSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'kode'      => 'FHD',
                'nama'      => 'Fast Hydrology Data',
                'deskripsi' => 'Data dan informasi terkait bahaya banjir, pemetaan risiko, dan analisis potensi banjir di wilayah Jawa Timur.',
                'urutan'    => 1,
            ],
            [
                'kode'      => 'SIH3',
                'nama'      => 'Sistem Informasi Hidrologi, Hidrometeorologi & Hidrogeologi',
                'deskripsi' => 'Informasi data hidrologi, curah hujan, debit sungai, dan monitoring sumber daya air secara real-time.',
                'urutan'    => 2,
            ],
            [
                'kode'      => 'JOSS',
                'nama'      => 'Jatim Online Single Submission',
                'deskripsi' => 'Sistem perizinan online yang dikelola oleh DPMPTSP Provinsi Jawa Timur.',
                'urutan'    => 3,
            ],
            [
                'kode'      => 'TOUR',
                'nama'      => 'Kunjungan / Office Tour',
                'deskripsi' => 'Kunjungan umum atau office tour ke kantor Dinas PU SDA Jawa Timur.',
                'urutan'    => 4,
            ],
            [
                'kode'      => 'PKL',
                'nama'      => 'Praktik Kerja Lapangan & Magang',
                'deskripsi' => 'Pelayanan untuk mahasiswa atau siswa yang melaksanakan PKL atau magang.',
                'urutan'    => 5,
            ],
            [
                'kode'      => 'RISET',
                'nama'      => 'Kunjungan Penelitian / Riset',
                'deskripsi' => 'Kunjungan dalam rangka penelitian, pengambilan data, atau keperluan akademis.',
                'urutan'    => 6,
            ],
            [
                'kode'      => 'KONSUL',
                'nama'      => 'Konsultasi Teknis',
                'deskripsi' => 'Konsultasi teknis terkait sumber daya air, irigasi, atau infrastruktur SDA.',
                'urutan'    => 7,
            ],
            [
                'kode'      => 'KOORDINASI',
                'nama'      => 'Koordinasi Antar Instansi',
                'deskripsi' => 'Pertemuan koordinasi dengan instansi pemerintah atau lembaga lain.',
                'urutan'    => 8,
            ],
        ];

        foreach ($data as $item) {
            JenisKunjungan::updateOrCreate(['kode' => $item['kode']], array_merge($item, ['aktif' => true]));
        }
    }
}
