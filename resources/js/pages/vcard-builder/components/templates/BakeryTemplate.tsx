import { handleAppointmentBooking } from '../VCardPreview';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
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
  Image,
  MessageSquare,
  Cake,
  Utensils,
  ShoppingBag,
  Users,
  Video,
  Play,
  Youtube,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionData } from '@/utils/sectionHelpers';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface BakeryTemplateProps {
  data: any;
  template: any;
}

const BakeryMapEmbed = React.memo(function BakeryMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function BakeryTemplate({ data, template }: BakeryTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const colors = configSections.colors || template?.defaultColors || {
    primary: '#D35400',
    secondary: '#E67E22',
    accent: '#FFF3E0',
    background: '#FFFFFF',
    text: '#3A3A3A',
    cardBg: '#FFFBF5',
    borderColor: '#F5E0C8',
    buttonText: '#FFFFFF',
    highlightColor: '#FFB74D'
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
  const allSections = getBusinessTemplate('bakery')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'featured_products':
        return renderFeaturedProductsSection(sectionData);
      case 'daily_specials':
        return renderDailySpecialsSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
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
      case 'catering':
        return renderCateringSection(sectionData);
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
      {/* Cover Image with Pattern Overlay */}
      <div className="relative h-56 overflow-hidden rounded-t-2xl">
        {headerData.cover_image ? (
          <img
            src={getImageDisplayUrl(headerData.cover_image)}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div
            className="w-full h-full relative"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}40 0%, ${colors.secondary}40 100%)`,
            }}
          >
            {/* Bakery pattern overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${colors.primary.replace('#', '')}' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        )}

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        ></div>
      </div>

      {/* Logo and Name Container */}
      <div className="relative px-5 pt-6 pb-4 text-center">
        {/* Logo */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg flex items-center justify-center"
            style={{
              borderColor: colors.background,
              backgroundColor: headerData.logo ? colors.background : colors.primary
            }}
          >
            {headerData.logo ? (
              <img
                src={getImageDisplayUrl(headerData.logo)}
                alt={headerData.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <Cake size={40} style={{ color: '#ffffff' }} />
            )}
          </div>
        </div>

        {/* Bakery Name and Tagline */}
        <div className="mt-12">
          <h1
            className="text-2xl font-bold mb-1"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {headerData.name || data.name || 'Sweet Crumb Bakery'}
          </h1>

          {headerData.tagline && (
            <p
              className="text-sm italic"
              style={{ color: colors.text }}
            >
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div
        className="px-5 pb-4 flex justify-center space-x-3"
        style={{ backgroundColor: colors.background }}
      >
        {configSections.contact?.phone && (
          <a
            href={`tel:${configSections.contact?.phone}`}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{
              backgroundColor: colors.primary,
              color:"#ffffff"
            }}
          >
            <Phone size={16} />
          </a>
        )}

        {configSections.contact?.address && (
          <a
            href={configSections.google_map?.directions_url || `https://maps.google.com/?q=${encodeURIComponent(configSections.contact?.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{
              backgroundColor: colors.primary,
              color:"#ffffff"
            }}
          >
            <MapPin size={16} />
          </a>
        )}

        <button
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
          style={{
            backgroundColor: colors.primary,
            color:"#ffffff"
          }}
        >
          <MessageSquare size={16} />
        </button>

        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="relative  z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                border: `1px solid ${colors.primary}`,
                color:"#ffffff"
              }}
            >
              <Globe size={16} />
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
        )}
      </div>

      {/* Decorative Divider */}
      <div className="relative h-4 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: colors.accent }}
        ></div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: colors.primary + '40' }}
        ></div>
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
            <Cake
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
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

          {aboutData.specialties && (
            <div className="text-center">
              <p
                className="text-xs"
                style={{ color: colors.text + '80' }}
              >
                {t('SPECIALTIES')}
              </p>
              <p
                className="text-sm capitalize"
                style={{ color: colors.primary }}
              >
                {aboutData.specialties.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFeaturedProductsSection = (productsData: any) => {
    const products = productsData.products || [];
    const categories = productsData.categories || [];
    if (!Array.isArray(products) || products.length === 0) return null;

    // Get categories from data or fallback to unique product categories
    const categoryOptions = categories.length > 0
      ? ['all', ...categories.map((cat: any) => cat.value)]
      : ['all', ...new Set(products.map((item: any) => item.category))];

    const getCategoryLabel = (value: string) => {
      if (value === 'all') return 'all';
      const category = categories.find((cat: any) => cat.value === value);
      return category ? category.label : value;
    };

    // Filter items by active category
    const filteredProducts = activeCategory === 'all'
      ? products
      : products.filter((item: any) => item.category === activeCategory);

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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between">
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
                {t('Featured Products')}
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categoryOptions.map((category: string) => (
            <button
              key={category}
              className="text-xs py-1 px-3 capitalize rounded-full cursor-pointer"
              style={{
                backgroundColor: activeCategory === category ? colors.primary : colors.background,
                color: activeCategory === category ? '#FFFFFF' : colors.text,
                border: `1px solid ${activeCategory === category ? colors.primary : colors.borderColor}`
              }}
              onClick={() => setActiveCategory(category)}
            >
              {getCategoryLabel(category).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Product items */}
        <div className="space-y-4">
          {filteredProducts.map((product: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-3"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 8px 20px ${colors.primary}10`
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0"
                  style={{
                    backgroundColor: colors.accent,
                    border: `1px solid ${colors.borderColor}`
                  }}
                >
                  {product.image ? (
                    <img
                      src={getImageDisplayUrl(product.image)}
                      alt={product.name || 'Product'}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Cake size={24} style={{ color: colors.primary }} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        {product.category && product.category !== 'all' && (
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em]"
                            style={{
                              backgroundColor: colors.accent,
                              color: colors.primary
                            }}
                          >
                            {getCategoryLabel(product.category).replace('_', ' ')}
                          </span>
                        )}
                        {getDietaryBadge(product.dietary_info)}
                      </div>

                      <h3
                        className="text-[15px] font-semibold leading-5"
                        style={{
                          color: colors.primary,
                          fontFamily: font
                        }}
                      >
                        {product.name}
                      </h3>
                    </div>

                    {product.price && (
                      <span
                        className="text-sm font-bold whitespace-nowrap"
                        style={{
                          color: colors.primary
                        }}
                      >
                        {product.price}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p
                      className="text-xs leading-5 mt-2"
                      style={{ color: colors.text + 'B3' }}
                    >
                      {product.description}
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

  const renderDailySpecialsSection = (specialsData: any) => {
    const specials = specialsData.specials || [];
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedSpecials.map((special: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-4"
              style={{
                backgroundColor: special.day === currentDay ? colors.accent : colors.background,
                border: `2px solid ${special.day === currentDay ? colors.primary + '55' : colors.borderColor}`,
                boxShadow: `0 4px 14px ${colors.primary}10`
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <p
                      className="text-xs font-medium capitalize"
                      style={{ color: colors.text + '99' }}
                    >
                      {t(special.day)}
                    </p>
                    {special.day === currentDay && (
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor: colors.primary,
                          color: '#FFFFFF'
                        }}
                      >
                        {t('Today')}
                      </Badge>
                    )}
                  </div>

                  <h3
                    className="text-base font-medium mt-2"
                    style={{
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {special.special_name}
                  </h3>

                  {special.description && (
                    <p
                      className="text-xs leading-5 mt-2"
                      style={{ color: colors.text + 'BF' }}
                    >
                      {special.description}
                    </p>
                  )}
                </div>

                {special.price && (
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap self-start"
                    style={{
                      backgroundColor: special.day === currentDay ? colors.primary : colors.cardBg,
                      color: special.day === currentDay ? '#FFFFFF' : colors.primary,
                      border: `1px solid ${special.day === currentDay ? colors.primary : colors.borderColor}`
                    }}
                  >
                    {special.price}
                  </span>
                )}
              </div>
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
      }}
    >
      <div className="mb-4">
        <div className="flex items-center">
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
        <div className="mt-2 relative h-3">
          <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
          <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
          <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
            <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
              <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {contactData.address && (
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderColor}`
            }}
          >
            <p
              className="text-xs"
              style={{ color: colors.text + '80' }}
            >
              {t('ADDRESS')}
            </p>
            <p
              className="text-sm"
              style={{ color: colors.text }}
            >
              {contactData.address}
            </p>

            {configSections.google_map?.directions_url && (
              <a
                href={configSections.google_map?.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center mt-2"
                style={{ color: colors.primary }}
              >
                {t('Get Directions')}
                <ChevronRight size={12} />
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-2">
          {(contactData.phone || data.phone) && (
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <p
                className="text-xs"
                style={{ color: colors.text + '80' }}
              >
                {t('PHONE')}
              </p>
              <a
                href={`tel:${contactData.phone || data.phone}`}
                className="text-sm"
                style={{ color: colors.primary }}
              >
                {contactData.phone || data.phone}
              </a>
            </div>
          )}

          {(contactData.email || data.email) && (
            <div
              className="p-3 rounded-lg"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <p
                className="text-xs"
                style={{ color: colors.text + '80' }}
              >
                {t('EMAIL')}
              </p>
              <a
                href={`mailto:${contactData.email || data.email}`}
                className="text-sm break-words block"
                style={{ color: colors.primary }}
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
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.buttonText
              }}
            >
              <SocialIcon platform={link.platform} color="#ffffff" />
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
        }}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between">
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
              <Badge
                style={{
                  backgroundColor: colors.primary,
                  color: '#FFFFFF'
                }}
              >
                {t('Open Now')}
              </Badge>
            ) : (
              <Badge
                style={{
                  backgroundColor: '#F44336',
                  color: '#FFFFFF'
                }}
              >
                {t('Closed Now')}
              </Badge>
            )}
          </div>
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="space-y-2">
            {hours.map((hour: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center py-1"
                style={{
                  borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
                }}
              >
                <span
                  className="capitalize text-sm font-medium"
                  style={{
                    color: hour.day === currentDay ? colors.primary : colors.text,
                    fontWeight: hour.day === currentDay ? 'bold' : 'normal'
                  }}
                >
                  {t(hour.day)}
                </span>
                <span
                  className="text-sm"
                  style={{
                    color: hour.is_closed ? colors.text + '80' : colors.text
                  }}
                >
                  {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                </span>
              </div>
            ))}
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

    if (!videoContent || videoContent.length === 0) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
              {t('Baking Videos')}
            </h2>
          </div>
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {videoContent.map((video: any) => (
            <div
              key={video.key}
              className="rounded-2xl p-3"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 24px ${colors.primary}10`
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-xl">
                  {(() => {
                    const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
                    const thumbUrl = video.thumbnail
                      ? getImageDisplayUrl(video.thumbnail)
                      : getYouTubeThumbnail(video.embed_url || '');
                    return playingKey === video.key && videoUrl ? (
                      <div className="w-full relative overflow-hidden rounded-xl" style={{ paddingBottom: '56.25%', height: 0 }}>
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
                        className="relative w-full h-48 sm:h-52 cursor-pointer"
                        onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                      >
                        {thumbUrl ? (
                          <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent})` }}>
                            <Video className="w-8 h-8" style={{ color: colors.primary }} />
                          </div>
                        )}
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0.12))' }}
                        />
                        {video.video_type && (
                          <span
                            className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.08em] rounded-full px-2.5 py-1"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.92)',
                              color: colors.primary
                            }}
                          >
                            {video.video_type.replace(/_/g, ' ')}
                          </span>
                        )}
                        {videoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.94)',
                                boxShadow: '0 10px 24px rgba(0,0,0,0.18)'
                              }}
                            >
                              <Play className="w-6 h-6 ml-1" style={{ color: colors.primary }} />
                            </div>
                          </div>
                        )}
                        {video.duration && (
                          <span
                            className="absolute right-3 bottom-3 text-[11px] font-medium rounded-full px-2.5 py-1"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.92)',
                              color: colors.text,
                              fontFamily: font
                            }}
                          >
                            {video.duration}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="px-1 pb-1">
                  <h4 className="font-semibold text-sm mb-1.5" style={{ color: colors.primary, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-sm leading-5" style={{ color: colors.text + 'BF', fontFamily: font }}>
                      {video.description}
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

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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

          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 10px 24px ${colors.primary}10`
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FF0000, #FF5A36)',
                  boxShadow: '0 8px 20px rgba(255, 0, 0, 0.22)'
                }}
              >
                <Youtube className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                      {youtubeData.channel_name || 'Bakery Channel'}
                    </h4>
                    {youtubeData.subscriber_count && (
                      <p className="text-xs mt-1" style={{ color: colors.text + 'B3', fontFamily: font }}>
                        {youtubeData.subscriber_count} {t("subscribers")}
                      </p>
                    )}
                  </div>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap"
                    style={{
                      backgroundColor: colors.primary + '14',
                      color: colors.primary
                    }}
                  >
                    YouTube
                  </span>
                </div>

                {youtubeData.channel_description && (
                  <p className="text-xs leading-5 mt-3" style={{ color: colors.text + 'BF', fontFamily: font }}>
                    {youtubeData.channel_description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {youtubeData.channel_url && (
                <Button
                  className="w-full rounded-xl"
                  style={{
                    backgroundColor: colors.primary,
                    color: 'white',
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  {t("Subscribe")}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    fontFamily: font,
                    backgroundColor: colors.background
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t("View Playlist")}
                </Button>
              )}
            </div>
          </div>

          {youtubeData.latest_video_embed && (
            <div
              className="rounded-2xl p-3"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 24px ${colors.primary}10`
              }}
            >
              <div className="flex items-center justify-between gap-3 px-1 pb-3">
                <div>
                  <h4 className="font-semibold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                    {t("Latest Video")}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: colors.text + 'B3', fontFamily: font }}>
                    {t("Watch our newest baking content")}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.accent, color: colors.primary }}
                >
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
              </div>

              <div className="w-full relative overflow-hidden rounded-xl" style={{ paddingBottom: "56.25%", height: 0 }}>
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
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo: any, index: number) => (
            <div
              key={index}
              className="overflow-hidden p-1"
              style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 24px ${colors.primary}10`
              }}
            >
              <div className="overflow-hidden aspect-square">
                {photo.image ? (
                  <img
                    src={getImageDisplayUrl(photo.image)}
                    alt={photo.caption || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Cake size={24} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>

              {photo.caption && (
                <div className="px-3 py-3">
                  <p
                    className="text-xs leading-5"
                    style={{
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {photo.caption}
                  </p>
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
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
                    className="rounded-xl p-3"
                    style={{
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          color: colors.primary
                        }}
                      >
                        <MessageSquare size={15} />
                      </div>

                      <div className="flex items-center gap-1 flex-wrap justify-end">
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

                    <p
                      className="text-sm leading-5 mb-3"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>

                    <div
                      className="pt-2"
                      style={{ borderTop: `1px solid ${colors.borderColor}` }}
                    >
                      <p
                        className="text-xs font-medium"
                        style={{ color: colors.primary, fontFamily: font }}
                      >
                        {review.customer_name}
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
          backgroundColor: colors.cardBg,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
            <ShoppingBag
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
              {t('Order & Pickup')}
            </h2>
          </div>
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg text-center"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <p
            className="text-sm mb-3"
            style={{ color: colors.text }}
          >
            {appointmentsData.min_notice_hours ? (
              `Please place orders at least ${appointmentsData.min_notice_hours} hours in advance.`
            ) : (
              'Order online for convenient pickup at our bakery.'
            )}
          </p>

          {appointmentsData.special_orders_info && (
            <p
              className="text-xs mb-3 italic"
              style={{ color: colors.text + 'CC' }}
            >
              {appointmentsData.special_orders_info}
            </p>
          )}

          <Button
            className="w-full"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {appointmentsData.reservation_text || 'Order Online'}
          </Button>
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
          backgroundColor: colors.background,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {locationData.map_embed_url && (
            <BakeryMapEmbed embedHtml={locationData.map_embed_url} />
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
          backgroundColor: colors.cardBg,
          
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
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
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
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
          className="w-full"
          style={{
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Send Message')}
        </Button>
      </div>
    );
  };

  const renderCateringSection = (cateringData: any) => {
    if (!cateringData.catering_title) return null;

    const cateringOptions = cateringData.catering_options || [];

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
            <Users
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
              {cateringData.catering_title}
            </h2>
          </div>
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
            <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
            <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
              <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
              </svg>
            </div>
          </div>
        </div>

        {cateringData.catering_description && (
          <p
            className="text-sm leading-6 mb-4"
            style={{ color: colors.text }}
          >
            {cateringData.catering_description}
          </p>
        )}

        {(cateringData.min_order_amount || cateringData.lead_time) && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {cateringData.min_order_amount && (
              <div
                className="rounded-xl p-3"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <p
                  className="text-[11px] font-medium"
                  style={{ color: colors.text + '80' }}
                >
                  {t("Minimum Order")}
                </p>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: colors.primary }}
                >
                  {cateringData.min_order_amount}
                </p>
              </div>
            )}

            {cateringData.lead_time && (
              <div
                className="rounded-xl p-3"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <p
                  className="text-[11px] font-medium"
                  style={{ color: colors.text + '80' }}
                >
                  {t("Lead Time")}
                </p>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: colors.primary }}
                >
                  {cateringData.lead_time}
                </p>
              </div>
            )}
          </div>
        )}

        {Array.isArray(cateringOptions) && cateringOptions.length > 0 && (
          <div className="space-y-3">
            {cateringOptions.map((option: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`,
                  boxShadow: `0 8px 18px ${colors.primary}0D`
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      {option.serves && (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.primary
                          }}
                        >
                          {option.serves}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-base font-medium"
                      style={{
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {option.option_name}
                    </h3>

                    {option.description && (
                      <p
                        className="text-xs leading-5 mt-2"
                        style={{ color: colors.text + 'CC' }}
                      >
                        {option.description}
                      </p>
                    )}
                  </div>

                  {option.price && (
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap"
                      style={{
                        backgroundColor: colors.primary,
                        color: '#FFFFFF'
                      }}
                    >
                      {option.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          className="w-full mt-4"
          style={{
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Inquire About Catering')}
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
          
        }}
      >
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
            <Cake size={16} style={{ color: colors.primary }} />
            <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
          </div>
          <p
            className="mx-auto max-w-md text-sm leading-7 italic"
            style={{
              color: colors.text,
              fontFamily: font
            }}
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
          
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="mb-4">
            <div className="flex items-center">
              <Cake
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
            <div className="mt-2 relative h-3">
              <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
                <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
                <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
                  <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
                  </svg>
                </div>
              </div>
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

  const renderActionButtonsSection = (actionButtonsData: any) => {
    const hasAnyButton = actionButtonsData.contact_button_text || actionButtonsData.order_button_text || actionButtonsData.save_contact_button_text;
    if (!hasAnyButton) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          
        }}
      >
        <div className="space-y-3">
          {actionButtonsData.contact_button_text && (
            <Button
              className="w-full"
              style={{
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Cake className="w-4 h-4 mr-2" />
              {actionButtonsData.contact_button_text}
            </Button>
          )}

          {actionButtonsData.order_button_text && (
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
              <ShoppingBag className="w-4 h-4 mr-2" />
              {actionButtonsData.order_button_text}
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
                  title: configSections.header?.tagline || t('Bakery'),
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
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          
        }}
      >
        <div className="mb-4">
          <div className="flex items-center">
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
              {qrData.qr_title || t('Share Our Bakery')}
            </h2>
          </div>
          <div className="mt-2 relative h-3">
            <div className="absolute left-0 right-0 h-0.5" style={{ backgroundColor: colors.primary + '30' }}></div>
              <div className="absolute left-0 right-0 top-1 h-0.5" style={{ backgroundColor: colors.primary + '20' }}></div>
              <div className="absolute left-0 right-0 top-2 h-0.5" style={{ backgroundColor: colors.primary + '10' }}></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-6 h-6">
                <svg viewBox="0 0 24 24" fill={colors.primary} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,3c-0.5,0-1,0.2-1.4,0.6C10.2,4,10,4.5,10,5c0,0.5,0.2,1,0.6,1.4C11,6.8,11.5,7,12,7c0.5,0,1-0.2,1.4-0.6 C13.8,6,14,5.5,14,5c0-0.5-0.2-1-0.6-1.4C13,3.2,12.5,3,12,3z M7.5,5C7,5,6.5,5.2,6.1,5.6C5.7,6,5.5,6.5,5.5,7c0,0.5,0.2,1,0.6,1.4 C6.5,8.8,7,9,7.5,9C8,9,8.5,8.8,8.9,8.4C9.3,8,9.5,7.5,9.5,7c0-0.5-0.2-1-0.6-1.4C8.5,5.2,8,5,7.5,5z M16.5,5 c-0.5,0-1,0.2-1.4,0.6C14.7,6,14.5,6.5,14.5,7c0,0.5,0.2,1,0.6,1.4C15.5,8.8,16,9,16.5,9c0.5,0,1-0.2,1.4-0.6 C18.3,8,18.5,7.5,18.5,7c0-0.5-0.2-1-0.6-1.4C17.5,5.2,17,5,16.5,5z M5.2,10C4.7,10,4.2,10.2,3.8,10.6C3.4,11,3.2,11.5,3.2,12 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C6.2,10.2,5.7,10,5.2,10z M12,10c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6 c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C13,10.2,12.5,10,12,10z M18.8,10c-0.5,0-1,0.2-1.4,0.6 c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4 c0-0.5-0.2-1-0.6-1.4C19.8,10.2,19.3,10,18.8,10z M7.5,15c-0.5,0-1,0.2-1.4,0.6C5.7,16,5.5,16.5,5.5,17c0,0.5,0.2,1,0.6,1.4 C6.5,18.8,7,19,7.5,19c0.5,0,1-0.2,1.4-0.6C9.3,18,9.5,17.5,9.5,17c0-0.5-0.2-1-0.6-1.4C8.5,15.2,8,15,7.5,15z M16.5,15 c-0.5,0-1,0.2-1.4,0.6c-0.4,0.4-0.6,0.9-0.6,1.4c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6 c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4C17.5,15.2,17,15,16.5,15z M12,17c-0.5,0-1,0.2-1.4,0.6C10.2,18,10,18.5,10,19 c0,0.5,0.2,1,0.6,1.4c0.4,0.4,0.9,0.6,1.4,0.6c0.5,0,1-0.2,1.4-0.6c0.4-0.4,0.6-0.9,0.6-1.4c0-0.5-0.2-1-0.6-1.4 C13,17.2,12.5,17,12,17z" />
                </svg>
              </div>
            </div>
          </div>

        <div
          className="text-center p-4 rounded-lg"
          style={{
            backgroundColor: colors.background,
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
            className="w-full"
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

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer) return null;

    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.cardBg,
          
        }}
      >
        {footerData.footer_text && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Cake
                size={18}
                className="mr-2"
                style={{ color: colors.primary }}
              />
              <h3
                className="text-base font-semibold"
                style={{
                  color: colors.primary,
                  fontFamily: font
                }}
              >
                {t('Our Promise')}
              </h3>
            </div>
            <p
              className="text-sm text-center"
              style={{
                color: colors.text,
                fontFamily: font
              }}
            >
              {footerData.footer_text}
            </p>
          </div>
        )}

        {footerData.footer_links && Array.isArray(footerData.footer_links) && footerData.footer_links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {footerData.footer_links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2 rounded-full transition-colors"
                style={{
                  backgroundColor: colors.primary + '20',
                  color: colors.primary,
                  fontFamily: font,
                  border: `1px solid ${colors.primary}30`
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
          style={{ color:"#ffffff" }}
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
