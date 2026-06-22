import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Wallet, Settings, CreditCard, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function GoogleWallet() {
  const { t } = useTranslation();
  const { auth, businesses, businessTypes, hasGoogleWalletSettings, filters: pageFilters = {} } = usePage().props as any;
  const [loadingBusinesses, setLoadingBusinesses] = useState<Set<number>>(new Set());

  // Check if user's plan has Google Wallet feature
  const userPlan = auth?.user?.plan;
  const hasGoogleWalletFeature = userPlan?.features?.google_wallet === true;

  // Helper function to get base host for subdomains
  const getBaseHost = (): string => {
    const hostname = window.location.hostname;
    // Extract base domain from current hostname
    const parts = hostname.split('.');
    return parts.length > 1 ? parts.slice(-2).join('.') : hostname;
  };

  const sanitizeSlug = (slug: string): string => {
    if (!slug) return 'invalid-slug';
    return slug.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'invalid-slug';
  };

  const getBusinessCardUrl = (business: any): string => {
    if (business.custom_domain) {
      return `https://${business.custom_domain}`;
    }

    if (business.domain_type === 'subdomain') {
      return `https://${sanitizeSlug(business.slug)}.${getBaseHost()}`;
    }

    return business.url_prefix && business.url_prefix !== ''
      ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) })
      : route('public.vcard.show.direct', sanitizeSlug(business.slug));
  };

  // Filter states
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedBusinessType, setSelectedBusinessType] = useState(pageFilters.business_type || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedBusinessType !== 'all' || searchTerm !== '';
  };

  // Count active filters
  const activeFilterCount = () => {
    return (selectedBusinessType !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = { page: 1 };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (selectedBusinessType !== 'all') {
      params.business_type = selectedBusinessType;
    }

    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('google-wallet.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleBusinessTypeFilter = (value: string) => {
    setSelectedBusinessType(value);

    const params: any = { page: 1 };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (value !== 'all') {
      params.business_type = value;
    }

    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('google-wallet.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setSelectedBusinessType('all');
    setSearchTerm('');
    setShowFilters(false);

    router.get(route('google-wallet.index'), {
      page: 1,
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  const handleAddToWallet = async (businessId: number) => {
    setLoadingBusinesses(prev => new Set(prev).add(businessId));

    try {
      const response = await fetch(route('google-wallet.add', businessId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Open Google Wallet add URL
        window.open(data.addUrl, '_blank');
        toast.success(t('Redirecting to Google Wallet...'));
      } else {
        toast.error(data.message || t('Failed to generate wallet pass'));
      }
    } catch (error) {
      toast.error(t('An error occurred while generating wallet pass'));
    } finally {
      setLoadingBusinesses(prev => {
        const newSet = new Set(prev);
        newSet.delete(businessId);
        return newSet;
      });
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Google Wallet') }
  ];

  return (
    <PageTemplate
      title={t("Google Wallet")}
      url="/google-wallet"
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {!hasGoogleWalletFeature ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <Wallet className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {t('Google Wallet Not Available')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {t('Google Wallet feature is not available in your current plan. Please upgrade your plan to access this feature.')}
            </p>
            <Button
              onClick={() => router.get(route('plans.index'))}
              className="inline-flex items-center"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {t('View Plans')}
            </Button>
          </div>
        </div>
      ) : !hasGoogleWalletSettings ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
              <Settings className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {t('Google Wallet Not Configured')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {t('Google Wallet settings need to be configured before you can add businesses to wallet.')}
            </p>
            <Button
              onClick={() => router.get(route('settings'))}
              className="inline-flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t('Go to Settings')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search and filters section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <SearchAndFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              filters={[
                {
                  name: 'business_type',
                  label: t('Business Type'),
                  type: 'select',
                  value: selectedBusinessType,
                  onChange: handleBusinessTypeFilter,
                  options: [
                    { value: 'all', label: t('All Types') },
                    ...(businessTypes || []).map((type: string) => ({
                      value: type,
                      label: type
                    }))
                  ]
                }
              ]}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              onResetFilters={handleResetFilters}
              onApplyFilters={applyFilters}
              currentPerPage={pageFilters.per_page?.toString() || "10"}
              onPerPageChange={(value) => {
                const params: any = { page: 1, per_page: parseInt(value) };

                if (searchTerm) {
                  params.search = searchTerm;
                }

                if (selectedBusinessType !== 'all') {
                  params.business_type = selectedBusinessType;
                }

                router.get(route('google-wallet.index'), params, { preserveState: true, preserveScroll: true });
              }}
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('Your Businesses')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t('Add your business cards to Google Wallet for easy sharing and access.')}
                  </p>
                </div>
              </div>
            </div>

            {businesses && businesses.data && businesses.data.length > 0 ? (
              <>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {businesses.data.map((business: any) => (
                      <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
                                {business.name}
                              </h3>
                              {business.business_type && (
                                <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                  {business.business_type}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 mr-2" />
                                {t('Created')}
                              </span>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(business.created_at, false) : new Date(business.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                {t('Views')}
                              </span>
                              <span className="text-gray-900 dark:text-gray-100 font-medium">
                                {business.view_count || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddToWallet(business.id)}
                              disabled={loadingBusinesses.has(business.id)}
                              className="flex-1"
                              variant="default"
                            >
                              {loadingBusinesses.has(business.id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                  {t('Adding...')}
                                </>
                              ) : (
                                <>
                                  <Wallet className="h-4 w-4 mr-2" />
                                  {t('Add to Wallet')}
                                </>
                              )}
                            </Button>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={getBusinessCardUrl(business)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    type="button"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>{t('View Business Card')}</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Pagination section */}
                <div className="border-t border-gray-200 dark:border-gray-800">
                  <Pagination
                    from={businesses?.from || 0}
                    to={businesses?.to || 0}
                    total={businesses?.total || 0}
                    links={businesses?.links}
                    entityName={t("businesses")}
                    onPageChange={(url) => router.get(url)}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-16 px-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
                  <Wallet className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {t('No Businesses Found')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {hasActiveFilters() ? t('No businesses match your current filters.') : t('Create your first business card to add it to Google Wallet.')}
                </p>
                {hasActiveFilters() ? (
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="inline-flex items-center"
                  >
                    {t('Clear Filters')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.get(route('vcard-builder.create'))}
                    className="inline-flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Create Business Card')}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </PageTemplate>
  );
}
