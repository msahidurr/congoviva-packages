import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const weddingPlannerTemplate = {
  name: t('Wedding Planner'),
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
        { name: 'years_experience', type: 'number', label: t('Years of Experience') },
        { name: 'weddings_planned', type: 'number', label: t('Weddings Planned') },
        { name: 'approach', type: 'select', label: t('Planning Approach'), options: [
          { value: 'traditional', label: t('Traditional') },
          { value: 'modern', label: t('Modern & Contemporary') },
          { value: 'destination', label: t('Destination Weddings') },
          { value: 'luxury', label: t('Luxury Events') },
          { value: 'intimate', label: t('Intimate Gatherings') },
          { value: 'cultural', label: t('Cultural Ceremonies') }
        ]}
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'packages',
          type: 'repeater',
          label: t('Service Packages'),
          fields: [
            { name: 'name', type: 'text', label: t('Package Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price_range', type: 'text', label: t('Price Range') },
            { name: 'image', type: 'file', label: t('Package Image') },
            { name: 'features', type: 'textarea', label: t('Features (one per line)') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'portfolio',
      name: t('Wedding Portfolio'),
      fields: [
        {
          name: 'weddings',
          type: 'repeater',
          label: t('Featured Weddings'),
          fields: [
            { name: 'title', type: 'text', label: t('Wedding Title') },
            { name: 'location', type: 'text', label: t('Location') },
            { name: 'date', type: 'text', label: t('Date') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'cover_image', type: 'file', label: t('Cover Image') },
            { name: 'style', type: 'select', label: t('Wedding Style'), options: [
              { value: 'rustic', label: t('Rustic') },
              { value: 'beach', label: t('Beach') },
              { value: 'garden', label: t('Garden') },
              { value: 'modern', label: t('Modern') },
              { value: 'traditional', label: t('Traditional') },
              { value: 'bohemian', label: t('Bohemian') },
              { value: 'vintage', label: t('Vintage') },
              { value: 'luxury', label: t('Luxury') }
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
      key: 'videos',
      name: t('Wedding Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Wedding Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'wedding_highlight', label: t('Wedding Highlight Reel') },
              { value: 'planning_process', label: t('Planning Process') },
              { value: 'venue_tour', label: t('Venue Tour') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'planning_tips', label: t('Wedding Planning Tips') }
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
      key: 'gallery',
      name: t('Photo Gallery'),
      fields: [
        {
          name: 'photos',
          type: 'repeater',
          label: t('Photos'),
          fields: [
            { name: 'image', type: 'file', label: t('Image') },
            { name: 'caption', type: 'text', label: t('Caption') }
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
            { name: 'couple_name', type: 'text', label: t('Couple Name') },
            { name: 'wedding_date', type: 'text', label: t('Wedding Date') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'couple_image', type: 'file', label: t('Couple Photo') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Consultation'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'consultation_length', type: 'text', label: t('Consultation Length') },
        { name: 'consultation_info', type: 'textarea', label: t('Consultation Information') },
        { name: 'virtual_option', type: 'checkbox', label: t('Virtual Consultation Available') }
      ],
      required: false
    },
    {
      key: 'venues',
      name: t('Preferred Venues'),
      fields: [
        {
          name: 'venue_list',
          type: 'repeater',
          label: t('Venues'),
          fields: [
            { name: 'name', type: 'text', label: t('Venue Name') },
            { name: 'location', type: 'text', label: t('Location') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'image', type: 'file', label: t('Venue Image') },
            { name: 'capacity', type: 'text', label: t('Capacity') },
            { name: 'website', type: 'url', label: t('Venue Website') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'faq',
      name: t('FAQ'),
      fields: [
        {
          name: 'questions',
          type: 'repeater',
          label: t('Frequently Asked Questions'),
          fields: [
            { name: 'question', type: 'text', label: t('Question') },
            { name: 'answer', type: 'textarea', label: t('Answer') }
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
    { name: 'Elegant Blush', primary: '#D8A7B1', secondary: '#EAC9C1', accent: '#F9F1F0', background: '#FFFFFF', text: '#5D4954' },
    { name: 'Classic Navy', primary: '#34568B', secondary: '#5C7AEA', accent: '#EFF3F6', background: '#FFFFFF', text: '#333333' },
    { name: 'Sage Green', primary: '#7D8E69', secondary: '#A9B388', accent: '#F1F5EC', background: '#FFFFFF', text: '#3A3A3A' },
    { name: 'Dusty Rose', primary: '#C9A9A6', secondary: '#E5C1C1', accent: '#F8F1F1', background: '#FFFFFF', text: '#4A4A4A' },
    { name: 'Gold & Ivory', primary: '#D4AF37', secondary: '#F5E7A9', accent: '#FFFDF6', background: '#FFFFFF', text: '#3A3A3A' },
    { name: 'Lavender Dream', primary: '#9D8EC7', secondary: '#B8A9DF', accent: '#F5F0FF', background: '#FFFFFF', text: '#4A4A4A' }
  ],
  fontOptions: [
    { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', weight: '300,400,500,600,700' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Lato', value: 'Lato, sans-serif', weight: '300,400,700' },
    { name: 'Great Vibes', value: 'Great Vibes, cursive', weight: '400' }
  ],
  defaultColors: {
    primary: '#D8A7B1',
    secondary: '#EAC9C1',
    accent: '#F9F1F0',
    background: '#FFFFFF',
    text: '#5D4954',
    cardBg: '#FFFFFF',
    borderColor: '#F0E4E6',
    buttonText: '#FFFFFF',
    highlightColor: '#D8A7B1'
  },
  defaultFont: 'Cormorant Garamond, serif',
  themeStyle: {
    layout: 'wedding-planner-layout',
    headerStyle: 'elegant',
    cardStyle: 'soft',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'airy',
    shadows: 'soft',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'Eternal Moments',
      tagline: 'Creating unforgettable wedding experiences',
      logo: '',
      cover_image: ''
    },
    about: {
      description: 'Eternal Moments is a boutique wedding planning agency dedicated to creating personalized, stress-free wedding experiences. With meticulous attention to detail and a passion for perfection, we transform your vision into a seamless celebration that reflects your unique love story.',
      years_experience: '10',
      weddings_planned: '250',
      approach: 'luxury'
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Schedule Consultation',
      save_contact_button_text: 'Save Contact'
    },
    services: {
      packages: [
        { name: 'Full Planning', description: 'Comprehensive wedding planning from engagement to "I do"', price_range: 'Starting at $5,000', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80', features: 'Unlimited consultations\nVendor selection and management\nBudget planning and tracking\nTimeline creation\nDay-of coordination\nRSVP management\nGuest accommodations' },
        { name: 'Partial Planning', description: 'Perfect for couples who have started planning but need professional guidance', price_range: 'Starting at $3,000', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80', features: '5 planning consultations\nVendor recommendations\nTimeline creation\nMonth-of coordination\nDay-of execution' },
        { name: 'Month-of Coordination', description: 'For couples who have planned their wedding but need help executing their vision', price_range: 'Starting at $1,500', image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', features: '2 pre-wedding consultations\nVendor confirmation\nDetailed timeline\nCeremony rehearsal\nDay-of coordination\n8 hours of coverage' }
      ]
    },
    portfolio: {
      weddings: [
        { title: 'Emma & James', location: 'Rosewood Gardens', date: 'June 2023', description: 'A romantic garden wedding with lush floral arrangements and elegant touches.', cover_image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80', style: 'garden' },
        { title: 'Sophia & Michael', location: 'Oceanview Terrace', date: 'September 2023', description: 'A breathtaking beach ceremony followed by a reception under the stars.', cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', style: 'beach' },
        { title: 'Olivia & William', location: 'Historic Mansion', date: 'October 2023', description: 'A sophisticated vintage-inspired celebration with timeless elegance.', cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80', style: 'vintage' }
      ]
    },
    contact: {
      email: 'hello@eternalmoments.com',
      phone: '(555) 123-4567',
      website: 'https://www.eternalmoments.com',
      address: '123 Wedding Lane, Charleston, SC 29401'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/eternalmoments', username: '@eternalmoments' },
        { platform: 'pinterest', url: 'https://pinterest.com/eternalmoments', username: 'Eternal Moments' },
        { platform: 'facebook', url: 'https://facebook.com/eternalmoments', username: 'Eternal Moments Weddings' },
        { platform: 'youtube', url: 'https://youtube.com/eternalmoments', username: 'Eternal Moments' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Beautiful Garden Wedding Highlight Reel', description: 'A beautiful garden wedding celebration at Rosewood Gardens', video_type: 'wedding_highlight', embed_url: 'https://www.youtube.com/embed/6_a-B5S266E', thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', duration: '4:30' },
        { title: 'Wedding Planning Process - Behind the Scenes', description: 'See how we transform wedding dreams into reality', video_type: 'planning_process', embed_url: 'https://www.youtube.com/embed/dqSOe3KGuVg', thumbnail: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80', duration: '8:15' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/eternalmoments',
      channel_name: 'Eternal Moments',
      subscriber_count: '28.3K',
      featured_playlist: 'https://youtube.com/playlist?list=PLweddinghighlights',
      latest_video_embed: 'https://www.youtube.com/embed/6_a-B5S266E',
      channel_description: 'Wedding highlights, planning tips, and behind-the-scenes content from luxury wedding planner. Subscribe for weekly wedding inspiration!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: true },
        { day: 'tuesday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: true },
        { day: 'wednesday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: true },
        { day: 'thursday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: true },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false, by_appointment: true },
        { day: 'saturday', open_time: '10:00', close_time: '14:00', is_closed: false, by_appointment: true },
        { day: 'sunday', open_time: '00:00', close_time: '00:00', is_closed: true, by_appointment: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80', caption: 'Elegant table setting with floral centerpieces' },
        { image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80', caption: 'Romantic ceremony arch with garden roses' },
        { image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80', caption: 'Custom wedding cake with gold accents' },
        { image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80', caption: 'Intimate reception under string lights' }
      ]
    },
    testimonials: {
      reviews: [
        { couple_name: 'Emma & James', wedding_date: 'June 2023', review: 'Working with Eternal Moments was the best decision we made for our wedding. They took care of every detail and allowed us to truly enjoy our special day without stress.', couple_image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80', rating: '5' },
        { couple_name: 'Sophia & Michael', wedding_date: 'September 2023', review: 'Our beach wedding was absolutely perfect thanks to the incredible team at Eternal Moments. They thought of details we never would have considered and executed everything flawlessly.', couple_image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80', rating: '5' },
        { couple_name: 'Olivia & William', wedding_date: 'October 2023', review: 'We cannot thank Eternal Moments enough for bringing our vision to life. Their attention to detail and creative solutions made our wedding truly unique and memorable.', couple_image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80', rating: '5' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/eternalmoments/consultation',
      booking_text: 'Schedule a Consultation',
      consultation_length: '60 minutes',
      consultation_info: 'Our complimentary initial consultation allows us to get to know you as a couple and discuss your wedding vision, needs, and how we can help create your perfect day.',
      virtual_option: true
    },
    venues: {
      venue_list: [
        { name: 'Rosewood Gardens', location: 'Charleston, SC', description: 'A picturesque garden venue with lush greenery and elegant architecture.', image: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=900&q=80', capacity: 'Up to 200 guests', website: 'https://www.rosewoodgardens.com' },
        { name: 'Oceanview Terrace', location: 'Myrtle Beach, SC', description: 'Stunning beachfront venue with panoramic ocean views and modern facilities.', image: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80', capacity: 'Up to 150 guests', website: 'https://www.oceanviewterrace.com' },
        { name: 'Historic Mansion', location: 'Savannah, GA', description: 'A grand historic estate with timeless charm and sophisticated ambiance.', image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=80', capacity: 'Up to 120 guests', website: 'https://www.historicmansion.com' }
      ]
    },
    faq: {
      questions: [
        { question: 'How far in advance should I book a wedding planner?', answer: 'We recommend booking your wedding planner 12-18 months before your wedding date, especially if you\'re planning during peak wedding season (May-October).' },
        { question: 'What\'s the difference between a wedding planner and a venue coordinator?', answer: 'A venue coordinator works specifically for the venue and focuses on the venue\'s responsibilities, while a wedding planner works exclusively for you, managing all aspects of your wedding including vendor coordination, timeline creation, and personal assistance throughout the entire planning process.' },
        { question: 'Do you travel for destination weddings?', answer: 'Yes! We love planning destination weddings and have experience coordinating events across the country and internationally. Additional travel fees may apply depending on the location.' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Charleston%20SC&z=12&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Charleston+SC'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/the-knot-wedding-planner/id457954999',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.xogrp.theknot',
      app_description: 'Download our wedding planning app to access your timeline, vendor contacts, budget tracker, and communicate directly with your planning team.'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Ready to start planning your dream wedding? Fill out the form below and we\'ll be in touch within 24 hours to schedule your complimentary consultation.'
    },
    thank_you: {
      message: 'Thank you for your interest in Eternal Moments Wedding Planning. We\'re excited to learn more about your vision and help create your perfect day!'
    },    seo: {
      meta_title: 'Eternal Moments | Wedding Planning and Coordination',
      meta_description: 'Wedding planning services, venue guidance, coordination, and design support for unforgettable celebrations.',
      keywords: 'wedding planner, wedding coordination, bridal planning, venues, destination wedding',
      og_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="wedding-showcase"><h4>Featured in Bridal Magazine</h4><p>See our latest wedding features and press coverage.</p></div>',
      section_title: 'Press & Features',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Wedding Services',
      qr_description: 'Scan this QR code to access our wedding planning portfolio and contact information.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Eternal Moments Wedding Planning. All rights reserved.'
    }
  }
};
