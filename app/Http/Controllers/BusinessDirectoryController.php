<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\LandingPageSetting;
use App\Models\BusinessDirectorySetting;
use App\Models\BusinessDirectoryCustomPage;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessDirectoryController extends Controller
{
    public function index(Request $request)
    {
        // Check if Business Directory feature is enabled (skip for super admin)
        if (!auth()->check() || !auth()->user()->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'business_directory_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'error' => __('Business directory setting is currently disabled')
                    ], 403);
                }
                
                if (auth()->check()) {
                    return redirect()->route('dashboard')
                        ->with('error', __('Business directory setting is currently disabled'));
                } else {
                    return redirect()->route('home')
                        ->with('error', __('Business directory setting is currently disabled'));
                }
            }
        }
        
        $query = Business::query();
        
        // Show all businesses in directory
        // $query->visibleInDirectory(); // Commented out to show all businesses
        
        // Filter by user role - companies see only their own, Super Admin sees all
        // Public users see all businesses
        if (auth()->check() && !auth()->user()->isSuperAdmin()) {
            $query->where('created_by', auth()->id());
        }
        
        // Search filter
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('business_type', 'like', '%' . $request->search . '%');
            });
        }
        
        // Category filter
        if ($request->category && $request->category !== 'all') {
            $query->where('business_type', $request->category);
        }
        
        // Sorting
        $sortBy = $request->get('sort', 'views');
        switch ($sortBy) {
            case 'name':
                $query->orderBy('name');
                break;
            case 'newest':
                $query->orderByDesc('created_at');
                break;
            case 'oldest':
                $query->orderBy('created_at');
                break;
            case 'views':
            default:
                $query->orderByDesc('view_count');
                break;
        }
        
        $businesses = $query->paginate(12)->appends($request->only(['search', 'category', 'sort']));
        
        // Get all business types with counts
        $allBusinessTypes = [
            'freelancer', 'doctor', 'restaurant', 'realestate', 'fitness', 'photography', 'lawfirm', 'cafe',
            'salon', 'construction', 'eventplanner', 'ecommerce', 'travel', 'gym', 'bakery', 'fitness-studio',
            'tech-startup', 'music-artist', 'wedding-planner', 'pet-care', 'digital-marketing', 'automotive',
            'beauty-cosmetics', 'food-delivery', 'home-services', 'personal-trainer', 'consulting', 'graphic-design',
            'yoga-wellness', 'podcast-creator', 'gaming-streamer', 'life-coach', 'veterinarian', 'architect-designer','hotel-resorts','insurance','neutral-professional','influencer','actor','car-mechanic','sports-academy'
        ];
        
        $businessCountsQuery = Business::select('business_type', \DB::raw('count(*) as count'));
            // ->visibleInDirectory(); // Commented out to count all businesses
        
        // Apply same user role filter for counts
        if (auth()->check() && !auth()->user()->isSuperAdmin()) {
            $businessCountsQuery->where('created_by', auth()->id());
        }
        
        $businessCounts = $businessCountsQuery->groupBy('business_type')
            ->pluck('count', 'business_type');
            
        $categories = collect($allBusinessTypes)->map(function($type) use ($businessCounts) {
            return [
                'value' => $type,
                'label' => ucfirst(str_replace('-', ' ', $type)),
                'count' => $businessCounts[$type] ?? 0
            ];
        })->values();
        
        // Get landing page settings for header/footer
        $settings = LandingPageSetting::getSettings();
        

            
        // Get directory custom pages for navigation
        $directoryCustomPages = BusinessDirectoryCustomPage::active()
            ->ordered()
            ->get(['id', 'title', 'slug']);
            
        // Get directory settings for menu and configuration
        $directorySettings = BusinessDirectorySetting::getSettings();
        
        return Inertia::render('business-directory/index', [
            'businesses' => $businesses,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'sort']),
            'settings' => $settings,

            'directoryCustomPages' => $directoryCustomPages,
            'directorySettings' => $directorySettings
        ]);
    }
    
    public function show(Business $business)
    {
        // Check if Business Directory feature is enabled (skip for super admin)
        if (!auth()->check() || !auth()->user()->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'business_directory_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                if (auth()->check()) {
                    return redirect()->route('dashboard')
                        ->with('error', __('Business directory setting is currently disabled'));
                } else {
                    return redirect()->route('home')
                        ->with('error', __('Business directory setting is currently disabled'));
                }
            }
        }
        
        $user = auth()->user();
        // Track visit with business_id
        $visit = \Shetabit\Visitor\Facade\Visitor::visit($business);
        \DB::table('shetabit_visits')->where('id', $visit->id)->update(['business_id' => $business->id]);
        $business->increment('view_count');
        
        return Inertia::render('business-directory/show', [
            'business' => $business
        ]);
    }

}