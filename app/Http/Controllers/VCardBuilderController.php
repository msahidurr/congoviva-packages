<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Appointment;
use App\Models\Contact;
use App\Models\User;
use App\Models\DomainRequest;
use App\Services\AnalyticsService;
use App\Services\DomainValidationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VCardBuilderController extends Controller
{
    protected $analyticsService;
    
    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }
    public function index(Request $request)
    {
        $authUser = auth()->user();
        
        // Check if user's plan has vCard Builder feature
        if ($authUser->plan && !$authUser->plan->hasFeature('vcard_builder')) {
            return redirect()->route('dashboard')
                ->with('error', __('vCard Builder feature is not available in your current plan'));
        }
        
        // Apply business filtering based on user type and permissions
        if ($authUser->type === 'company') {
            $staffIds = User::where('created_by', $authUser->id)->pluck('id')->toArray();
            $staffIds = array_merge([$authUser->id], $staffIds);
            // Company users see all their businesses
            $query = Business::whereIn('created_by', $staffIds);
            $companyId = $authUser->id;
        } else {
            // Staff users with vCard Builder permission see only their company's businesses
            if ($authUser->can('manage-vcard-builder') || $authUser->can('view-vcard-builder')) {
                $companyId = $authUser->created_by;
                // Staff users should only see businesses created by their company (not by other staff)
                $query = Business::where('created_by', $authUser->id);

            } else {
                // No permission - return empty result
                $query = Business::whereRaw('1 = 0');
                $companyId = null;
            }
        }
        
        // Apply search filter
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        // Apply type filter
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('business_type', $request->type);
        }
        
        // Apply age filter
        if ($request->has('age')) {
            if ($request->age === 'new') {
                $query->where('created_at', '>=', now()->subDays(30));
            } else if ($request->age === 'old') {
                $query->where('created_at', '<', now()->subDays(30));
            }
        }
        
        // Apply sorting
        $sortField = $request->sort_field ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Paginate results
        $perPage = $request->per_page ?? 10;
        $businesses = $query->select('*')->paginate($perPage)->withQueryString();
        
        // Convert relative media paths to full URLs for display
        $businesses->getCollection()->transform(function ($business) {
            return $this->convertRelativePathsToUrlsForEdit($business);
        });
        
        // Get plan limits for company users and staff users
        $planLimits = null;
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentBusinessCount = Business::where('created_by', $authUser->id)->count();
            $planLimits = [
                'current_businesses' => $currentBusinessCount,
                'max_businesses' => $authUser->plan->business,
                'can_create' => $currentBusinessCount < $authUser->plan->business
            ];
        }
        // Check for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBusinessCount = Business::where('created_by', $companyUser->id)->count();
                $planLimits = [
                    'current_businesses' => $currentBusinessCount,
                    'max_businesses' => $companyUser->plan->business,
                    'can_create' => $currentBusinessCount < $companyUser->plan->business
                ];
            }
        }
        
        return Inertia::render('vcard-builder/index', [
            'businesses' => $businesses,
            'planLimits' => $planLimits,
            'filters' => $request->only(['search', 'type', 'age', 'per_page', 'sort_field', 'sort_direction', 'view'])
        ]);
    }

    public function create()
    {
        $user = auth()->user()->load(['plan', 'roles']);
        
        // Check if user's plan has vCard Builder feature
        if ($user->plan && !$user->plan->hasFeature('vcard_builder')) {
            return redirect()->route('dashboard')
                ->with('error', __('vCard Builder feature is not available in your current plan'));
        }
        
        // Check plan limits for company users
        if ($user->type === 'company' && $user->plan) {
            $currentBusinessCount = Business::where('created_by', $user->id)->count();
            $maxBusinesses = $user->plan->business;
            
            if ($currentBusinessCount >= $maxBusinesses) {
                return redirect()->route('vcard-builder.index')
                    ->with('error', __('Business limit exceeded. Your plan allows maximum :max businesses. Please upgrade your plan.', ['max' => $maxBusinesses]));
            }
        }
        // Check plan limits for staff users (created by company users)
        elseif ($user->type !== 'superadmin' && $user->created_by) {
            // Check if staff has permission to create businesses
            if (!$user->can('manage-vcard-builder') && !$user->can('create-vcard-builder')) {
                return redirect()->route('vcard-builder.index')
                    ->with('error', __('You do not have permission to create businesses.'));
            }
            
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBusinessCount = Business::where('created_by', $companyUser->id)->count();
                $maxBusinesses = $companyUser->plan->business;
                
                if ($currentBusinessCount >= $maxBusinesses) {
                    return redirect()->route('vcard-builder.index')
                        ->with('error', __('Business limit exceeded. Your company plan allows maximum :max businesses. Please contact your administrator.', ['max' => $maxBusinesses]));
                }
            }
        }
        
        // Get plan data for form restrictions
        $userPlan = null;
        $planFeatures = [];
        if ($user->type === 'company' && $user->plan) {
            $userPlan = $user->plan;
            $planFeatures = $user->plan->features ?: [];
        } elseif ($user->type !== 'superadmin' && $user->created_by) {
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $userPlan = $companyUser->plan;
                $planFeatures = $companyUser->plan->features ?: [];
            }
        }
        
        return Inertia::render('vcard-builder/create', [
            'userPlan' => $userPlan,
            'planFeatures' => $planFeatures,
            'userRole' => $user->roles->pluck('name')->first() ?? null
        ]);
    }

    public function store(Request $request)
    {
        $authUser = auth()->user();
        
        // Check plan limits for company users
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentBusinessCount = Business::where('created_by', $authUser->id)->count();
            $maxBusinesses = $authUser->plan->business;
            
            if ($currentBusinessCount >= $maxBusinesses) {
                return redirect()->back()->with('error', __('Business limit exceeded. Your plan allows maximum :max businesses. Please upgrade your plan.', ['max' => $maxBusinesses]));
            }
        }
        // Check plan limits for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            // Check if staff has permission to create businesses
            if (!$authUser->can('manage-vcard-builder') && !$authUser->can('create-vcard-builder')) {
                return redirect()->back()->with('error', __('You do not have permission to create businesses.'));
            }
            
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBusinessCount = Business::where('created_by', $companyUser->id)->count();
                $maxBusinesses = $companyUser->plan->business;
                
                if ($currentBusinessCount >= $maxBusinesses) {
                    return redirect()->back()->with('error', __('Business limit exceeded. Your company plan allows maximum :max businesses. Please contact your administrator.', ['max' => $maxBusinesses]));
                }
            }
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'business_type' => 'required|string',
            'config_sections' => 'required|array',
            'custom_domain' => 'nullable|string|max:255',
            'url_prefix' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:4',
            'password_enabled' => 'boolean',
            'domain_type' => 'required|in:slug,subdomain,domain',
            'favicon' => 'nullable|string|max:500'
        ]);
        
        // Sanitize slug to ensure it only contains valid characters
        $validated['slug'] = preg_replace('/[^a-zA-Z0-9-_]/', '-', $validated['slug']);
        $validated['slug'] = preg_replace('/-+/', '-', $validated['slug']);
        $validated['slug'] = trim($validated['slug'], '-');
        
        // If slug is empty after sanitization, generate one from name
        if (empty($validated['slug'])) {
            $validated['slug'] = DomainValidationService::generateUniqueSlug($validated['name'], $validated['url_prefix'] ?? null);
        }
        
        // Validate using centralized service
        $validationErrors = DomainValidationService::validateBusiness($validated);
        if (!empty($validationErrors)) {
            return back()->withErrors($validationErrors);
        }

 
        // Convert media URLs to relative paths in config_sections
        if (isset($validated['config_sections'])) {
            $validated['config_sections'] = $this->convertMediaUrlsToRelativePaths($validated['config_sections']);
        }
        
        $business = Business::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'business_type' => $validated['business_type'],
            'config_sections' => $validated['config_sections'],
            'custom_domain' => $validated['custom_domain'],
            'url_prefix' => $validated['url_prefix'] ?? null,
            'password' => $validated['password_enabled'] && $validated['password'] ? bcrypt($validated['password']) : null,
            'password_enabled' => $validated['password_enabled'] ?? false,
            'domain_type' => $validated['domain_type'] ?? 'slug',
            'favicon' => $validated['favicon'],
            'created_by' => $authUser->id
        ]);
        
        // Create domain request if custom domain or subdomain is used
        if (in_array($validated['domain_type'], ['domain', 'subdomain'])) {
            if ($validated['domain_type'] == 'domain' && isset($validated['custom_domain'])) {
                $existingRequest = DomainRequest::where('business_id', $business->id)
                ->where('domain', $validated['custom_domain'])
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'business_id' => $business->id,
                        'user_id' => auth()->id(),
                        'domain' => $validated['custom_domain'],
                        'status' => 'pending'
                    ]);
                }
            }

            if ($validated['domain_type'] == 'subdomain' && isset($validated['slug'])) {
                $domain = $validated['slug'].'.'.$request->getHost();
                $existingRequest = DomainRequest::where('business_id', $business->id)
                ->where('domain', $domain)
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'business_id' => $business->id,
                        'user_id' => auth()->id(),
                        'domain' => $domain,
                        'status' => 'pending'
                    ]);
                }
            }
        }

        return redirect()->route('vcard-builder.index')
            ->with('success', __('Business created successfully!'));
    }

    public function edit(Business $business)
    {
        $user = auth()->user()->load(['plan', 'roles']);
        
        // Check if user's plan has vCard Builder feature
        if ($user->plan && !$user->plan->hasFeature('vcard_builder')) {
            return redirect()->route('dashboard')
                ->with('error', __('vCard Builder feature is not available in your current plan'));
        }
        
        // Check if user has access to this business
        // $hasAccess = false;
        // if ($user->type === 'company') {
        //     $hasAccess = $business->created_by === $user->id;
        // } else {
        //     // Staff users with vCard Builder permission can access businesses created by their company
        //     if ($user->can('manage-vcard-builder') || $user->can('edit-vcard-builder')) {
        //         $hasAccess = $business->created_by === $user->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to edit this business.');
        // }
        
        // Get plan data for form restrictions
        $userPlan = null;
        $planFeatures = [];
        if ($user->type === 'company' && $user->plan) {
            $userPlan = $user->plan;
            $planFeatures = $user->plan->features ?: [];
        } elseif ($user->type !== 'superadmin' && $user->created_by) {
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $userPlan = $companyUser->plan;
                $planFeatures = $companyUser->plan->features ?: [];
            }
        }
        
        // Convert relative media paths to full URLs for editing
        $business = $this->convertRelativePathsToUrlsForEdit($business);
        
        return Inertia::render('vcard-builder/edit', [
            'business' => $business,
            'userPlan' => $userPlan,
            'planFeatures' => $planFeatures,
            'userRole' => $user->roles->pluck('name')->first() ?? $user->type
        ]);
    }

    public function update(Request $request, Business $business)
    {
        $user = auth()->user();
        
        // Check if user has access to this business
        // $hasAccess = false;
        // if ($user->type === 'company') {
        //     $hasAccess = $business->created_by === $user->id;
        // } else {
        //     // Staff users with vCard Builder permission can access businesses created by their company
        //     if ($user->can('manage-vcard-builder') || $user->can('edit-vcard-builder')) {
        //         $hasAccess = $business->created_by === $user->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to update this business.');
        // }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'business_type' => 'required|string',
            'config_sections' => 'required|array',
            'custom_domain' => 'nullable|string|max:255',
            'url_prefix' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:4',
            'password_enabled' => 'boolean',
            'domain_type' => 'required|in:slug,subdomain,domain',
            'favicon' => 'nullable|string|max:500'
        ]);
        
        // Sanitize slug to ensure it only contains valid characters
        $validated['slug'] = preg_replace('/[^a-zA-Z0-9-_]/', '-', $validated['slug']);
        $validated['slug'] = preg_replace('/-+/', '-', $validated['slug']);
        $validated['slug'] = trim($validated['slug'], '-');
        
        // If slug is empty after sanitization, generate one from name
        if (empty($validated['slug'])) {
            $validated['slug'] = DomainValidationService::generateUniqueSlug($validated['name'], $validated['url_prefix'] ?? null, $business->id);
        }
        
        // Validate using centralized service (excluding current business)
        $validationErrors = DomainValidationService::validateBusiness($validated, $business->id);
        if (!empty($validationErrors)) {
            return back()->withErrors($validationErrors);
        }

        $updateData = [
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'business_type' => $validated['business_type'],
            'config_sections' => $validated['config_sections'],
            'custom_domain' => $validated['custom_domain'],
            'url_prefix' => $validated['url_prefix'] ?? null,
            'password_enabled' => $validated['password_enabled'] ?? false,
            'domain_type' => $validated['domain_type'] ?? 'slug',
            'favicon' => $validated['favicon'],
        ];

        // Only update password if provided and password is enabled
        if ($validated['password_enabled'] && !empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        } elseif (!$validated['password_enabled']) {
            $updateData['password'] = null;
        }

        // Convert media URLs to relative paths in config_sections
        if (isset($updateData['config_sections'])) {
            $updateData['config_sections'] = $this->convertMediaUrlsToRelativePaths($updateData['config_sections']);
        }
        
        $business->update($updateData);
        
        if (in_array($validated['domain_type'], ['domain', 'subdomain'])) {
            if ($validated['domain_type'] == 'domain' && isset($validated['custom_domain'])) {
                $existingRequest = DomainRequest::where('business_id', $business->id)
                ->where('domain', $validated['custom_domain'])
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'business_id' => $business->id,
                        'user_id' => auth()->id(),
                        'domain' => $validated['custom_domain'],
                        'status' => 'pending'
                    ]);
                }
            }

            if ($validated['domain_type'] == 'subdomain' && isset($validated['slug'])) {
                $domain = $validated['slug'].'.'.$request->getHost();
                $existingRequest = DomainRequest::where('business_id', $business->id)
                ->where('domain', $domain)
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'business_id' => $business->id,
                        'user_id' => auth()->id(),
                        'domain' => $domain,
                        'status' => 'pending'
                    ]);
                }
            }
        }

        return back()->with('success', __('Business updated successfully!'));
    }

    public function destroy(Business $business)
    {
        $user = auth()->user();
        
        // Check if user has access to this business
        // $hasAccess = false;
        // if ($user->type === 'company') {
        //     $hasAccess = $business->created_by === $user->id;
        // } else {
        //     // Staff users with vCard Builder permission can access businesses created by their company
        //     if ($user->can('manage-vcard-builder') || $user->can('delete-vcard-builder')) {
        //         $hasAccess = $business->created_by === $user->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to delete this business.');
        // }

        $business->delete();

        return redirect()->route('vcard-builder.index')
            ->with('success', __('Business deleted successfully!'));
    }
    
    public function preview(Business $business)
    {
        // Sanitize business data to prevent Symbol serialization errors
        $sanitizedBusiness = $this->sanitizeSymbols($business->toArray());
        
        return Inertia::render('public/VCardView', [
            'business' => $sanitizedBusiness
        ]);
    }
    
    public function previewTemplate()
    {
        $user = auth()->user();
        
        // Get plan features for the current user
        $planFeatures = [];
        if ($user && $user->type === 'company' && $user->plan) {
            $planFeatures = $user->plan->features ?: [];
        } elseif ($user && $user->type !== 'superadmin' && $user->created_by) {
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $planFeatures = $companyUser->plan->features ?: [];
            }
        }
        
        return Inertia::render('public/VCardPreview', [
            'planFeatures' => $planFeatures
        ], function ($page) {
            // Sanitize any Symbol values that could cause serialization errors
            $page['props'] = $this->sanitizeSymbols($page['props']);
            return $page;
        });
    }
    
    /**
     * Sanitize Symbol values to prevent serialization errors
     */
    private function sanitizeSymbols($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->sanitizeSymbols($value);
            }
        } elseif (is_object($data)) {
            foreach (get_object_vars($data) as $key => $value) {
                $data->$key = $this->sanitizeSymbols($value);
            }
        }
        return $data;
    }
    
    public function duplicate(Business $business)
    {
        $authUser = auth()->user();
        
        // Check if user has access to this business
        // $hasAccess = false;
        // if ($authUser->type === 'company') {
        //     $hasAccess = $business->created_by === $authUser->id;
        // } else {
        //     // Staff users with vCard Builder permission can access businesses created by their company
        //     if ($authUser->can('manage-vcard-builder') || $authUser->can('duplicate-vcard-builder')) {
        //         $hasAccess = $business->created_by === $authUser->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to duplicate this business.');
        // }
        
        // Check plan limits for company users
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentBusinessCount = Business::where('created_by', $authUser->id)->count();
            $maxBusinesses = $authUser->plan->business;
            
            if ($currentBusinessCount >= $maxBusinesses) {
                return redirect()->route('vcard-builder.index')
                    ->with('error', __('Business limit exceeded. Your plan allows maximum :max businesses. Please upgrade your plan.', ['max' => $maxBusinesses]));
            }
        }
        // Check plan limits for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            // Check if staff has permission to create businesses
            if (!$authUser->can('manage-vcard-builder') && !$authUser->can('duplicate-vcard-builder')) {
                return redirect()->route('vcard-builder.index')
                    ->with('error', __('You do not have permission to duplicate businesses.'));
            }
            
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBusinessCount = Business::where('created_by', $companyUser->id)->count();
                $maxBusinesses = $companyUser->plan->business;
                
                if ($currentBusinessCount >= $maxBusinesses) {
                    return redirect()->route('vcard-builder.index')
                        ->with('error', __('Business limit exceeded. Your company plan allows maximum :max businesses. Please contact your administrator.', ['max' => $maxBusinesses]));
                }
            }
        }
        
        // Create a duplicate with a new name
        $duplicate = $business->replicate();
        $duplicate->name = $business->name . ' (Copy)';
        $duplicate->slug = DomainValidationService::generateUniqueSlug($duplicate->name, $duplicate->url_prefix ?? null);
        $duplicate->created_at = now();
        // Ensure the duplicate is created under the company, not the staff user
        $duplicate->created_by = $authUser->type === 'company' ? $authUser->id : $authUser->created_by;
        $duplicate->save();
        
        return redirect()->route('vcard-builder.index')
            ->with('success', __('Business duplicated successfully!'));
    }

    public function checkSlug(Request $request)
    {
        $slug = $request->input('slug');
        $businessId = $request->input('business_id');
        $urlPrefix = $request->input('url_prefix') ?? null;
        
        $available = DomainValidationService::isSlugAvailable($slug, $urlPrefix, $businessId);
        
        return response()->json([
            'available' => $available,
            'slug' => $slug
        ]);
    }

    public function generateSlug(Request $request)
    {
        $name = $request->input('name');
        $businessId = $request->input('business_id');
        $urlPrefix = $request->input('url_prefix') ?? null;
        
        if (empty($name)) {
            return response()->json(['slug' => '']);
        }
        
        $slug = $this->generateUniqueSlugAcrossTables($name, $businessId, $urlPrefix);
        
        return response()->json(['slug' => $slug]);
    }

    private function generateUniqueSlugAcrossTables($name, $excludeBusinessId = null, $urlPrefix = null)
    {
        return DomainValidationService::generateUniqueSlug($name, $urlPrefix, $excludeBusinessId);
    }
    
    /**
     * Convert media URLs to relative paths in config sections
     */
    private function convertMediaUrlsToRelativePaths($configSections)
    {
        if (!is_array($configSections)) {
            return $configSections;
        }
        
        return $this->recursivelyConvertUrls($configSections);
    }
    
    /**
     * Recursively convert URLs in nested arrays
     */
    private function recursivelyConvertUrls($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_string($value) && $this->isMediaUrl($value)) {
                    $data[$key] = $this->convertToRelativePath($value);
                } elseif (is_array($value)) {
                    $data[$key] = $this->recursivelyConvertUrls($value);
                }
            }
        }
        
        return $data;
    }
    
    /**
     * Check if a string is a media URL
     */
    private function isMediaUrl($url)
    {
        return is_string($url) && (
            str_contains($url, '/storage/media/') || 
            str_contains($url, 'media/') ||
            str_contains($url, '/storage/') ||
            (str_starts_with($url, 'http') && str_contains($url, '/storage/')) ||
            // Also check for common image extensions
            preg_match('/\.(jpg|jpeg|png|gif|webp|svg)$/i', $url)
        );
    }
    
    /**
     * Convert full URL to relative path for storage
     */
    private function convertToRelativePath(string $url): string
    {
        if (!$url) return $url;
        
        // If it's already a relative path without /storage/, return as is
        if (!str_starts_with($url, 'http') && !str_starts_with($url, '/storage/')) {
            return $url;
        }
        
        // Handle URLs that start with /storage/ - convert to relative path
        if (str_starts_with($url, '/storage/')) {
            // Remove /storage/ prefix to get just the relative path
            $path = substr($url, 9); // Remove '/storage/' (9 characters)
            
            // Add storage type prefix for proper URL generation
            $currentStorageType = getSetting('storage_type', 'local');
            return $currentStorageType . ':' . $path;
        }
        
        // Extract the path after /storage/ and remove the /storage/ prefix
        $storageIndex = strpos($url, '/storage/');
        if ($storageIndex !== false) {
            $path = substr($url, $storageIndex + 9); // Remove '/storage/' prefix
            
            // Add storage type prefix for proper URL generation
            $currentStorageType = getSetting('storage_type', 'local');
            return $currentStorageType . ':' . $path;
        }
        
        return $url;
    }
    
    public function checkDomain(Request $request)
    {
        $domain = $request->input('domain');
        $businessId = $request->input('business_id');
        
        $available = DomainValidationService::isDomainAvailable($domain, $businessId);
        
        return response()->json([
            'available' => $available,
            'domain' => $domain
        ]);
    }
    
    public function indexCalendar(Request $request, $slug)
    {
        $user = auth()->user();
        
        // Get business by slug and verify access
        $businessQuery = Business::where('slug', $slug);
        
        if ($user->type === 'company') {
            $staffIds = User::where('created_by', $user->id)->pluck('id')->toArray();
            $staffIds = array_merge([$user->id], $staffIds);
            $businessQuery->whereIn('created_by', $staffIds);
        } else {
            // Staff users with vCard Builder permission can access businesses created by their company
            if ($user->can('manage-vcard-builder') || $user->can('calendar-vcard-builder') || $user->can('manage-calendar') || $user->can('view-calendar')) {
                $businessQuery->where('created_by', $user->id);
            } else {
                // No permission - return empty result
                $businessQuery->whereRaw('1 = 0');
            }
        }
        
        $business = $businessQuery->first();
        
        // Get appointments for the selected business
        $appointments = [];
        if ($business) {
            $appointments = Appointment::with('business')->where('business_id', $business->id)
            ->orderBy('appointment_date', 'asc')
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'title' => $appointment->name,
                    'date' => $appointment->appointment_date->format('Y-m-d'),
                    'time' => $appointment->appointment_time ? $appointment->appointment_time->format('H:i') : null,
                    'email' => $appointment->email,
                    'phone' => $appointment->phone,
                    'message' => $appointment->message,
                    'status' => $appointment->status,
                    'business' => $appointment->business ? $appointment->business->name : null,
                    'notes' => $appointment->notes,
                ];
            });
        }

        return Inertia::render('vcard-builder/calendar', [
            'business' => $business,
            'selectedBusinessId' => $slug,
            'appointments' => $appointments,
        ]);
    }
    
    public function indexContacts(Request $request, $slug)
    {
        $user = auth()->user();
        
        // Get business by slug and verify access
        $businessQuery = Business::where('slug', $slug);
        
        if ($user->type === 'company') {
            $staffIds = User::where('created_by', $user->id)->pluck('id')->toArray();
            $staffIds = array_merge([$user->id], $staffIds);
            $businessQuery->whereIn('created_by', $staffIds);
        } else {
            // Staff users with vCard Builder permission can access businesses created by their company
            if ($user->can('manage-vcard-builder') || $user->can('contacts-vcard-builder')) {
                $businessQuery->where('created_by', $user->id);
            } else {
                // No permission - return empty result
                $businessQuery->whereRaw('1 = 0');
            }
        }
        
        $business = $businessQuery->firstOrFail();
        
        // Build query
        $query = Contact::query()->where('business_id', $business->id);
        
        // Apply search filter
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply sorting
        $sortField = $request->sort_field ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Include business relationship
        $query->with('business');
        
        // Paginate results
        $perPage = $request->per_page ?? 10;
        $contacts = $query->paginate($perPage)->withQueryString();
        
        return Inertia::render('vcard-builder/contacts', [
            'business' => $business,
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'status', 'per_page', 'sort_field', 'sort_direction'])
        ]);
    }
    
    public function indexAnalytics(Request $request, $slug)
    {
        $user = auth()->user();
        
        // Get business by slug and verify access
        $businessQuery = Business::where('slug', $slug);
        
        if ($user->type === 'company') {
            $staffIds = User::where('created_by', $user->id)->pluck('id')->toArray();
            $staffIds = array_merge([$user->id], $staffIds);
            $businessQuery->whereIn('created_by', $staffIds);
        } else {
            // Staff users with vCard Builder permission can access businesses created by their company
            if ($user->can('manage-vcard-builder') || $user->can('analytics-vcard-builder')) {
                $businessQuery->where('created_by', $user->id);
            } else {
                // No permission - return empty result
                $businessQuery->whereRaw('1 = 0');
            }
        }
        
        $business = $businessQuery->firstOrFail();
        
        // Get date range from request
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        
        // Get analytics data using the service
        $analytics = $this->analyticsService->getBusinessAnalytics($business, $startDate, $endDate);
        
        return Inertia::render('vcard-builder/analytics', [
            'business' => $business,
            'analytics' => $analytics,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }
    
    /**
     * Convert relative media paths to full URLs for editing
     */
    private function convertRelativePathsToUrlsForEdit($business)
    {
        if (isset($business->config_sections)) {
            $business->config_sections = $this->recursivelyConvertPathsToUrls($business->config_sections);
        }
        
        return $business;
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
        return is_string($path) && (
            (str_starts_with($path, 'media/') && !str_starts_with($path, 'http')) ||
            (str_starts_with($path, '/storage/') && !str_starts_with($path, 'http')) ||
            // Also check for common image extensions in relative paths
            (!str_starts_with($path, 'http') && preg_match('/\.(jpg|jpeg|png|gif|webp|svg)$/i', $path) && !str_contains($path, '://'))
        );
    }
    
    /**
     * Convert relative path to full URL
     */
    private function convertRelativePathToUrl(string $path): string
    {
        if (!$path) return $path;
        
        // If it's already a full URL, return as is
        if (str_starts_with($path, 'http')) {
            return $path;
        }
        
        return getAssetUrl($path);
    }
   
}