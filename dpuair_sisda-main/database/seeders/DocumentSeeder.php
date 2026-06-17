<?php

namespace Database\Seeders;

use App\Models\Documents\DocumentsCategory;
use App\Models\Documents\DocumentsEntry;
use App\Models\Documents\DocumentsTag;
use App\Models\Documents\DocumentsType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Siapkan direktori untuk file placeholder
        Storage::disk('public')->makeDirectory('seeders/documents');

        // 2. Buat Kategori & Jenis Dokumen yang realistis
        $catPerencanaan = DocumentsCategory::create([
            'name' => 'Perencanaan & Anggaran',
            'description' => 'Dokumen terkait rencana strategis, rencana kerja, dan alokasi anggaran.',
        ]);
        DocumentsType::factory()->create(['category_id' => $catPerencanaan->id, 'name' => 'Renstra']);
        DocumentsType::factory()->create(['category_id' => $catPerencanaan->id, 'name' => 'LAKIP']);

        $catRegulasi = DocumentsCategory::create([
            'name' => 'Regulasi & Hukum',
            'description' => 'Dokumen peraturan perundang-undangan yang menjadi dasar hukum.',
        ]);
        DocumentsType::factory()->create(['category_id' => $catRegulasi->id, 'name' => 'Undang-Undang']);
        DocumentsType::factory()->create(['category_id' => $catRegulasi->id, 'name' => 'Peraturan Pemerintah']);
        DocumentsType::factory()->create(['category_id' => $catRegulasi->id, 'name' => 'Peraturan Gubernur']);

        // 3. Buat beberapa Tag
        $tags = DocumentsTag::factory(10)->create();

        // 4. Buat Entri Dokumen
        DocumentsEntry::factory(30)->create()->each(function ($document) use ($tags) {
            // Attach 1 sampai 2 tag secara acak
            $document->tags()->attach(
                $tags->random(rand(1, 2))->pluck('id')->toArray()
            );
        });
    }
}
