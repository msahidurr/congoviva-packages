import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const lawfirmTemplate = {
  name: t('Law Firm'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Attorney/Firm Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile/Logo Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me/Firm') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'satisfied_clients', type: 'text', label: t('Satisfied Clients Count') },
        { name: 'education', type: 'textarea', label: t('Education') },
        { name: 'bar_admissions', type: 'textarea', label: t('Bar Admissions') }
      ],
      required: false
    },
    {
      key: 'practice_areas',
      name: t('Practice Areas'),
      fields: [
        {
          name: 'areas',
          type: 'repeater',
          label: t('Practice Areas'),
          fields: [
            { name: 'title', type: 'text', label: t('Area Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'family', label: t('Family Law') },
              { value: 'corporate', label: t('Corporate Law') },
              { value: 'criminal', label: t('Criminal Law') },
              { value: 'real-estate', label: t('Real Estate Law') },
              { value: 'immigration', label: t('Immigration Law') },
              { value: 'intellectual', label: t('Intellectual Property') },
              { value: 'personal-injury', label: t('Personal Injury') },
              { value: 'tax', label: t('Tax Law') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'location', type: 'text', label: t('Office Location') },
        { name: 'fax', type: 'tel', label: t('Fax Number') }
      ],
      required: true
    },
    {
      key: 'videos',
      name: t('Legal Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Legal Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'legal_education', label: t('Legal Education') },
              { value: 'case_study', label: t('Case Study') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'law_explanation', label: t('Law Explanation') },
              { value: 'firm_introduction', label: t('Firm Introduction') },
              { value: 'legal_tips', label: t('Legal Tips') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'youtube',
      name: t('YouTube Channel'),
      fields: [
        { name: 'channel_url', type: 'url', label: t('YouTube Channel URL') },
        { name: 'channel_name', type: 'text', label: t('Channel Name') },
        { name: 'subscriber_count', type: 'text', label: t('Subscriber Count') },
        { name: 'featured_playlist', type: 'url', label: t('Featured Playlist URL') },
        { name: 'latest_video_embed', type: 'textarea', label: t('Latest Video Embed Code') },
        { name: 'channel_description', type: 'textarea', label: t('Channel Description') }
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Legal Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'fee_structure', type: 'select', label: t('Fee Structure'), options: [
              { value: 'hourly', label: t('Hourly Rate') },
              { value: 'flat', label: t('Flat Fee') },
              { value: 'contingency', label: t('Contingency Fee') },
              { value: 'retainer', label: t('Retainer') },
              { value: 'consultation', label: t('Free Consultation') }
            ]},
            { name: 'price', type: 'text', label: t('Price/Rate (if applicable)') }
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
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'section_title', type: 'text', label: t('Section Title') },
        { name: 'section_description', type: 'textarea', label: t('Section Description') },
        { name: 'consultation_text', type: 'text', label: t('Consultation Button Text') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Client Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'case_type', type: 'text', label: t('Case Type') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'google_map',
      name: t('Location'),
      fields: [
        { name: 'map_embed_url', type: 'textarea', label: t('Google Maps Embed URL') },
        { name: 'directions_url', type: 'url', label: t('Google Maps Directions URL') }
      ],
      required: false
    },
    {
      key: 'app_download',
      name: t('App Download'),
      fields: [
        { name: 'app_store_url', type: 'url', label: t('App Store URL') },
        { name: 'play_store_url', type: 'url', label: t('Play Store URL') },
        { name: 'app_description', type: 'textarea', label: t('App Description') }
      ],
      required: false
    },
    {
      key: 'contact_form',
      name: t('Contact Form'),
      fields: [
        { name: 'form_title', type: 'text', label: t('Form Title') },
        { name: 'form_description', type: 'textarea', label: t('Form Description') },
        { name: 'confidentiality_note', type: 'textarea', label: t('Confidentiality Note') }
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
      key: 'language',
      name: t('Language Settings'),
      fields: [
        { name: 'enable_language_switcher', type: 'checkbox', label: t('Enable Language Switcher') },
        { name: 'template_language', type: 'select', label: t('Template Language'), options: languageData.map(lang => ({ value: lang.code, label: `${String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))} ${lang.name}` })) }
      ],
      required: false
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'consultation_button_text', type: 'text', label: t('Consultation Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') }
      ],
      required: false
    },
    {
      key: 'copyright',
      name: t('Copyright'),
      fields: [
        { name: 'text', type: 'text', label: t('Copyright Text') },
        { name: 'disclaimer', type: 'textarea', label: t('Legal Disclaimer') }
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
    }
  ],
  colorPresets: [
    { name: 'Classic Navy', primary: '#0A3161', secondary: '#1E5091', accent: '#E6ECF2', background: '#FFFFFF', text: '#333333' },
    { name: 'Corporate Gray', primary: '#4A5568', secondary: '#718096', accent: '#EDF2F7', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Burgundy Law', primary: '#8B0000', secondary: '#A52A2A', accent: '#F5E6E6', background: '#FFFFFF', text: '#333333' },
    { name: 'Forest Justice', primary: '#2F4F4F', secondary: '#3E6363', accent: '#E8EFEF', background: '#FFFFFF', text: '#333333' },
    { name: 'Gold Standard', primary: '#B8860B', secondary: '#DAA520', accent: '#FFF8E6', background: '#FFFFFF', text: '#333333' },
    { name: 'Modern Slate', primary: '#2C3E50', secondary: '#34495E', accent: '#ECF0F1', background: '#FFFFFF', text: '#2C3E50' }
  ],
  fontOptions: [
    { name: 'Times New Roman', value: 'Times New Roman, Times, serif', weight: '400,700' },
    { name: 'Garamond', value: 'EB Garamond, Garamond, serif', weight: '400,500,600,700' },
    { name: 'Baskerville', value: 'Libre Baskerville, Baskerville, serif', weight: '400,700' },
    { name: 'Palatino', value: 'Palatino Linotype, Book Antiqua, Palatino, serif', weight: '400,700' },
    { name: 'Century', value: 'Century Schoolbook, Century, serif', weight: '400,700' }
  ],
  defaultColors: {
    primary: '#0A3161',
    secondary: '#1E5091',
    accent: '#E6ECF2',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    goldAccent: '#DAA520'
  },
  defaultFont: 'Times New Roman, Times, serif',
  themeStyle: {
    layout: 'legal-layout',
    headerStyle: 'professional',
    cardStyle: 'bordered',
    buttonStyle: 'classic',
    iconStyle: 'simple',
    spacing: 'formal',
    shadows: 'subtle',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'Johnson & Associates',
      title: 'Attorneys at Law',
      tagline: 'Dedicated to protecting your rights and interests',
      profile_image: ''
    },
    about: {
      description: 'With over 25 years of experience, our firm provides exceptional legal representation across a wide range of practice areas. We are committed to understanding each client needs and delivering personalized legal solutions.',
      experience: '25',
      satisfied_clients: '1000+',
      education: 'Harvard Law School, J.D.\\nYale University, B.A. Political Science',
      bar_admissions: 'New York State Bar\\nU.S. District Court, Southern District of New York\\nU.S. Supreme Court'
    },
    practice_areas: {
      areas: [
        { title: 'Family Law', description: 'Divorce, child custody, support, and adoption matters handled with sensitivity and expertise.', icon: 'family' },
        { title: 'Corporate Law', description: 'Comprehensive legal services for businesses of all sizes, from formation to complex transactions.', icon: 'corporate' },
        { title: 'Real Estate Law', description: 'Representation for residential and commercial real estate transactions and disputes.', icon: 'real-estate' },
        { title: 'Personal Injury', description: 'Advocating for victims of negligence to secure fair compensation for injuries.', icon: 'personal-injury' }
      ]
    },
    contact: {
      email: 'info@johnsonlaw.com',
      phone: '(212) 555-1234',
      website: 'https://www.johnsonlaw.com',
      location: '123 Legal Avenue, Suite 500, New York, NY 10001',
      fax: '(212) 555-5678'
    },
    services: {
      service_list: [
        { title: 'Initial Consultation', description: 'A comprehensive review of your legal matter to determine the best course of action.', fee_structure: 'consultation', price: 'Free' },
        { title: 'Legal Representation', description: 'Full representation for your case, including all necessary court appearances and filings.', fee_structure: 'hourly', price: '$350-$450/hour' },
        { title: 'Document Preparation', description: 'Drafting and review of legal documents tailored to your specific needs.', fee_structure: 'flat', price: 'Starting at $500' },
        { title: 'Mediation Services', description: 'Professional mediation to resolve disputes without costly litigation.', fee_structure: 'flat', price: '$1,200 per session' }
      ]
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/johnson-associates', username: 'Johnson & Associates' },
        { platform: 'facebook', url: 'https://facebook.com/johnsonlaw', username: 'Johnson & Associates Law' },
        { platform: 'twitter', url: 'https://twitter.com/johnsonlaw', username: '@johnsonlaw' },
        { platform: 'youtube', url: 'https://youtube.com/johnsonlaw', username: 'Johnson & Associates Law' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Understanding Your Rights in Family Law', description: 'Comprehensive guide to family law rights and procedures', video_type: 'legal_education', embed_url: 'https://www.youtube.com/watch?v=ESGc04YmkRs', thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80', duration: '12:30' },
        { title: 'Successful Corporate Merger Case Study', description: 'How we helped a client navigate a complex corporate merger', video_type: 'case_study', embed_url: 'https://www.youtube.com/watch?v=oFnhgBdmyI4', thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80', duration: '8:45' },
        { title: 'Client Success Story - Personal Injury Case', description: 'Client testimonial about their personal injury case outcome', video_type: 'client_testimonial', embed_url: 'https://www.youtube.com/watch?v=u2B7keQzSEs', thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80', duration: '4:20' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/johnsonlaw',
      channel_name: 'Johnson & Associates Law',
      subscriber_count: '12.4K',
      featured_playlist: 'https://youtube.com/playlist?list=PLlegaleducation',
      latest_video_embed: 'https://www.youtube.com/watch?v=ESGc04YmkRs',
      channel_description: 'Legal education, case studies, and client success stories from experienced attorneys. Subscribe for weekly legal insights and tips.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:30', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '17:30', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '17:30', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '17:30', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '', close_time: '', is_closed: true },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/johnsonlaw',
      calendar_link: 'https://calendar.google.com/johnsonlaw',
      section_title: 'Need Legal Assistance?',
      section_description: 'Schedule a consultation with our experienced attorneys to discuss your case.',
      consultation_text: 'Schedule a Free Consultation'
    },
    testimonials: {
      reviews: [
        { client_name: 'Robert M.', review: 'Johnson & Associates provided exceptional representation in my corporate litigation case. Their expertise and strategic approach led to a favorable outcome.', case_type: 'Corporate Litigation' },
        { client_name: 'Sarah T.', review: 'I was extremely satisfied with the personal attention and professional guidance I received during my divorce proceedings. Highly recommended.', case_type: 'Family Law' },
        { client_name: 'Westside Properties LLC', review: 'The real estate team expertly navigated a complex commercial property transaction, ensuring our interests were protected throughout the process.', case_type: 'Real Estate' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Chelsea%20Piers%20Fitness%2C%20New%20York%2C%20NY&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Legal+Avenue+New+York+NY+10001'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/rocket-lawyer-legal-documents/id1374213536',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.rocketlawyer.mobile',
      app_description: 'Download our mobile app to schedule consultations, access case documents, and receive important updates on the go.'
    },
    contact_form: {
      form_title: 'Request a Consultation',
      form_description: 'Complete the form below to discuss your legal needs. Our team will respond promptly to schedule your consultation.',
      confidentiality_note: 'All communications are confidential and protected by attorney-client privilege. Submitting this form does not establish an attorney-client relationship.'
    },
    thank_you: {
      message: 'Thank you for contacting Johnson & Associates. We have received your inquiry and will respond within 1-2 business days. For urgent matters, please call our office directly.'
    },
    action_buttons: {
      contact_button_text: 'Contact Our Firm',
      consultation_button_text: 'Schedule Consultation',
      save_contact_button_text: 'Save Attorney Contact'
    },    seo: {
      meta_title: 'Johnson & Associates | Family, Corporate, and Personal Injury Law',
      meta_description: 'Experienced attorneys providing legal representation in family law, corporate law, real estate, and personal injury matters.',
      keywords: 'law firm, attorney, family law, corporate law, personal injury lawyer, legal consultation',
      og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="legal-credentials"><h4>Professional Credentials</h4><p>⚖️ Licensed in Multiple Jurisdictions</p><p>🏆 AV Preeminent Rated by Martindale-Hubbell</p><p>📜 Published Legal Scholar</p><p>🎤 Frequent Legal Conference Speaker</p></div>',
      section_title: 'Professional Recognition',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with Our Firm',
      qr_description: 'Scan to save our contact information and schedule a consultation.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Johnson & Associates. All rights reserved.',
      disclaimer: 'This website contains general information about legal matters. The information is not advice, and should not be treated as such. You should consult with an attorney for individual advice regarding your particular situation.'
    }
  }
};
