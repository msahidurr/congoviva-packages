import React from 'react';
import { QrCode, Smartphone, Share2, BarChart3, Globe, Shield, Star, Zap, Users, Lock, Wifi, Heart } from 'lucide-react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { useTranslation } from 'react-i18next';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesSectionProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    description?: string;
    features_list?: Feature[];
    background_color?: string;
    columns?: number;
    layout?: string;
    show_icons?: boolean;
    image?: string;
  };
}

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<any>> = {
  'qr-code': QrCode,
  'smartphone': Smartphone,
  'share': Share2,
  'bar-chart': BarChart3,
  'globe': Globe,
  'shield': Shield,
  'star': Star,
  'zap': Zap,
  'users': Users,
  'lock': Lock,
  'wifi': Wifi,
  'heart': Heart
};

export default function FeaturesSection({ settings, sectionData, brandColor = '#3b82f6' }: FeaturesSectionProps) {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  
  const sectionImage = sectionData.image ? getImageDisplayUrl(sectionData.image) : null;
  const backgroundColor = sectionData.background_color || '#f9fafb';
  const columns = sectionData.columns || 3;
  const layout = sectionData.layout || 'grid';
  const showIcons = sectionData.show_icons !== false;
  // Default features if none provided
  const defaultFeatures = [
    {
      icon: 'qr-code',
      title: 'QR Code Generation',
      description: 'Generate unique QR codes for instant contact sharing. Perfect for business cards, flyers, and networking events.'
    },
    {
      icon: 'smartphone',
      title: 'NFC Technology',
      description: 'Tap-to-share functionality with NFC-enabled devices. Modern networking made simple and professional.'
    },
    {
      icon: 'share',
      title: 'Easy Sharing',
      description: 'Share your digital card via email, SMS, social media, or direct links. Multiple sharing options available.'
    },
    {
      icon: 'bar-chart',
      title: 'Analytics & Insights',
      description: 'Track views, clicks, and engagement metrics. Understand how your network interacts with your card.'
    },
    {
      icon: 'globe',
      title: 'Custom Domains',
      description: 'Use your own domain for a professional branded experience. Build trust with custom URLs.'
    },
    {
      icon: 'shield',
      title: 'Secure & Private',
      description: 'Enterprise-grade security with privacy controls. Your data is protected and under your control.'
    }
  ];

  const features = sectionData.features_list && sectionData.features_list.length > 0 
    ? sectionData.features_list 
    : defaultFeatures;

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor }} ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title || 'Powerful Features for Modern Networking'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData.description || 'Everything you need to create, share, and manage your digital business presence. Built for professionals who value efficiency and innovation.'}
          </p>
        </div>

        {sectionImage && (
          <div className="mb-8 sm:mb-12 text-center">
            <img src={sectionImage} alt="Features" className="max-w-full h-auto rounded-xl shadow-lg mx-auto" />
          </div>
        )}
        
        {/* Grid Layout */}
        {layout === 'grid' && (
          <div className={`grid grid-cols-1 ${columns >= 2 ? 'sm:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6 sm:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || QrCode;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
                  role="article"
                  aria-labelledby={`feature-${index}-title`}
                >
                  {showIcons && (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${brandColor}15` }} role="img" aria-label={`${feature.title} icon`}>
                      <IconComponent className="w-6 h-6" style={{ color: brandColor }} aria-hidden="true" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-4" id={`feature-${index}-title`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* List Layout */}
        {layout === 'list' && (
          <div className={`space-y-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || QrCode;
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex items-start gap-5">
                  {showIcons && (
                    <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${brandColor}15` }}>
                      <IconComponent className="w-6 h-6" style={{ color: brandColor }} />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cards Layout */}
        {layout === 'cards' && (
          <div className={`grid grid-cols-1 ${columns >= 2 ? 'sm:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''} gap-6 sm:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || QrCode;
              return (
                <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden">
                  <div className="h-2 w-full" style={{ backgroundColor: brandColor }} />
                  <div className="p-6">
                    {showIcons && (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${brandColor}15` }}>
                        <IconComponent className="w-7 h-7" style={{ color: brandColor }} />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Alternating Layout */}
        {layout === 'alternating' && (
          <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || QrCode;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row items-center gap-6 bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200 ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  {showIcons && (
                    <div
                      className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: brandColor }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className={`flex-1 ${!isEven ? 'lg:text-right' : ''}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}