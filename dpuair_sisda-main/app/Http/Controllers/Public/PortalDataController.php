<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\PortalData\PortalDataDatasets;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalDataController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $datasets = PortalDataDatasets::query()
            ->published()
            ->when($search, function ($query) use ($search) {
                $needle = mb_strtolower($search);
                $query->where(function ($q) use ($needle) {
                    $q->whereRaw('LOWER(title) LIKE ?', ["%{$needle}%"])
                        ->orWhereRaw('LOWER(description) LIKE ?', ["%{$needle}%"])
                        ->orWhereRaw('LOWER(slug) LIKE ?', ["%{$needle}%"]);
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('PortalData/Index', [
            'datasets' => $datasets,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(PortalDataDatasets $dataset)
    {
        $component = ($dataset->view_path && str_contains($dataset->view_path, '/'))
            ? $dataset->view_path
            : 'PortalData/Show';

        $datasetDetails = [
            'id'                => $dataset->id,
            'slug'              => $dataset->slug,
            'title'             => $dataset->title,
            'description'       => $dataset->description,
            'view_path'         => $dataset->view_path,
            'json_data'         => $dataset->json_data,
            'metadata'          => $dataset->metadata,
            'source'            => $dataset->source,
            'responsible_party' => $dataset->responsible_party,
            'period'            => $dataset->period,
            'updated_at'        => $dataset->updated_at,
        ];
        // Inject Mapbox token from server env if available and not already provided in metadata
        $mapboxToken = config('services.mapbox.token') ?? env('VITE_MAPBOX_TOKEN');
        if (!empty($mapboxToken)) {
            $metadata = $datasetDetails['metadata'] ?? [];
            if (empty($metadata['mapbox_token'])) {
                $metadata['mapbox_token'] = $mapboxToken;
                $datasetDetails['metadata'] = $metadata;
            }
        }

        return Inertia::render($component, ['dataset' => $datasetDetails]);
    }
}
