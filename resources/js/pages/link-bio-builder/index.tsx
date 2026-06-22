// pages/link-bio-builder/index.tsx
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
import { Filter, Search, Plus, Edit, Trash2, Eye, Share2, LayoutGrid, List, MoreVertical, Settings, Copy, Calendar as CalendarIcon, Briefcase, Store, Link2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { QRCodeModal } from '@/components/QRCodeModal';
import { ShareModal } from '@/components/ShareModal';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import './card-animations.css';
import './theme-fonts.css'; // Import theme fonts

interface BioLink {
  id: number;
  slug: string;
  name: string;
  link_type: string;
  created_at: string;
  custom_domain?: string;
  url_prefix?: string;
  config?: any;
}

interface Props {
  bioLinks: {
    data: BioLink[];
    links?: any[];
    from?: number;
    to?: number;
    total?: number;
    current_page?: number;
    last_page?: number;
  };
  planLimits?: {
    current_biolinks: number;
    max_biolinks: number;
    can_create: boolean;
  };
  filters?: {
    search?: string;
    type?: string;
    per_page?: string;
    view?: string;
    sort_field?: string;
    sort_direction?: string;
  };
}

export default function BioLinkIndex({ bioLinks = { data: [] }, planLimits, filters = {} }: Props) {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [activeView, setActiveView] = useState(() => {
    try {
      return filters.view || (typeof localStorage !== 'undefined' ? localStorage.getItem('biolink-view') : null) || 'list';
    } catch (error) {
      console.error('Error getting view preference:', error);
      return 'list';
    }
  });
  
  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  
  // Set default per page to 50 in demo mode, but only on initial load
  // Disable the automatic initial load that's causing the error
  // We'll let the page load naturally instead
  /*
  React.useEffect(() => {
    try {
      const isInitialLoad = (window as any).isDemo && (!filters.per_page || filters.per_page === '10');
      if (isInitialLoad) {
        router.get(route('link-bio-builder.index'), { 
          ...filters, 
          per_page: 50,
          view: activeView
        }, { preserveState: true, preserveScroll: true });
      }
    } catch (error) {
      console.error('Error in initial load effect:', error);
    }
  }, []);
  */
  
  // Save view preference when it changes
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined' && activeView) {
        localStorage.setItem('biolink-view', activeView);
      }
    } catch (error) {
      console.error('Error saving view preference:', error);
    }
  }, [activeView]);
  
  // Update URL when view changes without full page reload
  const updateViewInUrl = (view: string) => {
    try {
      // Instead of directly manipulating URL, use router to navigate
      const params: any = { view };
      
      // Preserve other existing parameters
      if (searchTerm) params.search = searchTerm;
      if (selectedType !== 'all') params.type = selectedType;
      if (filters.per_page) params.per_page = filters.per_page;
      if (filters.page) params.page = filters.page;
      
      // Navigate with the updated parameters
      router.get(route('link-bio-builder.index'), params, { preserveState: true, preserveScroll: true });
    } catch (error) {
      console.error('Error updating view in URL:', error);
    }
  };
  
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentBioLink, setCurrentBioLink] = useState<BioLink | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  
  const linkTypes = ['personal', 'business', 'portfolio', 'social'];
  
  const handleDeleteClick = (bioLink: BioLink) => {
    setCurrentBioLink(bioLink);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!currentBioLink) return;
    
    toast.loading(t('Deleting bio link...'));
    
    router.delete(route('bio-link.destroy', currentBioLink.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Bio link deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete bio link: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleCopyLink = (bioLink: BioLink) => {
    const url = bioLink.custom_domain
      ? `https://${bioLink.custom_domain}`
      : `${window.appSettings.baseUrl}/${bioLink.url_prefix || 'bio'}/${bioLink.slug}`;
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
  
  const handleShowQRCode = (bioLink: BioLink) => {
    setCurrentBioLink(bioLink);
    const url = bioLink.custom_domain 
      ? `https://${bioLink.custom_domain}`
      : `${window.appSettings.baseUrl}/${bioLink.url_prefix || 'bio'}/${bioLink.slug}`;
    setShareUrl(url);
    setIsQRCodeModalOpen(true);
  };
  
  const handleShowShareModal = (bioLink: BioLink) => {
    setCurrentBioLink(bioLink);
    const url = bioLink.custom_domain 
      ? `https://${bioLink.custom_domain}`
      : `${window.appSettings.baseUrl}/${bioLink.url_prefix || 'bio'}/${bioLink.slug}`;
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
    
    router.get(route('link-bio-builder.index'), params, { preserveState: true, preserveScroll: true });
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
    
    router.get(route('link-bio-builder.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleResetFilters = () => {
    setSelectedType('all');
    setSearchTerm('');
    setShowFilters(false);
    
    router.get(route('link-bio-builder.index'), { 
      page: 1, 
      per_page: filters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
  };

  // Helper function to get link type icon
  const getLinkTypeIcon = (linkType: string) => {
    switch (linkType.toLowerCase()) {
      case 'business':
        return <Briefcase className="h-5 w-5" />;
      case 'social':
        return <Share2 className="h-5 w-5" />;
      case 'portfolio':
        return <Store className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };
  
  // Helper function to get theme preview class
  const getThemePreviewClass = (bioLink: BioLink) => {
    const theme = bioLink.config?.theme || bioLink.link_type || 'personal';
    
    // Check if bioLink has background gradient or color
    if (bioLink.config?.background) {
      return 'bg-gradient-to-br';
    }
    
    // Fallback to predefined themes based on link_type
    switch (theme.toLowerCase()) {
      case 'business': return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'portfolio': return 'bg-gradient-to-br from-green-400 to-teal-600';
      case 'social': return 'bg-gradient-to-br from-pink-400 to-orange-500';
      case 'personal': return 'bg-gradient-to-br from-indigo-500 to-purple-600';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };
  
  // Helper function to get theme pattern class
  const getThemePatternClass = (bioLink: BioLink) => {
    const theme = bioLink.config?.theme || bioLink.link_type || 'personal';
    
    switch (theme.toLowerCase()) {
      case 'business': return 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]';
      case 'portfolio': return 'bg-[linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]';
      case 'social': return 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_2px,transparent_2px)] bg-[length:24px_24px]';
      case 'personal': return 'bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:10px_10px]';
      default: return '';
    }
  };

  // Define page actions
  const canCreate = !planLimits || planLimits.can_create;
  const pageActions = [
    {
      label: planLimits && !canCreate ? t('Bio Link Limit Reached ({{current}}/{{max}})', { current: planLimits.current_biolinks, max: planLimits.max_biolinks }) : t('Create New Bio Link'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: canCreate ? 'default' : 'outline',
      onClick: canCreate ? () => router.get(route('link-bio-builder.create')) : () => toast.error(t('Bio link limit exceeded. Your plan allows maximum {{max}} bio links. Please upgrade your plan.', { max: planLimits?.max_biolinks })),
      disabled: !canCreate
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Bio Link') }
  ];

  // Define table columns for list view
  const columns = [
    { 
      key: 'name', 
      label: t('Bio Link'),
      sortable: true,
      render: (value: any, bioLink: any) => {
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
              {getLinkTypeIcon(bioLink.link_type)}
            </div>
            <div className="ml-4">
              <Link href={route('link-bio-builder.edit', bioLink.id)} className="hover:underline">
                <div className="text-sm font-medium text-primary cursor-pointer hover:text-primary/80">{bioLink.name}</div>
              </Link>
              <div className="text-sm text-gray-500">{bioLink.slug}</div>
            </div>
          </div>
        );
      }
    },
    { 
      key: 'link_type', 
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
      render: (value: string, bioLink: any) => (
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
      title={t("Bio Link")} 
      url={route('link-bio-builder.index')}
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
              label: t('Link Type'),
              type: 'select',
              value: selectedType,
              onChange: handleTypeFilter,
              options: [
                { value: 'all', label: t('All Types') },
                ...linkTypes.map(type => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1)
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
            router.get(route('link-bio-builder.index'), params, { preserveState: true, preserveScroll: true });
          }}
          showViewToggle={true}
          activeView={activeView}
          onViewChange={(view) => {
            try {
              setActiveView(view);
              // Instead of calling updateViewInUrl, handle it directly here
              const params: any = { view };
              
              // Preserve other existing parameters
              if (searchTerm) params.search = searchTerm;
              if (selectedType !== 'all') params.type = selectedType;
              if (filters.per_page) params.per_page = filters.per_page;
              if (filters.page) params.page = filters.page;
              
              // Navigate with the updated parameters
              router.get(route('link-bio-builder.index'), params, { preserveState: true, preserveScroll: true });
            } catch (error) {
              console.error('Error in view change handler:', error);
            }
          }}
        />
      </div>

      {/* Content section */}
      {!bioLinks || !bioLinks.data || bioLinks.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t("You haven't created any bio links yet.")}
          </p>
          <Link href={route('link-bio-builder.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("Create Your First Bio Link")}
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
                {bioLinks.data.map((bioLink) => (
                  <tr key={bioLink.id} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${bioLink.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(bioLink[column.key], bioLink) : bioLink[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={bioLink.custom_domain 
                                ? `https://${bioLink.custom_domain}`
                                : `${window.appSettings.baseUrl}/${bioLink.url_prefix || 'bio'}/${bioLink.slug}`
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
                                handleShowShareModal(bioLink);
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
                                handleCopyLink(bioLink);
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
                                handleShowQRCode(bioLink);
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("QR Code")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('link-bio-builder.analytics', bioLink.id)}>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-green-500 hover:text-green-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>{t("Analytics")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('link-bio-builder.edit', bioLink.id)}>
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
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteClick(bioLink)}
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
            from={bioLinks?.from || 0}
            to={bioLinks?.to || 0}
            total={bioLinks?.total || 0}
            links={bioLinks?.links}
            entityName={t("bio links")}
            onPageChange={(url) => {
              if (!url) return;
              
              try {
                // Extract page number from the URL
                const urlObj = new URL(url, window.location.origin);
                const page = urlObj.searchParams.get('page');
                
                // Create params object with all current filters and the new page
                const params: any = { page, view: activeView };
                
                // Add other filters
                if (searchTerm) params.search = searchTerm;
                if (selectedType !== 'all') params.type = selectedType;
                if (filters.per_page) params.per_page = filters.per_page;
                
                // Navigate with all parameters
                router.get(route('link-bio-builder.index'), params, { preserveState: true });
              } catch (error) {
                console.error('Error parsing pagination URL:', error);
              }
            }}
          />
        </div>
      ) : (
        <div>
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {bioLinks.data.map((bioLink) => (
              <Card key={bioLink.id} className="group bg-white overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
               {/* Theme Preview with Bio Link Mockup */}
                <div className="h-30 relative overflow-hidden bg-gray-100 group">
                  {/* Theme Preview Background with Animation */}
                  <div 
                    className={`absolute inset-0 ${getThemePreviewClass(bioLink)} ${getThemePatternClass(bioLink)} transition-all duration-500 group-hover:scale-105`}
                    style={bioLink.config?.background ? {
                      background: bioLink.config.background.type === 'image' 
                        ? `url(${getImageDisplayUrl(bioLink.config.background.image)}) center/cover`
                        : bioLink.config.background.type === 'gradient' 
                        ? bioLink.config.background.gradient 
                        : bioLink.config.background.color
                    } : undefined}
                  ></div>
                  
                  {/* Floating Elements - Decorative */}
                  <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-12 h-12 rounded-full bg-white/20 animate-float-slow"></div>
                    <div className="absolute bottom-[30%] right-[15%] w-8 h-8 rounded-full bg-white/10 animate-float-medium"></div>
                    <div className="absolute top-[40%] right-[25%] w-6 h-6 rounded-full bg-white/15 animate-float-fast"></div>
                  </div>
                  
                  {/* New badge - top left corner */}
                  {new Date(bioLink.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
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
                        <DropdownMenuItem onClick={() => {
                          const url = bioLink.custom_domain 
                            ? `https://${bioLink.custom_domain}`
                            : `${window.appSettings.baseUrl}/${bioLink.url_prefix || 'bio'}/${bioLink.slug}`;
                          handleCopyLink(bioLink);
                          toast.success(t('Link copied to clipboard'));
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          <span>{t("Copy Link")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowShareModal(bioLink)}>
                          <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{t("Share")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowQRCode(bioLink)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                          <span>{t("QR Code")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('link-bio-builder.analytics', bioLink.id))}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-green-500"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                          <span>{t("Analytics")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(bioLink)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>{t("Delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Bio Link name */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <Link href={route('link-bio-builder.edit', bioLink.id)}>
                      <h3 className="text-lg font-bold text-white truncate drop-shadow-md hover:underline cursor-pointer hover:text-primary-foreground">{bioLink.name}</h3>
                    </Link>
                    <p className="text-sm text-white/80 truncate">{bioLink.link_type}</p>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge variant="outline" className="capitalize font-medium">
                        {bioLink.link_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t("Created")} {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(bioLink.created_at, false) : new Date(bioLink.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <Link href={route('link-bio-builder.edit', bioLink.id)} className="col-span-1">
                      <Button 
                        variant="default" 
                        className="w-full h-9 bg-amber-500 hover:bg-amber-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                    </Link>
                    
                    <a 
                      href={bioLink.custom_domain 
                        ? `https://${bioLink.custom_domain}`
                        : `${window.appSettings.baseUrl}/${bioLink.url_prefix || 'bio'}/${bioLink.slug}`
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
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <Pagination
              from={bioLinks?.from || 0}
              to={bioLinks?.to || 0}
              total={bioLinks?.total || 0}
              links={bioLinks?.links}
              entityName={t("bio links")}
              onPageChange={(url) => {
                if (!url) return;
                
                try {
                  // Extract page number from the URL
                  const urlObj = new URL(url, window.location.origin);
                  const page = urlObj.searchParams.get('page');
                  
                  // Create params object with all current filters and the new page
                  const params: any = { page, view: activeView };
                  
                  // Add other filters
                  if (searchTerm) params.search = searchTerm;
                  if (selectedType !== 'all') params.type = selectedType;
                  if (filters.per_page) params.per_page = filters.per_page;
                  
                  // Navigate with all parameters
                  router.get(route('link-bio-builder.index'), params, { preserveState: true });
                } catch (error) {
                  console.error('Error parsing pagination URL:', error);
                }
              }}
            />
          </div>
        </div>
      )}
      
      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentBioLink?.name || ''}
        entityName="bio link"
      />
      
      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        url={shareUrl}
        title={currentBioLink?.name || 'Bio Link'}
      />
      
      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
        title={currentBioLink?.name || 'Bio Link'}
      />
    </PageTemplate>
  );
}

// Helper function to handle sorting
function handleSort(key: string) {
  try {
    const currentSortField = new URL(window.location.href).searchParams.get('sort_field');
    const currentSortDirection = new URL(window.location.href).searchParams.get('sort_direction');
    const currentView = new URL(window.location.href).searchParams.get('view') || localStorage.getItem('biolink-view') || 'list';
    
    const direction = currentSortField === key && currentSortDirection === 'asc' ? 'desc' : 'asc';
    
    // Instead of using URL directly, use route with params
    const params: any = { 
      sort_field: key, 
      sort_direction: direction,
      view: currentView
    };
    
    // Add any existing search params
    const urlParams = new URL(window.location.href).searchParams;
    if (urlParams.get('search')) params.search = urlParams.get('search');
    if (urlParams.get('type') && urlParams.get('type') !== 'all') params.type = urlParams.get('type');
    if (urlParams.get('per_page')) params.per_page = urlParams.get('per_page');
    
    router.get(route('link-bio-builder.index'), params, { preserveState: true });
  } catch (error) {
    console.error('Error handling sort:', error);
  }
}