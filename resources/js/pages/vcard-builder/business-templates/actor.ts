import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const actorTemplate = {
  name: t('Actor'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') },
        { name: 'banner_image', type: 'file', label: t('Banner Background Image') },
        { name: 'banner_bg_image', type: 'file', label: t('Banner Overlay Image') }
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
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'specialties', type: 'tags', label: t('Acting Specialties') }
      ],
      required: false
    },
    {
      key: 'gallery',
      name: t('Gallery'),
      fields: [
        {
          name: 'media_list',
          type: 'repeater',
          label: t('Photos & Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Media Title') },
            { name: 'image', type: 'file', label: t('Image File') },
          ]
        }
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
          label: t('Acting Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'image', type: 'file', label: t('Service Image') },
            { name: 'url', type: 'url', label: t('More Info URL') }
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
      name: t('Availability Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Availability Hours'),
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
            { name: 'open_time', type: 'time', label: t('Available From') },
            { name: 'close_time', type: 'time', label: t('Available Until') },
            { name: 'is_closed', type: 'checkbox', label: t('Not Available') }
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
        { name: 'appointment_title', type: 'text', label: t('Appointment Section Title') }
      ],
      required: false
    },
    {
      key: 'awards',
      name: t('Awards & Recognition'),
      fields: [
        {
          name: 'award_list',
          type: 'repeater',
          label: t('Awards & Achievements'),
          fields: [
            { name: 'title', type: 'text', label: t('Award Title') },
            { name: 'category', type: 'text', label: t('Category') },
            { name: 'year', type: 'text', label: t('Year') },
            { name: 'organization', type: 'text', label: t('Organization/Festival') },
            { name: 'project', type: 'text', label: t('Project/Role') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'image', type: 'file', label: t('Award Image') }
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
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'client_image', type: 'file', label: t('Client Photo') }
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
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') },
        { name: 'share_button_text', type: 'text', label: t('Share Button Text') }
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
    { name: 'Classic Actor', primary: '#460B0D', secondary: '#F2F2F2', accent: '#881346', background: '#FFFFFF', text: '#111111', cardBg: '#F2F2F2' },
    { name: 'Broadway Red', primary: '#DC143C', secondary: '#FFE4E1', accent: '#B22222', background: '#FFFFFF', text: '#000000', cardBg: '#FFF8F8' },
    { name: 'Elegant Purple', primary: '#6A0DAD', secondary: '#E6E6FA', accent: '#4B0082', background: '#FFFFFF', text: '#2F2F2F', cardBg: '#F8F8FF' },
    { name: 'Modern Teal', primary: '#008B8B', secondary: '#E0FFFF', accent: '#20B2AA', background: '#FFFFFF', text: '#2F4F4F', cardBg: '#F0FFFF' },
    { name: 'Vintage Brown', primary: '#8B4513', secondary: '#F5DEB3', accent: '#A0522D', background: '#FFF8DC', text: '#654321', cardBg: '#FAEBD7' },
    { name: 'Royal Blue', primary: '#4169E1', secondary: '#E6F3FF', accent: '#1E90FF', background: '#FFFFFF', text: '#191970', cardBg: '#F0F8FF' },
    { name: 'Forest Green', primary: '#228B22', secondary: '#F0FFF0', accent: '#32CD32', background: '#FFFFFF', text: '#006400', cardBg: '#F5FFFA' }
  ],
  fontOptions: [
    { name: 'Lora', value: 'Lora, serif', weight: '400,500,600,700' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Crimson Text', value: 'Crimson Text, serif', weight: '400,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Lato', value: 'Lato, sans-serif', weight: '300,400,700' },
  ],
  defaultColors: {
    primary: '#460B0D',
    secondary: '#F2F2F2',
    accent: '#881346',
    background: '#FFFFFF',
    text: '#111111',
    cardBg: '#F2F2F2',
    borderColor: '#E2E2E2'
  },
  defaultFont: 'Lora, serif',
  themeStyle: {
    layout: 'elegant-card',
    headerStyle: 'banner-overlay',
    cardStyle: 'clean-modern',
    buttonStyle: 'rounded',
    iconStyle: 'filled',
    spacing: 'comfortable',
    shadows: 'subtle',
    animations: 'smooth',
    backgroundPattern: 'none'
  },
  defaultData: {
    header: {
      name: 'Jolie Doe',
      title: 'Event & Wedding Planner',
      tagline: 'Creating unforgettable moments and bringing your dreams to life',
      profile_image: '',
      banner_image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80',
      banner_bg_image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1400&q=80'
    },
    contact: {
      email: 'kontakt@alpesh.com',
      phone: '+91 1122334455',
      website: 'https://www.linkedin.com/',
      location: 'New York, NY'
    },
    about: {
      description: 'Professional actor with extensive experience in theater, film, and television. Passionate about bringing characters to life and telling compelling stories that resonate with audiences.',
      experience: '8',
      specialties: 'Theater, Film, Television, Voice Acting, Commercial Acting'
    },
    gallery: {
      media_list: [
        { title: 'Behind the Scenes', type: 'image', image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', video_url: '', thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80' },
        { title: 'Performance Reel', type: 'video', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80', video_url: '', thumbnail: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80' },
        { title: 'Stage Performance', type: 'image', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80', video_url: '', thumbnail: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    services: {
      service_list: [
        { title: 'Theater Performance', description: 'Professional stage acting for theatrical productions', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80', url: 'https://www.imdb.com/' },
        { title: 'Film & TV Acting', description: 'On-camera work for movies, series, and commercials', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80', url: 'https://www.backstage.com/' }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com', username: 'actorname' },
        { platform: 'twitter', url: 'https://x.com', username: '@actorname' },
        { platform: 'instagram', url: 'https://instagram.com', username: 'actorname' },
        { platform: 'youtube', url: 'https://youtube.com', username: 'Actor Channel' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/actorname', username: 'actorname' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:10', close_time: '20:00', is_closed: false },
        { day: 'tuesday', open_time: '08:10', close_time: '20:00', is_closed: false },
        { day: 'wednesday', open_time: '08:10', close_time: '20:00', is_closed: false },
        { day: 'thursday', open_time: '08:10', close_time: '20:00', is_closed: false },
        { day: 'friday', open_time: '08:10', close_time: '20:00', is_closed: false },
        { day: 'saturday', open_time: '08:10', close_time: '20:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: '',
      calendar_link: '',
      appointment_title: 'Make an Appointment'
    },
    awards: {
      award_list: [
        { 
          title: 'Best Actor Award', 
          category: 'Lead Role Performance', 
          year: '2024', 
          organization: 'International Film Festival', 
          project: 'Shadow Within', 
          description: 'Awarded for delivering an outstanding and emotionally powerful lead performance in the film.',
          image: ''
        },
        { 
          title: 'Excellence in Acting', 
          category: 'Drama Performance', 
          year: '2023', 
          organization: 'National Cinema Awards', 
          project: 'Broken Paths', 
          description: 'Recognized for exceptional screen presence and remarkable acting skills in a dramatic role.',
          image: ''
        }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Director Smith', review: 'It was a very good experience working with this talented actor. Professional and dedicated to the craft.', rating: '5', client_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80' },
        { client_name: 'Producer Johnson', review: 'Exceptional performance and great work ethic. Highly recommend for any production.', rating: '5', client_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80' },
        { client_name: 'Casting Director', review: 'Versatile actor with great range. Always delivers outstanding performances.', rating: '5', client_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    youtube: {
      channel_url: 'https://www.youtube.com/@actorchannel',
      channel_name: 'Actor Channel',
      subscriber_count: '50K',
      featured_playlist: 'https://www.youtube.com/playlist?list=PLexample',
      latest_video_embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      channel_description: 'Welcome to my YouTube channel! Here you\'ll find acting tutorials, behind-the-scenes content, and exclusive performances.'
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Broadway%20New%20York%20NY&z=14&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Broadway+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/imdb-movies-tv/id342792525',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.imdb.mobile'
    },
    contact_form: {
      form_title: 'Get In Touch',
      form_description: 'Ready to work together? Contact me to discuss your project and let\'s create something amazing.'
    },
    thank_you: {
      message: 'Thank you for your interest! I appreciate you taking the time to view my profile and look forward to connecting with you soon.'
    },
    seo: {
      meta_title: 'Jolie Doe - Professional Actor | Theater, Film & TV',
      meta_description: 'Professional actor with 8+ years experience in theater, film, and television. Available for casting and performance opportunities.',
      keywords: 'actor, actress, theater, film, television, casting, performance, entertainment',
      og_image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80'
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Featured Work</h4><p>Check out my latest performances and projects.</p></div>',
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
      enable_language_switcher: false
    },
    action_buttons: {
      contact_button_text: 'Contact',
      appointment_button_text: 'Make An Appointment',
      save_contact_button_text: 'Save',
      share_button_text: 'Share'
    },
    footer: {
      show_footer: true,
      footer_text: 'Ready to bring your vision to life? Let\'s collaborate and create something extraordinary together.',
      footer_links: [
        { title: 'View Portfolio', url: '#gallery' },
        { title: 'Book Meeting', url: '#appointments' },
        { title: 'Contact Me', url: '#contact' }
      ]
    },
    copyright: {
      text: 'Copyright vCardGo-SaaS 2025'
    }
  }
};
