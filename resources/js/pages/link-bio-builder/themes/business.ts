import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { resolveDynamicImage, resolveImageForRendering } from '../../../utils/themeImageResolver';
import { t } from 'i18next';

// Default data for Business theme when user data is empty
const defaults = {
  name: t('Sarah Mitchell'),
  tagline: t('CEO & Business Strategist'),
  email: t('sarah@businesspro.com'),
  phone: t('+1 (555) 987-6543'),
  description: t('Leading innovative business solutions with 15+ years of experience in strategic planning and corporate growth.'),
  links: [
    { text: 'Our Services', url: '#', description: t('Explore our offerings'), icon: '' },
    { text: 'Schedule Meeting', url: '#', description: t('Book a consultation'), icon: '' },
    { text: 'Case Studies', url: '#', description: t('Success stories'), icon: '' }
  ],
  social: [
    { platform: 'linkedin', url: '#', icon: '' },
    { platform: 'twitter', url: '#', icon: '' }
  ]
};

const BusinessTheme: ThemeType = {
  name: 'Business',
  layout: 'card',
  buttonStyle: 'corporate',
  socialPosition: 'inline-code',
  profileStyle: 'editorial',
  profileFields: [
    {
      name: 'name',
      label: t('Business Name'),
      type: 'text',
      placeholder: t('Enter your business name'),
      defaultValue: defaults.name,
      required: true,
      section: t('Business Information'),
      cols: 1
    },
    {
      name: 'tagline',
      label: t('Business Tagline'),
      type: 'text',
      placeholder: t('Enter your business tagline or slogan'),
      defaultValue: defaults.tagline,
      required: false,
      section: t('Business Information'),
      cols: 1
    },
    {
      name: 'profile_image',
      label: t('Business Logo'),
      type: 'image',
      placeholder: t('Upload your business logo'),
      required: false,
      section: t('Business Information'),
      cols: 2
    },
    {
      name: 'email',
      label: t('Business Email'),
      type: 'email',
      placeholder: t('Enter your business email'),
      defaultValue: defaults.email,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'phone',
      label: t('Business Phone'),
      type: 'tel',
      placeholder: t('Enter your business phone'),
      defaultValue: defaults.phone,
      required: false,
      section: t('Contact Details'),
      cols: 1
    },
    {
      name: 'address',
      label: t('Business Address'),
      type: 'text',
      placeholder: t('Enter your business address'),
      required: false,
      section: t('Contact Details'),
      cols: 2
    },
    {
      name: 'description',
      label: t('Business Description'),
      type: 'textarea',
      placeholder: t('Enter a detailed description about your business'),
      defaultValue: defaults.description,
      required: false,
      section: t('About Business'),
      cols: 2,
      rows: 4
    },
    {
      name: 'hours',
      label: t('Business Hours'),
      type: 'textarea',
      placeholder: t('Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM\nSun: Closed'),
      required: false,
      section: t('Additional Information'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Premium Business Theme - Professional & Elegant */
    .bio-link-container.business-theme {
      position: relative;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: -0.01em;
      max-width: 100%;
      overflow: hidden;
      background: var(--theme-bg, #F8FAFC);
      color: var(--theme-text, #1E293B);
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    
    /* Dynamic color system */
    .business-theme {
      --theme-bg: var(--business-bg, #F8FAFC);
      --theme-text: #1E293B;
      --theme-button: var(--business-button, #2563EB);
      --theme-button-text: #FFFFFF;
      --theme-accent: var(--business-accent, var(--business-button, #2563EB));
      --theme-border: rgba(0, 0, 0, 0.08);
      --theme-card-bg: rgba(255, 255, 255, 0.95);
      --theme-hover-bg: rgba(255, 255, 255, 0.98);
    }
    
    /* Modern subtle background pattern */
    .bio-link-container.business-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(45deg, rgba(0, 0, 0, 0.02) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.02) 75%),
        linear-gradient(45deg, rgba(0, 0, 0, 0.02) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.02) 75%);
      background-size: 60px 60px;
      background-position: 0 0, 30px 30px;
      opacity: 0.5;
      z-index: 0;
      pointer-events: none;
    }
    
    /* Header styling for business theme */
    .business-theme .bio-link-header {
      position: relative;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      padding-top: 1rem;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      z-index: 1;
    }
    
    /* Modern Profile Card */
    .business-theme .modern-profile-card {
      background: var(--theme-card-bg);
      border-radius: 24px;
      padding: 1rem;
      margin: 0 2rem 0.5rem 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(20px);
      transition: all 0.4s ease;
    }
    
    /* Transparent profile card when background image is set */
    .business-theme.has-bg-image .modern-profile-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .business-theme .modern-profile-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
    }
    
    /* Profile Header */
    .business-theme .profile-header-section {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    
    .business-theme .profile-avatar {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      overflow: hidden;
      margin-right: 1.5rem;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }
    
    .business-theme .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .business-theme .avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .business-theme .profile-text {
      flex: 1;
    }
    
    .business-theme .business-name {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }
    
    .business-theme .business-tagline {
      font-size: 1rem;
      opacity: 1;
      margin: 0;
      line-height: 1.4;
    }
    
    /* Business About */
    .business-theme .business-about {
      margin-bottom: 1.5rem;
      padding: 1.25rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      border-left: 4px solid var(--theme-accent);
    }
    
    .business-theme .business-about p {
      margin: 0;
      color: var(--theme-text);
      line-height: 1.6;
      font-size: 0.95rem;
    }
    
    /* Contact Grid */
    .business-theme .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    
    .business-theme .contact-card {
      display: flex;
      align-items: flex-start;
      padding: 1.17rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      text-decoration: none;
      color: var(--theme-text);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    

    
    .business-theme .hours-card {
      cursor: default;
    }
    
    .business-theme .contact-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--theme-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    
    .business-theme .contact-icon svg {
      color: white;
    }
    
    .business-theme .contact-info {
      flex: 1;
      min-width: 0;
    }
    
    .business-theme .contact-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #060606 !important;
      opacity: 1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }
    
    .business-theme .contact-value {
      display: block;
      font-size: 0.95rem;
      font-weight: 500;
      color: #1F2937 !important;
      line-height: 1.4;
      word-break: break-word;
      text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.8);
    }
    
    .business-theme .hours-display {
      font-size: 0.9rem;
      color: var(--theme-text);
    }
    
    .business-theme .hours-line {
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }
    
    .business-theme .hours-line:last-child {
      margin-bottom: 0;
    }
    
    /* Name styling for business theme */
    .business-theme .bio-link-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
      line-height: 1.2;
      position: relative;
      display: inline-block;
    }
    
    /* Title underline effect */
    .business-theme .bio-link-title::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: var(--accent-color, currentColor);
      border-radius: 2px;
      transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .business-theme .bio-link-title:hover::after {
      width: 100%;
    }
    
    /* Tagline styling for business theme */
    .business-theme .bio-link-description {
      font-size: 1.125rem;
      opacity: 0.8;
      font-weight: 400;
      margin-top: 0.5rem;
      line-height: 1.5;
      max-width: 90%;
    }
    
    /* Enhanced Business Detail Items */
    .business-theme .business-detail-item {
      display: flex;
      align-items: center;
      padding: 0.875rem 1rem;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 12px;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      cursor: default;
      position: relative;
      overflow: hidden;
    }
    
    .business-theme .business-detail-item.interactive-contact {
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }
    
    .business-theme .business-detail-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: var(--theme-accent);
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }
    
    .business-theme .business-detail-item:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border-color: var(--theme-accent);
    }
    
    .business-theme .business-detail-item:hover::before {
      transform: scaleY(1);
    }
    
    .business-theme .business-detail-item:focus {
      outline: 2px solid var(--theme-accent);
      outline-offset: 2px;
    }
    
    .business-theme .contact-icon-wrapper {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--theme-accent);
      border-radius: 8px;
      margin-right: 0.875rem;
      flex-shrink: 0;
      transition: all 0.4s ease;
    }
    
    .business-theme .contact-icon-wrapper svg {
      color: white;
      transition: transform 0.3s ease;
    }
    
    .business-theme .business-detail-item:hover .contact-icon-wrapper {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .business-theme .contact-text {
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.4;
      word-break: break-word;
    }
    
    /* Enhanced Business Description */
    .business-theme .business-description {
      margin-top: 1.5rem;
      padding: 1.25rem;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 12px;
      border-left: 4px solid var(--theme-accent);
      font-size: 0.95rem;
      line-height: 1.6;
      opacity: 0.9;
      transition: all 0.3s ease;
    }
    
    .business-theme .business-description:hover {
      background: rgba(255, 255, 255, 0.6);
      opacity: 1;
    }
    

    

    
    .business-theme .hours-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .business-theme .hours-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.75rem;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }
    
    .business-theme .hours-item:hover {
      background: rgba(255, 255, 255, 0.9);
      border-left-color: var(--theme-accent);
      transform: translateX(4px);
    }
    
    .business-theme .hours-item.single {
      justify-content: center;
      text-align: center;
    }
    
    .business-theme .hours-item .day {
      font-weight: 600;
      color: var(--theme-text);
      font-size: 0.9rem;
      min-width: 60px;
    }
    
    .business-theme .hours-item .time {
      font-weight: 500;
      color: var(--theme-text);
      opacity: 0.8;
      font-size: 0.9rem;
      text-align: right;
    }
    
    .business-theme .hours-simple {
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--theme-text);
      white-space: pre-line;
    }
    
    /* Current day highlighting */
    .business-theme .hours-item.current-day {
      background: linear-gradient(135deg, var(--theme-accent)15, var(--theme-button)10);
      border-left-color: var(--theme-accent);
      font-weight: 600;
    }
    
    .business-theme .hours-item.current-day .day,
    .business-theme .hours-item.current-day .time {
      color: var(--theme-button);
      opacity: 1;
    }
    
    /* Links section styling */
    .business-theme .links-section {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin: 0 2rem 0.5rem 2rem;
      position: relative;
      z-index: 1;
    }
    
    /* Business link button styling */
    .business-theme .bio-link-button {
      display: flex;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-radius: 12px;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      border-left: 5px solid var(--theme-button);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02), 0 0 15px var(--theme-button);
      height: 100%;
      background-color: var(--theme-button) !important;
      position: relative;
      overflow: hidden;
      color: var(--theme-button-text) !important;
    }
    
    /* Transparent link buttons when background image is set */
    .business-theme.has-bg-image .bio-link-button {
      background-color: var(--theme-button);
      backdrop-filter: blur(10px);
      border: 1px solid var(--theme-button);
      border-left: 5px solid var(--theme-button);
      color: var(--theme-button-text);
    }
    
    .business-theme.has-bg-image .bio-link-button:hover {
      background-color: var(--theme-button);
      opacity: 0.9;
    }
    
    /* Link button shine effect */
    .business-theme .bio-link-button::before {
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
    
    .business-theme .bio-link-button:hover::before {
      left: 100%;
    }
    
    .business-theme .bio-link-button:hover {
      transform: translateY(-6px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.03), 0 0 25px var(--theme-button);
      background-color: var(--theme-button);
      border-left-color: var(--theme-button);
      opacity: 0.9;
    }
    
    /* Link icon container */
    .business-theme .link-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      margin-right: 1.25rem;
      flex-shrink: 0;
      background: rgba(0, 0, 0, 0.04);
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.03);
    }
    
    .business-theme .bio-link-button:hover .link-icon {
      transform: scale(1.15) rotate(8deg);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    }
    
    /* Link text styling */
    .business-theme .link-text {
      flex: 1;
      text-align: left;
    }
    
    .business-theme .link-title {
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.35rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }
    
    .business-theme .link-description {
      font-size: 0.95rem;
      opacity: 0.7;
      line-height: 1.5;
    }
    
    /* Social media section */
    .business-theme .social-section {
      background: var(--theme-card-bg);
      padding: 1rem;
      border-radius: 16px;
      margin: 0.5rem 2rem 0 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.02);
      position: relative;
      z-index: 1;
      border-left: 5px solid var(--theme-accent);
      color: var(--theme-text);
    }
    
    /* Transparent social section when background image is set */
    .business-theme.has-bg-image .social-section {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 5px solid var(--theme-accent);
    }
    
    .business-theme .social-title {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      opacity: 1;
      position: relative;
      display: inline-block;
    }
    
    .business-theme .social-title::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 30px;
      height: 2px;
      background-color: var(--theme-accent);
      border-radius: 2px;
    }
    
    .business-theme .bio-link-social {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    
    .business-theme .bio-link-social a {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.03);
      background-color: #ffffff !important;
    }
    
    .business-theme .bio-link-social a:hover {
      transform: translateY(-6px) scale(1.1);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
    }
    
    .business-theme .bio-link-social a svg {
      transition: transform 0.4s ease;
      color: var(--theme-button) !important;
      fill: var(--theme-button) !important;
    }
    
    .business-theme .bio-link-social a:hover svg {
      transform: scale(1.2);
    }
    
    /* Footer section */
    .business-theme .footer-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      text-align: center;
      font-size: 0.95rem;
      opacity: 1;
      position: relative;
      z-index: 1;
      font-weight: 500;
      margin: 1rem 2rem 0.5rem 2rem;
      color: #374151 !important;
    }
    
    .business-theme .footer-content {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    
    .business-theme .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 1rem;
    }
    
    .business-theme .footer-links a {
      color: var(--theme-button);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
    
    .business-theme .footer-links a:hover {
      background-color: rgba(var(--theme-button-rgb), 0.1);
      transform: translateY(-1px);
    }
    
    .business-theme .footer-copyright {
      font-size: 0.85rem;
      opacity: 0.8;
    }
    
    /* Transparent footer when background image is set */
    .business-theme.has-bg-image .footer-section {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .business-theme.has-bg-image .footer-links a {
      color: var(--theme-button);
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .business-theme.has-bg-image .footer-links a:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    
    /* Enhanced Animations with Accessibility */
    @keyframes slideInRightFade {
      from { transform: translateX(30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeInUpScale {
      from { transform: translateY(20px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    @keyframes scaleInRotate {
      from { transform: scale(0.9) rotate(-2deg); opacity: 0; }
      to { transform: scale(1) rotate(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInUp {
      from { transform: translateY(15px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    /* Respect user's motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .business-theme * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    .business-theme .profile-section {
      animation: scaleInRotate 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      opacity: 0;
    }
    
    .business-theme .bio-link-title,
    .business-theme .bio-link-description {
      animation: slideInRightFade 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.2s;
      opacity: 0;
    }
    
    .business-theme .business-details {
      animation: slideInUp 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.4s;
      opacity: 0;
    }
    
    .business-theme .business-detail-item {
      animation: fadeIn 0.5s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.5s);
      opacity: 0;
    }
    
    .business-theme .business-description {
      animation: fadeInUpScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.7s;
      opacity: 0;
    }
    
    .business-theme .bio-link-button {
      animation: fadeInUpScale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.5s);
      opacity: 0;
    }
    
    .business-theme .social-section {
      animation: fadeInUpScale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.6s;
      opacity: 0;
    }
    
    .business-theme .bio-link-social a {
      animation: fadeIn 0.5s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.8s);
      opacity: 0;
    }
    
    .business-theme .footer-section {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 1s;
      opacity: 0;
    }
    
    .business-theme .qr-section {
      position: relative;
      z-index: 1;
      animation: fadeInUpScale 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.8s;
      opacity: 0;
    }
    
    /* Enhanced Responsive Design */
    @media (max-width: 768px) {
      .business-theme .profile-section {
        flex-direction: column;
        text-align: center;
        padding: 2rem;
        align-items: center;
      }
      
      .business-theme .profile-image-container {
        margin-right: 0;
        margin-bottom: 1.5rem;
      }
      
      .business-theme .profile-image-wrapper,
      .business-theme .profile-fallback {
        width: 6rem;
        height: 6rem;
      }
      
      .business-theme .bio-link-title::after {
        left: 50%;
        transform: translateX(-50%);
      }
      
      .business-theme .business-details.enhanced {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      
      .business-theme .business-detail-item {
        padding: 0.75rem;
      }
      
      .business-theme .contact-icon-wrapper {
        width: 2.25rem;
        height: 2.25rem;
        margin-right: 0.75rem;
      }
      
      .business-theme .profile-header-section {
        flex-direction: column;
        text-align: center;
      }
      
      .business-theme .profile-avatar {
        margin-right: 0;
        margin-bottom: 1rem;
      }
      
      .business-theme .contact-grid {
        grid-template-columns: 1fr;
      }
      
      .business-theme .links-section {
        grid-template-columns: 1fr;
      }
      
      .business-theme .social-title::after {
        left: 50%;
        transform: translateX(-50%);
      }
      
      .business-theme .social-title {
        display: block;
        text-align: center;
      }
      
      .business-theme .footer-links {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      
      .business-theme .footer-links a {
        padding: 0.5rem 1rem;
        border-radius: 8px;
        min-width: 120px;
        text-align: center;
      }
    }
    
    @media (max-width: 480px) {
      .business-theme .profile-section {
        padding: 1.5rem;
      }
      
      .business-theme .business-detail-item {
        padding: 0.625rem 0.75rem;
      }
      
      .business-theme .contact-text {
        font-size: 0.875rem;
      }
      
      .business-theme .modern-profile-card {
        padding: 1.5rem;
      }
      
      .business-theme .business-about {
        padding: 1rem;
      }
      
      .business-theme .contact-card {
        padding: 1rem;
      }
      
      .business-theme .contact-icon {
        width: 40px;
        height: 40px;
      }
    }
  `,
  colorPresets: [

        
    {
      name: 'Premium Burgundy',
      background: {
        type: 'image',
        color: '#1F6FEB',
        gradient: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
        image: 'dynamic:bussiness:0'
      },
      buttonColor: '#1F6FEB',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Innovation Indigo',
      background: {
        type: 'image',
        color: '#BB6653',
        gradient: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
        image: 'dynamic:bussiness:4'
      },
      buttonColor: '#BB6653',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Corporate Blue',
      background: {
        type: 'image',
        color: '#1591B3',
        gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        image: 'dynamic:bussiness:2'
      },
      buttonColor: '#1591B3',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Growth Green',
      background: {
        type: 'image',
        color: '#EAA64D',
        gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        image: 'dynamic:bussiness:3'
      },
      buttonColor: '#EAA64D',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Executive Steel',
      background: {
        type: 'image',
        color: '#D75555',
        gradient: 'linear-gradient(135deg, #f9fafb 0%, #d1d5db 100%)',
        image: 'dynamic:bussiness:2'
      },
      buttonColor: '#D75555',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
  ],
  font: 'Plus Jakarta Sans, sans-serif',
  defaultPreset: 0,
  
  // Theme-specific render functions
  renderProfile: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, buttonColor, textColor, isPublic, t = (key: string) => key } = props;
    // Use defaults when header data is empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const { header } = data.config;
    
    const displayName = header.name || (header.name !== null && header.name !== '' && isEditMode ? defaults.name : null);
    const displayTagline = header.tagline || (header.tagline !== null && header.tagline !== '' && isEditMode ? defaults.tagline : null);
    const displayEmail = header.email || (header.email !== null && header.email !== '' && isEditMode ? defaults.email : null);
    const displayPhone = header.phone || (header.phone !== null && header.phone !== '' && isEditMode ? defaults.phone : null);
    const displayDescription = header.description || (header.description !== null && header.description !== '' && isEditMode ? defaults.description : null);
    
    const initials = displayName ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2) : '?';
    const displayAddress = header.address ? header.address.replace(/,/g, '\n') : '';
    
    return React.createElement(
      "div", 
      { className: "modern-profile-card" },
      
      /* Profile Header */
      React.createElement("div", { className: "profile-header-section" },
        /* Profile Image */
        React.createElement("div", { className: "profile-avatar" },
          header.profile_image ? 
            React.createElement("img", { 
              src: getDisplayUrl(header.profile_image), 
              alt: displayName,
              className: "avatar-image"
            }) : 
            React.createElement("div", { 
              className: "avatar-fallback",
              style: { backgroundColor: buttonColor }
            }, initials)
        ),
        
        /* Name & Tagline */
        React.createElement("div", { className: "profile-text" },
      React.createElement(
  "h1",
  { className: "business-name", style: { color: props.textColor } },
  displayName
),
header.tagline &&
  React.createElement(
    "p",
    { className: "business-tagline", style: { color: props.textColor } },
    displayTagline
)

        )
      ),
      
      /* Description */
      displayDescription && React.createElement("div", { className: "business-about" },
        React.createElement("p", null, displayDescription)
      ),
      
      /* Contact Grid */
      React.createElement("div", { className: "contact-grid" },
        displayPhone && React.createElement("a", {
          href: `tel:${displayPhone}`,
          className: "contact-card phone-card"
        },
          React.createElement("div", { className: "contact-icon" },
            React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
              React.createElement("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
            )
          ),
          React.createElement("div", { className: "contact-info" },
            React.createElement("span", { className: "contact-label" }, t("Phone")),
            React.createElement("span", { className: "contact-value" }, displayPhone)
          )
        ),
        
        displayEmail && React.createElement("a", {
          href: `mailto:${displayEmail}`,
          className: "contact-card email-card"
        },
          React.createElement("div", { className: "contact-icon" },
            React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
              React.createElement("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
              React.createElement("polyline", { points: "22,6 12,13 2,6" })
            )
          ),
          React.createElement("div", { className: "contact-info" },
            React.createElement("span", { className: "contact-label" }, t("Email")),
            React.createElement("span", { className: "contact-value" }, displayEmail)
          )
        ),
        
        header.address && React.createElement("a", {
          href: `https://maps.google.com/?q=${encodeURIComponent(header.address)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "contact-card address-card"
        },
          React.createElement("div", { className: "contact-icon" },
            React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
              React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
              React.createElement("circle", { cx: "12", cy: "10", r: "3" })
            )
          ),
          React.createElement("div", { className: "contact-info" },
            React.createElement("span", { className: "contact-label" }, t("Address")),
            React.createElement("span", { className: "contact-value", style: { whiteSpace: 'pre-line' } }, displayAddress)
          )
        ),
        
        header.hours && React.createElement("div", { className: "contact-card hours-card" },
          React.createElement("div", { className: "contact-icon" },
            React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
              React.createElement("circle", { cx: "12", cy: "12", r: "10" }),
              React.createElement("polyline", { points: "12 6 12 12 16 14" })
            )
          ),
          React.createElement("div", { className: "contact-info" },
            React.createElement("span", { className: "contact-label" }, t("Hours")),
            React.createElement("div", { className: "hours-display" },
              (() => {
                try {
                  const hoursData = typeof header.hours === 'string' ? JSON.parse(header.hours) : header.hours;
                  if (Array.isArray(hoursData) || typeof hoursData === 'object') {
                    return Object.entries(hoursData).map(([day, hours], index) => 
                      React.createElement("div", { key: index, className: "hours-line" },
                        React.createElement("span", null, `${day}: ${hours || (t('Closed'))}`)
                      )
                    );
                  }
                } catch (e) {}
                
                const formattedHours = header.hours
                  .split(/[\n,;]|\s{2,}/)
                  .filter(line => line.trim())
                  .map(line => line.trim());
                if (formattedHours.length > 1) {
                  return formattedHours.map((line, index) => 
                    React.createElement("div", { key: index, className: "hours-line" }, line)
                  );
                }
                return React.createElement("span", null, header.hours);
              })()
            )
          )
        )
      )
    );
  },
  
  renderSocial: (props: ThemeRenderProps & { t?: (key: string) => string }) => {
    const { data, isPublic, buttonColor, t = (key: string) => key } = props;
    const { social } = data.config;
    
    // Use defaults when social items are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displaySocial = social?.items && social.items.length > 0 ? social.items : (social?.display && isEditMode ? defaults.social : []);
    
    if (!social?.display || !displaySocial.length) return null;
    
    return React.createElement(
      "div", 
      { 
        className: "social-section animate-fade-up",
        style: { 
          marginBottom: '2rem',
          animationDelay: '0.3s'
        }
      },
      React.createElement("div", { 
        className: "social-title",
        style: { color: props.textColor }
      }, t("Connect With Us")),
      React.createElement("div", { className: "bio-link-social" },
        displaySocial.map((item, index) => 
          item.platform && 
            React.createElement("a", { 
              key: index, 
              href: item.url || "#",
              target: "_blank",
              rel: "noopener noreferrer",
              style: { 
                backgroundColor: `${buttonColor}15`,
                animation: `fadeIn 0.4s ease forwards ${0.4 + index * 0.05}s`,
                opacity: 1
              }
            },
              React.createElement(SocialIcon, { 
                platform: item.platform, 
                color: buttonColor,
                style: { color: buttonColor, fill: buttonColor }
              })
            )
        )
      )
    );
  },
  
  renderLinks: (props: ThemeRenderProps) => {
    const { data, isPublic, buttonColor, textColor } = props;
    const { links, background } = data.config;
    
    // Use defaults when links are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displayLinks = links && links.length > 0 ? links : (isEditMode ? defaults.links : []);
    const hasBackgroundImage = background?.type === 'image' && background.image;
    
    if (!displayLinks || !displayLinks.length) {
      return React.createElement(
        "div", 
        { className: "bg-white/90 rounded-xl p-4 flex items-center justify-center shadow-sm text-gray-500 text-sm" },
        t("No links added yet")
      );
    }
    
    return React.createElement(
      "div", 
      { className: "links-section" },
      displayLinks.map((link, index) => 
        React.createElement("a", { 
          key: index,
          href: link.url || "#",
          target: "_blank",
          rel: "noopener noreferrer", 
          className: "bio-link-button animate-slide-in no-underline",
          style: { 
            borderLeftColor: buttonColor,
            color: props.buttonTextColor || '#FFFFFF',
            backgroundColor: buttonColor + ' !important',
            backdropFilter: hasBackgroundImage ? 'blur(10px)' : 'none',
            boxShadow: `0 8px 20px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.02), 0 0 15px ${buttonColor}40`,
            animationDelay: `${0.2 + index * 0.05}s`,
            opacity: 1,
            textDecoration: 'none'
          } as React.CSSProperties
        },
          link.icon ? 
            React.createElement("div", { className: "link-icon" },
              React.createElement("img", { 
                src: getDisplayUrl(link.icon), 
                alt: "", 
                className: "w-6 h-6 object-contain" 
              })
            ) : 
            React.createElement("div", { 
              className: "link-icon",
              style: { backgroundColor: `rgba(255,255,255,0.2)` }
            },
              React.createElement("svg", { 
                xmlns: "http://www.w3.org/2000/svg", 
                width: "18", 
                height: "18", 
                viewBox: "0 0 24 24", 
                fill: "none", 
                stroke: props.buttonTextColor || '#FFFFFF', 
                strokeWidth: "2", 
                strokeLinecap: "round", 
                strokeLinejoin: "round" 
              },
                React.createElement("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                React.createElement("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
              )
            ),
          React.createElement("div", { className: "link-text" },
            React.createElement("div", { 
              className: "link-title",
              style: { color: props.buttonTextColor || '#FFFFFF' }
            }, link.text || 'Untitled Link'),
            link.description && 
              React.createElement("div", { 
                className: "link-description",
                style: { color: props.buttonTextColor || '#FFFFFF' }
              }, link.description)
          )
        )
      )
    );
  },
  
  renderContainer: (props: ThemeRenderProps) => {
    const year = new Date().getFullYear();
    const businessName = props.data.config.header.name || 'Business Name';
    const copyright = props.data.config.copyright;
    const { data, textColor, buttonColor, buttonTextColor } = props;
    const { background } = data.config;
    
    const hasBackgroundImage = background?.type === 'image' && background.image;
    const themeImages = (window as any).__themeImages || {};
    
    let backgroundStyle = {};
    if (background?.type === 'image') {
      const imageUrl = background.image || 'dynamic:bussiness:0';
      const resolvedImage = resolveImageForRendering(imageUrl, themeImages);
      backgroundStyle = { 
        backgroundImage: `url(${resolvedImage})`,
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
      const defaultImage = resolveDynamicImage('dynamic:bussiness:0', themeImages);
      if (defaultImage) {
        backgroundStyle = { 
          backgroundImage: `url(${defaultImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        };
      }
    }
    
    return React.createElement(
      "div",
      {
        className: `business-theme${hasBackgroundImage ? ' has-bg-image' : ''}`,
        style: {
          '--business-bg': background?.color || '#F8FAFC',
          '--business-text': textColor,
          '--business-button': buttonColor,
          '--business-button-text': buttonTextColor,
          '--business-accent': buttonColor,
          '--theme-button-rgb': buttonColor.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '37, 99, 235',
          color: textColor,
        } as React.CSSProperties
      },
      React.createElement("div", { 
        className: "bio-link-header",
        style: { color: textColor }
      },
        /* Business theme profile */
        BusinessTheme.renderProfile && BusinessTheme.renderProfile(props)
      ),
      
      React.createElement("div", { 
        className: "flex flex-col",
        style: { 
          position: 'relative',
          zIndex: 1,
          paddingBottom: '1rem'
        }
      },
        /* Inline social icons */
        props.data.config.social?.display && props.data.config.social.items.length > 0 && 
          BusinessTheme.renderSocial && BusinessTheme.renderSocial(props),
        
        /* Links */
        BusinessTheme.renderLinks && BusinessTheme.renderLinks(props),
        
        /* QR Code Section */
        data.config.qr_share?.enable_qr && React.createElement("div", {
          className: "qr-section",
          style: {
            background: hasBackgroundImage ? 'rgba(255, 255, 255, 0.1)' : 'var(--theme-card-bg)',
            backdropFilter: hasBackgroundImage ? 'blur(10px)' : 'none',
            border: hasBackgroundImage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)',
            borderRadius: '16px',
            padding: '1.5rem',
            margin: '0.5rem 2rem',
            textAlign: 'center',
            borderLeft: `5px solid ${buttonColor}`,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }
        },
          data.config.qr_share.qr_title && React.createElement("h3", {
            style: { 
              color: textColor, 
              marginBottom: '0.75rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              textAlign: 'center'
            }
          }, data.config.qr_share.qr_title),
          data.config.qr_share.qr_description && React.createElement("p", {
            style: { 
              color: textColor, 
              marginBottom: '1.5rem',
              opacity: '0.8',
              fontSize: '0.9rem',
              textAlign: 'center',
              lineHeight: '1.5'
            }
          }, data.config.qr_share.qr_description),
          React.createElement("div", {
            style: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              margin: '0 auto',
              width: data.config.qr_share.qr_size === 'large' ? '300px' : data.config.qr_share.qr_size === 'small' ? '128px' : '200px',
              height: data.config.qr_share.qr_size === 'large' ? '300px' : data.config.qr_share.qr_size === 'small' ? '128px' : '200px',
              border: '2px dashed #ccc',
              fontSize: '0.9rem',
              color: '#666',
              maxWidth: '100%'
            }
          }, t('QR Code'))
        ),
        
        /* Business theme footer */
        (props.data.config.footer?.show_footer !== false || copyright?.enabled !== false) && React.createElement("div", { 
          className: "footer-section",
          style: { color: textColor }
        },
          /* Footer content */
          props.data.config.footer?.show_footer && props.data.config.footer?.footer_text && 
            React.createElement("div", { 
              className: "footer-content",
              style: { 
                color: textColor,
                marginBottom: '1rem',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }
            }, props.data.config.footer.footer_text),
          
          /* Footer links */
          props.data.config.footer?.show_footer && props.data.config.footer?.footer_links?.length > 0 && 
            React.createElement("div", { 
              className: "footer-links",
              style: { 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'center',
                marginBottom: '1rem'
              }
            },
              props.data.config.footer.footer_links.map((link, index) => 
                React.createElement("a", {
                  key: index,
                  href: link.url || '#',
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  style: {
                    color: buttonColor,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  },
                  onMouseEnter: (e) => {
                    e.target.style.backgroundColor = `${buttonColor}15`;
                  },
                  onMouseLeave: (e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }, link.title)
              )
            ),
          
          /* Copyright */
          React.createElement("div", { 
            className: "footer-copyright",
            style: { 
              color: textColor,
              fontSize: '0.85rem',
              opacity: '0.8',
              borderTop: props.data.config.footer?.show_footer ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
              paddingTop: props.data.config.footer?.show_footer ? '1rem' : '0'
            }
          }, 
            props.data.config.copyright?.text || copyright?.text || `© ${year} ${businessName}. All rights reserved.`
          )
        )
      )
    );
  }
};

export default BusinessTheme;