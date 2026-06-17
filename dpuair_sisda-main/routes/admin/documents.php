<?php

use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\DocumentCategoryController;
use App\Http\Controllers\Admin\DocumentTypeController;
use App\Http\Controllers\Admin\DocumentTagController;
use Illuminate\Support\Facades\Route;

Route::prefix('dokumen')->name('documents.')->group(function () {
    // Route statis (tanpa parameter) harus diletakkan di atas
    Route::get('/', [DocumentController::class, 'index'])->name('index');
    Route::get('/create', [DocumentController::class, 'create'])->name('create');
    Route::post('/', [DocumentController::class, 'store'])->name('store');

    // Route untuk kategori dokumen
    Route::get('/kategori', [DocumentCategoryController::class, 'index'])->name('categories');
    Route::post('/kategori', [DocumentCategoryController::class, 'store'])->name('document-categories.store');
    Route::put('/kategori/{id}', [DocumentCategoryController::class, 'update'])->name('document-categories.update');
    Route::delete('/kategori/{id}', [DocumentCategoryController::class, 'destroy'])->name('document-categories.destroy');

    // Route untuk tipe dokumen
    // Route::get('/tipe', [DocumentController::class, 'types'])->name('types'); // Commented out as method not found
    Route::post('/tipe', [DocumentTypeController::class, 'store'])->name('types.store');
    Route::put('/tipe/{id}', [DocumentTypeController::class, 'update'])->name('types.update');
    Route::delete('/tipe/{id}', [DocumentTypeController::class, 'destroy'])->name('types.destroy');

    // Route untuk tags dokumen
    Route::get('/tags', [DocumentTagController::class, 'index'])->name('tags');
    Route::post('/tags', [DocumentTagController::class, 'store'])->name('tags.store');
    Route::put('/tags/{id}', [DocumentTagController::class, 'update'])->name('tags.update');
    Route::delete('/tags/{id}', [DocumentTagController::class, 'destroy'])->name('tags.destroy');

    // Route untuk trash
    Route::get('/trash', [DocumentController::class, 'trash'])->name('trash');
    // Route::post('/trash/restore-all', [DocumentController::class, 'restoreAll'])->name('restore-all'); // Commented out as method not found
    // Route::post('/trash/empty', [DocumentController::class, 'emptyTrash'])->name('empty-trash'); // Commented out as method not found

    // Route dengan parameter (harus di bawah route statis)
    Route::get('/{id}', [DocumentController::class, 'show'])->name('show');
    Route::get('/{id}/edit', [DocumentController::class, 'edit'])->name('edit');
    Route::put('/{id}', [DocumentController::class, 'update'])->name('update');
    Route::delete('/{id}', [DocumentController::class, 'destroy'])->name('destroy');

    // Route untuk trash actions
    Route::post('/{id}/restore', [DocumentController::class, 'restore'])->name('restore');
    Route::delete('/{id}/force-delete', [DocumentController::class, 'forceDelete'])->name('force-delete');
});
