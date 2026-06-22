import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';
import { resolveDynamicImage, resolveImageForRendering } from '../../../utils/themeImageResolver';
const defaults = {
  name: t('Alex Chen'),
  tagline: t('Full Stack Developer'),
  email: t('alex@techstack.dev'),
  description: t('Building the future with code. Passionate about creating scalable solutions and innovative tech products.'),
  links: [
    { text: 'GitHub', url: '#', description: t('View my code'), icon: '' },
    { text: 'Projects', url: '#', description: t('See what I built'), icon: '' },
    { text: 'Tech Blog', url: '#', description: t('Latest insights'), icon: '' }
  ],
  social: [
    { platform: 'github', url: '#', icon: '' },
    { platform: 'linkedin', url: '#', icon: '' },
    { platform: 'twitter', url: '#', icon: '' }
  ]
};

const TechTheme: ThemeType = {
  name: 'Tech',
  layout: 'modern',
  buttonStyle: 'tech',
  socialPosition: 'bottom',
  profileStyle: 'modern',
  profileFields: [
    {
      name: 'name',
      label: t('Full Name'),
      type: 'text',
      placeholder: t('Enter your full name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Profile Information'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Professional Title'),
      type: 'text',
      placeholder: t('e.g. Full Stack Developer, UI/UX Designer'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Profile Information'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Photo'),
      type: 'image',
      placeholder: t('Upload your professional photo'),
      required: false,
      section: t('Profile Information'),
      cols: 2
    },
    {
      name: 'email',
      label: t('Email Address'),
      type: 'email',
      placeholder: t('your.email@example.com'),
      defaultValue: defaults.email,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'location',
      label: t('Location'),
      type: 'text',
      placeholder: t('City, Country'),
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Professional Bio'),
      type: 'textarea',
      placeholder: t('Brief description of your expertise and experience'),
      defaultValue: defaults.description,
      required: false,
      section: t('About'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Modern Tech Theme - Professional & Clean */
    .bio-link-container {
      position: relative;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
    }
    
    /* Subtle overlay for better text readability */
    .bio-link-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 0;
    }
    
    /* Animated grid pattern */

    
    /* Main content container */
    .bio-link-layout {
      max-width: 420px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      position: relative;
      z-index: 1;
    }
    
    /* Header section */
    .bio-link-header {
      text-align: center;
      margin-bottom: 2rem;
      animation: fadeInUp 0.8s ease-out;
    }
    
    /* Profile image with modern styling */
    .bio-link-profile {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 1.5rem;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 
        0 10px 30px var(--button-color)70,
        0 4px 12px var(--button-color)50,
        0 0 0 3px var(--button-color)30;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
    }
    
    .bio-link-profile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    
    .bio-link-profile:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 
        0 15px 40px var(--button-color)80,
        0 8px 20px var(--button-color)60,
        0 0 0 3px var(--button-color);
    }
    
    .bio-link-profile:hover img {
      transform: scale(1.05);
    }
    
    /* Name with elegant typography */
    .bio-link-title {
      font-size: 1.875rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;
      line-height: 1.2;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      position: relative;
      color: var(--text-color, #FFFFFF) !important;
    }
    
    /* Animated underline */
    .bio-link-title::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -8px;
      width: 0;
      height: 2px;
      background: currentColor;
      opacity: 0.6;
      transition: all 0.6s ease;
      transform: translateX(-50%);
    }
    
    .bio-link-title:hover::after {
      width: 60px;
    }
    
    /* Professional tagline */
    .bio-link-tagline {
      font-size: 1rem;
      font-weight: 500;
      opacity: 1;
      margin-bottom: 1rem;
      letter-spacing: 0.01em;
      color: var(--text-color, #F3F4F6) !important;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    }
    
    /* Contact info section */
    .bio-link-contact {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding: 1.25rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .bio-link-contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    
    .bio-link-contact-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(4px);
    }
    
    .bio-link-contact-item svg {
      width: 16px;
      height: 16px;
      opacity: 0.8;
    }
    
    /* Description */
    .bio-link-description {
      text-align: center;
      line-height: 1.6;
      font-size: 0.95rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      border-left: 3px solid currentColor;
    }
    
    /* Modern button styling */
    .bio-link-button {
      position: relative;
      display: flex;
      align-items: center;
      padding: 1rem 1.25rem;
      margin-bottom: 0.75rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 20px var(--button-color)80, 0 4px 12px var(--button-color)60, 0 2px 4px var(--button-color)40;
      overflow: hidden;
      text-decoration: none;
      animation: slideInUp 0.6s ease-out;
      animation-fill-mode: both;
      background-color: var(--button-color) !important;
      color: var(--button-text-color, #000000) !important;
    }
    
    /* Button shine effect */
    .bio-link-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.6s ease;
      z-index: 1;
    }
    
    .bio-link-button:hover::before {
      left: 100%;
    }
    
    .bio-link-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 30px var(--button-color)90, 0 8px 20px var(--button-color)70, 0 4px 12px var(--button-color)50;
      border-color: rgba(255, 255, 255, 0.25);
    }
    
    /* Button icon */
    .bio-link-button img {
      width: 20px;
      height: 20px;
      margin-right: 0.75rem;
      border-radius: 4px;
      transition: transform 0.3s ease;
    }
    
    .bio-link-button:hover img {
      transform: scale(1.1);
    }
    
    /* Button text */
    .bio-link-button-text {
      flex: 1;
      position: relative;
      z-index: 2;
    }
    
    .bio-link-button-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .bio-link-button-desc {
      font-size: 0.85rem;
      font-weight: 400;
    }
    
    /* Social section */
    .bio-link-social {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .bio-link-social-title {
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 1rem;
      opacity: 1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-color, #FFFFFF) !important;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    }
    
    .bio-link-social-icons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .bio-link-social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--button-color) !important;
      backdrop-filter: blur(10px);
      border: 1px solid var(--button-color);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 15px var(--button-color)60, 0 2px 4px var(--button-color)40;
      animation: fadeInUp 0.6s ease-out;
      animation-fill-mode: both;
    }
    
    .bio-link-social-icon:hover {
      transform: translateY(-4px) scale(1.05);
      background: var(--button-color) !important;
      box-shadow: 0 8px 25px var(--button-color)80, 0 4px 12px var(--button-color)60;
    }
    
    .bio-link-social-icon svg,
    .bio-link-social-icon img {
      width: 60%;
      height: 60%;
      object-fit: contain;
    }
    
    .bio-link-social-icon:hover svg {
      transform: scale(1.1);
    }
    
    /* Copyright */
    .bio-link-copyright {
      text-align: center;
      font-size: 0.8rem;
      opacity: 1;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
      color: var(--text-color, #E5E7EB) !important;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    }
    
    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes gridMove {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(30px, 30px);
      }
    }
    
    /* Animation delays for staggered effect */
    .bio-link-button:nth-child(1) { animation-delay: 0.1s; }
    .bio-link-button:nth-child(2) { animation-delay: 0.2s; }
    .bio-link-button:nth-child(3) { animation-delay: 0.3s; }
    .bio-link-button:nth-child(4) { animation-delay: 0.4s; }
    .bio-link-button:nth-child(5) { animation-delay: 0.5s; }
    .bio-link-button:nth-child(6) { animation-delay: 0.6s; }
    
    .bio-link-social-icon:nth-child(1) { animation-delay: 0.7s; }
    .bio-link-social-icon:nth-child(2) { animation-delay: 0.8s; }
    .bio-link-social-icon:nth-child(3) { animation-delay: 0.9s; }
    .bio-link-social-icon:nth-child(4) { animation-delay: 1.0s; }
    .bio-link-social-icon:nth-child(5) { animation-delay: 1.1s; }
    
    /* Responsive design */
    @media (max-width: 640px) {
      .bio-link-layout {
        padding: 1.5rem 1rem;
      }
      
      .bio-link-profile {
        width: 100px;
        height: 100px;
      }
      
      .bio-link-title {
        font-size: 1.5rem;
      }
      
      .bio-link-button {
        padding: 0.875rem 1rem;
      }
    }
  `,
  colorPresets: [
        {
      name: 'Orange Glow',
      background: {
        type: 'image',
        color: '#F97316',
        gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
        image: 'dynamic:tech:0'
      },
      buttonColor: '#F97316',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
        {
      name: 'Neon Pink',
      background: {
        type: 'image',
        color: '#06B6D4',
        gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        image: 'dynamic:tech:1'
      },
      buttonColor: '#06B6D4',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },

    {
      name: 'Tech Blue',
      background: {
        type: 'image',
        color: '#5F51DA',
        gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        image: 'dynamic:tech:2'
      },
      buttonColor: '#5F51DA',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Cyber Green',
      background: {
        type: 'image',
        color: '#7B2869',
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        image: 'dynamic:tech:3'
      },
      buttonColor: '#7B2869',
      buttonTextColor: '#ffffff',
      textColor: '#FFFFFF'
    },
    {
      name: 'Purple Code',
      background: {
        type: 'image',
        color: '#AF9410',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        image: 'dynamic:tech:4'
      },
      buttonColor: '#AF9410',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }

  ],
  font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  defaultPreset: 0,
  
  // Theme-specific render functions
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
    
    // Sanitize user input to prevent XSS
    const sanitizeText = (text: string) => {
      if (!text) return '';
      return text.replace(/[<>"&]/g, (match) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '&': '&amp;'
        };
        return entities[match] || match;
      });
    };
    
    const safeName = sanitizeText(displayName || '');
    const safeTagline = sanitizeText(displayTagline || '');
    const safeEmail = sanitizeText(displayEmail || '');
    const safeLocation = sanitizeText(header.location || '');
    const safeDescription = sanitizeText(displayDescription || '');
    
    return React.createElement(
      React.Fragment, 
      null,
      /* Profile image */
      header.profile_image ? 
        React.createElement("div", { className: "bio-link-profile" },
          React.createElement("img", { 
            src: getDisplayUrl(header.profile_image), 
            alt: safeName,
            className: "w-full h-full object-cover" 
          })
        ) : 
        React.createElement("div", { 
          className: "bio-link-profile flex items-center justify-center text-2xl font-bold",
          style: { 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            color: textColor
          }
        }, safeName.charAt(0).toUpperCase()),
      
      /* Name */
      React.createElement("h1", { 
        className: "bio-link-title",
        style: { color: textColor }
      }, safeName),
      
      /* Tagline */
      safeTagline && React.createElement("p", { 
        className: "bio-link-tagline",
        style: { color: textColor }
      }, safeTagline),
      
      /* Contact information */
      (safeEmail || safeLocation) && React.createElement("div", { className: "bio-link-contact" },
        safeEmail && React.createElement("div", { className: "bio-link-contact-item" },
          React.createElement("svg", { 
            xmlns: "http://www.w3.org/2000/svg", 
            width: "16", 
            height: "16", 
            viewBox: "0 0 24 24", 
            fill: "none", 
            stroke: "currentColor", 
            strokeWidth: "2", 
            strokeLinecap: "round", 
            strokeLinejoin: "round"
          },
            React.createElement("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
            React.createElement("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
          ),
          React.createElement("span", null, safeEmail)
        ),
        
        safeLocation && React.createElement("div", { className: "bio-link-contact-item" },
          React.createElement("svg", { 
            xmlns: "http://www.w3.org/2000/svg", 
            width: "16", 
            height: "16", 
            viewBox: "0 0 24 24", 
            fill: "none", 
            stroke: "currentColor", 
            strokeWidth: "2", 
            strokeLinecap: "round", 
            strokeLinejoin: "round"
          },
            React.createElement("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }),
            React.createElement("circle", { cx: "12", cy: "10", r: "3" })
          ),
          React.createElement("span", null, safeLocation)
        )
      ),
      
      /* Description */
      safeDescription && React.createElement("div", { 
        className: "bio-link-description",
        style: { color: textColor }
      }, safeDescription)
    );
  },
  
  renderSocial: (props: ThemeRenderProps) => {
    const { data, isPublic, textColor, buttonColor, buttonTextColor } = props;
    const { social } = data.config;
    
    const displaySocial = social?.items && social.items.length > 0 ? social.items : defaults.social;
    
    if (!social?.display || !displaySocial.length) return null;
    
    return React.createElement(
      "div", 
      { className: "bio-link-social" },
      React.createElement("div", { 
        className: "bio-link-social-title",
        style: { color: textColor }
      }, t("Connect")),
      React.createElement("div", { className: "bio-link-social-icons" },
        displaySocial.map((item, index) => 
          item.platform && 
            React.createElement("a", { 
              key: index, 
              href: item.url || "#", 
              target: "_blank", 
              rel: "noopener noreferrer", 
              className: "bio-link-social-icon",
              style: { 
                textDecoration: 'none',
                animationDelay: `${0.7 + index * 0.1}s`
              }
            },
              React.createElement(SocialIcon, { 
                platform: item.platform, 
                color: props.buttonTextColor || '#FFFFFF'
              })
            )
        )
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
        { 
          className: "text-center p-4 opacity-70 text-sm",
          style: { color: buttonTextColor }
        },
        "No links added yet"
      );
    }
    
    // Sanitize user input to prevent XSS
    const sanitizeText = (text: string) => {
      if (!text) return '';
      return text.replace(/[<>"&]/g, (match) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '&': '&amp;'
        };
        return entities[match] || match;
      });
    };
    
    return React.createElement(
      React.Fragment,
      null,
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
            textDecoration: 'none',
            animationDelay: `${0.1 + index * 0.1}s`,
            '--button-color': buttonColor,
            '--button-text-color': buttonTextColor
          }
        },
          link.icon && React.createElement("img", { 
            src: getDisplayUrl(link.icon), 
            alt: "",
            className: "w-5 h-5 mr-3 rounded" 
          }),
          React.createElement("div", { className: "bio-link-button-text" },
            React.createElement("div", { className: "bio-link-button-title" }, 
              sanitizeText(link.text || 'Untitled Link')
            ),
            link.description && 
              React.createElement("div", { className: "bio-link-button-desc" }, 
                sanitizeText(link.description)
              )
          )
        )
      )
    );
  },
  
  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, buttonTextColor, font } = props;
    const { background } = data.config;
    const copyright = data.config.copyright;
    
    const themeImages = (window as any).__themeImages || {};
    
    let backgroundStyle = {};
    if (background?.type === 'image') {
      const imageUrl = background.image || 'dynamic:tech:0';
      const resolvedImage = resolveImageForRendering(imageUrl, themeImages);
      backgroundStyle = { 
        backgroundImage: `url(${resolvedImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else if (background?.type === 'gradient' && background.gradient) {
      backgroundStyle = { 
        background: background.gradient
      };
    } else if (background?.type === 'color' && background.color) {
      backgroundStyle = { 
        backgroundColor: background.color
      };
    } else {
      // Use default image if no background is set
      const defaultImage = resolveDynamicImage('dynamic:tech:0', themeImages);
      if (defaultImage) {
        backgroundStyle = { 
          backgroundImage: `url(${defaultImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
    }
    
    // Sanitize copyright text
    const sanitizeText = (text: string) => {
      if (!text) return '';
      return text.replace(/[<>"&]/g, (match) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '&': '&amp;'
        };
        return entities[match] || match;
      });
    };
    
    const safeName = sanitizeText(data.config.displayName || '');
    const safeCopyrightText = sanitizeText(copyright?.text || `© ${new Date().getFullYear()} ${safeName}. All rights reserved.`);
    
    return React.createElement(
      "div", 
      { 
        className: "bio-link-container",
        style: {
          color: textColor,
          fontFamily: font,
          '--button-color': buttonColor,
          '--button-text-color': buttonTextColor,
          '--text-color': textColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div", 
        { className: "bio-link-layout" },
        React.createElement(
          "div", 
          { className: "bio-link-header" },
          TechTheme.renderProfile && TechTheme.renderProfile(props)
        ),
        TechTheme.renderLinks && TechTheme.renderLinks(props),
        TechTheme.renderSocial && TechTheme.renderSocial(props),
        copyright?.enabled !== false && React.createElement("div", { 
          className: "bio-link-copyright",
          style: { color: textColor }
        }, safeCopyrightText)
      )
    );
  }
};

export default TechTheme;