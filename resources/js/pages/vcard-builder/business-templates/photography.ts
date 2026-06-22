import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const photographyTemplate = {
  name: t('Photography'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'cta_button_text', type: 'text', label: t('Call-to-Action Button Text') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') },
        { name: 'background_image', type: 'file', label: t('Background Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'specialties', type: 'tags', label: t('Photography Specialties') }
      ],
      required: false
    },
    {
      key: 'portfolio',
      name: t('Portfolio'),
      fields: [
        {
          name: 'gallery',
          type: 'repeater',
          label: t('Photo Gallery'),
          fields: [
            { name: 'title', type: 'text', label: t('Image Title') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'portrait', label: t('Portrait') },
              { value: 'landscape', label: t('Landscape') },
              { value: 'wedding', label: t('Wedding') },
              { value: 'event', label: t('Event') },
              { value: 'commercial', label: t('Commercial') },
              { value: 'street', label: t('Street') }
            ]},
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'description', type: 'textarea', label: t('Description') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Photography Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Photography Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'tutorial', label: t('Photography Tutorial') },
              { value: 'client_session', label: t('Client Session Highlights') },
              { value: 'portfolio_showcase', label: t('Portfolio Showcase') },
              { value: 'equipment_review', label: t('Equipment Review') },
              { value: 'wedding_highlight', label: t('Wedding Highlight Reel') }
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
          label: t('Photography Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'camera', label: t('Camera') },
              { value: 'video', label: t('Video') },
              { value: 'edit', label: t('Editing') },
              { value: 'portrait', label: t('Portrait') },
              { value: 'wedding', label: t('Wedding') },
              { value: 'event', label: t('Event') }
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
        { name: 'location', type: 'text', label: t('Studio Location') }
      ],
      required: true
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
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') }
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
            { name: 'client_image', type: 'file', label: t('Client Image') },
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
    }
  ],
  colorPresets: [
    { name: 'Monochrome', primary: '#000000', secondary: '#333333', accent: '#FFFFFF', background: '#FFFFFF', text: '#000000' },
    { name: 'Vintage Sepia', primary: '#704214', secondary: '#A67951', accent: '#F2E2C6', background: '#FDF8F0', text: '#3A2921' },
    { name: 'Warm Portrait', primary: '#D35400', secondary: '#E67E22', accent: '#FEF5E7', background: '#FFFFFF', text: '#333333' },
    { name: 'Nature Green', primary: '#27AE60', secondary: '#2ECC71', accent: '#E9F7EF', background: '#FFFFFF', text: '#333333' },
    { name: 'Studio Gray', primary: '#7F8C8D', secondary: '#95A5A6', accent: '#ECEFF1', background: '#FFFFFF', text: '#2C3E50' },
    { name: 'Dark Contrast', primary: '#1A1A1A', secondary: '#333333', accent: '#F5F5F5', background: '#0A0A0A', text: '#FFFFFF' },
    { name: 'Minimal White', primary: '#CCCCCC', secondary: '#EEEEEE', accent: '#F8F8F8', background: '#FFFFFF', text: '#333333' },
    { name: 'Film Blue', primary: '#2C3E50', secondary: '#34495E', accent: '#ECF0F1', background: '#FFFFFF', text: '#2C3E50' },
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Futura', value: 'Futura, sans-serif', weight: '400,500,600' },
    { name: 'Helvetica Neue', value: 'Helvetica Neue, Helvetica, Arial, sans-serif', weight: '300,400,500,700' },
    { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#000000',
    secondary: '#333333',
    accent: '#FFFFFF',
    background: '#FFFFFF',
    text: '#000000',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    overlayColor: 'rgba(0,0,0,0.7)'
  },
  defaultFont: 'Playfair Display, serif',
  themeStyle: {
    layout: 'photography-layout',
    headerStyle: 'fullscreen',
    cardStyle: 'minimal',
    buttonStyle: 'minimal',
    iconStyle: 'simple',
    spacing: 'airy',
    shadows: 'subtle',
    animations: 'fade',
    imageStyle: 'bordered',
    overlayEffects: true
  },
  defaultData: {
    header: {
      name: 'Alex Morgan',
      title: 'Professional Photographer',
      tagline: 'Capturing moments that last forever',
      cta_button_text: 'Get in Touch',
      profile_image: '',
      background_image: ''
    },
    about: {
      description: 'With over 10 years of experience in photography, I specialize in capturing authentic moments with an artistic eye. My work has been featured in various publications and exhibitions around the country.',
      experience: '10',
      specialties: 'Portrait, Wedding, Commercial, Fine Art, Event Photography'
    },
    portfolio: {
      gallery: [
        { title: 'Summer Wedding', category: 'wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', description: 'Elegant summer wedding at Lakeside Gardens' },
        { title: 'Urban Portrait', category: 'portrait', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', description: 'Creative portrait session in downtown area' },
        { title: 'Mountain Landscape', category: 'landscape', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', description: 'Sunrise at Blue Ridge Mountains' },
        { title: 'Corporate Event', category: 'event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80', description: 'Annual tech conference photography' }
      ]
    },
    services: {
      service_list: [
        { title: 'Wedding Photography', description: 'Full-day coverage of your special day with edited digital images and prints', price: 'From $2,500', duration: '8-10 hours', icon: 'wedding' },
        { title: 'Portrait Session', description: 'Professional portrait photography for individuals, couples or families', price: 'From $350', duration: '1-2 hours', icon: 'portrait' },
        { title: 'Commercial Photography', description: 'High-quality images for your business, products or services', price: 'From $800', duration: 'Custom', icon: 'camera' },
        { title: 'Event Coverage', description: 'Professional photography for corporate events, parties and special occasions', price: 'From $600', duration: 'Variable', icon: 'event' }
      ]
    },
    contact: {
      email: 'alex@morganphotography.com',
      phone: '+1 (555) 123-4567',
      website: 'https://morganphotography.com',
      location: 'Studio 42, 123 Creative Ave, New York, NY'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/alexmorganphoto', username: '@alexmorganphoto' },
        { platform: 'facebook', url: 'https://facebook.com/alexmorganphotography', username: 'Alex Morgan Photography' },
        { platform: 'pinterest', url: 'https://pinterest.com/alexmorganphoto', username: 'alexmorganphoto' },
        { platform: 'behance', url: 'https://behance.net/alexmorgan', username: 'Alex Morgan' },
        { platform: 'youtube', url: 'https://youtube.com/alexmorganphoto', username: 'Alex Morgan Photography' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Behind the Scenes - Wedding Photography', description: 'See how I capture the perfect wedding moments throughout the day', video_type: 'behind_scenes', embed_url: 'https://www.youtube.com/watch?v=ON8rE8XQZeU', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', duration: '8:30' },
        { title: 'Portrait Lighting Tutorial', description: 'Learn professional portrait lighting techniques for stunning results', video_type: 'tutorial', embed_url: 'https://www.youtube.com/watch?v=L199IpvSsRI', thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80', duration: '12:45' },
        { title: 'Sarah & James Wedding Highlight', description: 'Beautiful wedding highlight reel from Lakeside Gardens', video_type: 'wedding_highlight', embed_url: 'https://www.youtube.com/watch?v=kkg1QmL3s5o', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', duration: '3:20' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/alexmorganphoto',
      channel_name: 'Alex Morgan Photography',
      subscriber_count: '78.4K',
      featured_playlist: 'https://youtube.com/playlist?list=PLphotographytutorials',
      latest_video_embed: 'https://www.youtube.com/watch?v=L199IpvSsRI',
      channel_description: 'Photography tutorials, behind-the-scenes content, and wedding highlights from a professional photographer. Subscribe for weekly photography tips!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '10:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '11:00', close_time: '16:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/alexmorgan',
      calendar_link: 'https://calendar.google.com/alexmorgan',
      booking_text: 'Schedule a Consultation'
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah & James', client_image: '', review: 'Alex captured our wedding day perfectly. The photos are absolutely stunning and really tell the story of our special day. Highly recommended!', rating: '5', project_type: 'Wedding' },
        { client_name: 'Corporate Solutions Inc.', client_image: '', review: 'Professional, creative and efficient. Alex delivered exceptional photos for our corporate branding that perfectly captured our company culture.', rating: '5', project_type: 'Commercial' },
        { client_name: 'Emma T.', client_image: '', review: 'The family portrait session was a wonderful experience. Alex made everyone feel comfortable and the results were beautiful.', rating: '5', project_type: 'Portrait' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Creative%20Ave%2C%20New%20York%2C%20NY&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Creative+Ave+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/lightroom-photo-video-editor/id878783582',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.adobe.lrmobile',
      app_description: 'Download our mobile app to view your photo galleries, book sessions, and stay updated with our latest work.'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Interested in working together? Fill out the form below with details about your project, and I\'ll get back to you to discuss how we can create something beautiful together.'
    },
    action_buttons: {
      contact_button_text: 'Capture Your Moments',
      appointment_button_text: 'Book a Session',
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for your interest in my photography services. I\'ll review your message and get back to you within 24-48 hours to discuss your project in detail.'
    },    seo: {
      meta_title: 'Alex Morgan Photography | Wedding, Portrait, and Commercial Photography',
      meta_description: 'Professional photography services for weddings, portraits, events, and commercial shoots with Alex Morgan.',
      keywords: 'photographer, wedding photography, portrait photography, event photography, commercial photography',
      og_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div style="text-align: center; padding: 20px;"><h3>Photography Awards & Recognition</h3><ul style="list-style: none; padding: 0;"><li>🏆 Best Wedding Photographer 2024 - Metro City Awards</li><li>📸 Featured in Photography Magazine</li><li>🏖️ International Photography Contest Winner</li><li>⭐ 5-Star Rating on WeddingWire</li></ul></div>',
      section_title: 'Awards & Recognition',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Photography Portfolio',
      qr_description: 'Scan the QR code to easily share my portfolio with friends and family, or to quickly access my contact information and booking details.'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Alex Morgan Photography. All rights reserved.'
    }
  }
};
