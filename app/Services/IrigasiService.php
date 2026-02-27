<?php

namespace App\Services;

use App\Models\IrigasiData;
use Illuminate\Support\Facades\DB;

class IrigasiService
{
    /**
     * Cari info irigasi
     */
    public function getInfo($keyword)
    {
        // Simple search by name
        $data = IrigasiData::where('daerah_irigasi', 'like', "%{$keyword}%")
            ->first();
            
        if (!$data) return null;
        
        return $this->formatResponse($data);
    }
    
    private function formatResponse($data)
    {
        // Format as requested by user
        $response = "Nama Bendung : {$data->daerah_irigasi}\n";
        $response .= "Kewenangan : {$data->upt_name}\n";
        
        $response .= "Debit Intake TW 1 : {$data->debit_intake_tw1} (TW 1), {$data->debit_intake_tw2} (TW 2), {$data->debit_intake_tw3} (TW 3), {$data->debit_intake_tw4} (TW 4)\n";
        
        $response .= "Debit Kebutuhan : {$data->debit_kebutuhan_tw1} (TW 1), {$data->debit_kebutuhan_tw2} (TW 2), {$data->debit_kebutuhan_tw3} (TW 3), {$data->debit_kebutuhan_tw4} (TW 4)\n";
        
        $response .= "Persentase Keandalan : {$data->keandalan_tw1}% (TW 1), {$data->keandalan_tw2}% (TW 2), {$data->keandalan_tw3}% (TW 3), {$data->keandalan_tw4}% (TW 4)\n";
        
        // Kesimpulan dummy logic based on Keandalan > 80%
        $kesimpulan = [];
        if ($data->keandalan_tw1 >= 80) $kesimpulan[] = "TW 1 terpenuhi";
        else $kesimpulan[] = "TW 1 tidak terpenuhi";
        
        $response .= "Kesimpulan : " . implode(", ", $kesimpulan) . ".";
        
        return $response;
    }
}
