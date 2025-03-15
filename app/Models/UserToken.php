<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserToken extends Model
{
    protected $fillable = [
        'user_id', 'web_access_token', 'app_access_token', 
        'device_token', 'device_type'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
}