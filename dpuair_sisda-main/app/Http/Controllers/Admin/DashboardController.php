<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documents\DocumentsEntry;
use App\Models\News\NewsArticle;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // --- STATS CARDS ---
        $totalUsers = User::count();
        $newUsersToday = User::whereDate('created_at', Carbon::today())->count();

        $totalDocuments = DocumentsEntry::count();
        $documentsThisMonth = DocumentsEntry::whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        $publishedNews = NewsArticle::where('status', 'published')->count();
        $newsThisMonth = NewsArticle::where('status', 'published')
            ->whereYear('published_at', Carbon::now()->year)
            ->whereMonth('published_at', Carbon::now()->month)
            ->count();

        // --- CONTENT PIE CHART ---
        $contentData = [
            'labels' => ['Berita', 'Dokumen'],
            'datasets' => [
                [
                    'data' => [
                        NewsArticle::where('status', '!=', 'deleted')->count(),
                        $totalDocuments,
                    ],
                    'backgroundColor' => ['#3b82f6', '#22c55e'],
                ],
            ],
        ];

        // --- RECENT ACTIVITIES ---
        $recentUsers = User::latest()->take(5)->get()->map(function ($user) {
            return [
                'type' => 'user',
                'description' => 'Pengguna baru terdaftar',
                'user' => $user->name,
                'time' => $user->created_at,
            ];
        });

        $recentDocuments = DocumentsEntry::with('uploader')->latest()->take(5)->get()->map(function ($doc) {
            return [
                'type' => 'document',
                'description' => 'Dokumen "' . Str::limit($doc->title, 30) . '" diupload',
                'user' => $doc->uploader->name ?? 'Sistem',
                'time' => $doc->created_at,
            ];
        });

        $recentNews = NewsArticle::with('author')->whereIn('status', ['published', 'draft'])->latest()->take(5)->get()->map(function ($news) {
            $action = $news->status === 'published' ? 'dipublikasi' : 'dibuat';
            return [
                'type' => 'news',
                'description' => 'Berita "' . Str::limit($news->title, 30) . '" ' . $action,
                'user' => $news->author->name ?? 'Sistem',
                'time' => $news->created_at,
            ];
        });

        $recentActivities = $recentUsers->concat($recentDocuments)->concat($recentNews)
            ->sortByDesc('time')
            ->take(5)
            ->values()
            ->map(function ($activity) {
                $activity['time'] = Carbon::parse($activity['time'])->diffForHumans();
                return $activity;
            });

        // --- PENDING TASKS ---
        $draftNewsCount = NewsArticle::where('status', 'draft')->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'newUsersToday' => $newUsersToday,
                'totalDocuments' => $totalDocuments,
                'documentsThisMonth' => $documentsThisMonth,
                'publishedNews' => $publishedNews,
                'newsThisMonth' => $newsThisMonth,
            ],
            'contentData' => $contentData,
            'recentActivities' => $recentActivities,
            'pendingTasks' => [
                'draftNews' => $draftNewsCount,
            ],
        ]);
    }
}
