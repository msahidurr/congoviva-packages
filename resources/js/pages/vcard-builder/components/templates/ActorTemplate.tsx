import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, Download, UserPlus, Share2, QrCode, Star, Play, Clock, Video, Youtube } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface ActorTemplateProps {
  data: any;
  template: any;
}

const ActorMapEmbed = React.memo(function ActorMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="h-60 w-full overflow-hidden">
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function ActorTemplate({ data, template }: ActorTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#460B0D', secondary: '#F2F2F2', accent: '#881346', text: '#111111' };
  
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Lora, serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Lora, serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/[\"\\']/g, '');
    
    if (fontFamily && fontFamily !== 'Arial' && fontFamily !== 'sans-serif' && fontFamily !== 'serif') {
      const linkId = `google-font-${fontFamily.replace(/\s+/g, '-')}`;
      
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [font]);

  // Language selector state
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState(configSections.language?.template_language || 'en');

  // QR Modal state
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
  const allSections = getBusinessTemplate('actor')?.sections || [];
  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'awards':
        return renderAwardsSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'google_map':
        return renderLocationSection(sectionData);
      case 'app_download':
        return renderAppDownloadSection(sectionData);
      case 'contact_form':
        return renderContactFormSection(sectionData);
      case 'custom_html':
        return renderCustomHtmlSection(sectionData);
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'thank_you':
        return renderThankYouSection(sectionData);
      case 'action_buttons':
        return renderActionButtonsSection(sectionData);
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative overflow-visible">
      {/* Modern Banner */}
      <div className="relative h-[280px] overflow-hidden">
        {/* Base Banner Image */}
        {headerData.banner_image ? (
          <div className="absolute inset-0">
            <img
              src={getImageDisplayUrl(headerData.banner_image)}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            <div 
              className="w-full h-full"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              }}
            />
          </div>
        )}
        
        {/* Banner Background Image Overlay - Semi Transparent */}
        {headerData.banner_bg_image && (
          <div className="absolute inset-0" style={{ zIndex: 1, opacity: 0.15 }}>
            <img
              src={getImageDisplayUrl(headerData.banner_bg_image)}
              alt="Banner Overlay"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" style={{ zIndex: 1 }} />
        
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="cursor-pointer flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all"
                style={{ color: '#FFFFFF' }}
              >
                <span>
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
                <span className="uppercase font-semibold">{currentLanguage}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <div
                    className="fixed inset-0"
                    style={{ zIndex: 99998 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-2 rounded-2xl border shadow-2xl py-2 w-40 max-h-48 overflow-y-auto bg-black/90 backdrop-blur-xl"
                    style={{ zIndex: 99999, borderColor: colors.primary + '40' }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="cursor-pointer w-full text-left px-4 py-2.5 text-sm flex items-center space-x-2 hover:bg-white/10 transition-colors"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '30' : 'transparent',
                          color: '#FFFFFF'
                        }}
                      >
                        <span>
                          {String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}
                        </span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Section - Modern & Clean */}
      <div className="relative" style={{ 
        zIndex: 10,
        background: 'white',
        paddingTop: '20px',
        paddingBottom: '24px'
      }}>
        {/* Profile Image - Centered & Elegant */}
        <div className="flex justify-center" style={{ marginTop: '-70px' }}>
          <div className="relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden" style={{ 
              border: `3px solid white`,
              boxShadow: `0 4px 20px ${colors.primary}20`
            }}>
              {headerData.profile_image ? (
                <img
                  src={getImageDisplayUrl(headerData.profile_image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl" style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
                }}>
                  🎭
                </div>
              )}
            </div>
            
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center" style={{ 
              backgroundColor: colors.primary,
              border: '2px solid white',
              boxShadow: `0 2px 10px ${colors.primary}30`
            }}>
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        </div>

        {/* Name & Title - Clean & Professional */}
        <div className="text-center mt-5 px-6" style={{ fontFamily: font }}>
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            {headerData.name || data.name || 'Jolie Doe'}
          </h1>
          
          {/* Title */}
          {(headerData.title || data.title) && (
            <p className="text-base font-medium mb-3" style={{ color: colors.primary }}>
              {headerData.title || data.title}
            </p>
          )}

          {/* Bio */}
          {(headerData.description || headerData.tagline) && (
            <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ 
              color: colors.text + 'B3'
            }}>
              {headerData.description || headerData.tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-6" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}` }}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
          {t('Contact')}
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
          }} />
        </h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {(contactData.phone || data.phone) && (
          <a
            href={`tel:${contactData.phone || data.phone}`}
            className="flex flex-col items-center p-4 rounded-xl transition-all"
            style={{ backgroundColor: colors.primary + '10' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary + '20'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary + '10'}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.primary }}>
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: colors.text, fontFamily: font }}>
              {contactData.phone || data.phone}
            </span>
          </a>
        )}
        
        {(contactData.email || data.email) && (
          <a
            href={`mailto:${contactData.email || data.email}`}
            className="flex flex-col items-center p-4 rounded-xl transition-all"
            style={{ backgroundColor: colors.primary + '10' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary + '20'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary + '10'}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.primary }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center truncate w-full" style={{ color: colors.text, fontFamily: font }}>
              {contactData.email || data.email}
            </span>
          </a>
        )}
        
        {(contactData.website || data.website) && (
          <a
            href={contactData.website || data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded-xl transition-all"
            style={{ backgroundColor: colors.primary + '10' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary + '20'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary + '10'}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.primary }}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center truncate w-full" style={{ color: colors.text, fontFamily: font }}>
              {(contactData.website || data.website)?.replace(/^https?:\/\//, '')}
            </span>
          </a>
        )}
        
        {(contactData.location || data.location) && (
          <div
            className="flex flex-col items-center p-4 rounded-xl"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: colors.primary }}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: colors.text, fontFamily: font }}>
              {contactData.location || data.location}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-6 py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}03 100%)`
      }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.primary}08, transparent)`,
          filter: 'blur(40px)'
        }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}08, transparent)`,
          filter: 'blur(40px)'
        }} />

        <div className="relative max-w-3xl mx-auto">
          {/* Title with underline */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('About Me')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Bio Description */}
          <p className="text-sm leading-relaxed text-center mb-8" style={{ color: colors.text + 'DD', fontFamily: font }}>
            {aboutData.description || data.description}
          </p>

          {/* Specialties */}
          {aboutData.specialties && (
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-lg">✨</span>
                <span className="text-sm font-bold" style={{ color: colors.accent, fontFamily: font }}>
                  {t('Specialties')}
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                  <span key={index} className="px-4 py-2 text-xs font-medium" style={{ 
                    backgroundColor: colors.primary + '10',
                    color: colors.primary,
                    borderLeft: `3px solid ${colors.primary}`,
                    fontFamily: font
                  }}>
                    {specialty.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {aboutData.experience && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5" style={{ 
                backgroundColor: colors.primary + '12',
                borderRadius: '10px'
              }}>
                <Star className="w-4 h-4" style={{ color: colors.primary, fill: colors.primary }} />
                <span className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                  {aboutData.experience}+ {t('Years Experience')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const mediaList = galleryData.media_list || [];
    if (!Array.isArray(mediaList) || mediaList.length === 0) return null;

    return (
      <div className="py-12" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        backgroundColor: 'white'
      }}>
        <div className="px-4">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Gallery')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Gallery Grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 gap-3">
              {mediaList.map((media: any, index: number) => (
                <div 
                  key={index} 
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                  style={{ 
                    backgroundColor: colors.secondary || '#F5F5F5',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Media Content */}
                  <div className="relative" style={{ paddingBottom: '125%' }}>
                    <div className="absolute inset-0">
                      {media.image ? (
                        <>
                          <img
                            src={getImageDisplayUrl(media.image)}
                            alt={media.title || 'Gallery'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '10' }}>
                          <span className="text-4xl">🎭</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Media Title - Always Visible */}
                  {media.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)'
                    }}>
                      <p className="text-sm font-semibold text-white leading-tight" style={{ 
                        fontFamily: font,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}>
                        {media.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}03 100%)`
      }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.primary}06, transparent)`,
          filter: 'blur(50px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Connect With Me')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
            {socialLinks.map((link: any, index: number) => (
              <button
                key={index}
                onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                style={{
                  backgroundColor: colors.primary + '15',
                  border: `1px solid ${colors.primary}20`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primary + '15';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title={link.username ? `${link.platform}: @${link.username}` : link.platform}
              >
                <div style={{ color: colors.primary }} className="social-icon-wrapper">
                  <SocialIcon platform={link.platform} color="currentColor" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <style>{`
          .social-icon-wrapper svg {
            transition: color 0.3s ease;
          }
          button:hover .social-icon-wrapper {
            color: #FFFFFF !important;
          }
        `}</style>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Business Hours')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Hours Table */}
          <div className="max-w-md mx-auto">
            {hours.map((hour: any, index: number) => (
              <div 
                key={index}
                className="flex items-center justify-between py-4 transition-all"
                style={{ 
                  borderBottom: index < hours.length - 1 ? `1px solid ${colors.primary}15` : 'none'
                }}
              >
                <span className="text-base font-semibold capitalize" style={{ color: colors.text, fontFamily: font }}>
                  {t(hour.day)}
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ 
                    color: hour.is_closed ? colors.text + '60' : colors.primary,
                    fontFamily: font
                  }}
                >
                  {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}03 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.primary}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {appointmentsData.appointment_title || t('Make an Appointment')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            {/* Date Picker */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                <label className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                  {t('Select Date')}
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pick a date"
                  className="w-full px-4 py-3 text-sm rounded-xl transition-all"
                  style={{ 
                    border: `2px solid ${colors.primary}20`,
                    fontFamily: font,
                    color: colors.text,
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = colors.primary}
                  onBlur={(e) => e.currentTarget.style.borderColor = colors.primary + '20'}
                  readOnly
                />
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" style={{ color: colors.primary }} />
                <label className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                  {t('Select Time')}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['10:00 - 11:00', '11:00 - 12:00', '14:00 - 15:00', '15:00 - 16:00'].map((time, index) => (
                  <button
                    key={index}
                    className="px-4 py-3 text-sm font-medium rounded-xl transition-all cursor-pointer"
                    style={{
                      border: `2px solid ${colors.primary}20`,
                      color: colors.primary,
                      backgroundColor: 'white',
                      fontFamily: font
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = colors.primary;
                      e.currentTarget.style.borderColor = colors.primary + '20';
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Button */}
            <button
              className="w-full py-3 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                fontFamily: font,
                boxShadow: `0 4px 20px ${colors.primary}30`
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-5 h-5" />
              {t('Book Appointment')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Services')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Services Grid */}
          <div className="max-w-2xl mx-auto space-y-6">
            {services.map((service: any, index: number) => (
              <div key={index} className="relative">
                <div className="rounded-2xl overflow-hidden transition-all" style={{ 
                  backgroundColor: 'white',
                  border: `1px solid ${colors.primary}15`,
                  boxShadow: `0 2px 15px ${colors.primary}08`
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 4px 25px ${colors.primary}15`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 2px 15px ${colors.primary}08`}>
                  {/* Service Image */}
                  <div className="w-full h-48 overflow-hidden" style={{ backgroundColor: colors.secondary }}>
                    {service.image ? (
                      <img
                        src={getImageDisplayUrl(service.image)}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                        <div className="text-center">
                          <span className="text-5xl mb-2 block">🎭</span>
                          <span className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>{t('Service')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Content */}
                  <div className="p-5">
                    <h4 className="text-lg font-semibold mb-2" style={{ color: colors.text, fontFamily: font }}>
                      {service.title || 'Modeling'}
                    </h4>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {service.description }
                    </p>
                    {service.url && (
                      <button
                        className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                        style={{
                          backgroundColor: colors.primary + '15',
                          color: colors.primary,
                          border: `1px solid ${colors.primary}30`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary;
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = colors.primary + '15';
                          e.currentTarget.style.color = colors.primary;
                        }}
                        onClick={() => typeof window !== "undefined" && window.open(service.url, '_blank', 'noopener,noreferrer')}
                      >
                        {t('Learn More')} →
                      </button>
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

  // Gallery slider state
  const [currentGalleryIndex, setCurrentGalleryIndex] = React.useState(0);
  const [isGalleryAutoPlay, setIsGalleryAutoPlay] = React.useState(true);

  // Services slider state
  const [currentServiceIndex, setCurrentServiceIndex] = React.useState(0);

  // Testimonials state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = React.useState(0);
  // Video playing state
  const [playingKey, setPlayingKey] = React.useState<string | null>(null);
  // Gallery slider effect
  React.useEffect(() => {
    const galleryData = configSections.gallery;
    const mediaList = galleryData?.media_list || [];
    if (!Array.isArray(mediaList) || mediaList.length <= 1 || !isGalleryAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentGalleryIndex(prev => {
        const nextIndex = (prev + 1) % mediaList.length;
        return nextIndex;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.gallery?.media_list, isGalleryAutoPlay, currentGalleryIndex]);

  // Services slider effect
  React.useEffect(() => {
    // Removed auto-scroll for services since we're using grid layout now
  }, [configSections.services?.service_list]);

  // Effect for testimonials rotation
  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);

  const renderAwardsSection = (awardsData: any) => {
    const awards = awardsData.award_list || [];
    if (!Array.isArray(awards) || awards.length === 0) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Awards & Recognition')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          <div className="max-w-3xl mx-auto">
            {awards.map((award: any, index: number) => (
              <div
                key={index}
                className={`py-5 transition-all ${index !== awards.length - 1 ? 'border-b' : ''}`}
                style={{
                  borderColor: colors.primary + '12'
                }}
              >
                <div className="rounded-3xl border bg-white p-4 sm:p-5" style={{ borderColor: colors.primary + '12', boxShadow: `0 4px 18px ${colors.primary}08` }}>
                  {award.image && (
                    <div className="mb-4 overflow-hidden rounded-2xl">
                      <div className="aspect-[16/7] w-full">
                        <img
                          src={getImageDisplayUrl(award.image)}
                          alt={award.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-semibold leading-snug text-left" style={{ color: colors.text, fontFamily: font }}>
                          {award.title}
                        </h4>
                        {award.category && (
                          <p className="mt-1 text-sm font-medium text-left" style={{ color: colors.primary, fontFamily: font }}>
                            {award.category}
                          </p>
                        )}
                      </div>

                      {award.year && (
                        <span
                          className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: colors.primary + '10',
                            color: colors.primary,
                            fontFamily: font
                          }}
                        >
                          {award.year}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {award.organization && (
                        <div className="text-sm text-left" style={{ color: colors.text + 'A0', fontFamily: font }}>
                          {award.organization}
                        </div>
                      )}

                      {award.project && (
                        <div className="text-sm text-left" style={{ color: colors.text + 'A0', fontFamily: font }}>
                          <span style={{ color: colors.text + '80' }}>For: </span>
                          {award.project}
                        </div>
                      )}
                    </div>

                    {award.description && (
                      <p className="text-sm leading-relaxed text-left" style={{ color: colors.text + 'B3', fontFamily: font }}>
                        {award.description}
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

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Testimonials')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Testimonial Card */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6 w-10 h-10 rounded-full flex items-center justify-center z-10" style={{ 
                backgroundColor: colors.primary,
                boxShadow: `0 4px 15px ${colors.primary}30`
              }}>
                <span className="text-3xl text-white">“</span>
              </div>

              {/* Content */}
              <div className="pt-8 pb-6 px-6 rounded-2xl" style={{ 
                backgroundColor: 'white',
                border: `1px solid ${colors.primary}15`,
                boxShadow: `0 4px 20px ${colors.primary}08`
              }}>
                <p className="text-sm leading-relaxed mb-6 text-center" style={{ color: colors.text + 'DD', fontFamily: font }}>
                  {reviews[currentTestimonialIndex]?.review || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus maecenas.'}
                </p>

                {/* Client Info */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden" style={{ 
                    border: `3px solid ${colors.primary}`,
                    boxShadow: `0 2px 10px ${colors.primary}20`
                  }}>
                    {reviews[currentTestimonialIndex]?.client_image ? (
                      <img
                        src={getImageDisplayUrl(reviews[currentTestimonialIndex].client_image)}
                        alt={reviews[currentTestimonialIndex].client_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                        <span className="text-2xl">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-base" style={{ color: colors.text, fontFamily: font }}>
                      {reviews[currentTestimonialIndex]?.client_name || 'Client Name'}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3" style={{ color: '#FFD700', fill: '#FFD700' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            {reviews.length > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {reviews.map((_, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className="transition-all cursor-pointer"
                    style={{
                      width: index === currentTestimonialIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: index === currentTestimonialIndex ? colors.primary : colors.primary + '30'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('YouTube Channel')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            {youtubeData.latest_video_embed && (
              <div className="overflow-hidden rounded-2xl" style={{
                backgroundColor: 'white',
                border: `1px solid ${colors.primary}15`,
                boxShadow: `0 2px 15px ${colors.primary}08`
              }}>
                <div className="relative aspect-[16/8] w-full overflow-hidden">
                  <div
                    className="absolute inset-0 h-full w-full"
                    ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
                  />
                </div>
              </div>
            )}

            <div className="rounded-2xl p-5" style={{
                backgroundColor: 'white',
                border: `1px solid ${colors.primary}15`,
                boxShadow: `0 2px 15px ${colors.primary}08`
            }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FF0000' }}>
                  <Youtube className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium mb-0.5 truncate" style={{ color: colors.text, fontFamily: font }}>
                    {youtubeData.channel_name || 'YouTube Channel'}
                  </h4>
                  {youtubeData.subscriber_count && (
                    <p className="text-xs" style={{ color: colors.text + '99', fontFamily: font }}>
                      {youtubeData.subscriber_count} {t('subscribers')}
                    </p>
                  )}
                </div>
              </div>

              {youtubeData.channel_description && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {youtubeData.channel_description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {youtubeData.channel_url && (
                  <button
                    className="py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      fontFamily: font
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                  >
                    <Youtube className="w-5 h-5" />
                    {t('Subscribe')}
                  </button>
                )}
                {youtubeData.featured_playlist && (
                  <button
                    className="py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      backgroundColor: colors.primary + '15',
                      color: colors.primary,
                      border: `1px solid ${colors.primary}30`,
                      fontFamily: font
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary + '15';
                      e.currentTarget.style.color = colors.primary;
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                  >
                    <Play className="w-5 h-5" />
                    {t('Playlist')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Quick Actions')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 max-w-md mx-auto">
            <button
              className="hover-bg-primary flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer flex-1"
              style={{ 
                backgroundColor: colors.primary + '15',
                color: colors.primary,
                border: `1px solid ${colors.primary}30`,
                fontFamily: font
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
              <Download className="w-6 h-6 mb-2" />
              <span className="text-sm font-semibold">{actionData.save_contact_button_text || t('Save')}</span>
            </button>
            
            <button
              className="hover-bg-primary flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer flex-1"
              style={{ 
                backgroundColor: colors.primary + '15',
                color: colors.primary,
                border: `1px solid ${colors.primary}30`,
                fontFamily: font
              }}
              onClick={() => setShowQrModal(true)}
            >
              <Share2 className="w-6 h-6 mb-2" />
              <span className="text-sm font-semibold">{actionData.share_button_text || t('Share')}</span>
            </button>
            
            <button
              className="hover-bg-primary flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer flex-1"
              style={{ 
                backgroundColor: colors.primary + '15',
                color: colors.primary,
                border: `1px solid ${colors.primary}30`,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Phone className="w-6 h-6 mb-2" />
              <span className="text-sm font-semibold">{actionData.contact_button_text || t('Contact')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}03 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.primary}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Location')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Map Container */}
          <div className="max-w-3xl mx-auto">
            {locationData.map_embed_url && (
              <div className="rounded-2xl overflow-hidden" style={{ 
                boxShadow: `0 4px 20px ${colors.primary}10`,
                border: `1px solid ${colors.primary}15`
              }}>
                <ActorMapEmbed embedHtml={locationData.map_embed_url} />
              </div>
            )}

            {/* Directions Button */}
            {locationData.directions_url && (
              <div className="mt-6 flex justify-center">
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  style={{
                    backgroundColor: colors.primary + '15',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`,
                    fontFamily: font
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary + '15';
                    e.currentTarget.style.color = colors.primary;
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
                >
                  <MapPin className="w-4 h-4" />
                  {t('Get Directions')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {t('Download App')}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            {appData.app_store_url && (
              <button
                className="hover-bg-primary flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition-all cursor-pointer"
                style={{
                  backgroundColor: colors.primary + '15',
                  color: colors.text,
                  border: `1px solid ${colors.primary}30`,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-base font-bold">{t('App Store')}</div>
              </button>
            )}
            {appData.play_store_url && (
              <button
                className="hover-bg-primary flex items-center justify-center gap-3 px-6 py-3 rounded-xl transition-all cursor-pointer"
                style={{
                  backgroundColor: colors.primary + '15',
                  color: colors.text,
                  border: `1px solid ${colors.primary}30`,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div className="text-base font-bold">{t('Google Play')}</div>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}03 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.primary}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_title}
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
              }} />
            </h3>
          </div>

          <div className="max-w-md mx-auto">
            {formData.form_description && (
              <p className="text-sm text-center mb-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {formData.form_description}
              </p>
            )}
            
            <button
              className="hover-bg-primary hover-lift w-full py-2 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: colors.primary + '15',
                color: colors.primary,
                border: `1px solid ${colors.primary}30`,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Mail className="w-5 h-5" />
              {t('Contact Me')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;

    return (
      <div className="py-6 px-6" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`
      }}>
        <p className="text-sm text-center" style={{ 
          color: colors.text + 'CC', 
          fontFamily: font 
        }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };

  // Stable HTML content to prevent iframe reloading
  const stableHtmlContent = React.useMemo(() => {
    return configSections.custom_html?.html_content || '';
  }, [configSections.custom_html?.html_content]);

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData?.html_content) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, ${colors.primary}02 0%, transparent 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.accent}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {customHtmlData.show_title && customHtmlData.section_title && (
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
                {customHtmlData.section_title}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                  background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
                }} />
              </h3>
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            <div
              className="custom-html-content"
              style={{
                fontFamily: font,
                color: colors.text,
              }}
            >
              <StableHtmlContent htmlContent={stableHtmlContent} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="py-10 relative overflow-hidden" style={{ 
        borderBottom: `1px solid ${colors.borderColor || '#E2E2E2'}`,
        background: `linear-gradient(180deg, transparent 0%, ${colors.primary}03 100%)`
      }}>
        {/* Decorative blur */}
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full" style={{ 
          background: `radial-gradient(circle, ${colors.primary}06, transparent)`,
          filter: 'blur(60px)'
        }} />

        <div className="relative px-6">
          {/* Title */}
          {qrData.qr_title && (
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold inline-block relative" style={{ color: colors.text, fontFamily: font }}>
                {qrData.qr_title}
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full" style={{ 
                  background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`
                }} />
              </h3>
            </div>
          )}

          <div className="max-w-md mx-auto text-center">
            {qrData.qr_description && (
              <p className="text-sm mb-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {qrData.qr_description}
              </p>
            )}
            <button
              className="hover-bg-primary hover-lift w-full py-2 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{
                backgroundColor: colors.primary + '15',
                color: colors.primary,
                border: `1px solid ${colors.primary}30`,
                fontFamily: font
              }}
              onClick={() => setShowQrModal(true)}
            >
              <QrCode className="w-5 h-5" />
              {t('Share QR Code')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    // This function is no longer used as we're rendering copyright separately at the end
    return null;
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
    <div className="w-full overflow-hidden rounded-2xl shadow-xl" style={{
      fontFamily: font,
      backgroundColor: colors.background,
      border: `1px solid ${colors.borderColor || '#E2E2E2'}`,
      direction: isRTL ? 'rtl' : 'ltr',
        position: 'relative'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}

      {/* Copyright always at the end */}
      {copyrightSection && (
        <div className="px-6 py-4 text-center" style={{ backgroundColor: colors.primary, color: '#FFFFFF' }}>
          {copyrightSection.text && (
            <p className="text-sm" style={{ fontFamily: font }}>
              {copyrightSection.text}
            </p>
          )}
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
