import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const carMechanicTemplate = {
  name: t('Car Mechanic'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') }
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
        { name: 'title', type: 'text', label: t('Title') },
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'specialties', type: 'tags', label: t('Specialties') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
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
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price Range') },
            { name: 'icon', type: 'select', label: t('Service Icon'), options: [
              { value: 'car-wash', label: t('Car Wash') },
              { value: 'oil-change', label: t('Oil Change') },
              { value: 'brake-repair', label: t('Brake Repair') },
              { value: 'engine-repair', label: t('Engine Repair') },
              { value: 'tire-service', label: t('Tire Service') },
              { value: 'transmission', label: t('Transmission') },
              { value: 'diagnostic', label: t('Diagnostic') },
              { value: 'maintenance', label: t('General Maintenance') }
            ]}
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
      key: 'appointments',
      name: t('Appointments'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'appointment_note', type: 'textarea', label: t('Appointment Instructions') }
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
      key: 'products',
      name: t('Products'),
      fields: [
        {
          name: 'product_list',
          type: 'repeater',
          label: t('Products'),
          fields: [
            { name: 'title', type: 'text', label: t('Product Title') },
            { name: 'description', type: 'textarea', label: t('Product Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Product Image') },
            { name: 'buy_url', type: 'url', label: t('Buy Now URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'gallery',
      name: t('Gallery'),
      fields: [
        {
          name: 'gallery_items',
          type: 'repeater',
          label: t('Gallery Items'),
          fields: [
            { name: 'title', type: 'text', label: t('Title') },
            { name: 'image', type: 'file', label: t('Image') },
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
      key: 'testimonials',
      name: t('Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Customer Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Customer Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'client_image', type: 'file', label: t('Customer Photo') },
            { name: 'position', type: 'text', label: t('Position/Company') }
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
    { name: 'Classic Orange', primary: '#FF8000', secondary: '#FF9933', accent: '#FFF4E6', background: '#FFFFFF', text: '#111111', cardBg: '#F5F5F5' },
    { name: 'Professional Blue', primary: '#0B3D91', secondary: '#205490', accent: '#E6F3FF', background: '#FFFFFF', text: '#111111', cardBg: '#F8FAFC' },
    { name: 'Bold Red', primary: '#E53057', secondary: '#863961', accent: '#FFF0F3', background: '#FFFFFF', text: '#111111', cardBg: '#FEF7F7' },
    { name: 'Modern Dark', primary: '#333333', secondary: '#0D8278', accent: '#F0F9FF', background: '#1A1A1A', text: '#FFFFFF', cardBg: '#2A2A2A' },
    { name: 'Steel Blue', primary: '#6A7EA3', secondary: '#74820D', accent: '#F5F7FA', background: '#FFFFFF', text: '#111111', cardBg: '#F1F5F9' },
    { name: 'Automotive Green', primary: '#22C55E', secondary: '#16A34A', accent: '#F0FDF4', background: '#FFFFFF', text: '#111111', cardBg: '#F7FEF7' },
    { name: 'Engine Red', primary: '#DC2626', secondary: '#B91C1C', accent: '#FEF2F2', background: '#FFFFFF', text: '#111111', cardBg: '#FEFEFE' },
    { name: 'Motor Oil Black', primary: '#1F2937', secondary: '#374151', accent: '#F9FAFB', background: '#111827', text: '#F9FAFB', cardBg: '#1F2937' },
    { name: 'Chrome Silver', primary: '#64748B', secondary: '#475569', accent: '#F8FAFC', background: '#FFFFFF', text: '#0F172A', cardBg: '#F1F5F9' },
    { name: 'Tire Black', primary: '#0F172A', secondary: '#1E293B', accent: '#F1F5F9', background: '#FFFFFF', text: '#0F172A', cardBg: '#F8FAFC' }
  ],
  fontOptions: [
    { name: 'Outfit', value: 'Outfit, sans-serif', weight: '400,500,600,700' },
    { name: 'Inter', value: 'Inter, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '400,500,600,700' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#FF8000',
    secondary: '#FF9933',
    accent: '#FFF4E6',
    background: '#FFFFFF',
    text: '#111111',
    cardBg: '#F5F5F5',
    borderColor: '#E5E7EB'
  },
  defaultFont: 'Outfit, sans-serif',
  themeStyle: {
    layout: 'automotive-card',
    headerStyle: 'banner-profile',
    cardStyle: 'rounded-modern',
    buttonStyle: 'rounded-solid',
    iconStyle: 'automotive',
    spacing: 'comfortable',
    shadows: 'subtle',
    animations: 'smooth',
    backgroundPattern: 'none',
    borderRadius: '20px'
  },
  defaultData: {
    header: {
      name: 'Mechanic Joe',
      title: 'Car Mechanic at CarRepair',
      tagline: 'Professional automotive repair and maintenance services',
      profile_image: '',
    },
    contact: {
      email: 'kontakt@alpesh.com',
      phone: '+91 1122334455',
      website: 'https://demo.workdo.io/',
      location: 'Downtown Auto Center'
    },
    about: {
      title: 'About Our Shop',
      description: 'Professional automotive repair and maintenance services with over 15 years of experience. We specialize in all makes and models, providing quality service you can trust.',
      specialties: 'Engine Repair, Brake Service, Oil Changes, Transmission, Diagnostics',
      experience: '15',
    },
    services: {
      service_list: [
        { title: 'Car Wash', description: 'Complete exterior and interior car washing service', price: '$25-50', icon: 'car-wash' },
        { title: 'Oil Change', description: 'Full synthetic and conventional oil change service', price: '$30-80', icon: 'oil-change' },
        { title: 'Brake Repair', description: 'Complete brake system inspection and repair', price: '$150-400', icon: 'brake-repair' },
        { title: 'Engine Diagnostics', description: 'Computer diagnostics and engine troubleshooting', price: '$100-200', icon: 'diagnostic' }
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
      booking_url: 'https://calendly.com/carmechanic',
      calendar_link: 'https://calendar.google.com/carmechanic',
      appointment_note: 'Book your appointment online or call us directly. We offer same-day service for most repairs.'
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/carmechanic', username: 'carmechanic' },
        { platform: 'instagram', url: 'https://instagram.com/carmechanic', username: '@carmechanic' },
        { platform: 'youtube', url: 'https://youtube.com/carmechanic', username: 'Car Mechanic Tips' },
        { platform: 'twitter', url: 'https://twitter.com/carmechanic', username: '@carmechanic' }
      ]
    },
    products: {
      product_list: [
        { title: 'Wrench Set', description: 'Professional grade wrench set for automotive repairs', price: '$500', image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=900&q=80', buy_url: 'https://demo.workdo.io/' },
        { title: 'Engine Oil', description: 'High-quality synthetic motor oil', price: '$45', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80', buy_url: 'https://demo.workdo.io/' }
      ]
    },
    
    gallery: {
      gallery_items: [
        { title: 'Workshop Interior', image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80'},
        { title: 'Engine Repair Process', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80'},
        { title: 'Before & After', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'}
      ]
    },
   
    youtube: {
      channel_url: 'https://youtube.com/carmechanictips',
      channel_name: 'Car Mechanic Tips & Tricks',
      subscriber_count: '25.3K',
      featured_playlist: 'https://youtube.com/playlist?list=PLcarrepair',
      latest_video_embed: 'https://youtu.be/12POs3oEjjs?si=DePjzlBHc4HWX58n',
      channel_description: 'Expert automotive repair tips, maintenance guides, and DIY tutorials. Subscribe for weekly car care content and professional advice.'
    },
    testimonials: {
      reviews: [
        { client_name: 'John Smith', review: 'Excellent service! Fixed my car quickly and at a fair price. Highly recommend!', rating: '5', client_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', position: 'Local Customer' },
        { client_name: 'Sarah Johnson', review: 'Professional and reliable. They explained everything clearly and got me back on the road.', rating: '5', client_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', position: 'Regular Customer' },
        { client_name: 'Mike Davis', review: 'Best mechanic in town! Quality work and honest pricing. Will definitely return.', rating: '5', client_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', position: 'Satisfied Customer' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Downtown%20Auto%20Center%20Atlanta%20GA&z=13&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Downtown+Auto+Center+Atlanta+GA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/carfax-care-car-maintenance/id505284497',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.carfax.mycarfax'
    },
    contact_form: {
      form_title: 'Get a Quote',
      form_description: 'Need automotive service? Contact us for a free estimate on your repair needs.'
    },
    thank_you: {
      message: 'Thank you for choosing our automotive services! We look forward to keeping your vehicle running smoothly.'
    },
    seo: {
      meta_title: 'Professional Car Mechanic Services | Automotive Repair & Maintenance',
      meta_description: 'Expert automotive repair and maintenance services. ASE certified mechanics, quality parts, fair pricing. Book your appointment today!',
      keywords: 'car mechanic, auto repair, automotive service, brake repair, oil change, engine repair, car maintenance',
      og_image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80'
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Special Offers</h4><p>Check out our current promotions and seasonal discounts on automotive services.</p></div>',
      section_title: 'Special Offers',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Save Our Contact',
      qr_description: 'Scan this QR code to save our automotive service contact information.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Book Service',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Your trusted automotive service center. Quality repairs, honest pricing, and exceptional customer service.',
      footer_links: [
        { title: 'Services', url: '#services' },
        { title: 'Book Appointment', url: '#appointments' },
        { title: 'Contact Us', url: '#contact' },
        { title: 'Location', url: '#location' }
      ]
    },
    copyright: {
      text: '© 2025 Car Mechanic Services. All rights reserved.'
    }
  }
};
