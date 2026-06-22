import PersonalTheme from './personal';
import BusinessTheme from './business';
import PortfolioTheme from './portfolio';
import SocialTheme from './social';
import MinimalTheme from './minimal';
import TechTheme from './tech';
import NatureTheme from './nature';
import FashionTheme from './fashion';
import GamingTheme from './gaming';
import HealthTheme from './health';
import TravelTheme from './travel';
import FoodTheme from './food';
import EcommerceTheme from './ecommerce';
import BloggerTheme from './blogger';
import GlamorousTheme from './glamorous';

export const themes = {
  personal: PersonalTheme,
  business: BusinessTheme,
  portfolio: PortfolioTheme,
  social: SocialTheme,
  minimal: MinimalTheme,
  tech: TechTheme,
  nature: NatureTheme,
  fashion: FashionTheme,
  gaming: GamingTheme,
  health: HealthTheme,
  travel: TravelTheme,
  food: FoodTheme,
  ecommerce: EcommerceTheme,
  blogger: BloggerTheme,
  glamorous: GlamorousTheme
};

export const getTheme = (type: string) => {
  return themes[type] || themes.personal;
};

import React from 'react';
import { BioLinkData } from '../types';
import { resolveDynamicImage, resolveImageForRendering } from '../../../utils/themeImageResolver';
import { getImageDisplayUrl } from '../../../utils/imageUrlHelper';

// Global utility function for converting relative paths to full URLs
export const getDisplayUrl = (url: string) => {
  return getImageDisplayUrl(url);
};

// Utility function to resolve background image URLs
export const resolveBackgroundImage = (imageUrl: string, defaultImage: string) => {
  if (!imageUrl) return defaultImage;
  
  // If it's a dynamic theme image reference, resolve it
  if (imageUrl.startsWith('dynamic:')) {
    return resolveDynamicImage(imageUrl);
  }
  
  // Otherwise, use getDisplayUrl to resolve the path
  return getDisplayUrl(imageUrl);
};

export interface ThemeRenderProps {
  data: BioLinkData;
  isPublic: boolean;
  layoutStyle: {
    header: string;
    profileSize: string;
    linksContainer: string;
    linkItem: string;
  };
  buttonStyle: any;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  font: string;
}

export interface ProfileField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'image' | 'url' | 'date' | 'color';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  section?: string;
  cols?: number;
  rows?: number;
}

export type ThemeType = {
  name: string;
  layout: 'standard' | 'compact' | 'card' | 'minimal' | 'terminal' | 'organic' | 'magazine' | 'arcade' | 'masonry';
  buttonStyle: 'rounded' | 'pill' | 'square' | 'soft' | 'custom' | 'borderless' | 'command' | 'leaf' | 'underline' | 'pixelated' | 'staggered';
  socialPosition: 'top' | 'bottom' | 'inline' | 'floating' | 'hidden' | 'inline-code' | 'branch' | 'sidebar' | 'gamepad' | 'scattered';
  profileStyle: 'circle' | 'square' | 'large' | 'small' | 'asymmetric' | 'micro' | 'pixel' | 'circular-frame' | 'editorial' | 'character' | 'polaroid';
  customCSS?: string;
  colorPresets: Array<{
    name: string;
    background: {
      type: 'color' | 'gradient' | 'image';
      color: string;
      gradient: string;
      image: string;
    };
    buttonColor: string;
    buttonTextColor: string;
    textColor: string;
  }>;
  font: string;
  defaultPreset: number;
  
  // Theme-specific profile fields
  profileFields?: ProfileField[];
  
  // Default background image for the theme (used when no image is selected)
  defaultBackgroundImage?: string;
  
  // Default background image for the theme (used when no image is selected)
  defaultBackgroundImage?: string;
  
  // Theme-specific render functions
  renderContainer?: (props: ThemeRenderProps) => React.ReactNode;
  renderProfile?: (props: ThemeRenderProps) => React.ReactNode;
  renderLinks?: (props: ThemeRenderProps) => React.ReactNode;
  renderSocial?: (props: ThemeRenderProps) => React.ReactNode;
  renderDecorativeElements?: (props: ThemeRenderProps) => React.ReactNode;
};

export const bioLinkTypes = [
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'social', label: 'Social Media' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'tech', label: 'Tech' },
  { value: 'nature', label: 'Nature' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'travel', label: 'Travel & Tourism' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'blogger', label: 'Blogger' },
  { value: 'glamorous', label: 'Glamorous Influencer' },
];