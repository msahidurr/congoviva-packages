import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const gamingStreamerTemplate = {
  name: t('Gaming Streamer & Esports'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Gamer Tag') },
        { name: 'title', type: 'text', label: t('Gaming Title') },
        { name: 'tagline', type: 'textarea', label: t('Stream Tagline') },
        { name: 'profile_image', type: 'file', label: t('Avatar/Photo') },
        { name: 'status_text', type: 'text', label: t('Stream Status (e.g., LIVE, OFFLINE, STREAMING)') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Business Email') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Gaming Website') },
        { name: 'location', type: 'text', label: t('Location/Region') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Gamer Bio') },
        { name: 'games', type: 'tags', label: t('Main Games') },
        { name: 'experience', type: 'number', label: t('Years Gaming') },
        { name: 'achievements', type: 'textarea', label: t('Gaming Achievements') }
      ],
      required: false
    },
    {
      key: 'streaming',
      name: t('Streaming Info'),
      fields: [
        {
          name: 'stream_details',
          type: 'repeater',
          label: t('Streaming Platforms'),
          fields: [
            { name: 'platform', type: 'select', label: t('Platform'), options: socialPlatformsConfig.map(p => ({ value: p.value, label: p.label })) },
            { name: 'username', type: 'text', label: t('Username') },
            { name: 'followers', type: 'text', label: t('Follower Count') },
            { name: 'stream_url', type: 'url', label: t('Stream URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'schedule',
      name: t('Stream Schedule'),
      fields: [
        {
          name: 'stream_schedule',
          type: 'repeater',
          label: t('Weekly Schedule'),
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
            { name: 'game', type: 'text', label: t('Game/Content') },
            { name: 'start_time', type: 'time', label: t('Start Time') },
            { name: 'duration', type: 'text', label: t('Duration') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Gaming Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Gaming Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Content Type'), options: [
              { value: 'gameplay_highlight', label: t('Gameplay Highlight') },
              { value: 'tutorial_guide', label: t('Tutorial/Guide') },
              { value: 'stream_highlight', label: t('Stream Highlight') },
              { value: 'montage', label: t('Montage/Compilation') },
              { value: 'review', label: t('Game Review') },
              { value: 'esports_match', label: t('Esports Match') },
              { value: 'reaction', label: t('Reaction Video') },
              { value: 'behind_scenes', label: t('Behind the Scenes') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'game_title', type: 'text', label: t('Game Featured') },
            { name: 'view_count', type: 'text', label: t('View Count') }
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
      key: 'social',
      name: t('Social Media'),
      fields: [
        {
          name: 'social_links',
          type: 'repeater',
          label: t('Gaming Platforms'),
          fields: [
            { name: 'platform', type: 'select', label: t('Platform'), options: [
              { value: 'twitch', label: t('Twitch') },
              { value: 'youtube', label: t('YouTube') },
              { value: 'twitter', label: t('Twitter') },
              { value: 'instagram', label: t('Instagram') },
              { value: 'tiktok', label: t('TikTok') },
              { value: 'discord', label: t('Discord') },
              { value: 'steam', label: t('Steam') },
              { value: 'xbox', label: t('Xbox Live') },
              { value: 'playstation', label: t('PlayStation') }
            ]},
            { name: 'url', type: 'url', label: t('Profile URL') },
            { name: 'username', type: 'text', label: t('Gamer Tag') }
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
            { name: 'is_closed', type: 'checkbox', label: t('Offline') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Appointments'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Collaboration Booking') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'collab_info', type: 'textarea', label: t('Collaboration Info') }
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
          label: t('Community Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Viewer/Fan Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'platform', type: 'text', label: t('Platform') }
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
    { name: 'Neon Gaming', primary: '#00FF41', secondary: '#FF0080', accent: '#00D9FF', background: '#0A0A0A', text: '#FFFFFF', cardBg: '#1A1A1A' },
    { name: 'RGB Gamer', primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#45B7D1', background: '#121212', text: '#F0F0F0', cardBg: '#1E1E1E' },
    { name: 'Cyber Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#F59E0B', background: '#0F0A19', text: '#E5E7EB', cardBg: '#1F1B2E' },
    { name: 'Electric Blue', primary: '#0EA5E9', secondary: '#38BDF8', accent: '#FBBF24', background: '#0C1222', text: '#F1F5F9', cardBg: '#1E293B' },
    { name: 'Fire Red', primary: '#EF4444', secondary: '#F87171', accent: '#34D399', background: '#1A0B0B', text: '#FEF2F2', cardBg: '#2D1B1B' }
  ],
  fontOptions: [
    { name: 'Exo 2', value: 'Exo 2, sans-serif', weight: '400,500,600,700,800' },
    { name: 'Orbitron', value: 'Orbitron, monospace', weight: '400,500,700,900' },
    { name: 'Rajdhani', value: 'Rajdhani, sans-serif', weight: '400,500,600,700' },
    { name: 'Audiowide', value: 'Audiowide, cursive', weight: '400' },
    { name: 'Electrolize', value: 'Electrolize, sans-serif', weight: '400' }
  ],
  defaultColors: {
    primary: '#00FF41',
    secondary: '#FF0080',
    accent: '#00D9FF',
    background: '#0A0A0A',
    text: '#FFFFFF',
    cardBg: '#1A1A1A',
    borderColor: '#00FF41',
    shadowColor: 'rgba(0, 255, 65, 0.5)'
  },
  defaultFont: 'Exo 2, sans-serif',
  themeStyle: {
    layout: 'gaming-hud',
    headerStyle: 'streamer-overlay',
    cardStyle: 'neon-panels',
    buttonStyle: 'gaming-controls',
    iconStyle: 'pixel-art',
    spacing: 'grid-based',
    shadows: 'neon-glow',
    animations: 'glitch-effects',
    backgroundPattern: 'circuit-matrix',
    typography: 'futuristic-mono'
  },
  defaultData: {
    header: {
      name: 'CyberNinja_X',
      title: 'Pro Gamer & Content Creator',
      tagline: 'Dominating the digital battlefield and entertaining the gaming community 24/7',
      profile_image: '',
      status_text: 'LIVE'
    },
    contact: {
      email: 'business@cyberninja.gg',
      phone: '+1 (555) 567-8901',
      website: 'https://cyberninja.gg',
      location: 'Los Angeles, CA'
    },
    about: {
      description: 'Professional esports player and content creator with 8+ years of competitive gaming experience. Specializing in FPS and MOBA games with a passion for entertaining and educating the gaming community.',
      games: 'Valorant, League of Legends, Apex Legends, Counter-Strike 2, Overwatch 2',
      experience: '8',
      achievements: 'Regional Champion 2023, 1M+ Twitch followers, Sponsored by top gaming brands'
    },
    streaming: {
      stream_details: [
        { platform: 'twitch', username: 'CyberNinja_X', followers: '1.2M', stream_url: 'https://twitch.tv/cyberninja_x' },
        { platform: 'youtube', username: 'CyberNinja Gaming', followers: '850K', stream_url: 'https://youtube.com/cyberninja' }
      ]
    },
    schedule: {
      stream_schedule: [
        { day: 'monday', game: 'Valorant Ranked', start_time: '19:00', duration: '4 hours' },
        { day: 'wednesday', game: 'League of Legends', start_time: '18:00', duration: '5 hours' },
        { day: 'friday', game: 'Variety Gaming', start_time: '20:00', duration: '3 hours' },
        { day: 'sunday', game: 'Community Games', start_time: '17:00', duration: '4 hours' }
      ]
    },
    videos: {
      video_list: [
        {
          title: 'Valorant Ranked Climbing Guide',
          description: 'Learn advanced aiming, positioning, and communication strategies to rank up faster in Valorant competitive matches.',
          video_type: 'tutorial_guide',
          embed_url: 'https://www.youtube.com/watch?v=umWJCOh_oE4',
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80'
        },
        {
          title: 'Valorant - Official Gameplay Trailer',
          description: 'Official gameplay trailer for Valorant by Riot Games. A 5v5 character-based tactical shooter where precise gunplay meets unique agent abilities.',
          video_type: 'gameplay_highlight',
          embed_url: 'https://www.youtube.com/watch?v=e_E9W2vsRbQ',
          thumbnail: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80'
        },
      ]
    },
    social: {
      social_links: [
        { platform: 'twitch', url: 'https://twitch.tv/cyberninja_x', username: 'CyberNinja_X' },
        { platform: 'youtube', url: 'https://youtube.com/cyberninja', username: 'CyberNinja Gaming' },
        { platform: 'twitter', url: 'https://twitter.com/cyberninja_x', username: '@CyberNinja_X' },
        { platform: 'discord', url: 'https://discord.gg/cyberninja', username: 'CyberNinja Community' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/cyberninja_x',
      channel_name: 'CyberNinja_X Gaming',
      subscriber_count: '892K',
      featured_playlist: 'https://youtube.com/playlist?list=PLvalorantguides',
      latest_video_embed: 'https://www.youtube.com/watch?v=umWJCOh_oE4',
      channel_description: 'Pro gaming content, tutorials, and live stream highlights. Subscribe for daily gaming videos and esports insights!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '14:00', close_time: '23:00', is_closed: false },
        { day: 'tuesday', open_time: '14:00', close_time: '23:00', is_closed: false },
        { day: 'wednesday', open_time: '14:00', close_time: '23:00', is_closed: false },
        { day: 'thursday', open_time: '14:00', close_time: '23:00', is_closed: false },
        { day: 'friday', open_time: '16:00', close_time: '24:00', is_closed: false },
        { day: 'saturday', open_time: '12:00', close_time: '24:00', is_closed: false },
        { day: 'sunday', open_time: '12:00', close_time: '22:00', is_closed: false }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/cyberninja',
      calendar_link: 'https://calendar.google.com/cyberninja',
      collab_info: 'Open to brand partnerships, gaming collaborations, and tournament participation. Minimum 48-hour notice required.'
    },
    testimonials: {
      reviews: [
        { client_name: 'GamerFan2023', review: 'Best streamer ever! Amazing gameplay and super entertaining. Never miss a stream!', rating: '5', platform: 'Twitch' },
        { client_name: 'ProGamer_Elite', review: 'Learned so much from watching CyberNinja. Improved my rank significantly thanks to the tips and strategies!', rating: '5', platform: 'YouTube' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe width="600" height="450" style="border:0;" loading="lazy" allowfullscreen src="https://maps.google.com/maps?q=Los%20Angeles%20CA&z=11&output=embed"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/twitch-live-game-streaming/id460177396',
      play_store_url: 'https://play.google.com/store/apps/details?id=tv.twitch.android.app'
    },
    contact_form: {
      form_title: 'Level Up Together',
      form_description: 'Ready to collaborate, sponsor, or just want to connect? Drop me a message and let\'s create some epic gaming content together!'
    },
    action_buttons: {
      contact_button_text: 'LEVEL UP TOGETHER',
      appointment_button_text: 'BOOK COLLAB SESSION',
      save_contact_button_text: 'SAVE GAMER TAG'
    },
    thank_you: {
      message: 'GG! Thanks for reaching out. I\'ll get back to you within 24 hours. Keep gaming and stay awesome!'
    },    seo: {
      meta_title: 'CyberNinja_X | Pro Gamer, Streamer, and Esports Creator',
      meta_description: 'Competitive gaming highlights, live streams, tutorials, and collaborations from CyberNinja_X.',
      keywords: 'gaming streamer, esports, valorant, twitch streamer, youtube gaming, gameplay highlights',
      og_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="gaming-stats"><h4>Gaming Stats</h4><p>🏆 Tournament Wins: 15</p><p>⚡ Current Rank: Immortal</p><p>🎯 Headshot %: 78%</p></div>',
      section_title: 'Gaming Stats',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Add Me to Your Gaming Network',
      qr_description: 'Scan this QR code to instantly connect and follow my gaming journey!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 CyberNinja_X Gaming. All rights reserved.'
    }
  }
};
