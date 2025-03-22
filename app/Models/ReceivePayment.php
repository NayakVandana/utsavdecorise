<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReceivePayment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'bill_id', 'amount', 'payment_type', 'mode_of_payment', 'payment_date', 'status', 'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'datetime',
    ];

    protected $dates = ['deleted_at'];

    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}