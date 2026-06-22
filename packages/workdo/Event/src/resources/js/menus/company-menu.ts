import { Calendar } from 'lucide-react';
import { t } from 'i18next';

declare global {
    function route(name: string): string;
}

export default {
    title: t('Event'),
    icon: Calendar,
    permission: 'manage-event',
    order: 66,
    children: [
        {
            title: t('Create Event'),
            href: route('event-qr-code.create'),
        },
        {
            title: t('Event'),
            href: route('event-qr-code.index'),
        }
    ],
};