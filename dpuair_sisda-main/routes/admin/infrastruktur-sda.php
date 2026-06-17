<?php

use App\Http\Controllers\Admin\InfrastrukturSDAController;
use App\Http\Controllers\Admin\InfrastrukturCategoryController;
use Illuminate\Support\Facades\Route;

// Infrastruktur SDA Management
Route::prefix('infrastruktur-sda')->name('infrastruktur-sda.')->group(function () {
    Route::get('/', [InfrastrukturSDAController::class, 'index'])->name('index');
    Route::get('/create', [InfrastrukturSDAController::class, 'create'])->name('create');
    Route::post('/', [InfrastrukturSDAController::class, 'store'])->name('store');
    Route::get('/{infrastruktur}/edit', [InfrastrukturSDAController::class, 'edit'])->name('edit');
    Route::put('/{infrastruktur}', [InfrastrukturSDAController::class, 'update'])->name('update');
    Route::delete('/{infrastruktur}', [InfrastrukturSDAController::class, 'destroy'])->name('destroy');

    // Categories Management
    Route::get('/categories', [InfrastrukturCategoryController::class, 'index'])->name('categories');
    Route::post('/categories', [InfrastrukturCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [InfrastrukturCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [InfrastrukturCategoryController::class, 'destroy'])->name('categories.destroy');
});
