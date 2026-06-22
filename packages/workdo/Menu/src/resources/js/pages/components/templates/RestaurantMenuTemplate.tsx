import React, { useEffect, useState } from 'react';
import { Utensils, Award, ChefHat, Wine, Clock, Star, QrCode, MapPin, Phone, Mail } from 'lucide-react';
import { getSectionData, getSectionOrder, isSectionEnabled } from '@/utils/sectionHelpers';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getMenuTemplate } from '../../menu-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface RestaurantMenuTemplateProps {
  data: any;
  template: any;
}

export default function RestaurantMenuTemplate({ data, template }: RestaurantMenuTemplateProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#1a1a1a', secondary: '#d4af37', text: '#333333' };
  
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const allSections = getMenuTemplate('restaurant')?.sections || [];
  
  const renderSection = (sectionKey: string) => {
    if (!isSectionEnabled(templateConfig, sectionKey)) return null;
    const sectionData = getSectionData(templateConfig, sectionKey) || {};
    if (!sectionData || Object.keys(sectionData).length === 0) return null;
    
    switch (sectionKey) {
      case 'menu_info': return renderMenuInfoSection(sectionData);
      case 'chef_specials': return renderChefSpecialsSection(sectionData);
      case 'categories': return renderCategoriesSection(sectionData);
      case 'wine_list': return renderWineListSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      default: return null;
    }
  };

  const renderMenuInfoSection = (menuInfo: any) => (

    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ border: `3px solid ${colors.primary}` }}>
        <div className="relative p-8" style={{ backgroundColor: hasBackgroundImage ? 'transparent' : colors.primary + '10' }}>
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-4 border-white/30" style={{ backgroundColor: colors.secondary + '20' }}></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full" style={{ backgroundColor: colors.primary + '30' }}></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary }}>
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-center mb-4" style={{ color: colors.primary }}>
              {menuInfo.restaurant_name || t('Le Gourmet')}
            </h1>
            
            {menuInfo.cuisine_type && (
              <div className="text-center mb-4">
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.secondary, color: 'white' }}>
                  {menuInfo.cuisine_type}
                </span>
              </div>
            )}
            
            {menuInfo.description && (
              <p className="text-center text-gray-700 leading-relaxed max-w-sm mx-auto">
                {menuInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChefSpecialsSection = (chefSpecials: any) => {
    if (!chefSpecials.chef_recommendations || chefSpecials.chef_recommendations.length === 0) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-5 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="text-center mb-4">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: colors.secondary }}>
            <Award className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-serif" style={{ color: colors.primary }}>
            {chefSpecials.section_title || t("Chef's Recommendations")}
          </h3>
        </div>
        
        <div className="space-y-4">
          {chefSpecials.chef_recommendations.slice(0, 3).map((dish: any, index: number) => (
            <div key={index} className="rounded-lg p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{dish.name}</h4>
                    {dish.is_signature && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                        {t('Signature')}
                      </span>
                    )}
                  </div>
                  {dish.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {dish.description}
                    </p>
                  )}
                  {dish.chef_notes && (
                    <div className="mt-2 p-2 rounded" style={{ backgroundColor: colors.secondary + '10' }}>
                      <p className="text-xs italic" style={{ color: colors.primary }}>
                        <strong>{t('Chef\'s Note')}:</strong> {dish.chef_notes}
                      </p>
                    </div>
                  )}
                  {dish.ingredients && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      🥘 {dish.ingredients}
                    </p>
                  )}
                </div>
                {dish.price && (
                  <span className="text-lg font-bold ml-3" style={{ color: colors.secondary }}>
                    {dish.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCategoriesSection = (categories: any) => (

    categories.category_list && categories.category_list.length > 0 ? (
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-serif text-gray-900">{categories.section_title || t('Menu Selection')}</h3>
        </div>
        
        <div className="space-y-3">
          {categories.category_list.slice(0, 5).map((category: any, index: number) => (
            <div key={index} className="rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>
                {category.price && (
                  <span className="font-bold ml-3" style={{ color: colors.secondary }}>
                    {category.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderWineListSection = (wineList: any) => (

    wineList.wine_categories && wineList.wine_categories.length > 0 ? (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <Wine className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-serif" style={{ color: colors.primary }}>
            {wineList.section_title || t('Wine Selection')}
          </h3>
        </div>
        
        <div className="space-y-3">
          {wineList.wine_categories.slice(0, 3).map((wine: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{wine.name}</h4>
                {wine.vintage && (
                  <p className="text-xs text-gray-500">{wine.vintage}</p>
                )}
              </div>
              {wine.price && (
                <span className="font-semibold" style={{ color: colors.secondary }}>
                  {wine.price}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  const renderContactSection = (contact: any) => (
    <div>
      {/* Restaurant Hours */}
      {getSectionData(templateConfig, 'menu_info')?.operating_hours && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-serif" style={{ color: colors.primary }}>
              {t('Hours of Service')}
            </h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {getSectionData(templateConfig, 'menu_info')?.operating_hours}
          </p>
        </div>
      )}

      {/* Contact Information */}
      {(contact.phone || contact.email || contact.address) && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <h3 className="text-lg font-serif mb-3" style={{ color: colors.primary }}>
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
      )}
    </div>
  );

  const renderQrShareSection = (qrShare: any) => (
    qrShare.enable_qr ? (
      <div className="mx-4 mb-4 rounded-xl shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="relative overflow-hidden rounded-xl p-5" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
        }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary }}>
              <QrCode className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-serif mb-2" style={{ color: colors.primary }}>
              {qrShare.qr_title || t('Share Our Menu')}
            </h3>
            
            {qrShare.qr_description ? (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {qrShare.qr_description}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {t('Share our exquisite dining experience with others')}
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
    ) : null
  );

  // Get ordered sections
  const orderedSectionKeys = getSectionOrder(templateConfig, allSections).filter(key => key !== 'colors');
  
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden" style={{ 
      backgroundColor: hasBackgroundImage ? 'transparent' : '#ffffff',
      backgroundImage: hasBackgroundImage ? `url(${getImageDisplayUrl(design.background_image)})` : 'none',
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