export const cafeTemplate = {
  id: 'cafe',
  name: 'Cafe Menu',
  description: 'Warm and cozy cafe menu design perfect for coffee shops and casual dining',
  sections: [
    {
      key: 'menu_info',
      name: 'Cafe Information',
      fields: [
        { name: 'cafe_name', type: 'text', label: 'Cafe Name' },
        { name: 'tagline', type: 'text', label: 'Tagline' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'operating_hours', type: 'textarea', label: 'Operating Hours' }
      ],
      required: true
    },
    {
      key: 'categories',
      name: 'Menu Categories',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'category_list', type: 'repeater', label: 'Menu Items', fields: [
          { name: 'name', type: 'text', label: 'Item Name' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'description', type: 'textarea', label: 'Description', colSpan: 2 },
          { name: 'is_popular', type: 'checkbox', label: 'Popular Item'},
          { name: 'is_vegetarian', type: 'checkbox', label: 'Vegetarian'}
        ]}
      ],
      required: false
    },
    {
      key: 'specialties',
      name: 'Today\'s Specials',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'special_items', type: 'repeater', label: 'Special Items', fields: [
          { name: 'name', type: 'text', label: 'Item Name' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'description', type: 'textarea', label: 'Description', colSpan: 2 }
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
    { name: 'Coffee Brown', primary: '#8B4513', secondary: '#D2691E', accent: '#F4A460', background: '#ffffff', text: '#2F1B14' },
    { name: 'Forest Green', primary: '#059669', secondary: '#10b77f', accent: '#d1fae5', background: '#ffffff', text: '#1f2937' },
    { name: 'Ocean Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe', background: '#ffffff', text: '#1f2937' },
    { name: 'Warm Orange', primary: '#ea580c', secondary: '#fb923c', accent: '#fed7aa', background: '#ffffff', text: '#9a3412' },
    { name: 'Purple Plum', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#ede9fe', background: '#ffffff', text: '#1f2937' }
  ],
  defaultColors: {
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#F4A460',
    background: '#ffffff',
    text: '#2F1B14'
  },
  defaultData: {
    menu_info: {
      cafe_name: 'Cozy Corner Cafe',
      tagline: 'Where every cup tells a story',
      description: 'A warm and welcoming neighborhood cafe serving freshly roasted coffee and homemade pastries.',
      operating_hours: 'Mon-Fri: 6:00 AM - 8:00 PM\nSat-Sun: 7:00 AM - 9:00 PM'
    },
    categories: {
      section_title: 'Our Menu',
      category_list: [
        {
          name: 'Espresso',
          description: 'Rich and bold espresso shot',
          price: '2.50',
          is_popular: true,
          is_vegetarian: true
        },
        {
          name: 'Cappuccino',
          description: 'Espresso with steamed milk and foam',
          price: '4.25',
          is_popular: true,
          is_vegetarian: true
        },
        {
          name: 'Croissant',
          description: 'Buttery, flaky French pastry',
          price: '3.50',
          is_popular: false,
          is_vegetarian: true
        }
      ]
    },
    specialties: {
      section_title: "Today's Specials",
      special_items: [
        {
          name: 'Seasonal Pumpkin Latte',
          description: 'Our signature fall blend with real pumpkin and warm spices',
          price: '5.75'
        },
        {
          name: 'Fresh Blueberry Muffin',
          description: 'Made this morning with local blueberries',
          price: '3.25'
        }
      ]
    },
    contact: {
      section_title: 'Visit Us',
      address: '123 Main Street\nAnytown, ST 12345',
      phone: '(555) 123-4567',
      email: 'hello@cozycorner.com'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Menu',
      qr_description: 'Share our delicious menu with friends and family',
      qr_size: 'medium'
    }
  }
};