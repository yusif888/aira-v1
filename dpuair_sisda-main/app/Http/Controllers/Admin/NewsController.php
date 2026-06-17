<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News\NewsArticle;
use App\Models\News\NewsCategory;
use App\Models\News\NewsTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Services\FileStorageService;

class NewsController extends Controller
{
    /**
     * Helper method untuk menghapus file dari storage dengan multiple fallback
     */


    // Display a listing of the resource.
    public function index(Request $request)
    {
        $query = NewsArticle::with([
            'category:id,name',
            'tags:id,name',
            'author:id,name'
        ]);

        // Filter pencarian judul, excerpt, dan content (not-case-insensitive)
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(excerpt) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(content) LIKE ?', ["%{$search}%"]);
            });
        }

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter kategori
        if ($request->filled('category')) {
            $query->where('news_category_id', $request->input('category'));
        }

        // Hanya tampilkan berita yang tidak dihapus (soft delete)
        $query->where('status', '!=', 'deleted');

        // Ambil parameter per_page dari request, default 10
        $perPage = $request->input('per_page', 10);

        // Validasi per_page agar tidak melebihi batas maksimal
        $perPage = min(max((int) $perPage, 5), 100);

        $news = $query->orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();

        // Ambil data kategori untuk filter
        $categories = NewsCategory::all();

        return Inertia::render('Admin/News/Index', [
            'news' => $news,
            'filters' => $request->only(['search', 'status', 'category', 'per_page']),
            'categories' => $categories,
        ]);
    }


    // Show the form for creating a new resource.
    public function create()
    {
        return Inertia::render('Admin/News/Create', [
            'categories' => NewsCategory::orderBy('name')->get(),
            'tags' => NewsTag::orderBy('name')->get(),
            'users' => \App\Models\User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    // Display the specified resource.
    public function show($id)
    {
        $news = NewsArticle::with(['category', 'tags', 'author'])->findOrFail($id);

        return Inertia::render('Admin/News/Show', [
            'news' => $news,
        ]);
    }

    // Store a newly created resource in storage.
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            Log::info('News create request data', ['data' => $request->all()]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category_id' => 'required|exists:news_categories,id',
                'author_id' => 'required|exists:users,id',
                'tags' => 'nullable|array',
                'tags.*' => 'exists:news_tags,id',
                'excerpt' => 'nullable|string|max:500',
                'status' => 'required|in:draft,published',
                'is_featured' => 'boolean',
                'featured_image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10000',
                'published_at' => 'nullable|date|required_if:status,published',
            ]);

            // Auto-generate slug from title
            $slug = Str::slug($validated['title']);

            // Auto-generate meta title and meta description from title and excerpt
            $metaTitle = $validated['title'];
            $metaDescription = $validated['excerpt'] ?: substr(strip_tags($validated['content']), 0, 160);

            // Determine published_at based on status and input
            $publishedAt = null;
            if ($validated['status'] === 'published') {
                // If status is published, use the provided published_at or current time
                $publishedAt = $validated['published_at'] ? $validated['published_at'] : now();
            }
            // If status is draft, published_at remains null

            $news = NewsArticle::create([
                'title' => $validated['title'],
                'content' => $validated['content'],
                'excerpt' => $validated['excerpt'],
                'news_category_id' => $validated['category_id'], // PERBAIKI: gunakan news_category_id
                'status' => $validated['status'],
                'is_featured' => $validated['is_featured'] ?? false,
                'user_id' => $validated['author_id'], // Use selected author instead of current user
                'meta_title' => $metaTitle,
                'meta_description' => $metaDescription,
                'published_at' => $publishedAt,
                'slug' => $slug,
                'view_count' => 0,
            ]);

            // Handle file upload
            if ($request->hasFile('featured_image_path')) {
                $imagePath = $request->file('featured_image_path')->store('news', 'public');
                $news->update(['featured_image_path' => $imagePath]);
            }

            // Handle tags
            if (isset($validated['tags']) && is_array($validated['tags'])) {
                // Ambil nama tags dari database
                $tagNames = NewsTag::whereIn('id', $validated['tags'])->pluck('name')->toArray();
                $metaKeywords = implode(', ', $tagNames);

                // Update meta_keywords
                $news->update(['meta_keywords' => $metaKeywords]);

                // Sync tags untuk relasi many-to-many
                $news->tags()->sync($validated['tags']);
            }

            DB::commit();

            return redirect()->route('admin.news.index')
                ->with('success', 'Berita berhasil dibuat!');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating news', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }


    // Show the form for editing the specified resource.
    public function edit($id)
    {
        try {
            $news = NewsArticle::with(['category', 'tags', 'author'])->findOrFail($id);

            // Validasi: Mencegah edit berita yang sudah dipublish
            if ($news->status === 'published') {
                return redirect()->route('admin.news.index')
                    ->with('error', 'Berita yang sudah dipublish tidak dapat diedit. Hanya berita dengan status draft yang dapat diedit.');
            }

            // PERBAIKAN: Format data news dengan struktur yang konsisten
            $newsData = [
                'id' => $news->id,
                'title' => $news->title,
                'content' => $news->content,
                'category_id' => $news->news_category_id, // PERBAIKI: gunakan news_category_id
                'author_id' => $news->user_id, // Add author_id for edit form
                'status' => $news->status,
                'excerpt' => $news->excerpt,
                'is_featured' => (bool) $news->is_featured,
                'meta_title' => $news->meta_title,
                'meta_description' => $news->meta_description,
                'meta_keywords' => $news->meta_keywords,
                'featured_image_path' => $news->featured_image_path,
                'featured_image_url' => $news->featured_image_path ? asset('storage/' . $news->featured_image_path) : null,
                'published_at' => $news->published_at,
                'tags' => $news->tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name
                    ];
                }),
                'category' => $news->category ? [
                    'id' => $news->category->id,
                    'name' => $news->category->name
                ] : null,
                'author' => $news->author ? [
                    'id' => $news->author->id,
                    'name' => $news->author->name,
                    'email' => $news->author->email
                ] : null,
                'created_at' => $news->created_at,
                'updated_at' => $news->updated_at,
            ];

            return Inertia::render('Admin/News/Edit', [
                'auth' => ['user' => Auth::user()],
                'news' => $newsData,
                'categories' => NewsCategory::select('id', 'name')->orderBy('name')->get(),
                'tags' => NewsTag::select('id', 'name')->orderBy('name')->get(),
                'users' => \App\Models\User::orderBy('name')->get(['id', 'name', 'email']),
            ]);
        } catch (\Exception $e) {
            Log::error('Error in news edit', [
                'news_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.news.index')
                ->with('error', 'Terjadi kesalahan saat membuka halaman edit berita: ' . $e->getMessage());
        }
    }

    // Update the specified resource in storage.
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            // Ambil data berita berdasarkan ID
            $news = NewsArticle::findOrFail($id);

            // Validasi input
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category_id' => 'required|exists:news_categories,id',
                'author_id' => 'required|exists:users,id',
                'status' => 'required|in:draft,published',
                'tags' => 'nullable|array',
                'tags.*' => 'exists:news_tags,id',
                'excerpt' => 'nullable|string|max:500',
                'is_featured' => 'boolean',
                'meta_keywords' => 'nullable|string|max:255',
                'featured_image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10000',
                'keep_existing_image' => 'nullable|boolean',
                'published_at' => 'nullable|date|required_if:status,published',
            ]);

            // Validasi: Mencegah update berita yang sudah dipublish
            if ($news->status === 'published') {
                return redirect()->route('admin.news.index')
                    ->with('error', 'Berita yang sudah dipublish tidak dapat diupdate. Hanya berita dengan status draft yang dapat diupdate.');
            }

            // Handle upload gambar jika ada file baru
            if ($request->hasFile('featured_image_path')) {
                // Hapus gambar lama jika ada
                if ($news->featured_image_path) {
                    FileStorageService::delete($news->featured_image_path);
                }
                // Simpan gambar baru
                $path = $request->file('featured_image_path')->store('news', 'public');
                $validated['featured_image_path'] = $path;
            } elseif ($request->input('keep_existing_image', false)) {
                // Tidak ada perubahan gambar, tetap gunakan gambar lama
                unset($validated['featured_image_path']);
            } else {
                // Jika tidak ada gambar baru dan tidak ingin mempertahankan gambar lama, hapus gambar
                if ($news->featured_image_path) {
                    FileStorageService::delete($news->featured_image_path);
                }
                $validated['featured_image_path'] = null;
            }

            // Konversi is_featured ke boolean
            $validated['is_featured'] = $request->boolean('is_featured');

            // Atur published_at sesuai status dan input user
            $publishedAt = null;
            if ($validated['status'] === 'published') {
                // If status is published, use the provided published_at or existing published_at or current time
                if ($validated['published_at']) {
                    $publishedAt = $validated['published_at'];
                } elseif ($news->published_at) {
                    $publishedAt = $news->published_at; // Keep existing published_at
                } else {
                    $publishedAt = now(); // Set to current time if no previous published_at
                }
            }
            // If status is draft, published_at remains null

            // Auto-generate meta title and meta description from title and excerpt
            $metaTitle = $validated['title'];
            $metaDescription = $validated['excerpt'] ?: substr(strip_tags($validated['content']), 0, 160);

            // Siapkan data untuk update
            $newsUpdateData = [
                'title' => $validated['title'],
                'content' => $validated['content'],
                'excerpt' => $validated['excerpt'],
                'news_category_id' => $validated['category_id'],
                'user_id' => $validated['author_id'], // Use selected author
                'status' => $validated['status'],
                'is_featured' => $validated['is_featured'],
                'meta_title' => $metaTitle,
                'meta_description' => $metaDescription,
                'published_at' => $publishedAt,
            ];

            // Tambahkan featured_image_path jika ada
            if (array_key_exists('featured_image_path', $validated)) {
                $newsUpdateData['featured_image_path'] = $validated['featured_image_path'];
            }

            // Update berita
            $news->update($newsUpdateData);

            // Sinkronisasi tags
            if ($request->has('tags')) {
                $tagIds = $validated['tags'] ?? [];
                $news->tags()->sync($tagIds);

                // Update meta_keywords otomatis dari nama tag jika ada tag
                if (!empty($tagIds)) {
                    $tagNames = NewsTag::whereIn('id', $tagIds)->pluck('name')->toArray();
                    $metaKeywords = implode(', ', $tagNames);
                    $news->update(['meta_keywords' => $metaKeywords]);
                }
            }

            // Refresh data
            $news->refresh();
            $news->load(['category', 'tags', 'author']);

            DB::commit();

            return redirect()->route('admin.news.index')
                ->with('success', 'Berita berhasil diupdate!')
                ->with('updated_news_id', $news->id);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal update berita', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Gagal mengupdate berita: ' . $e->getMessage()]);
        }
    }

    // Remove the specified resource from storage.
    public function destroy($id)
    {
        try {
            $news = NewsArticle::findOrFail($id);

            // Soft delete berita (file gambar TIDAK dihapus, akan dihapus saat force delete)
            $news->update(['status' => 'deleted']);
            $news->delete();

            return redirect()->route('admin.news.index')
                ->with('success', 'Berita berhasil dipindahkan ke trash!');
        } catch (\Exception $e) {
            Log::error('Error deleting news', ['message' => $e->getMessage()]);

            return redirect()->route('admin.news.index')
                ->with('error', 'Gagal menghapus berita!');
        }
    }

    // Method tambahan untuk handle file upload via AJAX (opsional)
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:10000',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('news', 'public');

            return response()->json([
                'success' => true,
                'path' => $path,
                'url' => asset('storage/' . $path)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Gagal upload gambar'
        ], 400);
    }

    // Restore a soft deleted news article.
    public function restore($id)
    {
        try {
            $news = NewsArticle::withTrashed()->findOrFail($id);

            $news->restore();
            $news->update([
                'status' => 'draft',
            ]);

            // Redirect ke halaman utama berita dengan pesan sukses
            return redirect()->route('admin.news.index')
                ->with('success', 'Berita "' . $news->title . '" berhasil dipulihkan dan status diubah ke draft!');
        } catch (\Exception $e) {
            Log::error('Error restoring news', [
                'news_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.news.trash')
                ->with('error', 'Gagal memulihkan berita: ' . $e->getMessage());
        }
    }

    // Permanently delete a news article.
    public function forceDelete($id)
    {
        try {
            // Cari berita yang sudah di-soft delete menggunakan ID
            $news = NewsArticle::withTrashed()->findOrFail($id);
            $newsTitle = $news->title;

            // Log sebelum force delete
            Log::info('Before force delete', [
                'news_id' => $news->id,
                'news_title' => $news->title,
                'news_slug' => $news->slug,
                'deleted_at' => $news->deleted_at,
                'status' => $news->status,
                'featured_image_path' => $news->featured_image_path
            ]);

            // Hapus file gambar dari storage jika ada
            FileStorageService::delete($news->featured_image_path);

            // Hapus relasi tags jika ada
            $news->tags()->detach();

            // Hapus berita secara permanen dari database
            $news->forceDelete();

            Log::info('News permanently deleted', ['news_id' => $id, 'title' => $newsTitle]);

            return redirect()->route('admin.news.trash')
                ->with('success', "Berita '{$newsTitle}' berhasil dihapus permanen beserta gambar-nya!");
        } catch (\Exception $e) {
            Log::error('Error force deleting news', [
                'news_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.news.trash')
                ->with('error', 'Gagal menghapus permanen berita: ' . $e->getMessage());
        }
    }

    /**
     * Test method untuk memverifikasi restore berfungsi
     */
    public function testRestore($id)
    {
        try {
            // Cari berita yang sudah di-soft delete menggunakan ID
            $news = NewsArticle::withTrashed()->findOrFail($id);

            // Log status sebelum restore
            Log::info('Test restore - Before', [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'deleted_at' => $news->deleted_at,
                'status' => $news->status
            ]);

            // Restore berita
            $news->restore();
            $news->refresh();

            // Log status setelah restore
            Log::info('Test restore - After', [
                'id' => $news->id,
                'title' => $news->title,
                'slug' => $news->slug,
                'deleted_at' => $news->deleted_at,
                'status' => $news->status
            ]);

            // Cek apakah berita muncul di query normal
            $normalNews = NewsArticle::where('id', $news->id)->first();
            Log::info('Test restore - Normal query result', [
                'found' => $normalNews ? true : false,
                'deleted_at' => $normalNews ? $normalNews->deleted_at : 'null'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Test restore berhasil',
                'before' => [
                    'deleted_at' => $news->getOriginal('deleted_at'),
                    'status' => $news->getOriginal('status')
                ],
                'after' => [
                    'deleted_at' => $news->deleted_at,
                    'status' => $news->status
                ],
                'normal_query' => $normalNews ? true : false
            ]);
        } catch (\Exception $e) {
            Log::error('Test restore failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }



    // Display trash page (deleted news)
    public function trash(Request $request)
    {
        $query = NewsArticle::onlyTrashed()
            ->with(['category:id,name', 'tags:id,name', 'author:id,name']);

        // Filter pencarian judul, excerpt, dan content (not-case-insensitive)
        if ($request->filled('search')) {
            $search = strtolower($request->input('search'));
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(excerpt) LIKE ?', ["%{$search}%"])
                    ->orWhereRaw('LOWER(content) LIKE ?', ["%{$search}%"]);
            });
        }

        // Filter kategori
        if ($request->filled('category')) {
            $query->where('news_category_id', $request->input('category'));
        }

        // Ambil parameter per_page dari request, default 10
        $perPage = $request->input('per_page', 10);

        // Validasi per_page agar tidak melebihi batas maksimal
        $perPage = min(max((int) $perPage, 5), 100);

        $deletedNews = $query->orderBy('deleted_at', 'desc')->paginate($perPage)->withQueryString();

        // Ambil data kategori untuk filter
        $categories = NewsCategory::all();

        return Inertia::render('Admin/News/Trash', [
            'deletedNews' => $deletedNews,
            'filters' => $request->only(['search', 'category', 'per_page']),
            'categories' => $categories,
        ]);
    }
}
