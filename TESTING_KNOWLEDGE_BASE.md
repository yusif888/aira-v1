# Testing AIRA Knowledge Base System

## Test Cases untuk Validasi Sistem

### Test 1: Response dari Kamus
**Pertanyaan:** "Siapa kamu?"
**Expected:** Response dari kamus.json tentang AIRA
**Source:** `kamus`

### Test 2: Response dari Website (News)
**Pertanyaan:** "Berita terbaru tentang infrastruktur"
**Expected:** Response dari news_articles yang sudah di-index
**Source:** `website_keyword` atau `website_fulltext`

### Test 3: Response dari Website (Document)
**Pertanyaan:** "Dokumen RPJMD"
**Expected:** Response dari documents_entries yang sudah di-index
**Source:** `website_keyword`

### Test 4: Response dari Website (Portal Data)
**Pertanyaan:** "Data portal irigasi"
**Expected:** Response dari portaldata_datasets yang sudah di-index
**Source:** `website_keyword`

### Test 5: Default Response
**Pertanyaan:** "asdfghjkl qwerty random text"
**Expected:** Default message (tidak ada informasi)
**Source:** `default`

### Test 6: Info tentang AIRA
**Pertanyaan:** "Dari mana kamu mendapat informasi?"
**Expected:** Response dari kamus.json yang menjelaskan sumber info AIRA
**Source:** `kamus`

### Test 7: DeepSeek Check
**Pertanyaan:** "Apakah kamu menggunakan DeepSeek?"
**Expected:** Response dari kamus.json bahwa AIRA tidak menggunakan DeepSeek
**Source:** `kamus`

---

## Manual Testing via Chat UI

1. Buka browser: `http://localhost/airav1-php80/public/chat` (sesuaikan URL)
2. Ketik pertanyaan dari test cases di atas
3. Cek response message
4. Cek browser console untuk melihat `source` dan `source_info`

---

## Automated Testing via API

### Test dengan cURL

```bash
# Test 1: Kamus Response
curl -X POST http://localhost/airav1-php80/public/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"message":"Siapa kamu?"}'

# Test 2: Website Knowledge
curl -X POST http://localhost/airav1-php80/public/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"message":"Berita terbaru"}'

# Test 3: Default Response
curl -X POST http://localhost/airav1-php80/public/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"message":"random gibberish text 123456"}'
```

### Expected Response Structure

```json
{
  "success": true,
  "message": "Response text dari AIRA",
  "source": "kamus|website_exact|website_keyword|website_fulltext|default",
  "source_info": {
    "id": 123,
    "type": "news|document|portal_data",
    "title": "Title of source",
    "url": "https://..."
  },
  "bot_chat": {
    "id": 456,
    "session_id": "...",
    "sender": "bot",
    "message": "...",
    "source": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

## Testing Checklist

- [ ] Migration berhasil dijalankan
- [ ] Tabel `website_knowledge` ada di database
- [ ] Command `aira:index-website` berjalan tanpa error
- [ ] Knowledge base terisi dengan data dari dpuair_sisda
- [ ] Test pertanyaan kamus mendapat response dari kamus
- [ ] Test pertanyaan website mendapat response dari knowledge base
- [ ] Test pertanyaan random mendapat default message
- [ ] Response includes correct `source` type
- [ ] Response includes `source_info` untuk website knowledge
- [ ] Chat history tersimpan dengan benar
- [ ] No reference ke DeepSeek di response
- [ ] Kamus JSON terbaca dengan benar
- [ ] WebsiteKnowledgeService berfungsi

---

## Database Validation

```sql
-- Check total entries
SELECT COUNT(*) FROM website_knowledge;

-- Check by source type
SELECT source_type, COUNT(*) as total 
FROM website_knowledge 
GROUP BY source_type;

-- Check latest entries
SELECT id, source_type, title, created_at 
FROM website_knowledge 
ORDER BY created_at DESC 
LIMIT 10;

-- Check keywords
SELECT id, title, keywords 
FROM website_knowledge 
WHERE source_type = 'news' 
LIMIT 5;

-- Test search
SELECT id, title, source_type 
FROM website_knowledge 
WHERE LOWER(title) LIKE '%infrastruktur%' 
   OR LOWER(content) LIKE '%infrastruktur%';
```

---

## Performance Testing

### Response Time Benchmark

```bash
# Test 100 requests
for i in {1..100}; do
  curl -X POST http://localhost/airav1-php80/public/api/chat/send \
    -H "Content-Type: application/json" \
    -d '{"message":"Siapa kamu?"}' \
    -w "\nTime: %{time_total}s\n"
done
```

**Expected:**
- Kamus response: < 100ms
- Website knowledge response: < 500ms
- Default response: < 50ms

---

## Error Scenarios

### Test Error Handling

1. **Empty message**
   - Input: `""`
   - Expected: Validation error

2. **Very long message**
   - Input: 1000+ characters
   - Expected: Validation error (max 1000)

3. **Special characters**
   - Input: `"<script>alert('xss')</script>"`
   - Expected: Sanitized, no XSS

4. **Rate limiting**
   - Send 25 requests in 1 minute
   - Expected: 429 error after 20 requests

---

## Success Criteria

✅ All test cases pass
✅ No errors in Laravel logs
✅ No DeepSeek references in responses
✅ Response time acceptable
✅ Knowledge base populated
✅ Chat history saved correctly
✅ Source tracking works

---

**Testing Date:** _______________
**Tested By:** _______________
**Status:** [ ] Pass [ ] Fail
**Notes:** _______________
