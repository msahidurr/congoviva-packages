import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  grid_cols: number;
  rows?: number;
}

interface ContactPageProps {
  brandColor?: string;
  settings: any;
  sectionData?: {
    title?: string;
    description?: string;
    form_title?: string;
    email?: string;
    phone?: string;
    address?: string;
    show_business_hours?: boolean;
    weekdays_hours?: string;
    weekend_hours?: string;
    sunday_hours?: string;
    show_map?: boolean;
    map_location?: string;
    map_embed_url?: string;
    background_color?: string;
    form_fields?: FormField[];
    sections?: Array<{
      title: string;
      content: string;
      color: string;
      items?: string[];
    }>;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function ContactPage({ settings, sectionData, brandColor = '#3b82f6', flash }: ContactPageProps) {
  const { t } = useTranslation();
  
  // Initialize form data based on dynamic fields
  const defaultFormFields = [
    { name: 'name', label: t('Full Name'), type: 'text', required: true, placeholder: t('Your full name'), grid_cols: 1 },
    { name: 'email', label: t('Email Address'), type: 'email', required: true, placeholder: t('your@email.com'), grid_cols: 1 },
    { name: 'phone', label: t('Phone Number'), type: 'tel', required: false, placeholder: t('+1 (555) 123-4567'), grid_cols: 2 },
    { name: 'subject', label: t('Subject'), type: 'text', required: true, placeholder: t('What\'s this about?'), grid_cols: 2 },
    { name: 'message', label: t('Message'), type: 'textarea', required: true, placeholder: t('Tell us more about your inquiry...'), grid_cols: 2, rows: 3 }
  ];
  
  const formFields = defaultFormFields;
  
  const initialFormData = formFields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {} as Record<string, string>);
  
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    router.post(route('landing-page.contact'), formData, {
      onSuccess: () => {
        setFormData(initialFormData);
        setIsSubmitting(false);
      },
      onError: (errors) => {
        setIsSubmitting(false);
        const errorMessages = Object.values(errors).flat().join(', ');
        toast.error(errorMessages || 'Please check your input and try again.');
      }
    });
  };

  // Dynamic values with proper fallback chain
  const pageTitle = sectionData?.title || t('Contact Us');
  const pageDescription = sectionData?.description || '';
  const formTitle = sectionData?.form_title || t('Send us a Message');
  const contactEmail = sectionData?.email || settings?.contact_email || '';
  const contactPhone = sectionData?.phone || settings?.contact_phone || '';
  const contactAddress = sectionData?.address || settings?.contact_address || '';
  const showBusinessHours = sectionData?.show_business_hours !== false;
  const weekdaysHours = sectionData?.weekdays_hours || 'Monday - Friday: 9:00 AM - 6:00 PM EST';
  const weekendHours = sectionData?.weekend_hours || 'Saturday: 10:00 AM - 4:00 PM EST';
  const sundayHours = sectionData?.sunday_hours || 'Sunday: Closed';
  const showMap = sectionData?.show_map === true;
  const mapLocation = sectionData?.map_location || '';
  const mapEmbedUrl = sectionData?.map_embed_url || '';
  
