import { useState, useMemo, useEffect } from 'react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, Search, Plus, Edit, Trash2, Eye, BarChart3, Calendar, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/ui/date-picker';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { CampaignPaymentModal } from '@/components/campaign-payment-modal';


export default function CampaignsPage() {
  const { t } = useTranslation();
  const { auth, campaigns, filters: pageFilters = {}, isAdmin = false, users = [], businesses = [], paymentMethods = [], paymentSettings = {}, campaignSettings = null } = usePage().props as any;
  
  // Check if ChatGPT modal is open
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);
  
  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedUser, setSelectedUser] = useState(pageFilters.user_id || 'all');
  const [selectedBusiness, setSelectedBusiness] = useState(pageFilters.business_id || 'all');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [startDate, setStartDate] = useState<Date | undefined>(pageFilters.start_date ? new Date(pageFilters.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(pageFilters.end_date ? new Date(pageFilters.end_date) : undefined);
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [pendingCampaignData, setPendingCampaignData] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  // Analytics modal state
  const [analyticsData, setAnalyticsData] = useState({
    name: '',
    description: '',
    business_id: '',
    start_date: '',
    end_date: '',
    total_days: 0,
    total_cost: 0,
    coupon_code: '',
    payment_method: 'credit_card'
  });
  
  // Form data state for real-time calculations
  const [formData, setFormData] = useState<any>({});
  
  // Filter businesses based on selected user
  const filteredBusinesses = useMemo(() => {
    if (!isAdmin || !selectedUserId) {
      return businesses;
    }
    const filtered = businesses.filter((business: any) => business.created_by?.toString() === selectedUserId.toString());
    return filtered;
  }, [businesses, selectedUserId, isAdmin]);
  
  // Calculate price per day based on campaign settings pricing tiers
  const calculatePricePerDay = (totalDays: number) => {
    if (!campaignSettings?.pricing_tiers || campaignSettings.pricing_tiers.length === 0) {
      return 10.00; // Default price per day
    }
    
    for (const tier of campaignSettings.pricing_tiers) {
      if (totalDays >= tier.min_days && totalDays <= tier.max_days) {
        return parseFloat(tier.per_day_price);
      }
    }
    
    // Fallback to the last tier if no match found
    const lastTier = campaignSettings.pricing_tiers[campaignSettings.pricing_tiers.length - 1];
    return parseFloat(lastTier?.per_day_price || 10.00);
  };

  // Calculate total days and cost when dates change
  useEffect(() => {
    if (analyticsData.start_date && analyticsData.end_date) {
      const startDate = new Date(analyticsData.start_date);
      const endDate = new Date(analyticsData.end_date);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Calculate cost based on pricing tiers from super admin settings
      const costPerDay = calculatePricePerDay(diffDays);
      const totalCost = diffDays * costPerDay;
      
      setAnalyticsData(prev => ({
        ...prev,
        total_days: diffDays,
        total_cost: totalCost
      }));
    }
  }, [analyticsData.start_date, analyticsData.end_date, campaignSettings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = { page: 1 };
    
    if (searchTerm) params.search = searchTerm;
    if (selectedUser !== 'all') params.user_id = selectedUser;
    if (selectedBusiness !== 'all') params.business_id = selectedBusiness;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (startDate) params.start_date = startDate.toISOString().split('T')[0];
    if (endDate) params.end_date = endDate.toISOString().split('T')[0];
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('campaigns.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleFilterChange = (key: string, value: any) => {
    const params: any = { page: 1 };
    
    if (searchTerm) params.search = searchTerm;
    
    // Update the specific filter
    switch (key) {
      case 'user_id':
        setSelectedUser(value);
        if (value !== 'all') params.user_id = value;
        break;
      case 'business_id':
        setSelectedBusiness(value);
        if (value !== 'all') params.business_id = value;
        break;
      case 'status':
        setSelectedStatus(value);
        if (value !== 'all') params.status = value;
        break;
    }
    
    // Add other filters
    if (selectedUser !== 'all' && key !== 'user_id') params.user_id = selectedUser;
    if (selectedBusiness !== 'all' && key !== 'business_id') params.business_id = selectedBusiness;
    if (selectedStatus !== 'all' && key !== 'status') params.status = selectedStatus;
    if (startDate) params.start_date = startDate.toISOString().split('T')[0];
    if (endDate) params.end_date = endDate.toISOString().split('T')[0];
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('campaigns.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';
    
    const params: any = { 
      sort_field: field, 
      sort_direction: direction, 
      page: 1
    };
    
    if (searchTerm) params.search = searchTerm;
    if (selectedUser !== 'all') params.user_id = selectedUser;
    if (selectedBusiness !== 'all') params.business_id = selectedBusiness;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (startDate) params.start_date = startDate.toISOString().split('T')[0];
    if (endDate) params.end_date = endDate.toISOString().split('T')[0];
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    
    router.get(route('campaigns.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, campaign: any) => {
    setCurrentCampaign(campaign);
    
    switch (action) {
      case 'edit':
        setFormMode('edit');
        setSelectedUserId(campaign.user_id?.toString() || '');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(campaign);
        break;
      case 'preview':
        // Handle preview action - open business in new tab
        if (campaign.business) {
          const business = campaign.business;
          // Validate domain to prevent open redirect
          if (business.custom_domain && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(business.custom_domain)) {
            toast.error(t('Invalid business domain'));
            return;
          }
          const url = business.custom_domain 
            ? `https://${business.custom_domain}`
            : (business.url_prefix && business.url_prefix !== '' 
              ? route('public.vcard.show', { prefix: business.url_prefix, slug: business.slug }, true)
              : route('public.vcard.show.direct', business.slug, true));
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          toast.error(t('Business information not available'));
        }
        break;
      case 'analytics':
        window.location.href = route("campaigns.analytics", campaign.id);
        break;
      default:
        break;
    }
  };

  const handleAddNew = () => {
    setCurrentCampaign(null);
    setFormMode('create');
    setSelectedUserId('');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    // Update selectedUserId when user is selected
    if (formData.user_id) {
      setSelectedUserId(formData.user_id.toString());
    }
    
    const submitData = {
      name: formData.name,
      description: formData.description,
      business_id: formData.business_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      payment_method: formData.payment_method,
      status: isAdmin ? formData.status : 'pending',
      is_active: isAdmin ? (formData.is_active !== undefined ? formData.is_active : true) : true
    };
    
    if (isAdmin && formData.user_id) {
      submitData.user_id = formData.user_id;
    }

    if (formMode === 'create') {
      toast.loading(t('Creating campaign...'));
      
      router.post(route('campaigns.store'), submitData, {
        onSuccess: (page) => {
          setIsFormModalOpen(false);
          toast.dismiss();
          if (page.props?.flash?.success) {
            toast.success(page.props.flash.success);
          }
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create campaign: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating campaign...'));
      
      router.put(route('campaigns.update', currentCampaign.id), submitData, {
        onSuccess: (page) => {
          setIsFormModalOpen(false);
          toast.dismiss();
          if (page.props?.flash?.success) {
            toast.success(page.props.flash.success);
          }
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update campaign: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting campaign...'));
    
    router.delete(route("campaigns.destroy", currentCampaign.id), {
      onSuccess: (page) => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete campaign: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleToggleStatus = (campaign: any) => {
    toast.loading(t('Updating status...'));
    
    router.put(route('campaigns.toggle-status', campaign.id), {}, {
      onSuccess: (page) => {
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to update status: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const hasActiveFilters = () => {
    return selectedUser !== 'all' || selectedBusiness !== 'all' || 
           selectedStatus !== 'all' || searchTerm !== '' || startDate !== undefined || endDate !== undefined;
  };

  const activeFilterCount = () => {
    return (selectedUser !== 'all' ? 1 : 0) + 
           (selectedBusiness !== 'all' ? 1 : 0) + 
           (selectedStatus !== 'all' ? 1 : 0) + 
           (searchTerm ? 1 : 0) + 
           (startDate ? 1 : 0) + 
           (endDate ? 1 : 0);
  };

  const handleResetFilters = () => {
    setSelectedUser('all');
    setSelectedBusiness('all');
    setSelectedStatus('all');
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);
    
    router.get(route('campaigns.index'), { 
      page: 1, 
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  // Campaigns global toggle (super admin only)
  const { campaignGlobalSettings } = usePage().props as any;
  const [campaignEnabled, setCampaignEnabled] = useState(campaignGlobalSettings?.is_enabled === true);
  
  const handleCampaignToggle = (enabled: boolean) => {
    setCampaignEnabled(enabled);
    toast.loading(t('Updating campaigns setting...'));
    
    router.post(route('campaigns.toggle-global'), {
      is_enabled: enabled
    }, {
      preserveState: false,
      replace: true,
      onSuccess: (page) => {
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        } else if (page.props?.flash?.error) {
          setCampaignEnabled(!enabled);
          toast.error(page.props.flash.error);
        }
      },
      onError: () => {
        toast.dismiss();
        setCampaignEnabled(!enabled);
        toast.error(t('Failed to update campaigns setting'));
      }
    });
  };

  const pageActions = [
    // Show global toggle for super admin only
    ...(isAdmin ? [{
      label: (
        <div className="flex items-center gap-2">
          <span className="text-sm">{t('Enable Campaigns')}</span>
          <Switch
            checked={campaignEnabled}
            onCheckedChange={handleCampaignToggle}
            size="sm"
          />
        </div>
      ),
      variant: 'ghost',
      onClick: () => {}
    }] : []),
    {
      label: 'Create Campaign',
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => handleAddNew()
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Campaigns') }
  ];

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <PageTemplate 
      title={t("Campaigns")} 
      url="/campaigns"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {/* Search and filters section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={[
            ...(isAdmin ? [{
              name: 'user_id',
              label: t('User'),
              type: 'select',
              value: selectedUser,
              onChange: (value) => handleFilterChange('user_id', value),
              options: [
                { value: 'all', label: t('All Users') },
                ...users.map((user: any) => ({
                  value: user.id.toString(),
                  label: user.name
                }))
              ]
            }] : []),
            {
              name: 'business_id',
              label: t('Business'),
              type: 'select',
              value: selectedBusiness,
              onChange: (value) => handleFilterChange('business_id', value),
              options: [
                { value: 'all', label: t('All Businesses') },
                ...businesses.map((business: any) => ({
                  value: business.id.toString(),
                  label: business.name
                }))
              ]
            },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              value: selectedStatus,
              onChange: (value) => handleFilterChange('status', value),
              options: [
                { value: 'all', label: t('All Status') },
                { value: 'pending', label: t('Pending') },
                { value: 'active', label: t('Active') },
                { value: 'completed', label: t('Completed') },
                { value: 'cancelled', label: t('Cancelled') }
              ]
            },
            {
              name: 'start_date',
              label: t('Start Date'),
              type: 'date',
              value: startDate,
              onChange: (date) => setStartDate(date)
            },
            {
              name: 'end_date',
              label: t('End Date'),
              type: 'date',
              value: endDate,
              onChange: (date) => setEndDate(date)
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
            
            if (searchTerm) params.search = searchTerm;
            if (selectedUser !== 'all') params.user_id = selectedUser;
            if (selectedBusiness !== 'all') params.business_id = selectedBusiness;
            if (selectedStatus !== 'all') params.status = selectedStatus;
            if (startDate) params.start_date = startDate.toISOString().split('T')[0];
            if (endDate) params.end_date = endDate.toISOString().split('T')[0];
            
            router.get(route('campaigns.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    {t('Name')}
                    {pageFilters.sort_field === 'name' && (
                      <span className="ml-1">
                        {pageFilters.sort_direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                {isAdmin && (
                  <th 
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('user.name')}
                  >
                    <div className="flex items-center">
                      {t('User Name')}
                      {pageFilters.sort_field === 'user.name' && (
                        <span className="ml-1">
                          {pageFilters.sort_direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                )}
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Business Name')}</th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('start_date')}
                >
                  <div className="flex items-center">
                    {t('Start Date')}
                    {pageFilters.sort_field === 'start_date' && (
                      <span className="ml-1">
                        {pageFilters.sort_direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('end_date')}
                >
                  <div className="flex items-center">
                    {t('End Date')}
                    {pageFilters.sort_field === 'end_date' && (
                      <span className="ml-1">
                        {pageFilters.sort_direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Total Days')}</th>
                <th 
                  className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort('total_amount')}
                >
                  <div className="flex items-center">
                    {t('Total Amount')}
                    {pageFilters.sort_field === 'total_amount' && (
                      <span className="ml-1">
                        {pageFilters.sort_direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Payment Method')}</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Status')}</th>
                {isAdmin && (
                  <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Active')}</th>
                )}
                <th className="px-4 py-3 text-right font-medium text-gray-500">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns?.data?.map((campaign: any) => (
                <tr key={campaign.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <td className="px-4 py-3">
                    <div className="font-medium">{campaign.name}</div>
                   
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="font-medium">{campaign.user?.name}</div>
                    </td>
                  )}
                  <td className="px-4 py-3">{campaign.business?.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(campaign.start_date, false) : new Date(campaign.start_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(campaign.end_date, false) : new Date(campaign.end_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{campaign.total_days} days</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="font-medium">{window.appSettings?.formatCurrency(campaign.total_amount) || `$${parseFloat(campaign.total_amount).toFixed(2)}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize">
                      {campaign.payment_method === 'stripe' ? 'Credit Card' : 
                       campaign.payment_method === 'paypal' ? 'PayPal' :
                       campaign.payment_method === 'bank' ? 'Bank Transfer' :
                       campaign.payment_method.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(campaign.status)}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <Switch
                        checked={campaign.is_active}
                        onCheckedChange={() => handleAction('toggle-status', campaign)}
                        size="sm"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {isAdmin && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('preview', campaign)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Preview")}</TooltipContent>
                        </Tooltip>
                      )}
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleAction('analytics', campaign)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("Analytics")}</TooltipContent>
                      </Tooltip>
                      
                      {isAdmin && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleAction('edit', campaign)}
                              className="text-amber-500 hover:text-amber-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Edit")}</TooltipContent>
                        </Tooltip>
                      )}
                      
                      {(!isAdmin && campaign.status === 'pending') && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleAction('delete', campaign)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Delete")}</TooltipContent>
                        </Tooltip>
                      )}
                      
                      {isAdmin && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleAction('delete', campaign)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Delete")}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {(!campaigns?.data || campaigns.data.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 12 : 10} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    {t("No campaigns found")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {campaigns?.links && (
          <Pagination
            from={campaigns?.from || 0}
            to={campaigns?.to || 0}
            total={campaigns?.total || 0}
            links={campaigns?.links}
            entityName={t("campaigns")}
            onPageChange={(url) => router.get(url)}
          />
        )}
      </div>

      {/* Campaign Creation Modal - Similar to Plan Subscription */}
      {isAdmin ? (
        <CrudFormModal
          key={`campaign-${currentCampaign?.id || 'new'}`}
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setSelectedUserId('');
          }}
          onSubmit={handleFormSubmit}
          formConfig={{
            fields: [
              { name: 'name', label: t('Campaign Name'), type: 'text', required: true, placeholder: t('Enter campaign name') },
              { name: 'description', label: t('Description'), type: 'textarea', placeholder: t('Enter campaign description') },
              { 
                name: 'user_id', 
                label: t('Company User'), 
                type: 'select', 
                required: true,
                options: users.map((user: any) => ({ value: user.id.toString(), label: user.name }))
              },
              { 
                name: 'business_id', 
                label: t('Business'), 
                type: 'select', 
                required: true,
                options: filteredBusinesses.map((business: any) => ({ value: business.id, label: business.name })),
                placeholder: t('Select business')
              },
              { name: 'start_date', label: t('Start Date'), type: 'date', required: true, placeholder: t('Select start date') },
              { name: 'end_date', label: t('End Date'), type: 'date', required: true, placeholder: t('Select end date') },
              { 
                name: 'status', 
                label: t('Status'), 
                type: 'select', 
                required: true,
                options: [
                  { value: 'pending', label: t('Pending') },
                  { value: 'active', label: t('Active') },
                  { value: 'completed', label: t('Completed') },
                  { value: 'cancelled', label: t('Cancelled') }
                ],
                placeholder: t('Select status')
              },
              { name: 'is_active', label: t('Active'), type: 'switch', defaultValue: true }
            ],
            modalSize: 'lg',
            columns: 2
          }}
          initialData={currentCampaign ? {
            ...currentCampaign,
            business_id: currentCampaign.business_id?.toString(),
            user_id: currentCampaign.user_id?.toString(),
            start_date: currentCampaign.start_date?.split('T')[0],
            end_date: currentCampaign.end_date?.split('T')[0],
            is_active: Boolean(currentCampaign.is_active)
          } : null}
          title={
            formMode === 'create' 
              ? t('Create Campaign') 
              : formMode === 'edit' 
                ? t('Edit Campaign') 
                : t('View Campaign')
          }
          mode={formMode}
        />
      ) : (
        <CampaignPaymentModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          campaignData={null}
          paymentMethods={paymentMethods.map(method => ({
            ...method,
            icon: method.id === 'stripe' ? <CreditCard className="h-5 w-5" /> :
                  method.id === 'paypal' ? <Banknote className="h-5 w-5" /> :
                  method.id === 'bank' ? <Banknote className="h-5 w-5" /> :
                  <CreditCard className="h-5 w-5" />
          }))}
          paymentSettings={paymentSettings}
          campaignSettings={campaignSettings}
          businesses={businesses}
        />
      )}

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentCampaign?.name || ''}
        entityName="campaign"
      />
      
      {/* Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen} modal={!isChatGptOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('Campaign Analytics')}</DialogTitle>
            <DialogDescription>
              {t('View and analyze campaign details')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="analytics_name">{t('Campaign Name')}</Label>
                <Input
                  id="analytics_name"
                  value={analyticsData.name}
                  onChange={(e) => setAnalyticsData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('Enter campaign name')}
                />
              </div>
              
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="analytics_description">{t('Description')}</Label>
              <Textarea
                id="analytics_description"
                value={analyticsData.description}
                onChange={(e) => setAnalyticsData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('Enter campaign description')}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="analytics_business">{t('Business')}</Label>
              <Select 
                value={analyticsData.business_id} 
                onValueChange={(value) => setAnalyticsData(prev => ({ ...prev, business_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select business')} />
                </SelectTrigger>
                <SelectContent>
                  {businesses.map((business: any) => (
                    <SelectItem key={business.id} value={business.id.toString()}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="analytics_start_date">{t('Start Date')}</Label>
                <Input
                  id="analytics_start_date"
                  type="date"
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="cursor-pointer"
                  value={analyticsData.start_date}
                  onChange={(e) => setAnalyticsData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="analytics_end_date">{t('End Date')}</Label>
                <Input
                  id="analytics_end_date"
                  type="date"
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="cursor-pointer"
                  value={analyticsData.end_date}
                  onChange={(e) => setAnalyticsData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('Total Days')}</Label>
                <div className="p-3 bg-gray-100 rounded-md">
                  <span className="font-medium">{analyticsData.total_days} {t('days')}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>{t('Total Cost')}</Label>
                <div className="p-3 bg-gray-100 rounded-md">
                  <span className="font-medium">${analyticsData.total_cost.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="analytics_coupon">{t('Apply Coupon')}</Label>
              <Input
                id="analytics_coupon"
                value={analyticsData.coupon_code}
                onChange={(e) => setAnalyticsData(prev => ({ ...prev, coupon_code: e.target.value }))}
                placeholder={t('Enter coupon code')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="analytics_payment">{t('Payment Method')}</Label>
              <Select 
                value={analyticsData.payment_method} 
                onValueChange={(value) => setAnalyticsData(prev => ({ ...prev, payment_method: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select payment method')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">{t('Credit Card')}</SelectItem>
                  <SelectItem value="paypal">{t('PayPal')}</SelectItem>
                  <SelectItem value="bank_transfer">{t('Bank Transfer')}</SelectItem>
                  <SelectItem value="stripe">{t('Stripe')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAnalyticsModalOpen(false)}
              >
                {t('Close')}
              </Button>
              <Button 
                onClick={() => {
                  toast.success(t('Analytics data logged to console'));
                }}
              >
                {t('View Analytics')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      

    </PageTemplate>
  );
}
