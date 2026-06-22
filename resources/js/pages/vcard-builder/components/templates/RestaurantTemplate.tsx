import { handleAppointmentBooking } from '../VCardPreview';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';

import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Star,
  Download,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageSquare,
  Utensils,
  Coffee,
  Save,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface RestaurantTemplateProps {
  data: any;
  template: any;
}

const RestaurantMapEmbed = React.memo(function RestaurantMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded overflow-hidden h-48">
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

const BusinessHoursBadge = React.memo(function BusinessHoursBadge({ color }: { color: string }) {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor: color,
          border: `1px solid ${color}`,
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)'
        }}
      >
        <Calendar size={15} style={{ color: '#FFFFFF' }} />
      </div>
    </div>
  );
});

export default function RestaurantTemplate({ data, template }: RestaurantTemplateProps) {
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
  const colors = configSections.colors || template?.defaultColors || {
    primary: '#8B4513',
    secondary: '#A0522D',
    accent: '#FFD700',
    background: '#FFF8E1',
    text: '#3E2723'
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
  const allSections = getBusinessTemplate('restaurant')?.sections || [];

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
      let videoData = null;

      if (sanitizedVideo?.embed_url) {
        try {
          videoData = extractVideoUrl(sanitizedVideo.embed_url);
          // Debug logging for development
          if (process.env.NODE_ENV === 'development') {
            console.log('Video processing:', {
              original: sanitizedVideo.embed_url,
              processed: videoData
            });
          }
        } catch (error) {
          console.warn('Error processing video URL:', sanitizedVideo.embed_url, error);
        }
      }

      return {
        ...sanitizedVideo,
        videoData,
        key: `video-${index}-${sanitizedVideo?.title || ''}-${sanitizedVideo?.embed_url || ''}`
      };
    });
  }, [configSections.videos?.video_list]);

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'menu_highlights':
        return renderMenuSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
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
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative overflow-hidden">
      {/* Restaurant-themed Header with Menu-inspired Design */}
      <div className="relative">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-2 ${isRTL ? 'left-4' : 'right-4'} z-10`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex cursor-pointer items-center space-x-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 shadow-md"
                style={{
                  backgroundColor: colors.accent,
                  border: `2px solid ${colors.primary}`,
                  color: colors.primary
                }}
              >
                <Utensils className="w-3 h-3" />
                <span>
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
                <span className="uppercase font-bold">{currentLanguage}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <div
                    className="fixed inset-0"
                    style={{ zIndex: 99998 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-4 rounded-lg border shadow-xl py-1 w-40 max-h-48 overflow-y-auto"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.primary,
                      zIndex: 99999
                    }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.accent : 'transparent',
                          color: currentLanguage === lang.code ? colors.primary : colors.text,
                          fontFamily: font
                        }}
                      >
                        <span>
                          {String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}
                        </span>
                        <span className="truncate">{lang.name}</span>
                        {currentLanguage === lang.code && (
                          <Coffee className="w-3 h-3 ml-auto" style={{ color: colors.primary }} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Decorative menu border */}
        <div className="h-4 w-full" style={{
          background: colors.accent,
          borderBottom: `2px solid ${colors.primary}`
        }}></div>

        {/* Main header with plate-like circular design */}
        <div className="relative bg-white pt-5 pb-6">
          {/* Circular plate-like image container with centered logo */}
          <div
            className="relative mx-auto w-56 h-56 rounded-full overflow-hidden border-8 shadow-xl"
            style={{
              borderColor: colors.primary,
              background: `radial-gradient(circle at center, ${colors.secondary}35, ${colors.primary}90)`
            }}
          >
            {headerData.cover_image ? (
              <img
                src={getImageDisplayUrl(headerData.cover_image)}
                alt={t('Restaurant Cover')}
                className="block w-full h-full object-cover object-center"
                style={{
                  transform: 'scale(1.35)',
                  transformOrigin: 'center'
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{
                background: `radial-gradient(circle, ${colors.secondary}40, ${colors.primary}90)`,
              }}>
                <Utensils size={64} style={{ color: 'white' }} />
              </div>
            )}

            {/* Logo centered within the cover image */}
            {headerData.logo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 bg-white shadow-lg"
                  style={{ borderColor: colors.primary }}>
                  <img src={getImageDisplayUrl(headerData.logo)} alt={t('Logo')} className="w-full h-full object-contain p-1" />
                </div>
              </div>
            )}
          </div>

          {/* Restaurant name and tagline */}
          <div className="text-center mt-5 px-6">
            <h1 className="text-2xl font-bold tracking-wide"
              style={{
                fontFamily: font,
                color: colors.primary,
                textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
              }}>
              {headerData.name || data.name || t('La Bella Cucina')}
            </h1>

            {headerData.tagline && (
              <p className="text-sm mt-1 italic"
                style={{
                  fontFamily: font,
                  color: colors.secondary
                }}>
                {headerData.tagline}
              </p>
            )}

            {/* Cuisine type with stars */}
            <div className="flex items-center justify-center mt-2">
              <p className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>
                {headerData.cuisine_type || t('Italian Cuisine')}
              </p>
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} fill={colors.accent} stroke={colors.accent} />
                ))}
              </div>
            </div>

            {/* Established year */}
            {headerData.year_established && (
              <p className="text-xs mt-1" style={{ color: colors.text + '80', fontFamily: font }}>
                {t('Established')} {headerData.year_established}
              </p>
            )}

            {/* Decorative utensils */}
            <div className="flex justify-center mt-3 space-x-8">
              <Coffee size={16} style={{ color: colors.primary + '80' }} />
              <Utensils size={16} style={{ color: colors.primary + '80' }} />
            </div>
          </div>
        </div>

        {/* Restaurant info bar */}
        <div className="relative px-6 py-3 flex items-center justify-center"
          style={{ backgroundColor: colors.accent + '30', borderTop: `1px solid ${colors.primary}30` }}>
          <div className="flex items-center">
            <Coffee size={14} style={{ color: colors.primary, marginRight: '8px' }} />
            <span className="text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
              {headerData.service_info || t('Open Daily • Dine-in • Takeout • Delivery')}
            </span>
          </div>
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

    const aboutStats = [
      aboutData.year_established ? {
        label: t('Established'),
        value: aboutData.year_established
      } : null,
      aboutData.chef_name ? {
        label: t('Head Chef'),
        value: aboutData.chef_name
      } : null,
      aboutData.ambiance ? {
        label: t('Ambiance'),
        value: aboutData.ambiance === 'fine_dining' ? 'Fine Dining' :
          aboutData.ambiance === 'casual' ? 'Casual' :
            aboutData.ambiance === 'family' ? 'Family-Friendly' :
              aboutData.ambiance === 'bistro' ? 'Bistro' :
                aboutData.ambiance === 'cafe' ? 'Café' : aboutData.ambiance
      } : null
    ].filter(Boolean) as Array<{ label: string; value: string }>;

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('About Us')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Coffee size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="max-w-[520px] mx-auto">
          <p
            className="text-center text-[15px] leading-[1.8]"
            style={{ color: colors.text, fontFamily: font }}
          >
            {aboutData.description || data.description}
          </p>

          {aboutStats.length > 0 && (
            <div className="mt-7 grid grid-cols-1 gap-4 text-center sm:grid-cols-3 sm:gap-0">
              {aboutStats.map((item, index) => (
                <div
                  key={item.label}
                  className="px-3 sm:px-4"
                  style={{
                    borderInlineEnd: index !== aboutStats.length - 1 ? `1px solid ${colors.primary}22` : 'none'
                  }}
                >
                  <div
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: `${colors.text}b3`, fontFamily: font }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="mt-1 text-[13px] font-semibold sm:text-[15px]"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    const contactItems = [
      (contactData.phone || data.phone) ? {
        key: 'phone',
        label: t('Phone'),
        value: contactData.phone || data.phone,
        href: `tel:${contactData.phone || data.phone}`,
        icon: Phone
      } : null,
      (contactData.email || data.email) ? {
        key: 'email',
        label: t('Email'),
        value: contactData.email || data.email,
        href: `mailto:${contactData.email || data.email}`,
        icon: Mail
      } : null,
      (contactData.website || data.website) ? {
        key: 'website',
        label: t('Website'),
        value: contactData.website || data.website,
        href: contactData.website || data.website,
        icon: Globe,
        external: true
      } : null,
      contactData.address ? {
        key: 'address',
        label: t('Address'),
        value: contactData.address,
        icon: MapPin,
        isTextBlock: true
      } : null
    ].filter(Boolean) as Array<{
      key: string;
      label: string;
      value: string;
      href?: string;
      icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
      external?: boolean;
      isTextBlock?: boolean;
    }>;

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('Contact Information')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Coffee size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-3">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.key}
                className="border-b pb-3 last:border-b-0 last:pb-0"
                style={{ borderColor: `${colors.primary}18` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: `${colors.primary}10`
                    }}
                  >
                    <Icon size={17} style={{ color: colors.primary }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className="text-sm"
                      style={{ color: `${colors.text}99`, fontFamily: font }}
                    >
                      {item.label}
                    </div>

                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="mt-1 block break-words text-[14px] font-medium leading-6"
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        className="mt-1 whitespace-pre-line break-words text-[14px] leading-6"
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {item.value}
                      </p>
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

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;

    const visibleHours = hours.slice(0, 7);

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-6">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('Business Hours')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Clock size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-5 sm:gap-x-5">
          {visibleHours.map((hour: any, index: number) => {
            const isLastOddCard = visibleHours.length % 2 === 1 && index === visibleHours.length - 1;

            return (
              <div
                key={index}
                className={isLastOddCard ? 'col-span-2 flex justify-center w-full' : 'w-full'}
              >
                <div className={isLastOddCard ? 'w-full max-w-[240px]' : 'w-full'}>
                  <div className="relative pt-1">
                    <div className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2">
                      <BusinessHoursBadge color={colors.primary} />
                    </div>

                    <div
                      className="mx-auto flex min-h-[60px] w-full max-w-[240px] items-center justify-center rounded-lg text-center sm:px-4"
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${colors.primary}`,
                        boxShadow: '0 10px 20px rgba(196, 156, 86, 0.10)',
                        fontFamily: font
                      }}
                    >
                      <div className="mt-2 flex items-center justify-center gap-1 whitespace-nowrap text-center text-[11px] font-medium leading-tight sm:gap-1.5 sm:text-[13px]">
                        <span className="capitalize font-medium" style={{ color: colors.primary }}>{t(hour.day)}</span>
                        <span className="font-semibold" style={{ color: colors.primary }}>
                          {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-4">
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Our Services')}</h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Coffee size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div key={index} className="p-3 rounded" style={{ backgroundColor: `${colors.primary}10`, fontFamily: font }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm" style={{ color: colors.text }}>{service.title}</h4>
                  {service.description && (
                    <p className="text-sm mt-1" style={{ color: colors.text + 'CC' }}>{service.description}</p>
                  )}
                </div>
                {service.price && (
                  <span className="font-bold text-sm ml-2" style={{ color: colors.primary }}>{service.price}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMenuSection = (menuData: any) => {
    const menuItems = menuData.menu_items || [];
    if (!Array.isArray(menuItems) || menuItems.length === 0) return null;

    // Group menu items by category
    const categories: { [key: string]: any[] } = {};
    menuItems.forEach((item: any) => {
      const category = item.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-4">
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Menu Highlights')}</h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Coffee size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-4">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium capitalize" style={{ color: colors.secondary, fontFamily: font }}>
                {category === 'appetizer' ? t('Appetizers') :
                  category === 'main' ? t('Main Courses') :
                    category === 'dessert' ? t('Desserts') :
                      category === 'beverage' ? t('Beverages') :
                        category === 'special' ? t('Chef\'s Specials') : category}
              </h4>

              {items.map((item: any, index: number) => (
                <div key={index} className="flex border-b pb-3" style={{ borderColor: `${colors.borderColor}50` }}>
                  {item.image ? (
                    <div className="w-16 h-16 rounded overflow-hidden mr-3">
                      <img src={getImageDisplayUrl(item.image)} alt={item.name} className="w-full h-full object-cover" onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded overflow-hidden mr-3 flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
                      <Utensils size={24} style={{ color: colors.primary }} />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-sm" style={{ color: colors.text, fontFamily: font }}>{item.name}</h5>
                      <span className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>{item.price}</span>
                    </div>
                    {item.description && (
                      <p className="text-sm mt-1" style={{ color: colors.text + 'CC', fontFamily: font }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('Photo Gallery')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Coffee size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo: any, index: number) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg"
              style={{ boxShadow: '0 10px 22px rgba(62, 39, 35, 0.08)' }}
            >
              {photo.image ? (
                <img
                  src={getImageDisplayUrl(photo.image)}
                  alt={photo.caption || `${t('Gallery')} ${index + 1}`}
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="flex h-32 w-full items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Coffee size={28} style={{ color: colors.primary }} />
                </div>
              )}

              {photo.caption && (
                <div
                  className="absolute inset-x-0 bottom-0 px-3 py-2"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(34,24,18,0.70) 100%)' }}
                >
                  <p className="truncate text-[11px] font-medium text-white" style={{ fontFamily: font }}>
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
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-4">
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Restaurant Videos')}</h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Video size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-3">
          {videoContent.map((video: any) => (
            <div key={video.key} className="rounded overflow-hidden" style={{ backgroundColor: `${colors.primary}10` }}>
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
                <h4 className="font-medium text-sm mb-1" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-sm mb-2" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {video.duration && (
                    <span className="text-sm" style={{ color: colors.secondary, fontFamily: font }}>
                      ⏱️ {video.duration}
                    </span>
                  )}
                  {video.video_type && (
                    <span className="text-sm px-2 py-1 rounded-lg" style={{ backgroundColor: colors.accent, color: colors.primary, fontFamily: font }}>
                      {video.video_type.replace('_', ' ')}
                    </span>
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
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('YouTube Channel')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Youtube size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div
          className="rounded-lg p-4"
          style={{
            backgroundColor: `${colors.primary}08`,
            border: `1px solid ${colors.primary}16`
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: '#FF0000' }}
            >
              <Youtube className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || t('Our YouTube Channel')}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="mt-1 text-xs" style={{ color: `${colors.text}B3`, fontFamily: font }}>
                  {youtubeData.subscriber_count} {t('subscribers')}
                </p>
              )}
            </div>
          </div>

          {youtubeData.channel_description && (
            <p
              className="mb-4 text-sm leading-6"
              style={{ color: colors.text, fontFamily: font }}
            >
              {youtubeData.channel_description}
            </p>
          )}

          {youtubeData.latest_video_embed && (
            <div
              className="mb-4 overflow-hidden rounded-lg"
              style={{
                backgroundColor: colors.cardBg || '#FFFFFF',
                border: `1px solid ${colors.borderColor || '#D7CCC8'}`
              }}
            >
              <div className="border-b px-3 py-2" style={{ borderColor: `${colors.primary}14` }}>
                <h4 className="flex items-center text-sm font-medium" style={{ color: colors.primary, fontFamily: font }}>
                  <Play className="mr-2 h-4 w-4" style={{ color: colors.primary }} />
                  {t('Latest Video')}
                </h4>
              </div>

              <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
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

          <div className="space-y-2">
            {youtubeData.channel_url && (
              <Button
                className="w-full"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontFamily: font
                }}
                onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                <Youtube className="w-4 h-4 mr-2" />
                {t('Visit Our Channel')}
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
                onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                <Play className="w-4 h-4 mr-2" />
                {t('Featured Recipes')}
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
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('Customer Reviews')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Star size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
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
                    className="rounded-lg px-4 py-4"
                    style={{
                      backgroundColor: `${colors.primary}08`,
                      border: `1px solid ${colors.primary}16`,
                      fontFamily: font
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: `${colors.primary}12`,
                            color: colors.primary,
                            fontFamily: font
                          }}
                        >
                          {(review.customer_name || 'G').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                            {review.customer_name || t('Guest')}
                          </p>
                          {review.date && (
                            <p className="text-[11px]" style={{ color: `${colors.text}80`, fontFamily: font }}>
                              {review.date}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < parseInt(review.rating || 5) ? colors.accent : 'transparent'}
                            stroke={i < parseInt(review.rating || 5) ? colors.accent : `${colors.text}40`}
                          />
                        ))}
                      </div>
                    </div>

                    <p
                      className="mt-3 text-[13px] leading-6"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="mt-3 flex justify-center space-x-2">
              {testimonialsData.reviews.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="h-2.5 cursor-pointer rounded-full transition-all"
                  style={{
                    width: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? '20px' : '8px',
                    backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : `${colors.primary}40`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('Follow Us')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Globe size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-center transition-all duration-200"
              style={{
                border: `1px solid ${colors.primary}20`,
                backgroundColor: `${colors.primary}08`,
                fontFamily: font
              }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              aria-label={link.platform}
              title={link.platform}
            >
              <SocialIcon platform={link.platform} color={colors.primary} />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t('Reservations')}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Calendar size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div
          className="rounded-lg px-4 py-4 text-center"
          style={{
            border: `1px solid ${colors.primary}18`,
            backgroundColor: `${colors.primary}06`
          }}
        >
          <p className="mt-2 text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
            {t('Reserve Your Table')}
          </p>

          {appointmentsData.reservation_notes && (
            <p className="mt-2 text-sm" style={{ color: `${colors.text}cc`, fontFamily: font }}>
              {appointmentsData.reservation_notes}
            </p>
          )}

          <div className="mt-3 flex justify-center">
            <Button
              className="rounded-lg px-5"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              {t('Reserve Now')}
            </Button>
          </div>

          {(appointmentsData.reservation_phone || appointmentsData.min_party_size || appointmentsData.max_party_size) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {appointmentsData.reservation_phone && (
                <a
                  href={`tel:${appointmentsData.reservation_phone}`}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px]"
                  style={{
                    backgroundColor: `${colors.primary}10`,
                    color: colors.primary,
                    fontFamily: font
                  }}
                >
                  <Phone size={13} />
                  {appointmentsData.reservation_phone}
                </a>
              )}

              {appointmentsData.min_party_size && (
                <div
                  className="rounded-full px-3 py-1.5 text-[12px]"
                  style={{
                    border: `1px solid ${colors.primary}18`,
                    color: colors.primary,
                    fontFamily: font
                  }}
                >
                  {t('Min Party')}: {appointmentsData.min_party_size}
                </div>
              )}

              {appointmentsData.max_party_size && (
                <div
                  className="rounded-full px-3 py-1.5 text-[12px]"
                  style={{
                    border: `1px solid ${colors.primary}18`,
                    color: colors.primary,
                    fontFamily: font
                  }}
                >
                  {t('Max Party')}: {appointmentsData.max_party_size}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-4">
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Location')}</h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <MapPin size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-3">
          {locationData.map_embed_url && (
            <RestaurantMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button
              className="mx-auto flex h-9 w-auto min-w-[150px] px-4"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
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
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-4">
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Download Our App')}</h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Download size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-3">
          {appData.app_description && (
            <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {appData.app_description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
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
                <Download className="w-4 h-4 mr-2" />
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
                <Download className="w-4 h-4 mr-2" />
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
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-4">
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{formData.form_title}</h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <MessageSquare size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>

        <div className="space-y-3">
          {formData.form_description && (
            <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}

          <Button
            className="mx-auto flex h-9 w-auto min-w-[150px] px-4"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("Contact Us")}
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="text-center mb-4">
            <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{customHtmlData.section_title}</h3>
            <div className="flex items-center justify-center mt-2">
              <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
              <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
              <Coffee size={16} style={{ color: colors.primary }} />
              <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
              <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
            </div>
          </div>
        )}
        <div
          className="custom-html-content p-4 rounded-lg"
          style={{
            backgroundColor: colors.cardBg || '#FFFFFF',
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
                background-color: ${colors.accent};
                color: ${colors.primary};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-family: serif;
              }
            `}
          </style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionButtonsData: any) => {
    const hasAnyButton = actionButtonsData.contact_button_text || actionButtonsData.reservation_button_text || actionButtonsData.save_contact_button_text;
    if (!hasAnyButton) return null;

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {actionButtonsData.contact_button_text && (
            <Button
              className="h-10 w-full"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {actionButtonsData.contact_button_text}
            </Button>
          )}

          {actionButtonsData.reservation_button_text && (
            <Button
              className="h-10 w-full"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {actionButtonsData.reservation_button_text}
            </Button>
          )}

          {actionButtonsData.save_contact_button_text && (
            <Button
              className={`h-10 w-full ${!actionButtonsData.contact_button_text && !actionButtonsData.reservation_button_text ? '' : 'sm:col-span-2'}`}
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => {
                const contactData = {
                  name: data.name || configSections.header?.name || '',
                  title: configSections.header?.cuisine_type || t('Restaurant'),
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
              <Save className="w-4 h-4 mr-2" />
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
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <div className="text-center mb-5">
          <h3
            className="text-[15px] font-semibold tracking-[0.01em]"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {t("Share QR Code")}
          </h3>
          <div className="flex items-center justify-center mt-2">
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(-30deg)' }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <QrCode size={16} style={{ color: colors.primary }} />
            <div className="mx-3 h-px w-16" style={{ backgroundColor: colors.accent }}></div>
            <Utensils size={16} style={{ color: colors.primary, transform: 'rotate(30deg)' }} />
          </div>
        </div>
        <div
          className="rounded-lg border px-4 py-4 text-center"
          style={{
            borderColor: `${colors.primary}22`
          }}
        >
          <h4 className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
            {qrData.qr_title || t("Share QR Code")}
          </h4>

          {qrData.qr_description && (
            <p className="mx-auto mt-1.5 max-w-[280px] text-sm leading-5" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            className="mx-auto mt-3 flex h-9 w-auto min-w-[150px] px-4"
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
      <div className="px-6 py-4 text-center border-b" style={{ borderColor: colors.borderColor || '#D7CCC8' }}>
        <p className="text-sm italic" style={{ color: colors.text, fontFamily: font }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;

    return (
      <div className="px-6 py-4 text-center">
        <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
          {copyrightData.text}
        </p>
      </div>
    );
  };

  // Extract copyright section to render it at the end
  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);


  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{
      fontFamily: font,
      background: colors.background || '#FFF8E1',
      color: colors.text || '#3E2723'
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}


      {/* Copyright always at the end */}
      {copyrightSection && copyrightSection.text && (
        <div className="px-6 pb-4 text-center">
          <p className="text-xs" style={{ color: colors.text + '60', fontFamily: font }}>
            {copyrightSection.text}
          </p>
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
