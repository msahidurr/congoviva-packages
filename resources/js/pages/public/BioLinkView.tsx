import React from 'react';
import { Head } from '@inertiajs/react';
import BioLinkPreview from '../link-bio-builder/components/BioLinkPreview';

interface BioLinkViewProps {
  bioLink: any;
}

export default function BioLinkView({ bioLink }: BioLinkViewProps) {
  
  // Set document title from SEO settings if available
  const pageTitle = bioLink?.config?.seo?.title || bioLink?.name || 'Bio Link';
  
  // Set meta description from SEO settings if available
  const metaDescription = bioLink?.config?.seo?.description || `Bio Link for ${bioLink?.name || 'User'}`;
  
  // Set meta keywords from SEO settings if available
  const metaKeywords = bioLink?.config?.seo?.keywords || '';
  
  // Set OG image from SEO settings if available
  const ogImage = bioLink?.config?.seo?.og_image || '';
  
  // Handle case where bioLink is null or undefined
  if (!bioLink) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">Bio Link Not Found</h1>
          <p className="text-gray-500">The requested bio link could not be found.</p>
        </div>
      </div>
    );
  }
  
  // Add analytics scripts if configured
  React.useEffect(() => {
    const analytics = bioLink.config?.analytics;
    
    if (analytics?.google_analytics) {
      // Add Google Analytics script
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.google_analytics}`;
      document.head.appendChild(gaScript);
      
      const gaConfigScript = document.createElement('script');
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${analytics.google_analytics}');
      `;
      document.head.appendChild(gaConfigScript);
    }
    
    if (analytics?.facebook_pixel) {
      // Add Facebook Pixel script
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${analytics.facebook_pixel}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
    }
    
    if (analytics?.custom_code) {
      // Add custom analytics code
      const customScript = document.createElement('script');
      customScript.innerHTML = analytics.custom_code;
      document.head.appendChild(customScript);
    }
    
    // Cleanup function to remove scripts when component unmounts
    return () => {
      document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(el => el.remove());
      document.querySelectorAll('script[src*="connect.facebook.net"]').forEach(el => el.remove());
    };
  }, [bioLink.config?.analytics]);
  
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {metaKeywords && <meta name="keywords" content={metaKeywords} />}
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Head>
      
      <div className="min-h-screen flex justify-center">
        <div className="w-full max-w-md">
          <BioLinkPreview data={bioLink} isPublic={true} />
        </div>
      </div>
    </>
  );
}