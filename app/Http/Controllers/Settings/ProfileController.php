<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Services\DynamicStorageService;
use App\Services\StorageConfigService;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // Remove _method from validated data if present
        unset($validated['_method']);
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            \Log::info('Avatar file detected', ['file' => $request->file('avatar')->getClientOriginalName()]);
            
            // Clear cache and configure storage
            StorageConfigService::clearCache();
            DynamicStorageService::configureDynamicDisks();
            
            $diskName = StorageConfigService::getActiveDisk();
            \Log::info('Using storage disk', ['disk' => $diskName]);
            
            // Delete old avatar if exists
            if ($request->user()->avatar) {
                \Storage::disk($diskName)->delete($request->user()->avatar);
            }
            
            // Store new avatar
            $fileName = time() . '_' . $request->file('avatar')->getClientOriginalName();
            $avatarPath = 'avatars/' . $fileName;
            
            \Storage::disk($diskName)->put($avatarPath, file_get_contents($request->file('avatar')));
            \Log::info('Avatar uploaded', ['path' => $avatarPath, 'disk' => $diskName]);
            $validated['avatar'] = $avatarPath;
        }
        
        $user = $request->user();
        
        unset($validated['email_verified_at']);
        
        $user->fill($validated);
        $user->save();

        return to_route('profile');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
