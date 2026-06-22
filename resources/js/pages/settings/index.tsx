import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, Building, DollarSign, Users, RefreshCw, Palette, BookOpen, Award, FileText, Mail, Bell, Link2, CreditCard, Calendar, HardDrive, Shield, Bot, Cookie, Search, Webhook, Wallet } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import SystemSettings from './components/system-settings';
import { usePage } from '@inertiajs/react';

import CurrencySettings from './components/currency-settings';

import BrandSettings from './components/brand-settings';
import EmailSettings from './components/email-settings';
import PaymentSettings from './components/payment-settings';
import StorageSettings from './components/storage-settings';
import RecaptchaSettings from './components/recaptcha-settings';
import ChatGptSettings from './components/chatgpt-settings';
import CookieSettings from './components/cookie-settings';
import SeoSettings from './components/seo-settings';
import CacheSettings from './components/cache-settings';
import WebhookSettings from './components/webhook-settings';
import GoogleCalendarSettings from './components/google-calendar-settings';
import GoogleWalletSettings from './components/google-wallet-settings';
import { Toaster } from '@/components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { hasPermission } from '@/utils/permissions';
import { useLayout } from '@/contexts/LayoutContext';

export default function Settings() {
  const { t } = useTranslation();
  const { position } = useLayout();
  const { systemSettings = {}, cacheSize = '0.00', timezones = {}, dateFormats = {}, timeFormats = {}, paymentSettings = {}, webhooks = [], auth = {} } = usePage().props as any;
  const [activeSection, setActiveSection] = useState('system-settings');
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  
  // Check if user's plan has Google Wallet feature
  const userPlan = auth?.user?.plan;
  const hasGoogleWalletFeature = userPlan?.features?.google_wallet === true;
  
  // Define all possible sidebar navigation items
  const allSidebarNavItems: (NavItem & { permission?: string; requiresGoogleWallet?: boolean })[] = [
    {
      title: t('System Settings'),
      href: '#system-settings',
      icon: <SettingsIcon className="h-4 w-4 mr-2" />,
      permission: 'manage-system-settings'
    },
    {
      title: t('Brand Settings'),
      href: '#brand-settings',
      icon: <Palette className="h-4 w-4 mr-2" />,
      permission: 'manage-brand-settings'
    },
    {
      title: t('Currency Settings'),
      href: '#currency-settings',
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      permission: 'manage-currency-settings'
    },
    {
      title: t('Email Settings'),
      href: '#email-settings',
      icon: <Mail className="h-4 w-4 mr-2" />,
      permission: 'manage-email-settings'
    },
    {
      title: t('Payment Settings'),
      href: '#payment-settings',
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      permission: 'manage-payment-settings'
    },
    {
      title: t('Storage Settings'),
      href: '#storage-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-storage-settings'
    },
    {
      title: t('ReCaptcha Settings'),
      href: '#recaptcha-settings',
      icon: <Shield className="h-4 w-4 mr-2" />,
      permission: 'manage-recaptcha-settings'
    },
    {
      title: t('Chat GPT Settings'),
      href: '#chatgpt-settings',
      icon: <Bot className="h-4 w-4 mr-2" />,
      permission: 'manage-chatgpt-settings'
    },
    {
      title: t('Cookie Settings'),
      href: '#cookie-settings',
      icon: <Cookie className="h-4 w-4 mr-2" />,
      permission: 'manage-cookie-settings'
    },
    {
      title: t('SEO Settings'),
      href: '#seo-settings',
      icon: <Search className="h-4 w-4 mr-2" />,
      permission: 'manage-seo-settings'
    },
    {
      title: t('Cache Settings'),
      href: '#cache-settings',
      icon: <HardDrive className="h-4 w-4 mr-2" />,
      permission: 'manage-cache-settings'
    },
    {
      title: t('Google Calendar Settings'),
      href: '#google-calendar-settings',
      icon: <Calendar className="h-4 w-4 mr-2" />,
      permission: 'settings'
    },
    {
      title: t('Google Wallet Settings'),
      href: '#google-wallet-settings',
      icon: <Wallet className="h-4 w-4 mr-2" />,
      permission: 'settings',
      requiresGoogleWallet: true
    }
  ];
  
  if (auth.user?.type !== 'superadmin') {
      allSidebarNavItems.push({
          title: t('Webhook Settings'),
          href: '#webhook-settings',
          icon: <Webhook className="h-4 w-4 mr-2" />,
          permission: 'manage-webhook-settings'
      });
  }
  // Filter sidebar items based on user permissions
  const sidebarNavItems = allSidebarNavItems.filter(item => {
    // Check Google Wallet feature requirement
    if (item.requiresGoogleWallet && !hasGoogleWalletFeature) {
      return false;
    }
    
    // If no permission is required or user has the permission
    if (!item.permission || (auth.permissions && auth.permissions.includes(item.permission))) {
      return true;
    }
    // For company users, only show specific settings
    if (auth.user && auth.user.type === 'company') {
      // Only allow system settings, email settings, brand settings, webhook settings, and settings
      return ['manage-system-settings', 'manage-email-settings', 'manage-brand-settings', 'manage-webhook-settings', 'settings'].includes(item.permission);
    }
    return false;
  });
  
  // Refs for each section
  const systemSettingsRef = useRef<HTMLDivElement>(null);
  const brandSettingsRef = useRef<HTMLDivElement>(null);

  const currencySettingsRef = useRef<HTMLDivElement>(null);
  const emailSettingsRef = useRef<HTMLDivElement>(null);
  const paymentSettingsRef = useRef<HTMLDivElement>(null);
  const storageSettingsRef = useRef<HTMLDivElement>(null);
  const recaptchaSettingsRef = useRef<HTMLDivElement>(null);
  const chatgptSettingsRef = useRef<HTMLDivElement>(null);
  const cookieSettingsRef = useRef<HTMLDivElement>(null);
  const seoSettingsRef = useRef<HTMLDivElement>(null);
  const cacheSettingsRef = useRef<HTMLDivElement>(null);
  const webhookSettingsRef = useRef<HTMLDivElement>(null);
  const googleCalendarSettingsRef = useRef<HTMLDivElement>(null);
  const googleWalletSettingsRef = useRef<HTMLDivElement>(null);

  
  // Smart scroll functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Increased offset for better detection
      
      // Get all section elements that are currently rendered
      const sections = [
        { id: 'system-settings', ref: systemSettingsRef },
        { id: 'brand-settings', ref: brandSettingsRef },
        { id: 'currency-settings', ref: currencySettingsRef },
        { id: 'email-settings', ref: emailSettingsRef },
        { id: 'payment-settings', ref: paymentSettingsRef },
        { id: 'storage-settings', ref: storageSettingsRef },
        { id: 'recaptcha-settings', ref: recaptchaSettingsRef },
        { id: 'chatgpt-settings', ref: chatgptSettingsRef },
        { id: 'cookie-settings', ref: cookieSettingsRef },
        { id: 'seo-settings', ref: seoSettingsRef },
        { id: 'cache-settings', ref: cacheSettingsRef },
        { id: 'google-calendar-settings', ref: googleCalendarSettingsRef },
        { id: 'google-wallet-settings', ref: googleWalletSettingsRef },
        { id: 'webhook-settings', ref: webhookSettingsRef }
      ].filter(section => section.ref.current); // Only include rendered sections
      
      // Find the active section
      let activeId = sections[0]?.id || 'system-settings';
      
      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = window.scrollY + rect.top;
          
          if (scrollPosition >= elementTop) {
            activeId = section.id;
          }
        }
      }
      
      // Special handling for last section
      const lastSection = sections[sections.length - 1];
      if (lastSection?.ref.current) {
        const rect = lastSection.ref.current.getBoundingClientRect();
        const elementBottom = window.scrollY + rect.bottom;
        if (scrollPosition >= elementBottom - 300) {
          activeId = lastSection.id;
        }
      }
      
      // Only update if not manually navigating
      if (!isManualNavigation) {
        setActiveSection(activeId);
      }
    };
    
    // Add scroll event listener with throttling
    let ticking = false;
    let scrollTimeout;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
      
      // Reset manual navigation flag when scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsManualNavigation(false);
      }, 150);
    };
    
    window.addEventListener('scroll', throttledScroll);
    
    // Initial check
    handleScroll();
    
    // Check for hash in URL
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(hash);
        }
      }, 100);
    }
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  // Handle navigation click
  const handleNavClick = (href: string) => {
    const id = href.replace('#', '');
    setIsManualNavigation(true);
    setActiveSection(id); // Set immediately
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageTemplate 
      title={t('Settings')} 
      url="/settings"
      breadcrumbs={[
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Settings') }
      ]}
    >
      <div className={`flex flex-col md:flex-row gap-8 ${position === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-5rem)]">
              <div className={`space-y-1 ${position === 'right' ? 'pl-4' : 'pr-4'}`}>
                {sidebarNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn('w-full justify-start', {
                      'bg-muted font-medium': activeSection === item.href.replace('#', ''),
                    })}
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* System Settings Section */}
          {(auth.permissions?.includes('manage-system-settings') || auth.user?.type === 'superadmin' || auth.user?.type === 'company') && (
            <section id="system-settings" ref={systemSettingsRef} className="mb-8">
              <SystemSettings 
                settings={systemSettings} 
                timezones={timezones}
                dateFormats={dateFormats}
                timeFormats={timeFormats}
              />
            </section>
          )}

          {/* Brand Settings Section */}
          {(auth.permissions?.includes('manage-brand-settings') || auth.user?.type === 'superadmin') && (
            <section id="brand-settings" ref={brandSettingsRef} className="mb-8">
              <BrandSettings />
            </section>
          )}



          {/* Currency Settings Section */}
          {(auth.permissions?.includes('manage-currency-settings') || auth.user?.type === 'superadmin') && (
            <section id="currency-settings" ref={currencySettingsRef} className="mb-8">
              <CurrencySettings />
            </section>
          )}

          {/* Email Settings Section */}
          {(auth.permissions?.includes('manage-email-settings') || auth.user?.type === 'superadmin') && (
            <section id="email-settings" ref={emailSettingsRef} className="mb-8">
              <EmailSettings />
            </section>
          )}

          {/* Payment Settings Section */}
          {(auth.permissions?.includes('manage-payment-settings') || auth.user?.type === 'superadmin') && (
            <section id="payment-settings" ref={paymentSettingsRef} className="mb-8">
              <PaymentSettings settings={paymentSettings} />
            </section>
          )}

          {/* Storage Settings Section */}
          {(auth.permissions?.includes('manage-storage-settings') || auth.user?.type === 'superadmin') && (
            <section id="storage-settings" ref={storageSettingsRef} className="mb-8">
              <StorageSettings settings={systemSettings} />
            </section>
          )}

          {/* ReCaptcha Settings Section */}
          {(auth.permissions?.includes('manage-recaptcha-settings') || auth.user?.type === 'superadmin') && (
            <section id="recaptcha-settings" ref={recaptchaSettingsRef} className="mb-8">
              <RecaptchaSettings settings={systemSettings} />
            </section>
          )}

          {/* Chat GPT Settings Section */}
          {(auth.permissions?.includes('manage-chatgpt-settings') || auth.user?.type === 'superadmin') && (
            <section id="chatgpt-settings" ref={chatgptSettingsRef} className="mb-8">
              <ChatGptSettings settings={systemSettings} />
            </section>
          )}

          {/* Cookie Settings Section */}
          {(auth.permissions?.includes('manage-cookie-settings') || auth.user?.type === 'superadmin') && (
            <section id="cookie-settings" ref={cookieSettingsRef} className="mb-8">
              <CookieSettings settings={systemSettings} />
            </section>
          )}

          {/* SEO Settings Section */}
          {(auth.permissions?.includes('manage-seo-settings') || auth.user?.type === 'superadmin') && (
            <section id="seo-settings" ref={seoSettingsRef} className="mb-8">
              <SeoSettings settings={systemSettings} />
            </section>
          )}

          {/* Cache Settings Section */}
          {(auth.permissions?.includes('manage-cache-settings') || auth.user?.type === 'superadmin') && (
            <section id="cache-settings" ref={cacheSettingsRef} className="mb-8">
              <CacheSettings cacheSize={cacheSize} />
            </section>
          )}

          {/* Google Calendar Settings Section */}
          {(auth.permissions?.includes('settings') || auth.user?.type === 'company') && (
            <section id="google-calendar-settings" ref={googleCalendarSettingsRef} className="mb-8">
              <GoogleCalendarSettings settings={systemSettings} />
            </section>
          )}

          {/* Google Wallet Settings Section */}
          {(auth.permissions?.includes('settings') || auth.user?.type === 'company') && hasGoogleWalletFeature && (
            <section id="google-wallet-settings" ref={googleWalletSettingsRef} className="mb-8">
              <GoogleWalletSettings settings={systemSettings} />
            </section>
          )}

          {/* Webhook Settings Section */}
          {(auth.permissions?.includes('manage-webhook-settings') && auth.user?.type !== 'superadmin') && (
            <section id="webhook-settings" ref={webhookSettingsRef} className="mb-8">
              <WebhookSettings webhooks={webhooks} />
            </section>
          )}

        </div>
      </div>
      <Toaster />
    </PageTemplate>
  );
}