<?php

namespace Workdo\Event\Http\Controllers;

use Workdo\Event\Models\Event;
use Workdo\Event\Models\EventAnalytics;
use Workdo\Event\Models\EventMarketplace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::where('user_id', Auth::id());
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }
        
        $events = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Event/index', [
            'events' => $events,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Event/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'event_type' => 'required|string',
            'config_sections' => 'required|array'
        ]);

        $slug = $this->generateUniqueSlug($validated['name']);
        
        $event = Event::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'slug' => $slug,
            'event_type' => $validated['event_type'],
            'config_sections' => $validated['config_sections']
        ]);

        $this->generateQrCode($event);

        return redirect()->route('event-qr-code.index')
            ->with('success', __('Event created successfully.'));
    }

    public function show(Request $request, $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        if (!$request->has('preview')) {
            EventAnalytics::create([
                'event_id' => $event->id,
                'visitor_id' => auth()->user()?->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->header('User-Agent'),
                'referer' => $request->header('Referer'),
                'viewed_at' => now()
            ]);
        }

        return Inertia::render('Event/public/EventView', [
            'event' => $event
        ]);
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }
        
        return Inertia::render('Event/edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'event_type' => 'required|string',
            'config_sections' => 'required|array'
        ]);

        $event->update($validated);
        $this->generateQrCode($event);

        return redirect()->route('event-qr-code.index')
            ->with('success', __('Event updated successfully.'));
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }

        if ($event->qr_code_path) {
            Storage::disk('public')->delete($event->qr_code_path);
        }

        $event->delete();

        return redirect()->route('event-qr-code.index')
            ->with('success', __('Event deleted successfully.'));
    }

    public function analytics(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        if ($event->user_id != Auth::id()) {
            abort(403);
        }
        
        $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));
        
        $pageViews = EventAnalytics::where('event_id', $event->id)
            ->whereBetween('viewed_at', [$startDate, $endDate . ' 23:59:59'])
            ->count();
            
        $uniqueVisitors = EventAnalytics::where('event_id', $event->id)
            ->whereBetween('viewed_at', [$startDate, $endDate . ' 23:59:59'])
            ->distinct('ip_address')
            ->count('ip_address');
        
        $dailyViews = EventAnalytics::where('event_id', $event->id)
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
        
        return Inertia::render('Event/analytics', [
            'event' => $event,
            'analytics' => $analytics,
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }

    public function preview(Request $request)
    {
        return Inertia::render('Event/public/EventPreview', [
            'previewData' => $request->all()
        ]);
    }

    private function generateUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (Event::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    public function marketplace()
    {
        $marketplaceData = [
            'title' => EventMarketplace::getValue('title', __('Event QR Code Add-on')),
            'subtitle' => EventMarketplace::getValue('subtitle', __('Create professional event experiences with QR codes.')),
            'demo_button_text' => EventMarketplace::getValue('demo_button_text', __('View Demo')),
            'get_started_button_text' => EventMarketplace::getValue('get_started_button_text', __('Get Started')),
            'demo_button_link' => EventMarketplace::getValue('demo_button_link', ''),
            'primary_color' => EventMarketplace::getValue('primary_color', '#10b77f'),
            'secondary_color' => EventMarketplace::getValue('secondary_color', '#3b82f6'),
            'accent_color' => EventMarketplace::getValue('accent_color', '#8b5cf6'),
            'background_image' => EventMarketplace::getValue('background_image', ''),
            'use_background_image' => EventMarketplace::getValue('use_background_image', false),
            'features' => EventMarketplace::getValue('features', []),
            'stats' => EventMarketplace::getValue('stats', []),
            'screenshots' => EventMarketplace::getValue('screenshots', []),
            'screenshots_title' => EventMarketplace::getValue('screenshots_title', __('See Event QR Code in Action')),
            'screenshots_subtitle' => EventMarketplace::getValue('screenshots_subtitle', __('Discover how easy it is to create and manage event QR codes with our intuitive interface and powerful features.')),
            'features_title' => EventMarketplace::getValue('features_title', __('Powerful Features')),
            'features_subtitle' => EventMarketplace::getValue('features_subtitle', __('Everything you need for professional event QR code management')),
            'features_show_icons' => EventMarketplace::getValue('features_show_icons', true),
            'features_layout' => EventMarketplace::getValue('features_layout', 'grid'),
            'features_columns' => EventMarketplace::getValue('features_columns', 4),
            'features_background_color' => EventMarketplace::getValue('features_background_color', '#ffffff'),
            'features_icon_color' => EventMarketplace::getValue('features_icon_color', '#10b77f'),
            'config_sections' => EventMarketplace::getValue('config_sections', [
                'section_order' => ['hero', 'features', 'stats', 'screenshots'],
                'section_visibility' => [
                    'hero' => true,
                    'features' => true,
                    'stats' => true,
                    'screenshots' => true
                ]
            ])
        ];
        
        return Inertia::render('Event/marketplace/index', [
            'marketplaceData' => $marketplaceData
        ]);
    }

    public function marketplaceSettings()
    {
        $marketplaceData = [
            'title' => EventMarketplace::getValue('title', __('Event QR Code Add-on')),
            'subtitle' => EventMarketplace::getValue('subtitle', __('Create professional event experiences with QR codes.')),
            'demo_button_text' => EventMarketplace::getValue('demo_button_text', __('View Demo')),
            'get_started_button_text' => EventMarketplace::getValue('get_started_button_text', __('Get Started')),
            'demo_button_link' => EventMarketplace::getValue('demo_button_link', ''),
            'primary_color' => EventMarketplace::getValue('primary_color', '#10b77f'),
            'secondary_color' => EventMarketplace::getValue('secondary_color', '#3b82f6'),
            'accent_color' => EventMarketplace::getValue('accent_color', '#8b5cf6'),
            'background_image' => EventMarketplace::getValue('background_image', ''),
            'use_background_image' => EventMarketplace::getValue('use_background_image', false),
            'features' => EventMarketplace::getValue('features', []),
            'stats' => EventMarketplace::getValue('stats', []),
            'screenshots' => EventMarketplace::getValue('screenshots', []),
            'screenshots_title' => EventMarketplace::getValue('screenshots_title', __('See Event QR Code in Action')),
            'screenshots_subtitle' => EventMarketplace::getValue('screenshots_subtitle', __('Discover how easy it is to create and manage event QR codes with our intuitive interface and powerful features.')),
            'features_title' => EventMarketplace::getValue('features_title', __('Powerful Features')),
            'features_subtitle' => EventMarketplace::getValue('features_subtitle', __('Everything you need for professional event QR code management')),
            'features_show_icons' => EventMarketplace::getValue('features_show_icons', true),
            'features_layout' => EventMarketplace::getValue('features_layout', 'grid'),
            'features_columns' => EventMarketplace::getValue('features_columns', 4),
            'features_background_color' => EventMarketplace::getValue('features_background_color', '#ffffff'),
            'features_icon_color' => EventMarketplace::getValue('features_icon_color', '#10b77f'),
            'config_sections' => EventMarketplace::getValue('config_sections', [
                'section_order' => ['hero', 'features', 'stats', 'screenshots'],
                'section_visibility' => [
                    'hero' => true,
                    'features' => true,
                    'stats' => true,
                    'screenshots' => true
                ]
            ])
        ];
        
        return Inertia::render('Event/marketplace/settings', [
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
            EventMarketplace::setValue($key, $value);
        }

        return redirect()->route('event.marketplace.settings')
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
        return Inertia::render('Event/templates');
    }

    private function generateQrCode(Event $event)
    {
        try {
            $url = $event->event_url;
            $qrCodeUrl = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" . urlencode($url);
            
            $qrCodeData = file_get_contents($qrCodeUrl);
            
            if ($qrCodeData !== false) {
                $filename = 'qr-codes/event-' . $event->id . '.png';
                Storage::disk('public')->put($filename, $qrCodeData);
                $event->update(['qr_code_path' => $filename]);
            }
        } catch (\Exception $e) {
            $event->update(['qr_code_path' => null]);
        }
    }
}