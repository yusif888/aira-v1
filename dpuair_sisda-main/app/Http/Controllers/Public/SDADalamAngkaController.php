<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SDADalamAngkaController extends Controller
{
    public function index()
    {
        return Inertia::render('SDADalamAngka/Index');
    }

    public function show(Request $request)
    {
        // Get year from the URL slug (last segment)
        $year = $request->query('year');

        return Inertia::render("SDADalamAngka/Show/{$year}/Index");
    }
}
