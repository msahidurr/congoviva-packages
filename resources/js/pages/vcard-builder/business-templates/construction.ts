import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const constructionTemplate = {
  name: t('Construction & Contractor'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Company Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
        { name: 'license_number', type: 'text', label: t('License Number') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'service_area', type: 'text', label: t('Service Area') }
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'renovation', label: t('Renovation') },
              { value: 'plumbing', label: t('Plumbing') },
              { value: 'electrical', label: t('Electrical') },
              { value: 'roofing', label: t('Roofing') },
              { value: 'painting', label: t('Painting') },
              { value: 'flooring', label: t('Flooring') },
              { value: 'landscaping', label: t('Landscaping') },
              { value: 'carpentry', label: t('Carpentry') },
              { value: 'masonry', label: t('Masonry') },
              { value: 'hvac', label: t('HVAC') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Project Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Construction Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'project_timelapse', label: t('Project Timelapse') },
              { value: 'before_after', label: t('Before & After') },
              { value: 'process_demo', label: t('Process Demonstration') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'team_introduction', label: t('Team Introduction') },
              { value: 'safety_procedures', label: t('Safety Procedures') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'project_category', type: 'select', label: t('Project Category'), options: [
              { value: 'residential', label: t('Residential') },
              { value: 'commercial', label: t('Commercial') },
              { value: 'renovation', label: t('Renovation') },
              { value: 'new_construction', label: t('New Construction') }
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
      key: 'projects',
      name: t('Projects'),
      fields: [
        {
          name: 'project_list',
          type: 'repeater',
          label: t('Projects'),
          fields: [
            { name: 'title', type: 'text', label: t('Project Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'location', type: 'text', label: t('Location') },
            { name: 'before_image', type: 'file', label: t('Before Image') },
            { name: 'after_image', type: 'file', label: t('After Image') },
            { name: 'category', type: 'select', label: t('Category'), options: [
              { value: 'residential', label: t('Residential') },
              { value: 'commercial', label: t('Commercial') },
              { value: 'industrial', label: t('Industrial') },
              { value: 'renovation', label: t('Renovation') },
              { value: 'new_construction', label: t('New Construction') }
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
        { name: 'emergency', type: 'tel', label: t('Emergency Contact') }
      ],
      required: true
    },
    {
      key: 'credentials',
      name: t('Credentials'),
      fields: [
        {
          name: 'certifications',
          type: 'repeater',
          label: t('Certifications & Licenses'),
          fields: [
            { name: 'title', type: 'text', label: t('Certification Title') },
            { name: 'issuer', type: 'text', label: t('Issuing Organization') },
            { name: 'year', type: 'text', label: t('Year') },
            { name: 'image', type: 'file', label: t('Certificate Image') }
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
          label: t('Office Hours'),
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
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'project_type', type: 'text', label: t('Project Type') },
            { name: 'location', type: 'text', label: t('Location') }
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
        { name: 'section_title', type: 'text', label: t('Section Title') },
        { name: 'section_description', type: 'textarea', label: t('Section Description') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'estimate_text', type: 'text', label: t('Free Estimate Button Text') }
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
      key: 'custom_html',
      name: t('Custom HTML'),
      fields: [
        { name: 'html_content', type: 'textarea', label: t('HTML Content') },
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
        { name: 'qr_description', type: 'textarea', label: t('QR Description') }
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
        { name: 'appointment_button_text', type: 'text', label: t('Estimate Button Text') },
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
    { name: 'Construction Yellow', primary: '#F9A826', secondary: '#FFD166', accent: '#FFF3CD', background: '#FFFFFF', text: '#333333' },
    { name: 'Industrial Gray', primary: '#455A64', secondary: '#607D8B', accent: '#CFD8DC', background: '#FFFFFF', text: '#333333' },
    { name: 'Safety Orange', primary: '#FF5722', secondary: '#FF8A65', accent: '#FFCCBC', background: '#FFFFFF', text: '#333333' },
    { name: 'Blueprint Blue', primary: '#1565C0', secondary: '#1E88E5', accent: '#BBDEFB', background: '#FFFFFF', text: '#333333' },
    { name: 'Contractor Black', primary: '#212121', secondary: '#424242', accent: '#F5F5F5', background: '#FFFFFF', text: '#333333' },
    { name: 'Forest Green', primary: '#2E7D32', secondary: '#43A047', accent: '#C8E6C9', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '400,500,700,900' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '400,500,600,700,800' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '400,600,700' },
    { name: 'Oswald', value: 'Oswald, sans-serif', weight: '400,500,600,700' },
    { name: 'Teko', value: 'Teko, sans-serif', weight: '300,400,500,600,700' }
  ],
  defaultColors: {
    primary: '#F9A826',
    secondary: '#FFD166',
    accent: '#FFF3CD',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#E0E0E0',
    buttonText: '#FFFFFF',
    warningColor: '#FF5722'
  },
  defaultFont: 'Roboto, sans-serif',
  themeStyle: {
    layout: 'construction-layout',
    headerStyle: 'industrial',
    cardStyle: 'solid',
    buttonStyle: 'square',
    iconStyle: 'bold',
    spacing: 'compact',
    shadows: 'strong',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'BuildRight Construction',
      tagline: 'Quality craftsmanship for all your construction needs',
      logo: '',
      license_number: 'LIC #123456'
    },
    about: {
      description: 'BuildRight Construction has been serving the community since 2005. We specialize in residential and commercial construction projects, delivering high-quality workmanship and exceptional customer service. Our team of skilled professionals is committed to bringing your vision to life on time and within budget.',
      year_established: '2005',
      service_area: 'Greater Portland Area and Surrounding Counties'
    },
    services: {
      service_list: [
        { title: 'Home Renovations', description: 'Complete home remodeling services including kitchens, bathrooms, basements, and additions.', icon: 'renovation' },
        { title: 'New Construction', description: 'Custom home building from foundation to finishing touches, built to your specifications.', icon: 'carpentry' },
        { title: 'Roofing', description: 'Roof installation, repair, and replacement using quality materials with expert craftsmanship.', icon: 'roofing' },
        { title: 'Electrical Services', description: 'Comprehensive electrical work including installation, repairs, and upgrades to meet code requirements.', icon: 'electrical' }
      ]
    },
    projects: {
      project_list: [
        {
          title: 'Modern Kitchen Remodel',
          description: 'Complete kitchen renovation featuring custom cabinetry, quartz countertops, and high-end appliances.',
          location: 'Portland, OR',
          before_image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
          after_image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
          category: 'residential'
        },
        {
          title: 'Commercial Office Renovation',
          description: 'Full interior renovation of a 5,000 sq ft office space including new flooring, lighting, and partition walls.',
          location: 'Beaverton, OR',
          before_image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
          after_image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80',
          category: 'commercial'
        },
        {
          title: 'Custom Home Build',
          description: 'New construction of a 3,200 sq ft custom home with energy-efficient features and smart home technology.',
          location: 'Lake Oswego, OR',
          before_image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=80',
          after_image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80',
          category: 'new_construction'
        }
      ]
    },
    contact: {
      email: 'info@buildrightconstruction.com',
      phone: '(503) 555-1234',
      website: 'https://www.buildrightconstruction.com',
      address: '123 Builder Way, Portland, OR 97201',
      emergency: '(503) 555-9876'
    },
    credentials: {
      certifications: [
        { title: 'General Contractor License', issuer: 'Oregon Construction Contractors Board', year: '2005', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
        { title: 'OSHA Safety Certification', issuer: 'Occupational Safety and Health Administration', year: '2022', image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=900&q=80' },
        { title: 'Energy Trust of Oregon Trade Ally', issuer: 'Energy Trust of Oregon', year: '2018', image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/buildrightconstruction', username: 'BuildRight Construction' },
        { platform: 'instagram', url: 'https://instagram.com/buildrightconstruction', username: '@buildrightconstruction' },
        { platform: 'houzz', url: 'https://houzz.com/pro/buildrightconstruction', username: 'BuildRight Construction' },
        { platform: 'youtube', url: 'https://youtube.com/buildrightconstruction', username: 'BuildRight Construction' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Kitchen Renovation Timelapse', description: 'Watch our complete kitchen renovation from demolition to final reveal', video_type: 'project_timelapse', embed_url: 'https://www.youtube.com/watch?v=Yj4y7blPKNc', thumbnail: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80', duration: '3:45', project_category: 'renovation' },
        { title: 'Custom Home Build Process', description: 'Follow the construction of a custom home from foundation to move-in ready', video_type: 'process_demo', embed_url: 'https://www.youtube.com/watch?v=poJVAM_p39c', thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80', duration: '12:30', project_category: 'new_construction' },
        { title: 'Client Success Story - The Johnson Family', description: 'Hear from satisfied clients about their home renovation experience', video_type: 'client_testimonial', embed_url: 'https://www.youtube.com/watch?v=ZBHZ7KClEfQ', thumbnail: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80', duration: '4:15', project_category: 'residential' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/buildrightconstruction',
      channel_name: 'BuildRight Construction',
      subscriber_count: '15.7K',
      featured_playlist: 'https://youtube.com/playlist?list=PLhomerenovations',
      latest_video_embed: 'https://www.youtube.com/watch?v=poJVAM_p39c',
      channel_description: 'Construction tutorials, project timelapses, and home improvement tips from licensed contractors with 20+ years of experience.'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '07:00', close_time: '17:00', is_closed: false },
        { day: 'tuesday', open_time: '07:00', close_time: '17:00', is_closed: false },
        { day: 'wednesday', open_time: '07:00', close_time: '17:00', is_closed: false },
        { day: 'thursday', open_time: '07:00', close_time: '17:00', is_closed: false },
        { day: 'friday', open_time: '07:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '08:00', close_time: '12:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    gallery: {
      photos: [
        {
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
          caption: 'Custom kitchen with island and pendant lighting'
        },
        {
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
          caption: 'Cozy recreation room with lounge seating'
        },
        {
          image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80',
          caption: 'Bathroom remodel with walk-in shower'
        },
        {
          image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
          caption: 'Exterior siding and trim work'
        },
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Michael & Sarah Johnson', review: 'BuildRight transformed our outdated kitchen into a modern, functional space that exceeded our expectations. Their attention to detail and craftsmanship was impressive.', rating: '5', project_type: 'Kitchen Remodel', location: 'Portland' },
        { client_name: 'Northwest Medical Group', review: 'We hired BuildRight for our office renovation and were extremely pleased with the results. They worked efficiently to minimize disruption to our practice and delivered on schedule.', rating: '5', project_type: 'Commercial Renovation', location: 'Beaverton' },
        { client_name: 'David Wilson', review: 'From design to completion, BuildRight made building our custom home a smooth process. Their communication was excellent and the quality of work is outstanding.', rating: '5', project_type: 'Custom Home', location: 'Lake Oswego' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/buildrightconstruction',
      section_title: 'Ready to Start Your Project?',
      section_description: 'Contact us today for professional service and quality workmanship.',
      booking_text: 'Schedule a Consultation',
      estimate_text: 'Request a Free Estimate'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=123%20Builder%20Way%2C%20Portland%2C%20OR%2097201&z=14&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=123+Builder+Way,+Portland,+OR+97201'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/houzz-home-design-remodel/id399563465',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.houzz.app',
      app_description: 'Download our app to track your project progress, communicate with our team, and manage payments.'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Have a project in mind? Fill out the form below to discuss your construction needs and receive a free estimate.'
    },
    custom_html: {
      html_content: '<h3>Quality Construction Services</h3><p>With over 20 years of experience, we deliver exceptional construction projects on time and within budget. Our licensed professionals ensure quality workmanship and customer satisfaction.</p>',
      section_title: 'Why Choose Us',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Services',
      qr_description: 'Scan to share our construction services with others'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    thank_you: {
      message: 'Thank you for contacting BuildRight Construction. We appreciate your interest and will get back to you within 1-2 business days to discuss your project.'
    },
    seo: {
      meta_title: 'BuildRight Construction | Remodeling, Renovation, and Custom Builds',
      meta_description: 'Licensed construction company offering residential remodels, commercial renovations, and custom home builds.',
      keywords: 'construction company, remodeling, renovation, custom home build, contractor, Portland construction',
      og_image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      appointment_button_text: 'Get Free Estimate',
      save_contact_button_text: 'Save Contact'
    },
    footer: {
      show_footer: true,
      footer_text: 'Licensed, bonded, and insured. Serving the community with quality construction services since 2005.',
      footer_links: [
        { title: 'License Verification', url: '#' },
        { title: 'Insurance Info', url: '#' },
        { title: 'Safety Standards', url: '#' }
      ]
    },
    copyright: {
      text: '© 2025 BuildRight Construction. All rights reserved. CCB #123456'
    }
  }
};
