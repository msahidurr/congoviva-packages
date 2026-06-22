export const fastfoodTemplate = {
  id: 'fastfood',
  name: 'Fast Food Menu',
  description: 'Energetic and vibrant menu design for quick service restaurants',
  sections: [
    {
      key: 'menu_info',
      name: 'Restaurant Information',
      fields: [
        { name: 'restaurant_name', type: 'text', label: 'Restaurant Name' },
        { name: 'slogan', type: 'text', label: 'Slogan' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'service_time', type: 'text', label: 'Service Time (e.g., 5-10 minutes)' }
      ],
      required: true
    },
    {
      key: 'combos',
      name: 'Combo Deals',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'combo_deals', type: 'repeater', label: 'Combo Deals', fields: [
          { name: 'name', type: 'text', label: 'Combo Name' },
          { name: 'items', type: 'textarea', label: 'Included Items' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'original_price', type: 'text', label: 'Original Price' },
          { name: 'savings', type: 'text', label: 'Savings Amount' },
          { name: 'is_popular', type: 'checkbox', label: 'Popular Deal' }
        ]}
      ],
      required: false
    },
    {
      key: 'categories',
      name: 'Menu Items',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'category_list', type: 'repeater', label: 'Menu Items', fields: [
          { name: 'name', type: 'text', label: 'Item Name' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'description', type: 'textarea', label: 'Description',colSpan: 2 },
        ]}
      ],
      required: false
    },
    {
      key: 'delivery',
      name: 'Delivery Information',
      fields: [
        { name: 'delivery_available', type: 'checkbox', label: 'Delivery Available' },
        { name: 'delivery_time', type: 'text', label: 'Delivery Time' },
        { name: 'delivery_fee', type: 'text', label: 'Delivery Fee' },
        { name: 'minimum_order', type: 'text', label: 'Minimum Order' }
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
    { name: 'Fast Orange', primary: '#FF6B35', secondary: '#F7931E', accent: '#FFE5B4', background: '#ffffff', text: '#2D3748' },
    { name: 'Red Hot', primary: '#dc2626', secondary: '#ef4444', accent: '#fee2e2', background: '#ffffff', text: '#1f2937' },
    { name: 'Electric Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe', background: '#ffffff', text: '#1f2937' },
    { name: 'Lime Green', primary: '#059669', secondary: '#10b77f', accent: '#d1fae5', background: '#ffffff', text: '#1f2937' },
    { name: 'Purple Pop', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#ede9fe', background: '#ffffff', text: '#1f2937' }
  ],
  defaultColors: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#FFE5B4',
    background: '#ffffff',
    text: '#2D3748'
  },
  defaultData: {
    menu_info: {
      restaurant_name: 'Quick Bites',
      slogan: 'Fast, Fresh, Delicious!',
      description: 'Your favorite fast food made fresh daily with quality ingredients.',
      service_time: '5-10 minutes'
    },
    combos: {
      section_title: "Today's Specials",
      combo_deals: [
        {
          name: 'Big Burger Combo',
          items: 'Double burger, large fries, large drink',
          price: '$9.99',
          original_price: '$12.50',
          savings: '$2.51',
          is_popular: true
        }
      ]
    },
    categories: {
      section_title: 'Our Menu',
      category_list: [
        {
          name: 'Classic Burger',
          description: 'Beef patty with lettuce, tomato, onion',
          price: '$5.99'
        }
      ]
    },
    delivery: {
      delivery_available: true,
      delivery_time: '15-25 minutes',
      delivery_fee: '$2.99',
      minimum_order: '$15.00'
    },
    contact: {
      section_title: 'Visit Us',
      address: '789 Fast Lane\nQuicktown, ST 12345',
      phone: '(555) 456-7890',
      email: 'orders@quickbites.com'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Menu',
      qr_description: 'Share our fast and delicious menu with friends!',
      qr_size: 'medium'
    }
  }
};