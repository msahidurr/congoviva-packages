<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Plan;
use App\Models\Business;
use App\Models\PlanOrder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()
            ->where('type', 'company')
            ->with('plan');
            
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        
        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Apply date filters
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }
        
        // Apply sorting based on demo mode
        if (config('app.is_demo')) {
            // Demo mode: Show first record first
            $sortField = $request->input('sort_field', 'id');
            $sortDirection = $request->input('sort_direction', 'asc');
        } else {
            // Production mode: Show newest records first
            $sortField = $request->input('sort_field', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
        }
        $query->orderBy($sortField, $sortDirection);
        
        // Get paginated results
        $perPage = $request->input('per_page', 10);
        $companies = $query->paginate($perPage)->withQueryString();
        
        // Transform data for frontend
        $companies->getCollection()->transform(function ($company) {
            // Get business count
            $businessCount = $company->businesses()->count();
            
            return [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'status' => $company->status,
                'created_at' => $company->created_at,
                'plan_name' => $company->plan ? $company->plan->name : __('No Plan'),
                'plan_expiry_date' => $company->plan_expire_date,
                'business_count' => $businessCount,
                'appointments_count' => 0, // You can implement this based on your model relationships
                'avatar_url' => $company->avatar_url,
            ];
        });
        
        // Get plans for dropdown
        $plans = Plan::all(['id', 'name']);
        
        return Inertia::render('companies/index', [
            'companies' => $companies,
            'plans' => $plans,
            'filters' => $request->only(['search', 'status', 'start_date', 'end_date', 'sort_field', 'sort_direction', 'per_page'])
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:active,inactive',
        ]);
        
        $company = new User();
        $company->name = $validated['name'];
        $company->email = $validated['email'];
        
        // Only set password if provided
        if (isset($validated['password'])) {
            $company->password = Hash::make($validated['password']);
        }
        
        $company->type = 'company';
        $company->status = $validated['status'];
        
        // Set company language same as creator (superadmin)
        $creator = auth()->user();
        if ($creator && $creator->lang) {
            $company->lang = $creator->lang;
        }
        
        // Assign default plan
        $defaultPlan = Plan::where('is_default', true)->first();
        if ($defaultPlan) {
            $company->plan_id = $defaultPlan->id;
            
            // Set plan expiry date based on plan duration
            if ($defaultPlan->duration === 'yearly') {
                $company->plan_expire_date = now()->addYear();
            } else {
                $company->plan_expire_date = now()->addMonth();
            }
            
            // Set plan is active
            $company->plan_is_active = 1;
        }
        
        $company->save();
        
        // Assign role and settings to the user
        defaultRoleAndSetting($company);
        
        // Trigger email notification
        event(new \App\Events\UserCreated($company, $validated['password'] ?? ''));
        
        // Check for email errors
        if (session()->has('email_error')) {
            return redirect()->back()->with('warning', __('Company created successfully, but welcome email failed: ') . session('email_error'));
        }
        
        return redirect()->back()->with('success', __('Company created successfully'));
    }
    
    public function update(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $company->id,
        ]);
        
        $company->name = $validated['name'];
        $company->email = $validated['email'];
        
        $company->save();
        
        return redirect()->back()->with('success', __('Company updated successfully'));
    }
    
    public function destroy(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        $company->delete();
        
        return redirect()->back()->with('success', __('Company deleted successfully'));
    }
    
    public function resetPassword(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string', 'min:8'],
        ]);
        
        $company->password = Hash::make($validated['password']);
        $company->save();
        
        return redirect()->back()->with('success', __('Password reset successfully'));
    }
    
    public function toggleStatus(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return redirect()->back()->with('error', __('Invalid company record'));
        }
        
        $company->status = $company->status === 'active' ? 'inactive' : 'active';
        $company->save();
        
        return redirect()->back()->with('success', __('Company status updated successfully'));
    }
    
    /**
     * Get available plans for upgrade
     */
    public function getPlans(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return response()->json(['error' => __('Invalid company record')], 400);
        }
        
        $plans = Plan::where('is_plan_enable', 'on')->get();
        
        $formattedPlans = [];
        
        foreach ($plans as $plan) {
            // Format features using same logic as PlanController
            $features = [];
            if ($plan->features) {
                $enabledFeatures = $plan->getEnabledFeatures();
                $featureLabels = [
                    'custom_domain' => __('Custom Domain'),
                    'custom_subdomain' => __('Subdomain'),
                    'pwa_support' => __('PWA'),
                    'ai_integration' => __('AI Integration'),
                    'password_protection' => __('Password Protection')
                ];
                foreach ($enabledFeatures as $feature) {
                    if (isset($featureLabels[$feature])) {
                        $features[] = $featureLabels[$feature];
                    }
                }
                
                // Add template sections with count
                $templateSections = $plan->getAllowedTemplateSections();
                if (!empty($templateSections)) {
                    $features[] = __('Template Sections ( :count /19)', ['count' => count($templateSections)]);
                } else {
                    $features[] = __('Template Sections (19/19)');
                }
            } else {
                // Fallback to legacy columns
                if ($plan->enable_custdomain === 'on') $features[] = __('Custom Domain');
                if ($plan->enable_custsubdomain === 'on') $features[] = __('Subdomain');
                if ($plan->pwa_business === 'on') $features[] = __('PWA');
                if ($plan->enable_chatgpt === 'on') $features[] = __('AI Integration');
                $features[] = __('Template Sections (19/19)');
            }
            
            // Add monthly plan if duration allows it
            if ($plan->duration === 'monthly' || $plan->duration === 'both') {
                $formattedPlans[] = [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price' => $plan->price,
                    'duration' => 'Monthly',
                    'description' => $plan->description,
                    'features' => $features,
                    'business' => $plan->business,
                    'max_users' => $plan->max_users,
                    'storage_limit' => $plan->storage_limit . ' ' . __('GB'),
                    'is_current' => $company->plan_id === $plan->id,
                    'is_default' => $plan->is_default
                ];
            }
            
            // Add yearly plan if duration allows it
            if ($plan->duration === 'yearly' || $plan->duration === 'both') {
                $yearlyPrice = $plan->yearly_price ?? ($plan->price * 12 * 0.8);
                $formattedPlans[] = [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'price' => $yearlyPrice,
                    'duration' => 'Yearly',
                    'description' => $plan->description,
                    'features' => $features,
                    'business' => $plan->business,
                    'max_users' => $plan->max_users,
                    'storage_limit' => $plan->storage_limit . ' ' . __('GB'),
                    'is_current' => $company->plan_id === $plan->id,
                    'is_default' => $plan->is_default
                ];
            }
        }
        
        return response()->json([
            'plans' => $formattedPlans,
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'current_plan_id' => $company->plan_id
            ]
        ]);
    }
    
    /**
     * Upgrade company plan
     */
    public function upgradePlan(Request $request, User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return back()->with('error', __('Invalid company record'));
        }
        
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'duration' => 'required|in:yearly,monthly',
        ]);
        
        $plan = Plan::find($validated['plan_id']);
        if (!$plan) {
            return back()->with('error', __('Plan not found'));
        }
        
        $isYearly = $validated['duration'] === 'Yearly';
        
        // Create plan order entry for tracking
        $planOrder = new PlanOrder();
        $planOrder->user_id = $company->id;
        $planOrder->plan_id = $plan->id;
        $planOrder->billing_cycle = $request->duration === 'yearly' ? 'yearly' : 'monthly';
        $planOrder->original_price = $request->duration === 'yearly' ? ($plan->yearly_price ?? 0) : $plan->price;
        $planOrder->discount_amount = 0;
        $planOrder->final_price = $planOrder->original_price;
        $planOrder->payment_method = 'admin_upgrade';
        $planOrder->status = 'approved';
        $planOrder->ordered_at = now();
        $planOrder->processed_at = now();
        $planOrder->processed_by = auth()->id();
        $planOrder->notes = 'Plan upgraded by super admin';
        $planOrder->save();
        // Update company plan
        $company->plan_id = $plan->id;
        $company->is_trial = null;
        $company->trial_day = 0;
        $company->trial_expire_date = null;

        
        // Set plan expiry date based on plan duration
        if ($plan->duration === 'yearly') {
            $company->plan_expire_date = now()->addYear();
        } else {
            $company->plan_expire_date = now()->addMonth();
        }
        
        // Set plan is active
        $company->plan_is_active = 1;
        
        $company->save();
        
        return back()->with('success', __('Plan upgraded successfully'));
    }
    
    /**
     * Get business links for a company
     */
    public function getBusinessLinks(User $company)
    {
        // Ensure this is a company type user
        if ($company->type !== 'company') {
            return response()->json(['error' => __('Invalid company record')], 400);
        }
        
        // Get all businesses for this company
        $businesses = Business::where('created_by', $company->id)
            ->select('id', 'name', 'slug', 'custom_domain', 'url_prefix', 'domain_type')
            ->get();
        
        $businessLinks = $businesses->map(function ($business) {
            // Generate the business link based on available options (same logic as vcard-builder)
            $link = $business->custom_domain 
                ? 'https://' . $business->custom_domain
                : ($business->url_prefix && $business->url_prefix !== '' 
                    ? route('public.vcard.show', ['prefix' => $business->url_prefix, 'slug' => $business->slug], true)
                    : route('public.vcard.show.direct', $business->slug, true));
            
            return [
                'id' => $business->id,
                'name' => $business->name,
                'link' => $link
            ];
        });
        
        return response()->json([
            'businesses' => $businessLinks
        ]);
    }
}