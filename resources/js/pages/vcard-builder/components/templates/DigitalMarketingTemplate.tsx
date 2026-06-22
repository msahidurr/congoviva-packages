import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, Download, UserPlus, TrendingUp, Target, BarChart3, Zap, Play, Youtube, Video, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';

interface DigitalMarketingTemplateProps {
  data: any;
  template: any;
}

const DigitalMarketingMapEmbed = React.memo(function DigitalMarketingMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function DigitalMarketingTemplate({ data, template }: DigitalMarketingTemplateProps) {
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

  const colors = configSections.colors || template?.defaultColors || { primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', text: '#1E293B' };
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
  const allSections = getBusinessTemplate('digital-marketing')?.sections || [];

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
    <div className="relative rounded-t-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current text-white">
          <defs>
            <pattern id="marketing-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#marketing-grid)" />
        </svg>
      </div>

      <div className="px-6 py-8 relative">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                <Globe className="w-3 h-3" />
                <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>

              {showLanguageSelector && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] max-h-48 overflow-y-auto z-50">
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 cursor-pointer ${currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
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

        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Logo" className="w-full h-full rounded-xl object-cover" />
            ) : (
              <TrendingUp className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1" style={{ fontFamily: font }}>
              {headerData.name || data.name || 'Digital Marketing Agency'}
            </h1>
            <p className="text-white/90 text-sm font-medium mb-2" style={{ fontFamily: font }}>
              {headerData.title || 'Growing Your Digital Presence'}
            </p>
            {headerData.tagline && (
              <p className="text-white/80 text-xs leading-relaxed" style={{ fontFamily: font }}>
                {headerData.tagline}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-2">
            {headerData.badge_1 && (
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-medium" style={{ fontFamily: font }}>{headerData.badge_1}</span>
              </div>
            )}
            {headerData.badge_2 && (
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white text-xs font-medium" style={{ fontFamily: font }}>{headerData.badge_2}</span>
              </div>
            )}
          </div>
          {headerData.badge_3 && (
            <div className="flex items-center space-x-1 text-white/80">
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-medium" style={{ fontFamily: font }}>{headerData.badge_3}</span>
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
    <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
      <div className="px-6 py-4 space-y-2">
        {(contactData.phone || data.phone) && (
          <a
            href={`tel:${contactData.phone || data.phone}`}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <Phone className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
              {contactData.phone || data.phone}
            </span>
          </a>
        )}
        {(contactData.email || data.email) && (
          <a
            href={`mailto:${contactData.email || data.email}`}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <Mail className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-medium truncate" style={{ color: colors.primary, fontFamily: font }}>
              {contactData.email || data.email}
            </span>
          </a>
        )}
        {(contactData.website || data.website) && (
          <a
            href={contactData.website || data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <Globe className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-medium truncate" style={{ color: colors.primary, fontFamily: font }}>
              {contactData.website || data.website}
            </span>
          </a>
        )}
        {contactData.location && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '15' }}>
              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
              {contactData.location}
            </span>
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

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    const specialties = aboutData.specialties ? aboutData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('About Us')}</h3>
          </div>
          {aboutData.experience && (
            <div className="text-right">
              <p className="text-lg font-extrabold leading-none" style={{ color: colors.primary, fontFamily: font }}>{aboutData.experience}+</p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: colors.text + '70', fontFamily: font }}>{t('Years')}</p>
            </div>
          )}
        </div>

        <div className="px-6 pb-5 pt-3">
          <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
            {aboutData.description || data.description}
          </p>

          {specialties.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {specialties.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.secondary }} />
                  <span className="text-xs" style={{ color: colors.text + 'CC', fontFamily: font }}>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Our Services')}
          </h3>
        </div>

        <div className="px-6 pb-5 space-y-3">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}25` }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-semibold text-sm flex-1 min-w-0" style={{ color: colors.primary, fontFamily: font }}>
                  {service.title}
                </h4>
                {service.price && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: font }}>
                    {service.price}
                  </span>
                )}
              </div>
              {service.description && (
                <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                  {service.description}
                </p>
              )}
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
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Success Stories')}
          </h3>
        </div>

        <div className="px-6 pb-5 space-y-4">
          {projects.map((project: any, index: number) => (
            <div key={index} className="rounded-xl p-3 flex gap-3 items-start" style={{ backgroundColor: colors.accent }}>
              {project.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={project.image} alt={project.title || 'Case Study'} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>
                  {project.title}
                </h4>
                {project.results && (
                  <p className="text-xs mt-1 font-medium" style={{ color: colors.primary, fontFamily: font }}>
                    {project.results}
                  </p>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs mt-1 inline-block"
                    style={{ color: colors.secondary, fontFamily: font }}
                  >
                    {t('View Case Study')} →
                  </a>
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
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Video className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Marketing Videos')}
          </h3>
        </div>

        <div className="px-6 pb-5 space-y-4">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');
            return (
              <div key={video.key} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.primary}15` }}>
                {/* Thumbnail */}
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
                    className="relative w-full cursor-pointer"
                    style={{ height: '180px' }}
                    onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                  >
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
                        <Video className="w-8 h-8" style={{ color: colors.primary }} />
                      </div>
                    )}
                    {/* Dark overlay + play button */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%)' }} />
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
                        >
                          <Play className="w-5 h-5 ml-0.5" style={{ color: colors.primary }} />
                        </div>
                      </div>
                    )}
                    {/* Duration badge */}
                    {video.duration && (
                      <span
                        className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff', fontFamily: font }}
                      >
                        {video.duration}
                      </span>
                    )}
                    {/* Channel badge */}
                    {video.marketing_channel && (
                      <span
                        className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: font }}
                      >
                        {video.marketing_channel.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>
                )}

                {/* Info */}
                <div className="px-4 py-3" style={{ backgroundColor: colors.accent }}>
                  <h4 className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: colors.text + '99', fontFamily: font }}>
                      {video.description}
                    </p>
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
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Youtube className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('YouTube Channel')}
          </h3>
        </div>

        <div className="px-6 pb-5 space-y-4">
          {/* Channel info card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${colors.primary}15` }}
          >
            <div
              className="px-4 py-4 flex items-center gap-3"
              style={{ backgroundColor: colors.accent }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF0000' }}>
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-xs mt-0.5" style={{ color: colors.text + '99', fontFamily: font }}>
                    {youtubeData.subscriber_count} {t('subscribers')}
                  </p>
                )}
              </div>
              {youtubeData.channel_url && (
                <button
                  className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: font }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  {t('Subscribe')}
                </button>
              )}
            </div>
            {youtubeData.channel_description && (
              <div className="px-4 py-3" style={{ borderTop: `1px solid ${colors.primary}10` }}>
                <p className="text-xs leading-relaxed" style={{ color: colors.text + '99', fontFamily: font }}>
                  {youtubeData.channel_description}
                </p>
              </div>
            )}
          </div>

          {/* Latest video embed */}
          {youtubeData.latest_video_embed && (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.primary}15` }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: colors.accent }}>
                <Play className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Latest Video')}</span>
              </div>
              <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                <div
                  className="absolute inset-0 w-full h-full"
                  ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
                />
              </div>
            </div>
          )}

          {/* Featured playlist */}
          {youtubeData.featured_playlist && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
            >
              {t('Featured Playlist')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Follow Us')}
          </h3>
        </div>
        <div className="px-6 pb-5 flex flex-wrap justify-center gap-2">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}25` }}
              onClick={() => link.url && typeof window !== 'undefined' && window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <SocialIcon platform={link.platform} color={colors.primary} />
            </button>
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
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Office Hours')}
          </h3>
        </div>
        <div className="px-6 pb-5 space-y-1">
          {hours.slice(0, 7).map((hour: any, index: number) => {
            const isToday = hour.day === currentDay;
            return (
              <div
                key={index}
                className="flex justify-between items-center px-3 py-2 rounded-lg"
                style={{ backgroundColor: isToday ? colors.primary + '12' : 'transparent' }}
              >
                <span
                  className="text-xs capitalize font-medium"
                  style={{ color: isToday ? colors.primary : colors.text, fontFamily: font }}
                >
                  {t(hour.day)}
                  {isToday && (
                    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                      {t('Today')}
                    </span>
                  )}
                </span>
                <span
                  className="text-xs"
                  style={{ color: hour.is_closed ? colors.text + '60' : isToday ? colors.primary : colors.text + '99', fontFamily: font }}
                >
                  {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <UserPlus className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Client Success')}
          </h3>
        </div>

        <div className="px-6 pb-5">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="rounded-2xl p-4" style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}15` }}>
                    <div className="flex items-center gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg" style={{ color: i < parseInt(review.rating || 5) ? '#FBBF24' : '#D1D5DB' }}>★</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
                      "{review.review}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary }}>
                        <span className="text-[10px] font-bold text-white">{review.client_name?.charAt(0)?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: colors.text, fontFamily: font }}>{review.client_name}</p>
                        {review.company && (
                          <p className="text-[10px]" style={{ color: colors.text + '80', fontFamily: font }}>{review.company}</p>
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
              {reviews.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="rounded-full transition-all"
                  style={{
                    width: dotIndex === currentReview ? '16px' : '6px',
                    height: '6px',
                    backgroundColor: dotIndex === currentReview ? colors.primary : colors.primary + '40'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
      <div className="px-6 pt-5 pb-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
          {appointmentsData.section_title || t('Free Consultation')}
        </h3>
      </div>
      <div className="px-6 pb-5 space-y-2">
        {appointmentsData.booking_url && (
          <button
            className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: colors.accent, color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            {appointmentsData.button_text || t('Book Now')}
          </button>
        )}
        {appointmentsData.calendar_link && (
          <button
            className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: colors.accent, color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.open(appointmentsData.calendar_link, '_blank', 'noopener,noreferrer')}
          >
            {t('View Calendar')}
          </button>
        )}
        {!appointmentsData.booking_url && !appointmentsData.calendar_link && (
          <button
            className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: colors.accent, color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            {appointmentsData.button_text || t('Book Strategy Call')}
          </button>
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

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Visit Our Office')}
          </h3>
        </div>
        <div className="px-6 pb-5 space-y-3">
          {locationData.map_embed_url && (
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.primary}15` }}>
              <DigitalMarketingMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          {locationData.directions_url && (
            <button
              className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.accent, color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="w-3.5 h-3.5" />
              {t('Get Directions')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Download className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Download Our App')}
          </h3>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          {appData.app_store_url && (
            <button
              className="flex-1 py-2 rounded-xl cursor-pointer text-xs font-semibold"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}25`, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t('App Store')}
            </button>
          )}
          {appData.play_store_url && (
            <button
              className="flex-1 py-2 rounded-xl cursor-pointer text-xs font-semibold"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}25`, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t('Google Play')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Mail className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {formData.form_title}
          </h3>
        </div>
        <div className="px-6 pb-5">
          {formData.form_description && (
            <p className="text-xs mb-3 leading-relaxed" style={{ color: colors.text + '99', fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <button
            className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: colors.accent, color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            {t('Get Free Quote')}
          </button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    return (
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="px-6 pt-5 pb-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <Target className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
              {customHtmlData.section_title}
            </h3>
          </div>
        )}
        <div
          className="custom-html-content px-6 pb-5"
          style={{ fontFamily: font, color: colors.text }}
        >
          <style>
            {`
              .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
                color: ${colors.primary}; margin-bottom: 0.5rem; font-family: ${font};
              }
              .custom-html-content p { color: ${colors.text}; margin-bottom: 0.5rem; font-family: ${font}; font-size: 0.75rem; line-height: 1.5; }
              .custom-html-content a { color: ${colors.secondary}; text-decoration: underline; }
              .custom-html-content ul, .custom-html-content ol { color: ${colors.text}; padding-left: 1rem; font-family: ${font}; font-size: 0.75rem; }
              .custom-html-content code { background-color: ${colors.primary}20; color: ${colors.primary}; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
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
      <div className="bg-white" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="px-6 pt-5 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {qrData.qr_title || t('Share QR Code')}
          </h3>
        </div>
        <div className="px-6 pb-5">
          {qrData.qr_description && (
            <p className="text-xs mb-3 leading-relaxed" style={{ color: colors.text + '99', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          <button
            className="w-full py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.accent, color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-3.5 h-3.5" />
            {t('Share QR Code')}
          </button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4 text-center" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasAppointmentButton = actionData.appointment_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasAppointmentButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-5 space-y-2" style={{ backgroundColor: colors.accent, borderTop: `1px solid ${colors.primary}15` }}>
        {hasContactButton && (
          <button
            className="w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            {actionData.contact_button_text}
          </button>
        )}
        {hasAppointmentButton && (
          <button
            className="w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: 'white', color: colors.primary, border: `1px solid ${colors.primary}30`, fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            {actionData.appointment_button_text}
          </button>
        )}
        {hasSaveContactButton && (
          <button
            className="w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2"
            style={{ backgroundColor: 'white', color: colors.primary, border: `1px solid ${colors.primary}30`, fontFamily: font }}
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
            <UserPlus className="w-3.5 h-3.5" />
            {actionData.save_contact_button_text}
          </button>
        )}
      </div>
    );
  };

  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={{
      fontFamily: font,
      backgroundColor: colors.background || '#F8FAFC',
      border: `1px solid ${colors.accent}`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}

      {copyrightSection && (
        <div className="px-6 py-3" style={{ backgroundColor: colors.primary }}>
          {copyrightSection.text && (
            <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: font }}>
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
