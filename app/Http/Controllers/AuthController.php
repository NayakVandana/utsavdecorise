<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:8',
            'login_type' => 'required|in:web,app',
            'device_token' => 'required_if:login_type,app',
            'device_type' => 'required_if:login_type,app',
            'is_admin' => 'sometimes|in:0,1,2' // Allow 0, 1, 2
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_admin' => $request->input('is_admin', 0) // Default to 0 if not provided
        ]);

        $token = $request->login_type == 'web'
            ? $user->createWebToken()
            : $user->createAppToken($request->device_token, $request->device_type);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => (int)$user->is_admin // Ensure integer type
            ]
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'login_type' => 'required|in:web,app',
            'device_token' => 'required_if:login_type,app',
            'device_type' => 'required_if:login_type,app',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }

        $token = $request->login_type == 'web'
            ? $user->createWebToken()
            : $user->createAppToken($request->device_token, $request->device_type);

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user
        ], 200);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        \App\Models\UserToken::where(function ($q) use ($token) {
            $q->where('web_access_token', $token)
              ->orWhere('app_access_token', $token);
        })->delete();

        return response()->json(['success' => true, 'message' => 'Logged out'], 200);
    }
}