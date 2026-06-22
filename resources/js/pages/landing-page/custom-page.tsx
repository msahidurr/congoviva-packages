import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FaqPage from './components/FaqPage';
import RefundPolicy from './components/RefundPolicy';
import ContactPage from './components/ContactPage';
import { useFavicon } from '@/hooks/use-favicon';

interface CustomPage {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
}

interface CustomPageData {
  id: number;
  title: string;
  subtitle?: string;
  slug: string;
}

interface PageProps {
  page: CustomPage;
  customPages: CustomPageData[];
  settings: {
    company_name: string;
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;
    config_sections?: {
      sections?: Array<{
        key: string;
        [key: string]: any;
      }>;
    };
    [key: string]: any;
  };
}

export default function CustomPage() {
  const pageProps = usePage().props as any;
  let { page, customPages = [], settings } = pageProps;
  
  // Check if current page is active
  const checkPageActive = () => {
    const sections = settings?.config_sections?.sections || [];
    const customPages = settings?.config_sections?.custom_pages || [];
    
    const defaultPageSlugs = {
      'about-us': 'about-page',
      'privacy-policy': 'privacy', 
      'terms-of-service': 'terms',
      'refund-policy': 'refund',
      'faq': 'faq-page',
      'contact-us': 'contact-page'
    };
    
    const pageKey = defaultPageSlugs[page.slug];
    if (pageKey) {
      const pageSection = sections.find(s => s.key === pageKey);
      return !pageSection || pageSection.active !== false;
    }
    
    // Check custom pages - use key as fallback for slug
    const customPage = customPages.find(p => p.slug === page.slug || p.key === page.slug);
    if (customPage) {
      return customPage.active !== false;
    }
    
    return true;
  };
  
  // Redirect if page is inactive
  if (!checkPageActive()) {
    window.location.href = route('home');
    return null;
  }
  
  const customCSS = `
    .custom-page-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.7;
      color: #374151;
    }
    .custom-page-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: #111827;
      line-height: 1.2;
    }
    .custom-page-content h2 {
      font-size: 2rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #111827;
      line-height: 1.3;
    }
    .custom-page-content p {
      margin-bottom: 1rem;
      font-size: 1rem;
    }
  `;
  const primaryColor = settings?.config_sections?.theme?.primary_color || '#3b82f6';
  const secondaryColor = settings?.config_sections?.theme?.secondary_color || '#8b5cf6';
  const accentColor = settings?.config_sections?.theme?.accent_color || '#10b77f';
  
  useFavicon();
  
  const isAboutUsPage = page.slug === 'about-us';
  const isPrivacyPage = page.slug === 'privacy-policy';
  const isTermsPage = page.slug === 'terms-of-service';
  const isFaqPage = page.slug === 'faq';
  const isRefundPage = page.slug === 'refund-policy';
  const isContactPage = page.slug === 'contact-us';
  const isDefaultPage = isAboutUsPage || isPrivacyPage || isTermsPage || isFaqPage || isRefundPage || isContactPage;
  const customPageData = isDefaultPage ? 
    (settings?.config_sections?.sections?.find(s => s.key === page.slug) || settings?.config_sections?.custom_pages?.find(p => p.slug === page.slug || p.key === page.slug)) : 
    // For non-default pages, find the actual section data by matching with custom_pages entry
    (() => {
      const customPageEntry = settings?.config_sections?.custom_pages?.find(p => p.slug === page.slug);
      if (customPageEntry) {
        return settings?.config_sections?.sections?.find(s => s.key === customPageEntry.key);
      }
      return null;
    })();
  
  if (customPageData) {
    page = {
      ...page,
      title: customPageData.title || customPageData.name,
      subtitle: customPageData.subtitle || page.subtitle || '',
      content: customPageData.content || `<h1>${customPageData.name}</h1><p>This is the ${customPageData.name} page.</p>`,
      meta_title: customPageData.title || customPageData.name,
      meta_description: customPageData.description || ''
    };
  }
  
  // Ensure page data is properly set for database pages
  if (!customPageData && page) {
    // This is a database page, ensure all fields are available
    page = {
      ...page,
      title: page.title || '',
      subtitle: page.subtitle || '',
      content: page.content || '',
      meta_title: page.meta_title || page.title,
      meta_description: page.meta_description || ''
    };
  }
  const aboutPageData = settings?.config_sections?.sections?.find((s: any) => s.key === 'about-page');
  const privacyPageData = settings?.config_sections?.sections?.find((s: any) => s.key === 'privacy');
  const termsPageData = settings?.config_sections?.sections?.find((s: any) => s.key === 'terms');
  const faqPageData = settings?.config_sections?.sections?.find((s: any) => s.key === 'faq-page');
  const refundPageData = settings?.config_sections?.sections?.find((s: any) => s.key === 'refund');
  const contactPageData = settings?.config_sections?.sections?.find((s: any) => s.key === 'contact-page');
  const aboutUsData = settings?.config_sections?.sections?.find((s: any) => s.key === 'about');
  
  // Convert aboutPageData to AboutUs component format
  const aboutPageFormatted = aboutPageData ? {
    ...aboutPageData,
    description: aboutPageData.description || aboutPageData.subtitle,
    story_content: aboutPageData.story_content || aboutPageData.content,
    values: aboutPageData.values || undefined,
    stats: aboutPageData.stats || undefined
  } : null;
  
  // Convert privacyPageData to PrivacyPolicy component format
  const privacyPageFormatted = privacyPageData ? {
    ...privacyPageData,
    description: privacyPageData.description || privacyPageData.subtitle,
    story_content: privacyPageData.story_content || privacyPageData.content,
    values: privacyPageData.values || undefined,
    stats: privacyPageData.stats || undefined
  } : {
    title: 'Privacy Policy',
    description: 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.',
    story_title: 'How We Protect Your Information',
    story_content: 'We are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy explains how we collect, use, and safeguard your data when you use our services.',
    background_color: '#f9fafb'
  };
  
  // Convert termsPageData to TermsOfService component format
  const termsPageFormatted = termsPageData ? {
    ...termsPageData,
    description: termsPageData.description || termsPageData.subtitle,
    story_content: termsPageData.story_content || termsPageData.content,
    values: termsPageData.values || undefined,
    stats: termsPageData.stats || undefined
  } : {
    title: 'Terms of Service',
    description: 'Please read these terms carefully before using our services.',
    story_title: 'Terms and Conditions',
    story_content: 'By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement.',
    background_color: '#f9fafb'
  };
  
  // Convert faqPageData to FaqPage component format
  const faqPageFormatted = faqPageData ? {
    ...faqPageData,
    description: faqPageData.description || faqPageData.subtitle,
    story_content: faqPageData.story_content || faqPageData.content,
    values: faqPageData.values || undefined,
    stats: faqPageData.stats || undefined
  } : {
    title: 'Frequently Asked Questions',
    description: 'Find quick answers to the most common questions',
    story_title: 'FAQ',
    story_content: 'Here are the most frequently asked questions about our services.',
    background_color: '#f9fafb'
  };
  
  // Convert refundPageData to RefundPolicy component format
  const refundPageFormatted = refundPageData ? {
    ...refundPageData,
    description: refundPageData.description || refundPageData.subtitle,
    story_content: refundPageData.story_content || refundPageData.content,
    values: refundPageData.values || undefined,
    stats: refundPageData.stats || undefined
  } : {
    title: 'Refund Policy',
    description: 'We stand behind our service with a satisfaction guarantee. Here\'s everything you need to know about our refund policy.',
    story_title: 'Refund Policy',
    story_content: 'We offer a 30-day money back guarantee for all premium plans.',
    background_color: '#f9fafb'
  };
  
  // Convert contactPageData to ContactPage component format
  const contactPageFormatted = contactPageData ? {
    ...contactPageData,
    description: contactPageData.description || contactPageData.subtitle,
    sections: contactPageData.sections || undefined
  } : {
    title: 'Contact Us',
    description: 'We\'re here to help! Get in touch with our team and we\'ll get back to you as soon as possible.',
    sections: []
  };
  
  return (
    <>
      <Head>
        <title>{customPageData?.title || page.meta_title || page.title}</title>
        {(customPageData?.description || page.meta_description) && (
          <meta name="description" content={customPageData?.description || page.meta_description} />
        )}
        <style>{customCSS}</style>
      </Head>
      
      <div 
        className="min-h-screen bg-white" 
        style={{ 
          '--primary-color': primaryColor,
          '--secondary-color': secondaryColor,
          '--accent-color': accentColor
        } as React.CSSProperties}
      >
        <Header 
          settings={{
            ...settings,
            business_directory_enabled: settings?.business_directory_enabled
          }} 
          customPages={[]}
          sectionData={settings?.config_sections?.sections?.find(s => s.key === 'header') || {}}
          brandColor={primaryColor}
        />
        
        <main className="pt-16 min-h-screen">
          {isAboutUsPage ? (
            <div className="custom-page-content">
              <AboutUs
                settings={settings}
                sectionData={aboutPageFormatted || aboutUsData || {}}
                brandColor={primaryColor}
              />
            </div>
          ) : isPrivacyPage ? (
            <div className="custom-page-content">
              <PrivacyPolicy
                settings={settings}
                sectionData={privacyPageFormatted}
                brandColor={primaryColor}
              />
            </div>
          ) : isTermsPage ? (
            <div className="custom-page-content">
              <TermsOfService
                settings={settings}
                sectionData={termsPageFormatted}
                brandColor={primaryColor}
              />
            </div>
          ) : isFaqPage ? (
            <div className="custom-page-content">
              <FaqPage
                settings={settings}
                sectionData={faqPageFormatted}
                brandColor={primaryColor}
              />
            </div>
          ) : isRefundPage ? (
            <div className="custom-page-content">
              <RefundPolicy
                settings={settings}
                sectionData={refundPageFormatted}
                brandColor={primaryColor}
              />
            </div>
          ) : isContactPage ? (
            <div className="custom-page-content">
              <ContactPage
                settings={settings}
                sectionData={contactPageFormatted}
                brandColor={primaryColor}
                flash={pageProps.flash}
              />
            </div>
          ) : customPageData ? (
              <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {customPageData.title || customPageData.name}
                    </h1>
                    {(customPageData.subtitle || page.subtitle) && (
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        {customPageData.subtitle || page.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-8 border border-gray-200">
                    <div className="custom-page-content" dangerouslySetInnerHTML={{ __html: customPageData.content || '' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {page.title}
                    </h1>
                    {page.subtitle && (
                      <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
                        {page.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="bg-white rounded-xl p-8 border border-gray-200">
                    <div className="custom-page-content" dangerouslySetInnerHTML={{ __html: page.content || '' }} />
                  </div>
                </div>
              </div>
            )}
        </main>
        
        <Footer 
          settings={settings} 
          sectionData={settings?.config_sections?.sections?.find(s => s.key === 'footer') || {}} 
          brandColor={primaryColor}
        />
      </div>
    </>
  );
}
