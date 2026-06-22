import React, { useEffect, useState } from 'react';
import { Pizza, Flame, Clock, Users, Star, QrCode, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { getSectionData, getSectionOrder } from '@/utils/sectionHelpers';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getMenuTemplate } from '../../menu-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface PizzaMenuTemplateProps {
  data: any;
  template: any;
}

export default function PizzaMenuTemplate({ data, template }: PizzaMenuTemplateProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#C41E3A', secondary: '#228B22', text: '#2D3748' };
  
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const allSections = getMenuTemplate('pizza')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey) || {};
    if (!sectionData || Object.keys(sectionData).length === 0) return null;
    
    switch (sectionKey) {
      case 'menu_info': return renderMenuInfoSection(sectionData);
      case 'pizzas': return renderPizzasSection(sectionData);
      case 'sizes': return renderSizesSection(sectionData);
      case 'sides': return renderSidesSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      default: return null;
    }
  };

  const renderMenuInfoSection = (menuInfo: any) => (

    <>
      {/* Italian Pizza Header */}
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
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-white">
            <defs>
              <pattern id="pizza-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                <circle cx="12.5" cy="12.5" r="2" fill="currentColor" opacity="0.3" />
                <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.2" />
                <circle cx="19" cy="19" r="1.5" fill="currentColor" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pizza-pattern)" />
          </svg>
        </div>
        
        <div className="relative px-6 py-8 text-center text-white">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border-2 border-white/30">
            <Pizza className="w-10 h-10" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold mb-2 tracking-wide">
              {menuInfo.pizzeria_name || t('Mama Mia Pizzeria')}
            </h1>
            
            {menuInfo.italian_motto && (
              <div className="flex items-center justify-center">
                <div className="h-px w-8 bg-white/40"></div>
                <div className="mx-4 px-4 py-1 bg-white/15 backdrop-blur-md rounded-full border border-white/20">
                  <p className="text-sm font-light italic">{menuInfo.italian_motto}</p>
                </div>
                <div className="h-px w-8 bg-white/40"></div>
              </div>
            )}
            
            {menuInfo.description && (
              <p className="text-sm text-white/90 leading-relaxed max-w-xs mx-auto">
                {menuInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      {menuInfo.delivery_time && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
                {t('Hot & Fresh in')} {menuInfo.delivery_time}
              </h3>
              <p className="text-sm text-gray-600">{t('Delivered straight to your door!')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderSizesSection = (sizes: any) => {
    if (!sizes.size_options || sizes.size_options.length === 0) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: colors.primary }}>
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
            🍕 {t('Pizza Sizes')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {sizes.size_options.map((size: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: colors.secondary }}>
                  {size.diameter || size.size?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{size.size}</h4>
                  {size.serves && (
                    <p className="text-xs text-gray-600">{t('Serves')} {size.serves}</p>
                  )}
                </div>
              </div>
              {size.price && (
                <span className="text-lg font-bold" style={{ color: colors.primary }}>
                  {size.price}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPizzasSection = (pizzas: any) => {
    if (!pizzas.pizza_list || pizzas.pizza_list.length === 0) return null;
    
    return (
      <div className="px-4 py-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <Flame className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{pizzas.section_title || t('Signature Pizzas')}</h3>
        </div>
        
        <div className="space-y-4">
          {pizzas.pizza_list.slice(0, 5).map((pizza: any, index: number) => (
            <div key={index} className="rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900">{pizza.name}</h4>
                    {pizza.is_popular && (
                      <Star className="w-4 h-4" style={{ color: colors.secondary }} fill="currentColor" />
                    )}
                    {pizza.is_spicy && (
                      <Flame className="w-4 h-4" style={{ color: colors.primary }} />
                    )}
                  </div>
                  {pizza.toppings && (
                    <p className="text-sm text-gray-600 leading-relaxed mb-2">
                      {pizza.toppings}
                    </p>
                  )}
                  {pizza.crust_type && (
                    <div className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                      {pizza.crust_type} {t('Crust')}
                    </div>
                  )}
                </div>
                {pizza.base_price && (
                  <div className="text-right ml-3">
                    <span className="text-sm text-gray-500">{t('from')}</span>
                    <div className="text-lg font-bold" style={{ color: colors.primary }}>
                      {pizza.base_price}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSidesSection = (sides: any) => {
    if (!sides.side_items || sides.side_items.length === 0) return null;
    
    return (
      <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
            {sides.section_title || t('Sides & Extras')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {sides.side_items.slice(0, 4).map((side: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${colors.primary}05, ${colors.secondary}05)` }}>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{side.name}</h4>
                {side.description && (
                  <p className="text-xs text-gray-600 mt-1">
                    {side.description}
                  </p>
                )}
              </div>
              {side.price && (
                <span className="font-bold ml-3" style={{ color: colors.primary }}>
                  {side.price}
                </span>
              )}
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
      <div className="mx-4 mb-4 rounded-xl shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        <div className="relative overflow-hidden rounded-xl p-4" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
        }}>
          <div className="absolute top-2 right-2 text-2xl opacity-20">🍕</div>
          <div className="absolute bottom-2 left-2 text-xl opacity-15">🧄</div>
          
          <div className="relative text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary }}>
              <QrCode className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
              {qrShare.qr_title || t('Share Our Pizza Menu')}
            </h3>
            
            {qrShare.qr_description ? (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {qrShare.qr_description}
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {t('Share our authentic Italian pizza menu with pizza lovers!')}
              </p>
            )}
            
            <Button 
              className="w-full px-6 py-3 rounded-xl text-white font-bold transition-all hover:shadow-lg"
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
      backgroundColor: hasBackgroundImage ? 'transparent' : '#FFF8F0',
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