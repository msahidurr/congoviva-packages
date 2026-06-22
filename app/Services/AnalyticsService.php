<?php

namespace App\Services;

use App\Models\Business;
use App\Models\Contact;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AnalyticsService
{
    public function getCompanyAnalytics($user, $timeRange = '7d')
    {
        $businessIds = $user->businesses()->pluck('id');
        $dateRange = $this->getDateRange($timeRange);
        
        // Cache key based on user ID and time range
        $cacheKey = 'analytics_' . $user->id . '_' . $timeRange;
        
        // Cache for 30 minutes
        return Cache::remember($cacheKey, 1800, function () use ($businessIds, $dateRange) {
            return [
                'visitor' => $this->getVisitorAnalytics($businessIds, $dateRange),
                'business' => $this->getBusinessAnalyticsData($businessIds, $dateRange)
            ];
        });
    }
    
    public function getSuperAdminAnalytics()
    {
        return [
            'overview' => [
                'totalCompanies' => \App\Models\User::where('type', 'company')->count(),
                'totalCardRequest' => \App\Models\NfcCardOrderRequest::where('status', 'pending')->count(),
                'totalRevenue' => \App\Models\PlanOrder::where('status', 'approved')->sum('final_price') ?? 0,
                'monthlyGrowth' => $this->getMonthlyGrowth(),
                'totalVisits' => DB::table('shetabit_visits')->count(),
                'totalBusinesses' => Business::count()
            ],
            'charts' => [
                'userGrowth' => $this->getUserGrowthData(),
                'revenueChart' => $this->getRevenueData(),
                'planDistribution' => $this->getPlanDistribution(),
                'visitTrends' => $this->getGlobalVisitTrends()
            ]
        ];
    }
    
    public function getBusinessAnalytics($business, $startDate = null, $endDate = null)
    {
        $startDate = $startDate ? Carbon::parse($startDate) : Carbon::now()->subDays(30);
        $endDate = $endDate ? Carbon::parse($endDate) : Carbon::now();
        
        $visits = DB::table('shetabit_visits')->where('business_id', $business->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();
            
        $contacts = Contact::where('business_id', $business->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();
            
        $appointments = Appointment::where('business_id', $business->id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();
        
        return [
            'pageViews' => $visits->count(),
            'uniqueVisitors' => $visits->unique('ip')->count(),
            'contactSubmissions' => $contacts->count(),
            'dailyPageViews' => $this->getDailyPageViews($business->id, $startDate, $endDate),
            'referrers' => $this->getReferrers($business->id, $startDate, $endDate),
            'devices' => $this->getDevices($business->id, $startDate, $endDate),
            'platforms' => $this->getPlatforms($business->id, $startDate, $endDate),
            'browsers' => $this->getBrowsers($business->id, $startDate, $endDate),
            'startDate' => $startDate->toDateString(),
            'endDate' => $endDate->toDateString(),
            'appointments' => [
                'total' => $appointments->count(),
                'completed' => $appointments->where('status', 'completed')->count(),
                'cancelled' => $appointments->where('status', 'cancelled')->count(),
                'pending' => $appointments->where('status', 'pending')->count(),
                'statuses' => $this->getAppointmentStatuses($business->id, $startDate, $endDate),
                'daily' => $this->getDailyAppointments($business->id, $startDate, $endDate),
                'popularTimes' => $this->getPopularAppointmentTimes($business->id, $startDate, $endDate)
            ]
        ];
    }
    
    private function getVisitorAnalytics($businessIds, $dateRange)
    {
        return [
            'overview' => $this->getVisitorOverview($businessIds, $dateRange),
            'trends' => $this->getVisitorTrends($businessIds, $dateRange),
            'geographic' => $this->getGeographicData($businessIds, $dateRange),
            'devices' => $this->getDeviceAnalytics($businessIds, $dateRange),
            'browsers' => $this->getBrowserAnalytics($businessIds, $dateRange),
            'referrers' => $this->getReferrerAnalytics($businessIds, $dateRange),
            'popularPages' => $this->getPopularPages($businessIds, $dateRange),
            'realtime' => $this->getRealtimeData($businessIds)
        ];
    }
    
    /**
     * Get visitor overview data
     */
    public function getVisitorOverview($businessIds, $dateRange)
    {
        // Cache this data for 30 minutes
        $cacheKey = 'visitor_overview_' . implode('_', $businessIds->toArray()) . '_' . $dateRange[0]->timestamp . '_' . $dateRange[1]->timestamp;
        
        return Cache::remember($cacheKey, 1800, function () use ($businessIds, $dateRange) {
            // Use a single query with conditional aggregates for better performance
            $results = DB::table('shetabit_visits')
                ->whereIn('business_id', $businessIds)
                ->selectRaw('COUNT(*) as total_visits')
                ->selectRaw('SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_visits')
                ->selectRaw('SUM(CASE WHEN created_at BETWEEN ? AND ? THEN 1 ELSE 0 END) as range_visits', [$dateRange[0], $dateRange[1]])
                ->first();
                
            $onlineVisitors = $this->getOnlineVisitors($businessIds);
                
            return [
                'totalVisitors' => $results->total_visits ?? 0,
                'todayVisitors' => $results->today_visits ?? 0,
                'onlineVisitors' => $onlineVisitors,
                'totalPageViews' => $results->range_visits ?? 0,
                'avgSessionDuration' => 180,
                'bounceRate' => 45
            ];
        });
    }
    
    /**
     * Get visitor trends data
     */
    public function getVisitorTrends($businessIds, $dateRange)
    {
        // Cache this data for 30 minutes
        $cacheKey = 'visitor_trends_' . implode('_', $businessIds->toArray()) . '_' . $dateRange[0]->timestamp . '_' . $dateRange[1]->timestamp;
        
        return Cache::remember($cacheKey, 1800, function () use ($businessIds, $dateRange) {
            return [
                'daily' => $this->getDailyTrends($businessIds, $dateRange),
                'weekly' => $this->getWeeklyTrends($businessIds),
                'monthly' => $this->getMonthlyTrends($businessIds)
            ];
        });
    }
    
    public function getBusinessAnalyticsData($businessIds, $dateRange)
    {
        // Cache business analytics data for 30 minutes
        $cacheKey = 'business_analytics_' . implode('_', $businessIds->toArray()) . '_' . $dateRange[0]->timestamp . '_' . $dateRange[1]->timestamp;
        
        return Cache::remember($cacheKey, 1800, function () use ($businessIds, $dateRange) {
            return [
                'totalContacts' => Contact::whereIn('business_id', $businessIds)
                    ->whereBetween('created_at', $dateRange)
                    ->count(),
                'totalAppointments' => Appointment::whereIn('business_id', $businessIds)
                    ->whereBetween('created_at', $dateRange)
                    ->count(),
                'conversionRate' => $this->getConversionRate($businessIds, $dateRange)
            ];
        });
    }
    
    private function getMonthlyGrowth()
    {
        $currentMonth = \App\Models\User::where('type', 'company')
            ->whereMonth('created_at', now()->month)
            ->count();
        $lastMonth = \App\Models\User::where('type', 'company')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->count();
            
        return $lastMonth > 0 ? round((($currentMonth - $lastMonth) / $lastMonth) * 100, 1) : 0;
    }
    
    private function getUserGrowthData()
    {
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = \App\Models\User::where('type', 'company')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $data[] = ['month' => $date->format('M'), 'users' => $count];
        }
        return $data;
    }
    
    private function getRevenueData()
    {
        $data = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $revenue = \App\Models\PlanOrder::where('status', 'approved')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('final_price') ?? 0;
            $data[] = ['month' => $date->format('M'), 'revenue' => $revenue];
        }
        return $data;
    }
    
    private function getPlanDistribution()
    {
        $plans = \App\Models\Plan::withCount('users')->get();
        return $plans->map(function($plan) {
            return ['name' => $plan->name, 'value' => $plan->users_count];
        })->toArray();
    }
    
    private function getGlobalVisitTrends()
    {
        return DB::table('shetabit_visits')->selectRaw('DATE(created_at) as date, COUNT(*) as visits')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'visits' => $item->visits
                ];
            });
    }
    
    private function getDailyPageViews($businessId, $startDate, $endDate)
    {
        return DB::table('shetabit_visits')->where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as views')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'views' => $item->views
                ];
            });
    }
    
    private function getReferrers($businessId, $startDate, $endDate)
    {
        return DB::table('shetabit_visits')->where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('COALESCE(referer, "Direct") as referrer, COUNT(*) as count')
            ->groupBy('referer')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
    }
    
    private function getDevices($businessId, $startDate, $endDate)
    {
        return DB::table('shetabit_visits')->where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('
                CASE 
                    WHEN NULLIF(device, "") IS NOT NULL THEN device
                    WHEN platform LIKE "%Android%" OR platform LIKE "%iOS%" OR platform LIKE "%iPhone%" OR platform LIKE "%iPad%" THEN "Mobile"
                    WHEN platform LIKE "%Windows%" OR platform LIKE "%Mac%" OR platform LIKE "%Linux%" THEN "Desktop"
                    ELSE "Unknown"
                END as device_type, 
                COUNT(*) as count
            ')
            ->groupByRaw('
                CASE 
                    WHEN NULLIF(device, "") IS NOT NULL THEN device
                    WHEN platform LIKE "%Android%" OR platform LIKE "%iOS%" OR platform LIKE "%iPhone%" OR platform LIKE "%iPad%" THEN "Mobile"
                    WHEN platform LIKE "%Windows%" OR platform LIKE "%Mac%" OR platform LIKE "%Linux%" THEN "Desktop"
                    ELSE "Unknown"
                END
            ')
            ->orderByDesc('count')
            ->get();
    }
    
    private function getPlatforms($businessId, $startDate, $endDate)
    {
        return DB::table('shetabit_visits')->where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('COALESCE(NULLIF(platform, ""), "Unknown") as platform_name, COUNT(*) as count')
            ->groupBy('platform_name')
            ->orderByDesc('count')
            ->get();
    }
    
    private function getBrowsers($businessId, $startDate, $endDate)
    {
        return DB::table('shetabit_visits')->where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('COALESCE(NULLIF(browser, ""), "Unknown") as browser_name, COUNT(*) as count')
            ->groupBy('browser_name')
            ->orderByDesc('count')
            ->get();
    }
    
    private function getAppointmentStatuses($businessId, $startDate, $endDate)
    {
        return Appointment::where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count
                ];
            });
    }
    
    private function getDailyAppointments($businessId, $startDate, $endDate)
    {
        return Appointment::where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as appointments')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'appointments' => $item->appointments
                ];
            });
    }
    
    private function getPopularAppointmentTimes($businessId, $startDate, $endDate)
    {
        return Appointment::where('business_id', $businessId)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('HOUR(appointment_time) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderByDesc('count')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'time' => sprintf('%02d:00', $item->hour),
                    'count' => $item->count
                ];
            });
    }
    
    public function getDateRange($timeRange)
    {
        switch ($timeRange) {
            case '1d':
                return [Carbon::today(), Carbon::now()];
            case '7d':
                return [Carbon::now()->subDays(7), Carbon::now()];
            case '30d':
                return [Carbon::now()->subDays(30), Carbon::now()];
            case '90d':
                return [Carbon::now()->subDays(90), Carbon::now()];
            default:
                return [Carbon::now()->subDays(7), Carbon::now()];
        }
    }
    
    private function getOnlineVisitors($businessIds)
    {
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5))
            ->distinct('ip')
            ->count();
    }
    
    private function getDailyTrends($businessIds, $dateRange)
    {
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as visitors, COUNT(*) as pageViews')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'visitors' => $item->visitors,
                    'pageViews' => $item->pageViews
                ];
            });
    }
    
    private function getWeeklyTrends($businessIds)
    {
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->where('created_at', '>=', Carbon::now()->subWeeks(8))
            ->selectRaw('YEARWEEK(created_at) as week, COUNT(*) as visitors, COUNT(*) as pageViews')
            ->groupBy('week')
            ->orderBy('week')
            ->get()
            ->map(function ($item) {
                return [
                    'week' => 'Week ' . substr($item->week, -2),
                    'visitors' => $item->visitors,
                    'pageViews' => $item->pageViews
                ];
            });
    }
    
    private function getMonthlyTrends($businessIds)
    {
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as visitors, COUNT(*) as pageViews')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::parse($item->month)->format('M Y'),
                    'visitors' => $item->visitors,
                    'pageViews' => $item->pageViews
                ];
            });
    }
    
    public function getGeographicData($businessIds, $dateRange)
    {
        // Handle both IPv4 and IPv6 addresses
        $countryData = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('
                CASE 
                    WHEN ip LIKE "::1" OR ip LIKE "127.%" OR ip LIKE "192.168.%" OR ip LIKE "10.%" THEN "Local"
                    WHEN ip LIKE "%.%.%.%" THEN SUBSTRING_INDEX(ip, ".", 2)
                    ELSE "IPv6"
                END as ip_prefix, 
                COUNT(*) as visitors
            ')
            ->groupBy('ip_prefix')
            ->orderByDesc('visitors')
            ->limit(10)
            ->get();
            
        $totalVisitors = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->count();
            
        if ($totalVisitors === 0) {
            return [];
        }
        
        // Enhanced IP prefix to country mapping
        $countries = [
            'Local' => 'Local Network',
            'IPv6' => 'Local Network',
            '1.0' => 'United States', '1.1' => 'United States', '1.2' => 'United States',
            '2.2' => 'France', '2.3' => 'France',
            '5.5' => 'Germany', '5.6' => 'Germany',
            '8.8' => 'United States', '8.4' => 'United States',
            '13.1' => 'United Kingdom', '13.2' => 'United Kingdom',
            '17.2' => 'Canada', '17.3' => 'Canada',
            '34.2' => 'India', '34.3' => 'India',
            '41.2' => 'South Africa', '41.3' => 'South Africa',
            '52.5' => 'Mexico', '52.6' => 'Mexico',
            '101.1' => 'Japan', '101.2' => 'Japan',
            '177.7' => 'Brazil', '177.8' => 'Brazil',
            '192.168' => 'Local Network', '192.1' => 'Local Network',
            '127.0' => 'Local Network', '10.0' => 'Local Network',
            '172.16' => 'Local Network'
        ];
        
        $result = [];
        foreach ($countryData as $data) {
            $country = $countries[$data->ip_prefix] ?? 'Other';
            if (!isset($result[$country])) {
                $result[$country] = 0;
            }
            $result[$country] += $data->visitors;
        }
        
        arsort($result);
        
        return collect($result)->take(10)->map(function ($visitors, $country) use ($totalVisitors) {
            return [
                'country' => $country,
                'visitors' => $visitors,
                'percentage' => round(($visitors / $totalVisitors) * 100, 1)
            ];
        })->values()->toArray();
    }
    
    private function getCountryFromIP($ip)
    {
        // Use a static cache to avoid repeated lookups
        static $ipCache = [];
        
        if (isset($ipCache[$ip])) {
            return $ipCache[$ip];
        }
        
        // Simple mapping based on IP prefix
        $ipPrefix = substr($ip, 0, strrpos($ip, '.'));
        
        $countries = [
            '1.1' => 'United States',
            '1.2' => 'United States',
            '2.2' => 'France',
            '5.5' => 'Germany',
            '8.8' => 'United States',
            '13.1' => 'United Kingdom',
            '17.2' => 'Canada',
            '34.2' => 'India',
            '41.2' => 'South Africa',
            '52.5' => 'Mexico',
            '101.1' => 'Japan',
            '177.7' => 'Brazil',
            '192.1' => 'Local Network',
            '127.0' => 'Local Network'
        ];
        
        $country = $countries[$ipPrefix] ?? 'Unknown';
        $ipCache[$ip] = $country;
        
        return $country;
    }
    
    public function getDeviceAnalytics($businessIds, $dateRange)
    {
        // Calculate total once outside the loop
        $total = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->count();
            
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('
                CASE 
                    WHEN NULLIF(device, "") IS NOT NULL THEN device
                    WHEN platform LIKE "%Android%" OR platform LIKE "%iOS%" OR platform LIKE "%iPhone%" OR platform LIKE "%iPad%" THEN "Mobile"
                    WHEN platform LIKE "%Windows%" OR platform LIKE "%Mac%" OR platform LIKE "%Linux%" THEN "Desktop"
                    ELSE "Unknown"
                END as device, 
                COUNT(*) as visitors
            ')
            ->groupByRaw('
                CASE 
                    WHEN NULLIF(device, "") IS NOT NULL THEN device
                    WHEN platform LIKE "%Android%" OR platform LIKE "%iOS%" OR platform LIKE "%iPhone%" OR platform LIKE "%iPad%" THEN "Mobile"
                    WHEN platform LIKE "%Windows%" OR platform LIKE "%Mac%" OR platform LIKE "%Linux%" THEN "Desktop"
                    ELSE "Unknown"
                END
            ')
            ->orderByDesc('visitors')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($total) {
                return [
                    'device' => $item->device,
                    'visitors' => $item->visitors,
                    'percentage' => $total > 0 ? round(($item->visitors / $total) * 100, 1) : 0
                ];
            });
    }
    
    public function getBrowserAnalytics($businessIds, $dateRange)
    {
        // Calculate total once outside the loop
        $total = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->count();
            
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('COALESCE(NULLIF(browser, ""), "Unknown") as browser, COUNT(*) as visitors')
            ->groupBy('browser')
            ->orderByDesc('visitors')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($total) {
                return [
                    'browser' => $item->browser,
                    'visitors' => $item->visitors,
                    'percentage' => $total > 0 ? round(($item->visitors / $total) * 100, 1) : 0
                ];
            });
    }
    
    public function getReferrerAnalytics($businessIds, $dateRange)
    {
        // Calculate total once outside the loop
        $total = DB::table('shetabit_visits')
            ->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->count();
            
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('COALESCE(referer, "Direct") as source, COUNT(*) as visitors')
            ->groupBy('source')
            ->orderByDesc('visitors')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($total) {
                return [
                    'source' => $item->source === 'Direct' ? 'Direct' : parse_url($item->source, PHP_URL_HOST) ?? $item->source,
                    'visitors' => $item->visitors,
                    'percentage' => $total > 0 ? round(($item->visitors / $total) * 100, 1) : 0
                ];
            });
    }
    
    public function getPopularPages($businessIds, $dateRange)
    {
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->selectRaw('url, COUNT(*) as views, url as title')
            ->groupBy('url')
            ->orderByDesc('views')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'url' => $item->url,
                    'views' => $item->views,
                    'title' => parse_url($item->url, PHP_URL_PATH) ?? $item->url
                ];
            });
    }
    
    private function getActivePages($businessIds)
    {
        return DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5))
            ->selectRaw('url, COUNT(*) as visitors')
            ->groupBy('url')
            ->orderByDesc('visitors')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'url' => parse_url($item->url, PHP_URL_PATH) ?? $item->url,
                    'visitors' => $item->visitors
                ];
            });
    }
    
    private function getConversionRate($businessIds, $dateRange)
    {
        $visits = DB::table('shetabit_visits')->whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->count();
            
        $contacts = Contact::whereIn('business_id', $businessIds)
            ->whereBetween('created_at', $dateRange)
            ->count();
            
        return $visits > 0 ? round(($contacts / $visits) * 100, 1) : 0;
    }
    
    public function getRealtimeData($businessIds)
    {
        // Cache realtime data for 1 minute to prevent excessive queries
        $cacheKey = 'realtime_' . implode('_', $businessIds->toArray());
        
        return Cache::remember($cacheKey, 60, function () use ($businessIds) {
            return [
                'currentVisitors' => $this->getOnlineVisitors($businessIds),
                'activePages' => $this->getActivePages($businessIds)
            ];
        });
    }
}