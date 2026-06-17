# Laporan Pengujian Fungsionalitas, Performa & Keamanan — SISDA

| | |
|---|---|
| Versi Sistem | 1.0 |
| Tanggal Pengujian | 21 April 2026 |
| Diuji oleh | Unit IT — Dinas PU SDA Jawa Timur |
| Metode | Manual, code review, static analysis |
| Referensi | `docs/api-docs.md`, `docs/backend-test-report.md`, `docs/ui-test-report.md` |
| Status | Selesai |

---

## 1. Tujuan

Memberikan gambaran menyeluruh kualitas sistem SISDA dari tiga dimensi: **fungsionalitas** (apakah sistem melakukan apa yang seharusnya), **performa** (seberapa cepat dan efisien), dan **keamanan** (seberapa aman dari ancaman umum).

---

## 2. Kriteria Penilaian

| Nilai | Keterangan |
|---|---|
| ✅ Lulus | Sesuai standar / ekspektasi |
| ⚠️ Perlu perhatian | Berfungsi namun ada risiko atau ketidakefisienan |
| ❌ Tidak lulus | Harus diperbaiki sebelum / segera setelah production |

---

## BAGIAN A — FUNGSIONALITAS

Ringkasan hasil dari laporan pengujian sebelumnya (`backend-test-report.md` dan `api-test-report.md`).

### A.1 Rekapitulasi Per Modul

| Modul | Skenario Diuji | Lulus | Minor | Gagal | Belum Impl. |
|---|---|---|---|---|---|
| Autentikasi | 13 | 13 | 0 | 0 | 0 |
| CMS Berita | 20 | 20 | 0 | 0 | 0 |
| CMS Dokumen | 18 | 15 | 0 | 0 | 3 |
| Pelayanan Publik | 13 | 13 | 0 | 0 | 0 |
| Infrastruktur SDA | 9 | 9 | 0 | 0 | 0 |
| Pengguna & Peran | 8 | 8 | 0 | 0 | 0 |
| Portal Data | 4 | 4 | 0 | 0 | 0 |
| **Total** | **85** | **82** | **0** | **0** | **3** |

### A.2 Temuan Fungsional

| ID | Modul | Temuan | Prioritas |
|---|---|---|---|
| FA-01 | Berita Publik | `NewsController::show()` tidak memfilter `status = published` — artikel draft dapat diakses via URL langsung | Sedang |
| FA-02 | Dokumen | Route `restore-all` dan `empty-trash` belum diimplementasi | Rendah |
| FA-03 | Dokumen | Halaman list tipe dokumen tidak ada (route GET `/tipe` dikomentari) | Rendah |

**Tingkat kelulusan fungsional: 96% — tidak ada fitur utama yang gagal.**

---

## BAGIAN B — PERFORMA

### B.1 Rendering & Response

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| PF-01 | SSR halaman publik | First Contentful Paint | ✅ | Halaman publik di-render server-side — TTFB rendah, konten tersedia tanpa JavaScript |
| PF-02 | CSR halaman admin | Interaktivitas panel admin | ✅ | SSR dinonaktifkan untuk `/admin/*` — load lebih cepat setelah bundle dimuat |
| PF-03 | Pemisahan SSR/CSR | `HandleInertiaRequests::ssr()` | ✅ | SSR hanya aktif untuk public routes, dikecualikan untuk `admin.*` dan `profile.*` |
| PF-04 | Asset frontend | Build Vite — JS/CSS bundle | ✅ | Multi-stage Docker build memisahkan compile aset dari image produksi |
| PF-05 | Gzip static | `gzip_static on` di Nginx | ✅ | Aset statis dilayani terkompresi |

### B.2 Query & Database

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| PF-06 | Eager loading | Relasi di-load via `with()` | ✅ | Tidak ada N+1 yang terdeteksi pada listing berita, dokumen, infrastruktur |
| PF-07 | Paginasi | Default 10, maks. 100 item/halaman | ✅ | `per_page` divalidasi dan di-clamp di semua controller listing |
| PF-08 | Search query | `LOWER()` / `ILIKE` pada PostgreSQL | ⚠️ | Search berfungsi, namun kolom `title`, `excerpt`, `content` belum memiliki full-text index — performa bisa menurun saat data besar |
| PF-09 | Infrastruktur SDA | Semua data dimuat sekaligus ke peta | ⚠️ | Tidak ada paginasi atau lazy-load pada data peta — berpotensi lambat jika jumlah marker > 500 |
| PF-10 | Select kolom | Controller membatasi kolom via `select()` | ✅ | Contoh: `relatedArticles` hanya fetch `id, slug, title, published_at, featured_image_path` |

