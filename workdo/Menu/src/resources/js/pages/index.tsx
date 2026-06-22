import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Share2, MoreVertical, BarChart3, Utensils } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { QRCodeModal } from '@/components/QRCodeModal';
import { ShareModal } from '@/components/ShareModal';

interface MenuItem {
  id: number;
  name: string;
  slug: string;
  menu_type: string;
  qr_code_path: string;
  qr_code_url: string;
  public_url: string;
  config_sections: any;
  is_active: boolean;
  created_at: string;
}

interface Props {
  menus: {
    data: MenuItem[];
    links?: any[];
    from?: number;
    to?: number;
    total?: number;
  };
  filters?: {
    search?: string;
    per_page?: string;
    view?: string;
  };
}

export default function MenuIndex({ menus = { data: [] }, filters = {} }: Props) {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [activeView, setActiveView] = useState(() => {
    try {
      return filters.view || (typeof localStorage !== 'undefined' ? localStorage.getItem('menu-view') : null) || 'list';
    } catch (error) {
      return 'list';
    }
  });
  
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);
  
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined' && activeView) {
        localStorage.setItem('menu-view', activeView);
      }
    } catch (error) {
      console.error('Error saving view preference:', error);
    }
  }, [activeView]);
  
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  
  const handleDeleteClick = (item: MenuItem) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!currentItem) return;
    
    toast.loading(t('Deleting Menu...'));
    
    router.delete(route('menu.destroy', currentItem.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleCopyLink = (item: MenuItem) => {
      const url = `${window.appSettings.baseUrl}/menu-qr/${item.slug}`;
      const copyToClipboard = (text: string) => {
        if (navigator.clipboard && window.isSecureContext) {
          return navigator.clipboard.writeText(text);
        } else {
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
  
  const handleShowQRCode = (item: MenuItem) => {
    setCurrentItem(item);
    const url = `${window.appSettings.baseUrl}/menu-qr/${item.slug}`;
    setShareUrl(url);
    setIsQRCodeModalOpen(true);
  };
  
  const handleShowShareModal = (item: MenuItem) => {
    setCurrentItem(item);
    const url = `${window.appSettings.baseUrl}/menu-qr/${item.slug}`;
    setShareUrl(url);
    setIsShareModalOpen(true);
  };

  const hasActiveFilters = () => searchTerm !== '';
  const activeFilterCount = () => searchTerm ? 1 : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = () => {
    const params: any = { page: 1 };
    if (searchTerm) params.search = searchTerm;
    if (filters.per_page) params.per_page = filters.per_page;
    params.view = activeView;
    router.get(route('menu.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setShowFilters(false);
    router.get(route('menu.index'), { 
      page: 1, 
      per_page: filters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
  };

  const pageActions = [
    {
      label: t('Create New Menu'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => router.get(route('menu.create'))
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Menu') }
  ];

  const columns = [
    { 
      key: 'name', 
      label: t('Name'),
      render: (value: any, item: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
                      <Utensils className="w-5 h-5" />
                    </div>
          <div className="ml-4">
            <Link href={route('menu.edit', item.id)} className="hover:underline">
              <div className="text-sm font-medium text-primary cursor-pointer hover:text-primary/80">{item.name}</div>
            </Link>
            <div className="text-sm text-gray-500">{item.menu_type}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: t('Created'),
      render: (value: string) => (
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
      title={t("Menu")} 
      url={route('menu.index')}
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          filters={[]}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onResetFilters={handleResetFilters}
          onApplyFilters={applyFilters}
          currentPerPage={filters.per_page?.toString() || "10"}
          onPerPageChange={(value) => {
            const params: any = { page: 1, per_page: parseInt(value) };
            if (searchTerm) params.search = searchTerm;
            params.view = activeView;
            router.get(route('menu.index'), params, { preserveState: true, preserveScroll: true });
          }}
          showViewToggle={true}
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            const params: any = { view };
            if (searchTerm) params.search = searchTerm;
            if (filters.per_page) params.per_page = filters.per_page;
            router.get(route('menu.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {!menus || !menus.data || menus.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t("You haven't created any Menu yet.")}
          </p>
          <Link href={route('menu.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("Create Your First Menu")}
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
                    <th key={column.key} className="px-4 py-3 text-left font-medium text-gray-500">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-medium text-gray-500">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {menus.data.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${item.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(item[column.key], item) : item[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={`${window.appSettings.baseUrl}/menu-qr/${item.slug}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>{t("Preview")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" onClick={() => handleShowShareModal(item)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Share")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" onClick={() => handleCopyLink(item)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Copy Link")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-indigo-500 hover:text-indigo-700" onClick={() => handleShowQRCode(item)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("QR Code")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('menu.analytics', item.id)}>
                              <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700">
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>{t("Analytics")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('menu.edit', item.id)}>
                              <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>{t("Edit")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(item)}>
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
          
          <Pagination
            from={menus?.from || 0}
            to={menus?.to || 0}
            total={menus?.total || 0}
            links={menus?.links}
            entityName={t("Menu items")}
            onPageChange={(url) => {
              if (!url) return;
              const urlObj = new URL(url, window.appSettings.baseUrl);
              const page = urlObj.searchParams.get('page');
              const params: any = { page, view: activeView };
              if (searchTerm) params.search = searchTerm;
              if (filters.per_page) params.per_page = filters.per_page;
              router.get(route('menu.index'), params, { preserveState: true });
            }}
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {menus.data.map((item) => (
              <Card key={item.id} className="group bg-white overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-30 relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  
                  {new Date(item.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-lg z-10">
                      {t("New")}
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 p-0">
                          <MoreVertical className="h-4 w-4 text-white" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56" sideOffset={5}>
                        <DropdownMenuItem onClick={() => handleCopyLink(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          <span>{t("Copy Link")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowShareModal(item)}>
                          <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{t("Share")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowQRCode(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                          <span>{t("QR Code")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('menu.analytics', item.id))}>
                          <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                          <span>{t("Analytics")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(item)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>{t("Delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <Link href={route('menu.edit', item.id)}>
                      <h3 className="text-lg font-bold text-white truncate drop-shadow-md hover:underline cursor-pointer">{item.name}</h3>
                    </Link>
                    <p className="text-sm text-white/80 truncate">{t("Menu")}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="font-medium">{item.menu_type}</Badge>
                    <p className="text-xs text-gray-500">{t("Created")} {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(item.created_at, false) : new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <Link href={route('menu.edit', item.id)} className="col-span-1">
                      <Button variant="default" className="w-full h-9 bg-amber-500 hover:bg-amber-600">
                        <Edit className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                    </Link>
                    
                    <a href={`${window.appSettings.baseUrl}/menu-qr/${item.slug}`} target="_blank" rel="noopener noreferrer" className="col-span-1">
                      <Button variant="outline" className="w-full h-9 border-blue-500 text-blue-600 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-2" />
                        {t("Preview")}
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
            <Pagination
              from={menus?.from || 0}
              to={menus?.to || 0}
              total={menus?.total || 0}
              links={menus?.links}
              entityName={t("Menus")}
              onPageChange={(url) => {
                if (!url) return;
                const urlObj = new URL(url, window.appSettings.baseUrl);
                const page = urlObj.searchParams.get('page');
                const params: any = { page, view: activeView };
                if (searchTerm) params.search = searchTerm;
                if (filters.per_page) params.per_page = filters.per_page;
                router.get(route('menu.index'), params, { preserveState: true });
              }}
            />
          </div>
        </div>
      )}
      
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName={t("Menu")}
      />
      
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        url={shareUrl}
        title={currentItem?.name || 'Menu'}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
        title={currentItem?.name || 'Menu'}
      />
    </PageTemplate>
  );
}