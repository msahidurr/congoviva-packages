import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import VCardPreview from '@/pages/vcard-builder/components/VCardPreview';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import ContactFormModal from '@/components/ContactFormModal';
import AppointmentFormModal from '@/components/AppointmentFormModal';
import PWAInstallPopup from '@/components/PWAInstallPopup';
import { QRShareModal } from '@/components/QRShareModal';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useFavicon } from '@/hooks/use-favicon';
import CustomCssJs from '@/components/CustomCssJs';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';

interface Business {
  id: number;
  name: string;
  slug: string;
  business_type: string;
  config_sections: any;
  favicon?: string;
}

interface Props {
  business: Business;
  pwa_enabled?: boolean;
  manifest_url?: string;
  planFeatures?: {
    business_template_sections?: string[];
    [key: string]: any;
  };
  userRole?: string;
  seo_data?: {
    meta_title?: string;
    meta_description?: string;
    keywords?: string;
    og_image?: string;
  };
}

export default function VCardView({ business, pwa_enabled, manifest_url, planFeatures, seo_data }: Props) {
  const { flash } = usePage().props as any;
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  
  const [installDismissed, setInstallDismissed] = useState(false);
  const [isPwaAlreadyInstalled, setIsPwaAlreadyInstalled] = useState(false);
  const { canInstall, install } = usePWAInstall();
  
  // Check if PWA already installed for this business (client-side only)
  useEffect(() => {
    const businessPwaKey = `pwa-installed-${business.id}-${business.slug}`;
    const dismissedKey = `pwa-dismissed-${business.id}-${business.slug}`;
    const isInstalled = localStorage.getItem(businessPwaKey) === 'true';
    const isDismissed = localStorage.getItem(dismissedKey) === 'true';
    
    setIsPwaAlreadyInstalled(isInstalled);
    setInstallDismissed(isDismissed);
  }, [business.id, business.slug]);
  // Use business favicon if available, otherwise default
  useEffect(() => {
    const faviconUrl = business.favicon ? getImageDisplayUrl(business.favicon) : '/favicon.ico';
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    link.href = faviconUrl;
  }, [business.favicon]);
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  
  // Listen for custom events from template buttons
  useEffect(() => {
    const handleOpenContactModal = () => setContactModalOpen(true);
    const handleOpenAppointmentModal = () => setAppointmentModalOpen(true);
    const handleOpenQrModal = () => setShowQrModal(true);
    
    window.addEventListener('openContactModal', handleOpenContactModal);
    window.addEventListener('openAppointmentModal', handleOpenAppointmentModal);
    window.addEventListener('openQrModal', handleOpenQrModal);
    
    return () => {
      window.removeEventListener('openContactModal', handleOpenContactModal);
      window.removeEventListener('openAppointmentModal', handleOpenAppointmentModal);
      window.removeEventListener('openQrModal', handleOpenQrModal);
    };
  }, []);
  
// PWA Install functionality
  useEffect(() => {
    if (!business.config_sections?.pwa?.enabled || isPwaAlreadyInstalled) return;
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      const currentPath = window.location.pathname;
      const swUrl = `${window.appSettings?.baseUrl || window.location.origin}/sw.js?business=${business.id}&slug=${business.slug}&v=${Date.now()}`;
      
      // Use current path as scope for better PWA detection
      const scope = currentPath.endsWith('/') ? currentPath : currentPath + '/';
      
      navigator.serviceWorker.register(swUrl, {
        scope: scope,
        updateViaCache: 'none'
      })
        .then(registration => {
          
          // Force immediate activation
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('PWA: Service worker registration failed:', error);
        });
    }
  }, [business.id, business.config_sections?.pwa?.enabled]);
  

  
  // Show install popup after delay if PWA enabled and not already installed for this business
  useEffect(() => {
    const isInPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone === true;
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    
    
    if (!isPwaAlreadyInstalled && !installDismissed && business.config_sections?.pwa?.enabled && isSecure && !isInPWA) {
      const timer = setTimeout(() => {
        setShowInstallPopup(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isPwaAlreadyInstalled, installDismissed, business.config_sections?.pwa?.enabled, business.id, business.slug]);
  
  const handleInstallClick = async () => {
    setShowInstallPopup(false);
    
    const result = await install();
    const businessPwaKey = `pwa-installed-${business.id}-${business.slug}`;
    
    if (result === 'accepted') {
      localStorage.setItem(businessPwaKey, 'true');
      setIsPwaAlreadyInstalled(true);
      toast.success('App installed successfully!');
    } else if (result === 'dismissed') {
      toast.info('Installation cancelled');
    } else if (result === 'unavailable') {
      // Fallback for browsers that don't support beforeinstallprompt
      toast.info('To install: Open browser menu → Add to Home Screen', {
        duration: 5000
      });
      
      // Still mark as "installed" for UX purposes
      localStorage.setItem(businessPwaKey, 'true');
      setIsPwaAlreadyInstalled(true);
    }
  };
  
  const handleClosePopup = () => {
    setShowInstallPopup(false);
    setInstallDismissed(true);
    localStorage.setItem(`pwa-dismissed-${business.id}-${business.slug}`, 'true');
  };
  
  const template = getBusinessTemplate(business.business_type);
  
  const data = {
    name: business.name,
    business_type: business.business_type,
    config_sections: business.config_sections,
    planFeatures: planFeatures,
    planRestrictedSections: planFeatures?.business_template_sections || []
  };

  const colors = { primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B', text: '#E2E8F0', ...(template?.defaultColors ?? {}), ...(business?.config_sections?.colors ?? {}) };
  const pwaConfig = business.config_sections?.pwa;
  const seoConfig = business.config_sections?.seo;
  const pixelConfig = business.config_sections?.pixels;
  
  // Merge business SEO config with global SEO data (global as fallback)
  const finalSeoData = {
    meta_title: seoConfig?.meta_title || seo_data?.meta_title || business.name,
    meta_description: seoConfig?.meta_description || seo_data?.meta_description,
    keywords: seoConfig?.keywords || seo_data?.keywords,
    og_image: seoConfig?.og_image || seo_data?.og_image
  };

  const getManifestUrl = () => manifest_url || '';
  return (
    <>
      <Head title={finalSeoData.meta_title}>
        {/* SEO Meta Tags */}
        {(seoConfig || seo_data) && [
          finalSeoData.meta_description && <meta key="description" name="description" content={finalSeoData.meta_description} />,
          finalSeoData.keywords && <meta key="keywords" name="keywords" content={finalSeoData.keywords} />,
          finalSeoData.og_image && <meta key="og:image" property="og:image" content={finalSeoData.og_image} />,
          finalSeoData.meta_title && <meta key="og:title" property="og:title" content={finalSeoData.meta_title} />,
          finalSeoData.meta_description && <meta key="og:description" property="og:description" content={finalSeoData.meta_description} />,
          <meta key="og:type" property="og:type" content="profile" />,
          <meta key="twitter:card" name="twitter:card" content="summary_large_image" />,
          finalSeoData.meta_title && <meta key="twitter:title" name="twitter:title" content={finalSeoData.meta_title} />,
          finalSeoData.meta_description && <meta key="twitter:description" name="twitter:description" content={finalSeoData.meta_description} />,
          finalSeoData.og_image && <meta key="twitter:image" name="twitter:image" content={finalSeoData.og_image} />
        ].filter(Boolean)}
        
          {/* PWA Meta Tags */}
        {pwaConfig?.enabled && [
          <link key="manifest" rel="manifest" href={getManifestUrl()} />,
          <meta key="theme-color" name="theme-color" content={pwaConfig.theme_color || '#000000'} />,
          <meta key="mobile-capable" name="mobile-web-app-capable" content="yes" />,
          <meta key="apple-status" name="apple-mobile-web-app-status-bar-style" content="default" />,
          <meta key="apple-title" name="apple-mobile-web-app-title" content={pwaConfig.name || business.name} />,
          <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
        ]}
        
        {/* Custom Head Code */}
        {(pixelConfig?.enabled || pixelConfig?.custom_head) && pixelConfig?.custom_head && (
          <>
            <script dangerouslySetInnerHTML={{
              __html: `console.log('Loading Custom Head Code');`
            }} />
            <script dangerouslySetInnerHTML={{ __html: pixelConfig.custom_head }} />
          </>
        )}
      </Head>
      <Toaster position="top-right" richColors />
      
      {/* Pixel Tracking Codes */}
      {(pixelConfig?.enabled || (pixelConfig && (pixelConfig.google_analytics || pixelConfig.facebook_pixel || pixelConfig.gtm_id || pixelConfig.custom_head || pixelConfig.custom_body))) && (
        <>
          {/* Google Analytics */}
          {pixelConfig.google_analytics && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${pixelConfig.google_analytics}`} />
              <script dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${pixelConfig.google_analytics}');
                `
              }} />
            </>
          )}
          
          {/* Facebook Pixel */}
          {pixelConfig.facebook_pixel && (
            <script dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelConfig.facebook_pixel}');
                fbq('track', 'PageView');
              `
            }} />
          )}
          
          {/* Google Tag Manager */}
          {pixelConfig.gtm_id && (
            <>
              <script dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${pixelConfig.gtm_id}');
                `
              }} />
              <noscript dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${pixelConfig.gtm_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
              }} />
            </>
          )}
          
          {/* Custom Body Code */}
          {pixelConfig.custom_body && (
            <div dangerouslySetInnerHTML={{ __html: pixelConfig.custom_body }} />
          )}
        </>
      )}
      
      <CustomCssJs 
        configSections={business.config_sections} 
        planFeatures={planFeatures}
      />
      
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-2 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-center">
            <div className="business-card-container w-full max-w-lg">
              <VCardPreview
                businessType={business.business_type}
                data={data}
                template={template}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* PWA Install Popup */}
      {(() => {
        const pwaConfig = business.config_sections?.pwa;
        const pwaEnabled = pwaConfig?.enabled;
        const notInstalled = !isPwaAlreadyInstalled;
        const notDismissed = !installDismissed;
        const shouldShow = pwaEnabled && notInstalled && notDismissed;
        return shouldShow;
      })() && (
        <PWAInstallPopup
          isVisible={showInstallPopup}
          onInstall={handleInstallClick}
          onClose={handleClosePopup}
          appName={pwaConfig?.name || business.name}
          appIcon={business.favicon ? getImageDisplayUrl(business.favicon) : window.appSettings.baseUrl + "/images/logos/icon-192x192.png"}
          themeColors={data.config_sections?.colors || template?.defaultColors}
        />
      )}

      
      {/* Modals */}
      <ContactFormModal 
        isOpen={contactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        businessId={business.id}
        businessName={business.name}
        themeColors={colors}
        themeFont={data.config_sections?.font || template?.defaultFont}
      />
      
      <AppointmentFormModal 
        isOpen={appointmentModalOpen} 
        onClose={() => setAppointmentModalOpen(false)} 
        businessId={business.id}
        businessName={business.name}
        themeColors={colors}
        themeFont={data.config_sections?.font || template?.defaultFont}
      />
      
      <QRShareModal 
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        colors={colors}
        font={data.config_sections?.font || template?.defaultFont}
        socialLinks={data.config_sections?.social?.social_links || []}
      />
    </>
  );
}