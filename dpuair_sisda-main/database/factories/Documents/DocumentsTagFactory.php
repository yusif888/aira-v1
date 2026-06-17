<?php

namespace Database\Factories\Documents;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate_Database_Eloquent_Factories_Factory<\App\Models\Documents\DocumentsTag>
 */
class DocumentsTagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->word;
        return [
            'name' => $name,
            'slug' => Str::slug($name),
        ];
    }
}
