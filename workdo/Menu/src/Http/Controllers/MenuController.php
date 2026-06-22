<?php

namespace Workdo\Menu\Http\Controllers;

use Workdo\Menu\Models\Menu;
use Workdo\Menu\Models\MenuAnalytics;
use Workdo\Menu\Models\MenuMarketplace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Menu::where('user_id', Auth::id());
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        $menus = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Menu/index', [
            'menus' => $menus,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Menu/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'menu_type' => 'required|string',
            'config_sections' => 'required|array'
        ]);

        $slug = $this->generateUniqueSlug($validated['name']);
        
        $menu = Menu::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'slug' => $slug,
            'menu_type' => $validated['menu_type'],
            'config_sections' => $validated['config_sections']
        ]);

        $this->generateQrCode($menu);

        return redirect()->route('menu.index')
            ->with('success', __('Menu created successfully.'));
    }

    public function show(Request $request, $slug)
    {
        $menu = Menu::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        if (!$request->has('preview')) {
            MenuAnalytics::create([
                'menu_id' => $menu->id,
                'visitor_id' => auth()->user()?->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'referer' => $request->header('Referer'),
                'viewed_at' => now()
            ]);
        }

        return Inertia::render('Menu/public/MenuView', [
            'menu' => $menu
        ]);
    }

    public function edit($id)
    {
        $menu = Menu::findOrFail($id);
        
        if ($menu->user_id != Auth::id()) {
            abort(403);
        }
        
        return Inertia::render('Menu/edit', [
            'menu' => $menu
        ]);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);
        
        if ($menu->user_id != Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'menu_type' => 'required|string',
            'config_sections' => 'required|array'
        ]);

        $menu->update($validated);
        $this->generateQrCode($menu);

        return redirect()->route('menu.index')
            ->with('success', __('Menu updated successfully.'));
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);
        
        if ($menu->user_id != Auth::id()) {
            abort(403);
        }

        if ($menu->qr_code_path) {
            Storage::disk('public')->delete($menu->qr_code_path);
        }

        $menu->delete();

        return redirect()->route('menu.index')
            ->with('success', __('Menu deleted successfully.'));
    }

    public function analytics(Request $request, $id)
    {
        $menu = Menu::findOrFail($id);
        
        if ($menu->user_id != Auth::id()) {
            abort(403);
        }
        
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        
        $pageViews = MenuAnalytics::where('menu_id', $menu->id)
            ->whereBetween('viewed_at', [$startDate, $endDate . ' 23:59:59'])
            ->count();
            
        $uniqueVisitors = MenuAnalytics::where('menu_id', $menu->id)
            ->whereBetween('viewed_at', [$startDate, $endDate . ' 23:59:59'])
            ->distinct('ip_address')
            ->count('ip_address');
        
        $dailyViews = MenuAnalytics::where('menu_id', $menu->id)
            ->whereBetween('viewed_at', [$startDate, $endDate . ' 23:59:59'])
            ->selectRaw('DATE(viewed_at) as date, COUNT(*) as views')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
        
        $analytics = [
            'pageViews' => $pageViews,
            'uniqueVisitors' => $uniqueVisitors,
            'dailyViews' => $dailyViews,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ];
        
        return Inertia::render('Menu/analytics', [
            'menu' => $menu,
            'analytics' => $analytics,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }

    public function preview(Request $request)
    {
        return Inertia::render('Menu/public/MenuPreview', [
            'previewData' => $request->all()
        ]);
    }

    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (Menu::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    public function marketplace()
    {
        $marketplaceData = [
            'title' => MenuMarketplace::getValue('title', __('Menu QR Code Add-on')),
            'subtitle' => MenuMarketplace::getValue('subtitle', __('Create professional digital menus with QR codes.')),
            'demo_button_text' => MenuMarketplace::getValue('demo_button_text', __('View Demo')),
            'get_started_button_text' => MenuMarketplace::getValue('get_started_button_text', __('Get Started')),
            'demo_button_link' => MenuMarketplace::getValue('demo_button_link', ''),
            'primary_color' => MenuMarketplace::getValue('primary_color', '#D2691E'),
            'secondary_color' => MenuMarketplace::getValue('secondary_color', '#CD853F'),
            'accent_color' => MenuMarketplace::getValue('accent_color', '#F5DEB3'),
            'background_image' => MenuMarketplace::getValue('background_image', ''),
            'use_background_image' => MenuMarketplace::getValue('use_background_image', false),
            'features' => MenuMarketplace::getValue('features', []),
            'stats' => MenuMarketplace::getValue('stats', []),
            'screenshots' => MenuMarketplace::getValue('screenshots', []),
            'screenshots_title' => MenuMarketplace::getValue('screenshots_title', __('See Menu QR Code in Action')),
            'screenshots_subtitle' => MenuMarketplace::getValue('screenshots_subtitle', __('Discover how easy it is to create and manage digital menus with our intuitive interface and powerful features.')),
            'features_title' => MenuMarketplace::getValue('features_title', __('Powerful Features')),
            'features_subtitle' => MenuMarketplace::getValue('features_subtitle', __('Everything you need for professional digital menu management')),
            'features_show_icons' => MenuMarketplace::getValue('features_show_icons', true),
            'features_layout' => MenuMarketplace::getValue('features_layout', 'grid'),
            'features_columns' => MenuMarketplace::getValue('features_columns', 4),
            'features_background_color' => MenuMarketplace::getValue('features_background_color', '#ffffff'),
            'features_icon_color' => MenuMarketplace::getValue('features_icon_color', '#D2691E'),
            'config_sections' => MenuMarketplace::getValue('config_sections', [
                'section_order' => ['hero', 'features', 'stats', 'screenshots'],
                'section_visibility' => [
                    'hero' => true,
                    'features' => true,
                    'stats' => true,
                    'screenshots' => true
                ]
            ])
        ];
        
        return Inertia::render('Menu/marketplace/index', [
            'marketplaceData' => $marketplaceData
        ]);
    }

    public function marketplaceSettings()
    {
        $marketplaceData = [
            'title' => MenuMarketplace::getValue('title', __('Menu QR Code Add-on')),
            'subtitle' => MenuMarketplace::getValue('subtitle', __('Create professional digital menus with QR codes.')),
            'demo_button_text' => MenuMarketplace::getValue('demo_button_text', __('View Demo')),
            'get_started_button_text' => MenuMarketplace::getValue('get_started_button_text', __('Get Started')),
            'demo_button_link' => MenuMarketplace::getValue('demo_button_link', ''),
            'primary_color' => MenuMarketplace::getValue('primary_color', '#D2691E'),
            'secondary_color' => MenuMarketplace::getValue('secondary_color', '#CD853F'),
            'accent_color' => MenuMarketplace::getValue('accent_color', '#F5DEB3'),
            'background_image' => MenuMarketplace::getValue('background_image', ''),
            'use_background_image' => MenuMarketplace::getValue('use_background_image', false),
            'features' => MenuMarketplace::getValue('features', []),
            'stats' => MenuMarketplace::getValue('stats', []),
            'screenshots' => MenuMarketplace::getValue('screenshots', []),
            'screenshots_title' => MenuMarketplace::getValue('screenshots_title', __('See Menu QR Code in Action')),
            'screenshots_subtitle' => MenuMarketplace::getValue('screenshots_subtitle', __('Discover how easy it is to create and manage digital menus with our intuitive interface and powerful features.')),
            'features_title' => MenuMarketplace::getValue('features_title', __('Powerful Features')),
            'features_subtitle' => MenuMarketplace::getValue('features_subtitle', __('Everything you need for professional digital menu management')),
            'features_show_icons' => MenuMarketplace::getValue('features_show_icons', true),
            'features_layout' => MenuMarketplace::getValue('features_layout', 'grid'),
            'features_columns' => MenuMarketplace::getValue('features_columns', 4),
            'features_background_color' => MenuMarketplace::getValue('features_background_color', '#ffffff'),
            'features_icon_color' => MenuMarketplace::getValue('features_icon_color', '#D2691E'),
            'config_sections' => MenuMarketplace::getValue('config_sections', [
                'section_order' => ['hero', 'features', 'stats', 'screenshots'],
                'section_visibility' => [
                    'hero' => true,
                    'features' => true,
                    'stats' => true,
                    'screenshots' => true
                ]
            ])
        ];
        
        return Inertia::render('Menu/marketplace/settings', [
            'marketplaceData' => $marketplaceData
        ]);
    }

    public function updateMarketplaceSettings(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string',
            'demo_button_text' => 'nullable|string|max:50',
            'get_started_button_text' => 'nullable|string|max:50',
            'demo_button_link' => 'nullable|string',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
            'accent_color' => 'nullable|string|max:7',
            'background_image' => 'nullable|string',
            'use_background_image' => 'nullable|boolean',
            'features' => 'nullable|array',
            'features.*.title' => 'nullable|string|max:255',
            'features.*.description' => 'nullable|string',
            'features.*.icon' => 'nullable|string|max:50',
            'stats' => 'nullable|array',
            'stats.*.value' => 'nullable|string|max:20',
            'stats.*.label' => 'nullable|string|max:100',
            'screenshots' => 'nullable|array',
            'screenshots.*.title' => 'nullable|string|max:255',
            'screenshots.*.description' => 'nullable|string',
            'screenshots.*.image' => 'nullable|string',
            'screenshots_title' => 'nullable|string|max:255',
            'screenshots_subtitle' => 'nullable|string',
            'features_title' => 'nullable|string|max:255',
            'features_subtitle' => 'nullable|string',
            'features_show_icons' => 'nullable|boolean',
            'features_layout' => 'nullable|string|in:grid,list,carousel,centered',
            'features_columns' => 'nullable|integer|min:1|max:4',
            'features_background_color' => 'nullable|string|max:7',
            'features_icon_color' => 'nullable|string|max:7',
            'config_sections' => 'nullable|array',
            'config_sections.section_order' => 'nullable|array',
            'config_sections.section_visibility' => 'nullable|array'
        ]);

        // Convert full URLs to relative paths for screenshots and background image
        if (isset($validated['screenshots'])) {
            foreach ($validated['screenshots'] as &$screenshot) {
                if (isset($screenshot['image'])) {
                    $screenshot['image'] = $this->convertToRelativePath($screenshot['image']);
                }
            }
        }
        
        if (isset($validated['background_image'])) {
            $validated['background_image'] = $this->convertToRelativePath($validated['background_image']);
        }

        foreach ($validated as $key => $value) {
            MenuMarketplace::setValue($key, $value);
        }

        return redirect()->route('menu.marketplace.settings')
            ->with('success', __('Marketplace settings updated successfully.'));
    }

    private function convertToRelativePath(string $url): string
    {
        if (!$url) return $url;
        if (!str_starts_with($url, 'http')) {
            return $url;
        }
        
        $storageIndex = strpos($url, '/storage/');
        if ($storageIndex !== false) {
            return substr($url, $storageIndex);
        }        
        return $url;
    }

    public function templates()
    {
        return Inertia::render('Menu/templates');
    }

    private function generateQrCode(Menu $menu)
    {
        try {
            $url = $menu->menu_url;
            $qrCodeUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . urlencode($url);
            
            $qrCodeData = file_get_contents($qrCodeUrl);
            
            if ($qrCodeData !== false) {
                $filename = 'qr-codes/menu-' . $menu->id . '.png';
                Storage::disk('public')->put($filename, $qrCodeData);
                $menu->update(['qr_code_path' => $filename]);
            }
        } catch (\Exception $e) {
            $menu->update(['qr_code_path' => null]);
        }
    }
}
