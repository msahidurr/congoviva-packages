import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';
const defaults = {
  name: t('Adventure Alex'),
  tagline: t('Travel Blogger & Explorer'),
  description: t('Exploring the world one destination at a time. Travel guides, tips, and inspiring adventures await!'),
  links: [
    { text: 'Travel Guides', url: '#', description: t('Destination guides'), icon: '' },
    { text: 'Photo Gallery', url: '#', description: t('Travel photography'), icon: '' },
    { text: 'Travel Tips', url: '#', description: t('Expert advice'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'youtube', url: '#', icon: '' },
    { platform: 'facebook', url: '#', icon: '' }
  ]
};

const TravelTheme: ThemeType = {
  name: 'Travel',
  layout: 'magazine',
  buttonStyle: 'soft',
  socialPosition: 'sidebar',
  profileStyle: 'polaroid',
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
      placeholder: t('Enter your travel tagline (e.g. Travel Blogger, Adventurer)'),
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
      name: 'location',
      label: t('Current Location'),
      type: 'text',
      placeholder: t('Enter your current location'),
      required: false,
      section: t('Travel Details'),
      cols: 1
    },
    {
      name: 'countries',
      label: t('Countries Visited'),
      type: 'text',
      placeholder: t('Enter number of countries visited'),
      required: false,
      section: t('Travel Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Bio'),
      type: 'textarea',
      placeholder: t('Tell people about your travel experiences'),
      defaultValue: defaults.description,
      required: false,
      section: t('Travel Details'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    .travel-theme {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      position: relative;
      background-image: url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop');
      background-size: cover;
      background-position: center;
    }
    
    .travel-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      z-index: 0;
    }
    
    .travel-theme .bio-link-layout {
      max-width: 480px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      position: relative;
      z-index: 1;
    }
    
    .travel-theme .bio-link-profile-container {
      width: 120px;
      height: 120px;
      margin: 0 auto 1rem;
      border-radius: 50%;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    
    .travel-theme .bio-link-profile {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .travel-theme .bio-link-title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      color: currentColor;
    }
    
    .travel-theme .bio-link-tagline {
      font-size: 1rem;
      text-align: center;
      margin-bottom: 2rem;
      opacity: 0.95;
      color: currentColor;
      font-weight: 500;
    }
    
    .travel-theme .travel-stats {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }
    
    .travel-theme .stat-item {
      background: rgba(255,255,255,0.15);
      padding:  1rem;
      border-radius: 12px;
      text-align: center;
      min-width: 120px;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      width:100%;
    }
    
    .travel-theme .stat-item:hover {
      transform: translateY(-5px);
      background: rgba(255,255,255,0.25);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
    
    .travel-theme .stat-label {
      font-size: 0.8rem;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }
    
    .travel-theme .stat-value {
      font-size: 1.125rem;
      font-weight: 700;
      line-height: 1.2;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    
    .travel-theme .bio-link-description {
      background: rgba(255,255,255,0.1);
      padding: 2rem;
      border-radius: 24px;
      margin: 2rem 0;
      backdrop-filter: blur(20px);
      line-height: 1.7;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    
    
    .travel-theme .bio-link-description:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.15);
    }
    
    .travel-theme .enhanced-card {
      background: var(--button-color, #0369a1);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(15px);
      transition: all 0.3s ease;
      border: 1px solid rgba(255,255,255,0.2);
      color: var(--button-text-color, #ffffff) !important;
      font-weight: 600;
    }
    

    

    
    .travel-theme .social-icons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }
    
    .travel-theme .social-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--button-color, #0369a1);
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
      color: var(--text-color, #ffffff);
      flex-shrink: 0;
    }
    
    .travel-theme .social-icon svg {
      width: 20px;
      height: 20px;
      color: inherit !important;
      fill: currentColor !important;
    }
    
    .travel-theme .social-icon:hover {
      background: var(--button-color, #0ea5e9);
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0,0,0,0.2), 0 3px 8px var(--button-color, rgba(0,0,0,0.15));
    }
    
    .travel-theme .link-card:hover .arrow-icon {
      opacity: 1;
      transform: translateX(5px);
    }
    

    
    @media (max-width: 768px) {
      .travel-theme .bio-link-layout {
        padding: 1.5rem 1rem;
      }
      
      .travel-theme .bio-link-title {
        font-size: 1.75rem;
      }
    }
  `,
  colorPresets: [
    {
      name: 'Ocean Depths',
      background: {
        type: 'image',
        color: '#FF6B35',
        gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop'
      },
      buttonColor: '#FF6B35',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Sunset Horizon',
      background: {
        type: 'image',
        color: '#0284C7',
        gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
      },
      buttonColor: '#0284C7',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Forest Trail',
      background: {
        type: 'image',
        color: '#35AC69',
        gradient: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop'
      },
      buttonColor: '#35AC69',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Desert Dunes',
      background: {
        type: 'image',
        color: '#EF476F',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=800&fit=crop'
      },
      buttonColor: '#EF476F',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Arctic Aurora',
      background: {
        type: 'image',
        color: '#8D4D47',
        gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&h=800&fit=crop'
      },
      buttonColor: '#8D4D47',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    }
  ],
  font: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
      { className: "bio-link-header" },

      React.createElement("div", { className: "bio-link-profile-container" },
        header.profile_image ?
          React.createElement("img", {
            src: getDisplayUrl(header.profile_image), 
            alt: displayName,
            className: "bio-link-profile"
          }) :
          React.createElement("div", {
            className: "bio-link-profile",
            style: {
              background: 'rgba(255,255,255,0.2)',
              color: textColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              borderRadius: '50%',
              overflow: 'hidden'
            }
          }, displayName.charAt(0))
      ),

      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),

      (header.location || header.countries) && React.createElement("div", {
        className: "travel-stats"
      },
        header.location && React.createElement("div", { className: "stat-item" },
          React.createElement("div", { className: "stat-label" }, t("Location")),
          React.createElement("div", { className: "stat-value" }, header.location)
        ),
        header.countries && React.createElement("div", { className: "stat-item" },
          React.createElement("div", { className: "stat-label" }, t("Countries")),
          React.createElement("div", { className: "stat-value" }, header.countries)
        )
      ),

      displayDescription && React.createElement("div", {
        className: "bio-link-description",
        style: { color: textColor }
      }, displayDescription)
    );
  },
  renderSocial: (props: ThemeRenderProps) => {
    const { data, isPublic, textColor, buttonColor, buttonTextColor } = props;
    const { social } = data.config;
    
    const displaySocial = social?.items && social.items.length > 0 ? social.items : defaults.social;

    // Always show social if we have displaySocial (defaults or user data)
    if (!displaySocial.length) return null;

    return React.createElement(
      "div",
      { className: "social-icons" },
      displaySocial.map((item, index) =>
        item.platform &&
        React.createElement("a", {
          key: index,
          href: item.url || '#',
          target: "_blank",
          rel: "noopener noreferrer",
          className: "social-icon"
        },
          React.createElement(SocialIcon, {
            platform: item.platform
          })
        )
      )
    );
  },
  renderLinks: (props: ThemeRenderProps) => {
    const { data, isPublic, buttonColor, textColor, buttonTextColor } = props;
    const { links } = data.config;
    
    const displayLinks = links && links.length > 0 ? links : defaults.links;

    return React.createElement(
      React.Fragment,
      null,

      displayLinks && displayLinks.length > 0 && React.createElement("div", {
        style: {
          marginBottom: '1.5rem',
          textAlign: 'center'
        }
      },
        React.createElement("h2", {
          style: {
            fontSize: '1.5rem',
            fontWeight: '700',
            color: textColor
          }
        }, t('My Links')),
      ),

      displayLinks && displayLinks.map((link, index) =>
        React.createElement("a", {
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "enhanced-card link-card",
          style: {
            textDecoration: 'none',
            color: props.buttonTextColor,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.5rem',
            '--button-color': props.buttonColor,
            '--button-text-color': props.buttonTextColor
          } as React.CSSProperties
        },
          React.createElement("div", {
            style: {
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: link.icon ? 'transparent' : `${buttonColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }
          },
            link.icon ?
              React.createElement("img", {
                src: getDisplayUrl(link.icon),
                alt: link.text || 'Link',
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }
              }) :
              React.createElement("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: props.buttonTextColor || '#ffffff',
                strokeWidth: "2"
              },
                React.createElement("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                React.createElement("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
              )
          ),
          React.createElement("div", {
            style: {
              flex: 1
            }
          },
            React.createElement("h3", {
              style: {
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: 0,
                marginBottom: '0.25rem'
              }
            }, link.text || 'Untitled'),
            link.description && React.createElement("p", {
              style: {
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.4
              }
            }, link.description)
          ),
          React.createElement("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: props.buttonTextColor || '#ffffff',
            strokeWidth: "2",
            style: {
              transition: 'all 0.3s ease',
              transform: 'translateX(0px)'
            },
            className: "arrow-icon"
          },
            React.createElement("path", { d: "M5 12h14" }),
            React.createElement("path", { d: "m12 5 7 7-7 7" })
          )
        )
      )
    );
  },
  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop';

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

    return React.createElement(
      "div",
      {
        className: "travel-theme",
        style: {
          color: textColor,
          fontFamily: font || 'Inter, sans-serif',
          '--button-color': buttonColor,
          '--text-color': textColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div",
        { className: "bio-link-layout" },
        TravelTheme.renderProfile && TravelTheme.renderProfile(props),
        TravelTheme.renderLinks && TravelTheme.renderLinks(props),
        TravelTheme.renderSocial && TravelTheme.renderSocial(props),

        /* Copyright section */
        data.config.copyright?.enabled !== false && React.createElement("div", {
          style: {
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1rem',
            fontSize: '0.875rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }
        }, data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.header.name || defaults.name}. All rights reserved.`)
      )
    );
  }
};

export default TravelTheme;