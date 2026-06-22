// pages/companies/index.tsx
import { useState, useEffect } from 'react';
import { PageTemplate } from '@/components/page-template';
import { usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Filter, Search, Plus, Eye, Edit, Trash2, KeyRound, Lock, Unlock, LayoutGrid, List, ExternalLink, Info, ArrowUpRight, CreditCard, Copy, Check } from 'lucide-react';
import { toast } from '@/components/custom-toast';
import { useInitials } from '@/hooks/use-initials';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@/components/ui/date-picker';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { UpgradePlanModal } from '@/components/UpgradePlanModal';
import View from './View';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';


export default function Companies() {
  const { t } = useTranslation();
  const { auth, companies, plans, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const getInitials = useInitials();

  // Check if ChatGPT modal is open
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);

  useEffect(() => {
    const checkChatGpt = () => {
      const chatGptModal = document.querySelector('[data-chatgpt-modal]') ||
        document.querySelector('.chatgpt-modal') ||
        document.querySelector('[class*="chatgpt"]') ||
        document.querySelector('[id*="chatgpt"]');
      setIsChatGptOpen(!!chatGptModal);
    };

    const observer = new MutationObserver(checkChatGpt);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // State
  const [activeView, setActiveView] = useState(pageFilters.view || 'list');
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [startDate, setStartDate] = useState<Date | undefined>(pageFilters.start_date ? new Date(pageFilters.start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(pageFilters.end_date ? new Date(pageFilters.end_date) : undefined);
  const [selectedStatus, setSelectedStatus] = useState(pageFilters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [isBusinessLinkModalOpen, setIsBusinessLinkModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [businessLinks, setBusinessLinks] = useState<any[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);
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

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
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

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleSort = (field: string) => {
    const direction = pageFilters.sort_field === field && pageFilters.sort_direction === 'asc' ? 'desc' : 'asc';

    const params: any = {
      sort_field: field,
      sort_direction: direction,
      page: 1,
      view: activeView
    };

    // Add search and filters
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

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, company: any) => {
    setCurrentCompany(company);

    switch (action) {
      case 'login-as':
        router.get(route("impersonate.start", company.id));
        break;
      case 'company-info':
        setIsViewModalOpen(true);
        break;
      case 'upgrade-plan':
        handleUpgradePlan(company);
        break;
      case 'business-link':
        handleBusinessLink(company);
        break;
      case 'reset-password':
        setIsResetPasswordModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(company);
        break;
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleAddNew = () => {
    setCurrentCompany(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (formMode === 'create') {
      toast.loading(t('Creating company...'));

      router.post(route('companies.store'), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Company created successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create company: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating company...'));

      router.put(route('companies.update', currentCompany.id), formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
          toast.dismiss();
          toast.success(t('Company updated successfully'));
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update company: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting company...'));

    router.delete(route("companies.destroy", currentCompany.id), {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        toast.success(t('Company deleted successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete company: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleResetPasswordConfirm = (data: { password: string }) => {
    toast.loading(t('Resetting password...'));

    router.put(route('companies.reset-password', currentCompany.id), data, {
      onSuccess: () => {
        setIsResetPasswordModalOpen(false);
        toast.dismiss();
        toast.success(t('Password reset successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to reset password: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleToggleStatus = (company: any) => {
    toast.loading(t('Updating status...'));

    router.put(route('companies.toggle-status', company.id), {}, {
      onSuccess: () => {
        toast.dismiss();
        toast.success(t('Status updated successfully'));
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to update status: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handlePageChange = (url: string) => {
    const pageNum = new URL(url, window.location.origin).searchParams.get('page') || '1';
    const params: any = { page: pageNum, view: activeView };

    if (searchTerm) params.search = searchTerm;
    if (selectedStatus !== 'all') params.status = selectedStatus;
    if (startDate) params.start_date = startDate.toISOString().split('T')[0];
    if (endDate) params.end_date = endDate.toISOString().split('T')[0];
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    if (pageFilters.sort_field) params.sort_field = pageFilters.sort_field;
    if (pageFilters.sort_direction) params.sort_direction = pageFilters.sort_direction;

    router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setSearchTerm('');
    setStartDate(undefined);
    setEndDate(undefined);
    setShowFilters(false);

    router.get(route('companies.index'), {
      page: 1,
      per_page: pageFilters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
  };

  const handleUpgradePlan = (company: any) => {
    setCurrentCompany(company);

    // Fetch available plans (both monthly and yearly)
    toast.loading(t('Loading plans...'));
    fetch(route('companies.plans', company.id))
      .then(res => res.json())
      .then(data => {
        setAvailablePlans(data.plans || []);
        setIsUpgradePlanModalOpen(true);
        toast.dismiss();
      })
      .catch(err => {
        toast.dismiss();
        toast.error(t('Failed to load plans'));
      });
  };

  const handleUpgradePlanConfirm = (planId: number, duration: string) => {
    toast.loading(t('Upgrading plan...'));

    // Use Inertia router to handle the request
    router.put(route('companies.upgrade-plan', currentCompany.id), {
      plan_id: planId,
      duration: duration
    }, {
      onSuccess: () => {
        setIsUpgradePlanModalOpen(false);
        toast.dismiss();
        toast.success(t('Plan upgraded successfully'));
        router.reload();
      },
      onError: (errors) => {
        toast.dismiss();
        const errorMessage = typeof errors === 'object' && errors !== null
          ? Object.values(errors).join(', ')
          : t('Failed to upgrade plan');
        toast.error(errorMessage);
      }
    });
  };

  const handleBusinessLink = (company: any) => {
    setCurrentCompany(company);
    toast.loading(t('Loading business links...'));

    fetch(route('companies.business-links', company.id))
      .then(res => res.json())
      .then(data => {
        setBusinessLinks(data.businesses || []);
        setIsBusinessLinkModalOpen(true);
        toast.dismiss();
      })
      .catch(err => {
        toast.dismiss();
        toast.error(t('Failed to load business links'));
      });
  };

  const handleCopyLink = (text: string) => {
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
    copyToClipboard(text)
      .then(() => {
        toast.success(t('Link copied to clipboard'));
      })
      .catch(() => {
        toast.error(t('Failed to copy link'));
      });
  };

  // Define page actions
  const pageActions = [
    {
      label: t('Add Company'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: 'default',
      onClick: () => handleAddNew()
    }
  ];

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Companies') }
  ];

  const getCompanyAvatar = (company: any) => getImageDisplayUrl(company.avatar_url) || '/storage/images/avatar/avatar.png';

  // Define table columns for list view
  const columns = [
    {
      key: 'name',
      label: t('Name'),
      sortable: true,
      render: (value: any, row: any) => {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center">
              <img
                src={getImageDisplayUrl(row.avatar_url) || '/storage/images/avatar/avatar.png'}
                alt={row.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/storage/images/avatar/avatar.png';
                }}
              />
            </div>
            <div>
              <div className="font-medium">{row.name}</div>
              <div className="text-sm text-muted-foreground">{row.email}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'plan_name',
      label: t('Plan'),
      render: (value: string) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
          {value}
        </span>
      )
    },
    {
      key: 'created_at',
      label: t('Created At'),
      sortable: true,
      render: (value: string) => window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(value, false) : new Date(value).toLocaleDateString()
    }
  ];

  return (
    <PageTemplate
      title={t("Companies")}
      url="/companies"
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
              name: 'status',
              label: t('Status'),
              type: 'select',
              value: selectedStatus,
              onChange: handleStatusFilter,
              options: [
                { value: 'all', label: t('All Status') },
                { value: 'active', label: t('Active') },
                { value: 'inactive', label: t('Inactive') }
              ]
            },
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

            router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
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
            router.get(route('companies.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      {activeView === 'list' ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
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
                {companies?.data?.map((company: any) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800">
                    {columns.map((column) => (
                      <td key={`${company.id}-${column.key}`} className="px-4 py-3">
                        {column.render ? column.render(company[column.key], company) : company[column.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('login-as', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Login as Company")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('company-info', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Company Info")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('upgrade-plan', company)}
                              className="text-amber-500 hover:text-amber-700"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Upgrade Plan")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('business-link', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Business Link")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('reset-password', company)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Reset Password")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('toggle-status', company)}
                              className="text-amber-500 hover:text-amber-700"
                            >
                              {company.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{company.status === 'active' ? t("Disable Login") : t("Enable Login")}</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction('edit', company)}
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
                              onClick={() => handleAction('delete', company)}
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

                {(!companies?.data || companies.data.length === 0) && (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      {t("No companies found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination section */}
          <Pagination
            from={companies?.from || 0}
            to={companies?.to || 0}
            total={companies?.total || 0}
            links={companies?.links}
            entityName={t("companies")}
            onPageChange={(url) => url && handlePageChange(url)}
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies?.data?.map((company: any) => (
              <Card key={company.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 flex flex-col">
                <div className="absolute right-4 top-4 z-10">
                  <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    company.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      company.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {company.status === 'active' ? t('Active') : t('Inactive')}
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-6 flex items-start space-x-4">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-sm font-semibold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                        <img
                          src={getCompanyAvatar(company)}
                          alt={company.name}
                          className="h-full w-full rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.textContent = getInitials(company.name);
                          }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pr-16">
                      <h3 className="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-white">
                        {company.name}
                      </h3>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {company.email}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center">
                        <CreditCard className="mr-2 h-4 w-4 text-primary" />
                        <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {company.plan_name || t('No Plan')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAction('upgrade-plan', company)}
                        className="h-6 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        {t("Upgrade")}
                      </Button>
                    </div>
                    {company.plan_expiry_date && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {t("Expires")}: {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(company.plan_expiry_date, false) : new Date(company.plan_expiry_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('login-as', company)}
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("Login as Company")}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('company-info', company)}
                            className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("Company Info")}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('edit', company)}
                            className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20"
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
                            size="sm"
                            onClick={() => handleAction('business-link', company)}
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("Business Link")}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('reset-password', company)}
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("Reset Password")}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('toggle-status', company)}
                            className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20"
                          >
                            {company.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{company.status === 'active' ? t("Disable Login") : t("Enable Login")}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('delete', company)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("Delete")}</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {(!companies?.data || companies.data.length === 0) && (
              <div className="col-span-full">
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-24 w-24 text-gray-300 dark:text-gray-600">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{t("No companies found")}</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">{t("Get started by creating your first company")}</p>
                  <Button onClick={handleAddNew} className="inline-flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("Add Company")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Pagination
                from={companies?.from || 0}
                to={companies?.to || 0}
                total={companies?.total || 0}
                links={companies?.links}
                entityName={t("companies")}
                onPageChange={(url) => url && handlePageChange(url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen} modal={!isChatGptOpen}>
        {currentCompany && <View company={currentCompany} />}
      </Dialog>

      {/* Form Modal */}
      <CrudFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={(data) => {
          // If login_enabled is false, remove password field
          if (data.login_enabled === false) {
            delete data.password;
          }
          // Set status based on login_enabled
          data.status = data.login_enabled ? 'active' : 'inactive';

          // Remove login_enabled field as it's not needed in the backend
          delete data.login_enabled;
          handleFormSubmit(data);
        }}
        formConfig={{
          fields: [
            { name: 'name', label: t('Company Name'), type: 'text', placeholder: t('Enter company name'), required: true },
            { name: 'email', label: t('Email'), type: 'email', placeholder: t('Enter email address'), required: true },
            {
              name: 'login_enabled',
              label: t('Enable Login'),
              placeholder: '', // Empty placeholder to prevent duplicate label
              type: 'switch',
              defaultValue: true,
              conditional: (mode) => mode === 'create'
            },
            {
              name: 'password',
              label: t('Password'),
              placeholder: t('Enter Password'),
              type: 'password',
              required: (mode) => mode === 'create',
              conditional: (mode, data) => {
                return mode === 'create' && data?.login_enabled === true;
              }
            }
          ],
          modalSize: 'lg'
        }}
        initialData={{
          ...currentCompany,
          login_enabled: currentCompany?.status === 'active'
        }}
        title={
          formMode === 'create'
            ? t('Add New Company')
            : formMode === 'edit'
              ? t('Edit Company')
              : t('View Company')
        }
        mode={formMode}
      />

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentCompany?.name || ''}
        entityName="company"
      />

      {/* Reset Password Modal */}
      <CrudFormModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSubmit={handleResetPasswordConfirm}
        formConfig={{
          fields: [
            { name: 'password', label: t('New Password'), type: 'password', required: true, placeholder: t('Enter new password') },
            { name: 'password_confirmation', label: t('Confirm Password'), type: 'password', required: true, placeholder: t('Confirm new password') }
          ],
          modalSize: 'sm'
        }}
        initialData={{}}
        title={`Reset Password for ${currentCompany?.name || 'Company'}`}
        mode="edit"
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradePlanModalOpen}
        onClose={() => setIsUpgradePlanModalOpen(false)}
        onConfirm={handleUpgradePlanConfirm}
        plans={availablePlans}
        currentPlanId={currentCompany?.plan_id}
        companyName={currentCompany?.name || ''}
      />

      {/* Business Links Modal */}
      <Dialog open={isBusinessLinkModalOpen} onOpenChange={setIsBusinessLinkModalOpen} modal={!isChatGptOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('Business Links')} - {currentCompany?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {businessLinks.length > 0 ? (
              businessLinks.map((business: any) => (
                <div key={business.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{business.name}</h4>
                    <p className="text-sm text-gray-500 break-all">{business.link}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleCopyLink(business.link);
                      setCopiedLinkId(business.id);
                      setTimeout(() => setCopiedLinkId(null), 2000);
                    }}
                    className="ml-4"
                  >
                    {copiedLinkId === business.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('No businesses found for this company')}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
}
