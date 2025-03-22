<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('receive_payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bill_id');
            $table->decimal('amount', 10, 2); // Payment amount
            $table->string('payment_type')->nullable(); // e.g., 'advance', 'to_complete'
            $table->string('mode_of_payment')->nullable();
            $table->dateTime('payment_date'); // When payment was received
            $table->string('status')->default('pending'); // e.g., 'pending', 'completed'
            $table->text('notes')->nullable(); // Optional notes
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('bill_id')->references('id')->on('bills')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receive_payments');
    }
};
