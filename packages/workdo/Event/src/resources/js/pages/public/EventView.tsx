import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import EventPreview from '../components/EventPreview';
import { QRShareModal } from '@/components/QRShareModal';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Event {
    id: number;
    name: string;
    template_type: string;
    template_config: any;
    config_sections: any;
    favicon?: string;
}

interface Props {
    event: Event;
}

export default function EventView({ event }: Props) {
    const { flash } = usePage().props as any;
    const { i18n } = useTranslation();
    const [showQrModal, setShowQrModal] = useState(false);
    
    // Initialize language from event configuration
    useEffect(() => {
        const templateLanguage = event.config_sections?.language?.template_language;
        if (templateLanguage && templateLanguage !== i18n.language) {
            i18n.changeLanguage(templateLanguage);
        }
    }, [event.config_sections?.language?.template_language, i18n]);
    
    // Use event favicon if available
    useEffect(() => {
        const faviconUrl = event.favicon || '/favicon.ico';
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        
        link.href = faviconUrl.startsWith('http') ? faviconUrl : 
                   faviconUrl.startsWith('/') ? `${window.appSettings?.baseUrl || ''}${faviconUrl}` : faviconUrl;
    }, [event.favicon]);
    
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
        const handleOpenQrModal = () => setShowQrModal(true);
        window.addEventListener('openQrModal', handleOpenQrModal);
        
        return () => {
            window.removeEventListener('openQrModal', handleOpenQrModal);
        };
    }, []);
    
    // Generate dynamic QR text based on event type
    const getQrText = () => {
        const eventType = event.template_type;
        switch (eventType) {
            case 'wedding':
                return 'Scan the QR code to access about our wedding event.';
            case 'conference':
                return 'Scan the QR code to access the conference event.';
            case 'birthday':
                return 'Scan the QR code to access the birthday event.';
            case 'art-exhibition':
                return 'Scan the QR code to access the art exhibition.';
            case 'music-festival':
                return 'Scan the QR code to access the music festival.';
            default:
                return 'Scan this QR code to access my digital event';
        }
    };
    

    
    const seoConfig = event.config_sections?.seo;
    const pixelConfig = event.config_sections?.pixels;

    return (
        <>
            <Head title={seoConfig?.meta_title || event.name}>
                {/* SEO Meta Tags */}
                {seoConfig && [
                    seoConfig.meta_description && <meta key="description" name="description" content={seoConfig.meta_description} />,
                    seoConfig.keywords && <meta key="keywords" name="keywords" content={seoConfig.keywords} />,
                    seoConfig.og_image && <meta key="og:image" property="og:image" content={seoConfig.og_image} />,
                    seoConfig.meta_title && <meta key="og:title" property="og:title" content={seoConfig.meta_title} />,
                    !seoConfig.meta_title && <meta key="og:title" property="og:title" content={event.name} />,
                    seoConfig.meta_description && <meta key="og:description" property="og:description" content={seoConfig.meta_description} />,
                    <meta key="og:type" property="og:type" content="event" />,
                    <meta key="twitter:card" name="twitter:card" content="summary_large_image" />,
                    seoConfig.meta_title && <meta key="twitter:title" name="twitter:title" content={seoConfig.meta_title} />,
                    !seoConfig.meta_title && <meta key="twitter:title" name="twitter:title" content={event.name} />,
                    seoConfig.meta_description && <meta key="twitter:description" name="twitter:description" content={seoConfig.meta_description} />,
                    seoConfig.og_image && <meta key="twitter:image" name="twitter:image" content={seoConfig.og_image} />
                ]}
                
                {/* Custom Head Code */}
                {(pixelConfig?.enabled || pixelConfig?.custom_head) && pixelConfig?.custom_head && (
                    <>
                        <script dangerouslySetInnerHTML={{
                            __html: `console.log('✅ Loading Custom Head Code');`
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
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <EventPreview data={event} />
                    </div>
                </div>
            </div>
            
            {/* QR Share Modal */}
            <QRShareModal 
                isOpen={showQrModal}
                onClose={() => setShowQrModal(false)}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                colors={event.config_sections?.colors}
                font={event.config_sections?.font || 'Inter, sans-serif'}
                qrSize={event.config_sections?.qr_share?.qr_size || 'medium'}
                forceOpen={true}
                qrText={getQrText()}
                socialLinks={[
                    { platform: 'facebook', url: '#' },
                    { platform: 'twitter', url: '#' },
                    { platform: 'whatsapp', url: '#' },
                    { platform: 'telegram', url: '#' }
                ]}
            />
        </>
    );
}
