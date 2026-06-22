import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const veterinarianTemplate = {
  name: t('Veterinarian & Animal Care'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Veterinarian Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Care Philosophy') },
        { name: 'profile_image', type: 'file', label: t('Professional Photo') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Clinic Phone') },
        { name: 'website', type: 'url', label: t('Clinic Website') },
        { name: 'location', type: 'text', label: t('Clinic Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Professional Background') },
        { name: 'specialties', type: 'tags', label: t('Veterinary Specialties') },
        { name: 'experience', type: 'number', label: t('Years of Practice') },
        { name: 'education', type: 'textarea', label: t('Education & Certifications') }
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
          label: t('Veterinary Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Service Description') },
            { name: 'animal_types', type: 'tags', label: t('Animal Types') },
            { name: 'price_range', type: 'text', label: t('Price Range') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'animal_care',
      name: t('Animal Care Tips'),
      fields: [
        {
          name: 'care_tips',
          type: 'repeater',
          label: t('Pet Care Tips'),
          fields: [
            { name: 'animal_type', type: 'select', label: t('Animal Type'), options: [
              { value: 'dogs', label: t('Dogs') },
              { value: 'cats', label: t('Cats') },
              { value: 'birds', label: t('Birds') },
              { value: 'rabbits', label: t('Rabbits') },
              { value: 'reptiles', label: t('Reptiles') },
              { value: 'fish', label: t('Fish') },
              { value: 'exotic', label: t('Exotic Pets') }
            ]},
            { name: 'tip_title', type: 'text', label: t('Tip Title') },
            { name: 'tip_description', type: 'textarea', label: t('Care Tip') },
            { name: 'season', type: 'select', label: t('Season'), options: [
              { value: 'all-year', label: t('All Year') },
              { value: 'spring', label: t('Spring') },
              { value: 'summer', label: t('Summer') },
              { value: 'fall', label: t('Fall') },
              { value: 'winter', label: t('Winter') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Pet Care Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Veterinary Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'pet_care_tips', label: t('Pet Care Tips') },
              { value: 'clinic_tour', label: t('Clinic Tour') },
              { value: 'procedure_explanation', label: t('Procedure Explanation') },
              { value: 'pet_health_education', label: t('Pet Health Education') },
              { value: 'success_story', label: t('Pet Success Story') },
              { value: 'emergency_tips', label: t('Emergency Care Tips') }
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
      key: 'emergency',
      name: t('Emergency Care'),
      fields: [
        { name: 'emergency_phone', type: 'tel', label: t('Emergency Phone') },
        { name: 'after_hours_info', type: 'textarea', label: t('After Hours Information') },
        { name: 'emergency_clinic', type: 'text', label: t('Partner Emergency Clinic') },
        { name: 'emergency_tips', type: 'textarea', label: t('Emergency First Aid Tips') }
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
          label: t('Social Platforms'),
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
      name: t('Business Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Clinic Hours'),
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
        { name: 'booking_url', type: 'url', label: t('Appointment Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'appointment_info', type: 'textarea', label: t('Appointment Instructions') }
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
            { name: 'client_name', type: 'text', label: t('Pet Owner Name') },
            { name: 'pet_name', type: 'text', label: t('Pet Name') },
            { name: 'pet_type', type: 'text', label: t('Pet Type') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') }
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
    { name: 'Caring Blue', primary: '#4A90E2', secondary: '#7BB3F0', accent: '#50C878', background: '#F8FBFF', text: '#1A365D', cardBg: '#FFFFFF' },
    { name: 'Gentle Green', primary: '#28A745', secondary: '#34CE57', accent: '#85E085', background: '#F0FFF4', text: '#155724', cardBg: '#FFFFFF' },
    { name: 'Warm Orange', primary: '#FF8C42', secondary: '#FFB366', accent: '#FFE5B4', background: '#FFF8F0', text: '#8B4513', cardBg: '#FFFFFF' },
    { name: 'Calm Purple', primary: '#8A63D2', secondary: '#B19CD9', accent: '#E6E6FA', background: '#FAF8FF', text: '#3D2B56', cardBg: '#FFFFFF' },
    { name: 'Trust Teal', primary: '#20B2AA', secondary: '#48D1CC', accent: '#E0FFFF', background: '#F0FFFF', text: '#2F4F4F', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Lato', value: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,700' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#4A90E2',
    secondary: '#7BB3F0',
    accent: '#50C878',
    background: '#F8FBFF',
    text: '#1A365D',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0',
    shadowColor: 'rgba(74, 144, 226, 0.2)'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'pet-friendly',
    headerStyle: 'veterinary-care',
    cardStyle: 'animal-cards',
    buttonStyle: 'caring-buttons',
    iconStyle: 'animal-icons',
    spacing: 'comfortable-care',
    shadows: 'gentle-glow',
    animations: 'playful-bounce',
    backgroundPattern: 'paw-prints',
    typography: 'friendly-sans'
  },
  defaultData: {
    header: {
      name: 'Dr. Emily Parker',
      title: 'Doctor of Veterinary Medicine',
      tagline: 'Providing compassionate, comprehensive care for your beloved pets with expertise, empathy, and dedication',
      profile_image: ''
    },
    contact: {
      email: 'info@parkerveterinary.com',
      phone: '+1 (555) 890-1234',
      website: 'https://parkerveterinary.com',
      location: 'Austin, TX'
    },
    about: {
      description: 'Dedicated veterinarian with 10+ years of experience providing exceptional care for pets of all sizes. Passionate about preventive medicine, surgery, and building lasting relationships with pet families.',
      specialties: 'Small Animal Medicine, Surgery, Dental Care, Preventive Medicine, Emergency Care',
      experience: '10',
      education: 'DVM from Texas A&M University, Board Certified in Small Animal Practice'
    },
    services: {
      service_list: [
        { title: 'Wellness Exams', description: 'Comprehensive health checkups and preventive care for your pet', animal_types: 'Dogs, Cats, Rabbits', price_range: '$75-150' },
        { title: 'Vaccinations', description: 'Core and non-core vaccines to protect your pet from diseases', animal_types: 'Dogs, Cats, Ferrets', price_range: '$50-200' },
        { title: 'Dental Care', description: 'Professional dental cleaning and oral health maintenance', animal_types: 'Dogs, Cats', price_range: '$300-800' },
        { title: 'Surgery', description: 'Soft tissue and orthopedic surgical procedures', animal_types: 'Dogs, Cats, Small Animals', price_range: '$500-3000' }
      ]
    },
    animal_care: {
      care_tips: [
        { animal_type: 'dogs', tip_title: 'Daily Exercise', tip_description: 'Ensure your dog gets at least 30 minutes of exercise daily to maintain physical and mental health', season: 'all-year' },
        { animal_type: 'cats', tip_title: 'Litter Box Maintenance', tip_description: 'Clean the litter box daily and provide one box per cat plus one extra', season: 'all-year' },
        { animal_type: 'dogs', tip_title: 'Summer Safety', tip_description: 'Never leave your dog in a hot car and provide plenty of water during summer walks', season: 'summer' }
      ]
    },
    videos: {
      video_list: [
        { title: 'How to Brush Your Dog\'s Teeth at Home', description: 'Step-by-step guide to maintaining your dog\'s dental health between vet visits', video_type: 'pet_care_tips', embed_url: 'https://youtu.be/54WroRd1GiA?si=nUE6tdMSu4tg2f15', thumbnail: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80', duration: '6:30' },
        { title: 'Tour Our State-of-the-Art Veterinary Clinic', description: 'See our modern facilities and meet our caring team', video_type: 'clinic_tour', embed_url: 'https://youtu.be/dfmX8ZC57bI?si=dw3N6_xJOf_0mN64', thumbnail: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=900&q=80', duration: '4:45' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/parkerveterinary',
      channel_name: 'Parker Veterinary',
      subscriber_count: '18.4K',
      featured_playlist: 'https://youtube.com/playlist?list=PLpetcaretips',
      latest_video_embed: 'https://youtu.be/54WroRd1GiA?si=nUE6tdMSu4tg2f15',
      channel_description: 'Pet care tips, health education, and veterinary insights from Dr. Emily Parker. Subscribe for weekly pet health advice and educational content!'
    },
    emergency: {
      emergency_phone: '+1 (555) 890-9999',
      after_hours_info: 'For after-hours emergencies, please call our emergency line or visit Austin Emergency Veterinary Clinic',
      emergency_clinic: 'Austin Emergency Veterinary Clinic - (555) 123-HELP',
      emergency_tips: 'Keep your pet calm, apply pressure to bleeding wounds, and contact us immediately for guidance'
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/parkerveterinary', username: 'Parker Veterinary Clinic' },
        { platform: 'instagram', url: 'https://instagram.com/dremilyparker', username: '@dremilyparker' },
        { platform: 'youtube', url: 'https://youtube.com/parkerveterinary', username: 'Parker Veterinary' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '15:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/dremilyparker',
      calendar_link: 'https://calendar.google.com/dremilyparker',
      appointment_info: 'Please bring your pet\'s vaccination records and any medications they are currently taking'
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah Johnson', pet_name: 'Max', pet_type: 'Golden Retriever', review: 'Dr. Parker saved Max\'s life during his emergency surgery. Her expertise and compassion made all the difference. Highly recommend!', rating: '5' },
        { client_name: 'Mike Chen', pet_name: 'Whiskers', pet_type: 'Persian Cat', review: 'Whiskers has been seeing Dr. Parker for 3 years. She\'s gentle, thorough, and always takes time to explain everything. Best vet in Austin!', rating: '5' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Austin%20TX&z=12&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Austin+TX'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/rover-dog-sitters-walkers/id547320928',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.rover.android'
    },
    contact_form: {
      form_title: 'Schedule Your Pet\'s Visit',
      form_description: 'Ready to give your pet the best care possible? Contact us to schedule an appointment or ask any questions about your pet\'s health.'
    },
    action_buttons: {
      contact_button_text: 'Care for Your Pet Today',
      appointment_button_text: 'Book Appointment',
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for trusting us with your pet\'s care! We\'ll respond within 24 hours to schedule your appointment and answer any questions.'
    },    seo: {
      meta_title: 'Parker Veterinary | Compassionate Pet Care in Austin',
      meta_description: 'Preventive care, dental services, surgery, and emergency support for pets from a trusted veterinary team.',
      keywords: 'veterinarian, pet care, dog health, cat health, vet clinic, animal surgery',
      og_image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="pet-care-tips"><h4>Pet Health Tips</h4><p>Essential care advice for your beloved pets.</p></div>',
      section_title: 'Pet Care Resources',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with Dr. Parker',
      qr_description: 'Scan this QR code to access our veterinary clinic information and schedule appointments.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Dr. Emily Parker Veterinary Practice. All rights reserved.'
    }
  }
};
