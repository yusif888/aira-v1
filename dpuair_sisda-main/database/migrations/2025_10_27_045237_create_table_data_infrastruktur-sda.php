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
        // Tabel kategori infrastruktur (master, sih3, irigasi)
        Schema::create('infrastruktur_categories', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique()->comment('master, sih3, irigasi');
            $table->string('name')->comment('Data Master, SIH3, IRIGASI');
            $table->text('icon')->nullable()->comment('SVG path untuk icon');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tabel data infrastruktur
        Schema::create('data_infrastruktur_sda', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('infrastruktur_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('code')->comment('awlr, posDugaAir, kantorDinas, dll');
            $table->enum('type', ['marker', 'line', 'polygon'])->default('marker');
            $table->string('legend_color')->nullable()->comment('Hex color untuk legend');
            $table->text('description')->nullable();
            
            // Koordinat untuk marker
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            
            // GeoJSON untuk line/polygon
            $table->json('geojson')->nullable();
            
            // File GeoJSON/JSON yang diupload
            $table->string('file_path')->nullable()->comment('Path file GeoJSON/JSON di storage/public');
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_infrastruktur_sda');
        Schema::dropIfExists('infrastruktur_categories');
    }
};
