import { useState, useMemo } from 'react';
import React from 'react';
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
import { Filter, Search, Plus, Edit, Trash2, LayoutGrid, List, Power, PowerOff, Nfc } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/ui/date-picker';
import { CrudFormModal } from '@/components/CrudFormModal';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';



export default function NfcCards() {
  const { t } = useTranslation();
  const { auth, nfcCards, filters: pageFilters = {}, isAdmin = false, businesses = [] } = usePage().props as any;
  const [orderQuantity, setOrderQuantity] = useState<{[key: number]: number}>({});
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  

  
  // State
  // Make sure we initialize the view from URL parameters
  const [activeView, setActiveView] = useState(pageFilters.view || 'grid');
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [startDate, setStartDate] = useState<Date | undefined>(pageFilters.start_date ? new Date(pageFilters.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(pageFilters.end_date ? new Date(pageFilters.end_date) : undefined);
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentNfcCard, setCurrentNfcCard] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedStatus !== 'all' || searchTerm !== '' || startDate !== undefined || endDate !== undefined;
  };
  
  // Count active filters
  const activeFilterCount = () => {
    return (selectedStatus !== 'all' ? 1 : 0) + 
           (searchTerm ? 1 : 0) + 
           (startDate ? 1 : 0) + 
           (endDate ? 1 : 0);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = () => {
    const params: any = { page: 1, view: activeView };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (startDate) {
      params.start_date = startDate.toISOString().split('T')[0];
    }
    
    if (endDate) {
      params.end_date = endDate.toISOString().split('T')[0];
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('nfc-cards.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    
    const params: any = { page: 1, view: activeView };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (value !== 'all') {
      params.status = value;
    }
    
    if (startDate) {
      params.start_date = startDate.toISOString().split('T')[0];
    }
    
    if (endDate) {
      params.end_date = endDate.toISOString().split('T')[0];
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('nfc-cards.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';
    
    const params: any = { 
      sort_field: field, 
      sort_direction: direction, 
      page: 1,
      view: activeView
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (startDate) {
      params.start_date = startDate.toISOString().split('T')[0];
    }
    
    if (endDate) {
      params.end_date = endDate.toISOString().split('T')[0];
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('nfc-cards.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleAction = (action: string, nfcCard: any) => {
    setCurrentNfcCard(nfcCard);
    
    switch (action) {
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(nfcCard);
        break;
      default:
        break;
    }
  };
  
  const handleAddNew = () => {
    setCurrentNfcCard(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };
  
  const handleOrderRequest = (nfcCard: any) => {
    setSelectedCard(nfcCard);
    setOrderQuantity(prev => ({ ...prev, [nfcCard.id]: 1 }));
    setOrderModalOpen(true);
  };
  
  const submitOrderRequest = (formData: any) => {
    const quantity = formData.quantity || 1;
    const totalPrice = selectedCard.price * quantity;
    
    const submitData = new FormData();
    submitData.append('nfc_card_id', selectedCard.id.toString());
    submitData.append('quantity', quantity.toString());
    if (formData.logo) submitData.append('logo', formData.logo);
    if (formData.shipping_address) submitData.append('shipping_address', formData.shipping_address);
    if (formData.business_id) submitData.append('business_id', formData.business_id);
    
    router.post(route('nfc-cards.order-request'), submitData, {
      onSuccess: (page) => {
        setOrderModalOpen(false);
        setSelectedCard(null);
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        const errorMessage = Object.values(errors).flat().join(', ');
        toast.error(errorMessage || t('Failed to submit order request'));
      }
    });
  };
  
  const handleFormSubmit = (formData: any) => {
    // Ensure required fields are present
    const submitData = {
      name: formData.name || currentNfcCard?.name || '',
      price: formData.price || currentNfcCard?.price || 0,
      quantity: formData.quantity || currentNfcCard?.quantity || 0,
      is_enabled: formData.is_enabled !== undefined ? formData.is_enabled : (currentNfcCard?.is_enabled || true),
      ...(formData.front_image && { front_image: formData.front_image }),
      ...(formData.back_image && { back_image: formData.back_image })
    };

    if (formMode === 'create') {
      toast.loading(t('Creating NFC card...'));
      
      router.post(route('nfc-cards.store'), submitData, {
        onSuccess: (page) => {
          setIsFormModalOpen(false);
          toast.dismiss();
          if (page.props?.flash?.success) {
            toast.success(page.props.flash.success);
          }
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create NFC card: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating NFC card...'));
      
      router.post(route("nfc-cards.update", currentNfcCard.id), {
        ...submitData,
        _method: 'PUT'
      }, {
        onSuccess: (page) => {
          setIsFormModalOpen(false);
          toast.dismiss();
          if (page.props?.flash?.success) {
            toast.success(page.props.flash.success);
          }
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update NFC card: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };
  
  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting NFC card...'));
    
    router.delete(route("nfc-cards.destroy", currentNfcCard.id), {
      onSuccess: (page) => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete NFC card: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleToggleStatus = (nfcCard: any) => {
    toast.loading(t('Updating status...'));
    
    router.put(route('nfc-cards.toggle-status', nfcCard.id), {}, {
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
  

  
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);
    
    router.get(route('nfc-cards.index'), { 
      page: 1, 
      per_page: pageFilters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
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

  // NFC Card global toggle (super admin only)
  const { nfcCardSettings } = usePage().props as any;
  const [nfcEnabled, setNfcEnabled] = useState(nfcCardSettings?.is_enabled !== false);
  
  const handleNfcToggle = (enabled: boolean) => {
    setNfcEnabled(enabled);
    toast.loading(t('Updating NFC cards setting...'));
    
    router.post(route('nfc-cards.toggle-global'), {
      is_enabled: enabled
    }, {
      preserveState: false,
      replace: true,
      onSuccess: (page) => {
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        } else if (page.props?.flash?.error) {
          setNfcEnabled(!enabled);
          toast.error(page.props.flash.error);
        }
      },
      onError: () => {
        toast.dismiss();
        setNfcEnabled(!enabled);
        toast.error(t('Failed to update NFC cards setting'));
      }
    });
  };

  // Define page actions
  const pageActions = [
    // Show global toggle for super admin only
    ...(isAdmin ? [{
      label: (
        <div className="flex items-center gap-2">
          <span className="text-sm">{t('Enable NFC Cards')}</span>
          <Switch
            checked={nfcEnabled}
            onCheckedChange={handleNfcToggle}
            size="sm"
          />
        </div>
      ),
      variant: 'ghost',
      onClick: () => {}
    }] : []),
    ...(isAdmin ? [{
      label: t('Create NFC Card'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => handleAddNew()
    }] : [])
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('NFC Cards') }
  ];

  // Define table columns for list view
  const columns = [
    { 
      key: 'name', 
      label: t('Name'), 
      sortable: true,
      render: (value: string, row: any) => (
        <div className="font-medium">{value}</div>
      )
    },
    { 
      key: 'price', 
      label: t('Price'),
      sortable: true,
      render: (value: number) => window.appSettings?.formatCurrency(value) || `$${parseFloat(value).toFixed(2)}`
    },
    { 
      key: 'quantity', 
      label: t('Quantity'),
      sortable: true,
      render: (value: number) => value.toString()
    },
    { 
      key: 'front_image', 
      label: t('Front Image'),
      render: (value: string) => {
        const imageUrl = getImageDisplayUrl(value);
        return imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Front" 
            className="h-10 w-10 object-cover rounded" 
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
            }}
          />
        ) : (
          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        );
      }
    },
    { 
      key: 'back_image', 
      label: t('Back Image'),
      render: (value: string) => {
        const imageUrl = getImageDisplayUrl(value);
        return imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Back" 
            className="h-10 w-10 object-cover rounded" 
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
            }}
          />
        ) : (
          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        );
      }
    },
    ...(isAdmin ? [{ 
      key: 'is_enabled', 
      label: t('Status'),
      render: (value: boolean, row: any) => (
        <Switch
          checked={value}
          onCheckedChange={() => handleAction('toggle-status', row)}
        />
      )
    }] : []),

  ];

  return (
    <PageTemplate 
      title={t("NFC Cards")} 
      url="/nfc-cards"
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
              name: 'status',
              label: t('Status'),
              type: 'select',
              value: selectedStatus,
              onChange: handleStatusFilter,
              options: [
                { value: 'all', label: t('All Status') },
                { value: 'enabled', label: t('Enabled') },
                { value: 'disabled', label: t('Disabled') }
              ]
            }] : []),
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
            const params: any = { page: 1, per_page: parseInt(value), view: activeView };
            
            if (searchTerm) {
              params.search = searchTerm;
            }
            
            if (selectedStatus !== 'all') {
              params.status = selectedStatus;
            }
            
            if (startDate) {
              params.start_date = startDate.toISOString().split('T')[0];
            }
            
            if (endDate) {
              params.end_date = endDate.toISOString().split('T')[0];
            }
            
            router.get(route('nfc-cards.index'), params, { preserveState: true, preserveScroll: true });
          }}
          showViewToggle={true}
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            
            // Update URL and reload with the new view parameter
            const params: any = { view };
            
            // Preserve other existing parameters
            if (searchTerm) params.search = searchTerm;
            if (selectedStatus !== 'all') params.status = selectedStatus;
            if (startDate) params.start_date = startDate.toISOString().split('T')[0];
            if (endDate) params.end_date = endDate.toISOString().split('T')[0];
            if (pageFilters.per_page) params.per_page = pageFilters.per_page;
            if (pageFilters.page) params.page = pageFilters.page;
            
            // Navigate with the updated parameters
            router.get(route('nfc-cards.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      {activeView === 'list' ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
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
                            {pageFilters.sort_field === column.key ? (
                              pageFilters.sort_direction === 'asc' ? '↑' : '↓'
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
                {(nfcCards?.data || nfcCards)?.map((nfcCard: any) => (
                  <tr key={nfcCard.id} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${nfcCard.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(nfcCard[column.key], nfcCard) : nfcCard[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      {isAdmin ? (
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleAction('edit', nfcCard)}
                                className="text-amber-500 hover:text-amber-700"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("Edit")}</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleAction('delete', nfcCard)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{t("Delete")}</TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleOrderRequest(nfcCard)}
                          size="sm"
                        >
                          {t('Order Request')}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {(!(nfcCards?.data || nfcCards) || (nfcCards?.data || nfcCards)?.length === 0) && (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                      {t("No NFC cards found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination section */}
          <Pagination
            from={nfcCards?.from || 0}
            to={nfcCards?.to || 0}
            total={nfcCards?.total || 0}
            links={nfcCards?.links}
            entityName={t("NFC cards")}
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
                if (selectedStatus !== 'all') params.status = selectedStatus;
                if (startDate) params.start_date = startDate.toISOString().split('T')[0];
                if (endDate) params.end_date = endDate.toISOString().split('T')[0];
                if (pageFilters.per_page) params.per_page = pageFilters.per_page;
                
                // Navigate with all parameters
                router.get(route('nfc-cards.index'), params, { preserveState: true });
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
            {(nfcCards?.data || nfcCards)?.map((nfcCard: any) => (
              <Card key={nfcCard.id} className="group relative rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{nfcCard.name}</h3>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={nfcCard.is_enabled}
                          onCheckedChange={() => handleAction('toggle-status', nfcCard)}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  {isAdmin && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t("Price")}:</span>
                        <span className="text-sm font-medium dark:text-gray-200">{window.appSettings?.formatCurrency(nfcCard.price) || `$${parseFloat(nfcCard.price).toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t("Quantity")}:</span>
                        <span className="text-sm font-medium dark:text-gray-200">{nfcCard.quantity}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="nfc-flip mb-4">
                    <div className="nfc-image-wrp h-48 w-full group-hover:[transform:rotateY(180deg)]" style={{transformStyle: 'preserve-3d', transition: 'transform 1s'}}>
                      <div className="nfc-front-image absolute inset-0" style={{backfaceVisibility: 'hidden'}}>
                        <div className="avatar-parent-child nfc-image w-full h-full">
                          {nfcCard.front_image ? (
                            <img 
                              src={getImageDisplayUrl(nfcCard.front_image)} 
                              alt="Front" 
                              className="w-full h-full object-cover rounded" 
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center rounded">
                              <div className="text-center text-gray-400">
                                <Nfc className="h-8 w-8 mx-auto mb-1" />
                                <p className="text-xs">No Front Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="nfc-back-image absolute inset-0" style={{backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                        <div className="avatar-parent-child nfc-image w-full h-full">
                          {nfcCard.back_image ? (
                            <img 
                              src={getImageDisplayUrl(nfcCard.back_image)} 
                              alt="Back" 
                              className="w-full h-full object-cover rounded" 
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center rounded">
                              <div className="text-center text-gray-400">
                                <Nfc className="h-8 w-8 mx-auto mb-1" />
                                <p className="text-xs">No Back Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction('edit', nfcCard)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        {t("Edit")}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAction('delete', nfcCard)}
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {t("Delete")}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary dark:text-primary-foreground">
                          {window.appSettings?.formatCurrency(nfcCard.price) || `$${parseFloat(nfcCard.price).toFixed(2)}`}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t('per card')}</div>
                      </div>
                      <Button 
                        onClick={() => handleOrderRequest(nfcCard)}
                        className="w-full"
                        size="sm"
                      >
                        {t('Order Request')}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
            
            {(!(nfcCards?.data || nfcCards) || (nfcCards?.data || nfcCards)?.length === 0) && (
              <div className="col-span-full p-8 text-center text-gray-500">
                {t("No NFC cards found")}
              </div>
            )}
          </div>
          
          {/* Pagination for grid view */}
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <Pagination
              from={nfcCards?.from || 0}
              to={nfcCards?.to || 0}
              total={nfcCards?.total || 0}
              links={nfcCards?.links}
              entityName={t("NFC cards")}
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
                  if (selectedStatus !== 'all') params.status = selectedStatus;
                  if (startDate) params.start_date = startDate.toISOString().split('T')[0];
                  if (endDate) params.end_date = endDate.toISOString().split('T')[0];
                  if (pageFilters.per_page) params.per_page = pageFilters.per_page;
                  
                  // Navigate with all parameters
                  router.get(route('nfc-cards.index'), params, { preserveState: true });
                } catch (error) {
                  console.error('Error parsing pagination URL:', error);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
      {isAdmin && (
        <CrudFormModal
          key={`admin-${currentNfcCard?.id || 'new'}`}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          formConfig={{
            fields: [
              { name: 'name', label: t('Name'), type: 'text', required: true, placeholder: t('Enter NFC card name') },
              { name: 'price', label: t('Price'), type: 'number', required: true, step: '0.01', min: '0', placeholder: t('Enter price') },
              { name: 'quantity', label: t('Quantity'), type: 'number', required: true, min: '0', placeholder: t('Enter quantity') },
              { 
                name: 'front_image', 
                label: t('Front Image'), 
                type: 'media-picker',
                placeholder: t('Select front image...')
              },
              { 
                name: 'back_image', 
                label: t('Back Image'), 
                type: 'media-picker',
                placeholder: t('Select back image...')
              },
              { name: 'is_enabled', label: t('Enable Card'), type: 'switch', defaultValue: true }
            ],
            modalSize: 'lg'
          }}
          initialData={currentNfcCard ? {
            ...currentNfcCard,
            price: parseFloat(currentNfcCard.price),
            quantity: parseInt(currentNfcCard.quantity),
            is_enabled: Boolean(currentNfcCard.is_enabled),
            front_image: currentNfcCard.front_image,
            back_image: currentNfcCard.back_image
          } : null}
          title={
            formMode === 'create' 
              ? t('Create NFC Card') 
              : formMode === 'edit' 
                ? t('Edit NFC Card') 
                : t('View NFC Card')
          }
          mode={formMode}
        />
      )}
      {/* Company Order Request Modal */}
      {!isAdmin && orderModalOpen && (
        <CrudFormModal
         key={`order-${currentNfcCard?.id || 'new'}`}
          isOpen={orderModalOpen}
          onClose={() => {
            setOrderModalOpen(false);
            setSelectedCard(null);
          }}
          onSubmit={submitOrderRequest}
          formConfig={{
            fields: [
              { name: 'quantity', label: t('Quantity'), type: 'number', required: true, min: '1', defaultValue: 1, placeholder: t('Enter quantity') }, 
              { name: 'logo', label: t('Logo'), type: 'file', accept: 'image/*', placeholder: t('Select logo image') }, 
              { name: 'shipping_address', label: t('Shipping Address'), type: 'textarea', placeholder: t('Enter shipping address') }, 
              { name: 'business_id', label: t('Business'),required: true, type: 'select', options: businesses?.map((b: any) => ({ value: b.id, label: b.name })) || [], placeholder: t('Select business') } 

            ],
            modalSize: 'lg',
            priceSummary: selectedCard ? {
              unitPrice: parseFloat(selectedCard.price),
              quantity: orderQuantity[selectedCard.id] || 1,
              quantityFieldName: 'quantity'
            } : undefined
          }}
          initialData={currentNfcCard ? {
            ...currentNfcCard,
            price: parseFloat(currentNfcCard.price),
            quantity: parseInt(currentNfcCard.quantity)
          } : null}
          title={selectedCard ? `${t('Order Request')} - ${selectedCard.name}` : t('Order Request')}
          mode={formMode}
        />
      )}

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentNfcCard?.name || ''}
        entityName="NFC card"
      />
      

    </PageTemplate>
  );
}
