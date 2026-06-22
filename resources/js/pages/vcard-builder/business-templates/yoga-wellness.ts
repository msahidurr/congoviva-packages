import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const yogaWellnessTemplate = {
  name: t('Yoga & Wellness Studio'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Instructor Name') },
        { name: 'title', type: 'text', label: t('Wellness Title') },
        { name: 'tagline', type: 'textarea', label: t('Mindful Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile Photo') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Studio Website') },
        { name: 'location', type: 'text', label: t('Studio Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Wellness Journey') },
        { name: 'certifications', type: 'tags', label: t('Certifications') },
        { name: 'experience', type: 'number', label: t('Years of Practice') },
        { name: 'philosophy', type: 'textarea', label: t('Wellness Philosophy') }
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
          label: t('Wellness Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Service Description') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'type', type: 'select', label: t('Service Type'), options: [
              { value: 'yoga', label: t('Yoga Class') },
              { value: 'meditation', label: t('Meditation') },
              { value: 'wellness', label: t('Wellness Coaching') },
              { value: 'retreat', label: t('Retreat') },
              { value: 'workshop', label: t('Workshop') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Yoga Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Wellness Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'yoga_flow', label: t('Yoga Flow Practice') },
              { value: 'meditation_guide', label: t('Guided Meditation') },
              { value: 'wellness_tips', label: t('Wellness Tips') },
              { value: 'breathing_exercise', label: t('Breathing Exercise') },
              { value: 'philosophy_talk', label: t('Yoga Philosophy') },
              { value: 'student_journey', label: t('Student Journey') }
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
      key: 'class_schedule',
      name: t('Class Schedule'),
      fields: [
        {
          name: 'classes',
          type: 'repeater',
          label: t('Weekly Classes'),
          fields: [
            { name: 'class_name', type: 'text', label: t('Class Name') },
            { name: 'day', type: 'select', label: t('Day'), options: [
              { value: 'monday', label: t('Monday') },
              { value: 'tuesday', label: t('Tuesday') },
              { value: 'wednesday', label: t('Wednesday') },
              { value: 'thursday', label: t('Thursday') },
              { value: 'friday', label: t('Friday') },
              { value: 'saturday', label: t('Saturday') },
              { value: 'sunday', label: t('Sunday') }
            ]},
            { name: 'time', type: 'text', label: t('Time') },
            { name: 'level', type: 'select', label: t('Level'), options: [
              { value: 'beginner', label: t('Beginner') },
              { value: 'intermediate', label: t('Intermediate') },
              { value: 'advanced', label: t('Advanced') },
              { value: 'all-levels', label: t('All Levels') }
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
          label: t('Studio Hours'),
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
        { name: 'booking_url', type: 'url', label: t('Class Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'booking_note', type: 'textarea', label: t('Booking Instructions') }
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
          label: t('Student Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Student Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'transformation', type: 'textarea', label: t('Transformation Story') }
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
    { name: 'Zen Garden', primary: '#8FBC8F', secondary: '#98D8C8', accent: '#F7DC6F', background: '#F8F8F0', text: '#2F4F4F', cardBg: '#FFFFFF' },
    { name: 'Lotus Bloom', primary: '#DDA0DD', secondary: '#E6E6FA', accent: '#FFB6C1', background: '#FFF8DC', text: '#4B0082', cardBg: '#FFFFFF' },
    { name: 'Ocean Calm', primary: '#20B2AA', secondary: '#87CEEB', accent: '#F0E68C', background: '#F0F8FF', text: '#2F4F4F', cardBg: '#FFFFFF' },
    { name: 'Sunset Peace', primary: '#CD853F', secondary: '#DEB887', accent: '#F4A460', background: '#FFF8DC', text: '#8B4513', cardBg: '#FFFFFF' },
    { name: 'Forest Harmony', primary: '#228B22', secondary: '#90EE90', accent: '#ADFF2F', background: '#F0FFF0', text: '#006400', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Lora', value: 'Lora, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Merriweather', value: 'Merriweather, Georgia, serif', weight: '300,400,700' },
    { name: 'Playfair Display', value: 'Playfair Display, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Source Serif Pro', value: 'Source Serif Pro, Georgia, serif', weight: '400,600,700' },
    { name: 'Crimson Text', value: 'Crimson Text, Georgia, serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#8FBC8F',
    secondary: '#98D8C8',
    accent: '#F7DC6F',
    background: '#F8F8F0',
    text: '#2F4F4F',
    cardBg: '#FFFFFF',
    borderColor: '#E0E0E0',
    shadowColor: 'rgba(143, 188, 143, 0.3)'
  },
  defaultFont: 'Lora, Georgia, serif',
  themeStyle: {
    layout: 'zen-flow',
    headerStyle: 'mandala-circle',
    cardStyle: 'organic-curves',
    buttonStyle: 'zen-rounded',
    iconStyle: 'nature',
    spacing: 'breathing-room',
    shadows: 'soft-glow',
    animations: 'gentle-float',
    backgroundPattern: 'lotus-petals',
    typography: 'mindful-serif'
  },
  defaultData: {
    header: {
      name: 'Serenity Moon',
      title: 'Certified Yoga Instructor & Wellness Coach',
      tagline: 'Guiding you on a journey to inner peace, strength, and mindful living',
      profile_image: ''
    },
    contact: {
      email: 'namaste@serenitymoon.yoga',
      phone: '+1 (555) 345-6789',
      website: 'https://serenitymoon.yoga',
      location: 'Peaceful Valley, CA'
    },
    about: {
      description: 'With 10+ years of dedicated practice and teaching, I help individuals discover their inner strength through yoga, meditation, and holistic wellness practices.',
      certifications: 'RYT-500, Meditation Teacher, Reiki Master, Ayurveda Practitioner',
      experience: '10',
      philosophy: 'Yoga is not about touching your toes. It is about what you learn on the way down.'
    },
    services: {
      service_list: [
        { title: 'Hatha Yoga Classes', description: 'Gentle, slow-paced yoga focusing on basic postures and breathing', duration: '60 minutes', price: '$25', type: 'yoga' },
        { title: 'Vinyasa Flow', description: 'Dynamic sequences linking breath with movement', duration: '75 minutes', price: '$30', type: 'yoga' },
        { title: 'Meditation Sessions', description: 'Guided meditation for stress relief and mindfulness', duration: '30 minutes', price: '$20', type: 'meditation' },
        { title: 'Wellness Coaching', description: 'Personalized holistic wellness guidance', duration: '90 minutes', price: '$80', type: 'wellness' }
      ]
    },
    videos: {
      video_list: [
        { title: '20-Minute Morning Flow for Beginners', description: 'Gentle yoga sequence to start your day with intention and energy', video_type: 'yoga_flow', embed_url: 'https://youtu.be/v7AYKMP6rOE?si=YqFBRHbLFkFpFqHm', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', duration: '20:15' },
        { title: 'Guided Meditation for Stress Relief', description: 'Calming meditation practice to release tension and find inner peace', video_type: 'meditation_guide', embed_url: 'https://youtu.be/inpok4MKVLM?si=Hy0Z1234abcdEFGH', thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80', duration: '15:30' },
        { title: 'Breathing Techniques for Anxiety', description: 'Simple pranayama exercises to calm the mind and nervous system', video_type: 'breathing_exercise', embed_url: 'https://youtu.be/tybOi4hjZFQ?si=Xk9Z5678ijklMNOP', thumbnail: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80', duration: '12:45' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/serenitymoon',
      channel_name: 'Serenity Moon Yoga',
      subscriber_count: '67.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLyogaflows',
      latest_video_embed: 'https://youtu.be/v7AYKMP6rOE?si=YqFBRHbLFkFpFqHm',
      channel_description: 'Free yoga classes, guided meditations, and wellness wisdom for your journey to inner peace. New videos every Tuesday and Friday!'
    },
    class_schedule: {
      classes: [
        { class_name: 'Morning Flow', day: 'monday', time: '7:00 AM', level: 'all-levels' },
        { class_name: 'Gentle Hatha', day: 'wednesday', time: '6:00 PM', level: 'beginner' },
        { class_name: 'Power Vinyasa', day: 'friday', time: '7:30 AM', level: 'intermediate' },
        { class_name: 'Restorative Yoga', day: 'sunday', time: '5:00 PM', level: 'all-levels' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/serenitymoon.yoga', username: '@serenitymoon.yoga' },
        { platform: 'youtube', url: 'https://youtube.com/serenitymoon', username: 'Serenity Moon Yoga' },
        { platform: 'facebook', url: 'https://facebook.com/serenitymoon.yoga', username: 'Serenity Moon Yoga' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'tuesday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'wednesday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'thursday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'friday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'sunday', open_time: '08:00', close_time: '18:00', is_closed: false }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/serenitymoon',
      calendar_link: 'https://calendar.google.com/serenitymoon',
      booking_note: 'Please arrive 10 minutes early. Bring your own mat or rent one at the studio.'
    },
    testimonials: {
      reviews: [
        { client_name: 'Emma Thompson', review: 'Serenity\'s classes have transformed my relationship with stress and anxiety. Her gentle guidance creates a safe space for growth.', rating: '5', transformation: 'Found inner peace and improved flexibility' },
        { client_name: 'David Chen', review: 'The meditation sessions have been life-changing. I sleep better and feel more centered in my daily life.', rating: '5', transformation: 'Better sleep and mental clarity' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Ojai%20CA&z=13&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Ojai+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/calm/id571800810',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.calm.android'
    },
    contact_form: {
      form_title: 'Begin Your Wellness Journey',
      form_description: 'Ready to start your path to inner peace and wellness? Reach out and let\'s explore how yoga and mindfulness can transform your life.'
    },
    thank_you: {
      message: 'Namaste! Thank you for reaching out. I\'ll respond within 24 hours to help you begin your wellness journey.'
    },
    action_buttons: {
      contact_button_text: 'Begin Your Journey',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'Serenity Moon Yoga | Yoga, Meditation, and Wellness Coaching',
      meta_description: 'Guided yoga classes, meditation sessions, and holistic wellness support for a more peaceful life.',
      keywords: 'yoga instructor, meditation, wellness coach, mindfulness, vinyasa, hatha yoga',
      og_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="wellness-quote"><h4>Daily Inspiration</h4><p>"The body benefits from movement, and the mind benefits from stillness."</p></div>',
      section_title: 'Mindful Moments',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with Serenity Moon',
      qr_description: 'Scan this QR code to access our yoga studio information and class schedules.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Serenity Moon Yoga Studio. All rights reserved.'
    }
  }
};
