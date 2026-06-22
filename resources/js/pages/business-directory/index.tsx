import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { Search, Star, Eye, Phone, Mail, Globe, Filter, MapPin, Loader2, ChevronLeft, ChevronRight, Settings as SettingsIcon, BadgeCheck, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useFavicon } from '@/hooks/use-favicon';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import Header from '../landing-page/components/Header';
import Footer from '../landing-page/components/Footer';
import { businessTypeOptions } from '@/pages/vcard-builder/business-templates';

interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  clinic_address?: string;
}

interface ConfigSections {
  contact?: ContactInfo;
}

interface Business {
  id: number;
  name: string;
  business_type: string;
  slug: string;
  url_prefix: string;
  custom_domain?: string;
  domain_type?: string;
  is_featured: boolean;
  is_verified: boolean;
  rating: number;
  rating_count: number;
  view_count: number;
  directory_description?: string;
  config_sections: ConfigSections;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface BusinessData {
  data: Business[];
  links: PaginationLink[];
  meta: {
    from?: number;
    to?: number;
    total?: number;
  };
}

interface LandingSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    theme?: {
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
    };
  };
}

interface CustomPage {
  id: number;
  title: string;
  slug: string;
}

interface MenuItem {
  id: number;
  title: string;
  type: 'category' | 'filter' | 'link';
  value: string;
  icon: string;
  order: number;
  is_active: boolean;
  url?: string;
}

interface DirectorySettings {
  id?: number;
  title: string;
  description: string;
  menu_items: MenuItem[];
  config_sections: {
    theme: {
      primary_color: string;
      secondary_color: string;
      accent_color: string;
    };
    background_image?: string;
    use_background_image?: boolean;
    company?: {
      name: string;
      contact_email?: string;
      contact_phone?: string;
      contact_address?: string;
      description?: string;
    };
    hero?: {
      trust_badge: string;
      main_title: string;
      subtitle: string;
      features: Array<{
        icon: string;
        text: string;
      }>;
    };
    footer?: {
      description?: string;
      newsletter_title?: string;
      newsletter_subtitle?: string;
      links?: any;
      social_links?: Array<{
        name: string;
        icon: string;
        href: string;
      }>;
      section_titles?: {
        product: string;
        company: string;
        support: string;
        legal: string;
      };
    };
    section_order?: string[];
    section_visibility?: Record<string, boolean>;
  };
}

interface Props {
  businesses: BusinessData;
  categories: Array<{ value: string; label: string; count?: number }>;
  filters: {
    search?: string;
    category?: string;
  };
  settings: LandingSettings;

  directoryCustomPages: CustomPage[];
  directorySettings: DirectorySettings;
}

