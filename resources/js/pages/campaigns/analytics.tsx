import { PageTemplate } from '@/components/page-template';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, DollarSign, TrendingUp, Clock, Activity } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function CampaignAnalytics() {
  const { t } = useTranslation();
  const { campaign, metrics, businessStats, monthlyTrends, statusDistribution, isAdmin } = usePage().props as any;

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Campaigns'), href: route('campaigns.index') },
    { title: t('Analytics') }
  ];

  const currencySymbol = window?.appSettings?.currencySettings?.currencySymbol || '$';

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800 rounded-full',
      active: 'bg-green-100 text-green-800 rounded-full',
      completed: 'bg-blue-100 text-blue-800 rounded-full',
      cancelled: 'bg-red-100 text-red-800 rounded-full',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 rounded-full';
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const campaignInfoItems = [
    { label: t('Company'), value: campaign.user?.name || '-' },
    { label: t('Business'), value: campaign.business?.name || '-' },
    { label: t('Duration'), value: `${campaign.total_days} ${t('days')}` },
    { label: t('Start Date'), value: formatDate(campaign.start_date) },
    { label: t('End Date'), value: formatDate(campaign.end_date) },
    { label: t('Payment Method'), value: capitalize((campaign.payment_method || '-').replace('_', ' ')), capitalizeValue: true },
    { label: t('Created Date'), value: formatDate(campaign.created_at) },
    { label: t('Last Updated'), value: formatDate(campaign.updated_at) },
  ];

  return (
    <PageTemplate
      title={campaign.name}
      breadcrumbs={breadcrumbs}
      actions={[
        {
          label: t('Back'),
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
          variant: 'outline',
          onClick: () => router.get(route('campaigns.index')),
        },
      ]}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('Campaign Analytics')}</h2>
          <Badge className= {getStatusColor(campaign.status)}>{capitalize(campaign.status)}</Badge>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('Total Revenue')}</p>
                  <h3 className="text-xl font-bold text-gray-900">{currencySymbol}{metrics.total_revenue}</h3>
                  <p className="text-xs text-gray-500 mt-1">{currencySymbol}{Number(metrics.cost_per_day).toFixed(2)} {t('per day')}</p>
                </div>
                <div className="rounded-full bg-green-50 p-2.5">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('Progress')}</p>
                  <h3 className="text-xl font-bold text-gray-900">{metrics.progress_percentage}%</h3>
                  <Progress value={metrics.progress_percentage} className="h-1.5 mt-2" />
                </div>
                <div className="rounded-full bg-blue-50 p-2.5">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('Days Remaining')}</p>
                  <h3 className="text-xl font-bold text-gray-900">{metrics.days_remaining}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t('Until completion')}</p>
                </div>
                <div className="rounded-full bg-orange-50 p-2.5">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 mb-1">{t('ROI Estimate')}</p>
                  <h3 className="text-xl font-bold text-gray-900">{metrics.roi_estimate.roi_percentage}%</h3>
                  <p className="text-xs text-gray-500 mt-1">{currencySymbol}{metrics.roi_estimate.estimated_return} {t('expected')}</p>
                </div>
                <div className="rounded-full bg-purple-50 p-2.5">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Information */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">{t('Campaign Information')}</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {campaignInfoItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">
                  <p className="text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300">{item.label}</p>
                  <p className={`text-right text-sm font-semibold text-gray-900 dark:text-gray-100 ${item.capitalizeValue ? 'capitalize' : ''}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Performance */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">{t('Business Performance')}</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs font-medium tracking-wide text-gray-500">{t('Total Campaigns')}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{businessStats?.total_campaigns || 0}</p>
              </div>
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900/50 dark:bg-green-950/20">
                <p className="text-xs font-medium tracking-wide text-green-700 dark:text-green-400">{t('Total Revenue')}</p>
                <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-300">{currencySymbol}{businessStats?.total_revenue || 0}</p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-950/20">
                <p className="text-xs font-medium tracking-wide text-blue-700 dark:text-blue-400">{t('Current Campaign')}</p>
                <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-300">{currencySymbol}{campaign.total_amount}</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-xs font-medium tracking-wide text-gray-500">{t('Contribution')}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {businessStats?.total_revenue ? Math.round((campaign.total_amount / businessStats.total_revenue) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Analytics */}
        {isAdmin && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardContent className="flex h-full flex-col p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">{t('Monthly Trends')}</h2>
                <p className="text-xs text-gray-500 mb-3">{t('Campaign activity over the last 6 months')}</p>
                <div className="max-h-[288px] flex-1 space-y-3 overflow-y-auto pr-1">
                    {monthlyTrends?.map((trend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60">
                        <div className="min-w-0">
                          <p className="text-sm font-bold tracking-wide text-gray-700 dark:text-gray-300">{trend.month}</p>
                          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{trend.count} {t('campaigns')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-semibold tracking-wide text-gray-700 dark:text-gray-300">{t('Revenue')}</p>
                          <p className="mt-1 text-sm font-semibold text-green-600">
                            {currencySymbol}{Number(trend?.revenue ?? 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex h-full flex-col p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">{t('Status Distribution')}</h2>
                <p className="text-xs text-gray-500 mb-3">{t('Campaign status breakdown')}</p>
                <div className="max-h-[288px] flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto max-h-[288px]">
                    {statusDistribution?.map((status: any, index: number) => (
                      <div key={index} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60">
                        <div className="min-w-0">
                          <p className="mb-1 text-[12px] font-semibold tracking-wide text-gray-700 dark:text-gray-300">{t('Status')}</p>
                          <Badge className={getStatusColor(status.status)}>{capitalize(status.status)}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-semibold tracking-wide text-gray-600 dark:text-gray-300">{t('Campaigns')}</p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{status.count}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageTemplate>
  );
}
