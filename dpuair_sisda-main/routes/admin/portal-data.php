<?php

use App\Http\Controllers\Admin\PortalDataController;
use Illuminate\Support\Facades\Route;

Route::prefix('portal-data')->name('portal-data.')->group(function () {
    // Route untuk dataset
    Route::get('/dataset', [PortalDataController::class, 'datasets'])->name('datasets');
});
