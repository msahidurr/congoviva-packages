import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import SocialIcon from '@/pages/link-bio-builder/components/SocialIcon';
import QRCode from 'qrcode';
import { toast } from '@/components/custom-toast';
import { useTranslation } from 'react-i18next';

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  colors?: any;
  font?: string;
  socialLinks?: any[];
  qrSize?: 'small' | 'medium' | 'large';
  forceOpen?: boolean;
}

export function QRShareModal({ isOpen, onClose, url, colors, font, socialLinks = [], qrSize = 'medium', forceOpen = false }: QRShareModalProps) {
  const { t } = useTranslation();
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return url;

    const isPreviewPage = window.location.pathname.includes('vcard-preview');
    if (!isPreviewPage) return url;

    try {
      const storedData = localStorage.getItem('vcard_preview_data');
      if (!storedData) return url;

      const previewData = JSON.parse(storedData);
      const slug = previewData?.slug?.trim();
      const urlPrefix = previewData?.url_prefix?.trim();

      if (!slug || slug === 'preview') {
        return url;
      }

      return urlPrefix
        ? route('public.vcard.show', { prefix: urlPrefix, slug }, true)
        : route('public.vcard.show.direct', slug, true);
    } catch (error) {
      console.error('Error resolving preview share URL:', error);
      return url;
    }
  }, [url]);
  
  // Check if we're in builder/edit mode by looking for builder-specific elements
  const isInBuilderMode = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    // Check for builder-specific elements or classes
    const hasBuilderElements = 
      document.querySelector('.business-card-container') !== null ||
      document.querySelector('[class*="Live Preview"]') !== null ||
      document.querySelector('[class*="vcard-builder"]') !== null ||
      window.location.pathname.includes('/vcard-builder/') ||
      window.location.pathname.includes('/edit') ||
      window.location.pathname.includes('/create') ||
      window.location.pathname.includes('/dashboard');
    
    return hasBuilderElements;
  }, []);
  
  // Don't open modal in builder mode (unless forceOpen is set)
  const shouldOpen = isOpen && (forceOpen || !isInBuilderMode);

  const qrPixelSize = qrSize === 'small' ? 150 : qrSize === 'large' ? 300 : 200;

  useEffect(() => {
    if (shouldOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: qrPixelSize,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      })
      .then(setQrUrl)
      .catch(console.error);
    }
  }, [shouldOpen, shareUrl, qrPixelSize]);

  const handleDownload = () => {
    if (qrUrl) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = qrUrl;
      link.click();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Contact',
          text: 'Check out my digital business card',
          url: shareUrl
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const text = encodeURIComponent('Check out my digital business card');
    
    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${text}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const getSocialIcon = (platform: string) => {
    return <SocialIcon platform={platform} color={getSocialColor(platform)} />;
  };

  const getSocialColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return '#1877F2';
      case 'twitter': return '#1DA1F2';
      case 'linkedin': return '#0A66C2';
      case 'whatsapp': return '#25D366';
      case 'telegram': return '#0088CC';
      default: return modalPrimary;
    }
  };

  const handleCopyLink = () => {
    // Fallback clipboard function for HTTP environments
    const copyToClipboard = (text: string) => {
      if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API for HTTPS
        return navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((resolve, reject) => {
          if (document.execCommand('copy')) {
            textArea.remove();
            resolve();
          } else {
            textArea.remove();
            reject(new Error('Copy failed'));
          }
        });
      }
    };
    copyToClipboard(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Silent fail
      });
  };

  const modalColors = colors || { primary: '#3B82F6', background: '#FFFFFF', text: '#1F2937', borderColor: '#E5E7EB' };
  const modalBg = modalColors.codeBlock || modalColors.background || '#FFFFFF';
  const modalText = modalColors.text;
  const modalBorder = modalColors.primary;
  const modalPrimary = modalColors.primary;
  const modalAccent = modalColors.accent;
  const modalFont = font || 'Inter, sans-serif';

  return (
    <Dialog open={shouldOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md p-0 [&>button]:hidden" 
        style={{ 
          backgroundColor: modalBg,
          fontFamily: modalFont,
          color: modalText,
          zIndex: 55
        }}
      >
        <DialogTitle className="sr-only">Share QR Code</DialogTitle>
        <DialogDescription className="sr-only">Scan this QR code to access my digital business card</DialogDescription>
        <div 
          className="flex items-center justify-between p-4" 
          style={{ borderBottom: `1px solid ${modalBorder}` }}
        >
          <h3 
            className="text-lg font-semibold" 
            style={{ color: modalText, fontFamily: modalFont }}
          >
            Share QR Code
          </h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-opacity-20"
            style={{ 
              color: modalText,
              ':hover': { backgroundColor: modalPrimary + '20' }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = modalPrimary + '20';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 text-center">
          <div className="mb-4">
            {qrUrl ? (
              <img 
                src={qrUrl} 
                alt="QR Code" 
                className="mx-auto rounded-lg" 
                style={{ 
                  width: qrPixelSize,
                  height: qrPixelSize,
                  border: `2px solid ${modalPrimary}` 
                }}
              />
            ) : (
              <div 
                className="mx-auto rounded-lg flex items-center justify-center" 
                style={{ 
                  width: qrPixelSize,
                  height: qrPixelSize,
                  border: `2px solid ${modalPrimary}`,
                  backgroundColor: modalAccent
                }}
              >
                <span style={{ color: modalText, opacity: 0.6, fontFamily: modalFont }}>Loading...</span>
              </div>
            )}
          </div>
          
          <p 
            className="text-sm mb-6" 
            style={{ color: modalText, opacity: 0.8, fontFamily: modalFont }}
          >
            Scan this QR code to access my digital business card
          </p>
          
          <div className="relative">
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                className="flex items-center gap-2" 
                style={{ 
                  borderColor: modalPrimary,
                  color: modalPrimary,
                  fontFamily: modalFont
                }}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <Button 
                onClick={handleCopyLink} 
                variant="outline" 
                className="flex items-center gap-2" 
                style={{ 
                  borderColor: modalPrimary,
                  color: modalPrimary,
                  fontFamily: modalFont
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              
              <Button 
                onClick={socialLinks.length === 0 ? handleShare : () => setShowSocialIcons(!showSocialIcons)}
                className="flex items-center gap-2" 
                style={{ 
                  backgroundColor: modalPrimary,
                  color: modalBg,
                  fontFamily: modalFont
                }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
            
            {socialLinks.length > 0 && showSocialIcons && (
              <div 
                className="mt-4 flex justify-center"
              >
                <div 
                  className="bg-white border rounded-lg shadow-xl p-3"
                  style={{ 
                    backgroundColor: modalBg, 
                    borderColor: modalBorder,
                    boxShadow: `0 10px 25px ${modalPrimary}20`
                  }}
                >
                  <div className="flex gap-3">
                    {socialLinks.slice(0, 4).map((link, index) => {
                      const socialColor = getSocialColor(link.platform);
                      return (
                        <button
                          key={index}
                          onClick={() => handleSocialShare(link.platform)}
                          className="p-3 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
                          style={{ 
                            color: socialColor,
                            backgroundColor: socialColor + '10',
                            border: `1px solid ${socialColor}30`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = socialColor + '20';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = socialColor + '10';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                          title={`Share on ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            {getSocialIcon(link.platform)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
