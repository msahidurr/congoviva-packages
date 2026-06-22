import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Utensils, Star, Users, Zap, Shield, Globe, QrCode, Share, BarChart3, Smartphone, Eye, Coffee, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MarketplaceData {
  title: string;
  subtitle: string;
  demo_button_text: string;
  get_started_button_text: string;
  demo_button_link?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_image?: string;
  use_background_image?: boolean;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  stats: Array<{
    value: string;
    label: string;
  }>;
  screenshots: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  screenshots_title?: string;
  screenshots_subtitle?: string;
  features_title?: string;
  features_subtitle?: string;
  features_show_icons?: boolean;
  features_layout?: string;
  features_columns?: number;
  features_background_color?: string;
  features_icon_color?: string;
  config_sections?: {
    section_order?: string[];
    section_visibility?: {
      [key: string]: boolean;
    };
  };
}

interface Props {
  marketplaceData: MarketplaceData;
}

export default function MenuMarketplace({ marketplaceData }: Props) {
  const { t } = useTranslation();
  const brandColor = marketplaceData.primary_color || '#D2691E';

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    if (imagePath.startsWith('/')) {
      return `${window.appSettings?.imageUrl || ''}${imagePath}`;
    }
    return `${window.appSettings?.imageUrl || ''}/storage/${imagePath}`;
  };

  if (!marketplaceData) {
    return <div>Loading...</div>;
  }

  const sectionOrder = marketplaceData.config_sections?.section_order || ['hero', 'features', 'stats', 'screenshots'];
  const sectionVisibility = marketplaceData.config_sections?.section_visibility || {
    hero: true,
    features: true,
    stats: true,
    screenshots: true
  };

  const iconMap = {
    'utensils': Utensils,
    'chef-hat': ChefHat,
    'coffee': Coffee,
    'qr-code': QrCode,
    'smartphone': Smartphone,
    'share': Share,
    'bar-chart': BarChart3,
    'globe': Globe,
    'shield': Shield,
    'star': Star,
    'zap': Zap,
    'users': Users,
    'lock': Shield,
    'wifi': Globe
  };

  const renderSection = (sectionKey: string) => {
    if (!sectionVisibility[sectionKey]) return null;

    switch (sectionKey) {
      case 'hero':
        const heroStyle = marketplaceData.use_background_image && marketplaceData.background_image
          ? {
              backgroundImage: `url(${getImageUrl(marketplaceData.background_image)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
          : {
              background: `linear-gradient(135deg, ${brandColor} 0%, ${marketplaceData.secondary_color || '#CD853F'} 50%, ${marketplaceData.accent_color || '#F5DEB3'} 100%)`
            };
        
        return (
          <div 
            key="hero"
            className="relative overflow-hidden"
            style={heroStyle}
          >
            {marketplaceData.use_background_image && marketplaceData.background_image && (
              <div className="absolute inset-0 bg-black/40"></div>
            )}
            
            {(!marketplaceData.use_background_image || !marketplaceData.background_image) && (
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="menuPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <circle cx="40" cy="40" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                      <path d="M32 32 L48 32 L48 48 L32 48 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
                      <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#menuPattern)" className="text-white"/>
                </svg>
              </div>
            )}
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                  <Utensils className="w-4 h-4 mr-2" />
                  {t('Menu QR Code Add-on')}
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  {marketplaceData.title}
                </h1>
                
                <p className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
                  {marketplaceData.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button 
                    className="bg-white hover:bg-gray-50 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 shadow-lg"
                    style={{ color: brandColor }}
                    onClick={() => window.open(marketplaceData.demo_button_link || route('menu.preview'), '_blank')}
                  >
                    <Eye className="h-5 w-5" />
                    {marketplaceData.demo_button_text}
                  </Button>
                  <Link href={route('menu.create')}>
                    <Button 
                      className="text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 shadow-lg"
                      style={{ backgroundColor: brandColor }}
                    >
                      <Utensils className="h-5 w-5" />
                      {marketplaceData.get_started_button_text}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return marketplaceData.config_sections?.section_visibility?.stats !== false && (
          <div key="stats" className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                {(marketplaceData.stats || []).map((stat, index) => (
                  <div key={index} className="">
                    <div className="text-4xl font-bold mb-2" style={{ color: brandColor }}>{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'features':
        return marketplaceData.config_sections?.section_visibility?.features !== false && (
          <section key="features" className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: marketplaceData.features_background_color || '#ffffff' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{marketplaceData.features_title || t('Powerful Features')}</h2>
                <p className="text-xl text-gray-600">{marketplaceData.features_subtitle || t('Everything you need for professional digital menu management')}</p>
              </div>
              
              <div className={`${marketplaceData.features_layout === 'list' ? 'space-y-6' : marketplaceData.features_layout === 'carousel' ? 'flex overflow-x-auto gap-6 pb-4' : marketplaceData.features_layout === 'centered' ? 'flex flex-col items-center space-y-8 max-w-2xl mx-auto' : `grid grid-cols-1 ${(marketplaceData.features_columns || 4) >= 2 ? 'sm:grid-cols-2' : ''} ${(marketplaceData.features_columns || 4) >= 3 ? 'lg:grid-cols-3' : ''} ${(marketplaceData.features_columns || 4) >= 4 ? 'xl:grid-cols-4' : ''} gap-6 sm:gap-8`}`}>
                {(marketplaceData.features || []).map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || Utensils;
                  const showIcons = marketplaceData.features_show_icons !== false;
                  const iconColor = marketplaceData.features_icon_color || '#D2691E';
                  return (
                    <div key={index} className={`bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 ${marketplaceData.features_layout === 'carousel' ? 'min-w-80 flex-shrink-0' : marketplaceData.features_layout === 'centered' ? 'text-center w-full' : ''}`}>
                      {showIcons && (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${iconColor}15` }}>
                          <IconComponent className="w-6 h-6" style={{ color: iconColor }} />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'screenshots':
        return marketplaceData.config_sections?.section_visibility?.screenshots !== false && (
          <section key="screenshots" className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {marketplaceData.screenshots_title || t('See Menu QR Code in Action')}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                  {marketplaceData.screenshots_subtitle || t('Discover how easy it is to create and manage digital menus with our intuitive interface and powerful features.')}
                </p>
              </div>

              {(marketplaceData.screenshots || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {(marketplaceData.screenshots || []).map((screenshot, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        {getImageUrl(screenshot.image) ? (
                          <img
                            src={getImageUrl(screenshot.image)}
                            alt={screenshot.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Utensils className="w-12 h-12" />
                          </div>
                        )}

                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {screenshot.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {screenshot.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Utensils className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-gray-500">{t('No screenshots configured yet. Add some in the admin settings.')}</p>
                </div>
              )}

              <div className="text-center mt-12">
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium border-2" style={{ borderColor: brandColor, color: brandColor }}>
                  ✨ {t('And many more features to discover')}
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {sectionOrder.map(sectionKey => renderSection(sectionKey))}
    </div>
  );
}