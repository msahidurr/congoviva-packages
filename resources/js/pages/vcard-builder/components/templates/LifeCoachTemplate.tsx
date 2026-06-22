import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Target, TrendingUp, Star, Lightbulb, Zap, Video, Play, Youtube, Share2, QrCode, Mic, Mic2, Share, Users, Clock, Quote, Heart } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeText, sanitizeUrl } from '@/utils/sanitizeHtml';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface LifeCoachTemplateProps {
  data: any;
  template: any;
}

const LifeCoachMapEmbed = React.memo(function LifeCoachMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function LifeCoachTemplate({ data, template }: LifeCoachTemplateProps) {
  const { t, i18n } = useTranslation();

  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  // Testimonials state
  const [currentReview, setCurrentReview] = React.useState(0);
  const [currentTransformation, setCurrentTransformation] = React.useState(0);

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

  // Effect for transformations rotation
  React.useEffect(() => {
    const transformationsData = configSections.transformations;
    const stories = transformationsData?.success_stories || [];
    if (!Array.isArray(stories) || stories.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTransformation(prev => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [configSections.transformations?.success_stories]);
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

  const colors = configSections.colors || template?.defaultColors || { primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F', background: '#FFF9F0', text: '#2D1B69' };
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
  const allSections = getBusinessTemplate('life-coach')?.sections || [];

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
      case 'programs':
        return renderProgramsSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'transformations':
        return renderTransformationsSection(sectionData);
      case 'speaking':
        return renderSpeakingSection(sectionData);
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
    <div className="relative rounded-t-3xl overflow-hidden" style={{
      background: `radial-gradient(circle at top right, ${colors.primary}20, ${colors.secondary}15, ${colors.accent}10)`,
      minHeight: '220px'
    }}>
      {/* Inspirational rays */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute opacity-10"
            style={{
              top: '20%',
              left: '50%',
              width: '2px',
              height: '100px',
              background: `linear-gradient(to bottom, ${colors.primary}, transparent)`,
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: 'top center'
            }}></div>
        ))}
      </div>

      <div className="relative px-6 py-8 text-center">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                  color: colors.text,
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${colors.primary}30`,
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

        <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 shadow-2xl overflow-hidden relative"
          style={{
            borderColor: colors.primary,
            boxShadow: `0 0 40px ${colors.primary}30`
          }}>
          {headerData.profile_image ? (
            <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.cardBg}, ${colors.accent}20)` }}>
              <Target className="w-12 h-12" style={{ color: colors.primary }} />
            </div>
          )}
          {/* Success aura */}
          <div className="absolute -inset-2 rounded-full animate-pulse"
            style={{
              background: `conic-gradient(${colors.primary}40, ${colors.secondary}40, ${colors.accent}40, ${colors.primary}40)`,
              animationDuration: '3s'
            }}></div>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
          {headerData.name || data.name || ''}
        </h1>

        <div className="inline-flex items-center px-6 py-2 rounded-full mb-3"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: 'white'
          }}>
          <Star className="w-4 h-4 mr-2" />
          <span className="text-sm font-semibold" style={{ fontFamily: font }}>
            {headerData.title || ''}
          </span>
        </div>

        {headerData.tagline && (
          <p className="text-sm italic max-w-sm mx-auto leading-relaxed" style={{ color: colors.text + 'DD', fontFamily: font }}>
            "{headerData.tagline}"
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

  const renderContactSection = (contactData: any) => {
    const items = [
      (contactData.email || data.email) && { href: `mailto:${contactData.email || data.email}`, icon: <Mail className="w-4 h-4" />, label: 'Email', color: colors.primary },
      (contactData.phone || data.phone) && { href: `tel:${contactData.phone || data.phone}`, icon: <Phone className="w-4 h-4" />, label: 'Call', color: colors.secondary },
      (contactData.website || data.website) && { href: contactData.website || data.website, icon: <Globe className="w-4 h-4" />, label: 'Website', color: colors.secondary, external: true },
      contactData.location && { icon: <MapPin className="w-4 h-4" />, label: contactData.location, color: colors.primary, static: true },
    ].filter(Boolean) as any[];

    if (items.length === 0) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {items.map((item, i) => {
            const pill = (
              <div
                key={i}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                  border: `1.5px solid ${item.color}30`,
                  fontFamily: font
                }}
              >
                {item.icon}
                {item.label}
              </div>
            );
            return item.static ? pill : (
              <a key={i} href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {pill}
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-6 py-4">
        <div className="relative p-6 rounded-3xl" style={{
          backgroundColor: colors.cardBg,
          border: `3px solid ${colors.primary}15`,
          boxShadow: `0 12px 35px ${colors.primary}10`
        }}>
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="text-center mt-2">
            <h3 className="font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
              {t('My Purpose')}
            </h3>

            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
              {aboutData.description || data.description}
            </p>

            {aboutData.specializations && (
              <div className="mb-4">
                <p className="text-xs font-bold mb-2" style={{ color: colors.secondary, fontFamily: font }}>
                  {t('Transformation Areas')}:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {aboutData.specializations.split(',').map((spec: string, index: number) => (
                    <Badge key={index} className="text-xs rounded-full px-3 py-1"
                      style={{
                        background: `linear-gradient(135deg, ${colors.accent}30, ${colors.primary}20)`,
                        color: colors.text,
                        border: `1px solid ${colors.accent}`,
                        fontFamily: font
                      }}>
                      {spec.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {aboutData.experience && (
              <div className="flex justify-center items-center mb-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2 mx-auto"
                    style={{
                      background: `conic-gradient(${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.primary})`,
                      padding: '3px'
                    }}>
                    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                      <span className="text-lg font-bold" style={{ color: colors.primary, fontFamily: font }}>
                        {aboutData.experience}+
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold" style={{ color: colors.text, fontFamily: font }}>{t('Years Transforming Lives')}</p>
                </div>
              </div>
            )}

            {aboutData.mission && (
              <div className="mt-4 p-4 rounded-2xl" style={{ backgroundColor: colors.accent + '15' }}>
                <p className="text-xs italic font-medium" style={{ color: colors.text, fontFamily: font }}>
                  "{aboutData.mission}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProgramsSection = (programsData: any) => {
    const programs = programsData.program_list || [];
    if (!Array.isArray(programs) || programs.length === 0) return null;
    return (
      <div
        className="px-6 py-4"
        style={{
          background: `linear-gradient(180deg, #ffffff 0%, ${colors.accent}08 52%, ${colors.primary}05 100%)`,
          boxShadow: `0 12px 32px ${colors.primary}08`
        }}
      >
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
          style={{ color: colors.primary, fontFamily: font }}>
          <TrendingUp className="w-5 h-5 mr-2" />
          {t('Transformation Programs')}
        </h3>
        <div className="space-y-0">
          {programs.map((program: any, index: number) => (
            <div
              key={index}
              className="py-4"
              style={{
                borderBottom: index !== programs.length - 1 ? `1px solid ${colors.text}16` : 'none'
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1" style={{ color: colors.text, fontFamily: font }}>
                    {program.title}
                  </h4>
                  {program.description && (
                    <p className="text-sm leading-6" style={{ color: colors.text + 'B8', fontFamily: font }}>
                      {program.description}
                    </p>
                  )}
                  {program.price && (
                    <p className="mt-2 text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                      {program.price}
                    </p>
                  )}
                </div>
                {program.format && (
                  <div className="shrink-0 pt-0.5">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize"
                      style={{
                        backgroundColor: colors.secondary + '12',
                        color: colors.secondary,
                        fontFamily: font
                      }}
                    >
                      {program.format?.replace('-', ' ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {program.duration && (
                  <p className="text-sm" style={{ color: colors.text + 'C7', fontFamily: font }}>
                    <span className="font-semibold" style={{ color: colors.text }}>{t("Duration")}:</span> {program.duration}
                  </p>
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

    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;

    return (
      <div className="px-6 py-6 relative overflow-hidden">
        {/* Soft decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: colors.primary }}></div>

        <h3 className="text-center font-bold text-lg mb-6 flex items-center justify-center relative z-10"
          style={{ color: colors.primary, fontFamily: font }}>
          <Video className="w-5 h-5 mr-2" />
          {t('Inspiration Videos')}
        </h3>

        <div className="space-y-6 relative z-10">
          {videoContent.map((video: any) => (
            <div key={video.key} className="group rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.primary}15`,
                boxShadow: `0 10px 30px -10px ${colors.primary}20`
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
                        src={`${videoUrl}?autoplay=1&modestbranding=1&rel=0`}
                        className="absolute inset-0 w-full h-full"
                        style={{ border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title || 'Video'}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-48 cursor-pointer overflow-hidden"
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={video.title || 'Video'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                          <Video className="w-10 h-10 opacity-20" style={{ color: colors.primary }} />
                        </div>
                      )}

                      {/* Subtler overlay */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300"></div>

                      {/* Duration Tag - cleaner style */}
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 z-10">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                            {video.duration}
                          </span>
                        </div>
                      )}

                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute -inset-3 rounded-full animate-ping opacity-20" style={{ backgroundColor: colors.accent }}></div>
                            <div className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                              }}>
                              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="p-5">
                {video.video_type && (
                  <div className="mb-2">
                    <span className="inline-block font-medium px-2 py-0.5 rounded text-xs capitalize text-white"
                      style={{ backgroundColor: colors.primary }}>
                      {video.video_type.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}

                <h5 className="font-bold mb-2" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h5>

                {video.description && (
                  <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
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
      <div className="px-6 py-6 relative overflow-hidden">
        {/* Soft decorative background element */}
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: '#FF0000' }}></div>

        <h3 className="text-center font-bold text-lg mb-6 flex items-center justify-center relative z-10"
          style={{ color: colors.primary, fontFamily: font }}>
          <Youtube className="w-5 h-5 mr-2" />
          {t('YouTube Channel')}
        </h3>

        <div className="relative z-10">
          <div className="rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: `${colors.primary}15`,
              boxShadow: `0 15px 40px -12px ${colors.primary}15`
            }}>

            {/* Top Video Part */}
            {youtubeData.latest_video_embed && (
              <div className="relative">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-xs flex items-center" style={{ color: colors.text, fontFamily: font }}>
                    <Play className="w-3.5 h-3.5 mr-2" style={{ color: '#FF0000' }} />
                    {t("Latest Inspiration")}
                  </h4>
                </div>
                <div className="w-full relative overflow-hidden" style={{ paddingBottom: '45%', height: 0 }}>
                  <div
                    className="absolute inset-0 w-full h-full"
                    ref={createYouTubeEmbedRef(
                      youtubeData.latest_video_embed,
                      { colors, font },
                      'Latest Inspiration Video'
                    )}
                  />
                </div>
              </div>
            )}

            {/* Bottom Channel Info Part */}
            <div className="p-5">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-md shadow-red-200"
                  style={{ background: 'linear-gradient(135deg, #FF0000, #CC0000)' }}>
                  <Youtube className="w-6 h-6  text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold mb-0.5" style={{ color: colors.text, fontFamily: font }}>
                    {youtubeData.channel_name || 'Life Coach Channel'}
                  </h5>
                  {youtubeData.subscriber_count && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{
                        backgroundColor: colors.primary + '10',
                        color: colors.primary,
                        borderColor: colors.primary + '20'
                      }}>
                      📊 {youtubeData.subscriber_count} {t("subscribers")}
                    </div>
                  )}
                </div>
              </div>

              {youtubeData.channel_description && (
                <p className="text-sm mb-5" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_description}
                </p>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {youtubeData.channel_url && (
                  <Button
                    className="w-full h-9 font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-95 text-sm"
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      fontFamily: font,
                      boxShadow: `0 6px 12px ${colors.primary}25`
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    {t("SUBSCRIBE")}
                  </Button>
                )}
                {youtubeData.featured_playlist && (
                  <Button
                    variant="outline"
                    className="w-full h-9 font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-95 text-xs"
                    style={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      fontFamily: font,
                      backgroundColor: 'transparent'
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                  >
                    {t("VIEW PLAYLIST")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTransformationsSection = (transformationsData: any) => {
    const stories = transformationsData.success_stories || [];
    if (!Array.isArray(stories) || stories.length === 0) return null;

    const story = stories[currentTransformation % stories.length];

    return (
      <div className="px-6 py-6 overflow-hidden">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
          style={{ color: colors.primary, fontFamily: font }}>
          <Zap className="w-5 h-5 mr-2" />
          {t('Success Stories')}
        </h3>
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-2xl border transition-all duration-500 animate-in fade-in slide-in-from-right-4"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: `${colors.primary}15`,
              boxShadow: `0 8px 24px ${colors.primary}05`
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                    {story.client_initial || 'C'}
                  </div>
                  <span className="text-sm font-bold" style={{ color: colors.text }}>{t("Client Story")}</span>
                </div>
                {story.timeframe && (
                  <span className="text-xs font-bold uppercase tracking-tight px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: colors.primary }}>
                    {story.timeframe}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 relative">
                {/* Vertical Progress Line - darker and thicker */}
                <div className="absolute left-[8px] top-3 bottom-3 w-[2px] bg-slate-200"></div>

                {/* Challenge */}
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center border-slate-400">
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  </div>
                  <h5 className="text-sm font-extrabold mb-1" style={{ color: colors.text }}>{t("Challenge")}</h5>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                    {story.challenge}
                  </p>
                </div>

                {/* Transformation */}
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center" style={{ borderColor: `${colors.primary}60` }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                  </div>
                  <h5 className="text-sm font-extrabold mb-1" style={{ color: colors.primary }}>{t("Transformation")}</h5>
                  <p className="text-sm " style={{ color: colors.text, fontFamily: font }}>
                    {story.transformation}
                  </p>
                </div>

                {/* Outcome */}
                {story.outcome && (
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center border-accent shadow-sm" style={{ backgroundColor: colors.accent + '20' }}>
                      <Zap className="w-2.5 h-2.5 fill-accent text-accent" style={{ filter: 'brightness(0.7)' }} />
                    </div>
                    <h5 className="text-sm font-extrabold mb-1" style={{ color: colors.accent, filter: 'brightness(0.7)' }}>{t("Current Success")}</h5>
                    <p className="text-sm " style={{ color: colors.text, fontFamily: font }}>
                      {story.outcome}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {stories.length > 1 && (
            <div className="flex justify-center mt-5 space-x-2">
              {stories.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentTransformation(dotIndex)}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: dotIndex === currentTransformation % stories.length ? colors.primary : colors.primary + '30',
                    width: dotIndex === currentTransformation % stories.length ? '1.5rem' : '0.625rem'
                  }}
                  aria-label={`Go to story ${dotIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSpeakingSection = (speakingData: any) => {
    const topics = speakingData.topics || [];
    if (!Array.isArray(topics) || topics.length === 0) return null;

    return (
      <div className="px-6 py-10 relative overflow-hidden">
        {/* Soft decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: colors.secondary }}></div>

        <h3 className="text-center font-bold text-lg mb-8 flex items-center justify-center relative z-10"
          style={{ color: colors.primary, fontFamily: font }}>
          <Mic2 className="w-5 h-5 mr-2" />
          {t('Speaking Topics')}
        </h3>

        <div className="relative z-10 divide-y" style={{ borderColor: `${colors.primary}15` }}>
          {topics.map((topic: any, index: number) => (
            <div key={index} className="py-6 first:pt-0 last:pb-0 group border-b last:border-0"
              style={{ borderColor: `${colors.text}10` }}>
              <div className="transition-transform duration-300 group-hover:translate-x-1">
                <div className="flex items-center mb-2">
                  <h5 className="font-bold" style={{ color: colors.text, fontFamily: font }}>
                    {topic.topic}
                  </h5>
                  <div className="ml-3 group-hover:opacity-100 transition-opacity duration-300">
                    <Zap className="w-4 h-4" style={{ color: colors.accent }} />
                  </div>
                </div>

                <p className="text-sm mb-4" style={{ color: colors.text, fontFamily: font }}>
                  {topic.description}
                </p>

                <div className="space-y-1.5 container-metadata">
                  {topic.audience && (
                    <div className="flex items-center gap-2 text-xs font-semibold"
                      style={{ color: colors.secondary }}>
                      <Users className="w-3.5 h-3.5" />
                      <span>{t("Audience")}: {topic.audience}</span>
                    </div>
                  )}
                  {topic.duration && (
                    <div className="flex items-center gap-2 text-xs font-semibold"
                      style={{ color: colors.primary }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t("Duration")}: {topic.duration}</span>
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
      <div className="px-6 py-10 relative">
        <h3 className="text-center font-bold text-lg mb-8 flex items-center justify-center relative z-10"
          style={{ color: colors.primary, fontFamily: font }}>
          <Share2 className="w-5 h-5 mr-3" />
          {t('Follow the Journey')}
        </h3>

        <div className="grid grid-cols-3 gap-2.5 relative z-10">
          {socialLinks.map((link: any, index: number) => {
            const pillColor = index % 2 === 0 ? colors.primary : colors.secondary;
            return (
              <button
                key={index}
                className="group flex flex-col items-center gap-1.5 px-2 py-2 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${pillColor}20`,
                }}
                onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${pillColor}10` }}
                >
                  <SocialIcon platform={link.platform || ''} color={pillColor} />
                </div>
                <span className="text-[10px] font-bold capitalize text-center" style={{ color: colors.text, fontFamily: font }}>
                  {link.platform}
                </span>
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
      <div className="py-10 relative overflow-hidden" style={{ backgroundColor: colors.cardBg }}>
        <h3 className="text-center font-bold text-lg mb-8 flex items-center justify-center relative z-10"
          style={{ color: colors.primary, fontFamily: font }}>
          <Calendar className="w-5 h-5 mr-3" />
          {t('Availability')}
        </h3>

        <div className="px-6 relative z-10 divide-y" style={{ borderColor: `${colors.primary}10` }}>
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
              <span className="capitalize font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                {t(hour.day)}
              </span>

              {hour.is_closed ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${colors.secondary}10`, color: colors.secondary, fontFamily: font }}>
                  {t('Rest Day')}
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                    {hour.open_time}
                  </span>
                  <span className="text-[10px] opacity-30">—</span>
                  <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                    {hour.close_time}
                  </span>
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
      <div className="px-6 py-6 relative overflow-hidden" style={{ backgroundColor: colors.cardBg }}>
        {/* Soft decorative background element */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ backgroundColor: colors.primary }}></div>

        <h3 className="text-center font-bold text-lg mb-6 flex items-center justify-center relative z-10"
          style={{ color: colors.primary, fontFamily: font }}>
          <Quote className="w-5 h-5 mr-3" />
          {t('Client Love')}
        </h3>

        <div className="relative z-10">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-2 pb-2">
                  <div className="p-5 rounded-[28px] text-center relative"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.primary}10`,
                      boxShadow: `0 8px 24px -6px ${colors.primary}08`
                    }}>

                    <div className="absolute top-4 left-4 opacity-[0.03]">
                      <Quote className="w-8 h-8" style={{ color: colors.primary }} />
                    </div>

                    <div className="flex items-center justify-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < parseInt(review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    <p className="text-sm mb-5 italic" style={{ color: colors.text, fontFamily: font }}>
                      {review.review}
                    </p>

                    <div className="flex flex-col items-center">
                      <p className="font-bold text-sm mb-1" style={{ color: colors.primary, fontFamily: font }}>
                        {review.client_name}
                      </p>
                      {review.program && (
                        <div className="px-2.5 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: `${colors.accent}15`, color: colors.accent, fontFamily: font }}>
                          {review.program}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2.5">
              {reviews.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: dotIndex === currentReview % reviews.length ? colors.primary : colors.primary + '20',
                    width: dotIndex === currentReview % reviews.length ? '16px' : '6px'
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
      <div className="px-6 py-4">
        <div className="text-center p-6 rounded-3xl" style={{
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`,
          border: `3px solid ${colors.primary}20`
        }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {t('🚀 Start Your Transformation')}
          </h3>
          {appointmentsData?.consultation_info && (
            <p className="text-xs mb-4" style={{ color: colors.text, fontFamily: font }}>
              {appointmentsData.consultation_info}
            </p>
          )}
          <Button size="sm" className="rounded-full px-6"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
              border: 'none'
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4 mr-2" />
            {t('Book Free Session')}
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
          {t('Location')}
        </h3>
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <LifeCoachMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button size="sm" variant="outline" className="w-full rounded-2xl"
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
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-2">
          {appData.app_store_url && (
            <Button size="sm" variant="outline" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button size="sm" variant="outline" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
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
        <div className="text-center p-5 rounded-3xl" style={{
          backgroundColor: colors.cardBg,
          border: `3px solid ${colors.secondary}20`
        }}>
          <h3 className="font-bold text-sm mb-2" style={{ color: colors.secondary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button size="sm" className="rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
              color: 'white',
              fontFamily: font,
              border: 'none'
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Mail className="w-4 h-4 mr-2" />
            {t('Let\'s Connect')}
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
            <Lightbulb className="w-5 h-5 mr-2" />
            {customHtmlData.section_title}
          </h3>
        )}
        <div
          className="custom-html-content p-5 rounded-3xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `3px solid ${colors.primary}15`,
            boxShadow: `0 12px 35px ${colors.primary}10`,
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
                background: linear-gradient(135deg, ${colors.accent}30, ${colors.primary}20);
                color: ${colors.primary};
                padding: 0.125rem 0.25rem;
                border-radius: 0.5rem;
                font-family: 'Monaco', monospace;
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
      <div className="px-6 py-4">
        <h3 className="text-center font-bold text-lg mb-4 flex items-center justify-center"
          style={{ color: colors.primary, fontFamily: font }}>
          <Share2 className="w-5 h-5 mr-2" />
          {t("Share the Journey")}
        </h3>
        <div className="text-center p-5 rounded-3xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `3px solid ${colors.primary}15`,
            boxShadow: `0 12px 35px ${colors.primary}10`
          }}>
          {qrData.qr_title && (
            <h4 className="font-bold text-base mb-2" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}

          {qrData.qr_description && (
            <p className="text-sm mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            className="w-full py-4 font-bold rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
              border: 'none'
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-5 h-5 mr-2" />
            {t("Share QR Code")}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-10 text-center relative overflow-hidden" 
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary}03, ${colors.secondary}02)`,
        }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-20" 
          style={{ backgroundColor: colors.accent }}></div>
        
        <div className="relative z-10">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
          </div>
          
          <p className="text-sm font-medium leading-relaxed max-w-md mx-auto" 
            style={{ color: colors.text, fontFamily: font }}>
            {thankYouData.message}
          </p>
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
      <div className="p-4 space-y-3" style={{
        background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}05)`
      }}>
        {hasContactButton && (
          <Button className="w-full h-11 font-bold rounded-2xl transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
              color: 'white',
              fontFamily: font,
              border: 'none',
              boxShadow: `0 8px 20px ${colors.primary}20`
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Target className="w-5 h-5 mr-3" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button className="w-full h-10 font-bold rounded-2xl transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
              color: 'white',
              fontFamily: font,
              border: 'none'
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4 mr-3" />
            {actionData.appointment_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button size="sm" variant="outline" className="w-full h-10 rounded-2xl transition-all hover:scale-[1.01] active:scale-95"
            style={{ borderColor: colors.accent, color: colors.accent, fontFamily: font }}
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
            }}>
            <UserPlus className="w-4 h-4 mr-3" />
            {actionData.save_contact_button_text}
          </Button>
        )}
      </div>
    );
  };

  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  return (
    <div className="w-full rounded-3xl overflow-hidden" style={{
      fontFamily: font,
      backgroundColor: colors.background,
      boxShadow: `0 25px 70px ${colors.primary}15`,
      border: `3px solid ${colors.primary}10`,
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
        <div className="px-6 py-4 mt-2 border-t" style={{ borderColor: `${colors.primary}10`, backgroundColor: `${colors.primary}03` }}>
          {copyrightSection.text && (
            <p className="text-xs text-center font-medium" style={{ color: colors.text + 'BB', fontFamily: font }}>
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
