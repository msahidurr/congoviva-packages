import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const graphicDesignTemplate = {
  name: t('Graphic Design Studio'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Designer Name') },
        { name: 'title', type: 'text', label: t('Creative Title') },
        { name: 'tagline', type: 'textarea', label: t('Creative Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile Photo') }
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
        { name: 'description', type: 'textarea', label: t('Creative Bio') },
        { name: 'specialties', type: 'tags', label: t('Design Specialties') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'design_philosophy', type: 'textarea', label: t('Design Philosophy') }
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
            { name: 'icon', type: 'text', label: t('Service Icon') },
            { name: 'price', type: 'text', label: t('Starting Price') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Design Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Creative Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'design_process', label: t('Design Process') },
              { value: 'project_showcase', label: t('Project Showcase') },
              { value: 'tutorial', label: t('Design Tutorial') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'speed_design', label: t('Speed Design') }
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
      key: 'portfolio',
      name: t('Portfolio Gallery'),
      fields: [
        {
          name: 'projects',
          type: 'repeater',
          label: t('Design Projects'),
          fields: [
            { name: 'title', type: 'text', label: t('Project Title') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'branding', label: t('Branding') },
              { value: 'web-design', label: t('Web Design') },
              { value: 'print', label: t('Print Design') },
              { value: 'packaging', label: t('Packaging') },
              { value: 'illustration', label: t('Illustration') },
              { value: 'logo', label: t('Logo Design') }
            ]},
            { name: 'image', type: 'file', label: t('Project Image') },
            { name: 'description', type: 'textarea', label: t('Project Description') }
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
          label: t('Creative Platforms'),
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
        { name: 'booking_url', type: 'url', label: t('Project Consultation URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'consultation_note', type: 'textarea', label: t('Consultation Note') }
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
            { name: 'client_company', type: 'text', label: t('Client Company') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'project_type', type: 'text', label: t('Project Type') }
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
    { name: 'Creative Rainbow', primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#45B7D1', background: '#FFFFFF', text: '#2C3E50', cardBg: '#F8F9FA' },
    { name: 'Neon Pop', primary: '#FF0080', secondary: '#00C864', accent: '#B366FF', background: '#FDF5FF', text: '#2D0050', cardBg: '#F5E8FF' },
    { name: 'Sunset Gradient', primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F', background: '#FFF8F0', text: '#2D1B69', cardBg: '#FFFFFF' },
    { name: 'Ocean Breeze', primary: '#0077BE', secondary: '#00A8CC', accent: '#7FDBDA', background: '#F0F8FF', text: '#003366', cardBg: '#FFFFFF' },
    { name: 'Forest Magic', primary: '#2ECC71', secondary: '#27AE60', accent: '#F39C12', background: '#F8FFF8', text: '#1B4332', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700,800' },
    { name: 'Raleway', value: 'Raleway, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Quicksand', value: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    accent: '#45B7D1',
    background: '#FFFFFF',
    text: '#2C3E50',
    cardBg: '#F8F9FA',
    borderColor: '#E9ECEF',
    shadowColor: 'rgba(255, 107, 107, 0.2)'
  },
  defaultFont: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'creative-masonry',
    headerStyle: 'artistic-hero',
    cardStyle: 'floating-cards',
    buttonStyle: 'gradient-rounded',
    iconStyle: 'colorful',
    spacing: 'dynamic',
    shadows: 'colorful',
    animations: 'bounce',
    backgroundPattern: 'geometric-shapes',
    typography: 'creative-mix'
  },
  defaultData: {
    header: {
      name: 'Alex Rivera',
      title: 'Creative Director & Graphic Designer',
      tagline: 'Transforming ideas into visual masterpieces that captivate and inspire',
      profile_image: ''
    },
    contact: {
      email: 'hello@alexrivera.design',
      phone: '+1 (555) 234-5678',
      website: 'https://alexrivera.design',
      location: 'Los Angeles, CA'
    },
    about: {
      description: 'Passionate graphic designer with 8+ years of experience creating compelling visual identities, stunning web designs, and memorable brand experiences for clients worldwide.',
      specialties: 'Brand Identity, Logo Design, Web Design, Print Design, Packaging, Illustration',
      experience: '8',
      design_philosophy: 'Great design is not just about making things look beautiful—it\'s about solving problems and creating emotional connections.'
    },
    services: {
      service_list: [
        { title: 'Brand Identity Design', description: 'Complete brand identity packages including logos, color palettes, and brand guidelines', icon: '🎨', price: 'From $2,500' },
        { title: 'Web Design', description: 'Modern, responsive website designs that convert visitors into customers', icon: '💻', price: 'From $3,000' },
        { title: 'Print Design', description: 'Brochures, flyers, business cards, and marketing materials', icon: '📄', price: 'From $500' },
        { title: 'Packaging Design', description: 'Eye-catching product packaging that stands out on shelves', icon: '📦', price: 'From $1,500' }
      ]
    },
    portfolio: {
      projects: [
        { title: 'Eco Coffee Brand', category: 'branding', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', description: 'Complete brand identity for sustainable coffee company' },
        { title: 'Tech Startup Website', category: 'web-design', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80', description: 'Modern SaaS platform landing page design' },
      ]
    },
    social: {
      social_links: [
        { platform: 'behance', url: 'https://behance.net/alexrivera', username: 'alexrivera' },
        { platform: 'dribbble', url: 'https://dribbble.com/alexrivera', username: 'alexrivera' },
        { platform: 'instagram', url: 'https://instagram.com/alexrivera.design', username: '@alexrivera.design' },
        { platform: 'youtube', url: 'https://youtube.com/alexriveradesign', username: 'Alex Rivera Design' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Logo Design Process - From Concept to Final', description: 'Watch the complete process of creating a brand identity from initial sketches to final logo', video_type: 'design_process', embed_url: 'https://youtu.be/4MxRhjHmiVw?si=8AYfdH7pbTwOsBC9', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', duration: '15:30' },
        { title: 'Adobe Illustrator Logo Tutorial', description: 'Step-by-step tutorial on creating professional logos in Illustrator', video_type: 'tutorial', embed_url: 'https://youtu.be/ymBosZVeRc8?si=oz4zbKzKuzio5jkP', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80', duration: '22:15' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/alexriveradesign',
      channel_name: 'Alex Rivera Design',
      subscriber_count: '67.2K',
      featured_playlist: 'https://youtube.com/playlist?list=PLdesigntutorials',
      latest_video_embed: 'https://youtu.be/ymBosZVeRc8?si=oz4zbKzKuzio5jkP',
      channel_description: 'Design tutorials, project showcases, and creative inspiration from a professional graphic designer. Subscribe for weekly design content!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '14:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/alexrivera',
      calendar_link: 'https://calendar.google.com/alexrivera',
      consultation_note: 'Free 30-minute creative consultation to discuss your project needs'
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah Chen', client_company: 'Bloom Botanicals', review: 'Alex created an absolutely stunning brand identity for our plant-based skincare line. The designs perfectly captured our eco-friendly values!', rating: '5', project_type: 'Brand Identity' },
        { client_name: 'Marcus Johnson', client_company: 'TechFlow Solutions', review: 'Our new website design has increased conversions by 40%. Alex\'s creative vision and attention to detail are unmatched.', rating: '5', project_type: 'Web Design' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Arts%20District%20Los%20Angeles%20CA&z=14&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Arts+District+Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/behance-creative-portfolios/id489667151',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.behance.behance'
    },
    contact_form: {
      form_title: 'Let\'s Create Something Amazing',
      form_description: 'Ready to bring your vision to life? Share your project details and let\'s start creating something extraordinary together.'
    },
    thank_you: {
      message: 'Thank you for reaching out! I\'ll review your project details and get back to you within 24 hours with ideas and next steps.'
    },
    action_buttons: {
      contact_button_text: 'Let\'s Create Magic Together',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'Alex Rivera Design | Branding, Web, and Packaging Design',
      meta_description: 'Creative direction and graphic design for memorable brands, digital products, and packaging experiences.',
      keywords: 'graphic designer, branding, web design, packaging design, creative director, portfolio',
      og_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="design-awards"><h4>Recent Awards</h4><p>🏆 Best Brand Identity - Design Awards 2024</p><p>🎨 Creative Excellence - Graphic Design USA</p><p>✨ Innovation in Design - Creative Review</p></div>',
      section_title: 'Awards & Recognition',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect & Collaborate',
      qr_description: 'Scan to save my contact and explore my creative portfolio instantly!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Alex Rivera Design Studio. All rights reserved.'
    }
  }
};
