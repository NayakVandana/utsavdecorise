<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BillFactory extends Factory
{
    public function definition()
    {
        return [
            'customer_name' => $this->faker->name(),
            'invoice_number' => $this->faker->unique()->numerify('INV-#####'),
            'total_amount' => 0.00,
            'issue_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $this->faker->randomElement(['pending', 'paid', 'overdue']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}