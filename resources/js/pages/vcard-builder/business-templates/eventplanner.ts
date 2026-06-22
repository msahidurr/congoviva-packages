import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const eventplannerTemplate = {
  name: t('Event Planner'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Business Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
        { name: 'cover_image', type: 'file', label: t('Cover Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'events_completed', type: 'number', label: t('Events Completed') }
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
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'wedding', label: t('Wedding') },
              { value: 'corporate', label: t('Corporate') },
              { value: 'birthday', label: t('Birthday') },
              { value: 'social', label: t('Social Gathering') },
              { value: 'conference', label: t('Conference') },
              { value: 'concert', label: t('Concert') },
              { value: 'festival', label: t('Festival') },
              { value: 'graduation', label: t('Graduation') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Event Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Event Showcase Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'event_highlight', label: t('Event Highlight Reel') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'venue_tour', label: t('Venue Tour') },
              { value: 'planning_process', label: t('Planning Process') },
              { value: 'setup_timelapse', label: t('Setup Timelapse') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'event_category', type: 'select', label: t('Event Category'), options: [
              { value: 'wedding', label: t('Wedding') },
              { value: 'corporate', label: t('Corporate') },
              { value: 'social', label: t('Social') },
              { value: 'conference', label: t('Conference') },
              { value: 'celebration', label: t('Celebration') }
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
      name: t('Portfolio'),
      fields: [
        {
          name: 'events',
          type: 'repeater',
          label: t('Past Events'),
          fields: [
            { name: 'title', type: 'text', label: t('Event Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'date', type: 'text', label: t('Event Date') },
            { name: 'location', type: 'text', label: t('Location') },
            { name: 'image', type: 'file', label: t('Event Image') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'wedding', label: t('Wedding') },
              { value: 'corporate', label: t('Corporate') },
              { value: 'birthday', label: t('Birthday') },
              { value: 'social', label: t('Social Gathering') },
              { value: 'conference', label: t('Conference') },
              { value: 'concert', label: t('Concert') },
              { value: 'festival', label: t('Festival') },
              { value: 'graduation', label: t('Graduation') }
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
        { name: 'address', type: 'text', label: t('Address') }
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
            { name: 'is_closed', type: 'checkbox', label: t('Closed') },
            { name: 'by_appointment', type: 'checkbox', label: t('By Appointment Only') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'gallery',
      name: t('Photo Gallery'),
      fields: [
        {
          name: 'photos',
          type: 'repeater',
          label: t('Photos'),
          fields: [
            { name: 'image', type: 'file', label: t('Image') },
            { name: 'caption', type: 'text', label: t('Caption') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'wedding', label: t('Wedding') },
              { value: 'corporate', label: t('Corporate') },
              { value: 'birthday', label: t('Birthday') },
              { value: 'social', label: t('Social Gathering') },
              { value: 'conference', label: t('Conference') },
              { value: 'concert', label: t('Concert') },
              { value: 'festival', label: t('Festival') },
              { value: 'graduation', label: t('Graduation') }
            ]}
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
            { name: 'event_type', type: 'text', label: t('Event Type') },
            { name: 'event_date', type: 'text', label: t('Event Date') }
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
        { name: 'section_title', type: 'text', label: t('Section Title') },
        { name: 'section_description', type: 'textarea', label: t('Section Description') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'consultation_text', type: 'text', label: t('Free Consultation Button Text') }
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
    },    {
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
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'appointment_button_text', type: 'text', label: t('Event Planning Button Text') },
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
    }
  ],
  colorPresets: [
    { name: 'Purple Elegance', primary: '#9C27B0', secondary: '#E1BEE7', accent: '#F3E5F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Rose Gold Glam', primary: '#E91E63', secondary: '#F8BBD9', accent: '#FCE4EC', background: '#FFFFFF', text: '#333333' },
    { name: 'Champagne Dreams', primary: '#FF9800', secondary: '#FFCC02', accent: '#FFF8E1', background: '#FFFFFF', text: '#333333' },
    { name: 'Midnight Blue', primary: '#1A237E', secondary: '#3F51B5', accent: '#E8EAF6', background: '#FFFFFF', text: '#333333' },
    { name: 'Emerald Luxury', primary: '#00695C', secondary: '#26A69A', accent: '#E0F2F1', background: '#FFFFFF', text: '#333333' },
    { name: 'Coral Celebration', primary: '#FF5722', secondary: '#FF8A65', accent: '#FBE9E7', background: '#FFFFFF', text: '#333333' },
    { name: 'Silver Sophistication', primary: '#607D8B', secondary: '#90A4AE', accent: '#ECEFF1', background: '#FFFFFF', text: '#333333' },
    { name: 'Blush Romance', primary: '#AD1457', secondary: '#EC407A', accent: '#F8BBD9', background: '#FFFFFF', text: '#333333' },
    { name: 'Golden Celebration', primary: '#F57F17', secondary: '#FFCA28', accent: '#FFFDE7', background: '#FFFFFF', text: '#333333' },
    { name: 'Royal Purple', primary: '#6A1B9A', secondary: '#BA68C8', accent: '#F3E5F5', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Dancing Script', value: 'Dancing Script, cursive', weight: '400,500,600,700' },
    { name: 'Raleway', value: 'Raleway, sans-serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#9C27B0',
    secondary: '#E1BEE7',
    accent: '#F3E5F5',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#FAFAFA',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'event-layout',
    headerStyle: 'modern',
    cardStyle: 'rounded',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable',
    shadows: 'soft'
  },
  defaultData: {
    header: {
      name: 'Stellar Events',
      tagline: 'Creating unforgettable moments for every occasion',
      logo: '',
      cover_image: ''
    },
    about: {
      description: 'Stellar Events is a full-service event planning company dedicated to creating memorable experiences. With meticulous attention to detail and creative vision, we transform your ideas into flawlessly executed events that exceed expectations.',
      year_established: '2015',
      events_completed: '500'
    },
    services: {
      service_list: [
        { title: 'Wedding Planning', description: 'Full-service wedding planning from engagement to reception, including venue selection, vendor coordination, and day-of management.', icon: 'wedding' },
        { title: 'Corporate Events', description: 'Professional planning for conferences, product launches, team building activities, and company celebrations.', icon: 'corporate' },
        { title: 'Social Gatherings', description: 'Personalized planning for birthdays, anniversaries, holiday parties, and other special occasions.', icon: 'social' },
        { title: 'Destination Events', description: 'Comprehensive planning for events at remote locations, including travel arrangements and accommodation coordination.', icon: 'conference' }
      ]
    },
    portfolio: {
      events: [
        { title: 'Johnson-Smith Wedding', description: 'An elegant garden wedding with 150 guests featuring a custom floral arch, gourmet dinner, and live string quartet.', date: 'June 15, 2023', location: 'Rosewood Gardens', image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', category: 'wedding' },
        { title: 'TechCorp Annual Conference', description: 'A two-day conference for 300 attendees with keynote speakers, breakout sessions, and networking events.', date: 'September 22, 2023', location: 'Grand Hotel Conference Center', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80', category: 'corporate' },
        { title: 'Silver Anniversary Gala', description: 'A black-tie celebration with custom decor, five-course dinner, and entertainment for 200 guests.', date: 'November 5, 2023', location: 'Metropolitan Ballroom', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80', category: 'social' }
      ]
    },
    contact: {
      email: 'info@stellarevents.com',
      phone: '(555) 123-4567',
      website: 'https://www.stellarevents.com',
      address: '123 Event Plaza, Suite 200, Los Angeles, CA 90001'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/stellarevents', username: '@stellarevents' },
        { platform: 'facebook', url: 'https://facebook.com/stellarevents', username: 'Stellar Events' },
        { platform: 'pinterest', url: 'https://pinterest.com/stellarevents', username: 'stellarevents' },
        { platform: 'youtube', url: 'https://youtube.com/stellarevents', username: 'Stellar Events' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Sarah & James Wedding Highlight', description: 'A romantic wedding highlight film capturing heartfelt vows, elegant decor, and joyful celebration moments.', video_type: 'event_highlight', embed_url: 'https://www.youtube.com/watch?v=kkg1QmL3s5o', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', duration: '3:20', event_category: 'wedding' },
        { title: 'Behind the Scenes - Wedding Day Coverage', description: 'Go behind the scenes and see how beautiful wedding moments are prepared, framed, and captured throughout the day.', video_type: 'behind_scenes', embed_url: 'https://www.youtube.com/watch?v=ON8rE8XQZeU', thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', duration: '8:30', event_category: 'wedding' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/stellarevents',
      channel_name: 'Stellar Events',
      subscriber_count: '18.3K',
      featured_playlist: 'https://youtube.com/playlist?list=PLweddinghighlights',
      latest_video_embed: 'https://www.youtube.com/watch?v=ON8rE8XQZeU',
      channel_description: 'Event planning inspiration, behind-the-scenes content, and client success stories from your trusted event planning professionals.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: false },
        { day: 'tuesday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: false },
        { day: 'wednesday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: false },
        { day: 'thursday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: false },
        { day: 'saturday', open_time: '10:00', close_time: '15:00', is_closed: false, by_appointment: true },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true, by_appointment: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', caption: 'Elegant wedding reception with custom lighting', category: 'wedding' },
        { image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80', caption: 'Corporate product launch with interactive displays', category: 'corporate' },
        { image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80', caption: 'Birthday celebration with custom theme decor', category: 'birthday' },
        { image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80', caption: 'Outdoor festival setup with stage and vendor booths', category: 'festival' }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah & Michael', review: 'Stellar Events made our wedding day absolutely perfect. Their attention to detail and ability to bring our vision to life exceeded our expectations.', rating: '5', event_type: 'Wedding', event_date: 'June 2023' },
        { client_name: 'TechCorp Inc.', review: 'Our annual conference was flawlessly executed thanks to the Stellar Events team. Their professionalism and organization made the planning process stress-free.', rating: '5', event_type: 'Corporate Conference', event_date: 'September 2023' },
        { client_name: 'Jennifer R.', review: 'The 50th anniversary party they planned for my parents was everything we hoped for and more. Every detail was perfect and the guests are still talking about it!', rating: '5', event_type: 'Anniversary Party', event_date: 'November 2023' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/stellarevents',
      section_title: 'Ready to Plan Your Event?',
      section_description: 'Let\'s discuss your vision and create an unforgettable experience together.',
      booking_text: 'Schedule a Consultation',
      consultation_text: 'Free 30-Min Consultation'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Los%20Angeles%20Convention%20Center%2C%20Los%20Angeles%2C%20CA&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Los+Angeles+Convention+Center+Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/the-knot-wedding-planner/id457954999',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.xogrp.theknot',
      app_description: 'Download our app to view your event details, communicate with our team, and access your planning timeline.'
    },
    contact_form: {
      form_title: 'Tell Us About Your Event',
      form_description: 'Share your event vision with us, and we will contact you to discuss how we can bring it to life.'
    },
    thank_you: {
      message: 'Thank you for contacting Stellar Events. We appreciate your interest and will get back to you within 24-48 hours to discuss your event needs.'
    },    seo: {
      meta_title: 'Stellar Events | Wedding, Corporate, and Special Event Planning',
      meta_description: 'Expert event planning services for weddings, corporate gatherings, celebrations, and destination events.',
      keywords: 'event planner, wedding planner, corporate events, party planning, destination events',
      og_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Event Planning Tips</h4><p>Discover our latest event planning insights and inspiration.</p></div>',
      section_title: 'Planning Resources',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Services',
      qr_description: 'Scan this QR code to share our event planning services with friends and family.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Plan My Event',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Creating unforgettable moments for every occasion. Let us bring your vision to life with our expert event planning services.',
      footer_links: [
        { title: 'Event Packages', url: '#services' },
        { title: 'Portfolio', url: '#portfolio' },
        { title: 'Book Consultation', url: '#booking' },
        { title: 'Contact Us', url: '#contact' }
      ]
    },
    copyright: {
      text: '© 2025 Stellar Events. All rights reserved.'
    }
  }
};
