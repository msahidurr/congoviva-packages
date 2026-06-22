import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
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
  Gift,
  Home,
  Users,
  CheckCircle2,
  CalendarDays,
  HelpCircle,
  Youtube,
  Building,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';

interface WeddingPlannerTemplateProps {
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

const WeddingPlannerMapEmbed = React.memo(function WeddingPlannerMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="w-full h-48 rounded-lg overflow-hidden shadow-md" style={{ border: `1px solid #EEEEEE` }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function WeddingPlannerTemplate({ data, template }: WeddingPlannerTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activePortfolio, setActivePortfolio] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
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
  
  // Process video content at component level to avoid hooks in render functions
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
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#D8A7B1',
    secondary: '#EAC9C1',
    accent: '#F9F1F0',
    background: '#FFFFFF',
    text: '#5D4954',
    cardBg: '#FFFFFF',
    borderColor: '#F0E4E6',
    buttonText: '#FFFFFF',
    highlightColor: '#D8A7B1'
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
  const allSections = getBusinessTemplate('wedding-planner')?.sections || [];



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
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'portfolio':
        return renderPortfolioSection(sectionData);
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
      case 'venues':
        return renderVenuesSection(sectionData);
      case 'faq':
        return renderFaqSection(sectionData);
      case 'pricing':
        return null;
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
      {/* Elegant Header with Floral Pattern */}
      <div className="relative h-64 overflow-hidden">
        {headerData.cover_image ? (
          <img 
            src={getImageDisplayUrl(headerData.cover_image)} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full relative" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}80 100%)`,
            }}
          >
            {/* Wedding pattern overlay */}
            <div className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary.replace('#', '')}' fill-opacity='0.4'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        )}
        
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 transition-colors cursor-pointer"
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.background
                }}
              >
                <span className="text-lg">{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || []))}</span>
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
        
        {/* Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        ></div>
        
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
            {headerData.name || data.name || t('Eternal Moments')}
          </h1>
          
          {headerData.tagline && (
            <p 
              className="text-lg italic" 
              style={{ 
                color: colors.background,
                fontFamily: font,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative Divider */}
      <div 
        className="h-3 w-full" 
        style={{ 
          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary}, ${colors.primary})` 
        }}
      ></div>
      
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
    const stats = [
      aboutData.years_experience && { value: aboutData.years_experience, label: aboutData.years_experience_label || t('Years Experience') },
      aboutData.weddings_planned && { value: aboutData.weddings_planned, label: aboutData.weddings_planned_label || t('Events Planned') },
    ].filter(Boolean);

    return (
      <div className="px-5 py-10 text-center" style={{ backgroundColor: colors.background }} id="about">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('About Us')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <p className="text-base leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>

        {stats.length > 0 && (
          <div className="flex justify-center gap-10 mt-7">
            {stats.map((stat: any, i: number) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold" style={{ color: colors.primary, fontFamily: font }}>
                  {stat.value}
                </p>
                <div className="h-px w-8 mx-auto my-1.5" style={{ backgroundColor: colors.primary + '40' }} />
                <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {aboutData.approach && (
          <div className="mt-7 inline-flex gap-2">
            <Heart size={15} fill={colors.primary} style={{ color: colors.primary }} />
            <span className="text-sm uppercase tracking-widest font-medium" style={{ color: colors.primary, fontFamily: font }}>
              {aboutData.approach.replace('_', ' & ')}
            </span>
            <Heart size={15} fill={colors.primary} style={{ color: colors.primary }} />
          </div>
        )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const packages = servicesData.packages || [];
    if (!Array.isArray(packages) || packages.length === 0) return null;

    return (
      <div className="px-5 py-10 text-center" style={{ backgroundColor: colors.accent }} id="services">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Our Services')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="space-y-5">
          {packages.map((pkg: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden text-left" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}25` }}>
              {pkg.image && (
                <div className="w-full aspect-[16/9] overflow-hidden bg-[#F8F5F1]">
                  <img src={pkg.image} alt={pkg.name || 'Service'} className="w-full h-full object-cover object-center" />
                </div>
              )}
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
                  {pkg.name}
                </h3>
                {pkg.price_range && (
                  <p className="text-lg font-semibold mb-2" style={{ color: colors.primary, fontFamily: font }}>
                    {pkg.price_range}
                  </p>
                )}
                {pkg.description && (
                  <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text , fontFamily: font }}>
                    {pkg.description}
                  </p>
                )}
                {pkg.features && (
                  <div className="space-y-1.5">
                    {pkg.features.split('\n').map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={16} style={{ color: colors.primary }} />
                        <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button
            className="px-8 py-2 rounded-lg text-base font-semibold"
            style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('Inquire About Services')}
          </Button>
        </div>
      </div>
    );
  };

  const renderPortfolioSection = (portfolioData: any) => {
    const weddings = portfolioData.weddings || [];
    if (!Array.isArray(weddings) || weddings.length === 0) return null;
    
    const getWeddingStyleIcon = (style: string) => {
      switch(style) {
        case 'rustic': return <Home size={16} />;
        case 'beach': return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 16l-6 6h18l-6-6"></path>
            <path d="M2 12h20"></path>
            <path d="M12 2v10"></path>
          </svg>
        );
        case 'garden': return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c6.5-6.5 6.5-14.5 0-14.5S5.5 15.5 12 22z"></path>
            <path d="M12 7.5V2"></path>
          </svg>
        );
        case 'modern': return <Building size={16} />;
        case 'traditional': return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
        case 'bohemian': return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            <path d="M2 12h20"></path>
          </svg>
        );
        case 'vintage': return <Gift size={16} />;
        case 'luxury': return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
        default: return <Heart size={16} />;
      }
    };
    
    return (
      <div className="px-5 py-10 text-center" style={{ backgroundColor: colors.background }} id="portfolio">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Wedding Portfolio')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="max-w-md mx-auto rounded-3xl overflow-hidden mb-5 shadow-sm" style={{ border: `1px solid ${colors.primary}20`, backgroundColor: colors.background }}>
          {weddings[activePortfolio]?.cover_image ? (
            <div className="w-full bg-[#F8F5F1] flex items-center justify-center p-3">
              <img
                src={weddings[activePortfolio].cover_image}
                alt={weddings[activePortfolio].title}
                className="w-full max-h-72 object-contain object-center rounded-2xl"
              />
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
              <Heart size={32} style={{ color: colors.primary }} />
            </div>
          )}
          <div className="px-4 py-4 text-center">
            <h3 className="text-lg font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
              {weddings[activePortfolio].title}
            </h3>
            <div className="flex items-center justify-center gap-3 text-sm flex-wrap font-semibold" style={{ color: colors.text + 'AA', fontFamily: font }}>
              {weddings[activePortfolio]?.style && (
                <div className="flex items-center gap-1">
                  <span className="flex items-center" style={{ color: colors.primary }}>{getWeddingStyleIcon(weddings[activePortfolio].style)}</span>
                  <span className="capitalize">{weddings[activePortfolio].style}</span>
                </div>
              )}
              {weddings[activePortfolio]?.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={12} style={{ color: colors.primary }} />
                  <span>{weddings[activePortfolio].location}</span>
                </div>
              )}
            </div>
            {weddings[activePortfolio]?.date && (
              <p className="text-sm mt-1" style={{ color: colors.text, fontFamily: font }}>{weddings[activePortfolio].date}</p>
            )}
            {weddings[activePortfolio]?.description && (
              <p className="text-sm leading-relaxed mt-2" style={{ color: colors.text, fontFamily: font }}>
                {weddings[activePortfolio].description}
              </p>
            )}
          </div>
        </div>

        {weddings.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {weddings.map((wedding: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
                style={{ border: `2px solid ${activePortfolio === index ? colors.primary : `${colors.primary}20`}`, boxShadow: activePortfolio === index ? `0 8px 20px ${colors.primary}18` : 'none' }}
                onClick={() => setActivePortfolio(index)}
              >
                {wedding.cover_image ? (
                  <img src={wedding.cover_image} alt={wedding.title} className="w-full aspect-square object-cover object-center" />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                    <Heart size={20} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.accent }} id="contact">
      <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
        {t('Contact Us')}
      </h2>
      <div className="flex items-center justify-center gap-1.5 mb-6">
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
        <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
      </div>

      <div className="space-y-3">
        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <Phone size={16} style={{ color: colors.primary }} />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{t('Phone')}</p>
              <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>{contactData.phone || data.phone}</p>
            </div>
          </a>
        )}

        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <Mail size={16} style={{ color: colors.primary }} />
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{t('Email')}</p>
              <p className="text-sm font-semibold break-all" style={{ color: colors.text, fontFamily: font }}>{contactData.email || data.email}</p>
            </div>
          </a>
        )}

        {contactData.address && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <MapPin size={16} style={{ color: colors.primary }} />
            </div>
            <div className="text-left flex-1">
              <p className="text-xs uppercase tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{t('Address')}</p>
              <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>{contactData.address}</p>
              {configSections.google_map?.directions_url && (
                <a href={configSections.google_map.directions_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5 mt-0.5" style={{ color: colors.primary, fontFamily: font }}>
                  <span className="text-xs">{t('Get Directions')}</span>
                  <ChevronRight size={12} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

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
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
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
              className="flex flex-col items-center"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.buttonText
                }}
              >
                <SocialIcon platform={link.platform} color="#ffffff" />
              </div>
              <span 
                className="text-xs" 
                style={{ color: colors.text }}
              >
                {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
              </span>
            </a>
          ))}
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
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.background }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Office Hours')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="space-y-0">
          {hours.map((hour: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center py-3 px-1"
              style={{ borderBottom: index < hours.length - 1 ? `1px solid ${colors.primary}15` : 'none' }}
            >
              <span
                className="text-sm capitalize"
                style={{
                  color: hour.day === currentDay ? colors.primary : colors.text,
                  fontWeight: hour.day === currentDay ? '700' : '500',
                  fontFamily: font
                }}
              >
                {t(hour.day)}
              </span>
              <div className="flex items-center gap-2">
                {hour.by_appointment && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                    {t('By Appointment')}
                  </span>
                )}
                <span
                  className="text-sm"
                  style={{
                    color: hour.is_closed ? colors.text + '80' : hour.day === currentDay ? colors.primary : colors.text,
                    fontWeight: hour.day === currentDay ? '600' : '500',
                    fontFamily: font
                  }}
                >
                  {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    
    return (
      <div className="py-8 text-center" style={{ backgroundColor: colors.accent }} id="gallery">
        <h2 className="text-2xl font-bold mb-2 px-5" style={{ color: colors.text, fontFamily: font }}>
          {t('Gallery')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6 px-5">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {/* Clean 2-col grid */}
        <div className="grid grid-cols-2 gap-2 px-5">
          {photos.map((photo: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.primary}20` }}>
              <div className="relative" style={{ aspectRatio: '1/1' }}>
                {photo.image ? (
                  <img
                    src={photo.image}
                    alt={photo.caption || `Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                    <Heart size={25} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
              {photo.caption && (
                <p className="text-[15px] px-2 py-1.5">{photo.caption}</p>
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
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.accent }} id="testimonials">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Happy Couples')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0">
                {/* <p className="text-4xl mb-2" style={{ color: colors.primary, lineHeight: 1 }}>❝</p> */}
                 <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_: any, i: number) => (
                    <Star key={i} size={14} fill={i < parseInt(review.rating || 5) ? colors.primary : 'transparent'} stroke={colors.primary} />
                  ))}
                </div>
                <p className="text-base italic leading-relaxed mb-5" style={{ color: colors.text, fontFamily: font }}>
                  {review.review}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {review.couple_image ? (
                    <img src={review.couple_image} alt={review.couple_name} className="w-15 h-15 rounded-full object-cover" />
                  ) : (
                    <div className="w-15 h-15 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                      <Heart size={16} fill={colors.primary} style={{ color: colors.primary }} />
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{review.couple_name}</p>
                    {review.wedding_date && (
                      <p className="text-[15px]" style={{ color: colors.text, fontFamily: font }}>{review.wedding_date}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {reviews.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {reviews.map((_: any, index: number) => (
              <Heart
                key={index}
                size={10}
                fill={currentReview === index ? colors.primary : 'transparent'}
                stroke={colors.primary}
                className="transition-all duration-300 cursor-pointer"
                onClick={() => setCurrentReview(index)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData.booking_url && !appointmentsData.consultation_info) return null;

    return (
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.background }} id="consultation">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Schedule a Consultation')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {appointmentsData.consultation_info && (
          <p className="text-base leading-relaxed mb-6" style={{ color: colors.text + 'BB', fontFamily: font }}>
            {appointmentsData.consultation_info}
          </p>
        )}

        {(appointmentsData.consultation_length || appointmentsData.virtual_option) && (
          <div className="flex justify-center gap-8 mb-6">
            {appointmentsData.consultation_length && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                  <Clock size={18} style={{ color: colors.primary }} />
                </div>
                <p className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{appointmentsData.consultation_length}</p>
              </div>
            )}
            {appointmentsData.virtual_option && (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.primary }}>
                    <path d="M15 10l5 5-5 5"></path>
                    <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{t('Virtual Option')}</p>
              </div>
            )}
          </div>
        )}

        <Button
          className="w-full rounded-lg text-base font-semibold"
          style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
          onClick={() => handleAppointmentBooking(configSections.appointments)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {appointmentsData.booking_text || t('Book a Consultation')}
        </Button>
      </div>
    );
  };

  const renderVenuesSection = (venuesData: any) => {
    const venues = venuesData.venue_list || [];
    if (!Array.isArray(venues) || venues.length === 0) return null;

    return (
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.accent }} id="venues">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.buttonText, fontFamily: font }}>
          {t('Preferred Venues')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="space-y-5">
          {venues.map((venue: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
              {venue.image ? (
                <img src={venue.image} alt={venue.name} className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 flex items-center justify-center" style={{ backgroundColor: colors.primary + '10' }}>
                  <Building size={32} style={{ color: colors.primary }} />
                </div>
              )}
              <div className="px-4 py-4 text-left">
                <h3 className="text-lg font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
                  {venue.name}
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  {venue.location && (
                    <div className="flex items-center gap-1" style={{ color: colors.primary }}>
                      <MapPin size={14} />
                      <span className="text-[15px]" style={{ fontFamily: font }}>{venue.location}</span>
                    </div>
                  )}
                  {venue.capacity && (
                    <div className="flex items-center gap-1" style={{ color: colors.text + '99' }}>
                      <Users size={14} />
                      <span className="text-[15px]" style={{ fontFamily: font }}>{venue.capacity}</span>
                    </div>
                  )}
                </div>
                {venue.description && (
                  <p className="text-lg leading-relaxed mb-3" style={{ color: colors.text + 'AA', fontFamily: font }}>
                    {venue.description}
                  </p>
                )}
                {venue.website && (
                  <a href={venue.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[16px] font-medium" style={{ color: colors.primary, fontFamily: font }}>
                    {t('Visit Website')}
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFaqSection = (faqData: any) => {
    const questions = faqData.questions || [];
    if (!Array.isArray(questions) || questions.length === 0) return null;

    return (
      <div className="px-5 py-8 text-center"  id="faq">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Frequently Asked Questions')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="space-y-3">
          {questions.map((faq: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}30` }}>
              <div
                className="px-4 py-4 flex justify-between items-center cursor-pointer gap-3"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <HelpCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                  <h3 className="text-base font-medium text-left" style={{ color: colors.text, fontFamily: font }}>
                    {faq.question}
                  </h3>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: activeFaq === index ? colors.primary : colors.primary + '15' }}>
                  {activeFaq === index ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: colors.primary }}>
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                  )}
                </div>
              </div>
              {activeFaq === index && faq.answer && (
                <div className="px-4 pb-4 text-left" style={{ borderTop: `1px solid ${colors.primary}30` }}>
                  <div className="flex items-start gap-2 pt-3">
                    <p className="text-base leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
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
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.accent
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
            {t('Our Location')}
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
            <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
            <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        
        <div className="space-y-4">
          {locationData.map_embed_url && (
            <WeddingPlannerMapEmbed embedHtml={locationData.map_embed_url} />
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
      <div className="px-5 py-8 text-center" >
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Wedding Planning App')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {appData.app_description && (
          <p className="text-base leading-relaxed mb-6" style={{ color: colors.text + 'BB', fontFamily: font }}>
            {appData.app_description}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {appData.app_store_url && (
            <Button
              className="w-full rounded-lg h-10 text-base font-semibold flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              className="w-full rounded-lg h-10 text-base font-semibold flex items-center justify-center gap-2"
              variant="outline"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font, backgroundColor: colors.background }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.primary }}><path d="M3.18 23.76c.3.17.64.22.99.14l12.12-6.99-2.61-2.61-10.5 9.46zM.5 1.26C.19 1.6 0 2.1 0 2.73v18.54c0 .63.19 1.13.5 1.47l.08.07 10.39-10.39v-.24L.58 1.19.5 1.26zM20.13 10.5l-2.76-1.59-2.93 2.93 2.93 2.93 2.78-1.6c.79-.46.79-1.21-.02-1.67zM3.18.24l10.5 9.46-2.61 2.61L.99.1C.64.02.3.07 0 .24L3.18.24z"/></svg>
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
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.accent }} id="contact_form">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {formData.form_title}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {formData.form_description && (
          <p className="text-base leading-relaxed mb-6" style={{ color: colors.text + 'BB', fontFamily: font }}>
            {formData.form_description}
          </p>
        )}

        <Button
          className="w-full rounded-lg h-10 text-base font-semibold"
          style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
          onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Contact Us')}
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
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.accent }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('Wedding Videos')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        <div className="space-y-5">
          {videoContent.map((video: any) => (
            <div key={video.key} className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}>
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
                  <div className="relative w-full h-44 cursor-pointer" onClick={() => { if (videoUrl) setPlayingKey(video.key); }}>
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                        <Video className="w-8 h-8" style={{ color: colors.primary }} />
                      </div>
                    )}
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 4px 16px ${colors.primary}80` }}>
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="px-4 py-3 text-left">
                <h4 className="text-base font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-sm mb-2" style={{ color: colors.text + 'AA', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  {video.duration && (
                    <span className="text-xs" style={{ color: colors.text, fontFamily: font }}>⏱️ {video.duration}</span>
                  )}
                  {video.video_type && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                      {video.video_type.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
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

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    
    return (
      <div className="px-5 py-8 text-center" style={{ backgroundColor: colors.background }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {t('YouTube Channel')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {/* Latest Video */}
        {youtubeData.latest_video_embed && (
          <div className="rounded-2xl overflow-hidden mb-5" style={{ border: `1px solid ${colors.primary}20` }}>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
              />
            </div>
          </div>
        )}

        {/* Channel Info */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF0000' }}>
            <Youtube className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-base font-bold" style={{ color: colors.text, fontFamily: font }}>
              {youtubeData.channel_name || t('Wedding Planning')}
            </p>
            {youtubeData.subscriber_count && (
              <p className="text-sm" style={{ color: colors.text + '99', fontFamily: font }}>
                {youtubeData.subscriber_count} {t('subscribers')}
              </p>
            )}
          </div>
        </div>

        {youtubeData.channel_description && (
          <p className="text-sm mb-4" style={{ color: colors.text + 'AA', fontFamily: font }}>
            {youtubeData.channel_description}
          </p>
        )}

        <div className="space-y-2">
          {youtubeData.channel_url && (
            <Button
              className="w-full rounded-lg"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
            >
              <Youtube className="w-4 h-4 mr-2" />
              {t('Subscribe')}
            </Button>
          )}
          {youtubeData.featured_playlist && (
            <Button
              variant="outline"
              className="w-full rounded-lg"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
            >
              <Heart size={14} className="mr-2" fill={colors.primary} style={{ color: colors.primary }} />
              {t('Wedding Inspiration')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div
        className="px-5 py-7"
        style={{ background: `linear-gradient(180deg, ${colors.accent} 0%, ${colors.background} 100%)` }}
      >
        
        <div className="relative mx-auto mb-4 flex items-center justify-center">
          <Heart className="h-7 w-7" fill={colors.primary} style={{ color: colors.primary }} />
        </div>
        <p
          className="mx-auto max-w-md text-sm leading-7"
          style={{ color: colors.text, fontFamily: font }}
        >
          {thankYouData.message}
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <div className="h-px w-10" style={{ backgroundColor: `${colors.primary}45` }} />
          <Heart size={12} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-10" style={{ backgroundColor: `${colors.primary}45` }} />
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
      <div className="px-5 py-8" style={{ backgroundColor: colors.accent }}>
        <div className="space-y-3">
          {hasContactButton && (
            <Button
              className="w-full h-10 rounded-lg text-base font-semibold"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {actionData.contact_button_text}
            </Button>
          )}

          {hasAppointmentButton && (
            <Button
              className="w-full h-10 rounded-lg text-base font-semibold"
              style={{ backgroundColor: 'transparent', border: `2px solid ${colors.primary}`, color: colors.primary, fontFamily: font }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {actionData.appointment_button_text}
            </Button>
          )}

          {hasSaveContactButton && (
            <Button
              className="w-full h-10 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'transparent', border: `1px solid ${colors.primary}80`, color: colors.primary, fontFamily: font }}
              onClick={() => {
                const headerData = configSections.header || {};
                const contactData = configSections.contact || {};
                const vcfData = {
                  name: headerData.name || data.name || '',
                  title: headerData.tagline || data.title || '',
                  email: contactData.email || data.email || '',
                  phone: contactData.phone || data.phone || '',
                  website: contactData.website || data.website || '',
                  location: contactData.address || ''
                };
                import('@/utils/vcfGenerator').then(module => { module.downloadVCF(vcfData); });
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {actionData.save_contact_button_text}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ backgroundColor: colors.background }}
        id="custom_html"
      >
        <div 
          dangerouslySetInnerHTML={{ __html: customHtmlData.html_content }}
          style={{ fontFamily: font }}
        />
      </div>
    );
  };
  
  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-5 py-8 text-center" id="qr_share">
        <h2 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {qrData.section_title || t('Share & Connect')}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mb-6">
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
          <Heart size={10} fill={colors.primary} style={{ color: colors.primary }} />
          <div className="h-px w-8" style={{ backgroundColor: colors.primary + '50' }} />
        </div>

        {qrData.qr_description && (
          <p className="text-base leading-relaxed mb-6" style={{ color: colors.text + 'BB', fontFamily: font }}>
            {qrData.qr_description}
          </p>
        )}

        <Button
          className="w-full rounded-lg h-10 text-base font-semibold"
          style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
          onClick={() => setShowQrModal(true)}
        >
          <QrCode className="w-4 h-4 mr-2" />
          {t('Share QR Code')}
        </Button>
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
          className="text-sm text-center" 
          style={{ color:'white' }}
        >
          {copyrightData.text}
        </p>
      </div>
    );
  };

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
    
  
  return (
    <div 
      className="w-full overflow-hidden" 
      style={{ 
        fontFamily: font,
        background: colors.background,
        color: colors.text,
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
