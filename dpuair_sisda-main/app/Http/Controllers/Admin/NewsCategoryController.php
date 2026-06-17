<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News\NewsCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsCategoryController extends Controller
{
    // Display categories page
    /**
     * Menampilkan daftar kategori berita.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = NewsCategory::withCount('articles');

        // Filter pencarian nama kategori
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $query->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"]);
        }

        // Ambil parameter per_page dari request, default 6 untuk categories
        $perPage = $request->input('per_page', 6);

        // Validasi per_page agar tidak melebihi batas maksimal
        $perPage = min(max((int) $perPage, 5), 100);

        $categories = $query->orderBy('name')->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/News/Categories', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    // Store a new category
    /**
     * Menyimpan kategori berita baru.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:news_categories,name',
            'description' => 'nullable|string|max:1000',
        ]);

        // Generate slug automatically
        $validated['slug'] = Str::slug($validated['name']);

        NewsCategory::create($validated);

        return redirect()->route('admin.news.categories')
            ->with('success', 'Kategori berhasil ditambahkan!');
    }

    // Update a category
    /**
     * Memperbarui kategori berita.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $category = NewsCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:news_categories,name,' . $id,
            'description' => 'nullable|string|max:1000',
        ]);

        // Generate slug automatically
        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->route('admin.news.categories')
            ->with('success', 'Kategori berhasil diperbarui!');
    }

    // Delete a category
    /**
     * Menghapus kategori berita.
     *
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $category = NewsCategory::findOrFail($id);

        // Check if category has articles
        if ($category->articles()->count() > 0) {
            return redirect()->route('admin.news.categories')
                ->with('error', 'Kategori tidak dapat dihapus karena masih memiliki berita!');
        }

        $category->delete();

        return redirect()->route('admin.news.categories')
            ->with('success', 'Kategori berhasil dihapus!');
    }
}
