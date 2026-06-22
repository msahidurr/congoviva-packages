import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Users, Globe, Smartphone, Clock, TrendingUp, MapPin, Monitor, Calendar, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { router } from '@inertiajs/react';
import { fetchSectionData, fetchRealtimeData } from './analytics-api';

interface VisitorAnalytics {
  overview: {
    totalVisitors: number;
    todayVisitors: number;
    onlineVisitors: number;
    totalPageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  trends: {
    daily: Array<{ date: string; visitors: number; pageViews: number }>;
    weekly: Array<{ week: string; visitors: number; pageViews: number }>;
    monthly: Array<{ month: string; visitors: number; pageViews: number }>;
  };
  geographic: Array<{ country: string; visitors: number; percentage: number }>;
  devices: Array<{ device: string; visitors: number; percentage: number }>;
  browsers: Array<{ browser: string; visitors: number; percentage: number }>;
  referrers: Array<{ source: string; visitors: number; percentage: number }>;
  popularPages: Array<{ url: string; views: number; title: string }>;
  realtime: {
    currentVisitors: number;
    activePages: Array<{ url: string; visitors: number }>;
  };
}

interface AnalyticsData {
  visitor: VisitorAnalytics;
  business: {
    totalContacts: number;
    totalAppointments: number;
    conversionRate: number;
  };
}

export default function CompanyAnalytics({ analytics }: { analytics: AnalyticsData }) {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7d');
  
  // Demo data for IS_DEMO=true
  const demoAnalytics: AnalyticsData = {
    visitor: {
      overview: {
        totalVisitors: 15847,
        todayVisitors: 342,
        onlineVisitors: 28,
        totalPageViews: 45231,
        avgSessionDuration: 185,
        bounceRate: 32
      },
      trends: {
        daily: [
          { date: '2026-01-01', visitors: 245, pageViews: 678 },
          { date: '2026-01-02', visitors: 312, pageViews: 892 },
          { date: '2026-01-03', visitors: 289, pageViews: 756 },
          { date: '2026-01-04', visitors: 398, pageViews: 1024 },
          { date: '2026-01-05', visitors: 356, pageViews: 934 },
          { date: '2026-01-06', visitors: 423, pageViews: 1156 },
          { date: '2026-01-07', visitors: 387, pageViews: 1089 }
        ],
        weekly: [
          { week: 'Week 1', visitors: 2145, pageViews: 5678 },
          { week: 'Week 2', visitors: 2398, pageViews: 6234 },
          { week: 'Week 3', visitors: 2567, pageViews: 6789 },
          { week: 'Week 4', visitors: 2834, pageViews: 7456 }
        ],
        monthly: [
          { month: 'Jan', visitors: 8945, pageViews: 23456 },
          { month: 'Feb', visitors: 9234, pageViews: 24567 },
          { month: 'Mar', visitors: 9567, pageViews: 25678 }
        ]
      },
      geographic: [
        { country: 'United States', visitors: 5234, percentage: 33 },
        { country: 'Canada', visitors: 2145, percentage: 14 },
        { country: 'United Kingdom', visitors: 1876, percentage: 12 },
        { country: 'Germany', visitors: 1456, percentage: 9 },
        { country: 'France', visitors: 1234, percentage: 8 }
      ],
      devices: [
        { device: 'Mobile', visitors: 8945, percentage: 56 },
        { device: 'Desktop', visitors: 5234, percentage: 33 },
        { device: 'Tablet', visitors: 1668, percentage: 11 }
      ],
      browsers: [
        { browser: 'Chrome', visitors: 9456, percentage: 60 },
        { browser: 'Safari', visitors: 3178, percentage: 20 },
        { browser: 'Firefox', visitors: 1589, percentage: 10 },
        { browser: 'Edge', visitors: 1624, percentage: 10 }
      ],
      referrers: [
        { source: 'Google', visitors: 7234, percentage: 46 },
        { source: 'Direct', visitors: 4567, percentage: 29 },
        { source: 'Facebook', visitors: 2345, percentage: 15 },
        { source: 'LinkedIn', visitors: 1701, percentage: 10 }
      ],
      popularPages: [
        { url: '/home', views: 12456, title: 'Home Page' },
        { url: '/about', views: 8934, title: 'About Us' },
        { url: '/services', views: 6789, title: 'Our Services' },
        { url: '/contact', views: 4567, title: 'Contact Us' }
      ],
      realtime: {
        currentVisitors: 28,
        activePages: [
          { url: '/home', visitors: 12 },
          { url: '/services', visitors: 8 },
          { url: '/about', visitors: 5 },
          { url: '/contact', visitors: 3 }
        ]
      }
    },
    business: {
      totalContacts: 1247,
      totalAppointments: 456,
      conversionRate: 7.8
    }
  };
  
  // Use demo data if IS_DEMO is true, otherwise use real analytics
  const currentAnalytics = (window as any).page?.props?.is_demo ? demoAnalytics : analytics;
  const [realtimeData, setRealtimeData] = useState(currentAnalytics.visitor.realtime);
  
  // State for lazy-loaded data
  const [geographicData, setGeographicData] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  const [browsersData, setBrowsersData] = useState([]);
  const [referrersData, setReferrersData] = useState([]);
  const [popularPagesData, setPopularPagesData] = useState([]);
  
  // Initialize with empty arrays to prevent rendering errors
  useEffect(() => {
    setGeographicData([]);
    setDevicesData([]);
    setBrowsersData([]);
    setReferrersData([]);
    setPopularPagesData([]);
  }, [timeRange]);
  
  // Loading states
  const [loading, setLoading] = useState({
    geographic: true,
    devices: true,
    browsers: true,
    referrers: true,
    popularPages: true
  });
  
  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Analytics') }
  ];

