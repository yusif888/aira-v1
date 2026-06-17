# Laporan Pengujian Fungsionalitas Backend & CMS — SISDA

| | |
|---|---|
| Versi Sistem | 1.0 |
| Tanggal Pengujian | 21 April 2026 |
| Diuji oleh | Unit IT — Dinas PU SDA Jawa Timur |
| Metode | Manual / Black-box Testing |
| Cakupan | Semua route admin + auth + public API |
| Status | Selesai |

---

## 1. Tujuan

Memverifikasi bahwa seluruh endpoint backend dan fitur CMS berfungsi sesuai spesifikasi: operasi CRUD, validasi input, otorisasi berbasis peran, penanganan error, dan konsistensi data.

---

## 2. Kriteria Penilaian

| Nilai | Keterangan |
|---|---|
| ✅ Lulus | Fungsi berjalan sesuai ekspektasi |
| ⚠️ Minor | Berjalan dengan catatan / perilaku tidak konsisten |
| ❌ Gagal | Fungsi tidak berjalan / error tidak tertangani |
| 🚧 Belum diimplementasi | Route/metode masih dikomentari di kode |

---

## 3. Modul Autentikasi

**Rute terkait:** `/login`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| A-01 | Login dengan kredensial valid | ✅ | Redirect ke `/admin/dashboard` |
| A-02 | Login dengan password salah | ✅ | Pesan error ditampilkan, tidak masuk |
| A-03 | Login dengan email tidak terdaftar | ✅ | Pesan error generik (tidak bocorkan info akun) |
| A-04 | Akses `/admin/*` tanpa login | ✅ | Redirect ke `/login` via middleware `auth` |
| A-05 | Akses `/admin/*` tanpa verifikasi email | ✅ | Redirect ke halaman verifikasi via middleware `verified` |
| A-06 | Forgot password — kirim link reset | ✅ | Email dikirim, token disimpan di `password_reset_tokens` |
| A-07 | Reset password dengan token valid | ✅ | Password berhasil diperbarui |
| A-08 | Reset password dengan token kedaluwarsa | ✅ | Pesan error ditampilkan |
| A-09 | Logout | ✅ | Sesi dihapus, redirect ke `/login` |
| A-10 | Registrasi publik (`/register`) | ✅ | Route ada namun halaman menampilkan notifikasi ditutup |

---

## 4. Modul Berita (CMS)

**Rute terkait:** `admin/berita/*`

### 4.1 Artikel

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| N-01 | Tampil daftar artikel dengan paginasi | ✅ | |
| N-02 | Buat artikel baru dengan semua field terisi | ✅ | Slug di-generate otomatis dari judul |
| N-03 | Buat artikel tanpa field wajib (judul/konten) | ✅ | Validasi Laravel menolak, pesan error ditampilkan |
| N-04 | Upload featured image saat buat artikel | ✅ | File tersimpan di `storage/app/public` |
| N-05 | Upload gambar dengan format tidak didukung | ✅ | Validasi mime type menolak |
| N-06 | Edit artikel — ubah judul, slug tidak berubah | ✅ | Slug hanya di-generate saat create, tidak auto-update |
| N-07 | Ubah status artikel (draft → published) | ✅ | `published_at` terisi otomatis saat status `published` |
| N-08 | Tandai artikel sebagai featured | ✅ | `is_featured` toggle berfungsi |
| N-09 | Soft delete artikel | ✅ | Record tetap ada, `deleted_at` terisi |
| N-10 | Lihat daftar artikel terhapus (`/trash`) | ✅ | |
| N-11 | Restore artikel dari trash | ✅ | `deleted_at` dikosongkan kembali |
| N-12 | Force delete artikel dari trash | ✅ | Record dihapus permanen dari database |
| N-13 | Cek duplikat slug saat buat artikel baru | ✅ | Validasi `unique` berjalan |

### 4.2 Kategori Berita

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| N-14 | Tambah kategori baru | ✅ | |
| N-15 | Tambah kategori dengan nama duplikat | ✅ | Validasi `unique` menolak |
| N-16 | Edit nama kategori | ✅ | |
| N-17 | Hapus kategori yang masih memiliki artikel | ✅ | Cascade delete — artikel ikut terhapus (by design) |

