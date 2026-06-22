<?php

namespace App\Http\Controllers\LandingPage;

use App\Http\Controllers\Controller;
use App\Models\LandingPageCustomPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomPageController extends Controller
{
    public function index(Request $request)
    {
        $query = LandingPageCustomPage::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort_field', 'sort_order');
        $sortDirection = $request->get('sort_direction', 'asc');
        
        if (in_array($sortField, ['title', 'created_at', 'sort_order'])) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->ordered();
        }

        $pages = $query->paginate($request->get('per_page', 10))
                      ->withQueryString();

        return Inertia::render('landing-page/custom-pages/index', [
            'pages' => $pages,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'slug' => 'nullable|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        // Generate unique slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['title']);
        } else {
            // Ensure provided slug is unique
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['slug']);
        }

        LandingPageCustomPage::create($validated);

        return back()->with('success', __('Custom page created successfully!'));
    }

    public function update(Request $request, LandingPageCustomPage $customPage)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string',
            'slug' => 'nullable|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        // Generate unique slug if slug is provided and different
        if (!empty($validated['slug']) && $validated['slug'] !== $customPage->slug) {
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['slug'], $customPage->id);
        } elseif (empty($validated['slug']) && $request->has('title') && $validated['title'] !== $customPage->title) {
            // Regenerate slug if title changed but no slug provided
            $validated['slug'] = LandingPageCustomPage::generateUniqueSlug($validated['title'], $customPage->id);
        }

        $customPage->update($validated);

        return back()->with('success', __('Custom page updated successfully!'));
    }

    public function destroy(LandingPageCustomPage $customPage)
    {
        $customPage->delete();
        return back()->with('success', __('Custom page deleted successfully!'));
    }

    public function show($slug)
    {
        // First try to find in database
        $page = LandingPageCustomPage::where('slug', $slug)->where('is_active', true)->first();
        
        if ($page) {
            // Database page found - return all fields
            $pageData = [
                'title' => $page->title,
                'subtitle' => $page->subtitle,
                'content' => $page->content,
                'slug' => $page->slug,
                'meta_title' => $page->meta_title ?: $page->title,
                'meta_description' => $page->meta_description
            ];
        } else {
            // Check settings-based custom pages
            $landingSettings = \App\Models\LandingPageSetting::getSettings();
            $customPages = $landingSettings['config_sections']['custom_pages'] ?? [];
            $sections = $landingSettings['config_sections']['sections'] ?? [];
            
            // Find the custom page entry first
            $customPageEntry = collect($customPages)->first(function($page) use ($slug) {
                return ($page['slug'] ?? '') === $slug;
            });
            
            if ($customPageEntry) {
                // Find the corresponding section using the key
                $settingsPage = collect($sections)->first(function($section) use ($customPageEntry) {
                    return ($section['key'] ?? '') === ($customPageEntry['key'] ?? '');
                });
            } else {
                $settingsPage = null;
            }
            if ($settingsPage) {
                // Check if page is active (default to true if not specified)
                $isActive = $settingsPage['active'] ?? true;
                
                if ($isActive) {
                    // Create page data from sections
                    $pageData = [
                        'title' => $settingsPage['title'] ?? '',
                        'subtitle' => $settingsPage['subtitle'] ?? '',
                        'content' => $settingsPage['content'] ?? '',
                        'slug' => $slug,
                        'meta_title' => $settingsPage['title'] ?? '',
                        'meta_description' => $settingsPage['description'] ?? ''
                    ];
                } else {
                    abort(404);
                }
            } else {
                abort(404);
            }
        }
        
        $landingSettings = \App\Models\LandingPageSetting::getSettings();
        
        // Add business directory setting from global settings
        $landingSettings->business_directory_enabled = getSetting('business_directory_enabled', true);
        
        // Track page visit for super admin analytics
        \Shetabit\Visitor\Facade\Visitor::visit();
        
        return Inertia::render('landing-page/custom-page', [
            'page' => $pageData,
            'customPages' => LandingPageCustomPage::active()->ordered()->get(['id', 'title', 'slug', 'is_active']),
            'settings' => $landingSettings
        ]);
    }

    public function checkSlug(Request $request)
    {
        $request->validate([
            'slug' => 'required|string|max:255',
            'exclude_id' => 'nullable|integer'
        ]);

        $exists = LandingPageCustomPage::slugExists($request->slug, $request->exclude_id);
        
        return response()->json([
            'available' => !$exists,
            'exists' => $exists
        ]);
    }

    public function generateSlug(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'exclude_id' => 'nullable|integer'
        ]);

        $slug = LandingPageCustomPage::generateUniqueSlug($request->title, $request->exclude_id);
        
        return response()->json([
            'slug' => $slug
        ]);
    }
}