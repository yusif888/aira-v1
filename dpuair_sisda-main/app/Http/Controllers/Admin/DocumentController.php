<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documents\DocumentsCategory;
use App\Models\Documents\DocumentsType;
use App\Models\Documents\DocumentsEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Documents\DocumentsTag;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use App\Services\FileStorageService;

// Kelola entri dokumen (CRUD + trash)
class DocumentController extends Controller
{


    public function index(Request $request)
    {
        try {
            $query = DocumentsEntry::with(['type.category', 'tags', 'uploader']);

            // Search functionality - only search in document title (case-insensitive)
            if ($request->filled('search') && !empty(trim($request->search))) {
                $search = trim($request->search);
                $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
                $query->where('title', $like, '%' . $search . '%');
            }

            // Filter by category
            if ($request->filled('category')) {
                $query->whereHas('type.category', function ($q) use ($request) {
                    $q->where('id', $request->category);
                });
            }

            // Filter by type
            if ($request->filled('type')) {
                $query->where('type_id', $request->type);
            }

            // Filter by year
            if ($request->filled('year')) {
                $query->where('year', $request->year);
            }

            // Filter by tags
            if ($request->filled('tags') && is_array($request->tags)) {
                $query->whereHas('tags', function ($q) use ($request) {
                    $q->whereIn('id', $request->tags);
                });
            }

            // Filter by date range
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }

            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Per page options
            $perPage = $request->get('per_page', 10);
            $perPage = in_array($perPage, [10, 25, 50, 100]) ? $perPage : 10;

            $documents = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Get filter options
            $categories = DocumentsCategory::orderBy('name')->get();
            $types = DocumentsType::with('category')->orderBy('name')->get();
            $tags = DocumentsTag::orderBy('name')->get();

            // Get unique years from existing documents
            $years = DocumentsEntry::distinct()->pluck('year')->sort()->values();

            // Current filters
            $filters = $request->only(['search', 'category', 'type', 'year', 'tags', 'date_from', 'date_to', 'per_page']);

            return Inertia::render('Admin/Documents/Index', [
                'documents' => $documents,
                'categories' => $categories,
                'types' => $types,
                'tags' => $tags,
                'years' => $years,
                'filters' => $filters,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading documents index page:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return Inertia::render('Admin/Documents/Index', [
                'documents' => ['data' => [], 'total' => 0, 'current_page' => 1, 'last_page' => 1],
                'categories' => [],
                'types' => [],
                'tags' => [],
                'years' => [],
                'filters' => [],
                'error' => 'Terjadi kesalahan saat memuat data dokumen.'
            ]);
        }
    }











    // ==================== LEGACY METHODS (for compatibility) ====================

    public function create()
    {
        $categories = DocumentsCategory::orderBy('name')->get();
        $types = DocumentsType::with('category')->orderBy('name')->get();
        $tags = DocumentsTag::orderBy('name')->get();

        return Inertia::render('Admin/Documents/Create', [
            'categories' => $categories,
            'types' => $types,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 5),
            'description' => 'required|string|max:500',
            'type_id' => 'required|exists:documents_types,id',
            'tags' => 'required|array|min:1',
            'tags.*' => 'exists:documents_tags,id',
            'file_path' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf|max:102400', // 100MB max
        ]);

        try {
            // Upload file - sekarang file_path wajib ada
            $file = $request->file('file_path');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('documents', $fileName, 'public');

            // Buat dokumen baru
            $document = DocumentsEntry::create([
                'title' => $validated['title'],
                'document_number' => $validated['document_number'],
                'year' => $validated['year'],
                'description' => $validated['description'],
                'type_id' => $validated['type_id'],
                'file_path' => $filePath,
                'uploader_id' => Auth::id(),
            ]);

            // Attach tags
            if (!empty($validated['tags'])) {
                $document->tags()->attach($validated['tags']);
            }

            return redirect()->route('admin.documents.index')
                ->with('success', 'Dokumen berhasil ditambahkan!');
        } catch (\Exception $e) {
            // Hapus file jika ada error
            if (isset($filePath)) {
                FileStorageService::delete($filePath);
            }

            return back()->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat menyimpan dokumen: ' . $e->getMessage()]);
        }
    }

    public function show(string $id)
    {
        $document = DocumentsEntry::with(['type.category', 'tags', 'uploader'])->findOrFail($id);

        // Tambahkan informasi file size jika file ada
        if ($document->file_path && Storage::disk('public')->exists($document->file_path)) {
            $document->file_size = Storage::disk('public')->size($document->file_path);
            $document->file_size_formatted = $this->formatFileSize($document->file_size);
        }

        return Inertia::render('Admin/Documents/Show', [
            'document' => $document,
        ]);
    }

