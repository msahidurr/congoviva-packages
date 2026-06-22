import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const lifeCoachTemplate = {
  name: t('Life Coach & Motivational Speaker'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Coach Name') },
        { name: 'title', type: 'text', label: t('Coaching Title') },
        { name: 'tagline', type: 'textarea', label: t('Inspirational Tagline') },
        { name: 'profile_image', type: 'file', label: t('Coach Photo') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Coaching Website') },
        { name: 'location', type: 'text', label: t('Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Coaching Journey') },
        { name: 'specializations', type: 'tags', label: t('Coaching Specializations') },
        { name: 'experience', type: 'number', label: t('Years Coaching') },
        { name: 'mission', type: 'textarea', label: t('Mission Statement') }
      ],
      required: false
    },
    {
      key: 'programs',
      name: t('Coaching Programs'),
      fields: [
        {
          name: 'program_list',
          type: 'repeater',
          label: t('Coaching Programs'),
          fields: [
            { name: 'title', type: 'text', label: t('Program Name') },
            { name: 'description', type: 'textarea', label: t('Program Description') },
            { name: 'duration', type: 'text', label: t('Program Duration') },
            { name: 'format', type: 'select', label: t('Format'), options: [
              { value: 'one-on-one', label: t('One-on-One') },
              { value: 'group', label: t('Group Coaching') },
              { value: 'workshop', label: t('Workshop') },
              { value: 'online', label: t('Online Course') },
              { value: 'retreat', label: t('Retreat') }
            ]},
            { name: 'price', type: 'text', label: t('Investment') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'transformations',
      name: t('Client Transformations'),
      fields: [
        {
          name: 'success_stories',
          type: 'repeater',
          label: t('Success Stories'),
          fields: [
            { name: 'client_initial', type: 'text', label: t('Client Initial') },
            { name: 'challenge', type: 'textarea', label: t('Initial Challenge') },
            { name: 'transformation', type: 'textarea', label: t('Transformation Achieved') },
            { name: 'outcome', type: 'textarea', label: t('Current Outcome') },
            { name: 'timeframe', type: 'text', label: t('Timeframe') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Inspirational Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Motivational Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'motivational_speech', label: t('Motivational Speech') },
              { value: 'coaching_session', label: t('Coaching Session Demo') },
              { value: 'client_transformation', label: t('Client Transformation') },
              { value: 'life_tips', label: t('Life Tips & Advice') },
              { value: 'workshop_preview', label: t('Workshop Preview') },
              { value: 'personal_story', label: t('Personal Story') }
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
      key: 'speaking',
      name: t('Speaking Engagements'),
      fields: [
        {
          name: 'topics',
          type: 'repeater',
          label: t('Speaking Topics'),
          fields: [
            { name: 'topic', type: 'text', label: t('Topic Title') },
            { name: 'description', type: 'textarea', label: t('Topic Description') },
            { name: 'audience', type: 'text', label: t('Target Audience') },
            { name: 'duration', type: 'text', label: t('Duration Options') }
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
          label: t('Inspirational Platforms'),
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
          label: t('Availability'),
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
            { name: 'open_time', type: 'time', label: t('Available From') },
            { name: 'close_time', type: 'time', label: t('Available Until') },
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
        { name: 'booking_url', type: 'url', label: t('Session Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'consultation_info', type: 'textarea', label: t('Free Consultation Info') }
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
          label: t('Client Testimonials'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Client Name') },
            { name: 'review', type: 'textarea', label: t('Testimonial') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'program', type: 'text', label: t('Program/Service') }
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
    },
  ],
  colorPresets: [
    { name: 'Sunrise Inspiration', primary: '#FF6B35', secondary: '#F7931E', accent: '#FFD23F', background: '#FFF9F0', text: '#2D1B69', cardBg: '#FFFFFF' },
    { name: 'Calm Confidence', primary: '#4A90E2', secondary: '#7BB3F0', accent: '#50C878', background: '#F8FBFF', text: '#2a5693', cardBg: '#FFFFFF' },
    { name: 'Growth Green', primary: '#28A745', secondary: '#34CE57', accent: '#85E085', background: '#F0FFF4', text: '#155724', cardBg: '#FFFFFF' },
    { name: 'Empowerment Purple', primary: '#6F42C1', secondary: '#8A63D2', accent: '#D1C4E9', background: '#FAF8FF', text: '#3D2B56', cardBg: '#FFFFFF' },
    { name: 'Mindful Earth', primary: '#8B4513', secondary: '#CD853F', accent: '#DEB887', background: '#FDF5E6', text: '#5D2F0A', cardBg: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Open Sans', value: 'Open Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' },
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700,800' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700' }
  ],
  defaultColors: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#FFD23F',
    background: '#FFF9F0',
    text: '#2D1B69',
    cardBg: '#FFFFFF',
    borderColor: '#FFE4B5',
    shadowColor: 'rgba(255, 107, 53, 0.2)'
  },
  defaultFont: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'inspiration-flow',
    headerStyle: 'motivational-hero',
    cardStyle: 'uplifting-cards',
    buttonStyle: 'action-buttons',
    iconStyle: 'inspirational',
    spacing: 'empowering',
    shadows: 'uplifting-glow',
    animations: 'growth-effects',
    backgroundPattern: 'success-rays',
    typography: 'motivational-sans'
  },
  defaultData: {
    header: {
      name: 'Maya Thompson',
      title: 'Certified Life Coach & Motivational Speaker',
      tagline: 'Empowering individuals to unlock their potential, overcome limitations, and create the extraordinary life they deserve',
      profile_image: ''
    },
    contact: {
      email: 'hello@mayathompsoncoaching.com',
      phone: '+1 (555) 789-0123',
      website: 'https://mayathompsoncoaching.com',
      location: 'San Diego, CA'
    },
    about: {
      description: 'Passionate life coach with 12+ years of experience helping individuals transform their lives through proven strategies, mindset shifts, and actionable goal-setting. Certified through ICF and specialized in breakthrough coaching methodologies.',
      specializations: 'Career Transitions, Confidence Building, Goal Achievement, Mindset Coaching, Leadership Development',
      experience: '12',
      mission: 'To inspire and empower every person I work with to break through their limitations and create a life of purpose, passion, and fulfillment.'
    },
    programs: {
      program_list: [
        { title: 'Breakthrough Intensive', description: '90-day one-on-one program designed to create massive shifts in your life and career', duration: '3 months', format: 'one-on-one', price: '$3,997' },
        { title: 'Confidence Mastery Workshop', description: 'Transform your self-doubt into unshakeable confidence in just one day', duration: '1 day', format: 'workshop', price: '$297' },
        { title: 'Goal Achiever Mastermind', description: 'Small group coaching program for ambitious individuals ready to level up', duration: '6 months', format: 'group', price: '$1,997' },
        { title: 'Mindset Reset Course', description: 'Online course to reprogram limiting beliefs and create empowering thought patterns', duration: 'Self-paced', format: 'online', price: '$497' }
      ]
    },
    transformations: {
      success_stories: [
        { client_initial: 'S.M.', challenge: 'Stuck in unfulfilling corporate job, lacking confidence to pursue entrepreneurship', transformation: 'Launched successful consulting business, increased income by 150%', outcome: 'Now running 6-figure business and mentoring other entrepreneurs', timeframe: '6 months' },
        { client_initial: 'J.R.', challenge: 'Struggling with imposter syndrome and fear of public speaking', transformation: 'Became confident speaker, landed promotion to leadership role', outcome: 'Now leads team of 20+ and speaks at industry conferences', timeframe: '4 months' }
      ]
    },
    speaking: {
      topics: [
        { topic: 'Unleashing Your Inner Champion', description: 'Discover the mindset and strategies of high achievers to unlock your full potential', audience: 'Corporate teams, entrepreneurs', duration: '45-90 minutes' },
        { topic: 'From Fear to Fearless', description: 'Transform limiting beliefs and step boldly into your power', audience: 'Women\'s groups, conferences', duration: '30-60 minutes' },
        { topic: 'The Success Blueprint', description: 'Proven framework for setting and achieving ambitious goals', audience: 'Sales teams, leadership groups', duration: '60-120 minutes' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/mayathompsoncoach', username: '@mayathompsoncoach' },
        { platform: 'youtube', url: 'https://youtube.com/mayathompson', username: 'Maya Thompson Coaching' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/mayathompsoncoach', username: 'Maya Thompson' }
      ]
    },
    videos: {
      video_list: [
        { title: 'How to Motivate Yourself to Change Your Behavior', description: 'TEDx talk exploring the psychology of motivation, behavior change, and lasting personal growth', video_type: 'motivational_speech', embed_url: 'https://youtu.be/xp0O2vi8DX4', thumbnail: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80', duration: '16:49' },
        { title: 'The Skill of Self-Confidence', description: 'TEDx talk on building self-confidence through repetition, preparation, and a growth mindset', video_type: 'life_tips', embed_url: 'https://youtu.be/w-HYZv6HzAs', thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80', duration: '13:21' },
        { title: 'Bye Burnout! Fireproof Your Career', description: 'Practical talk on recognizing burnout, protecting your energy, and creating a more sustainable career path', video_type: 'personal_story', embed_url: 'https://youtu.be/gbaXajFEiLs', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80', duration: '12:15' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/mayathompson',
      channel_name: 'Maya Thompson Coaching',
      subscriber_count: '89.3K',
      featured_playlist: 'https://youtube.com/playlist?list=PLmotivationalspeeches',
      latest_video_embed: 'https://youtu.be/xp0O2vi8DX4',
      channel_description: 'Life coaching insights, motivational content, and transformation stories to help you create the extraordinary life you deserve. New videos every Tuesday!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '15:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '14:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/mayathompson',
      calendar_link: 'https://calendar.google.com/mayathompson',
      consultation_info: 'Book your complimentary 30-minute breakthrough session to discover what\'s possible for your life and how coaching can help you get there.'
    },
    testimonials: {
      reviews: [
        { client_name: 'Jennifer Walsh', review: 'Maya completely transformed my mindset and my life. I went from feeling stuck and overwhelmed to confident and purposeful. Best investment I\'ve ever made!', rating: '5', program: 'Breakthrough Intensive' },
        { client_name: 'Michael Chen', review: 'The Goal Achiever Mastermind exceeded all my expectations. Maya\'s coaching style is both challenging and supportive. I achieved goals I never thought possible.', rating: '5', program: 'Goal Achiever Mastermind' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=San%20Diego%20CA&z=12&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=San+Diego+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/insight-timer-meditation-app/id337472899',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.spotlightsix.zentimerlite2'
    },
    contact_form: {
      form_title: 'Ready to Transform Your Life?',
      form_description: 'Take the first step towards the life you\'ve always dreamed of. Share what you\'re looking to achieve and let\'s explore how we can make it happen together.'
    },
    action_buttons: {
      contact_button_text: 'Transform Your Life Today',
      appointment_button_text: 'Book Free Session',
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for taking this important step! I\'ll personally review your message and respond within 24 hours. Your transformation journey starts now!'
    },    seo: {
      meta_title: 'Maya Thompson Coaching | Life Coaching and Motivation',
      meta_description: 'Life coaching, mindset transformation, confidence building, and speaking programs to help you move forward.',
      keywords: 'life coach, mindset coach, motivational speaker, confidence coaching, personal growth',
      og_image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="coaching-achievements"><h4>Coaching Achievements</h4><p>✨ 500+ Lives Transformed</p><p>🏆 ICF Certified Professional Coach</p><p>📚 Featured in 15+ Publications</p><p>🎤 100+ Speaking Engagements</p></div>',
      section_title: 'Impact & Recognition',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect & Transform',
      qr_description: 'Scan to save my contact and start your transformation journey today!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Maya Thompson Coaching. All rights reserved.'
    }
  }
};
