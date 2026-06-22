import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const personalTrainerTemplate = {
  name: t('Personal Trainer & Fitness Coach'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Trainer Name') },
        { name: 'title', type: 'text', label: t('Specialty') },
        { name: 'tagline', type: 'textarea', label: t('Motivation Quote') },
        { name: 'profile_image', type: 'file', label: t('Profile Photo') },
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
        { name: 'location', type: 'text', label: t('Training Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me') },
        { name: 'specialties', type: 'tags', label: t('Training Specialties') },
        { name: 'experience', type: 'number', label: t('Years of Experience') }
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Training Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Training Programs'),
          fields: [
            { name: 'title', type: 'text', label: t('Program Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Session Duration') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'achievements',
      name: t('Achievements & Certifications'),
      fields: [
        {
          name: 'achievement_list',
          type: 'repeater',
          label: t('Certifications & Awards'),
          fields: [
            { name: 'title', type: 'text', label: t('Achievement/Certification') },
            { name: 'organization', type: 'text', label: t('Organization') },
            { name: 'year', type: 'text', label: t('Year') }
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
              { value: 'client_success', label: t('Client Success Story') },
              { value: 'motivation', label: t('Motivational Content') },
              { value: 'form_correction', label: t('Form & Technique') }
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
      key: 'transformation_stories',
      name: t('Success Stories'),
      fields: [
        {
          name: 'stories',
          type: 'repeater',
          label: t('Client Transformations'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'result', type: 'text', label: t('Achievement') },
            { name: 'timeframe', type: 'text', label: t('Timeframe') },
            { name: 'before_after', type: 'file', label: t('Before/After Photo') }
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
      name: t('Training Schedule'),
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
            { name: 'is_closed', type: 'checkbox', label: t('Not Available') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Book Training'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'consultation_note', type: 'textarea', label: t('Free Consultation Note') }
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
            { name: 'program', type: 'text', label: t('Training Program') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'google_map',
      name: t('Training Location'),
      fields: [
        { name: 'map_embed_url', type: 'textarea', label: t('Google Maps Embed URL') },
        { name: 'directions_url', type: 'url', label: t('Google Maps Directions URL') }
      ],
      required: false
    },
    {
      key: 'app_download',
      name: t('Fitness App'),
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
    { name: 'Energy Orange', primary: '#EA580C', secondary: '#FB923C', accent: '#FED7AA', background: '#FFF7ED', text: '#1C1917', cardBg: '#FFFFFF' },
    { name: 'Power Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FFFBFB', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Strength Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', background: '#F8FAFC', text: '#1E293B', cardBg: '#FFFFFF' },
    { name: 'Vitality Green', primary: '#059669', secondary: '#10b77f', accent: '#D1FAE5', background: '#F0FDF4', text: '#1F2937', cardBg: '#FFFFFF' },
    { name: 'Muscle Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#E0E7FF', background: '#F8FAFC', text: '#374151', cardBg: '#FFFFFF' },
    { name: 'Cardio Pink', primary: '#DB2777', secondary: '#EC4899', accent: '#FCE7F3', background: '#FDF2F8', text: '#1F2937', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#EA580C',
    secondary: '#FB923C',
    accent: '#FED7AA',
    background: '#FFF7ED',
    text: '#1C1917',
    cardBg: '#FFFFFF',
    borderColor: '#FDBA74'
  },
  defaultFont: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'energetic',
    headerStyle: 'motivational',
    cardStyle: 'dynamic',
    buttonStyle: 'bold',
    iconStyle: 'filled',
    spacing: 'active',
    shadows: 'strong',
    animations: 'energetic'
  },
  defaultData: {
    header: {
      name: 'Alex Fitness',
      title: 'Certified Personal Trainer & Nutrition Coach',
      tagline: 'Transform your body, transform your life. Let\'s achieve your fitness goals together!',
      profile_image: '',
      badge_1: 'Transform',
      badge_2: 'Achieve',
      badge_3: 'Succeed'
    },
    contact: {
      email: 'train@alexfitness.com',
      phone: '+1 (555) GET-STRONG',
      website: 'https://alexfitness.com',
      location: 'Downtown Gym & Online'
    },
    about: {
      description: 'Certified personal trainer with 8 years of experience helping clients achieve their fitness goals. Specializing in strength training, weight loss, and lifestyle transformation.',
      specialties: 'Weight Loss, Strength Training, HIIT, Nutrition Coaching, Body Transformation',
      experience: '8'
    },
    services: {
      service_list: [
        { title: '1-on-1 Personal Training', description: 'Customized workout plans with personal attention', price: '$80/session', duration: '60 minutes' },
        { title: 'Small Group Training', description: 'Train with friends in groups of 2-4 people', price: '$45/person', duration: '45 minutes' },
        { title: 'Online Coaching', description: 'Virtual training sessions and meal planning', price: '$150/month', duration: 'Ongoing' },
        { title: 'Nutrition Consultation', description: 'Personalized meal plans and nutrition guidance', price: '$120', duration: '90 minutes' }
      ]
    },
    achievements: {
      achievement_list: [
        { title: 'NASM Certified Personal Trainer', organization: 'National Academy of Sports Medicine', year: '2020' },
        { title: 'Precision Nutrition Level 1', organization: 'Precision Nutrition', year: '2021' },
        { title: 'Trainer of the Year Award', organization: 'FitLife Gym', year: '2023' }
      ]
    },
    transformation_stories: {
      stories: [
        { client_name: 'Sarah M.', result: 'Lost 35 lbs, gained confidence', timeframe: '6 months', before_after: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=80' },
        { client_name: 'Mike T.', result: 'Built 15 lbs muscle, improved strength', timeframe: '4 months', before_after: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80' },
        { client_name: 'Jennifer L.', result: 'Completed first marathon', timeframe: '8 months', before_after: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/alexfitness', username: '@alexfitness' },
        { platform: 'tiktok', url: 'https://tiktok.com/@alexfitness', username: '@alexfitness' },
        { platform: 'youtube', url: 'https://youtube.com/alexfitness', username: 'Alex Fitness' }
      ]
    },
    videos: {
      video_list: [
        { title: '20-Minute HIIT Fat Burning Workout', description: 'High-intensity workout you can do anywhere with no equipment needed.', video_type: 'workout_demo', embed_url: 'https://www.youtube.com/watch?v=4jec4Eh9BRY', thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80', duration: '20:15' },
        { title: 'Perfect Push-Up Form Tutorial', description: 'Master the push-up with proper form and technique for better strength training results.', video_type: 'exercise_tutorial', embed_url: 'https://www.youtube.com/watch?v=LTGxBXGXuwc', thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', duration: '5:30' },
        { title: 'Sarah\'s 30lb Weight Loss Journey', description: 'Follow Sarah\'s inspiring body transformation story and the coaching strategies that helped her succeed.', video_type: 'client_success', embed_url: 'https://www.youtube.com/watch?v=2XFfgeHxX-Y', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', duration: '8:45' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/alexfitness',
      channel_name: 'Alex Fitness',
      subscriber_count: '156K',
      featured_playlist: 'https://youtube.com/playlist?list=PLworkoutvideos',
      latest_video_embed: 'https://www.youtube.com/watch?v=4jec4Eh9BRY',
      channel_description: 'Free workout videos, nutrition tips, and fitness motivation from a certified personal trainer. New videos every Monday, Wednesday, and Friday!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'tuesday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'wednesday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'thursday', open_time: '06:00', close_time: '20:00', is_closed: false },
        { day: 'friday', open_time: '06:00', close_time: '19:00', is_closed: false },
        { day: 'saturday', open_time: '07:00', close_time: '17:00', is_closed: false },
        { day: 'sunday', open_time: '08:00', close_time: '16:00', is_closed: false }
      ]
    },
    appointments: {
      booking_url: 'https://alexfitness.com/book',
      consultation_note: 'Free 30-minute consultation for all new clients to discuss your fitness goals'
    },
    testimonials: {
      reviews: [
        { client_name: 'Emma Wilson', review: 'Alex helped me lose 30 pounds and feel stronger than ever! His motivation and expertise are unmatched.', rating: '5', program: 'Weight Loss Program' },
        { client_name: 'David Chen', review: 'Best trainer I\'ve ever worked with. Knowledgeable, patient, and really cares about your progress.', rating: '5', program: 'Strength Training' },
        { client_name: 'Lisa Rodriguez', review: 'The nutrition coaching changed my relationship with food completely. Highly recommend Alex!', rating: '5', program: 'Nutrition Coaching' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Equinox%20Soho%20New%20York%20NY&z=15&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Equinox+Soho+New+York+NY'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/nike-training-club-wellness/id301521403',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.nike.ntc'
    },
    contact_form: {
      form_title: 'Start Your Transformation',
      form_description: 'Ready to change your life? Contact me for a free consultation and let\'s create your personalized fitness plan.'
    },
    thank_you: {
      message: 'Thank you for taking the first step! I\'ll contact you within 24 hours to schedule your free consultation.'
    },
    action_buttons: {
      contact_button_text: 'Transform Your Life',
      appointment_button_text: 'Book Free Consultation',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'Alex Fitness | Personal Training and Nutrition Coaching',
      meta_description: 'Personal training, weight loss coaching, HIIT, strength training, and nutrition support tailored to your goals.',
      keywords: 'personal trainer, fitness coach, nutrition coaching, hiit, strength training, weight loss',
      og_image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="fitness-stats"><h4>Training Results</h4><p>💪 500+ Clients Transformed</p><p>🏆 8 Years Experience</p><p>📈 95% Success Rate</p><p>🎆 Award-Winning Trainer</p></div>',
      section_title: 'Proven Results',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Start Your Fitness Journey',
      qr_description: 'Scan to connect and begin your transformation today!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Alex Fitness. Transform Your Life.'
    }
  }
};
