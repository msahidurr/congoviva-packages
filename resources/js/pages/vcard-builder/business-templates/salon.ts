import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const salonTemplate = {
  name: t('Salon & Spa'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Salon Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
        { name: 'background_image', type: 'file', label: t('Background Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'specialists_count', type: 'number', label: t('Number of Specialists') }
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
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'hair', label: t('Hair') },
              { value: 'nails', label: t('Nails') },
              { value: 'facial', label: t('Facial') },
              { value: 'massage', label: t('Massage') },
              { value: 'makeup', label: t('Makeup') },
              { value: 'spa', label: t('Spa Treatments') },
              { value: 'waxing', label: t('Waxing') },
              { value: 'other', label: t('Other') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'specialists',
      name: t('Specialists'),
      fields: [
        {
          name: 'team',
          type: 'repeater',
          label: t('Team Members'),
          fields: [
            { name: 'name', type: 'text', label: t('Name') },
            { name: 'title', type: 'text', label: t('Title/Position') },
            { name: 'bio', type: 'textarea', label: t('Bio') },
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'specialties', type: 'text', label: t('Specialties') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'promotions',
      name: t('Promotions'),
      fields: [
        {
          name: 'offers',
          type: 'repeater',
          label: t('Special Offers'),
          fields: [
            { name: 'title', type: 'text', label: t('Promotion Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'valid_until', type: 'text', label: t('Valid Until') },
            { name: 'discount', type: 'text', label: t('Discount/Offer') },
            { name: 'code', type: 'text', label: t('Promo Code (if applicable)') }
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
          label: t('Salon Hours'),
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
      key: 'videos',
      name: t('Salon Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Beauty Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'transformation', label: t('Hair Transformation') },
              { value: 'tutorial', label: t('Beauty Tutorial') },
              { value: 'salon_tour', label: t('Salon Tour') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'product_demo', label: t('Product Demonstration') }
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
            { name: 'caption', type: 'text', label: t('Caption') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'salon', label: t('Salon Interior') },
              { value: 'work', label: t('Our Work') },
              { value: 'products', label: t('Products') },
              { value: 'team', label: t('Team') }
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
            { name: 'service_received', type: 'text', label: t('Service Received') }
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
        { name: 'cancellation_policy', type: 'textarea', label: t('Cancellation Policy') }
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
    { name: 'Elegant Rose', primary: '#DB7093', secondary: '#E8B4B8', accent: '#FFF0F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Spa Mint', primary: '#3EB489', secondary: '#5FCCA0', accent: '#E0F5EE', background: '#FFFFFF', text: '#333333' },
    { name: 'Lavender Calm', primary: '#8A2BE2', secondary: '#9370DB', accent: '#F3E5F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Luxury Gold', primary: '#D4AF37', secondary: '#F0E68C', accent: '#FFF8E1', background: '#FFFFFF', text: '#333333' },
    { name: 'Modern Black', primary: '#333333', secondary: '#555555', accent: '#F5F5F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Ocean Breeze', primary: '#4682B4', secondary: '#87CEEB', accent: '#F0F8FF', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Lato', value: 'Lato, sans-serif', weight: '300,400,700' },
    { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', weight: '300,400,500,600,700' },
    { name: 'Raleway', value: 'Raleway, sans-serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#DB7093',
    secondary: '#E8B4B8',
    accent: '#FFF0F5',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#FAFAFA',
    borderColor: '#F0F0F0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFD700'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'salon-layout',
    headerStyle: 'elegant',
    cardStyle: 'soft-shadow',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'airy',
    shadows: 'soft',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'Serenity Salon & Spa',
      tagline: 'Where beauty meets relaxation',
      logo: '',
      background_image: ''
    },
    about: {
      description: 'Welcome to Serenity Salon & Spa, where we believe in nurturing both inner and outer beauty. Our team of skilled professionals is dedicated to providing exceptional services in a tranquil environment, helping you look and feel your absolute best.',
      year_established: '2018',
      specialists_count: '12'
    },
    services: {
      service_list: [
        { title: 'Signature Haircut & Style', description: 'Precision cut and professional styling tailored to your face shape and preferences', price: 'From $65', duration: '45-60 min', category: 'hair' },
        { title: 'Classic Manicure', description: 'Nail shaping, cuticle care, hand massage, and polish application', price: '$35', duration: '30 min', category: 'nails' },
        { title: 'Rejuvenating Facial', description: 'Deep cleansing, exfoliation, mask, and moisturizing treatment customized for your skin type', price: '$85', duration: '60 min', category: 'facial' },
        { title: 'Swedish Massage', description: 'Relaxing full-body massage using long, flowing strokes to reduce tension and promote wellness', price: '$95', duration: '60 min', category: 'massage' }
      ]
    },
    specialists: {
      team: [
        { name: 'Emma Johnson', title: 'Senior Hair Stylist', bio: 'With over 10 years of experience, Emma specializes in creative color techniques and precision cutting.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', specialties: 'Color, Balayage, Precision Cuts' },
        { name: 'Michael Chen', title: 'Massage Therapist', bio: 'Certified in multiple massage modalities, Michael is known for his therapeutic approach to relieving tension and promoting relaxation.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', specialties: 'Deep Tissue, Hot Stone, Swedish' },
        { name: 'Sophia Rodriguez', title: 'Esthetician', bio: 'Sophia is passionate about skincare and helping clients achieve their best complexion through customized facial treatments.', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', specialties: 'Anti-aging, Acne Treatment, Chemical Peels' }
      ]
    },
    promotions: {
      offers: [
        { title: 'New Client Special', description: '20% off your first service with us', valid_until: 'Ongoing', discount: '20% Off', code: 'WELCOME' },
        { title: 'Spa Package Deal', description: 'Enjoy a facial, massage, and manicure at a special bundled price', valid_until: 'December 31, 2025', discount: 'Save $45', code: 'SPADAY' }
      ]
    },
    contact: {
      email: 'info@serenitysalon.com',
      phone: '(555) 123-4567',
      website: 'https://www.serenitysalon.com',
      address: '123 Beauty Lane, Suite 100, Los Angeles, CA 90001'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/serenitysalon', username: '@serenitysalon' },
        { platform: 'facebook', url: 'https://facebook.com/serenitysalon', username: 'Serenity Salon & Spa' },
        { platform: 'pinterest', url: 'https://pinterest.com/serenitysalon', username: 'serenitysalon' },
        { platform: 'youtube', url: 'https://youtube.com/serenitysalon', username: 'Serenity Salon & Spa' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Dramatic Hair Color Transformation', description: 'Watch Emma transform a client with a stunning balayage makeover', video_type: 'transformation', embed_url: 'https://www.youtube.com/watch?v=Zun83BlHGLo', thumbnail: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80', duration: '8:30' },
        { title: 'Tour Our Luxurious Spa Facilities', description: 'Take a relaxing tour through our beautiful salon and spa spaces', video_type: 'salon_tour', embed_url: 'https://www.youtube.com/watch?v=mjMFopDNUSY', thumbnail: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80', duration: '4:15' },
        { title: 'At-Home Skincare Routine Tips', description: 'Sophia shares professional skincare tips you can do at home', video_type: 'tutorial', embed_url: 'https://www.youtube.com/watch?v=-WrR5fh5kKc', thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', duration: '6:45' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/serenitysalon',
      channel_name: 'Serenity Salon & Spa',
      subscriber_count: '15.6K',
      featured_playlist: 'https://youtube.com/playlist?list=PLbeautytips',
      latest_video_embed: 'https://www.youtube.com/watch?v=Zun83BlHGLo',
      channel_description: 'Beauty transformations, skincare tips, and behind-the-scenes content from Serenity Salon & Spa. Subscribe for weekly beauty inspiration!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'tuesday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'wednesday', open_time: '10:00', close_time: '19:00', is_closed: false },
        { day: 'thursday', open_time: '10:00', close_time: '20:00', is_closed: false },
        { day: 'friday', open_time: '10:00', close_time: '20:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'sunday', open_time: '11:00', close_time: '16:00', is_closed: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80', caption: 'Our elegant salon interior', category: 'salon' },
        { image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80', caption: 'Balayage by Emma', category: 'work' },
        { image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80', caption: 'Relaxing massage room', category: 'salon' },
        { image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', caption: 'Premium products we use and recommend', category: 'products' }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Jessica M.', review: 'Emma transformed my hair with the most beautiful highlights. The attention to detail and personalized service made my experience exceptional.', rating: '5', service_received: 'Balayage & Cut' },
        { client_name: 'Robert T.', review: 'The deep tissue massage with Michael was exactly what I needed. He targeted all my problem areas and I left feeling completely renewed.', rating: '5', service_received: 'Deep Tissue Massage' },
        { client_name: 'Alicia K.', review: 'My facial with Sophia was amazing! She analyzed my skin and customized the treatment perfectly. My complexion has never looked better.', rating: '5', service_received: 'Signature Facial' }
      ]
    },
    appointments: {
      booking_url: 'https://bookings.serenitysalon.com',
      section_title: 'Ready for a New Look?',
      section_description: 'Book your appointment today and let our specialists take care of you.',
      booking_text: 'Book an Appointment',
      cancellation_policy: 'Please provide at least 24 hours notice for cancellations to avoid a 50% service fee. No-shows will be charged the full service amount.'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Beauty%20Lane%2C%20Los%20Angeles%2C%20CA%2090001&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Beauty+Lane+Los+Angeles+CA+90001'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/styleseat-book-beauty-barber/id441018161',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.styleseat.standalone',
      app_description: 'Download our app to book appointments, manage your schedule, and receive exclusive offers and promotions.'
    },
    contact_form: {
      form_title: 'Contact Us',
      form_description: 'Have questions or special requests? Send us a message and our team will get back to you as soon as possible.'
    },
    thank_you: {
      message: 'Thank you for your message! Our team will respond within 24 hours. We look forward to welcoming you to Serenity Salon & Spa.'
    },    seo: {
      meta_title: 'Serenity Salon & Spa | Hair, Skincare, and Wellness Services',
      meta_description: 'Salon and spa services including hair styling, facials, massage, and beauty treatments from experienced specialists.',
      keywords: 'salon, spa, balayage, facial, massage, skincare, beauty services',
      og_image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Beauty Tips</h4><p>Discover our expert beauty tips and skincare advice for maintaining your glow at home.</p></div>',
      section_title: 'Beauty Tips',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Salon',
      qr_description: 'Scan this QR code to book appointments, view our services, and get our contact information.',
      qr_size: 'medium'
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Book Appointment',
      save_contact_button_text: 'Save Contact'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Serenity Salon & Spa. All rights reserved.'
    }
  }
};
