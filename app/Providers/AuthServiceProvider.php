<?php
namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use App\Providers\CustomTokenGuard;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [];

    public function boot()
    {
        $this->registerPolicies();

        Auth::extend('custom-token', function ($app, $name, array $config) {
            return new CustomTokenGuard($app->make('request'));
        });
    }
}