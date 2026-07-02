<?php

namespace App\Services;

use App\Models\IrigasiData;
use App\Services\SearchResult;

class IrigasiService
{
    /**
     * Cari info irigasi
     */
    public function search($message)
    {
        $data = $this->findBendung($message);
        if (!$data) {
            return SearchResult::empty();
        }
        $tw = $this->detectTw($message);
        $type = $this->detectInformationType($message);
        $answer = $this->buildAnswer(
            $data,
            $tw,
            $type
        );

        return SearchResult::success(
            1,
            'irigasi',
            $answer,
            [
                'daerah_irigasi' => $data->daerah_irigasi
            ]
        );
    }

    private function findBendung($message)
    {
        $allIrigasi = IrigasiData::select('daerah_irigasi')->get();

        foreach ($allIrigasi as $irigasi) {

            if (stripos($message, $irigasi->daerah_irigasi) !== false) {

                return IrigasiData::where(
                    'daerah_irigasi',
                    $irigasi->daerah_irigasi
                )->first();
            }
        }

        return null;
    }

    private function detectTw($message)
    {
        if (preg_match('/TW\s*(\d)/i', $message, $matches)) {
            return (int) $matches[1];
        }
        return null;
    }

    private function detectInformationType($message)
    {
        $isKeandalan =
            stripos($message, 'keandalan') !== false ||
            stripos($message, 'persentase') !== false;

        $isKebutuhan =
            stripos($message, 'kebutuhan') !== false;

        $isIntake =
            stripos($message, 'intake') !== false;

        if (!$isKeandalan && !$isKebutuhan && !$isIntake) {
            $isKeandalan = true;
            $isKebutuhan = true;
            $isIntake = true;
        }
        return [
            'keandalan' => $isKeandalan,
            'kebutuhan' => $isKebutuhan,
            'intake' => $isIntake
        ];
    }

    private function buildAnswer($data, $targetTw, array $type)
    {
        $num = function ($val) {
            return number_format((float)$val, 2, ',', '.');
        };

        $isIntake = $type['intake'];
        $isKebutuhan = $type['kebutuhan'];
        $isKeandalan = $type['keandalan'];

        // Header
        $linesInfo = [];
        $linesInfo[] = "Nama Bendung : " . $data->daerah_irigasi;
        $linesInfo[] = "Kewenangan : " . $data->upt_name;

        $headerStr = implode("\n", $linesInfo) . "\n\n";

        $sections = [];

        // Section Intake
        if ($isIntake) {
            $lines = [];
            if ($targetTw) {
                $val = $data->{"debit_intake_tw{$targetTw}"};
                $lines[] = "- TW {$targetTw}: " . $num($val);
            } else {
                for ($i = 1; $i <= 4; $i++) {
                    $lines[] = "- TW {$i}: " . $num($data->{"debit_intake_tw{$i}"});
                }
            }
            $sections[] = "Debit Intake (Lt/dt):\n" . implode("\n", $lines);
        }

        // Section Kebutuhan
        if ($isKebutuhan) {
            $lines = [];
            if ($targetTw) {
                $val = $data->{"debit_kebutuhan_tw{$targetTw}"};
                $lines[] = "- TW {$targetTw}: " . $num($val);
            } else {
                for ($i = 1; $i <= 4; $i++) {
                    $lines[] = "- TW {$i}: " . $num($data->{"debit_kebutuhan_tw{$i}"});
                }

            }
            $sections[] = "Debit Kebutuhan (Lt/dt):\n" . implode("\n", $lines);
        }

        // Section Keandalan
        if ($isKeandalan) {
            $lines = [];
            if ($targetTw) {
                $val = $data->{"keandalan_tw{$targetTw}"};
                $lines[] = "- TW {$targetTw}: " . $num($val) . "%";
            } else {
                for ($i = 1; $i <= 4; $i++) {
                    $lines[] = "- TW {$i}: " . $num($data->{"keandalan_tw{$i}"}) . "%";
                }
            }
            $sections[] = "Persentase Keandalan (%):\n" . implode("\n", $lines);
        }

        $sectionsStr = "";
        if (!empty($sections)) {
            $sectionsStr = implode("\n\n", $sections) . "\n\n";
        }

        // Kesimpulan
        $conclusions = [];
        $tws = $targetTw ? [$targetTw] : [1,2,3,4];
        foreach ($tws as $tw) {
            $val = $data->{"keandalan_tw{$tw}"};
            $status = ($val >= 80)
                ? "terpenuhi"
                : "tidak terpenuhi";
            $conclusions[] =
                "- Pada TW {$tw} persentase keandalan sebesar "
                . $num($val)
                . "% ({$status})";
        }

        $footerStr = "Kesimpulan :\n" . implode("\n", $conclusions);
        return $headerStr . $sectionsStr . $footerStr;
    }
}

