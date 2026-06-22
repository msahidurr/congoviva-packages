import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const fitnessTemplate = {
  name: t('Fitness Trainer'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'motivational_quote', type: 'text', label: t('Motivational Quote') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') },
        { name: 'cover_image', type: 'file', label: t('Cover Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me') },
        { name: 'experience', type: 'number', label: t('Years of Experience') },
        { name: 'specialties', type: 'tags', label: t('Specialties') },
        { name: 'certifications', type: 'tags', label: t('Certifications') }
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
        { name: 'location', type: 'text', label: t('Gym/Studio Location') }
      ],
      required: true
    },
    {
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Training Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'dumbbell', label: t('Dumbbell') },
              { value: 'running', label: t('Running') },
              { value: 'yoga', label: t('Yoga') },
              { value: 'nutrition', label: t('Nutrition') },
              { value: 'group', label: t('Group Training') },
              { value: 'personal', label: t('Personal Training') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'transformation',
      name: t('Transformations'),
      fields: [
        {
          name: 'gallery',
          type: 'repeater',
          label: t('Client Transformations'),
          fields: [
            { name: 'title', type: 'text', label: t('Client Name') },
            { name: 'before_image', type: 'file', label: t('Before Image') },
            { name: 'after_image', type: 'file', label: t('After Image') },
            { name: 'description', type: 'textarea', label: t('Transformation Story') },
            { name: 'duration', type: 'text', label: t('Time Period') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Training Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Fitness Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'workout_demo', label: t('Workout Demonstration') },
              { value: 'exercise_tutorial', label: t('Exercise Tutorial') },
              { value: 'nutrition_tips', label: t('Nutrition Tips') },
              { value: 'client_transformation', label: t('Client Transformation') },
              { value: 'motivational', label: t('Motivational Content') },
              { value: 'form_correction', label: t('Form & Technique') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'difficulty_level', type: 'select', label: t('Difficulty Level'), options: [
              { value: 'beginner', label: t('Beginner') },
              { value: 'intermediate', label: t('Intermediate') },
              { value: 'advanced', label: t('Advanced') },
              { value: 'all_levels', label: t('All Levels') }
            ]}
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
      key: 'programs',
      name: t('Training Programs'),
      fields: [
        {
          name: 'program_list',
          type: 'repeater',
          label: t('Programs'),
          fields: [
            { name: 'title', type: 'text', label: t('Program Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'level', type: 'select', label: t('Difficulty Level'), options: [
              { value: 'beginner', label: t('Beginner') },
              { value: 'intermediate', label: t('Intermediate') },
              { value: 'advanced', label: t('Advanced') },
              { value: 'all', label: t('All Levels') }
            ]},
            { name: 'price', type: 'text', label: t('Price') }
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
      name: t('Business Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Training Hours'),
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
            { name: 'is_closed', type: 'checkbox', label: t('Not Available') }
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
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'consultation_text', type: 'text', label: t('Free Consultation Text') }
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
            { name: 'client_image', type: 'file', label: t('Client Image') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'goal_achieved', type: 'text', label: t('Goal Achieved') }
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
  ],
  colorPresets: [
    { name: 'Energy Red', primary: '#FF4136', secondary: '#FF725C', accent: '#FFCEC9', background: '#FFFFFF', text: '#333333' },
    { name: 'Power Blue', primary: '#0074D9', secondary: '#7FDBFF', accent: '#E3F2FD', background: '#F5F7FA', text: '#333333' },
    { name: 'Vitality Green', primary: '#2ECC40', secondary: '#01FF70', accent: '#E8F5E9', background: '#FFFFFF', text: '#333333' },
    { name: 'Strength Black', primary: '#111111', secondary: '#333333', accent: '#F5F5F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Fitness Orange', primary: '#FF851B', secondary: '#FFC300', accent: '#FFF3E0', background: '#FFFFFF', text: '#333333' },
    { name: 'Muscle Purple', primary: '#B10DC9', secondary: '#E066FF', accent: '#F3E5F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Cardio Pink', primary: '#FF4081', secondary: '#FF80AB', accent: '#FCE4EC', background: '#FFFFFF', text: '#333333' },
    { name: 'Endurance Teal', primary: '#39CCCC', secondary: '#7FDBFF', accent: '#E0F7FA', background: '#FFFFFF', text: '#333333' },
    { name: 'Gym Dark', primary: '#001f3f', secondary: '#0074D9', accent: '#E3F2FD', background: '#F5F7FA', text: '#333333' },
    { name: 'Wellness Mint', primary: '#3D9970', secondary: '#2ECC40', accent: '#E8F5E9', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '400,500,600,700,800' },
    { name: 'Roboto Condensed', value: 'Roboto Condensed, sans-serif', weight: '400,700' },
    { name: 'Oswald', value: 'Oswald, sans-serif', weight: '400,500,600,700' },
    { name: 'Bebas Neue', value: 'Bebas Neue, cursive', weight: '400' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '400,500,600,700,800' }
  ],
  defaultColors: {
    primary: '#FF4136',
    secondary: '#FF725C',
    accent: '#FFCEC9',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    highlightColor: '#FFD700'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'fitness-layout',
    headerStyle: 'dynamic',
    cardStyle: 'fitness-card',
    buttonStyle: 'rounded-full',
    iconStyle: 'fitness',
    spacing: 'comfortable',
    shadows: 'soft',
    animations: 'energetic',
    backgroundPattern: 'fitness-pattern',
    progressBars: true,
    motivationalQuotes: true
  },
  defaultData: {
    header: {
      name: 'Alex Fitness',
      title: 'Certified Personal Trainer',
      tagline: 'Transform your body, transform your life',
      motivational_quote: 'TRANSFORM YOUR BODY, TRANSFORM YOUR LIFE',
      profile_image: '',
      cover_image: ''
    },
    about: {
      description: 'With over 8 years of experience in personal training and nutrition coaching, I help clients achieve their fitness goals through personalized workout plans and dietary guidance. My approach focuses on sustainable lifestyle changes rather than quick fixes.',
      experience: '8',
      specialties: 'Weight Loss, Muscle Building, HIIT, Nutrition Planning, Functional Training',
      certifications: 'NASM CPT, ACE Nutrition Specialist, CrossFit Level 2, First Aid/CPR'
    },
    contact: {
      email: 'alex@fitnesstrainer.com',
      phone: '+1 (555) 987-6543',
      website: 'https://alexfitness.com',
      location: 'Powerhouse Gym, 123 Fitness Ave, New York, NY'
    },
    services: {
      service_list: [
        { title: 'Personal Training', description: 'One-on-one customized training sessions tailored to your specific goals and fitness level', price: '$75', duration: '60 min', icon: 'personal' },
        { title: 'Group Classes', description: 'High-energy group workouts that combine strength training and cardio for maximum results', price: '$25', duration: '45 min', icon: 'group' },
        { title: 'Nutrition Coaching', description: 'Personalized meal plans and nutritional guidance to complement your fitness routine', price: '$150', duration: 'Monthly', icon: 'nutrition' },
        { title: 'Online Training', description: 'Remote coaching with weekly check-ins, custom workouts and video feedback', price: '$200', duration: 'Monthly', icon: 'personal' }
      ]
    },
    transformation: {
      gallery: [
        {
          title: 'Sarah M.',
          before_image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
          after_image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
          description: 'Lost 30 pounds and gained confidence through consistent training and nutrition guidance',
          duration: '6 months'
        },
        {
          title: 'Mike T.',
          before_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80',
          after_image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=900&q=80',
          description: 'Gained 15 pounds of muscle and improved overall strength with personalized strength training program',
          duration: '4 months'
        }
      ]
    },
    programs: {
      program_list: [
        { title: '8-Week Fat Loss Program', description: 'Comprehensive program combining HIIT workouts, strength training, and nutrition guidance for maximum fat loss', duration: '8 weeks', level: 'all', price: '$399' },
        { title: 'Muscle Building Blueprint', description: 'Strategic training and nutrition plan designed to build lean muscle mass and increase strength', duration: '12 weeks', level: 'intermediate', price: '$499' },
        { title: 'Total Body Transformation', description: 'Complete lifestyle overhaul with training, nutrition, and accountability coaching', duration: '16 weeks', level: 'all', price: '$799' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/alexfitness', username: 'alexfitness' },
        { platform: 'youtube', url: 'https://youtube.com/alexfitness', username: 'Alex Fitness' },
        { platform: 'tiktok', url: 'https://tiktok.com/@alexfitness', username: '@alexfitness' },
        { platform: 'facebook', url: 'https://facebook.com/alexfitness', username: 'Alex Fitness' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Perfect Push-Up Form Tutorial', description: 'Master the push-up with proper form and technique for maximum results', video_type: 'exercise_tutorial', embed_url: 'https://www.youtube.com/watch?v=LTGxBXGXuwc', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', duration: '5:30', difficulty_level: 'beginner' },
        { title: '20-Minute HIIT Fat Burning Workout', description: 'High-intensity workout you can do anywhere - no equipment needed', video_type: 'workout_demo', embed_url: 'https://www.youtube.com/watch?v=4jec4Eh9BRY', thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80', duration: '20:15', difficulty_level: 'intermediate' },
        { title: 'Sarah\'s 30lb Weight Loss Journey', description: 'Follow Sarah\'s incredible transformation and the strategies that worked', video_type: 'client_transformation', embed_url: 'https://www.youtube.com/watch?v=2XFfgeHxX-Y', thumbnail: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=900&q=80', duration: '8:45', difficulty_level: 'all_levels' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/alexfitness',
      channel_name: 'Alex Fitness',
      subscriber_count: '127K',
      featured_playlist: 'https://youtube.com/playlist?list=PLbeginnerfriendly',
      latest_video_embed: 'https://www.youtube.com/watch?v=4jec4Eh9BRY',
      channel_description: 'Free workout tutorials, nutrition tips, and fitness motivation from a certified personal trainer. New videos every Tuesday and Friday!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'tuesday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'wednesday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'thursday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'friday', open_time: '06:00', close_time: '19:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '16:00', is_closed: false },
        { day: 'sunday', open_time: '09:00', close_time: '14:00', is_closed: false }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/alexfitness',
      calendar_link: 'https://calendar.google.com/alexfitness',
      booking_text: 'Book a Training Session',
      consultation_text: 'Get a Free Fitness Assessment'
    },
    testimonials: {
      reviews: [
        { client_name: 'Jennifer L.', client_image: '', review: 'Working with Alex completely changed my relationship with fitness. I\'ve lost 45 pounds and feel stronger than ever!', rating: '5', goal_achieved: 'Weight Loss' },
        { client_name: 'David R.', client_image: '', review: 'Alex\'s personalized approach helped me build muscle and improve my athletic performance. Highly recommended!', rating: '5', goal_achieved: 'Muscle Gain' },
        { client_name: 'Michelle K.', client_image: '', review: 'The nutrition guidance was a game-changer for me. I finally understand how to eat for my goals.', rating: '5', goal_achieved: 'Nutrition Education' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Fitness%20Ave%2C%20New%20York%2C%20NY&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Fitness+Ave+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/nike-training-club-wellness/id301521403',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.nike.ntc',
      app_description: 'Download our fitness app for workout tracking, nutrition tips, and exclusive training content.'
    },
    contact_form: {
      form_title: 'Ready to Start Your Fitness Journey?',
      form_description: 'Fill out the form below to get in touch. I\'ll respond within 24 hours to discuss how we can work together to achieve your fitness goals.'
    },
    thank_you: {
      message: 'Thank you for your interest! I look forward to helping you achieve your fitness goals. I\'ll be in touch shortly to discuss the next steps.'
    },
    action_buttons: {
      contact_button_text: 'Contact Trainer',
      appointment_button_text: 'Book Training Session',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'Alex Fitness | Personal Training and Transformation Coaching',
      meta_description: 'Personal training, fat loss programs, strength coaching, and nutrition guidance with Alex Fitness.',
      keywords: 'personal trainer, fitness coach, HIIT, weight loss, muscle gain, nutrition coaching',
      og_image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Fitness Tips</h4><p>Check out my latest workout tips and nutrition advice.</p></div>',
      section_title: 'Training Resources',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Training',
      qr_description: 'Scan this QR code to share my personal training services with friends.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Alex Fitness. All rights reserved.'
    }
  }
};
