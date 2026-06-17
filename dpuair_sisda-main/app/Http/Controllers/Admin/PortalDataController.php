<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalDataController extends Controller
{
    /**
     * Display datasets page
     */
    public function datasets()
    {
        return Inertia::render('Admin/PortalData/Datasets');
    }
}
