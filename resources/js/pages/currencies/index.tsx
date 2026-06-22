// pages/currencies/index.tsx
import { PageCrudWrapper } from '@/components/PageCrudWrapper';
import { currenciesConfig } from '@/config/crud/currencies';
import { BreadcrumbItem } from '@/types';
import { useTranslation } from 'react-i18next';


export default function CurrenciesPage() {
  const { t } = useTranslation();

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Currencies') },
  ];
  return (
    <PageCrudWrapper
      config={currenciesConfig}
      title="Currencies"
      url="/currencies"
      breadcrumbs={defaultBreadcrumbs}
      addButtonLabel={t('Add New Currency')}
    />
  );
}