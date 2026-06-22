import React from 'react';

interface FaqPageProps {
  brandColor?: string;
  settings: any;
  sectionData: {
    title?: string;
    description?: string;
    sections?: Array<{
      title: string;
      icon_color: string;
      faqs: Array<{
        question: string;
        answer: string;
      }>;
    }>;
  };
}

export default function FaqPage({ settings, sectionData, brandColor = '#3b82f6' }: FaqPageProps) {
  const defaultSections = [
    {
      title: 'Getting Started',
      icon_color: 'blue',
      faqs: [
        {
          question: 'What is vCard?',
          answer: 'vCard is a comprehensive digital business card platform that allows you to create, customize, and share professional business cards online. Say goodbye to paper cards and hello to smart networking.'
        },
        {
          question: 'How do I create my first business card?',
          answer: 'Creating your business card is simple: 1) Sign up for a free account, 2) Choose from our professional templates, 3) Add your contact information and branding, 4) Customize colors, fonts, and layout, 5) Share via QR code, link, or NFC.'
        }
      ]
    },
    {
      title: 'Features & Plans',
      icon_color: 'purple',
      faqs: [
        {
          question: 'Can I use my own domain?',
          answer: 'Yes! Premium and Enterprise plans include custom domain support, allowing you to use your own branded URL for your digital business cards.'
        },
        {
          question: 'Is there a mobile app?',
          answer: 'vCard is fully responsive and works perfectly on all devices. We also offer native mobile apps for iOS and Android with additional features like NFC sharing.'
        }
      ]
    },
    {
      title: 'Analytics & Support',
      icon_color: 'green',
      faqs: [
        {
          question: 'How do I track my card performance?',
          answer: 'Our built-in analytics dashboard shows you detailed insights including views, clicks, saves, and engagement metrics.'
        }
      ]
    }
  ];

  const sections = sectionData?.sections && sectionData.sections.length > 0 
    ? sectionData.sections 
    : defaultSections.length > 0 ? defaultSections : [];

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-500',
      purple: 'bg-purple-50 text-purple-600 border-purple-500',
      green: 'bg-green-50 text-green-600 border-green-500',
      red: 'bg-red-50 text-red-600 border-red-500',
      yellow: 'bg-yellow-50 text-yellow-600 border-yellow-500',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIcon = (color: string) => {
    const icons = {
      blue: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
        </svg>
      ),
      purple: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      green: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      )
    };
    return icons[color as keyof typeof icons] || icons.blue;
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData?.title || 'Frequently Asked Questions'}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData?.description || 'Find quick answers to the most common questions'}
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${getColorClass(section.icon_color).split(' ')[0]} ${getColorClass(section.icon_color).split(' ')[1]}`}>
                  {getIcon(section.icon_color)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              
              <div className="space-y-6">
                {section.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className={`border-l-4 pl-6 ${getColorClass(section.icon_color).split(' ')[2]}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}