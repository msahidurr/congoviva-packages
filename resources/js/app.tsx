import '../css/app.css';
import '../css/dark-mode.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import { LayoutProvider } from './contexts/LayoutContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { BrandProvider } from './contexts/BrandContext';
import { ModalStackProvider } from './contexts/ModalStackContext';
import { initializeTheme } from './hooks/use-appearance';
import { CustomToast } from './components/custom-toast';
import { initializeGlobalSettings } from './utils/globalSettings';
import { initPerformanceMonitoring, lazyLoadImages } from './utils/performance';
import './i18n'; // Import i18n configuration
import './utils/axios-config'; // Import axios configuration
import i18n from './i18n';

if (typeof window !== 'undefined') {
    const originalAppendChild = document.head.appendChild;

    document.head.appendChild = function (node: any) {
        if (node?.tagName === 'SCRIPT' && node.src?.includes('envato.workdo.io')) {
            console.warn('Envato verify.js blocked');
            return node;
        }
        return originalAppendChild.call(this, node);
    };
}
// Initialize performance monitoring
initPerformanceMonitoring();

// Initialize lazy loading of images when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
});

// Add event listener for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Re-apply theme when system preference changes
    const savedTheme = localStorage.getItem('themeSettings');
    if (savedTheme) {
        const themeSettings = JSON.parse(savedTheme);
        if (themeSettings.appearance === 'system') {
            initializeTheme();
        }
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const localPageGlob = import.meta.glob('./pages/**/*.tsx');
const eagerAuthPageGlob = import.meta.glob('./pages/auth/**/*.tsx', { eager: true });
const addonPageGlob = import.meta.glob('../../packages/workdo/*/src/resources/js/pages/**/*.tsx');

const resolveInertiaPage = async (name: string) => {
    const localPagePath = `./pages/${name}.tsx`;
    const eagerAuthModule = eagerAuthPageGlob[localPagePath];

    if (eagerAuthModule) {
        return eagerAuthModule;
    }

    const localPageLoader = localPageGlob[localPagePath];
    if (localPageLoader) {
        return await localPageLoader();
    }

    const [addonName, ...pagePath] = name.split('/');
    const fullPagePath = pagePath.length > 0 ? pagePath.join('/') : 'index';
    const addonPagePath = `../../packages/workdo/${addonName}/src/resources/js/pages/${fullPagePath}.tsx`;
    const addonPageLoader = addonPageGlob[addonPagePath];

    if (addonPageLoader) {
        return await addonPageLoader();
    }

    console.error(`Addon page not found in glob: ${addonPagePath}`);
    throw new Error(`Page not found: ${name}`);
};

createInertiaApp({
    title: (title) => {
        // Get titleText from globalSettings if available
        const globalSettings = (window as any).page?.props?.globalSettings;
        const customTitle = globalSettings?.titleText || appName;
        return title ? `${title} - ${customTitle}` : customTitle;
    },    
    resolve: resolveInertiaPage,
    setup({ el, App, props }) {
        const root = createRoot(el);
        
        // Make page data globally available for axios interceptor
        try {
            (window as any).page = props.initialPage;
        } catch (e) {
            console.warn('Could not set global page data:', e);
        }
        
        // Set demo mode globally
        try {
            (window as any).isDemo = props.initialPage.props?.is_demo || false;
        } catch (e) {
            // Ignore errors
        }
        
        // Initialize global settings from shared data
        const globalSettings = props.initialPage.props.globalSettings || {};
        if (Object.keys(globalSettings).length > 0) {
            initializeGlobalSettings(globalSettings);
            
            // Set initial document title
            if (globalSettings.titleText) {
                document.title = globalSettings.titleText;
            }
        }
        
        // Always initialize theme with available settings
        initializeTheme(globalSettings);

        // Create a memoized render function to prevent unnecessary re-renders
        const renderApp = (appProps: any) => {
            const currentGlobalSettings = appProps.initialPage.props.globalSettings || {};
            const user = appProps.initialPage.props.auth?.user;
            
            return (
                <ModalStackProvider>
                    <LayoutProvider>
                        <SidebarProvider>
                            <BrandProvider globalSettings={currentGlobalSettings} user={user}>
                                <Suspense fallback={
                                    <div style={{
                                        position: 'fixed',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--background)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ position: 'relative', width: '3rem', height: '3rem' }}>
                                                <div style={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    border: '4px solid var(--muted)',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    borderTopColor: 'var(--primary)'
                                                }}></div>
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    width: '3rem',
                                                    height: '3rem',
                                                    border: '4px solid transparent',
                                                    borderRadius: '50%',
                                                    animation: 'ping 1s cubic-bezier(0,0,.2,1) infinite',
                                                    borderTopColor: 'var(--primary)',
                                                    opacity: 0.2
                                                }}></div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)' }}>Loading...</h3>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Please wait while we prepare your webapp...</p>
                                            </div>
                                        </div>
                                    </div>
                                }>
                                    <App {...appProps} />
                                </Suspense>
                                <CustomToast />
                            </BrandProvider>
                        </SidebarProvider>
                    </LayoutProvider>
                </ModalStackProvider>
            );
        };
        
        // Initial render
        // root.render(renderApp(props));
         i18n.on('initialized', () => {
            root.render(renderApp(props));
        });
        
        if (i18n.isInitialized) {
            root.render(renderApp(props));
        }
        
        // Update global page data on navigation and re-render with new settings
        router.on('navigate', (event) => {
            try {
                (window as any).page = event.detail.page;
                
                // Re-initialize global settings with updated data
                const updatedGlobalSettings = event.detail.page.props.globalSettings || {};
                if (Object.keys(updatedGlobalSettings).length > 0) {
                    initializeGlobalSettings(updatedGlobalSettings);
                    
                    // Update document title if titleText changed
                    if (updatedGlobalSettings.titleText) {
                        document.title = updatedGlobalSettings.titleText;
                    }
                }
                
                // Re-render with updated props including globalSettings
                root.render(renderApp({ initialPage: event.detail.page }));
                
                // Force dark mode check on navigation
                const savedTheme = localStorage.getItem('themeSettings');
                if (savedTheme) {
                    const themeSettings = JSON.parse(savedTheme);
                    const isDark = themeSettings.appearance === 'dark' || 
                        (themeSettings.appearance === 'system' && 
                         window.matchMedia('(prefers-color-scheme: dark)').matches);
                    document.documentElement.classList.toggle('dark', isDark);
                    document.body.classList.toggle('dark', isDark);
                }
            } catch (e) {
                console.error('Navigation error:', e);
            }
        });
    },
    progress: {
        color: '#4B5563',
    },
});

// Fallback theme initialization if no global settings are available
if (typeof window !== 'undefined') {
    // Check if we have global settings available
    const hasGlobalSettings = window.appSettings || document.querySelector('meta[name="global-settings"]');
    if (!hasGlobalSettings) {
        initializeTheme();
    }
}

// Initialize direction from localStorage if available
const initializeDirection = () => {
    const savedDirection = localStorage.getItem('layoutDirection');
    if (savedDirection) {
        document.documentElement.dir = savedDirection;
        document.documentElement.setAttribute('dir', savedDirection);
    }
};

// Initialize direction on page load
initializeDirection();
