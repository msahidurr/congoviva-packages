import { type ThemeColor } from '@/hooks/use-appearance';
import { type LayoutPosition } from '@/contexts/LayoutContext';
import { type Appearance } from '@/hooks/use-appearance';

// Define the brand settings interface
export interface BrandSettings {
  logoDark: string;
  logoLight: string;
  favicon: string;
  titleText: string;
  footerText: string;
  themeColor: ThemeColor;
  customColor: string;
  sidebarVariant: string;
  sidebarStyle: string;
  layoutDirection: LayoutPosition;
  themeMode: Appearance;
}

// Default brand settings
export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoDark: '/images/logos/logo-dark.png',
  logoLight: '/images/logos/logo-light.png',
  favicon: '/images/logos/favicon.ico',
  titleText: 'vCard',
  footerText: '© 2025 vCard. All rights reserved.',
  themeColor: 'green',
  customColor: '#10b77f',
  sidebarVariant: 'inset',
  sidebarStyle: 'plain',
  layoutDirection: 'left',
  themeMode: 'light',
};

// Get brand settings from props or localStorage as fallback
export const getBrandSettings = (userSettings?: Record<string, string>, imageUrlPrefix: string = window.location.origin): BrandSettings => {
  if (userSettings) {
    const getFullUrl = (path: string) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      
      const cleanPath = path.replace(/^\/?/, '');
      
      // Default images
      if (cleanPath.startsWith('images/')) {
        return `${imageUrlPrefix}/${cleanPath}`;
      }
      
      // Storage type wise media loading
      if (imageUrlPrefix.includes('amazonaws.com') || imageUrlPrefix.includes('wasabisys.com')) {
        // AWS/Wasabi - direct cloud URL
        return `${imageUrlPrefix}/${cleanPath}`;
      } else {
        // Local storage - add /storage/ prefix
        return `${imageUrlPrefix}/storage/${cleanPath}`;
      }
    };

    const layoutDirection = userSettings.layoutDirection === 'ltr' ? 'left' : 
                           userSettings.layoutDirection === 'rtl' ? 'right' : 
                           (userSettings.layoutDirection as LayoutPosition) || DEFAULT_BRAND_SETTINGS.layoutDirection;

    return {
      logoDark: userSettings.logoDark ? getFullUrl(userSettings.logoDark) : `${imageUrlPrefix}/${DEFAULT_BRAND_SETTINGS.logoDark}`,
      logoLight: userSettings.logoLight ? getFullUrl(userSettings.logoLight) : `${imageUrlPrefix}/${DEFAULT_BRAND_SETTINGS.logoLight}`,
      favicon: userSettings.favicon ? getFullUrl(userSettings.favicon) : `${imageUrlPrefix}/${DEFAULT_BRAND_SETTINGS.favicon}`,
      titleText: userSettings.titleText || DEFAULT_BRAND_SETTINGS.titleText,
      footerText: userSettings.footerText || DEFAULT_BRAND_SETTINGS.footerText,
      themeColor: (userSettings.themeColor as ThemeColor) || DEFAULT_BRAND_SETTINGS.themeColor,
      customColor: userSettings.customColor || DEFAULT_BRAND_SETTINGS.customColor,
      sidebarVariant: userSettings.sidebarVariant || DEFAULT_BRAND_SETTINGS.sidebarVariant,
      sidebarStyle: userSettings.sidebarStyle || DEFAULT_BRAND_SETTINGS.sidebarStyle,
      layoutDirection: layoutDirection,
      themeMode: (userSettings.themeMode as Appearance) || DEFAULT_BRAND_SETTINGS.themeMode,
    };
  }

  return {
    ...DEFAULT_BRAND_SETTINGS,
    logoDark: `${imageUrlPrefix}/${DEFAULT_BRAND_SETTINGS.logoDark}`,
    logoLight: `${imageUrlPrefix}/${DEFAULT_BRAND_SETTINGS.logoLight}`,
    favicon: `${imageUrlPrefix}/${DEFAULT_BRAND_SETTINGS.favicon}`,
  };
};