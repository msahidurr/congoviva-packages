import React from 'react';
import { Calendar, Clock, MapPin, Gift, PartyPopper, Heart, Utensils, Users, Phone, Mail, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getEventTemplate } from '../../event-templates';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface BirthdayTemplateProps {
  data: any;
  template: any;
}

export default function BirthdayTemplate({ data, template }: BirthdayTemplateProps) {
  const { t } = useTranslation();
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#ff6b6b', secondary: '#ffa500', text: '#333333' };
  
  // Get all sections for this event type
  const allSections = getEventTemplate('birthday')?.sections || [];
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  
  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey);
    if (!sectionData || Object.keys(sectionData).length === 0 || !isSectionEnabled(templateConfig, sectionKey)) return null;
    
    switch (sectionKey) {
      case 'event_info':
        return renderEventInfo(sectionData);
      case 'venue':
        return renderVenue(sectionData);
      case 'activities':
        return renderActivities(sectionData);
      case 'food_drinks':
        return renderFoodDrinks(sectionData);
      case 'rsvp':
        return renderRsvp(sectionData);
      case 'gifts':
        return renderGifts(sectionData);
      case 'qr_share':
        return renderQrShare(sectionData);
      default:
        return null;
    }
  };

  const renderEventInfo = (eventInfo: any) => {
    const design = configSections.design || {};
    const hasBirthdayPhoto = design.birthday_photo;
    
    return (
      <div className="relative p-8 text-center overflow-hidden">
        {/* Confetti Animation Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '0s' }}></div>
          <div className="absolute top-8 right-8 w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.secondary, animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-12 left-8 w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: '1s' }}></div>
          <div className="absolute bottom-8 right-12 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '1.5s' }}></div>
        </div>
        
        <div className="relative z-10">
          {/* Birthday Photo */}
          {hasBirthdayPhoto && (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: colors.primary }}>
              <img src={getImageDisplayUrl(design.birthday_photo)} alt="Birthday Person" className="w-full h-full object-cover" />
            </div>
          )}
          
          {/* Age Badge */}
          {eventInfo.age_turning && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold text-white mb-4 shadow-lg" style={{ backgroundColor: colors.secondary }}>
              {eventInfo.age_turning}
            </div>
          )}
          
          {/* Birthday Person Name */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primary }}>
            {eventInfo.birthday_person 
              ? `${eventInfo.birthday_person}`
              : t('Birthday')
            }
          </h1>
          <h2 className="text-2xl font-bold mb-4" style={{ color: colors.secondary }}>
            {t('Birthday Party')}
          </h2>
          
          {/* Theme Badge */}
          {eventInfo.theme && (
            <div className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: colors.accent, color: colors.primary }}>
              🎉 {eventInfo.theme}
            </div>
          )}
          
          {/* Date & Time */}
          {(eventInfo.party_date || eventInfo.party_time) && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mx-4 shadow-lg">
              <div className="flex items-center justify-center space-x-4">
                {eventInfo.party_date && (
                  <div className="text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-1" style={{ color: colors.primary }} />
                    <p className="text-sm font-bold" style={{ color: colors.primary }}>
                      {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(eventInfo.party_date, false) : new Date(eventInfo.party_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {eventInfo.party_time && (
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: colors.secondary }} />
                    <p className="text-sm font-bold" style={{ color: colors.secondary }}>
                      {window.appSettings?.formatTime ? window.appSettings.formatTime(eventInfo.party_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${eventInfo.party_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${eventInfo.party_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                    </p>
                  </div>
                )}
              </div>
              
              {eventInfo.dress_code && (
                <div className="mt-3 text-center">
                  <Badge variant="outline" className="text-xs" style={{ borderColor: colors.primary, color: colors.primary }}>
                    {eventInfo.dress_code}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVenue = (venue: any) => (
    <div className="mx-4 mb-3">
      <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4" style={{ borderColor: colors.primary }}>
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
            <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1" style={{ color: colors.primary }}>
              {venue.venue_name || t('Party Venue')}
            </h3>
            {venue.address && (
              <p className="text-sm mb-2" style={{ color: colors.text }}>
                📍 {venue.address}
              </p>
            )}
            <div className="flex flex-wrap gap-1">
              {venue.parking_info && (
                <div className="inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                  🚗 {venue.parking_info}
                </div>
              )}
              {venue.special_instructions && (
                <div className="inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                  ℹ️ {venue.special_instructions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivities = (activities: any) => {
    if (!activities.activity_list || activities.activity_list.length === 0) return null;
    return (
      <div className="mx-4 mb-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center mb-3">
            <div className="w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary + '20' }}>
              <PartyPopper className="w-5 h-5" style={{ color: colors.secondary }} />
            </div>
            <h3 className="font-bold text-base" style={{ color: colors.primary }}>
              🎪 {t('Party Activities')}
            </h3>
          </div>
          
          <div className="space-y-2">
            {activities.activity_list.slice(0, 4).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-xl" style={{ backgroundColor: colors.accent + '30' }}>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: colors.primary }}>
                    🎯 {activity.activity_name}
                  </p>
                  {activity.description && (
                    <p className="text-xs mt-1" style={{ color: colors.text, opacity: 0.8 }}>
                      {activity.description}
                    </p>
                  )}
                </div>
                {activity.time && (
                  <div className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: colors.secondary, color: 'white' }}>
                    {window.appSettings?.formatTime ? window.appSettings.formatTime(activity.time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${activity.time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${activity.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFoodDrinks = (foodDrinks: any) => {
    if (!foodDrinks.menu_type && !foodDrinks.cake_flavor && (!foodDrinks.menu_items || foodDrinks.menu_items.length === 0)) return null;
    return (
      <div className="mx-4 mb-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="text-center mb-3">
            <div className="w-10 h-10 mx-auto mb-1 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <Utensils className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <h3 className="font-bold text-base" style={{ color: colors.primary }}>
              🍰 {t('Food & Drinks')}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {foodDrinks.menu_type && (
              <div className="text-center p-2 rounded-xl" style={{ backgroundColor: colors.accent + '30' }}>
                <p className="text-xs font-medium mb-1" style={{ color: colors.primary }}>
                  {t('Menu')}
                </p>
                <p className="text-sm font-bold" style={{ color: colors.text }}>
                  {foodDrinks.menu_type}
                </p>
              </div>
            )}
            
            {foodDrinks.cake_flavor && (
              <div className="text-center p-2 rounded-xl" style={{ backgroundColor: colors.secondary + '20' }}>
                <p className="text-xs font-medium mb-1" style={{ color: colors.secondary }}>
                  {t('Cake')}
                </p>
                <p className="text-sm font-bold" style={{ color: colors.text }}>
                  {foodDrinks.cake_flavor}
                </p>
              </div>
            )}
          </div>
          
          {/* Menu Items */}
          {foodDrinks.menu_items && foodDrinks.menu_items.length > 0 && (
            <div className="mt-3">
              <div className="space-y-2">
                {foodDrinks.menu_items.slice(0, 4).map((item: any, index: number) => (
                  <div key={index} className="flex items-start justify-between p-2 rounded-xl" style={{ backgroundColor: colors.accent + '20' }}>
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: colors.primary }}>
                        🍽️ {item.item_name}
                      </p>
                      {item.description && (
                        <p className="text-xs mt-1" style={{ color: colors.text, opacity: 0.8 }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.category && (
                      <div className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: colors.secondary + '30', color: colors.secondary }}>
                        {item.category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-2 flex flex-wrap gap-1 justify-center">
            {foodDrinks.drinks_provided && (
              <Badge variant="outline" className="text-xs" style={{ borderColor: colors.primary, color: colors.primary }}>
                🥤 {t('Drinks Included')}
              </Badge>
            )}
            {foodDrinks.special_dietary && (
              <Badge variant="outline" className="text-xs" style={{ borderColor: colors.secondary, color: colors.secondary }}>
                🌱 {foodDrinks.special_dietary}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRsvp = (rsvp: any) => {
    if (!rsvp.rsvp_phone && !rsvp.rsvp_email) return null;
    return (
      <div className="mx-4 mb-4">
        <div className="rounded-2xl p-6 text-center shadow-lg" style={{ background: `linear-gradient(45deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            🎊 {t('Join the Party!')}
          </h3>
          
          <div className="space-y-2 mb-4">
            {rsvp.rsvp_deadline && (
              <p className="text-white/90 text-sm">
                {t('RSVP by')} {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(rsvp.rsvp_deadline, false) : new Date(rsvp.rsvp_deadline).toLocaleDateString()}
              </p>
            )}
            {rsvp.guest_limit && (
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs">
                {rsvp.guest_limit}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {rsvp.rsvp_phone && (
              <Button 
                className="w-full font-bold shadow-lg"
                style={{ backgroundColor: 'white', color: colors.primary }}
                onClick={() => window.open(`tel:${rsvp.rsvp_phone}`, '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('Call to RSVP')}
              </Button>
            )}
            {rsvp.rsvp_email && (
              <Button 
                className="w-full font-bold shadow-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: colors.secondary }}
                onClick={() => window.open(`mailto:${rsvp.rsvp_email}`, '_self')}
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('Email RSVP')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGifts = (gifts: any) => {
    if (!gifts.gift_preference && !gifts.no_gifts && !gifts.charity_donation) return null;
    
    return (
      <div className="mx-4 mb-3">
        <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
            {gifts.no_gifts ? (
              <Heart className="w-5 h-5" style={{ color: colors.primary }} fill="currentColor" />
            ) : (
              <Gift className="w-5 h-5" style={{ color: colors.primary }} />
            )}
          </div>
          
          <h3 className="font-bold text-base mb-2" style={{ color: colors.primary }}>
            🎁 {gifts.no_gifts ? t('No Gifts Needed') : t('Gift Info')}
          </h3>
          
          {gifts.no_gifts ? (
            <p className="text-sm" style={{ color: colors.text }}>
              {t('Your presence is the only present we need!')}
            </p>
          ) : (
            <div className="space-y-2">
              {gifts.gift_preference && (
                <p className="text-sm" style={{ color: colors.text }}>
                  {gifts.gift_preference}
                </p>
              )}
              {gifts.charity_donation && (
                <div className="mt-2 p-2 rounded-xl" style={{ backgroundColor: colors.accent + '30' }}>
                  <p className="text-xs font-medium" style={{ color: colors.secondary }}>
                    💝 {t('Or donate to')}: {gifts.charity_donation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderQrShare = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="mx-4 mb-4">
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
          {/* Fun confetti background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.primary, animationDelay: '0s' }}></div>
            <div className="absolute top-4 right-6 w-1 h-1 rounded-full animate-bounce" style={{ backgroundColor: colors.secondary, animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-4 left-6 w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: '0.6s' }}></div>
          </div>
          
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: colors.primary + '20' }}>
              <QrCode className="w-8 h-8" style={{ color: colors.primary }} />
            </div>
            
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
              🎊 {qrData.qr_title || t('Share My Party')}
            </h3>
            
            {qrData.qr_description && (
              <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                {qrData.qr_description}
              </p>
            )}
            
            <Button 
              style={{ backgroundColor: colors.primary, color: 'white', padding: '12px 32px', borderRadius: '25px', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openQrModal'))}
            >
              <PartyPopper className="w-5 h-5 mr-2" />
              {t('Share QR Code')}
            </Button>
            
            <div className="mt-3 text-2xl">
              🎉🎂🎈
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get ordered sections
  const orderedSectionKeys = getSectionOrder(templateConfig, allSections)
    .filter(key => key !== 'colors');

  const design = configSections.design || {};
  const hasBackgroundImage = design.background_image;
  
  return (
    <div className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl" style={{ 
      backgroundColor: hasBackgroundImage ? 'transparent' : colors.accent || '#fff5f5',
      backgroundImage: hasBackgroundImage ? `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.05)), url(${getImageDisplayUrl(design.background_image)})` : 'none',
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