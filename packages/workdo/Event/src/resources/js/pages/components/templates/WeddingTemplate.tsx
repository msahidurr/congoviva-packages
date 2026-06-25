import React from 'react';
import { Calendar, Clock, MapPin, Heart, Gift, Users, Phone, Mail, Sparkles, Hotel, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getEventTemplate } from '../../event-templates';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface WeddingTemplateProps {
  data: any;
  template: any;
}

export default function WeddingTemplate({ data, template }: WeddingTemplateProps) {
  const { t } = useTranslation();
  const configSections = data.config_sections || {};
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#e91e63', secondary: '#f8bbd9', text: '#333333' };
  
  // Get all sections for this event type
  const allSections = getEventTemplate('wedding')?.sections || [];
  const templateConfig = data.template_config || { sections: configSections, sectionSettings: configSections };
  
  const renderSection = (sectionKey: string) => {
    const sectionData = getSectionData(templateConfig, sectionKey);
    if (!sectionData || Object.keys(sectionData).length === 0 || !isSectionEnabled(templateConfig, sectionKey)) return null;
    
    switch (sectionKey) {
      case 'event_info':
        return renderEventInfo(sectionData);
      case 'ceremony':
        return renderCeremony(sectionData);
      case 'reception':
        return renderReception(sectionData);
  case 'wedding_party':
    return renderWeddingParty(sectionData);
  case 'guests':
    return renderGuests(sectionData);
  case 'rsvp':
        return renderRsvp(sectionData);
      case 'registry':
        return renderRegistry(sectionData);
      case 'accommodations':
        return renderAccommodations(sectionData);
      case 'qr_share':
        return renderQrShare(sectionData);
      default:
        return null;
    }
  };

  const renderEventInfo = (eventInfo: any) => {
    const design = configSections.design || {};
    const hasCouplePhoto = design.couple_photo;
    const hasBackgroundImage = design.background_image;
    
    return (
      <div className="relative overflow-hidden" style={{ 
        backgroundImage: !hasBackgroundImage ? `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)` : 'none'
      }}>
        {/* Elegant Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 60 60">
            <defs>
              <pattern id="floral" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill={colors.primary} opacity="0.3"/>
                <path d="M30 20 Q35 25 30 30 Q25 25 30 20" fill={colors.primary} opacity="0.2"/>
                <path d="M30 40 Q35 35 30 30 Q25 35 30 40" fill={colors.primary} opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#floral)" />
          </svg>
        </div>
        
        <div className="relative p-8 text-center">
          {/* Couple Photo */}
          {hasCouplePhoto && (
            <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 shadow-lg" style={{ borderColor: colors.background }}>
              <img src={getImageDisplayUrl(design.couple_photo)} alt="Couple" className="w-full h-full object-cover" />
            </div>
          )}
          
          {/* Elegant Divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12" style={{ backgroundColor: colors.primary }}></div>
            <Heart className="w-5 h-5 mx-4" style={{ color: colors.primary }} fill="currentColor" />
            <div className="h-px w-12" style={{ backgroundColor: colors.primary }}></div>
          </div>
          
          {/* Couple Names */}
          <div className="mb-8">
            {eventInfo.bride_name && eventInfo.groom_name ? (
              <div className="space-y-4">
                <h1 className="text-4xl font-serif font-light tracking-wide" style={{ color: colors.primary }}>
                  {eventInfo.bride_name}
                </h1>
                <div className="flex items-center justify-center">
                  <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
                  <span className="mx-6 text-3xl font-serif font-light" style={{ color: colors.secondary }}>&</span>
                  <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
                </div>
                <h1 className="text-4xl font-serif font-light tracking-wide" style={{ color: colors.primary }}>
                  {eventInfo.groom_name}
                </h1>
              </div>
            ) : (
              <h1 className="text-3xl font-serif font-light" style={{ color: colors.primary }}>
                {t('Wedding Celebration')}
              </h1>
            )}
            
            {eventInfo.save_the_date && (
              <p className="text-base italic font-light mt-6 tracking-wide" style={{ color: colors.text }}>
                {eventInfo.save_the_date}
              </p>
            )}
          </div>
          
          {/* Wedding Date & Time */}
          {(eventInfo.wedding_date || eventInfo.wedding_time) && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mx-4 shadow-lg">
              {eventInfo.wedding_date && (
                <>
                  <Calendar className="w-6 h-6 mx-auto mb-3" style={{ color: colors.primary }} />
                  <p className="text-xl font-serif font-medium mb-2" style={{ color: colors.primary }}>
                    {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(eventInfo.wedding_date, false) : new Date(eventInfo.wedding_date).toLocaleDateString()}
                  </p>
                </>
              )}
              {eventInfo.wedding_time && (
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5" style={{ color: colors.secondary }} />
                  <p className="text-lg font-serif font-medium" style={{ color: colors.secondary }}>
                    {window.appSettings?.formatTime ? window.appSettings.formatTime(eventInfo.wedding_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${eventInfo.wedding_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${eventInfo.wedding_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                  </p>
                </div>
              )}
              {eventInfo.wedding_hashtag && (
                <div className="inline-block px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                  {eventInfo.wedding_hashtag}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCeremony = (ceremony: any) => (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
            <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
          </div>
          <h3 className="text-2xl font-serif font-light" style={{ color: colors.primary }}>
            {t('Ceremony')}
          </h3>
          <div className="flex items-center justify-center mt-3">
            <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {ceremony.ceremony_time && (
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-5 h-5" style={{ color: colors.primary }} />
              <p className="text-lg font-medium" style={{ color: colors.text }}>
                {window.appSettings?.formatTime ? window.appSettings.formatTime(ceremony.ceremony_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${ceremony.ceremony_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${ceremony.ceremony_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
              </p>
            </div>
          )}
          
          {ceremony.ceremony_venue && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                <p className="text-lg font-medium" style={{ color: colors.text }}>
                  {ceremony.ceremony_venue}
                </p>
              </div>
              {ceremony.ceremony_address && (
                <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                  {ceremony.ceremony_address}
                </p>
              )}
            </div>
          )}
          
          {ceremony.ceremony_dress_code && (
            <div className="text-center mt-4">
              <div className="inline-block px-6 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                {ceremony.ceremony_dress_code}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderReception = (reception: any) => (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary + '15' }}>
            <Gift className="w-6 h-6" style={{ color: colors.secondary }} />
          </div>
          <h3 className="text-2xl font-serif font-light" style={{ color: colors.primary }}>
            {t('Reception')}
          </h3>
          <div className="flex items-center justify-center mt-3">
            <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {reception.reception_time && (
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-5 h-5" style={{ color: colors.secondary }} />
              <p className="text-lg font-medium" style={{ color: colors.text }}>
                {window.appSettings?.formatTime ? window.appSettings.formatTime(reception.reception_time) : window.appSettings?.timeFormat?.includes('A') ? new Date(`2000-01-01T${reception.reception_time}`).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit', hour12: true}) : new Date(`2000-01-01T${reception.reception_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
              </p>
            </div>
          )}
          
          {reception.reception_venue && (
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <MapPin className="w-5 h-5" style={{ color: colors.secondary }} />
                <p className="text-lg font-medium" style={{ color: colors.text }}>
                  {reception.reception_venue}
                </p>
              </div>
              {reception.reception_address && (
                <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                  {reception.reception_address}
                </p>
              )}
            </div>
          )}
          
          {reception.dinner_style && (
            <div className="text-center mt-4">
              <div className="inline-block px-6 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
                {reception.dinner_style}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderWeddingParty = (weddingParty: any) => {
    if (!weddingParty.bridal_party || weddingParty.bridal_party.length === 0) return null;
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
              <Users className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-2xl font-serif font-light" style={{ color: colors.primary }}>
              {t('Wedding Party')}
            </h3>
            <div className="flex items-center justify-center mt-3">
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {weddingParty.bridal_party.map((member: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-lg font-serif shadow-lg" style={{ backgroundColor: colors.primary }}>
                  {member.name ? member.name.charAt(0).toUpperCase() : 'W'}
                </div>
                <h4 className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  {member.name}
                </h4>
                <p className="text-xs font-light" style={{ color: colors.secondary }}>
                  {member.role}
                </p>
                {member.relationship && (
                  <p className="text-xs mt-0.5" style={{ color: colors.text, opacity: 0.6 }}>
                    {member.relationship}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGuests = (guests: any) => {
    if (!guests.guests_list || guests.guests_list.length === 0) return null;
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
              <Users className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-2xl font-serif font-light" style={{ color: colors.primary }}>
              {t('Guest List')}
            </h3>
            <div className="flex items-center justify-center mt-3">
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {guests.guests_list.map((guest: any, index: number) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white text-lg font-serif shadow-lg" style={{ backgroundColor: colors.primary }}>
                  {guest.first_name ? guest.first_name.charAt(0).toUpperCase() : 'G'}
                </div>
                <h4 className="text-sm font-medium mb-1" style={{ color: colors.text }}>
                  {guest.first_name} {guest.last_name}
                </h4>
                <p className="text-xs font-light" style={{ color: colors.secondary }}>
                  {guest.relationship}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs font-light" style={{ color: colors.text }}>
                    Table: <span className="font-medium" style={{ color: colors.primary }}>{guest.table}</span>
                  </span>
                  <span className="text-xs" style={{ color: colors.secondary }}>•</span>
                  <span className="text-xs font-light" style={{ color: colors.text }}>
                    Seat: <span className="font-medium" style={{ color: colors.primary }}>{guest.seat}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderRsvp = (rsvp: any) => {
    if (!rsvp.rsvp_url) return null;
    return (
      <div className="p-6">
        <div className="rounded-3xl p-8 text-center shadow-xl" style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          
          <h3 className="text-2xl font-serif font-light text-white mb-4">
            {t('Please RSVP')}
          </h3>
          
          <div className="space-y-2 mb-6">
            {rsvp.rsvp_deadline && (
              <p className="text-white/90 text-sm">
                {t('by')} {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(rsvp.rsvp_deadline, false) : new Date(rsvp.rsvp_deadline).toLocaleDateString()}
              </p>
            )}
            {rsvp.guest_limit && (
              <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-xs">
                {rsvp.guest_limit}
              </div>
            )}
          </div>
          
          <Button 
            className="px-10 py-3 rounded-full font-serif text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: 'white', color: colors.primary }}
            onClick={() => window.open(rsvp.rsvp_url, '_blank')}
          >
            {t('RSVP Now')}
          </Button>
          
          {rsvp.rsvp_phone && (
            <p className="text-white/80 text-sm mt-4">
              {t('or call')} {rsvp.rsvp_phone}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderRegistry = (registry: any) => {
    if (!registry.registry_links || registry.registry_links.length === 0) return null;
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
              <Gift className="w-6 h-6" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-2xl font-serif font-light" style={{ color: colors.primary }}>
              {t('Gift Registry')}
            </h3>
            <div className="flex items-center justify-center mt-3">
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            {registry.registry_links.slice(0, 3).map((link: any, index: number) => (
              <button 
                key={index}
                className="w-full px-8 py-3 rounded-full border-2 text-base font-medium transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                style={{ 
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.primary;
                  (e.currentTarget as HTMLButtonElement).style.color = 'white';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = colors.primary;
                }}
                onClick={() => window.open(link.registry_url, '_blank')}
              >
                {link.store_name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAccommodations = (accommodations: any) => {
    if (!accommodations.hotel_name) return null;
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary + '15' }}>
              <Hotel className="w-6 h-6" style={{ color: colors.secondary }} />
            </div>
            <h3 className="text-2xl font-serif font-light" style={{ color: colors.primary }}>
              {t('Accommodations')}
            </h3>
            <div className="flex items-center justify-center mt-3">
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-xl font-medium" style={{ color: colors.text }}>
              {accommodations.hotel_name}
            </p>
            
            {accommodations.hotel_address && (
              <p className="text-sm leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
                {accommodations.hotel_address}
              </p>
            )}
            
            <div className="flex justify-center items-center space-x-6 mt-4">
              {accommodations.hotel_phone && (
                <a href={`tel:${accommodations.hotel_phone}`} className="text-sm hover:underline font-medium" style={{ color: colors.secondary }}>
                  {accommodations.hotel_phone}
                </a>
              )}
              
              {accommodations.booking_code && (
                <div className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: colors.accent, color: colors.secondary }}>
                  {accommodations.booking_code}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQrShare = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12" style={{ backgroundColor: colors.secondary }}></div>
            <Heart className="w-5 h-5 mx-4" style={{ color: colors.primary }} fill="currentColor" />
            <div className="h-px w-12" style={{ backgroundColor: colors.secondary }}></div>
          </div>
          
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
            <QrCode className="w-10 h-10" style={{ color: colors.primary }} />
          </div>
          
          <h3 className="text-2xl font-serif font-light mb-3" style={{ color: colors.primary }}>
            {qrData.qr_title || t('Share Our Wedding')}
          </h3>
          
          {qrData.qr_description && (
            <p className="text-sm font-light mb-6 leading-relaxed" style={{ color: colors.text, opacity: 0.8 }}>
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            className="px-10 py-3 rounded-full font-serif text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: colors.primary, color: 'white' }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openQrModal'))}
          >
            <Heart className="w-5 h-5 mr-2" fill="currentColor" />
            {t('Share QR Code')}
          </Button>
          
          <div className="flex items-center justify-center mt-6">
            <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-2 h-2 mx-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="h-px w-8" style={{ backgroundColor: colors.secondary }}></div>
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
    <div className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl" style={{ 
      backgroundColor: hasBackgroundImage ? 'transparent' : colors.accent || '#fafafa',
      backgroundImage: hasBackgroundImage ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.05)), url(${getImageDisplayUrl(design.background_image)})` : 'none',
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
