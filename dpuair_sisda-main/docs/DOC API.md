# Dokumentasi Teknis API — SISDA

| | |
|---|---|
| Versi | 1.0 |
| Tanggal | 21 April 2026 |
| Base URL | `https://sisda.dpuair.jatimprov.go.id` |
| Protokol | HTTP/HTTPS, Inertia.js over standard web routes |

---

## Catatan Arsitektur

SISDA **bukan REST API murni**. Seluruh endpoint menggunakan **Inertia.js** — server merespons dengan komponen React beserta props-nya (bukan JSON mentah). Untuk request standar browser, respons berupa HTML full-page. Untuk request Inertia (header `X-Inertia: true`), respons berupa JSON dengan struktur:

```json
{
  "component": "News/Index",
  "props": { ... },
  "url": "/berita",
  "version": "..."
}
```

Endpoint form (POST/PUT/DELETE/PATCH) merespons dengan **redirect** atau **back with errors** — bukan JSON.

---

## Konvensi

| Hal | Detail |
|---|---|
| Auth admin | Session cookie (Laravel Breeze) |
| CSRF | Semua mutasi wajib sertakan `X-XSRF-TOKEN` header atau `_token` form field |
| Format tanggal | `YYYY-MM-DD` |
| Paginasi | `?page=N`, default 10 item/halaman |
| Soft delete | Data terhapus tidak muncul di response publik |

---

## 1. Autentikasi

### `POST /login`

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `email` | string | ✅ | |
| `password` | string | ✅ | |
| `remember` | boolean | — | |

**Respons sukses:** redirect ke `/admin/dashboard`
**Respons gagal:** back dengan error `email`

---

### `POST /logout`

Tidak memerlukan body. Menghapus sesi aktif.
**Respons:** redirect ke `/`

---

### `POST /forgot-password`

| Field | Tipe | Wajib |
|---|---|---|
| `email` | string | ✅ |

**Respons sukses:** back dengan `status` — link reset dikirim ke email

---

### `POST /reset-password`

| Field | Tipe | Wajib |
|---|---|---|
| `token` | string | ✅ |
| `email` | string | ✅ |
| `password` | string | ✅ |
| `password_confirmation` | string | ✅ |

**Respons sukses:** redirect ke `/login` dengan pesan konfirmasi

---

## 2. Publik — Berita

### `GET /berita`

Daftar artikel yang berstatus `published`, diurutkan terbaru.

**Query params:**

| Param | Tipe | Keterangan |
|---|---|---|
| `search` | string | Filter judul/excerpt (case-insensitive) |
| `category` | string | Filter berdasarkan slug kategori |
| `page` | integer | Nomor halaman |

**Inertia props:**

```json
{
  "news": {
    "data": [
      {
        "id": 1,
        "title": "...",
        "slug": "...",
        "excerpt": "...",
        "featured_image_path": "...",
        "published_at": "2026-04-21T00:00:00Z",
        "status": "published",
        "is_featured": false,
        "view_count": 120,
        "category": { "id": 1, "name": "Publikasi", "slug": "publikasi" }
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 48
  },
  "filters": { "search": null, "category": null },
  "categories": [ { "id": 1, "name": "Publikasi", "slug": "publikasi" } ]
}
```

---

### `GET /berita/{publikasi|event|tkpsda|dsda|komir}`

Shortcut filter per kategori. Perilaku identik dengan `GET /berita?category={slug}`.

**Tambahan prop:** `currentCategory: { id, name, slug }`

---

### `GET /berita/details/{article:slug}`

Detail satu artikel. `article` di-resolve via slug (route model binding).

**Inertia props:**

```json
{
  "article": {
    "id": 1,
    "title": "...",
    "slug": "...",
    "content": "...(HTML)...",
    "featured_image_path": "...",
    "published_at": "...",
    "view_count": 120,
    "meta_title": "...",
    "meta_description": "...",
    "author": { "id": 1, "name": "Admin" },
    "category": { "id": 1, "name": "Publikasi" },
    "tags": [ { "id": 1, "name": "Bendungan" } ]
  },
  "relatedArticles": [
    { "id": 2, "slug": "...", "title": "...", "published_at": "...", "featured_image_path": "..." }
  ]
}
```

`relatedArticles` diisi dari kategori yang sama (maks. 3), kekurangannya diisi artikel acak.

---

## 3. Publik — Dokumen

### `GET /dokumen`

**Query params:** `search`, `category`, `type`, `page`

**Inertia props:**

