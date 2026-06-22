export const birthdayTemplate = {
  name: 'Birthday Party',
  sections: [
    {
      key: 'event_info',
      name: 'Party Details',
      fields: [
        { name: 'birthday_person', type: 'text', label: 'Birthday Person' },
        { name: 'age_turning', type: 'text', label: 'Age Turning' },
        { name: 'party_date', type: 'date', label: 'Party Date' },
        { name: 'party_time', type: 'time', label: 'Party Time' },
        { name: 'theme', type: 'text', label: 'Party Theme' },
        { name: 'dress_code', type: 'text', label: 'Dress Code' }
      ],
      required: true
    },
    {
      key: 'venue',
      name: 'Venue & Location',
      fields: [
        { name: 'venue_name', type: 'text', label: 'Venue Name' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'parking_info', type: 'text', label: 'Parking Information' },
        { name: 'special_instructions', type: 'textarea', label: 'Special Instructions' }
      ],
      required: true
    },
    {
      key: 'activities',
      name: 'Activities & Entertainment',
      fields: [
        {
          name: 'activity_list',
          type: 'repeater',
          label: 'Activities',
          fields: [
            { name: 'activity_name', type: 'text', label: 'Activity Name' },
            { name: 'time', type: 'time', label: 'Time' },
            { name: 'description', type: 'textarea', label: 'Description',colSpan: 2  },
          ]
        }
      ],
      required: false
    },
    {
      key: 'food_drinks',
      name: 'Food & Drinks',
      fields: [
        { name: 'menu_type', type: 'text', label: 'Menu Type' },
        { name: 'special_dietary', type: 'textarea', label: 'Dietary Requirements' },
        { name: 'cake_flavor', type: 'text', label: 'Cake Flavor' },
        { name: 'drinks_provided', type: 'checkbox', label: 'Drinks Provided' },
        {
          name: 'menu_items',
          type: 'repeater',
          label: 'Menu Items',
          fields: [
            { name: 'item_name', type: 'text', label: 'Item Name' },
            { name: 'category', type: 'text', label: 'Category' },
            { name: 'description', type: 'textarea', label: 'Description',colSpan: 2 },
          ]
        }
      ],
      required: false
    },
    {
      key: 'rsvp',
      name: 'RSVP',
      fields: [
        { name: 'rsvp_phone', type: 'tel', label: 'RSVP Phone' },
        { name: 'rsvp_email', type: 'email', label: 'RSVP Email' },
        { name: 'rsvp_deadline', type: 'date', label: 'RSVP By' },
        { name: 'guest_limit', type: 'text', label: 'Guest Limit' }
      ],
      required: false
    },
    {
      key: 'gifts',
      name: 'Gift Information',
      fields: [
        { name: 'gift_preference', type: 'textarea', label: 'Gift Preferences' },
        { name: 'no_gifts', type: 'checkbox', label: 'No Gifts Please' },
        { name: 'charity_donation', type: 'text', label: 'Charity Donation Instead' }
      ],
      required: false
    },
    {
      key: 'design',
      name: 'Design Settings',
      fields: [
        { name: 'background_image', type: 'file', label: 'Background Image' },
        { name: 'birthday_photo', type: 'file', label: 'Birthday Person Photo' }
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
    { name: 'Party Purple', primary: '#9c27b0', secondary: '#e1bee7', accent: '#f3e5f5', background: '#ffffff', text: '#333333' },
    { name: 'Fun Pink', primary: '#e91e63', secondary: '#f48fb1', accent: '#fce4ec', background: '#ffffff', text: '#333333' },
    { name: 'Bright Blue', primary: '#0ea5e9', secondary: '#7dd3fc', accent: '#e0f2fe', background: '#ffffff', text: '#333333' },
    { name: 'Sunny Yellow', primary: '#eab308', secondary: '#facc15', accent: '#fef3c7', background: '#ffffff', text: '#333333' },
    { name: 'Tropical Green', primary: '#10b77f', secondary: '#6ee7b7', accent: '#d1fae5', background: '#ffffff', text: '#333333' }
  ],
  defaultColors: {
    primary: '#9c27b0',
    secondary: '#e1bee7',
    accent: '#f3e5f5',
    background: '#ffffff',
    text: '#333333'
  },
  defaultData: {
    event_info: {
      birthday_person: 'Alex',
      age_turning: 25,
      party_date: '',
      party_time: '19:00',
      theme: 'Celebration',
      dress_code: 'Casual & Fun'
    },
    venue: {
      venue_name: 'Community Center',
      address: '789 Party Lane, Fun City, FC 12345',
      parking_info: 'Free parking available',
      special_instructions: 'Enter through main entrance'
    },
    activities: {
      activity_list: [
        { activity_name: 'Cake Cutting', description: 'Birthday cake celebration', time: '20:00' },
        { activity_name: 'Games & Music', description: 'Fun activities and dancing', time: '20:30' }
      ]
    },
    food_drinks: {
      menu_type: 'Buffet Style',
      special_dietary: 'Vegetarian options available',
      cake_flavor: 'Chocolate',
      drinks_provided: true,
      menu_items: [
        { item_name: 'Pizza', description: 'Assorted flavors', category: 'Main Course' },
        { item_name: 'Birthday Cake', description: 'Chocolate birthday cake', category: 'Dessert' }
      ]
    },
    rsvp: {
      rsvp_phone: '(555) 123-4567',
      rsvp_email: 'party@alex.com',
      rsvp_deadline: '',
      guest_limit: 'Adults & Kids Welcome'
    },
    gifts: {
      gift_preference: 'Your presence is the best present!',
      no_gifts: false,
      charity_donation: ''
    },
    design: {
      background_image: '',
      birthday_photo: ''
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share My Party',
      qr_description: 'Scan this QR code to save party details and share with friends!',
      qr_size: 'medium'
    }
  }
};