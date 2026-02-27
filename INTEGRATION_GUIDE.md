# Integrasi AIRA Chatbot dengan Web yang Sudah Ada (PHP 8.0)

## Overview

Aplikasi AIRA Chatbot ini dibuat dengan **Laravel 9** dan **100% compatible dengan PHP 8.0** untuk diintegrasikan dengan website existing Anda.

## Struktur Aplikasi

```
airav1-php80/
├── app/
│   ├── Http/Controllers/
│   │   └── ChatController.php       # Main chat logic
│   ├── Models/
│   │   └── Chat.php                 # Chat history model
│   └── Services/
│       ├── KamusService.php         # Local FAQ service
│       └── DeepSeekService.php      # AI API integration
├── public/
│   ├── css/chat.css                 # Chatbot styles
│   ├── js/chat.js                   # Chat functionality
│   └── assets/
│       ├── kamus.json               # FAQ database
│       └── images/
│           ├── airo.png
│           └── airabg.png
├── resources/views/chat/
│   └── index.blade.php              # Chat interface
└── routes/web.php                   # Routes definition
```

## Metode Integrasi

### Opsi 1: Subdomain (Recommended)

Deploy chatbot sebagai subdomain terpisah:

```
Website utama: https://yourdomain.com (PHP 8.0)
Chatbot:       https://chat.yourdomain.com (Laravel 9 - PHP 8.0)
```

**Kelebihan:**
- ✅ Tidak menggangu code existing
- ✅ Independent deployment
- ✅ Easy maintenance

**Setup:**
```bash
# Di cPanel atau server
1. Buat subdomain: chat.yourdomain.com
2. Point document root ke: /path/to/airav1-php80/public
3. Done!
```

### Opsi 2: Subfolder

Deploy di subfolder website:

```
Website utama: https://yourdomain.com
Chatbot:       https://yourdomain.com/chat
```

**Setup di .htaccess website utama:**
```apache
# Redirect /chat ke Laravel public
RewriteEngine On
RewriteRule ^chat(/.*)?$ /airav1-php80/public/index.php [L]
```

### Opsi 3: Iframe Embed

Embed chatbot di website existing:

**Di website utama (HTML/PHP):**
```html
<!-- Floating button -->
<button id="aira-open-btn" style="position: fixed; bottom: 20px; right: 20px;">
    Chat dengan AIRA
</button>

<!-- Iframe container -->
<div id="aira-iframe-container" style="display: none; position: fixed; bottom: 80px; right: 20px; width: 400px; height: 600px; box-shadow: 0 0 20px rgba(0,0,0,0.2); border-radius: 10px; overflow: hidden;">
    <iframe src="https://chat.yourdomain.com" style="width: 100%; height: 100%; border: none;"></iframe>
</div>

<script>
document.getElementById('aira-open-btn').addEventListener('click', function() {
    var container = document.getElementById('aira-iframe-container');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
});
</script>
```

### Opsi 4: API Integration

Gunakan chatbot sebagai API service:

**Endpoint:**
```
POST https://chat.yourdomain.com/api/chat
```

**Request:**
```json
{
    "message": "Siapa kamu?"
}
```

**Response:**
```json
{
    "success": true,
    "response": "Saya AIRA, asisten virtual yang siap membantu Anda!",
    "source": "kamus"
}
```

**Di website utama (JavaScript):**
```javascript
async function sendToAira(message) {
    const response = await fetch('https://chat.yourdomain.com/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': 'your-token'
        },
        body: JSON.stringify({ message: message })
    });
    return await response.json();
}
```

## Sharing Database dengan Web Existing

Jika website utama Anda menggunakan MySQL dan ingin share database:

**1. Update .env chatbot:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_existing_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

**2. Run migrations:**
```bash
php artisan migrate
```

Ini akan menambahkan table `chats` dan `sessions` ke database existing tanpa mengganggu table lain.

## Sharing Session dengan Web Existing

Jika ingin user login website utama juga terdeteksi di chatbot:

**1. Update config/session.php:**
```php
'domain' => '.yourdomain.com',  // Notice the dot prefix
```

**2. Pastikan keduanya menggunakan session driver yang sama:**
```env
SESSION_DRIVER=database
# atau
SESSION_DRIVER=redis
```

## Authentication Integration

Jika chatbot perlu tahu siapa user yang login di website utama:

**Di website utama, set session:**
```php
$_SESSION['user_id'] = $user->id;
$_SESSION['user_name'] = $user->name;
```

**Di ChatController.php, baca session:**
```php
public function send(Request $request)
{
    $userId = session('user_id');
    $userName = session('user_name');
    
    // Save chat with user info
    Chat::create([
        'user_id' => $userId,
        'session_id' => session()->getId(),
        'sender' => $userName ?? 'User',
        'message' => $request->message,
    ]);
    
    // ... rest of code
}
```

## Security Considerations

### 1. CORS (jika beda domain)

**config/cors.php:**
```php
'allowed_origins' => ['https://yourdomain.com'],
'allowed_methods' => ['POST', 'GET'],
'allowed_headers' => ['Content-Type', 'X-CSRF-TOKEN'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### 2. CSRF Protection

Jika menggunakan API dari website lain, exempt endpoint:

**app/Http/Middleware/VerifyCsrfToken.php:**
```php
protected $except = [
    'api/chat',  // Exempt API endpoint
];
```

### 3. Rate Limiting

Sudah built-in di ChatController:
```php
$this->middleware('throttle:20,1')->only('send');
// 20 requests per minute
```

## Testing Integration

**1. Test chatbot standalone:**
```bash
php artisan serve --port=8000
# Buka: http://localhost:8000
```

**2. Test dari website utama:**
```html
<!-- Test iframe -->
<iframe src="http://localhost:8000" width="400" height="600"></iframe>
```

**3. Test API:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Siapa kamu?"}'
```

## Production Deployment Checklist

- [ ] Upload ke server PHP 8.0
- [ ] `composer install --no-dev`
- [ ] Setup `.env` dengan database credentials
- [ ] Setup `DEEPSEEK_API_KEY` di `.env`
- [ ] `php artisan migrate --force`
- [ ] `php artisan config:cache`
- [ ] Set permissions: `chmod -R 755 storage bootstrap/cache`
- [ ] Configure web server (Apache/Nginx)
- [ ] Test chat functionality
- [ ] Test integrasi dengan website utama
- [ ] Setup SSL certificate (HTTPS)
- [ ] Monitor logs: `storage/logs/laravel.log`

## Support & Maintenance

**Logs:**
```bash
tail -f storage/logs/laravel.log
```

**Clear cache:**
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**Update FAQ:**
Edit `public/assets/kamus.json` dan tambahkan Q&A baru.

**Monitor API usage:**
Check DeepSeek API dashboard untuk usage statistics.

## Troubleshooting

**Error: "No such table: sessions"**
```bash
php artisan migrate
```

**Error: "SQLSTATE[HY000] [2002] Connection refused"**
- Check database credentials di `.env`
- Pastikan MySQL service running

**Chat tidak muncul:**
- Check console browser untuk JavaScript errors
- Verify CSS dan JS loaded: `/css/chat.css`, `/js/chat.js`

**Rate limit error:**
- Default: 20 messages per minute
- Ubah di `ChatController.php`: `throttle:20,1`

## Kesimpulan

Aplikasi AIRA Chatbot ini **flexible dan mudah diintegrasikan** dengan website PHP 8.0 yang sudah ada. Pilih metode integrasi yang paling sesuai dengan kebutuhan Anda!

**Recommended:** Gunakan subdomain untuk deployment yang clean dan maintainable.
