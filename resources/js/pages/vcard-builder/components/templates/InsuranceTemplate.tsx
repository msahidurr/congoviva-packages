import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';

import { 
  Mail, Phone, Globe, MapPin, Shield, Award, Clock, 
  Calendar, Download, UserPlus, Star, CheckCircle, 
  AlertCircle, FileText, Users, QrCode, Share2 
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder, isSectionEnabled, getSectionData } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';

import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface InsuranceTemplateProps {
  data: any;
  template: any;
}

const InsuranceMapEmbed = React.memo(function InsuranceMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function InsuranceTemplate({ data, template }: InsuranceTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);
  const colors = { ...template?.defaultColors, ...configSections.colors } || { 
    primary: '#1E40AF', 
    secondary: '#3B82F6', 
    accent: '#60A5FA', 
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF'
  };
  
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Inter, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/[\"\\']/g, '');
    
    if (fontFamily && fontFamily !== 'Arial' && fontFamily !== 'sans-serif' && fontFamily !== 'serif') {
      const linkId = `google-font-${fontFamily.replace(/\\s+/g, '-')}`;
      
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap`;
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
  };

  // Get all sections for this business type
  const allSections = getBusinessTemplate('insurance')?.sections || [];
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
      case 'insurance_services':
        return renderInsuranceServicesSection(sectionData);
      case 'claims_support':
        return renderClaimsSupportSection(sectionData);
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
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };

  const renderHeaderSection = (headerData: any) => (
    <div className="relative rounded-t-2xl overflow-hidden" style={{ 
      background: `linear-gradient(165deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
      color: '#FFFFFF'
    }}>
      {/* Insurance Industry Pattern Background */}
      <div className="absolute inset-0 opacity-15">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="fill-current">
          <defs>
            <pattern
              id="insurance-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              {/* Shield */}
              <path
                d="M20 6 L28 10 V18 C28 23 20 28 20 28 C20 28 12 23 12 18 V10 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.25"
              />

              {/* Heart (health insurance) */}
              <path
                d="M8 10
                   C8 7, 12 7, 12 10
                   C12 7, 16 7, 16 10
                   C16 13, 12 16, 12 16
                   C12 16, 8 13, 8 10 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.2"
              />

              {/* House (home insurance) */}
              <path
                d="M30 30 L34 26 L38 30 V36 H30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.25"
              />

              {/* Umbrella (protection) */}
              <path
                d="M20 22
                   C14 22, 12 18, 20 14
                   C28 18, 26 22, 20 22 Z
                   M20 22 V28"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.7"
                opacity="0.25"
              />

              {/* Dotted connection lines */}
              <circle cx="6" cy="30" r="0.8" fill="currentColor" opacity="0.2" />
              <circle cx="10" cy="32" r="0.8" fill="currentColor" opacity="0.2" />
              <circle cx="14" cy="34" r="0.8" fill="currentColor" opacity="0.2" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#insurance-pattern)" />
        </svg>
      </div>

      <div className="relative pt-6 pb-8 px-6">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          {(configSections?.language && configSections?.language?.enable_language_switcher) && (
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="cursor-pointer flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm bg-white/20 backdrop-blur-md text-white font-medium border border-white/30 hover:bg-white/30 transition-all"
              >
                <span>
                  {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
                </span>
                <span className="uppercase" style={{ fontFamily: font }}>{currentLanguage}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <div
                    className="fixed inset-0"
                    style={{ zIndex: 99998 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div
                    className="absolute right-0 top-full mt-2 rounded-lg border shadow-xl py-1 w-36 max-h-48 overflow-y-auto bg-white"
                    style={{ zIndex: 99999 }}
                  >
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="cursor-pointer w-full text-left px-3 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 text-gray-800 transition-colors"
                        style={{
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '15' : 'transparent'
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
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-2xl border-4 border-white/30 shadow-2xl flex items-center justify-center bg-white backdrop-blur-sm overflow-hidden">
              {headerData.profile_image ? (
                <img
                  src={getImageDisplayUrl(headerData.profile_image)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-3">
                  <Shield className="w-10 h-10 mx-auto mb-1" style={{ color: colors.primary }} />
                  <div className="text-sm font-bold" style={{ color: colors.primary }}>AGENT</div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-1 tracking-tight" style={{ fontFamily: font }}>
            {headerData.name || data.name || ''}
          </h1>
          <p className="text-base font-medium text-white/90 mb-2" style={{ fontFamily: font }}>
            {headerData.title || data.title || ''}
          </p>
          {headerData.tagline && (
            <p className="text-sm text-white/80 max-w-xs leading-relaxed px-4" style={{ fontFamily: font }}>
              {headerData.tagline}
            </p>
          )}
          <div className="inline-flex items-center space-x-1.5 mt-3 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <CheckCircle className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold text-white" style={{ fontFamily: font }}>{t('Certified Professional')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
      {/* Title */}
      <div className="relative mb-5">
        <div className="flex items-center">
          <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
            <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
              {t('Contact Information')}
            </h3>
          </div>
          <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
        </div>
      </div>

      <div className="space-y-3">
        {(contactData.email || data.email) && (
          <a
            href={`mailto:${contactData.email || data.email}`}
            className="cursor-pointer flex items-center p-3 rounded-xl transition-all hover:shadow-md"
            style={{ backgroundColor: colors.background }}
          >
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.primary + '15' }}>
              <Mail className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <span className="text-sm font-semibold block" style={{ color: colors.text + '80', fontFamily: font }}>{t('Email')}</span>
              <span className="text-sm font-bold block truncate" style={{ color: colors.text, fontFamily: font }}>
                {contactData.email || data.email}
              </span>
            </div>
          </a>
        )}
        {(contactData.phone || data.phone) && (
          <a
            href={`tel:${contactData.phone || data.phone}`}
            className="cursor-pointer flex items-center p-3 rounded-xl transition-all hover:shadow-md"
            style={{ backgroundColor: colors.background }}
          >
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.secondary + '15' }}>
              <Phone className="w-5 h-5" style={{ color: colors.secondary }} />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <span className="text-sm font-semibold block" style={{ color: colors.text + '80', fontFamily: font }}>{t('Phone')}</span>
              <span className="text-sm font-bold block truncate" style={{ color: colors.text, fontFamily: font }}>
                {contactData.phone || data.phone}
              </span>
            </div>
          </a>
        )}
        {(contactData.website || data.website) && (
          <a
            href={contactData.website || data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer flex items-center p-3 rounded-xl transition-all hover:shadow-md"
            style={{ backgroundColor: colors.background }}
          >
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: colors.accent + '15' }}>
              <Globe className="w-5 h-5" style={{ color: colors.accent }} />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <span className="text-sm font-semibold block" style={{ color: colors.text + '80', fontFamily: font }}>{t('Website')}</span>
              <span className="text-sm font-bold block truncate" style={{ color: colors.text, fontFamily: font }}>
                {contactData.website || data.website}
              </span>
            </div>
          </a>
        )}
        {contactData.location && (
          <div className="flex items-center p-3 rounded-xl" style={{ backgroundColor: colors.background }}>
            <div className="p-2.5 rounded-lg" style={{ backgroundColor: '#EF4444' + '15' }}>
              <MapPin className="w-5 h-5" style={{ color: '#EF4444' }} />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <span className="text-sm font-semibold block" style={{ color: colors.text + '80', fontFamily: font }}>{t('Location')}</span>
              <span className="text-sm font-bold block" style={{ color: colors.text, fontFamily: font }}>
                {contactData.location}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Unique Title Design */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('About Me')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>
        
        {/* Description with Side Accent */}
        <div className="relative mb-4">
          <p className="text-base leading-relaxed" style={{ color: colors.text + 'DD', fontFamily: font }}>
            {aboutData.description || data.description}
          </p>
        </div>
        
        {/* Specializations */}
        {aboutData.specializations && (
          <div className="mb-4">
            <div className="text-sm font-bold mb-2 flex items-center" style={{ color: colors.text, fontFamily: font }}>
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.primary }} />
              {t('Specializations')}
            </div>
            <div className="flex flex-wrap gap-2">
              {aboutData.specializations.split(',').map((spec: string, index: number) => (
                <div key={index} className="px-3 py-1.5 rounded-lg" style={{ 
                  backgroundColor: colors.primary + '15',
                  borderLeft: `3px solid ${colors.primary}`,
                  fontFamily: font
                }}>
                  <span className="text-sm font-semibold" style={{ color: colors.primary }}>{spec.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {aboutData.experience && (
            <div className="p-3 rounded-xl text-center" style={{ 
              backgroundColor: colors.primary + '10',
              border: `2px solid ${colors.primary}20`
            }}>
              <div className="text-2xl font-extrabold mb-0.5" style={{ color: colors.primary, fontFamily: font }}>
                {aboutData.experience}+
              </div>
              <div className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>{t('Years Experience')}</div>
            </div>
          )}
          {aboutData.licenses && (
            <div className="p-3 rounded-xl text-center" style={{ 
              backgroundColor: colors.secondary + '10',
              border: `2px solid ${colors.secondary}20`
            }}>
              <Award className="w-7 h-7 mb-1 mx-auto" style={{ color: colors.secondary }} />
              <div className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>{t('Licensed & Certified')}</div>
            </div>
          )}
        </div>

        {/* Professional Licenses */}
        {aboutData.licenses && (
          <div>
            <div className="text-sm font-bold mb-2 flex items-center" style={{ color: colors.text, fontFamily: font }}>
              <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.secondary }} />
              {t('Professional Licenses')}
            </div>
            <div className="space-y-2">
              {aboutData.licenses.split(',').map((license: string, index: number) => (
                <div key={index} className="flex items-center p-2.5 rounded-lg" style={{ 
                  backgroundColor: colors.background,
                  borderLeft: `3px solid ${colors.secondary}`
                }}>
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: colors.secondary }} />
                  <span className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                    {license.trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInsuranceServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Insurance Services')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service: any, index: number) => (
            <div key={index} className="p-5 rounded-xl transition-all duration-300 hover:shadow-md" 
              style={{ 
                backgroundColor: colors.background
              }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: colors.primary + '20' }}>
                  <Shield className="w-5 h-5" style={{ color: colors.primary }} />
                </div>
                <h4 className="font-bold text-base" style={{ color: colors.text, fontFamily: font }}>
                  {service.title}
                </h4>
              </div>
              {service.description && (
                <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  {service.description}
                </p>
              )}
              {service.features && (
                <div className="flex flex-wrap gap-2">
                  {service.features.split(',').map((feature: string, idx: number) => (
                    <div key={idx} className="inline-flex items-center px-2.5 py-1 rounded-md" 
                      style={{ 
                        backgroundColor: colors.primary + '10',
                        fontFamily: font
                      }}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" style={{ color: colors.primary }} />
                      <span className="text-sm font-medium" style={{ color: colors.primary }}>{feature.trim()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClaimsSupportSection = (claimsData: any) => {
    if (!claimsData.claims_phone && !claimsData.claims_email && !claimsData.claims_portal) return null;
    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.warningColor + '15' || '#F59E0B15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.warningColor || '#F59E0B', fontFamily: font }}>
                {t('Claims Support')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: (colors.warningColor || '#F59E0B') + '30' }} />
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ 
          backgroundColor: (colors.warningColor || '#F59E0B') + '08',
          border: `2px solid ${(colors.warningColor || '#F59E0B')}20` 
        }}>
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg" style={{ backgroundColor: (colors.warningColor || '#F59E0B') + '20' }}>
              <AlertCircle className="w-5 h-5" style={{ color: colors.warningColor || '#F59E0B' }} />
            </div>
            <span className="font-bold text-base ml-3" style={{ color: colors.warningColor || '#F59E0B', fontFamily: font }}>
              {t('24/7 Claims Assistance')}
            </span>
          </div>
          <div className="space-y-3">
            {claimsData.claims_phone && (
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: (colors.warningColor || '#F59E0B') + '15' }}>
                  <Phone className="w-4 h-4" style={{ color: colors.warningColor || '#F59E0B' }} />
                </div>
                <div>
                  <span className="text-sm font-semibold block" style={{ color: colors.text + '80', fontFamily: font }}>{t('Claims Hotline')}</span>
                  <a
                    href={`tel:${claimsData.claims_phone}`}
                    className="cursor-pointer text-sm font-bold"
                    style={{ color: colors.warningColor || '#F59E0B', fontFamily: font }}
                  >
                    {claimsData.claims_phone}
                  </a>
                </div>
              </div>
            )}
            {claimsData.claims_email && (
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: (colors.warningColor || '#F59E0B') + '15' }}>
                  <Mail className="w-4 h-4" style={{ color: colors.warningColor || '#F59E0B' }} />
                </div>
                <div>
                  <span className="text-sm font-semibold block" style={{ color: colors.text + '80', fontFamily: font }}>{t('Claims Email')}</span>
                  <a
                    href={`mailto:${claimsData.claims_email}`}
                    className="cursor-pointer text-sm font-bold"
                    style={{ color: colors.warningColor || '#F59E0B', fontFamily: font }}
                  >
                    {claimsData.claims_email}
                  </a>
                </div>
              </div>
            )}
            {claimsData.claims_portal && (
              <Button
                size="sm"
                className="cursor-pointer w-full mt-2"
                style={{ 
                  backgroundColor: colors.warningColor || '#F59E0B', 
                  color: 'white',
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(claimsData.claims_portal, '_blank', 'noopener,noreferrer')}
              >
                <FileText className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('File Claim Online')}
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
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Connect With Me')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              className="cursor-pointer flex items-center justify-center p-3 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              style={{ 
                backgroundColor: colors.background,
                border: `2px solid ${colors.primary}20`
              }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              title={link.username ? `${link.platform}: @${link.username}` : link.platform}
            >
              <SocialIcon platform={link.platform} color={colors.primary} />
              <span className="text-sm font-semibold capitalize truncate ml-2" style={{ color: colors.primary, fontFamily: font }}>
                {link.platform}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Office Hours')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="p-3 rounded-xl text-center" style={{
              backgroundColor: hour.is_closed ? colors.background : colors.primary + '08',
              border: `2px solid ${hour.is_closed ? colors.borderColor + '80' : colors.primary + '20'}`
            }}>
              <div className="text-sm font-bold mb-1 capitalize" style={{ color: colors.text, fontFamily: font }}>
                {t(hour.day)}
              </div>
              <div className="text-sm font-semibold" style={{ 
                color: hour.is_closed ? colors.text + '60' : colors.primary, 
                fontFamily: font 
              }}>
                {hour.is_closed ? t('Closed') : (
                  <>
                    <span>{hour.open_time}</span>
                    <span className="mx-1">-</span>
                    <span>{hour.close_time}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Testimonials state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = React.useState(0);

  // Effect for testimonials rotation
  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 2) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev => (prev + 2) % reviews.length);
    }, 4000);
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
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Client Testimonials')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="space-y-4 transition-all duration-500">
          {getVisibleReviews().map((review: any, index: number) => (
            <div key={`${currentTestimonialIndex}-${index}`} className="relative p-4 rounded-xl" style={{ 
              backgroundColor: colors.background,
              border: `2px solid ${colors.primary}20`
            }}>
              {/* Quote Icon */}
              <div className="absolute top-3 right-3 opacity-10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 8C10 5.79086 8.20914 4 6 4C3.79086 4 2 5.79086 2 8C2 10.2091 3.79086 12 6 12C6.55228 12 7 12.4477 7 13V14C7 15.6569 5.65685 17 4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19C6.76142 19 9 16.7614 9 14V13C9 11.3431 7.65685 10 6 10C4.89543 10 4 9.10457 4 8C4 6.89543 4.89543 6 6 6C7.10457 6 8 6.89543 8 8V9C8 9.55228 8.44772 10 9 10C9.55228 10 10 9.55228 10 9V8Z" fill="currentColor" style={{ color: colors.primary }}/>
                  <path d="M22 8C22 5.79086 20.2091 4 18 4C15.7909 4 14 5.79086 14 8C14 10.2091 15.7909 12 18 12C18.5523 12 19 12.4477 19 13V14C19 15.6569 17.6569 17 16 17C15.4477 17 15 17.4477 15 18C15 18.5523 15.4477 19 16 19C18.7614 19 21 16.7614 21 14V13C21 11.3431 19.6569 10 18 10C16.8954 10 16 9.10457 16 8C16 6.89543 16.8954 6 18 6C19.1046 6 20 6.89543 20 8V9C20 9.55228 20.4477 10 21 10C21.5523 10 22 9.55228 22 9V8Z" fill="currentColor" style={{ color: colors.primary }}/>
                </svg>
              </div>

              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < parseInt(review.rating || 5) ? 'fill-current' : ''}`}
                    style={{ color: i < parseInt(review.rating || 5) ? '#FCD34D' : '#E5E7EB' }}
                  />
                ))}
                {review.policy_type && (
                  <div className="ml-2 px-2 py-0.5 rounded-md text-xs font-semibold" style={{ 
                    backgroundColor: colors.primary + '15', 
                    color: colors.primary,
                    fontFamily: font
                  }}>
                    {review.policy_type}
                  </div>
                )}
              </div>
              <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                "{review.review}"
              </p>
              <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                — {review.client_name}
              </p>
            </div>
          ))}
        </div>
        {reviews.length > 2 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(reviews.length / 2) }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  Math.floor(currentTestimonialIndex / 2) === i ? 'w-6' : ''
                }`}
                style={{ backgroundColor: Math.floor(currentTestimonialIndex / 2) === i ? colors.primary : colors.primary + '30' }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Schedule Consultation')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="space-y-3">
          <Button
            size="sm"
            className="cursor-pointer w-full h-11"
            style={{ 
              backgroundColor: colors.primary, 
              color: 'white',
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('Book Free Consultation')}
          </Button>
          {appointmentsData?.calendar_link && (
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer w-full h-11"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appointmentsData.calendar_link, '_blank', 'noopener,noreferrer')}
            >
              <Calendar className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('View My Calendar')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;

    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Office Location')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="space-y-3">
          {locationData.map_embed_url && (
            <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: colors.primary + '20' }}>
              <InsuranceMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}

          {locationData.directions_url && (
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer w-full h-10"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {t('Mobile App')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer h-11"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('App Store')}
            </Button>
          )}
          {appData.play_store_url && (
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer h-11"
              style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {formData.form_title}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        {formData.form_description && (
          <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
            {formData.form_description}
          </p>
        )}
        <Button
          size="sm"
          className="cursor-pointer w-full h-10"
          style={{ 
            backgroundColor: colors.primary, 
            color: 'white',
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <Mail className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('Get Free Quote')}
        </Button>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 py-4 text-center">
        {/* Small heart icon */}
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full mb-2" style={{ backgroundColor: colors.primary + '10' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" style={{ color: colors.primary }}/>
          </svg>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
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
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="relative mb-5">
            <div className="flex items-center">
              <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
                <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                  {customHtmlData.section_title}
                </h3>
              </div>
              <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
            </div>
          </div>
        )}
        <div
          className="custom-html-content p-4 rounded-xl"
          style={{
            backgroundColor: colors.background,
            border: `2px solid ${colors.borderColor}`,
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
                color: ${colors.primary};
                text-decoration: underline;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
              }
            `}
          </style>
          <StableHtmlContent htmlContent={stableHtmlContent} />
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;

    return (
      <div className="px-6 py-6 bg-white" style={{ borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}` }}>
        {/* Title */}
        <div className="relative mb-5">
          <div className="flex items-center">
            <div className="px-4 py-2 rounded-r-full" style={{ backgroundColor: colors.primary + '15' }}>
              <h3 className="font-bold text-sm" style={{ color: colors.primary, fontFamily: font }}>
                {qrData.qr_title || t('Share Contact')}
              </h3>
            </div>
            <div className="flex-1 h-0.5 ml-3" style={{ backgroundColor: colors.primary + '30' }} />
          </div>
        </div>

        <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.background, border: `2px solid ${colors.borderColor}` }}>
          {qrData.qr_description && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <Button
            size="sm"
            className="cursor-pointer w-full h-10"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('Share QR Code')}
          </Button>
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
      <div className="p-6 space-y-3" style={{ 
        background: `linear-gradient(to bottom, ${colors.background}, white)`,
        borderBottom: `1px solid ${colors.borderColor || '#E2E8F0'}`
      }}>
        {hasContactButton && (
          <Button
            className="cursor-pointer w-full h-11 font-semibold shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasAppointmentButton && (
          <Button
            className="cursor-pointer w-full h-11 font-semibold"
            variant="outline"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {actionData.appointment_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer w-full h-11"
            style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
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

  const renderCopyrightSection = (copyrightData: any) => {
    return null;
  };

  // Create a style object that will be applied to all text elements
  const globalStyle = {
    fontFamily: font
  };

  // Extract copyright section to render it at the end
  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function, excluding copyright
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections)
    .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright');

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{
      fontFamily: font,
      background: colors.cardBg || '#FFFFFF',
      border: `1px solid ${colors.borderColor || '#E2E8F0'}`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}

      {/* Copyright always at the end */}
      {copyrightSection && (
        <div className="px-6 pb-4 pt-2 bg-white">
          {copyrightSection.text && (
            <p className="text-sm text-center leading-relaxed" style={{ color: colors.text + '60', fontFamily: font }}>
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