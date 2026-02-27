# AIRA Knowledge Base System
## Sistem Basis Pengetahuan AIRA tanpa DeepSeek

Dokumentasi implementasi sistem knowledge base AIRA yang fokus pada kamus internal dan konten website dpuair_sisda, tanpa bergantung pada AI eksternal (DeepSeek).

---

## 📋 Ringkasan Perubahan

### ✅ Yang Sudah Diimplementasikan

1. **DeepSeek Dinonaktifkan**
   - `DeepSeekService` tidak lagi digunakan di `ChatController`
   - Semua referensi ke DeepSeek telah di-comment out

2. **Database Table untuk Knowledge Base**
   - Tabel `website_knowledge` untuk menyimpan cache konten website
   - Support untuk: news, documents, portal_data, dan pages
   - Full-text search dan keyword indexing

3. **Model & Service**
   - `WebsiteKnowledge` model dengan scopes untuk pencarian
   - `WebsiteKnowledgeService` untuk query dan format jawaban

4. **Indexing Command**
   - Command `php artisan aira:index-website` untuk crawl konten
   - Automatic keyword extraction
   - Support untuk incremental dan fresh indexing

5. **Integrasi di ChatController**
   - Prioritas pencarian: Kamus → Website Knowledge → Default
   - Tracking source information
   - Response dengan metadata lengkap

6. **Update Kamus JSON**
   - Entry baru tentang cara kerja AIRA
   - Informasi sumber data
   - Instruksi untuk update knowledge base

---

## 🔄 Alur Kerja AIRA Baru

```
User Question
     ↓
[1] Cari di Kamus JSON
     ↓ (tidak ketemu)
[2] Cari di Website Knowledge Base
     ↓ (tidak ketemu)
[3] Return Default Message
```

### Prioritas Pencarian:

1. **Kamus Internal** (kamus.json)
   - Jawaban manual yang didefinisikan admin
   - Untuk pertanyaan umum dan spesifik
   - Response time: **SANGAT CEPAT**

2. **Website Knowledge Base** (database)
   - Konten dari dpuair_sisda yang sudah di-index
   - Berita, Dokumen, Portal Data
   - Response time: **CEPAT**

3. **Default Message**
   - Jika tidak ada informasi yang relevan
   - Minta user hubungi admin

---

## 🚀 Cara Deployment

### Step 1: Jalankan Migration

```bash
cd c:\laragon\www\airav1-php80
php artisan migrate
```

Ini akan membuat tabel `website_knowledge`.

### Step 2: Index Konten dari dpuair_sisda

**PENTING:** Pastikan kedua project (airav1-php80 dan dpuair_sisda) menggunakan database yang sama atau database dpuair_sisda bisa diakses dari airav1-php80.

```bash
# Index semua konten (news, documents, portal-data)
php artisan aira:index-website --fresh

# Atau index satu per satu
php artisan aira:index-website --source=news
php artisan aira:index-website --source=documents
php artisan aira:index-website --source=portal-data
```

**Output yang diharapkan:**
```
🚀 Starting website content indexing...
✓ Connected to dpuair_sisda database

📰 Indexing News Articles...
 100/100 [============================] 100%
✓ Indexed 100 news articles

📄 Indexing Documents...
 50/50 [============================] 100%
✓ Indexed 50 documents

📊 Indexing Portal Data...
 10/10 [============================] 100%
✓ Indexed 10 portal data entries

✅ Indexing completed!
+-------------+---------------+
| Source Type | Total Entries |
+-------------+---------------+
| news        | 100           |
| document    | 50            |
| portal_data | 10            |
+-------------+---------------+
```

### Step 3: Test AIRA

Buka chat AIRA dan coba tanya:
- ✅ "Berita terbaru tentang..."
- ✅ "Dokumen mengenai..."
- ✅ "Data portal..."
- ✅ "Apa yang kamu ketahui?"
- ✅ "Bagaimana cara kerja AIRA?"

---

## 📊 Struktur Database

### Tabel: `website_knowledge`

| Field              | Type         | Description                        |
|--------------------|--------------|------------------------------------|
| id                 | bigint       | Primary key                        |
| source_type        | varchar(255) | news, document, portal_data, page  |
| source_id          | varchar(255) | ID dari source asli                |
| title              | varchar(255) | Judul konten                       |
| content            | text         | Konten lengkap                     |
| summary            | text         | Ringkasan/excerpt                  |
| keywords           | json         | Array keywords untuk search        |
| url                | varchar(255) | URL ke konten asli                 |
| metadata           | json         | Data tambahan (author, date, etc)  |
| is_active          | boolean      | Status aktif/nonaktif              |
| source_updated_at  | timestamp    | Waktu update di source             |
| created_at         | timestamp    | Waktu dibuat                       |
| updated_at         | timestamp    | Waktu diupdate                     |

**Indexes:**
- `source_type` - Index untuk filter by type
- `is_active` - Index untuk filter active entries
- `FULLTEXT(title, content, summary)` - Full-text search

---

## 🔧 Maintenance

### Update Knowledge Base Secara Berkala

Jalankan command berikut untuk sync konten terbaru dari website:

```bash
# Setiap hari (via cron job)
0 2 * * * cd /path/to/airav1-php80 && php artisan aira:index-website

# Atau manual saat ada update besar
php artisan aira:index-website --fresh
```

### Tambah di Scheduler (Optional)

