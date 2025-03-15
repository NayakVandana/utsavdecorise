<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/inquiry', [InquiryController::class, 'store']);

// Protected routes with custom middleware
Route::middleware(\App\Http\Middleware\VerifyToken::class)->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/inquiries', [InquiryController::class, 'index']);
    Route::get('/admin/users', [AdminController::class, 'getUsers']);

    
});