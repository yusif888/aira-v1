# SECURITY CHECKLIST - AIRA Production Deployment

## ⚠️ SEBELUM DEPLOY KE PRODUCTION

### 🔐 **1. Environment & Configuration**

- [ ] Set `APP_ENV=production` di `.env`
- [ ] Set `APP_DEBUG=false` di `.env`
- [ ] Generate new `APP_KEY` untuk production
- [ ] Ganti `DEEPSEEK_API_KEY` dengan key production yang valid
- [ ] Set `APP_URL` sesuai domain production
- [ ] Pastikan `.env` **TIDAK** ter-commit ke Git

### 🛡️ **2. Database Security**

- [ ] Gunakan MySQL/PostgreSQL untuk production (bukan SQLite)
- [ ] Set strong password untuk database user
- [ ] Batasi akses database hanya dari localhost/private network
- [ ] Backup database secara rutin
- [ ] Enable database encryption jika memungkinkan

### 🔒 **3. Session & Cookie Security**

Edit `config/session.php`:
```php
'secure' => true,        // Hanya HTTPS
'http_only' => true,     // Prevent XSS
'same_site' => 'strict', // Prevent CSRF
```

### 🌐 **4. HTTPS/SSL**

- [ ] Install SSL certificate (Let's Encrypt gratis)
- [ ] Redirect semua HTTP ke HTTPS
- [ ] Set `HTTPS=true` di `.env`

### 🚫 **5. Rate Limiting**

✅ Sudah ditambahkan di ChatController (20 pesan/menit)

Untuk lebih ketat, edit di `app/Http/Controllers/ChatController.php`:
```php
if (RateLimiter::tooManyAttempts($key, 10)) { // 10 pesan/menit
```

### 🧹 **6. Input Validation & Sanitization**

✅ Sudah ditambahkan:
- `strip_tags()` - hapus HTML tags
- `htmlspecialchars()` - escape special chars
- Validation max 1000 characters

### 🗂️ **7. File Permissions**

Set proper permissions:
```bash
chmod -R 755 /var/www/airav1
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R www-data:www-data /var/www/airav1
```

### 🔑 **8. API Key Security**

✅ Sudah diperbaiki:
- API key hanya di `.env`
- Throw exception jika key tidak ada
- Tidak ada hardcoded key di code

**PENTING:** 
- Jangan commit `.env` ke Git
- Tambahkan `.env` ke `.gitignore`

### 🚀 **9. Performance Optimization**

```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### 📊 **10. Logging & Monitoring**

Edit `config/logging.php`:
```php
'channels' => [
    'production' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'error',
        'days' => 14,
    ],
],
```

Set di `.env`:
```env
LOG_CHANNEL=production
```

### 🔍 **11. Error Handling**

- [ ] Custom 404 page
- [ ] Custom 500 page
- [ ] Jangan tampilkan error details ke user

Edit `app/Exceptions/Handler.php`:
```php
public function render($request, Throwable $exception)
{
    if ($request->expectsJson()) {
        return response()->json([
            'success' => false,
            'message' => 'Terjadi kesalahan. Silakan coba lagi.'
        ], 500);
    }
    
    return parent::render($request, $exception);
}
```

### 🛡️ **12. Web Server Security**

#### Nginx Configuration:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/airav1/public;
    index index.php;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # Hide PHP version
    fastcgi_hide_header X-Powered-By;
    
    # Prevent access to sensitive files
    location ~ /\.(?!well-known).* {
        deny all;
    }
    
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

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 🔐 **13. CORS Configuration**

Jika akan diakses dari domain lain, buat Middleware:

```bash
php artisan make:middleware Cors
```

Edit `app/Http/Middleware/Cors.php`:
```php
public function handle($request, Closure $next)
{
    return $next($request)
        ->header('Access-Control-Allow-Origin', 'https://yourdomain.com')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true');
}
```

### 📦 **14. Dependencies**

- [ ] Update semua dependencies: `composer update`
- [ ] Check vulnerabilities: `composer audit`
- [ ] Remove dev dependencies di production

### 🧪 **15. Testing**

- [ ] Test semua fitur chat
- [ ] Test rate limiting
- [ ] Test dengan input malicious (XSS, SQL injection)
- [ ] Test di berbagai browser
- [ ] Test di mobile devices

### 📝 **16. .gitignore**

Pastikan file berikut di `.gitignore`:
```
/.env
/vendor
/node_modules
/public/hot
/public/storage
/storage/*.key
/storage/logs/*.log
/database/*.sqlite
```

### 🔄 **17. Backup Strategy**

- [ ] Setup automatic database backup (daily)
- [ ] Backup `.env` file secara terpisah dan aman
- [ ] Backup uploaded files (jika ada)
- [ ] Test restore backup secara berkala

### 📈 **18. Monitoring**

Tools yang bisa digunakan:
- Laravel Telescope (development)
- New Relic / Datadog (production)
- Sentry untuk error tracking
- Google Analytics untuk user tracking

### ⚡ **19. CDN & Caching**

- [ ] Upload static assets ke CDN
- [ ] Enable browser caching
- [ ] Enable Redis/Memcached untuk session & cache

### 🚨 **20. Emergency Plan**

- [ ] Dokumentasi rollback procedure
- [ ] Contact person untuk emergency
- [ ] Backup server/staging environment
- [ ] Maintenance mode page

---

## ✅ **Quick Deploy Commands**

```bash
# 1. Pull code
git pull origin main

# 2. Install dependencies
composer install --optimize-autoloader --no-dev

# 3. Run migrations
php artisan migrate --force

# 4. Clear & cache
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Set permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data .

# 6. Restart services
sudo systemctl restart php8.0-fpm
sudo systemctl restart nginx
```

---

## 🎯 **Current Security Status**

✅ **Fixed:**
- API key tidak hardcoded
- Input sanitization
- Rate limiting
- CSRF protection (Laravel default)

⚠️ **Needs Action:**
- Set production environment
- Configure HTTPS
- Set proper file permissions
- Configure web server security headers
- Setup database backup

---

**Last Updated:** November 19, 2025  
**Developer:** Yusif, S.Kom
