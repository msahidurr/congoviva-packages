import { handleAppointmentBooking } from '../VCardPreview';
import React from 'react';
import StableHtmlContent from '@/components/StableHtmlContent';
import { VideoEmbed, extractVideoUrl } from '@/components/VideoEmbed';
import { createYouTubeEmbedRef } from '@/utils/youtubeEmbedUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ensureRequiredSections } from '@/utils/ensureRequiredSections';
import { useTranslation } from 'react-i18next';
import { sanitizeVideoData, sanitizePath } from '@/utils/secureVideoUtils';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
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
  ShoppingBag,
  Package,
  RefreshCw,
  ShieldCheck,
  HeadphonesIcon,
  Award,
  Truck,
  Facebook,
  Instagram,
  Twitter,
  User,
  Video,
  Play,
  Youtube,
  QrCode,
  Globe2
} from 'lucide-react';
import SocialIcon from '../../../link-bio-builder/components/SocialIcon';
import { QRShareModal } from '@/components/QRShareModal';
import { getSectionOrder } from '@/utils/sectionHelpers';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface EcommerceTemplateProps {
  data: any;
  template: any;
}

const EcommerceMapEmbed = React.memo(function EcommerceMapEmbed({ embedHtml }: { embedHtml: string }) {
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

function EcommerceTemplate({ data, template }: EcommerceTemplateProps) {
  const { t, i18n } = useTranslation();
  
  // Get all sections for this business type
  const templateSections = template?.defaultData || {};
  
  // Ensure all required sections are available
  const configSections = ensureRequiredSections(data.config_sections || {}, templateSections);

  // Testimonials state (moved to component level)
  const [currentReview, setCurrentReview] = React.useState(0);
  
  // Effect for testimonials rotation (moved to component level)
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
  

  
  const colors = configSections.colors || template?.defaultColors || { 
    primary: '#4A6CF7', 
    secondary: '#6E82FE', 
    accent: '#EEF1FF', 
    background: '#FFFFFF', 
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    saleColor: '#E53935',
    starColor: '#FFC107'
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
  const allSections = getBusinessTemplate('ecommerce')?.sections || [];

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

  const renderSectionTitle = (title: string) => (
    <div className="mb-4">
      <h2
        className="text-lg font-bold"
        style={{
          color: colors.text,
          fontFamily: font
        }}
      >
        {title}
      </h2>
      <div
        className="mt-2 h-1 w-10 rounded-full"
        style={{ backgroundColor: colors.primary }}
      />
    </div>
  );
  
  const renderHeaderSection = (headerData: any) => (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ backgroundColor: colors.background, borderBottom: `1px solid ${colors.borderColor}` }}
    >
      {/* Logo + Name */}
      <div className="flex items-center gap-3 min-w-0">
        {headerData.logo ? (
          <img
            src={getImageDisplayUrl(headerData.logo)}
            alt={headerData.name}
            className="h-14 w-14 rounded-2xl object-contain flex-shrink-0"
            style={{ border: `1px solid ${colors.borderColor}` }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${colors.primary}12`, color: colors.primary }}
          >
            <ShoppingBag size={26} />
          </div>
        )}
        <div className="min-w-0">
          <h1
            className="truncate text-base font-bold leading-tight"
            style={{ color: colors.text, fontFamily: font }}
          >
            {headerData.name || data.name || 'StyleHub'}
          </h1>
          {headerData.tagline && (
            <p className=" text-xs mt-0.5" style={{ color: colors.text + '80', fontFamily: font }}>
              {headerData.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.accent || `${colors.primary}12`, color: colors.primary, border: `1px solid ${colors.borderColor}` }}
          onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          aria-label={t('Contact')}
        >
          <MessageSquare size={14} />
        </button>

        <button
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.accent || `${colors.primary}12`, color: colors.primary, border: `1px solid ${colors.borderColor}` }}
          onClick={() => {
            const businessData = {
              name: sanitizePath(headerData.name || data.name || ''),
              title: sanitizePath(headerData.tagline || ''),
              email: sanitizePath(configSections.contact?.email || data.email || ''),
              phone: sanitizePath(configSections.contact?.phone || data.phone || ''),
              website: sanitizePath(configSections.contact?.website || ''),
              location: sanitizePath(configSections.contact?.address || '')
            };
            import('@/utils/vcfGenerator').then(module => { module.downloadVCF(businessData); });
          }}
          aria-label={t('Save Contact')}
        >
          <User size={14} />
        </button>

        {(configSections?.language?.enable_language_switcher) && (
          <div className="relative z-30">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
              style={{ backgroundColor: colors.accent || `${colors.primary}12`, border: `1px solid ${colors.borderColor}` }}
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            >
              <span className="text-sm leading-none">
                {String.fromCodePoint(...(languageData.find(lang => lang.code === currentLanguage)?.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()) || [127468, 127463]))}
              </span>
            </button>
            {showLanguageSelector && (
              <>
                <div className="fixed inset-0" style={{ zIndex: 40 }} onClick={() => setShowLanguageSelector(false)} />
                <div
                  className="absolute right-0 top-full mt-1 w-40 max-h-60 overflow-y-auto rounded-xl border py-1 shadow-lg"
                  style={{ backgroundColor: colors.background, borderColor: colors.borderColor, zIndex: 50 }}
                >
                  {languageData.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs cursor-pointer"
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

  const renderFeaturedSection = (featuredData: any) => {
    if (!featuredData.title && !featuredData.image) return null; 
    return (
      <div 
        className="relative h-48 overflow-hidden" 
        style={{ backgroundColor: colors.accent }}
      >
        {featuredData.image ? (
          <img 
            src={getImageDisplayUrl(featuredData.image)} 
            alt={featuredData.title} 
            className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-r" style={{ 
              backgroundImage: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
              opacity: 0.9
            }} />
            <div
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full"
              style={{ backgroundColor: `${colors.background}14` }}
            />
            <div
              className="absolute right-10 top-8 h-20 w-20 rounded-full border"
              style={{ borderColor: `${colors.background}26` }}
            />
            <div
              className="absolute -left-10 bottom-0 h-28 w-28 rounded-full"
              style={{ backgroundColor: `${colors.background}10` }}
            />
            <svg
              className="absolute right-0 top-0 h-full w-full"
              viewBox="0 0 400 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
            </svg>
          </>
        )}
        
        <div 
          className="absolute inset-0 flex flex-col justify-center px-5" 
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          {featuredData.title && (
            <h2 
              className="text-xl font-bold mb-1" 
              style={{ 
                color: '#FFFFFF',
                fontFamily: font,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {featuredData.title}
            </h2>
          )}
          
          {featuredData.subtitle && (
            <p 
              className="text-sm mb-3" 
              style={{ 
                color: '#FFFFFF',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {featuredData.subtitle}
            </p>
          )}
          
          {featuredData.button_text && (
            <Button
              className="inline-flex h-auto w-fit self-start rounded px-4 py-1 text-sm"
              style={{ 
                backgroundColor: colors.background,
                color: colors.primary,
                fontFamily: font,
                fontWeight: 'bold'
              }}
              onClick={() => typeof window !== "undefined" && window.open(featuredData.button_url || '#', "_blank", "noopener,noreferrer")}
            >
              {featuredData.button_text}
              <ChevronRight size={14} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCategoriesSection = (categoriesData: any) => {
    const categories = categoriesData.category_list || [];
    if (!Array.isArray(categories) || categories.length === 0) return null;
    
    return (
      <div className="px-4 py-5">
        <div
          className="-mx-4 px-4 py-5"
          style={{ backgroundColor: `${colors.primary}10` }}
        >
          {renderSectionTitle(t('Shop by Category'))}
          
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category: any, index: number) => (
              <a
                key={index}
                href={category.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-lg overflow-hidden aspect-square"
              >
                {category.image ? (
                  <img 
                    src={getImageDisplayUrl(category.image)} 
                    alt={category.title} 
                    className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
                ) : (
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      backgroundColor: colors.accent,
                      backgroundImage: `linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20)`
                    }}
                  ></div>
                )}
                
                <div 
                  className="absolute inset-x-0 bottom-0 p-1"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                  <h3 
                    className="text-sm font-bold text-left" 
                    style={{ 
                      color: '#FFFFFF',
                      fontFamily: font,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {category.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProductsSection = (productsData: any) => {
    const products = productsData.product_list || [];
    if (!Array.isArray(products) || products.length === 0) return null;
    
    const getBadgeStyle = (badge: string) => {
      switch(badge) {
        case 'sale': return { bg: colors.saleColor || '#E53935', text: '#FFFFFF' };
        case 'new': return { bg: colors.primary || '#4A6CF7', text: '#FFFFFF' };
        case 'bestseller': return { bg: colors.secondary || '#6E82FE', text: '#FFFFFF' };
        case 'limited': return { bg: '#212121', text: '#FFFFFF' };
        default: return { bg: colors.primary || '#4A6CF7', text: '#FFFFFF' };
      }
    };
    
    return (
      <div className="px-4 py-5">
          <div className="mb-4 flex items-start justify-between">
            {renderSectionTitle(t('Featured Products'))}
            <a 
              href="#" 
              className="text-xs flex items-center"
              style={{ color: colors.primary }}
          >
            {t('View All')}
            <ChevronRight size={14} />
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {products.map((product: any, index: number) => (
            <a
              key={index}
              href={product.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="overflow-hidden rounded-lg"
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 12px 26px ${colors.primary}10`
              }}
            >
              {/* Product Image */}
              <div className="relative aspect-[0.95] overflow-hidden">
                {product.image ? (
                  <img 
                    src={getImageDisplayUrl(product.image)} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center" 
                    style={{ backgroundColor: colors.accent }}
                  >
                    <ShoppingBag size={24} style={{ color: colors.primary }} />
                  </div>
                )}
                
                {/* Badge */}
                {product.badge && product.badge !== 'none' && (
                  <span 
                    className="absolute left-3 top-3 inline-flex items-center justify-center rounded-full px-2.5 py-1 font-bold text-xs leading-none" 
                    style={{ 
                      backgroundColor: getBadgeStyle(product.badge).bg,
                      color: getBadgeStyle(product.badge).text,
                      minWidth: '2.75rem',
                      height: '1.6rem',
                      fontSize: '10px'
                    }}
                  >
                    {product.badge.toUpperCase()}
                  </span>
                )}
              </div>
              
              {/* Product Info */}
              <div className="p-3.5">
                <h3 
                  className="text-sm font-semibold line-clamp-1" 
                  style={{ 
                    color: colors.text,
                    fontFamily: font
                  }}
                >
                  {product.title}
                </h3>
                
                {product.description && (
                  <p 
                    className="mt-1.5 text-xs leading-5" 
                    style={{ color: colors.text + 'B3', fontFamily: font }}
                  >
                    {product.description}
                  </p>
                )}

                <div
                  className="mt-3 flex items-center justify-between gap-3 border-t pt-3"
                  style={{ borderColor: colors.borderColor }}
                >
                  {product.category ? (
                    <span 
                      className="min-w-0 truncate rounded-full px-2.5 py-1 text-xs font-semibold" 
                      style={{ color: colors.primary, backgroundColor: `${colors.primary}10`, fontFamily: font }}
                    >
                      {product.category}
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="shrink-0 text-right leading-none">
                    {product.sale_price ? (
                      <div className="flex flex-col items-end gap-1">
                        <span 
                          className="text-sm font-bold" 
                          style={{ color: colors.saleColor, fontFamily: font }}
                        >
                          {product.sale_price}
                        </span>
                        <span 
                          className="text-xs line-through" 
                          style={{ color: colors.text + '80', fontFamily: font }}
                        >
                          {product.price}
                        </span>
                      </div>
                    ) : (
                      <span 
                        className="text-sm font-bold" 
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderBenefitsSection = (benefitsData: any) => {
    const benefits = benefitsData.benefit_list || [];
    if (!Array.isArray(benefits) || benefits.length === 0) return null;
    
    const getBenefitIcon = (iconName: string) => {
      switch(iconName) {
        case 'shipping': return <Truck size={24} />;
        case 'returns': return <RefreshCw size={24} />;
        case 'secure': return <ShieldCheck size={24} />;
        case 'support': return <HeadphonesIcon size={24} />;
        case 'quality': return <Award size={24} />;
        case 'discount': return <Package size={24} />;
        default: return <Package size={24} />;
      }
    };
    
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(t('Shopping Benefits'))}

        <div
          className="-mx-4 px-6 py-6"
          style={{ backgroundColor: `${colors.primary}14` }}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {benefits.map((benefit: any, index: number) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center"
            >
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ 
                  backgroundColor: colors.background,
                  color: colors.primary
                }}
              >
                {getBenefitIcon(benefit.icon)}
              </div>
              
              <h3 
                className="mb-1 text-sm font-bold leading-snug" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {benefit.title}
              </h3>
              
              {benefit.description && (
                <p 
                  className="text-xs leading-5" 
                  style={{ color: colors.text + 'CC', fontFamily: font }}
                >
                  {benefit.description}
                </p>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    );
  };

  const renderVideosSection = (videosData: any) => {
    const getVideoTypeLabel = (videoType: string) => {
      const videoTypeLabels: Record<string, string> = {
        product_demo: t('Product Demonstration'),
        unboxing: t('Unboxing Experience'),
        how_to_use: t('How to Use'),
        customer_review: t('Customer Review'),
        brand_story: t('Brand Story'),
        behind_scenes: t('Behind the Scenes')
      };

      return videoTypeLabels[videoType] || videoType;
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
      <div className="px-4 py-5">
        {renderSectionTitle(t('Product Videos'))}
        
        <div className="space-y-3">
          {videoContent.map((video: any) => (
            <div 
              key={video.key} 
              className="overflow-hidden rounded-[22px]" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 12px 26px ${colors.primary}10`
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
                      className="relative h-48 w-full cursor-pointer overflow-hidden"
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
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%)' }}>
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: colors.primary, boxShadow: `0 8px 20px ${colors.primary}55` }}>
                              <Play className="ml-0.5 h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="p-4">
                {video.title && (
                  <h3 className="mb-2 text-base font-bold" style={{ color: colors.text, fontFamily: font }}>
                    {video.title}
                  </h3>
                )}
                {video.description && (
                  <p className="text-sm leading-6" style={{ color: colors.text + 'CC', fontFamily: font }}>
                    {video.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: colors.borderColor }}>
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.cardBg, color: colors.primary }}
                    >
                      <Video className="h-4 w-4" />
                    </div>
                    {video.video_type ? (
                      <span
                        className="truncate rounded-full px-2.5 py-1 text-[11px]"
                        style={{ backgroundColor: `${colors.primary}10`, color: colors.primary, fontFamily: font }}
                      >
                        {getVideoTypeLabel(video.video_type)}
                      </span>
                    ) : (
                      <span
                        className="text-xs font-medium"
                        style={{ color: colors.text + '80', fontFamily: font }}
                      >
                        {t('Product video')}
                      </span>
                    )}
                  </div>
                  {video.duration && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium" style={{ color: colors.text + '80', fontFamily: font }}>
                      <Clock className="h-3.5 w-3.5" />
                      {video.duration}
                    </span>
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
      <div className="px-4 py-5">
        {renderSectionTitle(t('YouTube Channel'))}
        
        {youtubeData.latest_video_embed && (
          <div
            className="mb-4 overflow-hidden rounded-[22px]"
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.borderColor}`,
              boxShadow: `0 12px 26px ${colors.primary}10`
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
              >
                <Play className="h-4 w-4" />
              </div>
              <h4 className="font-bold text-sm" style={{ color: colors.text, fontFamily: font }}>
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
          className="overflow-hidden rounded-[22px]" 
          style={{ 
            backgroundColor: colors.background,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `0 12px 26px ${colors.primary}10`
          }}
        >
          <div className="p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600">
                <Youtube className="h-7 w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base" style={{ color: colors.text, fontFamily: font }}>
                  {youtubeData.channel_name || 'Our Store'}
                </h3>
                {youtubeData.subscriber_count && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ backgroundColor: colors.cardBg }}>
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}
                    >
                      <Play className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium" style={{ color: colors.text + 'CC', fontFamily: font }}>
                      {youtubeData.subscriber_count} {t("subscribers")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {youtubeData.channel_description && (
              <p className="text-sm leading-6" style={{ color: colors.text, fontFamily: font }}>
                {youtubeData.channel_description}
              </p>
            )}

            <div className="mt-4 grid grid-cols-1 gap-2">
              {youtubeData.channel_url && (
                <Button 
                  className="w-full h-11 rounded-md" 
                  style={{ 
                    backgroundColor: colors.primary, 
                    color: 'white',
                    fontFamily: font 
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.channel_url, '_blank', 'noopener,noreferrer')}
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  {t('Subscribe')}
                </Button>
              )}
              {youtubeData.featured_playlist && (
                <Button 
                  variant="outline" 
                  className="w-full h-11 rounded-md" 
                  style={{ 
                    borderColor: colors.primary, 
                    color: colors.primary, 
                    fontFamily: font 
                  }}
                  onClick={() => typeof window !== "undefined" && window.open(youtubeData.featured_playlist, '_blank', 'noopener,noreferrer')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {t('Featured Playlist')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTestimonialsSection = (testimonialsData: any) => {
    const reviews = testimonialsData.reviews || [];
    if (!Array.isArray(reviews) || reviews.length === 0) return null;
    
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(t('Customer Reviews'))}
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review: any, index: number) => (
                <div key={index} className="w-full flex-shrink-0 px-1">
                  <div 
                    className="rounded-[22px] p-5" 
                    style={{ 
                      backgroundColor: colors.background,
                      border: `1px solid ${colors.borderColor}`,
                      boxShadow: `0 12px 26px ${colors.primary}10`
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < parseInt(review.rating || 5) ? colors.starColor : 'transparent'} 
                            stroke={i < parseInt(review.rating || 5) ? colors.starColor : colors.borderColor}
                          />
                        ))}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <p 
                      className="mb-4 text-sm leading-7" 
                      style={{ color: colors.text, fontFamily: font }}
                    >
                      "{review.review}"
                    </p>
                    
                    <div className="flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: colors.borderColor }}>
                      <p 
                        className="text-sm font-semibold" 
                        style={{ color: colors.text, fontFamily: font }}
                      >
                        {review.customer_name}
                      </p>
                      
                      {review.product_purchased && (
                        <span 
                          className="rounded-full px-2.5 py-1 text-[11px]" 
                          style={{ color: colors.primary, backgroundColor: `${colors.primary}10`, fontFamily: font }}
                        >
                          {review.product_purchased}
                        </span>
                      )}
                    </div>
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
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: dotIndex === currentReview % Math.max(1, testimonialsData.reviews.length) ? colors.primary : colors.primary + '40'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNewsletterSection = (newsletterData: any) => {
    if (!newsletterData.title) return null;
    
    return (
      <div className="px-4 py-5">
        <div
          className="-mx-4 px-4 py-5"
          style={{
            backgroundColor: `${colors.primary}10`,
            borderTop: `1px solid ${colors.borderColor}`,
            borderBottom: `1px solid ${colors.borderColor}`
          }}
        >
          <div className="px-4">
            <div className="mb-4">
              <h2 
                className="text-lg font-bold mb-2" 
                style={{ 
                  color: colors.text,
                  fontFamily: font
                }}
              >
                {newsletterData.title}
              </h2>
              
              {newsletterData.description && (
                <p 
                  className="text-sm leading-6" 
                  style={{ color: colors.text + 'CC', fontFamily: font }}
                >
                  {newsletterData.description}
                </p>
              )}
            </div>
            
            <div 
              className="flex items-center gap-2 rounded-md p-2" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`
              }}
            >
              <input 
                type="email" 
                placeholder={t('Your email address')} 
                className="min-w-0 flex-1 border-none bg-transparent px-3 py-2 text-sm outline-none"
                style={{ color: colors.text, fontFamily: font }}
              />
              
              <Button
                className="h-10 shrink-0 rounded-md px-5"
                style={{ 
                  backgroundColor: colors.primary,
                  color: colors.buttonText,
                  fontFamily: font
                }}
                onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
              >
                {newsletterData.button_text || t('Subscribe')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactSection = (contactData: any) => {
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(t('Contact Us'))}
        
        <div className="space-y-3">
          {(contactData.email || data.email) && (
            <a 
              href={`mailto:${contactData.email || data.email}`} 
              className="flex items-center gap-3 rounded-[20px] p-4" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 22px ${colors.primary}10`
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${colors.primary}10` }}>
                <Mail size={18} style={{ color: colors.primary }} />
              </div>
              <span 
                className="min-w-0 text-sm break-all" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {contactData.email || data.email}
              </span>
            </a>
          )}
          
          {(contactData.phone || data.phone) && (
            <a 
              href={`tel:${contactData.phone || data.phone}`} 
              className="flex items-center gap-3 rounded-[20px] p-4" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 22px ${colors.primary}10`
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${colors.primary}10` }}>
                <Phone size={18} style={{ color: colors.primary }} />
              </div>
              <span 
                className="text-sm" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {contactData.phone || data.phone}
              </span>
            </a>
          )}
          
          {(contactData.website || data.website) && (
            <a 
              href={contactData.website || data.website} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[20px] p-4 break-all" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 22px ${colors.primary}10`
              }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${colors.primary}10` }}>
                <Globe2 size={18} style={{ color: colors.primary }} />
              </div>
              <span 
                className="text-sm" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {contactData.website || data.website}
              </span>
            </a>
          )}

          {contactData.address && (
            <div 
              className="flex items-start gap-3 rounded-[20px] p-4" 
              style={{ 
                backgroundColor: colors.background,
                border: `1px solid ${colors.borderColor}`,
                boxShadow: `0 10px 22px ${colors.primary}10`
              }}
            >
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${colors.primary}10` }}>
                <MapPin size={18} style={{ color: colors.primary }} />
              </div>
              <span 
                className="text-sm" 
                style={{ color: colors.text, fontFamily: font }}
              >
                {contactData.address}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button
            className="h-11 rounded-md px-6"
            style={{ 
              backgroundColor: colors.primary,
              color: colors.buttonText,
              fontFamily: font
            }}
            onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
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
        className="px-4 py-4" 
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
              className="group flex h-11 w-11 items-center justify-center transition-transform hover:scale-105"
              style={{ 
                color: '#FFFFFF'
              }}
            >
              <div
                className="flex h-9 w-9 rotate-45 items-center justify-center"
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: '14px'
                }}
              >
                <div className="-rotate-45">
                  <SocialIcon platform={link.platform} color="currentColor" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomHtmlSection = (customHtmlData: any) => {
    if (!customHtmlData.html_content) return null;
    
    return (
      <div className="px-4 py-5">
        {customHtmlData.show_title && customHtmlData.section_title && (
          renderSectionTitle(customHtmlData.section_title)
        )}
        <div 
          className="custom-html-content p-3 rounded-lg" 
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
    );
  };

  const renderActionButtonsSection = (actionButtonsData: any) => {
    const hasAnyButton = actionButtonsData.contact_button_text || actionButtonsData.save_contact_button_text;
    if (!hasAnyButton) return null;
    
    return (
      <div className="px-4 py-5">
        <div className="space-y-3">
          {actionButtonsData.contact_button_text && (
            <Button 
              className="w-full rounded-md" 
              style={{ 
                backgroundColor: colors.primary, 
                color: colors.buttonText, 
                fontFamily: font 
              }}
              onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {actionButtonsData.contact_button_text}
            </Button>
          )}
          
          {actionButtonsData.save_contact_button_text && (
            <Button 
              className="w-full rounded-md" 
              variant="outline"
              style={{ 
                borderColor: colors.primary, 
                color: colors.primary, 
                fontFamily: font 
              }}
              onClick={() => {
                const contactData = {
                  name: data.name || configSections.header?.name || '',
                  title: configSections.header?.tagline || '',
                  email: data.email || configSections.contact?.email || '',
                  phone: data.phone || configSections.contact?.phone || '',
                  website: data.website || configSections.contact?.website || '',
                  address: configSections.contact?.address || ''
                };
                import('@/utils/vcfGenerator').then(module => {
                      module.downloadVCF(contactData);
                    });
              }}
            >
              <User className="w-4 h-4 mr-2" />
              {actionButtonsData.save_contact_button_text}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderQrShareSection = (qrData: any) => {
    if (!qrData.enable_qr) return null;
    
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(qrData.qr_title || t('Share Our Store'))}
        
        <div 
          className="rounded-[22px] p-5 text-center" 
          style={{ 
            backgroundColor: `${colors.primary}10`,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: `0 12px 26px ${colors.primary}10`
          }}
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
              <QrCode className="h-7 w-7" />
            </div>
          </div>
          {qrData.qr_description && (
            <p 
              className="mb-4 text-sm leading-6" 
              style={{ color: colors.text, fontFamily: font }}
            >
              {qrData.qr_description}
            </p>
          )}
          
          <div className="flex justify-center">
          <Button 
            className="h-11 rounded-md px-5" 
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
      </div>
    );
  };

  const renderFooterSection = (footerData: any) => {
    if (!footerData.show_footer) return null;
    
    return (
      <div 
        className="px-4 py-5" 
        style={{ 
          backgroundColor: colors.cardBg,
          borderTop: `1px solid ${colors.borderColor}`
        }}
      >
        {footerData.footer_text && (
          <p 
            className="text-sm text-center mb-4" 
            style={{ 
              color: colors.text,
              fontFamily: font
            }}
          >
            {footerData.footer_text}
          </p>
        )}
        
        {footerData.footer_links && Array.isArray(footerData.footer_links) && footerData.footer_links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {footerData.footer_links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2 rounded-full transition-colors"
                style={{ 
                  backgroundColor: colors.primary + '20',
                  color: colors.primary,
                  fontFamily: font,
                  border: `1px solid ${colors.primary}30`
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCopyrightSection = (copyrightData: any) => {
    if (!copyrightData.text) return null;
    
    return (
      <div 
        className="px-4 py-4" 
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
      case 'featured':
        return renderFeaturedSection(sectionData);
      case 'categories':
        return renderCategoriesSection(sectionData);
      case 'products':
        return renderProductsSection(sectionData);
      case 'benefits':
        return renderBenefitsSection(sectionData);
      case 'videos':
        return renderVideosSection(sectionData);
      case 'youtube':
        return renderYouTubeSection(sectionData);
      case 'testimonials':
        return renderTestimonialsSection(sectionData);
      case 'newsletter':
        return renderNewsletterSection(sectionData);
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
      case 'action_buttons':
        return renderActionButtonsSection(sectionData);
      case 'qr_share':
        return renderQrShareSection(sectionData);
      case 'footer':
        return renderFooterSection(sectionData);
      case 'thank_you':
        return renderThankYouSection(sectionData);
      case 'copyright':
        return renderCopyrightSection(sectionData);
      default:
        return null;
    }
  };
  
  const renderAboutSection = (aboutData: any) => {
    if (!aboutData.description && !data.description) return null;

    const description = aboutData.description || data.description;

    return (
      <div className="px-4 py-5">
        <div>
          {renderSectionTitle(t('About Us'))}

          <p
            className="text-sm leading-7"
            style={{ color: colors.text, fontFamily: font }}
          >
            {description}
          </p>

          {aboutData.year_established && (
            <div className="mt-5 flex items-center gap-2">
              <div
                className="text-[11px] uppercase leading-none tracking-[0.18em]"
                style={{ color: `${colors.text}80`, fontFamily: font }}
              >
                {t('Established')}:
              </div>
              <div
                className="text-sm font-semibold leading-none"
                style={{ color: colors.text, fontFamily: font }}
              >
                {aboutData.year_established}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderBusinessHoursSection = (hoursData: any) => {
    const hours = hoursData.hours || [];
    if (!Array.isArray(hours) || hours.length === 0) return null;
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(t('Business Hours'))}
        <div className="space-y-3">
          {hours.map((hour: any, index: number) => (
            <div key={index} className="flex items-center justify-between rounded-[18px] px-4 py-3" style={{ backgroundColor: colors.background, border: `1px solid ${colors.borderColor}`, boxShadow: `0 10px 22px ${colors.primary}10` }}>
              <span className="capitalize text-sm font-medium" style={{ color: colors.text, fontFamily: font }}>{t(hour.day)}</span>
              <span className="text-sm" style={{ color: hour.is_closed ? colors.text + '80' : colors.primary, fontFamily: font }}>
                {hour.is_closed ? t('Closed') : `${hour.open_time} - ${hour.close_time}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderAppointmentsSection = (appointmentsData: any) => {
    return (
      <div className="px-4 py-5">
        <Button className="w-full rounded" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }} onClick={() => handleAppointmentBooking(configSections.appointments)}>
          <Calendar className="w-4 h-4 mr-2" />{t('Book Appointment')}
        </Button>
      </div>
    );
  };
  
  const renderLocationSection = (locationData: any) => {
    if (!locationData.map_embed_url && !locationData.directions_url) return null;
    
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(t('Location'))}
        
        <div className="space-y-3">
          {locationData.map_embed_url && (
            <EcommerceMapEmbed embedHtml={locationData.map_embed_url} />
          )}
          
          {locationData.directions_url && (
            <Button className="w-full rounded" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.open(locationData.directions_url, "_blank", "noopener,noreferrer")}>
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
      <div className="px-4 py-5">
        {renderSectionTitle(t('Download Our App'))}
        {appData.app_description && (
          <p 
            className="text-sm mb-4" 
            style={{ color: colors.text }}
          >
            {appData.app_description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {appData.app_store_url && <Button className="rounded-md" variant="outline" style={{ borderColor: colors.primary, color: colors.primary }} onClick={() => typeof window !== "undefined" && window.open(appData.app_store_url, "_blank", "noopener,noreferrer")}>{t('App Store')}</Button>}
          {appData.play_store_url && <Button className="rounded-md" variant="outline" style={{ borderColor: colors.primary, color: colors.primary }} onClick={() => typeof window !== "undefined" && window.open(appData.play_store_url, "_blank", "noopener,noreferrer")}>{t('Play Store')}</Button>}
        </div>
      </div>
    );
  };
  
  const renderContactFormSection = (formData: any) => {
    if (!formData.form_title) return null;
    return (
      <div className="px-4 py-5">
        {renderSectionTitle(formData.form_title)}
        {formData.form_description && (
          <p 
            className="text-sm mb-4" 
            style={{ color: colors.text }}
          >
            {formData.form_description}
          </p>
        )}
        <Button className="w-full rounded-md" style={{ backgroundColor: colors.primary, color: colors.buttonText, fontFamily: font }} onClick={() => typeof window !== "undefined" && window.dispatchEvent(new CustomEvent('openContactModal'))}>
          <MessageSquare className="w-4 h-4 mr-2" />{t('Send Message')}
        </Button>
      </div>
    );
  };
  
  const renderThankYouSection = (thankYouData: any) => {
    if (!thankYouData.message) return null;
    return (
      <div className="px-4 py-4">
        <p className="text-sm text-center" style={{ color: colors.text + '80' }}>{thankYouData.message}</p>
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
        .filter(key => key !== 'colors' && key !== 'font' && key !== 'footer' && key !== 'copyright')
        .map((sectionKey) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
          </React.Fragment>
        ))}
        
      {/* Footer Section */}
      {renderSection('footer')}
      
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

export default EcommerceTemplate;