  // Convert Google Maps sharing URL or iframe to embed URL
  const convertToEmbedUrl = (input: string): string => {
    if (!input) return '';
    
    // If input contains iframe HTML, extract the src URL
    if (input.includes('<iframe') && input.includes('src=')) {
      const srcMatch = input.match(/src=["'](.*?)["']/i);
      if (srcMatch) {
        return srcMatch[1];
      }
    }
    
    // If it's already an embed URL, return as is
    if (input.includes('maps/embed')) return input;
    
    // For Google Maps sharing URLs, convert to embed format
    if (input.includes('maps.app.goo.gl') || input.includes('goo.gl/maps')) {
      // Convert shortened URL to embed by replacing the domain
      return input.replace('maps.app.goo.gl/', 'www.google.com/maps/embed?pb=');
    }
    
    // For regular Google Maps URLs, add embed parameter
    if (input.includes('google.com/maps')) {
      return input.includes('output=embed') ? input : input + '&output=embed';
    }
    
    // Fallback: return original input
    return input;
  };

  const processedMapUrl = convertToEmbedUrl(mapEmbedUrl);
  const backgroundColor = sectionData?.background_color || '#f9fafb';

  // Default sections with dynamic contact info
  const defaultSections = [
    {
      title: t('Get in Touch'),
      content: t('We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'),
      color: 'blue',
      items: []
    },
    {
      title: t('Contact Information'),
      content: t('Reach out to us through any of these channels:'),
      color: 'green',
      items: [
        `${t('Email')}: ${contactEmail}`,
        `${t('Phone')}: ${contactPhone}`,
        `${t('Address')}: ${contactAddress}`
      ]
    }
  ];

  // Add business hours to default sections if enabled (default is enabled)
  if (sectionData?.show_business_hours !== false) {
    defaultSections.push({
      title: t('Business Hours'),
      content: t('Our support team is available during these hours:'),
      color: 'purple',
      items: [
        weekdaysHours,
        weekendHours,
        sundayHours
      ].filter(item => item && item.trim())
    });
  }

  // Use custom sections if available, otherwise use defaults
  let sections = sectionData?.sections && sectionData.sections.length > 0 
    ? [...sectionData.sections] 
    : [...defaultSections];

  // Ensure contact information section exists if not in custom sections
  const hasContactInfo = sections.some(s => s.title.toLowerCase().includes('contact information') || s.title.toLowerCase().includes('contact'));
  if (!hasContactInfo) {
    sections.push({
      title: t('Contact Information'),
      content: t('Reach out to us through any of these channels:'),
      color: 'green',
      items: [
        `${t('Email')}: ${contactEmail}`,
        `${t('Phone')}: ${contactPhone}`,
        `${t('Address')}: ${contactAddress}`
      ]
    });
  }

  // Add business hours section if enabled from settings
  if (showBusinessHours) {
    const hasBusinessHours = sections.some(s => s.title.toLowerCase().includes('business hours') || s.title.toLowerCase().includes('hours'));
    if (!hasBusinessHours && sectionData?.show_business_hours !== false) {
      sections.push({
        title: t('Business Hours'),
        content: t('Our support team is available during these hours:'),
        color: 'purple',
        items: [
          weekdaysHours,
          weekendHours,
          sundayHours
        ].filter(item => item && item.trim())
      });
    }
  }

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

  const renderFormField = (field: FormField) => {
    const gridClass = field.grid_cols === 2 ? 'sm:col-span-2' : '';
    const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent";
    const style = { '--tw-ring-color': brandColor + '33' } as React.CSSProperties;

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className={gridClass}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            rows={field.rows || 6}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className={`${inputClass} resize-none`}
            style={style}
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      );
    }

    return (
      <div key={field.name} className={gridClass}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={field.type}
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleInputChange}
          className={inputClass}
          style={style}
          placeholder={field.placeholder}
          required={field.required}
        />
      </div>
    );
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {pageDescription}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{formTitle}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {formFields.map(renderFormField)}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white px-8 py-4 rounded-lg transition-colors font-semibold hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: brandColor }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information Sections */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {sections.map((section, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className={`border-l-4 pl-4 ${getColorClass(section.color).split(' ')[0]}`}>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {section.content}
                    </p>
                    {section.items && section.items.length > 0 && (
                      <ul className="space-y-1 text-gray-600 text-sm">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <span className={`w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0 ${getColorClass(section.color).split(' ')[1]}`}></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Map Section */}
            {showMap && sectionData?.show_map === true && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t('Find Us')}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {t('Visit us at our location')}: {mapLocation}
                  </p>
                  {processedMapUrl ? (
                    <div className="rounded-lg overflow-hidden">
                      <iframe
                        src={processedMapUrl}
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                      <p className="text-sm">{t('Map integration would be displayed here')}</p>
                      <p className="text-xs">{t('Location')}: {mapLocation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
