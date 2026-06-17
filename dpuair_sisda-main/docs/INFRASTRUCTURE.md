# Panduan Teknis Infrastruktur & Pemeliharaan — SISDA

**Stack:** PHP 8.2 · Laravel 12 · PostgreSQL · Nginx · PHP-FPM · Supervisor · Docker

---

## 1. Arsitektur Layanan

```
[ Browser ]
    │
    ▼
[ Nginx :80 ]          ← static files, gzip, reverse proxy
    │
    ▼
[ PHP-FPM :9000 ]      ← Laravel app (Inertia SSR + API routes)
    │
    ├─ [ PostgreSQL ]   ← data utama
    ├─ [ Redis ]        ← session, cache, queue (production)
    └─ [ Storage ]      ← file uploads (local / S3-compatible)
```

Di dalam container, Nginx dan PHP-FPM dijalankan bersamaan via **Supervisor**. Single container, dua proses.

---

## 2. Persyaratan Sistem

| Komponen | Minimum | Rekomendasi |
|---|---|---|
| PHP | 8.2 | 8.3 |
| PostgreSQL | 14 | 15+ |
| Redis | 6 | 7 |
| Node.js | 18 | 20 LTS |
| RAM | 1 GB | 2 GB |
| Storage | 10 GB | 20 GB+ |
| OS | Ubuntu 22.04 | Ubuntu 24.04 |

---

## 3. Setup Development (Lokal)

```bash
# 1. Clone dan masuk direktori
git clone <repo-url> && cd pusdajatim_sisda

# 2. Satu perintah setup
make setup
# Setara dengan:
#   cp .env.example .env
#   composer install
#   npm install
#   php artisan key:generate
#   php artisan migrate --seed

# 3. Jalankan dev server (Laravel + Vite + SSR sekaligus)
npm run dev
```

Akses di `http://localhost:8000`.

---

## 4. Konfigurasi Environment (`.env`)

### Wajib diisi sebelum deploy

```env
APP_KEY=          # generate via: php artisan key:generate
APP_URL=          # contoh: https://sisda.dpuair.jatimprov.go.id
APP_ENV=production
APP_DEBUG=false

DB_HOST=          # IP/hostname PostgreSQL
DB_DATABASE=dpuair_sisda
DB_USERNAME=
DB_PASSWORD=

REDIS_HOST=       # wajib di production untuk session & queue
REDIS_PASSWORD=
```

### Driver production vs development

| Config | Development | Production |
|---|---|---|
| `SESSION_DRIVER` | `database` | `redis` |
| `CACHE_STORE` | `database` | `redis` |
| `QUEUE_CONNECTION` | `database` | `redis` |
| `APP_DEBUG` | `true` | `false` |

> **Jangan** tinggalkan `APP_DEBUG=true` di production — stack trace akan tampil ke publik.

---

## 5. Build & Deploy

### Build image Docker

```bash
docker build -t ghcr.io/dpuair-jatim/sisda:latest .
```

Build menggunakan **multi-stage**:
1. Stage `frontend` (Node 18 Alpine) — compile aset Vite
2. Stage `production` (PHP 8.2-FPM) — install Composer deps, copy aset dari stage 1

### Jalankan container

```bash
# Pastikan external network sudah ada
docker network create sisda_network

docker compose up -d
```

Variabel yang perlu di-set via `.env` atau environment host:

```env
CONTAINER_NAME=sisda_app
DOCKER_IMAGE=ghcr.io/dpuair-jatim/sisda:latest
APP_PORT=8080          # port yang di-expose ke host
DOCKER_NETWORK_NAME=sisda_network
```

### Post-deploy (jalankan di dalam container)

```bash
docker exec sisda_app php artisan migrate --force
docker exec sisda_app php artisan config:cache
docker exec sisda_app php artisan route:cache
docker exec sisda_app php artisan view:cache
docker exec sisda_app php artisan storage:link
```

---

## 6. Konfigurasi Nginx

File: `docker/nginx/conf.d/app.conf`

