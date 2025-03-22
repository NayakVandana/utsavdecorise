<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bill extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'email', 'mobile', 'address', 'invoice_number',
        'issue_date', 'due_date', 'status', 'notes', 'bill_copy',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'issue_date' => 'datetime',
        'due_date' => 'datetime',
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

    public function receivePayments()
    {
        return $this->hasMany(ReceivePayment::class);
    }

    public function calculateTotal()
    {
        $items = $this->items ?: $this->items()->get();
        $this->total_amount = $items->sum('subtotal');
        $this->save();
    }

    public function updatePaymentStatus()
{
    $totalReceived = $this->receivePayments()->sum('amount');
    if ($totalReceived >= $this->total_amount && $this->total_amount > 0) {
        $this->status = 'completed';
    } elseif ($totalReceived > 0) {
        $this->status = 'partially_paid';
    } else {
        $this->status = 'pending';
    }
    $this->save();
}
}