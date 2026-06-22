<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\BioLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;

class PublicVCardController extends Controller
{
    public function show(Request $request, $prefix, $slug)
    {
        // First check if this is a biolink URL
        $bioLink = BioLink::where('slug', $slug)
            ->where('url_prefix', $prefix)
            ->where('is_active', true)
            ->first();
            
        if ($bioLink) {
            // Use the current URL instead of redirecting to the standard bio route
            return $this->handlePasswordProtectionForBio($request,  $bioLink);
        }
        
        // If not a biolink, find business by slug and url_prefix for slug type
        $business = Business::with('user.plan')
            ->where('slug', $slug)
            ->where('url_prefix', $prefix)
            ->where('domain_type', 'slug')
            ->first();
        
        if (!$business) {
            return Inertia::render('public/VCardNotFound');
        }
        
        return $this->handlePasswordProtection($request, $business);
    }
    
    public function showDirect(Request $request, $slug=null)
    {
        $host = $request->getHost();
        $business = null;
        
        // First check if this is a biolink URL with direct slug
        $bioLink = BioLink::where('slug', $slug)
            ->where('is_active', true)
            ->first();
            
        if ($bioLink) {
            // Use the current URL instead of redirecting to the standard bio route
            return $this->handlePasswordProtectionForBio($request,  $bioLink);
        }
        
        // Check if it's a subdomain request
        $hostParts = explode('.', $host);
        if (count($hostParts) >= 2 && $hostParts[0] !== 'www') {
            $subdomain = $hostParts[0];
            
            // Check for biolink with subdomain
            $bioLink = BioLink::where('slug', $subdomain)
                ->where('is_active', true)
                ->first();
                
            if ($bioLink) {
                // Use the current URL instead of redirecting to the standard bio route
                return $this->handlePasswordProtectionForBio($request,  $bioLink);
            }
            
            // Check for business with subdomain
            $business = Business::with('user.plan')
                ->where('slug', $subdomain)
                ->where('domain_type', 'subdomain')
                ->first();
        }
        
        // If not subdomain, try custom domain
        if (!$business) {
            // Check for biolink with custom domain
            $bioLink = BioLink::where('custom_domain', $host)
                ->where('link_type', 'domain')
                ->where('is_active', true)
                ->first();
                
            if ($bioLink) {
                // Use the current URL instead of redirecting to the standard bio route
                return $this->handlePasswordProtectionForBio($request,  $bioLink);
            }
            
            // Check for business with custom domain
            $business = Business::with('user.plan')
                ->where('custom_domain', $host)
                ->where('domain_type', 'domain')
                ->first();
        }
        
        // If not found by domain/subdomain, find by slug
        if (!$business) {
            $business = Business::with('user.plan')
                ->where('slug', $slug)
                ->where('domain_type', 'slug')
                ->where(function($query) {
                    $query->whereNull('url_prefix')
                        ->orWhere('url_prefix', '')
                        ->orWhere('url_prefix', 'v');
                })
                ->first();
        }
        
        if (!$business) {
            return Inertia::render('public/VCardNotFound');
        }
        
        return $this->handlePasswordProtection($request, $business);
    }
    
