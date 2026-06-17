<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documents\DocumentsTag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

// Kelola tag dokumen (CRUD)
class DocumentTagController extends Controller
{
    /**
     * Menampilkan daftar tag dokumen.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        try {
            $query = DocumentsTag::withCount('entries');

            // Search functionality
            if ($request->filled('search') && !empty(trim($request->search))) {
                $search = trim($request->search);
                $like = config('database.default') === 'pgsql' ? 'ilike' : 'like';
                $query->where(function ($q) use ($search, $like) {
                    $q->where('name', $like, '%' . $search . '%')
                        ->orWhere('slug', $like, '%' . $search . '%');
                });
            }

            // Per page options - use same options as other methods
            $perPage = $request->get('per_page', 10);
            $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;

            $tags = $query->orderBy('created_at', 'desc')
                ->paginate($perPage)
                ->through(function ($tag) {
                    $tag->documents_count = $tag->entries_count ?? 0;
                    return $tag;
                });

            // Current filters
            $filters = $request->only(['search', 'per_page']);

            return Inertia::render('Admin/Documents/Tags', [
                'tags' => $tags,
                'filters' => $filters,
                'success' => session('success'),
                'error' => session('error'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading tags page:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return Inertia::render('Admin/Documents/Tags', [
                'tags' => [],
                'filters' => [],
                'error' => 'Terjadi kesalahan saat memuat data tags.'
            ]);
        }
    }

    /**
     * Menyimpan tag baru.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            // Log request data
            Log::info('Store Tag Request:', $request->all());

            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:documents_tags,name'
            ], [
                'name.required' => 'Nama tag wajib diisi.',
                'name.unique' => 'Tag dengan nama ini sudah ada.',
                'name.max' => 'Nama tag maksimal 255 karakter.'
            ]);

            Log::info('Validation passed:', $validated);

            $tag = DB::transaction(function () use ($validated) {
                $tagData = [
                    'name' => trim($validated['name']),
                    'slug' => Str::slug(trim($validated['name']))
                ];

                Log::info('Creating tag with data:', $tagData);

                return DocumentsTag::create($tagData);
            });

            Log::info('Tag created successfully:', $tag->toArray());

            // Always redirect back to tags page with success message
            return redirect()->route('admin.documents.tags')
                ->with('success', 'Tag berhasil ditambahkan!');
        } catch (ValidationException $e) {
            Log::error('Validation Error:', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Store Tag Error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menyimpan tag: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Memperbarui tag.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        Log::info('Tag Update Request:', ['id' => $id, 'data' => $request->all()]);

        try {
            $tag = DocumentsTag::findOrFail($id);
            Log::info('Found tag:', $tag->toArray());

            $validatedData = $request->validate([
                'name' => 'required|string|max:255|unique:documents_tags,name,' . $id
            ], [
                'name.required' => 'Nama tag wajib diisi.',
                'name.unique' => 'Tag dengan nama ini sudah ada.',
                'name.max' => 'Nama tag maksimal 255 karakter.'
            ]);

            Log::info('Update validation passed:', $validatedData);

            DB::transaction(function () use ($tag, $validatedData) {
                $updateData = [
                    'name' => trim($validatedData['name']),
                    'slug' => Str::slug(trim($validatedData['name']))
                ];

                Log::info('Updating tag with data:', $updateData);

                $tag->update($updateData);
            });

            Log::info('Tag updated successfully:', $tag->fresh()->toArray());

            return redirect()->route('admin.documents.tags')
                ->with('success', 'Tag berhasil diperbarui!');
        } catch (ValidationException $e) {
            Log::error('Validation Error on Update:', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Update Tag Error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat memperbarui tag: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Menghapus tag.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request, $id)
    {
        Log::info('Tag Delete Request:', ['id' => $id]);

        try {
            $tag = DocumentsTag::findOrFail($id);
            Log::info('Found tag to delete:', $tag->toArray());

            // Check if tag has associated entries
            $entriesCount = $tag->entries()->count();
            Log::info('Entries count for tag:', ['count' => $entriesCount]);

            if ($entriesCount > 0) {
                Log::warning('Attempted to delete tag with entries:', [
                    'tag_id' => $id,
                    'entries_count' => $entriesCount
                ]);

                return redirect()->back()->withErrors([
                    'error' => "Tag tidak dapat dihapus karena masih digunakan pada $entriesCount dokumen."
                ]);
            }

            $tagName = $tag->name;

            DB::transaction(function () use ($tag) {
                Log::info('Deleting tag:', ['id' => $tag->id, 'name' => $tag->name]);
                $tag->delete();
            });

            Log::info('Tag deleted successfully:', ['tag_name' => $tagName]);

            return redirect()->route('admin.documents.tags')
                ->with('success', "Tag '$tagName' berhasil dihapus!");
        } catch (\Exception $e) {
            Log::error('Delete Tag Error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect()->back()
                ->withErrors(['error' => 'Terjadi kesalahan saat menghapus tag: ' . $e->getMessage()]);
        }
    }
}
