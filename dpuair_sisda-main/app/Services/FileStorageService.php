<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

// Service untuk manajemen file di storage (upload, hapus, dll)
class FileStorageService
{
    /**
     * Delete file from storage safely
     *
     * @param string|null $filePath
     * @return bool
     */
    public static function delete($filePath)
    {
        if (empty($filePath)) {
            return false;
        }

        try {
            // Check if file exists in public disk
            if (Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
                return true;
            }
            
            // Check in default disk if not found in public
            if (Storage::exists($filePath)) {
                Storage::delete($filePath);
                return true;
            }

            // Log warning if file not found but deletion requested (optional)
            // Log::warning("File deletion requested but file not found: {$filePath}");
            return false;

        } catch (\Exception $e) {
            Log::error("Error deleting file {$filePath}: " . $e->getMessage());
            return false;
        }
    }
}
