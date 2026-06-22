import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const foodDeliveryTemplate = {
  name: t('Food Delivery & Catering'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Business Name') },
        { name: 'title', type: 'text', label: t('Service Type') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'profile_image', type: 'file', label: t('Logo') },
        { name: 'badge_1', type: 'text', label: t('Badge 1 Text') },
        { name: 'badge_2', type: 'text', label: t('Badge 2 Text') }
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
        { name: 'location', type: 'text', label: t('Service Area') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Our Service') },
        { name: 'specialties', type: 'tags', label: t('Cuisine Types') },
        { name: 'experience', type: 'number', label: t('Years in Business') }
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
          label: t('Food Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Starting Price') },
            { name: 'min_order', type: 'text', label: t('Minimum Order') }
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
          name: 'dishes',
          type: 'repeater',
          label: t('Popular Dishes'),
          fields: [
            { name: 'name', type: 'text', label: t('Dish Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'category', type: 'text', label: t('Category') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Food Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Food Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'food_preparation', label: t('Food Preparation') },
              { value: 'menu_showcase', label: t('Menu Showcase') },
              { value: 'behind_kitchen', label: t('Behind the Kitchen') },
              { value: 'delivery_process', label: t('Delivery Process') },
              { value: 'customer_review', label: t('Customer Review') },
              { value: 'chef_special', label: t('Chef Special') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'cuisine_type', type: 'text', label: t('Cuisine Type') }
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
      key: 'delivery_info',
      name: t('Delivery Information'),
      fields: [
        { name: 'delivery_fee', type: 'text', label: t('Delivery Fee') },
        { name: 'free_delivery_min', type: 'text', label: t('Free Delivery Minimum') },
        { name: 'delivery_time', type: 'text', label: t('Delivery Time') },
        { name: 'delivery_radius', type: 'text', label: t('Delivery Radius') }
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
            { name: 'url', type: 'url', label: t('Profile URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'business_hours',
      name: t('Operating Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Service Hours'),
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
      name: t('Order & Catering'),
      fields: [
        { name: 'order_url', type: 'url', label: t('Online Ordering URL') },
        { name: 'catering_phone', type: 'tel', label: t('Catering Phone') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Customer Reviews'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Customer Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Customer Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'order_type', type: 'text', label: t('Order Type') }
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
        { name: 'appointment_button_text', type: 'text', label: t('Order Button Text') },
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
  ],
  colorPresets: [
    { name: 'Spicy Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FFFBFA', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Fresh Green', primary: '#059669', secondary: '#10b77f', accent: '#D1FAE5', background: '#F0FDF4', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Golden Yellow', primary: '#D97706', secondary: '#F59E0B', accent: '#FEF3C7', background: '#FFFBEB', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Pizza Orange', primary: '#EA580C', secondary: '#FB923C', accent: '#FED7AA', background: '#FFF7ED', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Berry Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#E0E7FF', background: '#F8FAFC', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Chocolate Brown', primary: '#92400E', secondary: '#B45309', accent: '#FDE68A', background: '#FFFBEB', text: '#1F2937', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,700' }
  ],
  defaultColors: {
    primary: '#DC2626',
    secondary: '#EF4444',
    accent: '#FEE2E2',
    background: '#FFFBFA',
    text: '#1F2937',
    cardBg: '#FFFFFF',
    borderColor: '#FCA5A5'
  },
  defaultFont: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'food-focused',
    headerStyle: 'appetizing',
    cardStyle: 'warm',
    buttonStyle: 'rounded',
    iconStyle: 'filled',
    spacing: 'comfortable',
    shadows: 'warm',
    animations: 'smooth'
  },
  defaultData: {
    header: {
      name: 'Tasty Bites Delivery',
      title: 'Fresh Food Delivered Fast',
      tagline: 'Delicious meals delivered to your doorstep in 30 minutes or less',
      profile_image: '',
      badge_1: 'Fast Delivery',
      badge_2: 'Fresh Made'
    },
    contact: {
      email: 'orders@tastybites.com',
      phone: '+1 (555) FOOD-NOW',
      website: 'https://tastybites.com',
      location: 'Downtown & Suburbs'
    },
    about: {
      description: 'We specialize in fresh, high-quality food delivery and catering services. From quick lunch deliveries to large event catering, we bring delicious food right to you.',
      specialties: 'Italian, Asian, American, Mexican, Mediterranean, Healthy Options',
      experience: '5'
    },
    action_buttons: {
      contact_button_text: 'Order Delicious Food',
      appointment_button_text: 'Book Catering',
      save_contact_button_text: 'Save Contact'
    },
    services: {
      service_list: [
        { title: 'Food Delivery', description: 'Hot, fresh meals delivered to your location', price: 'From $12.99', min_order: '$25' },
        { title: 'Corporate Catering', description: 'Office lunch and meeting catering', price: 'From $8/person', min_order: '10 people' },
        { title: 'Event Catering', description: 'Full-service catering for special events', price: 'From $15/person', min_order: '20 people' },
        { title: 'Meal Prep', description: 'Weekly healthy meal preparation service', price: 'From $45/week', min_order: '5 meals' }
      ]
    },
    menu_highlights: {
      dishes: [
        { name: 'Signature Burger', description: 'Juicy beef patty with special sauce and fresh toppings', price: '$14.99', category: 'American' },
        { name: 'Chicken Pad Thai', description: 'Authentic Thai noodles with chicken and peanut sauce', price: '$13.99', category: 'Asian' },
        { name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, and tomato sauce on crispy crust', price: '$16.99', category: 'Italian' },
        { name: 'Caesar Salad Bowl', description: 'Crisp romaine, parmesan, croutons with grilled chicken', price: '$11.99', category: 'Healthy' }
      ]
    },
    delivery_info: {
      delivery_fee: '$3.99',
      free_delivery_min: '$35',
      delivery_time: '25-35 minutes',
      delivery_radius: '5 miles'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/tastybites' },
        { platform: 'facebook', url: 'https://facebook.com/tastybites' },
        { platform: 'yelp', url: 'https://yelp.com/tastybites' },
        { platform: 'youtube', url: 'https://youtube.com/tastybites' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Signature Pasta Cooking Feature', description: 'Watch a chef-style pasta preparation video that fits our fresh-made kitchen content.', video_type: 'food_preparation', embed_url: 'https://www.youtube.com/watch?v=3AAdKl1UYZs', thumbnail: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80', duration: '6:30', cuisine_type: 'Italian' },
        { title: 'Behind the Scenes in Our Kitchen', description: 'A kitchen-focused video showing the atmosphere and preparation flow behind the food service.', video_type: 'behind_kitchen', embed_url: 'https://www.youtube.com/watch?v=AkrXQIa5jKE', thumbnail: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80', duration: '8:15', cuisine_type: 'General' },
        { title: 'Customer Review Feature', description: 'A customer-focused food service review video that works for delivery and catering style presentation.', video_type: 'customer_review', embed_url: 'https://www.youtube.com/watch?v=F6KyffNP-7Q', thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80', duration: '4:20', cuisine_type: 'General' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/tastybites',
      channel_name: 'Tasty Bites Delivery',
      subscriber_count: '21.6K',
      featured_playlist: 'https://youtube.com/playlist?list=PLcookingvideos',
      latest_video_embed: 'https://www.youtube.com/watch?v=8Vj7KVLNNGE',
      channel_description: 'Delicious food preparation videos, cooking tips, and behind-the-scenes content from your favorite food delivery service.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '11:00', close_time: '22:00', is_closed: false },
        { day: 'tuesday', open_time: '11:00', close_time: '22:00', is_closed: false },
        { day: 'wednesday', open_time: '11:00', close_time: '22:00', is_closed: false },
        { day: 'thursday', open_time: '11:00', close_time: '22:00', is_closed: false },
        { day: 'friday', open_time: '11:00', close_time: '23:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '23:00', is_closed: false },
        { day: 'sunday', open_time: '12:00', close_time: '21:00', is_closed: false }
      ]
    },
    appointments: {
      order_url: 'https://tastybites.com/order',
      catering_phone: '+1 (555) CATER-ME'
    },
    testimonials: {
      reviews: [
        { client_name: 'Jennifer Lee', review: 'Always fresh and delivered on time! The pad thai is amazing and arrives hot every time.', rating: '5', order_type: 'Delivery' },
        { client_name: 'Mark Thompson', review: 'Great catering service for our office meetings. Professional setup and delicious food.', rating: '5', order_type: 'Corporate Catering' },
        { client_name: 'Sarah Johnson', review: 'Love the meal prep service! Healthy, tasty meals that save me so much time during the week.', rating: '5', order_type: 'Meal Prep' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Chelsea%20Market%20New%20York%20NY&z=15&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Chelsea+Market+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/uber-eats-food-delivery/id1058959277',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.ubercab.eats'
    },
    contact_form: {
      form_title: 'Get a Catering Quote',
      form_description: 'Planning an event? Contact us for a custom catering quote tailored to your needs.'
    },
    thank_you: {
      message: 'Thank you for choosing Tasty Bites! We\'ll contact you within 2 hours to confirm your order or quote.'
    },    seo: {
      meta_title: 'Tasty Bites Delivery | Fast Food Delivery and Catering',
      meta_description: 'Fresh burgers, Asian favorites, pizza, salads, and catering delivered quickly to your door.',
      keywords: 'food delivery, catering, burgers, pad thai, pizza delivery, meal prep',
      og_image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Special Offers</h4><p>Check out our daily specials and combo deals!</p></div>',
      section_title: 'Daily Specials',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Menu',
      qr_description: 'Scan this QR code to share our delicious menu with friends and family.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Tasty Bites Delivery. All rights reserved.'
    }
  }
};
