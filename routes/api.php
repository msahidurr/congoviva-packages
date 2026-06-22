<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\AppointmentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->middleware('auth:sanctum');
    Route::post('/profile', [AuthController::class, 'editProfile'])->middleware('auth:sanctum');
    Route::put('/profile', [AuthController::class, 'editProfile'])->middleware('auth:sanctum');
    
    // Business routes
    Route::get('/businesses', [BusinessController::class, 'index'])->middleware('auth:sanctum');
    
    // Appointment routes
    Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum');
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy'])->middleware('auth:sanctum');
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus'])->middleware('auth:sanctum');
});
