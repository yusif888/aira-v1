# Arsitektur Proyek PUSDA Jatim SISDA

Dokumen ini menjelaskan arsitektur teknis dari **Sistem Informasi Sumber Daya Air (SISDA)** Dinas PU SDA Provinsi Jawa Timur.

## 1. Tech Stack Overview

Proyek ini dibangun menggunakan stack **Modern Monolith** dengan Laravel dan React dalam satu repositori (Monorepo), dihubungkan oleh Inertia.js.

```mermaid
graph TD
    subgraph "Backend"
        L[Laravel 12]
        PHP[PHP 8.2+]
        DB[(PostgreSQL)]
    end

    subgraph "Frontend"
        R[React 19 RC]
        I[Inertia.js v2]
        TW[Tailwind CSS 3]
    end

    subgraph "Mapping & Visualization"
        M[MapLibre GL / Leaflet]
        C[Chart.js]
    end

    User((User)) -->|Browser| R
    R <-->|JSON over HTTP| I
    I <-->|Adapter| L
    L <-->|ORM| DB
    R --> M
    R --> C
```

## 2. Alur Data (Data Flow)

Aplikasi menggunakan pola **Model-View-Controller (MVC)** klasik, namun View-nya digantikan oleh React component via Inertia.js. Tidak ada REST API terpisah (kecuali untuk hal spesifik), komunikasi frontend-backend terjadi "seamlessly" seperti aplikasi MPA klasik namun dengan pengalaman SPA.

```mermaid
sequenceDiagram
    participant User
    participant Router as Laravel Route
    participant Controller
    participant Model
    participant DB as Database
    participant Inertia
    participant React as React Page

    User->>Router: Visit URL (/berita)
    Router->>Controller: Dispatch Request
    Controller->>Model: Query Data
    Model->>DB: SQL Select
    DB-->>Model: Result Set
    Model-->>Controller: Eloquent Collection
    Controller->>Inertia: Return Inertia::render('News/Index', details)
    Inertia-->>React: Pass Props { news: [...] }
    React-->>User: Render HTML (SSR/CSR)
```

## 3. Pola Rendering (SSR vs CSR)

Proyek ini menggunakan strategi **Hybrid Rendering**:

| Tipe Halaman     | Rendering                   | Lokasi File                  | Alasan                                                                              |
| ---------------- | --------------------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| **Public Pages** | Server-Side Rendering (SSR) | `resources/js/Public/Pages/` | Dibutuhkan untuk **SEO** (Search Engine Optimization) agar konten terindeks Google. |
| **Admin Pages**  | Client-Side Rendering (CSR) | `resources/js/Admin/Pages/`  | Fokus pada interaktivitas tinggi dan performa aplikasi SPA. Tidak butuh SEO.        |

Konfigurasi ini diatur di `resources/js/app.jsx` dan `resources/js/ssr.jsx`.

## 4. Struktur Modul & Domain

| Modul                 | Deskripsi                                       | Controller Utama                                                            | Frontend Path        | Tabel Database Utama                        |
| --------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- | -------------------- | ------------------------------------------- |
| **Berita (News)**     | Manajemen artikel, kategori, tag, komentar      | `Admin/NewsController` <br> `Public/NewsController`                         | `News/*`             | `news_articles`, `news_categories`          |
| **Dokumen**           | Repositori dokumen regulasi & laporan           | `Admin/DocumentController` <br> `Public/DocumentController`                 | `Documents/*`        | `documents_entries`, `documents_categories` |
| **Pelayanan**         | Antrian layanan publik (FHD, SIH3, JOSS)        | `Admin/PelayananController` <br> `Public/PelayananController`               | `Pelayanan/*`        | `pelayanans`                                |
| **Infrastruktur SDA** | Data spasial infrastruktur (Pintu air, Bendung) | `Admin/InfrastrukturSDAController` <br> `Public/InfrastrukturSDAController` | `InfrastrukturSDA/*` | `data_infrastruktur_sda`                    |
| **Portal Data**       | Dataset terbuka untuk publik                    | `Admin/PortalDataController` <br> `Public/PortalDataController`             | `PortalData/*`       | `portaldata_datasets`                       |
| **SDA Dalam Angka**   | Statistik tahunan SDA                           | —                                                                           | `SDADalamAngka/*`    | — (JSON Driven)                             |
| **User & Role**       | Manajemen akses pengguna                        | `Admin/UserController` <br> `Admin/RoleController`                          | `Users/*`, `Roles/*` | `users`, `roles`, `permissions`             |

## 5. Glossary Istilah Domain

- **SDA**: Sumber Daya Air
- **FHD**: Forecasting, Hydrologi, Data — layanan peramalan banjir dan data hidrologi.
- **SIH3**: Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi.
- **JOSS**: Jaringan Observasi Sumber daya air Strategis — layanan data observasi khusus.
- **WS**: Wilayah Sungai (unit pengelolaan sungai, misal: WS Brantas, WS Bengawan Solo).
- **UPT**: Unit Pelaksana Teknis — kantor cabang dinas di kabupaten/kota.
- **Bina Manfaat**: Bidang yang mengurusi pemanfaatan sumber daya air.
- **Irigasi**: Bidang yang mengurusi jaringan irigasi pertanian.

## 6. Entity Relationship Diagram (ERD)

Berikut adalah gambaran relasi database utama:

```mermaid
erDiagram
    USERS ||--o{ NEWS_ARTICLES : writes
    USERS ||--o{ DOCUMENTS_ENTRIES : uploads
    USERS ||--o{ NEWS_COMMENTS : comments

    %% Module News
    NEWS_CATEGORIES ||--o{ NEWS_ARTICLES : "has many"
    NEWS_ARTICLES ||--o{ NEWS_TAGS : "belongs to many"
    NEWS_ARTICLES ||--o{ NEWS_COMMENTS : "has many"
    NEWS_ARTICLES ||--o{ NEWS_IMAGES : "has gallery"
    NEWS_ARTICLES ||--o{ NEWS_ATTACHMENTS : "has files"

    %% Module Documents
    DOCUMENTS_CATEGORIES ||--o{ DOCUMENTS_TYPES : "has subtypes"
    DOCUMENTS_TYPES ||--o{ DOCUMENTS_ENTRIES : "classifies"
    DOCUMENTS_ENTRIES ||--o{ DOCUMENTS_TAGS : "belongs to many"

    %% Module Infrastruktur
    INFRASTRUKTUR_CATEGORIES ||--o{ DATA_INFRASTRUKTUR_SDA : "categorizes"

    %% Module Portal Data
    USERS ||--o{ PORTALDATA_DATASETS : creates

    %% Module Pelayanan
    PELAYANAN {
        string kode_antrian
        string jenis_layanan
        string status
    }
```
