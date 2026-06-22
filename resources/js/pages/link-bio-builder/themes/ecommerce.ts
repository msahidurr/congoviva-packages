import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';

const defaults = {
  name: t('ShopSmart Store'),
  tagline: t('Quality Products, Great Prices'),
  description: t('Your one-stop shop for premium products at unbeatable prices. Fast shipping and excellent customer service.'),
  links: [
    { text: 'Shop Now', url: '#', description: t('Browse our catalog'), icon: '' },
    { text: 'New Arrivals', url: '#', description: t('Latest products'), icon: '' },
    { text: 'Customer Support', url: '#', description: t('We are here to help'), icon: '' }
  ],
  social: [
    { platform: 'facebook', url: '#', icon: '' },
    { platform: 'instagram', url: '#', icon: '' },
    { platform: 'twitter', url: '#', icon: '' }
  ]
};

const EcommerceTheme: ThemeType = {
  name: 'Ecommerce',
  layout: 'standard',
  buttonStyle: 'soft',
  socialPosition: 'top',
  profileStyle: 'square',
  profileFields: [
    {
      name: 'name',
      label: t('Store Name'),
      type: 'text',
      placeholder: t('Enter your store name'),
       defaultValue: defaults.name,
      required: true,
      section: t('Store Details'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Tagline'),
      type: 'text',
      placeholder: t('Enter your store tagline'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Store Details'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Store Logo'),
      type: 'image',
      placeholder: t('Upload your store logo'),
      required: false,
      section: t('Store Details'),
      cols: 2
    },
    {
      name: 'categories',
      label: t('Categories'),
      type: 'text',
      placeholder: t('Enter your main product categories'),
      required: false,
      section: t('Business Details'),
      cols: 1
    },
    {
      name: 'shipping',
      label: t('Shipping Info'),
      type: 'text',
      placeholder: t('Enter shipping information'),
      required: false,
      section: t('Business Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Store Description'),
      type: 'textarea',
      placeholder: t('Tell people about your store and products'),
      defaultValue: defaults.description,
      required: false,
      section: t('Business Details'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Ecommerce Theme - Modern & Professional Shop */
    .bio-link-container.ecommerce-theme {
      position: relative;
      font-family: 'Inter', 'Roboto', sans-serif;
      overflow: hidden;
      border-radius: 12px;
      border: 2px solid #F3F3F3;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      background-color: #FFFFFF;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Background overlay for readability */
    .bio-link-container.ecommerce-theme::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    /* Subtle pattern overlay */
    .ecommerce-theme::before {
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
    .ecommerce-theme .ecommerce-icon {
      position: absolute;
      opacity: 0.08;
      z-index: 1;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }

    .ecommerce-theme .cart-icon {
      top: 10%;
      right: 10%;
      width: 40px;
      height: 40px;
      animation: float 8s infinite ease-in-out;
    }

    .ecommerce-theme .tag-icon {
      bottom: 15%;
      left: 10%;
      width: 35px;
      height: 35px;
      animation: float 10s infinite ease-in-out reverse;
    }

    .ecommerce-theme .shop-icon {
      top: 40%;
      left: 5%;
      width: 30px;
      height: 30px;
      animation: float 9s infinite ease-in-out;
      animation-delay: 1s;
    }

    .ecommerce-theme .delivery-icon {
      bottom: 30%;
      right: 8%;
      width: 35px;
      height: 35px;
      animation: float 11s infinite ease-in-out reverse;
      animation-delay: 2s;
    }

    /* Header styling */
    .ecommerce-theme .bio-link-header {
      position: relative;
      padding: 2rem 1.5rem;
      text-align: center;
      z-index: 2;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    /* Transparent header when background image is set */
    .ecommerce-theme.has-bg-image .bio-link-header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(15px);
    }

    /* Store banner */
    .ecommerce-theme .store-banner {
      position: relative;
      height: 180px;
      margin: -2rem -1.5rem 1.5rem;
      background: linear-gradient(45deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ecommerce-theme .store-banner::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);
    }

    /* Profile image styling - Store logo */
    .ecommerce-theme .bio-link-profile {
      width: 100px !important;
      height: 100px !important;
      border-radius: 12px;
      overflow: hidden;
      margin: 0 auto 1.25rem;
      position: relative;
      z-index: 2;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      background: #FFFFFF;
    }


    /* Store name styling */
    .ecommerce-theme .bio-link-title {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      position: relative;
      display: inline-block;
      letter-spacing: -0.01em;
      color: var(--text-color, #FFFFFF);
    }

    /* Tagline styling */
    .ecommerce-theme .bio-link-tagline {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      opacity: 1;
      color: var(--text-color, #FFFFFF);
    }

    /* Store info sections */
    .ecommerce-theme .store-info-sections {
      position: relative;
      z-index: 2;
    }

    .ecommerce-theme .categories-section,
    .ecommerce-theme .shipping-section {
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .ecommerce-theme .categories-section:hover,
    .ecommerce-theme .shipping-section:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    }

    .ecommerce-theme .categories-list {
      max-height: none;
      overflow: visible;
    }

    .ecommerce-theme .categories-list span {
      transition: all 0.2s ease;
      cursor: default;
    }

    .ecommerce-theme .categories-list span:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* Description styling */
    .ecommerce-theme .bio-link-description {
      font-size: 0.95rem;
      opacity: 0.85;
      margin: 0 auto;
      line-height: 1.6;
      position: relative;
      padding: 1.25rem;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 8px;
      text-align:start;
    }

    /* Social icons section */
    .ecommerce-theme .social-container {
      padding: 1.5rem 1rem;
      position: relative;
      z-index: 2;
      text-align: center;
      margin-top: 1rem;
    }

    .ecommerce-theme .social-icons {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Social icon styling */
    .ecommerce-theme .social-icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--button-color, currentColor);
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    }

    /* Fix for social icons */
    .ecommerce-theme .social-icon svg {
      width: 16px;
      height: 16px;
      position: relative;
      z-index: 2;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      color: #FFFFFF !important;
    }

    /* Social icon hover effect */
    .ecommerce-theme .social-icon:hover {
      transform: translateY(-5px);
      background: var(--button-color, currentColor);
      border-color: transparent;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 12px var(--button-color, rgba(0, 0, 0, 0.1));
    }

    .ecommerce-theme .social-icon:hover svg {
      color: #FFFFFF !important;
    }

    .ecommerce-theme .social-icon:hover svg {
      transform: scale(1.2);
    }

    /* Links container */
    .ecommerce-theme .links-container {
      padding: 0.5rem 1.5rem 2.5rem;
      position: relative;
      z-index: 2;
      max-width: 650px;
      margin: 0 auto;
    }

    /* Product categories */
    .ecommerce-theme .product-categories {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      overflow-x: auto;
      padding: 0.5rem 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      justify-content: center;
    }

    .ecommerce-theme .product-categories::-webkit-scrollbar {
      display: none;
    }

    .ecommerce-theme .category-tab {
      padding: 0.75rem 1.25rem;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 25px;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      min-width: fit-content;
    }

    .ecommerce-theme .category-tab.active {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .ecommerce-theme .category-tab:hover:not(.active) {
      background: rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    /* Grid and List view styles */

    .ecommerce-theme .products-list {
      margin-bottom: 1.5rem;
    }

    .ecommerce-theme .bio-link-button.grid-view {
      display: flex;
      flex-direction: column;
      text-align: center;
    }

    .ecommerce-theme .bio-link-button.list-view {
      display: flex;
      flex-direction: row;
      text-align: left;
    }

    /* Link button styling - Product card style */
    .ecommerce-theme .bio-link-button {
      position: relative;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      overflow: hidden;
      display: flex;
      margin-bottom: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    /* Transparent link buttons when background image is set */
    .ecommerce-theme.has-bg-image .bio-link-button {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Link button hover effect */


    /* Product image */
    .ecommerce-theme .bio-link-button .product-image {
      width: 100px;
      height: 100px;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    .ecommerce-theme .bio-link-button .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }



    /* Product content */
    .ecommerce-theme .bio-link-button .product-content {
      padding: 1rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .ecommerce-theme .bio-link-button .product-title {
      font-weight: 700;
      font-size: 1rem;
      letter-spacing: -0.01em;
      margin-bottom: 0.25rem;
      color: var(--text-color, #333333);
    }

    .ecommerce-theme .bio-link-button .product-description {
      font-size: 0.85rem;
      opacity: 1;
      margin-bottom: 0.8rem;
      line-height: 1.4;
      color: var(--text-color, #666666);
      font-weight: 500;
    }

    /* Product price */
    .ecommerce-theme .bio-link-button .product-price {
      font-weight: 700;
      font-size: 1.1rem;
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .ecommerce-theme .bio-link-button .price-tag {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .ecommerce-theme .bio-link-button .original-price {
      font-size: 0.85rem;
      text-decoration: line-through;
      opacity: 0.6;
      font-weight: 400;
    }

    /* Shop now button */
    .ecommerce-theme .bio-link-button .shop-now {
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s ease;
      background: var(--button-color, currentColor);
      color: #FFFFFF;
    }



    /* Product badge */
    .ecommerce-theme .bio-link-button .product-badge {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: rgba(255, 59, 48, 0.9);
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      z-index: 2;
    }

    /* Footer */
    .ecommerce-theme .ecommerce-footer {
      padding: 1.5rem 0 0;
      text-align: center;
      font-size: 0.85rem;
      opacity: 1;
      border-top: none;
      font-weight: 600;
      color: var(--text-color, #FFFFFF);
      position: relative;
      z-index: 3;
      border-radius: 12px;
    }

    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
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

    .ecommerce-theme .bio-link-profile {
      animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .ecommerce-theme .bio-link-title,
    .ecommerce-theme .bio-link-tagline {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.2s;
    }

    .ecommerce-theme .categories-section,
    .ecommerce-theme .shipping-section {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.4s;
    }

    .ecommerce-theme .categories-list span {
      animation: scaleIn 0.5s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.6s);
    }

    .ecommerce-theme .bio-link-description {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.5s;
    }

    .ecommerce-theme .category-tab {
      animation: fadeIn 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.6s);
    }

    .ecommerce-theme .bio-link-button {
      animation: slideInUp 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.7s);
    }

    .ecommerce-theme .social-icon {
      animation: scaleIn 0.5s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.3s);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
      .ecommerce-theme .bio-link-profile {
        width: 80px !important;
        height: 80px !important;
      }

      .ecommerce-theme .bio-link-title {
        font-size: 1.5rem;
      }

      .ecommerce-theme .bio-link-description {
        max-width: 95%;
        padding: 1rem;
      }

      .ecommerce-theme .bio-link-button {
        flex-direction: column;
      }

      .ecommerce-theme .bio-link-button .product-image {
        width: 100%;
        height: 150px;
      }

      .ecommerce-theme .store-banner {
        height: 120px;
      }
    }
  `,
  colorPresets: [
    {
      name: 'Shop Blue',
      background: {
        type: 'image',
        color: '#FFC107',
        gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop'
      },
      buttonColor: '#FFC107',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Commerce Green',
      background: {
        type: 'image',
        color: '#DB5941',
        gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop'
      },
      buttonColor: '#DB5941',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Brand Orange',
      background: {
        type: 'image',
        color: '#9929EA',
        gradient: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop'
      },
      buttonColor: '#9929EA',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Premium Purple',
      background: {
        type: 'image',
        color: '#4D55CC',
        gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=800&fit=crop'
      },
      buttonColor: '#4D55CC',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Luxury Gold',
      background: {
        type: 'image',
        color: '#D76C82',
        gradient: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop'
      },
      buttonColor: '#D76C82',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Inter, Roboto, sans-serif',
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
      /* Decorative ecommerce icons */
      React.createElement("div", {
        className: "ecommerce-icon cart-icon",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" })
        )
      ),
      React.createElement("div", {
        className: "ecommerce-icon tag-icon",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" })
        )
      ),
      React.createElement("div", {
        className: "ecommerce-icon shop-icon",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" })
        )
      ),
      React.createElement("div", {
        className: "ecommerce-icon delivery-icon",
        style: { textDecoration: 'none', color: buttonColor }
      },
        React.createElement("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 24 24",
          fill: "currentColor"
        },
          React.createElement("path", { d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" })
        )
      ),

      /* Store logo */
      header.profile_image ?
        React.createElement("div", { className: "bio-link-profile" },
          React.createElement("img", { src:  getDisplayUrl(header.profile_image), alt: displayName, className: "w-full h-full object-cover" })
        ) :
        React.createElement("div", {
          className: "bio-link-profile flex items-center justify-center text-xl font-bold",
          style: { textDecoration: 'none', background: buttonColor, color: props.buttonTextColor }
        }, displayName.charAt(0)),

      /* Store name and tagline */
      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),

      /* Store info sections */
      (header.categories || header.shipping) && React.createElement("div", {
        className: "store-info-sections",
        style: {
          margin: '1.5rem 0',
        }
      },
        /* Categories section */
        header.categories && React.createElement("div", {
          className: "categories-section",
          style: {
            marginBottom: header.shipping ? '1.5rem' : '0',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }
        },
          React.createElement("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#FFFFFF',
              opacity: 1,
          
            }
          },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              style: { width: '16px', height: '16px', marginRight: '0.5rem' }
            },
              React.createElement("path", { d: "M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" })
            ),
            'Categories'
          ),
          React.createElement("div", {
            className: "categories-list",
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }
          },
            header.categories.split(',').map((cat: string) => cat.trim()).filter((cat: string) => cat.length > 0).map((category: string, index: number) =>
              React.createElement("span", {
                key: index,
                style: {
                  padding: '0.4rem 0.8rem',
                  background: buttonColor,
                  color: textColor,
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: `1px solid ${buttonColor}25`,
                  whiteSpace: 'nowrap'
                }
              },
                category
              )
            )
          )
        ),

        /* Shipping section */
        header.shipping && React.createElement("div", {
          className: "shipping-section",
          style: {
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.02)',
            borderRadius: '12px',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }
        },
          React.createElement("div", {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#FFFFFF',
              opacity: 1,
            }
          },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              fill: "currentColor",
              style: { width: '16px', height: '16px', marginRight: '0.5rem' }
            },
              React.createElement("path", { d: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" })
            ),
            t('Shipping & Delivery')
          ),
          React.createElement("div", {
            style: {
              fontSize: '0.9rem',
              lineHeight: '1.5',
              color: '#FFFFFF',
              textAlign: 'start',
            }
          },
            header.shipping
          )
        )
      ),

      /* Store description */
      displayDescription && React.createElement("p", {
        className: "bio-link-description",
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#333333',
          fontWeight: '500'
        }
      }, displayDescription)
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
        { className: "text-center p-4 opacity-70 text-sm rounded-lg bg-white/10 backdrop-blur-md mx-auto my-4", style: { textDecoration: 'none', maxWidth: "600px", color: '#FFFFFF', textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' } },
        "No products added yet"
      );
    }


    // Create a functional component for the links section
    const EcommerceLinksSection = () => {
      const [activeCategory, setActiveCategory] = React.useState(0);
      const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'list'

      // Filter links based on active category
      const getFilteredLinks = () => {
        if (activeCategory === 0) return links; // All
        if (activeCategory === 1) return links.slice(0, 3); // Featured (first 3)
        if (activeCategory === 2) return links.slice(-2); // New (last 2)
        if (activeCategory === 3) return links.filter((_, i) => i % 2 === 0); // Sale (every other)
        return links;
      };

      const filteredLinks = getFilteredLinks();

      return React.createElement(
        "div",
        { className: "links-container" },

        /* View toggle */
        React.createElement("div", {
          className: "view-toggle",
          style: {
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }
        },
          React.createElement("button", {
            onClick: () => setViewMode('grid'),
            style: {
              padding: '0.5rem 0.8rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'grid' ? buttonColor : 'rgba(255, 255, 255, 0.2)',
              color: viewMode === 'grid' ? buttonTextColor : '#FFFFFF',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }
          }, '⊞ Grid'),
          React.createElement("button", {
            onClick: () => setViewMode('list'),
            style: {
              padding: '0.5rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'list' ? buttonColor : 'rgba(255, 255, 255, 0.2)',
              color: viewMode === 'list' ? buttonTextColor : '#FFFFFF',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }
          }, '☰ List')
        ),

        /* Product cards */
        React.createElement("div", {
          className: `products-${viewMode}`,
          style: {
            display: viewMode === 'grid' ? 'grid' : 'flex',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'none',
            flexDirection: viewMode === 'list' ? 'column' : 'row',
            gap: '1rem'
          }
        },
          filteredLinks.map((link, index) =>
            React.createElement("div", {
              key: index,
              className: `bio-link-button ${viewMode}-view`,
              style: {
                textDecoration: 'none',
                "--index": index,
                flexDirection: viewMode === 'grid' ? 'column' : 'row',
                minHeight: viewMode === 'grid' ? '200px' : 'auto'
              } as React.CSSProperties
            },

              /* Product image - only show if icon exists */
              link.icon ? React.createElement("div", {
                className: "product-image",
                style: {
                  width: viewMode === 'grid' ? '100%' : '120px',
                  height: viewMode === 'grid' ? '150px' : '125px'
                }
              },
                React.createElement("img", { 
                  src: getDisplayUrl(link.icon),
                  alt: link.text || "Product",
                  style: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }
                })
              ) : null,

              /* Product content */
              React.createElement("div", {
                className: "product-content",
                style: { textAlign: viewMode === 'grid' ? 'center' : 'left' }
              },
                React.createElement("div", { className: "product-title", style: { color: '#FFFFFF', fontWeight: '700', textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' } }, link.text || 'Untitled Product'),
                link.description &&
                  React.createElement("div", { className: "product-description", style: { color: '#FFFFFF', textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)', opacity: '0.9' } }, link.description),

                /* Product price */
                React.createElement("div", {
                  className: "product-price",
                  style: { justifyContent: viewMode === 'grid' ? 'center' : 'space-between' }
                },

                  /* Shop now button */
                  React.createElement("a", {
                    key: index,
                    href: link.url || "#",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "shop-now",
                    style: { textDecoration: 'none', background: buttonColor, color: buttonTextColor }
                  }, t("Shop Now"))
                )
              )
            )
          )
        ),

        /* Footer */
        data.config.copyright?.enabled !== false && React.createElement("div", { className: "ecommerce-footer" },
          data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.displayName}. All rights reserved.`
        )
      );
    };

    return React.createElement(EcommerceLinksSection);
  },

  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;

    const hasBackgroundImage = background?.type === 'image' && background.image;

    const defaultImage = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop';

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
        className: `bio-link-container ecommerce-theme${hasBackgroundImage ? ' has-bg-image' : ''}`,
        style: {
          color: textColor,
          fontFamily: font || 'Inter, Roboto, sans-serif',
          '--button-color': buttonColor,
          '--button-text-color': props.buttonTextColor,
          '--text-color': textColor,
          ...backgroundStyle
        } as React.CSSProperties
      },
      React.createElement(
        "div",
        { className: "bio-link-header" },
        EcommerceTheme.renderProfile && EcommerceTheme.renderProfile(props)
      ),
      EcommerceTheme.renderSocial && EcommerceTheme.renderSocial(props),
      EcommerceTheme.renderLinks && EcommerceTheme.renderLinks(props)
    );
  }
};

export default EcommerceTheme;
