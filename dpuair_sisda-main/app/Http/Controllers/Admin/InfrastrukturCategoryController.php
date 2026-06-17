<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InfrastrukturSDA\InfrastrukturCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InfrastrukturCategoryController extends Controller
{
    /**
     * Menampilkan daftar kategori infrastruktur.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $categories = InfrastrukturCategory::withCount('infrastruktur')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/InfrastrukturSDA/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * Menyimpan kategori infrastruktur baru.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:infrastruktur_categories,code',
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        InfrastrukturCategory::create($validated);

        return back()->with('success', 'Kategori berhasil ditambahkan');
    }

    /**
     * Memperbarui kategori infrastruktur.
     *
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $category = InfrastrukturCategory::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:infrastruktur_categories,code,' . $id,
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    /**
     * Menghapus kategori infrastruktur.
     *
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $category = InfrastrukturCategory::findOrFail($id);

        // Check if category has data
        if ($category->infrastruktur()->count() > 0) {
            return back()->withErrors(['error' => 'Kategori tidak dapat dihapus karena masih memiliki data infrastruktur']);
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
