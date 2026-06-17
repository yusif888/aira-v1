<?php

use App\Http\Controllers\Admin\Pelayanan\PelayananAntrianController;
use App\Http\Controllers\Admin\Pelayanan\PelayananJenisKunjunganController;
use Illuminate\Support\Facades\Route;

Route::prefix('pelayanan')->name('pelayanan.')->group(function () {
    // Antrian
    Route::prefix('antrian')->name('antrian.')->group(function () {
        Route::get('/', [PelayananAntrianController::class, 'index'])->name('index');
        Route::get('/export', [PelayananAntrianController::class, 'export'])->name('export');
        Route::patch('/{id}/status', [PelayananAntrianController::class, 'updateStatus'])->name('update-status');
    });

    // Jenis Kunjungan (modal only — no index route)
    Route::prefix('jenis-kunjungan')->name('jenis-kunjungan.')->group(function () {
        Route::post('/', [PelayananJenisKunjunganController::class, 'store'])->name('store');
        Route::put('/{jenisKunjungan}', [PelayananJenisKunjunganController::class, 'update'])->name('update');
        Route::delete('/{jenisKunjungan}', [PelayananJenisKunjunganController::class, 'destroy'])->name('destroy');
    });
});
