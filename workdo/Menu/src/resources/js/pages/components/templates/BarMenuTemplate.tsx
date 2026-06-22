import React, { useEffect, useState } from 'react';
import { Wine, Martini, Clock, Music, Star, QrCode, MapPin, Phone, Mail, Sparkles } from 'lucide-react';
import { getSectionData, getSectionOrder } from '@/utils/sectionHelpers';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getMenuTemplate } from '../../menu-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface BarMenuTemplateProps {
  data: any;
  template: any;
}

export default function BarMenuTemplate({ data, template }: BarMenuTemplateProps) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('cocktails');
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#059669', secondary: '#10b77f', text: '#1f2937' };
  
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const menuInfo = getSectionData(templateConfig, 'menu_info') || {};
  const cocktails = getSectionData(templateConfig, 'cocktails') || {};
  const spirits = getSectionData(templateConfig, 'spirits') || {};
  const happyHour = getSectionData(templateConfig, 'happy_hour') || {};
  const events = getSectionData(templateConfig, 'events') || {};
  const contact = getSectionData(templateConfig, 'contact') || {};
  const qrShare = getSectionData(templateConfig, 'qr_share') || {};
  
  const TabButton = ({ label, active, onClick, colors }: any) => (
    <button
      className="px-4 py-2 mx-1 text-sm font-medium whitespace-nowrap transition-all duration-200"
      style={{ 
        color: active ? colors.primary : colors.text,
        borderBottom: active ? `2px solid ${colors.primary}` : 'none'
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      
      {/* Light Header Section */}
      <div className="relative bg-white p-6 border-b-2" style={{ borderColor: colors.primary }}>
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
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: hasBackgroundImage ? 'rgba(255,255,255,0.2)' : colors.primary + '20' }}>
            <Martini className="w-8 h-8" style={{ color: hasBackgroundImage ? '#ffffff' : colors.primary }} />
          </div>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: hasBackgroundImage ? '#ffffff' : colors.primary }}>
            {menuInfo.bar_name || t('The Golden Lounge')}
          </h1>
          
          {menuInfo.atmosphere && (
            <p className="text-sm mb-2" style={{ color: hasBackgroundImage ? 'rgba(255,255,255,0.85)' : colors.secondary }}>
              {menuInfo.atmosphere}
            </p>
          )}
          
          {menuInfo.description && (
            <p className="text-sm max-w-xs mx-auto" style={{ color: hasBackgroundImage ? 'rgba(255,255,255,0.8)' : '#4b5563' }}>
              {menuInfo.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto py-3 px-2 bg-white border-b">
        <TabButton 
          label="Cocktails" 
          active={activeTab === 'cocktails'} 
          onClick={() => setActiveTab('cocktails')} 
          colors={colors}
        />
        <TabButton 
          label="Spirits" 
          active={activeTab === 'spirits'} 
          onClick={() => setActiveTab('spirits')} 
          colors={colors}
        />
        <TabButton 
          label="Events" 
          active={activeTab === 'events'} 
          onClick={() => setActiveTab('events')} 
          colors={colors}
        />
        <TabButton 
          label="Contact" 
          active={activeTab === 'contact'} 
          onClick={() => setActiveTab('contact')} 
          colors={colors}
        />
      </div>

      {/* Happy Hour Special */}
      {happyHour.is_active && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-lg border-2" style={{ 
          background: `linear-gradient(135deg, ${colors.secondary}15, ${colors.primary}15)`,
          borderColor: colors.secondary
        }}>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md animate-pulse" style={{ backgroundColor: colors.secondary }}>
              <Sparkles className="w-7 h-7" style={{ color: 'white' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
              🍸 {t('Happy Hour')}
            </h3>
            {happyHour.time_range && (
              <p className="text-sm font-medium mb-2" style={{ color: colors.secondary }}>
                {happyHour.time_range}
              </p>
            )}
            {happyHour.discount && (
              <div className="inline-block px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: colors.primary, color: 'white' }}>
                {happyHour.discount} {t('OFF All Drinks!')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content - Cocktails */}
      {activeTab === 'cocktails' && cocktails.cocktail_list && cocktails.cocktail_list.length > 0 && (
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>
            🍸 {cocktails.section_title || t('Signature Cocktails')}
          </h2>
          
          <div className="space-y-4">
            {cocktails.cocktail_list.slice(0, 6).map((cocktail: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: colors.primary + '20' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-bold" style={{ color: colors.primary }}>{cocktail.name}</h4>
                      {cocktail.is_signature && (
                        <Star className="w-4 h-4" style={{ color: colors.secondary }} fill="currentColor" />
                      )}
                    </div>
                    {cocktail.ingredients && (
                      <p className="text-sm text-gray-600 mb-2">{cocktail.ingredients}</p>
                    )}
                    <div className="flex items-center space-x-2">
                      {cocktail.strength && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.primary + '20', color: colors.primary }}>
                          {cocktail.strength}
                        </span>
                      )}
                      {cocktail.category && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                          {cocktail.category}
                        </span>
                      )}
                    </div>
                  </div>
                  {cocktail.price && (
                    <span className="text-lg font-bold ml-3" style={{ color: colors.primary }}>
                      {cocktail.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content - Spirits */}
      {activeTab === 'spirits' && spirits.spirit_categories && spirits.spirit_categories.length > 0 && (
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>
            🥃 {t('Premium Spirits')}
          </h2>
          
          <div className="space-y-3">
            {spirits.spirit_categories.slice(0, 8).map((spirit: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: colors.primary + '20' }}>
                <div className="flex-1">
                  <h4 className="font-semibold" style={{ color: colors.primary }}>{spirit.name}</h4>
                  {spirit.brand && (
                    <p className="text-sm text-gray-600">{spirit.brand}</p>
                  )}
                  {spirit.age && (
                    <p className="text-xs" style={{ color: colors.secondary }}>
                      {spirit.age} {t('years aged')}
                    </p>
                  )}
                </div>
                {spirit.price && (
                  <span className="font-bold ml-3" style={{ color: colors.primary }}>
                    {spirit.price}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content - Events */}
      {activeTab === 'events' && events.upcoming_events && events.upcoming_events.length > 0 && (
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>
            🎵 {t('Live Entertainment')}
          </h2>
          
          <div className="space-y-4">
            {events.upcoming_events.slice(0, 4).map((event: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: colors.primary + '20' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" style={{ color: colors.primary }}>{event.name}</h4>
                    {event.date && (
                      <p className="text-sm mb-1" style={{ color: colors.secondary }}>
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </p>
                    )}
                    {event.time && (
                      <p className="text-xs text-gray-600">
                        {event.time}
                      </p>
                    )}
                  </div>
                  {event.cover_charge && (
                    <span className="text-sm font-medium ml-3" style={{ color: colors.primary }}>
                      {event.cover_charge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content - Contact */}
      {activeTab === 'contact' && (contact.phone || contact.email || contact.address) && (
        <div className="p-5">
          <h2 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary }}>
            📞 {contact.section_title || t('Visit Us')}
          </h2>
          
          <div className="space-y-4">
            {contact.address && (
              <div className="flex items-center p-3 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: colors.primary + '20' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '20' }}>
                  <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: colors.text + '80' }}>{t('ADDRESS')}</p>
                  <p className="text-sm" style={{ color: colors.text }}>{contact.address}</p>
                </div>
              </div>
            )}
            
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center p-3 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: colors.primary + '20' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '20' }}>
                  <Phone className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: colors.text + '80' }}>{t('PHONE')}</p>
                  <p className="text-sm font-medium" style={{ color: colors.text }}>{contact.phone}</p>
                </div>
              </a>
            )}
            
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center p-3 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: colors.primary + '20' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '20' }}>
                  <Mail className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs" style={{ color: colors.text + '80' }}>{t('EMAIL')}</p>
                  <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{contact.email}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Operating Hours */}
      {menuInfo.operating_hours && (
        <div className="mx-4 mb-4 rounded-xl p-4 shadow-sm border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
              {t('Hours')}
            </h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            {menuInfo.operating_hours}
          </p>
        </div>
      )}

      {/* QR Code Share */}
      {qrShare.enable_qr && (
        <div className="mx-4 mb-4 rounded-xl shadow-lg border border-gray-100" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
          <div className="relative overflow-hidden rounded-xl p-4" style={{ 
            background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`
          }}>
            <div className="relative text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary }}>
                <QrCode className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
                {qrShare.qr_title || t('Share Our Bar Menu')}
              </h3>
              
              {qrShare.qr_description ? (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {qrShare.qr_description}
                </p>
              ) : (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {t('Share our premium cocktail menu and nightlife experience')}
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
      )}
    </div>
  );
}