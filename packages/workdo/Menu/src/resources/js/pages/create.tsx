import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MenuQrCodeForm from './form';

export default function CreateMenu() {
  const { t } = useTranslation();
  
  return (
    <>
      <Head title={t("Create Menu")} />
      <MenuQrCodeForm />
    </>
  );
}