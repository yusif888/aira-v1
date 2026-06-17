<?php

use App\Http\Controllers\Public\SDADalamAngkaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SDA Dalam Angka Routes
|--------------------------------------------------------------------------
|
| Halaman dan endpoint publik terkait statistik dan data "SDA Dalam Angka".
| Menyajikan data, grafik, atau statistik penting bidang sumber daya air.
| 
| Path utama: /sda-dalam-angka
|
*/

// Halaman utama SDA Dalam Angka
Route::get('/sda-dalam-angka', [SDADalamAngkaController::class, 'index'])->name('public.sda-dalam-angka.index');

// (Bisa diperluas dengan route tambahan, misal: detail statistik, download, dsb.)
Route::get('/sda-dalam-angka/show', [SDADalamAngkaController::class, 'show'])->name('public.sda-dalam-angka.show');
