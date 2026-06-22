import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { Mail, Phone, MapPin, UserPlus, UtensilsCrossed, Truck, Clock, Star, ShoppingCart, ChefHat, Video, Play, Youtube, QrCode } from 'lucide-react';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import SocialIcon from '@/pages/link-bio-builder/components/SocialIcon';

interface FoodDeliveryTemplateProps {
  data: any;
  template: any;
}

const FoodDeliveryMapEmbed = React.memo(function FoodDeliveryMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem]"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function FoodDeliveryTemplate({ data, template }: FoodDeliveryTemplateProps) {
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
  const [currentLanguage, setCurrentLanguage] = React.useState(configSections.language?.template_language || i18n.language || 'en');

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

  const colors = configSections.colors || template?.defaultColors || { primary: '#DC2626', secondary: '#EF4444', text: '#1F2937' };
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);
  const pageBackground = colors.background || '#FFF8F1';
  const surfaceColor = colors.cardBg || '#FFFDF8';
  const mutedSurface = colors.accent || '#FEF0E7';
  const lineColor = `${colors.primary}55`;
  const textColor = colors.text || '#3C2A21';
  const softPrimary = `${colors.primary}14`;

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
  const allSections = getBusinessTemplate('food-delivery')?.sections || [];

  const sectionHeader = (icon: React.ReactNode, title: string, subtitle?: string) => (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: softPrimary, color: colors.primary }}
          >
            {icon}
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary, fontFamily: font }}>
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-xs leading-relaxed" style={{ color: `${textColor}B3`, fontFamily: font }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="mt-4 hidden h-px flex-1 md:block" style={{ background: `linear-gradient(90deg, ${lineColor}, transparent)` }} />
    </div>
  );

  const sectionShell = (title: string, icon: React.ReactNode, content: React.ReactNode, subtitle?: string) => (
    <section className="px-6 py-5" style={{ borderTop: `1px solid ${lineColor}55` }}>
      {sectionHeader(icon, title, subtitle)}
      {content}
    </section>
  );

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
      case 'menu_highlights': return renderMenuHighlightsSection(sectionData);
      case 'delivery_info': return renderDeliveryInfoSection(sectionData);
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
      className="relative overflow-hidden rounded-t-2xl px-6 pb-6 pt-7"
      style={{ background: `linear-gradient(180deg, ${mutedSurface}, ${pageBackground})` }}
    >
      <div className="absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%" viewBox="0 0 80 80" className="fill-current text-white">
          <pattern id="food-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="10" r="3" />
            <circle cx="10" cy="25" r="2" />
            <circle cx="30" cy="30" r="2.5" />
            <path d="M15 15 Q20 10 25 15 Q20 20 15 15" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#food-pattern)" />
        </svg>
      </div>
      
      <div className="relative">
        <div className="flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-[1.75rem] shadow-sm"
            style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}
          >
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Logo" className="h-full w-full rounded-[1.75rem] object-cover" />
            ) : (
              <UtensilsCrossed className="h-11 w-11" style={{ color: colors.primary }} />
            )}
          </div>
          <div className="flex w-full flex-col items-center">
            {headerData.title && (
              <div className="mb-3">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.14em]"
                  style={{ backgroundColor: softPrimary, color: colors.primary, border: `1px solid ${lineColor}`, fontFamily: font }}
                >
                  <span className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                  {headerData.title}
                </span>
              </div>
            )}
            <h1 className="mb-2 font-semibold" style={{ color: textColor, fontFamily: font }}>
              {headerData.name || data.name || 'Food Delivery'}
            </h1>
            {headerData.tagline && (
              <p className="mb-4 text-sm leading-relaxed" style={{ color: `${textColor}B3`, fontFamily: font }}>
                {headerData.tagline}
              </p>
            )}
          </div>
        </div>
        
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="absolute top-4 right-4">
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex h-8 w-8 items-center justify-center rounded-full shadow-sm"
                style={{ 
                  backgroundColor: surfaceColor,
                  border: `1px solid ${lineColor}`,
                  color: textColor
                }}
              >
                <span className="text-sm">
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
              </button>
              
              {showLanguageSelector && (
                <>
                  <div 
                    className="fixed inset-0" 
                    style={{ zIndex: 40 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div 
                    className="absolute right-0 top-full mt-1 max-h-60 w-40 overflow-y-auto rounded-2xl border py-1 shadow-xl"
                    style={{
                      backgroundColor: surfaceColor,
                      borderColor: lineColor,
                      zIndex: 50
                    }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="flex w-full items-center space-x-1 px-2 py-1 text-left text-xs hover:bg-gray-50"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? softPrimary : 'transparent',
                          color: textColor
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
        
        <div className="mt-6 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2" style={{ borderColor: `${lineColor}99` }}>
          {headerData.badge_1 && (
            <div className="flex items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}>
              <Truck className="h-4 w-4" style={{ color: colors.primary }} />
              <span className="text-xs font-medium" style={{ color: textColor, fontFamily: font }}>{headerData.badge_1}</span>
            </div>
          )}
          {headerData.badge_2 && (
            <div className="flex items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}>
              <ChefHat className="h-4 w-4" style={{ color: colors.secondary }} />
              <span className="text-xs font-medium" style={{ color: textColor, fontFamily: font }}>{headerData.badge_2}</span>
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

  const renderContactSection = (contactData: any) => (
    sectionShell(
      t('Order Contact'),
      <Phone className="h-4 w-4" />,
      <div className="grid grid-cols-1 gap-3">
          {(contactData.phone || data.phone) && (
            <div className="rounded-[1.25rem] px-4 py-3" style={{ backgroundColor: mutedSurface, border: `1px solid ${lineColor}` }}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}>
                    <Phone className="h-4 w-4" style={{ color: colors.primary }} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" style={{ color: textColor, fontFamily: font }}>
                      {contactData.phone || data.phone}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="h-8 shrink-0 rounded-full px-3 text-xs" 
                  style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(`tel:${contactData.phone || data.phone}`, '_self')}
                >
                  {t('Call Now')}
                </Button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(contactData.email || data.email) && (
              <a 
                href={`mailto:${contactData.email || data.email}`}
                className="flex items-center gap-2.5 rounded-full px-3 py-2.5"
                style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}
              >
                <Mail className="h-4 w-4 shrink-0" style={{ color: colors.primary }} />
                <span className="truncate text-xs font-medium" style={{ color: textColor, fontFamily: font }}>
                  {contactData.email || data.email}
                </span>
              </a>
            )}
            {(contactData.website || data.website) && (
              <a
                href={contactData.website || data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-full px-3 py-2.5"
                style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span className="truncate text-xs font-medium" style={{ color: textColor, fontFamily: font }}>
                  {contactData.website || data.website}
                </span>
              </a>
            )}
            {contactData.location && (
              <div className="flex items-center gap-2.5 rounded-full px-3 py-2.5" style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}>
                <MapPin className="h-4 w-4 shrink-0" style={{ color: colors.primary }} />
                <span className="truncate text-xs font-medium" style={{ color: textColor, fontFamily: font }}>
                  {contactData.location}
                </span>
              </div>
            )}
          </div>
      </div>
    )
  );

  const renderAboutSection = (aboutData: any) => {
    const descriptionText = aboutData.description || data.description;
    if (!descriptionText) return null;

  return (
      sectionShell(
        t('About Our Kitchen'),
        <UtensilsCrossed className="h-4 w-4" />,
        <>
          <p
            className="text-sm leading-7"
            style={{ color: textColor, fontFamily: font }}
          >
            {descriptionText}
          </p>
          {aboutData.specialties && (
            <div className="mt-5 border-t pt-3" style={{ borderColor: `${lineColor}99` }}>
              <p
                className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: `${textColor}80`, fontFamily: font }}
              >
                {t('Cuisine Types')}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {aboutData.specialties
                  .split(',')
                  .map((specialty: string) => specialty.trim())
                  .filter(Boolean)
                  .map((specialty: string, index: number) => (
                    <div
                      key={`${specialty}-${index}`}
                      className="flex items-center gap-2"
                      style={{ color: textColor, fontFamily: font }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: index % 2 === 0 ? colors.primary : colors.secondary }} />
                      <span className="text-sm">{specialty}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {aboutData.experience && (
            <div className="mt-5 flex items-center gap-2 border-t pt-3" style={{ borderColor: `${lineColor}99` }}>
              <span
                className="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-bold"
                style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              >
                {aboutData.experience}
              </span>
              <span className="text-sm font-medium" style={{ color: textColor, fontFamily: font }}>
                {t('Years in Business')}
              </span>
            </div>
          )}
        </>
      )
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return sectionShell(
      t('Our Services'),
      <ShoppingCart className="h-4 w-4" />,
      <div className="space-y-4">
            {services.map((service: any, index: number) => (
              <div
                key={index}
                className="rounded-[1.25rem] px-4 py-4"
                style={{ border: `1px solid ${lineColor}` }}
              >
                <div className="min-w-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h4 className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                        {service.title}
                      </h4>
                      {service.price && (
                        <span className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                          {service.price}
                        </span>
                      )}
                    </div>
                    {service.description && (
                      <p className="mt-1 text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                        {service.description}
                      </p>
                    )}
                    {service.min_order && (
                      <p className="mt-1 text-xs font-medium" style={{ color: `${textColor}99`, fontFamily: font }}>
                        {t("Min. Order")}: {service.min_order}
                      </p>
                    )}
                </div>
              </div>
            ))}
      </div>,
    );
  };

  const renderVideosSection = (_videosData: any) => {
    const getYouTubeThumbnail = (embedUrl: string) => {
      if (!embedUrl) return null;
      const srcMatch = embedUrl.match(/src=["']([^"']+)["']/i);
      const url = srcMatch ? srcMatch[1] : embedUrl;
      const embedMatch = url.match(/embed\/([^?&]+)/);
      const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = embedMatch?.[1] || watchMatch?.[1] || null;
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    if (!videoContent || videoContent.length === 0) return null;
    
    return sectionShell(
      t('Food Videos'),
      <Video className="h-4 w-4" />,
      <div className="space-y-4">
        {videoContent.map((video: any) => (
              <div
                key={video.key}
                className="overflow-hidden rounded-[1.25rem]"
                style={{ backgroundColor: surfaceColor, border: `1px solid ${lineColor}` }}
              >
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
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(40,24,16,0.18)' }}>
                          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 20px ${colors.primary}70` }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                        {video.title}
                      </h4>
                      {video.description && (
                        <p className="mt-1 text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                          {video.description}
                        </p>
                      )}
                    </div>
                    {video.duration && (
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium inline-flex items-center gap-1.5"
                        style={{ color: colors.primary, backgroundColor: softPrimary, fontFamily: font }}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        {video.duration}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {video.video_type && (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize"
                        style={{ color: colors.secondary, backgroundColor: `${colors.secondary}12`, fontFamily: font }}
                      >
                        {video.video_type.replace(/_/g, ' ')}
                      </span>
                    )}
                    {video.cuisine_type && (
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{ color: colors.primary, backgroundColor: softPrimary, fontFamily: font }}
                      >
                        {video.cuisine_type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    
    return sectionShell(
      t('YouTube Channel'),
      <Youtube className="h-4 w-4" />,
      <>
        {youtubeData.latest_video_embed && (
          <div className="mb-5 border-b pb-5" style={{ borderColor: `${lineColor}99` }}>
            <div className="pb-3">
              <h4 className="flex items-center text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                {t("Latest Video")}
              </h4>
            </div>
            <div className="relative w-full overflow-hidden rounded-[1.25rem]" style={{ paddingBottom: "56.25%", height: 0, border: `1px solid ${lineColor}` }}>
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
        
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: `${lineColor}99` }}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: '#FF000012', border: '1px solid #FF000030' }}>
                    <Youtube className="h-4 w-4" style={{ color: '#FF0000' }} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                      {youtubeData.channel_name || 'Food Channel'}
                    </h4>
                    {youtubeData.channel_url && (
                      <p className="mt-0.5 truncate text-xs" style={{ color: `${colors.text}80`, fontFamily: font }}>
                        {youtubeData.channel_url.replace(/^https?:\/\//, '')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {youtubeData.subscriber_count && (
                <span
                  className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
                  style={{ color: colors.primary, backgroundColor: softPrimary, fontFamily: font }}
                >
                  {youtubeData.subscriber_count} {t("subscribers")}
                </span>
              )}
            </div>

            {youtubeData.channel_description && (
              <p className="text-sm leading-7" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}

            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
              {youtubeData.channel_url && (
                <Button 
                  size="sm" 
                  className="w-full rounded-full" 
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
                  className="w-full rounded-full" 
                  style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: 'transparent', fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  {t('Cooking Videos')}
                </Button>
              )}
            </div>
          </div>
      </>
    );
  };

  const renderMenuHighlightsSection = (menuData: any) => {
    const dishes = menuData.dishes || [];
    if (!Array.isArray(dishes) || dishes.length === 0) return null;
    return sectionShell(
      t('Popular Dishes'),
      <ChefHat className="h-4 w-4" />,
      <div className="space-y-4">
        {dishes.map((dish: any, index: number) => (
          <div
            key={index}
            className="rounded-[1.25rem] px-4 py-4"
            style={{
              border: `1px solid ${lineColor}`,
              backgroundColor: surfaceColor
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                    {dish.name}
                  </h4>
                </div>
                {dish.description && (
                  <p className="mt-2 text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                    {dish.description}
                  </p>
                )}
                {dish.category && (
                  <span
                    className="mt-3 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      color: colors.primary,
                      backgroundColor: softPrimary,
                      border: `1px solid ${lineColor}`,
                      fontFamily: font
                    }}
                  >
                    {dish.category}
                  </span>
                )}
              </div>
              {dish.price && (
                <span className="shrink-0 text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                  {dish.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDeliveryInfoSection = (deliveryData: any) => {
    if (!deliveryData.delivery_fee && !deliveryData.delivery_time) return null;
    return sectionShell(
      t('Delivery Info'),
      <Truck className="h-4 w-4" />,
      <div className="space-y-2.5">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {deliveryData.delivery_fee && (
            <div
              className="rounded-xl px-4 py-2 text-center"
              style={{ backgroundColor: mutedSurface, border: `1px solid ${lineColor}` }}
            >
              <p className="text-[11px] font-medium leading-none" style={{ color: `${colors.text}80`, fontFamily: font }}>
                {t('Delivery Fee')}
              </p>
              <p className="mt-1 text-[15px] font-semibold leading-none" style={{ color: colors.primary, fontFamily: font }}>
                {deliveryData.delivery_fee}
              </p>
            </div>
          )}
          {deliveryData.delivery_time && (
            <div
              className="rounded-xl px-4 py-2 text-center"
              style={{ backgroundColor: mutedSurface, border: `1px solid ${lineColor}` }}
            >
              <p className="text-[11px] font-medium leading-none" style={{ color: `${colors.text}80`, fontFamily: font }}>
                {t('Delivery Time')}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-[15px] font-semibold leading-none" style={{ color: colors.primary, fontFamily: font }}>
                <Clock className="h-3.5 w-3.5" />
                <span>{deliveryData.delivery_time}</span>
              </p>
            </div>
          )}
        </div>
        {(deliveryData.delivery_radius || deliveryData.free_delivery_min) && (
          <>
            {deliveryData.delivery_radius && (
              <div
                className="rounded-xl px-4 py-2 text-center"
                style={{ backgroundColor: mutedSurface, border: `1px solid ${lineColor}` }}
              >
                <p className="text-[11px] font-medium leading-none" style={{ color: `${colors.text}80`, fontFamily: font }}>
                  {t('Service Area')}
                </p>
                <p className="mt-1 text-[15px] font-semibold leading-none" style={{ color: colors.primary, fontFamily: font }}>
                  {deliveryData.delivery_radius}
                </p>
              </div>
            )}
            {deliveryData.free_delivery_min && (
              <div
                className="rounded-xl px-4 py-2 text-center"
                style={{ backgroundColor: `${colors.primary}0D`, border: `1px solid ${lineColor}` }}
              >
                <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                  {t("Free delivery over")} {deliveryData.free_delivery_min}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return sectionShell(
      t('Follow Us'),
      <ChefHat className="h-4 w-4" />,
      <div className="grid grid-cols-2 gap-2.5">
            {socialLinks.map((link: any, index: number) => (
              <Button 
                key={index} 
                size="sm" 
                className="h-11 rounded-[1.1rem] font-medium justify-start px-4" 
                style={{ 
                  backgroundColor: surfaceColor,
                  color: colors.primary,
                  border: `1px solid ${lineColor}`,
                  fontFamily: font
                }}
                onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
                  <SocialIcon platform={link.platform} color={index % 2 === 0 ? colors.primary : colors.secondary} />
                </span>
                <span className="capitalize">{link.platform}</span>
              </Button>
            ))}
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return sectionShell(
      t('Service Hours'),
      <Clock className="h-4 w-4" />,
      <div className="space-y-2">
        {hours.slice(0, 7).map((hour: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between border-b py-2 last:border-b-0"
            style={{ borderColor: `${lineColor}99` }}
          >
            <span className="capitalize text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>
              {t(hour.day)}
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                color: hour.is_closed ? `${colors.text}80` : colors.primary,
                fontFamily: font
              }}
            >
              {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return sectionShell(
      t('Happy Customers'),
      <Star className="h-4 w-4" />,
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="rounded-[1.1rem] border px-4 py-3" style={{ borderColor: `${lineColor}` }}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < parseInt(review.rating || 5) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    {review.order_type && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                        style={{
                          backgroundColor: softPrimary,
                          color: colors.primary,
                          fontFamily: font
                        }}
                      >
                        {review.order_type}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-7" style={{ color: colors.text, fontFamily: font }}>
                    "{review.review}"
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                    {review.client_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {reviews.length > 1 && (
          <div className="mt-3 flex justify-center space-x-2">
            {testimonialsData.reviews.map((_, dotIndex) => (
              <div
                key={dotIndex}
                className="h-2 w-2 rounded-full transition-colors"
                style={{ 
                  backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40'
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    sectionShell(
      t('Order Now'),
      <ShoppingCart className="h-4 w-4" />,
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button 
          size="sm" 
          className="h-11 rounded-full font-semibold" 
          style={{ 
            backgroundColor: colors.primary, 
            color: 'white',
            fontFamily: font 
          }}
          onClick={() => appointmentsData?.order_url ? typeof window !== "undefined" && window.open(appointmentsData.order_url, '_blank', 'noopener,noreferrer') : typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t('Order Online')}
        </Button>
        {appointmentsData?.catering_phone ? (
          <Button 
            size="sm" 
            variant="outline"
            className="h-11 rounded-full font-semibold" 
            style={{ 
              borderColor: colors.primary, 
              color: colors.primary,
              backgroundColor: 'transparent',
              fontFamily: font 
            }}
            onClick={() => typeof window !== "undefined" && window.open(`tel:${appointmentsData.catering_phone}`, '_self')}
          >
            <Phone className="w-4 h-4 mr-2" />
            {t('Catering Orders')}
          </Button>
        ) : (
          <div />
        )}
      </div>
    )
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      sectionShell(
        t('Find Us'),
        <MapPin className="h-4 w-4" />,
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <FoodDeliveryMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full rounded-full" 
              style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: 'transparent', fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t('Get Directions')}
            </Button>
          )}
        </div>
      )
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      sectionShell(
        t('Download Our App'),
        <Phone className="h-4 w-4" />,
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {appData.app_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="h-11 rounded-full"
              style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: surfaceColor, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="h-11 rounded-full"
              style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: surfaceColor, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t('Play Store')}
            </Button>
          )}
        </div>
      )
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      sectionShell(
        formData.form_title,
        <Mail className="h-4 w-4" />,
        <div className="space-y-3">
          {formData.form_description && (
            <p className="text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button 
            size="sm" 
            className="h-11 w-full rounded-full font-semibold" 
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white',
              fontFamily: font 
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('Get Quote')}
          </Button>
        </div>
      )
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      sectionShell(
        customHtmlData.show_title && customHtmlData.section_title ? customHtmlData.section_title : t('Daily Specials'),
        <UtensilsCrossed className="h-4 w-4" />,
        <div 
          className="custom-html-content rounded-[1.1rem] p-4" 
          style={{ 
            backgroundColor: surfaceColor,
            border: `1px solid ${lineColor}`,
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
                }
                .custom-html-content p {
                  color: ${colors.text};
                  margin-bottom: 0.5rem;
                  font-family: ${font};
                }
                .custom-html-content a {
                  color: ${colors.secondary};
                  text-decoration: underline;
                }
                .custom-html-content ul, .custom-html-content ol {
                  color: ${colors.text};
                  padding-left: 1rem;
                  font-family: ${font};
                }
                .custom-html-content code {
                  background-color: ${colors.primary}20;
                  color: ${colors.secondary};
                  padding: 0.125rem 0.25rem;
                  border-radius: 0.25rem;
                  font-family: monospace;
                }
              `}
            </style>
            <StableHtmlContent htmlContent={customHtmlData.html_content} />
          </div>
      )
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      sectionShell(
        qrData.qr_title || t('Share Our Menu'),
        <QrCode className="h-4 w-4" />,
        <div className="space-y-3">
          {qrData.qr_description && (
            <p className="text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          <Button 
            size="sm" 
            className="h-11 w-full rounded-full font-semibold" 
            style={{ 
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("Share QR Code")}
          </Button>
        </div>
      )
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasAppointmentButton = actionData.appointment_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasAppointmentButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-5" style={{ borderTop: `1px solid ${lineColor}` }}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {hasContactButton && (
            <Button
              className="h-11 w-full rounded-full font-semibold"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              {actionData.contact_button_text}
            </Button>
          )}

          {hasAppointmentButton && (
            <Button
              className="h-11 w-full rounded-full border font-semibold"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: 'transparent',
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              {actionData.appointment_button_text}
            </Button>
          )}
        </div>

        {hasSaveContactButton && (
          <Button
            size="sm"
            variant="outline"
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full"
            style={{
              borderColor: lineColor,
              color: colors.primary,
              backgroundColor: surfaceColor,
              fontFamily: font
            }}
            onClick={() => {
              const contactData = {
                name: data.name || '',
                title: data.title || '',
                email: data.email || configSections.contact?.email || '',
                phone: data.phone || configSections.contact?.phone || '',
                website: data.website || configSections.contact?.website || '',
                location: configSections.contact?.location || ''
              };
              import('@/utils/vcfGenerator').then(module => {
                module.downloadVCF(contactData);
              });
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-4 pt-2">
        <div
          className="rounded-[1.1rem] px-4 py-3 text-center"
          style={{ backgroundColor: `${colors.primary}08`, border: `1px solid ${lineColor}` }}
        >
          <p className="text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
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
    <div className="w-full rounded-2xl overflow-hidden shadow-xl [&_button]:cursor-pointer" style={{ 
      fontFamily: font,
      backgroundColor: pageBackground,
      border: `1px solid ${lineColor}`,
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
        <div className="px-5 pb-4 pt-2" style={{ backgroundColor: colors.cardBg }}>
          {copyrightSection.text && (
            <div className="pt-3 text-center">
              <p className="text-sm" style={{ color: colors.text + '66', fontFamily: font }}>
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
