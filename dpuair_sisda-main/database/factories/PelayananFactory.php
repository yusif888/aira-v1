<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pelayanan\Pelayanan>
 */
class PelayananFactory extends Factory
{
    protected $model = \App\Models\Pelayanan\Pelayanan::class;

    public function definition(): array
    {
        $namaLaki = [
            'Budi Santoso', 'Ahmad Fauzi', 'Rizky Pratama', 'Dimas Aji Nugroho',
            'Fajar Ramadhan', 'Wahyu Hidayat', 'Andi Kurniawan', 'Hendra Setiawan',
            'Yoga Prasetyo', 'Galih Permana', 'Reza Firmansyah', 'Bagas Wicaksono',
            'Daffa Aditya', 'Naufal Hakim', 'Ilham Saputra', 'Rafi Ardiansyah',
            'Zulfikar Maulana', 'Arif Budiman', 'Taufik Hidayatullah', 'Kevin Arya Putra',
        ];

        $namaPerempuan = [
            'Siti Rahayu', 'Dewi Anggraini', 'Nur Azizah', 'Putri Maharani',
            'Farah Diba', 'Anisa Fitriani', 'Rina Wulandari', 'Mega Puspitasari',
            'Intan Permata Sari', 'Aulia Rahma', 'Nadya Kusuma', 'Fathia Zahra',
            'Laila Nur Hidayah', 'Citra Ayu Lestari', 'Dian Pertiwi', 'Shinta Amelia',
            'Rista Oktaviani', 'Nadia Safitri', 'Yuliana Rahmawati', 'Kurnia Fitri',
        ];

        // 60% kampus, 25% masyarakat umum, 15% instansi pemerintah
        $instansiKampus = [
            'Universitas Brawijaya', 'Institut Teknologi Sepuluh Nopember (ITS)',
            'Universitas Airlangga', 'Universitas Negeri Malang',
            'Universitas Jember', 'Universitas Negeri Surabaya (UNESA)',
            'Universitas Muhammadiyah Malang', 'Universitas Islam Negeri Sunan Ampel',
            'Universitas Trunojoyo Madura', 'Politeknik Negeri Malang',
            'Politeknik Negeri Jember', 'Institut Teknologi Nasional Malang',
        ];

        $instansiMasyarakat = [
            'Perorangan / Masyarakat Umum', 'Warga Kab. Malang', 'Warga Kota Surabaya',
            'Warga Kab. Sidoarjo', 'Warga Kab. Jombang', 'Warga Kab. Mojokerto',
            'Warga Kab. Pasuruan', 'Warga Kota Malang', 'Warga Kab. Gresik',
        ];

        $instansiPemerintah = [
            'Dinas PU Kab. Malang', 'Dinas Pengairan Kab. Sidoarjo',
            'BBWS Brantas', 'Dinas SDA Kota Surabaya', 'Pemkab Tulungagung',
        ];

        $rand = fake()->numberBetween(1, 100);
        if ($rand <= 60) {
            $instansi = fake()->randomElement($instansiKampus);
        } elseif ($rand <= 85) {
            $instansi = fake()->randomElement($instansiMasyarakat);
        } else {
            $instansi = fake()->randomElement($instansiPemerintah);
        }

        $semuaNama = array_merge($namaLaki, $namaPerempuan);
        $nama      = fake()->randomElement($semuaNama);

        // Buat email dari nama
        $emailBase = strtolower(str_replace([' ', '.', "'"], ['', '', ''], iconv('UTF-8', 'ASCII//TRANSLIT', $nama)));
        $email     = $emailBase . fake()->numberBetween(1, 999) . '@' . fake()->randomElement(['gmail.com', 'yahoo.com', 'student.ub.ac.id', 'its.ac.id', 'unair.ac.id']);

        $catatan = [
            'Membutuhkan data debit sungai untuk keperluan skripsi.',
            'Penelitian tesis tentang manajemen sumber daya air di Jawa Timur.',
            'Magang selama 2 bulan di bidang hidrologi.',
            'Pengambilan data curah hujan untuk tugas akhir.',
            'Kunjungan studi lapangan bersama kelompok mahasiswa.',
            'Memerlukan informasi terkait perizinan pemanfaatan air.',
            'Koordinasi terkait program KKN di wilayah irigasi.',
            'Konsultasi data untuk keperluan penelitian dosen.',
            null, null,
        ];

        $jenisKunjungan = \App\Models\Pelayanan\JenisKunjungan::inRandomOrder()->first();

        return [
            'jenis_kunjungan_id' => $jenisKunjungan?->id,
            'kode_antrian'       => $jenisKunjungan
                ? \App\Models\Pelayanan\Pelayanan::generateKodeAntrian($jenisKunjungan)
                : 'UNKNOWN001',
            'nama_lengkap'       => $nama,
            'email'              => $email,
            'instansi_asal'      => $instansi,
            'nomor_whatsapp'     => '08' . fake()->numerify('##########'),
            'catatan'            => fake()->randomElement($catatan),
            'tanggal_kedatangan' => fake()->dateTimeBetween('-180 days', '+30 days'),
            'status'             => 'selesai',
        ];
    }
}
