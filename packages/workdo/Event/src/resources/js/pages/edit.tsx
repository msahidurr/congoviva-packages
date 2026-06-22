import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import EventQrCodeForm from './form';

interface Props {
  event: any;
}

export default function EditEvent({ event }: Props) {
  const { t } = useTranslation();
  
  return (
    <>
      <Head title={t("Edit Event")} />
      <EventQrCodeForm event={event} />
    </>
  );
}