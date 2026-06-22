import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Wrench, Settings, Clock, Play, Youtube, QrCode, Star, Car, Shield, Zap, Gauge, Cog, Battery, Fuel, AlertTriangle } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface CarMechanicTemplateProps {
  data: any;
  template: any;
}

const CarMechanicMapEmbed = React.memo(function CarMechanicMapEmbed({ embedHtml, colors }: { embedHtml: string; colors: any }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ height: '200px', border: `2px solid ${colors.primary}30` }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function CarMechanicTemplate({ data, template }: CarMechanicTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  // Testimonials state
  const [currentReview, setCurrentReview] = React.useState(0);
  const [currentService, setCurrentService] = React.useState(0);
  const [currentGalleryPage, setCurrentGalleryPage] = React.useState(0);
  const [currentProduct, setCurrentProduct] = React.useState(0);

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

  // Effect for services rotation
  React.useEffect(() => {
    const servicesData = configSections.services;
    const services = servicesData?.service_list || [];
    if (!Array.isArray(services) || services.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentService(prev => (prev + 1) % services.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.services?.service_list]);

  // Effect for gallery rotation
  React.useEffect(() => {
    const galleryData = configSections.gallery;
    const items = galleryData?.gallery_items || [];
    if (!Array.isArray(items) || items.length <= 3) return;

    const totalPages = Math.ceil(items.length / 3);
    const interval = setInterval(() => {
      setCurrentGalleryPage(prev => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.gallery?.gallery_items]);

  // Effect for products rotation
  React.useEffect(() => {
    const productsData = configSections.products;
    const products = productsData?.product_list || [];
    if (!Array.isArray(products) || products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentProduct(prev => (prev + 1) % products.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.products?.product_list]);

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


  const colors = configSections.colors || template?.defaultColors || { primary: '#FF8000', secondary: '#FF9933', text: '#ffffff' };
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Inter, sans-serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Inter, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/[\"\']]/g, '');

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
  const allSections = getBusinessTemplate('car-mechanic')?.sections || [];

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;

    switch (sectionKey) {
      case 'header': return renderHeaderSection(sectionData);
      case 'contact': return renderContactSection(sectionData);
      case 'about': return renderAboutSection(sectionData);
      case 'services': return renderServicesSection(sectionData);
      case 'gallery': return renderGallerySection(sectionData);
      case 'products': return renderProductsSection(sectionData);
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
    <div className="relative rounded-t-2xl overflow-visible" style={{ background: '#ffffff' }}>
      {/* Top accent stripe - diagonal hazard pattern */}
      <div className="h-3 w-full" style={{
        background: `repeating-linear-gradient(45deg, ${colors.primary}, ${colors.primary} 10px, #f5f5f5 10px, #f5f5f5 20px)`
      }} />

      {/* Steel plate texture */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 3px)',
        backgroundSize: '100% 3px'
      }} />

      <div className="px-5 pt-4 pb-5 relative">
        {/* Top bar: language + status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.05)', border: `1px solid ${colors.primary}40` }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest" style={{ color: colors.primary, fontFamily: font }}>{('CAR MECHANIC')}</span>
          </div>
          <div className="flex items-center space-x-2">
            {(configSections?.language && configSections?.language?.enable_language_switcher) && (
              <div className="relative z-30">
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="flex items-center space-x-1 px-2 py-1 rounded text-xs cursor-pointer"
                  style={{ backgroundColor: 'rgba(0,0,0,0.05)', border: `1px solid ${colors.primary}40`, color: '#333' }}
                >
                  <span>{String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}</span>
                  <span className="uppercase font-medium">{currentLanguage}</span>
                </button>
                {showLanguageSelector && (
                  <>
                    <div className="fixed inset-0" style={{ zIndex: 99998 }} onClick={() => setShowLanguageSelector(false)} />
                    <div className="absolute right-0 top-full mt-1 rounded border shadow-lg py-1 w-32 max-h-48 overflow-y-auto" style={{ backgroundColor: '#fff', borderColor: colors.primary + '50', zIndex: 99999 }}>
                      {languageData.map((lang) => (
                        <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-100 cursor-pointer" style={{ backgroundColor: currentLanguage === lang.code ? colors.primary + '20' : 'transparent', color: '#333' }}>
                          <span>{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                          <span className="truncate">{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="flex items-center space-x-1 px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <Cog className="w-3 h-3 animate-spin" style={{ color: colors.primary, animationDuration: '4s' }} />
              <Wrench className="w-3 h-3" style={{ color: colors.primary }} />
            </div>
          </div>
        </div>

        {/* Profile row */}
        <div className={`flex items-end ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
          {/* Hex-style avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center" style={{
              border: `3px solid ${colors.primary}`,
              boxShadow: `0 0 0 1px #ddd, 0 0 20px ${colors.primary}50`,
              backgroundColor: '#f9f9f9'
            }}>
              {headerData.profile_image ? (
                <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Car className="w-10 h-10" style={{ color: colors.primary }} />
                  <div className="text-xs font-black tracking-widest" style={{ color: colors.primary }}></div>
                </div>
              )}
            </div>
            {/* Corner bolt decorations */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>

          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-xl font-black leading-tight" style={{ fontFamily: font, textShadow: `0 0 20px ${colors.primary}60`, color: '#111' }}>
              {headerData.name || data.name || 'AutoTech Garage'}
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest mt-0.5" style={{ color: colors.primary, fontFamily: font }}>
              {headerData.title || 'Professional Auto Service'}
            </p>
            {headerData.tagline && (
              <p className="text-sm mt-2 italic" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: font }}>
                "{headerData.tagline}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }} />

      <QRShareModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} url={typeof window !== 'undefined' ? window.location.href : ''} colors={colors} font={font} socialLinks={configSections.social?.social_links || []} />
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-5 py-5" style={{ backgroundColor: '#f8f7f5', borderBottom: `1px solid #e5e7eb` }}>
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
          <Phone className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Get In Touch')}</h3>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid #e5e7eb` }}>
        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`} className="flex items-center px-4 py-3 transition-all hover:bg-gray-50" style={{ backgroundColor: '#fff', borderBottom: `1px solid #f0f0f0` }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                <Phone className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ fontFamily: font, color: colors.primary }}>{t('Call Us')}</p>
                <p className="text-sm font-semibold" style={{ fontFamily: font, color: colors.text }}>{contactData.phone || data.phone}</p>
              </div>
            </div>
          </a>
        )}
        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`} className="flex items-center px-4 py-3 transition-all hover:bg-gray-50" style={{ backgroundColor: '#fff', borderBottom: `1px solid #f0f0f0` }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                <Mail className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider" style={{ fontFamily: font, color: colors.primary }}>{t('Email Us')}</p>
                <p className="text-sm font-semibold truncate" style={{ fontFamily: font, color: colors.text }}>{contactData.email || data.email}</p>
              </div>
            </div>
          </a>
        )}
        {(contactData.website || data.website) && (
          <a href={contactData.website || data.website} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-3 transition-all hover:bg-gray-50" style={{ backgroundColor: '#fff', borderBottom: `1px solid #f0f0f0` }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                <Globe className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider" style={{ fontFamily: font, color: colors.primary }}>{t('Visit Website')}</p>
                <p className="text-sm font-semibold truncate" style={{ fontFamily: font, color: colors.text }}>{(contactData.website || data.website).replace(/^https?:\/\//, '')}</p>
              </div>
            </div>
          </a>
        )}
        {contactData.location && (
          <div className="flex items-center px-4 py-3" style={{ backgroundColor: '#fff' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '15' }}>
                <MapPin className="w-4 h-4" style={{ color: colors.primary }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider" style={{ fontFamily: font, color: colors.primary }}>{t('Location')}</p>
                <p className="text-sm font-semibold" style={{ fontFamily: font, color: colors.text }}>{contactData.location}</p>
              </div>
            </div>
          </div>
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

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-5 py-5" style={{ backgroundColor: '#f8f7f5', borderBottom: `1px solid #e5e7eb` }}>
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ color: '#111', fontFamily: font, textShadow: `2px 2px 0 ${colors.primary}15` }}>{aboutData.title || t('About Our Shop')}</h3>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: '#fff', border: `1px solid #e5e7eb`, borderLeft: `4px solid ${colors.primary}` }}>
          <p className="text-sm leading-relaxed text-gray-700" style={{ fontFamily: font }}>
            {aboutData.description || data.description}
          </p>
          {aboutData.specialties && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {aboutData.specialties.split(',').map((s: string, i: number) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide" style={{ backgroundColor: colors.primary + '15', color: colors.primary, border: `1px solid ${colors.primary}30`, fontFamily: font }}>{s.trim()}</span>
              ))}
            </div>
          )}
          {aboutData.experience && (
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <Gauge className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold" style={{ color: '#111', fontFamily: font }}>{aboutData.experience} {t('years')} <span className="text-gray-500 font-normal">{t('Experience')}</span></span>
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
      <div className="px-5 py-6" style={{ backgroundColor: '#ffffff', borderBottom: `1px solid #e5e7eb` }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
              <Settings className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '5s' }} />
            </div>
            <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Our Services')}</h3>
          </div>
          <Wrench className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div key={index} className="relative rounded-xl overflow-hidden" style={{ backgroundColor: '#f9f9f9', border: `2px solid ${colors.primary}20` }}>
              <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: colors.primary + '10', borderBottom: `1px solid ${colors.primary}20` }}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Wrench className="w-4 h-4 flex-shrink-0" style={{ color: colors.primary }} />
                  <h4 className="font-bold text-sm truncate" style={{ fontFamily: font, color: '#111' }}>{service.title}</h4>
                </div>
                {service.price && (
                  <div className="px-3 py-1 rounded-lg ml-2 flex-shrink-0" style={{ backgroundColor: colors.primary, color: '#fff' }}>
                    <span className="text-sm font-black" style={{ fontFamily: font }}>{service.price}</span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3">
                  <div className="flex-1 min-w-0">
                    {service.duration && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Clock className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                        <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>{service.duration}</span>
                      </div>
                    )}
                    {service.description && (
                      <p className="text-sm leading-relaxed" style={{ fontFamily: font, color: '#666' }}>{service.description}</p>
                    )}
                  </div>
              </div>
              <div className="absolute top-0 right-0 w-8 h-8" style={{ background: `linear-gradient(135deg, transparent 50%, ${colors.primary}15 50%)` }} />
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderGallerySection = (galleryData: any) => {
    const items = galleryData.gallery_items || [];
    if (!Array.isArray(items) || items.length === 0) return null;

    const itemsPerPage = 3;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = currentGalleryPage * itemsPerPage;
    const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="px-5 py-5" style={{ backgroundColor: '#f8f7f5', borderBottom: `1px solid #e5e7eb` }}>
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <Car className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ color: '#111', fontFamily: font, textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Gallery')}</h3>
        </div>
        <div className="overflow-hidden">
          <div className="transition-opacity duration-500">
            <div className="grid grid-cols-3 gap-2">
              {visibleItems.map((item: any, index: number) => (
                <div key={startIndex + index} className="rounded-lg overflow-hidden relative" style={{ aspectRatio: '1', backgroundColor: '#ddd' }}>
                  {item.image ? (
                    <img src={getImageDisplayUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '10' }}>
                      <Car className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                  )}
                  {item.title && (
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                      <p className="text-xs font-bold text-white truncate" style={{ fontFamily: font }}>{item.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-3 space-x-1.5">
            {[...Array(totalPages)].map((_, dotIndex: number) => (
              <div key={dotIndex} className="rounded-full transition-all" style={{ width: dotIndex === currentGalleryPage ? 16 : 8, height: 6, backgroundColor: dotIndex === currentGalleryPage ? colors.primary : colors.primary + '40' }} />
            ))}
          </div>
        )}
      </div>
    );
  };


  const renderProductsSection = (productsData: any) => {
    const products = productsData.product_list || [];
    if (!Array.isArray(products) || products.length === 0) return null;
    
    return (
      <div className="px-5 py-6" style={{ backgroundColor: '#ffffff', borderBottom: `1px solid #e5e7eb` }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
              <Battery className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Products')}</h3>
          </div>
          <Fuel className="w-5 h-5" style={{ color: colors.primary }} />
        </div>
        <div className="space-y-4">
          {products.map((product: any, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#fff', border: `1px solid #e5e7eb`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {product.image && (
                <div className="w-full h-48 overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
                  <img src={getImageDisplayUrl(product.image)} alt={product.title || product.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h4 className="font-bold text-base mb-2" style={{ fontFamily: font, color: '#111' }}>{product.title || product.name}</h4>
                {product.description && (
                  <p className="text-sm leading-relaxed mb-3" style={{ fontFamily: font, color: '#666' }}>{product.description}</p>
                )}
                <div className="flex items-center justify-between gap-3">
                  {product.price && (
                    <div className="text-lg font-black" style={{ color: colors.primary, fontFamily: font }}>{product.price}</div>
                  )}
                  {product.buy_url && (
                    <Button 
                      size="sm" 
                      className="h-8 px-5 rounded-lg font-bold" 
                      style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: font }} 
                      onClick={() => typeof window !== "undefined" && window.open(product.buy_url, '_blank', 'noopener,noreferrer')}
                    >
                      {t("Buy Now")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-5 py-5" style={{ backgroundColor: '#f8f7f5', borderBottom: `1px solid #e5e7eb` }}>
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ color: '#111', fontFamily: font, textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Workshop Hours')}</h3>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid #e5e7eb` }}>
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} className="flex items-center justify-between px-3 py-3" style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9', opacity: hour.is_closed ? 0.55 : 1, borderBottom: index < 6 ? '1px solid #eee' : 'none' }}>
              <div className="flex items-center space-x-2.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hour.is_closed ? '#9ca3af' : colors.primary }} />
                <span className="capitalize text-sm font-semibold text-gray-800" style={{ fontFamily: font }}>{t(hour.day)}</span>
              </div>
              <span className="text-sm font-bold" style={{ color: hour.is_closed ? '#9ca3af' : '#111', fontFamily: font }}>
                {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderAppointmentsSection = (appointmentsData: any) => (
    <div className="px-5 py-5" style={{ backgroundColor: '#ffffff', borderBottom: `3px solid ${colors.primary}` }}>
      <div className="rounded-xl p-5" style={{ background: `linear-gradient(135deg, ${colors.primary}18, ${colors.primary}08)`, border: `1px solid ${colors.primary}40` }}>
        <div className="flex items-center space-x-3 mb-3">
          <div>
            <h3 className="font-black" style={{ fontFamily: font, color: colors.text}}>{t('Book Service')}</h3>
            {appointmentsData?.appointment_note && <p className="text-sm" style={{ fontFamily: font, color: '#666' }}>{appointmentsData.appointment_note}</p>}
          </div>
        </div>
        <Button className="w-full h-10 rounded-lg font-black tracking-widest" style={{ backgroundColor: colors.primary, color: '#fff', fontFamily: font }} onClick={() => handleAppointmentBooking(configSections.appointments)}>
          <Calendar className="w-4 h-4 mr-2" />{t('Book Service')}
        </Button>
      </div>
    </div>
  );

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <div className="px-5 py-5" style={{ backgroundColor: '#ffffff', borderBottom: `3px solid ${colors.primary}` }}>
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <Globe className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Follow Us')}</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {socialLinks.map((link: any, index: number) => (
            <button key={index} className="flex items-center space-x-2 px-3 py-2.5 rounded-lg" style={{ backgroundColor: '#f9f9f9', border: `1px solid ${colors.primary}25` }} onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}>
              <SocialIcon platform={link.platform} color={colors.primary} />
              <span className="text-sm font-bold capitalize truncate" style={{ fontFamily: font, color: '#111' }}>{link.platform}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    return (
      <div className="px-5 py-5" style={{ backgroundColor: '#f8f7f5', borderBottom: `1px solid #e5e7eb` }}>
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ color: '#111', fontFamily: font, textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Visit Our Shop')}</h3>
        </div>
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <CarMechanicMapEmbed embedHtml={locationData.map_embed_url} colors={colors} />
          )}
          {locationData.directions_url && (
            <Button size="sm" className="w-full h-10 rounded-lg font-bold uppercase tracking-wider" style={{ backgroundColor: colors.primary, color: colors.accent, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}>
              <MapPin className="w-4 h-4 mr-2" />{t('Get Directions')}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    return (
      <div className="px-5 py-5" style={{ backgroundColor: '#ffffff', borderBottom: `3px solid ${colors.primary}` }}>
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <Star className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('Customer Reviews')}</h3>
        </div>
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentReview * 100}%)` }}>
            {reviews.map((review: any, index: number) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="rounded-xl p-4" style={{ backgroundColor: '#f9f9f9', border: `1px solid ${colors.primary}25` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < parseInt(review.rating || 5) ? 'fill-current text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    {review.service && <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: colors.primary + '20', color: colors.primary, fontFamily: font }}>{review.service}</span>}
                  </div>
                  <p className="text-sm mb-3 leading-relaxed italic" style={{ fontFamily: font, color: '#333' }}>"{review.review}"</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ backgroundColor: colors.primary, color: '#fff' }}>{(review.client_name || 'A')[0]}</div>
                    <p className="text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>{review.client_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {reviews.length > 1 && (
          <div className="flex justify-center mt-3 space-x-1.5">
            {reviews.map((_: any, dotIndex: number) => (
              <div key={dotIndex} className="rounded-full transition-all" style={{ width: dotIndex === currentReview % reviews.length ? 16 : 8, height: 6, backgroundColor: dotIndex === currentReview % reviews.length ? colors.primary : colors.primary + '40' }} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;

    return (
      <>
        <div className="px-5 py-6" style={{ backgroundColor: '#ffffff', borderBottom: `1px solid #e5e7eb` }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
                <Youtube className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{t('YouTube Channel')}</h3>
            </div>
            <Play className="w-5 h-5" style={{ color: colors.primary }} />
          </div>
          {youtubeData.latest_video_embed && (
            <div className="mb-4 rounded-lg overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
              <div className="p-3 mb-2">
                <h4 className="font-semibold text-sm flex items-center" style={{ color: colors.text, fontFamily: font }}>
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

          <div className="rounded-2xl p-4" style={{ backgroundColor: colors.accent }}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <Youtube className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Auto Repair Channel'}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="text-xs" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    📊 {youtubeData.subscriber_count} {t("subscribers")}
                  </p>
                )}
              </div>
            </div>
            {youtubeData.channel_description && (
              <p className="text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}
            <div className="space-y-2">
              {youtubeData.channel_url && (
                <Button
                  size="sm"
                  className="w-full"
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
                  className="w-full"
                  style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  🔧 {t("Repair Tips")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <>
        <div className="flex justify-center py-3" style={{ backgroundColor: colors.cardBg }}>
          <div className="w-12 h-px" style={{ backgroundColor: colors.primary + '40' }}></div>
        </div>
        <div className="px-6 py-4" style={{ backgroundColor: colors.cardBg }}>
          <h3 className="font-bold text-sm mb-3 text-center" style={{ color: colors.primary, fontFamily: font }}>
            {t('Download Our App')}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {appData.app_store_url && (
              <Button size="sm" variant="outline" className="rounded-full" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
                {t("App Store")}
              </Button>
            )}
            {appData.play_store_url && (
              <Button size="sm" variant="outline" className="rounded-full" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
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
          <h3 className="font-bold text-sm mb-2 text-center" style={{ color: colors.primary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm mb-4 text-center italic" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button
            size="sm"
            className="w-full rounded-full"
            style={{
              backgroundColor: colors.secondary,
              color: 'white',
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('Get Quote')}
          </Button>
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
            <h3 className="font-bold text-sm mb-3 text-center" style={{ color: colors.primary, fontFamily: font }}>
              {customHtmlData.section_title}
            </h3>
          )}
          <div
            className="custom-html-content p-3 rounded-xl"
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
          <div className="space-y-3">
            {actionButtonsData.contact_button_text && (
              <Button
                className="w-full rounded-full"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                <Wrench className="w-4 h-4 mr-2" />
                {actionButtonsData.contact_button_text}
              </Button>
            )}

            {actionButtonsData.appointment_button_text && (
              <Button
                className="w-full rounded-full"
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
                className="w-full rounded-full"
                variant="outline"
                style={{
                  borderColor: colors.secondary,
                  color: colors.secondary,
                  fontFamily: font
                }}
                onClick={() => {
                  const contactData = {
                    name: data.name || configSections.header?.name || '',
                    title: configSections.header?.title || t('Car Mechanic'),
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
      <div className="px-5 py-5" style={{ backgroundColor: '#ffffff', borderBottom: `3px solid ${colors.primary}` }}>
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded" style={{ backgroundColor: colors.primary, boxShadow: `0 0 0 3px ${colors.primary}20` }}>
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-base uppercase tracking-wider ml-3" style={{ fontFamily: font, color: '#111', textShadow: `2px 2px 0 ${colors.primary}15` }}>{qrData.qr_title || t('Share Our Services')}</h3>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: '#f9f9f9', border: `1px solid ${colors.primary}25` }}>
          {qrData.qr_description && (
            <p className="text-sm mb-4 text-center" style={{ color: '#666', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}

          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <QrCode className="w-10 h-10" style={{ color: colors.primary }} />
            </div>
          </div>

          <Button
            className="w-full h-11 rounded-lg font-bold uppercase tracking-wider"
            style={{
              backgroundColor: colors.primary,
              color: '#fff',
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
      <div className="px-5 py-4" style={{ backgroundColor: colors.primary + '08' }}>
        <div className="text-center">
          <p className="text-sm font-semibold italic" style={{ color: colors.primary, fontFamily: font }}>
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
    <div className="w-full rounded-3xl overflow-visible shadow-xl bg-white" style={{
      fontFamily: font,
      border: `1px solid ${colors.primary}10`,
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
            <p className="text-sm text-center" style={{ color: colors.text + '50', fontFamily: font }}>
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
