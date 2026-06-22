import React from 'react';

interface CustomCssJsProps {
  configSections: any;
  planFeatures?: any;
}

export default function CustomCssJs({ configSections, planFeatures }: CustomCssJsProps) {
  // Check if plan allows custom CSS/JS AND business has it enabled
  const canUseCustomCssJs = planFeatures?.custom_css_js === true && configSections?.custom_css_js?.enabled === true;
  
  // Execute custom JavaScript
  React.useEffect(() => {
    if (canUseCustomCssJs && configSections?.custom_css_js?.enabled && configSections?.custom_css_js?.js) {
      try {
        // Execute JS with a small delay to ensure DOM is ready
        setTimeout(() => {
          new Function(configSections.custom_css_js.js)();
        }, 100);
      } catch (error) {
        console.error('Custom JS error:', error);
      }
    }
  }, [configSections?.custom_css_js?.js, configSections?.custom_css_js?.enabled, canUseCustomCssJs]);

  // Scope CSS to business card container only
  const scopedCss = React.useMemo(() => {
    if (!canUseCustomCssJs || !configSections?.custom_css_js?.enabled || !configSections?.custom_css_js?.css) {
      return '';
    }
    
    // Add .business-card-container prefix to all CSS rules
    return configSections.custom_css_js.css
      .replace(/([^{}]+){/g, '.business-card-container $1 {')
      .replace(/\.business-card-container\s*\*/g, '.business-card-container *');
  }, [configSections?.custom_css_js?.css, configSections?.custom_css_js?.enabled, canUseCustomCssJs]);

  return (
    <>
      {/* Scoped Custom CSS */}
      {scopedCss && (
        <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      )}
    </>
  );
}