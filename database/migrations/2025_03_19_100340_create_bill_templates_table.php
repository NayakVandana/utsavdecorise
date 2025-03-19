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
        Schema::create('bill_templates', function (Blueprint $table) {
            $table->id();
            $table->string('template_name')->unique();
            $table->string('name');
            $table->string('email');
            $table->string('mobile');
            $table->text('address');
            $table->string('invoice_number');
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->dateTime('issue_date'); // Using datetime as per prior clarification
            $table->dateTime('due_date');   // Using datetime as per prior clarification
            $table->string('status')->default('pending'); // String instead of enum
            $table->json('items');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Ad
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_templates');
    }
};
