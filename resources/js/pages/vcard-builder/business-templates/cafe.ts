import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const cafeTemplate = {
  name: t('Cafe'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Cafe Name') },
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
        { name: 'atmosphere', type: 'select', label: t('Atmosphere'), options: [
          { value: 'cozy', label: t('Cozy & Intimate') },
          { value: 'modern', label: t('Modern & Sleek') },
          { value: 'rustic', label: t('Rustic & Warm') },
          { value: 'vintage', label: t('Vintage & Retro') },
          { value: 'artsy', label: t('Artistic & Creative') }
        ]}
      ],
      required: false
    },
    {
      key: 'menu_highlights',
      name: t('Menu Highlights'),
      fields: [
        {
          name: 'categories',
          type: 'repeater',
          label: t('Menu Categories'),
          fields: [
            { name: 'value', type: 'text', label: t('Category ID') },
            { name: 'label', type: 'text', label: t('Category Name') }
          ]
        },
        {
          name: 'items',
          type: 'repeater',
          label: t('Menu Items'),
          fields: [
            { name: 'name', type: 'text', label: t('Item Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Item Image') },
            { name: 'category', type: 'select', label: t('Category'), options: 'dynamic_categories' },
            { name: 'dietary_info', type: 'select', label: t('Dietary Info'), options: [
              { value: 'vegetarian', label: t('Vegetarian') },
              { value: 'vegan', label: t('Vegan') },
              { value: 'gluten_free', label: t('Gluten-Free') },
              { value: 'dairy_free', label: t('Dairy-Free') },
              { value: 'nut_free', label: t('Nut-Free') },
              { value: 'none', label: t('None') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Cafe Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Cafe Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'coffee_brewing', label: t('Coffee Brewing') },
              { value: 'latte_art', label: t('Latte Art') },
              { value: 'cafe_atmosphere', label: t('Cafe Atmosphere') },
              { value: 'food_preparation', label: t('Food Preparation') },
              { value: 'customer_stories', label: t('Customer Stories') },
              { value: 'behind_scenes', label: t('Behind the Scenes') }
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
      key: 'specials',
      name: t('Daily Specials'),
      fields: [
        {
          name: 'daily_specials',
          type: 'repeater',
          label: t('Daily Specials'),
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
            { name: 'special_name', type: 'text', label: t('Special Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') }
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
          label: t('Cafe Hours'),
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
          label: t('Customer Reviews'),
          fields: [
            { name: 'customer_name', type: 'text', label: t('Customer Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Reservations'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Reservation URL') },
        { name: 'reservation_text', type: 'text', label: t('Reservation Button Text') },
        { name: 'min_party_size', type: 'number', label: t('Minimum Party Size') },
        { name: 'max_party_size', type: 'number', label: t('Maximum Party Size') }
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
        { name: 'appointment_button_text', type: 'text', label: t('Reservation Button Text') },
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
    { name: 'Coffee Brown', primary: '#6F4E37', secondary: '#A67C52', accent: '#F5EEE6', background: '#FFFFFF', text: '#3A3A3A' },
    { name: 'Espresso Dark', primary: '#362417', secondary: '#5D4037', accent: '#D7CCC8', background: '#FFFFFF', text: '#212121' },
    { name: 'Latte Cream', primary: '#C9A66B', secondary: '#D4B483', accent: '#FFF8E1', background: '#FFFBF5', text: '#5D4037' },
    { name: 'Mint Mocha', primary: '#00796B', secondary: '#26A69A', accent: '#E0F2F1', background: '#FFFFFF', text: '#263238' },
    { name: 'Berry Blend', primary: '#AD1457', secondary: '#D81B60', accent: '#FCE4EC', background: '#FFFFFF', text: '#424242' },
    { name: 'Caramel Gold', primary: '#E65100', secondary: '#F57C00', accent: '#FFF3E0', background: '#FFFFFF', text: '#3E2723' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Josefin Sans', value: 'Josefin Sans, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Quicksand', value: 'Quicksand, sans-serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#6F4E37',
    secondary: '#A67C52',
    accent: '#F5EEE6',
    background: '#FFFFFF',
    text: '#3A3A3A',
    cardBg: '#FFFBF5',
    borderColor: '#E8E0D8',
    buttonText: '#FFFFFF',
    highlightColor: '#C9A66B'
  },
  defaultFont: 'Poppins, sans-serif',
  themeStyle: {
    layout: 'cafe-layout',
    headerStyle: 'banner',
    cardStyle: 'rounded',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable',
    shadows: 'soft',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'Brew & Bean Cafe',
      tagline: 'Artisanal coffee and homemade treats in a cozy atmosphere',
      logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
      cover_image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80'
    },
    about: {
      description: 'Established in 2015, Brew & Bean is a neighborhood cafe committed to serving exceptional coffee sourced from sustainable farms around the world. Our pastries and light meals are made fresh daily using locally-sourced ingredients.',
      year_established: '2015',
      atmosphere: 'cozy'
    },
    menu_highlights: {
      categories: [
        { value: 'coffee', label: 'Coffee' },
        { value: 'tea', label: 'Tea' },
        { value: 'pastry', label: 'Pastries' },
        { value: 'breakfast', label: 'Breakfast' },
        { value: 'lunch', label: 'Lunch' },
        { value: 'dessert', label: 'Desserts' },
        { value: 'specialty', label: 'Specialty' }
      ],
      items: [
        { name: 'House Blend Coffee', description: 'Our signature medium roast with notes of chocolate and caramel', price: '$3.50', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', category: 'coffee', dietary_info: 'none' },
        { name: 'Avocado Toast', description: 'Sourdough bread topped with smashed avocado, cherry tomatoes, and microgreens', price: '$8.95', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=900&q=80', category: 'breakfast', dietary_info: 'vegetarian' },
        { name: 'Blueberry Scone', description: 'Buttery scone filled with fresh blueberries and topped with lemon glaze', price: '$4.25', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', category: 'pastry', dietary_info: 'vegetarian' },
        { name: 'Chai Latte', description: 'Black tea infused with cinnamon, cardamom, and other warming spices', price: '$4.75', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80', category: 'tea', dietary_info: 'none' }
      ]
    },
    specials: {
      daily_specials: [
        { day: 'monday', special_name: 'Muffin Monday', description: 'Buy any coffee, get a muffin half price', price: 'Varies' },
        { day: 'wednesday', special_name: 'Waffle Wednesday', description: 'Belgian waffles with your choice of toppings', price: '$7.95' },
        { day: 'friday', special_name: 'Latte Happy Hour', description: '20% off all specialty lattes from 3-5pm', price: 'Varies' }
      ]
    },
    contact: {
      email: 'hello@brewandbean.com',
      phone: '(555) 123-4567',
      website: 'https://www.brewandbean.com',
      address: '123 Coffee Lane, Portland, OR 97201'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/brewandbean', username: '@brewandbean' },
        { platform: 'facebook', url: 'https://facebook.com/brewandbean', username: 'Brew & Bean Cafe' },
        { platform: 'yelp', url: 'https://yelp.com/biz/brew-and-bean', username: 'Brew & Bean Cafe' },
        { platform: 'youtube', url: 'https://youtube.com/brewandbean', username: 'Brew & Bean Cafe' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Perfect Pour-Over Coffee Tutorial', description: 'Learn how our baristas create the perfect pour-over coffee using our house blend', video_type: 'coffee_brewing', embed_url: 'https://www.youtube.com/watch?v=2CWx3ueGgLg', thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', duration: '6:30' },
        { title: 'Latte Art Masterclass', description: 'Watch our head barista create beautiful latte art designs', video_type: 'latte_art', embed_url: 'https://www.youtube.com/watch?v=qcsVk8DZFms', thumbnail: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', duration: '4:45' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/brewandbean',
      channel_name: 'Brew & Bean Cafe',
      subscriber_count: '8.2K',
      featured_playlist: 'https://youtube.com/playlist?list=PLcoffeetutorials',
      latest_video_embed: 'https://www.youtube.com/watch?v=2CWx3ueGgLg',
      channel_description: 'Coffee tutorials, cafe culture, and behind-the-scenes content from your favorite neighborhood coffee shop.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '07:00', close_time: '19:00', is_closed: false },
        { day: 'tuesday', open_time: '07:00', close_time: '19:00', is_closed: false },
        { day: 'wednesday', open_time: '07:00', close_time: '19:00', is_closed: false },
        { day: 'thursday', open_time: '07:00', close_time: '19:00', is_closed: false },
        { day: 'friday', open_time: '07:00', close_time: '21:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '21:00', is_closed: false },
        { day: 'sunday', open_time: '08:00', close_time: '17:00', is_closed: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80', caption: 'Our cozy interior with plenty of seating' },
        { image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', caption: 'Barista preparing our signature latte art' },
        { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', caption: 'Fresh pastries baked daily' },
        { image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80', caption: 'Outdoor patio seating' }
      ]
    },
    testimonials: {
      reviews: [
        { customer_name: 'Emily R.', review: 'My favorite spot for morning coffee! The atmosphere is so inviting and the staff always remembers my order.', rating: '5' },
        { customer_name: 'Michael T.', review: 'Great place to work remotely. Fast wifi, plenty of outlets, and the coffee keeps me going all day.', rating: '5' },
        { customer_name: 'Sarah L.', review: 'Their avocado toast and chai latte combo is my weekend treat. Never disappoints!', rating: '4' }
      ]
    },
    appointments: {
      booking_url: 'https://reservations.brewandbean.com',
      reservation_text: 'Reserve a Table',
      min_party_size: '2',
      max_party_size: '8'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Coffee%20Lane%2C%20Portland%2C%20OR%2097201&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Coffee+Lane+Portland+OR+97201'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/starbucks/id331177714',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.starbucks.mobilecard',
      app_description: 'Download our app to order ahead, collect loyalty points, and receive exclusive offers.'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Questions, comments, or catering inquiries? Send us a message and we will get back to you soon.'
    },
    custom_html: {
      html_content: '<h3>Welcome to Our Cafe</h3><p>Experience the perfect blend of artisanal coffee and cozy atmosphere. Our skilled baristas craft each cup with passion and precision.</p>',
      section_title: 'Special Features',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Cafe',
      qr_description: 'Scan to share our cafe with friends and family'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    thank_you: {
      message: 'Thank you for your message! We will respond within 24 hours. In the meantime, we hope to see you at the cafe soon.'
    },
    seo: {
      meta_title: 'Brew & Bean Cafe | Artisanal Coffee and Homemade Treats',
      meta_description: 'Neighborhood cafe serving specialty coffee, fresh pastries, breakfast favorites, and a cozy all-day atmosphere.',
      keywords: 'cafe, coffee shop, artisan coffee, pastries, breakfast cafe, Portland cafe',
      og_image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Reserve Table',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Visit us for the best coffee experience in town. Follow us on social media for daily specials and updates.',
      footer_links: [
        { title: 'Privacy Policy', url: '#' },
        { title: 'Terms of Service', url: '#' },
        { title: 'Contact Us', url: '#' }
      ]
    },
    copyright: {
      text: '© 2025 Brew & Bean Cafe. All rights reserved.'
    }
  }
};
