<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\WebsiteKnowledge;
use Illuminate\Support\Facades\File;

class IndexStaticPages extends Command
{
    protected $signature = 'aira:index-static-pages';
    protected $description = 'Index static pages and profile information from dpuair_sisda';

    public function handle()
    {
        $this->info('📄 Indexing Static Pages and Profile Information...');

        // Data profil organisasi Dinas PU Sumber Daya Air Jawa Timur
        $staticPages = [
            [
                'title' => 'Tentang Dinas PU Sumber Daya Air Provinsi Jawa Timur',
                'content' => 'Dinas Pekerjaan Umum Sumber Daya Air (PU SDA) Provinsi Jawa Timur adalah instansi pemerintah yang bertanggung jawab atas pengelolaan sumber daya air di wilayah Jawa Timur. Dinas ini memiliki tugas pokok dalam perencanaan, pelaksanaan, dan pengawasan di bidang infrastruktur sumber daya air seperti irigasi, waduk, bendungan, dan pengendalian banjir.',
                'summary' => 'Dinas PU SDA Jatim adalah instansi pengelola sumber daya air di Jawa Timur',
                'keywords' => ['dinas', 'pu', 'sumber daya air', 'jawa timur', 'jatim', 'infrastruktur', 'irigasi', 'tentang'],
                'url' => '/profil',
            ],
            [
                'title' => 'Visi dan Misi Dinas PU Sumber Daya Air Jatim',
                'content' => 'VISI: Terwujudnya Pengelolaan Sumber Daya Air yang Berkelanjutan untuk Kesejahteraan Masyarakat Jawa Timur. 
                
MISI:
1. Meningkatkan ketersediaan dan kualitas infrastruktur sumber daya air
2. Mengoptimalkan pengelolaan dan pendayagunaan sumber daya air
3. Meningkatkan konservasi sumber daya air
4. Meningkatkan pengendalian daya rusak air
5. Meningkatkan partisipasi masyarakat dalam pengelolaan sumber daya air
6. Meningkatkan kapasitas kelembagaan dan SDM',
                'summary' => 'Visi: Pengelolaan SDA berkelanjutan. Misi: Infrastruktur, konservasi, pengendalian, dan partisipasi masyarakat',
                'keywords' => ['visi', 'misi', 'tujuan', 'berkelanjutan', 'infrastruktur', 'konservasi', 'irigasi'],
                'url' => '/profil/visi-misi',
            ],
            [
                'title' => 'Struktur Organisasi Dinas PU SDA Jatim',
                'content' => 'Struktur Organisasi Dinas PU Sumber Daya Air Provinsi Jawa Timur terdiri dari:

- Kepala Dinas
- Sekretariat (dipimpin Sekretaris)
  - Sub Bagian Umum dan Kepegawaian
  - Sub Bagian Keuangan
  - Sub Bagian Perencanaan dan Pelaporan
- Bidang Bina Konstruksi
- Bidang Irigasi dan Rawa
- Bidang Sungai dan Pantai
- Bidang Operasi dan Pemeliharaan
- Unit Pelaksana Teknis (UPT)
- Kelompok Jabatan Fungsional',
                'summary' => 'Struktur organisasi terdiri dari Kepala Dinas, Sekretariat, dan beberapa bidang teknis',
                'keywords' => ['struktur organisasi', 'kepala dinas', 'sekretariat', 'bidang', 'upt', 'organisasi'],
                'url' => '/profil/struktur-organisasi',
            ],
            [
                'title' => 'Tugas dan Fungsi Sekretariat',
                'content' => 'Sekretariat dipimpin oleh Sekretaris yang berada di bawah dan bertanggung jawab kepada Kepala Dinas. Sekretariat mempunyai tugas:

1. Merencanakan kegiatan administrasi umum dan kepegawaian
2. Melaksanakan pengelolaan keuangan dan pelaporan
3. Mengoordinasikan penyusunan program dan kegiatan
4. Mengelola hubungan masyarakat dan protokol
5. Melaksanakan urusan perlengkapan dan rumah tangga

Sekretaris dalam melaksanakan tugasnya dibantu oleh Kepala Sub Bagian Umum dan Kepegawaian, Kepala Sub Bagian Keuangan, dan Kelompok Jabatan Fungsional.',
                'summary' => 'Sekretariat mengelola administrasi, keuangan, program, humas, dan perlengkapan dinas',
                'keywords' => ['sekretariat', 'sekretaris', 'tugas', 'fungsi', 'administrasi', 'kepegawaian', 'keuangan'],
                'url' => '/profil/tugas-fungsi',
            ],
            [
                'title' => 'Layanan Dinas PU SDA Jatim',
                'content' => 'Dinas PU Sumber Daya Air Provinsi Jawa Timur memberikan berbagai layanan kepada masyarakat:

1. Informasi Publik
   - Berita dan pengumuman terkini
   - Dokumen perencanaan dan laporan
   - Data dan statistik sumber daya air

2. Layanan Perizinan
   - Izin penggunaan sumber daya air
   - Izin bangunan di sempadan sungai

3. Pengaduan dan Aspirasi
   - Laporan kerusakan infrastruktur
   - Saran dan masukan masyarakat

4. Portal Data
   - Data irigasi
   - Data waduk dan bendungan
   - Data debit sungai
   - Data curah hujan',
                'summary' => 'Layanan meliputi informasi publik, perizinan, pengaduan, dan portal data SDA',
                'keywords' => ['layanan', 'informasi publik', 'perizinan', 'pengaduan', 'portal data', 'irigasi'],
                'url' => '/layanan',
            ],
            [
                'title' => 'Jam Operasional dan Kontak Dinas PU SDA Jatim',
                'content' => 'JAM OPERASIONAL:
Senin - Jumat: 08.00 - 16.00 WIB
Istirahat: 12.00 - 13.00 WIB
Sabtu, Minggu, dan Hari Libur: Tutup

KONTAK:
Alamat: Jl. Gayungsari Timur No. 1, Surabaya, Jawa Timur
Telepon: (031) 8292814
Email: dpusda@jatimprov.go.id
Website: www.dpusda.jatimprov.go.id

MEDIA SOSIAL:
Instagram: @dpusda_jatim
Facebook: Dinas PU SDA Jawa Timur
Twitter: @dpusda_jatim',
                'summary' => 'Jam kerja Senin-Jumat 08.00-16.00 WIB. Kontak via telepon, email, dan media sosial',
                'keywords' => ['jam kerja', 'kontak', 'alamat', 'telepon', 'email', 'media sosial', 'operasional'],
                'url' => '/kontak',
            ],
            [
                'title' => 'Program Prioritas Dinas PU SDA Jatim',
                'content' => 'Program Prioritas Dinas PU Sumber Daya Air Provinsi Jawa Timur:

1. REHABILITASI DAN PEMELIHARAAN IRIGASI
   - Perbaikan jaringan irigasi
   - Normalisasi saluran
   - Peningkatan efisiensi air

2. PENGENDALIAN BANJIR
   - Pembangunan tanggul
   - Normalisasi sungai
   - Pembuatan kolam retensi

3. KONSERVASI SUMBER DAYA AIR
   - Pembuatan embung
   - Reboisasi DAS
   - Pengelolaan mata air

4. PEMBANGUNAN INFRASTRUKTUR BARU
   - Bendungan baru
   - Waduk dan embung
   - Jaringan irigasi baru

5. DIGITALISASI LAYANAN
   - Portal data online
   - Sistem informasi geografis
   - Aplikasi monitoring',
                'summary' => 'Program prioritas: rehabilitasi irigasi, pengendalian banjir, konservasi, infrastruktur baru, dan digitalisasi',
                'keywords' => ['program', 'prioritas', 'irigasi', 'banjir', 'konservasi', 'infrastruktur', 'digitalisasi'],
                'url' => '/program',
            ],
            [
                'title' => 'Informasi Irigasi Jawa Timur',
                'content' => 'JARINGAN IRIGASI JAWA TIMUR:

Total Jaringan Irigasi: ±1,2 juta hektar
- Irigasi Teknis: 900.000 ha
- Irigasi Semi Teknis: 200.000 ha
- Irigasi Sederhana: 100.000 ha

DAERAH IRIGASI BESAR:
1. DI Brantas (melayani 300.000+ ha)
2. DI Jratunseluna
3. DI Bengawan Solo

MANFAAT IRIGASI:
- Mendukung ketahanan pangan
- Meningkatkan produktivitas pertanian
- Mengatur tata air
- Mengurangi ketergantungan air hujan

STATUS KONDISI:
- Baik: 60%
- Sedang: 30%
- Rusak: 10%',
                'summary' => 'Jatim memiliki 1,2 juta ha jaringan irigasi dengan kondisi mayoritas baik',
                'keywords' => ['irigasi', 'jaringan irigasi', 'pertanian', 'daerah irigasi', 'brantas', 'data irigasi'],
                'url' => '/portal-data/irigasi',
            ],
            [
                'title' => 'Bendungan dan Waduk di Jawa Timur',
                'content' => 'BENDUNGAN DAN WADUK UTAMA DI JAWA TIMUR:

1. Waduk Pacal (Bojonegoro)
   - Kapasitas: 18,8 juta m³
   - Fungsi: Irigasi dan PLTA

2. Waduk Bening (Saradan, Madiun)
   - Kapasitas: 22,88 juta m³
   - Fungsi: Irigasi, PLTA, pariwisata

3. Waduk Jatigede (Surabaya)
   - Fungsi: Irigasi dan air baku

4. Waduk Widas (Madiun)
   - Kapasitas: 14 juta m³
   - Fungsi: Irigasi dan pengendalian banjir

5. Waduk Gondang (Lamongan)
   - Kapasitas: 17,2 juta m³
   - Fungsi: Irigasi dan air baku

MANFAAT:
- Penyediaan air irigasi
- Pengendalian banjir
- PLTA (Pembangkit Listrik Tenaga Air)
- Penyediaan air baku
- Pariwisata',
                'summary' => 'Jatim memiliki beberapa waduk besar untuk irigasi, PLTA, dan pengendalian banjir',
                'keywords' => ['waduk', 'bendungan', 'pacal', 'bening', 'widas', 'gondang', 'irigasi', 'plta'],
                'url' => '/portal-data/waduk',
            ],
            [
                'title' => 'AIRA - Asisten Virtual Dinas PU SDA Jatim',
                'content' => 'AIRA (Asisten Informasi dan Respon Otomatis) adalah chatbot virtual yang dikembangkan oleh Dinas PU Sumber Daya Air Provinsi Jawa Timur untuk membantu masyarakat mendapatkan informasi dengan cepat dan mudah.

FUNGSI AIRA:
- Menjawab pertanyaan umum tentang dinas
- Memberikan informasi layanan
- Menjelaskan program dan kegiatan
- Menyediakan data dan statistik
- Membantu navigasi website

SUMBER INFORMASI AIRA:
1. Kamus Internal - Jawaban yang telah didefinisikan
2. Website Knowledge Base - Konten dari website resmi
3. Tidak menggunakan AI eksternal seperti DeepSeek

CARA MENGGUNAKAN:
Cukup ketik pertanyaan Anda di kolom chat dan AIRA akan memberikan jawaban berdasarkan informasi resmi dari Dinas PU SDA Jatim.

DIKEMBANGKAN OLEH:
Yusif, S.Kom - Tim IT Dinas PU SDA Jatim',
                'summary' => 'AIRA adalah chatbot virtual untuk membantu masyarakat mendapatkan informasi Dinas PU SDA Jatim',
                'keywords' => ['aira', 'chatbot', 'asisten virtual', 'informasi', 'ai', 'teknologi', 'layanan digital'],
                'url' => '/aira',
            ],
        ];

        $bar = $this->output->createProgressBar(count($staticPages));
        $bar->start();

        foreach ($staticPages as $page) {
            WebsiteKnowledge::updateOrCreate(
                [
                    'source_type' => 'page',
                    'title' => $page['title'],
                ],
                [
                    'content' => $page['content'],
                    'summary' => $page['summary'],
                    'keywords' => $page['keywords'],
                    'url' => url($page['url']),
                    'metadata' => [
                        'type' => 'static_page',
                        'category' => 'profil_organisasi',
                    ],
                    'is_active' => true,
                    'source_updated_at' => now(),
                ]
            );

            $bar->advance();
        }

        $bar->finish();
        $this->info("\n✓ Indexed " . count($staticPages) . " static pages");

        return Command::SUCCESS;
    }
}
