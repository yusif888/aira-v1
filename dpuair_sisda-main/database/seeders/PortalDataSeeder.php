<?php

namespace Database\Seeders;

use App\Models\PortalData\PortalDataDatasets;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PortalDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PortalDataDatasets::firstOrCreate(
            [
                'slug' => 'peta-jaringan-irigasi-jawa-timur',
                'view_path' => 'peta.jaringan_irigasi'
            ],
            [
                'title' => 'Peta Jaringan Irigasi Jawa Timur',
                'description' => 'Peta sebaran jaringan irigasi di seluruh wilayah Jawa Timur, mencakup data primer, sekunder, dan tersier.',
                'json_data' => json_encode([
                    'map_url' => 'https://example.com/map/irigasi.geojson',
                    'layers' => ['Primer', 'Sekunder', 'Tersier'],
                    'last_updated' => '2025-08-01'
                ]),
                'metadata' => json_encode([
                    'sumber' => 'Dinas PU Sumber Daya Air Provinsi Jawa Timur',
                    'penanggung_jawab' => 'Bidang Irigasi',
                    'periode' => 'Semester I 2025'
                ]),
                'status' => 'published',
            ]
        );

        PortalDataDatasets::firstOrCreate(
            [
                'slug' => 'data-curah-hujan-bulanan',
                'view_path' => 'tabel.curah_hujan'
            ],
            [
                'title' => 'Data Curah Hujan Bulanan',
                'description' => 'Rekapitulasi data curah hujan bulanan dari berbagai pos pengamatan di Jawa Timur.',
                'json_data' => json_encode([
                    ['bulan' => 'Januari', 'rata_rata_mm' => 350],
                    ['bulan' => 'Februari', 'rata_rata_mm' => 320],
                    ['bulan' => 'Maret', 'rata_rata_mm' => 280],
                ]),
                'metadata' => json_encode([
                    'sumber' => 'Pos Pengamatan Hujan Otomatis (AWS/AWLR)',
                    'penanggung_jawab' => 'Bidang Perencanaan',
                    'satuan' => 'milimeter (mm)'
                ]),
                'status' => 'published',
            ]
        );
    }
}
