import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React, { useState, useMemo } from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  ChevronRight,
  MessageSquare,
  Dumbbell,
  Users,
  Award,
  User,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Camera,
  CheckCircle,
  ArrowRight,
  Clock3,
  Video,
  Play,
  Share2,
  QrCode
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface GymTemplateProps {
  data: any;
  template: any;
}

const GymMapEmbed = React.memo(function GymMapEmbed({ embedHtml }: { embedHtml: string }) {
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

export default function GymTemplate({ data, template }: GymTemplateProps) {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('classes');
  const [activeDay, setActiveDay] = useState<string>('monday');
  
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
    primary: '#FF5722', 
    secondary: '#212121', 
    accent: '#FBE9E7', 
    background: '#FFFFFF', 
    text: '#333333',
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
  const allSections = getBusinessTemplate('gym')?.sections || [];
  
  const renderHeaderSection = (headerData: any) => (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        {headerData.hero_image ? (
          <img 
            src={getImageDisplayUrl(headerData.hero_image)} 
            alt="Gym Hero" 
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
        
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                style={{ 
                  backgroundColor: colors.primary,
                  color: 'white',
                  fontFamily: font
                }}
              >
                <Globe className="w-3 h-3" />
                <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>
              
              {showLanguageSelector && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] max-h-48 overflow-y-auto z-[99999]">
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2 cursor-pointer ${
                        currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-sm">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Overlay with Logo and Name */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center p-6" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          {(headerData.logo || headerData.profile_image) ? (
            <div className="mb-4 rounded-2xl p-2 shadow-lg">
              <img 
                src={getImageDisplayUrl(headerData.logo || headerData.profile_image)} 
                alt={headerData.name} 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          ) : (
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4" 
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText
              }}
            >
              <Dumbbell size={36} color='white'/>
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
            {headerData.name || data.name || 'PowerFit Studio'}
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
      
      {/* Quick Action Buttons */}
      <div 
        className="grid grid-cols-3 gap-px" 
        style={{ 
          backgroundColor: colors.borderColor
        }}
      >
        <Button
          className="rounded-none h-14 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: colors.secondary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => handleAppointmentBooking(configSections.appointments)}
        >
          <Calendar size={18} className="mb-1" />
          <span className="text-xs">{t("Book a Class")}</span>
        </Button>
        
        <Button
          className="rounded-none h-14 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: colors.primary,
            color: colors.buttonText,
            fontFamily: font
          }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
        >
          <MessageSquare size={18} className="mb-1" />
          <span className="text-xs">{t("Contact Us")}</span>
        </Button>

        <Button
          className="rounded-none h-14 flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: colors.secondary,
            color: colors.buttonText,
            fontFamily: font
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
              if (module && module.downloadVCF) {
                module.downloadVCF(businessData);
              }
            }).catch(() => {});
          }}
        >
          <User size={18} className="mb-1" />
          <span className="text-xs">{t("Save Contact")}</span>
        </Button>
      </div>
      
      {/* Navigation Tabs */}
      <div 
        className="flex overflow-x-auto hide-scrollbar" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <TabButton 
          label="Classes" 
          icon={<Dumbbell size={16} />}
          active={activeTab === 'classes'} 
          onClick={() => setActiveTab('classes')} 
          colors={colors}
          font={font}
        />
        <TabButton 
          label="Schedule" 
          icon={<Calendar size={16} />}
          active={activeTab === 'schedule'} 
          onClick={() => setActiveTab('schedule')} 
          colors={colors}
          font={font}
        />
        <TabButton 
          label="Trainers" 
          icon={<Users size={16} />}
          active={activeTab === 'trainers'} 
          onClick={() => setActiveTab('trainers')} 
          colors={colors}
          font={font}
        />
        <TabButton 
          label="Membership" 
          icon={<Award size={16} />}
          active={activeTab === 'membership'} 
          onClick={() => setActiveTab('membership')} 
          colors={colors}
          font={font}
        />
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
  
  const TabButton = ({ label, icon, active, onClick, colors, font }: any) => (
    <button
      className={`px-4 py-3 flex flex-1 flex-col items-center justify-center transition-all duration-200 cursor-pointer ${active ? 'font-bold' : 'font-medium'}`}
      style={{ 
        color: active ? colors.primary : colors.text + '80',
        borderBottom: active ? `3px solid ${colors.primary}` : `3px solid transparent`,
        fontFamily: font,
        backgroundColor: active ? colors.accent : 'transparent'
      }}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );

  const renderAboutSection = (aboutData: any) => {
    const description = aboutData.description || data.description;
    const hasStats = aboutData.year_established || aboutData.members_count;

    if (!description && !hasStats) return null;

    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("About Our Gym")}
          </h2>
        </div>
        
        {description && (
          <p 
            className="text-sm leading-relaxed mb-6" 
            style={{ color: colors.text }}
          >
            {description}
          </p>
        )}
        
        {hasStats && (
          <div
            className="overflow-hidden rounded-lg"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.borderColor}`
            }}
          >
            <div className={aboutData.year_established && aboutData.members_count ? 'grid grid-cols-2' : 'grid grid-cols-1'}>
              {aboutData.year_established && (
                <div
                  className="px-4 py-5 text-center"
                  style={{
                    borderRight: aboutData.members_count ? `1px solid ${colors.borderColor}` : 'none'
                  }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {aboutData.year_established}
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.text + '80' }}
                  >
                    {t("Established")}
                  </p>
                </div>
              )}

              {aboutData.members_count && (
                <div className="px-4 py-5 text-center">
                  <p
                    className="text-2xl font-bold"
                    style={{ color: colors.primary, fontFamily: font }}
                  >
                    {aboutData.members_count}+
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.text + '80' }}
                  >
                    {t("Members")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderClassesSection = (classesData: any) => {
    if (activeTab !== 'classes') return null;
    
    const classes = classesData.class_list || [];
    if (!Array.isArray(classes) || classes.length === 0) return null;
    
    const getLevelBadge = (level: string) => {
      const levels: Record<string, { bg: string, text: string }> = {
        'beginner': { bg: '#E8F5E9', text: '#2E7D32' },
        'intermediate': { bg: '#FFF3E0', text: '#E65100' },
        'advanced': { bg: '#FFEBEE', text: '#C62828' },
        'all': { bg: '#E3F2FD', text: '#1565C0' }
      };
      
      return levels[level] || { bg: colors.accent, text: colors.primary };
    };
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Our Classes")}
          </h2>
        </div>
        
        <div className="space-y-4">
          {classes.map((fitnessClass: any, index: number) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-xl border" 
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {/* Class Image or Placeholder */}
              <div
                className="h-44 overflow-hidden"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
                {fitnessClass.image ? (
                  <img 
                    src={getImageDisplayUrl(fitnessClass.image)} 
                    alt={fitnessClass.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center" 
                    style={{ 
                      backgroundColor: colors.accent,
                      color: colors.primary
                    }}
                  >
                    <Dumbbell size={48} />
                  </div>
                )}
              </div>
              
              {/* Class Details */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 
                    className="text-lg font-bold" 
                    style={{ 
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {fitnessClass.name}
                  </h3>

                  {fitnessClass.duration && (
                    <span 
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap" 
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary
                      }}
                    >
                      <Clock size={12} className="mr-1" />
                      {fitnessClass.duration}
                    </span>
                  )}
                </div>
                
                {fitnessClass.description && (
                  <p 
                    className="mt-2 text-sm leading-relaxed" 
                    style={{ color: colors.text + 'CC' }}
                  >
                    {fitnessClass.description}
                  </p>
                )}

                {fitnessClass.level && (
                  <div className="mt-4">
                    <span 
                      className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize" 
                      style={{ 
                        backgroundColor: getLevelBadge(fitnessClass.level).bg,
                        color: getLevelBadge(fitnessClass.level).text
                      }}
                    >
                      {fitnessClass.level}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScheduleSection = (scheduleData: any) => {
    if (activeTab !== 'schedule') return null;
    
    const scheduleItems = scheduleData.schedule_list || [];
    if (!Array.isArray(scheduleItems) || scheduleItems.length === 0) return null;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Filter schedule items for the active day
    const daySchedule = scheduleItems.filter((item: any) => item.day === activeDay);
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-10" style={{ backgroundColor: colors.primary }} />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Class Schedule")}
          </h2>
        </div>
        
        {/* Day Selector */}
        <div 
          className="flex overflow-x-auto hide-scrollbar mb-4" 
          style={{ scrollbarWidth: 'none' }}
        >
          {days.map((day, index) => (
            <button
              key={day}
              className={`px-3 py-2 mx-1 rounded-full text-sm font-medium flex-shrink-0 transition-all duration-200 cursor-pointer ${activeDay === day ? 'font-bold' : 'font-medium'}`}
              style={{ 
                backgroundColor: activeDay === day ? colors.primary : colors.cardBg,
                color: activeDay === day ? 'white' : colors.text,
                fontFamily: font
              }}
              onClick={() => setActiveDay(day)}
            >
              {dayLabels[index]}
            </button>
          ))}
        </div>
        
        {daySchedule.length > 0 ? (
          <div className="space-y-3">
            {daySchedule.map((item: any, index: number) => (
              <div 
                key={index} 
                className="rounded-xl border p-4 flex items-center" 
                style={{ 
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.borderColor}`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0" 
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.buttonText
                  }}
                >
                  <Clock3 size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 
                      className="text-base font-bold" 
                      style={{ 
                        color: colors.text,
                        fontFamily: font
                      }}
                    >
                      {item.class_name}
                    </h3>
                    
                    <span 
                      className="text-sm font-medium" 
                      style={{ color: colors.primary }}
                    >
                      {item.time}
                    </span>
                  </div>
                  
                  {item.trainer && (
                    <p 
                      className="text-sm flex items-center mt-1" 
                      style={{ color: colors.text + '80' }}
                    >
                      <User size={12} className="mr-1" />
                      {item.trainer}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="rounded-xl border p-4 text-center" 
            style={{ 
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderColor}`
            }}
          >
            <p 
              className="text-sm" 
              style={{ color: colors.text + '80' }}
            >
              {t("No classes scheduled for this day.")}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderTrainersSection = (trainersData: any) => {
    if (activeTab !== 'trainers') return null;
    
    const trainers = trainersData.trainer_list || [];
    if (!Array.isArray(trainers) || trainers.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-10" style={{ backgroundColor: colors.primary }} />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
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
              className="overflow-hidden rounded-xl border" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <div className="flex items-start gap-4 p-4">
                {/* Trainer Image */}
                <div className="h-24 w-24 overflow-hidden rounded-xl flex-shrink-0" style={{ backgroundColor: colors.cardBg }}>
                  {trainer.image ? (
                    <img 
                      src={getImageDisplayUrl(trainer.image)} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center" 
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary
                      }}
                    >
                      <User size={32} />
                    </div>
                  )}
                </div>
                
                {/* Trainer Details */}
                <div className="min-w-0 flex-1">
                  <h3 
                    className="text-base font-bold" 
                    style={{ 
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {trainer.name}
                  </h3>

                  {trainer.position && (
                    <p
                      className="mt-1 text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      {trainer.position}
                    </p>
                  )}

                  {trainer.certifications && (
                    <p
                      className="mt-2 text-xs leading-relaxed"
                      style={{ color: colors.text + '80' }}
                    >
                      {trainer.certifications}
                    </p>
                  )}
                </div>
              </div>

              {trainer.bio && (
                <div className="px-4 pb-4">
                  <p 
                    className="text-sm leading-relaxed" 
                    style={{ color: colors.text + 'CC' }}
                  >
                    {trainer.bio}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMembershipSection = (membershipData: any) => {
    if (activeTab !== 'membership') return null;
    
    const plans = membershipData.plan_list || [];
    if (!Array.isArray(plans) || plans.length === 0) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px w-10" style={{ backgroundColor: colors.primary }} />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Membership Plans")}
          </h2>
        </div>
        
        <div className="space-y-4">
          {plans.map((plan: any, index: number) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-xl border" 
              style={{ 
                backgroundColor: colors.background,
                border: plan.highlight ? `2px solid ${colors.primary}` : `1px solid ${colors.borderColor}`
              }}
            >
              {/* Plan Header */}
              <div 
                className="p-4" 
                style={{ 
                  backgroundColor: plan.highlight ? colors.primary + '12' : colors.cardBg,
                  color: colors.text,
                  borderBottom: `1px solid ${colors.borderColor}`
                }}
              >
                <div className="flex justify-between items-center">
                  <h3 
                    className="text-lg font-bold" 
                    style={{ 
                      color: colors.text,
                      fontFamily: font
                    }}
                  >
                    {plan.name}
                  </h3>
                  
                  {plan.highlight && (
                    <Badge 
                      className="text-xs" 
                      style={{ backgroundColor: colors.primary, color: colors.buttonText }}
                    >
                      {t("Popular")}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-baseline mt-1">
                  <span 
                    className="text-xl font-bold" 
                    style={{ color: colors.primary }}
                  >
                    {plan.price}
                  </span>
                  
                  {plan.duration && (
                    <span 
                      className="text-xs ml-1" 
                      style={{ color: colors.text + '80' }}
                    >
                      {plan.duration}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Plan Details */}
              <div className="p-4">
                {plan.description && (
                  <p 
                    className="text-sm mb-3 leading-relaxed" 
                    style={{ color: colors.text }}
                  >
                    {plan.description}
                  </p>
                )}
                
                {plan.features && (
                  <div className="space-y-2">
                    {plan.features.split(',').map((feature: string, i: number) => (
                      <div 
                        key={i} 
                        className="flex items-center"
                      >
                        <CheckCircle 
                          size={16} 
                          className="mr-2" 
                          style={{ color: colors.primary }}
                        />
                        <span 
                          className="text-sm" 
                          style={{ color: colors.text }}
                        >
                          {feature.trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  className="w-full mt-4 py-4 font-bold"
                  style={{ 
                    backgroundColor: plan.highlight ? colors.primary : colors.secondary,
                    color: colors.buttonText,
                    fontFamily: font
                  }}
                  onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
                >
                  {t("Select Plan")}
                </Button>
              </div>
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
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderTop: `1px solid ${colors.borderColor}`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
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
                    className="overflow-hidden rounded-2xl border" 
                    style={{ 
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.borderColor}`
                    }}
                  >
                    <div className="px-5 py-5">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          {review.image ? (
                            <img 
                              src={getImageDisplayUrl(review.image)} 
                              alt={review.member_name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center" 
                              style={{ 
                                backgroundColor: colors.primary + '18',
                                color: colors.primary
                              }}
                            >
                              <User size={20} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 
                              className="text-base font-bold leading-tight" 
                              style={{ 
                                color: colors.text,
                                fontFamily: font
                              }}
                            >
                              {review.member_name}
                            </h3>

                            {review.achievement && (
                              <span
                                className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: colors.primary + '12',
                                  color: colors.primary,
                                  fontFamily: font
                                }}
                              >
                                {review.achievement}
                              </span>
                            )}
                          </div>

                          {review.member_since && (
                            <p
                              className="mt-1 text-xs"
                              style={{ color: colors.text + '80', fontFamily: font }}
                            >
                              {t("Member since")} {review.member_since}
                            </p>
                          )}
                        </div>
                      </div>

                      <p 
                        className="mt-4 text-sm leading-relaxed" 
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        "{(review.review || '').replace(/[<>"'&]/g, '')}"
                      </p>
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
                  className="w-2.5 h-2.5 rounded-full transition-colors cursor-pointer"
                  style={{ 
                    backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '33'
                  }}
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

    const videos = videosData.video_list || [];
    if (!Array.isArray(videos) || videos.length === 0) return null;
    
    // Process video content
    const videoContent = React.useMemo(() => {
      return videos.map((video: any, index: number) => {
        // If it's an iframe, skip processing and use raw content
        if (video?.embed_url && video.embed_url.includes('<iframe')) {
          return {
            ...video,
            key: `video-${index}-${video?.title || ''}-${video?.embed_url?.substring(0, 20) || ''}`
          };
        }
        
        const videoData = video.embed_url ? extractVideoUrl(video.embed_url) : null;
        return {
          ...video,
          videoData,
          key: `video-${index}-${video.title || ''}-${video.embed_url || ''}`
        };
      });
    }, [videos]);
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}18 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
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
              className="overflow-hidden rounded-xl border" 
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div 
                className="relative"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
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
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-base" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h4>
                  {video.difficulty_level && (
                    <span 
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" 
                      style={{ 
                        backgroundColor: colors.accent,
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {video.difficulty_level.toUpperCase()}
                    </span>
                  )}
                </div>
                {video.description && (
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {video.video_type && (
                    <span 
                      className="inline-flex rounded-full px-2.5 py-1 text-xs capitalize font-medium" 
                      style={{ 
                        backgroundColor: colors.primary + '14',
                        color: colors.primary,
                        fontFamily: font
                      }}
                    >
                      {video.video_type.replace('_', ' ')}
                    </span>
                  )}
                  {video.duration && (
                    <Badge
                      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: colors.primary + '14',
                        color: colors.primary,
                        border: `1px solid ${colors.borderColor}`,
                        fontFamily: font
                      }}
                    >
                      <Clock size={12} className="mr-1" />
                      {video.duration}
                    </Badge>
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
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}14 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("YouTube Channel")}
          </h2>
        </div>
        
        <div className="space-y-4">
          {youtubeData.latest_video_embed && (
            <div
              className="overflow-hidden rounded-xl border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div
                className="px-4 py-3"
                style={{ borderBottom: `1px solid ${colors.borderColor}` }}
              >
                <h4 className="font-bold text-sm flex items-center" style={{ color: colors.text, fontFamily: font }}>
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

          <div 
            className="rounded-xl border p-4" 
            style={{ 
              backgroundColor: colors.background,
              borderColor: colors.borderColor,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 flex-shrink-0">
                <Youtube className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-base" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Gym Channel'}
                </h4>
                {youtubeData.subscriber_count && (
                  <p className="mt-1 text-sm" style={{ color: colors.text + '99', fontFamily: font }}>
                    {youtubeData.subscriber_count} {t("subscribers")}
                  </p>
                )}
              </div>
            </div>
            
            {youtubeData.channel_description && (
              <p className="mt-4 text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}
            
            <div className="mt-4 space-y-3">
              {youtubeData.channel_url && (
                <Button 
                  className="w-full py-4 font-bold" 
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: 'white',
                    fontFamily: font 
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="w-5 h-5 mr-2" />
                  {t("Subscribe to Channel")}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button 
                  variant="outline" 
                  className="w-full py-4 font-bold" 
                  style={{ 
                    borderColor: colors.primary, 
                    color: colors.primary, 
                    fontFamily: font,
                    backgroundColor: colors.background
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {t("Workout Playlist")}
                </Button>
              )}
            </div>
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
          backgroundColor: colors.background,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
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
              className="overflow-hidden rounded-xl border"
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor
              }}
            >
              <div className="aspect-square overflow-hidden">
                {photo.image ? (
                  <img 
                    src={getImageDisplayUrl(photo.image)} 
                    alt={photo.caption || `Gallery image ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center" 
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Camera size={24} style={{ color: colors.primary }} />
                  </div>
                )}
              </div>
              
              {photo.caption && (
                <div 
                  className="px-3 py-2 text-sm"
                  style={{ 
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderTop: `1px solid ${colors.borderColor}`
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

  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    
    // Get current day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Gym Hours")}
          </h2>
        </div>
        
        <div 
          className="overflow-hidden rounded-xl border" 
          style={{ 
            backgroundColor: colors.background,
            borderColor: colors.borderColor,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          {hours.map((hour: any, index: number) => (
            <div 
              key={index} 
              className="flex items-center justify-between px-4 py-3"
              style={{ 
                backgroundColor: hour.day === currentDay ? colors.accent : colors.background,
                borderBottom: index < hours.length - 1 ? `1px solid ${colors.borderColor}` : 'none'
              }}
            >
              <div className="flex items-center">
                <span 
                  className="capitalize text-sm font-bold" 
                  style={{ 
                    color: hour.day === currentDay ? colors.primary : colors.text
                  }}
                >
                  {t(hour.day)}
                </span>
                
                {hour.day === currentDay && (
                  <Badge 
                    className="ml-2 text-xs" 
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.buttonText
                    }}
                  >
                    {t("Today")}
                  </Badge>
                )}
              </div>
              
              <span 
                className="text-sm" 
                style={{ 
                  color: hour.is_closed ? colors.text + '80' : colors.text,
                  fontWeight: hour.day === currentDay ? 'bold' : 'normal'
                }}
              >
                {hour.is_closed ? 'Closed' : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}14 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Contact Us")}
          </h2>
        </div>
        
        <div className="space-y-3 mb-6">
          {(contactData.phone || data.phone) && (
            <a 
              href={`tel:${contactData.phone || data.phone}`} 
              className="flex items-center rounded-xl border p-4" 
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div 
                className="mr-4 flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0" 
                style={{ 
                  backgroundColor: colors.primary + '14',
                  color: colors.primary
                }}
              >
                <Phone size={18} />
              </div>
              <div>
                <p 
                  className="text-xs" 
                  style={{ color: colors.text + '80' }}
                >
                  {t("PHONE")}
                </p>
                <p 
                  className="text-sm font-medium" 
                  style={{ color: colors.text }}
                >
                  {contactData.phone || data.phone}
                </p>
              </div>
            </a>
          )}
          
          {(contactData.email || data.email) && (
            <a 
              href={`mailto:${contactData.email || data.email}`} 
              className="flex items-center rounded-xl border p-4" 
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div 
                className="mr-4 flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0" 
                style={{ 
                  backgroundColor: colors.primary + '14',
                  color: colors.primary
                }}
              >
                <Mail size={18} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p 
                  className="text-xs" 
                  style={{ color: colors.text + '80' }}
                >
                  {t("EMAIL")}
                </p>
                <p 
                  className="text-sm font-medium truncate" 
                  style={{ color: colors.text }}
                >
                  {contactData.email || data.email}
                </p>
              </div>
            </a>
          )}
          
          {contactData.address && (
            <div 
              className="flex items-center rounded-xl border p-4" 
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div 
                className="mr-4 flex h-11 w-11 items-center justify-center rounded-full flex-shrink-0" 
                style={{ 
                  backgroundColor: colors.primary + '14',
                  color: colors.primary
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <p 
                  className="text-xs" 
                  style={{ color: colors.text + '80' }}
                >
                  {t("ADDRESS")}
                </p>
                <p 
                  className="text-sm" 
                  style={{ color: colors.text }}
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
                    {t("Get Directions")}
                    <ChevronRight size={12} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {configSections.action_buttons?.contact_button_text && (
            <Button
              className="w-full py-4 font-bold"
              style={{ 
                backgroundColor: colors.primary,
                color: colors.buttonText,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {configSections.action_buttons.contact_button_text}
            </Button>
          )}
          
          {configSections.action_buttons?.save_contact_button_text && (
            <Button
              variant="outline"
              className="w-full py-4 font-bold"
              style={{ 
                borderColor: colors.primary, 
                color: colors.primary, 
                fontFamily: font,
                backgroundColor: colors.background
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
              <User className="w-4 h-4 mr-2" />
              {configSections.action_buttons.save_contact_button_text}
            </Button>
          )}
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
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
                        <div className="mb-5 flex items-center gap-3">
                          <div
                            className="h-px w-10"
                            style={{ backgroundColor: colors.primary }}
                          />
                          <h2 
                            className="text-xl font-bold" 
                            style={{ 
                              color: colors.text,
                              fontFamily: font
                            }}
                          >
                            {t("Follow Us")}
                          </h2>
                        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {socialLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-lg border transition-transform hover:scale-105"
              style={{ 
                backgroundColor: colors.background,
                borderColor: colors.borderColor,
                color: colors.primary,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <SocialIcon platform={link.platform} color="currentColor" />
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
        className="px-5 py-5" 
        style={{ backgroundColor: colors.secondary, borderTop: `1px solid ${colors.borderColor}` }}
      >
        <p 
          className="text-xs text-center leading-relaxed" 
          style={{ color: '#FFFFFF', fontFamily: font }}
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
      case 'classes':
        return renderClassesSection(sectionData);
      case 'trainers':
        return renderTrainersSection(sectionData);
      case 'membership':
        return renderMembershipSection(sectionData);
      case 'schedule':
        return renderScheduleSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
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
      case 'app_download':
        return renderAppDownloadSection(sectionData);
      case 'contact_form':
        return renderContactFormSection(sectionData);
      case 'custom_html':
        return renderCustomHtmlSection(sectionData);
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'google_map':
        return renderLocationSection(sectionData);
      case 'thank_you':
        return renderThankYouSection(sectionData);
      case 'action_buttons':
        return null;
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };
  
  const renderAppDownloadSection = (appData: any) => {
    if (!appData.app_store_url && !appData.play_store_url) return null;
    return (
      <div
        className="px-5 py-6"
        style={{
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 className="text-xl font-bold" style={{ color: colors.text, fontFamily: font }}>
            {t("Download Our App")}
          </h2>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.borderColor
          }}
        >
          {appData.app_description && <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text }}>{appData.app_description}</p>}
          <div className="grid grid-cols-2 gap-3">
            {appData.app_store_url && (
              <Button
                variant="outline"
                className="py-4 font-bold"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font, backgroundColor: colors.background }}
                onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, "_blank", "noopener,noreferrer")}
              >
                {t("App Store")}
              </Button>
            )}
            {appData.play_store_url && (
              <Button
                variant="outline"
                className="py-4 font-bold"
                style={{ borderColor: colors.primary, color: colors.primary, fontFamily: font, backgroundColor: colors.background }}
                onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, "_blank", "noopener,noreferrer")}
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
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 className="text-xl font-bold" style={{ color: colors.text, fontFamily: font }}>
            {formData.form_title}
          </h2>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.borderColor
          }}
        >
          {formData.form_description && <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text }}>{formData.form_description}</p>}
          <Button className="w-full py-4 font-bold" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
            <MessageSquare className="w-4 h-4 mr-2" />{t("Send Message")}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div
        className="px-5 py-6"
        style={{
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2
            className="text-xl font-bold"
            style={{ color: colors.text, fontFamily: font }}
          >
            {t("Location")}
          </h2>
        </div>
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <div
              className="overflow-hidden rounded-xl border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.borderColor
              }}
            >
              <GymMapEmbed embedHtml={locationData.map_embed_url} />
            </div>
          )}
          
          {locationData.directions_url && (
            <Button
              className="w-full py-4 font-bold"
              style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }}
              onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, "_blank", "noopener,noreferrer")}
            >
              <MapPin className="w-4 h-4 mr-2" />{t("Get Directions")}
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div 
        className="px-5 py-6" 
        style={{ 
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="mb-5 flex items-center gap-3">
            <div
              className="h-px w-10"
              style={{ backgroundColor: colors.primary }}
            />
            <h2 
              className="text-xl font-bold" 
              style={{ 
                color: colors.text,
                fontFamily: font
              }}
            >
              {customHtmlData.section_title}
            </h2>
          </div>
        )}
        <div 
          className="custom-html-content rounded-xl border p-4" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
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
                font-weight: bold;
              }
              .custom-html-content p {
                color: ${colors.text};
                margin-bottom: 0.5rem;
                font-family: ${font};
              }
              .custom-html-content a {
                color: ${colors.primary};
                text-decoration: underline;
                font-weight: bold;
              }
              .custom-html-content ul, .custom-html-content ol {
                color: ${colors.text};
                padding-left: 1rem;
                font-family: ${font};
              }
              .custom-html-content code {
                background-color: ${colors.accent};
                color: ${colors.primary};
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                font-family: 'Courier New', monospace;
                font-weight: bold;
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
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-px w-10"
            style={{ backgroundColor: colors.primary }}
          />
          <h2 
            className="text-xl font-bold" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {t("Share Our Gym")}
          </h2>
        </div>
        <div 
          className="rounded-xl border p-4 text-center" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`
          }}
        >
          {qrData.qr_title && (
            <h4 className="font-bold text-base mb-2" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_title}
            </h4>
          )}
          
          {qrData.qr_description && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
              {qrData.qr_description}
            </p>
          )}
          
          <Button 
            className="w-full py-4 font-bold" 
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
        className="px-5 py-6"
        style={{
          background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.accent}12 100%)`,
          borderBottom: `1px solid ${colors.borderColor}`
        }}
      >
        <div
          className="rounded-xl border p-4 text-center"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.borderColor
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: colors.text + 'CC', fontFamily: font }}>
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
      <div className="p-5 space-y-3" style={{ backgroundColor: colors.cardBg }}>
        {hasContactButton && (
          <Button
            className="w-full h-12 font-bold"
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

        {hasSaveContactButton && (
          <Button
            variant="outline"
            className="w-full"
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
            <User className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
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
