import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const fitnessStudioTemplate = {
  name: t('Fitness Studio'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Studio Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
        { name: 'cover_image', type: 'file', label: t('Cover Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'studio_type', type: 'select', label: t('Studio Type'), options: [
          { value: 'yoga', label: t('Yoga Studio') },
          { value: 'pilates', label: t('Pilates Studio') },
          { value: 'crossfit', label: t('CrossFit Box') },
          { value: 'dance', label: t('Dance Studio') },
          { value: 'martial_arts', label: t('Martial Arts') },
          { value: 'general', label: t('General Fitness') }
        ]}
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'offerings',
          type: 'repeater',
          label: t('Fitness Services'),
          fields: [
            { name: 'name', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Service Image') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'intensity', type: 'select', label: t('Intensity Level'), options: [
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
      key: 'videos',
      name: t('Fitness Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Studio Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'class_preview', label: t('Class Preview') },
              { value: 'workout_tutorial', label: t('Workout Tutorial') },
              { value: 'studio_tour', label: t('Studio Tour') },
              { value: 'member_testimonial', label: t('Member Testimonial') },
              { value: 'trainer_spotlight', label: t('Trainer Spotlight') },
              { value: 'transformation_story', label: t('Transformation Story') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'fitness_level', type: 'select', label: t('Fitness Level'), options: [
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
      key: 'class_schedule',
      name: t('Class Schedule'),
      fields: [
        {
          name: 'classes',
          type: 'repeater',
          label: t('Weekly Classes'),
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
            { name: 'class_name', type: 'text', label: t('Class Name') },
            { name: 'time', type: 'text', label: t('Time') },
            { name: 'instructor', type: 'text', label: t('Instructor') }
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
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'member_image', type: 'file', label: t('Member Photo') },
            { name: 'achievement', type: 'text', label: t('Achievement/Result') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Book a Class'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'trial_available', type: 'checkbox', label: t('Free Trial Available') },
        { name: 'trial_text', type: 'text', label: t('Trial Offer Text') }
      ],
      required: false
    },
    {
      key: 'trainers',
      name: t('Our Trainers'),
      fields: [
        {
          name: 'team',
          type: 'repeater',
          label: t('Trainers/Instructors'),
          fields: [
            { name: 'name', type: 'text', label: t('Name') },
            { name: 'title', type: 'text', label: t('Title/Specialty') },
            { name: 'bio', type: 'textarea', label: t('Bio') },
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'certifications', type: 'text', label: t('Certifications') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'membership',
      name: t('Membership Options'),
      fields: [
        {
          name: 'plans',
          type: 'repeater',
          label: t('Membership Plans'),
          fields: [
            { name: 'name', type: 'text', label: t('Plan Name') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'features', type: 'textarea', label: t('Features (one per line)') },
            { name: 'is_popular', type: 'checkbox', label: t('Mark as Popular') }
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
        { name: 'app_description', type: 'textarea', label: t('App Description') },
        { name: 'app_features', type: 'textarea', label: t('App Features (one per line)') }
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
    },
  ],
  colorPresets: [
    { name: 'Energetic Red', primary: '#E53935', secondary: '#FF5252', accent: '#FFEBEE', background: '#FFFFFF', text: '#212121' },
    { name: 'Fitness Blue', primary: '#1E88E5', secondary: '#42A5F5', accent: '#E3F2FD', background: '#FFFFFF', text: '#212121' },
    { name: 'Yoga Green', primary: '#43A047', secondary: '#66BB6A', accent: '#E8F5E9', background: '#FFFFFF', text: '#212121' },
    { name: 'Power Purple', primary: '#8E24AA', secondary: '#AB47BC', accent: '#F3E5F5', background: '#FFFFFF', text: '#212121' },
    { name: 'Dark Mode', primary: '#5D4037', secondary: '#795548', accent: '#212121', background: '#121212', text: '#FFFFFF' },
    { name: 'High Contrast', primary: '#FF6F00', secondary: '#FFA000', accent: '#FFF8E1', background: '#212121', text: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700,800' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700,900' },
    { name: 'Oswald', value: 'Oswald, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Bebas Neue', value: 'Bebas Neue, cursive', weight: '400' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700,800' }
  ],
  defaultColors: {
    primary: '#E53935',
    secondary: '#FF5252',
    accent: '#FFEBEE',
    background: '#FFFFFF',
    text: '#212121',
    cardBg: '#F5F5F5',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'fitness-studio-layout',
    headerStyle: 'dynamic',
    cardStyle: 'sharp',
    buttonStyle: 'pill',
    iconStyle: 'bold',
    spacing: 'compact',
    shadows: 'strong',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'FlexFit Studio',
      tagline: 'Transform Your Body, Transform Your Life',
      logo: '',
      cover_image: ''
    },
    about: {
      description: 'FlexFit Studio is a premium fitness destination offering a wide range of classes and training options for all fitness levels. Our expert trainers and state-of-the-art facilities provide the perfect environment to achieve your fitness goals, whether you\'re just starting out or looking to take your training to the next level.',
      year_established: '2018',
      studio_type: 'general'
    },
    services: {
      offerings: [
        { name: 'Personal Training', description: 'One-on-one sessions tailored to your specific goals and fitness level', price: 'From $60/session', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80', duration: '45-60 min', intensity: 'all_levels' },
        { name: 'HIIT Classes', description: 'High-intensity interval training to maximize calorie burn and improve cardiovascular fitness', price: '$25/class', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80', duration: '45 min', intensity: 'intermediate' },
        { name: 'Yoga Flow', description: 'Dynamic yoga sequences to improve flexibility, strength, and mindfulness', price: '$20/class', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', duration: '60 min', intensity: 'all_levels' },
        { name: 'Strength & Conditioning', description: 'Build muscle and improve overall strength with our comprehensive strength program', price: '$25/class', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80', duration: '60 min', intensity: 'intermediate' }
      ]
    },
    class_schedule: {
      classes: [
        { day: 'monday', class_name: 'Morning HIIT', time: '6:00 AM - 6:45 AM', instructor: 'Alex' },
        { day: 'monday', class_name: 'Yoga Flow', time: '12:00 PM - 1:00 PM', instructor: 'Sarah' },
        { day: 'monday', class_name: 'Strength & Conditioning', time: '5:30 PM - 6:30 PM', instructor: 'Mike' },
        { day: 'wednesday', class_name: 'Morning HIIT', time: '6:00 AM - 6:45 AM', instructor: 'Alex' },
        { day: 'wednesday', class_name: 'Pilates', time: '12:00 PM - 1:00 PM', instructor: 'Emma' },
        { day: 'wednesday', class_name: 'Boxing Fundamentals', time: '5:30 PM - 6:30 PM', instructor: 'Jason' },
        { day: 'friday', class_name: 'Morning HIIT', time: '6:00 AM - 6:45 AM', instructor: 'Alex' },
        { day: 'friday', class_name: 'Yoga Flow', time: '12:00 PM - 1:00 PM', instructor: 'Sarah' },
        { day: 'friday', class_name: 'Strength & Conditioning', time: '5:30 PM - 6:30 PM', instructor: 'Mike' },
        { day: 'saturday', class_name: 'Weekend Warrior', time: '9:00 AM - 10:15 AM', instructor: 'Mike' },
        { day: 'saturday', class_name: 'Yoga Flow', time: '11:00 AM - 12:00 PM', instructor: 'Sarah' }
      ]
    },
    action_buttons: {
      contact_button_text: 'Contact Trainer',
      booking_button_text: 'Book Your Class',
      save_contact_button_text: 'Save Contact'
    },
    contact: {
      email: 'info@flexfitstudio.com',
      phone: '(555) 123-4567',
      website: 'https://www.flexfitstudio.com',
      address: '123 Fitness Way, Los Angeles, CA 90001'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/flexfitstudio', username: '@flexfitstudio' },
        { platform: 'facebook', url: 'https://facebook.com/flexfitstudio', username: 'FlexFit Studio' },
        { platform: 'youtube', url: 'https://youtube.com/flexfitstudio', username: 'FlexFit Studio' }
      ]
    },
    videos: {
      video_list: [
        { title: '20 Minute HIIT Workout - Full Body Cardio', description: 'Get a taste of our popular HIIT class with this energizing preview', video_type: 'class_preview', embed_url: 'https://www.youtube.com/embed/ml6cT4AZdqI', thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=900&q=80', duration: '20:00', fitness_level: 'intermediate' },
        { title: 'Gym Tour - Modern Fitness Facility', description: 'Take a virtual tour of our state-of-the-art fitness facility', video_type: 'studio_tour', embed_url: 'https://www.youtube.com/embed/hvCgDYFIRGY', thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80', duration: '5:20', fitness_level: 'all_levels' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/flexfitstudio',
      channel_name: 'FlexFit Studio',
      subscriber_count: '34.7K',
      featured_playlist: 'https://youtube.com/playlist?list=PLhomeworkouts',
      latest_video_embed: 'https://www.youtube.com/embed/ml6cT4AZdqI',
      channel_description: 'Fitness tutorials, class previews, and member success stories from FlexFit Studio. Subscribe for weekly workout inspiration!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '05:30', close_time: '21:00', is_closed: false },
        { day: 'tuesday', open_time: '05:30', close_time: '21:00', is_closed: false },
        { day: 'wednesday', open_time: '05:30', close_time: '21:00', is_closed: false },
        { day: 'thursday', open_time: '05:30', close_time: '21:00', is_closed: false },
        { day: 'friday', open_time: '05:30', close_time: '20:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'sunday', open_time: '09:00', close_time: '16:00', is_closed: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80', caption: 'Our spacious main workout area' },
        { image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80', caption: 'State-of-the-art cardio equipment' },
        { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80', caption: 'Dedicated yoga and stretching zone' },
        { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80', caption: 'Free weights and strength training area' }
      ]
    },
    testimonials: {
      reviews: [
        { member_name: 'Jessica R.', review: 'FlexFit completely changed my approach to fitness. The trainers are knowledgeable and supportive, and the community keeps me motivated!', rating: '5', member_image: '', achievement: 'Lost 30 lbs in 6 months' },
        { member_name: 'David M.', review: 'As someone who was intimidated by gyms, FlexFit provided the perfect welcoming environment. The variety of classes keeps my routine fresh and exciting.', rating: '5', member_image: '', achievement: 'Improved strength and flexibility' },
        { member_name: 'Sophia T.', review: 'The personal training sessions are worth every penny. My trainer created a program specifically for my goals and keeps me accountable.', rating: '4', member_image: '', achievement: 'Completed first half-marathon' }
      ]
    },
    appointments: {
      booking_url: 'https://bookings.flexfitstudio.com',
      booking_text: 'Book a Class',
      trial_available: true,
      trial_text: 'Try a free class! New members only.'
    },
    trainers: {
      team: [
        { name: 'Mike Johnson', title: 'Head Trainer, Strength Specialist', bio: 'With over 10 years of experience and multiple certifications, Mike specializes in strength training and athletic performance.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', certifications: 'NASM CPT, CSCS, TRX Certified' },
        { name: 'Sarah Chen', title: 'Yoga Instructor', bio: 'Sarah brings a calming presence to her classes, focusing on alignment, breath work, and mindfulness.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', certifications: '500hr RYT, Yoga Alliance Certified' },
        { name: 'Alex Rodriguez', title: 'HIIT & Cardio Specialist', bio: 'Alex is known for his high-energy classes that push you to your limits while keeping you motivated and having fun.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', certifications: 'ACE CPT, Spinning Certified, TRX Qualified' },
        { name: 'Emma Wilson', title: 'Pilates & Mobility Instructor', bio: 'Emma focuses on core strength, posture, and functional movement patterns to help clients move better in everyday life.', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', certifications: 'STOTT Pilates Certified, FMS Level 2' }
      ]
    },
    membership: {
      plans: [
        { name: 'Basic', price: '$49/month', duration: 'Monthly', description: 'Access to gym and basic classes', features: 'Gym access\nBasic classes\nLocker room access\nFitness assessment', is_popular: false },
        { name: 'Premium', price: '$79/month', duration: 'Monthly', description: 'Full access to all classes and facilities', features: 'All Basic features\nUnlimited classes\nGuest passes (2/month)\nNutrition consultation', is_popular: true },
        { name: 'Elite', price: '$129/month', duration: 'Monthly', description: 'Complete fitness experience with personal training', features: 'All Premium features\n2 PT sessions/month\nPriority booking\nCustom workout plan\nMonthly InBody scan', is_popular: false }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Equinox%20Hollywood%2C%20Los%20Angeles%2C%20CA&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Equinox+Hollywood+Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/myfitnesspal-calorie-counter/id341232718',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.myfitnesspal.android',
      app_description: 'Take FlexFit with you wherever you go. Our mobile app makes it easy to book classes, track your progress, and stay connected with our fitness community.',
      app_features: 'Easy class booking\nWorkout tracking\nPersonal metrics\nCommunity features\nNutrition logging'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Have questions about our classes, membership options, or anything else? Send us a message and our team will get back to you as soon as possible.'
    },
    thank_you: {
      message: 'Thank you for your interest in FlexFit Studio! We look forward to helping you achieve your fitness goals.'
    },
    seo: {
      meta_title: 'FlexFit Studio | Group Classes, Trainers, and Memberships',
      meta_description: 'Premium fitness studio with HIIT, yoga, strength classes, expert trainers, and flexible memberships.',
      keywords: 'fitness studio, HIIT classes, yoga studio, personal training, group fitness',
      og_image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Fitness Tips</h4><p>Check out our latest workout tips and nutrition advice.</p></div>',
      section_title: 'Fitness Resources',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Gym',
      qr_description: 'Scan this QR code to share our fitness studio with friends and family.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Your fitness journey starts here. Expert trainers, modern equipment, and a supportive community await you at FlexFit Studio.',
      footer_links: [
        { title: 'Free Trial', url: '#trial' },
        { title: 'Class Packages', url: '#membership' },
        { title: 'Personal Training', url: '#trainers' },
        { title: 'Book a Class', url: '#booking' }
      ]
    },
    copyright: {
      text: '© 2025 FlexFit Studio. All rights reserved.'
    }
  }
};
