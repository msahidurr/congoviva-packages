// pages/users/index.tsx
import { useState, useEffect } from 'react';
import { usersConfig } from '@/config/crud/users';
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
import { Dialog } from '@/components/ui/dialog';
import { Filter, Search, Plus, Eye, Edit, Trash2, KeyRound, Lock, Unlock, LayoutGrid, List } from 'lucide-react';
import { hasPermission } from '@/utils/authorization';
import { CrudTable } from '@/components/CrudTable';
import { CrudFormModal } from '@/components/CrudFormModal';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';
import { useInitials } from '@/hooks/use-initials';
import { useTranslation } from 'react-i18next';
import View from './View';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

export default function Users() {
  const { t } = useTranslation();
  const { auth, users, roles, planLimits, filters: pageFilters = {} } = usePage().props as any;
  const permissions = auth?.permissions || [];
  const getInitials = useInitials();

  // State
  const [activeView, setActiveView] = useState(pageFilters.view || 'list');
  const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
  const [selectedRole, setSelectedRole] = useState(pageFilters.role || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
  const [viewData, setViewData] = useState<any>(null);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedRole !== 'all' || searchTerm !== '';
  };

  // Count active filters
  const activeFilterCount = () => {
    return (selectedRole !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);
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

    if (selectedRole !== 'all') {
      params.role = selectedRole;
    }

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleRoleFilter = (value: string) => {
    setSelectedRole(value);

    const params: any = { page: 1, view: activeView };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (value !== 'all') {
      params.role = value;
    }

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
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

    if (selectedRole !== 'all') {
      params.role = selectedRole;
    }

    // Add per_page if it exists
    if (pageFilters.per_page) {
      params.per_page = pageFilters.per_page;
    }

    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleAction = (action: string, item: any) => {
    setCurrentItem(item);

    switch (action) {
      case 'view':
        setFormMode('view');
        setViewData(item);
        setIsFormModalOpen(true);
        break;
      case 'edit':
        setFormMode('edit');
        setIsFormModalOpen(true);
        break;
      case 'delete':
        setIsDeleteModalOpen(true);
        break;
      case 'reset-password':
        setIsResetPasswordModalOpen(true);
        break;
      case 'toggle-status':
        handleToggleStatus(item);
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
    // Keep roles as single string value, not array
    if (formData.roles && Array.isArray(formData.roles)) {
      formData.roles = formData.roles[0];
    }

    if (formMode === 'create') {
      toast.loading(t('Creating user...'));

      router.post(route('users.store'), formData, {
        onSuccess: (page) => {
          setIsFormModalOpen(false);
          toast.dismiss();
          if (page.props?.flash?.success) {
            toast.success(page.props.flash.success);
          }
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to create user: ${Object.values(errors).join(', ')}`);
        }
      });
    } else if (formMode === 'edit') {
      toast.loading(t('Updating user...'));

      router.put(route("users.update", currentItem.id), formData, {
        onSuccess: (page) => {
          setIsFormModalOpen(false);
          toast.dismiss();
          if (page.props?.flash?.success) {
            toast.success(page.props.flash.success);
          }
        },
        onError: (errors) => {
          toast.dismiss();
          toast.error(`Failed to update user: ${Object.values(errors).join(', ')}`);
        }
      });
    }
  };

  const handleDeleteConfirm = () => {
    toast.loading(t('Deleting user...'));

    router.delete(route("users.destroy", currentItem.id), {
      onSuccess: (page) => {
        setIsDeleteModalOpen(false);
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to delete user: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleResetPasswordConfirm = (data: { password: string, password_confirmation: string }) => {
    toast.loading(t('Resetting password...'));

    router.put(route('users.reset-password', currentItem.id), data, {
      onSuccess: (page) => {
        setIsResetPasswordModalOpen(false);
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to reset password: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handleToggleStatus = (user: any) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    toast.loading(`${newStatus === 'active' ? t('Activating') : t('Deactivating')} user...`);

    router.put(route('users.toggle-status', user.id), {}, {
      onSuccess: (page) => {
        toast.dismiss();
        if (page.props?.flash?.success) {
          toast.success(page.props.flash.success);
        }
      },
      onError: (errors) => {
        toast.dismiss();
        toast.error(`Failed to update user status: ${Object.values(errors).join(', ')}`);
      }
    });
  };

  const handlePageChange = (url: string) => {
    const pageNum = new URL(url, window.location.origin).searchParams.get('page') || '1';
    const params: any = { page: pageNum, view: activeView };

    if (searchTerm) params.search = searchTerm;
    if (selectedRole !== 'all') params.role = selectedRole;
    if (pageFilters.per_page) params.per_page = pageFilters.per_page;
    if (pageFilters.sort_field) params.sort_field = pageFilters.sort_field;
    if (pageFilters.sort_direction) params.sort_direction = pageFilters.sort_direction;

    router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
  };

  const handleResetFilters = () => {
    setSelectedRole('all');
    setSearchTerm('');
    setShowFilters(false);

    router.get(route('users.index'), {
      page: 1,
      per_page: pageFilters.per_page,
      view: activeView
    }, { preserveState: true, preserveScroll: true });
  };

  // Define page actions
  const pageActions = [];

  // Add the "Add New User" button if user has permission and within limits
  if (hasPermission(permissions, 'create-users')) {
    const canCreate = !planLimits || planLimits.can_create;
    pageActions.push({
      label: planLimits && !canCreate ? t('User Limit Reached ({{current}}/{{max}})', { current: planLimits.current_users, max: planLimits.max_users }) : t('Add User'),
      icon: <Plus className="h-4 w-4 mr-2" />,
      variant: canCreate ? 'default' : 'outline',
      onClick: canCreate ? () => handleAddNew() : () => toast.error(t('User limit exceeded. Your plan allows maximum {{max}} users. Please upgrade your plan.', { max: planLimits.max_users })),
      disabled: !canCreate
    });
  }

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Staff'), href: route('users.index') },
    { title: t('Users') }
  ];

  const getUserAvatar = (user: any) => getImageDisplayUrl(user.avatar_url) || '/storage/images/avatar/avatar.png';

  // Define table columns
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
      key: 'roles',
      label: t('Roles'),
      render: (value: any) => {
        if (!value || !value.length) return <span className="text-muted-foreground">No roles assigned</span>;

        return value.map((role: any) => {
          return <span key={role.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">{role.label || role.name}</span>;
        });
      }
    },
    {
      key: 'created_at',
      label: t('Joined'),
      sortable: true,
      render: (value: string) => window.appSettings?.formatDateTime(value, false) || new Date(value).toLocaleDateString()
    }
  ];

  // Define table actions
  const actions = [
    {
      label: t('View'),
      icon: 'Eye',
      action: 'view',
      className: 'text-blue-500',
      requiredPermission: 'view-users'
    },
    {
      label: t('Edit'),
      icon: 'Edit',
      action: 'edit',
      className: 'text-amber-500',
      requiredPermission: 'edit-users'
    },
    {
      label: t('Reset Password'),
      icon: 'KeyRound',
      action: 'reset-password',
      className: 'text-blue-500',
      requiredPermission: 'reset-password-users'
    },
    {
      label: t('Toggle Status'),
      icon: (item: any) => item.status === 'active' ? 'Lock' : 'Unlock',
      action: 'toggle-status',
      className: 'text-amber-500',
      requiredPermission: 'toggle-status-users'
    },
    {
      label: t('Delete'),
      icon: 'Trash2',
      action: 'delete',
      className: 'text-red-500',
      requiredPermission: 'delete-users'
    }
  ];

  return (
    <PageTemplate
      title={t("Users")}
      url="/users"
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
              name: 'role',
              label: t('Role'),
              type: 'select',
              value: selectedRole,
              onChange: handleRoleFilter,
              options: [
                { value: 'all', label: t('All Roles') },
                ...(roles || []).map((role: any) => ({
                  value: role.id.toString(),
                  label: role.label || role.name
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
          currentPerPage={pageFilters.per_page?.toString() || "10"}
          onPerPageChange={(value) => {
            const params: any = { page: 1, per_page: parseInt(value), view: activeView };

            if (searchTerm) {
              params.search = searchTerm;
            }

            if (selectedRole !== 'all') {
              params.role = selectedRole;
            }

            router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
          }}
          showViewToggle={true}
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);

            // Update URL and reload with the new view parameter
            const params: any = { view };

            // Preserve other existing parameters
            if (searchTerm) params.search = searchTerm;
            if (selectedRole !== 'all') params.role = selectedRole;
            if (pageFilters.per_page) params.per_page = pageFilters.per_page;
            if (pageFilters.page) params.page = pageFilters.page;

            // Navigate with the updated parameters
            router.get(route('users.index'), params, { preserveState: true, preserveScroll: true });
          }}
        />
      </div>

      {/* Content section */}
      {activeView === 'list' ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
          <CrudTable
            columns={columns}
            actions={actions}
            data={users?.data || []}
            from={users?.from || 1}
            showIndexColumn={false}
            onAction={handleAction}
            sortField={pageFilters.sort_field}
            sortDirection={pageFilters.sort_direction}
            onSort={handleSort}
            permissions={permissions}
            entityPermissions={{
              view: 'view-users',
              create: 'create-users',
              edit: 'edit-users',
              delete: 'delete-users'
            }}
          />

          {/* Pagination section */}
          <Pagination
            from={users?.from || 0}
            to={users?.to || 0}
            total={users?.total || 0}
            links={users?.links}
            entityName={t("users")}
            onPageChange={(url) => url && handlePageChange(url)}
          />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users?.data?.map((user: any) => (
              <Card key={user.id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="absolute right-4 top-4 z-10">
                  <div className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${user.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                    <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    {user.status === 'active' ? t('Active') : t('Inactive')}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex items-start space-x-4">
                    <div className="relative">
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-sm font-semibold text-gray-600 shadow-sm dark:bg-gray-800 dark:text-gray-200">
                        <img
                          src={getUserAvatar(user)}
                          alt={user.name}
                          className="h-full w-full rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.textContent = getInitials(user.name);
                          }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1 pr-16">
                      <h3 className="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {t("Joined")}: {window.appSettings?.formatDateTime(user.created_at, false) || new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center">
                        <span className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {t('Role')}
                        </span>
                      </div>
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role: any) => (
                          <span key={role.id} className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-700/30">
                            {role.label || role.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs dark:text-gray-400">{t("No role")}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {hasPermission(permissions, 'view-users') && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction('view', user)}
                              className="h-8 w-8 p-0 text-gray-600 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("View User")}</TooltipContent>
                        </Tooltip>
                      )}

                      {hasPermission(permissions, 'edit-users') && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction('edit', user)}
                              className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Edit")}</TooltipContent>
                        </Tooltip>
                      )}
                      {hasPermission(permissions, 'reset-password-users') && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction('reset-password', user)}
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Reset Password")}</TooltipContent>
                        </Tooltip>
                      )}

                      {hasPermission(permissions, 'toggle-status-users') && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction('toggle-status', user)}
                              className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/20"
                            >
                              {user.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{user.status === 'active' ? t("Disable User") : t("Enable User")}</TooltipContent>
                        </Tooltip>
                      )}

                      {hasPermission(permissions, 'delete-users') && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction('delete', user)}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("Delete")}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {(!users?.data || users.data.length === 0) && (
              <div className="col-span-full">
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 h-24 w-24 text-gray-300 dark:text-gray-600">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-full w-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5V4H2v16h5m10 0v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m10 0H7m5-12a4 4 0 110 8 4 4 0 010-8z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{t("No users found")}</h3>
                  <p className="mb-6 text-gray-500 dark:text-gray-400">{t("Get started by creating your first user")}</p>
                  {hasPermission(permissions, 'create-users') && (
                    <Button onClick={handleAddNew} className="inline-flex items-center" disabled={!!planLimits && !planLimits.can_create}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("Add User")}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <Pagination
                from={users?.from || 0}
                to={users?.to || 0}
                total={users?.total || 0}
                links={users?.links}
                entityName={t("users")}
                onPageChange={(url) => url && handlePageChange(url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {formMode === 'view' ? (
        <Dialog open={isFormModalOpen} onOpenChange={(open) => { if (!open) setIsFormModalOpen(false); }}>
          <View user={viewData} />
        </Dialog>
      ) : (
        <CrudFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          formConfig={{
            fields: [
              { name: 'name', label: t('Name'), type: 'text', required: true, placeholder: t('Enter full name') },
              { name: 'email', label: t('Email'), type: 'email', required: true, placeholder: t('Enter email address') },
              {
                name: 'password',
                label: t('Password'),
                type: 'password',
                required: true,
                placeholder: t('Enter password'),
                conditional: (mode) => mode === 'create'
              },
              {
                name: 'password_confirmation',
                label: t('Confirm Password'),
                type: 'password',
                required: true,
                placeholder: t('Confirm password'),
                conditional: (mode) => mode === 'create'
              },
              {
                name: 'roles',
                label: t('Role'),
                type: 'select',
                options: roles ? roles.map((role: any) => ({
                  value: role.id.toString(),
                  label: role.label || role.name
                })) : [],
                required: true,
                placeholder: t('Select role')
              }
            ],
            modalSize: 'lg'
          }}
          initialData={currentItem ? {
            ...currentItem,
            roles: currentItem.roles && currentItem.roles.length > 0 ? currentItem.roles[0].id.toString() : ''
          } : null}
          title={
            formMode === 'create'
              ? t('Add New User')
              : formMode === 'edit'
                ? t('Edit User')
                : t('View User')
          }
          mode={formMode}
        />
      )}

      {/* Delete Modal */}
      <CrudDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={currentItem?.name || ''}
        entityName="user"
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
        title={`Reset Password for ${currentItem?.name || 'User'}`}
        mode="edit"
      />
    </PageTemplate>
  );
}
