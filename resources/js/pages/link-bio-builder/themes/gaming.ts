import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

const defaults = {
  name: t('Tyler "ProGamer" Johnson'),
  tagline: t('Professional Esports Player'),
  links: [
    { text: 'Watch Stream', url: '#', description: t('Live on Twitch'), icon: '' },
    { text: 'Gaming Setup', url: '#', description: t('My gear & config'), icon: '' },
    { text: 'Tournament Schedule', url: '#', description: t('Upcoming matches'), icon: '' }
  ],
  social: [
    { platform: 'twitch', url: '#', icon: '' },
    { platform: 'youtube', url: '#', icon: '' },
    { platform: 'discord', url: '#', icon: '' }
  ]
};

const GamingTheme: ThemeType = {
  name: 'Gaming',
  layout: 'modern',
  buttonStyle: 'minimal',
  socialPosition: 'bottom',
  profileStyle: 'clean',
  profileFields: [
    {
      name: 'name',
      label: t('Display Name'),
      type: 'text',
      placeholder: t('Enter your display name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Profile'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Bio'),
      type: 'text',
      placeholder: t('Brief description about yourself'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Profile'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Image'),
      type: 'image',
      placeholder: t('Upload your profile image'),
      required: false,
      section: t('Profile'),
      cols: 2
    },
    {
      name: 'specialty',
      label: t('Specialty'),
      type: 'text',
      placeholder: t('e.g. Content Creator, Streamer, Developer'),
      required: false,
      section: t('Details'),
      cols: 1
    },
    {
      name: 'platform',
      label: t('Platform'),
      type: 'text',
      placeholder: t('Primary platform or focus area'),
      required: false,
      section: t('Details'),
      cols: 1
    }
  ],
  customCSS: `
    .gaming-theme {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
    }

    .gaming-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 0;
    }

    .gaming-theme .bio-link-layout {
      max-width: 480px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      position: relative;
      z-index: 1;
    }

    .gaming-theme .bio-link-profile-container {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      border-radius: 24px;
      overflow: hidden;
      background: var(--button-color, #3b82f6);
      padding: 3px;
      position: relative;
      transition: all 0.3s ease;
    }

    .gaming-theme .bio-link-profile-container:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 6px 18px var(--button-color, rgba(0, 0, 0, 0.3));
    }

    .gaming-theme .bio-link-profile {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 21px;
      background: var(--bg-color, #0f0f23);
    }

    .gaming-theme .bio-link-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 0.5rem;
      color: var(--text-color);
      letter-spacing: -0.025em;
    }

    .gaming-theme .bio-link-tagline {
      font-size: 1rem;
      text-align: center;
      margin-bottom: 2rem;
      color: var(--text-color);
      opacity: 0.95;
      line-height: 1.5;
      font-weight: 500;
    }

    .gaming-theme .profile-details {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 2rem;
      justify-content: center;
    }

    .gaming-theme .detail-chip {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.875rem;
      color: var(--text-color, #ffffff);
      font-weight: 500;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .gaming-theme .link-card {
      background: var(--button-color, #3b82f6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      transition: all 0.3s ease;
      text-decoration: none;
      color: var(--button-text-color, #ffffff);
      display: block;
      backdrop-filter: blur(15px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 0 2px 8px var(--button-color, rgba(0, 0, 0, 0.15));
      font-weight: 600;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .gaming-theme .link-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 15px var(--button-color, rgba(0, 0, 0, 0.2));
      border-color: rgba(255, 255, 255, 0.3);
    }

    .gaming-theme .link-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: var(--button-text-color, #ffffff);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .gaming-theme .link-description {
      font-size: 0.875rem;
      color: var(--button-text-color, #ffffff);
      line-height: 1.4;
      font-weight: 500;
    }

    .gaming-theme .social-icons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem 0;
      flex-wrap: wrap;
    }

    .gaming-theme .social-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      color: var(--text-color, #ffffff);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(15px);
    }

    .gaming-theme .social-icon:hover {
      background: var(--button-color);
      color: var(--button-text-color);
      transform: translateY(-3px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2), 0 3px 8px var(--button-color, rgba(0, 0, 0, 0.15));
    }

    .gaming-theme .social-icon svg {
      color: inherit;
      fill: currentColor;
    }

    .gaming-theme .social-icon:hover svg {
      color: inherit;
      fill: currentColor;
    }

    .gaming-theme .copyright {
      text-align: center;
      margin-top: 2.2rem;
      padding: 2.2rem 1.5rem 0 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 0.875rem;
      color: var(--text-color);
      opacity: 0.9;
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);

    }

    @media (max-width: 768px) {
      .gaming-theme .bio-link-layout {
        padding: 1.5rem 1rem;
      }

      .gaming-theme .profile-details {
        flex-direction: column;
        align-items: center;
      }

      .gaming-theme .detail-chip {
        text-align: center;
      }
    }
  `,
  colorPresets: [
        {
      name: 'Neon Gaming',
      background: {
        type: 'image',
        color: '#EF4444',
        gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop'
      },
      buttonColor: '#EF4444',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Cyber Green',
      background: {
        type: 'image',
        color: '#9333EA',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b77f 100%)',
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=800&fit=crop'
      },
      buttonColor: '#9333EA',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Gaming Blue',
      background: {
        type: 'image',
        color: '#C3073F',
        gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=800&fit=crop'
      },
      buttonColor: '#C3073F',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },

    {
      name: 'Gaming Purple',
      background: {
        type: 'image',
        color: '#EC4899',
        gradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=800&fit=crop'
      },
      buttonColor: '#EC4899',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    },
    {
      name: 'Esports Blue',
      background: {
        type: 'image',
        color: '#14B8A6',
        gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
        image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&h=800&fit=crop'
      },
      buttonColor: '#14B8A6',
      buttonTextColor: '#ffffff',
      textColor: '#ffffff'
    }
  ],
  font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '700',
              color: buttonColor
            }
          }, displayName?.charAt(0) || '?')
      ),

      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),

      (header.specialty || header.platform) && React.createElement("div", {
        className: "profile-details"
      },
        header.specialty && React.createElement("div", { className: "detail-chip" }, header.specialty),
        header.platform && React.createElement("div", { className: "detail-chip" }, header.platform)
      )
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
              platform: item.platform,
              color: textColor
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

      displayLinks.map((link, index) =>
        React.createElement("a", {
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "link-card",
          style: {
            '--button-color': props.buttonColor,
            '--button-text-color': props.buttonTextColor
          } as React.CSSProperties
        },
          link.icon
            ? React.createElement("img", {
                src: getDisplayUrl(link.icon),
                alt: link.text,
                style: { width: '32px', height: '32px', objectFit: 'contain', marginBottom: '0.5rem' }
              })
            : null,
          React.createElement("div", { className: "link-title" }, link.text || t('Link')),
          link.description && React.createElement("div", { className: "link-description" }, link.description)
        )
      )
    );
  },

  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;

    let backgroundStyle = {};
    const defaultImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=800&fit=crop';

    if (background?.type === 'image') {
      const imageUrl = background.image || defaultImage;
      backgroundStyle = {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    } else if (background?.type === 'gradient' && background.gradient) {
      backgroundStyle = { background: background.gradient };
    } else if (background?.type === 'color' && background.color) {
      backgroundStyle = { backgroundColor: background.color };
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
        className: "gaming-theme",
        style: {
          color: textColor,
          fontFamily: font,
          '--button-color': buttonColor,
          '--button-text-color': props.buttonTextColor || '#ffffff',
          '--text-color': textColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div",
        { className: "bio-link-layout" },
        GamingTheme.renderProfile && GamingTheme.renderProfile(props),
        GamingTheme.renderLinks && GamingTheme.renderLinks(props),
        GamingTheme.renderSocial && GamingTheme.renderSocial(props),
        data.config.copyright?.enabled !== false && React.createElement("div", {
          className: "copyright"
        }, data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.header.name || defaults.name}`)
      )
    );
  }
};

export default GamingTheme;
