import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';


import { Mail, Phone, Globe, MapPin, Linkedin, Twitter, Github, Briefcase, Calendar, Download, UserPlus, Video, Play, Youtube, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';

import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';


interface FreelancerTemplateProps {
  data: any;
  template: any;
}

const FreelancerMapEmbed = React.memo(function FreelancerMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function FreelancerTemplate({ data, template }: FreelancerTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);
  const colors = { ...template?.defaultColors, ...configSections.colors } || { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B', text: '#E2E8F0' };
  
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);
  const codeFont = '"JetBrains Mono", "Fira Code", monospace';
  const globalStyle = React.useMemo(() => ({ fontFamily: font }), [font]);
  const sectionBorder = `1px solid ${colors.borderColor || '#334155'}`;
  const cardSurface = colors.codeBlock || '#1A202C';
  const mutedTextColor = `${colors.text || '#E2E8F0'}B8`;
  const subtleTextColor = `${colors.text || '#E2E8F0'}80`;
  const openUrl = (url?: string) => {
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
  }, [font]);




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

  // Get all sections for this business type
  const allSections = getBusinessTemplate('freelancer')?.sections || [];
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
      case 'portfolio':
        return renderPortfolioSection(sectionData);
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
    <div
      className="relative rounded-t-[28px] overflow-hidden"
      style={{
        background: `radial-gradient(circle at top left, ${colors.primary}18, transparent 36%), ${colors.background || '#0A0E1A'}`
      }}
    >
      {/* Circuit Board Pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current" style={{ color: colors.primary }}>
          <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M10 10h30v5h-30zM10 20h30v5h-30zM20 10v30h5v-30zM30 10v30h5v-30z" />
            <circle cx="15" cy="15" r="2" />
            <circle cx="35" cy="35" r="2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="h-44 w-full relative">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.background || '#0A0E1A'} 0%, ${colors.secondary || '#1E40AF'}22 100%)`
          }}
        ></div>
        <div className={`absolute top-5 ${isRTL ? 'right-5' : 'left-5'}`}>
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2 px-3.5 py-1.5 rounded-full`} style={{
            backgroundColor: `${cardSurface}E6`,
            border: `1px solid ${colors.primary}`,
            boxShadow: colors.glowEffect || `0 0 10px ${colors.primary}40`
          }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.syntaxHighlight || '#00FF41' }}></div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: colors.text || '#E2E8F0', fontFamily: codeFont }}>{'<DEVELOPER/>'}</span>
          </div>
        </div>
        <div className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
          {/* Language Selector */}
          {(configSections?.language && configSections?.language?.enable_language_switcher) && (
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs cursor-pointer"
                style={{
                  backgroundColor: `${cardSurface}E6`,
                  border: `1px solid ${colors.borderColor || '#334155'}`,
                  color: colors.text || '#E2E8F0'
                }}
              >
                <span>
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
                <span className="uppercase font-medium">{currentLanguage}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <div
                    className="fixed inset-0"
                    style={{ zIndex: 99998 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-1 rounded border shadow-lg py-1 w-32 max-h-48 overflow-y-auto"
                    style={{
                      backgroundColor: colors.background || '#0A0E1A',
                      borderColor: colors.borderColor || '#334155',
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
                          color: colors.text || '#E2E8F0'
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
          )}

          {/* Terminal Dots */}
          <div className="flex space-x-1.5 rounded-full px-3 py-2" style={{ backgroundColor: `${cardSurface}CC`, border: sectionBorder }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: colors.syntaxHighlight || '#00FF41', animationDelay: '1s' }}></div>
          </div>
        </div>
        {/* Floating Code Elements */}
        <div className="absolute bottom-6 right-5 opacity-35">
          <div className="text-[11px]" style={{ color: mutedTextColor, fontFamily: codeFont }}>
            <div>{'{ code: "clean" }'}</div>
            <div>{'{ bugs: 0 }'}</div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-7 -mt-14 relative">
        <div className={`flex items-start ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
          <div className="w-24 h-24 rounded-[22px] border-2 shadow-2xl flex items-center justify-center shrink-0 overflow-hidden" style={{
            backgroundColor: cardSurface,
            borderColor: colors.primary,
            boxShadow: colors.glowEffect || `0 0 20px ${colors.primary}40`
          }}>
            {headerData.profile_image ? (
              <img
                src={getImageDisplayUrl(headerData.profile_image)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: colors.primary, fontFamily: codeFont }}>{'<>'}</div>
                <div className="text-xs" style={{ color: colors.text, fontFamily: codeFont }}>DEV</div>
              </div>
            )}
          </div>
          <div className="flex-1 mt-4 min-w-0">
            <h1 className="text-[22px] leading-[1.2] font-bold tracking-tight" style={{ color: colors.text || '#E2E8F0', fontFamily: font }}>
              {headerData.name || data.name || 'const developer = {'}
            </h1>
            <p className="mt-1.5 text-base font-semibold" style={{ color: colors.primary, fontFamily: font }}>
              {headerData.title || data.title || '  role: "Full Stack Developer"'}
            </p>
            <div className="text-[11px] mt-3" style={{ color: subtleTextColor, fontFamily: codeFont }}>{'}'}</div>
          </div>
        </div>
        {headerData.tagline && (
          <p className="mt-4 text-sm leading-6 p-4 rounded-2xl" style={{
            color: mutedTextColor,
            backgroundColor: `${cardSurface}D9`,
            border: `1px solid ${colors.primary}24`,
            fontFamily: font
          }}>
            {headerData.tagline}
          </p>
        )}
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
      <h3 className="font-bold text-[15px] mb-4 tracking-tight" style={{ color: colors.primary, fontFamily: codeFont }}>
        <span style={{ color: colors.syntaxHighlight || '#00FF41' }}>{t("const")}</span> {t("contact")} = {'{'}
      </h3>
      <div className="space-y-3 ml-2">
        {(contactData.email || data.email) && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 p-3 rounded-2xl`} style={{ backgroundColor: `${cardSurface}CC`, border: `1px solid ${colors.primary}1A` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary}14` }}>
              <Mail className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm break-all" style={{ color: colors.text, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("email")} : </span> "
              <a
                href={`mailto:${contactData.email || data.email}`}
                style={{ color: colors.primary, textDecoration: 'underline', fontFamily: font }}
              >
                {contactData.email || data.email}
              </a>"
            </span>
          </div>
        )}
        {(contactData.phone || data.phone) && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 p-3 rounded-2xl`} style={{ backgroundColor: `${cardSurface}CC`, border: `1px solid ${colors.primary}1A` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary}14` }}>
              <Phone className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm leading-6" style={{ color: colors.text, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("phone")} : </span> "
              <a
                href={`tel:${contactData.phone || data.phone}`}
                style={{ color: colors.primary, textDecoration: 'underline', fontFamily: font }}
              >
                {contactData.phone || data.phone}
              </a>"
            </span>
          </div>
        )}
        {(contactData.website || data.website) && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 p-3 rounded-2xl`} style={{ backgroundColor: `${cardSurface}CC`, border: `1px solid ${colors.primary}1A` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary}14` }}>
              <Globe className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm leading-6 break-all" style={{ color: colors.text, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("website")} : </span> "
              <a
                href={contactData.website || data.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.primary, textDecoration: 'underline', fontFamily: font }}
              >
                {contactData.website || data.website}
              </a>"
            </span>
          </div>
        )}
        {contactData.location && (
          <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3 p-3 rounded-2xl`} style={{ backgroundColor: `${cardSurface}CC`, border: `1px solid ${colors.primary}1A` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary}14` }}>
              <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
            </div>
            <span className="text-sm leading-6" style={{ color: colors.text, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("location")} : </span> "{contactData.location}"
            </span>
          </div>
        )}
      </div>
      <div className="font-bold text-[15px] mt-3" style={{ color: colors.primary, fontFamily: codeFont }}>{'}'}</div>
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-3 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('About')}</h3>
        <p className="text-sm leading-7" style={{ color: mutedTextColor, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>
        {aboutData.skills && (
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: subtleTextColor, fontFamily: font }}>{t('Skills')}</p>
            <div className="flex flex-wrap gap-2">
              {aboutData.skills.split(',').map((skill: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: colors.primary + '20', color: colors.text, fontFamily: font }}>
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {aboutData.experience && (
          <div className="mt-5 p-4 rounded-2xl" style={{ backgroundColor: `${colors.primary}10`, border: `1px solid ${colors.primary}20` }}>
            <p className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{t('Experience')}: <span style={{ color: colors.primary }}>{aboutData.experience} {t('years')}</span></p>
          </div>
        )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-base mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Services')}</h3>
        <div className="space-y-4">
          {services.map((service: any, index: number) => (
            <div key={index} className="border-l-2 pl-4 py-1" style={{ borderColor: colors.accent, ...globalStyle }}>
              <h4 className="font-semibold text-sm leading-6" style={{ color: colors.text, ...globalStyle }}>{service.title}</h4>
              {service.description && (
                <p className="text-sm leading-6 mt-1" style={{ color: mutedTextColor, ...globalStyle }}>
                  {service.description}
                </p>
              )}
              {service.price && (
                <p className="text-sm font-semibold mt-2" style={{ color: colors.primary, ...globalStyle }}>
                  {service.price}/hr
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPortfolioSection = (portfolioData: any) => {
    const projects = portfolioData.projects || [];
    if (!Array.isArray(projects) || projects.length === 0) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Portfolio')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {projects.map((project: any, index: number) => (
            <div key={index} className="space-y-2 rounded-2xl p-3" style={{ ...globalStyle, backgroundColor: `${cardSurface}80`, border: `1px solid ${colors.primary}14` }}>
              {project.image ? (
                <div className="w-full h-24 rounded-xl overflow-hidden" style={{ borderLeft: `3px solid ${colors.primary}` }}>
                  <img
                    src={getImageDisplayUrl(project.image)}
                    alt={project.title || 'Project'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl flex items-center justify-center text-xs font-medium" style={{
                  borderLeft: `3px solid ${colors.primary}`,
                  backgroundColor: cardSurface,
                  color: colors.text || '#E2E8F0',
                  fontFamily: font
                }}>
                  <div className="text-center">
                    <div className="text-lg mb-1" style={{ color: colors.primary }}>{'</>'}</div>
                    <div className="text-xs truncate px-2">{project.title || t('Project')}</div>
                  </div>
                </div>
              )}
              <div className="text-sm font-semibold truncate" style={{ color: colors.text, ...globalStyle }}>
                {project.title || t('Project')}
              </div>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs truncate block"
                  style={{ color: mutedTextColor, ...globalStyle }}
                >
                  {project.url}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const [activeVideo, setActiveVideo] = React.useState(0);
  const [firstVideoPlaying, setFirstVideoPlaying] = React.useState(false);

  const renderVideosSection = (videosData: any) => {
    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;

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
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-bold text-[15px] mb-4 tracking-tight" style={{ color: colors.primary, fontFamily: codeFont }}>
          <span style={{ color: colors.syntaxHighlight || '#00FF41' }}>{t("const")}</span> {t("videos")} = [{'{'}
        </h3>
        <div className="space-y-4 ml-2">
          {videos.map((video: any, index: number) => {
            const videoUrl = video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null;
            const thumbUrl = video.thumbnail
              ? getImageDisplayUrl(video.thumbnail)
              : getYouTubeThumbnail(video.embed_url || '');
            const isPlaying = activeVideo === index && firstVideoPlaying;

            return (
              <div key={index} className="rounded-2xl overflow-hidden" style={{ backgroundColor: cardSurface, border: `1px solid ${colors.primary}24` }}>
                <div className="relative">
                  {(() => {
                  const videoUrl = video.embed_url ? (extractVideoUrl(video.embed_url)?.url || video.embed_url) : null;
                  const thumbUrl = video.thumbnail
                    ? getImageDisplayUrl(video.thumbnail)
                    : getYouTubeThumbnail(video.embed_url || '');
                  return isPlaying && videoUrl ? (
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
                      onClick={() => { if (videoUrl) { setActiveVideo(index); setFirstVideoPlaying(true); } }}
                    >
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                          <Video className="w-8 h-8 mx-auto mb-2" style={{ color: colors.primary }} />
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
                  <h4 className="text-base font-semibold mb-1" style={{ color: colors.text, fontFamily: font }}>
                    <span style={{ color: colors.syntaxHighlight }}>{t("title")}:</span> "{video.title}"
                  </h4>
                  {video.description && (
                    <p className="text-sm leading-6 mb-3" style={{ color: mutedTextColor, fontFamily: font }}>
                      <span style={{ color: colors.syntaxHighlight }}>{t("desc")}:</span> "{video.description}"
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    {video.duration && (
                      <span className="text-xs" style={{ color: subtleTextColor, fontFamily: codeFont }}>
                        <span style={{ color: colors.syntaxHighlight }}>{t("time")}:</span> "{video.duration}"
                      </span>
                    )}
                    {video.tech_stack && (
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.primary + '20', color: colors.primary, fontFamily: font }}>
                        {video.tech_stack}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[11px] mt-3" style={{ color: subtleTextColor, fontFamily: codeFont }}>]</div>
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-bold text-[15px] mb-4 tracking-tight" style={{ color: colors.primary, fontFamily: codeFont }}>
          <span style={{ color: colors.syntaxHighlight || '#00FF41' }}>{t("const")}</span> {t("youtube")} = {'{'}
        </h3>

        {youtubeData.latest_video_embed && (
          <div className="ml-2 mb-4 rounded-2xl overflow-hidden" style={{ backgroundColor: cardSurface, border: `1px solid ${colors.primary}24` }}>
            <div className="p-3 mb-2">
              <h4 className="text-sm font-semibold flex items-center" style={{ color: colors.text, fontFamily: font }}>
                <Play className="w-4 h-4 mr-2" style={{ color: colors.primary }} />
                <span style={{ color: colors.syntaxHighlight }}>{t("latest")}:</span> "{t("video")}"
              </h4>
            </div>
            <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
              <div
                className="absolute inset-0 w-full h-full"
                ref={createYouTubeEmbedRef(
                  youtubeData.latest_video_embed,
                  { colors, font },
                  'Latest Dev Video'
                )}
              />
            </div>
          </div>
        )}

        <div className="ml-2 p-4 rounded-2xl" style={{ backgroundColor: `${cardSurface}D9`, border: `1px solid ${colors.primary}24` }}>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold" style={{ color: colors.text, fontFamily: font }}>
                <span style={{ color: colors.syntaxHighlight }}>{t("channel")}:</span> "{youtubeData.channel_name || 'Dev Channel'}"
              </h4>
              {youtubeData.subscriber_count && (
                <p className="text-sm" style={{ color: mutedTextColor, fontFamily: font }}>
                  <span style={{ color: colors.syntaxHighlight }}>{t("subs")}:</span> "{youtubeData.subscriber_count}"
                </p>
              )}
            </div>
          </div>

          {youtubeData.channel_description && (
            <p className="text-sm leading-6 mb-4" style={{ color: mutedTextColor, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("about")}:</span> "{youtubeData.channel_description}"
            </p>
          )}

          <div className="space-y-2">
            {youtubeData.channel_url && (
              <Button
                size="sm"
                className="w-full"
                style={{
                  backgroundColor: 'white',
                  color: colors.primary,
                  fontFamily: font
                }}
                onClick={() => openUrl(youtubeData.channel_url)}
              >
                <Youtube className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("subscribe()")}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => openUrl(youtubeData.featured_playlist)}
              >
                {'> '} {t("tutorials.watch()")}
              </Button>
            )}
          </div>
        </div>
        <div className="text-[11px] mt-3" style={{ color: subtleTextColor, fontFamily: codeFont }}>{'}'}</div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-sm mb-4" style={{ color: colors.text, fontFamily: font }}>{t('Connect')}</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {socialLinks.map((link: any, index: number) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              className="justify-start overflow-hidden h-10 px-3"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => openUrl(link.url)}
              title={link.username ? `${link.platform}: @${link.username}` : link.platform}
            >
              <SocialIcon platform={link.platform} color={colors.primary} />
              <span className="text-xs capitalize truncate ml-2" style={globalStyle}>{link.platform}</span>
              {link.username && <span className="text-xs ml-1 truncate" style={globalStyle}>@{link.username}</span>}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Availability')}</h3>
        <div className="space-y-2">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-2xl" style={{
              backgroundColor: hour.is_closed ? colors.codeBlock || '#1A202C' : `${colors.primary}15`,
              border: `1px solid ${hour.is_closed ? colors.borderColor : colors.primary + '30'}`
            }}>
              <span className="capitalize font-medium text-sm" style={{ color: colors.text, fontFamily: font }}>{t(hour.day)}</span>
              <span className="text-sm" style={{ color: hour.is_closed ? subtleTextColor : colors.primary, fontFamily: font }}>
                {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Testimonials state (moved to component level)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = React.useState(0);

  // Effect for testimonials rotation (moved to component level)
  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 2) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev => (prev + 2) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    const getVisibleReviews = () => {
      if (reviews.length <= 2) return reviews;
      return [
        reviews[currentTestimonialIndex],
        reviews[(currentTestimonialIndex + 1) % reviews.length]
      ];
    };

    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Client Reviews')}</h3>
        <div className="space-y-4 transition-all duration-500">
          {getVisibleReviews().map((review: any, index: number) => (
            <div key={`${currentTestimonialIndex}-${index}`} className="p-4 rounded-2xl" style={{ backgroundColor: `${colors.primary}10`, border: `1px solid ${colors.primary}18` }}>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i < parseInt(review.rating || 5) ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                ))}
              </div>
              <p className="text-sm mb-3 leading-6" style={{ color: 'rgba(255, 255, 255, 0.88)', ...globalStyle }}>"{review.review}"</p>
              <p className="text-sm font-semibold" style={{ color: colors.primary, ...globalStyle }}>- {review.client_name}</p>
            </div>
          ))}
        </div>
        {reviews.length > 2 && (
          <div className="flex justify-center mt-2 space-x-1">
            {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${Math.floor(currentTestimonialIndex / 2) === i ? 'opacity-100' : 'opacity-30'
                  }`}
                style={{ backgroundColor: colors.primary }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData?.booking_url && !appointmentsData?.calendar_link) return null;

    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Book Appointment')}</h3>
        <div className="space-y-3">
          <Button
            className="w-full h-10 font-semibold"
            style={{
              fontFamily: font,
              backgroundColor: '#ffffff',
              color: colors.primary,
              border: `1px solid #ffffff`,
              boxShadow: '0 10px 22px rgba(15, 23, 42, 0.16)'
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('Schedule Meeting')}
          </Button>
          {appointmentsData?.calendar_link && (
            <Button
              className="w-full h-10 font-semibold"
              style={{
                fontFamily: font,
                backgroundColor: '#ffffff',
                color: colors.primary,
                border: `1px solid #ffffff`,
                boxShadow: '0 10px 22px rgba(15, 23, 42, 0.16)'
              }}
              onClick={() => openUrl(appointmentsData.calendar_link)}
            >
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
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Location')}</h3>

        <div className="space-y-3">
          {locationData.map_embed_url && (
            <FreelancerMapEmbed embedHtml={locationData.map_embed_url} />
          )}

          {locationData.directions_url && (
            <Button
              size="sm"
              variant="outline"
              className="w-full h-11"
              style={{ fontFamily: font, borderColor: `${colors.primary}30`, color: colors.primary }}
              onClick={() => openUrl(locationData.directions_url)}
            >
              <MapPin className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-4 tracking-tight" style={{ color: colors.text, fontFamily: font }}>{t('Download App')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="h-11"
              style={{ fontFamily: font, borderColor: `${colors.primary}30` ,color: colors.primary}}
              onClick={() => openUrl(appData.app_store_url)}
            >
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="h-11"
              style={{ fontFamily: font, borderColor: `${colors.primary}30` ,color: colors.primary }}
              onClick={() => openUrl(appData.play_store_url)}
            >
              {t('Play Store')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-semibold text-lg mb-2 tracking-tight" style={{ color: colors.text, fontFamily: font }}>
          {formData.form_title}
        </h3>
        {formData.form_description && (
          <p className="text-sm leading-6 mb-4" style={{ color: mutedTextColor, fontFamily: font }}>
            {formData.form_description}
          </p>
        )}
        <Button
          className="w-full h-10"
          style={{
            fontFamily: font,
            backgroundColor: '#ffffff',
            color: colors.primary,
            border: '1px solid #ffffff',
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('Contact Me')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-4 pt-1">
        <p className="text-sm text-center leading-6" style={{ color: subtleTextColor, fontFamily: font }}>
          {thankYouData.message}
        </p>
      </div>
    );
  };

  // Stable HTML content to prevent iframe reloading
  const stableHtmlContent = React.useMemo(() => {
    return configSections.custom_html?.html_content || '';
  }, [configSections.custom_html?.html_content]);

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData?.html_content) return null;

    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <h3 className="font-bold text-[15px] mb-4 tracking-tight" style={{ color: colors.primary, fontFamily: codeFont }}>
            <span style={{ color: colors.syntaxHighlight || '#00FF41' }}>{t("const")}</span> {customHtmlData.section_title.toLowerCase().replace(/\s+/g, '_')} = {'{'}
          </h3>
        )}
        <div
          className="custom-html-content p-4 rounded-2xl"
          style={{
            backgroundColor: cardSurface,
            border: `1px solid ${colors.primary}30`,
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
                color: ${colors.syntaxHighlight || '#00FF41'};
                text-decoration: underline;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
              }
              .custom-html-content code {
                background-color: ${colors.primary}20;
                color: ${colors.syntaxHighlight || '#00FF41'};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-family: 'JetBrains Mono', monospace;
              }
              .custom-html-content iframe {
                max-width: 100%;
                border: none;
              }
            `}
          </style>
          {/* Use StableHtmlContent to prevent iframe reloading */}
          <StableHtmlContent htmlContent={stableHtmlContent} />
        </div>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="text-[11px] mt-3" style={{ color: subtleTextColor, fontFamily: codeFont }}>{'}'}</div>
        )}
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-6 py-5" style={{ borderBottom: sectionBorder }}>
        <h3 className="font-bold text-[15px] mb-4 tracking-tight" style={{ color: colors.primary, fontFamily: codeFont }}>
          <span style={{ color: colors.syntaxHighlight || '#00FF41' }}>{t("const")}</span> {t("qr_share")} = {'{'}
        </h3>
        <div className="text-center p-5 rounded-2xl" style={{ backgroundColor: cardSurface, border: `1px solid ${colors.primary}30` }}>
          {qrData.qr_title && (
            <h4 className="text-base font-semibold mb-3" style={{ color: colors.text, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("title")}:</span> "{qrData.qr_title}"
            </h4>
          )}

          {qrData.qr_description && (
            <p className="text-sm leading-6 mb-4" style={{ color: mutedTextColor, fontFamily: font }}>
              <span style={{ color: colors.syntaxHighlight }}>{t("desc")}:</span> "{qrData.qr_description}"
            </p>
          )}

          <Button
            size="sm"
            className="w-full h-10"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              boxShadow: '0 10px 22px rgba(15, 23, 42, 0.16)',
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {'> '} {t("Share QR Code")}
          </Button>
        </div>
        <div className="text-[11px] mt-3" style={{ color: subtleTextColor, fontFamily: codeFont }}>{'}'}</div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasAppointmentButton = actionData.appointment_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasAppointmentButton && !hasSaveContactButton) return null;

    return (
      <div className="p-6 space-y-4" style={{ background: `linear-gradient(to bottom, ${colors.background || '#0A0E1A'}, ${cardSurface})` }}>
        {hasContactButton && (
          <Button
            className="w-full h-12 font-bold border transition-all hover:shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              border: `1px solid ${colors.primary}`,
              boxShadow: `0 0 15px ${colors.primary}40`,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
             <span>{'> '}</span>{actionData.contact_button_text}<span className="animate-pulse">|</span>
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="w-full h-12 font-bold border-2 transition-all hover:shadow-lg"
            style={{
              borderColor: colors.syntaxHighlight || '#00FF41',
              color: colors.syntaxHighlight || '#00FF41',
              backgroundColor: 'transparent',
              boxShadow: `0 0 10px ${colors.syntaxHighlight || '#00FF41'}20`,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <span>{'> '}</span>{actionData.appointment_button_text}<span className="animate-pulse">|</span>
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            className="w-full h-10 font-semibold flex items-center justify-center"
            style={{
              backgroundColor: '#ffffff',
              color: colors.primary,
              border: '1px solid #ffffff',
              boxShadow: '0 10px 22px rgba(15, 23, 42, 0.16)',
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
            <UserPlus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {actionData.save_contact_button_text}
          </Button>
        )}
      </div>
    );
  };

  // Extract copyright section to render it at the end
  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function, excluding copyright
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections)
    .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright');

  return (
    <div className="w-full rounded-[20px] overflow-hidden" style={{
      fontFamily: font,
      background: `linear-gradient(180deg, ${colors.background || '#0A0E1A'} 0%, ${cardSurface} 100%)`,
      border: `1px solid ${colors.borderColor || '#334155'}`,
      boxShadow: colors.glowEffect || `0 0 30px ${colors.primary}20`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}



      {/* Copyright always at the end */}
      {copyrightSection && (
        <div className="px-6 pb-4 pt-2">
          {copyrightSection.text && (
            <p className="text-sm text-center" style={{ color: `${colors.text || '#E2E8F0'}66`, fontFamily: font }}>
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
