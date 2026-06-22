import React, { useEffect } from 'react';
import SocialIcon from './SocialIcon';
import { getTheme, getDisplayUrl } from '../themes';
import { BioLinkData } from '../types';
import { useTranslation } from 'react-i18next';

interface BioLinkPreviewProps {
  data: BioLinkData;
}

export default function BioLinkPreview({ data }: BioLinkPreviewProps) {
  const { t } = useTranslation();
  
  // Handle case where data or config is missing
  if (!data || !data.config) {
    return (
      <div className="w-full min-h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">No Data Available</h2>
          <p className="text-gray-500">Bio link data is missing or invalid.</p>
        </div>
      </div>
    );
  }
  
  const { background, buttonColor, buttonTextColor, textColor, font, theme } = data.config || {};
  
  // Get theme object and layout style
  const themeObj = getTheme(theme || 'personal');
  
  // Apply custom CSS from theme if available
  useEffect(() => {
    if (themeObj.customCSS) {
      // Create a unique ID for the style element
      const styleId = `theme-custom-css-${theme}`;
      
      // Check if the style element already exists
      let styleEl = document.getElementById(styleId);
      
      // If it doesn't exist, create it
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = themeObj.customCSS;
        document.head.appendChild(styleEl);
      } else {
        // Update existing style element
        styleEl.innerHTML = themeObj.customCSS;
      }
      
      // Cleanup function to remove the style element when component unmounts
      return () => {
        const styleToRemove = document.getElementById(styleId);
        if (styleToRemove) {
          styleToRemove.remove();
        }
      };
    }
  }, [theme, themeObj.customCSS]);
  
  // Get theme layout style
  const getThemeLayout = () => {
    return {
      layout: themeObj.layout || 'standard',
      buttonStyle: themeObj.buttonStyle || 'rounded',
      socialPosition: themeObj.socialPosition || 'top',
      profileStyle: themeObj.profileStyle || 'circle'
    };
  };
  
  const { layout, buttonStyle, socialPosition, profileStyle } = getThemeLayout();
  
  // Get background style based on settings
  const getBackgroundStyle = () => {
    if (!background) return { backgroundColor: '#ffffff' };
    
    switch (background.type) {
      case 'color':
        return { backgroundColor: background.color || '#ffffff' };
      case 'gradient':
        return { background: background.gradient || 'linear-gradient(135deg, #667eea, #764ba2)' };
      case 'image':
        return { 
          backgroundImage: `url(${getDisplayUrl(background.image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return { backgroundColor: background.color || '#ffffff' };
    }
  };

  // Get button style based on theme
  const getButtonStyle = () => {
    switch (buttonStyle) {
      case 'pill':
        return { 
          borderRadius: '9999px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          padding: '10px 20px'
        };
      case 'square':
        return { 
          borderRadius: '0px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: '4px solid rgba(255,255,255,0.2)'
        };
      case 'soft':
        return { 
          borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        };
      case 'rounded':
      default:
        return { 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        };
    }
  };
  
  // Get layout style
  const getLayoutStyle = () => {
    switch (layout) {
      case 'compact':
        return {
          header: 'p-4',
          profileSize: 'w-16 h-16',
          linksContainer: 'p-3 space-y-2',
          linkItem: 'p-2 text-sm'
        };
      case 'card':
        return {
          header: 'p-6 bg-white/90 shadow-sm mb-4 mx-4 mt-4 rounded-lg',
          profileSize: 'w-20 h-20',
          linksContainer: 'px-4 pb-4 space-y-3',
          linkItem: 'p-3 flex justify-between items-center'
        };
      case 'minimal':
        return {
          header: 'p-8',
          profileSize: 'w-20 h-20',
          linksContainer: 'p-4 space-y-4',
          linkItem: 'p-3 border-0 bg-transparent border-b border-white/20'
        };
      case 'standard':
      default:
        return {
          header: 'p-6',
          profileSize: 'w-24 h-24',
          linksContainer: 'p-4 space-y-3',
          linkItem: 'p-3'
        };
    }
  };
  
  const layoutStyle = getLayoutStyle();
  const buttonStyleObj = getButtonStyle();
  
  // Prepare props for theme render functions
  const themeRenderProps = {
    data,
    layoutStyle,
    buttonStyle: buttonStyleObj,
    textColor,
    buttonColor,
    buttonTextColor,
    font,
    t
  };
  
  return (
    <div className={`w-full min-h-full overflow-auto border-1 rounded-lg bio-link-container ${theme === 'business' ? 'business-theme' : ''} ${theme === 'portfolio' ? 'portfolio-theme' : ''} ${theme === 'minimal' ? 'minimal-theme' : ''}`} style={{ fontFamily: font, ...getBackgroundStyle() }}>
      {/* Decorative elements */}
      {themeObj.renderDecorativeElements && themeObj.renderDecorativeElements(themeRenderProps)}
      
      {/* Use theme-specific container if available */}
      {themeObj.renderContainer ? (
        themeObj.renderContainer(themeRenderProps)
      ) : (
        <>
          <div className={`${theme !== 'business' ? 'flex flex-col items-center text-center' : ''} ${layoutStyle.header} bio-link-header`} style={{ color: textColor }}>
            {/* Profile section */}
            {themeObj.renderProfile ? (
              themeObj.renderProfile(themeRenderProps)
            ) : (
              <div className="flex flex-col items-center">
                <div className={`${layoutStyle.profileSize} overflow-hidden mb-4 rounded-full`}>
                  {data.config.header.profile_image ? (
                    <img src={getDisplayUrl(data.config.header.profile_image)} alt={data.config.header.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-xl font-bold">
                      {data.config.header.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h1 className="text-xl font-bold mb-1">{data.config.header.name}</h1>
                <p className="text-sm opacity-80">{data.config.header.tagline}</p>
              </div>
            )}
            
            {/* Social icons at the top position */}
            {data.config.social?.display && data.config.social.items.length > 0 && 
              (socialPosition === 'top' || socialPosition === 'floating') && 
              themeObj.renderSocial && themeObj.renderSocial(themeRenderProps)}
          </div>
          
          <div className="flex flex-col p-4">
            {/* Inline social icons */}
            {data.config.social?.display && data.config.social.items.length > 0 && 
              (socialPosition === 'inline' || socialPosition === 'inline-code') && 
              themeObj.renderSocial && themeObj.renderSocial(themeRenderProps)}
            
            {/* Links */}
            {themeObj.renderLinks && themeObj.renderLinks(themeRenderProps)}
            
            {/* Social icons at the bottom position */}
            {data.config.social?.display && data.config.social.items.length > 0 && 
              (socialPosition === 'bottom' || socialPosition === 'hidden') && 
              themeObj.renderSocial && themeObj.renderSocial(themeRenderProps)}
          </div>
        </>
      )}
    </div>
  );
}