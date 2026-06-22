import { CrudConfig } from '@/types/crud';
import { t } from '@/utils/i18n';

export const landingPageNewslettersConfig: CrudConfig = {
  entity: {
    name: 'newsletters',
    endpoint: route('landing-page.newsletters.index'),
    permissions: {
      view: 'manage-landing-page',
      create: 'manage-landing-page',
      edit: 'manage-landing-page',
      delete: 'manage-landing-page'
    }
  },
  table: {
    columns: [
      { 
        key: 'email', 
        label: t('Email'), 
        sortable: true 
      },
      { 
        key: 'subscribed_at', 
        label: t('Subscribed'), 
        type: 'date',
        sortable: true 
      }
    ],
    statusColors: {
      'active': 'bg-green-100 text-green-800',
      'unsubscribed': 'bg-red-100 text-red-800'
    },
    actions: [
      { 
        label: t('View'), 
        icon: 'Eye', 
        action: 'view', 
        className: 'text-blue-500',
        requiredPermission: 'manage-landing-page'
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500',
        requiredPermission: 'manage-landing-page'
      }
    ]
  },
  filters: [
    {
      name: 'status',
      label: t('Status'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Statuses') },
        { value: 'active', label: t('Active') },
        { value: 'unsubscribed', label: t('Unsubscribed') }
      ]
    }
  ],
  form: {
    fields: [
      { 
        name: 'email', 
        label: t('Email'), 
        type: 'email', 
        required: true 
      },
      { 
        name: 'status', 
        label: t('Status'), 
        type: 'select',
        options: [
          { value: 'active', label: t('Active') },
          { value: 'unsubscribed', label: t('Unsubscribed') }
        ]
      }
    ]
  }
};