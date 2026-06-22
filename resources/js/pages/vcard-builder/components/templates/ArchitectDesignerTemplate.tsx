import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Compass, Layers, Square, Triangle, Ruler, Video, Play, Youtube, QrCode, Clock, Star, Download, Smartphone } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';

import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface ArchitectDesignerTemplateProps {
  data: any;
  template: any;
}

const ArchitectDesignerMapEmbed = React.memo(function ArchitectDesignerMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function ArchitectDesignerTemplate({ data, template }: ArchitectDesignerTemplateProps) {
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
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#E74C3C',
    background: '#FFFFFF',
    text: '#2C3E50',
    cardBg: '#F8F9FA',
    borderColor: '#E9ECEF',
    shadowColor: 'rgba(44, 62, 80, 0.1)'
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
  const allSections = getBusinessTemplate('architect-designer')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'portfolio':
        return renderPortfolioSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'design_process':
        return renderDesignProcessSection(sectionData);
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
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative rounded-t-2xl" style={{
      background: `linear-gradient(135deg, ${colors.background}, ${colors.cardBg})`,
      minHeight: '180px',
      overflow: 'visible',
      zIndex: 1
    }}>
      {/* Architectural grid lines */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-none stroke-current" style={{ color: colors.primary }}>
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Blueprint corner elements */}
      <div className="absolute top-4 left-4 opacity-20">
        <div className="flex items-center space-x-1">
          <Square className="w-3 h-3" style={{ color: colors.primary }} />
          <Triangle className="w-3 h-3" style={{ color: colors.accent }} />
          <div className="w-8 h-0.5" style={{ backgroundColor: colors.secondary }}></div>
        </div>
      </div>

      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} flex items-center`} style={{ zIndex: 9999 }}>
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.primary}`,
                color: colors.text,
              }}
            >
              <Globe className="w-3 h-3" />
              <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
            </button>

            {showLanguageSelector && (
              <>
                <div
                  className="fixed inset-0"
                  style={{ zIndex: 99998 }}
                  onClick={() => setShowLanguageSelector(false)}
                />
                <div
                  className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border py-1 min-w-[140px] max-h-48 overflow-y-auto"
                  style={{
                    zIndex: 99999,
                    borderColor: colors.borderColor
                  }}
                >
                {languageData.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 cursor-pointer"
                    style={{
                      backgroundColor: currentLanguage === lang.code ? colors.accent + '20' : 'transparent',
                      color: currentLanguage === lang.code ? colors.accent : colors.text
                    }}
                  >
                    <span className="text-sm">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </>
            )}
          </div>
        )}
      </div>

      <div className="relative px-6 py-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 pt-2">
            <div className="relative shrink-0 mt-5">
              <div className="w-25 h-25 rounded-xl border-2 shadow-xl overflow-hidden"
              style={{
                borderColor: colors.primary,
                boxShadow: `0 8px 25px ${colors.shadowColor}`
              }}>
                {headerData.profile_image ? (
                  <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                    <Layers className="w-8 h-8" style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
              <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2" style={{ borderColor: colors.accent }}></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2" style={{ borderColor: colors.accent }}></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2" style={{ borderColor: colors.accent }}></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2" style={{ borderColor: colors.accent }}></div>
            </div>

            <div className="flex-1 min-w-0 p-5">
              <h1 className="text-2xl font-semibold mb-2 break-words" style={{ color: colors.text, fontFamily: font }}>
                {headerData.name || data.name || 'Design Professional'}
              </h1>

              <div className="inline-flex max-w-full items-center rounded px-3 py-2"
                style={{ backgroundColor: colors.primary, color: 'white' }}>
                <Ruler className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-sm font-medium leading-5 break-words" style={{ fontFamily: font }}>
                  {headerData.title || 'Architect & Designer'}
                </span>
              </div>
            </div>
          </div>

          {headerData.tagline && (
            <div>
              <p className="text-[15px] leading-7" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {headerData.tagline}
              </p>
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
    <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
      <div className="grid grid-cols-2 gap-3">
        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`}
            className="flex items-center space-x-2 p-3 rounded-lg transition-all hover:scale-105"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 2px 8px ${colors.shadowColor}`
            }}>
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium" style={{ color: colors.text, fontFamily: font }}>{t('Email')}</span>
          </a>
        )}

        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`}
            className="flex items-center space-x-2 p-3 rounded-lg transition-all hover:scale-105"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 2px 8px ${colors.shadowColor}`
            }}>
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.secondary }}>
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium" style={{ color: colors.text, fontFamily: font }}>{t('Call')}</span>
          </a>
        )}

        {(contactData.website || data.website) && (
          <a href={contactData.website || data.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 rounded-lg transition-all hover:scale-105"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 2px 8px ${colors.shadowColor}`
            }}>
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.accent }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium" style={{ color: colors.text, fontFamily: font }}>{t('Portfolio')}</span>
          </a>
        )}

        {contactData.location && (
          <div className="flex items-center space-x-2 p-3 rounded-lg"
            style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '30' }}>
              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-xs font-medium truncate" style={{ color: colors.text, fontFamily: font }}>
              {contactData.location}
            </span>
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
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Design Philosophy')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>

        <p className="text-sm sm:text-base leading-7 mb-4" style={{ color: colors.text, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>

        {aboutData.specialties && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2" style={{ color: colors.secondary, fontFamily: font }}>
              {t('Specialties')}
            </p>
            <div className="flex flex-wrap gap-2">
              {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                <Badge
                  key={index}
                  className="text-sm font-medium"
                  style={{
                    backgroundColor: colors.accent + '20',
                    color: colors.accent,
                    border: `1px solid ${colors.accent}55`
                  }}
                >
                  {specialty.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(aboutData.experience || aboutData.education) && (
          <div className="space-y-2">
            {aboutData.experience && (
              <div className="flex justify-center">
                <div
                  className="inline-flex items-center gap-3 rounded-full px-4 py-2"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primary}14, ${colors.background})`,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                    style={{
                      backgroundColor: colors.primary,
                      color: '#FFFFFF',
                      fontFamily: font
                    }}
                  >
                    {aboutData.experience}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                      {t('Experience')}
                    </span>
                    <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>
                      {t('Years')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {aboutData.education && (
              <div className="text-sm">
                <span className="block font-semibold mb-1" style={{ color: colors.accent, fontFamily: font }}>
                  {t('Credentials')}
                </span>
                <span className="block leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {aboutData.education}
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
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Design Services')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 4px 12px ${colors.shadowColor}`
              }}
            >
              <div className="space-y-3">
                <h4
                  className="break-words text-base font-bold leading-6"
                  style={{ color: colors.text, fontFamily: font, overflowWrap: 'anywhere' }}
                >
                  {service.title}
                </h4>

                {service.description && (
                  <p className="text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {service.description}
                  </p>
                )}

                {(service.category || service.price_range) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {service.category && (
                      <Badge
                        className="inline-flex text-xs font-medium px-3 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: colors.secondary + '15', color: colors.secondary }}
                      >
                        {service.category}
                      </Badge>
                    )}
                    {service.price_range && (
                      <Badge
                        className="inline-flex text-xs font-medium px-3 py-0.5 rounded-full"
                        style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}
                      >
                        {service.price_range}
                      </Badge>
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

  const renderPortfolioSection = (portfolioData: any) => {
    const projects = portfolioData.projects || [];
    if (!Array.isArray(projects) || projects.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Featured Projects')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {projects.slice(0, 3).map((project: any, index: number) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}
            >
              <div className="h-45 overflow-hidden"
                style={{ backgroundColor: colors.cardBg }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.background }}>
                    <div className="text-center">
                      <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                        {project.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-base leading-6 mb-3" style={{ color: colors.text, fontFamily: font }}>
                  {project.title}
                </h4>

                {project.description && (
                  <p className="text-sm leading-6 mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {project.description}
                  </p>
                )}

                {(project.type || project.year || project.size) && (
                  <div className="flex flex-wrap gap-2">
                    {project.type && (
                      <Badge className="text-xs px-3 py-0.5 rounded-full capitalize" style={{ backgroundColor: colors.accent + '20', color: colors.accent }}>
                        {project.type}
                      </Badge>
                    )}
                    {project.year && (
                      <Badge className="text-xs px-3 py-0.5 rounded-full" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary }}>
                        {project.year}
                      </Badge>
                    )}
                    {project.size && (
                      <Badge className="text-xs px-3 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}>
                        {t('Size')}: {project.size}
                      </Badge>
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Design Process Videos')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="space-y-3">
          {videoContent.map((video: any) => (
            <div
              key={video.key}
              className="overflow-hidden rounded-2xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 4px 12px ${colors.shadowColor}`
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
                          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 20px ${colors.primary}70` }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              {(video.title || video.description || video.duration || video.project_type) && (
                <div className="p-4">
                  {video.title && (
                    <h4 className="font-bold text-base mb-2" style={{ color: colors.text, fontFamily: font }}>
                      {video.title}
                    </h4>
                  )}
                  {video.description && (
                    <p className="text-sm leading-6 mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {video.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {video.duration && (
                      <Badge
                        className="text-xs px-3 py-0.5 rounded-full"
                        style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}
                      >
                        <Clock className="w-4 h-4 mr-1" />
                        {video.duration}
                      </Badge>
                    )}
                    {video.video_type && (
                      <Badge
                        className="text-xs px-3 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: colors.accent + '20', color: colors.accent, fontFamily: font }}
                      >
                        {video.video_type.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('YouTube Channel')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        {youtubeData.latest_video_embed && (
          <div className="mb-4 overflow-hidden rounded-2xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}`, boxShadow: `0 4px 12px ${colors.shadowColor}` }}>
            <div className="p-4">
              <h4 className="font-semibold text-base flex items-center" style={{ color: colors.text, fontFamily: font }}>
                <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                {t("Latest Video")}
              </h4>
            </div>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: "56.25%", height: 0 }}>
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

        <div className="rounded-2xl p-4" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}`, boxShadow: `0 4px 12px ${colors.shadowColor}` }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || 'Design Studio'}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="mt-1 text-sm flex items-center" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  <span className="mr-2">📊</span>
                  {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>

          {youtubeData.channel_description && (
            <p className="text-sm leading-6 mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {youtubeData.channel_description}
            </p>
          )}

          <div className="space-y-3">
            {youtubeData.channel_url && (
              <Button
                size="sm"
                className="w-full"
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
                className="w-full"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                <Play className="w-4 h-4 mr-2" />
                {t("DESIGN PROCESS")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDesignProcessSection = (processData: any) => {
    const steps = processData.process_steps || [];
    if (!Array.isArray(steps) || steps.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Design Process')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div>
          {steps.sort((a, b) => a.step_number - b.step_number).map((step: any, index: number) => (
            <div
              key={index}
              className="mb-3 flex items-start gap-4 rounded-2xl p-4 last:mb-0"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 4px 12px ${colors.shadowColor}`
              }}
            >
              <div
                className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm flex-shrink-0"
                style={{
                  backgroundColor: colors.primary,
                  color: '#FFFFFF',
                  fontFamily: font
                }}
              >
                {step.step_number}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="min-w-0 flex-1 font-bold text-base leading-6" style={{ color: colors.text, fontFamily: font }}>
                    {step.step_title}
                  </h4>
                  {step.duration && (
                    <span
                      className="inline-flex shrink-0 rounded-full px-2.5 py-1 text-sm leading-none"
                      style={{ backgroundColor: colors.accent + '18', color: colors.accent, fontFamily: font }}
                    >
                      {step.duration}
                    </span>
                  )}
                </div>
                <p className="max-w-[95%] text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {step.step_description}
                </p>
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Design Inspiration')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((link: any, index: number) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              className="h-auto justify-start rounded-2xl px-3 py-2 cursor-pointer"
              style={{
                borderColor: colors.borderColor,
                color: colors.text,
                backgroundColor: colors.cardBg,
                fontFamily: font
              }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}>
              <div
                className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.primary + '12' }}
              >
                <SocialIcon platform={link.platform} color={colors.primary} />
              </div>
              <span className="capitalize text-sm font-medium" style={{ fontFamily: font }}>
                {link.platform}
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Studio Hours')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div
          className="rounded-2xl p-3"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `0 4px 12px ${colors.shadowColor}`
          }}
        >
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 py-3"
              style={{ borderBottom: index !== Math.min(hours.length, 7) - 1 ? `1px solid ${colors.borderColor}` : 'none' }}
            >
              <span className="capitalize font-medium text-sm" style={{ color: colors.text, fontFamily: font }}>
                {t(hour.day)}
              </span>

              {hour.is_closed ? (
                <span
                  className="inline-flex rounded-full px-3 py-1 text-sm"
                  style={{ backgroundColor: colors.background, color: colors.text + '80', fontFamily: font }}
                >
                  {t('Closed')}
                </span>
              ) : (
                <span className="text-sm font-medium text-right" style={{ color: colors.primary, fontFamily: font }}>
                  {hour.open_time} - {hour.close_time}
                </span>
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Client Reviews')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
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
                    className="rounded-[28px] p-4"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`,
                      boxShadow: `0 8px 20px ${colors.shadowColor}`
                    }}
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className="text-xl leading-none"
                            style={{ color: i < parseInt(review.rating || 5) ? '#FBBF24' : colors.borderColor }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {review.project_type && (
                        <Badge
                          className="text-xs px-3 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: colors.accent + '20', color: colors.accent, fontFamily: font }}
                        >
                          {review.project_type}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm leading-7 mb-4 italic" style={{ color: colors.text, fontFamily: font }}>
                      {review.review}
                    </p>

                    <div
                      className="flex items-center justify-center text-center"
                    >
                      <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                        - {review.client_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {testimonialsData.reviews.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="rotate-45 transition-all duration-300 cursor-pointer"
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40'
                  }}
                  onClick={() => setCurrentReview(dotIndex)}
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="text-center p-4 rounded-lg" style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.borderColor}`,
          boxShadow: `0 4px 12px ${colors.shadowColor}`
        }}>
          <h3 className="font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
            📋 {t('Design Consultation')}
          </h3>
          {appointmentsData?.consultation_info && (
            <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
              {appointmentsData.consultation_info}
            </p>
          )}
          <Button size="sm" className="rounded-lg"
            style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4 mr-2" />
            {t('Schedule Meeting')}
          </Button>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('Studio Location')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-[28px] p-3"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `0 8px 20px ${colors.shadowColor}`
          }}
        >
          {locationData.map_embed_url && (
            <ArchitectDesignerMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button size="sm" variant="outline" className="mt-3 w-full rounded-lg"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}>
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
          <div className="flex items-center justify-end gap-2 min-w-0">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {t('App Download')}
          </h3>
          <div className="flex items-center justify-start gap-2 min-w-0">
            <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {appData.app_store_url && (
            <Button size="sm" variant="outline" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              {t("App Store")}
            </Button>
          )}
          {appData.play_store_url && (
            <Button size="sm" variant="outline" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div
          className="rounded-[28px] p-5 text-center"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `0 8px 20px ${colors.shadowColor}`
          }}
        >
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: colors.primary + '14' }}
          >
            <Mail className="w-5 h-5" style={{ color: colors.primary }} />
          </div>

          <h3 className="font-semibold text-xl mb-2 leading-tight" style={{ color: colors.primary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm leading-6 mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button size="sm" className="rounded-lg px-6"
            style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Mail className="w-4 h-4 mr-2" />
            {t("Start Project")}
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    const isRecognitionSection = typeof customHtmlData.section_title === 'string' && customHtmlData.section_title.toLowerCase().includes('recognition');

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          isRecognitionSection ? (
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
              <div className="flex items-center justify-end gap-2 min-w-0">
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
                <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
              </div>
              <h3 className="px-1 text-center font-semibold text-xl leading-tight" style={{ color: colors.primary, fontFamily: font }}>
                {customHtmlData.section_title}
              </h3>
              <div className="flex items-center justify-start gap-2 min-w-0">
                <div className="h-px w-full max-w-24" style={{ backgroundColor: colors.primary }}></div>
                <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
              </div>
            </div>
          ) : (
            <h3 className="font-bold text-sm mb-3 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
              <Layers className="w-4 h-4 mr-2" />
              {customHtmlData.section_title}
            </h3>
          )
        )}
        <div
          className={`custom-html-content ${isRecognitionSection ? 'rounded-[28px] p-4' : 'p-3 rounded-lg'}`}
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: isRecognitionSection ? `0 8px 20px ${colors.shadowColor}` : 'none',
            fontFamily: font,
            color: colors.text,
          }}
        >
          <style>
            {`
              .custom-html-content .featured-work {
                ${isRecognitionSection ? `background-color: ${colors.background}; border: 1px solid ${colors.borderColor}; border-radius: 20px; padding: 1rem;` : ''}
              }
              .custom-html-content .featured-work::before {
                ${isRecognitionSection ? `content: "★"; display: flex; align-items: center; justify-content: center; width: 2.75rem; height: 2.75rem; margin-bottom: 0.9rem; border-radius: 9999px; background-color: ${colors.primary}12; color: ${colors.primary}; font-size: 1.25rem; font-weight: 700;` : ''}
              }
              .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
                color: ${colors.primary};
                margin-bottom: ${isRecognitionSection ? '0.75rem' : '0.5rem'};
                font-family: ${font};
                ${isRecognitionSection ? 'font-size: 1.05rem; line-height: 1.6rem;' : ''}
              }
              .custom-html-content p {
                color: ${colors.text};
                margin-bottom: ${isRecognitionSection ? '0' : '0.5rem'};
                font-family: ${font};
                ${isRecognitionSection ? 'font-size: 0.95rem; line-height: 1.7rem;' : ''}
              }
              .custom-html-content a {
                color: ${colors.accent};
                text-decoration: underline;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
              }
              .custom-html-content code {
                background-color: ${colors.primary}20;
                color: ${colors.accent};
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="space-y-3">
          {actionButtonsData.contact_button_text && (
            <Button
              className="w-full"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Compass className="w-4 h-4 mr-2" />
              {actionButtonsData.contact_button_text}
            </Button>
          )}

          {actionButtonsData.appointment_button_text && (
            <Button
              className="w-full"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {actionButtonsData.appointment_button_text}
            </Button>
          )}

          {actionButtonsData.save_contact_button_text && (
            <Button
              className="w-full"
              variant="outline"
              style={{
                borderColor: colors.secondary,
                color: colors.secondary,
                fontFamily: font
              }}
              onClick={() => {
                const contactData = {
                  name: data.name || configSections.header?.name || '',
                  title: configSections.header?.title || t('Architect & Designer'),
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
              {actionButtonsData.save_contact_button_text}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
          {qrData.qr_title && (
            <h4 className="font-bold mb-2" style={{ color: colors.primary, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}

          {qrData.qr_description && (
            <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            size="sm"
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
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-3 pt-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-14 h-px" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <h4 className="text-lg font-semibold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Thank You')}
          </h4>
          <div className="flex items-center gap-2">
            <div className="w-14 h-px" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>

        <p className="text-center text-sm leading-7 italic" style={{ color: colors.text + 'CC', fontFamily: font }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  return (
    <>
      <style>{`
        .video-container iframe {
          width: 100% !important;
          height: 180px !important;
          border: none;
        }
        .video-container {
          position: relative;
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
      `}</style>
      <div className="w-full rounded-2xl overflow-hidden" style={{
        fontFamily: font,
        backgroundColor: colors.background,
        boxShadow: `0 12px 40px ${colors.shadowColor}`,
        border: `1px solid ${colors.borderColor}`,
        direction: isRTL ? 'rtl' : 'ltr',
        position: 'relative'
      }}>
        {orderedSectionKeys
          .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
          .map((sectionKey) => (
            <React.Fragment key={sectionKey}>
              {renderSection(sectionKey)}
            </React.Fragment>
          ))}



        {copyrightSection && (
          <div className="px-6 pb-4 pt-2">
            {copyrightSection.text && (
              <p className="text-sm text-center" style={{ color: colors.text + '70', fontFamily: font }}>
                {copyrightSection.text}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
