import React from 'react';
import { useStableIframe } from '@/hooks/useStableHtml';

interface CustomHtmlRendererProps {
  customHtmlData: any;
  colors: any;
  font: string;
  t: (key: string) => string;
}

/**
 * Shared custom HTML renderer that prevents iframe reloading
 * This component can be used across all business templates
 */
export const CustomHtmlRenderer: React.FC<CustomHtmlRendererProps> = ({
  customHtmlData,
  colors,
  font,
  t
}) => {
  // Memoize custom HTML content to prevent iframe reloading
  const customHtmlContent = React.useMemo(() => {
    if (!customHtmlData?.html_content) return null;
    
    return {
      html_content: customHtmlData.html_content,
      section_title: customHtmlData.section_title,
      show_title: customHtmlData.show_title
    };
  }, [customHtmlData?.html_content, customHtmlData?.section_title, customHtmlData?.show_title]);

  // Use stable iframe hook to prevent reloading
  const stableHtmlRef = useStableIframe(customHtmlContent?.html_content || '');

  if (!customHtmlContent) return null;

  return (
    <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderColor || '#334155'}` }}>
      {customHtmlContent.show_title && customHtmlContent.section_title && (
        <h3 className="font-semibold text-sm mb-3" style={{ color: colors.text, fontFamily: font }}>
          {customHtmlContent.section_title}
        </h3>
      )}
      <div 
        className="custom-html-content p-3 rounded-lg" 
        style={{ 
          backgroundColor: colors.cardBg || colors.background || '#f8f9fa',
          border: `1px solid ${colors.borderColor || '#e9ecef'}`,
          fontFamily: font,
          color: colors.text
        }}
      >
        <style>
          {`
            .custom-html-content h1, .custom-html-content h2, .custom-html-content h3, .custom-html-content h4, .custom-html-content h5, .custom-html-content h6 {
              color: ${colors.primary};
              margin-bottom: 0.5rem;
              font-family: ${font};
            }
            .custom-html-content p {
              color: ${colors.text};
              margin-bottom: 0.5rem;
              font-family: ${font};
            }
            .custom-html-content a {
              color: ${colors.primary};
              text-decoration: underline;
            }
            .custom-html-content ul, .custom-html-content ol {
              color: ${colors.text};
              padding-left: 1rem;
              font-family: ${font};
            }
            .custom-html-content code {
              background-color: ${colors.primary}20;
              color: ${colors.primary};
              padding: 0.125rem 0.25rem;
              border-radius: 0.25rem;
              font-family: monospace;
            }
            .custom-html-content iframe {
              max-width: 100%;
              border: none;
            }
          `}
        </style>
        {/* Use stable iframe container instead of dangerouslySetInnerHTML */}
        <div ref={stableHtmlRef} />
      </div>
    </div>
  );
};

/**
 * Hook for rendering custom HTML section in business templates
 */
export const useCustomHtmlRenderer = (customHtmlData: any, colors: any, font: string, t: (key: string) => string) => {
  return React.useCallback(() => {
    if (!customHtmlData?.html_content) return null;
    
    return (
      <CustomHtmlRenderer 
        customHtmlData={customHtmlData}
        colors={colors}
        font={font}
        t={t}
      />
    );
  }, [customHtmlData, colors, font, t]);
};