<?php

use Illuminate\Support\Facades\Route;
use Workdo\Event\Http\Controllers\EventController;
use Workdo\Event\Http\Controllers\GuestCheckInController;

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
    
    Route::post('/event-qr-code/{id}/duplicate', [EventController::class, 'duplicate'])
        ->middleware('permission:create-event')
        ->name('event-qr-code.duplicate');
    
    Route::get('/event-qr-code/{id}/analytics', [EventController::class, 'analytics'])
        ->middleware('permission:analytics-event')
        ->name('event-qr-code.analytics');

    Route::get('/event-qr-code/templates', [EventController::class, 'templates'])
        ->middleware('permission:manage-event')
        ->name('event-qr-code.templates');

    // Guest Arrivals Admin API Routes
    Route::get('/api/events/{id}/guest-arrivals', [GuestCheckInController::class, 'getGuestArrivals'])
        ->middleware('permission:view-event')
        ->name('guest-arrivals.index');

    Route::post('/api/events/{id}/guest-arrivals/mark-arrived', [GuestCheckInController::class, 'markArrivedAdmin'])
        ->middleware('permission:edit-event')
        ->name('guest-arrivals.mark-arrived');

    Route::post('/api/events/{id}/guest-arrivals/mark-not-arrived', [GuestCheckInController::class, 'markNotArrivedAdmin'])
        ->middleware('permission:edit-event')
        ->name('guest-arrivals.mark-not-arrived');
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

// Public Guest Check-In Routes
Route::get('/event/{slug}/check-in', [GuestCheckInController::class, 'showCheckInPage'])
    ->middleware('web')
    ->name('guest-check-in.show');

Route::post('/event/{slug}/check-in', [GuestCheckInController::class, 'checkIn'])
    ->middleware('web')
    ->name('guest-check-in.store');

Route::post('/event/{slug}/check-in/undo', [GuestCheckInController::class, 'undoCheckIn'])
    ->middleware('web')
    ->name('guest-check-in.undo');
