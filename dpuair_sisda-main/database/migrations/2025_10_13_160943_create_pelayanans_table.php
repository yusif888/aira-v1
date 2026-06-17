<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pelayanans', function (Blueprint $table) {
            $table->id();
            $table->string('kode_antrian')->unique();
            $table->string('nama_lengkap');
            $table->string('email');
            $table->string('instansi_asal');
            $table->enum('jenis_layanan', ['FHD', 'SIH3', 'JOSS']);
            $table->string('nomor_whatsapp');
            $table->text('catatan')->nullable();
            $table->date('tanggal_kedatangan');
            $table->enum('status', ['pending', 'diproses', 'selesai', 'dibatalkan'])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelayanans');
    }
};
