<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'email', 'mobile', 'address', 'invoice_number',
        'issue_date', 'due_date', 'status', 'notes', 'bill_copy', // Removed 'items' since it's not used
    ];
    protected $casts = [
        'total_amount' => 'decimal:2',
        'issue_date' => 'datetime',
        'due_date' => 'datetime',
        // Removed 'items' => 'array' to avoid conflict with items() relationship
    ];

    protected $dates = ['deleted_at'];

    public function items()
    {
        return $this->hasMany(BillItem::class);
    }

    public function termsConditions()
    {
        return $this->belongsToMany(TermsCondition::class, 'bill_terms_conditions');
    }

    public function calculateTotal()
    {
        // Ensure items is a collection, load if not already loaded
        $items = $this->items ?: $this->items()->get();
        $this->total_amount = $items->sum('subtotal');
        $this->save();
    }
}