export const restaurantTemplate = {
  id: 'restaurant',
  name: 'Fine Dining Restaurant',
  description: 'Elegant and sophisticated menu design for upscale restaurants',
  sections: [
    {
      key: 'menu_info',
      name: 'Restaurant Information',
      fields: [
        { name: 'restaurant_name', type: 'text', label: 'Restaurant Name' },
        { name: 'cuisine_type', type: 'text', label: 'Cuisine Type' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'operating_hours', type: 'textarea', label: 'Hours of Service' }
      ],
      required: true
    },
    {
      key: 'chef_specials',
      name: 'Chef\'s Recommendations',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'chef_recommendations', type: 'repeater', label: 'Chef\'s Recommendations', fields: [
          { name: 'name', type: 'text', label: 'Dish Name' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'description', type: 'textarea', label: 'Description' },
          { name: 'ingredients', type: 'textarea', label: 'Key Ingredients' },
          { name: 'chef_notes', type: 'textarea', label: 'Chef\'s Notes' },
          { name: 'is_signature', type: 'checkbox', label: 'Signature Dish' }
        ]}
      ],
      required: false
    },
    {
      key: 'categories',
      name: 'Menu Selection',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'category_list', type: 'repeater', label: 'Menu Categories', fields: [
          { name: 'name', type: 'text', label: 'Category Name' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'description', type: 'textarea', label: 'Description',colSpan: 2 },
        ]}
      ],
      required: false
    },
    {
      key: 'wine_list',
      name: 'Wine Selection',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'wine_categories', type: 'repeater', label: 'Wine List', fields: [
          { name: 'name', type: 'text', label: 'Wine Name' },
          { name: 'vintage', type: 'text', label: 'Vintage Year' },
          { name: 'price', type: 'text', label: 'Price' }
        ]}
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Reservations & Contact',
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
    { name: 'Elegant Black', primary: '#1a1a1a', secondary: '#d4af37', accent: '#f5f5f5', background: '#ffffff', text: '#333333' },
    { name: 'Royal Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe', background: '#ffffff', text: '#1f2937' },
    { name: 'Deep Red', primary: '#dc2626', secondary: '#ef4444', accent: '#fee2e2', background: '#ffffff', text: '#1f2937' },
    { name: 'Forest Green', primary: '#059669', secondary: '#10b77f', accent: '#d1fae5', background: '#ffffff', text: '#1f2937' },
    { name: 'Rich Purple', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#ede9fe', background: '#ffffff', text: '#1f2937' }
  ],
  defaultColors: {
    primary: '#1a1a1a',
    secondary: '#d4af37',
    accent: '#f5f5f5',
    background: '#ffffff',
    text: '#333333'
  },
  defaultData: {
    menu_info: {
      restaurant_name: 'Le Gourmet',
      cuisine_type: 'French Contemporary',
      description: 'An exquisite dining experience featuring contemporary French cuisine with seasonal ingredients.',
      operating_hours: 'Tue-Thu: 5:30 PM - 10:00 PM\nFri-Sat: 5:30 PM - 11:00 PM\nSun: 5:00 PM - 9:00 PM\nClosed Mondays'
    },
    chef_specials: {
      section_title: "Chef's Recommendations",
      chef_recommendations: [
        {
          name: 'Pan-Seared Duck Breast',
          description: 'Served with cherry gastrique and roasted vegetables',
          ingredients: 'Duck breast, cherries, seasonal vegetables',
          chef_notes: 'Our signature dish, prepared with locally sourced duck',
          price: '$38',
          is_signature: true
        }
      ]
    },
    categories: {
      section_title: 'Our Menu',
      category_list: [
        {
          name: 'Appetizers',
          description: 'Fresh seasonal starters',
          price: '$12-18'
        },
        {
          name: 'Main Courses',
          description: 'Chef-crafted entrees',
          price: '$28-45'
        }
      ]
    },
    wine_list: {
      section_title: 'Wine Selection',
      wine_categories: [
        {
          name: 'Château Margaux',
          vintage: '2018',
          price: '$180'
        }
      ]
    },
    contact: {
      section_title: 'Visit Us',
      address: '456 Fine Dining Ave\nUptown, ST 12345',
      phone: '(555) 987-6543',
      email: 'reservations@legourmet.com'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Menu',
      qr_description: 'Share our exquisite dining experience with others',
      qr_size: 'medium'
    }
  }
};