import { PageTemplate } from '@/components/page-template';
import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Pagination } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, Puzzle, Eye, Download, MoreVertical, Power, Trash2, Plus } from 'lucide-react';
import { AddonUploadModal } from '@/components/addon-upload-modal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';

interface Addon {
  id: number;
  name: string;
  description: string;
  version: string;
  price: number;
  category: string;
  status: string;
  is_purchased: boolean;
  is_enabled: boolean;
  features: string[];
  image: string;
  url: string;
  package_name?: string;
  created_at: string;
  updated_at: string;
}

interface AddonsPageProps {
  addons: {
    data: Addon[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    links: any[];
  };
  filters: {
    search?: string;
    category?: string;
    status?: string;
    sort_field?: string;
    sort_direction?: string;
    per_page?: number;
  };
}

export default function AddonsPage() {
  const { t } = useTranslation();
  const { flash, addons, filters } = usePage().props as any;
  
  // Get per_page from URL if not in filters and ensure it matches available options
  const urlParams = new URLSearchParams(window.location.search);
  const perPageFromUrl = urlParams.get('per_page');
  const availableOptions = [18, 36, 72, 144];
  const defaultPerPage = availableOptions[0]; // 18
  
  let currentPerPage = filters?.per_page || parseInt(perPageFromUrl || '0') || defaultPerPage;
  // Ensure the value exists in available options
  if (!availableOptions.includes(currentPerPage)) {
    currentPerPage = defaultPerPage;
  }
  
  // State
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    status: filters?.status || 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<Addon | null>(null);

  // Define page actions
  const pageActions = [
    {
      label: t('Upload Addon'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => setShowUploadModal(true)
    }
  ];
  
  // Show flash messages if they exist
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  // Set default per_page on initial load if not present
  useEffect(() => {
    if (!filters?.per_page) {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('per_page')) {
        router.get(route('addons.index'), { per_page: 18 }, { preserveState: true, replace: true });
      }
    }
  }, []);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.entries(filterValues).some(([key, value]) => {
      return value && value !== 'all';
    }) || searchTerm !== '';
  };

