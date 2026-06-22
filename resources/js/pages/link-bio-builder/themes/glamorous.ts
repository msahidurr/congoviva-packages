import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

const defaults = {
  name: t('Victoria Glamour'),
  tagline: t('Beauty & Lifestyle Influencer'),
  description: t('Living life in full glamour! Beauty tips, luxury lifestyle, and everything that sparkles.'),
  links: [
    { text: 'Beauty Tutorials', url: '#', description: t('Makeup & skincare'), icon: '' },
    { text: 'Luxury Reviews', url: '#', description: t('Premium products'), icon: '' },
    { text: 'Glamour Guide', url: '#', description: t('Style inspiration'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'youtube', url: '#', icon: '' },
    { platform: 'tiktok', url: '#', icon: '' }
  ]
};

const GlamorousTheme: ThemeType = {
  name: 'Glamorous',
  layout: 'standard',
  buttonStyle: 'pill',
  socialPosition: 'bottom',
  profileStyle: 'circular-frame',
  profileFields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      placeholder: t('Enter your name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Personal Details'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Tagline'),
      type: 'text',
      placeholder: t('e.g., "Glow Up with Mia"'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Personal Details'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Image'),
      type: 'image',
      placeholder: t('Upload your profile image'),
      required: false,
      section: t('Personal Details'),
      cols: 2
    },
    {
      name: 'description',
      label: t('Bio'),
      type: 'textarea',
      placeholder: t('Tell your story...'),
      defaultValue: defaults.description,
      required: false,
      section: t('About'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Glamorous Influencer Theme */
    .bio-link-container.glamorous-theme {
      position: relative;
      font-family: var(--theme-font, 'Playfair Display', serif);
      overflow: hidden;
      min-height: 100vh;
      background: var(--theme-background, linear-gradient(135deg, #FFD1DC 0%, #FFF0F5 100%));
      color: var(--theme-text-color, #333333);
    }
    
    /* Sparkle overlay */
    .glamorous-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 2px, transparent 2px),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
      background-size: 100px 100px, 150px 150px, 200px 200px;
      pointer-events: none;
      z-index: 0;
    }
    
    /* Container styling */
    .glamorous-theme .bio-link-header {
      position: relative;
      padding: 4rem 2rem 3rem;
      z-index: 1;
      text-align: center;
    }
    
    /* Transparent header when background image is set */

    
    /* Profile image with soft shadow */
    .glamorous-theme .bio-link-profile {
      width: 140px !important;
      height: 140px !important;
      margin: 0 auto 2rem;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      box-shadow: 0 20px 40px rgba(255, 105, 180, 0.2);
      transition: all 0.4s ease;
      border: 4px solid rgba(255, 255, 255, 0.8);
    }
    
    .glamorous-theme .bio-link-profile::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: 50%;
      background: #000000;
      z-index: -1;
      opacity: 0.7;
    }
    
    .glamorous-theme .bio-link-profile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Name styling with Playfair Display */
    .glamorous-theme .bio-link-title {
      font-family: var(--theme-font, 'Playfair Display', serif);
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--theme-text-color, #333333);
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 255, 255, 0.9);
      position: relative;
    }
    
    /* Tagline styling */
    .glamorous-theme .bio-link-description {
      font-family: 'Lato', sans-serif;
      font-size: 1.1rem;
      color: var(--theme-text-color, #666666);
      margin-bottom: 2rem;
      font-style: italic;
      text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.7), 0 0 8px rgba(255, 255, 255, 0.8);
    }
    
    /* Links container */
    .glamorous-theme .links-container {
      padding: 0 2rem 3rem;
      position: relative;
      z-index: 1;
    }
    
    
    /* Button styling with Lato font */
    .glamorous-theme .bio-link-button {
      font-family: 'Lato', sans-serif;
      display: block;
      width: 100%;
      padding: 1rem 2rem;
      margin-bottom: 1rem;
      background: var(--theme-button-color, rgba(255, 255, 255, 0.9));
      border: 2px solid rgba(255, 105, 180, 0.2);
      border-radius: 50px;
      color: var(--theme-button-text-color, #333333);
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.15);
    }
    
    /* Transparent link buttons when background image is set */
    .glamorous-theme.has-bg-image .bio-link-button {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Sparkle hover effect */
    .glamorous-theme .bio-link-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
      );
      transition: left 0.6s ease;
    }
    


    
    /* Social icons container */
    .glamorous-theme .social-container {
      position: relative;
      z-index: 1;
      padding: 2rem;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      margin-top: 2rem;
    }
    
    
    .glamorous-theme .social-icons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    /* Social icon styling */
    .glamorous-theme .social-icon {
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--theme-button-color, rgba(255, 255, 255, 0.9));
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 8px 20px rgba(255, 105, 180, 0.15);
      position: relative;
      overflow: hidden;
    }
    
    .glamorous-theme .social-icon::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, #FF69B4, #FFD1DC);
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 50%;
    }
    
    .glamorous-theme .social-icon:hover::after {
      opacity: 0.1;
    }
    
    .glamorous-theme .social-icon:hover {
      transform: translateY(-5px) scale(1.1);
      box-shadow: 0 15px 30px rgba(255, 105, 180, 0.3);
    }
    
    .glamorous-theme .social-icon svg {
      width: 24px;
      height: 24px;
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
    }
    
    .glamorous-theme .social-icon:hover svg {
      transform: scale(1.2);
    }
    
    /* Bio section styling */
    .glamorous-theme .bio-section {
      position: relative;
      z-index: 1;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .glamorous-theme .bio-text {
      font-family: 'Lato', sans-serif;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--theme-text-color, #555555);
      text-align: center;
      background: rgba(0, 0, 0, 0.2);
      padding: 1.5rem;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 25px rgba(255, 105, 180, 0.1);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .glamorous-theme .bio-link-title {
        font-size: 2rem;
      }
      
      .glamorous-theme .bio-link-header {
        padding: 3rem 1.5rem 2rem;
      }
      
      .glamorous-theme .links-container {
        padding: 0 1.5rem 2rem;
      }
      
      .glamorous-theme .bio-section {
        padding: 0 1.5rem 2rem;
      }
      
      .glamorous-theme .social-icons {
        gap: 1rem;
      }
      
      .glamorous-theme .social-icon {
        width: 45px;
        height: 45px;
      }
    }`,
  colorPresets: [

    {
      name: 'Rose Gold Glam',
      background: {
        type: 'image',
        color: '#DB2286',
        gradient: 'linear-gradient(135deg, #D4A574 0%, #E6C2A6 100%)',
        image: 'storage/images/bio-image/glamorous/image2.jpg'
      },
      buttonColor: '#DB2286',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
        {
      name: 'Soft Peach Pink',
      background: {
        type: 'image',
        color: '#D4AF37',
        gradient: 'linear-gradient(135deg, #FFD1DC 0%, #FFF0F5 100%)',
        image: 'storage/images/bio-image/glamorous/image1.jpg'
      },
      buttonColor: '#D4AF37',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Lavender Dreams',
      background: {
        type: 'image',
        color: '#C41E3A',
        gradient: 'linear-gradient(135deg, #B19CD9 0%, #D1C4E9 100%)',
        image: 'storage/images/bio-image/glamorous/image3.jpg'
      },
      buttonColor: '#C41E3A',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Champagne Bubble',
      background: {
        type: 'image',
        color: '#9966CC',
        gradient: 'linear-gradient(135deg, #E6D7B8 0%, #F5E6D3 100%)',
        image: 'storage/images/bio-image/glamorous/image4.jpg'
      },
      buttonColor: '#9966CC',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Midnight Elegance',
      background: {
        type: 'image',
        color: '#B87333',
        gradient: 'linear-gradient(135deg, #2C2C54 0%, #40407A 100%)',
        image: 'storage/images/bio-image/glamorous/image5.jpg'
      },
      buttonColor: '#B87333',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Playfair Display, serif',
  defaultPreset: 0,
  
  renderProfile: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, buttonTextColor, isPublic } = props;
    // Use defaults when header data is empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const { header } = data.config;
    
    const displayName = header.name || (header.name !== null && header.name !== '' && isEditMode ? defaults.name : null);
    const displayTagline = header.tagline || (header.tagline !== null && header.tagline !== '' && isEditMode ? defaults.tagline : null);
    const displayEmail = header.email || (header.email !== null && header.email !== '' && isEditMode ? defaults.email : null);
    const displayPhone = header.phone || (header.phone !== null && header.phone !== '' && isEditMode ? defaults.phone : null);
    const displayDescription = header.description || (header.description !== null && header.description !== '' && isEditMode ? defaults.description : null);
    
    return React.createElement(
      "div", 
      { className: "text-center" },
      // Profile image
      header.profile_image ? 
        React.createElement("div", { className: "bio-link-profile" },
          React.createElement("img", {  src: getDisplayUrl(header.profile_image), alt: displayName })
        ) : 
        React.createElement("div", { 
          className: "bio-link-profile flex items-center justify-center text-4xl font-bold",
          style: { backgroundColor: '#000000', color: textColor || '#FFFFFF' }
        }, displayName?.charAt(0) || '?'),
      
      // Name
      React.createElement("h1", { 
        className: "bio-link-title",
        style: { color: textColor }
      }, displayName || 'Your Name'),
      
      // Tagline
      displayTagline && React.createElement("p", { 
        className: "bio-link-description",
        style: { color: textColor }
      }, displayTagline),
      
      // Bio description
      displayDescription && React.createElement("div", { className: "bio-section" },
        React.createElement("div", { className: "bio-text" }, displayDescription)
      )
    );
  },
  
  renderLinks: (props: ThemeRenderProps) => {
    const { data, isPublic, buttonColor, textColor, buttonTextColor } = props;
    const { links } = data.config;
    
    const displayLinks = links && links.length > 0 ? links : defaults.links;
    
    if (!displayLinks || !displayLinks.length) {
      return React.createElement(
        "div", 
        { className: "text-center p-4 opacity-70 text-sm" },
        t("No links added yet")
      );
    }
    
    return React.createElement(
      "div", 
      { className: "links-container" },
      displayLinks.map((link, index) => 
        React.createElement("a", { 
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer",  
          className: "bio-link-button",
          style: { 
            backgroundColor: buttonColor,
            color: buttonTextColor,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            "--index": index
          } as React.CSSProperties
        },
          // Icon
          link.icon && React.createElement("img", {
            src: getDisplayUrl(link.icon),
            alt: link.text,
            style: { width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0, borderRadius: '6px' }
          }),
          // Text + description
          React.createElement("div", { style: { flex: 1, textAlign: link.icon ? 'left' : 'center' } },
            React.createElement("div", { style: { fontWeight: 600, fontSize: '1rem' } }, link.text || t('Untitled Link')),
            link.description && React.createElement("div", {
              style: { fontSize: '0.8rem', opacity: 0.8, marginTop: '0.2rem' }
            }, link.description)
          )
        )
      )
    );
  },
  
  renderSocial: (props: ThemeRenderProps) => {
    const { data, isPublic, textColor, buttonColor, buttonTextColor } = props;
    const { social } = data.config;
    
    const displaySocial = social?.items && social.items.length > 0 ? social.items : defaults.social;
    
    if (!social?.display || !displaySocial.length) return null;
    
    return React.createElement(
      "div", 
      { className: "social-container" },
      React.createElement(
        "div", 
        { className: "social-icons" },
        displaySocial.map((item, index) => 
          item.platform && 
            React.createElement("a", { 
              key: index, 
              href: item.url || "#", 
              target: "_blank", 
              rel: "noopener noreferrer", 
              className: "social-icon",
              style: { "--index": index } as React.CSSProperties
            },
              React.createElement(SocialIcon, { 
                platform: item.platform, 
                color: buttonTextColor 
              })
            )
        )
      )
    );
  },
  
  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, buttonTextColor, font } = props;
    const { background } = data.config;
    
    const hasBackgroundImage = background?.type === 'image' && background.image;
    
    const defaultImage = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop&auto=format';
    
    let backgroundStyle = {};
    if (background?.type === 'image') {
      const imageUrl = background.image ? getDisplayUrl(background.image) : defaultImage;
      backgroundStyle = { 
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else if (background?.type === 'gradient' && background.gradient) {
      backgroundStyle = { 
        background: background.gradient,
        backgroundImage: 'none'
      };
    } else if (background?.type === 'color' && background.color) {
      backgroundStyle = { 
        backgroundColor: background.color,
        backgroundImage: 'none'
      };
    } else {
      backgroundStyle = { 
        backgroundImage: `url(${defaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    // Add Google Fonts for Playfair Display and Lato
    try {
      const fontLink = document.createElement('link');
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;600&display=swap';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    } catch (e) {
      console.log('Could not add font link');
    }
    
    return React.createElement(
      "div", 
      { 
        className: `bio-link-container glamorous-theme${hasBackgroundImage ? ' has-bg-image' : ''}`,
        style: {
          '--theme-text-color': textColor,
          '--theme-button-color': buttonColor,
          '--theme-button-text-color': buttonTextColor,
          '--theme-font': font || "'Playfair Display', serif",
          color: textColor,
          fontFamily: font || "'Playfair Display', serif",
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div", 
        { style: { flex: 1, display: 'flex', flexDirection: 'column' } },
        React.createElement(
          "div", 
          { className: "bio-link-header" },
          GlamorousTheme.renderProfile && GlamorousTheme.renderProfile(props)
        ),
        GlamorousTheme.renderLinks && GlamorousTheme.renderLinks(props),
        GlamorousTheme.renderSocial && GlamorousTheme.renderSocial(props)
      ),
      data.config.copyright?.enabled !== false && React.createElement("div", { 
        className: "social-container",
        style: { marginTop: 'auto', borderTop: 'none', backgroundColor: 'rgba(0, 0, 0, 0.2)' }
      },
        React.createElement("div", { 
          className: "copyright-footer",
          style: { 
            color: textColor,
            fontFamily: "'Lato', sans-serif"
          }
        },
          data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.header?.name || 'YourName'}. All rights reserved.`
        )
      )
    );
  }
};

export default GlamorousTheme;