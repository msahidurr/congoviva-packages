<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LinkBioController;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'plan.access'])->group(function () {
    // Bio Link Builder routes
    Route::get('/link-bio-builders', [LinkBioController::class, 'index'])->middleware('permission:manage-bio-link-builder')->name('link-bio-builder.index');
    Route::get('/link-bio-builder/create', [LinkBioController::class, 'create'])->middleware('permission:create-bio-link-builder')->name('link-bio-builder.create');
    Route::post('/link-bio-builder', [LinkBioController::class, 'store'])->middleware('permission:create-bio-link-builder')->name('bio-link.store');
    Route::get('/link-bio-builder/edit/{bioLink}', [LinkBioController::class, 'edit'])->middleware('permission:edit-bio-link-builder')->name('link-bio-builder.edit');
    Route::put('/link-bio-builder/{bioLink}', [LinkBioController::class, 'update'])->middleware('permission:edit-bio-link-builder')->name('bio-link.update');
    Route::delete('/link-bio-builder/{bioLink}', [LinkBioController::class, 'destroy'])->middleware('permission:delete-bio-link-builder')->name('bio-link.destroy');
    Route::get('/link-bio-builder/{bioLink}/analytics', [LinkBioController::class, 'analytics'])->middleware('permission:manage-bio-link-builder')->name('link-bio-builder.analytics');
    
    // API routes for bio link builder
    Route::post('/bio-link/generate-slug', [LinkBioController::class, 'generateSlug'])->name('bio-link.generate-slug');
    Route::post('/bio-link/check-slug', [LinkBioController::class, 'checkSlug'])->name('bio-link.check-slug');
    Route::post('/bio-link/check-domain', [LinkBioController::class, 'checkDomain'])->name('bio-link.check-domain');
});

// Public bio link routes
Route::get('/bio-link/preview', [LinkBioController::class, 'preview'])->name('bio-link.preview');