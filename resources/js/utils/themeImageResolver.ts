import { getImageDisplayUrl } from './imageUrlHelper';

interface ThemeImages {
  [theme: string]: string[];
}

export const resolveDynamicImage = (imageString: string, themeImages?: ThemeImages): string => {
  if (imageString.startsWith('dynamic:')) {
    const parts = imageString.split(':');
    if (parts.length === 3) {
      const [, theme, indexStr] = parts;
      const index = parseInt(indexStr, 10);
      
      if (themeImages && themeImages[theme] && themeImages[theme][index]) {
        return themeImages[theme][index];
      }
      
      return getDefaultThemeImageUrl(theme, index);
    }
  }
  
  return imageString;
};

export const getDefaultThemeImageUrl = (theme: string, index: number = 0): string => {
  return getImageDisplayUrl(`images/bio-image/${theme}/image${index + 1}.jpg`);
};

export const getThemeImageByIndex = (theme: string, index: number, themeImages?: ThemeImages): string => {
  if (themeImages && themeImages[theme] && themeImages[theme][index]) {
    return themeImages[theme][index];
  }
  return getDefaultThemeImageUrl(theme, index);
};

export const getRandomThemeImage = (theme: string, themeImages?: ThemeImages): string => {
  if (themeImages && themeImages[theme] && themeImages[theme].length > 0) {
    const images = themeImages[theme];
    return images[Math.floor(Math.random() * images.length)];
  }
  
  const randomIndex = Math.floor(Math.random() * 6);
  return getDefaultThemeImageUrl(theme, randomIndex);
};

export const getAllThemeImages = (): ThemeImages => {
  const themes = [
    'blogger', 'business', 'ecommerce', 'fashion', 'food', 
    'gaming', 'glamorous', 'health', 'minimal', 'nature', 'personal', 
    'portfolio', 'social', 'tech', 'travel'
  ];
  
  const themeImages: ThemeImages = {};
  themes.forEach(theme => {
    themeImages[theme] = [];
    for (let i = 0; i < 6; i++) {
      themeImages[theme].push(getDefaultThemeImageUrl(theme, i));
    }
  });
  
  return themeImages;
};

/**
 * Check if an image URL is a user-uploaded image (not a default theme image)
 */
export const isUserUploadedImage = (imageUrl: string): boolean => {
  if (!imageUrl) return false;
  
  // Check if it's a dynamic theme image reference
  if (imageUrl.includes('dynamic:')) return false;
  
  // Check if it's a default theme image path
  if (imageUrl.includes('/storage/images/bio-image/') || imageUrl.includes('storage/images/bio-image/') || imageUrl.includes('images/bio-image/')) return false;
  
  // Check if it's a default theme image URL pattern
  if (imageUrl.includes('demo.workdo.io/vcard-saas/storage/images/bio-image/')) return false;
  
  return true;
};

/**
 * Preserve user-uploaded image or return default theme image
 */
export const preserveUserImageOrDefault = (currentImage: string, theme: string, presetIndex: number): string => {
  if (isUserUploadedImage(currentImage)) {
    return currentImage;
  }
  return getDefaultThemeImageUrl(theme, presetIndex);
};

/**
 * Convert relative path to full URL for display
 */
export const getDisplayUrl = (url: string): string => {
  return getImageDisplayUrl(url);
};

/**
 * Get background image URL for live demo display
 */
export const getBioBackgroundImage = (theme: string, index: number = 0): string => {
  const baseUrl = (window as any).baseUrl || window.location.origin;
  return `${baseUrl}/storage/images/bio-image/${theme}/image${index + 1}.jpg`;
};

/**
 * Generate CSS background-image style for live demo
 */
export const getBioBackgroundStyle = (theme: string, index: number = 0): { backgroundImage: string } => {
  const imageUrl = getBioBackgroundImage(theme, index);
  return { backgroundImage: `url('${imageUrl}')` };
};

/**
 * Get all background images for theme demo
 */
export const getBioBackgroundImages = (theme: string): string[] => {
  const images: string[] = [];
  for (let i = 0; i < 6; i++) {
    images.push(getBioBackgroundImage(theme, i));
  }
  return images;
};

/**
 * Resolve image URL for rendering - handles both user-uploaded and default theme images
 */
export const resolveImageForRendering = (imageUrl: string, themeImages?: ThemeImages): string => {
  if (!imageUrl) return '';
  
  // If it's a user-uploaded image (not a dynamic reference), convert to full URL
  if (isUserUploadedImage(imageUrl)) {
    return getDisplayUrl(imageUrl);
  }
  
  // Otherwise, resolve as a dynamic theme image
  return resolveDynamicImage(imageUrl, themeImages);
};
