import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import EventQrCodeForm from './form';

export default function CreateEvent() {
  const { t } = useTranslation();
  
  return (
    <>
      <Head title={t("Create Event")} />
      <EventQrCodeForm />
    </>
  );
}