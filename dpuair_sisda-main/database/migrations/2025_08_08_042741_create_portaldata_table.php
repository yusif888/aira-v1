<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('portaldata_datasets', function (Blueprint $table) {
            $table->id();

            // === Kolom Kunci untuk Identifikasi & Routing ===

            // Slug akan menjadi bagian dari URL. WAJIB UNIK.
            // Contoh: "data-curah-hujan-2023" -> URL: domain.go.id/portal/data-curah-hujan-2023
            $table->string('slug')->unique();

            // Ini adalah kunci yang Anda minta. Menentukan file view/template mana yang harus di-load.
            // Contoh: "pages.data.curah_hujan_2023" (path ke file view Anda di Laravel)
            $table->string('view_path');

            // === Kolom Konten & Metadata ===

            // Judul yang akan ditampilkan di halaman (tag <title> dan <h1>)
            $table->string('title');

            // Deskripsi singkat yang mungkin Anda tampilkan di bawah judul.
            $table->text('description')->nullable();

            // Payload utama. Gunakan 'json' untuk keuntungan di sisi database jika didukung.
            // 'longText' adalah alternatif aman jika ada masalah kompatibilitas.
            $table->json('json_data');

            // Metadata tambahan, juga dalam format JSON.
            // Contoh: {"sumber": "BMKG", "penanggung_jawab": "Bidang SDA", "periode": "Tahunan"}
            $table->json('metadata')->nullable();


            // === Kolom untuk Manajemen & Status ===

            // Status untuk mengontrol visibilitas. ENUM lebih ketat, atau VARCHAR jika ingin fleksibel.
            $table->enum('status', ['published', 'draft', 'archived'])->default('draft');

            // Siapa yang membuat/terakhir mengubah. Berguna untuk tracking.
            $table->foreignId('author_id')->nullable()->constrained('users'); // Asumsi ada tabel 'users'

            $table->timestamps(); // Otomatis membuat `created_at` dan `updated_at`
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('portaldata_datasets');
    }
};
