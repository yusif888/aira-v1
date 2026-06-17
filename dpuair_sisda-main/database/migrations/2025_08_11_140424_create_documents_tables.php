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
        // Master: categories
        Schema::create('documents_categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name')->unique()->comment('Nama kategori, contoh: Perencanaan & Anggaran');
            $table->text('description')->nullable()->comment('Deskripsi singkat tentang kategori ini');
            $table->boolean('is_active')->default(true)->comment('Status aktif kategori');
        });

        // Master: types (belongs to category)
        Schema::create('documents_types', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('category_id')
                ->constrained('documents_categories')
                ->onDelete('cascade')
                ->comment('Foreign key ke tabel kategori');
            $table->string('name')->comment('Nama jenis dokumen, contoh: Renstra, UU, Pergub, Peta');
            $table->string('icon')->default('file-text')->comment('Icon untuk tampilan frontend');
            $table->enum('status', ['active', 'inactive'])->default('active')->comment('Status aktif/tidak aktif');
            $table->boolean('is_active')->default(true);
        });

        // Master: tags

        Schema::create('documents_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('Nama tag, contoh: Mata Air');
            $table->string('slug')->unique()->comment('Versi URL-friendly dari nama tag, contoh: mata-air');
            $table->timestamps();

            // Index untuk pencarian
            $table->index(['name', 'slug']);
        });

        /**
         * Reverse the migrations.
         */


        // Entries (belongs to type, optional uploader)
        Schema::create('documents_entries', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes()->comment('Untuk soft delete, dokumen dapat dipulihkan');
            $table->foreignId('type_id')
                ->constrained('documents_types')
                ->onDelete('restrict')
                ->comment('Foreign key ke jenis dokumen');

            $table->string('title')->comment('Judul lengkap dari dokumen');
            $table->string('document_number')->nullable()->comment('Nomor surat/dokumen resmi, jika ada');
            $table->year('year')->comment('Tahun terbit atau tahun berlakunya dokumen');
            $table->text('description')->nullable()->comment('Ringkasan singkat isi atau konteks dokumen');
            $table->string('file_path')->comment('Lokasi penyimpanan file di server (misal: documents/renstra-2024.pdf)');
            $table->foreignId('uploader_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null')
                ->comment('User yang mengupload dokumen ini');
        });

        // Pivot: document_entry_tag (many-to-many)
        Schema::create('document_entry_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_entry_id')->constrained('documents_entries')->onDelete('cascade');
            $table->foreignId('tag_id')->constrained('documents_tags')->onDelete('cascade');
            $table->timestamps();

            // Composite unique key untuk mencegah duplikasi
            $table->unique(['document_entry_id', 'tag_id']);

            // Index untuk performa query
            $table->index('document_entry_id');
            $table->index('tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop pivot first, then dependents, then masters
        Schema::dropIfExists('document_entry_tag');
        Schema::dropIfExists('documents_entries');
        Schema::dropIfExists('documents_tags');
        Schema::dropIfExists('documents_types');
        Schema::dropIfExists('documents_categories');
    }
};
