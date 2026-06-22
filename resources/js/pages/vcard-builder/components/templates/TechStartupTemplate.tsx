import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook,
  Instagram,
  Youtube,
  Clock, 
  Calendar, 
  Star, 
  ChevronRight, 
  UserPlus,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Code,
  Cloud,
  Database,
  Smartphone,
  Monitor,
  Shield,
  BarChart,
  Cpu,
  Zap,
  Settings,
  Users,
  TrendingUp,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionData } from '@/utils/sectionHelpers';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface TechStartupTemplateProps {
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

const TechStartupMapEmbed = React.memo(function TechStartupMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function TechStartupTemplate({ data, template }: TechStartupTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activePricingTab, setActivePricingTab] = useState<string>('1');
  
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
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#2563EB', 
    secondary: '#3B82F6', 
    accent: '#EFF6FF', 
    background: '#FFFFFF', 
    text: '#1E293B',
    cardBg: '#F8FAFC',
    borderColor: '#E2E8F0',
    buttonText: '#FFFFFF',
    highlightColor: '#38BDF8'
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
  const allSections = getBusinessTemplate('tech-startup')?.sections || [];

  // Helper function to get icon component
  const getServiceIcon = (iconName: string, size: number = 20) => {
    switch(iconName) {
      case 'code': return <Code size={size} />;
      case 'cloud': return <Cloud size={size} />;
      case 'database': return <Database size={size} />;
      case 'mobile': return <Smartphone size={size} />;
      case 'desktop': return <Monitor size={size} />;
      case 'security': return <Shield size={size} />;
      case 'analytics': return <BarChart size={size} />;
      case 'ai': return <Cpu size={size} />;
      case 'zap': return <Zap size={size} />;
      case 'shield': return <Shield size={size} />;
      case 'settings': return <Settings size={size} />;
      case 'users': return <Users size={size} />;
      case 'trending-up': return <TrendingUp size={size} />;
      case 'smartphone': return <Smartphone size={size} />;
      case 'globe': return <Globe size={size} />;
      case 'clock': return <Clock3 size={size} />;
      default: return <Code size={size} />;
    }
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
      case 'features':
        return renderFeaturesSection(sectionData);
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
      case 'pricing':
        return renderPricingSection(sectionData);
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
      {/* Modern Header with Gradient Background */}
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
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            {/* Tech pattern overlay */}
            <div className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        )}
        

        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          {/* Logo */}
          {headerData.logo && (
            <div className="mb-4">
              <div 
                className="w-16 h-16 rounded-lg overflow-hidden shadow-lg mx-auto" 
                style={{ 
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
          
          {/* Company Name and Tagline */}
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ 
              color: colors.background,
              fontFamily: font
            }}
          >
            {headerData.name || data.name || t('NexaTech')}
          </h1>
          
          {headerData.tagline && (
            <p 
              className="text-lg font-medium mb-6" 
              style={{ 
                color: colors.background + 'E6'
              }}
            >
              {headerData.tagline}
            </p>
          )}
          
          {/* CTA Button */}
          {headerData.cta_text && (
            <Button
              className="px-6 py-2 font-medium shadow-lg"
              style={{ 
                backgroundColor: colors.background,
                color: colors.primary
              }}
              onClick={() => {
                if (headerData.cta_url && headerData.cta_url.startsWith('#')) {
                  const sectionId = headerData.cta_url.substring(1);
                  const element = typeof document !== "undefined" && document.getElementById(sectionId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                } else if (headerData.cta_url) {
                  typeof window !== "undefined" && window.open(headerData.cta_url, "_blank", "noopener,noreferrer");
                }
              }}
            >
              {headerData.cta_text}
            </Button>
          )}
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <div 
        className="px-5 py-3 flex justify-center space-x-4 shadow-md"
        style={{ backgroundColor: colors.background }}
      >
        {configSections.contact?.phone && (
          <a 
            href={`tel:${configSections.contact?.phone}`} 
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.primary
            }}
          >
            <Phone size={18} />
          </a>
        )}
        
        {configSections.contact?.email && (
          <a 
            href={`mailto:${configSections.contact?.email}`} 
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.primary
            }}
          >
            <Mail size={18} />
          </a>
        )}
        
        {configSections.contact?.address && (
          <a 
            href={configSections.google_map?.directions_url || `https://maps.google.com/?q=${encodeURIComponent(configSections.contact?.address)}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
            style={{ 
              backgroundColor: colors.accent,
              color: colors.primary
            }}
          >
            <MapPin size={18} />
          </a>
        )}
        
        <button 
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer"
          style={{ 
            backgroundColor: colors.accent,
            color: colors.primary
          }}
        >
          <MessageSquare size={18} />
        </button>
        
        {/* Language Selector beside Chat button */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer"
              style={{ 
                backgroundColor: colors.accent,
                color: colors.primary
              }}
            >
              <span className="text-sm">{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || []))}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border py-2 min-w-[150px] max-h-48 overflow-y-auto" style={{ borderColor: colors.borderColor }}>
                {languageData.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center space-x-2 cursor-pointer ${
                      currentLanguage === lang.code ? 'font-semibold' : ''
                    }`}
                    style={{
                      backgroundColor: currentLanguage === lang.code ? colors.accent : 'transparent',
                      color: currentLanguage === lang.code ? colors.primary : colors.text
                    }}
                  >
                    <span className="text-base">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                    <span>{lang.name}</span>
                    {currentLanguage === lang.code && <Code size={12} style={{ color: colors.primary }} />}
                  </button>
                ))}
              </div>
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

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;

    const aboutHighlights = [
      aboutData.year_founded
        ? {
            label: t('Founded'),
            value: aboutData.year_founded,
          }
        : null,
      aboutData.company_size
        ? {
            label: t('Team Size'),
            value: aboutData.company_size.replace(/_/g, ' '),
          }
        : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;

    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="about"
      >
        <div className="text-center mb-8">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('About Us')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>

        <p 
          className="text-sm leading-7 sm:text-base" 
          style={{ color: colors.text }}
        >
          {aboutData.description || data.description}
        </p>

        {aboutHighlights.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {aboutHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border px-4 py-4"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.borderColor,
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: colors.primary }}
                >
                  {item.label}
                </p>
                <p
                  className="mt-2 text-base font-semibold capitalize"
                  style={{ color: colors.text }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const offerings = servicesData.offerings || [];
    if (!Array.isArray(offerings) || offerings.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="services"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Our Services')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-5">
          {offerings.map((service: any, index: number) => (
            <div 
              key={index} 
              className="group rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="flex items-start gap-4 p-5">
                <div className="shrink-0">
                  {service.image ? (
                    <div className="relative">
                      <img 
                        src={getImageDisplayUrl(service.image)} 
                        alt={service.name || 'Service'} 
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div
                        className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full shadow-sm"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.primary,
                          border: `1px solid ${colors.borderColor}`
                        }}
                      >
                        {getServiceIcon(service.icon, 16)}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                        color: colors.buttonText
                      }}
                    >
                      {getServiceIcon(service.icon, 24)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 
                    className="text-base font-bold" 
                    style={{ 
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {service.name}
                  </h3>
                  
                  <p 
                    className="mt-2 text-sm leading-6" 
                    style={{ color: `${colors.text}B3` }}
                  >
                    {service.description}
                  </p>
                  
                  {service.link && (
                    <a 
                      href={service.link}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
                      style={{ color: colors.primary }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('Learn More')}
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeaturesSection = (featuresData: any) => {
    const features = featuresData.feature_list || [];
    if (!Array.isArray(features) || features.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="features"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Key Features')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature: any, index: number) => (
            <div 
              key={index} 
              className="rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" 
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                {feature.image ? (
                  <div 
                    className="rounded-2xl p-1.5"
                    style={{ backgroundColor: colors.background }}
                  >
                    <img 
                      src={getImageDisplayUrl(feature.image)} 
                      alt={feature.title || 'Feature'} 
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      color: colors.buttonText
                    }}
                  >
                    {getServiceIcon(feature.icon, 22)}
                  </div>
                )}

                <div 
                  className="h-px flex-1"
                  style={{ backgroundColor: colors.borderColor }}
                />
              </div>
              
              <h3 
                className="text-base font-bold mb-2" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {feature.title}
              </h3>
              
              <p 
                className="text-sm leading-6" 
                style={{ color: `${colors.text}B3` }}
              >
                {feature.description}
              </p>
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

    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;
    
    const videoContent = videos.map((video: any, index: number) => {
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
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="videos"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Product Videos')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div 
              key={video.key} 
              className="overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" 
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
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
                      className="relative h-48 w-full cursor-pointer overflow-hidden"
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={video.title || 'Video'}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${colors.primary}20 0%, ${colors.secondary}20 100%)` }}
                        >
                          <Video className="w-8 h-8" style={{ color: colors.primary }} />
                        </div>
                      )}
                      <div
                        className="absolute inset-x-0 bottom-0 h-24"
                        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)' }}
                      />
                      {(video.video_type || video.duration) && (
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          {video.video_type && (
                            <span
                              className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.92)',
                                color: colors.primary
                              }}
                            >
                              {video.video_type.replace(/_/g, ' ')}
                            </span>
                          )}
                          {video.duration && (
                            <span
                              className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                              style={{
                                backgroundColor: 'rgba(15,23,42,0.72)',
                                color: '#FFFFFF'
                              }}
                            >
                              {video.duration}
                            </span>
                          )}
                        </div>
                      )}
                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-full"
                            style={{ backgroundColor: colors.primary, boxShadow: `0 8px 24px ${colors.primary}66` }}
                          >
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-bold" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-sm leading-6" style={{ color: `${colors.text}B3`, fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                {video.tech_stack && (
                  <div className="mt-3">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {video.tech_stack}
                    </span>
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
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="youtube"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
        >
          {t('YouTube Channel')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div
          className="overflow-hidden rounded-2xl border shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: '#FF0000',
                  color: '#FFFFFF'
                }}
              >
                <Youtube className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold leading-tight" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || t('Tech Channel')}
                </h3>

                {youtubeData.subscriber_count && (
                  <p
                    className="mt-1 text-sm font-medium"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {youtubeData.subscriber_count} {t("subscribers")}
                  </p>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: `${colors.text}B3`, fontFamily: font }}
              >
                {youtubeData.channel_description}
              </p>
            )}

            {(youtubeData.channel_url || youtubeData.featured_playlist) && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {youtubeData.channel_url && (
                  <Button 
                    className="w-full rounded-xl px-3 py-2.5 font-bold" 
                    style={{ 
                      backgroundColor: '#FF0000', 
                      color: '#FFFFFF',
                      fontFamily: font 
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                  >
                    <Youtube className="mr-2 h-4 w-4" />
                    {t('Subscribe')}
                  </Button>
                )}
                {youtubeData.featured_playlist && (
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl px-3 py-2.5 font-bold" 
                    style={{ 
                      borderColor: colors.borderColor, 
                      color: colors.text, 
                      backgroundColor: colors.background,
                      fontFamily: font 
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                  >
                    <Play className="mr-2 h-4 w-4" style={{ color: colors.primary }} />
                    {t('Playlist')}
                  </Button>
                )}
              </div>
            )}
          </div>

          {youtubeData.latest_video_embed && (
            <div
              className="border-t"
              style={{ borderColor: colors.borderColor }}
            >
              <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                <div 
                  className="absolute inset-0 w-full h-full"
                  ref={createYouTubeEmbedRef(
                    youtubeData.latest_video_embed,
                    { colors, font },
                    'Latest Tech Video'
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div 
      className="px-5 py-8" 
      style={{ 
        backgroundColor: colors.background
      }}
      id="contact"
    >
      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-bold mb-2" 
          style={{ 
            color: colors.text,
            fontFamily: font
          }}
        >
          {t("Contact Us")}
        </h2>
        <div 
          className="w-16 h-1 mx-auto rounded-full" 
          style={{ backgroundColor: colors.primary }}
        ></div>
      </div>
      
      <div className="space-y-3">
        {contactData.address && (
          <div 
            className="rounded-2xl border px-4 py-3.5 shadow-sm" 
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                <MapPin size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p 
                  className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em]" 
                  style={{ color: colors.primary }}
                >
                  {t('ADDRESS')}
                </p>
                <p 
                  className="text-[15px] leading-6" 
                  style={{ color: colors.text }}
                >
                  {contactData.address}
                </p>
                
                {configSections.google_map?.directions_url && (
                  <a 
                    href={configSections.google_map?.directions_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {t('Get Directions')}
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-4">
          {(contactData.phone || data.phone) && (
            <div 
              className="rounded-2xl border px-4 py-3.5 shadow-sm" 
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.primary
                  }}
                >
                  <Phone size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p 
                    className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em]" 
                    style={{ color: colors.primary }}
                  >
                    {t('PHONE')}
                  </p>
                  <a 
                    href={`tel:${contactData.phone || data.phone}`} 
                    className="text-[15px] font-medium break-words" 
                    style={{ color: colors.text }}
                  >
                    {contactData.phone || data.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {(contactData.email || data.email) && (
            <div 
              className="rounded-2xl border px-4 py-3.5 shadow-sm" 
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.primary
                  }}
                >
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p 
                    className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em]" 
                    style={{ color: colors.primary }}
                  >
                    {t('EMAIL')}
                  </p>
                  <a 
                    href={`mailto:${contactData.email || data.email}`} 
                    className="block text-[15px] font-medium break-all" 
                    style={{ color: colors.text }}
                  >
                    {contactData.email || data.email}
                  </a>
                </div>
              </div>
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    

    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-transform hover:scale-110"
              style={{ 
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              <SocialIcon platform={link.platform} color="#FFFFFF" />
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
    
    // Find current day's hours
    const todayHours = hours.find(h => h.day === currentDay);
    const isOpenNow = todayHours && !todayHours.is_closed;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Office Hours')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div 
          className="p-4 rounded-lg" 
          style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <p 
              className="text-sm font-medium" 
              style={{ color: colors.text }}
            >
              {t('Current Status')}
            </p>
            
            {isOpenNow ? (
              <Badge 
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.buttonText
                }}
              >
                {t('Open Now')}
              </Badge>
            ) : (
              <Badge 
                style={{ 
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF'
                }}
              >
                {t('Closed Now')}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            {hours.map((hour: any, index: number) => (
              <div 
                key={index} 
                className="flex justify-between items-center py-2"
                style={{ 
                  borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
                }}
              >
                <div className="flex items-center">
                  <span 
                    className="capitalize text-sm font-medium" 
                    style={{ 
                      color: hour.day === currentDay ? colors.primary : colors.text,
                      fontWeight: hour.day === currentDay ? 'bold' : 'normal'
                    }}
                  >
                    {t(hour.day)}
                  </span>
                  
                  {hour.is_remote && (
                    <Badge 
                      className="ml-2 text-xs" 
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary
                      }}
                    >
                      {t('Remote')}
                    </Badge>
                  )}
                </div>
                
                <span 
                  className="text-sm" 
                  style={{ 
                    color: hour.is_closed ? colors.text + '80' : colors.text
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

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Gallery')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="space-y-4">
          {photos.map((photo: any, index: number) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-2xl border shadow-sm"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="overflow-hidden">
                {photo.image ? (
                  <img 
                    src={getImageDisplayUrl(photo.image)} 
                    alt={photo.caption || `Gallery image ${index + 1}`} 
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div 
                    className="flex h-52 w-full items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Code size={24} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>

              {photo.caption && (
                <div className="px-4 py-3">
                  <p
                    className="text-sm leading-6"
                    style={{ color: `${colors.text}B3` }}
                  >
                    {photo.caption}
                  </p>
                </div>
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
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Client Testimonials')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="rounded-2xl border p-4 shadow-sm" 
                    style={{ 
                      backgroundColor: colors.cardBg,
                      borderColor: colors.borderColor
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.primary
                          }}
                        >
                          <MessageSquare size={16} />
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < parseInt(review.rating || 5) ? colors.highlightColor : 'transparent'} 
                              stroke={i < parseInt(review.rating || 5) ? colors.highlightColor : colors.borderColor}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p 
                      className="mb-4 text-sm leading-6" 
                      style={{ color: colors.text }}
                    >
                      {review.review}
                    </p>
                    
                    <div className="flex items-center">
                      {review.client_image ? (
                        <div className="mr-3 h-10 w-10 overflow-hidden rounded-full">
                          <img 
                            src={getImageDisplayUrl(review.client_image)} 
                            alt={review.client_name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="mr-3 flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <Users size={15} style={{ color: colors.primary }} />
                        </div>
                      )}
                      
                      <div>
                        <p 
                          className="text-sm font-bold" 
                          style={{ color: colors.text, fontFamily: font }}
                        >
                          {review.client_name}
                        </p>
                        
                        {(review.position || review.company) && (
                          <p 
                            className="text-xs leading-4" 
                            style={{ color: `${colors.text}99` }}
                          >
                            {review.position}{review.position && review.company ? ', ' : ''}{review.company}
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
            <div className="mt-4 flex justify-center space-x-2">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{ 
                    width: currentReview === index ? '24px' : '10px',
                    backgroundColor: currentReview === index ? colors.primary : `${colors.primary}40`
                  }}
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
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="demo"
      >
        <div className="text-center mb-5">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Request a Demo')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div 
          className="rounded-2xl border p-3.5 shadow-sm" 
          style={{ 
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
          <div className="flex items-start gap-2.5">
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary
              }}
            >
              <Calendar className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              {appointmentsData.demo_description && (
                <p 
                  className="text-sm leading-[1.75]" 
                  style={{ color: colors.text }}
                >
                  {appointmentsData.demo_description}
                </p>
              )}
            </div>
          </div>

          {appointmentsData.demo_description && (
            <div className="mt-2.5 h-px" style={{ backgroundColor: colors.borderColor }} />
          )}
          
          {appointmentsData.demo_length && (
            <div 
              className="mt-2.5 flex items-center rounded-lg px-2.5 py-2" 
              style={{ backgroundColor: colors.background }}
            >
              <div
                className="mr-2.5 flex h-7 w-7 items-center justify-center rounded-md"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                <Clock3 size={15} />
              </div>
              <p 
                className="text-sm font-medium" 
                style={{ color: colors.text }}
              >
                <span style={{ color: colors.primary }}>{t('Demo Duration')}:</span> {appointmentsData.demo_length}
              </p>
            </div>
          )}
          
          <Button
            className="mt-2.5 w-full rounded-xl py-2.5 font-semibold"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {appointmentsData.booking_text || t('Schedule a Demo')}
          </Button>
        </div>
      </div>
    );
  };

  const renderTeamSection = (teamData: any) => {
    const members = teamData.members || [];
    if (!Array.isArray(members) || members.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="team"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Our Team')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {members.map((member: any, index: number) => (
            <div 
              key={index} 
              className="rounded-2xl border p-4 shadow-sm" 
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="flex items-start gap-4">
                {member.image ? (
                  <div
                    className="shrink-0 rounded-2xl p-1.5"
                    style={{ backgroundColor: colors.background }}
                  >
                    <img 
                      src={getImageDisplayUrl(member.image)} 
                      alt={member.name} 
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  </div>
                ) : (
                  <div 
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Users size={22} style={{ color: colors.primary }} />
                  </div>
                )}
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 
                        className="text-lg font-bold leading-tight" 
                        style={{ 
                          color: colors.text,
                          fontFamily: font
                        }}
                      >
                        {member.name}
                      </h3>
                      
                      {member.title && (
                        <p 
                          className="mt-1 text-xs font-semibold uppercase tracking-[0.12em]" 
                          style={{ color: colors.primary }}
                        >
                          {member.title}
                        </p>
                      )}
                    </div>
                    
                    {member.linkedin && (
                      <a 
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ 
                          backgroundColor: colors.background,
                          color: colors.primary,
                          border: `1px solid ${colors.borderColor}`
                        }}
                      >
                        <Linkedin size={15} />
                      </a>
                    )}
                  </div>
                  
                  {member.bio && (
                    <p 
                      className="mt-3 text-sm leading-6" 
                      style={{ color: `${colors.text}B3` }}
                    >
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPricingSection = (pricingData: any) => {
    const plans = pricingData.plans || [];
    if (!Array.isArray(plans) || plans.length === 0) return null;
    
    // Set active tab to the popular plan if available
    React.useEffect(() => {
      const popularPlanIndex = plans.findIndex(plan => plan.is_popular);
      if (popularPlanIndex !== -1) {
        setActivePricingTab(popularPlanIndex.toString());
      }
    }, [plans]);
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
        id="pricing"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Pricing Plans')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        {/* Plan tabs */}
        <div className="mb-4 flex justify-center">
          <div
            className="inline-flex flex-wrap justify-center gap-2 rounded-2xl p-1.5"
            style={{ backgroundColor: colors.cardBg }}
          >
          {plans.map((plan: any, index: number) => (
            <button
              key={index}
              className="relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer"
              style={{ 
                color: activePricingTab === index.toString() ? '#FFFFFF' : `${colors.text}99`,
                backgroundColor: activePricingTab === index.toString() ? colors.primary : 'transparent'
              }}
              onClick={() => setActivePricingTab(index.toString())}
            >
              <span>{plan.name}</span>
              {plan.is_popular && (
                <span 
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ 
                    backgroundColor: activePricingTab === index.toString() ? colors.background : colors.primary,
                    color: activePricingTab === index.toString() ? colors.primary : '#FFFFFF'
                  }}
                >
                  {t('Popular')}
                </span>
              )}
            </button>
          ))}
          </div>
        </div>
        
        {/* Plan details */}
        {plans.map((plan: any, index: number) => (
          <div 
            key={index} 
            className={`rounded-2xl border p-4 shadow-sm ${activePricingTab === index.toString() ? 'block' : 'hidden'}`}
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: plan.is_popular ? colors.primary : colors.borderColor,
              boxShadow: plan.is_popular ? `0 12px 30px ${colors.primary}14` : undefined
            }}
          >
            <div className="mb-4 text-center">
              {plan.is_popular && (
                <div className="mb-2">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary
                    }}
                  >
                    {t('Popular')}
                  </span>
                </div>
              )}
              <h3 
                className="mb-1 text-xl font-bold" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {plan.name}
              </h3>
              
              <div className="mb-2">
                <span 
                  className="text-2xl font-extrabold leading-none" 
                  style={{ color: colors.primary }}
                >
                  {plan.price}
                </span>
                {plan.billing_period && plan.billing_period !== 'custom' && (
                  <span 
                    className="text-sm" 
                    style={{ color: colors.text + '99' }}
                  >
                    {' '}/{plan.billing_period}
                  </span>
                )}
              </div>
              
              {plan.description && (
                <p 
                  className="mx-auto max-w-xl text-sm leading-5" 
                  style={{ color: `${colors.text}B3` }}
                >
                  {plan.description}
                </p>
              )}
            </div>
            
            {plan.features && (
              <div
                className="mb-4 rounded-2xl px-4 py-3"
                style={{ backgroundColor: colors.background }}
              >
                <ul className="space-y-1.5">
                  {plan.features.split('\n').map((feature: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 
                        size={15} 
                        className="mr-2 flex-shrink-0 mt-0.5" 
                        style={{ color: colors.primary }}
                      />
                      <span 
                        className="text-sm leading-6" 
                        style={{ color: colors.text }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button
              className="w-full rounded-xl py-2.5 font-semibold"
              style={{ 
                backgroundColor: plan.is_popular ? colors.primary : colors.background,
                color: plan.is_popular ? colors.buttonText : colors.primary,
                border: `1px solid ${colors.primary}`,
                fontFamily: font
              }}
              onClick={() => {
                if (plan.cta_url && plan.cta_url.startsWith('#')) {
                  const sectionId = plan.cta_url.substring(1);
                  const element = typeof document !== "undefined" && document.getElementById(sectionId);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                } else if (plan.cta_url) {
                  typeof window !== "undefined" && window.open(plan.cta_url, "_blank", "noopener,noreferrer");
                } else {
                  typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'));
                }
              }}
            >
              {plan.cta_text || t('Get Started')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.directions_url) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Our Location')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <TechStartupMapEmbed embedHtml={locationData.map_embed_url} />
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
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t('Mobile App')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div 
          className="rounded-2xl border p-3.5 shadow-sm" 
          style={{ 
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
          <div className="space-y-3">
            {appData.app_image && (
              <div className="w-full">
                <div
                  className="overflow-hidden rounded-2xl p-1.5"
                  style={{ backgroundColor: colors.background }}
                >
                  <img 
                    src={getImageDisplayUrl(appData.app_image)} 
                    alt="App Screenshot" 
                    className="h-40 w-full rounded-xl object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="min-w-0">
              {appData.app_description && (
                <p 
                  className="mb-3 text-sm leading-6" 
                  style={{ color: colors.text }}
                >
                  {appData.app_description}
                </p>
              )}
              
              {appData.app_features && (
                <div
                  className="mb-3 rounded-2xl px-3.5 py-2.5"
                  style={{ backgroundColor: colors.background }}
                >
                  <ul className="space-y-1.5">
                    {appData.app_features.split('\n').map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 
                          size={15} 
                          className="mr-2 mt-0.5 flex-shrink-0" 
                          style={{ color: colors.primary }}
                        />
                        <span 
                          className="text-sm leading-6" 
                          style={{ color: colors.text }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {appData.app_store_url && (
                  <Button 
                    variant="outline" 
                    className="w-full rounded-xl py-2.5 font-semibold"
                    style={{ 
                      borderColor: colors.primary,
                      color: colors.primary,
                      backgroundColor: colors.background,
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
                    className="w-full rounded-xl py-2.5 font-semibold"
                    style={{ 
                      borderColor: colors.primary,
                      color: colors.primary,
                      backgroundColor: colors.background,
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
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ 
          backgroundColor: colors.background
        }}
        id="contact_form"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
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

        <div
          className="rounded-2xl border p-4 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary
              }}
            >
              <Mail className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              {formData.form_description && (
                <p 
                  className="text-sm leading-6" 
                  style={{ color: colors.text }}
                >
                  {formData.form_description}
                </p>
              )}
            </div>
          </div>

          <Button 
            className="mt-4 w-full rounded-xl py-3 font-semibold"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t('Contact Us')}
          </Button>
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
          className="rounded-2xl border p-4 shadow-sm sm:p-5"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: customHtmlData.html_content }}
            style={{ fontFamily: font, color: colors.text }}
          />
        </div>
      </div>
    );
  };
  
  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ backgroundColor: colors.background }}
        id="qr_share"
      >
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {qrData.section_title || t('Share & Connect')}
          </h2>
          <div 
            className="w-16 h-1 mx-auto rounded-full" 
            style={{ backgroundColor: colors.primary }}
          ></div>
        </div>
        
        <div 
          className="rounded-2xl border p-4 shadow-sm text-center" 
          style={{ 
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary
            }}
          >
            <QrCode className="h-6 w-6" />
          </div>

          {qrData.qr_description && (
            <p 
              className="mb-4 text-sm leading-6" 
              style={{ color: `${colors.text}B3` }}
            >
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            className="w-full rounded-xl py-3 font-semibold" 
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t('Share QR Code')}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div
        className="px-5 py-8"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              color: colors.text,
              fontFamily: font
            }}
          >
            {thankYouData.title || t('Thank You')}
          </h2>
          <div
            className="w-16 h-1 mx-auto rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        </div>

        <div
          className="rounded-2xl border px-5 py-5 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
        <p
          className="text-sm leading-7"
          style={{ color: `${colors.text}B3`, fontFamily: font }}
        >
          {thankYouData.message}
        </p>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasDemoButton = actionData.demo_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasDemoButton && !hasSaveContactButton) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.background, borderTop: `1px solid ${colors.borderColor}` }}>
        <div className="space-y-3">
        {hasContactButton && (
          <Button
            className="w-full rounded-xl py-3 font-semibold"
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

        {hasDemoButton && (
          <Button
            className="w-full rounded-xl py-3 font-semibold"
            style={{
              backgroundColor: colors.secondary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.demo_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <div>
            <Button
              className="w-full rounded-xl py-3 font-semibold"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: colors.background,
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
              <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {actionData.save_contact_button_text}
            </Button>
          </div>
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
          style={{ color: '#FFFFFF' }}
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
      className="w-full overflow-hidden rounded-lg" 
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
