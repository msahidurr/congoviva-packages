import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Mic, Radio, Play, Headphones, Volume2, Youtube, Video, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface PodcastCreatorTemplateProps {
  data: any;
  template: any;
}

const PodcastCreatorMapEmbed = React.memo(function PodcastCreatorMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function PodcastCreatorTemplate({ data, template }: PodcastCreatorTemplateProps) {
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
  const colors = configSections.colors || template?.defaultColors || { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#F59E0B', background: '#1F1B24', text: '#F3F4F6' };
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
  const allSections = getBusinessTemplate('podcast-creator')?.sections || [];

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
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'shows':
        return renderShowsSection(sectionData);
      case 'episodes':
        return renderEpisodesSection(sectionData);
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
    <div className="relative rounded-t-2xl overflow-hidden" style={{ background: colors.background, minHeight: '260px' }}>
      {/* Radial spotlight glow */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 70% 55% at 50% 0%, ${colors.primary}40 0%, transparent 70%)`
      }} />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(${colors.primary} 1px, transparent 1px), linear-gradient(90deg, ${colors.primary} 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Language Selector */}
      {(configSections?.language?.enable_language_switcher) && (
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="cursor-pointer flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{ backgroundColor: `${colors.primary}25`, border: `1px solid ${colors.primary}50`, color: colors.text, backdropFilter: 'blur(8px)' }}
            >
              <span>{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode || 'us').toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
              <span style={{ color: colors.primary }}>{languageData.find(lang => lang.code === currentLanguage)?.code?.toUpperCase() || 'EN'}</span>
              <span style={{ color: `${colors.text}60`, fontSize: '8px' }}>▼</span>
            </button>
            {showLanguageSelector && (
              <div className="absolute top-full right-0 mt-2 rounded-2xl shadow-2xl py-2 min-w-[160px] max-h-52 overflow-y-auto z-50"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}30`, boxShadow: `0 8px 24px ${colors.primary}25` }}>
                {languageData.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="cursor-pointer w-full text-left px-3 py-2 text-sm flex items-center space-x-2"
                    style={{
                      backgroundColor: currentLanguage === lang.code ? `${colors.primary}20` : 'transparent',
                      color: currentLanguage === lang.code ? colors.primary : colors.text
                    }}
                  >
                    <span>{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                    <span className="font-medium">{lang.name}</span>
                    {currentLanguage === lang.code && <span className="ml-auto text-xs" style={{ color: colors.primary }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Centered content */}
      <div className="relative flex flex-col items-center pt-8 pb-0 px-6">
        {/* Avatar with rings */}
        <div className="relative mb-4">
          <div className="absolute rounded-full animate-ping" style={{ inset: '-10px', border: `2px solid ${colors.accent}35`, animationDuration: '2.5s' }} />
          <div className="absolute rounded-full" style={{ inset: '-5px', border: `2px solid ${colors.primary}50` }} />
          <div className="w-24 h-24 rounded-full overflow-hidden relative z-10"
            style={{ border: `3px solid ${colors.primary}`, boxShadow: `0 0 40px ${colors.primary}60, 0 0 80px ${colors.primary}20` }}>
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                <Mic className="w-10 h-10" style={{ color: colors.primary }} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center z-20"
            style={{ backgroundColor: colors.accent, border: `2px solid ${colors.background}` }}>
            <Mic className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Status badge */}
        {headerData.status_text && (
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: `${colors.accent}20`, border: `1px solid ${colors.accent}60` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
            <span className="text-xs font-black tracking-widest" style={{ color: colors.accent, fontFamily: font }}>
              {headerData.status_text}
            </span>
          </div>
        )}

        {/* Name */}
        <h1 className="text-2xl font-black text-center mb-1 tracking-tight" style={{ color: colors.text, fontFamily: font }}>
          {headerData.name || data.name || 'Podcast Host'}
        </h1>

        {/* Title gradient */}
        <p className="text-base font-semibold text-center mb-3" style={{
          color: colors.primary,
          fontFamily: font
        }}>
          {headerData.title || 'Content Creator'}
        </p>

        {/* Tagline */}
        {headerData.tagline && (
          <p className="text-sm text-center italic leading-relaxed mb-4 max-w-xs"
            style={{ color: `${colors.text}CC`, fontFamily: font }}>
            "{headerData.tagline}"
          </p>
        )}
      </div>

      {/* Equalizer bar divider */}
      <div className="flex items-end justify-center gap-px px-4" style={{ height: '28px' }}>
        {[4,7,12,9,16,11,20,14,18,10,22,15,19,12,17,9,14,8,11,6,9,13,7,10,5].map((h, i) => (
          <div key={i} className="animate-pulse rounded-t-sm flex-1"
            style={{
              height: `${h}px`,
              backgroundColor: i % 3 === 0 ? colors.accent : i % 3 === 1 ? colors.primary : colors.secondary,
              opacity: 0.75,
              animationDelay: `${i * 0.08}s`,
              animationDuration: `${0.8 + (i % 4) * 0.3}s`
            }}
          />
        ))}
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

  const renderContactSection = (contactData: any) => {
    const items = [
      { condition: contactData.email || data.email, href: `mailto:${contactData.email || data.email}`, icon: <Mail className="w-5 h-5 text-white" />, label: t('Email'), value: contactData.email || data.email, color: colors.primary },
      { condition: contactData.phone || data.phone, href: `tel:${contactData.phone || data.phone}`, icon: <Phone className="w-5 h-5 text-white" />, label: t('Phone'), value: contactData.phone || data.phone, color: colors.secondary },
      { condition: contactData.website || data.website, href: contactData.website || data.website, icon: <Globe className="w-5 h-5 text-white" />, label: t('Website'), value: (contactData.website || data.website)?.replace(/^https?:\/\//, ''), color: colors.accent, external: true },
      { condition: contactData.location, href: null, icon: <MapPin className="w-5 h-5 text-white" />, label: t('Location'), value: contactData.location, color: colors.primary },
    ].filter(item => item.condition);

    if (items.length === 0) return null;

    return (
      <div className="px-5 py-5" style={{ borderBottom: `1px solid ${colors.primary}25`, backgroundColor: `${colors.background}` }}>
        {/* Section heading */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="flex items-end space-x-px">
            {[3,5,7,5,9].map((h, i) => (
              <div key={i} className="animate-pulse rounded-sm"
                style={{ width: '2px', height: `${h}px`, backgroundColor: colors.primary, opacity: 0.7, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Contact')}</span>
          <div className="flex items-end space-x-px">
            {[9,5,7,5,3].map((h, i) => (
              <div key={i} className="animate-pulse rounded-sm"
                style={{ width: '2px', height: `${h}px`, backgroundColor: colors.primary, opacity: 0.7, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const inner = (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-xl relative overflow-hidden group"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${item.color}30`,
                  boxShadow: `0 2px 12px ${item.color}15`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${item.color}35`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 12px ${item.color}15`; }}
              >
                {/* Glowing left border */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.color}12, transparent)`,
                    transition: 'opacity 0.3s ease'
                  }} />
                {/* Icon with pulse */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-2 relative"
                  style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}99)`, boxShadow: `0 4px 12px ${item.color}50` }}>
                  {item.icon}
                  <div className="absolute inset-0 rounded-xl animate-ping"
                    style={{ backgroundColor: `${item.color}30`, animationDuration: `${2 + index * 0.4}s` }} />
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: item.color, fontFamily: font }}>{item.label}</p>
                  <p className="text-sm font-medium truncate" style={{ color: colors.text, fontFamily: font }}>{item.value}</p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={index} href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {inner}
              </a>
            ) : <div key={index}>{inner}</div>;
          })}
        </div>
      </div>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    const badgeColors = [colors.primary, colors.secondary, colors.accent];
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Floating background icons */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {[
            { icon: '🎚️', bottom: '8%', right: '3%', size: '2.5rem', rotate: '12deg', opacity: 0.18 },
          ].map((item, i) => (
            <span key={i} className="absolute" style={{
              top: item.top,
              left: (item as any).left,
              right: (item as any).right,
              bottom: (item as any).bottom,
              fontSize: item.size,
              transform: `rotate(${item.rotate})`,
              opacity: item.opacity,
            }}>{item.icon}</span>
          ))}
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[3,5,8,5,9].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.12}s`, animationDuration:`${0.8+i*0.15}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('About the Host')}</span>
          <div className="flex items-end space-x-px">
            {[9,5,8,5,3].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.12}s`, animationDuration:`${0.8+i*0.15}s` }} />)}
          </div>
        </div>

        {/* Broadcast tape bio card */}
        <div className="relative p-4 rounded-2xl mb-5 overflow-hidden"
          style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}40`, boxShadow: `0 0 20px ${colors.primary}15` }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${colors.primary}05 3px, ${colors.primary}05 4px)`
          }} />
          <div className="flex items-end space-x-px mb-3">
              {[3,5,8,5,9,6,4,7,5,3].map((h, i) => (
                <div key={i} className="animate-pulse rounded-sm"
                  style={{ width: '2px', height: `${h}px`, backgroundColor: colors.primary, opacity: 0.6, animationDelay: `${i * 0.1}s`, animationDuration: '1s' }} />
              ))}
            </div>
          <p className="text-sm leading-relaxed relative z-10" style={{ color: colors.text, fontFamily: font }}>
            {aboutData.description || data.description}
          </p>
        </div>

        {/* Experience hero stat */}
        {aboutData.experience && (
          <div className="flex items-center justify-center space-x-4 mb-5">
            <div className="flex items-end space-x-px">
              {[4,7,10,8,12,9,6].map((h, i) => (
                <div key={i} className="animate-pulse rounded-t-sm"
                  style={{ width: '3px', height: `${h}px`, backgroundColor: colors.secondary, opacity: 0.5, animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
            <div className="text-center">
              <div className="flex items-end justify-center">
                <span className="font-black" style={{ fontSize: '2rem', lineHeight: 1, color: colors.primary, fontFamily: font, textShadow: `0 0 20px ${colors.primary}60` }}>
                  {aboutData.experience}
                </span>
                <span className="text-xs font-semibold mb-1 ml-1" style={{ color: colors.secondary, fontFamily: font }}>YRS</span>
              </div>
              <p className="text-xs font-bold tracking-widest" style={{ color: `${colors.text}70`, fontFamily: font }}>{t('Creating Content')}</p>
            </div>
            <div className="flex items-end space-x-px">
              {[6,9,12,8,10,7,4].map((h, i) => (
                <div key={i} className="animate-pulse rounded-t-sm"
                  style={{ width: '3px', height: `${h}px`, backgroundColor: colors.secondary, opacity: 0.5, animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Topics as frequency chips */}
        {aboutData.topics && (
          <div className="mb-5">
            <p className="text-xs font-black tracking-wider mb-2" style={{ color: `${colors.text}60`, fontFamily: font }}>📡 {t('Podcast Topics')}</p>
            <div className="flex flex-wrap gap-2">
              {aboutData.topics.split(',').map((topic: string, index: number) => {
                const c = badgeColors[index % 3];
                return (
                  <span key={index} className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${c}15`, color: c, border: `1px solid ${c}35`, fontFamily: font }}>
                    <span className="flex items-end space-x-px">
                      {[2,4,3].map((h, i) => (
                        <span key={i} className="animate-pulse inline-block rounded-sm"
                          style={{ width: '2px', height: `${h}px`, backgroundColor: c, animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </span>
                    <span>{topic.trim()}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Now Broadcasting mission */}
        {aboutData.mission && (
          <div className="relative p-4 rounded-2xl overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${colors.accent}15, ${colors.primary}10)`, border: `1px solid ${colors.accent}30` }}>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm">📡</span>
              <span className="text-xs font-bold" style={{ color: colors.accent, fontFamily: font }}>{t(' Content Mission')}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: `${colors.text}CC`, fontFamily: font }}>
              {aboutData.mission}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderShowsSection = (showsData: any) => {
    const shows = showsData.show_list || [];
    if (!Array.isArray(shows) || shows.length === 0) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Section heading */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[4,7,5,9,6].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.1}s`, animationDuration:`${0.9+i*0.2}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.secondary, fontFamily: font }}>{t('My Shows')}</span>
          <div className="flex items-end space-x-px">
            {[6,9,5,7,4].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.1}s`, animationDuration:`${0.9+i*0.2}s` }} />)}
          </div>
        </div>

        <div className="space-y-4">
          {shows.map((show: any, index: number) => {
            const cardColor = index % 2 === 0 ? colors.primary : colors.secondary;
            return (
              <div key={index} className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${cardColor}30` }}>

                <div className="p-4">
                  {/* Title + frequency */}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold flex-1 mr-2" style={{ color: colors.text, fontFamily: font }}>
                      {show.title}
                    </h4>
                    {show.frequency && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${colors.accent}20`, color: colors.accent, border: `1px solid ${colors.accent}30`, fontFamily: font }}>
                        {show.frequency}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {show.description && (
                    <p className="text-sm leading-relaxed mb-3" style={{ color: `${colors.text}AA`, fontFamily: font }}>
                      {show.description}
                    </p>
                  )}

                  {/* Available on */}
                  {show.platform_links && (
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="text-sm font-semibold mr-1" style={{ color: cardColor, fontFamily: font }}>
                        {t('Available on:')}
                      </span>
                      {show.platform_links.split(',').map((p: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${cardColor}15`, color: `${colors.text}CC`, border: `1px solid ${cardColor}25`, fontFamily: font }}>
                          {p.trim()}
                        </span>
                      ))}
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

  const renderEpisodesSection = (episodesData: any) => {
    const episodes = episodesData.episode_list || [];
    if (!Array.isArray(episodes) || episodes.length === 0) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[6,4,9,5,7].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.15}s`, animationDuration:`${0.7+i*0.18}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.accent, fontFamily: font }}>{t('Latest Episodes')}</span>
          <div className="flex items-end space-x-px">
            {[7,5,9,4,6].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.15}s`, animationDuration:`${0.7+i*0.18}s` }} />)}
          </div>
        </div>
        <div className="space-y-3">
          {episodes.slice(0, 3).map((episode: any, index: number) => {
            const cardColor = index % 2 === 0 ? colors.primary : colors.secondary;
            return (
              <div key={index} className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${cardColor}25` }}>
                <div className="pl-4 pr-4 py-3">
                  {/* Title + duration */}
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold leading-snug flex-1 mr-2" style={{ color: colors.text, fontFamily: font }}>
                      {episode.title}
                    </h4>
                    {episode.duration && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${cardColor}25`, color: cardColor, fontFamily: font }}>
                        {episode.duration}
                      </span>
                    )}
                  </div>
                  {/* Guest */}
                  {episode.guest && (
                    <p className="text-sm mb-1" style={{ color: `${colors.text}80`, fontFamily: font }}>🎤 {episode.guest}</p>
                  )}
                  {/* Description */}
                  {episode.description && (
                    <p className="text-sm leading-relaxed mb-2" style={{ color: `${colors.text}99`, fontFamily: font }}>{episode.description}</p>
                  )}
                  {/* Bottom: waveform + listen */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-end space-x-px">
                      {[3,5,7,4,9,6,8,4,6,3,5,7,4,6,3].map((h, i) => (
                        <div key={i} className="animate-pulse rounded-sm"
                          style={{ width: '2px', height: `${h}px`, backgroundColor: cardColor, opacity: 0.4, animationDelay: `${i * 0.09}s`, animationDuration: `${0.7 + (i % 3) * 0.3}s` }} />
                      ))}
                    </div>
                    {episode.listen_url && (
                      <button
                        className="flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full cursor-pointer"
                        style={{ backgroundColor: cardColor, color: 'white', fontFamily: font, boxShadow: `0 3px 10px ${cardColor}40` }}
                        onClick={() => typeof window !== 'undefined' && window.open(episode.listen_url, '_blank', 'noopener,noreferrer')}>
                        <Play className="w-3 h-3" />
                        <span>{t('Listen')}</span>
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    const bgColors = [colors.primary, colors.secondary, colors.accent, colors.primary, colors.secondary, colors.accent];
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -left-2 -top-2" style={{ fontSize: '4rem', opacity: 0.08 }}>🎧</span>
          <span className="absolute -right-2 -bottom-2" style={{ fontSize: '4rem', opacity: 0.08 }}>🎙️</span>
        </div>
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[5,8,4,7,3].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.08}s`, animationDuration:`${1+i*0.12}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Listen & Follow')}</span>
          <div className="flex items-end space-x-px">
            {[3,7,4,8,5].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.08}s`, animationDuration:`${1+i*0.12}s` }} />)}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((link: any, index: number) => {
            const bg = bgColors[index % bgColors.length];
            return (
              <button key={index}
                className="relative flex items-center justify-center cursor-pointer"
                style={{ width: '52px', height: '52px' }}
                onClick={() => link.url && typeof window !== 'undefined' && window.open(link.url, '_blank', 'noopener,noreferrer')}>
                <div className="absolute inset-0 rounded-2xl animate-pulse"
                  style={{ backgroundColor: `${bg}15`, animationDuration: `${2 + index * 0.3}s` }} />
                <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl z-10"
                  style={{ background: `linear-gradient(135deg, ${bg}30, ${bg}15)`, border: `1.5px solid ${bg}50`, boxShadow: `0 4px 12px ${bg}30` }}>
                  <SocialIcon platform={link.platform} color={bg} />
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
    const dayShort = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
    const dayKeys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[7,4,9,6,5].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.13}s`, animationDuration:`${0.85+i*0.16}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.secondary, fontFamily: font }}>{t('Recording Schedule')}</span>
          <div className="flex items-end space-x-px">
            {[5,6,9,4,7].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.13}s`, animationDuration:`${0.85+i*0.16}s` }} />)}
          </div>
        </div>

        {/* Day pills row */}
        <div className="flex justify-between mb-4">
          {dayKeys.map((day, i) => {
            const hour = hours.find((h: any) => h.day === day);
            const isOpen = hour && !hour.is_closed;
            return (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isOpen ? colors.primary : `${colors.text}10`,
                    boxShadow: isOpen ? `0 0 10px ${colors.primary}50` : 'none',
                    border: `1px solid ${isOpen ? colors.primary : colors.text + '15'}`
                  }}>
                  <span className="text-xs font-black" style={{ color: isOpen ? 'white' : `${colors.text}30`, fontFamily: font }}>
                    {dayShort[i][0]}
                  </span>
                </div>
                {isOpen && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Open days detail */}
        <div className="space-y-2">
          {hours.filter((h: any) => !h.is_closed).map((hour: any, index: number) => (
            <div key={index} className="flex items-center justify-between px-4 py-2.5 rounded-2xl relative overflow-hidden"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}20` }}>
              <span className="text-sm font-bold capitalize" style={{ color: colors.text, fontFamily: font }}>
                {t(hour.day)}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: `${colors.primary}20`, color: colors.primary, fontFamily: font }}>
                  {hour.open_time}
                </span>
                <span className="text-xs" style={{ color: `${colors.text}40` }}>–</span>
                <span className="text-sm font-bold px-2 py-0.5 rounded-lg"
                  style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary, fontFamily: font }}>
                  {hour.close_time}
                </span>
              </div>
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
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Floating background */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[4,9,5,7,3].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.11}s`, animationDuration:`${0.75+i*0.2}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.accent, fontFamily: font }}>{t('Listener Reviews')}</span>
          <div className="flex items-end space-x-px">
            {[3,7,5,9,4].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.11}s`, animationDuration:`${0.75+i*0.2}s` }} />)}
          </div>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}>
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0 px-1">
                <div className="relative p-5 rounded-2xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${colors.cardBg}, ${colors.primary}10)`, border: `1px solid ${colors.primary}20` }}>

                  {/* Big quote watermark */}
                  <span className="absolute -top-2 -left-1 font-black pointer-events-none select-none"
                    style={{ fontSize: '5rem', lineHeight: 1, color: `${colors.primary}12`, fontFamily: font }}>&ldquo;</span>

                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < parseInt(review.rating || 5) ? '#FBBF24' : `${colors.text}20`, fontSize: '20px' }}>&#9733;</span>
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-sm leading-relaxed mb-4 relative z-10" style={{ color: `${colors.text}CC`, fontFamily: font }}>
                    {review.review}
                  </p>

                  {/* Reviewer info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}25`, border: `1px solid ${colors.primary}40` }}>
                        <span className="text-sm font-black" style={{ color: colors.primary, fontFamily: font }}>
                          {review.client_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>
                        {review.client_name}
                      </span>
                    </div>
                    {review.platform && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${colors.accent}20`, color: colors.accent, border: `1px solid ${colors.accent}30`, fontFamily: font }}>
                        {review.platform}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center mt-4 space-x-1.5">
            {reviews.map((_: any, dotIndex: number) => (
              <div key={dotIndex}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: dotIndex === currentReview % reviews.length ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: dotIndex === currentReview % reviews.length ? colors.primary : `${colors.primary}30`
                }}
              onClick={() => setCurrentReview(dotIndex)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Floating bg */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[6,5,9,4,8].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.09}s`, animationDuration:`${0.9+i*0.14}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Be My Guest')}</span>
          <div className="flex items-end space-x-px">
            {[8,4,9,5,6].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.09}s`, animationDuration:`${0.9+i*0.14}s` }} />)}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden p-5"
          style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}10)`, border: `1px solid ${colors.primary}25` }}>

          {/* Animated mic icon */}
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20`, border: `2px solid ${colors.primary}40` }}>
              <div className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: `${colors.primary}15`, animationDuration: '2s' }} />
              <Mic className="w-7 h-7 relative z-10" style={{ color: colors.primary }} />
            </div>
          </div>

          {appointmentsData?.guest_requirements && (
            <p className="text-sm leading-relaxed text-center mb-5" style={{ color: `${colors.text}CC`, fontFamily: font }}>
              {appointmentsData.guest_requirements}
            </p>
          )}

          <button
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl font-bold text-sm mb-2 cursor-pointer"
            style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font, boxShadow: `0 4px 18px ${colors.primary}50` }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-4 h-4" />
            <span>{t('Book Interview Slot')}</span>
          </button>

          {appointmentsData?.calendar_link && (
            <button
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl font-bold text-sm cursor-pointer"
              style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary, border: `1px solid ${colors.secondary}40`, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appointmentsData.calendar_link, '_blank', 'noopener,noreferrer')}>
              <Calendar className="w-4 h-4" />
              <span>{t('View Calendar')}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[3,7,5,9,4].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.14}s`, animationDuration:`${0.8+i*0.17}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.secondary, fontFamily: font }}>{t('Studio Location')}</span>
          <div className="flex items-end space-x-px">
            {[4,9,5,7,3].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.14}s`, animationDuration:`${0.8+i*0.17}s` }} />)}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${colors.primary}25`, boxShadow: `0 0 20px ${colors.primary}10` }}>
          {locationData.map_embed_url && (
            <PodcastCreatorMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          {locationData.directions_url && (
            <div className="p-3" style={{ backgroundColor: colors.cardBg }}>
              <button
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl font-bold text-sm cursor-pointer"
                style={{ backgroundColor: `${colors.primary}20`, color: colors.primary, border: `1px solid ${colors.primary}30`, fontFamily: font }}
                onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}>
                <MapPin className="w-4 h-4" />
                <span>{t('Get Directions')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[8,4,7,5,6].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.1}s`, animationDuration:`${0.95+i*0.13}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.accent, fontFamily: font }}>{t('Get The App')}</span>
          <div className="flex items-end space-x-px">
            {[6,5,7,4,8].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.1}s`, animationDuration:`${0.95+i*0.13}s` }} />)}
          </div>
        </div>
        <div className="flex space-x-3">
          {appData.app_store_url && (
            <button
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl cursor-pointer"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}25` }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill={colors.primary}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>{t('App Store')}</span>
            </button>
          )}
          {appData.play_store_url && (
            <button
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl cursor-pointer"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.secondary}25` }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill={colors.secondary}>
                <path d="M3.18 23.76c.3.17.65.19.96.07l12.45-7.2-2.78-2.78-10.63 9.91zM.5 1.4C.19 1.72 0 2.22 0 2.87v18.26c0 .65.19 1.15.5 1.47l.08.07 10.23-10.23v-.24L.58 1.33.5 1.4zM20.37 10.03l-2.9-1.68-3.07 3.07 3.07 3.07 2.92-1.69c.83-.48.83-1.27-.02-1.77zM3.18.24L15.63 7.44l-2.78 2.78L2.22.31c.31-.12.66-.1.96.07v-.14z"/>
              </svg>
              <span className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>{t('Play Store')}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Floating bg */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[5,9,3,7,4].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.11}s`, animationDuration:`${0.8+i*0.19}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Get In Touch')}</span>
          <div className="flex items-end space-x-px">
            {[4,7,3,9,5].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.11}s`, animationDuration:`${0.8+i*0.19}s` }} />)}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden p-5"
          style={{ background: `linear-gradient(135deg, ${colors.cardBg}, ${colors.secondary}10)`, border: `1px solid ${colors.secondary}25` }}>

          <h3 className="text-base font-bold mb-2 text-center" style={{ color: colors.text, fontFamily: font }}>
            {formData.form_title}
          </h3>

          {formData.form_description && (
            <p className="text-sm leading-relaxed mb-4 text-center" style={{ color: `${colors.text}AA`, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}

          <div className="flex justify-center">
            <button
              className="flex items-center space-x-2 px-5 py-2 rounded-xl font-bold text-sm cursor-pointer"
              style={{ backgroundColor: colors.secondary, color: 'white', fontFamily: font, boxShadow: `0 4px 14px ${colors.secondary}40` }}
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}>
              <Mail className="w-4 h-4" />
              <span>{t('Send Message')}</span>
            </button>
          </div>
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
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Section heading */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[4,6,9,5,8].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.12}s`, animationDuration:`${0.85+i*0.15}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.secondary, fontFamily: font }}>{t('Video Content')}</span>
          <div className="flex items-end space-x-px">
            {[8,5,9,6,4].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.secondary, opacity:0.7, animationDelay:`${i*0.12}s`, animationDuration:`${0.85+i*0.15}s` }} />)}
          </div>
        </div>

        <div className="space-y-4">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');

            return (
              <div key={video.key} className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}20` }}>

                {/* Thumbnail / Player */}
                {playingKey === video.key && videoUrl ? (
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
                  <div className="relative w-full cursor-pointer" style={{ height: '180px' }}
                    onClick={() => { if (videoUrl) setPlayingKey(video.key); }}>
                    {/* Thumbnail */}
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${colors.primary}30, ${colors.secondary}20)` }}>
                        <Video className="w-10 h-10" style={{ color: colors.primary }} />
                      </div>
                    )}

                    {/* Dark overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />

                    {/* Play button */}
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: `${colors.primary}40`, animationDuration: '2s' }} />
                          <div className="w-14 h-14 rounded-full flex items-center justify-center relative z-10"
                            style={{ backgroundColor: colors.primary, boxShadow: `0 0 24px ${colors.primary}80` }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Duration badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}>
                        <span className="text-xs font-bold text-white">{video.duration}</span>
                      </div>
                    )}

                    {/* Video type badge */}
                    {video.video_type && (
                      <div className="absolute capitalize top-2 left-2 px-2 rounded-full"
                        style={{ backgroundColor: `${colors.accent}CC` }}>
                        <span className="text-xs font-bold" style={{ color: colors.background }}>{video.video_type.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Info row */}
                <div className="p-3">
                  <h4 className="text-sm font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-sm leading-relaxed" style={{ color: `${colors.text}99`, fontFamily: font }}>
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
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Section heading */}
        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[7,3,8,5,9].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.09}s`, animationDuration:`${0.9+i*0.16}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.accent, fontFamily: font }}>{t('YouTube Channel')}</span>
          <div className="flex items-end space-x-px">
            {[9,5,8,3,7].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.accent, opacity:0.7, animationDelay:`${i*0.09}s`, animationDuration:`${0.9+i*0.16}s` }} />)}
          </div>
        </div>

        {/* Latest Video Embed */}
        {youtubeData.latest_video_embed && (
          <div className="rounded-2xl overflow-hidden mb-4"
            style={{ border: `1px solid ${colors.primary}25`, boxShadow: `0 0 20px ${colors.primary}15` }}>
            <div className="w-full relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest YouTube Video')}
              />
            </div>
          </div>
        )}

        {/* Channel card */}
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)`, border: `1px solid ${colors.primary}30` }}>

          {/* Floating background icons */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <span className="absolute -left-2 -bottom-4" style={{ fontSize: '3rem', opacity: 0.08 }}>🎙️</span>
          </div>

          {/* Channel info */}
          <div className="relative p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.primary}25`, border: `2px solid ${colors.primary}50` }}>
                <Youtube className="w-7 h-7" style={{ color: colors.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Podcast Channel'}
                </h4>
                {youtubeData.subscriber_count && (
                  <div className="flex items-center space-x-1 mt-0.5">
                    <div className="flex items-end space-x-px">
                      {[3,5,4,6,3].map((h, i) => (
                        <div key={i} className="animate-pulse rounded-sm"
                          style={{ width: '2px', height: `${h}px`, backgroundColor: colors.primary, opacity: 0.6, animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: `${colors.text}80`, fontFamily: font }}>
                      {youtubeData.subscriber_count} {t('subscribers')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: `${colors.text}AA`, fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}

            <div className="space-y-2">
              {youtubeData.channel_url && (
                <button className="cursor-pointer w-full flex items-center justify-center space-x-2 py-2 rounded-xl font-bold text-sm relative overflow-hidden"
                  style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font, boxShadow: `0 4px 18px ${colors.primary}50` }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}>
                  <Youtube className="w-4 h-4" />
                  <span>{t('Subscribe')}</span>
                </button>
              )}
              {youtubeData.featured_playlist && (
                <button className="cursor-pointer w-full flex items-center justify-center space-x-2 py-2 rounded-xl font-bold text-sm"
                  style={{ backgroundColor: `${colors.primary}15`, color: colors.primary, border: `1px solid ${colors.primary}40`, fontFamily: font }}
                  onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}>
                  <Play className="w-4 h-4" />
                  <span>{t('Latest Episodes Playlist')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center justify-center space-x-3 mb-5">
            
            <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>📌 {customHtmlData.section_title}</span>
            
          </div>
        )}
        <div className="custom-html-content p-4 rounded-2xl"
          style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}15`, fontFamily: font, color: colors.text }}>
          <style>{`
            .custom-html-content h1,.custom-html-content h2,.custom-html-content h3,.custom-html-content h4 { color: ${colors.primary}; margin-bottom: 0.5rem; font-family: ${font}; }
            .custom-html-content p { color: ${colors.text}; margin-bottom: 0.5rem; font-size: 0.875rem; font-family: ${font}; }
            .custom-html-content a { color: ${colors.accent}; text-decoration: underline; }
            .custom-html-content ul,.custom-html-content ol { color: ${colors.text}; padding-left: 1rem; font-family: ${font}; }
            .custom-html-content code { background-color: ${colors.primary}20; color: ${colors.accent}; padding: 0.125rem 0.25rem; border-radius: 0.25rem; }
          `}</style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>

        {/* Floating bg */}

        <div className="flex items-center justify-center space-x-3 mb-5">
          <div className="flex items-end space-x-px">
            {[5,8,4,9,6].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.13}s`, animationDuration:`${0.8+i*0.18}s` }} />)}
          </div>
          <span className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Share QR Code')}</span>
          <div className="flex items-end space-x-px">
            {[6,9,4,8,5].map((h,i) => <div key={i} className="animate-pulse rounded-sm" style={{ width:'2px', height:`${h}px`, backgroundColor:colors.primary, opacity:0.7, animationDelay:`${i*0.13}s`, animationDuration:`${0.8+i*0.18}s` }} />)}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden p-4 flex flex-col items-center"
          style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}10)`, border: `1px solid ${colors.primary}25` }}>

          {/* Animated QR icon */}
          <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${colors.primary}20`, border: `2px solid ${colors.primary}40` }}>
            <div className="absolute inset-0 rounded-2xl animate-ping"
              style={{ backgroundColor: `${colors.primary}10`, animationDuration: '2.5s' }} />
            <QrCode className="w-6 h-6 relative z-10" style={{ color: colors.primary }} />
          </div>

          {qrData.qr_title && (
            <h4 className="text-base font-bold text-center mb-1" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}

          {qrData.qr_description && (
            <p className="text-sm text-center leading-relaxed mb-3" style={{ color: `${colors.text}AA`, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <button
            className="flex items-center space-x-2 px-6 py-1.5 rounded-xl font-bold text-sm cursor-pointer"
            style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font, boxShadow: `0 4px 14px ${colors.primary}40` }}
            onClick={() => setShowQrModal(true)}>
            <QrCode className="w-4 h-4" />
            <span>{t('Share QR Code')}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        {/* Equalizer bars top */}
        <div className="flex items-end justify-center gap-px mb-4" style={{ height: '20px' }}>
          {[3,5,8,6,10,7,12,9,11,7,9,6,8,5,4].map((h, i) => (
            <div key={i} className="animate-pulse rounded-t-sm flex-1"
              style={{
                height: `${h}px`,
                backgroundColor: i % 3 === 0 ? colors.accent : i % 3 === 1 ? colors.primary : colors.secondary,
                opacity: 0.5,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.8 + (i % 3) * 0.3}s`
              }} />
          ))}
        </div>

        {/* Message */}
        <p className="text-sm text-center leading-relaxed relative z-10 px-2"
          style={{ color: `${colors.text}CC`, fontFamily: font, fontStyle: 'italic' }}>
          "{thankYouData.message}"
        </p>

        {/* Equalizer bars bottom flipped */}
        <div className="flex items-start justify-center gap-px mt-4" style={{ height: '20px' }}>
          {[4,6,9,7,11,8,12,9,10,6,8,5,7,4,3].map((h, i) => (
            <div key={i} className="animate-pulse rounded-b-sm flex-1"
              style={{
                height: `${h}px`,
                backgroundColor: i % 3 === 0 ? colors.secondary : i % 3 === 1 ? colors.accent : colors.primary,
                opacity: 0.5,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.9 + (i % 3) * 0.3}s`
              }} />
          ))}
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;
    if (!hasContactButton && !hasSaveContactButton) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden" style={{ borderBottom: `1px solid ${colors.primary}25` }}>
        <div className="space-y-3 relative z-10">
          {hasContactButton && (
            <button
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-2xl font-bold text-base relative overflow-hidden cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font, boxShadow: `0 8px 25px ${colors.primary}40` }}
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}>
              {/* Shimmer */}
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
              <Mic className="w-5 h-5" />
              <span>{actionData.contact_button_text}</span>
            </button>
          )}
          {hasSaveContactButton && (
            <button
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-2xl font-bold text-sm cursor-pointer"
              style={{ backgroundColor: 'transparent', color: colors.accent, border: `2px solid ${colors.accent}`, fontFamily: font }}
              onClick={() => {
                const contactData = {
                  name: data.name || '',
                  title: data.title || '',
                  email: data.email || configSections.contact?.email || '',
                  phone: data.phone || configSections.contact?.phone || '',
                  website: data.website || configSections.contact?.website || '',
                  location: configSections.contact?.location || ''
                };
                import('@/utils/vcfGenerator').then(module => { module.downloadVCF(contactData); });
              }}>
              <UserPlus className="w-4 h-4" />
              <span>{actionData.save_contact_button_text}</span>
            </button>
          )}
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
      border: `2px solid ${colors.primary}30`,
      boxShadow: `0 20px 60px ${colors.primary}20`
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
      

      
      {copyrightSection && (
        <div className="px-5 py-4 flex items-center justify-center space-x-2">
          <div className="flex items-end space-x-px">
            {[2,4,3,5,2].map((h, i) => (
              <div key={i} className="animate-pulse rounded-sm"
                style={{ width: '2px', height: `${h}px`, backgroundColor: colors.primary, opacity: 0.5, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          {copyrightSection.text && (
            <p className="text-sm text-center" style={{ color: colors.text, fontFamily: font }}>
              {copyrightSection.text}
            </p>
          )}
          <div className="flex items-end space-x-px">
            {[2,4,3,5,2].map((h, i) => (
              <div key={i} className="animate-pulse rounded-sm"
                style={{ width: '2px', height: `${h}px`, backgroundColor: colors.primary, opacity: 0.5, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
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