```nginx
server {
    listen 80;
    root /var/www/html/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
        gzip_static on;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;   # PHP-FPM
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

Untuk HTTPS, pasang SSL termination di reverse proxy luar (Nginx host / Caddy) dan forward ke container di port `APP_PORT`.

---

## 7. Supervisor (Process Manager)

File: `docker/supervisord.conf`

Mengelola dua proses dalam satu container:

| Program | Perintah |
|---|---|
| `php-fpm` | `php-fpm` |
| `nginx` | `nginx -g 'daemon off;'` |

Untuk menambah queue worker, tambahkan blok berikut ke `supervisord.conf`:

```ini
[program:laravel-worker]
command=php /var/www/html/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
autostart=true
autorestart=true
numprocs=2
```

---

## 8. Database

### Backup manual

```bash
# Dari host (PostgreSQL terpisah)
pg_dump -U <username> dpuair_sisda > backup_$(date +%Y%m%d).sql

# Restore
psql -U <username> dpuair_sisda < backup_20260421.sql
```

### Migrasi

```bash
# Jalankan migrasi baru
php artisan migrate

# Rollback satu batch terakhir
php artisan migrate:rollback

# Reset dan seed ulang (HATI-HATI: hapus semua data)
php artisan migrate:fresh --seed
```

### Soft delete

Tabel `news_articles`, `documents_entries`, `data_infrastruktur_sda`, dan `pelayanans` menggunakan soft delete. Data yang "dihapus" tetap ada di database dengan `deleted_at` terisi. Gunakan Tinker untuk restore manual jika dibutuhkan:

```bash
php artisan tinker
>>> \App\Models\NewsArticle::withTrashed()->find(1)->restore();
```

---

## 9. Storage & Upload File

```bash
# Buat symlink public/storage → storage/app/public
php artisan storage:link
```

Batas upload default: **100 MB** per file (dikonfigurasi di `config/filesystems.php` dan server).

Jika menggunakan S3-compatible storage (Cloudflare R2 / MinIO):

```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=auto
AWS_BUCKET=sisda-storage
AWS_ENDPOINT=https://<account>.r2.cloudflarestorage.com
AWS_USE_PATH_STYLE_ENDPOINT=true
```

---

## 10. Cache & Performance

```bash
# Cache konfigurasi, route, dan view (wajib di production)
php artisan optimize

# Bersihkan semua cache (saat ada perubahan config)
php artisan optimize:clear

# Cache cuaca BMKG di-handle otomatis, TTL 60 menit
# Flush manual jika data cuaca stuck:
php artisan cache:clear
```

---

## 11. Logging

Log default ditulis ke `storage/logs/laravel.log`.

```env
LOG_CHANNEL=stack
LOG_LEVEL=error    # production: error | development: debug
```

Di dalam Docker, log PHP-FPM dan Nginx diarahkan ke stdout/stderr container:

```bash
docker logs sisda_app -f
```

---

## 12. Troubleshooting Umum

| Gejala | Kemungkinan Penyebab | Solusi |
|---|---|---|
| `500 Internal Server Error` | `APP_KEY` kosong atau `storage/` tidak writable | `php artisan key:generate`, cek permission `775` |
| Halaman blank / putih | Cache view lama | `php artisan view:clear` |
| Upload gagal | Direktori storage tidak ada symlink | `php artisan storage:link` |
| Login tidak bisa | Session driver Redis tidak terhubung | Cek `REDIS_HOST`, fallback ke `SESSION_DRIVER=database` |
| Cuaca tidak muncul | API BMKG timeout atau cache korup | `php artisan cache:clear` |
| Queue tidak jalan | Worker tidak berjalan | Tambah `[program:laravel-worker]` ke supervisord |
| Peta tidak muncul | API key MapTiler invalid atau habis kuota | Cek `MAPTILER_API_KEY` di env / kode frontend |

---

## 13. Checklist Pemeliharaan Rutin

**Mingguan**
- [ ] Cek ukuran `storage/logs/laravel.log`, rotasi jika > 100 MB
- [ ] Pantau penggunaan disk storage file upload

**Bulanan**
- [ ] Backup database PostgreSQL
- [ ] `composer update` dan `npm update` untuk patch keamanan minor
- [ ] Cek queue failed jobs: `php artisan queue:failed`

**Per Release**
- [ ] Jalankan `php artisan migrate --force` setelah deploy
- [ ] Jalankan `php artisan optimize` setelah deploy
- [ ] Verifikasi `APP_DEBUG=false` di production
