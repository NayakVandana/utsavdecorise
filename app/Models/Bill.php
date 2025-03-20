<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'email', 'mobile', 'address', 'invoice_number',
        'issue_date', 'due_date', 'status', 'notes', 'items', 'bill_copy',
    ];
    protected $casts = [
        'total_amount' => 'decimal:2',
        'issue_date' => 'datetime',
        'due_date' => 'datetime',
        'items' => 'array',
    ];

    

    protected $dates = ['deleted_at']; // Required for soft deletes
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
        $this->total_amount = $this->items->sum('subtotal');
        $this->save();
    }
}