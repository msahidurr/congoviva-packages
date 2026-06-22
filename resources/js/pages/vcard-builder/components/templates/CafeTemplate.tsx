import { handleAppointmentBooking } from '../VCardPreview';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

import { useTranslation } from 'react-i18next';
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
  Coffee,
  Utensils,
  Star,
  ChevronRight,
  UserPlus,
  ExternalLink,
  Menu,
  Image,
  MessageSquare,
  Video,
  Play,
  Youtube,
  QrCode,
  Plus,
  Share2,
  Smartphone,
  Users,
  Send,
  Link
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface CafeTemplateProps {
  data: any;
  template: any;
}

const CafeMapEmbed = React.memo(function CafeMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function CafeTemplate({ data, template }: CafeTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
      return { ...video, videoData, key: `video-${index}-${video.title || ''}-${video.embed_url || ''}` };
    });
  }, [configSections.videos?.video_list]);

  const colors = configSections.colors || template?.defaultColors || {
    primary: '#6F4E37',
    secondary: '#A67C52',
    accent: '#F5EEE6',
    background: '#FFFFFF',
    text: '#3A3A3A',
    cardBg: '#FFFBF5',
    borderColor: '#E8E0D8',
    buttonText: '#FFFFFF',
    highlightColor: '#C9A66B'
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
  const allSections = getBusinessTemplate('cafe')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'menu_highlights':
        return renderMenuHighlightsSection(sectionData);
      case 'specials':
        return renderSpecialsSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
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
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'footer':
        return renderFooterSection(sectionData);
      case 'action_buttons':
        return renderActionButtonsSection(sectionData);
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative mb-48">
      {/* Cover Image Container */}
      <div className="relative h-64 overflow-hidden">
        {headerData.cover_image ? (
          <img
            src={getImageDisplayUrl(headerData.cover_image)}
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-1000"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
        )}

        {/* Improved Overlay Gradient for visibility */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"
        ></div>

        {/* QR Code Button */}
        <button
          onClick={() => setShowQrModal(true)}
          className="absolute top-5 right-5 p-2 rounded-full backdrop-blur-lg bg-black/20 border border-white/20 text-white shadow-xl transition-all hover:bg-black/40 active:scale-95 z-10"
        >
          <QrCode size={18} />
        </button>
      </div>

      {/* Floating Brand Card - Even more compact fixed height */}
      <div className="absolute top-44 left-4 right-4 z-20">
        <div
          className="relative backdrop-blur-2xl bg-white/85 rounded-[1.75rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/60"
          style={{ fontFamily: font }}
        >
          {/* Subtle decoration background layer */}
          <div className="absolute inset-0 rounded-[1.75rem] overflow-hidden pointer-events-none">
            <div
              className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-5"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Logo container */}
            <div className="relative mb-3 group">
              <div
                className="absolute inset-0 rounded-full blur-md opacity-20 scale-110"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] shadow-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  borderColor: colors.background,
                  backgroundColor: colors.background
                }}
              >
                {headerData.logo ? (
                  <img
                    src={getImageDisplayUrl(headerData.logo)}
                    alt={headerData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Coffee size={32} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
            </div>

            {/* Cafe Info */}
            <h1
              className="text-xl font-extrabold tracking-tight mb-1"
              style={{ color: colors.primary }}
            >
              {headerData.name || data.name || 'Brew & Bean Cafe'}
            </h1>

            {headerData.tagline && (
              <p
                className="text-sm font-medium opacity-70 italic max-w-[85%]"
                style={{ color: colors.text }}
              >
                {headerData.tagline}
              </p>
            )}

            {/* Redesigned Quick Action Bar */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {configSections.contact?.phone && (
                <a
                  href={`tel:${configSections.contact?.phone}`}
                  className="group flex flex-col items-center gap-1"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">{t('Call')}</span>
                </a>
              )}

              {configSections.contact?.address && (
                <a
                  href={configSections.google_map?.directions_url || `https://maps.google.com/?q=${encodeURIComponent(configSections.contact?.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                      color: colors.primary
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">{t('Visit')}</span>
                </a>
              )}

              <button
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
                className="group flex flex-col items-center gap-1"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 cursor-pointer"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary
                  }}
                >
                  <MessageSquare size={18} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">{t('Chat')}</span>
              </button>

              {/* Language Selector */}
              {(configSections?.language && configSections?.language?.enable_language_switcher) && (
                <div className="relative group z-30">
                  <button
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 cursor-pointer"
                      style={{
                        backgroundColor: `${colors.primary}15`,
                        color: colors.primary
                      }}
                    >
                      <span className="text-base">{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [32] as number[]))}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">{t('Lang')}</span>
                  </button>

                  {showLanguageSelector && (
                    <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border py-2 min-w-[180px] max-h-48 overflow-y-auto z-[9999]" style={{ borderColor: `${colors.primary}30` }}>
                      <div className="px-3 py-1 mb-1 text-[10px] font-bold uppercase tracking-widest opacity-40 border-b pb-2 mx-2">{t('Select Language')}</div>
                      {languageData.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`cursor-pointer w-full text-left px-4 py-2.5 text-sm transition-all flex items-center justify-between group/lang ${currentLanguage === lang.code ? 'font-bold' : ''
                            }`}
                          style={{
                            backgroundColor: currentLanguage === lang.code ? `${colors.primary}10` : 'transparent',
                            color: currentLanguage === lang.code ? colors.primary : colors.text
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{String.fromCodePoint(...(lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [32] as number[]))}</span>
                            <span>{lang.name}</span>
                          </div>
                          {currentLanguage === lang.code && <Coffee size={14} className="animate-bounce" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Separator */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-3/4 flex items-center justify-center gap-4 opacity-20">
        <div className="h-[1px] flex-1" style={{ backgroundColor: colors.primary }}></div>
        <Coffee size={14} style={{ color: colors.primary }} />
        <div className="h-[1px] flex-1" style={{ backgroundColor: colors.primary }}></div>
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
        className="px-5 pb-6 pt-16"
        style={{
          backgroundColor: colors.background,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-5">
          <Coffee
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Our Story')}
          </h2>
        </div>

        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: colors.text }}
        >
          {aboutData.description || data.description}
        </p>

        <div className="flex justify-between">
          {aboutData.year_established && (
            <div className="text-center">
              <p
                className="text-xs"
                style={{ color: colors.text + '80' }}
              >
                {t('ESTABLISHED')}
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: colors.primary }}
              >
                {aboutData.year_established}
              </p>
            </div>
          )}

          {aboutData.atmosphere && (
            <div className="text-center">
              <p
                className="text-xs"
                style={{ color: colors.text + '80' }}
              >
                {t('ATMOSPHERE')}
              </p>
              <p
                className="text-sm capitalize"
                style={{ color: colors.primary }}
              >
                {aboutData.atmosphere.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMenuHighlightsSection = (menuData: any) => {
    const items = menuData.items || [];
    const categories = menuData.categories || [];
    if (!Array.isArray(items) || items.length === 0) return null;

    // Get categories from data or fallback to unique item categories
    const categoryOptions = categories.length > 0
      ? ['all', ...categories.map((cat: any) => cat.value)]
      : ['all', ...new Set(items.map((item: any) => item.category))];

    const getCategoryLabel = (value: string) => {
      if (value === 'all') return 'all';
      const category = categories.find((cat: any) => cat.value === value);
      return category ? category.label : value;
    };

    // Filter items by active category
    const filteredItems = activeCategory === 'all'
      ? items
      : items.filter((item: any) => item.category === activeCategory);

    const getDietaryBadge = (dietary: string) => {
      if (dietary === 'none' || !dietary) return null;

      const dietaryLabels: Record<string, { bg: string, text: string, label: string }> = {
        'vegetarian': { bg: '#E8F5E9', text: '#2E7D32', label: 'V' },
        'vegan': { bg: '#E8F5E9', text: '#1B5E20', label: 'VG' },
        'gluten_free': { bg: '#FFF8E1', text: '#F57F17', label: 'GF' },
        'dairy_free': { bg: '#E1F5FE', text: '#0277BD', label: 'DF' },
        'nut_free': { bg: '#F3E5F5', text: '#7B1FA2', label: 'NF' }
      };

      const style = dietaryLabels[dietary] || { bg: '#F5F5F5', text: '#757575', label: dietary.slice(0, 2).toUpperCase() };

      return (
        <span
          className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 ml-2 rounded-full text-xs font-medium leading-none"
          style={{
            backgroundColor: style.bg,
            color: style.text,
            fontSize: '10px'
          }}
          title={dietary.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        >
          {style.label}
        </span>
      );
    };

    return (
      <div
        className="px-4 py-6"
        style={{
          backgroundColor: '#F8F2E8',
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Utensils
              size={18}
              className="mr-2"
              style={{ color: colors.primary }}
            />
            <h2
              className="text-lg font-semibold"
              style={{
                color: colors.primary,
                fontFamily: font
              }}
            >
              {t('Menu Highlights')}
            </h2>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7"
            style={{
              borderColor: colors.primary,
              color: colors.primary
            }}
            onClick={() => typeof window !== "undefined" && window.open(configSections.contact?.website, "_blank", "noopener,noreferrer")}
          >
            {t('Full Menu')}
            <ExternalLink size={12} className="ml-1" />
          </Button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryOptions.map((category: string) => (
            <button
              key={category}
              className={`group relative cursor-pointer text-sm py-1.5 px-4 capitalize transition-all duration-300 rounded-full active:scale-95`}
              style={{
                backgroundColor: activeCategory === category ? colors.primary : colors.background,
                color: activeCategory === category ? '#FFFFFF' : colors.text,
                border: `1px solid ${activeCategory === category || hoveredCategory === category ? colors.borderColor : 'transparent'}`,
                boxShadow: activeCategory === category ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(current => (current === category ? null : current))}
              onClick={() => setActiveCategory(category)}
            >
              <span className="relative z-10">{getCategoryLabel(category).replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        {/* Separator Line */}
        <div className="h-[1px] w-full mb-6 opacity-10" style={{ backgroundColor: colors.primary }}></div>

        {/* Menu items */}
        <div className="space-y-4">
          {filteredItems.map((item: any, index: number) => (
            <div
              key={index}
              className="w-full p-4 rounded-2xl"
              style={{
                backgroundColor: `${colors.background}`,
                border: '1px solid #E7D7C3',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
              }}
            >
              <div className="flex">
                {/* Item Image */}
                {item.image && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden mr-4 flex-shrink-0 border shadow-sm">
                    <img
                      src={getImageDisplayUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        // Hide image if it fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Item Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center flex-wrap gap-1">
                      <h3
                        className="text-base"
                        style={{
                          color: colors.primary,
                          fontFamily: font
                        }}
                      >
                        {item.name}
                      </h3>
                      {getDietaryBadge(item.dietary_info)}
                    </div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {item.price}
                    </span>
                  </div>

                  {item.description && (
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      {item.description}
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

  const renderSpecialsSection = (specialsData: any) => {
    const specials = specialsData.daily_specials || [];
    if (!Array.isArray(specials) || specials.length === 0) return null;

    // Get current day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];

    // Sort specials to put current day first
    const sortedSpecials = [...specials].sort((a, b) => {
      if (a.day === currentDay) return -1;
      if (b.day === currentDay) return 1;
      return 0;
    });

    return (
      <div
        className="px-4 py-6"
        style={{
          // backgroundColor: '#F8F2E8',
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-6">
          <Star
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Daily Specials')}
          </h2>
        </div>

        <div className="space-y-4">
          {sortedSpecials.map((special: any, index: number) => {
            const isToday = special.day === currentDay;
            return (
              <div
                key={index}
                className="w-full p-4 rounded-2xl text-left"
                style={{
                  backgroundColor: '#FFFDF9',
                  border: '1px solid #E7D7C3',
                  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div className="flex justify-between items-start gap-3 mb-0.5">
                  <h3 className="text-base font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                    {special.special_name}
                  </h3>
                  <span className="text-sm font-medium" style={{ color: colors.primary }}>
                    {special.price}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs capitalize" style={{ color: `${colors.text}99` }}>
                    {special.day}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>

                {special.description && (
                  <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                    {special.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div
      className="px-4 py-6"
      style={{
        backgroundColor: '#f7f4ee',
        borderTop: `1px solid ${colors.borderColor}`,
        borderBottom: `8px solid ${colors.accent}`
      }}
    >
      <div className="flex items-center mb-6">
        <MapPin
          size={18}
          className="mr-2"
          style={{ color: colors.primary }}
        />
        <h2
          className="text-lg font-semibold"
          style={{
            color: colors.primary,
            fontFamily: font
          }}
        >
          {t('Find Us')}
        </h2>
      </div>

      <div className="space-y-3">
        {contactData.address && (
          <div
            className="p-4 rounded-2xl"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E7D7C3',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
            }}
          >
            <p
              className="text-sm uppercase"
              style={{ color: `${colors.text}80` }}
            >
              {t('Address')}
            </p>
            <p
              className="text-sm leading-relaxed mt-1"
              style={{ color: colors.primary, fontFamily: font }}
            >
              {contactData.address}
            </p>
            {configSections.google_map?.directions_url && (
              <button
                onClick={() => typeof window !== "undefined" && window.open(configSections.google_map?.directions_url, '_blank', 'noopener,noreferrer')}
                className="mt-3 text-sm font-semibold inline-flex items-center gap-1"
                style={{ color: colors.primary, fontFamily: font }}
              >
                {t('Get Directions')}
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {(contactData.phone || data.phone) && (
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E7D7C3',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
              }}
            >
              <p
                className="text-sm uppercase"
                style={{ color: `${colors.text}80` }}
              >
                {t('Phone')}
              </p>
              <a
                href={`tel:${contactData.phone || data.phone}`}
                className="text-sm block mt-1"
                style={{ color: colors.primary, fontFamily: font }}
              >
                {contactData.phone || data.phone}
              </a>
            </div>
          )}

          {(contactData.email || data.email) && (
            <div
              className="p-4 rounded-2xl"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #E7D7C3',
                boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
              }}
            >
              <p
                className="text-sm uppercase"
                style={{ color: `${colors.text}80` }}
              >
                {t('Email')}
              </p>
              <a
                href={`mailto:${contactData.email || data.email}`}
                className="text-sm break-words block mt-1"
                style={{ color: colors.primary, fontFamily: font }}
              >
                {contactData.email || data.email}
              </a>
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
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-md group"
              style={{
                backgroundColor: colors.primary,
                color: '#FFFFFF',
                boxShadow: `0 4px 12px ${colors.primary}40`
              }}
            >
              <SocialIcon platform={link.platform} color="#FFFFFF" />
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

    // Find current day's hours
    const todayHours = hours.find(h => h.day === currentDay);
    const isOpenNow = todayHours && !todayHours.is_closed;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Clock
              size={18}
              className="mr-2"
              style={{ color: colors.primary }}
            />
            <h2
              className="text-lg font-semibold"
              style={{
                color: colors.primary,
                fontFamily: font
              }}
            >
              {t('Hours')}
            </h2>
          </div>

          {isOpenNow ? (
            <div
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
              style={{
                backgroundColor: colors.primary + '10',
                color: colors.primary ,
                border: '1px solid'
              }}
            >
              {t('Open Now')}
            </div>
          ) : (
            <div
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
              style={{
                backgroundColor: colors.secondary + '20',
                color: colors.secondary,
                border: '1px solid'
              }}
            >
              {t('Closed Now')}
            </div>
          )}
        </div>

        <div
          className="p-2 rounded-xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="space-y-1">
            {hours.map((hour: any, index: number) => {
              const isToday = hour.day === currentDay;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: isToday ? colors.primary + '10' : 'transparent',
                    border: isToday ? `1px solid ${colors.primary}20` : '1px solid transparent'
                  }}
                >
                  <span
                    className="capitalize text-sm font-medium"
                    style={{
                      color: isToday ? colors.primary : colors.text,
                      fontWeight: isToday ? 'bold' : '500'
                    }}
                  >
                    {t(hour.day)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm"
                      style={{
                        color: hour.is_closed ? colors.text + '80' : colors.text,
                        fontWeight: isToday ? '600' : 'normal'
                      }}
                    >
                      {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                    </span>
                  </div>
                </div>
              );
            })}
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
        className="px-5 py-5"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-3">
          <Image
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Photo Gallery')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo: any, index: number) => (
            <div
              key={index}
              className="group flex flex-col transition-all duration-300 h-full"
              style={{
                backgroundColor: colors.background,
                borderRadius: '1rem',
                border: `1px solid ${colors.borderColor}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                overflow: 'hidden'
              }}
            >
              <div className="aspect-square relative overflow-hidden shrink-0">
                {photo.image ? (
                  <img
                    src={getImageDisplayUrl(photo.image)}
                    alt={photo.caption || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Coffee size={24} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>

              <div
                className="p-2.5 py-2 flex-grow flex flex-col justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
              >
                {photo.caption && (
                  <p
                    className="text-[11px] font-medium text-white leading-tight"
                    style={{
                      fontFamily: font
                    }}
                  >
                    {photo.caption}
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

    if (!videoContent || videoContent.length === 0) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-4">
          <Video
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Cafe Videos')}
          </h2>
        </div>

        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div
              key={video.key}
              className="group relative rounded-2xl overflow-hidden shadow-md"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div className="relative h-45">
                {(() => {
                  const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
                  const thumbUrl = video.thumbnail
                    ? getImageDisplayUrl(video.thumbnail)
                    : getYouTubeThumbnail(video.embed_url || '');
                  return playingKey === video.key && videoUrl ? (
                    <div className="w-full h-full">
                      <iframe
                        src={`${videoUrl}?autoplay=1&modestbranding=1&rel=0`}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title || 'Video'}
                      />
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-full cursor-pointer"
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Video className="w-8 h-8 opacity-10" style={{ color: colors.primary }} />
                        </div>
                      )}

                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/30 border border-white/20 transition-transform group-hover:scale-110">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-lg" style={{ color: colors.primary }}>
                              <Play className="w-4 h-4 ml-0.5 fill-current" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black/50 to-transparent pointer-events-none text-left">
                        <h3 className="text-white font-bold text-xs drop-shadow-sm">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="p-4 text-left">
                {video.description && (
                  <p className="text-sm opacity-70 mb-5 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="flex items-center gap-4 pt-1">
                  {video.duration && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed text-xs"
                      style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}>
                      <Clock size={14} />
                      {video.duration}
                    </div>
                  )}
                  {video.video_type && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs shadow-sm"
                      style={{ backgroundColor: `${colors.primary}15`, color: colors.primary, fontFamily: font }}>
                      <Coffee size={14} />
                      <span className="capitalize">{video.video_type.replace('_', ' ')}</span>
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

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-4">
          <Youtube
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('YouTube Channel')}
          </h2>
        </div>

        {youtubeData.latest_video_embed && (
          <div className="mb-6 rounded-2xl overflow-hidden border" style={{ borderColor: colors.borderColor }}>
            <div className="aspect-video relative bg-muted">
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(
                  youtubeData.latest_video_embed,
                  { colors, font },
                  "Latest Video"
                )}
              />
            </div>
            <div className="p-3 bg-muted/20">
              <p className="text-xs font-semibold opacity-60" style={{ color: colors.text }}>{t("Latest Video")}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-center px-2">
            <h3 className="text-lg font-bold mb-1" style={{ color: colors.text, fontFamily: font }}>
              {youtubeData.channel_name || t('Our Cafe')}
            </h3>
            {youtubeData.subscriber_count && (
              <p className="text-xs opacity-60 mb-2" style={{ color: colors.text, fontFamily: font }}>
                📊 {youtubeData.subscriber_count} {t("subscribers")}
              </p>
            )}
            {youtubeData.channel_description && (
              <p className="text-sm opacity-70 leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}
          </div>

          <div className="space-y-2 mt-4 px-2">
            {youtubeData.channel_url && (
              <Button
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
                variant="outline"
                className="w-full"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                ☕ {t("COFFEE TUTORIALS")}
              </Button>
            )}
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
        className="px-5 py-4"
        style={{
          backgroundColor: colors.background,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-2">
          <Star
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Customer Reviews')}
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-8 text-center">
                  <div className="py-2">
                    <div className="flex justify-center items-center space-x-1 mb-2 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={i < parseInt(review.rating || 5) ? colors.highlightColor : 'transparent'}
                          stroke={i < parseInt(review.rating || 5) ? colors.highlightColor : colors.borderColor}
                        />
                      ))}
                    </div>

                    <p
                      className="text-sm mb-3 italic leading-relaxed"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>

                    <p
                      className="text-sm font-bold tracking-tight"
                      style={{
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      — { review.customer_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-2 space-x-2">
              {reviews.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: dotIndex === currentReview % Math.max(1, reviews.length) ? colors.primary : colors.primary + '30',
                    width: dotIndex === currentReview % Math.max(1, reviews.length) ? '20px' : '6px'
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
          backgroundColor: colors.cardBg,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-4">
          <Calendar
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Reservations')}
          </h2>
        </div>

        <div className="py-2 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4 opacity-20">
            <Coffee size={32} style={{ color: colors.primary }} />
            <Utensils size={32} style={{ color: colors.primary }} />
          </div>

          <p
            className="text-sm mb-5 leading-relaxed mx-auto"
            style={{ color: colors.text, fontFamily: font }}
          >
            {appointmentsData.min_party_size && appointmentsData.max_party_size ? (
              `We accept reservations for parties of ${appointmentsData.min_party_size}-${appointmentsData.max_party_size} people.`
            ) : (
              'Reserve your table to avoid waiting.'
            )}
          </p>

          <Button
            className="px-8 py-2.5 h-auto rounded-xl mx-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font,
              boxShadow: `0 4px 12px ${colors.primary}30`
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {appointmentsData.reservation_text || 'Reserve a Table'}
          </Button>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div
        className="px-5 py-4 text-center"
        style={{
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-3">
          <MapPin
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Location')}
          </h2>
        </div>

        <div className="space-y-1">
          {locationData.map_embed_url && (
            <CafeMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <div className="mt-2 flex justify-center">
              <Button
                className="px-6 h-10 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.buttonText,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
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
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-4">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
            style={{ color: colors.primary }}
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t('Mobile App')}
          </h2>
        </div>

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
        className="px-5 py-4 text-center"
        style={{
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-4">
          <Mail
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {formData.form_title}
          </h2>
        </div>

        {formData.form_description && (
          <p
            className="text-sm mb-4"
            style={{ color: colors.text }}
          >
            {formData.form_description}
          </p>
        )}

        <Button
          className="px-8 py-2 h-auto rounded-xl mx-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
          style={{
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font,
            boxShadow: `0 4px 12px ${colors.primary}30`
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Send Message')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;

    return (
      <div
        className="px-5 py-4"
        style={{ backgroundColor: colors.cardBg }}
      >
        <p
          className="text-xs text-center"
          style={{ color: colors.text + '80' }}
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center mb-4">
            <Coffee
              size={18}
              className="mr-2"
              style={{ color: colors.primary }}
            />
            <h2
              className="text-lg font-semibold"
              style={{
                color: colors.primary,
                fontFamily: font
              }}
            >
              {customHtmlData.section_title}
            </h2>
          </div>
        )}
        <div
          className="custom-html-content p-3 rounded-lg"
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
                color: ${colors.highlightColor};
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
      <div className="px-5 py-3" style={{ borderBottom: `8px solid ${colors.accent}` }}>
        <div className="w-full">
          {actionButtonsData.contact_button_text && (
            <div className="mb-2">
              <Button
                className="w-full h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 shadow-md font-bold"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontFamily: font,
                  boxShadow: `0 4px 12px ${colors.primary}30`
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                {actionButtonsData.contact_button_text}
              </Button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {actionButtonsData.appointment_button_text && (
              <Button
                className={`h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 shadow-sm text-sm ${!actionButtonsData.save_contact_button_text ? 'col-span-2' : ''}`}
                variant="outline"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: font,
                  backgroundColor: colors.primary + '05'
                }}
                onClick={() => handleAppointmentBooking(configSections.appointments)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {actionButtonsData.appointment_button_text}
              </Button>
            )}

            {actionButtonsData.save_contact_button_text && (
              <Button
                className={`h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 shadow-sm text-sm ${!actionButtonsData.appointment_button_text ? 'col-span-2' : ''}`}
                variant="outline"
                style={{
                  borderColor: colors.secondary,
                  color: colors.secondary,
                  fontFamily: font,
                  backgroundColor: colors.secondary + '05'
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
                <UserPlus className="w-4 h-4 mr-2" />
                {actionButtonsData.save_contact_button_text}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div
        className="px-5 py-3 text-center"
        style={{
          borderBottom: `8px solid ${colors.accent}`
        }}
      >
        <div className="flex items-center mb-4">
          <QrCode
            size={18}
            className="mr-2"
            style={{ color: colors.primary }}
          />
          <h2
            className="text-lg font-semibold"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {qrData.qr_title || t('Share QR Code')}
          </h2>
        </div>

        <div className="text-center py-1">
          {qrData.qr_description && (
            <p
              className="text-sm mb-4 leading-relaxed mx-auto max-w-[280px]"
              style={{ color: colors.text, opacity: 0.8 }}
            >
              {qrData.qr_description}
            </p>
          )}

          <Button
            className="px-8 py-2.5 h-10 rounded-xl mx-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font,
              boxShadow: `0 4px 12px ${colors.primary}30`
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
                className="text-xs px-3 py-1 rounded-full transition-colors"
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
          style={{ color: '#FFFFFF' }}
        >
          {copyrightData.text}
        </p>
      </div>
    );
  };

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  // Create a style object that will be applied to all text elements
  const globalStyle = {
    fontFamily: font
  };

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
