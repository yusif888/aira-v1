<?php

use App\Http\Controllers\Public\PortalDataController;
use Illuminate\Support\Facades\Route;

Route::get('/portal-data', [PortalDataController::class, 'index'])->name('public.portal-data.index');
