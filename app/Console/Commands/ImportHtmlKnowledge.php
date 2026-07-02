<?php

namespace App\Console\Commands;

use App\Models\WebsiteKnowledge;
use DOMDocument;
use DOMElement;
use DOMXPath;
use Illuminate\Console\Command;

class ImportHtmlKnowledge extends Command
{
    /**
     * php artisan aira:import-html-knowledge
     */
    protected $signature = 'aira:import-html-knowledge';

    /**
     * Command description.
     *
     * @var string
     */
    protected $description = 'Import manual HTML Profil Pimpinan menjadi Website Knowledge';

    public function handle()
    {
      // Parse HTML
        $file = storage_path('app/manual/profil-pimpinan.html');

        $url = 'https://dpuair.jatimprov.go.id/profil/pimpinan';

        

        if (!file_exists($file)) {
            $this->error('File tidak ditemukan:');
            $this->line($file);

            return 1;
        }

        $this->info('Membaca file HTML...');

        $leaders = $this->parseHtml($file);

        if (empty($leaders)) {

            $this->error('Tidak ada data yang berhasil diekstrak.');

            return 1;
        }

        foreach ($leaders as $leader) {
            $this->saveLeader(
                $leader,
                $url,
                $file
            );
        }
        
        $this->line('');

        $this->info('======================================');
        $this->info('IMPORT BERHASIL');
        $this->info('======================================');

        $this->line('');

        $this->info(
            'Total pimpinan : ' . count($leaders)
        );
        
        return 0;
    }

    private function parseHtml($file)
    {
      // Parse HTML

        $html = file_get_contents($file);

        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($html);

        libxml_clear_errors();

        $xpath = new DOMXPath($dom);

        $nodes = $xpath->query('//h3 | //h4');

        $leaders = [];

        foreach ($nodes as $nameNode) {

            $name = trim(
                preg_replace('/\s+/', ' ', $nameNode->textContent)
            );

            if ($name == '') {
                continue;
            }

            if (stripos($name, 'Informasi Penting') !== false) {
                continue;
            }

            $positionNode = null;

            $next = $nameNode->nextSibling;

            while ($next) {

                if (
                    $next instanceof DOMElement &&
                    strtolower($next->tagName) === 'p'
                ) {
                    $positionNode = $next;
                    break;
                }

                $next = $next->nextSibling;
            }

            if (!$positionNode) {
                continue;
            }

            $position = trim(
                preg_replace('/\s+/', ' ', $positionNode->textContent)
            );

            if ($position == '') {
                continue;
            }

            $nameLower = strtolower($name);
            $positionLower = strtolower($position);

            if (
                strpos($nameLower, 'informasi penting') !== false ||
                strpos($nameLower, 'dinas pu') !== false ||
                strpos($nameLower, 'sumber daya air') !== false ||
                strpos($nameLower, 'provinsi') !== false ||
                strpos($positionLower, 'provinsi jawa timur') !== false
            ) {
                continue;
            }

            $leaders[] = [
                'name' => $name,
                'position' => $position

            ];


        }

        if (empty($leaders)) {

            return [];
        }

        return $leaders;
    }

    private function saveLeader($leader, $baseUrl, $file){
      $content = $this->buildLeaderContent($leader);    
      $keywords = $this->generateLeaderKeywords($leader);   
      WebsiteKnowledge::updateOrCreate(   
          [   
              'source_type' => 'manual_html',   
              'title' => $leader['position'] . ' - ' . $leader['name']  
          ],    
          [   
              'source_id' => null,    
              'title' => $leader['position'] . ' - ' . $leader['name'],   
              'url' => $baseUrl,    
              'content' => $content,    
              'summary' => $leader['name'],   
              'keywords' => $keywords,    
              'metadata' => [   
                  'parser' => 'profile_pimpinan',   
                  'position' => $leader['position'],    
                  'name' => $leader['name'],    
                  'file' => basename($file),    
                  'imported_at' => now()->toDateTimeString()    
              ],    
              'is_active' => true,    
              'source_updated_at' => now()    
          ]   
      );    
      $this->info(
          "✓ {$leader['position']} - {$leader['name']}"
      );
    }

    private function buildLeaderContent($leader)
    {
      return sprintf(
        "%s merupakan %s pada Dinas PU Sumber Daya Air Provinsi Jawa Timur.",
        $leader['name'],
        $leader['position']
      );
    }

    private function generateLeaderKeywords($leader)
    {
      $keywords = [];

      $position = strtolower(trim($leader['position']));
      $name = trim($leader['name']);

      // hapus gelar
      $cleanName = preg_replace('/,\s*.*/', '', $name);
      $cleanName = strtolower($cleanName);

      // normalisasi spasi
      $position = preg_replace('/\s+/', ' ', $position);

      $keywords[] = $position;
      $keywords[] = "siapa $position";
      $keywords[] = "nama $position";
      $keywords[] = "profil $position";

      /*
      |--------------------------------------------------------------------------
      | Kepala Dinas
      |--------------------------------------------------------------------------
      */

      if (str_contains($position, 'kepala dinas')) {

          $keywords[] = 'kepala dinas';
          $keywords[] = 'kadis';

          $keywords[] = 'siapa kepala dinas';
          $keywords[] = 'nama kepala dinas';
          $keywords[] = 'profil kepala dinas';

          $keywords[] = 'pimpinan';
      }

      /*
      |--------------------------------------------------------------------------
      | Sekretaris
      |--------------------------------------------------------------------------
      */

      if (str_contains($position, 'sekretaris')) {

          $keywords[] = 'sekretaris';
          $keywords[] = 'sekretaris dinas';
          $keywords[] = 'sekdin';

          $keywords[] = 'siapa sekretaris';
          $keywords[] = 'nama sekretaris';
      }

      /*
      |--------------------------------------------------------------------------
      | Kepala Bidang
      |--------------------------------------------------------------------------
      */

      if (str_contains($position, 'kepala bidang')) {

          $keywords[] = 'kabid';

          $bidang = trim(
              str_ireplace('kepala bidang', '', $position)
          );

          if ($bidang != '') {

              $keywords[] = $bidang;

              $keywords[] = "kabid $bidang";

              $keywords[] = "kepala bidang $bidang";

              $keywords[] = "siapa kabid $bidang";

              $keywords[] = "siapa kepala bidang $bidang";
          }
      }

      /*
      |--------------------------------------------------------------------------
      | Nama
      |--------------------------------------------------------------------------
      */

      $keywords[] = $cleanName;

      $parts = preg_split('/\s+/', $cleanName);

      if (count($parts) >= 2) {

          $keywords[] =
              $parts[count($parts)-2] .
              ' ' .
              $parts[count($parts)-1];

          $keywords[] = end($parts);
      }

      return array_values(array_unique($keywords));
    }
}