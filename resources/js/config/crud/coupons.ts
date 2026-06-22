// config/crud/coupons.ts
import React from 'react';
import { CrudConfig } from '@/types/crud';
import { columnRenderers } from '@/utils/columnRenderers';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/custom-toast';
import { t } from '@/utils/i18n';

// Separate component for status toggle to properly handle hooks
const StatusToggle = ({ initialValue, rowId }: { initialValue: boolean, rowId: number }) => {
  const [isChecked, setIsChecked] = React.useState(initialValue);
  
  const handleToggle = async () => {
    try {
      const response = await fetch(route('coupons.toggle-status', rowId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsChecked(data.status);
        toast.success(data.message || 'Status updated successfully');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error updating status');
    }
  };
  
  return React.createElement('div', { className: 'flex items-center justify-center' }, [
    React.createElement(Switch, {
      key: 'status-switch',
      checked: isChecked,
      onCheckedChange: handleToggle
    })
  ]);
};

const CopyableCouponCode = ({ code }: { code: string }) => {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCode = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCode(value);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return React.createElement('div', { className: 'flex flex-col items-start' }, [
    React.createElement('button', {
      key: 'copy-code-button',
      type: 'button',
      onClick: () => handleCopyCode(code),
      className: 'px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors font-mono text-sm cursor-pointer'
    }, code),
    copiedCode === code
      ? React.createElement('span', {
          key: 'copied-indicator',
          className: 'text-xs text-red-600 dark:text-red-400 mt-1 font-medium ml-3'
        }, t('Copied!'))
      : null
  ]);
};

export const couponsConfig: CrudConfig = {
  entity: {
    name: 'coupons',
    endpoint: route('coupons.index'),
    permissions: {
      view: 'view-coupons',
      create: 'create-coupons',
      edit: 'create-coupons',
      delete: 'delete-coupons'
    }
  },
  modalSize: '4xl',
  description: t('Manage discount coupons and promotional codes'),
  table: {
    columns: [
      { key: 'name', label: t('Name'), sortable: true },
      {
        key: 'code',
        label: t('Code'),
        sortable: true,
        render: (value) => React.createElement(CopyableCouponCode, { code: value })
      },
      { 
        key: 'type', 
        label: t('Type'), 
        sortable: true,
        render: (value) => {
          const className = value === 'percentage' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800';
          return value === 'percentage' ? t('Percentage') : t('Flat Amount');
        }
      },
      { 
        key: 'minimum_spend', 
        label: t('Min Spend'), 
        render: (value) => value ? (window.appSettings?.formatCurrency(value) || `$${parseFloat(value).toFixed(2)}`) : '-'
      },
      { 
        key: 'maximum_spend', 
        label: t('Max Spend'), 
        render: (value) => value ? (window.appSettings?.formatCurrency(value) || `$${parseFloat(value).toFixed(2)}`) : '-'
      },
      { 
        key: 'discount_amount', 
        label: t('Discount'), 
        render: (value, row) => {
          const amount = parseFloat(value);
          return row.type === 'percentage' 
            ? `${amount}%` 
            : (window.appSettings?.formatCurrency(amount) || `$${amount.toFixed(2)}`);
        }
      },
      { key: 'use_limit_per_coupon', label: t('Coupon Limit'), render: (value) => value || t('Unlimited') },
      { key: 'use_limit_per_user', label: t('User Limit'), render: (value) => value || t('Unlimited') },
      { 
        key: 'expiry_date', 
        label: t('Expiry Date'), 
        sortable: true, 
        render: (value) => `${window.appSettings.formatDateTime(value, false)}` 
      },
      { 
        key: 'status', 
        label: t('Status'), 
        render: (value, row) => {
          // Use a component to properly handle hooks
          return React.createElement(StatusToggle, { initialValue: !!value, rowId: row.id });
        }
      }
    ],
    actions: [
      { 
        label: t('View Details'), 
        icon: 'Eye', 
        action: 'view-details',
        href: (row: any) => route('coupons.show', row.id),
        className: 'text-blue-500'
      },
      { 
        label: t('Edit'), 
        icon: 'Edit', 
        action: 'edit', 
        className: 'text-amber-500'
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
    placeholder: t('Search coupons...'),
    fields: ['name', 'code']
  },
  filters: [
    {
      key: 'type',
      label: t('Type'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Types') },
        { value: 'percentage', label: t('Percentage') },
        { value: 'flat', label: t('Flat Amount') }
      ]
    },
    {
      key: 'status',
      label: t('Status'),
      type: 'select',
      options: [
        { value: 'all', label: t('All Status') },
        { value: '1', label: t('Active') },
        { value: '0', label: t('Inactive') }
      ]
    }
  ],
  form: {
    fields: [
      { 
        name: 'name', 
        label: t('Coupon Name'), 
        type: 'text', 
        required: true,
        colSpan: 12,
        placeholder: t('Enter coupon name')
      },
      { 
        name: 'type', 
        label: t('Discount Type'), 
        type: 'select', 
        required: true,
        colSpan: 6,
        options: [
          { value: 'percentage', label: t('Percentage (%)') },
          { 
            value: 'flat', 
            get label() {
              return `${t('Fixed Amount')} (${window?.appSettings?.currencySettings?.currencySymbol || '$'})`;
            }
          }
        ]
      },
      { 
        name: 'discount_amount', 
        label: t('Discount Value'), 
        type: 'number', 
        required: true,
        colSpan: 6,
        min: 0,
        max: 99,
        step: 0.01,
        placeholder: t('Enter value')
      },
      { 
        name: 'code_type', 
        label: t('Code Generation'), 
        type: 'radio', 
        required: true,
        colSpan: 12,
        options: [
          { value: 'manual', label: t('Manual Entry') },
          { value: 'auto', label: t('Auto Generate') }
        ],
        defaultValue: 'manual'
      },
      { 
        name: 'code', 
        label: t('Coupon Code'), 
        type: 'custom',
        required: true,
        colSpan: 12,
        render: (field: any, formData: any, onChange: any) => {
          const generateCode = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';
            for (let i = 0; i < 10; i++) {
              result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            onChange('code', result);
          };

          const isAuto = formData.code_type === 'auto';

          return React.createElement('div', { className: 'space-y-2' }, [
            React.createElement('div', { 
              className: isAuto ? 'flex gap-2' : '', 
              key: 'input-group' 
            }, isAuto ? [
              React.createElement('input', {
                key: 'code-input',
                type: 'text',
                value: formData.code || '',
                onChange: (e: any) => onChange('code', e.target.value.toUpperCase()),
                placeholder: t('Click generate to create code'),
                className: 'flex-1 px-3 py-2 border rounded-md'
              }),
              React.createElement('button', {
                key: 'generate-btn',
                type: 'button',
                onClick: generateCode,
                className: 'px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90'
              }, t('Generate'))
            ] : [
              React.createElement('input', {
                key: 'code-input-manual',
                type: 'text',
                value: formData.code || '',
                onChange: (e: any) => onChange('code', e.target.value.toUpperCase()),
                placeholder: t('Enter coupon code'),
                className: 'w-full px-3 py-2 border rounded-md'
              })
            ])
          ]);
        }
      },
      { 
        name: 'minimum_spend',
        get label() {
          return `${t('Minimum Spend')} (${window?.appSettings?.currencySettings?.currencySymbol || '$'})`;
        },
        type: 'number',
        colSpan: 6,
        min: 0,
        step: 0.01,
        placeholder: t('Optional')
      },
      { 
        name: 'maximum_spend', 
        get label() {
          return `${t('Maximum Spend')} (${window?.appSettings?.currencySettings?.currencySymbol || '$'})`;
        },
        type: 'number', 
        colSpan: 6,
        min: 0,
        step: 0.01,
        placeholder: t('Optional')
      },
      { 
        name: 'use_limit_per_coupon', 
        label: t('Total Usage Limit'), 
        type: 'number', 
        colSpan: 6,
        min: 1,
        placeholder: t('Leave empty for unlimited')
      },
      { 
        name: 'use_limit_per_user', 
        label: t('Usage Limit Per User'), 
        type: 'number', 
        colSpan: 6,
        min: 1,
        placeholder: t('Leave empty for unlimited')
      },
      { 
        name: 'expiry_date', 
        label: t('Expiry Date'), 
        type: 'date', 
        colSpan: 6
      },
      { 
        name: 'status', 
        label: t('Status'), 
        type: 'switch', 
        colSpan: 6,
        defaultValue: true,
        placeholder: t('Enable or disable this coupon')
      }
    ]
  }
};