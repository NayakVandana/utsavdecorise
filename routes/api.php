<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GalleryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BillController;
use App\Http\Controllers\BillTemplateController;
use App\Http\Controllers\TermsConditionController;

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
    Route::post('/bill-templates/clone/{id}', [BillTemplateController::class, 'clone']);
//     Route::apiResource('bills', BillController::class);
// Route::apiResource('bill-templates', BillTemplateController::class);
Route::apiResource('terms-conditions', TermsConditionController::class);


Route::post('/bills/{billId}/payments', [BillController::class, 'addPayment']);
    Route::get('/bills/{billId}/payments', [BillController::class, 'getPayments']); // New: List payments
    Route::get('/bills/{billId}/payment-statement', [BillController::class, 'downloadPaymentStatement']); // New: PDF statement
    Route::get('/all-payments', [BillController::class, 'allPayments']); // New: Al
});