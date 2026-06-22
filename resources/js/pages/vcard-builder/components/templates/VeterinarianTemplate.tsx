import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Heart, Shield, AlertTriangle, Stethoscope, Clock, Youtube, Video,
  Play, Share2, QrCode } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface VeterinarianTemplateProps {
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

const VeterinarianMapEmbed = React.memo(function VeterinarianMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function VeterinarianTemplate({ data, template }: VeterinarianTemplateProps) {
  const { t, i18n } = useTranslation();
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
  const colors = configSections.colors || template?.defaultColors || { primary: '#4A90E2', secondary: '#7BB3F0', accent: '#50C878', background: '#F8FBFF', text: '#1A365D' };
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
  const allSections = getBusinessTemplate('veterinarian')?.sections || [];

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
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'animal_care':
        return renderAnimalCareSection(sectionData);
      case 'emergency':
        return renderEmergencySection(sectionData);
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
    <div className="relative overflow-hidden">
      {/* Veterinary Clinic Background Pattern */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.accent}10 50%, ${colors.secondary}15 100%)`,
      }}>
        {/* Animated Paw Prints Pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl"
              style={{
                top: `${(i * 23) % 100}%`,
                left: `${(i * 37) % 100}%`,
                transform: `rotate(${i * 25}deg)`,
                animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              🐾
            </div>
          ))}
        </div>
      </div>

      {/* Language Selector */}
      {(configSections?.language && configSections?.language?.enable_language_switcher) && (
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20`}>
          <div className="relative">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer"
              style={{ 
                backgroundColor: 'white',
                border: `2px solid ${colors.primary}`,
                color: colors.primary,
                boxShadow: `0 4px 12px ${colors.primary}20`
              }}
            >
              <Globe className="w-3 h-3" />
              <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
            </button>
            
            {showLanguageSelector && (
              <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 py-2 min-w-[160px] max-h-48 overflow-y-auto z-50" style={{ borderColor: colors.primary + '30' }}>
                {languageData.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-xs hover:bg-opacity-10 transition-all flex items-center space-x-2 cursor-pointer`}
                    style={{
                      backgroundColor: currentLanguage === lang.code ? colors.primary + '15' : 'transparent',
                      color: currentLanguage === lang.code ? colors.primary : colors.text
                    }}
                  >
                    <span className="text-base">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                    <span className="font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Header Content */}
      <div className="relative px-6 pt-16 pb-8">
        {/* Veterinary Clinic Card Style */}
        <div className="relative">
          {/* Profile Section with Stethoscope Design */}
          <div className="flex flex-col items-center text-center mb-6">
            {/* Profile Image with Medical Cross Badge */}
            <div className="relative mb-4">
              <div className="relative w-28 h-28 overflow-hidden" 
                   style={{ 
                     border: `4px solid ${colors.primary}`,
                     boxShadow: `0 8px 30px ${colors.primary}40, 0 0 0 8px ${colors.primary}10`
                   }}>
                {(headerData.profile_image || headerData.logo) ? (
                  <img src={getImageDisplayUrl(headerData.profile_image || headerData.logo)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.cardBg }}>
                    <Stethoscope className="w-12 h-12" style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
              
              {/* Pulse Ring Animation */}
              <div className="absolute inset-0 animate-ping" 
                   style={{ 
                     border: `2px solid ${colors.primary}`,
                     animationDuration: '3s',
                     opacity: 0.3
                   }}></div>
            </div>

            {/* Name & Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: colors.text, fontFamily: font }}>
                {headerData.name || data.name || t('Dr. Veterinarian')}
              </h1>
              
              {/* Professional Badge */}
              <div className="inline-flex items-center px-5 py-2 rounded-full" 
                   style={{ 
                     background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                     boxShadow: `0 4px 15px ${colors.primary}30`
                   }}>
                <Stethoscope className="w-4 h-4 mr-2 text-white" />
                <span className="text-sm font-bold text-white" style={{ fontFamily: font }}>
                  {headerData.title || t('Animal Care Specialist')}
                </span>
              </div>
            </div>
          </div>

          {/* Tagline with Decorative Elements */}
          {headerData.tagline && (
            <div className="relative">
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 text-3xl opacity-20">🐾</div>
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-3xl opacity-20">🐾</div>
              <div className="px-6 py-4 rounded-2xl text-center mb-2" 
                   style={{ 
                     backgroundColor: 'white',
                     border: `2px dashed ${colors.primary}30`,
                     boxShadow: `0 4px 20px ${colors.primary}10`
                   }}>
                <p className="text-sm leading-relaxed italic" style={{ color: colors.text + 'DD', fontFamily: font }}>
                  "{headerData.tagline}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: colors.background }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                style={{ fill: colors.background }}></path>
        </svg>
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
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-4 relative" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
      {/* Decorative Paw Prints */}
      <div className="absolute top-2 left-3 text-xl opacity-10 animate-pulse">🐾</div>
      <div className="absolute bottom-2 right-3 text-xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}>🐾</div>
      
       <div className="mb-4 text-center">
        <div className="inline-block relative">
          <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
            <Stethoscope className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
            {t('Get In Touch')}
          </h3>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
            <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2.5 relative">
        {/* Connecting Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${colors.primary}20, ${colors.accent}20)` }}></div>
        
        {(contactData.email || data.email) && (
          <a href={`mailto:${contactData.email || data.email}`}
             className="flex items-center relative group">
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                   boxShadow: `0 4px 15px ${colors.primary}35`
                 }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 ml-3 p-3 rounded-xl transition-all group-hover:translate-x-1" 
                 style={{ 
                   background: `linear-gradient(90deg, ${colors.primary}15, transparent)`,
                   border: `1.5px solid ${colors.primary}20`
                 }}>
              <p className="text-xs font-bold mb-1" style={{ color: colors.primary, fontFamily: font }}>{t('Email Us')}</p>
              <p className="text-xs truncate" style={{ color: colors.text, fontFamily: font }}>{contactData.email || data.email}</p>
            </div>
          </a>
        )}
        
        {(contactData.phone || data.phone) && (
          <a href={`tel:${contactData.phone || data.phone}`}
             className="flex items-center relative group">
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                   boxShadow: `0 4px 15px ${colors.accent}35`
                 }}>
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 ml-3 p-3 rounded-xl transition-all group-hover:translate-x-1" 
                 style={{ 
                   background: `linear-gradient(90deg, ${colors.accent}15, transparent)`,
                   border: `1.5px solid ${colors.accent}20`
                 }}>
              <p className="text-xs font-bold mb-1" style={{ color: colors.accent, fontFamily: font }}>{t('Call Us')}</p>
              <p className="text-xs" style={{ color: colors.text, fontFamily: font }}>{contactData.phone || data.phone}</p>
            </div>
          </a>
        )}
        
        {(contactData.website || data.website) && (
          <a href={contactData.website || data.website} target="_blank" rel="noopener noreferrer"
             className="flex items-center relative group">
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
                   boxShadow: `0 4px 15px ${colors.secondary}35`
                 }}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 ml-3 p-3 rounded-xl transition-all group-hover:translate-x-1" 
                 style={{ 
                   background: `linear-gradient(90deg, ${colors.secondary}15, transparent)`,
                   border: `1.5px solid ${colors.secondary}20`
                 }}>
              <p className="text-xs font-bold mb-1" style={{ color: colors.secondary, fontFamily: font }}>{t('Visit Website')}</p>
              <p className="text-xs truncate" style={{ color: colors.text, fontFamily: font }}>{contactData.website || data.website}</p>
            </div>
          </a>
        )}
        
        {contactData.location && (
          <div className="flex items-center relative group">
            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.primary}80, ${colors.accent}80)`,
                   boxShadow: `0 4px 15px ${colors.primary}30`
                 }}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 ml-3 p-3 rounded-xl" 
                 style={{ 
                   background: `linear-gradient(90deg, ${colors.primary}10, transparent)`,
                   border: `1.5px solid ${colors.primary}15`
                 }}>
              <p className="text-xs font-bold mb-1" style={{ color: colors.primary, fontFamily: font }}>{t('Location')}</p>
              <p className="text-xs" style={{ color: colors.text, fontFamily: font }}>{contactData.location}</p>
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
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Shield className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('About Dr.')} {data.name?.split(' ')[1] || t('Veterinarian')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>
        
        {/* Info Grid */}
        <div className="space-y-3">
          {/* Experience */}
          {aboutData.experience && (
            <div className="flex items-center p-3 rounded-xl" 
                 style={{ backgroundColor: colors.primary + '10', border: `1px solid ${colors.primary}20` }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3" 
                   style={{ backgroundColor: colors.primary + '20' }}>
                <Stethoscope className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-0.5" style={{ color: colors.text + '80', fontFamily: font }}>{t('Experience')}</p>
                <p className="text-base font-bold" style={{ color: colors.primary, fontFamily: font }}>{aboutData.experience}+ {t('Years')}</p>
              </div>
            </div>
          )}
          
          {/* Education */}
          {aboutData.education && (
            <div className="flex items-center p-3 rounded-xl" 
                 style={{ backgroundColor: colors.accent + '10', border: `1px solid ${colors.accent}20` }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 text-xl" 
                   style={{ backgroundColor: colors.accent + '20' }}>
                🎓
              </div>
              <div className="flex-1">
                <p className="text-xs mb-0.5" style={{ color: colors.text + '80', fontFamily: font }}>{t('Education')}</p>
                <p className="text-sm font-medium" style={{ color: colors.accent, fontFamily: font }}>{aboutData.education}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Specialties */}
        {aboutData.specialties && (
          <div className="mt-4">
            <p className="text-sm font-bold mb-2 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
              <Shield className="w-4 h-4 mr-1.5" style={{ color: colors.primary }} />
              {t('Specialties')}
            </p>
            <div className="flex flex-wrap gap-2">
              {aboutData.specialties.split(',').map((specialty: string, index: number) => (
                <span key={index} 
                      className="px-3 py-1.5 rounded-lg text-sm" 
                      style={{ 
                        backgroundColor: colors.secondary + '15',
                        color: colors.secondary,
                        fontFamily: font
                      }}>
                  {specialty.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Heart className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Veterinary Services')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        {/* Services List */}
        <div className="space-y-3">
          {services.map((service: any, index: number) => (
            <div key={index} className="relative p-4 rounded-2xl" 
                 style={{ 
                   background: `linear-gradient(135deg, ${colors.primary}08, ${colors.accent}05)`,
                   border: `2px solid ${colors.primary}15`
                 }}>

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
                      {service.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
                    {service.description}
                  </p>
                </div>
                {service.price_range && (
                  <div className="ml-3 px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0" 
                       style={{ 
                         background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                         color: 'white',
                         fontFamily: font
                       }}>
                    {service.price_range}
                  </div>
                )}
              </div>
              
              {service.animal_types && (
                <div className="flex items-center">
                  <div className="flex flex-wrap gap-2 flex-1">
                    {service.animal_types.split(',').map((animal: string, idx: number) => (
                      <div key={idx} 
                           className="flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold" 
                           style={{ 
                             backgroundColor: 'white',
                             border: `1.5px solid ${colors.secondary}30`,
                             color: colors.primary,
                             fontFamily: font
                           }}>
                        {animal.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnimalCareSection = (careData: any) => {
    const tips = careData.care_tips || [];
    if (!Array.isArray(tips) || tips.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              🐾 {t('Pet Care Tips')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        {/* Tips List */}
        <div className="space-y-3">
          {tips.slice(0, 3).map((tip: any, index: number) => (
            <div key={index} className="p-4 rounded-xl" 
                 style={{ 
                   backgroundColor: colors.cardBg,
                   border: `2px solid ${colors.accent}20`
                 }}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-sm capitalize flex-1" style={{ color: colors.text, fontFamily: font }}>
                  {tip.tip_title}
                </h4>
                <div className="flex space-x-2 ml-2">
                  <div className="px-2 py-1 rounded-lg text-xs font-medium" 
                       style={{ backgroundColor: colors.secondary + '20', color: colors.secondary, fontFamily: font }}>
                    {tip.animal_type}
                  </div>
                  {tip.season !== 'all-year' && (
                    <div className="px-2 py-1 rounded-lg text-xs font-medium" 
                         style={{ backgroundColor: colors.accent + '20', color: colors.accent, fontFamily: font }}>
                      {tip.season}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {tip.tip_description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEmergencySection = (emergencyData: any) => {
    if (!emergencyData.emergency_phone && !emergencyData.after_hours_info) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2 text-red-600" style={{ fontFamily: font }}>
              <AlertTriangle className="inline w-4 h-4 mr-2" />
              {t('Emergency Care')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full bg-red-600"></div>
              <div className="w-8 h-0.5 rounded-full bg-red-500"></div>
              <div className="w-8 h-0.5 rounded-full bg-red-400"></div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-red-50" style={{ border: '2px solid #FCA5A5' }}>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-sm text-red-600" style={{ fontFamily: font }}>
              {t('Emergency Services')}
            </span>
          </div>
          
          {emergencyData.emergency_phone && (
            <a href={`tel:${emergencyData.emergency_phone}`}
               className="flex items-center space-x-3 p-3 rounded-xl mb-3 transition-all hover:scale-[1.02] bg-white border-2 border-red-200">
              <Phone className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-sm text-red-700" style={{ fontFamily: font }}>
                {emergencyData.emergency_phone}
              </span>
            </a>
          )}
          
          {emergencyData.after_hours_info && (
            <p className="text-sm mb-3 leading-relaxed text-red-700" style={{ fontFamily: font }}>
              {emergencyData.after_hours_info}
            </p>
          )}
          
          {emergencyData.emergency_clinic && (
            <div className="p-3 rounded-xl mb-3 bg-white border-2 border-red-200">
              <p className="text-sm font-medium mb-1 text-red-600" style={{ fontFamily: font }}>
                {t('Partner Emergency Clinic')}:
              </p>
              <p className="text-sm text-red-700" style={{ fontFamily: font }}>
                {emergencyData.emergency_clinic}
              </p>
            </div>
          )}
          
          {emergencyData.emergency_tips && (
            <div className="p-3 rounded-xl bg-white border-2 border-red-200">
              <p className="text-sm font-medium mb-1 text-red-600" style={{ fontFamily: font }}>
                {t('First Aid Tips')}:
              </p>
              <p className="text-sm leading-relaxed text-red-700" style={{ fontFamily: font }}>
                {emergencyData.emergency_tips}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <UserPlus className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Follow Our Pet Community')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {socialLinks.map((link: any, index: number) => (
            <button
              key={index}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
              className="w-12 h-12 rounded-full transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
              }}>
              <SocialIcon platform={link.platform} className="w-6 h-6" color='#FFFFFF'/>
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
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Clock className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Clinic Hours')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        {/* Hours List */}
        <div className="space-y-2">
          {hours.slice(0, 7).map((hour: any, index: number) => (
            <div key={index} 
                 className="flex justify-between items-center p-3 rounded-lg" 
                 style={{ 
                   backgroundColor: hour.is_closed ? colors.background : colors.primary + '08',
                   border: `1px solid ${hour.is_closed ? colors.primary + '10' : colors.primary + '20'}`
                 }}>
              <span className="capitalize font-medium text-sm" style={{ color: colors.text, fontFamily: font }}>
                {t(hour.day)}
              </span>
              <span className="text-sm font-medium" 
                    style={{ 
                      color: hour.is_closed ? colors.text + '60' : colors.primary,
                      fontFamily: font
                    }}>
                {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Heart className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Happy Pet Families')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div className="relative p-5 rounded-2xl overflow-hidden" 
                       style={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}20` }}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20" 
                         style={{ background: colors.secondary, transform: 'translate(30%, -30%)' }}></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full blur-2xl opacity-20" 
                         style={{ background: colors.accent, transform: 'translate(-30%, 30%)' }}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5" fill={i < parseInt(review.rating || 5) ? '#FCD34D' : '#E5E7EB'} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed mb-4" style={{ color: colors.text + 'DD', fontFamily: font }}>
                        "{review.review}"
                      </p>
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                            {review.client_name}
                          </p>
                          {review.pet_name && review.pet_type && (
                            <p className="text-sm" style={{ color: colors.text + '80', fontFamily: font }}>
                              {review.pet_name} • {review.pet_type}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {reviews.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {testimonialsData.reviews.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ 
                    width: currentReview === dotIndex ? '24px' : '8px',
                    background: currentReview === dotIndex 
                      ? `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` 
                      : colors.primary + '40'
                  }}
                  onClick={() => setCurrentReview(dotIndex)}
                >
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="p-4 rounded-xl" style={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}20` }}>
          <h3 className="font-bold text-base mb-3 text-center" style={{ color: colors.primary, fontFamily: font }}>
            {t('Schedule an Appointment')}
          </h3>
          {appointmentsData?.appointment_info && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {appointmentsData.appointment_info}
            </p>
          )}
          <button
            className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#FFFFFF', fontFamily: font }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}>
            <Calendar className="w-5 h-5" />
            <span>{t('Book Appointment')}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <MapPin className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Clinic Location')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <div className="rounded-xl overflow-hidden" style={{ border: `2px solid ${colors.primary}20` }}>
              <VeterinarianMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          
          {locationData.directions_url && (
            <button
              className="w-full p-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#FFFFFF', fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}>
              <MapPin className="w-5 h-5" />
              <span>{t('Get Directions')}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Globe className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Download Our App')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && (
            <button
              className="p-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: colors.primary + '10', border: `2px solid ${colors.primary}20`, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}>
              {t("App Store")}
            </button>
          )}
          {appData.play_store_url && (
            <button
              className="p-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: colors.primary + '10', border: `2px solid ${colors.primary}20`, color: colors.primary, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}>
              {t("Play Store")}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        <div className="p-4 rounded-xl" style={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}20` }}>
          <h3 className="font-bold text-base mb-3 text-center" style={{ color: colors.primary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <button
            className="w-full py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 mx-auto"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#FFFFFF', fontFamily: font }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Mail className="w-5 h-5" />
            <span>{t('Contact Us')}</span>
          </button>
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
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Video className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('Educational Videos')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {videoContent.map((video: any) => (
            <div key={video.key} className="rounded-xl overflow-hidden" style={{ 
              backgroundColor: colors.cardBg,
              border: `2px solid ${colors.primary}15`
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
                      className="relative w-full cursor-pointer overflow-hidden"
                      style={{
                        aspectRatio: '16 / 9',
                        minHeight: '180px',
                        backgroundColor: colors.background,
                      }}
                      onClick={() => { if (videoUrl) setPlayingKey(video.key); }}
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={video.title || 'Video'}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center' }}
                        />
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
              <div className="p-4">
                <h4 className="font-bold text-sm mb-2" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  {video.duration && (
                    <div className="flex items-center px-2 py-1 rounded-lg" style={{ backgroundColor: colors.primary + '15' }}>
                      <span className="text-xs font-medium" style={{ color: colors.primary, fontFamily: font }}>
                        ⏱️ {video.duration}
                      </span>
                    </div>
                  )}
                  {video.video_type && (
                    <div className="px-2 py-1 rounded-lg" style={{ backgroundColor: colors.accent + '15' }}>
                      <span className="text-xs font-medium capitalize" style={{ color: colors.accent, fontFamily: font }}>
                        {video.video_type.replace(/_/g, ' ')}
                      </span>
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

  const renderYouTubeSection = (youtubeData: any) => {
    if (!youtubeData.channel_url && !youtubeData.channel_name && !youtubeData.latest_video_embed) return null;
    
    return (
      <div className="px-6 py-4" style={{ borderBottom: `2px solid ${colors.primary}20` }}>
        {/* Title */}
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <Youtube className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {t('YouTube Channel')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        {youtubeData.latest_video_embed && (
          <div className="mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}15` }}>
            <div className="p-4 mb-2">
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
        
        <div className="p-4 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.primary}15` }}>
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center mr-3">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-base" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || t('Veterinary Care')}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="text-sm" style={{ color: colors.text + 'CC', fontFamily: font }}>
                  📊 {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>
          
          {youtubeData.channel_description && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text, fontFamily: font }}>
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
                🏥 {t('PET HEALTH TIPS')}
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
        className="px-6 py-4" 
        style={{ backgroundColor: colors.background, borderBottom: `2px solid ${colors.primary}20` }}
        id="custom_html"
      >
        {customHtmlData.section_title && (
          <>
            <div className="mb-4 text-center">
              <div className="inline-block relative">
                <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
                  {customHtmlData.section_title}
                </h3>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
                  <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                  <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                  <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
                </div>
              </div>
            </div>
          </>
        )}
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
        className="px-6 py-4" 
        style={{ backgroundColor: colors.cardBg, borderBottom: `2px solid ${colors.primary}20` }}
        id="qr_share"
      >
        <div className="mb-4 text-center">
          <div className="inline-block relative">
            <h3 className="font-bold text-base px-6 py-2" style={{ color: colors.primary, fontFamily: font }}>
              <QrCode className="inline w-4 h-4 mr-2" style={{ color: colors.primary }} />
              {qrData.section_title || t('Share & Connect')}
            </h3>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1">
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: colors.accent }}></div>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl" style={{ backgroundColor: colors.background, border: `2px solid ${colors.primary}20` }}>
          {qrData.qr_description && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          
          <button
            className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 mx-auto cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: '#FFFFFF', fontFamily: font }}
            onClick={() => setShowQrModal(true)}>
            <QrCode className="w-5 h-5" />
            <span>{t('Share QR Code')}</span>
          </button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="relative px-5 py-6 overflow-hidden">
        {/* Paw prints top */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4].map((scale, i) => (
            <svg key={i} width={20 * scale} height={20 * scale} viewBox="0 0 24 24" 
                 className="animate-pulse"
                 style={{
                   animationDelay: `${i * 0.15}s`,
                   animationDuration: '2s'
                 }}>
              <ellipse cx="12" cy="16" rx="5" ry="4" 
                       fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent} 
                       opacity="0.6"/>
              <circle cx="8" cy="10" r="2" 
                      fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent} 
                      opacity="0.6"/>
              <circle cx="12" cy="8" r="2" 
                      fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent} 
                      opacity="0.6"/>
              <circle cx="16" cy="10" r="2" 
                      fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent} 
                      opacity="0.6"/>
              <circle cx="18" cy="14" r="1.5" 
                      fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent} 
                      opacity="0.6"/>
            </svg>
          ))}
        </div>

        {/* Message */}
        <p className="text-sm text-center leading-relaxed relative z-10 px-2"
          style={{ color: `${colors.text}CC`, fontFamily: font, fontStyle: 'italic' }}>
          "{thankYouData.message}"
        </p>

        {/* Paw prints bottom */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4].reverse().map((scale, i) => (
            <svg key={i} width={20 * scale} height={20 * scale} viewBox="0 0 24 24" 
                 className="animate-pulse"
                 style={{
                   animationDelay: `${i * 0.15}s`,
                   animationDuration: '2s'
                 }}>
              <ellipse cx="12" cy="16" rx="5" ry="4" 
                       fill={i % 3 === 0 ? colors.secondary : i % 3 === 1 ? colors.accent : colors.primary} 
                       opacity="0.6"/>
              <circle cx="8" cy="10" r="2" 
                      fill={i % 3 === 0 ? colors.secondary : i % 3 === 1 ? colors.accent : colors.primary} 
                      opacity="0.6"/>
              <circle cx="12" cy="8" r="2" 
                      fill={i % 3 === 0 ? colors.secondary : i % 3 === 1 ? colors.accent : colors.primary} 
                      opacity="0.6"/>
              <circle cx="16" cy="10" r="2" 
                      fill={i % 3 === 0 ? colors.secondary : i % 3 === 1 ? colors.accent : colors.primary} 
                      opacity="0.6"/>
              <circle cx="18" cy="14" r="1.5" 
                      fill={i % 3 === 0 ? colors.secondary : i % 3 === 1 ? colors.accent : colors.primary} 
                      opacity="0.6"/>
            </svg>
          ))}
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
      <div className="p-6 space-y-3">
        {hasContactButton && (
          <button className="w-full py-3 font-semibold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                    color: '#FFFFFF',
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <Heart className="w-5 h-5" />
            <span>{actionData.contact_button_text}</span>
          </button>
        )}

        {hasAppointmentButton && (
          <button
            className="w-full py-3 font-semibold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer relative overflow-hidden cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${colors.secondary}, ${colors.accent})`,
              color: '#FFFFFF',
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
            <Calendar className="w-5 h-5 relative z-10" />
            <span className="relative z-10">{actionData.appointment_button_text}</span>
          </button>
        )}

        {hasSaveContactButton && (
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer relative overflow-hidden"
                    style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.primary})`, color: '#FFFFFF', fontFamily: font }}
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
                    }}>
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
              <UserPlus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{actionData.save_contact_button_text}</span>
            </button>

            <button
              className="p-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                color: '#FFFFFF',
                fontFamily: font
              }}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.share) {
                  navigator.share({
                    title: data.name || 'Business Card',
                    text: 'Check out this veterinarian business card',
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    );
  };



  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections);
    
  
  return (
    <div className="w-full overflow-hidden" style={{ 
      fontFamily: font,
      backgroundColor: colors.background,
      boxShadow: `0 20px 60px ${colors.primary}15`,
      border: `3px solid ${colors.primary}10`,
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
        <div className="px-6 pb-6 pt-2">
          {copyrightSection.text && (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)` }}></div>
              <p className="text-xs" style={{ color: colors.text +'50', fontFamily: font }}>
                {copyrightSection.text}
              </p>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${colors.primary}40, transparent)` }}></div>
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
