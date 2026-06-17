<?php

namespace App\Http\Controllers\Admin\Pelayanan;

use App\Http\Controllers\Controller;
use App\Models\Pelayanan\JenisKunjungan;
use App\Models\Pelayanan\Pelayanan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PelayananAntrianController extends Controller
{
    public function index(Request $request)
    {
        $query = Pelayanan::with('jenisKunjungan')->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('jenis_kunjungan_id')) {
            $query->where('jenis_kunjungan_id', $request->jenis_kunjungan_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('kode_antrian', 'like', "%{$search}%")
                    ->orWhere('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('instansi_asal', 'like', "%{$search}%");
            });
        }

        $pelayanans    = $query->paginate($request->input('per_page', 10))->withQueryString();
        $jenisKunjungan = JenisKunjungan::orderBy('urutan')->orderBy('nama')->get();

        return Inertia::render('Admin/Pelayanan/Antrian/Index', [
            'pelayanans'     => $pelayanans,
            'jenisKunjungan' => $jenisKunjungan,
            'filters'        => $request->only(['status', 'jenis_kunjungan_id', 'search', 'per_page']),
            'statusOptions'  => Pelayanan::getStatusOptions(),
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to'   => 'required|date|after_or_equal:date_from',
        ]);

        $query = Pelayanan::with('jenisKunjungan')
            ->whereBetween('tanggal_kedatangan', [$request->date_from, $request->date_to])
            ->orderBy('tanggal_kedatangan')
            ->orderBy('kode_antrian');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('jenis_kunjungan_id')) {
            $query->where('jenis_kunjungan_id', $request->jenis_kunjungan_id);
        }

        $pelayanans     = $query->get();
        $jenisKunjungan = $request->filled('jenis_kunjungan_id')
            ? JenisKunjungan::find($request->jenis_kunjungan_id)
            : null;

        $logoPath   = public_path('assets/images/PUSDAJATIM.png');
        $logoBase64 = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;

        $pdf = Pdf::loadView('pdf.antrian-export', [
            'pelayanans'     => $pelayanans,
            'dateFrom'       => $request->date_from,
            'dateTo'         => $request->date_to,
            'status'         => $request->status,
            'jenisKunjungan' => $jenisKunjungan,
            'logoBase64'     => $logoBase64,
        ])->setPaper('a4', 'landscape');

        $filename = 'antrian-' . $request->date_from . '-sd-' . $request->date_to . '.pdf';

        return $pdf->download($filename);
    }

    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,diproses,selesai,dibatalkan',
        ]);

        $pelayanan = Pelayanan::findOrFail($id);
        $pelayanan->update(['status' => $validated['status']]);

        $statusText = [
            'pending'    => 'Menunggu',
            'diproses'   => 'Diproses',
            'selesai'    => 'Selesai',
            'dibatalkan' => 'Ditolak',
        ];

        return back()->with('success', 'Status antrian berhasil diubah menjadi ' . $statusText[$validated['status']]);
    }
}
