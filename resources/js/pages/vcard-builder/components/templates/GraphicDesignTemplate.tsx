import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Palette, Sparkles, Eye, Heart, Video, Play, Youtube, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface GraphicDesignTemplateProps {
  data: any;
  template: any;
}

const GraphicDesignMapEmbed = React.memo(function GraphicDesignMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function GraphicDesignTemplate({ data, template }: GraphicDesignTemplateProps) {
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

  const colors = configSections.colors || template?.defaultColors || { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#45B7D1', background: '#FFFFFF', text: '#2C3E50' };

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
  const allSections = getBusinessTemplate('graphic-design')?.sections || [];

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
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'portfolio':
        return renderPortfolioSection(sectionData);
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
    <div className="relative rounded-t-2xl overflow-hidden" style={{ 
      background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20, ${colors.accent}20)`,
      minHeight: '200px'
    }}>
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-4 left-4 w-12 h-12 rounded-full opacity-30 animate-bounce" 
             style={{ backgroundColor: colors.primary, animationDelay: '0s' }}></div>
        <div className="absolute top-8 right-8 w-8 h-8 rotate-45 opacity-40 animate-bounce" 
             style={{ backgroundColor: colors.secondary, animationDelay: '1s' }}></div>
        <div className="absolute bottom-6 left-12 w-6 h-6 rounded-full opacity-50 animate-bounce" 
             style={{ backgroundColor: colors.accent, animationDelay: '2s' }}></div>
        <div className="absolute bottom-12 right-6 w-10 h-10 rotate-12 opacity-30 animate-bounce" 
             style={{ backgroundColor: colors.primary, animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative px-6 py-8">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: colors.primary,
                  color: 'white',
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
        
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 shadow-2xl overflow-hidden" 
               style={{ borderColor: colors.primary, boxShadow: `0 0 30px ${colors.primary}40` }}>
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                <Palette className="w-10 h-10" style={{ color: colors.primary }} />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
            {headerData.name || data.name || 'Creative Designer'}
          </h1>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full mb-3" 
               style={{ backgroundColor: colors.primary, color: 'white' }}>
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium" style={{ fontFamily: font }}>
              {headerData.title || 'Graphic Designer'}
            </span>
          </div>
          
          {headerData.tagline && (
            <p className="text-sm italic max-w-xs mx-auto" style={{ color: colors.text, fontFamily: font }}>
              "{headerData.tagline}"
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

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-4">
      <div className="grid grid-cols-2 gap-3">
        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`}
             className="flex items-center space-x-2 p-3 rounded-xl transition-all hover:scale-105"
             style={{ backgroundColor: colors.primary + '15', border: `2px solid ${colors.primary}30` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium truncate" style={{ color: colors.text, fontFamily: font }}>
              {t("Email")}
            </span>
          </a>
        )}
        
        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`}
             className="flex items-center space-x-2 p-3 rounded-xl transition-all hover:scale-105"
             style={{ backgroundColor: colors.secondary + '15', border: `2px solid ${colors.secondary}30` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium truncate" style={{ color: colors.text, fontFamily: font }}>
              {t("Call")}
            </span>
          </a>
        )}
        
        {(contactData.website || data.website) && (
          <a href={contactData.website || data.website} target="_blank" rel="noopener noreferrer"
             className="flex items-center space-x-2 p-3 rounded-xl transition-all hover:scale-105"
             style={{ backgroundColor: colors.accent + '15', border: `2px solid ${colors.accent}30` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium truncate" style={{ color: colors.text, fontFamily: font }}>
              {t("Portfolio")}
            </span>
          </a>
        )}
        
        {contactData.location && (
          <div className="flex items-center space-x-2 p-3 rounded-xl"
               style={{ backgroundColor: colors.primary + '10', border: `2px solid ${colors.primary}20` }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '50' }}>
              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-xs font-medium" style={{ color: colors.text, fontFamily: font }}>
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
      <div className="px-6 py-4">
        <div className="relative rounded-2xl mt-3" style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}20`, boxShadow: `0 4px 15px ${colors.primary}10` }}>
          {/* Floating title badge */}
          <div className="absolute -top-3 left-4 px-3 py-1 rounded-full z-10" style={{ backgroundColor: colors.primary, color: 'white' }}>
            <span className="text-sm font-bold" style={{ fontFamily: font }}>About Me</span>
          </div>

          {/* Description */}
          <div className="px-4 pt-6 pb-4">
            <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
              {aboutData.description || data.description}
            </p>
          </div>

          {/* Specialties */}
          {aboutData.specialties && (
            <div className="mx-4 mb-3 px-3 py-3 rounded-xl" style={{ backgroundColor: colors.primary + '08', border: `1px solid ${colors.primary}15` }}>
              <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: colors.primary, fontFamily: font }}>
                <Eye className="w-3 h-3" />
                {t('Specialties')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                  <span key={index} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: colors.accent + '20', color: colors.accent, border: `1px solid ${colors.accent}40`, fontFamily: font }}>
                    {specialty.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience + philosophy */}
          {(aboutData.experience || aboutData.design_philosophy) && (
            <div className="flex items-center gap-3 mx-4 mb-4 px-3 py-3 rounded-xl"
                 style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}08)`, border: `1px solid ${colors.primary}15` }}>
              {aboutData.experience && (
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                     style={{ backgroundColor: colors.primary, color: 'white' }}>
                  <span className="text-base font-bold leading-none" style={{ fontFamily: font }}>{aboutData.experience}+</span>
                  <span className="text-xs leading-none mt-0.5" style={{ fontFamily: font }}>{t('Yrs')}</span>
                </div>
              )}
              {aboutData.design_philosophy && (
                <p className="text-sm leading-relaxed italic" style={{ color: colors.text + 'AA', fontFamily: font }}>
                  “{aboutData.design_philosophy}”
                </p>
              )}
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
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <Palette className="w-5 h-5 mr-2" />
          {t('Creative Services')}
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {services.map((service: any, index: number) => (
            <div key={index} className="relative p-4 rounded-2xl transition-all hover:scale-105"
                 style={{
                   backgroundColor: index % 2 === 0 ? colors.primary + '10' : colors.secondary + '10',
                   border: `2px solid ${index % 2 === 0 ? colors.primary + '30' : colors.secondary + '30'}`
                 }}>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ backgroundColor: index % 2 === 0 ? colors.primary + '20' : colors.secondary + '20' }}>
                  {service.icon || '🎨'}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1" style={{ color: colors.text, fontFamily: font }}>
                    {service.title}
                  </h4>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + '80', fontFamily: font }}>
                    {service.description}
                  </p>
                  {service.price && (
                    <div className="inline-block px-3 py-1 rounded-full"
                         style={{ backgroundColor: colors.accent, color: 'white' }}>
                      <span className="text-xs font-bold" style={{ fontFamily: font }}>
                        {service.price}
                      </span>
                    </div>
                  )}
                </div>
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
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center" 
            style={{ color: colors.primary, fontFamily: font }}>
          <Video className="w-5 h-5 mr-2" />
          {t('Design Process Videos')}
        </h3>
        <div className="space-y-3">
          {videoContent.map((video: any) => (
            <div key={video.key} className="rounded-2xl overflow-hidden transition-all hover:scale-105" 
                 style={{ 
                   backgroundColor: colors.cardBg,
                   border: `2px solid ${colors.primary}20`,
                   boxShadow: `0 4px 15px ${colors.primary}10`
                 }}>
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
                      className="relative w-full h-44 cursor-pointer"
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
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm leading-snug" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.video_type && (
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize whitespace-nowrap flex-shrink-0"
                          style={{ backgroundColor: colors.accent + '20', color: colors.accent, fontFamily: font }}>
                      {video.video_type.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>
                {video.description && (
                  <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + 'AA', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                {video.duration && (
                  <span className="text-xs" style={{ color: colors.text + '90', fontFamily: font }}>
                    ⏱️ {video.duration}
                  </span>
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
      <div className="px-6 py-4">
        {/* Section header */}
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <Youtube className="w-5 h-5 mr-2" />
          {t('YouTube Channel')}
        </h3>

        <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${colors.primary}20`, boxShadow: `0 4px 15px ${colors.primary}10` }}>

          {/* Latest video embed */}
          {youtubeData.latest_video_embed && (
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '45%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
              />
            </div>
          )}

          {/* Channel info */}
          <div className="p-4" style={{ backgroundColor: colors.cardBg }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Design Studio'}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
                    {youtubeData.subscriber_count} {t('subscribers')}
                  </p>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="text-xs leading-relaxed mb-4" style={{ color: colors.text + 'AA', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}

            <div className="space-y-2">
              {youtubeData.channel_url && (
                <Button
                  size="sm"
                  className="w-full rounded-xl font-bold cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  {t('Subscribe')}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full rounded-xl cursor-pointer"
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t('Design Tutorials')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPortfolioSection = (portfolioData: any) => {
    const projects = portfolioData.projects || [];
    if (!Array.isArray(projects) || projects.length === 0) return null;
    const categoryEmoji: Record<string, string> = {
      branding: '🏷️', 'web-design': '💻', print: '📄', packaging: '📦', illustration: '🎭', logo: '✏️'
    };
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <Palette className="w-5 h-5 mr-2" />
          {t('Portfolio Gallery')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {projects.map((project: any, index: number) => (
            <div key={index} className="rounded-2xl overflow-hidden"
                 style={{ border: `2px solid ${colors.primary}20`, boxShadow: `0 4px 12px ${colors.primary}10` }}>
              {/* Image */}
              <div className="w-full h-32 overflow-hidden"
                   style={{ backgroundColor: colors.cardBg }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl"
                       style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}>
                    {categoryEmoji[project.category] || '🎨'}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-2.5" style={{ backgroundColor: colors.cardBg }}>
                <p className="font-bold text-xs leading-snug mb-0.5" style={{ color: colors.text, fontFamily: font }}>
                  {project.title}
                </p>
                {project.category && (
                  <p className="text-xs capitalize mb-1" style={{ color: colors.primary, fontFamily: font }}>
                    {project.category.replace(/-/g, ' ')}
                  </p>
                )}
                {project.description && (
                  <p className="text-xs leading-relaxed" style={{ color: colors.text + '80', fontFamily: font }}>
                    {project.description}
                  </p>
                )}
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
    const accentColors = [colors.primary, colors.secondary, colors.accent];
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <Share2 className="w-5 h-5 mr-2" />
          {t('Follow My Creative Journey')}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {socialLinks.map((link: any, index: number) => {
            const accent = accentColors[index % accentColors.length];
            return (
              <button
                key={index}
                className="flex items-center gap-2 p-3 rounded-2xl transition-all hover:scale-105 text-left"
                style={{ backgroundColor: accent + '15', border: `1.5px solid ${accent}30` }}
                onClick={() => link.url && typeof window !== 'undefined' && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ backgroundColor: accent, color: 'white' }}>
                  <SocialIcon platform={link.platform} size={16} color="white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold capitalize truncate" style={{ color: colors.text, fontFamily: font }}>
                    {link.platform}
                  </p>
                  {link.username && (
                    <p className="text-xs truncate" style={{ color: accent, fontFamily: font }}>
                      {link.username}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <Calendar className="w-5 h-5 mr-2" />
          {t('Studio Hours')}
        </h3>
        <div className="rounded-2xl overflow-hidden" style={{ border: `2px solid ${colors.primary}20` }}>
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index}
                 className="flex justify-between items-center px-4 py-2.5"
                 style={{
                   backgroundColor: index % 2 === 0 ? colors.cardBg : colors.primary + '08',
                   borderBottom: index < 6 ? `1px solid ${colors.primary}15` : 'none'
                 }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                     style={{ backgroundColor: hour.is_closed ? colors.text + '30' : colors.secondary }} />
                <span className="capitalize font-medium text-xs" style={{ color: colors.text, fontFamily: font }}>
                  {t(hour.day)}
                </span>
              </div>
              <span className="text-xs font-semibold"
                    style={{ color: hour.is_closed ? colors.text + '50' : colors.primary, fontFamily: font }}>
                {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
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
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <Heart className="w-5 h-5 mr-2" />
          {t('Client Love')}
        </h3>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div className="p-4 rounded-2xl"
                       style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}20`, boxShadow: `0 4px 15px ${colors.primary}10` }}>

                    {/* Client info + stars */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                             style={{ backgroundColor: colors.primary }}>
                          {review.client_name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight" style={{ color: colors.text, fontFamily: font }}>
                            {review.client_name}
                          </p>
                          {review.client_company && (
                            <p className="text-xs" style={{ color: colors.text + '70', fontFamily: font }}>
                              {review.client_company}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i < parseInt(review.rating || 5) ? '#FBBF24' : 'none'} stroke={i < parseInt(review.rating || 5) ? '#FBBF24' : colors.text + '30'} strokeWidth="1.5">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-sm leading-relaxed mb-3 italic" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {review.review}
                    </p>

                    {/* Project type */}
                    {review.project_type && (
                      <span className="text-xs px-2 py-1 rounded-full"
                            style={{ backgroundColor: colors.accent + '20', color: colors.accent, fontFamily: font }}>
                        {review.project_type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-3 gap-1.5">
              {reviews.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentReview(dotIndex)}
                  className="rounded-full transition-all cursor-pointer"
                  style={{
                    width: dotIndex === currentReview ? '20px' : '8px',
                    height: '8px',
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

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-6 py-4">
        <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: colors.primary + '10', border: `2px solid ${colors.primary}30` }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('Free Creative Consultation')}
          </h3>
          {appointmentsData?.consultation_note && (
            <p className="text-xs mb-3" style={{ color: colors.text, fontFamily: font }}>
              {appointmentsData.consultation_note}
            </p>
          )}
          <Button size="sm" className="rounded-full cursor-pointer" 
                  style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                  onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4 mr-2" />
            {t('Book Now')}
          </Button>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
            style={{ color: colors.primary, fontFamily: font }}>
          <MapPin className="w-5 h-5 mr-2" />
          {t('Studio Location')}
        </h3>

        <div className="rounded-2xl overflow-hidden"
             style={{ border: `2px solid ${colors.primary}20`, boxShadow: `0 4px 15px ${colors.primary}10` }}>
          {locationData.map_embed_url && (
            <GraphicDesignMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <div className="p-3" style={{ backgroundColor: colors.cardBg }}>
              <Button
                size="sm"
                className="w-full rounded-xl font-semibold cursor-pointer"
                style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {t('Get Directions')}
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
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-2">
          {appData.app_store_url && (
            <Button size="sm" variant="outline" className="cursor-pointer" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                    onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button size="sm" variant="outline" className="cursor-pointer" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                    onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
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
      <div className="px-6 py-4">
        <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: colors.secondary + '10', border: `2px solid ${colors.secondary}30` }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: colors.secondary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button size="sm" className="rounded-full cursor-pointer" 
                  style={{ backgroundColor: colors.secondary, color: 'white', fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Mail className="w-4 h-4 mr-2" />
            {t('Start Project')}
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div className="px-6 py-4">
        {customHtmlData.show_title && customHtmlData.section_title && (
          <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center" 
              style={{ color: colors.primary, fontFamily: font }}>
            <Palette className="w-5 h-5 mr-2" />
            {customHtmlData.section_title}
          </h3>
        )}
        <div 
          className="custom-html-content p-4 rounded-2xl" 
          style={{ 
            backgroundColor: colors.cardBg,
            border: `2px solid ${colors.primary}20`,
            boxShadow: `0 4px 15px ${colors.primary}10`,
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
                font-weight: medium;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
              }
              .custom-html-content code {
                background: linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20);
                color: ${colors.accent};
                padding: 0.125rem 0.25rem;
                border-radius: 0.5rem;
                font-family: 'Monaco', monospace;
                font-weight: medium;
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
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center" 
            style={{ color: colors.primary, fontFamily: font }}>
          <Share2 className="w-5 h-5 mr-2" />
          {t("Share My Work")}
        </h3>
        <div className="text-center p-4 rounded-2xl" 
             style={{ 
               backgroundColor: colors.cardBg,
               border: `2px solid ${colors.primary}20`,
               boxShadow: `0 4px 15px ${colors.primary}10`
             }}>
          {qrData.qr_title && (
            <h4 className="font-bold text-sm mb-2" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}
          
          {qrData.qr_description && (
            <p className="text-sm mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            size="sm" 
            className="w-full rounded-xl cursor-pointer" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
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

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4">
        <div className="relative p-5 rounded-2xl text-center overflow-hidden"
             style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15, ${colors.accent}15)`, border: `2px solid ${colors.primary}20` }}>
          {/* Decorative circles */}
          <div className="absolute top-2 left-3 w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: colors.primary }} />
          <div className="absolute bottom-2 right-3 w-4 h-4 rounded-full opacity-20" style={{ backgroundColor: colors.secondary }} />

          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
               style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-5 space-y-3"
           style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}12, ${colors.accent}08)` }}>
        {hasContactButton && (
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-bold text-sm transition-all hover:scale-105 hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
              boxShadow: `0 6px 18px ${colors.primary}35`
            }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Sparkles className="w-4 h-4" />
            {actionData.contact_button_text}
          </button>
        )}

        {hasSaveContactButton && (
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl font-semibold text-sm transition-all hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${colors.primary}`,
              color: colors.primary,
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
              import('@/utils/vcfGenerator').then(module => { module.downloadVCF(vcfData); });
            }}
          >
            <UserPlus className="w-4 h-4" />
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
    <div className="w-full rounded-3xl overflow-hidden shadow-2xl" style={{ 
      fontFamily: font,
      backgroundColor: colors.background,
      border: `3px solid ${colors.primary}20`,
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
        <div className="px-6 pt-3 pb-5">
          <div className="h-px w-full mb-3" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)` }} />
          {copyrightSection.text && (
            <p className="text-xs text-center" style={{ color: colors.text + '90', fontFamily: font }}>
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