<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Plan;
use App\Models\NfcCard;
use App\Models\PlanOrder;
use App\Models\Contact;
use App\Models\Appointment;
use App\Services\AnalyticsService;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class AnalyticsController extends Controller
{
    protected $analyticsService;
    
    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }
    
    public function index(Request $request)
    {
        $userType = auth()->user()->type;
        $timeRange = $request->get('range', '7d');
        
        if ($userType === 'superadmin') {
            return $this->superadminAnalytics();
        }
        
        // Check if this is an AJAX request for partial data
        if ($request->ajax() && $request->has('section')) {
            return $this->getAnalyticsSection($request->get('section'), $timeRange);
        }
        
        return $this->companyAnalytics($timeRange);
    }
    
    /**
     * Get a specific section of analytics data for lazy loading
     */
    public function getAnalyticsSection($section, $timeRange)
    {
        $user = auth()->user();
        $businessIds = $user->businesses()->pluck('id');
        $dateRange = $this->analyticsService->getDateRange($timeRange);
        
        switch ($section) {
            case 'geographic':
                $data = $this->analyticsService->getGeographicData($businessIds, $dateRange);
                break;
            case 'devices':
                $data = $this->analyticsService->getDeviceAnalytics($businessIds, $dateRange);
                break;
            case 'browsers':
                $data = $this->analyticsService->getBrowserAnalytics($businessIds, $dateRange);
                break;
            case 'referrers':
                $data = $this->analyticsService->getReferrerAnalytics($businessIds, $dateRange);
                break;
            case 'popularPages':
                $data = $this->analyticsService->getPopularPages($businessIds, $dateRange);
                break;
            default:
                return response()->json(['error' => 'Invalid section'], 400);
        }
        
        return response()->json(['data' => $data]);
    }
    
    public function realtime(Request $request)
    {
        $user = auth()->user();
        $businessIds = $user->businesses()->pluck('id');
        
        $realtimeData = $this->analyticsService->getRealtimeData($businessIds);
        
        return response()->json([
            'analytics' => [
                'visitor' => [
                    'realtime' => $realtimeData
                ]
            ]
        ]);
    }
    
    private function superadminAnalytics()
    {
        $analytics = $this->analyticsService->getSuperAdminAnalytics();

        return Inertia::render('superadmin/analytics', [
            'analytics' => $analytics
        ]);
    }

    private function companyAnalytics($timeRange = '7d')
    {
        $user = auth()->user();
        
        // Get only essential data for initial page load
        // Other data will be loaded via AJAX
        $businessIds = $user->businesses()->pluck('id');
        $dateRange = $this->analyticsService->getDateRange($timeRange);
        
        $analytics = [
            'visitor' => [
                'overview' => $this->analyticsService->getVisitorOverview($businessIds, $dateRange),
                'trends' => $this->analyticsService->getVisitorTrends($businessIds, $dateRange),
                'realtime' => $this->analyticsService->getRealtimeData($businessIds)
            ],
            'business' => $this->analyticsService->getBusinessAnalyticsData($businessIds, $dateRange)
        ];

        return Inertia::render('companies/analytics', [
            'analytics' => $analytics
        ]);
    }

    public function exportReport()
    {
        $data = [
            'totalCompanies' => User::where('type', 'company')->count(),
            'totalUsers' => User::count(),
            'activePlans' => Plan::where('is_plan_enable', 'on')->count(),
            'totalNfcCards' => NfcCard::count(),
            'generatedAt' => now()->format('F j, Y \\a\\t g:i A'),
            'userType' => 'superadmin'
        ];
        
        $pdf = Pdf::loadView('reports.dashboard', compact('data'));
        
        return $pdf->download('dashboard-report-' . date('Y-m-d') . '.pdf');
    }



}