```json
{
  "documents": {
    "data": [
      {
        "id": 1,
        "title": "Renstra 2024",
        "document_number": "...",
        "year": 2024,
        "description": "...",
        "file_path": "...",
        "type": { "id": 1, "name": "Renstra", "icon": "file-text" },
        "tags": [ { "id": 1, "name": "Perencanaan" } ]
      }
    ],
    "current_page": 1,
    "last_page": 3,
    "total": 25
  }
}
```

---

### `GET /dokumen/{id}`

Detail satu dokumen. Tidak mengembalikan konten file secara langsung — `file_path` digunakan frontend untuk generate URL unduhan.

---

## 4. Publik — Pelayanan (Antrian)

### `GET /pelayanan`

**Inertia props:**

```json
{
  "jenisLayananOptions": ["FHD", "SIH3", "JOSS"]
}
```

---

### `POST /pelayanan`

Daftarkan antrian baru. Dapat diakses tanpa login.

**Request body:**

| Field | Tipe | Wajib | Validasi |
|---|---|---|---|
| `nama_lengkap` | string | ✅ | max:255 |
| `email` | string | ✅ | format email valid |
| `instansi_asal` | string | ✅ | max:255 |
| `jenis_layanan` | string | ✅ | `in:FHD,SIH3,JOSS` |
| `nomor_whatsapp` | string | ✅ | max:20 |
| `tanggal_kedatangan` | date | ✅ | `after_or_equal:today` |
| `catatan` | string | — | nullable |

**Respons sukses:** redirect ke `/pelayanan/show/{kode_antrian}` dengan flash `success`
**Side effect:** Email notifikasi berisi `kode_antrian` dikirim ke alamat email pendaftar (via `KodeAntrianMail`). Gagal kirim email tidak membatalkan pendaftaran.

**Format `kode_antrian`:** `{JENIS}-{YYYYMMDD}-{sequence}`, contoh: `FHD-20260421-001`

---

### `GET /pelayanan/show/{kodeAntrian}`

Tampil status antrian berdasarkan kode.

**Inertia props:**

```json
{
  "pelayanan": {
    "id": 1,
    "kode_antrian": "FHD-20260421-001",
    "nama_lengkap": "...",
    "jenis_layanan": "FHD",
    "tanggal_kedatangan": "2026-04-25",
    "status": "pending"
  }
}
```

**Status yang mungkin:** `pending` · `diproses` · `selesai` · `dibatalkan`

---

### `POST /pelayanan/check`

Cari antrian berdasarkan kode.

| Field | Tipe | Wajib |
|---|---|---|
| `kode_antrian` | string | ✅ |

**Respons sukses:** redirect ke `/pelayanan/show/{kode_antrian}`
**Respons gagal:** back dengan error `kode_antrian: Kode antrian tidak ditemukan`

---

## 5. Publik — Infrastruktur SDA

### `GET /infrastruktur-sda`

Mengembalikan semua kategori aktif beserta data infrastruktur di dalamnya, siap dikonsumsi MapLibre GL.

**Inertia props:**

```json
{
  "mapboxToken": "...",
  "categoriesFromDB": [
    {
      "id": 1,
      "code": "sih3",
      "name": "SIH3",
      "icon": "...(SVG path)...",
      "data_count": 12,
      "data": [
        {
          "id": 1,
          "name": "Bendungan Sutami",
          "code": "bendungan",
          "type": "marker",
          "legend_color": "#1d6fa0",
          "description": "...",
          "latitude": -8.1234567,
          "longitude": 112.7654321,
          "coordinates": [112.7654321, -8.1234567]
        },
        {
          "id": 2,
          "name": "DAS Brantas",
          "code": "das",
          "type": "polygon",
          "legend_color": "#3ab5d6",
          "geojson": { "type": "Feature", "geometry": { ... } }
        }
      ]
    }
  ]
}
```

Data tipe `marker` menyertakan `latitude`, `longitude`, `coordinates` (format `[lng, lat]` untuk MapLibre).
Data tipe `line`/`polygon` menyertakan `geojson` sebagai objek GeoJSON yang sudah di-decode.

---

## 6. Publik — Portal Data

### `GET /portal-data`

Daftar dataset terbuka yang dapat diunduh publik.

---

## 7. Admin — Berita

> Semua route admin memerlukan sesi terotentikasi + email terverifikasi (`auth`, `verified` middleware).