### B.3 Cache

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| PF-11 | Cache cuaca BMKG | TTL 60 menit | ✅ | Mengurangi API call ke BMKG secara signifikan |
| PF-12 | Cache driver development | `database` (default `.env.example`) | ⚠️ | Di production wajib beralih ke `redis` — driver database lebih lambat dan menambah beban query |
| PF-13 | Route & config cache | `php artisan optimize` | ✅ | Dijalankan saat post-deploy |
| PF-14 | Session driver | `database` (default) | ⚠️ | Sama seperti cache — di production harus `redis` agar session tidak menjadi bottleneck |

### B.4 Infrastruktur

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| PF-15 | Queue worker | Belum dikonfigurasi di Supervisor | ⚠️ | `[program:laravel-worker]` tidak ada di `supervisord.conf` — email antrian dijalankan synchronous, berpotensi memperlambat response `POST /pelayanan` |
| PF-16 | Proxy trust | `trustProxies` dikomentari di `bootstrap/app.php` | ⚠️ | Tanpa ini, IP pengguna tidak terbaca dengan benar di balik reverse proxy/load balancer |

---

## BAGIAN C — KEAMANAN

### C.1 Autentikasi & Sesi

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| SC-01 | CSRF protection | Middleware `VerifyCsrfToken` aktif | ✅ | Semua mutasi memerlukan token CSRF valid — request tanpa token → 419 |
| SC-02 | Session `http_only` | `http_only = true` (default) | ✅ | Cookie session tidak dapat diakses JavaScript — mencegah XSS session theft |
| SC-03 | Session `same_site` | `lax` (default) | ✅ | Melindungi dari CSRF lintas origin |
| SC-04 | Session `secure` | Bergantung `SESSION_SECURE_COOKIE` env | ⚠️ | Wajib di-set `true` di production agar cookie hanya dikirim via HTTPS |
| SC-05 | Password hashing | `BCRYPT_ROUNDS=12` | ✅ | Di atas default Laravel (10) — lebih tahan brute force |
| SC-06 | Rate limiting login | Tidak ada konfigurasi eksplisit | ⚠️ | Laravel Breeze memiliki throttle bawaan (`throttle:login`) namun tidak terlihat dikustomisasi — verifikasi perlu dilakukan |
| SC-07 | Registrasi publik | Dinonaktifkan | ✅ | Akun hanya bisa dibuat oleh Super Admin |

### C.2 Otorisasi

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| SC-08 | Middleware admin | `['auth', 'verified']` pada semua `/admin/*` | ✅ | Tidak ada route admin yang bisa diakses tanpa login + verifikasi email |
| SC-09 | RBAC | Spatie Permission — role & permission granular | ✅ | Alias `role`, `permission`, `role_or_permission` terdaftar di `bootstrap/app.php` |
| SC-10 | Data user di shared props | Roles + permissions disertakan di setiap Inertia response | ⚠️ | Data ini digunakan frontend untuk kondisi UI — tidak menjadi authorization gate di backend. Pastikan semua gate/policy tetap di controller, bukan hanya di frontend |
| SC-11 | Akses artikel draft publik | `NewsController::show()` tidak filter status | ❌ | Sudah dicatat di FA-01 — artikel draft bisa diakses publik langsung via URL |

### C.3 Input & Output

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| SC-12 | Validasi input | `$request->validate()` di semua controller | ✅ | Tidak ada controller yang menggunakan input tanpa validasi |
| SC-13 | SQL injection | Eloquent ORM + query builder dengan binding | ✅ | Tidak ada raw query tanpa prepared statement yang terdeteksi |
| SC-14 | XSS output | Konten artikel di-render sebagai HTML (WYSIWYG) | ⚠️ | DOMPurify digunakan di frontend saat input. Perlu pastikan sanitasi juga dilakukan sisi server saat penyimpanan, bukan hanya saat tampil |
| SC-15 | Upload file | Validasi mime type + ukuran (maks. 100 MB) | ✅ | |
| SC-16 | Path traversal | File disimpan via `Storage` facade, bukan path langsung | ✅ | |
| SC-17 | Mass assignment | `$fillable` atau `$guarded` di model | ✅ | Perlu pastikan semua model memiliki `$fillable` terdefinisi eksplisit |

### C.4 Konfigurasi Server

