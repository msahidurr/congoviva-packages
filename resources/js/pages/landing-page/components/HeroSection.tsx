import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface HeroSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    subtitle?: string;
    announcement_text?: string;
    primary_button_text?: string;
    secondary_button_text?: string;
    image?: string;
    stats?: Array<{value: string; label: string}>;
    card?: {
      name: string;
      title: string;
      company: string;
      initials: string;
    };
    background_color?: string;
    text_color?: string;
    background_image?: string;
    height?: number;
    layout?: string;
    overlay?: boolean;
    overlay_color?: string;
    image_position?: string;
  };
}

export default function HeroSection({ settings, sectionData, brandColor = '#3b82f6' }: HeroSectionProps) {
  const { t } = useTranslation();
  const heroImage = sectionData.image ? getImageDisplayUrl(sectionData.image) : null;
  const isRegistrationEnabled = settings?.registrationEnabled === true || settings?.registrationEnabled === '1';

  const backgroundColor = sectionData.background_color || '#f9fafb';
  const textColor = sectionData.text_color || '#111827';
  const subtitleColor = sectionData.text_color || '#4b5563';
  const minHeight = sectionData.height ? `${sectionData.height}px` : '100vh';
  const layout = sectionData.layout || 'image-right';
  const hasOverlay = sectionData.overlay === true;
  const overlayColor = sectionData.overlay_color || 'rgba(0,0,0,0.5)';
  const imagePosition = sectionData.image_position || 'right';

  const isCentered = layout === 'centered' || layout === 'full-width';

  const textContent = (
    <div className={`space-y-6 sm:space-y-8 ${isCentered ? 'text-center' : 'text-center lg:text-left'}`}>
      {sectionData.announcement_text && (
        <div
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border"
          style={{ borderColor: brandColor, color: brandColor, backgroundColor: `${brandColor}15` }}
        >
          {sectionData.announcement_text}
        </div>
      )}
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        style={{ color: textColor }}
        role="banner"
        aria-label="Main heading"
      >
        {sectionData.title || t('Create Your Digital Business Card')}
      </h1>
      <p
        className={`text-lg md:text-xl leading-relaxed font-medium ${isCentered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
        style={{ color: subtitleColor, opacity: 0.85 }}
      >
        {sectionData.subtitle || t('Transform your networking with professional digital business cards.')}
      </p>
      <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 ${isCentered ? 'justify-center' : 'justify-center lg:justify-start'}`}>
        <Link
          href={isRegistrationEnabled ? route('register') : route('login')}
          className="px-8 py-4 rounded-lg transition-all font-semibold text-base flex items-center justify-center gap-2 border"
          style={{ backgroundColor: brandColor, color: 'white', borderColor: brandColor }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = brandColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.color = 'white'; }}
          aria-label={isRegistrationEnabled ? 'Start free trial - Register for vCard SaaS' : 'Login to vCard SaaS'}
        >
          {sectionData.primary_button_text || t('Start Free Trial')}
          <ArrowRight size={18} />
        </Link>
        <Link
          href={route('login')}
          className="border px-8 py-4 rounded-lg transition-colors font-semibold text-base flex items-center justify-center gap-2 hover:bg-white/10"
          style={{ borderColor: brandColor, color: brandColor }}
          aria-label="Login to existing vCard SaaS account"
        >
          <Play size={18} />
          {sectionData.secondary_button_text || t('Login')}
        </Link>
      </div>
      {sectionData.stats && sectionData.stats.length > 0 && (
        <div className={`grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-8 sm:pt-12 ${isCentered ? 'max-w-lg mx-auto' : ''}`}>
          {sectionData.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold" style={{ color: textColor }}>{stat.value}</div>
              <div className="text-sm font-medium" style={{ color: subtitleColor, opacity: 0.8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const imageContent = imagePosition === 'background' ? null : (
    <div className="relative w-full">
      {heroImage ? (
        <img src={heroImage} alt="Hero" className="w-full h-auto rounded-2xl shadow-xl" />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-auto border border-gray-200">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                <span className="text-white text-2xl font-bold">{sectionData.card?.initials || 'JD'}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white">
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{sectionData.card?.name || t('John Doe')}</h3>
              <p className="text-gray-900 font-semibold">{sectionData.card?.title || t('Senior Developer')}</p>
              <p className="text-gray-500">{sectionData.card?.company || t('Tech Solutions Inc.')}</p>
            </div>
            <div className="flex justify-center gap-3">
              {['📧', '📱', '🔗'].map((icon, i) => (
                <div key={i} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border">
                  <span className="text-gray-600 text-sm">{icon}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 rounded-xl border">
              <div className="w-24 h-24 bg-white rounded-lg mx-auto flex items-center justify-center shadow-sm border">
                <div className="w-16 h-16 rounded flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                  <span className="text-white text-xs font-mono">{t('QR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gray-200 rounded-full opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gray-300 rounded-full opacity-40 pointer-events-none"></div>
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case 'centered':
        return (
          <div className="flex flex-col items-center gap-10">
            {textContent}
            <div className="w-full max-w-lg">{imageContent}</div>
          </div>
        );
      case 'full-width':
        return (
          <div className="flex flex-col gap-10">
            {textContent}
            <div className="w-full">{imageContent}</div>
          </div>
        );
      case 'image-left':
        return (
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {imageContent}
            {textContent}
          </div>
        );
      case 'image-right':
      default:
        return (
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {textContent}
            {imageContent}
          </div>
        );
    }
  };

  return (
    <section
      id="hero"
      className="pt-16 flex items-center relative"
      style={{
        backgroundColor: hasOverlay ? overlayColor : backgroundColor,
        minHeight,
        ...(imagePosition === 'background' && heroImage ? {
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : {}),
      }}
    >
      {hasOverlay && imagePosition === 'background' && (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: overlayColor }} />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full">
        {renderLayout()}
      </div>
    </section>
  );
}
