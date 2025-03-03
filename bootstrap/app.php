<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',        // Web routes
        api: __DIR__ . '/../routes/api.php',        // API routes (added)
        commands: __DIR__ . '/../routes/console.php', // Console commands
        health: '/up',                              // Health check endpoint
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Define middleware here if needed
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Define exception handling here if needed
    })->create();