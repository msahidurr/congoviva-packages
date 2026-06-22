import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { useFavicon } from '@/hooks/use-favicon';
import { useTranslation } from 'react-i18next';
import { Eye, Filter } from 'lucide-react';

interface Template {
  name: string;
  category: string;
}

interface LandingSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    sections: Array<{
      key: string;
      [key: string]: any;
    }>;
    theme?: {
      primary_color?: string;
      secondary_color?: string;
      accent_color?: string;
      logo_light?: string;
      logo_dark?: string;
      favicon?: string;
    };
    seo?: {
      meta_title?: string;
      meta_description?: string;
      meta_keywords?: string;
    };
    custom_css?: string;
    custom_js?: string;
    section_order?: string[];
    section_visibility?: {
      [key: string]: boolean;
    };
  };
}

interface SharedData {
  auth: {
    user: any;
    lang: string;
  };
}

interface CustomPage {
  id: number;
  title: string;
  slug: string;
}

interface PageProps {
  settings: LandingSettings;
  templates: Template[];
  customPages: CustomPage[];
}

export default function TemplatesPage() {
  const { settings, templates, customPages = [] } = usePage<PageProps>().props;
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useFavicon();

  // Get brand colors
  const { themeColor, customColor } = useBrand();
  const configPrimaryColor = settings.config_sections?.theme?.primary_color;
  const primaryColor = configPrimaryColor || (themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS]);
  
  const page = usePage<SharedData>();
  const { auth } = page.props;

  // Initialize language from user preference
  React.useEffect(() => {
    if (auth.lang && auth.lang !== i18n.language) {
      i18n.changeLanguage(auth.lang);
    }
  }, [auth.lang, i18n]);

  // SEO Meta tags
  React.useEffect(() => {
    document.title = 'Templates - ' + settings.company_name;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', t('Browse our collection of professional business card templates'));
  }, [settings.company_name, t]);

  // Custom CSS
  React.useEffect(() => {
    const customCss = settings.config_sections?.custom_css;
    if (customCss) {
      const styleId = 'landing-custom-css';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = customCss;
    }
  }, [settings.config_sections?.custom_css]);

  // Get section data helper
  const getSectionData = (key: string) => {
    return settings.config_sections?.sections?.find(section => section.key === key) || {};
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);


  // Template card component
  const TemplateCard = ({ template }: { template: Template }) => (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative pt-[80%] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
           src={`${(window as any).baseUrl || window.location.origin}/storage/images/business-template/${template.name}.png`}
          alt={`${template.name} template`}
          className="absolute inset-0 w-full h-full object-top object-cover hover:object-bottom transition-all duration-4000"
          onError={(e) => {
            e.currentTarget.src = `/storage/images/business-template/freelancer.png`;
          }}
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 capitalize leading-tight">
            {template.name.replace(/-/g, ' ')}
          </h3>
          <span 
            className="px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ml-2" 
            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          >
            {template.category}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          {template.category === 'business' ? t('Professional business design') : 
           template.category === 'creative' ? t('Creative and unique layout') : 
           template.category === 'technology' ? t('Modern tech-focused style') : 
           template.category === 'sports' ? t('Dynamic sports-focused layout') :
           t('Professionally crafted template')}
        </p>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-white" 
      data-landing-page="true"
      style={{ 
        scrollBehavior: 'smooth', 
        '--brand-color': primaryColor,
        '--primary-color': settings.config_sections?.theme?.primary_color || primaryColor,
        '--secondary-color': settings.config_sections?.theme?.secondary_color || '#8b5cf6',
        '--accent-color': settings.config_sections?.theme?.accent_color || '#10b77f'
      } as React.CSSProperties}
    >
      <Header 
        settings={settings} 
        sectionData={getSectionData('header')}
        customPages={customPages} 
        brandColor={primaryColor} 
        user={auth.user}
      />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                {t('Professional Templates')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('Choose from our collection of professionally designed templates to create your perfect digital business card')}
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${
                    selectedCategory === category
                      ? 'text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                  style={selectedCategory === category ? { backgroundColor: primaryColor } : {}}
                >
                  {category === 'all' ? t('All Templates') : category}
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template, index) => (
                <TemplateCard key={index} template={template} />
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('No templates found')}</h3>
                <p className="text-gray-600">{t('Try selecting a different category')}</p>
              </div>
            )}

            {/* CTA Section */}
            <div className="text-center mt-16 pt-16 border-t border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                {t('Ready to Get Started?')}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('Create your professional digital business card in minutes with our easy-to-use builder')}
              </p>
              <Link
                href={route('register')}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm hover:brightness-110 hover:!text-white transition-all duration-200"
                style={{ backgroundColor: primaryColor }}
              >
                {t('Start Building Now')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer 
        settings={settings} 
        sectionData={getSectionData('footer')}
        brandColor={primaryColor} 
      />
    </div>
  );
}
