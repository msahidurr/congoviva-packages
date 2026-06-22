import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const consultingTemplate = {
  name: t('Consulting & Professional Services'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Professional Tagline') },
        { name: 'profile_image', type: 'file', label: t('Professional Photo') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Business Email') },
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
        { name: 'expertise', type: 'tags', label: t('Areas of Expertise') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'certifications', type: 'tags', label: t('Certifications') }
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
          label: t('Consulting Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Service Description') },
            { name: 'duration', type: 'text', label: t('Typical Duration') },
            { name: 'price_range', type: 'text', label: t('Price Range') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Educational Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Professional Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'thought_leadership', label: t('Thought Leadership') },
              { value: 'case_study', label: t('Case Study Presentation') },
              { value: 'webinar', label: t('Webinar/Workshop') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'industry_insights', label: t('Industry Insights') },
              { value: 'methodology', label: t('Methodology Explanation') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'expertise_area', type: 'text', label: t('Expertise Area') }
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
      key: 'case_studies',
      name: t('Case Studies'),
      fields: [
        {
          name: 'studies',
          type: 'repeater',
          label: t('Client Success Stories'),
          fields: [
            { name: 'title', type: 'text', label: t('Project Title') },
            { name: 'client_industry', type: 'text', label: t('Client Industry') },
            { name: 'challenge', type: 'textarea', label: t('Challenge') },
            { name: 'solution', type: 'textarea', label: t('Solution') },
            { name: 'results', type: 'textarea', label: t('Results Achieved') }
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
          label: t('Professional Networks'),
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
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'consultation_fee', type: 'text', label: t('Initial Consultation Fee') }
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
          label: t('Client Testimonials'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'client_title', type: 'text', label: t('Client Title/Company') },
            { name: 'review', type: 'textarea', label: t('Testimonial') },
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
  ],
  colorPresets: [
    { name: 'Executive Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#EFF6FF', background: '#F8FAFC', text: '#1E293B', cardBg: '#FFFFFF' },
    { name: 'Corporate Gray', primary: '#374151', secondary: '#6B7280', accent: '#F9FAFB', background: '#FFFFFF', text: '#111827', cardBg: '#F3F4F6' },
    { name: 'Professional Navy', primary: '#1E3A8A', secondary: '#3730A3', accent: '#E0E7FF', background: '#F1F5F9', text: '#0F172A', cardBg: '#FFFFFF' },
    { name: 'Trust Green', primary: '#059669', secondary: '#10b77f', accent: '#ECFDF5', background: '#F9FAFB', text: '#064E3B', cardBg: '#FFFFFF' },
    { name: 'Authority Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#F5F3FF', background: '#FAFAFA', text: '#581C87', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,700' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#EFF6FF',
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: 'rgba(0, 0, 0, 0.1)'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'professional-grid',
    headerStyle: 'executive',
    cardStyle: 'clean-shadow',
    buttonStyle: 'professional',
    iconStyle: 'business',
    spacing: 'comfortable',
    shadows: 'subtle',
    animations: 'smooth',
    backgroundPattern: 'subtle-grid',
    typography: 'corporate'
  },
  defaultData: {
    header: {
      name: 'Sarah Johnson',
      title: 'Management Consultant',
      tagline: 'Transforming businesses through strategic insights and operational excellence',
      profile_image: ''
    },
    contact: {
      email: 'sarah@consultingfirm.com',
      phone: '+1 (555) 987-6543',
      website: 'https://sarahjohnsonconsulting.com',
      location: 'New York, NY'
    },
    about: {
      description: 'Strategic management consultant with 12+ years of experience helping Fortune 500 companies optimize operations, drive growth, and navigate complex business challenges.',
      expertise: 'Strategic Planning, Operations Management, Digital Transformation, Change Management, Process Optimization',
      experience: '12',
      certifications: 'PMP, Six Sigma Black Belt, MBA'
    },
    services: {
      service_list: [
        { title: 'Strategic Planning', description: 'Comprehensive strategic planning and roadmap development', duration: '3-6 months', price_range: '$15,000 - $50,000' },
        { title: 'Operations Consulting', description: 'Process optimization and operational efficiency improvements', duration: '2-4 months', price_range: '$10,000 - $30,000' },
        { title: 'Digital Transformation', description: 'Technology adoption and digital strategy implementation', duration: '6-12 months', price_range: '$25,000 - $100,000' }
      ]
    },
    case_studies: {
      studies: [
        {
          title: 'Manufacturing Efficiency Improvement',
          client_industry: 'Manufacturing',
          challenge: 'Client faced 30% production delays and rising operational costs',
          solution: 'Implemented lean manufacturing principles and automated key processes',
          results: '40% reduction in production time, 25% cost savings, improved quality metrics'
        }
      ]
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnson', username: 'sarahjohnson' },
        { platform: 'twitter', url: 'https://twitter.com/sarahconsults', username: '@sarahconsults' },
        { platform: 'youtube', url: 'https://youtube.com/sarahjohnsonconsulting', username: 'Sarah Johnson Consulting' }
      ]
    },
    videos: {
      video_list: [
        {
          title: 'Strategic Planning Framework for Growth',
          description: 'Learn the proven framework I use to help companies develop winning strategies and achieve sustainable growth.',
          video_type: 'thought_leadership',
          embed_url: 'https://www.youtube.com/watch?v=mS9CFBlLOcg',
          thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
          duration: '18:30',
          expertise_area: 'Strategic Planning'
        },
        {
          title: 'Change Management Best Practices',
          description: 'Webinar on leading organizational change effectively and managing resistance during transformation.',
          video_type: 'webinar',
          embed_url: 'https://www.youtube.com/watch?v=1nYFpuc2Umk',
          thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
          duration: '45:20',
          expertise_area: 'Change Management'
        }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/sarahjohnsonconsulting',
      channel_name: 'Sarah Johnson Consulting',
      subscriber_count: '32.4K',
      featured_playlist: 'https://youtube.com/playlist?list=PLstrategicplanning',
      latest_video_embed: 'https://www.youtube.com/watch?v=mS9CFBlLOcg',
      channel_description: 'Strategic insights, business transformation tips, and leadership advice from a management consultant with 12+ years of Fortune 500 experience.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '08:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '', close_time: '', is_closed: true },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/sarahjohnson',
      calendar_link: 'https://calendar.google.com/sarahjohnson',
      consultation_fee: 'Free initial consultation'
    },
    testimonials: {
      reviews: [
        { client_name: 'Michael Chen', client_title: 'CEO, TechCorp Inc.', review: 'Sarah\'s strategic insights transformed our operations. Her expertise in change management was invaluable during our digital transformation.', rating: '5' },
        { client_name: 'Lisa Rodriguez', client_title: 'VP Operations, Global Manufacturing', review: 'Outstanding results! Sarah helped us achieve 40% efficiency gains while maintaining quality standards.', rating: '5' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Midtown%20Manhattan%20New%20York%20NY&z=14&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Midtown+Manhattan+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/linkedin-network-job-finder/id288429040',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.linkedin.android'
    },
    contact_form: {
      form_title: 'Schedule a Consultation',
      form_description: 'Ready to transform your business? Let\'s discuss your challenges and explore how strategic consulting can drive your success.'
    },
    custom_html: {
      html_content: '<h3>Strategic Business Transformation</h3><p>With 12+ years of Fortune 500 experience, I help businesses optimize operations, drive growth, and navigate complex challenges through proven methodologies and strategic insights.</p>',
      section_title: 'Expertise & Approach',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Profile',
      qr_description: 'Scan to share my consulting services with your network'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    thank_you: {
      message: 'Thank you for your interest! I\'ll review your inquiry and respond within 24 hours to schedule our initial consultation.'
    },
    action_buttons: {
      contact_button_text: 'Start Your Consultation',
      save_contact_button_text: 'Save Contact'
    },
    seo: {
      meta_title: 'Sarah Johnson Consulting | Strategy and Operations Advisory',
      meta_description: 'Strategic planning, operations consulting, digital transformation, and change management support for growth-minded businesses.',
      keywords: 'management consultant, strategic planning, operations consulting, digital transformation, change management',
      og_image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    copyright: {
      text: '© 2025 Sarah Johnson Consulting. All rights reserved.'
    }
  }
};
