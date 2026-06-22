import { useState, useEffect, useMemo } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Save, RefreshCw, Globe, Edit3, Package, Trash2, Power, Plus, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { TranslationItem } from '@/components/ui/translation-item';
import { Pagination } from '@/components/ui/pagination';
import { SearchInput } from '@/components/ui/search-input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

interface LanguageManageProps {
    currentLanguage: string;
    translations: {
        current_page: number;
        data: Record<string, string>;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    enabledPackages: Array<{
        package_name: string;
        name: string;
    }>;
    availableLanguages: Array<{
        code: string;
        name: string;
        countryCode: string;
        flag: string;
        enabled?: boolean;
    }>;
    isCurrentLanguageEnabled: boolean;
    filters: {
        search: string;
    };
}

export default function LanguageManage({
    currentLanguage,
    translations: paginatedTranslations,
    enabledPackages,
    availableLanguages,
    isCurrentLanguageEnabled,
    filters
}: LanguageManageProps) {
    const { t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
    const [translations, setTranslations] = useState<Record<string, string>>(paginatedTranslations.data || {});
    const [packageTranslations, setPackageTranslations] = useState<Record<string, Record<string, string>>>({});
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeSource, setActiveSource] = useState('general');
    const [loadingPackages, setLoadingPackages] = useState<Record<string, boolean>>({});
    const [sourceSearchTerm, setSourceSearchTerm] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [isToggling, setIsToggling] = useState(false);
    const [packagePage, setPackagePage] = useState(1);
    const packagePerPage = 50;

    // Get current translations based on active source
    const currentTranslations = useMemo(() => {
        if (activeSource === 'general') {
            return Object.entries(paginatedTranslations.data || {});
        } else {
            const currentPackageTranslations = packageTranslations[activeSource] || {};
            const allPackageTranslations = Object.entries(currentPackageTranslations);
            // Filter by search term for package translations
            const filteredTranslations = searchTerm
                ? allPackageTranslations.filter(([key, value]) =>
                    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    value.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : allPackageTranslations;

            const startIndex = (packagePage - 1) * packagePerPage;
            return filteredTranslations.slice(startIndex, startIndex + packagePerPage);
        }
    }, [paginatedTranslations.data, packageTranslations[activeSource], activeSource, packagePage, packagePerPage, searchTerm]);

    // Handle search with debounce
    const handleSearch = () => {
        const params = new URLSearchParams(window.location.search);
        params.set('search', searchTerm);
        params.set('page', '1');
        params.set('lang', selectedLanguage);
        router.get(route('manage-language'), Object.fromEntries(params), { preserveState: true });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (activeSource === 'general') {
                handleSearch();
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Reload package translations when language changes
    useEffect(() => {
        if (activeSource !== 'general') {
            loadPackageTranslations(activeSource);
        }
    }, [selectedLanguage, activeSource]);

    // Handle language change
    const handleLanguageChange = (languageCode: string) => {
        const proceedWithChange = () => {
            setSelectedLanguage(languageCode);
            setPackageTranslations({}); // Clear package translations cache

            // Reload page with new language to get fresh translations
            const params = new URLSearchParams(window.location.search);
            params.set('lang', languageCode);
            if (activeSource === 'general') {
                params.set('page', '1'); // Reset to first page
            }
            router.get(route('manage-language'), Object.fromEntries(params), { preserveState: false });
        };

        if (hasChanges) {
            if (confirm('You have unsaved changes. Do you want to discard them?')) {
                proceedWithChange();
            }
        } else {
            proceedWithChange();
        }
    };

    // Load general translations
    const loadGeneralTranslations = async (languageCode: string) => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({ lang: languageCode, search: searchTerm, page: '1' });
            const response = await fetch(`${route('manage-language')}?${params}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const result = await response.json();
                const newTranslations = result.props?.translations || result.translations || {};

                setTranslations(newTranslations.data || {});

                // Update pagination data completely
                Object.assign(paginatedTranslations, {
                    data: newTranslations.data || {},
                    current_page: newTranslations.current_page || 1,
                    last_page: newTranslations.last_page || 1,
                    total: newTranslations.total || 0,
                    from: newTranslations.from || 0,
                    to: newTranslations.to || 0
                });
            }
        } catch (error) {
            toast.error('Failed to load translations');
        } finally {
            setIsLoading(false);
        }
    };

    // Load package translations
    const loadPackageTranslations = async (packageName: string, forceReload = false) => {
        if (!forceReload && packageTranslations[packageName] && Object.keys(packageTranslations[packageName]).length > 0) return; // Already loaded

        setLoadingPackages(prev => ({ ...prev, [packageName]: true }));
        try {
            const url = route('languages.package.translations', { locale: selectedLanguage, packageName });
            const response = await fetch(`${url}?t=${Date.now()}`);

            if (response.ok) {
                const data = await response.json();
                setPackageTranslations(prev => ({
                    ...prev,
                    [packageName]: data.translations || {}
                }));
            }
        } catch (error) {
            toast.error('Failed to load package translations');
        } finally {
            setLoadingPackages(prev => ({ ...prev, [packageName]: false }));
        }
    };

    // Handle source change
    const handleSourceChange = (value: string) => {
        setActiveSource(value);
        setPackagePage(1); // Reset to first page when switching sources
        if (value !== 'general') {
            loadPackageTranslations(value);
        }
    };

    // Handle package pagination
    const handlePackagePageChange = (page: number) => {
        setPackagePage(page);
    };

    // Handle translation value change
    const handleTranslationChange = (key: string, value: string) => {
        // Update both states immediately
        setTranslations(prev => ({
            ...prev,
            [key]: value
        }));
        paginatedTranslations.data[key] = value;
        setHasChanges(true);
    };

    // Handle package translation change
    const handlePackageTranslationChange = (packageName: string, key: string, value: string) => {
        setPackageTranslations(prev => ({
            ...prev,
            [packageName]: {
                ...prev[packageName],
                [key]: value
            }
        }));
        setHasChanges(true);
    };

    // Handle delete language
    const handleDeleteLanguage = async () => {
        try {
            const response = await fetch(route('languages.delete', selectedLanguage), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast.success('Language deleted successfully');
                setShowDeleteConfirm(false);
                // Redirect to English after deletion
                router.get(route('manage-language'), { lang: 'en' });
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete language');
            }
        } catch (error) {
            toast.error('Failed to delete language');
        }
    };

    // Handle toggle language status
    const handleToggleLanguage = async () => {
        setIsToggling(true);
        try {
            const response = await fetch(route('languages.toggle', selectedLanguage), {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                toast.success('Language status updated successfully');
                // Redirect to English after disabling current language
                router.get(route('manage-language'), { lang: 'en' });
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to update language status');
            }
        } catch (error) {
            toast.error('Failed to update language status');
        } finally {
            setIsToggling(false);
        }
    };

    // Save translations
    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (activeSource === 'general') {
                const response = await fetch(route('languages.update', { locale: selectedLanguage }), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ translations })
                });
                if (response.ok) {
                    toast.success('Translations saved successfully');
                    setHasChanges(false);
                    // Update pagination data with current translations and preserve pagination info
                    paginatedTranslations.data = { ...translations };
                } else {
                    toast.error('Failed to save translations');
                }
            } else {
                try {
                    const response = await fetch(route('languages.package.update', { locale: selectedLanguage, packageName: activeSource }), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                        body: JSON.stringify({ translations: packageTranslations[activeSource] })
                    });
                    
                    if (response.ok) {
                        toast.success('Package translations saved successfully');
                        setHasChanges(false);
                        // Keep the updated translations in state after save
                        // No need to reload as the state already has the correct values
                    } else {
                        const errorText = await response.text();
                        console.error('Package save failed:', response.status, errorText);
                        toast.error('Failed to save package translations');
                    }
                } catch (error) {
                    console.error('Package save error:', error);
                    toast.error('Package translation route not available');
                }
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save translations');
        } finally {
            setIsSaving(false);
        }
    };

    const currentLang = availableLanguages.find(lang => lang.code === selectedLanguage);

    return (
        <PageTemplate
            title="Language Management"
            description="Manage translations for different languages"
            url="manage-language"
            actions={[
                ...(selectedLanguage !== 'en' ? [
                    {
                        label: isToggling ? 'Updating...' : (isCurrentLanguageEnabled ? 'Disable Language' : 'Enable Language'),
                        icon: isToggling ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />,
                        variant: 'outline' as const,
                        onClick: handleToggleLanguage
                    },
                    {
                        label: 'Delete Language',
                        icon: <Trash2 className="h-4 w-4" />,
                        variant: 'destructive' as const,
                        onClick: () => setShowDeleteConfirm(true)
                    }
                ] : []),
                {
                    label: 'Save Changes',
                    icon: isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />,
                    variant: 'default' as const,
                    onClick: handleSave
                }
            ]
            }
        >
            <Head title="Languages" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Translation Source Sidebar */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Package className="h-4 w-4" />
                            Translation Source
                        </CardTitle>
                        <CardDescription>
                            Select translation source to edit
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="relative mb-3">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search packages..."
                                value={sourceSearchTerm}
                                onChange={(e) => setSourceSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button
                            variant={activeSource === 'general' ? "default" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => handleSourceChange('general')}
                            disabled={isLoading}
                        >
                            <Globe className="h-4 w-4" />
                            <span>General</span>
                            {activeSource === 'general' && (
                                <Edit3 className="h-3 w-3 ml-auto" />
                            )}
                        </Button>
                        {enabledPackages
                            .filter(pkg =>
                                pkg.name.toLowerCase().includes(sourceSearchTerm.toLowerCase()) ||
                                pkg.package_name.toLowerCase().includes(sourceSearchTerm.toLowerCase())
                            )
                            .map((pkg) => (
                                <Button
                                    key={pkg.package_name}
                                    variant={activeSource === pkg.package_name ? "default" : "ghost"}
                                    className="w-full justify-start gap-2"
                                    onClick={() => handleSourceChange(pkg.package_name)}
                                    disabled={isLoading}
                                >
                                    <Package className="h-4 w-4" />
                                    <span>{pkg.name}</span>
                                    {activeSource === pkg.package_name && (
                                        <Edit3 className="h-3 w-3 ml-auto" />
                                    )}
                                </Button>
                            ))}
                    </CardContent>
                </Card>

                {/* Translation Editor */}
                <Card className="lg:col-span-3">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    {currentLang?.flag} {currentLang?.name} Translations
                                </CardTitle>
                                <CardDescription>
                                    Edit translation keys and values for {currentLang?.name}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <SearchInput
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    onSearch={handleSearch}
                                    placeholder="Search translations..."
                                />
                                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableLanguages.map((language) => {
                                            const isEnabled = language.enabled === true || (language.enabled === undefined && !language.hasOwnProperty('enabled'));
                                            return (
                                                <SelectItem key={language.code} value={language.code}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{language.flag}</span>
                                                        <span className={!isEnabled ? 'text-muted-foreground' : ''}>
                                                            {language.name}
                                                        </span>
                                                        {!isEnabled && (
                                                            <Lock className="h-3 w-3 ml-auto text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {activeSource === 'general' && (
                            <div>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading translations...</span>
                                    </div>
                                ) : currentTranslations.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        {searchTerm ? 'No translations found matching your search.' : 'No translations available.'}
                                    </div>
                                ) : (
                                    <div className="border rounded-lg">
                                        <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 border-b font-medium text-sm">
                                            <div className="col-span-2">Translation Key</div>
                                            <div className="col-span-3">Translation Value</div>
                                        </div>
                                        <div className="max-h-[80vh] overflow-auto">
                                            {currentTranslations.map(([key, value]) => (
                                                <TranslationItem
                                                    key={key}
                                                    translationKey={key}
                                                    value={translations[key] !== undefined ? translations[key] : value}
                                                    onChange={(k, v) => handleTranslationChange(k, v)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!isLoading && paginatedTranslations.last_page > 1 && (
                                    <div className="mt-4">
                                        <Pagination
                                            data={paginatedTranslations}
                                            routeName="manage-language"
                                            filters={{ lang: selectedLanguage, search: searchTerm }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSource !== 'general' && (
                            <div>
                                {loadingPackages[activeSource] ? (
                                    <div className="flex items-center justify-center py-8">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading package translations...</span>
                                    </div>
                                ) : !packageTranslations[activeSource] || Object.keys(packageTranslations[activeSource]).length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        No translations found for this package.
                                    </div>
                                ) : (
                                    <div>
                                        <div className="border rounded-lg">
                                            <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 border-b font-medium text-sm">
                                                <div className="col-span-2">Translation Key</div>
                                                <div className="col-span-3">Translation Value</div>
                                            </div>
                                            <div className="max-h-[80vh] overflow-auto">
                                                {currentTranslations.map(([key, value]) => (
                                                    <TranslationItem
                                                        key={`${activeSource}-${key}`}
                                                        translationKey={key}
                                                        value={value}
                                                        onChange={(k, v) => handlePackageTranslationChange(activeSource, k, v)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {Object.keys(packageTranslations[activeSource]).length > packagePerPage && (
                                            <div className="mt-4">
                                                <div className="flex items-center justify-between px-2 py-4">
                                                    <div className="text-sm text-muted-foreground">
                                                        Showing {((packagePage - 1) * packagePerPage) + 1} to {Math.min(packagePage * packagePerPage, Object.keys(packageTranslations[activeSource]).length)} of {Object.keys(packageTranslations[activeSource]).length} results
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePackagePageChange(packagePage - 1)}
                                                            disabled={packagePage === 1}
                                                        >
                                                            Previous
                                                        </Button>
                                                        {Array.from({ length: Math.ceil(Object.keys(packageTranslations[activeSource]).length / packagePerPage) }, (_, i) => i + 1).map(page => (
                                                            <Button
                                                                key={page}
                                                                variant={page === packagePage ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handlePackagePageChange(page)}
                                                            >
                                                                {page}
                                                            </Button>
                                                        ))}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handlePackagePageChange(packagePage + 1)}
                                                            disabled={packagePage >= Math.ceil(Object.keys(packageTranslations[activeSource]).length / packagePerPage)}
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Language</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete the <strong>{selectedLanguage}</strong> language? This will remove all translation files and cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteLanguage}>
                            Delete Language
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>


        </PageTemplate>
    );
}