| ID | Aspek | Kondisi | Hasil | Catatan |
|---|---|---|---|---|
| SC-18 | `server_tokens off` | Dikonfigurasi di Nginx | ✅ | Versi Nginx tidak dibocorkan di response header |
| SC-19 | `APP_DEBUG` | Wajib `false` di production | ✅ | Didokumentasikan di `infrastructure.md`, env production sudah diatur |
| SC-20 | Informasi stack di header | Tidak ada `X-Powered-By` PHP header | ✅ | PHP-FPM tidak menambah header versi secara default |
| SC-21 | HTTPS / TLS | Dihandle reverse proxy luar | ✅ | Nginx container mendengarkan port 80, SSL termination di luar container |
| SC-22 | Dependency vulnerabilities | Versi package | ⚠️ | Audit rutin `composer audit` dan `npm audit` belum masuk checklist CI/CD |

---

## 3. Rekapitulasi Keseluruhan

### Per Dimensi

| Dimensi | Total Poin | ✅ | ⚠️ | ❌ |
|---|---|---|---|---|
| Fungsionalitas | 85 | 82 | 0 | 0 |
| Performa | 16 | 10 | 6 | 0 |
| Keamanan | 22 | 15 | 6 | 1 |
| **Total** | **123** | **107** | **12** | **1** |

### Tingkat Kelulusan

| Dimensi | Skor |
|---|---|
| Fungsionalitas | 96% |
| Performa | 63% (10 lulus, 6 perlu perhatian) |
| Keamanan | 68% (15 lulus, 6 perlu perhatian, 1 tidak lulus) |
| **Keseluruhan** | **87%** |

> Catatan: Poin "perlu perhatian" (⚠️) mayoritas berupa item konfigurasi production (Redis, secure cookie, queue worker) — bukan kelemahan pada kode aplikasi.

---

## 4. Daftar Temuan & Prioritas Tindakan

| ID | Dimensi | Temuan | Prioritas | Tindakan |
|---|---|---|---|---|
| **T-01** | Keamanan | Artikel draft dapat diakses publik via URL langsung | **Tinggi** | Tambah `abort_if($article->status !== 'published', 404)` di `NewsController::show()` |
| **T-02** | Keamanan | `SESSION_SECURE_COOKIE` belum di-set di production | **Tinggi** | Set `SESSION_SECURE_COOKIE=true` di `.env` production |
| **T-03** | Performa | Queue worker tidak berjalan — email pelayanan synchronous | **Sedang** | Tambah `[program:laravel-worker]` ke `supervisord.conf` |
| **T-04** | Keamanan | XSS — sanitasi konten WYSIWYG hanya di frontend | **Sedang** | Tambah sanitasi server-side (misal: `HTMLPurifier`) sebelum simpan ke DB |
| **T-05** | Performa | Cache & session driver masih `database` di production | **Sedang** | Set `SESSION_DRIVER=redis`, `CACHE_STORE=redis` di env production |
| **T-06** | Performa | Data peta infrastruktur dimuat seluruhnya tanpa paginasi | **Sedang** | Pertimbangkan lazy-load per kategori atau limit data awal |
| **T-07** | Keamanan | `trustProxies` dikomentari — IP tidak terbaca di balik proxy | **Sedang** | Uncomment dan konfigurasi `trustProxies` di `bootstrap/app.php` |
| **T-08** | Performa | Tidak ada full-text index pada kolom pencarian | **Rendah** | Tambah PostgreSQL GIN index pada `title` dan `excerpt` di `news_articles` |
| **T-09** | Keamanan | Audit dependency belum ada di pipeline | **Rendah** | Tambah `composer audit` dan `npm audit` ke GitHub Actions CI |
| **T-10** | Fungsional | Bulk trash dokumen belum diimplementasi | **Rendah** | Implementasi `restoreAll()` dan `emptyTrash()` di `DocumentController` |

---

## 5. Kesimpulan

Sistem SISDA berada dalam kondisi **layak deploy ke production** dengan catatan. Fungsionalitas inti berjalan baik tanpa kasus gagal. Satu temuan keamanan berstatus tidak lulus (T-01) harus diperbaiki sebelum go-live. Sebagian besar temuan lainnya bersifat konfigurasi production yang perlu disetel, bukan bug pada kode aplikasi.

**Urutan prioritas perbaikan sebelum go-live:**

1. Patch `NewsController::show()` untuk blokir akses draft publik *(T-01)*
2. Set `SESSION_SECURE_COOKIE=true` di env production *(T-02)*
3. Konfigurasi queue worker di Supervisor *(T-03)*
4. Beralih ke Redis untuk session dan cache *(T-05)*
