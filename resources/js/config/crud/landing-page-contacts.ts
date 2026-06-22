import { CrudConfig } from '@/types/crud';
import { t } from '@/utils/i18n';

export const landingPageContactsConfig: CrudConfig = {
  entity: {
    name: 'contacts',
    endpoint: route('landing-page.contacts.index'),
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
        key: 'name', 
        label: t('Name'), 
        sortable: true 
      },
      { 
        key: 'email', 
        label: t('Email'), 
        sortable: true 
      },
      { 
        key: 'subject', 
        label: t('Subject'), 
        sortable: true 
      },
      { 
        key: 'status', 
        label: t('Status'), 
        type: 'badge',
        sortable: true
      },
      { 
        key: 'created_at', 
        label: t('Date'), 
        type: 'date',
        sortable: true 
      }
    ],
    actions: [
      { 
        label: t('View'), 
        icon: 'Eye', 
        action: 'view', 
        className: 'text-blue-500',
        requiredPermission: 'manage-landing-page'
      },
      { 
        label: t('Reply'), 
        icon: 'Reply', 
        action: 'reply', 
        className: 'text-green-500',
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
        { value: 'new', label: t('New') },
        { value: 'contacted', label: t('Contacted') },
        { value: 'qualified', label: t('Qualified') },
        { value: 'converted', label: t('Converted') },
        { value: 'closed', label: t('Closed') }
      ]
    }
  ],
  form: {
    fields: [
      { 
        name: 'name', 
        label: t('Name'), 
        type: 'text', 
        required: true 
      },
      { 
        name: 'email', 
        label: t('Email'), 
        type: 'email', 
        required: true 
      },
      { 
        name: 'subject', 
        label: t('Subject'), 
        type: 'text', 
        required: true 
      },
      { 
        name: 'message', 
        label: t('Message'), 
        type: 'textarea',
        required: true 
      },
      { 
        name: 'status', 
        label: t('Status'), 
        type: 'select',
        options: [
          { value: 'new', label: t('New') },
          { value: 'contacted', label: t('Contacted') },
          { value: 'qualified', label: t('Qualified') },
          { value: 'converted', label: t('Converted') },
          { value: 'closed', label: t('Closed') }
        ]
      },
      { 
        name: 'notes', 
        label: t('Notes'), 
        type: 'textarea' 
      }
    ]
  },
  reply: {
    endpoint: (id: string) => route('landing-page.contacts.reply', id),
    fields: [
      { 
        name: 'subject', 
        label: t('Subject'), 
        type: 'text', 
        required: true 
      },
      { 
        name: 'message', 
        label: t('Message'), 
        type: 'textarea',
        required: true 
      },
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
      }
    ]
  }
};