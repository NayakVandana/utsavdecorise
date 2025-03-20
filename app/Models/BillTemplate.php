<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BillTemplate extends Model
{
    use SoftDeletes;

    protected $table = 'bill_templates';

    protected $fillable = [
        'template_name', 'name', 'email', 'mobile', 'address',
        'invoice_number', 'issue_date', 'due_date', 'status',
        'items', 'notes',
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
        return $this->hasMany(BillItem::class, 'bill_id');
    }

    public function termsConditions()
    {
        return $this->belongsToMany(TermsCondition::class, 'bill_template_terms_conditions');
    }

    
}