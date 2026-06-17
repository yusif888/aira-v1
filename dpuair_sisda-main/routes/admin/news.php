<?php

use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\NewsCategoryController;
use App\Http\Controllers\Admin\NewsTagController;
use Illuminate\Support\Facades\Route;

Route::prefix('berita')->name('news.')->group(function () {
    Route::get('/', [NewsController::class, 'index'])->name('index');
    Route::get('/create', [NewsController::class, 'create'])->name('create');
    Route::post('/', [NewsController::class, 'store'])->name('store');
    Route::get('/{news}/edit', [NewsController::class, 'edit'])->name('edit');
    Route::put('/{news}', [NewsController::class, 'update'])->name('update');
    Route::delete('/{news}', [NewsController::class, 'destroy'])->name('destroy');
    Route::patch('/{news}/restore', [NewsController::class, 'restore'])->name('restore');
    Route::delete('/{news}/force', [NewsController::class, 'forceDelete'])->name('force-delete');

    // Route untuk kategori berita
    Route::get('/kategori', [NewsCategoryController::class, 'index'])->name('categories');
    Route::post('/kategori', [NewsCategoryController::class, 'store'])->name('categories.store');
    Route::put('/kategori/{id}', [NewsCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/kategori/{id}', [NewsCategoryController::class, 'destroy'])->name('categories.destroy');

    // Route untuk tags berita
    Route::get('/tags', [NewsTagController::class, 'index'])->name('tags');
    Route::post('/tags', [NewsTagController::class, 'store'])->name('tags.store');
    Route::put('/tags/{id}', [NewsTagController::class, 'update'])->name('tags.update');
    Route::delete('/tags/{id}', [NewsTagController::class, 'destroy'])->name('tags.destroy');

    // Route untuk berita terhapus
    Route::get('/trash', [NewsController::class, 'trash'])->name('trash');

    // Route untuk check data
    Route::get('/check-data', [NewsController::class, 'checkData'])->name('check-data');

    // Route untuk test restore (temporary) - REMOVED
    // Route::get('/test-restore/{id}', [NewsController::class, 'testRestore'])->name('test-restore');
});
