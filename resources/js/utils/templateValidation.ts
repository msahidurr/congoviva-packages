/**
 * Template validation utilities to ensure data integrity and security
 */

import { sanitizeText, sanitizeUrl, sanitizeEmbedUrl } from './sanitizeHtml';

// Validate and sanitize template data
export const validateTemplateData = (data: any): any => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const sanitizedData = { ...data };

  // Sanitize basic fields
  if (sanitizedData.name) {
    sanitizedData.name = sanitizeText(sanitizedData.name);
  }
  if (sanitizedData.email) {
    sanitizedData.email = sanitizeText(sanitizedData.email);
  }
  if (sanitizedData.phone) {
    sanitizedData.phone = sanitizeText(sanitizedData.phone);
  }
  if (sanitizedData.website) {
    sanitizedData.website = sanitizeUrl(sanitizedData.website);
  }
  if (sanitizedData.description) {
    sanitizedData.description = sanitizeText(sanitizedData.description);
  }

  // Sanitize config sections
  if (sanitizedData.config_sections) {
    sanitizedData.config_sections = validateConfigSections(sanitizedData.config_sections);
  }

  return sanitizedData;
};

// Validate and sanitize config sections
export const validateConfigSections = (configSections: any): any => {
  if (!configSections || typeof configSections !== 'object') {
    return {};
  }

  const sanitized = { ...configSections };

  // Validate section visibility
  if (sanitized.section_visibility) {
    sanitized.section_visibility = validateSectionVisibility(sanitized.section_visibility);
  }

  // Validate header section
  if (sanitized.header) {
    sanitized.header = validateHeaderSection(sanitized.header);
  }

  // Validate about section
  if (sanitized.about) {
    sanitized.about = validateAboutSection(sanitized.about);
  }

  // Validate contact section
  if (sanitized.contact) {
    sanitized.contact = validateContactSection(sanitized.contact);
  }

  // Validate videos section
  if (sanitized.videos) {
    sanitized.videos = validateVideosSection(sanitized.videos);
  }

  // Validate services section
  if (sanitized.services) {
    sanitized.services = validateServicesSection(sanitized.services);
  }

  // Validate testimonials section
  if (sanitized.testimonials) {
    sanitized.testimonials = validateTestimonialsSection(sanitized.testimonials);
  }

  // Validate social section
  if (sanitized.social) {
    sanitized.social = validateSocialSection(sanitized.social);
  }

  // Validate templates section
  if (sanitized.templates) {
    sanitized.templates = validateTemplatesSection(sanitized.templates);
  }

  return sanitized;
};

// Validate section visibility settings
const validateSectionVisibility = (sectionVisibility: any): any => {
  if (!sectionVisibility || typeof sectionVisibility !== 'object') {
    return {};
  }

  const sanitized: any = {};
  const validSections = ['header', 'about', 'contact', 'videos', 'services', 'testimonials', 'social', 'templates'];

  validSections.forEach(section => {
    if (sectionVisibility.hasOwnProperty(section)) {
      sanitized[section] = Boolean(sectionVisibility[section]);
    }
  });

  return sanitized;
};

// Validate templates section
const validateTemplatesSection = (templates: any): any => {
  const sanitized = { ...templates };

  if (sanitized.title) {
    sanitized.title = sanitizeText(sanitized.title);
  }
  if (sanitized.subtitle) {
    sanitized.subtitle = sanitizeText(sanitized.subtitle);
  }
  if (sanitized.cta_text) {
    sanitized.cta_text = sanitizeText(sanitized.cta_text);
  }
  if (sanitized.cta_link) {
    sanitized.cta_link = sanitizeUrl(sanitized.cta_link);
  }
  if (sanitized.background_color) {
    // Validate hex color
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(sanitized.background_color)) {
      sanitized.background_color = '#f8fafc';
    }
  }
  if (sanitized.layout && !['grid', 'carousel', 'list'].includes(sanitized.layout)) {
    sanitized.layout = 'grid';
  }
  if (sanitized.columns && ![1, 2, 3, 4].includes(Number(sanitized.columns))) {
    sanitized.columns = 3;
  }
  if (sanitized.templates_list && Array.isArray(sanitized.templates_list)) {
    sanitized.templates_list = sanitized.templates_list.filter((template: any) => 
      template && typeof template === 'object' && template.name && template.category
    );
  }

  return sanitized;
};

// Validate header section
const validateHeaderSection = (header: any): any => {
  const sanitized = { ...header };

  if (sanitized.name) {
    sanitized.name = sanitizeText(sanitized.name);
  }
  if (sanitized.title) {
    sanitized.title = sanitizeText(sanitized.title);
  }
  if (sanitized.tagline) {
    sanitized.tagline = sanitizeText(sanitized.tagline);
  }
  if (sanitized.profile_image) {
    sanitized.profile_image = sanitizeUrl(sanitized.profile_image);
  }
  if (sanitized.background_image) {
    sanitized.background_image = sanitizeUrl(sanitized.background_image);
  }

  return sanitized;
};