    public function handlePasswordProtection(Request $request, Business $business)
    {
        // Check if password protection is enabled
        if ($business->password_enabled && $business->password) {
            // Check if password is already verified in session
            $sessionKey = 'vcard_password_verified_' . $business->id;
            
            if (!session($sessionKey)) {
                // If password is submitted, verify it
                if ($request->isMethod('post') && $request->has('password')) {
                    if (Hash::check($request->password, $business->password)) {
                        session([$sessionKey => true]);
                        return redirect($request->url());
                    } else {
                        return Inertia::render('public/VCardPasswordPrompt', [
                            'business' => $business->only(['id', 'name']),
                            'error' => __('Invalid password. Please try again.')
                        ]);
                    }
                }
                
                // Show password prompt
                return Inertia::render('public/VCardPasswordPrompt', [
                    'business' => $business->only(['id', 'name'])
                ]);
            }
        }
        
        // Track visit with business_id
        $visit = \Shetabit\Visitor\Facade\Visitor::visit($business);
        \DB::table('shetabit_visits')->where('id', $visit->id)->update(['business_id' => $business->id]);
        $business->increment('view_count');
        
        // Get business owner's plan features BEFORE sanitizing
        $planFeatures = null;
        $allowedSections = [];
        if ($business->user && $business->user->plan) {
            $planFeatures = $business->user->plan->features ?? [];
            $allowedSections = $planFeatures['business_template_sections'] ?? [];
        }
        
        // Convert relative media paths to full URLs for display
        $business = $this->convertRelativePathsToUrls($business);
        
        // Sanitize business data to prevent Symbol serialization errors
        $business = $this->sanitizeSymbols($business->toArray());
        
        // Extract SEO data for meta tags
        $seoData = $this->extractSeoData($business);
        
        // Show the vCard
        $slug = $business['slug'] ?? '';
        $urlPrefix = $business['url_prefix'] ?? '';
        $businessId = $business['id'];

        if ($urlPrefix) {
            $manifestUrl = route('public.vcard.manifest', ['prefix' => $urlPrefix, 'slug' => $slug]) . '?business=' . $businessId;
        } else {
            $manifestUrl = route('public.vcard.manifest.direct', ['slug' => $slug]) . '?business=' . $businessId;
        }
        return Inertia::render('public/VCardView', [
            'business' => $business,
            'pwa_enabled' => $business['config_sections']['pwa']['enabled'] ?? false,
            'manifest_url' => $manifestUrl,
            'seo_data' => $seoData,
            'planFeatures' => array_merge($planFeatures ?? [], [
                'business_template_sections' => $allowedSections
            ])
        ]);
    }
    
    public function handlePasswordProtectionForBio(Request $request, BioLink $bioLink)
    {
        // Check if password protection is enabled
        if ($bioLink->password_enabled && $bioLink->password) {
            // Check if password is already verified in session
            $sessionKey = 'biolink_password_verified_' . $bioLink->id;
            
            if (!session($sessionKey)) {
                // If password is submitted, verify it
                if ($request->isMethod('post') && $request->has('password')) {
                    if (Hash::check($request->password, $bioLink->password)) {
                        session([$sessionKey => true]);
                        return redirect($request->url());
                    } else {
                        return Inertia::render('public/BioLinkPasswordPrompt', [
                            'bioLink' => [
                                'id' => $bioLink->id,
                                'name' => $bioLink->name,
                            ],
                            'error' => __('Invalid password. Please try again.')
                        ]);
                    }
                }
                
                // Show password prompt
                return Inertia::render('public/BioLinkPasswordPrompt', [
                    'bioLink' => [
                        'id' => $bioLink->id,
                        'name' => $bioLink->name,
                    ]
                ]);
            }
        }
    
         // Track visit with business_id
        $visit = \Shetabit\Visitor\Facade\Visitor::visit($bioLink);
        \DB::table('shetabit_visits')->where('id', $visit->id)->update(['biolink_id' => $bioLink->id]);
        
        // Convert relative media paths to full URLs for display
        $bioLink = $this->convertRelativePathsToUrlsForBioLink($bioLink);
        
        // Extract SEO data for meta tags
        $seoData = $this->extractSeoDataFromBioLink($bioLink);
        
        // Show the vCard
        return Inertia::render('public/BioLinkView', [
           'bioLink' => $bioLink,
           'seo_data' => $seoData
        ]);
    }
    
