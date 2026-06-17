<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\News\NewsArticle;
use App\Models\News\NewsCategory;
use App\Models\Master\Portal;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the welcome page.
     */
    public function welcome()
    {
        // Get the 4 latest news for Hero Section Slideshow
        $heroNews = NewsArticle::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->take(4)
            ->get(['id', 'slug', 'title', 'excerpt', 'featured_image_path', 'published_at', 'news_category_id']);

        // Get only 6 latest news for landing page (simpler display)
        $latestNews = NewsArticle::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->orderByDesc('published_at')
            ->take(6)
            ->get(['id', 'slug', 'title', 'excerpt', 'featured_image_path', 'published_at', 'news_category_id']);

        // Fetch BMKG weather data (cached 30 minutes)
        $weatherData = $this->getBmkgWeatherData();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => false, // Registration disabled
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'heroNews' => $heroNews,
            'latestNews' => $latestNews,
            'weatherData' => $weatherData,
        ]);
    }

    private function getBmkgWeatherData(): array
    {
        $cacheKey = 'bmkg_weather_data';
        $staleKey = 'bmkg_weather_data_stale';

        if ($fresh = Cache::get($cacheKey)) {
            return $fresh;
        }

        $result = $this->fetchBmkgFromApi();

        if (!empty($result['weather'])) {
            Cache::put($cacheKey, $result, now()->addMinutes(60));
            Cache::put($staleKey, $result, now()->addHours(24));
        } else {
            // Serve stale data while BMKG is down, retry in 5 minutes
            Cache::put($cacheKey, $result, now()->addMinutes(5));
            $result = Cache::get($staleKey, $result);
        }

        return $result;
    }

    private function fetchBmkgFromApi(): array
    {
        $cities = [
            ['code' => '35.01.01.2001', 'name' => 'Pacitan'],
            ['code' => '35.02.01.2001', 'name' => 'Ponorogo'],
            ['code' => '35.03.01.2001', 'name' => 'Trenggalek'],
            ['code' => '35.04.01.2001', 'name' => 'Tulungagung'],
            ['code' => '35.05.01.2001', 'name' => 'Blitar'],
            ['code' => '35.06.01.2001', 'name' => 'Kediri'],
            ['code' => '35.07.01.2001', 'name' => 'Malang'],
            ['code' => '35.08.01.2001', 'name' => 'Lumajang'],
            ['code' => '35.09.01.2001', 'name' => 'Jember'],
            ['code' => '35.10.01.2001', 'name' => 'Banyuwangi'],
            ['code' => '35.11.01.2001', 'name' => 'Bondowoso'],
            ['code' => '35.12.01.2001', 'name' => 'Situbondo'],
            ['code' => '35.13.01.2001', 'name' => 'Probolinggo'],
            ['code' => '35.14.01.2001', 'name' => 'Pasuruan'],
            ['code' => '35.15.01.2001', 'name' => 'Sidoarjo'],
            ['code' => '35.16.01.2001', 'name' => 'Mojokerto'],
            ['code' => '35.17.01.2001', 'name' => 'Jombang'],
            ['code' => '35.18.01.2001', 'name' => 'Nganjuk'],
            ['code' => '35.19.01.2001', 'name' => 'Madiun'],
            ['code' => '35.20.01.2001', 'name' => 'Magetan'],
            ['code' => '35.21.01.2001', 'name' => 'Ngawi'],
            ['code' => '35.22.01.2001', 'name' => 'Bojonegoro'],
            ['code' => '35.23.01.2001', 'name' => 'Tuban'],
            ['code' => '35.24.01.2001', 'name' => 'Lamongan'],
            ['code' => '35.25.01.2001', 'name' => 'Gresik'],
            ['code' => '35.26.01.2001', 'name' => 'Bangkalan'],
            ['code' => '35.27.01.2001', 'name' => 'Sampang'],
            ['code' => '35.28.01.2001', 'name' => 'Pamekasan'],
            ['code' => '35.29.01.2001', 'name' => 'Sumenep'],
            ['code' => '35.71.01.1001', 'name' => 'Kota Kediri'],
            ['code' => '35.72.01.1001', 'name' => 'Kota Blitar'],
            ['code' => '35.73.01.1001', 'name' => 'Kota Malang'],
            ['code' => '35.74.01.1001', 'name' => 'Kota Probolinggo'],
            ['code' => '35.75.01.1001', 'name' => 'Kota Pasuruan'],
            ['code' => '35.76.01.1001', 'name' => 'Kota Mojokerto'],
            ['code' => '35.77.01.1001', 'name' => 'Kota Madiun'],
            ['code' => '35.78.01.1001', 'name' => 'Kota Surabaya'],
            ['code' => '35.79.01.1001', 'name' => 'Kota Batu'],
        ];

        $weatherItems = [];

        try {
            $responses = Http::pool(function ($pool) use ($cities) {
                foreach ($cities as $city) {
                    $pool->as($city['name'])
                        ->timeout(8)
                        ->get('https://api.bmkg.go.id/publik/prakiraan-cuaca', [
                            'adm4' => $city['code'],
                        ]);
                }
            });

            foreach ($cities as $city) {
                $response = $responses[$city['name']] ?? null;

                if (!$response instanceof \Illuminate\Http\Client\Response || !$response->successful()) {
                    continue;
                }

                $forecast = $response->json('data.0.cuaca.0.0');

                if ($forecast) {
                    $weatherItems[] = [
                        'city' => $city['name'],
                        'temp' => $forecast['t'] ?? '-',
                        'description' => $forecast['weather_desc'] ?? '-',
                    ];
                }
            }
        } catch (\Exception $e) {
            Log::warning('BMKG pool request failed: ' . $e->getMessage());
        }

        return ['weather' => $weatherItems];
    }

    /**
     * Display the gallery page.
     */
    public function galeri()
    {
        return Inertia::render('Galeri/Index');
    }
}
