import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const travelTemplate = {
  name: t('Travel Agency'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Agency Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') },
        { name: 'background_image', type: 'file', label: t('Background Image') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') },
        { name: 'destinations_count', type: 'number', label: t('Destinations Offered') }
      ],
      required: false
    },
    {
      key: 'destinations',
      name: t('Popular Destinations'),
      fields: [
        {
          name: 'destination_list',
          type: 'repeater',
          label: t('Destinations'),
          fields: [
            { name: 'name', type: 'text', label: t('Destination Name') },
            { name: 'location', type: 'text', label: t('Location') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'image', type: 'file', label: t('Destination Image') },
            { name: 'price', type: 'text', label: t('Starting Price') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'url', type: 'url', label: t('More Info URL') }
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
          name: 'service_list',
          type: 'repeater',
          label: t('Services'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'flight', label: t('Flights') },
              { value: 'hotel', label: t('Hotels') },
              { value: 'cruise', label: t('Cruises') },
              { value: 'tour', label: t('Tours') },
              { value: 'car', label: t('Car Rentals') },
              { value: 'insurance', label: t('Travel Insurance') },
              { value: 'visa', label: t('Visa Services') },
              { value: 'custom', label: t('Custom Packages') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'special_offers',
      name: t('Special Offers'),
      fields: [
        {
          name: 'offer_list',
          type: 'repeater',
          label: t('Offers'),
          fields: [
            { name: 'title', type: 'text', label: t('Offer Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'discount', type: 'text', label: t('Discount') },
            { name: 'valid_until', type: 'text', label: t('Valid Until') },
            { name: 'image', type: 'file', label: t('Offer Image') },
            { name: 'url', type: 'url', label: t('Offer URL') }
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
      key: 'videos',
      name: t('Travel Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Travel Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'destination_guide', label: t('Destination Guide') },
              { value: 'travel_tips', label: t('Travel Tips') },
              { value: 'client_journey', label: t('Client Travel Journey') },
              { value: 'cultural_experience', label: t('Cultural Experience') },
              { value: 'agency_intro', label: t('Agency Introduction') },
              { value: 'travel_vlog', label: t('Travel Vlog') }
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
            { name: 'caption', type: 'text', label: t('Caption') },
            { name: 'location', type: 'text', label: t('Location') }
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
            { name: 'rating', type: 'number', label: t('Rating (1-5)'), min: 1, max: 5 },
            { name: 'destination', type: 'text', label: t('Destination Visited') },
            { name: 'trip_date', type: 'text', label: t('Trip Date') }
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
        { name: 'consultation_text', type: 'text', label: t('Free Consultation Button Text') }
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
        { name: 'booking_button_text', type: 'text', label: t('Book Trip Button Text') },
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
    }
  ],
  colorPresets: [
    { name: 'Ocean Blue', primary: '#1A73E8', secondary: '#34A853', accent: '#E8F5E9', background: '#FFFFFF', text: '#333333' },
    { name: 'Sunset Orange', primary: '#FF6B35', secondary: '#FF8E53', accent: '#FFF4E6', background: '#FFFFFF', text: '#333333' },
    { name: 'Adventure Green', primary: '#059669', secondary: '#10b77f', accent: '#D1FAE5', background: '#FFFFFF', text: '#333333' },
    { name: 'Sky Blue', primary: '#0EA5E9', secondary: '#38BDF8', accent: '#E0F2FE', background: '#FFFFFF', text: '#333333' },
    { name: 'Desert Gold', primary: '#D97706', secondary: '#F59E0B', accent: '#FEF3C7', background: '#FFFFFF', text: '#333333' },
    { name: 'Mountain Purple', primary: '#7C3AED', secondary: '#8B5CF6', accent: '#EDE9FE', background: '#FFFFFF', text: '#333333' },
    { name: 'Tropical Teal', primary: '#0D9488', secondary: '#14B8A6', accent: '#CCFBF1', background: '#FFFFFF', text: '#333333' },
    { name: 'Coral Reef', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '300,400,600,700' },
    { name: 'Lato', value: 'Lato, sans-serif', weight: '300,400,700,900' }
  ],
  defaultColors: {
    primary: '#1A73E8',
    secondary: '#34A853',
    accent: '#E8F5E9',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F8F9FA',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    highlightColor: '#FBBC04'
  },
  defaultFont: 'Poppins, sans-serif',
  themeStyle: {
    layout: 'travel-layout',
    headerStyle: 'panoramic',
    cardStyle: 'rounded',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable'
  },
  defaultData: {
    header: {
      name: 'Wanderlust Travel',
      tagline: 'Discover the world with us',
      logo: "",
      background_image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
    },
    about: {
      description: 'Wanderlust Travel is a full-service travel agency dedicated to creating unforgettable experiences. With over 15 years of expertise, we specialize in crafting personalized itineraries to destinations worldwide. Our team of experienced travel consultants is committed to providing exceptional service and insider knowledge to make your travel dreams a reality.',
      year_established: '2008',
      destinations_count: '120'
    },
    destinations: {
      destination_list: [
        { name: 'Santorini', location: 'Greece', description: 'Experience the stunning white-washed buildings, blue domes, and breathtaking sunsets of this iconic Greek island.', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', price: 'From $1,299', duration: '7 days', url: 'https://www.wanderlusttravel.com/destinations/santorini' },
        { name: 'Bali', location: 'Indonesia', description: 'Explore lush rice terraces, ancient temples, and pristine beaches on this tropical paradise island.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', price: 'From $1,499', duration: '10 days', url: 'https://www.wanderlusttravel.com/destinations/bali' },
        { name: 'Kyoto', location: 'Japan', description: 'Immerse yourself in Japanese culture with visits to historic temples, traditional gardens, and authentic tea houses.', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80', price: 'From $1,899', duration: '8 days', url: 'https://www.wanderlusttravel.com/destinations/kyoto' },
        { name: 'Machu Picchu', location: 'Peru', description: 'Trek through the Andes to discover the ancient Incan citadel and one of the most iconic archaeological sites in the world.', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80', price: 'From $2,199', duration: '9 days', url: 'https://www.wanderlusttravel.com/destinations/machu-picchu' }
      ]
    },
    services: {
      service_list: [
        { title: 'Flight Bookings', description: 'Access to competitive airfares with major airlines and exclusive deals.', icon: 'flight' },
        { title: 'Hotel Reservations', description: 'Partnerships with hotels and resorts worldwide at all price points.', icon: 'hotel' },
        { title: 'Guided Tours', description: 'Expert-led tours with local guides for authentic experiences.', icon: 'tour' },
        { title: 'Custom Itineraries', description: 'Personalized travel plans tailored to your interests and budget.', icon: 'custom' }
      ]
    },
    special_offers: {
      offer_list: [
        { title: 'Summer in Europe', description: '10-day tour of Italy, France, and Spain with guided excursions and premium accommodations.', discount: '15% Off', valid_until: 'May 31, 2025', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=80', url: 'https://www.wanderlusttravel.com/offers/summer-europe' },
        { title: 'Tropical Escape', description: 'All-inclusive Caribbean resort stay with airfare and activities included.', discount: '$300 Off', valid_until: 'June 15, 2025', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', url: 'https://www.wanderlusttravel.com/offers/tropical-escape' }
      ]
    },
    action_buttons: {
      contact_button_text: 'Contact Travel Agent',
      booking_button_text: 'Book Your Adventure',
      save_contact_button_text: 'Save Contact'
    },
    contact: {
      email: 'info@wanderlusttravel.com',
      phone: '(555) 123-4567',
      website: 'https://www.wanderlusttravel.com',
      address: '123 Journey Lane, Suite 200, San Francisco, CA 94110',
      emergency: '(555) 987-6543'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/wanderlusttravel', username: '@wanderlusttravel' },
        { platform: 'facebook', url: 'https://facebook.com/wanderlusttravel', username: 'Wanderlust Travel' },
        { platform: 'tripadvisor', url: 'https://tripadvisor.com/wanderlusttravel', username: 'Wanderlust Travel' },
        { platform: 'youtube', url: 'https://youtube.com/wanderlusttravel', username: 'Wanderlust Travel' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Packing Tips for International Travel - Essential Items and Hacks', description: 'Practical packing guidance for international trips, including must-have essentials and space-saving tips.', video_type: 'travel_tips', embed_url: 'https://www.youtube.com/embed/vciVZ6Ll-SM', thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', duration: '' },
        { title: 'Living in a BUS for 72 HOURS | Costa Rica Family Vlog', description: 'A family travel style Costa Rica journey featuring adventure, local experiences, and real travel moments.', video_type: 'client_journey', embed_url: 'https://youtu.be/-PWbG9usc8Q?si=SoIebJSG43XeOO7p', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80', duration: '' }
      ]
    },
    youtube: {
      channel_url: 'https://www.youtube.com/@WorldTravelGuide2021',
      channel_name: 'Wanderlust Travel',
      subscriber_count: '34.7K',
      featured_playlist: 'https://www.youtube.com/watch?v=j4cDKiAUwRc',
      latest_video_embed: 'https://www.youtube.com/embed/vciVZ6Ll-SM',
      channel_description: 'Travel guides, destination tips, and inspiring travel stories from around the world. Subscribe for weekly travel inspiration and expert advice!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '15:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    gallery: {
      photos: [
        { image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80', caption: 'Sunset over Santorini', location: 'Greece' },
        { image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', caption: 'Rice terraces in Ubud', location: 'Bali, Indonesia' },
        { image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80', caption: 'Cherry blossoms at Kiyomizu-dera Temple', location: 'Kyoto, Japan' },
        { image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80', caption: 'Machu Picchu vista', location: 'Peru' }
      ]
    },
    testimonials: {
      reviews: [
        { client_name: 'Jennifer & David', review: 'Our honeymoon to Bali was absolutely perfect. Wanderlust Travel took care of every detail, allowing us to focus on enjoying our special trip. The private villa they recommended was stunning!', rating: '5', destination: 'Bali', trip_date: 'September 2023' },
        { client_name: 'Robert T.', review: 'The guided tour of Japan was exceptional. Our guide was knowledgeable and took us to places we would never have discovered on our own. Will definitely book with Wanderlust again!', rating: '5', destination: 'Japan', trip_date: 'April 2023' },
        { client_name: 'The Martinez Family', review: 'Planning a trip for a family of five can be challenging, but Wanderlust made it easy. Our Costa Rica adventure had something for everyone - beaches, rainforests, and wildlife.', rating: '4', destination: 'Costa Rica', trip_date: 'July 2023' }
      ]
    },
    appointments: {
      booking_url: 'https://calendly.com/wanderlusttravel',
      section_title: 'Plan Your Adventure',
      section_description: 'Ready to explore the world? Let us help you plan your perfect trip.',
      booking_text: 'Schedule a Consultation',
      consultation_text: 'Free Travel Planning Session'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=Ferry%20Building%2C%20San%20Francisco%2C%20CA&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=Ferry+Building+San+Francisco+CA'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/tripadvisor-hotels-flights/id284876795',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.tripadvisor.tripadvisor',
      app_description: 'Download our app to browse destinations, access your travel itineraries offline, and receive real-time travel alerts.'
    },
    contact_form: {
      form_title: 'Plan Your Next Adventure',
      form_description: 'Tell us about your dream trip, and one of our travel consultants will contact you to start planning your perfect getaway.'
    },
    thank_you: {
      message: 'Thank you for contacting Wanderlust Travel. We appreciate your interest and will get back to you within 24-48 hours to discuss your travel plans.'
    },    seo: {
      meta_title: 'Wanderlust Travel | Personalized Trips and Global Adventures',
      meta_description: 'Custom travel planning, destination guides, and unforgettable vacation experiences with Wanderlust Travel.',
      keywords: 'travel agency, travel planning, vacation packages, destination guides, adventure travel',
      og_image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="travel-promo"><h4>Special Travel Deals</h4><p>Discover exclusive offers and travel packages.</p></div>',
      section_title: 'Travel Promotions',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Travel Services',
      qr_description: 'Scan this QR code to access our travel agency information and book your next adventure.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Discover the world with us. Expert travel planning, personalized itineraries, and unforgettable experiences await.',
      footer_links: [
        { title: 'Destinations', url: '#destinations' },
        { title: 'Travel Packages', url: '#offers' },
        { title: 'Plan Your Trip', url: '#booking' },
        { title: 'Travel Tips', url: '#videos' }
      ]
    },
    copyright: {
      text: '© 2025 Wanderlust Travel. All rights reserved.'
    }
  }
};
