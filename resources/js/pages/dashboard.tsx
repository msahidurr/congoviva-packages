import React from 'react';
import { PageTemplate } from '@/components/page-template';
import { RefreshCw, BarChart3, Download, Users, Activity, UserPlus, DollarSign, Mail as VCard, MessageSquare, CalendarDays, Eye, TrendingUp, Plus, ExternalLink, QrCode, Share2, HardDrive, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';
import { Link, usePage } from '@inertiajs/react';
import { DashboardOverview } from '@/components/dashboard/dashboard-overview';
import VCardPreview from '@/pages/vcard-builder/components/VCardPreview';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import QRCode from 'qrcode';
import { toast } from '@/components/custom-toast';
import { ShareModal } from '@/components/ShareModal';
import { usePermissions } from '@/components/PermissionGate';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface CompanyDashboardData {
  stats: {
    totalBusinesses: number;
    totalContacts: number;
    totalAppointments: number;
    totalViews: number;
    monthlyGrowth: number;
  };
  recentContacts: Array<{
    id: number;
    name: string;
    email: string;
    business: string;
    time: string;
  }>;
  recentAppointments: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  }>;
  topBusinesses: Array<{
    id: number;
    name: string;
    views: number;
    contacts: number;
  }>;
}

interface PageAction {
  label: string;
  icon: React.ReactNode;
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
}

