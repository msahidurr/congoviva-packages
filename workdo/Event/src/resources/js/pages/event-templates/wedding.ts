export const weddingTemplate = {
  name: 'Wedding Celebration',
  sections: [
    {
      key: 'event_info',
      name: 'Wedding Details',
      fields: [
        { name: 'bride_name', type: 'text', label: 'Bride Name' },
        { name: 'groom_name', type: 'text', label: 'Groom Name' },
        { name: 'wedding_date', type: 'date', label: 'Wedding Date' },
        { name: 'save_the_date', type: 'text', label: 'Save the Date Message' },
        { name: 'wedding_hashtag', type: 'text', label: 'Wedding Hashtag' }
      ],
      required: true
    },
    {
      key: 'ceremony',
      name: 'Ceremony Details',
      fields: [
        { name: 'ceremony_time', type: 'time', label: 'Ceremony Time' },
        { name: 'ceremony_venue', type: 'text', label: 'Ceremony Venue' },
        { name: 'ceremony_address', type: 'textarea', label: 'Ceremony Address' },
        { name: 'ceremony_dress_code', type: 'text', label: 'Dress Code' }
      ],
      required: true
    },
    {
      key: 'reception',
      name: 'Reception Details',
      fields: [
        { name: 'reception_time', type: 'time', label: 'Reception Time' },
        { name: 'reception_venue', type: 'text', label: 'Reception Venue' },
        { name: 'reception_address', type: 'textarea', label: 'Reception Address' },
        { name: 'dinner_style', type: 'text', label: 'Dinner Style' }
      ],
      required: true
    },
    {
      key: 'wedding_party',
      name: 'Wedding Party',
      fields: [
        {
          name: 'bridal_party',
          type: 'repeater',
          label: 'Bridal Party',
          fields: [
            { name: 'name', type: 'text', label: 'Name' },
            { name: 'role', type: 'text', label: 'Role' },
            { name: 'relationship', type: 'text', label: 'Relationship' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'rsvp',
      name: 'RSVP',
      fields: [
        { name: 'rsvp_url', type: 'url', label: 'RSVP URL' },
        { name: 'rsvp_deadline', type: 'date', label: 'RSVP Deadline' },
        { name: 'rsvp_phone', type: 'tel', label: 'RSVP Phone' },
        { name: 'guest_limit', type: 'text', label: 'Guest Limit' }
      ],
      required: false
    },
    {
      key: 'registry',
      name: 'Gift Registry',
      fields: [
        {
          name: 'registry_links',
          type: 'repeater',
          label: 'Registry Links',
          fields: [
            { name: 'store_name', type: 'text', label: 'Store Name' },
            { name: 'registry_url', type: 'url', label: 'Registry URL' }
          ]
        }
      ],
      required: false
    },
    {
      key: 'design',
      name: 'Design Settings',
      fields: [
        { name: 'background_image', type: 'file', label: 'Header Background Image' },
        { name: 'couple_photo', type: 'file', label: 'Couple Photo' }
      ],
      required: false
    },
    {
      key: 'accommodations',
      name: 'Accommodations',
      fields: [
        { name: 'hotel_name', type: 'text', label: 'Recommended Hotel' },
        { name: 'hotel_address', type: 'textarea', label: 'Hotel Address' },
        { name: 'hotel_phone', type: 'tel', label: 'Hotel Phone' },
        { name: 'booking_code', type: 'text', label: 'Group Booking Code' }
      ],
      required: false
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
    { name: 'Elegant Blush', primary: '#be185d', secondary: '#f9a8d4', accent: '#fdf2f8', background: '#ffffff', text: '#333333' },
    { name: 'Classic Ivory', primary: '#78716c', secondary: '#a8a29e', accent: '#fafaf9', background: '#ffffff', text: '#1c1917' },
    { name: 'Romantic Lavender', primary: '#8b5cf6', secondary: '#c4b5fd', accent: '#f5f3ff', background: '#ffffff', text: '#333333' },
    { name: 'Golden Elegance', primary: '#d97706', secondary: '#fbbf24', accent: '#fef3c7', background: '#ffffff', text: '#333333' },
    { name: 'Sage & Cream', primary: '#84cc16', secondary: '#bef264', accent: '#f7fee7', background: '#ffffff', text: '#333333' }
  ],
  defaultColors: {
    primary: '#be185d',
    secondary: '#f9a8d4',
    accent: '#fdf2f8',
    background: '#ffffff',
    text: '#333333'
  },
  defaultData: {
    event_info: {
      bride_name: 'Sarah',
      groom_name: 'Michael',
      wedding_date: '',
      save_the_date: 'Save the date for our special day!',
      wedding_hashtag: '#SarahAndMichael2025'
    },
    ceremony: {
      ceremony_time: '15:00',
      ceremony_venue: 'St. Mary\'s Church',
      ceremony_address: '123 Church St, Wedding City, WC 12345',
      ceremony_dress_code: 'Formal Attire'
    },
    reception: {
      reception_time: '18:00',
      reception_venue: 'Grand Ballroom',
      reception_address: '456 Reception Ave, Wedding City, WC 12345',
      dinner_style: 'Plated Dinner'
    },
    wedding_party: {
      bridal_party: [
        { name: 'Emma Johnson', role: 'Maid of Honor', relationship: 'Sister' },
        { name: 'David Smith', role: 'Best Man', relationship: 'Brother' }
      ]
    },
    rsvp: {
      rsvp_url: 'https://sarahandmichael.com/rsvp',
      rsvp_deadline: '',
      rsvp_phone: '(555) 123-4567',
      guest_limit: 'Adults Only'
    },
    registry: {
      registry_links: [
        { store_name: 'Amazon', registry_url: 'https://amazon.com/registry/sarah-michael' },
        { store_name: 'Target', registry_url: 'https://target.com/registry/sarah-michael' }
      ]
    },
    design: {
      background_image: '',
      couple_photo: ''
    },
    accommodations: {
      hotel_name: 'Grand Hotel',
      hotel_address: '789 Hotel Blvd, Wedding City, WC 12345',
      hotel_phone: '(555) 987-6543',
      booking_code: 'SARAHMICHAEL2025'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Wedding',
      qr_description: 'Scan this QR code to save our wedding details and share with loved ones.',
      qr_size: 'medium'
    }
  }
};