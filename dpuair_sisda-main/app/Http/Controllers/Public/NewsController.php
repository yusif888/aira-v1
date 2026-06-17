<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\News\NewsArticle;
use App\Models\News\NewsCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    // ========================================================================================== Public News
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category']);

        $news = NewsArticle::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->when($request->input('search'), function ($query, $search) {
                $needle = mb_strtolower($search);
                $query->where(function ($q) use ($needle) {
                    $q->whereRaw('LOWER(title) LIKE ?', ["%{$needle}%"])
                        ->orWhereRaw('LOWER(excerpt) LIKE ?', ["%{$needle}%"]);
                });
            })
            ->when($request->input('category'), function ($query, $category) {
                $query->whereHas('category', function ($q) use ($category) {
                    $q->where('slug', $category);
                });
            })
            ->latest('published_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('News/Index', [
            'news' => $news,
            'filters' => $filters,
            'categories' => NewsCategory::all(['id', 'name', 'slug']),
        ]);
    }

    public function show(NewsArticle $article)
    {
        // Eager load relationships for the main article
        $article->load(['author:id,name', 'category:id,name', 'tags:id,name']);

        // 1. Fetch related articles from the same category
        $relatedArticles = NewsArticle::where('news_category_id', $article->news_category_id)
            ->where('id', '!=', $article->id) // Exclude the current article
            ->where('status', 'published')
            ->latest('published_at')
            ->take(3)
            ->get(['id', 'slug', 'title', 'published_at', 'featured_image_path']);

        // 2. If not enough related articles, fetch random ones to fill the gap
        $needed = 3 - $relatedArticles->count();
        if ($needed > 0) {
            $randomArticles = NewsArticle::where('id', '!=', $article->id)
                ->whereNotIn('id', $relatedArticles->pluck('id')->all()) // Exclude already selected
                ->where('status', 'published')
                ->inRandomOrder()
                ->take($needed)
                ->get(['id', 'slug', 'title', 'published_at', 'featured_image_path']);

            $relatedArticles = $relatedArticles->merge($randomArticles);
        }

        return Inertia::render('News/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }

    // ========================================================================================== News Categories
    public function publikasi(Request $request)
    {
        return $this->indexByCategory($request, 'publikasi');
    }

    public function event(Request $request)
    {
        return $this->indexByCategory($request, 'event');
    }

    public function tkpsda(Request $request)
    {
        return $this->indexByCategory($request, 'tkpsda');
    }

    public function dsda(Request $request)
    {
        return $this->indexByCategory($request, 'dsda');
    }

    public function komir(Request $request)
    {
        return $this->indexByCategory($request, 'komir');
    }

    private function indexByCategory(Request $request, string $categorySlug)
    {
        $filters = $request->only(['search']);
        $filters['category'] = $categorySlug;

        $category = NewsCategory::where('slug', $categorySlug)->first();

        $news = NewsArticle::query()
            ->with('category:id,name,slug')
            ->where('status', 'published')
            ->when($request->input('search'), function ($query, $search) {
                $needle = mb_strtolower($search);
                $query->where(function ($q) use ($needle) {
                    $q->whereRaw('LOWER(title) LIKE ?', ["%{$needle}%"])
                        ->orWhereRaw('LOWER(excerpt) LIKE ?', ["%{$needle}%"]);
                });
            })
            ->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            })
            ->latest('published_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('News/Index', [
            'news' => $news,
            'filters' => $filters,
            'categories' => NewsCategory::all(['id', 'name', 'slug']),
            'currentCategory' => $category,
        ]);
    }
}
