import React from 'react';
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { t } from '@/utils/i18n';

export const planRequestsConfig: CrudConfig = {
  entity: {
    name: 'planRequests',
    endpoint: route('plan-requests.index'),
    permissions: {
      view: 'view-plan-requests',
      create: 'create-plan-requests',
      edit: 'edit-plan-requests',
      delete: 'delete-plan-requests'
    }
  },
  modalSize: '4xl',
  description: t('Manage plan upgrade requests from users'),
  table: {
    columns: [
      {
        key: 'user.name',
        label: t('User'),
        sortable: true,
        render: (value, row) => {
          const user = row?.user;
          const avatarUrl = getImageDisplayUrl(user?.avatar_url) || '/storage/images/avatar/avatar.png';

          if (!user) {
            return React.createElement('span', null, '-');
          }

          return React.createElement(
            'div',
            { className: 'flex items-center gap-3' },
            [
              React.createElement(
                'div',
                {
                  key: 'avatar-wrapper',
                  className: 'w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center shrink-0',
                },
                React.createElement('img', {
                  src: avatarUrl,
                  alt: user.name || value || 'User',
                  className: 'w-full h-full object-cover',
                  onError: (e: any) => {
                    e.target.src = '/storage/images/avatar/avatar.png';
                  },
                }),
              ),
              React.createElement(
                'div',
                { key: 'content' },
                React.createElement(
                  'div',
                  { key: 'name', className: 'font-medium' },
                  user.name || value || '-',
                ),
              ),
            ],
          );
        },
      },
      { key: 'user.email', label: t('Email'), sortable: true },
      { key: 'plan.name',
        label: t('Plan Name'),
        sortable: true,
        render: columnRenderers.plan()
      },
      { 
        key: 'duration', 
        label: t('Plan Duration'), 
        render: (value) => value === 'monthly' ? t('Monthly') : t('Yearly')
      },
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
        condition: (item: any, context?: any) => item.status === 'pending' && context?.isSuperAdmin
      },
      { 
        label: t('Reject'), 
        icon: 'X', 
        action: 'reject', 
        className: 'text-red-600',
        condition: (item: any, context?: any) => item.status === 'pending' && context?.isSuperAdmin
      },
      { 
        label: t('Delete'), 
        icon: 'Trash2', 
        action: 'delete', 
        className: 'text-red-500',
        condition: (item: any, context?: any) => item.status === 'pending' && !context?.isSuperAdmin
      }
    ]
  },
  search: {
    enabled: true,
    placeholder: t('Search plan requests...'),
    fields: ['user.name', 'user.email', 'plan.name']
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