    public function verifyPassword(Request $request)
    {
        $request->validate([
            'business_id' => 'required|exists:businesses,id',
            'password' => 'required|string'
        ]);
        
        $business = Business::findOrFail($request->business_id);
        
        if (!$business->password_enabled || !$business->password) {
            return response()->json(['success' => false, 'message' => __('Password protection not enabled')]);
        }
        
        if (Hash::check($request->password, $business->password)) {
            $sessionKey = 'vcard_password_verified_' . $business->id;
            session([$sessionKey => true]);
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false, 'message' => __('Invalid password')]);
    }
    
    public function verifyBioLinkPassword(Request $request)
    {
        $request->validate([
            'biolink_id' => 'required|exists:bio_links,id',
            'password' => 'required|string'
        ]);
        
        $bioLink = BioLink::findOrFail($request->biolink_id);
        
        if (!$bioLink->password_enabled || !$bioLink->password) {
            return response()->json(['success' => false, 'message' => __('Password protection not enabled')]);
        }
        
        if (Hash::check($request->password, $bioLink->password)) {
            $sessionKey = 'biolink_password_verified_' . $bioLink->id;
            session([$sessionKey => true]);
            return response()->json(['success' => true]);
        }
        
        return response()->json(['success' => false, 'message' => __('Invalid password')]);
    }
    
    public function manifest(Request $request, $prefix = null, $slug = null)
    {
        $baseUrl = rtrim(config('app.url', $request->getSchemeAndHttpHost()), '/');
        
        $manifest = [
            'id' => $request->url() . '?default',
            'name' => 'vCard',
            'short_name' => 'vCard', 
            'description' => 'Digital business card',
            'start_url' => str_replace('/manifest.json', '', $request->fullUrl()),
            'display' => 'standalone',
            'background_color' => '#ffffff',
            'theme_color' => '#000000',
            'lang' => 'en',
            'orientation' => 'portrait',
            'categories' => ['business'],
            'scope' => str_replace('/manifest.json', '/', $request->fullUrl()),
            'prefer_related_applications' => false,
            'screenshots' => [
                [
                    'src' => route('favicon.generate', ['size' => 512]),
                    'sizes' => '512x512',
                    'type' => 'image/png',
                    'form_factor' => 'wide'
                ],
                [
                    'src' => route('favicon.generate', ['size' => 320]),
                    'sizes' => '320x320',
                    'type' => 'image/png'
                ]
            ],
            'icons' => [
                [
                    'src' => route('favicon.generate', ['size' => 144]),
                    'sizes' => '144x144',
                    'type' => 'image/png',
                    'purpose' => 'any maskable'
                ],
                [
                    'src' => route('favicon.generate', ['size' => 192]),
                    'sizes' => '192x192',
                    'type' => 'image/png',
                    'purpose' => 'any maskable'
                ],
                [
                    'src' => route('favicon.generate', ['size' => 512]),
                    'sizes' => '512x512',
                    'type' => 'image/png',
                    'purpose' => 'any maskable'
                ]
            ]
        ];
        
        try {
            $business = null;

            // First try by business ID from query param (most reliable)
            $businessId = $request->get('business');
            if ($businessId) {
                $business = Business::find($businessId);
            }

            // Fallback: resolve from URL path segments
            if (!$business) {
                if ($prefix && $slug) {
                    $business = Business::where('slug', $slug)
                        ->where('url_prefix', $prefix)
                        ->where('domain_type', 'slug')
                        ->first();
                } elseif ($slug && !$prefix) {
                    $business = Business::where('slug', $slug)
                        ->where('domain_type', 'slug')
                        ->where(function ($query) {
                            $query->whereNull('url_prefix')
                                ->orWhere('url_prefix', '')
                                ->orWhere('url_prefix', 'v');
                        })
                        ->first();
                } else {
                    $host = $request->getHost();
                    $hostParts = explode('.', $host);
                    if (count($hostParts) > 2) {
                        $subdomain = $hostParts[0];
                        $business = Business::where('slug', $subdomain)
                            ->where('domain_type', 'subdomain')
                            ->first();
                    }
                    if (!$business) {
                        $business = Business::where('custom_domain', $host)
                            ->where('domain_type', 'domain')
                            ->first();
                    }
                }
            }
            if ($business && isset($business->config_sections['pwa']['enabled']) && $business->config_sections['pwa']['enabled']) {
                $pwa = $business->config_sections['pwa'] ?? [];
                
                // Create unique PWA identity
                $currentPath = str_replace('/manifest.json', '', $request->url());
                $manifest['id'] = $currentPath . '/?id=' . $business->id;
                $manifest['name'] = $pwa['name'] ?? $business->name;
                $manifest['short_name'] = $pwa['short_name'] ?? substr($business->name, 0, 10);
                $manifest['description'] = $pwa['description'] ?? 'App for ' . $business->name;
                $manifest['background_color'] = $pwa['background_color'] ?? '#ffffff';
                $manifest['theme_color'] = $pwa['theme_color'] ?? '#000000';
                // $manifest['start_url'] = $currentPath . '/?pwa=' . $business->id;
                $manifest['scope'] = $currentPath . '/?pwa=' . $business->id;
                
                // Use business favicon if available
                if ($business->favicon) {
                    $manifest['screenshots'] = [
                        [
                            'src' => route('favicon.generate', ['size' => 512, 'business' => $business->id]),
                            'sizes' => '512x512',
                            'type' => 'image/png',
                            'form_factor' => 'wide'
                        ],
                        [
                            'src' => route('favicon.generate', ['size' => 320, 'business' => $business->id]),
                            'sizes' => '320x320',
                            'type' => 'image/png'
                        ]
                    ];
                    $manifest['icons'] = [
                        [
                            'src' => route('favicon.generate', ['size' => 144, 'business' => $business->id]),
                            'sizes' => '144x144',
                            'type' => 'image/png',
                            'purpose' => 'any maskable'
                        ],
                        [
                            'src' => route('favicon.generate', ['size' => 192, 'business' => $business->id]),
                            'sizes' => '192x192',
                            'type' => 'image/png',
                            'purpose' => 'any maskable'
                        ],
                        [
                            'src' => route('favicon.generate', ['size' => 512, 'business' => $business->id]),
                            'sizes' => '512x512',
                            'type' => 'image/png',
                            'purpose' => 'any maskable'
                        ]
                    ];
                }

                // Add related applications if configured
                if (isset($pwa['related_applications']) && is_array($pwa['related_applications'])) {
                    $manifest['related_applications'] = $pwa['related_applications'];
                    $manifest['prefer_related_applications'] = $pwa['prefer_related_applications'] ?? false;
                }
            }
        } catch (\Exception $e) {
            // Return default manifest on any error
        }
        
        return response()->json($manifest, 200, [
            'Content-Type' => 'application/manifest+json',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET',
            'Access-Control-Allow-Headers' => 'Content-Type'
        ]);
    }
    
    public function generateFavicon(Request $request, $size = 192)
    {
        $businessId = $request->get('business');
        $size = (int) $size;
        
        // Validate size
        if (!in_array($size, [16, 32, 144, 192, 512])) {
            $size = 192;
        }
        
        try {
            if ($businessId) {
                $business = Business::find($businessId);
                if ($business && !empty($business->favicon)) {
                    $filename = str_replace(' ', '-', strtolower($business->name)) . '-' . $size . 'x' . $size . '.png';
                    $headers = [
                        'Content-Type' => 'image/png',
                        'Content-Disposition' => 'inline; filename="' . $filename . '"'
                    ];
                    // Get favicon URL and convert to file path
                    $faviconUrl = $business->favicon;
                    
                    // Handle different URL formats
                    if (filter_var($faviconUrl, FILTER_VALIDATE_URL)) {
                        // External URL - download and process
                        $imageContent = file_get_contents($faviconUrl);
                        if ($imageContent) {
                            $manager = new ImageManager(new Driver());
                            $image = $manager->read($imageContent)->resize($size, $size);
                            return response($image->toPng(), 200, $headers);
                        }
                    } else {
                        // Local file path - try multiple locations
                        $possiblePaths = [
                            public_path($faviconUrl),
                            storage_path('app/public/' . $faviconUrl),
                            public_path('/storage/' . $faviconUrl),
                            $faviconUrl // Direct path
                        ];
                        
                        foreach ($possiblePaths as $filePath) {
                            if (file_exists($filePath)) {
                                $manager = new ImageManager(new Driver());
                                $image = $manager->read($filePath)->resize($size, $size);
                                return response($image->toPng(), 200, $headers);
                            }
                        }
                    }
                }
            }
            
            // Fallback to default favicon - use the default icon
            $defaultIconPath = $faviconUrl ?? public_path('images/logos/icon-192x192.png');
            if (file_exists($defaultIconPath)) {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($defaultIconPath)->resize($size, $size);
                return response($image->toPng(), 200, ['Content-Type' => 'image/png']);
            }
            
            // Final fallback to favicon.ico
            $faviconPath = public_path('favicon.ico');
            if (file_exists($faviconPath)) {
                $manager = new ImageManager(new Driver());
                $image = $manager->read($faviconPath)->resize($size, $size);
                return response($image->toPng(), 200, ['Content-Type' => 'image/png']);
            }
            
            // Generate a simple colored square as last resort
            $manager = new ImageManager(new Driver());
            $image = $manager->create($size, $size)->fill('#3B82F6');
            return response($image->toPng(), 200, ['Content-Type' => 'image/png']);
                
        } catch (\Exception $e) {
            // Generate a simple colored square on error
            $manager = new ImageManager(new Driver());
            $image = $manager->create($size, $size)->fill('#3B82F6');
            return response($image->toPng(), 200, ['Content-Type' => 'image/png']);
        }
    }
    
    public function serviceWorker(Request $request)
    {
        $businessId = $request->get('business', 'default');
        
        $serviceWorkerContent = "// Service Worker for Business ID: {$businessId}
            const BUSINESS_ID = '{$businessId}';
            const CACHE_NAME = 'vcard-pwa-' + BUSINESS_ID + '-v1';
            const assets = [];

            self.addEventListener('install', installEvent => {
                self.skipWaiting();
                installEvent.waitUntil(
                    caches.open(CACHE_NAME).then(cache => {
                        return cache.addAll(assets);
                    })
                );
            });

            self.addEventListener('activate', function(event) {
                event.waitUntil(
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.map(cacheName => {
                                if (cacheName.startsWith('vcard-pwa-' + BUSINESS_ID + '-') && cacheName !== CACHE_NAME) {
                                    return caches.delete(cacheName);
                                }
                            })
                        );
                    }).then(() => {
                        return self.clients.claim();
                    })
                );
            });

            self.addEventListener('fetch', function(event) {
                event.respondWith(
                    caches.match(event.request).then(function(response) {
                        return response || fetch(event.request);
                    })
                );
            });

            self.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'SKIP_WAITING') {
                    self.skipWaiting();
                }
            });";
        
        return response($serviceWorkerContent)
            ->header('Content-Type', 'application/javascript')
            ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
            ->header('Service-Worker-Allowed', '/');
    }
    
    /**
     * Convert relative media paths to full URLs for business display
     */
    private function convertRelativePathsToUrls($business)
    {
        if (isset($business->config_sections)) {
            $business->config_sections = $this->recursivelyConvertPathsToUrls($business->config_sections);
        }
        
        return $business;
    }
    
    /**
     * Convert relative media paths to full URLs for biolink display
     */
    private function convertRelativePathsToUrlsForBioLink($bioLink)
    {
        if (isset($bioLink->config)) {
            $bioLink->config = $this->recursivelyConvertPathsToUrls($bioLink->config);
        }
        
        return $bioLink;
    }
    
    /**
     * Recursively convert relative paths to full URLs
     */
    private function recursivelyConvertPathsToUrls($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_string($value) && $this->isRelativeMediaPath($value)) {
                    $data[$key] = $this->convertRelativePathToUrl($value);
                } elseif (is_array($value)) {
                    $data[$key] = $this->recursivelyConvertPathsToUrls($value);
                }
            }
        }
        
        return $data;
    }
    
    /**
     * Check if a string is a relative media path
     */
    private function isRelativeMediaPath($path)
    {
        return is_string($path) && str_starts_with($path, 'media/') && !str_starts_with($path, 'http');
    }
    
    /**
     * Convert relative path to full URL
     */
    private function convertRelativePathToUrl(string $path): string
    {
        return getAssetUrl($path);
    }
    
    /**
     * Extract SEO data from business config sections
     */
    private function extractSeoData($business)
    {
        $seoData = [];
        
        // Handle both array and object formats
        $configSections = is_array($business) ? ($business['config_sections'] ?? []) : ($business->config_sections ?? []);
        $businessName = is_array($business) ? ($business['name'] ?? '') : ($business->name ?? '');
        
        // Check if SEO section exists in config_sections
        if (isset($configSections['seo'])) {
            $seo = $configSections['seo'];
            $seoData = [
                'meta_title' => $seo['meta_title'] ?? null,
                'meta_description' => $seo['meta_description'] ?? null,
                'keywords' => $seo['keywords'] ?? null,
                'og_image' => $seo['og_image'] ?? null,
            ];
        }
        
        // Get global SEO settings as fallback
        $globalSettings = settings();
        
        // Use global settings as fallback
        if (empty($seoData['meta_title'])) {
            $seoData['meta_title'] = $businessName;
        }
        
        if (empty($seoData['meta_description'])) {
            $seoData['meta_description'] = $globalSettings['metaDescription'] ?? null;
        }
        
        if (empty($seoData['keywords'])) {
            $seoData['keywords'] = $globalSettings['metaKeywords'] ?? null;
        }
        
        if (empty($seoData['og_image'])) {
            $seoData['og_image'] = $globalSettings['metaImage'] ?? null;
        }
        
        // Convert relative image paths to full URLs
        if (!empty($seoData['og_image']) && $this->isRelativeMediaPath($seoData['og_image'])) {
            $seoData['og_image'] = $this->convertRelativePathToUrl($seoData['og_image']);
        }
        
        return $seoData;
    }
    
    /**
     * Extract SEO data from biolink config
     */
    private function extractSeoDataFromBioLink($bioLink)
    {
        $seoData = [];
        
        // Check if SEO section exists in config
        if (isset($bioLink->config['seo'])) {
            $seo = $bioLink->config['seo'];
            $seoData = [
                'meta_title' => $seo['meta_title'] ?? null,
                'meta_description' => $seo['meta_description'] ?? null,
                'keywords' => $seo['keywords'] ?? null,
                'og_image' => $seo['og_image'] ?? null,
            ];
        }
        
        // Fallback to biolink name if no meta title
        if (empty($seoData['meta_title'])) {
            $seoData['meta_title'] = $bioLink->name;
        }
        
        // Convert relative image paths to full URLs
        if (!empty($seoData['og_image']) && $this->isRelativeMediaPath($seoData['og_image'])) {
            $seoData['og_image'] = $this->convertRelativePathToUrl($seoData['og_image']);
        }
        
        return $seoData;
    }
    
    /**
     * Sanitize Symbol values to prevent serialization errors
     */
    private function sanitizeSymbols($data)
    {
        if (is_array($data)) {
            $result = [];
            foreach ($data as $key => $value) {
                if (!is_string($key) || strpos($key, 'Symbol(') !== 0) {
                    $result[$key] = $this->sanitizeSymbols($value);
                }
            }
            return $result;
        } elseif (is_object($data)) {
            $result = clone $data;
            foreach (get_object_vars($data) as $key => $value) {
                if (!is_string($key) || strpos($key, 'Symbol(') !== 0) {
                    $result->$key = $this->sanitizeSymbols($value);
                } else {
                    unset($result->$key);
                }
            }
            return $result;
        }
        return $data;
    }
}