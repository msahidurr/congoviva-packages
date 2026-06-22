import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const homeServicesTemplate = {
  name: t('Home Services & Maintenance'),
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
        { name: 'badge_2', type: 'text', label: t('Badge 2 Text') },
        { name: 'badge_3', type: 'text', label: t('Badge 3 Text') }
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
        { name: 'description', type: 'textarea', label: t('About Our Services') },
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
          label: t('Home Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Starting Price') },
            { name: 'emergency', type: 'checkbox', label: t('Emergency Service') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'certifications',
      name: t('Licenses & Insurance'),
      fields: [
        {
          name: 'cert_list',
          type: 'repeater',
          label: t('Certifications'),
          fields: [
            { name: 'title', type: 'text', label: t('License/Certification') },
            { name: 'number', type: 'text', label: t('License Number') },
            { name: 'expiry', type: 'text', label: t('Expiry Date') }
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
          label: t('Home Service Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'service_demo', label: t('Service Demonstration') },
              { value: 'how_to_tips', label: t('How-To Tips') },
              { value: 'before_after', label: t('Before & After') },
              { value: 'customer_testimonial', label: t('Customer Testimonial') },
              { value: 'emergency_response', label: t('Emergency Response') },
              { value: 'maintenance_tips', label: t('Maintenance Tips') }
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
      key: 'emergency_info',
      name: t('Emergency Services'),
      fields: [
        { name: 'emergency_phone', type: 'tel', label: t('Emergency Phone') },
        { name: 'emergency_hours', type: 'text', label: t('Emergency Hours') },
        { name: 'response_time', type: 'text', label: t('Response Time') }
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
            { name: 'open_time', type: 'time', label: t('Start Time') },
            { name: 'close_time', type: 'time', label: t('End Time') },
            { name: 'is_closed', type: 'checkbox', label: t('Closed') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Schedule Service'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'estimate_note', type: 'textarea', label: t('Free Estimate Note') }
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
            { name: 'service_type', type: 'text', label: t('Service Type') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'google_map',
      name: t('Service Area'),
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
  ],
  colorPresets: [
    { name: 'Tool Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', background: '#F8FAFC', text: '#1E293B', cardBg: '#FFFFFF' },
    { name: 'Safety Orange', primary: '#EA580C', secondary: '#FB923C', accent: '#FED7AA', background: '#FFF7ED', text: '#1C1917', cardBg: '#FFFFFF' },
    { name: 'Work Green', primary: '#059669', secondary: '#10b77f', accent: '#D1FAE5', background: '#F0FDF4', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Steel Gray', primary: '#6B7280', secondary: '#9CA3AF', accent: '#F3F4F6', background: '#F9FAFB', text: '#111827', cardBg: '#FFFFFF' },
    { name: 'Electric Yellow', primary: '#D97706', secondary: '#F59E0B', accent: '#FEF3C7', background: '#FFFBEB', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Plumber Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FFFBFB', text: '#1F2937', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,700' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#DBEAFE',
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#CBD5E1'
  },
  defaultFont: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'professional',
    headerStyle: 'reliable',
    cardStyle: 'clean',
    buttonStyle: 'solid',
    iconStyle: 'filled',
    spacing: 'structured',
    shadows: 'professional',
    animations: 'steady'
  },
  defaultData: {
    header: {
      name: 'ProFix Home Services',
      title: 'Professional Home Maintenance & Repair',
      tagline: 'Reliable, licensed professionals for all your home service needs',
      profile_image: '',
      badge_1: 'Licensed',
      badge_2: 'Insured',
      badge_3: '24/7'
    },
    contact: {
      email: 'service@profix.com',
      phone: '+1 (555) FIX-HOME',
      website: 'https://profix.com',
      location: 'Metro Area & Suburbs'
    },
    about: {
      description: 'Licensed and insured home service professionals with over 15 years of experience. We provide reliable, quality workmanship for all your home maintenance and repair needs.',
      specialties: 'Plumbing, Electrical, HVAC, Handyman, Appliance Repair, Emergency Services',
      experience: '15'
    },
    services: {
      service_list: [
        { title: 'Plumbing Services', description: 'Leak repairs, pipe installation, drain cleaning', price: 'From $89', emergency: true },
        { title: 'Electrical Work', description: 'Wiring, outlets, lighting, panel upgrades', price: 'From $125', emergency: true },
        { title: 'HVAC Services', description: 'AC repair, heating, duct cleaning, maintenance', price: 'From $99', emergency: false },
        { title: 'General Handyman', description: 'Home repairs, installations, maintenance tasks', price: 'From $75', emergency: false }
      ]
    },
    certifications: {
      cert_list: [
        { title: 'Licensed Contractor', number: 'LIC-123456', expiry: '2025-12-31' },
        { title: 'Insured & Bonded', number: 'INS-789012', expiry: '2025-06-30' },
        { title: 'EPA Certified', number: 'EPA-345678', expiry: '2026-03-15' }
      ]
    },
    emergency_info: {
      emergency_phone: '+1 (555) 911-HELP',
      emergency_hours: '24/7 Emergency Service',
      response_time: 'Within 2 hours'
    },
    social: {
      social_links: [
        { platform: 'google', url: 'https://business.google.com/profix' },
        { platform: 'yelp', url: 'https://yelp.com/profix' },
        { platform: 'facebook', url: 'https://facebook.com/profix' },
        { platform: 'youtube', url: 'https://youtube.com/profix' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Kitchen Renovation Timelapse', description: 'Watch a full kitchen renovation project from demolition to the final reveal.', video_type: 'how_to_tips', embed_url: 'https://www.youtube.com/watch?v=Yj4y7blPKNc', thumbnail: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80', duration: '8:30' },
        { title: 'Complete Home Service Project Walkthrough', description: 'A start-to-finish walkthrough of a residential improvement project showing planning, repairs, and finishing work.', video_type: 'emergency_response', embed_url: 'https://www.youtube.com/watch?v=poJVAM_p39c', thumbnail: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80', duration: '4:15' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/profix',
      channel_name: 'ProFix Home Services',
      subscriber_count: '19.4K',
      featured_playlist: 'https://youtube.com/playlist?list=PLhometips',
      latest_video_embed: 'https://www.youtube.com/watch?v=poJVAM_p39c',
      channel_description: 'Home maintenance tips, repair tutorials, and service demonstrations from licensed professionals. Subscribe for weekly home improvement content!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '07:00', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '16:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://profix.com/schedule',
      estimate_note: 'Free estimates on all major repairs and installations'
    },
    testimonials: {
      reviews: [
        { client_name: 'Mike Johnson', review: 'Excellent plumbing work! Fixed our leak quickly and professionally. Highly recommend ProFix.', rating: '5', service_type: 'Plumbing' },
        { client_name: 'Sarah Davis', review: 'Great electrical work installing new outlets. Clean, professional, and reasonably priced.', rating: '5', service_type: 'Electrical' },
        { client_name: 'Robert Chen', review: 'Emergency HVAC repair on a weekend. They came out quickly and got our heat working again.', rating: '5', service_type: 'HVAC' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Dallas%20TX&z=12&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Dallas+TX'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/thumbtack-find-a-service/id852703300',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.thumbtack.consumer'
    },
    contact_form: {
      form_title: 'Request Free Estimate',
      form_description: 'Get a free estimate for your home service needs. Licensed professionals ready to help.'
    },
    thank_you: {
      message: 'Thank you for choosing ProFix! We\'ll contact you within 2 hours to schedule your service.'
    },
    action_buttons: {
      contact_button_text: 'Get Free Estimate',
      appointment_button_text: 'Schedule Service',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'ProFix Home Services | Plumbing, Electrical, HVAC, and Repairs',
      meta_description: 'Licensed and insured home service professionals for repairs, maintenance, and emergency calls.',
      keywords: 'home services, plumbing, electrical, hvac, handyman, emergency repair',
      og_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="service-highlights"><h4>Why Choose ProFix?</h4><p>🔧 Licensed & Insured Professionals</p><p>⏰ Same-Day Service Available</p><p>💰 Upfront Pricing - No Hidden Fees</p><p>🔄 100% Satisfaction Guarantee</p></div>',
      section_title: 'Service Guarantee',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Quick Contact for Service',
      qr_description: 'Scan to save our contact info and request service anytime!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 ProFix Home Services. Licensed & Insured.'
    }
  }
};
