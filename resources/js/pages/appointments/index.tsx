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
import { AppointmentReplyModal } from '@/components/AppointmentReplyModal';
import { Dialog } from '@/components/ui/dialog';
import View from './View';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function Appointments() {
  const { t } = useTranslation();
  const { auth, appointments, businesses, filters: pageFilters = {} } = usePage().props as any;
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

    router.get(route('appointments.index'), params, { preserveState: true, preserveScroll: true });
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

    router.get(route('appointments.index'), params, { preserveState: true, preserveScroll: true });
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

    router.get(route('appointments.index'), params, { preserveState: true, preserveScroll: true });
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

    router.get(route('appointments.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);

    switch (action) {
      case 'view':
        setIsViewModalOpen(true);
        break;
      case 'reply':
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
      toast.loading(t('Creating appointment...'));

      router.post(route('appointments.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Appointment created successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create appointment: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating appointment...'));

      router.put(route("appointments.update", currentItem.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Appointment updated successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update appointment: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting appointment...'));

    router.delete(route("appointments.destroy", currentItem.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Appointment deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete appointment: ${Object.values(errors).join(', ')}`);
      }
    });
  };
  
  const handleReplySubmit = (data: { notes: string; status: string }) => {
    toast.loading(t('Sending reply...'));
    
    router.post(route("appointments.reply", currentItem.id), data, {
      onSuccess: () => {
        setIsReplyModalOpen(false);
        toast.dismiss();
        toast.success(t('Reply sent successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to send reply: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleResetFilters = () => {
    setSelectedBusiness('all');
    setSelectedStatus('all');
    setSearchTerm('');
    setShowFilters(false);

    router.get(route('appointments.index'), {
      page: 1,
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions = [];

  pageActions.push({
    label: t('Create Appointment'),
    icon: <Plus className="h-4 w-4 mr-2" />,
    variant: 'default',
    onClick: () => handleAddNew()
  });

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Appointments') }
  ];

  // Define table columns
  const columns = [
    {
      key: 'business.name',
      label: t('Business Name'),
      sortable: false,
      render: (value: any, row: any) => row.business?.name || 'N/A'
    },
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
      key: 'appointment_date',
      label: t('Date & Time'),
      sortable: true,
      render: (value: any, row: any) => {
        if (!row.appointment_date) return 'N/A';

        try {
          const date = new Date(row.appointment_date).toISOString().split('T')[0];
          const time = row.appointment_time || '00:00';
          const dateTimeString = `${date} ${time}:00`;
          return window.appSettings?.formatDateTime(dateTimeString, true) || `${new Date(row.appointment_date).toLocaleDateString()} ${time}`;
        } catch (error) {
          return 'Invalid Date';
        }
      }
    },
    {
      key: 'status',
      label: t('Status'),
      sortable: true,
      render: (value: string) => {
        const statusColors = {
          'scheduled': 'bg-blue-100 text-blue-800',
          'confirmed': 'bg-green-100 text-green-800',
          'completed': 'bg-gray-100 text-gray-800',
          'cancelled': 'bg-red-100 text-red-800',
          'no_show': 'bg-orange-100 text-orange-800'
        };

        return (
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium  ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
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
      permission: 'view-appointments'
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
      title={t("Appointments")}
      url="/appointments"
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
                { value: 'scheduled', label: t('Scheduled') },
                { value: 'confirmed', label: t('Confirmed') },
                { value: 'completed', label: t('Completed') },
                { value: 'cancelled', label: t('Cancelled') },
                { value: 'no_show', label: t('No Show') }
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
            
            router.get(route('appointments.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={appointments?.data || []}
          from={appointments?.from || 1}
          onAction={handleAction}
          sortField={pageFilters.sort_field}
          sortDirection={pageFilters.sort_direction}
          onSort={handleSort}
          permissions={permissions}
          entityPermissions={{
            view: 'view-appointments',
            create: 'create-appointments',
            edit: 'edit-appointments',
            delete: 'delete-appointments'
          }}
        />

        {/* Pagination section */}
        <Pagination
          from={appointments?.from || 0}
          to={appointments?.to || 0}
          total={appointments?.total || 0}
          links={appointments?.links}
          entityName={t("appointments")}
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
            {
              name: 'business_id',
              label: t('Business'),
              type: 'select',
              required: true,
              options: businesses ? businesses.map((business: any) => ({
                value: business.id.toString(),
                label: business.name
              })) : []
            },
            { name: 'name', label: t('Name'), type: 'text', placeholder: t('Enter name'), required: true },
            { name: 'email', label: t('Email'), type: 'email', placeholder: t('Enter email address') },
            { name: 'phone', label: t('Phone'), type: 'text', placeholder: t('Enter phone number') },
            { name: 'appointment_date', label: t('Appointment Date'), type: 'date', required: true },
            { name: 'appointment_time', label: t('Appointment Time'), type: 'time', required: true },
            { name: 'message', label: t('Message'), type: 'textarea', placeholder: t('Enter message') },
            {
              name: 'status',
              label: t('Status'),
              type: 'select',
              required: true,
              options: [
                { value: 'scheduled', label: t('Scheduled') },
                { value: 'confirmed', label: t('Confirmed') },
                { value: 'completed', label: t('Completed') },
                { value: 'cancelled', label: t('Cancelled') },
                { value: 'no_show', label: t('No Show') }
              ]
            },
            { name: 'notes', label: t('Notes'), type: 'textarea', placeholder: t('Enter notes') }
          ],
          modalSize: 'lg'
        }}
        initialData={currentItem}
        title={
          formMode === 'create'
            ? t('Create Appointment')
            : formMode === 'edit'
              ? t('Edit Appointment')
              : t('View Appointment')
        }
        mode={formMode}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="appointment"
      />
      
      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        {currentItem && <View appointment={currentItem} />}
      </Dialog>
      
      {/* Reply Modal */}
      <AppointmentReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onSubmit={handleReplySubmit}
        appointment={currentItem}
      />
    </PageTemplate>
  );
}