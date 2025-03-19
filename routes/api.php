<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GalleryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BillController;
use App\Http\Controllers\BillTemplateController;
// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/inquiry', [InquiryController::class, 'store']);

// Guest gallery route
Route::get('/gallery', [GalleryController::class, 'index']);

// Protected routes
Route::middleware(\App\Http\Middleware\VerifyToken::class)->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/inquiries', [InquiryController::class, 'index']);
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::post('/admin/photos', [GalleryController::class, 'store']); // Admin upload
    Route::apiResource('bills', BillController::class);
    Route::get('bills/{id}/pdf', [BillController::class, 'downloadPdf'])->name('bills.pdf');
    Route::apiResource('bill-templates', BillTemplateController::class);
});