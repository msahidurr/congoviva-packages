import { socialPlatformsConfig } from '../social-platforms-config';
import { enabledLanguageData as languageData } from '@/pages/vcard-builder/languages';
import { t } from 'i18next';

export const ecommerceTemplate = {
  name: t('E-commerce Store'),
  sections: [
    {
      key: 'header',
      name: t('Header'),
      fields: [
        { name: 'name', type: 'text', label: t('Store Name') },
        { name: 'tagline', type: 'textarea', label: t('Tagline') },
        { name: 'logo', type: 'file', label: t('Logo') }
      ],
      required: true
    },
    {
      key: 'featured',
      name: t('Featured Banner'),
      fields: [
        { name: 'title', type: 'text', label: t('Banner Title') },
        { name: 'subtitle', type: 'text', label: t('Banner Subtitle') },
        { name: 'image', type: 'file', label: t('Banner Image') },
        { name: 'button_text', type: 'text', label: t('Button Text') },
        { name: 'button_url', type: 'url', label: t('Button URL') }
      ],
      required: false
    },
    {
      key: 'about',
      name: t('About'),
      fields: [
        { name: 'description', type: 'textarea', label: t('About Us') },
        { name: 'year_established', type: 'number', label: t('Year Established') }
      ],
      required: false
    },
    {
      key: 'categories',
      name: t('Product Categories'),
      fields: [
        {
          name: 'category_list',
          type: 'repeater',
          label: t('Categories'),
          fields: [
            { name: 'title', type: 'text', label: t('Category Name') },
            { name: 'image', type: 'file', label: t('Category Image') },
            { name: 'url', type: 'url', label: t('Category URL') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'products',
      name: t('Featured Products'),
      fields: [
        {
          name: 'product_list',
          type: 'repeater',
          label: t('Products'),
          fields: [
            { name: 'title', type: 'text', label: t('Product Name') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'price', type: 'text', label: t('Price') },
            { name: 'sale_price', type: 'text', label: t('Sale Price (optional)') },
            { name: 'image', type: 'file', label: t('Product Image') },
            { name: 'url', type: 'url', label: t('Product URL') },
            { name: 'category', type: 'text', label: t('Category') },
            { name: 'badge', type: 'select', label: t('Badge'), options: [
              { value: 'new', label: t('New') },
              { value: 'sale', label: t('Sale') },
              { value: 'bestseller', label: t('Best Seller') },
              { value: 'limited', label: t('Limited Edition') },
              { value: 'none', label: t('None') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'videos',
      name: t('Product Videos'),
      fields: [
        {
          name: 'video_list',
          type: 'repeater',
          label: t('Product & Brand Videos'),
          fields: [
            { name: 'title', type: 'text', label: t('Video Title') },
            { name: 'description', type: 'textarea', label: t('Video Description') },
            { name: 'video_type', type: 'select', label: t('Video Type'), options: [
              { value: 'product_demo', label: t('Product Demonstration') },
              { value: 'unboxing', label: t('Unboxing Experience') },
              { value: 'how_to_use', label: t('How to Use') },
              { value: 'customer_review', label: t('Customer Review') },
              { value: 'brand_story', label: t('Brand Story') },
              { value: 'behind_scenes', label: t('Behind the Scenes') }
            ]},
            { name: 'embed_url', type: 'textarea', label: t('Video Embed URL') },
            { name: 'thumbnail', type: 'file', label: t('Video Thumbnail') },
            { name: 'duration', type: 'text', label: t('Duration') },
            { name: 'product_category', type: 'text', label: t('Product Category') }
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
      key: 'benefits',
      name: t('Shopping Benefits'),
      fields: [
        {
          name: 'benefit_list',
          type: 'repeater',
          label: t('Benefits'),
          fields: [
            { name: 'title', type: 'text', label: t('Benefit Title') },
            { name: 'description', type: 'textarea', label: t('Description') },
            { name: 'icon', type: 'select', label: t('Icon'), options: [
              { value: 'shipping', label: t('Free Shipping') },
              { value: 'returns', label: t('Easy Returns') },
              { value: 'secure', label: t('Secure Checkout') },
              { value: 'support', label: t('Customer Support') },
              { value: 'quality', label: t('Quality Guarantee') },
              { value: 'discount', label: t('Discounts') }
            ]}
          ]
        }
      ],
      required: false
    },
    {
      key: 'contact',
      name: t('Contact Information'),
      fields: [
        { name: 'email', type: 'email', label: t('Email Address') },
        { name: 'phone', type: 'tel', label: t('Phone Number') },
        { name: 'website', type: 'url', label: t('Website URL') },
        { name: 'address', type: 'text', label: t('Address (if applicable)') }
      ],
      required: true
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
      key: 'business_hours',
      name: t('Customer Service Hours'),
      fields: [
        {
          name: 'hours',
          type: 'repeater',
          label: t('Hours'),
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
            { name: 'is_closed', type: 'checkbox', label: t('Closed') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'testimonials',
      name: t('Testimonials'),
      fields: [
        {
          name: 'reviews',
          type: 'repeater',
          label: t('Customer Reviews'),
          fields: [
            { name: 'customer_name', type: 'text', label: t('Customer Name') },
            { name: 'review', type: 'textarea', label: t('Review Text') },
            { name: 'rating', type: 'number', label: t('Rating (1-5)') },
            { name: 'product_purchased', type: 'text', label: t('Product Purchased') }
          ]
        }
      ],
      required: false
    },
    {
      key: 'newsletter',
      name: t('Newsletter'),
      fields: [
        { name: 'title', type: 'text', label: t('Newsletter Title') },
        { name: 'description', type: 'textarea', label: t('Newsletter Description') },
        { name: 'button_text', type: 'text', label: t('Subscribe Button Text') }
      ],
      required: false
    },
    {
      key: 'app_download',
      name: t('App Download'),
      fields: [
        { name: 'app_store_url', type: 'url', label: t('App Store URL') },
        { name: 'play_store_url', type: 'url', label: t('Play Store URL') },
        { name: 'app_description', type: 'textarea', label: t('App Description') }
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
      key: 'thank_you',
      name: t('Thank You Message'),
      fields: [
        { name: 'message', type: 'textarea', label: t('Thank You Message') }
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
        { name: 'qr_description', type: 'textarea', label: t('QR Description') },
        { name: 'qr_size', type: 'select', label: t('QR Code Size'), options: [
          { value: 'small', label: t('Small (128px)') },
          { value: 'medium', label: t('Medium (200px)') },
          { value: 'large', label: t('Large (300px)') }
        ]}
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
      key: 'footer',
      name: t('Footer'),
      fields: [
        { name: 'show_footer', type: 'checkbox', label: t('Show Footer') },
        { name: 'footer_text', type: 'textarea', label: t('Footer Text') },
        { name: 'footer_links', type: 'repeater', label: t('Footer Links'), fields: [
          { name: 'title', type: 'text', label: t('Link Title') },
          { name: 'url', type: 'url', label: t('Link URL') }
        ]}
      ],
      required: false
    },
     {
      key: 'action_buttons',
      name: t('Action Buttons'),
      fields: [
        { name: 'contact_button_text', type: 'text', label: t('Contact Button Text') },
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
    { name: 'Modern Blue', primary: '#4A6CF7', secondary: '#6E82FE', accent: '#EEF1FF', background: '#FFFFFF', text: '#333333' },
    { name: 'Shopping Green', primary: '#10b77f', secondary: '#34D399', accent: '#D1FAE5', background: '#FFFFFF', text: '#333333' },
    { name: 'Luxury Purple', primary: '#8B5CF6', secondary: '#A78BFA', accent: '#EDE9FE', background: '#FFFFFF', text: '#333333' },
    { name: 'Vibrant Orange', primary: '#F59E0B', secondary: '#FBBF24', accent: '#FEF3C7', background: '#FFFFFF', text: '#333333' },
    { name: 'Classic Black', primary: '#1F2937', secondary: '#374151', accent: '#F3F4F6', background: '#FFFFFF', text: '#333333' },
    { name: 'Rose Gold', primary: '#EC4899', secondary: '#F472B6', accent: '#FCE7F3', background: '#FFFFFF', text: '#333333' },
    { name: 'Teal Fresh', primary: '#0D9488', secondary: '#14B8A6', accent: '#CCFBF1', background: '#FFFFFF', text: '#333333' },
    { name: 'Coral Bright', primary: '#EF4444', secondary: '#F87171', accent: '#FEE2E2', background: '#FFFFFF', text: '#333333' }
  ],
  fontOptions: [
    { name: 'Inter', value: 'Inter, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Poppins', value: 'Poppins, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Roboto', value: 'Roboto, sans-serif', weight: '300,400,500,700' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif', weight: '300,400,500,600,700' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', weight: '300,400,600,700' }
  ],
  defaultColors: {
    primary: '#4A6CF7',
    secondary: '#6E82FE',
    accent: '#EEF1FF',
    background: '#FFFFFF',
    text: '#333333',
    cardBg: '#F9F9F9',
    borderColor: '#EEEEEE',
    buttonText: '#FFFFFF',
    saleColor: '#E53935',
    starColor: '#FFC107'
  },
  defaultFont: 'Inter, sans-serif',
  themeStyle: {
    layout: 'ecommerce-layout',
    headerStyle: 'modern',
    cardStyle: 'shadow',
    buttonStyle: 'rounded',
    iconStyle: 'simple',
    spacing: 'comfortable'
  },
  defaultData: {
    header: {
      name: 'StyleHub',
      tagline: 'Quality products for your lifestyle',
      logo: ''
    },
    featured: {
      title: 'Summer Collection',
      subtitle: 'Discover our latest arrivals with up to 30% off',
      image: '',
      button_text: 'Shop Now',
      button_url: 'https://www.stylehub.com/summer'
    },
    about: {
      description: 'StyleHub offers a curated selection of high-quality products for your everyday needs. We focus on sustainable materials, ethical manufacturing, and timeless designs that will last for years to come.',
      year_established: '2018'
    },
    categories: {
      category_list: [
        { title: 'Clothing', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/clothing' },
        { title: 'Accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/accessories' },
        { title: 'Home Decor', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/home' },
        { title: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/beauty' }
      ]
    },
    products: {
      product_list: [
        { title: 'Classic White T-Shirt', description: 'Premium cotton t-shirt with a relaxed fit and durable construction.', price: '$29.99', sale_price: '', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/products/classic-tee', category: 'Clothing', badge: 'bestseller' },
        { title: 'Minimalist Watch', description: 'Sleek design with a leather strap and Japanese movement.', price: '$89.99', sale_price: '$69.99', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/products/minimalist-watch', category: 'Accessories', badge: 'sale' },
        { title: 'Ceramic Plant Pot', description: 'Handcrafted ceramic pot perfect for small to medium plants.', price: '$34.99', sale_price: '', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/products/ceramic-pot', category: 'Home Decor', badge: 'new' },
        { title: 'Natural Face Serum', description: 'Hydrating serum with vitamin C and hyaluronic acid.', price: '$45.99', sale_price: '', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80', url: 'https://www.stylehub.com/products/face-serum', category: 'Beauty', badge: 'none' }
      ]
    },
    benefits: {
      benefit_list: [
        { title: 'Free Shipping', description: 'On all orders over $50', icon: 'shipping' },
        { title: 'Easy Returns', description: '30-day return policy', icon: 'returns' },
        { title: 'Secure Checkout', description: 'Safe & encrypted payment', icon: 'secure' },
        { title: '24/7 Support', description: 'We are here to help', icon: 'support' }
      ]
    },
    contact: {
      email: 'hello@stylehub.com',
      phone: '(555) 123-4567',
      website: 'https://www.stylehub.com',
      address: '123 Fashion Street, Suite 100, New York, NY 10001'
    },
    social: {
      social_links: [
        { platform: 'instagram', url: 'https://instagram.com/stylehub', username: '@stylehub' },
        { platform: 'facebook', url: 'https://facebook.com/stylehub', username: 'StyleHub' },
        { platform: 'pinterest', url: 'https://pinterest.com/stylehub', username: 'stylehub' },
        { platform: 'youtube', url: 'https://youtube.com/stylehub', username: 'StyleHub' }
      ]
    },
    videos: {
      video_list: [
        { title: 'Hanes "SHIRO" White T-Shirt Showcase', description: 'A white t-shirt focused product showcase featuring fit, fabric, and everyday styling appeal.', video_type: 'product_demo', embed_url: 'https://www.youtube.com/watch?v=RqJVwBj-e8I', thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80', duration: '', product_category: 'Clothing' },
        { title: 'Unboxing My Clothing Brand Samples', description: 'An unboxing-style video focused on clothing brand samples, presentation, and first impressions.', video_type: 'unboxing', embed_url: 'https://www.youtube.com/watch?v=UpBR7jQSPdE', thumbnail: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80', duration: '', product_category: 'General' },
      ]
    },
    youtube: {
      channel_url: 'https://youtube.com/stylehub',
      channel_name: 'StyleHub',
      subscriber_count: '52.1K',
      featured_playlist: 'https://youtube.com/playlist?list=PLproductshowcase',
      latest_video_embed: 'https://www.youtube.com/watch?v=RqJVwBj-e8I',
      channel_description: 'Product showcases, styling tips, and behind-the-scenes content from your favorite lifestyle brand. Subscribe for weekly style inspiration!'
    },
    business_hours: {
      hours: [
        { day: 'monday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'tuesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'wednesday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'thursday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'friday', open_time: '09:00', close_time: '18:00', is_closed: false },
        { day: 'saturday', open_time: '10:00', close_time: '16:00', is_closed: false },
        { day: 'sunday', open_time: '', close_time: '', is_closed: true }
      ]
    },
    testimonials: {
      reviews: [
        { customer_name: 'Emily R.', review: 'The quality of the clothing is exceptional. I have ordered multiple times and have always been impressed with both the products and customer service.', rating: '5', product_purchased: 'Classic White T-Shirt' },
        { customer_name: 'Michael T.', review: 'Fast shipping and the minimalist watch exceeded my expectations. Will definitely shop here again!', rating: '5', product_purchased: 'Minimalist Watch' },
        { customer_name: 'Sarah L.', review: 'Love my new ceramic plant pot. It is exactly as described and looks perfect in my living room.', rating: '4', product_purchased: 'Ceramic Plant Pot' }
      ]
    },
    newsletter: {
      title: 'Join Our Newsletter',
      description: 'Subscribe to receive updates on new arrivals, special offers, and styling tips.',
      button_text: 'Subscribe'
    },
    app_download: {
      app_store_url: 'https://apps.apple.com/us/app/shop-all-your-favorite-brands/id1223471316',
      play_store_url: 'https://play.google.com/store/apps/details?id=com.shopify.arrive',
      app_description: 'Download our app for a seamless shopping experience, exclusive mobile offers, and easy order tracking.'
    },
    contact_form: {
      form_title: 'Contact Us',
      form_description: 'Have questions or need assistance? Fill out the form below and our team will get back to you shortly.'
    },
    thank_you: {
      message: 'Thank you for contacting StyleHub. We appreciate your message and will respond within 24 hours during business days.'
    },
    action_buttons: {
      contact_button_text: 'Contact Store',
      save_contact_button_text: 'Save Store Contact'
    },    seo: {
      meta_title: 'StyleHub | Fashion, Accessories, Home Decor, and Beauty',
      meta_description: 'Shop curated clothing, accessories, home decor, and beauty essentials from StyleHub.',
      keywords: 'online store, fashion, accessories, home decor, beauty products, ecommerce',
      og_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80'
    },    pixels: {
      google_analytics: '',
      facebook_pixel: '',
      gtm_id: '',
      custom_head: '',
      custom_body: ''
    },
    custom_html: {
      html_content: '<div class="custom-section"><h4>Special Offers</h4><p>Check out our latest deals and promotions.</p></div>',
      section_title: 'Special Content',
      show_title: true
    },
    qr_share: {
      enable_qr: true,
      qr_title: 'Share Our Store',
      qr_description: 'Scan this QR code to visit our online store and browse our latest products.',
      qr_size: 'medium'
    },
    language: {
      template_language: 'en',
      enable_language_switcher: true
    },
    footer: {
      show_footer: true,
      footer_text: 'Shop with confidence. Free shipping on orders over $50. Easy returns within 30 days.',
      footer_links: [
        { title: 'Shipping Info', url: '#' },
        { title: 'Return Policy', url: '#' },
        { title: 'Size Guide', url: '#' },
        { title: 'Customer Service', url: '#' }
      ]
    },
    copyright: {
      text: '© 2025 StyleHub. All rights reserved.'
    }
  }
};
