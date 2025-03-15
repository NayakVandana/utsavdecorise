<?php
namespace App\Providers;

use App\Models\UserToken;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;

class CustomTokenGuard implements Guard
{
    use GuardHelpers;

    protected $request;
    protected $user;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function check()
    {
        return !is_null($this->user());
    }

    public function guest()
    {
        return !$this->check();
    }

    public function user()
    {
        if ($this->user) {
            return $this->user;
        }

        $token = $this->request->bearerToken();
        if (!$token) {
            return null;
        }

        $userToken = UserToken::where(function ($q) use ($token) {
            $q->where('web_access_token', $token)
              ->orWhere('app_access_token', $token);
        })->first();

        if ($userToken) {
            $this->user = $userToken->user;
        }

        return $this->user;
    }

    public function id()
    {
        return $this->user() ? $this->user()->getAuthIdentifier() : null;
    }

    public function validate(array $credentials = [])
    {
        return false; // Not used for token-based auth
    }

    public function setUser($user)
    {
        $this->user = $user;
        return $this;
    }
}