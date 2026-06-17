<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\InfrastrukturSDAController;

Route::get('/infrastruktur-sda', [InfrastrukturSDAController::class, 'index'])->name('public.infrastruktur-sda.index');
