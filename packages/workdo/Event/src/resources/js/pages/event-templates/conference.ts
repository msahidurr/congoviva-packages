export const conferenceTemplate = {
  name: 'Conference & Summit',
  sections: [
    {
      key: 'event_info',
      name: 'Event Information',
      fields: [
        { name: 'event_title', type: 'text', label: 'Event Title' },
        { name: 'event_description', type: 'textarea', label: 'Event Description' },
        { name: 'event_date', type: 'date', label: 'Event Date' },
        { name: 'event_time', type: 'time', label: 'Event Time' },
        { name: 'duration', type: 'text', label: 'Duration' }
      ],
      required: true
    },
    {
      key: 'venue',
      name: 'Venue & Location',
      fields: [
        { name: 'venue_name', type: 'text', label: 'Venue Name' },
        { name: 'address', type: 'textarea', label: 'Address' },
        { name: 'map_url', type: 'url', label: 'Google Maps URL' }
      ],
      required: true
    },
    {
      key: 'agenda',
      name: 'Agenda & Schedule',
      fields: [
        {
          name: 'schedule_items',
          type: 'repeater',
          label: 'Schedule',
          fields: [
            { name: 'time', type: 'time', label: 'Time' },
            { name: 'title', type: 'text', label: 'Session Title' },
            { name: 'speaker', type: 'text', label: 'Speaker',colSpan: 2 },
            { name: 'description', type: 'textarea', label: 'Description',colSpan: 2 }
          ]
        }
      ],
      required: false
    },
    {
      key: 'speakers',
      name: 'Speakers & Presenters',
      fields: [
        {
          name: 'speaker_list',
          type: 'repeater',
          label: 'Speakers',
          fields: [
            { name: 'name', type: 'text', label: 'Speaker Name' },
            { name: 'title', type: 'text', label: 'Title/Position' },
            { name: 'company', type: 'text', label: 'Company' },
            { name: 'photo', type: 'file', label: 'Photo' },
            { name: 'bio', type: 'textarea', label: 'Biography',colSpan: 2 }
          ]
        }
      ],
      required: false
    },
    {
      key: 'registration',
      name: 'Registration & Tickets',
      fields: [
        { name: 'registration_url', type: 'url', label: 'Registration URL' },
        { name: 'ticket_price', type: 'text', label: 'Ticket Price' },
        { name: 'early_bird_price', type: 'text', label: 'Early Bird Price' },
        { name: 'registration_deadline', type: 'date', label: 'Registration Deadline' }
      ],
      required: false
    },
    {
      key: 'design',
      name: 'Design Settings',
      fields: [
        { name: 'background_image', type: 'file', label: 'Header Background Image' }
      ],
      required: false
    },
    {
      key: 'contact',
      name: 'Contact Information',
      fields: [
        { name: 'organizer_name', type: 'text', label: 'Organizer Name' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'phone', type: 'tel', label: 'Phone' },
        { name: 'website', type: 'url', label: 'Website' }
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
    { name: 'Professional Blue', primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe', background: '#ffffff', text: '#1f2937' },
    { name: 'Corporate Gray', primary: '#374151', secondary: '#6b7280', accent: '#f3f4f6', background: '#ffffff', text: '#111827' },
    { name: 'Tech Green', primary: '#059669', secondary: '#10b77f', accent: '#d1fae5', background: '#ffffff', text: '#065f46' },
    { name: 'Modern Purple', primary: '#7c3aed', secondary: '#a855f7', accent: '#f3e8ff', background: '#ffffff', text: '#1f2937' },
    { name: 'Elegant Red', primary: '#dc2626', secondary: '#ef4444', accent: '#fecaca', background: '#ffffff', text: '#1f2937' }
  ],
  defaultColors: {
    primary: '#1e40af',
    secondary: '#3b82f6', 
    accent: '#dbeafe',
    background: '#ffffff',
    text: '#1f2937'
  },
  defaultData: {
    event_info: {
      event_title: 'Tech Summit 2025',
      event_description: 'Join industry leaders for cutting-edge insights and networking opportunities.',
      event_date: '',
      event_time: '09:00',
      duration: '8 hours'
    },
    venue: {
      venue_name: 'Convention Center',
      address: '123 Conference Blvd, Tech City, TC 12345',
      map_url: ''
    },
    agenda: {
      schedule_items: [
        { time: '09:00', title: 'Registration & Welcome Coffee', speaker: 'Event Team', description: 'Check-in and networking' },
        { time: '10:00', title: 'Opening Keynote', speaker: 'John Smith', description: 'Future of Technology' }
      ]
    },
    speakers: {
      speaker_list: [
        { name: 'John Smith', title: 'CEO', company: 'Tech Corp', bio: 'Technology visionary with 20+ years experience', photo: '' },
        { name: 'Jane Doe', title: 'CTO', company: 'Innovation Labs', bio: 'Leading expert in AI and machine learning', photo: '' }
      ]
    },
    registration: {
      registration_url: 'https://techsummit.com/register',
      ticket_price: '$299',
      early_bird_price: '$199',
      registration_deadline: ''
    },
    design: {
      background_image: ''
    },
    contact: {
      organizer_name: 'Event Organizers',
      email: 'info@techsummit.com',
      phone: '(555) 123-4567',
      website: 'https://techsummit.com'
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Conference',
      qr_description: 'Scan this QR code to save conference details and share with colleagues.',
      qr_size: 'medium'
    }
  }
};