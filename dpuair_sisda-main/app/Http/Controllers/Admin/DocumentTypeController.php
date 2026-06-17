<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Documents\DocumentsType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

// Kelola tipe/jenis dokumen (CRUD + validasi)
class DocumentTypeController extends Controller
{
    /**
     * Menyimpan tipe dokumen baru.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|exists:documents_categories,id',
                'icon' => 'nullable|string|max:50',
                'status' => 'nullable|string|in:active,inactive',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'Nama tipe dokumen wajib diisi.',
                'name.max' => 'Nama tipe dokumen maksimal 255 karakter.',
                'category_id.required' => 'Kategori wajib dipilih.',
                'category_id.exists' => 'Kategori yang dipilih tidak valid.',
                'icon.max' => 'Icon maksimal 50 karakter.'
            ]);

            // Log request data
            Log::info('Creating document type:', $validated);

            // Buat tipe dokumen baru
            $type = DocumentsType::create([
                'name' => trim($validated['name']),
                'category_id' => $validated['category_id'],
                'icon' => $validated['icon'] ?? 'fas fa-file',
                'status' => $request->boolean('is_active', true) ? 'active' : 'inactive',
                'is_active' => $request->boolean('is_active', true),
            ]);

            Log::info('Document type created successfully:', $type->toArray());

            return redirect()->back()
                ->with('success', 'Tipe dokumen berhasil ditambahkan.');
        } catch (ValidationException $e) {
            Log::error('Validation error creating document type:', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating document type:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'data' => $request->all()
            ]);

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat menambahkan tipe dokumen.')
                ->withInput();
        }
    }

    /**
     * Memperbarui tipe dokumen.
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
                'name' => 'required|string|max:255',
                'status' => 'nullable|string|in:active,inactive',
                'is_active' => 'boolean'
            ], [
                'name.required' => 'Nama tipe dokumen wajib diisi.',
                'name.max' => 'Nama tipe dokumen maksimal 255 karakter.'
            ]);

            // Log request data
            Log::info('Updating document type:', ['id' => $id, 'data' => $validated]);

            // Cari dan update tipe dokumen
            $type = DocumentsType::findOrFail($id);

            $type->update([
                'name' => trim($validated['name']),
                'status' => $request->boolean('is_active', true) ? 'active' : 'inactive',
                'is_active' => $request->boolean('is_active', true),
            ]);

            Log::info('Document type updated successfully:', $type->toArray());

            return redirect()->back()
                ->with('success', 'Tipe dokumen berhasil diperbarui.');
        } catch (ValidationException $e) {
            Log::error('Validation error updating document type:', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating document type:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'type_id' => $id,
                'data' => $request->all()
            ]);

            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat memperbarui tipe dokumen.')
                ->withInput();
        }
    }

    /**
     * Menghapus tipe dokumen.
     *
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(string $id)
    {
        try {
            // Log delete request
            Log::info('Deleting document type:', ['id' => $id]);

            $type = DocumentsType::with(['entries', 'category'])->findOrFail($id);

            // Check if type has documents - this is the main restriction
            $documentsCount = $type->entries()->count();
            if ($documentsCount > 0) {
                Log::warning('Cannot delete type with documents:', [
                    'type_id' => $id,
                    'type_name' => $type->name,
                    'documents_count' => $documentsCount
                ]);

                return redirect()->back()
                    ->with('error', "❌ **GAGAL MENGHAPUS TIPE DOKUMEN**\n\nTipe dokumen **'{$type->name}'** tidak dapat dihapus karena masih memiliki **{$documentsCount} dokumen**.\n\n**Solusi:**\n• Hapus semua dokumen yang terkait dengan tipe ini terlebih dahulu\n• Atau pindahkan dokumen ke tipe dokumen lain\n• Atau nonaktifkan tipe dokumen ini jika masih diperlukan");
            }

            // Additional validation: Check if type is still referenced elsewhere
            $typeName = $type->name;
            $categoryName = $type->category ? $type->category->name : 'Unknown Category';

            // Double-check with database query to ensure no documents exist
            $finalCheck = DocumentsType::withCount('entries')->find($id);
            if ($finalCheck && $finalCheck->entries_count > 0) {
                Log::warning('Final check failed - type still has documents:', [
                    'type_id' => $id,
                    'type_name' => $typeName,
                    'final_documents_count' => $finalCheck->entries_count
                ]);

                return redirect()->back()
                    ->with('error', "❌ **GAGAL MENGHAPUS TIPE DOKUMEN**\n\nTipe dokumen **'{$typeName}'** tidak dapat dihapus karena masih memiliki **{$finalCheck->entries_count} dokumen**.\n\n**Solusi:**\n• Hapus semua dokumen yang terkait dengan tipe ini terlebih dahulu\n• Atau pindahkan dokumen ke tipe dokumen lain\n• Atau nonaktifkan tipe dokumen ini jika masih diperlukan");
            }

            // Delete the type
            $type->delete();

            Log::info('Document type deleted successfully:', [
                'type_id' => $id,
                'type_name' => $typeName,
                'category_name' => $categoryName
            ]);

            return redirect()->back()
                ->with('success', "✅ **TIPE DOKUMEN BERHASIL DIHAPUS**\n\nTipe dokumen **'{$typeName}'** dari kategori **'{$categoryName}'** telah berhasil dihapus dari sistem.");
        } catch (\Exception $e) {
            Log::error('Error deleting document type:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'type_id' => $id
            ]);

            return redirect()->back()
                ->with('error', '❌ **TERJADI KESALAHAN**\n\nGagal menghapus tipe dokumen. Silakan coba lagi atau hubungi administrator.');
        }
    }

    /**
     * Mendapatkan detail tipe dokumen (untuk keperluan frontend/modal).
     *
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function getTypeDetails(string $id)
    {
        try {
            $type = DocumentsType::with(['entries', 'category'])
                ->withCount('entries')
                ->findOrFail($id);

            // Simpan data dalam session untuk digunakan di frontend
            session([
                'type_details' => [
                    'id' => $type->id,
                    'name' => $type->name,
                    'category_name' => $type->category ? $type->category->name : 'Unknown',
                    'documents_count' => $type->entries_count,
                    'can_delete' => $type->entries_count === 0,
                    'is_active' => $type->is_active,
                    'created_at' => $type->created_at,
                    'updated_at' => $type->updated_at
                ]
            ]);

            return redirect()->back()
                ->with('type_details', session('type_details'));
        } catch (\Exception $e) {
            Log::error('Error getting type details:', [
                'message' => $e->getMessage(),
                'type_id' => $id
            ]);

            return redirect()->back()
                ->with('error', 'Gagal mendapatkan detail tipe dokumen');
        }
    }

    public function validateTypeDeletion(string $id)
    {
        try {
            $type = DocumentsType::withCount('entries')->findOrFail($id);

            $canDelete = $type->entries_count === 0;

            // Simpan hasil validasi dalam session
            session([
                'type_validation' => [
                    'can_delete' => $canDelete,
                    'documents_count' => $type->entries_count,
                    'type_name' => $type->name,
                    'message' => $canDelete
                        ? "Tipe dokumen '{$type->name}' dapat dihapus"
                        : "Tipe dokumen '{$type->name}' tidak dapat dihapus karena masih memiliki {$type->entries_count} dokumen"
                ]
            ]);

            return redirect()->back()
                ->with('type_validation', session('type_validation'));
        } catch (\Exception $e) {
            Log::error('Error validating type deletion:', [
                'message' => $e->getMessage(),
                'type_id' => $id
            ]);

            return redirect()->back()
                ->with('error', 'Gagal memvalidasi penghapusan tipe dokumen');
        }
    }
}
