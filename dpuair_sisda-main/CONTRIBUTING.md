# Panduan Kontribusi (Contributing Guide)

Terima kasih telah berkontribusi pada proyek PUSDA Jatim SISDA. Dokumen ini berisi standar dan panduan yang harus diikuti oleh setiap developer.

## 1. Naming Convention (Konvensi Penamaan)

Konsistensi adalah kunci. Gunakan pola berikut:

| Tipe File          | Format     | Contoh                           | Catatan                 |
| ------------------ | ---------- | -------------------------------- | ----------------------- |
| **Controller**     | PascalCase | `NewsController.php`             | Suffix `Controller`     |
| **Model**          | PascalCase | `NewsArticle.php`                | Singular, deskriptif    |
| **Migration**      | snake_case | `create_news_articles_table.php` | Plural table names      |
| **Route File**     | kebab-case | `admin/news-articles.php`        | Lowercase               |
| **View/Page**      | PascalCase | `News/Index.jsx`                 | React Component standar |
| **Variable**       | camelCase  | `$newsList`, `const isOpen`      | -                       |
| **Database Table** | snake_case | `news_articles`                  | Plural                  |

## 2. Cara Menambah Modul Baru

Ikuti langkah-langkah ini saat membuat fitur baru (misal: `Project`):

1.  **Model & Migration**:

    ```bash
    php artisan make:model Project -m
    # Edit database/migrations/xxxx_create_projects_table.php
    ```

2.  **Seeder** (Opsional tapi disarankan):

    ```bash
    php artisan make:seeder ProjectSeeder
    # Jangan lupa panggil di DatabaseSeeder.php
    ```

3.  **Controller**:
    Buat controller terpisah untuk Admin dan Public.

    ```bash
    php artisan make:controller Admin/ProjectController
    php artisan make:controller Public/ProjectController
    ```

4.  **Routes**:
    - Buat `routes/admin/project.php`
    - Buat `routes/public/project.php`
    - **Wajib merge** ke `routes/web.php` menggunakan `require`. Jangan tulis logic route langsung di `web.php`.

5.  **Frontend Pages**:
    - Admin: `resources/js/Admin/Pages/Project/{Index,Create,Edit}.jsx`
    - Public: `resources/js/Public/Pages/Project/{Index,Show}.jsx`

6.  **Menu**:
    - Tambahkan menu baru di database/config sidebar (edit `resources/js/Admin/Components/Sidebar/sidebarMenuConfig.js`).

## 3. Struktur Folder Standar

```
resources/js/
├── Admin/
│   ├── Components/     # Komponen khusus admin (DataTable, Sidebar)
│   ├── Pages/          # Halaman admin (Controller return Inertia::render('Admin/Pages/...'))
│   │   ├── News/       # Kelompokkan per modul
│   │   └── Users/
├── Public/
│   ├── Components/     # Komponen khusus public (Hero, Navbar)
│   ├── Pages/          # Halaman public
│   │   ├── News/
│   │   └── Welcome.jsx
├── Components/         # Komponen Shared (Button, Input, Modal)
├── Layouts/            # Layout utama (AuthenticatedLayout, GuestLayout)
```

## 4. Development Commands

Kami menyediakan `Makefile` untuk mempermudah development.

```bash
# Setup awal proyek (install dep, migrate, seed, key generate)
make setup

# Jalankan server development (Laravel + Vite + Queue)
make dev

# Reset database total (HATI-HATI: Data hilang!)
make fresh

# Format kode (Laravel Pint)
make lint

# Jalankan test
make test
```

## 5. Branching Strategy

Gunakan **Git Flow** sederhana:

- `main`: Branch produksi. Kode di sini harus stabil dan siap deploy.
- `develop`: Branch pengembangan utama. Semua PR merge ke sini.
- `feature/nama-fitur`: Untuk fitur baru (contoh: `feature/news-gallery`).
- `fix/nama-bug`: Untuk perbaikan bug (contoh: `fix/login-error`).
- `hotfix/nama-bug`: Untuk perbaikan kritis di production (langsung ke main & develop).

---

> **PENTING:** Selalu jalankan `make lint` dan `make test` sebelum melakukan Commit/Push untuk menjaga kebersihan kode.
