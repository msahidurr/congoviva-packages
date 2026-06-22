import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

const defaults = {
  name: t('Dr. Maya Patel'),
  tagline: t('Wellness Coach & Nutritionist'),
  description: t('Helping you achieve optimal health through personalized nutrition and lifestyle coaching.'),
  links: [
    { text: 'Book Consultation', url: '#', description: t('Schedule your session'), icon: '' },
    { text: 'Meal Plans', url: '#', description: t('Custom nutrition plans'), icon: '' },
    { text: 'Health Tips', url: '#', description: t('Daily wellness advice'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'youtube', url: '#', icon: '' },
    { platform: 'linkedin', url: '#', icon: '' }
  ]
};

const HealthTheme: ThemeType = {
  name: 'Health',
  layout: 'card',
  buttonStyle: 'soft',
  socialPosition: 'floating',
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
      label: t('Profession'),
      type: 'text',
      placeholder: t('Enter your profession (e.g. Nutritionist, Fitness Coach)'),
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
      name: 'specialty',
      label: t('Specialty'),
      type: 'text',
      placeholder: t('Yoga, Nutrition, Fitness Training (separate with commas)'),
      required: false,
      section: t('Professional Details'),
      cols: 1
    },
    {
      name: 'certification',
      label: t('Certification'),
      type: 'text',
      placeholder: t('RYT-500, Certified Nutritionist (separate with commas)'),
      required: false,
      section: t('Professional Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Bio'),
      type: 'textarea',
      placeholder: t('Tell people about your health expertise'),
      defaultValue: defaults.description,
      required: false,
      section: t('Professional Details'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Health Theme - Clean, Professional & Wellness-focused */
    .bio-link-container.health-theme {
      position: relative;
      font-family: 'Nunito', 'Quicksand', sans-serif;
      overflow: hidden;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      background-color: var(--theme-bg, #FFFFFF);
      color: var(--theme-text, #0F5C46);
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Background overlay for readability */
    .bio-link-container.health-theme::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }



    /* Dynamic color system for health theme */
    .health-theme {
      --theme-bg: var(--health-bg, #FFFFFF);
      --theme-text: var(--health-text, #0F5C46);
      --theme-button: var(--health-button, #20C997);
      --theme-button-text: var(--health-button-text, #FFFFFF);
      --theme-accent: var(--health-accent, var(--health-button, #20C997));
      --theme-card-bg: var(--health-card-bg, rgba(255, 255, 255, 0.9));
      --theme-hover-bg: var(--health-hover-bg, rgba(255, 255, 255, 0.95));
      --theme-border: var(--health-border, rgba(32, 201, 151, 0.2));
      --theme-glow: var(--health-glow, rgba(32, 201, 151, 0.1));
    }

    .health-theme {
      overflow-x: hidden;
      width: 100%;
      padding: 0;
      margin: 0;
    }

    /* Subtle pattern overlay */
    .health-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320c997' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.5;
      z-index: 0;
      filter: hue-rotate(var(--theme-hue, 0deg));
    }

    /* Decorative elements */
    .health-theme .pulse-circle {
      position: absolute;
      border-radius: 50%;
      background: var(--theme-accent);
      opacity: 0.05;
      z-index: 1;
    }

    .health-theme .pulse-circle-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -100px;
      animation: pulse 15s infinite alternate;
    }

    .health-theme .pulse-circle-2 {
      width: 200px;
      height: 200px;
      bottom: -50px;
      left: -50px;
      animation: pulse 12s infinite alternate-reverse;
    }

    .health-theme .heartbeat-icon {
      position: absolute;
      width: 40px;
      height: 40px;
      opacity: 0.1;
      z-index: 1;
    }

    .health-theme .heartbeat-1 {
      top: 15%;
      left: 10%;
      animation: heartbeat 2s infinite;
    }

    .health-theme .heartbeat-2 {
      bottom: 20%;
      right: 10%;
      animation: heartbeat 2s infinite;
      animation-delay: 1s;
    }

    /* Header styling */
    .health-theme .bio-link-header {
      position: relative;
      padding: 2.5rem 2rem 0;
      text-align: center;
      z-index: 2;
      background: var(--theme-card-bg);
      backdrop-filter: blur(10px);
      color: var(--theme-text);
    }

    /* Transparent header when background image is set */
    .health-theme.has-bg-image .bio-link-header {
      background: transparent;
      backdrop-filter: none;
    }

    /* Profile image styling */
    .health-theme .bio-link-profile {
      width: 130px !important;
      height: 130px !important;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1.5rem;
      position: relative;
      z-index: 2;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Profile image hover effect */
    .health-theme .bio-link-profile:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2),
                  0 0 0 12px var(--theme-glow),
                  0 8px 20px var(--health-button);
    }

    /* Name styling */
    .health-theme .bio-link-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--theme-text);
      position: relative;
      display: inline-block;
      letter-spacing: -0.01em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }

    /* Tagline styling */
    .health-theme .bio-link-tagline {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 1rem;
      color: var(--theme-text);
      opacity: 0.9;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
    }

    /* Description styling */
    .health-theme .bio-link-description {
      font-size: 1rem;
      margin: 0 auto;
      line-height: 1.6;
      position: relative;
    }

    /* Enhanced Professional Details */
    .health-theme .professional-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin: 2rem auto;
      max-width: 700px;
    }

    .health-theme .enhanced-detail-card {
      background: var(--theme-card-bg);
      border-radius: 16px;
      padding: 1.2rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--theme-border);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      color: var(--theme-text);
      position: relative;
      overflow: hidden;
    }

    /* Transparent detail cards when background image is set */
    .health-theme.has-bg-image .enhanced-detail-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .health-theme .enhanced-detail-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--theme-accent);
      opacity: 0.3;
    }



    .health-theme .detail-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .health-theme .detail-icon {
      width: 50px;
      height: 50px;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      transition: all 0.4s ease;
    }



    .health-theme .detail-title {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      color: var(--theme-text);
    }

    .health-theme .detail-value {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.4;
    }

    /* Specialty Tags */
    .health-theme .specialty-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 8px;
    }

    .health-theme .specialty-tag {
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid currentColor;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .health-theme .specialty-tag:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* Certification Items */
    .health-theme .certification-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .health-theme .certification-item {
      display: flex;
      align-items: flex-start;
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.4;
    }

    .health-theme .cert-bullet {
      margin-right: 0.5rem;
      font-weight: 700;
      opacity: 0.7;
    }

    /* Links container */
    .health-theme .links-container {
      padding: 2rem;
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 600px;
      margin: 0 auto;
      overflow-x: hidden;
      width: auto;
    }

    /* Link button styling */
    .health-theme .bio-link-button {
      position: relative;
      padding: 1rem 1.5rem;
      background: var(--health-button);
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      display: flex;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--health-button-text);
      font-weight: 600;
    }

    /* Transparent link buttons when background image is set */
    .health-theme.has-bg-image .bio-link-button {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }


    /* Link icon */
    .health-theme .bio-link-button .link-icon {
      width: 40px;
      height: 40px;
      margin-right: 1rem;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--theme-glow);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .health-theme .bio-link-button .link-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .health-theme .bio-link-button:hover .link-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .health-theme .bio-link-button:hover .link-icon img {
      transform: scale(1.1);
    }

    /* Link text */
    .health-theme .bio-link-button .link-text {
      flex: 1;
    }

    .health-theme .bio-link-button .link-title {
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: 0.01em;
      color: var(--health-button-text);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .health-theme .bio-link-button .link-description {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 0.25rem;
      color: var(--health-button-text);
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    /* Arrow icon */
    .health-theme .bio-link-button .arrow-icon {
      margin-left: 0.85rem;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .health-theme .bio-link-button:hover .arrow-icon {
      transform: translateX(4px);
      opacity: 1;
    }

    /* Social icons section */
    .health-theme .social-container {
      position: relative;
      margin: 0 auto 2rem;
      padding: 0 2rem 2rem 2rem;
      border-top: 1px solid rgba(32, 201, 151, 0.1);
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 600px;
      overflow-x: hidden;
      width: auto;
    }

    /* Social title */
    .health-theme .social-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-align: center;
      color: currentColor;
      position: relative;
    }

    .health-theme .social-title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 2px;
      background: currentColor;
      opacity: 0.2;
    }

    /* Social icons wrapper */
    .health-theme .social-icons {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Social icon styling */
    .health-theme .social-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 12px;
      background: var(--theme-card-bg);
      border: 1px solid var(--theme-border);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }

    /* Transparent social icons when background image is set */
    .health-theme.has-bg-image .social-icon {
      background: var(--theme-accent);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Fix for social icons */
    .health-theme .social-icon svg {
      width: 18px;
      height: 18px;
      position: relative;
      z-index: 2;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Social icon hover effect */
    .health-theme .social-icon:hover {
      transform: translateY(-5px);
      background: var(--theme-accent);
      border-color: var(--theme-accent);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15), 0 4px 12px var(--health-button);
    }

    .health-theme .social-icon:hover svg {
      transform: scale(1.2);
      color: #FFFFFF !important;
    }

    /* Social icon wrapper */
    .health-theme .social-icon-wrapper {
      position: relative;
      display: inline-flex;
    }

    /* Footer */
    .health-theme .health-footer {
      padding: 1.25rem 0 0;
      text-align: center;
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 1.5rem;
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    /* Transparent footer when background image is set */
    .health-theme.has-bg-image .health-footer {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 1rem;
    }

    /* Animations */
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.05; }
      50% { transform: scale(1.05); opacity: 0.08; }
      100% { transform: scale(1); opacity: 0.05; }
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .health-theme .bio-link-profile {
      animation: fadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .health-theme .bio-link-title,
    .health-theme .bio-link-tagline,
    .health-theme .bio-link-description {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.2s;
    }

    .health-theme .detail-card {
      animation: fadeIn 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.4s);
    }

    .health-theme .bio-link-button {
      animation: slideInRight 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.5s);
    }

    .health-theme .social-icon {
      animation: slideInLeft 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.7s);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .health-theme .bio-link-profile {
        width: 110px !important;
        height: 110px !important;
      }

      .health-theme .bio-link-title {
        font-size: 1.5rem;
      }

 

      .health-theme .professional-details {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin: 1.5rem auto;
        padding: 0 0.5rem;
      }

      .health-theme .enhanced-detail-card {
        padding: 1.25rem;
      }

      .health-theme .detail-header {
        flex-direction: column;
        text-align: center;
        margin-bottom: 1rem;
      }

      .health-theme .detail-icon {
        margin-right: 0;
        margin-bottom: 0.75rem;
        width: 45px;
        height: 45px;
      }

      .health-theme .specialty-tags {
        justify-content: center;
      }

      .health-theme .specialty-tag {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
      }

      .health-theme .links-container,
      .health-theme .social-container {
        padding: 1.5rem;
        margin: 0 auto 1.5rem;
        max-width: 90%;
        overflow-x: hidden;
        width: auto;
      }

      .health-theme .social-icon {
        width: 2.75rem;
        height: 2.75rem;
      }

      .health-theme .social-icon:hover {
        transform: translateY(-5px);
      }
    }
  `,
  colorPresets: [
        {
      name: 'Lavender Peace',
      background: {
        type: 'image',
        color: '#6B8E23',
        gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&w=1200&h=800&fit=crop'
      },
      buttonColor: '#6B8E23',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },

    {
      name: 'Ocean Calm',
      background: {
        type: 'image',
        color: '#3D5A80',
        gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&w=1200&h=800&fit=crop'
      },
      buttonColor: '#3D5A80',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
     {
      name: 'Rose Wellness',
      background: {
        type: 'image',
        color: '#D99B5D',
        gradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&w=1200&h=800&fit=crop'
      },
      buttonColor: '#D99B5D',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Sunrise Vitality',
      background: {
        type: 'image',
        color: '#A0522D',
        gradient: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
        image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&w=1200&h=800&fit=crop'
      },
      buttonColor: '#A0522D',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
     {
      name: 'Fresh Mint',
      background: {
        type: 'image',
        color: '#56DFCF',
        gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&w=1200&h=800&fit=crop'
      },
      buttonColor: '#56DFCF',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Nunito, Quicksand, sans-serif',
  defaultPreset: 0,

  // Theme-specific render functions
  renderProfile: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, textColor, buttonColor, buttonTextColor, t = (key: string) => key, isPublic } = props;
    // Use defaults when header data is empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const { header } = data.config;
    
    const displayName = header.name || (header.name !== null && header.name !== '' && isEditMode ? defaults.name : null);
    const displayTagline = header.tagline || (header.tagline !== null && header.tagline !== '' && isEditMode ? defaults.tagline : null);
    const displayEmail = header.email || (header.email !== null && header.email !== '' && isEditMode ? defaults.email : null);
    const displayPhone = header.phone || (header.phone !== null && header.phone !== '' && isEditMode ? defaults.phone : null);
    const displayDescription = header.description || (header.description !== null && header.description !== '' && isEditMode ? defaults.description : null);

    return React.createElement(
      React.Fragment,
      null,
      /* Decorative elements */
      React.createElement("div", {
        className: "pulse-circle pulse-circle-1",
        style: { textDecoration: 'none', background: buttonColor }
      }),
      React.createElement("div", {
        className: "pulse-circle pulse-circle-2",
        style: { textDecoration: 'none', background: buttonColor }
      }),
      React.createElement("div", {
        className: "heartbeat-icon heartbeat-1",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
        )
      ),
      React.createElement("div", {
        className: "heartbeat-icon heartbeat-2",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" })
        )
      ),

      /* Profile image */
      header.profile_image ?
        React.createElement("div", { className: "bio-link-profile" },
          React.createElement("img", {  src: getDisplayUrl(header.profile_image), alt: displayName, className: "w-full h-full object-cover" })
        ) :
        React.createElement("div", {
          className: "bio-link-profile flex items-center justify-center text-xl font-bold",
          style: { textDecoration: 'none', background: buttonColor, color: buttonTextColor }
        }, displayName.charAt(0)),

      /* Name and tagline */
      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),

      /* Professional details */
      (header.specialty || header.certification) && React.createElement("div", {
        className: "professional-details"
      },
        header.specialty && React.createElement("div", {
          className: "enhanced-detail-card specialty-card",
          style: { textDecoration: 'none', "--index": 0 } as React.CSSProperties
        },
          React.createElement("div", { className: "detail-header" },
            React.createElement("div", { className: "detail-title" }, t("Specialties"))
          ),
          React.createElement("div", { className: "specialty-content" },
            (() => {
              const specialties = header.specialty.split(/[,;]|\s{2,}/).filter(s => s.trim());
              if (specialties.length > 1) {
                return React.createElement("div", { className: "specialty-tags" },
                  specialties.map((specialty, index) =>
                    React.createElement("span", {
                      key: index,
                      className: "specialty-tag",
                      style: { backgroundColor: `${buttonColor}`, color: textColor, borderColor: `${buttonColor}` }
                    }, specialty.trim())
                  )
                );
              }
              return React.createElement("div", {
                className: "detail-value",
                style: { color: buttonColor }
              }, header.specialty);
            })()
          )
        ),

        header.certification && React.createElement("div", {
          className: "enhanced-detail-card certification-card",
          style: { textDecoration: 'none', "--index": 1 } as React.CSSProperties
        },
          React.createElement("div", { className: "detail-header" },
            React.createElement("div", {
              className: "detail-icon",
              style: { backgroundColor: `${buttonColor}15`, color: buttonColor }
            },
              React.createElement("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "22",
                height: "22",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
              },
                React.createElement("circle", { cx: "12", cy: "8", r: "7" }),
                React.createElement("polyline", { points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" })
              )
            ),
            React.createElement("div", { className: "detail-title" }, t("Certification"))
          ),
          React.createElement("div", { className: "certification-content" },
            (() => {
              const certifications = header.certification.split(/[,;]|\s{2,}/).filter(c => c.trim());
              if (certifications.length > 1) {
                return certifications.map((cert, index) =>
                  React.createElement("div", {
                    key: index,
                    className: "certification-item",
                    style: { color: buttonColor }
                  },
                    React.createElement("div", { className: "cert-bullet" }, "•"),
                    React.createElement("span", null, cert.trim())
                  )
                );
              }
              return React.createElement("div", {
                className: "detail-value",
                style: { color: buttonColor }
              }, header.certification);
            })()
          )
        )
      ),

      /* Description */
      displayDescription && React.createElement("p", { className: "bio-link-description mt-4" }, displayDescription)
    );
  },

  renderSocial: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, isPublic, textColor, buttonColor, buttonTextColor, t = (key: string) => key } = props;
    const { social } = data.config;
    
    const displaySocial = social?.items && social.items.length > 0 ? social.items : defaults.social;

    if (!social?.display || !displaySocial.length) return null;

    // Platform display names for tooltips
    const platformNames = {
      facebook: 'Facebook',
      twitter: 'Twitter',
      instagram: 'Instagram',
      linkedin: 'LinkedIn',
      youtube: 'YouTube',
      pinterest: 'Pinterest',
      tiktok: 'TikTok',
      snapchat: 'Snapchat',
      github: 'GitHub',
      dribbble: 'Dribbble',
      behance: 'Behance',
      medium: 'Medium',
      reddit: 'Reddit',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      discord: 'Discord',
      twitch: 'Twitch',
      spotify: 'Spotify',
      soundcloud: 'SoundCloud',
      vimeo: 'Vimeo'
    };

    return React.createElement(
      "div",
      { className: "social-container" },
      React.createElement("div", { className: "social-title" }, t("Connect With Me")),
      React.createElement("div", { className: "social-icons" },
        displaySocial.map((item, index) =>
          item.platform &&
            React.createElement("div", {
              key: index,
              className: "social-icon-wrapper",
              style: { textDecoration: 'none', "--index": index } as React.CSSProperties
            },
              React.createElement("a", {
                href: item.url || "#", target: "_blank", rel: "noopener noreferrer",
                className: "social-icon",
                style: { textDecoration: 'none', color: buttonColor },
                title: platformNames[item.platform] || item.platform
              },
                React.createElement(SocialIcon, {
                  platform: item.platform,
                  color: textColor
                })
              )
            )
        )
      ),
      data.config.copyright?.enabled !== false && React.createElement("div", { className: "health-footer" },
        data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.displayName}. All rights reserved.`
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
        { className: "text-center p-4 opacity-70 text-sm rounded-lg bg-white/10 backdrop-blur-md" },
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
          className: "bio-link-button",
          style: { textDecoration: 'none', "--index": index } as React.CSSProperties
        },
          link.icon &&
            React.createElement("div", { className: "link-icon" },
              React.createElement("img", { src: getDisplayUrl(link.icon), alt: "" })
            ),
          React.createElement("div", { className: "link-text" },
            React.createElement("div", { className: "link-title" }, link.text || t('Untitled Link')),
            link.description &&
              React.createElement("div", { className: "link-description" }, link.description)
          ),
          React.createElement("div", { className: "arrow-icon" },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: buttonTextColor || '#FFFFFF',
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
  },

  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, buttonTextColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&w=1200&h=800&fit=crop';

    const hasBackgroundImage = background?.type === 'image';

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

    return React.createElement(
      "div",
      {
        className: `bio-link-container health-theme${hasBackgroundImage ? ' has-bg-image' : ''}`,
        style: {
          '--health-text': textColor,
          '--health-button': buttonColor,
          '--health-button-text': buttonTextColor,
          '--health-accent': buttonColor,
          '--health-border': `${buttonColor}30`,
          '--health-glow': `${buttonColor}20`,
          '--health-card-bg': 'rgba(255, 255, 255, 0.9)',
          '--health-hover-bg': 'rgba(255, 255, 255, 0.95)',
          color: textColor,
          fontFamily: font || 'Nunito, Quicksand, sans-serif',
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div",
        { className: "bio-link-header" },
        HealthTheme.renderProfile && HealthTheme.renderProfile(props)
      ),
      HealthTheme.renderLinks && HealthTheme.renderLinks(props),
      HealthTheme.renderSocial && HealthTheme.renderSocial(props)
    );
  }
};

export default HealthTheme;
