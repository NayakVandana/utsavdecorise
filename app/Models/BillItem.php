<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillItem extends Model
{
    use SoftDeletes; // Added for soft deletes

    protected $fillable = ['bill_id', 'item_name', 'quantity', 'price'];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    protected $dates = ['deleted_at']; // Required for soft deletes

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}