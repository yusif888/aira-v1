<?php

use App\Http\Controllers\Public\DashboardController as PublicDashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Public\SitemapController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (dengan SSR untuk SEO)
|--------------------------------------------------------------------------
*/
// Sitemap XML
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Dashboard
Route::get('/', [PublicDashboardController::class, 'welcome'])->name('home');
Route::get('/home', function () {
    return redirect()->route('home');
});

// Profil
require __DIR__ . '/public/profile.php';

// Berita
require __DIR__ . '/public/news.php';

// Dokumen
require __DIR__ . '/public/document.php';

// Portal Data
require __DIR__ . '/public/portal-data.php';

// Infrastruktur SDA
require __DIR__ . '/public/infrastruktur-sda.php';

// Pelayanan (Antrian)
require __DIR__ . '/public/pelayanan.php';

// SDA Dalam Angka
require __DIR__ . '/public/sda-dalam-angka.php';

// Galeri
Route::get('/galeri', [PublicDashboardController::class, 'galeri'])->name('public.galeri.index');

// Auth
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Admin Routes (tanpa SSR untuk performa)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified'])->group(function () {

    // Redirect dari /admin ke /admin/dashboard
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });

    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Document Management
    require __DIR__ . '/admin/documents.php';

    // Import semua route modul admin
    require __DIR__ . '/admin/news.php';

    // Permission Management
    require __DIR__ . '/admin/permission.php';

    // Portal Data Management
    require __DIR__ . '/admin/portal-data.php';

    // Profile Management
    require __DIR__ . '/admin/profile.php';

    // Role Management
    require __DIR__ . '/admin/role.php';

    // User Management
    require __DIR__ . '/admin/user.php';

    // Pelayanan Management
    require __DIR__ . '/admin/pelayanan.php';

    // Infrastruktur SDA Management
    require __DIR__ . '/admin/infrastruktur-sda.php';
});
