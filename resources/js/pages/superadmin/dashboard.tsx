import React, { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { RefreshCw, BarChart3, Download, Nfc, Building2, CreditCard, Ticket, DollarSign, TrendingUp, Activity, UserPlus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import { router } from '@inertiajs/react';

interface SuperAdminDashboardData {
  stats: {
    totalCompanies: number;
    totalNfcCards: number;
    totalRevenue: number;
    activePlans: number;
    pendingRequests: number;
    monthlyGrowth: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    status: 'success' | 'warning' | 'error';
  }>;
  topPlans: Array<{
    name: string;
    subscribers: number;
    revenue: number;
  }>;
}

interface PageAction {
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

export default function SuperAdminDashboard({ dashboardData }: { dashboardData: SuperAdminDashboardData }) {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.reload({ only: ['dashboardData'] });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAnalytics = () => {
    router.visit(route('analytics'));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(route('dashboard.export-report'), {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Export failed:', response.statusText);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const pageActions: PageAction[] = [
    {
      label: t('Refresh'),
      icon: <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />,
      variant: 'outline',
      onClick: handleRefresh
    },
    {
      label: t('Analytics'),
      icon: <BarChart3 className="h-4 w-4" />,
      variant: 'outline',
      onClick: handleAnalytics
    },
    {
      label: isExporting ? t('Exporting...') : t('Export Report'),
      icon: <Download className="h-4 w-4" />,
      variant: 'default',
      onClick: handleExport
    }
  ];

  const stats = dashboardData?.stats || {
    totalCompanies: 156,
    totalNfcCards: 89,
    totalRevenue: 45678,
    activePlans: 89,
    pendingRequests: 12,
    monthlyGrowth: 15.2
  };

  const recentActivity = dashboardData?.recentActivity || [
    { id: 1, type: 'company', message: 'New company registered: TechCorp Inc.', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'plan', message: 'Plan upgrade request from ABC Ltd.', time: '4 hours ago', status: 'warning' },
    { id: 3, type: 'payment', message: 'Payment received: $299 from XYZ Corp', time: '6 hours ago', status: 'success' },
    { id: 4, type: 'domain', message: 'Domain request pending approval', time: '8 hours ago', status: 'warning' },
  ];

  const topPlans = dashboardData?.topPlans || [
    { name: 'Professional', subscribers: 45, revenue: 13500 },
    { name: 'Business', subscribers: 32, revenue: 9600 },
    { name: 'Enterprise', subscribers: 12, revenue: 7200 },
  ];

  return (
    <PageTemplate 
      title={t('Dashboard')}
      url="/dashboard"
      actions={pageActions}
    >
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-2 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Active Plans')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.activePlans.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Pending Requests')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.pendingRequests.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                  <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Monthly Growth')}</p>
                  <h3 className="mt-2 text-2xl font-bold">+{stats.monthlyGrowth}%</h3>
                </div>
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Companies')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.totalCompanies.toLocaleString()}</h3>
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
                  <p className="text-sm font-medium text-muted-foreground">{t('NFC Cards')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.totalNfcCards?.toLocaleString() || 0}</h3>
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
                  <h3 className="mt-2 text-2xl font-bold">{window.appSettings.formatCurrency(stats.totalRevenue.toLocaleString())}</h3>
                </div>
                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                  <DollarSign className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                {t('Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium line-clamp-2">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === 'success' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Plans */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Ticket className="h-4 w-4 sm:h-5 sm:w-5" />
                {t('Top Performing Plans')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                {topPlans.map((plan, index) => (
                  <div key={plan.name} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{plan.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.subscribers} {t("subscribers")}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm sm:text-base">{window?.appSettings?.currencySettings?.currencySymbol || "$"}{plan.revenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{t("revenue")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Overview */}
        <DashboardOverview userType="superadmin" stats={stats} />
      </div>
    </PageTemplate>
  );
}