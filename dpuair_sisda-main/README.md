# PUSDA Jatim - Sistem Informasi Sumber Daya Air

Sistem Informasi terpadu untuk Dinas Pekerjaan Umum (PU) Sumber Daya Air Provinsi Jawa Timur. Proyek ini bertujuan untuk menjadi pusat data, informasi, layanan, dan transparansi publik terkait pengelolaan sumber daya air di wilayah Jawa Timur.

## 🚀 Tumpukan Teknologi (Tech Stack)

Proyek ini dibangun menggunakan arsitektur modern yang memisahkan backend dan frontend, namun tetap terintegrasi dengan mulus.

- **Backend**: [Laravel](https://laravel.com/)
- **Frontend**: [React](https://reactjs.org/)
- **Connector**: [Inertia.js](https://inertiajs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 📊 Status Proyek

Proyek ini berada pada **tahap awal pengembangan**.

- ✅ **Fondasi Backend & Frontend**: Struktur dasar Laravel dan React sudah kokoh, termasuk routing dan sistem layout.
- ✅ **Otentikasi**: Sistem login dan registrasi standar sudah berfungsi.
- ✅ **Halaman Statis & Navigasi**: Sebagian besar halaman informasi statis (seperti Profil, Visi & Misi) telah dibuat. Struktur navigasi utama (mega menu) bersifat dinamis, mengambil data dari file-file JSON di `resources/js/data/`.
- ❌ **Fitur Dinamis**: Sebagian besar fitur dinamis yang dijelaskan dalam `blueprint` (misalnya Berita, Program, Galeri, Layanan Data) **belum memiliki implementasi backend** (model, controller, database).

## 📚 Dokumentasi

- [Arsitektur Sistem](ARCHITECTURE.md)
- [Modul](docs/MODULES.md)
- [Walkthrough & Changelog](walkthrough.md)

## ⚡ Quick Start (via Makefile)

Jika Anda menggunakan Linux/Mac, Anda bisa menggunakan command `make` untuk setup lebih cepat:

```bash
# Setup awal (install dependency, copy env, generate key, migrate)
make setup

# Menjalankan server development (Vite + Laravel)
make dev   # di terminal 1
make serve # di terminal 2
```

## 🛠️ Panduan Instalasi Manual

Untuk menjalankan proyek ini di lingkungan lokal, ikuti langkah-langkah berikut:

1.  **Clone repository ini:**

    ```bash
    git clone [URL_REPOSITORY_ANDA]
    cd pusdajatim_sisda2
    ```

2.  **Install dependensi Backend (PHP):**

    ```bash
    composer install
    ```

3.  **Persiapan file environment:**

    ```bash
    cp .env.example .env
    ```

    Setelah itu, konfigurasi koneksi database Anda (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) di dalam file `.env`.

4.  **Generate application key:**

    ```bash
    php artisan key:generate
    ```

5.  **Jalankan migrasi database:**

    ```bash
    php artisan migrate
    ```

    Ini akan membuat tabel-tabel yang diperlukan, seperti `users`.

6.  **(Opsional) Jalankan database seeder:**

    ```bash
    php artisan db:seed
    ```

    _Catatan: Saat ini, seeder utama hanya memanggil `MasterPortalSeeder` yang merujuk pada kode yang tidak lagi digunakan. Anda bisa mengabaikan atau membersihkan seeder ini._

7.  **Install dependensi Frontend (Node.js):**

    ```bash
    npm install
    ```

8.  **Jalankan build tools (Vite):**

    ```bash
    npm run dev
    ```

9.  **Jalankan server development Laravel:**
    Di terminal terpisah, jalankan:
    ```bash
    php artisan serve
    ```

Sekarang, aplikasi Anda seharusnya sudah dapat diakses di `http://127.0.0.1:8000`.

## 📂 Struktur Proyek

Berikut adalah gambaran singkat tentang direktori-direktori penting untuk mempermudah navigasi:

- `app/Http/Controllers/`:
    - `Admin/`: Berisi controller untuk halaman-halaman di area admin (memerlukan login).
    - `Public/`: Berisi controller untuk halaman yang dapat diakses publik.
    - `StaticController.php`: Controller utama yang menangani rendering halaman-halaman statis.

- `routes/web.php`: File utama untuk mendefinisikan semua rute aplikasi.

- `resources/js/`:
    - `Admin/`: Komponen React dan halaman khusus untuk area admin.
    - `Public/`: Komponen React dan halaman untuk area publik.
    - `Components/`: Komponen React umum yang dapat digunakan kembali (Tombol, Modal, dll).
    - `Layouts/`: Komponen layout utama (misalnya `GuestLayout.jsx`).
    - `Pages/`: Komponen React yang merepresentasikan satu halaman penuh (misalnya `Welcome.jsx`, `Static/VisiMisi.jsx`).
    - `data/`: Berisi file-file `.json` yang menjadi sumber data untuk navigasi mega menu.

- `database/`:
    - `migrations/`: Berisi file skema database.
    - `seeders/`: Berisi file untuk mengisi data awal ke database.
