import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Dumbbell, Trophy, Zap, Clock, Star, Target, Activity, Video, Play, Youtube, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeText, sanitizeUrl } from '@/utils/sanitizeHtml';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface IPersonalTrainerTemplateProps {
  data: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    description?: string;
    config_sections?: Record<string, any>;
    template_config?: Record<string, any>;
  };
  template: {
    defaultData?: Record<string, any>;
    defaultColors?: Record<string, string>;
    defaultFont?: string;
  };
}

const PersonalTrainerMapEmbed = React.memo(function PersonalTrainerMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function PersonalTrainerTemplate({ data, template }: IPersonalTrainerTemplateProps) {
   const { t, i18n } = useTranslation();
   
   // Get all sections for this business type
   const templateSections = template?.defaultData || {};
   
   // Ensure all required sections are available
   const configSections = ensureRequiredSections(data?.config_sections || {}, templateSections);

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
      
      const videoData = video.embed_url ? extractVideoUrl(video.embed_url) : null;
      return {
        ...video,
        videoData,
        key: `video-${index}-${video.title || ''}-${video.embed_url || ''}`
      };
    });
  }, [configSections.videos?.video_list]);
  const colors = configSections.colors || template?.defaultColors || { primary: '#EA580C', secondary: '#FB923C', text: '#1C1917' };
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
  const allSections = getBusinessTemplate('personal-trainer')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header': return renderHeaderSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'about': return renderAboutSection(sectionData);
      case 'services': return renderServicesSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'achievements': return renderAchievementsSection(sectionData);
      case 'transformation_stories': return renderTransformationStoriesSection(sectionData);
      case 'social': return renderSocialSection(sectionData);
      case 'business_hours': return renderBusinessHoursSection(sectionData);
      case 'testimonials': return renderTestimonialsSection(sectionData);
      case 'appointments': return renderAppointmentsSection(sectionData);
      case 'google_map': return renderLocationSection(sectionData);
      case 'app_download': return renderAppDownloadSection(sectionData);
      case 'contact_form': return renderContactFormSection(sectionData);
      case 'custom_html': return renderCustomHtmlSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      case 'thank_you': return renderThankYouSection(sectionData);
      case 'action_buttons': return renderActionButtonsSection(sectionData);
      default: return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative rounded-t-2xl overflow-visible">
      {/* Banner */}
      <div className="relative h-36 overflow-visible rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
        <div className="absolute inset-0 opacity-15">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-white">
            <pattern id="fitness-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
              <circle cx="12.5" cy="5" r="2" />
              <rect x="10" y="8" width="5" height="2" />
              <circle cx="5" cy="20" r="1.5" />
              <path d="M18 15 L22 19 L18 23 L14 19 Z" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#fitness-pattern)" />
          </svg>
        </div>

        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  fontFamily: font
                }}
              >
                <Globe className="w-3 h-3" />
                <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>
              {showLanguageSelector && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] max-h-48 overflow-y-auto z-[310]">
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
      </div>

      {/* Profile card overlapping banner */}
      <div className="relative px-6 pb-5" style={{ background: `linear-gradient(180deg, ${colors.primary}22 0%, ${colors.cardBg || colors.background || '#fff'} 60%)` }}>
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative z-20 -mt-12 w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-xl overflow-hidden"
            style={{ borderColor: 'white', backgroundColor: 'white', boxShadow: `0 4px 20px ${colors.primary}50` }}>
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Dumbbell className="w-10 h-10" style={{ color: colors.primary }} />
            )}
          </div>
        </div>

        {/* Name & title */}
        <div className="text-center mt-3">
          <h1 className="text-xl font-bold mb-0.5" style={{ color: colors.text, fontFamily: font }}>
            {headerData?.name || data?.name || ''}
          </h1>
          {headerData?.title && (
            <p className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
              {headerData.title}
            </p>
          )}
          {headerData?.tagline && (
            <p className="text-sm mt-1 italic" style={{ color: colors.text + 'AA', fontFamily: font }}>
              &ldquo;{headerData.tagline}&rdquo;
            </p>
          )}
        </div>

        {/* Badges */}
        {(headerData.badge_1 || headerData.badge_2 || headerData.badge_3) && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {headerData.badge_1 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                <Zap className="w-3 h-3" />{headerData.badge_1}
              </span>
            )}
            {headerData.badge_2 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                <Target className="w-3 h-3" />{headerData.badge_2}
              </span>
            )}
            {headerData.badge_3 && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                <Trophy className="w-3 h-3" />{headerData.badge_3}
              </span>
            )}
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

  const renderContactSection = (contactData: any) => (
    <section className="px-6 py-5" style={{ borderTop: `1px solid ${colors.primary}30` }}>
      <div className="grid grid-cols-2 gap-3">
        {(contactData.phone || data.phone) && (
          <a
            href={`tel:${contactData.phone || data.phone}`}
            className="flex items-center gap-2 rounded-full pr-3 overflow-hidden"
            style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}30` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary }}>
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold break-all" style={{ color: colors.text, fontFamily: font }}>{contactData.phone || data.phone}</span>
          </a>
        )}
        {(contactData.email || data.email) && (
          <a
            href={`mailto:${contactData.email || data.email}`}
            className="flex items-center gap-2 rounded-full pr-3 overflow-hidden"
            style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}30` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary }}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold break-all" style={{ color: colors.text, fontFamily: font }}>{contactData.email || data.email}</span>
          </a>
        )}
        {(contactData.website || data.website) && (
          <a
            href={contactData.website || data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full pr-3 overflow-hidden"
            style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}30` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold break-all" style={{ color: colors.text, fontFamily: font }}>{(contactData.website || data.website).replace(/^https?:\/\//, '')}</span>
          </a>
        )}
        {contactData.location && (
          <div
            className="flex items-center gap-2 rounded-full pr-3 overflow-hidden"
            style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}30` }}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary }}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold break-all" style={{ color: colors.text, fontFamily: font }}>{contactData.location}</span>
          </div>
        )}
      </div>
    </section>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    const specialties = aboutData.specialties ? aboutData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    return (
      <div className="px-6 py-5" style={{ borderTop: `1px solid ${colors.primary}20`, background: `linear-gradient(135deg, ${colors.primary}0C 0%, ${colors.secondary}08 50%, transparent 100%)` }}>
        {/* Title — unchanged */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <span style={{ color: colors.primary, fontSize: '14px' }}>❖</span>
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("About Your Coach")}
            </h3>
            <span style={{ color: colors.primary, fontSize: '14px' }}>❖</span>
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>

        {/* Big quote mark + description */}
        <div className="relative mb-5">
          <span className="absolute -top-2 -left-1 text-5xl font-black leading-none select-none" style={{ color: colors.primary + '25', fontFamily: 'Georgia, serif' }}>&ldquo;</span>
          <p className="text-sm leading-relaxed pl-5 pt-2" style={{ color: colors.text, fontFamily: font }}>
            {aboutData?.description || data?.description || ''}
          </p>
        </div>

        {/* Experience — number + label stacked, floated right of a thin rule */}
        {aboutData.experience && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full shrink-0" style={{ border: `2px solid ${colors.primary}`, boxShadow: `0 0 0 4px ${colors.primary}15` }}>
              <span className="text-base font-black leading-none" style={{ color: colors.primary, fontFamily: font }}>{aboutData.experience}</span>
              <span className="text-[8px] font-bold uppercase" style={{ color: colors.primary + 'AA', fontFamily: font }}>yrs</span>
            </div>
            <span className="text-xs font-medium" style={{ color: colors.text + '90', fontFamily: font }}>{t("Years Transforming Lives")}</span>
          </div>
        )}

        {/* Specialties — small ghost chips, light outline only */}
        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specialties.map((specialty: string, index: number) => (
              <span key={index} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{
                fontFamily: font,
                color: colors.primary,
                border: `1px solid ${colors.primary}35`,
                letterSpacing: '0.02em'
              }}>
                {specialty}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Dumbbell className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Training Programs")}
            </h3>
            <Dumbbell className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {services.map((service: any, index: number) => (
            <div key={index} className="rounded flex flex-col" style={{ 
              backgroundColor: colors.cardBg,
              border: `1.5px solid ${colors.primary}22`,
              boxShadow: `0 2px 10px ${colors.primary}10`
            }}>
              <div className="p-3 flex flex-col items-center text-center flex-1">
                <p className="font-semibold text-sm mb-2" style={{ color: colors.text, fontFamily: font }}>
                  {service.title}
                </p>
                {service.description && (
                  <p className="text-xs leading-relaxed mb-3" style={{ color: colors.text + 'AA', fontFamily: font }}>
                    {service.description}
                  </p>
                )}
                <div className="mt-auto w-full pt-2 flex flex-col items-center gap-1" style={{ borderTop: `1px dashed ${colors.primary}40` }}>
                  {service.price && (
                    <span className="font-semibold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                      {service.price}
                    </span>
                  )}
                  {service.duration && (
                    <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: colors.text + '99', fontFamily: font }}>
                      <Clock className="w-3 h-3" />{service.duration}
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

  const renderAchievementsSection = (achievementsData: any) => {
    const achievements = achievementsData.achievement_list || [];
    if (!Array.isArray(achievements) || achievements.length === 0) return null;
    const chunkSize = 2;
    const slides = Array.from({ length: Math.ceil(achievements.length / chunkSize) }, (_, i) =>
      achievements.slice(i * chunkSize, i * chunkSize + chunkSize)
    );
    const [currentSlide, setCurrentSlide] = React.useState(0);
    React.useEffect(() => {
      if (slides.length <= 1) return;
      const interval = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 3500);
      return () => clearInterval(interval);
    }, [slides.length]);
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Certifications & Awards")}
            </h3>
            <Trophy className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide: any[], slideIndex: number) => (
                <div key={slideIndex} className="w-full flex-shrink-0 grid grid-cols-2 gap-2">
                  {slide.map((achievement: any, i: number) => (
                    <div key={i} className="rounded-xl p-3 flex flex-col items-center text-center" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}20`, boxShadow: `0 2px 8px ${colors.primary}10` }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: colors.text, fontFamily: font }}>
                        {achievement.title}
                      </p>
                      {achievement.organization && (
                        <p className="text-[12px]" style={{ color: colors.text + '80', fontFamily: font }}>
                          {achievement.organization}
                        </p>
                      )}
                      {achievement.year && (
                        <span className="mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                          {achievement.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {slides.length > 1 && (
            <div className="flex justify-center mt-3 space-x-2">
              {slides.map((_: any, dotIndex: number) => (
                <div
                  key={dotIndex}
                  className="w-2 h-2 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: dotIndex === currentSlide ? colors.primary : colors.primary + '40' }}
                  onClick={() => setCurrentSlide(dotIndex)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTransformationStoriesSection = (storiesData: any) => {
    const stories = storiesData.stories || [];
    if (!Array.isArray(stories) || stories.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Target className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Success Stories")}
            </h3>
            <Target className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="space-y-3">
          {stories.map((story: any, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.primary}18`, boxShadow: `0 2px 8px ${colors.primary}10` }}>
              {story.before_after && (
                <div className="w-full h-40 relative">
                  <img
                    src={getImageDisplayUrl(story.before_after)}
                    alt={`${story.client_name} transformation`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />
                  {story.timeframe && (
                    <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}>
                      {story.timeframe}
                    </span>
                  )}
                </div>
              )}
              <div className="px-3 py-2.5" style={{ backgroundColor: colors.cardBg }}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>{story.client_name}</p>
                  {!story.before_after && story.timeframe && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                      {story.timeframe}
                    </span>
                  )}
                </div>
                {story.result && (
                  <p className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>🎯 {story.result}</p>
                )}
              </div>
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
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Follow My Journey")}
            </h3>
            <Activity className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: colors.primary + '15', color: colors.primary, border: `1px solid ${colors.primary}30`, fontFamily: font }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <SocialIcon platform={link.platform} color={colors.primary} className="w-4 h-4" />
              {link.platform}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    const todayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Training Schedule")}
            </h3>
            <Clock className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="space-y-1.5">
          {hours.slice(0, 7).map((hour: any, index: number) => {
            const isToday = hour.day?.toLowerCase() === todayName;
            return (
              <div key={index} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{
                backgroundColor: isToday ? colors.primary + '20' : colors.cardBg,
                border: `1px solid ${isToday ? colors.primary : hour.is_closed ? colors.primary + '15' : colors.primary + '25'}`
              }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isToday ? colors.primary : hour.is_closed ? colors.text + '40' : colors.primary }} />
                  <span className="capitalize text-sm font-medium" style={{ color: isToday ? colors.primary : colors.text, fontFamily: font }}>
                    {t(hour.day)}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '20', color: colors.primary, fontFamily: font }}>
                      Today
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold" style={{
                  color: isToday ? colors.primary : hour.is_closed ? colors.text + '50' : colors.primary,
                  fontFamily: font
                }}>
                  {hour.is_closed ? t('Rest Day') : `${hour.open_time} - ${hour.close_time}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 fill-current" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Client Success")}
            </h3>
            <Star className="w-3.5 h-3.5 fill-current" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}20`, boxShadow: `0 2px 8px ${colors.primary}10` }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < parseInt(review.rating || 5) ? 'fill-current' : ''}`} style={{ color: i < parseInt(review.rating || 5) ? '#FBBF24' : colors.text + '30' }} />
                        ))}
                      </div>
                      {review.program && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                          {review.program}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      &ldquo;{review.review}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: colors.primary }}>
                        {review.client_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                        {review.client_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {reviews.length > 1 && (
            <div className="flex justify-center mt-3 space-x-2">
              {reviews.map((_: any, dotIndex: number) => (
                <div
                  key={dotIndex}
                  className="w-2 h-2 rounded-full transition-colors cursor-pointer"
                  style={{ backgroundColor: dotIndex === currentReview % Math.max(1, reviews.length) ? colors.primary : colors.primary + '40' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
            {t("Start Your Journey")}
          </h3>
          <Calendar className="w-3.5 h-3.5" style={{ color: colors.primary }} />
        </div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
      </div>
      {appointmentsData?.consultation_note && (
        <div className="flex items-start gap-2 mb-4 p-3 rounded-xl" style={{ backgroundColor: colors.primary + '10', border: `1px solid ${colors.primary}20` }}>
          <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
          <p className="text-sm font-medium leading-relaxed" style={{ color: colors.primary, fontFamily: font }}>
            {appointmentsData.consultation_note}
          </p>
        </div>
      )}
      <Button
        className="w-full h-10 font-bold"
        style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
        onClick={() => handleAppointmentBooking(configSections.appointments)}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {t("Book Training Session")}
      </Button>
    </div>
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Training Location")}
            </h3>
            <MapPin className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.primary}20` }}>
              <PersonalTrainerMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          {locationData.directions_url && (
            <Button
              className="w-full h-9 font-semibold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t("Get Directions")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Fitness App")}
            </h3>
            <Zap className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {appData.app_store_url && (
            <button
              className="flex items-center justify-center gap-2 py-1.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {t("App Store")}
            </button>
          )}
          {appData.play_store_url && (
            <button
              className="flex items-center justify-center gap-2 py-1.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: colors.primary + '15', color: colors.primary, border: `1px solid ${colors.primary}30`, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.54-2.54-10.57 9.39zm-1.7-20.1C1.18 4 1 4.5 1 5.14v13.72c0 .64.18 1.14.49 1.48l.08.07 7.69-7.69v-.18L1.56 3.59l-.08.07zm17.52 8.56l-2.17-1.25-2.85 2.85 2.85 2.85 2.19-1.26c.62-.36.62-.94 0-1.19zM4.17.24L16.29 7.23l-2.54 2.54L3.18.38C3.53.3 3.87.07 4.17.24z"/></svg>
              {t("Play Store")}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {formData.form_title}
            </h3>
            <Mail className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        {formData.form_description && (
          <p className="text-sm mb-4 text-center leading-relaxed" style={{ color: colors.text + '90', fontFamily: font }}>
            {formData.form_description}
          </p>
        )}
        <Button
          className="w-full h-10 font-bold"
          style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t("Get Started")}
        </Button>
      </div>
    );
  };

  
  const renderVideosSection = (videosData: any) => {
    const formatVideoType = (videoType: string) => videoType.replace(/_/g, ' ');

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
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Video className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Training Videos")}
            </h3>
            <Video className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        <div className="space-y-3">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');
            return (
              <div key={video.key} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.primary}18`, boxShadow: `0 2px 10px ${colors.primary}10` }}>
                {/* Thumbnail */}
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
                  <div className="relative w-full h-52 cursor-pointer" onClick={() => { if (videoUrl) setPlayingKey(video.key); }}>
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                        <Video className="w-8 h-8" style={{ color: colors.primary }} />
                      </div>
                    )}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }} />
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 4px 16px ${colors.primary}80` }}>
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {/* Bottom overlay: title + type */}
                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
                      <div className="flex items-end justify-between gap-2">
                        <p className="text-sm font-bold text-white leading-tight line-clamp-2" style={{ fontFamily: font }}>
                          {video.title}
                        </p>
                        {video.video_type && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}>
                            {formatVideoType(video.video_type)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {/* Bottom info row */}
                {(video.description || video.duration) && (
                  <div className="px-3 py-3 flex items-center justify-between gap-3" style={{ backgroundColor: colors.cardBg }}>
                    {video.description && (
                      <p className="text-sm flex-1 leading-relaxed" style={{ color: colors.text + '90', fontFamily: font }}>
                        {video.description}
                      </p>
                    )}
                    {video.duration && (
                      <span className="inline-flex items-center gap-1 text-sm flex-shrink-0 font-medium px-2 py-0.5 rounded-full" style={{ color: colors.primary, backgroundColor: colors.primary + '15', fontFamily: font }}>
                        <Clock className="w-3.5 h-3.5" />{video.duration}
                      </span>
                    )}
                  </div>
                )}
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
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Youtube className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("YouTube Channel")}
            </h3>
            <Youtube className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        {youtubeData.latest_video_embed && (
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${colors.primary}18` }}>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, "Latest Video")}
              />
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}18` }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF0000' }}>
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>
              {youtubeData.channel_name || 'Personal Training'}
            </p>
            {youtubeData.subscriber_count && (
              <p className="text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                {youtubeData.subscriber_count} {t("subscribers")}
              </p>
            )}
          </div>
        </div>
        {youtubeData.channel_description && (
          <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.text + '90', fontFamily: font }}>
            {youtubeData.channel_description}
          </p>
        )}
        <div className="space-y-2">
          {youtubeData.channel_url && (
            <Button
              size="sm"
              className="w-full h-8 font-bold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
            >
              <Youtube className="w-4 h-4 mr-2" />
              {t("SUBSCRIBE")}
            </Button>
          )}
          {youtubeData.featured_playlist && (
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
            >
              <Play className="w-4 h-4 mr-2" />
              {t("WORKOUT ROUTINES")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
            <div className="flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
                {customHtmlData.section_title}
              </h3>
              <Trophy className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            </div>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
          </div>
        )}
        <div
          className="custom-html-content rounded-xl px-4 py-3"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.primary}20`,
            boxShadow: `0 2px 8px ${colors.primary}10`,
            fontFamily: font,
            color: colors.text
          }}
        >
          <style>
            {`
              .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4 {
                color: ${colors.primary};
                margin-bottom: 0.5rem;
                font-family: ${font};
                font-weight: bold;
                font-size: 0.95rem;
              }
              .custom-html-content p {
                color: ${colors.text};
                margin-bottom: 0.4rem;
                font-family: ${font};
                font-size: 0.875rem;
                line-height: 1.6;
              }
              .custom-html-content a {
                color: ${colors.secondary};
                text-decoration: underline;
                font-weight: bold;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
                font-size: 0.875rem;
              }
              .custom-html-content code {
                background-color: ${colors.primary}20;
                color: ${colors.primary};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-family: 'Monaco', monospace;
                font-weight: bold;
              }
            `}
          </style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}60)` }} />
          <div className="flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            <h3 className="text-base font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
              {t("Share Your Fitness Journey")}
            </h3>
            <Share2 className="w-3.5 h-3.5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${colors.primary}60)` }} />
        </div>
        {qrData.qr_title && (
          <p className="text-sm font-bold text-center mb-1" style={{ color: colors.text, fontFamily: font }}>{qrData.qr_title}</p>
        )}
        {qrData.qr_description && (
          <p className="text-sm text-center mb-3 leading-relaxed" style={{ color: colors.text + '90', fontFamily: font }}>{qrData.qr_description}</p>
        )}
        <Button
          className="w-full h-10 font-bold"
          style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
          onClick={() => setShowQrModal(true)}
        >
          <QrCode className="w-4 h-4 mr-2" />
          {t("Share QR Code")}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4 text-center">
        <p className="text-sm leading-relaxed" style={{ color: colors.text + '90', fontFamily: font }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };



  const renderActionButtonsSection = (actionData: any) => {
    if (!actionData || actionData.enabled === false) return null;
    if (!actionData.contact_button_text && !actionData.appointment_button_text && !actionData.save_contact_button_text) return null;
    return (
      <div className="px-6 py-6 space-y-3" style={{ background: `linear-gradient(160deg, ${colors.primary}CC, ${colors.secondary}CC)` }}>
        {actionData.contact_button_text && (
          <Button
            className="w-full h-11 font-bold rounded-xl"
            style={{ backgroundColor: 'white', color: colors.primary, fontFamily: font }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Zap className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}
        {actionData.appointment_button_text && (
          <Button
            className="w-full h-10 font-semibold rounded-xl"
            style={{ backgroundColor: 'transparent', color: 'white', border: '1.5px solid white', fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.appointment_button_text}
          </Button>
        )}
        {actionData.save_contact_button_text && (
          <button
            className="w-full flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-xl"
            style={{ color: 'rgba(255,255,255,0.90)', border: '1.5px solid rgba(255,255,255,0.5)', fontFamily: font }}
            onClick={() => {
              const contactData = {
                name: data.name || '',
                title: data.title || '',
                email: data.email || configSections.contact?.email || '',
                phone: data.phone || configSections.contact?.phone || '',
                website: data.website || configSections.contact?.website || '',
                location: configSections.contact?.location || ''
              };
              import('@/utils/vcfGenerator').then(module => { module.downloadVCF(contactData); });
            }}
          >
            <UserPlus className="w-4 h-4" />
            {actionData.save_contact_button_text}
          </button>
        )}
      </div>
    );
  };

  const copyrightSection = configSections.copyright;
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
    

  return (
    <div className="w-full rounded-2xl overflow-visible shadow-xl" style={{ 
      fontFamily: font,
      backgroundColor: colors.background,
      border: `1px solid ${colors.borderColor}`,
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
        <div className="px-6 py-3 text-center" style={{ backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.primary}15` }}>
          {copyrightSection.text && (
            <p className="text-sm" style={{ color: colors.text + '55', fontFamily: font }}>
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
