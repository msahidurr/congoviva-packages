import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const architectDesignerTemplate = {
  name: t('Architect & Interior Designer'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Designer Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Design Philosophy') },
        { name: 'profile_image', type: 'file', label: t('Professional Photo') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Portfolio Website') },
        { name: 'location', type: 'text', label: t('Studio Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Design Journey') },
        { name: 'specialties', type: 'tags', label: t('Design Specialties') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'education', type: 'textarea', label: t('Education & Credentials') }
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
          label: t('Design Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Service Description') },
            {
              name: 'category', type: 'select', label: t('Category'), options: [
                { value: 'architecture', label: t('Architecture') },
                { value: 'interior', label: t('Interior Design') },
                { value: 'landscape', label: t('Landscape Design') },
                { value: 'consultation', label: t('Design Consultation') },
                { value: 'renovation', label: t('Renovation') }
              ]
            },
            { name: 'price_range', type: 'text', label: t('Price Range') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'portfolio',
      name: t('Portfolio'),
      fields: [
        {
          name: 'projects',
          type: 'repeater',
          label: t('Featured Projects'),
          fields: [
            { name: 'title', type: 'text', label: t('Project Title') },
            {
              name: 'type', type: 'select', label: t('Project Type'), options: [
                { value: 'residential', label: t('Residential') },
                { value: 'commercial', label: t('Commercial') },
                { value: 'hospitality', label: t('Hospitality') },
                { value: 'office', label: t('Office Space') },
                { value: 'retail', label: t('Retail') },
                { value: 'institutional', label: t('Institutional') }
              ]
            },
            { name: 'image', type: 'file', label: t('Project Image') },
            { name: 'description', type: 'textarea', label: t('Project Description') },
            { name: 'year', type: 'text', label: t('Year Completed') },
            { name: 'size', type: 'text', label: t('Project Size') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Project Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Design Process Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            {
              name: 'video_type', type: 'select', label: t('Video Type'), options: [
                { value: 'project_walkthrough', label: t('Project Walkthrough') },
                { value: 'design_process', label: t('Design Process') },
                { value: 'client_testimonial', label: t('Client Testimonial') },
                { value: 'before_after', label: t('Before & After') },
                { value: 'design_tips', label: t('Design Tips') }
              ]
            },
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
      key: 'design_process',
      name: t('Design Process'),
      fields: [
        {
          name: 'process_steps',
          type: 'repeater',
          label: t('Design Process Steps'),
          fields: [
            { name: 'step_number', type: 'number', label: t('Step Number') },
            { name: 'step_title', type: 'text', label: t('Step Title') },
            { name: 'step_description', type: 'textarea', label: t('Step Description') },
            { name: 'duration', type: 'text', label: t('Typical Duration') }
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
          label: t('Design Platforms'),
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
          label: t('Studio Hours'),
          fields: [
            {
              name: 'day', type: 'select', label: t('Day'), options: [
                { value: 'monday', label: t('Monday') },
                { value: 'tuesday', label: t('Tuesday') },
                { value: 'wednesday', label: t('Wednesday') },
                { value: 'thursday', label: t('Thursday') },
                { value: 'friday', label: t('Friday') },
                { value: 'saturday', label: t('Saturday') },
                { value: 'sunday', label: t('Sunday') }
              ]
            },
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
        { name: 'consultation_info', type: 'textarea', label: t('Consultation Information') }
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
            { name: 'project_type', type: 'text', label: t('Project Type') },
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
        {
          name: 'qr_size', type: 'select', label: t('QR Code Size'), options: [
            { value: 'small', label: t('Small (128px)') },
            { value: 'medium', label: t('Medium (200px)') },
            { value: 'large', label: t('Large (300px)') }
          ]
        }
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
      key: 'copyright',
      name: t('Copyright'),
      fields: [
        { name: 'text', type: 'text', label: t('Copyright Text') }
      ],
      required: false
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'appointment_button_text', type: 'text', label: t('Appointment Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') }
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
    { name: 'Modern Minimalist', primary: '#2C3E50', secondary: '#34495E', accent: '#E74C3C', background: '#FFFFFF', text: '#2C3E50', cardBg: '#F8F9FA' },
    { name: 'Warm Neutral', primary: '#8B7355', secondary: '#A0937D', accent: '#D4AF37', background: '#FAF9F6', text: '#5D4E37', cardBg: '#FFFFFF' },
    { name: 'Contemporary Blue', primary: '#1E3A8A', secondary: '#3B82F6', accent: '#F59E0B', background: '#F8FAFC', text: '#1E293B', cardBg: '#FFFFFF' },
    { name: 'Elegant Gray', primary: '#4B5563', secondary: '#6B7280', accent: '#10b77f', background: '#F9FAFB', text: '#374151', cardBg: '#FFFFFF' },
    { name: 'Sophisticated Black', primary: '#111827', secondary: '#374151', accent: '#F59E0B', background: '#F3F4F6', text: '#111827', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,700' }
  ],
  defaultColors: {
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#E74C3C',
    background: '#FFFFFF',
    text: '#2C3E50',
    cardBg: '#F8F9FA',
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(44, 62, 80, 0.1)'
  },
  defaultFont: 'Playfair Display, Georgia, serif',
  themeStyle: {
    layout: 'architectural-grid',
    headerStyle: 'design-showcase',
    cardStyle: 'blueprint-cards',
    buttonStyle: 'architectural-buttons',
    iconStyle: 'design-icons',
    spacing: 'golden-ratio',
    shadows: 'architectural-depth',
    animations: 'blueprint-reveal',
    backgroundPattern: 'grid-lines',
    typography: 'design-serif'
  },
  defaultData: {
    header: {
      name: 'Alexandra Chen',
      title: 'Principal Architect & Interior Designer',
      tagline: 'Creating spaces that inspire, function beautifully, and reflect the unique story of each client through thoughtful design and architectural excellence',
      profile_image: ''
    },
    contact: {
      email: 'hello@alexandrachen.design',
      phone: '+1 (555) 901-2345',
      website: 'https://alexandrachen.design',
      location: 'San Francisco, CA'
    },
    about: {
      description: 'Award-winning architect and interior designer with 14+ years of experience creating innovative residential and commercial spaces. Passionate about sustainable design, modern aesthetics, and spaces that enhance human experience.',
      specialties: 'Residential Architecture, Interior Design, Sustainable Design, Space Planning, Renovation',
      experience: '14',
      education: 'Master of Architecture from UC Berkeley, LEED Certified Professional, AIA Member'
    },
    services: {
      service_list: [
        { title: 'Architectural Design', description: 'Complete architectural services from concept to construction documentation', category: 'architecture', price_range: '$15,000 - $75,000' },
        { title: 'Interior Design', description: 'Full-service interior design including space planning, furniture, and styling', category: 'interior', price_range: '$8,000 - $50,000' },
        { title: 'Design Consultation', description: 'Expert design advice and project guidance for DIY projects', category: 'consultation', price_range: '$200 - $500/hour' },
        { title: 'Home Renovation', description: 'Complete renovation services from planning to project management', category: 'renovation', price_range: '$25,000 - $200,000' }
      ]
    },
    portfolio: {
      projects: [
        { title: 'Cliffside Villa Retreat', type: 'residential', image: 'https://images.unsplash.com/photo-1759097247817-7611910ae819?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=900', description: 'Elegant 4,800 sq ft coastal home designed to maximize natural light, privacy, and panoramic views', year: '2024', size: '4,800 sq ft' },
        { title: 'Urban Creative Office Hub', type: 'office', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', description: 'Flexible workspace with collaborative zones, acoustic planning, and a refined material palette', year: '2023', size: '6,500 sq ft' }
      ]
    },
    design_process: {
      process_steps: [
        { step_number: 1, step_title: 'Discovery & Programming', step_description: 'Understanding your needs, lifestyle, and design preferences through detailed consultation', duration: '1-2 weeks' },
        { step_number: 2, step_title: 'Concept Development', step_description: 'Creating initial design concepts, mood boards, and spatial layouts', duration: '2-3 weeks' },
        { step_number: 3, step_title: 'Design Development', step_description: 'Refining designs, selecting materials, and developing detailed drawings', duration: '3-4 weeks' },
        { step_number: 4, step_title: 'Construction Documentation', step_description: 'Preparing detailed construction drawings and specifications', duration: '2-3 weeks' },
        { step_number: 5, step_title: 'Implementation', step_description: 'Project management and oversight during construction phase', duration: 'Variable' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/alexandrachen.design', username: '@alexandrachen.design' },
        { platform: 'pinterest', url: 'https://pinterest.com/alexandrachendesign', username: 'Alexandra Chen Design' },
        { platform: 'behance', url: 'https://behance.net/alexandrachen', username: 'Alexandra Chen' },
        { platform: 'youtube', url: 'https://youtube.com/alexandrachendesign', username: 'Alexandra Chen Design' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '15:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/alexandrachen',
      calendar_link: 'https://calendar.google.com/alexandrachen',
      consultation_info: 'Initial consultations are complimentary for projects over $10,000. Please bring inspiration images and project requirements.'
    },
    testimonials: {
      reviews: [
        { client_name: 'Jennifer Walsh', project_type: 'Residential Renovation', review: 'Alexandra transformed our dated home into a modern masterpiece. Her attention to detail and design vision exceeded our expectations. Highly recommend!', rating: '5' },
        { client_name: 'David Martinez', project_type: 'Commercial Office', review: 'Working with Alexandra on our office design was incredible. She created a space that\'s both functional and inspiring for our team.', rating: '5' }
      ]
    },
    videos: {
      video_list: [
        {
          title: 'Modern Hillside Residence - Design Walkthrough',
          description: 'Take a virtual tour through our award-winning hillside residence project',
          video_type: 'project_walkthrough',
          embed_url: 'https://youtu.be/IyX31fd2vZM?si=o47zkH_AEHSs7tDw',
          thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80',
          duration: '8:45'
        },
        {
          title: 'Modern Apartment Makeover Story',
          description: 'A happy client shares their experience after the full renovation and styling of their downtown apartment.',
          video_type: 'client_testimonial',
          embed_url: 'https://youtu.be/JDlBWrS3o90?si=HK3PpxOyhEXrCO-b',
          thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
          duration: '6:15'
        },
        {
          title: 'Luxury Villa Interior Tour',
          description: 'Explore the elegant interiors, custom furniture selections, and premium finishes used in this luxury villa project.',
          video_type: 'project_walkthrough',
          embed_url: 'https://youtu.be/BE3Oj0SqZ3E?si=o0gO8irKnUufCI0N',
          thumbnail: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
          duration: '8:45'
        },

      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/alexandrachendesign',
      channel_name: 'Alexandra Chen Design',
      subscriber_count: '45.2K',
      featured_playlist: 'https://youtube.com/playlist?list=PLdesignprocess',
      latest_video_embed: 'https://youtu.be/BE3Oj0SqZ3E?si=o0gO8irKnUufCI0N',
      channel_description: 'Weekly design inspiration, project walkthroughs, and architectural insights for design enthusiasts and professionals.'
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=San%20Francisco%20CA&z=12&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=San+Francisco+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/pinterest/id429047995',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.pinterest'
    },
    contact_form: {
      form_title: 'Let\'s Design Something Beautiful',
      form_description: 'Ready to transform your space? Share your vision and let\'s create something extraordinary together. Every great design starts with a conversation.'
    },
    action_buttons: {
      contact_button_text: 'Design Your Space',
      appointment_button_text: 'Schedule Meeting',
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for your interest in working together! I\'ll review your project details and respond within 24 hours to discuss how we can bring your vision to life.'
    }, seo: {
      meta_title: 'Alexandra Chen Design | Architecture and Interior Design',
      meta_description: 'Residential and hospitality architecture, interiors, renovations, and sustainable design guidance.',
      keywords: 'architect, interior designer, residential design, renovation, hospitality design, sustainable architecture',
      og_image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1200&q=80'
    }, pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="featured-work"><h4>Award-Winning Projects</h4><p>Recognized by Architectural Digest and Interior Design Magazine for innovative residential and commercial spaces.</p></div>',
      section_title: 'Featured Recognition',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with My Design Studio',
      qr_description: 'Scan to save my contact information and explore my latest projects.',
      qr_size: 'medium'
    },

    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Alexandra Chen Design Studio. All rights reserved.'
    }
  }
};
