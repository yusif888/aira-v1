<?php

use App\Http\Controllers\Public\PelayananController;
use Illuminate\Support\Facades\Route;

// Public Pelayanan Routes - untuk user mendaftar antrian
Route::prefix('pelayanan')->name('pelayanan.')->group(function () {
    Route::get('/', [PelayananController::class, 'index'])->name('index');
    Route::post('/', [PelayananController::class, 'store'])->name('store');
    Route::get('/show/{kodeAntrian}', [PelayananController::class, 'show'])->name('show');
    Route::post('/check', [PelayananController::class, 'check'])->name('check');
});
