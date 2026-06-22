import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const freelancerTemplate = {
  name: t('Freelancer'),
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
        { name: 'skills', type: 'tags', label: t('Skills') },
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
          label: t('Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Portfolio Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Professional Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'project_walkthrough', label: t('Project Walkthrough') },
              { value: 'coding_tutorial', label: t('Coding Tutorial') },
              { value: 'design_process', label: t('Design Process') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'tech_talk', label: t('Tech Talk/Presentation') },
              { value: 'behind_scenes', label: t('Behind the Scenes') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'tech_stack', type: 'text', label: t('Technologies Used') }
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
      name: t('Portfolio'),
      fields: [
        {
          name: 'projects',
          type: 'repeater',
          label: t('Projects'),
          fields: [
            { name: 'title', type: 'text', label: t('Project Title') },
            { name: 'image', type: 'file', label: t('Project Image') },
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
      key: 'appointments',
      name: t('Appointments'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') }
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
        { name: 'appointment_button_text', type: 'text', label: t('Appointment Button Text') },
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
    { name: 'Code Blue', primary: '#0066CC', secondary: '#0080FF', accent: '#E6F3FF', background: '#0A0E1A', text: '#E2E8F0', codeBlock: '#1A202C' },
    { name: 'Terminal Green', primary: '#00FF41', secondary: '#39FF14', accent: '#E8F5E8', background: '#0D1117', text: '#C9D1D9', codeBlock: '#161B22' },
    { name: 'Cyber Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#F3F4F6', background: '#1A1B23', text: '#F1F5F9', codeBlock: '#2D2E3F' },
    { name: 'Matrix Black', primary: '#00D9FF', secondary: '#00B4D8', accent: '#F0F9FF', background: '#000000', text: '#FFFFFF', codeBlock: '#111111' },
    { name: 'Neon Orange', primary: '#FF6B35', secondary: '#FF8C42', accent: '#FFF4E6', background: '#1C1C1E', text: '#F2F2F7', codeBlock: '#2C2C2E' },
    { name: 'Arctic Blue', primary: '#0EA5E9', secondary: '#38BDF8', accent: '#F0F9FF', background: '#0F172A', text: '#CBD5E1', codeBlock: '#1E293B' },
    { name: 'Hacker Red', primary: '#EF4444', secondary: '#F87171', accent: '#FEF2F2', background: '#1F1F23', text: '#FAFAFA', codeBlock: '#2A2A2E' },
    { name: 'Dev Gold', primary: '#F59E0B', secondary: '#FBBF24', accent: '#FFFBEB', background: '#1C1917', text: '#F5F5F4', codeBlock: '#292524' },
    { name: 'Mint Fresh', primary: '#10b77f', secondary: '#34D399', accent: '#ECFDF5', background: '#0F1419', text: '#E5E7EB', codeBlock: '#1F2937' },
    { name: 'Royal Violet', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#F5F3FF', background: '#1E1B2E', text: '#E2E8F0', codeBlock: '#2A2438' }
  ],
  fontOptions: [
    { name: 'JetBrains Mono', value: 'JetBrains Mono, Fira Code, Monaco, monospace', weight: '400,500,600,700' },
    { name: 'Fira Code', value: 'Fira Code, Consolas, Monaco, monospace', weight: '400,500,600' },
    { name: 'Inter Tech', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Source Code Pro', value: 'Source Code Pro, Menlo, Monaco, monospace', weight: '400,600,700' },
    { name: 'Space Grotesk', value: 'Space Grotesk, Inter, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#0066CC',
    secondary: '#0080FF',
    accent: '#E6F3FF',
    background: '#0A0E1A',
    text: '#E2E8F0',
    cardBg: 'rgba(26, 32, 44, 0.8)',
    borderColor: '#334155',
    codeBlock: '#1A202C',
    syntaxHighlight: '#00FF41'
  },
  defaultFont: 'JetBrains Mono, Fira Code, Monaco, monospace',
  themeStyle: {
    layout: 'tech-grid',
    headerStyle: 'terminal',
    cardStyle: 'glass-morphism',
    buttonStyle: 'cyber',
    iconStyle: 'tech',
    spacing: 'minimal',
    shadows: 'neon',
    animations: 'glitch',
    backgroundPattern: 'circuit-board',
    codeBlocks: 'syntax-highlighted',
    terminalEffects: true
  },
  defaultData: {
    header: {
      name: 'John Smith',
      title: 'Full Stack Developer',
      tagline: 'Building amazing web experiences with modern technologies',
      profile_image: ''
    },
    contact: {
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      website: 'https://johnsmith.dev',
      location: 'San Francisco, CA'
    },
    about: {
      description: 'Passionate full-stack developer with 5+ years of experience creating scalable web applications. I specialize in React, Node.js, and cloud technologies.',
      skills: 'React, Node.js, TypeScript, AWS, MongoDB, PostgreSQL',
      experience: '5'
    },
    services: {
      service_list: [
        { title: 'Web Development', description: 'Custom web applications using modern frameworks', price: '$150' },
        { title: 'API Development', description: 'RESTful APIs and microservices architecture', price: '$120' },
        { title: 'Consulting', description: 'Technical consulting and code reviews', price: '$100' }
      ]
    },
    portfolio: {
      projects: [
        {
          title: 'E-commerce Platform',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
          url: 'https://demo-ecommerce.com'
        },
        {
          title: 'Task Management App',
          image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=900&q=80',
          url: 'https://demo-tasks.com'
        }
      ]
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/johnsmith', username: 'johnsmith' },
        { platform: 'twitter', url: 'https://twitter.com/johnsmith', username: 'johnsmith' },
        { platform: 'github', url: 'https://github.com/johnsmith', username: 'johnsmith' },
        { platform: 'youtube', url: 'https://youtube.com/johnsmithdev', username: 'John Smith Dev' }
      ]
    },
    videos: {
      video_list: [
        {
          title: 'Building a React E-commerce App',
          description: 'Complete walkthrough of building a modern e-commerce platform with React and Node.js',
          video_type: 'project_walkthrough',
          embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/Ke90Tje7VS0" title="React tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
          duration: '25:30',
          tech_stack: 'React, Node.js, MongoDB'
        },
        {
          title: 'Advanced TypeScript Patterns',
          description: 'Learn advanced TypeScript patterns for better code organization',
          video_type: 'coding_tutorial',
          embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/30LWjhZzg50" title="TypeScript tutorial" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
          thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80',
          duration: '18:45',
          tech_stack: 'TypeScript, React'
        },
        {
          title: 'Client Success Story - Tech Startup',
          description: 'How I helped a startup build their MVP in 6 weeks',
          video_type: 'client_testimonial',
          embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/Tn6-PIqc4UM" title="Startup product development" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
          thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
          duration: '4:20',
          tech_stack: 'Full Stack'
        }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/johnsmithdev',
      channel_name: 'John Smith Dev',
      subscriber_count: '45.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLreacttutorials',
      latest_video_embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/Ke90Tje7VS0" title="Latest developer video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
      channel_description: 'Web development tutorials, coding tips, and project walkthroughs. Subscribe for weekly content on React, Node.js, and modern web technologies.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '', close_time: '', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/johnsmith',
      calendar_link: 'https://calendar.google.com/johnsmith'
    },
    testimonials: {
      reviews: [
        { client_name: 'Tech Startup Inc.', review: 'John delivered an exceptional web application that exceeded our expectations. Professional and reliable!', rating: '5' },
        { client_name: 'Marketing Agency', review: 'Great communication and technical skills. Will definitely work with John again.', rating: '5' },
        { client_name: 'E-commerce Store', review: 'Outstanding work on our online platform. Highly recommended for any development project.', rating: '5' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=San%20Francisco%2C%20CA&z=12&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=San+Francisco+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/github/id1477376905',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.github.android'
    },
    contact_form: {
      form_title: 'Let\'s Work Together',
      form_description: 'Ready to start your next project? Get in touch and let\'s discuss how I can help bring your ideas to life.'
    },
    thank_you: {
      message: 'Thank you for your interest! I\'ll get back to you within 24 hours to discuss your project.'
    },
    seo: {
      meta_title: 'John Smith - Full Stack Developer | Web Development Services',
      meta_description: 'Professional full-stack developer with 5+ years experience. Specializing in React, Node.js, and modern web technologies. Contact for custom web solutions.',
      keywords: 'full stack developer, web development, React, Node.js, JavaScript, TypeScript, freelancer',
      og_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Featured Work</h4><p>Check out my latest projects and achievements.</p></div>',
      section_title: 'Featured Content',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Contact',
      qr_description: 'Scan this QR code to save my contact information directly to your phone.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'contact_developer()',
      appointment_button_text: 'schedule_meeting()',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Ready to bring your ideas to life? Let\'s collaborate on your next project and create something amazing together.',
      footer_links: [
        { title: 'View Portfolio', url: '#portfolio' },
        { title: 'Book Consultation', url: '#booking' },
        { title: 'Download Resume', url: '#resume' },
        { title: 'Get Quote', url: '#contact' }
      ]
    },
    copyright: {
      text: '© 2025 John Smith. All rights reserved.'
    }
  }
};
