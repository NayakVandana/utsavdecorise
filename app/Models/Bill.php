<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends Model
{
    use SoftDeletes; // Added for soft deletes

    protected $fillable = [
        'name', 'email', 'mobile', 'address', 'invoice_number', 'total_amount', 
        'issue_date', 'due_date', 'status', 'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'issue_date' => 'datetime',
        'due_date' => 'datetime',
    ];

    protected $dates = ['deleted_at']; // Required for soft deletes

    public function items()
    {
        return $this->hasMany(BillItem::class);
    }

    public function calculateTotal()
    {
        $this->total_amount = $this->items->sum('subtotal');
        $this->save();
    }
}