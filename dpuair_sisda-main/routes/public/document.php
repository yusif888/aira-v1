<?php

use App\Http\Controllers\Public\DocumentController;
use Illuminate\Support\Facades\Route;

// Dokumen & Regulasi (Pusat Unduhan) - Halaman statis
Route::get('/dokumen', [DocumentController::class, 'index'])->name('public.documents.index');
Route::get('/dokumen/{entry}', [DocumentController::class, 'show'])->name('public.documents.show');
