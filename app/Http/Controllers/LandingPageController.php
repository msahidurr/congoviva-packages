<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Plan;
use App\Models\Contact;
use App\Models\LandingPageSetting;
use App\Models\LandingPageCustomPage;
use App\Models\Business;
use App\Models\Campaign;
use App\Models\BioLink;

class LandingPageController extends Controller
{
    public function show(Request $request)
    {
        $host = $request->getHost();
        $business = null;
        
        // Check if it's a subdomain request
        $hostParts = explode('.', $host);
        if (count($hostParts) > 2) {
            $subdomain = $hostParts[0];
            $business = Business::where('slug', $subdomain)
                ->where('domain_type', 'subdomain')
                ->first();
        }
        
        // Check for bio link custom domain first
        if (!$business) {
            $bioLink = BioLink::where('custom_domain', rtrim(preg_replace('/^https?:\/\//', '', $host), '/'))
                ->where('is_active', true)
                ->first();
            
            if ($bioLink) {
                // Track visit for bio link
                $visit = \Shetabit\Visitor\Facade\Visitor::visit($bioLink);
                \DB::table('shetabit_visits')->where('id', $visit->id)->update(['biolink_id' => $bioLink->id]);
                return app(PublicVCardController::class)->handlePasswordProtectionForBio($request, $bioLink);
            }
        }
        
        // If not subdomain or bio link, try business custom domain
        if (!$business) {
            $business = Business::where('custom_domain', rtrim(preg_replace('/^https?:\/\//', '', $host), '/'))
                ->where('domain_type', 'domain')
                ->first();
        }

        if ($business) {
            // Track visit for business
            $visit = \Shetabit\Visitor\Facade\Visitor::visit($business);
            \DB::table('shetabit_visits')->where('id', $visit->id)->update(['business_id' => $business->id]);
            $business->increment('view_count');
            return app(PublicVCardController::class)->handlePasswordProtection($request, $business);
        }
        
        // Track general landing page visit
        \Shetabit\Visitor\Facade\Visitor::visit();
        
        // Check if landing page is enabled in settings
        if (!isLandingPageEnabled()) {
            return redirect()->route('login');
        }
        
        $landingSettings = LandingPageSetting::getSettings();
        
        $plans = Plan::where('is_plan_enable', 'on')->get()->map(function ($plan) {
            $features = [];
            if ($plan->features) {
                $enabledFeatures = $plan->getEnabledFeatures();
                $featureLabels = [
                    'custom_domain' => __('Custom Domain'),
                    'custom_subdomain' => __('Subdomain'),
                    'pwa_support' => __('PWA'),
                    'ai_integration' => __('AI Integration'),
                    'password_protection' => __('Password Protection'),
                    'google_wallet' => __('Google Wallet'),
                    'bio_link' => __('Bio Link Builder'),
                    'vcard_builder' => __('vCard Builder'),
                    'broadcast_email' => __('Broadcast Email'),
                    'custom_css_js' => __('Custom CSS/JS'),
                ];
                foreach ($enabledFeatures as $feature) {
                    if (isset($featureLabels[$feature])) {
                        $features[] = $featureLabels[$feature];
                    }
                }
                
                // Add template sections with count
                $templateSections = $plan->getAllowedTemplateSections();
                if (!empty($templateSections)) {
                    $features[] = __('Template Sections ( :count )', ['count' => count($templateSections)]);
                } else {
                    $features[] = __('Template Sections ( :count )', ['count' => 0]);
                }
            } else {
                // Fallback to legacy columns
                if ($plan->enable_custdomain === 'on') $features[] = __('Custom Domain');
                if ($plan->enable_custsubdomain === 'on') $features[] = __('Subdomain');
                if ($plan->pwa_business === 'on') $features[] = __('PWA');
                if ($plan->enable_chatgpt === 'on') $features[] = __('AI Integration');
                $features[] = __('Template Sections ( :count )', ['count' => 0]);
            }
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $plan->price,
                'yearly_price' => $plan->yearly_price,
                'duration' => $plan->duration,
                'description' => is_array($plan->description) ? '' : ($plan->description ?? ''),
                'features' => $features,
                'stats' => [
                    'businesses' => $plan->business,
                    'users' => $plan->max_users,
                    'storage' => $plan->storage_limit . ' GB',
                    'templates' => is_array($plan->themes) ? count($plan->themes) : 34,
                    'bio_links' => $plan->bio_links,
                    'bio_links_templates' => is_array($plan->bio_links_themes) ? count($plan->bio_links_themes) : 14,
                    'addons' => is_array($plan->addons) ? count($plan->addons) : 0,
                    'addon_names' => is_array($plan->addons) ? \App\Models\Addon::whereIn('package_name', $plan->addons)->pluck('name')->toArray() : []
                ],
                'is_plan_enable' => $plan->is_plan_enable,
                'is_popular' => false // Will be set based on subscriber count
            ];
        });
        
