<?php

use Illuminate\Support\Facades\Route;
use Workdo\Menu\Http\Controllers\MenuController;

Route::middleware(['web', 'auth', 'verified', 'plan.access'])->group(function () {
    Route::get('/menu', [MenuController::class, 'index'])
        ->middleware('permission:manage-menu')
        ->name('menu.index');

    Route::get('/menu/marketplace/settings', [MenuController::class, 'marketplaceSettings'])
        ->middleware('permission:manage-menu')
        ->name('menu.marketplace.settings');

    Route::post('/menu/marketplace/settings', [MenuController::class, 'updateMarketplaceSettings'])
        ->middleware('permission:manage-menu')
        ->name('menu.marketplace.settings.update');

    Route::get('/create/menu', [MenuController::class, 'create'])
        ->middleware('permission:create-menu')
        ->name('menu.create');
    
    Route::post('/menu', [MenuController::class, 'store'])
        ->middleware('permission:create-menu')
        ->name('menu.store');
    
    Route::get('/menu/{id}/edit', [MenuController::class, 'edit'])
        ->middleware('permission:edit-menu')
        ->name('menu.edit');
    
    Route::put('/menu/{id}', [MenuController::class, 'update'])
        ->middleware('permission:edit-menu')
        ->name('menu.update');
    
    Route::delete('/menu/{id}', [MenuController::class, 'destroy'])
        ->middleware('permission:delete-menu')
        ->name('menu.destroy');
    
    Route::get('/menu/{id}/analytics', [MenuController::class, 'analytics'])
        ->middleware('permission:analytics-menu')
        ->name('menu.analytics');

    Route::get('/menu/templates', [MenuController::class, 'templates'])
        ->middleware('permission:manage-menu')
        ->name('menu.templates');
});

// Public route for Menu QR Code view
Route::get('/menu-qr/{slug}', [MenuController::class, 'show'])
    ->middleware('web')
    ->name('menu.show');

Route::get('/menu/preview', [MenuController::class, 'preview'])
    ->name('menu.preview');

Route::get('/menu/marketplace', [MenuController::class, 'marketplace'])
    ->middleware('web')
    ->name('menu.marketplace');