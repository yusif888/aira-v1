<?php

namespace Database\Factories\Documents;

use App\Models\Documents\DocumentsType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Documents\DocumentsEntry>
 */
class DocumentsEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type_id' => DocumentsType::factory(),
            'title' => $this->faker->sentence,
            'document_number' => 'DOC-' . $this->faker->unique()->randomNumber(5),
            'year' => $this->faker->year,
            'description' => $this->faker->paragraph,
            'file_path' => 'seeders/documents/document-placeholder.pdf',
            'uploader_id' => User::first() ?? User::factory(),
        ];
    }
}
