# Software Requirements Specification — SISDA

**Sistem Informasi Sumber Daya Air**
Dinas PU Sumber Daya Air Provinsi Jawa Timur

| | |
|---|---|
| Versi | 1.0 |
| Status | Draft |
| Tanggal | 21 April 2026 |
| Disusun oleh | Unit IT — Dinas PU SDA Jatim |

---

## 1. Pendahuluan

SISDA adalah portal web terpadu untuk pengelolaan dan publikasi informasi sumber daya air di Jawa Timur. Sistem melayani dua segmen: **publik** (akses informasi tanpa login) dan **internal** (manajemen konten oleh staf dinas).

**Stack:** Laravel 12 · React 19 · Inertia.js · PostgreSQL · Tailwind CSS · Vite

---

## 2. Pengguna & Peran

| Peran | Akses |
|---|---|
| Masyarakat Umum | Baca berita, unduh dokumen, lihat peta & antrian (tanpa akun) |
| Super Admin | Full access — kelola pengguna, peran, dan semua modul |
| Content Manager | Berita, dokumen, galeri |
| Service Manager | Antrian pelayanan publik |
| Data Manager | Infrastruktur SDA, statistik, dataset |

Registrasi publik dinonaktifkan. Akun hanya dibuat oleh Super Admin.

---

## 3. Kebutuhan Fungsional

### 3.1 Berita & Konten
- Daftar dan detail berita dengan paginasi, filter kategori/tag
- CRUD artikel + soft delete/restore oleh admin
- Artikel mendukung multi-gambar, lampiran, dan komentar termoderasi
- Editor WYSIWYG (ReactQuill), slug unik, view count, metadata SEO

### 3.2 Dokumen
- Repositori dokumen publik dengan filter kategori/jenis/tag
- Upload file maks. 100 MB; soft delete/restore

### 3.3 Pelayanan Publik
- Informasi antrian layanan FHD, SIH3, JOSS untuk publik
- Admin kelola status antrian secara real-time

### 3.4 Infrastruktur SDA
- Peta interaktif (MapLibre GL + MapTiler) untuk lokasi infrastruktur air
- Dukungan GeoJSON untuk geometri kompleks
- CRUD data infrastruktur dengan koordinat dan kategori

### 3.5 Statistik & Portal Data
- Dashboard statistik tahunan SDA dengan Chart.js (2024, 2025)
- Dataset terbuka yang dapat diunduh publik; admin kelola via panel

### 3.6 Autentikasi & Otorisasi
- Login email/password + verifikasi email (Laravel Breeze)
- RBAC via Spatie Permission — peran dan izin granular per pengguna
- Reset password via email

### 3.7 Integrasi BMKG
- Data cuaca real-time untuk 41 kab/kota Jawa Timur di halaman utama
- Cache 60 menit untuk efisiensi API call

---

## 4. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| Performa | Halaman publik SSR (TTFB rendah); admin CSR (interaktivitas optimal) |
| SEO | Meta tag dinamis, sitemap XML otomatis, structured data |
| Keamanan | Middleware auth+verified pada semua route admin; sanitasi DOMPurify + validasi Laravel |
| Responsivitas | Mobile-friendly, mendukung 375px–1920px |
| Maintainability | Soft delete untuk entitas utama, migrasi terversi, PSR-12 + React hooks convention |

---

## 5. Batasan

- Koneksi internet diperlukan untuk tile peta (MapTiler) dan cuaca (BMKG)
- Upload maksimal 100 MB per file
- Data statistik diinput manual per tahun anggaran
- Tidak ada fitur pembayaran atau transaksi finansial
- Dioptimalkan untuk Chrome 90+, Firefox 88+, Safari 14+

---

## 6. Roadmap

| Fitur | Prioritas |
|---|---|
| Pencarian full-text lintas modul | Tinggi |
| Notifikasi email untuk antrian layanan | Sedang |
| Dashboard analitik admin | Sedang |
| API publik (REST) untuk pihak ketiga | Rendah |
| Galeri foto/video terintegrasi | Rendah |
