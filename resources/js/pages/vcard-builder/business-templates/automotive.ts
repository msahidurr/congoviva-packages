import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const automotiveTemplate = {
  name: 'Automotive Services',
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Shop Name') },
        { name: 'title', type: 'text', label: t('Service Type') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'profile_image', type: 'file', label: t('Shop Logo') },
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
        { name: 'location', type: 'text', label: t('Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Our Shop') },
        { name: 'specialties', type: 'tags', label: t('Specialties') },
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
          label: t('Auto Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Starting Price') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Service Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Automotive Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'service_demo', label: t('Service Demonstration') },
              { value: 'repair_process', label: t('Repair Process') },
              { value: 'customer_testimonial', label: t('Customer Testimonial') },
              { value: 'shop_tour', label: t('Shop Tour') },
              { value: 'maintenance_tips', label: t('Maintenance Tips') },
              { value: 'before_after', label: t('Before & After Repair') }
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
      key: 'certifications',
      name: t('Certifications'),
      fields: [
        {
          name: 'cert_list',
          type: 'repeater',
          label: t('Certifications & Brands'),
          fields: [
            { name: 'title', type: 'text', label: t('Certification/Brand') },
            { name: 'description', type: 'text', label: t('Details') }
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
            { name: 'url', type: 'url', label: t('Profile URL') }
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
          label: t('Shop Hours'),
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
        { name: 'emergency_phone', type: 'tel', label: t('Emergency/Towing Number') }
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
            { name: 'vehicle', type: 'text', label: t('Vehicle') }
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
        { name: 'appointment_button_text', type: 'text', label: t('Service Button Text') },
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
    { name: 'Motor Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#F5F5F5', text: '#1F1F1F', cardBg: '#FFFFFF' },
    { name: 'Engine Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', background: '#F0F4FF', text: '#1E293B', cardBg: '#FFFFFF' },
    { name: 'Chrome Silver', primary: '#6B7280', secondary: '#9CA3AF', accent: '#F3F4F6', background: '#F9FAFB', text: '#111827', cardBg: '#FFFFFF' },
    { name: 'Racing Yellow', primary: '#D97706', secondary: '#FACC15', accent: '#FEF3C7', background: '#FFFBEB', text: '#1C1917', cardBg: '#FFFFFF' },
    { name: 'Tire Black', primary: '#F97316', secondary: '#FB923C', accent: '#FED7AA', background: '#FFF7ED', text: '#1A1A1A', cardBg: '#FFFFFF' },
    { name: 'Oil Green', primary: '#059669', secondary: '#10b77f', accent: '#D1FAE5', background: '#F0FDF4', text: '#064E3B', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#DC2626',
    secondary: '#EF4444',
    accent: '#FEE2E2',
    background: '#1F1F1F',
    text: '#F5F5F5',
    cardBg: '#2A2A2A',
    borderColor: '#404040'
  },
  defaultFont: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'industrial',
    headerStyle: 'metallic',
    cardStyle: 'industrial',
    buttonStyle: 'bold',
    iconStyle: 'solid',
    spacing: 'compact',
    shadows: 'strong',
    animations: 'mechanical'
  },
  defaultData: {
    header: {
      name: 'AutoCare Pro',
      title: 'Complete Automotive Services',
      tagline: 'Expert auto repair and maintenance services you can trust',
      profile_image: '',
      badge_1: 'Licensed & Insured',
      badge_2: 'Expert Service'
    },
    contact: {
      email: 'service@autocare.com',
      phone: '+1 (555) 123-AUTO',
      website: 'https://autocarepro.com',
      location: 'Downtown Auto District'
    },
    about: {
      description: 'Family-owned auto shop providing honest, reliable automotive services for over 20 years. ASE certified technicians using the latest diagnostic equipment.',
      specialties: 'Engine Repair, Brake Service, Oil Changes, Transmission, AC Repair, Diagnostics',
      experience: '20'
    },
    action_buttons: {
      contact_button_text: 'Get Service Quote',
      appointment_button_text: 'Schedule Service',
      save_contact_button_text: 'Save Contact'
    },
    services: {
      service_list: [
        { title: 'Oil Change & Filter', description: 'Full synthetic oil change with multi-point inspection', price: 'From $49.99' },
        { title: 'Brake Service', description: 'Complete brake inspection, pads, rotors, and fluid service', price: 'From $149.99' },
        { title: 'Engine Diagnostics', description: 'Computer diagnostics and check engine light service', price: 'From $99.99' },
        { title: 'Transmission Service', description: 'Transmission fluid change and inspection', price: 'From $179.99' }
      ]
    },
    certifications: {
      cert_list: [
        { title: 'ASE Certified', description: 'Automotive Service Excellence Certification' },
        { title: 'AAA Approved', description: 'AAA Approved Auto Repair Facility' },
        { title: 'NAPA AutoCare', description: 'NAPA AutoCare Center with nationwide warranty' }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/autocarepro' },
        { platform: 'instagram', url: 'https://instagram.com/autocarepro' },
        { platform: 'youtube', url: 'https://youtube.com/@autocarepro' },
        { platform: 'whatsapp', url: 'https://wa.me/15551234567' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/autocarepro' },
        { platform: 'x', url: 'https://x.com/autocarepro' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '07:30', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '07:30', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '07:30', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '07:30', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '07:30', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '16:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://autocarepro.com/book',
      emergency_phone: '+1 (555) 911-TOWS'
    },
    testimonials: {
      reviews: [
        { client_name: 'Mike Johnson', review: 'Honest mechanics who explain everything clearly. Fixed my transmission at a fair price.', rating: '5', vehicle: '2018 Honda Civic' },
        { client_name: 'Sarah Davis', review: 'Quick oil change service and they found a potential issue before it became expensive. Great service!', rating: '5', vehicle: '2020 Toyota Camry' },
        { client_name: 'Robert Chen', review: 'ASE certified technicians who know their stuff. My go-to shop for all automotive needs.', rating: '5', vehicle: '2019 Ford F-150' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Complete Brake Service Walkthrough', description: 'Watch our ASE certified technicians perform a complete brake service', video_type: 'service_demo', embed_url: 'https://youtu.be/x2rTxWx-LfQ', thumbnail: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80', duration: '15:30' },
        { title: 'How to Diagnose Check Engine Light', description: 'See how we diagnose check engine lights using professional OBD equipment', video_type: 'repair_process', embed_url: 'https://youtu.be/pN4KnBTV_ss', thumbnail: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=80', duration: '10:45' },
        { title: 'Real Customer Transmission Repair Review', description: 'Hear from a satisfied customer about our honest and reliable transmission service', video_type: 'customer_testimonial', embed_url: 'https://youtu.be/TQQ3IIFfRb0', thumbnail: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80', duration: '3:20' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/autocarepro',
      channel_name: 'AutoCare Pro',
      subscriber_count: '12.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLautomaintenance',
      latest_video_embed: 'https://youtu.be/x2rTxWx-LfQ',
      channel_description: 'Professional automotive repair tips, service demonstrations, and maintenance advice from ASE certified technicians.'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Los%20Angeles%20CA&z=13&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/carfax-car-care/id547869480',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.carfax.mycarfax'
    },
    contact_form: {
      form_title: 'Schedule Your Service',
      form_description: 'Get a free estimate or schedule your automotive service appointment today.'
    },
    thank_you: {
      message: 'Thank you for choosing AutoCare Pro! We\'ll contact you within 2 hours to confirm your appointment.'
    },    seo: {
      meta_title: 'AutoCare Pro | Brake, Engine, and Transmission Repair',
      meta_description: 'Trusted auto repair shop offering diagnostics, brake service, engine repair, and maintenance.',
      keywords: 'auto repair, mechanic, brake service, engine diagnostics, transmission service, ASE certified',
      og_image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="featured-services"><h4>Certified Excellence</h4><p>ASE Certified technicians with over 20 years of automotive expertise. Your trusted local auto repair shop.</p></div>',
      section_title: 'Why Choose Us',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Save Our Shop Info',
      qr_description: 'Scan to save our contact details and never lose our number when you need automotive service.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 AutoCare Pro. All rights reserved.'
    }
  }
};
