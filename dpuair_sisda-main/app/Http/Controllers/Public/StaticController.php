<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class StaticController extends Controller
{
    // ========================
    // ======================== Profil
    // ========================
    // ======== Profil Dinas
    public function selayangPandang()
    {
        return Inertia::render('Static/Profil/SelayangPandang');
    }

    public function visiMisi()
    {
        return Inertia::render('Static/Profil/VisiMisi');
    }

    public function tupoksi()
    {
        return Inertia::render('Static/Profil/Tupoksi');
    }

    public function dasarHukum()
    {
        return Inertia::render('Static/Profil/DasarHukum');
    }

    public function pimpinan()
    {
        return Inertia::render('Static/Profil/Pimpinan');
    }

    public function kepegawaian()
    {
        return Inertia::render('Static/Profil/Kepegawaian');
    }
    // ======== Struktur Organisasi
    public function baganStruktur()
    {
        return Inertia::render('Static/Profil/BaganStruktur');
    }

    public function sekretariat()
    {
        return Inertia::render('Static/Profil/Sekretariat');
    }

    public function bidangPerencanaan()
    {
        return Inertia::render('Static/Profil/BidangPerencanaanSDA');
    }

    public function bidangIrigasi()
    {
        return Inertia::render('Static/Profil/BidangIrigasi');
    }

    public function bidangSungaiWaduk()
    {
        return Inertia::render('Static/Profil/BidangSungaiWaduk');
    }

    public function bidangBinaManfaat()
    {
        return Inertia::render('Static/Profil/BidangBinaManfaat');
    }

    public function petaUPT()
    {
        // Inject Mapbox token from server env
        $mapboxToken = config('services.mapbox.token') ?? env('VITE_MAPBOX_TOKEN');

        return Inertia::render('Static/Profil/PetaUPT', [
            'mapboxToken' => $mapboxToken
        ]);
    }

    public function daftarUPT()
    {
        return Inertia::render('Static/Profil/DaftarUPT');
    }



    // ========================
    // ======================== Pengaduan
    // ========================
    public function pengaduan()
    {
        return Inertia::render('Static/PengaduanForm');
    }
    public function kirimPengaduan(Request $request)
    {
        // Validasi input
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'judul' => 'required|string|max:255',
            'isi_pengaduan' => 'required|string|max:1000',
        ]);

        DB::beginTransaction();
        try {
            DB::table('complaints')->insert([
                'name'       => $request->nama,
                'email'      => $request->email,
                'title'      => $request->judul,
                'content'    => $request->isi_pengaduan,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            DB::commit();

            return redirect()->route('pengaduan')->with('success', 'Pengaduan berhasil dikirim. Terima kasih atas partisipasi Anda.');
        } catch (\Exception $e) {
            DB::rollBack();

            // Log error atau tampilkan pesan error
            return response()->json([
                'error' => 'Terjadi kesalahan saat mengirim pengaduan. Silakan coba lagi.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
};
