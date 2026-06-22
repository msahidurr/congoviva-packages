<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use App\Services\DynamicStorageService;
use App\Services\StorageConfigService;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => [__('The provided credentials are incorrect.')],
            ]);
        }

        if (!$user->is_enable_login) {
            return apiError(__('Your account has been disabled.'), null, 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return apiSuccess(__('Login successful'), [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'type' => $user->type,
                'avatar' => $user->avatar,
                'avatarUrl' => $user->avatar ? (StorageConfigService::getActiveDisk() === 'public' ? request()->getSchemeAndHttpHost() . '/storage/' . $user->avatar : \Storage::disk(StorageConfigService::getActiveDisk())->url($user->avatar)) : request()->getSchemeAndHttpHost() . '/storage/images/avatar/avatar.png',
            ],
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return apiSuccess(__('Logged out successfully'));
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => [__('Current password is incorrect.')],
            ]);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return apiSuccess(__('Password changed successfully'));
    }

    public function editProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();
        $updateData = $request->only(['name', 'email']);
        
        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Clear cache and configure storage
            StorageConfigService::clearCache();
            DynamicStorageService::configureDynamicDisks();
            
            $diskName = StorageConfigService::getActiveDisk();
            
            // Delete old avatar if exists
            if ($user->avatar) {
                \Storage::disk($diskName)->delete($user->avatar);
            }
            
            // Store new avatar
            $fileName = time() . '_' . $request->file('avatar')->getClientOriginalName();
            $avatarPath = 'avatars/' . $fileName;
            
            \Storage::disk($diskName)->put($avatarPath, file_get_contents($request->file('avatar')));
            
            $updateData['avatar'] = $avatarPath;
        }
        
        $user->update($updateData);

        return apiSuccess(__('Profile updated successfully'), [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'type' => $user->type,
                'avatar' => $user->avatar,
                'avatarUrl' => $user->avatar ? (StorageConfigService::getActiveDisk() === 'public' ? request()->getSchemeAndHttpHost() . '/storage/' . $user->avatar : \Storage::disk(StorageConfigService::getActiveDisk())->url($user->avatar)) : request()->getSchemeAndHttpHost() . '/storage/images/avatar/avatar.png',
            ]
        ]);
    }
}