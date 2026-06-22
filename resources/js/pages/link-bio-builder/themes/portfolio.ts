import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

// Default data for Portfolio theme when user data is empty
const defaults = {
  name: t('Marcus Chen'),
  tagline: t('Creative Director & Designer'),
  email: t('marcus@portfolio.design'),
  phone: t('+1 (555) 456-7890'),
  description: t('Award-winning designer specializing in brand identity and digital experiences for global clients.'),
  links: [
    { text: 'View Portfolio', url: '#', description: t('See my work'), icon: '' },
    { text: 'Hire Me', url: '#', description: t('Start a project'), icon: '' },
    { text: 'Design Process', url: '#', description: t('How I work'), icon: '' }
  ],
  social: [
    { platform: 'behance', url: '#', icon: '' },
    { platform: 'dribbble', url: '#', icon: '' },
    { platform: 'instagram', url: '#', icon: '' }
  ]
};

const PortfolioTheme: ThemeType = {
  name: 'Portfolio',
  layout: 'masonry',
  buttonStyle: 'borderless',
  socialPosition: 'sidebar',
  profileStyle: 'asymmetric',
  profileFields: [
    {
      name: 'name',
      label: t('Full Name'),
      type: 'text',
      placeholder: t('Enter your full name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Personal Details'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Professional Title'),
      type: 'text',
      placeholder: t('Enter your professional title'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Personal Details'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Photo'),
      type: 'image',
      placeholder: t('Upload your profile photo'),
      required: false,
      section: t('Personal Details'),
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
      name: 'website',
      label: t('Portfolio Website'),
      type: 'url',
      placeholder: t('Enter your portfolio website URL'),
      required: false,
      section: t('Professional Details'),
      cols: 2
    },
    {
      name: 'description',
      label: t('Bio'),
      type: 'textarea',
      placeholder: t('Write a short bio about yourself and your work'),
       defaultValue: defaults.description,
      required: false,
      section: t('Professional Details'),
      cols: 2,
      rows: 4
    },
    {
      name: 'skills',
      label: t('Skills'),
      type: 'text',
      placeholder: t('Enter your skills (e.g. Photography, Design, Illustration)'),
      required: false,
      section: t('Professional Details'),
      cols: 2
    }
  ],
  customCSS: `
    /* Portfolio theme styling */
    .bio-link-container.portfolio-theme {
      position: relative;
      font-family: 'Space Grotesk', sans-serif;
      overflow-x: hidden;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Background overlay for readability */
    .bio-link-container.portfolio-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 0;
    }

    /* Creative grid layout */
    .portfolio-theme .portfolio-container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      gap: 1rem;
      padding: 1rem;
      max-width: 100%;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* Creative header with asymmetric design */
    .portfolio-theme .bio-link-header {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      padding: 0;
      margin-bottom: 1rem;
    }

    /* Profile section with creative layout */
    .portfolio-theme .profile-section {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 1.5rem;
      border-radius: 0;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-left: 4px solid;
    }

    /* Decorative elements */
    .portfolio-theme .decorative-line {
      position: absolute;
      height: 100%;
      width: 1px;
      background: linear-gradient(to bottom, transparent, currentColor, transparent);
      left: 1.5rem;
      top: 0;
      opacity: 0.3;
    }

    .portfolio-theme .decorative-dot {
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: currentColor;
      opacity: 0.5;
    }

    /* Profile image with creative styling */
    .portfolio-theme .bio-link-profile {
      position: relative;
      width: 120px !important;
      height: 120px !important;
      margin-bottom: 1.5rem !important;
      border: none !important;
      z-index: 1;
      border-radius:10px;
      overflow:hidden;
    }




    .portfolio-theme .bio-link-profile img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    /* Name styling with creative typography */
    .portfolio-theme .bio-link-title {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;
      letter-spacing: -0.02em;
      color: var(--text-color, #FFFFFF) !important;
    }



    /* Creative tagline styling */
    .portfolio-theme .bio-link-description {
      font-size: 1rem;
      font-weight: 500;
      opacity: 1;
      margin-bottom: 1rem;
      max-width: 100%;
      line-height: 1.5;
      color: var(--text-color, #F3F4F6) !important;
    }

    /* Portfolio category tags */
    .portfolio-theme .portfolio-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .portfolio-theme .portfolio-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      white-space: nowrap;
      color: var(--text-color, #FFFFFF) !important;
    }

    /* Links section with masonry layout */
    .portfolio-theme .links-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      width: 100%;
    }

    /* Portfolio project card styling */
    .portfolio-theme .bio-link-button {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      overflow: hidden;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .portfolio-theme .bio-link-button:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }



    /* Project image container */
    .portfolio-theme .project-image {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .portfolio-theme .project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .portfolio-theme .bio-link-button:hover .project-image img {
      transform: scale(1.05);
    }

    /* Project overlay with info */
    .portfolio-theme .project-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      transform: translateY(100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .portfolio-theme .bio-link-button:hover .project-overlay {
      transform: translateY(0);
    }

    .portfolio-theme .project-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: white;
    }

    .portfolio-theme .project-description {
      font-size: 0.75rem;
      opacity: 0.9;
      color: white;
    }

    /* Social links section */
    .portfolio-theme .social-links-section {
      margin-top: 1rem;
      width: 100%;
    }

    .portfolio-theme .social-buttons a:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      opacity: 0.9;
    }

    /* Animations */
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    .portfolio-theme .animate-fade-up {
      animation: fadeSlideUp 0.6s ease forwards;
    }

    .portfolio-theme .animate-slide-in {
      animation: fadeSlideIn 0.6s ease forwards;
    }

    .portfolio-theme .animate-scale-in {
      animation: scaleIn 0.5s ease forwards;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .portfolio-theme .links-container {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 0;
      }

      .portfolio-theme .social-sidebar {
        position: relative;
        right: auto;
        top: auto;
        transform: none;
        flex-direction: row;
        justify-content: center;
        margin-top: 2rem;
        padding: 1rem;
      }

      .portfolio-theme .bio-link-social {
        flex-direction: row;
        gap: 1rem;
      }
    }

    @media (min-width: 640px) {
      .portfolio-theme .links-container {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    @media (min-width: 1024px) {
      .portfolio-theme .links-container {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
  `,
 colorPresets: [
    {
      name: 'Creative Black',
      background: {
        type: 'image',
        color: '#C55A4E',
        gradient: 'linear-gradient(135deg, #fecaca 0%, #fed7d7 100%)',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop'
      },
      buttonColor: '#C55A4E',
      buttonTextColor: '#FFFFFF',
      textColor: '#ffffff'
    },
    {
      name: 'Designer Purple',
      background: {
        type: 'image',
        color: '#7D5BA6',
        gradient: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=800&fit=crop'
      },
      buttonColor: '#7D5BA6',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Photographer Slate',
      background: {
        type: 'image',
        color: '#3E7FB4',
        gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=1200&h=800&fit=crop'
      },
      buttonColor: '#3E7FB4',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Architect Stone',
      background: {
        type: 'image',
        color: '#E38B1B',
        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        image: 'https://images.unsplash.com/photo-1554774853-719586f82d77?w=1200&h=800&fit=crop'
      },
      buttonColor: '#E38B1B',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Artist Emerald',
      background: {
        type: 'image',
        color: '#6D926D',
        gradient: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=800&fit=crop'
      },
      buttonColor: '#6D926D',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Space Grotesk, sans-serif',
  defaultPreset: 0,

  // Theme-specific render functions
  renderProfile: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, textColor, buttonColor, isPublic, t = (key: string) => key } = props;
    // Use defaults when header data is empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const { header } = data.config;

    const displayName = header.name || (header.name !== null && header.name !== '' && isEditMode ? defaults.name : null);
    const displayTagline = header.tagline || (header.tagline !== null && header.tagline !== '' && isEditMode ? defaults.tagline : null);
    const displayEmail = header.email || (header.email !== null && header.email !== '' && isEditMode ? defaults.email : null);
    const displayPhone = header.phone || (header.phone !== null && header.phone !== '' && isEditMode ? defaults.phone : null);
    const displayDescription = header.description || (header.description !== null && header.description !== '' && isEditMode ? defaults.description : null);

    // Parse skills from header.skills if available
    const skills = header.skills ? header.skills.split(',').map(skill => skill.trim()).filter(Boolean) : [];

    return React.createElement(
      "div",
      {
        className: "profile-section",
        style: { borderLeftColor: buttonColor }
      },
   

      /* Profile image with creative styling */
      header.profile_image ?
        React.createElement("div", {
          className: "bio-link-profile",
          style: { borderColor: textColor }
        },
          React.createElement("img", {
             src: getDisplayUrl(header.profile_image), 
            alt: displayName
          })
        ) :
        React.createElement("div", {
          className: "bio-link-profile",
          style: { borderColor: textColor, backgroundColor: buttonColor }
        },
          React.createElement("div", {
            className: "w-full h-full flex items-center justify-center text-3xl font-bold",
            style: { color: props.buttonTextColor }
          }, displayName.charAt(0))
        ),

      /* Creative name and tagline */
      React.createElement("h1", {
        className: "bio-link-title",
        style: { color: textColor, }
      }, displayName),
      React.createElement("p", {
        className: "bio-link-description",
        style: { color: textColor}
      }, displayTagline),

      /* Portfolio tags - dynamic from skills field */
      React.createElement("div", { className: "portfolio-tags" },
        skills.length > 0 ?
          skills.map((skill, index) =>
            React.createElement("div", {
              key: index,
              className: "portfolio-tag",
              style: { color: textColor}
            }, skill)
          ) :
          // Fallback if no skills are provided
          [
            React.createElement("div", {
              key: "default-1",
              className: "portfolio-tag",
              style: { color: textColor,}
            }, "Designer"),
            React.createElement("div", {
              key: "default-2",
              className: "portfolio-tag",
              style: { color: textColor,}
            }, "Creative")
          ]
      ),

      /* Additional profile fields */
      header.website && React.createElement("div", {
        className: "mt-4 text-sm flex items-center gap-2",
        style: { color: textColor}
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
          strokeLinejoin: "round"
        },
          React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
          React.createElement("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
          React.createElement("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
        ),
        header.website
      ),

      displayEmail && React.createElement("div", {
        className: "mt-3 text-sm flex items-center gap-2",
        style: { color: textColor,}
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
          strokeLinejoin: "round"
        },
          React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
          React.createElement("polyline", { points: "22,6 12,13 2,6" })
        ),
        displayEmail
      ),

      displayPhone && React.createElement("div", {
        className: "mt-2 text-sm flex items-center gap-2",
        style: { color: textColor, opacity: 0.8, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }
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
          strokeLinejoin: "round"
        },
          React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
        ),
        displayPhone
      ),

      displayDescription && React.createElement("div", {
        className: "mt-4 text-sm p-3 bg-white/10 rounded-lg",
        style: { color: textColor, }
      }, displayDescription)
    );
  },

  renderSocial: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, isPublic, textColor, t = (key: string) => key } = props;
    const { social } = data.config;
    
    // Use defaults when social items are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displaySocial = social?.items && social.items.length > 0 ? social.items : (social?.display && isEditMode ? defaults.social : []);

    if (!social?.display || !displaySocial.length) return null;

    return React.createElement(
      "div",
      {
        style: {
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }
      },
      React.createElement("h3", {
        style: {
          fontSize: '1rem',
          fontWeight: 600,
          marginBottom: '1rem',
          color: textColor,
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          textAlign: 'center'
        }
      }, t("Connect With Us")),
      React.createElement("div", {
        style: {
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }
      },
        displaySocial.map((item, index) =>
          item.platform &&
            React.createElement("a", {
              key: index,
              href: item.url || "#",
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                animation: isPublic ? `fadeSlideUp 0.3s ease forwards ${0.3 + index * 0.1}s` : 'none',
                opacity: 1
              }
            },
              React.createElement(SocialIcon, {
                platform: item.platform,
                color: '#333'
              })
            )
        )
      )
    );
  },

  renderLinks: (props: ThemeRenderProps) => {
    const { data, isPublic, buttonColor, textColor } = props;
    const { links } = data.config;
    
    // Use defaults when links are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displayLinks = links && links.length > 0 ? links : (isEditMode ? defaults.links : []);

    if (!displayLinks || !displayLinks.length) {
      return React.createElement(
        "div",
        {
          className: "bg-white/20 rounded-lg p-3 flex items-center justify-center shadow-sm text-sm",
          style: { color: textColor, opacity: 0.7 }
        },
        "No portfolio items yet"
      );
    }

    return React.createElement(
      "div",
      {
        className: "links-container",
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          width: '100%',
          marginTop: '1rem'
        }
      },
      displayLinks.map((link, index) =>
        React.createElement("a", {
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "bio-link-button animate-fade-up no-underline",
          style: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
            borderRadius: '8px',
            background: buttonColor,
            transition: 'transform 0.3s ease',
            animationDelay: isPublic ? `${0.2 + index * 0.1}s` : '0s',
            opacity: 1,
            textDecoration: 'none',
          }
        },
          React.createElement("div", {
            style: {
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: buttonColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1rem'
            }
          },
            link.icon ?
              React.createElement("img", {
                src: getDisplayUrl(link.icon),
                alt: link.text,
                style: {
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain',
                  marginBottom: '0.5rem'
                }
              }) :
              React.createElement("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "30",
                height: "30",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: props.buttonTextColor || '#FFFFFF',
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                style: { marginBottom: '0.5rem' }
              },
                React.createElement("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                React.createElement("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
              ),
            React.createElement("div", {
              style: {
                fontSize: '0.875rem',
                fontWeight: 600,
                color: props.buttonTextColor || '#FFFFFF',
                textAlign: 'center',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
              }
            }, link.text || 'Link'),
            link.description && React.createElement("div", {
              style: {
                fontSize: '0.7rem',
                color: props.buttonTextColor || '#FFFFFF',
                textAlign: 'center',
                marginTop: '0.25rem'
              }
            }, link.description),
         
          )
        )
      )
    );
  },

  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop';

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
        className: "bio-link-container portfolio-theme",
        style: {
          color: textColor,
          fontFamily: font,
          '--button-color': buttonColor,
          '--text-color': textColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div",
        {
          className: "portfolio-container",
          style: {
            position: 'relative',
            minHeight: '100vh',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column'
          }
        },
        React.createElement("div", {
          className: "bio-link-header",
          style: {
            marginBottom: '1rem'
          }
        },
          PortfolioTheme.renderProfile && PortfolioTheme.renderProfile(props)
        ),

        /* Portfolio theme links */
        React.createElement("div", {
          style: {
            width: '100%',
            flex: 1
          }
        },
          PortfolioTheme.renderLinks && PortfolioTheme.renderLinks(props)
        ),

        /* Portfolio theme social section */
        props.data.config.social?.display && props.data.config.social.items.length > 0 &&
          PortfolioTheme.renderSocial && PortfolioTheme.renderSocial(props),

        /* Copyright footer */
        props.data.config.copyright?.enabled !== false && React.createElement("div", {
          className: "portfolio-footer",
          style: {
            padding: '1.25rem',
            textAlign: 'center',
            fontSize: '0.85rem',
            opacity: 1,
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            letterSpacing: '0.02em',
            color: textColor,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
            marginTop: '0.5rem'
          }
        },
          props.data.config.copyright?.text || `© ${new Date().getFullYear()} ${props.data.config.header.name}. All rights reserved.`
        )
      )
    );
  }
};

export default PortfolioTheme;