### 4.3 Tag Berita

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| N-18 | Tambah tag baru | ✅ | |
| N-19 | Assign banyak tag ke satu artikel | ✅ | Pivot `news_article_tag` terisi benar |
| N-20 | Hapus tag — relasi pivot ikut terhapus | ✅ | |

---

## 5. Modul Dokumen (CMS)

**Rute terkait:** `admin/dokumen/*`

### 5.1 Entri Dokumen

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| D-01 | Tampil daftar dokumen | ✅ | |
| D-02 | Upload dokumen baru dengan file PDF | ✅ | |
| D-03 | Upload dokumen tanpa memilih tipe | ✅ | Validasi menolak, field `type_id` wajib |
| D-04 | Upload file > 100 MB | ✅ | Server menolak dengan pesan error ukuran file |
| D-05 | Edit metadata dokumen (judul, nomor, tahun) | ✅ | |
| D-06 | Soft delete dokumen | ✅ | |
| D-07 | Lihat daftar dokumen terhapus (`/trash`) | ✅ | |
| D-08 | Restore dokumen dari trash | ✅ | |
| D-09 | Force delete dokumen dari trash | ✅ | File fisik di storage juga dihapus |
| D-10 | Restore semua dokumen sekaligus | 🚧 | Route `restore-all` dikomentari di `documents.php` |
| D-11 | Kosongkan trash sekaligus | 🚧 | Route `empty-trash` dikomentari di `documents.php` |

### 5.2 Kategori & Tipe Dokumen

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| D-12 | Tambah kategori dokumen | ✅ | |
| D-13 | Edit / hapus kategori dokumen | ✅ | |
| D-14 | Tambah tipe dokumen (assign ke kategori) | ✅ | |
| D-15 | Lihat daftar halaman tipe dokumen | 🚧 | Route GET `/tipe` dikomentari — halaman list tipe tidak ada |
| D-16 | Edit / hapus tipe dokumen | ✅ | |

### 5.3 Tag Dokumen

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| D-17 | Tambah dan assign tag ke dokumen | ✅ | Pivot `document_entry_tag` benar |
| D-18 | Hapus tag — pivot ikut terhapus | ✅ | |

---

## 6. Modul Pelayanan

**Rute terkait:** `admin/pelayanan/*`

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| PL-01 | Tampil daftar antrian dengan filter status | ✅ | |
| PL-02 | Lihat detail satu entri antrian | ✅ | |
| PL-03 | Update status antrian → `diproses` | ✅ | Via PATCH `/{id}/status` |
| PL-04 | Update status antrian → `selesai` | ✅ | |
| PL-05 | Update status antrian → `dibatalkan` | ✅ | |
| PL-06 | Update ke nilai status tidak valid | ✅ | Validasi enum menolak |
| PL-07 | Pengunjung submit antrian dari halaman publik | ✅ | `kode_antrian` di-generate unik, status default `pending` |

---

## 7. Modul Infrastruktur SDA

**Rute terkait:** `admin/infrastruktur-sda/*`

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| I-01 | Tampil daftar data infrastruktur | ✅ | |
| I-02 | Tambah infrastruktur tipe `marker` dengan koordinat | ✅ | `latitude` & `longitude` tersimpan benar |
| I-03 | Tambah infrastruktur tanpa koordinat (tipe marker) | ✅ | Validasi menolak — koordinat wajib untuk tipe marker |
| I-04 | Tambah infrastruktur tipe `polygon` dengan GeoJSON | ✅ | JSON divalidasi dan tersimpan di kolom `geojson` |
| I-05 | Upload file GeoJSON eksternal | ✅ | File tersimpan, path disimpan di `file_path` |
| I-06 | Edit data infrastruktur | ✅ | |
| I-07 | Hapus data infrastruktur (soft delete) | ✅ | |
| I-08 | Tambah kategori infrastruktur | ✅ | |
| I-09 | Hapus kategori yang masih memiliki data | ✅ | Cascade delete berjalan (by design) |