  // Real-time data polling with optimized interval
  useEffect(() => {
    const isDemo = (window as any).page?.props?.is_demo;
    
    if (isDemo) {
      // Use demo real-time data
      setRealtimeData(demoAnalytics.visitor.realtime);
      return;
    }
    
    let isMounted = true;
    let pollingInterval = 60000; // Increase polling interval to 60 seconds
    
    const getRealtimeData = async () => {
      const data = await fetchRealtimeData();
      if (isMounted && data) {
        setRealtimeData(data);
      }
    };
    
    const interval = setInterval(getRealtimeData, pollingInterval);
    
    // Fetch immediately on component mount
    getRealtimeData();
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  // Memoize static values to prevent unnecessary re-renders
  const COLORS = useMemo(() => ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'], []);
  
  // Memoize chart data based on time range
  const chartData = useMemo(() => {
    let data;
    switch(timeRange) {
      case '1d':
        data = currentAnalytics.visitor.trends.daily.filter(item => 
          new Date(item.date).getTime() >= new Date().setHours(0,0,0,0));
        break;
      case '7d':
        data = currentAnalytics.visitor.trends.daily;
        break;
      case '30d':
        data = currentAnalytics.visitor.trends.weekly;
        break;
      case '90d':
        data = currentAnalytics.visitor.trends.monthly;
        break;
      default:
        data = currentAnalytics.visitor.trends.daily;
    }
    return data;
  }, [timeRange, currentAnalytics.visitor.trends]);
  
  // Load data lazily when component mounts
  useEffect(() => {
    const isDemo = (window as any).page?.props?.is_demo;
    
    if (isDemo) {
      // Use demo data immediately
      setGeographicData(demoAnalytics.visitor.geographic);
      setDevicesData(demoAnalytics.visitor.devices);
      setBrowsersData(demoAnalytics.visitor.browsers);
      setReferrersData(demoAnalytics.visitor.referrers);
      setPopularPagesData(demoAnalytics.visitor.popularPages);
      
      setLoading({
        geographic: false,
        devices: false,
        browsers: false,
        referrers: false,
        popularPages: false
      });
    } else {
      const loadSectionData = async (section) => {
        try {
          const data = await fetchSectionData(section, timeRange);
          
          switch(section) {
            case 'geographic':
              setGeographicData(data);
              break;
            case 'devices':
              setDevicesData(data);
              break;
            case 'browsers':
              setBrowsersData(data);
              break;
            case 'referrers':
              setReferrersData(data);
              break;
            case 'popularPages':
              setPopularPagesData(data);
              break;
          }
          
          setLoading(prev => ({ ...prev, [section]: false }));
        } catch (error) {
          setLoading(prev => ({ ...prev, [section]: false }));
        }
      };
      
      // Reset loading states when time range changes
      setLoading({
        geographic: true,
        devices: true,
        browsers: true,
        referrers: true,
        popularPages: true
      });
      
      // Load data in sequence to avoid overwhelming the server
      const loadAllData = async () => {
        await loadSectionData('geographic');
        await loadSectionData('devices');
        await loadSectionData('browsers');
        await loadSectionData('referrers');
        await loadSectionData('popularPages');
      };
      
      loadAllData();
    }
  }, [timeRange]);

  return (
    <PageTemplate title={t('Analytics')} url="/analytics" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              {realtimeData.currentVisitors} {t('Online Now')}
            </Badge>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">{t('Today')}</SelectItem>
              <SelectItem value="7d">{t('7 Days')}</SelectItem>
              <SelectItem value="30d">{t('30 Days')}</SelectItem>
              <SelectItem value="90d">{t('90 Days')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Visitors')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.visitor.overview.totalVisitors.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Today')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.visitor.overview.todayVisitors.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Page Views')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.visitor.overview.totalPageViews.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Avg. Session')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{formatDuration(currentAnalytics.visitor.overview.avgSessionDuration)}</h3>
                </div>
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Bounce Rate')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.visitor.overview.bounceRate}%</h3>
                </div>
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Contacts')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.business.totalContacts}</h3>
                </div>
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('Visitor Trends')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey={timeRange === '30d' || timeRange === '90d' ? 'week' : 'date'} 
                    tickFormatter={(value) => timeRange === '30d' || timeRange === '90d' ? value : new Date(value).toLocaleDateString()} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => timeRange === '30d' || timeRange === '90d' ? value : new Date(value).toLocaleDateString()} 
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} name="Visitors" />
                  <Area type="monotone" dataKey="pageViews" stroke="#16a34a" fill="#22c55e" fillOpacity={0.4} name="Page Views" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('Geographic Distribution')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.geographic ? (
                <div className="flex items-center justify-center h-[300px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : geographicData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  {t('No geographic data available')}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={geographicData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, percentage }) => `${country} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {geographicData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Device & Browser Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                {t('Device Types')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.devices ? (
                <div className="flex items-center justify-center h-[150px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : devicesData.length === 0 ? (
                <div className="flex items-center justify-center h-[150px] text-gray-500">
                  {t('No device data available')}
                </div>
              ) : (
                <div className="space-y-3">
                  {devicesData.map((device, index) => (
                    <div key={`device-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{device.visitors.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-2">({device.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                {t('Browsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.browsers ? (
                <div className="flex items-center justify-center h-[150px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : browsersData.length === 0 ? (
                <div className="flex items-center justify-center h-[150px] text-gray-500">
                  {t('No browser data available')}
                </div>
              ) : (
                <div className="space-y-3">
                  {browsersData.map((browser, index) => (
                    <div key={`browser-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm font-medium">{browser.browser}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{browser.visitors.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-2">({browser.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources & Popular Pages */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('Traffic Sources')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.referrers ? (
                <div className="flex items-center justify-center h-[150px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : referrersData.length === 0 ? (
                <div className="flex items-center justify-center h-[150px] text-gray-500">
                  {t('No referrer data available')}
                </div>
              ) : (
                <div className="space-y-3">
                  {referrersData.map((referrer, index) => (
                    <div key={`referrer-${index}`} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <span className="text-sm font-medium">{referrer.source}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">{referrer.visitors.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-2">({referrer.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t('Popular Pages')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.popularPages ? (
                <div className="flex items-center justify-center h-[150px]">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : popularPagesData.length === 0 ? (
                <div className="flex items-center justify-center h-[150px] text-gray-500">
                  {t('No page view data available')}
                </div>
              ) : (
                <div className="space-y-3">
                  {popularPagesData.map((page, index) => (
                    <div key={`page-${index}`} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{page.title || page.url}</p>
                        <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                      </div>
                      <span className="text-sm font-bold ml-2">{page.views.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              {t('Real-time Activity')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold mb-3">{t('Currently Online')}: {realtimeData.currentVisitors}</h4>
                <div className="space-y-2">
                  {realtimeData.activePages.map((page, index) => (
                    <div key={`active-${index}`} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <span className="text-xs truncate">{page.url}</span>
                      <Badge variant="secondary">{page.visitors}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-semibold">{t('Conversion Rate')}</h4>
                  <p className="text-2xl font-bold text-green-600">{currentAnalytics.business.conversionRate}%</p>
                  <p className="text-xs text-muted-foreground">{t('Visitors to contacts')}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-semibold">{t('Total Appointments')}</h4>
                  <p className="text-2xl font-bold text-blue-600">{currentAnalytics.business.totalAppointments}</p>
                  <p className="text-xs text-muted-foreground">{t('Scheduled this period')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </PageTemplate>
  );
}