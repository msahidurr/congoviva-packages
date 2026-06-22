import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Plus, MessageSquare, Trash2, Eye } from 'lucide-react';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { ContactReplyModal } from '@/components/ContactReplyModal';
import { Dialog } from '@/components/ui/dialog';
import View from './View';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function Contacts() {
  const { t } = useTranslation();
  const { auth, contacts, businesses, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  
  // State
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedBusiness, setSelectedBusiness] = useState(pageFilters.business || 'all');
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  
  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedBusiness !== 'all' || selectedStatus !== 'all' || searchTerm !== '';
  };
  
  // Count active filters
  const activeFilterCount = () => {
    return (selectedBusiness !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
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
    
    if (selectedBusiness !== 'all') {
      params.business = selectedBusiness;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('contacts.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleBusinessFilter = (value: string) => {
    setSelectedBusiness(value);
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (value !== 'all') {
      params.business = value;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('contacts.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    
    const params: any = { page: 1 };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedBusiness !== 'all') {
      params.business = selectedBusiness;
    }
    
    if (value !== 'all') {
      params.status = value;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('contacts.index'), params, { preserveState: true, preserveScroll: true });
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
    
    if (selectedBusiness !== 'all') {
      params.business = selectedBusiness;
    }
    
    if (selectedStatus !== 'all') {
      params.status = selectedStatus;
    }
    
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }
    
    router.get(route('contacts.index'), params, { preserveState: true, preserveScroll: true });
  };
  
  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);
    
    switch (action) {
      case 'view':
        setIsViewModalOpen(true);
        break;
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
    setSelectedBusiness('all');
    setSelectedStatus('all');
    setSearchTerm('');
    setShowFilters(false);
    
    router.get(route('contacts.index'), { 
      page: 1, 
      per_page: pageFilters.per_page 
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions = [];
  
  pageActions.push({
    label: 'Create Contact',
    icon: <Plus className="h-4 w-4 mr-2" />,
    variant: 'default',
    onClick: () => handleAddNew()
  });

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Contacts') }
  ];

  // Check if user is super admin
  const isSuperAdmin = auth?.user?.role === 'super_admin';

  // Define table columns
  const columns = [
    ...(!isSuperAdmin ? [{ 
      key: 'business.name', 
      label: t('Business Name'), 
      sortable: false,
      render: (value: any, row: any) => row.business?.name || 'N/A'
    }] : []),
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
    ...(!isSuperAdmin ? [{ 
      key: 'phone', 
      label: t('Phone'),
      render: (value: string) => value || 'N/A'
    }] : []),
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
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    }
  ];

  // Define table actions
  const actions = [
    { 
      label: t('View'), 
      icon: 'Eye', 
      action: 'view', 
      className: 'text-green-500',
      permission: 'view-contacts'
    },
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
      title={t("Contacts")} 
      url="/contacts"
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
              name: 'business',
              label: t('Business'),
              type: 'select',
              value: selectedBusiness,
              onChange: handleBusinessFilter,
              options: [
                { value: 'all', label: t('All Businesses') },
                ...(businesses || []).map((business: any) => ({
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
              onChange: handleStatusFilter,
              options: [
                { value: 'all', label: t('All Statuses') },
                { value: 'new', label: t('New') },
                { value: 'contacted', label: t('Contacted') },
                { value: 'qualified', label: t('Qualified') },
                { value: 'converted', label: t('Converted') },
                { value: 'closed', label: t('Closed') }
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
            
            if (selectedBusiness !== 'all') {
              params.business = selectedBusiness;
            }
            
            if (selectedStatus !== 'all') {
              params.status = selectedStatus;
            }
            
            router.get(route('contacts.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={contacts?.data || []}
          from={contacts?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={permissions}
          entityPermissions={{
            view: 'view-contacts',
            create: 'create-contacts',
            edit: 'edit-contacts',
            delete: 'delete-contacts'
          }}
        />

        {/* Pagination section */}
        <Pagination
          from={contacts?.from || 0}
          to={contacts?.to || 0}
          total={contacts?.total || 0}
          links={contacts?.links}
          entityName={t("contacts")}
          onPageChange={(url) => router.get(url)}
        />
      </div>

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        formConfig={{
          fields: [
            ...(!isSuperAdmin ? [{ 
              name: 'business_id', 
              label: t('Business'), 
              type: 'select', 
              required: true,
              options: businesses ? businesses.map((business: any) => ({
                value: business.id.toString(),
                label: business.name
              })) : []
            }] : []),
            { name: 'name', label: t('Name'), type: 'text', placeholder: t('Enter contact name'), required: true },
            { name: 'email', label: t('Email'), type: 'email', placeholder: t('Enter email address') },
            ...(!isSuperAdmin ? [{ name: 'phone', label: t('Phone'), type: 'text', placeholder: t('Enter phone number') }] : []),
            { name: 'message', label: t('Message'), type: 'textarea' , placeholder: t('Enter message') },
            { 
              name: 'status', 
              label: t('Status'), 
              type: 'select', 
              required: true,
              options: [
                { value: 'new', label: t('New') },
                { value: 'contacted', label: t('Contacted') },
                { value: 'qualified', label: t('Qualified') },
                { value: 'converted', label: t('Converted') },
                { value: 'closed', label: t('Closed') }
              ]
            },
            ...(!isSuperAdmin ? [{ name: 'notes', label: t('Notes'), type: 'textarea', placeholder: t('Enter notes') }] : [])
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

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        {currentItem && <View contact={currentItem} />}
      </Dialog>

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