<?php

namespace Database\Factories\Documents;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Documents\DocumentsCategory>
 */
class DocumentsCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->sentence(3),
            'description' => $this->faker->paragraph,
            'is_active' => true,
        ];
    }
}
