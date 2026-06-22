<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use App\Models\Setting;
use App\Models\User;
use App\Models\Addon;

class TranslationController extends BaseController
{
    public function getTranslations($locale)
    {
        $path = resource_path("lang/{$locale}.json");
        
        if (!File::exists($path)) {
            $path = resource_path("lang/en.json");
            $locale = 'en';
        }
        
        $layoutDirection = in_array($locale, ['ar', 'he']) ? 'rtl' : 'ltr';
        
        // Always store language preference in cookie for persistence
        Cookie::queue('app_language', $locale, 60 * 24 * 30); // 30 days
        Cookie::queue('app_direction', $layoutDirection, 60 * 24 * 30);
        
        // Demo mode handling
        if (config('app.is_demo') !== true) {
            if (auth()->check()) {
                // Update authenticated user's language and direction settings
                auth()->user()->update(['lang' => $locale]);
                
                Setting::updateOrCreate(
                    [
                        'key' => 'layoutDirection',
                        'user_id' => auth()->id()
                    ],
                    [
                        'value' => $layoutDirection
                    ]
                );
            } else {
                // For unauthenticated users on auth pages, use superadmin's language
                $superAdmin = User::where('type', 'superadmin')->first();
                if ($superAdmin && request()->is('login', 'register', 'password/*', 'email/*')) {
                    $locale = $superAdmin->lang ?? 'en';
                    $path = resource_path("lang/{$locale}.json");
                    
                    if (!File::exists($path)) {
                        $path = resource_path("lang/en.json");
                        $locale = 'en';
                    }
                    
                    $layoutDirection = in_array($locale, ['ar', 'he']) ? 'rtl' : 'ltr';
                }
            }
        }

        $translations = json_decode(File::get($path), true) ?? [];
        // Set Laravel app locale
        app()->setLocale($locale);
        
        // Merge enabled addon translations
        $enabledPackages = Addon::where('is_enabled', true)->pluck('package_name');
        foreach ($enabledPackages as $packageName) {
            $packageLangFile = base_path("packages/workdo/{$packageName}/src/resources/lang/{$locale}.json");

            if (File::exists($packageLangFile)) {
                $packageTranslations = json_decode(File::get($packageLangFile), true) ?? [];
                $translations = array_merge($translations, $packageTranslations);

            }
        }
        return response()->json([
            'translations' => $translations,
            'layoutDirection' => $layoutDirection,
            'locale' => $locale
        ]);
    }
    
    public function getInitialLocale()
    {
        $cookieLang = Cookie::get('app_language');
        if ($cookieLang) {
            return $cookieLang;
        }
        
        if (auth()->check()) {
            return auth()->user()->lang ?? 'en';
        } else if (request()->is('login', 'register', 'password/*', 'email/*')) {
            $superAdmin = User::where('type', 'superadmin')->first();
            return $superAdmin->lang ?? 'en';
        }
        
        return 'en';
    }
} 