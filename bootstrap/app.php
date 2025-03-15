<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',   
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Define route middleware aliases
        $middleware->alias([
            'auth:api' => \App\Http\Middleware\VerifyToken::class, // Optional: Keep for compatibility
            'verify.token' => \App\Http\Middleware\VerifyToken::class, //
        ]);

        // Define middleware groups
        $middleware->group('api', [
            // \App\Http\Middleware\VerifyToken::class, // Add API middleware
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
