<?php

namespace App\Services\Search;

class SynonymDirectory
{
    public static function getMap()
    {
        $groups = [
            ['alamat', 'lokasi', 'letak', 'tempat', 'kantor', 'kantornya', 'posisi'],
            ['jam', 'waktu', 'pukul', 'operasional', 'buka', 'tutup', 'layanan'],
            ['telepon', 'telp', 'telfon', 'nomor', 'nomer', 'no', 'hp', 'wa', 'whatsapp'],
            ['email', 'surel', 'mail'],
            ['website', 'web', 'situs', 'laman'],
            ['pengaduan', 'lapor', 'keluhan', 'aduan', 'komplain'],
            ['magang', 'pkl', 'internship', 'praktik', 'kerja', 'lapangan'],
            ['kepala', 'kadis', 'pimpinan'],
            ['sekretaris', 'sekdin'],
            ['kabid', 'kepala bidang'],
            ['kasi', 'kepala seksi'],
            ['kasubbag', 'kepala sub bagian'],
            ['profil', 'tentang', 'selayang', 'pandang'],
            ['organisasi', 'struktur', 'bagan'],
            ['tugas', 'fungsi', 'tupoksi'],
            ['data', 'dataset'],
            ['sungai', 'das'],
            ['debit', 'curah', 'hujan']
        ];
        $map = [];
        foreach ($groups as $group) {
            $canonical = $group[0];
            foreach ($group as $word) {
                $map[$word] = $canonical;
            }
        }
        return $map;
    }
}