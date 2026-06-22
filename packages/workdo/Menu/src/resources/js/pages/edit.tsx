import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MenuQrCodeForm from './form';

interface Props {
  menu: {
    id: number;
    name: string;
    slug: string;
    menu_type: string;
    config_sections: any;
  };
}

export default function EditMenu() {
  const { t } = useTranslation();
  const { menu } = usePage<Props>().props;
  
  return (
    <>
      <Head title={t("Edit Menu")} />
      <MenuQrCodeForm menu={menu} />
    </>
  );
}