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
        Schema::table('pelayanans', function (Blueprint $table) {
            $table->foreignId('jenis_kunjungan_id')->nullable()->after('kode_antrian')->constrained('jenis_kunjungan')->nullOnDelete();
        });

        Schema::table('pelayanans', function (Blueprint $table) {
            $table->dropColumn('jenis_layanan');
        });
    }

    public function down(): void
    {
        Schema::table('pelayanans', function (Blueprint $table) {
            $table->enum('jenis_layanan', ['FHD', 'SIH3', 'JOSS'])->nullable()->after('instansi_asal');
            $table->dropForeign(['jenis_kunjungan_id']);
            $table->dropColumn('jenis_kunjungan_id');
        });
    }
};
