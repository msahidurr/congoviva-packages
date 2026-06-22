<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\File;
use App\Models\Addon;

class SetLocaleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Determine the locale
        $locale = $this->determineLocale($request);
        
        // Set the application locale
        App::setLocale($locale);
        
        // Load workdo package translations
        $this->loadWorkdoTranslations($locale);
        
        return $next($request);
    }
    
    /**
     * Determine the appropriate locale for the request
     */
    private function determineLocale(Request $request): string
    {
        // Check for locale in cookie first
        $cookieLocale = Cookie::get('app_language');
        if ($cookieLocale && $this->isValidLocale($cookieLocale)) {
            return $cookieLocale;
        }
        
        // Check authenticated user's language preference
        if (auth()->check() && auth()->user()->lang) {
            $userLocale = auth()->user()->lang;
            if ($this->isValidLocale($userLocale)) {
                return $userLocale;
            }
        }
        
        // For auth pages, use superadmin's language
        if ($request->is('login', 'register', 'password/*', 'email/*')) {
            $superAdmin = \App\Models\User::where('type', 'superadmin')->first();
            if ($superAdmin && $superAdmin->lang && $this->isValidLocale($superAdmin->lang)) {
                return $superAdmin->lang;
            }
        }
        
        // Default to English
        return 'en';
    }
    
    /**
     * Check if a locale is valid (has translation file)
     */
    private function isValidLocale(string $locale): bool
    {
        return File::exists(resource_path("lang/{$locale}.json"));
    }
    
    /**
     * Load workdo package translations into Laravel's translation system
     */
    private function loadWorkdoTranslations(string $locale): void
    {
        // Skip database queries during installation
        if (!file_exists(storage_path('installed'))) {
            return;
        }
        
        try {
            $enabledPackages = Addon::where('is_enabled', true)->pluck('package_name');
            
            foreach ($enabledPackages as $packageName) {
                $packageLangPath = base_path("packages/workdo/{$packageName}/src/resources/lang");
                $packageLangFile = "{$packageLangPath}/{$locale}.json";
                
                if (File::exists($packageLangFile)) {
                    // Add the language path to Laravel's translator
                    app('translator')->addJsonPath($packageLangPath);
                }
            }
        } catch (\Exception $e) {
            // Silently handle database connection issues during installation
            return;
        }
    }
}