<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfrastrukturSDA\DataInfrastrukturSDA;
use App\Models\InfrastrukturSDA\InfrastrukturCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastrukturSDAController extends Controller
{
    /**
     * Display a listing of infrastruktur.
     */
    public function index(Request $request)
    {
        $query = DataInfrastrukturSDA::with(['category']);

        // Order by latest
        $query->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->has('category') && $request->category != '') {
            $query->where('category_id', $request->category);
        }

        // Filter by type
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        // Search by name or description
        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 10);
        $infrastruktur = $query->paginate($perPage)->withQueryString();

        // Get categories for filter
        $categories = InfrastrukturCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/InfrastrukturSDA/Index', [
            'infrastruktur' => $infrastruktur,
            'filters' => $request->only(['search', 'category', 'type', 'per_page']),
            'categories' => $categories,
        ]);
    }

    /**
     * Show the form for creating a new infrastruktur.
     */
    public function create()
    {
        $categories = InfrastrukturCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/InfrastrukturSDA/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created infrastruktur in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:infrastruktur_categories,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'type' => 'required|in:marker,line,polygon',
            'legend_color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'geojson' => 'nullable|json',
            'geojson_file' => 'nullable|file|mimes:json,geojson|max:10240', // Max 10MB
            'is_active' => 'boolean',
        ]);

        // Handle file upload
        if ($request->hasFile('geojson_file')) {
            $file = $request->file('geojson_file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('geojson', $fileName, 'public');
            $validated['file_path'] = $filePath;

            // Read file content and parse GeoJSON
            $fileContent = file_get_contents($file->getRealPath());
            $geoJsonData = json_decode($fileContent, true);

            if ($geoJsonData) {
                $validated['geojson'] = json_encode($geoJsonData);
            }
        }

        DataInfrastrukturSDA::create($validated);

        return redirect()
            ->route('admin.infrastruktur-sda.index')
            ->with('success', 'Data infrastruktur berhasil ditambahkan');
    }

    /**
     * Show the form for editing the specified infrastruktur.
     */
    public function edit($id)
    {
        $infrastruktur = DataInfrastrukturSDA::with('category')->findOrFail($id);

        $categories = InfrastrukturCategory::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/InfrastrukturSDA/Edit', [
            'infrastruktur' => $infrastruktur,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified infrastruktur in storage.
     */
    public function update(Request $request, $id)
    {
        $infrastruktur = DataInfrastrukturSDA::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|exists:infrastruktur_categories,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'type' => 'required|in:marker,line,polygon',
            'legend_color' => 'nullable|string|max:7',
            'description' => 'nullable|string',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'geojson' => 'nullable|json',
            'is_active' => 'boolean',
        ]);

        $infrastruktur->update($validated);

        return redirect()
            ->route('admin.infrastruktur-sda.index')
            ->with('success', 'Data infrastruktur berhasil diperbarui');
    }

    /**
     * Remove the specified infrastruktur from storage.
     */
    public function destroy($id)
    {
        $infrastruktur = DataInfrastrukturSDA::findOrFail($id);
        $infrastruktur->delete();

        return back()->with('success', 'Data infrastruktur berhasil dihapus');
    }
}
