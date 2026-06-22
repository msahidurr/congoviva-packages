import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const doctorTemplate = {
  name: t('Doctor/Medical'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Doctor Name') },
        { name: 'title', type: 'text', label: t('Medical Title') },
        { name: 'specialization', type: 'text', label: t('Specialization') },
        { name: 'professional_badge', type: 'text', label: t('Professional Badge') },
        { name: 'profile_image', type: 'file', label: t('Profile Photo') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Doctor') },
        { name: 'qualifications', type: 'textarea', label: t('Qualifications') },
        { name: 'experience_years', type: 'number', label: t('Years of Experience') }
      ],
      required: false
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'emergency_phone', type: 'tel', label: t('Emergency Phone') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'clinic_address', type: 'textarea', label: t('Clinic Address') }
      ],
      required: true
    },
    {
      key: 'business_hours',
      name: t('Clinic Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Clinic Hours'),
          fields: [
            { name: 'day', type: 'select', label: t('Day'), options: [
              { value: 'monday', label: t('Monday') },
              { value: 'tuesday', label: t('Tuesday') },
              { value: 'wednesday', label: t('Wednesday') },
              { value: 'thursday', label: t('Thursday') },
              { value: 'friday', label: t('Friday') },
              { value: 'saturday', label: t('Saturday') },
              { value: 'sunday', label: t('Sunday') }
            ]},
            { name: 'open_time', type: 'time', label: t('Opening Time') },
            { name: 'close_time', type: 'time', label: t('Closing Time') },
            { name: 'is_closed', type: 'checkbox', label: t('Closed') },
            { name: 'appointment_only', type: 'checkbox', label: t('By Appointment Only') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'specialties',
      name: t('Medical Specialties'),
      fields: [
        {
          name: 'specialty_list',
          type: 'repeater',
          label: t('Specialties'),
          fields: [
            { name: 'name', type: 'text', label: t('Specialty Name') },
            { name: 'description', type: 'textarea', label: t('Description') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Educational Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Medical Education Content'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'health_education', label: t('Health Education') },
              { value: 'procedure_explanation', label: t('Procedure Explanation') },
              { value: 'prevention_tips', label: t('Prevention Tips') },
              { value: 'patient_testimonial', label: t('Patient Testimonial') },
              { value: 'clinic_tour', label: t('Clinic Tour') },
              { value: 'doctor_introduction', label: t('Doctor Introduction') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'medical_specialty', type: 'text', label: t('Medical Specialty') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'youtube',
      name: t('YouTube Channel'),
      fields: [
        { name: 'channel_url', type: 'url', label: t('YouTube Channel URL') },
        { name: 'channel_name', type: 'text', label: t('Channel Name') },
        { name: 'subscriber_count', type: 'text', label: t('Subscriber Count') },
        { name: 'featured_playlist', type: 'url', label: t('Featured Playlist URL') },
        { name: 'latest_video_embed', type: 'textarea', label: t('Latest Video Embed Code') },
        { name: 'channel_description', type: 'textarea', label: t('Channel Description') }
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Medical Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Services'),
          fields: [
            { name: 'name', type: 'text', label: t('Service Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'duration', type: 'text', label: t('Duration') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'appointments',
      name: t('Appointments'),
      fields: [
        { name: 'booking_phone', type: 'tel', label: t('Appointment Phone') },
        { name: 'online_booking_url', type: 'url', label: t('Online Booking URL') },
        { name: 'booking_instructions', type: 'textarea', label: t('Booking Instructions') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Patient Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Patient Reviews'),
          fields: [
            { name: 'patient_name', type: 'text', label: t('Patient Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'social',
      name: t('Social Media'),
      fields: [
        {
          name: 'social_links',
          type: 'repeater',
          label: t('Social Media Links'),
          fields: [
            { name: 'platform', type: 'select', label: t('Platform'), options: socialPlatformsConfig.map(p => ({ value: p.value, label: p.label })) },
            { name: 'url', type: 'url', label: t('Profile URL') },
            { name: 'username', type: 'text', label: t('Username/Handle') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'google_map',
      name: t('Clinic Location'),
      fields: [
        { name: 'map_embed_url', type: 'textarea', label: t('Google Maps Embed URL') },
        { name: 'directions_url', type: 'url', label: t('Google Maps Directions URL') }
      ],
      required: false
    },
    {
      key: 'app_download',
      name: t('Medical App'),
      fields: [
        { name: 'app_store_url', type: 'url', label: t('App Store URL') },
        { name: 'play_store_url', type: 'url', label: t('Play Store URL') }
      ],
      required: false
    },
    {
      key: 'custom_html',
      name: t('Custom HTML'),
      fields: [
        { name: 'html_content', type: 'textarea', label: t('Custom HTML Code') },
        { name: 'section_title', type: 'text', label: t('Section Title') },
        { name: 'show_title', type: 'checkbox', label: t('Show Section Title') }
      ],
      required: false
    },
    {
      key: 'qr_share',
      name: t('QR Code Share'),
      fields: [
        { name: 'enable_qr', type: 'checkbox', label: t('Enable QR Code Sharing') },
        { name: 'qr_title', type: 'text', label: t('QR Section Title') },
        { name: 'qr_description', type: 'textarea', label: t('QR Description') }
      ],
      required: false
    },
    {
      key: 'contact_form',
      name: t('Contact Form'),
      fields: [
        { name: 'form_title', type: 'text', label: t('Form Title') },
        { name: 'form_description', type: 'textarea', label: t('Form Description') }
      ],
      required: false
    },
    {
      key: 'language',
      name: t('Language Settings'),
      fields: [
        { name: 'enable_language_switcher', type: 'checkbox', label: t('Enable Language Switcher') },
        { name: 'template_language', type: 'select', label: t('Template Language'), options: languageData.map(lang => ({ value: lang.code, label: `${String.fromCodePoint(...lang.countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt()))} ${lang.name}` })) }
      ],
      required: false
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'appointment_button_text', type: 'text', label: t('Appointment Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') }
      ],
      required: false
    },
    {
      key: 'thank_you',
      name: t('Thank You Message'),
      fields: [
        { name: 'message', type: 'textarea', label: t('Thank You Message') }
      ],
      required: false
    },
    {
      key: 'copyright',
      name: t('Copyright'),
      fields: [
        { name: 'text', type: 'text', label: t('Copyright Text') }
      ],
      required: false
    },
    {
      key: 'seo',
      name: t('SEO Settings'),
      fields: [
        { name: 'meta_title', type: 'text', label: t('Meta Title') },
        { name: 'meta_description', type: 'textarea', label: t('Meta Description') },
        { name: 'keywords', type: 'text', label: t('Keywords') },
        { name: 'og_image', type: 'url', label: t('Open Graph Image URL') }
      ],
      required: false
    },
    {
      key: 'pixels',
      name: t('Pixel & Analytics'),
      fields: [
        { name: 'google_analytics', type: 'text', label: t('Google Analytics ID') },
        { name: 'facebook_pixel', type: 'text', label: t('Facebook Pixel ID') },
        { name: 'gtm_id', type: 'text', label: t('Google Tag Manager ID') },
        { name: 'custom_head', type: 'textarea', label: t('Custom Head Code') },
        { name: 'custom_body', type: 'textarea', label: t('Custom Body Code') }
      ],
      required: false
    }
  ],
  colorPresets: [
    { name: 'Medical Blue', primary: '#1E40AF', secondary: '#3B82F6', accent: '#DBEAFE', background: '#F8FAFC', text: '#1E293B' },
    { name: 'Health Green', primary: '#047857', secondary: '#10b77f', accent: '#D1FAE5', background: '#F0FDF4', text: '#14532D' },
    { name: 'Clinical White', primary: '#475569', secondary: '#64748B', accent: '#E2E8F0', background: '#FFFFFF', text: '#0F172A' },
    { name: 'Trust Teal', primary: '#0F766E', secondary: '#14B8A6', accent: '#CCFBF1', background: '#F0FDFA', text: '#134E4A' },
    { name: 'Cardiology Red', primary: '#DC2626', secondary: '#EF4444', accent: '#FEE2E2', background: '#FEF2F2', text: '#7F1D1D' },
    { name: 'Pharmacy Purple', primary: '#7C3AED', secondary: '#A855F7', accent: '#EDE9FE', background: '#FAF5FF', text: '#581C87' },
    { name: 'Sterile Gray', primary: '#6B7280', secondary: '#9CA3AF', accent: '#F3F4F6', background: '#FAFAFA', text: '#374151' },
    { name: 'Emergency Orange', primary: '#EA580C', secondary: '#FB923C', accent: '#FED7AA', background: '#FFF7ED', text: '#9A3412' },
    { name: 'Wellness Rose', primary: '#E11D48', secondary: '#F43F5E', accent: '#FECDD3', background: '#FFF1F2', text: '#881337' },
    { name: 'Healing Mint', primary: '#059669', secondary: '#34D399', accent: '#A7F3D0', background: '#ECFDF5', text: '#064E3B' }
  ],
  fontOptions: [
    { name: 'Inter Medical', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', weight: '400,600,700' },
    { name: 'Roboto Clinical', value: 'Roboto, Arial, sans-serif', weight: '300,400,500,700' },
    { name: 'Open Sans', value: 'Open Sans, Helvetica, sans-serif', weight: '400,600,700' },
    { name: 'Lato Professional', value: 'Lato, sans-serif', weight: '400,700,900' }
  ],
  defaultColors: {
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#DBEAFE',
    background: '#F8FAFC',
    text: '#1E293B',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  defaultFont: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'clinical',
    headerStyle: 'professional',
    cardStyle: 'clean',
    buttonStyle: 'rounded',
    iconStyle: 'medical',
    spacing: 'comfortable',
    shadows: 'subtle',
    animations: 'gentle'
  },
  defaultData: {
    header: {
      name: 'Dr. Sarah Johnson',
      title: 'MD, FACP',
      specialization: 'Internal Medicine & Cardiology',
      professional_badge: 'HEALTHCARE PROFESSIONAL',
      profile_image: ''
    },
    about: {
      description: 'Dr. Sarah Johnson is a board-certified internal medicine physician with specialized training in cardiology. She is dedicated to providing comprehensive, patient-centered care with a focus on preventive medicine.',
      qualifications: 'MD from Harvard Medical School, Residency in Internal Medicine at Johns Hopkins, Fellowship in Cardiology at Mayo Clinic',
      experience_years: '15'
    },
    contact: {
      email: 'dr.johnson@healthclinic.com',
      phone: '+1 (555) 123-4567',
      emergency_phone: '+1 (555) 911-0000',
      website: 'https://drjohnsonmd.com',
      clinic_address: '456 Medical Center Drive, Suite 200, Health City, NY 10002'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '08:00', close_time: '17:00', is_closed: false, appointment_only: false },
        { day: 'tuesday', open_time: '08:00', close_time: '17:00', is_closed: false, appointment_only: false },
        { day: 'wednesday', open_time: '08:00', close_time: '17:00', is_closed: false, appointment_only: false },
        { day: 'thursday', open_time: '08:00', close_time: '17:00', is_closed: false, appointment_only: false },
        { day: 'friday', open_time: '08:00', close_time: '16:00', is_closed: false, appointment_only: false },
        { day: 'saturday', open_time: '09:00', close_time: '13:00', is_closed: false, appointment_only: true },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true, appointment_only: false }
      ]
    },
    specialties: {
      specialty_list: [
        { name: 'Preventive Cardiology', description: 'Heart disease prevention and risk assessment' },
        { name: 'Hypertension Management', description: 'Comprehensive blood pressure management' },
        { name: 'Diabetes Care', description: 'Type 1 and Type 2 diabetes management' }
      ]
    },
    services: {
      service_list: [
        { name: 'Annual Physical Exam', description: 'Comprehensive health assessment', duration: '60 minutes' },
        { name: 'Cardiac Consultation', description: 'Heart health evaluation', duration: '45 minutes' },
        { name: 'Preventive Care', description: 'Screenings and vaccinations', duration: '30 minutes' }
      ]
    },
    appointments: {
      booking_phone: '+1 (555) 123-4567',
      online_booking_url: 'https://drjohnsonmd.com/appointments',
      booking_instructions: 'Please call 24 hours in advance for appointments. Emergency consultations available.'
    },
    testimonials: {
      reviews: [
        { patient_name: 'Michael Chen', review: 'Dr. Johnson is thorough and caring. She takes time to explain everything clearly.', rating: '5' },
        { patient_name: 'Lisa Williams', review: 'Excellent bedside manner and very knowledgeable. Highly recommend!', rating: '5' }
      ]
    },
    social: {
      social_links: [
        { platform: 'linkedin', url: 'https://linkedin.com/in/drjohnsonmd', username: 'Dr. Sarah Johnson' },
        { platform: 'facebook', url: 'https://facebook.com/drjohnsonmd', username: 'Dr. Johnson Medical Practice' },
        { platform: 'healthgrades', url: 'https://healthgrades.com/physician/dr-johnson', username: 'Dr. Sarah Johnson' },
        { platform: 'youtube', url: 'https://youtube.com/drjohnsonmd', username: 'Dr. Sarah Johnson MD' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Understanding Heart Health: Prevention Tips', description: 'Learn essential tips for maintaining cardiovascular health and preventing heart disease', video_type: 'health_education', embed_url: 'https://www.youtube.com/watch?v=lIcy4r_4XPI', thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80', duration: '12:45', medical_specialty: 'Cardiology' },
        { title: 'What to Expect During Your Annual Physical', description: 'A comprehensive guide to annual physical examinations and their importance', video_type: 'procedure_explanation', embed_url: 'https://www.youtube.com/watch?v=fMxynzOl1zo', thumbnail: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80', duration: '8:30', medical_specialty: 'Internal Medicine' },
        { title: 'Managing Diabetes: A Patient\'s Journey', description: 'Real patient story about successfully managing Type 2 diabetes', video_type: 'patient_testimonial', embed_url: 'https://www.youtube.com/watch?v=yvAyh5MhzpQ', thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80', duration: '6:15', medical_specialty: 'Endocrinology' }
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/drjohnsonmd',
      channel_name: 'Dr. Sarah Johnson MD',
      subscriber_count: '24.8K',
      featured_playlist: 'https://youtube.com/playlist?list=PLhearthealth',
      latest_video_embed: 'https://www.youtube.com/watch?v=lIcy4r_4XPI',
      channel_description: 'Medical education videos, health tips, and patient care insights from a board-certified internal medicine physician and cardiologist.'
    },
    google_map: {
      map_embed_url: '<iframe src="https://www.google.com/maps?q=456%20Medical%20Center%20Drive%2C%20New%20York%2C%20NY%2010002&z=14&output=embed" width="100%" height="100%" style="border:0;" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>',
      directions_url: 'https://www.google.com/maps/dir/?api=1&destination=456+Medical+Center+Drive+New+York+NY+10002'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/mychart/id382952264',
      play_store_url: 'https://play.google.com/store/apps/details?id=epic.mychart.android'
    },
    contact_form: {
      form_title: 'Schedule a Consultation',
      form_description: 'Have questions about your health? Contact us to schedule a consultation.'
    },
    custom_html: {
      html_content: '<h3>Comprehensive Healthcare</h3><p>Dr. Sarah Johnson is a board-certified physician with 15+ years of experience providing compassionate, patient-centered care. Specializing in internal medicine and cardiology with a focus on preventive healthcare.</p>',
      section_title: 'Medical Excellence',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Doctor Info',
      qr_description: 'Scan to share doctor information with family and friends'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'Contact Doctor',
      appointment_button_text: 'Schedule Appointment', 
      save_contact_button_text: 'Save Contact'
    },
    thank_you: {
      message: 'Thank you for choosing Dr. Johnson for your healthcare needs. Your health is our priority.'
    },
    seo: {
      meta_title: 'Dr. Sarah Johnson, MD | Internal Medicine & Cardiology',
      meta_description: 'Board-certified physician specializing in internal medicine and cardiology. Preventive care, heart health consultations, and patient-centered treatment.',
      keywords: 'doctor, internal medicine, cardiology, preventive care, heart health, physician, clinic',
      og_image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    copyright: {
      text: '© 2025 Dr. Sarah Johnson, MD. All rights reserved.'
    }
  }
};
