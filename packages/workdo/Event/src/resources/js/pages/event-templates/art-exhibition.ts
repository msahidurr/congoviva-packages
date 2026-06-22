export const artExhibitionTemplate = {
  name: 'Art Exhibition',
  sections: [
    {
      key: 'event_info',
      name: 'Exhibition Details',
      fields: [
        { name: 'exhibition_title', type: 'text', label: 'Exhibition Title' },
        { name: 'artist_name', type: 'text', label: 'Featured Artist' },
        { name: 'exhibition_type', type: 'text', label: 'Exhibition Type' },
        { name: 'description', type: 'textarea', label: 'Exhibition Description' }
      ],
      required: true
    },
    {
      key: 'gallery',
      name: 'Gallery & Location',
      fields: [
        { name: 'gallery_name', type: 'text', label: 'Gallery Name' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'location_url', type: 'url', label: 'Location URL' },
        { name: 'opening_date', type: 'date', label: 'Opening Date' },
        { name: 'closing_date', type: 'date', label: 'Closing Date' },
      ],
      required: true
    },
    {
      key: 'artworks',
      name: 'Featured Artworks',
      fields: [
        {
          name: 'artwork_list',
          type: 'repeater',
          label: 'Artworks',
          fields: [
            { name: 'title', type: 'text', label: 'Artwork Title' },
            { name: 'medium', type: 'text', label: 'Medium' },
            { name: 'year', type: 'text', label: 'Year Created',colSpan: 2 },
            { name: 'description', type: 'textarea', label: 'Description',colSpan: 2 }
          ]
        }
      ],
      required: false
    },
    {
      key: 'artist_info',
      name: 'Artist Information',
      fields: [
        { name: 'artist_bio', type: 'textarea', label: 'Artist Biography' },
        { name: 'artist_statement', type: 'textarea', label: 'Artist Statement' },
        { name: 'previous_exhibitions', type: 'textarea', label: 'Previous Exhibitions' },
        { name: 'artist_website', type: 'url', label: 'Artist Website' }
      ],
      required: false
    },
    {
      key: 'ticket_pricing',
      name: 'Ticket Pricing',
      fields: [
        { name: 'booking_link', type: 'url', label: 'Booking Link' },
        { name: 'ticket_price', type: 'text', label: 'Ticket Price' },
        { name: 'early_bird_price', type: 'text', label: 'Early Bird Price' },
        { name: 'group_discount', type: 'text', label: 'Group Discount' }
      ],
      required: false
    },

    {
      key: 'design',
      name: 'Design Settings',
      fields: [
        { name: 'background_image', type: 'file', label: 'Background Image' },
        { name: 'featured_artist', type: 'file', label: 'Featured Artist Image' }
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
        { name: 'qr_size', type: 'select', label: 'QR Code Size', options: [
          { value: 'small', label: 'Small (128px)' },
          { value: 'medium', label: 'Medium (200px)' },
          { value: 'large', label: 'Large (300px)' }
        ]}
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'gallery_contact', type: 'text', label: 'Gallery Contact' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'phone', type: 'tel', label: 'Phone' },
        { name: 'website', type: 'url', label: 'Website' }
      ],
      required: true
    }
  ],
  colorPresets: [
    { name: 'Classic Blue', primary: '#be185d', secondary: '#f9a8d4', accent: '#f1f5f9', background: '#ffffff', text: '#8a0039' },
    { name: 'Sky Cyan', primary: '#0284c7', secondary: '#7dd3fc', accent: '#f0f9ff', background: '#ffffff', text: '#0c4a6e' },
    { name: 'Forest Moss', primary: '#166534', secondary: '#4ade80', accent: '#f0fdf4', background: '#ffffff', text: '#052e16' },
    { name: 'Gentle Lavender', primary: '#5d14d2', secondary: '#c6b3ff', accent: '#f5f3ff', background: '#ffffff', text: '#4c1d95' },
    { name: 'Ocean Teal', primary: '#0d9488', secondary: '#5eead4', accent: '#ecfeff', background: '#ffffff', text: '#134e4a' },
  ],
  defaultColors: {
    primary: '#be185d',
    secondary: '#f9a8d4',
    accent: '#f1f5f9',
    background: '#ffffff',
    text: '#8a0039'
  },
  defaultData: {
    event_info: {
      exhibition_title: 'Contemporary Expressions',
      artist_name: 'Sarah Mitchell',
      exhibition_type: 'Solo Exhibition',
      opening_date: '',
      closing_date: '',
      description: 'A captivating collection of contemporary artworks exploring themes of identity and place.'
    },
    gallery: {
      gallery_name: 'Metropolitan Art Gallery',
      address: '123 Gallery Street, Arts District, AD 12345',
      opening_hours: 'Tue-Sun: 10AM-6PM\nClosed Mondays',
      parking_info: 'Street parking and nearby garage'
    },
    artworks: {
      artwork_list: [
        { title: 'Urban Landscapes', medium: 'Oil on Canvas', year: '2024', description: 'A vibrant interpretation of city life and architecture' },
        { title: 'Quiet Moments', medium: 'Watercolor', year: '2024', description: 'Intimate scenes capturing everyday beauty' },
        { title: 'Abstract Forms', medium: 'Mixed Media', year: '2024', description: 'Bold compositions exploring color and texture' }
      ]
    },
    artist_info: {
      artist_bio: 'Sarah Mitchell is a contemporary artist known for her expressive use of color and exploration of urban themes.',
      artist_statement: 'My work explores the relationship between people and their environments, capturing moments of connection.',
      previous_exhibitions: 'City Gallery (2023), Modern Art Center (2022), Regional Museum (2021)',
      artist_website: 'https://sarahmitchellart.com'
    },
    ticket_pricing: {
      booking_link: '',
      ticket_price: '$25',
      early_bird_price: '$20',
      group_discount: '10% off for 5+ tickets'
    },

    design: {
      background_image: '',
      featured_artist: ''
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Exhibition',
      qr_description: 'Scan this QR code to save exhibition details and share with friends.',
      qr_size: 'medium'
    },
    contact: {
      gallery_contact: 'Gallery Director',
      email: 'info@metroartgallery.com',
      phone: '(555) 123-4567',
      website: 'https://metroartgallery.com'
    }
  }
};