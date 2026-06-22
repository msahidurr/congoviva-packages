import { handleAppointmentBooking } from '../VCardPreview';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { useTranslation } from 'react-i18next';
import { sanitizeText, sanitizeUrl } from '@/utils/sanitizeHtml';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Instagram, 
  Facebook, 
  Clock, 
  Calendar, 
  Scissors, 
  Star, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  User,
  Users,
  Image,
  Gift,
  MessageSquare,
  Heart,
  Video,
  Play,
  Youtube,
  Share2,
  QrCode,
  PhoneCall
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface SalonTemplateProps {
  data: any;
  template: any;
}

const SalonMapEmbed = React.memo(function SalonMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="w-full h-40 rounded-lg overflow-hidden" style={{ border: `1px solid #EEEEEE` }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function SalonTemplate({ data, template }: SalonTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('services');
  const [expandedService, setExpandedService] = useState<string | null>(null);
  
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
  const colors = data.colors || configSections.colors || template?.defaultColors || { 
    primary: '#DB7093', 
    secondary: '#E8B4B8', 
    accent: '#FFF0F5', 
    background: '#FFFFFF', 
    text: '#333333',
    cardBg: '#FAFAFA',
    borderColor: '#F0F0F0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFD700'
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
  const allSections = getBusinessTemplate('salon')?.sections || [];
  
  // Process video content at component level to avoid Rules of Hooks violation
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
      case 'specialists':
        return renderSpecialistsSection(sectionData);
      case 'promotions':
        return renderPromotionsSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
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
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative">
      {/* Background Image */}
      <div className="relative h-64 overflow-hidden rounded-t-2xl">
        {headerData.background_image ? (
          <>
            <img 
              src={getImageDisplayUrl(headerData.background_image)} 
              alt="Background" 
              className="w-full h-full object-cover opacity-60"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${colors.primary}22, ${colors.primary}55)`
              }}
            />
          </>
        ) : (
          <div 
            className="w-full h-full" 
            style={{ 
              background: `linear-gradient(to right, ${colors.primary}80, ${colors.secondary}80)`,
              backgroundSize: 'cover'
            }}
          ></div>
        )}
        
        {/* Language Selector - Salon themed */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center justify-center transition-all cursor-pointer"
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.primary
                }}
              >
                <span className="text-2xl">{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || []))}</span>
              </button>
              
              {showLanguageSelector && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border py-2 min-w-[150px] max-h-48 overflow-y-auto z-[999999]" style={{ borderColor: colors.borderColor }}>
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center space-x-2 cursor-pointer ${
                        currentLanguage === lang.code ? 'font-medium' : ''
                      }`}
                      style={{
                        backgroundColor: currentLanguage === lang.code ? colors.accent : 'transparent',
                        color: currentLanguage === lang.code ? colors.primary : colors.text
                      }}
                    >
                      <span className="text-base">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                      <span>{lang.name}</span>
                      {currentLanguage === lang.code && <Heart size={12} style={{ color: colors.primary }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          <div className="flex flex-col items-center">
            {headerData.logo && (
              <img 
                src={getImageDisplayUrl(headerData.logo)} 
                alt={headerData.name || data.name || t('Salon Logo')} 
                className="mb-3 h-24 w-24 rounded-full object-cover"
              />
            )}

            <div 
              className={`${headerData.logo ? 'text-2xl' : 'text-3xl'} font-bold leading-tight`} 
              style={{ 
                color: '#FFFFFF',
                fontFamily: font
              }}
            >
              {(headerData.name || data.name || t('Serenity Salon & Spa'))}
            </div>

            {(headerData.title || data.title) && (
              <div
                className="mt-2 text-sm font-semibold uppercase tracking-[0.28em]"
                style={{ color: '#FFFFFF', opacity: 0.95, fontFamily: font }}
              >
                {headerData.title || data.title}
              </div>
            )}
          </div>
          
          {headerData.tagline && (
            <p 
              className="mt-2 text-sm font-bold italic" 
              style={{ color: '#FFFFFF' }}
            >
              {headerData.tagline}
            </p>
          )}
          
          <Button
            className="mt-4"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t('Book Now')}
          </Button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div 
        className="flex overflow-x-auto py-3 px-2 hide-scrollbar" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <TabButton 
          label={t('Services')} 
          active={activeTab === 'services'} 
          onClick={() => setActiveTab('services')} 
          colors={colors}
          font={font}
        />
        <TabButton 
          label={t('Team')} 
          active={activeTab === 'team'} 
          onClick={() => setActiveTab('team')} 
          colors={colors}
          font={font}
        />
        <TabButton 
          label={t('Gallery')} 
          active={activeTab === 'gallery'} 
          onClick={() => setActiveTab('gallery')} 
          colors={colors}
          font={font}
        />
        <TabButton 
          label={t('Info')} 
          active={activeTab === 'info'} 
          onClick={() => setActiveTab('info')} 
          colors={colors}
          font={font}
        />
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
      className={`px-4 py-1 mx-1 text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer`}
      style={{ 
        color: active ? colors.primary : colors.text,
        borderBottom: active ? `2px solid ${colors.primary}` : 'none',
        fontFamily: font
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    if (activeTab !== 'info') return null;
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${colors.primary}12`,
                color: colors.primary,
              }}
            >
              <Heart size={15} />
            </div>
            <h2 
              className="text-[16px] font-semibold" 
              style={{ 
                color: colors.text,
                fontFamily: font
              }}
            >
              {t('About Us')}
            </h2>
          </div>
          
          <p 
            className="text-[14px] leading-6 mb-4" 
            style={{ color: colors.text + 'D9', fontFamily: font }}
          >
            {aboutData.description || data.description}
          </p>
          
          {(aboutData.year_established || aboutData.specialists_count) && (
            <div
              className="mt-4 pt-3 flex flex-wrap items-center gap-2.5"
              style={{ borderTop: `1px solid ${colors.primary}18` }}
            >
              {aboutData.year_established && (
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor: `${colors.primary}12`,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.14em] uppercase font-medium"
                    style={{ color: colors.text + 'B3' }}
                  >
                    {t('Established')}:
                  </span>
                  <span
                    className="text-[12px] font-semibold leading-none"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {aboutData.year_established}
                  </span>
                </div>
              )}
              
              {aboutData.specialists_count && (
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                  style={{
                    backgroundColor: `${colors.primary}12`,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.14em] uppercase font-medium"
                    style={{ color: colors.text + 'B3' }}
                  >
                    {t('Specialists')}:
                  </span>
                  <span
                    className="text-[12px] font-semibold leading-none"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {aboutData.specialists_count}
                  </span>
                </div>
              )}
            </div>
          )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    if (activeTab !== 'services') return null;
    
    // Group services by category
    const categories: Record<string, any[]> = {};
    services.forEach(service => {
      const category = service.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(service);
    });
    
    const getCategoryLabel = (category: string) => {
      const labels: Record<string, string> = {
        'hair': t('Hair Services'),
        'nails': t('Nail Services'),
        'facial': t('Facial Treatments'),
        'massage': t('Massage Therapy'),
        'makeup': t('Makeup Services'),
        'spa': t('Spa Treatments'),
        'waxing': t('Waxing Services'),
        'other': t('Other Services')
      };
      return labels[category] || t('Services');
    };
    
    const getCategoryIcon = (category: string) => {
      switch(category) {
        case 'hair': return <Scissors size={16} />;
        case 'nails': return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76z"></path>
            <line x1="16" y1="8" x2="2" y2="22"></line>
            <line x1="17.5" y1="15" x2="9" y2="15"></line>
          </svg>
        );
        case 'facial': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>;
        case 'massage': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"></path><path d="M4 6h16"></path><path d="M4 18h16"></path></svg>;
        case 'makeup': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"></path><path d="M21 3v3a2 2 0 0 0 2 2h3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21v-3a2 2 0 0 1 2-2h3"></path></svg>;
        case 'spa': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9z"></path><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z"></path></svg>;
        case 'waxing': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path><path d="M2 20h20"></path></svg>;
        default: return <Scissors size={16} />;
      }
    };

    const categoryKeys = Object.keys(categories);
    
    return (
      <div 
        className="px-4 py-3" 
        style={{ backgroundColor: colors.background }}
      >
        {categoryKeys.map((category, categoryIndex) => (
          <div 
            key={category} 
            className="mb-5 last:mb-0"
            style={{ 
              paddingBottom: categoryIndex < categoryKeys.length - 1 ? '20px' : '0',
              borderBottom: categoryIndex < categoryKeys.length - 1 ? `1px solid ${colors.primary}30` : 'none'
            }}
          >
            <div 
              className="flex items-center gap-2 mb-3"
              style={{ color: colors.text }}
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ 
                  color: colors.primary
                }}
              >
                {getCategoryIcon(category)}
              </div>
              <h3 
                className="text-[15px] font-semibold" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {getCategoryLabel(category)}
              </h3>
            </div>
            
            <div className="space-y-2.5">
              {categories[category].map((service, idx) => {
                const serviceKey = `${category}-${idx}`;
                const isExpanded = expandedService === serviceKey;

                return (
                <div 
                  key={serviceKey} 
                  className="overflow-hidden"
                  style={{ 
                    marginBottom: idx < categories[category].length - 1 ? '10px' : '0'
                  }}
                >
                  <div
                    className="overflow-hidden rounded-xl"
                    style={{ 
                      backgroundColor: '#FBFBFB',
                      border: `1px solid ${colors.primary}40`,
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}
                  >
                    <div 
                      className="px-3.5 py-3 flex justify-between items-center gap-3 cursor-pointer transition-all"
                      onClick={() => setExpandedService(isExpanded ? null : serviceKey)}
                    >
                      <div className="min-w-0 flex-1">
                        <h4 
                          className="text-[15px] font-medium leading-5" 
                          style={{ 
                            color: colors.text,
                            fontFamily: font
                          }}
                        >
                          {service.title}
                        </h4>
                        
                        {service.duration && (
                          <p 
                            className="text-[11px] mt-1" 
                            style={{ color: colors.text + '80' }}
                          >
                            {service.duration}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <span 
                          className="text-[14px] font-semibold whitespace-nowrap" 
                          style={{ 
                            color: colors.primary
                          }}
                        >
                          {service.price}
                        </span>
                        
                        {isExpanded ? (
                          <ChevronUp size={14} style={{ color: colors.primary }} />
                        ) : (
                          <ChevronDown size={14} style={{ color: colors.primary }} />
                        )}
                      </div>
                    </div>
                    
                    {isExpanded && service.description && (
                      <div 
                        className="px-3.5 pb-3 pt-0 border-t" 
                        style={{ borderColor: colors.borderColor }}
                      >
                        <p 
                          className="text-[12px] leading-5 pt-2.5" 
                          style={{ color: colors.text + 'CC' }}
                        >
                          {service.description}
                        </p>
                        
                        <Button
                          size="sm"
                          className="mt-2 text-[11px] h-7 rounded-full px-3.5"
                          style={{ 
                            backgroundColor: colors.primary,
                            color: colors.buttonText,
                            fontFamily: font
                           }}
                          onClick={() => handleAppointmentBooking(configSections.appointments)}
                        >
                         {t('Book This Service')}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {idx < categories[category].length - 1 && (
                    <div 
                      className="mt-2 h-px w-full"
                      style={{ backgroundColor: colors.borderColor }}
                    ></div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSpecialistsSection = (specialistsData: any) => {
    const specialists = specialistsData.team || [];
    if (!Array.isArray(specialists) || specialists.length === 0) return null;
    if (activeTab !== 'team') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Users size={15} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Our Team')}
          </h2>
        </div>
        
        <div className="space-y-3">
          {specialists.map((specialist: any, index: number) => (
            <div 
              key={index} 
              className="rounded-xl overflow-hidden" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}30`,
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div className="flex p-3 gap-3">
                <div 
                  className="w-24 h-24 rounded-xl overflow-hidden shrink-0"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  {specialist.image ? (
                    <img 
                      src={getImageDisplayUrl(specialist.image)} 
                      alt={specialist.name} 
                      className="w-full h-full object-cover"
            />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={32} style={{ color: colors.primary }} />
                    </div>
                  )}
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 
                    className="text-[15px] font-semibold leading-5" 
                    style={{ 
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {specialist.name}
                  </h3>
                  
                  <p 
                    className="text-[13px] mt-1 mb-2" 
                    style={{ color: colors.primary }}
                  >
                    {specialist.title}
                  </p>
                  
                  {specialist.specialties && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {specialist.specialties.split(',').map((specialty: string, i: number) => (
                        <Badge 
                          key={i} 
                          className="rounded-full px-2 py-0.5 text-[11px] font-medium shadow-none" 
                          style={{ 
                            backgroundColor: `${colors.primary}10`,
                            border: `1px solid ${colors.primary}20`,
                            color: colors.primary
                          }}
                        >
                          {specialty.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    className="text-[11px] h-7 mt-1 rounded-full px-3.5"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.buttonText,
                      fontFamily: font
                    }}
                    onClick={() => handleAppointmentBooking(configSections.appointments)}
                  >
                    {t('Book with')} {specialist.name.split(' ')[0]}
                  </Button>
                </div>
              </div>
              
              {specialist.bio && (
                <div 
                  className="px-3 pb-3 pt-3 text-[13px]" 
                  style={{ 
                    borderTop: `1px solid ${colors.primary}30`,
                    color: colors.text + 'CC'
                  }}
                >
                  {specialist.bio}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPromotionsSection = (promotionsData: any) => {
    const promotions = promotionsData.offers || [];
    if (!Array.isArray(promotions) || promotions.length === 0) return null;
    
    return (
      <div 
        className="px-3 py-3" 
        style={{ 
          backgroundColor: colors.accent,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Gift size={14} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Special Offers')}
          </h2>
        </div>
        
        <div className="space-y-2">
          {promotions.map((promo: any, index: number) => (
            <div 
              key={index} 
              className="rounded-xl border p-3.5" 
              style={{ 
                backgroundColor: colors.background,
                borderColor: `${colors.primary}40`,
                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 
                    className="text-[14px] font-semibold leading-5" 
                    style={{ 
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {promo.title}
                  </h3>

                  {promo.description && (
                    <p 
                      className="mt-1.5 text-[12px] leading-5" 
                      style={{ color: colors.text + 'B3' }}
                    >
                      {promo.description}
                    </p>
                  )}
                </div>
                
                <Badge 
                  className="shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold shadow-none" 
                  style={{ 
                    color: colors.primary,
                    backgroundColor: `${colors.primary}10`,
                    border: `1px solid ${colors.primary}20`
                  }}
                >
                  {promo.discount}
                </Badge>
              </div>

              {(promo.valid_until || promo.code) && (
                <div
                  className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3"
                  style={{ borderColor: colors.borderColor }}
                >
                  {promo.valid_until && (
                    <div 
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]" 
                      style={{ 
                        backgroundColor: colors.cardBg,
                        color: colors.text + '99'
                      }}
                    >
                      <Calendar size={11} style={{ color: colors.primary }} />
                      <span>{t('Valid until:')}</span>
                      <span style={{ color: colors.text, fontWeight: 500 }}>{promo.valid_until}</span>
                    </div>
                  )}
                  
                  {promo.code && (
                    <div 
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
                      style={{ 
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary,
                        border: `1px solid ${colors.primary}20`
                      }}
                    >
                      <Gift size={11} />
                      <span>{t('Code')}:</span>
                      <span style={{ fontWeight: 600 }}>{promo.code}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    if (activeTab !== 'info') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${colors.primary}12`,
                color: colors.primary,
              }}
            >
              <PhoneCall size={15} />
            </div>
            <h2 
              className="text-[16px] font-semibold" 
              style={{ 
                color: colors.text,
                fontFamily: font
              }}
            >
              {t('Contact Us')}
            </h2>
          </div>
        
          <div className="space-y-3">
          {contactData.address && (
            <div 
              className="rounded-xl p-3" 
              style={{ 
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.primary}18`
              }}
            >
              <div className="flex gap-2.5">
                <MapPin 
                  size={16} 
                  className="flex-shrink-0 mt-0.5" 
                  style={{ color: colors.primary }}
                />
                <div>
                  <p 
                    className="text-[10px] font-semibold uppercase mb-1" 
                    style={{ color: colors.text + '85' }}
                  >
                    {t('ADDRESS')}
                  </p>
                  <p 
                    className="text-[13px] leading-5" 
                    style={{ color: colors.text, fontFamily: font }}
                  >
                    {contactData.address}
                  </p>
                  
                  {configSections.google_map?.directions_url && (
                    <a 
                      href={configSections.google_map?.directions_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] inline-flex items-center mt-2"
                      style={{ color: colors.primary, fontFamily: font }}
                    >
                      {t('Get Directions')}
                      <ChevronRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {(contactData.phone || data.phone) && (
              <div 
                className="rounded-xl p-3" 
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.primary}18`
                }}
              >
                <div className="flex gap-2.5">
                  <Phone 
                    size={16} 
                    className="flex-shrink-0" 
                    style={{ color: colors.primary }}
                  />
                  <div>
                    <p 
                      className="text-[10px] tracking-[0.12em] font-semibold uppercase mb-1" 
                      style={{ color: colors.text + '85' }}
                    >
                      {t('PHONE')}
                    </p>
                    <a 
                      href={`tel:${contactData.phone || data.phone}`} 
                      className="text-[13px] break-words" 
                      style={{ color: colors.primary, fontFamily: font }}
                    >
                      {contactData.phone || data.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {(contactData.email || data.email) && (
              <div 
                className="rounded-xl p-3" 
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.primary}18`
                }}
              >
                <div className="flex gap-2.5">
                  <Mail 
                    size={16} 
                    className="flex-shrink-0" 
                    style={{ color: colors.primary }}
                  />
                  <div>
                    <p 
                      className="text-[10px] tracking-[0.12em] font-semibold uppercase mb-1" 
                      style={{ color: colors.text + '85' }}
                    >
                      {t('EMAIL')}
                    </p>
                    <a 
                      href={`mailto:${contactData.email || data.email}`} 
                      className="text-[13px] break-all block" 
                      style={{ color: colors.primary, fontFamily: font }}
                    >
                      {contactData.email || data.email}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    if (activeTab !== 'info') return null;
    

    
    return (
      <div 
        className="px-5 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Instagram size={15} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Follow Us')}
          </h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center text-center"
              style={{ color: colors.primary }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center transition-all duration-300 group-hover:-translate-y-1"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  border: `1px solid ${colors.primary}24`,
                  borderRadius: '14px 14px 4px 4px',
                  boxShadow: `0 6px 14px ${colors.primary}12`
                }}
              >
                <SocialIcon platform={link.platform} color={colors.primary} />
              </div>
              <div
                className="mt-1 h-[3px] w-8 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    if (activeTab !== 'info') return null;
    
    // Get current day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    
    // Find current day's hours
    const todayHours = hours.find(h => h.day === currentDay);
    const isOpenNow = todayHours && !todayHours.is_closed;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div 
          className="rounded-xl border overflow-hidden" 
          style={{ 
            backgroundColor: colors.background,
            borderColor: `${colors.primary}24`,
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div className="flex items-center justify-between px-3.5 py-3 border-b" style={{ borderColor: colors.borderColor }}>
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${colors.primary}12`,
                  color: colors.primary,
                }}
              >
                <Clock size={15} />
              </div>
              <div>
                <h2 
                  className="text-[16px] font-semibold" 
                  style={{ 
                    color: colors.text,
                    fontFamily: font
                  }}
                >
                  {t('Salon Hours')}
                </h2>
               
              </div>
            </div>
            
            <Badge 
              className="rounded-full px-2.5 py-1 text-[11px] font-medium shadow-none"
              style={{ 
                backgroundColor: isOpenNow ? colors.primary : '#F44336',
                color: '#FFFFFF'
              }}
            >
              {isOpenNow ? t('Open Now') : t('Closed Now')}
            </Badge>
          </div>

          <div className="p-2">
            {hours.map((hour: any, index: number) => {
              const isToday = hour.day === currentDay;

              return (
                <div 
                  key={index} 
                  className="flex justify-between items-center rounded-lg px-3 py-2.5"
                  style={{ 
                    backgroundColor: isToday ? colors.accent : 'transparent',
                    borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
                  }}
                >
                  <span 
                    className="capitalize text-[14px] font-medium" 
                    style={{ 
                      color: isToday ? colors.primary : colors.text,
                      fontWeight: isToday ? 600 : 500,
                      fontFamily: font
                    }}
                  >
                   {t(hour.day)}
                  </span>
                  <span 
                    className="text-[14px]" 
                    style={{ 
                      color: hour.is_closed ? colors.text + '80' : colors.text,
                      fontFamily: font
                    }}
                  >
                    {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                  </span>
                </div>
              );
            })}
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

    const getVideoTypeLabel = (videoType: string) => {
      const labels: Record<string, string> = {
        transformation: t('Hair Transformation'),
        tutorial: t('Beauty Tutorial'),
        salon_tour: t('Salon Tour'),
      };

      return labels[videoType] || videoType.replace(/_/g, ' ');
    };

    if (!Array.isArray(videoContent) || videoContent.length === 0) return null;
    if (activeTab !== 'gallery') return null;
    
    return (
      <div 
        className="px-4 py-3" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Video size={14} />
          </div>
          <h3 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Beauty Tutorials')}
          </h3>
        </div>
        
        <div className="space-y-2.5">
          {videoContent.map((video: any) => (
            <div 
              key={video.key} 
              className="rounded-xl overflow-hidden" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}30`,
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div>
                {(() => {
                  const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
                  const thumbUrl = video.thumbnail
                    ? getImageDisplayUrl(video.thumbnail)
                    : getYouTubeThumbnail(video.embed_url || '');
                  return playingKey === video.key && videoUrl ? (
                    <div className="relative w-full overflow-hidden" style={{ paddingBottom: '50%', height: 0 }}>
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
                      className="relative w-full h-40 cursor-pointer"
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
                          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 18px ${colors.primary}55` }}>
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <div className="min-w-0 p-3.5 border-t" style={{ borderColor: colors.borderColor }}>
                  <h4 className="font-medium text-[15px] leading-6 mb-1.5" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-[13px] leading-5 mb-2.5 line-clamp-2" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {video.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {video.duration && (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}>
                      <Clock size={11} style={{ color: colors.primary }} />
                      {video.duration}
                      </span>
                  )}
                  {video.video_type && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}>
                      {getVideoTypeLabel(video.video_type)}
                    </span>
                  )}
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    if (activeTab !== 'gallery') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Youtube size={14} />
          </div>
          <h3 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('YouTube Channel')}
          </h3>
        </div>
        
        <div 
          className="rounded-xl border overflow-hidden" 
          style={{ 
            backgroundColor: colors.background,
            borderColor: `${colors.primary}30`,
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div className="p-3 border-b" style={{ borderColor: colors.borderColor }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FF0000' }}>
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-[15px]" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || t('Beauty Channel')}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-[12px]" style={{ color: colors.text + 'B3', fontFamily: font }}>
                    {youtubeData.subscriber_count} {t("subscribers")}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {youtubeData.channel_description && (
            <div className="px-3 pt-2.5">
              <p className="text-[13px]" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            </div>
          )}

          {youtubeData.latest_video_embed && (
            <div className="p-3">
              <div className="rounded-xl overflow-hidden border" style={{ backgroundColor: colors.cardBg, borderColor: colors.borderColor }}>
                <div className="px-3 py-2 border-b" style={{ borderColor: colors.borderColor }}>
                  <h4 className="font-semibold text-[13px] flex items-center gap-2" style={{ color: colors.text, fontFamily: font }}>
                    <Play className="w-4 h-4" style={{ color: colors.primary }} />
                    {t("Latest Video")}
                  </h4>
                </div>
                <div className="w-full relative overflow-hidden" style={{ paddingBottom: "56.25%", height: 0 }}>
                  <div 
                    className="absolute inset-0 w-full h-full scale-[0.96] origin-center"
                    ref={createYouTubeEmbedRef(
                      youtubeData.latest_video_embed,
                      { colors, font },
                      "Latest Video"
                    )}
                  />
                </div>
              </div>
            </div>
          )}
          
          <div className="p-3 pt-0 space-y-1.5">
            {youtubeData.channel_url && (
              <Button 
                className="w-full h-9 rounded-lg text-[13px]" 
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.buttonText,
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
                variant="outline" 
                className="w-full h-9 rounded-lg text-[13px]" 
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                ✨ {t('BEAUTY TUTORIALS')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    if (activeTab !== 'gallery') return null;
    
    // Group photos by category
    const categories: Record<string, any[]> = {};
    photos.forEach(photo => {
      const category = photo.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(photo);
    });
    
    const getCategoryLabel = (category: string) => {
      const labels: Record<string, string> = {
        'salon': t('Our Salon'),
        'work': t('Our Work'),
        'products': t('Products'),
        'team': t('Our Team'),
        'other': t('Gallery')
      };
      return labels[category] || t('Gallery');
    };
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ backgroundColor: colors.background }}
      >
        {Object.keys(categories).map((category, index) => (
          <div 
            key={category} 
            className="mb-5 last:mb-0"
            style={{ 
              borderBottom: index < Object.keys(categories).length - 1 ? `1px solid ${colors.primary}22` : 'none',
              paddingBottom: index < Object.keys(categories).length - 1 ? '20px' : '0'
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${colors.primary}12`,
                  color: colors.primary,
                }}
              >
                <Image size={14} />
              </div>
              <h3 
                className="text-[16px] font-semibold" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {getCategoryLabel(category)}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              {categories[category].map((photo: any, idx: number) => (
                <div 
                  key={idx} 
                  className="group overflow-hidden rounded-xl"
                  style={{ 
                    border: `1px solid ${colors.primary}22`,
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                    backgroundColor: colors.cardBg
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {photo.image ? (
                      <img 
                        src={getImageDisplayUrl(photo.image)} 
                        alt={photo.caption || `Gallery image ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: colors.cardBg }}
                      >
                        <Scissors size={24} style={{ color: colors.primary }} />
                      </div>
                    )}
                  </div>

                  {photo.caption && (
                    <div
                      className="px-2.5 py-2 text-[11px] leading-4 min-h-[44px]"
                      style={{
                        color: colors.text,
                        backgroundColor: colors.background,
                        borderTop: `1px solid ${colors.borderColor}`
                      }}
                    >
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    if (activeTab !== 'info') return null;
    

    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.accent,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <Star size={15} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Client Reviews')}
          </h2>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="rounded-xl p-4" 
                    style={{ 
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.primary}24`
                    }}
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          fill={i < parseInt(review.rating || 5) ? colors.highlightColor : 'transparent'} 
                          stroke={i < parseInt(review.rating || 5) ? colors.highlightColor : colors.borderColor}
                        />
                      ))}
                      
                      {review.service_received && (
                        <Badge 
                          className="ml-2 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-none" 
                          style={{ 
                            backgroundColor: `${colors.primary}12`,
                            color: colors.primary
                          }}
                        >
                          {review.service_received}
                        </Badge>
                      )}
                    </div>
                    
                    <p 
                      className="text-[15px] leading-7 italic mb-3" 
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>
                    
                    <div className="flex items-center pt-3" style={{ borderTop: `1px solid ${colors.primary}14` }}>
                      <p 
                        className="text-[13px] font-medium" 
                        style={{ color: colors.primary, fontFamily: font }}
                      >
                        {review.client_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 cursor-pointer">
              {testimonialsData.reviews.map((_, dotIndex) => (
                <Heart
                  key={dotIndex}
                  size={12}
                  fill={currentReview === dotIndex ? colors.primary : 'transparent'}
                  stroke={colors.primary}
                  className="transition-all duration-300"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData.booking_url) return null;
    
    return (
      <div 
        className="px-3 py-2.5" 
        style={{ 
          backgroundColor: colors.accent,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="rounded-xl px-4 py-4.5 text-center"
          style={{
            background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.secondary || colors.primary} 100%)`,
            color: 'white',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.1)',
          }}
        >
          <div
            className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.16)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Calendar className="h-4 w-4" />
          </div>
          <h2 
            className="text-[22px] font-bold leading-tight mb-1.5" 
            style={{ 
              color: 'white',
              fontFamily: font
            }}
          >
            {appointmentsData.section_title || t('Ready for a New Look?')}
          </h2>
          
          <p 
            className="text-[13px] leading-5 mb-3.5 max-w-[24rem] mx-auto" 
            style={{ color: 'rgba(255,255,255,0.86)' }}
          >
            {appointmentsData.section_description || t('Book your appointment today and let our specialists take care of you.')}
          </p>
          
          <Button
            size="lg"
            className="w-full h-10 rounded-lg text-sm"
            style={{ 
              backgroundColor: colors.background,
              color: colors.primary,
              fontFamily: font,
              fontWeight: 700,
              boxShadow: '0 8px 18px rgba(255,255,255,0.16)'
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {appointmentsData.booking_text || t('Book an Appointment')}
          </Button>
          
          {appointmentsData.cancellation_policy && (
            <p 
              className="text-[13px] mt-3 max-w-[26rem] mx-auto" 
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              {appointmentsData.cancellation_policy}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    if (activeTab !== 'info') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <MapPin size={15} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Find Us')}
          </h2>
        </div>
        
        <div className="space-y-4">
          {locationData.map_embed_url && (
            <SalonMapEmbed embedHtml={locationData.map_embed_url} />
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
              {t('Get Directions')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    if (activeTab !== 'info') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="rounded-xl p-3.5"
          style={{
            background: `linear-gradient(180deg, ${colors.cardBg} 0%, ${colors.background} 100%)`,
            border: `1px solid ${colors.primary}22`,
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${colors.primary}12`, color: colors.primary }}
            >
              <svg 
                width="15" 
                height="15" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <h2 
              className="text-[16px] font-semibold" 
              style={{ 
                color: colors.text,
                fontFamily: font
              }}
            >
              {t('Mobile App')}
            </h2>
          </div>
          
          {appData.app_description && (
            <p 
              className="text-[13px] leading-5 mb-3" 
              style={{ color: colors.text + 'CC', fontFamily: font }}
            >
              {appData.app_description}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-2.5">
            {appData.app_store_url && (
              <Button 
                variant="outline" 
                className="h-9 rounded-full text-[13px]"
                style={{ 
                  borderColor: `${colors.primary}28`,
                  backgroundColor: colors.background,
                  color: colors.primary,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t("App Store")}
              </Button>
            )}
            
            {appData.play_store_url && (
              <Button 
                variant="outline" 
                className="h-9 rounded-full text-[13px]"
                style={{ 
                  borderColor: `${colors.primary}28`,
                  backgroundColor: colors.background,
                  color: colors.primary,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t("Play Store")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    if (activeTab !== 'info') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <MessageSquare size={15} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {formData.form_title}
          </h2>
        </div>
        
        {formData.form_description && (
          <p 
            className="text-sm mb-4" 
            style={{ color: colors.text }}
          >
            {formData.form_description}
          </p>
        )}
        
        <Button 
          className="w-full"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Send Message')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div 
        className="px-5 py-5" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.primary}12`
        }}
      >
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}40)` }} />
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${colors.primary}12`,
                color: colors.primary
              }}
            >
              <Scissors size={15} />
            </div>
            <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${colors.primary}40, transparent)` }} />
          </div>
          <p 
            className="text-[14px] leading-7" 
            style={{ color: colors.primary, fontFamily: font }}
          >
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    if (activeTab !== 'info') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center gap-2 mb-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${colors.primary}12`,
                color: colors.primary,
              }}
            >
              <Heart size={15} />
            </div>
            <h2 
              className="text-[16px] font-semibold" 
              style={{ 
                color: colors.text,
                fontFamily: font
              }}
            >
              {customHtmlData.section_title}
            </h2>
          </div>
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
                background-color: ${colors.accent};
                color: ${colors.primary};
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
    if (activeTab !== 'info') return null;
    
    return (
      <div 
        className="px-4 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: `${colors.primary}12`,
              color: colors.primary,
            }}
          >
            <QrCode size={15} />
          </div>
          <h2 
            className="text-[16px] font-semibold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Share QR Code")}
          </h2>
        </div>
        <div
          className="rounded-xl border p-3.5"
          style={{
            background: `linear-gradient(180deg, ${colors.cardBg} 0%, ${colors.background} 100%)`,
            borderColor: `${colors.primary}22`,
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${colors.primary}12`,
                color: colors.primary,
                border: `1px solid ${colors.primary}18`
              }}
            >
              <QrCode size={22} />
            </div>
            <div className="min-w-0 flex-1">
              {qrData.qr_title && (
                <h4 className="font-semibold text-[14px] mb-1" style={{ color: colors.text, fontFamily: font }}>
                  {qrData.qr_title}
                </h4>
              )}
              
              {qrData.qr_description && (
                <p className="text-[13px] leading-5 mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {qrData.qr_description}
                </p>
              )}
            </div>
          </div>

          <Button 
            className="w-full h-10 rounded-lg text-[13px] mt-1" 
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
        className="px-4 py-4"
        style={{ backgroundColor: colors.background, borderTop: `1px solid ${colors.borderColor}` }}
      >
        <div className="grid grid-cols-1 gap-2.5">
        {hasContactButton && (
          <Button
            className="w-full h-10 rounded-lg text-[13px]"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full h-10 rounded-lg text-[13px]"
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
              border: `1px solid ${colors.primary}24`,
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
            className="w-full h-10 rounded-lg text-[13px]"
            style={{
              backgroundColor: `${colors.primary}10`,
              color: colors.primary,
              border: `1px solid ${colors.primary}20`,
              fontFamily: font
            }}
            onClick={() => {
              const contactData = {
                name: data.name || configSections.header?.name || '',
                title: configSections.header?.tagline || '',
                email: data.email || configSections.contact?.email || '',
                phone: data.phone || configSections.contact?.phone || '',
                website: data.website || configSections.contact?.website || '',
                address: configSections.contact?.address || ''
              };
              import('@/utils/vcfGenerator').then(module => {
                module.downloadVCF(contactData);
              });
            }}
          >
            <User className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
        style={{ backgroundColor: colors.primary }}
      >
        <p 
          className="text-xs text-center" 
          style={{ color: colors.buttonText + '80' }}
        >
          {copyrightData.text}
        </p>
      </div>
    );
  };

  const orderedSectionKeys = getSectionOrder(
    data.template_config || { sections: configSections, sectionSettings: configSections },
    allSections
  ).filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright');
  
  return (
    <div 
      className="w-full rounded-2xl overflow-hidden" 
      style={{ 
        fontFamily: font,
        background: colors.background,
        color: colors.text,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      {renderHeaderSection(configSections.header || {})}

      {orderedSectionKeys
        .filter(key => key !== 'header')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
      {renderCopyrightSection(configSections.copyright || {})}
      
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
