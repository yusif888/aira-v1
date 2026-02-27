<?php

namespace App\Services;

class KamusService
{
    private $kamusData = [];

    public function __construct()
    {
        $this->loadKamus();
    }

    /**
     * Load kamus dari file JSON
     */
    private function loadKamus()
    {
        $kamusPath = public_path('assets/kamus.json');
        
        if (file_exists($kamusPath)) {
            $jsonContent = file_get_contents($kamusPath);
            $decoded = json_decode($jsonContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                // If JSON invalid, fallback to empty array and log the error to laravel log
                logger()->error('KamusService: invalid kamus.json - ' . json_last_error_msg());
                $this->kamusData = [];
            } else {
                $this->kamusData = $decoded;
            }
        }
    }

    /**
     * Cari jawaban berdasarkan pertanyaan user
     * 
     * @param string $pertanyaan
     * @return string|null
     */
    public function getJawaban($pertanyaan)
    {
        $pertanyaanLower = strtolower($pertanyaan);

        foreach ($this->kamusData as $entry) {
            $keywords = $entry['pertanyaan'];
            $jawaban = $entry['jawaban'];

            foreach ($keywords as $keyword) {
                if (stripos($pertanyaanLower, strtolower($keyword)) !== false) {
                    return $jawaban;
                }
            }
        }

        return null;
    }

    /**
     * Get all kamus data
     * 
     * @return array
     */
    public function getAllKamus()
    {
        return $this->kamusData;
    }
}
