import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Wrench, Shield, Zap, Clock, Star, AlertTriangle, Settings, Video, Play, Youtube, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface HomeServicesTemplateProps {
  data: any;
  template: any;
}

const HomeServicesMapEmbed = React.memo(function HomeServicesMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function HomeServicesTemplate({ data, template }: HomeServicesTemplateProps) {
  const { t, i18n } = useTranslation();
  
  const templateSections = template?.defaultData || {};
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
      
      const videoData = video.embed_url ? extractVideoUrl(video.embed_url) : null;
      return {
        ...video,
        videoData,
        key: `video-${index}-${video.title || ''}-${video.embed_url || ''}`
      };
    });
  }, [configSections.videos?.video_list]);

  const colors = configSections.colors || template?.defaultColors || { primary: '#1E40AF', secondary: '#3B82F6', text: '#1E293B' };

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
  const allSections = getBusinessTemplate('home-services')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header': return renderHeaderSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'about': return renderAboutSection(sectionData);
      case 'services': return renderServicesSection(sectionData);
      case 'videos': return renderVideosSection(sectionData);
      case 'youtube': return renderYouTubeSection(sectionData);
      case 'certifications': return renderCertificationsSection(sectionData);
      case 'emergency_info': return renderEmergencyInfoSection(sectionData);
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
    <div
      className="relative rounded-t-2xl"
      style={{ background: `linear-gradient(145deg, ${colors.primary}, ${colors.secondary})` }}
    >
      <div
        className="absolute inset-0 opacity-10 rounded-t-2xl pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, white 0, transparent 22%), linear-gradient(135deg, transparent 0 72%, rgba(255,255,255,0.24) 72% 74%, transparent 74% 100%)`
        }}
      />

      <div className="px-6 py-5 relative">
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.14)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  fontFamily: font
                }}
              >
                <Globe className="w-3 h-3" />
                <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>

              {showLanguageSelector && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] max-h-48 overflow-y-auto z-[99999]">
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

        <div className="flex items-start gap-4 pr-20">
          <div
            className="w-18 h-18 min-w-[72px] rounded-2xl flex items-center justify-center border shadow-lg"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderColor: 'rgba(255,255,255,0.22)'
            }}
          >
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Logo" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <Settings className="w-9 h-9 text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white leading-tight mb-2" style={{ fontFamily: font }}>
              {headerData.name || data.name || 'Home Services'}
            </h1>

            <p className="text-sm font-medium text-white/90" style={{ fontFamily: font }}>
              {headerData.title || data.title || 'Professional Home Maintenance'}
            </p>
          </div>
        </div>

        {headerData.tagline && (
          <p className="text-sm leading-6 text-white/80 mt-4 max-w-[92%]" style={{ fontFamily: font }}>
            {headerData.tagline}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-5">
          {headerData.badge_1 && (
            <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Shield className="w-4 h-4 text-white shrink-0" />
              <span className="text-sm text-white truncate" style={{ fontFamily: font }}>{headerData.badge_1}</span>
            </div>
          )}
          {headerData.badge_2 && (
            <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Wrench className="w-4 h-4 text-white shrink-0" />
              <span className="text-sm text-white truncate" style={{ fontFamily: font }}>{headerData.badge_2}</span>
            </div>
          )}
          {headerData.badge_3 && (
            <div className="rounded-xl px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              <Clock className="w-4 h-4 text-white shrink-0" />
              <span className="text-sm text-white truncate" style={{ fontFamily: font }}>{headerData.badge_3}</span>
            </div>
          )}
        </div>
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

  const renderContactSection = (contactData: any) => {
    const phone = contactData.phone || data.phone;
    const email = contactData.email || data.email;
    const website = contactData.website || data.website;
    const websiteUrl = website && /^https?:\/\//i.test(website) ? website : website ? `https://${website}` : '';
    const location = contactData.location;

    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-4 h-1 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              <span className="w-5 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              <p
                className="text-sm font-bold tracking-[0.02em]"
                style={{ color: colors.primary, fontFamily: font }}
              >
                {t('Contact')}
              </p>
            </div>

            <div className="p-3">
              {phone && (
                <div
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-3 mb-3"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium" style={{ color: colors.text + '80', fontFamily: font }}>
                        {t('Phone')}
                      </p>
                      <p className="text-base font-semibold truncate" style={{ color: colors.text, fontFamily: font }}>
                        {phone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-semibold px-3 py-1.5 rounded-md shrink-0 cursor-pointer"
                    style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}
                    onClick={() => typeof window !== "undefined" && window.open(`tel:${phone}`, '_self')}
                  >
                    {t('Call')}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="rounded-xl px-3 py-2.5"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: colors.primary }} />
                      <span className="text-xs font-medium" style={{ color: colors.text + '80', fontFamily: font }}>
                        {t('Email')}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: colors.text, fontFamily: font }}>
                      {email}
                    </p>
                  </a>
                )}

                {website && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl px-3 py-2.5"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: colors.primary }} />
                      <span className="text-xs font-medium" style={{ color: colors.text + '80', fontFamily: font }}>
                        {t('Website')}
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: colors.text, fontFamily: font }}>
                      {website}
                    </p>
                  </a>
                )}
              </div>

              {location && (
                <div
                  className="mt-2 rounded-xl px-3 py-2.5 border-dashed border"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.primary + '20' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: colors.primary }} />
                    <span className="text-xs font-medium" style={{ color: colors.text + '80', fontFamily: font }}>
                      {t('Service Area')}
                    </span>
                  </div>
                  <p className="text-sm truncate" style={{ color: colors.text, fontFamily: font }}>
                    {location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 border-2 rotate-45" style={{ borderColor: colors.primary }}></div>
            <Wrench className="w-4 h-4" style={{ color: colors.primary }} />
            <div className="w-3 h-3 border-2 rotate-45" style={{ borderColor: colors.primary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <p
                className="text-lg font-semibold"
                style={{ color: colors.primary, fontFamily: font }}
              >
                {t('Professional Services')}
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm leading-7 mb-4" style={{ color: colors.text, fontFamily: font }}>
                {aboutData.description || data.description}
              </p>

              {aboutData.specialties && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></span>
                    <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: colors.text + '99', fontFamily: font }}>
                      {t("Specialties")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                      <Badge
                        key={index}
                        className="text-sm px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: colors.cardBg,
                          color: colors.primary,
                          border: `1px solid ${colors.primary}24`
                        }}
                      >
                        {specialty.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {aboutData.experience && (
                <div
                  className="inline-flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  <div
                    className="min-w-8 h-8 rounded-full flex items-center justify-center px-2.5"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <span className="text-white text-sm font-bold" style={{ fontFamily: font }}>
                      {aboutData.experience}
                    </span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>
                    {t("Years of Professional Service")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex space-x-1">
            <div className="w-2 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-2 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('Our Services')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
            {services.map((service: any, index: number) => (
              <div
                key={index}
                className="rounded-xl px-3 py-3 border"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: service.emergency ? '#FECACA' : colors.primary + '14'
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5">
                      <h4 className="font-semibold text-[15px] truncate" style={{ color: colors.text, fontFamily: font }}>
                        {service.title}
                      </h4>
                    </div>
                    {service.description && (
                      <p className="text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                        {service.description}
                      </p>
                    )}
                  </div>

                  {service.price && (
                    <span
                      className="text-sm font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        color: service.emergency ? '#DC2626' : colors.primary,
                        backgroundColor: service.emergency ? '#FEE2E2' : colors.primary + '12',
                        fontFamily: font
                      }}
                    >
                      {service.price}
                    </span>
                  )}
                </div>

                {service.emergency && (
                  <div className="mt-2">
                    <span
                      className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontFamily: font }}
                    >
                      {t("Emergency Service Available")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </>
    );
  };

  const renderVideosSection = (videosData: any) => {
    const formatVideoType = (value: string) =>
      value
        ?.split('_')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

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
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center gap-1">
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-1 h-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <Video className="w-4 h-4 mx-1" style={{ color: colors.primary }} />
            <div className="w-1 h-3 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-1 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-1 h-4 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('Service Videos')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>
            <div className="p-3 space-y-3">
            {videoContent.map((video: any) => (
              <div key={video.key} className="rounded-xl overflow-hidden border" style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.primary + '14'
              }}>
                <div className="relative">
                  {(() => {
                  const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
                  const thumbUrl = video.thumbnail
                    ? getImageDisplayUrl(video.thumbnail)
                    : getYouTubeThumbnail(video.embed_url || '');
                  return playingKey === video.key && videoUrl ? (
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
                      className="relative w-full h-44 cursor-pointer"
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                          <Video className="w-8 h-8" style={{ color: colors.primary }} />
                        </div>
                      )}
                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 20px ${colors.primary}70` }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-[15px] mb-1" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {video.description}
                    </p>
                  )}
                  {(video.duration || video.video_type) && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                        {video.duration && <Clock className="w-3.5 h-3.5" />}
                        {video.duration || ''}
                      </span>
                      {video.video_type && (
                        <span
                          className="inline-flex text-sm px-2.5 py-1 rounded-full shrink-0"
                          style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}
                        >
                          {formatVideoType(video.video_type)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary})` }}></div>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Youtube className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="w-8 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${colors.primary}, transparent)` }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('YouTube Channel')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>
            <div className="p-3">
              {youtubeData.latest_video_embed && (
                <div className="mb-4 rounded-xl overflow-hidden border" style={{ backgroundColor: colors.cardBg, borderColor: colors.primary + '14' }}>
                  <div className="px-3 py-2.5 border-b" style={{ borderColor: colors.primary + '12' }}>
                    <h4 className="font-semibold text-[15px]" style={{ color: colors.text, fontFamily: font }}>
                      {t("Latest Video")}
                    </h4>
                  </div>
                  <div className="w-full relative overflow-hidden" style={{ paddingBottom: "56.25%", height: 0 }}>
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
        
              <div className="p-3 rounded-xl border" style={{ backgroundColor: colors.cardBg, borderColor: colors.primary + '14' }}>
                <div className="flex items-center mb-3">
                  <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center mr-3 shrink-0">
                    <Youtube className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[15px] truncate" style={{ color: colors.text, fontFamily: font }}>
                      {youtubeData.channel_name || 'Home Services'}
                    </h4>
                    {youtubeData.subscriber_count && (
                      <p className="text-sm" style={{ color: colors.text + 'CC', fontFamily: font }}>
                        {youtubeData.subscriber_count} {t("subscribers")}
                      </p>
                    )}
                  </div>
                </div>
                
                {youtubeData.channel_description && (
                  <p className="text-sm mb-3 leading-6" style={{ color: colors.text, fontFamily: font }}>
                    {youtubeData.channel_description}
                  </p>
                )}
                
                <div className="space-y-2">
              {youtubeData.channel_url && (
                <Button 
                  size="sm" 
                  className="w-full h-10 cursor-pointer" 
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: 'white',
                    fontFamily: font 
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  {t('SUBSCRIBE')}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full h-10 cursor-pointer" 
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  {t('SERVICE TUTORIALS')}
                </Button>
              )}
            </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCertificationsSection = (certData: any) => {
    const certs = certData.cert_list || [];
    if (!Array.isArray(certs) || certs.length === 0) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rotate-45 rounded-sm" style={{ backgroundColor: colors.primary + '40' }}></div>
            <div className="w-2 h-2 rotate-45 rounded-sm" style={{ backgroundColor: colors.primary + '70' }}></div>
            <Shield className="w-4 h-4" style={{ color: colors.primary }} />
            <div className="w-2 h-2 rotate-45 rounded-sm" style={{ backgroundColor: colors.primary + '70' }}></div>
            <div className="w-2 h-2 rotate-45 rounded-sm" style={{ backgroundColor: colors.primary + '40' }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('Licensed & Certified')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
            {certs.map((cert: any, index: number) => (
              <div
                key={index}
                className="flex items-start justify-between gap-3 px-3 py-3 rounded-xl border"
                style={{ backgroundColor: colors.cardBg, borderColor: colors.primary + '14' }}
              >
                <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold" style={{ color: colors.text, fontFamily: font }}>
                      {(cert.title || '').replace(/[<>"'&]/g, '')}
                    </p>
                    {cert.number && (
                      <p className="text-sm mt-1" style={{ color: colors.text + '80', fontFamily: font }}>
                        #{cert.number}
                      </p>
                    )}
                </div>
                {cert.expiry && (
                  <span
                    className="text-sm px-2.5 py-1 rounded-full shrink-0"
                    style={{ color: colors.secondary, backgroundColor: colors.secondary + '12', fontFamily: font }}
                  >
                    {t("Valid")}: {cert.expiry}
                  </span>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </>
    );
  };

  const renderEmergencyInfoSection = (emergencyData: any) => {
    if (!emergencyData.emergency_phone && !emergencyData.emergency_hours) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-[2px] bg-red-300 rounded-full"></div>
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-3 h-3 text-red-500" />
            </div>
            <div className="w-4 h-[2px] bg-red-300 rounded-full"></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="rounded-2xl border overflow-hidden border-red-200" style={{ backgroundColor: '#FEF2F2' }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-red-200">
              <h3 className="font-bold text-base text-red-600" style={{ fontFamily: font }}>
                {t('Emergency Services')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="w-6 h-[2px] rounded-full bg-red-400"></span>
              </div>
            </div>

            <div className="p-3 space-y-2.5">
              {emergencyData.emergency_phone && (
                <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 border border-red-200 bg-white/80">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-red-500" style={{ fontFamily: font }}>
                      {t('Phone')}
                    </p>
                    <p className="text-[15px] font-semibold text-red-800 truncate" style={{ fontFamily: font }}>
                      {emergencyData.emergency_phone}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-9 px-4 bg-red-600 hover:bg-red-700 shrink-0 cursor-pointer" 
                    style={{ fontFamily: font }}
                    onClick={() => typeof window !== "undefined" && window.open(`tel:${emergencyData.emergency_phone}`, '_self')}
                  >
                    {t('Call')}
                  </Button>
                </div>
              )}

              {emergencyData.emergency_hours && (
                <div className="rounded-xl px-3 py-2.5 border border-red-200 bg-white/80">
                  <p className="text-xs font-medium text-red-500 mb-1" style={{ fontFamily: font }}>
                    {t('Hours')}
                  </p>
                  <p className="text-sm text-red-800" style={{ fontFamily: font }}>
                    {emergencyData.emergency_hours}
                  </p>
                </div>
              )}

              {emergencyData.response_time && (
                <div className="rounded-xl px-3 py-2.5 border border-red-200 bg-white/80">
                  <p className="text-xs font-medium text-red-500 mb-1" style={{ fontFamily: font }}>
                    {t("Response Time")}
                  </p>
                  <p className="text-sm text-red-800" style={{ fontFamily: font }}>
                    {emergencyData.response_time}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center gap-1">
            <div className="w-5 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="w-5 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '60' }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-5 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '60' }}></div>
            <div className="w-5 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '30' }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('Find Us Online')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>

            <div className="p-3 grid grid-cols-2 gap-2">
            {socialLinks.map((link: any, index: number) => (
              <button 
                key={index} 
                type="button"
                className="h-11 px-3 rounded-xl font-medium border text-left flex items-center justify-center gap-2 cursor-pointer"
                style={{ 
                  backgroundColor: colors.cardBg,
                  color: colors.primary,
                  borderColor: colors.primary + '14',
                  fontFamily: font
                }}
                onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <SocialIcon platform={link.platform} color={colors.primary} />
                {link.platform}
              </button>
            ))}
          </div>
          </div>
        </div>
      </>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <Clock className="w-4 h-4" style={{ color: colors.primary }} />
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              backgroundColor: colors.accent,
              borderColor: colors.primary + '18'
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 py-3 border-b"
              style={{ borderColor: colors.primary + '14' }}
            >
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('Service Hours')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>

            <div className="p-3 space-y-2">
              {hours.slice(0, 7).map((hour: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl border"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: hour.is_closed ? colors.primary + '10' : colors.primary + '14'
                  }}
                >
                  <span className="capitalize text-[15px] font-medium" style={{ color: colors.text, fontFamily: font }}>
                    {t(hour.day)}
                  </span>
                  <span
                    className="text-sm font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{
                      color: hour.is_closed ? colors.text + '80' : colors.primary,
                      backgroundColor: hour.is_closed ? colors.accent : colors.primary + '12',
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
      </>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current" style={{ color: colors.primary }} />
            <Star className="w-4 h-4 fill-current" style={{ color: colors.primary }} />
            <Star className="w-3 h-3 fill-current" style={{ color: colors.primary }} />
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
              {t('Customer Reviews')}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review: any, index: number) => (
                  <div key={index} className="w-full flex-shrink-0 px-1">
                    <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.accent, borderColor: colors.primary + '14' }}>
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < parseInt(review.rating || 5) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        {review.service_type && (
                          <span className="text-sm px-2.5 py-1 rounded-full" style={{ 
                            backgroundColor: colors.cardBg,
                            color: colors.primary,
                            fontFamily: font
                          }}>
                            {review.service_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-3 leading-7" style={{ color: colors.text, fontFamily: font }}>
                        "{(review.review || '').replace(/[<>"'&]/g, '')}"
                      </p>
                      <div className="pt-3 border-t" style={{ borderColor: colors.primary + '10' }}>
                        <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
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
                {testimonialsData.reviews.map((_, dotIndex) => (
                  <div
                    key={dotIndex}
                    className="w-2 h-2 rounded-full transition-colors cursor-pointer"
                    style={{ 
                      backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40'
                    }}
                    onClick={() => setCurrentReview(dotIndex)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    <>
      <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-px" style={{ backgroundColor: colors.primary }}></div>
          <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
          <div className="w-6 h-px" style={{ backgroundColor: colors.primary }}></div>
        </div>
      </div>
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div
          className="rounded-2xl p-4"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.cardBg})` }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
              {t('Schedule Service')}
            </h3>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          {appointmentsData?.estimate_note && (
            <p className="text-sm mb-3 leading-6" style={{ color: colors.text, fontFamily: font }}>
              {appointmentsData.estimate_note}
            </p>
          )}
          <Button 
            size="sm" 
            className="w-full h-11 font-semibold rounded-xl cursor-pointer" 
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white',
              fontFamily: font 
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t("Book Service")}
          </Button>
        </div>
      </div>
    </>
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: colors.primary }}></div>
            <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: colors.primary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
              {t('Service Area')}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
            </div>
          </div>

          <div className="space-y-3">
            {locationData.map_embed_url && (
              <HomeServicesMapEmbed embedHtml={locationData.map_embed_url} />
            )}
            
            {locationData.directions_url && (
              <Button 
                size="sm" 
                className="w-full h-10 rounded-xl cursor-pointer" 
                style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {t('Get Directions')}
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-sm rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-8 h-px" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-2 h-2 rounded-sm rotate-45" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-8 h-px" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-sm rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.accent }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b" style={{ borderColor: colors.primary + '14' }}>
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t('Download Our App')}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>
          <div className="grid grid-cols-2 gap-2 p-3">
            {appData.app_store_url && (
              <Button
                size="sm"
                className="h-11 rounded-xl cursor-pointer"
                style={{ backgroundColor: colors.cardBg, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t('App Store')}
              </Button>
            )}
            {appData.play_store_url && (
              <Button
                size="sm"
                className="h-11 rounded-xl cursor-pointer"
                style={{ backgroundColor: colors.cardBg, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t('Play Store')}
              </Button>
            )}
          </div>
          </div>
        </div>
      </>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <Mail className="w-4 h-4" style={{ color: colors.primary }} />
            <div className="w-4 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="rounded-2xl p-4" style={{ backgroundColor: colors.accent }}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {formData.form_title}
              </h3>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
            {formData.form_description && (
              <p className="text-sm mb-3 leading-6" style={{ color: colors.text, fontFamily: font }}>
                {formData.form_description}
              </p>
            )}
            <Button 
              size="sm" 
              className="w-full h-11 rounded-xl cursor-pointer" 
              style={{ 
                backgroundColor: colors.secondary, 
                color: 'white',
                fontFamily: font 
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Mail className="w-4 h-4 mr-2" />
              {t('Get Free Estimate')}
            </Button>
          </div>
        </div>
      </>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" style={{ color: colors.primary }} />
            <div className="w-8 h-px" style={{ backgroundColor: colors.primary }}></div>
            <Settings className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {customHtmlData.show_title && customHtmlData.section_title && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-t-2xl" style={{ backgroundColor: colors.accent }}>
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {customHtmlData.section_title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>
          )}
          <div 
            className={`custom-html-content p-4 ${customHtmlData.show_title && customHtmlData.section_title ? 'rounded-b-2xl' : 'rounded-2xl'}`} 
            style={{ 
              backgroundColor: colors.accent,
              fontFamily: font,
              color: colors.text
            }}
          >
            <style>
              {`
                .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
                  color: ${colors.primary};
                  margin-bottom: 0.5rem;
                  font-family: ${font};
                  font-weight: bold;
                }
                .custom-html-content p {
                  color: ${colors.text};
                  margin-bottom: 0.5rem;
                  font-family: ${font};
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
                }
                .custom-html-content code {
                  background-color: ${colors.primary}20;
                  color: ${colors.primary};
                  padding: 0.125rem 0.25rem;
                  border-radius: 0.25rem;
                  font-family: 'Courier New', monospace;
                  font-weight: bold;
                }
              `}
            </style>
            <StableHtmlContent htmlContent={customHtmlData.html_content} />
          </div>
        </div>
      </>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '40' }}></div>
            <div className="w-4 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '70' }}></div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15', border: `1.5px solid ${colors.primary}40` }}>
              <Share2 className="w-3 h-3" style={{ color: colors.primary }} />
            </div>
            <div className="w-4 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '70' }}></div>
            <div className="w-3 h-[1.5px] rounded-full" style={{ backgroundColor: colors.primary + '40' }}></div>
          </div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="rounded-2xl overflow-hidden text-center" style={{ backgroundColor: colors.accent }}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b text-left" style={{ borderColor: colors.primary + '14' }}>
              <h3 className="font-bold text-base tracking-[0.02em]" style={{ color: colors.primary, fontFamily: font }}>
                {t("Share Our Services")}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
                <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: colors.secondary }}></span>
              </div>
            </div>
          <div className="p-4">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <QrCode className="w-6 h-6 text-white" />
              </div>
            </div>
            {qrData.qr_title && (
              <h4 className="font-semibold text-[15px] mb-2" style={{ color: colors.text, fontFamily: font }}>
                {qrData.qr_title}
              </h4>
            )}
            
            {qrData.qr_description && (
              <p className="text-sm mb-3 leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {qrData.qr_description}
              </p>
            )}
            
            <Button 
              size="sm" 
              className="w-full cursor-pointer" 
              style={{ 
                backgroundColor: colors.primary,
                color: 'white',
                fontFamily: font
              }}
              onClick={() => setShowQrModal(true)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {t("Share QR Code")}
            </Button>
          </div>
          </div>
        </div>
      </>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-3">
        <div className="rounded-2xl px-4 py-3 text-center border-t-2" style={{ backgroundColor: colors.accent, borderColor: colors.primary + '20' }}>
          <p className="text-sm" style={{ color: colors.text + 'B3', fontFamily: font }}>
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

    if (!hasContactButton && !hasAppointmentButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-5" style={{ backgroundColor: colors.cardBg }}>
        <div className="space-y-3">
          {hasContactButton && (
            <Button 
              className="w-full h-12 font-semibold rounded-2xl shadow-sm justify-center px-4 cursor-pointer" 
              style={{ 
                backgroundColor: colors.primary,
                color: 'white',
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Mail className="w-4 h-4 mr-2" />
              {actionData.contact_button_text}
            </Button>
          )}

          {(hasAppointmentButton || hasSaveContactButton) && (
            <div className="grid grid-cols-2 gap-3">
              {hasAppointmentButton && (
                <button
                  type="button"
                  className="h-14 rounded-2xl px-3 text-left flex items-center gap-2.5 cursor-pointer"
                  style={{
                    backgroundColor: colors.accent,
                    border: `1px solid ${colors.primary}18`,
                    fontFamily: font
                  }}
                  onClick={() => handleAppointmentBooking(configSections.appointments)}
                >
                  <Calendar className="w-4 h-4 shrink-0" style={{ color: colors.primary }} />
                  <span className="block text-sm font-semibold leading-tight" style={{ color: colors.text }}>
                    {actionData.appointment_button_text}
                  </span>
                </button>
              )}
              
              {hasSaveContactButton && (
                <button
                  type="button"
                  className="h-14 rounded-2xl px-3 text-left flex items-center gap-2.5 cursor-pointer"
                  style={{
                    backgroundColor: colors.accent,
                    border: `1px solid ${colors.primary}18`,
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
                  <UserPlus className="w-4 h-4 shrink-0" style={{ color: colors.primary }} />
                  <span className="block text-sm font-semibold leading-tight" style={{ color: colors.text }}>
                    {actionData.save_contact_button_text}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const copyrightSection = configSections.copyright;
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
  
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={{ 
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
        <div className="px-6 pb-4 pt-2" style={{ backgroundColor: colors.cardBg }}>
          {copyrightSection.text && (
            <div className="rounded-2xl px-4 py-3 text-center border-t" style={{ backgroundColor: colors.accent, borderColor: colors.primary + '14' }}>
              <p className="text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                {copyrightSection.text}
              </p>
            </div>
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
