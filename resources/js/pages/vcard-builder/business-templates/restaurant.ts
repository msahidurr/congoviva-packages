import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const restaurantTemplate = {
  name: t('Restaurant'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Restaurant Name') },
        { name: 'tagline', type: 'text', label: t('Tagline') },
        { name: 'cuisine_type', type: 'text', label: t('Cuisine Type') },
        { name: 'service_info', type: 'text', label: t('Service Information') },
        { name: 'logo', type: 'file', label: t('Restaurant Logo') },
        { name: 'cover_image', type: 'file', label: t('Cover Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Restaurant Description') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'chef_name', type: 'text', label: t('Head Chef Name') },
        { name: 'ambiance', type: 'select', label: t('Ambiance'), options: [
          { value: 'casual', label: t('Casual') },
          { value: 'fine_dining', label: t('Fine Dining') },
          { value: 'family', label: t('Family-Friendly') },
          { value: 'bistro', label: t('Bistro') },
          { value: 'cafe', label: t('Café') }
        ]}
      ],
      required: false
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'address', type: 'textarea', label: t('Address') }
      ],
      required: true
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
      key: 'menu_highlights',
      name: t('Menu Highlights'),
      fields: [
        {
          name: 'menu_items',
          type: 'repeater',
          label: t('Menu Items'),
          fields: [
            { name: 'name', type: 'text', label: t('Dish Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Dish Image') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'appetizer', label: t('Appetizer') },
              { value: 'main', label: t('Main Course') },
              { value: 'dessert', label: t('Dessert') },
              { value: 'beverage', label: t('Beverage') },
              { value: 'special', label: t('Chef\'s Special') }
            ]}
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
          label: t('Restaurant Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price (optional)') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Restaurant Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Restaurant Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'restaurant_tour', label: t('Restaurant Tour') },
              { value: 'chef_cooking', label: t('Chef Cooking Demo') },
              { value: 'dish_showcase', label: t('Dish Showcase') },
              { value: 'customer_testimonial', label: t('Customer Testimonial') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'special_events', label: t('Special Events') }
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
          label: t('Restaurant Photos'),
          fields: [
            { name: 'image', type: 'file', label: t('Photo') },
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
          label: t('Customer Reviews'),
          fields: [
            { name: 'customer_name', type: 'text', label: t('Customer Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'date', type: 'text', label: t('Date of Visit') }
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
      key: 'appointments',
      name: t('Reservations'),
      fields: [
        { name: 'reservation_url', type: 'url', label: t('Reservation URL') },
        { name: 'reservation_phone', type: 'tel', label: t('Reservation Phone') },
        { name: 'min_party_size', type: 'number', label: t('Minimum Party Size') },
        { name: 'max_party_size', type: 'number', label: t('Maximum Party Size') },
        { name: 'reservation_notes', type: 'textarea', label: t('Reservation Notes') }
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
        { name: 'reservation_button_text', type: 'text', label: t('Reservation Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') },
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
    { name: 'Rustic Bistro', primary: '#8B4513', secondary: '#A0522D', accent: '#FFD700', background: '#FFF8E1', text: '#3E2723' },
    { name: 'Modern Eatery', primary: '#D32F2F', secondary: '#F44336', accent: '#FFCDD2', background: '#FFFFFF', text: '#212121' },
    { name: 'Seafood Blue', primary: '#0277BD', secondary: '#039BE5', accent: '#B3E5FC', background: '#E1F5FE', text: '#01579B' },
    { name: 'Italian Villa', primary: '#2E7D32', secondary: '#43A047', accent: '#C8E6C9', background: '#F1F8E9', text: '#1B5E20' },
    { name: 'Asian Fusion', primary: '#BF360C', secondary: '#E64A19', accent: '#FFCCBC', background: '#FBE9E7', text: '#3E2723' },
    { name: 'Elegant Dining', primary: '#4E342E', secondary: '#6D4C41', accent: '#D7CCC8', background: '#EFEBE9', text: '#3E2723' },
    { name: 'Cafe Cozy', primary: '#795548', secondary: '#8D6E63', accent: '#D7CCC8', background: '#EFEBE9', text: '#3E2723' },
    { name: 'Vibrant Mexican', primary: '#E65100', secondary: '#F57C00', accent: '#FFE0B2', background: '#FFF3E0', text: '#3E2723' },
    { name: 'Mediterranean', primary: '#1565C0', secondary: '#1976D2', accent: '#BBDEFB', background: '#E3F2FD', text: '#0D47A1' },
    { name: 'Steakhouse', primary: '#5D4037', secondary: '#6D4C41', accent: '#D7CCC8', background: '#EFEBE9', text: '#3E2723' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '400,500,600,700' },
    { name: 'Lora', value: 'Lora, serif', weight: '400,500,600,700' },
    { name: 'Oswald', value: 'Oswald, sans-serif', weight: '400,500,600,700' },
    { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#8B4513',
    secondary: '#A0522D',
    accent: '#FFD700',
    background: '#FFF8E1',
    text: '#3E2723',
    cardBg: '#FFFFFF',
    borderColor: '#D7CCC8',
    buttonBg: '#8B4513',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Playfair Display, serif',
  themeStyle: {
    layout: 'elegant-cards',
    headerStyle: 'cover-image',
    cardStyle: 'bordered',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable',
    shadows: 'soft',
    animations: 'fade',
    backgroundPattern: 'subtle-texture'
  },
  defaultData: {
    header: {
      name: 'La Bella Cucina',
      tagline: 'Authentic Italian Cuisine',
      cuisine_type: 'Italian',
      service_info: 'Open Daily • Dine-in • Takeout • Delivery',
      logo: '',
      cover_image: ''
    },
    about: {
      description: 'La Bella Cucina brings the authentic flavors of Italy to your table. Our recipes have been passed down through generations, using only the freshest ingredients and traditional cooking methods.',
      year_established: '2010',
      chef_name: 'Marco Rossi',
      ambiance: 'fine_dining'
    },
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'info@labellacucina.com',
      website: 'https://www.labellacucina.com',
      address: '123 Pasta Lane\nItalian Quarter\nNew York, NY 10001'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '17:00', close_time: '22:00', is_closed: false },
        { day: 'tuesday', open_time: '17:00', close_time: '22:00', is_closed: false },
        { day: 'wednesday', open_time: '17:00', close_time: '22:00', is_closed: false },
        { day: 'thursday', open_time: '17:00', close_time: '22:00', is_closed: false },
        { day: 'friday', open_time: '17:00', close_time: '23:00', is_closed: false },
        { day: 'saturday', open_time: '12:00', close_time: '23:00', is_closed: false },
        { day: 'sunday', open_time: '12:00', close_time: '21:00', is_closed: false }
      ]
    },
    menu_highlights: {
      menu_items: [
        { name: 'Bruschetta al Pomodoro', description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and extra virgin olive oil', price: '$12', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=900&q=80', category: 'appetizer' },
        { name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with pancetta, eggs, Pecorino Romano, and black pepper', price: '$22', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80', category: 'main' },
        { name: 'Tiramisu', description: 'Traditional Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream', price: '$10', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80', category: 'dessert' }
      ]
    },
    services: {
      service_list: [
        { title: 'Dine-In Service', description: 'Full-service dining experience with table service', price: '' },
        { title: 'Takeout & Delivery', description: 'Order online or by phone for pickup or delivery', price: '' },
        { title: 'Private Events', description: 'Host your special occasions in our private dining room', price: 'Starting at $500' },
        { title: 'Catering', description: 'Bring our authentic Italian cuisine to your event', price: 'Custom pricing' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Chef Marco\'s Signature Carbonara', description: 'Watch our head chef prepare our famous spaghetti carbonara from scratch', video_type: 'chef_cooking', embed_url: '<iframe width="100%" height="315" src="https://www.youtube.com/embed/3AAdKl1UYZs" title="Chef Marco\'s Signature Carbonara" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>', thumbnail: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=900&q=80', duration: '6:30' },
        { title: 'Restaurant Interior & Dining Experience', description: 'Explore our beautiful restaurant interior, elegant seating, and warm dining atmosphere.', video_type: 'restaurant_tour', embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/AkrXQIa5jKE?si=SBpbBlFIRuJxUoLf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>', thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80', duration: '2:30' },
        { title: 'Customer Reviews - What They Say', description: 'Hear from our satisfied customers about their dining experience', video_type: 'customer_testimonial', embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/F6KyffNP-7Q?si=z_KnC5XwIq6C2e8D" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>', thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80', duration: '4:20' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/labellacucina',
      channel_name: 'La Bella Cucina',
      subscriber_count: '8.2K',
      featured_playlist: 'https://youtube.com/playlist?list=PLcookingvideos',
      latest_video_embed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/8Vj7KVLNNGE?si=YPC3ilk8kuxbNoiy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      channel_description: 'Authentic Italian cooking videos, restaurant tours, and culinary stories from La Bella Cucina. Subscribe for weekly cooking inspiration!'
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', caption: 'Our elegant dining room' },
        { image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80', caption: 'Chef\'s special pasta dish' },
        { image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80', caption: 'Outdoor patio seating' }
      ]
    },
    testimonials: {
      reviews: [
        { customer_name: 'John Smith', review: 'The best Italian food I\'ve had outside of Italy! The pasta is made fresh daily and the service is impeccable.', rating: '5', date: 'June 2023' },
        { customer_name: 'Maria Johnson', review: 'Authentic flavors that transported me back to my grandmother\'s kitchen in Tuscany. Highly recommended!', rating: '5', date: 'August 2023' }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/labellacucina', username: 'labellacucina' },
        { platform: 'instagram', url: 'https://instagram.com/labellacucina', username: '@labellacucina' },
        { platform: 'yelp', url: 'https://yelp.com/biz/labellacucina', username: 'La Bella Cucina' },
        { platform: 'youtube', url: 'https://youtube.com/labellacucina', username: 'La Bella Cucina' }
      ]
    },
    appointments: {
      reservation_url: 'https://resy.com/labellacucina',
      reservation_phone: '+1 (555) 123-4567',
      min_party_size: '1',
      max_party_size: '12',
      reservation_notes: 'Reservations recommended for Friday and Saturday evenings. Special accommodations available for large parties with advance notice.'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Pasta%20Lane%2C%20New%20York%2C%20NY%2010001&z=14&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Pasta+Lane,+New+York,+NY+10001'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/opentable/id296581815',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.opentable',
      app_description: 'Download our app to make reservations, view our menu, and earn rewards with our loyalty program.'
    },
    contact_form: {
      form_title: 'Contact Us',
      form_description: 'Have questions or special requests? Send us a message and we\'ll get back to you as soon as possible.'
    },
    thank_you: {
      message: 'Thank you for your interest in La Bella Cucina. We look forward to serving you soon!'
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      reservation_button_text: 'Make a Reservation',
      save_contact_button_text: 'Save Contact'
    },
    seo: {
      meta_title: 'La Bella Cucina | Authentic Italian Cuisine in New York',
      meta_description: 'Discover handcrafted Italian dishes, elegant dining, and warm hospitality at La Bella Cucina. Reserve your table today.',
      keywords: 'Italian restaurant, pasta, fine dining, New York restaurant, authentic Italian cuisine, reservations',
      og_image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Chef\'s Special</h4><p>Try our signature dishes made with the finest ingredients and traditional recipes.</p></div>',
      section_title: 'Chef\'s Special',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Restaurant',
      qr_description: 'Scan this QR code to access our menu, make reservations, and get our contact information.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 La Bella Cucina. All rights reserved.'
    }
  }
};
