import React from 'react';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Badge } from '@/components/ui/badge';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { handleAppointmentBooking } from '../VCardPreview';
import { QRShareModal } from '@/components/QRShareModal';
import { extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Globe, MapPin, Calendar, Star, Clock, Users, Bed, Wifi, Car, Utensils, Waves, Dumbbell, QrCode, Play, Video } from 'lucide-react';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';

interface HotelResortsTemplateProps {
  data: any;
  template: any;
}

const HotelResortsMapEmbed = React.memo(function HotelResortsMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-lg overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function HotelResortsTemplate({ data, template }: HotelResortsTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);
  const colors = { ...template?.defaultColors, ...configSections.colors } || { 
    primary: '#1E40AF', 
    secondary: '#3B82F6', 
    accent: '#EFF6FF', 
    background: '#F8FAFC', 
    cardBg: '#FFFFFF',
    text: '#1E293B'
  };
  
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Inter, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/[\"\']/g, '');
    
    if (fontFamily && fontFamily !== 'Arial' && fontFamily !== 'sans-serif' && fontFamily !== 'serif') {
      const linkId = `google-font-${fontFamily.replace(/\\s+/g, '-')}`;
      
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [font]);

  // Language selector state
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);

  const [playingKey, setPlayingKey] = React.useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = React.useState(configSections.language?.template_language || 'en');
  const [showQrModal, setShowQrModal] = React.useState(false);

  // RTL languages
  const rtlLanguages = ['ar', 'he'];
  const isRTL = rtlLanguages.includes(currentLanguage);

  // Change language function
  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageSelector(false);
  };

  // Get all sections for this business type
  const allSections = getBusinessTemplate('hotel-resorts')?.sections || [];
  
  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    // Always render sections that have data, don't check for enabled property
    // Special handling for action_buttons - always try to render if section exists
    if (!sectionData || (Object.keys(sectionData).length === 0 && sectionKey !== 'appointments' && sectionKey !== 'action_buttons')) return null;
    // Skip copyright here as it's handled separately
    if (sectionKey === 'copyright') return null;

    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'rooms':
        return renderRoomsSection(sectionData);
      case 'dining':
        return renderDiningSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'google_map':
        return renderLocationSection(sectionData);
      case 'contact_form':
        return renderContactFormSection(sectionData);
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'thank_you':
        return renderThankYouSection(sectionData);
      case 'action_buttons':
        return renderActionButtonsSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'app_download':
        return renderAppDownloadSection(sectionData);
      case 'custom_html':
        return renderCustomHtmlSection(sectionData);
      case 'language':
        return null; // Language switcher is handled in header
      case 'seo':
        return null; // SEO is not rendered in preview
      case 'pixels':
        return null; // Pixels are not rendered in preview
      case 'footer':
        return renderFooterSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
      {/* Hotel Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-white">
          <pattern id="hotel-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="10" height="10" rx="2" />
            <rect x="7" y="7" width="2" height="2" />
            <rect x="11" y="7" width="2" height="2" />
            <rect x="7" y="11" width="2" height="2" />
            <rect x="11" y="11" width="2" height="2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hotel-pattern)" />
        </svg>
      </div>

      <div className="relative p-6">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`}>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLanguageSelector((prev) => !prev);
                }}
                className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md text-white border border-white/40 hover:from-white/40 hover:to-white/30 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
                <span className="uppercase font-medium">{currentLanguage}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <button
                    type="button"
                    aria-label="Close language selector"
                    className="fixed inset-0 z-40 cursor-default bg-transparent"
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-40 max-w-[calc(100vw-1rem)] max-h-48 overflow-y-auto rounded-2xl border bg-white py-1 shadow-2xl`}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="flex w-full cursor-pointer items-center space-x-2 px-3 py-2 text-left text-xs text-gray-800 transition-colors duration-200 hover:bg-gray-50"
                      >
                        <span>
                          {String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="text-center text-white">
          {headerData.profile_image && (
            <div className="w-30 h-30 mx-auto mb-4 rounded-lg border-2 shadow-lg overflow-hidden">
              <img
                src={getImageDisplayUrl(headerData.profile_image)}
                alt="Hotel Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: font }}>
            {headerData.name || data.name || ''}
          </h1>
          
          <p className="text-lg opacity-90 mb-1" style={{ fontFamily: font }}>
            {headerData.title || data.title || ''}
          </p>
          
          {/* Star Rating */}
          {configSections.about?.star_rating && (
            <div className="flex justify-center items-center mb-3">
              {Array.from({length: parseInt(configSections.about.star_rating)}, (_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          )}
          
          {headerData.tagline && (
            <p className="text-sm" style={{ fontFamily: font }}>
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
      {/* Section Title */}
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
          {t('Contact & Reservations')}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`} className="block">
            <div className="relative overflow-hidden rounded-lg p-3" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.primary}08, ${colors.primary}03)`,
                   border: `1px solid ${colors.primary}20`
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                     style={{ backgroundColor: colors.primary }}>
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs opacity-70 mb-0.5" style={{ color: colors.text, fontFamily: font }}>{t('Call Us')}</div>
                  <div className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                    {contactData.phone || data.phone}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20" 
                   style={{ background: colors.primary, transform: 'translate(30%, -30%)' }}></div>
            </div>
          </a>
        )}
        
        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`} className="block">
            <div className="relative overflow-hidden rounded-lg p-3" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.secondary}08, ${colors.secondary}03)`,
                   border: `1px solid ${colors.secondary}20`
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                     style={{ backgroundColor: colors.secondary }}>
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs opacity-70 mb-0.5" style={{ color: colors.text, fontFamily: font }}>{t('Email Us')}</div>
                  <div className="text-sm font-bold truncate" style={{ color: colors.secondary, fontFamily: font }}>
                    {contactData.email || data.email}
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20" 
                   style={{ background: colors.secondary, transform: 'translate(30%, -30%)' }}></div>
            </div>
          </a>
        )}
        
        {contactData.location && (
          <div className="relative overflow-hidden rounded-lg p-3" 
               style={{ 
                 background: `linear-gradient(135deg, ${colors.primary}05, transparent)`,
                 border: `1px solid ${colors.primary}15`
               }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: colors.primary + '15' }}>
                <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="flex-1">
                <div className="text-xs opacity-70 mb-0.5" style={{ color: colors.text, fontFamily: font }}>Location</div>
                <div className="text-sm font-semibold leading-snug" style={{ color: colors.text, fontFamily: font }}>
                  {contactData.location}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    return (
      <div
        className="px-6 py-6"
        style={{
          background: `linear-gradient(180deg, ${colors.primary}08 0%, ${colors.background} 45%, ${colors.secondary}08 100%)`
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('About Our Hotel')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          {/* Description Card */}
          {(aboutData.description || data.description) && (
            <div className="relative overflow-hidden rounded-2xl p-5 mb-5" 
                 style={{ 
                   background: `linear-gradient(135deg, white 0%, ${colors.primary}06 55%, ${colors.secondary}08 100%)`,
                   border: `1px solid ${colors.primary}15`,
                   boxShadow: `0 4px 20px ${colors.primary}08`
                 }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" 
                   style={{ background: colors.primary, transform: 'translate(40%, -40%)' }}></div>
              <p className="relative text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                {aboutData.description || data.description}
              </p>
            </div>
          )}
          
          {/* Amenities Section */}
          {aboutData.amenities && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                     style={{ backgroundColor: colors.primary + '15' }}>
                  <Star className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <p className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>
                  {t('Key Amenities')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {aboutData.amenities.split(',').map((amenity: string, index: number) => (
                  <div key={index} 
                       className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105" 
                       style={{ 
                         backgroundColor: colors.primary + '10',
                         color: colors.primary,
                         border: `1px solid ${colors.primary}20`
                       }}>
                    {amenity.trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Established Year */}
          {aboutData.established_year && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: colors.secondary + '15' }}>
                <Calendar className="w-4 h-4" style={{ color: colors.secondary }} />
              </div>
              <p className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>
                {t('Established')}: {aboutData.established_year}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRoomsSection = (roomsData: any) => {
    const rooms = roomsData.room_types || [];
    if (!Array.isArray(rooms) || rooms.length === 0) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Rooms & Suites')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="grid gap-4">
            {rooms.map((room: any, index: number) => (
              <div key={index} className="rounded-xl overflow-hidden" 
                   style={{ 
                     backgroundColor: colors.cardBg,
                     border: `1px solid ${colors.primary}15`,
                     boxShadow: `0 4px 16px ${colors.primary}08`
                   }}>
                {room.room_image && (
                  <div className="relative overflow-hidden" style={{ height: '160px' }}>
                    <img 
                      src={getImageDisplayUrl(room.room_image)} 
                      alt={room.room_name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="mb-2">
                    <h4 className="font-bold text-base mb-1" style={{ color: colors.text, fontFamily: font }}>
                      {room.room_name}
                    </h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold" style={{ color: colors.primary, fontFamily: font }}>
                        {room.price_from}
                      </span>
                      <span className="text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                        / {t('night')}
                      </span>
                    </div>
                  </div>
                  
                  {room.description && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'cc', fontFamily: font }}>
                      {room.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" 
                         style={{ 
                           backgroundColor: colors.primary + '10',
                           color: colors.primary
                         }}>
                      <Users className="w-3.5 h-3.5" />
                      <span>{room.max_occupancy} {t('guests')}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" 
                         style={{ 
                           backgroundColor: colors.primary + '10',
                           color: colors.primary
                         }}>
                      <Wifi className="w-3.5 h-3.5" />
                      <span>{t('WiFi')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDiningSection = (diningData: any) => {
    const restaurants = diningData.restaurants || [];
    if (!Array.isArray(restaurants) || restaurants.length === 0) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Dining Options')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="grid gap-4">
            {restaurants.map((restaurant: any, index: number) => (
              <div key={index} className="rounded-xl p-4" 
                   style={{ 
                     backgroundColor: colors.cardBg,
                     border: `1px solid ${colors.primary}15`,
                     boxShadow: `0 4px 16px ${colors.primary}08`
                   }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" 
                       style={{ backgroundColor: colors.primary }}>
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base mb-2" style={{ color: colors.text, fontFamily: font }}>
                      {restaurant.restaurant_name}
                    </h4>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" 
                           style={{ 
                             backgroundColor: colors.primary + '15',
                             color: colors.primary
                           }}>
                        {restaurant.cuisine_type}
                      </div>
                      {restaurant.operating_hours && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" 
                             style={{ 
                               backgroundColor: colors.secondary + '15',
                               color: colors.secondary
                             }}>
                          <Clock className="w-3 h-3" />
                          <span>{restaurant.operating_hours}</span>
                        </div>
                      )}
                    </div>
                    
                    {restaurant.description && (
                      <p className="text-sm leading-relaxed" style={{ color: colors.text + 'cc', fontFamily: font }}>
                        {restaurant.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Photo Gallery')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {photos.slice(0, 6).map((photo: any, index: number) => (
              <div key={index} 
                   className="rounded-xl overflow-hidden" 
                   style={{ 
                     border: `1px solid ${colors.primary}15`,
                     boxShadow: `0 4px 16px ${colors.primary}08`,
                     backgroundColor: 'white'
                   }}>
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: '140px' }}>
                  {photo.image ? (
                    <img 
                      src={getImageDisplayUrl(photo.image)} 
                      alt={photo.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" 
                         style={{ backgroundColor: colors.primary + '10' }}>
                      <span className="text-4xl">🏨</span>
                    </div>
                  )}
                </div>
                
                {/* Title and Category */}
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1 leading-tight" 
                      style={{ color: colors.text, fontFamily: font }}>
                    {photo.title || 'Untitled'}
                  </h4>
                  {photo.category && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" 
                         style={{ 
                           backgroundColor: colors.primary + '15',
                           color: colors.primary
                         }}>
                      {photo.category}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Follow Us')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((link: any, index: number) => (
              <div
                key={index}
                className="w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
                style={{ 
                  backgroundColor: colors.primary,
                  boxShadow: `0 4px 12px ${colors.primary}30`
                }}
                onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <SocialIcon platform={link.platform} color="white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Reception Hours')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" 
               style={{ 
                 border: `1px solid ${colors.primary}15`,
                 boxShadow: `0 4px 16px ${colors.primary}08`,
                 backgroundColor: 'white'
               }}>
            {hours.slice(0, 7).map((hour: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center px-4 py-3"
                style={{
                  backgroundColor: hour.is_closed ? colors.background : 'white',
                  borderBottom: index !== Math.min(hours.length, 7) - 1 ? `1px solid ${colors.primary}10` : 'none'
                }}
              >
                <span className="capitalize text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                  {t(hour.day)}
                </span>
                {hour.is_closed ? (
                  <span
                    className="text-sm font-medium px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: colors.primary + '10',
                      color: colors.text + '80',
                      fontFamily: font 
                    }}
                  >
                    {t('Closed')}
                  </span>
                ) : (
                  <span className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                    {hour.open_time} - {hour.close_time}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Make Reservation')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full h-11 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                backgroundColor: colors.primary, 
                color: 'white', 
                fontFamily: font,
                boxShadow: `0 4px 16px ${colors.primary}30`
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              {t('Book Your Stay')}
            </Button>
            
            {appointmentsData?.reservation_phone && (
              <Button
                className="w-full h-11 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                variant="outline"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font,
                  backgroundColor: 'white',
                  borderWidth: '2px'
                }}
                onClick={() => typeof window !== "undefined" && window.open(`tel:${appointmentsData.reservation_phone}`, '_self')}
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('Call Reservations')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    const [currentReview, setCurrentReview] = React.useState(0);

    // Auto-rotate reviews
    React.useEffect(() => {
      if (reviews.length <= 1) return;
      const interval = setInterval(() => {
        setCurrentReview(prev => (prev + 1) % reviews.length);
      }, 4000);
      return () => clearInterval(interval);
    }, [reviews.length]);
    
    return (
      <div className="px-6 py-6" style={{ background: `linear-gradient(135deg, ${colors.background}, ${colors.accent})` }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Guest Reviews')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          {/* Slider Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div className="rounded-xl p-5" 
                       style={{ 
                         backgroundColor: 'white',
                         border: `1px solid ${colors.primary}15`,
                         boxShadow: `0 4px 16px ${colors.primary}08`
                       }}>
                    {/* Rating Stars */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < parseInt(review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    
                    {/* Review Text */}
                    <p className="text-sm leading-relaxed mb-4 italic text-center" 
                       style={{ color: colors.text, fontFamily: font }}>
                      "{review.review}"
                    </p>
                    
                    {/* Guest Info */}
                    <div className="flex justify-between items-center pt-3" 
                         style={{ borderTop: `1px solid ${colors.primary}10` }}>
                      <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                        {review.guest_name}
                      </p>
                      {review.stay_date && (
                        <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
                          {review.stay_date}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Dots */}
          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full cursor-pointer transition-all duration-300"
                  style={{
                    backgroundColor: index === currentReview ? colors.primary : colors.primary + '30'
                  }}
                  onClick={() => setCurrentReview(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Location')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="space-y-3">
            {locationData.map_embed_url && (
              <div className="rounded-xl overflow-hidden" 
                   style={{ 
                     border: `1px solid ${colors.primary}15`,
                     boxShadow: `0 4px 16px ${colors.primary}08`
                   }}>
                <HotelResortsMapEmbed embedHtml={locationData.map_embed_url} />
              </div>
            )}

            {locationData.directions_url && (
              <Button
                className="w-full h-10 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                variant="outline"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font,
                  backgroundColor: 'white',
                  borderWidth: '2px'
                }}
                onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
              >
                <MapPin className="w-5 h-5 mr-2" />
                {t('Get Directions')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {formData.form_title}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="text-center rounded-xl p-5" 
               style={{ 
                 backgroundColor: 'white',
                 border: `1px solid ${colors.primary}15`,
                 boxShadow: `0 4px 16px ${colors.primary}08`
               }}>
            {formData.form_description && (
              <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                {formData.form_description}
              </p>
            )}
            <Button
              className="w-full h-10 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                backgroundColor: colors.primary, 
                color: 'white', 
                fontFamily: font,
                boxShadow: `0 4px 16px ${colors.primary}30`
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Mail className="w-5 h-5 mr-2" />
              {t('Contact Hotel')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            {qrData.qr_title && (
              <>
                <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
                  {qrData.qr_title}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                  <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
                </div>
              </>
            )}
          </div>

          <div className="text-center rounded-xl p-5" 
               style={{ 
                 background: `linear-gradient(135deg, ${colors.primary}08, ${colors.primary}03)`,
                 border: `1px solid ${colors.primary}15`,
                 boxShadow: `0 4px 16px ${colors.primary}08`
               }}>
            {qrData.qr_description && (
              <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                {qrData.qr_description}
              </p>
            )}

            <Button
              className="w-full h-10 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                backgroundColor: colors.primary, 
                color: 'white', 
                fontFamily: font,
                boxShadow: `0 4px 16px ${colors.primary}30`
              }}
              onClick={() => setShowQrModal(true)}
            >
              <QrCode className="w-5 h-5 mr-2" />
              {t('Share Resort Info')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div className="px-6 py-8" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="h-px w-8" style={{ backgroundColor: colors.primary }}></div>
            <Star className="w-5 h-5" style={{ color: colors.primary }} />
            <Star className="w-6 h-6 fill-current" style={{ color: colors.primary }} />
            <Star className="w-5 h-5" style={{ color: colors.primary }} />
            <div className="h-px w-8" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <p className="text-base leading-relaxed max-w-lg mx-auto" 
             style={{ color: colors.text, fontFamily: font }}>
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasAppointmentButton = actionData.appointment_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    // Always render the section if any button text exists
    if (!hasContactButton && !hasAppointmentButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-8" style={{ 
        background: `linear-gradient(to right, ${colors.primary}05, ${colors.secondary}05)`
      }}>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Decorative line */}
            <div className="absolute top-1/2 left-0 right-0 h-px" 
                 style={{ 
                   background: `linear-gradient(to right, transparent, ${colors.primary}30, ${colors.secondary}30, transparent)`,
                   transform: 'translateY(-50%)'
                 }}></div>
            
            <div className="relative flex flex-wrap justify-center gap-4">
              {hasContactButton && (
                <button
                  className="px-8 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    color: 'white', 
                    fontFamily: font,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
                >
                  {actionData.contact_button_text}
                </button>
              )}

              {hasAppointmentButton && (
                <button
                  className="px-8 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                    color: 'white', 
                    fontFamily: font,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleAppointmentBooking(configSections.appointments)}
                >
                  {actionData.appointment_button_text}
                </button>
              )}

              {hasSaveContactButton && (
                <button
                  className="px-8 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-110"
                  style={{ 
                    backgroundColor: 'white',
                    color: colors.primary, 
                    fontFamily: font,
                    border: `2px solid ${colors.primary}`,
                    cursor: 'pointer',
                    boxShadow: `0 4px 12px ${colors.primary}20`
                  }}
                  onClick={() => {
                    const headerData = configSections.header || {};
                    const contactData = configSections.contact || {};
                    const vcfData = {
                      name: headerData.name || data.name || '',
                      title: headerData.title || data.title || '',
                      email: contactData.email || data.email || '',
                      phone: contactData.phone || data.phone || '',
                      website: contactData.website || data.website || '',
                      location: contactData.location || ''
                    };
                    import('@/utils/vcfGenerator').then(module => {
                      module.downloadVCF(vcfData);
                    });
                  }}
                >
                  {actionData.save_contact_button_text}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVideosSection = (videosData: any) => {
    const getYouTubeThumbnail = (embedUrl: string) => {
      if (!embedUrl) return null;
      const srcMatch = embedUrl.match(/src=["']([^"']+)["']/i);
      const url = srcMatch ? srcMatch[1] : embedUrl;
      const embedMatch = url.match(/embed\/([^?&]+)/);
      const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = embedMatch?.[1] || watchMatch?.[1] || null;
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: 'white' }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Property Videos')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="space-y-4">
            {videos.map((video: any, index: number) => {
              const videoKey = `hotel-video-${index}-${video.title || ''}-${video.embed_url || ''}`;
              const videoUrl = video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null;
              const thumbUrl = video.thumbnail
                ? getImageDisplayUrl(video.thumbnail)
                : getYouTubeThumbnail(video.embed_url || '');
              const isPlaying = playingKey === videoKey;

              return (
                <div key={videoKey} className="rounded-xl overflow-hidden" 
                     style={{ 
                       border: `1px solid ${colors.primary}15`,
                       boxShadow: `0 4px 16px ${colors.primary}08`
                     }}>
                  <div className="relative">
                    {isPlaying && videoUrl ? (
                      <div className="w-full relative overflow-hidden bg-black" style={{ paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                          src={`${videoUrl}?autoplay=0&modestbranding=1&rel=0`}
                          className="absolute inset-0 w-full h-full"
                          style={{ border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={video.title || 'Video'}
                        />
                      </div>
                    ) : (
                      <div
                        className="relative w-full cursor-pointer overflow-hidden group"
                        style={{ paddingBottom: '56.25%', height: 0 }}
                        onClick={() => { if (videoUrl) setPlayingKey(videoKey); }}
                      >
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={video.title || 'Video thumbnail'}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center" 
                               style={{ backgroundColor: colors.primary + '10' }}>
                            <Video className="w-12 h-12" style={{ color: colors.primary + '40' }} />
                          </div>
                        )}
                        {videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center" 
                               style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110" 
                                 style={{ 
                                   backgroundColor: 'white',
                                   boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                 }}>
                              <Play className="w-7 h-7 ml-1" style={{ color: colors.primary }} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4" style={{ backgroundColor: colors.background }}>
                    <h4 className="font-bold text-base mb-1.5" style={{ color: colors.text, fontFamily: font }}>
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + 'cc', fontFamily: font }}>
                        {video.description}
                      </p>
                    )}
                    {(video.duration || video.video_type) && (
                      <div className="flex items-center flex-wrap gap-3">
                        {video.duration && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded flex items-center justify-center" 
                                 style={{ backgroundColor: colors.primary + '15' }}>
                              <Clock className="w-3 h-3" style={{ color: colors.primary }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: colors.text + 'aa', fontFamily: font }}>
                              {video.duration}
                            </span>
                          </div>
                        )}
                        {video.video_type && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded flex items-center justify-center" 
                                 style={{ backgroundColor: colors.secondary + '15' }}>
                              <Video className="w-3 h-3" style={{ color: colors.secondary }} />
                            </div>
                            <span className="text-sm font-medium capitalize" style={{ color: colors.text + 'aa', fontFamily: font }}>
                              {video.video_type.replace(/_/g, ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_name && !youtubeData.channel_url && !youtubeData.latest_video_embed) return null;
    
    return (
      <div
        className="px-6 py-6"
        style={{
          background: `linear-gradient(180deg, ${colors.secondary}08 0%, white 40%, ${colors.primary}08 100%)`
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('YouTube Channel')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>
          
          {youtubeData.latest_video_embed && (
            <div className="mb-4 rounded-xl overflow-hidden" 
                 style={{ 
                   border: `1px solid ${colors.primary}15`,
                   boxShadow: `0 4px 16px ${colors.primary}08`
                 }}>
              <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                <div
                  className="absolute inset-0 w-full h-full"
                  ref={createYouTubeEmbedRef(
                    youtubeData.latest_video_embed,
                    { colors, font },
                    "Latest Video"
                  )}
                />
              </div>
            </div>
          )}
          
          <div className="p-4 rounded-xl" 
               style={{ 
                 background: `linear-gradient(135deg, white 0%, ${colors.primary}06 55%, ${colors.secondary}08 100%)`,
                 border: `1px solid ${colors.primary}15`
               }}>
            <h4 className="font-bold text-base mb-2" style={{ color: colors.text, fontFamily: font }}>
              {youtubeData.channel_name}
            </h4>
            {youtubeData.subscriber_count && (
              <p className="text-sm mb-2" style={{ color: colors.text + 'cc', fontFamily: font }}>
                {youtubeData.subscriber_count} {t('subscribers')}
              </p>
            )}
            {youtubeData.channel_description && (
              <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'cc', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}
            <div className="space-y-2">
              {youtubeData.channel_url && (
                <Button
                  size="sm"
                  className="w-full"
                  style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('Subscribe')}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Video className="w-4 h-4 mr-2" />
                  {t('View Playlist')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    
    return (
      <div className="px-6 py-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-2xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-5">
            <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {t('Download App')}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {appData.app_store_url && (
              <Button
                className="h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                variant="outline"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font,
                  backgroundColor: 'white',
                  borderWidth: '2px'
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                <span className="text-sm">App Store</span>
              </Button>
            )}
            {appData.play_store_url && (
              <Button
                className="h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                variant="outline"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font,
                  backgroundColor: 'white',
                  borderWidth: '2px'
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                <span className="text-sm">Play Store</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customData: any) => {
    if (!customData.html_content) return null;
    
    return (
      <div className="px-6 py-6" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.background})` }}>
        <div className="max-w-2xl mx-auto">
          {customData.show_title && customData.section_title && (
            <div className="text-center mb-5">
              <h3 className="text-lg font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
                {customData.section_title}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
              </div>
            </div>
          )}
          <div className="rounded-xl p-5" 
               style={{ 
                 backgroundColor: 'white',
                 border: `1px solid ${colors.primary}15`,
                 boxShadow: `0 4px 16px ${colors.primary}08`
               }}>
            <div dangerouslySetInnerHTML={{ __html: customData.html_content }} 
                 style={{ fontFamily: font, color: colors.text }} />
          </div>
        </div>
      </div>
    );
  };

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer) return null;
    
    return (
      <div className="px-6 py-8" style={{ 
        background: `linear-gradient(to bottom, ${colors.background}, ${colors.accent})`
      }}>
        <div className="max-w-2xl mx-auto">
          {/* Decorative top border */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${colors.primary})` }}></div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            </div>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${colors.primary})` }}></div>
          </div>

          {/* Footer Text */}
          {footerData.footer_text && (
            <p className="text-sm text-center leading-relaxed mb-6" 
               style={{ color: colors.text + 'cc', fontFamily: font }}>
              {footerData.footer_text}
            </p>
          )}

          {/* Footer Links */}
          {footerData.footer_links && footerData.footer_links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {footerData.footer_links.map((link: any, index: number) => (
                <button
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{ 
                    backgroundColor: colors.primary + '10',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`,
                    fontFamily: font,
                    cursor: 'pointer'
                  }}
                  onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
                >
                  {link.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    return null; // Rendered separately at the end
  };

  // Create a style object that will be applied to all text elements
  const globalStyle = {
    fontFamily: font
  };

  // Extract copyright section to render it at the end
  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function, excluding copyright
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections)
    .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright');

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{
      fontFamily: font,
      background: colors.background,
      border: `1px solid ${colors.primary}20`,
      boxShadow: `0 10px 40px ${colors.primary}20`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}

      {/* Copyright always at the end */}
      {copyrightSection && copyrightSection.text && (
        <div className="px-4 pb-4 pt-2">
          <p className="text-sm text-center" style={{ color: colors.text + '70', fontFamily: font }}>
            {copyrightSection.text}
          </p>
        </div>
      )}

      {/* QR Share Modal */}
      <QRShareModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        colors={colors}
        font={font}
        socialLinks={configSections.social?.social_links || []}
      />
    </div>
  );
}
