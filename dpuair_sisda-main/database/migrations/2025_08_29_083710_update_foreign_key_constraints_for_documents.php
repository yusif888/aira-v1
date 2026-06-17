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
        // Drop existing foreign key constraints
        Schema::table('documents_entries', function (Blueprint $table) {
            $table->dropForeign(['type_id']);
        });

        Schema::table('documents_types', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        // Re-add foreign key constraints with CASCADE delete
        Schema::table('documents_types', function (Blueprint $table) {
            $table->foreign('category_id')
                ->references('id')
                ->on('documents_categories')
                ->onDelete('cascade');
        });

        Schema::table('documents_entries', function (Blueprint $table) {
            $table->foreign('type_id')
                ->references('id')
                ->on('documents_types')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop CASCADE constraints
        Schema::table('documents_entries', function (Blueprint $table) {
            $table->dropForeign(['type_id']);
        });

        Schema::table('documents_types', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
        });

        // Re-add original constraints
        Schema::table('documents_types', function (Blueprint $table) {
            $table->foreign('category_id')
                ->references('id')
                ->on('documents_categories')
                ->onDelete('cascade');
        });

        Schema::table('documents_entries', function (Blueprint $table) {
            $table->foreign('type_id')
                ->references('id')
                ->on('documents_types')
                ->onDelete('restrict');
        });
    }
};
