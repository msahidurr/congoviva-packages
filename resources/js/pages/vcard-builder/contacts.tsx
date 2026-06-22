import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, Plus, MessageSquare, Trash2, ArrowLeft } from 'lucide-react';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { ContactReplyModal } from '@/components/ContactReplyModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function VCardContacts() {
  const { t } = useTranslation();
  const { business, contacts, filters: pageFilters = {} } = usePage().props as any;
  
  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedStatus !== 'all' || searchTerm !== '';
  };
  
  // Count active filters
  const activeFilterCount = () => {
    return (selectedStatus !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const applyFilters = () => {
    const params: any = { 
      page: 1
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('vcard-builder.contacts', business.slug), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    
    const params: any = { 
      page: 1
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (value !== 'all') {
      params.status = value;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('vcard-builder.contacts', business.slug), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';
    
    const params: any = { 
      sort_field: field, 
      sort_direction: direction, 
      page: 1
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('vcard-builder.contacts', business.slug), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);
    
    switch (action) {
      case 'reply':
        if (!item.email) {
          toast.error('Contact has no email address');
          return;
        }
        setIsReplyModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };
  
  const handleAddNew = () => {
    setCurrentItem(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };
  
  const handleFormSubmit = (formData: any) => {
    formData.business_id = business.id;
    
    if (formMode === 'create') {
      toast.loading(t('Creating contact...'));
      
      router.post(route('contacts.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Contact created successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create contact: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating contact...'));
      
      router.put(route('contacts.update', currentItem.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Contact updated successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update contact: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };
  
  const handleReplySubmit = (replyData: any) => {
    toast.loading('Sending reply...');
    
    router.post(route('contacts.reply', currentItem.id), replyData, {
      onSuccess: () => {
        setIsReplyModalOpen(false);
        setCurrentItem(null);
        toast.dismiss();
        toast.success('Reply sent successfully');
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to send reply: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleReplyModalClose = () => {
    setIsReplyModalOpen(false);
    setCurrentItem(null);
  };
  
  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting contact...'));
    
    router.delete(route('contacts.destroy', currentItem.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Contact deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete contact: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSearchTerm('');
    setShowFilters(false);
    
    router.get(route('vcard-builder.contacts', business.slug), { 
      page: 1, 
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions = [
    {
      label: 'Back to Businesses',
      icon: <ArrowLeft className="h-4 w-4 mr-2" />,
      variant: 'outline' as const,
      onClick: () => router.get(route('vcard-builder.index'))
    },
    {
      label: 'Create Contact',
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default' as const,
      onClick: () => handleAddNew()
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('vCard Builder'), href: route('vcard-builder.index') },
    { title: business?.name || 'Business', href: route('vcard-builder.edit', business?.id) },
    { title: t('Contacts') }
  ];

  // Define table columns
  const columns = [
    { 
      key: 'name', 
      label: t('Name'), 
      sortable: true
    },
    { 
      key: 'email', 
      label: t('Email'), 
      sortable: true,
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'phone', 
      label: t('Phone'),
      render: (value: string) => value || 'N/A'
    },
    { 
      key: 'message', 
      label: t('Message'),
      render: (value: string) => {
        if (!value) return 'N/A';
        return value.length > 50 ? `${value.substring(0, 50)}...` : value;
      }
    },
    { 
      key: 'status', 
      label: t('Status'), 
      sortable: true,
      render: (value: string) => {
        const statusColors = {
          'new': 'bg-blue-100 text-blue-800',
          'contacted': 'bg-yellow-100 text-yellow-800',
          'qualified': 'bg-purple-100 text-purple-800',
          'converted': 'bg-green-100 text-green-800',
          'closed': 'bg-gray-100 text-gray-800'
        };
        
        return (
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10 ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    }
  ];

  // Define table actions
  const actions = [
    { 
      label: t('Reply'), 
      icon: 'MessageSquare', 
      action: 'reply', 
      className: 'text-blue-500'
    },
    { 
      label: t('Delete'), 
      icon: 'Trash2', 
      action: 'delete', 
      className: 'text-red-500'
    }
  ];

  return (
    <PageTemplate 
      title={`${business?.name} - ${t("Contacts")}`}
      url={route('vcard-builder.contacts', business?.slug)}
      actions={pageActions}
      breadcrumbs={breadcrumbs}
      noPadding
    >
      {/* Search and filters section */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Search contacts...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4 mr-1.5" />
                  {t("Search")}
                </Button>
              </form>
              
              <div className="ml-2">
                <Button 
                  variant={hasActiveFilters() ? "default" : "outline"}
                  size="sm" 
                  className="h-8 px-2 py-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  {showFilters ? 'Hide Filters' : 'Filters'}
                  {hasActiveFilters() && (
                    <span className="ml-1 bg-primary-foreground text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {activeFilterCount()}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground">{t("Per Page:")}</Label>
              <Select 
                value={pageFilters.per_page?.toString() || "10"} 
                onValueChange={(value) => {
                  const params: any = { 
                    page: 1, 
                    per_page: parseInt(value)
                  };
                  
                  if (searchTerm) {
                    params.search = searchTerm;
                  }
                  
                  if (selectedStatus !== 'all') {
                    params.status = selectedStatus;
                  }
                  
                  router.get(route('vcard-builder.contacts', business.slug), params, { preserveState: true, preserveScroll: true });
                }}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {showFilters && (
            <div className="w-full mt-3 p-4 bg-gray-50 border rounded-md">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <Label>{t("Status")}</Label>
                  <Select 
                    value={selectedStatus} 
                    onValueChange={handleStatusFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t("All Statuses")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Statuses")}</SelectItem>
                      <SelectItem value="new">{t("New")}</SelectItem>
                      <SelectItem value="contacted">{t("Contacted")}</SelectItem>
                      <SelectItem value="qualified">{t("Qualified")}</SelectItem>
                      <SelectItem value="converted">{t("Converted")}</SelectItem>
                      <SelectItem value="closed">{t("Closed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-9"
                  onClick={handleResetFilters}
                  disabled={!hasActiveFilters()}
                >
                  {t("Reset Filters")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={contacts?.data || []}
          from={contacts?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={[]}
          entityPermissions={{
            view: 'view-contacts',
            create: 'create-contacts',
            edit: 'edit-contacts',
            delete: 'delete-contacts'
          }}
        />

        {/* Pagination section */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {t("Showing")} <span className="font-medium">{contacts?.from || 0}</span> {t("to")} <span className="font-medium">{contacts?.to || 0}</span> {t("of")} <span className="font-medium">{contacts?.total || 0}</span> {t("contacts")}
          </div>
          
          <div className="flex gap-1">
            {contacts?.links?.map((link: any, i: number) => {
              const isTextLink = link.label === "&laquo; Previous" || link.label === "Next &raquo;";
              const label = link.label.replace("&laquo; ", "").replace(" &raquo;", "");
              
              return (
                <Button
                  key={i}
                  variant={link.active ? 'default' : 'outline'}
                  size={isTextLink ? "sm" : "icon"}
                  className={isTextLink ? "px-3" : "h-8 w-8"}
                  disabled={!link.url}
                  onClick={() => {
                    if (link.url) {
                      router.get(link.url);
                    }
                  }}
                >
                  {isTextLink ? label : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'message', label: 'Message', type: 'textarea' },
            { 
              name: 'status', 
              label: 'Status', 
              type: 'select', 
              required: true,
              options: [
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'converted', label: 'Converted' },
                { value: 'closed', label: 'Closed' }
              ]
            },
            { name: 'notes', label: 'Notes', type: 'textarea' }
          ],
          modalSize: 'lg'
        }}
        initialData={currentItem}
        title={
          formMode === 'create' 
            ? t('Create Contact') 
            : formMode === 'edit' 
              ? t('Edit Contact') 
              : t('View Contact')
        }
        mode={formMode}
      />

      {/* Reply Modal */}
      <ContactReplyModal
        isOpen={isReplyModalOpen}
        onClose={handleReplyModalClose}
        onSubmit={handleReplySubmit}
        contact={currentItem}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="contact"
      />
    </PageTemplate>
  );
}