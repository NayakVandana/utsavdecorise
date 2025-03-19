<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BillTemplateFactory extends Factory
{
    public function definition()
    {
        $items = [
            ['item_name' => 'Decoration', 'quantity' => 1, 'price' => 50.00],
            ['item_name' => 'Lighting', 'quantity' => 2, 'price' => 25.00],
        ];
        $total_amount = array_sum(array_map(fn($item) => $item['quantity'] * $item['price'], $items));

        return [
            'name' => $this->faker->unique()->word() . ' Template',
            'customer_name' => $this->faker->name(),
            'invoice_number' => $this->faker->numerify('TPL-#####'),
            'total_amount' => $total_amount,
            'issue_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['pending', 'paid', 'overdue']),
            'items' => $items,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}