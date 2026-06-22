import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const gymTemplate = {
  name: t('Fitness Studio'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Gym/Studio Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
        { name: 'hero_image', type: 'file', label: t('Hero Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'members_count', type: 'number', label: t('Members Count') }
      ],
      required: false
    },
    {
      key: 'classes',
      name: t('Fitness Classes'),
      fields: [
        {
          name: 'class_list',
          type: 'repeater',
          label: t('Classes'),
          fields: [
            { name: 'name', type: 'text', label: t('Class Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'level', type: 'select', label: t('Level'), options: [
              { value: 'beginner', label: t('Beginner') },
              { value: 'intermediate', label: t('Intermediate') },
              { value: 'advanced', label: t('Advanced') },
              { value: 'all', label: t('All Levels') }
            ]},
            { name: 'image', type: 'file', label: t('Class Image') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'trainers',
      name: t('Trainers'),
      fields: [
        {
          name: 'trainer_list',
          type: 'repeater',
          label: t('Trainers'),
          fields: [
            { name: 'name', type: 'text', label: t('Trainer Name') },
            { name: 'position', type: 'text', label: t('Position/Specialty') },
            { name: 'bio', type: 'textarea', label: t('Bio') },
            { name: 'image', type: 'file', label: t('Trainer Image') },
            { name: 'certifications', type: 'text', label: t('Certifications') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'membership',
      name: t('Membership Plans'),
      fields: [
        {
          name: 'plan_list',
          type: 'repeater',
          label: t('Plans'),
          fields: [
            { name: 'name', type: 'text', label: t('Plan Name') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'features', type: 'textarea', label: t('Features (comma separated)') },
            { name: 'highlight', type: 'checkbox', label: t('Highlight as Popular') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Gym Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Fitness Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'gym_tour', label: t('Gym Tour') },
              { value: 'class_preview', label: t('Class Preview') },
              { value: 'workout_demo', label: t('Workout Demo') },
              { value: 'member_success', label: t('Member Success Story') },
              { value: 'trainer_spotlight', label: t('Trainer Spotlight') },
              { value: 'equipment_guide', label: t('Equipment Guide') }
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
      key: 'schedule',
      name: t('Class Schedule'),
      fields: [
        {
          name: 'schedule_list',
          type: 'repeater',
          label: t('Schedule Items'),
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
            { name: 'time', type: 'text', label: t('Time') },
            { name: 'class_name', type: 'text', label: t('Class Name') },
            { name: 'trainer', type: 'text', label: t('Trainer') }
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
          label: t('Gym Hours'),
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
      key: 'gallery',
      name: t('Photo Gallery'),
      fields: [
        {
          name: 'photos',
          type: 'repeater',
          label: t('Photos'),
          fields: [
            { name: 'image', type: 'file', label: t('Image') },
            { name: 'caption', type: 'text', label: t('Caption') }
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
          label: t('Member Reviews'),
          fields: [
            { name: 'member_name', type: 'text', label: t('Member Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'achievement', type: 'text', label: t('Achievement') },
            { name: 'member_since', type: 'text', label: t('Member Since') },
            { name: 'image', type: 'file', label: t('Member Image') }
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
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'trial_text', type: 'text', label: t('Free Trial Button Text') }
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
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'booking_button_text', type: 'text', label: t('Book Class Button Text') },
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
    { name: 'Power Orange', primary: '#FF5722', secondary: '#FF7043', accent: '#FBE9E7', background: '#FFFFFF', text: '#333333' },
    { name: 'Energy Red', primary: '#E53935', secondary: '#FF5252', accent: '#FFEBEE', background: '#FFFFFF', text: '#212121' },
    { name: 'Strong Blue', primary: '#1E88E5', secondary: '#42A5F5', accent: '#E3F2FD', background: '#FFFFFF', text: '#212121' },
    { name: 'Muscle Green', primary: '#43A047', secondary: '#66BB6A', accent: '#E8F5E9', background: '#FFFFFF', text: '#212121' },
    { name: 'Beast Purple', primary: '#8E24AA', secondary: '#AB47BC', accent: '#F3E5F5', background: '#FFFFFF', text: '#212121' },
    { name: 'Dark Power', primary: '#5D4037', secondary: '#795548', accent: '#212121', background: '#121212', text: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700,900' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700,800' },
    { name: 'Oswald', value: 'Oswald, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700,800' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '300,400,600,700' }
  ],
  defaultColors: {
    primary: '#FF5722',
    secondary: '#FF7043',
    accent: '#FBE9E7',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F5F5F5',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
  },
  defaultFont: 'Roboto, sans-serif',
  themeStyle: {
    layout: 'fitness-layout',
    headerStyle: 'dynamic',
    cardStyle: 'solid',
    buttonStyle: 'rounded',
    iconStyle: 'bold',
    spacing: 'compact'
  },
  defaultData: {
    header: {
      name: 'PowerFit Studio',
      tagline: 'Transform Your Body, Transform Your Life',
      logo: '',
      hero_image: ''
    },
    about: {
      description: 'PowerFit Studio is a premier fitness facility dedicated to helping you achieve your health and fitness goals. Our state-of-the-art equipment, expert trainers, and diverse class offerings create an environment where everyone from beginners to advanced athletes can thrive. We believe fitness is not just about physical strength but about building a healthier, happier life.',
      year_established: '2015',
      members_count: '1500'
    },
    classes: {
      class_list: [
        { name: 'HIIT', description: 'High-intensity interval training that alternates between intense bursts of activity and fixed periods of less-intense activity or rest.', duration: '45 min', level: 'intermediate', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80' },
        { name: 'Yoga Flow', description: 'A vinyasa-style yoga class linking breath with movement for improved flexibility, strength, and mindfulness.', duration: '60 min', level: 'all', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80' },
        { name: 'Strength Training', description: 'Focus on building muscle and strength using free weights, resistance bands, and weight machines.', duration: '50 min', level: 'all', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80' },
        { name: 'Spin Class', description: 'High-energy indoor cycling workout set to motivating music with varying speeds and resistance levels.', duration: '45 min', level: 'all', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    trainers: {
      trainer_list: [
        { name: 'Alex Johnson', position: 'Head Trainer, Strength Specialist', bio: 'With over 10 years of experience, Alex specializes in strength training and athletic performance. His approach focuses on proper form and progressive overload for maximum results.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', certifications: 'NASM CPT, CSCS, TRX Certified' },
        { name: 'Sarah Chen', position: 'Yoga & Pilates Instructor', bio: 'Sarah brings a holistic approach to fitness, combining traditional yoga practices with modern exercise science. Her classes emphasize mind-body connection and functional movement.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', certifications: 'RYT-500, Pilates Method Alliance Certified' },
        { name: 'Marcus Williams', position: 'HIIT & Cardio Specialist', bio: 'Known for his high-energy classes, Marcus creates challenging workouts that push members to their limits while keeping motivation high and exercises varied.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', certifications: 'ACE CPT, Spinning Certified, CrossFit L2' }
      ]
    },
    membership: {
      plan_list: [
        { name: 'Basic', price: '$49/month', duration: 'Monthly', description: 'Access to gym facilities and basic equipment', features: 'Gym access,Basic equipment,Locker room access', highlight: false },
        { name: 'Premium', price: '$79/month', duration: 'Monthly', description: 'Full access to all facilities and group classes', features: 'All gym access,Unlimited classes,Free towel service,Fitness assessment,Guest passes (2/month)', highlight: true },
        { name: 'Annual', price: '$599/year', duration: 'Yearly', description: 'Our best value plan with two months free', features: 'All Premium features,Two months free,Personal training session (1),Nutrition consultation', highlight: false }
      ]
    },
    schedule: {
      schedule_list: [
        { day: 'monday', time: '6:00 AM', class_name: 'Morning HIIT', trainer: 'Marcus Williams' },
        { day: 'monday', time: '9:00 AM', class_name: 'Yoga Flow', trainer: 'Sarah Chen' },
        { day: 'monday', time: '5:30 PM', class_name: 'Strength Training', trainer: 'Alex Johnson' },
        { day: 'tuesday', time: '7:00 AM', class_name: 'Spin Class', trainer: 'Marcus Williams' },
        { day: 'tuesday', time: '12:00 PM', class_name: 'Lunch Express HIIT', trainer: 'Marcus Williams' },
        { day: 'tuesday', time: '6:30 PM', class_name: 'Evening Yoga', trainer: 'Sarah Chen' }
      ]
    },
    contact: {
      email: 'info@powerfitstudio.com',
      phone: '(555) 789-1234',
      website: 'https://www.powerfitstudio.com',
      address: '456 Fitness Way, Los Angeles, CA 90001'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/powerfitstudio', username: '@powerfitstudio' },
        { platform: 'facebook', url: 'https://facebook.com/powerfitstudio', username: 'PowerFit Studio' },
        { platform: 'youtube', url: 'https://youtube.com/powerfitstudio', username: 'PowerFit Studio' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Perfect Push-Up Form Tutorial', description: 'Master the push-up with proper form and technique for safer, stronger upper-body training.', video_type: 'equipment_guide', embed_url: 'https://www.youtube.com/watch?v=LTGxBXGXuwc', thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', duration: '5:30' },
        { title: '20-Minute HIIT Fat Burning Workout', description: 'High-intensity workout you can do anywhere for cardio endurance and calorie burn.', video_type: 'workout_demo', embed_url: 'https://www.youtube.com/watch?v=4jec4Eh9BRY', thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80', duration: '20:15' },
        { title: 'Sarah\'s 30lb Weight Loss Journey', description: 'Follow Sarah’s inspiring transformation story and the training habits that helped her succeed.', video_type: 'member_success', embed_url: 'https://www.youtube.com/watch?v=2XFfgeHxX-Y', thumbnail: 'https://images.unsplash.com/photo-1549570652-97324981a6fd?auto=format&fit=crop&w=900&q=80', duration: '8:45' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/powerfitstudio',
      channel_name: 'PowerFit Studio',
      subscriber_count: '41.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLworkoutvideos',
      latest_video_embed: '',
      channel_description: 'Fitness workouts, class previews, and member success stories from PowerFit Studio. Subscribe for weekly fitness motivation!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '05:00', close_time: '22:00', is_closed: false },
        { day: 'tuesday', open_time: '05:00', close_time: '22:00', is_closed: false },
        { day: 'wednesday', open_time: '05:00', close_time: '22:00', is_closed: false },
        { day: 'thursday', open_time: '05:00', close_time: '22:00', is_closed: false },
        { day: 'friday', open_time: '05:00', close_time: '22:00', is_closed: false },
        { day: 'saturday', open_time: '07:00', close_time: '20:00', is_closed: false },
        { day: 'sunday', open_time: '08:00', close_time: '18:00', is_closed: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80', caption: 'State-of-the-art cardio equipment' },
        { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', caption: 'Spacious yoga studio' },
        { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', caption: 'Free weights area' },
        { image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=80', caption: 'Spin class in action' }
      ]
    },
    testimonials: {
      reviews: [
        { member_name: 'Jason K.', review: 'Joining PowerFit was the best decision I made for my health. The trainers are knowledgeable and supportive, and the community keeps me motivated.', achievement: 'Lost 30 lbs', member_since: 'January 2022', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80' },
        { member_name: 'Ella M.', review: 'The variety of classes keeps my workouts fresh and challenging. I especially love the yoga classes with Sarah - they have improved my flexibility and reduced my stress levels.', achievement: 'Completed first 5K race', member_since: 'March 2021', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80' },
        { member_name: 'David R.', review: 'As someone new to fitness, I was intimidated at first, but the staff made me feel welcome from day one. The beginner-friendly approach helped me build confidence.', achievement: 'Gained 12 lbs of muscle', member_since: 'September 2022', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/powerfitstudio',
      booking_text: 'Book a Class',
      trial_text: 'Free 7-Day Trial'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Golds%20Gym%20Venice%2C%20Los%20Angeles%2C%20CA&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Golds+Gym+Venice+Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/nike-training-club-wellness/id301521403',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.nike.ntc',
      app_description: 'Download our app to book classes, track your workouts, and stay connected with the PowerFit community.'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Have questions about our classes or membership options? Fill out the form below and our team will get back to you.'
    },
    thank_you: {
      message: 'Thank you for contacting PowerFit Studio. We appreciate your interest and will respond to your inquiry within 24 hours.'
    },
    action_buttons: {
      contact_button_text: 'Contact Gym',
      booking_button_text: 'Book Your Workout',
      save_contact_button_text: 'Save Gym Contact'
    },    seo: {
      meta_title: 'PowerFit Studio | Gym, Classes, and Personal Training',
      meta_description: 'Join PowerFit Studio for HIIT, yoga, strength training, and a supportive fitness community.',
      keywords: 'gym, fitness studio, HIIT, yoga, strength training, personal trainer',
      og_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="fitness-stats"><h4>Gym Statistics</h4><p>🏆 1,500+ Active Members</p><p>💪 50+ Group Classes Weekly</p><p>⭐ 4.9/5 Member Satisfaction Rating</p><p>🔥 24/7 Gym Access Available</p></div>',
      section_title: 'Why Choose PowerFit',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Join Our Fitness Community',
      qr_description: 'Scan to save our contact info and start your fitness journey with us today!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Transform your life with us. State-of-the-art equipment, expert trainers, and a supportive community awaits you at PowerFit Studio.',
      footer_links: [
        { title: 'Membership Plans', url: '#membership' },
        { title: 'Class Schedule', url: '#schedule' },
        { title: 'Personal Training', url: '#trainers' },
        { title: 'Free Trial', url: '#trial' }
      ]
    },
    copyright: {
      text: '© 2025 PowerFit Studio. All rights reserved.'
    }
  }
};
