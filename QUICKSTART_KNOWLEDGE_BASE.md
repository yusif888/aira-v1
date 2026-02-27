# Quick Start: AIRA Knowledge Base System

## 🎯 Ringkasan
AIRA sekarang fokus pada **Kamus Internal** dan **Konten Website dpuair_sisda**, tanpa DeepSeek AI.

---

## 🚀 Setup Awal (Sekali Jalan)

### 1. Jalankan Migration
```bash
cd c:\laragon\www\airav1-php80
php artisan migrate
```

### 2. Index Konten Website
```bash
php artisan aira:index-website --fresh
```

✅ **Done!** AIRA siap menjawab berdasarkan kamus + konten website.

---

## 📝 Update Pengetahuan AIRA

### Update Kamus (Manual)
Edit file: `public/assets/kamus.json`
```json
{
  "pertanyaan": ["keyword1", "keyword2"],
  "jawaban": "Jawaban AIRA"
}
```

### Update dari Website (Otomatis)
```bash
# Update semua konten
php artisan aira:index-website

# Update fresh (hapus lama, insert baru)
php artisan aira:index-website --fresh

# Update spesifik
php artisan aira:index-website --source=news
php artisan aira:index-website --source=documents
php artisan aira:index-website --source=portal-data
```

---

## 🔍 Prioritas Pencarian AIRA

1. **Kamus JSON** ← Paling prioritas
2. **Website Knowledge Base** ← Jika tidak ada di kamus
3. **Default Message** ← Jika tidak ada di mana-mana

---

## 📊 Command Berguna

```bash
# Cek statistik knowledge base
php artisan tinker
>>> $service = new App\Services\WebsiteKnowledgeService();
>>> $service->getStatistics();

# Cek total entries
>>> App\Models\WebsiteKnowledge::count();

# Cek by type
>>> App\Models\WebsiteKnowledge::select('source_type')
    ->selectRaw('count(*) as total')
    ->groupBy('source_type')
    ->get();
```

---

## ⏰ Auto-Update (Optional)

Tambahkan di `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('aira:index-website')
        ->daily()
        ->at('02:00');
}
```

Jangan lupa jalankan scheduler:
```bash
# Windows (Task Scheduler)
php artisan schedule:run

# Linux (Crontab)
* * * * * cd /path/to/airav1 && php artisan schedule:run >> /dev/null 2>&1
```

---

## ✅ Test AIRA

Buka chat dan tanya:
- "Siapa kamu?"
- "Dari mana kamu mendapat informasi?"
- "Berita terbaru"
- "Dokumen tentang..."

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Knowledge base kosong | Run `php artisan aira:index-website --fresh` |
| Response lambat | Add database indexes |
| Error saat indexing | Check database connection |
| Jawaban tidak relevan | Update keywords di kamus.json |

---

## 📖 Dokumentasi Lengkap

Lihat: `AIRA_KNOWLEDGE_BASE.md`

---

**Version:** 1.0.0  
**Date:** 20 November 2025
