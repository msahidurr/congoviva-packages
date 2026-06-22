import { handleAppointmentBooking } from '../VCardPreview';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { Mail, Phone, Globe, MapPin, Calendar, UserPlus, Briefcase, Star, User, Download, QrCode, Heart, Eye, TrendingUp, Users, Award, Camera, Video, Share2 } from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';

interface InfluencerTemplateProps {
  data: any;
  template: any;
}

export default function InfluencerTemplate({ data, template }: InfluencerTemplateProps) {
  const { t, i18n } = useTranslation();
  const templateSections = template?.defaultData || {};
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);
  
  // Content rotation state
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

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

  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#E1306C', 
    secondary: '#F77737', 
    accent: '#FCAF45', 
    background: '#FAFAFA', 
    text: '#262626',
    cardBg: '#FFFFFF',
    gradient: 'linear-gradient(45deg, #E1306C, #F77737, #FCAF45)'
  };
  
  const font = React.useMemo(() => configSections.font || template?.defaultFont || 'Poppins, sans-serif', [configSections.font, template?.defaultFont]);

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const fontString = typeof font === 'string' ? font : 'Poppins, sans-serif';
    const fontFamily = fontString.split(',')[0].trim().replace(/[\"\\']/g, '');
    
    if (fontFamily && fontFamily !== 'Arial' && fontFamily !== 'sans-serif' && fontFamily !== 'serif') {
      const linkId = `google-font-${fontFamily.replace(/\\s+/g, '-')}`;
      
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [font]);

  // Testimonial rotation effect
  React.useEffect(() => {
    const testimonialsData = configSections.testimonials;
    const reviews = testimonialsData?.reviews || [];
    if (!Array.isArray(reviews) || reviews.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [configSections.testimonials?.reviews]);

  // Get all sections for this business type
  const allSections = getBusinessTemplate('influencer')?.sections || [];

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
      case 'stats':
        return renderStatsSection(sectionData);
      case 'collaborations':
        return renderCollaborationsSection(sectionData);
      case 'services':
        return renderServicesSection(sectionData);
      case 'social':
        return renderSocialSection(sectionData);
      case 'media_kit':
        return renderMediaKitSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'booking':
        return renderBookingSection(sectionData);
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
    <div className="relative rounded-t-2xl overflow-hidden" style={{ background: colors.gradient || colors.primary }}>
      {/* Cute Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-8 right-12 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-20 left-16 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-16 right-20 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-24 left-12 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }}></div>
        
        {/* Sparkle Stars */}
        <div className="absolute top-12 left-8 text-white/30 text-2xl animate-pulse" style={{ animationDuration: '2s' }}>✨</div>
        <div className="absolute top-32 right-8 text-white/30 text-xl animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-20 left-20 text-white/30 text-lg animate-pulse" style={{ animationDuration: '3s', animationDelay: '1s' }}>💫</div>
        <div className="absolute bottom-32 right-16 text-white/30 text-2xl animate-pulse" style={{ animationDuration: '2.2s', animationDelay: '0.8s' }}>✨</div>
      </div>

      <div className="px-6 py-8 relative">
        {/* Language Selector */}
        {(configSections?.language && configSections?.language?.enable_language_switcher) && (
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <div className="relative z-30">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="cursor-pointer flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors bg-white bg-opacity-90 border border-white border-opacity-50 text-black hover:bg-opacity-100 font-medium"
              >
                <Globe className="w-3 h-3" />
                <span>{languageData.find(lang => lang.code === currentLanguage)?.name || 'EN'}</span>
              </button>

              {showLanguageSelector && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLanguageSelector(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border py-2 min-w-[160px] max-h-48 overflow-y-auto z-50">
                    {languageData.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${currentLanguage === lang.code ? 'bg-pink-50 text-pink-600' : 'text-gray-700'}`}
                      >
                        <span className="text-base">{String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Center Profile Image */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden mb-4" style={{ backgroundColor: colors.cardBg }}>
            {headerData.profile_image ? (
              <img src={getImageDisplayUrl(headerData.profile_image)} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12" style={{ color: colors.primary }} />
            )}
          </div>
          
          {/* Name */}
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: font }}>
            {headerData.name || data.name || ''}
          </h1>
          
          {/* Title */}
          <p className="text-white text-sm font-medium mb-2" style={{ fontFamily: font }}>
            {headerData.title || ''}
          </p>
          
          {/* Tagline */}
          {headerData.tagline && (
            <p className="text-black text-xs leading-relaxed bg-white bg-opacity-90 rounded-lg p-2 font-medium max-w-xs" style={{ fontFamily: font }}>
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContactSection = (contactData: any) => (
    <div className="px-6 py-3" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
      <div className="flex flex-wrap justify-center gap-4">
        {(contactData.email || data.email) && (
          <a
            href={`mailto:${contactData.email || data.email}`}
            className="cursor-pointer group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-100" style={{ backgroundColor: colors.primary }}>
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold transition-all duration-300" style={{ color: colors.text, fontFamily: font }}>
              {t('Email')}
            </span>
          </a>
        )}
        {(contactData.phone || data.phone) && (
          <a
            href={`tel:${contactData.phone || data.phone}`}
            className="cursor-pointer group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-100" style={{ backgroundColor: colors.secondary }}>
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold transition-all duration-300" style={{ color: colors.text, fontFamily: font }}>
              {t('Call')}
            </span>
          </a>
        )}
        {(contactData.website || data.website) && (
          <a
            href={contactData.website || data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-100" style={{ backgroundColor: colors.accent }}>
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold transition-all duration-300" style={{ color: colors.text, fontFamily: font }}>
              {t('Website')}
            </span>
          </a>
        )}
        {contactData.location && (
          <div className="cursor-pointer group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110">
            <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-100" style={{ backgroundColor: colors.primary }}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold transition-all duration-300" style={{ color: colors.text, fontFamily: font }}>
              {t('Location')}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;
    return (
      <div className="px-6 py-3" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-3 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Heart className="w-5 h-5 mr-2" />
          {t('About Me')}
        </h3>
        <p className="text-sm leading-relaxed mb-3" style={{ color: colors.text, fontFamily: font }}>
          {aboutData.description || data.description}
        </p>

        {aboutData.niches && (
          <div className="mb-3">
            <p className="text-sm leading-relaxed font-semibold mb-2" style={{ color: colors.secondary, fontFamily: font }}>{t('Content Niches')}:</p>
            <div className="flex flex-wrap gap-2">
              {aboutData.niches.split(',').map((niche: string, index: number) => (
                <Badge key={index} className="text-xs rounded-full px-3 py-1" style={{ backgroundColor: colors.primary, color: 'white' }}>
                  {niche.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {aboutData.experience && (
          <div className="text-center p-3 rounded-xl" style={{ backgroundColor: colors.primary + '10' }}>
            <p className="text-2xl font-bold" style={{ color: colors.primary, fontFamily: font }}>{aboutData.experience}+</p>
            <p className="text-xs" style={{ color: colors.text, fontFamily: font }}>{t('Years Creating Content')}</p>
          </div>
        )}
      </div>
    );
  };

  const renderStatsSection = (statsData: any) => {
    const platformStats = statsData.platform_stats || [];
    if (!Array.isArray(platformStats) || platformStats.length === 0) return null;
    
    return (
      <div className="px-6 py-3" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-3 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <TrendingUp className="w-5 h-5 mr-2" />
          {t('Platform Stats')}
        </h3>
        <div className="space-y-2.5">
          {platformStats.map((stat: any, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden" style={{ border: `2px solid ${colors.primary}20`, backgroundColor: colors.cardBg }}>
              <div className="px-4 py-2.5 flex items-center justify-center gap-2" style={{ background: colors.gradient }}>
                <Users className="w-4 h-4" style={{ color: colors.primary }}/>
                <span className="font-semibold text-base capitalize" style={{ fontFamily: font, color: colors.primary }}>{stat.platform}</span> 
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-center flex flex-col items-center justify-center px-2">
                  <p className="text-xl font-bold mb-1" style={{ color: colors.primary, fontFamily: font }}>{stat.followers}</p>
                  <p className="text-xs font-medium" style={{ color: colors.text + 'AA', fontFamily: font }}>{t('Followers')}</p>
                </div>
                <div className="text-center flex flex-col items-center justify-center px-2" style={{ borderLeft: `1px solid ${colors.primary}15`, borderRight: `1px solid ${colors.primary}15` }}>
                  <p className="text-xl font-bold mb-1" style={{ color: colors.secondary, fontFamily: font }}>{stat.engagement_rate}</p>
                  <p className="text-xs font-medium" style={{ color: colors.text + 'AA', fontFamily: font }}>{t('Engagement')}</p>
                </div>
                <div className="text-center flex flex-col items-center justify-center px-2">
                  <p className="text-xl font-bold mb-1" style={{ color: colors.accent, fontFamily: font }}>{stat.monthly_views}</p>
                  <p className="text-xs font-medium" style={{ color: colors.text + 'AA', fontFamily: font }}>{t('Monthly Views')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCollaborationsSection = (collaborationsData: any) => {
    const brandList = collaborationsData.brand_list || [];
    if (!Array.isArray(brandList) || brandList.length === 0) return null;

    const formatCampaignType = (campaignType?: string) =>
      campaignType
        ? campaignType
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : '';
    
    return (
      <div className="px-6 py-3" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-3 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Award className="w-5 h-5 mr-2" />
          {t('Brand Collaborations')}
        </h3>
        <div className="space-y-3">
          {brandList.slice(0, 3).map((brand: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-4"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}14, ${colors.secondary}12)`,
                border: `1px solid ${colors.primary}18`,
                boxShadow: `0 10px 24px ${colors.primary}08`
              }}
            >
              <div className="flex items-start gap-3">
                {brand.brand_logo ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden" style={{ backgroundColor: `${colors.primary}08` }}>
                    <img src={getImageDisplayUrl(brand.brand_logo)} alt={brand.brand_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}10` }}>
                    <Award className="w-6 h-6" style={{ color: colors.primary }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-semibold text-[17px] leading-tight mb-1"
                    style={{
                      color: colors.text,
                      fontFamily: font,
                    }}
                  >
                    {brand.brand_name}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: colors.text + 'B8',
                      fontFamily: font,
                    }}
                  >
                    {brand.description}
                  </p>
                </div>
              </div>

              {(brand.results || brand.campaign_url || brand.campaign_type) && (
                <div className="mt-3 pt-2.5 space-y-2" style={{ borderTop: `1px solid ${colors.primary}10` }}>
                  {brand.results && (
                    <div
                      className="flex items-start gap-2 px-1 py-1"
                    >
                      <TrendingUp className="w-4 h-4 mt-0.5" style={{ color: colors.primary }} />
                      <span
                        className="text-sm font-medium leading-relaxed"
                        style={{
                          color: colors.text,
                          fontFamily: font,
                        }}
                      >
                        {brand.results}
                      </span>
                    </div>
                  )}

                  {(brand.campaign_type || brand.campaign_url) && (
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      {brand.campaign_type ? (
                        <span
                          className="inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primary}16, ${colors.secondary}20)`,
                            color: colors.primary,
                            fontFamily: font,
                            border: `1px solid ${colors.primary}14`
                          }}
                        >
                          {formatCampaignType(brand.campaign_type)}
                        </span>
                      ) : null}

                      {brand.campaign_url && (
                        <a
                          href={brand.campaign_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold"
                          style={{
                            color: colors.primary,
                            fontFamily: font,
                            background: `linear-gradient(135deg, ${colors.primary}16, ${colors.secondary}20)`,
                            border: `1px solid ${colors.secondary}1F`
                          }}
                        >
                          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{t('View Campaign')}</span>
                        </a>
                      )}
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

  const renderServicesSection = (servicesData: any) => {
    const services = servicesData.service_list || [];
    if (!Array.isArray(services) || services.length === 0) return null;
    
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Briefcase className="w-5 h-5 mr-2" />
          {t('Services')}
        </h3>
        <div className="space-y-4">
          {services.map((service: any, index: number) => (
            <div key={index} className="p-4 rounded-xl" style={{
              background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
              border: `1px solid ${colors.primary}20`
            }}>
              <div className="mb-2">
                <h4 className="font-semibold" style={{ color: colors.text, fontFamily: font }}>{service.title}</h4>
              </div>
              <p className="text-sm mb-2" style={{ color: colors.text + 'CC', fontFamily: font }}>{service.description}</p>
              {service.price && (
                <span className="block text-sm font-bold" style={{ color: colors.primary, fontFamily: font }}>
                  {service.price}
                </span>
              )}
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Share2 className="w-5 h-5 mr-2" />
          {t('Follow Me')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((link: any, index: number) => (
            <Button
              key={index}
              size="sm"
              className="justify-between p-4 h-auto rounded-xl"
              style={{ 
                backgroundColor: colors.background,
                color: colors.text,
                border: `2px solid ${colors.primary}20`,
                fontFamily: font
              }}
              onClick={() => link.url && typeof window !== "undefined" && window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: colors.gradient || `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                >
                  <SocialIcon platform={link.platform} color="white" />
                </div>
                <span className="text-xs font-medium capitalize truncate" style={{ color: colors.text, fontFamily: font }}>
                  {link.platform}
                </span>
              </div>
              {link.follower_count && (
                <span className="text-xs font-bold" style={{ color: colors.primary, fontFamily: font }}>
                  {link.follower_count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderMediaKitSection = (mediaKitData: any) => {
    if (!mediaKitData.media_kit_url && !mediaKitData.rate_card_url && !mediaKitData.portfolio_url) return null;
    
    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Download className="w-5 h-5 mr-2" />
          {t('Media Kit')}
        </h3>
        <div className="space-y-3">
          {mediaKitData.media_kit_url && (
            <Button
              size="sm"
              className="w-full justify-center rounded-lg h-10 px-4 shadow-none font-semibold text-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                color: 'white',
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(mediaKitData.media_kit_url, '_blank', 'noopener,noreferrer')}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('Download Media Kit')}
            </Button>
          )}
          {mediaKitData.rate_card_url && (
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center rounded-lg h-10 px-4 shadow-none font-semibold text-center"
              style={{
                backgroundColor: `${colors.secondary}10`,
                borderColor: `${colors.secondary}22`,
                color: colors.secondary,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(mediaKitData.rate_card_url, '_blank', 'noopener,noreferrer')}
            >
              <Award className="w-4 h-4 mr-2" />
              {t('View Rate Card')}
            </Button>
          )}
          {mediaKitData.portfolio_url && (
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center rounded-lg h-10 px-4 shadow-none font-semibold text-center"
              style={{
                backgroundColor: `${colors.accent}12`,
                borderColor: `${colors.accent}24`,
                color: colors.accent,
                fontFamily: font
              }}
              onClick={() => typeof window !== "undefined" && window.open(mediaKitData.portfolio_url, '_blank', 'noopener,noreferrer')}
            >
              <Globe className="w-4 h-4 mr-2" />
              {t('View Portfolio')}
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    
    if (!Array.isArray(reviews) || reviews.length === 0) return null;

    const currentReview = reviews[currentTestimonial] || reviews[0];

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Star className="w-5 h-5 mr-2" />
          {t('Client Love')}
        </h3>

        <div className="relative">
          <div
            className="rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`,
              border: `1px solid ${colors.primary}20`
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-bold min-w-0 truncate" style={{ color: colors.text, fontFamily: font }}>
                {currentReview.brand_name}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < parseInt(currentReview.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <p
              className="text-sm leading-7 mb-3"
              style={{ color: colors.text, fontFamily: font }}
            >
              "{currentReview.review}"
            </p>

            <div className="pt-3" style={{ borderTop: `1px solid ${colors.primary}14` }}>
              {currentReview.campaign_type ? (
                <Badge
                  className="text-xs border-0 rounded-full px-3 py-1"
                  style={{
                    backgroundColor: colors.primary + '20',
                    color: colors.primary,
                    fontFamily: font,
                  }}
                >
                  {currentReview.campaign_type}
                </Badge>
              ) : (
                <span className="text-xs font-semibold" style={{ color: colors.primary, fontFamily: font }}>
                  {t('Verified collaboration')}
                </span>
              )}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center mt-3 space-x-2">
              {reviews.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full transition-all cursor-pointer"
                  style={{ backgroundColor: index === currentTestimonial ? colors.primary : colors.primary + '40' }}
                  onClick={() => setCurrentTestimonial(index)}
                  />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBookingSection = (bookingData: any) => {
    if (!bookingData.booking_url && !bookingData.contact_form_url && !bookingData.response_time) return null;

    return (
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <Calendar className="w-5 h-5 mr-2" />
          {t('Book Collaboration')}
        </h3>
        <div
          className="rounded-2xl p-4 space-y-3"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}08)`,
            border: `1px solid ${colors.primary}18`
          }}
        >
          {bookingData.response_time && (
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.cardBg }}
              >
                <span className="text-sm">⚡</span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold"
                  style={{ color: colors.primary, fontFamily: font }}
                >
                  {t('Response time')}
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>
                  {bookingData.response_time}
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            {bookingData.booking_url && (
              <Button
                size="sm"
                className="h-11 rounded-xl shadow-none font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(bookingData.booking_url, '_blank', 'noopener,noreferrer')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {t('Schedule Meeting')}
              </Button>
            )}

            {bookingData.contact_form_url && (
              <Button
                size="sm"
                variant="outline"
                className="h-11 rounded-xl shadow-none font-semibold"
                style={{
                  backgroundColor: `${colors.secondary}10`,
                  borderColor: `${colors.secondary}22`,
                  color: colors.secondary,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.open(bookingData.contact_form_url, '_blank', 'noopener,noreferrer')}
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('Contact Form')}
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.primary}20`,
          }}
        >
          <h3 className="font-bold text-lg mb-2" style={{ color: colors.primary, fontFamily: font }}>
            {formData.form_title}
          </h3>
          {formData.form_description && (
            <p className="text-sm leading-6 mb-4" style={{ color: colors.text, fontFamily: font }}>
              {formData.form_description}
            </p>
          )}
          <Button
            size="sm"
            className="w-full"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        {customHtmlData.show_title && customHtmlData.section_title && (
          <div className="mb-4">
            <h3 className="font-bold text-lg" style={{ color: colors.primary, fontFamily: font }}>
              {customHtmlData.section_title}
            </h3>
            <div
              className="w-12 h-0.5 rounded-full mt-1.5"
              style={{ backgroundColor: colors.primary + '30' }}
            />
          </div>
        )}
        <div
          className="custom-html-content p-4 rounded-xl"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.primary}20`,
            fontFamily: font,
            color: colors.text
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
      <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.primary}20` }}>
        <h3 className="font-bold text-lg mb-4 flex items-center" style={{ color: colors.primary, fontFamily: font }}>
          <QrCode className="w-5 h-5 mr-2" />
          {qrData.qr_title || t('Connect With Me')}
        </h3>
        <div
          className="rounded-2xl p-5"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.primary}20`,
          }}
        >
          <div className="mb-4">
            <p className="text-sm font-semibold mb-1" style={{ color: colors.text, fontFamily: font }}>
              {qrData.qr_title || t('Connect With Me')}
            </p>
            {qrData.qr_description && (
              <p className="text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                {qrData.qr_description}
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="w-full"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
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
      <div className="px-6 py-4">
        <p
          className="text-sm text-center font-medium leading-relaxed"
          style={{ color: colors.primary, fontFamily: font }}
        >
          {thankYouData.message}
        </p>
      </div>
    );
  };

  const renderActionButtonsSection = (actionData: any) => {
    const hasContactButton = actionData.contact_button_text;
    const hasCollaborationButton = actionData.collaboration_button_text;
    const hasSaveContactButton = actionData.save_contact_button_text;

    if (!hasContactButton && !hasCollaborationButton && !hasSaveContactButton) return null;

    return (
      <div className="px-6 py-4 space-y-2.5" style={{ background: `linear-gradient(to bottom, ${colors.background}, ${colors.primary}05)` }}>
        {hasContactButton && (
          <Button
            className="w-full h-10 font-semibold rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
              fontFamily: font,
              boxShadow: `0 8px 18px ${colors.primary}20`
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <Mail className="w-4 h-4 mr-2" />
            {actionData.contact_button_text}
          </Button>
        )}

        {hasCollaborationButton && (
          <Button
            className="w-full h-10 font-semibold rounded-xl"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.primary}30`,
              color: colors.primary,
              fontFamily: font
            }}
            onClick={() => handleAppointmentBooking(configSections.booking)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {actionData.collaboration_button_text}
          </Button>
        )}

        {hasSaveContactButton && (
          <Button
            size="sm"
            className="w-full h-10 flex items-center justify-center rounded-xl font-semibold"
            style={{
              backgroundColor: colors.primary + '08',
              border: `1px solid ${colors.primary}20`,
              color: colors.primary,
              fontFamily: font
            }}
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
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {actionData.save_contact_button_text}
          </Button>
        )}
      </div>
    );
  };

  const copyrightSection = configSections.copyright;

  // Get ordered sections using the utility function
  const orderedSectionKeys = getSectionOrder(data.template_config || { sections: configSections, sectionSettings: configSections }, allSections)
    .filter(key => key !== 'colors' && key !== 'font' && key !== 'copyright');

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{
      fontFamily: font,
      backgroundColor: colors.background,
      border: `2px solid ${colors.primary}20`,
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      {orderedSectionKeys.map((sectionKey) => (
        <React.Fragment key={sectionKey}>
          {renderSection(sectionKey)}
        </React.Fragment>
      ))}

      {copyrightSection && copyrightSection.text && (
        <div className="px-6 pb-4 pt-2">
          <p className="text-sm text-center" style={{ color: colors.text + '60', fontFamily: font }}>
            {copyrightSection.text}
          </p>
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
