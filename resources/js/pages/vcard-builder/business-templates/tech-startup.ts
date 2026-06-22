import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const techStartupTemplate = {
  name: t('Tech Startup'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Company Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
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
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_founded', type: 'number', label: t('Year Founded') },
        { name: 'company_size', type: 'select', label: t('Company Size'), options: [
          { value: 'startup', label: t('Startup (1-10)') },
          { value: 'small', label: t('Small (11-50)') },
          { value: 'medium', label: t('Medium (51-200)') },
          { value: 'large', label: t('Large (201-500)') },
          { value: 'enterprise', label: t('Enterprise (500+)') }
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
          label: t('Products/Services'),
          fields: [
            { name: 'name', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'code', label: t('Code') },
              { value: 'cloud', label: t('Cloud') },
              { value: 'database', label: t('Database') },
              { value: 'mobile', label: t('Mobile') },
              { value: 'desktop', label: t('Desktop') },
              { value: 'security', label: t('Security') },
              { value: 'analytics', label: t('Analytics') },
              { value: 'ai', label: t('AI/ML') }
            ]},
            { name: 'image', type: 'file', label: t('Service Image') },
            { name: 'link', type: 'url', label: t('Learn More URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'features',
      name: t('Key Features'),
      fields: [
        {
          name: 'feature_list',
          type: 'repeater',
          label: t('Features'),
          fields: [
            { name: 'title', type: 'text', label: t('Feature Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'zap', label: t('Speed') },
              { value: 'shield', label: t('Security') },
              { value: 'settings', label: t('Customization') },
              { value: 'users', label: t('Collaboration') },
              { value: 'trending-up', label: t('Analytics') },
              { value: 'smartphone', label: t('Mobile') },
              { value: 'globe', label: t('Global') },
              { value: 'clock', label: t('Time-saving') }
            ]},
            { name: 'image', type: 'file', label: t('Feature Image') }
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
            { name: 'is_closed', type: 'checkbox', label: t('Closed') },
            { name: 'is_remote', type: 'checkbox', label: t('Remote Work Day') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Company Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Tech Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'product_demo', label: t('Product Demo') },
              { value: 'company_intro', label: t('Company Introduction') },
              { value: 'tech_tutorial', label: t('Tech Tutorial') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'behind_scenes', label: t('Behind the Scenes') },
              { value: 'webinar', label: t('Webinar/Presentation') }
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
            { name: 'company', type: 'text', label: t('Company') },
            { name: 'position', type: 'text', label: t('Position') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'client_image', type: 'file', label: t('Client Photo')   }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Demo Request'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'booking_text', type: 'text', label: t('Booking Button Text') },
        { name: 'demo_length', type: 'text', label: t('Demo Length') },
        { name: 'demo_description', type: 'textarea', label: t('Demo Description') }
      ],
      required: false
    },
    {
      key: 'team',
      name: t('Our Team'),
      fields: [
        {
          name: 'members',
          type: 'repeater',
          label: t('Team Members'),
          fields: [
            { name: 'name', type: 'text', label: t('Name') },
            { name: 'title', type: 'text', label: t('Title/Position') },
            { name: 'bio', type: 'textarea', label: t('Bio') },
            { name: 'image', type: 'file', label: t('Photo') },
            { name: 'linkedin', type: 'url', label: t('LinkedIn URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'pricing',
      name: t('Pricing Plans'),
      fields: [
        {
          name: 'plans',
          type: 'repeater',
          label: t('Pricing Plans'),
          fields: [
            { name: 'name', type: 'text', label: t('Plan Name') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'billing_period', type: 'select', label: t('Billing Period'), options: [
              { value: 'monthly', label: t('Monthly') },
              { value: 'annually', label: t('Annually') },
              { value: 'one_time', label: t('One-time') },
              { value: 'custom', label: t('Custom') }
            ]},
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'features', type: 'textarea', label: t('Features (one per line)') },
            { name: 'cta_text', type: 'text', label: t('CTA Button Text') },
            { name: 'cta_url', type: 'url', label: t('CTA URL') },
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
        { name: 'app_features', type: 'textarea', label: t('App Features (one per line)') },
        { name: 'app_image', type: 'file', label: t('App Screenshot') }
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
        { name: 'demo_button_text', type: 'text', label: t('Demo Button Text') },
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
    { name: 'Modern Blue', primary: '#2563EB', secondary: '#3B82F6', accent: '#EFF6FF', background: '#FFFFFF', text: '#1E293B' },
    { name: 'Tech Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#F5F3FF', background: '#FFFFFF', text: '#1E293B' },
    { name: 'Startup Green', primary: '#059669', secondary: '#10b77f', accent: '#ECFDF5', background: '#FFFFFF', text: '#1E293B' },
    { name: 'Dark Mode', primary: '#6366F1', secondary: '#818CF8', accent: '#1E1E2E', background: '#0F0F1A', text: '#F1F5F9' },
    { name: 'Coral Tech', primary: '#F43F5E', secondary: '#FB7185', accent: '#FFF1F2', background: '#FFFFFF', text: '#1E293B' },
    { name: 'Teal Accent', primary: '#0D9488', secondary: '#14B8A6', accent: '#CCFBF1', background: '#FFFFFF', text: '#1E293B' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, sans-serif', weight: '300,400,500,600,700,800' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700,800' },
    { name: 'DM Sans', value: 'DM Sans, sans-serif', weight: '400,500,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700,900' },
    { name: 'Outfit', value: 'Outfit, sans-serif', weight: '300,400,500,600,700,800' }
  ],
  defaultColors: {
    primary: '#2563EB',
    secondary: '#3B82F6',
    accent: '#EFF6FF',
    background: '#FFFFFF',
    text: '#1E293B',
    cardBg: '#F8FAFC',
    borderColor: '#E2E8F0',
    buttonText: '#FFFFFF',
    highlightColor: '#38BDF8'
  },
  defaultFont: 'Inter, sans-serif',
  themeStyle: {
    layout: 'tech-startup-layout',
    headerStyle: 'modern',
    cardStyle: 'shadow',
    buttonStyle: 'rounded',
    iconStyle: 'duotone',
    spacing: 'airy',
    shadows: 'soft',
    dividers: true
  },
  defaultData: {
    header: {
      name: 'NexaTech',
      tagline: 'Innovative solutions for the digital age',
      logo: '',
      cover_image: '',
      cta_text: 'Get Started',
      cta_url: '#contact_form'
    },
    about: {
      description: 'NexaTech is a forward-thinking technology company specializing in cloud solutions, AI integration, and custom software development. Founded with a mission to make cutting-edge technology accessible to businesses of all sizes, we\'ve helped hundreds of clients transform their digital presence and operational efficiency.',
      year_founded: '2018',
      company_size: 'small'
    },
    services: {
      offerings: [
        { name: 'Cloud Solutions', description: 'Scalable cloud infrastructure and migration services to optimize your business operations.', icon: 'cloud', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80', link: '#' },
        { name: 'Custom Software', description: 'Tailored software solutions designed to address your unique business challenges.', icon: 'code', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', link: '#' },
        { name: 'AI Integration', description: 'Implement artificial intelligence to automate processes and gain valuable insights.', icon: 'ai', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80', link: '#' },
        { name: 'Data Analytics', description: 'Transform your raw data into actionable business intelligence.', icon: 'analytics', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80', link: '#' }
      ]
    },
    features: {
      feature_list: [
        { title: 'Lightning Fast', description: 'Our optimized solutions ensure maximum performance and minimal latency.', icon: 'zap', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80' },
        { title: 'Enterprise Security', description: 'Bank-level encryption and security protocols to keep your data safe.', icon: 'shield', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80' },
        { title: 'Fully Customizable', description: 'Flexible architecture that adapts to your specific business requirements.', icon: 'settings', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80' },
        { title: 'Seamless Integration', description: 'Works with your existing tools and platforms for a smooth transition.', icon: 'users', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80' }
      ]
    },
    contact: {
      email: 'info@nexatech.com',
      phone: '(555) 123-4567',
      website: 'https://www.nexatech.com',
      address: '123 Tech Park, San Francisco, CA 94107'
    },
    social: {
      social_links: [
        { platform: 'twitter', url: 'https://twitter.com/nexatech', username: '@nexatech' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/nexatech', username: 'NexaTech' },
        { platform: 'github', url: 'https://github.com/nexatech', username: 'nexatech' },
        { platform: 'youtube', url: 'https://youtube.com/nexatech', username: 'NexaTech' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Cloud Platform Demo - Full Product Walkthrough', description: 'See our cloud platform in action with a comprehensive product demonstration', video_type: 'product_demo', embed_url: 'https://www.youtube.com/embed/M988_fsOSWo', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', duration: '12:30' },
        { title: 'Client Success Story - 40% Efficiency Boost', description: 'How we helped our client increase efficiency by 40%', video_type: 'client_testimonial', embed_url: 'https://www.youtube.com/embed/hvCgDYFIRGY', thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80', duration: '8:20' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/nexatech',
      channel_name: 'NexaTech',
      subscriber_count: '12.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLtechvideos',
      latest_video_embed: 'https://www.youtube.com/embed/M988_fsOSWo',
      channel_description: 'Tech tutorials, product demos, and insights from the NexaTech team. Subscribe for weekly tech content and industry updates!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false, is_remote: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false, is_remote: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false, is_remote: true },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false, is_remote: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false, is_remote: true },
        { day: 'saturday', open_time: '10:00', close_time: '15:00', is_closed: false, is_remote: true },
        { day: 'sunday', open_time: '00:00', close_time: '00:00', is_closed: true, is_remote: false }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80', caption: 'Our modern office space' },
        { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80', caption: 'Team collaboration session' },
        { image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80', caption: 'Tech conference presentation' }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Sarah Johnson', company: 'GrowthCorp', position: 'CTO', review: 'NexaTech transformed our digital infrastructure, resulting in a 40% increase in operational efficiency. Their team was professional, responsive, and delivered beyond our expectations.', rating: '5', client_image: '' },
        { client_name: 'Michael Chen', company: 'InnovateLabs', position: 'CEO', review: 'The custom software solution developed by NexaTech has been a game-changer for our business. It streamlined our processes and provided valuable insights we never had access to before.', rating: '5', client_image: '' },
        { client_name: 'Emily Rodriguez', company: 'TechStart', position: 'Product Manager', review: 'Working with NexaTech was a seamless experience. Their cloud migration expertise saved us countless hours and resources while improving our system reliability.', rating: '4', client_image: '' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/nexatech/demo',
      booking_text: 'Schedule a Demo',
      demo_length: '30 minutes',
      demo_description: 'See our solutions in action with a personalized demo tailored to your business needs. Our product specialists will walk you through key features and answer any questions you may have.'
    },
    team: {
      members: [
        { name: 'Alex Rivera', title: 'CEO & Founder', bio: 'With 15+ years in tech leadership, Alex founded NexaTech with a vision to make enterprise-level technology accessible to businesses of all sizes.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', linkedin: 'https://linkedin.com/in/alexrivera' },
        { name: 'Jamie Wong', title: 'CTO', bio: 'Jamie leads our technical strategy and innovation, bringing extensive experience in cloud architecture and AI development.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80', linkedin: 'https://linkedin.com/in/jamiewong' },
        { name: 'Taylor Smith', title: 'Head of Product', bio: 'Taylor ensures our products meet the highest standards of quality and user experience through thoughtful design and rigorous testing.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80', linkedin: 'https://linkedin.com/in/taylorsmith' },
        { name: 'Morgan Lee', title: 'Customer Success Lead', bio: 'Morgan works closely with clients to ensure they get maximum value from our solutions and provides ongoing support.', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', linkedin: 'https://linkedin.com/in/morganlee' }
      ]
    },
    pricing: {
      plans: [
        { name: 'Starter', price: '$99', billing_period: 'monthly', description: 'Perfect for small businesses and startups', features: 'Core platform features\nBasic analytics\n5 user accounts\n8/5 support\n5GB storage', cta_text: 'Start Free Trial', cta_url: '#', is_popular: false },
        { name: 'Professional', price: '$249', billing_period: 'monthly', description: 'Ideal for growing businesses', features: 'All Starter features\nAdvanced analytics\n20 user accounts\n24/7 priority support\n50GB storage\nAPI access\nCustom integrations', cta_text: 'Start Free Trial', cta_url: '#', is_popular: true },
        { name: 'Enterprise', price: 'Custom', billing_period: 'custom', description: 'For large organizations with specific needs', features: 'All Professional features\nUnlimited users\nDedicated account manager\nCustom development\nUnlimited storage\nSLA guarantee\nOn-premise options', cta_text: 'Contact Sales', cta_url: '#', is_popular: false }
      ]
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Salesforce%20Tower%2C%20San%20Francisco%2C%20CA&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Salesforce+Tower+San+Francisco+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/slack/id618783545',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.Slack',
      app_description: 'Take NexaTech with you on the go. Our mobile app gives you access to all your important data and tools wherever you are.',
      app_features: 'Real-time analytics dashboard\nSecure access to your account\nPush notifications for important updates\nOffline mode for uninterrupted work\nSeamless sync across all devices',
      app_image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=80'
    },
    contact_form: {
      form_title: 'Get in Touch',
      form_description: 'Have questions about our products or services? Fill out the form below and our team will get back to you within 24 hours.'
    },
    action_buttons: {
      contact_button_text: 'Contact Us',
      demo_button_text: 'Request Demo',
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for your interest in NexaTech! We\'ve received your message and will respond shortly. In the meantime, feel free to explore our services and solutions.'
    },    seo: {
      meta_title: 'NexaTech | Cloud, AI, and Custom Software Solutions',
      meta_description: 'NexaTech helps businesses grow with cloud solutions, AI integration, custom software, and data analytics.',
      keywords: 'tech startup, cloud solutions, AI integration, custom software, data analytics, SaaS',
      og_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="tech-showcase"><h4>Innovation Hub</h4><p>Discover cutting-edge technology solutions.</p></div>',
      section_title: 'Tech Innovation',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect with NexaTech',
      qr_description: 'Scan this QR code to access our digital business card and stay connected.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 NexaTech. All rights reserved.'
    }
  }
};
