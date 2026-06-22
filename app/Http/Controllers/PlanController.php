<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\PlanRequest;
use App\Models\PlanOrder;
use App\Models\Addon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlanController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Company users see only active plans
        if ($user->type !== 'superadmin') {
            return $this->companyPlansView($request);
        }
        
        // Admin view
        $billingCycle = $request->input('billing_cycle', 'monthly');
        
        // Filter plans based on billing cycle and duration
        $dbPlans = Plan::where(function($query) use ($billingCycle) {
            $query->where('duration', $billingCycle)
                  ->orWhere('duration', 'both');
        })->get();
        $hasDefaultPlan = $dbPlans->where('is_default', true)->count() > 0;
        
        $plans = $dbPlans->map(function ($plan) use ($billingCycle) {
            // Get features from the new features column or fallback to legacy columns
            $features = [];
            $templateSectionsCount = 0;
            if ($plan->features) {
                $enabledFeatures = $plan->getEnabledFeatures();
                $featureKeys = [
                    'custom_domain' => 'Custom Domain',
                    'custom_subdomain' => 'Subdomain',
                    'pwa_support' => 'PWA',
                    'ai_integration' => 'AI Integration',
                    'password_protection' => 'Password Protection',
                    'custom_css_js' => 'Custom CSS/JS',
                    'google_wallet' => 'Google Wallet',
                    'bio_link' => 'Bio Link',
                    'vcard_builder' => 'vCard Builder',
                    'broadcast_email' => 'Broadcast Email'
                ];
                foreach ($enabledFeatures as $feature) {
                    if (isset($featureKeys[$feature])) {
                        $features[] = $featureKeys[$feature];
                    }
                }
                
                // Get template sections count
                $templateSections = $plan->getAllowedTemplateSections();
                $templateSectionsCount = count($templateSections);
            } else {
                // Fallback to legacy columns
                if ($plan->enable_custdomain === 'on') $features[] = 'Custom Domain';
                if ($plan->enable_custsubdomain === 'on') $features[] = 'Subdomain';
                if ($plan->pwa_business === 'on') $features[] = 'PWA';
                if ($plan->enable_chatgpt === 'on') $features[] = 'AI Integration';
                $templateSectionsCount = 0;
            }
            
            // Get price based on billing cycle
            $price = $billingCycle === 'yearly' ? $plan->yearly_price : $plan->price;
            
            // Format price with currency symbol
            $formattedPrice = '$' . number_format($price, 2);
            
            // Set duration based on billing cycle
            $duration = $billingCycle === 'yearly' ? 'Yearly' : 'Monthly';
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $price,
                'formattedPrice' => $formattedPrice,
                'duration' => $duration,
                'description' => $plan->description,
                'trial_days' => $plan->trial_day,
                'features' => $features,
                'stats' => [
                    'businesses' => $plan->business,
                    'users' => $plan->max_users,
                    'storage' => $plan->storage_limit . ' GB',
                    'templates' => is_array($plan->themes) ? count($plan->themes) : 34,
                    'bio_links' => $plan->bio_links,
                    'bio_links_templates' => is_array($plan->bio_links_themes) ? count($plan->bio_links_themes) : 14,
                    'addons' => is_array($plan->addons) ? count($plan->addons) : 0,
                    'addon_names' => is_array($plan->addons) ? Addon::whereIn('package_name', $plan->addons)->pluck('name')->toArray() : [],
                    'template_sections' => $templateSectionsCount
                ],
                'status' => $plan->is_plan_enable === 'on',
                'is_default' => $plan->is_default,
                'recommended' => false // Default to false
            ];
        })->toArray();
        
        // Mark the plan with most subscribers as recommended
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        $mostSubscribedPlanId = $planSubscriberCounts->keys()->first();
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
        }
        
        foreach ($plans as &$plan) {
            if ($plan['id'] == $mostSubscribedPlanId && $plan['price'] != '0') {
                $plan['recommended'] = true;
                break;
            }
        }

        return Inertia::render('plans/index', [
            'plans' => $plans,
            'billingCycle' => $billingCycle,
            'hasDefaultPlan' => $hasDefaultPlan,
            'isAdmin' => true
        ]);
    }
    
    /**
     * Toggle plan status
     */
    public function toggleStatus(Plan $plan)
    {
        $plan->is_plan_enable = $plan->is_plan_enable === 'on' ? 'off' : 'on';
        $plan->save();
        
        return back();
    }
    
    /**
     * Show the form for creating a new plan
     */
    public function create()
    {
        $hasDefaultPlan = Plan::where('is_default', true)->exists();
        $availableAddons = Addon::where('is_enabled', true)->get(['id', 'name', 'description', 'category', 'package_name']);
        
        return Inertia::render('plans/create', [
            'hasDefaultPlan' => $hasDefaultPlan,
            'availableAddons' => $availableAddons
        ]);
    }
    
    /**
     * Store a newly created plan
     */
    public function store(Request $request)
{
    $rules = [
        'name' => 'required|string|max:100|unique:plans',
        'duration' => 'required|string|in:monthly,yearly,both',
        'description' => 'nullable|string',
        'business' => 'required|integer|min:0',
        'bio_links' => 'required|integer|min:0',
        'max_users' => 'required|integer|min:0',
        'storage_limit' => 'required|numeric|min:0',
        'enable_custdomain' => 'nullable|in:on,off',
        'enable_custsubdomain' => 'nullable|in:on,off',
        'pwa_business' => 'nullable|in:on,off',
        'enable_chatgpt' => 'nullable|in:on,off',
        'themes' => 'nullable|array',
        'bio_links_themes' => 'nullable|array',
        'addons' => 'nullable|array',
        'features' => 'nullable|array',
        'is_trial' => 'nullable|in:on,off',
        'trial_day' => 'nullable|integer|min:0',
        'is_plan_enable' => 'nullable|in:on,off',
        'is_default' => 'nullable|boolean',
    ];

    // Conditional validation based on duration
    switch ($request->duration) {
        case 'monthly':
            $rules['price'] = 'required|numeric|min:0.01';
            break;
        case 'yearly':
            $rules['yearly_price'] = 'required|numeric|min:0.01';
            break;
        case 'both':
            $rules['price'] = 'required|numeric|min:0.01';
            $rules['yearly_price'] = 'required|numeric|min:0.01';
            break;
    }

    $validated = $request->validate($rules, [
        'price.min' => 'Price must be greater than 0',
        'yearly_price.min' => 'Yearly price must be greater than 0'
    ]);
    
    // Set default values for nullable fields
    $validated['enable_custdomain'] = $validated['enable_custdomain'] ?? 'off';
    $validated['enable_custsubdomain'] = $validated['enable_custsubdomain'] ?? 'off';
    $validated['pwa_business'] = $validated['pwa_business'] ?? 'off';
    $validated['enable_chatgpt'] = $validated['enable_chatgpt'] ?? 'off';
    $validated['is_trial'] = $validated['is_trial'] ?? null;
    $validated['is_plan_enable'] = $validated['is_plan_enable'] ?? 'on';
    $validated['is_default'] = $validated['is_default'] ?? false;
    
    // Set default features if not provided
    if (!isset($validated['features']) || empty($validated['features'])) {
        $validated['features'] = [
            'bio_link' => true,
            'vcard_builder' => true,
            'broadcast_email' => false,
        ];
    } else {
        $validated['features']['bio_link'] = $validated['features']['bio_link'] ?? true;
        $validated['features']['vcard_builder'] = $validated['features']['vcard_builder'] ?? true;
        $validated['features']['broadcast_email'] = $validated['features']['broadcast_email'] ?? false;
    }
    
    // If this plan is set as default, remove default status from other plans
    if ($validated['is_default']) {
        Plan::where('is_default', true)->update(['is_default' => false]);
    }
    
    // Create the plan
    Plan::create($validated);
    
    return redirect()->route('plans.index')->with('success', __('Plan created successfully.'));
}


    
    /**
     * Show the form for editing a plan
     */
    public function edit(Plan $plan)
    {
        $otherDefaultPlanExists = Plan::where('is_default', true)
            ->where('id', '!=', $plan->id)
            ->exists();
        $availableAddons = Addon::where('is_enabled', true)->get(['id', 'name', 'description', 'category', 'package_name']);
        
        return Inertia::render('plans/edit', [
            'plan' => $plan,
            'otherDefaultPlanExists' => $otherDefaultPlanExists,
            'availableAddons' => $availableAddons
        ]);
    }
    
    /**
     * Update a plan
     */
    public function update(Request $request, Plan $plan)
    {
        $isFreeplan = $plan->price == 0;
        
        $rules = [
            'name' => 'required|string|max:100|unique:plans,name,' . $plan->id,
            'duration' => 'required|string|in:monthly,yearly,both',
            'description' => 'nullable|string',
            'business' => 'required|integer|min:0',
            'bio_links' => 'required|integer|min:0',
            'max_users' => 'required|integer|min:0',
            'storage_limit' => 'required|numeric|min:0',
            'enable_custdomain' => 'nullable|in:on,off',
            'enable_custsubdomain' => 'nullable|in:on,off',
            'pwa_business' => 'nullable|in:on,off',
            'enable_chatgpt' => 'nullable|in:on,off',
            'themes' => 'nullable|array',
            'bio_links_themes' => 'nullable|array',
            'addons' => 'nullable|array',
            'features' => 'nullable|array',
            'is_trial' => 'nullable|in:on,off',
            'trial_day' => 'nullable|integer|min:0',
            'is_plan_enable' => 'nullable|in:on,off',
            'is_default' => 'nullable|boolean',
        ];

        // Conditional validation based on duration for non-free plans
        if (!$isFreeplan) {
            switch ($request->duration) {
                case 'monthly':
                    $rules['price'] = 'required|numeric|min:0.01';
                    break;
                case 'yearly':
                    $rules['yearly_price'] = 'required|numeric|min:0.01';
                    break;
                case 'both':
                    $rules['price'] = 'required|numeric|min:0.01';
                    $rules['yearly_price'] = 'required|numeric|min:0.01';
                    break;
            }
        } else {
            // For free plans, allow 0 values
            $rules['price'] = 'required|numeric|min:0';
            $rules['yearly_price'] = 'nullable|numeric|min:0';
        }

        $validated = $request->validate($rules, [
            'price.min' => $isFreeplan ? 'Price must be 0 or greater' : 'Price must be greater than 0',
            'yearly_price.min' => $isFreeplan ? 'Yearly price must be 0 or greater' : 'Yearly price must be greater than 0'
        ]);
        
        // Set default values for nullable fields
        $validated['enable_custdomain'] = $validated['enable_custdomain'] ?? 'off';
        $validated['enable_custsubdomain'] = $validated['enable_custsubdomain'] ?? 'off';
        $validated['pwa_business'] = $validated['pwa_business'] ?? 'off';
        $validated['enable_chatgpt'] = $validated['enable_chatgpt'] ?? 'off';
        $validated['is_trial'] = $validated['is_trial'] ?? null;
        $validated['is_plan_enable'] = $validated['is_plan_enable'] ?? 'on';
        $validated['is_default'] = $validated['is_default'] ?? false;
        
        // Set default features if not provided
        if (!isset($validated['features']) || empty($validated['features'])) {
            $validated['features'] = [
                'bio_link' => true,
                'vcard_builder' => true,
                'broadcast_email' => false,
            ];
        } else {
            $validated['features']['bio_link'] = $validated['features']['bio_link'] ?? true;
            $validated['features']['vcard_builder'] = $validated['features']['vcard_builder'] ?? true;
            $validated['features']['broadcast_email'] = $validated['features']['broadcast_email'] ?? false;
        }
        
        // If yearly_price is not provided, calculate it as 80% of monthly price * 12
        if (!isset($validated['yearly_price']) || $validated['yearly_price'] === null) {
            $validated['yearly_price'] = $validated['price'] * 12 * 0.8;
        }
        
        // Ensure yearly price is greater than 0 for non-free plans
        if (!$isFreeplan && $validated['yearly_price'] <= 0) {
            return back()->withErrors(['yearly_price' => 'Yearly price must be greater than 0']);
        }
        
        // If this plan is set as default, remove default status from other plans
        if ($validated['is_default'] && !$plan->is_default) {
            Plan::where('is_default', true)->update(['is_default' => false]);
        }
        
        // Update the plan
        $plan->update($validated);
        
        return redirect()->route('plans.index')->with('success', __('Plan updated successfully.'));
    }
    
    /**
     * Delete a plan
     */
    public function destroy(Plan $plan)
    {
        // Don't allow deleting the default plan
        if ($plan->is_default) {
            return back()->with('error', __('Cannot delete the default plan.'));
        }
        
        $plan->delete();
        
        return redirect()->route('plans.index')->with('success', __('Plan deleted successfully.'));
    }
    
    private function companyPlansView(Request $request)
    {
        $user = auth()->user();
        $billingCycle = $request->input('billing_cycle', 'monthly');
        
        // Filter plans based on billing cycle and duration
        $dbPlans = Plan::where('is_plan_enable', 'on')
            ->where(function($query) use ($billingCycle) {
                $query->where('duration', $billingCycle)
                      ->orWhere('duration', 'both');
            })->get();
        
        $plans = $dbPlans->map(function ($plan) use ($billingCycle, $user) {
            $price = $billingCycle === 'yearly' ? $plan->yearly_price : $plan->price;
            
            $features = [];
            $templateSectionsCount = 0;
            if ($plan->features) {
                $enabledFeatures = $plan->getEnabledFeatures();
                $featureKeys = [
                    'custom_domain' => 'Custom Domain',
                    'custom_subdomain' => 'Subdomain',
                    'pwa_support' => 'PWA',
                    'ai_integration' => 'AI Integration',
                    'password_protection' => 'Password Protection',
                    'custom_css_js' => 'Custom CSS/JS',
                    'google_wallet' => 'Google Wallet',
                    'bio_link' => 'Bio Link',
                    'vcard_builder' => 'vCard Builder',
                    'broadcast_email' => 'Broadcast Email'
                ];
                foreach ($enabledFeatures as $feature) {
                    if (isset($featureKeys[$feature])) {
                        $features[] = $featureKeys[$feature];
                    }
                }
                
                // Get template sections count
                $templateSections = $plan->getAllowedTemplateSections();
                $templateSectionsCount = count($templateSections);
            } else {
                // Fallback to legacy columns
                if ($plan->enable_custdomain === 'on') $features[] = 'Custom Domain';
                if ($plan->enable_custsubdomain === 'on') $features[] = 'Subdomain';
                if ($plan->pwa_business === 'on') $features[] = 'PWA';
                if ($plan->enable_chatgpt === 'on') $features[] = 'AI Integration';
                $templateSectionsCount = 0;
            }
            
            // Check if user has pending request for this plan
             $pendingRequest = PlanRequest::where('user_id', $user->id)
                ->where('plan_id', $plan->id)
                ->where('status', 'pending')
                ->first();
            
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'price' => $price,
                'formatted_price' => '$' . number_format($price, 2),
                'duration' => $billingCycle === 'yearly' ? 'Yearly' : 'Monthly',
                'description' => $plan->description,
                'trial_days' => $plan->trial_day,
                'features' => $features,
                'stats' => [
                    'businesses' => $plan->business,
                    'users' => $plan->max_users,
                    'storage' => $plan->storage_limit . ' GB',
                    'templates' => is_array($plan->themes) ? count($plan->themes) : 34,
                    'bio_links' => $plan->bio_links,
                    'bio_links_templates' => is_array($plan->bio_links_themes) ? count($plan->bio_links_themes) : 15,
                    'addons' => is_array($plan->addons) ? count($plan->addons) : 0,
                    'addon_names' => is_array($plan->addons) ? \App\Models\Addon::whereIn('package_name', $plan->addons)->pluck('name')->toArray() : [],
                    'template_sections' => $templateSectionsCount
                ],
                'is_current' => $user->plan_id == $plan->id,
                'is_trial_available' => $plan->is_trial === 'on' && !$user->is_trial,
                'is_default' => $plan->is_default,
                'recommended' => false, // Default to false
                'has_pending_request' => $pendingRequest ? true : false,
                    'request_id' => $pendingRequest ? $pendingRequest->id : null
            ];
        });
        
        // Mark the plan with most subscribers as recommended
        $planSubscriberCounts = Plan::withCount('users')->get()->pluck('users_count', 'id');
        if ($planSubscriberCounts->isNotEmpty()) {
            $mostSubscribedPlanId = $planSubscriberCounts->keys()->sortByDesc(function($planId) use ($planSubscriberCounts) {
                return $planSubscriberCounts[$planId];
            })->first();
            
            $plans = $plans->map(function($plan) use ($mostSubscribedPlanId) {
                if ($plan['id'] == $mostSubscribedPlanId) {
                    $plan['recommended'] = true;
                }
                return $plan;
            });
        }
        
        return Inertia::render('plans/index', [
            'plans' => $plans,
            'billingCycle' => $billingCycle,
            'currentPlan' => $user->plan,
            'userTrialUsed' => $user->is_trial
        ]);
    }
    
    public function requestPlan(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly'
        ]);
        
        $user = auth()->user();
        $plan = Plan::findOrFail($request->plan_id);
        
        // Check if user already has a pending request for this plan
        $existingRequest = PlanRequest::where('user_id', $user->id)->where('status', 'pending')->first();

        if ($existingRequest) {
            return back()->with('error', __('You already sent request to another plan'));
        }
        PlanRequest::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'duration' => $request->billing_cycle,
            'status' => 'pending'
        ]);
        
        return back()->with('success', __('Plan request submitted successfully'));
    }
    public function cancelRequest(Request $request)
    {
        $request->validate([
            'request_id' => 'required|exists:plan_requests,id'
        ]);
        
        $planRequest = PlanRequest::findOrFail($request->request_id);
        
        $planRequest->delete();
        
        return back()->with('success', __('Plan request cancelled successfully'));
    }
    public function startTrial(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id'
        ]);
        
        $user = auth()->user();
        $plan = Plan::findOrFail($request->plan_id);
        
        if ($user->is_trial || $plan->is_trial !== 'on') {
            return back()->withErrors(['error' => 'Trial not available']);
        }
        
        $user->update([
            'plan_id' => $plan->id,
            'is_trial' => 1,
            'trial_day' => $plan->trial_day,
            'trial_expire_date' => now()->addDays($plan->trial_day)
        ]);
        
        return back()->with('success', __('Trial started successfully'));
    }
    
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
            'coupon_code' => 'nullable|string'
        ]);
        
        try {
            $user = auth()->user();
            $plan = Plan::findOrFail($validated['plan_id']);
            $pricing = calculatePlanPricing($plan, $validated['coupon_code'] ?? null, $validated['billing_cycle']);
            
            // If plan is free, directly assign to user and skip payment
            if ($pricing['is_free']) {
                // Create approved order for free plan
                $planOrder = PlanOrder::create([
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'coupon_id' => $pricing['coupon_id'],
                    'billing_cycle' => $validated['billing_cycle'],
                    'payment_method' => 'free',
                    'coupon_code' => $validated['coupon_code'] ?? null,
                    'original_price' => $pricing['original_price'],
                    'discount_amount' => $pricing['discount_amount'],
                    'final_price' => $pricing['final_price'],
                    'payment_id' => 'FREE_' . strtoupper(\Illuminate\Support\Str::random(10)),
                    'status' => 'approved',
                    'ordered_at' => now(),
                    'processed_at' => now(),
                ]);
                
                // Activate subscription immediately
                $planOrder->activateSubscription();
                
                return back()->with('success', __('Free plan activated successfully'));
            }
            
            // Create pending order for paid plans
            PlanOrder::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'coupon_id' => $pricing['coupon_id'],
                'billing_cycle' => $validated['billing_cycle'],
                'payment_method' => 'pending',
                'coupon_code' => $validated['coupon_code'] ?? null,
                'original_price' => $pricing['original_price'],
                'discount_amount' => $pricing['discount_amount'],
                'final_price' => $pricing['final_price'],
                'status' => 'pending'
            ]);
            
            return back()->with('success', __('Subscription request submitted successfully'));
            
        } catch (\Exception $e) {
            \Log::error('Plan subscription error: ' . $e->getMessage());
            return back()->withErrors(['error' => __('Failed to process subscription: :error', ['error' => $e->getMessage()])]);
        }
    }
}