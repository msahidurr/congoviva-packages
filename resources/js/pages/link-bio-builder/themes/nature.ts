import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

const defaults = {
  name: t('Green Earth Maya'),
  tagline: t('Environmental Advocate & Nature Lover'),
  email: t('maya@greenearth.org'),
  phone: t('+1 (555) 123-4567'),
  description: t('Protecting our planet through awareness and action. Join the movement for a sustainable future.'),
  links: [
    { text: 'Eco Tips', url: '#', description: t('Sustainable living'), icon: '' },
    { text: 'Nature Photography', url: '#', description: t('Beautiful landscapes'), icon: '' },
    { text: 'Conservation Projects', url: '#', description: t('Make a difference'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'twitter', url: '#', icon: '' },
    { platform: 'linkedin', url: '#', icon: '' }
  ]
};

const NatureTheme: ThemeType = {
  name: 'Nature',
  layout: 'organic',
  buttonStyle: 'leaf',
  socialPosition: 'branch',
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
      placeholder: t('Enter a nature-inspired tagline'),
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
      label: t('Location'),
      type: 'text',
      placeholder: t('Enter your location'),
      required: false,
      section: t('Additional Details'),
      cols: 1
    },
    {
      name: 'email',
      label: t('Nature Email'),
      type: 'email',
      placeholder: t('Enter your nature email'),
      defaultValue: defaults.email,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'phone',
      label: t('Nature Phone'),
      type: 'tel',
      placeholder: t('Enter your nature phone'),
      defaultValue: defaults.phone,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('About Me'),
      type: 'textarea',
      placeholder: t('Tell people about yourself and your connection to nature'),
      defaultValue: defaults.description,
      required: false,
      section: t('Additional Details'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Nature theme styling */
    .bio-link-container.nature-theme {
      position: relative;
      font-family: 'Quicksand', sans-serif;
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }

    /* Organic background pattern */
    .nature-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
      z-index: 0;
      pointer-events: none;
    }

    /* Floating leaves */
    .nature-theme .floating-leaf {
      position: absolute;
      width: 30px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.15;
      pointer-events: none;
      z-index: 1;
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
    }

    .nature-theme .leaf-1 {
      top: 10%;
      left: 10%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20a4,4,0,0,0,4-4,4,4,0,0,0-4-4,4.18,4.18,0,0,0-1.26.2c1.81-2.5,5.69-4.23,10.26-4.2C17,8,17,8,17,8Z'/%3E%3C/svg%3E");
      animation: floatLeaf 20s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
    }

    .nature-theme .leaf-2 {
      top: 20%;
      right: 15%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20a4,4,0,0,0,4-4,4,4,0,0,0-4-4,4.18,4.18,0,0,0-1.26.2c1.81-2.5,5.69-4.23,10.26-4.2C17,8,17,8,17,8Z'/%3E%3C/svg%3E");
      transform: rotate(120deg);
      animation: floatLeaf 25s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) reverse;
    }

    .nature-theme .leaf-3 {
      bottom: 15%;
      left: 20%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20a4,4,0,0,0,4-4,4,4,0,0,0-4-4,4.18,4.18,0,0,0-1.26.2c1.81-2.5,5.69-4.23,10.26-4.2C17,8,17,8,17,8Z'/%3E%3C/svg%3E");
      transform: rotate(240deg);
      animation: floatLeaf 30s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
    }

    .nature-theme .leaf-4 {
      bottom: 25%;
      right: 10%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20a4,4,0,0,0,4-4,4,4,0,0,0-4-4,4.18,4.18,0,0,0-1.26.2c1.81-2.5,5.69-4.23,10.26-4.2C17,8,17,8,17,8Z'/%3E%3C/svg%3E");
      transform: rotate(60deg);
      animation: floatLeaf 22s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) reverse;
    }

    /* Additional leaves for more organic feel */
    .nature-theme .leaf-5 {
      top: 40%;
      left: 5%;
      width: 20px;
      height: 20px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20a4,4,0,0,0,4-4,4,4,0,0,0-4-4,4.18,4.18,0,0,0-1.26.2c1.81-2.5,5.69-4.23,10.26-4.2C17,8,17,8,17,8Z'/%3E%3C/svg%3E");
      transform: rotate(180deg);
      animation: floatLeaf 28s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
    }

    .nature-theme .leaf-6 {
      top: 60%;
      right: 5%;
      width: 25px;
      height: 25px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Cpath d='M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20a4,4,0,0,0,4-4,4,4,0,0,0-4-4,4.18,4.18,0,0,0-1.26.2c1.81-2.5,5.69-4.23,10.26-4.2C17,8,17,8,17,8Z'/%3E%3C/svg%3E");
      transform: rotate(300deg);
      animation: floatLeaf 26s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95) reverse;
    }

    /* Header styling */
    .nature-theme .bio-link-header {
      position: relative;
      padding: 2.5rem 1.5rem 1.5rem;
      text-align: center;
      z-index: 2;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      margin: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    /* Profile image styling */
    .nature-theme .bio-link-profile {
      width: 120px !important;
      height: 120px !important;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1rem;
      border: 4px solid var(--button-color, rgba(255, 255, 255, 0.3));
      position: relative;
      z-index: 2;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }



    /* Name styling */
    .nature-theme .bio-link-title {
      font-size: 1.85rem;
      font-weight: 700;
      position: relative;
      display: inline-block;
      letter-spacing: -0.01em;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      color: var(--text-color, #FFFFFF);
    }

    /* Organic underline for name */
    .nature-theme .bio-link-title::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      height: 2px;
      background: linear-gradient(90deg, transparent, currentColor, transparent);
      opacity: 0.6;
      transition: width 0.4s ease, opacity 0.4s ease;
    }

    /* Title hover effect */
    .nature-theme .bio-link-title:hover::after {
      width: 100%;
      opacity: 0.8;
    }

    /* Description styling */
    .nature-theme .bio-link-description {
      font-size: 1.05rem;
      opacity: 0.95;
      max-width: 85%;
      margin: 1.25rem auto ;
      line-height: 1.6;
      font-weight: 500;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
      color: var(--text-color, #FFFFFF);
    }

    /* Profile fields styling */
    .nature-theme .profile-field {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .nature-theme .profile-field:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12) !important;
    }

    .nature-theme .profile-field-icon {
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .nature-theme .profile-field:hover .profile-field-icon {
      transform: scale(1.1);
    }

    /* Links container */
    .nature-theme .links-container {
      padding: 1.5rem;
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      max-width: 93%;
      margin: 1rem auto;
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(20px);
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    /* Link button styling */
    .nature-theme .bio-link-button {
      position: relative;
      padding: 0.85rem 1.5rem;
      background: var(--button-color);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      display: flex;
      align-items: center;
      font-weight: 500;
    }

    /* Leaf shape for buttons */




    .nature-theme .bio-link-button:hover::before {
      width: 6px;
      opacity: 0.8;
    }

    /* Link icon */
    .nature-theme .bio-link-button .link-icon {
      width: 2.25rem;
      height: 2.25rem;
      margin-right: 1.25rem;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .nature-theme .bio-link-button .link-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .nature-theme .bio-link-button:hover .link-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
    }

    .nature-theme .bio-link-button:hover .link-icon img {
      transform: scale(1.1);
    }

    /* Link text */
    .nature-theme .bio-link-button .link-text {
      flex: 1;
    }

    .nature-theme .bio-link-button .link-title {
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: 0.01em;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      color: var(--button-text-color, #FFFFFF);
    }

    .nature-theme .bio-link-button .link-description {
      font-size: 0.85rem;
      opacity: 0.9;
      margin-top: 0.25rem;
      font-weight: 500;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      color: var(--button-text-color, #FFFFFF);
    }

    /* Arrow icon */
    .nature-theme .bio-link-button .arrow-icon {
      margin-left: 0.85rem;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .nature-theme .bio-link-button:hover .arrow-icon {
      transform: translateX(4px);
      opacity: 1;
    }

    /* Social icons section */
    .nature-theme .social-container {
      position: relative;
      z-index: 2;
    }

    /* Branch layout for social icons */
    .nature-theme .social-branch {
      display: flex;
      justify-content: center;
      position: relative;
      padding-top: 0.5rem;
    }

    /* Branch line */
    .nature-theme .social-branch::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 1.75rem;
      background: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
    }

    /* Social icons */
    .nature-theme .social-icons {
      display: flex;
      gap: 0.85rem;
      position: relative;
      flex-wrap: wrap;
      justify-content: center;
    }



    /* Social icon styling */
    .nature-theme .social-icon {
      width: 2.75rem;
      height: 2.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
    }

    /* Fix for social icons */
    .nature-theme .social-icon svg {
      width: 16px;
      height: 16px;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
    }

    /* Social icon hover effect */
    .nature-theme .social-icon:hover {
      transform: translateY(-5px) scale(1.1);
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2), 0 6px 15px var(--button-color);
    }

    /* Social icon glow effect */
    .nature-theme .social-icon::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1;
    }

    .nature-theme .social-icon:hover::after {
      opacity: 1;
    }

    /* Footer */
    .nature-theme .nature-footer {
      padding: 1.25rem;
      text-align: center;
      font-size: 0.85rem;
      opacity: 1;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      letter-spacing: 0.02em;
      font-weight: 600;
      color: var(--text-color, #FFFFFF);
      background: #rgba(0, 0, 0, 0.25) !important;
      backdrop-filter: blur(5px);
      border-radius: 12px;
    }

    /* Animations */
    @keyframes floatLeaf {
      0% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(10px, 10px) rotate(90deg); }
      50% { transform: translate(0, 20px) rotate(180deg); }
      75% { transform: translate(-10px, 10px) rotate(270deg); }
      100% { transform: translate(0, 0) rotate(360deg); }
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .nature-theme .bio-link-profile {
      animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .nature-theme .bio-link-title {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.1s;
    }

    .nature-theme .bio-link-description {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.2s;
    }

    .nature-theme .bio-link-button {
      animation: slideInRight 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.3s);
    }

    .nature-theme .social-icon {
      animation: fadeIn 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.5s);
    }
  `,
  colorPresets: [
    {
      name: 'Forest Green',
      background: {
        type: 'image',
        color: '#B9891C',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop'
      },
      buttonColor: '#B9891C',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Ocean Depths',
      background: {
        type: 'image',
        color: '#B9631B',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop'
      },
      buttonColor: '#B9631B',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Autumn Leaves',
      background: {
        type: 'image',
        color: '#73946B',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        image: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1200&h=800&fit=crop'
      },
      buttonColor: '#73946B',
      buttonTextColor: '#FFFFFF',
      textColor: '#000000'
    },
    {
      name: 'Spring Bloom',
      background: {
        type: 'image',
        color: '#3D90D7',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&h=800&fit=crop'
      },
      buttonColor: '#3D90D7',
      buttonTextColor: '#FFFFFF',
      textColor: '#000000'
    },
    {
      name: 'Desert Sunset',
      background: {
        type: 'image',
        color: '#B83B6D',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&h=800&fit=crop'
      },
      buttonColor: '#B83B6D',
      buttonTextColor: '#FFFFFF',
      textColor: '#000000'
    }
  ],
  font: 'Quicksand, sans-serif',
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

    return React.createElement(
      React.Fragment,
      null,
      /* Floating leaves */
      React.createElement("div", { className: "floating-leaf leaf-1" }),
      React.createElement("div", { className: "floating-leaf leaf-2" }),
      React.createElement("div", { className: "floating-leaf leaf-3" }),
      React.createElement("div", { className: "floating-leaf leaf-4" }),
      React.createElement("div", { className: "floating-leaf leaf-5" }),
      React.createElement("div", { className: "floating-leaf leaf-6" }),

      /* Profile image */
      header.profile_image ?
        React.createElement("div", { className: "bio-link-profile" },
          React.createElement("img", { src: getDisplayUrl(header.profile_image), alt: displayName, className: "w-full h-full object-cover" })
        ) :
        React.createElement("div", { className: "bio-link-profile flex items-center justify-center text-xl font-bold" },
          displayName.charAt(0)
        ),

      /* Name and tagline */
      React.createElement("h1", { className: "bio-link-title" }, displayName),
      React.createElement("p", { className: "bio-link-description" }, displayTagline),

      /* Location if available */
      header.location && React.createElement("div", {
        className: "mt-4 flex items-center justify-center gap-2 text-sm profile-field",
        style: { textDecoration: 'none',
          padding: '0.75rem 1.25rem',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1rem',
          margin: '0 auto',
          border: `1px solid rgba(255, 255, 255, 0.25)`,
          fontWeight: 600,
          position: 'relative',
          zIndex: 5,
          color: buttonTextColor,
        }
      },
        React.createElement("div", {
          className: "profile-field-icon",
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: buttonColor || 'rgba(255, 255, 255, 0.2)',
          }
        },
          React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: buttonTextColor,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          },
            React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
            React.createElement("circle", { cx: "12", cy: "10", r: "3" })
          )
        ),
        header.location
      ),

      /* Contact information */
      (displayEmail || displayPhone) && React.createElement("div", {
        className: "mt-4 flex flex-col items-center gap-2",
        style: { textDecoration: 'none', opacity: 0.9 }
      },
        displayEmail && React.createElement("div", {
          className: "flex items-center gap-2 text-sm",
          style: { textDecoration: 'none',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
          }
        },
          React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "14",
            height: "14",
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
          className: "flex items-center gap-2 text-sm",
          style: { textDecoration: 'none',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            borderRadius: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
          }
        },
          React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "14",
            height: "14",
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
        )
      ),

      /* Description if available */
      displayDescription && React.createElement("div", {
        className: "mt-5 text-sm profile-field",
        style: { textDecoration: 'none',
          padding: '1.25rem',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(15px)',
          borderRadius: '1rem',
          margin: '1rem auto 0',
          border: `1px solid rgba(255, 255, 255, 0.25)`,
          lineHeight: 1.7,
          position: 'relative',
          zIndex: 5,
          color: buttonTextColor,
          fontWeight: 500,
        }
      },
        React.createElement("div", {
          className: "profile-field-icon",
          style: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem',
            fontWeight: 600,
            fontSize: '0.95rem'
          }
        },
          React.createElement("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: buttonTextColor,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: { textDecoration: 'none', marginRight: '0.5rem' }
          },
            React.createElement("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement("polyline", { points: "14 2 14 8 20 8" }),
            React.createElement("line", { x1: "16", y1: "13", x2: "8", y2: "13" }),
            React.createElement("line", { x1: "16", y1: "17", x2: "8", y2: "17" }),
            React.createElement("polyline", { points: "10 9 9 9 8 9" })
          ),
          t("About Me")
        ),
        React.createElement("div", { style: { textDecoration: 'none', fontStyle: 'normal', textAlign: 'start', } }, displayDescription)
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
      React.createElement("div", { className: "social-branch" },
        React.createElement("div", { className: "social-icons" },
          displaySocial.map((item, index) =>
            item.platform &&
              React.createElement("a", {
                key: index,
                href: item.url || "#", target: "_blank", rel: "noopener noreferrer",
                className: "social-icon",
                style: { textDecoration: 'none', "--index": index } as React.CSSProperties
              },
                React.createElement(SocialIcon, {
                  platform: item.platform,
                  color: buttonTextColor
                })
              )
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
        { className: "text-center p-4 opacity-70 text-sm rounded-lg bg-white/10 backdrop-blur-md" },
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
          style: { textDecoration: 'none', "--index": index } as React.CSSProperties
        },
          link.icon &&
            React.createElement("div", { className: "link-icon" },
              React.createElement("img", { src: getDisplayUrl(link.icon), alt: "" })
            ),
          React.createElement("div", { className: "link-text" },
            React.createElement("div", { className: "link-title" }, link.text || 'Untitled Link'),
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
              stroke: buttonTextColor,
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
    const { data, textColor, buttonColor, buttonTextColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop';

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
        className: "nature-theme",
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
        { className: "bio-link-header" },
        NatureTheme.renderProfile && NatureTheme.renderProfile(props)
      ),
      NatureTheme.renderLinks && NatureTheme.renderLinks(props),
      NatureTheme.renderSocial && NatureTheme.renderSocial(props),
      data.config.copyright?.enabled !== false && React.createElement("div", {
        className: "nature-footer-container",
        style: {
          padding: '1.5rem 1.75rem 0'
        }
      },
        React.createElement("div", {
          className: "nature-footer",
          style: {
            position: 'relative',
            bottom: 0,
            width: '100%',
          }
        },
          data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.displayName}. All rights reserved.`
        )
      )
    );
  }
};

export default NatureTheme;
