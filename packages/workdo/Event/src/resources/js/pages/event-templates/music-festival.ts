export const musicFestivalTemplate = {
  name: 'Music Festival',
  sections: [
    {
      key: 'event_info',
      name: 'Festival Information',
      fields: [
        { name: 'festival_name', type: 'text', label: 'Festival Name' },
        { name: 'festival_description', type: 'textarea', label: 'Festival Description' },
        { name: 'start_date', type: 'date', label: 'Start Date' },
        { name: 'end_date', type: 'date', label: 'End Date' },
        { name: 'genre', type: 'text', label: 'Music Genre' }
      ],
      required: true
    },
    {
      key: 'venue',
      name: 'Venue & Location',
      fields: [
        { name: 'venue_name', type: 'text', label: 'Venue Name' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'capacity', type: 'text', label: 'Venue Capacity' },
        { name: 'map_url', type: 'url', label: 'Google Maps URL' }
      ],
      required: true
    },
    {
      key: 'lineup',
      name: 'Artist Lineup',
      fields: [
        {
          name: 'artist_list',
          type: 'repeater',
          label: 'Artists',
          fields: [
            { name: 'artist_name', type: 'text', label: 'Artist Name' },
            { name: 'stage', type: 'text', label: 'Stage' },
            { name: 'performance_time', type: 'time', label: 'Performance Time' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'schedule',
      name: 'Festival Schedule',
      fields: [
        {
          name: 'daily_schedule',
          type: 'repeater',
          label: 'Daily Schedule',
          fields: [
            { name: 'date', type: 'date', label: 'Date' },
            { name: 'start_time', type: 'time', label: 'Start Time' },
            { name: 'end_time', type: 'time', label: 'End Time' },
            { name: 'special_events', type: 'text', label: 'Special Events' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'tickets',
      name: 'Tickets & Pricing',
      fields: [
        { name: 'ticket_url', type: 'url', label: 'Ticket Purchase URL' },
        { name: 'general_admission', type: 'text', label: 'General Admission Price' },
        { name: 'vip_price', type: 'text', label: 'VIP Price' },
        { name: 'early_bird_price', type: 'text', label: 'Early Bird Price' },
        { name: 'sale_deadline', type: 'date', label: 'Ticket Sale Deadline' }
      ],
      required: false
    },

    {
      key: 'amenities',
      name: 'Festival Amenities',
      fields: [
        {
          name: 'amenity_list',
          type: 'repeater',
          label: 'Amenities',
          fields: [
            { name: 'amenity_name', type: 'text', label: 'Amenity Name' ,colSpan: 2},

          ]
        }
      ],
      required: false
    },
    {
      key: 'design',
      name: 'Design Settings',
      fields: [
        { name: 'background_image', type: 'file', label: 'Festival Background Image' }
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'organizer_name', type: 'text', label: 'Festival Organizer' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'phone', type: 'tel', label: 'Phone' },
        { name: 'website', type: 'url', label: 'Website' },
        { name: 'social_media', type: 'text', label: 'Social Media' }
      ],
      required: true
    },
    {
      key: 'qr_share',
      name: 'QR Code Share',
      fields: [
        { name: 'enable_qr', type: 'checkbox', label: 'Enable QR Code Sharing' },
        { name: 'qr_title', type: 'text', label: 'QR Section Title' },
        { name: 'qr_description', type: 'textarea', label: 'QR Description' },
        { name: 'qr_size', type: 'select', label: 'QR Code Size', options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }] }
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Electric Purple', primary: '#8b5cf6', secondary: '#a78bfa', accent: '#f3f4f6', background: '#ffffff', text: '#1f2937' },
    { name: 'Neon Green', primary: '#10b77f', secondary: '#34d399', accent: '#d1fae5', background: '#ffffff', text: '#065f46' },
    { name: 'Sunset Orange', primary: '#f59e0b', secondary: '#fbbf24', accent: '#fef3c7', background: '#ffffff', text: '#92400e' },
    { name: 'Rock Red', primary: '#dc2626', secondary: '#ef4444', accent: '#fecaca', background: '#ffffff', text: '#1f2937' },
    { name: 'Deep Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe', background: '#ffffff', text: '#1e3a8a' }
  ],
  defaultColors: {
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#f3f4f6',
    background: '#ffffff',
    text: '#1f2937'
  },
  defaultData: {
    event_info: {
      festival_name: 'Summer Music Fest 2025',
      festival_description: 'Three days of incredible music featuring top artists from around the world.',
      start_date: '',
      end_date: '',
      genre: 'Multi-Genre'
    },
    venue: {
      venue_name: 'Central Park Amphitheater',
      address: '789 Music Ave, Festival City, FC 12345',
      capacity: '50,000',
      map_url: ''
    },
    lineup: {
      artist_list: [
        { artist_name: 'The Electric Waves', stage: 'Main Stage', performance_time: '20:00' },
        { artist_name: 'Rock Legends', stage: 'Rock Stage', performance_time: '21:30' }
      ]
    },
    schedule: {
      daily_schedule: [
        { date: '', start_time: '12:00', end_time: '23:00', special_events: 'Opening ceremony at 12:30' },
        { date: '', start_time: '11:00', end_time: '23:59', special_events: 'Headliner performances' }
      ]
    },
    tickets: {
      ticket_url: 'https://musicfest.com/tickets',
      general_admission: '$89',
      vip_price: '$199',
      early_bird_price: '$69',
      sale_deadline: ''
    },

    amenities: {
      amenity_list: [
        { amenity_name: 'Food Courts' },
        { amenity_name: 'First Aid Station' },
      ]
    },
    design: {
      background_image: ''
    },
    contact: {
      organizer_name: 'Music Fest Productions',
      email: 'info@musicfest.com',
      phone: '(555) 123-4567',
      website: 'https://musicfest.com',
      social_media: '@musicfest2025'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Festival',
      qr_description: 'Scan this QR code to save festival details and share with friends.',
      qr_size: 'medium'
    }
  }
};