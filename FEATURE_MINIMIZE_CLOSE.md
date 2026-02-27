# Fitur Baru: Minimize & Close with Learning Data

## ✅ Yang Sudah Diimplementasikan:

### 1. **Database Baru: `chat_learning_data`**
Tabel untuk menyimpan conversation history sebagai data training AIRA:

**Kolom:**
- `session_id` - ID sesi chat
- `user_ip` - IP address user
- `conversation` - JSON array berisi semua pesan
- `message_count` - Total pesan dalam conversation
- `started_at` - Waktu mulai chat
- `ended_at` - Waktu akhir chat
- `is_processed` - Flag untuk training (false = belum diproses)
- `satisfaction_rating` - Rating 1-5 (optional, untuk future)
- `feedback` - Feedback user (optional, untuk future)
- `metadata` - Browser info, device, dll

### 2. **Tombol Minimize (−)**
**Fungsi:**
- Menyembunyikan chat window
- **TIDAK menghapus history**
- Chat akan tetap ada saat di-maximize lagi
- User bisa lanjut chat dari mana mereka stop

**Lokasi:** Sebelah kiri tombol Close
**Action:** Minimize UI only, no database operation

### 3. **Tombol Close (×)**
**Fungsi:**
- Konfirmasi: "Tutup chat? Riwayat percakapan akan disimpan..."
- Simpan seluruh conversation ke tabel `chat_learning_data`
- Hapus history dari tabel `chats`
- Close chat window
- Data tersimpan untuk training AIRA di masa depan

**Lokasi:** Paling kanan header
**Action:** Save to learning data + clear history

---

## 📊 Alur Kerja:

### **Scenario 1: User Minimize Chat**
```
1. User klik tombol Minimize (−)
2. Chat window tertutup
3. History TETAP ada di database `chats`
4. User klik "Tanya Aira" lagi
5. Chat history muncul kembali
6. User lanjut chat
```

### **Scenario 2: User Close Chat**
```
1. User klik tombol Close (×)
2. Muncul konfirmasi
3. User klik OK
4. Backend:
   - Ambil semua chat dari tabel `chats`
   - Simpan ke tabel `chat_learning_data` sebagai JSON
   - Hapus dari tabel `chats`
5. Chat window tertutup
6. History terhapus
7. User klik "Tanya Aira" lagi
8. Chat fresh/baru (welcome message)
```

---

## 🔍 Format Data Learning:

**Contoh data yang disimpan:**

```json
{
  "session_id": "abc123xyz",
  "user_ip": "192.168.1.100",
  "conversation": [
    {
      "sender": "user",
      "message": "Apa itu Dinas PU SDA?",
      "source": null,
      "timestamp": "2025-11-21T10:30:00.000Z"
    },
    {
      "sender": "bot",
      "message": "Dinas PU SDA Jatim adalah...",
      "source": "website_keyword",
      "timestamp": "2025-11-21T10:30:02.000Z"
    },
    {
      "sender": "user",
      "message": "Jam kerja berapa?",
      "source": null,
      "timestamp": "2025-11-21T10:31:00.000Z"
    },
    {
      "sender": "bot",
      "message": "Jam kerja kami adalah...",
      "source": "kamus",
      "timestamp": "2025-11-21T10:31:01.000Z"
    }
  ],
  "message_count": 4,
  "started_at": "2025-11-21 10:30:00",
  "ended_at": "2025-11-21 10:31:01",
  "is_processed": false,
  "metadata": {
    "user_agent": "Mozilla/5.0...",
    "saved_at": "2025-11-21T10:32:00.000Z"
  }
}
```

---

## 🎯 Kegunaan Data Learning:

### **Untuk Analisis:**
1. **Pertanyaan Populer** - Lihat pertanyaan apa yang sering ditanya
2. **Gap Analysis** - Pertanyaan yang dapat jawaban "default" (belum ada info)
3. **User Behavior** - Berapa lama user chat, berapa banyak pesan
4. **Source Distribution** - Berapa % dari kamus vs website knowledge

### **Untuk Training AIRA:**
1. **Improve Keywords** - Tambah keyword dari pertanyaan user
2. **Update Kamus** - Pertanyaan yang sering ditanya masuk kamus
3. **Better Matching** - Pelajari pattern pertanyaan user
4. **FAQ Generation** - Auto-generate FAQ dari data

---

## 🚀 Next Steps (Future Enhancement):

### 1. **Dashboard Admin**
- View semua learning data
- Statistik pertanyaan
- Export ke CSV/Excel
- Mark as processed

### 2. **Auto-Learning System**
- Cron job untuk process learning data
- Extract keywords otomatis
- Suggest new kamus entries
- Pattern recognition

### 3. **Feedback System**
- Rating setelah chat selesai
- "Apakah jawaban membantu?"
- Collect feedback untuk improvement

### 4. **Analytics Dashboard**
- Chart pertanyaan per hari
- Top 10 pertanyaan
- Success rate (kamus vs website vs default)
- User satisfaction trend

---

## 💻 Command untuk Cek Data:

### **Jalankan Migration:**
```bash
php artisan migrate
```

### **Cek Learning Data:**
```bash
php artisan tinker
>>> App\Models\ChatLearningData::count()
>>> App\Models\ChatLearningData::latest()->first()
>>> App\Models\ChatLearningData::where('is_processed', false)->count()
```

### **Export Learning Data:**
```bash
php artisan tinker
>>> $data = App\Models\ChatLearningData::all();
>>> file_put_contents('learning_data.json', $data->toJson(JSON_PRETTY_PRINT));
```

---

## 🎨 UI Changes:

### **Header Chat:**
```
Before: [Aira                          ×]
After:  [Aira                     −  ×]
```

- Tombol **Minimize (−)**: Hover = background putih transparant
- Tombol **Close (×)**: Hover = background putih transparant + konfirmasi

---

## ✅ Testing:

### **Test Minimize:**
1. Buka chat
2. Ketik beberapa pesan
3. Klik tombol **Minimize (−)**
4. Chat tertutup
5. Buka lagi dengan klik "Tanya Aira"
6. ✅ History masih ada

### **Test Close:**
1. Buka chat
2. Ketik beberapa pesan
3. Klik tombol **Close (×)**
4. Konfirmasi muncul
5. Klik OK
6. Chat tertutup
7. Cek database: `SELECT * FROM chat_learning_data`
8. ✅ Data tersimpan
9. Buka lagi chat
10. ✅ Chat fresh (welcome message)

---

**Implementasi Selesai!** 🎉

Sekarang AIRA memiliki sistem learning yang akan terus berkembang berdasarkan interaksi user real!
