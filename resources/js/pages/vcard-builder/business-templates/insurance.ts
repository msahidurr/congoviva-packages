import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const insuranceTemplate = {
  name: t('Insurance'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Professional Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'location', type: 'text', label: t('Office Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Professional Summary') },
        { name: 'specializations', type: 'tags', label: t('Insurance Specializations') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'licenses', type: 'tags', label: t('Professional Licenses') }
      ],
      required: false
    },
    {
      key: 'insurance_services',
      name: t('Insurance Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Insurance Products'),
          fields: [
            { name: 'title', type: 'text', label: t('Insurance Type') },
            { name: 'description', type: 'textarea', label: t('Coverage Details') },
            { name: 'features', type: 'tags', label: t('Key Features') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'claims_support',
      name: t('Claims Support'),
      fields: [
        { name: 'claims_phone', type: 'tel', label: t('24/7 Claims Hotline') },
        { name: 'claims_email', type: 'email', label: t('Claims Email') },
        { name: 'claims_portal', type: 'url', label: t('Online Claims Portal') },
        { name: 'emergency_contact', type: 'tel', label: t('Emergency Contact') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Client Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Client Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'policy_type', type: 'text', label: t('Policy Type') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'social',
      name: t('Social Media'),
      fields: [
        {
          name: 'social_links',
          type: 'repeater',
          label: t('Social Media Links'),
          fields: [
            { name: 'platform', type: 'select', label: t('Platform'), options: socialPlatformsConfig.map(p => ({ value: p.value, label: p.label })) },
            { name: 'url', type: 'url', label: t('Profile URL') },
            { name: 'username', type: 'text', label: t('Username/Handle') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'business_hours',
      name: t('Business Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Office Hours'),
          fields: [
            { name: 'day', type: 'select', label: t('Day'), options: [
              { value: 'monday', label: t('Monday') },
              { value: 'tuesday', label: t('Tuesday') },
              { value: 'wednesday', label: t('Wednesday') },
              { value: 'thursday', label: t('Thursday') },
              { value: 'friday', label: t('Friday') },
              { value: 'saturday', label: t('Saturday') },
              { value: 'sunday', label: t('Sunday') }
            ]},
            { name: 'open_time', type: 'time', label: t('Opening Time') },
            { name: 'close_time', type: 'time', label: t('Closing Time') },
            { name: 'is_closed', type: 'checkbox', label: t('Closed') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Appointments'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Consultation Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') }
      ],
      required: false
    },
    {
      key: 'google_map',
      name: t('Office Location'),
      fields: [
        { name: 'map_embed_url', type: 'textarea', label: t('Google Maps Embed URL') },
        { name: 'directions_url', type: 'url', label: t('Google Maps Directions URL') }
      ],
      required: false
    },
    {
      key: 'app_download',
      name: t('Mobile App'),
      fields: [
        { name: 'app_store_url', type: 'url', label: t('App Store URL') },
        { name: 'play_store_url', type: 'url', label: t('Play Store URL') }
      ],
      required: false
    },
    {
      key: 'custom_html',
      name: t('Custom HTML'),
      fields: [
        { name: 'html_content', type: 'textarea', label: t('Custom HTML Code') },
        { name: 'section_title', type: 'text', label: t('Section Title') },
        { name: 'show_title', type: 'checkbox', label: t('Show Section Title') }
      ],
      required: false
    },
    {
      key: 'qr_share',
      name: t('QR Code Share'),
      fields: [
        { name: 'enable_qr', type: 'checkbox', label: t('Enable QR Code Sharing') },
        { name: 'qr_title', type: 'text', label: t('QR Section Title') },
        { name: 'qr_description', type: 'textarea', label: t('QR Description') },
        { name: 'qr_size', type: 'select', label: t('QR Code Size'), options: [
          { value: 'small', label: t('Small (128px)') },
          { value: 'medium', label: t('Medium (200px)') },
          { value: 'large', label: t('Large (300px)') }
        ]}
      ],
      required: false
    },
    {
      key: 'contact_form',
      name: t('Contact Form'),
      fields: [
        { name: 'form_title', type: 'text', label: t('Form Title') },
        { name: 'form_description', type: 'textarea', label: t('Form Description') }
      ],
      required: false
    },
    {
      key: 'language',
      name: t('Language Settings'),
      fields: [
        { name: 'enable_language_switcher', type: 'checkbox', label: t('Enable Language Switcher') },
        { name: 'template_language', type: 'select', label: t('Template Language'), options: languageData.map(lang => ({ value: lang.code, label: `${String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))} ${lang.name}` })) }
      ],
      required: false
    },
    {
      key: 'thank_you',
      name: t('Thank You Message'),
      fields: [
        { name: 'message', type: 'textarea', label: t('Thank You Message') }
      ],
      required: false
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'appointment_button_text', type: 'text', label: t('Consultation Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') }
      ],
      required: false
    },
    {
      key: 'copyright',
      name: t('Copyright'),
      fields: [
        { name: 'text', type: 'text', label: t('Copyright Text') }
      ],
      required: false
    },
    {
      key: 'seo',
      name: t('SEO Settings'),
      fields: [
        { name: 'meta_title', type: 'text', label: t('Meta Title') },
        { name: 'meta_description', type: 'textarea', label: t('Meta Description') },
        { name: 'keywords', type: 'text', label: t('Keywords') },
        { name: 'og_image', type: 'url', label: t('Open Graph Image URL') }
      ],
      required: false
    },
    {
      key: 'pixels',
      name: t('Pixel & Analytics'),
      fields: [
        { name: 'google_analytics', type: 'text', label: t('Google Analytics ID') },
        { name: 'facebook_pixel', type: 'text', label: t('Facebook Pixel ID') },
        { name: 'gtm_id', type: 'text', label: t('Google Tag Manager ID') },
        { name: 'custom_head', type: 'textarea', label: t('Custom Head Code') },
        { name: 'custom_body', type: 'textarea', label: t('Custom Body Code') }
      ],
      required: false
    },
    {
      key: 'footer',
      name: t('Footer'),
      fields: [
        { name: 'show_footer', type: 'checkbox', label: t('Show Footer') },
        { name: 'footer_text', type: 'textarea', label: t('Footer Text') },
        { name: 'footer_links', type: 'repeater', label: t('Footer Links'), fields: [
          { name: 'title', type: 'text', label: t('Link Title') },
          { name: 'url', type: 'url', label: t('Link URL') }
        ]}
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Trust Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#60A5FA', background: '#F8FAFC', text: '#1E293B', cardBg: '#FFFFFF', borderColor: '#E2E8F0', successColor: '#059669', warningColor: '#D97706' },
    { name: 'Secure Green', primary: '#059669', secondary: '#10B981', accent: '#34D399', background: '#F0FDF4', text: '#064E3B', cardBg: '#FFFFFF', borderColor: '#D1FAE5', successColor: '#059669', warningColor: '#F59E0B' },
    { name: 'Corporate Gray', primary: '#374151', secondary: '#6B7280', accent: '#9CA3AF', background: '#F9FAFB', text: '#111827', cardBg: '#FFFFFF', borderColor: '#E5E7EB', successColor: '#059669', warningColor: '#D97706' },
    { name: 'Premium Gold', primary: '#D97706', secondary: '#F59E0B', accent: '#FBBF24', background: '#FFFBEB', text: '#92400E', cardBg: '#FFFFFF', borderColor: '#FED7AA', successColor: '#059669', warningColor: '#DC2626' },
    { name: 'Executive Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#A78BFA', background: '#FAF5FF', text: '#581C87', cardBg: '#FFFFFF', borderColor: '#E9D5FF', successColor: '#059669', warningColor: '#D97706' },
    { name: 'Classic Red', primary: '#DC2626', secondary: '#EF4444', accent: '#F87171', background: '#FEF2F2', text: '#991B1B', cardBg: '#FFFFFF', borderColor: '#FECACA', successColor: '#059669', warningColor: '#F59E0B' }
  ],
  fontOptions: [
    { name: 'Inter Professional', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto Business', value: 'Roboto, Arial, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, Arial, sans-serif', weight: '400,600,700' },
    { name: 'Lato Corporate', value: 'Lato, Arial, sans-serif', weight: '400,700' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, Arial, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0',
    successColor: '#059669',
    warningColor: '#D97706'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'professional-card',
    headerStyle: 'corporate',
    cardStyle: 'elevated',
    buttonStyle: 'rounded',
    iconStyle: 'filled',
    spacing: 'comfortable',
    shadows: 'subtle',
    animations: 'smooth',
    backgroundPattern: 'subtle-grid',
    trustIndicators: true,
    professionalBadges: true
  },
  defaultData: {
    header: {
      name: 'Sarah Johnson',
      title: 'Licensed Insurance Agent',
      tagline: 'Protecting your future with comprehensive insurance solutions',
      profile_image: ''
    },
    contact: {
      email: 'sarah@insuranceexpert.com',
      phone: '+1 (555) 123-4567',
      website: 'https://sarahjohnsoninsurance.com',
      location: 'Downtown Financial District, New York'
    },
    about: {
      description: 'With over 10 years of experience in the insurance industry, I specialize in helping individuals and businesses find the right coverage for their unique needs. My commitment is to provide personalized service and expert guidance through every step of your insurance journey.',
      specializations: 'Life Insurance, Health Insurance, Auto Insurance, Home Insurance, Business Insurance, Disability Insurance',
      experience: '10',
      licenses: 'Property & Casualty License, Life & Health License, Series 6, Series 63'
    },
    insurance_services: {
      service_list: [
        { 
          title: 'Life Insurance', 
          description: 'Term and whole life insurance policies to protect your family\'s financial future',
          features: 'Competitive rates, Flexible terms, Quick approval process'
        },
        { 
          title: 'Auto Insurance', 
          description: 'Comprehensive vehicle coverage with competitive rates and excellent customer service',
          features: 'Multi-car discounts, 24/7 claims support, Roadside assistance'
        },
        { 
          title: 'Home Insurance', 
          description: 'Protect your home and belongings with customizable coverage options',
          features: 'Replacement cost coverage, Personal liability, Additional living expenses'
        },
        { 
          title: 'Business Insurance', 
          description: 'Commercial insurance solutions to protect your business operations',
          features: 'General liability, Professional liability, Workers compensation'
        }
      ]
    },
    claims_support: {
      claims_phone: '+1 (800) 555-CLAIM',
      claims_email: 'claims@insuranceexpert.com',
      claims_portal: 'https://claims.insuranceexpert.com',
      emergency_contact: '+1 (800) 555-HELP'
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnsoninsurance', username: 'sarahjohnsoninsurance' },
        { platform: 'facebook', url: 'https://facebook.com/sarahjohnsoninsurance', username: 'Sarah Johnson Insurance' },
        { platform: 'twitter', url: 'https://twitter.com/sjinsurance', username: '@sjinsurance' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '08:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '14:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/sarahjohnsoninsurance',
      calendar_link: 'https://calendar.google.com/sarahjohnson'
    },
    testimonials: {
      reviews: [
        { 
          client_name: 'Michael Thompson', 
          review: 'Sarah helped me find the perfect life insurance policy for my family. Her expertise and personal attention made the process smooth and stress-free.',
          rating: '5',
          policy_type: 'Life Insurance'
        },
        { 
          client_name: 'Jennifer Davis', 
          review: 'Excellent service! Sarah saved me hundreds on my auto insurance while providing better coverage. Highly recommend!',
          rating: '5',
          policy_type: 'Auto Insurance'
        },
        { 
          client_name: 'Robert Wilson', 
          review: 'Professional, knowledgeable, and always available when I need assistance. Sarah is the best insurance agent I\'ve worked with.',
          rating: '5',
          policy_type: 'Business Insurance'
        }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Financial%20District%20New%20York%20NY&z=14&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Financial+District+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/geico-mobile-car-insurance/id331763096',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.geico.mobile'
    },
    contact_form: {
      form_title: 'Get Your Free Quote',
      form_description: 'Ready to protect what matters most? Contact me today for a personalized insurance consultation and free quote.'
    },
    thank_you: {
      message: 'Thank you for your interest! I\'ll review your information and get back to you within 24 hours with a personalized quote.'
    },
    seo: {
      meta_title: 'Sarah Johnson - Licensed Insurance Agent | Life, Auto, Home & Business Insurance',
      meta_description: 'Professional insurance agent with 10+ years experience. Specializing in life, auto, home, and business insurance. Get your free quote today!',
      keywords: 'insurance agent, life insurance, auto insurance, home insurance, business insurance, licensed agent',
      og_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80'
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="trust-badges"><h4>Licensed & Certified</h4><p>Fully licensed insurance professional with industry certifications and memberships.</p></div>',
      section_title: 'Professional Credentials',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Save My Contact',
      qr_description: 'Scan to save my contact information and get instant access to insurance quotes.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'Get Free Quote',
      appointment_button_text: 'Schedule Consultation',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Licensed insurance professional committed to protecting your financial future. All insurance products subject to underwriting approval.',
      footer_links: [
        { title: 'Get Quote', url: '#contact' },
        { title: 'Claims Support', url: '#claims' },
        { title: 'Policy Review', url: '#appointment' },
        { title: 'Resources', url: '#resources' }
      ]
    },
    copyright: {
      text: '© 2025 Sarah Johnson Insurance Services. Licensed Agent. All rights reserved.'
    }
  }
};
