import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

const defaults = {
  name: t('Emma Rodriguez'),
  tagline: t('Social Media Influencer'),
  email: t('emma@socialconnect.com'),
  description: t('Creating authentic content and building communities across all social platforms. Join me on this journey!'),
  links: [
    { text: 'Latest Content', url: '#', description: t('Check out my recent posts'), icon: '' },
    { text: 'Collaborate', url: '#', description: t('Work with me'), icon: '' },
    { text: 'Shop My Favorites', url: '#', description: t('Curated products I love'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'tiktok', url: '#', icon: '' },
    { platform: 'youtube', url: '#', icon: '' }
  ]
};

const SocialTheme: ThemeType = {
  name: 'Social',
  layout: 'compact',
  buttonStyle: 'pill',
  socialPosition: 'inline',
  profileStyle: 'small',
  profileFields: [
    {
      name: 'name',
      label: t('Display Name'),
      type: 'text',
      placeholder: t('Enter your display name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Profile Info'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Bio'),
      type: 'text',
      placeholder: t('Enter a short bio'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Profile Info'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Picture'),
      type: 'image',
      placeholder: t('Upload your profile picture'),
      required: false,
      section: t('Profile Info'),
      cols: 2
    },
    {
      name: 'location',
      label: t('Location'),
      type: 'text',
      placeholder: t('Enter your location'),
      required: false,
      section: t('Additional Info'),
      cols: 1
    },
    {
      name: 'email',
      label: t('Email'),
      type: 'email',
      placeholder: t('Enter your email'),
      defaultValue: defaults.email,
      required: false,
      section: t('Additional Info'),
      cols: 1
    },
    {
      name: 'description',
      label: t('About Me'),
      type: 'textarea',
      placeholder: t('Tell people more about yourself'),
      defaultValue: defaults.description,
      required: false,
      section: t('Additional Info'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    .social-theme {
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      position: relative;
      background-size: cover;
      background-position: center;
      padding: 2rem 1rem;
    }
    
    .social-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.1));
      z-index: 0;
    }
    
    .social-theme .bio-link-layout {
      max-width: 400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      padding: 0;
    }
    
    .social-theme .bio-link-profile-container {
      width: 100px;
      height: 100px;
      margin: 0 auto 1.5rem;
      border-radius: 50%;
      overflow: hidden;
    }
    

    
    .social-theme .bio-link-profile {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .social-theme .bio-link-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      color: var(--text-color, #ffffff) !important;
    }
    
    .social-theme .bio-link-tagline {
      font-size: 1rem;
      text-align: center;
      margin-bottom: 1.5rem;
      color: var(--text-color, #ffffff) !important;
      opacity: 1;
      line-height: 1.4;
    }
    
    .social-theme .bio-link-description {
      padding: 1rem;
      border-radius: 12px;
      margin: 1.5rem 0;
      line-height: 1.6;
      border: 1px solid rgba(255,255,255,0.2);
      color: var(--text-color, #495057);
      font-size: 0.9rem;
      backdrop-filter: blur(10px);
    }
    
    .social-theme .info-card {
      border-radius: 12px;
      padding: 1rem;
      margin: 1rem 0;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      color: var(--text-color, #495057);
    }
    
    .social-theme .social-card {
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.20rem;
      transition: all 0.2s ease;
      border: 1px solid var(--button-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      color: var(--button-text-color, #333333) !important;
      background-color: var(--button-color) !important;
      box-shadow: 0 8px 20px var(--button-color)60, 0 4px 12px var(--button-color)40, 0 2px 4px var(--button-color)20;
      backdrop-filter: blur(10px);
    }
    
    .social-theme .social-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 30px var(--button-color)70, 0 8px 20px var(--button-color)50, 0 4px 12px var(--button-color)30;
      border-color: var(--button-color);
    }
    
    .social-theme .card-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .social-theme .card-content {
      flex: 1;
    }
    
    .social-theme .card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .social-theme .card-description {
      font-size: 0.8rem;
      opacity: 0.8;
      line-height: 1.3;
    }
    
    .social-theme .card-arrow {
      color: inherit;
      margin-left: 0.5rem;
    }
    
    .social-theme .social-icons {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }
    
    .social-theme .social-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      border: 1px solid rgba(255,255,255,0.2);
      color: var(--text-color, #495057);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      backdrop-filter: blur(10px);
      cursor:pointer;
    }
    

    .social-theme .social-icon svg {
      color: var(--text-color, #ffffff) !important;
      fill: var(--text-color, #ffffff) !important;
      width: 20px;
      height: 20px;
    }
    
    @media (max-width: 768px) {
      .social-theme .bio-link-layout {
        padding: 1.5rem 1rem;
      }
      
      .social-theme .bio-link-title {
        font-size: 1.875rem;
      }
    }
  `,
  colorPresets: [
    {
      name: 'Instagram Gradient',
      background: {
        type: 'image',
        color: '#FF6F61',
        gradient: 'linear-gradient(45deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)',
        image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1200&h=800&fit=crop'
      },
      buttonColor: '#FF6F61',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Twitter Blue',
      background: {
        type: 'image',
        color: '#00C2FF',
        gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop'
      },
      buttonColor: '#00C2FF',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'TikTok Vibes',
      background: {
        type: 'image',
        color: '#77B2A2',
        gradient: 'linear-gradient(135deg, #cffafe 0%, #a7f3d0 50%, #6ee7b7 100%)',
        image: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=1200&h=800&fit=crop'
      },
      buttonColor: '#77B2A2',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'LinkedIn Pro',
      background: {
        type: 'image',
        color: '#E38B1B',
        gradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop'
      },
      buttonColor: '#E38B1B',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Sunset Vibes',
      background: {
        type: 'image',
        color: '#8B355E',
        gradient: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
      },
      buttonColor: '#8B355E',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    }
  ],
  font: 'Inter, sans-serif',
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
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }
          }, displayName.charAt(0))
      ),
      
      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),
      
      displayDescription && React.createElement("div", { 
        className: "bio-link-description"
      }, displayDescription),
      
      (header.location || displayEmail) && React.createElement("div", {
        className: "info-card",
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }
      },
        header.location && React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }
        },
          React.createElement("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            style: { flexShrink: 0, marginTop: '2px' }
          },
            React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
            React.createElement("circle", { cx: "12", cy: "10", r: "3" })
          ),
          React.createElement("span", {
            style: {
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              lineHeight: '1.4',
              flex: 1,
              minWidth: 0
            }
          }, header.location)
        ),
        displayEmail && React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }
        },
          React.createElement("svg", {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2"
          },
            React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
            React.createElement("polyline", { points: "22,6 12,13 2,6" })
          ),
          displayEmail
        )
      )
    );
  },
  
  renderSocial: (props: ThemeRenderProps) => {
    const { data, isPublic, textColor, buttonColor, buttonTextColor } = props;
    const { social } = data.config;
    
    const displaySocial = social?.items && social.items.length > 0 ? social.items : defaults.social;
    
    const defaultSocials = [
      { platform: 'instagram', url: '#' },
      { platform: 'twitter', url: '#' },
      { platform: 'facebook', url: '#' },
      { platform: 'linkedin', url: '#' }
    ];
    
    const socialItems = (social?.display && social.items.length > 0) ? social.items : defaultSocials;
    
    return React.createElement(
      "div", 
      { className: "social-icons" },
      socialItems.map((item, index) => 
        item.platform &&
          React.createElement("a", { 
            key: index, 
            href: item.url || "#", 
            target: "_blank", 
            rel: "noopener noreferrer", 
            className: "social-icon"
          },
            React.createElement(SocialIcon, { 
              platform: item.platform,
              color: textColor || '#ffffff'
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
      
      displayLinks && displayLinks.map((link, index) => 
        React.createElement("a", { 
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer",  
          className: "social-card"
        },
          React.createElement("div", { 
            className: "card-icon",
            style: { color: props.buttonTextColor || '#FFFFFF' }
          },
            link.icon ? 
              React.createElement("img", { 
                src: getDisplayUrl(link.icon), 
                alt: "",
                style: { width: '24px', height: '24px', borderRadius: '4px' }
              }) :
              React.createElement("svg", {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2"
              },
                React.createElement("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                React.createElement("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
              )
          ),
          React.createElement("div", { className: "card-content" },
            React.createElement("h3", { 
              className: "card-title",
              style: { color: props.textColor }
            }, link.text || 'Untitled'),
            link.description && React.createElement("p", { 
              className: "card-description",
              style: { color: props.textColor }
            }, link.description)
          ),
          React.createElement("div", { className: "card-arrow" },
            React.createElement("svg", {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: props.buttonTextColor || '#FFFFFF',
              strokeWidth: "2"
            },
              React.createElement("path", { d: "M5 12h14" }),
              React.createElement("path", { d: "M12 5l7 7-7 7" })
            )
          )
        )
      )
    );
  },
  
  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;
    
    const defaultImage = 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=1200&h=800&fit=crop';
    
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
        className: "social-theme",
        style: {
          color: textColor,
          fontFamily: font || 'Inter, sans-serif',
          '--text-color': textColor,
          '--button-color': buttonColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div", 
        { className: "bio-link-layout" },
        SocialTheme.renderProfile && SocialTheme.renderProfile(props),
        SocialTheme.renderSocial && SocialTheme.renderSocial(props),
        SocialTheme.renderLinks && SocialTheme.renderLinks(props),
        data.config.copyright?.enabled !== false && React.createElement("div", {
          style: {
            marginTop: '3rem',
            padding: '1.5rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.875rem',
            color: textColor,
            opacity: 0.8,
            backdropFilter: 'blur(10px)'
          }
        }, data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.header.name || defaults.name}. Connect With Me!`)
      )
    );
  }
};

export default SocialTheme;