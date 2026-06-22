import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Sparkles, Heart, Star, Clock, ShoppingBag, Video, Play, Youtube, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface BeautyCosmeticsTemplateProps {
  data: any;
  template: any;
}

const BeautyCosmeticsMapEmbed = React.memo(function BeautyCosmeticsMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function BeautyCosmeticsTemplate({ data, template }: BeautyCosmeticsTemplateProps) {
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
  

  const colors = configSections.colors || template?.defaultColors || { primary: '#E91E63', secondary: '#F06292', text: '#2D2D2D' };
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
  const allSections = getBusinessTemplate('beauty-cosmetics')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header': return renderHeaderSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'about': return renderAboutSection(sectionData);
      case 'services': return renderServicesSection(sectionData);
      case 'portfolio': return renderPortfolioSection(sectionData);
      case 'products': return renderProductsSection(sectionData);
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

  const renderSectionTitle = (title: string, icon: React.ReactNode) => (
    <div className="flex items-center justify-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-lg" style={{ color: colors.primary, fontFamily: font }}>
          {title}
        </h3>
    </div>
  );

  const renderHeaderSection = (headerData: any) => (
    <div
      className="relative"
      style={{
        background: `linear-gradient(160deg, ${colors.primary}18 0%, ${colors.secondary}10 50%, ${colors.accent} 100%)`
      }}
    >
      <div className="px-6 pt-8 pb-5 relative" style={{ overflow: 'visible' }}>
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30`}>
            <div className="relative">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.primary}30` }}
              >
                <span className="text-sm">{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}</span>
              </button>
              {showLanguageSelector && (
                <>
                  <div className="fixed inset-0" style={{ zIndex: 40 }} onClick={() => setShowLanguageSelector(false)} />
                  <div className="absolute right-0 top-full mt-2 border shadow-xl py-2 w-40 max-h-60 overflow-y-auto" style={{ backgroundColor: colors.cardBg, borderColor: colors.primary + '30', zIndex: 99999, borderRadius: '20px' }}>
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 cursor-pointer transition-all"
                        style={{ 
                          backgroundColor: currentLanguage === lang.code ? colors.primary + '15' : 'transparent', 
                          color: colors.text,
                          borderRadius: currentLanguage === lang.code ? '14px' : '0',
                          margin: currentLanguage === lang.code ? '0 6px' : '0'
                        }}
                      >
                        <span>{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Profile + Info */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ border: `3px solid ${colors.primary}50`, backgroundColor: colors.cardBg }}>
              {headerData.profile_image ? (
                <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Sparkles className="w-8 h-8" style={{ color: colors.primary }} />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
              <span className="text-white text-xs">✦</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold leading-tight mb-0.5" style={{ color: colors.text, fontFamily: font }}>
              {headerData.name || data.name || 'Beauty Artist'}
            </h2>
            <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
              {headerData.title || 'Beauty & Makeup Specialist'}
            </p>
          </div>
        </div>

        {headerData.tagline && (
          <p className="text-sm leading-relaxed italic text-center mb-4" style={{ color: colors.text + 'AA', fontFamily: font }}>
            "{headerData.tagline}"
          </p>
        )}

        {/* Decorative divider */}
        <div className="flex items-center justify-center space-x-2">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}40)` }} />
          <span style={{ color: colors.primary }} className="text-xs">✦</span>
          <Heart className="w-3 h-3" style={{ color: colors.primary }} />
          <span style={{ color: colors.primary }} className="text-xs">✦</span>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${colors.primary}40, transparent)` }} />
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

  const renderContactSection = (contactData: any) => (
    <>
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        <div className="grid grid-cols-2 gap-3">
          {(contactData.phone || data.phone) && (
            <a
              href={`tel:${contactData.phone || data.phone}`}
              className="flex items-center gap-2.5 px-3 py-3 rounded-2xl"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}12` }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                <Phone className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-none mb-1" style={{ color: colors.primary, fontFamily: font }}>
                  {t("Call")}
                </p>
                <span className="text-xs font-medium" style={{ color: colors.text, fontFamily: font }}>
                  {contactData.phone || data.phone}
                </span>
              </div>
            </a>
          )}
          {(contactData.email || data.email) && (
            <a
              href={`mailto:${contactData.email || data.email}`}
              className="flex items-center gap-2.5 px-3 py-3 rounded-2xl"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}12` }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                <Mail className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-none mb-1" style={{ color: colors.primary, fontFamily: font }}>
                  {t("Email")}
                </p>
                <span className="text-xs font-medium break-all" style={{ color: colors.text, fontFamily: font }}>
                  {contactData.email || data.email}
                </span>
              </div>
            </a>
          )}
          {(contactData.website || data.website) && (
            <a
              href={contactData.website || data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-3 rounded-2xl"
              style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}12` }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                <Globe className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-none mb-1" style={{ color: colors.primary, fontFamily: font }}>
                  {t("Website")}
                </p>
                <span className="text-xs font-medium break-all" style={{ color: colors.text, fontFamily: font }}>
                  {(contactData.website || data.website)?.replace(/^https?:\/\//, '')}
                </span>
              </div>
            </a>
          )}
          {contactData.location && (
            <div className="flex items-center gap-2.5 px-3 py-3 rounded-2xl" style={{ backgroundColor: colors.accent, border: `1px solid ${colors.primary}12` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.cardBg }}>
                <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] leading-none mb-1" style={{ color: colors.primary, fontFamily: font }}>
                  {t("Location")}
                </p>
                <span className="text-xs font-medium" style={{ color: colors.text, fontFamily: font }}>
                  {contactData.location}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;

    const specialties = typeof aboutData.specialties === 'string'
      ? aboutData.specialties.split(',').map((specialty: string) => specialty.trim()).filter(Boolean)
      : [];

    return (
      <>
        
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('About Me'), <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />)}

          <p
            className="text-sm leading-7 text-center"
            style={{ color: colors.text + 'D9', fontFamily: font }}
          >
            {aboutData.description || data.description}
          </p>

          {specialties.length > 0 && (
            <div className="mt-4">
              <p
                className="text-xs font-semibold tracking-[0.16em] mb-3 text-center"
                style={{ color: colors.text + '99', fontFamily: font }}
              >
                {t('Specialties')}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {specialties.map((specialty: string, index: number) => (
                  <Badge
                    key={index}
                    className="text-xs px-3 py-1 rounded-full border-0 shadow-none"
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.primary,
                      fontFamily: font
                    }}
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {aboutData.experience && (
            <div className="flex justify-center mt-4">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white'
                }}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-medium" style={{ fontFamily: font }}>
                  {aboutData.experience} {t('Years Experience')}
                </span>
              </div>
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
        <div
          className="py-4"
          style={{ backgroundColor: colors.primary + '08' }}
        >
          <div className="px-6 py-5">
            {renderSectionTitle(t('Services'), <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />)}
            <div className="space-y-4">
              {services.map((service: any, index: number) => (
                <div
                  key={index}
                  className="pb-4"
                  style={{
                    borderBottom: index === services.length - 1 ? 'none' : `1px solid ${colors.primary}15`
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1" style={{ color: colors.text, fontFamily: font }}>
                          {service.title}
                        </h4>
                        {service.description && (
                          <p className="text-sm leading-5" style={{ color: colors.text + 'B3', fontFamily: font }}>
                            {service.description}
                          </p>
                        )}
                      </div>

                      {service.price && (
                        <div
                          className="shrink-0 text-sm font-semibold"
                          style={{
                            color: colors.primary,
                            fontFamily: font
                          }}
                        >
                          {service.price}
                        </div>
                      )}
                    </div>

                    {(service.duration || service.category) && (
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {service.duration && (
                          <div className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" style={{ color: colors.primary }} />
                            <span className="text-[12px]" style={{ color: colors.text + '99', fontFamily: font }}>
                              {service.duration}
                            </span>
                          </div>
                        )}
                        {service.category && (
                          <div
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px]"
                            style={{
                              backgroundColor: colors.primary + '10',
                              color: colors.primary,
                              fontFamily: font
                            }}
                          >
                            {service.category}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPortfolioSection = (portfolioData: any) => {
    const projects = portfolioData.projects || [];
    if (!Array.isArray(projects) || projects.length === 0) return null;
    return (
      <>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Portfolio'), <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />)}
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-[22px]"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.primary}12`,
                  boxShadow: `0 10px 30px ${colors.primary}08`
                }}
              >
                <div className="h-44 overflow-hidden" style={{ backgroundColor: colors.primary + '06' }}>
                  {project.image ? (
                    <img
                      src={getImageDisplayUrl(project.image)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                  )}
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold leading-5" style={{ color: colors.text, fontFamily: font }}>
                    {project.title}
                  </p>
                  {project.category && (
                    <p className="text-xs mt-1" style={{ color: colors.primary, fontFamily: font }}>
                      {project.category}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderProductsSection = (productsData: any) => {
    const products = productsData.product_list || [];
    if (!Array.isArray(products) || products.length === 0) return null;
    return (
      <>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Featured Products'), <ShoppingBag className="w-4 h-4" style={{ color: colors.primary }} />)}
          <div className="space-y-3 mt-6">
            {products.map((product: any, index: number) => (
              <div
                key={index}
                className="pb-3"
                style={{
                  borderBottom: index === products.length - 1 ? 'none' : `1px solid ${colors.primary}15`
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                      <p className="text-sm font-semibold leading-5" style={{ color: colors.text, fontFamily: font }}>
                        {product.name}
                      </p>
                    </div>
                    {product.brand && (
                      <p className="text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                        {product.brand}
                      </p>
                    )}
                  </div>
                  {(product.price || product.link) && (
                    <div className="text-right shrink-0">
                      {product.price && (
                        <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                          {product.price}
                        </p>
                      )}
                      {product.link && (
                        <button
                          type="button"
                          className="mt-2 text-xs font-medium cursor-pointer"
                          style={{ color: colors.primary, fontFamily: font }}
                          onClick={() => typeof window !== "undefined" && window.open(product.link, '_blank', 'noopener,noreferrer')}
                        >
                          {t("Buy Now")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = (socialData.social_links || []).filter((link: any) => link?.platform && link?.url);
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Follow My Work'), <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />)}
          <div className="flex flex-wrap justify-center gap-4 mt-5">
            {socialLinks.map((link: any, index: number) => (
              <button
                key={index}
                type="button"
                className="flex items-center justify-center rounded-full w-12 h-12 cursor-pointer"
                style={{
                  backgroundColor: colors.accent,
                  border: `1px solid ${colors.primary}16`,
                  fontFamily: font
                }}
                onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              >
                <SocialIcon platform={link.platform} color={colors.primary} />
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
    return (
      <>
        <div
          className="py-4"
          style={{ backgroundColor: colors.primary + '08' }}
        >
          <div className="px-6 py-4">
            {renderSectionTitle(t('Availability'), <Clock className="w-4 h-4" style={{ color: colors.primary }} />)}
            <div className="space-y-3 mt-5">
              {hours.slice(0, 7).map((hour: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center gap-3 pb-3"
                  style={{
                    borderBottom: index === Math.min(hours.length, 7) - 1 ? 'none' : `1px solid ${colors.primary}15`
                  }}
                >
                  <span className="capitalize text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                    {t(hour.day)}
                  </span>
                  <span
                    className="text-sm"
                    style={{
                      color: hour.is_closed ? colors.text + '70' : colors.primary,
                      fontFamily: font
                    }}
                  >
                    {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
                  </span>
                </div>
              ))}
            </div>
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
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Client Love'), <Star className="w-4 h-4 fill-current" style={{ color: colors.primary }} />)}
          
          <div className="relative mt-5">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review: any, index: number) => (
                  <div key={index} className="w-full flex-shrink-0 px-1">
                    <div
                      className="p-4 rounded-[22px]"
                      style={{
                        backgroundColor: colors.accent,
                        border: `1px solid ${colors.primary}12`
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < parseInt(review.rating || 5) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        {review.service && (
                          <span className="text-xs px-2 py-1 rounded-full" style={{ 
                            backgroundColor: colors.primary + '20',
                            color: colors.primary,
                            fontFamily: font
                          }}>
                            {review.service}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mb-4 leading-6 italic" style={{ color: colors.text + 'D9', fontFamily: font }}>
                        "{review.review}"
                      </p>
                      <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                        — {review.client_name}
                      </p>
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
                    className="w-2 h-2 rounded-full transition-colors cursor-pointer"
                    style={{ 
                      backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40'
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
      <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
        {renderSectionTitle(t('Book Your Beauty Session'), <Calendar className="w-4 h-4" style={{ color: colors.primary }} />)}
        <div className="mt-5">
          {appointmentsData?.consultation_note && (
            <p className="text-sm text-center leading-6 mb-4" style={{ color: colors.text + 'B3', fontFamily: font }}>
              {appointmentsData.consultation_note}
            </p>
          )}
          <Button
            size="sm"
            className="w-full h-9 rounded-full font-semibold px-4 cursor-pointer"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t('Book Appointment')}
          </Button>
        </div>
      </div>
    </>
  );

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Visit My Studio'), <MapPin className="w-4 h-4" style={{ color: colors.primary }} />)}
          
          <div className="space-y-4 mt-5">
            {locationData.map_embed_url && (
              <div className="overflow-hidden rounded-[22px]" style={{ border: `1px solid ${colors.primary}12` }}>
                <BeautyCosmeticsMapEmbed embedHtml={locationData.map_embed_url} />
              </div>
            )}
            
            {locationData.directions_url && (
              <Button 
                size="sm" 
                variant="outline" 
                className="mx-auto flex h-9 w-auto rounded-full px-5 cursor-pointer" 
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {t('Get Directions')}
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Download My App'), <ShoppingBag className="w-4 h-4" style={{ color: colors.primary }} />)}
          <div className="grid grid-cols-2 gap-3 mt-5">
            {appData.app_store_url && (
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-full cursor-pointer"
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
                className="h-9 rounded-full cursor-pointer"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t("Play Store")}
              </Button>
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
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <div
            className="rounded-[22px] px-4 py-5"
            style={{ backgroundColor: colors.primary + '08' }}
          >
            {renderSectionTitle(formData.form_title, <Mail className="w-4 h-4" style={{ color: colors.primary }} />)}
            {formData.form_description && (
              <p className="text-sm mb-4 text-center leading-6" style={{ color: colors.text + 'B3', fontFamily: font }}>
                {formData.form_description}
              </p>
            )}
            <div className="flex justify-center mt-5">
              <Button 
                size="sm" 
                className="h-9 rounded-full px-5 font-semibold cursor-pointer" 
                style={{ 
                backgroundColor: colors.primary, 
                color: 'white',
                fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('Get In Touch')}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
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

  const renderVideosSection = (videosData: any) => {
    const formatVideoType = (videoType: string) =>
      videoType
        .split('_')
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

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
        <div
          className="py-4"
          style={{ backgroundColor: colors.primary + '06' }}
        >
          <div className="px-6 py-4">
            {renderSectionTitle(t('Beauty Tutorials'), <Video className="w-4 h-4" style={{ color: colors.primary }} />)}

            <div className="space-y-4">
              {videoContent.map((video: any) => (
                <div
                  key={video.key}
                  className="overflow-hidden rounded-[24px]"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.primary}14`
                  }}
                >
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
                          className="relative w-full h-52 cursor-pointer overflow-hidden"
                          onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                        >
                          {thumbUrl ? (
                            <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                              <Video className="w-8 h-8" style={{ color: colors.primary }} />
                            </div>
                          )}

                          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.58) 100%)' }} />

                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                            {video.video_type ? (
                              <div
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px]"
                                style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: colors.primary, fontFamily: font }}
                              >
                                {formatVideoType(video.video_type)}
                              </div>
                            ) : <div />}

                            {video.duration && (
                              <div
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px]"
                                style={{ backgroundColor: 'rgba(17,17,17,0.55)', color: 'white', fontFamily: font }}
                              >
                                {video.duration}
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            {videoUrl && (
                              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.92)', boxShadow: `0 10px 30px ${colors.primary}2A` }}>
                                <Play className="w-5 h-5 ml-0.5" style={{ color: colors.primary }} />
                              </div>
                            )}
                          </div>

                        </div>
                      );
                    })()}
                  </div>

                  <div className="px-4 py-4">
                    {video.title && (
                      <h3
                        className="font-semibold text-base leading-6 mb-2"
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {video.title}
                      </h3>
                    )}

                    {video.description && (
                      <p className="text-sm leading-6 mb-3" style={{ color: colors.text + 'B3', fontFamily: font }}>
                        {video.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      {playingKey === video.key && (
                        <div className="ml-auto text-[11px] font-medium" style={{ color: colors.primary, fontFamily: font }}>
                          {t('Now playing')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    
    return (
      <>
        <div
          className="py-4"
          style={{ backgroundColor: colors.primary + '06' }}
        >
          <div className="px-6 py-4">
            {renderSectionTitle(t('YouTube Channel'), <Youtube className="w-4 h-4" style={{ color: colors.primary }} />)}

            {youtubeData.latest_video_embed && (
              <div
                className="mb-4 overflow-hidden rounded-[20px]"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.primary}14`
                }}
              >
                <div className="px-3 py-2.5 flex items-center justify-between gap-3" style={{ borderBottom: `1px solid ${colors.primary}12` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '10' }}>
                      <Play className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs" style={{ color: colors.text, fontFamily: font }}>
                        {t("Latest Video")}
                      </h4>
                      <p className="text-[10px]" style={{ color: colors.text + '99', fontFamily: font }}>
                        {youtubeData.channel_name || 'YouTube'}
                      </p>
                    </div>
                  </div>
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

            <div
              className="rounded-[24px] p-4"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.primary}12`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#FF0000' }}>
                  <Youtube className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-base truncate" style={{ color: colors.text, fontFamily: font }}>
                    {youtubeData.channel_name || 'Beauty Channel'}
                  </h4>
                  {youtubeData.subscriber_count && (
                    <p className="text-xs" style={{ color: colors.text + '99', fontFamily: font }}>
                      {youtubeData.subscriber_count} {t("subscribers")}
                    </p>
                  )}
                </div>
              </div>

              {youtubeData.channel_description && (
                <p className="text-sm leading-6 mb-4" style={{ color: colors.text + 'B3', fontFamily: font }}>
                  {youtubeData.channel_description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                {youtubeData.channel_url && (
                  <Button
                    size="sm"
                    className="h-10 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      fontFamily: font
                    }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    {t('Subscribe')}
                  </Button>
                )}
                {youtubeData.featured_playlist && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-10 rounded-full cursor-pointer"
                    style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                    onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t("Playlist")}
                  </Button>
                )}
                {!youtubeData.channel_url && youtubeData.featured_playlist && (
                  <div className="hidden" />
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {customHtmlData.show_title && customHtmlData.section_title && (
            renderSectionTitle(customHtmlData.section_title, <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />)
          )}
          <div 
            className="custom-html-content p-4 rounded-[22px]" 
            style={{ 
              backgroundColor: colors.accent,
              border: `1px solid ${colors.primary}10`,
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
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          {renderSectionTitle(t('Quick Actions'), <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />)}
          <div className="space-y-3 mt-5">
            {actionButtonsData.contact_button_text && (
              <Button 
                className="w-full h-9 rounded-full font-semibold cursor-pointer" 
                style={{ 
                  backgroundColor: colors.primary, 
                  color: 'white', 
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {actionButtonsData.contact_button_text}
              </Button>
            )}
            
            {actionButtonsData.appointment_button_text && (
              <Button 
                className="w-full h-9 rounded-full font-semibold cursor-pointer" 
                variant="outline"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary, 
                  fontFamily: font 
                }}
                onClick={() => handleAppointmentBooking(configSections.appointments)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {actionButtonsData.appointment_button_text}
              </Button>
            )}
            
            {actionButtonsData.save_contact_button_text && (
              <Button 
                className="w-full h-9 rounded-full font-semibold cursor-pointer" 
                variant="outline"
                style={{ 
                  borderColor: colors.secondary, 
                  color: colors.secondary, 
                  fontFamily: font 
                }}
                onClick={() => {
                  const contactData = {
                    name: data.name || configSections.header?.name || '',
                    title: configSections.header?.title || t('Beauty Artist'),
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
                {actionButtonsData.save_contact_button_text}
              </Button>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <>
        <div className="py-4" style={{ backgroundColor: colors.primary + '08' }}>
          <div className="px-6 py-4">
            {renderSectionTitle(qrData.qr_title || t('Share My Beauty Services'), <QrCode className="w-4 h-4" style={{ color: colors.primary }} />)}
            
            <div 
              className="text-center px-4 py-5 mt-5"
            >
              {qrData.qr_description && (
                <p 
                  className="text-sm mb-4 leading-6" 
                  style={{ color: colors.text + 'B3', fontFamily: font }}
                >
                  {qrData.qr_description}
                </p>
              )}
              
              <Button 
                className="mx-auto flex h-10 w-auto rounded-full px-5 font-semibold cursor-pointer" 
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
        </div>
      </>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-6 pb-4 pt-2" style={{ backgroundColor: colors.cardBg }}>
        <div
          className="text-center px-2 py-3"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}45)` }} />
            <span className="text-[10px]" style={{ color: colors.primary }}>✦</span>
            <Heart className="h-3.5 w-3.5" style={{ color: colors.primary }} />
            <span className="text-[10px]" style={{ color: colors.primary }}>✦</span>
            <div className="h-px w-10" style={{ background: `linear-gradient(90deg, ${colors.primary}45, transparent)` }} />
          </div>
          <p className="text-sm leading-7 italic" style={{ color: colors.text + 'B3', fontFamily: font }}>
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
    <div className="w-full shadow-lg" style={{ 
      fontFamily: font,
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.borderColor}`,
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
        <div className="px-6 pb-4 pt-2" style={{ backgroundColor: colors.cardBg }}>
          {copyrightSection.text && (
            <div className="text-center pt-2">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '25' }}></div>
              </div>
              <p className="text-xs" style={{ color: colors.text + '70', fontFamily: font }}>
                {copyrightSection.text}
              </p>
            </div>
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
