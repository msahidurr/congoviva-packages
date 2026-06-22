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
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  Calendar,
  Hammer,
  Wrench,
  Zap,
  Paintbrush,
  TreePine,
  Ruler,
  BrickWall,
  Wind,
  Star,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  Briefcase,
  Image,
  Award,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  User,
  UserPlus,
  Download,
  Video,
  Play,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';

import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface ConstructionTemplateProps {
  data: any;
  template: any;
}

const ConstructionMapEmbed = React.memo(function ConstructionMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function ConstructionTemplate({ data, template }: ConstructionTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeProject, setActiveProject] = useState<number | null>(0);

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
  const [activeGalleryPhoto, setActiveGalleryPhoto] = React.useState(0);
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
    primary: '#F9A826',
    secondary: '#FFD166',
    accent: '#FFF3CD',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    warningColor: '#FF5722'
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
  const allSections = getBusinessTemplate('construction')?.sections || [];

  const renderSectionTitle = (icon: React.ReactNode, title: string) => (
    <div className="mb-5 flex items-center gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded"
        style={{
          backgroundColor: colors.primary,
          color: '#FFFFFF'
        }}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <h2
          className="text-lg font-bold uppercase tracking-wide"
          style={{
            color: colors.text,
            fontFamily: font
          }}
        >
          {title}
        </h2>
        <div className="h-0.5 w-10 rounded" style={{ backgroundColor: colors.primary }} />
      </div>
    </div>
  );

  const renderHeaderSection = (headerData: any) => (
    <div className="relative overflow-hidden">
      {/* Decorative Geometric Background */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, ${colors.primary}, transparent)`,
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }}
      />

      <div
        className="relative px-6 py-7"
        style={{
          backgroundColor: colors.background,
          borderBottom: `6px solid ${colors.primary}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}
      >
        <div className="flex flex-col space-y-6">
          {/* Top Row: Stats & Switcher */}
          <div className="flex justify-between items-center">
            {headerData.license_number ? (
              <div
                className="flex items-center px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest"
                style={{
                  backgroundColor: colors.primary + '15',
                  color: colors.primary,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                <span>LIC: {headerData.license_number}</span>
              </div>
            ) : <div />}

            {/* Improved Language Selector */}
            {(configSections?.language && configSections?.language?.enable_language_switcher) && (
              <div className="relative z-30">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded transition-all hover:bg-gray-50 border cursor-pointer"
                  style={{
                    borderColor: colors.borderColor,
                    color: colors.text
                  }}
                >
                  <Globe size={14} style={{ color: colors.primary }} />
                  <span className="text-xs font-extrabold uppercase">{currentLanguage}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showLanguageSelector ? 'rotate-180' : ''}`} />
                </button>

                {showLanguageSelector && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded shadow-2xl border py-2 min-w-[160px] max-h-60 overflow-y-auto z-[999999]" style={{ borderColor: colors.borderColor }}>
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${currentLanguage === lang.code ? 'font-black' : 'font-medium'
                          }`}
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '08' : 'transparent',
                          color: currentLanguage === lang.code ? colors.primary : colors.text
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-base leading-none">
                            {String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}
                          </span>
                          <span>{lang.name}</span>
                        </div>
                        {currentLanguage === lang.code && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Identity Block */}
          <div className="flex items-center">
            <div className="relative mr-6">
              {headerData.logo ? (
                <div
                  className="w-24 h-24 rounded bg-white shadow-xl overflow-hidden border-b-4"
                  style={{ borderBottomColor: colors.primary }}
                >
                  <img
                    src={getImageDisplayUrl(headerData.logo)}
                    alt={headerData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div
                  className="w-20 h-20 flex items-center justify-center rounded shadow-xl transition-transform hover:scale-105"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    boxShadow: `0 10px 20px ${colors.primary}30`
                  }}
                >
                  <Hammer size={38} />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1
                className="text-2xl font-bold mb-2"
                style={{
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {headerData.name || data.name || 'BuildRight Construction'}
              </h1>

              {headerData.tagline && (
                <div className="flex items-center">
                  <div className="w-6 h-0.5 mr-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <p
                    className="text-xs tracking-widest"
                    style={{ color: colors.text }}
                  >
                    {headerData.tagline}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Emergency Contact Bar */}
      {configSections.contact?.emergency && (
        <div
          className="relative py-2.5 px-6 flex items-center justify-between overflow-hidden"
          style={{
            backgroundColor: colors.warningColor,
            color: colors.buttonText,
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {/* Subtle pulse background */}
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse pointer-events-none" />

          <div className="relative flex items-center">
            <div className="w-2 h-2 rounded-full bg-white mr-3 animate-ping" />
            <Clock size={12} className="mr-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t("Emergency Service")}</span>
          </div>

          <a
            href={`tel:${configSections.contact?.emergency}`}
            className="relative flex items-center space-x-2 group"
          >
            <AlertTriangle size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold tracking-tight">{configSections.contact?.emergency}</span>
          </a>
        </div>
      )}

      {/* Premium Quick Action Buttons */}
      <div
        className="grid grid-cols-4 px-4 py-2"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <a
          href={`tel:${configSections.contact?.phone}`}
          className="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center transition-colors hover:bg-black/[0.02] border-r"
          style={{ borderColor: colors.borderColor }}
        >
          <Phone size={18} strokeWidth={1.8} style={{ color: colors.primary }} />
          <span className="text-[12px] font-medium" style={{ color: colors.primary }}>
            {t('Call Us')}
          </span>
        </a>

        <button
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          className="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center transition-colors hover:bg-black/[0.02] border-r cursor-pointer"
          style={{ borderColor: colors.borderColor }}
        >
          <MessageSquare size={18} strokeWidth={1.8} style={{ color: colors.primary }} />
          <span className="text-[12px] font-medium" style={{ color: colors.primary }}>
            {t('Message')}
          </span>
        </button>

        <button
          onClick={() => handleAppointmentBooking(configSections.appointments)}
          className="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center transition-colors hover:bg-black/[0.02] border-r cursor-pointer"
          style={{ borderColor: colors.borderColor }}
        >
          <Calendar size={18} strokeWidth={1.8} style={{ color: colors.primary }} />
          <span className="text-[12px] font-medium" style={{ color: colors.primary }}>
            {t('Estimate')}
          </span>
        </button>

        <button
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
          className="flex flex-col items-center justify-center gap-2 px-2 py-4 text-center transition-colors hover:bg-black/[0.02] cursor-pointer"
        >
          <User size={18} strokeWidth={1.8} style={{ color: colors.primary }} />
          <span className="text-[12px] font-medium" style={{ color: colors.primary }}>
            {t('Save')}
          </span>
        </button>
      </div>

      {/* QR Share Modal Integrated here as well */}
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
        className="px-6 py-7"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex flex-col space-y-5">
          {renderSectionTitle(<Briefcase size={18} />, t('About Us'))}

          <div className="relative">
            <div
              className="absolute -left-4 top-0 bottom-0 w-0.5 rounded-full"
              style={{ backgroundColor: colors.primary + '20' }}
            />
            <p
              className="text-sm leading-6"
              style={{ color: colors.text }}
            >
              {aboutData.description || data.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {aboutData.year_established && (
              <div
                className="flex items-center gap-3 border-b pb-3"
                style={{ borderColor: colors.borderColor }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary + '10', color: colors.primary }}>
                  <Calendar size={18} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p
                    className="text-[10px] uppercase font-semibold opacity-50 tracking-[0.18em] leading-none"
                    style={{ color: colors.text }}
                  >
                    {t('Established')}
                  </p>
                  <p
                    className="text-sm font-semibold tracking-tight leading-5"
                    style={{ color: colors.text }}
                  >
                    {aboutData.year_established}
                  </p>
                </div>
              </div>
            )}

            {aboutData.service_area && (
              <div
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary + '10', color: colors.primary }}>
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p
                    className="text-[10px] uppercase font-semibold opacity-50 tracking-[0.18em] leading-none"
                    style={{ color: colors.text }}
                  >
                    {t('Service Area')}
                  </p>
                  <p
                    className="text-sm font-medium tracking-tight leading-5"
                    style={{ color: colors.text }}
                  >
                    {aboutData.service_area}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;

    const getServiceIcon = (iconName: string) => {
      switch (iconName) {
        case 'renovation': return <Home size={24} />;
        case 'plumbing': return <Wrench size={24} />;
        case 'electrical': return <Zap size={24} />;
        case 'roofing': return <Home size={24} />;
        case 'painting': return <Paintbrush size={24} />;
        case 'flooring': return <Ruler size={24} />;
        case 'landscaping': return <TreePine size={24} />;
        case 'carpentry': return <Hammer size={24} />;
        case 'masonry': return <BrickWall size={24} />;
        case 'hvac': return <Wind size={24} />;
        default: return <Hammer size={24} />;
      }
    };

    return (
      <div
        className="px-5 py-7"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Hammer size={18} />, t('Our Services'))}

        <div className="grid grid-cols-1 gap-3">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="min-w-0 rounded-xl border p-4"
              style={{
                borderColor: colors.borderColor,
                backgroundColor: colors.background
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: colors.primary + '12',
                    color: colors.primary
                  }}
                >
                  {getServiceIcon(service.icon)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="text-base font-semibold leading-6"
                    style={{
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {service.title}
                  </h3>

                  <div
                    className="mt-2 h-px w-14"
                    style={{
                      background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.borderColor} 100%)`
                    }}
                  />

                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: colors.text + (service.description ? 'B3' : '80'), fontFamily: font }}
                  >
                    {service.description
                      ? service.description
                      : t('Professional construction solutions tailored to your project needs.')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = (projectsData: any) => {
    const projects = projectsData.project_list || [];
    if (!Array.isArray(projects) || projects.length === 0) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Image size={18} />, t('Featured Projects'))}

        <div className="space-y-4">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="rounded overflow-hidden border"
              style={{
                borderColor: colors.borderColor,
                backgroundColor: colors.cardBg
              }}
            >
              <div
                className="p-3 flex justify-between items-center cursor-pointer"
                style={{
                  backgroundColor: activeProject === index ? colors.primary + '12' : colors.cardBg,
                  borderLeft: activeProject === index ? `4px solid ${colors.primary}` : `4px solid transparent`,
                  color: activeProject === index ? colors.buttonText : colors.text
                }}
                onClick={() => setActiveProject(activeProject === index ? null : index)}
              >
                <div>
                  <h3
                    className="text-base font-bold leading-6"
                    style={{
                      color: activeProject === index ? colors.text : colors.text,
                      fontFamily: font
                    }}
                  >
                    {project.title}
                  </h3>

                  {project.location && (
                    <p
                      className="mt-1 flex items-center text-sm"
                      style={{
                        color: activeProject === index ? colors.text + '99' : colors.text + '99',
                        fontFamily: font
                      }}
                    >
                      <MapPin size={12} className="mr-1.5" />
                      {project.location}
                    </p>
                  )}
                </div>

                {project.category && (
                  <Badge
                    className="text-xs capitalize"
                    style={{
                      backgroundColor: activeProject === index ? colors.secondary + '30' : colors.primary + '20',
                      color: activeProject === index ? colors.text : colors.primary,
                      fontFamily: font
                    }}
                  >
                    {project.category.replace('_', ' ')}
                  </Badge>
                )}
              </div>

              {activeProject === index && (
                <div className="p-3">
                  {(project.before_image || project.after_image) && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="relative">
                        {project.before_image ? (
                          <img
                            src={getImageDisplayUrl(project.before_image)}
                            alt="Before"
                            className="h-40 w-full rounded object-cover sm:h-44"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div
                            className="flex h-40 w-full items-center justify-center rounded sm:h-44"
                            style={{ backgroundColor: colors.borderColor + '50' }}
                          >
                            <span className="text-xs" style={{ color: colors.text + '80' }}>Before</span>
                          </div>
                        )}
                        <div
                          className="absolute top-0 left-0 px-2 py-1 text-xs"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.buttonText
                          }}
                        >
                          {t("BEFORE")}
                        </div>
                      </div>

                      <div className="relative">
                        {project.after_image ? (
                          <img
                            src={getImageDisplayUrl(project.after_image)}
                            alt="After"
                            className="h-40 w-full rounded object-cover sm:h-44"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div
                            className="flex h-40 w-full items-center justify-center rounded sm:h-44"
                            style={{ backgroundColor: colors.borderColor + '50' }}
                          >
                            <span className="text-xs" style={{ color: colors.text + '80' }}>{t("After")}</span>
                          </div>
                        )}
                        <div
                          className="absolute top-0 left-0 px-2 py-1 text-xs"
                          style={{
                            backgroundColor: colors.secondary,
                            color: colors.buttonText
                          }}
                        >
                          {t("AFTER")}
                        </div>
                      </div>
                    </div>
                  )}

                  {project.description && (
                    <p
                      className="text-sm leading-6"
                      style={{ color: colors.text + 'CC', fontFamily: font }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div
      className="px-5 py-6"
      style={{
        backgroundColor: colors.cardBg,
        borderBottom: `1px solid ${colors.borderColor}`
      }}
    >
      {renderSectionTitle(<Phone size={18} />, t("Contact Us"))}

      <div className="space-y-3">
        {(contactData.phone || data.phone) && (
          <a
            href={`tel:${contactData.phone || data.phone}`}
            className="flex items-center rounded border p-3"
            style={{
              borderColor: colors.borderColor,
              backgroundColor: colors.background
            }}
          >
            <div
              className="mr-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              <Phone size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-xs font-bold uppercase"
                style={{ color: colors.text + '80', fontFamily: font }}
              >
                {t('PHONE')}
              </p>
              <p
                className="text-sm font-bold"
                style={{ color: colors.text, fontFamily: font }}
              >
                {contactData.phone || data.phone}
              </p>
            </div>
          </a>
        )}

        {(contactData.email || data.email) && (
          <a
            href={`mailto:${contactData.email || data.email}`}
            className="flex items-center rounded border p-3"
            style={{
              borderColor: colors.borderColor,
              backgroundColor: colors.background
            }}
          >
            <div
              className="mr-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              <Mail size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p
                className="text-xs font-bold uppercase"
                style={{ color: colors.text + '80', fontFamily: font }}
              >
                {t('EMAIL')}
              </p>
              <p
                className="truncate text-sm font-bold"
                style={{ color: colors.text, fontFamily: font }}
              >
                {contactData.email || data.email}
              </p>
            </div>
          </a>
        )}

        {contactData.address && (
          <div
            className="flex items-center rounded border p-3"
            style={{
              borderColor: colors.borderColor,
              backgroundColor: colors.background
            }}
          >
            <div
              className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              <MapPin size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p
                  className="text-xs font-bold uppercase"
                  style={{ color: colors.text + '80', fontFamily: font }}
                >
                  {t('ADDRESS')}
                </p>
                <p
                  className="text-sm leading-5"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.address}
                </p>

                {configSections.google_map?.directions_url && (
                  <a
                    href={configSections.google_map?.directions_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-xs font-semibold"
                    style={{
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {t('Get Directions')}
                    <ChevronRight size={12} />
                  </a>
                )}
            </div>
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

  const renderCredentialsSection = (credentialsData: any) => {
    const certifications = credentialsData.certifications || [];
    if (!Array.isArray(certifications) || certifications.length === 0) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Award size={18} />, t('Credentials'))}

        <div className="space-y-2.5">
          {certifications.map((cert: any, index: number) => (
            <div
              key={index}
              className="rounded-lg border p-3"
              style={{
                borderColor: colors.borderColor,
                backgroundColor: colors.cardBg
              }}
            >
              <div className="flex items-center gap-3">
                {/* Certificate Image */}
                {cert.image ? (
                  <div className="h-14 w-14 overflow-hidden rounded-lg border flex-shrink-0" style={{ borderColor: colors.borderColor }}>
                    <img
                      src={getImageDisplayUrl(cert.image)}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: colors.primary + '12',
                      color: colors.primary
                    }}
                  >
                    <Award size={18} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="min-w-0 text-sm font-bold leading-5"
                      style={{
                        color: colors.text,
                        fontFamily: font
                      }}
                    >
                      {cert.title}
                    </h3>

                    {cert.year && (
                      <Badge
                        className="shrink-0 rounded-full border-0 px-2.5 py-1 text-xs font-semibold"
                        style={{
                          color: colors.primary,
                          backgroundColor: colors.primary + '14',
                          border: `1px solid ${colors.borderColor}`,
                          fontFamily: font
                        }}
                      >
                        {cert.year}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm" style={{ color: colors.text + '99', fontFamily: font }}>
                    {cert.issuer && <span className="font-medium">{cert.issuer}</span>}
                  </div>
                </div>
              </div>
            </div>
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
        className="px-5 py-4"
        style={{
          backgroundColor: colors.cardBg,
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
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: 'white'
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
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Clock size={18} />, t('Business Hours'))}

        <div
          className="rounded overflow-hidden border"
          style={{ borderColor: colors.borderColor }}
        >
          {hours.map((hour: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-3"
              style={{
                backgroundColor: hour.day === currentDay ? colors.accent : colors.cardBg,
                borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
              }}
            >
              <div className="flex items-center">
                <span
                  className="capitalize text-sm font-bold"
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
                    {t('Today')}
                  </Badge>
                )}
              </div>

              <span
                className="text-sm"
                style={{
                  color: hour.is_closed ? colors.text + '80' : colors.text,
                  fontWeight: hour.day === currentDay ? 'bold' : 'normal'
                }}
              >
                {hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    const selectedPhoto = photos[activeGalleryPhoto] || photos[0];

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Image size={18} />, t('Photo Gallery'))}

        <div
          className="overflow-hidden rounded-xl border"
          style={{
            borderColor: colors.borderColor,
            backgroundColor: colors.background
          }}
        >
          <div className="relative overflow-hidden h-[240px] sm:h-[280px]">
            {selectedPhoto?.image ? (
              <img
                src={getImageDisplayUrl(selectedPhoto.image)}
                alt={selectedPhoto.caption || `Gallery image ${activeGalleryPhoto + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ backgroundColor: colors.borderColor + '50' }}
              >
                <Hammer size={24} style={{ color: colors.primary }} />
              </div>
            )}
          </div>

          {selectedPhoto?.caption && (
            <div className="px-3 py-2.5">
              <p
                className="text-sm font-medium leading-5"
                style={{
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {selectedPhoto.caption}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {photos.map((photo: any, index: number) => (
            <button
              type="button"
              key={index}
              onClick={() => setActiveGalleryPhoto(index)}
              className="overflow-hidden rounded-xl border text-left"
              style={{
                borderColor: activeGalleryPhoto === index ? colors.primary : colors.borderColor,
                backgroundColor: colors.background
              }}
            >
              <div className="relative overflow-hidden h-[150px] sm:h-[170px] cursor-pointer">
                {photo.image ? (
                  <img
                    src={getImageDisplayUrl(photo.image)}
                    alt={photo.caption || `Gallery image ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ backgroundColor: colors.borderColor + '50' }}
                  >
                    <Hammer size={24} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>

              {photo.caption && (
                <div className="px-3 py-2.5">
                  <p
                    className="line-clamp-2 text-xs font-medium leading-5"
                    style={{
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {photo.caption}
                  </p>
                </div>
              )}
            </button>
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Video size={18} />, t('Project Videos'))}

        <div className="grid grid-cols-1 gap-4">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');

            return (
              <div
                key={video.key}
                className="overflow-hidden rounded-xl border"
                style={{
                  borderColor: colors.borderColor,
                  backgroundColor: colors.background
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
                      className="group relative w-full h-48 cursor-pointer overflow-hidden"
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={video.title || 'Video'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '14' }}>
                          <Video className="w-10 h-10" style={{ color: colors.primary }} />
                        </div>
                      )}

                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.62) 100%)' }}
                      />

                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                        {video.video_type && (
                          <span
                            className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.92)',
                              color: colors.text
                            }}
                          >
                            {video.video_type.replace('_', ' ')}
                          </span>
                        )}

                        {video.duration && (
                          <span
                            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.55)',
                              color: '#FFFFFF'
                            }}
                          >
                            {video.duration}
                          </span>
                        )}
                      </div>

                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: colors.primary,
                              boxShadow: `0 8px 24px ${colors.primary}66`
                            }}
                          >
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-base font-semibold leading-6"
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {video.title}
                      </h3>

                      {video.description && (
                        <p
                          className="mt-2 text-sm leading-6"
                          style={{ color: colors.text + 'B3', fontFamily: font }}
                        >
                          {video.description}
                        </p>
                      )}
                    </div>

                    {video.project_category && (
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize"
                        style={{
                          color: colors.primary,
                          fontFamily: font,
                          backgroundColor: colors.primary + '10',
                          border: `1px solid ${colors.primary}22`
                        }}
                      >
                        {video.project_category.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>

                  <div
                    className="mt-3 h-px w-full"
                    style={{ background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.borderColor} 100%)` }}
                  />

                <div className="mt-3 flex items-center justify-end">
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setPlayingKey(video.key)}
                        className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em]"
                        style={{ color: colors.primary }}
                      >
                        <span>{t('Watch')}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
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
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Youtube size={18} />, t('YouTube Channel'))}

        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            borderColor: colors.borderColor,
            backgroundColor: colors.background
          }}
        >
          <div
            className="px-4 py-4"
            style={{
              backgroundColor: colors.cardBg,
              borderBottom: `1px solid ${colors.borderColor}`
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.primary + '12', color: colors.primary }}
              >
                <Youtube className="h-6 w-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    className="rounded-full border-0 px-2.5 py-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: colors.primary + '10',
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {t('Official Channel')}
                  </Badge>

                  {youtubeData.subscriber_count && (
                    <Badge
                      className="rounded-full border-0 px-2.5 py-1 text-[10px] font-medium"
                      style={{
                        backgroundColor: colors.background,
                        color: colors.text + 'CC',
                        border: `1px solid ${colors.borderColor}`,
                        fontFamily: font
                      }}
                    >
                      {youtubeData.subscriber_count} {t('subscribers')}
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-bold leading-tight" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Construction Channel'}
                </h3>

                {youtubeData.channel_description && (
                  <p
                    className="mt-1.5 text-sm leading-6"
                    style={{ color: colors.text + 'B3', fontFamily: font }}
                  >
                    {youtubeData.channel_description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {youtubeData.latest_video_embed && (
              <div
                className="overflow-hidden rounded-xl border"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.borderColor
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: colors.borderColor }}>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary + '14', color: colors.primary }}
                    >
                      <Play className="h-4 w-4 ml-0.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                        {t('Latest Video')}
                      </h4>
                      <p className="text-xs" style={{ color: colors.text + '99', fontFamily: font }}>
                        {t('See our newest upload')}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className="rounded-full border-0 bg-transparent px-2.5 py-1 text-[10px] font-medium"
                    style={{
                      color: colors.primary,
                      border: `1px solid ${colors.borderColor}`,
                      fontFamily: font
                    }}
                  >
                    {t('YouTube')}
                  </Badge>
                </div>

                <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <div
                    className="absolute inset-0 w-full h-full"
                    ref={createYouTubeEmbedRef(
                      youtubeData.latest_video_embed,
                      { colors, font },
                      'Latest Video'
                    )}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              {youtubeData.channel_url && (
                <Button
                  className="flex-1 rounded-xl"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.buttonText || 'white',
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  {t('Subscribe')}
                </Button>
              )}

              {youtubeData.featured_playlist && (
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {t('Project Tutorials')}
                </Button>
              )}
            </div>
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Star size={18} />, t('Testimonials'))}

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: colors.borderColor,
                      backgroundColor: colors.cardBg
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < parseInt(review.rating || 5) ? colors.primary : 'transparent'}
                            stroke={i < parseInt(review.rating || 5) ? colors.primary : colors.borderColor}
                          />
                        ))}
                      </div>

                      {review.project_type && (
                        <Badge
                          className="rounded-full border-0 px-2.5 py-1 text-[10px] font-medium"
                          style={{
                            backgroundColor: colors.primary + '12',
                            color: colors.primary,
                            fontFamily: font
                          }}
                        >
                          {review.project_type}
                        </Badge>
                      )}
                    </div>

                    <p
                      className="text-sm leading-6"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>

                    <div
                      className="mt-4 h-px w-full"
                      style={{ background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.borderColor} 100%)` }}
                    />

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: colors.primary, fontFamily: font }}
                        >
                          {review.client_name}
                        </p>
                        {review.location && (
                          <p
                            className="mt-0.5 text-xs"
                            style={{ color: colors.text + '99', fontFamily: font }}
                          >
                            {review.location}
                          </p>
                        )}
                      </div>

                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: colors.background,
                          color: colors.primary,
                          border: `1px solid ${colors.borderColor}`
                        }}
                      >
                        <MessageSquare size={16} />
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

  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData.booking_url) return null;

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
            className="text-xl font-bold uppercase tracking-wide mb-3"
            style={{
              color: colors.buttonText,
              fontFamily: font
            }}
          >
            {appointmentsData.section_title || 'Ready to Start Your Project?'}
          </h2>

          <p
            className="text-sm mb-4"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            {appointmentsData.section_description || 'Contact us today for professional service and quality workmanship.'}
          </p>

          <div className="flex flex-col space-y-3">
            <Button
              className="w-full rounded-xl border-0 shadow-none"
              style={{
                backgroundColor: '#FFFFFF',
                color: colors.primary,
                fontFamily: font,
                fontWeight: 'bold'
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {appointmentsData.booking_text || 'Schedule Consultation'}
            </Button>

            <Button
              variant="outline"
              className="w-full rounded-xl bg-transparent shadow-none"
              style={{
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.45)',
                fontFamily: font,
                fontWeight: 'bold'
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {appointmentsData.estimate_text || 'Free Estimate'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.directions_url) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<MapPin size={18} />, t("Our Location"))}

        <div className="space-y-3">
          {locationData.map_embed_url && (
            <ConstructionMapEmbed embedHtml={locationData.map_embed_url} />
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>,
          t('Mobile App')
        )}

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
        {renderSectionTitle(<MessageSquare size={18} />, formData.form_title)}

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
          <MessageSquare className="w-4 h-4 mr-2" />
          {t('Contact Us Now')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderSectionTitle(<Award size={18} />, thankYouData.title || t('Thank You'))}

        <div
          className="rounded-xl border px-4 py-4"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor
          }}
        >
        <p
          className="text-sm leading-6"
          style={{ color: colors.text + 'B3', fontFamily: font }}
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
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          renderSectionTitle(<Hammer size={18} />, customHtmlData.section_title)
        )}
        <div
          className="custom-html-content p-3 rounded border"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
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
                text-transform: uppercase;
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

  const renderActionButtonsSection = (actionButtonsData: any) => {
    const hasAnyButton = actionButtonsData.contact_button_text || actionButtonsData.appointment_button_text || actionButtonsData.save_contact_button_text;
    if (!hasAnyButton) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="space-y-3">
          {actionButtonsData.contact_button_text && (
            <Button
              className="w-full justify-center gap-2 rounded-lg px-4 py-3 text-center"
              style={{
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="text-sm font-semibold">{actionButtonsData.contact_button_text}</span>
            </Button>
          )}

          {actionButtonsData.appointment_button_text && (
            <Button
              className="w-full justify-center gap-2 rounded-lg border px-4 py-3 text-center"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font,
                backgroundColor: colors.background
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span className="text-sm font-semibold">{actionButtonsData.appointment_button_text}</span>
            </Button>
          )}

          {actionButtonsData.save_contact_button_text && (
            <Button
              className="w-full justify-center gap-2 rounded-lg border px-4 py-3 text-center"
              variant="outline"
              style={{
                borderColor: colors.secondary,
                color: colors.secondary,
                fontFamily: font,
                backgroundColor: colors.background
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
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="text-sm font-semibold">{actionButtonsData.save_contact_button_text}</span>
            </Button>
          )}
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
        {renderSectionTitle(<QrCode size={18} />, qrData.qr_title || t('Share QR Code'))}

        <div className="text-center p-4 rounded border" style={{ backgroundColor: colors.background, borderColor: colors.borderColor }}>
          {qrData.qr_description && (
            <p
              className="text-sm mb-4"
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
            <QrCode className="w-4 h-4 mr-2" />
            {t('Share QR Code')}
          </Button>
        </div>
      </div>
    );
  };

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {footerData.footer_text && (
          <p
            className="text-sm text-center mb-4"
            style={{
              color: colors.text,
              fontFamily: font
            }}
          >
            {footerData.footer_text}
          </p>
        )}

        {footerData.footer_links && Array.isArray(footerData.footer_links) && footerData.footer_links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {footerData.footer_links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded transition-colors font-bold uppercase"
                style={{
                  backgroundColor: colors.primary + '20',
                  color: colors.primary,
                  fontFamily: font
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
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
      case 'projects':
        return renderProjectsSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'credentials':
        return renderCredentialsSection(sectionData);
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
      case 'thank_you':
        return renderThankYouSection(sectionData);
      case 'custom_html':
        return renderCustomHtmlSection(sectionData);
      case 'action_buttons':
        return renderActionButtonsSection(sectionData);
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'footer':
        return renderFooterSection(sectionData);
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  return (
    <div
      className="w-full rounded overflow-hidden"
      style={{
        fontFamily: font,
        background: colors.background,
        color: colors.text,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'footer' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}

      {/* Footer Section */}
      {renderSection('footer')}

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
