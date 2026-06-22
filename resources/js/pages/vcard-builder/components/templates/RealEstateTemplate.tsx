import { handleAppointmentBooking } from '../VCardPreview';
import React from 'react';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { sanitizeText, sanitizeUrl } from '@/utils/sanitizeHtml';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Calendar,
  Star,
  Download,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MessageSquare,
  Home,
  Building,
  Key,
  DollarSign,
  BarChart,
  Search,
  Handshake,
  User,
  Award,
  Briefcase,
  Save,
  Smartphone,
  Video,
  Play,
  Youtube,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface RealEstateTemplateProps {
  data: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    description?: string;
    config_sections?: Record<string, any>;
    template_config?: Record<string, any>;
  };
  template: {
    defaultData?: Record<string, any>;
    defaultColors?: Record<string, string>;
    defaultFont?: string;
  };
}

const RealEstateMapEmbed = React.memo(function RealEstateMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded overflow-hidden h-48">
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function RealEstateTemplate({ data, template }: RealEstateTemplateProps) {
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
    primary: '#1A365D',
    secondary: '#2A4365',
    accent: '#EBF8FF',
    background: '#FFFFFF',
    text: '#2D3748',
    cardBg: '#F7FAFC',
    borderColor: '#E2E8F0'
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


  const globalStyle = {
    fontFamily: font
  };

  // Get all sections for this business type
  const allSections = getBusinessTemplate('realestate')?.sections || [];

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
      case 'featured_listings':
        return renderFeaturedListingsSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
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
      case 'market_stats':
        return renderMarketStatsSection(sectionData);
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
    <div className="relative overflow-hidden border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>

      {/* Top status bar */}
      <div
        className="w-full flex items-center justify-between px-4 py-2"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || colors.primary}cc 100%)`,
          borderBottom: `1px solid rgba(255,255,255,0.12)`
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
            <Home size={13} style={{ color: 'white' }} />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            {headerData.agency || 'Premium Properties'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <Award size={13} style={{ color: '#FFD700' }} />
            <span className="text-xs font-semibold text-white">
              {headerData.achievement_badge || `Top Agent ${new Date().getFullYear()}`}
            </span>
          </div>
          {(configSections?.language && configSections?.language?.enable_language_switcher) && (
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <span>{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}</span>
                <span className="uppercase">{currentLanguage}</span>
              </button>
              {showLanguageSelector && (
                <>
                  <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setShowLanguageSelector(false)} />
                  <div
                    className="absolute right-0 top-full mt-1 rounded border shadow-lg py-1 w-36 max-h-48 overflow-y-auto"
                    style={{ backgroundColor: colors.background, borderColor: colors.borderColor, zIndex: 30 }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-50 cursor-pointer"
                        style={{ backgroundColor: currentLanguage === lang.code ? colors.primary + '10' : 'transparent', color: colors.text }}
                      >
                        <span>{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile image */}
      <div className="relative flex justify-center px-5 pt-5" style={{ backgroundColor: colors.background || '#fff' }}>
        <div
          className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border-4 shadow-md"
          style={{
            backgroundColor: colors.accent,
            borderColor: `${colors.primary}20`
          }}
        >
          {headerData.profile_image ? (
            <img
              src={getImageDisplayUrl(headerData.profile_image)}
              alt="Agent Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <User size={42} style={{ color: colors.primary }} />
          )}
        </div>
      </div>

      {/* Agent details */}
      <div className="px-5 pt-3 pb-4 text-center" style={{ backgroundColor: colors.background || '#fff' }}>
        {/* License badge */}
        {headerData.license_number && (
          <div className="mb-3 inline-flex rounded-full px-3 py-1 shadow-sm" style={{ backgroundColor: colors.accent }}>
            <p className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
              {t('License')} #: {headerData.license_number}
            </p>
          </div>
        )}

        {/* Name */}
        <h1 className="text-xl font-bold tracking-tight leading-tight" style={{ color: colors.primary, ...globalStyle }}>
          {headerData.name || data.name || ''}
        </h1>

        {/* Title */}
        {headerData.title && (
          <p className="text-sm font-medium mt-0.5" style={{ color: colors.secondary || colors.primary, fontFamily: font, opacity: 0.85 }}>
            {headerData.title}
          </p>
        )}

        {/* Divider */}
        <div className="mx-auto my-3 h-px w-24" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)` }} />

        {/* Info rows */}
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
              <Briefcase size={14} style={{ color: colors.primary }} />
            </div>
            <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {configSections.about?.experience_years || '10'} {t('Years Experience')}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
              <MapPin size={14} style={{ color: colors.primary }} />
            </div>
            <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {headerData.service_area || 'Greater Metropolitan Area'}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.accent }}>
              <Building size={14} style={{ color: colors.primary }} />
            </div>
            <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {headerData.property_types || 'Residential & Commercial'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ backgroundColor: colors.accent, borderTop: `1px solid ${colors.borderColor || '#E2E8F0'}` }}
      >
        <div className="flex items-center gap-1.5">
          <DollarSign size={14} style={{ color: colors.primary }} />
          <span className="text-xs font-medium" style={{ color: colors.primary, fontFamily: font }}>
            {headerData.specialization
              ? headerData.specialization.toString().split(',')[0].trim()
              : 'Luxury Properties'}
          </span>
        </div>
        <div className="w-px h-4" style={{ backgroundColor: colors.borderColor || '#E2E8F0' }} />
        <div className="flex items-center gap-1.5">
          <Star size={14} fill={colors.primary} style={{ color: colors.primary }} />
          <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
            {headerData.rating || '5.0'}
          </span>
          <span className="text-xs" style={{ color: colors.text, fontFamily: font, opacity: 0.7 }}>Rating</span>
        </div>
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
    return (
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>

        {/* Section title */}
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <User size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('About Me')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>

        {/* Experience */}
        {aboutData.experience_years && (
          <div className="inline-flex items-center gap-2 mb-4">
            <Briefcase size={16} style={{ color: colors.primary }} />
            <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              <span className="font-semibold" style={{ color: colors.primary }}>{aboutData.experience_years}</span> {t('Years of Experience')}
            </span>
          </div>
        )}

        {/* Specialties */}
        {aboutData.specialties && (
          <div className="mb-3">
            <p className="text-xs font-medium mb-2" style={{ color: colors.text, fontFamily: font, opacity: 0.5 }}>
              {t('Specialties')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {aboutData.specialties.split(',').map((s: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-md font-medium"
                  style={{ backgroundColor: colors.accent, color: colors.primary, fontFamily: font }}
                >
                  {s.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {aboutData.certifications && (
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: colors.text, fontFamily: font, opacity: 0.5 }}>
              {t('Certifications')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {aboutData.certifications.split(',').map((c: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-md font-medium"
                  style={{ border: `1px solid ${colors.primary}40`, color: colors.primary, fontFamily: font }}
                >
                  {c.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
          <Phone size={18} style={{ color: colors.primary }} />
        </div>
        <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Contact Information')}</h3>
        <div className="ml-3 flex-grow h-1" style={{
          background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
          borderRadius: '4px'
        }}></div>
      </div>

      <div className="space-y-3">
        {(contactData.phone || data.phone) && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: colors.accent }}>
              <Phone size={16} style={{ color: colors.primary }} />
            </div>
            <a href={`tel:${contactData.phone || data.phone}`} className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {contactData.phone || data.phone}
            </a>
          </div>
        )}
        {(contactData.email || data.email) && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: colors.accent }}>
              <Mail size={16} style={{ color: colors.primary }} />
            </div>
            <a href={`mailto:${contactData.email || data.email}`} className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {contactData.email || data.email}
            </a>
          </div>
        )}
        {(contactData.website || data.website) && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: colors.accent }}>
              <Globe size={16} style={{ color: colors.primary }} />
            </div>
            <a href={contactData.website || data.website} target="_blank" rel="noopener noreferrer" className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {contactData.website || data.website}
            </a>
          </div>
        )}
        {contactData.office_address && (
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full" style={{ backgroundColor: colors.accent }}>
              <MapPin size={16} style={{ color: colors.primary }} />
            </div>
            <p className="text-sm whitespace-pre-line" style={{ color: colors.text, fontFamily: font }}>
              {contactData.office_address}
            </p>
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

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Clock size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t("Business Hours")}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        <div className="space-y-2">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-2 rounded" style={{
              backgroundColor: hour.is_closed ? colors.accent + '40' : colors.accent,
              fontFamily: font
            }}>
              <span className="capitalize font-medium text-sm" style={{ color: colors.text }}>
                {t(hour.day)}
              </span>
              <span className="text-sm" style={{ color: hour.is_closed ? colors.text + '80' : colors.primary }}>
                {hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFeaturedListingsSection = (listingsData: any) => {
    const properties = listingsData.properties || [];
    if (!Array.isArray(properties) || properties.length === 0) return null;

    const getPropertyImageUrl = (image: string) => {
      return image ? getImageDisplayUrl(image) || image : '';
    };

    const getStatusBadge = (status: string) => {
      let bgColor, textColor;

      switch (status) {
        case 'for_sale':
          bgColor = '#10b77f';
          textColor = '#FFFFFF';
          break;
        case 'for_rent':
          bgColor = '#3B82F6';
          textColor = '#FFFFFF';
          break;
        case 'pending':
          bgColor = '#F59E0B';
          textColor = '#FFFFFF';
          break;
        case 'sold':
          bgColor = '#EF4444';
          textColor = '#FFFFFF';
          break;
        default:
          bgColor = colors.primary;
          textColor = '#FFFFFF';
      }

      return { bgColor, textColor };
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'for_sale': return 'For Sale';
        case 'for_rent': return 'For Rent';
        case 'pending': return 'Pending';
        case 'sold': return 'Sold';
        default: return status;
      }
    };

    return (
      <div className="px-6 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-5">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Home size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t("Featured Listings")}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        <div className="grid gap-4">
          {properties.map((property: any, index: number) => {
            const statusStyle = getStatusBadge(property.status);
            const propertyImageUrl = getPropertyImageUrl(property.image);
            const propertySpecs = [
              property.bedrooms ? { label: t("Beds"), value: property.bedrooms } : null,
              property.bathrooms ? { label: t("Baths"), value: property.bathrooms } : null,
              property.sqft ? { label: t("Sq.Ft"), value: property.sqft } : null,
            ].filter(Boolean) as Array<{ label: string; value: string | number }>;

            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden border shadow-sm transition-all ${
                  property.listing_url ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg' : ''
                }`}
                style={{
                  backgroundColor: colors.cardBg || '#F7FAFC',
                  borderColor: colors.borderColor || '#E2E8F0'
                }}
                onClick={() => property.listing_url && typeof window !== "undefined" && window.open(property.listing_url, '_blank', 'noopener,noreferrer')}
              >
                <div className="relative h-52 overflow-hidden">
                  {propertyImageUrl ? (
                    <img
                      src={propertyImageUrl}
                      alt={property.address || 'Property'}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        const target = event.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="w-full h-full items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primary}15 100%)`,
                      display: propertyImageUrl ? 'none' : 'flex'
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: colors.background || '#FFFFFF' }}
                      >
                        <Home size={28} style={{ color: colors.primary }} />
                      </div>
                    </div>
                  </div>
                  {propertyImageUrl && (
                    <div
                      className="absolute inset-x-0 bottom-0 h-24"
                      style={{
                        background: 'linear-gradient(to top, rgba(15,23,42,0.78), rgba(15,23,42,0))'
                      }}
                    />
                  )}

                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: statusStyle.bgColor,
                      color: statusStyle.textColor
                    }}
                  >
                    {getStatusLabel(property.status)}
                  </div>

                  <div
                    className="absolute left-3 bottom-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: colors.primary }}
                  >
                    <DollarSign size={14} />
                    <p className="font-bold text-sm" style={{ fontFamily: font }}>{property.price}</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-base leading-snug mb-1" style={{ color: colors.text, fontFamily: font }}>
                        {property.address}
                      </h4>
                    </div>
                    <div
                      className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: colors.accent, color: colors.primary, fontFamily: font }}
                    >
                      #{String(index + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {propertySpecs.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 my-4">
                      {propertySpecs.map((spec) => (
                        <span
                          key={spec.label}
                          className="flex items-center justify-center text-center text-xs px-2 py-2 rounded-md font-medium leading-tight min-w-0"
                          style={{
                            border: `1px solid ${colors.primary}40`,
                            color: colors.primary,
                            fontFamily: font
                          }}
                        >
                          {spec.value} {spec.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {property.description && (
                    <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {property.description.length > 120
                        ? property.description.substring(0, 120) + '...'
                        : property.description}
                    </p>
                  )}

                  {property.listing_url && (
                    <div className="mt-4">
                      <Button
                        type="button"
                        className="w-full rounded-xl text-sm font-semibold"
                        style={{
                          backgroundColor: colors.primary,
                          color: '#FFFFFF'
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (typeof window !== "undefined") {
                            window.open(property.listing_url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        {t('View Details')}
                      </Button>
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

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;

    const getServiceIcon = (icon: string) => {
      switch (icon) {
        case 'home': return <Home size={15} />;
        case 'building': return <Building size={15} />;
        case 'key': return <Key size={15} />;
        case 'dollar': return <DollarSign size={15} />;
        case 'chart': return <BarChart size={15} />;
        case 'search': return <Search size={15} />;
        case 'handshake': return <Handshake size={15} />;
        default: return <Briefcase size={15} />;
      }
    };

    return (
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-5">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Briefcase size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Services')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }} />
        </div>

        <div className="flex flex-col gap-2">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="flex items-start gap-3 px-3 py-3 rounded-xl"
              style={{ border: `1.5px solid ${colors.primary}30` }}
            >
              <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accent, color: colors.primary }}>
                {getServiceIcon(service.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                    {service.title}
                  </h4>
                  {service.price && (
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: colors.primary, fontFamily: font }}>
                      {service.price}
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                    {service.description}
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

    const getVideoTypeLabel = (videoType: string) => {
      switch (videoType) {
        case 'property_tour':
          return t('Property Tour');
        case 'neighborhood_guide':
          return t('Neighborhood Guide');
        case 'market_update':
          return t('Market Update');
        case 'client_testimonial':
          return t('Client Testimonial');
        case 'buying_tips':
          return t('Buying/Selling Tips');
        case 'agent_introduction':
          return t('Agent Introduction');
        default:
          return videoType?.replace(/_/g, ' ') || '';
      }
    };

    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;



    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Video size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t("Property Videos")}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div key={video.key} className="rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: colors.cardBg }}>
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
              <div className="p-4">
                <h4 className="font-medium text-base mb-2" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-sm mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {video.duration && (
                    <span className="text-sm" style={{ color: colors.text, fontFamily: font }}>
                      ⏱️ {video.duration}
                    </span>
                  )}
                  {video.video_type && (
                    <span className="text-xs px-2 py-1 rounded font-medium" style={{ backgroundColor: colors.accent, color: colors.primary, fontFamily: font }}>
                      🏠 {getVideoTypeLabel(video.video_type)}
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
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Youtube size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('YouTube Channel')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }} />
        </div>

        {/* Channel banner row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
            <Youtube size={22} style={{ color: 'white' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: colors.primary, fontFamily: font }}>
              {youtubeData.channel_name || 'Real Estate Channel'}
            </p>
            {youtubeData.subscriber_count && (
              <p className="text-xs" style={{ color: colors.text, fontFamily: font, opacity: 0.6 }}>
                {youtubeData.subscriber_count} {t('subscribers')}
              </p>
            )}
          </div>
          {youtubeData.channel_url && (
            <button
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
            >
              <Youtube size={12} />
              {t('Subscribe')}
            </button>
          )}
        </div>

        {/* Description */}
        {youtubeData.channel_description && (
          <p className="text-xs leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
            {youtubeData.channel_description}
          </p>
        )}

        {/* Latest video */}
        {youtubeData.latest_video_embed && (
          <div className="rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Property Video')}
              />
            </div>
          </div>
        )}

        {/* Playlist button */}
        {youtubeData.featured_playlist && (
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium cursor-pointer"
            style={{ border: `1.5px solid ${colors.primary}30`, color: colors.primary, fontFamily: font, backgroundColor: colors.accent }}
            onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
          >
            <Play size={13} />
            {t('View Property Tours')}
          </button>
        )}
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    const getTransactionLabel = (type: string) => {
      switch (type) {
        case 'buyer': return 'Buyer';
        case 'seller': return 'Seller';
        case 'both': return 'Buyer & Seller';
        case 'rental': return 'Rental';
        default: return type;
      }
    };

    return (
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        {/* Section header */}
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Star size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Client Testimonials')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }} />
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentReview * 100}%)` }}
          >
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0">
                <div
                  className="rounded-xl p-3"
                  style={{ border: `1.5px solid ${colors.primary}25`, backgroundColor: colors.cardBg || '#F7FAFC' }}
                >
                  {/* Quote + stars row */}
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-4xl leading-none font-serif select-none"
                      style={{ color: colors.primary, opacity: 0.2, lineHeight: 1 }}>
                      &ldquo;
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < parseInt(review.rating || 5) ? '#F59E0B' : 'transparent'}
                          stroke={i < parseInt(review.rating || 5) ? '#F59E0B' : colors.text + '30'}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-xs leading-relaxed mb-3" style={{ color: colors.text, fontFamily: font }}>
                    {review.review}
                  </p>

                  {/* Client row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar initial */}
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                      >
                        {(review.client_name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-none" style={{ color: colors.primary, fontFamily: font }}>
                          {review.client_name}
                        </p>
                        {review.transaction_type && (
                          <p className="text-xs mt-0.5" style={{ color: colors.text, fontFamily: font, opacity: 0.55 }}>
                            {getTransactionLabel(review.transaction_type)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {reviews.length > 1 && (
          <div className="flex justify-center mt-3 gap-1.5">
            {reviews.map((_, index) => (
              <div
                key={index}
                className="rounded-full transition-all"
                style={{
                  width: currentReview === index ? 16 : 6,
                  height: 6,
                  backgroundColor: currentReview === index ? colors.primary : colors.primary + '35'
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Globe size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t("Connect With Me")}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {socialLinks.map((link: any, index: number) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center justify-center py-2"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
                fontFamily: font
              }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <SocialIcon platform={link.platform} color={colors.primary} />
              <span className="ml-2 text-sm capitalize">{link.platform}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Calendar size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Schedule an Appointment')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }} />
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: `1.5px solid ${colors.primary}25` }}>
          {/* Top colored strip */}
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: colors.accent }}>
            <div className="flex items-center gap-2">
              <Calendar size={15} style={{ color: colors.primary }} />
              <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                {t('Book a Meeting')}
              </span>
            </div>
            <Button
              className="h-7 px-3 text-xs"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              {t('Schedule Appointment')}
            </Button>
          </div>

          {/* Types + notes */}
          {(appointmentsData.appointment_types || appointmentsData.appointment_notes) && (
            <div className="px-4 py-3 space-y-2">
              {appointmentsData.appointment_types && (
                <div className="flex flex-wrap gap-1.5">
                  {appointmentsData.appointment_types.split(',').map((type: string, index: number) => (
                    <span key={index} className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}>
                      {type.trim()}
                    </span>
                  ))}
                </div>
              )}
              {appointmentsData.appointment_notes && (
                <p className="text-sm mt-3" style={{ color: colors.text, fontFamily: font }}>
                  {appointmentsData.appointment_notes}
                </p>
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
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <MapPin size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t("Office Location")}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        <div className="space-y-3">
          {locationData.map_embed_url && (
            <RealEstateMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button
              className="w-full"
              variant="outline"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
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
    );
  };

  const renderMarketStatsSection = (statsData: any) => {
    if (!statsData.area_served) return null;

    return (
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <BarChart size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Market Statistics')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }} />
        </div>

        {/* Content wrapped in accent bg */}
        <div className="rounded-lg p-3" style={{ backgroundColor: colors.accent }}>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={13} style={{ color: colors.primary }} />
            <span className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
              {statsData.area_served}
            </span>
          </div>

          {(statsData.avg_home_price || statsData.avg_days_on_market) && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {statsData.avg_home_price && (
                <div className="rounded p-2" style={{ backgroundColor: 'white' }}>
                  <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>{t('Avg. Home Price')}</p>
                  <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>{statsData.avg_home_price}</p>
                </div>
              )}
              {statsData.avg_days_on_market && (
                <div className="rounded p-2" style={{ backgroundColor: 'white' }}>
                  <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>{t('Avg. Days on Market')}</p>
                  <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>{statsData.avg_days_on_market}</p>
                </div>
              )}
            </div>
          )}

          {statsData.market_description && (
            <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {statsData.market_description}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Smartphone size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t("Download Our App")}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
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
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <Mail size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{formData.form_title}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }}></div>
        </div>

        <div className="space-y-3">
          {formData.form_description && (
            <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}

          <Button
            className="w-full"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("Send Message")}
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;

    return (
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
              <Home size={18} style={{ color: colors.primary }} />
            </div>
            <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{customHtmlData.section_title}</h3>
            <div className="ml-3 flex-grow h-1" style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
              borderRadius: '4px'
            }}></div>
          </div>
        )}
        <div
          className="custom-html-content p-4 rounded-lg"
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
                background-color: ${colors.accent};
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

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-5 py-5 border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-md mr-3" style={{ backgroundColor: colors.accent }}>
            <QrCode size={18} style={{ color: colors.primary }} />
          </div>
          <h3 className="font-semibold" style={{ color: colors.primary, fontFamily: font }}>{t('Share QR Code')}</h3>
          <div className="ml-3 flex-grow h-1" style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            borderRadius: '4px'
          }} />
        </div>

        <div className="flex flex-col items-center text-center p-4 rounded-xl" style={{ border: `1.5px solid ${colors.primary}25` }}>

          {qrData.qr_title && (
            <h4 className="font-semibold text-sm mb-1" style={{ color: colors.primary, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}

          {qrData.qr_description && (
            <p className="text-sm mb-4" style={{ color: colors.text, fontFamily: font, opacity: 0.7 }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            className="px-6"
            style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('Share QR Code')}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;

    return (
      <div className="px-6 py-4 text-center border-b" style={{ borderColor: colors.borderColor || '#E2E8F0' }}>
        <p className="text-sm italic" style={{ color: colors.text, fontFamily: font }}>
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
      <div className="p-6 space-y-3">
        {hasContactButton && (
          <Button
            className="w-full"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
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
            {actionData.appointment_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
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
                title: data.title || configSections.header?.title || '',
                email: data.email || configSections.contact?.email || '',
                phone: data.phone || configSections.contact?.phone || '',
                website: data.website || configSections.contact?.website || '',
                address: configSections.contact?.office_address || ''
              };
              import('@/utils/vcfGenerator').then(module => {
                module.downloadVCF(contactData);
              });
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
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

        {copyrightData.disclaimer && (
          <p className="text-xs mt-2" style={{ color: colors.text + '60', fontFamily: font }}>
            {copyrightData.disclaimer}
          </p>
        )}
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
      background: colors.background || '#FFFFFF',
      color: colors.text || '#2D3748'
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

          {copyrightSection.disclaimer && (
            <p className="text-xs mt-2" style={{ color: colors.text + '60', fontFamily: font }}>
              {copyrightSection.disclaimer}
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
