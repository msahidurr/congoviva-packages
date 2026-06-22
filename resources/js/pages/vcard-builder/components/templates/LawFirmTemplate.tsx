import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
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
  Linkedin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Calendar, 
  Clock, 
  FileText, 
  Briefcase, 
  Scale, 
  User, 
  Building, 
  ChevronRight, 
  UserPlus,
  Printer,
  ExternalLink,
  Home,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface LawFirmTemplateProps {
  data: any;
  template: any;
}

const LawFirmMapEmbed = React.memo(function LawFirmMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function LawFirmTemplate({ data, template }: LawFirmTemplateProps) {
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
  
  const handleDotClick = (index: number) => {
    setCurrentReview(index);
  };
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
    if (typeof document === 'undefined') return;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderFramedSectionTitle = (title: React.ReactNode) => (
    <div className="mb-6 flex justify-center">
      <div className="relative inline-flex items-center justify-center px-8 py-2">
        <div
          className="text-lg font-bold text-center flex items-center justify-center gap-2"
          style={{
            color: colors.primary,
            fontFamily: font
          }}
        >
          {title}
        </div>
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-5 w-7 border-l-2 border-t-2"
          style={{ borderColor: colors.primary }}
        />
        <span
          aria-hidden="true"
          className="absolute right-0 bottom-0 h-5 w-7 border-b-2 border-r-2"
          style={{ borderColor: colors.primary }}
        />
      </div>
    </div>
  );
  
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
    primary: '#0A3161', 
    secondary: '#1E5091', 
    accent: '#E6ECF2', 
    background: '#FFFFFF', 
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    goldAccent: '#DAA520'
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
  const allSections = getBusinessTemplate('lawfirm')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'practice_areas':
        return renderPracticeAreasSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
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
    <div className="relative">
      {/* Top Bar */}
      <div 
        className="px-5 py-3" 
        style={{ 
          backgroundColor: colors.primary,
          color: colors.accent
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            {configSections.contact?.phone && (
              <a 
                href={`tel:${configSections.contact?.phone}`} 
                className="inline-flex items-center rounded-full px-3 py-1.5 no-underline !text-white hover:!text-white focus:!text-white visited:!text-white"
                style={{ 
                  color: colors.buttonText,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)'
                }}
              >
                <Phone size={12} className="mr-2" />
                {configSections.contact?.phone}
              </a>
            )}
            {configSections.contact?.email && (
              <a 
                href={`mailto:${configSections.contact?.email}`} 
                className="inline-flex items-center rounded-full px-3 py-1.5 no-underline !text-white hover:!text-white focus:!text-white visited:!text-white"
                style={{ 
                  color: colors.buttonText,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)'
                }}
              >
                <Mail size={12} className="mr-2" />
                {configSections.contact?.email}
              </a>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            {/* Language Selector beside Print Button */}
            {(configSections?.language && configSections?.language?.enable_language_switcher) && (
              <div className="relative z-30">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="flex items-center space-x-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer"
                  style={{ 
                    backgroundColor: `rgba(255,255,255,0.12)`,
                    color: colors.buttonText,
                    fontFamily: font,
                    border: `1px solid rgba(255,255,255,0.18)`
                  }}
                >
                  <span className="text-sm">{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || []))}</span>
                </button>
                
                {showLanguageSelector && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] max-h-48 overflow-y-auto z-[999999]">
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 transition-colors flex items-center space-x-2 cursor-pointer ${
                          currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-sm">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <button 
              className="flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all cursor-pointer"
              style={{ 
                color: colors.buttonText,
                backgroundColor: `rgba(255,255,255,0.12)`,
                border: `1px solid rgba(255,255,255,0.18)`,
                fontFamily: font
              }}
              onClick={() => window.print()}
            >
              <Printer size={12} className="mr-2" />
              {t("Print")}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div 
        className="px-5 py-6 text-center" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {headerData.profile_image ? (
          <div className="flex justify-center mb-4">
            <img 
              src={getImageDisplayUrl(headerData.profile_image)} 
              alt={headerData.name} 
              className="h-24 max-w-[220px] object-contain"
            />
          </div>
        ) : (
          <div 
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" 
            style={{ 
              backgroundColor: colors.accent,
              color: colors.primary
            }}
          >
            <Scale size={40} />
          </div>
        )}
        
        <h1 
          className="text-2xl font-bold mb-1" 
          style={{ 
            color: colors.primary,
            fontFamily: font
          }}
        >
          {headerData.name || data.name || 'Johnson & Associates'}
        </h1>
        
        <h2 
          className="text-xl mb-2" 
          style={{ 
            color: colors.secondary,
            fontFamily: font
          }}
        >
          {headerData.title || 'Attorneys at Law'}
        </h2>
        
        {headerData.tagline && (
          <p 
            className="text-sm italic" 
            style={{ color: colors.text }}
          >
            {headerData.tagline}
          </p>
        )}
      </div>
      
      {/* Navigation Tabs */}
      <div 
        className="flex overflow-x-auto py-2 px-1" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <a 
          href="#about" 
          className="whitespace-nowrap px-3 py-1 mx-1 text-sm font-medium rounded"
          onClick={(event) => handleSectionNavigation(event, 'about')}
          style={{ 
            backgroundColor: colors.accent,
            color: colors.primary
          }}
        >
          {t('About')}
        </a>
        <a 
          href="#practice-areas" 
          className="whitespace-nowrap px-3 py-1 mx-1 text-sm font-medium"
          onClick={(event) => handleSectionNavigation(event, 'practice-areas')}
          style={{ color: colors.text }}
        >
          {t('Practice Areas')}
        </a>
        <a 
          href="#services" 
          className="whitespace-nowrap px-3 py-1 mx-1 text-sm font-medium"
          onClick={(event) => handleSectionNavigation(event, 'services')}
          style={{ color: colors.text }}
        >
          {t('Services')}
        </a>
        <a 
          href="#contact" 
          className="whitespace-nowrap px-3 py-1 mx-1 text-sm font-medium"
          onClick={(event) => handleSectionNavigation(event, 'contact')}
          style={{ color: colors.text }}
        >
          {t('Contact')}
        </a>
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
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('About Our Firm'))}
        
        <p 
          className="text-sm leading-relaxed mb-4" 
          style={{ color: colors.text }}
        >
          {aboutData.description || data.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {aboutData.experience && (
            <div 
              className="px-3 py-3 rounded" 
              style={{ 
                backgroundColor: colors.accent,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <p
                className="text-[11px] font-medium uppercase tracking-[0.08em] mb-1"
                style={{ color: colors.primary }}
              >
                {t('YEARS OF EXPERIENCE')}
              </p>
              <p 
                className="text-xl font-bold leading-tight" 
                style={{ color: colors.primary }}
              >
                {aboutData.experience}+
              </p>
            </div>
          )}
          
          <div 
            className="px-3 py-3 rounded" 
            style={{ 
              backgroundColor: colors.accent,
              border: `1px solid ${colors.borderColor}`
            }}
          >
            <p 
              className="text-[11px] font-medium uppercase tracking-[0.08em] mb-1" 
              style={{ color: colors.primary }}
            >
              {t('SATISFIED CLIENTS')}
            </p>
            <p 
              className="text-xl font-bold leading-tight" 
              style={{ color: colors.primary }}
            >
              {aboutData.satisfied_clients || '1000+'}
            </p>
          </div>
        </div>
        
        {(aboutData.education || aboutData.bar_admissions) && (
          <div className="mt-5 grid grid-cols-1 gap-4">
            {aboutData.education && (
              <div>
                <h3 
                  className="text-sm font-bold mb-2" 
                  style={{ color: colors.primary }}
                >
                  {t('Education')}
                </h3>
                <div 
                  className="text-sm whitespace-pre-line" 
                  style={{ color: colors.text }}
                >
                  {aboutData.education}
                </div>
              </div>
            )}
            
            {aboutData.bar_admissions && (
              <div>
                <h3 
                  className="text-sm font-bold mb-2" 
                  style={{ color: colors.primary }}
                >
                  {t('Bar Admissions')}
                </h3>
                <div 
                  className="text-sm whitespace-pre-line" 
                  style={{ color: colors.text }}
                >
                  {aboutData.bar_admissions}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPracticeAreasSection = (practiceAreasData: any) => {
    const areas = practiceAreasData.areas || [];
    if (!Array.isArray(areas) || areas.length === 0) return null;
    
    const getAreaIcon = (iconName: string) => {
      switch(iconName) {
        case 'family': return <User size={20} />;
        case 'corporate': return <Building size={20} />;
        case 'criminal': return <Scale size={20} />;
        case 'real-estate': return <Home size={20} />;
        case 'immigration': return <Globe size={20} />;
        case 'intellectual': return <FileText size={20} />;
        case 'personal-injury': return <User size={20} />;
        case 'tax': return <Briefcase size={20} />;
        default: return <Scale size={20} />;
      }
    };
    
    return (
      <div 
        id="practice-areas"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Practice Areas'))}
        
        <div className="space-y-4">
          {areas.map((area: any, index: number) => (
            <div 
              key={index} 
              className="flex items-center p-4 rounded" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div 
                className="mr-3 p-2 rounded-full flex-shrink-0" 
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                {getAreaIcon(area.icon)}
              </div>
              <div>
                <h3 
                  className="text-base font-bold mb-1" 
                  style={{ 
                    color: colors.primary,
                    fontFamily: font
                  }}
                >
                  {area.title}
                </h3>
                {area.description && (
                  <p 
                    className="text-sm" 
                    style={{ color: colors.text }}
                  >
                    {area.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    const getFeeStructureBadge = (feeType: string) => {
      switch(feeType) {
        case 'hourly': return { bg: '#E6F0FF', text: '#0066CC', label: 'Hourly Rate' };
        case 'flat': return { bg: '#E6F7F2', text: '#00875A', label: 'Flat Fee' };
        case 'contingency': return { bg: '#FFF1E6', text: '#FF5630', label: 'Contingency' };
        case 'retainer': return { bg: '#F2E6FF', text: '#6554C0', label: 'Retainer' };
        case 'consultation': return { bg: '#E6FFFA', text: '#00B8D9', label: 'Free Consultation' };
        default: return { bg: '#F2F2F2', text: '#666666', label: 'Fee Structure' };
      }
    };
    
    return (
      <div 
        id="services"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Legal Services'))}
        
        <div className="space-y-3">
          {services.map((service: any, index: number) => {
            const feeStyle = getFeeStructureBadge(service.fee_structure);
            
            return (
              <div 
                key={index} 
                className="rounded-xl p-4" 
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: `0 6px 18px ${colors.primary}08`
                }}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 
                    className="text-base font-semibold leading-6" 
                    style={{ 
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {service.title}
                  </h3>

                  {service.fee_structure && (
                    <span 
                      className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold" 
                      style={{ 
                        backgroundColor: feeStyle.bg,
                        color: feeStyle.text
                      }}
                    >
                      {feeStyle.label}
                    </span>
                  )}
                </div>
                
                {service.description && (
                  <p 
                    className="mb-3 text-sm leading-6" 
                    style={{ color: colors.text }}
                  >
                    {service.description}
                  </p>
                )}
                
                {service.price && (
                  <div
                    className="text-sm font-semibold"
                    style={{
                      color: colors.secondary
                    }}
                  >
                    {service.price}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    const contactItems = [
      (contactData.phone || data.phone) ? {
        label: t('Phone'),
        value: contactData.phone || data.phone,
        href: `tel:${contactData.phone || data.phone}`,
        icon: <Phone size={18} />
      } : null,
      contactData.fax ? {
        label: t('Fax'),
        value: contactData.fax,
        icon: <Printer size={18} />
      } : null,
      (contactData.email || data.email) ? {
        label: t('Email'),
        value: contactData.email || data.email,
        href: `mailto:${contactData.email || data.email}`,
        icon: <Mail size={18} />
      } : null,
      (contactData.website || data.website) ? {
        label: t('Website'),
        value: contactData.website || data.website,
        href: contactData.website || data.website,
        external: true,
        icon: <Globe size={18} />
      } : null,
      contactData.location ? {
        label: t('Office Location'),
        value: contactData.location,
        icon: <MapPin size={18} />
      } : null
    ].filter(Boolean) as Array<{
      label: string;
      value: string;
      href?: string;
      external?: boolean;
      icon: React.ReactNode;
    }>;

    return (
      <div 
        id="contact"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Contact Information'))}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 mb-6">
          {contactItems.map((item, index) => {
            const isLastOddItem = contactItems.length % 2 === 1 && index === contactItems.length - 1;
            const content = (
              <div
                className="relative mt-3 rounded-xl px-4 pb-4 pt-8 text-center h-full min-h-[96px] flex flex-col justify-center"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: `0 10px 24px ${colors.primary}12`
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-5 w-14 rounded-tl-xl border-l border-t"
                  style={{ borderColor: colors.borderColor }}
                />
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-sm mt-2"
                  style={{
                    backgroundColor: colors.secondary,
                    color: '#FFFFFF',
                    border: `3px solid ${colors.cardBg}`
                  }}
                >
                  {item.icon}
                </div>
                <p
                  className="text-[11px] font-medium uppercase tracking-[0.08em] mb-1 mt-1"
                  style={{ color: colors.text + '99' }}
                >
                  {item.label}
                </p>
                <p
                  className="text-sm font-semibold break-words leading-6"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {item.value}
                </p>
              </div>
            );

            if (item.href) {
              return (
                <a
                  key={index}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={`${isLastOddItem ? 'sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[48%]' : ''} block transition-transform duration-200 hover:-translate-y-0.5`}
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={index}
                className={isLastOddItem ? 'sm:col-span-2 sm:mx-auto sm:w-full sm:max-w-[48%]' : ''}
              >
                {content}
              </div>
            );
          })}
        </div>
        
        <div className="mt-5 space-y-3">
          <Button
            className="w-full mt-4"
            size="sm"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            {t('Contact Us')}
          </Button>
          
          <Button
            className="w-full"
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
            {t('Save Contact')}
          </Button>
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
  };

  const renderVideosSection = (videosData: any) => {
    const formatVideoType = (videoType: string) => {
      const videoTypeMap: Record<string, string> = {
        legal_education: t('Legal Education'),
        case_study: t('Case Study'),
        client_testimonial: t('Client Testimonial'),
        law_explanation: t('Law Explanation'),
        firm_introduction: t('Firm Introduction'),
        legal_tips: t('Legal Tips')
      };

      return videoTypeMap[videoType] || videoType.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    };

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
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Legal Education Videos'))}
        
        <div className="space-y-5">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');

            return (
              <div 
                key={video.key} 
                className="overflow-hidden rounded-2xl" 
                style={{ 
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: `0 10px 26px ${colors.primary}0D`
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
                      className="relative h-52 w-full cursor-pointer"
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
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.18))' }}>
                          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 20px ${colors.primary}55` }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4 className="mb-2 text-base font-bold leading-6" style={{ color: colors.primary, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="mb-4 text-sm leading-6" style={{ color: colors.text, fontFamily: font }}>
                      {video.description}
                    </p>
                  )}
                  {(video.video_type || video.duration) && (
                    <div className="flex flex-wrap items-center gap-2">
                      {video.video_type && (
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em]"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.primary,
                            border: `1px solid ${colors.borderColor}`,
                            fontFamily: font
                          }}
                        >
                          {formatVideoType(video.video_type)}
                        </span>
                      )}
                      {video.duration && (
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.primary,
                            border: `1px solid ${colors.borderColor}`,
                            fontFamily: font
                          }}
                        >
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          {video.duration}
                        </span>
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
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('YouTube Channel'))}

        <div 
          className="rounded-lg overflow-hidden" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="p-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF0000' }}
              >
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base leading-6" style={{ color: colors.primary, fontFamily: font }}>
                  {youtubeData.channel_name || 'Legal Channel'}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-xs" style={{ color: colors.secondary, fontFamily: font }}>
                    {youtubeData.subscriber_count} {t('subscribers')}
                  </p>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="text-sm leading-6 mt-3" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}
          </div>

          {youtubeData.latest_video_embed && (
            <div className="p-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm flex items-center" style={{ color: colors.primary, fontFamily: font }}>
                  <Play className="w-4 h-4 mr-2" />
                  {t("Latest Video")}
                </h4>
                <span className="text-[11px]" style={{ color: colors.text }}>
                  {t('Watch on YouTube')}
                </span>
              </div>
              <div className="rounded overflow-hidden" style={{ border: `1px solid ${colors.borderColor}` }}>
                <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <div 
                    className="absolute inset-0 w-full h-full"
                    ref={createYouTubeEmbedRef(
                      youtubeData.latest_video_embed,
                      { colors, font },
                      'Latest Legal Video'
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-4 grid grid-cols-1 gap-3">
            {youtubeData.channel_url && (
              <Button 
                size="sm" 
                className="w-full" 
                style={{ 
                  backgroundColor: colors.primary, 
                  color: colors.buttonText,
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                <Youtube className="w-4 h-4 mr-2" />
                {t("Visit Channel")}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                <Play className="w-4 h-4 mr-2" />
                {t("Featured Playlist")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    
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
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-sm"
              style={{ 
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              <SocialIcon platform={link.platform} color="currentColor" />
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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Office Hours'))}
        
        <div 
          className="p-4 rounded" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
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
                    className="capitalize font-medium text-sm" 
                    style={{ 
                      color: hour.day === currentDay ? colors.primary : colors.text,
                      fontWeight: hour.day === currentDay ? 'bold' : 'normal'
                    }}
                  >
                   {t(hour.day)}
                  </span>
                  {hour.day === currentDay && (
                    <span 
                      className="ml-2 text-xs px-1 rounded" 
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary
                      }}
                    >
                      {t('Today')}
                    </span>
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

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    // Render star rating
    const renderStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 !== 0;
      
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          stars.push(
            <span key={i} style={{ color: colors.goldAccent }}>★</span>
          );
        } else if (i === fullStars && hasHalfStar) {
          stars.push(
            <span key={i} style={{ color: colors.goldAccent }}>☆</span>
          );
        } else {
          stars.push(
            <span key={i} style={{ color: colors.borderColor }}>☆</span>
          );
        }
      }
      return stars;
    };
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Client Testimonials'))}
        
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
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex text-base">
                        {renderStars(review.rating || 5)}
                      </div>
                      <span 
                        className="text-sm font-medium" 
                        style={{ color: colors.primary }}
                      >
                        {review.rating || 5}/5
                      </span>
                    </div>

                    <p 
                      className="mb-3 text-sm leading-6 italic" 
                      style={{ color: colors.text }}
                    >
                      "{review.review}"
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p 
                          className="text-sm font-bold" 
                          style={{ color: colors.primary }}
                        >
                          {review.client_name}
                        </p>
                      </div>
                      {review.case_type && (
                        <span 
                          className="text-xs px-2 py-1 rounded" 
                          style={{ 
                            backgroundColor: colors.accent,
                            color: colors.primary
                          }}
                        >
                          {review.case_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fixed Dot Navigation */}
          <div className="flex justify-center mt-4 space-x-3">
            {reviews.map((_, dotIndex) => (
              <div
                key={dotIndex}
                className="w-3 h-3 rounded-full transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: dotIndex === currentReview ? colors.primary : colors.accent,
                  border: `2px solid ${dotIndex === currentReview ? colors.primary : colors.borderColor}`,
                  opacity: 1
                }}

                onClick={() => handleDotClick(dotIndex)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.primary,
          color: colors.buttonText,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="text-center">
          <h2 
            className="text-lg font-bold mb-3" 
            style={{ 
              color: '#FFFFFF',
              fontFamily: font
            }}
          >
            {appointmentsData.section_title || t('Need Legal Assistance?')}
          </h2>
          <p 
            className="text-sm mb-4" 
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {appointmentsData.section_description || t('Schedule a consultation with our experienced attorneys to discuss your case.')}
          </p>
          <Button
            size="sm"
            style={{ 
              backgroundColor: 'white',
              color: colors.primary,
              fontFamily: font,
              fontWeight: 'bold'
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {appointmentsData?.consultation_text || t('Schedule a Free Consultation')}
          </Button>
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
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Office Location'))}
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <LawFirmMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <Button 
              size="sm"
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
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t('Mobile App'))}
        
        {appData.app_description && (
          <p 
            className="text-sm mb-4" 
            style={{ color: colors.text }}
          >
            {appData.app_description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <Button 
              size="sm"
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
              size="sm"
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
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(formData.form_title)}

        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: colors.background,
            border: `1.5px solid ${colors.primary}30`
          }}
        >
          {formData.form_description && (
            <p 
              className="text-sm mb-4 leading-6" 
              style={{ color: colors.text }}
            >
              {formData.form_description}
            </p>
          )}
          
          <Button 
            size="sm"
            className="w-full mb-4"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('Send a Message')}
          </Button>
          
          {formData.confidentiality_note && (
            <p 
              className="text-sm italic leading-5" 
              style={{ color: colors.text + '80' }}
            >
              {formData.confidentiality_note}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(thankYouData.title || t('Thank You'))}

        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: colors.borderColor }} />
            <Scale size={16} style={{ color: colors.primary }} />
            <div className="h-px w-12" style={{ backgroundColor: colors.borderColor }} />
          </div>
          <p
            className="mx-auto max-w-xl text-sm leading-7"
            style={{ color: colors.text, fontFamily: font }}
          >
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasConsultationButton = actionData.consultation_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasConsultationButton && !hasSaveContactButton) return null;

    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.primary,
          color: colors.buttonText
        }}
      >
        <div className="space-y-3">
          {hasContactButton && (
            <Button
              className="w-full"
              size="sm"
              style={{ 
                backgroundColor: 'white',
                color: colors.primary,
                fontFamily: font,
                fontWeight: 'bold'
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Mail className="w-4 h-4 mr-2" />
              {actionData.contact_button_text}
            </Button>
          )}

          {hasConsultationButton && (
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              style={{ 
                borderColor: 'white',
                color: 'white',
                backgroundColor: 'transparent',
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {actionData.consultation_button_text}
            </Button>
          )}

          {hasSaveContactButton && (
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              style={{ 
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
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
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && renderFramedSectionTitle(customHtmlData.section_title)}
        <div 
          className="custom-html-content p-4 rounded" 
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
                background-color: ${colors.accent};
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
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderFramedSectionTitle(t("Share Our Firm"))}
        <div 
          className="text-center p-4 rounded" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {qrData.qr_title && (
            <h4 className="font-bold text-base mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}
          
          {qrData.qr_description && (
            <p className="text-sm mb-4" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            size="sm" 
            className="w-full" 
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t("Share QR Code")}
          </Button>
        </div>
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    return (
      <div 
        className="px-5 py-4" 
        style={{ backgroundColor: colors.primary }}
      >
        {copyrightData.text && (
          <p 
            className="text-xs text-center mb-2" 
            style={{ color: '#FFFFFF' }}
          >
            {copyrightData.text}
          </p>
        )}
        
        {copyrightData.disclaimer && (
          <p 
            className="text-xs text-center" 
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {copyrightData.disclaimer}
          </p>
        )}
      </div>
    );
  };

  // Create a style object that will be applied to all text elements
  const globalStyle = {
    fontFamily: font
  };
  
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
      
      {/* Copyright Footer */}
      {configSections.copyright && renderCopyrightSection(configSections.copyright)}
      
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
