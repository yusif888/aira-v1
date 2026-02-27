# AIRA - Asisten Virtual Dinas PU Sumber Daya Air

Aplikasi chatbot AIRA versi web menggunakan PHP dan Laravel. Aplikasi ini merupakan replika dari aplikasi Flutter AIRA dengan fitur yang sama.

## 📋 Fitur

- **Kamus FAQ Lokal** - Menjawab pertanyaan berdasarkan keyword matching dari file JSON
- **Integrasi DeepSeek AI** - Untuk pertanyaan yang tidak ada di kamus, menggunakan API DeepSeek
- **Chat Interface** - Tampilan bubble chat yang responsif mirip aplikasi mobile
- **Riwayat Chat** - Menyimpan riwayat percakapan di database
- **Real-time Response** - AJAX untuk pengalaman chat tanpa reload halaman
- **Session Management** - Setiap user memiliki session chat tersendiri

## 🛠️ Teknologi

- **PHP 8.0+** (kompatibel hingga PHP 8.3)
- **Laravel 12** (dengan dependencies yang support PHP 8.0)
- **SQLite** - Database ringan untuk development
- **Vanilla JavaScript** - Tanpa framework frontend
- **DeepSeek API** - AI chatbot integration

## 📦 Instalasi

1. **Clone repository**
   ```bash
   cd c:\laragon\www\airav1
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Konfigurasi database**
   Secara default menggunakan SQLite. Untuk MySQL/PostgreSQL, edit `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=airav1
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Konfigurasi DeepSeek API**
   Edit `.env` dan tambahkan API key Anda:
   ```env
   DEEPSEEK_API_KEY=your_api_key_here
   DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   ```

6. **Jalankan migrasi**
   ```bash
   php artisan migrate
   ```

7. **Jalankan server**
   ```bash
   php artisan serve
   ```

8. **Buka browser**
   ```
   http://127.0.0.1:8000
   ```

## 📁 Struktur Project

```
airav1/
├── app/
│   ├── Http/Controllers/
│   │   └── ChatController.php        # Controller untuk chat
│   ├── Models/
│   │   └── Chat.php                  # Model untuk chat history
│   └── Services/
│       ├── KamusService.php          # Service untuk FAQ lokal
│       └── DeepSeekService.php       # Service untuk DeepSeek API
├── database/
│   └── migrations/
│       └── create_chats_table.php    # Migration untuk tabel chats
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── airo.png             # Avatar AIRA
│   │   │   └── airabg.png           # Background image
│   │   └── kamus.json                # Database FAQ lokal
│   └── js/
│       └── chat.js                   # JavaScript untuk chat interface
├── resources/views/
│   └── chat/
│       └── index.blade.php           # View utama chat
└── routes/
    └── web.php                       # Route definitions
```

## 🎯 Cara Kerja

1. **User mengirim pesan** melalui chat interface
2. **System mencari** jawaban di `kamus.json` berdasarkan keyword
3. **Jika ditemukan** di kamus, langsung menampilkan jawaban
4. **Jika tidak ditemukan**, system akan mengirim request ke DeepSeek API
5. **Response disimpan** ke database untuk history
6. **Chat bubble** muncul di interface dengan animasi

## 🔧 Kustomisasi

### Menambah FAQ di Kamus

Edit file `public/assets/kamus.json`:

```json
[
  {
    "pertanyaan": ["keyword1", "keyword2"],
    "jawaban": "Jawaban untuk pertanyaan tersebut"
  }
]
```

### Mengubah Sistem Prompt DeepSeek

Edit file `app/Services/DeepSeekService.php` pada bagian:

```php
[
    'role' => 'system',
    'content' => 'Your custom system prompt here'
]
```

### Mengubah Tampilan

Edit file `resources/views/chat/index.blade.php` untuk mengubah CSS dan layout.

## 🔒 Keamanan

- CSRF Protection sudah aktif untuk semua form
- API Key disimpan di `.env` (jangan commit ke git)
- Input validation untuk mencegah XSS
- Session management untuk isolasi user

## 📱 Kompatibilitas

- ✅ Desktop browsers (Chrome, Firefox, Edge, Safari)
- ✅ Mobile browsers (responsive design)
- ✅ Tablet devices
- ✅ PHP 8.0, 8.1, 8.2, 8.3

## 🚀 Deployment

Untuk production:

1. Set `APP_ENV=production` di `.env`
2. Set `APP_DEBUG=false` di `.env`
3. Ubah `DB_CONNECTION` ke MySQL/PostgreSQL
4. Jalankan `php artisan config:cache`
5. Jalankan `php artisan route:cache`
6. Setup web server (Apache/Nginx)

## 🤝 Kontribusi

Aplikasi ini dikembangkan oleh Yusif, S.Kom untuk Dinas PU Sumber Daya Air Provinsi Jawa Timur.

## 📄 Lisensi

Proprietary - Dinas PU Sumber Daya Air Provinsi Jawa Timur

## 📞 Kontak

Untuk pertanyaan atau dukungan, hubungi developer: Yusif, S.Kom

---

## 🔄 Perbedaan dengan Versi Flutter

### Yang Sama:
- ✅ Kamus FAQ dengan keyword matching
- ✅ Integrasi DeepSeek API
- ✅ UI/UX design yang mirip
- ✅ Chat bubble interface
- ✅ Background dan avatar yang sama

### Perbedaan:
- ❌ Tidak ada Flutter/Dart - menggunakan PHP/Laravel
- ✅ Web-based - dapat diakses dari browser
- ✅ Database storage untuk chat history
- ✅ Session-based conversation tracking
- ✅ Lebih mudah di-integrate dengan web yang sudah ada

## 📊 API Endpoints

### GET `/`
Menampilkan halaman chat utama

### POST `/chat/send`
Mengirim pesan chat
```json
{
  "message": "Pertanyaan user"
}
```

Response:
```json
{
  "success": true,
  "message": "Jawaban dari bot",
  "source": "kamus" // atau "api"
}
```

### GET `/chat/history`
Mendapatkan riwayat chat session saat ini

### POST `/chat/clear`
Menghapus riwayat chat session saat ini
