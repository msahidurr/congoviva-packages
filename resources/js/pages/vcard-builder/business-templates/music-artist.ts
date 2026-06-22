import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const musicArtistTemplate = {
  name: t('Music Artist'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Artist/Band Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo/Photo') },
        { name: 'cover_image', type: 'file', label: t('Cover Image') },
        { name: 'cta_text', type: 'text', label: t('Call to Action Text') },
        { name: 'cta_url', type: 'url', label: t('Call to Action URL') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('Bio') },
        { name: 'genre', type: 'text', label: t('Music Genre') },
        { name: 'origin', type: 'text', label: t('Origin/Location') },
        { name: 'formed_year', type: 'number', label: t('Year Formed/Started') }
      ],
      required: false
    },
    {
      key: 'music',
      name: t('Music'),
      fields: [
        {
          name: 'tracks',
          type: 'repeater',
          label: t('Featured Tracks'),
          fields: [
            { name: 'title', type: 'text', label: t('Track Title') },
            { name: 'album', type: 'text', label: t('Album') },
            { name: 'year', type: 'number', label: t('Release Year') },
            { name: 'embed_url', type: 'textarea', label: t('Embed URL (Spotify, SoundCloud, etc.)') },
            { name: 'stream_url', type: 'url', label: t('Stream URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Music Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'embed_url', type: 'textarea', label: t('Embed URL (YouTube, Vimeo, etc.)') },
            { name: 'thumbnail', type: 'file', label: t('Thumbnail Image') }
          ]
        }
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
          label: t('Services'),
          fields: [
            { name: 'name', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price (if applicable)') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'music', label: t('Music') },
              { value: 'mic', label: t('Microphone') },
              { value: 'headphones', label: t('Headphones') },
              { value: 'radio', label: t('Radio') },
              { value: 'disc', label: t('Disc') },
              { value: 'guitar', label: t('Guitar') },
              { value: 'piano', label: t('Piano') },
              { value: 'drum', label: t('Drum') }
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
        { name: 'booking_email', type: 'email', label: t('Booking Email') }
      ],
      required: true
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
      key: 'tour_dates',
      name: t('Tour Dates'),
      fields: [
        {
          name: 'events',
          type: 'repeater',
          label: t('Upcoming Shows'),
          fields: [
            { name: 'date', type: 'date', label: t('Date') },
            { name: 'venue', type: 'text', label: t('Venue') },
            { name: 'city', type: 'text', label: t('City') },
            { name: 'country', type: 'text', label: t('Country') },
            { name: 'ticket_url', type: 'url', label: t('Ticket URL') },
            { name: 'sold_out', type: 'checkbox', label: t('Sold Out') }
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
          label: t('Availability Hours'),
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
            { name: 'is_closed', type: 'checkbox', label: t('Unavailable') }
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
          label: t('Reviews & Press'),
          fields: [
            { name: 'reviewer_name', type: 'text', label: t('Reviewer/Publication Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'source', type: 'text', label: t('Source') },
            { name: 'source_url', type: 'url', label: t('Source URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Booking'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'booking_email', type: 'email', label: t('Booking Email') },
        { name: 'booking_description', type: 'textarea', label: t('Booking Information') }
      ],
      required: false
    },
    {
      key: 'band_members',
      name: t('Band Members'),
      fields: [
        {
          name: 'members',
          type: 'repeater',
          label: t('Members'),
          fields: [
            { name: 'name', type: 'text', label: t('Name') },
            { name: 'role', type: 'text', label: t('Role/Instrument') },
            { name: 'bio', type: 'textarea', label: t('Bio') },
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'instagram', type: 'url', label: t('Instagram URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'merchandise',
      name: t('Merchandise'),
      fields: [
        {
          name: 'items',
          type: 'repeater',
          label: t('Merch Items'),
          fields: [
            { name: 'name', type: 'text', label: t('Item Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'image', type: 'file', label: t('Item Image') },
            { name: 'store_url', type: 'url', label: t('Store URL') }
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
    { name: 'Rock Vibe', primary: '#E91E63', secondary: '#FF4081', accent: '#311B92', background: '#121212', text: '#FFFFFF' },
    { name: 'Indie Folk', primary: '#795548', secondary: '#A1887F', accent: '#EFEBE9', background: '#FFFFFF', text: '#3E2723' },
    { name: 'Electronic', primary: '#00BCD4', secondary: '#4DD0E1', accent: '#006064', background: '#121212', text: '#FFFFFF' },
    { name: 'Hip Hop', primary: '#FFC107', secondary: '#FFCA28', accent: '#212121', background: '#000000', text: '#FFFFFF' },
    { name: 'Classical', primary: '#3F51B5', secondary: '#5C6BC0', accent: '#E8EAF6', background: '#FFFFFF', text: '#1A237E' },
    { name: 'Jazz', primary: '#673AB7', secondary: '#7E57C2', accent: '#EDE7F6', background: '#121212', text: '#FFFFFF' }
  ],
  fontOptions: [
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700,800' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Oswald', value: 'Oswald, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Abril Fatface', value: 'Abril Fatface, cursive', weight: '400' },
    { name: 'Permanent Marker', value: 'Permanent Marker, cursive', weight: '400' }
  ],
  defaultColors: {
    primary: '#E91E63',
    secondary: '#FF4081',
    accent: '#311B92',
    background: '#121212',
    text: '#FFFFFF',
    cardBg: '#1E1E1E',
    borderColor: '#333333',
    buttonText: '#FFFFFF',
    highlightColor: '#FFC107'
  },
  defaultFont: 'Montserrat, sans-serif',
  themeStyle: {
    layout: 'music-artist-layout',
    headerStyle: 'fullscreen',
    cardStyle: 'sharp',
    buttonStyle: 'rounded',
    iconStyle: 'bold',
    spacing: 'comfortable',
    shadows: 'strong',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'Sonic Wave',
      tagline: 'Alternative Rock Band from Los Angeles',
      logo: '',
      cover_image: '',
      cta_text: 'Listen Now',
      cta_url: '#music'
    },
    about: {
      description: 'Sonic Wave is an alternative rock band known for their energetic performances and thought-provoking lyrics. Formed in 2018, the band has quickly risen in the indie music scene with their unique blend of rock, electronic, and punk influences.',
      genre: 'Alternative Rock',
      origin: 'Los Angeles, CA',
      formed_year: '2018'
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Book Performance',
      save_contact_button_text: 'Save Contact'
    },
    music: {
      tracks: [
        { title: 'Midnight Echo', album: 'Neon Dreams', year: '2023', embed_url: '', stream_url: 'https://open.spotify.com/' },
        { title: 'Electric Pulse', album: 'Neon Dreams', year: '2023', embed_url: '', stream_url: 'https://open.spotify.com/' },
        { title: 'Fading Memories', album: 'First Light', year: '2021', embed_url: '', stream_url: 'https://open.spotify.com/' },
        { title: 'Daybreak', album: 'First Light', year: '2021', embed_url: '', stream_url: 'https://open.spotify.com/' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Alternative Rock Official Music Video', description: 'Directed by Alex Johnson', embed_url: 'https://www.youtube.com/embed/ktvTqknDobU', thumbnail: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80' },
        { title: 'Live Rock Band Festival Performance', description: 'Full performance from Summer 2023', embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    services: {
      offerings: [
        { name: 'Live Performances', description: 'Book Sonic Wave for your venue or private event', price: 'Contact for pricing', icon: 'mic' },
        { name: 'Studio Sessions', description: 'Hire band members for studio recording sessions', price: 'Starting at $500', icon: 'headphones' },
        { name: 'Songwriting', description: 'Collaborative songwriting and production', price: 'Custom quotes', icon: 'music' }
      ]
    },
    contact: {
      email: 'info@sonicwaveband.com',
      phone: '(555) 123-4567',
      website: 'https://www.sonicwaveband.com',
      address: 'Los Angeles, CA',
      booking_email: 'booking@sonicwaveband.com'
    },
    social: {
      social_links: [
        { platform: 'spotify', url: 'https://open.spotify.com/artist/sonicwave', username: 'Sonic Wave' },
        { platform: 'instagram', url: 'https://instagram.com/sonicwave', username: '@sonicwave' },
        { platform: 'youtube', url: 'https://youtube.com/sonicwave', username: 'Sonic Wave Official' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/sonicwave',
      channel_name: 'Sonic Wave Official',
      subscriber_count: '234K',
      featured_playlist: 'https://youtube.com/playlist?list=PLmusicvideos',
      latest_video_embed: 'https://www.youtube.com/embed/ktvTqknDobU',
      channel_description: 'Official music videos, live performances, and behind-the-scenes content from alternative rock band Sonic Wave. Subscribe for new releases!'
    },
    tour_dates: {
      events: [
        { date: '2025-06-15', venue: 'The Echo', city: 'Los Angeles', country: 'USA', ticket_url: '#', sold_out: false },
        { date: '2025-06-22', venue: 'Bottom of the Hill', city: 'San Francisco', country: 'USA', ticket_url: '#', sold_out: false },
        { date: '2025-07-05', venue: 'Mercury Lounge', city: 'New York', country: 'USA', ticket_url: '#', sold_out: false }
      ]
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '10:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '10:00', close_time: '16:00', is_closed: false },
        { day: 'saturday', open_time: '00:00', close_time: '00:00', is_closed: true },
        { day: 'sunday', open_time: '00:00', close_time: '00:00', is_closed: true }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80', caption: 'Live at Sunset Festival 2023' },
        { image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80', caption: 'Behind the scenes at our music video shoot' },
        { image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', caption: 'Studio session for Neon Dreams album' },
        { image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=80', caption: 'Backstage at The Echo' }
      ]
    },
    testimonials: {
      reviews: [
        { reviewer_name: 'Rolling Stone', review: '"One of the most promising new acts in the alternative rock scene. Their energy is infectious and their sound is refreshingly authentic."', source: 'Album Review', source_url: '#' },
        { reviewer_name: 'Pitchfork', review: '"Sonic Wave delivers a powerful sonic experience that blends nostalgic rock elements with modern production techniques."', source: 'Concert Review', source_url: '#' },
        { reviewer_name: 'LA Weekly', review: '"Their live performances are not to be missed - a true showcase of raw talent and musical chemistry."', source: 'Feature Article', source_url: '#' }
      ]
    },
    appointments: {
      booking_url: 'https://booking.sonicwaveband.com',
      booking_text: 'Book Us',
      booking_email: 'booking@sonicwaveband.com',
      booking_description: 'Interested in booking Sonic Wave for your venue, festival, or private event? Fill out our booking form or contact our management team directly.'
    },
    band_members: {
      members: [
        { name: 'Alex Rivera', role: 'Lead Vocals, Guitar', bio: 'Founding member with a background in classical guitar and a passion for storytelling through music.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', instagram: 'https://instagram.com/alexrivera' },
        { name: 'Jamie Wong', role: 'Bass, Backing Vocals', bio: 'Brings the groove with influences ranging from funk to post-punk. Jamie joined the band in 2019.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', instagram: 'https://instagram.com/jamiewong' },
        { name: 'Taylor Smith', role: 'Drums', bio: 'The rhythmic foundation of Sonic Wave with a jazz background and energetic performance style.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', instagram: 'https://instagram.com/taylorsmith' },
        { name: 'Morgan Lee', role: 'Keyboards, Synth', bio: 'Electronic music producer turned band member who adds atmospheric textures to the band\'s sound.', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', instagram: 'https://instagram.com/morganlee' }
      ]
    },
    merchandise: {
      items: [
        { name: 'Neon Dreams Vinyl', description: 'Limited edition 180g vinyl with exclusive artwork', price: '$25.00', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80', store_url: '#' },
        { name: 'Tour T-Shirt', description: 'Black cotton tee with 2025 tour dates', price: '$20.00', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', store_url: '#' },
        { name: 'Logo Hoodie', description: 'Premium pullover hoodie with embroidered logo', price: '$45.00', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80', store_url: '#' }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=The%20Echo%20Los%20Angeles%2C%20CA&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=The+Echo+Los+Angeles+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/spotify-music-and-podcasts/id324684580',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.spotify.music',
      app_description: 'Get exclusive content, early access to tickets, and connect with other fans through our official mobile app.'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Questions, collaboration requests, or just want to say hello? Send us a message and we\'ll get back to you.'
    },
    thank_you: {
      message: 'Thanks for connecting with Sonic Wave! We appreciate your support and will respond to your message soon.'
    },    seo: {
      meta_title: 'Sonic Wave | Alternative Rock Music, Shows, and Merch',
      meta_description: 'Follow Sonic Wave for new music, live performances, tour dates, videos, and official merchandise.',
      keywords: 'music artist, rock band, live music, tour dates, official merch, alternative rock',
      og_image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="music-achievements"><h4>Music Achievements</h4><p>🏆 Best Alternative Rock Album 2023</p><p>🎤 100+ Live Performances</p><p>💿 500K+ Streams on Spotify</p><p>🎵 Featured on Major Playlists</p></div>',
      section_title: 'Awards & Recognition',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with Sonic Wave',
      qr_description: 'Scan to follow us on all platforms and never miss a beat!',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Follow us on all platforms and never miss a beat! Connect with Sonic Wave for the latest music, tour dates, and exclusive content.',
      footer_links: [
        { title: 'Stream Music', url: '#music' },
        { title: 'Tour Dates', url: '#tour' },
        { title: 'Merchandise', url: '#merch' },
        { title: 'Book Us', url: '#booking' }
      ]
    },
    copyright: {
      text: '© 2025 Sonic Wave. All rights reserved.'
    }
  }
};
