/**
 * Utility functions for handling image URL conversion in vCard templates
 */
const getStorageType = (): string => {
  return (
    (window as any).page?.props?.globalSettings?.storage_type ||
    (window as any).page?.props?.storage_type ||
    'local'
  );
};

const isCloudStorage = (): boolean => {
  const storageType = getStorageType();
  return storageType === 'aws_s3' || storageType === 's3' || storageType === 'wasabi';
};

/**
 * Convert any image path/URL to a proper display URL
 * @param imagePath - The image path or URL to convert
 * @returns Properly formatted URL for display
 */
export const getImageDisplayUrl = (imagePath: string): string => {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return '';
  }
  
  const cleanPath = imagePath.trim();
  const cloudStorage = isCloudStorage();
  
  // Handle local:media/ URLs - convert to media/ format
  if (cleanPath.startsWith('local:media/')) {
    const mediaPath = cleanPath.substring(6); // Remove 'local:' prefix, keep 'media/'
    const baseUrl = (window as any).page?.props?.base_url || window.location.origin;
    return `${baseUrl}/storage/${mediaPath}`;
  }
  
  // If it's already a full URL, check if it needs base URL correction
  if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
    const baseUrl = (window as any).page?.props?.base_url || (window as any).page?.props?.globalSettings?.base_url;
    if (!cloudStorage && baseUrl && cleanPath.includes('/storage/') && !cleanPath.startsWith(baseUrl)) {
      // Extract the storage path and rebuild with correct base URL
      const storageIndex = cleanPath.indexOf('/storage/');
      const storagePath = cleanPath.substring(storageIndex);
      return baseUrl + storagePath;
    }
    return cleanPath;
  }
  
   // Try multiple possible locations for image_url
  const imageUrl = (window as any).page?.props?.image_url || 
                   (window as any).page?.props?.globalSettings?.image_url ||
                   (window as any).appSettings?.image_url ||
                   '/storage/';

  // For cloud/CDN storage, media files live directly under the prefix, not /storage/.
  if (cloudStorage) {
    const finalPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
    return imageUrl.endsWith('/') ? `${imageUrl}${finalPath}` : `${imageUrl}/${finalPath}`;
  }
  
  // For local storage only
  if (imageUrl === '/storage/') {
    const baseUrl = (window as any).page?.props?.base_url || window.location.origin;
    let url = `${baseUrl}/storage/${cleanPath}`;

    // remove duplicated storage segments
    url = url.replace(/storage\/+storage/g, 'storage');

    return url;
  }
  
  // For local base URL (not cloud storage)
  if (imageUrl.startsWith('http') && !imageUrl.includes('amazonaws') && !imageUrl.includes('wasabi') && !imageUrl.includes('storage')) {
    let url = `${imageUrl}/storage/${cleanPath}`;

    // remove duplicated storage segments
    url = url.replace(/storage\/+storage/g, 'storage');

    return url;
  }
  
  // Remove leading slash from path if imageUrl already has trailing slash
  const finalPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
  
  return imageUrl.endsWith('/') ? `${imageUrl}${finalPath}` : `${imageUrl}/${finalPath}`;
};
/**
 * Convert full URL to relative path for storage
 * @param url - The full URL to convert
 * @returns Relative path for storage
 */
export const convertUrlToRelativePath = (url: string): string => {
  if (!url || typeof url !== 'string') {
    return url || '';
  }
  
  const cleanUrl = url.trim();
  
  // Handle local:media/ URLs - convert to media/ format
  if (cleanUrl.startsWith('local:media/')) {
    return cleanUrl.substring(6); // Remove 'local:' prefix, keep 'media/'
  }
  
  // If it's already a relative path without /storage/, return as is
  if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/storage/')) {
    return cleanUrl;
  }
  
  // Handle URLs that start with /storage/ - convert to relative path
  if (cleanUrl.startsWith('/storage/')) {
    return cleanUrl.substring(9); // Remove '/storage/' prefix
  }
  
  // For full URLs, extract the path after /storage/
  if (cleanUrl.startsWith('http')) {
    const storageIndex = cleanUrl.indexOf('/storage/');
    if (storageIndex !== -1) {
      return cleanUrl.substring(storageIndex + 9);
    }
    
    // Extract media path from URL
    try {
      const urlObj = new URL(cleanUrl);
      const pathname = urlObj.pathname;
      
      // Look for media pattern in pathname
      if (pathname.includes('media/')) {
        const mediaIndex = pathname.indexOf('media/');
        return pathname.substring(mediaIndex);
      }
      
      // Fallback: return last segments if it has file extension
      const segments = pathname.split('/').filter(s => s);
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment.includes('.')) {
          return segments.length > 1 ? segments.slice(-2).join('/') : lastSegment;
        }
      }
    } catch (e) {
      // Invalid URL, return as is
    }
  }
  
  return cleanUrl;
};
/**
 * Check if a string is a media URL
 * @param url - The URL to check
 * @returns True if it's a media URL
 */
export const isMediaUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  const cleanUrl = url.trim();
  
  // Check for common media patterns
  const mediaPatterns = [
    '/storage/',
    'media/',
    '/media/',
    '/uploads/',
    '/images/',
    '/files/'
  ];
  
  // Check for media file extensions
  const mediaExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.txt', '.csv',
    '.mp4', '.avi', '.mov', '.mp3', '.wav'
  ];
  
  // Check if URL contains media patterns
  const hasMediaPattern = mediaPatterns.some(pattern => cleanUrl.includes(pattern));
  
  // Check if URL has media file extension
  const hasMediaExtension = mediaExtensions.some(ext => 
    cleanUrl.toLowerCase().includes(ext.toLowerCase())
  );
  
  return hasMediaPattern || hasMediaExtension;
};