export default function BusinessDirectory({ businesses, categories, filters, settings, directoryCustomPages, directorySettings }: Props) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
  const [sortBy, setSortBy] = useState('views');
  const [isLoading, setIsLoading] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  
  // Apply favicon from brand settings
  useFavicon();
  
  // Get brand colors - prioritize directory settings over landing page settings
  const { themeColor, customColor } = useBrand();
  const directoryPrimaryColor = directorySettings?.config_sections?.theme?.primary_color;
  const directorySecondaryColor = directorySettings?.config_sections?.theme?.secondary_color;
  const directoryAccentColor = directorySettings?.config_sections?.theme?.accent_color;
  const configPrimaryColor = settings.config_sections?.theme?.primary_color;
  const configSecondaryColor = settings.config_sections?.theme?.secondary_color;
  const configAccentColor = settings.config_sections?.theme?.accent_color;
  
  const primaryColor = directoryPrimaryColor || configPrimaryColor || (themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS]);
  const secondaryColor = directorySecondaryColor || configSecondaryColor || '#3b82f6';
  const accentColor = directoryAccentColor || configAccentColor || '#8b5cf6';
  
  // Apply theme colors to CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (primaryColor) {
        document.documentElement.style.setProperty('--theme-color', primaryColor);
        document.documentElement.style.setProperty('--primary', primaryColor);
      }
      if (secondaryColor) {
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
      }
      if (accentColor) {
        document.documentElement.style.setProperty('--accent-color', accentColor);
      }
    }
  }, [primaryColor, secondaryColor, accentColor]);
  
  // Get auth user
  const page = usePage<any>();
  const { auth } = page.props;

  const handleSearch = async () => {
    setIsLoading(true);
    router.get(route('directory.index'), {
      search: searchTerm,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: sortBy !== 'views' ? sortBy : undefined,
    }, {
      onFinish: () => setIsLoading(false)
    });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setIsLoading(true);
    router.get(route('directory.index'), {
      search: searchTerm,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort: newSort !== 'views' ? newSort : undefined,
    }, {
      onFinish: () => setIsLoading(false)
    });
  };

  // Helper function to get base host for subdomains
  const getBaseHost = (): string => {
    const hostname = window.location.hostname;
    // Extract base domain from current hostname
    const parts = hostname.split('.');
    return parts.length > 1 ? parts.slice(-2).join('.') : hostname;
  };
  
  // Helper function to sanitize slug for route usage
  const sanitizeSlug = (slug: string): string => {
    if (!slug) return 'invalid-slug';
    // Replace any characters that are not alphanumeric, hyphens, or underscores
    return slug.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'invalid-slug';
  };

  const getBusinessUrl = (business: Business) => {
    if (business.custom_domain) {
      return `https://${business.custom_domain}`;
    } else if (business.domain_type === 'subdomain') {
      return `${window.location.protocol}//${business.slug}.${getBaseHost()}`;
    } else {
      return business.url_prefix && business.url_prefix !== ''
        ? route('public.vcard.show', { prefix: business.url_prefix, slug: sanitizeSlug(business.slug) })
        : route('public.vcard.show.direct', sanitizeSlug(business.slug));
    }
  };

  // Memoize contact info to avoid recalculation on every render
  const businessesWithContact = useMemo(() => {
    return businesses.data.map(business => {
      const contact = business.config_sections?.contact || {};
      return {
        ...business,
        contactInfo: {
          phone: contact.phone,
          email: contact.email,
          website: contact.website,
          address: contact.address || contact.clinic_address,
        }
      };
    });
  }, [businesses.data]);

  // Sanitize text to prevent XSS while preserving special characters
  const sanitizeText = (text: string) => {
    if (!text) return '';
    return text.replace(/<script[^>]*>.*?<\/script>/gi, '')
               .replace(/<[^>]+>/g, '')
               .trim();
  };

  // Check if section is visible
  const isSectionVisible = (sectionKey: string) => {
    return directorySettings?.config_sections?.section_visibility?.[sectionKey] !== false;
  };

  // Get section order
  const getSectionOrder = () => {
    return directorySettings?.config_sections?.section_order || ['hero', 'categories', 'filters', 'businesses'];
  };

  const renderFeatureIcon = (iconType: string) => {
    const iconClassName = 'mr-2 h-5 w-5 shrink-0';

    switch (iconType) {
      case 'verified':
        return <BadgeCheck className={iconClassName} />;
      case 'location':
        return <MapPin className={iconClassName} />;
      case 'contact':
        return <Phone className={iconClassName} />;
      case 'star':
        return <Star className={iconClassName} />;
      case 'shield':
        return <Shield className={iconClassName} />;
      case 'globe':
        return <Globe className={iconClassName} />;
      case 'users':
        return <Users className={iconClassName} />;
      case 'zap':
        return <Zap className={iconClassName} />;
      default:
        return <BadgeCheck className={iconClassName} />;
    }
  };

  return (
    <>
      <Head title={t("Business Directory")} />
      
      {/* Dynamic Header */}
      <Header 
        settings={settings}
        customPages={[]}
        directoryCustomPages={directoryCustomPages}
        isDirectoryContext={true}
        brandColor={primaryColor}
        user={auth.user}
        directorySettings={{
          company_name: directorySettings?.config_sections?.company?.name || settings.company_name
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ paddingTop: '64px' }}>
        {getSectionOrder().map((sectionKey) => {
          if (!isSectionVisible(sectionKey)) return null;
          
          switch (sectionKey) {
            case 'hero':
              return (
                <div 
                  key="hero"
                  className="relative overflow-hidden"
                  style={{
                    background: directorySettings?.config_sections?.use_background_image && directorySettings?.config_sections?.background_image
                      ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${window.appSettings?.imageUrl || ''}${directorySettings.config_sections.background_image})`
                      : `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
          {/* Background SVG Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="businessPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  {/* Business Card Icon */}
                  <rect x="20" y="25" width="40" height="25" rx="3" fill="currentColor" opacity="0.3"/>
                  <rect x="22" y="27" width="12" height="2" fill="currentColor" opacity="0.5"/>
                  <rect x="22" y="30" width="20" height="1" fill="currentColor" opacity="0.4"/>
                  <rect x="22" y="32" width="16" height="1" fill="currentColor" opacity="0.4"/>
                  {/* Network Dots */}
                  <circle cx="10" cy="15" r="2" fill="currentColor" opacity="0.4"/>
                  <circle cx="70" cy="65" r="2" fill="currentColor" opacity="0.4"/>
                  <circle cx="30" cy="70" r="1.5" fill="currentColor" opacity="0.3"/>
                  {/* Connection Lines */}
                  <line x1="10" y1="15" x2="20" y2="25" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                  <line x1="60" y1="50" x2="70" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#businessPattern)" className="text-white"/>
            </svg>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 opacity-20 hero-float">
            <svg width="60" height="40" viewBox="0 0 60 40" className="text-blue-300">
              <rect x="5" y="8" width="50" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
              <rect x="8" y="12" width="20" height="3" fill="currentColor"/>
              <rect x="8" y="17" width="30" height="2" fill="currentColor" opacity="0.7"/>
              <rect x="8" y="21" width="25" height="2" fill="currentColor" opacity="0.7"/>
            </svg>
          </div>
          
          <div className="absolute top-40 right-20 opacity-15 hero-float" style={{animationDelay: '1s'}}>
            <svg width="50" height="50" viewBox="0 0 50 50" className="text-purple-300">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="25" cy="25" r="3" fill="currentColor"/>
              <circle cx="15" cy="15" r="2" fill="currentColor"/>
              <circle cx="35" cy="15" r="2" fill="currentColor"/>
              <circle cx="15" cy="35" r="2" fill="currentColor"/>
              <circle cx="35" cy="35" r="2" fill="currentColor"/>
              <line x1="25" y1="25" x2="15" y2="15" stroke="currentColor" strokeWidth="1"/>
              <line x1="25" y1="25" x2="35" y2="15" stroke="currentColor" strokeWidth="1"/>
              <line x1="25" y1="25" x2="15" y2="35" stroke="currentColor" strokeWidth="1"/>
              <line x1="25" y1="25" x2="35" y2="35" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          
          <div className="absolute bottom-20 left-1/4 opacity-10 hero-float" style={{animationDelay: '2s'}}>
            <svg width="80" height="50" viewBox="0 0 80 50" className="text-indigo-300">
              <path d="M10 25 Q25 10 40 25 Q55 40 70 25" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="10" cy="25" r="3" fill="currentColor"/>
              <circle cx="40" cy="25" r="3" fill="currentColor"/>
              <circle cx="70" cy="25" r="3" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center mb-12">
              <div className="relative flex items-center justify-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium hero-fade-in">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  {t(directorySettings?.config_sections?.hero?.trust_badge || "Trusted by 10,000+ Businesses")}
                </div>
                {auth.user?.type === 'superadmin' && (
                  <div className="absolute right-0">
                    <Link
                      href={route('directory.settings')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      {t('Settings')}
                    </Link>
                  </div>
                )}
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight hero-fade-in">
                {t(directorySettings?.config_sections?.hero?.main_title || "Discover Amazing Businesses")}

                {/* {(() => {
                  const title = directorySettings?.config_sections?.hero?.main_title || "Discover Amazing Businesses";
                  const words = title.split(' ');
                  if (words.length >= 2) {
                    const firstPart = words.slice(0, -2).join(' ');
                    const highlightWord = words[words.length - 2];
                    const lastWord = words[words.length - 1];
                    return (
                      <>
                        {firstPart && `${firstPart} `}
                        <span 
                          className="gradient-text-animated"
                          style={{
                            background: `linear-gradient(-45deg, ${primaryColor}, ${secondaryColor}, ${accentColor}, ${primaryColor})`,
                            backgroundSize: '400% 400%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        >{highlightWord}</span>
                        <br />
                        {lastWord}
                      </>
                    );
                  }
                  return title;
                })()} */}
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8 hero-fade-in-delay">
                {t(directorySettings?.config_sections?.hero?.subtitle || "Connect with professionals, explore services, and grow your network in our comprehensive business directory")}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-white/80 text-sm hero-fade-in-delay">
                {(directorySettings?.config_sections?.hero?.features || [
                  {icon: 'verified', text: 'Verified Businesses'},
                  {icon: 'location', text: 'Local & Global'},
                  {icon: 'contact', text: 'Instant Contact'}
                ]).map((feature, index) => {
                  return (
                    <div key={index} className="flex items-center">
                      {renderFeatureIcon(feature.icon)}
                      {t(feature.text)}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enhanced Search Filters */}
            {(isSectionVisible('search') || isSectionVisible('filters')) && (
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 lg:p-8 border border-white/20">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
                {isSectionVisible('search') && (
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder={t("Search businesses, services, or locations...")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg border-gray-300 focus:border-2 transition-all"
                    style={{ '--focus-color': primaryColor } as React.CSSProperties}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                )}
                
                {isSectionVisible('filters') && (
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 border-gray-300">
                    <Filter className="h-5 w-5 mr-2 text-gray-500" />
                    <SelectValue placeholder={t("Business Type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("All Business Types")}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                )}
                
                {(isSectionVisible('search') || isSectionVisible('filters')) && (
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="flex-1 h-12 text-lg font-semibold transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("Searching...")}
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        {t("Search")}
                      </>
                    )}
                  </Button>
                  {(searchTerm || selectedCategory !== 'all') && (
                    <Button 
                      variant="outline" 
                      className="h-12 px-6"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSortBy('views');
                        setIsLoading(true);
                        router.get(route('directory.index'), {}, {
                          onFinish: () => setIsLoading(false)
                        });
                      }}
                    >
                      {t("Reset")}
                    </Button>
                  )}
                </div>
                )}
              </div>
            </div>
            )}
          </div>
                </div>
              );
              

            case 'filters':
              return (
                <div key="filters" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Filters')}</h3>
                    <div className="flex flex-wrap gap-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder={t("Business Type")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("All Business Types")}</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              );
              
            case 'categories':
              return (
                <div key="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{directorySettings?.title || t("Browse by Business Type")}</h2>
              <p className="text-gray-600">{directorySettings?.description || t("Explore businesses across different industries")}</p>
            </div>
            {auth.user?.type === 'superadmin' && (
              <Link
                href={route('directory.settings')}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
              >
                <SettingsIcon className="w-4 h-4" />
                {t('Settings')}
              </Link>
            )}
          </div>
          
          
          <div className="relative">
            <button 
              onClick={() => setSliderIndex(Math.max(0, sliderIndex - 4))}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 cursor-pointer"
              disabled={sliderIndex === 0}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="overflow-hidden mx-12">
              <div 
                className="flex gap-4 transition-transform duration-300"
                style={{ transform: `translateX(-${sliderIndex * 180}px)` }}
              >
                {categories.map((category) => {
                  const businessCount = category.count || 0;
                  
                  return (
                    <div 
                      key={category.value}
                      className="flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 theme-border-hover"
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setIsLoading(true);
                        router.get(route('directory.index'), {
                          search: searchTerm,
                          category: category.value !== 'all' ? category.value : undefined,
                          sort: sortBy !== 'views' ? sortBy : undefined,
                        }, {
                          onFinish: () => setIsLoading(false)
                        });
                      }}
                    >
                      <div className="p-6 text-center min-w-[160px]">
                        <div className="text-4xl mb-3">{businessTypeOptions.find(bt => bt.value === category.value)?.icon || '🏢'}</div>
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.label}</h3>
                        <p className="text-xs text-gray-500">{businessCount} {t("businesses")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button 
              onClick={() => setSliderIndex(Math.min(categories.length - 4, sliderIndex + 4))}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 cursor-pointer"
              disabled={sliderIndex >= categories.length - 4}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
                </div>
              );
              
            case 'businesses':
              return (
                <div key="businesses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {businesses.data?.length > 0 ? t("Featured Businesses") : t("No Results Found")}
              </h2>
              <p className="text-gray-600">
                {businesses.data?.length > 0 ? (
                  `${t("Showing")} ${businesses.meta?.from || 1} ${t("to")} ${businesses.meta?.to || businesses.data.length} ${t("of")} ${businesses.meta?.total || businesses.data.length} ${t("businesses")}`
                ) : (
                  t("Try adjusting your search criteria or browse all categories")
                )}
              </p>
            </div>
            {businesses.data?.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{t("Sort by:")}</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="views">{t("Most Viewed")}</SelectItem>
                    <SelectItem value="name">{t("Name A-Z")}</SelectItem>
                    <SelectItem value="newest">{t("Newest First")}</SelectItem>
                    <SelectItem value="oldest">{t("Oldest First")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {businessesWithContact.map((business) => {
              return (
                <Card key={business.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden h-full flex flex-col">
                  <CardHeader className="pb-4 relative">
                    {business.is_featured ? (
                      <div className="absolute -top-2 -right-2 w-16 h-16">
                        <div className="absolute transform rotate-45 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center shadow-lg">
                          {t("Featured")}
                        </div>
                      </div>
                    ) : null}
                    
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:transition-colors theme-hover">
                              {sanitizeText(business.name)}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              {business.is_verified ? (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                                  ✓ {t("Verified")}
                                </Badge>
                              ) : null}
                              <span className="text-sm text-gray-600 capitalize font-medium px-2 py-1 bg-gray-100 rounded-full">
                                {business.business_type.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {business.rating > 0 ? (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < Math.floor(business.rating) 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{business.rating}</span>
                            <span className="text-xs text-gray-500">({business.rating_count} {t("reviews")})</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    
                    {business.directory_description ? (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {sanitizeText(business.directory_description)}
                      </p>
                    ) : null}
                  </CardHeader>
                  
                  <CardContent className="pt-0 pb-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-6 flex-1">
                      {business.contactInfo.phone ? (
                        <div className="flex items-center gap-3 text-sm text-gray-700 hover:transition-colors theme-hover">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center theme-bg-light">
                            <Phone className="h-4 w-4 theme-icon" />
                          </div>
                          <span className="font-medium">{sanitizeText(business.contactInfo.phone)}</span>
                        </div>
                      ) : null}
                      
                      {business.contactInfo.email ? (
                        <div className="flex items-center gap-3 text-sm text-gray-700 hover:transition-colors theme-hover">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center theme-bg-light">
                            <Mail className="h-4 w-4 theme-icon" />
                          </div>
                          <span className="font-medium truncate">{sanitizeText(business.contactInfo.email)}</span>
                        </div>
                      ) : null}
                      
                      {business.contactInfo.address ? (
                        <div className="flex items-center gap-3 text-sm text-gray-700">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center theme-bg-light">
                            <MapPin className="h-4 w-4 theme-icon" />
                          </div>
                          <span className="font-medium line-clamp-2 leading-relaxed">{sanitizeText(business.contactInfo.address)}</span>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">{business.view_count.toLocaleString()} {t("views")}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <a href={getBusinessUrl(business)} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            {t("View Card")}
                          </a>
                        </Button>
                        
                        <Button 
                          size="sm" 
                          onClick={() => router.visit(route('directory.show', { business: business.id }))}
                          className="transition-all hover:shadow-md"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {t("View Details")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Modern Pagination */}
          {businesses.links && businesses.links.length > 3 && (
            <div className="flex justify-center items-center mt-12 gap-4">
              <div className="flex items-center gap-2">
                {businesses.links.map((link, index) => {
                  const isActive = link.active;
                  const isDisabled = !link.url;
                  const isPrevious = link.label.includes('Previous') || link.label.includes('&laquo;');
                  const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                  const isNumber = !isPrevious && !isNext && link.label.match(/^\d+$/);
                  
                  if (isPrevious) {
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => link.url && router.visit(link.url)}
                        className="px-3 py-2 h-10 border-gray-300 hover:border-gray-400 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        {t("Previous")}
                      </Button>
                    );
                  }
                  
                  if (isNext) {
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => link.url && router.visit(link.url)}
                        className="px-3 py-2 h-10 border-gray-300 hover:border-gray-400 disabled:opacity-50"
                      >
                        {t("Next")}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    );
                  }
                  
                  if (isNumber) {
                    return (
                      <Button
                        key={index}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => link.url && router.visit(link.url)}
                        className={`w-10 h-10 p-0 transition-all ${
                          isActive 
                            ? 'shadow-md border-0' 
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                        style={isActive ? { backgroundColor: primaryColor } : {}}
                      >
                        {link.label}
                      </Button>
                    );
                  }
                  
                  if (link.label === '...') {
                    return (
                      <span key={index} className="px-2 py-2 text-gray-400 text-sm">
                        •••
                      </span>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>
          )}
                </div>
              );
              
            default:
              return null;
          }
        })}
        
        {/* Dynamic Footer */}
        <Footer 
          settings={{
            company_name: directorySettings?.config_sections?.company?.name || settings.company_name,
            contact_email: directorySettings?.config_sections?.company?.contact_email || settings.contact_email,
            contact_phone: directorySettings?.config_sections?.company?.contact_phone || settings.contact_phone,
            contact_address: directorySettings?.config_sections?.company?.contact_address || settings.contact_address
          }}
          sectionData={{
            description: directorySettings?.config_sections?.footer?.description || settings.config_sections?.footer?.description,
            newsletter_title: directorySettings?.config_sections?.footer?.newsletter_title || settings.config_sections?.footer?.newsletter_title,
            newsletter_subtitle: directorySettings?.config_sections?.footer?.newsletter_subtitle || settings.config_sections?.footer?.newsletter_subtitle,
            links: directorySettings?.config_sections?.footer?.links || settings.config_sections?.footer?.links,
            social_links: directorySettings?.config_sections?.footer?.social_links || settings.config_sections?.footer?.social_links,
            section_titles: directorySettings?.config_sections?.footer?.section_titles || settings.config_sections?.footer?.section_titles
          }}
          brandColor={primaryColor}
        />
      </div>
    </>
  );
}
