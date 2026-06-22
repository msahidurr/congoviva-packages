import { extractVideoUrl } from '@/components/VideoEmbed';

export interface YouTubeEmbedOptions {
  colors: {
    primary: string;
    text: string;
    background: string;
    cardBg: string;
    borderColor: string;
  };
  font: string;
}

/**
 * Renders a YouTube video embed with proper error handling and fallbacks
 */
export const renderYouTubeEmbed = (
  embedCode: string, 
  options: YouTubeEmbedOptions,
  title: string = 'Latest Video'
): string => {
  if (!embedCode) return '';

  try {
    const cleanedEmbed = embedCode.trim();
    
    if (cleanedEmbed.includes('<iframe')) {
      // Handle iframe embed code
      return cleanedEmbed.replace(
        /<iframe([^>]*)>/i, 
        '<iframe$1 style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy">'
      );
    } else {
      // Handle direct YouTube URLs
      const videoData = extractVideoUrl(cleanedEmbed);
      if (videoData && videoData.platform === 'youtube') {
        return `<iframe src="${videoData.url}?rel=0&modestbranding=1" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy" title="${title}"></iframe>`;
      }
    }
  } catch (error) {
    console.error('Error processing YouTube embed:', error);
  }

  // Fallback: show error message
  return `<div class="absolute inset-0 flex items-center justify-center" style="background-color: ${options.colors.background}; color: ${options.colors.text};">
    <div class="text-center">
      <div class="w-12 h-12 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-xs" style="font-family: ${options.font};">Unable to load video</p>
    </div>
  </div>`;
};

/**
 * Creates a ref callback for YouTube embed containers
 */
export const createYouTubeEmbedRef = (
  embedCode: string,
  options: YouTubeEmbedOptions,
  title: string = 'Latest Video'
) => {
  return (el: HTMLElement | null) => {
    if (el && !el.hasChildNodes()) {
      el.innerHTML = renderYouTubeEmbed(embedCode, options, title);
    }
  };
};

/**
 * Extracts video ID from various YouTube URL formats
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Try embed URL format
  const embedMatch = url.match(/embed\/([^?&]+)/);
  if (embedMatch) {
    return embedMatch[1];
  }

  // Try watch URL format
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (watchMatch) {
    return watchMatch[1];
  }

  return null;
};

/**
 * Gets YouTube thumbnail URL from video ID
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hqdefault' | 'maxresdefault' = 'maxresdefault'): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};