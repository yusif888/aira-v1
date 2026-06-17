<?php

namespace App\Http\Controllers\Admin\Pelayanan;

use App\Http\Controllers\Controller;
use App\Models\Pelayanan\JenisKunjungan;
use Illuminate\Http\Request;

class PelayananJenisKunjunganController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode'      => 'required|string|max:20|unique:jenis_kunjungan,kode',
            'nama'      => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'urutan'    => 'nullable|integer|min:0',
            'aktif'     => 'boolean',
        ]);

        JenisKunjungan::create($validated);

        return back()->with('success', 'Jenis kunjungan berhasil ditambahkan.');
    }

    public function update(Request $request, JenisKunjungan $jenisKunjungan)
    {
        $validated = $request->validate([
            'kode'      => 'required|string|max:20|unique:jenis_kunjungan,kode,' . $jenisKunjungan->id,
            'nama'      => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'urutan'    => 'nullable|integer|min:0',
            'aktif'     => 'boolean',
        ]);

        $jenisKunjungan->update($validated);

        return back()->with('success', 'Jenis kunjungan berhasil diperbarui.');
    }

    public function destroy(JenisKunjungan $jenisKunjungan)
    {
        $jenisKunjungan->delete();

        return back()->with('success', 'Jenis kunjungan berhasil dihapus.');
    }
}
