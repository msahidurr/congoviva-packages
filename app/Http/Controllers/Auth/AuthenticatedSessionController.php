<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Business;
use App\Models\BioLink;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        $demoBusinesses = $demoBioLinks = [];
    
        if (config('app.is_demo')) {
            // Get the company user
            $companyUser = User::where('email', 'company@example.com')->first();
            
            if ($companyUser) {
                // Get up to 20 businesses for this user
                $demoBusinesses = Business::where('created_by', $companyUser->id)
                    ->select('id', 'name', 'slug', 'business_type')
                    ->get();

                $demoBioLinks = BioLink::where('created_by', $companyUser->id)
                    ->select('id', 'name', 'slug', 'link_type')
                    ->get();
            }
        }
        
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
            'settings' => settings(),
            'demoBusinesses' => $demoBusinesses,
            'demoBioLinks' => $demoBioLinks,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();
        
        $user = $request->user();

        // Check if email verification is enabled and user is not verified
        $emailVerificationEnabled = getSetting('emailVerification', false);
        if ($emailVerificationEnabled && !$user->hasVerifiedEmail()) {
            return redirect()->route('verification.notice');
        }
        
        // Get user permissions and store in session
        $permissions = PermissionService::getUserPermissions($user);
        $request->session()->put('user_permissions', $permissions);
        
        // Check if user has dashboard access permission (skip for superadmin)
        if ($user->type !== 'superadmin' && !PermissionService::hasPermission('manage-dashboard', $user)) {
            // Instead of logging out, redirect to first available page
            return redirect()->route('dashboard.redirect');
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
