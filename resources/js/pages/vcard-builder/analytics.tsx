import { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Eye, MessageSquare, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';

// Import chart components
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  contactSubmissions: number;
  dailyPageViews: Array<{
    date: string;
    views: number;
  }>;
  referrers: Array<{
    referrer: string;
    count: number;
  }>;
  devices: Array<{
    device_type: string;
    count: number;
  }>;
  platforms: Array<{
    platform_name: string;
    count: number;
  }>;
  browsers: Array<{
    browser_name: string;
    count: number;
  }>;
  startDate: string;
  endDate: string;
  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    pending: number;
    statuses: Array<{
      status: string;
      count: number;
    }>;
    daily: Array<{
      date: string;
      appointments: number;
    }>;
    popularTimes: Array<{
      time: string;
      count: number;
    }>;
  };
}

interface Business {
  id: number;
  name: string;
  business_type: string;
}

export default function VCardAnalytics() {
  const { t } = useTranslation();
  const { business, analytics, filters } = usePage().props as {
    business: Business;
    analytics: Analytics;
    filters: {
      start_date?: string;
      end_date?: string;
    };
  };

  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.start_date ? new Date(filters.start_date) : new Date(analytics.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.end_date ? new Date(filters.end_date) : new Date(analytics.endDate)
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = () => {
    if (!startDate || !endDate) return;
    
    setIsLoading(true);
    router.get(
      route('vcard-builder.analytics', business.slug),
      {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      },
      { 
        preserveState: true,
        onFinish: () => setIsLoading(false)
      }
    );
  };

  // Auto-refresh every 5 minutes for real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        router.reload({ only: ['analytics'] });
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [isLoading]);

  // Chart colors with brand primary colors
  const COLORS = ['#3b82f6', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const STATUS_COLORS = {
    Completed: '#10b77f',
    Pending: '#f59e0b', 
    Cancelled: '#ef4444',
    completed: '#10b77f',
    pending: '#f59e0b',
    cancelled: '#ef4444'
  };

  // Format date for chart display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Prepare data for device type pie chart
  const deviceData = analytics.devices?.length > 0 ? analytics.devices.map((item, index) => ({
    name: item.device_type || 'Unknown',
    value: item.count,
  })) : [{ name: 'No Data', value: 1 }];

  // Prepare data for referrers bar chart
  const referrerData = analytics.referrers?.length > 0 ? analytics.referrers.map((item) => ({
    name: item.referrer || 'Direct',
    value: item.count,
  })) : [{ name: 'No Data', value: 1 }];
  
  // Prepare data for platforms pie chart
  const platformData = analytics.platforms?.length > 0 ? analytics.platforms.map((item) => ({
    name: item.platform_name || 'Unknown',
    value: item.count,
  })) : [{ name: 'No Data', value: 1 }];
  
  // Prepare data for browsers bar chart
  const browserData = analytics.browsers?.length > 0 ? analytics.browsers.map((item) => ({
    name: item.browser_name || 'Unknown',
    value: item.count,
  })) : [{ name: 'No Data', value: 1 }];
  
  // Prepare data for appointment status pie chart
  const appointmentStatusData = analytics.appointments?.statuses?.length > 0 ? analytics.appointments.statuses.map((item) => ({
    name: item.status,
    value: item.count,
  })) : [{ name: 'No Data', value: 1 }];
  
  // Prepare data for daily appointments chart
  const dailyAppointmentsData = analytics.appointments?.daily?.length > 0 ? analytics.appointments.daily.map((item) => ({
    date: item.date,
    appointments: item.appointments,
  })) : [];
  
  // Prepare data for popular times bar chart
  const popularTimesData = analytics.appointments?.popularTimes?.length > 0 ? analytics.appointments.popularTimes.map((item) => ({
    name: item.time,
    value: item.count,
  })) : [];

  // Define page actions
  const pageActions = [
    {
      label: t('Back'),
      icon: <ArrowLeft className="h-4 w-4 mr-2" />,
      variant: 'outline' as const,
      onClick: () => router.get(route('vcard-builder.index')),
    },
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('vCard Builder'), href: route('vcard-builder.index') },
    { title: business?.name || 'Business', href: route('vcard-builder.edit', business?.id) },
    { title: t('Analytics') },
  ];

  return (
    <PageTemplate
      title={`${business?.name} - ${t('Analytics')}`}
      url={route('vcard-builder.analytics', business?.slug)}
      actions={pageActions}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* Date Range Selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{t('Date Range')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="space-y-1.5">
                <Label>{t('Start Date')}</Label>
                <DatePicker
                  selected={startDate}
                  onSelect={setStartDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t('End Date')}</Label>
                <DatePicker
                  selected={endDate}
                  onSelect={setEndDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
              <Button onClick={handleDateChange} disabled={isLoading}>
                {isLoading ? t('Loading...') : t('Apply')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Page Views')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{analytics.pageViews}</h3>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Unique Visitors')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{analytics.uniqueVisitors}</h3>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Contact Submissions')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{analytics.contactSubmissions}</h3>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Appointments')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{analytics.appointments?.total || 0}</h3>
                </div>
                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Appointment Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                {t('Completed')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-green-600">{analytics.appointments?.completed || 0}</div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  {analytics.appointments?.total > 0 ? Math.round((analytics.appointments.completed / analytics.appointments.total) * 100) : 0}%
                </Badge>
              </div>
              <Progress className="mt-2" value={analytics.appointments?.total > 0 ? (analytics.appointments.completed / analytics.appointments.total) * 100 : 0} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                {t('Pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-amber-600">{analytics.appointments?.pending || 0}</div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                  {analytics.appointments?.total > 0 ? Math.round((analytics.appointments.pending / analytics.appointments.total) * 100) : 0}%
                </Badge>
              </div>
              <Progress className="mt-2" value={analytics.appointments?.total > 0 ? (analytics.appointments.pending / analytics.appointments.total) * 100 : 0} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                {t('Cancelled')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-red-600">{analytics.appointments?.cancelled || 0}</div>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  {analytics.appointments?.total > 0 ? Math.round((analytics.appointments.cancelled / analytics.appointments.total) * 100) : 0}%
                </Badge>
              </div>
              <Progress className="mt-2" value={analytics.appointments?.total > 0 ? (analytics.appointments.cancelled / analytics.appointments.total) * 100 : 0} />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">{t('Traffic & Audience')}</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('Daily Page Views')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('Page views over the selected time period')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analytics.dailyPageViews || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="views"
                          name="Page Views"
                          stroke="#3b82f6"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('Top Referrers')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('Sources of traffic to your business card')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={referrerData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Visits" fill="#8884d8">
                          {referrerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">{t('Devices & Platforms')}</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('Device Types')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('Breakdown of visitors by device type')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('Operating Systems')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('Breakdown of visitors by operating system')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">{t('Browser Insights')}</h2>
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">{t('Web Browsers')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('Breakdown of visitors by web browser')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={browserData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Visits" fill="#8884d8">
                          {browserData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">{t('Appointments')}</h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('Appointment Analytics')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('Track booking patterns and appointment outcomes')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t('Appointment Status Distribution')}</CardTitle>
                      <CardDescription className="text-xs">
                        {t('Breakdown of appointments by status')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={appointmentStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {appointmentStatusData.map((entry, index) => (
                                <Cell
                                  key={`cell-${entry.name}`}
                                  fill={STATUS_COLORS[entry.name.toLowerCase() as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">{t('Daily Appointments')}</CardTitle>
                      <CardDescription className="text-xs">
                        {t('Number of appointments per day')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={dailyAppointmentsData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={formatDate}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="appointments"
                              name="Appointments"
                              stroke="#3b82f6"
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="xl:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-sm">{t('Popular Appointment Times')}</CardTitle>
                      <CardDescription className="text-xs">
                        {t('Most frequently booked time slots')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={popularTimesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Bookings" fill="#3b82f6">
                              {popularTimesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
