<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillTemplate extends Model
{
    use SoftDeletes; // Added for soft deletes

    protected $fillable = [
        'template_name', 'name', 'email', 'mobile', 'address', 'invoice_number', 
        'total_amount', 'issue_date', 'due_date', 'status', 'items', 'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'issue_date' => 'datetime',
        'due_date' => 'datetime',
        'items' => 'array',
    ];

    protected $dates = ['deleted_at']; // Required for soft deletes
}