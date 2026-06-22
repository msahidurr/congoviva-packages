import { handleAppointmentBooking } from '../VCardPreview';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData, sanitizePath } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart,
  Star,
  ChevronRight,
  MessageSquare,
  Image,
  PartyPopper,
  Users,
  Briefcase,
  Cake,
  Music,
  Sparkles,
  Facebook,
  Instagram,
  User,
  Download,
  Video,
  Play,
  Youtube,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface EventPlannerTemplateProps {
  data: any;
  template: any;
}

const EventPlannerMapEmbed = React.memo(function EventPlannerMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="w-full h-40 rounded-lg overflow-hidden" style={{ border: `1px solid #EEEEEE` }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

const MinimalSectionTitle = ({
  title,
  subtitle,
  colors,
  font
}: {
  title: string;
  subtitle?: string;
  colors: any;
  font: string;
}) => (
  <div className="mb-5 text-center">
    <div className="flex items-center justify-center gap-3">
      <span className="block h-px w-10" style={{ backgroundColor: `${colors.primary}40` }} />
      <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
      <h2
        className="text-xl font-bold"
        style={{
          color: colors.primary,
          fontFamily: font
        }}
      >
        {title}
      </h2>
      <span className="block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
      <span className="block h-px w-10" style={{ backgroundColor: `${colors.primary}40` }} />
    </div>
    {subtitle && (
      <p
        className="mt-2 text-sm"
        style={{ color: colors.text + 'B3', fontFamily: font }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

export default function EventPlannerTemplate({ data, template }: EventPlannerTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('about');
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  
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
  

  
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#9C27B0', 
    secondary: '#E1BEE7', 
    accent: '#F3E5F5', 
    background: '#FFFFFF', 
    text: '#333333',
    cardBg: '#FAFAFA',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF'
  };
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
  const allSections = getBusinessTemplate('eventplanner')?.sections || [];

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
  
  const renderHeaderSection = (headerData: any) => (
    <div className="relative">
      {/* Cover Image with Overlay */}
      <div
        className="relative overflow-hidden min-h-[13.5rem]"
        style={{
          background: `linear-gradient(180deg, ${colors.primary}CC 0%, ${colors.primary}E6 100%)`
        }}
      >
        {headerData.cover_image ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${getImageDisplayUrl(headerData.cover_image)})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              opacity: 0.98,
              filter: 'saturate(1.08) contrast(1.04)'
            }}
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            background: headerData.cover_image
              ? `linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.30) 100%)`
              : `linear-gradient(180deg, ${colors.primary}CC 0%, ${colors.primary}E6 100%)`
          }}
        />
        {headerData.cover_image ? (
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.20) 100%)'
            }}
          />
        ) : null}
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-end px-4 py-3 sm:px-5">
          {/* Language Selector - Top Right */}
          {(configSections?.language && configSections?.language?.enable_language_switcher) ? (
            <div className="relative z-50">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm cursor-pointer"
                style={{ 
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text
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
                    style={{ zIndex: 30 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div 
                    className="absolute right-0 top-full mt-1 w-40 max-h-60 overflow-y-auto rounded border py-1 shadow-xl"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.borderColor,
                      zIndex: 50
                    }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="flex w-full items-center space-x-1 px-2 py-1 text-left text-xs hover:bg-gray-50 cursor-pointer"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '10' : 'transparent',
                          color: colors.text
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
          ) : null}
        </div>
        
        {/* Overlay with Logo and Name */}
        <div 
          className="relative z-10 flex min-h-[13.5rem] items-center justify-center px-4 pb-4 pt-11 sm:px-5"
        >
          <div
            className="w-full max-w-sm rounded-[2rem] px-4 py-5 text-center"
            style={{
              background: headerData.cover_image ? 'rgba(0,0,0,0.10)' : 'transparent',
              backdropFilter: headerData.cover_image ? 'blur(1px)' : 'none'
            }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{
                backgroundColor: 'rgba(255,255,255,0.16)',
                color: '#FFF7ED',
                fontFamily: font
              }}
            >
              <Sparkles size={12} />
              {t('Event Planner')}
            </div>

            <div className="mt-2.5 flex flex-col items-center">
              {headerData.logo ? (
                <div
                  className="flex h-[4.25rem] w-[4.25rem] items-center justify-center overflow-hidden rounded-2xl border-[3px] bg-white/10 shadow-lg backdrop-blur-sm"
                  style={{ borderColor: 'rgba(255,255,255,0.7)' }}
                >
                  <img 
                    src={getImageDisplayUrl(headerData.logo)} 
                    alt={headerData.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div 
                  className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl border-[3px] shadow-lg backdrop-blur-sm" 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.10)',
                    borderColor: 'rgba(255,255,255,0.7)',
                    color: '#FFFFFF'
                  }}
                >
                  <PartyPopper size={22} />
                </div>
              )}
            </div>
            
            <h1 
              className="mt-2.5 text-[1.7rem] font-bold leading-tight" 
              style={{ 
                color: '#FFFFFF',
                fontFamily: font,
                textShadow: '0 4px 16px rgba(0,0,0,0.42)'
              }}
            >
              {headerData.name || data.name || 'Stellar Events'}
            </h1>
            
            {headerData.tagline && (
              <p 
                className="mx-auto mt-1.5 max-w-[17rem] text-sm leading-5" 
                style={{ 
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.38)',
                  fontFamily: font
                }}
              >
                {headerData.tagline}
              </p>
            )}

            {/* Save Contact Button */}
            <Button
              size="sm"
              className="mt-3 rounded-full px-4 py-2 cursor-pointer"
              style={{ 
                backgroundColor: '#FFFFFF',
                color: colors.primary,
                fontFamily: font,
                boxShadow: '0 10px 30px rgba(0,0,0,0.16)'
              }}
              onClick={() => {
                const businessData = {
                  name: sanitizePath(headerData.name || data.name || ''),
                  title: sanitizePath(headerData.tagline || ''),
                  email: sanitizePath(configSections.contact?.email || data.email || ''),
                  phone: sanitizePath(configSections.contact?.phone || data.phone || ''),
                  website: sanitizePath(configSections.contact?.website || ''),
                  location: sanitizePath(configSections.contact?.address || '')
                };
                import('@/utils/vcfGenerator').then(module => {
                  module.downloadVCF(businessData);
                });
              }}
            >
              <User size={14} className="mr-2"  />
              {t("Save Contact")}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div 
        className="px-4 py-3" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="flex overflow-x-auto items-center gap-1 hide-scrollbar"
          style={{
            borderBottom: `1px solid ${colors.borderColor}`
          }}
        >
          <TabButton 
            label="About" 
            active={activeTab === 'about'} 
            onClick={() => setActiveTab('about')} 
            colors={colors}
            font={font}
          />
          <TabButton 
            label="Services" 
            active={activeTab === 'services'} 
            onClick={() => setActiveTab('services')} 
            colors={colors}
            font={font}
          />
          <TabButton 
            label="Portfolio" 
            active={activeTab === 'portfolio'} 
            onClick={() => setActiveTab('portfolio')} 
            colors={colors}
            font={font}
          />
          <TabButton 
            label="Contact" 
            active={activeTab === 'contact'} 
            onClick={() => setActiveTab('contact')} 
            colors={colors}
            font={font}
          />
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
  
  const TabButton = ({ label, active, onClick, colors, font }: any) => (
    <button
      className="relative min-w-fit px-4 py-3 text-sm whitespace-nowrap transition-all duration-200 cursor-pointer"
      style={{ 
        color: active ? colors.primary : `${colors.text}D9`,
        background: 'transparent',
        letterSpacing: '0.02em',
        fontSize: '0.9rem',
        fontWeight: active ? 600 : 500,
        fontFamily: font
      }}
      onClick={onClick}
    >
      <span
        className="absolute left-1/2 bottom-1 h-0.5 -translate-x-1/2 transition-all duration-200"
        style={{
          width: active ? '3.25rem' : '0rem',
          background: active ? `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary || colors.primary} 100%)` : 'transparent'
        }}
      />
      {label}
    </button>
  );
  
  const renderAboutSection = (aboutData: any) => {
    if (activeTab !== 'about') return null;
    if (!aboutData.description && !data.description) return null;
  return (
      <div className="p-5">
        <MinimalSectionTitle title={t("About Us")} colors={colors} font={font} />
        <p 
          className="mx-auto mt-4 max-w-md text-sm leading-7 text-center" 
          style={{ color: colors.text }}
        >
          {aboutData.description || data.description}
        </p>
        
        <div
          className="mt-4 mb-6 rounded-xl px-4 py-3"
          style={{
            backgroundColor: colors.cardBg || colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="flex items-center justify-between">
            {aboutData.year_established && (
              <div className="flex-1 text-center">
                <p
                  className="text-[10px]"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {t("ESTABLISHED")}
                </p>
                <p
                  className="mt-1 text-lg font-semibold"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {aboutData.year_established}
                </p>
              </div>
            )}

            {aboutData.year_established && aboutData.events_completed && (
              <div
                className="mx-2 h-12 w-px"
                style={{ backgroundColor: `${colors.primary}55` }}
              />
            )}
            
            {aboutData.events_completed && (
              <div className="flex-1 text-center">
                <p
                  className="text-[10px]"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {t("EVENTS COMPLETED")}
                </p>
                <p
                  className="mt-1 text-lg font-semibold"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {aboutData.events_completed}+
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Button
          className="mx-auto flex w-auto rounded px-5 py-2"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          {t("Contact Us")}
        </Button>
      </div>
    );
  };
  
  const renderServicesSection = (servicesData: any) => {
    if (activeTab !== 'services') return null;
    
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    const getServiceIcon = (iconName: string) => {
      switch(iconName) {
        case 'wedding': return <Heart size={24} />;
        case 'corporate': return <Briefcase size={24} />;
        case 'birthday': return <Cake size={24} />;
        case 'social': return <Users size={24} />;
        case 'conference': return <Users size={24} />;
        case 'concert': return <Music size={24} />;
        case 'festival': return <PartyPopper size={24} />;
        case 'graduation': return <Users size={24} />;
        default: return <Sparkles size={24} />;
      }
    };
    
    return (
      <div className="p-5">
        <MinimalSectionTitle title={t("Our Services")} colors={colors} font={font} />
        
        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div 
              key={index} 
              className="rounded-xl p-4" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}1A`
              }}
            >
              <div className="flex items-start">
                <div 
                  className="mr-4 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded" 
                  style={{ 
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}
                >
                  {getServiceIcon(service.icon)}
                </div>
                
                <div>
                  <h3 
                    className="mb-1 text-base font-semibold" 
                    style={{ 
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {service.title}
                  </h3>
                  
                  {service.description && (
                    <p 
                      className="text-sm leading-6" 
                      style={{ color: colors.text + 'B3', fontFamily: font }}
                    >
                      {service.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <Button
            className="mx-auto flex rounded px-5"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t("Schedule a Consultation")}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderPortfolioSection = (portfolioData: any) => {
    if (activeTab !== 'portfolio') return null;
    
    const events = portfolioData.events || [];
    if (!Array.isArray(events) || events.length === 0) return null;
    
    const getCategoryBadge = (category: string) => {
      const categories: Record<string, { bg: string, text: string }> = {
        'wedding': { bg: '#FFF0F5', text: '#D81B60' },
        'corporate': { bg: '#E8EAF6', text: '#3949AB' },
        'birthday': { bg: '#E0F7FA', text: '#00ACC1' },
        'social': { bg: '#F3E5F5', text: '#8E24AA' },
        'conference': { bg: '#E8F5E9', text: '#43A047' },
        'concert': { bg: '#FFF3E0', text: '#FB8C00' },
        'festival': { bg: '#E1F5FE', text: '#039BE5' },
        'graduation': { bg: '#EFEBE9', text: '#6D4C41' }
      };
      
      return categories[category] || { bg: colors.accent, text: colors.primary };
    };
    
    return (
      <div className="p-5">
        <MinimalSectionTitle
          title={t("Our Portfolio")}
          subtitle={t("A selection of memorable events we have brought to life")}
          colors={colors}
          font={font}
        />
        
        <div className="space-y-4">
          {events.map((event: any, index: number) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-xl" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}1A`
              }}
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                {event.image ? (
                  <img 
                    src={getImageDisplayUrl(event.image)} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center" 
                    style={{ backgroundColor: colors.accent }}
                  >
                    <PartyPopper size={32} style={{ color: colors.primary }} />
                  </div>
                )}
                
                {/* Category Badge */}
                {event.category && (
                  <div 
                    className="absolute top-3 right-3 rounded px-2.5 py-1 text-[11px] font-medium" 
                    style={{ 
                      backgroundColor: getCategoryBadge(event.category).bg,
                      color: getCategoryBadge(event.category).text
                    }}
                  >
                    {event.category.replace('_', ' ').charAt(0).toUpperCase() + event.category.replace('_', ' ').slice(1)}
                  </div>
                )}
              </div>
              
              {/* Event Details */}
              <div className="p-4">
                <h3 
                  className="mb-1 text-base font-semibold" 
                  style={{ 
                    color: colors.text,
                    fontFamily: font
                  }}
                >
                  {event.title}
                </h3>
                
                <div className="mb-2 flex items-center text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
                  {event.date && (
                    <div className="flex items-center mr-3">
                      <Calendar size={12} className="mr-1" />
                      {event.date}
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {event.location}
                    </div>
                  )}
                </div>
                
                {event.description && (
                  <p 
                    className="text-sm leading-6" 
                    style={{ color: colors.text + 'B3', fontFamily: font }}
                  >
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
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

    const formatVideoType = (videoType: string) => {
      if (!videoType) return '';
      return videoType
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (!videoContent || videoContent.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("Event Videos")} colors={colors} font={font} />
        
        <div className="space-y-4">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');

            return (
              <div 
                key={video.key} 
                className="overflow-hidden rounded" 
                style={{ 
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.primary}2E`,
                  boxShadow: `0 4px 14px ${colors.primary}0D`
                }}
              >
                <div className="relative">
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
                      className="relative w-full h-48 cursor-pointer"
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
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.32) 100%)' }}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40" style={{ backgroundColor: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)' }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="min-w-0">
                    <h4 className="mb-1 text-base font-semibold" style={{ color: colors.text, fontFamily: font }}>
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-sm leading-6" style={{ color: colors.text + 'B3', fontFamily: font }}>
                        {video.description}
                      </p>
                    )}
                  </div>

                  {(video.duration || video.video_type || videoUrl) && (
                    <div
                      className="mt-3 flex items-center justify-between gap-3 border-t pt-3"
                      style={{ borderColor: colors.borderColor }}
                    >
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.text + 'CC', fontFamily: font }}>
                        {video.duration && (
                          <span>
                            {t('Duration')}: {video.duration}
                          </span>
                        )}
                        {video.duration && video.video_type && (
                          <span style={{ color: colors.borderColor }}>|</span>
                        )}
                        {video.video_type && (
                          <span style={{ color: colors.primary }}>
                            {formatVideoType(video.video_type)}
                          </span>
                        )}
                      </div>

                      {videoUrl && (
                        <button
                          className="text-xs font-medium"
                          style={{ color: colors.primary, fontFamily: font }}
                          onClick={() => setPlayingKey(video.key)}
                        >
                          {t('Play Video')}
                        </button>
                      )}
                    </div>
                  )}
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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("YouTube Channel")} colors={colors} font={font} />
        
        {youtubeData.latest_video_embed && (
          <div
            className="mb-4 overflow-hidden rounded"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.primary}26`
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{ borderColor: colors.borderColor }}
            >
              <h4 className="font-semibold text-sm flex items-center" style={{ color: colors.text, fontFamily: font }}>
                <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                {t("Latest Video")}
              </h4>
              <span className="text-[11px]" style={{ color: colors.text + '99', fontFamily: font }}>
                {t("Featured")}
              </span>
            </div>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: "46%", height: 0 }}>
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
        
        <div
          className="rounded p-4"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.primary}26`
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded"
              style={{
                backgroundColor: '#FF0000'
              }}
            >
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-base" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || 'Event Planning Channel'}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="text-xs mt-1" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    📊 {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>
          
          {youtubeData.channel_description && (
            <p className="mt-4 text-sm leading-6" style={{ color: colors.text, fontFamily: font }}>
              {youtubeData.channel_description}
            </p>
          )}
          
          <div className="mt-4 flex gap-3">
            {youtubeData.channel_url && (
              <Button 
                size="sm" 
                className="flex-1 rounded" 
                style={{ 
                  backgroundColor: colors.primary, 
                  color: 'white',
                  fontFamily: font 
                }}
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
                className="flex-1 rounded" 
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font, backgroundColor: colors.background }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                🎉  {t("Event Highlights")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    if (activeTab !== 'contact') return null;
    
    return (
      <div className="p-5">
        <MinimalSectionTitle title={t("Contact Us")} colors={colors} font={font} />
        
        <div className="space-y-4 mb-6">
          {(contactData.phone || data.phone) && (
            <a 
              href={`tel:${contactData.phone || data.phone}`} 
              className="flex items-center rounded-xl p-3.5" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}1A`
              }}
            >
              <div 
                className="mr-3 flex h-10 w-10 items-center justify-center rounded" 
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <Phone size={18} />
              </div>
              <div>
                <p 
                  className="text-xs" 
                  style={{ color: colors.text + '80' }}
                >
                  {t("PHONE")}
                </p>
                <p 
                  className="text-sm font-medium" 
                  style={{ color: colors.text }}
                >
                  {contactData.phone || data.phone}
                </p>
              </div>
            </a>
          )}
          
          {(contactData.email || data.email) && (
            <a 
              href={`mailto:${contactData.email || data.email}`} 
              className="flex items-center rounded-xl p-3.5" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}1A`
              }}
            >
              <div 
                className="mr-3 flex h-10 w-10 items-center justify-center rounded" 
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <Mail size={18} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p 
                  className="text-xs" 
                  style={{ color: colors.text + '80' }}
                >
                  {t("EMAIL")}
                </p>
                <p 
                  className="text-sm font-medium truncate" 
                  style={{ color: colors.text }}
                >
                  {contactData.email || data.email}
                </p>
              </div>
            </a>
          )}
          
          {contactData.address && (
            <div 
              className="flex items-center rounded-xl p-3.5" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}1A`
              }}
            >
              <div 
                className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded" 
                style={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <p 
                  className="text-xs" 
                  style={{ color: colors.text + '80' }}
                >
                  {t("ADDRESS")}
                </p>
                <p 
                  className="text-sm" 
                  style={{ color: colors.text }}
                >
                  {contactData.address}
                </p>
                
                {configSections.google_map?.directions_url && (
                  <a 
                    href={configSections.google_map?.directions_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center mt-1"
                    style={{ color: colors.primary }}
                  >
                    {t("Get Directions")}
                    <ChevronRight size={12} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Button
            className="w-full rounded"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("Send a Message")}
          </Button>
          
          <Button
            className="w-full rounded"
            style={{ 
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
              border: `1px solid ${colors.primary}33`,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t("Schedule a Consultation")}
          </Button>
        </div>
        
        {/* Action Buttons Section - Only in Contact Tab */}
        {renderActionButtonsSection(configSections.action_buttons || {})}
      </div>
    );
  };
  
  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'portfolio':
        return renderPortfolioSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
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
  
  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("Client Testimonials")} colors={colors} font={font} />
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="rounded-xl p-5" 
                    style={{ 
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.primary}1F`,
                      boxShadow: `0 6px 18px ${colors.primary}0D`
                    }}
                  >
                    <div className="mb-3 flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < parseInt(review.rating || 5) ? colors.primary : 'transparent'} 
                          stroke={i < parseInt(review.rating || 5) ? colors.primary : colors.borderColor}
                        />
                      ))}
                    </div>
                    
                    <p 
                      className="mb-4 text-sm leading-7 italic" 
                      style={{ color: colors.text }}
                    >
                      "{review.review}"
                    </p>
                    
                    <div className="flex items-end justify-between gap-3 border-t pt-3" style={{ borderColor: colors.borderColor }}>
                      <p 
                        className="text-sm font-semibold" 
                        style={{ color: colors.primary, fontFamily: font }}
                      >
                        {review.client_name}
                      </p>
                      
                      <div className="flex flex-col items-end text-right">
                        {review.event_type && (
                          <span 
                            className="text-xs" 
                            style={{ color: colors.primary }}
                          >
                            {review.event_type}
                          </span>
                        )}
                        
                        {review.event_date && (
                          <span 
                            className="text-xs" 
                            style={{ color: colors.text + '80' }}
                          >
                            {review.event_date}
                          </span>
                        )}
                      </div>
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
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    
    // Get unique categories
    const categories = ['all', ...new Set(photos.map((photo: any) => photo.category).filter(Boolean))];
    
    // Filter photos by active category
    const filteredPhotos = activeEvent === null || activeEvent === 0 
      ? photos 
      : photos.filter((photo: any) => photo.category === categories[activeEvent]);
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("Photo Gallery")} colors={colors} font={font} />
        
        {/* Category filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {categories.map((category: string, index: number) => (
              <button
                key={category}
                className="px-3 py-1.5 text-xs capitalize rounded transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: activeEvent === index ? colors.primary + '12' : colors.background,
                  color: activeEvent === index ? colors.primary : colors.text,
                  border: `1px solid ${activeEvent === index ? colors.primary + '40' : colors.borderColor}`
                }}
                onClick={() => setActiveEvent(activeEvent === index ? 0 : index)}
              >
                {category === 'all' ? 'All' : category.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {filteredPhotos.map((photo: any, index: number) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl aspect-[0.9] shadow-sm" 
              style={{ 
                border: `1px solid ${colors.primary}1F`,
                backgroundColor: colors.cardBg
              }}
            >
              {photo.image ? (
                <img 
                  src={getImageDisplayUrl(photo.image)} 
                  alt={photo.caption || `Gallery image ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <PartyPopper size={24} style={{ color: colors.primary }} />
                </div>
              )}
              
              {photo.caption && (
                <div 
                  className="absolute inset-x-0 bottom-0 p-3 text-xs"
                  style={{ 
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.88) 100%)',
                    color: '#FFFFFF'
                  }}
                >
                  <span
                    className="block font-medium leading-5"
                    style={{ fontFamily: font, textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}
                  >
                    {photo.caption}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData.booking_url) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="rounded-xl p-5 text-center"
          style={{
            background: `linear-gradient(180deg, ${colors.primary}10 0%, ${colors.primary}1A 100%)`,
            border: `1px solid ${colors.primary}26`
          }}
        >
          <h2 
            className="text-xl font-bold mb-3" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {appointmentsData.section_title || 'Ready to Plan Your Event?'}
          </h2>
          
          <p 
            className="mb-5 text-sm leading-6" 
            style={{ color: colors.text }}
          >
            {appointmentsData.section_description || 'Let\'s discuss your vision and create an unforgettable experience together.'}
          </p>
          
          <div className="flex flex-col gap-3">
            <Button
              className="w-full rounded"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font,
                fontWeight: 'bold',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {appointmentsData.booking_text || 'Schedule Consultation'}
            </Button>
            
            <Button
              className="w-full rounded"
              style={{ 
                backgroundColor: colors.background,
                color: colors.primary,
                border: `1px solid ${colors.primary}33`,
                fontFamily: font,
                fontWeight: 'bold',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {appointmentsData.consultation_text || 'Free Consultation'}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    
    const getSocialIcon = (platform: string) => {
      switch(platform) {
        case 'instagram': return <Instagram size={16} />;
        case 'facebook': return <Facebook size={16} />;
        case 'pinterest': return <Star size={16} />;
        case 'tiktok': return <Music size={16} />;
        case 'youtube': return <Star size={16} />;
        case 'linkedin': return <Briefcase size={16} />;
        default: return <Globe size={16} />;
      }
    };
    
    return (
      <div 
        className="px-5 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center shadow-sm transition-transform hover:scale-105"
              style={{ 
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                borderRadius: '30% 70% 65% 35% / 35% 35% 65% 65%'
              }}
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </div>
      </div>
    );
  };
  
  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.primary}08 100%)`,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("Office Hours")} colors={colors} font={font} />
        
        <div
          className="overflow-hidden rounded-xl"
          style={{
            border: `1px solid ${colors.borderColor}`,
            backgroundColor: colors.background
          }}
        >
          {hours.map((hour: any, index: number) => (
            <div 
              key={index} 
              className="flex items-center justify-between px-4 py-3" 
              style={{ 
                backgroundColor: colors.background,
                borderBottom: index !== hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
              }}
            >
              <span 
                className="capitalize font-medium text-sm" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {t(hour.day)}
              </span>
              <span 
                className="text-sm font-medium" 
                style={{ 
                  color: hour.is_closed ? colors.text + '80' : colors.primary,
                  fontFamily: font
                }}
              >
                {hour.is_closed ? 'Closed' : (hour.by_appointment ? 'By Appointment' : `${hour.open_time} - ${hour.close_time}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.accent,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("Our Location")} colors={colors} font={font} />
        
        <div className="space-y-4">
          {locationData.map_embed_url && (
            <EventPlannerMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <Button 
              className="w-full"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={t("Download Our App")} colors={colors} font={font} />
        
        {appData.app_description && (
          <p 
            className="text-sm mb-4 text-center" 
            style={{ color: colors.text }}
          >
            {appData.app_description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <Button 
              variant="outline" 
              style={{ 
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("App Store")}
            </Button>
          )}
          
          {appData.play_store_url && (
            <Button 
              variant="outline" 
              style={{ 
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("Play Store")}
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="rounded-xl p-5 text-center"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.primary}1A`
          }}
        >
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {formData.form_title}
          </h2>
          
          {formData.form_description && (
            <p 
              className="mx-auto mt-3 max-w-md text-sm leading-6" 
              style={{ color: colors.text + 'CC', fontFamily: font }}
            >
              {formData.form_description}
            </p>
          )}
          
          <Button 
            className="mt-4 rounded px-5 py-2"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("Contact Us")}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div
        className="px-5 py-6"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="rounded-2xl px-5 py-5 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.secondary}18 100%)`,
            border: `1px solid ${colors.primary}18`
          }}
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles size={14} style={{ color: colors.primary }} />
            <div className="h-px w-12" style={{ backgroundColor: `${colors.primary}35` }} />
            <PartyPopper size={14} style={{ color: colors.primary }} />
            <div className="h-px w-12" style={{ backgroundColor: `${colors.primary}35` }} />
            <Sparkles size={14} style={{ color: colors.primary }} />
          </div>
          <p
            className="text-sm leading-7"
            style={{ color: colors.text, fontFamily: font }}
          >
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };
  
  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <MinimalSectionTitle title={customHtmlData.section_title} colors={colors} font={font} />
        )}
        <div 
          className="custom-html-content p-4 rounded-lg" 
          style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
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
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.accent,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <MinimalSectionTitle title={qrData.qr_title || t('Share Our Services')} colors={colors} font={font} />
        
        <div 
          className="text-center p-4 rounded-lg" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {qrData.qr_description && (
            <p 
              className="text-sm mb-3" 
              style={{ color: colors.text }}
            >
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            className="w-full" 
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("Share QR Code")}
          </Button>
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
      <div
        className="mt-6 rounded-xl p-3"
        style={{
          backgroundColor: colors.cardBg || colors.background,
          border: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-3 text-center">
          <p
            className="text-xs font-medium"
            style={{ color: colors.text + '99', fontFamily: font }}
          >
            {t('Quick Actions')}
          </p>
        </div>

        <div className="space-y-2.5">
        {hasContactButton && (
          <Button
            className="w-full rounded"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font,
              boxShadow: `0 6px 18px ${colors.primary}18`
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full rounded"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
              border: `1px solid ${colors.primary}33`,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.appointment_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            variant="outline"
            className="w-full rounded"
            style={{
              borderColor: colors.borderColor,
              backgroundColor: colors.background,
              color: colors.primary,
              fontFamily: font
            }}
            onClick={() => {
              const headerData = configSections.header || {};
              const contactData = configSections.contact || {};
              const vcfData = {
                name: headerData.name || data.name || '',
                title: headerData.tagline || '',
                email: contactData.email || data.email || '',
                phone: contactData.phone || data.phone || '',
                website: contactData.website || data.website || '',
                location: contactData.address || ''
              };
              import('@/utils/vcfGenerator').then(module => {
                module.downloadVCF(vcfData);
              });
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
        </div>
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;
    
    return (
      <div 
        className="px-5 py-4" 
        style={{ backgroundColor: colors.background }}
      >
        <p 
          className="text-xs text-center" 
          style={{ color: colors.text + '80' }}
        >
          {copyrightData.text}
        </p>
      </div>
    );
  };

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(
    data.template_config || { sections: configSections, sectionSettings: configSections },
    allSections
  );
  
  return (
    <div 
      className="w-full rounded-2xl overflow-hidden" 
      style={{ 
        fontFamily: font,
        background: colors.background,
        color: colors.text,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}

      {renderSection('copyright')}
      
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