Edit `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Update knowledge base setiap hari jam 2 pagi
    $schedule->command('aira:index-website')
        ->daily()
        ->at('02:00');
}
```

### Update Kamus Manual

Edit file: `public/assets/kamus.json`

```json
{
  "pertanyaan": ["keyword1", "keyword2"],
  "jawaban": "Jawaban yang akan diberikan AIRA"
}
```

Tidak perlu restart server, perubahan langsung terdeteksi.

---

## 📈 Monitoring & Analytics

### Cek Statistik Knowledge Base

Gunakan tinker untuk cek stats:

```bash
php artisan tinker
```

```php
use App\Services\WebsiteKnowledgeService;

$service = new WebsiteKnowledgeService();
$stats = $service->getStatistics();
dd($stats);

// Output:
// [
//   "total" => 160,
//   "by_type" => [
//     "news" => 100,
//     "document" => 50,
//     "portal_data" => 10
//   ],
//   "last_updated" => "2025-11-20 10:30:00"
// ]
```

### Cek Source dari Chat Response

Setiap response AIRA sekarang include source info:

```json
{
  "success": true,
  "message": "📋 **Judul Berita...**\n\nKonten...",
  "source": "website_keyword",
  "source_info": {
    "id": 123,
    "type": "news",
    "title": "Judul Berita",
    "url": "https://..."
  },
  "bot_chat": {...}
}
```

Source types:
- `kamus` - Dari kamus.json
- `website_exact` - Exact match di title
- `website_keyword` - Keyword matching
- `website_fulltext` - Full-text search
- `default` - Tidak ada yang cocok

---

## 🔍 Cara Kerja Pencarian di Knowledge Base

### 1. Exact Match (Priority 1)
Cari pertanyaan user persis dengan title:
```sql
WHERE LOWER(title) = 'pertanyaan user'
```

### 2. Keyword Matching (Priority 2)
Cari di title, summary, content, keywords:
```sql
WHERE LOWER(title) LIKE '%keyword%'
   OR LOWER(summary) LIKE '%keyword%'
   OR LOWER(content) LIKE '%keyword%'
```

### 3. Full-Text Search (Priority 3)
MySQL full-text search:
```sql
WHERE MATCH(title, content, summary) AGAINST('pertanyaan user')
```

---

## ⚙️ Konfigurasi

### Environment Variables

Tidak ada environment variable baru yang perlu ditambahkan. DeepSeek variables sudah tidak dipakai:

```env
# TIDAK DIPERLUKAN LAGI
# DEEPSEEK_API_KEY=
# DEEPSEEK_API_URL=
```

### Database Connection

Pastikan `airav1-php80` bisa akses tabel `dpuair_sisda`. Jika menggunakan database berbeda, tambahkan koneksi di `config/database.php`:

```php
'connections' => [
    // ... existing connections
    
    'dpuair' => [
        'driver' => 'mysql',
        'host' => env('DPUAIR_DB_HOST', '127.0.0.1'),
        'database' => env('DPUAIR_DB_DATABASE', 'dpuair_sisda'),
        'username' => env('DPUAIR_DB_USERNAME', 'root'),
        'password' => env('DPUAIR_DB_PASSWORD', ''),
        // ...
    ],
],
```

Dan update command untuk use connection tersebut.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to dpuair_sisda database"

**Solusi:**
1. Pastikan kedua project menggunakan database yang sama
2. Atau configure secondary database connection
3. Check `.env` file untuk DB credentials

### Error: "FULLTEXT index not supported"

**Solusi:**
1. Pastikan menggunakan MySQL 5.6+ atau MariaDB 10.0+
2. Pastikan tabel menggunakan InnoDB engine
3. Jika masih error, full-text search akan di-skip (masih bisa pakai keyword matching)

### Konten tidak ter-index

**Solusi:**
1. Check apakah artikel/dokumen status = 'published'
2. Check apakah tidak soft-deleted
3. Run dengan flag `--fresh` untuk rebuild dari awal

### Response AIRA lambat

**Solusi:**
1. Tambahkan index di kolom yang sering di-query
2. Optimize keyword extraction (kurangi jumlah keywords)
3. Consider caching untuk pertanyaan populer

---

## 📝 Contoh Pertanyaan yang Bisa Dijawab

### Dari Kamus:
- "Siapa kamu?"
- "Bagaimana cara kerja AIRA?"
- "Dari mana kamu mendapat informasi?"
- "Jam kerja kantor?"

### Dari Website Knowledge:
- "Berita tentang infrastruktur"
- "Dokumen RPJMD 2024"
- "Data portal irigasi"
- "Rapat koordinasi minggu lalu"

---

## 🎯 Keuntungan Sistem Baru

✅ **Tidak bergantung AI eksternal** - No API costs, no quota limits
✅ **Jawaban lebih akurat** - Dari sumber resmi dan terpercaya
✅ **Response cepat** - Query database lokal
✅ **Full control** - Admin bisa manage semua konten
✅ **Traceable** - Tahu dari mana jawaban berasal
✅ **Offline capable** - Tidak perlu internet untuk AI
✅ **Privacy** - Data tidak keluar ke pihak ketiga

---

## 📞 Support

Jika ada pertanyaan atau issue, hubungi:
- Developer: Yusif, S.Kom
- Email: [email]
- Repository: [github_url]

---

**Last Updated:** 20 November 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
