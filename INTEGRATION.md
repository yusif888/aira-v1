# Panduan Integrasi AIRA ke Website yang Sudah Ada

## 📌 Overview

Aplikasi AIRA chatbot ini dapat diintegrasikan ke dalam website yang sudah ada dengan beberapa cara. Dokumen ini menjelaskan berbagai metode integrasi.

## 🔄 Metode Integrasi

### 1. Integrasi sebagai Subdomain (Recommended)

**Kelebihan:**
- Terpisah dari aplikasi utama
- Mudah maintenance
- Tidak mengganggu performa website utama
- Mudah di-scale

**Cara:**
```nginx
# Nginx Configuration
server {
    listen 80;
    server_name chatbot.yourdomain.com;
    root /var/www/airav1/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 2. Integrasi sebagai Folder/Path

**Kelebihan:**
- Satu domain yang sama
- Berbagi session dengan website utama (jika diperlukan)

**Cara:**
Symlink public folder ke subdirectory website:
```bash
ln -s /path/to/airav1/public /var/www/html/chatbot
```

Atau konfigurasi web server:
```nginx
location /chatbot {
    alias /var/www/airav1/public;
    try_files $uri $uri/ @chatbot;
}

location @chatbot {
    rewrite /chatbot/(.*)$ /chatbot/index.php?/$1 last;
}
```

### 3. Integrasi sebagai Widget/Popup

**Kelebihan:**
- Muncul di semua halaman website
- User experience terbaik
- Tidak perlu pindah halaman

**Implementasi:**

#### A. Full Iframe Embed
```html
<!-- Tambahkan di layout utama website -->
<style>
    .aira-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 420px;
        height: 640px;
        border: none;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 9999;
        display: none;
    }
    
    .aira-widget.show {
        display: block;
    }
    
    .aira-trigger {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #00BFFF;
        cursor: pointer;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,191,255,0.5);
    }
    
    .aira-trigger img {
        width: 40px;
        height: 40px;
    }
</style>

<div class="aira-trigger" id="airaToggle">
    <img src="http://chatbot.yourdomain.com/assets/images/airo.png" alt="AIRA">
</div>

<iframe 
    id="airaWidget" 
    class="aira-widget" 
    src="http://chatbot.yourdomain.com">
</iframe>

<script>
    document.getElementById('airaToggle').addEventListener('click', function() {
        var widget = document.getElementById('airaWidget');
        widget.classList.toggle('show');
    });
</script>
```

#### B. AJAX Integration
```html
<!-- Tambahkan di layout utama -->
<div id="aira-container"></div>

<script>
    // Load AIRA chat interface
    fetch('http://chatbot.yourdomain.com/api/chat-widget')
        .then(response => response.text())
        .then(html => {
            document.getElementById('aira-container').innerHTML = html;
        });
</script>
```

### 4. API Integration

Jika website Anda ingin menggunakan chatbot logic saja tanpa UI:

**Endpoint:**
```
POST http://chatbot.yourdomain.com/chat/send
```

**Request:**
```json
{
    "message": "Pertanyaan user"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Jawaban dari AIRA",
    "source": "kamus"
}
```

**Contoh Penggunaan:**
```javascript
async function sendToAira(message) {
    const response = await fetch('http://chatbot.yourdomain.com/chat/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': 'your-csrf-token'
        },
        body: JSON.stringify({ message: message })
    });
    
    const data = await response.json();
    return data.message;
}

// Usage
const answer = await sendToAira("Siapa kamu?");
console.log(answer); // "Nama saya AIRA, asisten virtual Anda."
```

## 🔐 CORS Configuration

Jika menggunakan AJAX dari domain berbeda, tambahkan CORS middleware:

**File:** `app/Http/Middleware/Cors.php`
```php
<?php

namespace App\Http\Middleware;

use Closure;

class Cors
{
    public function handle($request, Closure $next)
    {
        return $next($request)
            ->header('Access-Control-Allow-Origin', 'https://yourdomain.com')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-TOKEN');
    }
}
```

**Register di:** `app/Http/Kernel.php`
```php
protected $middleware = [
    // ...
    \App\Http\Middleware\Cors::class,
];
```

## 🔄 Shared Session (Optional)

Jika website utama dan AIRA perlu berbagi session:

**File:** `config/session.php`
```php
'domain' => '.yourdomain.com',  // Gunakan dot prefix
'cookie' => 'yourdomain_session',
```

## 🛡️ Security Considerations

1. **CSRF Protection**: Pastikan CSRF token dikirim dalam setiap request
2. **Rate Limiting**: Batasi jumlah request per user
3. **API Key**: Simpan DeepSeek API key di `.env`, jangan hardcode
4. **Input Validation**: Validasi semua input dari user
5. **HTTPS**: Gunakan SSL certificate untuk production

## 📊 Performance Optimization

1. **Cache Kamus**: Cache hasil parsing `kamus.json`
   ```php
   // Di KamusService.php
   public function loadKamus()
   {
       return Cache::remember('aira_kamus', 3600, function() {
           $kamusPath = public_path('assets/kamus.json');
           return json_decode(file_get_contents($kamusPath), true);
       });
   }
   ```

2. **Queue untuk API Calls**: Gunakan Laravel Queue untuk DeepSeek API
   ```bash
   php artisan queue:table
   php artisan migrate
   ```

3. **CDN untuk Assets**: Upload images ke CDN

## 🧪 Testing

Test integrasi dengan berbagai browser:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 📱 Responsive Design

Chatbot sudah responsive, tapi pastikan:
- Width maksimal 420px di desktop
- Full width di mobile (dengan margin)
- Height adaptif berdasarkan viewport

## 🔧 Troubleshooting

### CORS Error
- Pastikan CORS middleware sudah terpasang
- Check domain di whitelist

### Session tidak tersimpan
- Check session driver di `.env`
- Pastikan database session table sudah dibuat

### API tidak respond
- Check Laravel logs: `storage/logs/laravel.log`
- Check web server error logs

## 📞 Support

Untuk bantuan integrasi, hubungi:
**Yusif, S.Kom**
- Developer AIRA Chatbot
- Dinas PU Sumber Daya Air Provinsi Jawa Timur
