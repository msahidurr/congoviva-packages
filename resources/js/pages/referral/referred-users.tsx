import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { useTranslation } from 'react-i18next';
import { usePage, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Users, TrendingUp, DollarSign } from 'lucide-react';

export default function ReferredUsers() {
  const { t } = useTranslation();
  const { referredUsers, userType } = usePage().props as any;

  const formatDate = (date: string) =>
    formatDistanceToNow(new Date(date), { addSuffix: true });

  const getTotalCommission = (user: any) =>
    user.referrals?.reduce((t: number, r: any) => t + Number(r.amount || 0), 0) || 0;

  const getPlan = (user: any) => {
    if (!user.plan) return null;
    const order = user.plan_orders?.[0];

    return {
      name: user.plan.name,
      price: order?.final_price || user.plan.price,
      cycle: order?.billing_cycle === 'yearly' ? 'year' : 'month'
    };
  };
  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Referral Program'), href: route('referral.index') },
    { title: t('Referred Users') }
  ];
  return (
    <PageTemplate
      title={t('Referred Users')}
      url="/referral/referred-users"
      breadcrumbs={breadcrumbs}

      actions={[
        {
          label: t('Back'),
          icon: <ArrowLeft className="h-4 w-4 mr-2" />,
          variant: 'outline',
          onClick: () => router.get(route('referral.index')),
        },
      ]}
    >
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('Referred Users & Earnings')}
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t('Total Users')}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {referredUsers.total}
                  </h3>
                </div>

                <div className="rounded-full bg-green-50 p-3">
                  <Users className="h-5 w-5 text-green-600" />
                </div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t('With Plans')}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {referredUsers.data.filter((u: any) => u.plan).length}
                  </h3>
                </div>

                <div className="rounded-full bg-blue-50 p-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t('Total Commission')}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {window.appSettings.formatCurrency(
                      referredUsers.data.reduce(
                        (t: number, u: any) => t + getTotalCommission(u),
                        0
                      )
                    )}
                  </h3>
                </div>

                <div className="rounded-full bg-yellow-50 p-3">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Card */}
        <div className="space-y-4">

          {/* Users List */}
          {referredUsers.data.length > 0 ? (
            referredUsers.data.map((user: any) => {
              const planInfo = getPlan(user);
              const commission = getTotalCommission(user);

              return (
                <div key={user.id} className="border rounded-lg p-4 hover:shadow-sm transition">

                  <div className="flex items-center justify-between">

                    {/* Left */}
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            {user.name}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            ({user.email})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('Joined')} {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center space-x-6">

                      {/* Plan */}
                      <div className="text-right">
                        {planInfo ? (
                          <>
                            <Badge>{planInfo.name}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {window.appSettings.formatCurrency(planInfo.price)}/{t(planInfo.cycle)}
                            </p>
                          </>
                        ) : (
                          <Badge variant="secondary">
                            {t('No Plan')}
                          </Badge>
                        )}
                      </div>

                      {/* Commission */}
                      <div className="text-right min-w-[90px]">
                        {commission > 0 ? (
                          <>
                            <p className="text-sm font-medium text-green-600">
                              +{window.appSettings.formatCurrency(commission)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t('Commission')}
                            </p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">—</p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Commission History */}
                  {user.referrals && user.referrals.length > 0 && (
                    <div className="mt-4 pt-3 border-t">
                      <h5 className="text-sm font-medium mb-2">
                        {t('Commission History')}
                      </h5>

                      <div className="space-y-1">
                        {user.referrals.map((ref: any) => (
                          <div key={ref.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {ref.commission_percentage}% {t('commission')}
                            </span>
                            <span className="font-medium text-green-600">
                              +{window.appSettings.formatCurrency(ref.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('No referred users yet')}
              </p>
            </div>
          )}

          {referredUsers.last_page > 1 && (
            <div className="pt-4">
              <Pagination
                from={referredUsers.from}
                to={referredUsers.to}
                total={referredUsers.total}
                currentPage={referredUsers.current_page}
                lastPage={referredUsers.last_page}
                links={referredUsers.links}
                entityName={t('users')}
                onPageChange={(url) => {
                  router.visit(url, {
                    preserveState: true,
                    preserveScroll: true,
                  });
                }}
              />
            </div>
          )}

        </div>

      </div>
    </PageTemplate>
  );
}