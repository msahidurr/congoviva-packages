import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';

import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Calendar, 
  Clock, 
  Camera, 
  Image, 
  User, 
  Star, 
  Download, 
  UserPlus,
  Menu,
  X,
  Heart,
  Video,
  Play,
  Youtube,
  QrCode,
  Share2
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface PhotographyTemplateProps {
  data: any;
  template: any;
}

// Photography template component
const PhotographyMapEmbed = React.memo(function PhotographyMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="w-full h-64 rounded overflow-hidden" style={{ border: `1px solid #EEEEEE` }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function PhotographyTemplate({ data, template }: PhotographyTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  
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

  const handleSectionNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    setMenuOpen(false);
    if (typeof document === 'undefined') return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#000000', 
    secondary: '#333333', 
    accent: '#FFFFFF', 
    background: '#FFFFFF', 
    text: '#000000',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    overlayColor: 'rgba(0,0,0,0.7)'
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
  const allSections = getBusinessTemplate('photography')?.sections || [];

  const renderSectionTitle = (
    title: string,
    options?: {
      sectionBg?: string;
      textColor?: string;
      lineColor?: string;
      textClassName?: string;
    }
  ) => {
    const {
      sectionBg = colors.background,
      textColor = colors.text,
      lineColor = colors.primary,
      textClassName = 'text-xl'
    } = options || {};

    return (
      <div className="flex items-center mb-6">
        <div className="flex-grow h-px" style={{ backgroundColor: lineColor }}></div>
        <div className="mx-4 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full" style={{
              border: `2px solid ${lineColor}`,
              transform: 'rotate(45deg)'
            }}></div>
            <div className="w-4 h-4 rounded-full absolute" style={{ backgroundColor: lineColor }}></div>
          </div>
          <h2
            className={`${textClassName} font-light px-8 py-2 relative z-10 text-center`}
            style={{
              color: textColor,
              fontFamily: font
            }}
          >
            <span style={{ backgroundColor: sectionBg, padding: '0 15px' }}>{title}</span>
          </h2>
        </div>
        <div className="flex-grow h-px" style={{ backgroundColor: lineColor }}></div>
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
      case 'portfolio':
        return renderPortfolioSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
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
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative w-full h-[500px] overflow-hidden rounded-t-2xl">
      {/* Full-screen background image */}
      <div className="absolute inset-0 w-full h-full">
        {headerData.background_image ? (
          <>
            <img 
              src={getImageDisplayUrl(headerData.background_image)} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${colors.primary}22, ${colors.primary}55)`,
              }}
            />
          </>
        ) : (
          <div 
            className="w-full h-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        )}
        {/* Dark overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundColor: headerData.background_image ? 'rgba(0,0,0,0.3)' : colors.overlayColor
          }}
        ></div>
      </div>
      
      {/* Mobile menu button and language selector */}
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" 
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <span className="text-sm text-white">
                {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
              </span>
            </button>
            
            {showLanguageSelector && (
              <>
                <div 
                  className="fixed inset-0" 
                  style={{ zIndex: 99998 }}
                  onClick={() => setShowLanguageSelector(false)}
                />
                <div 
                  className="absolute right-0 top-full mt-1 rounded border shadow-lg py-1 w-32 max-h-48 overflow-y-auto"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.borderColor,
                    zIndex: 99999
                  }}
                >
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-50 cursor-pointer"
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
        )}
        
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-full cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
        >
          {menuOpen ? (
            <X size={24} color="#FFFFFF" />
          ) : (
            <Menu size={24} color="#FFFFFF" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div 
          className="absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full max-w-xs rounded-2xl px-6 py-8 text-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.24)'
            }}
          >
            <div className="space-y-5">
            <a 
              href="#about" 
              className="block text-xl font-light" 
              style={{ color: '#FFFFFF' }}
              onClick={(event) => handleSectionNavigation(event, 'about')}
            >
              {t("About")}
            </a>
            <a 
              href="#portfolio" 
              className="block text-xl font-light" 
              style={{ color: '#FFFFFF' }}
              onClick={(event) => handleSectionNavigation(event, 'portfolio')}
            >
              {t("Portfolio")}
            </a>
            <a 
              href="#services" 
              className="block text-xl font-light" 
              style={{ color: '#FFFFFF' }}
              onClick={(event) => handleSectionNavigation(event, 'services')}
            >
              {t("Services")}
            </a>
            <a 
              href="#contact" 
              className="block text-xl font-light" 
              style={{ color: '#FFFFFF' }}
              onClick={(event) => handleSectionNavigation(event, 'contact')}
            >
              {t("Contact")}
            </a>
            <Button
              className="mt-6 rounded-lg"
              style={{ 
                backgroundColor: 'transparent',
                border: '1px solid white',
                color: '#FFFFFF'
              }}
              onClick={() => {
                handleAppointmentBooking(configSections.appointments);
                setMenuOpen(false);
              }}
            >
              {t("Book a Session")}
            </Button>
          </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
        {headerData.profile_image && (
          <div 
            className="w-24 h-24 rounded-full overflow-hidden mb-6 border-2"
            style={{ borderColor: colors.accent }}
          >
            {headerData.profile_image ? (
              <img 
                src={getImageDisplayUrl(headerData.profile_image)} 
                alt={headerData.name} 
                className="w-full h-full object-cover object-center scale-125"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                <Camera size={32} style={{ color: colors.primary }} />
              </div>
            )}
          </div>
        )}
        
        <h1 
          className="text-4xl font-light mb-2" 
          style={{ 
            color: '#FFFFFF',
            fontFamily: font
          }}
        >
          {headerData.name || data.name || 'Alex Morgan'}
        </h1>
        
        <div 
          className="w-16 h-0.5 mb-4" 
          style={{ backgroundColor: colors.accent }}
        ></div>
        
        <h2 
          className="text-lg font-light mb-4" 
          style={{ 
            color: '#FFFFFF',
            fontFamily: font
          }}
        >
          {headerData.title || 'Professional Photographer'}
        </h2>
        
        {headerData.tagline && (
          <p 
            className="text-sm max-w-md" 
            style={{ 
              color: 'rgba(255,255,255,0.8)',
              fontFamily: font
            }}
          >
            {headerData.tagline}
          </p>
        )}
        
        <div className="mt-8">
          <Button
            className="border-2 rounded-lg"
            style={{ 
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: '#FFFFFF',
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            {headerData.cta_button_text || 'Get in Touch'}
          </Button>
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

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;

    return (
      <div 
        id="about"
        className="py-8 px-5" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {renderSectionTitle(t("About Me"), { sectionBg: colors.background })}
          
          <p 
            className="text-base leading-7 mb-5 max-w-2xl mx-auto" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {aboutData.description || data.description}
          </p>
          
          {aboutData.experience && (
            <div className="mb-5">
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `${colors.primary}08`,
                  border: `1px solid ${colors.primary}20`,
                  fontFamily: font
                }}
              >
                <span
                  className="text-base font-medium leading-none"
                  style={{ color: colors.primary }}
                >
                  {aboutData.experience}+
                </span>
                <span
                  className="text-sm"
                  style={{ color: colors.text }}
                >
                  {t("Years of Experience")}
                </span>
              </div>
            </div>
          )}
          
          {aboutData.specialties && (
            <div className="max-w-2xl mx-auto">
              <h3 
                className="text-sm uppercase tracking-[0.18em] mb-3 font-medium" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {t("SPECIALTIES")}
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs py-1.5 px-3" 
                    style={{ 
                      borderColor: `${colors.primary}40`,
                      color: colors.text,
                      backgroundColor: `${colors.primary}08`,
                      fontFamily: font
                    }}
                  >
                    {specialty.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPortfolioSection = (portfolioData: any) => {
    const gallery = portfolioData.gallery || [];
    if (!Array.isArray(gallery) || gallery.length === 0) return null;
    
    // Get unique categories
    const categories = ['all', ...new Set(gallery.map((item: any) => item.category))];
    
    // Filter gallery by active category
    const filteredGallery = activeCategory === 'all' 
      ? gallery 
      : gallery.filter((item: any) => item.category === activeCategory);
    
    return (
      <div 
        id="portfolio"
        className="py-8 px-5" 
        style={{ backgroundColor: colors.cardBg }}
      >
        <div className="max-w-4xl mx-auto">
          {renderSectionTitle(t("Portfolio"), { sectionBg: colors.cardBg })}
          
          {/* Category filters */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex flex-wrap justify-center gap-2 p-2 rounded-full max-w-full"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
            {categories.map((category: string) => (
              <button
                key={category}
                className="text-sm py-2 px-4 capitalize rounded-full transition-all duration-300 flex items-center justify-center min-w-[72px] cursor-pointer"
                style={{ 
                  backgroundColor: activeCategory === category ? colors.primary : 'transparent',
                  color: activeCategory === category ? '#FFFFFF' : colors.text,
                  border: `1px solid ${activeCategory === category ? colors.primary : 'transparent'}`,
                  fontFamily: font,
                  boxShadow: activeCategory === category ? `0 6px 18px ${colors.primary}26` : 'none'
                }}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
            </div>
          </div>
          
          {/* Gallery grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredGallery.map((item: any, index: number) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded p-3"
                style={{ 
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                }}
              >
                <div
                  className="absolute inset-3 rounded pointer-events-none"
                  style={{ border: `1px solid ${colors.borderColor}` }}
                ></div>

                <div className="relative z-10">
                  <div className="relative overflow-hidden rounded cursor-pointer" style={{ aspectRatio: '4 / 4.5' }}>
                    {item.image ? (
                      <img 
                        src={getImageDisplayUrl(item.image)} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(180deg, ${colors.primary}10 0%, ${colors.primary}18 100%)` }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center "
                          style={{
                            backgroundColor: colors.background,
                            border: `1px solid ${colors.primary}20`
                          }}
                        >
                          <Camera size={28} style={{ color: colors.primary }} />
                        </div>
                      </div>
                    )}
                    
                  </div>
                  
                  {/* Always visible title and category */}
                  <div className="px-2 pt-4 pb-2">
                    <h2 
                      className="text-sm font-medium mb-2" 
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      {item.title}
                    </h2>
                    {item.description && (
                      <p
                        className="mb-3 text-xs"
                        style={{ color: `${colors.text}CC`, fontFamily: font }}
                      >
                        {item.description}
                      </p>
                    )}
                    <Badge 
                      className="text-xs rounded-full px-3 py-1 border-0" 
                      style={{ 
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    const getServiceIcon = (iconName: string) => {
      switch(iconName) {
        case 'camera': return <Camera size={20} />;
        case 'video': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
        case 'edit': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
        case 'portrait': return <User size={20} />;
        case 'wedding': return <Heart size={20} />;
        case 'event': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
        default: return <Camera size={20} />;
      }
    };
    
    return (
      <div 
        id="services"
        className="py-8 px-5" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(t("Services"), { sectionBg: colors.background })}

        <div className="grid grid-cols-1 gap-4">
          {services.map((service: any, index: number) => (
            <div 
              key={index} 
              className="rounded-lg p-4 md:p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ 
                backgroundColor: `${colors.primary}04`,
                border: `1px solid ${colors.primary}14`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ 
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary
                  }}
                >
                  {getServiceIcon(service.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5">
                    <h3 
                      className="text-base font-semibold leading-snug" 
                      style={{ 
                        color: colors.text,
                        fontFamily: font
                      }}
                    >
                      {service.title}
                    </h3>
                    
                    {service.price && (
                      <span 
                        className="text-sm font-medium self-start" 
                        style={{ 
                          color: colors.primary,
                          fontFamily: font
                        }}
                      >
                        {service.price}
                      </span>
                    )}
                  </div>
                  
                  {service.description && (
                    <p 
                      className="text-sm mt-1.5 leading-6" 
                      style={{ color: colors.text + 'CC', fontFamily: font }}
                    >
                      {service.description}
                    </p>
                  )}
                  
                  {service.duration && (
                    <div 
                      className="mt-3 text-sm flex items-center font-medium" 
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      <Clock size={13} className="mr-1.5" style={{ color: colors.primary }} />
                      {service.duration}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button
            size="sm"
            className="rounded-lg px-6"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            {t("Book a Session")}
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
      <div 
        className="py-8 px-5" 
        style={{ backgroundColor: colors.cardBg }}
      >
        <div className="max-w-4xl mx-auto">
          {renderSectionTitle(t("Behind the Lens"), { sectionBg: colors.cardBg })}
          
          <p
            className="text-sm text-center max-w-2xl mx-auto mb-6 leading-6"
            style={{ color: `${colors.text}B3`, fontFamily: font }}
          >
            {videosData.section_description || t("A closer look at recent shoots, creative process, and moments behind the camera.")}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {videoContent.map((video: any) => {
              const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
              const thumbUrl = video.thumbnail
                ? getImageDisplayUrl(video.thumbnail)
                : getYouTubeThumbnail(video.embed_url || '');

              return (
                <div 
                  key={video.key} 
                  className="group overflow-hidden rounded transition-all duration-300"
                  style={{ 
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.borderColor}`,
                    boxShadow: '0 14px 36px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className="grid grid-cols-1 h-full">
                    <div className="relative">
                      {playingKey === video.key && videoUrl ? (
                        <div className="w-full relative overflow-hidden" style={{ paddingBottom: '46%', height: 0, backgroundColor: colors.cardBg }}>
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
                          className="relative w-full cursor-pointer overflow-hidden rounded"
                          style={{ aspectRatio: '16 / 7.2' }}
                          onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                        >
                          {thumbUrl ? (
                            <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(180deg, ${colors.primary}10 0%, ${colors.primary}18 100%)` }}>
                              <div
                                className="w-16 h-16 rounded-full flex items-center justify-center"
                                style={{
                                  backgroundColor: colors.background,
                                  border: `1px solid ${colors.primary}20`
                                }}
                              >
                                <Video className="w-7 h-7" style={{ color: colors.primary }} />
                              </div>
                            </div>
                          )}
                          <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0) 100%)' }}
                          ></div>
                          {videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: colors.background, boxShadow: '0 10px 30px rgba(0,0,0,0.18)' }}>
                                <Play className="w-4 h-4 ml-0.5" style={{ color: colors.primary }} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-5 flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {video.video_type && (
                          <span 
                            className="text-[11px] px-3 py-1 rounded-full capitalize tracking-[0.12em]" 
                            style={{ 
                              backgroundColor: `${colors.primary}10`,
                              color: colors.primary,
                              fontFamily: font
                            }}
                          >
                            {video.video_type.replace('_', ' ')}
                          </span>
                        )}
                        {video.location && (
                          <span
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: colors.cardBg,
                              color: `${colors.text}99`,
                              border: `1px solid ${colors.borderColor}`,
                              fontFamily: font
                            }}
                          >
                            {video.location}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-xl leading-snug" style={{ color: colors.text, fontFamily: font }}>
                        {video.title}
                      </h3>

                      {video.description && (
                        <p className="text-sm leading-6" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                          {video.description}
                        </p>
                      )}
                    </div>
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
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    
    return (
      <div 
        className="py-8 px-5" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(t("YouTube Channel"), { sectionBg: colors.background })}
          
          <div 
            className="rounded overflow-hidden"
            style={{ 
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: '0 14px 36px rgba(0,0,0,0.05)'
            }}
          >
            {youtubeData.latest_video_embed && (
              <div style={{ backgroundColor: colors.background }}>
                <div className="px-5 pt-5 pb-3">
                  <h4 className="font-medium text-sm flex items-center" style={{ color: colors.text, fontFamily: font }}>
                    <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                    {t("Latest Video")}
                  </h4>
                </div>
                <div className="w-full relative overflow-hidden" style={{ paddingBottom: "52%", height: 0 }}>
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
            
            <div className="p-5 md:p-6 text-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded flex items-center justify-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
                    boxShadow: '0 12px 30px rgba(255,0,0,0.18)'
                  }}
                >
                  <Youtube className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-2xl mb-2" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Photography Channel'}
                </h3>
                {youtubeData.subscriber_count && (
                  <div
                    className="inline-flex items-center rounded px-4 py-2 text-sm mb-4"
                    style={{
                      backgroundColor: `${colors.primary}10`,
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {youtubeData.subscriber_count} {t("subscribers")}
                  </div>
                )}
              </div>

              {youtubeData.channel_description && (
                <p className="text-sm max-w-2xl mx-auto mb-6 leading-7" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                  {youtubeData.channel_description}
                </p>
              )}

              <div className="flex flex-col items-center gap-3">
                {youtubeData.channel_url && (
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-lg cursor-pointer" 
                    style={{ 
                      backgroundColor: colors.primary, 
                      color: 'white',
                      fontFamily: font 
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    {t("Subscribe to Channel")}
                  </Button>
                )}
                {youtubeData.featured_playlist && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium rounded-lg" 
                    style={{ 
                      borderColor: colors.primary, 
                      color: colors.primary, 
                      fontFamily: font 
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t("Photography Tutorials")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div 
      id="contact"
      className="pt-8 pb-4 px-5" 
      style={{ 
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.borderColor}`
      }}
    >
      {renderSectionTitle(t("Contact"), { sectionBg: colors.cardBg })}

      <div
        className="rounded-[24px] overflow-hidden"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="p-5 md:p-6">
        <div className="space-y-3">
          {(contactData.email || data.email) && (
            <a
              href={`mailto:${contactData.email || data.email}`}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <Mail size={16} />
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.16em] mb-1"
                  style={{ color: `${colors.text}80`, fontFamily: font }}
                >
                  {t("Email")}
                </p>
                <p
                  className="text-sm font-medium break-all leading-6"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.email || data.email}
                </p>
              </div>
            </a>
          )}

          {(contactData.phone || data.phone) && (
            <a
              href={`tel:${contactData.phone || data.phone}`}
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <Phone size={16} />
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.16em] mb-1"
                  style={{ color: `${colors.text}80`, fontFamily: font }}
                >
                  {t("Phone")}
                </p>
                <p
                  className="text-sm font-medium leading-6"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.phone || data.phone}
                </p>
              </div>
            </a>
          )}

          {(contactData.website || data.website) && (
            <a
              href={contactData.website || data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <Globe size={16} />
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.16em] mb-1"
                  style={{ color: `${colors.text}80`, fontFamily: font }}
                >
                  {t("Website")}
                </p>
                <p
                  className="text-sm font-medium break-all leading-6"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.website || data.website}
                </p>
              </div>
            </a>
          )}

          {contactData.location && (
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <MapPin size={16} />
              </div>
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.16em] mb-1"
                  style={{ color: `${colors.text}80`, fontFamily: font }}
                >
                  {t("Studio Location")}
                </p>
                <p
                  className="text-sm font-medium leading-6"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.location}
                </p>
              </div>
            </div>
          )}
        </div>
      
      <div className="mt-4 flex flex-col gap-3">
        <Button
          className="w-full py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
          size="sm"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          {t("Send a Message")}
        </Button>
        
        <Button
          className="w-full py-3 rounded-lg font-medium transition-all duration-300 hover:-translate-y-0.5"
          size="sm"
          variant="outline"
          style={{ 
            borderColor: colors.primary,
            color: colors.primary,
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
          {t("Save Contact")}
        </Button>
      </div>
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    
    return (
      <div 
        className="pt-8 pb-4 px-6" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(t("Follow Me"), { sectionBg: colors.background })}
          
          <div className="flex flex-wrap justify-center">
            {socialLinks.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-[65px] h-[65px] flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                style={{ color: colors.text }}
              >
                <Camera
                  size={56}
                  strokeWidth={0.55}
                  className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ color: colors.primary}}
                />
                <div
                  className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.primary,
                  }}
                >
                  <SocialIcon platform={link.platform} color={colors.primary} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    
    // Get current day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    
    return (
      <div 
        className="pt-4 pb-12 px-6" 
        style={{ backgroundColor: colors.cardBg }}
      >
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(t("Studio Hours"), { sectionBg: colors.cardBg })}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hours.map((hour: any, index: number) => {
              const isLastOddCard = hours.length % 2 === 1 && index === hours.length - 1;

              return (
                <div
                  key={index}
                  className={isLastOddCard ? 'sm:col-span-2 flex justify-center' : ''}
                >
                  <div
                    className={`rounded-lg p-4 transition-all duration-300 w-full ${isLastOddCard ? 'sm:max-w-[calc(50%-0.5rem)]' : ''}`}
                    style={{
                      backgroundColor: `${colors.primary}03`,
                      border: `1px solid ${hour.day === currentDay ? `${colors.primary}38` : `${colors.primary}10`}`,
                      boxShadow: hour.day === currentDay
                        ? `0 8px 20px ${colors.primary}0D`
                        : '0 4px 10px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className="capitalize text-sm font-medium tracking-[0.04em]"
                          style={{ color: hour.day === currentDay ? colors.primary : colors.text, fontFamily: font }}
                        >
                          {t(hour.day)}
                        </p>

                        {hour.day === currentDay && (
                          <p
                            className="text-[11px]"
                            style={{ color: `${colors.primary}B3`, fontFamily: font }}
                          >
                            {t('Today')}
                          </p>
                        )}
                      </div>

                      <p
                        className="mt-2 text-sm leading-6"
                        style={{
                          color: hour.is_closed ? `${colors.text}80` : colors.text,
                          fontFamily: font
                        }}
                      >
                        {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return (
      <div 
        className="py-8 px-5" 
        style={{ 
          backgroundColor: colors.primary,
          color: colors.buttonText
        }}
      >
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(t("Client Testimonials"), {
            sectionBg: colors.primary,
            textColor: '#FFFFFF',
            lineColor: colors.buttonText
          })}
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review: any, index: number) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="text-center max-w-xl mx-auto">
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < parseInt(review.rating || 5) ? '#FFFFFF' : 'transparent'} 
                            stroke="#FFFFFF"
                            className="mx-0.5"
                          />
                        ))}
                      </div>
                      
                      <p 
                        className="text-xl italic mb-8 leading-relaxed font-light" 
                        style={{ 
                          color: '#FFFFFF',
                          fontFamily: font
                        }}
                      >
                        "{review.review}"
                      </p>
                      
                      <div className="flex items-center justify-center">
                        {review.client_image ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white border-opacity-30">
                            <img 
                              src={getImageDisplayUrl(review.client_image)} 
                              alt={review.client_name} 
                              className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
                          </div>
                        ) : null}
                        
                        <div>
                          <p 
                            className="font-medium" 
                            style={{ color: '#FFFFFF' }}
                          >
                            {review.client_name}
                          </p>
                          {review.project_type && (
                            <p 
                              className="text-sm" 
                              style={{ color: 'rgba(255,255,255,0.8)' }}
                            >
                              {review.project_type}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {reviews.length > 1 && (
              <div className="flex justify-center mt-4 space-x-3">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: currentReview === index ? colors.buttonText : 'rgba(255,255,255,0.3)'
                    }}
                    onClick={() => setCurrentReview(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {

    return (
      <div 
        className="py-8 px-5" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {renderSectionTitle(t("Ready to Book a Session?"), { sectionBg: colors.background })}
          
          <p 
            className="text-base mb-4" 
            style={{ color: colors.text + 'CC' }}
          >
            {t("Let's create something beautiful together. Schedule a consultation to discuss your photography needs.")}
          </p>
          
          <Button 
            size="lg"
            className="px-8 py-6 text-base rounded-lg"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(appointmentsData)}
          >
            <Calendar className="w-5 h-5 mr-2" />
            {appointmentsData?.booking_text || 'Schedule a Consultation'}
          </Button>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div 
        className="py-12 px-6" 
        style={{ backgroundColor: colors.cardBg }}
      >
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(t("Studio Location"), { sectionBg: colors.cardBg })}
          
          <div className="space-y-6">
            {locationData.map_embed_url && (
              <PhotographyMapEmbed embedHtml={locationData.map_embed_url} />
            )}
            
            {locationData.directions_url && (
              <div className="text-center">
                <Button 
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
      <div 
        className="py-12 px-6" 
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {renderSectionTitle(t("Download Our App"), { sectionBg: colors.background, textClassName: 'text-2xl' })}
          
          {appData.app_description && (
            <p 
              className="text-sm mb-6" 
              style={{ color: colors.text + 'CC' }}
            >
              {appData.app_description}
            </p>
          )}
          
          <div className="flex justify-center space-x-4">
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
    
    return (
      <div 
        className="py-16 px-6" 
        style={{ 
          backgroundColor: colors.primary,
          color: colors.buttonText
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {renderSectionTitle(formData.form_title, {
            sectionBg: colors.primary,
            textColor: '#FFFFFF',
            lineColor: colors.buttonText
          })}
          
          {formData.form_description && (
            <p 
              className="text-base mb-8" 
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              {formData.form_description}
            </p>
          )}
          
          <Button 
            size="lg"
            className="px-8 py-6 text-base border-2 rounded-lg"
            style={{ 
              backgroundColor: 'transparent',
              border: `2px solid ${colors.buttonText}`,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-5 h-5 mr-2" />
            {t("Get in Touch")}
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div className="py-16 px-6" style={{ backgroundColor: colors.cardBg }}>
        <div className="max-w-4xl mx-auto">
          {customHtmlData.show_title && customHtmlData.section_title && (
            renderSectionTitle(customHtmlData.section_title, { sectionBg: colors.cardBg })
          )}
          
          <div 
            className="custom-html-content p-6 rounded-lg" 
            style={{ 
              backgroundColor: colors.background,
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
                  color: ${colors.primary};
                  text-decoration: underline;
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
                  font-family: 'JetBrains Mono', monospace;
                }
              `}
            </style>
            <StableHtmlContent htmlContent={customHtmlData.html_content} />
          </div>
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="py-10 px-6" style={{ backgroundColor: colors.background }}>
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(t('Share My Portfolio'), { sectionBg: colors.background })}
          
          <div 
            className="text-center p-5 md:p-6"
            style={{ 
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`
            }}
          >
            {qrData.qr_title && (
              <h4 className="font-light text-xl mb-2" style={{ color: colors.text, fontFamily: font }}>
                {qrData.qr_title}
              </h4>
            )}
            
            {qrData.qr_description && (
              <p className="text-base mb-4 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                {qrData.qr_description}
              </p>
            )}
            
            <Button 
              size="lg"
              className="px-7 py-3 text-base font-light" 
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => setShowQrModal(true)}
            >
              <QrCode className="w-5 h-5 mr-2" />
              {t('Share QR Code')}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div
        className="py-12 px-6"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-3xl mx-auto">
          {renderSectionTitle(thankYouData.title || t('Thank You'), {
            sectionBg: colors.background,
            textClassName: 'text-2xl'
          })}

          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-10" style={{ backgroundColor: colors.primary }} />
              <Camera size={18} style={{ color: colors.primary }} />
              <div className="h-px w-10" style={{ backgroundColor: colors.primary }} />
            </div>
            <p
              className="mx-auto max-w-2xl text-sm"
              style={{
                color: colors.text + 'CC',
                fontFamily: font
              }}
            >
              {thankYouData.message}
            </p>
          </div>
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
        className="p-5 space-y-3"
        style={{
          backgroundColor: colors.cardBg,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        {hasContactButton && (
          <Button
            className="w-full h-12 font-medium rounded-lg transition-all hover:shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full h-12 font-medium rounded-lg transition-all hover:shadow-lg"
            style={{
              backgroundColor: colors.secondary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            {actionData.appointment_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-12 flex items-center justify-center rounded-lg"
            style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
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
            <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {actionData.save_contact_button_text}
          </Button>
        )}
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
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
  
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
      
      {/* Copyright always at the end */}
      {copyrightSection && (
        <div 
          className="py-6 px-6 text-center" 
          style={{ 
            backgroundColor: colors.background,
            borderTop: `1px solid ${colors.borderColor}`
          }}
        >
          {copyrightSection.text && (
            <p 
              className="text-xs" 
              style={{ color: colors.text + '80' }}
            >
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