        // Mark most subscribed plan as popular
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
            
            $plans = $plans->map(function($plan) use ($mostSubscribedPlanId) {
                if ($plan['id'] == $mostSubscribedPlanId && $plan['price'] != '0') {
                    $plan['is_popular'] = true;
                }
                return $plan;
            });
        }
        
        // Get active campaigns with business information
        $activeCampaigns = Campaign::activeCampaigns()
            ->with(['business:id,name,slug,url_prefix,custom_domain'])
            ->orderBy('end_date', 'asc')
            ->limit(6)
            ->get()
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'name' => $campaign->name,
                    'description' => $campaign->description,
                    'start_date' => $campaign->start_date->format('Y-m-d'),
                    'end_date' => $campaign->end_date->format('Y-m-d'),
                    'business' => [
                        'id' => $campaign->business->id,
                        'name' => $campaign->business->name,
                        'slug' => $campaign->business->slug,
                        'url_prefix' => $campaign->business->url_prefix,
                        'custom_domain' => $campaign->business->custom_domain,
                    ]
                ];
            });
        
        return Inertia::render('landing-page/index', [
            'plans' => $plans,
            'testimonials' => [],
            'faqs' => [],
            'customPages' => LandingPageCustomPage::active()->ordered()->get(['id', 'title', 'slug', 'is_active']) ?? [],
            'settings' => array_merge($landingSettings->toArray(), [
                'business_directory_enabled' => getSetting('business_directory_enabled', '1'),
                'registrationEnabled' => getSetting('registrationEnabled', true)
            ]),
            'activeCampaigns' => $activeCampaigns,
            'seo_data' => [
                'meta_title' => $landingSettings->config_sections['seo']['meta_title'] ?? getSetting('titleText', 'vCard'),
                'meta_description' => $landingSettings->config_sections['seo']['meta_description'] ?? getSetting('metaDescription'),
                'keywords' => $landingSettings->config_sections['seo']['meta_keywords'] ?? getSetting('metaKeywords'),
                'og_image' => getSetting('metaImage') ? getAssetUrl(getSetting('metaImage')) : null
            ]
        ]);
    }

    public function submitContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'phone' => $request->phone,
            'is_landing_page' => true,
            'business_id' => null
        ]);

        return back()->with('success', __('Thank you for your message. We will get back to you soon!'));
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255|unique:newsletters,email'
        ]);

        \App\Models\Newsletter::create([
            'email' => $request->email,
            'status' => 'active',
            'subscribed_at' => now()
        ]);

        return back()->with('success', __('Thank you for subscribing to our newsletter!'));
    }

    public function settings()
    {
        $landingSettings = LandingPageSetting::getSettings();
        
        return Inertia::render('landing-page/settings', [
            'settings' => $landingSettings
        ]);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'required|string|max:255',
            'contact_address' => 'required|string|max:255',
            'config_sections' => 'required|array'
        ]);
        
        $landingSettings = LandingPageSetting::getSettings();
        
        // Merge existing config_sections with new data to preserve existing sections
        $existingConfig = $landingSettings->config_sections ?? [];
        $newConfig = array_merge($existingConfig, $request->config_sections);
        
        $landingSettings->update([
            'company_name' => $request->company_name,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
            'contact_address' => $request->contact_address,
            'config_sections' => $newConfig
        ]);

        return back()->with('success', __('Landing page settings updated successfully!'));
    }

    public function templates()
    {
        $landingSettings = LandingPageSetting::getSettings();
        
        // Get templates from landing page settings or use default
        $templatesData = $landingSettings->config_sections['sections'] ?? [];
        $templatesSection = collect($templatesData)->firstWhere('key', 'templates');
        $templates = $templatesSection['templates_list'] ?? [];
        
        return Inertia::render('landing-page/templates', [
            'settings' => $landingSettings,
            'templates' => $templates,
            'customPages' => LandingPageCustomPage::active()->ordered()->get() ?? []
        ]);
    }
}