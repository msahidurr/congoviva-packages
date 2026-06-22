import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const digitalMarketingTemplate = {
  name: t('Digital Marketing Agency'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Agency Name') },
        { name: 'title', type: 'text', label: t('Tagline') },
        { name: 'tagline', type: 'textarea', label: t('Description') },
        { name: 'profile_image', type: 'file', label: t('Logo') },
        { name: 'badge_1', type: 'text', label: t('Badge 1 Text') },
        { name: 'badge_2', type: 'text', label: t('Badge 2 Text') },
        { name: 'badge_3', type: 'text', label: t('Badge 3 Text') }
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
        { name: 'location', type: 'text', label: t('Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Agency') },
        { name: 'specialties', type: 'tags', label: t('Specialties') },
        { name: 'experience', type: 'number', label: t('Years in Business') }
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
          label: t('Marketing Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Starting Price') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Marketing Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Marketing Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'campaign_showcase', label: t('Campaign Showcase') },
              { value: 'tutorial', label: t('Marketing Tutorial') },
              { value: 'case_study', label: t('Case Study') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'industry_insights', label: t('Industry Insights') },
              { value: 'behind_scenes', label: t('Behind the Scenes') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'marketing_channel', type: 'select', label: t('Marketing Channel'), options: [
              { value: 'seo', label: t('SEO') },
              { value: 'ppc', label: t('PPC') },
              { value: 'social_media', label: t('Social Media') },
              { value: 'content_marketing', label: t('Content Marketing') },
              { value: 'email_marketing', label: t('Email Marketing') },
              { value: 'general', label: t('General Marketing') }
            ]}
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
      key: 'portfolio',
      name: t('Case Studies'),
      fields: [
        {
          name: 'projects',
          type: 'repeater',
          label: t('Success Stories'),
          fields: [
            { name: 'title', type: 'text', label: t('Campaign Title') },
            { name: 'image', type: 'file', label: t('Campaign Image') },
            { name: 'url', type: 'url', label: t('Case Study URL') },
            { name: 'results', type: 'text', label: t('Key Results') }
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
          label: t('Social Media Profiles'),
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
      name: t('Consultation Booking'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') }
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
            { name: 'company', type: 'text', label: t('Company') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') }
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
        { name: 'play_store_url', type: 'url', label: t('Play Store URL') }
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
      key: 'custom_html',
      name: t('Custom HTML'),
      fields: [
        { name: 'html_content', type: 'textarea', label: t('HTML Content') },
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
        { name: 'qr_description', type: 'textarea', label: t('QR Description') }
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
    }
  ],
  colorPresets: [
    { name: 'Digital Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', background: '#F8FAFC', text: '#1E293B', cardBg: '#FFFFFF' },
    { name: 'Marketing Orange', primary: '#EA580C', secondary: '#FB923C', accent: '#FED7AA', background: '#FFFBEB', text: '#1C1917', cardBg: '#FFFFFF' },
    { name: 'Creative Purple', primary: '#7C3AED', secondary: '#A78BFA', accent: '#E0E7FF', background: '#FAFAFA', text: '#374151', cardBg: '#FFFFFF' },
    { name: 'Growth Green', primary: '#059669', secondary: '#10b77f', accent: '#D1FAE5', background: '#F0FDF4', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Brand Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FFFBFB', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Social Pink', primary: '#DB2777', secondary: '#EC4899', accent: '#FCE7F3', background: '#FDF2F8', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Tech Teal', primary: '#0891B2', secondary: '#06B6D4', accent: '#CFFAFE', background: '#F0FDFA', text: '#1F2937', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' }
  ],
  defaultColors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#DBEAFE',
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  defaultFont: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'modern-card',
    headerStyle: 'gradient',
    cardStyle: 'elevated',
    buttonStyle: 'rounded',
    iconStyle: 'filled',
    spacing: 'comfortable',
    shadows: 'soft',
    animations: 'smooth',
    backgroundPattern: 'subtle-grid'
  },
  defaultData: {
    header: {
      name: 'Digital Growth Agency',
      title: 'Accelerating Your Digital Success',
      tagline: 'We help businesses grow through strategic digital marketing, data-driven campaigns, and innovative solutions.',
      profile_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      badge_1: 'Digital',
      badge_2: 'Growth',
      badge_3: 'ROI Focused'
    },
    contact: {
      email: 'hello@digitalgrowth.com',
      phone: '+1 (555) 123-4567',
      website: 'https://digitalgrowth.com',
      location: 'New York, NY'
    },
    about: {
      description: 'We are a full-service digital marketing agency specializing in helping businesses achieve measurable growth through strategic online marketing campaigns.',
      specialties: 'SEO, PPC, Social Media Marketing, Content Marketing, Email Marketing, Analytics',
      experience: '8'
    },
    action_buttons: {
      contact_button_text: 'Get Free Quote',
      appointment_button_text: 'Book Strategy Call',
      save_contact_button_text: 'Save Contact'
    },
    services: {
      service_list: [
        { title: 'Search Engine Optimization', description: 'Improve your organic search rankings and drive qualified traffic', price: 'From $2,500/mo' },
        { title: 'Pay-Per-Click Advertising', description: 'Targeted ad campaigns across Google, Facebook, and other platforms', price: 'From $1,500/mo' },
        { title: 'Social Media Management', description: 'Complete social media strategy and content creation', price: 'From $1,200/mo' },
        { title: 'Content Marketing', description: 'Strategic content creation to engage and convert your audience', price: 'From $2,000/mo' }
      ]
    },
    portfolio: {
      projects: [
        { title: 'E-commerce Growth Campaign', image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80', url: '#', results: '300% increase in online sales' },
        { title: 'B2B Lead Generation', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', url: '#', results: '150% more qualified leads' },
        { title: 'Brand Awareness Campaign', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', url: '#', results: '500% increase in brand mentions' }
      ]
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/company/digitalgrowth', username: 'digitalgrowth' },
        { platform: 'twitter', url: 'https://twitter.com/digitalgrowth', username: '@digitalgrowth' },
        { platform: 'facebook', url: 'https://facebook.com/digitalgrowth', username: 'digitalgrowth' },
        { platform: 'instagram', url: 'https://instagram.com/digitalgrowth', username: '@digitalgrowth' },
        { platform: 'youtube', url: 'https://youtube.com/digitalgrowthagency', username: 'Digital Growth Agency' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Como crear un dashboard de ventas', description: 'A sales dashboard tutorial focused on tracking marketing performance and business metrics.', video_type: 'tutorial', embed_url: 'https://www.youtube.com/watch?v=X5O9qRkKr2I', thumbnail: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80', duration: '8:45', marketing_channel: 'general' },
        { title: 'Marketing para Influencers en 2021', description: 'An influencer marketing tutorial covering strategy, promotion, and audience growth.', video_type: 'industry_insights', embed_url: 'https://www.youtube.com/watch?v=AriEGmaozO4', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', duration: '15:20', marketing_channel: 'social_media' },
        { title: 'Como generar una comunidad para tu marca', description: 'A brand community building video focused on engagement, loyalty, and long-term growth.', video_type: 'campaign_showcase', embed_url: 'https://www.youtube.com/watch?v=LoeP0ELFxrc', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', duration: '6:30', marketing_channel: 'content_marketing' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/digitalgrowthagency',
      channel_name: 'Digital Growth Agency',
      subscriber_count: '87.3K',
      featured_playlist: 'https://youtube.com/playlist?list=PLmarketingtips',
      latest_video_embed: 'https://www.youtube.com/watch?v=X5O9qRkKr2I',
      channel_description: 'Digital marketing tutorials, campaign breakdowns, and growth strategies from a leading digital marketing agency. Subscribe for weekly marketing insights!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '', close_time: '', is_closed: true },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/digitalgrowth',
      calendar_link: 'https://calendar.google.com/digitalgrowth'
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah Johnson', company: 'TechStart Inc.', review: 'Digital Growth Agency transformed our online presence. Our leads increased by 200% in just 3 months!', rating: '5' },
        { client_name: 'Mike Chen', company: 'E-commerce Plus', review: 'Professional team with excellent results. They really understand digital marketing strategy.', rating: '5' },
        { client_name: 'Lisa Rodriguez', company: 'Local Business Co.', review: 'Outstanding ROI on our marketing spend. Highly recommend their services!', rating: '5' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=San%20Francisco%20CA&z=13&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=San+Francisco+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/google-ads/id1037457231',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.google.android.apps.adwords'
    },
    contact_form: {
      form_title: 'Ready to Grow Your Business?',
      form_description: 'Get a free digital marketing consultation and discover how we can help accelerate your growth.'
    },
    custom_html: {
      html_content: '<h3>Digital Growth Experts</h3><p>We are a full-service digital marketing agency with 8+ years of experience helping businesses achieve measurable growth through data-driven campaigns and innovative strategies.</p>',
      section_title: 'Why Choose Us',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Agency',
      qr_description: 'Scan to share our digital marketing services with your network'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    thank_you: {
      message: 'Thank you for your interest! We\'ll contact you within 24 hours to discuss your digital marketing goals.'
    },
    seo: {
      meta_title: 'Digital Growth Agency | SEO, Ads, Social, and Lead Generation',
      meta_description: 'Results-driven digital marketing services for SEO, PPC, social media, lead generation, and campaign growth.',
      keywords: 'digital marketing agency, SEO, PPC, Google Ads, lead generation, social media marketing',
      og_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    copyright: {
      text: '© 2025 Digital Growth Agency. All rights reserved.'
    }
  }
};
