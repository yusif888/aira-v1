<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\InfrastrukturSDA\InfrastrukturCategory;
use App\Models\InfrastrukturSDA\DataInfrastrukturSDA;

class InfrastrukturSDAController extends Controller
{
    public function index()
    {
        $mapboxToken = config('services.mapbox.token') ?? env('VITE_MAPBOX_TOKEN');

        // Ambil semua kategori yang aktif dengan data infrastruktur yang aktif
        $categories = InfrastrukturCategory::where('is_active', true)
            ->withCount(['data' => function ($query) {
                $query->where('is_active', true);
            }])
            ->with(['data' => function ($query) {
                $query->where('is_active', true)
                    ->select('id', 'category_id', 'name', 'code', 'type', 'legend_color', 'description', 'latitude', 'longitude', 'geojson')
                    ->orderBy('name');
            }])
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'code' => $category->code,
                    'name' => $category->name,
                    'icon' => $category->icon,
                    'data_count' => $category->data_count,
                    'data' => $category->data->map(function ($item) {
                        $data = [
                            'id' => $item->id,
                            'name' => $item->name,
                            'code' => $item->code,
                            'type' => $item->type,
                            'legend_color' => $item->legend_color,
                            'description' => $item->description,
                        ];

                        // Add coordinates based on type
                        if ($item->type === 'marker' && $item->latitude && $item->longitude) {
                            $data['latitude'] = $item->latitude;
                            $data['longitude'] = $item->longitude;
                            $data['coordinates'] = [$item->longitude, $item->latitude];
                        } elseif (($item->type === 'line' || $item->type === 'polygon') && $item->geojson) {
                            $data['geojson'] = json_decode($item->geojson);
                        }

                        return $data;
                    }),
                ];
            });

        return Inertia::render('InfrastrukturSDA/Index', [
            'mapboxToken' => $mapboxToken,
            'categoriesFromDB' => $categories,
        ]);
    }
}
