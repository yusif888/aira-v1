# AIRA Chatbot - Quick Start Guide

## 🚀 Cara Cepat Memulai

### Langkah 1: Persiapan
Pastikan Anda sudah berada di direktori project:
```bash
cd c:\laragon\www\airav1
```

### Langkah 2: Install Dependencies (Jika Belum)
```bash
composer install
```

### Langkah 3: Setup Environment (Jika Belum)
```bash
copy .env.example .env
php artisan key:generate
```

### Langkah 4: Setup Database (Jika Belum)
```bash
php artisan migrate
```

### Langkah 5: Jalankan Server
```bash
php artisan serve
```

### Langkah 6: Buka Browser
Buka URL berikut di browser:
```
http://127.0.0.1:8000
```

## 🎨 Cara Menggunakan

1. **Buka halaman** - Anda akan melihat background dengan logo AIRA
2. **Klik tombol "Tanya Aira"** di pojok kanan bawah
3. **Ketik pertanyaan** di kolom input
4. **Tekan Enter atau klik tombol kirim**
5. **AIRA akan menjawab** - dari kamus lokal atau DeepSeek API

## 📝 Contoh Pertanyaan

Coba tanyakan:
- "Siapa kamu?"
- "Jam kerja"
- "Lokasi kantor"
- "Sekretariat dipimpin oleh siapa"
- "Mengapa nama kamu Aira"
- Atau pertanyaan umum lainnya

## 🔧 Troubleshooting

### Server tidak bisa dijalankan
```bash
# Stop server yang sedang berjalan
Ctrl+C

# Jalankan ulang
php artisan serve
```

### Database error
```bash
# Hapus dan buat ulang database
php artisan migrate:fresh
```

### Error 500
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Chat tidak muncul
1. Pastikan file `public/js/chat.js` ada
2. Pastikan file `public/assets/images/airo.png` dan `airabg.png` ada
3. Cek browser console (F12) untuk error JavaScript

## 🔑 Konfigurasi DeepSeek API

Edit file `.env`:
```env
DEEPSEEK_API_KEY=your_api_key_here
```

Jika tidak ada API key, chat akan tetap berfungsi menggunakan kamus lokal saja.

## 📦 Kompatibilitas PHP

Aplikasi ini kompatibel dengan:
- ✅ PHP 8.0
- ✅ PHP 8.1
- ✅ PHP 8.2
- ✅ PHP 8.3

Untuk integrasi dengan web yang menggunakan PHP 8.0, tidak ada masalah dependency.

## 🌐 Integrasi dengan Web yang Sudah Ada

### Option 1: Sebagai Subdomain
```
chatbot.yourdomain.com
```

### Option 2: Sebagai Folder
```
yourdomain.com/chatbot
```

### Option 3: Embed sebagai Widget
Anda bisa menggunakan iframe atau AJAX untuk embed chat interface ke dalam website yang sudah ada.

Contoh embed dengan iframe:
```html
<iframe src="http://yourdomain.com/chatbot" width="420" height="640" frameborder="0"></iframe>
```

## 💡 Tips

1. **Kustomisasi FAQ**: Edit `public/assets/kamus.json` untuk menambah pertanyaan dan jawaban
2. **Ubah Warna**: Edit CSS di `resources/views/chat/index.blade.php`
3. **Ubah Avatar**: Ganti file `public/assets/images/airo.png`
4. **Ubah Background**: Ganti file `public/assets/images/airabg.png`

## 📞 Support

Jika ada masalah, hubungi developer: Yusif, S.Kom
