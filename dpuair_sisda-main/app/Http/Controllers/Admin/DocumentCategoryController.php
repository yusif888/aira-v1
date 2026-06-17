<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documents\DocumentsCategory;
use App\Models\Documents\DocumentsType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

// Kelola kategori dokumen (CRUD)
class DocumentCategoryController extends Controller
{
    /**
     * Menampilkan daftar kategori dokumen.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        try {
            // Log request
            Log::info('Loading categories page', ['filters' => $request->all()]);

            $query = DocumentsCategory::with(['types' => function ($query) {
                $query->withCount('entries')->orderBy('name');
            }]);

            // Search functionality
            if ($request->filled('search') && !empty(trim($request->search))) {
                $search = trim($request->search);
                $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
                $query->where('name', $like, '%' . $search . '%');
            }

            // Filter by status
            if ($request->filled('status') && $request->status !== '') {
                $query->where('is_active', $request->status);
            }

            // Filter by category (if needed)
            if ($request->filled('category') && $request->category !== '') {
                $query->where('id', $request->category);
            }

            // Get per_page from request, default 10
            $perPage = $request->get('per_page', 10);
            $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;

            // Use paginate instead of get()
            $categories = $query->orderBy('id')->paginate($perPage);
            // transform the paginated data
            $categories->getCollection()->transform(function ($category) {
                // Hitung total dokumen di kategori ini (melalui semua tipe)
                $documentsCount = $category->types->sum('entries_count');

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'is_active' => $category->is_active,
                    'documents_count' => $documentsCount,
                    'types_count' => $category->types->count(),
                    'created_at' => $category->created_at,
                    'updated_at' => $category->updated_at,
                    'types' => $category->types->map(function ($type) {
                        return [
                            'id' => $type->id,
                            'name' => $type->name,
                            'icon' => $type->icon,
                            'status' => $type->status,
                            'is_active' => $type->is_active,
                            'documents_count' => $type->entries_count ?? 0,
                            'created_at' => $type->created_at,
                            'updated_at' => $type->updated_at,
                        ];
                    })->toArray()
                ];
            });


            Log::info('Categories loaded successfully:', [
                'total_categories' => $categories->total(),
                'current_page' => $categories->currentPage(),
                'per_page' => $categories->perPage(),
                'total_types' => $categories->getCollection()->sum('types_count'),
                'first_category' => $categories->getCollection()->first() ? $categories->getCollection()->first()['name'] : 'None'
            ]);

            // Get current filters
            $filters = $request->only(['search', 'status', 'category', 'per_page']);

            return Inertia::render('Admin/Documents/Categories', [
                'categories' => $categories,
                'filters' => $filters
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading categories page:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Admin/Documents/Categories', [
                'categories' => [],
                'filters' => [],
                'error' => 'Terjadi kesalahan saat memuat data kategori.'
            ]);
        }
    }

    /**
     * Menyimpan kategori dokumen baru.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:documents_categories,name',
                'description' => 'nullable|string|max:500',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'Nama kategori wajib diisi.',
                'name.unique' => 'Kategori dengan nama ini sudah ada.',
                'name.max' => 'Nama kategori maksimal 255 karakter.',
                'description.max' => 'Deskripsi maksimal 500 karakter.'
            ]);

            // Log request data
            Log::info('Creating document category:', $validated);

            // Buat kategori baru
            $category = DocumentsCategory::create([
                'name' => trim($validated['name']),
                'description' => $validated['description'] ? trim($validated['description']) : null,
                'is_active' => $request->boolean('is_active', true),
            ]);

            Log::info('Document category created successfully:', $category->toArray());

            return redirect()->back()
                ->with('success', 'Kategori dokumen berhasil ditambahkan.');
        } catch (ValidationException $e) {
            Log::error('Validation error creating document category:', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating document category:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'data' => $request->all()
            ]);

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat menambahkan kategori dokumen.')
                ->withInput();
        }
    }

    /**
     * Memperbarui kategori dokumen.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, string $id)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:documents_categories,name,' . $id,
                'description' => 'nullable|string|max:500',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'Nama kategori wajib diisi.',
                'name.unique' => 'Kategori dengan nama ini sudah ada.',
                'name.max' => 'Nama kategori maksimal 255 karakter.',
                'description.max' => 'Deskripsi maksimal 500 karakter.'
            ]);

            // Log request data
            Log::info('Updating document category:', ['id' => $id, 'data' => $validated]);

            // Cari dan update kategori
            $category = DocumentsCategory::findOrFail($id);
            $category->update([
                'name' => trim($validated['name']),
                'description' => $validated['description'] ? trim($validated['description']) : null,
                'is_active' => $request->boolean('is_active', true),
            ]);

            Log::info('Document category updated successfully:', $category->toArray());

            return redirect()->back()
                ->with('success', 'Kategori dokumen berhasil diperbarui.');
        } catch (ValidationException $e) {
            Log::error('Validation error updating document category:', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating document category:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'category_id' => $id,
                'data' => $request->all()
            ]);

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat memperbarui kategori dokumen.')
                ->withInput();
        }
    }

    /**
     * Menghapus kategori dokumen.
     *
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $id)
    {
        try {
            Log::info('Mencoba menghapus rumah (kategori):', ['id' => $id]);

            $category = DocumentsCategory::findOrFail($id);

            // Check if category has documents (through types) - this is the main restriction
            $documentsCount = $category->types()->withCount('entries')->get()->sum('entries_count');
            if ($documentsCount > 0) {
                Log::warning('Cannot delete category with documents:', [
                    'category_id' => $id,
                    'category_name' => $category->name,
                    'documents_count' => $documentsCount
                ]);

                return redirect()->back()
                    ->with('error', "❌ **GAGAL MENGHAPUS KATEGORI**\n\nKategori **'{$category->name}'** tidak dapat dihapus karena masih memiliki **{$documentsCount} dokumen**.\n\n**Solusi:**\n• Hapus semua dokumen yang terkait dengan kategori ini terlebih dahulu\n• Atau pindahkan dokumen ke kategori lain\n• Atau nonaktifkan kategori ini jika masih diperlukan");
            }

            // If no documents, category can be deleted even if it has types
            // The types will be automatically deleted due to foreign key cascade or manual cleanup
            $typesCount = $category->types()->count();
            if ($typesCount > 0) {
                Log::info('Category has types but no documents, proceeding with deletion:', [
                    'category_id' => $id,
                    'category_name' => $category->name,
                    'types_count' => $typesCount
                ]);
            }

            // Delete the category (types will be handled automatically)
            $categoryName = $category->name;
            $category->delete();

            Log::info('Document category deleted successfully:', [
                'category_id' => $id,
                'category_name' => $categoryName,
                'types_count' => $typesCount ?? 0
            ]);

            return redirect()->back()
                ->with('success', "✅ **KATEGORI BERHASIL DIHAPUS**\n\nKategori **'{$categoryName}'** telah berhasil dihapus dari sistem.");
        } catch (\Exception $e) {
            Log::error('Error deleting document category:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'category_id' => $id
            ]);

            return redirect()->back()
                ->with('error', '❌ **TERJADI KESALAHAN**\n\nGagal menghapus kategori dokumen. Silakan coba lagi atau hubungi administrator.');
        }
    }

    public function updateTypeInCategory(Request $request, string $categoryId, string $typeId)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|string|max:50',
                'is_active' => 'boolean'
            ]);

            $type = DocumentsType::where('id', $typeId)
                ->where('category_id', $categoryId)
                ->firstOrFail();

            $type->update([
                'name' => $request->name,
                'icon' => $request->icon,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return redirect()->route('admin.documents.categories')
                ->with('success', 'Tipe dokumen berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error('Error updating document type in category:', [
                'message' => $e->getMessage(),
                'category_id' => $categoryId,
                'type_id' => $typeId,
                'data' => $request->all()
            ]);

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat memperbarui tipe dokumen.')
                ->withInput();
        }
    }
}
