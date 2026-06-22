import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { t } from '@/utils/i18n';

export const domainRequestsConfig: CrudConfig = {
  entity: {
    name: 'domainRequests',
    endpoint: route('domain-requests.index'),
    permissions: {
      view: 'view-domain-requests',
      create: 'create-domain-requests',
      edit: 'edit-domain-requests',
      delete: 'delete-domain-requests'
    }
  },
  modalSize: '4xl',
  description: t('Manage custom domain requests from users'),
  table: {
    columns: [
      { key: 'user.name', label: t('User Name'), sortable: true },
      { key: 'business.name', label: t('Business Name'), sortable: true },
      { key: 'biolink.name', label: t('Bio Link'), sortable: true },
      { key: 'domain', label: t('Requested Domain'), sortable: true },
      { 
        key: 'status', 
        label: t('Status'), 
        render: columnRenderers.status(
          {pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',}
        )
      },
      { 
        key: 'created_at', 
        label: t('Requested At'), 
        sortable: true, 
        render: (value) => `${window.appSettings.formatDateTime(value, false)}` 
      }
    ],
    actions: [
      { 
        label: t('Approve'), 
        icon: 'Check', 
        action: 'approve', 
        className: 'text-green-600',
        condition: (item: any) => item.status === 'pending'
      },
      { 
        label: t('Reject'), 
        icon: 'X', 
        action: 'reject', 
        className: 'text-red-600',
        condition: (item: any) => item.status === 'pending'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500'
      }
    ]
  },
  search: {
    enabled: true,
    placeholder: t('Search domain requests...'),
    fields: ['user.name', 'business.name', 'domain']
  },
  filters: [
    {
      key: 'status',
      label: t('Status'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Status') },
        { value: 'pending', label: t('Pending') },
        { value: 'approved', label: t('Approved') },
        { value: 'rejected', label: t('Rejected') }
      ]
    }
  ],
  form: {
    fields: []
  }
};