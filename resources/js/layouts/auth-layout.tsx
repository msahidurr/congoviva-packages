import { Head } from '@inertiajs/react';
import { CreditCard, Users, Smartphone, QrCode } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useBrand } from '@/contexts/BrandContext';
import { useAppearance, THEME_COLORS } from '@/hooks/use-appearance';
import { useFavicon } from '@/hooks/use-favicon';
import CookieConsent from '@/components/cookie-consent';
import { usePage } from '@inertiajs/react';

// function hexToAdjustedRgba(hex, opacity = 1, adjustFactor = 0) {
//   hex = hex.replace('#', '');
//   const r = parseInt(hex.slice(0, 2), 16);
//   const g = parseInt(hex.slice(2, 4), 16);
//   const b = parseInt(hex.slice(4, 6), 16);

//   adjustFactor = Math.max(-1, Math.min(1, adjustFactor));

//   const adjust = (c) => adjustFactor < 0
//     ? Math.floor(c * (1 + adjustFactor))
//     : Math.floor(c + (255 - c) * adjustFactor);

//   const rr = adjust(r);
//   const gg = adjust(g);
//   const bb = adjust(b);

//   if (opacity === 1) {
//     return `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
//   }

//   return `rgba(${rr}, ${gg}, ${bb}, ${opacity})`;
// }


function hexToAdjustedRgba(hex, opacity = 1, adjust = 0) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const getF = (ch) =>
        typeof adjust === "number" ? clamp(adjust) : clamp(adjust[ch] ?? 0);
    const adj = (c, f) =>
        f < 0 ? Math.floor(c * (1 + f)) : Math.floor(c + (255 - c) * f);
    const rr = adj(r, getF("r"));
    const gg = adj(g, getF("g"));
    const bb = adj(b, getF("b"));
    return opacity === 1
        ? `#${rr.toString(16).padStart(2, "0")}${gg
            .toString(16)
            .padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`.toUpperCase()
        : `rgba(${rr}, ${gg}, ${bb}, ${opacity})`;
}


interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    icon?: ReactNode;
    status?: string;
    statusType?: 'success' | 'error';
}

export default function AuthLayout({
    children,
    title,
    description,
    icon,
    status,
    statusType = 'success',
}: AuthLayoutProps) {
    useFavicon();
    const { t } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const { logoLight, logoDark, themeColor, customColor } = useBrand();
    const { appearance } = useAppearance();
    const { settings = {} } = usePage().props as any;
    
    // Use global appearance setting from super admin
    const globalAppearance = settings.defaultAppearance || settings.theme || appearance;
    const primaryColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
    // Get footer text - use same approach as other auth pages
    const footerText = settings.footerText || t('VCard');

    useEffect(() => {
        setMounted(true);
        // Apply theme class to document for global dark mode
        if (globalAppearance === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Force re-render for Firefox compatibility
        setTimeout(() => {
            setMounted(false);
            setTimeout(() => setMounted(true), 10);
        }, 50);
    }, [globalAppearance]);

    return (
        <>
        <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-slate-900">
            <Head title={title} />
            
            {/* Enhanced Background Design */}
            <div className="absolute inset-0">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
                
                {/* Elegant Pattern Overlay */}
                <div 
                    className="absolute inset-0 opacity-70" 
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 70%, ${primaryColor} 1px, transparent 1px)`,
                        backgroundSize: '80px 80px'
                    }}
                ></div>
            </div>
            
            {/* Language Switcher - Top Right */}
            <div className="absolute top-6 right-6 z-10 md:block hidden">
                <LanguageSwitcher />
            </div>

            <div className="flex items-center justify-center min-h-screen p-6">
                <div 
                    className={`w-full max-w-md transition-all duration-700 ${
                        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                >
                    {/* Logo */}
                    <div className="text-center mb-5">
                        <div className="relative lg:inline-block lg:px-6">
                            {(() => {
                                const isDark = document.documentElement.classList.contains('dark');
                                const currentLogo = isDark ? logoLight : logoDark;
                                return currentLogo ? (
                                    <img src={currentLogo} alt="Logo" className="w-auto mx-auto" />
                                ) : (
                                    <CreditCard className="h-8 w-8 mx-auto text-gray-700 dark:text-gray-300" />
                                );
                            })()}
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="relative">
                        {/* Corner accents */}
                        <div 
                            className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 rounded-tl-md" 
                            style={{ borderColor: primaryColor }}
                        ></div>
                        <div 
                            className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 rounded-br-md" 
                            style={{ borderColor: primaryColor }}
                        ></div>

                        <div className="bg-white dark:!bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg lg:p-8 p-4 lg:pt-5 shadow-sm">
                            {/* Header */}
                            <div className="text-center mb-4">
                                {icon && (
                                    <div 
                                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                                        style={{ backgroundColor: hexToAdjustedRgba(primaryColor, 1, 0.12) }}
                                    >
                                        {icon}
                                    </div>
                                )}
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1.5 tracking-wide">{title}</h1>
                                <div 
                                    className="w-12 h-px mx-auto mb-2.5" 
                                    style={{ backgroundColor: primaryColor }}
                                ></div>
                                {description && (
                                    <p className="text-gray-700 dark:text-slate-400 text-sm">{description}</p>
                                )}
                            </div>
                            
                            {status && (
                                <div className={`mb-6 text-center text-sm font-medium ${
                                    statusType === 'success' 
                                        ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30' 
                                        : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
                                } p-3 rounded-lg border`}>
                                    {status}
                                </div>
                            )}
                            
                            <div>
                                {children}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6">
                            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-md px-4 py-2 border border-gray-200 dark:border-slate-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">{footerText}</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>

        <CookieConsent />
        </>
    );
}