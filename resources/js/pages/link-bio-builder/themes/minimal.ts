import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';
const defaults = {
  name: t('Jordan Smith'),
  tagline: t('Minimalist Designer'),
  email: t('jordan@minimal.design'),
  phone: t('+1 (555) 654-3210'),
  description: t('Less is more. Creating clean, functional designs that speak volumes through simplicity.'),
  links: [
    { text: 'Portfolio', url: '#', description: t('View my work'), icon: '' },
    { text: 'Contact', url: '#', description: t('Get in touch'), icon: '' },
    { text: 'Blog', url: '#', description: t('Design insights'), icon: '' }
  ],
  social: [
    { platform: 'dribbble', url: '#', icon: '' },
    { platform: 'behance', url: '#', icon: '' },
    { platform: 'linkedin', url: '#', icon: '' }
  ]
};

const MinimalTheme: ThemeType = {
  name: 'Minimal',
  layout: 'minimal',
  buttonStyle: 'pill',
  socialPosition: 'bottom',
  profileStyle: 'square',
  profileFields: [
    {
      name: 'name',
      label: t('Name'),
      type: 'text',
      placeholder: t('Enter your name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Basic Info'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Tagline'),
      type: 'text',
      placeholder: t('Enter a short tagline'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Basic Info'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Profile Image'),
      type: 'image',
      placeholder: t('Upload your profile image'),
      required: false,
      section: t('Basic Info'),
      cols: 2
    },
    {
      name: 'email',
      label: t('Email'),
      type: 'email',
      placeholder: t('Enter your email'),
      defaultValue: defaults.email,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'phone',
      label: t('Phone'),
      type: 'tel',
      placeholder: t('Enter your phone number'),
      defaultValue: defaults.phone,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Brief Description'),
      type: 'textarea',
      placeholder: t('Enter a brief description'),
      defaultValue: defaults.description,
      required: false,
      section: t('Additional Info'),
      cols: 2,
      rows: 2
    }
  ],
  customCSS: `
    /* Ultra Modern Minimal Theme - Clean & Sophisticated */
    .bio-link-container.minimal-theme {
      position: relative;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.01em;
      background-color: var(--bg-color, #FFFFFF);
      color: var(--text-color, #000000);
      border-radius: 0;
      overflow: hidden;
      max-width: 100%;
      margin: 0;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    /* Background overlay for readability */
    .bio-link-container.minimal-theme::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.3);
      z-index: 0;
    }
    
    .bio-link-container.minimal-theme.dark-mode::after {
      background: rgba(0, 0, 0, 0.4);
    }
    
    /* Modern geometric background pattern */
    .minimal-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(to right, var(--pattern-color) 1px, transparent 1px),
        linear-gradient(to bottom, var(--pattern-color) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 0;
      opacity: 0.6;
    }
    
    /* Modern header styling with glass effect */
    .minimal-theme .bio-link-header {
      padding: 4rem 2rem 2rem;
      position: relative;
      z-index: 2;
      text-align: left;
      max-width: 650px;
      margin: 0 auto;
      backdrop-filter: blur(5px);
      border-radius: 16px;
    }
    
    /* Modern square profile image */
    .minimal-theme .bio-link-profile {
      width: 130px !important;
      height: 130px !important;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 10px 30px var(--theme-button)50, 0 4px 12px var(--theme-button)30, 0 0 0 2px var(--theme-button)20;
      flex-shrink: 0;
    }
    

    
    /* Profile content container */
    .minimal-theme .profile-content {
      flex: 1;
    }
    
    /* Clean modern typography */
    .minimal-theme .bio-link-title {
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      position: relative;
      display: inline-block;
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--text-color, #FFFFFF) !important;
    }
    
    /* Modern highlight for title */

    
    /* Title hover effect */
    .minimal-theme .bio-link-title:hover::after {
      width: 100%;
    }
    
    /* Description styling */
    .minimal-theme .bio-link-description {
      font-size: 1.25rem;
      opacity: 1;
      line-height: 1.6;
      font-weight: 400;
      max-width: 90%;
      color: var(--text-color, #FFFFFF) !important;
    }
    
    /* About me section styling */
    .minimal-theme .about-me-section {
      transition: all 0.3s ease;
    }
    
    .minimal-theme .about-me-section:hover {
      opacity: 0.95;
    }
    
    .minimal-theme .about-me-header {
      transition: all 0.3s ease;
    }
    
    .minimal-theme .about-me-section:hover .about-me-header {
      transform: translateX(3px);
    }
    
    /* Custom scrollbar for long descriptions */
    .minimal-theme .about-me-content {
      scrollbar-width: thin;
      scrollbar-color: var(--button-color, rgba(0, 0, 0, 0.2)) transparent;
    }
    
    .minimal-theme .about-me-content::-webkit-scrollbar {
      width: 4px;
    }
    
    .minimal-theme .about-me-content::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .minimal-theme .about-me-content::-webkit-scrollbar-thumb {
      background-color: var(--button-color, rgba(0, 0, 0, 0.2));
      border-radius: 4px;
    }
    
    /* Links container */
    .minimal-theme .links-container {
      padding: 1rem 2rem 2rem 2rem;
      max-width: 650px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
      color: var(--theme-text, #000000) !important;
    }
    
    /* Link button styling */
    .minimal-theme .bio-link-button {
      padding: 1.25rem 1.75rem;
      border-radius: 14px;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      overflow: hidden;
      background-color: var(--theme-button) !important;
      border: 1px solid var(--theme-button);
      box-shadow: 0 8px 20px var(--theme-button)60, 0 4px 12px var(--theme-button)40, 0 2px 4px var(--theme-button)20;
      color: var(--theme-button-text, #000000) !important;
    }
      .minimal-theme .bio-link-button:not(:last-of-type){
      margin-bottom: 1.25rem;
      }
    
    /* Link hover effect */
    .minimal-theme .bio-link-button:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      opacity: 0.9;
      filter: brightness(1.05);
    }
    
    /* Link button shine effect */
    .minimal-theme .bio-link-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      transition: left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
    }
    
    .minimal-theme .bio-link-button:hover::before {
      left: 100%;
    }
    
    /* Link content */
    .minimal-theme .link-content {
      display: flex;
      align-items: center;
      flex: 1;
    }
    
    /* Link icon */
    .minimal-theme .link-icon {
      width: 3rem;
      height: 3rem;
      margin-right: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    
    /* Link icon hover effect */
    .minimal-theme .bio-link-button:hover .link-icon {
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    /* Link text */
    .minimal-theme .link-text {
      font-weight: 600;
      font-size: 1.25rem;
      transition: transform 0.4s ease;
      letter-spacing: -0.01em;
    }
    
    /* Link description */
    .minimal-theme .link-description {
      font-size: 0.95rem;
      opacity: 0.7;
      margin-top: 0.35rem;
      font-weight: 400;
      line-height: 1.5;
    }
    
    /* Link arrow */
    .minimal-theme .link-arrow {
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      margin-left: 0.75rem;
      transform: translateX(0);
    }
    
    /* Arrow hover effect */
    .minimal-theme .bio-link-button:hover .link-arrow {
      transform: translateX(6px);
      opacity: 1;
    }
    
    /* Social icons container */
    .minimal-theme .social-container,
    .minimal-footer-container {
      padding: 2.5rem 2rem;
      max-width: 650px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: flex-start;
      border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
    }
    
    /* Social section title */
    .minimal-theme .social-title {
      width: 100%;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 1;
      font-weight: 600;
      color: var(--text-color, #FFFFFF) !important;
    }
    
    /* Social icon */
    .minimal-theme .social-icon {
      width: 3.25rem;
      height: 3.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      border-radius: 12px;
      background-color: var(--theme-button) !important;
      border: 1px solid var(--theme-button);
      box-shadow: 0 4px 12px var(--theme-button)40, 0 2px 4px var(--theme-button)20;
      color: var(--theme-button-text, #FFFFFF) !important;
    }
    
    /* Social icon hover effect */
    .minimal-theme .social-icon:hover {
      transform: translateY(-5px) scale(1.1);
      background-color: var(--icon-hover-bg, rgba(0, 0, 0, 0.06));
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
    }
    
    /* Fix for social icons */
    .minimal-theme .social-icon svg {
      width: 20px;
      height: 20px;
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
      color: var(--theme-button-text, #FFFFFF) !important;
      fill: var(--theme-button-text, #FFFFFF) !important;
    }
    
    .minimal-theme .social-icon:hover svg {
      transform: scale(1.2);
    }
    
    /* Footer */
    .minimal-theme .minimal-footer {
      padding: 1rem;
      text-align: center;
      font-size: 0.95rem;
      opacity: 1;
      max-width: 650px;
      margin: 0 auto ;
      letter-spacing: -0.01em;
      border-top: none;
      font-weight: 500;
      color: var(--theme-button-text, #ffffff) !important;
      text-shadow: none;
        background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      position: relative;
      z-index: 10;
    }
    
    /* Dark mode footer */
    .minimal-theme.dark-mode .minimal-footer {
      background: rgba(0, 0, 0, 0.7);
      color: var(--theme-button-text, #FFFFFF) !important;
    }
    
    /* Dynamic color system */
    .minimal-theme {
      --bg-color: var(--theme-bg, #FFFFFF);
      --text-color: var(--theme-text, #111827);
      --button-color: var(--theme-button, #3B82F6);
      --button-text-color: var(--theme-button-text, #000000);
      --accent-color: var(--theme-accent, var(--theme-button, #3B82F6));
      --border-color: var(--theme-border, rgba(0, 0, 0, 0.08));
      --pattern-color: var(--theme-pattern, rgba(0, 0, 0, 0.02));
      --button-bg: var(--theme-button-bg, rgba(0, 0, 0, 0.04));
      --button-border: var(--theme-button-border, rgba(0, 0, 0, 0.06));
      --button-hover-bg: var(--theme-button-hover, rgba(0, 0, 0, 0.06));
      --icon-bg: var(--theme-icon-bg, rgba(0, 0, 0, 0.04));
      --icon-border: var(--theme-icon-border, rgba(0, 0, 0, 0.06));
      --icon-hover-bg: var(--theme-icon-hover, rgba(0, 0, 0, 0.06));
    }
    
    /* Dark mode adjustments */
    .minimal-theme.dark-mode {
      --theme-bg: #111111;
      --theme-text: #FFFFFF;
      --theme-border: rgba(255, 255, 255, 0.08);
      --theme-button-bg: rgba(255, 255, 255, 0.06);
      --theme-button-border: rgba(255, 255, 255, 0.08);
      --theme-button-hover: rgba(255, 255, 255, 0.1);
      --theme-pattern: rgba(255, 255, 255, 0.04);
      --theme-icon-bg: rgba(255, 255, 255, 0.06);
      --theme-icon-border: rgba(255, 255, 255, 0.08);
      --theme-icon-hover: rgba(255, 255, 255, 0.1);
      --theme-accent: rgba(255, 255, 255, 0.8);
    }
    
    /* Enhanced Animations */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes scaleInRotate {
      from { opacity: 0; transform: scale(0.8) rotate(-5deg); }
      to { opacity: 1; transform: scale(1) rotate(-2deg); }
    }
    
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(var(--pulse-color, 0, 0, 0), 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(var(--pulse-color, 0, 0, 0), 0); }
      100% { box-shadow: 0 0 0 0 rgba(var(--pulse-color, 0, 0, 0), 0); }
    }
    

    
    .minimal-theme .bio-link-title {
      animation: slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.1s;
    }
    
    .minimal-theme .bio-link-description {
      animation: slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.2s;
    }
    
    .minimal-theme .about-me-section {
      animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.3s;
      opacity: 0;
    }
    
    .minimal-theme .bio-link-button {
      animation: fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.3s);
      opacity: 0;
    }
    
    .minimal-theme .social-icon {
      animation: fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.5s);
      opacity: 0;
    }
    
    .minimal-theme .minimal-footer {
      animation: fadeInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.8s;
      opacity: 0;
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      .minimal-theme .bio-link-header {
        flex-direction: column;
        text-align: center;
        gap: 1.75rem;
        padding: 3.5rem 1.5rem 2rem;
      }
      
      .minimal-theme .bio-link-title::after {
        left: 50%;
        transform: translateX(-50%);
      }
      
      .minimal-theme .bio-link-description {
        max-width: 100%;
        margin-left: auto;
        margin-right: auto;
      }
      
      .minimal-theme .social-container {
        justify-content: center;
      }
      
      .minimal-theme .social-title {
        text-align: center;
      }
      
      .minimal-theme .minimal-footer {
        text-align: center;
      }
    }
  `,
  colorPresets: [

        {
      name: 'Warm Beige',
      background: {
        type: 'image',
        color: '#A53860',
        gradient: 'linear-gradient(135deg, #fefcf3 0%, #fef7e0 100%)',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop'
      },
      buttonColor: '#A53860',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Soft Gray',
      background: {
        type: 'image',
        color: '#919F71',
        gradient: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=800&fit=crop'
      },
      buttonColor: '#919F71',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Pure Minimal',
      background: {
        type: 'image',
        color: '#BE7942',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop'
      },
      buttonColor: '#BE7942',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Deep Navy',
      background: {
        type: 'image',
        color: '#131C08',
        gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=800&fit=crop'
      },
      buttonColor: '#131C08',
      buttonTextColor: '#ffffff',
      textColor: '#000000'
    },
    {
      name: 'Charcoal Black',
      background: {
        type: 'image',
        color: '#7C316B',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop'
      },
      buttonColor: '#7C316B',
      buttonTextColor: '#ffffff',
      textColor: '#000000'
    }
  ],
  font: 'Outfit, sans-serif',
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
    const isDarkMode = textColor === '#FFFFFF' || textColor === '#E2E8F0';
    
    const contactInfo = (displayEmail || displayPhone) ? 
      React.createElement("div", { 
        className: "mt-4 flex flex-col gap-2",
        style: { opacity: 0.9 }
      },
        displayEmail && React.createElement("div", { 
          className: "flex items-center gap-2 text-sm",
          style: { 
            padding: '0.75rem 1rem',
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: '8px',
            color: buttonTextColor || '#FFFFFF'
          }
        },
          React.createElement("svg", { 
            xmlns: "http://www.w3.org/2000/svg", 
            width: "14", 
            height: "14", 
            viewBox: "0 0 24 24", 
            fill: "none", 
            stroke: buttonTextColor || '#FFFFFF', 
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
          className: "flex items-center gap-2 text-sm",
          style: { 
            padding: '0.75rem 1rem',
            backgroundColor: buttonColor,
            borderRadius: '8px',
            border: `1px solid ${buttonColor}`,
            boxShadow: `0 4px 12px ${buttonColor}40, 0 2px 4px ${buttonColor}20`,
            color: buttonTextColor || '#FFFFFF'
          }
        },
          React.createElement("svg", { 
            xmlns: "http://www.w3.org/2000/svg", 
            width: "14", 
            height: "14", 
            viewBox: "0 0 24 24", 
            fill: "none", 
            stroke: buttonTextColor || '#FFFFFF', 
            strokeWidth: "2", 
            strokeLinecap: "round", 
            strokeLinejoin: "round" 
          },
            React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
          ),
          displayPhone
        )
      ) : null;
    
    const description = displayDescription ? 
      React.createElement("div", { 
        className: "mt-5 text-sm about-me-section",
        style: { 
          padding: '0',
          lineHeight: '1.8',
          maxWidth: '100%',
          position: 'relative',
          marginTop: '2rem'
        }
      }, 
        React.createElement("div", {
          className: "about-me-header",
          style: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem',
            fontWeight: 600,
            fontSize: '1rem',
            color: textColor
          }
        },
          React.createElement("svg", { 
            xmlns: "http://www.w3.org/2000/svg", 
            width: "16", 
            height: "16", 
            viewBox: "0 0 24 24", 
            fill: "none", 
            stroke: textColor, 
            strokeWidth: "2", 
            strokeLinecap: "round", 
            strokeLinejoin: "round",
            style: { marginRight: '0.5rem' }
          },
            React.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement("polyline", { points: "14 2 14 8 20 8" }),
            React.createElement("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
            React.createElement("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
            React.createElement("polyline", { points: "10 9 9 9 8 9" })
          ),
          t("About Me")
        ),
        React.createElement("div", { 
          className: "about-me-content",
          style: { 
            fontWeight: 400, 
            color: textColor,
            fontSize: '0.95rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: displayDescription.length > 300 ? '200px' : 'none',
            overflowY: displayDescription.length > 300 ? 'auto' : 'visible',
            paddingRight: displayDescription.length > 300 ? '10px' : '0'
          } 
        }, displayDescription)
      ) : null;
    
    return React.createElement(
      React.Fragment, 
      null,
      /* Header row with profile image, name and tagline */
      React.createElement("div", { 
        style: { 
          display: "flex", 
          alignItems: "center", 
          gap: "2.5rem",
          marginBottom: "2rem"
        }
      },
        /* Profile image */
        header.profile_image ? 
          React.createElement("div", { className: "bio-link-profile" },
            React.createElement("img", {  src: getDisplayUrl(header.profile_image), alt: displayName, className: "w-full h-full object-cover" })
          ) : 
          React.createElement("div", { 
            className: "bio-link-profile flex items-center justify-center text-xl font-medium",
            style: { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
          }, displayName.charAt(0)),
        
        /* Name and tagline */
        React.createElement("div", { className: "profile-content" },
          React.createElement("h1", { className: "bio-link-title" }, displayName),
          React.createElement("p", { className: "bio-link-description" }, displayTagline)
        )
      ),
      
      /* Description if available */
      description,
      
      /* Contact information */
      contactInfo
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
      React.createElement("div", { className: "social-title" }, t("Connect")),
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
              color: buttonTextColor || '#FFFFFF'
            })
          )
      )
    );
  },
  
  renderLinks: (props: ThemeRenderProps) => {
    const { data, isPublic, buttonColor, textColor, buttonTextColor } = props;
    const { links } = data.config;
    
    const displayLinks = links && links.length > 0 ? links : defaults.links;
    const isDarkMode = textColor === '#FFFFFF' || textColor === '#E2E8F0';
    
    if (!displayLinks || !displayLinks.length) {
      return React.createElement(
        "div", 
        { 
          className: "text-center p-4 opacity-50 text-sm",
          style: { 
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
            borderRadius: '8px'
          }
        },
        "No links added yet"
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
          className: "bio-link-button no-underline",
          style: { 
            "--index": index,
            textDecoration: 'none'
          } as React.CSSProperties
        },
          React.createElement("div", { className: "link-content" },
            link.icon && 
              React.createElement("div", { className: "link-icon" },
                React.createElement("img", { src: getDisplayUrl(link.icon), alt: "", className: "w-full h-full object-contain" })
              ),
            React.createElement("div", null,
              React.createElement("div", { className: "link-text" }, link.text || t('Untitled Link')),
              link.description && 
                React.createElement("div", { className: "link-description" }, link.description)
            )
          ),
          React.createElement("div", { className: "link-arrow" },
            React.createElement("svg", { 
              xmlns: "http://www.w3.org/2000/svg", 
              width: "16", 
              height: "16", 
              viewBox: "0 0 24 24", 
              fill: "none", 
              stroke: buttonTextColor || '#000000', 
              strokeWidth: "2", 
              strokeLinecap: "round", 
              strokeLinejoin: "round" 
            },
              React.createElement("path", { d: "M5 12h14" }),
              React.createElement("path", { d: "M12 5l7 7-7 7" })
            )
          )
        )
      ),

    );
  },
  
  renderContainer: (props: ThemeRenderProps) => {
    const isDarkMode = props.textColor === '#FFFFFF' || props.textColor === '#E2E8F0';
    const { data, textColor, buttonColor, buttonTextColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop';
    
    let backgroundStyle = {};
    if (background?.type === 'gradient') {
      backgroundStyle = { 
        background: background.gradient,
        backgroundImage: 'none'
      };
    } else if (background?.type === 'color') {
      backgroundStyle = { 
        backgroundColor: background.color || '#FFFFFF',
        backgroundImage: 'none'
      };
    } else if (background?.type === 'image') {
      const imageUrl = background.image ? getDisplayUrl(background.image) : defaultImage;
      backgroundStyle = { 
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
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
        className: `bio-link-container minimal-theme ${isDarkMode ? 'dark-mode' : ''}`,
        style: {
          '--theme-bg': background?.color || '#FFFFFF',
          '--theme-text': textColor,
          '--theme-button': buttonColor,
          '--theme-button-text': buttonTextColor,
          '--theme-accent': buttonColor,
          color: textColor,
          fontFamily: font,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div", 
        { className: "bio-link-header" },
        MinimalTheme.renderProfile && MinimalTheme.renderProfile(props)
      ),
      MinimalTheme.renderLinks && MinimalTheme.renderLinks(props),
      MinimalTheme.renderSocial && MinimalTheme.renderSocial(props),
      data.config.copyright?.enabled !== false && React.createElement("div", { 
        className: "minimal-footer-container"
      },
        React.createElement("div", { 
          className: "minimal-footer",
          style: {
            position: 'relative',
            bottom: 0,
            width: '100%',
            color: '#333333',
            opacity: 1
          }
        }, 
          data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.displayName}. All rights reserved.`
        )
      )
    );
  }
};

export default MinimalTheme;