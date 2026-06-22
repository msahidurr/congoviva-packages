import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const realEstateTemplate = {
  name: t('Real Estate Agent'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Agent Name') },
        { name: 'title', type: 'text', label: t('Professional Title') },
        { name: 'agency', type: 'text', label: t('Agency Name') },
        { name: 'license_number', type: 'text', label: t('License Number') },
        { name: 'achievement_badge', type: 'text', label: t('Achievement Badge') },
        { name: 'service_area', type: 'text', label: t('Service Area') },
        { name: 'property_types', type: 'text', label: t('Property Types') },
        { name: 'specialization', type: 'text', label: t('Specialization') },
        { name: 'rating', type: 'text', label: t('Rating') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me') },
        { name: 'experience_years', type: 'number', label: t('Years of Experience') },
        { name: 'specialties', type: 'tags', label: t('Specialties') },
        { name: 'certifications', type: 'tags', label: t('Certifications') }
      ],
      required: false
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'office_address', type: 'textarea', label: t('Office Address') }
      ],
      required: true
    },
    {
      key: 'business_hours',
      name: t('Business Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Business Hours'),
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
      key: 'featured_listings',
      name: t('Featured Listings'),
      fields: [
        {
          name: 'properties',
          type: 'repeater',
          label: t('Properties'),
          fields: [
            { name: 'address', type: 'text', label: t('Property Address') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'bedrooms', type: 'number', label: t('Bedrooms') },
            { name: 'bathrooms', type: 'number', label: t('Bathrooms') },
            { name: 'sqft', type: 'number', label: t('Square Footage') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'image', type: 'file', label: t('Property Image') },
            { name: 'status', type: 'select', label: t('Status'), options: [
              { value: 'for_sale', label: t('For Sale') },
              { value: 'for_rent', label: t('For Rent') },
              { value: 'pending', label: t('Pending') },
              { value: 'sold', label: t('Sold') }
            ]},
            { name: 'listing_url', type: 'url', label: t('Listing URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Property Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Real Estate Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'property_tour', label: t('Property Tour') },
              { value: 'neighborhood_guide', label: t('Neighborhood Guide') },
              { value: 'market_update', label: t('Market Update') },
              { value: 'client_testimonial', label: t('Client Testimonial') },
              { value: 'buying_tips', label: t('Buying/Selling Tips') },
              { value: 'agent_introduction', label: t('Agent Introduction') }
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
      key: 'services',
      name: t('Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'home', label: t('Home') },
              { value: 'building', label: t('Building') },
              { value: 'key', label: t('Key') },
              { value: 'dollar', label: t('Dollar') },
              { value: 'chart', label: t('Chart') },
              { value: 'search', label: t('Search') },
              { value: 'handshake', label: t('Handshake') }
            ]}
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
            { name: 'transaction_type', type: 'select', label: t('Transaction Type'), options: [
              { value: 'buyer', label: t('Buyer') },
              { value: 'seller', label: t('Seller') },
              { value: 'both', label: t('Both') },
              { value: 'rental', label: t('Rental') }
            ]}
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
      key: 'appointments',
      name: t('Appointments'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking URL') },
        { name: 'calendar_link', type: 'url', label: t('Calendar Link') },
        { name: 'appointment_types', type: 'tags', label: t('Appointment Types (e.g., Showing, Consultation)') },
        { name: 'appointment_notes', type: 'textarea', label: t('Appointment Notes') }
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
      key: 'market_stats',
      name: t('Market Statistics'),
      fields: [
        { name: 'area_served', type: 'text', label: t('Area Served') },
        { name: 'avg_home_price', type: 'text', label: t('Average Home Price') },
        { name: 'avg_days_on_market', type: 'number', label: t('Average Days on Market') },
        { name: 'market_description', type: 'textarea', label: t('Market Description') }
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
        { name: 'text', type: 'text', label: t('Copyright Text') },
        { name: 'disclaimer', type: 'textarea', label: t('Legal Disclaimer') }
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
    { name: 'Professional Blue', primary: '#1A365D', secondary: '#2A4365', accent: '#EBF8FF', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Luxury Gold', primary: '#744210', secondary: '#975A16', accent: '#FFFFF0', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Modern Gray', primary: '#4A5568', secondary: '#718096', accent: '#F7FAFC', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Coastal Teal', primary: '#285E61', secondary: '#2C7A7B', accent: '#E6FFFA', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Urban Brick', primary: '#9B2C2C', secondary: '#C53030', accent: '#FFF5F5', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Forest Green', primary: '#276749', secondary: '#2F855A', accent: '#F0FFF4', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Elegant Purple', primary: '#553C9A', secondary: '#6B46C1', accent: '#FAF5FF', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Warm Terracotta', primary: '#C05621', secondary: '#DD6B20', accent: '#FFFAF0', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Classic Black', primary: '#1A202C', secondary: '#2D3748', accent: '#F7FAFC', background: '#FFFFFF', text: '#2D3748' },
    { name: 'Soft Beige', primary: '#8B5C24', secondary: '#A27A3A', accent: '#FEFCBF', background: '#FFFFF0', text: '#2D3748' }
  ],
  fontOptions: [
    { name: 'Raleway', value: 'Raleway, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700' },
    { name: 'Playfair Display', value: 'Playfair Display, serif', weight: '400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Libre Baskerville', value: 'Libre Baskerville, serif', weight: '400,700' }
  ],
  defaultColors: {
    primary: '#1A365D',
    secondary: '#2A4365',
    accent: '#EBF8FF',
    background: '#FFFFFF',
    text: '#2D3748',
    cardBg: '#F7FAFC',
    borderColor: '#E2E8F0',
    buttonBg: '#1A365D',
    buttonText: '#FFFFFF'
  },
  defaultFont: 'Raleway, sans-serif',
  themeStyle: {
    layout: 'modern-cards',
    headerStyle: 'professional',
    cardStyle: 'shadow',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable',
    shadows: 'medium',
    animations: 'slide',
    backgroundPattern: 'none'
  },
  defaultData: {
    header: {
      name: 'Sarah Johnson',
      title: 'Licensed Real Estate Agent',
      agency: 'Premier Properties',
      license_number: 'RE-12345678',
      achievement_badge: 'Top Agent 2025',
      service_area: 'Greater Metropolitan Area',
      property_types: 'Residential & Commercial',
      specialization: 'Specialized in Luxury Properties',
      rating: '5.0 Rating',
      profile_image: ''
    },
    about: {
      description: 'With over 10 years of experience in the real estate market, I specialize in helping clients find their dream homes and investment properties. My knowledge of the local market and dedication to client satisfaction ensures a smooth and successful transaction.',
      experience_years: '10',
      specialties: 'Residential, Luxury Homes, First-Time Buyers, Investment Properties',
      certifications: 'CRS, ABR, SRS, GRI'
    },
    contact: {
      phone: '+1 (555) 987-6543',
      email: 'sarah@premierproperties.com',
      website: 'https://www.sarahjohnsonrealty.com',
      office_address: '789 Realty Drive\nSuite 200\nMetro City, CA 90210'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '17:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '15:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    featured_listings: {
      properties: [
        { 
          address: '123 Luxury Lane, Metro City, CA', 
          price: '$1,250,000', 
          bedrooms: '4', 
          bathrooms: '3.5', 
          sqft: '3200', 
          description: 'Stunning modern home with open floor plan, gourmet kitchen, and resort-style backyard with pool and spa.', 
          image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80', 
          status: 'for_sale',
          listing_url: 'https://www.sarahjohnsonrealty.com/listings/123-luxury-lane'
        },
        { 
          address: '456 Family Circle, Metro City, CA', 
          price: '$750,000', 
          bedrooms: '3', 
          bathrooms: '2', 
          sqft: '1800', 
          description: 'Charming family home in top school district with updated kitchen, hardwood floors, and spacious backyard.', 
          image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80', 
          status: 'for_sale',
          listing_url: 'https://www.sarahjohnsonrealty.com/listings/456-family-circle'
        },
        { 
          address: '789 Downtown Loft, Metro City, CA', 
          price: '$525,000', 
          bedrooms: '2', 
          bathrooms: '2', 
          sqft: '1200', 
          description: 'Modern downtown loft with high ceilings, exposed brick, and amazing city views. Walking distance to restaurants and shops.', 
          image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', 
          status: 'pending',
          listing_url: 'https://www.sarahjohnsonrealty.com/listings/789-downtown-loft'
        }
      ]
    },
    videos: {
      video_list: [
        { title: 'Luxury Home Tour - 123 Luxury Lane', description: 'Take a virtual tour of this stunning $1.25M modern home with pool and spa', video_type: 'property_tour', embed_url: 'https://www.youtube.com/watch?v=SXrWOycyXEs', thumbnail: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80', duration: '5:30' },
        { title: 'Metro City Market Update - Q4 2024', description: 'Latest market trends, pricing, and what to expect in the coming months', video_type: 'market_update', embed_url: 'https://www.youtube.com/watch?v=yruS06Jqdw8', thumbnail: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80', duration: '8:15' },
        { title: 'First-Time Homebuyer Tips', description: 'Essential advice for first-time buyers navigating today\'s market', video_type: 'buying_tips', embed_url: 'https://www.youtube.com/watch?v=RTU54GK5AkI', thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80', duration: '6:45' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/sarahjohnsonrealty',
      channel_name: 'Sarah Johnson Realty',
      subscriber_count: '4.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLpropertytours',
      latest_video_embed: 'https://www.youtube.com/watch?v=SXrWOycyXEs',
      channel_description: 'Property tours, market updates, and real estate tips from a top-performing agent in Metro City. Subscribe for weekly real estate insights!'
    },
    services: {
      service_list: [
        { title: 'Buyer Representation', description: 'Expert guidance through the entire home buying process, from search to closing.', icon: 'home' },
        { title: 'Seller Representation', description: 'Strategic marketing and pricing to sell your home quickly and for top dollar.', icon: 'dollar' },
        { title: 'Property Valuation', description: 'Detailed market analysis to determine the optimal listing price for your property.', icon: 'chart' },
        { title: 'Investment Consulting', description: 'Advice on real estate investments to maximize returns and build wealth.', icon: 'building' }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Michael & Jennifer Brown', review: 'Sarah helped us find our dream home in a competitive market. Her knowledge and negotiation skills were invaluable. We couldn\'t be happier with our purchase!', rating: '5', transaction_type: 'buyer' },
        { client_name: 'Robert Wilson', review: 'Sarah sold my home in just 5 days for above asking price. Her marketing strategy and staging advice made all the difference. Highly recommended!', rating: '5', transaction_type: 'seller' },
        { client_name: 'Lisa Martinez', review: 'As a first-time homebuyer, I was nervous about the process. Sarah guided me every step of the way and found me a perfect starter home within my budget.', rating: '5', transaction_type: 'buyer' }
      ]
    },
    social: {
      social_links: [
        { platform: 'facebook', url: 'https://facebook.com/sarahjohnsonrealty', username: 'sarahjohnsonrealty' },
        { platform: 'instagram', url: 'https://instagram.com/sarahjohnsonrealty', username: '@sarahjohnsonrealty' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/sarahjohnsonrealty', username: 'sarahjohnsonrealty' },
        { platform: 'zillow', url: 'https://zillow.com/profile/sarahjohnsonrealty', username: 'Sarah Johnson' },
        { platform: 'youtube', url: 'https://youtube.com/sarahjohnsonrealty', username: 'Sarah Johnson Realty' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/sarahjohnsonrealty',
      calendar_link: 'https://calendar.google.com/sarahjohnsonrealty',
      appointment_types: 'Property Showing, Buyer Consultation, Seller Consultation, Market Analysis',
      appointment_notes: 'Please schedule appointments at least 24 hours in advance. For same-day showings, please call directly.'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=789%20Realty%20Drive%2C%20Beverly%20Hills%2C%20CA%2090210&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=789+Realty+Drive+Beverly+Hills+CA+90210'
    },
    market_stats: {
      area_served: 'Metro City and surrounding areas',
      avg_home_price: '$825,000',
      avg_days_on_market: '18',
      market_description: 'The Metro City real estate market remains strong with limited inventory and high demand, especially in desirable neighborhoods with good schools. Interest rates have stabilized, making it a good time for both buyers and sellers.'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/zillow-real-estate-rentals/id310738695',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.zillow.android.zillowmap',
      app_description: 'Download our app to search properties, schedule showings, and receive instant notifications about new listings that match your criteria.'
    },
    contact_form: {
      form_title: 'Contact Me',
      form_description: 'Have questions about buying or selling a home? Send me a message and I\'ll get back to you promptly.'
    },
    thank_you: {
      message: 'Thank you for reaching out! I appreciate your interest and will respond to your inquiry within 24 hours.'
    },
    action_buttons: {
      contact_button_text: 'Contact Me',
      appointment_button_text: 'Schedule Showing',
      save_contact_button_text: 'Save Contact'
    },    seo: {
      meta_title: 'Sarah Johnson Realty | Luxury and Residential Real Estate',
      meta_description: 'Explore featured listings, market updates, and expert buying and selling guidance from Sarah Johnson at Premier Properties.',
      keywords: 'real estate agent, luxury homes, property listings, homebuyer tips, market update, Metro City real estate',
      og_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Market Insights</h4><p>Get the latest market trends and property insights in your area.</p></div>',
      section_title: 'Market Insights',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Contact',
      qr_description: 'Scan this QR code to save my contact information and access my property listings.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    copyright: {
      text: '© 2025 Sarah Johnson, Premier Properties. All rights reserved.',
      disclaimer: 'Real estate agent is licensed in the state of California. Each office independently owned and operated. This is not intended as a solicitation if your property is currently listed with another broker.'
    }
  }
};