---

## 8. Modul Pengguna & Peran

**Rute terkait:** `admin/users/*`, `admin/roles/*`

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| U-01 | Tampil daftar pengguna | ✅ | |
| U-02 | Buat pengguna baru dengan assign peran | ✅ | |
| U-03 | Buat pengguna dengan email duplikat | ✅ | Validasi `unique` menolak |
| U-04 | Edit data pengguna | ✅ | |
| U-05 | Hapus pengguna | ✅ | Relasi ke artikel/dokumen di-set null |
| U-06 | Tambah peran baru | ✅ | |
| U-07 | Assign permission ke peran | ✅ | Spatie Permission pivot terisi benar |
| U-08 | Akses modul tanpa permission yang sesuai | ✅ | Unauthorized / 403 |

---

## 9. Modul Portal Data

**Rute terkait:** `admin/portal-data/*`

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| PD-01 | Tampil daftar dataset | ✅ | |
| PD-02 | Tambah dataset baru | ✅ | |
| PD-03 | Edit dan hapus dataset | ✅ | |
| PD-04 | Publik mengakses dan mengunduh dataset | ✅ | |

---

## 10. Integrasi & Fitur Sistem

| ID | Skenario | Hasil | Catatan |
|---|---|---|---|
| S-01 | Sitemap XML di-generate dengan benar | ✅ | Memuat URL berita dan halaman statis |
| S-02 | Cache cuaca BMKG — data muncul di beranda | ✅ | TTL 60 menit berjalan |
| S-03 | Cache cuaca diperbarui setelah TTL habis | ✅ | |
| S-04 | Redirect `/home` → `/` | ✅ | |
| S-05 | Redirect `/admin` → `/admin/dashboard` | ✅ | |
| S-06 | `php artisan optimize` tidak merusak route | ✅ | Cache route dan config normal |

---

## 11. Rekapitulasi

| Modul | Total Skenario | ✅ Lulus | ⚠️ Minor | ❌ Gagal | 🚧 Belum Impl. |
|---|---|---|---|---|---|
| Autentikasi | 10 | 10 | 0 | 0 | 0 |
| Berita (CMS) | 20 | 20 | 0 | 0 | 0 |
| Dokumen (CMS) | 18 | 15 | 0 | 0 | 3 |
| Pelayanan | 7 | 7 | 0 | 0 | 0 |
| Infrastruktur SDA | 9 | 9 | 0 | 0 | 0 |
| Pengguna & Peran | 8 | 8 | 0 | 0 | 0 |
| Portal Data | 4 | 4 | 0 | 0 | 0 |
| Integrasi Sistem | 6 | 6 | 0 | 0 | 0 |
| **Total** | **82** | **79** | **0** | **0** | **3** |

**Tingkat kelulusan:** 96% (79/82) · 0 gagal · 3 belum diimplementasi

---

## 12. Temuan

| ID | Temuan | Modul | Prioritas | Rekomendasi |
|---|---|---|---|---|
| T-01 | Route `restore-all` dan `empty-trash` untuk dokumen masih dikomentari | Dokumen | Sedang | Implementasi method `restoreAll()` dan `emptyTrash()` di `DocumentController` |
| T-02 | Halaman list tipe dokumen tidak ada — route GET `/tipe` dikomentari | Dokumen | Rendah | Buat halaman manajemen tipe dokumen atau integrasikan ke halaman kategori |
| T-03 | Cascade delete pada kategori berita/infrastruktur menghapus data turunan tanpa konfirmasi tambahan | Berita, Infrastruktur | Rendah | Tambah konfirmasi eksplisit di frontend saat hapus kategori yang masih berisi data |

---

## 13. Kesimpulan

Seluruh fungsionalitas inti backend dan CMS SISDA **berjalan sesuai spesifikasi**. Tidak ada kasus gagal pada fitur yang sudah diimplementasi. Tiga item yang belum selesai (bulk restore dan list tipe dokumen) adalah fitur opsional yang tidak mempengaruhi alur kerja utama pengelolaan konten.
