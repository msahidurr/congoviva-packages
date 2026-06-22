import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';
const defaults = {
  name: t('Isabella Fashion'),
  tagline: t('Style Curator & Fashion Blogger'),
  email: t('isabella@fashionforward.style'),
  description: t('Bringing you the latest trends and timeless style inspiration from the fashion capitals of the world.'),
  links: [
    { text: 'Style Guide', url: '#', description: t('Fashion tips & trends'), icon: '' },
    { text: 'Shop My Looks', url: '#', description: t('Get the look'), icon: '' },
    { text: 'Fashion Blog', url: '#', description: t('Latest articles'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'pinterest', url: '#', icon: '' },
    { platform: 'tiktok', url: '#', icon: '' }
  ]
};

const FashionTheme: ThemeType = {
  name: 'Fashion',
  layout: 'elegant',
  buttonStyle: 'minimal',
  socialPosition: 'bottom',
  profileStyle: 'editorial',
  profileFields: [
    {
      name: 'name',
      label: t('Full Name'),
      type: 'text',
      placeholder: t('Enter your full name'),
       defaultValue: defaults.name,
      required: true,
      section: t('Personal Information'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Professional Title'),
      type: 'text',
      placeholder: t('e.g. Fashion Designer, Style Consultant'),
       defaultValue: defaults.tagline,
      required: false,
      section: t('Personal Information'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Photo'),
      type: 'image',
      placeholder: t('Upload your professional photo'),
      required: false,
      section: t('Personal Information'),
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
      placeholder: t('Brief description of your style and expertise'),
       defaultValue: defaults.description,
      required: false,
      section: t('About'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Modern Fashion Theme - Elegant & Sophisticated */
    .bio-link-container {
      position: relative;
      font-family: 'Playfair Display', serif;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
    }

    /* Elegant overlay for better text readability */
    .bio-link-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 0;
    }

    /* Subtle pattern overlay */
    .bio-link-container::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%);
      background-size: 50px 50px;
      animation: patternMove 30s linear infinite;
      z-index: 0;
    }

    /* Main content container */
    .bio-link-layout {
      max-width: 450px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem;
      position: relative;
      z-index: 1;
    }

    /* Header section */
    .bio-link-header {
      text-align: center;
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.8s ease-out;
    }

    /* Profile image with editorial styling */
    .bio-link-profile {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto 2rem;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid var(--button-color, rgba(255, 255, 255, 0.2));
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      backdrop-filter: blur(10px);
    }

    .bio-link-profile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      filter: saturate(1.1) contrast(1.05);
    }



    /* Name with elegant typography */
    .bio-link-title {
      font-size: 2.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
      line-height: 1.2;
      position: relative;
    }

    /* Elegant underline */
    .bio-link-title::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -12px;
      width: 0;
      height: 1px;
      background: currentColor;
      opacity: 0.7;
      transition: all 0.8s ease;
      transform: translateX(-50%);
    }

    .bio-link-title:hover::after {
      width: 80px;
    }

    /* Professional tagline */
    .bio-link-tagline {
      font-size: 1.1rem;
      font-weight: 500;
      opacity: 0.95;
      margin-bottom: 1.5rem;
      letter-spacing: 0.02em;
      font-style: italic;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    }

    /* Contact info section */
    .bio-link-contact {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    .bio-link-contact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 10px;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .bio-link-contact-item:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateX(5px);
    }

    .bio-link-contact-item svg {
      width: 16px;
      height: 16px;
      opacity: 0.8;
    }

    /* Description */
    .bio-link-description {
      text-align: center;
      line-height: 1.7;
      font-size: 1rem;
      margin-bottom: 2.5rem;
      padding: 1.25rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 16px;
      border-left: 3px solid currentColor;
      font-style: italic;
    }

    /* Modern button styling */
    .bio-link-button {
      position: relative;
      display: flex;
      align-items: center;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1rem;
      border-radius: 16px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15), 0 4px 15px var(--button-color);
      overflow: hidden;
      text-decoration: none;
      animation: slideInUp 0.6s ease-out;
      animation-fill-mode: both;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .bio-link-button:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 0 8px 25px var(--button-color);
      border-color: rgba(255, 255, 255, 0.25);
    }

    /* Button shimmer effect */
    .bio-link-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
      transition: left 0.7s ease;
      z-index: 1;
    }

    .bio-link-button:hover::before {
      left: 100%;
    }



    /* Button icon */
    .bio-link-button img {
      width: 22px;
      height: 22px;
      margin-right: 1rem;
      border-radius: 6px;
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
      letter-spacing: -0.01em;
    }

    .bio-link-button-desc {
      font-size: 0.9rem;
      font-weight: 400;
      font-style: italic;
    }

    /* Social icons */
    .bio-link-social {
      margin-top: 2.5rem;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .bio-link-social-title {
      text-align: center;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      position: relative;
    }

    .bio-link-social-title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 1px;
      background: currentColor;
      opacity: 0.5;
    }

    .bio-link-social-icons {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.75rem;
      max-width: 300px;
      margin: 0 auto;
    }

    .bio-link-social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      border-radius: 15px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      animation: fadeInUp 0.6s ease-out;
      animation-fill-mode: both;
      position: relative;
      overflow: hidden;
    }

    .bio-link-social-icon::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s ease;
    }

    .bio-link-social-icon:hover::before {
      left: 100%;
    }

    .bio-link-social-icon:hover {
      transform: translateY(-3px);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 15px var(--button-color, rgba(0, 0, 0, 0.15));
      border-color: rgba(255, 255, 255, 0.3);
    }

    .bio-link-social-icon svg {
      width: 22px;
      height: 22px;
      transition: transform 0.3s ease;
      position: relative;
      z-index: 2;
    }

    .bio-link-social-icon:hover svg {
      transform: scale(1.1);
    }

    /* Copyright */
    .bio-link-copyright {
      text-align: center;
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 2.5rem;
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      font-weight: 500;
      letter-spacing: 0.02em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 12px;
    }

    /* Simple animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(15px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes patternMove {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(50px, 50px);
      }
    }

    /* Animation delays for staggered effect */
    .bio-link-button:nth-child(1) { animation-delay: 0.1s; }
    .bio-link-button:nth-child(2) { animation-delay: 0.2s; }
    .bio-link-button:nth-child(3) { animation-delay: 0.3s; }
    .bio-link-button:nth-child(4) { animation-delay: 0.4s; }
    .bio-link-button:nth-child(5) { animation-delay: 0.5s; }
    .bio-link-button:nth-child(6) { animation-delay: 0.6s; }

    /* Responsive design */
    @media (max-width: 640px) {
      .bio-link-layout {
        padding: 2rem 1rem;
      }

      .bio-link-profile {
        width: 120px;
        height: 120px;
      }

      .bio-link-title {
        font-size: 1.875rem;
      }

      .bio-link-button {
        padding: 1rem 1.25rem;
      }

      .bio-link-social {
        padding: 1.5rem 1rem 0.75rem;
      }

      .bio-link-social-icons {
        grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
        max-width: 250px;
      }

      .bio-link-social-icon {
        width: 45px;
        height: 45px;
        border-radius: 12px;
      }

      .bio-link-social-icon svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
  colorPresets: [
        {
      name: 'Champagne Gold',
      background: {
        type: 'image',
        color: '#E75480',
        gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop'
      },
      buttonColor: '#E75480',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
        {
      name: 'Blush Pink',
      background: {
        type: 'image',
        color: '#B17457',
        gradient: 'linear-gradient(135deg, #fef7f0 0%, #fed7d7 100%)',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=800&fit=crop'
      },
      buttonColor: '#B17457',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Elegant Rose',
      background: {
        type: 'image',
        color: '#0D5EA6',
        gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&h=800&fit=crop'
      },
      buttonColor: '#0D5EA6',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },


    {
      name: 'Sage Green',
      background: {
        type: 'image',
        color: '#E83030',
        gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=800&fit=crop'
      },
      buttonColor: '#E83030',
      buttonTextColor: '#ffffff',
      textColor: '#FFFFFF'
    },
    {
      name: 'Ocean Blue',
      background: {
        type: 'image',
        color: '#DC8BE0',
        gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop'
      },
      buttonColor: '#DC8BE0',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Playfair Display, serif',
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
      return text.replace(/[<>\"&]/g, (match) => {
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
          className: "bio-link-profile flex items-center justify-center text-3xl font-bold",
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

    if (!social?.display || !displaySocial.length) {
      // Show default social icons if none configured
      const defaultSocials = [
        { platform: 'instagram', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'facebook', url: '#' },
        { platform: 'linkedin', url: '#' }
      ];

      return React.createElement(
        "div",
        { className: "bio-link-social" },
        React.createElement("div", {
          className: "bio-link-social-title",
          style: { color: textColor }
        }, t("Connect")),
        React.createElement(
          "div",
          { className: "bio-link-social-icons" },
          defaultSocials.map((item, index) =>
            React.createElement("a", {
              key: index,
              href: item.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "bio-link-social-icon",
              style: {
                textDecoration: 'none',
                animationDelay: `${0.5 + index * 0.1}s`
              }
            },
              React.createElement(SocialIcon, {
                platform: item.platform,
                color: textColor
              })
            )
          )
        )
      );
    }

    return React.createElement(
      "div",
      { className: "bio-link-social" },
      React.createElement("div", {
        className: "bio-link-social-title",
        style: { color: textColor }
      }, t("Connect")),
      React.createElement(
        "div",
        { className: "bio-link-social-icons" },
        displaySocial.map((item, index) =>
          item.platform &&
            React.createElement("a", {
              key: index,
              href: item.url || '#',
              target: "_blank",
              rel: "noopener noreferrer",
              className: "bio-link-social-icon",
              style: {
                textDecoration: 'none',
                animationDelay: `${0.5 + index * 0.1}s`
              }
            },
              React.createElement(SocialIcon, {
                platform: item.platform,
                color: textColor
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
        t("No links added yet")
      );
    }

    // Sanitize user input to prevent XSS
    const sanitizeText = (text: string) => {
      if (!text) return '';
      return text.replace(/[<>\"&]/g, (match) => {
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
            background: buttonColor,
            color: buttonTextColor || '#000000',
            textDecoration: 'none',
            animationDelay: `${0.1 + index * 0.1}s`,
            '--button-color': buttonColor
          }
        },
          link.icon && React.createElement("img", {
            src: getDisplayUrl(link.icon),
            alt: "",
            className: "w-5 h-5 mr-4 rounded"
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

    // Default background image for fashion theme
    const defaultImage = 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&h=800&fit=crop';

    let backgroundStyle = {};
    if (background?.type === 'image') {
      const imageUrl = background.image || defaultImage;
      backgroundStyle = {
        backgroundImage: `url(${imageUrl})`,
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
      backgroundStyle = {
        backgroundImage: `url(${defaultImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }

    // Sanitize copyright text
    const sanitizeText = (text: string) => {
      if (!text) return '';
      return text.replace(/[<>\"&]/g, (match) => {
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
          FashionTheme.renderProfile && FashionTheme.renderProfile(props)
        ),
        FashionTheme.renderLinks && FashionTheme.renderLinks(props),
        FashionTheme.renderSocial && FashionTheme.renderSocial(props),
        copyright?.enabled !== false && React.createElement("div", {
          className: "bio-link-copyright",
          style: { color: textColor }
        }, safeCopyrightText)
      )
    );
  }
};

export default FashionTheme;
