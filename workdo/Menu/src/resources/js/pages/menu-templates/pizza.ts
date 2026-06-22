export const pizzaTemplate = {
  id: 'pizza',
  name: 'Pizza Menu',
  description: 'Italian-themed menu design perfect for pizzerias and Italian restaurants',
  sections: [
    {
      key: 'menu_info',
      name: 'Pizzeria Information',
      fields: [
        { name: 'pizzeria_name', type: 'text', label: 'Pizzeria Name' },
        { name: 'italian_motto', type: 'text', label: 'Italian Motto' },
        { name: 'description', type: 'textarea', label: 'Description' },
        { name: 'delivery_time', type: 'text', label: 'Delivery Time' }
      ],
      required: true
    },
    {
      key: 'sizes',
      name: 'Pizza Sizes',
      fields: [
        { name: 'size_options', type: 'repeater', label: 'Size Options', fields: [
          { name: 'size', type: 'text', label: 'Size Name' },
          { name: 'diameter', type: 'text', label: 'Diameter' },
          { name: 'serves', type: 'text', label: 'Serves (people)' },
          { name: 'price', type: 'text', label: 'Base Price' }
        ]}
      ],
      required: false
    },
    {
      key: 'pizzas',
      name: 'Signature Pizzas',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'pizza_list', type: 'repeater', label: 'Pizza List', fields: [
          { name: 'name', type: 'text', label: 'Pizza Name' },
          { name: 'toppings', type: 'textarea', label: 'Toppings' },
          { name: 'crust_type', type: 'text', label: 'Crust Type' },
          { name: 'base_price', type: 'text', label: 'Base Price' },
          { name: 'is_popular', type: 'checkbox', label: 'Popular Pizza' },
          { name: 'is_spicy', type: 'checkbox', label: 'Spicy' }
        ]}
      ],
      required: false
    },
    {
      key: 'sides',
      name: 'Sides & Extras',
      fields: [
        { name: 'section_title', type: 'text', label: 'Section Title' },
        { name: 'side_items', type: 'repeater', label: 'Side Items', fields: [
          { name: 'name', type: 'text', label: 'Item Name' },
          { name: 'price', type: 'text', label: 'Price' },
          { name: 'description', type: 'textarea', label: 'Description',colSpan: 2 },
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
    { name: 'Italian Red', primary: '#C41E3A', secondary: '#7d891f', accent: '#FFD700', background: '#ffffff', text: '#2D3748' },
    { name: 'Margherita', primary: '#dc2626', secondary: '#f0b2b2', accent: '#fef3c7', background: '#ffffff', text: '#1f2937' },
    { name: 'Pepperoni', primary: '#ea580c', secondary: '#dc2626', accent: '#fed7aa', background: '#ffffff', text: '#9a3412' },
    { name: 'Quattro Stagioni', primary: '#059669', secondary: '#eab308', accent: '#d1fae5', background: '#ffffff', text: '#1f2937' },
    { name: 'Napoletana', primary: '#1e40af', secondary: '#ef4444', accent: '#dbeafe', background: '#ffffff', text: '#1f2937' }
  ],
  defaultColors: {
    primary: '#C41E3A',
    secondary: '#228B22',
    accent: '#FFD700',
    background: '#ffffff',
    text: '#2D3748'
  },
  defaultData: {
    menu_info: {
      pizzeria_name: 'Mama Mia Pizzeria',
      italian_motto: 'Autentica Pizza Italiana',
      description: 'Authentic Italian pizza made with traditional recipes and the finest ingredients.',
      delivery_time: '25-35 minutes'
    },
    sizes: {
      size_options: [
        {
          size: 'Small',
          diameter: '10"',
          serves: '1-2',
          price: '$12.99'
        },
        {
          size: 'Large',
          diameter: '16"',
          serves: '3-4',
          price: '$18.99'
        }
      ]
    },
    pizzas: {
      section_title: 'Our Menu',
      pizza_list: [
        {
          name: 'Margherita',
          toppings: 'Fresh mozzarella, tomato sauce, basil',
          crust_type: 'Thin',
          base_price: '$16.99',
          is_popular: true,
          is_spicy: false
        }
      ]
    },
    sides: {
      section_title: 'Sides & Extras',
      side_items: [
        {
          name: 'Garlic Bread',
          description: 'Fresh baked with herbs',
          price: '$4.99'
        }
      ]
    },
    contact: {
      section_title: 'Visit Us',
      address: '321 Pizza Street\nLittle Italy, ST 12345',
      phone: '(555) 321-9876',
      email: 'orders@mamamia.com'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Pizza Menu',
      qr_description: 'Share our authentic Italian pizza menu with pizza lovers!',
      qr_size: 'medium'
    }
  }
};