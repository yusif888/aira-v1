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
        // Pastikan "Perencanaan dan Anggaran" di posisi pertama (ID = 1)
        $perencanaanCategory = \App\Models\Documents\DocumentsCategory::where('name', 'LIKE', '%Perencanaan%')
            ->orWhere('name', 'LIKE', '%Anggaran%')
            ->first();
            
        if ($perencanaanCategory && $perencanaanCategory->id != 1) {
            // Jika kategori perencanaan ada tapi bukan ID 1, tukar dengan ID 1
            $firstCategory = \App\Models\Documents\DocumentsCategory::find(1);
            
            if ($firstCategory) {
                // Tukar ID sementara
                $tempId = 999999;
                
                // Update kategori perencanaan ke ID sementara
                $perencanaanCategory->update(['id' => $tempId]);
                
                // Update kategori pertama ke ID kategori perencanaan
                $firstCategory->update(['id' => $perencanaanCategory->id]);
                
                // Update kategori perencanaan ke ID 1
                \App\Models\Documents\DocumentsCategory::where('id', $tempId)->update(['id' => 1]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak ada rollback yang diperlukan untuk reordering
    }
};
