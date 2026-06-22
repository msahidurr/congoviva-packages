import { PageTemplate } from '@/components/page-template';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { ArrowLeft, DollarSign, Users, TrendingUp } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CouponUsage {
  id: number;
  user_name: string;
  user_email: string;
  order_id: string;
  amount: number;
  discount_amount: number;
  used_at: string;
}

interface CouponData {
  id: number;
  name: string;
  code: string;
  type: string;
  discount_amount: number;
  minimum_spend?: number;
  maximum_spend?: number;
  use_limit_per_coupon?: number;
  use_limit_per_user?: number;
  used_count: number;
  expiry_date?: string;
  status: boolean;
  created_at: string;
  creator: {
    name: string;
    email: string;
  };
}

export default function CouponDetailsPage() {
  const { t } = useTranslation();
  const { coupon, usage_history } = usePage().props as { coupon: CouponData; usage_history: any };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Plans') },
    { title: t('Coupons'), href: route('coupons.index') },
    { title: t('View Coupons') }
  ];

  const usageColumns = [
    { key: 'user_name', label: t('User'), sortable: true },
    { key: 'user_email', label: t('Email'), sortable: true },
    { key: 'order_id', label: t('Order ID'), sortable: true },
    {
      key: 'amount',
      label: t('Order Amount'),
      render: (value: number) => window.appSettings?.formatCurrency(value) || `$${value.toFixed(2)}`
    },
    {
      key: 'discount_amount',
      label: t('Discount Applied'),
      render: (value: number) => window.appSettings?.formatCurrency(value) || `$${value.toFixed(2)}`
    },
    {
      key: 'used_at',
      label: t('Used At'),
      sortable: true,
      render: (value: string) => window.appSettings?.formatDateTime(value) || value
    }
  ];

  const formatDiscount = (type: string, amount: number) => {
    return type === 'percentage'
      ? `${amount}%`
      : (window.appSettings?.formatCurrency(amount) || `$${amount.toFixed(2)}`);
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 rounded-full">{t('Active')}</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 rounded-full">{t('Inactive')}</Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const className = type === 'percentage'
      ? 'bg-blue-100 text-blue-800 rounded-full'
      : 'bg-green-100 text-green-800 rounded-full';
    const label = type === 'percentage' ? t('Percentage') : t('Flat Amount');
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <PageTemplate
      title={coupon.name}
      breadcrumbs={breadcrumbs}
      actions={[
        {
          label: t('Back'),
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
          variant: 'outline',
          onClick: () => router.get(route('coupons.index')),
        },
      ]}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('Coupon Details & Usage History')}</h2>
          {getStatusBadge(coupon.status)}
        </div>

        {/* Coupon Info Cards */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-500">{t('Discount Value')}</p>
                  <h3 className="text-xl font-bold text-gray-900">{formatDiscount(coupon.type, coupon.discount_amount)}</h3>
                </div>
                <div className="rounded-full bg-blue-50 p-2.5">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-500">{t('Times Used')}</p>
                  <h3 className="text-xl font-bold text-gray-900">
                    {coupon.used_count}{coupon.use_limit_per_coupon && ` / ${coupon.use_limit_per_coupon}`}
                  </h3>
                </div>
                <div className="rounded-full bg-green-50 p-2.5">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-500">{t('User Limit')}</p>
                  <h3 className="text-xl font-bold text-gray-900">{coupon.use_limit_per_user || t('Unlimited')}</h3>
                </div>
                <div className="rounded-full bg-purple-50 p-2.5">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="mb-1 text-sm font-medium text-gray-500">{t('Expires')}</p>
                  <h3 className="text-xl font-bold text-gray-900">
                    {coupon.expiry_date
                      ? window.appSettings?.formatDateTime(coupon.expiry_date, false) || coupon.expiry_date
                      : t('Never')}
                  </h3>
                </div>
                <div className="rounded-full bg-orange-50 p-2.5">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupon Details */}
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Coupon Information')}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">{t('Coupon Code')}</label>
                <p className="mt-1 text-base font-mono bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">{coupon.code}</p>
              </div>
              {coupon.minimum_spend && (
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('Minimum Spend')}</label>
                  <p className="mt-1 text-base text-gray-900">{window.appSettings?.formatCurrency(coupon.minimum_spend) || `$${coupon.minimum_spend.toFixed(2)}`}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">{t('Type')}</label>
                <div className="mt-1">{getTypeBadge(coupon.type)}</div>
              </div>
              {coupon.maximum_spend && (
                <div>
                  <label className="text-sm font-medium text-gray-600">{t('Maximum Spend')}</label>
                  <p className="mt-1 text-base text-gray-900">{window.appSettings?.formatCurrency(coupon.maximum_spend) || `$${coupon.maximum_spend.toFixed(2)}`}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">{t('Created By')}</label>
                <p className="mt-1 text-base text-gray-900">{coupon.creator.name} ({coupon.creator.email})</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">{t('Created At')}</label>
                <p className="mt-1 text-base text-gray-900">{window.appSettings?.formatDateTime(coupon.created_at, false) || coupon.created_at}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage History */}
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">{t('Usage History')}</h2>
            <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {usageColumns.map((column) => (
                      <TableHead key={column.key} className="text-sm font-semibold text-gray-600">{column.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usage_history.data && usage_history.data.length > 0 ? (
                    usage_history.data.map((item: any, index: number) => (
                      <TableRow key={index}>
                        {usageColumns.map((column) => (
                          <TableCell key={column.key} className="text-sm font-medium text-gray-900">
                            {column.render ? column.render(item[column.key]) : item[column.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={usageColumns.length} className="text-center py-8 text-base text-gray-500">
                        {t('No usage history found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {usage_history.last_page > 1 && (
              <div className="mt-4">
                <Pagination
                  from={usage_history.from || 0}
                  to={usage_history.to || 0}
                  total={usage_history.total || 0}
                  currentPage={usage_history.current_page}
                  lastPage={usage_history.last_page}
                  entityName={t('records')}
                  onPageChange={(url) => {
                    const urlObj = new URL(url, window.location.origin);
                    const page = urlObj.searchParams.get('page');
                    window.location.href = route('coupons.show', { coupon: coupon.id, page });
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
}
