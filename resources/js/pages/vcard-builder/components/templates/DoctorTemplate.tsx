import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';

import { Mail, Phone, Globe, MapPin, Clock, Star, Stethoscope, Calendar, Download, UserPlus, Heart, Activity, Shield, Video, Play, Youtube, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';

interface DoctorTemplateProps {
  data: any;
  template: any;
}

const DoctorMapEmbed = React.memo(function DoctorMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="overflow-hidden rounded-lg"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function DoctorTemplate({ data, template }: DoctorTemplateProps) {
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
  }, [configSections.testimonials]);

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

      const sanitizedVideo = sanitizeVideoData(video);
      const videoData = sanitizedVideo?.embed_url ? extractVideoUrl(sanitizedVideo.embed_url) : null;
      return { ...sanitizedVideo, videoData, key: `video-${index}-${sanitizedVideo?.title || ''}-${sanitizedVideo?.embed_url || ''}` };
    });
  }, [configSections.videos?.video_list]);
  const colors = configSections.colors || template?.defaultColors || {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#DBEAFE',
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0'
  };
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Inter, sans-serif';
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
  }, [font]);


  const globalStyle = {
    fontFamily: font
  };
  const sectionBorderColor = colors.borderColor || '#E2E8F0';
  const sectionDividerStyle = { borderBottom: `1px solid ${sectionBorderColor}` };
  const sectionSpacingClass = 'px-6 py-5';
  const cardSpacingClass = 'rounded-lg p-3.5';
  const mutedTextColor = `${colors.text || '#1E293B'}B8`;
  const bodyTextStyle = { color: colors.text || '#1E293B', fontFamily: font, lineHeight: 1.7 };
  const mutedBodyTextStyle = { color: mutedTextColor, fontFamily: font, lineHeight: 1.65 };

  const renderSectionTitle = (title: string, icon?: React.ReactNode) => (
    <h3
      className="mb-4 flex items-center gap-2 text-sm font-semibold"
      style={{ color: colors.text || '#1E293B', ...globalStyle }}
    >
      {icon ? (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${colors.primary}14` }}>
          {icon}
        </span>
      ) : (
        <span className="h-4 w-1 rounded-full" style={{ backgroundColor: colors.primary }} />
      )}
      <span>{title}</span>
    </h3>
  );

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header': return renderHeaderSection(sectionData);
      case 'about': return renderAboutSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'business_hours': return renderBusinessHoursSection(sectionData);
      case 'specialties': return renderSpecialtiesSection(sectionData);
      case 'services': return renderServicesSection(sectionData);
      case 'videos': return renderVideosSection();
      case 'youtube': return renderYouTubeSection(sectionData);
      case 'appointments': return renderAppointmentsSection(sectionData);
      case 'testimonials': return renderTestimonialsSection(sectionData);
      case 'social': return renderSocialSection(sectionData);
      case 'google_map': return renderLocationSection(sectionData);
      case 'app_download': return renderAppDownloadSection(sectionData);
      case 'contact_form': return renderContactFormSection(sectionData);
      case 'custom_html': return renderCustomHtmlSection(sectionData);
      case 'qr_share': return renderQrShareSection(sectionData);
      case 'thank_you': return renderThankYouSection(sectionData);
      case 'action_buttons': return renderActionButtonsSection(sectionData);
      case 'copyright': return renderCopyrightSection();
      default: return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative overflow-visible rounded-t-lg border-b-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-gray-900" style={{ borderColor: colors.primary }}>
      {/* Medical Cross Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 60 60" className="fill-current" style={{ color: colors.primary }}>
          <pattern id="medical-cross" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M12 8h6v6h6v6h-6v6h-6v-6H6v-6h6V8z" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#medical-cross)" />
        </svg>
      </div>

      <div className="relative h-32 w-full" style={{ background: `linear-gradient(135deg, ${colors.background || '#F8FAFC'} 0%, ${colors.primary}15 100%)` }}>
        <div className="absolute left-4 top-4">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <span className="text-xs font-semibold tracking-wide" style={{ color: colors.primary }}>
              {headerData.professional_badge || 'HEALTHCARE PROFESSIONAL'}
            </span>
          </div>
        </div>
        <div
          className="absolute right-4 top-4 flex items-center gap-2 z-30"
          style={{ overflow: 'visible' }}
        > 
          {/* Language Selector */}
          {(configSections?.language && configSections?.language?.enable_language_switcher) && (
            <div className="relative"   style={{ overflow: 'visible' }}>
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm cursor-pointer transition-all hover:shadow-md"
                style={{
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <span className="text-sm">
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
              </button>

              {showLanguageSelector && (
                <>
                  <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-2 rounded-lg border shadow-xl py-1 w-40 max-h-60 overflow-y-auto z-[9999]"
                    style={{
                      backgroundColor: colors.cardBg || '#FFFFFF',
                      borderColor: colors.borderColor
                    }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '10' : 'transparent',
                          color: colors.text
                        }}
                      >
                        <span className="text-base">
                          {String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}
                        </span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
            <Stethoscope className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
        </div>
      </div>

      <div className="relative -mt-10 px-6 pb-7">
        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-white shadow-lg" style={{ borderColor: sectionBorderColor || colors.primary }}>
            {headerData.profile_image ? (
              <img
                src={getImageDisplayUrl(headerData.profile_image)}
                alt="Profile"
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-lg" style={{ backgroundColor: colors.accent }}>
                <Stethoscope className="w-9 h-9" style={{ color: colors.primary }} />
              </div>
            )}
          </div>
          <div className="flex-1 pt-2" style={globalStyle}>
            <div className="space-y-2.5">
              <h1 className="text-[22px] font-semibold leading-tight" style={{ color: colors.text || '#1E293B', ...globalStyle }}>
                {headerData.name || data.name || 'Dr. Medical Professional'}
              </h1>
              <p className="text-sm font-medium" style={{ color: colors.primary, ...globalStyle }}>
                {headerData.title || 'MD, Medical Specialist'}
              </p>
              {headerData.specialization && (
                <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-sm" style={{ color: colors.text, ...globalStyle }}>
                  {headerData.specialization}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className={sectionSpacingClass} style={sectionDividerStyle}>
      {renderSectionTitle(t('Contact Information'))}
      <div className="space-y-3.5">
        {(contactData.phone || data.phone) && (
          <div className={`flex items-center gap-3 ${cardSpacingClass}`} style={{ backgroundColor: colors.accent || '#F8FAFC' }}>
            <div className="p-1.5 rounded-md" style={{ backgroundColor: colors.primary + '20' }}>
              <Phone className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            </div>
            <a
              href={`tel:${contactData.phone || data.phone}`}
              className="text-sm font-medium"
              style={{ color: colors.text || '#1E293B', ...globalStyle }}
            >
              {contactData.phone || data.phone}
            </a>
          </div>
        )}
        {contactData.emergency_phone && (
          <div className={`flex items-center gap-3 ${cardSpacingClass}`} style={{ backgroundColor: '#FEF2F2' }}>
            <div className="p-1.5 rounded-md" style={{ backgroundColor: '#DC2626' + '20' }}>
              <Phone className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium" style={{ color: '#DC2626', ...globalStyle }}>{t('Emergency')}</div>
              <a
                href={`tel:${contactData.emergency_phone}`}
                className="text-sm font-medium"
                style={{ color: colors.text || '#1E293B', ...globalStyle }}
              >
                {contactData.emergency_phone}
              </a>
            </div>
          </div>
        )}
        {(contactData.email || data.email) && (
          <div className={`flex items-center gap-3 ${cardSpacingClass}`} style={{ backgroundColor: colors.accent || '#F8FAFC' }}>
            <div className="p-1.5 rounded-md" style={{ backgroundColor: colors.primary + '20' }}>
              <Mail className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            </div>
            <a
              href={`mailto:${contactData.email || data.email}`}
              className="text-sm font-medium"
              style={{ color: colors.text || '#1E293B', ...globalStyle }}
            >
              {contactData.email || data.email}
            </a>
          </div>
        )}
        {(contactData.website || data.website) && (
          <div className={`flex items-center gap-3 ${cardSpacingClass}`} style={{ backgroundColor: colors.accent || '#F8FAFC' }}>
            <div className="p-1.5 rounded-md" style={{ backgroundColor: colors.primary + '20' }}>
              <Globe className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            </div>
            <a
              href={contactData.website || data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
              style={{ color: colors.text || '#1E293B', ...globalStyle }}
            >
              {(contactData.website || data.website).replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        {contactData.clinic_address && (
          <div className={`flex items-center gap-3 ${cardSpacingClass}`} style={{ backgroundColor: colors.accent || '#F8FAFC' }}>
            <div className="p-1.5 rounded-md" style={{ backgroundColor: colors.primary + '20' }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm font-medium" style={{ color: colors.text || '#1E293B', ...globalStyle }}>{contactData.clinic_address}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !aboutData.bio && !data.description) return null;
    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('About'))}
        <div className="space-y-4">
          <p className="text-sm" style={bodyTextStyle}>
            {aboutData.description || aboutData.bio || data.description}
          </p>

          {(aboutData.qualifications || aboutData.experience_years) && (
            <div className="space-y-3">
              {aboutData.qualifications && (
                <div>
                  <p className="mb-2 text-sm font-semibold" style={{ color: colors.primary, ...globalStyle }}>
                    {t('Qualifications')}:
                  </p>
                  <p className="text-[15px]" style={bodyTextStyle}>
                    {aboutData.qualifications}
                  </p>
                </div>
              )}
              {aboutData.experience_years && (
                <div className={aboutData.qualifications ? 'pt-1' : ''}>
                  <p className="text-sm font-medium" style={{ color: colors.text, ...globalStyle }}>
                    {t('Experience')}: {aboutData.experience_years} {t('years')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSpecialtiesSection = (specialtiesData: any) => {
    if (!Array.isArray(specialtiesData.specialty_list) || specialtiesData.specialty_list.length === 0) return null;
    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Medical Specialties'))}
        <div className="space-y-3">
          {specialtiesData.specialty_list.slice(0, 4).map((specialty: any, index: number) => (
            <div
              key={index}
              className="rounded-lg px-4 py-3"
              style={{ border: `1px solid ${colors.primary}20` }}
            >
              <div className="min-w-0 space-y-1">
                <h4 className="text-sm font-semibold" style={{ color: colors.text, ...globalStyle }}>
                  {specialty.name}
                </h4>
                <p className="text-xs" style={mutedBodyTextStyle}>
                  {specialty.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || servicesData.treatments;
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Medical Services'))}
        <div className="space-y-3">
          {services.slice(0, 4).map((service: any, index: number) => (
            <div
              key={index}
              className="rounded-lg px-4 py-3"
              style={{ border: `1px solid ${colors.primary}20` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="block text-sm font-semibold" style={{ color: colors.text, ...globalStyle }}>
                    {service.name}
                  </span>
                  {service.description && (
                    <p className="text-xs" style={mutedBodyTextStyle}>
                      {service.description}
                    </p>
                  )}
                </div>
                {service.duration && (
                  <span
                    className="shrink-0 text-xs font-medium"
                    style={{ color: colors.primary, ...globalStyle }}
                  >
                    {service.duration}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    if (!Array.isArray(hoursData.hours) || hoursData.hours.length === 0) return null;
    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Clinic Hours'))}

        <div className="space-y-2.5">
          {hoursData.hours.slice(0, 7).map((hour: any, index: number) => (
            <div
              key={index}
              className="rounded-lg px-3 py-2.5"
              style={{
                color: colors.text,
                border: `1px solid ${colors.primary}24`
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold capitalize" style={{ color: colors.text, ...globalStyle }}>
                    {t(hour.day)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: hour.is_closed ? mutedTextColor : colors.primary, ...globalStyle }}>
                    {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                  </p>
                  {!hour.is_closed && hour.appointment_only && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide" style={{ color: mutedTextColor, ...globalStyle }}>
                      {t('By Appt')}
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

  const renderVideosSection = () => {
    if (!videoContent || videoContent.length === 0) return null;

    const getYouTubeThumbnail = (embedUrl: string) => {
      if (!embedUrl) return null;
      const srcMatch = embedUrl.match(/src=["']([^"']+)["']/i);
      const url = srcMatch ? srcMatch[1] : embedUrl;
      const embedMatch = url.match(/embed\/([^?&]+)/);
      const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      const videoId = embedMatch?.[1] || watchMatch?.[1] || null;
      return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
    };

    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Educational Videos'))}
        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div key={video.key} className="overflow-hidden rounded-lg" style={{ backgroundColor: colors.accent }}>
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
              <div className="space-y-2 p-4">
                <h4 className="text-sm font-semibold" style={{ color: colors.text, ...globalStyle }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-xs" style={mutedBodyTextStyle}>
                    {video.description}
                  </p>
                )}
                <div className="flex items-center justify-between gap-3">
                  {video.duration && (
                    <span className="text-xs" style={{ color: mutedTextColor, ...globalStyle }}>
                      ⏱️ {video.duration}
                    </span>
                  )}
                  {video.video_type && (
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: colors.primary + '20', color: colors.primary, ...globalStyle }}>
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
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('YouTube Channel'))}
        <div className="rounded-lg p-4" style={{ backgroundColor: colors.accent }}>
          <div className="mb-4 flex items-center gap-3">

            {youtubeData.latest_video_embed && (
              <div className="mb-4 overflow-hidden rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
                <div className="p-3 mb-2">
                  <h4 className="font-bold text-sm flex items-center" style={{ color: colors.text, fontFamily: font }}>
                    <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                    {t("Latest Video")}
                  </h4>
                </div>
                <div className="w-full relative overflow-hidden" style={{ paddingBottom: "56.25%", height: 0 }}>
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
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm" style={{ color: colors.text, ...globalStyle }}>
                {youtubeData.channel_name || 'Medical Channel'}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="text-xs" style={{ color: colors.text + 'CC', ...globalStyle }}>
                  📊 {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>
          {youtubeData.channel_description && (
            <p className="mb-4 text-xs" style={mutedBodyTextStyle}>
              {youtubeData.channel_description}
            </p>
          )}
          <div className="space-y-2.5">
            {youtubeData.channel_url && (
              <Button
                size="sm"
                className="w-full rounded-lg"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                <Youtube className="w-4 h-4 mr-2" />
                {t('Visit Channel')}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-lg"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                📋 {t("Health Tips")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    const calendarLink =
      appointmentsData?.online_booking_url ||
      appointmentsData?.calendar_link ||
      appointmentsData?.booking_url ||
      configSections.appointments?.online_booking_url ||
      configSections.appointments?.calendar_link ||
      configSections.appointments?.booking_url;

    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Book Appointment'))}
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: `${colors.primary}20`,
            backgroundColor: `${colors.primary}04`
          }}
        >
          <div className="mb-4 flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${colors.primary}12` }}
            >
              <Calendar className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold" style={{ color: colors.text, ...globalStyle }}>
                {appointmentsData?.section_title || t('Schedule a Consultation')}
              </p>
              <p className="mt-1 text-[13px]" style={mutedBodyTextStyle}>
                {appointmentsData?.section_description || t('Choose your preferred consultation method and connect with the doctor easily.')}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <Button
              size="sm"
              className="w-full rounded-lg"
              style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}
              onClick={() => {
                if (calendarLink) {
                  window.open(calendarLink, '_blank', 'noopener,noreferrer');
                } else {
                  handleAppointmentBooking(configSections.appointments);
                }
              }}
            >
              {t('Book Online')}
            </Button>
            {(appointmentsData?.calendar_link || appointmentsData?.booking_url) && (
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-lg"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(appointmentsData.calendar_link || appointmentsData.booking_url, '_blank', 'noopener,noreferrer')}
              >
                {t('View Calendar')}
              </Button>
            )}
            {appointmentsData?.booking_phone && (
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-lg"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(`tel:${appointmentsData.booking_phone}`, '_self')}
              >
                {t('Call')}: {appointmentsData.booking_phone}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    if (!Array.isArray(testimonialsData.reviews) || testimonialsData.reviews.length === 0) return null;

    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Patient Reviews'))}

        <div className="space-y-3">
          {testimonialsData.reviews.map((review: any, index: number) => (
            <div
              key={index}
              className="rounded-lg px-4 py-3"
              style={{
                border: `1px solid ${colors.primary}18`,
                backgroundColor: `${colors.accent || '#F8FAFC'}B5`
              }}
            >
              <div className="mb-2">
                <p className="text-sm font-semibold" style={{ color: colors.text, ...globalStyle }}>
                  {review.patient_name || review.client_name}
                </p>
                <div className="mt-1 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < parseInt(review.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm" style={mutedBodyTextStyle}>
                {review.review}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    if (!Array.isArray(socialData.social_links) || socialData.social_links.length === 0) return null;
    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Professional Profiles'))}
        <div className="grid grid-cols-2 gap-3">
          {socialData.social_links.map((link: any, index: number) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              className="justify-start rounded-lg"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <SocialIcon platform={link.platform} color={colors.primary} />
              <span className="text-xs capitalize ml-2" style={globalStyle}>{link.platform}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Medical App'))}
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              {t("App Store")}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
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
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(formData.form_title)}
        {formData.form_description && (
          <p className="mb-4 text-sm" style={mutedBodyTextStyle}>{formData.form_description}</p>
        )}
        <Button
          size="sm"
          variant="outline"
          className="w-full rounded-lg"
          style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t('Contact Doctor')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-4">
        <p className="text-xs text-center" style={{ color: colors.text + '80', ...globalStyle }}>{thankYouData.message}</p>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;

    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          renderSectionTitle(customHtmlData.section_title)
        )}
        <div
          className="custom-html-content rounded-lg p-4"
          style={{
            backgroundColor: colors.accent,
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
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(qrData.qr_title || t('Share Doctor Info'))}
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: `${colors.primary}20`,
            backgroundColor: colors.cardBg || '#FFFFFF'
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${colors.primary}12` }}
            >
              <QrCode className="h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold" style={{ color: colors.text, ...globalStyle }}>
                {t('Share Doctor Info')}
              </p>
              <p className="mt-1 text-xs" style={mutedBodyTextStyle}>
                {qrData.qr_description || t('Let patients scan and quickly save or share your contact details.')}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="mt-4 w-full rounded-lg"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t('Open Share QR')}
          </Button>
        </div>
      </div>
    );
  };

  const renderCopyrightSection = () => {
    // This function is no longer used as we're rendering copyright separately at the end
    return null;
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className={sectionSpacingClass} style={sectionDividerStyle}>
        {renderSectionTitle(t('Clinic Location'))}

        <div className="space-y-4">
          {locationData.map_embed_url && (
            <DoctorMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-lg"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
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

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasAppointmentButton = actionData.appointment_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasAppointmentButton && !hasSaveContactButton) return null;

    return (
      <div
        className="space-y-3 px-6 py-5"
        style={{
          backgroundColor: `${colors.primary}04`,
          borderTop: `1px solid ${colors.primary}12`
        }}
      >
        {hasAppointmentButton && (
          <Button
            className="h-11 w-full rounded-lg"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.appointment_button_text}
          </Button>
        )}

        {(hasContactButton || hasSaveContactButton) && (
          <div className="grid grid-cols-2 gap-3">
            {hasContactButton && (
              <Button
                size="sm"
                variant="outline"
                className="h-10 w-full rounded-lg"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: colors.cardBg || '#FFFFFF',
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                <Mail className="mr-2 h-4 w-4" />
                {actionData.contact_button_text}
              </Button>
            )}

            {hasSaveContactButton && (
              <Button
                size="sm"
                variant="outline"
                className="h-10 w-full rounded-lg"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  backgroundColor: colors.cardBg || '#FFFFFF',
                  fontFamily: font
                }}
                onClick={() => {
                  const contactData = {
                    name: data.name || '',
                    title: data.title || '',
                    email: data.email || configSections.contact?.email || '',
                    phone: data.phone || configSections.contact?.phone || '',
                    website: data.website || configSections.contact?.website || '',
                    location: configSections.contact?.clinic_address || ''
                  };
                  import('@/utils/vcfGenerator').then(module => {
                    module.downloadVCF(contactData);
                  });
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {actionData.save_contact_button_text}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Get all sections for this business type
  const allSections = getBusinessTemplate('doctor')?.sections || [];

  // Extract copyright section to render it at the end
  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xl" style={{ 
      fontFamily: font,
      background: colors.background || '#FFFFFF',
      border: `1px solid ${colors.borderColor || '#E2E8F0'}`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}



      {/* Copyright always at the end */}
      {copyrightSection && (
        <div className="px-6 pb-4 pt-2">
          {copyrightSection.text && (
            <p className="text-xs text-center" style={{ color: colors.text + '60', ...globalStyle }}>
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
