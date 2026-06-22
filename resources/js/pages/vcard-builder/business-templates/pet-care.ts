import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const petCareTemplate = {
  name: t('Pet Care'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Business Name') },
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
        { name: 'years_experience', type: 'number', label: t('Years of Experience') },
        { name: 'business_type', type: 'select', label: t('Business Type'), options: [
          { value: 'veterinary', label: t('Veterinary Clinic') },
          { value: 'grooming', label: t('Pet Grooming') },
          { value: 'boarding', label: t('Pet Boarding/Daycare') },
          { value: 'training', label: t('Pet Training') },
          { value: 'retail', label: t('Pet Store') },
          { value: 'multi', label: t('Multiple Services') }
        ]}
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'pet_services',
          type: 'repeater',
          label: t('Pet Services'),
          fields: [
            { name: 'name', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Service Image') },
            { name: 'duration', type: 'text', label: t('Duration (if applicable)') },
            { name: 'pet_type', type: 'select', label: t('Pet Type'), options: [
              { value: 'all', label: t('All Pets') },
              { value: 'dogs', label: t('Dogs Only') },
              { value: 'cats', label: t('Cats Only') },
              { value: 'small', label: t('Small Animals') },
              { value: 'exotic', label: t('Exotic Pets') }
            ]}
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
        { name: 'address', type: 'text', label: t('Address') },
        { name: 'emergency_phone', type: 'tel', label: t('Emergency Phone (if applicable)') }
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
          label: t('Operating Hours'),
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
          label: t('Client Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'pet_name', type: 'text', label: t('Pet Name') },
            { name: 'pet_type', type: 'text', label: t('Pet Type (e.g., Dog, Cat)') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'client_image', type: 'file', label: t('Client/Pet Photo') }
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
        { name: 'appointment_info', type: 'textarea', label: t('Appointment Information') },
        { name: 'online_booking', type: 'checkbox', label: t('Online Booking Available') }
      ],
      required: false
    },
    {
      key: 'team',
      name: t('Our Team'),
      fields: [
        {
          name: 'staff',
          type: 'repeater',
          label: t('Staff Members'),
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
      key: 'videos',
      name: t('Pet Care Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Pet Care Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'care_tips', label: t('Pet Care Tips') },
              { value: 'service_demo', label: t('Service Demonstration') },
              { value: 'facility_tour', label: t('Facility Tour') },
              { value: 'pet_testimonial', label: t('Pet & Owner Testimonial') },
              { value: 'educational', label: t('Educational Content') },
              { value: 'behind_scenes', label: t('Behind the Scenes') }
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
      key: 'pet_care_tips',
      name: t('Pet Care Tips'),
      fields: [
        {
          name: 'tips',
          type: 'repeater',
          label: t('Care Tips'),
          fields: [
            { name: 'title', type: 'text', label: t('Tip Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'pet_type', type: 'select', label: t('Pet Type'), options: [
              { value: 'all', label: t('All Pets') },
              { value: 'dogs', label: t('Dogs') },
              { value: 'cats', label: t('Cats') },
              { value: 'small', label: t('Small Animals') },
              { value: 'exotic', label: t('Exotic Pets') }
            ]},
            { name: 'image', type: 'file', label: t('Tip Image') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'emergency',
      name: t('Emergency Information'),
      fields: [
        { name: 'emergency_title', type: 'text', label: t('Emergency Section Title') },
        { name: 'emergency_description', type: 'textarea', label: t('Emergency Instructions') },
        { name: 'emergency_phone', type: 'tel', label: t('Emergency Phone Number') },
        { name: 'emergency_hours', type: 'text', label: t('Emergency Hours') },
        { name: 'show_emergency_banner', type: 'checkbox', label: t('Show Emergency Banner') }
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
    { name: 'Playful Paws', primary: '#4CAF50', secondary: '#8BC34A', accent: '#E8F5E9', background: '#FFFFFF', text: '#333333' },
    { name: 'Vet Blue', primary: '#1976D2', secondary: '#64B5F6', accent: '#E3F2FD', background: '#FFFFFF', text: '#333333' },
    { name: 'Grooming Pink', primary: '#EC407A', secondary: '#F48FB1', accent: '#FCE4EC', background: '#FFFFFF', text: '#333333' },
    { name: 'Cozy Brown', primary: '#795548', secondary: '#A1887F', accent: '#EFEBE9', background: '#FFFFFF', text: '#333333' },
    { name: 'Vibrant Orange', primary: '#FF9800', secondary: '#FFB74D', accent: '#FFF3E0', background: '#FFFFFF', text: '#333333' },
    { name: 'Calm Teal', primary: '#009688', secondary: '#4DB6AC', accent: '#E0F2F1', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Nunito', value: 'Nunito, sans-serif', weight: '400,600,700,800' },
    { name: 'Quicksand', value: 'Quicksand, sans-serif', weight: '400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '400,500,600,700' },
    { name: 'Comic Neue', value: 'Comic Neue, cursive', weight: '400,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#E8F5E9',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#FFFFFF',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
  },
  defaultFont: 'Nunito, sans-serif',
  themeStyle: {
    layout: 'pet-care-layout',
    headerStyle: 'friendly',
    cardStyle: 'rounded',
    buttonStyle: 'rounded',
    iconStyle: 'playful',
    spacing: 'comfortable',
    shadows: 'soft',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'Paws & Claws',
      tagline: 'Compassionate care for your furry family members',
      logo: '',
      cover_image: ''
    },
    about: {
      description: 'At Paws & Claws, we provide comprehensive veterinary care, grooming, and boarding services for pets of all kinds. Our experienced team is dedicated to ensuring the health, happiness, and well-being of your beloved companions in a stress-free environment.',
      years_experience: '15',
      business_type: 'multi'
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Book Appointment',
      save_contact_button_text: 'Save Contact'
    },
    services: {
      pet_services: [
        { name: 'Wellness Exams', description: 'Comprehensive health check-ups to keep your pet in optimal health.', price: 'From $50', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80', duration: '30 min', pet_type: 'all' },
        { name: 'Full Grooming', description: 'Complete grooming service including bath, haircut, nail trimming, and ear cleaning.', price: 'From $45', image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80', duration: '60-90 min', pet_type: 'all' },
        { name: 'Pet Boarding', description: 'Safe and comfortable overnight care for your pets while you\'re away.', price: 'From $35/night', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80', duration: 'Overnight', pet_type: 'all' },
        { name: 'Dental Cleaning', description: 'Professional dental care to maintain your pet\'s oral health.', price: 'From $200', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80', duration: '60 min', pet_type: 'all' }
      ]
    },
    contact: {
      email: 'info@pawsandclaws.com',
      phone: '(555) 123-4567',
      website: 'https://www.pawsandclaws.com',
      address: '123 Pet Care Lane, Anytown, CA 90210',
      emergency_phone: '(555) 987-6543'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/pawsandclaws', username: '@pawsandclaws' },
        { platform: 'facebook', url: 'https://facebook.com/pawsandclaws', username: 'Paws & Claws' },
        { platform: 'twitter', url: 'https://twitter.com/pawsandclaws', username: '@pawsandclaws' },
        { platform: 'youtube', url: 'https://youtube.com/pawsandclaws', username: 'Paws & Claws' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Pet Care Video Guide', description: 'Sample pet care video for template preview. Replace with your own educational or wellness-focused content.', video_type: 'educational', embed_url: 'https://youtu.be/Zb3Wzs2FcFE?si=4_voMIgy9YsAHICF', thumbnail: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80', duration: '5:30' },
        { title: 'Pet Facility Walkthrough', description: 'Sample walkthrough video for showcasing your pet clinic, grooming room, or boarding center.', video_type: 'facility_tour', embed_url: 'https://youtu.be/JrI3vzy9Udc?si=9t3qegNYv85Q4Rrj', thumbnail: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80', duration: '7:45' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/pawsandclaws',
      channel_name: 'Paws & Claws Pet Care',
      subscriber_count: '23.7K',
      featured_playlist: 'https://youtube.com/playlist?list=PLpetcaretips',
      latest_video_embed: 'https://youtu.be/Zb3Wzs2FcFE?si=4_voMIgy9YsAHICF',
      channel_description: 'Pet care tips, educational content, and behind-the-scenes videos from our veterinary clinic and grooming salon. Subscribe for weekly pet care advice!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '08:00', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '09:00', close_time: '16:00', is_closed: false },
        { day: 'sunday', open_time: '00:00', close_time: '00:00', is_closed: true }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=900&q=80', caption: 'Our modern facility' },
        { image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80', caption: 'Professional grooming services' },
        { image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80', caption: 'Comfortable boarding accommodations' },
        { image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=80', caption: 'Our friendly staff with happy patients' }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah Johnson', pet_name: 'Max', pet_type: 'Dog', review: 'The team at Paws & Claws has been taking care of my Golden Retriever for years. They\'re always gentle, thorough, and genuinely care about Max\'s wellbeing.', rating: '5', client_image: '' },
        { client_name: 'Michael Chen', pet_name: 'Luna', pet_type: 'Cat', review: 'I was nervous about boarding my cat, but the staff made both of us feel comfortable. Luna came home happy and well-cared for. I won\'t hesitate to use their services again!', rating: '5', client_image: '' },
        { client_name: 'Emily Rodriguez', pet_name: 'Bella', pet_type: 'Dog', review: 'The grooming services are excellent! Bella always looks and smells amazing after her appointments. The groomers are patient with her anxiety too.', rating: '4', client_image: '' }
      ]
    },
    appointments: {
      booking_url: 'https://booking.pawsandclaws.com',
      booking_text: 'Book an Appointment',
      appointment_info: 'Schedule an appointment for veterinary services, grooming, or to discuss boarding options. Same-day appointments may be available for urgent cases.',
      online_booking: true
    },
    team: {
      staff: [
        { name: 'Dr. James Wilson', title: 'Head Veterinarian', bio: 'Dr. Wilson has over 15 years of experience in small animal medicine and surgery. He has a special interest in preventative care and geriatric medicine.', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=900&q=80', specialties: 'Small Animal Medicine, Surgery, Geriatric Care' },
        { name: 'Lisa Martinez', title: 'Lead Groomer', bio: 'Lisa has been grooming pets for 10 years and is certified in handling anxious animals. She specializes in breed-specific cuts and gentle grooming techniques.', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', specialties: 'Breed-Specific Cuts, Anxious Pet Handling' },
        { name: 'Mark Thompson', title: 'Boarding Manager', bio: 'Mark ensures that all boarding pets receive personalized attention and care. He\'s known for creating a home-like environment for our overnight guests.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', specialties: 'Animal Behavior, Enrichment Activities' },
        { name: 'Dr. Sarah Lee', title: 'Associate Veterinarian', bio: 'Dr. Lee joined our team after completing advanced training in dental care and dermatology. She loves working with pets of all sizes.', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80', specialties: 'Dental Care, Dermatology' }
      ]
    },
    pet_care_tips: {
      tips: [
        { title: 'Dental Health', description: 'Brush your pet\'s teeth regularly and provide dental chews to maintain good oral hygiene and prevent dental disease.', pet_type: 'all', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80' },
        { title: 'Summer Safety', description: 'Never leave pets in hot cars and ensure they have access to shade and fresh water during warm weather to prevent heat stroke.', pet_type: 'all', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80' },
        { title: 'Cat Enrichment', description: 'Provide climbing spaces, hiding spots, and interactive toys to keep indoor cats mentally stimulated and physically active.', pet_type: 'cats', image: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    emergency: {
      emergency_title: 'Pet Emergency?',
      emergency_description: 'If your pet is experiencing a medical emergency outside of our regular hours, please call our emergency line immediately or visit the nearest 24-hour veterinary hospital.',
      emergency_phone: '(555) 987-6543',
      emergency_hours: '24/7',
      show_emergency_banner: true
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Beverly%20Hills%20CA&z=13&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Beverly+Hills+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/chewy-where-pet-lovers-shop/id839298246',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.chewy.android',
      app_description: 'Download our app to easily schedule appointments, receive medication reminders, access your pet\'s health records, and more.',
      app_features: 'Appointment scheduling\nMedication reminders\nDigital health records\nDirect messaging with our team\nEmergency contact information'
    },
    contact_form: {
      form_title: 'Contact Us',
      form_description: 'Have questions about our services or want to schedule an appointment? Fill out the form below and we\'ll get back to you as soon as possible.'
    },
    thank_you: {
      message: 'Thank you for reaching out to Paws & Claws! We appreciate your interest and will respond to your inquiry shortly.'
    },    seo: {
      meta_title: 'Paws & Claws Pet Care | Vet, Grooming, Boarding, and Wellness',
      meta_description: 'Comprehensive pet care including wellness exams, grooming, boarding, and dental services.',
      keywords: 'pet care, veterinarian, pet grooming, pet boarding, animal clinic, dog grooming',
      og_image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="pet-care-stats"><h4>Pet Care Excellence</h4><p>🐶 5000+ Happy Pets Served</p><p>🏆 15 Years of Experience</p><p>👨‍⚕️ Licensed Veterinarians</p><p>⭐ 5-Star Rated Service</p></div>',
      section_title: 'Why Choose Us',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with Paws & Claws',
      qr_description: 'Scan to save our contact info and book your pet\'s next appointment!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Paws & Claws Pet Care. All rights reserved.'
    }
  }
};
