<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News\NewsTag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsTagController extends Controller
{
    // Display tags page
    /**
     * Menampilkan daftar tag berita.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = NewsTag::withCount('articles');

        // Filter pencarian nama tag
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
        }

        // Per page options - default 10 untuk tags
        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;

        $tags = $query->orderBy('name')->paginate($perPage)->withQueryString();

        // Current filters
        $filters = $request->only(['search', 'per_page']);

        return Inertia::render('Admin/News/Tags', [
            'tags' => $tags,
            'filters' => $filters
        ]);
    }

    // Store a new tag
    /**
     * Menyimpan tag berita baru.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:news_tags,name',
        ]);

        // Generate slug automatically
        $slug = Str::slug($validated['name']);

        // Check if slug already exists
        if (NewsTag::where('slug', $slug)->exists()) {
            return redirect()->route('admin.news.tags')
                ->with('error', 'Tag dengan nama ini sudah ada! Silakan gunakan nama yang berbeda.');
        }

        $validated['slug'] = $slug;

        NewsTag::create($validated);

        return redirect()->route('admin.news.tags')
            ->with('success', 'Tag berhasil ditambahkan!');
    }

    // Update a tag
    /**
     * Memperbarui tag berita.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $tag = NewsTag::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:news_tags,name,' . $id,
        ]);

        // Generate slug automatically
        $slug = Str::slug($validated['name']);

        // Check if slug already exists (excluding current tag)
        if (NewsTag::where('slug', $slug)->where('id', '!=', $id)->exists()) {
            return redirect()->route('admin.news.tags')
                ->with('error', 'Tag dengan nama ini sudah ada! Silakan gunakan nama yang berbeda.');
        }

        $validated['slug'] = $slug;

        $tag->update($validated);

        return redirect()->route('admin.news.tags')
            ->with('success', 'Tag berhasil diperbarui!');
    }

    // Delete a tag
    /**
     * Menghapus tag berita.
     *
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $tag = NewsTag::findOrFail($id);

        // Check if tag has articles
        if ($tag->articles()->count() > 0) {
            return redirect()->route('admin.news.tags')
                ->with('error', 'Tag tidak dapat dihapus karena masih digunakan dalam berita!');
        }

        $tag->delete();

        return redirect()->route('admin.news.tags')
            ->with('success', 'Tag berhasil dihapus!');
    }
}
