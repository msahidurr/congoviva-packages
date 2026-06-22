import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Copy, Check, Users, DollarSign, TrendingUp, Award, Clock, Mail, Calendar } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
interface ReferralDashboardProps {
  userType: string;
  stats: any;
  referralLink?: string;
  recentReferredUsers?: any[];
  currencySymbol?: string;
}

export default function ReferralDashboard({ userType, stats, referralLink, recentReferredUsers, currencySymbol }: ReferralDashboardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const resolvedCurrencySymbol = currencySymbol || window?.appSettings?.currencySettings?.currencySymbol || '$';

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setCopied(true);
      toast.success(t('Referral link copied to clipboard'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('Failed to copy link'));
    }
  };

  const jumpToReferredUsers = () => {
    const element = document.getElementById('referred-users');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', '#referred-users');
    }
  };

  if (userType === 'superadmin') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow duration-300 dark:border-blue-900/50 dark:bg-blue-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('Total Referral Users')}</p>
                  <h3 className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalReferralUsers}</h3>
                  <p className="text-xs text-blue-700/80 dark:text-blue-300 mt-1">{t('Registered users')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200 bg-amber-50 hover:shadow-lg transition-shadow duration-300 dark:border-amber-900/50 dark:bg-amber-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{t('Pending Payouts')}</p>
                  <h3 className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingPayouts}</h3>
                  <p className="text-xs text-amber-700/80 dark:text-amber-300 mt-1">{t('Awaiting approval')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200 bg-green-50 hover:shadow-lg transition-shadow duration-300 dark:border-green-900/50 dark:bg-green-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">{t('Total Commission Paid')}</p>
                  <h3 className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{resolvedCurrencySymbol}{stats.totalCommissionPaid}</h3>
                  <p className="text-xs text-green-700/80 dark:text-green-300 mt-1">{t('Total payouts')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow duration-300 dark:border-purple-900/50 dark:bg-purple-950/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('Active Companies')}</p>
                  <h3 className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.topCompanies?.length || 0}</h3>
                  <p className="text-xs text-purple-700/80 dark:text-purple-300 mt-1">{t('Referring companies')}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    {t('Top Referring Companies')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('Companies with most referrals')}
                  </CardDescription>
                </div>

              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {stats.topCompanies && stats.topCompanies.length > 0 ? (
                <div className="space-y-2">
                  {stats.topCompanies.slice(0, 5).map((company: any, index: number) => (
                    <div key={company.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-semibold text-muted-foreground shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold truncate">{company.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{company.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-3 shrink-0">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <Users className="h-4 w-4" />
                          {company.referral_count}
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">{resolvedCurrencySymbol}{company.total_earned || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">{t('No companies yet')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    {t('Monthly Performance')}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {t('This year statistics')}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{t('Referral Signups')}</p>
                    <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {Object.values(stats.monthlyReferrals || {}).reduce((a: any, b: any) => a + b, 0)}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t('Total this year')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-violet-900 dark:text-violet-100">{t('Payouts Processed')}</p>
                    <DollarSign className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                    {resolvedCurrencySymbol}{Object.values(stats.monthlyPayouts || {}).reduce((a: any, b: any) => a + b, 0)}
                  </p>
                  <p className="text-xs text-violet-700 dark:text-violet-300 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {t('Total this year')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-green-200 bg-green-50 hover:shadow-lg transition-shadow duration-300 dark:border-green-900/50 dark:bg-green-950/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">{t('Total Referrals')}</p>
                <h3 className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalReferrals}</h3>
                <p className="text-xs text-green-700/80 dark:text-green-300 mt-1">{t('All referrals')}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow duration-300 dark:border-blue-900/50 dark:bg-blue-950/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('Referred Users')}</p>
                <h3 className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.referredUsersCount || 0}</h3>
                <p className="text-xs text-blue-700/80 dark:text-blue-300 mt-1">{t('Active users')}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-200 bg-amber-50 hover:shadow-lg transition-shadow duration-300 dark:border-amber-900/50 dark:bg-amber-950/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">{t('Total Earned')}</p>
                <h3 className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{resolvedCurrencySymbol}{stats.totalEarned}</h3>
                <p className="text-xs text-amber-700/80 dark:text-amber-300 mt-1">{t('Commission earned')}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow duration-300 dark:border-purple-900/50 dark:bg-purple-950/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('Available Balance')}</p>
                <h3 className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{resolvedCurrencySymbol}{Number(stats.availableBalance || 0).toFixed(2)}</h3>
                <p className="text-xs text-purple-700/80 dark:text-purple-300 mt-1">{t('Ready to withdraw')}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Copy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{t('Your Referral Link')}</CardTitle>
                <CardDescription className="text-xs">{t('Share and earn commissions')}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex space-x-2">
              <Input
                value={referralLink || ''}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                onClick={copyReferralLink}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-lg">
              {t('Share this link to earn commissions when users sign up and purchase plans')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">{t('Recent Referred Users')}</CardTitle>
                  <CardDescription className="text-xs">{t('Latest referrals')}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={jumpToReferredUsers}>
                {t('View All')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            {recentReferredUsers && recentReferredUsers.length > 0 ? (
              <div className="space-y-2">
                {recentReferredUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      {user.avatar ? (
                        <img
                          src={getImageDisplayUrl(user.avatar)}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-3 shrink-0">
                      {user.plan ? (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {user.plan.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {t('No Plan')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium text-muted-foreground mb-1">{t('No referred users yet')}</p>
                <p className="text-xs text-muted-foreground">{t('Share your link to get started')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