| Method | Path | Aksi |
|---|---|---|
| GET | `/admin/berita` | Daftar artikel (semua status) |
| GET | `/admin/berita/create` | Form buat artikel |
| POST | `/admin/berita` | Simpan artikel baru |
| GET | `/admin/berita/{id}/edit` | Form edit artikel |
| PUT | `/admin/berita/{id}` | Update artikel |
| DELETE | `/admin/berita/{id}` | Soft delete |
| PATCH | `/admin/berita/{id}/restore` | Restore dari trash |
| DELETE | `/admin/berita/{id}/force` | Hapus permanen |
| GET | `/admin/berita/trash` | Daftar artikel terhapus |
| GET | `/admin/berita/kategori` | Kelola kategori |
| POST | `/admin/berita/kategori` | Tambah kategori |
| PUT | `/admin/berita/kategori/{id}` | Update kategori |
| DELETE | `/admin/berita/kategori/{id}` | Hapus kategori |
| GET | `/admin/berita/tags` | Kelola tag |
| POST/PUT/DELETE | `/admin/berita/tags/{id}` | CRUD tag |

**Validasi store/update artikel (utama):**

| Field | Wajib | Keterangan |
|---|---|---|
| `title` | ✅ | max:255 |
| `news_category_id` | ✅ | exists di `news_categories` |
| `content` | ✅ | |
| `status` | ✅ | `in:draft,published,archived` |
| `featured_image` | — | file gambar |
| `meta_title` | — | max:60 (SEO) |
| `meta_description` | — | max:160 (SEO) |

---

## 8. Admin — Dokumen

| Method | Path | Aksi |
|---|---|---|
| GET | `/admin/dokumen` | Daftar dokumen |
| GET | `/admin/dokumen/create` | Form upload |
| POST | `/admin/dokumen` | Upload dokumen baru |
| GET | `/admin/dokumen/{id}/edit` | Form edit |
| PUT | `/admin/dokumen/{id}` | Update metadata |
| DELETE | `/admin/dokumen/{id}` | Soft delete |
| POST | `/admin/dokumen/{id}/restore` | Restore |
| DELETE | `/admin/dokumen/{id}/force-delete` | Hapus permanen + file fisik |
| GET | `/admin/dokumen/trash` | Daftar dokumen terhapus |
| CRUD | `/admin/dokumen/kategori/*` | Kelola kategori |
| CRUD | `/admin/dokumen/tipe/*` | Kelola tipe |
| CRUD | `/admin/dokumen/tags/*` | Kelola tag |

---

## 9. Admin — Pelayanan

| Method | Path | Aksi |
|---|---|---|
| GET | `/admin/pelayanan` | Daftar antrian |
| GET | `/admin/pelayanan/{id}` | Detail antrian |
| PATCH | `/admin/pelayanan/{id}/status` | Update status antrian |

**Validasi update status:**

| Field | Tipe | Wajib | Nilai valid |
|---|---|---|---|
| `status` | string | ✅ | `pending`, `diproses`, `selesai`, `dibatalkan` |

---

## 10. Admin — Infrastruktur SDA

| Method | Path | Aksi |
|---|---|---|
| GET | `/admin/infrastruktur-sda` | Daftar data |
| POST | `/admin/infrastruktur-sda` | Tambah data |
| PUT | `/admin/infrastruktur-sda/{id}` | Update data |
| DELETE | `/admin/infrastruktur-sda/{id}` | Soft delete |
| CRUD | `/admin/infrastruktur-sda/categories/*` | Kelola kategori |

**Validasi store/update:**

| Field | Wajib | Keterangan |
|---|---|---|
| `name` | ✅ | |
| `category_id` | ✅ | exists di `infrastruktur_categories` |
| `type` | ✅ | `in:marker,line,polygon` |
| `latitude`, `longitude` | Jika `type=marker` | decimal |
| `geojson` | Jika `type=line/polygon` | valid JSON |

---

## 11. Admin — Pengguna & Peran

| Method | Path | Aksi |
|---|---|---|
| GET | `/admin/users` | Daftar pengguna |
| POST | `/admin/users` | Buat pengguna |
| PUT | `/admin/users/{id}` | Update pengguna |
| DELETE | `/admin/users/{id}` | Hapus pengguna |
| CRUD | `/admin/roles/*` | Kelola peran |
| CRUD | `/admin/permissions/*` | Kelola izin |

---

## 12. Sitemap

### `GET /sitemap.xml`

Mengembalikan XML sitemap yang berisi URL berita terpublikasi dan halaman statis. Tidak memerlukan autentikasi. Digunakan oleh crawler mesin pencari.
