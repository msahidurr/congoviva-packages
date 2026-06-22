import { type NavItem } from '@/types';
import { getSuperAdminMenuItems } from './menus/superadmin-menu';
import { getCompanyMenuItems } from './menus/company-menu';
import { hasPermission } from '@/utils/authorization';
// Cache for package menus to avoid continuous loading
let packageMenusCache: { [key: string]: NavItem[] } = {};
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Auto-load package menus from enabled addons
const getPackageMenuItems = async (userRole: string, t: any, permissions: any[] = [], enabledAddons: any[] = []): Promise<NavItem[]> => {
    const packageMenus: NavItem[] = [];
    
    for (const addon of enabledAddons) {
        try {
            const menuType = userRole === 'superadmin' ? 'superadmin-menu' : 'company-menu';
            
            const addonMenu = await import(`../../../packages/workdo/${addon.package_name}/src/resources/js/menus/${menuType}.ts`);
            const menuConfig = addonMenu.default;
            
            if (!menuConfig.permission || hasPermission(permissions, menuConfig.permission)) {
               if (userRole === 'superadmin') {
                    packageMenus.push({
                        title: t(menuConfig.title),
                        href: menuConfig.href,
                        icon: menuConfig.icon,
                        order: menuConfig.order || 500,
                        badge: {
                            label: t('Addon'),
                            variant: 'secondary'
                        }
                    });
                } else {
                    packageMenus.push({
                        title: t(menuConfig.title),
                        icon: menuConfig.icon,
                        href: menuConfig.href,
                        order: menuConfig.order || 500,
                        badge: {
                            label: t('Addon'),
                            variant: 'secondary'
                        },
                        children: menuConfig.children?.map((child: any) => ({
                            title: t(child.title),
                            href: child.href
                        }))
                    });
                }
            }
        } catch (e) {
            // Silently ignore missing addon menus
        }
    }
    
    return packageMenus;
};

// Function to clear menu cache (call after addon upload/enable/disable)
export const clearMenuCache = () => {
    packageMenusCache = {};
    lastFetchTime = 0;
};

export const getMenuItems = async (userRole: string, t: any, permissions: any[] = [], auth: any = null, referralSettings: any = null, nfcCardSettings: any = null, campaignSettings: any = null, directorySettings: any = null, googleWalletGlobalSettings: any = null): Promise<NavItem[]> => {
    const isDemo = (window as any).isDemo;
    
    let menuItems: NavItem[] = [];
    
    if (userRole === 'superadmin') {
        menuItems = getSuperAdminMenuItems(t, permissions);
    } else {
        menuItems = getCompanyMenuItems(t, permissions, auth, referralSettings, nfcCardSettings, campaignSettings, directorySettings, googleWalletGlobalSettings);
        
        if (!isDemo) {
            menuItems = menuItems.filter(item => item.title !== t('QR Code'));
        } 
    }
    
    const enabledAddons = auth?.enabledAddons || [];
    const packageMenus = await getPackageMenuItems(userRole, t, permissions, enabledAddons);
    
    if (userRole === 'company' && isDemo) {
        const qrCodeMenuIndex = menuItems.findIndex(item => item.title === t('QR Code'));
        if (qrCodeMenuIndex !== -1) {
            const qrCodeChildren = [...(menuItems[qrCodeMenuIndex].children || [])];
            
            for (const addon of enabledAddons) {
                try {
                    const addonMenu = await import(`../../../packages/workdo/${addon.package_name}/src/resources/js/menus/company-menu.ts`);
                    const menuConfig = addonMenu.default;
                    
                    if (!menuConfig.permission || hasPermission(permissions, menuConfig.permission)) {
                        qrCodeChildren.push({
                            title: menuConfig.title,
                            icon: menuConfig.icon,
                            children: menuConfig.children?.map((child: any) => ({
                                title: t(child.title),
                                href: child.href
                            })) || []
                        });
                    }
                } catch (e) {}
            }
            
            menuItems[qrCodeMenuIndex].children = qrCodeChildren;
            menuItems[qrCodeMenuIndex].badge = {
                label: t('Addon'),
                variant: 'secondary'
            };
        }
    }
    
    if (userRole !== 'company' || !isDemo) {
        menuItems.push(...packageMenus);
    }
    
    return menuItems.sort((a, b) => (a.order || 999) - (b.order || 999));
};