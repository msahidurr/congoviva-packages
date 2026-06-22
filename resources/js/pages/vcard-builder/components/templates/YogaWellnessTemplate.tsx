import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Heart, Flower, Sun, Moon, Video, Play, Youtube, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';

interface YogaWellnessTemplateProps {
  data: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    description?: string;
    config_sections?: any;
    template_config?: any;
  };
  template: {
    defaultData?: any;
    defaultColors?: any;
    defaultFont?: string;
  };
}

const YogaWellnessMapEmbed = React.memo(function YogaWellnessMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

const lotusPetalPositions = [
  { top: '18%', left: '12%', rotation: 0, size: 'w-5 h-5' },
  { top: '36%', left: '8%', rotation: 35, size: 'w-6 h-6' },
  { top: '64%', left: '20%', rotation: 70, size: 'w-5 h-5' },
  { top: '74%', left: '46%', rotation: 105, size: 'w-6 h-6' },
  { top: '20%', left: '66%', rotation: 140, size: 'w-5 h-5' },
  { top: '48%', left: '78%', rotation: 180, size: 'w-6 h-6' },
  { top: '30%', left: '30%', rotation: 220, size: 'w-5 h-5' },
  { top: '58%', left: '58%', rotation: 260, size: 'w-5 h-5' }
] as const;

export default function YogaWellnessTemplate({ data, template }: YogaWellnessTemplateProps) {
  const { t, i18n } = useTranslation();
  
  // Get all sections for this business type
  const templateSections = template?.defaultData || {};
  
  // Ensure all required sections are available
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  // Testimonials state
  const [currentReview, setCurrentReview] = React.useState(0);
  
  // Effect for testimonials rotation
  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);
  
  // Language selector state
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);

  const [playingKey, setPlayingKey] = React.useState<string | null>(null);
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
    i18n.changeLanguage(langCode);
  };
  // Process video content at component level
  const videoContent = React.useMemo(() => {
    const videos = configSections.videos?.video_list || [];
    if (!Array.isArray(videos)) return [];
    return videos.map((video: any, index: number) => {
      // If it's an iframe, skip processing and use raw content
      if (video?.embed_url && video.embed_url.includes('<iframe')) {
        return {
          ...video,
          key: `video-${index}-${video?.title || ''}-${video?.embed_url?.substring(0, 20) || ''}`
        };
      }
      
      const sanitizedVideo = sanitizeVideoData(video);
      const videoData = sanitizedVideo?.embed_url ? extractVideoUrl(sanitizedVideo.embed_url) : null;
      return {
        ...sanitizedVideo,
        videoData,
        key: `video-${index}-${sanitizedVideo?.title || ''}-${sanitizedVideo?.embed_url || ''}`
      };
    });
  }, [configSections.videos?.video_list]);

  const colors = configSections.colors || template?.defaultColors || { primary: '#8FBC8F', secondary: '#98D8C8', accent: '#F7DC6F', background: '#F8F8F0', text: '#2F4F4F' };
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Inter, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/["\']/g, '');
    
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
  }, [configSections.font, template?.defaultFont]);


  // Get all sections for this business type
  const allSections = getBusinessTemplate('yoga-wellness')?.sections || [];

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
      case 'services':
        return renderServicesSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'class_schedule':
        return renderClassScheduleSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
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
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative rounded-t-3xl overflow-hidden" style={{ 
      background: `radial-gradient(circle at center, ${colors.secondary}40, ${colors.primary}20)`,
      minHeight: '220px'
    }}>
      {/* Language Selector */}
      {(configSections?.language && configSections?.language?.enable_language_switcher) && (
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20`}>
          <div className="relative">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: `1px solid ${colors.primary}`,
                color: colors.primary
              }}
            >
              <Globe className="w-3 h-3" />
              <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] max-h-48 overflow-y-auto z-50">
                {languageData.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 cursor-pointer ${
                      currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-sm">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Floating lotus petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {lotusPetalPositions.map((petal, i) => (
          <div
            key={`${petal.top}-${petal.left}`}
            className="absolute opacity-20 animate-pulse"
            style={{
              top: petal.top,
              left: petal.left,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          >
            <Flower
              className={petal.size}
              style={{ color: colors.primary, transform: `rotate(${petal.rotation}deg)` }}
            />
          </div>
        ))}
      </div>
      
      <div className="relative mx-auto max-w-md px-6 py-8 text-center">
        <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 shadow-2xl overflow-hidden relative" 
             style={{ borderColor: colors.primary, boxShadow: `0 0 40px ${colors.primary}30` }}>
          {headerData.profile_image ? (
            <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" 
                 style={{ background: `linear-gradient(135deg, ${colors.cardBg}, ${colors.secondary}20)` }}>
              <div className="relative">
                <Sun className="w-8 h-8 absolute -top-2 -left-2 animate-spin" style={{ color: colors.accent, animationDuration: '8s' }} />
                <Moon className="w-12 h-12" style={{ color: colors.primary }} />
              </div>
            </div>
          )}
          <div className="absolute inset-0 rounded-full" style={{ 
            background: `conic-gradient(from 0deg, transparent, ${colors.primary}20, transparent)`,
            animation: 'spin 10s linear infinite'
          }}></div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {headerData.name || data.name || t('Wellness Guide')}
        </h1>
        
        <div className="inline-flex items-center px-6 py-2 rounded-full mb-3" 
             style={{ backgroundColor: colors.primary + '20', border: `2px solid ${colors.primary}40` }}>
          <Heart className="w-4 h-4 mr-2 animate-pulse" style={{ color: colors.primary }} />
          <span className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>
            {headerData.title || t('Yoga Instructor')}
          </span>
        </div>
        
        {headerData.tagline && (
          <p className="text-sm italic max-w-sm mx-auto leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
            "{headerData.tagline}"
          </p>
        )}
      </div>
      
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

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`}
             className="flex flex-col items-center p-4 rounded-2xl transition-all hover:scale-105"
             style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}20`, boxShadow: `0 4px 15px ${colors.primary}10` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                 style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-center" style={{ color: colors.text, fontFamily: font }}>
              {t('Connect')}
            </span>
          </a>
        )}
        
        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`}
             className="flex flex-col items-center p-4 rounded-2xl transition-all hover:scale-105"
             style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.secondary}20`, boxShadow: `0 4px 15px ${colors.secondary}10` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                 style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})` }}>
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-center" style={{ color: colors.text, fontFamily: font }}>
              {t('Call')}
            </span>
          </a>
        )}
        
        {(contactData.website || data.website) && (
          <a href={contactData.website || data.website} target="_blank" rel="noopener noreferrer"
             className="flex flex-col items-center p-4 rounded-2xl transition-all hover:scale-105"
             style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.accent}20`, boxShadow: `0 4px 15px ${colors.accent}10` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                 style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})` }}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-center" style={{ color: colors.text, fontFamily: font }}>
              {t('Visit')}
            </span>
          </a>
        )}
        
        {contactData.location && (
          <div className="flex flex-col items-center p-4 rounded-2xl"
               style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}15` }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                 style={{ backgroundColor: colors.primary + '20' }}>
              <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-medium text-center" style={{ color: colors.text, fontFamily: font }}>
              {contactData.location}
            </span>
          </div>
        )}
      </div>
      
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

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null; 
    return (
      <div className="px-6 py-4">
        <div className="relative p-6 rounded-3xl" style={{ 
          backgroundColor: colors.cardBg, 
          border: `3px solid ${colors.primary}15`,
          boxShadow: `0 8px 25px ${colors.primary}10`
        }}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: colors.primary }}>
              <Flower className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="text-center mt-2">
            <h3 className="font-bold text-lg mb-3" style={{ color: colors.primary, fontFamily: font }}>
              {t('My Journey')}
            </h3>
            
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
              {aboutData.description || data.description}
            </p>
            
            {aboutData.certifications && (
              <div className="mb-4">
                <p className="text-sm font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
                  {t('Certifications & Training')}:
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  {aboutData.certifications.split(',').map((cert: string, index: number) => (
                    <Badge key={index} className="text-sm rounded-full" 
                           style={{ backgroundColor: colors.secondary + '30', color: colors.text, border: `1px solid ${colors.secondary}` }}>
                      {cert.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {aboutData.experience && (
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2" 
                     style={{ background: `conic-gradient(${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.primary})` }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                    <span className="text-lg font-bold" style={{ color: colors.primary, fontFamily: font }}>
                      {aboutData.experience}
                    </span>
                  </div>
                </div>
                <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Years of Practice')}</p>
              </div>
            )}
            
            {aboutData.philosophy && (
              <div className="mt-4 p-3 rounded-2xl" style={{ backgroundColor: colors.accent + '15' }}>
                <p className="text-sm italic" style={{ color: colors.text, fontFamily: font }}>
                  "{aboutData.philosophy}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          🧘‍♀️ {t('Wellness Offerings')}
        </h3>
        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden"
                 style={{ 
                   backgroundColor: colors.cardBg,
                   border: `1.5px solid ${colors.primary}25`,
                   boxShadow: `0 4px 16px ${colors.primary}10`
                 }}>
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})` }} />
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}30)` }}>
                    <span className="text-base">
                      {service.type === 'yoga' ? '🧘' :
                       service.type === 'meditation' ? '🕯️' :
                       service.type === 'wellness' ? '🌿' :
                       service.type === 'retreat' ? '🏔️' : '✨'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm leading-tight" style={{ color: colors.text, fontFamily: font }}>
                      {service.title}
                    </h4>
                  </div>
                  {service.price && (
                    <span className="text-sm font-bold px-3 py-1 rounded-full flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}CC)`, color: colors.text, fontFamily: font }}>
                      {service.price}
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + 'BB', fontFamily: font }}>
                    {service.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {service.type && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                          style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                      {service.type}
                    </span>
                  )}
                  {service.duration && (
                    <span className="text-sm flex items-center gap-1" style={{ color: colors.text + '99', fontFamily: font }}>
                      ⏱ {service.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClassScheduleSection = (scheduleData: any) => {
    const classes = scheduleData.classes || [];
    if (!Array.isArray(classes) || classes.length === 0) return null;
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          📅 {t('Weekly Schedule')}
        </h3>
        <div className="space-y-3">
          {classes.map((classItem: any, index: number) => (
            <div key={index} className="flex items-center justify-between px-4 py-4 rounded-2xl"
                 style={{ backgroundColor: colors.cardBg, border: `1.5px solid ${colors.primary}20` }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.primary }}></div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                    {classItem.class_name}
                  </h4>
                  <p className="text-sm capitalize" style={{ color: colors.text + '99', fontFamily: font }}>
                    {classItem.day} • {classItem.time}
                  </p>
                </div>
              </div>
              {classItem.level && (
                <span className="text-xs font-medium px-2 py-1 rounded-full capitalize flex-shrink-0"
                      style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                  {classItem.level.replace('-', ' ')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center gap-2" style={{ color: colors.primary, fontFamily: font }}>
          <Share2 className="w-5 h-5" style={{ color: colors.primary }} />
          {t('Connect & Inspire')}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <button key={index}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      border: 'none',
                    }}
                    onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}>
              <SocialIcon platform={link.platform} size={18} color="white" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          🕐 {t('Studio Hours')}
        </h3>
        <div className="space-y-2">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: `linear-gradient(135deg, ${colors.primary}${hour.is_closed ? '08' : '12'}, ${colors.secondary}${hour.is_closed ? '05' : '18'})` }}>
              <span className="capitalize font-semibold text-sm" style={{ color: hour.is_closed ? colors.text + '40' : colors.text, fontFamily: font }}>
                {t(hour.day)}
              </span>
              <span className="text-sm font-medium" style={{ color: hour.is_closed ? colors.text + '30' : colors.primary, fontFamily: font }}>
                {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          💫 {t('Transformation Stories')}
        </h3>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="rounded-2xl p-4" style={{
                    backgroundColor: colors.cardBg,
                    border: `1.5px solid ${colors.primary}20`,
                    boxShadow: `0 4px 16px ${colors.primary}10`
                  }}>
                      {/* Review text */}
                      <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                        {review.review}
                      </p>

                      {/* Transformation tag */}
                      {review.transformation && (
                        <div className="flex items-start gap-2 mb-3 px-3 py-2 rounded-xl" style={{ backgroundColor: colors.primary + '10' }}>
                          <span style={{ color: colors.primary, fontSize: '14px' }}>✦</span>
                          <p className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
                            {review.transformation}
                          </p>
                        </div>
                      )}

                      {/* Client name + Stars */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                               style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font }}>
                            {review.client_name?.charAt(0)}
                          </div>
                          <span className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                            {review.client_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ color: i < parseInt(review.rating || 5) ? '#FBBF24' : '#D1D5DB', fontSize: '18px' }}>★</span>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-3 gap-1.5">
              {reviews.map((_: any, dotIndex: number) => (
                <Flower
                  key={dotIndex}
                  size={14}
                  fill={currentReview === dotIndex ? colors.primary : 'transparent'}
                  stroke={colors.primary}
                  strokeWidth={currentReview === dotIndex ? 0 : 1.5}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setCurrentReview(dotIndex)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-6 py-4">
        <div className="text-center p-5 rounded-3xl" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
          border: `2px solid ${colors.primary}20`
        }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: colors.primary, fontFamily: font }}>
            🙏 {t('Book Your Session')}
          </h3>
          {appointmentsData?.booking_note && (
            <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
              {appointmentsData.booking_note}
            </p>
          )}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 rounded-full cursor-pointer" 
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      color: 'white', 
                      fontFamily: font,
                      border: 'none'
                    }}
                    onClick={() => handleAppointmentBooking(configSections.appointments)}>
              <Calendar className="w-4 h-4 mr-2" />
              {t('Reserve Your Spot')}
            </Button>
            {appointmentsData?.calendar_link && (
              <Button size="sm" variant="outline" className="flex-1 rounded-full cursor-pointer"
                      style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                      onClick={() => typeof window !== "undefined" && window.open(appointmentsData.calendar_link, '_blank', 'noopener,noreferrer')}>
                <Calendar className="w-4 h-4 mr-2" />
                {t('Calendar')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          📍 {t('Studio Location')}
        </h3>
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <YogaWellnessMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <Button size="sm" variant="outline" className="w-full rounded-2xl cursor-pointer" 
                    style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                    onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}>
              <MapPin className="w-4 h-4 mr-2" />
              {t('Get Directions')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          📲 {t('Download Our App')}
        </h3>
        <div className="flex gap-3">
          {appData.app_store_url && (
            <Button className="flex-1 rounded-2xl font-semibold cursor-pointer"
              style={{ backgroundColor: colors.primary + '18', color: colors.primary, border: `1.5px solid ${colors.primary}30`, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button className="flex-1 rounded-2xl font-semibold cursor-pointer"
              style={{ backgroundColor: colors.secondary + '25', color: colors.primary, border: `1.5px solid ${colors.secondary}40`, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
              {t('Play Store')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-6 py-4">
        <div className="text-center p-5 rounded-3xl" style={{ 
          backgroundColor: colors.cardBg,
          border: `2px solid ${colors.secondary}20`
        }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button size="sm" className="rounded-full cursor-pointer" 
                  style={{ 
                    backgroundColor: colors.secondary, 
                    color: 'white', 
                    fontFamily: font,
                    border: 'none'
                  }}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Mail className="w-4 h-4 mr-2" />
            {t('Connect With Me')}
          </Button>
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          🎥 {t('Yoga Sessions')}
        </h3>

        <div className="space-y-3">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');
            return (
              <div key={video.key} className="rounded-2xl overflow-hidden" style={{
                backgroundColor: colors.cardBg,
                border: `1.5px solid ${colors.primary}25`,
                boxShadow: `0 4px 16px ${colors.primary}10`
              }}>
                {/* Top accent bar */}
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})` }} />

                {/* Video / Thumbnail */}
                {playingKey === video.key && videoUrl ? (
                  <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
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
                    className="relative w-full cursor-pointer overflow-hidden"
                    style={{
                      aspectRatio: '16 / 9',
                      minHeight: '180px',
                      backgroundColor: colors.background,
                    }}
                    onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={video.title || 'Video'}
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                        <Video className="w-8 h-8" style={{ color: colors.primary }} />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.30)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 20px ${colors.primary}80` }}>
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                    </div>
                    {video.duration && (
                      <span className="absolute bottom-2 right-2 text-white font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.65)', fontSize: '11px' }}>
                        {video.duration}
                      </span>
                    )}
                  </div>
                )}

                {/* Info below video */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm leading-snug flex-1" style={{ color: colors.text, fontFamily: font }}>
                      {video.title}
                    </h4>
                  </div>
                  {video.description && (
                    <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + 'BB', fontFamily: font }}>
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {video.video_type && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full capitalize" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                        🧘 {video.video_type.replace('_', ' ')}
                      </span>
                    )}
                    {video.duration && (
                      <span className="text-sm flex items-center gap-1" style={{ color: colors.text + '99', fontFamily: font }}>
                        ⏱ {video.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          ▶️ {t('YouTube Channel')}
        </h3>

        <div className="rounded-2xl overflow-hidden" style={{
          backgroundColor: colors.cardBg,
          border: `1.5px solid ${colors.primary}25`,
          boxShadow: `0 4px 16px ${colors.primary}10`
        }}>
          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})` }} />

          {/* Latest video embed */}
          {youtubeData.latest_video_embed && (
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '40%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(
                  youtubeData.latest_video_embed,
                  { colors, font },
                  'Latest Video'
                )}
              />
            </div>
          )}

          {/* Channel info */}
          <div className="p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base leading-tight" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || t('Yoga & Wellness')}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-sm" style={{ color: colors.text + '99', fontFamily: font }}>
                    {youtubeData.subscriber_count} {t('subscribers')}
                  </p>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'BB', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}

            <div className="flex items-center gap-2">
              {youtubeData.channel_url && (
                <Button
                  size="sm"
                  className="flex-1 rounded-full font-semibold cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: 'white', border: 'none', fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="w-4 h-4 mr-1" />
                  {t('Subscribe')}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-full font-semibold cursor-pointer"
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  🧘 {t('Playlist')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div
        className="px-6 py-4"
        style={{ backgroundColor: colors.background }}
        id="custom_html"
      >
        <div
          className="relative overflow-hidden rounded-[28px] px-5 py-6"
          style={{
            background: `linear-gradient(135deg, ${colors.cardBg} 0%, ${colors.secondary}12 100%)`,
            border: `2px solid ${colors.primary}18`,
            boxShadow: `0 10px 28px ${colors.primary}12`
          }}
        >
          <div className="absolute right-4 top-4 opacity-15">
            <Flower className="w-12 h-12" style={{ color: colors.primary }} />
          </div>

          <div className="relative">
            {customHtmlData.section_title && (
              <div className="mb-4 text-center">
                <div
                  className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${colors.primary}18` }}
                >
                  <Flower className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.primary, fontFamily: font }}>
                  {customHtmlData.section_title}
                </h3>
              </div>
            )}

            <div
              className="rounded-2xl px-4 py-4 text-sm leading-7"
              style={{
                backgroundColor: `${colors.background}CC`,
                color: colors.text,
                fontFamily: font,
                border: `1px solid ${colors.primary}12`
              }}
              dangerouslySetInnerHTML={{ __html: customHtmlData.html_content }}
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="px-6 py-4" id="qr_share">
        <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
          <QrCode className="w-5 h-5 inline-block mr-2 mb-0.5" />
          {qrData.section_title || t('Share & Connect')}
        </h3>

        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl text-center"
             style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}18)`, border: `1.5px solid ${colors.primary}20` }}>
          {qrData.qr_description && (
            <p className="text-sm leading-snug" style={{ color: colors.text + '99', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          <Button
            size="sm"
            className="rounded-full font-semibold cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', border: 'none', fontFamily: font }}
            onClick={() => setShowQrModal(true)}
          >
            <Share2 className="w-3.5 h-3.5 mr-1.5" />
            {t('Share QR Code')}
          </Button>
        </div>
      </div>
    );
  };


  const renderActionButtonsSection = (_: any) => {
    const ab = configSections.action_buttons;
    if (!ab || ab.enabled === false) return null;
    if (!ab.contact_button_text && !ab.appointment_button_text && !ab.save_contact_button_text) return null;
    return (
      <div className="px-6 py-5 space-y-3" style={{ background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)` }}>
        {ab?.contact_button_text && (
          <Button className="w-full h-11 font-bold rounded-2xl cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font, border: 'none', boxShadow: `0 6px 20px ${colors.primary}35` }}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Heart className="w-4 h-4 mr-2" />
            {ab.contact_button_text}
          </Button>
        )}
        {ab?.appointment_button_text && (
          <Button className="w-full h-11 font-bold rounded-2xl cursor-pointer"
                  style={{ backgroundColor: colors.accent + '20', color: colors.accent, border: `1.5px solid ${colors.accent}40`, fontFamily: font }}
                  onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4 mr-2" />
            {ab.appointment_button_text}
          </Button>
        )}
        {ab?.save_contact_button_text && (
          <Button className="w-full h-11 font-semibold rounded-2xl cursor-pointer"
                  style={{ backgroundColor: colors.primary + '15', color: colors.primary, border: `1.5px solid ${colors.primary}25`, fontFamily: font }}
                  onClick={() => {
                    const contactData = { name: data.name || '', title: data.title || '', email: data.email || configSections.contact?.email || '', phone: data.phone || configSections.contact?.phone || '', website: data.website || configSections.contact?.website || '', location: configSections.contact?.location || '' };
                    import('@/utils/vcfGenerator').then(module => { module.downloadVCF(contactData); });
                  }}>
            <UserPlus className="w-4 h-4 mr-2" />
            {ab.save_contact_button_text}
          </Button>
        )}
        <Button className="w-full h-11 font-semibold rounded-2xl cursor-pointer"
                style={{ backgroundColor: colors.secondary + '20', color: colors.primary, border: `1.5px solid ${colors.secondary}30`, fontFamily: font }}
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: data.name || 'Business Card', text: 'Check out this wellness business card', url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}>
          <Share2 className="w-4 h-4 mr-2" />
          {t('Share')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4">
        <div className="relative px-5 py-4 rounded-2xl text-center"
             style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}18)`, border: `1.5px solid ${colors.primary}20` }}>
          <p className="text-sm leading-relaxed italic" style={{ color: colors.text, fontFamily: font }}>
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };



  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
    
  
  return (
    <div className="w-full rounded-3xl overflow-hidden" style={{ 
      fontFamily: font,
      backgroundColor: colors.background,
      boxShadow: `0 20px 60px ${colors.primary}15`,
      border: `3px solid ${colors.primary}10`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
      
      
      {copyrightSection && (
        <div className="px-6 py-4 text-center" style={{ borderTop: `1px solid ${colors.primary}15` }}>
          {copyrightSection.text && (
            <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
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
