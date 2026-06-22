<?php
namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use App\Models\Currency;
use App\Models\ReferralSetting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        
        // Get available languages - force fresh load
        $languageFile = resource_path('lang/language.json');
        $availableLanguages = [];
        if (file_exists($languageFile)) {
            $languages = json_decode(file_get_contents($languageFile), true) ?? [];
            $availableLanguages = array_values(array_filter($languages, function($language) {
                return !isset($language['enabled']) || $language['enabled'] !== false;
            }));
        }
        
        // Skip database queries during installation
        if ($request->is('install/*') || $request->is('update/*') || !file_exists(storage_path('installed'))) {
            $globalSettings = [
                'currencySymbol' => '$',
                'currencyNname' => 'US Dollar',
                'base_url' => config('app.url'),
                'image_url' => getImageUrlPrefix(),
            ];
        } else {
            // Get system settings - for company users, get their own settings if available
            $userId = null;
            if ($request->user()) {
                if ($request->user()->type === 'company') {
                    $userId = $request->user()->id;
                } elseif (!in_array($request->user()->type, ['superadmin', 'company'])) {
                    $userId = $request->user()->created_by;
                }
            }
            
            $settings = settings($userId);
            
            // Get currency symbol
            $currencyCode = $settings['defaultCurrency'] ?? 'USD';
            $currency = Currency::where('code', $currencyCode)->first();
            $currencySettings = [];
            if ($currency) {
                $currencySettings = [
                    'currencySymbol' => $currency->symbol, 
                    'currencyNname' => $currency->name
                ];
            } else {
                $currencySettings = [
                    'currencySymbol' =>  '$', 
                    'currencyNname' =>'US Dollar'
                ];
            }
            
            // Merge currency settings with other settings
            $globalSettings = array_merge($settings, $currencySettings);
            $globalSettings['base_url'] = config('app.url');
            $globalSettings['image_url'] = getImageUrlPrefix();
            
            // Convert brand asset paths to full URLs based on current storage type
            $imagePrefix = getImageUrlPrefix();
            $storageType = getSetting('storage_type', 'local');
            
            if (isset($globalSettings['logoDark']) && $globalSettings['logoDark']) {
                $globalSettings['logoDark'] = getAssetUrl($globalSettings['logoDark']);
            }
            if (isset($globalSettings['logoLight']) && $globalSettings['logoLight']) {
                $globalSettings['logoLight'] = getAssetUrl($globalSettings['logoLight']);
            }
            if (isset($globalSettings['favicon']) && $globalSettings['favicon']) {
                $globalSettings['favicon'] = getAssetUrl($globalSettings['favicon']);
            }
            
            // Filter out sensitive keys before sharing with frontend
            $globalSettings = $this->filterSensitiveSettings($globalSettings);
        }
        
        return [
            ...parent::share($request),
            'name'  => config('app.name'),
            'base_url'  => config('app.url'),
            'image_url'  => getImageUrlPrefix(),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'csrf_token' => csrf_token(),
            'auth'  => function() use ($request) {
                $user = $request->user() ? $request->user()->load('businesses', 'plan') : null;
                
                // Append avatar_url to user data if user exists
                if ($user) {
                    $user->append('avatar_url');
                }
                
                // Check if demo mode is enabled and there's a demo business cookie
                if ($user && config('app.is_demo') && $request->cookie('demo_business_id')) {
                    $businessId = (int) $request->cookie('demo_business_id');
                    
                    // Verify the business belongs to the user
                    $businessExists = $user->businesses->contains('id', $businessId);
                    
                    if ($businessExists) {
                        // Override the current_business with the one from the cookie
                        $user->current_business = $businessId;
                        
                        // Reload businesses to ensure we have the most up-to-date data
                        $user->load('businesses');
                    }
                }

                if ($user && !in_array($user->type, ['company', 'superadmin']) ) {
                    $user->plan = $user->creator->plan;
                }
                
                // Get enabled addons based on user's plan
                $enabledAddons = [];
                if ($user) {
                    if ($user->type === 'superadmin') {
                        // Super admin gets all enabled addons
                        $enabledAddons = \App\Models\Addon::where('is_enabled', true)
                            ->select('name', 'package_name')
                            ->get()
                            ->toArray();
                    } else {
                        // Company users only get addons from their plan
                        $userPlan = $user->plan;
                        if ($userPlan && !empty($userPlan->getAllowedAddons())) {
                            $allowedPackageNames = $userPlan->getAllowedAddons();
                            $enabledAddons = \App\Models\Addon::whereIn('package_name', $allowedPackageNames)
                                ->where('is_enabled', true)
                                ->select('name', 'package_name')
                                ->get()
                                ->toArray();
                        }
                    }
                }
                $locale = $user->lang ?? $this->getSuperAdminLang();
                
                // Get user settings including NFC Card visibility
                $userSettings = [];
                if ($user) {
                    $userSettings = \App\Models\Setting::getUserSettings($user->id);
                }
                
                return [
                    'user'        => $user,
                    'roles'       => $request->user()?->roles->pluck('name'),
                    'permissions' => $request->user()?->getAllPermissions()->pluck('name'),
                    'enabledAddons' => $enabledAddons,
                    'lang' => $locale,
                    'settings' => $userSettings
                ];
            },
            'isImpersonating' => session('impersonated_by') ? true : false,
            'ziggy' => fn(): array=> [
                 ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'globalSettings' => $globalSettings,
            'referralSettings' => [
                'is_enabled' => !$request->is('install/*') && !$request->is('update/*') && file_exists(storage_path('installed')) ? ReferralSetting::isEnabled() : false,
            ],
            'nfcCardSettings' => [
                'is_enabled' => !$request->is('install/*') && !$request->is('update/*') && file_exists(storage_path('installed')) ? 
                    (Setting::where('key', 'nfc_cards_enabled')->where('user_id', 1)->value('value') === '1') : true,
            ],
            'campaignSettings' => [
                'is_enabled' => !$request->is('install/*') && !$request->is('update/*') && file_exists(storage_path('installed')) ? 
                    (Setting::where('key', 'campaigns_enabled')->where('user_id', 1)->value('value') === '1') : true,
            ],
            'directoryGlobalSettings' => [
                'is_enabled' => !$request->is('install/*') && !$request->is('update/*') && file_exists(storage_path('installed')) ? 
                    (Setting::where('key', 'business_directory_enabled')->where('user_id', 1)->value('value') === '1') : true,
            ],
            'googleWalletGlobalSettings' => [
                'is_enabled' => !$request->is('install/*') && !$request->is('update/*') && file_exists(storage_path('installed')) ? 
                    (Setting::where('key', 'googleWalletEnabled')->where('user_id', $request->user()?->id ?: 1)->value('value') ?? '1') === '1' : true,
            ],
            'availableLanguages' => $availableLanguages,
            'is_demo' => env('IS_DEMO', false)
        ];
    }
    
    /**
     * Filter out sensitive configuration keys that should not be shared with frontend
     *
     * @param array $settings
     * @return array
     */
    private function filterSensitiveSettings(array $settings): array
    {
        $sensitiveKeys = config('sensitive-keys');
        
        return array_diff_key($settings, array_flip($sensitiveKeys));
    }

    /**
     * Get superadmin language if user lang is not set
     */
    private function getSuperAdminLang(): string
    {
        $superAdmin = \App\Models\User::whereHas('roles', function($query) {
            $query->whereIn('name', ['superadmin', 'super admin']);
        })->first();
        
        return $superAdmin ? $superAdmin->lang ?? 'en' : 'en';
    }


}