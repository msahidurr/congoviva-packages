export const barTemplate = {
  id: 'bar',
  name: 'Bar & Lounge Menu',
  description: 'Sophisticated nightlife menu design for bars, lounges, and cocktail venues',
  sections: [
    {
      key: 'menu_info',
      name: 'Bar Information',
      fields: [
        { name: 'bar_name', type: 'text', label: 'Bar Name' },
        { name: 'atmosphere', type: 'text', label: 'Atmosphere Description' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'operating_hours', type: 'textarea', label: 'Operating Hours' }
      ],
      required: true
    },
    {
      key: 'happy_hour',
      name: 'Happy Hour',
      fields: [
        { name: 'is_active', type: 'checkbox', label: 'Happy Hour Active' },
        { name: 'time_range', type: 'text', label: 'Time Range' },
        { name: 'discount', type: 'text', label: 'Discount (e.g., 50%)' }
      ],
      required: false
    },
    {
      key: 'cocktails',
      name: 'Signature Cocktails',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'cocktail_list', type: 'repeater', label: 'Cocktail List', fields: [
          { name: 'name', type: 'text', label: 'Cocktail Name' },
          { name: 'ingredients', type: 'textarea', label: 'Ingredients' },
          { name: 'strength', type: 'text', label: 'Strength (e.g., Strong, Mild)' },
          { name: 'category', type: 'text', label: 'Category' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'is_signature', type: 'checkbox', label: 'Signature Cocktail' }
        ]}
      ],
      required: false
    },
    {
      key: 'spirits',
      name: 'Premium Spirits',
      fields: [
        { name: 'spirit_categories', type: 'repeater', label: 'Spirit Categories', fields: [
          { name: 'name', type: 'text', label: 'Spirit Name' },
          { name: 'brand', type: 'text', label: 'Brand' },
          { name: 'age', type: 'text', label: 'Age (years)' },
          { name: 'price', type: 'text', label: 'Price' }
        ]}
      ],
      required: false
    },
    {
      key: 'events',
      name: 'Live Entertainment',
      fields: [
        { name: 'upcoming_events', type: 'repeater', label: 'Upcoming Events', fields: [
          { name: 'name', type: 'text', label: 'Event Name' },
          { name: 'date', type: 'date', label: 'Event Date' },
          { name: 'time', type: 'text', label: 'Event Time' },
          { name: 'cover_charge', type: 'text', label: 'Cover Charge' }
        ]}
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'phone', type: 'tel', label: 'Phone Number' },
        { name: 'email', type: 'email', label: 'Email Address' }
      ],
      required: false
    },
    {
      key: 'qr_share',
      name: 'QR Code Settings',
      fields: [
        { name: 'enable_qr', type: 'checkbox', label: 'Enable QR Code Sharing' },
        { name: 'qr_title', type: 'text', label: 'QR Code Title' },
        { name: 'qr_description', type: 'textarea', label: 'QR Code Description' },
        { name: 'qr_size', type: 'select', label: 'QR Code Size', options: [
          { value: 'small', label: 'Small (128px)' },
          { value: 'medium', label: 'Medium (200px)' },
          { value: 'large', label: 'Large (300px)' }
        ]}
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Royal Purple', primary: '#2D1B69', secondary: '#FFD700', accent: '#4B0082', background: '#ffffff', text: '#1A1A1A' },
    { name: 'Midnight Blue', primary: '#1e40af', secondary: '#fbbf24', accent: '#dbeafe', background: '#ffffff', text: '#1f2937' },
    { name: 'Crimson Night', primary: '#dc2626', secondary: '#fbbf24', accent: '#fee2e2', background: '#ffffff', text: '#1f2937' },
    { name: 'Emerald Lounge', primary: '#059669', secondary: '#fbbf24', accent: '#d1fae5', background: '#ffffff', text: '#1f2937' },
    { name: 'Rose Gold', primary: '#be185d', secondary: '#f59e0b', accent: '#fce7f3', background: '#ffffff', text: '#1f2937' }
  ],
  defaultColors: {
    primary: '#2D1B69',
    secondary: '#FFD700',
    accent: '#4B0082',
    background: '#ffffff',
    text: '#1A1A1A'
  },
  defaultData: {
    menu_info: {
      bar_name: 'The Golden Lounge',
      atmosphere: 'Sophisticated & Elegant',
      description: 'Premium cocktails and spirits in an upscale atmosphere.',
      operating_hours: 'Mon-Thu: 5:00 PM - 12:00 AM\nFri-Sat: 5:00 PM - 2:00 AM\nSun: 6:00 PM - 11:00 PM'
    },
    happy_hour: {
      is_active: true,
      time_range: '5:00 PM - 7:00 PM',
      discount: '50%'
    },
    cocktails: {
      section_title: 'Our Menu',
      cocktail_list: [
        {
          name: 'Golden Martini',
          ingredients: 'Premium vodka, dry vermouth, olive',
          strength: 'Strong',
          category: 'Classic',
          price: '$14',
          is_signature: true
        }
      ]
    },
    spirits: {
      spirit_categories: [
        {
          name: 'Macallan 18',
          brand: 'Macallan',
          age: '18',
          price: '$45'
        }
      ]
    },
    events: {
      upcoming_events: [
        {
          name: 'Jazz Night',
          date: '2024-12-15',
          time: '8:00 PM',
          cover_charge: '$10'
        }
      ]
    },
    contact: {
      section_title: 'Visit Us',
      address: '654 Nightlife Blvd\nUptown, ST 12345',
      phone: '(555) 654-3210',
      email: 'info@goldenlounge.com'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Bar Menu',
      qr_description: 'Share our premium cocktail menu and nightlife experience',
      qr_size: 'medium'
    }
  }
};