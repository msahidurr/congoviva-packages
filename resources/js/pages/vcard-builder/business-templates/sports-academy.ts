import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';
import { socialPlatformsConfig } from '../social-platforms-config';

export const sportsAcademyTemplate = {
  name: t('Sports Academy'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Academy Name') },
        { name: 'tagline', type: 'text', label: t('Tagline') },
        { name: 'sport_type', type: 'text', label: t('Sport Type') },
        { name: 'founded_year', type: 'text', label: t('Founded Year') },
        { name: 'logo', type: 'file', label: t('Academy Logo') },
        { name: 'cover_image', type: 'file', label: t('Cover Image') },
      ],
      required: true,
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'location', type: 'text', label: t('Location / Address') },
      ],
      required: true,
    },
    {
      key: 'about',
      name: t('About Academy'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'mission', type: 'textarea', label: t('Our Mission') },
        { name: 'total_players', type: 'text', label: t('Total Players') },
        { name: 'total_coaches', type: 'text', label: t('Total Coaches') },
        { name: 'trophies_won', type: 'text', label: t('Trophies Won') },
        { name: 'years_active', type: 'text', label: t('Years Active') },
      ],
      required: false,
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
            { name: 'title', type: 'text', label: t('Program Name') },
            { name: 'age_group', type: 'text', label: t('Age Group') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'fee', type: 'text', label: t('Fee') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'coaches',
      name: t('Coaching Staff'),
      fields: [
        {
          name: 'coach_list',
          type: 'repeater',
          label: t('Coaches'),
          fields: [
            { name: 'name', type: 'text', label: t('Coach Name') },
            { name: 'role', type: 'text', label: t('Role / Position') },
            { name: 'experience', type: 'text', label: t('Experience') },
            { name: 'photo', type: 'file', label: t('Photo') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'achievements',
      name: t('Achievements'),
      fields: [
        {
          name: 'achievement_list',
          type: 'repeater',
          label: t('Achievements'),
          fields: [
            { name: 'title', type: 'text', label: t('Title') },
            { name: 'year', type: 'text', label: t('Year') },
            { name: 'description', type: 'textarea', label: t('Description') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'schedule',
      name: t('Training Schedule'),
      fields: [
        {
          name: 'schedule_list',
          type: 'repeater',
          label: t('Schedule'),
          fields: [
            {
              name: 'day',
              type: 'select',
              label: t('Day'),
              options: [
                { value: 'monday', label: t('Monday') },
                { value: 'tuesday', label: t('Tuesday') },
                { value: 'wednesday', label: t('Wednesday') },
                { value: 'thursday', label: t('Thursday') },
                { value: 'friday', label: t('Friday') },
                { value: 'saturday', label: t('Saturday') },
                { value: 'sunday', label: t('Sunday') },
              ],
            },
            { name: 'session', type: 'text', label: t('Session Name') },
            { name: 'time', type: 'text', label: t('Time') },
            { name: 'age_group', type: 'text', label: t('Age Group') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'gallery',
      name: t('Gallery'),
      fields: [
        {
          name: 'gallery_images',
          type: 'repeater',
          label: t('Gallery Images'),
          fields: [
            { name: 'image', type: 'file', label: t('Image') },
            { name: 'caption', type: 'text', label: t('Caption') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'testimonials',
      name: t('Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Reviews'),
          fields: [
            { name: 'client_name', type: 'text', label: t('Parent / Player Name') },
            { name: 'review', type: 'textarea', label: t('Review') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
          ],
        },
      ],
      required: false,
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
            {
              name: 'platform',
              type: 'select',
              label: t('Platform'),
              options: socialPlatformsConfig.map((p) => ({ value: p.value, label: p.label })),
            },
            { name: 'url', type: 'url', label: t('Profile URL') },
            { name: 'username', type: 'text', label: t('Username') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'appointments',
      name: t('Enrollment / Booking'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
      ],
      required: false,
    },
    {
      key: 'google_map',
      name: t('Location'),
      fields: [
        { name: 'map_embed_url', type: 'textarea', label: t('Google Maps Embed URL') },
        { name: 'directions_url', type: 'url', label: t('Google Maps Directions URL') },
      ],
      required: false,
    },
    {
      key: 'videos',
      name: t('Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Thumbnail') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'app_download',
      name: t('App Download'),
      fields: [
        { name: 'app_store_url', type: 'url', label: t('App Store URL') },
        { name: 'play_store_url', type: 'url', label: t('Play Store URL') },
      ],
      required: false,
    },
    {
      key: 'contact_form',
      name: t('Contact Form'),
      fields: [
        { name: 'form_title', type: 'text', label: t('Form Title') },
        { name: 'form_description', type: 'textarea', label: t('Form Description') },
      ],
      required: false,
    },
    {
      key: 'qr_share',
      name: t('QR Code Share'),
      fields: [
        { name: 'enable_qr', type: 'checkbox', label: t('Enable QR Code Sharing') },
        { name: 'qr_title', type: 'text', label: t('QR Section Title') },
        { name: 'qr_description', type: 'textarea', label: t('QR Description') },
        {
          name: 'qr_size',
          type: 'select',
          label: t('QR Code Size'),
          options: [
            { value: 'small', label: t('Small (128px)') },
            { value: 'medium', label: t('Medium (200px)') },
            { value: 'large', label: t('Large (300px)') },
          ],
        },
      ],
      required: false,
    },
    {
      key: 'custom_html',
      name: t('Custom HTML'),
      fields: [
        { name: 'html_content', type: 'textarea', label: t('Custom HTML Code') },
        { name: 'section_title', type: 'text', label: t('Section Title') },
        { name: 'show_title', type: 'checkbox', label: t('Show Section Title') },
      ],
      required: false,
    },
    {
      key: 'language',
      name: t('Language Settings'),
      fields: [
        { name: 'enable_language_switcher', type: 'checkbox', label: t('Enable Language Switcher') },
        {
          name: 'template_language',
          type: 'select',
          label: t('Template Language'),
          options: languageData.map((lang) => ({
            value: lang.code,
            label: `${String.fromCodePoint(
              ...lang.countryCode
                .toUpperCase()
                .split('')
                .map((char) => 127397 + char.charCodeAt())
            )} ${lang.name}`,
          })),
        },
      ],
      required: false,
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'appointment_button_text', type: 'text', label: t('Enrollment Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') },
      ],
      required: false,
    },
    {
      key: 'thank_you',
      name: t('Thank You Message'),
      fields: [{ name: 'message', type: 'textarea', label: t('Thank You Message') }],
      required: false,
    },
    {
      key: 'copyright',
      name: t('Copyright'),
      fields: [{ name: 'text', type: 'text', label: t('Copyright Text') }],
      required: false,
    },
    {
      key: 'seo',
      name: t('SEO Settings'),
      fields: [
        { name: 'meta_title', type: 'text', label: t('Meta Title') },
        { name: 'meta_description', type: 'textarea', label: t('Meta Description') },
        { name: 'keywords', type: 'text', label: t('Keywords') },
        { name: 'og_image', type: 'url', label: t('Open Graph Image URL') },
      ],
      required: false,
    },
    {
      key: 'pixels',
      name: t('Pixel & Analytics'),
      fields: [
        { name: 'google_analytics', type: 'text', label: t('Google Analytics ID') },
        { name: 'facebook_pixel', type: 'text', label: t('Facebook Pixel ID') },
        { name: 'gtm_id', type: 'text', label: t('Google Tag Manager ID') },
        { name: 'custom_head', type: 'textarea', label: t('Custom Head Code') },
        { name: 'custom_body', type: 'textarea', label: t('Custom Body Code') },
      ],
      required: false,
    },
  ],
  colorPresets: [
    { name: 'Teal Storm', primary: '#0d9488', secondary: '#0f766e', accent: '#ccfbf1', background: '#fbfefe', text: '#4f6f6b' },
    { name: 'Victory Red', primary: '#dc2626', secondary: '#b91c1c', accent: '#fee2e2', background: '#fffefe', text: '#995252' },
    { name: 'Elite Blue', primary: '#1d4ed8', secondary: '#1e40af', accent: '#dbeafe', background: '#feffff', text: '#4a67a1' },
    { name: 'Champion Green', primary: '#16a34a', secondary: '#15803d', accent: '#dcfce7', background: '#fdfffe', text: '#4b7a5f' },
    { name: 'Royal Purple', primary: '#7c3aed', secondary: '#6d28d9', accent: '#ede9fe', background: '#fffefe', text: '#6f5a96' },
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, sans-serif', weight: '400,500,600,700' },
    { name: 'Barlow', value: 'Barlow, Arial, sans-serif', weight: '400,500,600,700,800' },
    { name: 'Rajdhani', value: 'Rajdhani, sans-serif', weight: '400,500,600,700' },
    { name: 'Roboto Condensed', value: 'Roboto Condensed, Arial Narrow, sans-serif', weight: '400,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '400,500,600,700' },

  ],
  defaultColors: {
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#ccfbf1',
    background: '#fbfefe',
    text: '#4f6f6b',
    cardBg: '#ffffff',
    borderColor: '#99f6e4',
  },
  defaultFont: 'Inter, sans-serif',
  themeStyle: {
    layout: 'sports-bold',
    headerStyle: 'stadium',
    cardStyle: 'athletic',
    buttonStyle: 'champion',
    spacing: 'dynamic',
  },
  defaultData: {
    header: {
      name: 'Elite Sports Academy',
      tagline: 'Train Hard. Play Smart. Win Together.',
      sport_type: 'Football',
      founded_year: '2010',
      logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
      cover_image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&q=80',
    },
    contact: {
      email: 'info@elitesports.com',
      phone: '+1 (555) 987-6543',
      website: 'https://elitesports.com',
      location: 'Stadium Road, Sports City, CA',
    },
    about: {
      description:
        'Elite Sports Academy is a premier football training institution dedicated to developing the next generation of champions. We combine world-class coaching with state-of-the-art facilities.',
      mission: 'To nurture athletic talent, build character, and create champions both on and off the field.',
      total_players: '250+',
      total_coaches: '12',
      trophies_won: '48',
      years_active: '14',
    },
    programs: {
      program_list: [
        {
          title: 'Junior Academy',
          age_group: '6-12 years',
          description: 'Foundational skills, fun drills, and team play for young athletes.',
          duration: '3 months',
          fee: '$150/month',
        },
        {
          title: 'Youth Elite',
          age_group: '13-17 years',
          description: 'Advanced tactical training, fitness conditioning, and competitive matches.',
          duration: '6 months',
          fee: '$200/month',
        },
        {
          title: 'Senior Pro',
          age_group: '18+ years',
          description: 'Professional-level training for aspiring and semi-pro players.',
          duration: '12 months',
          fee: '$250/month',
        },
      ],
    },
    coaches: {
      coach_list: [
        { name: 'Carlos Mendez', role: 'Head Coach', experience: '15 years', photo: '' },
        { name: 'Sarah Johnson', role: 'Fitness & Conditioning', experience: '10 years', photo: '' },
        { name: 'David Park', role: 'Youth Development Coach', experience: '8 years', photo: '' },
      ],
    },
    achievements: {
      achievement_list: [
        {
          title: 'Regional Championship',
          year: '2024',
          description: 'Won the Regional U-17 Football Championship for the 3rd consecutive year.',
        },
        { title: 'National Youth Cup', year: '2023', description: 'Runners-up at the National Youth Football Cup.' },
        { title: 'Best Academy Award', year: '2022', description: 'Recognized as the Best Sports Academy in the State.' },
      ],
    },
    schedule: {
      schedule_list: [
        { day: 'monday', session: 'Junior Training', time: '4:00 PM - 6:00 PM', age_group: '6-12' },
        { day: 'wednesday', session: 'Youth Elite', time: '5:00 PM - 7:30 PM', age_group: '13-17' },
        { day: 'friday', session: 'Senior Pro', time: '6:00 PM - 8:30 PM', age_group: '18+' },
        { day: 'saturday', session: 'Open Match Day', time: '9:00 AM - 12:00 PM', age_group: 'All' },
      ],
    },
    gallery: {
      gallery_images: [
        { image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80', caption: 'Match Day' },
        { image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80', caption: 'Training Session' },
        { image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80', caption: 'Team Photo' },
      ],
    },
    testimonials: {
      reviews: [
        {
          client_name: 'Maria T. (Parent)',
          review: 'My son has improved tremendously since joining Elite Academy. The coaches are professional and caring.',
          rating: '5',
        },
        {
          client_name: 'James K. (Player)',
          review: 'Best decision I made for my football career. The training is intense but rewarding!',
          rating: '5',
        },
        {
          client_name: 'Priya S. (Parent)',
          review: 'Excellent facilities and a great team environment. Highly recommend for any young athlete.',
          rating: '5',
        },
      ],
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/elitesportsacademy', username: 'elitesportsacademy' },
        { platform: 'facebook', url: 'https://facebook.com/elitesportsacademy', username: 'Elite Sports Academy' },
        { platform: 'youtube', url: 'https://youtube.com/elitesportsacademy', username: 'Elite Sports Academy' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/elitesportsacademy', username: 'Elite Sports Academy' },
        { platform: 'x', url: 'https://x.com/elitesportsacad', username: 'elitesportsacad' },
      ],
    },
    appointments: {
      booking_url: 'https://calendly.com/elitesportsacademy',
      calendar_link: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0ExampleEliteSports',
    },
    google_map: {
      map_embed_url:
        '<iframe src="https://www.google.com/maps?q=Rose%20Bowl%20Stadium%2C%20Pasadena%2C%20CA&z=13&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Rose+Bowl+Stadium+Pasadena+CA',
    },
    videos: {
      video_list: [
        {
          title: 'Football Match Day Highlights',
          description: 'Watch key match moments, team coordination, and finishing drills from our academy squad.',
          embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/SapFQrmNl88?si=P1QM0w9KIDBLxex6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
        },
        {
          title: 'Junior Football Training Drills',
          description: 'A focused training session covering agility, passing control, and on-field movement for young players.',
          embed_url: '<iframe width="560" height="315" src="https://www.youtube.com/embed/msZqvHh9_ec?si=5wMM0rgrW1gv__g3" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          thumbnail: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/nike-training-club-wellness/id301521403',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.nike.ntc',
    },
    contact_form: {
      form_title: 'Get In Touch',
      form_description: "Interested in enrolling or have questions? Send us a message and we'll get back to you shortly.",
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Academy',
      qr_description: 'Scan the QR code to explore our academy profile and share it with other athletes and parents.',
      qr_size: 'medium',
    },
    custom_html: {
      html_content: '',
      section_title: 'Announcements',
      show_title: true,
    },
    language: {
      enable_language_switcher: true,
      template_language: 'en',
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Enroll Now',
      save_contact_button_text: 'Save Contact',
    },
    thank_you: {
      message: 'Thank you for visiting Elite Sports Academy. We look forward to helping you achieve your athletic goals!',
    },
    copyright: {
      text: '© 2026 Elite Sports Academy. All rights reserved.',
    },
    seo: {
      meta_title: 'Elite Sports Academy | Professional Football Training',
      meta_description: 'Join Elite Sports Academy for world-class coaching, structured training programs, and a championship mindset.',
      keywords: 'sports academy, football academy, youth training, athletic coaching',
      og_image: '',
    },
    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: '',
    },
  },
};
