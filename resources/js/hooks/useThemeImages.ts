import { usePage } from '@inertiajs/react';

interface ThemeImages {
  [theme: string]: string[];
}

export const useThemeImages = () => {
  const { props } = usePage();
  const themeImages = (props.themeImages as ThemeImages) || {};

  const getThemeImages = (theme: string): string[] => {
    return themeImages[theme] || [];
  };

  const getRandomThemeImage = (theme: string): string | null => {
    const images = getThemeImages(theme);
    return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : null;
  };

  const getThemeImage = (theme: string, index: number = 0): string | null => {
    const images = getThemeImages(theme);
    return images[index] || null;
  };

  return {
    themeImages,
    getThemeImages,
    getRandomThemeImage,
    getThemeImage
  };
};