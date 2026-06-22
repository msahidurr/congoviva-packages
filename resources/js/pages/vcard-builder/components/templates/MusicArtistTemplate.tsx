import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React, { useState } from 'react';
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
  Instagram,
  Facebook,
  Twitter,
  Clock,
  Calendar,
  Star,
  ChevronRight,
  UserPlus,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Music,
  Mic,
  Headphones,
  Radio,
  Disc,
  Play,
  Users,
  ShoppingBag,
  Youtube,
  Ticket,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface MusicArtistTemplateProps {
  data: any;
  template: any;
}

const MusicArtistMapEmbed = React.memo(function MusicArtistMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function MusicArtistTemplate({ data, template }: MusicArtistTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeTrack, setActiveTrack] = useState<number>(0);
  const [activeVideo, setActiveVideo] = useState<number>(0);
  const [firstVideoPlaying, setFirstVideoPlaying] = useState<boolean>(false);

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

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Montserrat, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/["']/g, '');

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
  // Language selector state
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);
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
    primary: '#E91E63',
    secondary: '#FF4081',
    accent: '#311B92',
    background: '#121212',
    text: '#FFFFFF',
    cardBg: '#1E1E1E',
    borderColor: '#333333',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
  };
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);

  // Get all sections for this business type
  const allSections = getBusinessTemplate('music-artist')?.sections || [];

  // Helper function to get icon component
  const getServiceIcon = (iconName: string, size: number = 20) => {
    switch (iconName) {
      case 'music': return <Music size={size} />;
      case 'mic': return <Mic size={size} />;
      case 'headphones': return <Headphones size={size} />;
      case 'radio': return <Radio size={size} />;
      case 'disc': return <Disc size={size} />;
      case 'guitar':
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3h4v4l-4 3-2-2-6 6-4-4 6-6-2-2z"></path>
            <path d="M17 18v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3l6-6 6 6z"></path>
          </svg>
        );
      case 'piano': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path>
          <path d="M8 4v16"></path>
          <path d="M16 4v16"></path>
          <path d="M4 12h16"></path>
        </svg>
      );
      case 'drum': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6a4 4 0 0 0-4 4v10h8V10a4 4 0 0 0-4-4Z"></path>
          <path d="M18 8a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4"></path>
          <path d="M8 16h8"></path>
        </svg>
      );
      default: return <Music size={size} />;
    }
  };

  // Helper function to get social icon
  const getSocialIcon = (platform: string, size: number = 20) => {
    switch (platform) {
      case 'spotify': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 11.8A5.5 5.5 0 0 1 16 8"></path>
          <path d="M9 15a4 4 0 0 1 6-1"></path>
          <path d="M11 18a2 2 0 0 1 2-1"></path>
        </svg>
      );
      case 'apple': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
          <path d="M10 2c1 .5 2 2 2 5"></path>
        </svg>
      );
      case 'soundcloud': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13h6"></path>
          <path d="M3 13h2"></path>
          <path d="M16 13h2"></path>
          <path d="M18 9h1a3 3 0 0 1 0 6h-1"></path>
          <path d="M3 17v-8l4 8v-8"></path>
          <path d="M13 17v-4a2 2 0 0 0-2-2"></path>
        </svg>
      );
      case 'youtube': return <Youtube size={size} />;
      case 'instagram': return <Instagram size={size} />;
      case 'facebook': return <Facebook size={size} />;
      case 'twitter': return <Twitter size={size} />;
      case 'tiktok': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
          <path d="M15 8h.01"></path>
          <path d="M15 2h-4v6l1 2h3V8h4v4h-3v10"></path>
        </svg>
      );
      case 'bandcamp': return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 15h12l-6-12z"></path>
        </svg>
      );
      default: return <Globe size={size} />;
    }
  };

  const extractIframeSrc = (value?: string) => {
    if (!value || typeof value !== 'string') return null;

    const trimmedValue = value.trim();
    const srcMatch = trimmedValue.match(/src=["']([^"']+)["']/i);
    return srcMatch?.[1] || trimmedValue;
  };

  const getSpotifyEmbedUrl = (value?: string) => {
    const rawValue = extractIframeSrc(value);
    if (!rawValue) return null;

    try {
      const url = new URL(rawValue);
      const hostname = url.hostname.replace(/^www\./, '');

      if (hostname !== 'open.spotify.com' && hostname !== 'play.spotify.com') {
        return null;
      }

      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments.length === 0) return null;

      if (pathSegments[0] === 'embed' && pathSegments.length >= 3) {
        return `https://open.spotify.com/${pathSegments.join('/')}`;
      }

      const supportedTypes = new Set(['track', 'album', 'playlist', 'artist', 'show', 'episode']);
      const [contentType, contentId] = pathSegments;

      if (!contentType || !contentId || !supportedTypes.has(contentType)) {
        return null;
      }

      return `https://open.spotify.com/embed/${contentType}/${contentId}`;
    } catch {
      return null;
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
      case 'music':
        return renderMusicSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'tour_dates':
        return renderTourDatesSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'band_members':
        return renderBandMembersSection(sectionData);
      case 'merchandise':
        return renderMerchandiseSection(sectionData);
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
      case 'footer':
        return renderFooterSection(sectionData);
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
      {/* Fullscreen Header with Image Overlay */}
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
              background: `linear-gradient(135deg, ${colors.primary}80 0%, ${colors.accent} 100%)`,
            }}
          >
            {/* Music pattern overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        )}

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        ></div>

        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: colors.buttonText,
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${colors.primary}50`,
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
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 ${currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 cursor-pointer'
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

        {/* Content Overlay - Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 py-4">
          {/* Logo/Artist Photo */}
          {headerData.logo && (
            <div className="mb-3">
              <div
                className="w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg mx-auto"
                style={{
                  borderColor: colors.primary,
                  backgroundColor: colors.background
                }}
              >
                <img
                  src={getImageDisplayUrl(headerData.logo)}
                  alt={headerData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Artist/Band Name */}
          <h1
            className="text-2xl font-bold mb-2 tracking-wide"
            style={{
              color: colors.buttonText,
              fontFamily: font,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {headerData.name || data.name || 'Sonic Wave'}
          </h1>

          {headerData.tagline && (
            <p
              className="text-sm font-medium mb-4"
              style={{
                color: colors.buttonText + 'E6',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {headerData.tagline}
            </p>
          )}

          {/* CTA Button */}
          {headerData.cta_text && (
            <Button
              className="px-4 py-2 font-medium text-sm shadow-lg"
              style={{
                backgroundColor: colors.primary,
                color: colors.buttonText
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
              <Play size={16} className="mr-2" />
              {headerData.cta_text}
            </Button>
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

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    const artistPhoto = aboutData.artist_photo;
    return (
      <div
        className="px-5 py-8"
        style={{ backgroundColor: colors.background }}
        id="about"
      >
        {/* Top accent line */}
        <div className="w-full h-0.5 mb-6 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}, transparent)` }} />

        <div className="flex items-center justify-center mb-2">
          <Mic size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2 className="text-lg font-bold tracking-widest" style={{ color: colors.primary, fontFamily: font }}>
            {t("About")}
          </h2>
        </div>

        <div className="flex gap-4 mt-4">
          {/* Artist photo */}
          {artistPhoto && (
            <div className="flex-shrink-0">
              <div
                className="w-20 h-20 rounded-xl overflow-hidden"
                style={{
                  border: `2px solid ${colors.primary}`,
                  boxShadow: `0 0 16px ${colors.primary}50`
                }}
              >
                <img src={getImageDisplayUrl(artistPhoto)} alt="Artist" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Bio */}
          <p className="text-base leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
            {aboutData.description || data.description}
          </p>
        </div>

        {/* Metadata cards */}
        {(aboutData.genre || aboutData.origin || aboutData.formed_year) && (
          <div className="flex flex-col gap-3 mt-5">
            {aboutData.genre && (
              <div
                className="rounded-xl px-4 py-4"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.primary}45`,
                  boxShadow: `inset 0 1px 0 ${colors.primary}20`,
                  fontFamily: font
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: colors.primary }}>
                  <Music size={15} />
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: colors.text + 'D9' }}>Genre</span>
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: colors.text }}>
                  {aboutData.genre}
                </p>
              </div>
            )}
            {aboutData.origin && (
              <div
                className="rounded-xl px-4 py-4"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.primary}30`,
                  boxShadow: `inset 0 1px 0 ${colors.primary}14`,
                  fontFamily: font
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: colors.text }}>
                  <MapPin size={14} style={{ color: colors.primary }} />
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: colors.text + 'D9' }}>
                    Origin
                  </span>
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: colors.text }}>
                  {aboutData.origin}
                </p>
              </div>
            )}
            {aboutData.formed_year && (
              <div
                className="rounded-xl px-4 py-4"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: `inset 0 1px 0 ${colors.text}12`,
                  fontFamily: font
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: colors.text + 'B3' }}>
                  <Calendar size={14} style={{ color: colors.primary }} />
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: colors.text + 'D9' }}>Formed</span>
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: colors.text }}>
                  {aboutData.formed_year}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="w-full h-0.5 mt-6 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)` }} />
      </div>
    );
  };

  const renderMusicSection = (musicData: any) => {
    const tracks = musicData.tracks || [];
    if (!Array.isArray(tracks) || tracks.length === 0) return null;
    const safeActiveTrack = tracks[activeTrack] ? activeTrack : 0;

    return (
      <div
        className="px-5 pt-14 pb-10"
        style={{
          background: `linear-gradient(180deg, ${colors.cardBg} 0%, ${colors.background} 100%)`
        }}
        id="music"
      >
        <div className="flex items-center justify-center mb-6">
          <Music size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2 className="text-lg font-bold tracking-widest" style={{ color: colors.primary, fontFamily: font }}>
            {t("Music")}
          </h2>
        </div>

        <div className="space-y-3">
          {tracks.map((track: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-3 transition-all cursor-pointer"
              style={{
                backgroundColor: safeActiveTrack === index ? colors.primary + '14' : colors.cardBg,
                border: `1px solid ${safeActiveTrack === index ? colors.primary : colors.borderColor}`,
                fontFamily: font
              }}
            >
              <button
                type="button"
                className="w-full text-left cursor-pointer"
                onClick={() => setActiveTrack(index)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: safeActiveTrack === index ? colors.primary : colors.background,
                      color: safeActiveTrack === index ? colors.buttonText : colors.primary,
                      border: `1px solid ${safeActiveTrack === index ? colors.primary : colors.primary + '33'}`
                    }}
                  >
                    <Play size={14} fill={safeActiveTrack === index ? 'currentColor' : 'none'} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className="text-[15px] font-semibold truncate"
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {track.title}
                      </h3>
                      {track.stream_url && (
                        <a
                          href={track.stream_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[11px] font-semibold flex-shrink-0"
                          style={{ color: colors.primary, fontFamily: font }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t("Stream")}
                          <ExternalLink size={11} className="ml-1" />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] mt-1" style={{ color: colors.text + '73' }}>
                      {track.album && <span>{track.album}</span>}
                      {track.album && track.year && <span>•</span>}
                      {track.year && <span>{track.year}</span>}
                    </div>
                  </div>
                </div>
              </button>

              {safeActiveTrack === index && track.embed_url && (
                <div className="mt-3 rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.borderColor}` }}>
                  {(() => {
                    const spotifyEmbedUrl = getSpotifyEmbedUrl(track.embed_url);
                    const iframeSrc = extractIframeSrc(track.embed_url);

                    if (spotifyEmbedUrl) {
                      return (
                        <iframe
                          src={spotifyEmbedUrl}
                          width="100%"
                          height="132"
                          className="w-full"
                          style={{ border: 'none', borderRadius: '10px' }}
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          title={track.title || 'Spotify player'}
                        />
                      );
                    }

                    if (iframeSrc && /^https?:\/\//i.test(iframeSrc)) {
                      return (
                        <div className="w-full relative overflow-hidden" style={{ paddingBottom: '20%', minHeight: '80px' }}>
                          <iframe
                            src={iframeSrc}
                            className="absolute inset-0 w-full h-full"
                            style={{ border: 'none' }}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                            title={track.title || 'Music player'}
                          />
                        </div>
                      );
                    }

                    return (
                      <div className="w-full relative overflow-hidden" style={{ paddingBottom: '20%', minHeight: '80px' }}>
                        <div
                          className="absolute inset-0 w-full h-full"
                          dangerouslySetInnerHTML={{ __html: track.embed_url }}
                        />
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVideosSection = (videosData: any) => {
    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;
    const safeActiveVideo = videos[activeVideo] ? activeVideo : 0;

    const getYouTubeThumbnail = (embedUrl: string) => {
      if (!embedUrl) return null;
      let videoId = null;
      const srcMatch = embedUrl.match(/src=["']([^"']+)["']/i);
      const url = srcMatch ? srcMatch[1] : embedUrl;
      const embedMatch = url.match(/embed\/([^?&]+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      } else {
        const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (watchMatch) videoId = watchMatch[1];
      }
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
        id="videos"
      >
        <div className="flex items-center justify-center mb-6">
          <Play size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Videos")}
          </h2>
        </div>

        {/* Active Video Player */}
        <div
          className="w-full max-w-[440px] mx-auto rounded-xl overflow-hidden mb-4"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {videos[safeActiveVideo]?.embed_url && (safeActiveVideo !== 0 || firstVideoPlaying) ? (
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={(extractVideoUrl(videos[safeActiveVideo].embed_url)?.platform === 'youtube'
                  ? `${extractVideoUrl(videos[safeActiveVideo].embed_url)?.url || videos[safeActiveVideo].embed_url}?autoplay=0&modestbranding=1&rel=0`
                  : extractVideoUrl(videos[safeActiveVideo].embed_url)?.url || videos[safeActiveVideo].embed_url)}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videos[safeActiveVideo].title || 'Video'}
              />
            </div>
          ) : (
            <div
              className="w-full aspect-video bg-gray-800 flex items-center justify-center relative cursor-pointer"
              onClick={() => {
                if (safeActiveVideo === 0) {
                  setFirstVideoPlaying(true);
                }
              }}
            >
              {safeActiveVideo === 0 && videos[0] ? (
                <>
                  {(() => {
                    const thumbnailUrl = videos[0].thumbnail
                      ? getImageDisplayUrl(videos[0].thumbnail)
                      : getYouTubeThumbnail(videos[0].embed_url);
                    return thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={videos[0].title || 'Video thumbnail'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <Play size={32} style={{ color: colors.text + '40' }} />
                        <span className="ml-2 text-base" style={{ color: colors.text + '60' }}>{t("Video Preview")}</span>
                      </>
                    );
                  })()
                  }
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.buttonText
                      }}
                    >
                      <Play size={22} fill="currentColor" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Play size={32} style={{ color: colors.text + '40' }} />
                  <span className="ml-2 text-base" style={{ color: colors.text + '60' }}>{t("Video Preview")}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Video title and description */}
        <div
          className="mb-5 rounded-xl px-4 py-3"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <h3
            className="text-base font-bold mb-1"
            style={{
              color: colors.text,
              fontFamily: font
            }}
          >
            {videos[safeActiveVideo]?.title || 'Video Title'}
          </h3>

          {videos[safeActiveVideo]?.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.text + 'B3', fontFamily: font }}
            >
              {videos[safeActiveVideo].description}
            </p>
          )}
        </div>

        {/* Video thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {videos.map((video: any, index: number) => {
            const thumbnailUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url);

            return (
              <button
                key={index}
                type="button"
                className="rounded-xl overflow-hidden cursor-pointer transition-all text-left"
                style={{
                  backgroundColor: safeActiveVideo === index ? colors.primary + '12' : colors.cardBg,
                  border: `1px solid ${safeActiveVideo === index ? colors.primary : colors.borderColor}`,
                  fontFamily: font
                }}
                onClick={() => {
                  setActiveVideo(index);
                  if (index === 0) {
                    setFirstVideoPlaying(false);
                  }
                }}
              >
                <div>
                  {thumbnailUrl ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.buttonText
                          }}
                        >
                          <Play size={14} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="w-full aspect-video rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: colors.background }}
                    >
                      <Play size={20} style={{ color: colors.primary }} />
                    </div>
                  )}

                  <div className="px-3 py-3 min-w-0">
                    {video.title && (
                      <p className="text-sm font-semibold leading-snug mb-1 truncate" style={{ color: colors.text }}>
                        {video.title}
                      </p>
                    )}
                    {video.description && (
                      <p className="text-xs leading-relaxed truncate" style={{ color: colors.text + '80' }}>
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
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
        className="px-5 py-10"
        style={{
          backgroundColor: colors.cardBg
        }}
        id="youtube"
      >
        <div className="flex items-center justify-center mb-6">
          <Youtube className="w-5 h-5 mr-2" style={{ color: '#FF0000' }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("YouTube Channel")}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Latest Video Embed */}
          {youtubeData.latest_video_embed && (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div className="px-4 pt-4 pb-3">
                <h4 className="font-bold text-base flex items-center" style={{ color: colors.text, fontFamily: font }}>
                  <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                  {t("Latest Video")}
                </h4>
              </div>
              <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                <div
                  className="absolute inset-0 w-full h-full"
                  ref={createYouTubeEmbedRef(
                    youtubeData.latest_video_embed,
                    { colors, font },
                    'Latest Music Video'
                  )}
                />
              </div>
            </div>
          )}

          {/* Channel Info */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `inset 0 1px 0 ${colors.primary}12`
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF000020', border: '1px solid rgba(255,0,0,0.22)' }}>
                <Youtube className="w-6 h-6" style={{ color: '#FF0000' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg leading-tight" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Music Channel'}
                </h3>
                {youtubeData.subscriber_count && (
                  <p className="text-sm font-medium mt-1" style={{ color: colors.primary, fontFamily: font }}>
                    {youtubeData.subscriber_count} {t("subscribers")}
                  </p>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'B3', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {youtubeData.channel_url && (
                <Button
                  className="w-full py-3 font-semibold rounded-full"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.buttonText,
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="w-5 h-5 mr-2" />
                  {t("Subscribe")}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button
                  variant="outline"
                  className="w-full py-3 font-semibold rounded-full"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: 'transparent',
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Disc className="w-4 h-4 mr-2" />
                  {t("Music Videos")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const offerings = servicesData.offerings || [];
    if (!Array.isArray(offerings) || offerings.length === 0) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
        id="services"
      >
        <div className="flex items-center justify-center mb-6">
          <Mic size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Services")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {offerings.map((service: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-4"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}14`
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: colors.primary + '18',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  {getServiceIcon(service.icon, 18)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="text-lg font-bold leading-tight"
                      style={{
                        color: colors.text,
                        fontFamily: font
                      }}
                    >
                      {service.name}
                    </h3>

                    {service.price && (
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap flex-shrink-0"
                        style={{
                          color: colors.primary,
                          backgroundColor: colors.primary + '14',
                          border: `1px solid ${colors.primary}28`,
                          fontFamily: font
                        }}
                      >
                        {service.price}
                      </span>
                    )}
                  </div>

                  {service.description && (
                    <p
                      className="text-sm leading-relaxed mt-2"
                      style={{ color: colors.text + 'B3', fontFamily: font }}
                    >
                      {service.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            className="px-6 py-2 rounded-full"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("Inquire About Services")}
          </Button>
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div
      className="px-5 py-10"
      style={{
        backgroundColor: colors.background
      }}
      id="contact"
    >
      <div className="flex items-center justify-center mb-6">
        <Mail size={18} className="mr-2" style={{ color: colors.primary }} />
        <h2
          className="text-lg font-bold tracking-widest"
          style={{
            color: colors.primary,
            fontFamily: font
          }}
        >
          {t("Contact")}
        </h2>
      </div>

      <div className="space-y-4">
        {contactData.booking_email && (
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.primary}30`,
              boxShadow: `inset 0 1px 0 ${colors.primary}14`
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: colors.primary + '18',
                  color: colors.primary,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {t("Booking")}
                </p>
                <a
                  href={`mailto:${contactData.booking_email}`}
                  className="text-sm break-all"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.booking_email}
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {(contactData.email || data.email) && (
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}10`
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: colors.primary + '18',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <Mail size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[13px] font-semibold mb-1"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {t("Email")}
                  </p>
                  <a
                    href={`mailto:${contactData.email || data.email}`}
                    className="text-sm break-all"
                    style={{ color: colors.text, fontFamily: font }}
                  >
                    {contactData.email || data.email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {(contactData.phone || data.phone) && (
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}10`
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: colors.primary + '18',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <Phone size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[13px] font-semibold mb-1"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {t("Phone")}
                  </p>
                  <a
                    href={`tel:${contactData.phone || data.phone}`}
                    className="text-sm"
                    style={{ color: colors.text, fontFamily: font }}
                  >
                    {contactData.phone || data.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {contactData.address && (
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `inset 0 1px 0 ${colors.primary}10`
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: colors.primary + '18',
                  color: colors.primary,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                <MapPin size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {t("Location")}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.address}
                </p>
              </div>
            </div>
          </div>
        )}
        {contactData.website && (
          <div className="p-4 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}`, boxShadow: `inset 0 1px 0 ${colors.primary}10` }}>
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: colors.primary + '18',
                  color: colors.primary,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                <Globe size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold mb-1" style={{ color: colors.primary, fontFamily: font }}>
                  {t("Website Url")}
                </p>
                <p className="text-sm break-all" style={{ color: colors.text, fontFamily: font }}>
                  <a href={contactData.website} target="_blank" rel="noopener noreferrer" className="text-sm cursor-pointer"
                    style={{ color: colors.text, fontFamily: font }}>
                    {contactData.website}
                  </a>
                </p>
              </div>
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
      <div
        className="px-5 py-8"
        style={{
          backgroundColor: colors.cardBg
        }}
        id="social"
      >
        <div className="flex items-center justify-center mb-5">
          <Share2 size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Follow")}
          </h2>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-2 py-3 transition-all cursor-pointer"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}10`
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto"
                style={{
                  backgroundColor: colors.primary + '18',
                  color: colors.primary,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                <SocialIcon platform={link.platform} color="currentColor" />
              </div>

              <div className="text-center min-w-0">
                <p
                  className="text-xs break-words"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderTourDatesSection = (tourData: any) => {
    const events = tourData.events || [];
    if (!Array.isArray(events) || events.length === 0) return null;

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
        id="tour"
      >
        <div className="flex items-center justify-center mb-6">
          <Ticket size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Tour Dates")}
          </h2>
        </div>

        <div className="space-y-4">
          {sortedEvents.map((event: any, index: number) => (
            <div
              key={index}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}12`
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: colors.primary + '18',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`
                  }}
                >
                  <span className="text-[11px] font-bold uppercase leading-none">{formatDate(event.date).split(' ')[0]}</span>
                  <span className="text-xl font-bold leading-none mt-1">{formatDate(event.date).split(' ')[1].replace(',', '')}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-base font-semibold leading-tight"
                        style={{
                          color: colors.text,
                          fontFamily: font
                        }}
                      >
                        {event.venue}
                      </h3>

                      <p
                        className="text-sm mt-1"
                        style={{ color: colors.text + '99', fontFamily: font }}
                      >
                        {event.city}{event.country ? `, ${event.country}` : ''}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {event.sold_out ? (
                        <Badge
                          className="rounded-full px-3 py-1"
                          style={{
                            backgroundColor: '#F44336',
                            color: '#FFFFFF'
                          }}
                        >
                          {t("Sold Out")}
                        </Badge>
                      ) : event.ticket_url ? (
                        <Button
                          size="sm"
                          className="rounded-full px-3 py-1.5 text-xs"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.buttonText,
                            fontFamily: font
                          }}
                          onClick={() => typeof window !== "undefined" && window.open(event.ticket_url, "_blank", "noopener,noreferrer")}
                        >
                          <Ticket size={12} className="mr-1.5" />
                          {t("Tickets")}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        className="px-5 py-8"
        style={{
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center justify-center mb-6">
          <Clock size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Availability")}
          </h2>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
          <div className="space-y-2">
            {hours.map((hour: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2"
                style={{
                  backgroundColor: hour.day === currentDay ? colors.primary + '12' : 'transparent',
                  border: hour.day === currentDay ? `1px solid ${colors.primary}20` : '1px solid transparent',
                  borderBottom: hour.day !== currentDay && index < hours.length - 1 ? `1px solid ${colors.borderColor}` : '1px solid transparent'
                }}
              >
                <span
                  className="capitalize text-sm font-medium"
                  style={{
                    color: hour.day === currentDay ? colors.primary : colors.text,
                    fontWeight: hour.day === currentDay ? 'bold' : 'normal',
                    fontFamily: font
                  }}
                >
                  {t(hour.day)}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: hour.is_closed ? colors.text + '80' : colors.text,
                    fontFamily: font
                  }}
                >
                  {hour.is_closed ? 'Unavailable' : `${hour.open_time} - ${hour.close_time}`}
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
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
        id="gallery"
      >
        <div className="flex items-center justify-center mb-6">
          <ImageIcon size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Gallery")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo: any, index: number) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}10`
              }}
            >
              <div className="relative aspect-square overflow-hidden">
                {photo.image ? (
                  <img
                    src={getImageDisplayUrl(photo.image)}
                    alt={photo.caption || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <Music size={24} style={{ color: colors.text + '40' }} />
                  </div>
                )}
              </div>

              {photo.caption && (
                <div
                  className="px-3 py-2 text-xs leading-relaxed"
                  style={{
                    color: colors.text + 'CC',
                    fontFamily: font
                  }}
                >
                  {photo.caption}
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
        className="px-5 py-10"
        style={{
          backgroundColor: colors.cardBg
        }}
        id="press"
      >
        <div className="flex items-center justify-center mb-6">
          <Star size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Press & Reviews")}
          </h2>
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
                    className="p-5 rounded-xl"
                    style={{
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.borderColor}`,
                      boxShadow: `inset 0 1px 0 ${colors.primary}12`
                    }}
                  >
                    <p
                      className="text-base leading-relaxed mb-5"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>

                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: colors.primary, fontFamily: font }}
                        >
                          {review.reviewer_name}
                        </p>

                        {review.source && (
                          <p
                            className="text-xs mt-1"
                            style={{ color: colors.text + '99', fontFamily: font }}
                          >
                            {review.source}
                          </p>
                        )}
                      </div>

                      {review.source_url && (
                        <a
                          href={review.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center whitespace-nowrap"
                          style={{ color: colors.primary, fontFamily: font }}
                        >
                          {t("Read More")}
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                      )}
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
                  className="w-2.5 h-2.5 rounded-full transition-colors cursor-pointer"
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
    if (!appointmentsData.booking_email && !appointmentsData.booking_url) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
        id="booking"
      >
        <div className="flex items-center justify-center mb-6">
          <Calendar size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Booking")}
          </h2>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}12`
          }}
        >
          {appointmentsData.booking_description && (
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: colors.text + 'B3', fontFamily: font }}
            >
              {appointmentsData.booking_description}
            </p>
          )}

          <div className="space-y-3">
            <Button
              className="w-full rounded-full"
              style={{
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {appointmentsData.booking_text || 'Book Now'}
            </Button>

            {appointmentsData.booking_email && (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <p className="text-sm break-all" style={{ color: colors.text + '99', fontFamily: font }}>
                  {t("Or email us directly at")}{' '}
                  <a
                    href={`mailto:${appointmentsData.booking_email}`}
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {appointmentsData.booking_email}
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderBandMembersSection = (bandData: any) => {
    const members = bandData.members || [];
    if (!Array.isArray(members) || members.length === 0) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.cardBg
        }}
        id="band"
      >
        <div className="flex items-center justify-center mb-6">
          <Users size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("The Band")}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {members.map((member: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-3"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.primary}22`,
                boxShadow: `inset 0 1px 0 ${colors.primary}12`
              }}
            >
                <div className="flex items-start gap-3">
                  {member.image ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ border: `1px solid ${colors.borderColor}` }}>
                      <img
                        src={getImageDisplayUrl(member.image)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: colors.primary + '18',
                        border: `1px solid ${colors.primary}30`
                      }}
                    >
                      <Users size={24} style={{ color: colors.primary }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-base font-semibold leading-tight"
                          style={{
                            color: colors.text,
                            fontFamily: font
                          }}
                        >
                          {member.name}
                        </h3>

                        {member.role && (
                          <p
                            className="text-sm mt-1"
                            style={{ color: colors.primary, fontFamily: font }}
                          >
                            {member.role}
                          </p>
                        )}
                      </div>

                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: colors.primary + '18',
                            color: colors.primary,
                            border: `1px solid ${colors.primary}30`
                          }}
                        >
                          <Instagram size={16} />
                        </a>
                      )}
                    </div>

                    {member.bio && (
                      <p
                        className="text-sm leading-relaxed mt-2"
                        style={{ color: colors.text + 'B3', fontFamily: font }}
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

  const renderMerchandiseSection = (merchData: any) => {
    const items = merchData.items || [];
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
        id="merch"
      >
        <div className="flex items-center justify-center mb-6">
          <ShoppingBag size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Merchandise")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `inset 0 1px 0 ${colors.primary}10`
              }}
            >
              <div className="relative">
                {item.image ? (
                  <img
                    src={getImageDisplayUrl(item.image)}
                    alt={item.name}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div
                    className="w-full aspect-square flex items-center justify-center"
                    style={{ backgroundColor: colors.primary + '18' }}
                  >
                    <ShoppingBag size={32} style={{ color: colors.primary }} />
                  </div>
                )}

                {item.price && (
                  <div
                    className="absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.buttonText,
                      fontFamily: font
                    }}
                  >
                    {item.price}
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="mb-2">
                  <h3
                    className="text-base font-semibold leading-tight"
                    style={{
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {item.name}
                  </h3>
                </div>

                {item.description && (
                  <p
                    className="text-xs leading-relaxed mb-3"
                    style={{ color: colors.text + 'B3', fontFamily: font }}
                  >
                    {item.description}
                  </p>
                )}

                {item.store_url && (
                  <a
                    href={item.store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-semibold"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {t("Buy Now")}
                    <ChevronRight size={12} className="ml-1" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.directions_url) return null;

    return (
      <div
        className="px-5 py-8"
        style={{
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center justify-center mb-6">
          <MapPin size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Location")}
          </h2>
        </div>

        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
          <div className="space-y-3">
          {locationData.map_embed_url && (
            <MusicArtistMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button
              className="w-full rounded-full"
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
          )}
          </div>
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
        <div className="flex items-center justify-center mb-6">
          <Phone size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Mobile App")}
          </h2>
        </div>

        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
          {appData.app_description && (
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: colors.text + 'B3', fontFamily: font }}
            >
              {appData.app_description}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {appData.app_store_url && (
              <Button
                variant="outline"
                className="rounded-full"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: 'transparent',
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
                className="rounded-full"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: 'transparent',
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
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.cardBg
        }}
        id="contact_form"
      >
        <div className="flex items-center justify-center mb-6">
          <Mail size={18} className="mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {formData.form_title}
          </h2>
        </div>

        <div
          className="rounded-xl p-5"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
          {formData.form_description && (
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: colors.text + 'B3', fontFamily: font }}
            >
              {formData.form_description}
            </p>
          )}

          <Button
            className="w-full rounded-full"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t("Send Message")}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;

    return (
      <div
        className="px-5 py-6"
        style={{ backgroundColor: colors.background }}
      >
        <p
          className="text-sm text-center"
          style={{ color: colors.text + '99' }}
        >
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.background
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center justify-center mb-6">
            <h2
              className="text-lg font-bold tracking-widest flex items-center"
              style={{
                color: colors.primary,
                fontFamily: font
              }}
            >
              <Star className="w-5 h-5 mr-2" />
              {customHtmlData.section_title}
            </h2>
          </div>
        )}
        <div
          className="custom-html-content p-5 rounded-xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`,
            fontFamily: font,
            color: colors.text
          }}
        >
          <style>
            {`
              .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
                color: ${colors.primary};
                margin-bottom: 0.75rem;
                font-family: ${font};
                font-weight: bold;
              }
              .custom-html-content p {
                color: ${colors.text};
                margin-bottom: 0.75rem;
                font-family: ${font};
                line-height: 1.6;
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
                background-color: ${colors.accent}40;
                color: ${colors.primary};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-family: 'Monaco', monospace;
                font-weight: bold;
              }
              .custom-html-content .music-achievements {
                display: grid;
                gap: 0.75rem;
              }
              .custom-html-content .music-achievements h4 {
                font-size: 1rem;
                margin-bottom: 0.25rem;
              }
              .custom-html-content .music-achievements p {
                margin-bottom: 0;
                padding: 0.875rem 1rem;
                border-radius: 0.75rem;
                border: 1px solid ${colors.primary}20;
                background: ${colors.primary}10;
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
        className="px-5 py-10"
        style={{
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center justify-center mb-6">
          <Share2 className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
          <h2
            className="text-lg font-bold tracking-widest"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Share the Music")}
          </h2>
        </div>
        <div
          className="text-center p-5 rounded-xl"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
          {qrData.qr_title && (
            <h4 className="font-semibold text-lg mb-2" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}

          {qrData.qr_description && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'B3', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            className="w-full py-3 font-semibold rounded-full"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
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

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer) return null;

    return (
      <div
        className="px-5 py-10"
        style={{
          backgroundColor: colors.cardBg
        }}
      >
        <div
          className="rounded-xl p-5 text-center"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
          {footerData.footer_text && (
            <p
              className="text-sm leading-relaxed mb-5"
              style={{
                color: colors.text + 'B3',
                fontFamily: font
              }}
            >
              {footerData.footer_text}
            </p>
          )}

          {footerData.footer_links && Array.isArray(footerData.footer_links) && footerData.footer_links.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {footerData.footer_links.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-4 py-2 rounded-full transition-colors font-medium"
                  style={{
                    backgroundColor: colors.primary + '14',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}24`,
                    fontFamily: font
                  }}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
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
      <div className="px-5 py-6" style={{ background: `linear-gradient(to bottom, ${colors.background}, ${colors.cardBg})` }}>
        <div
          className="rounded-xl p-4 space-y-3"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `inset 0 1px 0 ${colors.primary}10`
          }}
        >
        {hasContactButton && (
          <Button
            className="w-full h-11 font-semibold rounded-full border transition-all"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              border: `1px solid ${colors.primary}`,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Music className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full h-11 font-semibold rounded-full border transition-all"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: 'transparent',
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
            size="sm"
            variant="outline"
            className="w-full h-11 flex items-center justify-center rounded-full"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: colors.primary + '10',
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

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;

    return (
      <div
        className="px-5 py-4"
        style={{ backgroundColor: colors.secondary + '10' }}
      >
        <p
          className="text-xs text-center"
          style={{ color: colors.text, fontFamily: font }}
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
      className="w-full overflow-hidden"
      style={{
        fontFamily: font,
        background: colors.background,
        color: colors.text,
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