// Validate about section
const validateAboutSection = (about: any): any => {
  const sanitized = { ...about };

  if (sanitized.description) {
    sanitized.description = sanitizeText(sanitized.description);
  }
  if (sanitized.specialties) {
    sanitized.specialties = sanitizeText(sanitized.specialties);
  }
  if (sanitized.certifications) {
    sanitized.certifications = sanitizeText(sanitized.certifications);
  }

  return sanitized;
};

// Validate contact section
const validateContactSection = (contact: any): any => {
  const sanitized = { ...contact };

  if (sanitized.phone) {
    sanitized.phone = sanitizeText(sanitized.phone);
  }
  if (sanitized.email) {
    sanitized.email = sanitizeText(sanitized.email);
  }
  if (sanitized.website) {
    sanitized.website = sanitizeUrl(sanitized.website);
  }
  if (sanitized.address) {
    sanitized.address = sanitizeText(sanitized.address);
  }
  if (sanitized.location) {
    sanitized.location = sanitizeText(sanitized.location);
  }

  return sanitized;
};

// Validate videos section
const validateVideosSection = (videos: any): any => {
  const sanitized = { ...videos };

  if (sanitized.video_list && Array.isArray(sanitized.video_list)) {
    sanitized.video_list = sanitized.video_list.map((video: any) => ({
      ...video,
      title: video.title ? sanitizeText(video.title) : '',
      description: video.description ? sanitizeText(video.description) : '',
      embed_url: video.embed_url ? sanitizeEmbedUrl(video.embed_url) : '',
      thumbnail: video.thumbnail ? sanitizeUrl(video.thumbnail) : '',
      duration: video.duration ? sanitizeText(video.duration) : '',
      video_type: video.video_type ? sanitizeText(video.video_type) : ''
    }));
  }

  return sanitized;
};

// Validate services section
const validateServicesSection = (services: any): any => {
  const sanitized = { ...services };

  if (sanitized.service_list && Array.isArray(sanitized.service_list)) {
    sanitized.service_list = sanitized.service_list.map((service: any) => ({
      ...service,
      title: service.title ? sanitizeText(service.title) : '',
      description: service.description ? sanitizeText(service.description) : '',
      price: service.price ? sanitizeText(service.price) : '',
      duration: service.duration ? sanitizeText(service.duration) : '',
      category: service.category ? sanitizeText(service.category) : ''
    }));
  }

  return sanitized;
};

// Validate testimonials section
const validateTestimonialsSection = (testimonials: any): any => {
  const sanitized = { ...testimonials };

  if (sanitized.reviews && Array.isArray(sanitized.reviews)) {
    sanitized.reviews = sanitized.reviews.map((review: any) => ({
      ...review,
      client_name: review.client_name ? sanitizeText(review.client_name) : '',
      review: review.review ? sanitizeText(review.review) : '',
      rating: review.rating ? sanitizeText(review.rating) : '',
      program: review.program ? sanitizeText(review.program) : '',
      service_received: review.service_received ? sanitizeText(review.service_received) : ''
    }));
  }

  return sanitized;
};

// Validate social section
const validateSocialSection = (social: any): any => {
  const sanitized = { ...social };

  if (sanitized.social_links && Array.isArray(sanitized.social_links)) {
    sanitized.social_links = sanitized.social_links.map((link: any) => ({
      ...link,
      platform: link.platform ? sanitizeText(link.platform) : '',
      url: link.url ? sanitizeUrl(link.url) : ''
    }));
  }

  return sanitized;
};

// Validate business hours
export const validateBusinessHours = (hours: any[]): any[] => {
  if (!Array.isArray(hours)) return [];

  return hours.map(hour => ({
    ...hour,
    day: hour.day ? sanitizeText(hour.day) : '',
    open_time: hour.open_time ? sanitizeText(hour.open_time) : '',
    close_time: hour.close_time ? sanitizeText(hour.close_time) : '',
    is_closed: Boolean(hour.is_closed)
  }));
};

// Validate color scheme
export const validateColors = (colors: any): any => {
  if (!colors || typeof colors !== 'object') {
    return {
      primary: '#1A365D',
      secondary: '#2A4365',
      accent: '#EBF8FF',
      background: '#FFFFFF',
      text: '#2D3748',
      cardBg: '#F7FAFC',
      borderColor: '#E2E8F0'
    };
  }

  const validatedColors = { ...colors };

  // Validate hex color format
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  Object.keys(validatedColors).forEach(key => {
    if (typeof validatedColors[key] === 'string' && !hexColorRegex.test(validatedColors[key])) {
      // Reset to default if invalid
      switch (key) {
        case 'primary':
          validatedColors[key] = '#1A365D';
          break;
        case 'secondary':
          validatedColors[key] = '#2A4365';
          break;
        case 'accent':
          validatedColors[key] = '#EBF8FF';
          break;
        case 'background':
          validatedColors[key] = '#FFFFFF';
          break;
        case 'text':
          validatedColors[key] = '#2D3748';
          break;
        case 'cardBg':
          validatedColors[key] = '#F7FAFC';
          break;
        case 'borderColor':
          validatedColors[key] = '#E2E8F0';
          break;
        default:
          validatedColors[key] = '#000000';
      }
    }
  });

  return validatedColors;
};