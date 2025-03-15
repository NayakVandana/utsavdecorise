<?php
namespace App\Helper;

use App\Models\UserToken;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

trait UserTokenTraits
{
    function createWebToken()
{
    $token = hash('sha256', Str::random(60));
    $result = UserToken::updateOrCreate(
        ['user_id' => $this->id],
        ['web_access_token' => $token]
    );
    Log::info('Created web token', ['user_id' => $this->id, 'token' => $token]);
    return $token;
}

    function createAppToken($device_token, $device_type)
    {
        $app_token = hash('sha256', Str::random(60));
        $existDeviceToken = UserToken::where('device_token', $device_token)->first();

        if ($existDeviceToken) {
            $existDeviceToken->update([
                'device_token' => '',
                'device_type' => '',
                'app_access_token' => ''
            ]);
        }

        $token = UserToken::firstOrCreate(
            ['user_id' => $this->id],
            [
                'device_type' => strtoupper($device_type),
                'device_token' => $device_token,
                'app_access_token' => $app_token
            ]
        );
        return $app_token;
    }
}