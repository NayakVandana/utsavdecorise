<?php

namespace Database\Factories;

use App\Models\Bill;
use Illuminate\Database\Eloquent\Factories\Factory;

class BillItemFactory extends Factory
{
    public function definition()
    {
        return [
            'bill_id' => Bill::factory(),
            'item_name' => $this->faker->word(),
            'quantity' => $this->faker->numberBetween(1, 10),
            'price' => $this->faker->randomFloat(2, 5, 100),
        ];
    }
}