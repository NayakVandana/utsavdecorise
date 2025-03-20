<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TermsCondition extends Model
{
    use SoftDeletes;

    protected $fillable = ['content'];

    public function bills()
    {
        return $this->belongsToMany(Bill::class, 'bill_terms_conditions');
    }

    public function billTemplates()
    {
        return $this->belongsToMany(BillTemplate::class, 'bill_template_terms_conditions');
    }
}