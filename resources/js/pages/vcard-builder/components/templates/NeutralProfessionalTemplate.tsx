import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import {
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  UserPlus,
  Briefcase,
  Star,
  User,
  QrCode,
  Clock,
  ChevronRight,
  Quote,
  ArrowUpRight,
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface NeutralProfessionalTemplateProps {
  data: any;
  template: any;
}

const NeutralProfessionalMapEmbed = React.memo(function NeutralProfessionalMapEmbed({
  embedHtml,
}: {
  embedHtml: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ height: '180px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function NeutralProfessionalTemplate({
  data,
  template,
}: NeutralProfessionalTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  const [currentReview, setCurrentReview] = React.useState(0);

  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);

  const [showLanguageSelector, setShowLanguageSelector] = React.useState(false);
  const [currentLanguage, setCurrentLanguage] = React.useState(
    configSections.language?.template_language || 'en'
  );
  const [showQrModal, setShowQrModal] = React.useState(false);

  const rtlLanguages = ['ar', 'he'];
  const isRTL = rtlLanguages.includes(currentLanguage);

  const changeLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    setShowLanguageSelector(false);
    i18n.changeLanguage(langCode);
  };

  const colors = {
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#F1F5F9',
    background: '#FFFFFF',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    ...template?.defaultColors,
    ...configSections.colors,
  };
  const cardBg = colors.cardBg || '#FFFFFF';
  const sectionBg = `${colors.accent}66`;
  const sectionCardStyle = {
    backgroundColor: cardBg,
    border: `1px solid ${colors.accent}`,
    boxShadow: `0 10px 24px ${colors.primary}08`,
  };
  const softInnerCardStyle = {
    backgroundColor: colors.primary + '04',
    border: `1px solid ${colors.accent}`,
  };

  const font = React.useMemo(
    () => configSections.font || template?.defaultFont || 'Inter, sans-serif',
    [configSections.font, template?.defaultFont]
  );

  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Inter, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/["\']/g, '');

    if (
      fontFamily &&
      fontFamily !== 'Arial' &&
      fontFamily !== 'sans-serif' &&
      fontFamily !== 'serif'
    ) {
      const linkId = `google-font-${fontFamily.replace(/\s+/g, '-')}`;

      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
          /\s+/g,
          '+'
        )}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [configSections.font, template?.defaultFont]);

  const allSections = getBusinessTemplate('neutral-professional')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false)
      return null;

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
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'contact_form':
        return renderContactFormSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'google_map':
        return renderLocationSection(sectionData);
      case 'app_download':
        return renderAppDownloadSection(sectionData);
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

  const renderSectionTitle = (title: string, sectionKey: string, icon?: React.ReactNode) => {
    return (
      <div className="relative mb-5 flex items-end justify-between overflow-hidden">
        <div className="relative z-10 flex items-center gap-2.5">
          {icon && (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.primary + '12' }}
            >
              <span style={{ color: colors.primary }}>{icon}</span>
            </div>
          )}
          <div>
            <h3
              className="text-base font-bold"
              style={{ color: colors.text, fontFamily: font }}
            >
              {title}
            </h3>
            <div
              className="w-10 h-0.5 rounded-full mt-1"
              style={{ backgroundColor: colors.primary }}
            />
          </div>
        </div>
        <div
          className="flex-1 h-px ml-4 mb-2"
          style={{ backgroundColor: colors.accent }}
        />
      </div>
    );
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative overflow-visible">
      {/* Background banner with soft color */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: colors.primary + '10' }}
      />

      {/* Decorative shapes */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
        style={{ backgroundColor: colors.primary + '06' }}
      />
      <div
        className="absolute top-8 right-20 w-3 h-3 rounded-full"
        style={{ backgroundColor: colors.primary + '20' }}
      />
      <div
        className="absolute bottom-6 right-12 w-2 h-2 rounded-full"
        style={{ backgroundColor: colors.primary + '25' }}
      />
      <div
        className="absolute top-12 left-6 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors.primary + '18' }}
      />

      {/* Bottom wave curve using SVG */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[30px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,140.83,94.17,321.39,56.44Z"
            style={{ fill: colors.background }}
          />
        </svg>
      </div>

      <div className="relative z-10 px-8 pt-10 pb-12">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-5 ${isRTL ? 'left-6' : 'right-6'} z-30`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all hover:shadow-sm"
                style={{
                  backgroundColor: cardBg,
                  color: colors.text,
                  fontFamily: font,
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <Globe className="w-3 h-3" style={{ color: colors.primary }} />
                <span>{languageData.find((lang) => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <button
                    type="button"
                    aria-label="Close language selector"
                    className="fixed inset-0 z-40 cursor-pointer bg-transparent"
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className={`absolute top-full mt-2 ${
                      isRTL ? 'left-0' : 'right-0'
                    } z-50 w-56 max-w-[calc(100vw-1.5rem)] max-h-56 overflow-y-auto rounded-2xl border py-1.5 shadow-2xl`}
                    style={{
                      borderColor: colors.accent,
                      backgroundColor: cardBg,
                    }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors cursor-pointer ${
                          currentLanguage === lang.code
                            ? 'font-medium'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                        color: currentLanguage === lang.code ? colors.primary : colors.text,
                        fontFamily: font,
                      }}
                      >
                        <span className="text-sm">
                          {String.fromCodePoint(
                            ...lang.countryCode
                              .toUpperCase()
                            .split('')
                            .map((char) => 127397 + char.charCodeAt())
                          )}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {/* Profile image with decorative ring */}
          <div className="relative mb-5">
            {/* Outer decorative ring */}
            <div
              className="absolute inset-0 rounded-full scale-[1.12]"
              style={{
                border: `2px dashed ${colors.primary + '25'}`,
              }}
            />
            {/* Inner accent ring */}
            <div
              className="absolute inset-0 rounded-full scale-[1.06]"
              style={{
                border: `2px solid ${colors.primary + '15'}`,
              }}
            />
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center overflow-hidden relative z-10"
              style={{
                backgroundColor: cardBg,
                border: `3px solid ${cardBg}`,
                boxShadow: `0 4px 20px ${colors.primary}15`,
              }}
            >
              {headerData.profile_image ? (
                <img
                  src={getImageDisplayUrl(headerData.profile_image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12" style={{ color: colors.primary + '30' }} />
              )}
            </div>
            {/* Small status dot */}
            <div
              className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-20"
              style={{
                backgroundColor: cardBg,
                borderColor: cardBg,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            </div>
          </div>

          {/* Name */}
          <h1
            className="text-2xl font-bold tracking-tight leading-tight mb-2"
            style={{ color: colors.text, fontFamily: font }}
          >
            {headerData.name || data.name || ''}
          </h1>

          {/* Title badge */}
          {headerData.title && (
            <div
              className="inline-flex items-center px-4 py-1.5 rounded-full mb-3"
              style={{
                backgroundColor: colors.primary + '12',
                color: colors.primary,
                fontFamily: font,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: colors.primary }} />
              <span className="text-sm font-semibold">{headerData.title}</span>
            </div>
          )}

          {/* Tagline */}
          {headerData.tagline && (
            <p
              className="text-sm leading-relaxed max-w-[260px]"
              style={{ color: colors.text, fontFamily: font }}
            >
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => {
    const items = [];
    if (contactData.email || data.email) {
      items.push({
        icon: <Mail className="w-4 h-4" />,
        label: contactData.email || data.email,
        href: `mailto:${contactData.email || data.email}`,
      });
    }
    if (contactData.phone || data.phone) {
      items.push({
        icon: <Phone className="w-4 h-4" />,
        label: contactData.phone || data.phone,
        href: `tel:${contactData.phone || data.phone}`,
      });
    }
    if (contactData.website || data.website) {
      items.push({
        icon: <Globe className="w-4 h-4" />,
        label: t('Website'),
        href: contactData.website || data.website,
        external: true,
      });
    }
    if (contactData.location) {
      items.push({
        icon: <MapPin className="w-4 h-4" />,
        label: contactData.location,
      });
    }

    if (items.length === 0) return null;

    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Contact'), 'contact', <Phone className="w-4 h-4" />)}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: cardBg,
            border: `1px solid ${colors.accent}`,
          }}
        >
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            const content = (
              <div className="flex items-center gap-4 group px-5 py-4 transition-colors hover:bg-gray-50/50">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colors.primary + '10' }}
                >
                  <span style={{ color: colors.primary }}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className="text-sm font-semibold block truncate"
                    style={{ color: colors.text, fontFamily: font }}
                  >
                    {item.label}
                  </span>
                </div>
                {(item.href || item.external) && (
                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 opacity-40"
                    style={{ color: colors.primary }}
                  />
                )}
              </div>
            );

            return (
              <React.Fragment key={idx}>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    {content}
                  </a>
                ) : (
                  <div>{content}</div>
                )}
                {!isLast && (
                  <div
                    className="mx-5 h-px"
                    style={{ backgroundColor: colors.accent }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;

    const skills = aboutData.skills
      ? aboutData.skills
          .split(',')
          .map((skill: string) => skill.trim())
          .filter(Boolean)
      : [];

    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('About'), 'about', <User className="w-4 h-4" />)}
        <div className="rounded-2xl p-4" style={sectionCardStyle}>
          <div
            className="rounded-xl p-4 mb-3"
            style={{
              backgroundColor: colors.primary + '04',
              border: `1px solid ${colors.accent}`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '10' }}
              >
                <Quote className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: colors.text, fontFamily: font }}
              >
                {data.name || t('Professional Overview')}
              </p>
            </div>
            <p
              className="text-sm leading-6"
              style={{ color: colors.text + 'B3', fontFamily: font }}
            >
              {aboutData.description || data.description}
            </p>
          </div>

          {skills.length > 0 && (
            <div
              className="rounded-xl p-4 mb-3"
              style={softInnerCardStyle}
            >
              <p
                className="text-xs font-semibold mb-3"
                style={{ color: colors.text + '80', fontFamily: font }}
              >
                {t('Skills')}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs font-medium px-3 py-1.5 rounded-md"
                    style={{
                      backgroundColor: colors.background,
                      color: colors.text,
                      fontFamily: font,
                      border: `1px solid ${colors.accent}`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {aboutData.experience && (
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-2.5"
              style={{
                backgroundColor: colors.primary + '06',
                border: `1px solid ${colors.primary}14`,
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary + '10' }}
              >
                <Briefcase className="w-3.5 h-3.5" style={{ color: colors.primary }} />
              </div>
              <div>
                <span
                  className="block text-xl font-bold leading-none mb-0.5"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {aboutData.experience}+
                </span>
                <span
                  className="text-xs"
                  style={{ color: colors.text + '99', fontFamily: font }}
                >
                  {t('Years Experience')}
                </span>
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
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Services'), 'services', <Briefcase className="w-4 h-4" />)}
        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div
              key={index}
              className="group p-4 rounded-2xl transition-all hover:shadow-sm"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${colors.accent}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-semibold text-sm mb-1"
                    style={{ color: colors.text, fontFamily: font }}
                  >
                    {service.title}
                  </h4>
                  {service.description && (
                    <p
                      className="text-sm leading-relaxed mb-2"
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      {service.description}
                    </p>
                  )}
                </div>
                {service.price && (
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: colors.primary + '08',
                      color: colors.primary,
                      fontFamily: font,
                    }}
                  >
                    {service.price}
                  </span>
                )}
              </div>
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
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Portfolio'), 'portfolio', <Briefcase className="w-4 h-4" />)}

        <div className="grid grid-cols-2 gap-3">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="group rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${colors.accent}`,
              }}
            >
              {project.image && (
                <div className="relative overflow-hidden">
                  <img
                    src={getImageDisplayUrl(project.image)}
                    alt={project.title}
                    className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              )}
              <div className="p-4">
                <h4
                  className="font-bold text-sm mb-1.5"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {project.title}
                </h4>
                {project.description && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: colors.text + '90', fontFamily: font }}
                  >
                    {project.description}
                  </p>
                )}
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
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Social Media'), 'social', <Globe className="w-4 h-4" />)}
        <div className="rounded-2xl p-4" style={sectionCardStyle}>
          <div className="flex flex-wrap gap-2.5">
            {socialLinks.map((link: any, index: number) => (
              <button
                key={index}
                onClick={() =>
                  link.url &&
                  typeof window !== 'undefined' &&
                  window.open(link.url, '_blank', 'noopener,noreferrer')
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:shadow-sm active:scale-95"
                style={{
                  backgroundColor: colors.accent + '60',
                  color: colors.text,
                  fontFamily: font,
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <SocialIcon platform={link.platform} className="w-4 h-4" />
                <span className="capitalize">{link.platform}</span>
                <ArrowUpRight className="w-3 h-3 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Business Hours'), 'business_hours', <Clock className="w-4 h-4" />)}

        <div className="space-y-2.5">
          {hours.slice(0, 7).map((hour: any, index: number) => {
            const isToday = hour.day === today;
            return (
              <div
                key={index}
                className="flex items-center justify-between px-5 py-3.5 rounded-xl"
                style={{
                  backgroundColor: isToday
                    ? colors.primary + '06'
                    : cardBg,
                  border: `1px solid ${isToday ? colors.primary + '20' : colors.accent}`,
                }}
              >
                {/* Day */}
                <span
                  className="capitalize font-semibold text-sm"
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {t(hour.day)}
                  {isToday && (
                    <span
                      className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: colors.primary + '12',
                        color: colors.primary,
                      }}
                    >
                      {t('Today')}
                    </span>
                  )}
                </span>

                {/* Time */}
                <span
                  className="text-sm font-bold"
                  style={{
                    color: hour.is_closed ? colors.text + '40' : colors.primary,
                    fontFamily: font,
                  }}
                >
                  {hour.is_closed
                    ? t('Closed')
                    : `${hour.open_time} - ${hour.close_time}`}
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
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Testimonials'), 'testimonials', <Quote className="w-4 h-4" />)}

        <div className="relative rounded-2xl p-4" style={sectionCardStyle}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div
                    className="p-5 rounded-2xl relative"
                    style={softInnerCardStyle}
                  >
                    <Quote
                      className="w-6 h-6 mb-3"
                      style={{ color: colors.primary + '25' }}
                    />
                    <p
                      className="text-sm leading-relaxed mb-4"
                      style={{ color: colors.text + 'CC', fontFamily: font }}
                    >
                      {review.review}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: colors.primary, fontFamily: font }}
                      >
                        {review.client_name}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < parseInt(review.rating || 5)
                                ? 'fill-current'
                                : 'text-gray-200'
                            }`}
                            style={{
                              color:
                                i < parseInt(review.rating || 5)
                                  ? '#F59E0B'
                                  : undefined,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 gap-1.5">
              {reviews.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => setCurrentReview(dotIndex)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: dotIndex === currentReview ? '20px' : '6px',
                    backgroundColor:
                      dotIndex === currentReview
                        ? colors.primary
                        : colors.primary + '30',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(formData.form_title, 'contact_form', <Mail className="w-4 h-4" />)}
        <div className="rounded-2xl p-4" style={sectionCardStyle}>
          {formData.form_description && (
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: colors.text, fontFamily: font }}
            >
              {formData.form_description}
            </p>
          )}
          <Button
            size="sm"
            className="w-full h-10 rounded-xl font-medium transition-all hover:shadow-md active:scale-[0.98]"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font,
            }}
            onClick={() =>
              typeof window !== 'undefined' &&
              window.dispatchEvent(new CustomEvent('openContactModal'))
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('Get In Touch')}
          </Button>
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = () => {
    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Appointments'), 'appointments', <Calendar className="w-4 h-4" />)}

        <div className="space-y-3 rounded-2xl p-4" style={sectionCardStyle}>
          <Button
            size="sm"
            variant="outline"
            className="w-full h-10 rounded-xl font-semibold"
            style={{
              borderColor: colors.accent,
              color: colors.primary,
              fontFamily: font,
              backgroundColor: sectionBg,
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t('View Slots')}
          </Button>
          <Button
            size="sm"
            className="w-full h-10 rounded-xl font-semibold"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font,
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t('Book Now')}
          </Button>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Location'), 'google_map', <MapPin className="w-4 h-4" />)}

        <div className="space-y-3 rounded-2xl p-4" style={sectionCardStyle}>
          {locationData.map_embed_url && (
            <NeutralProfessionalMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          {locationData.directions_url && (
            <Button
              size="sm"
              variant="outline"
              className="w-full h-11 rounded-xl font-medium transition-all hover:shadow-sm active:scale-[0.98]"
              style={{
                borderColor: colors.accent,
                color: colors.primary,
                fontFamily: font,
                backgroundColor: colors.accent + '40',
              }}
              onClick={() =>
                typeof window !== 'undefined' &&
                window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')
              }
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
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(t('Download App'), 'app_download', <Globe className="w-4 h-4" />)}

        <div className="flex gap-3 mt-2 rounded-2xl p-4" style={sectionCardStyle}>
          {appData.app_store_url && (
            <Button
              size="sm"
              className="flex-1 h-11 rounded-xl font-medium transition-all hover:shadow-sm active:scale-[0.98]"
              style={{
                color: colors.primary,
                fontFamily: font,
                backgroundColor: cardBg,
                border: `1px solid ${colors.accent}`,
              }}
              onClick={() =>
                typeof window !== 'undefined' &&
                window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')
              }
            >
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              size="sm"
              className="flex-1 h-11 rounded-xl font-medium transition-all hover:shadow-sm active:scale-[0.98]"
              style={{
                color: colors.primary,
                fontFamily: font,
                backgroundColor: cardBg,
                border: `1px solid ${colors.accent}`,
              }}
              onClick={() =>
                typeof window !== 'undefined' &&
                window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')
              }
            >
              {t('Play Store')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          renderSectionTitle(customHtmlData.section_title, 'custom_html')
        )}
        <div
          className="p-5 rounded-2xl"
          style={{ ...sectionCardStyle, fontFamily: font, color: colors.text }}
        >
          <StableHtmlContent htmlContent={customHtmlData.html_content} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        {renderSectionTitle(qrData.qr_title || t('Share QR Code'), 'qr_share', <QrCode className="w-4 h-4" />)}

        <div
          className="p-5 rounded-2xl text-center"
          style={sectionCardStyle}
        >
          {qrData.qr_description && (
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: colors.text, fontFamily: font }}
            >
              {qrData.qr_description}
            </p>
          )}
          <Button
            size="sm"
            className="w-full h-10 rounded-xl font-medium transition-all hover:shadow-md active:scale-[0.98]"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font,
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

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        <div
          className="rounded-2xl p-6 text-center relative overflow-hidden"
          style={{ ...sectionCardStyle, backgroundColor: colors.primary + '06' }}
        >
          {/* Decorative dots */}
          <div
            className="absolute top-3 left-4 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.primary + '20' }}
          />
          <div
            className="absolute top-5 right-6 w-1 h-1 rounded-full"
            style={{ backgroundColor: colors.primary + '25' }}
          />
          <div
            className="absolute bottom-3 left-6 w-1 h-1 rounded-full"
            style={{ backgroundColor: colors.primary + '20' }}
          />
          <div
            className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colors.primary + '15' }}
          />

          {/* Heart icon */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>

          {/* Message */}
          <p
            className="text-sm font-medium leading-relaxed"
            style={{ color: colors.primary, fontFamily: font }}
          >
            {thankYouData.message}
          </p>
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-4" style={{ backgroundColor: sectionBg }}>
        <div className="flex gap-3 rounded-2xl p-4">
          {hasContactButton && (
            <Button
              className="flex-1 h-10 rounded-lg font-semibold text-xs transition-all hover:shadow-md active:scale-[0.98]"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
                fontFamily: font,
              }}
              onClick={() =>
                typeof window !== 'undefined' &&
                window.dispatchEvent(new CustomEvent('openContactModal'))
              }
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              {actionData.contact_button_text}
            </Button>
          )}

          {hasSaveContactButton && (
            <Button
              variant="outline"
              className="flex-1 h-10 rounded-lg font-semibold text-xs transition-all hover:shadow-sm active:scale-[0.98]"
              style={{
                borderColor: colors.accent,
                color: colors.primary,
                fontFamily: font,
                backgroundColor: sectionBg,
              }}
              onClick={() => {
                const contactData = {
                  name: data.name || '',
                  title: data.title || '',
                  email: data.email || configSections.contact?.email || '',
                  phone: data.phone || configSections.contact?.phone || '',
                  website: data.website || configSections.contact?.website || '',
                  location: configSections.contact?.location || '',
                };
                import('@/utils/vcfGenerator').then((module) => {
                  module.downloadVCF(contactData);
                });
              }}
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              {actionData.save_contact_button_text}
            </Button>
          )}
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
      className="w-full min-h-full"
      style={{
        fontFamily: font,
        backgroundColor: colors.background,
        direction: isRTL ? 'rtl' : 'ltr',
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: colors.primary }}
      />

      <div className="py-2">
        {orderedSectionKeys
          .filter(
            (key) => key !== 'colors' && key !== 'font' && key !== 'copyright'
          )
          .map((sectionKey) => (
            <React.Fragment key={sectionKey}>
              {renderSection(sectionKey)}
            </React.Fragment>
          ))}

        {copyrightSection && (
          <div className="px-6 py-4">
            {copyrightSection.text && (
              <p
                className="text-sm text-center"
                style={{ color: colors.text + '50', fontFamily: font }}
              >
                {copyrightSection.text}
              </p>
            )}
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
}
