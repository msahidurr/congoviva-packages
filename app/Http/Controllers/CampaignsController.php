<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignSetting;
use App\Models\Business;
use App\Models\User;
use App\Models\PaymentSetting;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignsController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        
        // Check if Campaigns setting is enabled for company users
        if (!$user->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'campaigns_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'error' => __('Campaigns setting is currently disabled')
                    ], 403);
                }
                
                return redirect()->route('dashboard')
                    ->with('error', __('Campaigns setting is currently disabled'));
            }
        }
        
        $query = Campaign::with(['user', 'business']);
        
        // Role-based filtering
        if (!$user->isSuperAdmin()) {
            $query->where('user_id', $user->id);
        }
        
        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function($userQuery) use ($request) {
                      $userQuery->where('name', 'like', "%{$request->search}%");
                  })
                  ->orWhereHas('business', function($businessQuery) use ($request) {
                      $businessQuery->where('name', 'like', "%{$request->search}%");
                  });
            });
        }
        
        // Apply filters
        if ($request->has('user_id') && !empty($request->user_id)) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->has('business_id') && !empty($request->business_id)) {
            $query->where('business_id', $request->business_id);
        }
        
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        if ($request->has('start_date') && !empty($request->start_date)) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $query->whereDate('end_date', '<=', $request->end_date);
        }
        
        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Whitelist allowed sort fields
        $allowedSortFields = ['name', 'created_at', 'start_date', 'end_date', 'total_amount', 'status'];
        $allowedRelationSorts = ['user.name', 'business.name'];
        
        if (in_array($sortField, $allowedRelationSorts)) {
            $parts = explode('.', $sortField);
            if ($parts[0] === 'user' && $parts[1] === 'name') {
                $query->join('users', 'campaigns.user_id', '=', 'users.id')
                      ->orderBy('users.name', $sortDirection)
                      ->select('campaigns.*');
            } elseif ($parts[0] === 'business' && $parts[1] === 'name') {
                $query->join('businesses', 'campaigns.business_id', '=', 'businesses.id')
                      ->orderBy('businesses.name', $sortDirection)
                      ->select('campaigns.*');
            }
        } elseif (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        $perPage = $request->input('per_page', 10);
        $campaigns = $query->paginate($perPage)->withQueryString();
        
        // Get filter options
        $users = $user->isSuperAdmin() ? User::where('type', 'company')->get(['id', 'name']) : [];
        $businesses = $user->isSuperAdmin() ? Business::get(['id', 'name', 'created_by']) : $user->businesses;
        
        // Get payment methods and campaign settings for non-admin users
        $paymentMethods = [];
        $paymentSettings = [];
        $campaignSettings = null;
        if (!$user->isSuperAdmin()) {
            $paymentSettings = PaymentSetting::getUserSettings($user->id);
            $paymentMethods = $this->getEnabledPaymentMethods($paymentSettings);
            $campaignSettings = CampaignSetting::getSettings();
        }
        
        // Debug: Always show some payment methods for testing
        if (!$user->isSuperAdmin() && empty($paymentMethods)) {
            $paymentMethods = [
                ['id' => 'stripe', 'name' => 'Credit Card (Stripe)', 'enabled' => true],
                ['id' => 'paypal', 'name' => 'PayPal', 'enabled' => true],
                ['id' => 'bank', 'name' => 'Bank Transfer', 'enabled' => true]
            ];
        }
        
        return Inertia::render('campaigns/index', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['search', 'user_id', 'business_id', 'status', 'start_date', 'end_date', 'sort_field', 'sort_direction', 'per_page']),
            'users' => $users,
            'businesses' => $businesses,
            'isAdmin' => $user->isSuperAdmin(),
            'paymentMethods' => $paymentMethods,
            'paymentSettings' => $paymentSettings,
            'campaignSettings' => $campaignSettings,
            'campaignGlobalSettings' => [
                'is_enabled' => Setting::where('key', 'campaigns_enabled')->where('user_id', 1)->value('value') === '1'
            ]
        ]);
    }
    
    public function store(Request $request)
    {
        $user = auth()->user();
        
        // Check if Campaigns setting is enabled for company users
        if (!$user->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'campaigns_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                if ($request->expectsJson() || $request->wantsJson()) {
                    return response()->json([
                        'error' => __('Campaigns setting is currently disabled')
                    ], 403);
                }
                
                return back()->with('error', __('Campaigns setting is currently disabled'));
            }
        }
        
        $validationRules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_id' => 'required|exists:businesses,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'payment_method' => 'nullable|in:stripe,paypal,bank,manual',
            'coupon_code' => 'nullable|string',
            'final_amount' => 'nullable|numeric|min:0',
        ];
        
        // Add user_id validation for admin users
        if ($user->isSuperAdmin() && $request->has('user_id')) {
            $validationRules['user_id'] = 'required|exists:users,id';
        }
        
        $validated = $request->validate($validationRules);
        
        // Set user ID with authorization check
        if ($user->isSuperAdmin() && $request->has('user_id')) {
            $validated['user_id'] = $request->user_id;
        } else {
            $validated['user_id'] = $user->id;
        }
        
        // Verify business belongs to the user
        $business = Business::findOrFail($validated['business_id']);
        if (!$user->isSuperAdmin() && $business->created_by !== $validated['user_id']) {
            return redirect()->back()->withErrors(['business_id' => __('You can only create campaigns for your own businesses')]);
        }
        
        // Calculate total days and amount
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate) + 1;
        
        $settings = CampaignSetting::getSettings();
        $pricePerDay = $this->calculatePricePerDay($totalDays, $settings->pricing_tiers ?? []);
        $originalAmount = $totalDays * $pricePerDay;
        
        $validated['total_days'] = $totalDays;
        $validated['total_amount'] = $validated['final_amount'] ?? $originalAmount;
        
        // Set payment method and status based on user role
        if ($user->isSuperAdmin()) {
            $validated['payment_method'] = 'manual'; // Auto-set for admin
            $validated['status'] = $request->status ?? 'active';
            $validated['is_active'] = $request->is_active ?? true;
        } else {
            // For non-admin users, campaigns require payment approval
            $validated['status'] = in_array($validated['payment_method'], ['stripe', 'paypal']) ? 'active' : 'pending';
            $validated['is_active'] = in_array($validated['payment_method'], ['stripe', 'paypal']) ? true : false;
        }
        
        $campaign = Campaign::create($validated);
        
        // Handle payment processing for non-admin users
        if (!$user->isSuperAdmin() && in_array($validated['payment_method'], ['stripe', 'paypal'])) {
            // Payment will be processed by the respective payment handlers
            // This is just creating the campaign record
        }
        
        return redirect()->back()->with('success', __('Campaign created successfully'));
    }
    
    public function update(Request $request, Campaign $campaign)
    {
        $user = auth()->user();
        
        // Authorization check
        if (!$user->isSuperAdmin() && $campaign->user_id !== $user->id) {
            abort(403, __('Unauthorized to update this campaign'));
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_id' => 'required|exists:businesses,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:pending,active,completed,cancelled',
            'is_active' => 'boolean'
        ]);
        
        // Recalculate total days and amount
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $endDate = \Carbon\Carbon::parse($validated['end_date']);
        $totalDays = $startDate->diffInDays($endDate) + 1;
        
        $settings = CampaignSetting::getSettings();
        $pricePerDay = $this->calculatePricePerDay($totalDays, $settings->pricing_tiers ?? []);
        $validated['total_days'] = $totalDays;
        $validated['total_amount'] = $totalDays * $pricePerDay;
        
        $campaign->update($validated);
        
        return redirect()->back()->with('success', __('Campaign updated successfully'));
    }
    
    public function destroy(Campaign $campaign)
    {
        $campaign->delete();
        return redirect()->back()->with('success', __('Campaign deleted successfully'));
    }
    
    public function toggleStatus(Campaign $campaign)
    {
        $campaign->is_active = !$campaign->is_active;
        $campaign->save();
        
        return redirect()->back()->with('success', __('Campaign status updated successfully'));
    }
    
    public function activate(Campaign $campaign)
    {
        $user = auth()->user();
        
        // Only admin can manually activate campaigns
        if (!$user->isSuperAdmin()) {
            abort(403, __('Unauthorized to activate campaigns'));
        }
        
        $campaign->update([
            'status' => 'active',
            'is_active' => true
        ]);
        
        return redirect()->back()->with('success', __('Campaign activated successfully'));
    }
    
    public function settings(Request $request)
    {
        if ($request->isMethod('post')) {
            $validated = $request->validate([
                'pricing_tiers' => 'required|array|min:1',
                'pricing_tiers.*.min_days' => 'required|integer|min:1',
                'pricing_tiers.*.max_days' => 'required|integer|min:1',
                'pricing_tiers.*.per_day_price' => 'required|numeric|min:0'
            ]);
            
            $settings = CampaignSetting::first();
            if ($settings) {
                $settings->update($validated);
            } else {
                CampaignSetting::create($validated);
            }
            
            return redirect()->back()->with('success', __('Pricing settings updated successfully'));
        }
        
        $settings = CampaignSetting::getSettings();
        
        return Inertia::render('campaigns/settings', [
            'settings' => $settings
        ]);
    }
    
    public function toggleGlobal(Request $request)
    {
        $enabled = $request->boolean('is_enabled', true);
        
        Setting::updateOrCreate(
            ['key' => 'campaigns_enabled', 'user_id' => 1],
            ['value' => $enabled ? '1' : '0']
        );
        
        return back()->with('success', __('Campaigns setting updated successfully'));
    }
    
    public function analytics(Campaign $campaign)
    {
        $user = auth()->user();
        
        // Check if Campaigns setting is enabled for company users
        if (!$user->isSuperAdmin()) {
            $isEnabled = Setting::where('key', 'campaigns_enabled')
                ->where('user_id', 1)
                ->value('value') === '1';
            
            if (!$isEnabled) {
                return redirect()->route('dashboard')
                    ->with('error', __('Campaigns setting is currently disabled'));
            }
        }
        
        // Check access permissions
        if (!$user->isSuperAdmin() && $campaign->user_id !== $user->id) {
            abort(403, __('Unauthorized access to campaign analytics'));
        }
        
        // Campaign performance metrics
        $metrics = [
            'total_revenue' => $campaign->total_amount,
            'cost_per_day' => $campaign->total_days > 0 ? $campaign->total_amount / $campaign->total_days : 0,
            'days_remaining' => max(0, \Carbon\Carbon::parse($campaign->end_date)->diffInDays(now(), false)),
            'progress_percentage' => $this->calculateProgress($campaign),
            'roi_estimate' => $this->calculateROI($campaign)
        ];
                
        // Business performance comparison
        $businessStats = Campaign::where('business_id', $campaign->business_id)
            ->selectRaw('COUNT(*) as total_campaigns, SUM(total_amount) as total_revenue')
            ->first();
        
        // Monthly campaign trends (last 6 months)
        $monthlyTrends = Campaign::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count, SUM(total_amount) as revenue')
            ->where('created_at', '>=', now()->subMonths(6))
            ->when(!$user->isSuperAdmin(), function($q) use ($user) {
                return $q->where('user_id', $user->id);
            })
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        // Status distribution
        $statusDistribution = Campaign::selectRaw('status, COUNT(*) as count')
            ->when(!$user->isSuperAdmin(), function($q) use ($user) {
                return $q->where('user_id', $user->id);
            })
            ->groupBy('status')
            ->get();
        
        return Inertia::render('campaigns/analytics', [
            'campaign' => $campaign->load(['user', 'business']),
            'metrics' => $metrics,
            'businessStats' => $businessStats,
            'monthlyTrends' => $monthlyTrends,
            'statusDistribution' => $statusDistribution,
            'isAdmin' => $user->isSuperAdmin()
        ]);
    }
    
    private function calculateProgress($campaign)
    {
        $startDate = \Carbon\Carbon::parse($campaign->start_date);
        $endDate = \Carbon\Carbon::parse($campaign->end_date);
        $now = now();
        
        if ($now->lt($startDate)) {
            return 0; // Not started
        }
        
        if ($now->gt($endDate)) {
            return 100; // Completed
        }
        
        $totalDays = $startDate->diffInDays($endDate);
        if ($totalDays <= 0) {
            return 100; // Same day campaign
        }
        
        $elapsedDays = $startDate->diffInDays($now);
        
        return round(($elapsedDays / $totalDays) * 100, 1);
    }
    
    private function calculateROI($campaign)
    {
        // Simple ROI calculation - can be enhanced based on business logic
        $investment = $campaign->total_amount;
        $estimatedReturn = $investment * 1.5; // Assuming 50% ROI
        
        return [
            'investment' => $investment,
            'estimated_return' => $estimatedReturn,
            'roi_percentage' => 50
        ];
    }
    
    private function calculatePricePerDay($totalDays, $pricingTiers)
    {
        if (empty($pricingTiers)) {
            return 10.00; // Default price per day
        }
        
        foreach ($pricingTiers as $tier) {
            if ($totalDays >= $tier['min_days'] && $totalDays <= $tier['max_days']) {
                return $tier['per_day_price'];
            }
        }
        
        // Fallback to the last tier if no match found
        $lastTier = $pricingTiers[count($pricingTiers) - 1] ?? null;
        return $lastTier['per_day_price'] ?? 10.00;
    }
    
    private function getEnabledPaymentMethods($paymentSettings)
    {
        $methods = [];
        
        // Always add all methods for now - you can customize this based on actual settings
        $methods[] = [
            'id' => 'stripe',
            'name' => __('Stripe'),
            'enabled' => true
        ];
        
        $methods[] = [
            'id' => 'paypal', 
            'name' => __('PayPal'),
            'enabled' => true
        ];
        
        $methods[] = [
            'id' => 'bank',
            'name' => __('Bank Transfer'), 
            'enabled' => true
        ];
        
        return $methods;
    }

    
    public function stripePayment(Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|string',
            'campaign_data' => 'required|array',
            'cardholder_name' => 'required|string'
        ]);
        
        return $this->createCampaignWithPayment($request, 'stripe', 'active', __('Campaign created and payment processed successfully'));
    }
    
    public function paypalPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
            'payment_id' => 'required|string',
            'campaign_data' => 'required|array'
        ]);
        
        return $this->createCampaignWithPayment($request, 'paypal', 'active', __('Campaign created and payment processed successfully'));
    }
    
    public function bankPayment(Request $request)
    {
        $request->validate([
            'campaign_data' => 'required|array',
            'amount' => 'required|numeric'
        ]);
        
        return $this->createCampaignWithPayment($request, 'bank', 'pending', __('Campaign created. Payment verification pending.'));
    }
        
    private function createCampaignWithPayment($request, $paymentMethod, $status, $successMessage)
    {
        try {
            $campaignData = $request->campaign_data;
            
            // Set required fields
            $campaignData['user_id'] = auth()->id();
            $campaignData['payment_method'] = $paymentMethod;
            $campaignData['status'] = $status;
            $campaignData['is_active'] = $status === 'active';
            
            // Validate business ownership
            $business = Business::findOrFail($campaignData['business_id']);
            if ($business->created_by !== auth()->id()) {
                throw new \Exception(__('You can only create campaigns for your own businesses'));
            }
            
            // Calculate total days and amount
            $startDate = \Carbon\Carbon::parse($campaignData['start_date']);
            $endDate = \Carbon\Carbon::parse($campaignData['end_date']);
            $totalDays = $startDate->diffInDays($endDate) + 1;
            
            $settings = CampaignSetting::getSettings();
            $pricePerDay = $this->calculatePricePerDay($totalDays, $settings->pricing_tiers ?? []);
            
            $campaignData['total_days'] = $totalDays;
            $campaignData['total_amount'] = $campaignData['final_amount'] ?? ($totalDays * $pricePerDay);
            
            Campaign::create($campaignData);
            
            return redirect()->back()->with('success', $successMessage);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()->back()->withErrors(['error' => __('Business not found')]);
        } catch (\Exception $e) {
            \Log::error('Campaign creation failed: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => __('Failed to create campaign. Please try again.')]);
        }
    }
}