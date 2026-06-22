<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Business;
use App\Models\Contact;
use App\Models\Appointment;
use App\Models\Plan;
use App\Models\PlanOrder;
use App\Models\PlanRequest;
use App\Models\DomainRequest;
use App\Models\NfcCard;
use App\Services\AnalyticsService;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
    
        // Super admin always gets dashboard
        if ($user->type === 'superadmin' || $user->type === 'super admin') {
            return $this->renderDashboard();
        }
        
        // Check if user has dashboard permission (skip if permission doesn't exist)
        try {
            if ($user->hasPermissionTo('manage-dashboard')) {
                return $this->renderDashboard();
            }
        } catch (\Exception $e) {
            // Permission doesn't exist, continue to dashboard for authenticated users
            return $this->renderDashboard();
        }
        
        // Redirect to first available page
        return $this->redirectToFirstAvailablePage();
    }
    
    public function redirectToFirstAvailablePage()
    {
        $user = auth()->user();
        
        // Define available routes with their permissions in priority order
        $routes = [
            ['route' => 'vcard-builder.index', 'permission' => 'manage-vcard-builder'],
            ['route' => 'analytics', 'permission' => 'manage-analytics'],
            ['route' => 'contacts.index', 'permission' => 'manage-contacts'],
            ['route' => 'appointments.index', 'permission' => 'manage-appointments'],
            ['route' => 'calendar.index', 'permission' => 'manage-calendar'],
            ['route' => 'users.index', 'permission' => 'manage-users'],
            ['route' => 'roles.index', 'permission' => 'manage-roles'],
            ['route' => 'companies.index', 'permission' => 'manage-companies'],
            ['route' => 'nfc-cards.index', 'permission' => 'manage-nfc-cards'],
            ['route' => 'campaigns.index', 'permission' => 'manage-campaigns'],
            ['route' => 'plans.index', 'permission' => 'manage-plans'],
            ['route' => 'nfc-cards.order-requests', 'permission' => 'order-nfc-cards'],
            ['route' => 'plan-orders.index', 'permission' => 'manage-plan-orders'],
            ['route' => 'plan-requests.index', 'permission' => 'manage-plan-requests'],
            ['route' => 'domain-requests.index', 'permission' => 'manage-domain-requests'],
            ['route' => 'coupons.index', 'permission' => 'manage-coupons'],
            ['route' => 'currencies.index', 'permission' => 'manage-currencies'],
            ['route' => 'referral.index', 'permission' => 'manage-referral'],
            ['route' => 'google-wallet.index', 'permission' => 'manage-google-wallet'],
            ['route' => 'addons.index', 'permission' => 'manage-addons'],
            ['route' => 'media-library', 'permission' => 'manage-media'],
            ['route' => 'permissions.index', 'permission' => 'manage-permissions'],
            ['route' => 'settings.index', 'permission' => 'manage-settings'],
        ];
        
        // Find first available route
        foreach ($routes as $routeData) {
            try {
                if ($user->hasPermissionTo($routeData['permission'])) {
                    return redirect()->route($routeData['route']);
                }
            } catch (\Exception $e) {
                // Permission might not exist, continue to next route
                continue;
            }
        }
        
        // Fallback: If no specific permissions found, try plans page (accessible to all authenticated users)
        try {
            return redirect()->route('plans.index');
        } catch (\Exception $e) {
            // If even plans page is not accessible, logout user
            auth()->logout();
            return redirect()->route('login')->with('error', __('No access permissions found. Please contact your administrator.'));
        }
    }
    
    private function renderDashboard()
    {
        $user = auth()->user();
        
        if ($user->type === 'superadmin' || $user->type === 'super admin') {
            return $this->renderSuperAdminDashboard();
        } else {
            return $this->renderCompanyDashboard();
        }
    }
    
    private function renderSuperAdminDashboard()
    {
        // Get system-wide statistics
        $totalCompanies = User::where('type', 'company')->count();
        $totalNfcCards = NfcCard::count();
        $totalRevenue = PlanOrder::where('status', 'approved')->sum('final_price') ?? 0;
        $activePlans = Plan::where('is_plan_enable', 'on')->count();
        $pendingRequests = PlanRequest::where('status', 'pending')->count() + 
                          DomainRequest::where('status', 'pending')->count();
        
        // Calculate monthly growth for companies
        $currentMonthCompanies = User::where('type', 'company')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $previousMonthCompanies = User::where('type', 'company')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $monthlyGrowth = $previousMonthCompanies > 0 
            ? round((($currentMonthCompanies - $previousMonthCompanies) / $previousMonthCompanies) * 100, 1)
            : ($currentMonthCompanies > 0 ? 100 : 0);
        
        $dashboardData = [
            'stats' => [
                'totalCompanies' => $totalCompanies,
                'totalNfcCards' => $totalNfcCards,
                'totalRevenue' => $totalRevenue,
                'activePlans' => $activePlans,
                'pendingRequests' => $pendingRequests,
                'monthlyGrowth' => $monthlyGrowth,
            ],
            'recentActivity' => $this->getRecentSystemActivity(),
            'topPlans' => Plan::withCount('users')
                ->orderBy('users_count', 'desc')
                ->take(3)
                ->get()
                ->map(function ($plan) {
                    return [
                        'name' => $plan->name,
                        'subscribers' => $plan->users_count,
                        'revenue' => $plan->users_count * $plan->price,
                    ];
                })
        ];

        $analyticsService = new AnalyticsService();
        $analytics = $analyticsService->getSuperAdminAnalytics();
        
        $dashboardData['charts'] = $analytics['charts'];
        
        return Inertia::render('superadmin/dashboard', [
            'dashboardData' => $dashboardData
        ]);
    }
    
    private function renderCompanyDashboard()
    {
        $user = auth()->user();
        
        // Get company-specific statistics
        $totalBusinesses = $user->businesses()->count();
        $totalContacts = Contact::whereIn('business_id', $user->businesses()->pluck('id'))->count();
        $totalAppointments = Appointment::whereIn('business_id', $user->businesses()->pluck('id'))->count();
        $totalViews = $user->businesses()->sum('view_count') ?? 0;
        
        // Calculate monthly growth for contacts
        $businessIds = $user->businesses()->pluck('id');
        // Compare last 30 days vs previous 30 days (avoids partial month issue)
        $currentMonthContacts = Contact::whereIn('business_id', $businessIds)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
        $previousMonthContacts = Contact::whereIn('business_id', $businessIds)
            ->whereBetween('created_at', [now()->subDays(60), now()->subDays(30)])
            ->count();
        $monthlyGrowth = $previousMonthContacts > 0 
            ? round(abs(($currentMonthContacts - $previousMonthContacts) / $previousMonthContacts) * 100, 1)
            : ($currentMonthContacts > 0 ? 100 : 0);
        
        $dashboardData = [
            'stats' => [
                'totalBusinesses' => $totalBusinesses,
                'totalContacts' => $totalContacts,
                'totalAppointments' => $totalAppointments,
                'totalViews' => $totalViews,
                'monthlyGrowth' => $monthlyGrowth,
            ],
            'recentContacts' => Contact::whereIn('business_id', $user->businesses()->pluck('id'))
                ->with('business')
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($contact) {
                    return [
                        'id' => $contact->id,
                        'name' => $contact->name,
                        'email' => $contact->email,
                        'business' => $contact->business->name ?? 'Unknown',
                        'time' => $contact->created_at->diffForHumans(),
                    ];
                }),
            'recentAppointments' => Appointment::whereIn('business_id', $user->businesses()->pluck('id'))
                ->where('appointment_date', '>=', now())
                ->orderBy('appointment_date')
                ->orderBy('appointment_time')
                ->take(5)
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'title' => $appointment->name . ' - ' . ($appointment->message ? substr($appointment->message, 0, 30) . '...' : 'Appointment'),
                        'date' => $appointment->appointment_date->format('Y-m-d'),
                        'time' => $appointment->appointment_time ? $appointment->appointment_time->format('H:i') : 'TBD',
                        'status' => $appointment->status ?? 'pending',
                    ];
                }),
            'recentActivity' => $this->getRecentCompanyActivity($user),
            'topBusinesses' => $user->businesses()
                ->withCount('contacts')
                ->orderBy('view_count', 'desc')
                ->take(5)
                ->get()
                ->map(function ($business) {
                    return [
                        'id' => $business->id,
                        'name' => $business->name,
                        'views' => $business->view_count ?? 0,
                        'contacts' => $business->contacts_count,
                    ];
                })
        ];

        $analyticsService = new AnalyticsService();
        $analytics = $analyticsService->getCompanyAnalytics($user);
        $dashboardData['analytics'] = $analytics;
        
        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData
        ]);
    }
    
    /**
     * Get recent system activity for super admin dashboard
     */
    private function getRecentSystemActivity()
    {
        $activities = [];
        
        // Recent company registrations
        $recentCompanies = User::where('type', 'company')
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($recentCompanies as $company) {
            $activities[] = [
                'id' => 'company_' . $company->id,
                'type' => 'company',
                'message' => 'New company "' . $company->name . '" registered',
                'time' => $company->created_at->diffForHumans(),
                'status' => 'success'
            ];
        }
        
        // Recent plan orders
        $recentOrders = PlanOrder::with('user')
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($recentOrders as $order) {
            $activities[] = [
                'id' => 'order_' . $order->id,
                'type' => 'payment',
                'message' => 'Payment received from ' . ($order->user->name ?? 'Unknown'),
                'time' => $order->created_at->diffForHumans(),
                'status' => $order->status === 'approved' ? 'success' : 'warning'
            ];
        }
        
        // Recent plan requests
        $recentRequests = PlanRequest::with('user')
            ->latest()
            ->take(2)
            ->get();
            
        foreach ($recentRequests as $request) {
            $activities[] = [
                'id' => 'request_' . $request->id,
                'type' => 'plan',
                'message' => 'Plan upgrade request from ' . ($request->user->name ?? 'Unknown'),
                'time' => $request->created_at->diffForHumans(),
                'status' => 'warning'
            ];
        }
        
        // Sort by creation time and take latest 5
        usort($activities, function($a, $b) {
            return strtotime($b['time']) - strtotime($a['time']);
        });
        
        return array_slice($activities, 0, 5);
    }
    
    /**
     * Get recent company activity for company dashboard
     */
    private function getRecentCompanyActivity($user)
    {
        $activities = [];
        $businessIds = $user->businesses()->pluck('id');
        
        // Recent contacts
        $recentContacts = Contact::whereIn('business_id', $businessIds)
            ->with('business')
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($recentContacts as $contact) {
            $activities[] = [
                'id' => 'contact_' . $contact->id,
                'type' => 'contact',
                'message' => 'New contact from ' . $contact->name . ' (' . ($contact->business->name ?? 'Unknown') . ')',
                'time' => $contact->created_at->diffForHumans(),
                'status' => 'success'
            ];
        }
        
        // Recent appointments
        $recentAppointments = Appointment::whereIn('business_id', $businessIds)
            ->with('business')
            ->latest()
            ->take(3)
            ->get();
            
        foreach ($recentAppointments as $appointment) {
            $activities[] = [
                'id' => 'appointment_' . $appointment->id,
                'type' => 'appointment',
                'message' => 'New appointment with ' . $appointment->name . ' (' . ($appointment->business->name ?? 'Unknown') . ')',
                'time' => $appointment->created_at->diffForHumans(),
                'status' => 'info'
            ];
        }
        
        // Recent business views (from visits table)
        $recentViews = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->latest('created_at')
            ->take(2)
            ->get();
            
        foreach ($recentViews as $view) {
            $business = Business::find($view->business_id);
            $activities[] = [
                'id' => 'view_' . $view->id,
                'type' => 'view',
                'message' => 'Business card viewed: ' . ($business->name ?? 'Unknown'),
                'time' => \Carbon\Carbon::parse($view->created_at)->diffForHumans(),
                'status' => 'info'
            ];
        }
        
        // Sort by creation time and take latest 5
        usort($activities, function($a, $b) {
            return strtotime($b['time']) - strtotime($a['time']);
        });
        
        return array_slice($activities, 0, 5);
    }
}