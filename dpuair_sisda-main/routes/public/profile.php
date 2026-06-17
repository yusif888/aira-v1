<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\StaticController;

// ====== Profil Dinas
Route::prefix('profil')->group(function () {
    Route::get('/selayang-pandang', [StaticController::class, 'selayangPandang'])->name('profil.selayang-pandang');
    Route::get('/visi-misi', [StaticController::class, 'visiMisi'])->name('profil.visi-misi');
    Route::get('/tupoksi', [StaticController::class, 'tupoksi'])->name('profil.tupoksi');
    Route::get('/dasar-hukum', [StaticController::class, 'dasarHukum'])->name('profil.dasar-hukum');
    Route::get('/pimpinan', [StaticController::class, 'pimpinan'])->name('profil.pimpinan');
    Route::get('/kepegawaian', [StaticController::class, 'kepegawaian'])->name('profil.kepegawaian');
});

// ===== Struktur Organisasi
Route::prefix('organisasi')->group(function () {
    Route::get('/struktur', [StaticController::class, 'baganStruktur'])->name('organisasi.struktur');
    Route::get('/sekretariat', [StaticController::class, 'sekretariat'])->name('organisasi.sekretariat');
    Route::get('/perencanaan', [StaticController::class, 'bidangPerencanaan'])->name('organisasi.perencanaan');
    Route::get('/irigasi', [StaticController::class, 'bidangIrigasi'])->name('organisasi.irigasi');
    Route::get('/sungai-waduk', [StaticController::class, 'bidangSungaiWaduk'])->name('organisasi.sungai-waduk');
    Route::get('/bina-manfaat', [StaticController::class, 'bidangBinaManfaat'])->name('organisasi.bina-manfaat');
});

// ===== Unit Pelaksana Teknis
Route::prefix('upt')->group(function () {
    Route::get('/daftar-upt', [StaticController::class, 'daftarUPT'])->name('upt.daftar-upt');
    Route::get('/peta-sebaran', [StaticController::class, 'petaUPT'])->name('upt.peta-sebaran');
    Route::get('/bondoyudo-lumajang', [StaticController::class, 'bondoyudoLumajangUPT'])->name('upt.bondoyudo-lumajang');
    Route::get('/kepulauan-madura', [StaticController::class, 'kepulauanMaduraUPT'])->name('upt.kepulauan-madura');
    Route::get('/brantas-kediri', [StaticController::class, 'brantasKediriUPT'])->name('upt.brantas-kediri');
    Route::get('/sampean-setail', [StaticController::class, 'sampeanSetailUPT'])->name('upt.sampean-setail');
    Route::get('/welang-pekalen', [StaticController::class, 'welangPekalenUPT'])->name('upt.welang-pekalen');
    Route::get('/bengawan-solo', [StaticController::class, 'bengawanSoloUPT'])->name('upt.bengawan-solo');
});
