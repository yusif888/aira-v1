# 📝 Panduan Mengisi Konten dpuair_sisda untuk AIRA

Agar AIRA dapat menjawab lebih banyak pertanyaan, isi database dpuair_sisda dengan konten berikut:

---

## 1. Mengisi Berita (News Articles)

### Via Tinker (Cepat untuk Testing):

```bash
cd C:\laragon\www\dpuair_sisda
php artisan tinker
```

```php
// Buat kategori
$category = App\Models\News\NewsCategory::create([
    'name' => 'Berita Utama',
    'slug' => 'berita-utama',
    'description' => 'Berita utama dinas'
]);

// Buat berita
App\Models\News\NewsArticle::create([
    'news_category_id' => $category->id,
    'user_id' => 1, // sesuaikan dengan user id yang ada
    'title' => 'Pembangunan Irigasi Baru di Jawa Timur',
    'slug' => 'pembangunan-irigasi-baru-jawa-timur',
    'excerpt' => 'Dinas PU SDA Jatim melakukan pembangunan jaringan irigasi baru untuk mendukung ketahanan pangan.',
    'content' => '<p>Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur melakukan pembangunan jaringan irigasi baru seluas 500 hektar di wilayah Jawa Timur bagian selatan. Program ini bertujuan untuk meningkatkan produktivitas pertanian dan mendukung ketahanan pangan nasional.</p>',
    'status' => 'published',
    'published_at' => now(),
    'is_featured' => true,
]);
```

### Via Admin Panel (Setelah Login):
1. Login ke dpuair_sisda admin
2. Menu: Admin → News → Create
3. Isi form berita
4. Publish

---

## 2. Mengisi Dokumen (Documents)

```php
// Via tinker
cd C:\laragon\www\dpuair_sisda
php artisan tinker
```

```php
// Buat tipe dokumen
$type = App\Models\Documents\DocumentsType::create([
    'name' => 'Laporan Tahunan',
    'slug' => 'laporan-tahunan'
]);

// Buat dokumen
App\Models\Documents\DocumentsEntry::create([
    'type_id' => $type->id,
    'title' => 'Laporan Tahunan Dinas PU SDA 2024',
    'document_number' => 'LAPORAN/2024/001',
    'year' => 2024,
    'description' => 'Laporan tahunan kegiatan Dinas PU SDA Provinsi Jawa Timur tahun 2024',
    'file_path' => null, // isi jika ada file
    'uploader_id' => 1,
]);
```

---

## 3. Mengisi Portal Data

```php
// Via tinker
cd C:\laragon\www\dpuair_sisda
php artisan tinker
```

```php
App\Models\PortalData\PortalDataDatasets::create([
    'slug' => 'data-irigasi-2024',
    'view_path' => 'portal-data.datasets.irigasi',
    'title' => 'Data Irigasi Jawa Timur 2024',
    'description' => 'Data lengkap jaringan irigasi di Jawa Timur tahun 2024',
    'json_data' => [
        'total_jaringan' => '1.200.000 ha',
        'irigasi_teknis' => '900.000 ha',
        'irigasi_semi_teknis' => '200.000 ha',
        'irigasi_sederhana' => '100.000 ha',
    ],
    'metadata' => [
        'tahun' => 2024,
        'sumber' => 'Dinas PU SDA Jatim',
        'last_update' => now()->format('Y-m-d'),
    ],
    'status' => 'published',
    'author_id' => 1,
]);
```

---

## 4. Setelah Mengisi Konten, Index ke AIRA:

```bash
cd C:\laragon\www\airav1-php80

# Index ulang semua konten
php artisan aira:index-website --fresh

# Atau index spesifik
php artisan aira:index-website --source=news
php artisan aira:index-website --source=documents
php artisan aira:index-website --source=portal-data
```

---

## 5. Verifikasi AIRA Sudah Belajar:

```bash
# Test knowledge base
php test-knowledge-base.php

# Atau via tinker
php artisan tinker
>>> App\Models\WebsiteKnowledge::count()
>>> App\Models\WebsiteKnowledge::where('source_type', 'news')->count()
```

---

## 6. Contoh Konten yang Bagus untuk AIRA:

### Berita:
- Kegiatan pembangunan infrastruktur
- Laporan pelaksanaan program
- Pengumuman penting
- Kegiatan sosialisasi
- Rapat koordinasi

### Dokumen:
- Rencana Kerja Tahunan
- Laporan Keuangan
- SOP (Standard Operating Procedure)
- Peraturan/SK Kepala Dinas
- Panduan layanan

### Portal Data:
- Data irigasi per kabupaten/kota
- Data waduk dan bendungan
- Data debit sungai
- Data curah hujan
- Statistik infrastruktur

---

## 7. Tips Konten yang SEO-Friendly untuk AIRA:

✅ **Judul Jelas:** "Pembangunan Irigasi..." bukan "Info penting"
✅ **Gunakan Keywords:** Irigasi, waduk, bendungan, sumber daya air, dll
✅ **Excerpt Informatif:** Ringkasan yang jelas di 2-3 kalimat
✅ **Konten Lengkap:** Jelaskan secara detail
✅ **Tag yang Relevan:** Tambahkan tags untuk easy searching

---

## 8. Auto-Update AIRA (Optional):

Edit `app/Console/Kernel.php` di airav1-php80:

```php
protected function schedule(Schedule $schedule)
{
    // Update knowledge base setiap hari jam 2 pagi
    $schedule->command('aira:index-website')
        ->daily()
        ->at('02:00');
}
```

Jalankan scheduler:
```bash
# Windows Task Scheduler atau
php artisan schedule:work
```

---

## 🎯 Goal:

Dengan mengisi konten yang berkualitas di dpuair_sisda, AIRA akan:
- Menjawab 90%+ pertanyaan umum
- Memberikan informasi real-time tentang kegiatan dinas
- Membantu masyarakat mengakses informasi dengan mudah
- Mengurangi beban customer service

---

**Happy Filling! 🚀**
