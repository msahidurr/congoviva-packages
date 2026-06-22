import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { sanitizeText, sanitizeUrl } from '@/utils/sanitizeHtml';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Clock, 
  Calendar, 
  Star, 
  ChevronRight, 
  UserPlus,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Heart,
  AlertTriangle,
  Users,
  CheckCircle2,
  Info,
  Youtube,
  Scissors,
  Home,
  PawPrint,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionData, getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface PetCareTemplateProps {
  data: any;
  template: any;
}

const PetCareMapEmbed = React.memo(function PetCareMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden shadow-sm" style={{ border: `1px solid #EEEEEE` }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function PetCareTemplate({ data, template }: PetCareTemplateProps) {
   const { t, i18n } = useTranslation();
  const [activeTip, setActiveTip] = useState<number>(0);
  const [activeService, setActiveService] = useState<string>('all');
  
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
      
      const videoData = video.embed_url ? extractVideoUrl(video.embed_url) : null;
      return {
        ...video,
        videoData,
        key: `video-${index}-${video.title || ''}-${video.embed_url || ''}`
      };
    });
  }, [configSections.videos?.video_list]);
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#E8F5E9',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#FFFFFF',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
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
  const allSections = getBusinessTemplate('pet-care')?.sections || [];

  const decodeDisplayText = React.useCallback((value: string | undefined | null) => {
    if (!value) return '';

    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = value;
      return textarea.value;
    }

    return value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');
  }, []);



  // Helper function to get pet type icon
  const getPetTypeIcon = (petType: string, size: number = 20) => {
    switch(petType) {
      case 'dogs': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path>
          <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path>
          <path d="M8 14v.5"></path>
          <path d="M16 14v.5"></path>
          <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
          <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"></path>
        </svg>
      );
      case 'cats': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"></path>
          <path d="M8 14v.5"></path>
          <path d="M16 14v.5"></path>
          <path d="M11.25 16.25h1.5L12 17l-.75-.75Z"></path>
        </svg>
      );
      case 'small': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a6 6 0 1 1 6-6 6 6 0 0 1-6 6z"></path>
          <path d="M10 8l-1 1"></path>
          <path d="M14 8l1 1"></path>
          <path d="M10 14a3.5 3.5 0 0 0 4 0"></path>
        </svg>
      );
      case 'exotic': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 5c0 9-7 12-7 12s-7-3-7-12a7 7 0 0 1 14 0Z"></path>
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0Z"></path>
        </svg>
      );
      case 'all':
      default: return <PawPrint size={size} />;
    }
  };

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'emergency':
        return renderEmergencySection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
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
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'team':
        return renderTeamSection(sectionData);
      case 'pet_care_tips':
        return renderPetCareTipsSection(sectionData);
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
      {/* Header with Paw Pattern */}
      <div className={`relative h-56 ${showLanguageSelector ? 'overflow-visible' : 'overflow-hidden'}`}>
        {headerData.cover_image ? (
          <img 
            src={getImageDisplayUrl(headerData.cover_image)} 
            alt="Cover" 
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div 
            className="w-full h-full relative" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            {/* Paw pattern overlay */}
            <div className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M13 3.5c2.44 0 4.42 1.94 4.42 4.32a4.37 4.37 0 01-4.42 4.31c-2.44 0-4.42-1.93-4.42-4.31C8.58 5.44 10.56 3.5 13 3.5zm10.76 6.49c1.9 0 3.45 1.51 3.45 3.37a3.4 3.4 0 01-3.45 3.37c-1.9 0-3.45-1.51-3.45-3.37a3.4 3.4 0 013.45-3.37zm9.77 4.67c1.73 0 3.13 1.37 3.13 3.07a3.1 3.1 0 01-3.13 3.06c-1.73 0-3.13-1.37-3.13-3.06a3.1 3.1 0 013.13-3.07zm-15.95 6.8c2.1 0 3.8 1.67 3.8 3.72a3.76 3.76 0 01-3.8 3.72c-2.1 0-3.8-1.67-3.8-3.72a3.76 3.76 0 013.8-3.72zm-9.77 4.66c1.73 0 3.13 1.37 3.13 3.07a3.1 3.1 0 01-3.13 3.06c-1.73 0-3.13-1.37-3.13-3.06a3.1 3.1 0 013.13-3.07z'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        ></div>
        
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: colors.background,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.3)',
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
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          {/* Logo */}
          {headerData.logo && (
            <div className="mb-4">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg mx-auto" 
                style={{ 
                  borderColor: colors.background,
                  backgroundColor: colors.background
                }}
              >
                <img 
                  src={getImageDisplayUrl(headerData.logo)} 
                  alt={headerData.name} 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            </div>
          )}
          
          {/* Business Name */}
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ 
              color: colors.background,
              fontFamily: font,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {decodeDisplayText(headerData.name || data.name || '')}
          </h1>
          
          {headerData.tagline && (
            <p 
              className="text-lg" 
              style={{ 
                color: colors.background,
                fontFamily: font,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {decodeDisplayText(headerData.tagline)}
            </p>
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

  const renderEmergencySection = (emergencyData: any) => {
    if (!emergencyData.show_emergency_banner || !emergencyData.emergency_phone) return null;
    return (
      <a
        href={`tel:${emergencyData.emergency_phone}`}
        className="flex items-center gap-3 px-5 py-4"
        style={{ backgroundColor: '#F44336' }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
          <AlertTriangle size={20} color="#fff" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">
            {emergencyData.emergency_title || t('Pet Emergency?')}
          </p>
          {emergencyData.emergency_description && (
            <p className="text-sm text-white opacity-80 mt-0.5">{emergencyData.emergency_description}</p>
          )}
          <p className="text-sm font-bold text-white mt-0.5">
            {emergencyData.emergency_phone}
            {emergencyData.emergency_hours && (
              <span className="text-xs font-normal opacity-80 ml-1">({emergencyData.emergency_hours})</span>
            )}
          </p>
        </div>
        <Phone size={18} color="#fff" className="flex-shrink-0 opacity-80" />
      </a>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="about"
      >
        <div className="text-center mb-4">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("About Us")}
          </h2>
          {/* Paw print divider */}
          <div className="flex justify-center items-center space-x-1 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        
        <p 
          className="text-base leading-relaxed mb-5" 
          style={{ color: colors.text }}
        >
          {decodeDisplayText(aboutData.description || data.description)}
        </p>
        
        <div className="flex justify-center space-x-6">
          {aboutData.years_experience && (
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                <span className="text-xl font-bold">{aboutData.years_experience}</span>
              </div>
              <p 
                className="text-sm" 
                style={{ color: colors.text }}
              >
                {t("Years Experience")}
              </p>
            </div>
          )}
          
          {aboutData.business_type && (
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                {aboutData.business_type === 'veterinary' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <path d="M8 22v-4"></path>
                    <path d="M16 22v-4"></path>
                    <path d="M2 8h4"></path>
                    <path d="M2 16h4"></path>
                    <path d="M22 8h-4"></path>
                    <path d="M22 16h-4"></path>
                  </svg>
                ) : aboutData.business_type === 'grooming' ? (
                  <Scissors size={24} />
                ) : aboutData.business_type === 'boarding' ? (
                  <Home size={24} />
                ) : aboutData.business_type === 'training' ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4"></path>
                    <path d="M12 18v4"></path>
                    <path d="m4.93 10.93 2.83 2.83"></path>
                    <path d="M16.24 16.24 19.07 19.07"></path>
                    <path d="M2 12h4"></path>
                    <path d="M18 12h4"></path>
                    <path d="m10.93 4.93-2.83 2.83"></path>
                    <path d="M16.24 7.76 19.07 4.93"></path>
                  </svg>
                ) : (
                  <PawPrint size={24} />
                )}
              </div>
              <p 
                className="text-sm capitalize" 
                style={{ color: colors.text }}
              >
                {aboutData.business_type.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.pet_services || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    // Get unique pet types
    const uniquePetTypes = [...new Set(services.map((service: any) => service.pet_type).filter(Boolean))];
    const petTypes = ['all', ...uniquePetTypes.filter(type => type !== 'all')];
    
    // Filter services by active pet type
    const filteredServices = activeService === 'all' 
      ? services 
      : services.filter((service: any) => service.pet_type === activeService);
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.accent
        }}
        id="services"
      >
        <div className="text-center mb-4">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Our Services")}
          </h2>
          {/* Paw print divider */}
          <div className="flex justify-center items-center space-x-1 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        
        {/* Pet type filters */}
        {petTypes.length > 1 && (
          <div className="flex overflow-x-auto pb-2 mb-4 hide-scrollbar justify-center">
            {petTypes.map((petType: string) => (
              <button
                key={petType}
                className={`flex items-center text-xs py-1 px-3 mr-2 capitalize rounded-full whitespace-nowrap cursor-pointer`}
                style={{ 
                  backgroundColor: activeService === petType ? colors.primary : colors.background,
                  color: activeService === petType ? 'white' : colors.text,
                  border: `1px solid ${activeService === petType ? colors.primary : colors.borderColor}`
                }}
                onClick={() => setActiveService(petType)}
              >
                <span className="mr-1">{getPetTypeIcon(petType, 14)}</span>
                {petType === 'all' ? 'All Pets' : petType.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
        
        {/* Services grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((service: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}
            >
              {/* Image */}
              <div className="w-full h-40 flex-shrink-0">
                {service.image ? (
                  <img
                    src={getImageDisplayUrl(service.image)}
                    alt={service.name || 'Pet Service'}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <PawPrint size={28} style={{ color: colors.primary + '50' }} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div className="flex items-start justify-between gap-1">
                  <h3 className="text-lg font-semibold leading-snug flex-1" style={{ color: colors.primary, fontFamily: font }}>
                    {service.name}
                  </h3>
                  {service.price && (
                    <span className="text-sm font-bold flex-shrink-0 ml-1" style={{ color: colors.secondary }}>
                      {service.price}
                    </span>
                  )}
                </div>

                {service.description && (
                  <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {service.description}
                  </p>
                )}

                {(service.duration || (service.pet_type && service.pet_type !== 'all')) && (
                  <div className="flex items-center gap-2 mt-auto pt-1 flex-wrap">
                    {service.duration && (
                      <span className="flex items-center gap-1 text-xs" style={{ color: colors.text + '70' }}>
                        <Clock size={10} />{service.duration}
                      </span>
                    )}
                    {service.pet_type && service.pet_type !== 'all' && (
                      <span className="flex items-center gap-1 text-xs capitalize" style={{ color: colors.text + '70' }}>
                        {getPetTypeIcon(service.pet_type, 10)}{service.pet_type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {configSections.appointments?.booking_url && (
          <div className="mt-5 text-center">
            <Button
              className="px-6 py-2"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t("Book a Service")}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    const phone = contactData.phone || data.phone;
    const email = contactData.email || data.email;
    const website = contactData.website || data.website;
    const rows = [
      phone    && { icon: <Phone size={16} />, label: t('Phone'), value: phone, href: `tel:${phone}` },
      email    && { icon: <Mail size={16} />, label: t('Email'), value: email, href: `mailto:${email}` },
      website  && { icon: <Globe size={16} />, label: t('Website'), value: website, href: sanitizeUrl(website), external: true },
      contactData.address && { icon: <MapPin size={16} />, label: t('Address'), value: contactData.address, href: configSections.google_map?.directions_url || null, external: true },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null; external?: boolean }[];

    if (!rows.length && !contactData.emergency_phone) return null;

    return (
      <div className="px-5 py-7" style={{ backgroundColor: colors.background }} id="contact">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Contact Us')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="space-y-2">
          {contactData.emergency_phone && (
            <a
              href={`tel:${contactData.emergency_phone}`}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: '#FFEBEE', border: '1px solid #FFCDD2' }}
            >
              <AlertTriangle size={16} color="#D32F2F" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: '#D32F2F' }}>{t('Emergency')}</p>
                <p className="text-sm font-bold truncate" style={{ color: '#D32F2F' }}>{contactData.emergency_phone}</p>
              </div>

            </a>
          )}

          {rows.map((row, i) => (
            row.href ? (
              <a
                key={i}
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: colors.accent, border: `1px solid ${colors.borderColor}` }}
              >
                <span className="flex-shrink-0" style={{ color: colors.primary }}>{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>{row.label}</p>
                  <p className="text-sm truncate" style={{ color: colors.text, fontFamily: font }}>{row.value}</p>
                </div>

              </a>
            ) : (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: colors.accent, border: `1px solid ${colors.borderColor}` }}
              >
                <span className="flex-shrink-0" style={{ color: colors.primary }}>{row.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>{row.label}</p>
                  <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>{row.value}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.accent
        }}
        id="social"
      >
        <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-110 mx-auto"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText
              }}
            >
              <SocialIcon platform={link.platform} color='white' />
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    const todayHours = hours.find((h: any) => h.day === currentDay);
    const isOpenNow = todayHours && !todayHours.is_closed;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Hours')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        {/* Hours list */}
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.borderColor}` }}>
          {hours.map((hour: any, index: number) => {
            const isToday = hour.day === currentDay;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  backgroundColor: isToday ? colors.primary + '08' : colors.background,
                  borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  {isToday && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.primary }} />
                  )}
                  <span
                    className="text-sm capitalize"
                    style={{
                      color: isToday ? colors.primary : colors.text,
                      fontWeight: isToday ? 600 : 400,
                      fontFamily: font,
                      marginLeft: isToday ? 0 : '14px'
                    }}
                  >
                    {t(hour.day)}
                  </span>
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: hour.is_closed ? '#EF5350' : isToday ? colors.primary : colors.text + 'CC',
                    fontWeight: isToday ? 600 : 400,
                    fontFamily: font
                  }}
                >
                  {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.accent }} id="gallery">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Gallery')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo: any, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.borderColor}`, backgroundColor: colors.background }}>
              <div style={{ aspectRatio: '1/1', width: '100%' }}>
                {photo.image ? (
                  <img
                    src={getImageDisplayUrl(photo.image)}
                    alt={photo.caption || `Gallery ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <PawPrint size={24} style={{ color: colors.primary + '60' }} />
                  </div>
                )}
              </div>
              {photo.caption && (
                <p className="text-sm px-3 py-3" style={{ color: colors.text + '99', fontFamily: font }}>
                  {photo.caption}
                </p>
              )}
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
      <div className="px-5 py-6" style={{ backgroundColor: colors.background }} id="testimonials">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Happy Pet Parents')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0 px-1">
                <div className="rounded-2xl p-4" style={{ backgroundColor: colors.accent, border: `1px solid ${colors.borderColor}` }}>
                  {/* Stars + quote mark */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < parseInt(review.rating || 5) ? colors.highlightColor : 'transparent'}
                          stroke={i < parseInt(review.rating || 5) ? colors.highlightColor : colors.borderColor}
                        />
                      ))}
                    </div>
                    <span className="text-3xl leading-none" style={{ color: colors.primary + '30', fontFamily: 'Georgia, serif' }}>&ldquo;</span>
                  </div>

                  {/* Review text */}
                  <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
                    {review.review}
                  </p>

                  {/* Divider */}
                  <div className="mb-3" style={{ height: '1px', backgroundColor: colors.borderColor }} />

                  {/* Reviewer */}
                  <div className="flex items-center gap-3">
                    {review.client_image ? (
                      <img
                        src={getImageDisplayUrl(review.client_image)}
                        alt={review.client_name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '20' }}>
                        <Users size={16} style={{ color: colors.primary }} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                        {review.client_name}
                      </p>
                      {(review.pet_name || review.pet_type) && (
                        <p className="text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                          {review.pet_name}{review.pet_name && review.pet_type ? ' · ' : ''}{review.pet_type}
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
          <div className="flex justify-center mt-3 gap-1.5">
            {reviews.map((_: any, dotIndex: number) => (
              <div
                key={dotIndex}
                className="rounded-full transition-all"
                style={{
                  width: dotIndex === currentReview % reviews.length ? '16px' : '6px',
                  height: '6px',
                  backgroundColor: dotIndex === currentReview % reviews.length ? colors.primary : colors.primary + '40',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentReview(dotIndex)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData.booking_url && !appointmentsData.appointment_info) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.accent }} id="appointments">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Book an Appointment')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="space-y-2">
          {appointmentsData.appointment_info && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}>
              <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
              <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
                {appointmentsData.appointment_info}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {appointmentsData.booking_text || t('Book Now')}
          </Button>
        </div>
      </div>
    );
  };

  const renderTeamSection = (teamData: any) => {
    const staff = teamData.staff || [];
    if (!Array.isArray(staff) || staff.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="team"
      >
        <div className="text-center mb-4">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Our Team")}
          </h2>
          {/* Paw print divider */}
          <div className="flex justify-center items-center space-x-1 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        
        <div className="space-y-4">
          {staff.map((member: any, index: number) => (
            <div 
              key={index} 
              className="p-4 rounded-lg shadow-sm" 
              style={{ 
                backgroundColor: colors.accent,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div className="flex">
                {member.image ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img 
                      src={getImageDisplayUrl(member.image)} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full mr-4 flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + '20' }}
                  >
                    <Users size={24} style={{ color: colors.primary }} />
                  </div>
                )}
                
                <div>
                  <h3 
                    className="text-lg font-bold" 
                    style={{ 
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {member.name}
                  </h3>
                  
                  {member.title && (
                    <p 
                      className="text-sm" 
                      style={{ color: colors.secondary }}
                    >
                      {member.title}
                    </p>
                  )}
                  
                  {member.specialties && (
                    <p 
                      className="text-xs mt-1" 
                      style={{ color: colors.text + '99' }}
                    >
                      {member.specialties}
                    </p>
                  )}
                </div>
              </div>
              
              {member.bio && (
                <p 
                  className="text-sm mt-3" 
                  style={{ color: colors.text }}
                >
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPetCareTipsSection = (tipsData: any) => {
    const tips = tipsData.tips || [];
    if (!Array.isArray(tips) || tips.length === 0) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.accent }} id="tips">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Pet Care Tips')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="space-y-3">
          {tips.map((tip: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}>
              {tip.image && (
                <div style={{ width: '100%', height: '160px' }}>
                  <img
                    src={getImageDisplayUrl(tip.image)}
                    alt={tip.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                    {tip.title}
                  </h3>
                  {tip.pet_type && tip.pet_type !== 'all' && (
                    <span className="flex items-center gap-1 text-sm flex-shrink-0 px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
                      {getPetTypeIcon(tip.pet_type, 10)}
                      <span className="capitalize">{tip.pet_type.replace('_', ' ')}</span>
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.text + '99', fontFamily: font }}>
                  {tip.description}
                </p>
              </div>
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
          backgroundColor: colors.background
        }}
      >
        <div className="text-center mb-4">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Find Us")}
          </h2>
          {/* Paw print divider */}
          <div className="flex justify-center items-center space-x-1 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        
        {locationData.map_embed_url && (
          <PetCareMapEmbed embedHtml={locationData.map_embed_url} />
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
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.accent }}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Pet Care App')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="space-y-3">
          {appData.app_description && (
            <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {appData.app_description}
            </p>
          )}

          {appData.app_features && (
            <div className="space-y-1.5">
              <p className="text-sm font-semibold mb-2" style={{ color: colors.primary, fontFamily: font }}>{t('Features')}:</p>
              {appData.app_features.split('\n').filter(Boolean).map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="flex-shrink-0" style={{ color: colors.primary }} />
                  <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>{feature}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {appData.app_store_url && (
              <button
                className="flex items-center justify-center gap-2 py-3 rounded-xl"
                style={{ backgroundColor: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}` }}
                onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-sm font-medium" style={{ fontFamily: font }}>{t('App Store')}</span>
              </button>
            )}
            {appData.play_store_url && (
              <button
                className="flex items-center justify-center gap-2 py-3 rounded-xl"
                style={{ backgroundColor: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}` }}
                onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                </svg>
                <span className="text-sm font-medium" style={{ fontFamily: font }}>{t('Play Store')}</span>
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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="contact_form"
      >
        <div className="text-center mb-4">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {formData.form_title}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        {formData.form_description && (
          <p 
            className="text-sm text-center mb-4" 
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
          {t("Send Message")}
        </Button>
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
      <div className="px-5 py-6" style={{ backgroundColor: colors.accent }}>
        {/* Title — same as other sections */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Pet Care Videos')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div key={video.key} className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}>
              {/* Thumbnail */}
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
                    className="relative w-full cursor-pointer"
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
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                        <Video className="w-10 h-10" style={{ color: colors.primary }} />
                      </div>
                    )}
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Content */}
              <div className="p-3">
                <h4 className="text-sm font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-sm mb-2" style={{ color: colors.text + '99', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                {(video.duration || video.video_type) && (
                  <div className="flex items-center justify-between">
                    {video.duration && (
                      <span className="flex items-center gap-1 text-sm" style={{ color: colors.text + '70', fontFamily: font }}>
                        <Clock size={11} /> {video.duration}
                      </span>
                    )}
                    {video.video_type && (
                      <span className="text-sm px-2 py-1 capitalize rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                        <PawPrint size={11} className="inline mr-2" />{video.video_type.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.background }}>
        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('YouTube Channel')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="space-y-3">
          {/* Channel info card */}
          <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: colors.accent, border: `1px solid ${colors.borderColor}` }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Pet Care Tips'}
                </p>
                {youtubeData.subscriber_count && (
                  <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
                    {youtubeData.subscriber_count} {t('subscribers')}
                  </p>
                )}
              </div>
            </div>
            {youtubeData.channel_description && (
              <p className="text-sm mt-2" style={{ color: colors.text + '99', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}
          </div>

          {/* Latest video */}
          {youtubeData.latest_video_embed && (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.borderColor}` }}>
              <div className="px-3 pt-3 pb-2 flex items-center gap-2" style={{ backgroundColor: colors.accent }}>
                <Play size={14} style={{ color: colors.primary }} />
                <p className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                  {t('Latest Video')}
                </p>
              </div>
              <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                <div
                  className="absolute inset-0 w-full h-full"
                  ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2">
            {youtubeData.channel_url && (
              <Button
                className="w-full"
                style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                <Youtube className="w-4 h-4 mr-2" />
                {t('Subscribe')}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button
                variant="outline"
                className="w-full"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                <PawPrint className="w-4 h-4 mr-2" />
                {t('Pet Care Guides')}
              </Button>
            )}
          </div>
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
          className="relative overflow-hidden rounded-3xl px-5 py-5 text-center"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ backgroundColor: colors.primary + '35' }} />
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.background,
                color: colors.primary,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <PawPrint size={18} />
            </div>
            <div className="h-px w-8" style={{ backgroundColor: colors.primary + '35' }} />
          </div>
          <p 
            className="text-sm leading-6 italic" 
            style={{ color: colors.text, fontFamily: font }}
          >
            {thankYouData.message}
          </p>
          <div
            className="pointer-events-none absolute -bottom-4 -right-3 opacity-20"
            style={{ color: colors.secondary }}
          >
            <PawPrint size={26} />
          </div>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.background }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {customHtmlData.section_title}
            </h2>
            <div className="flex justify-center items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            </div>
          </div>
        )}
        <div
          className="custom-html-content"
          style={{ fontFamily: font, color: colors.text }}
        >
          <style>{`
            .custom-html-content h1,.custom-html-content h2,.custom-html-content h3,.custom-html-content h4,.custom-html-content h5,.custom-html-content h6 {
              color: ${colors.primary}; margin-bottom: 0.5rem; font-family: ${font}; font-weight: bold;
            }
            .custom-html-content p {
              color: ${colors.text}; margin-bottom: 0.4rem; font-size: 0.875rem; font-family: ${font};
            }
            .custom-html-content a {
              color: ${colors.secondary}; text-decoration: underline; font-weight: bold;
            }
            .custom-html-content ul,.custom-html-content ol {
              color: ${colors.text}; padding-left: 1rem; font-family: ${font};
            }
            .custom-html-content code {
              background-color: ${colors.primary}20; color: ${colors.primary};
              padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: Monaco, monospace;
            }
          `}</style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.accent }}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Share Pet Care')}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}>
          {(qrData.qr_title || qrData.qr_description) && (
            <div className="px-4 pt-4 pb-3">
              {qrData.qr_title && (
                <p className="text-sm font-semibold mb-1" style={{ color: colors.primary, fontFamily: font }}>
                  {qrData.qr_title}
                </p>
              )}
              {qrData.qr_description && (
                <p className="text-xs" style={{ color: colors.text + '99', fontFamily: font }}>
                  {qrData.qr_description}
                </p>
              )}
            </div>
          )}
          <div className="px-4 pb-4 pt-2">
            <Button
              className="w-full"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
              onClick={() => setShowQrModal(true)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              {t('Share QR Code')}
            </Button>
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
      <div className="px-5 py-6 space-y-3" style={{ backgroundColor: colors.background }}>
        {hasContactButton && (
          <Button
            className="w-full h-11"
            style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Heart className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full h-11"
            variant="outline"
            style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: 'transparent', fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.appointment_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            className="w-full h-11"
            variant="outline"
            style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: 'transparent', fontFamily: font }}
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
            <UserPlus className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;
    return (
      <div className="px-5 py-4" style={{ backgroundColor: colors.accent, borderTop: `1px solid ${colors.borderColor}` }}>
        <p className="text-xs text-center" style={{ color: colors.text + '80', fontFamily: font }}>
          {copyrightData.text}
        </p>
      </div>
    );
  };
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
    
  return (
    <div 
      className={`w-full rounded-lg ${showLanguageSelector ? 'overflow-visible' : 'overflow-hidden'}`}
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
      
      {/* Copyright Section */}
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
