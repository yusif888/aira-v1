<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\News\NewsArticle;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $baseUrl = config('app.url');

        // Static pages with priorities
        $staticPages = [
            ['url' => '/', 'priority' => '1.0', 'changefreq' => 'daily'],

            // Profil
            ['url' => '/profil/selayang-pandang', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/profil/visi-misi', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/profil/tupoksi', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/profil/dasar-hukum', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/profil/pimpinan', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/profil/kepegawaian', 'priority' => '0.6', 'changefreq' => 'monthly'],

            // Organisasi
            ['url' => '/organisasi/struktur', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/organisasi/sekretariat', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/organisasi/perencanaan', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/organisasi/irigasi', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/organisasi/sungai-waduk', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['url' => '/organisasi/bina-manfaat', 'priority' => '0.6', 'changefreq' => 'monthly'],

            // UPT
            ['url' => '/upt/daftar-upt', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/upt/peta-sebaran', 'priority' => '0.7', 'changefreq' => 'monthly'],
            ['url' => '/upt/bondoyudo-lumajang', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/upt/kepulauan-madura', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/upt/brantas-kediri', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/upt/sampean-setail', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/upt/welang-pekalen', 'priority' => '0.5', 'changefreq' => 'monthly'],
            ['url' => '/upt/bengawan-solo', 'priority' => '0.5', 'changefreq' => 'monthly'],

            // Main sections
            ['url' => '/berita', 'priority' => '0.9', 'changefreq' => 'daily'],
            ['url' => '/berita/publikasi', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/berita/event', 'priority' => '0.8', 'changefreq' => 'daily'],
            ['url' => '/berita/tkpsda', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['url' => '/berita/dsda', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['url' => '/berita/komir', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['url' => '/dokumen', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => '/portal-data', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['url' => '/infrastruktur-sda', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/pelayanan', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/sda-dalam-angka', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['url' => '/galeri', 'priority' => '0.7', 'changefreq' => 'weekly'],
        ];

        // Dynamic pages: published news articles
        $articles = NewsArticle::where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->limit(500)
            ->get(['slug', 'updated_at']);

        // Build XML
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Static pages
        foreach ($staticPages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . $page['url']) . '</loc>';
            $xml .= '<changefreq>' . $page['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $page['priority'] . '</priority>';
            $xml .= '</url>';
        }

        // News articles
        foreach ($articles as $article) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($baseUrl . '/berita/details/' . $article->slug) . '</loc>';
            $xml .= '<lastmod>' . $article->updated_at->toW3cString() . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
