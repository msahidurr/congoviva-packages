import React, { useEffect, useState } from 'react';
import { Coffee, Clock, Star, Leaf, Heart, QrCode, MapPin, Phone, Mail } from 'lucide-react';
import { getSectionData, getSectionOrder } from '@/utils/sectionHelpers';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getMenuTemplate } from '../../menu-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface CafeMenuTemplateProps {
  data: any;
  template: any;
}

export default function CafeMenuTemplate({ data, template }: CafeMenuTemplateProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#8B4513', secondary: '#D2691E', text: '#2F1B14' };
  
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;
  const allSections = getMenuTemplate('cafe')?.sections || [];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey) || {};
    if (!sectionData || Object.keys(sectionData).length === 0) return null;
    
    switch (sectionKey) {
      case 'menu_info': return renderMenuInfoSection(sectionData);
      case 'categories': return renderCategoriesSection(sectionData);
      case 'specialties': return renderSpecialtiesSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      default: return null;
    }
  };

  const renderMenuInfoSection = (menuInfo: any) => (
    <>
      {/* Warm Cafe Header */}
      <div className="relative overflow-hidden" style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}>
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
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-8 text-center text-white">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
            <Coffee className="w-8 h-8" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold mb-2 tracking-wide">
              {menuInfo.cafe_name || t('Cozy Corner Cafe')}
            </h1>
            
            {menuInfo.tagline && (
              <p className="text-sm font-light text-white/90 italic">
                "{menuInfo.tagline}"
              </p>
            )}
            
            {menuInfo.description && (
              <p className="text-sm text-white/85 leading-relaxed max-w-xs mx-auto">
                {menuInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      {menuInfo.operating_hours && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
              {t('Opening Hours')}
            </h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {menuInfo.operating_hours}
          </p>
        </div>
      )}
    </>
  );

  const renderCategoriesSection = (categories: any) => {
    if (!categories.category_list || categories.category_list.length === 0) return null;
    
    return (
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{categories.section_title || t('Our Menu')}</h3>
        </div>
        
        <div className="space-y-3">
          {categories.category_list.slice(0, 4).map((category: any, index: number) => (
            <div key={index} className="rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{category.name}</h4>
                {category.price && (
                  <span className="font-bold" style={{ color: colors.primary }}>
                    {category.price}
                  </span>
                )}
              </div>
              
              {category.description && (
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                  {category.description}
                </p>
              )}
              
              <div className="flex items-center space-x-2">
                {category.is_popular && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                    <Star className="w-3 h-3 mr-1" fill="currentColor" />
                    {t('Popular')}
                  </span>
                )}
                {category.is_vegetarian && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#22c55e20', color: '#22c55e' }}>
                    <Leaf className="w-3 h-3 mr-1" />
                    {t('Vegetarian')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSpecialtiesSection = (specialties: any) => {
    if (!specialties.special_items || specialties.special_items.length === 0) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: colors.secondary }}>
            <Heart className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
            {specialties.section_title || t("Today's Specials")}
          </h3>
        </div>
        
        <div className="space-y-3">
          {specialties.special_items.slice(0, 2).map((item: any, index: number) => (
            <div key={index} className="rounded-lg p-3 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.price && (
                  <span className="text-lg font-bold ml-3" style={{ color: colors.primary }}>
                    {item.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactSection = (contact: any) => {
    if (!contact.phone && !contact.email && !contact.address) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <h3 className="text-lg font-semibold mb-3" style={{ color: colors.primary }}>
          {contact.section_title || t('Visit Us')}
        </h3>
        
        <div className="space-y-2">
          {contact.address && (
            <div className="flex items-center space-x-3 p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{contact.address}</span>
            </div>
          )}
          
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center space-x-3 p-2 rounded-lg hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{contact.phone}</span>
            </a>
          )}
          
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center space-x-3 p-2 rounded-lg hover:shadow-sm transition-all" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
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
      <div className="mx-4 mb-4 rounded-xl shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="relative overflow-hidden rounded-xl p-4" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
        }}>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary }}>
              <QrCode className="w-7 h-7 text-white" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>
              {qrShare.qr_title || t('Share Our Menu')}
            </h3>
            
            {qrShare.qr_description ? (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {qrShare.qr_description}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {t('Share our delicious menu with friends and family')}
              </p>
            )}
            
            <Button 
              className="w-full px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
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
      backgroundColor: hasBackgroundImage ? 'transparent' : '#FFF8DC',
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