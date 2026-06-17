<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pelayanan\Pelayanan;

class PelayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate 20 sample pelayanan data one by one to avoid race condition
        for ($i = 0; $i < 20; $i++) {
            Pelayanan::factory()->create();
        }
    }
}
