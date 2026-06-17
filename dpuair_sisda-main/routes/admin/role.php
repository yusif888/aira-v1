<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\RoleController;

Route::resource('roles', RoleController::class)->except(['show']);
