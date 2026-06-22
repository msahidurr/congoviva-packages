import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';
const defaults = {
  name: t('Chef Marco'),
  tagline: t('Culinary Artist & Food Blogger'),
  description: t('Passionate about creating delicious experiences. Sharing recipes, restaurant reviews, and culinary adventures.'),
  links: [
    { text: 'Recipe Collection', url: '#', description: t('Try my recipes'), icon: '' },
    { text: 'Restaurant Reviews', url: '#', description: t('Best dining spots'), icon: '' },
    { text: 'Cooking Classes', url: '#', description: t('Learn to cook'), icon: '' }
  ],
  social: [
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'youtube', url: '#', icon: '' },
    { platform: 'pinterest', url: '#', icon: '' }
  ]
};

const FoodTheme: ThemeType = {
  name: 'Food',
  layout: 'masonry',
  buttonStyle: 'soft',
  socialPosition: 'bottom',
  profileStyle: 'circle',
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
      placeholder: t('Enter your food tagline (e.g. Chef, Food Blogger)'),
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
      placeholder: t('Italian Cuisine, Pastry, Vegan Cooking (separate with commas)'),
      required: false,
      section: t('Culinary Details'),
      cols: 1
    },
    {
      name: 'experience',
      label: t('Experience'),
      type: 'text',
      placeholder: t('Enter your years of experience'),
      required: false,
      section: t('Culinary Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Bio'),
      type: 'textarea',
      placeholder: t('Tell people about your culinary journey'),
       defaultValue: defaults.description,
      required: false,
      section: t('Culinary Details'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Food Theme - Delicious & Appetizing */
    .bio-link-container.food-theme {
      position: relative;
      font-family: 'Lato', 'Open Sans', sans-serif;
      overflow: hidden;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      background-color: #FFFFFF;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Background overlay for readability */
    .bio-link-container.food-theme::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    /* Subtle food pattern overlay */
    .food-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      opacity: 0.5;
      z-index: 0;
    }

    /* Decorative elements */
    .food-theme .food-icon {
      position: absolute;
      opacity: 0.08;
      z-index: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .food-theme .food-icon-1 {
      top: 10%;
      right: 10%;
      width: 40px;
      height: 40px;
      animation: float 8s infinite ease-in-out;
    }

    .food-theme .food-icon-2 {
      bottom: 15%;
      left: 10%;
      width: 50px;
      height: 50px;
      animation: float 10s infinite ease-in-out reverse;
    }

    .food-theme .food-icon-3 {
      top: 40%;
      left: 5%;
      width: 35px;
      height: 35px;
      animation: float 9s infinite ease-in-out;
      animation-delay: 1s;
    }

    .food-theme .food-icon-4 {
      bottom: 30%;
      right: 8%;
      width: 45px;
      height: 45px;
      animation: float 11s infinite ease-in-out reverse;
      animation-delay: 2s;
    }

    /* Header styling */
    .food-theme .bio-link-header {
      position: relative;
      padding: 3rem 2rem 2rem;
      text-align: center;
      z-index: 3;
      background: transparent;
      backdrop-filter: none;
      border-bottom: none;
    }

    /* Profile image styling */
    .food-theme .bio-link-profile {
      width: 130px !important;
      height: 130px !important;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 1.5rem;
      position: relative;
      z-index: 2;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }



    /* Name styling */
    .food-theme .bio-link-title {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: var(--text-color, #FFFFFF);
      position: relative;
      display: inline-block;
      letter-spacing: -0.01em;
    }



    /* Tagline styling */
    .food-theme .bio-link-tagline {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color, #FFFFFF);
      opacity: 1;
    }

    /* Enhanced Culinary Section */
    .food-theme .enhanced-culinary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin: 2rem auto;
      max-width: 600px;
      padding: 0 1rem;
    }

    .food-theme .culinary-card {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
      min-height: 180px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .food-theme .culinary-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: currentColor;
      opacity: 0.3;
    }

    .food-theme .culinary-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
      background: rgba(0, 0, 0, 0.4);
    }

    .food-theme .culinary-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      transition: all 0.4s ease;
    }

    .food-theme .culinary-card:hover .culinary-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .food-theme .culinary-content {
      text-align: center;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0;
    }

    .food-theme .culinary-label {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: #FFFFFF;
      width: 100%;
      min-height: 1.2rem;
      display: block;
      text-align: center;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .food-theme .culinary-value {
      font-size: 1.1rem;
      font-weight: 800;
      line-height: 1.3;
      color: #FFFFFF;
      width: 100%;
      min-height: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* Specialty Tags */
    .food-theme .specialty-tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      margin: 0.25rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      border: 1px solid #ffffff;
      transition: all 0.3s ease;
    }

    .food-theme .specialty-tag:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    /* Description styling */
    .food-theme .bio-link-description {
      font-size: 1rem;
      opacity: 1;
      max-width: 85%;
      margin: 1.5rem auto 0;
      line-height: 1.7;
      position: relative;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      color: #333333;
      font-weight: 500;
    }

    /* Quote marks for description */
    .food-theme .bio-link-description::before,
    .food-theme .bio-link-description::after {
      content: '"';
      position: absolute;
      font-size: 3rem;
      font-family: Georgia, serif;
      line-height: 1;
      opacity: 0.2;
    }

    .food-theme .bio-link-description::before {
      top: 0.5rem;
      left: 0.5rem;
    }

    .food-theme .bio-link-description::after {
      bottom: -0.5rem;
      right: 0.5rem;
    }

    /* Links container */
    .food-theme .links-container {
      padding: 2rem;
      position: relative;
      z-index: 3;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Link button styling - Recipe card style */
    .food-theme .bio-link-button {
      position: relative;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 16px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(0, 0, 0, 0.05);
      height: 100%;
      backdrop-filter: blur(10px);
    }

    /* Link button hover effect */


    /* Link image */
    .food-theme .bio-link-button .link-image {
      width: 100%;
      height: 180px;
      overflow: hidden;
      position: relative;
    }

    .food-theme .bio-link-button .link-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .food-theme .bio-link-button:hover .link-image img {
      transform: scale(1.1);
    }

    /* Link content */
    .food-theme .bio-link-button .link-content {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      color: var(--links-text-color, #000000) !important;
    }

    .food-theme .bio-link-button .link-title {
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: -0.01em;
      margin-bottom: 0.5rem;
      color: var(--links-text-color, #000000) !important;
    }

    .food-theme .bio-link-button .link-description {
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--links-text-color, #000000) !important;
    }

    /* Link button */
    .food-theme .bio-link-button .link-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      background: var(--button-color, currentColor);
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      margin-top: auto;
      transition: all 0.3s ease;
      color: #FFFFFF;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1), 0 2px 6px var(--button-color, rgba(0, 0, 0, 0.1));
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .food-theme .bio-link-button:hover .link-button {
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15), 0 3px 8px var(--button-color, rgba(0, 0, 0, 0.15));
    }

    /* Recipe meta info */
    .food-theme .recipe-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .food-theme .recipe-stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .food-theme .recipe-stat-icon {
      width: 16px;
      height: 16px;
      opacity: 0.8;
    }

    /* Social icons section */
    .food-theme .social-container {
      padding: 2rem;
      position: relative;
      z-index: 3;
      text-align: center;
      border-top: none;
      background: transparent;
      backdrop-filter: none;
    }

    .food-theme .social-title {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 1;
      margin-bottom: 1.25rem;
      font-weight: 700;
      color: var(--text-color, #FFFFFF);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    .food-theme .social-icons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* Social icon styling */
    .food-theme .social-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    }

    /* Fix for social icons */
    .food-theme .social-icon svg {
      width: 18px;
      height: 18px;
      position: relative;
      z-index: 2;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Social icon hover effect */
    .food-theme .social-icon:hover {
      transform: translateY(-5px) rotate(8deg);
      background: var(--button-color, currentColor);
      border-color: transparent;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 12px var(--button-color, rgba(0, 0, 0, 0.1));
    }

    .food-theme .social-icon:hover svg {
      transform: scale(1.2);
      color: #FFFFFF !important;
      fill: #FFFFFF !important;
    }

    .food-theme .social-icon svg {
      color: var(--button-color, #333333) !important;
      fill: var(--button-color, #333333) !important;
    }

    /* Footer */
    .food-theme .food-footer {
      padding: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      opacity: 1;
      border-top: none;
      background: transparent;
      backdrop-filter: none;
      font-weight: 600;
      color: var(--text-color, #FFFFFF);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9);
      position: relative;
      z-index: 3;
      margin-top: 2rem;
    }

    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .food-theme .bio-link-profile {
      animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .food-theme .bio-link-title,
    .food-theme .bio-link-tagline {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.2s;
    }

    .food-theme .culinary-stat {
      animation: fadeIn 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.4s);
    }

    .food-theme .bio-link-description {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.5s;
    }

    .food-theme .bio-link-button {
      animation: slideInUp 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.6s);
    }

    .food-theme .social-icon {
      animation: scaleIn 0.5s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.8s);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .food-theme .bio-link-profile {
        width: 110px !important;
        height: 110px !important;
      }

      .food-theme .bio-link-title {
        font-size: 1.75rem;
      }

      .food-theme .bio-link-description {
        max-width: 95%;
        padding: 1.25rem;
      }

      .food-theme .enhanced-culinary-section {
        grid-template-columns: 1fr;
        gap: 1rem;
        margin: 1.5rem auto;
        padding: 0 0.5rem;
      }

      .food-theme .culinary-card {
        padding: 1.25rem;
      }

      .food-theme .culinary-icon {
        width: 50px;
        height: 50px;
      }

      .food-theme .specialty-tag {
        font-size: 0.8rem;
        padding: 0.2rem 0.6rem;
        margin: 0.2rem;
      }

      .food-theme .links-container {
        grid-template-columns: 1fr;
        padding: 1.5rem;
      }
    }
  `,
  colorPresets: [
    {
      name: 'Spicy Orange',
      background: {
        type: 'image',
        color: '#C0392B',
        gradient: 'linear-gradient(135deg, #FFFFFF, #FFF0E5)',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop'
      },
      buttonColor: '#C0392B',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Fresh Mint',
      background: {
        type: 'image',
        color: '#F39C12',
        gradient: 'linear-gradient(135deg, #FFFFFF, #ECFDF5)',
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&h=800&fit=crop'
      },
      buttonColor: '#F39C12',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Berry Purple',
      background: {
        type: 'image',
        color: '#347433',
        gradient: 'linear-gradient(135deg, #FFFFFF, #F5F3FF)',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
      },
      buttonColor: '#347433',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Tomato Red',
      background: {
        type: 'image',
        color: '#2980B9',
        gradient: 'linear-gradient(135deg, #FFFFFF, #FEF2F2)',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1200&h=800&fit=crop'
      },
      buttonColor: '#2980B9',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Olive Green',
      background: {
        type: 'image',
        color: '#E67514',
        gradient: 'linear-gradient(135deg, #FFFFFF, #F7FEE7)',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=800&fit=crop'
      },
      buttonColor: '#E67514',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Lato, Open Sans, sans-serif',
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
      /* Decorative food icons */
      React.createElement("div", {
        className: "food-icon food-icon-1",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" })
        )
      ),
      React.createElement("div", {
        className: "food-icon food-icon-2",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M12 3L4 9v12h16V9l-8-6zm.5 11.25c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" })
        )
      ),
      React.createElement("div", {
        className: "food-icon food-icon-3",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z" })
        )
      ),
      React.createElement("div", {
        className: "food-icon food-icon-4",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M2 19h20l-2 2H4l-2-2zM5 6h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h14c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1z" })
        )
      ),

      /* Profile image */
      header.profile_image ?
        React.createElement("div", { className: "bio-link-profile" },
          React.createElement("img", { src: getDisplayUrl(header.profile_image), alt: displayName, className: "w-full h-full object-cover" })
        ) :
        React.createElement("div", {
          className: "bio-link-profile flex items-center justify-center text-xl font-bold",
          style: { textDecoration: 'none', background: buttonColor, color: textColor || '#FFFFFF' }
        }, displayName.charAt(0)),

      /* Name and tagline */
      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),

      /* Enhanced Culinary details */
      (header.specialty || header.experience) && React.createElement("div", {
        className: "enhanced-culinary-section"
      },
        header.specialty && React.createElement("div", {
          className: "culinary-card specialty-card",
          style: { textDecoration: 'none', "--index": 0 } as React.CSSProperties
        },
          React.createElement("div", {
            className: "culinary-icon",
            style: { backgroundColor: `${buttonColor}`, color: textColor }
          },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            },
              React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })
            )
          ),
          React.createElement("div", { className: "culinary-content" },
            React.createElement("div", { className: "culinary-label" }, t("Specialty")),
            React.createElement("div", {
              className: "culinary-value",
              style: { color: textColor }
            },
              (() => {
                // Handle comma-separated specialties
                const specialties = header.specialty.split(/[,;]|\s{2,}/).filter(s => s.trim());
                if (specialties.length > 1) {
                  return specialties.map((specialty, index) =>
                    React.createElement("span", {
                      key: index,
                      className: "specialty-tag",
                      style: { backgroundColor: `${buttonColor}15`, color: textColor }
                    }, specialty.trim())
                  );
                }
                return header.specialty;
              })()
            )
          )
        ),

        header.experience && React.createElement("div", {
          className: "culinary-card experience-card",
          style: { textDecoration: 'none', "--index": 1 } as React.CSSProperties
        },
          React.createElement("div", {
            className: "culinary-icon",
            style: { backgroundColor: `${buttonColor}`, color: textColor }
          },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            },
              React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
              React.createElement("polyline", { points: "12 6 12 12 16 14" })
            )
          ),
          React.createElement("div", { className: "culinary-content" },
            React.createElement("div", { className: "culinary-label" }, t("Experience")),
            React.createElement("div", {
              className: "culinary-value",
              style: { color: textColor }
            }, header.experience)
          )
        )
      ),

      /* Description */
      displayDescription && React.createElement("p", { className: "bio-link-description" }, displayDescription)
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
      React.createElement("div", { className: "social-title" }, t("Connect & Follow")),
      React.createElement("div", { className: "social-icons" },
        displaySocial.map((item, index) =>
          item.platform &&
            React.createElement("a", {
              key: index,
              href: item.url || "#", target: "_blank", rel: "noopener noreferrer",
              className: "social-icon",
              style: { textDecoration: 'none', "--index": index, color: buttonColor } as React.CSSProperties
            },
              React.createElement(SocialIcon, {
                platform: item.platform,
                color: props.buttonTextColor || '#FFFFFF'
              })
            )
        )
      ),
      data.config.copyright?.enabled !== false && React.createElement("div", { className: "food-footer" },
        data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.displayName}. All rights reserved.`
      )
    );
  },

  renderLinks: (props: ThemeRenderProps) => {
    const { data, isPublic, buttonColor, textColor, buttonTextColor } = props;
    const { links } = data.config;
    
    const displayLinks = links && links.length > 0 ? links : defaults.links;

    // Default food images for when no custom image is provided
    const defaultFoodImages = [
      'https://picsum.photos/400/300?random=1', // Food 1
      'https://picsum.photos/400/300?random=2', // Food 2
      'https://picsum.photos/400/300?random=3', // Food 3
      'https://picsum.photos/400/300?random=4', // Food 4
      'https://picsum.photos/400/300?random=5', // Food 5
      'https://picsum.photos/400/300?random=6', // Food 6
      'https://picsum.photos/400/300?random=7', // Food 7
      'https://picsum.photos/400/300?random=8', // Food 8
    ];

    if (!displayLinks || !displayLinks.length) {
      return React.createElement(
        "div",
        { className: "text-center p-4 opacity-70 text-sm rounded-lg bg-white/10 backdrop-blur-md mx-auto my-4", style: { textDecoration: 'none', maxWidth: "600px" } },
        t("No recipes or links added yet")
      );
    }

    return React.createElement(
      "div",
      { className: "links-container" },
      displayLinks.map((link, index) => {
        // Use custom icon if available, otherwise use a default food image based on index
        const imageUrl = link.icon || defaultFoodImages[index % defaultFoodImages.length];

        return React.createElement("div", {
          key: index,
          className: "bio-link-button",
          style: {
            textDecoration: 'none',
            "--index": index,
            '--button-color': props.buttonColor
          } as React.CSSProperties
        },
          React.createElement("div", { className: "link-image" },
            React.createElement("img", {
              src: link.icon ? getDisplayUrl(link.icon) : imageUrl,
              alt: link.text || "Delicious Food",
              onError: (e) => {
                (e.target as HTMLImageElement).src = defaultFoodImages[0];
              }
            })
          ),
          React.createElement("div", { className: "link-content" },
            React.createElement("div", { className: "link-title" }, link.text || t("Delicious Recipe")),
            link.description &&
              React.createElement("div", { className: "link-description" }, link.description),
            React.createElement("div", {
              className: "recipe-meta"
            }
            ),
            React.createElement("a", {
              key: index,
              href: link.url || "#", target: "_blank", rel: "noopener noreferrer",
              className: "link-button",
              style: {
                textDecoration: 'none',
                background: buttonColor,
                '--button-color': buttonColor
              }
            }, "View Recipe")
          )
        );
      })
    );
  },

  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop';

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
        className: "bio-link-container food-theme",
        style: {
          color: textColor,
          fontFamily: font,
          '--button-color': buttonColor,
          '--text-color': textColor,
          '--links-text-color': '#000000',
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div",
        { className: "bio-link-header" },
        FoodTheme.renderProfile && FoodTheme.renderProfile(props)
      ),
      FoodTheme.renderLinks && FoodTheme.renderLinks(props),
      FoodTheme.renderSocial && FoodTheme.renderSocial(props)
    );
  }
};

export default FoodTheme;
