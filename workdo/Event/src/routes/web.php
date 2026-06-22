<?php

use Illuminate\Support\Facades\Route;
use Workdo\Event\Http\Controllers\EventController;

Route::middleware(['web', 'auth', 'verified', 'plan.access'])->group(function () {
    Route::get('/event-qr-code', [EventController::class, 'index'])
        ->middleware('permission:manage-event')
        ->name('event-qr-code.index');

    Route::get('/event-qr-code/marketplace/settings', [EventController::class, 'marketplaceSettings'])
        ->middleware('permission:manage-event')
        ->name('event.marketplace.settings');

    Route::post('/event-qr-code/marketplace/settings', [EventController::class, 'updateMarketplaceSettings'])
        ->middleware('permission:manage-event')
        ->name('event.marketplace.settings.update');

    Route::get('/create/event-qr-code', [EventController::class, 'create'])
        ->middleware('permission:create-event')
        ->name('event-qr-code.create');
    
    Route::post('/event-qr-code', [EventController::class, 'store'])
        ->middleware('permission:create-event')
        ->name('event-qr-code.store');
    
    Route::get('/event-qr-code/{id}/edit', [EventController::class, 'edit'])
        ->middleware('permission:edit-event')
        ->name('event-qr-code.edit');
    
    Route::put('/event-qr-code/{id}', [EventController::class, 'update'])
        ->middleware('permission:edit-event')
        ->name('event-qr-code.update');
    
    Route::delete('/event-qr-code/{id}', [EventController::class, 'destroy'])
        ->middleware('permission:delete-event')
        ->name('event-qr-code.destroy');
    
    Route::get('/event-qr-code/{id}/analytics', [EventController::class, 'analytics'])
        ->middleware('permission:analytics-event')
        ->name('event-qr-code.analytics');

    Route::get('/event-qr-code/templates', [EventController::class, 'templates'])
        ->middleware('permission:manage-event')
        ->name('event-qr-code.templates');
});

// Public route for Event QR Code view
Route::get('/event-qr/{slug}', [EventController::class, 'show'])
    ->middleware('web')
    ->name('event-qr-code.show');

Route::get('/event-qr-code/preview', [EventController::class, 'preview'])
    ->name('event-qr.preview');

Route::get('/event/marketplace', [EventController::class, 'marketplace'])
    ->middleware('web')
    ->name('event.marketplace');