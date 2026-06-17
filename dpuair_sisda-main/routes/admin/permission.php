<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\PermissionController;

Route::resource('permissions', PermissionController::class)->except(['show']);
