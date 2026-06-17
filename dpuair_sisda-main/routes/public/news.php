<?php

use App\Http\Controllers\Public\NewsController as PublicNewsController;
use Illuminate\Support\Facades\Route;

// Placeholder for future news routes
// (No dynamic news feature yet; see project notes)

Route::get('/berita', [PublicNewsController::class, 'index'])->name('public.news.index');
Route::get('/berita/publikasi', [PublicNewsController::class, 'publikasi'])->name('public.news.publikasi');
Route::get('/berita/event', [PublicNewsController::class, 'event'])->name('public.news.event');
Route::get('/berita/tkpsda', [PublicNewsController::class, 'tkpsda'])->name('public.news.tkpsda');
Route::get('/berita/dsda', [PublicNewsController::class, 'dsda'])->name('public.news.dsda');
Route::get('/berita/komir', [PublicNewsController::class, 'komir'])->name('public.news.komir');
Route::get('/berita/details/{article}', [PublicNewsController::class, 'show'])->name('public.news.show');
