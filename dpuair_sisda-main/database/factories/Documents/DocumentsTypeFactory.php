<?php

namespace Database\Factories\Documents;

use App\Models\Documents\DocumentsCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Documents\DocumentsType>
 */
class DocumentsTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => DocumentsCategory::factory(),
            'name' => $this->faker->words(2, true),
            'icon' => $this->faker->randomElement(['file-text', 'book', 'map', 'bar-chart']),
            'status' => 'active',
            'is_active' => true,
        ];
    }
}
