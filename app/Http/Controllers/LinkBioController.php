<?php

namespace App\Http\Controllers;

use App\Models\BioLink;
use App\Models\Plan;
use App\Models\DomainRequest;
use App\Models\User;
use App\Services\DomainValidationService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class LinkBioController extends Controller
{
    /**
     * Display a listing of the bio links.
     */
    public function index(Request $request)
    {
        $authUser = Auth::user();
        
        // Check if user's plan has Bio Link feature
        if ($authUser->plan && !$authUser->plan->hasFeature('bio_link')) {
            return redirect()->route('dashboard')
                ->with('error', __('Bio Link feature is not available in your current plan'));
        }
        
        // Apply Bio Link filtering based on user type and permissions
        if ($authUser->type === 'company') {
            $staffIds = User::where('created_by', $authUser->id)->pluck('id')->toArray();
            $staffIds = array_merge([$authUser->id], $staffIds);
            $query = BioLink::whereIn('created_by', $staffIds);
        } else {
            // Staff users can only see Bio Links created by their company
            if ($authUser->can('manage-bio-link-builder') || $authUser->can('view-bio-link-builder')) {
                $query = BioLink::where('created_by', $authUser->id);
            } else {
                // No permission - return empty result
                $query = BioLink::whereRaw('1 = 0');
            }
        }
        
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }
        
        // Apply type filter
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('link_type', $request->type);
        }
        
        // Apply sorting
        $sortField = $request->sort_field ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Apply pagination
        $perPage = $request->per_page ?? 10;
        $bioLinks = $query->paginate($perPage)->withQueryString();

        // Get plan limits for company users and staff users
        $planLimits = null;
        $authUser = Auth::user();
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentBioLinks = BioLink::where('created_by', $authUser->id)->count();
            $planLimits = [
                'current_biolinks' => $currentBioLinks,
                'max_biolinks' => $authUser->plan->bio_links,
                'can_create' => $currentBioLinks < $authUser->plan->bio_links
            ];
        }
        // Check for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBioLinks = BioLink::where('created_by', $companyUser->id)->count();
                $planLimits = [
                    'current_biolinks' => $currentBioLinks,
                    'max_biolinks' => $companyUser->plan->bio_links,
                    'can_create' => $currentBioLinks < $companyUser->plan->bio_links
                ];
            }
        }
        
        return Inertia::render('link-bio-builder/index', [
            'bioLinks' => $bioLinks,
            'filters' => $request->only(['search', 'type', 'per_page', 'view', 'sort_field', 'sort_direction']),
            'planLimits' => $planLimits
        ]);
    }

    /**
     * Show the form for creating a new bio link.
     */
    public function create()
    {
        $user = auth()->user();
        
        // Check if user's plan has Bio Link feature
        if ($user->plan && !$user->plan->hasFeature('bio_link')) {
            return redirect()->route('dashboard')
                ->with('error', __('Bio Link feature is not available in your current plan'));
        }
        
        $user = Auth::user()->load(['plan', 'roles']);
        
        // Check plan limits for company users
        if ($user->type === 'company' && $user->plan) {
            $currentBioLinks = BioLink::where('created_by', $user->id)->count();
            $maxBioLinks = $user->plan->bio_links;
            
            if ($currentBioLinks >= $maxBioLinks) {
                return redirect()->route('link-bio-builder.index')
                    ->with('error', __('Bio link limit exceeded. Your plan allows maximum :max bio links. Please upgrade your plan.', ['max' => $maxBioLinks]));
            }
        }
        // Check plan limits for staff users (created by company users)
        elseif ($user->type !== 'superadmin' && $user->created_by) {
            $companyUser = User::find($user->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBioLinks = BioLink::where('created_by', $companyUser->id)->count();
                $maxBioLinks = $companyUser->plan->bio_links;
                
                if ($currentBioLinks >= $maxBioLinks) {
                    return redirect()->route('link-bio-builder.index')
                        ->with('error', __('Bio link limit exceeded. Your company plan allows maximum :max bio links. Please contact your administrator.', ['max' => $maxBioLinks]));
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

        return Inertia::render('link-bio-builder/create', [
            'userPlan' => $userPlan,
            'planFeatures' => $planFeatures,
            'userRole' => $user->roles->pluck('name')->first() ?? null,
            'themeImages' => [],
            'baseUrl' => config('app.url')
        ]);
    }

    /**
     * Store a newly created bio link in storage.
     */
    public function store(Request $request)
    {
        $authUser = Auth::user();
        
        // Check plan limits for company users
        if ($authUser->type === 'company' && $authUser->plan) {
            $currentBioLinks = BioLink::where('created_by', $authUser->id)->count();
            $maxBioLinks = $authUser->plan->bio_links;
            
            if ($currentBioLinks >= $maxBioLinks) {
                return redirect()->back()->with('error', __('Bio link limit exceeded. Your plan allows maximum :max bio links. Please upgrade your plan.', ['max' => $maxBioLinks]));
            }
        }
        // Check plan limits for staff users (created by company users)
        elseif ($authUser->type !== 'superadmin' && $authUser->created_by) {
            $companyUser = User::find($authUser->created_by);
            if ($companyUser && $companyUser->type === 'company' && $companyUser->plan) {
                $currentBioLinks = BioLink::where('created_by', $companyUser->id)->count();
                $maxBioLinks = $companyUser->plan->bio_links;
                
                if ($currentBioLinks >= $maxBioLinks) {
                    return redirect()->back()->with('error', __('Bio link limit exceeded. Your company plan allows maximum :max bio links. Please contact your administrator.', ['max' => $maxBioLinks]));
                }
            }
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'link_type' => 'required|string',
            'custom_domain' => 'nullable|string|max:255',
            'url_prefix' => 'nullable|string|max:255',
            'password' => 'nullable|string',
            'password_enabled' => 'boolean',
            'config' => 'required|array',
        ]);
        
        // Validate using centralized service
        $validationErrors = DomainValidationService::validateBioLink($validated);
        if (!empty($validationErrors)) {
            return back()->withErrors($validationErrors);
        }

        $data = $validated;
        
        // Hash password if provided
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        // Determine the creator ID based on user type
        
        // Convert media URLs to relative paths in config
        if (isset($data['config'])) {
            $data['config'] = $this->convertMediaUrlsToRelativePaths($data['config']);
        }
        
        // Create the bio link
        $bioLink = new BioLink();
        $bioLink->created_by = $authUser->id;
        $bioLink->name = $data['name'];
        $bioLink->slug = $data['slug'];
        $bioLink->link_type = $data['link_type'];
        $bioLink->custom_domain = $data['custom_domain'] ?? null;
        $bioLink->url_prefix = $data['url_prefix'] ?? 'bio';
        $bioLink->password = $data['password'] ?? null;
        $bioLink->password_enabled = $data['password_enabled'] ?? false;
        $bioLink->config = $data['config'];
        $bioLink->is_active = true; // Ensure bio link is active by default
        $bioLink->save();

        // Create domain request if custom domain or subdomain is used
        if (in_array($request['domain_type'], ['domain', 'subdomain'])) {
            if ($request['domain_type'] == 'domain' && isset($request['custom_domain'])) {
                $existingRequest = DomainRequest::where('biolink_id', $bioLink->id)
                ->where('domain', $request['custom_domain'])
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'biolink_id' => $bioLink->id,
                        'user_id' => auth()->id(),
                        'domain' => $request['custom_domain'],
                        'status' => 'pending'
                    ]);
                }
            }

            if ($request['domain_type'] == 'subdomain' && isset($request['slug'])) {
                $domain = $request['slug'].'.'.$request->getHost();;
                $existingRequest = DomainRequest::where('biolink_id', $bioLink->id)
                ->where('domain', $domain)
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'biolink_id' => $bioLink->id,
                        'user_id' => auth()->id(),
                        'domain' => $domain,
                        'status' => 'pending'
                    ]);
                }
            }
        }

        return redirect()->route('link-bio-builder.index')
            ->with('success', __('Bio link created successfully.'));
    }

    /**
     * Show the form for editing the specified bio link.
     */
    public function edit(BioLink $bioLink)
    {
        $user = auth()->user();
        
        // Check if user's plan has Bio Link feature
        if ($user->plan && !$user->plan->hasFeature('bio_link')) {
            return redirect()->route('dashboard')
                ->with('error', __('Bio Link feature is not available in your current plan'));
        }
        // Verify user has access to this Bio Link
        // $authUser = Auth::user();
        
        // $hasAccess = false;
        // if ($authUser->type === 'superadmin' || $authUser->type === 'super admin') {
        //     $hasAccess = true;
        // } elseif ($authUser->type === 'company') {
        //     $hasAccess = $bioLink->created_by === $authUser->id;
        // } else {
        //     // Staff users can only edit Bio Links created by their company
        //     if ($authUser->can('manage-bio-link-builder') || $authUser->can('edit-bio-link-builder')) {
        //         $hasAccess = $bioLink->created_by === $authUser->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to edit this Bio Link.');
        // }

        $user = Auth::user()->load(['plan', 'roles']);
        
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
        $bioLink = $this->convertRelativePathsToUrlsForEdit($bioLink);
        
        return Inertia::render('link-bio-builder/edit', [
            'bioLink' => $bioLink,
            'userPlan' => $userPlan,
            'planFeatures' => $planFeatures,
            'userRole' => $user->roles->pluck('name')->first() ?? $user->type,
            'themeImages' => []
        ]);
    }

    /**
     * Update the specified bio link in storage.
     */
    public function update(Request $request, BioLink $bioLink)
    {
        // Verify user has access to this Bio Link
        // $authUser = Auth::user();
        
        // $hasAccess = false;
        // if ($authUser->type === 'superadmin' || $authUser->type === 'super admin') {
        //     $hasAccess = true;
        // } elseif ($authUser->type === 'company') {
        //     $hasAccess = $bioLink->created_by === $authUser->id;
        // } else {
        //     // Staff users can only update Bio Links created by their company
        //     if ($authUser->can('manage-bio-link-builder') || $authUser->can('edit-bio-link-builder')) {
        //         $hasAccess = $bioLink->created_by === $authUser->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to update this Bio Link.');
        // }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'link_type' => 'required|string',
            'custom_domain' => 'nullable|string|max:255',
            'url_prefix' => 'nullable|string|max:255',
            'password' => 'nullable|string',
            'password_enabled' => 'boolean',
            'config' => 'required|array',
        ]);
        
        // Validate using centralized service (excluding current bio link)
        $validationErrors = DomainValidationService::validateBioLink($validated, $bioLink->id);
        if (!empty($validationErrors)) {
            return back()->withErrors($validationErrors);
        }

        $data = $validated;
        
        // Only update password if a new one is provided
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        // Convert media URLs to relative paths in config
        if (isset($data['config'])) {
            $data['config'] = $this->convertMediaUrlsToRelativePaths($data['config']);
        }
        
        $bioLink->update($data);

        if (in_array($request['domain_type'], ['domain', 'subdomain'])) {
            if ($request['domain_type'] == 'domain' && isset($request['custom_domain'])) {
                $existingRequest = DomainRequest::where('biolink_id', $bioLink->id)
                ->where('domain', $request['custom_domain'])
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create(attributes: [
                        'biolink_id' => $bioLink->id,
                        'user_id' => auth()->id(),
                        'domain' => $request['custom_domain'],
                        'status' => 'pending'
                    ]);
                }
            }

            if ($request['domain_type'] == 'subdomain' && isset($request['slug'])) {
                $domain = $request['slug'].'.'.$request->getHost();;
                $existingRequest = DomainRequest::where('biolink_id', $bioLink->id)
                ->where('domain', $domain)
                ->first();
                if (!$existingRequest) {
                    DomainRequest::create([
                        'biolink_id' => $bioLink->id,
                        'user_id' => auth()->id(),
                        'domain' => $domain,
                        'status' => 'pending'
                    ]);
                }
            }
        }
        return redirect()->route('link-bio-builder.index')
            ->with('success', __('Bio link updated successfully.'));
    }

    /**
     * Remove the specified bio link from storage.
     */
    public function destroy(BioLink $bioLink)
    {
        // Verify user has access to this Bio Link
        // $authUser = Auth::user();
        
        // $hasAccess = false;
        // if ($authUser->type === 'superadmin' || $authUser->type === 'super admin') {
        //     $hasAccess = true;
        // } elseif ($authUser->type === 'company') {
        //     $hasAccess = $bioLink->created_by === $authUser->id;
        // } else {
        //     // Staff users can only delete Bio Links created by their company
        //     if ($authUser->can('manage-bio-link-builder') || $authUser->can('delete-bio-link-builder')) {
        //         $hasAccess = $bioLink->created_by === $authUser->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to delete this Bio Link.');
        // }

        $bioLink->delete();

        return redirect()->route('link-bio-builder.index')
            ->with('success', __('Bio link deleted successfully.'));
    }

    /**
     * Check if a slug is available.
     */
    public function checkSlug(Request $request)
    {
        $slug = $request->input('slug');
        $bioLinkId = $request->input('bio_link_id');
        $urlPrefix = $request->input('url_prefix', 'bio');
        
        $available = DomainValidationService::isSlugAvailable($slug, $urlPrefix, null, $bioLinkId);
        
        return response()->json([
            'available' => $available,
            'slug' => $slug
        ]);
    }
    
    /**
     * Preview a bio link from localStorage data.
     */
    public function preview()
    {
        return Inertia::render('public/BioLinkPreview', [
            'themeImages' => []
        ]);
    }
    
    /**
     * Generate a slug from a name.
     */
    public function generateSlug(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        
        $name = $request->input('name');
        $bioLinkId = $request->input('bio_link_id');
        $urlPrefix = $request->input('url_prefix', 'bio');
        
        if (empty($name)) {
            return response()->json(['slug' => '']);
        }
        
        $slug = $this->generateUniqueSlugAcrossTables($name, $bioLinkId, $urlPrefix);
        
        return response()->json(['slug' => $slug]);
    }
    
    private function generateUniqueSlugAcrossTables($name, $excludeBioLinkId = null, $urlPrefix = 'bio')
    {
        return DomainValidationService::generateUniqueSlug($name, $urlPrefix, null, $excludeBioLinkId);
    }
    
    /**
     * Convert media URLs to relative paths in config
     */
    private function convertMediaUrlsToRelativePaths($config)
    {
        if (!is_array($config)) {
            return $config;
        }
        
        return $this->recursivelyConvertUrls($config);
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
        return is_string($url) && (str_contains($url, '/storage/media/') || str_contains($url, 'media/'));
    }
    
    /**
     * Convert full URL to relative path for storage
     */
    private function convertToRelativePath(string $url): string
    {
        if (!$url) return $url;
        
        // Handle URLs that start with /storage/ (remove the /storage/ prefix)
        if (str_starts_with($url, '/storage/')) {
            $path = substr($url, 9); // Remove '/storage/'
            
            // Add storage type prefix for proper URL generation
            $currentStorageType = getSetting('storage_type', 'local');
            return $currentStorageType . ':' . $path;
        }
        
        // If it's already a relative path, return as is
        if (!str_starts_with($url, 'http')) {
            return $url;
        }
        
        // Extract the path after /storage/ and remove the /storage/ prefix
        $storageIndex = strpos($url, '/storage/');
        if ($storageIndex !== false) {
            $path = substr($url, $storageIndex + 9); // +9 to skip '/storage/'
            
            // Add storage type prefix for proper URL generation
            $currentStorageType = getSetting('storage_type', 'local');
            return $currentStorageType . ':' . $path;
        }
        
        return $url;
    }
    
    /**
     * Show analytics for the specified bio link.
     */
    public function analytics(Request $request, BioLink $bioLink)
    {
        // Verify user has access to this Bio Link
        // $authUser = Auth::user();
        
        // $hasAccess = false;
        // if ($authUser->type === 'superadmin' || $authUser->type === 'super admin') {
        //     $hasAccess = true;
        // } elseif ($authUser->type === 'company') {
        //     $hasAccess = $bioLink->created_by === $authUser->id;
        // } else {
        //     // Staff users can only view analytics for Bio Links created by their company
        //     if ($authUser->can('manage-bio-link-builder') || $authUser->can('analytics-bio-link-builder')) {
        //         $hasAccess = $bioLink->created_by === $authUser->created_by;
        //     }
        // }
        
        // if (!$hasAccess) {
        //     abort(403, 'You do not have permission to view analytics for this Bio Link.');
        // }
        
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        
        // Get analytics data from visits table
        $visitsTable = config('visitor.table_name');
        
        // Page views and unique visitors
        $pageViews = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->count();
            
        $uniqueVisitors = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->distinct('ip')
            ->count('ip');
        
        // Daily page views
        $dailyPageViews = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as views')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
        
        // Top referrers
        $referrers = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->selectRaw('COALESCE(NULLIF(referer, ""), "Direct") as referrer, COUNT(*) as count')
            ->groupBy('referrer')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
        
        // Device types - use platform and browser info to determine device type
        $devices = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->selectRaw('
                CASE 
                    WHEN NULLIF(device, "") IS NOT NULL THEN device
                    WHEN platform LIKE "%Android%" OR platform LIKE "%iOS%" OR platform LIKE "%iPhone%" OR platform LIKE "%iPad%" THEN "Mobile"
                    WHEN platform LIKE "%Windows%" OR platform LIKE "%Mac%" OR platform LIKE "%Linux%" THEN "Desktop"
                    ELSE "Unknown"
                END as device_type, 
                COUNT(*) as count
            ')
            ->groupBy('device_type')
            ->orderBy('count', 'desc')
            ->get()
            ->toArray();
            
        // Platform breakdown
        $platforms = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->selectRaw('COALESCE(NULLIF(platform, ""), "Unknown") as platform_name, COUNT(*) as count')
            ->groupBy('platform_name')
            ->orderBy('count', 'desc')
            ->get()
            ->toArray();
            
        // Browser breakdown
        $browsers = \DB::table($visitsTable)
            ->where('biolink_id', $bioLink->id)
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
            ->selectRaw('COALESCE(NULLIF(browser, ""), "Unknown") as browser_name, COUNT(*) as count')
            ->groupBy('browser_name')
            ->orderBy('count', 'desc')
            ->get()
            ->toArray();
        
        $analytics = [
            'pageViews' => $pageViews,
            'uniqueVisitors' => $uniqueVisitors,
            'dailyPageViews' => $dailyPageViews,
            'referrers' => $referrers,
            'devices' => $devices,
            'platforms' => $platforms,
            'browsers' => $browsers,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];
        
        return Inertia::render('link-bio-builder/analytics', [
            'bioLink' => $bioLink,
            'analytics' => $analytics,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }
    
    /**
     * Check if a domain is available.
     */
    public function checkDomain(Request $request)
    {
        $domain = $request->input('domain');
        $bioLinkId = $request->input('bio_link_id');
        
        $available = DomainValidationService::isDomainAvailable($domain, null, $bioLinkId);
        
        return response()->json([
            'available' => $available,
            'domain' => $domain
        ]);
    }
    
    /**
     * Convert relative media paths to full URLs for editing
     */
    private function convertRelativePathsToUrlsForEdit($bioLink)
    {
        if (isset($bioLink->config)) {
            $bioLink->config = $this->recursivelyConvertPathsToUrlsForBioLink($bioLink->config);
        }
        
        return $bioLink;
    }
    
    /**
     * Recursively convert relative paths to full URLs for bio links
     */
    private function recursivelyConvertPathsToUrlsForBioLink($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_string($value) && $this->isRelativeMediaPathForBioLink($value)) {
                    $data[$key] = $this->convertRelativePathToUrlForBioLink($value);
                } elseif (is_array($value)) {
                    $data[$key] = $this->recursivelyConvertPathsToUrlsForBioLink($value);
                }
            }
        }
        
        return $data;
    }
    
    /**
     * Check if a string is a relative media path for bio links
     */
    private function isRelativeMediaPathForBioLink($path)
    {
        return is_string($path) && str_starts_with($path, 'media/') && !str_starts_with($path, 'http');
    }
    
    /**
     * Convert relative path to full URL for bio links
     */
    private function convertRelativePathToUrlForBioLink(string $path): string
    {
        return getAssetUrl($path);
    }
}