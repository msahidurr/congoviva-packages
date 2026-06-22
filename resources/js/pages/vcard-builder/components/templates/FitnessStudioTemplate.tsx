import { handleAppointmentBooking } from '../VCardPreview';
import React, { useState } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData, sanitizePath } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Clock, 
  Calendar, 
  Star, 
  ChevronRight, 
  UserPlus,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Dumbbell,
  Users,
  Award,
  Youtube,
  Linkedin,
  Clock3,
  Flame,
  Heart,
  CheckCircle2,
  ArrowRight,
  Video,
  Play,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionData } from '@/utils/sectionHelpers';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface FitnessStudioTemplateProps {
  data: any;
  template: any;
}

const FitnessStudioMapEmbed = React.memo(function FitnessStudioMapEmbed({ embedHtml }: { embedHtml: string }) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md"
      style={{ height: '200px' }}>
      <div
        dangerouslySetInnerHTML={{ __html: embedHtml }}
        className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
      />
    </div>
  );
});

export default function FitnessStudioTemplate({ data, template }: FitnessStudioTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeDay, setActiveDay] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  
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
  const [currentLanguage, setCurrentLanguage] = React.useState(configSections.language?.template_language || i18n.language || 'en');

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
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#E53935', 
    secondary: '#FF5252', 
    accent: '#FFEBEE', 
    background: '#FFFFFF', 
    text: '#212121',
    cardBg: '#F5F5F5',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
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
  const allSections = getBusinessTemplate('fitness-studio')?.sections || [];

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

  const renderSection = (sectionKey: string) => {
    const sectionData = configSections[sectionKey] || {};
    if (!sectionData || Object.keys(sectionData).length === 0 || sectionData.enabled === false) return null;
    
    switch (sectionKey) {
      case 'header':
        return renderHeaderSection(sectionData);
      case 'about':
        return renderAboutSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'class_schedule':
        return renderClassScheduleSection(sectionData);
      case 'contact':
        return renderContactSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'business_hours':
        return renderBusinessHoursSection(sectionData);
      case 'gallery':
        return renderGallerySection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'appointments':
        return renderAppointmentsSection(sectionData);
      case 'trainers':
        return renderTrainersSection(sectionData);
      case 'membership':
        return renderMembershipSection(sectionData);
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
      case 'footer':
        return renderFooterSection(sectionData);
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
    <div className="relative">
      {/* Dynamic Header with Pattern Overlay */}
      <div className="relative h-56 overflow-hidden">
        {headerData.cover_image ? (
          <img 
            src={getImageDisplayUrl(headerData.cover_image)} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full relative" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}CC 0%, ${colors.secondary}CC 100%), url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80") center/cover`,
            }}
          >
            {/* Fitness pattern overlay */}
            <div className="absolute inset-0 opacity-10" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        ></div>
        

        
        {/* Logo and Name Container - Centered on header */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          {/* Logo */}
          <div className="mb-4">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden border-4 shadow-lg mx-auto flex items-center justify-center" 
              style={{ 
                borderColor: colors.background,
                backgroundColor: colors.background
              }}
            >
              {headerData.logo ? (
                <img 
                  src={getImageDisplayUrl(headerData.logo)} 
                  alt={headerData.name} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Dumbbell
                  size={30}
                  style={{ color: colors.primary }}
                />
              )}
            </div>
          </div>
          
          {/* Studio Name and Tagline */}
          <h1 
            className="text-2xl font-extrabold mb-1 tracking-tight" 
            style={{ 
              color: colors.background,
              fontFamily: font,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {headerData.name || data.name || 'FlexFit Studio'}
          </h1>
          
          {headerData.tagline && (
            <p 
              className="text-sm font-medium" 
              style={{ 
                color: colors.background,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <div 
        className="px-5 py-3 flex justify-center space-x-3 shadow-md"
        style={{ backgroundColor: colors.background }}
      >
        {configSections.contact?.phone && (
          <a 
            href={`tel:${configSections.contact?.phone}`} 
            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md"
            style={{ 
              backgroundColor: colors.primary,
              color: '#FFFFFF'
            }}
          >
            <Phone size={18} color="#FFFFFF" />
          </a>
        )}
        
        {configSections.contact?.address && (
          <a 
            href={configSections.google_map?.directions_url || `https://maps.google.com/?q=${encodeURIComponent(configSections.contact?.address)}`} 
            target="_blank"
            rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md"
          style={{ 
            backgroundColor: colors.primary,
            color: '#FFFFFF'
          }}
        >
          <MapPin size={18} color="#FFFFFF" />
        </a>
        )}
        
        <button 
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md"
          style={{ 
            backgroundColor: colors.primary,
            color: '#FFFFFF'
          }}
        >
          <MessageSquare size={18} color="#FFFFFF" />
        </button>
        
        {configSections.appointments?.booking_url && (
          <button 
            onClick={() => handleAppointmentBooking(configSections.appointments)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md"
            style={{ 
              backgroundColor: colors.primary,
              color: '#FFFFFF'
            }}
          >
            <Calendar size={18} color="#FFFFFF" />
          </button>
        )}
        
        {/* Language Selector beside Calendar button */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md cursor-pointer"
              style={{ 
                backgroundColor: colors.secondary,
                color: '#FFFFFF'
              }}
            >
              <span className="text-sm">
                {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
              </span>
            </button>
            
              {showLanguageSelector && (
                <>
                  <div 
                    className="fixed inset-0" 
                    style={{ zIndex: 40 }}
                    onClick={() => setShowLanguageSelector(false)}
                  />
                <div 
                  className="fixed inset-0" 
                  style={{ zIndex: 40 }}
                  onClick={() => setShowLanguageSelector(false)}
                />
                <div 
                  className="absolute right-0 top-full mt-1 rounded border shadow-xl py-1 w-40 max-h-60 overflow-y-auto" 
                  style={{
                    backgroundColor: colors.background, 
                    borderColor: colors.borderColor, 
                    zIndex: 50
                  }}
                >
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full text-left px-2 py-1 text-xs flex items-center space-x-1 hover:bg-gray-50 cursor-pointer"
                      style={{
                        backgroundColor: currentLanguage === lang.code ? colors.primary + '10' : 'transparent',
                        color: colors.text
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

    const aboutStats = [
      aboutData.year_established
        ? {
            label: t("ESTABLISHED"),
            value: aboutData.year_established,
          }
        : null,
      aboutData.studio_type
        ? {
            label: t("SPECIALTY"),
            value: aboutData.studio_type.replace(/_/g, ' '),
          }
        : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;

    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Dumbbell
              size={18}
              style={{ color: colors.primary }}
            />
          </div>
          <h2
            className="text-lg font-semibold leading-tight"
            style={{
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("About Us")}
          </h2>
        </div>

        <p
          className="text-sm leading-7"
          style={{ color: colors.text }}
        >
          {aboutData.description || data.description}
        </p>

        {aboutStats.length > 0 && (
          <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2">
            {aboutStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border px-4 py-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.borderColor,
                }}
              >
                <p
                  className="text-[11px] font-semibold tracking-[0.14em]"
                  style={{ color: colors.primary, opacity: 0.75 }}
                >
                  {stat.label}
                </p>
                <p
                  className="mt-1 text-sm font-medium capitalize"
                  style={{ color: colors.text }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderServicesSection = (servicesData: any) => {
    const offerings = servicesData.offerings || [];
    if (!Array.isArray(offerings) || offerings.length === 0) return null;
    
    const getIntensityBadge = (intensity: string) => {
      if (!intensity) return null;
      
      const intensityLabels: Record<string, { bg: string, text: string, label: string }> = {
        'beginner': { bg: '#E8F5E9', text: '#2E7D32', label: 'Beginner' },
        'intermediate': { bg: '#FFF8E1', text: '#F57F17', label: 'Intermediate' },
        'advanced': { bg: '#FFEBEE', text: '#C62828', label: 'Advanced' },
        'all_levels': { bg: '#E3F2FD', text: '#1565C0', label: 'All Levels' }
      };
      
      const style = intensityLabels[intensity] || { bg: '#F5F5F5', text: '#757575', label: intensity };
      
      return (
        <span 
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none"
          style={{ 
            backgroundColor: style.bg,
            color: style.text
          }}
        >
          {style.label}
        </span>
      );
    };
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Flame
              size={18}
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Our Services")}
          </h2>
        </div>
        
        <div className="space-y-4">
          {offerings.map((service: any, index: number) => (
            <div 
              key={index} 
              className="flex p-4 rounded-lg shadow-md" 
              style={{ 
                backgroundColor: colors.background,
                borderLeft: `4px solid ${colors.primary}`
              }}
            >
              <div className="flex-shrink-0 mr-4">
                {service.image ? (
                  <img 
                    src={getImageDisplayUrl(service.image)} 
                    alt={service.name || 'Service'} 
                    className="w-16 h-16 rounded-lg object-cover"
                    style={{ border: `1px solid ${colors.borderColor}` }}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center" 
                    style={{ 
                      backgroundColor: colors.accent,
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    <Dumbbell size={20} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="min-w-0 flex-1">
                    <h3 
                      className="text-base font-bold leading-6" 
                      style={{ 
                        color: colors.text,
                        fontFamily: font
                      }}
                    >
                      {service.name}
                    </h3>

                    {(service.intensity || service.duration) && (
                      <div className="mt-2 flex flex-wrap items-center gap-2 gap-y-1">
                        {service.intensity && getIntensityBadge(service.intensity)}

                        {service.duration && (
                          <div
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs leading-none"
                            style={{
                              backgroundColor: colors.cardBg,
                              color: colors.text + 'B3'
                            }}
                          >
                            <Clock3 size={12} className="mr-1.5" />
                            <span>{service.duration}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {service.price && (
                    <span 
                      className="text-sm font-bold ml-3 shrink-0" 
                      style={{ color: colors.secondary }}
                    >
                      {service.price}
                    </span>
                  )}
                </div>

                {service.description && (
                  <p 
                    className="text-xs leading-5 mt-2" 
                    style={{ color: colors.text + 'CC' }}
                  >
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClassScheduleSection = (scheduleData: any) => {
    const classes = scheduleData.classes || [];
    if (!Array.isArray(classes) || classes.length === 0) return null;
    
    // Get unique days
    const days = ['all', ...new Set(classes.map((item: any) => item.day))];
    
    // Filter classes by active day
    const filteredClasses = activeDay === 'all' 
      ? classes 
      : classes.filter((item: any) => item.day === activeDay);
    
    // Get current day
    const currentDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = currentDayNames[new Date().getDay()];
    
    // If no active day is selected, default to current day if it has classes
    React.useEffect(() => {
      if (activeDay === 'all' && days.includes(currentDay)) {
        setActiveDay(currentDay);
      }
    }, []);
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Calendar
              size={18}
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Class Schedule")}
          </h2>
        </div>
        
        {/* Day filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {days.map((day: string) => (
            <button
              key={day}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs capitalize transition-colors cursor-pointer"
              style={{ 
                backgroundColor: activeDay === day ? colors.background : 'transparent',
                color: activeDay === day ? colors.primary : colors.text,
                border: `1px solid ${activeDay === day ? colors.primary : colors.borderColor}`,
                fontWeight: activeDay === day ? 'bold' : 'normal'
              }}
              onClick={() => setActiveDay(day)}
            >
              {day === 'all' ? 'All Days' : day}
            </button>
          ))}
        </div>
        
        {/* Classes list */}
        <div className="space-y-3">
          {filteredClasses.map((classItem: any, index: number) => (
            <div 
              key={index} 
              className="flex rounded-lg p-4 shadow-md" 
              style={{ 
                backgroundColor: colors.background,
                borderLeft: `4px solid ${colors.primary}`
              }}
            >
              <div className="flex-1">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex min-h-6 flex-wrap items-center gap-2">
                      <h3 
                        className="text-base font-bold leading-6" 
                        style={{ 
                          color: colors.text,
                          fontFamily: font
                        }}
                      >
                        {classItem.class_name}
                      </h3>
                      
                      {classItem.day === currentDay && (
                        <Badge 
                          className="px-1.5 py-0 text-[10px] leading-4" 
                          style={{ 
                            backgroundColor: colors.primary,
                            color: colors.buttonText
                          }}
                        >
                          {t("Today")}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs leading-5">
                      {activeDay === 'all' && (
                        <span
                          className="capitalize"
                          style={{ color: colors.text + '99' }}
                        >
                          {classItem.day}
                        </span>
                      )}

                      {classItem.instructor && (
                        <>
                          {activeDay === 'all' && (
                            <span
                              className="h-1 w-1 rounded-full"
                              style={{ backgroundColor: colors.text + '66' }}
                            />
                          )}
                          <span style={{ color: colors.text + '99' }}>
                            {t("with")} {classItem.instructor}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className="shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[13px] font-semibold leading-5"
                    style={{
                      backgroundColor: colors.cardBg,
                      color: colors.secondary
                    }}
                  >
                    <Clock3 size={12} className="mr-1.5" />
                    {classItem.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {configSections.appointments?.booking_url && (
          <Button
            className="w-full mt-4"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {t("Book a Class")}
          </Button>
        )}
      </div>
    );
  };

  const renderVideosSection = (videosData: any) => {
    const formatVideoType = (type: string) => {
      if (!type) return '';
      return type
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Video
              size={18}
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Workout Videos")}
          </h2>
        </div>
        
        <div className="space-y-4">
          {videoContent.map((video: any) => (
            <div 
              key={video.key} 
              className="overflow-hidden rounded-2xl shadow-sm" 
              style={{ 
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
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
                      className="relative h-48 w-full cursor-pointer"
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
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.28)' }}>
                          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary, boxShadow: `0 6px 20px ${colors.primary}55` }}>
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <div className="flex items-end justify-between gap-3">
                          {video.video_type && (
                            <span
                              className="rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.88)',
                                color: colors.primary,
                                fontFamily: font
                              }}
                            >
                              {formatVideoType(video.video_type)}
                            </span>
                          )}
                          {video.duration && (
                            <span
                              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm"
                              style={{
                                backgroundColor: 'rgba(17,24,39,0.68)',
                                color: '#FFFFFF',
                                fontFamily: font
                              }}
                            >
                              <Clock3 size={12} className="mr-1.5" />
                              {video.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold leading-6" style={{ color: colors.text, fontFamily: font }}>
                  {video.title}
                </h4>
                {video.description && (
                  <p className="mt-1 text-xs leading-5" style={{ color: colors.text + 'CC', fontFamily: font }}>
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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Youtube
              size={18}
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("YouTube Channel")}
          </h2>
        </div>
        
        {youtubeData.latest_video_embed && (
          <div
            className="mb-4 overflow-hidden rounded-2xl shadow-sm"
            style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}
          >
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: colors.borderColor }}>
              <h4 className="font-semibold text-sm flex items-center" style={{ color: colors.text, fontFamily: font }}>
                <Play className="mr-2 h-4 w-4" style={{ color: colors.primary }} />
                {t("Latest Video")}
              </h4>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ backgroundColor: colors.accent, color: colors.primary, fontFamily: font }}
              >
                YouTube
              </span>
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
          className="rounded-2xl p-4 shadow-sm"
          style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}` }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold leading-6" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_name || 'Fitness Studio'}
              </h4>
              {youtubeData.subscriber_count && (
                <p className="mt-1 text-xs" style={{ color: colors.text + 'B3', fontFamily: font }}>
                  {youtubeData.subscriber_count} {t("subscribers")}
                </p>
              )}
            </div>
          </div>
          
          {youtubeData.channel_description && (
            <p className="mt-3 text-xs leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {youtubeData.channel_description}
            </p>
          )}
          
          <div className="mt-4 grid grid-cols-1 gap-2">
            {youtubeData.channel_url && (
              <Button 
                size="sm" 
                className="w-full rounded-xl" 
                style={{ 
                  backgroundColor: colors.primary, 
                  color: 'white',
                  fontFamily: font 
                }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
              >
                <Youtube className="w-4 h-4 mr-2" />
                {t("SUBSCRIBE")}
              </Button>
            )}
            {youtubeData.featured_playlist && (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full rounded-xl" 
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font }}
                onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
              >
                <Play className="mr-2 h-4 w-4" />
                {t("WORKOUT VIDEOS")}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => (
    <div 
      className="px-5 py-6" 
      style={{ 
        backgroundColor: colors.cardBg
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.accent }}
        >
          <MapPin
            size={18}
            style={{ color: colors.primary }}
          />
        </div>
        <h2 
          className="text-lg font-semibold leading-tight" 
          style={{ 
            color: colors.primary,
            fontFamily: font
          }}
        >
          {t("Contact Us")}
        </h2>
      </div>
      
      <div
        className="rounded-2xl p-4 shadow-sm"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="space-y-3">
          {contactData.address && (
            <div className="pb-3" style={{ borderBottom: `1px solid ${colors.borderColor}` }}>
              <div className="flex items-start gap-3">
                <MapPin 
                  size={18} 
                  className="mt-0.5 shrink-0"
                  style={{ color: colors.primary }}
                />
                <div className="min-w-0 flex-1">
                  <p 
                    className="mb-1 text-[11px] font-semibold tracking-[0.12em]" 
                    style={{ color: colors.primary }}
                  >
                    {t("ADDRESS")}
                  </p>
                  <p 
                    className="text-sm leading-6" 
                    style={{ color: colors.text }}
                  >
                    {contactData.address}
                  </p>
                  
                  {configSections.google_map?.directions_url && (
                    <a 
                      href={configSections.google_map?.directions_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-xs font-medium"
                      style={{ color: colors.primary }}
                    >
                      {t("Get Directions")}
                      <ChevronRight size={12} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(contactData.phone || data.phone) && (
              <div className="flex items-start gap-3 py-1">
                <Phone 
                  size={18} 
                  className="mt-0.5 shrink-0"
                  style={{ color: colors.primary }}
                />
                <div className="min-w-0 flex-1">
                  <p 
                    className="text-[11px] font-semibold tracking-[0.12em]" 
                    style={{ color: colors.primary }}
                  >
                    {t("PHONE")}
                  </p>
                  <a 
                    href={`tel:${contactData.phone || data.phone}`} 
                    className="mt-1 block text-sm leading-6" 
                    style={{ color: colors.text }}
                  >
                    {contactData.phone || data.phone}
                  </a>
                </div>
              </div>
            )}
          
            {(contactData.email || data.email) && (
              <div className="flex items-start gap-3 py-1">
                <Mail 
                  size={18} 
                  className="mt-0.5 shrink-0"
                  style={{ color: colors.primary }}
                />
                <div className="min-w-0 flex-1">
                  <p 
                    className="text-[11px] font-semibold tracking-[0.12em]" 
                    style={{ color: colors.primary }}
                  >
                    {t("EMAIL")}
                  </p>
                  <a 
                    href={`mailto:${contactData.email || data.email}`} 
                    className="mt-1 block text-sm leading-6 break-words" 
                    style={{ color: colors.text }}
                  >
                    {contactData.email || data.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
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

  const renderSocialSection = (socialData: any) => {
    const socialLinks = socialData.social_links || [];
    if (!Array.isArray(socialLinks) || socialLinks.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-4" 
        style={{ 
          backgroundColor: colors.background,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-md transition-transform hover:scale-105"
              style={{ 
                backgroundColor: colors.primary,
                color: '#FFFFFF'
              }}
            >
              <SocialIcon platform={link.platform} color="#FFFFFF" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    
    // Get current day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    
    // Find current day's hours
    const todayHours = hours.find(h => h.day === currentDay);
    const isOpenNow = todayHours && !todayHours.is_closed;
    
    // Check if currently open
    const isCurrentlyOpen = () => {
      if (!todayHours || todayHours.is_closed) return false;
      
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const [openHours, openMinutes] = todayHours.open_time.split(':').map(Number);
      const [closeHours, closeMinutes] = todayHours.close_time.split(':').map(Number);
      
      const openTime = openHours * 60 + openMinutes;
      const closeTime = closeHours * 60 + closeMinutes;
      
      return currentTime >= openTime && currentTime <= closeTime;
    };
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.accent }}
            >
              <Clock 
                size={18} 
                style={{ color: colors.primary }}
              />
            </div>
            <h2 
              className="text-lg font-semibold leading-tight" 
              style={{ 
                color: colors.primary,
                fontFamily: font
              }}
            >
              {t("Hours")}
            </h2>
          </div>
          
          {isCurrentlyOpen() ? (
            <Badge 
              className="px-2.5 py-1 text-[11px] font-medium"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText
              }}
            >
              {t("Open Now")}
            </Badge>
          ) : (
            <Badge 
              className="px-2.5 py-1 text-[11px] font-medium"
              style={{ 
                backgroundColor: '#F44336',
                color: '#FFFFFF'
              }}
            >
              {t("Closed Now")}
            </Badge>
          )}
        </div>
        
        <div 
          className="rounded-2xl p-4 shadow-sm" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="space-y-1">
            {hours.map((hour: any, index: number) => (
              <div 
                key={index} 
                className="flex items-center justify-between gap-3 rounded-xl px-1 py-2"
                style={{ 
                  backgroundColor: hour.day === currentDay ? colors.cardBg : 'transparent',
                  borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
                }}
              >
                <div className="min-w-0 flex-1">
                  <span 
                    className="capitalize text-sm font-medium" 
                    style={{ 
                      color: hour.day === currentDay ? colors.primary : colors.text,
                      fontWeight: hour.day === currentDay ? 'bold' : 'normal'
                    }}
                  >
                    {t(hour.day)}
                  </span>
                </div>
                <span 
                  className="shrink-0 text-sm" 
                  style={{ 
                    color: hour.is_closed ? colors.text + '80' : colors.text
                  }}
                >
                  {hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGallerySection = (galleryData: any) => {
    const photos = galleryData.photos || [];
    if (!Array.isArray(photos) || photos.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <ImageIcon 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Our Facility")}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo: any, index: number) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-2xl shadow-sm"
              style={{ border: `1px solid ${colors.borderColor}` }}
            >
              <div className="aspect-square overflow-hidden">
                {photo.image ? (
                  <img 
                    src={getImageDisplayUrl(photo.image)} 
                    alt={photo.caption || `Gallery image ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div 
                    className="flex h-full w-full items-center justify-center"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Dumbbell size={24} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
              
              {photo.caption && (
                <div
                  className="p-3 text-xs leading-5"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text
                  }}
                >
                  {photo.caption}
                </div>
              )}
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
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Star 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Success Stories")}
          </h2>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="rounded-2xl p-5 shadow-sm" 
                    style={{ 
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center min-w-0">
                        {review.member_image ? (
                          <div className="mr-3 h-12 w-12 overflow-hidden rounded-full">
                            <img 
                              src={review.member_image} 
                              alt={review.member_name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div 
                            className="mr-3 flex h-12 w-12 items-center justify-center rounded-full"
                            style={{ backgroundColor: colors.accent }}
                          >
                            <Users size={18} style={{ color: colors.primary }} />
                          </div>
                        )}
                        
                        <div className="min-w-0">
                          <p 
                            className="text-sm font-semibold leading-6" 
                            style={{ color: colors.text }}
                          >
                            {review.member_name}
                          </p>
                          
                          {review.achievement && (
                            <div className="flex items-center mt-1">
                              <Award size={12} style={{ color: colors.highlightColor }} />
                              <p 
                                className="ml-1 text-xs" 
                                style={{ color: colors.secondary }}
                              >
                                {review.achievement}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
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

                    <p 
                      className="text-sm leading-7" 
                      style={{ color: colors.text }}
                    >
                      "{review.review}"
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
                  className="h-2 rounded-full transition-all cursor-pointer"
                  style={{ 
                    width: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? '18px' : '8px',
                    backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '30'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAppointmentsSection = (appointmentsData: any) => {
    if (!appointmentsData.booking_url) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Calendar 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Book a Class")}
          </h2>
        </div>
        
        <div 
          className="rounded-2xl p-5 text-center shadow-sm" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {appointmentsData.trial_available && appointmentsData.trial_text && (
            <div 
              className="mb-4 rounded-2xl px-4 py-3" 
              style={{ backgroundColor: colors.accent }}
            >
              <div className="flex items-center justify-center">
                <Heart size={16} className="mr-2" style={{ color: colors.primary }} />
                <p 
                  className="text-sm font-medium" 
                  style={{ color: colors.primary }}
                >
                  {appointmentsData.trial_text}
                </p>
              </div>
            </div>
          )}

          {appointmentsData.booking_description && (
            <p
              className="mb-4 text-sm leading-6"
              style={{ color: colors.text + 'CC' }}
            >
              {appointmentsData.booking_description}
            </p>
          )}
          
          <Button
            className="w-full rounded-xl"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {appointmentsData.booking_text || 'Book Now'}
          </Button>
        </div>
      </div>
    );
  };

  const renderTrainersSection = (trainersData: any) => {
    const trainers = trainersData.team || [];
    if (!Array.isArray(trainers) || trainers.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Users 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Our Trainers")}
          </h2>
        </div>
        
        <div className="space-y-4">
          {trainers.map((trainer: any, index: number) => (
            <div 
              key={index} 
              className="rounded-2xl p-4 shadow-sm" 
              style={{ 
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  {trainer.image ? (
                    <div className="h-20 w-20 overflow-hidden rounded-2xl">
                      <img 
                        src={getImageDisplayUrl(trainer.image)} 
                        alt={trainer.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="flex h-20 w-20 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: colors.accent }}
                    >
                      <Users size={24} style={{ color: colors.primary }} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div>
                    <p 
                      className="text-lg font-semibold leading-6" 
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      {trainer.name}
                    </p>
                    
                    {trainer.title && (
                      <p 
                        className="mt-1 text-sm font-medium leading-5" 
                        style={{ color: colors.secondary }}
                      >
                        {trainer.title}
                      </p>
                    )}
                    
                    {trainer.certifications && (
                      <p 
                        className="mt-2 text-xs leading-5" 
                        style={{ color: colors.text + '99' }}
                      >
                        {trainer.certifications}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {trainer.bio && (
                <p 
                  className="mt-4 text-sm leading-7" 
                  style={{ color: colors.text }}
                >
                  {trainer.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMembershipSection = (membershipData: any) => {
    const plans = membershipData.plans || [];
    if (!Array.isArray(plans) || plans.length === 0) return null;
    
    // Set active tab to the popular plan if available
    React.useEffect(() => {
      const popularPlan = plans.find(plan => plan.is_popular);
      if (popularPlan && activeTab === 'all') {
        setActiveTab(plans.indexOf(popularPlan).toString());
      }
    }, []);
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Award 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Membership Plans")}
          </h2>
        </div>
        
        {/* Plan tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {plans.map((plan: any, index: number) => (
            <button
              key={index}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors cursor-pointer"
              style={{ 
                backgroundColor: activeTab === index.toString() ? colors.background : 'transparent',
                color: activeTab === index.toString() ? colors.primary : colors.text,
                border: `1px solid ${activeTab === index.toString() ? colors.primary : colors.borderColor}`,
                fontWeight: activeTab === index.toString() ? 'bold' : 'normal'
              }}
              onClick={() => setActiveTab(index.toString())}
            >
              {plan.name}
              {plan.is_popular && (
                <span 
                  className="ml-1 rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{ 
                    backgroundColor: colors.highlightColor,
                    color: '#000000'
                  }}
                >
                  {t("Popular")}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {/* Plan details */}
        <div className="space-y-4">
          {plans.map((plan: any, index: number) => (
            <div 
              key={index} 
              className={`rounded-2xl p-5 shadow-sm ${activeTab === index.toString() ? 'block' : 'hidden'}`}
              style={{ 
                backgroundColor: colors.background,
                border: plan.is_popular ? `1.5px solid ${colors.primary}` : `1px solid ${colors.borderColor}`
              }}
            >
              <div className="mb-4 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="min-w-0">
                    <h3 
                      className="text-lg font-semibold leading-6" 
                      style={{ 
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {plan.name}
                    </h3>
                  </div>
                  {plan.is_popular && (
                    <span
                      className="rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em]"
                      style={{
                        backgroundColor: colors.accent,
                        color: colors.primary
                      }}
                    >
                      {t("Popular")}
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <span 
                    className="text-2xl font-extrabold" 
                    style={{ color: colors.text }}
                  >
                    {plan.price}
                  </span>
                  {plan.duration && (
                    <span 
                      className="text-sm" 
                      style={{ color: colors.text + '99' }}
                    >
                      {' '}/{plan.duration}
                    </span>
                  )}
                </div>
                
                {plan.description && (
                  <p 
                    className="mt-2 text-sm leading-6" 
                    style={{ color: colors.text + 'CC' }}
                  >
                    {plan.description}
                  </p>
                )}
              </div>
              
              {plan.features && (
                <div 
                  className="mb-4 rounded-2xl p-4" 
                  style={{ backgroundColor: colors.accent + '50' }}
                >
                  <ul className="space-y-2">
                    {plan.features.split('\n').map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 
                          size={16} 
                          className="mr-2 flex-shrink-0 mt-0.5" 
                          style={{ color: colors.primary }}
                        />
                        <span 
                          className="text-sm" 
                          style={{ color: colors.text }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button
                className="w-full rounded-xl"
                style={{ 
                  backgroundColor: plan.is_popular ? colors.primary : 'transparent',
                  color: plan.is_popular ? colors.buttonText : colors.primary,
                  border: `1px solid ${colors.primary}`,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                {plan.is_popular ? 'Join Now' : 'Learn More'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLocationSection = (locationData: any) => {
    if (!locationData.directions_url) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <MapPin 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Find Us")}
          </h2>
        </div>
        
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="space-y-4">
          {locationData.map_embed_url && (
            <div className="overflow-hidden rounded-2xl">
              <FitnessStudioMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          
          {locationData.directions_url && (
            <Button 
              className="w-full rounded-xl"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, '_blank', 'noopener,noreferrer')}
            >
              <MapPin className="w-4 h-4 mr-2" />
              {t("Get Directions")}
            </Button>
          )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ color: colors.primary }}
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {t("Mobile App")}
          </h2>
        </div>
        
        <div 
          className="rounded-2xl p-5 shadow-sm" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {appData.app_description && (
            <p 
              className="mb-4 text-sm leading-6" 
              style={{ color: colors.text }}
            >
              {appData.app_description}
            </p>
          )}
          
          {appData.app_features && (
            <div 
              className="mb-4 rounded-2xl p-4"
              style={{ backgroundColor: colors.accent + '40' }}
            >
              <p 
                className="mb-3 text-sm font-semibold" 
                style={{ color: colors.primary }}
              >
                {t("Features:")}
              </p>
              <ul className="space-y-1">
                {appData.app_features.split('\n').map((feature: string, i: number) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle2 
                      size={14} 
                      className="mr-2 flex-shrink-0" 
                      style={{ color: colors.primary }}
                    />
                    <span 
                      className="text-sm leading-6" 
                      style={{ color: colors.text }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            {appData.app_store_url && (
              <Button 
                variant="outline" 
                className="rounded-xl"
                style={{ 
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t("App Store")}
              </Button>
            )}
            
            {appData.play_store_url && (
              <Button 
                variant="outline" 
                className="rounded-xl"
                style={{ 
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, '_blank', 'noopener,noreferrer')}
              >
                {t("Play Store")}
              </Button>
            )}
          </div>
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
          backgroundColor: colors.background
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <Mail 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {formData.form_title}
          </h2>
        </div>
        
        <div
          className="rounded-2xl p-5 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {formData.form_description && (
            <p 
              className="mb-4 text-sm leading-6" 
              style={{ color: colors.text }}
            >
              {formData.form_description}
            </p>
          )}
          
          <Button 
            className="w-full rounded-xl"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="mr-2 h-4 w-4" />
            {t("Send Message")}
          </Button>
        </div>
      </div>
    );
  };

  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    
    return (
      <div 
        className="px-5 py-4" 
        style={{ backgroundColor: colors.cardBg }}
      >
        <p 
          className="text-sm text-center" 
          style={{ color: colors.text + '80' }}
        >
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: colors.accent }}
            >
              <Dumbbell 
                size={18} 
                style={{ color: colors.primary }}
              />
            </div>
            <h2 
              className="text-lg font-semibold leading-tight" 
              style={{ 
                color: colors.primary,
                fontFamily: font
              }}
            >
              {customHtmlData.section_title}
            </h2>
          </div>
        )}
        <div 
          className="custom-html-content rounded-2xl p-5 shadow-sm" 
          style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            fontFamily: font,
            color: colors.text
          }}
        >
          <style>
            {`
              .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
                color: ${colors.primary};
                margin-bottom: 0.75rem;
                font-family: ${font};
                line-height: 1.3;
              }
              .custom-html-content p {
                color: ${colors.text};
                margin-bottom: 0.75rem;
                font-family: ${font};
                line-height: 1.75;
              }
              .custom-html-content a {
                color: ${colors.secondary};
                text-decoration: underline;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1.1rem;
                font-family: ${font};
                margin-bottom: 0.75rem;
              }
              .custom-html-content li {
                margin-bottom: 0.4rem;
                line-height: 1.7;
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
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.accent }}
          >
            <QrCode 
              size={18} 
              style={{ color: colors.primary }}
            />
          </div>
          <h2 
            className="text-lg font-semibold leading-tight" 
            style={{ 
              color: colors.primary,
              fontFamily: font
            }}
          >
            {qrData.qr_title || t('Share Our Gym')}
          </h2>
        </div>
        
        <div 
          className="rounded-2xl p-5 text-center shadow-sm" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {qrData.qr_description && (
            <p 
              className="mb-4 text-sm leading-6" 
              style={{ color: colors.text }}
            >
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            className="w-full rounded-xl" 
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
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

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.cardBg
        }}
      >
        <div
          className="rounded-2xl p-5 text-center shadow-sm"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {footerData.footer_text && (
            <p 
              className="text-sm leading-6" 
              style={{ 
                color: colors.text,
                fontFamily: font
              }}
            >
              {footerData.footer_text}
            </p>
          )}
          
          {footerData.footer_links && Array.isArray(footerData.footer_links) && footerData.footer_links.length > 0 && (
            <div className={`flex flex-wrap justify-center gap-2 ${footerData.footer_text ? 'mt-4' : ''}`}>
              {footerData.footer_links.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: colors.accent,
                    color: colors.primary,
                    fontFamily: font
                  }}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasBookingButton = actionData.booking_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasBookingButton && !hasSaveContactButton) return null;

    return (
      <div className="px-5 py-6" style={{ backgroundColor: colors.background }}>
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="space-y-3">
        {hasContactButton && (
          <Button
            className="w-full rounded-xl"
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

        {hasBookingButton && (
          <Button
            className="w-full rounded-xl"
            style={{
              backgroundColor: colors.secondary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.appointments)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.booking_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            style={{
              borderColor: colors.primary,
              color: colors.primary,
              fontFamily: font
            }}
            onClick={() => {
              const headerData = configSections.header || {};
              const contactData = configSections.contact || {};
              const vcfData = {
                name: headerData.name || data.name || '',
                title: headerData.tagline || '',
                email: contactData.email || data.email || '',
                phone: contactData.phone || data.phone || '',
                website: contactData.website || data.website || '',
                location: contactData.address || ''
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
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;
    
    return (
      <div 
        className="px-5 py-4" 
        style={{ backgroundColor: colors.primary }}
      >
        <p 
          className="text-xs text-center" 
          style={{ color: colors.buttonText + '80' }}
        >
          {copyrightData.text}
        </p>
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
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'footer' && key !== 'copyright' && key !== 'action_buttons')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
        
      {/* Footer Section */}
      {renderSection('footer')}
      
      {/* Action Buttons Section */}
      {renderSection('action_buttons')}
      
      {/* Copyright Section */}
      {renderSection('copyright')}
      
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