  // Count active filters
  const activeFilterCount = () => {
    return Object.entries(filterValues).filter(([key, value]) => {
      return value && value !== 'all';
    }).length + (searchTerm ? 1 : 0);
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
    
    // Add filter values to params
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params[key] = value;
      }
    });
    
    // Always include per_page
    params.per_page = filters?.per_page || 18;
    
    router.get(route('addons.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleFilterChange = (key: string, value: any) => {
    let newFilters = { ...filterValues, [key]: value };
    
    // Reset incompatible filter combinations
    if (key === 'status') {
      if (value === 'available' && (filterValues.status === 'enabled' || filterValues.status === 'disabled')) {
        // If switching to available, it's valid
      } else if (value === 'enabled' || value === 'disabled') {
        // These are only valid for purchased addons, no additional reset needed
      }
    }
    
    setFilterValues(newFilters);
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    // Add all current filter values
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all') {
        params[k] = v;
      }
    });
    
    // Add per_page if it exists
    if (filters?.per_page) {
      params.per_page = filters.per_page;
    }
    
    router.get(route('addons.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setFilterValues({ status: 'all' });
    setSearchTerm('');
    setShowFilters(false);
    
    router.get(route('addons.index'), { 
      page: 1, 
      per_page: filters?.per_page || 18
    }, { preserveState: true, preserveScroll: true });
  };

  const handleToggleStatus = (addon: Addon) => {
    if (!addon.is_purchased) {
      toast.error(t('You must purchase this addon first'));
      return;
    }

    router.post(route('addons.toggle-status', addon.id), {}, {
      onFinish: (page) => {
        if (page.props.flash?.success) {
          toast.success(page.props.flash.success);
          window.location.reload();
        }
        if (page.props.flash?.error) {
          toast.error(page.props.flash.error);
        }
      }
    });
  };

  const handleMarketplaceSetting = (addon: Addon) => {
    const addonSlug = addon.name.toLowerCase().replace(/\s+/g, '-');
    router.get(route(`${addonSlug}.marketplace.settings`));
  };

  const handleRemoveAddon = (addon: Addon) => {
    setAddonToDelete(addon);
    setShowDeleteModal(true);
  };

  const handlePreview = (addon: Addon) => {
    if (!addon?.url) return;

    try {
      const previewUrl = new URL(addon.url);
      previewUrl.searchParams.set('utm_source', 'demo');
      previewUrl.searchParams.set('utm_medium', 'vcard');
      previewUrl.searchParams.set('utm_campaign', 'btn');
      window.open(previewUrl.toString(), '_blank');
    } catch {
      window.open(addon.url, '_blank');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!addonToDelete) return;
    router.delete(route('addons.remove', addonToDelete.id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        setAddonToDelete(null);
        toast.dismiss();
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const getStatusBadge = (addon: Addon) => {
    if (!addon.is_purchased) {
      return <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-xs">{t('Available')}</Badge>;
    }
    if (addon.is_enabled) {
      return <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">{t('Enabled')}</Badge>;
    }
    return <Badge variant="secondary" className="bg-gray-500 text-xs">{t('Disabled')}</Badge>;
  };

  // Helper function to get correct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    
    // If it's already a full URL (starts with http), return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it starts with /, construct full URL with base URL
    if (imagePath.startsWith('/')) {
      return `${window.appSettings?.imageUrl || ''}${imagePath}`;
    }
    
    // Otherwise, prepend /storage/
    return `${window.appSettings?.imageUrl || ''}/storage/${imagePath}`;
  };

  const getCategoryIcon = (addon: Addon) => {
    // For purchased addons, use local favicon
    if (addon.is_purchased && addon.package_name) {
      const baseUrl = (window as any).appSettings?.baseUrl || window.location.origin;
      const localPath = `${baseUrl}/packages/workdo/${addon.package_name}/favicon.png`;
      return localPath;
    }
    
    // For unpurchased addons, use JSON image
    if (!addon.is_purchased && addon.image) {
      return addon.image;
    }
    switch (addon.category.toLowerCase()) {
      case 'analytics': return '📊';
      case 'social': return '📱';
      case 'e-commerce': return '🛒';
      case 'marketing': return '📧';
      case 'seo': return '🔍';
      case 'localization': return '🌍';
      default: return '📦';
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Addons') }
  ];

  const filterOptions = [
    {
      name: 'status',
      label: t('Status'),
      type: 'select' as const,
      options: [
        { value: 'all', label: t('All Status') },
        { value: 'purchased', label: t('Purchased') },
        { value: 'available', label: t('Available') },
        { value: 'enabled', label: t('Enabled') },
        { value: 'disabled', label: t('Disabled') }
      ],
      value: filterValues.status || 'all',
      onChange: (value: string) => handleFilterChange('status', value)
    }
  ];

  return (
    <PageTemplate 
      title={t('Addons')} 
      url="/addons"
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {/* Addon Stats Banner */}
      <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-xl p-6 mb-4 overflow-hidden">
        {/* Background SVG Pattern */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Layer elements */}
            <circle cx="700" cy="50" r="60" fill="white" fillOpacity="0.1" />
            <circle cx="720" cy="80" r="30" fill="white" fillOpacity="0.05" />
            <rect x="650" y="120" width="40" height="40" rx="8" fill="white" fillOpacity="0.08" transform="rotate(15 670 140)" />
            <rect x="680" y="30" width="25" height="25" rx="5" fill="white" fillOpacity="0.1" transform="rotate(-20 692.5 42.5)" />
            
            {/* Addon icons */}
            <g transform="translate(600, 60)" fill="white" fillOpacity="0.15">
              <rect x="0" y="0" width="20" height="20" rx="4" />
              <circle cx="30" cy="10" r="8" />
              <polygon points="50,0 60,10 50,20 40,10" />
              <rect x="70" y="5" width="15" height="10" rx="2" />
            </g>
            
            {/* Decorative elements */}
            <path d="M550 100 Q600 80 650 100 T750 100" stroke="white" strokeOpacity="0.1" strokeWidth="2" fill="none" />
            <circle cx="580" cy="140" r="3" fill="white" fillOpacity="0.2" />
            <circle cx="620" cy="160" r="2" fill="white" fillOpacity="0.15" />
            <circle cx="660" cy="170" r="4" fill="white" fillOpacity="0.1" />
          </svg>
        </div>
        
        <div className="relative flex items-center justify-between z-10">
          <div className="text-white">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Puzzle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold">{t('Premium Addons')}</h3>
            </div>
            <p className="text-white/90 mb-3">{t('Supercharge your platform with powerful extensions')}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">
                  {t('Available')}: <span className="font-semibold">{addons.total || 0}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                <span className="text-sm">
                  {t('Installed')}: <span className="font-semibold">{addons.data?.filter((addon: any) => addon.is_purchased).length || 0}</span>
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3 text-lg shadow-lg"
            onClick={() => window.open('https://workdo.io/product-category/vcard-saas-add-ons/?utm_source=demo&utm_medium=vcard&utm_campaign=btn', '_blank')}
          >
            <Puzzle className="h-5 w-5 mr-2" />
            {t('Explore Addons')}
          </Button>
        </div>
      </div>

      {/* Search and filters section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4">
        <div className="p-4">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            onSearchChange={(value) => setSearchTerm(value)}
            onSearch={handleSearch}
            filters={filterOptions}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            onResetFilters={handleResetFilters}
            currentPerPage={currentPerPage.toString()}
            onPerPageChange={(value) => {
              const params: any = { page: 1, per_page: parseInt(value) };
              
              if (searchTerm) {
                params.search = searchTerm;
              }
              
              Object.entries(filterValues).forEach(([key, val]) => {
                if (val && val !== 'all') {
                  params[key] = val;
                }
              });
              
              router.get(route('addons.index'), params, { preserveState: true, preserveScroll: true });
            }}
            perPageOptions={[18, 36, 72, 144]}
          />
        </div>
      </div>

      {/* Addons grid section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        {addons.data.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {addons.data.map((addon: Addon, index: number) => (
                <Card key={`addon-${addon.id}-${index}`} className="group relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Status Badge - Top Left */}
                  <div className="absolute top-3 left-3 z-10">
                    {getStatusBadge(addon)}
                  </div>
                  
                  {/* Three Dots Menu - Top Right - Only show if addons exist and addon is purchased */}
                  {addons.data.length > 0 && addon.is_purchased && (
                    <div className="absolute top-3 right-3 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreVertical className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleToggleStatus(addon)}>
                            <Power className="h-4 w-4 mr-2" />
                            {addon.is_enabled ? t('Disable') : t('Enable')}
                          </DropdownMenuItem>
                          {addon.is_enabled && (
                            <DropdownMenuItem onClick={() => handleMarketplaceSetting(addon)}>
                              <Settings className="h-4 w-4 mr-2" />
                              {t('Marketplace')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleRemoveAddon(addon)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('Remove')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2 pt-4 sm:pb-3 sm:pt-6">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                      <div className="w-12 h-12 sm:w-12 sm:h-12 flex items-center justify-center text-3xl sm:text-4xl overflow-hidden mb-1">
                        {getCategoryIcon(addon).startsWith('http') ? (
                          <img 
                            src={getCategoryIcon(addon)} 
                            alt={addon.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<span>📦</span>';
                              }
                            }}
                          />
                        ) : (
                          <span>{getCategoryIcon(addon)}</span>
                        )}
                      </div>
                      <div className="text-center space-y-1">
                        <CardTitle className="text-xs sm:text-sm font-bold line-clamp-2 text-gray-900 dark:text-white">
                          {addon.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                          v{addon.version} • {addon.category}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-2 pb-2 sm:px-4">
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-3 text-center leading-relaxed">
                      {addon.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="px-2 pb-3 pt-2 sm:px-4 sm:pb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs h-7 sm:h-8 border-gray-200 hover:border-primary hover:bg-primary/10 hover:text-primary"
                      onClick={() => handlePreview(addon)}
                    >
                      <Eye className="h-3 w-3 sm:mr-1" />
                      <span className="hidden sm:inline">{t('Preview')}</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Puzzle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t('No addons found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {hasActiveFilters() 
                ? t('Try adjusting your search or filters to find what you\'re looking for.')
                : t('There are no addons available at the moment.')
              }
            </p>
            {hasActiveFilters() && (
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="mt-4"
              >
                {t('Clear filters')}
              </Button>
            )}
          </div>
        )}

        {/* Pagination section */}
        {addons.data.length > 0 && (
          <Pagination
            from={addons.from || 0}
            to={addons.to || 0}
            total={addons.total}
            links={addons.links}
            entityName="addons"
            onPageChange={(url) => router.get(url, {}, { preserveState: true, preserveScroll: true })}
            className="border-t dark:border-gray-700"
          />
        )}
      </div>
      
      <AddonUploadModal 
        open={showUploadModal} 
        onOpenChange={setShowUploadModal} 
      />
      
      <CrudDeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAddonToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={addonToDelete?.name || ''}
        entityName="addon"
      />
    </PageTemplate>
  );
}