<?php
namespace App\Http\Middleware;

use App\Models\UserToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
class VerifyToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['success' => false, 'message' => 'No token provided'], 401);
        }

        $userToken = UserToken::where(function ($q) use ($token) {
            $q->where('web_access_token', $token)
              ->orWhere('app_access_token', $token);
        })->first();

        if (!$userToken || !$userToken->user) {
            return response()->json(['success' => false, 'message' => 'Invalid token'], 401);
        }

        Auth::login($userToken->user); // Log in the user for the request
        return $next($request);
    }
}
