import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Calendar, 
  Clock, 
  Award, 
  Dumbbell, 
  User, 
  Star, 
  ChevronRight, 
  Download, 
  UserPlus,
  Video,
  Play,
  QrCode,
  Activity,
  PersonStanding,
  Salad,
  Users
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';

interface FitnessTemplateProps {
  data: any;
  template: any;
}

const FitnessMapEmbed = React.memo(function FitnessMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function FitnessTemplate({ data, template }: FitnessTemplateProps) {
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
    primary: '#FF4136', 
    secondary: '#FF725C', 
    accent: '#FFCEC9', 
    background: '#FFFFFF', 
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
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
  const allSections = getBusinessTemplate('fitness')?.sections || [];

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

  const renderPatternTitle = (title: string, icon?: React.ReactNode, className = 'mb-4') => (
    <div className={`${className} flex flex-col items-center`}>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <h3
            className="text-[17px] font-black"
            style={{ color: colors.primary, fontFamily: font, lineHeight: 1 }}
          >
            <span className="inline-block">{title}</span>
          </h3>
          <div className="mt-2 flex justify-center">
            <span
              className="block h-[2px] rounded-full"
              style={{
                backgroundColor: colors.secondary,
                width: `${Math.max(String(title).length * 7, 36)}px`,
                maxWidth: '100%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
        
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'transformation':
        return renderTransformationSection(sectionData);
      case 'programs':
        return renderProgramsSection(sectionData);
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
      {/* Cover Image */}
      <div className="relative h-52 rounded-t-2xl">
        <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
          {headerData.cover_image ? (
            <img 
              src={getImageDisplayUrl(headerData.cover_image)} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="flex h-full w-full items-center justify-center px-6 text-center" 
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              }}
            >
              <div className="relative z-10 mt-2">
                <p
                  className="text-lg font-semibold uppercase tracking-[0.35em]"
                  style={{color:'white'}}
                >
                  {t('Fitness Trainer')}
                </p>
              </div>
            </div>
          )}
          
          {/* Overlay */}
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          ></div>
        </div>
        
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="absolute top-4 right-4">
            <div className="relative z-30">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLanguageSelector(!showLanguageSelector);
                }}
                className="cursor-pointer w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center transition-all hover:shadow-md"
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
                    style={{ zIndex: 60 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div 
                    className="absolute right-0 top-full mt-2 rounded border shadow-xl py-1 w-40 max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.borderColor,
                      zIndex: 70
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          changeLanguage(lang.code);
                        }}
                        className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-50 transition-colors cursor-pointer"
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
          </div>
        )}
        
        {/* Logo */}
        {(headerData.logo || headerData.profile_image) && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
            <div 
              className="flex h-25 w-25 items-center justify-center overflow-hidden rounded-full border-4 shadow-lg" 
              style={{ 
                borderColor: colors.background,
                backgroundColor: colors.background
              }}
            >
              {headerData.logo || headerData.profile_image ? (
                <img 
                  src={getImageDisplayUrl(headerData.logo || headerData.profile_image)} 
                  alt={headerData.name} 
                  className="h-full w-full scale-150 object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Dumbbell size={32} style={{ color: colors.primary }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Business Name and Tagline */}
      <div 
        className="pt-16 pb-4 px-5 text-center" 
        style={{ backgroundColor: colors.background }}
      >
        <h1 
          className="text-2xl font-bold mb-1" 
          style={{ 
            color: colors.primary,
            fontFamily: font
          }}
        >
          {headerData.name || data.name || 'Alex Fitness'}
        </h1>

        {(headerData.title || data.title) && (
          <p
            className="text-sm font-semibold tracking-[0.2em] mb-2"
            style={{ color: colors.text }}
          >
            {headerData.title || data.title}
          </p>
        )}
        
        {headerData.tagline && (
          <p 
            className="text-sm italic" 
            style={{ color: colors.text }}
          >
            {headerData.tagline}
          </p>
        )}

        {headerData.motivational_quote && (
          <p
            className="mt-3 text-sm font-medium italic"
            style={{ color: colors.secondary }}
          >
            "{headerData.motivational_quote}"
          </p>
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

    const profileName = configSections.header?.name || data.name;

    const specialties = aboutData.specialties
      ? aboutData.specialties.split(',').map((specialty: string) => specialty.trim()).filter(Boolean)
      : [];

    const certifications = aboutData.certifications
      ? aboutData.certifications.split(',').map((cert: string) => cert.trim()).filter(Boolean)
      : [];

    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t('About Me'), <User size={18} />, 'mb-4')}

        <div
          className="rounded-[22px] px-4 py-4"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex shrink-0 items-center justify-center"
                style={{
                  color: colors.primary     
                }}
              >
                <User size={19} />
              </div>

              <h4
                className="text-base font-bold"
                style={{ color: colors.text, fontFamily: font }}
              >
                {profileName || t('About Me')}
              </h4>
            </div>

            {aboutData.experience && (
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: `${colors.primary}12`,
                  color: colors.primary
                }}
              >
                {aboutData.experience} {t('Years Experience')}
              </span>
            )}
          </div>

          <p 
            className="text-sm leading-7" 
            style={{ color: colors.text }}
          >
            {aboutData.description || data.description}
          </p>

          {(specialties.length > 0 || certifications.length > 0) && (
            <div className="mt-4 space-y-3">
              {specialties.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Award size={13} style={{ color: colors.primary }} />
                    <p
                      className="text-xs font-bold uppercase tracking-[0.16em]"
                      style={{ color: colors.primary }}
                    >
                      {t("Specialties")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full px-3 py-1.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${colors.primary}08`,
                          color: colors.text,
                          border: `1px solid ${colors.primary}30`,
                          boxShadow: `inset 0 0 0 1px ${colors.background}`
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certifications.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Star size={13} style={{ color: colors.primary }} />
                    <p
                      className="text-xs font-bold uppercase tracking-[0.16em]"
                      style={{ color: colors.primary }}
                    >
                      {t("Certifications")}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert: string, index: number) => (
                      <span
                        key={index}
                        className="rounded-full px-3 py-1 text-xs"
                        style={{
                          backgroundColor: `${colors.primary}10`,
                          color: colors.text
                        }}
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    const contactItems = [
      {
        label: t('Email'),
        value: contactData.email || data.email,
        href: contactData.email || data.email ? `mailto:${contactData.email || data.email}` : null,
        icon: Mail
      },
      {
        label: t('Phone'),
        value: contactData.phone || data.phone,
        href: contactData.phone || data.phone ? `tel:${contactData.phone || data.phone}` : null,
        icon: Phone
      },
      {
        label: t('Website'),
        value: contactData.website || data.website,
        href: contactData.website || data.website || null,
        icon: Globe,
        external: true
      },
      {
        label: t('Location'),
        value: contactData.location || data.location,
        href: null,
        icon: MapPin
      }
    ].filter((item) => item.value);

    if (contactItems.length === 0) return null;

    return (
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: colors.borderColor }}
      >
        <div className="relative mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <h3
                  className="text-[17px] font-black"
                  style={{ color: colors.primary, fontFamily: font, lineHeight: 1 }}
                >
                  {t('Contact')}
                </h3>
                <div
                  className="mt-2 h-[2px] w-10 rounded-full"
                  style={{ backgroundColor: colors.secondary }}
                />
              </div>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block">
            <div className="relative h-16 w-16">
              <div
                className="absolute right-4 top-1 h-8 w-8 rounded-[16px] animate-pulse"
                style={{
                  border: `1.5px solid ${colors.secondary}70`,
                  backgroundColor: `${colors.secondary}08`
                }}
              />
              <div
                className="absolute left-2 top-4 flex h-9 w-9 items-center justify-center rounded-[18px] transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondary}10 0%, ${colors.secondary}22 100%)`,
                  border: `1.5px solid ${colors.secondary}`
                }}
              >
                <Phone size={15} style={{ color: colors.secondary }} />
              </div>
              <div
                className="absolute left-1 top-3 h-11 w-11 rounded-[20px] animate-ping"
                style={{ border: `1px solid ${colors.secondary}35` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-2">
          {contactItems.map((item: any, index: number) => {
            const Icon = item.icon;
            const content = (
              <div
                className="flex min-h-[64px] w-full items-center gap-2.5 overflow-hidden rounded-[18px] px-3 py-2.5"
                style={{
                  backgroundColor: 'transparent',
                  fontFamily: font
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px]"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                    borderTopLeftRadius: '14px',
                    borderTopRightRadius: '22px',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.10)'
                  }}
                >
                  <Icon size={16} style={{ color: '#FFFFFF' }} />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: colors.primary }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-0.5 break-words text-[13px] font-medium leading-5"
                    style={{ color: colors.text }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );

            return (
              <div key={`${item.label}-${index}`} className="w-full">
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="block"
                    >
                      {content}
                    </a>
                  ) : (
                    content
                  )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    const getServiceIcon = (iconName: string) => {
      switch(iconName) {
        case 'dumbbell': return <Dumbbell size={20} />;
        case 'running': return <Activity size={20} />;
        case 'yoga': return <PersonStanding size={20} />;
        case 'nutrition': return <Salad size={20} />;
        case 'group': return <Users size={20} />;
        case 'personal': return <User size={20} />;
        default: return <Dumbbell size={20} />;
      }
    };
    
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Training Services"), <Dumbbell size={18} />)}
        <div className="space-y-4">
          {services.map((service: any, index: number) => (
            <Card
              key={index} 
              className="rounded-lg border-0 shadow-none" 
              style={{ 
                backgroundColor: colors.cardBg
              }}
            >
              <div
                className="m-3 rounded-lg border p-4"
                style={{
                  borderColor: colors.borderColor,
                  backgroundColor: colors.background
                }}
              >
                <div className="flex items-start">
                  <div 
                    className="flex h-8 w-8 shrink-0 items-center justify-center mr-3" 
                    style={{ 
                      color: colors.primary
                    }}
                  >
                    {getServiceIcon(service.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-3">
                      <h3 
                        className="font-bold text-base" 
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {service.title}
                      </h3>
                      {service.price && (
                        <div 
                          className="text-sm font-bold shrink-0" 
                          style={{ color: colors.primary }}
                        >
                          {service.price}
                        </div>
                      )}
                    </div>
                    {service.description && (
                      <p 
                        className="text-sm mt-1" 
                        style={{ color: colors.text + 'CC' }}
                      >
                        {service.description}
                      </p>
                    )}
                    {service.duration && (
                      <div 
                        className="mt-2 inline-flex items-center rounded-full text-xs font-medium" 
                        style={{ 
                          color: colors.text,
                          backgroundColor: colors.background,
                          border: `1px solid ${colors.borderColor}`
                        }}
                      >
                        <Clock size={12} className="mr-1.5" style={{ color: colors.primary }} />
                        {service.duration}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderTransformationSection = (transformationData: any) => {
    const gallery = transformationData.gallery || [];
    if (!Array.isArray(gallery) || gallery.length === 0) return null;
    
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Client Transformations"), <Award size={18} />)}
        <div className="space-y-4">
          {gallery.map((item: any, index: number) => (
            <div 
              key={index} 
              className="rounded-[18px] p-4" 
              style={{ 
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <h4 
                className="text-base font-bold leading-5" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {item.title}
              </h4>
              
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div
                  className="flex flex-col"
                >
                  <div
                    className="pb-2 text-center text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      color: colors.text
                    }}
                  >
                    {t("Before")}
                  </div>
                  <div 
                    className="h-32 overflow-hidden rounded-[16px] bg-gray-200 flex items-center justify-center" 
                    style={{
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    {item.before_image ? (
                      <img 
                        src={getImageDisplayUrl(item.before_image)} 
                        alt="Before" 
                        className="h-full w-full object-cover" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <User size={24} style={{ color: colors.text + '40' }} />
                    )}
                  </div>
                </div>
                
                <div
                  className="flex flex-col"
                >
                  <div
                    className="pb-2 text-center text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{
                      color: colors.primary
                    }}
                  >
                    {t("After")}
                  </div>
                  <div 
                    className="h-32 overflow-hidden rounded-[16px] bg-gray-200 flex items-center justify-center" 
                    style={{
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    {item.after_image ? (
                      <img 
                        src={getImageDisplayUrl(item.after_image)} 
                        alt="After" 
                        className="h-full w-full object-cover" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <User size={24} style={{ color: colors.text + '40' }} />
                    )}
                  </div>
                </div>
              </div>

              {item.duration && (
                <div 
                  className="mt-3 text-xs font-semibold" 
                  style={{ color: colors.primary }}
                >
                  {t("Transformation Time")}: {item.duration}
                </div>
              )}
              
              {item.description && (
                <p 
                  className="mt-2 text-[13px] leading-5" 
                  style={{ color: colors.text + 'CC' }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProgramsSection = (programsData: any) => {
    const programs = programsData.program_list || programsData || [];
    
    // If no programs data, show default programs from template
    const defaultPrograms = templateSections.programs?.program_list || [];
    const finalPrograms = Array.isArray(programs) && programs.length > 0 ? programs : defaultPrograms;
    
    if (!Array.isArray(finalPrograms) || finalPrograms.length === 0) return null;
    
    const getLevelBadgeColor = (level: string) => {
      switch(level) {
        case 'beginner': return '#4CAF50';
        case 'intermediate': return '#FF9800';
        case 'advanced': return '#F44336';
        default: return colors.primary;
      }
    };
    
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(
          t("Training Programs"),
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            <line x1="4" y1="22" x2="4" y2="15"></line>
          </svg>
        )}
        <div className="space-y-4">
          {finalPrograms.map((program: any, index: number) => (
            <Card
              key={index} 
              className="rounded-[18px] border shadow-none" 
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 
                    className="text-base font-bold leading-5" 
                    style={{ color: colors.text, fontFamily: font }}
                  >
                    {program.title}
                  </h4>
                  {program.price && (
                    <div 
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-bold" 
                      style={{ 
                        backgroundColor: `${colors.primary}12`,
                        color: colors.primary
                      }}
                    >
                      {program.price}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {program.level && (
                    <span 
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize" 
                      style={{ 
                        backgroundColor: getLevelBadgeColor(program.level),
                        color: '#FFFFFF'
                      }}
                    >
                      {program.level}
                    </span>
                  )}
                  
                  {program.duration && (
                    <span 
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold" 
                      style={{ 
                        border: `1px solid ${colors.primary}30`,
                        color: colors.primary,
                        backgroundColor: colors.background
                      }}
                    >
                      {program.duration}
                    </span>
                  )}
                </div>
                
                {program.description && (
                  <p 
                    className="mt-3 text-sm leading-6" 
                    style={{ color: colors.text + 'CC', fontFamily: font }}
                  >
                    {program.description}
                  </p>
                )}
              </div>
            </Card>
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

    if (!videoContent || videoContent.length === 0) return null;
    
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Workout Videos"), <Video size={18} />)}
        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div 
              key={video.key} 
              className="overflow-hidden rounded-[18px] border" 
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
                      className="relative h-44 w-full cursor-pointer"
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
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.28)' }}>
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 10px 22px rgba(0,0,0,0.18)'
                            }}
                          >
                            <Play className="ml-0.5 h-5 w-5" style={{ color: colors.primary }} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {video.video_type && (
                    <span 
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold" 
                      style={{ 
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {video.video_type.replace('_', ' ')}
                    </span>
                  )}
                  {video.difficulty_level && (
                    <span 
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold" 
                      style={{ 
                        backgroundColor: `${colors.secondary}14`,
                        color: colors.secondary,
                        fontFamily: font
                      }}
                    >
                      {video.difficulty_level.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                <h4 className="mt-3 text-[15px] font-bold leading-5" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>

                {video.description && (
                  <p className="mt-2 text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
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
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("YouTube Channel"), <Youtube size={18} />)}
        <div 
          className="rounded-[18px] p-4" 
          style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600">
              <Youtube className="h-6 w-6 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || 'Fitness Channel'}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="mt-1 text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
                  {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>
          
          {youtubeData.channel_description && (
            <p className="mb-4 text-sm leading-6" style={{ color: colors.text, fontFamily: font }}>
              {youtubeData.channel_description}
            </p>
          )}

          {youtubeData.latest_video_embed && (
            <div className="mb-4 overflow-hidden rounded-[16px]" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}>
              <div className="border-b px-3 py-2" style={{ borderColor: colors.borderColor }}>
                <h4 className="flex items-center text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>
                  <Play className="mr-2 h-4 w-4" style={{ color: colors.primary }} />
                  {t("Latest Video")}
                </h4>
              </div>
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: "56.25%", height: 0 }}>
                <div 
                  className="absolute inset-0 h-full w-full"
                  ref={createYouTubeEmbedRef(
                    youtubeData.latest_video_embed,
                    { colors, font },
                    "Latest Video"
                  )}
                />
              </div>
            </div>
          )}
          
          <div className="mt-1 space-y-3">
            {youtubeData.channel_url && (
              <Button 
                className="w-full rounded-[18px] py-3 font-bold text-[11px] sm:text-xs" 
                style={{ 
                  backgroundColor: colors.primary, 
                  color: 'white',
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                <Youtube className="w-5 h-5 mr-2" />
                {t("SUBSCRIBE TO CHANNEL")}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button 
                variant="outline" 
                className="w-full rounded-[18px] py-3 font-bold text-[11px] sm:text-xs" 
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                📋 {t("WORKOUT PLAYLIST")}
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
        className="px-6 py-4" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t('Follow Me'), <Instagram size={18} />)}

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-5">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              type="button"
              className="cursor-pointer appearance-none border-0 bg-transparent p-0 shadow-none outline-none transition-transform duration-200 hover:-translate-y-1 hover:scale-105"
              style={{ fontFamily: font }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <div
                className="flex h-11 w-10 items-center justify-center rounded-[18px]"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  borderTopRightRadius: '26px',
                  borderTopLeftRadius: '16px',
                  borderBottomLeftRadius: '18px',
                  borderBottomRightRadius: '18px',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.12)'
                }}
              >
                <SocialIcon platform={link.platform} color="#FFFFFF" />
              </div>
            </button>
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
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Training Hours"), <Clock size={18} />)}
        <div className="space-y-2">
          {hours.map((hour: any, index: number) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-3 rounded-lg" 
              style={{ 
                backgroundColor: hour.day === currentDay ? `${colors.primary}15` : 'transparent',
                border: hour.day === currentDay ? `1px solid ${colors.primary}30` : `1px solid ${colors.borderColor}`
              }}
            >
              <div className="flex items-center">
                <span 
                  className="capitalize font-medium text-sm" 
                  style={{ 
                    color: hour.day === currentDay ? colors.primary : colors.text
                  }}
                >
                  {t(hour.day)}
                </span>
                {hour.day === currentDay && (
                  <Badge 
                    className="ml-2 text-xs" 
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.buttonText
                    }}
                  >
                    {t("Today")}
                  </Badge>
                )}
              </div>

              <span 
                className="text-sm" 
                style={{ 
                  color: hour.is_closed ? colors.text + '80' : (hour.day === currentDay ? colors.primary : colors.text)
                }}
              >
                {hour.is_closed ? 'Not Available' : `${hour.open_time} - ${hour.close_time}`}
              </span>
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
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Client Reviews"), <Star size={18} />)}
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="rounded-[18px] p-4" 
                    style={{ 
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center min-w-0">
                        <div 
                          className="mr-3 h-12 w-12 overflow-hidden rounded-full flex-shrink-0" 
                          style={{ border: `2px solid ${colors.primary}` }}
                        >
                          {review.client_image ? (
                            <img 
                              src={getImageDisplayUrl(review.client_image)} 
                              alt={review.client_name} 
                              className="h-full w-full object-cover" 
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div 
                              className="flex h-full w-full items-center justify-center" 
                              style={{ backgroundColor: `${colors.primary}18` }}
                            >
                              <User size={20} style={{ color: colors.primary }} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>
                            {review.client_name}
                          </div>
                          {review.goal_achieved && (
                            <div 
                              className="mt-0.5 text-xs font-medium" 
                              style={{ color: colors.primary, fontFamily: font }}
                            >
                              {review.goal_achieved}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center space-x-1">
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
                    
                    <div
                      className="rounded-[16px] border px-3 py-3"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.borderColor
                      }}
                    >
                      <p 
                        className="text-sm leading-6 italic" 
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        "{review.review}"
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
                  className="w-2 h-2 rounded-full cursor-pointer transition-colors"
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

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Book a Session"), <Calendar size={18} />)}
        <div className="space-y-3">
          <Button 
            className="w-full rounded-[18px] px-4 py-4 text-sm font-bold" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: colors.buttonText,
              fontFamily: font,
              boxShadow: '0 10px 22px rgba(0,0,0,0.12)'
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {appointmentsData?.booking_text || 'Book a Training Session'}
          </Button>
          
          {appointmentsData?.consultation_text && (
            <Button 
              variant="outline" 
              className="w-full rounded-[18px] px-4 py-4 text-sm font-bold" 
              style={{ 
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: colors.background,
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Clock className="mr-2 h-4 w-4" />
              {appointmentsData.consultation_text}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Find My Gym"), <MapPin size={18} />)}
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <FitnessMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <div className="flex justify-center">
              <Button 
                className="rounded-[18px] px-5" 
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
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    
    return (
      <div 
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(t("Fitness App"), <Download size={18} />, 'mb-3')}
        
        {appData.app_description && (
          <p 
            className="text-sm mb-4" 
            style={{ color: colors.text + 'CC' }}
          >
            {appData.app_description}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <Button 
              variant="outline" 
              className="flex items-center justify-center rounded-[18px]" 
              style={{ 
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 19c0-4.2-2.8-7-7-7M5 8c4.2 0 7-2.8 7-7M12 5c0 4.2 2.8 7 7 7M19 16c-4.2 0-7 2.8-7 7"/>
              </svg>
              {t("App Store")}
            </Button>
          )}
          
          {appData.play_store_url && (
            <Button 
              variant="outline" 
              className="flex items-center justify-center rounded-[18px]" 
              style={{ 
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
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
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(formData.form_title, undefined, 'mb-2')}
        
        {formData.form_description && (
          <p 
            className="text-sm mb-4" 
            style={{ color: colors.text + 'CC' }}
          >
            {formData.form_description}
          </p>
        )}
        
        <div className="flex justify-center">
          <Button 
            className="rounded-[18px] px-5 py-4 font-bold text-sm" 
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t("Contact Me")}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div className="px-6 py-4">
        <div 
          className="p-4 rounded-lg text-center" 
          style={{ 
            backgroundColor: `${colors.primary}10`,
            border: `1px solid ${colors.primary}30`
          }}
        >
          <p 
            className="text-sm" 
            style={{ color: colors.text }}
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
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          renderPatternTitle(customHtmlData.section_title, <Dumbbell size={18} />)
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
        className="px-6 py-5" 
        style={{ borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderPatternTitle(qrData.qr_title || t('Share My Training'), <QrCode size={18} />)}
        
        <div 
          className="text-center p-4 rounded-lg" 
          style={{ 
            backgroundColor: colors.cardBg,
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
            className="w-full rounded-[18px] py-4 font-bold" 
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
        className="px-6 py-5"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="space-y-3 rounded-[18px] p-4"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
        {hasContactButton && (
          <Button
            className="w-full rounded-[18px] py-4 font-bold text-sm"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: colors.buttonText,
              fontFamily: font,
              boxShadow: '0 10px 22px rgba(0,0,0,0.12)'
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full rounded-[18px] py-4 font-bold text-sm"
            style={{
              backgroundColor: colors.secondary,
              color: colors.buttonText,
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
            className="w-full rounded-[18px] py-4 text-sm font-bold flex items-center justify-center"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: colors.background,
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
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;
    
    return (
      <div 
        className="px-6 py-4 text-center" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <p 
          className="text-xs" 
          style={{ color: colors.text + '80' }}
        >
          {copyrightData.text}
        </p>
      </div>
    );
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
          className="px-6 py-4 text-center" 
          style={{ 
            backgroundColor: colors.background
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
