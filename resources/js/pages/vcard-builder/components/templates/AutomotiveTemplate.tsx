import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Wrench, Car, Shield, Clock, Star, PhoneCall, Video, Play, Youtube, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';

import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface AutomotiveTemplateProps {
  data: any;
  template: any;
}

const AutomotiveMapEmbed = React.memo(function AutomotiveMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function AutomotiveTemplate({ data, template }: AutomotiveTemplateProps) {
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
  const [currentLanguage, setCurrentLanguage] = React.useState(configSections.language?.template_language || i18n.language || 'en');

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

  const colors = configSections.colors || template?.defaultColors || { primary: '#DC2626', secondary: '#EF4444', text: '#F5F5F5' };
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
  const allSections = getBusinessTemplate('automotive')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header': return renderHeaderSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'about': return renderAboutSection(sectionData);
      case 'services': return renderServicesSection(sectionData);
      case 'certifications': return renderCertificationsSection(sectionData);
      case 'videos': return renderVideosSection(sectionData);
      case 'youtube': return renderYouTubeSection(sectionData);
      case 'social': return renderSocialSection(sectionData);
      case 'business_hours': return renderBusinessHoursSection(sectionData);
      case 'testimonials': return renderTestimonialsSection(sectionData);
      case 'appointments': return renderAppointmentsSection(sectionData);
      case 'google_map': return renderLocationSection(sectionData);
      case 'app_download': return renderAppDownloadSection(sectionData);
      case 'contact_form': return renderContactFormSection(sectionData);
      case 'custom_html': return renderCustomHtmlSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      case 'thank_you': return renderThankYouSection(sectionData);
      case 'action_buttons': return renderActionButtonsSection(sectionData);
      default: return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative rounded-t-2xl" style={{ background: `linear-gradient(45deg, ${colors.background}, ${colors.cardBg})` }}>
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 60 60" className="fill-current" style={{ color: colors.primary }}>
          <pattern id="tire-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="15" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="1"/>
            <path d="M3 15h24M15 3v24" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#tire-pattern)" />
        </svg>
      </div>
      
      <div className="px-6 py-6 relative">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 rounded-lg flex items-center justify-center shadow-2xl" style={{ 
            backgroundColor: colors.primary,
            border: `2px solid ${colors.secondary}`
          }}>
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Logo" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <Car className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-0.5" style={{ color: colors.text, fontFamily: font }}>
              {headerData.name || data.name || 'Auto Shop'}
            </h1>
            <p className="text-sm font-semibold mb-1" style={{ color: colors.primary, fontFamily: font }}>
              {headerData.title || 'Professional Auto Services'}
            </p>
            {headerData.tagline && (
              <p className="text-sm leading-relaxed" style={{ color: colors.text + 'BB', fontFamily: font }}>
                {headerData.tagline}
              </p>
            )}
          </div>
        </div>
        
        {/* Language Selector */}
       {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="absolute top-4 right-4">
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center cursor-pointer"
                style={{ 
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text
                }}
              >
                <span className="text-sm">
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
              </button>
              
              {showLanguageSelector && (
                <>
                  <div 
                    className="fixed inset-0" 
                    style={{ zIndex: 40 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div 
                    className="fixed inset-0" 
                    style={{ zIndex: 40 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div 
                    className="absolute right-0 top-full mt-1 rounded border shadow-xl py-1 w-40 max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.borderColor,
                      zIndex: 99999
                    }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-50 cursor-pointer"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '10' : 'transparent',
                          color: colors.text
                        }}
                      >
                        <span>
                          {String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}
                        </span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: `1px solid ${colors.primary}40` }}>
          <div className="flex items-center space-x-4">
            {headerData.badge_1 && (
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" style={{ color: colors.primary }} />
                <span className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{headerData.badge_1}</span>
              </div>
            )}
            {headerData.badge_2 && (
              <div className="flex items-center space-x-2">
                <Wrench className="w-4 h-4" style={{ color: colors.primary }} />
                <span className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{headerData.badge_2}</span>
              </div>
            )}
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

  const renderContactSection = (contactData: any) => {
    const phone = contactData.phone || data.phone;
    const email = contactData.email || data.email;
    const website = contactData.website || data.website;
    const location = contactData.location;
    if (!phone && !email && !website && !location) return null;

    const contactItems = [
      phone && {
        icon: <Phone className="w-4 h-4" />,
        label: t('Phone'),
        value: phone,
        href: `tel:${phone}`,
      },
      email && {
        icon: <Mail className="w-4 h-4" />,
        label: t('Email'),
        value: email,
        href: `mailto:${email}`,
      },
      website && {
        icon: <Globe className="w-4 h-4" />,
        label: t('Website'),
        value: website.replace(/^https?:\/\//, ''),
        href: website,
        external: true,
      },
      location && {
        icon: <MapPin className="w-4 h-4" />,
        label: t('Location'),
        value: location,
        href: null,
      },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null; external?: boolean }[];

    return (
      <>
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})` }} />
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Phone className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Contact Information')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href || undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={!item.href ? (e) => e.preventDefault() : undefined}
                className="flex items-center space-x-3 p-3 rounded-xl transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.primary}25`,
                  textDecoration: 'none',
                  cursor: item.href ? 'pointer' : 'default',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.primary + '18' }}>
                  <span style={{ color: colors.primary }}>{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium mb-0.5" style={{ color: colors.text + '70', fontFamily: font }}>{item.label}</p>
                  <p className="text-xs font-semibold" style={{ color: colors.text, fontFamily: font }}>{item.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    const description = aboutData.description || data.description;
    if (!description && !aboutData.specialties && !aboutData.experience) return null;

    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }} />
        <div className="px-6 py-5" style={{ backgroundColor: colors.cardBg }}>

          {/* Section Header */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Wrench className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('About Our Shop')}</h3>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {description}
            </p>
          )}

          {/* Specialties */}
          {aboutData.specialties && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: colors.primary, fontFamily: font }}>{t('Specialties')}</p>
              <div className="flex flex-wrap gap-1.5">
                {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                  <span key={index} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{
                    backgroundColor: colors.primary + '15',
                    color: colors.primary,
                    border: `1px solid ${colors.primary}30`,
                    fontFamily: font
                  }}>
                    {specialty.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience stat */}
          {aboutData.experience && (
            <div className="flex items-center space-x-3 p-2 rounded" style={{ backgroundColor: colors.background }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <span className="text-white text-sm font-bold" style={{ fontFamily: font }}>{aboutData.experience}</span>
              </div>
              <span className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{t('Years of Trusted Service')}</span>
            </div>
          )}
        </div>
      </>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Car className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Our Services')}</h3>
          </div>
          <div className="space-y-3">
            {services.map((service: any, index: number) => (
              <div key={index} className="p-3 rounded-lg" style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}20`
              }}>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>
                    {service.title}
                  </h4>
                  {service.price && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md ml-2 flex-shrink-0" style={{
                      color: colors.primary,
                      backgroundColor: colors.primary + '15',
                      border: `1px solid ${colors.primary}30`,
                      fontFamily: font
                    }}>
                      {service.price}
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm leading-relaxed" style={{ color: colors.text + 'BB', fontFamily: font }}>
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderCertificationsSection = (certData: any) => {
    const certs = certData.cert_list || [];
    if (!Array.isArray(certs) || certs.length === 0) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Shield className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Certifications')}</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {certs.map((cert: any, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg" style={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.primary}20`
              }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: colors.primary }} />
                <div className="min-w-0">
                  <p className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>{cert.title}</p>
                  {cert.description && (
                    <p className="text-sm leading-relaxed" style={{ color: colors.text + 'BB', fontFamily: font }}>{cert.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
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
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Video className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Service Videos')}</h3>
          </div>
          <div className="space-y-4">
            {videoContent.map((video: any) => {
              const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
              const thumbUrl = video.thumbnail
                ? getImageDisplayUrl(video.thumbnail)
                : getYouTubeThumbnail(video.embed_url || '');
              return (
                <div key={video.key} className="rounded-xl overflow-hidden" style={{
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.primary}20`
                }}>
                  {/* Thumbnail / Player */}
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
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                          <Video className="w-8 h-8" style={{ color: colors.primary }} />
                        </div>
                      )}
                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.30)' }}>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 4px 16px ${colors.primary}60` }}>
                            <Play className="w-5 h-5 text-white ml-0.5" />
                          </div>
                        </div>
                      )}
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff', fontFamily: font }}>
                          {video.duration}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Info */}
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>
                        {video.title}
                      </h4>
                      {video.video_type && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md ml-2 flex-shrink-0 capitalize" style={{
                          backgroundColor: colors.primary + '15',
                          color: colors.primary,
                          border: `1px solid ${colors.primary}30`,
                          fontFamily: font
                        }}>
                          {video.video_type.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                    {video.description && (
                      <p className="text-sm leading-relaxed" style={{ color: colors.text + 'BB', fontFamily: font }}>
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>

          {/* Section Header */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Youtube className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('YouTube Channel')}</h3>
          </div>

          {/* Channel Info Card */}
          <div className="flex items-center space-x-3 p-3 rounded-xl mb-3" style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.primary}20`
          }}>
            <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || 'Auto Shop TV'}
              </p>
              {youtubeData.subscriber_count && (
                <p className="text-xs" style={{ color: colors.text + '80', fontFamily: font }}>
                  {youtubeData.subscriber_count} {t('subscribers')}
                </p>
              )}
            </div>
            {youtubeData.channel_url && (
              <button
                className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 cursor-pointer"
                style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                {t('Subscribe')}
              </button>
            )}
          </div>

          {/* Channel Description */}
          {youtubeData.channel_description && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'BB', fontFamily: font }}>
              {youtubeData.channel_description}
            </p>
          )}

          {/* Latest Video */}
          {youtubeData.latest_video_embed && (
            <div className="rounded-xl overflow-hidden mb-3" style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.primary}20`
            }}>
              <div className="flex items-center space-x-2 px-3 py-2" style={{ borderBottom: `1px solid ${colors.primary}15` }}>
                <Play className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                <p className="text-xs font-semibold" style={{ color: colors.text, fontFamily: font }}>{t('Latest Video')}</p>
              </div>
              <div className="w-full relative overflow-hidden" style={{ paddingBottom: '45%', height: 0 }}>
                <div
                  className="absolute inset-0 w-full h-full"
                  ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')}
                />
              </div>
            </div>
          )}

          {/* Playlist Button */}
          {youtubeData.featured_playlist && (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
            >
              <Play className="w-3.5 h-3.5 mr-2" />
              {t('View Auto Tips Playlist')}
            </Button>
          )}
        </div>
      </>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Globe className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Find Us Online')}</h3>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {socialLinks.map((link: any, index: number) => (
              <button
                key={index}
                className="flex flex-col items-center space-y-1 cursor-pointer"
                onClick={() => link.url && typeof window !== 'undefined' && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                  backgroundColor: colors.primary + '15',
                  border: `1px solid ${colors.primary}25`
                }}>
                  <SocialIcon platform={link.platform} color={colors.primary} size={18} />
                </div>
                <span className="text-xs font-medium capitalize truncate w-full text-center pb-2" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {link.platform}
                </span>
              </button>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Clock className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Shop Hours')}</h3>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.primary}20` }}>
            {hours.slice(0, 7).map((hour: any, index: number) => {
              const isToday = hour.day === today;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{
                    backgroundColor: isToday ? colors.primary + '12' : colors.cardBg,
                    borderBottom: index < 6 ? `1px solid ${colors.primary}10` : 'none'
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`capitalize text-sm ${isToday ? 'font-bold' : 'font-medium'}`}
                      style={{ color: isToday ? colors.primary : colors.text, fontFamily: font }}
                    >
                      {t(hour.day)}
                    </span>
                    {isToday && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}>
                        {t('Today')}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: hour.is_closed ? colors.text + '50' : isToday ? colors.primary : colors.text + 'CC', fontFamily: font }}
                  >
                    {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Star className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Customer Reviews')}</h3>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < parseInt(review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      {review.vehicle && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>
                          {review.vehicle}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      "{review.review}"
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: colors.primary }}>
                        {review.client_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                        {review.client_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {reviews.length > 1 && (
              <div className="flex justify-center mt-3 space-x-1.5">
                {reviews.map((_: any, dotIndex: number) => (
                  <div
                    key={dotIndex}
                    className="rounded-full transition-all duration-300 cursor-pointer"
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
      </>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    <>
      <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <Calendar className="w-3 h-3 text-white" />
          </div>
          <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Schedule Service')}</h3>
        </div>
        <div className="space-y-2">
            <Button
              className="w-full font-semibold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('Book Appointment')}
            </Button>
            {appointmentsData?.emergency_phone && (
              <Button
                variant="outline"
                className="w-full"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== 'undefined' && window.open(`tel:${appointmentsData.emergency_phone}`, '_self')}
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                {t('Emergency/Towing')}
              </Button>
            )}
          </div>
      </div>
    </>
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Visit Our Shop')}</h3>
          </div>
          {locationData.map_embed_url && (
            <div className="rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${colors.primary}20` }}>
              <AutomotiveMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          {locationData.directions_url && (
            <Button
              className="w-full font-semibold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t('Get Directions')}
            </Button>
          )}
        </div>
      </>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Phone className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{t('Download Our App')}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {appData.app_store_url && (
              <button
                className="flex items-center justify-center p-3 rounded-xl cursor-pointer"
                style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}
                onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                <span className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>App Store</span>
              </button>
            )}
            {appData.play_store_url && (
              <button
                className="flex items-center justify-center p-3 rounded-xl cursor-pointer"
                style={{ backgroundColor: colors.background, border: `1px solid ${colors.primary}20` }}
                onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                <span className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>Play Store</span>
              </button>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <Mail className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{formData.form_title}</h3>
          </div>
          {formData.form_description && (
            <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text + 'BB', fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button
            className="w-full font-semibold"
            style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('Get Free Estimate')}
          </Button>
        </div>
      </>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {customHtmlData.show_title && customHtmlData.section_title && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <Wrench className="w-3 h-3 text-white" />
              </div>
              <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                {customHtmlData.section_title}
              </h3>
            </div>
          )}
          <div 
            className="custom-html-content p-3 rounded-lg" 
            style={{ 
              backgroundColor: colors.background,
              border: `1px solid ${colors.primary}40`,
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
      </>
    );
  };

  const renderActionButtonsSection = (actionButtonsData: any) => {
    const hasAnyButton = actionButtonsData.contact_button_text || actionButtonsData.appointment_button_text || actionButtonsData.save_contact_button_text;
    if (!hasAnyButton) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4 space-y-2" style={{ backgroundColor: colors.cardBg }}>
          {actionButtonsData.contact_button_text && (
            <Button
              className="w-full font-semibold"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <Wrench className="w-4 h-4 mr-2" />
              {actionButtonsData.contact_button_text}
            </Button>
          )}
          {actionButtonsData.appointment_button_text && (
            <Button
              className="w-full"
              variant="outline"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {actionButtonsData.appointment_button_text}
            </Button>
          )}
          {actionButtonsData.save_contact_button_text && (
            <Button
              className="w-full"
              variant="outline"
              style={{ borderColor: colors.primary + '60', color: colors.primary, fontFamily: font }}
              onClick={() => {
                const contactData = {
                  name: data.name || configSections.header?.name || '',
                  title: configSections.header?.title || t('Auto Service'),
                  email: data.email || configSections.contact?.email || '',
                  phone: data.phone || configSections.contact?.phone || '',
                  website: data.website || configSections.contact?.website || '',
                  location: configSections.contact?.location || ''
                };
                import('@/utils/vcfGenerator').then(module => { module.downloadVCF(contactData); });
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {actionButtonsData.save_contact_button_text}
            </Button>
          )}
        </div>
      </>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    return (
      <>
        <div className="h-px" style={{ backgroundColor: colors.primary + '30' }}></div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <QrCode className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>{qrData.qr_title || t('Share QR Code')}</h3>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl cursor-pointer" style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.primary}20`
          }}>
            <div className="flex-1 min-w-0">
              {qrData.qr_description && (
                <p className="text-sm leading-relaxed mb-2" style={{ color: colors.text + 'BB', fontFamily: font }}>
                  {qrData.qr_description}
                </p>
              )}
              <Button
                size="sm"
                className="w-full"
                style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
                onClick={() => setShowQrModal(true)}
              >
                <QrCode className="w-3.5 h-3.5 mr-2" />
                {t('Share QR Code')}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="rounded-xl p-4 text-center" style={{
          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
          border: `1px solid ${colors.primary}25`
        }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: colors.primary }}>
            <Star className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const copyrightSection = configSections.copyright;
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
 
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ 
      fontFamily: font,
      backgroundColor: colors.background,
      border: `2px solid ${colors.primary}40`,
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
        <div className="px-6 py-3" style={{ backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.primary}15` }}>
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