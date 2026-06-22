import { Utensils } from 'lucide-react';
import { t } from 'i18next';

declare global {
    function route(name: string): string;
}

export default {
    title: t('Menu'),
    icon: Utensils,
    permission: 'manage-menu',
    order: 68,
    children: [
        {
            title: t('Create Menu'),
            href: route('menu.create'),
        },
        {
            title: t('Menu List'),
            href: route('menu.index'),
        }
    ],
};