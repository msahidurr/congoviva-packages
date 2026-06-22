import React from 'react';
import { useTranslation } from 'react-i18next';

interface RefundPolicyProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    description?: string;
    sections?: Array<{
      title: string;
      content: string;
      color: string;
      items?: string[];
    }>;
  };
}

export default function RefundPolicy({ settings, sectionData, brandColor = '#3b82f6' }: RefundPolicyProps) {
  const { t } = useTranslation();
  const defaultSections = [
    {
      title: t('Eligible Refunds'),
      content: t('Refunds are available for:'),
      color: 'blue',
      items: [
        t('Monthly and annual subscription plans'),
        t('One-time premium features'),
        t('Unused portions of prepaid services')
      ]
    },
    {
      title: t('Refund Process'),
      content: t('To request a refund:'),
      color: 'purple',
      items: [
        t('Contact our support team within 30 days of purchase'),
        t('Provide your account details and reason for refund'),
        t('We\'ll process your request within 3-5 business days'),
        t('Refunds are issued to your original payment method')
      ]
    },
    {
      title: t('Non-Refundable Items'),
      content: t('The following items are non-refundable:'),
      color: 'green',
      items: [
        t('Custom development work and integrations'),
        t('Third-party services and add-ons'),
        t('Domain registration fees'),
        t('Services used beyond the 30-day period')
      ]
    }
  ];

  const sections = sectionData?.sections && sectionData.sections.length > 0 
    ? sectionData.sections 
    : defaultSections;

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-500',
      green: 'border-green-500 bg-green-500', 
      purple: 'border-purple-500 bg-purple-500',
      red: 'border-red-500 bg-red-500',
      yellow: 'border-yellow-500 bg-yellow-500',
      indigo: 'border-indigo-500 bg-indigo-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || t('Refund Policy')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData?.description || t('We stand behind our service with a satisfaction guarantee. Here\'s everything you need to know about our refund policy.')}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 space-y-8">
          {/* Guarantee Section */}
          <div className="rounded-xl p-6" style={{ backgroundColor: brandColor + '10', border: `1px solid ${brandColor}30` }}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ backgroundColor: brandColor }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{t('30-Day Money Back Guarantee')}</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t('We offer a')} <strong>{t('30-day money back guarantee')}</strong> {t('for all premium plans. If you\'re not completely satisfied with vCard, we\'ll refund your payment in full.')}
            </p>
          </div>

          {sections.map((section, index) => (
            <div key={index} className={`border-l-4 pl-6 ${getColorClass(section.color).split(' ')[0]}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {section.content}
              </p>
              {section.items && section.items.length > 0 && (
                section.color === 'purple' ? (
                  <ol className="space-y-2 text-gray-600">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className={`w-6 h-6 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0 ${getColorClass(section.color).split(' ')[1]}`}>
                          {itemIndex + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="space-y-2 text-gray-600">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${getColorClass(section.color).split(' ')[1]}`}></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          ))}

          {/* Contact Section */}
          <div className="rounded-xl p-6 text-center" style={{ backgroundColor: brandColor + '10', border: `1px solid ${brandColor}30` }}>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {sectionData?.cta_text || t('Questions?')}
            </h2>
            <p className="text-gray-600 mb-4">
              {sectionData?.cta_description || t('If you have any questions about our refund policy, please contact our support team. We\'re here to help!')}
            </p>
            <a 
              href={route('custom-page.show', 'contact-us')} 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-sm hover:brightness-110 hover:!text-white transition-all duration-200"
              style={{ backgroundColor: brandColor }}
            >
              {sectionData?.button_text || t('Contact Support')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}