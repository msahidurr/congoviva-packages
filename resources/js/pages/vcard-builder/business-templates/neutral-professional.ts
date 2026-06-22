import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const neutralProfessionalTemplate = {
  name: t('Neutral Professional'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
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
        { name: 'location', type: 'text', label: t('Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me') },
        { name: 'skills', type: 'tags', label: t('Skills & Expertise') },
        { name: 'experience', type: 'number', label: t('Years of Experience') }
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
          label: t('Services Offered'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price/Rate') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'portfolio',
      name: t('Portfolio/Work'),
      fields: [
        {
          name: 'projects',
          type: 'repeater',
          label: t('Work Samples'),
          fields: [
            { name: 'title', type: 'text', label: t('Project Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'image', type: 'file', label: t('Image') },
            { name: 'url', type: 'url', label: t('Project URL') }
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
            { name: 'username', type: 'text', label: t('Username') }
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
          label: t('Business Hours'),
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
            { name: 'rating', type: 'number', label: t('Rating (1-5)') }
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
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') }
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
        { name: 'template_language', type: 'select', label: t('Template Language'), options: languageData.map(lang => ({ value: lang.code, label: `${String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))} ${lang.name}` })) }
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Clean White', primary: '#2563EB', secondary: '#3B82F6', accent: '#F1F5F9', background: '#FFFFFF', text: '#1E293B', cardBg: '#FFFFFF', borderColor: '#E2E8F0' },
    { name: 'Minimal Gray', primary: '#374151', secondary: '#6B7280', accent: '#F9FAFB', background: '#F8FAFC', text: '#111827', cardBg: '#FFFFFF', borderColor: '#D1D5DB' },
    { name: 'Professional Black', primary: '#000000', secondary: '#374151', accent: '#F3F4F6', background: '#FFFFFF', text: '#000000', cardBg: '#FAFAFA', borderColor: '#E5E7EB' },
    { name: 'Warm Beige', primary: '#92400E', secondary: '#B45309', accent: '#FEF3C7', background: '#FFFBEB', text: '#451A03', cardBg: '#FFFFFF', borderColor: '#F3E8FF' },
    { name: 'Modern Teal', primary: '#0F766E', secondary: '#14B8A6', accent: '#F0FDFA', background: '#FFFFFF', text: '#134E4A', cardBg: '#FFFFFF', borderColor: '#99F6E4' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,700' }
  ],
  defaultColors: {
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#F1F5F9',
    background: '#FFFFFF',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'clean-minimal',
    headerStyle: 'simple',
    cardStyle: 'clean',
    buttonStyle: 'minimal',
    iconStyle: 'simple',
    spacing: 'comfortable',
    shadows: 'subtle',
    animations: 'smooth'
  },
  defaultData: {
    header: {
      name: 'Your Name',
      title: 'Professional Title',
      tagline: 'Your professional tagline or mission statement',
      profile_image: ''
    },
    contact: {
      email: 'your.email@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://yourwebsite.com',
      location: 'Your City, State'
    },
    about: {
      description: 'Brief description about yourself and your professional background.',
      skills: 'Skill 1, Skill 2, Skill 3',
      experience: '5'
    },
    services: {
      service_list: [
        { title: 'Service 1', description: 'Description of your first service', price: 'Contact for pricing' },
        { title: 'Service 2', description: 'Description of your second service', price: 'Contact for pricing' }
      ]
    },
    portfolio: {
      projects: [
        { title: 'Project Alpha', description: 'Comprehensive business solution with modern design approach', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', url: 'https://yourwebsite.com/project-alpha' },
        { title: 'Digital Strategy', description: 'Complete digital transformation for enterprise client', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', url: 'https://yourwebsite.com/digital-strategy' },
        { title: 'Brand Identity', description: 'Full brand redesign and marketing strategy implementation', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', url: 'https://yourwebsite.com/brand-identity' },
        { title: 'Web Platform', description: 'Custom web application with advanced functionality', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', url: 'https://yourwebsite.com/web-platform' }
      ]
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/yourname', username: 'yourname' },
        { platform: 'twitter', url: 'https://twitter.com/yourname', username: '@yourname' },
        { platform: 'instagram', url: 'https://instagram.com/yourname', username: '@yourname' },
        { platform: 'facebook', url: 'https://facebook.com/yourname', username: 'yourname' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false }
      ]
    },
    testimonials: {
      reviews: [
        {
          client_name: 'Sarah Johnson',
          review: 'Exceptional work quality and professionalism. Delivered exactly what was promised on time and exceeded expectations.',
          rating: '5'
        },
        {
          client_name: 'Michael Chen',
          review: 'Outstanding communication throughout the project. Very knowledgeable and provided valuable insights.',
          rating: '5'
        },
        {
          client_name: 'Emily Rodriguez',
          review: 'Highly skilled professional who understands client needs perfectly. Would definitely work with again.',
          rating: '5'
        },
        {
          client_name: 'David Thompson',
          review: 'Impressive attention to detail and creative problem-solving. The results speak for themselves.',
          rating: '5'
        },
        {
          client_name: 'Lisa Park',
          review: 'Professional, reliable, and delivers high-quality work consistently. A pleasure to work with.',
          rating: '5'
        },
        {
          client_name: 'James Wilson',
          review: 'Excellent expertise and great communication skills. Made the entire process smooth and efficient.',
          rating: '5'
        }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/yourname',
      calendar_link: 'https://calendar.google.com/yourname'
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Chicago%20IL&z=11&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Chicago+IL'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/linkedin-network-job-finder/id288429040',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.linkedin.android'
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Additional Information</h4><p>Add any custom content here.</p></div>',
      section_title: 'Additional Info',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Contact',
      qr_description: 'Scan this QR code to save my contact information.'
    },
    thank_you: {
      message: 'Thank you for your interest! I will get back to you soon.'
    },
    action_buttons: {
      contact_button_text: 'Contact Me',
      save_contact_button_text: 'Save Contact'
    },
    copyright: {
      text: '© 2025 Your Name. All rights reserved.'
    },
    contact_form: {
      form_title: 'Get In Touch',
      form_description: 'Feel free to reach out for any inquiries or collaboration opportunities.'
    },
     language: {
      template_language: 'en',
      enable_language_switcher: true
    },
  }
};
