import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { resolveDynamicImage, resolveImageForRendering } from '../../../utils/themeImageResolver';
import { t } from 'i18next';

// Default data for Personal theme when user data is empty
const defaults = {
  name: t('Alex Johnson'),
  tagline: t('Digital Creator & Innovation Enthusiast'),
  email: t('hello@alexjohnson.com'),
  phone: t('+1 (555) 234-5678'),
  description: t('Passionate about creating impactful digital experiences and building meaningful connections in the creative community.'),
  links: [
    { text: 'View Portfolio', url: '#', description: 'Explore my creative work', icon: '' },
    { text: 'Book Consultation', url: '#', description: 'Schedule a meeting', icon: '' },
    { text: 'Read Blog', url: '#', description: 'Latest insights & tips', icon: '' }
  ],
  social: [
    { platform: 'linkedin', url: '#', icon: '' },
    { platform: 'twitter', url: '#', icon: '' },
    { platform: 'instagram', url: '#', icon: '' }
  ]
};

const PersonalTheme: ThemeType = {
  name: 'Personal',
  layout: 'standard',
  buttonStyle: 'soft',
  socialPosition: 'floating',
  profileStyle: 'large',
  profileFields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      placeholder: t('Enter your name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Basic Information'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Tagline'),
      type: 'text',
      placeholder: t('Enter a short description'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Basic Information'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Picture'),
      type: 'image',
      placeholder: t('Select profile picture'),
      required: false,
      section: t('Basic Information'),
      cols: 2
    },
    {
      name: 'email',
      label: t('Email Address'),
      type: 'email',
      placeholder: t('Enter your email address'),
      defaultValue: defaults.email,
      required: false,
      section: t('Contact Information'),
      cols: 1
    },
    {
      name: 'phone',
      label: t('Phone Number'),
      type: 'tel',
      placeholder: t('Enter your phone number'),
      defaultValue: defaults.phone,
      required: false,
      section: t('Contact Information'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Description'),
      type: 'textarea',
      placeholder: t('Enter a detailed description about yourself'),
      defaultValue: defaults.description,
      required: false,
      section: t('About Me'),
      cols: 2,
      rows: 4
    }
  ],
  customCSS: `
    /* Modern Personal Theme - Elegant & Professional */
    .bio-link-container {
      position: relative;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
      letter-spacing: -0.01em;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    /* Animated gradient background */
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
    
    /* Subtle particle effect */
    .bio-link-container::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2%, transparent 0%);
      background-size: 50px 50px;
      opacity: 0.4;
      z-index: 0;
    }
    
    /* Enhanced header styling */
    .bio-link-header {
      position: relative;
      z-index: 1;
      padding: 3rem 1.5rem 2rem;
      text-align: center;
    }
    
    /* Main content container */
    .bio-link-layout {
      max-width: 480px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 1;
    }
    
    /* Modern profile image styling */
    .bio-link-profile {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto 0.25rem;
      box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.3);
      transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease;
      overflow: hidden;
    }
    
    .bio-link-profile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Profile image hover animation */
    .bio-link-profile:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
    }
    
    /* Profile image inner glow */
    .bio-link-profile::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, transparent 50%, rgba(0, 0, 0, 0.2));
      pointer-events: none;
    }
    
    /* Name title with elegant animation */
    .bio-link-title {
      position: relative;
      display: inline-block;
      margin-top: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      font-size: 1.75rem;
      line-height: 1.2;
    }
    
    /* Animated text highlight effect */
    .bio-link-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 0;
      height: 2px;
      background: var(--theme-accent, currentColor);
      opacity: 0.6;
      transition: width 0.6s ease;
    }
    
    .bio-link-title:hover::after {
      width: 100%;
    }
    
    /* Animated underline for name */
    .animate-expand {
      height: 2px;
      background: var(--theme-accent, rgba(255, 255, 255, 0.5));
      margin: 0.5rem auto 0.75rem;
      animation: expand 1.5s ease-out forwards;
      max-width: 80px;
    }
    
    /* Enhanced description styling */
    .bio-link-description {
      font-weight: 400;
      letter-spacing: 0;
      max-width: 85%;
      margin: 0.75rem auto 0;
      line-height: 1.6;
      font-size: 1rem;
    }
    
    /* Contact information styling */
    .bio-link-contact {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: center;
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 1rem;
      background-color: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      max-width: 85%;
      margin-left: auto;
      margin-right: auto;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .bio-link-contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background-color: rgba(255, 255, 255, 0.1);
      width: 100%;
      transition: all 0.3s ease;
    }
    
    .bio-link-contact-item:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .bio-link-contact a {
      transition: all 0.2s ease;
      color: inherit;
      text-decoration: none;
    }
    
    .bio-link-contact a:hover {
      opacity: 0.9;
    }
    
    .bio-link-description-text {
      text-align: center;
      line-height: 1.6;
      padding: 0.5rem;
      font-style: italic;
      opacity: 0.9;
      font-weight: 400;
    }
    
    /* Animations */
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes expand {
      0% { width: 0; }
      100% { width: 80px; }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    /* Modern button styling */
    .bio-link-button {
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
      z-index: 1;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      margin-bottom: 1rem;
      border-radius: 12px;
      padding: 1rem 1.5rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      background-color: var(--button-color) !important;
      color: var(--button-text-color, #FFFFFF) !important;
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
      transition: left 0.7s ease;
      z-index: -1;
    }
    
    /* Button hover effects */
    .bio-link-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
      border-color: rgba(255, 255, 255, 0.25);
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    .bio-link-button:hover::before {
      left: 100%;
    }
    
    /* Link icon styling */
    .bio-link-button img {
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .bio-link-button:hover img {
      transform: scale(1.15) rotate(5deg);
    }
    
    /* Arrow icon animation */
    .bio-link-button svg {
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .bio-link-button:hover svg {
      transform: translateX(4px);
    }
    
    /* Social icons with hover effects */
    .bio-link-social {
      margin-top: 2rem;
      margin-bottom: 1.5rem;
      position: relative;
      z-index: 2;
    }
    
    .bio-link-social a {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(5px);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .bio-link-social a:hover {
      transform: translateY(-5px) scale(1.1);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      background-color: rgba(255, 255, 255, 0.25);
    }
    
    /* Floating elements animation */
    @keyframes float-diagonal {
      0% { transform: translate(0, 0); }
      50% { transform: translate(15px, -15px); }
      100% { transform: translate(0, 0); }
    }
    
    @keyframes float-circular {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(8px, 8px) rotate(5deg); }
      50% { transform: translate(0, 15px) rotate(0deg); }
      75% { transform: translate(-8px, 8px) rotate(-5deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    
    .float-diagonal {
      animation: float-diagonal 8s ease-in-out infinite;
    }
    
    .float-circular {
      animation: float-circular 12s ease-in-out infinite;
    }
    
    /* Copyright section */
    .bio-link-copyright {
      text-align: center;
      font-size: 0.8rem;
      padding: 1rem 0;
      margin-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      transition: opacity 0.3s ease;
      letter-spacing: 0.02em;
      font-weight: 500;
      position: relative;
      bottom: 0;
    }
    
 
  `,
  colorPresets: [
   
    {
      name: 'Ocean Breeze',
      background: {
        type: 'image',
        color: '#1F6CAB',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        image: 'dynamic:personal:0'
      },
      buttonColor: '#1F6CAB',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
     {
      name: 'Cosmic Purple',
      background: {
        type: 'image',
        color: '#9E841C',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        image: 'dynamic:personal:1'
      },
      buttonColor: '#9E841C',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Emerald Dream',
      background: {
        type: 'image',
        color: '#E67E22',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        image: 'dynamic:personal:2'
      },
      buttonColor: '#E67E22',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Sunset Bliss',
      background: {
        type: 'image',
        color: '#6C5CE7',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        image: 'dynamic:personal:3'
      },
      buttonColor: '#6C5CE7',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Golden Horizon',
      background: {
        type: 'image',
        color: '#27AE60',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        image: 'dynamic:personal:4'
      },
      buttonColor: '#27AE60',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Inter, sans-serif',
  defaultPreset: 0,
  
  // Theme-specific render functions
  renderDecorativeElements: (props: ThemeRenderProps) => {
    return React.createElement(
      React.Fragment,
      null,
      /* Decorative floating elements */
      React.createElement("div", { className: "absolute bottom-[20%] right-[10%] w-20 h-20 rounded-full bg-white/5 float-circular" }),
      React.createElement("div", { className: "absolute top-[30%] right-[20%] w-12 h-12 rounded-full bg-white/10 float-diagonal" }),
      React.createElement("div", { className: "absolute bottom-[40%] left-[25%] w-10 h-10 rounded-full bg-white/5 float-circular" })
    );
  },
  
  renderProfile: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, layoutStyle, isPublic, textColor, buttonColor, t = (key: string) => key } = props;
    const { header } = data.config;
    
    // Use defaults when header data is empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displayName = header.name || (header.name !== null && header.name !== '' && isEditMode ? defaults.name : null);
    const displayTagline = header.tagline || (header.tagline !== null && header.tagline !== '' && isEditMode ? defaults.tagline : null);
    const displayEmail = header.email || (header.email !== null && header.email !== '' && isEditMode ? defaults.email : null);
    const displayPhone = header.phone || (header.phone !== null && header.phone !== '' && isEditMode ? defaults.phone : null);
    const displayDescription = header.description || (header.description !== null && header.description !== '' && isEditMode ? defaults.description : null);
    

    
    return React.createElement(
      React.Fragment,
      null,
      /* Enhanced profile image with glow effect and shadow */
      header.profile_image ? 
        React.createElement("div", { 
          className: `${layoutStyle.profileSize} overflow-hidden mb-5 bio-link-profile rounded-2xl w-36 h-36`,
          style: { 
            borderColor: buttonColor,
            boxShadow: `0 0 30px ${buttonColor}40, 0 15px 35px rgba(0, 0, 0, 0.3)`
          }
        },
          React.createElement("img", { 
            src: getDisplayUrl(header.profile_image), 
            alt: header.name, 
            className: "w-full h-full object-cover" 
          })
        ) : displayName ? 
        React.createElement("div", { 
          className: `${layoutStyle.profileSize} mb-5 flex items-center justify-center text-3xl font-bold bio-link-profile rounded-2xl w-36 h-36`,
          style: { 
            background: `linear-gradient(135deg, ${buttonColor}, rgba(255,255,255,0.5))`,
            boxShadow: `0 0 30px ${buttonColor}40, 0 15px 35px rgba(0, 0, 0, 0.3)`,
            color: textColor
          }
        }, displayName.charAt(0)) : null,
      
      /* Enhanced name display with better typography and animation */
      displayName && React.createElement("div", { className: "relative" },
        React.createElement("h1", { 
          className: "text-2xl font-bold mb-2 bio-link-title",
          "data-text": displayName,
          style: {
            letterSpacing: '-0.02em'
          }
        }, displayName),
        
        /* Subtle underline animation */
       
      ),
      
      /* Enhanced tagline with better styling */
      displayTagline && React.createElement("p", { 
        className: "text-base bio-link-description mt-2",
        style: {
          fontWeight: '400',
          letterSpacing: '0',
          maxWidth: '85%',
          margin: '0 auto'  
        }
      }, displayTagline),
      
      /* Contact information section */
      (displayEmail || displayPhone || displayDescription) && 
        React.createElement("div", { 
          className: "bio-link-contact"
        },
          React.createElement("div", {
            className: "text-sm font-medium mb-1"
          }, t("Contact Information")),
          React.createElement("div", {
            className: "w-full flex flex-col gap-2"
          },
            displayEmail && 
              React.createElement("div", { 
                className: "bio-link-contact-item"
              },
                React.createElement("svg", { 
                  xmlns: "http://www.w3.org/2000/svg", 
                  width: "16", 
                  height: "16", 
                  viewBox: "0 0 24 24", 
                  fill: "none", 
                  stroke: "currentColor", 
                  strokeWidth: "2", 
                  strokeLinecap: "round", 
                  strokeLinejoin: "round",
                  className: "flex-shrink-0"
                },
                  React.createElement("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
                  React.createElement("path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
                ),
                React.createElement("a", { 
                  href: `mailto:${displayEmail}`,
                  className: "text-sm font-medium truncate"
                }, displayEmail)
              ),
              
            displayPhone && 
              React.createElement("div", { 
                className: "bio-link-contact-item"
              },
                React.createElement("svg", { 
                  xmlns: "http://www.w3.org/2000/svg", 
                  width: "16", 
                  height: "16", 
                  viewBox: "0 0 24 24", 
                  fill: "none", 
                  stroke: "currentColor", 
                  strokeWidth: "2", 
                  strokeLinecap: "round", 
                  strokeLinejoin: "round",
                  className: "flex-shrink-0"
                },
                  React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
                ),
                React.createElement("a", { 
                  href: `tel:${displayPhone}`,
                  className: "text-sm font-medium truncate"
                }, displayPhone)
              )
          ),
            
          displayDescription && 
            React.createElement("div", { 
              className: "bio-link-description-text text-sm w-full",
              style: {
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '0.75rem',
                marginTop: '0.25rem'
              }
            }, displayDescription)
        )
    );
  },
  
  renderSocial: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, isPublic, textColor, buttonColor, t = (key: string) => key } = props;
    const { social } = data.config;
    
    // Use defaults when social items are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displaySocial = social?.items && social.items.length > 0 ? social.items : (social?.display && isEditMode ? defaults.social : []);
    
    if (!social?.display || !displaySocial.length) return null;
    
    return React.createElement(
      "div", 
      { 
        className: "flex justify-center mt-6 bio-link-social flex-wrap gap-3",
        style: {
          padding: '0.5rem 0',
          marginBottom: '1rem'  
        }
      },
      React.createElement("div", { className: "w-full text-sm mb-3 font-medium text-center" }, t("Connect With Me")),
      
      displaySocial.map((item, index) => 
        item.platform && 
          React.createElement("a", { 
            key: index, 
            href: item.url || "#",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "flex items-center justify-center",
            style: { 
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
              animation: isPublic ? `fadeInUp 0.5s ease forwards ${0.2 + index * 0.1}s` : 'none',
              opacity: 1
            }
          },
            React.createElement(SocialIcon, { 
              platform: item.platform, 
              color: textColor 
            })
          )
      )
    );
  },
  
  renderLinks: (props: ThemeRenderProps) => {
    const { data, layoutStyle, isPublic, buttonColor, buttonTextColor, textColor, buttonStyle } = props;
    const { links } = data.config;
    const actualButtonColor = data.config.buttonColor || buttonColor;
    const actualButtonTextColor = data.config.buttonTextColor || buttonTextColor;
    
    // Use defaults when links are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displayLinks = links && links.length > 0 ? links : (isEditMode ? defaults.links : []);
    
    // Helper function to convert hex to rgba
    const hexToRgba = (hex: string, alpha: number = 1) => {
      if (!hex || !hex.startsWith('#')) return hex;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    
    if (!displayLinks || !displayLinks.length) {
      return React.createElement(
        "div", 
        { className: "bg-white/20 rounded-lg p-4 flex items-center justify-center shadow-sm text-white/70 text-sm" },
        t("No links added yet")
      );
    }
    
    const content = React.createElement(
      "div", 
      { className: "space-y-4" },
      displayLinks.map((link, index) => 
        React.createElement("a", { 
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex items-center bio-link-button no-underline",
          style: { 
            backgroundColor: actualButtonColor,
            color: actualButtonTextColor,
            boxShadow: `0 6px 15px rgba(0, 0, 0, 0.1), 0 0 20px ${actualButtonColor}`,
            ...buttonStyle,
            transform: isPublic ? `translateY(${index * 5}px)` : 'none',
            animationDelay: isPublic ? `${index * 0.1}s` : '0s',
            opacity: 1,
            animation: isPublic ? 'fadeInUp 0.6s ease forwards' : 'none',
            textDecoration: 'none'
          }
        },
          link.icon && 
            React.createElement("div", { 
              className: "w-8 h-8 mr-4 flex-shrink-0 ml-2 rounded-lg overflow-hidden",
              style: {
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.1)',
                padding: '2px'
              }
            },
              React.createElement("img", { 
                src: getDisplayUrl(link.icon),
                alt: "", 
                className: "w-full h-full object-contain" 
              })
            ),
          React.createElement("div", { className: "flex-1" },
            React.createElement("div", { 
              className: "font-medium text-base",
              style: {
                letterSpacing: '-0.01em',
                fontWeight: '600',
                color: buttonTextColor,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }
            }, link.text || 'Untitled Link'),
            link.description && 
              React.createElement("div", { 
                className: "text-sm mt-1",
                style: {
                  opacity: '0.95',
                  fontWeight: '500',
                  color: buttonTextColor,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }
              }, link.description)
          ),
          React.createElement("div", { className: "w-6 h-6 ml-3 mr-1 flex-shrink-0 flex items-center justify-center rounded-full bg-white" },
            React.createElement("svg", { 
              xmlns: "http://www.w3.org/2000/svg", 
              width: "14", 
              height: "14", 
              viewBox: "0 0 24 24", 
              fill: "none", 
              stroke: "#060606", 
              strokeWidth: "2", 
              strokeLinecap: "round", 
              strokeLinejoin: "round" 
            },
              React.createElement("path", { d: "M5 12h14" }),
              React.createElement("path", { d: "M12 5l7 7-7 7" })
            )
          )
        )
      )
    );
    
    return content;
  },
  
  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;
    const themeImages = (window as any).__themeImages || {};
    
    let backgroundStyle = {};
    if (background?.type === 'color' && background.color) {
      backgroundStyle = { 
        backgroundColor: background.color,
        backgroundImage: 'none'
      };
    } else if (background?.type === 'gradient' && background.gradient) {
      backgroundStyle = { 
        background: background.gradient,
        backgroundImage: 'none'
      };
    } else if (background?.type === 'image') {
      const imageUrl = background.image || 'dynamic:personal:0';
      const resolvedImage = resolveImageForRendering(imageUrl, themeImages);
      backgroundStyle = { 
        backgroundImage: `url(${resolvedImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else {
      const defaultImage = resolveDynamicImage('dynamic:personal:0', themeImages);
      if (defaultImage) {
        backgroundStyle = { 
          backgroundImage: `url(${defaultImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
    }
    
    return React.createElement(
      "div", 
      { 
        className: "bio-link-container",
        style: {
          color: textColor,
          fontFamily: font,
          '--button-color': buttonColor,
          '--text-color': textColor,
          '--theme-accent': buttonColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      PersonalTheme.renderDecorativeElements && PersonalTheme.renderDecorativeElements(props),
      React.createElement(
        "div", 
        { className: "bio-link-layout" },
        React.createElement(
          "div", 
          { className: "bio-link-header" },
          PersonalTheme.renderProfile && PersonalTheme.renderProfile(props)
        ),
        PersonalTheme.renderLinks && PersonalTheme.renderLinks(props),
        PersonalTheme.renderSocial && PersonalTheme.renderSocial(props),
        data.config.copyright?.enabled !== false && 
        React.createElement("div", { 
          className: "bio-link-copyright",
          style: {
            color: textColor,
            borderTop: `1px solid ${textColor ? textColor.replace(')', ', 0.1)') : 'rgba(255, 255, 255, 0.1)'}`
          }
        },
          data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.header.name || defaults.name}. All rights reserved.`
        )
      )
    );
  }

};

export default PersonalTheme;