import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const influencerTemplate = {
  name: t('Influencer'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Full Name') },
        { name: 'title', type: 'text', label: t('Influencer Title') },
        { name: 'tagline', type: 'textarea', label: t('Bio/Tagline') },
        { name: 'profile_image', type: 'file', label: t('Profile Image') }
      ],
      required: true
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Business Email') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'location', type: 'text', label: t('Location') }
      ],
      required: true
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Me') },
        { name: 'niches', type: 'tags', label: t('Content Niches') },
        { name: 'experience', type: 'number', label: t('Years as Influencer') }
      ],
      required: false
    },
    {
      key: 'stats',
      name: t('Follower Stats'),
      fields: [
        {
          name: 'platform_stats',
          type: 'repeater',
          label: t('Platform Statistics'),
          fields: [
            { name: 'platform', type: 'select', label: t('Platform'), options: [
              { value: 'instagram', label: t('Instagram') },
              { value: 'tiktok', label: t('TikTok') },
              { value: 'youtube', label: t('YouTube') },
              { value: 'twitter', label: t('Twitter/X') },
              { value: 'facebook', label: t('Facebook') },
              { value: 'linkedin', label: t('LinkedIn') },
              { value: 'twitch', label: t('Twitch') },
              { value: 'snapchat', label: t('Snapchat') }
            ]},
            { name: 'followers', type: 'text', label: t('Follower Count') },
            { name: 'engagement_rate', type: 'text', label: t('Engagement Rate') },
            { name: 'monthly_views', type: 'text', label: t('Monthly Views') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'collaborations',
      name: t('Brand Collaborations'),
      fields: [
        {
          name: 'brand_list',
          type: 'repeater',
          label: t('Brand Partnerships'),
          fields: [
            { name: 'brand_name', type: 'text', label: t('Brand Name') },
            { name: 'campaign_type', type: 'select', label: t('Campaign Type'), options: [
              { value: 'sponsored_post', label: t('Sponsored Post') },
              { value: 'product_review', label: t('Product Review') },
              { value: 'brand_ambassador', label: t('Brand Ambassador') },
              { value: 'giveaway', label: t('Giveaway/Contest') },
              { value: 'event', label: t('Event Coverage') },
              { value: 'unboxing', label: t('Unboxing Video') }
            ]},
            { name: 'description', type: 'textarea', label: t('Campaign Description') },
            { name: 'brand_logo', type: 'file', label: t('Brand Logo') },
            { name: 'campaign_url', type: 'url', label: t('Campaign URL') },
            { name: 'results', type: 'text', label: t('Campaign Results') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'services',
      name: t('Influencer Services'),
      fields: [
        {
          name: 'service_list',
          type: 'repeater',
          label: t('Services Offered'),
          fields: [
            { name: 'title', type: 'text', label: t('Service Title') },
            { name: 'description', type: 'textarea', label: t('Service Description') },
            { name: 'price', type: 'text', label: t('Starting Price') },
            { name: 'deliverables', type: 'textarea', label: t('What\'s Included') }
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
            { name: 'username', type: 'text', label: t('Username/Handle') },
            { name: 'follower_count', type: 'text', label: t('Follower Count') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'media_kit',
      name: t('Media Kit'),
      fields: [
        { name: 'media_kit_url', type: 'url', label: t('Media Kit Download URL') },
        { name: 'rate_card_url', type: 'url', label: t('Rate Card URL') },
        { name: 'portfolio_url', type: 'url', label: t('Portfolio URL') }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Client Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Brand Reviews'),
          fields: [
            { name: 'brand_name', type: 'text', label: t('Brand Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'campaign_type', type: 'text', label: t('Campaign Type') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'booking',
      name: t('Collaboration Booking'),
      fields: [
        { name: 'booking_url', type: 'url', label: t('Booking Calendar URL') },
        { name: 'contact_form_url', type: 'url', label: t('Contact Form URL') },
        { name: 'response_time', type: 'text', label: t('Response Time') }
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
      key: 'thank_you',
      name: t('Thank You Message'),
      fields: [
        { name: 'message', type: 'textarea', label: t('Thank You Message') }
      ],
      required: false
    },
    {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
        { name: 'collaboration_button_text', type: 'text', label: t('Collaboration Button Text') },
        { name: 'save_contact_button_text', type: 'text', label: t('Save Contact Button Text') }
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
    }
  ],
  colorPresets: [
    { name: 'Instagram Pink', primary: '#E1306C', secondary: '#F77737', accent: '#FCAF45', background: '#FAFAFA', text: '#262626', cardBg: '#FFFFFF' },
    { name: 'TikTok Vibes', primary: '#FF0050', secondary: '#00F2EA', accent: '#000000', background: '#FFFFFF', text: '#161823', cardBg: '#F8F8F8' },
    { name: 'YouTube Red', primary: '#FF0000', secondary: '#FF4444', accent: '#FFE6E6', background: '#FFFFFF', text: '#0F0F0F', cardBg: '#F9F9F9' },
    { name: 'Aesthetic Purple', primary: '#8B5A96', secondary: '#B19CD9', accent: '#E6D7FF', background: '#F5F3FF', text: '#4C1D95', cardBg: '#FFFFFF' },
    { name: 'Sunset Gradient', primary: '#FF6B6B', secondary: '#FFE66D', accent: '#FF8E53', background: '#FFF5F5', text: '#2D3748', cardBg: '#FFFFFF' },
    { name: 'Ocean Blue', primary: '#0077B6', secondary: '#00B4D8', accent: '#90E0EF', background: '#F0F9FF', text: '#03045E', cardBg: '#FFFFFF' },
    { name: 'Mint Fresh', primary: '#06D6A0', secondary: '#118AB2', accent: '#FFD166', background: '#F8FFFF', text: '#073B4C', cardBg: '#FFFFFF' },
    { name: 'Rose Gold', primary: '#E91E63', secondary: '#F8BBD9', accent: '#FCE4EC', background: '#FFF8F8', text: '#880E4F', cardBg: '#FFFFFF' },
    { name: 'Neon Green', primary: '#39FF14', secondary: '#32CD32', accent: '#98FB98', background: '#F0FFF0', text: '#006400', cardBg: '#FFFFFF' },
    { name: 'Dark Mode', primary: '#BB86FC', secondary: '#03DAC6', accent: '#CF6679', background: '#121212', text: '#FFFFFF', cardBg: '#1E1E1E' }
  ],
  fontOptions: [
    { name: 'Poppins', value: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Montserrat', value: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Playfair Display', value: 'Playfair Display, Georgia, serif', weight: '400,500,600,700' },
    { name: 'Inter', value: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', weight: '400,500,600,700' },
    { name: 'Dancing Script', value: 'Dancing Script, cursive', weight: '400,500,600,700' }
  ],
  defaultColors: {
    primary: '#E1306C',
    secondary: '#F77737',
    accent: '#FCAF45',
    background: '#FAFAFA',
    text: '#262626',
    cardBg: '#FFFFFF',
    borderColor: '#DBDBDB',
    gradient: 'linear-gradient(45deg, #E1306C, #F77737, #FCAF45)'
  },
  defaultFont: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif',
  themeStyle: {
    layout: 'modern-grid',
    headerStyle: 'gradient',
    cardStyle: 'elevated',
    buttonStyle: 'rounded',
    iconStyle: 'filled',
    spacing: 'comfortable',
    shadows: 'soft',
    animations: 'smooth',
    backgroundPattern: 'subtle-dots',
    gradients: true,
    roundedCorners: true
  },
  defaultData: {
    header: {
      name: 'Alex Johnson',
      title: 'Lifestyle & Fashion Influencer',
      tagline: '✨ Creating authentic content that inspires | 📍 NYC | 💌 Collaborations welcome',
      profile_image: ''
    },
    contact: {
      email: 'hello@alexjohnson.com',
      phone: '+1 (555) 123-4567',
      website: 'https://alexjohnson.com',
      location: 'New York City, NY'
    },
    about: {
      description: 'Passionate content creator sharing lifestyle, fashion, and wellness tips with an engaged community. I love connecting with brands that align with my values and creating authentic content that resonates with my audience.',
      niches: 'Fashion, Lifestyle, Beauty, Wellness, Travel',
      experience: '3'
    },
    stats: {
      platform_stats: [
        { platform: 'instagram', followers: '125K', engagement_rate: '4.8%', monthly_views: '2.5M' },
        { platform: 'tiktok', followers: '89K', engagement_rate: '6.2%', monthly_views: '1.8M' },
        { platform: 'youtube', followers: '45K', engagement_rate: '3.5%', monthly_views: '800K' }
      ]
    },
    
    collaborations: {
      brand_list: [
        { brand_name: 'Sustainable Fashion Co.', campaign_type: 'brand_ambassador', description: '6-month partnership promoting eco-friendly fashion', brand_logo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', campaign_url: 'https://alexjohnson.com/collabs/sustainable-fashion', results: '25% increase in brand awareness' },
        { brand_name: 'Beauty Essentials', campaign_type: 'product_review', description: 'Skincare routine featuring new product line', brand_logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', campaign_url: 'https://alexjohnson.com/collabs/beauty-essentials', results: '150K+ views, 8% engagement' },
        { brand_name: 'Wellness Brand', campaign_type: 'sponsored_post', description: 'Promoting healthy lifestyle products', brand_logo: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80', campaign_url: 'https://alexjohnson.com/collabs/wellness-brand', results: '200K+ reach, 12K+ engagements' }
      ]
    },
    services: {
      service_list: [
        { title: 'Instagram Sponsored Post', description: 'High-quality feed post with authentic storytelling', price: 'From $500', deliverables: '1 feed post, 3 stories, usage rights' },
        { title: 'TikTok Video Creation', description: 'Engaging short-form video content', price: 'From $750', deliverables: '1 TikTok video, cross-posting rights' },
        { title: 'Brand Ambassador Program', description: 'Long-term partnership with multiple touchpoints', price: 'Custom pricing', deliverables: 'Monthly content, stories, reels, events' },
        { title: 'Product Photography', description: 'Professional product shots for your brand', price: 'From $300', deliverables: '10 high-res images, editing included' }
      ]
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/alexjohnson', username: '@alexjohnson', follower_count: '125K' },
        { platform: 'tiktok', url: 'https://tiktok.com/@alexjohnson', username: '@alexjohnson', follower_count: '89K' },
        { platform: 'youtube', url: 'https://youtube.com/alexjohnson', username: 'Alex Johnson', follower_count: '45K' },
        { platform: 'twitter', url: 'https://twitter.com/alexjohnson', username: '@alexjohnson', follower_count: '28K' }
      ]
    },
    media_kit: {
      media_kit_url: 'https://alexjohnson.com/media-kit.pdf',
      rate_card_url: 'https://alexjohnson.com/rates.pdf',
      portfolio_url: 'https://alexjohnson.com/portfolio'
    },
    testimonials: {
      reviews: [
        { brand_name: 'Fashion Forward Inc.', review: 'Alex delivered exceptional content that perfectly captured our brand essence. The engagement was outstanding!', rating: '5', campaign_type: 'Brand Ambassador' },
        { brand_name: 'Beauty Collective', review: 'Professional, creative, and authentic. Alex exceeded our expectations with the campaign results.', rating: '5', campaign_type: 'Product Review' },
        { brand_name: 'Lifestyle Brand Co.', review: 'Amazing to work with! Alex understood our vision and created content that truly resonated with our target audience.', rating: '5', campaign_type: 'Sponsored Content' }
      ]
    },
    booking: {
      booking_url: 'https://calendly.com/alexjohnson',
      contact_form_url: 'https://alexjohnson.com/contact',
      response_time: 'Within 24 hours'
    },
    contact_form: {
      form_title: 'Let\'s Collaborate!',
      form_description: 'Ready to create amazing content together? Reach out and let\'s discuss your brand collaboration ideas.'
    },
    thank_you: {
      message: 'Thank you for reaching out! I\'m excited about potential collaborations and will get back to you within 24 hours.'
    },
    custom_html: {
      html_content: '<div class=\"featured-section\"><h4>Featured In</h4><p>Vogue, Elle, Harper\'s Bazaar, and more...</p></div>',
      section_title: 'Press & Features',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Connect With Me',
      qr_description: 'Scan to follow me on all platforms and stay updated with my latest content!'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    action_buttons: {
      contact_button_text: 'Let\'s Collaborate ✨',
      collaboration_button_text: 'Book Partnership 📝',
      save_contact_button_text: 'Save Contact'
    },
    copyright: {
      text: '© 2025 Alex Johnson. All rights reserved.'
    }
  }
};
