import { useState } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Trash2 } from 'lucide-react';
import { CrudTable } from '@/components/CrudTable';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

export default function NewslettersIndex() {
  const { t } = useTranslation();
  const { auth, newsletters, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];

  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    const params: any = { page: 1 };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('landing-page.newsletters.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);

    switch (action) {
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting newsletter...'));

    router.delete(route('landing-page.newsletters.destroy', currentItem.id), {
      onSuccess: (page) => {
        setIsDeleteModalOpen(false);
        setCurrentItem(null);
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete newsletter: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setShowFilters(false);

    router.get(route('landing-page.newsletters.index'), {
      page: 1,
      per_page: pageFilters.per_page
    }, { preserveState: true, preserveScroll: true });
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Landing Page'), href: route('landing-page.settings') },
    { title: t('Newsletters') }
  ];

  const columns = [
    {
      key: 'email',
      label: t('Email'),
      sortable: true
    },
    {
      key: 'subscribed_at',
      label: t('Subscribed'),
      sortable: true,
      render: (value: string) => {
        return window.superAdminSettings?.formatDateTime(value, false) ||
               window.appSettings?.formatDateTime(value, false) ||
               new Date(value).toLocaleDateString();
      }
    }
  ];

  const actions = [
    {
      label: t('Delete'),
      icon: 'Trash2',
      action: 'delete',
      className: 'text-red-500'
    }
  ];

  return (
    <PageTemplate
      title={t('Newsletters')}
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
          hasActiveFilters={() => searchTerm !== ''}
          activeFilterCount={() => (searchTerm ? 1 : 0)}
          onResetFilters={handleResetFilters}
          onApplyFilters={applyFilters}
          currentPerPage={pageFilters.per_page?.toString() || '10'}
          onPerPageChange={(value) => {
            const params: any = { page: 1, per_page: parseInt(value) };

            if (searchTerm) {
              params.search = searchTerm;
            }

            router.get(route('landing-page.newsletters.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <CrudTable
          columns={columns}
          actions={actions}
          data={newsletters?.data || []}
          from={newsletters?.from || 1}
          onAction={handleAction}
          permissions={permissions}
          entityPermissions={{
            view: 'manage-landing-page',
            create: 'manage-landing-page',
            edit: 'manage-landing-page',
            delete: 'manage-landing-page'
          }}
        />

        <Pagination
          from={newsletters?.from || 0}
          to={newsletters?.to || 0}
          total={newsletters?.total || 0}
          links={newsletters?.links}
          entityName={t('newsletters')}
          onPageChange={(url) => router.get(url)}
        />
      </div>

      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.email || ''}
        entityName="newsletter"
      />
    </PageTemplate>
  );
}
