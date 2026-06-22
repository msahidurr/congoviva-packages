import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import { CreateLanguageModal } from './create-language-modal';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Globe, Plus, Settings } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { hasRole } from '@/utils/authorization';


interface Language {
    code: string;
    name: string;
    countryCode: string;
    enabled?: boolean;
}

export function LanguageSwitcher() {
    const { i18n, t } = useTranslation();
    const { auth, availableLanguages, globalSettings } = usePage().props as any;
    const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const isAuthenticated = !!auth?.user;
    const userRoles = auth?.user?.roles?.map((role: any) => role.name) || [];
    const isSuperAdmin = isAuthenticated && hasRole('superadmin', userRoles);
    
    const isCompanyUser = isAuthenticated && auth?.user?.type === 'company';
    const isAuthPage = window.location.pathname.includes('/login') || 
                      window.location.pathname.includes('/register') || 
                      window.location.pathname.includes('/password') ||
                      window.location.pathname === '/';

    // Handle auth pages separately
    useEffect(() => {
        const systemDefaultLanguage = globalSettings?.defaultLanguage;
        if (isAuthPage && systemDefaultLanguage) {
            const languages = (availableLanguages || []).filter((l: any) => l.enabled !== false);
            const targetLang = systemDefaultLanguage;
            localStorage.setItem('selectedLanguage', targetLang);

            const lang = languages.find((l: Language) => l.code === targetLang) || languages[0];
            setCurrentLanguage(lang);

            if (i18n.language !== targetLang) {
                i18n.changeLanguage(targetLang);
            }
        }
    }, [isAuthPage, globalSettings?.defaultLanguage, availableLanguages]);
    
    // Handle authenticated users - get language from user table
    useEffect(() => {
        if (isAuthenticated && !isAuthPage && auth?.user?.lang) {
            const languages = (availableLanguages || []).filter((l: any) => l.enabled !== false);
            const targetLang = auth.user.lang; // Force user table language
            localStorage.setItem('selectedLanguage', targetLang);
            
            const lang = languages.find((l: Language) => l.code === targetLang) || languages[0];
            setCurrentLanguage(lang);
            
            if (i18n.language !== targetLang) {
                i18n.changeLanguage(targetLang);
            }
        }
    }, [isAuthenticated, isAuthPage, auth?.user?.lang, availableLanguages]);
    
    // Update current language when i18n language changes
    useEffect(() => {
        const languages = (availableLanguages || []).filter((l: any) => l.enabled !== false);
        const lang = languages.find((l: Language) => l.code === i18n.language) || languages[0];
        setCurrentLanguage(lang);
    }, [i18n.language, availableLanguages]);
    const handleLanguageChange = (languageCode: string) => {
        if (languageCode === 'manage_languages') {
            router.get(route('manage-language'), { lang: i18n.language });
            return;
        }
        if (languageCode === 'create_language') {
            setShowCreateModal(true);
            return;
        }

        const languages = availableLanguages || [];
        const lang = languages.find((l: Language) => l.code === languageCode);
        if (lang) {
            setCurrentLanguage(lang);
            i18n.changeLanguage(languageCode);
            localStorage.setItem('selectedLanguage', languageCode);
            
            // For auth pages, also set a cookie to persist the language choice
            if (isAuthPage) {
                document.cookie = `app_language=${languageCode}; path=/; max-age=31536000`;
            }
        }
    };
    return (
        <>
        <style>{`
            .language-scroll {
                max-height: 200px !important;
                overflow-y: auto !important;
                scrollbar-width: thin !important;
            }
            .language-scroll::-webkit-scrollbar {
                width: 6px !important;
            }
            .language-scroll::-webkit-scrollbar-thumb {
                background: #ccc !important;
                border-radius: 3px !important;
            }
        `}</style>
        <DropdownMenu key={JSON.stringify(availableLanguages)}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-md border shadow-sm bg-white">
                    <Globe className="h-4 w-4" />
                    {currentLanguage && (
                        <>
                            <span className="text-sm font-medium hidden md:inline-block">
                                {currentLanguage.name}
                            </span>
                            <ReactCountryFlag
                                countryCode={currentLanguage.countryCode}
                                svg
                                style={{ width: '1.2em', height: '1.2em' }}
                            />
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuGroup>
                    <div className="language-scroll">
                        {(availableLanguages || []).filter((language: any) => language.enabled !== false).map((language: Language) => (
                            <DropdownMenuItem
                                key={language.code}
                                onClick={() => handleLanguageChange(language.code)}
                                className={`flex items-center gap-2 ${currentLanguage?.code === language.code ? 'bg-accent' : ''}`}
                            >
                                <ReactCountryFlag
                                    countryCode={language.countryCode}
                                    svg
                                    style={{ width: '1.2em', height: '1.2em' }}
                                />
                                <span>{language.name}</span>
                                {currentLanguage?.code === language.code && (
                                    <span className="ml-auto text-xs text-muted-foreground">✓</span>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuGroup>
                {isSuperAdmin && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleLanguageChange('create_language')}
                            className="flex items-center justify-center gap-2 text-primary font-semibold cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            {t('Create Language')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleLanguageChange('manage_languages')}
                            className="flex items-center justify-center gap-2 text-primary font-semibold cursor-pointer"
                        >
                            <Settings className="h-4 w-4" />
                            {t('Manage Languages')}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
        <CreateLanguageModal
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                onSuccess={() => setShowCreateModal(false)}
            />
        </>
    );
}
