# PANDUAN DEPLOYMENT AIRA AI DENGAN QWEN 2.5 (vLLM)
## Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur

Dokumen ini berisi panduan teknis lengkap untuk mengoperasikan model AI mandiri (*self-hosted*) **`Qwen/Qwen2.5-7B-Instruct`** menggunakan engine **vLLM** di server dinas agar tahan melayani banyak pengguna secara bersamaan.

---

### 1. Apakah Model Otomatis Terunduh dari Hugging Face Tanpa Login?

> [!IMPORTANT]
> **YA, 100% OTOMATIS DAN TANPA PERLU LOGIN.**
> 
> Berbeda dengan model Meta (Llama 3) yang *gated* dan mewajibkan pendaftaran token persetujuan, model **`Qwen/Qwen2.5-7B-Instruct`** dirilis oleh Alibaba Cloud di bawah lisensi terbuka **Apache 2.0 (Ungated Public Access)**.
> 
> Saat container vLLM pertama kali dihidupkan, vLLM akan langsung menghubungi tautan [https://huggingface.co/Qwen/Qwen2.5-7B-Instruct](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) dan mengunduh berkas bobot model (*safetensors*) secara anonim ke volume Docker `vllm_cache`. Berkas tersebut tersimpan permanen di server dinas sehingga proses unduh hanya terjadi **sekali saja**.

---

### 2. Prasyarat Infrastruktur Server GPU

* **Sistem Operasi**: Linux Ubuntu 22.04 LTS / Debian 12 / Rocky Linux 9.
* **GPU**: 1x NVIDIA GPU dengan VRAM minimal **16 GB – 24 GB** (Rekomendasi: RTX 3090, RTX 4090, NVIDIA L4, atau A10G).
* **Driver NVIDIA**: Versi $\ge$ 535.xx.
* **Perangkat Lunak**:
  * Docker Engine ($\ge$ 24.0)
  * Docker Compose ($\ge$ 2.20)
  * **NVIDIA Container Toolkit** (`nvidia-docker2` atau runtime `nvidia`).

---

### 3. Cara Menjalankan vLLM di Server GPU

1. **Pastikan NVIDIA Container Toolkit Aktif**:
   ```bash
   # Uji deteksi GPU di dalam Docker
   docker run --rm --gpus all nvidia/cuda:12.2.0-base-ubuntu22.04 nvidia-smi
   ```

2. **Jalankan Container Menggunakan Docker Compose**:
   Pada direktori root repositori `aira-v1`, jalankan:
   ```bash
   docker compose -f docker-compose.vllm.yml up -d
   ```

3. **Pantau Proses Unduh dan Booting Model**:
   ```bash
   docker logs -f aira-qwen-inference
   ```
   *Anda akan melihat progress download file safetensors dari Hugging Face (~15,2 GB). Setelah selesai, vLLM akan mencetak:*
   ```text
   INFO: Application startup complete.
   INFO: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
   ```

4. **Uji Endpoint Langsung via cURL**:
   ```bash
   curl http://localhost:8000/v1/chat/completions \
     -H "Content-Type: application/json" \
     -d '{
       "model": "Qwen/Qwen2.5-7B-Instruct",
       "messages": [
         {"role": "system", "content": "Anda adalah AIRA, asisten Dinas PU SDA Jatim."},
         {"role": "user", "content": "Halo, sebutkan alamat kantor dinas!"}
       ],
       "temperature": 0.3
     }'
   ```

---

### 4. Konfigurasi di Sisi Aplikasi Web Laravel

Di server web dinas (tempat aplikasi Laravel `aira-v1` berjalan), sesuaikan berkas `.env`:

```env
# Aktifkan AI
QWEN_ENABLED=true

# Matikan mock untuk produksi
QWEN_MOCK=false

# Arahkan ke IP server GPU tempat vLLM berjalan (Port 8000)
QWEN_API_URL=http://127.0.0.1:8000/v1/chat/completions
# Jika beda server fisik: QWEN_API_URL=http://192.168.1.100:8000/v1/chat/completions

QWEN_MODEL=Qwen/Qwen2.5-7B-Instruct
QWEN_TIMEOUT=30
QWEN_TEMPERATURE=0.3
QWEN_MAX_TOKENS=800
```

---

### 5. Panduan Pengujian di Lingkungan Lokal (Tanpa GPU)

Bagi pengembang yang mengerjakan fitur di laptop lokal tanpa GPU NVIDIA diskrit:
1. Buka berkas `.env`.
2. Pasang nilai:
   ```env
   QWEN_ENABLED=true
   QWEN_MOCK=true
   ```
3. `QwenAIService` akan otomatis mengaktifkan emulator respon cerdas. Anda dapat menguji tampilan UI bubble chat, input user, riwayat percakapan di database, dan penggabungan RAG dokumen tanpa membebani memori laptop.

---

### 6. Arsitektur Pelindung Server (Anti-Crash Safeguards)

Konfigurasi pada `docker-compose.vllm.yml` telah dipersenjatai dengan:
* **`--gpu-memory-utilization 0.90`**: Memberikan batas aman 10% VRAM GPU untuk komputasi CUDA kernel agar terhindar dari fatal *OOM (Out-of-Memory)*.
* **`--max-model-len 4096`**: Mencegah serangan *prompt flooding* dari user nakal yang dapat menghabiskan seluruh VRAM dalam sekejap.
* **`--max-num-seqs 64`**: Membatasi antrean paralel 64 interaksi aktif per-detik secara teratur (*fair FIFO queuing*).
* **`--enable-prefix-caching`**: Menggunakan kembali (*reuse*) memori token *System Prompt* kedinasan yang identik untuk seluruh user, meningkatkan efisiensi throughput hingga 3x lipat.
