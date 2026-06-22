import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Building2, DollarSign, Nfc } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  overview: {
    totalCompanies: number;
    totalCardRequest: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  charts: {
    userGrowth: Array<{ month: string; users: number }>;
    revenueChart: Array<{ month: string; revenue: number }>;
    planDistribution: Array<{ name: string; value: number }>;
  };
}

export default function SuperAdminAnalytics({ analytics }: { analytics: AnalyticsData }) {
  const { t } = useTranslation();

  // Demo data for IS_DEMO=true
  const demoAnalytics: AnalyticsData = {
    overview: {
      totalCompanies: 15,
      totalCardRequest: 2,
      totalRevenue: 125847.50,
      monthlyGrowth: 18.5
    },
    charts: {
      userGrowth: [
        { month: 'Jan', users: 245 },
        { month: 'Feb', users: 400 },
        { month: 'Mar', users: 300 },
        { month: 'Apr', users: 350 },
        { month: 'May', users: 300 },
        { month: 'Jun', users: 500 }
      ],
      revenueChart: [
        { month: 'Jan', revenue: 14000 },
        { month: 'Feb', revenue: 22000 },
        { month: 'Mar', revenue: 18000 },
        { month: 'Apr', revenue: 31000 },
        { month: 'May', revenue: 26000 },
        { month: 'Jun', revenue: 34000 }
      ],
      planDistribution: [
        { name: 'Basic Plan', value: 45 },
        { name: 'Pro Plan', value: 35 },
        { name: 'Enterprise Plan', value: 15 },
        { name: 'Custom Plan', value: 5 }
      ]
    }
  };
  
  // Use demo data if IS_DEMO is true, otherwise use real analytics
  const currentAnalytics = (window as any).page?.props?.is_demo ? demoAnalytics : analytics;

  

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Analytics') }
  ];
  return (
    <PageTemplate title={t('Analytics')} url="/analytics" breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Companies')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.overview.totalCompanies}</h3>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total NfC Card Request')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{currentAnalytics.overview.totalCardRequest}</h3>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <Nfc className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Revenue')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{window.appSettings.formatCurrency(currentAnalytics.overview.totalRevenue)}</h3>
                </div>
                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                  <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Monthly Growth')}</p>
                  <h3 className="mt-2 text-2xl font-bold">+{currentAnalytics.overview.monthlyGrowth}%</h3>
                </div>
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                  <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                {t('User Growth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={currentAnalytics.charts.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t('Revenue Growth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentAnalytics.charts.revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${window.appSettings.formatCurrency(value.toLocaleString())}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} dot={{ fill: '#16a34a' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t('Plan Distribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={currentAnalytics.charts.planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {currentAnalytics.charts.planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b77f', '#f59e0b', '#8b5cf6'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-6">
                {currentAnalytics.charts.planDistribution.map((plan, index) => (
                  <div key={plan.name} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                        style={{ backgroundColor: ['#3b82f6', '#10b77f', '#f59e0b', '#8b5cf6'][index % 4] }}
                      />
                      <span className="text-sm font-medium">{plan.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: ['#3b82f6', '#10b77f', '#f59e0b', '#8b5cf6'][index % 4] }}>
                        {plan.value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}