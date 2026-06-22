import React from 'react';
import { Head, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { BarChart3, Eye, Users, Calendar, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Menu {
  id: number;
  name: string;
  slug: string;
  menu_type: string;
  public_url: string;
}

interface Analytics {
  pageViews: number;
  uniqueVisitors: number;
  dailyViews: Array<{ date: string; views: number }>;
  startDate: string;
  endDate: string;
}

interface Props {
  menu: Menu;
  analytics: Analytics;
  filters: {
    start_date?: string;
    end_date?: string;
  };
}

export default function MenuAnalytics({ menu, analytics, filters }: Props) {
  const { t } = useTranslation();

  const [startDate, setStartDate] = React.useState(filters.start_date || analytics.startDate);
  const [endDate, setEndDate] = React.useState(filters.end_date || analytics.endDate);

  const handleFilterChange = () => {
    router.get(route('menu.analytics', menu.id), {
      start_date: startDate,
      end_date: endDate
    }, {
      preserveState: true,
      replace: true
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Views'],
      ...(analytics.dailyViews || []).map(item => [item.date, item.views])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu-analytics-${menu.name}-${startDate}-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Menu'), href: route('menu.index') },
    { title: menu.name, href: route('menu.edit', menu.id) },
    { title: t('Analytics') }
  ];

  return (
    <PageTemplate 
      title={`${menu.name} - Analytics`} 
      url={route('menu.analytics', menu.id)} 
      breadcrumbs={breadcrumbs}
    >
      <Head title={`${menu.name} - Analytics`} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('Menu Analytics')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {menu.name}
          </p>
        </div>
        
        <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t('Export Data')}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Date Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="start_date" className="text-sm font-medium">
                {t('Start Date')}
              </Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="end_date" className="text-sm font-medium">
                {t('End Date')}
              </Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleFilterChange} className="px-6">
              {t('Apply Filter')}
            </Button>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('Total Views')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.pageViews.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('Unique Visitors')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.uniqueVisitors.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('Avg. Daily Views')}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {analytics.dailyViews?.length > 0 
                    ? Math.round(analytics.pageViews / analytics.dailyViews.length)
                    : 0
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('Daily Views')}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(analytics.startDate, false) : new Date(analytics.startDate).toLocaleDateString()} - {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(analytics.endDate, false) : new Date(analytics.endDate).toLocaleDateString()}
            </div>
          </div>
          
          {analytics.dailyViews?.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyViews || []}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(value, false) : new Date(value).toLocaleDateString()}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(value, false) : new Date(value).toLocaleDateString()}
                    formatter={(value: any) => [value, t('Views')]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#10b77f" 
                    strokeWidth={2}
                    dot={{ fill: '#10b77f', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10b77f', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('No data available for the selected period')}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Menu Info */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('Menu Information')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Public URL')}
              </Label>
              <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                <a 
                  href={menu.public_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                >
                  {menu.public_url}
                </a>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('Menu Type')}
              </Label>
              <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {menu.menu_type}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageTemplate>
  );
}