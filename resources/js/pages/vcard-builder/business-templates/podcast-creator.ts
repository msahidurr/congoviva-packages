import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const podcastCreatorTemplate = {
  name: t('Podcast Host & Content Creator'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Host Name') },
        { name: 'title', type: 'text', label: t('Creator Title') },
        { name: 'tagline', type: 'textarea', label: t('Show Tagline') },
        { name: 'profile_image', type: 'file', label: t('Host Photo') },
        { name: 'status_text', type: 'text', label: t('Status Text (e.g., ON AIR, LIVE, RECORDING)') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Business Email') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Podcast Website') },
        { name: 'location', type: 'text', label: t('Recording Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Host Bio') },
        { name: 'topics', type: 'tags', label: t('Podcast Topics') },
        { name: 'experience', type: 'number', label: t('Years Creating Content') },
        { name: 'mission', type: 'textarea', label: t('Content Mission') }
      ],
      required: false
    },
    {
      key: 'shows',
      name: t('Shows & Content'),
      fields: [
        {
          name: 'show_list',
          type: 'repeater',
          label: t('Podcast Shows'),
          fields: [
            { name: 'title', type: 'text', label: t('Show Title') },
            { name: 'description', type: 'textarea', label: t('Show Description') },
            { name: 'frequency', type: 'select', label: t('Release Schedule'), options: [
              { value: 'daily', label: t('Daily') },
              { value: 'weekly', label: t('Weekly') },
              { value: 'biweekly', label: t('Bi-weekly') },
              { value: 'monthly', label: t('Monthly') },
              { value: 'seasonal', label: t('Seasonal') }
            ]},
            { name: 'platform_links', type: 'textarea', label: t('Platform Links') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Video Content'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Video Podcasts & Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'video_podcast', label: t('Video Podcast Episode') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'interview_highlight', label: t('Interview Highlight') },
              { value: 'podcast_tips', label: t('Podcasting Tips') },
              { value: 'studio_tour', label: t('Studio Tour') },
              { value: 'guest_intro', label: t('Guest Introduction') }
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
      key: 'episodes',
      name: t('Latest Episodes'),
      fields: [
        {
          name: 'episode_list',
          type: 'repeater',
          label: t('Recent Episodes'),
          fields: [
            { name: 'title', type: 'text', label: t('Episode Title') },
            { name: 'guest', type: 'text', label: t('Guest Name') },
            { name: 'description', type: 'textarea', label: t('Episode Description') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'listen_url', type: 'url', label: t('Listen URL') }
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
          label: t('Content Platforms'),
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
          label: t('Recording Schedule'),
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
        { name: 'booking_url', type: 'url', label: t('Guest Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'guest_requirements', type: 'textarea', label: t('Guest Requirements') }
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
          label: t('Listener Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Reviewer Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'platform', type: 'text', label: t('Review Platform') }
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
    { name: 'Podcast Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#F59E0B', background: '#1F1B24', text: '#F3F4F6', cardBg: '#2D2438' },
    { name: 'Audio Orange', primary: '#F97316', secondary: '#FB923C', accent: '#EAB308', background: '#0F0A19', text: '#FBBF24', cardBg: '#1C1917' },
    { name: 'Sound Wave Blue', primary: '#0EA5E9', secondary: '#38BDF8', accent: '#06B6D4', background: '#0C1222', text: '#E0F2FE', cardBg: '#1E293B' },
    { name: 'Mic Drop Red', primary: '#EF4444', secondary: '#F87171', accent: '#FBBF24', background: '#1A0B0B', text: '#FEF2F2', cardBg: '#2D1B1B' },
    { name: 'Creator Green', primary: '#10b77f', secondary: '#34D399', accent: '#F59E0B', background: '#0A1A0A', text: '#ECFDF5', cardBg: '#1F2937' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700,800' },
    { name: 'Roboto', value: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,700,900' },
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700,800' },
    { name: 'Nunito', value: 'Nunito, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,600,700,800' },
    { name: 'Work Sans', value: 'Work Sans, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#F59E0B',
    background: '#1F1B24',
    text: '#F3F4F6',
    cardBg: '#2D2438',
    borderColor: '#4C1D95',
    shadowColor: 'rgba(139, 92, 246, 0.3)'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'audio-waveform',
    headerStyle: 'podcast-studio',
    cardStyle: 'sound-cards',
    buttonStyle: 'audio-controls',
    iconStyle: 'broadcast',
    spacing: 'rhythm-based',
    shadows: 'audio-glow',
    animations: 'sound-wave',
    backgroundPattern: 'equalizer-bars',
    typography: 'broadcast-ready'
  },
  defaultData: {
    header: {
      name: 'Jordan Rivers',
      title: 'Podcast Host & Content Creator',
      tagline: 'Amplifying voices, sharing stories, and creating conversations that matter',
      profile_image: '',
      status_text: 'ON AIR'
    },
    contact: {
      email: 'hello@jordanrivers.audio',
      phone: '+1 (555) 456-7890',
      website: 'https://jordanrivers.audio',
      location: 'Austin, TX'
    },
    about: {
      description: 'Passionate storyteller and podcast host with 6+ years of experience creating engaging audio content. I specialize in interviewing thought leaders and exploring topics that inspire positive change.',
      topics: 'Technology, Entrepreneurship, Personal Growth, Innovation, Storytelling',
      experience: '6',
      mission: 'To create meaningful conversations that inspire, educate, and connect people from all walks of life.'
    },
    shows: {
      show_list: [
        { title: 'The Innovation Hour', description: 'Weekly deep dives into cutting-edge technology and the minds behind breakthrough innovations', frequency: 'weekly', platform_links: 'Spotify, Apple Podcasts, YouTube' },
        { title: 'Founder Stories', description: 'Intimate conversations with entrepreneurs about their journey from idea to success', frequency: 'biweekly', platform_links: 'All major platforms' }
      ]
    },
    videos: {
      video_list: [
        { title: 'But What Is a Neural Network? - AI Deep Dive', description: 'Complete video breakdown of neural networks and deep learning concepts', video_type: 'video_podcast', embed_url: 'https://youtu.be/aircAruvnKk', thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=80', duration: '19:13' },
        { title: 'PyTorch & AI at Tesla - Interview Highlight', description: 'Fascinating interview with Andrej Karpathy on AI and machine learning at Tesla', video_type: 'interview_highlight', embed_url: 'https://youtu.be/oBklltKXtDE', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80', duration: '31:42' },
        { title: 'The First 20 Hours - How to Learn Anything', description: 'Josh Kaufman shares the science of rapid skill acquisition - essential for content creators', video_type: 'podcast_tips', embed_url: 'https://youtu.be/5MgBikgcWnY', thumbnail: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', duration: '19:27' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/jordanrivers',
      channel_name: 'Jordan Rivers',
      subscriber_count: '124K',
      featured_playlist: 'https://youtube.com/playlist?list=PLpodcastepisodes',
      latest_video_embed: 'https://youtu.be/aircAruvnKk',
      channel_description: 'Video podcasts, interview highlights, and behind-the-scenes content from The Innovation Hour. Subscribe for weekly video episodes and exclusive content!'
    },
    episodes: {
      episode_list: [
        { title: 'The Future of AI with Dr. Sarah Chen', guest: 'Dr. Sarah Chen', description: 'Exploring the ethical implications and exciting possibilities of artificial intelligence', duration: '45 min', listen_url: 'https://spotify.com/episode1' },
        { title: 'Building a Billion Dollar Startup', guest: 'Marcus Johnson', description: 'From garage to IPO - the incredible journey of a tech entrepreneur', duration: '52 min', listen_url: 'https://spotify.com/episode2' }
      ]
    },
    social: {
      social_links: [
        { platform: 'spotify', url: 'https://spotify.com/jordanrivers', username: 'Jordan Rivers' },
        { platform: 'apple-podcasts', url: 'https://podcasts.apple.com/jordanrivers', username: 'Jordan Rivers' },
        { platform: 'youtube', url: 'https://youtube.com/jordanrivers', username: '@jordanrivers' },
        { platform: 'instagram', url: 'https://instagram.com/jordanrivers.audio', username: '@jordanrivers.audio' }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '15:00', is_closed: false },
        { day: 'saturday', open_time: '', close_time: '', is_closed: true },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/jordanrivers',
      calendar_link: 'https://calendar.google.com/jordanrivers',
      guest_requirements: 'Please prepare 3-5 talking points and ensure you have a quiet recording environment with good audio quality.'
    },
    testimonials: {
      reviews: [
        { client_name: 'Alex Thompson', review: 'Jordan is an incredible interviewer who makes guests feel comfortable while asking thought-provoking questions. The production quality is top-notch!', rating: '5', platform: 'Apple Podcasts' },
        { client_name: 'Maria Garcia', review: 'The Innovation Hour has become my go-to podcast for staying updated on tech trends. Jordan\'s insights are always valuable.', rating: '5', platform: 'Spotify' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=South%20Congress%20Austin%20TX&z=14&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=South+Congress+Austin+TX'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/spotify-for-creators/id1469623364',
      play_store_url: 'https://play.google.com/store/apps/details?id=fm.anchor.android'
    },
    contact_form: {
      form_title: 'Be a Guest on the Show',
      form_description: 'Have an interesting story to share? Want to discuss your expertise on the podcast? Let\'s connect and explore collaboration opportunities.'
    },
    thank_you: {
      message: 'Thanks for reaching out! I\'ll review your message and get back to you within 48 hours. Looking forward to potentially having you on the show!'
    },
    action_buttons: {
      contact_button_text: 'Let\'s Create Content Together',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'Jordan Rivers | Podcast Host and Content Creator',
      meta_description: 'Thoughtful podcast conversations on innovation, entrepreneurship, storytelling, and personal growth.',
      keywords: 'podcast host, video podcast, content creator, interviews, entrepreneurship, innovation',
      og_image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Featured Content</h4><p>Check out my latest podcast episodes and exclusive content.</p></div>',
      section_title: 'Featured Content',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Podcast',
      qr_description: 'Scan this QR code to access my podcast and contact information directly on your phone.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Jordan Rivers Audio. All rights reserved.'
    }
  }
};
