<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Helper\UserTokenTraits;

class User extends Authenticatable
{
    use UserTokenTraits;

    protected $fillable = [
        'name', 'email', 'password', 'is_admin'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function userToken()
    {
        return $this->hasOne(UserToken::class);
    }
}