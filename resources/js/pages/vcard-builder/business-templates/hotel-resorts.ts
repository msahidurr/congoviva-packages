import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const hotelResortsTemplate = {
  name: t('Hotel & Resorts'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Hotel/Resort Name') },
        { name: 'title', type: 'text', label: t('Property Type') },
        { name: 'tagline', type: 'textarea', label: t('Welcome Message') },
        { name: 'profile_image', type: 'file', label: t('Property Logo') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Reservations Email') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'location', type: 'text', label: t('Property Address') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About Property'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Property Description') },
        { name: 'amenities', type: 'tags', label: t('Key Amenities') },
        { name: 'star_rating', type: 'number', label: t('Star Rating (1-5)') },
        { name: 'established_year', type: 'number', label: t('Established Year') }
      ],
      required: false
    },
    {
      key: 'rooms',
      name: t('Rooms & Suites'),
      fields: [
        {
          name: 'room_types',
          type: 'repeater',
          label: t('Room Categories'),
          fields: [
            { name: 'room_name', type: 'text', label: t('Room Type') },
            { name: 'description', type: 'textarea', label: t('Room Description') },
            { name: 'price_from', type: 'text', label: t('Price From') },
            { name: 'max_occupancy', type: 'number', label: t('Max Occupancy') },
            { name: 'room_image', type: 'file', label: t('Room Image') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Property Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Hotel Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'property_tour', label: t('Property Tour') },
              { value: 'room_showcase', label: t('Room Showcase') },
              { value: 'amenities_tour', label: t('Amenities Tour') },
              { value: 'guest_testimonial', label: t('Guest Testimonial') },
              { value: 'dining_experience', label: t('Dining Experience') },
              { value: 'local_attractions', label: t('Local Attractions') }
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
      key: 'dining',
      name: t('Dining & Restaurants'),
      fields: [
        {
          name: 'restaurants',
          type: 'repeater',
          label: t('Dining Options'),
          fields: [
            { name: 'restaurant_name', type: 'text', label: t('Restaurant Name') },
            { name: 'cuisine_type', type: 'text', label: t('Cuisine Type') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'operating_hours', type: 'text', label: t('Operating Hours') }
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
          label: t('Property Photos'),
          fields: [
            { name: 'title', type: 'text', label: t('Photo Title') },
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'exterior', label: t('Exterior') },
              { value: 'rooms', label: t('Rooms') },
              { value: 'dining', label: t('Dining') },
              { value: 'amenities', label: t('Amenities') },
              { value: 'events', label: t('Events') }
            ]}
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
      name: t('Operating Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Reception Hours'),
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
      name: t('Reservations'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Online Booking URL') },
        { name: 'reservation_phone', type: 'tel', label: t('Reservation Phone') },
        { name: 'booking_email', type: 'email', label: t('Booking Email') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Guest Reviews'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Guest Testimonials'),
          fields: [
            { name: 'guest_name', type: 'text', label: t('Guest Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'stay_date', type: 'text', label: t('Stay Date') }
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
    { name: 'Luxury Gold', primary: '#B8860B', secondary: '#DAA520', accent: '#FFF8DC', background: '#FFFFFF', text: '#2C2C2C', cardBg: '#F8F9FA'},
    { name: 'Ocean Blue', primary: '#006994', secondary: '#4A90A4', accent: '#E6F3F7', background: '#F0F8FF', text: '#1E3A8A', cardBg: '#FFFFFF' },
    { name: 'Resort Green', primary: '#228B22', secondary: '#32CD32', accent: '#F0FFF0', background: '#F5F5DC', text: '#006400', cardBg: '#FFFFFF' },
    { name: 'Sunset Orange', primary: '#FF4500', secondary: '#FF7F50', accent: '#FFF8DC', background: '#FFFFFF', text: '#2C2C2C', cardBg: '#FFF5EE' },
    { name: 'Royal Purple', primary: '#663399', secondary: '#9966CC', accent: '#F3E5F5', background: '#FAFAFA', text: '#4A148C', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Crimson Text', value: 'Crimson Text, Georgia, serif', weight: '400,600,700' },
    { name: 'Lora', value: 'Lora, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#B8860B',
    secondary: '#DAA520',
    accent: '#FFF8DC',
    background: '#FFFFFF',
    text: '#2C2C2C',
    cardBg: '#F8F9FA',
    borderColor: '#A67C52',
    buttonText: '#FFFFFF',
    highlightColor: '#228B22'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'hotel-showcase',
    headerStyle: 'hero-banner',
    cardStyle: 'hospitality-cards',
    buttonStyle: 'reservation-cta',
    iconStyle: 'hotel-amenities',
    spacing: 'resort-layout',
    shadows: 'luxury-depth',
    animations: 'parallax-scroll',
    backgroundPattern: 'marble-texture',
    typography: 'luxury-serif'
  },
  defaultData: {
    header: {
      name: 'Grand Paradise Resort',
      title: '5-Star Luxury Resort',
      tagline: 'Experience unparalleled luxury and comfort in paradise',
      profile_image: ''
    },
    contact: {
      email: 'reservations@grandparadise.com',
      phone: '+1 (555) 123-STAY',
      website: 'https://grandparadiseresort.com',
      location: 'Paradise Island, Bahamas'
    },
    about: {
      description: 'Nestled on pristine white sand beaches, Grand Paradise Resort offers world-class amenities, exceptional service, and unforgettable experiences for discerning travelers.',
      amenities: 'Private Beach, Spa, Pool, Restaurant, Bar, Gym, WiFi, Concierge',
      star_rating: '5',
      established_year: '1995'
    },
    rooms: {
      room_types: [
        { room_name: 'Ocean View Suite', description: 'Luxurious suite with panoramic ocean views', price_from: '450', max_occupancy: '4', room_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
        { room_name: 'Beachfront Villa', description: 'Private villa steps from the beach', price_from: '850', max_occupancy: '6', room_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80' },
        { room_name: 'Presidential Suite', description: 'Ultimate luxury with private butler service', price_from: '1200', max_occupancy: '8', room_image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Luxury Beach Resort Tour', description: 'Experience world-class amenities and breathtaking ocean views', video_type: 'property_tour', embed_url: 'https://youtu.be/jspzKALGSMU?si=A_85Hq5VsFrm5YEd', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', duration: '5:30' },
        { title: 'Luxury Hotel Room Tour', description: 'Tour our elegantly designed luxury suites and amenities', video_type: 'room_showcase', embed_url: 'https://youtu.be/zKvUa3aXStQ?si=YWy-8O4rx_G5P7MA', thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', duration: '10:25' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/grandparadiseresort',
      channel_name: 'Grand Paradise Resort',
      subscriber_count: '25.3K',
      featured_playlist: 'https://youtube.com/playlist?list=PLresortexperiences',
      latest_video_embed: 'https://youtu.be/jspzKALGSMU?si=A_85Hq5VsFrm5YEd',
      channel_description: 'Discover luxury travel experiences, resort tours, and guest stories from Grand Paradise Resort. Subscribe for exclusive content and travel inspiration.'
    },
    dining: {
      restaurants: [
        { restaurant_name: 'Azure Restaurant', cuisine_type: 'Fine Dining', description: 'Award-winning cuisine with ocean views', operating_hours: '6:00 PM - 11:00 PM' },
        { restaurant_name: 'Poolside Grill', cuisine_type: 'Casual Dining', description: 'Fresh grilled specialties by the pool', operating_hours: '11:00 AM - 10:00 PM' },
        { restaurant_name: 'Sunset Lounge', cuisine_type: 'Bar & Cocktails', description: 'Craft cocktails with stunning sunset views', operating_hours: '4:00 PM - 2:00 AM' }
      ]
    },
    gallery: {
      photos: [
        { title: 'Resort Exterior', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80', category: 'exterior' },
        { title: 'Ocean View Suite', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', category: 'rooms' },
        { title: 'Azure Restaurant', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80', category: 'dining' },
        { title: 'Infinity Pool', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80', category: 'amenities' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/grandparadise', username: '@grandparadise' },
        { platform: 'facebook', url: 'https://facebook.com/grandparadiseresort', username: 'Grand Paradise Resort' },
        { platform: 'twitter', url: 'https://twitter.com/grandparadise', username: '@grandparadise' },
        { platform: 'youtube', url: 'https://youtube.com/grandparadiseresort', username: 'Grand Paradise Resort' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '00:00', close_time: '23:59', is_closed: false },
        { day: 'tuesday', open_time: '00:00', close_time: '23:59', is_closed: false },
        { day: 'wednesday', open_time: '00:00', close_time: '23:59', is_closed: false },
        { day: 'thursday', open_time: '00:00', close_time: '23:59', is_closed: false },
        { day: 'friday', open_time: '00:00', close_time: '23:59', is_closed: false },
        { day: 'saturday', open_time: '00:00', close_time: '23:59', is_closed: false },
        { day: 'sunday', open_time: '00:00', close_time: '23:59', is_closed: false }
      ]
    },
    appointments: {
      booking_url: 'https://grandparadise.com/book',
      reservation_phone: '+1 (555) 123-STAY',
      booking_email: 'reservations@grandparadise.com'
    },
    testimonials: {
      reviews: [
        { guest_name: 'Sarah & Michael', review: 'Absolutely magical stay! The service was impeccable and the views were breathtaking.', rating: '5', stay_date: 'December 2024' },
        { guest_name: 'The Johnson Family', review: 'Perfect family vacation. The kids loved the pool and we enjoyed the spa.', rating: '5', stay_date: 'November 2024' },
        { guest_name: 'David Chen', review: 'Outstanding resort with world-class amenities. Will definitely return!', rating: '5', stay_date: 'October 2024' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Maui%20Hawaii&z=11&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Maui+Hawaii'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/booking-com-travel-deals/id367003839',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.booking'
    },
    contact_form: {
      form_title: 'Plan Your Stay',
      form_description: 'Ready to experience paradise? Contact us to plan your perfect getaway.'
    },
    thank_you: {
      message: 'Thank you for your interest in Grand Paradise Resort! We will contact you within 24 hours to assist with your reservation.'
    },
    seo: {
      meta_title: 'Grand Paradise Resort - 5-Star Luxury Resort in Paradise',
      meta_description: 'Experience luxury at Grand Paradise Resort. 5-star accommodations, world-class amenities, and pristine beaches await.',
      keywords: 'luxury resort, 5-star hotel, paradise island, beach resort, vacation, spa, fine dining',
      og_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Special Offers</h4><p>Book direct and save up to 20% on your stay. Includes complimentary breakfast and spa credits.</p></div>',
      section_title: 'Special Offers',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Resort Info',
      qr_description: 'Scan this QR code to share our resort information with friends and family.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'Contact Resort',
      appointment_button_text: 'Book Your Stay',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Experience the ultimate in luxury and relaxation at Grand Paradise Resort. Your perfect getaway awaits.',
      footer_links: [
        { title: 'View Rooms', url: '#rooms' },
        { title: 'Make Reservation', url: '#booking' },
        { title: 'Resort Amenities', url: '#amenities' },
        { title: 'Contact Us', url: '#contact' }
      ]
    },
    copyright: {
      text: '© 2025 Grand Paradise Resort. All rights reserved.'
    }
  }
};
