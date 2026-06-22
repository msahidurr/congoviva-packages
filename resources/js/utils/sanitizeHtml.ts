/**
 * HTML sanitization utility to prevent XSS attacks
 */

// Simple HTML sanitization function
export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

// Sanitize text content for safe display
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize URL to prevent javascript: and data: URLs
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  const lowerUrl = url.toLowerCase().trim();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#';
    }
  }
  
  return url;
};

// Validate and sanitize embed URLs
export const sanitizeEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Only allow trusted domains for embeds
  const trustedDomains = [
    'youtube.com',
    'youtu.be',
    'vimeo.com',
    'dailymotion.com',
    'wistia.com',
    'brightcove.com'
  ];
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check if domain is trusted
    const isTrusted = trustedDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );
    
    if (!isTrusted) {
      return '';
    }
    
    return url;
  } catch {
    return '';
  }
};