<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IrigasiData extends Model
{
    protected $table = 'irigasi_data';
    
    protected $fillable = [
        'upt_name', 'daerah_irigasi', 'baku_ha',
        'debit_intake_tw1', 'debit_intake_tw2', 'debit_intake_tw3', 'debit_intake_tw4',
        'debit_kebutuhan_tw1', 'debit_kebutuhan_tw2', 'debit_kebutuhan_tw3', 'debit_kebutuhan_tw4',
        'keandalan_tw1', 'keandalan_tw2', 'keandalan_tw3', 'keandalan_tw4'
    ];
}
