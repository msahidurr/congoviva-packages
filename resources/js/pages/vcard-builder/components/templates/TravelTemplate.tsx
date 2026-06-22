import { handleAppointmentBooking } from '../VCardPreview';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Plane,
  Building,
  Ship,
  Map,
  Car,
  Shield,
  FileText,
  Package,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Camera,
  Menu,
  X,
  ArrowRight,
  Info,
  Compass,
  User,
  UserPlus,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface TravelTemplateProps {
  data: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    description?: string;
    config_sections?: any;
    template_config?: any;
  };
  template: {
    defaultData?: any;
    defaultColors?: any;
    defaultFont?: string;
  };
}

const TravelMapEmbed = React.memo(function TravelMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function TravelTemplate({ data, template }: TravelTemplateProps) {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeDestination, setActiveDestination] = useState<number>(0);
  const [activeGalleryPhoto, setActiveGalleryPhoto] = useState<number>(0);
  
  // Get all sections for this business type
  const templateSections = template?.defaultData || {};
  
  // Ensure all required sections are available
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
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#1A73E8', 
    secondary: '#34A853', 
    accent: '#E8F5E9', 
    background: '#FFFFFF', 
    text: '#333333',
    cardBg: '#F8F9FA',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    highlightColor: '#FBBC04'
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


  // Get all sections for this business type
  const allSections = getBusinessTemplate('travel')?.sections || [];
  
  const renderHeaderSection = (headerData: any) => (
    <div className="relative">
      {/* Background Image */}
      <div className="relative h-64 overflow-hidden">
        {headerData.background_image ? (
          <img 
            src={getImageDisplayUrl(headerData.background_image)} 
            alt="Travel Background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              opacity: 0.9
            }}
          ></div>
        )}
        
        {/* Overlay with Logo and Name */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6" 
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        >
          {headerData.logo ? (
            <img 
              src={getImageDisplayUrl(headerData.logo)} 
              alt={headerData.name} 
              className="h-20 mb-4 object-contain"
            />
          ) : (
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4" 
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Compass size={36} color="#FFFFFF" />
            </div>
          )}
          
          <h1 
            className="text-2xl font-bold mb-2" 
            style={{ 
              color: '#FFFFFF',
              fontFamily: font,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {headerData.name || data.name || t('Wanderlust Travel')}
          </h1>
          
          {headerData.tagline && (
            <p 
              className="text-sm" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>
      
      {/* Language Selector */}
      {(configSections?.language && configSections?.language?.enable_language_switcher) && (
        <div className={`absolute top-4 ${isRTL ? 'left-16' : 'right-16'} z-20`}>
          <div className="relative">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span className="text-sm text-white">
                {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
              </span>
            </button>
            
            {showLanguageSelector && (
              <>
                <div 
                  className="fixed inset-0" 
                  style={{ zIndex: 99998 }}
                  onClick={() => setShowLanguageSelector(false)}
                />
                <div 
                  className="absolute right-0 top-full mt-1 rounded border shadow-lg py-1 w-36 max-h-48 overflow-y-auto"
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
                      className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-50"
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
      
      {/* Menu Button */}
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer"
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <X size={20} color="#FFFFFF" />
        ) : (
          <Menu size={20} color="#FFFFFF" />
        )}
      </button>

      {/* Save Contact Button */}
      <button
        className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center z-10 cursor-pointer"
        style={{ 
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => {
          const businessData = {
            name: headerData.name || data.name,
            title: headerData.tagline,
            email: configSections.contact?.email || data.email,
            phone: configSections.contact?.phone || data.phone,
            website: configSections.contact?.website,
            location: configSections.contact?.address
          };
          import('@/utils/vcfGenerator').then(module => {
            module.downloadVCF(businessData);
          });
        }}
      >
        <User size={20} color="#FFFFFF" />
      </button>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="absolute inset-0 z-20 p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.18)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="relative mx-auto mt-2 overflow-hidden rounded-[28px] border p-4 shadow-2xl"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.borderColor
            }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: colors.primary, fontFamily: font }}>
                  {t('Explore')}
                </p>
                <h3 className="mt-1 text-lg font-bold" style={{ color: colors.text, fontFamily: font }}>
                  {headerData.name || data.name || t('Travel Menu')}
                </h3>
              </div>
              <button
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
                style={{
                  backgroundColor: `${colors.primary}12`,
                  color: colors.primary
                }}
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <MenuLink 
                icon={<Info size={18} />} 
                label={t('About Us')} 
                onClick={() => {
                  typeof document !== "undefined" && document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                colors={colors}
                font={font}
              />
              
              <MenuLink 
                icon={<Compass size={18} />} 
                label={t('Destinations')} 
                onClick={() => {
                  typeof document !== "undefined" && document.getElementById('destinations-section')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                colors={colors}
                font={font}
              />
              
              <MenuLink 
                icon={<Package size={18} />} 
                label={t('Services')} 
                onClick={() => {
                  typeof document !== "undefined" && document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                colors={colors}
                font={font}
              />
              
              <MenuLink 
                icon={<Star size={18} />} 
                label={t('Special Offers')} 
                onClick={() => {
                  typeof document !== "undefined" && document.getElementById('offers-section')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                colors={colors}
                font={font}
              />
              
              <MenuLink 
                icon={<Camera size={18} />} 
                label={t('Gallery')} 
                onClick={() => {
                  typeof document !== "undefined" && document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                colors={colors}
                font={font}
              />
              
              <MenuLink 
                icon={<MessageSquare size={18} />} 
                label={t('Contact')} 
                onClick={() => {
                  typeof document !== "undefined" && document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  setMenuOpen(false);
                }}
                colors={colors}
                font={font}
              />
            </div>

            <div className="mt-5 border-t pt-4" style={{ borderColor: colors.borderColor }}>
              <Button
                className="w-full rounded-md"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.buttonText,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('Book a Consultation')}
              </Button>
            </div>
          </div>
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
  
  const MenuLink = ({ icon, label, onClick, colors, font }: any) => (
    <button
      className="flex items-center w-full rounded-2xl px-4 py-3"
      style={{ 
        backgroundColor: colors.background,
        border: `1px solid ${colors.borderColor}`,
        color: colors.text,
        fontFamily: font
      }}
      onClick={onClick}
    >
      <div 
        className="mr-3 flex h-9 w-9 items-center justify-center rounded-full"
        style={{ 
          backgroundColor: `${colors.primary}12`,
          color: colors.primary
        }}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      <ChevronRight size={16} className="ml-auto" style={{ color: colors.text + '80' }} />
    </button>
  );

  const renderCenteredSectionTitle = (title: string, icon?: React.ReactNode, subtitle?: string) => (
    <div className="mb-5 text-center">
      <div className="mb-2 inline-flex items-center gap-2">
        <h2
          className="text-xl font-bold"
          style={{
            color: colors.primary,
            fontFamily: font
          }}
        >
          {title}
        </h2>
      </div>
      <div className="mx-auto h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
      {subtitle && (
        <p
          className="mx-auto mt-3 max-w-xs text-sm leading-6"
          style={{ color: colors.text + 'B3', fontFamily: font }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null; 
    return (
      <div 
        id="about-section"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('About Us'), <Info size={18} />)}
        
        <p 
          className="mb-6 text-sm leading-7" 
          style={{ color: colors.text, fontFamily: font }}
        >
          {aboutData.description || data.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {aboutData.year_established && (
            <div 
              className="rounded-xl px-4 py-3 text-center" 
              style={{ 
                backgroundColor: colors.accent,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <p 
                className="mb-1 text-[10px] tracking-[0.12em]" 
                style={{ color: colors.text + '80', fontFamily: font }}
              >
                {t('ESTABLISHED')}
              </p>
              <p 
                className="text-lg font-semibold" 
                style={{ color: colors.primary, fontFamily: font }}
              >
                {aboutData.year_established}
              </p>
            </div>
          )}
          
          {aboutData.destinations_count && (
            <div 
              className="rounded-xl px-4 py-3 text-center" 
              style={{ 
                backgroundColor: colors.accent,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <p 
                className="mb-1 text-[10px] tracking-[0.12em]" 
                style={{ color: colors.text + '80', fontFamily: font }}
              >
                {t('DESTINATIONS')}
              </p>
              <p 
                className="text-lg font-semibold" 
                style={{ color: colors.primary, fontFamily: font }}
              >
                {aboutData.destinations_count}+
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDestinationsSection = (destinationsData: any) => {
    const destinations = destinationsData.destination_list || [];
    if (!Array.isArray(destinations) || destinations.length === 0) return null;
    
    return (
      <div 
        id="destinations-section"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('Popular Destinations'), <Compass size={18} />)}
        
        {/* Destination Selector */}
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {destinations.map((destination: any, index: number) => (
            <button
              key={index}
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{ 
                backgroundColor: activeDestination === index ? colors.primary : colors.background,
                color: activeDestination === index ? '#FFFFFF' : colors.text,
                border: `1px solid ${activeDestination === index ? colors.primary : colors.borderColor}`,
                fontFamily: font,
                boxShadow: activeDestination === index ? `0 8px 18px ${colors.primary}22` : 'none'
              }}
              onClick={() => setActiveDestination(index)}
            >
              {destination.name}
            </button>
          ))}
        </div>
        
        {/* Active Destination */}
        {destinations[activeDestination] && (
          <div 
            className="overflow-hidden rounded-[24px]" 
            style={{ 
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 14px 28px ${colors.primary}12`
            }}
          >
            {/* Destination Image */}
            <div className="relative h-52 overflow-hidden">
              {destinations[activeDestination].image ? (
                <img 
                  src={getImageDisplayUrl(destinations[activeDestination].image)} 
                  alt={destinations[activeDestination].name} 
                  className="w-full h-full object-cover"
            />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center" 
                  style={{ backgroundColor: colors.accent }}
                >
                  <Compass size={32} style={{ color: colors.primary }} />
                </div>
              )}
              
              {/* Location Badge */}
              {destinations[activeDestination].location && (
                <div 
                  className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium" 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: colors.primary,
                    fontFamily: font
                  }}
                >
                  <MapPin size={12} className="inline mr-1" />
                  {destinations[activeDestination].location}
                </div>
              )}

              {destinations[activeDestination].price && (
                <div
                  className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.42)',
                    color: '#FFFFFF',
                    fontFamily: font
                  }}
                >
                  {destinations[activeDestination].price}
                </div>
              )}
            </div>
            
            {/* Destination Details */}
            <div className="p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 
                  className="text-lg font-bold" 
                  style={{ 
                    color: colors.text,
                    fontFamily: font
                  }}
                >
                  {destinations[activeDestination].name}
                </h3>
                
                {destinations[activeDestination].duration && (
                  <span 
                    className="shrink-0 rounded-full px-2.5 py-1 text-[11px]" 
                    style={{ color: colors.primary, backgroundColor: `${colors.primary}10`, fontFamily: font }}
                  >
                    {destinations[activeDestination].duration}
                  </span>
                )}
              </div>
              
              {destinations[activeDestination].description && (
                <p 
                  className="mb-4 text-sm leading-6" 
                  style={{ color: colors.text + 'CC', fontFamily: font }}
                >
                  {destinations[activeDestination].description}
                </p>
              )}
              
              {destinations[activeDestination].url && (
                <a
                  href={destinations[activeDestination].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  {t('Learn More')}
                  <ArrowRight size={14} className="ml-1" />
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Destination Navigation Dots */}
        <div className="mt-4 flex justify-center overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 px-4">
            {destinations.map((_, index: number) => (
              <button
                key={index}
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ 
                  backgroundColor: activeDestination === index ? colors.primary : colors.borderColor
                }}
                onClick={() => setActiveDestination(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    const getServiceIcon = (iconName: string) => {
      switch(iconName) {
        case 'flight': return <Plane size={24} />;
        case 'hotel': return <Building size={24} />;
        case 'cruise': return <Ship size={24} />;
        case 'tour': return <Map size={24} />;
        case 'car': return <Car size={24} />;
        case 'insurance': return <Shield size={24} />;
        case 'visa': return <FileText size={24} />;
        case 'custom': return <Package size={24} />;
        default: return <Globe size={24} />;
      }
    };
    
    return (
      <div 
        id="services-section"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('Our Services'), <Package size={18} />)}
        
        <div className="grid grid-cols-2 gap-3">
          {services.map((service: any, index: number) => (
            <div 
              key={index} 
              className="flex flex-col items-center rounded-[22px] p-5 text-center" 
              style={{ 
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 12px 24px ${colors.primary}10`
              }}
            >
              <div 
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" 
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary
                }}
              >
                {getServiceIcon(service.icon)}
              </div>
              
              <h3 
                className="mb-1 text-sm font-bold leading-snug" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {service.title}
              </h3>
              
              {service.description && (
                <p 
                  className="text-xs leading-5" 
                  style={{ color: colors.text + 'CC', fontFamily: font }}
                >
                  {service.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSpecialOffersSection = (offersData: any) => {
    const offers = offersData.offer_list || [];
    if (!Array.isArray(offers) || offers.length === 0) return null;
    
    return (
      <div 
        id="offers-section"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('Special Offers'), <Star size={18} />)}

        <div className="space-y-4">
          {offers.map((offer: any, index: number) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-[24px]" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 14px 28px ${colors.primary}12`
              }}
            >
              <div className="relative h-44 overflow-hidden">
                {offer.image ? (
                  <img 
                    src={getImageDisplayUrl(offer.image)} 
                    alt={offer.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ 
                      background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                    }}
                  ></div>
                )}

                {offer.discount && (
                  <Badge
                    className="absolute right-4 top-4 rounded-full px-3 py-0.5 text-sm font-bold shadow-none"
                    style={{ 
                      backgroundColor: colors.primary +'CC',
                      color: '#FFFFFF',
                      fontFamily: font
                    }}
                  >
                    {offer.discount}
                  </Badge>
                )}
              </div>

              <div className="p-5">
                <h3 
                  className="mb-2 text-lg font-bold" 
                  style={{ 
                    color: colors.text,
                    fontFamily: font
                  }}
                >
                  {offer.title}
                </h3>

                {offer.description && (
                  <p 
                    className="mb-4 text-sm leading-6" 
                    style={{ color: colors.text + 'CC', fontFamily: font }}
                  >
                    {offer.description}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: colors.borderColor }}>
                  {offer.valid_until && (
                    <span 
                      className="rounded-full px-2.5 py-1 text-xs" 
                      style={{ color: colors.text + '80', backgroundColor: colors.cardBg, fontFamily: font }}
                    >
                      {t('Valid until')}: {offer.valid_until}
                    </span>
                  )}

                  {offer.url && (
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      {t('View Details')}
                      <ArrowRight size={14} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;

    const totalPhotos = photos.length;
    const currentIndex = ((activeGalleryPhoto % totalPhotos) + totalPhotos) % totalPhotos;
    const previousIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
    const nextIndex = (currentIndex + 1) % totalPhotos;
    const currentPhoto = photos[currentIndex];
    const previousPhoto = photos[previousIndex];
    const nextPhoto = photos[nextIndex];
    
    return (
      <div 
        id="gallery-section"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('Travel Gallery'), <Camera size={18} />)}
        
        <div className="space-y-4">
          <div className="relative flex items-center justify-center gap-2">
            {totalPhotos > 1 && (
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
                onClick={() => setActiveGalleryPhoto(previousIndex)}
                aria-label="Previous gallery image"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
              {totalPhotos > 1 && (
                <button
                  type="button"
                  className="relative hidden h-36 w-[20%] shrink-0 overflow-hidden rounded-[20px] md:block"
                  style={{ border: `1px solid ${colors.borderColor}` }}
                  onClick={() => setActiveGalleryPhoto(previousIndex)}
                  aria-label="Show previous gallery image"
                >
                  {previousPhoto?.image ? (
                    <img
                      src={getImageDisplayUrl(previousPhoto.image)}
                      alt={previousPhoto.caption || `Gallery image ${previousIndex + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: colors.accent }}>
                      <Camera size={20} style={{ color: colors.primary }} />
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.35)' }} />
                </button>
              )}

              <div
                className="relative overflow-hidden rounded-[24px]"
                style={{
                  width: totalPhotos > 1 ? '64%' : '100%',
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <div className="relative aspect-[4/5.4]">
                  {currentPhoto?.image ? (
                    <img
                      src={getImageDisplayUrl(currentPhoto.image)}
                      alt={currentPhoto.caption || `Gallery image ${currentIndex + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: colors.accent }}>
                      <Camera size={28} style={{ color: colors.primary }} />
                    </div>
                  )}

                  {(currentPhoto?.caption || currentPhoto?.location) && (
                    <div
                      className="absolute inset-x-0 bottom-0 p-3 text-sm"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 100%)',
                        color: '#FFFFFF'
                      }}
                    >
                      {currentPhoto.caption && (
                        <p className="font-medium leading-5">
                          {currentPhoto.caption}
                        </p>
                      )}
                      {currentPhoto.location && (
                        <span className="mt-1 flex items-center text-xs">
                          <MapPin size={11} className="mr-1" />
                          {currentPhoto.location}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {totalPhotos > 1 && (
                <button
                  type="button"
                  className="relative hidden h-36 w-[20%] shrink-0 overflow-hidden rounded-[20px] md:block"
                  style={{ border: `1px solid ${colors.borderColor}` }}
                  onClick={() => setActiveGalleryPhoto(nextIndex)}
                  aria-label="Show next gallery image"
                >
                  {nextPhoto?.image ? (
                    <img
                      src={getImageDisplayUrl(nextPhoto.image)}
                      alt={nextPhoto.caption || `Gallery image ${nextIndex + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: colors.accent }}>
                      <Camera size={20} style={{ color: colors.primary }} />
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255,255,255,0.35)' }} />
                </button>
              )}
            </div>

            {totalPhotos > 1 && (
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
                onClick={() => setActiveGalleryPhoto(nextIndex)}
                aria-label="Next gallery image"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {totalPhotos > 1 && (
            <div className="flex justify-center gap-2">
              {photos.map((_: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  className="h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: currentIndex === index ? '1.75rem' : '0.625rem',
                    backgroundColor: currentIndex === index ? colors.primary : colors.borderColor
                  }}
                  onClick={() => setActiveGalleryPhoto(index)}
                  aria-label={`Go to gallery image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('Traveler Stories'), <MessageSquare size={18} />)}
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="overflow-hidden rounded-[28px]" 
                    style={{ 
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.primary}22`,
                      
                    }}
                  >
                    <div
                      className="flex items-start justify-between gap-4 px-5 py-4"
                      style={{ 
                        backgroundColor: `${colors.primary}08`,
                        borderBottom: `1px solid ${colors.borderColor}`
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 rotate-45 items-center justify-center"
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.primary,
                            borderRadius: '14px'
                          }}
                        >
                          <MessageSquare size={18} className="-rotate-45" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily: font }}>
                            {review.client_name}
                          </p>
                          {(review.destination || review.trip_date) && (
                            <p className="text-xs" style={{ color: colors.text + '99', fontFamily: font }}>
                              {[review.destination, review.trip_date].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < parseInt(review.rating || 5) ? colors.highlightColor : 'transparent'} 
                            stroke={i < parseInt(review.rating || 5) ? colors.highlightColor : colors.borderColor}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="px-5 py-5" style={{ backgroundColor: colors.background }}>
                      <p 
                        className="text-sm italic leading-7" 
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        "{review.review}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {reviews.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {testimonialsData.reviews.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  className="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: currentReview === dotIndex ? '1.75rem' : '0.625rem',
                    backgroundColor: currentReview === dotIndex ? colors.primary : colors.borderColor
                  }}
                  onClick={() => setCurrentReview(dotIndex)}
                  aria-label={`Go to review ${dotIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    return (
      <div 
        id="contact-section"
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {renderCenteredSectionTitle(t('Contact Us'), <MessageSquare size={18} />)}
        
        <div
          className="mb-6 overflow-hidden rounded-[28px]"
          style={{
            backgroundColor: `${colors.primary}08`,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {(contactData.phone || data.phone) && (
            <a 
              href={`tel:${contactData.phone || data.phone}`} 
              className="flex items-center gap-4 px-5 py-4" 
              style={{ 
                borderBottom: `1px solid ${colors.borderColor}`
              }}
            >
              <div 
                className="flex h-11 w-11 shrink-0 rotate-45 items-center justify-center" 
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary,
                  borderRadius: '14px'
                }}
              >
                <Phone size={18} className="-rotate-45" />
              </div>
              <div className="min-w-0">
                <p 
                  className="text-[11px] tracking-[0.16em]" 
                  style={{ color: colors.text + '80', fontFamily: font }}
                >
                  {t('PHONE')}
                </p>
                <p 
                  className="text-sm font-medium" 
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.phone || data.phone}
                </p>
              </div>
            </a>
          )}
          
          {contactData.emergency && (
            <a 
              href={`tel:${contactData.emergency}`} 
              className="flex items-center gap-4 px-5 py-4" 
              style={{ 
                borderBottom: `1px solid ${colors.borderColor}`
              }}
            >
              <div 
                className="flex h-11 w-11 shrink-0 rotate-45 items-center justify-center" 
                style={{ 
                  backgroundColor: '#FFEBEE',
                  color: '#E53935',
                  borderRadius: '14px'
                }}
              >
                <Phone size={18} className="-rotate-45" />
              </div>
              <div className="min-w-0">
                <p 
                  className="text-[11px] tracking-[0.16em]" 
                  style={{ color: colors.text + '80', fontFamily: font }}
                >
                  {t('EMERGENCY CONTACT')}
                </p>
                <p 
                  className="text-sm font-medium" 
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.emergency}
                </p>
              </div>
            </a>
          )}
          
          {(contactData.email || data.email) && (
            <a 
              href={`mailto:${contactData.email || data.email}`} 
              className="flex items-center gap-4 px-5 py-4" 
              style={{ 
                borderBottom: `1px solid ${colors.borderColor}`
              }}
            >
              <div 
                className="flex h-11 w-11 shrink-0 rotate-45 items-center justify-center" 
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary,
                  borderRadius: '14px'
                }}
              >
                <Mail size={18} className="-rotate-45" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p 
                  className="text-[11px] tracking-[0.16em]" 
                  style={{ color: colors.text + '80', fontFamily: font }}
                >
                  {t('EMAIL')}
                </p>
                <p 
                  className="text-sm font-medium truncate" 
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.email || data.email}
                </p>
              </div>
            </a>
          )}
          
          {contactData.address && (
            <div 
              className="flex items-start gap-4 px-5 py-4"
            >
              <div 
                className="flex h-11 w-11 flex-shrink-0 rotate-45 items-center justify-center" 
                style={{ 
                  backgroundColor: colors.accent,
                  color: colors.primary,
                  borderRadius: '14px'
                }}
              >
                <MapPin size={18} className="-rotate-45" />
              </div>
              <div>
                <p 
                  className="text-[11px] tracking-[0.16em]" 
                  style={{ color: colors.text + '80', fontFamily: font }}
                >
                  {t('ADDRESS')}
                </p>
                <p 
                  className="text-sm" 
                  style={{ color: colors.text, fontFamily: font }}
                >
                  {contactData.address}
                </p>
                
                {configSections.google_map?.directions_url && (
                  <a 
                    href={configSections.google_map?.directions_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center mt-1"
                    style={{ color: colors.primary }}
                  >
                    {t('Get Directions')}
                    <ChevronRight size={12} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {configSections.appointments?.booking_url && (
            <Button
              className="w-full rounded-md"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {configSections.appointments?.booking_text || t('Schedule a Consultation')}
            </Button>
          )}
          
          <Button
            className="w-full"
            style={{ 
              backgroundColor: colors.secondary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t('Send a Message')}
          </Button>
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    

    
    return (
      <div 
        className="px-5 py-4" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <style>{`
          @keyframes travelSocialDotFloat {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.45; }
            50% { transform: translate3d(0, -2px, 0) scale(1.12); opacity: 0.9; }
          }
          .travel-social-dot-a {
            animation: travelSocialDotFloat 2.2s ease-in-out infinite;
          }
          .travel-social-dot-b {
            animation: travelSocialDotFloat 2.8s ease-in-out 0.4s infinite;
          }
        `}</style>
        <div className="flex flex-wrap justify-center gap-2.5">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-12 w-12 items-center justify-center transition-transform hover:scale-105"
              style={{ color: colors.primary }}
            >
              <span
                className="absolute inset-[5px] rounded-[16px] opacity-10 transition-transform duration-300 group-hover:-rotate-6"
                style={{
                  backgroundColor: colors.primary,
                  transform: 'rotate(19deg) scale(1.04)'
                }}
              />
              <span
                className="travel-social-dot-a absolute left-1 top-1 h-1.5 w-1.5 rounded-full opacity-60"
                style={{ backgroundColor: colors.primary }}
              />
              <span
                className="travel-social-dot-b absolute right-1 bottom-1.5 h-1 w-1 rounded-full opacity-40"
                style={{ backgroundColor: colors.primary }}
              />
              <span
                className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-sm"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${colors.primary}22`,
                  boxShadow: `0 4px 10px ${colors.primary}10`
                }}
              >
                <SocialIcon platform={link.platform} color={colors.primary} />
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;
    
    return (
      <div 
        className="px-5 py-4" 
        style={{ backgroundColor: colors.background }}
      >
        <p 
          className="text-xs text-center" 
          style={{ color: colors.text + '80' }}
        >
          {copyrightData.text}
        </p>
      </div>
    );
  };  

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'destinations':
        return renderDestinationsSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'special_offers':
        return renderSpecialOffersSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
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
  
  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;

    const todayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][new Date().getDay()];

    return (
      <div
        className="px-5 py-6"
        style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.borderColor}` }}
      >
        {renderCenteredSectionTitle(t('Office Hours'), <Clock size={18} />)}

        <div
          className="overflow-hidden rounded-[24px]"
          style={{ border: `1px solid ${colors.borderColor}`, boxShadow: `0 14px 28px ${colors.primary}10` }}
        >
          {hours.map((hour: any, index: number) => {
            const isToday = hour.day?.toLowerCase() === todayName;
            const isLast = index === hours.length - 1;
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 px-5 py-3.5"
                style={{
                  backgroundColor: isToday ? `${colors.primary}08` : colors.cardBg,
                  borderBottom: isLast ? 'none' : `1px solid ${colors.borderColor}`
                }}
              >
                <div className="flex items-center gap-3">
                  {isToday && (
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: hour.is_closed ? '#EF4444' : '#22C55E' }}
                    />
                  )}
                  <span
                    className="text-sm capitalize"
                    style={{
                      fontFamily: font,
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? colors.primary : colors.text
                    }}
                  >
                    {t(hour.day)}
                  </span>
                  {isToday && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: `${colors.primary}15`, color: colors.primary, fontFamily: font }}
                    >
                      {t('Today')}
                    </span>
                  )}
                </div>

                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: hour.is_closed
                      ? '#FEF2F2'
                      : isToday
                      ? `${colors.primary}15`
                      : `${colors.primary}08`,
                    color: hour.is_closed ? '#EF4444' : colors.primary,
                    fontFamily: font
                  }}
                >
                  {hour.is_closed ? t('Closed') : `${hour.open_time} – ${hour.close_time}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: colors.background,
          color: 'white', 
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="overflow-hidden rounded-[30px]"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}18, ${colors.secondary}14)`,
            boxShadow: `0 18px 36px ${colors.primary}12`,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="px-6 py-7 text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ 
                backgroundColor: colors.background,
                color: colors.primary
              }}
            >
              <Compass className="h-6 w-6" />
            </div>
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text, 
              fontFamily: font
            }}
          >
            {appointmentsData.section_title || t('Plan Your Adventure')}
          </h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
          <p 
            className="mt-4 text-sm leading-6" 
            style={{ 
              color: colors.text + 'CC',
              fontFamily: font
            }}
          >
            {appointmentsData.section_description || t('Ready to explore the world? Let us help you plan your perfect trip.')}
          </p>
          </div>
          <div className="grid grid-cols-1 gap-3 px-5 pb-5">
            <Button 
              className="w-full rounded-md border-0" 
              style={{ 
                backgroundColor: colors.background, 
                color: colors.primary, 
                fontFamily: font
              }} 
              onClick={() => handleAppointmentBooking(configSections.appointments)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {appointmentsData.booking_text || t('Schedule Consultation')}
            </Button>
            <Button 
              className="w-full rounded-md border"
              variant="outline"
              style={{ 
                backgroundColor: colors.background, 
                color: colors.primary, 
                fontFamily: font,
                borderColor: colors.primary + '33'
              }} 
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {appointmentsData.consultation_text || t('Free Consultation')}
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div className="px-5 py-6">
        {renderCenteredSectionTitle(t('Our Location'), <MapPin size={18} />)}
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <TravelMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <Button className="w-full" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, "_blank", "noopener,noreferrer")}>
              <MapPin className="w-4 h-4 mr-2" />{t('Get Directions')}
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="px-5 py-6">
        {renderCenteredSectionTitle(t('Download Our App'), <Phone size={18} />)}
        {appData.app_description && <p className="text-sm mb-4 text-center" style={{ color: colors.text }}>{appData.app_description}</p>}
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && <Button variant="outline" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, "_blank", "noopener,noreferrer")}>{t("App Store")}</Button>}
          {appData.play_store_url && <Button variant="outline" style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, "_blank", "noopener,noreferrer")}>{t("Play Store")}</Button>}
        </div>
      </div>
    );
  };
  
  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div
        className="px-5 py-6"
        style={{
          backgroundColor: `${colors.primary}12`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent, color: colors.primary }}
          >
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold" style={{ color: colors.primary, fontFamily: font }}>{formData.form_title}</h2>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
          {formData.form_description && <p className="mt-4 text-sm leading-6 text-center" style={{ color: colors.text + 'CC', fontFamily: font }}>{formData.form_description}</p>}
          <Button className="mt-5 rounded-md px-6" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <MessageSquare className="w-4 h-4 mr-2" />{t('Contact Us')}
          </Button>
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

    const formatVideoType = (value?: string) => {
      if (!value) return '';
      return value
        .split('_')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;
    
    const videoContent = videos.map((video: any, index: number) => {
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
    
    return (
      <div className="px-5 pt-4 pb-5" style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.borderColor}` }}>
        {renderCenteredSectionTitle(t('Travel Videos'), <Video size={18} />)}
        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div key={video.key} className="overflow-hidden rounded-[26px]" style={{ 
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 16px 30px ${colors.primary}10`
            }}>
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
                      className="relative w-full h-48 cursor-pointer overflow-hidden"
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img src={thumbUrl} alt={video.title || 'Video'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                          <Video className="w-8 h-8" style={{ color: colors.primary }} />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.68) 100%)' }} />
                      {video.video_type && (
                        <div
                          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium"
                          style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: colors.primary, fontFamily: font }}
                        >
                          {formatVideoType(video.video_type)}
                        </div>
                      )}
                      {videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: colors.primary, boxShadow: `0 10px 24px ${colors.primary}30` }}>
                            <Play className="ml-1 h-6 w-6" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-bold leading-6" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.duration && (
                    <span className="shrink-0 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary, fontFamily: font }}>
                      <Clock size={11} className="mr-1 inline" />
                      {video.duration}
                    </span>
                  )}
                </div>
                {video.description && (
                  <p className="mt-2 text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
        {renderCenteredSectionTitle(t('YouTube Channel'), <Youtube size={18} />)}
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
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.borderColor}` }}>
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center mr-3">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || t('Travel Adventures')}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="text-xs" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  📊 {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>
          
          {youtubeData.channel_description && (
            <p className="text-xs mb-3" style={{ color: colors.text, fontFamily: font }}>
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
                {t('SUBSCRIBE')}
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
                ✈️ {t('TRAVEL GUIDES')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div 
        className="px-5 py-8" 
        style={{ backgroundColor: colors.background }}
        id="custom_html"
      >
        <div 
          dangerouslySetInnerHTML={{ __html: customHtmlData.html_content }}
          style={{ fontFamily: font }}
        />
      </div>
    );
  };
  
  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div 
        className="px-5 py-5" 
        style={{ backgroundColor: `${colors.primary}12`, borderBottom: `1px solid ${colors.borderColor}` }}
        id="qr_share"
      >
        {renderCenteredSectionTitle(qrData.qr_title || t('Share Our Services'), <QrCode size={18} />)}
        <div className="text-center">
          {qrData.qr_description && (
            <p 
              className="mx-auto mb-4 max-w-sm text-sm leading-6" 
              style={{ color: colors.text, fontFamily: font }}
            >
              {qrData.qr_description}
            </p>
          )}
          
          <Button
            className="rounded-md px-5"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => setShowQrModal(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t("Share QR Code")}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div
        className="px-5 py-5"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="relative overflow-hidden rounded-2xl px-4 py-4 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.background} 100%)`,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <div
              className="h-px w-10"
              style={{ backgroundColor: colors.primary + '35' }}
            />
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                backgroundColor: colors.background,
                color: colors.primary,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <Plane size={16} />
            </div>
            <div
              className="h-px w-10"
              style={{ backgroundColor: colors.secondary + '35' }}
            />
          </div>
          <p
            className="text-sm italic leading-6"
            style={{ color: colors.text, fontFamily: font }}
          >
            {thankYouData.message}
          </p>
          <div
            className="pointer-events-none absolute -bottom-5 -right-5 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.secondary}18 0%, ${colors.secondary}08 45%, transparent 70%)`
            }}
          />
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
        className="px-5 py-5"
        style={{
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="grid gap-3">
        {hasContactButton && (
          <Button
            className="w-full h-11 rounded-md px-4 font-semibold"
            style={{
              backgroundColor: colors.primary,
              color: colors.buttonText,
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
            className="w-full h-11 rounded-md px-4 font-semibold"
            variant="outline"
            style={{
              borderColor: colors.secondary,
              color: colors.secondary,
              backgroundColor: 'transparent',
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
            variant="outline"
            className="w-full h-11 rounded-md px-4 font-semibold"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              backgroundColor: 'transparent',
              fontFamily: font
            }}
            onClick={() => {
              const headerData = configSections.header || {};
              const contactData = configSections.contact || {};
              const vcfData = {
                name: headerData.name || data.name || '',
                title: headerData.tagline || data.title || '',
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
            <UserPlus className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
        </div>
      </div>
    );
  };
  
  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
  
  return (
    <div 
      className="w-full rounded-2xl overflow-hidden" 
      style={{ 
        fontFamily: font,
        background: colors.background,
        color: colors.text,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {orderedSectionKeys
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
      
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
