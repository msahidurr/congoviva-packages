// pages/vcard-builder/index.tsx
import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Plus, Edit, Trash2, Eye, Share2, LayoutGrid, List, MoreVertical, Settings, Copy, Calendar as CalendarIcon, Briefcase, Store, Stethoscope, Utensils, Scissors, Wrench, GraduationCap, Camera, Car, Home } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { QRCodeModal } from '@/components/QRCodeModal';
import { ShareModal } from '@/components/ShareModal';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import './card-animations.css';
import { businessTypeOptions } from '@/pages/vcard-builder/business-templates';

interface Business {
  id: number;
  slug: string;
  name: string;
  business_type: string;
  created_at: string;
  expertise?: string;
  url_prefix?: string;
  custom_domain?: string;
  domain_type?: string;
}

interface Props {
  businesses: {
    data: Business[];
    links?: any[];
    from?: number;
    to?: number;
    total?: number;
    current_page?: number;
    last_page?: number;
  };
  planLimits?: {
    current_businesses: number;
    max_businesses: number;
    can_create: boolean;
  };
  filters?: {
    search?: string;
    type?: string;
    age?: string;
    per_page?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

export default function VCardBuilderIndex({ businesses = { data: [] }, planLimits, filters = {} }: Props) {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [activeView, setActiveView] = useState(filters.view || localStorage.getItem('vcard-view') || 'list');

  const getPreviewImage = (business: any) => {
    const header = business?.config_sections?.header || {};
    const keys = ['profile_image', 'logo'];

    for (const key of keys) {
      if (header?.[key]) {
        return header[key];
      }
    }

    return null;
  };
  
  // Helper function to sanitize slug for route usage
  const sanitizeSlug = (slug: string): string => {
    if (!slug) return 'invalid-slug';
    // Replace any characters that are not alphanumeric, hyphens, or underscores
    return slug.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'invalid-slug';
  };
  
  // Helper function to get base host for subdomains
  const getBaseHost = (): string => {
    const hostname = window.location.hostname;
    // Extract base domain from current hostname
    const parts = hostname.split('.');
    return parts.length > 1 ? parts.slice(-2).join('.') : hostname;
  };
  
  // Handle flash messages
  // useEffect(() => {
  //   if (flash?.success) {
  //     toast.success(flash.success);
  //   }
  //   if (flash?.error) {
  //     toast.error(flash.error);
  //   }
  // }, [flash]);
  
  // Set default per page to 50 in demo mode, but only on initial load
  React.useEffect(() => {
    const isInitialLoad = (window as any).isDemo && (!filters.per_page || filters.per_page === '10');
    if (isInitialLoad) {
      router.get(route('vcard-builder.index'), { 
        ...filters, 
        per_page: 50,
        view: activeView
      }, { preserveState: true, preserveScroll: true });
    }
  }, []);
  
  // Save view preference when it changes
  useEffect(() => {
    localStorage.setItem('vcard-view', activeView);
  }, [activeView]);
  
  // No longer needed with DropdownMenu component
  
  // Update URL when view changes without full page reload
  const updateViewInUrl = (view: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    window.history.pushState({}, '', url.toString());
  };
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  
  // Custom animation styles
  const animationStyles = {
    '@keyframes float-slow': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    '@keyframes float-medium': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-7px)' },
    },
    '@keyframes float-fast': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-5px)' },
    },
    '@keyframes pulse-slow': {
      '0%, 100%': { opacity: 0.3 },
      '50%': { opacity: 0.7 },
    },
    '@keyframes pulse-slower': {
      '0%, 100%': { opacity: 0.2 },
      '50%': { opacity: 0.5 },
    },
    '.animate-float-slow': {
      animation: 'float-slow 6s ease-in-out infinite',
    },
    '.animate-float-medium': {
      animation: 'float-medium 4s ease-in-out infinite',
    },
    '.animate-float-fast': {
      animation: 'float-fast 3s ease-in-out infinite',
    },
    '.animate-pulse-slow': {
      animation: 'pulse-slow 3s ease-in-out infinite',
    },
    '.animate-pulse-slower': {
      animation: 'pulse-slower 4s ease-in-out infinite',
    },
    '.perspective': {
      perspective: '1000px',
    },
    '.rotate-y-12': {
      transform: 'rotateY(12deg)',
    },
  };
    
  const handleDeleteClick = (business: Business) => {
    setCurrentBusiness(business);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!currentBusiness) return;
    
    toast.loading(t('Deleting business...'));
    
    router.delete(route('vcard-builder.destroy', currentBusiness.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Business deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete business: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleDuplicate = (business: Business) => {
    toast.loading(t('Duplicating business...'));
    
    router.post(route('vcard-builder.duplicate', business.id), {}, {
      onSuccess: () => {
        toast.dismiss();
        toast.success(t('Business duplicated successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to duplicate business: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
const handleCopyLink = (business: Business) => {
    let url;
    if (business.custom_domain) {
      url = `https://${business.custom_domain}`;
    } else if (business.domain_type === 'subdomain') {
      url = `${window.location.protocol}//${business.slug}.${getBaseHost()}`;
    } else {
      url = business.url_prefix && business.url_prefix !== ''
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) }, true)
        : route('public.vcard.show.direct', sanitizeSlug(business.slug), true);
    }
    // Fallback clipboard function for HTTP environments
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API for HTTPS
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((resolve, reject) => {
          if (document.execCommand('copy')) {
            textArea.remove();
            resolve();
          } else {
            textArea.remove();
            reject(new Error('Copy failed'));
          }
        });
      }
    };
    copyToClipboard(url)
      .then(() => {
        toast.success(t('Link copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy link'));
      });
  };
  
  const handleShowQRCode = (business: Business) => {
    setCurrentBusiness(business);
    let url;
    if (business.custom_domain) {
      url = `https://${business.custom_domain}`;
    } else if (business.domain_type === 'subdomain') {
      url = `${window.location.protocol}//${business.slug}.${getBaseHost()}`;
    } else {
      url = business.url_prefix && business.url_prefix !== '' 
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) }, true)
        : route('public.vcard.show.direct', sanitizeSlug(business.slug), true);
    }
    setShareUrl(url);
    setIsQRCodeModalOpen(true);
  };
  
  const handleShowShareModal = (business: Business) => {
    setCurrentBusiness(business);
    let url;
    if (business.custom_domain) {
      url = `https://${business.custom_domain}`;
    } else if (business.domain_type === 'subdomain') {
      url = `${window.location.protocol}//${business.slug}.${getBaseHost()}`;
    } else {
      url = business.url_prefix && business.url_prefix !== '' 
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) }, true)
        : route('public.vcard.show.direct', sanitizeSlug(business.slug), true);
    }
    setShareUrl(url);
    setIsShareModalOpen(true);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedType !== 'all' || searchTerm !== '';
  };
  
  // Count active filters
  const activeFilterCount = () => {
    return (selectedType !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
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
    
    if (selectedType !== 'all') {
      params.type = selectedType;
    }
    
    // Add per_page if it exists
    if (filters.per_page) {
      params.per_page = filters.per_page;
    }
    
    // Preserve the active view
    params.view = activeView;
    
    router.get(route('vcard-builder.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleTypeFilter = (value: string) => {
    setSelectedType(value);
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (value !== 'all') {
      params.type = value;
    }
    
    // Add per_page if it exists
    if (filters.per_page) {
      params.per_page = filters.per_page;
    }
    
    // Preserve the active view
    params.view = activeView;
    
    router.get(route('vcard-builder.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleResetFilters = () => {
    setSelectedType('all');
    setSearchTerm('');
    setShowFilters(false);
    
    router.get(route('vcard-builder.index'), { 
      page: 1, 
      per_page: filters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
  };

  // Helper function to get business type icon
  const getBusinessTypeIcon = (businessType: string) => {
    switch (businessType.toLowerCase()) {
      case 'doctor':
      case 'medical':
      case 'healthcare':
        return <Stethoscope className="h-5 w-5" />;
      case 'restaurant':
      case 'food':
      case 'cafe':
        return <Utensils className="h-5 w-5" />;
      case 'salon':
      case 'beauty':
      case 'spa':
        return <Scissors className="h-5 w-5" />;
      case 'retail':
      case 'store':
      case 'shop':
        return <Store className="h-5 w-5" />;
      case 'photography':
      case 'photographer':
        return <Camera className="h-5 w-5" />;
      case 'education':
      case 'teacher':
      case 'tutor':
        return <GraduationCap className="h-5 w-5" />;
      case 'construction':
      case 'contractor':
      case 'repair':
      case 'car-mechanic':
        return <Wrench className="h-5 w-5" />;
      case 'realestate':
      case 'real estate':
        return <Home className="h-5 w-5" />;
      default:
        return <Briefcase className="h-5 w-5" />;
    }
  };
  
  // Helper function to get theme preview class
  const getThemePreviewClass = (theme?: string, business?: any) => {
    // Check if business has config_sections with colors
    if (business?.config_sections?.colors) {
      const { primary, secondary } = business.config_sections.colors;
      if (primary && secondary) {
        return `bg-gradient-to-br`;
      }
    }
    
    // Fallback to predefined themes
    switch (theme) {
      case 'modern': return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'classic': return 'bg-gradient-to-br from-gray-300 to-gray-500';
      case 'elegant': return 'bg-gradient-to-br from-amber-400 to-pink-600';
      case 'professional': return 'bg-gradient-to-br from-green-400 to-teal-600';
      case 'creative': return 'bg-gradient-to-br from-pink-400 to-orange-500';
      case 'minimal': return 'bg-gradient-to-br from-slate-300 to-slate-500';
      default: return 'bg-gradient-to-br from-indigo-500 to-purple-600';
    }
  };
  
  // Helper function to get theme pattern class
  const getThemePatternClass = (theme?: string) => {
    switch (theme) {
      case 'modern': return 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]';
      case 'classic': return 'bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]';
      case 'elegant': return 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_2px,transparent_2px)] bg-[length:24px_24px]';
      case 'professional': return 'bg-[linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]';
      default: return '';
    }
  };

  // Define page actions
  const canCreate = !planLimits || planLimits.can_create;
  const pageActions = [
    {
      label: planLimits && !canCreate ? t('Business Limit Reached ({{current}}/{{max}})', { current: planLimits.current_businesses, max: planLimits.max_businesses }) : t('Create New Business'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: canCreate ? 'default' : 'outline',
      onClick: canCreate ? () => router.get(route('vcard-builder.create')) : () => toast.error(t('Business limit exceeded. Your plan allows maximum {{max}} businesses. Please upgrade your plan.', { max: planLimits.max_businesses })),
      disabled: !canCreate
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('vCard Builder'), href: route('vcard-builder.index') },
    { title: t('Businesses') }
  ];

  // Define table columns for list view
  const columns = [
    { 
      key: 'name', 
      label: t('Business'),
      sortable: true,
      render: (value: any, business: any) => {
        const profileImage = getPreviewImage(business);
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-600 overflow-hidden">
              {profileImage ? (
                <img 
                  src={getImageDisplayUrl(profileImage)} 
                  alt={business.name} 
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${profileImage ? 'hidden' : ''}`}>
                {getBusinessTypeIcon(business.business_type)}
              </div>
            </div>
            <div className="ml-4">
              <Link href={route('vcard-builder.edit', business.id)} className="hover:underline">
                <div className="text-sm font-medium text-primary cursor-pointer hover:text-primary/80">{business.name}</div>
              </Link>
              {business.expertise && (
                <div className="text-sm text-gray-500">{business.expertise}</div>
              )}
            </div>
          </div>
        );
      }
    },
    { 
      key: 'business_type', 
      label: t('Type'),
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: t('Created'),
      sortable: true,
      render: (value: string, business: any) => (
        <div className="flex items-center">
          {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(value, false) : new Date(value).toLocaleDateString()}
          {new Date(value) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
            <Badge className="ml-2 bg-green-500">New</Badge>
          )}
        </div>
      )
    }
  ];

  return (
    <PageTemplate 
      title={t("Businesses")} 
      url={route('vcard-builder.index')}
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
            {
              name: 'type',
              label: t('Business Type'),
              type: 'select',
              value: selectedType,
              onChange: handleTypeFilter,
              options: [
                { value: 'all', label: t('All Types') },
                ...businessTypeOptions.map((template, index) => ({
                  value: template.value,
                  label: template.label.charAt(0).toUpperCase() + template.label.slice(1)
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
          currentPerPage={filters.per_page?.toString() || "10"}
          onPerPageChange={(value) => {
            const params: any = { page: 1, per_page: parseInt(value) };
            
            if (searchTerm) {
              params.search = searchTerm;
            }
            
            if (selectedType !== 'all') {
              params.type = selectedType;
            }
            
            // Preserve the active view when changing pages
            params.view = activeView;
            router.get(route('vcard-builder.index'), params, { preserveState: true, preserveScroll: true });
          }}
          showViewToggle={true}
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            updateViewInUrl(view);
          }}
        />
      </div>

      {/* Content section */}
      {!businesses?.data || businesses.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t("You haven't created any businesses yet.")}
          </p>
          <Link href={route('vcard-builder.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("Create Your First Business")}
            </Button>
          </Link>
        </div>
      ) : activeView === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {columns.map((column) => (
                    <th 
                      key={column.key} 
                      className="px-4 py-3 text-left font-medium text-gray-500"
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center">
                        {column.label}
                        {column.sortable && (
                          <span className="ml-1">
                            {filters.sort_field === column.key ? (
                              filters.sort_direction === 'asc' ? '↑' : '↓'
                            ) : ''}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-gray-500">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {businesses.data.map((business) => (
                  <tr key={business.id} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${business.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(business[column.key], business) : business[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={business.custom_domain 
                                ? `https://${business.custom_domain}`
                                : business.domain_type === 'subdomain'
                                  ? `https://${business.slug}.${getBaseHost()}`
                                  : (business.url_prefix && business.url_prefix !== '' 
                                    ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) })
                                    : route('public.vcard.show.direct', sanitizeSlug(business.slug)))
                              } 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>{t("Preview")}</TooltipContent>
                        </Tooltip>
                                    
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShowShareModal(business);
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Share")}</TooltipContent>
                        </Tooltip>
                        
                                          
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.preventDefault();
                                handleCopyLink(business);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Copy Link")}</TooltipContent>
                        </Tooltip>
                        
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-indigo-500 hover:text-indigo-700"
                              onClick={(e) => {
                                e.preventDefault();
                                handleShowQRCode(business);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("QR Code")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-blue-500 hover:text-blue-700"
                               onClick={() => router.get(route('vcard-builder.contacts', sanitizeSlug(business.slug)))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Contacts")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-orange-500 hover:text-orange-700"
                              onClick={() => router.get(route('vcard-builder.analytics', sanitizeSlug(business.slug)))}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Analytics")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-purple-500 hover:text-purple-700"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDuplicate(business);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Duplicate")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('vcard-builder.edit', business.id)}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-amber-500 hover:text-amber-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>{t("Edit")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-green-500 hover:text-green-700"
                              onClick={() => router.get(route('vcard-builder.calendar', sanitizeSlug(business.slug)))}
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Calendar")}</TooltipContent>
                        </Tooltip>
                        
                  
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(business)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Delete")}</TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination section */}
          <Pagination
            from={businesses.from || 0}
            to={businesses.to || 0}
            total={businesses.total || 0}
            links={businesses.links}
            currentPage={businesses.current_page}
            lastPage={businesses.last_page}
            entityName={t("businesses")}
            onPageChange={(url) => router.get(url)}
          />
        </div>
      ) : (
        <div>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {businesses.data.map((business) => (
              <Card key={business.id} className="group bg-white overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
               {/* Theme Preview with Business Card Mockup */}
                <div className="h-30 relative overflow-hidden bg-gray-100 group">
                  {/* Theme Preview Background with Animation */}
                  <div 
                    className={`absolute inset-0 ${getThemePreviewClass(business.theme, business)} ${getThemePatternClass(business.theme)} transition-all duration-500 group-hover:scale-105`}
                    style={business?.config_sections?.colors ? {
                      backgroundImage: `linear-gradient(to bottom right, ${business.config_sections.colors.primary}, ${business.config_sections.colors.secondary})`
                    } : undefined}
                  ></div>
                  
                  {/* Floating Elements - Decorative */}
                  <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-12 h-12 rounded-full bg-white/20 animate-float-slow"></div>
                    <div className="absolute bottom-[30%] right-[15%] w-8 h-8 rounded-full bg-white/10 animate-float-medium"></div>
                    <div className="absolute top-[40%] right-[25%] w-6 h-6 rounded-full bg-white/15 animate-float-fast"></div>
                  </div>
                  
                  {/* New badge - top left corner */}
                  {new Date(business.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-lg z-10">
                      {t("New")}
                    </div>
                  )}
                  
                  {/* Three dots menu - right corner */}
                  <div className="absolute top-2 right-2 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 p-0"
                        >
                          <MoreVertical className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
                        <DropdownMenuItem onClick={() => handleDuplicate(business)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-purple-500"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          <span>{t("Duplicate")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(business)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          <span>{t("Copy Link")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowShareModal(business)}>
                          <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{t("Share")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('vcard-builder.analytics', sanitizeSlug(business.slug)))}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-orange-500"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                          <span>{t("Analytics")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('vcard-builder.calendar', sanitizeSlug(business.slug)))}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-green-500"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/></svg>
                          <span>{t("Calendar")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowQRCode(business)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                          <span>{t("QR Code")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('vcard-builder.contacts', sanitizeSlug(business.slug)))}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          <span>{t("Contacts")}</span>
                        </DropdownMenuItem>

                       
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(business)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>{t("Delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Business name */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <Link href={route('vcard-builder.edit', business.id)}>
                      <h3 className="text-lg font-bold text-white truncate drop-shadow-md hover:underline cursor-pointer hover:text-primary-foreground">{business.name}</h3>
                    </Link>
                    <p className="text-sm text-white/80 truncate">{business.business_type}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize font-medium">
                        {business.business_type}
                      </Badge>
                      {business.expertise && (
                        <Badge variant="secondary" className="capitalize">
                          {business.expertise}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {t("Created")} {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(business.created_at, false) : new Date(business.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <Link href={route('vcard-builder.edit', business.id)} className="col-span-1">
                      <Button 
                        variant="default" 
                        className="w-full h-9 bg-amber-500 hover:bg-amber-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                    </Link>
                    
                    <a 
                      href={business.custom_domain 
                        ? `https://${business.custom_domain}`
                        : business.domain_type === 'subdomain'
                          ? `https://${business.slug}.${getBaseHost()}`
                          : (business.url_prefix && business.url_prefix !== '' 
                            ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) })
                            : route('public.vcard.show.direct', sanitizeSlug(business.slug)))
                      } 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="col-span-1"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-9 border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("Preview")}
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Pagination for grid view */}
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow">
            <Pagination
              from={businesses.from || 0}
              to={businesses.to || 0}
              total={businesses.total || 0}
              links={businesses.links}
              currentPage={businesses.current_page}
              lastPage={businesses.last_page}
              entityName={t("businesses")}
              onPageChange={(url) => router.get(url)}
            />
          </div>
        </div>
      )}
      
      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentBusiness?.name || ''}
        entityName="business"
      />
      
      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        url={shareUrl}
        title={currentBusiness?.name || 'Business'}
      />
      
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

// Helper function to handle sorting
function handleSort(key: string) {
  const currentSortField = new URL(window.location.href).searchParams.get('sort_field');
  const currentSortDirection = new URL(window.location.href).searchParams.get('sort_direction');
  const currentView = new URL(window.location.href).searchParams.get('view') || localStorage.getItem('vcard-view') || 'list';
  
  const direction = currentSortField === key && currentSortDirection === 'asc' ? 'desc' : 'asc';
  
  const url = new URL(window.location.href);
  url.searchParams.set('sort_field', key);
  url.searchParams.set('sort_direction', direction);
  url.searchParams.set('view', currentView);
  
  router.get(url.toString());
}
