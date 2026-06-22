import React, { useEffect, useState } from 'react';
import { Zap, Truck, Clock, DollarSign, Star, QrCode, MapPin, Phone, Mail, Flame } from 'lucide-react';
import { getSectionData, getSectionOrder } from '@/utils/sectionHelpers';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getMenuTemplate } from '../../menu-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface FastFoodMenuTemplateProps {
  data: any;
  template: any;
}

export default function FastFoodMenuTemplate({ data, template }: FastFoodMenuTemplateProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#FF6B35', secondary: '#F7931E', text: '#2D3748' };
  
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const allSections = getMenuTemplate('fastfood')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey) || {};
    if (!sectionData || Object.keys(sectionData).length === 0) return null;
    
    switch (sectionKey) {
      case 'menu_info': return renderMenuInfoSection(sectionData);
      case 'categories': return renderCategoriesSection(sectionData);
      case 'combos': return renderCombosSection(sectionData);
      case 'delivery': return renderDeliverySection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      default: return null;
    }
  };

  const renderMenuInfoSection = (menuInfo: any) => (

    <>
      {/* Bold Geometric Header */}
      <div className="relative" style={{ backgroundColor: colors.primary }}>
        {hasBackgroundImage && (
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${getImageDisplayUrl(design.background_image)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        )}
        {hasBackgroundImage && (
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
        )}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 transform rotate-45 translate-x-16 -translate-y-16" style={{ backgroundColor: colors.secondary }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 transform rotate-12 -translate-x-12 translate-y-12" style={{ backgroundColor: colors.secondary, opacity: 0.7 }}></div>
        </div>
        
        <div className="relative px-6 py-12 text-white">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 mr-4 transform rotate-45" style={{ backgroundColor: colors.secondary }}></div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wide">
                {menuInfo.restaurant_name || t('Quick Bites')}
              </h1>
              {menuInfo.slogan && (
                <p className="text-sm font-bold mt-1 opacity-90">{menuInfo.slogan}</p>
              )}
            </div>
          </div>
          
          {menuInfo.description && (
            <div className="bg-white/10 p-4 border-l-4 border-white">
              <p className="text-sm leading-relaxed">{menuInfo.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Service Promise */}
      {menuInfo.service_time && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border-2" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
          borderColor: colors.secondary
        }}>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: colors.primary }}>
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
                {t('Ready in')} {menuInfo.service_time}
              </h3>
              <p className="text-sm text-gray-600">{t('Fast & Fresh Guaranteed!')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderCombosSection = (combos: any) => {
    if (!combos.combo_deals || combos.combo_deals.length === 0) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-md animate-bounce" style={{ backgroundColor: colors.secondary }}>
            <Flame className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold" style={{ color: colors.primary }}>
            🔥 {combos.section_title || t('Hot Combo Deals')}
          </h3>
        </div>
        
        <div className="space-y-3">
          {combos.combo_deals.slice(0, 3).map((combo: any, index: number) => (
            <div key={index} className="rounded-lg p-4 shadow-sm border-2" style={{ 
              background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)`,
              borderColor: colors.secondary + '30'
            }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900">{combo.name}</h4>
                    {combo.is_popular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        {t('Popular')}
                      </span>
                    )}
                  </div>
                  {combo.items && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {combo.items}
                    </p>
                  )}
                  {combo.savings && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                        💰 {t('Save')} {combo.savings}
                      </span>
                    </div>
                  )}
                </div>
                {combo.price && (
                  <div className="text-right ml-3">
                    <span className="text-xl font-bold" style={{ color: colors.primary }}>
                      {combo.price}
                    </span>
                    {combo.original_price && (
                      <div className="text-sm text-gray-500 line-through">
                        {combo.original_price}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategoriesSection = (categories: any) => {
    if (!categories.category_list || categories.category_list.length === 0) return null;
    
    return (
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{categories.section_title || t('Menu Items')}</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {categories.category_list.slice(0, 6).map((category: any, index: number) => (
            <div key={index} className="rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
                {category.price && (
                  <span className="text-lg font-bold ml-3" style={{ color: colors.primary }}>
                    {category.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDeliverySection = (delivery: any) => {
    if (!delivery.delivery_available) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
            <Truck className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
            {t('Fast Delivery')}
          </h3>
        </div>
        
        <div className="space-y-2">
          {delivery.delivery_time && (
            <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <span className="text-sm font-medium text-gray-700">{t('Delivery Time')}</span>
              <span className="text-sm font-bold" style={{ color: colors.primary }}>
                {delivery.delivery_time}
              </span>
            </div>
          )}
          
          {delivery.delivery_fee && (
            <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <span className="text-sm font-medium text-gray-700">{t('Delivery Fee')}</span>
              <span className="text-sm font-bold" style={{ color: colors.secondary }}>
                {delivery.delivery_fee}
              </span>
            </div>
          )}
          
          {delivery.minimum_order && (
            <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <span className="text-sm font-medium text-gray-700">{t('Minimum Order')}</span>
              <span className="text-sm font-bold" style={{ color: colors.primary }}>
                {delivery.minimum_order}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactSection = (contact: any) => {
    if (!contact.phone && !contact.email && !contact.address) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <h3 className="text-lg font-bold mb-3" style={{ color: colors.primary }}>
          {contact.section_title || t('Visit Us')}
        </h3>
        
        <div className="space-y-2">
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center space-x-3 p-3 rounded-lg hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)` }}>
              <Phone className="w-4 h-4" style={{ color: colors.primary }} />
              <span className="text-sm font-medium text-gray-700">{contact.phone}</span>
            </a>
          )}
          
          {contact.address && (
            <div className="flex items-center space-x-3 p-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{contact.address}</span>
            </div>
          )}
          
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center space-x-3 p-3 rounded-lg hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{contact.email}</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrShare: any) => {
    if (!qrShare.enable_qr) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl shadow-lg border-2" style={{ 
        background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)`,
        borderColor: colors.secondary
      }}>
        <div className="relative overflow-hidden rounded-xl p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg animate-pulse" style={{ backgroundColor: colors.primary }}>
              <QrCode className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
              {qrShare.qr_title || t('Share Our Menu')}
            </h3>
            
            {qrShare.qr_description ? (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {qrShare.qr_description}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {t('Share our fast and delicious menu with friends!')}
              </p>
            )}
            
            <Button 
              className="w-full px-6 py-3 rounded-xl text-white font-bold transition-all hover:shadow-lg transform hover:scale-105"
              style={{ backgroundColor: colors.primary }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openQrModal'))}
            >
              <QrCode className="w-5 h-5 mr-2" />
              {t('Download & Share QR Code')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const orderedSectionKeys = getSectionOrder(templateConfig, allSections).filter(key => key !== 'colors');
  
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden" style={{ 
      backgroundColor: hasBackgroundImage ? 'transparent' : '#FFF5F0',
      backgroundImage: hasBackgroundImage ? `url(${design.background_image})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}
    </div>
  );
}