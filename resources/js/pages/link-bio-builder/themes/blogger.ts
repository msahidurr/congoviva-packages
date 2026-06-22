import React from 'react';
import { ThemeType, ThemeRenderProps, getDisplayUrl } from './index';
import SocialIcon from '../components/SocialIcon';
import { t } from 'i18next';
const defaults = {
  name: t('Sophie Writer'),
  tagline: t('Content Creator & Storyteller'),
  description: t('Sharing stories that matter and creating content that inspires. Join me on this creative journey.'),
  links: [
    { text: 'Latest Posts', url: '#', description: t('Read my blog'), icon: '' },
    { text: 'Newsletter', url: '#', description: t('Weekly updates'), icon: '' },
    { text: 'Writing Services', url: '#', description: t('Hire me to write'), icon: '' }
  ],
  social: [
    { platform: 'medium', url: '#', icon: '' },
    { platform: 'twitter', url: '#', icon: '' },
    { platform: 'linkedin', url: '#', icon: '' }
  ]
};

const BloggerTheme: ThemeType = {
  name: t('Blogger'),
  layout: 'magazine',
  buttonStyle: 'underline',
  socialPosition: 'inline',
  profileStyle: 'editorial',
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
      placeholder: t('Enter your blog tagline'),
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
      name: 'topics',
      label: t('Blog Topics'),
      type: 'text',
      placeholder: t('Technology, Design, Lifestyle (separate with commas)'),
      required: false,
      section: t('Blog Details'),
      cols: 1
    },
    {
      name: 'founded',
      label: t('Founded'),
      type: 'text',
      placeholder: t('Enter when your blog was founded'),
      required: false,
      section: t('Blog Details'),
      cols: 1
    },
    {
      name: 'description',
      label: t('Bio'),
      type: 'textarea',
      placeholder: t('Tell people about your blog and writing'),
      defaultValue: defaults.description,
      required: false,
      section: t('Blog Details'),
      cols: 2,
      rows: 3
    }
  ],
  customCSS: `
    /* Blogger Theme - Editorial & Sophisticated */
    .bio-link-container.blogger-theme {
      position: relative;
      font-family: 'Playfair Display', 'Georgia', serif;
      overflow: hidden;
      border-radius: 0;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      background-color: #FFFFFF;
      min-height: 100vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Background overlay for readability */
    .bio-link-container.blogger-theme::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 1;
    }

    .blogger-theme {
      overflow-x: hidden;
      width: 100%;
      padding: 0;
      margin: 0;
    }

    /* Subtle paper texture */
    .blogger-theme::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      z-index: 0;
    }

    /* Decorative elements */
    .blogger-theme .decorative-element {
      position: absolute;
      opacity: 0.05;
      z-index: 1;
    }

    .blogger-theme .decorative-line {
      height: 1px;
      background: currentColor;
      position: absolute;
      z-index: 1;
    }

    .blogger-theme .decorative-line-1 {
      top: 80px;
      left: 0;
      right: 0;
      width: 100%;
    }

    .blogger-theme .decorative-line-2 {
      bottom: 80px;
      left: 0;
      right: 0;
      width: 100%;
    }

    .blogger-theme .decorative-quote {
      top: 10%;
      right: 10%;
      font-size: 120px;
      font-family: 'Georgia', serif;
      line-height: 1;
      opacity: 0.03;
    }

    /* Layout styling */


    /* Sidebar styling */
    .blogger-theme .bio-link-sidebar {
      position: relative;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      z-index: 2;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Profile image styling - Editorial style */
    .blogger-theme .bio-link-profile-container {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .blogger-theme .bio-link-profile {
      width: 100% !important;
      height: 240px !important;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      object-fit: cover;
      overflow:hidden;
    }

    /* Name styling */
    .blogger-theme .bio-link-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 0.5rem;
      line-height: 1.1;
    }

    /* Tagline styling */
    .blogger-theme .bio-link-tagline {
      color: #ffffff;
      font-style: italic;
      margin-bottom: 2rem;
    }

    /* Blog stats */
    .blogger-theme .blog-stats {
      padding: 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .blogger-theme .stat-item {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .blogger-theme .stat-item:last-child {
      margin-bottom: 0;
    }

    .blogger-theme .stat-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 0.125rem;
      color: var(--button-color, #1CA7A0);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .blogger-theme .stat-content {
      flex: 1;
      min-width: 0;
    }

    .blogger-theme .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.8px;
      margin-bottom: 0.5rem;
      font-family: 'Montserrat', sans-serif;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    .blogger-theme .stat-value {
      color: #FFFFFF;
      font-weight: 600;
      font-size: 1rem;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    }

    .blogger-theme .topics-section {
      margin-bottom: 1rem;
    }

    .blogger-theme .topics-section .stat-content {
      width: 100%;
    }

    /* Enhanced Topics Display */
    .blogger-theme .topics-display {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .blogger-theme .topic-tag {
      background: var(--button-color, #1CA7A0);
      border: 1px solid var(--button-color, #1CA7A0);
      color: #ffffff;
      padding: 0.375rem 0.875rem;
      border-radius: 25px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'Montserrat', sans-serif;
    }



    /* Social icons in sidebar */
    .blogger-theme .social-container {
      margin-top: auto;
      padding-top: 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .blogger-theme .social-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 1;
      margin-bottom: 1rem;
      font-weight: 700;
      font-family: 'Montserrat', sans-serif;
      color: var(--text-color, #FFFFFF);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .blogger-theme .social-icons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    /* Social icon styling */
    .blogger-theme .social-icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      background: var(--button-color, #1CA7A0);;
      backdrop-filter: blur(10px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    /* Fix for social icons */
    .blogger-theme .social-icon svg {
      width: 18px;
      height: 18px;
      position: relative;
      z-index: 2;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    /* Social icon hover effect */
    .blogger-theme .social-icon:hover {
      transform: translateY(-5px);
      background: var(--button-color, currentColor);
      border-color: transparent;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 12px var(--button-color, rgba(0, 0, 0, 0.1));
    }

    .blogger-theme .social-icon:hover svg {
      transform: scale(1.2);
      color: #FFFFFF !important;
    }

    /* Main content styling */
    .blogger-theme .bio-link-content {
      position: relative;
      padding: 0 2rem 2rem;
      z-index: 2;
      overflow-x: hidden;
      width: auto;
      background: transparent;
      backdrop-filter: blur(3px);
    }

    /* Content header */
    .blogger-theme .content-header {
      margin-bottom: 2.5rem;
      position: relative;
    }

    .blogger-theme .content-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      position: relative;
      display: inline-block;
      font-family: 'Montserrat', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-color, #FFFFFF);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), 0 1px 3px rgba(0, 0, 0, 0.9);
    }

    .blogger-theme .content-title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background: currentColor;
    }

    /* Elegant Bio Section */
    .blogger-theme .enhanced-bio-section {
      margin-bottom: 2.5rem;
      position: relative;
    }

    .blogger-theme .bio-section-title {
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      font-family: 'Montserrat', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 1;
      position: relative;
      padding-left: 1rem;
      color: var(--text-color, #FFFFFF);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .blogger-theme .bio-section-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: currentColor;
      border-radius: 2px;
    }

    .blogger-theme .bio-content {
      font-size: 1.15rem;
      line-height: 1.7;
      color: var(--text-color, #FFFFFF);
      font-family: 'Georgia', serif;
      position: relative;
      padding: 1.5rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Elegant quote-style first letter */
    .blogger-theme .bio-content::first-letter {
      font-size: 3.5rem;
      font-weight: 400;
      float: left;
      line-height: 0.9;
      padding-right: 0.5rem;
      margin-top: 0.1rem;
      color: currentColor;
      font-family: 'Playfair Display', serif;
      opacity: 0.8;
    }

    .blogger-theme .bio-content::before {
      content: '"';
      position: absolute;
      top: -0.5rem;
      left: -0.5rem;
      font-size: 2rem;
      opacity: 0.2;
      font-family: 'Playfair Display', serif;
      color: currentColor;
    }

    .blogger-theme .bio-content::after {
      content: '"';
      position: absolute;
      bottom: -0.5rem;
      right: -0.5rem;
      font-size: 2rem;
      opacity: 0.2;
      font-family: 'Playfair Display', serif;
      color: currentColor;
    }

    /* Links container */
    .blogger-theme .links-container {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      overflow-x: hidden;
      width: auto;
    }

    /* Link button styling - Blog post style */
    .blogger-theme .bio-link-button {
      position: relative;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 4px solid transparent;
    }

    /* Link button hover effect */
    .blogger-theme .bio-link-button:hover {
      background: rgba(0, 0, 0, 0.8);
      border-left-color: var(--button-color, #1CA7A0);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    /* Post meta */
    .blogger-theme .bio-link-button .post-meta {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 1;
      margin-bottom: 0.75rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      color: var(--text-color, #FFFFFF);
    }

    /* Post title */
    .blogger-theme .bio-link-button .post-title {
      font-weight: 800;
      font-size: 1.5rem;
      letter-spacing: -0.01em;
      margin-bottom: 0.75rem;
      line-height: 1.3;
      transition: all 0.3s ease;
      color: var(--text-color, #FFFFFF);
    }
    /* Post excerpt */
    .blogger-theme .bio-link-button .post-excerpt {
      font-size: 1rem;
      opacity: 1;
      line-height: 1.6;
      font-family: 'Georgia', serif;
      color: var(--text-color, #FFFFFF);
    }

    /* Read more link */
    .blogger-theme .bio-link-button .read-more {
      font-family: 'Montserrat', sans-serif;
      font-size: 1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-color, #FFFFFF) !important;
      position: relative;
      display: inline-block;
      transition: none;
      background: transparent;
      padding: 1rem 0 0;
      border: none;
      opacity: 1;
      text-decoration: none;
    }

    .blogger-theme .bio-link-button .read-more:hover {
      color: var(--text-color, #FFFFFF) !important;
      text-decoration: underline;
      text-decoration-color: var(--text-color, #FFFFFF);
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }



    /* Footer */
    .blogger-theme .blogger-footer {
      padding: 2rem 0 0;
      text-align: center;
      font-size: 0.85rem;
      opacity: 1;
      font-family: 'Montserrat', sans-serif;
      color: var(--text-color, #FFFFFF);
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      font-weight: 600;
    }

    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
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

    .blogger-theme .bio-link-profile {
      animation: fadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .blogger-theme .bio-link-title,
    .blogger-theme .bio-link-tagline {
      animation: slideInRight 0.8s ease forwards;
      animation-delay: 0.2s;
    }

    .blogger-theme .stat-item {
      animation: slideInRight 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.4s);
    }

    .blogger-theme .content-title,
    .blogger-theme .bio-link-description {
      animation: fadeIn 0.8s ease forwards;
      animation-delay: 0.3s;
    }

    .blogger-theme .bio-link-button {
      animation: slideInLeft 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.5s);
    }

    .blogger-theme .social-icon {
      animation: fadeIn 0.6s ease forwards;
      animation-delay: calc(0.1s * var(--index, 0) + 0.7s);
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .blogger-theme .bio-link-layout {
        grid-template-columns: 1fr;
      }

      .blogger-theme .bio-link-sidebar {
        padding: 2rem 1.5rem;
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }

      .blogger-theme .bio-link-profile {
        aspect-ratio: 1/1;
        max-width: 200px;
        margin: 0 auto 1.5rem;
      }

      .blogger-theme .bio-link-content {
        padding: 2rem;
        overflow-x: hidden;
        width: auto;
      }

      .blogger-theme .bio-link-title {
        font-size: 1.75rem;
        text-align: center;
      }

      .blogger-theme .bio-link-tagline {
        text-align: center;
      }

      .blogger-theme .enhanced-bio-section {
        margin-bottom: 2rem;
      }

      .blogger-theme .bio-content {
        font-size: 1.05rem;
        padding: 1.25rem 0;
      }

      .blogger-theme .bio-content::first-letter {
        font-size: 2.8rem;
        padding-right: 0.4rem;
        margin-top: 0.05rem;
      }

      .blogger-theme .bio-content::before,
      .blogger-theme .bio-content::after {
        font-size: 1.5rem;
      }

      .blogger-theme .topics-display {
        justify-content: center;
      }

      .blogger-theme .social-icons {
        justify-content: center;
      }

      .blogger-theme .topic-tag {
        font-size: 0.75rem;
        padding: 0.2rem 0.6rem;
      }
    }
  `,
  colorPresets: [
    {
      name: 'Classic Editorial',
      background: {
        type: 'image',
        color: '#FF7F50',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop'
      },
      buttonColor: '#FF7F50',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Warm Serif',
      background: {
        type: 'image',
        color: '#DA6CCB',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop'
      },
      buttonColor: '#DA6CCB',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Modern Minimal',
      background: {
        type: 'image',
        color: '#6CDAAA',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=1200&h=800&fit=crop'
      },
      buttonColor: '#6CDAAA',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Literary Blue',
      background: {
        type: 'image',
        color: '#DAD66C',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop'
      },
      buttonColor: '#DAD66C',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    },
    {
      name: 'Vintage Paper',
      background: {
        type: 'image',
        color: '#DA6C6C',
        gradient: '',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop'
      },
      buttonColor: '#DA6C6C',
      buttonTextColor: '#FFFFFF',
      textColor: '#FFFFFF'
    }
  ],
  font: 'Playfair Display, Georgia, serif',
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
      /* Decorative elements */
      React.createElement("div", {
        className: "decorative-element decorative-quote",
        style: { textDecoration: 'none', color: textColor }
      }, "\u201D"),

      /* Profile image */
      React.createElement("div", { className: "bio-link-profile-container" },
        header.profile_image ?
          React.createElement("div", { className: "bio-link-profile" },
            React.createElement("img", { src: getDisplayUrl(header.profile_image), alt: displayName, className: "w-full h-full object-cover" })
          ) :
          React.createElement("div", {
            className: "bio-link-profile flex items-center justify-center text-xl font-bold",
            style: { textDecoration: 'none', background: buttonColor, color: textColor || '#FFFFFF' }
          }, displayName.charAt(0))
      ),

      /* Name and tagline */
      React.createElement("h1", { className: "bio-link-title" }, displayName),
      displayTagline && React.createElement("div", { className: "bio-link-tagline" }, displayTagline),

      /* Blog stats */
      (header.topics || header.founded) && React.createElement("div", {
        className: "blog-stats"
      },
        header.topics && React.createElement("div", {
          className: "stat-item topics-section",
          style: { textDecoration: 'none', "--index": 0 } as React.CSSProperties
        },
          React.createElement("div", {
            className: "stat-icon",
            style: { textDecoration: 'none', color: textColor }
          },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round"
            },
              React.createElement("path", { d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20" }),
              React.createElement("path", { d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" })
            )
          ),
          React.createElement("div", { className: "stat-content" },
            React.createElement("div", { className: "stat-label" }, "Topics"),
            React.createElement("div", { className: "topics-display" },
              header.topics.split(/[,;]|\s{2,}/).filter(topic => topic.trim()).map((topic, index) =>
                React.createElement("span", {
                  key: index,
                  className: "topic-tag",
                  style: { backgroundColor: `${buttonColor}`, color: textColor }
                }, topic.trim())
              )
            )
          )
        ),

        header.founded && React.createElement("div", {
          className: "stat-item",
          style: { textDecoration: 'none', "--index": 1 } as React.CSSProperties
        },
          React.createElement("div", {
            className: "stat-icon",
            style: { textDecoration: 'none', color: textColor }
          },
            React.createElement("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "18",
              height: "18",
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
          React.createElement("div", { className: "stat-content" },
            React.createElement("div", { className: "stat-label" }, t("Founded")),
            React.createElement("div", { className: "stat-value" }, header.founded)
          )
        )
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
      React.createElement("div", { className: "social-title" }, t("Connect")),
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
    
    // Use defaults when links are empty, but only show if user has actual data or in edit mode
    const isEditMode = !isPublic;
    const displayLinks = links && links.length > 0 ? links : (isEditMode ? defaults.links : []);
    const displayDescription = data.config.header.description || (data.config.header.description !== null && data.config.header.description !== '' && isEditMode ? defaults.description : null);

    return React.createElement(
      React.Fragment,
      null,
      /* Content header */
      React.createElement("div", { className: "content-header" },
        React.createElement("h2", { className: "content-title" }, t("Latest Articles"))
      ),

      /* Enhanced Bio Section */
      displayDescription && React.createElement("div", {
        className: "enhanced-bio-section"
      },
        React.createElement("h3", {
          className: "bio-section-title",
          style: { color: textColor }
        }, t("About the Author")),
        React.createElement("div", {
          className: "bio-content"
        }, displayDescription)
      ),

      /* Blog posts */
      React.createElement("div", { className: "links-container" },
        displayLinks && displayLinks.length ?
          displayLinks.map((link, index) =>
            React.createElement("a", {
              key: index,
              href: link.url || "#",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "bio-link-button",
              style: { textDecoration: 'none', "--index": index } as React.CSSProperties
            },
              link.icon && React.createElement("img", {
                src: getDisplayUrl(link.icon),
                alt: link.text,
                style: { width: '40px', height: '40px', objectFit: 'contain', marginBottom: '0.75rem', borderRadius: '6px' }
              }),
              React.createElement("div", { className: "post-meta" },
                `${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ${Math.floor(Math.random() * 10) + 2} min read`
              ),
              React.createElement("div", { className: "post-title" }, link.text || 'Untitled Post'),
              link.description &&
                React.createElement("div", { className: "post-excerpt" }, link.description),
              React.createElement("div", {
                className: "read-more",
                style: { textDecoration: 'none', color: buttonColor }
              }, t("Continue Reading"))
            )
          ) :
          React.createElement("div", {
            className: "text-center p-4 opacity-70 text-sm"
          }, t("No articles published yet"))
      ),

      /* Footer */
      data.config.copyright?.enabled !== false && React.createElement("div", { className: "blogger-footer" },
        data.config.copyright?.text || `© ${new Date().getFullYear()} ${data.config.header.name || defaults.name}. All rights reserved.`
      )
    );
  },

  renderContainer: (props: ThemeRenderProps) => {
    const { data, textColor, buttonColor, font } = props;
    const { background } = data.config;
    const defaultImage = 'https://picsum.photos/1200/800?random=10';

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
        className: "bio-link-container blogger-theme",
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
        { className: "bio-link-layout" },
        React.createElement(
          "div",
          { className: "bio-link-sidebar" },
          BloggerTheme.renderProfile && BloggerTheme.renderProfile(props),
          BloggerTheme.renderSocial && BloggerTheme.renderSocial(props)
        ),
        React.createElement(
          "div",
          { className: "bio-link-content" },
          BloggerTheme.renderLinks && BloggerTheme.renderLinks(props)
        )
      )
    );
  }
};

export default BloggerTheme;