export default function Dashboard({ dashboardData }: { dashboardData: CompanyDashboardData }) {
  const { t } = useTranslation();
  const { auth, flash } = usePage().props as any;
  const { hasPermission } = usePermissions();
  const currentBusiness = auth.user?.businesses?.find((b: any) => b.id === auth.user?.current_business) || auth.user?.businesses?.[0];

  // Handle flash messages
  React.useEffect(() => {
    if (flash?.success) {
      const div = document.createElement('div');
      div.innerHTML = flash.success;
      const message = div.textContent || div.innerText || flash.success;
      setTimeout(() => toast.success(message), 100);
    }
    if (flash?.error) {
      const div = document.createElement('div');
      div.innerHTML = flash.error;
      const message = div.textContent || div.innerText || flash.error;
      setTimeout(() => toast.error(message), 100);
    }

  }, [flash?.success, flash?.error]);

  const pageActions: PageAction[] = [
    {
      label: t('Refresh'),
      icon: <RefreshCw className="h-4 w-4" />,
      variant: 'outline',
      onClick: () => window.location.reload()
    },
    ...(hasPermission(['manage-analytics', 'view-analytics']) ? [{
      label: t('Analytics'),
      icon: <BarChart3 className="h-4 w-4" />,
      variant: 'outline' as const,
      onClick: () => window.location.href = route('analytics')
    }] : []),
    ...(hasPermission(['create-businesses', 'create-vcard-builder']) ? [{
      label: t('Create Business'),
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const,
      onClick: () => window.location.href = route('vcard-builder.create')
    }] : [])
  ];

  const stats = {
    totalBusinesses: Number(dashboardData?.stats?.totalBusinesses) || 0,
    totalContacts: Number(dashboardData?.stats?.totalContacts) || 0,
    totalAppointments: Number(dashboardData?.stats?.totalAppointments) || 0,
    totalViews: Number(dashboardData?.stats?.totalViews) || 0,
    monthlyGrowth: Number(dashboardData?.stats?.monthlyGrowth) || 0
  };

  const recentContacts = dashboardData?.recentContacts || [];

  const recentAppointments = dashboardData?.recentAppointments || [];

  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');



  return (
    <PageTemplate 
      title={t('Dashboard')}
      url="/dashboard"
      actions={pageActions}
    >
      <div className="space-y-3 sm:space-y-6">
        {/* Key Metrics */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">{t('Total Businesses')}</p>
                  <h3 className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold">{stats.totalBusinesses.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-blue-100 p-1.5 sm:p-3 dark:bg-blue-900">
                  <VCard className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Contacts')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.totalContacts.toLocaleString()}</h3>
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
                  <p className="text-sm font-medium text-muted-foreground">{t('Appointments')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.totalAppointments.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Total Views')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{stats.totalViews.toLocaleString()}</h3>
                </div>
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                  <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('Monthly Growth')}</p>
                  <h3 className="mt-2 text-2xl font-bold">{Number(stats.monthlyGrowth) || 0}%</h3>
                </div>
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          {/*  Column 2 - Current Business Preview */}
          {currentBusiness ? (
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{currentBusiness.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{currentBusiness.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {currentBusiness.business_type?.replace('-', ' ') || 'General'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                    {t("Live")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden mb-4">
                  <div className="w-full overflow-y-auto max-h-[420px] shadow-sm">
                    <VCardPreview
                      businessType={currentBusiness.business_type || 'freelancer'}
                      data={(() => {
                        const sections = { ...currentBusiness.config_sections } || {};
                        // Process all image URLs
                        Object.keys(sections).forEach(key => {
                          const section = sections[key];
                          if (section && typeof section === 'object') {
                            ['profile_image', 'cover_image', 'logo', 'background_image', 'image'].forEach(field => {
                              if (section[field]) {
                                section[field] = getImageDisplayUrl(section[field]);
                              }
                            });
                          }
                        });
                        return {
                          ...currentBusiness, 
                          config_sections: sections,
                          template_config: { 
                            sections: sections, 
                            sectionSettings: sections 
                          } 
                        };
                      })()}
                      template={null}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">{t("URL")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 rounded bg-background text-xs font-mono">
                        {currentBusiness.custom_domain 
                          ? currentBusiness.custom_domain
                          : `/${currentBusiness?.url_prefix ? `${currentBusiness.url_prefix}/` : ''}${currentBusiness.slug}`
                        }
                      </code>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={async () => {
                        let businessUrl;
                        if (currentBusiness.custom_domain) {
                          businessUrl = `https://${currentBusiness.custom_domain}`;
                        } else if (currentBusiness.domain_type === 'subdomain') {
                          const hostname = window.location.hostname;
                          const parts = hostname.split('.');
                          const baseHost = parts.length > 1 ? parts.slice(-2).join('.') : hostname;
                          businessUrl = `${window.location.protocol}//${currentBusiness.slug}.${baseHost}`;
                        } else {
                          businessUrl = currentBusiness.url_prefix && currentBusiness.url_prefix !== '' 
                            ? route('public.vcard.show', { prefix: currentBusiness.url_prefix, slug: currentBusiness.slug }, true)
                            : route('public.vcard.show.direct', currentBusiness.slug, true);
                        }
                        try {
                          await navigator.clipboard.writeText(businessUrl);
                          toast.success(t('Link copied to clipboard!'));
                        } catch (err) {
                          toast.error(t('Failed to copy link'));
                        }
                      }}>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={route('vcard-builder.edit', currentBusiness.id)}>
                        {t('Edit')}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={route('vcard-builder.preview', currentBusiness.id)} target="_blank">
                        {t('Preview')}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={route('vcard-builder.index')}>
                        {t('Businesses')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-1 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--theme-color)" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="var(--theme-color)" stopOpacity="0.18" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bg-gradient)" />
                  <circle cx="15" cy="15" r="40" fill="var(--theme-color)" opacity="0.05" />
                  <circle cx="85" cy="85" r="30" fill="var(--theme-color)" opacity="0.07" />
                  <path d="M0,60 Q25,50 50,60 T100,60 V100 H0 Z" fill="var(--theme-color)" opacity="0.1" />
                </svg>
              </div>
              <CardContent className="py-12 z-10 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <VCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('No Business Yet')}</h3>
                <p className="text-muted-foreground mb-6 max-w-xs">
                  {t('Create your first digital business card to showcase your brand and connect with customers.')}  
                </p>
                <Link href={route('vcard-builder.create')} className="relative z-10">
                  <Button size="lg" className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>{t('Create Business')}</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          
          {/* Column 2 - QR and Storage */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6 h-full flex flex-col">
            {/* QR Code & Share */}
            {currentBusiness && (
              <Card className="flex-1">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between h-full gap-4">
                    {/* Left Side - Greeting */}
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold mb-2">
                          {(() => {
                            const hour = new Date().getHours();
                            if (hour < 12) return t('Good Morning');
                            if (hour < 17) return t('Good Afternoon');
                            return t('Good Evening');
                          })()}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                          {t('Create and share digital business cards instantly. Connect with customers through QR codes and direct links.')}
                        </p>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3">                       
                        <div className="space-y-1 sm:space-y-2 text-xs text-muted-foreground">
                          <p>{t('Share via QR code, social media, or direct link')}</p>
                          <p className="hidden sm:block">{t('Track engagement and grow your network')}</p>
                          <p className="hidden sm:block">{t('Eco-friendly alternative to traditional paper cards')}</p>
                          <p className="hidden sm:block">{t('Customizable templates for every industry')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Side - QR Code */}
                    <div className="flex flex-col items-center space-y-2 min-w-0 w-full sm:w-auto">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border rounded-lg p-2 shadow-sm">
                        {(() => {
                          let businessUrl;
                          if (currentBusiness.custom_domain) {
                            businessUrl = `https://${currentBusiness.custom_domain}`;
                          } else if (currentBusiness.domain_type === 'subdomain') {
                            const hostname = window.location.hostname;
                            const parts = hostname.split('.');
                            const baseHost = parts.length > 1 ? parts.slice(-2).join('.') : hostname;
                            businessUrl = `${window.location.protocol}//${currentBusiness.slug}.${baseHost}`;
                          } else {
                            businessUrl = currentBusiness.url_prefix && currentBusiness.url_prefix !== '' 
                              ? route('public.vcard.show', { prefix: currentBusiness.url_prefix, slug: currentBusiness.slug }, true)
                              : route('public.vcard.show.direct', currentBusiness.slug, true);
                          }
                          const [qrCode, setQrCode] = React.useState('');
                          
                          React.useEffect(() => {
                            QRCode.toDataURL(businessUrl, { width: 96, margin: 1 })
                              .then(url => setQrCode(url))
                              .catch(err => console.error(err));
                          }, [businessUrl]);
                          
                          return qrCode ? (
                            <img src={qrCode} alt="QR Code" className="w-full h-full rounded" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                              <QrCode className="h-8 w-8 sm:h-12 sm:w-12 text-gray-500" />
                            </div>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-center text-muted-foreground px-2">
                        {t('Scan to view card')}
                      </p>
                      <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="h-7 sm:h-8 text-xs bg-primary hover:bg-primary/90"
                          onClick={async () => {
                            let businessUrl;
                            if (currentBusiness.custom_domain) {
                              businessUrl = `https://${currentBusiness.custom_domain}`;
                            } else if (currentBusiness.domain_type === 'subdomain') {
                              const hostname = window.location.hostname;
                              const parts = hostname.split('.');
                              const baseHost = parts.length > 1 ? parts.slice(-2).join('.') : hostname;
                              businessUrl = `${window.location.protocol}//${currentBusiness.slug}.${baseHost}`;
                            } else {
                              businessUrl = currentBusiness.url_prefix && currentBusiness.url_prefix !== '' 
                                ? route('public.vcard.show', { prefix: currentBusiness.url_prefix, slug: currentBusiness.slug }, true)
                                : route('public.vcard.show.direct', currentBusiness.slug, true);
                            }
                            try {
                              await navigator.clipboard.writeText(businessUrl);
                              toast.success(t('Link copied to clipboard!'));
                            } catch (err) {
                              toast.error(t('Failed to copy link'));
                            }
                          }}
                        >
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">{t('Copy')}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 sm:h-8 text-xs border-primary text-primary hover:bg-primary/10"
                          onClick={() => {
                            let businessUrl;
                            if (currentBusiness.custom_domain) {
                              businessUrl = `https://${currentBusiness.custom_domain}`;
                            } else if (currentBusiness.domain_type === 'subdomain') {
                              const hostname = window.location.hostname;
                              const parts = hostname.split('.');
                              const baseHost = parts.length > 1 ? parts.slice(-2).join('.') : hostname;
                              businessUrl = `${window.location.protocol}//${currentBusiness.slug}.${baseHost}`;
                            } else {
                              businessUrl = currentBusiness.url_prefix && currentBusiness.url_prefix !== '' 
                                ? route('public.vcard.show', { prefix: currentBusiness.url_prefix, slug: currentBusiness.slug }, true)
                                : route('public.vcard.show.direct', currentBusiness.slug, true);
                            }
                            setShareUrl(businessUrl);
                            setIsShareModalOpen(true);
                          }}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">{t('Share')}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Storage Used Chart */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4" />
                  {t('Storage Usage')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {(() => {
                  let userStorageUsed = Number(auth.user?.storage_limit) || 0; // in bytes
                  const isCompanyOrSuperAdmin = ['company', 'superadmin'].includes(auth.user?.type);
                  
                  // Need to get actual plan data from backend based on plan_id
                  // For now using a default - this should come from backend
                  const planStorageLimit = Number(auth.user?.plan?.storage_limit) || 5; // 5GB in GB
                  const planStorageLimitBytes = planStorageLimit * 1024 * 1024 * 1024; // Convert GB to bytes
                  if ((window as any).isDemo) {
                    const demoStorageUsedBytes = 0.7 * 1024 * 1024 * 1024; // 1.5 GB in bytes
                    userStorageUsed = Math.min(demoStorageUsedBytes, planStorageLimitBytes);
                  }
                  const usedPercentage = userStorageUsed > 0 ? Math.max(Math.min(Math.round((Number(userStorageUsed) / Number(planStorageLimitBytes)) * 100), 100), 1) : 0;
                  const remainingPercentage = Math.max(100 - usedPercentage, 0);
                  
                  // Dynamic storage unit display
                  const formatStorage = (bytes: number) => {
                    const numBytes = Number(bytes) || 0;
                    if (numBytes < 1024) return `${numBytes} B`;
                    if (numBytes < 1024 * 1024) return `${(numBytes / 1024).toFixed(1)} KB`;
                    if (numBytes < 1024 * 1024 * 1024) return `${(numBytes / (1024 * 1024)).toFixed(1)} MB`;
                    return `${(numBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
                  };
                  
                  const usedStorage = formatStorage(userStorageUsed);
                  const totalGB = (Number(planStorageLimit) || 5).toFixed(1); // Already in GB
                  const remainingBytes = planStorageLimitBytes - userStorageUsed;
                  const remainingStorage = formatStorage(remainingBytes);
                  
                  return (
                    <>
                      <div className="flex items-center justify-center mb-4 relative">
                        <PieChart width={120} height={120}>
                          <Pie
                            data={[
                              { name: 'Used', value: usedPercentage },
                              { name: 'Free', value: remainingPercentage }
                            ]}
                            cx={60}
                            cy={60}
                            innerRadius={35}
                            outerRadius={50}
                            dataKey="value"
                          >
                            <Cell fill="var(--theme-color)" />
                            <Cell fill="#e5e7eb" />
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Storage']} />
                        </PieChart>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-lg font-bold text-primary">
                            {usedPercentage}%
                          </span>
                          <span className="text-xs text-muted-foreground">{t("Used")}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('Used Storage')}</span>
                          <span className="font-medium">{usedStorage}</span>
                        </div>
                        <Progress value={usedPercentage} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t('Available')}</span>
                          <span className="font-medium">{remainingStorage}</span>
                        </div>
                        
                        <div className="pt-2 border-t text-center">
                          <p className="text-xs text-muted-foreground">
                            {t('{{used}} of {{total}} GB used', { used: usedStorage, total: totalGB })}
                          </p>
                          <p className="text-xs font-medium mt-1 capitalize">
                            {'Premium'} {t('Plan')}
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
          
          {/* Column 3 - Recent Activity */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('Recent Activity')}
                </div>
                <Badge variant="secondary" className="text-xs">
                 {[...recentContacts, ...recentAppointments].length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-6">
                {[...recentContacts, ...recentAppointments]
                  .sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())
                  .slice(0, 6)
                  .map((item, index) => (
                  <div key={index} className="group flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      'email' in item 
                        ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30' 
                        : 'bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30'
                    }`}>
                      {'email' in item ? 
                        <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" /> : 
                        <CalendarDays className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100 mb-1">
                            {'email' in item ? item.name : item.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {'email' in item ? item.email : item.date}
                          </p>
                        </div>
                        {'status' in item && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="w-2 h-2 rounded-full" 
                              style={{
                                backgroundColor: item.status === 'confirmed' ? '#10b77f' : item.status === 'pending' ? '#f59e0b' : '#ef4444'
                              }}
                            />
                            <span className="text-xs capitalize" 
                              style={{
                                color: item.status === 'confirmed' ? '#10b77f' : item.status === 'pending' ? '#f59e0b' : '#ef4444'
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8" asChild>
                    <Link href={route('contacts.index')}>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {t('Contacts')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8" asChild>
                    <Link href={route('appointments.index')}>
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {t('Appointments')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Feature Overview */}
        <DashboardOverview userType="company" stats={stats} />
      </div>
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
        title={currentBusiness?.name || 'Business'}
      />
    </PageTemplate>
  );
}