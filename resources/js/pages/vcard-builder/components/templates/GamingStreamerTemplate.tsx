import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Gamepad2, Zap, Trophy, Users, Tv, Video, Play, Youtube, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface GamingStreamerTemplateProps {
  data: any;
  template: any;
}

const GamingStreamerMapEmbed = React.memo(function GamingStreamerMapEmbed({ embedHtml }: { embedHtml: string }) {
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

function GamingStreamerTemplate({ data, template }: GamingStreamerTemplateProps) {
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
    primary: '#00FF41',
    secondary: '#FF0080',
    accent: '#00D9FF',
    background: '#0A0A0A',
    text: '#FFFFFF',
    cardBg: '#131313',
    borderColor: '#00FF4150'
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
  const allSections = getBusinessTemplate('gaming-streamer')?.sections || [];

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
      case 'streaming':
        return renderStreamingSection(sectionData);
      case 'schedule':
        return renderScheduleSection(sectionData);
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
    <div className="relative z-10 rounded-t-2xl overflow-hidden" style={{
      background: colors.background,
      minHeight: '260px'
    }}>
      {/* Inline keyframes */}
      <style>{`
        @keyframes gs-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes gs-flicker {
          0%,100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 95% { opacity: 1; } 97% { opacity: 0.6; } 98% { opacity: 1; }
        }
        @keyframes gs-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gs-blink {
          0%,100% { opacity: 1; } 50% { opacity: 0; }
        }
        .gs-name { animation: gs-flicker 6s infinite; }
        .gs-ring-spin { animation: gs-ring 4s linear infinite; }
        .gs-blink { animation: gs-blink 1s step-end infinite; }
      `}</style>

      {/* Dark gradient backdrop */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(160deg, ${colors.background} 0%, ${colors.primary}18 50%, ${colors.secondary}12 100%)`
      }} />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${colors.primary}08 2px, ${colors.primary}08 4px)`,
        zIndex: 1
      }} />

      {/* Moving scanline beam */}
      <div className="absolute left-0 right-0 pointer-events-none" style={{
        height: '60px',
        background: `linear-gradient(180deg, transparent, ${colors.primary}12, transparent)`,
        animation: 'gs-scanline 4s linear infinite',
        zIndex: 2
      }} />

      {/* HUD corner brackets */}
      {[['top-3 left-3', 'border-t-2 border-l-2'], ['top-3 right-3', 'border-t-2 border-r-2'], ['bottom-3 left-3', 'border-b-2 border-l-2'], ['bottom-3 right-3', 'border-b-2 border-r-2']].map(([pos, border], i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 ${border}`} style={{ borderColor: colors.primary, zIndex: 3 }} />
      ))}

      {/* Top bar — SIGNAL + lang */}
      <div
        className="relative flex items-center justify-between px-5 pt-4"
        style={{ zIndex: showLanguageSelector ? 30 : 4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full gs-blink" style={{ backgroundColor: colors.primary }} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: colors.primary + 'AA', fontFamily: font }}>SIGNAL OK</span>
        </div>

        {(configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-bold tracking-widest uppercase cursor-pointer"
              style={{ border: `1px solid ${colors.primary}60`, color: colors.primary, background: colors.primary + '15', fontFamily: font }}
            >
              <Globe className="w-3 h-3" />
              {languageData.find(l => l.code === currentLanguage)?.name || 'EN'}
            </button>
            {showLanguageSelector && (
              <>
                <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setShowLanguageSelector(false)} />
                <div
                  className="absolute top-full right-0 mt-1 min-w-[180px] max-h-48 overflow-y-auto rounded-md py-1 shadow-xl"
                  style={{
                    background: colors.cardBg || colors.background,
                    border: `1px solid ${colors.borderColor || `${colors.primary}50`}`,
                    zIndex: 99999
                  }}
                >
                  {languageData.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 cursor-pointer"
                      style={{
                        background: currentLanguage === lang.code ? `${colors.primary}18` : 'transparent',
                        color: currentLanguage === lang.code ? colors.primary : colors.text,
                        fontFamily: font
                      }}
                    >
                      <span>{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt()))}</span>
                      <span className="truncate">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative px-5 pt-4 pb-5" style={{ zIndex: 4 }}>
        <div className="flex gap-4 items-start">

          {/* Avatar with spinning ring */}
          <div className="relative flex-shrink-0" style={{ width: 88, height: 88 }}>
            {/* Spinning dashed ring */}
            <div className="absolute inset-0 rounded-full gs-ring-spin" style={{
              background: `conic-gradient(${colors.primary}, ${colors.secondary}, ${colors.accent}, transparent, ${colors.primary})`,
              padding: 2
            }}>
              <div className="w-full h-full rounded-full" style={{ background: colors.background }} />
            </div>
            {/* Avatar */}
            <div className="absolute inset-[4px] rounded-full overflow-hidden" style={{
              border: `1px solid ${colors.primary}60`
            }}>
              {headerData.profile_image ? (
                <img src={getImageDisplayUrl(headerData.profile_image)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: `${colors.primary}18` }}>
                  <Gamepad2 className="w-9 h-9" style={{ color: colors.primary }} />
                </div>
              )}
            </div>
            {/* Corner pip */}
            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center" style={{
              background: colors.background,
              border: `2px solid ${colors.primary}`
            }}>
              <div className="w-1.5 h-1.5 rounded-full gs-blink" style={{ background: colors.primary }} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            {/* LIVE badge */}
            {headerData.status_text && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-2" style={{
                background: colors.primary + '20',
                border: `1px solid ${colors.primary}`,
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)'
              }}>
                <div className="w-1.5 h-1.5 rounded-full gs-blink" style={{ background: colors.primary }} />
                <span className="text-xs font-black tracking-[0.25em]" style={{ color: colors.primary, fontFamily: font }}>
                  {headerData.status_text}
                </span>
                {/* Waveform bars */}
                <div className="flex items-end gap-px ml-1" style={{ height: 10 }}>
                  {[4,7,5,9,6,8,4].map((h, i) => (
                    <div key={i} className="w-px animate-bounce" style={{
                      height: h, background: colors.primary,
                      animationDelay: `${i * 0.08}s`, animationDuration: '0.6s'
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Gamer tag */}
            <h1 className="gs-name text-xl  font-black leading-tight mb-1 truncate" style={{
              color: colors.text,
              fontFamily: font,
              textShadow: `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}40`
            }}>
              {headerData.name || data.name || 'GamerTag'}
            </h1>

            {/* Title chip */}
            {headerData.title && (
              <div className="flex items-center gap-1.5 mb-2">
                <div className="w-3 h-px" style={{ background: colors.secondary }} />
                <span className="text-[14px] font-bold tracking-widest" style={{ color: colors.secondary, fontFamily: font }}>
                  {headerData.title}
                </span>
                <div className="w-3 h-px" style={{ background: colors.secondary }} />
              </div>
            )}

            {/* Tagline */}
            {headerData.tagline && (
              <p className="text-sm leading-relaxed line-clamp-2" style={{ color: colors.text + '99', fontFamily: font }}>
                {headerData.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Bottom HUD bar */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${colors.primary}80, transparent)` }} />
          <Trophy className="w-3 h-3" style={{ color: colors.primary + '80' }} />
          <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, ${colors.secondary}80, transparent)` }} />
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

  const renderContactSection = (contactData: any) => {
    const items = [
      (contactData.email || data.email) && { href: `mailto:${contactData.email || data.email}`, icon: <Mail className="w-5 h-5" />, label: 'EMAIL', value: contactData.email || data.email, color: colors.primary },
      (contactData.phone || data.phone) && { href: `tel:${contactData.phone || data.phone}`, icon: <Phone className="w-5 h-5" />, label: 'CALL', value: contactData.phone || data.phone, color: colors.secondary },
      (contactData.website || data.website) && { href: contactData.website || data.website, icon: <Globe className="w-5 h-5" />, label: 'WEB', value: (contactData.website || data.website).replace(/^https?:\/\//, ''), color: colors.accent, target: '_blank' },
      contactData.location && { href: null, icon: <MapPin className="w-5 h-5" />, label: 'LOCATION', value: contactData.location, color: colors.primary },
    ].filter(Boolean) as any[];

    if (items.length === 0) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="space-y-3">
          {items.map((item, i) => {
            const inner = (
              <div key={i} className="flex items-center gap-4 px-4 py-3"
                style={{
                  background: colors.cardBg,
                  borderLeft: `3px solid ${item.color}`,
                  borderRight: `1px solid ${item.color}20`,
                  borderTop: `1px solid ${item.color}15`,
                  borderBottom: `1px solid ${item.color}15`,
                }}>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                  style={{ color: item.color }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black tracking-widest leading-none mb-1" style={{ color: item.color + 'AA', fontFamily: font }}>{item.label}</p>
                  <p className="text-sm font-bold truncate" style={{ color: colors.text, fontFamily: font }}>{item.value}</p>
                </div>
                {<div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: item.color + '60' }} />}
              </div>
            );
            return item.href
              ? <a key={i} href={item.href} target={item.target} rel="noopener noreferrer">{inner}</a>
              : <div key={i}>{inner}</div>;
          })}
        </div>
      </div>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Section title */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
          <Zap className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.primary, fontFamily: font }}>{t('PLAYER.BIO')}</span>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>

        {/* Games tags */}
        {aboutData.games && (
          <div className="mb-4">
            <p className="text-sm font-bold mb-2" style={{ color: colors.secondary, fontFamily: font }}>{t('MAIN_GAMES')}</p>
            <div className="flex flex-wrap gap-2">
              {aboutData.games.split(',').map((game: string, index: number) => (
                <span key={index} className="text-sm font-bold px-3 py-1"
                  style={{
                    backgroundColor: colors.accent + '20',
                    color: colors.accent,
                    border: `1px solid ${colors.accent}50`,
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)'
                  }}>
                  {game.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience + Achievements */}
        <div className="flex flex-col gap-3">
          {aboutData.experience && (
            <div className="relative flex items-center gap-4 px-4 py-3 overflow-hidden"
              style={{
                background: colors.cardBg,
                border: `1px solid ${colors.primary}40`,
              }}>
              {/* Left neon bar */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14"
                style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20)`, border: `2px solid ${colors.primary}60` }}>
                <span className="text-sm font-black leading-none" style={{ color: colors.primary, fontFamily: font }}>{aboutData.experience}</span>
                <span className="text-sm font-bold leading-none" style={{ color: colors.primary + 'AA', fontFamily: font }}>YRS</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest" style={{ color: colors.text, fontFamily: font }}>Gaming</p>
                <p className="text-sm font-black uppercase tracking-widest" style={{ color: colors.primary, fontFamily: font }}>Experience</p>
              </div>
            </div>
          )}
          {aboutData.achievements && (
            <div className="px-3 py-3"
              style={{
                background: colors.cardBg,
                borderLeft: `3px solid ${colors.accent}`,
                border: `1px solid ${colors.accent}20`,
                borderLeftWidth: 3
              }}>
              <p className="text-sm font-bold mb-1" style={{ color: colors.accent, fontFamily: font }}>{t('ACHIEVEMENTS')}</p>
              <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>{aboutData.achievements}</p>
            </div>
          )}
        </div>

      </div>
    );
  };

  const renderStreamingSection = (streamingData: any) => {
    const streams = streamingData.stream_details || [];
    if (!Array.isArray(streams) || streams.length === 0) return null;
    const rowColors = [colors.primary, colors.secondary, colors.accent];
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.secondary }} />
          <Tv className="w-4 h-4" style={{ color: colors.secondary }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.secondary, fontFamily: font }}>{t('STREAMING_PLATFORMS')}</span>
        </div>
        <div className="space-y-2">
          {streams.map((stream: any, index: number) => {
            const pColor = rowColors[index % rowColors.length];
            return (
              <div key={index} className="flex items-center gap-3 px-3 py-3"
                style={{ background: colors.cardBg }}>
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center font-black text-sm"
                  style={{ background: pColor + '20', color: pColor, fontFamily: font, border: `1px solid ${pColor}50` }}>
                  {stream.platform?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black uppercase" style={{ color: colors.text, fontFamily: font }}>{stream.platform}</p>
                  <p className="text-sm font-bold" style={{ color: pColor, fontFamily: font }}>@{stream.username}</p>
                  {stream.followers && (
                    <p className="text-sm font-bold" style={{ color: colors.text + '80', fontFamily: font }}>{stream.followers} {t('FOLLOWERS')}</p>
                  )}
                </div>
                {stream.stream_url && (
                  <button className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-sm font-black cursor-pointer"
                    style={{ background: pColor + '30', color: pColor, fontFamily: font, border: `1px solid ${pColor}60` }}
                    onClick={() => typeof window !== 'undefined' && window.open(stream.stream_url, '_blank', 'noopener,noreferrer')}>
                    <Play className="w-3 h-3" />
                    {t('WATCH_LIVE')}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScheduleSection = (scheduleData: any) => {
    const schedule = scheduleData.stream_schedule || [];
    if (!Array.isArray(schedule) || schedule.length === 0) return null;
    const dayColors = [colors.primary, colors.secondary, colors.accent];
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.accent }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.accent, fontFamily: font }}>📅 {t('STREAM_SCHEDULE')}</span>
        </div>
        <div className="space-y-2">
          {schedule.map((item: any, index: number) => {
            const dColor = dayColors[index % dayColors.length];
            return (
              <div key={index} className="flex items-center gap-3 px-3 py-3"
                style={{ background: colors.cardBg, border: `1px solid ${dColor}25` }}>
                {/* Day box */}
                <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center py-1"
                  style={{ background: dColor + '20', border: `1px solid ${dColor}50` }}>
                  <span className="text-sm font-black uppercase" style={{ color: dColor, fontFamily: font }}>{item.day?.slice(0,3)}</span>
                </div>
                {/* Game */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black" style={{ color: colors.text, fontFamily: font }}>{item.game}</p>
                  <p className="text-sm font-bold" style={{ color: dColor, fontFamily: font }}>{item.start_time} · {item.duration}</p>
                </div>
                {/* Live dot */}
                <div className="flex-shrink-0 w-2 h-2 rounded-full animate-pulse" style={{ background: dColor }} />
              </div>
            );
          })}
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
      const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\\n?#]+)/);
      const videoId = embedMatch?.[1] || watchMatch?.[1] || null;
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    if (!videoContent || videoContent.length === 0) return null;

    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
          <Video className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.primary, fontFamily: font }}>{t('GAMING_CONTENT')}</span>
        </div>
        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div key={video.key} style={{ background: colors.cardBg, border: `1px solid ${colors.primary}25` }}>
              {(() => {
                const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
                const thumbUrl = video.thumbnail
                  ? getImageDisplayUrl(video.thumbnail)
                  : getYouTubeThumbnail(video.embed_url || '');
                return playingKey === video.key && videoUrl ? (
                  <div className="w-full relative overflow-hidden" style={{ height: 200 }}>
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
                  <div className="relative w-full cursor-pointer" style={{ height: 200 }}
                    onClick={() => { if (videoUrl) setPlayingKey(video.key); }}>
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: colors.primary + '15' }}>
                        <Video className="w-10 h-10" style={{ color: colors.primary }} />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
                      {videoUrl && (
                        <div className="w-10 h-10 flex items-center justify-center" style={{ background: colors.primary }}>
                          <Play className="w-5 h-5" style={{ color: colors.background }} />
                        </div>
                      )}
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5" style={{ background: 'rgba(0,0,0,0.75)' }}>
                        <span className="text-sm font-bold" style={{ color: '#fff', fontFamily: font }}>{video.duration}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="px-3 py-3">
                <p className="text-sm font-black mb-1" style={{ color: colors.text, fontFamily: font }}>{video.title}</p>
                {video.description && (
                  <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + '99', fontFamily: font }}>{video.description}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {video.video_type && (
                    <span className="text-sm font-bold px-2 py-0.5 capitalize" style={{ background: colors.primary + '20', color: colors.primary, border: `1px solid ${colors.primary}40`, fontFamily: font }}>
                      {video.video_type.replace(/_/g, ' ')}
                    </span>
                  )}
                  {video.game_title && (
                    <span className="text-sm font-bold px-2 py-0.5" style={{ background: colors.accent + '20', color: colors.accent, border: `1px solid ${colors.accent}40`, fontFamily: font }}>
                      🎮 {video.game_title}
                    </span>
                  )}
                  {video.view_count && (
                    <span className="text-sm font-bold px-2 py-0.5" style={{ background: colors.secondary + '20', color: colors.secondary, border: `1px solid ${colors.secondary}40`, fontFamily: font }}>👁 {video.view_count}</span>
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
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.secondary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.secondary }} />
          <Youtube className="w-4 h-4" style={{ color: colors.secondary }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.secondary, fontFamily: font }}>{t('YOUTUBE_CHANNEL')}</span>
        </div>

        {/* Channel info row */}
        <div className="flex items-center gap-3 px-3 py-3 mb-3" style={{ background: colors.cardBg }}>
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center" style={{ background: colors.primary + "25", border: `1px solid ${colors.primary}50` }}>
            <Youtube className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black" style={{ color: colors.text, fontFamily: font }}>{youtubeData.channel_name || 'Gaming Channel'}</p>
            {youtubeData.subscriber_count && (
              <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>📊 {youtubeData.subscriber_count} {t('subscribers')}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {youtubeData.channel_description && (
          <p className="text-sm leading-relaxed mb-3 px-1" style={{ color: colors.text + '99', fontFamily: font }}>{youtubeData.channel_description}</p>
        )}

        {/* Latest video embed */}
        {youtubeData.latest_video_embed && (
          <div className="mb-3" style={{ border: `1px solid ${colors.primary}25` }}>
            <div className="flex items-center gap-2 px-3 py-2" style={{ background: colors.cardBg, borderBottom: `1px solid ${colors.primary}20` }}>
              <Play className="w-4 h-4" style={{ color: colors.secondary }} />
              <span className="text-sm font-black uppercase" style={{ color: colors.text, fontFamily: font }}>{t('LATEST_GAMING_VIDEO')}</span>
            </div>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '35%', height: 0 }}>
              <div className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Gaming Video')}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2">
          {youtubeData.channel_url && (
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black uppercase tracking-widest cursor-pointer"
              style={{ background: colors.primary, color: colors.background, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}>
              <Youtube className="w-4 h-4" />
              {t('SUBSCRIBE')}
            </button>
          )}
          {youtubeData.featured_playlist && (
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black uppercase tracking-widest cursor-pointer"
              style={{ background: colors.primary + '20', color: colors.primary, border: `1px solid ${colors.primary}50`, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}>
              🎮 {t('GAMING_PLAYLIST')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    const rowColors = [colors.primary, colors.secondary, colors.accent];
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.accent }} />
          <Share2 className="w-4 h-4" style={{ color: colors.accent }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.accent, fontFamily: font }}>{t('CONNECT_&_FOLLOW')}</span>
        </div>
        <div className="space-y-2">
          {socialLinks.map((link: any, index: number) => {
            const c = rowColors[index % rowColors.length];
            return (
              <button key={index}
                className="w-full flex items-center gap-3 px-3 py-2.5"
                style={{ background: colors.cardBg, border: `1px solid ${c}30` }}
                onClick={() => link.url && typeof window !== 'undefined' && window.open(link.url, '_blank', 'noopener,noreferrer')}>
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center"
                  style={{ background: c + '20', border: `1px solid ${c}50` }}>
                  <SocialIcon platform={link.platform} color={c} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-black uppercase" style={{ color: colors.text, fontFamily: font }}>{link.platform}</p>
                  {link.username && <p className="text-sm font-bold" style={{ color: c, fontFamily: font }}>@{link.username}</p>}
                </div>
                <div className="flex-shrink-0 w-1.5 h-6" style={{ background: c + '60' }} />
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
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
          <span className="text-sm font-black tracking-widest uppercase" style={{ color: colors.primary, fontFamily: font }}>🎮 {t('ONLINE_STATUS')}</span>
        </div>
        <div className="space-y-2">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="flex items-center justify-between px-3 py-2.5"
              style={{ background: colors.cardBg, border: `1px solid ${colors.primary}20` }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: hour.is_closed ? colors.text + '30' : colors.primary, boxShadow: hour.is_closed ? 'none' : `0 0 5px ${colors.primary}` }} />
                <span className="text-sm font-black uppercase" style={{ color: colors.text, fontFamily: font }}>{hour.day?.slice(0,3).toUpperCase()}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: hour.is_closed ? colors.text + '40' : colors.primary, fontFamily: font }}>
                {hour.is_closed ? 'OFFLINE' : `${hour.open_time} – ${hour.close_time}`}
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
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.secondary }} />
          <Users className="w-4 h-4" style={{ color: colors.secondary }} />
          <span className="text-sm font-black tracking-widest" style={{ color: colors.secondary, fontFamily: font }}>{t('COMMUNITY_REVIEWS')}</span>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}>
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="px-3 py-4" style={{ background: colors.cardBg, border: `1px solid ${colors.secondary}30`, borderTop: `2px solid ${colors.secondary}` }}>
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3"
                        style={{ background: i < parseInt(review.rating || 5) ? '#FBBF24' : colors.text + '20',
                          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
                    ))}
                    {review.platform && (
                      <span className="ml-auto text-sm font-bold px-2 py-0.5" style={{ background: colors.accent + '20', color: colors.accent, fontFamily: font }}>{review.platform}</span>
                    )}
                  </div>
                  {/* Review text */}
                  <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>{review.review}</p>
                  {/* Name */}
                  <p className="text-sm font-black" style={{ color: colors.secondary, fontFamily: font }}>— {review.client_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {reviews.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 cursor-pointer">
            {reviews.map((_: any, i: number) => (
              <div key={i} className="h-1 transition-all"
                style={{ width: i === currentReview % reviews.length ? 20 : 8, background: i === currentReview % reviews.length ? colors.secondary : colors.secondary + '40' }} 
                onClick={() => setCurrentReview(i)}/>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
          <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm font-black tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{t('COLLABORATION_REQUEST')}</span>
        </div>
        <div className="px-3 py-4" style={{ background: colors.cardBg, border: `1px solid ${colors.primary}25` }}>
          {appointmentsData?.collab_info && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {appointmentsData.collab_info}
            </p>
          )}
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
            style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, color: colors.background, fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4" />
            {t('BOOK_COLLAB')}
          </button>
          {appointmentsData?.calendar_link && (
            <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-black mt-2 cursor-pointer"
              style={{ background: colors.cardBg, color: colors.primary, border: `1px solid ${colors.primary}50`, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appointmentsData.calendar_link, '_blank', 'noopener,noreferrer')}>
              <Calendar className="w-4 h-4" />
              {t('VIEW_CALENDAR')}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
          <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm font-black tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{t('Gaming HQ Location')}</span>
        </div>
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <div style={{ border: `1px solid ${colors.primary}25`, overflow: 'hidden' }}>
              <GamingStreamerMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          {locationData.directions_url && (
            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
              style={{ background: colors.cardBg, color: colors.primary, border: `1px solid ${colors.primary}50`, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}>
              <MapPin className="w-4 h-4" />
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
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.accent }} />
          <span className="text-sm font-black tracking-widest" style={{ color: colors.accent, fontFamily: font }}>{t('APP_DOWNLOAD')}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <button className="flex items-center justify-center gap-2 px-3 py-3 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.primary}10)`, border: `1px solid ${colors.primary}40` }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              <p className="text-sm font-black" style={{ color: colors.primary, fontFamily: font }}>App Store</p>
            </button>
          )}
          {appData.play_store_url && (
            <button className="flex items-center justify-center gap-2 px-3 py-3 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${colors.secondary}30, ${colors.secondary}10)`, border: `1px solid ${colors.secondary}40` }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
              <p className="text-sm font-black" style={{ color: colors.secondary, fontFamily: font }}>Play Store</p>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.secondary }} />
          <Mail className="w-4 h-4" style={{ color: colors.secondary }} />
          <span className="text-sm font-black tracking-widest" style={{ color: colors.secondary, fontFamily: font }}>{formData.form_title}</span>
        </div>
        <div className="px-3 py-4" style={{ background: colors.cardBg, border: `1px solid ${colors.secondary}25` }}>
          {formData.form_description && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
            style={{ background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent})`, color: colors.background, fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Mail className="w-4 h-4" />
            {t('SEND_MESSAGE')}
          </button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
            <Gamepad2 className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm font-black tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{customHtmlData.section_title}</span>
          </div>
        )}
        <div className="custom-html-content px-3 py-4"
          style={{ background: colors.cardBg, border: `1px solid ${colors.primary}25`, fontFamily: font, color: colors.text }}>
          <style>{`
            .custom-html-content h1,.custom-html-content h2,.custom-html-content h3,.custom-html-content h4 { color: ${colors.primary}; margin-bottom: 0.5rem; font-family: ${font}; font-weight: bold; }
            .custom-html-content p { color: ${colors.text}; margin-bottom: 0.5rem; font-family: ${font}; font-size: 0.875rem; }
            .custom-html-content a { color: ${colors.secondary}; text-decoration: underline; font-weight: bold; }
            .custom-html-content ul,.custom-html-content ol { color: ${colors.text}; padding-left: 1rem; font-family: ${font}; font-size: 0.875rem; }
            .custom-html-content code { background: ${colors.primary}20; color: ${colors.accent}; padding: 0.125rem 0.25rem; font-family: monospace; }
          `}</style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full" style={{ background: colors.primary }} />
          <QrCode className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm font-black tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{t('SHARE_PROFILE')}</span>
        </div>
        <div className="px-3 py-4" style={{ background: colors.cardBg, border: `1px solid ${colors.primary}25` }}>
          {qrData.qr_title && <p className="text-sm font-black mb-1" style={{ color: colors.text, fontFamily: font }}>{qrData.qr_title}</p>}
          {qrData.qr_description && <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + '99', fontFamily: font }}>{qrData.qr_description}</p>}
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
            style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, color: colors.background, fontFamily: font }}
            onClick={() => setShowQrModal(true)}>
            <QrCode className="w-4 h-4" />
            {t('SHARE_QR_CODE')}
          </button>
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
      <div className="px-4 py-4 space-y-2" style={{ background: colors.cardBg }}>
        {hasContactButton && (
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
            style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`, color: colors.background, fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Gamepad2 className="w-4 h-4" />
            {actionData.contact_button_text}
          </button>
        )}
        {hasAppointmentButton && (
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
            style={{ background: `linear-gradient(90deg, ${colors.secondary}, ${colors.accent})`, color: colors.background, fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4" />
            {actionData.appointment_button_text}
          </button>
        )}
        {hasSaveContactButton && (
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-black cursor-pointer"
            style={{ background: 'transparent', color: colors.accent, border: `1px solid ${colors.accent}50`, fontFamily: font }}
            onClick={() => {
              const contactData = { name: data.name || '', title: data.title || '', email: data.email || configSections.contact?.email || '', phone: data.phone || configSections.contact?.phone || '', website: data.website || configSections.contact?.website || '', location: configSections.contact?.location || '' };
              import('@/utils/vcfGenerator').then(module => { module.downloadVCF(contactData); });
            }}>
            <UserPlus className="w-4 h-4" />
            {actionData.save_contact_button_text}
          </button>
        )}
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-4 py-4" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="relative px-4 py-5 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`, border: `1px solid ${colors.primary}30` }}>
          <div className="text-center">
            <p className="text-sm font-black mb-2" style={{ color: colors.primary, fontFamily: font }}>🎮 GG!</p>
            <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>{thankYouData.message}</p>
          </div>
        </div>
      </div>
    );
  };

  const copyrightSection = configSections.copyright;
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ 
      fontFamily: font,
      backgroundColor: colors.background,
      border: `3px solid ${colors.primary}`,
      boxShadow: `0 0 40px ${colors.primary}40, inset 0 0 40px ${colors.primary}10`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
      
      {/* Action Buttons Section - removed from here, now part of ordered sections */}
      
      {copyrightSection && (
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${colors.primary}20` }}>
          {copyrightSection.text && (
            <p className="text-sm text-center font-bold" style={{ color: colors.text + '50', fontFamily: font }}>
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

export default GamingStreamerTemplate;
