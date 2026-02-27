<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\IrigasiData;
use Illuminate\Support\Facades\DB;

class ImportIrigasiData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'aira:import-irigasi {file : The path to the CSV file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import Irigasi Data from CSV';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $file = $this->argument('file');
        
        if (!file_exists($file)) {
            $this->error("File not found: {$file}");
            return;
        }

        $this->info("Importing data from {$file}...");
        
        // Truncate table first? Maybe ask user, but for now we assume fresh import
        // IrigasiData::truncate(); 
        
        $handle = fopen($file, "r");
        $header = fgetcsv($handle, 1000, ","); // Skip header
        
        $count = 0;
        $currentUpt = null;
        
        DB::beginTransaction();
        try {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Determine structure based on image
                // Col 0: No
                // Col 1: Daerah Irigasi / UPT Header
                // Col 2: Baku (Ha)
                // Col 3-6: Debit Intake TW 1-4
                // Col 7-10: Debit Kebutuhan TW 1-4
                // Col 11-14: Keandalan TW 1-4
                
                $col1 = trim($data[1] ?? '');
                
                // Check if it's a UPT Header row (simple heuristic: empty numeric columns)
                // Or if user structure puts UPT in a separate column.
                // Based on image: "UPT PSDA WS. BRANTAS" appears in the "Daerah Irigasi" column context.
                if (stripos($col1, 'UPT PSDA') !== false) {
                    $currentUpt = $col1;
                    continue; // Skip the header row itself
                }
                
                // Skip 'Total', 'Kab.', 'Kota' rows if they don't have full data or are summary rows
                if (stripos($col1, 'Total') !== false || stripos($col1, 'Kab.') !== false || stripos($col1, 'Kota') !== false) {
                    // Logic to add Kab/Kota context if needed, but for now skip
                    continue; 
                }

                if (empty($col1)) continue;

                // Basic cleaning function for Indonesian number format
                // 1. Remove dots (thousands separator)
                // 2. Replace comma with dot (decimal separator)
                $cleanNum = function($val) {
                    $val = str_replace('.', '', $val); // Remove thousands separator
                    $val = str_replace(',', '.', $val); // Replace decimal separator
                    return (float) $val;
                };
                
                IrigasiData::create([
                    'upt_name' => $currentUpt,
                    'daerah_irigasi' => $col1,
                    'baku_ha' => $cleanNum($data[2] ?? 0),
                    
                    'debit_intake_tw1' => $cleanNum($data[3] ?? 0),
                    'debit_intake_tw2' => $cleanNum($data[4] ?? 0),
                    'debit_intake_tw3' => $cleanNum($data[5] ?? 0),
                    'debit_intake_tw4' => $cleanNum($data[6] ?? 0),
                    
                    'debit_kebutuhan_tw1' => $cleanNum($data[7] ?? 0),
                    'debit_kebutuhan_tw2' => $cleanNum($data[8] ?? 0),
                    'debit_kebutuhan_tw3' => $cleanNum($data[9] ?? 0),
                    'debit_kebutuhan_tw4' => $cleanNum($data[10] ?? 0),
                    
                    'keandalan_tw1' => $cleanNum($data[11] ?? 0),
                    'keandalan_tw2' => $cleanNum($data[12] ?? 0),
                    'keandalan_tw3' => $cleanNum($data[13] ?? 0),
                    'keandalan_tw4' => $cleanNum($data[14] ?? 0),
                ]);
                
                $count++;
            }
            DB::commit();
            $this->info("Imported {$count} rows successfully.");
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage());
        }
        
        fclose($handle);
    }
}
