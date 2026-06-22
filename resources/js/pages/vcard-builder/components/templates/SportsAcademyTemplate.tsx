/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  UserPlus,
  Trophy,
  Activity,
  Star,
  Video,
  Play,
  Share2,
  QrCode,
  Dumbbell,
  Clock,
  Users,
  ShieldCheck,
  User,
  Medal,
  Download,
  Zap,
  Target,
  Timer,
  Flame,
  Images,
  Link,
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface SportsAcademyTemplateProps {
  data: any;
  template: any;
}

const SportsMapEmbed = React.memo(function SportsMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-2xl overflow-hidden h-52">
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function SportsAcademyTemplate({ data, template }: SportsAcademyTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  const [currentReview, setCurrentReview] = React.useState(0);
  const [currentGalleryImage, setCurrentGalleryImage] = React.useState(0);
  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);

  const [playingKey, setPlayingKey] = React.useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = React.useState(
    configSections.language?.template_language || 'en'
  );
  const [showQrModal, setShowQrModal] = React.useState(false);

  React.useEffect(() => {
    const reviews = configSections.testimonials?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);

  React.useEffect(() => {
    const images = configSections.gallery?.gallery_images || [];
    if (!Array.isArray(images) || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentGalleryImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [configSections.gallery?.gallery_images]);

  const rtlLanguages = ['ar', 'he'];
  const isRTL = rtlLanguages.includes(currentLanguage);

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageSelector(false);
    i18n.changeLanguage(langCode);
  };

  const videoContent = React.useMemo(() => {
    const videos = configSections.videos?.video_list || [];
    if (!Array.isArray(videos)) return [];

    return videos.map((video: any, index: number) => {
      if (video?.embed_url && video.embed_url.includes('<iframe')) {
        return {
          ...video,
          key: `video-${index}-${video?.title || ''}-${video?.embed_url?.substring(0, 20) || ''}`,
        };
      }

      const sanitizedVideo = sanitizeVideoData(video);
      const videoData = sanitizedVideo?.embed_url ? extractVideoUrl(sanitizedVideo.embed_url) : null;

      return {
        ...sanitizedVideo,
        videoData,
        key: `video-${index}-${sanitizedVideo?.title || ''}-${sanitizedVideo?.embed_url || ''}`,
      };
    });
  }, [configSections.videos?.video_list]);

  const colors = configSections.colors ||
    template?.defaultColors || {
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#ccfbf1',
    background: '#f0fdfa',
    text: '#134e4a',
    cardBg: '#ffffff',
    borderColor: '#99f6e4',
  };

  const font = React.useMemo(
    () => configSections.font || template?.defaultFont || 'Space Grotesk, sans-serif',
    [configSections.font, template?.defaultFont]
  );

  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Space Grotesk, sans-serif';
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

  const allSections = getBusinessTemplate('sports-academy')?.sections || [];

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
      case 'programs':
        return renderProgramsSection(sectionData);
      case 'coaches':
        return renderCoachesSection(sectionData);
      case 'achievements':
        return renderAchievementsSection(sectionData);
      case 'schedule':
        return renderScheduleSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'videos':
        return renderVideosSection();
      case 'social':
        return renderSocialSection(sectionData);
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
      case 'footer':
        return renderFooterSection(sectionData);
      case 'action_buttons':
        return renderActionButtonsSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div style={{ backgroundColor: colors.background }}>

      {/* ── Hero banner ── */}
      <div
        className="relative w-full"
        style={{ height: '260px' }}
      >
        {/* Background: cover image or gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: headerData.cover_image
              ? `url(${getImageDisplayUrl(headerData.cover_image)}) center/cover no-repeat`
              : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        />
        {/* Subtle dark scrim at bottom so logo card blends */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%)' }}
        />

        {/* Diagonal accent stripes */}
        <div className="absolute -top-6 -right-8 w-36 h-36 rotate-45 opacity-20" style={{ backgroundColor: 'white' }} />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rotate-45 opacity-10" style={{ backgroundColor: 'white' }} />

        {/* Left sports SVG — dumbbell */}
        <div className="absolute left-3 top-3 opacity-20" style={{ color: 'white' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 5v14" />
            <path d="M18 5v14" />
            <path d="M4 7h4" />
            <path d="M4 17h4" />
            <path d="M16 7h4" />
            <path d="M16 17h4" />
            <path d="M8 12h8" />
          </svg>
        </div>

        {/* Right sports SVG — trophy */}
        <div className="absolute right-3 top-45 opacity-20" style={{ color: 'white' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3" />
            <path d="M18 9h3a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-3" />
            <path d="M6 4h12v7a6 6 0 0 1-12 0V4Z" />
            <path d="M12 17v3" />
            <path d="M8 21h8" />
          </svg>
        </div>

        {/* Center text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <p
            className="text-2xl font-semibold"
            style={{ color: 'white', fontFamily: font, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {t('Sports Academy')}
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-10 opacity-50" style={{ backgroundColor: 'white' }} />
            <Dumbbell className="w-4 h-4 opacity-70 text-white" />
            <div className="h-px w-10 opacity-50" style={{ backgroundColor: 'white' }} />
          </div>
        </div>

        {/* Language switcher */}
        {configSections?.language?.enable_language_switcher && (
          <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', fontFamily: font }}
              >
                <Globe className="w-3 h-3" />
                <span>{languageData.find((l) => l.code === currentLanguage)?.name || 'EN'}</span>
              </button>
              {showLanguageSelector && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] max-h-48 overflow-y-auto">
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      <span>{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0)))}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Info card — sits outside / below the hero ── */}
      <div className="relative px-5 pb-5">
        {/* Logo — half overlaps the hero */}
        <div className="flex justify-center" style={{ marginTop: '-44px' }}>
          <div
            className="w-24 h-24 rounded-2xl overflow-hidden shrink-0"
            style={{
              border: `3px solid ${colors.cardBg}`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.18), 0 0 0 3px ${colors.primary}40`,
              backgroundColor: colors.cardBg,
            }}
          >
            {headerData.logo ? (
              <img src={getImageDisplayUrl(headerData.logo)} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
              >
                <Dumbbell className="w-9 h-9 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Text info */}
        <div className="text-center mt-3">
          {/* Sport type badge */}
          {headerData.sport_type && (
            <span
              className="inline-flex items-center gap-1 text-[15px] font-bold tracking-widest px-3 py-1 rounded-full mb-2"
              style={{ backgroundColor: colors.primary + '18', color: colors.primary, fontFamily: font }}
            >
              <Zap className="w-4 h-4 me-1" />
              {headerData.sport_type}
            </span>
          )}

          <h1
            className="text-xl font-semibold"
            style={{ color: colors.text, fontFamily: font }}
          >
            {headerData.name || data.name}
          </h1>

          {headerData.tagline && (
            <p
              className="text-sm mt-1 opacity-70 "
              style={{ color: colors.text, fontFamily: font }}
            >
              {headerData.tagline}
            </p>
          )}
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

  const renderContactSection = (contactData: any) => {
    const rows = [
      [
        { href: `mailto:${contactData.email || data.email}`, Icon: Mail, label: t('Email'), value: contactData.email || data.email, color: colors.primary, show: !!(contactData.email || data.email) },
        { href: `tel:${contactData.phone || data.phone}`, Icon: Phone, label: t('Call'), value: contactData.phone || data.phone, color: colors.secondary, show: !!(contactData.phone || data.phone) },
      ],
      [
        { href: contactData.website || data.website, Icon: Globe, label: t('Website'), value: contactData.website || data.website, color: colors.primary, show: !!(contactData.website || data.website), target: '_blank' },
        { href: null, Icon: MapPin, label: t('Location'), value: contactData.location, color: colors.secondary, show: !!contactData.location },
      ],
    ];

    const hasAny = rows.some((row) => row.some((i) => i.show));
    if (!hasAny) return null;

    return (
      <div className="px-6 py-4">
        <div
          className="relative px-4 pt-4 pb-4 rounded-2xl"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
              <Phone className="w-4 h-4" />
              <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Contact Us')}</span>
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          </div>

          <div className="space-y-3">
            {rows.map((row, ri) => {
              const visible = row.filter((i) => i.show);
              if (visible.length === 0) return null;
              return (
                <div key={ri} className="grid gap-2 pt-3" style={{ gridTemplateColumns: `repeat(${visible.length}, 1fr)` }}>
                  {visible.map(({ href, Icon, label, value, color, target }: any, i: number) => {
                    const Tag = href ? 'a' : 'div';
                    return (
                      <Tag
                        key={i}
                        {...(href ? { href, ...(target ? { target, rel: 'noopener noreferrer' } : {}) } : {})}
                        className="relative flex flex-col items-center gap-1.5 px-3 pt-6 pb-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 min-w-0 w-full"
                        style={{ background: colors.background, border: `1.5px solid ${color}40` }}
                      >
                        <div
                          className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xs font-medium break-all w-full text-center px-1" style={{ color: colors.text, fontFamily: font }}>{value}</p>
                      </Tag>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;

    return (
      <div className="px-6 py-4">
        <div
          className="relative p-4 rounded-2xl"
          style={{ backgroundColor: colors.cardBg }}
        >
          <div
            className="flex items-center gap-2 mb-4"
          >
            <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('About Us')}</span>
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          </div>

          <div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text, fontFamily: font }}>
              {aboutData.description || data.description}
            </p>

            {aboutData.mission && (
              <div
                className="mb-3 rounded-xl p-3"
                style={{ backgroundColor: colors.primary + '08', border: `1px solid ${colors.primary}20` }}
              >
                <p className="text-sm font-bold mb-2 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
                  <Activity className="w-4 h-4 mr-1" />
                  {t('Our Mission')}:
                </p>
                <p className="text-sm" style={{ color: colors.text, fontFamily: font }}>
                  {aboutData.mission}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {[
                { label: t('Players'), value: aboutData.total_players, Icon: Users },
                { label: t('Coaches'), value: aboutData.total_coaches, Icon: UserPlus },
                { label: t('Trophies'), value: aboutData.trophies_won, Icon: Trophy },
                { label: t('Years Active'), value: aboutData.years_active, Icon: Clock },
              ]
                .filter((item) => item.value)
                .map(({ label, value, Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 py-2"
                    style={{ borderBottom: `1px solid ${colors.primary}14` }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: colors.primary + '12', color: colors.primary }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[13px]" style={{ color: colors.primary, fontFamily: font }}>
                        {label}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-right shrink-0" style={{ color: colors.primary, fontFamily: font }}>
                      {value}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProgramsSection = (programsData: any) => {
    const programs = programsData.program_list || [];
    if (!Array.isArray(programs) || programs.length === 0) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Dumbbell className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Training Programs')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        <div className="space-y-3">
          {programs.map((program: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.cardBg, border: `1.5px solid ${colors.primary}20` }}
            >
              {/* Header: title + fee */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                  >
                    <Dumbbell className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm leading-snug" style={{ color: colors.text, fontFamily: font }}>
                    {program.title}
                  </h4>
                </div>
                {program.fee && (
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-xl shrink-0"
                    style={{ backgroundColor: colors.primary + '15', color: colors.primary, fontFamily: font }}
                  >
                    {program.fee}
                  </span>
                )}
              </div>

              {/* Divider */}
              <div className="h-px mb-2" style={{ backgroundColor: colors.primary + '15' }} />

              {program.description && (
                <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
                  {program.description}
                </p>
              )}

              {(program.age_group || program.duration) && (
                <div className="flex flex-wrap gap-2">
                  {program.age_group && (
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg"
                      style={{ backgroundColor: colors.secondary + '12', color: colors.secondary, fontFamily: font }}
                    >
                      <Users className="w-3 h-3" />
                      <span>{program.age_group}</span>
                    </div>
                  )}
                  {program.duration && (
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{program.duration}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCoachesSection = (coachesData: any) => {
    const coaches = coachesData.coach_list || [];
    if (!Array.isArray(coaches) || coaches.length === 0) return null;

    return (
      <div className="px-6 py-4">
        <h3
          className="text-center font-bold text-lg mb-4 flex items-center justify-center"
          style={{ color: colors.primary, fontFamily: font }}
        >
          <ShieldCheck className="w-5 h-5 mr-2" />
          {t('Meet Our Coaches')}
        </h3>
        <div className="space-y-3">
          {coaches.map((coach: any, index: number) => (
            <div
              key={index}
              className="p-4 rounded-2xl transition-all hover:scale-105"
              style={{
                backgroundColor: colors.cardBg,
                border: `2px solid ${colors.primary}20`,
                boxShadow: `0 4px 15px ${colors.primary}10`,
              }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary + '15', border: `2px solid ${colors.secondary}30` }}
                >
                  {coach.photo ? (
                    <img src={getImageDisplayUrl(coach.photo)} alt={coach.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7" style={{ color: colors.secondary }} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1" style={{ color: colors.text, fontFamily: font }}>
                    {coach.name}
                  </h4>
                  {coach.role && (
                    <p className="text-xs font-semibold mb-1" style={{ color: colors.primary, fontFamily: font }}>
                      {coach.role}
                    </p>
                  )}
                  {coach.experience && (
                    <p className="text-xs" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {coach.experience} {t('experience')}
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

  const renderAchievementsSection = (achievementsData: any) => {
    const achievements = achievementsData.achievement_list || [];
    if (!Array.isArray(achievements) || achievements.length === 0) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Medal className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Achievements')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          </div>

        <div className="space-y-3">
          {achievements.map((achievement: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}20` }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-sm" style={{ color: colors.text, fontFamily: font }}>
                  {achievement.title}
                </h4>
                {achievement.year && (
                  <Badge className="rounded-full" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary, fontFamily: font }}>
                    {achievement.year}
                  </Badge>
                )}
              </div>
              {achievement.description && (
                <p className="text-sm" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {achievement.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScheduleSection = (scheduleData: any) => {
    const schedules = scheduleData.schedule_list || [];
    if (!Array.isArray(schedules) || schedules.length === 0) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Training Schedule')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>
        <div className="relative">
          <div className="absolute left-[18px] top-0 bottom-0 w-0.5" style={{ backgroundColor: colors.primary + '30' }} />
          <div className="space-y-3">
            {schedules.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1"
                  style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 0 0 3px ${colors.primary}25` }}
                >
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div
                  className="flex-1 rounded-2xl px-4 py-3"
                  style={{ backgroundColor: colors.cardBg, border: `1.5px solid ${colors.primary}20` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>{t(item.day)}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.secondary + '20', color: colors.secondary, fontFamily: font }}>
                      {item.time}
                    </span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{item.session}</p>
                  {item.age_group && (
                    <p className="text-xs mt-1" style={{ color: colors.text, fontFamily: font }}>
                      {t('Age Group')}: {item.age_group}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const images = galleryData.gallery_images || [];
    if (!Array.isArray(images) || images.length === 0) return null;

    const current = images[currentGalleryImage] || images[0];

    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Images className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Facility Gallery')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        {/* Main image */}
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: '220px', backgroundColor: colors.cardBg }}>
          {current.image ? (
            <img
              key={currentGalleryImage}
              src={getImageDisplayUrl(current.image)}
              alt={current.caption || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }}>
              <Trophy className="w-10 h-10" style={{ color: colors.primary }} />
            </div>
          )}
          {current.caption && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
              <p className="text-xs font-semibold text-white" style={{ fontFamily: font }}>{current.caption}</p>
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentGalleryImage(i)}
                className="rounded-full transition-all cursor-pointer"
                style={{
                  width: i === currentGalleryImage ? '20px' : '8px',
                  height: '8px',
                  backgroundColor: i === currentGalleryImage ? colors.primary : colors.primary + '40',
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderVideosSection = () => {
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
      <div className="px-6 py-4">
        {/* Section heading */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Video className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Training Videos')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div
              key={video.key}
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: colors.cardBg, border: `1.5px solid ${colors.primary}20` }}
            >
              {/* Video embed / thumbnail */}
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
                      <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}12)` }}>
                        <Video className="w-8 h-8" style={{ color: colors.primary }} />
                      </div>
                    )}
                    {videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, boxShadow: `0 6px 20px ${colors.primary}70` }}
                        >
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Info row */}
              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>{video.title}</p>
                    <div className="h-px my-2" style={{ backgroundColor: colors.primary + '20' }} />
                    {video.description && (
                      <p className="text-sm mt-1" style={{ color: colors.text, fontFamily: font }}>{video.description}</p>
                    )}
                  </div>
                  {video.duration && (
                    <div
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0"
                      style={{ backgroundColor: colors.primary + '12', color: colors.primary, fontFamily: font }}
                    >
                      <Timer className="w-3 h-3" />
                      {video.duration}
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;

    return (
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Follow Us')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center transition-all hover:-translate-y-1"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:shadow-lg"
                style={{
                  backgroundColor: colors.primary,
                  boxShadow: `0 4px 10px ${colors.primary}50`
                }}
              >
                <SocialIcon platform={link.platform} color="white" />
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    const review = reviews[currentReview] || reviews[0];
    if (!review) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Star className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Testimonials')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>
        <div
          className="p-6 rounded-2xl text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.secondary}10, ${colors.accent}10)`,
            border: `2px solid ${colors.secondary}20`,
          }}
        >
          <div className="flex justify-center mb-3">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${index < parseInt(review.rating || '5', 10) ? 'fill-current' : ''}`}
                style={{ color: index < parseInt(review.rating || '5', 10) ? '#F59E0B' : '#D1D5DB' }}
              />
            ))}
          </div>
          <p className="text-sm mb-4" style={{ color: colors.text, fontFamily: font }}>
            "{review.review}"
          </p>
          <p className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
            {review.client_name}
          </p>
          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {reviews.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className="w-2 h-2 rounded-full transition-all cursor-pointer"
                  style={{ backgroundColor: index === currentReview ? colors.primary : colors.primary + '40' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => (
    <div className="px-6 py-4">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
      >
        {/* Decorative bg circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: 'white' }} />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: 'white' }} />

        <div className="relative p-5">
          {/* Top row: icon + text */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white" style={{ fontFamily: font }}>
                {t('Book a Trial Session')}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: font }}>
                {t('Schedule a session and start building your next level of performance.')}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />

          {/* CTA Button */}
          <Button
            className="w-full h-11 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            style={{
              backgroundColor: 'white',
              color: colors.primary,
              fontFamily: font,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            onClick={() => handleAppointmentBooking(appointmentsData)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {configSections.action_buttons?.appointment_button_text || t('Book Free Trial')}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{t('Our Location')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: colors.cardBg,
            border: `2px solid ${colors.primary}20`,
            boxShadow: `0 4px 15px ${colors.primary}10`,
          }}
        >
          {locationData.map_embed_url && (
            <SportsMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          {locationData.directions_url && (
            <div className="p-4">
              <Button
                size="sm"
                className="w-full rounded-xl"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontFamily: font,
                }}
                onClick={() => typeof window !== 'undefined' && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
              >
                <MapPin className="w-4 h-4 mr-2" />
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
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-2">
          {appData.app_store_url && (
            <Button
              size="sm"
              variant="outline"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              size="sm"
              variant="outline"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== 'undefined' && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className="w-4 h-4 mr-2" />
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
      <div className="px-6 py-4">
        {/* Section heading */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Mail className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{formData.form_title}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: colors.cardBg, border: `1.5px solid ${colors.primary}20` }}
        >
          {formData.form_description && (
            <p className="text-sm text-center mb-4" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button
            className="w-full h-11 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
              boxShadow: `0 4px 14px ${colors.primary}45`,
            }}
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
      <div className="px-6 py-4">
        {customHtmlData.show_title && customHtmlData.section_title && (
          <h3 className="text-center font-bold text-lg mb-4" style={{ color: colors.primary, fontFamily: font }}>
            {customHtmlData.section_title}
          </h3>
        )}
        <div
          className="custom-html-content p-4 rounded-2xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `2px solid ${colors.primary}20`,
            boxShadow: `0 4px 15px ${colors.primary}10`,
            fontFamily: font,
            color: colors.text,
          }}
        >
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-6 py-4">
        {/* Section heading */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: font }}>{qrData.qr_title || t('Share Our Academy')}</span>
          </div>
          <div className="flex-1 h-px" style={{ backgroundColor: colors.primary + '40' }} />
        </div>

        {/* Card with centered QR icon */}
        <div
          className="rounded-2xl p-4 text-center"
          style={{ backgroundColor: colors.cardBg, border: `1.5px solid ${colors.primary}20` }}
        >
          {/* Large QR icon */}
          <div className="flex justify-center mb-2">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`, border: `2px solid ${colors.primary}30` }}
            >
              <QrCode className="w-7 h-7" style={{ color: colors.primary }} />
            </div>
          </div>

          {qrData.qr_description && (
            <p className="text-sm mb-3 mx-auto" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            className="h-9 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95 px-8"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
              boxShadow: `0 4px 14px ${colors.primary}45`,
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t('View QR Code')}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;

    return (
      <div className="px-6 pb-4">
        <div
          className="rounded-2xl px-4 py-4 text-center"
          style={{
            border: `1px solid ${colors.primary}18`,
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2" style={{ color: colors.primary }}>
            <Star className="w-4 h-4" />
            <span className="text-sm font-semibold" style={{ fontFamily: font }}>
              {t('Thank You')}
            </span>
          </div>

          <p
            className="text-sm"
            style={{ color: colors.text + 'AA', fontFamily: font }}
          >
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer && !footerData.footer_text && !(footerData.footer_links || []).length) return null;

    return (
      <div className="px-6 py-4" style={{ backgroundColor: colors.primary + '08' }}>
        {footerData.footer_text && (
          <p className="text-xs text-center mb-3" style={{ color: colors.text, fontFamily: font }}>
            {footerData.footer_text}
          </p>
        )}
        {Array.isArray(footerData.footer_links) && footerData.footer_links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {footerData.footer_links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline"
                style={{ color: colors.primary, fontFamily: font }}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;
    const hasShareButton = true;

    if (!hasContactButton && !hasSaveContactButton && !hasShareButton) return null;

    return (
      <div className="px-6 py-4">
        <div className="flex flex-col gap-3">
          {hasSaveContactButton && (
            <Button
              className="w-full h-11 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                fontFamily: font,
                boxShadow: `0 4px 14px ${colors.primary}45`,
              }}
              onClick={() => {
                const headerData = configSections.header || {};
                const contactData = configSections.contact || {};
                const vcfData = {
                  name: headerData.name || data.name || '',
                  title: headerData.sport_type || data.title || '',
                  email: contactData.email || data.email || '',
                  phone: contactData.phone || data.phone || '',
                  website: contactData.website || data.website || '',
                  location: contactData.location || '',
                };
                import('@/utils/vcfGenerator').then((module) => {
                  module.downloadVCF(vcfData);
                });
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {actionData.save_contact_button_text}
            </Button>
          )}

          <Button
            className="w-full h-11 font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            style={{
              backgroundColor: 'transparent',
              color: colors.primary,
              fontFamily: font,
              border: `2px solid ${colors.primary}`,
            }}
            onClick={() => setShowQrModal(true)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t('Share Academy')}
          </Button>
        </div>
      </div>
    );
  };

  const copyrightSection = configSections.copyright;
  const orderedSectionKeys = getSectionOrder(
    data.template_config || { sections: configSections, sectionSettings: configSections },
    allSections
  );

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        fontFamily: font,
        backgroundColor: colors.background,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {orderedSectionKeys
        .filter((key) => key !== 'colors' && key !== 'font' && key !== 'copyright' && key !== 'seo' && key !== 'pixels')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>{renderSection(sectionKey)}</React.Fragment>
        ))}

      {copyrightSection && (
        <div className="px-6 pb-4 pt-2">
          {copyrightSection.text && (
            <p className="text-xs text-center" style={{ color: colors.primary, fontFamily: font }}>
              {copyrightSection.text}
            </p>
          )}
        </div>
      )}

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
