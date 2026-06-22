import { type NavItem } from '@/types';
import { BookOpen, Contact, Folder, LayoutGrid, ShoppingBag, Users, Tag, FileIcon, Settings, BarChart, Barcode, FileText, Briefcase, Mails, Calendar, CreditCard, Nfc, Ticket, Gift, DollarSign, MessageSquare, CalendarDays, Palette, Image, Mail, Mail as VCard, ChevronDown, Building2, Globe, BarChart3, Link as LinkIcon, Percent, Globe2, Wallet, Package, Shield, QrCode } from 'lucide-react';
import { hasPermission } from '@/utils/authorization';

declare global {
    interface Window {
        enabledAddons?: any[];
    }
}

export const getCompanyMenuItems = (t: any, permissions: any[], auth: any, referralSettings: any, nfcCardSettings?: any, campaignSettings?: any, directorySettings?: any, googleWalletGlobalSettings?: any): NavItem[] => {
    const items: NavItem[] = [];
    const userPlan = auth?.user?.plan;
    
    // Dashboard
    if (hasPermission(permissions, 'manage-dashboard')) {
        items.push({
            title: t('Dashboard'),
            href: route('dashboard'),
            icon: LayoutGrid,
            order: 10,
        });
    }
    
    // Analytics
    if (hasPermission(permissions, 'manage-analytics') || hasPermission(permissions, 'view-analytics')) {
        items.push({
            title: t('Analytics'),
            href: route('company.analytics'),
            icon: BarChart3,
            order: 20,
        });
    }

    // Business Directory - Check global setting
    const directoryEnabled = directorySettings?.is_enabled === true;
    
    if (directoryEnabled && hasPermission(permissions, 'manage-business-directory')) {
        items.push({
            title: t('Business Directory'),
            href: route('directory.index'),
            icon: Globe,
            target: '_blank',
            order: 35,
        });
    }

    // vCard Builder - Check plan feature
    const vCardChildren = [];
    const hasVCardBuilderFeature = userPlan?.features?.vcard_builder !== false; // Default enabled
    
    if (hasVCardBuilderFeature) {
        if (hasPermission(permissions, 'create-businesses') || hasPermission(permissions, 'create-vcard-builder')) {
            vCardChildren.push({
                title: t('Create New Business'),
                href: route('vcard-builder.create')
            });
        }
        if ((hasPermission(permissions, 'edit-businesses') || hasPermission(permissions, 'edit-vcard-builder')) && auth.user?.current_business) {
            vCardChildren.push({
                title: t('Edit Business'),
                href: route('vcard-builder.edit', auth.user?.current_business || 1)
            });
        }
        if (hasPermission(permissions, 'manage-businesses') || hasPermission(permissions, 'manage-vcard-builder') || hasPermission(permissions, 'view-businesses')) {
            vCardChildren.push({
                title: t('Businesses'),
                href: route('vcard-builder.index')
            });
        }
    }
    
    if (vCardChildren.length > 0) {
        items.push({
            title: t('vCard Builder'),
            icon: VCard,
            children: vCardChildren,
            defaultOpen: true,
            badge: (window as any).isDemo ? { label: 'New', variant: 'default' } : undefined,
            order: 40,
        });
    }


    // Bio Link
    const bioLinkChildren = [];
    const hasBioLinkFeature = userPlan?.features?.bio_link !== false; // Default enabled
    
    if (hasBioLinkFeature) {
        if (hasPermission(permissions, 'create-bio-link-builder')) {
            bioLinkChildren.push({
                title: t('Create New Bio Link'),
                href: route('link-bio-builder.create')
            });
        }
        if (hasPermission(permissions, 'manage-bio-link-builder')) {
            bioLinkChildren.push({
                title: t('Bio Link'),
                href: route('link-bio-builder.index')
            });
        }
    }
    
    if (bioLinkChildren.length > 0) {
        items.push({
            title: t('Bio Link'),
            icon: LinkIcon,
            children: bioLinkChildren,
            defaultOpen: true,
            badge: (window as any).isDemo ? { label: 'New', variant: 'default' } : undefined,
            order: 50,
        });
    }

    items.push({
        title: t('QR Code'),
        icon: QrCode,
        children: [], // Will be populated by packages
        order: 60,
        collectQrCodeMenus: true,
    });

    // Staff section
    const staffChildren = [];
    if (hasPermission(permissions, 'manage-users')) {
        staffChildren.push({
            title: t('Users'),
            href: route('users.index')
        });
    }
    if (hasPermission(permissions, 'manage-roles')) {
        staffChildren.push({
            title: t('Roles'),
            href: route('roles.index')
        });
    }
    if (staffChildren.length > 0) {
        items.push({
            title: t('Staff'),
            icon: Users,
            children: staffChildren,
            order: 80,
        });
    }

    // Contacts
    if (hasPermission(permissions, 'manage-contacts')) {
        items.push({
            title: t('Contacts'),
            href: route('contacts.index'),
            icon: MessageSquare,
            order: 85,
        });
    }

    // Appointments
    if (hasPermission(permissions, 'manage-appointments')) {
        items.push({
            title: t('Appointments'),
            href: route('appointments.index'),
            icon: CalendarDays,
            order: 90,
        });
    }

    // Calendar
    if (hasPermission(permissions, 'manage-calendar')) {
        items.push({
            title: t('Calendar'),
            href: route('calendar.index'),
            icon: Calendar,
            order: 95,
        });
    }


    // Media Library
    if (hasPermission(permissions, 'manage-media')) {
        items.push({
            title: t('Media Library'),
            href: route('media-library'),
            icon: Image,
            order: 100,
        });
    }
    
   
    // Google Wallet - Check plan feature only
    const hasGoogleWalletFeature = userPlan?.features?.google_wallet === true;
    
    if (hasGoogleWalletFeature) {
        if (hasPermission(permissions, 'manage-google-wallet')) {
            items.push({
                title: t('Google Wallet'),
                href: route('google-wallet.index'),
                icon: Wallet,
                order: 110,
            });
        }
    }

    // NFC Cards - Check global setting
    const nfcCardEnabled = nfcCardSettings?.is_enabled === true;
    
    if (nfcCardEnabled) {
        const nfcCardChildren = [];
        if (hasPermission(permissions, 'manage-nfc-cards') || hasPermission(permissions, 'order-nfc-cards')) {
            nfcCardChildren.push({
                title: t('NFC Cards'),
                href: route('nfc-cards.index')
            });
        }
        if (hasPermission(permissions, 'manage-nfc-cards') || hasPermission(permissions, 'order-nfc-cards')) {
            nfcCardChildren.push({
                title: t('My Order Requests'),
                href: route('nfc-cards.order-requests')
            });
        }
        if (nfcCardChildren.length > 0) {
            items.push({
                title: t('NFC Cards'),
                icon: Nfc,
                children: nfcCardChildren,
                defaultOpen: false,
                order: 120,
            });
        }
    }

    // Campaigns - Check global setting
    const campaignEnabled = campaignSettings?.is_enabled === true;
    
    if (campaignEnabled && hasPermission(permissions, 'manage-campaigns')) {
        items.push({
            title: t('Campaigns'),
            href: route('campaigns.index'),
            icon: BarChart,
            order: 130,
        });
    }

    // Plans
    const planChildren = [];
    if (hasPermission(permissions, 'manage-plans')) {
        planChildren.push({
            title: t('Plan'),
            href: route('plans.index')
        });
    }
    if (hasPermission(permissions, 'manage-plan-requests')) {
        planChildren.push({
            title: t('My Plan Requests'),
            href: route('plan-requests.index')
        });
    }
    if (hasPermission(permissions, 'manage-plan-orders')) {
        planChildren.push({
            title: t('My Plan Orders'),
            href: route('plan-orders.index')
        });
    }
    if (planChildren.length > 0) {
        items.push({
            title: t('Plans'),
            icon: CreditCard,
            children: planChildren,
            defaultOpen: false,
            order: 140,
        });
    }

    if (hasPermission(permissions, 'manage-referral')) {
        // Check if referral system is enabled from shared props
        // const { referralSettings } = usePage().props as any;
        if (referralSettings?.is_enabled !== false) {
            items.push({
                title: t('Referral Program'),
                href: route('referral.index'),
                icon: Gift,
                order: 150,
            });
        }
    }

    // Addons
    if ((window as any).isDemo && hasPermission(permissions, 'manage-addons')) {
        items.push({
            title: t('Addons'),
            href: route('addons.index'),
            icon: Package,
            badge: (window as any).isDemo ? { label: 'Premium', variant: 'default' } : undefined,
            order: 160,
        });
    }

    // Broadcast Emails - Check plan feature
    const hasBroadcastEmailFeature = userPlan?.features?.broadcast_email === true;
    
    if (hasBroadcastEmailFeature) {
        items.push({
            title: t('Broadcast Emails'),
            href: route('broadcast-emails.index'),
            icon: Mails,
            order: 165,
        });
    }

    // Package menus are now loaded automatically in menu.ts

    // Show settings menu if user has any settings permission or is company user
    const settingsPermissions = [
        'manage-settings',
        'manage-system-settings', 
        'manage-email-settings',
        'manage-brand-settings',
        'manage-company-settings',
        'manage-storage-settings',
        'manage-payment-settings',
        'manage-currency-settings',
        'manage-recaptcha-settings',
        'manage-chatgpt-settings',
        'manage-cookie-settings',
        'manage-seo-settings',
        'manage-cache-settings',
        'manage-webhook-settings',
        'manage-google-wallet-settings',
        'settings' // Add general settings permission
    ];
    
    const hasAnySettingsPermission = settingsPermissions.some(permission => 
        hasPermission(permissions, permission)
    );
    
    // Always show settings for company users or if they have any settings permission
    if (hasAnySettingsPermission || auth.user?.type === 'company') {
        items.push({
            title: t('Settings'),
            href: route('settings'),
            icon: Settings,
            order: 1000,
        });
    }

    // Sort items by order
    return items.sort((a, b) => (a.order || 999) - (b.order || 999));
};