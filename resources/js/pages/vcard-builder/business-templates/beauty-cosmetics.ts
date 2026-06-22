import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const beautyCosmeticsTemplate = {
  name: t('Beauty & Cosmetics'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Brand/Artist Name') },
        { name: 'title', type: 'text', label: t('Specialty') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile/Logo') }
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
        { name: 'description', type: 'textarea', label: t('About Me/Brand') },
        { name: 'specialties', type: 'tags', label: t('Specialties') },
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
          label: t('Beauty Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Duration') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Beauty Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Beauty Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'makeup_tutorial', label: t('Makeup Tutorial') },
              { value: 'transformation', label: t('Transformation') },
              { value: 'product_review', label: t('Product Review') },
              { value: 'skincare_routine', label: t('Skincare Routine') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
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
      key: 'portfolio',
      name: t('Portfolio'),
      fields: [
        {
          name: 'projects',
          type: 'repeater',
          label: t('Beauty Work'),
          fields: [
            { name: 'title', type: 'text', label: t('Look/Style Name') },
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'category', type: 'text', label: t('Category') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'products',
      name: t('Featured Products'),
      fields: [
        {
          name: 'product_list',
          type: 'repeater',
          label: t('Products'),
          fields: [
            { name: 'name', type: 'text', label: t('Product Name') },
            { name: 'brand', type: 'text', label: t('Brand') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'link', type: 'url', label: t('Purchase Link') }
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
            { name: 'username', type: 'text', label: t('Username') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'business_hours',
      name: t('Availability'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Available Hours'),
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
            { name: 'open_time', type: 'time', label: t('Start Time') },
            { name: 'close_time', type: 'time', label: t('End Time') },
            { name: 'is_closed', type: 'checkbox', label: t('Unavailable') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Bookings'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'consultation_note', type: 'textarea', label: t('Consultation Note') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Client Reviews'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Client Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'service', type: 'text', label: t('Service Received') }
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
        { name: 'appointment_button_text', type: 'text', label: t('Booking Button Text') },
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
    { name: 'Rose Gold', primary: '#E91E63', secondary: '#F06292', accent: '#FCE4EC', background: '#FFF8F8', text: '#2D2D2D', cardBg: '#FFFFFF' },
    { name: 'Coral Blush', primary: '#FF6B6B', secondary: '#FF8E8E', accent: '#FFE8E8', background: '#FFFAFA', text: '#333333', cardBg: '#FFFFFF' },
    { name: 'Lavender Dream', primary: '#9C27B0', secondary: '#BA68C8', accent: '#F3E5F5', background: '#FAFAFA', text: '#2E2E2E', cardBg: '#FFFFFF' },
    { name: 'Peach Glow', primary: '#FF9800', secondary: '#FFB74D', accent: '#FFF3E0', background: '#FFFEF7', text: '#2C2C2C', cardBg: '#FFFFFF' },
    { name: 'Emerald Glam', primary: '#00897B', secondary: '#26A69A', accent: '#E0F2F1', background: '#F5FFFE', text: '#1A2E2D', cardBg: '#FFFFFF' },
    { name: 'Nude Elegance', primary: '#A1887F', secondary: '#BCAAA4', accent: '#EFEBE9', background: '#FAFAFA', text: '#3E2723', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600' },
    { name: 'Lora', value: 'Lora, Georgia, serif', weight: '400,500,600' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600' },
    { name: 'Dancing Script', value: 'Dancing Script, cursive', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#E91E63',
    secondary: '#F06292',
    accent: '#FCE4EC',
    background: '#FFF8F8',
    text: '#2D2D2D',
    cardBg: '#FFFFFF',
    borderColor: '#F8BBD9'
  },
  defaultFont: 'Playfair Display, Georgia, serif',
  themeStyle: {
    layout: 'elegant',
    headerStyle: 'glamorous',
    cardStyle: 'soft',
    buttonStyle: 'rounded',
    iconStyle: 'outlined',
    spacing: 'airy',
    shadows: 'soft',
    animations: 'gentle'
  },
  defaultData: {
    header: {
      name: 'Bella Beauty Studio',
      title: 'Makeup Artist & Beauty Consultant',
      tagline: 'Enhancing your natural beauty with artistry and elegance',
      profile_image: ''
    },
    contact: {
      email: 'hello@bellabeauty.com',
      phone: '+1 (555) 123-GLOW',
      website: 'https://bellabeauty.com',
      location: 'Beverly Hills, CA'
    },
    about: {
      description: 'Professional makeup artist specializing in bridal, editorial, and special occasion makeup. Certified in advanced beauty techniques with a passion for enhancing natural beauty.',
      specialties: 'Bridal Makeup, Editorial, Special Events, Skincare Consultation, Color Matching',
      experience: '7'
    },
    action_buttons: {
      contact_button_text: 'Book Your Glow Up',
      appointment_button_text: 'Schedule Consultation',
      save_contact_button_text: 'Save Contact'
    },
    services: {
      service_list: [
        { title: 'Bridal Makeup', description: 'Complete bridal look with trial session', price: '$350', duration: '3 hours' },
        { title: 'Special Event Makeup', description: 'Glamorous makeup for special occasions', price: '$150', duration: '1.5 hours' },
        { title: 'Makeup Lesson', description: 'Personal makeup tutorial and tips', price: '$120', duration: '2 hours' },
        { title: 'Skincare Consultation', description: 'Personalized skincare routine advice', price: '$80', duration: '1 hour' }
      ]
    },
    portfolio: {
      projects: [
        { title: 'Romantic Bridal Look', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', category: 'Bridal' },
        { title: 'Editorial Glam', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80', category: 'Editorial' },
        { title: 'Natural Glow', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', category: 'Everyday' }
      ]
    },
    products: {
      product_list: [
        { name: 'Signature Lip Gloss', brand: 'Bella Beauty', price: '$28', link: '#' },
        { name: 'Glow Serum', brand: 'Bella Beauty', price: '$45', link: '#' },
        { name: 'Contour Palette', brand: 'Bella Beauty', price: '$38', link: '#' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/bellabeauty', username: '@bellabeauty' },
        { platform: 'tiktok', url: 'https://tiktok.com/@bellabeauty', username: '@bellabeauty' },
        { platform: 'youtube', url: 'https://youtube.com/bellabeauty', username: 'Bella Beauty' },
        { platform: 'pinterest', url: 'https://pinterest.com/bellabeauty', username: 'bellabeauty' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Bridal Makeup Tutorial - Romantic Glow', description: 'Step-by-step tutorial for achieving the perfect bridal makeup look', video_type: 'makeup_tutorial', embed_url: 'https://youtu.be/Df2XCQ2zuu4', thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80', duration: '15:20' },
        { title: 'My Daily Skincare Routine', description: 'The skincare routine I recommend to all my clients for glowing skin', video_type: 'skincare_routine', embed_url: 'https://youtu.be/1mP10c039MI', thumbnail: 'https://images.unsplash.com/photo-1498843053639-170ff2122f35?auto=format&fit=crop&w=900&q=80', duration: '12:30' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/bellabeauty',
      channel_name: 'Bella Beauty',
      subscriber_count: '156K',
      featured_playlist: 'https://youtube.com/playlist?list=PLbridalmakeup',
      latest_video_embed: 'https://youtu.be/Df2XCQ2zuu4',
      channel_description: 'Beauty tutorials, makeup tips, skincare advice, and client transformations. Subscribe for weekly beauty content and professional makeup artist insights.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'tuesday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'wednesday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'thursday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'friday', open_time: '10:00', close_time: '20:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'sunday', open_time: '11:00', close_time: '17:00', is_closed: false }
      ]
    },
    appointments: {
      booking_url: 'https://bellabeauty.com/book',
      consultation_note: 'Free 15-minute consultation available for all new clients'
    },
    testimonials: {
      reviews: [
        { client_name: 'Emma Wilson', review: 'Absolutely stunning bridal makeup! Bella made me feel like a princess on my wedding day.', rating: '5', service: 'Bridal Makeup' },
        { client_name: 'Sofia Martinez', review: 'Amazing makeup lesson! I learned so much and now I can recreate the looks at home.', rating: '5', service: 'Makeup Lesson' },
        { client_name: 'Grace Chen', review: 'Professional and talented artist. My makeup looked flawless for the entire event.', rating: '5', service: 'Special Event' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Los%20Angeles%20CA&z=13&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/sephora-buy-makeup-skincare/id393328150',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.sephora'
    },
    contact_form: {
      form_title: 'Book Your Beauty Session',
      form_description: 'Ready to enhance your natural beauty? Contact me for a personalized consultation.'
    },
    thank_you: {
      message: 'Thank you for your interest! I\'ll get back to you within 24 hours to discuss your beauty needs.'
    },    seo: {
      meta_title: 'Bella Beauty Studio | Makeup, Bridal, and Skincare Services',
      meta_description: 'Professional beauty services including bridal makeup, glam looks, lessons, and skincare guidance.',
      keywords: 'makeup artist, bridal makeup, beauty studio, skincare routine, glam makeup, cosmetics',
      og_image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="beauty-highlight"><h4>Certified Professional</h4><p>Licensed makeup artist with advanced certifications in bridal and editorial makeup artistry.</p></div>',
      section_title: 'Professional Excellence',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Beauty Services',
      qr_description: 'Scan to save my contact info and share my beauty services with friends.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Bella Beauty Studio. All rights reserved.'
    }
  }
};