    private function formatFileSize($bytes)
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }

    public function edit(string $id)
    {
        $document = DocumentsEntry::with(['type.category', 'tags'])->findOrFail($id);
        $categories = DocumentsCategory::orderBy('name')->get();
        $types = DocumentsType::with('category')->orderBy('name')->get();
        $tags = DocumentsTag::orderBy('name')->get();

        return Inertia::render('Admin/Documents/Edit', [
            'document' => $document,
            'categories' => $categories,
            'types' => $types,
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $document = DocumentsEntry::findOrFail($id);

        // Validasi input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'document_number' => 'nullable|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 5),
            'description' => 'required|string|max:500',
            'type_id' => 'required|exists:documents_types,id',
            'tags' => 'required|array|min:1',
            'tags.*' => 'exists:documents_tags,id',
            'file_path' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,rtf|max:102400', // 100MB max
        ]);

        try {
            $filePath = $document->file_path;

            // Upload file baru jika ada
            if ($request->hasFile('file_path')) {
                $file = $request->file('file_path');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $newFilePath = $file->storeAs('documents', $fileName, 'public');

                // Hapus file lama
                if ($document->file_path) {
                    FileStorageService::delete($document->file_path);
                }

                $filePath = $newFilePath;
            }

            // Update dokumen
            $document->update([
                'title' => $validated['title'],
                'document_number' => $validated['document_number'],
                'year' => $validated['year'],
                'description' => $validated['description'],
                'type_id' => $validated['type_id'],
                'file_path' => $filePath,
            ]);

            // Sync tags
            $document->tags()->sync($validated['tags']);

            return redirect()->route('admin.documents.index')
                ->with('success', 'Dokumen berhasil diperbarui!');
        } catch (\Exception $e) {
            return back()->withInput()
                ->withErrors(['error' => 'Terjadi kesalahan saat memperbarui dokumen: ' . $e->getMessage()]);
        }
    }

    public function destroy(string $id)
    {
        try {
            $document = DocumentsEntry::findOrFail($id);

            // Soft delete dokumen (file TIDAK dihapus, akan dihapus saat force delete)
            $document->delete();

            return redirect()->route('admin.documents.index')
                ->with('success', 'Dokumen berhasil dipindahkan ke trash!');
        } catch (\Exception $e) {
            Log::error('Error deleting document', [
                'document_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.documents.index')
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus dokumen: ' . $e->getMessage()]);
        }
    }

    // ====================================


    // ====================================
    // TRASH MANAGEMENT METHODS
    // ====================================

    public function trash(Request $request)
    {
        $query = DocumentsEntry::with(['type.category', 'tags', 'uploader'])->onlyTrashed();

        // Search functionality
        if ($request->filled('search') && !empty(trim($request->search))) {
            $search = trim($request->search);
            $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
            $query->where('title', $like, '%' . $search . '%');
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('type.category', function ($q) use ($request) {
                $q->where('id', $request->category);
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type_id', $request->type);
        }

        // Filter by year
        if ($request->filled('year')) {
            $query->where('year', $request->year);
        }

        // Per page options
        $perPage = $request->get('per_page', 10);
        $perPage = in_array($perPage, [5, 10, 15, 20]) ? $perPage : 10;

        $documents = $query->orderBy('deleted_at', 'desc')->paginate($perPage);

        // Get filter options
        $categories = DocumentsCategory::orderBy('name')->get();
        $types = DocumentsType::with('category')->orderBy('name')->get();

        // Get unique years from existing documents
        $years = DocumentsEntry::withTrashed()->distinct()->pluck('year')->sort()->values();

        // Current filters
        $filters = $request->only(['search', 'category', 'type', 'year', 'per_page']);

        return Inertia::render('Admin/Documents/Trash', [
            'documents' => $documents,
            'categories' => $categories,
            'types' => $types,
            'years' => $years,
            'filters' => $filters,
        ]);
    }


    public function restore(string $id)
    {
        try {
            $document = DocumentsEntry::onlyTrashed()->findOrFail($id);
            $document->restore();

            return redirect()->route('admin.documents.trash')
                ->with('success', 'Dokumen berhasil dipulihkan!');
        } catch (\Exception $e) {
            return redirect()->route('admin.documents.trash')
                ->withErrors(['error' => 'Terjadi kesalahan saat memulihkan dokumen: ' . $e->getMessage()]);
        }
    }


    public function forceDelete(string $id)
    {
        try {
            $document = DocumentsEntry::onlyTrashed()->findOrFail($id);
            $documentTitle = $document->title;

            // Hapus file dari storage
            FileStorageService::delete($document->file_path);

            // Hapus relasi tags jika ada
            $document->tags()->detach();

            // Hapus dokumen secara permanen dari database
            $document->forceDelete();

            Log::info('Document permanently deleted', ['document_id' => $id, 'title' => $documentTitle]);

            return redirect()->route('admin.documents.trash')
                ->with('success', "Dokumen '{$documentTitle}' berhasil dihapus permanen beserta file-nya!");
        } catch (\Exception $e) {
            Log::error('Error permanently deleting document', [
                'document_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('admin.documents.trash')
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus dokumen permanen: ' . $e->getMessage()]);
        }
    }
}
