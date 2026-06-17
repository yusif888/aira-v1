<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Mail\KodeAntrianMail;
use App\Models\Pelayanan\JenisKunjungan;
use App\Models\Pelayanan\Pelayanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PelayananController extends Controller
{
    public function index()
    {
        return Inertia::render('Pelayanan/Index', [
            'jenisKunjungan' => JenisKunjungan::aktif(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap'       => 'required|string|max:255',
            'email'              => 'required|email|max:255',
            'instansi_asal'      => 'required|string|max:255',
            'jenis_kunjungan_id' => 'required|exists:jenis_kunjungan,id',
            'nomor_whatsapp'     => 'required|string|max:20',
            'catatan'            => 'nullable|string',
            'tanggal_kedatangan' => 'required|date|after_or_equal:today',
        ]);

        $jenisKunjungan = JenisKunjungan::findOrFail($validated['jenis_kunjungan_id']);
        $kodeAntrian    = Pelayanan::generateKodeAntrian($jenisKunjungan);

        $pelayanan = Pelayanan::create([
            'kode_antrian'       => $kodeAntrian,
            'jenis_kunjungan_id' => $jenisKunjungan->id,
            'nama_lengkap'       => $validated['nama_lengkap'],
            'email'              => $validated['email'],
            'instansi_asal'      => $validated['instansi_asal'],
            'nomor_whatsapp'     => $validated['nomor_whatsapp'],
            'catatan'            => $validated['catatan'],
            'tanggal_kedatangan' => $validated['tanggal_kedatangan'],
            'status'             => Pelayanan::STATUS_PENDING,
        ]);

        try {
            Mail::to($pelayanan->email)->send(new KodeAntrianMail($pelayanan));
        } catch (\Exception $e) {
            Log::error('Failed to send kode antrian email: ' . $e->getMessage());
        }

        return redirect()->route('pelayanan.show', $pelayanan->kode_antrian)
            ->with('success', 'Pendaftaran berhasil! Kode antrian telah dikirim ke email Anda: ' . $kodeAntrian);
    }

    public function show(string $kodeAntrian)
    {
        $pelayanan = Pelayanan::with('jenisKunjungan')
            ->where('kode_antrian', $kodeAntrian)
            ->firstOrFail();

        return Inertia::render('Pelayanan/Show', [
            'pelayanan' => [
                'kode_antrian'       => $pelayanan->kode_antrian,
                'status'             => $pelayanan->status,
                'tanggal_kedatangan' => $pelayanan->tanggal_kedatangan,
                'instansi_asal'      => $pelayanan->instansi_asal,
                'jenis_kunjungan'    => $pelayanan->jenisKunjungan,
                'nama_lengkap'       => $this->maskNama($pelayanan->nama_lengkap),
                'email'              => $this->maskEmail($pelayanan->email),
                'nomor_whatsapp'     => $this->maskPhone($pelayanan->nomor_whatsapp),
            ],
        ]);
    }

    private function maskNama(string $nama): string
    {
        $parts = explode(' ', trim($nama));
        $first = $parts[0];

        if (count($parts) === 1) {
            return $first[0] . str_repeat('*', max(3, mb_strlen($first) - 1));
        }

        $rest = implode(' ', array_slice($parts, 1));
        return $first . ' ' . mb_substr($rest, 0, 1) . str_repeat('*', max(2, mb_strlen($rest) - 1));
    }

    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email, 2);
        $visible = mb_substr($local, 0, min(2, mb_strlen($local)));
        $masked  = $visible . str_repeat('*', max(3, mb_strlen($local) - mb_strlen($visible)));
        return $masked . '@' . $domain;
    }

    private function maskPhone(string $nomor): string
    {
        $len = mb_strlen($nomor);
        if ($len <= 8) {
            return $nomor;
        }
        return mb_substr($nomor, 0, 4) . str_repeat('*', $len - 8) . mb_substr($nomor, -4);
    }

    public function check(Request $request)
    {
        $request->validate([
            'kode_antrian' => 'required|string',
        ]);

        $pelayanan = Pelayanan::where('kode_antrian', $request->kode_antrian)->first();

        if (!$pelayanan) {
            return back()->withErrors(['kode_antrian' => 'Kode antrian tidak ditemukan']);
        }

        return redirect()->route('pelayanan.show', $pelayanan->kode_antrian);
    }
}
