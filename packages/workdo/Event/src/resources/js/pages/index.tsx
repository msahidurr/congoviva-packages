import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Share2, MoreVertical, BarChart3, Calendar, Copy } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';
import { QRCodeModal } from '@/components/QRCodeModal';
import { ShareModal } from '@/components/ShareModal';

interface Event {
  id: number;
  name: string;
  slug: string;
  event_type: string;
  qr_code_path: string;
  qr_code_url: string;
  public_url: string;
  config_sections: any;
  is_active: boolean;
  created_at: string;
}

interface Props {
  events: {
    data: Event[];
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

export default function EventIndex({ events = { data: [] }, filters = {} }: Props) {
  const { t } = useTranslation();
  const { flash } = usePage().props as any;
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [activeView, setActiveView] = useState(() => {
    try {
      return filters.view || (typeof localStorage !== 'undefined' ? localStorage.getItem('event-qr-view') : null) || 'list';
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
        localStorage.setItem('event-qr-view', activeView);
      }
    } catch (error) {
      console.error('Error saving view preference:', error);
    }
  }, [activeView]);
  
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  
  const handleDeleteClick = (event: Event) => {
    setCurrentEvent(event);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!currentEvent) return;
    
    toast.loading(t('Deleting Event...'));
    
    router.delete(route('event-qr-code.destroy', currentEvent.id), {
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
  
  const handleCopyLink = (event: Event) => {
      const url = `${window.appSettings.baseUrl}/event-qr/${event.slug}`;
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
  
  const handleShowQRCode = (event: Event) => {
    setCurrentEvent(event);
    const url = `${window.appSettings.baseUrl}/event-qr/${event.slug}`;
    setShareUrl(url);
    setIsQRCodeModalOpen(true);
  };
  
  const handleShowShareModal = (event: Event) => {
    setCurrentEvent(event);
    const url = `${window.appSettings.baseUrl}/event-qr/${event.slug}`;
    setShareUrl(url);
    setIsShareModalOpen(true);
  };

  const handleDuplicate = (event: Event) => {
    toast.loading(t('Duplicating Event...'));
    router.post(route('event-qr-code.duplicate', event.id), {}, {
      onSuccess: () => {
        toast.dismiss();
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to duplicate: ${Object.values(errors).join(', ')}`);
      }
    });
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
    router.get(route('event-qr-code.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setShowFilters(false);
    router.get(route('event-qr-code.index'), { 
      page: 1, 
      per_page: filters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
  };

  const pageActions = [
    {
      label: t('Create New Event'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => router.get(route('event-qr-code.create'))
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Event') }
  ];

  const columns = [
    { 
      key: 'name', 
      label: t('Event'),
      render: (value: any, event: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="ml-4">
            <Link href={route('event-qr-code.edit', event.id)} className="hover:underline">
              <div className="text-sm font-medium text-primary cursor-pointer hover:text-primary/80">{event.name}</div>
            </Link>
            <div className="text-sm text-gray-500">{event.event_type}</div>
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
            <Badge className="ml-2 bg-green-500">{t("New")}</Badge>
          )}
        </div>
      )
    }
  ];

  return (
    <PageTemplate 
      title={t("Event")} 
      url={route('event-qr-code.index')}
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
            router.get(route('event-qr-code.index'), params, { preserveState: true, preserveScroll: true });
          }}
          showViewToggle={true}
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            const params: any = { view };
            if (searchTerm) params.search = searchTerm;
            if (filters.per_page) params.per_page = filters.per_page;
            router.get(route('event-qr-code.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {!events || !events.data || events.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t("You haven't created any Events yet.")}
          </p>
          <Link href={route('event-qr-code.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t("Create Your First Event")}
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
                {events.data.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${event.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(event[column.key], event) : event[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={`${window.appSettings.baseUrl}/event-qr/${event.slug}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>{t("Preview")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" onClick={() => handleShowShareModal(event)}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Share")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700" onClick={() => handleCopyLink(event)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Copy Link")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-indigo-500 hover:text-indigo-700" onClick={() => handleShowQRCode(event)}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("QR Code")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('event-qr-code.analytics', event.id)}>
                              <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700">
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>{t("Analytics")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-purple-500 hover:text-purple-700" onClick={() => handleDuplicate(event)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Duplicate")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={route('event-qr-code.edit', event.id)}>
                              <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>{t("Edit")}</TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClick(event)}>
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
            from={events?.from || 0}
            to={events?.to || 0}
            total={events?.total || 0}
            links={events?.links}
            entityName={t("Events")}
            onPageChange={(url) => {
              if (!url) return;
              const urlObj = new URL(url, window.appSettings.baseUrl);
              const page = urlObj.searchParams.get('page');
              const params: any = { page, view: activeView };
              if (searchTerm) params.search = searchTerm;
              if (filters.per_page) params.per_page = filters.per_page;
              router.get(route('event-qr-code.index'), params, { preserveState: true });
            }}
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.data.map((event) => (
              <Card key={event.id} className="group bg-white overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-30 relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  
                  {new Date(event.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
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
                        <DropdownMenuItem onClick={() => handleCopyLink(event)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-blue-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                          <span>{t("Copy Link")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowShareModal(event)}>
                          <Share2 className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{t("Share")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowQRCode(event)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-indigo-500"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><rect width="5" height="5" x="16" y="16" rx="1"/></svg>
                          <span>{t("QR Code")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.get(route('event-qr-code.analytics', event.id))}>
                          <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                          <span>{t("Analytics")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(event)}>
                          <Copy className="h-4 w-4 mr-2 text-purple-500" />
                          <span>{t("Duplicate")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteClick(event)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>{t("Delete")}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <Link href={route('event-qr-code.edit', event.id)}>
                      <h3 className="text-lg font-bold text-white truncate drop-shadow-md hover:underline cursor-pointer">{event.name}</h3>
                    </Link>
                    <p className="text-sm text-white/80 truncate">{t("Event")}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="font-medium">{event.event_type}</Badge>
                    <p className="text-xs text-gray-500">{t("Created")} {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(event.created_at, false) : new Date(event.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-2 p-3">
                    <Link href={route('event-qr-code.edit', event.id)} className="col-span-1">
                      <Button variant="default" className="w-full h-9 bg-amber-500 hover:bg-amber-600">
                        <Edit className="h-4 w-4 mr-2" />
                        {t("Edit")}
                      </Button>
                    </Link>
                    
                    <a href={`${window.appSettings.baseUrl}/event-qr/${event.slug}`} target="_blank" rel="noopener noreferrer" className="col-span-1">
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
              from={events?.from || 0}
              to={events?.to || 0}
              total={events?.total || 0}
              links={events?.links}
              entityName={t("Events")}
              onPageChange={(url) => {
                if (!url) return;
                const urlObj = new URL(url, window.appSettings.baseUrl);
                const page = urlObj.searchParams.get('page');
                const params: any = { page, view: activeView };
                if (searchTerm) params.search = searchTerm;
                if (filters.per_page) params.per_page = filters.per_page;
                router.get(route('event-qr-code.index'), params, { preserveState: true });
              }}
            />
          </div>
        </div>
      )}
      
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentEvent?.name || ''}
        entityName={t("Event")}
      />
      
      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        url={shareUrl}
        title={currentEvent?.name || 'Event'}
      />
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
        title={currentEvent?.name || 'Event'}
      />
    </PageTemplate>
  );
}
