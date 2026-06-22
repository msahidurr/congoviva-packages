import React from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string;
  title: string;
  colors?: {
    primary?: string;
  };
}

interface VideoEmbedProps {
  url: string;
  title: string;
  platform: string;
  colors?: {
    primary?: string;
  };
}

export const VideoEmbed = ({ url, title, platform, colors }: VideoEmbedProps) => {
  const [showPlayer, setShowPlayer] = React.useState(false);
  
  if (showPlayer) {
    if (platform === 'video') {
      return (
        <div className="w-full h-32 overflow-hidden rounded">
          <video
            src={url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            title={title}
          />
        </div>
      );
    }
    
    return (
      <div className="w-full relative overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={platform === 'youtube' ? `${url}?autoplay=1&modestbranding=1&rel=0` : url}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }
  
  // Get thumbnail based on platform
  const getThumbnail = () => {
    if (platform === 'youtube') {
      // Extract video ID from various YouTube URL formats
      let videoId = null;
      
      // Try embed URL format
      const embedMatch = url.match(/embed\/([^?&]+)/);
      if (embedMatch) {
        videoId = embedMatch[1];
      } else {
        // Try watch URL format
        const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (watchMatch) {
          videoId = watchMatch[1];
        }
      }
      
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    if (platform === 'vimeo') {
      const videoId = url.match(/video\/([^?]+)/)?.[1];
      return `https://vumbnail.com/${videoId}.jpg`;
    }
    return null;
  };
  
  const thumbnail = getThumbnail();
  
  return (
    <div 
      className="w-full relative overflow-hidden cursor-pointer" 
      style={{ paddingBottom: '56.25%', height: 0 }}
      onClick={() => setShowPlayer(true)}
    >
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <Play className="w-12 h-12 text-white" />
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center hover:opacity-80 transition-colors ${
          platform === 'youtube' ? 'bg-red-600' : 'bg-blue-600'
        }`}>
          <Play className="w-8 h-8 ml-1 text-white" />
        </div>
      </div>
    </div>
  );
};

// Keep YouTube component for backward compatibility
export const YouTubeEmbed = ({ url, title, colors }: YouTubeEmbedProps) => {
  return <VideoEmbed url={url} title={title} platform="youtube" colors={colors} />;
};

// Helper function to extract and process video URL
export const extractVideoUrl = (embedUrl: string) => {
  if (!embedUrl) return null;
  
  // Extract src from iframe HTML
  if (embedUrl.includes('<iframe')) {
    const srcMatch = embedUrl.match(/src=["']([^"']+)["']/i);
    const extractedUrl = srcMatch ? srcMatch[1] : null;
    
    if (!extractedUrl) return null;
    
    // Check video platform
    if (extractedUrl.includes('youtube.com') || extractedUrl.includes('youtu.be')) {
      // Ensure YouTube embed URL is properly formatted
      let youtubeUrl = extractedUrl;
      if (!youtubeUrl.includes('/embed/')) {
        // Convert watch URL to embed URL
        const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (videoIdMatch) {
          youtubeUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }
      }
      return { url: youtubeUrl, platform: 'youtube' };
    }
    if (extractedUrl.includes('vimeo.com')) {
      return { url: extractedUrl, platform: 'vimeo' };
    }
    if (extractedUrl.includes('dailymotion.com')) {
      return { url: extractedUrl, platform: 'dailymotion' };
    }
    
    // Check if it's a direct video file
    if (extractedUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
      return { url: extractedUrl, platform: 'video' };
    }
    
    // Default to iframe for other embed URLs
    return { url: extractedUrl, platform: 'iframe' };
  }
  
  // Handle direct URLs
  if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
    // Convert YouTube watch URL to embed URL
    let youtubeUrl = embedUrl;
    if (!youtubeUrl.includes('/embed/')) {
      const videoIdMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (videoIdMatch) {
        youtubeUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    }
    return { url: youtubeUrl, platform: 'youtube' };
  }
  if (embedUrl.includes('vimeo.com')) {
    return { url: embedUrl, platform: 'vimeo' };
  }
  if (embedUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
    return { url: embedUrl, platform: 'video' };
  }
  
  return { url: embedUrl, platform: 'iframe' };
};