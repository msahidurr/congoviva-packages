import React from 'react';

interface PrivacyPolicyProps {
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

export default function PrivacyPolicy({ settings, sectionData, brandColor = '#3b82f6' }: PrivacyPolicyProps) {
  const defaultSections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, including:',
      color: 'blue',
      items: [
        'Account registration information',
        'Profile and business card details', 
        'Communication preferences',
        'Usage analytics and performance data'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to:',
      color: 'green',
      items: [
        'Provide and maintain our services',
        'Process transactions and send notifications',
        'Improve our platform and user experience',
        'Communicate with you about updates and features'
      ]
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell, trade, or otherwise transfer your personal information to third parties without your explicit consent, except as described in this policy.',
      color: 'purple',
      items: []
    },
    {
      title: 'Data Security',
      content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      color: 'red',
      items: []
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
            {sectionData?.title || 'Privacy Policy'}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {sectionData?.description || 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-gray-200 space-y-8">
          {sections.map((section, index) => (
            <div key={index} className={`border-l-4 pl-6 ${getColorClass(section.color).split(' ')[0]}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {section.content}
              </p>
              {section.items && section.items.length > 0 && (
                <ul className="space-y-2 text-gray-600">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${getColorClass(section.color).split(' ')[1]}`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}