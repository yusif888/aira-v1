<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIrigasiDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('irigasi_data', function (Blueprint $table) {
            $table->increments('id'); 
            $table->string('upt_name')->nullable();
            $table->string('daerah_irigasi');
            $table->decimal('baku_ha', 15, 2)->nullable();
            
            // Debit Intake
            $table->decimal('debit_intake_tw1', 15, 2)->nullable();
            $table->decimal('debit_intake_tw2', 15, 2)->nullable();
            $table->decimal('debit_intake_tw3', 15, 2)->nullable();
            $table->decimal('debit_intake_tw4', 15, 2)->nullable();
            
            // Debit Kebutuhan
            $table->decimal('debit_kebutuhan_tw1', 15, 2)->nullable();
            $table->decimal('debit_kebutuhan_tw2', 15, 2)->nullable();
            $table->decimal('debit_kebutuhan_tw3', 15, 2)->nullable();
            $table->decimal('debit_kebutuhan_tw4', 15, 2)->nullable();
            
            // Keandalan
            $table->decimal('keandalan_tw1', 8, 2)->nullable();
            $table->decimal('keandalan_tw2', 8, 2)->nullable();
            $table->decimal('keandalan_tw3', 8, 2)->nullable();
            $table->decimal('keandalan_tw4', 8, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('irigasi_data');
    }
}
