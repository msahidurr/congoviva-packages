import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, Download, UserPlus, Briefcase, Award, TrendingUp, Video, Play, Youtube, QrCode, Clock } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';

interface ConsultingTemplateProps {
  data: any;
  template: any;
}

const ConsultingMapEmbed = React.memo(function ConsultingMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function ConsultingTemplate({ data, template }: ConsultingTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  // Testimonials state
  const [currentReview, setCurrentReview] = React.useState(0);
  const [currentStudy, setCurrentStudy] = React.useState(0);

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

  // Effect for case studies rotation
  React.useEffect(() => {
    const studies = configSections.case_studies?.studies || [];
    if (!Array.isArray(studies) || studies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentStudy(prev => (prev + 1) % studies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [configSections.case_studies?.studies]);

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

  const colors = configSections.colors || template?.defaultColors || { primary: '#1E40AF', secondary: '#3B82F6', accent: '#EFF6FF', background: '#F8FAFC', text: '#1E293B' };
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
  const allSections = getBusinessTemplate('consulting')?.sections || [];

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
      case 'services':
        return renderServicesSection(sectionData);
      case 'case_studies':
        return renderCaseStudiesSection(sectionData);
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
    <div className="rounded-t-2xl overflow-hidden">
      {/* Top bar */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center gap-2">
          {(configSections.contact?.phone || data.phone) && (
            <a
              href={`tel:${configSections.contact?.phone || data.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
            >
              <Phone className="w-3 h-3" />
              {configSections.contact?.phone || data.phone}
            </a>
          )}
        </div>
        {(configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
            >
              <Globe className="w-3 h-3" />
              <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
            </button>
            {showLanguageSelector && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[140px] max-h-48 overflow-y-auto z-50">
                {languageData.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                      currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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

      {/* Hero area */}
      <div
        className="px-6 pt-8 pb-6 text-center"
        style={{ background: `linear-gradient(160deg, ${colors.primary}18 0%, ${colors.background} 60%)`, borderBottom: `1px solid ${colors.accent}` }}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ border: `4px solid ${colors.primary}`, boxShadow: `0 4px 20px ${colors.primary}30`, backgroundColor: colors.accent }}
          >
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <Briefcase className="w-10 h-10" style={{ color: colors.primary }} />
            )}
          </div>
        </div>

        <h1 className="text-xl font-bold mb-1" style={{ color: colors.primary, fontFamily: font }}>
          {headerData.name || data.name || 'Professional Name'}
        </h1>

        <p className="text-sm font-medium mb-3" style={{ color: colors.secondary, fontFamily: font }}>
          {headerData.title || 'Consultant'}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="h-px w-10" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        {headerData.tagline && (
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: colors.text + 'CC', fontFamily: font }}>
            {headerData.tagline}
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
      (contactData.phone || data.phone) && {
        icon: <Phone className="w-4 h-4" />,
        label: t('Phone'),
        value: contactData.phone || data.phone,
        href: `tel:${contactData.phone || data.phone}`,
      },
      (contactData.email || data.email) && {
        icon: <Mail className="w-4 h-4" />,
        label: t('Email'),
        value: contactData.email || data.email,
        href: `mailto:${contactData.email || data.email}`,
      },
      (contactData.website || data.website) && {
        icon: <Globe className="w-4 h-4" />,
        label: t('Website'),
        value: contactData.website || data.website,
        href: contactData.website || data.website,
        external: true,
      },
      contactData.location && {
        icon: <MapPin className="w-4 h-4" />,
        label: t('Location'),
        value: contactData.location,
      },
    ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string; external?: boolean }[];

    if (items.length === 0) return null;

    return (
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}
          >
            <Phone className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Contact')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => {
            const row = (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: colors.primary + '90', fontFamily: font }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-medium truncate" style={{ color: colors.text, fontFamily: font }}>
                    {item.value}
                  </p>
                </div>
              </div>
            );
            return item.href ? (
              <a key={index} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>
                {row}
              </a>
            ) : (
              <div key={index}>{row}</div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Award className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Professional Summary')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>

        <div className="overflow-hidden" style={{ borderTop: `1px solid ${colors.accent}`, borderBottom: `1px solid ${colors.accent}` }}>
          {/* Description */}
          <div className="px-6 py-3" style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.accent}` }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: colors.primary + '90', fontFamily: font }}>{t('About')}</p>
            <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>{aboutData.description || data.description}</p>
          </div>

          {/* Experience */}
          {aboutData.experience && (
            <div className="flex items-center gap-3 px-6 py-3" style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.accent}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Years Experience')}</p>
                <p className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>{aboutData.experience}+</p>
              </div>
            </div>
          )}

          {/* Certifications */}
          {aboutData.certifications && (
            <div className="flex items-center gap-3 px-6 py-3" style={{ backgroundColor: colors.cardBg, borderBottom: aboutData.expertise ? `1px solid ${colors.accent}` : 'none' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Certifications')}</p>
                <p className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{aboutData.certifications}</p>
              </div>
            </div>
          )}

          {/* Expertise */}
          {aboutData.expertise && (
            <div className="px-6 py-3" style={{ backgroundColor: colors.cardBg }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Areas of Expertise')}</p>
              <div className="flex flex-wrap gap-1.5">
                {aboutData.expertise.split(',').map((skill: string, index: number) => (
                  <span key={index} className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: colors.primary + '15', color: colors.primary, border: `1px solid ${colors.primary}25`, fontFamily: font }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {/* Title */}
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Consulting Services')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        {/* Cards */}
        <div className="px-6 space-y-3">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="rounded-xl p-4"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <p className="text-sm font-bold leading-snug" style={{ color: colors.primary, fontFamily: font }}>{service.title}</p>
              </div>
              {service.description && <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text, fontFamily: font }}>{service.description}</p>}
              {(service.duration || service.price_range) && (
                <div className="flex items-center gap-2 flex-wrap">
                  {service.duration && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>⏱ {service.duration}</span>
                  )}
                  {service.price_range && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.secondary + '15', color: colors.secondary, fontFamily: font }}>{service.price_range}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCaseStudiesSection = (caseStudiesData: any) => {
    const studies = caseStudiesData.studies || [];
    if (!Array.isArray(studies) || studies.length === 0) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {/* Title */}
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Success Stories')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        {/* Carousel */}
        <div className="px-6">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentStudy * 100}%)` }}>
              {studies.map((study: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.accent}` }}>
                    <div className="flex items-center gap-3 px-4 py-3" style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}08)`, borderBottom: `1px solid ${colors.accent}` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate" style={{ color: colors.primary, fontFamily: font }}>{study.title}</p>
                        {study.client_industry && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>{study.client_industry}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ backgroundColor: colors.cardBg }}>
                      {study.challenge && (
                        <div className="px-4 py-3">
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Challenge')}</p>
                          <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>{study.challenge}</p>
                        </div>
                      )}
                      {study.solution && (
                        <div className="px-4 py-3" style={{ borderTop: `1px solid ${colors.accent}` }}>
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Solution')}</p>
                          <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>{study.solution}</p>
                        </div>
                      )}
                      {study.results && (
                        <div className="px-4 py-3" style={{ borderTop: `1px solid ${colors.accent}`, background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}05)` }}>
                          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Results')}</p>
                          <p className="text-sm font-semibold leading-relaxed" style={{ color: colors.primary, fontFamily: font }}>{study.results}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {studies.length > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              {studies.map((_: any, i: number) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full cursor-pointer transition-all"
                  style={{ backgroundColor: i === currentStudy ? colors.primary : colors.primary + '30' }}
                  onClick={() => setCurrentStudy(i)}
                />
              ))}
            </div>
          )}
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
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {/* Title */}
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Video className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Educational Videos')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        {/* Video cards */}
        <div className="px-6 space-y-4">
          {videoContent.map((video: any) => {
            const videoUrl = video.videoData?.url || (video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null);
            const thumbUrl = video.thumbnail ? getImageDisplayUrl(video.thumbnail) : getYouTubeThumbnail(video.embed_url || '');
            return (
              <div key={video.key} className="rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}>
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
                  <div className="relative w-full h-44 cursor-pointer" onClick={() => { if (videoUrl) setPlayingKey(video.key); }}>
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}10)` }}>
                        <Video className="w-10 h-10" style={{ color: colors.primary }} />
                      </div>
                    )}
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1))' }}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 24px ${colors.primary}80` }}>
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Info */}
                <div className="p-4">
                  <p className="text-sm font-bold mb-1" style={{ color: colors.primary, fontFamily: font }}>{video.title}</p>
                  {video.description && <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text, fontFamily: font }}>{video.description}</p>}
                  {(video.duration || video.video_type || video.expertise_area) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {video.duration && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}>{video.duration}</span>
                      )}
                      {video.video_type && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: colors.secondary + '15', color: colors.secondary, fontFamily: font }}>{video.video_type.replace(/_/g, ' ')}</span>
                      )}
                      {video.expertise_area && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary + '10', color: colors.primary, fontFamily: font }}>{video.expertise_area}</span>
                      )}
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

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {/* Title */}
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: 'linear-gradient(135deg, #FF0000, #cc0000)', boxShadow: '0 4px 14px rgba(255,0,0,0.35)' }}>
            <Youtube className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('YouTube Channel')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>

        <div className="overflow-hidden" style={{ borderTop: `1px solid ${colors.accent}`, borderBottom: `1px solid ${colors.accent}` }}>
          {/* Channel info row */}
          <div className="flex items-center gap-3 px-6 py-4" style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.accent}` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF0000' }}>
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate" style={{ color: colors.primary, fontFamily: font }}>{youtubeData.channel_name || 'Consulting Channel'}</p>
              {youtubeData.subscriber_count && (
                <p className="text-xs" style={{ color: colors.text + 'AA', fontFamily: font }}>{youtubeData.subscriber_count} {t('subscribers')}</p>
              )}
            </div>
          </div>

          {/* Description */}
          {youtubeData.channel_description && (
            <div className="px-6 py-3" style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.accent}` }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>{youtubeData.channel_description}</p>
            </div>
          )}

          {/* Latest video */}
          {youtubeData.latest_video_embed && (
            <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg, borderBottom: `1px solid ${colors.accent}` }}>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.accent}` }}>
                <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <div className="absolute inset-0 w-full h-full" ref={createYouTubeEmbedRef(youtubeData.latest_video_embed, { colors, font }, 'Latest Video')} />
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="px-6 py-4 space-y-2" style={{ backgroundColor: colors.cardBg }}>
            {youtubeData.channel_url && (
              <Button size="sm" className="w-full" style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }} onClick={() => typeof window !== 'undefined' && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}>
                <Youtube className="w-4 h-4 mr-2" />
                {t('Subscribe')}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button size="sm" variant="outline" className="w-full" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }} onClick={() => typeof window !== 'undefined' && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}>
                <Play className="w-4 h-4 mr-2" />
                {t('Featured Playlist')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Globe className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Professional Networks')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="overflow-hidden" style={{ borderTop: `1px solid ${colors.accent}`, borderBottom: `1px solid ${colors.accent}` }}>
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3"
              style={{ backgroundColor: colors.cardBg, borderBottom: index < socialLinks.length - 1 ? `1px solid ${colors.accent}` : 'none' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                <SocialIcon platform={link.platform} color={colors.primary} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colors.primary + '90', fontFamily: font }}>{link.platform}</p>
                {link.username && <p className="text-sm font-semibold truncate" style={{ color: colors.text, fontFamily: font }}>{link.username}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const today = days[new Date().getDay()];
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Office Hours')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="overflow-hidden" style={{ borderTop: `1px solid ${colors.accent}`, borderBottom: `1px solid ${colors.accent}` }}>
          {hours.slice(0, 7).map((hour: any, index: number) => {
            const isToday = hour.day === today;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-6 py-3"
                style={{
                  backgroundColor: isToday ? colors.primary + '10' : colors.cardBg,
                  borderBottom: index < hours.length - 1 ? `1px solid ${colors.accent}` : 'none',
                }}
              >
                <div className="flex items-center gap-2">
                  {isToday && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />}
                  <span className="text-sm font-semibold capitalize" style={{ color: isToday ? colors.primary : colors.text, fontFamily: font }}>{t(hour.day)}</span>
                  {isToday && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.primary, color: 'white', fontFamily: font }}>{t('Today')}</span>}
                </div>
                <span className="text-sm font-semibold" style={{ color: hour.is_closed ? colors.text + '50' : colors.primary, fontFamily: font }}>
                  {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Award className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Client Testimonials')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="px-6">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentReview * 100}%)` }}>
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${colors.accent}` }}>
                    <div className="px-4 py-3 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}08)`, borderBottom: `1px solid ${colors.accent}` }}>
                      <div>
                        <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>{review.client_name}</p>
                        {review.client_title && <p className="text-xs" style={{ color: colors.text + 'AA', fontFamily: font }}>{review.client_title}</p>}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm" style={{ color: i < parseInt(review.rating || 5) ? '#FBBF24' : colors.accent }}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-4" style={{ backgroundColor: colors.cardBg }}>
                      <p className="text-sm leading-relaxed italic" style={{ color: colors.text, fontFamily: font }}>"{review.review}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {reviews.length > 1 && (
            <div className="flex justify-center mt-3 gap-2">
              {reviews.map((_: any, i: number) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full cursor-pointer transition-all"
                  style={{ backgroundColor: i === currentReview ? colors.primary : colors.primary + '30' }}
                  onClick={() => setCurrentReview(i)}
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
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Schedule Consultation')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="px-6 space-y-3">
          {appointmentsData?.consultation_fee && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: colors.primary + '90', fontFamily: font }}>{t('Consultation Fee')}</p>
                <p className="text-sm font-bold" style={{ color: colors.text, fontFamily: font }}>{appointmentsData.consultation_fee}</p>
              </div>
            </div>
          )}
          {appointmentsData?.booking_url && (
            <Button
              className="w-full h-9 font-semibold rounded-xl"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('Book Consultation')}
            </Button>
          )}
          {appointmentsData?.calendar_link && (
            <Button
              variant="outline"
              className="w-full h-9 font-semibold rounded-xl"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appointmentsData.calendar_link, '_blank', 'noopener,noreferrer')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {t('View Calendar')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Location')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        {locationData.map_embed_url && (
          <div className="mb-3 overflow-hidden" style={{ borderTop: `1px solid ${colors.accent}`, borderBottom: `1px solid ${colors.accent}` }}>
            <ConsultingMapEmbed embedHtml={locationData.map_embed_url} />
          </div>
        )}
        {locationData.directions_url && (
          <div className="px-6">
            <Button
              className="w-full h-9 font-semibold rounded-xl"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t('Get Directions')}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Download className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Download App')}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="px-6 grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <button
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl cursor-pointer"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.primary}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <p className="text-xs font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('App Store')}</p>
            </button>
          )}
          {appData.play_store_url && (
            <button
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl cursor-pointer"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={colors.primary}>
                <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
              </svg>
              <p className="text-xs font-bold" style={{ color: colors.primary, fontFamily: font }}>{t('Play Store')}</p>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="flex flex-col items-center mb-5 px-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
            <Mail className="w-4 h-4 text-white" />
          </div>
          <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{formData.form_title}</p>
          <div className="flex gap-1 mt-1.5">
            <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
            <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
          </div>
        </div>
        <div className="px-6 space-y-3">
          {formData.form_description && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `linear-gradient(135deg, ${colors.primary}25, ${colors.secondary}15)`, color: colors.primary }}>
                <Mail className="w-4 h-4" />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>{formData.form_description}</p>
            </div>
          )}
          <Button
            className="w-full h-9 font-semibold rounded-xl"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('Get In Touch')}
          </Button>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    return (
      <div className="py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex flex-col items-center mb-5 px-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
              <Award className="w-4 h-4 text-white" />
            </div>
            <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{customHtmlData.section_title}</p>
            <div className="flex gap-1 mt-1.5">
              <div className="w-6 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="w-2 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
              <div className="w-1 h-0.5 rounded-full" style={{ backgroundColor: colors.primary + '50' }} />
            </div>
          </div>
        )}
        <div className="mx-6 custom-html-content px-4 py-4 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.accent}`, fontFamily: font, color: colors.text }}>
          <style>{`
            .custom-html-content h1,.custom-html-content h2,.custom-html-content h3,.custom-html-content h4 { color: ${colors.primary}; margin-bottom: 0.5rem; font-family: ${font}; font-weight: bold; }
            .custom-html-content p { color: ${colors.text}; margin-bottom: 0.5rem; font-size: 0.875rem; line-height: 1.6; font-family: ${font}; }
            .custom-html-content a { color: ${colors.secondary}; text-decoration: underline; }
            .custom-html-content ul,.custom-html-content ol { color: ${colors.text}; padding-left: 1rem; font-family: ${font}; }
            .custom-html-content code { background-color: ${colors.primary}20; color: ${colors.primary}; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
          `}</style>
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    return (
      <div className="px-6 py-5 flex flex-col items-center text-center" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 4px 14px ${colors.primary}40` }}>
          <QrCode className="w-6 h-6 text-white" />
        </div>
        <p className="text-base font-bold mb-1" style={{ color: colors.primary, fontFamily: font }}>{qrData.qr_title || t('Share My Profile')}</p>
        {qrData.qr_description && (
          <p className="text-xs mb-3 leading-relaxed" style={{ color: colors.text + 'AA', fontFamily: font }}>{qrData.qr_description}</p>
        )}
        <Button
          className="h-9 font-semibold rounded-xl px-6"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font }}
          onClick={() => setShowQrModal(true)}
        >
          <QrCode className="w-4 h-4 mr-2" />
          {t('Share QR Code')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: `1px solid ${colors.accent}` }}>
        <div className="rounded-xl px-5 py-4 text-center" style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}08)`, border: `1px solid ${colors.accent}` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
            <span className="text-white text-sm">✦</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>{thankYouData.message}</p>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    if (!actionData || actionData.enabled === false) return null;
    if (!actionData.contact_button_text && !actionData.save_contact_button_text) return null;
    return (
      <div className="px-6 py-5 space-y-3" style={{ borderTop: `1px solid ${colors.accent}` }}>
        {actionData.contact_button_text && (
          <Button
            className="w-full h-10 font-semibold rounded-xl"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', fontFamily: font }}
            onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}
        {actionData.save_contact_button_text && (
          <Button
            className="w-full h-10 font-semibold rounded-xl"
            variant="outline"
            style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
            onClick={() => {
              const contactData = {
                name: data.name || '',
                title: data.title || '',
                email: data.email || configSections.contact?.email || '',
                phone: data.phone || configSections.contact?.phone || '',
                website: data.website || configSections.contact?.website || '',
                location: configSections.contact?.location || ''
              };
              import('@/utils/vcfGenerator').then(module => {
                module.downloadVCF(contactData);
              });
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
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
    <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={{
      fontFamily: font,
      backgroundColor: colors.background,
      border: `1px solid ${colors.accent}`,
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
        <div className="px-6 py-4" style={{ background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}08)`, borderTop: `1px solid ${colors.accent}` }}>
          {copyrightSection.text && (
            <p className="text-xs text-center font-medium" style={{ color: colors.primary + 'AA', fontFamily: font }}>
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