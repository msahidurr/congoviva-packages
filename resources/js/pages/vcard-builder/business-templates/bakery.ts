import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const bakeryTemplate = {
  name: t('Bakery'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Bakery Name') },
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
        { name: 'specialties', type: 'select', label: t('Specialties'), options: [
          { value: 'artisan_bread', label: t('Artisan Bread') },
          { value: 'pastries', label: t('Pastries & Desserts') },
          { value: 'cakes', label: t('Custom Cakes') },
          { value: 'vegan', label: t('Vegan & Gluten-Free') },
          { value: 'traditional', label: t('Traditional Recipes') }
        ]}
      ],
      required: false
    },
    {
      key: 'featured_products',
      name: t('Featured Products'),
      fields: [
        {
          name: 'categories',
          type: 'repeater',
          label: t('Product Categories'),
          fields: [
            { name: 'value', type: 'text', label: t('Category ID') },
            { name: 'label', type: 'text', label: t('Category Name') }
          ]
        },
        {
          name: 'products',
          type: 'repeater',
          label: t('Products'),
          fields: [
            { name: 'name', type: 'text', label: t('Product Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Product Image') },
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
      name: t('Bakery Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Baking Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'baking_process', label: t('Baking Process') },
              { value: 'recipe_tutorial', label: t('Recipe Tutorial') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'product_showcase', label: t('Product Showcase') },
              { value: 'customer_stories', label: t('Customer Stories') },
              { value: 'seasonal_specials', label: t('Seasonal Specials') }
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
      key: 'daily_specials',
      name: t('Daily Specials'),
      fields: [
        {
          name: 'specials',
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
          label: t('Bakery Hours'),
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
      name: t('Order & Pickup'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Online Order URL') },
        { name: 'reservation_text', type: 'text', label: t('Order Button Text') },
        { name: 'min_notice_hours', type: 'number', label: t('Minimum Notice Hours') },
        { name: 'special_orders_info', type: 'textarea', label: t('Special Orders Information') }
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
      key: 'catering',
      name: t('Catering Services'),
      fields: [
        { name: 'catering_title', type: 'text', label: t('Catering Title') },
        { name: 'catering_description', type: 'textarea', label: t('Catering Description') },
        { name: 'min_order_amount', type: 'text', label: t('Minimum Order Amount') },
        { name: 'lead_time', type: 'text', label: t('Required Lead Time') },
        {
          name: 'catering_options',
          type: 'repeater',
          label: t('Catering Options'),
          fields: [
            { name: 'option_name', type: 'text', label: t('Option Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'serves', type: 'text', label: t('Serves') },
            { name: 'price', type: 'text', label: t('Price') }
          ]
        }
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
        { name: 'order_button_text', type: 'text', label: t('Order Button Text') },
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
    { name: 'Warm Bread', primary: '#D35400', secondary: '#E67E22', accent: '#FFF3E0', background: '#FFFFFF', text: '#3A3A3A' },
    { name: 'Sweet Pastry', primary: '#8E44AD', secondary: '#9B59B6', accent: '#F3E5F5', background: '#FFFFFF', text: '#2C3E50' },
    { name: 'Rustic Sourdough', primary: '#795548', secondary: '#A1887F', accent: '#EFEBE9', background: '#FFFBF5', text: '#3E2723' },
    { name: 'Fresh Mint', primary: '#009688', secondary: '#4DB6AC', accent: '#E0F2F1', background: '#FFFFFF', text: '#263238' },
    { name: 'Berry Tart', primary: '#C2185B', secondary: '#E91E63', accent: '#FCE4EC', background: '#FFFFFF', text: '#424242' },
    { name: 'Golden Crust', primary: '#F57F17', secondary: '#FFB300', accent: '#FFF8E1', background: '#FFFFFF', text: '#3E2723' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Lora', value: 'Lora, serif', weight: '400,500,600,700' },
    { name: 'Quicksand', value: 'Quicksand, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Josefin Sans', value: 'Josefin Sans, sans-serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#D35400',
    secondary: '#E67E22',
    accent: '#FFF3E0',
    background: '#FFFFFF',
    text: '#3A3A3A',
    cardBg: '#FFFBF5',
    borderColor: '#F5E0C8',
    buttonText: '#FFFFFF',
    highlightColor: '#FFB74D'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'bakery-layout',
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
      name: 'Sweet Crumb Bakery',
      tagline: 'Artisanal breads, pastries, and cakes made fresh daily',
      logo: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80',
      cover_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80'
    },
    about: {
      description: 'Founded in 2018, Sweet Crumb Bakery is a family-owned artisanal bakery specializing in handcrafted breads, pastries, and custom cakes. We use only the finest ingredients, traditional techniques, and a lot of love to create delicious baked goods that bring joy to our community.',
      year_established: '2018',
      specialties: 'artisan_bread'
    },
    featured_products: {
      categories: [
        { value: 'bread', label: 'Bread' },
        { value: 'pastry', label: 'Pastries' },
        { value: 'cake', label: 'Cakes' },
        { value: 'cookie', label: 'Cookies' },
        { value: 'seasonal', label: 'Seasonal' },
        { value: 'specialty', label: 'Specialty' }
      ],
      products: [
        { name: 'Sourdough Bread', description: 'Our signature naturally leavened sourdough with a crisp crust and tender, tangy interior', price: '$7.50', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', category: 'bread', dietary_info: 'vegetarian' },
        { name: 'Chocolate Croissant', description: 'Buttery, flaky croissant filled with rich dark chocolate', price: '$4.25', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', category: 'pastry', dietary_info: 'vegetarian' },
        { name: 'Cinnamon Rolls', description: 'Soft, fluffy rolls with cinnamon-sugar filling and cream cheese frosting', price: '$4.50', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=80', category: 'pastry', dietary_info: 'vegetarian' }
      ]
    },
    daily_specials: {
      specials: [
        { day: 'monday', special_name: 'Muffin Monday', description: 'Buy 3 muffins, get 1 free', price: 'Varies' },
        { day: 'wednesday', special_name: 'Whole Grain Wednesday', description: 'All whole grain breads 15% off', price: 'Varies' },
        { day: 'saturday', special_name: 'Weekend Brunch Box', description: 'Assortment of 6 pastries perfect for weekend brunch', price: '$24.95' }
      ]
    },
    contact: {
      email: 'hello@sweetcrumbbakery.com',
      phone: '(555) 123-4567',
      website: 'https://www.sweetcrumbbakery.com',
      address: '123 Main Street, Portland, OR 97201'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/sweetcrumbbakery', username: '@sweetcrumbbakery' },
        { platform: 'facebook', url: 'https://facebook.com/sweetcrumbbakery', username: 'Sweet Crumb Bakery' },
        { platform: 'pinterest', url: 'https://pinterest.com/sweetcrumbbakery', username: 'Sweet Crumb Bakery' },
        { platform: 'youtube', url: 'https://youtube.com/sweetcrumbbakery', username: 'Sweet Crumb Bakery' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Pastry Recipe Feature', description: 'A recipe-focused bakery video featuring pastry preparation and finishing details.', video_type: 'recipe_tutorial', embed_url: 'https://www.youtube.com/watch?v=2CWx3ueGgLg', thumbnail: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', duration: '18:30' },
        { title: 'Behind the Scenes at Our Bakery', description: 'A behind-the-scenes bakery video highlighting the kitchen workflow and daily preparation process.', video_type: 'behind_scenes', embed_url: 'https://www.youtube.com/watch?v=AkrXQIa5jKE', thumbnail: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80', duration: '8:15' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/sweetcrumbbakery',
      channel_name: 'Sweet Crumb Bakery',
      subscriber_count: '28.5K',
      featured_playlist: 'https://www.youtube.com/playlist?list=PLbakingbasics',
      latest_video_embed: 'https://www.youtube.com/watch?v=2CWx3ueGgLg',
      channel_description: 'Join us in our kitchen for baking tutorials, behind-the-scenes content, and seasonal recipe inspiration from our artisan bakery.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '07:00', close_time: '19:00', is_closed: false },
        { day: 'saturday', open_time: '07:00', close_time: '19:00', is_closed: false },
        { day: 'sunday', open_time: '08:00', close_time: '16:00', is_closed: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', caption: 'Our fresh bread selection baked daily' },
        { image: 'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80', caption: 'Handcrafted pastries and desserts' },
        { image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80', caption: 'Custom celebration cakes for any occasion' },
        { image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=900&q=80', caption: 'Our cozy bakery interior' }
      ]
    },
    testimonials: {
      reviews: [
        { customer_name: 'Sarah M.', review: 'The best sourdough bread in town! I\'m completely addicted to their chocolate croissants too.', rating: '5' },
        { customer_name: 'Michael P.', review: 'Sweet Crumb made the most beautiful and delicious cake for my daughter\'s wedding. Highly recommend their custom cake service!', rating: '5' },
        { customer_name: 'Jessica T.', review: 'As someone with gluten sensitivity, I appreciate that they offer such delicious gluten-free options. The GF banana bread is amazing!', rating: '4' }
      ]
    },
    appointments: {
      booking_url: 'https://orders.sweetcrumbbakery.com',
      reservation_text: 'Order Online',
      min_notice_hours: '24',
      special_orders_info: 'Custom cake orders require at least 72 hours notice. For large orders or special dietary requests, please contact us directly.'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Main%20Street%2C%20Portland%2C%20OR%2097201&z=14&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Main+Street,+Portland,+OR+97201'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/toogoodtogo-end-food-waste/id1060683933',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.app.tgtg',
      app_description: 'Download our app to place orders for pickup, earn loyalty points, and receive exclusive offers and promotions.'
    },
    contact_form: {
      form_title: 'Contact Us',
      form_description: 'Questions about our products, catering services, or special orders? Send us a message and we\'ll get back to you as soon as possible.'
    },
    catering: {
      catering_title: 'Catering Services',
      catering_description: 'We offer catering for corporate events, meetings, parties, and special occasions. From breakfast pastry platters to dessert tables, we can create the perfect spread for your event.',
      min_order_amount: '$100',
      lead_time: '48 hours',
      catering_options: [
        { option_name: 'Breakfast Pastry Platter', description: 'Assortment of croissants, muffins, and scones', serves: '10-12 people', price: '$65' },
        { option_name: 'Cookie & Brownie Platter', description: 'Selection of our most popular cookies and brownies', serves: '15-20 people', price: '$55' },
        { option_name: 'Artisan Bread Basket', description: 'Variety of freshly baked breads with butter and spreads', serves: '10-15 people', price: '$45' }
      ]
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      order_button_text: 'Order Online',
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for your interest in Sweet Crumb Bakery! We appreciate your support and look forward to serving you soon.'
    },    seo: {
      meta_title: 'Sweet Crumb Bakery | Artisan Breads, Pastries, and Custom Cakes',
      meta_description: 'Fresh artisan breads, pastries, desserts, and custom cakes baked daily at Sweet Crumb Bakery.',
      keywords: 'bakery, artisan bread, pastries, custom cakes, sourdough, Portland bakery',
      og_image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="bakery-special"><h4>Fresh Daily</h4><p>All our breads and pastries are baked fresh every morning using traditional techniques and the finest ingredients.</p></div>',
      section_title: 'Our Promise',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Bakery',
      qr_description: 'Scan to save our contact info and share our delicious baked goods with friends.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Fresh baked daily with love. Custom orders available with advance notice. Follow us for daily specials.',
      footer_links: [
        { title: 'Custom Orders', url: '#' },
        { title: 'Catering Menu', url: '#' },
        { title: 'Allergen Info', url: '#' },
        { title: 'Baking Classes', url: '#' }
      ]
    },
    copyright: {
      text: '© 2025 Sweet Crumb Bakery. All rights reserved.'
    }
  }
};
