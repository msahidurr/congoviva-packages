import React, { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Eye, Settings as SettingsIcon, Type, Info, Phone, Globe, Palette, Image, Users, Code, Search, Layout, Monitor, FileText, Award, Mail, CreditCard, HelpCircle, Trash2, Plus, X, GripVertical, ArrowUpDown, ArrowLeft, Target, Heart, Lightbulb, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MediaPicker from '@/components/MediaPicker';
import { Link } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { SettingsSection } from '@/components/settings-section';
import { toast } from '@/components/custom-toast';
import { Toaster } from '@/components/ui/toaster';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { RichTextField } from '@/components/ui/rich-text-field';
import FeaturesSection from './settings-features';
import AboutSection from './settings-about';
import ContactSection from './settings-contact';
import TemplatesSection from './settings-templates';
import ContactPageSettings from './settings-contact-page';

import { defaultLandingPageSections } from './templates/default-sections';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import { getImageDisplayUrl, convertUrlToRelativePath } from '@/utils/imageUrlHelper';

interface Settings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  config_sections?: {
    sections: Array<{
      key: string;
      [key: string]: any;
    }>;
    custom_pages?: Array<{
      key: string;
      name: string;
    }>;
    [key: string]: any;
  };
}

interface PageProps {
  settings: Settings;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function LandingPageSettings() {
  const { t } = useTranslation();
  const { settings, flash } = usePage<PageProps>().props;
  const { themeColor, customColor } = useBrand();
  const brandColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  const [activeSection, setActiveSection] = useState<'general' | 'header' | 'hero' | 'features' | 'screenshots' | 'whychooseus' | 'templates' | 'about' | 'team' | 'testimonials' | 'active_campaigns' | 'plans' | 'faq' | 'newsletter' | 'contact' | 'footer' | 'order' | 'advanced' | 'pages' | 'about-page' | 'privacy' | 'terms' | 'refund' | 'faq-page' | 'contact-page'>('general');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['setup', 'layout', 'content', 'social', 'engagement', 'pages']);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [showDeletePageDialog, setShowDeletePageDialog] = useState(false);
  const [pageToDelete, setPageToDelete] = useState('');
  
  // Check if ChatGPT modal is open
  const [isChatGptOpen, setIsChatGptOpen] = useState(false);
    
  useEffect(() => {
      const checkChatGpt = () => {
          const chatGptModal = document.querySelector('[data-chatgpt-modal]') || 
                              document.querySelector('.chatgpt-modal') ||
                              document.querySelector('[class*="chatgpt"]') ||
                              document.querySelector('[id*="chatgpt"]');
          setIsChatGptOpen(!!chatGptModal);
      };
      
      const observer = new MutationObserver(checkChatGpt);
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => observer.disconnect();
  }, []);

  // Helper function for consistent dark mode styling
  const sectionClasses = "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm";
  const headingClasses = "text-lg font-semibold text-gray-900 dark:text-gray-100";
  const subheadingClasses = "text-sm text-gray-500 dark:text-gray-400";
  
  // Helper function to convert full URL to relative path for database storage
  const convertToRelativePath = (url: string): string => {
    return convertUrlToRelativePath(url);
  };
  
  // Helper function to convert relative path to full URL for display
  const getDisplayUrl = (path: string): string => {
    return getImageDisplayUrl(path);
  };
  
  const { data, setData, post, processing, errors } = useForm<Settings>({
    company_name: settings.company_name,
    contact_email: settings.contact_email,
    contact_phone: settings.contact_phone,
    contact_address: settings.contact_address,
    config_sections: settings.config_sections && settings.config_sections.sections && settings.config_sections.sections.length > 0 
      ? {
          sections: settings.config_sections.sections || [],
          theme: settings.config_sections.theme || defaultLandingPageSections.theme,
          seo: settings.config_sections.seo || defaultLandingPageSections.seo,
          section_order: settings.config_sections.section_order || defaultLandingPageSections.section_order,
          section_visibility: settings.config_sections.section_visibility || defaultLandingPageSections.section_visibility,
          custom_pages: settings.config_sections.custom_pages || []
        }
      : { ...defaultLandingPageSections, custom_pages: [] }
  });

  const getSectionData = (key: string) => {
    return data.config_sections?.sections?.find(section => section.key === key) || {};
  };

  const updateSectionData = (key: string, updates: any) => {
    const sections = [...(data.config_sections?.sections || [])];
    const sectionIndex = sections.findIndex(section => section.key === key);
    
    if (sectionIndex >= 0) {
      sections[sectionIndex] = { ...sections[sectionIndex], ...updates };
    } else {
      sections.push({ key, ...updates });
    }
    
    setData('config_sections', {
      ...data.config_sections,
      sections
    });
  };

  const updateThemeData = (updates: any) => {
    setData('config_sections', {
      ...data.config_sections,
      theme: { ...data.config_sections?.theme, ...updates }
    });
  };

  const updateSeoData = (updates: any) => {
    setData('config_sections', {
      ...data.config_sections,
      seo: { ...data.config_sections?.seo, ...updates }
    });
  };

  const updateSectionVisibility = (sectionKey: string, visible: boolean) => {
    setData('config_sections', {
      ...data.config_sections,
      section_visibility: { ...data.config_sections?.section_visibility, [sectionKey]: visible }
    });
  };

  const updateSectionOrder = (newOrder: string[]) => {
    setData('config_sections', {
      ...data.config_sections,
      section_order: newOrder
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const currentOrder = [...(data.config_sections?.section_order || [])];
    const draggedItem = currentOrder[dragIndex];
    currentOrder.splice(dragIndex, 1);
    currentOrder.splice(dropIndex, 0, draggedItem);
    updateSectionOrder(currentOrder);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(name as keyof Settings, value);
  };

  const saveSettings = () => {
    setIsLoading(true);
          
    router.post(route('landing-page.settings.update'), data, {
      preserveScroll: true,
      onSuccess: (page) => {
        setIsLoading(false);
        const successMessage = page.props.flash?.success || t('Landing page settings saved successfully');
        const errorMessage = page.props.flash?.error;
        
        if (successMessage && !errorMessage) {
          toast.success(successMessage);
        } else if (errorMessage) {
          toast.error(errorMessage);
        }
      },
      onError: (errors) => {
        setIsLoading(false);
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to save landing page settings');
        toast.error(errorMessage);
      }
    });
  };
  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Landing Page') }
  ];

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(g => g !== groupKey)
        : [...prev, groupKey]
    );
  };

  // Navigation structure
  const navigationGroups = [
    {
      key: 'setup',
      label: t('Setup'),
      icon: SettingsIcon,
      sections: [
        { key: 'general', label: t('General'), icon: Info },
        { key: 'order', label: t('Section Order'), icon: ArrowUpDown },
        { key: 'advanced', label: t('Advanced'), icon: Code }
      ]
    },
    {
      key: 'layout',
      label: t('Layout'),
      icon: Layout,
      sections: [
        { key: 'header', label: t('Header'), icon: Layout },
        { key: 'hero', label: t('Hero Section'), icon: Target },
        { key: 'footer', label: t('Footer'), icon: Layout }
      ]
    },
    {
      key: 'content',
      label: t('Content'),
      icon: FileText,
      sections: [
        { key: 'features', label: t('Features'), icon: Lightbulb },
        { key: 'screenshots', label: t('Screenshots'), icon: Monitor },
        { key: 'whychooseus', label: t('Why Choose Us'), icon: Heart },
        { key: 'templates', label: t('Templates'), icon: Layout },
        { key: 'about', label: t('About'), icon: Info },
        { key: 'active_campaigns', label: t('Active Campaigns'), icon: Target }
      ]
    },
    {
      key: 'social',
      label: t('Social Proof'),
      icon: Users,
      sections: [
        { key: 'team', label: t('Team'), icon: Users },
        { key: 'testimonials', label: t('Testimonials'), icon: Award },
        { key: 'plans', label: t('Pricing Plans'), icon: CreditCard }
      ]
    },
    {
      key: 'engagement',
      label: t('Engagement'),
      icon: Mail,
      sections: [
        { key: 'faq', label: t('FAQ'), icon: HelpCircle },
        { key: 'newsletter', label: t('Newsletter'), icon: Mail },
        { key: 'contact', label: t('Contact'), icon: Phone }
      ]
    },
    {
      key: 'pages',
      label: t('Pages'),
      icon: FileText,
      sections: [
        { key: 'about-page', label: t('About Us'), icon: Info },
        { key: 'privacy', label: t('Privacy Policy'), icon: FileText },
        { key: 'terms', label: t('Terms of Service'), icon: FileText },
        { key: 'refund', label: t('Refund Policy'), icon: CreditCard },
        { key: 'faq-page', label: t('FAQ Page'), icon: HelpCircle },
        { key: 'contact-page', label: t('Contact Page'), icon: Phone },
        ...(data.config_sections?.custom_pages || []).map((page: { key: string; name: string }) => ({ 
          key: page.key, 
          label: page.name,
          icon: FileText
        }))
      ]
    }
  ];

  // Get current group and section info
  const getCurrentGroupAndSection = () => {
    for (const group of navigationGroups) {
      const section = group.sections.find(s => s.key === activeSection);
      if (section) {
        return { group, section };
      }
    }
    return null;
  };

  const currentInfo = getCurrentGroupAndSection();
  return (
    <PageTemplate 
      title={t("Landing Page")} 
      breadcrumbs={breadcrumbs}
      url="/landing-page/settings"
      action={
        <div className="flex gap-2">
          <Link
            href={route('landing-page')}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            <Eye className="w-4 h-4" />
            {t("View Landing Page")}
          </Link>
        </div>
      }
    >
      <SettingsSection
        title={t('Landing Page Settings')}
        description={t('Customize your landing page content and appearance')}
        action={
          <Button onClick={saveSettings} disabled={isLoading} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? t('Saving...') : t('Save Changes')}
          </Button>
        }
      >
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700" style={{ backgroundColor: brandColor + '10' }}>
                <h3 className="font-semibold text-sm" style={{ color: brandColor }}>
                  {t('Navigation')}
                </h3>
                {currentInfo && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {currentInfo.section.label}
                  </p>
                )}
              </div>
              
              <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                {navigationGroups.map((group) => {
                  const isExpanded = expandedGroups.includes(group.key);
                  const GroupIcon = group.icon;
                  
                  return (
                    <div key={group.key} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <button
                        onClick={() => toggleGroup(group.key)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <GroupIcon className="h-4 w-4" style={{ color: brandColor }} />
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {group.label}
                          </span>
                        </div>
                        <svg
                          className={`h-4 w-4 text-gray-500 transition-transform ${
                            isExpanded ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isExpanded && (
                        <div className="bg-gray-50 dark:bg-gray-900/50">
                          {group.sections.map((section) => {
                            const SectionIcon = section.icon;
                            const isActive = activeSection === section.key;
                            
                            return (
                              <button
                                key={section.key}
                                onClick={() => setActiveSection(section.key as any)}
                                className={`w-full px-4 py-2.5 pl-10 flex items-center gap-2 text-sm transition-colors ${
                                  isActive
                                    ? 'text-white dark:text-white font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                                style={isActive ? {
                                  backgroundColor: brandColor,
                                  borderLeft: `3px solid ${brandColor}`
                                } : {}}
                              >
                                <SectionIcon className="h-3.5 w-3.5" />
                                <span>{section.label}</span>
                              </button>
                            );
                          })}
                          
                          {group.key === 'pages' && (
                            <button
                              onClick={() => setShowAddPageDialog(true)}
                              className="w-full px-4 py-2.5 pl-10 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-t border-gray-200 dark:border-gray-700"
                              style={{ color: brandColor }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>{t('Add Custom Page')}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* General Section */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Type className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('Company Information')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('Basic company details for your landing page')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="company_name" className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" style={{ color: brandColor }} />
                        {t('Company Name')}
                      </Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={data.company_name}
                        onChange={handleInputChange}
                        placeholder={t('Your Company Name')}
                        className="h-10 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                      />
                      {errors.company_name && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                          <X className="h-4 w-4" />
                          {errors.company_name}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_email">{t('Contact Email')}</Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        value={data.contact_email}
                        onChange={handleInputChange}
                        placeholder={t('support@company.com')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_phone">{t('Contact Phone')}</Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={data.contact_phone}
                        onChange={handleInputChange}
                        placeholder={t('+1 (555) 123-4567')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_address">{t('Contact Address')}</Label>
                      <Input
                        id="contact_address"
                        name="contact_address"
                        value={data.contact_address}
                        onChange={handleInputChange}
                        placeholder={t('123 Business Ave, City, State')}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r rounded-lg border" style={{ backgroundColor: brandColor + '10', borderColor: brandColor + '30' }}>
                    <h4 className="text-sm font-medium mb-4" style={{ color: brandColor }}>{t('Branding & Theme')}</h4>
                    
                    {/* Logo Upload Section */}
                    <div className="mb-6">
                      <h5 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('Company Logo')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <MediaPicker
                            label={t('Logo (Light Theme)')}
                            value={getDisplayUrl(data.config_sections?.theme?.logo_light || '')}
                            onChange={(value) => {
                              updateThemeData({ logo_light: convertToRelativePath(value) });
                            }}
                            placeholder={t('Select logo for light backgrounds...')}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Logo displayed on light backgrounds')}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <MediaPicker
                            label={t('Logo (Dark Theme)')}
                            value={getDisplayUrl(data.config_sections?.theme?.logo_dark || '')}
                            onChange={(value) => {
                              updateThemeData({ logo_dark: convertToRelativePath(value) });
                            }}
                            placeholder={t('Select logo for dark backgrounds...')}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Logo displayed on dark backgrounds')}
                          </p>
                        </div>
                      </div>
                      
                     
                    </div>
                    
                    {/* Theme Colors */}
                    <div>
                      <h5 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('Theme Colors')}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="general_primary_color">{t('Primary Color')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="general_primary_color"
                              type="color"
                              value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                              onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                              onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                              placeholder="#3b82f6"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="general_secondary_color">{t('Secondary Color')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="general_secondary_color"
                              type="color"
                              value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                              onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                              onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                              placeholder="#8b5cf6"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor="general_accent_color">{t('Accent Color')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id="general_accent_color"
                              type="color"
                              value={data.config_sections?.theme?.accent_color || '#10b77f'}
                              onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                              className="w-16 h-10 p-1"
                            />
                            <Input
                              value={data.config_sections?.theme?.accent_color || '#10b77f'}
                              onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                              placeholder="#10b77f"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Header Section */}
            {activeSection === 'header' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Layout className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Header Style')}</h3>
                        <p className="text-sm text-gray-500">{t('Customize your header appearance and behavior')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.header !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('header', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="header_transparent">{t('Transparent Header')}</Label>
                        <Switch
                          id="header_transparent"
                          checked={getSectionData('header').transparent || false}
                          onCheckedChange={(checked) => updateSectionData('header', { transparent: checked })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('Make header background transparent')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="header_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="header_background_color"
                          type="color"
                          value={getSectionData('header').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('header', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                          disabled={getSectionData('header').transparent}
                        />
                        <Input
                          value={getSectionData('header').background_color || '#ffffff'}
                          onChange={(e) => updateSectionData('header', { background_color: e.target.value })}
                          placeholder="#ffffff"
                          disabled={getSectionData('header').transparent}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="header_text_color">{t('Text Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="header_text_color"
                          type="color"
                          value={getSectionData('header').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('header', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('header').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('header', { text_color: e.target.value })}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="header_button_style">{t('Button Style')}</Label>
                      <Select
                        value={getSectionData('header').button_style || 'gradient'}
                        onValueChange={(value) => updateSectionData('header', { button_style: value })}
                      >
                        <SelectTrigger id="header_button_style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gradient">Gradient</SelectItem>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="outline">Outline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Section */}
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Layout className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Hero Layout')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure hero section layout and dimensions')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.hero !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('hero', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="hero_layout">{t('Layout Style')}</Label>
                      <Select
                        value={getSectionData('hero').layout || 'image-right'}
                        onValueChange={(value) => updateSectionData('hero', { layout: value })}
                      >
                        <SelectTrigger id="hero_layout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image-right">Content Left, Image Right</SelectItem>
                          <SelectItem value="image-left">Image Left, Content Right</SelectItem>
                          <SelectItem value="full-width">Full Width</SelectItem>
                          <SelectItem value="centered">Centered Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_height">{t('Section Height')}</Label>
                      <Input
                        id="hero_height"
                        type="number"
                        value={getSectionData('hero').height || 600}
                        onChange={(e) => updateSectionData('hero', { height: parseInt(e.target.value) })}
                        min="300"
                        max="1000"
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('Height in pixels (300-1000)')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Type className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Content')}</h3>
                      <p className="text-sm text-gray-500">{t('Main headline and supporting text')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="hero_title" className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Type className="h-4 w-4" style={{ color: brandColor }} />
                        {t('Hero Title')}
                      </Label>
                      <Input
                        id="hero_title"
                        value={getSectionData('hero').title || ''}
                        onChange={(e) => updateSectionData('hero', { title: e.target.value })}
                        placeholder={t("Your main headline")}
                        className="h-10 border-gray-200"
                        style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                      />
                      {errors.hero_title && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                          <X className="h-4 w-4" />
                          {errors.hero_title}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_subtitle" className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="h-4 w-4" style={{ color: brandColor }} />
                        {t('Hero Subtitle')}
                      </Label>
                      <Textarea
                        id="hero_subtitle"
                        value={getSectionData('hero').subtitle || ''}
                        onChange={(e) => updateSectionData('hero', { subtitle: e.target.value })}
                        placeholder={t("Supporting text for your headline")}
                        rows={3}
                        className="border-gray-200 resize-none"
                        style={{ '--tw-ring-color': brandColor + '33' } as React.CSSProperties}
                      />
                      {errors.hero_subtitle && (
                        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md border border-red-200">
                          <X className="h-4 w-4" />
                          {errors.hero_subtitle}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_announcement_text">{t('Announcement Badge')}</Label>
                      <Input
                        id="hero_announcement_text"
                        value={getSectionData('hero').announcement_text || ''}
                        onChange={(e) => updateSectionData('hero', { announcement_text: e.target.value })}
                        placeholder={t("🚀 New: Advanced Analytics Dashboard")}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('Small announcement text shown above the title')}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label htmlFor="hero_primary_button_text">{t('Primary Button Text')}</Label>
                        <Input
                          id="hero_primary_button_text"
                          value={getSectionData('hero').primary_button_text || ''}
                          onChange={(e) => updateSectionData('hero', { primary_button_text: e.target.value })}
                          placeholder={t("Start Free Trial")}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="hero_secondary_button_text">{t('Secondary Button Text')}</Label>
                        <Input
                          id="hero_secondary_button_text"
                          value={getSectionData('hero').secondary_button_text || ''}
                          onChange={(e) => updateSectionData('hero', { secondary_button_text: e.target.value })}
                          placeholder={t("Login")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <SettingsIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Statistics')}</h3>
                      <p className="text-sm text-gray-500">{t('Add compelling statistics to your hero section')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('hero').stats || []).map((stat, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="space-y-3">
                          <Label htmlFor={`hero_stats_${index}_value`}>{t('Value')}</Label>
                          <Input
                            id={`hero_stats_${index}_value`}
                            value={stat.value || ''}
                            onChange={(e) => {
                              const newStats = [...(getSectionData('hero').stats || [])];
                              newStats[index] = { ...newStats[index], value: e.target.value };
                              updateSectionData('hero', { stats: newStats });
                            }}
                            placeholder="10K+"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor={`hero_stats_${index}_label`}>{t('Label')}</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`hero_stats_${index}_label`}
                              value={stat.label || ''}
                              onChange={(e) => {
                                const newStats = [...(getSectionData('hero').stats || [])];
                                newStats[index] = { ...newStats[index], label: e.target.value };
                                updateSectionData('hero', { stats: newStats });
                              }}
                              placeholder={t("Active Users")}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => {
                                const newStats = (getSectionData('hero').stats || []).filter((_, i) => i !== index);
                                updateSectionData('hero', { stats: newStats });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newStats = [...(getSectionData('hero').stats || []), { value: '', label: '' }];
                        updateSectionData('hero', { stats: newStats });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Statistic')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Card')}</h3>
                      <p className="text-sm text-gray-500">{t('Sample business card displayed in hero')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_name">{t('Name')}</Label>
                      <Input
                        id="hero_card_name"
                        value={getSectionData('hero').card?.name || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, name: e.target.value } });
                        }}
                        placeholder={t("John Doe")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_title">{t('Title')}</Label>
                      <Input
                        id="hero_card_title"
                        value={getSectionData('hero').card?.title || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, title: e.target.value } });
                        }}
                        placeholder={t("Senior Developer")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_company">{t('Company')}</Label>
                      <Input
                        id="hero_card_company"
                        value={getSectionData('hero').card?.company || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, company: e.target.value } });
                        }}
                        placeholder={t("Tech Solutions Inc.")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_card_initials">{t('Initials')}</Label>
                      <Input
                        id="hero_card_initials"
                        value={getSectionData('hero').card?.initials || ''}
                        onChange={(e) => {
                          const card = getSectionData('hero').card || {};
                          updateSectionData('hero', { card: { ...card, initials: e.target.value } });
                        }}
                        placeholder={t("JD")}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Image className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Image')}</h3>
                      <p className="text-sm text-gray-500">{t('Configure hero section imagery')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <MediaPicker
                        label={t('Hero Image')}
                        value={getDisplayUrl(getSectionData('hero').image || '')}
                        onChange={(value) => {
                          updateSectionData('hero', { image: convertToRelativePath(value) });
                        }}
                        placeholder={t('Select hero image...')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_image_position">{t('Image Position')}</Label>
                      <Select
                        value={getSectionData('hero').image_position || 'right'}
                        onValueChange={(value) => updateSectionData('hero', { image_position: value })}
                      >
                        <SelectTrigger id="hero_image_position">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="right">{t('Right Side')}</SelectItem>
                          <SelectItem value="left">{t('Left Side')}</SelectItem>
                          <SelectItem value="center">{t('Center')}</SelectItem>
                          <SelectItem value="background">{t('Background')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Palette className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Hero Colors')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize hero section colors and overlays')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="hero_background_color">{t("Background Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hero_background_color"
                          type="color"
                          value={getSectionData('hero').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('hero', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('hero').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('hero', { background_color: e.target.value })}
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_text_color">{t("Text Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hero_text_color"
                          type="color"
                          value={getSectionData('hero').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('hero', { text_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('hero').text_color || '#1f2937'}
                          onChange={(e) => updateSectionData('hero', { text_color: e.target.value })}
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="hero_overlay">{t('Background Overlay')}</Label>
                        <Switch
                          id="hero_overlay"
                          checked={getSectionData('hero').overlay || false}
                          onCheckedChange={(checked) => updateSectionData('hero', { overlay: checked })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('Add overlay on background image')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="hero_overlay_color">{t('Overlay Color')}</Label>
                      <Input
                        id="hero_overlay_color"
                        value={getSectionData('hero').overlay_color || 'rgba(0,0,0,0.5)'}
                        onChange={(e) => updateSectionData('hero', { overlay_color: e.target.value })}
                        placeholder="rgba(0,0,0,0.5)"
                        disabled={!getSectionData('hero').overlay}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Features Section */}
            {activeSection === 'features' && (
              <FeaturesSection 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}
            
            {/* Screenshots Section */}
            {activeSection === 'screenshots' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Type className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Screenshots Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Section title and description')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.screenshots !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('screenshots', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="screenshots_title">{t('Section Title')}</Label>
                      <Input
                        id="screenshots_title"
                        value={getSectionData('screenshots').title || ''}
                        onChange={(e) => updateSectionData('screenshots', { title: e.target.value })}
                        placeholder={t("See vCard SaaS in Action")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="screenshots_subtitle">{t('Section Subtitle')}</Label>
                      <Textarea
                        id="screenshots_subtitle"
                        value={getSectionData('screenshots').subtitle || ''}
                        onChange={(e) => updateSectionData('screenshots', { subtitle: e.target.value })}
                        placeholder={t("Explore our intuitive interface and powerful features...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Monitor className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Screenshots Gallery')}</h3>
                      <p className="text-sm text-gray-500">{t('Manage application screenshots')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('screenshots').screenshots_list || []).map((screenshot, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('Screenshot')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newScreenshots = (getSectionData('screenshots').screenshots_list || []).filter((_, i) => i !== index);
                              updateSectionData('screenshots', { screenshots_list: newScreenshots });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-3">
                            <MediaPicker
                              label={t('Screenshot Image')}
                              value={getDisplayUrl(screenshot.src || '')}
                              onChange={(value) => {
                                const newScreenshots = [...(getSectionData('screenshots').screenshots_list || [])];
                                newScreenshots[index] = { ...newScreenshots[index], src: convertToRelativePath(value) };
                                updateSectionData('screenshots', { screenshots_list: newScreenshots });
                              }}
                              placeholder={t('Select screenshot image...')}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <Label htmlFor={`screenshot_${index}_title`}>{t('Title')}</Label>
                              <Input
                                id={`screenshot_${index}_title`}
                                value={screenshot.title || ''}
                                onChange={(e) => {
                                  const newScreenshots = [...(getSectionData('screenshots').screenshots_list || [])];
                                  newScreenshots[index] = { ...newScreenshots[index], title: e.target.value };
                                  updateSectionData('screenshots', { screenshots_list: newScreenshots });
                                }}
                                placeholder={t("Dashboard Overview")}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <Label htmlFor={`screenshot_${index}_alt`}>{t('Alt Text')}</Label>
                              <Input
                                id={`screenshot_${index}_alt`}
                                value={screenshot.alt || ''}
                                onChange={(e) => {
                                  const newScreenshots = [...(getSectionData('screenshots').screenshots_list || [])];
                                  newScreenshots[index] = { ...newScreenshots[index], alt: e.target.value };
                                  updateSectionData('screenshots', { screenshots_list: newScreenshots });
                                }}
                                placeholder={t("vCard SaaS Dashboard Overview")}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`screenshot_${index}_description`}>{t('Description')}</Label>
                            <Textarea
                              id={`screenshot_${index}_description`}
                              value={screenshot.description || ''}
                              onChange={(e) => {
                                const newScreenshots = [...(getSectionData('screenshots').screenshots_list || [])];
                                newScreenshots[index] = { ...newScreenshots[index], description: e.target.value };
                                updateSectionData('screenshots', { screenshots_list: newScreenshots });
                              }}
                              placeholder={t("Comprehensive dashboard with all your digital cards and analytics")}
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newScreenshots = [...(getSectionData('screenshots').screenshots_list || []), { src: '', alt: '', title: '', description: '' }];
                        updateSectionData('screenshots', { screenshots_list: newScreenshots });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Screenshot')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Templates Section */}
            {activeSection === 'templates' && (
              <TemplatesSection 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}
            
            {/* WhyChooseUs Section */}
            {activeSection === 'whychooseus' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Type className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Why Choose Us Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Main section title and description')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.why_choose_us !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('why_choose_us', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="why_choose_us_title" className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Type className="h-4 w-4 text-emerald-600" />
                        {t('Section Title')}
                      </Label>
                      <Input
                        id="why_choose_us_title"
                        value={getSectionData('why_choose_us').title || ''}
                        onChange={(e) => updateSectionData('why_choose_us', { title: e.target.value })}
                        placeholder={t("Why Choose vCard?")}
                        className="h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="why_choose_us_subtitle">{t('Section Subtitle')}</Label>
                      <Textarea
                        id="why_choose_us_subtitle"
                        value={getSectionData('why_choose_us').subtitle || ''}
                        onChange={(e) => updateSectionData('why_choose_us', { subtitle: e.target.value })}
                        placeholder={t("We're not just another digital business card platform...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Reasons to Choose Us')}</h3>
                      <p className="text-sm text-gray-500">{t('Key benefits and advantages')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('why_choose_us').reasons || []).map((reason, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('Reason')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newReasons = (getSectionData('why_choose_us').reasons || []).filter((_, i) => i !== index);
                              updateSectionData('why_choose_us', { reasons: newReasons });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor={`reason_${index}_title`}>{t('Title')}</Label>
                            <Input
                              id={`reason_${index}_title`}
                              value={reason.title || ''}
                              onChange={(e) => {
                                const newReasons = [...(getSectionData('why_choose_us').reasons || [])];
                                newReasons[index] = { ...newReasons[index], title: e.target.value };
                                updateSectionData('why_choose_us', { reasons: newReasons });
                              }}
                              placeholder={t("Quick Setup")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`reason_${index}_icon`}>{t('Icon')}</Label>
                            <Select
                              value={reason.icon || 'clock'}
                              onValueChange={(value) => {
                                const newReasons = [...(getSectionData('why_choose_us').reasons || [])];
                                newReasons[index] = { ...newReasons[index], icon: value };
                                updateSectionData('why_choose_us', { reasons: newReasons });
                              }}
                            >
                              <SelectTrigger id={`reason_${index}_icon`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="clock">Clock</SelectItem>
                                <SelectItem value="users">Users</SelectItem>
                                <SelectItem value="zap">Zap</SelectItem>
                                <SelectItem value="check-circle">Check Circle</SelectItem>
                                <SelectItem value="star">Star</SelectItem>
                                <SelectItem value="shield">Shield</SelectItem>
                                <SelectItem value="heart">Heart</SelectItem>
                                <SelectItem value="award">Award</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-3 md:col-span-1">
                            <Label htmlFor={`reason_${index}_description`}>{t('Description')}</Label>
                            <Textarea
                              id={`reason_${index}_description`}
                              value={reason.description || ''}
                              onChange={(e) => {
                                const newReasons = [...(getSectionData('why_choose_us').reasons || [])];
                                newReasons[index] = { ...newReasons[index], description: e.target.value };
                                updateSectionData('why_choose_us', { reasons: newReasons });
                              }}
                              placeholder={t("Create your digital business card in under 5 minutes...")}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newReasons = [...(getSectionData('why_choose_us').reasons || []), { title: '', description: '', icon: 'clock' }];
                        updateSectionData('why_choose_us', { reasons: newReasons });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Reason')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <SettingsIcon className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Statistics Section')}</h3>
                      <p className="text-sm text-gray-500">{t('Trust indicators and key metrics')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="space-y-3">
                      <Label htmlFor="why_choose_us_stats_title">{t('Statistics Title')}</Label>
                      <Input
                        id="why_choose_us_stats_title"
                        value={getSectionData('why_choose_us').stats_title || ''}
                        onChange={(e) => updateSectionData('why_choose_us', { stats_title: e.target.value })}
                        placeholder={t("Trusted by Industry Leaders")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="why_choose_us_stats_subtitle">{t('Statistics Subtitle')}</Label>
                      <Input
                        id="why_choose_us_stats_subtitle"
                        value={getSectionData('why_choose_us').stats_subtitle || ''}
                        onChange={(e) => updateSectionData('why_choose_us', { stats_subtitle: e.target.value })}
                        placeholder={t("Join the growing community of professionals")}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('why_choose_us').stats || []).map((stat, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className="space-y-3">
                          <Label htmlFor={`stat_${index}_value`}>{t("Value")}</Label>
                          <Input
                            id={`stat_${index}_value`}
                            value={stat.value || ''}
                            onChange={(e) => {
                              const newStats = [...(getSectionData('why_choose_us').stats || [])];
                              newStats[index] = { ...newStats[index], value: e.target.value };
                              updateSectionData('why_choose_us', { stats: newStats });
                            }}
                            placeholder="10K+"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor={`stat_${index}_label`}>{t("Label")}</Label>
                          <Input
                            id={`stat_${index}_label`}
                            value={stat.label || ''}
                            onChange={(e) => {
                              const newStats = [...(getSectionData('why_choose_us').stats || [])];
                              newStats[index] = { ...newStats[index], label: e.target.value };
                              updateSectionData('why_choose_us', { stats: newStats });
                            }}
                            placeholder={t("Active Users")}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor={`stat_${index}_color`}>{t('Color')}</Label>
                          <div className="flex gap-2">
                            <Select
                              value={stat.color || 'blue'}
                              onValueChange={(value) => {
                                const newStats = [...(getSectionData('why_choose_us').stats || [])];
                                newStats[index] = { ...newStats[index], color: value };
                                updateSectionData('why_choose_us', { stats: newStats });
                              }}
                            >
                              <SelectTrigger id={`stat_${index}_color`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => {
                                const newStats = (getSectionData('why_choose_us').stats || []).filter((_, i) => i !== index);
                                updateSectionData('why_choose_us', { stats: newStats });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newStats = [...(getSectionData('why_choose_us').stats || []), { value: '', label: '', color: 'blue' }];
                        updateSectionData('why_choose_us', { stats: newStats });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Statistic')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Type className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Call to Action')}</h3>
                      <p className="text-sm text-gray-500">{t('Encourage user engagement')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="why_choose_us_cta_title">{t('CTA Title')}</Label>
                      <Input
                        id="why_choose_us_cta_title"
                        value={getSectionData('why_choose_us').cta_title || ''}
                        onChange={(e) => updateSectionData('why_choose_us', { cta_title: e.target.value })}
                        placeholder={t("Ready to get started?")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="why_choose_us_cta_subtitle">{t('CTA Subtitle')}</Label>
                      <Input
                        id="why_choose_us_cta_subtitle"
                        value={getSectionData('why_choose_us').cta_subtitle || ''}
                        onChange={(e) => updateSectionData('why_choose_us', { cta_subtitle: e.target.value })}
                        placeholder={t("Join thousands of satisfied users today")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* About Section */}
            {activeSection === 'about' && (
              <AboutSection 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                updateSectionVisibility={updateSectionVisibility}
                t={t}
              />
            )}
            
            {/* Active Campaigns Section */}
            {activeSection === 'active_campaigns' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Type className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Active Campaigns Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure active campaigns section display')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.active_campaigns !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('active_campaigns', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_title">{t('Section Title')}</Label>
                      <Input
                        id="active_campaigns_title"
                        value={getSectionData('active_campaigns').title || ''}
                        onChange={(e) => updateSectionData('active_campaigns', { title: e.target.value })}
                        placeholder={t('Featured Business Promotions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_subtitle">{t('Section Subtitle')}</Label>
                      <Textarea
                        id="active_campaigns_subtitle"
                        value={getSectionData('active_campaigns').subtitle || ''}
                        onChange={(e) => updateSectionData('active_campaigns', { subtitle: e.target.value })}
                        placeholder={t('Explore businesses we\'re currently promoting and discover amazing services')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Layout className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Layout & Display')}</h3>
                      <p className="text-sm text-gray-500">{t('Configure how campaigns are displayed')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_layout">{t('Layout Style')}</Label>
                      <Select
                        value={getSectionData('active_campaigns').layout || 'grid'}
                        onValueChange={(value) => updateSectionData('active_campaigns', { layout: value })}
                      >
                        <SelectTrigger id="active_campaigns_layout">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                          <SelectItem value="slider">Slider</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_columns">{t('Number of Columns')}</Label>
                      <Select
                        value={String(getSectionData('active_campaigns').columns || 3)}
                        onValueChange={(value) => updateSectionData('active_campaigns', { columns: parseInt(value) })}
                      >
                        <SelectTrigger id="active_campaigns_columns">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Column</SelectItem>
                          <SelectItem value="2">2 Columns</SelectItem>
                          <SelectItem value="3">3 Columns</SelectItem>
                          <SelectItem value="4">4 Columns</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_max_display">{t('Maximum Campaigns to Display')}</Label>
                      <Input
                        id="active_campaigns_max_display"
                        type="number"
                        value={getSectionData('active_campaigns').max_display || 6}
                        onChange={(e) => updateSectionData('active_campaigns', { max_display: parseInt(e.target.value) })}
                        min="1"
                        max="12"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active_campaigns_show_view_all">{t('Show "View All" Button')}</Label>
                      <Switch
                        id="active_campaigns_show_view_all"
                        checked={getSectionData('active_campaigns').show_view_all || false}
                        onCheckedChange={(checked) => updateSectionData('active_campaigns', { show_view_all: checked })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('Display a button to view all campaigns when there are more than the maximum display limit')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Palette className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Background & Styling')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize section appearance')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_background_color">{t('Background Color')}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="active_campaigns_background_color"
                          type="color"
                          value={getSectionData('active_campaigns').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('active_campaigns', { background_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={getSectionData('active_campaigns').background_color || '#f8fafc'}
                          onChange={(e) => updateSectionData('active_campaigns', { background_color: e.target.value })}
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <MediaPicker
                        label={t('Background Image')}
                        value={getDisplayUrl(getSectionData('active_campaigns').background_image || '')}
                        onChange={(value) => {
                          updateSectionData('active_campaigns', { background_image: convertToRelativePath(value) });
                        }}
                        placeholder={t('Select background image...')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="active_campaigns_overlay">{t('Background Overlay')}</Label>
                        <Switch
                          id="active_campaigns_overlay"
                          checked={getSectionData('active_campaigns').overlay || false}
                          onCheckedChange={(checked) => updateSectionData('active_campaigns', { overlay: checked })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('Add overlay on background image')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="active_campaigns_overlay_color">{t('Overlay Color')}</Label>
                      <Input
                        id="active_campaigns_overlay_color"
                        value={getSectionData('active_campaigns').overlay_color || 'rgba(0,0,0,0.5)'}
                        onChange={(e) => updateSectionData('active_campaigns', { overlay_color: e.target.value })}
                        placeholder="rgba(0,0,0,0.5)"
                        disabled={!getSectionData('active_campaigns').overlay}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">{t('Campaign Data Source')}</h4>
                      <p className="text-sm text-blue-700">
                        {t('This section automatically displays active marketing campaigns from businesses. Campaigns are shown only if they are currently active and within their date range.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Team Section */}
            {activeSection === 'team' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Type className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Team Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Team section title and description')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.team !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('team', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="team_title">{t('Team Title')}</Label>
                      <Input
                        id="team_title"
                        value={getSectionData('team').title || ''}
                        onChange={(e) => updateSectionData('team', { title: e.target.value })}
                        placeholder={t("Meet Our Team")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="team_subtitle">{t('Team Subtitle')}</Label>
                      <Textarea
                        id="team_subtitle"
                        value={getSectionData('team').subtitle || ''}
                        onChange={(e) => updateSectionData('team', { subtitle: e.target.value })}
                        placeholder={t("We're a diverse team of innovators...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Team Members')}</h3>
                      <p className="text-sm text-gray-500">{t('Add and manage team member profiles')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('team').members || []).map((member, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('Member')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newMembers = (getSectionData('team').members || []).filter((_, i) => i !== index);
                              updateSectionData('team', { members: newMembers });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor={`member_${index}_name`}>{t("Name")}</Label>
                            <Input
                              id={`member_${index}_name`}
                              value={member.name || ''}
                              onChange={(e) => {
                                const newMembers = [...(getSectionData('team').members || [])];
                                newMembers[index] = { ...newMembers[index], name: e.target.value };
                                updateSectionData('team', { members: newMembers });
                              }}
                              placeholder={t("John Doe")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`member_${index}_role`}>{t('Role')}</Label>
                            <Input
                              id={`member_${index}_role`}
                              value={member.role || ''}
                              onChange={(e) => {
                                const newMembers = [...(getSectionData('team').members || [])];
                                newMembers[index] = { ...newMembers[index], role: e.target.value };
                                updateSectionData('team', { members: newMembers });
                              }}
                              placeholder={t("CEO & Founder")}
                            />
                          </div>
                          
                          <div className="space-y-3 md:col-span-2">
                            <MediaPicker
                              label={t('Profile Image')}
                              value={getDisplayUrl(member.image || '')}
                              onChange={(value) => {
                                const newMembers = [...(getSectionData('team').members || [])];
                                newMembers[index] = { ...newMembers[index], image: convertToRelativePath(value) };
                                updateSectionData('team', { members: newMembers });
                              }}
                              placeholder={t('Select profile image...')}
                            />
                          </div>
                          
                          <div className="space-y-3 md:col-span-2">
                            <Label htmlFor={`member_${index}_bio`}>{t('Bio')}</Label>
                            <Textarea
                              id={`member_${index}_bio`}
                              value={member.bio || ''}
                              onChange={(e) => {
                                const newMembers = [...(getSectionData('team').members || [])];
                                newMembers[index] = { ...newMembers[index], bio: e.target.value };
                                updateSectionData('team', { members: newMembers });
                              }}
                              placeholder={t("Brief description about the team member...")}
                              rows={2}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`member_${index}_linkedin`}>{t('LinkedIn')}</Label>
                            <Input
                              id={`member_${index}_linkedin`}
                              value={member.linkedin || ''}
                              onChange={(e) => {
                                const newMembers = [...(getSectionData('team').members || [])];
                                newMembers[index] = { ...newMembers[index], linkedin: e.target.value };
                                updateSectionData('team', { members: newMembers });
                              }}
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`member_${index}_email`}>{t('Email')}</Label>
                            <Input
                              id={`member_${index}_email`}
                              value={member.email || ''}
                              onChange={(e) => {
                                const newMembers = [...(getSectionData('team').members || [])];
                                newMembers[index] = { ...newMembers[index], email: e.target.value };
                                updateSectionData('team', { members: newMembers });
                              }}
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newMembers = [...(getSectionData('team').members || []), { name: '', role: '', bio: '', image: '', linkedin: '', twitter: '', email: '' }];
                        updateSectionData('team', { members: newMembers });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Team Member')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Type className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Join Team CTA')}</h3>
                      <p className="text-sm text-gray-500">{t('Call-to-action for team recruitment')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="team_cta_title">{t("CTA Title")}</Label>
                      <Input
                        id="team_cta_title"
                        value={getSectionData('team').cta_title || ''}
                        onChange={(e) => updateSectionData('team', { cta_title: e.target.value })}
                        placeholder={t("Want to Join Our Team?")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="team_cta_description">{t('CTA Description')}</Label>
                      <Textarea
                        id="team_cta_description"
                        value={getSectionData('team').cta_description || ''}
                        onChange={(e) => updateSectionData('team', { cta_description: e.target.value })}
                        placeholder={t("We're always looking for talented individuals...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="team_cta_button_text">{t('Button Text')}</Label>
                      <Input
                        id="team_cta_button_text"
                        value={getSectionData('team').cta_button_text || ''}
                        onChange={(e) => updateSectionData('team', { cta_button_text: e.target.value })}
                        placeholder={t("View Open Positions")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Type className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Testimonials Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Section title and description')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.testimonials !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('testimonials', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_title">{t("Section Title")}</Label>
                      <Input
                        id="testimonials_title"
                        value={getSectionData('testimonials').title || ''}
                        onChange={(e) => updateSectionData('testimonials', { title: e.target.value })}
                        placeholder={t("What Our Clients Say")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="testimonials_subtitle"
                        value={getSectionData('testimonials').subtitle || ''}
                        onChange={(e) => updateSectionData('testimonials', { subtitle: e.target.value })}
                        placeholder={t("Don't just take our word for it...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <SettingsIcon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Trust Indicators')}</h3>
                      <p className="text-sm text-gray-500">{t('Statistics that build credibility')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="testimonials_trust_title">{t('Trust Section Title')}</Label>
                      <Input
                        id="testimonials_trust_title"
                        value={getSectionData('testimonials').trust_title || ''}
                        onChange={(e) => updateSectionData('testimonials', { trust_title: e.target.value })}
                        placeholder={t("Trusted by Professionals Worldwide")}
                      />
                    </div>
                    
                    {(getSectionData('testimonials').trust_stats || []).map((stat, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div className="space-y-3">
                          <Label htmlFor={`trust_stat_${index}_value`}>{t("Value")}</Label>
                          <Input
                            id={`trust_stat_${index}_value`}
                            value={stat.value || ''}
                            onChange={(e) => {
                              const newStats = [...(getSectionData('testimonials').trust_stats || [])];
                              newStats[index] = { ...newStats[index], value: e.target.value };
                              updateSectionData('testimonials', { trust_stats: newStats });
                            }}
                            placeholder="4.9/5"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor={`trust_stat_${index}_label`}>{t("Label")}</Label>
                          <Input
                            id={`trust_stat_${index}_label`}
                            value={stat.label || ''}
                            onChange={(e) => {
                              const newStats = [...(getSectionData('testimonials').trust_stats || [])];
                              newStats[index] = { ...newStats[index], label: e.target.value };
                              updateSectionData('testimonials', { trust_stats: newStats });
                            }}
                            placeholder={t("Average Rating")}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor={`trust_stat_${index}_color`}>{t("Color")}</Label>
                          <div className="flex gap-2">
                            <Select
                              value={stat.color || 'blue'}
                              onValueChange={(value) => {
                                const newStats = [...(getSectionData('testimonials').trust_stats || [])];
                                newStats[index] = { ...newStats[index], color: value };
                                updateSectionData('testimonials', { trust_stats: newStats });
                              }}
                            >
                              <SelectTrigger id={`trust_stat_${index}_color`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="black">Black</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => {
                                const newStats = (getSectionData('testimonials').trust_stats || []).filter((_, i) => i !== index);
                                updateSectionData('testimonials', { trust_stats: newStats });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newStats = [...(getSectionData('testimonials').trust_stats || []), { value: '', label: '', color: 'blue' }];
                        updateSectionData('testimonials', { trust_stats: newStats });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Trust Statistic')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-lime-100 rounded-lg">
                      <Users className="h-5 w-5 text-lime-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Default Testimonials')}</h3>
                      <p className="text-sm text-gray-500">{t('Customer reviews and feedback')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('testimonials').testimonials || []).map((testimonial, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('Testimonial')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newTestimonials = (getSectionData('testimonials').testimonials || []).filter((_, i) => i !== index);
                              updateSectionData('testimonials', { testimonials: newTestimonials });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor={`testimonial_${index}_name`}>{t("Name")}</Label>
                            <Input
                              id={`testimonial_${index}_name`}
                              value={testimonial.name || ''}
                              onChange={(e) => {
                                const newTestimonials = [...(getSectionData('testimonials').testimonials || [])];
                                newTestimonials[index] = { ...newTestimonials[index], name: e.target.value };
                                updateSectionData('testimonials', { testimonials: newTestimonials });
                              }}
                              placeholder={t("John Doe")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`testimonial_${index}_role`}>{t("Role")}</Label>
                            <Input
                              id={`testimonial_${index}_role`}
                              value={testimonial.role || ''}
                              onChange={(e) => {
                                const newTestimonials = [...(getSectionData('testimonials').testimonials || [])];
                                newTestimonials[index] = { ...newTestimonials[index], role: e.target.value };
                                updateSectionData('testimonials', { testimonials: newTestimonials });
                              }}
                              placeholder={t("CEO")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`testimonial_${index}_company`}>{t("Company")}</Label>
                            <Input
                              id={`testimonial_${index}_company`}
                              value={testimonial.company || ''}
                              onChange={(e) => {
                                const newTestimonials = [...(getSectionData('testimonials').testimonials || [])];
                                newTestimonials[index] = { ...newTestimonials[index], company: e.target.value };
                                updateSectionData('testimonials', { testimonials: newTestimonials });
                              }}
                              placeholder={t("Company Name")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`testimonial_${index}_rating`}>{t('Rating')}</Label>
                            <Select
                              value={String(testimonial.rating || 5)}
                              onValueChange={(value) => {
                                const newTestimonials = [...(getSectionData('testimonials').testimonials || [])];
                                newTestimonials[index] = { ...newTestimonials[index], rating: parseInt(value) };
                                updateSectionData('testimonials', { testimonials: newTestimonials });
                              }}
                            >
                              <SelectTrigger id={`testimonial_${index}_rating`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">{t('1 Star')}</SelectItem>
                                <SelectItem value="2">{t('2 Stars')}</SelectItem>
                                <SelectItem value="3">{t('3 Stars')}</SelectItem>
                                <SelectItem value="4">{t('4 Stars')}</SelectItem>
                                <SelectItem value="5">{t('5 Stars')}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-3 md:col-span-2">
                            <Label htmlFor={`testimonial_${index}_content`}>{t('Content')}</Label>
                            <Textarea
                              id={`testimonial_${index}_content`}
                              value={testimonial.content || ''}
                              onChange={(e) => {
                                const newTestimonials = [...(getSectionData('testimonials').testimonials || [])];
                                newTestimonials[index] = { ...newTestimonials[index], content: e.target.value };
                                updateSectionData('testimonials', { testimonials: newTestimonials });
                              }}
                              placeholder={t("Testimonial content...")}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newTestimonials = [...(getSectionData('testimonials').testimonials || []), { name: '', role: '', company: '', content: '', rating: 5 }];
                        updateSectionData('testimonials', { testimonials: newTestimonials });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Default Testimonial')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Plans Section */}
            {activeSection === 'plans' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Type className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Plans Section Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Pricing section title and description')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.plans !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('plans', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="plans_title">{t("Section Title")}</Label>
                      <Input
                        id="plans_title"
                        value={getSectionData('plans').title || ''}
                        onChange={(e) => updateSectionData('plans', { title: e.target.value })}
                        placeholder={t("Choose Your Plan")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="plans_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="plans_subtitle"
                        value={getSectionData('plans').subtitle || ''}
                        onChange={(e) => updateSectionData('plans', { subtitle: e.target.value })}
                        placeholder={t("Start with our free plan and upgrade as you grow...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="plans_faq_text">{t('FAQ Text')}</Label>
                      <Input
                        id="plans_faq_text"
                        value={getSectionData('plans').faq_text || ''}
                        onChange={(e) => updateSectionData('plans', { faq_text: e.target.value })}
                        placeholder={t("Have questions about our plans? Contact our sales team")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium mb-1" style={{ color: brandColor }}>{t('Plans Management')}</h4>
                      <p className="text-sm" style={{ color: brandColor + 'cc' }}>
                        {t('The actual plans displayed on the landing page are managed through the Plans module. Go to Plans section to create, edit, or manage your subscription plans.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* FAQ Section */}
            {activeSection === 'faq' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-100 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Section Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Section title, subtitle and CTA')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.faq !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('faq', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="faq_title">{t("Section Title")}</Label>
                      <Input
                        id="faq_title"
                        value={getSectionData('faq').title || ''}
                        onChange={(e) => updateSectionData('faq', { title: e.target.value })}
                        placeholder={t("Frequently Asked Questions")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="faq_subtitle"
                        value={getSectionData('faq').subtitle || ''}
                        onChange={(e) => updateSectionData('faq', { subtitle: e.target.value })}
                        placeholder={t("Got questions? We've got answers...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_cta_text">{t('CTA Text')}</Label>
                      <Input
                        id="faq_cta_text"
                        value={getSectionData('faq').cta_text || ''}
                        onChange={(e) => updateSectionData('faq', { cta_text: e.target.value })}
                        placeholder={t("Still have questions?")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_cta_text">{t('CTA Text')}</Label>
                      <Input
                        id="faq_cta_text"
                        value={getSectionData('faq').cta_text || 'Still have questions?'}
                        onChange={(e) => updateSectionData('faq', { cta_text: e.target.value })}
                        placeholder={t("Still have questions?")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_button_text">{t("Button Text")}</Label>
                      <Input
                        id="faq_button_text"
                        value={getSectionData('faq').button_text || 'Contact Support'}
                        onChange={(e) => updateSectionData('faq', { button_text: e.target.value })}
                        placeholder={t("Contact Support")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Default FAQs')}</h3>
                      <p className="text-sm text-gray-500">{t('Frequently asked questions and answers')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('faq').faqs || []).map((faq, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('FAQ')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newFaqs = (getSectionData('faq').faqs || []).filter((_, i) => i !== index);
                              updateSectionData('faq', { faqs: newFaqs });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label htmlFor={`faq_${index}_question`}>{t('Question')}</Label>
                            <Input
                              id={`faq_${index}_question`}
                              value={faq.question || ''}
                              onChange={(e) => {
                                const newFaqs = [...(getSectionData('faq').faqs || [])];
                                newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                                updateSectionData('faq', { faqs: newFaqs });
                              }}
                              placeholder={t("How does vCard SaaS work?")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`faq_${index}_answer`}>{t('Answer')}</Label>
                            <Textarea
                              id={`faq_${index}_answer`}
                              value={faq.answer || ''}
                              onChange={(e) => {
                                const newFaqs = [...(getSectionData('faq').faqs || [])];
                                newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                                updateSectionData('faq', { faqs: newFaqs });
                              }}
                              placeholder={t("vCard SaaS allows you to create digital business cards...")}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newFaqs = [...(getSectionData('faq').faqs || []), { question: '', answer: '' }];
                        updateSectionData('faq', { faqs: newFaqs });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add FAQ')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Newsletter Section */}
            {activeSection === 'newsletter' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Type className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Newsletter Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Newsletter section title and description')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.newsletter !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('newsletter', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="newsletter_title">{t("Section Title")}</Label>
                      <Input
                        id="newsletter_title"
                        value={getSectionData('newsletter').title || ''}
                        onChange={(e) => updateSectionData('newsletter', { title: e.target.value })}
                        placeholder={t("Stay Updated with vCard")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="newsletter_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="newsletter_subtitle"
                        value={getSectionData('newsletter').subtitle || ''}
                        onChange={(e) => updateSectionData('newsletter', { subtitle: e.target.value })}
                        placeholder={t("Get the latest updates, networking tips...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="newsletter_privacy_text">{t('Privacy Text')}</Label>
                      <Input
                        id="newsletter_privacy_text"
                        value={getSectionData('newsletter').privacy_text || ''}
                        onChange={(e) => updateSectionData('newsletter', { privacy_text: e.target.value })}
                        placeholder={t("No spam, unsubscribe at any time...")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Award className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Newsletter Benefits')}</h3>
                      <p className="text-sm text-gray-500">{t('Benefits of subscribing to newsletter')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('newsletter').benefits || []).map((benefit, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('Benefit')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newBenefits = (getSectionData('newsletter').benefits || []).filter((_, i) => i !== index);
                              updateSectionData('newsletter', { benefits: newBenefits });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor={`benefit_${index}_icon`}>{t('Icon (Emoji)')}</Label>
                            <Input
                              id={`benefit_${index}_icon`}
                              value={benefit.icon || ''}
                              onChange={(e) => {
                                const newBenefits = [...(getSectionData('newsletter').benefits || [])];
                                newBenefits[index] = { ...newBenefits[index], icon: e.target.value };
                                updateSectionData('newsletter', { benefits: newBenefits });
                              }}
                              placeholder="📧"
                              maxLength={2}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`benefit_${index}_title`}>Title</Label>
                            <Input
                              id={`benefit_${index}_title`}
                              value={benefit.title || ''}
                              onChange={(e) => {
                                const newBenefits = [...(getSectionData('newsletter').benefits || [])];
                                newBenefits[index] = { ...newBenefits[index], title: e.target.value };
                                updateSectionData('newsletter', { benefits: newBenefits });
                              }}
                              placeholder={t("Weekly Updates")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`benefit_${index}_description`}>{t("Description")}</Label>
                            <Input
                              id={`benefit_${index}_description`}
                              value={benefit.description || ''}
                              onChange={(e) => {
                                const newBenefits = [...(getSectionData('newsletter').benefits || [])];
                                newBenefits[index] = { ...newBenefits[index], description: e.target.value };
                                updateSectionData('newsletter', { benefits: newBenefits });
                              }}
                              placeholder={t("Latest features and improvements")}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newBenefits = [...(getSectionData('newsletter').benefits || []), { icon: '', title: '', description: '' }];
                        updateSectionData('newsletter', { benefits: newBenefits });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Benefit')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Section */}
            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <Type className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Contact Section Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Contact section titles and descriptions')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.contact !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('contact', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="contact_title">{t("Section Title")}</Label>
                      <Input
                        id="contact_title"
                        value={getSectionData('contact').title || ''}
                        onChange={(e) => updateSectionData('contact', { title: e.target.value })}
                        placeholder={t("Get in Touch")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_subtitle">{t("Section Subtitle")}</Label>
                      <Textarea
                        id="contact_subtitle"
                        value={getSectionData('contact').subtitle || ''}
                        onChange={(e) => updateSectionData('contact', { subtitle: e.target.value })}
                        placeholder={t("Have questions about vCard?...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_form_title">{t('Form Title')}</Label>
                      <Input
                        id="contact_form_title"
                        value={getSectionData('contact').form_title || ''}
                        onChange={(e) => updateSectionData('contact', { form_title: e.target.value })}
                        placeholder={t("Send us a Message")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_info_title">{t('Contact Info Title')}</Label>
                      <Input
                        id="contact_info_title"
                        value={getSectionData('contact').info_title || ''}
                        onChange={(e) => updateSectionData('contact', { info_title: e.target.value })}
                        placeholder={t("Contact Information")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_info_description">{t('Contact Info Description')}</Label>
                      <Textarea
                        id="contact_info_description"
                        value={getSectionData('contact').info_description || ''}
                        onChange={(e) => updateSectionData('contact', { info_description: e.target.value })}
                        placeholder={t("We're here to help and answer any question...")}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Contact Information')}</h3>
                      <p className="text-sm text-gray-500">{t('Company contact details')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="contact_email">{t('Email Address')}</Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        value={data.contact_email || ''}
                        onChange={handleInputChange}
                        placeholder="support@vCard.com"
                        type="email"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_phone">{t('Phone Number')}</Label>
                      <Input
                        id="contact_phone"
                        name="contact_phone"
                        value={data.contact_phone || ''}
                        onChange={handleInputChange}
                        placeholder={t("+1 (555) 123-4567")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="contact_address">{t('Address')}</Label>
                      <Textarea
                        id="contact_address"
                        name="contact_address"
                        value={data.contact_address || ''}
                        onChange={handleInputChange}
                        placeholder={t("123 Business Ave, Suite 100, San Francisco, CA 94105")}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Contact FAQs')}</h3>
                      <p className="text-sm text-gray-500">{t('Contact-related frequently asked questions')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('contact').faqs || []).map((faq, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{t("FAQ")} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newFaqs = (getSectionData('contact').faqs || []).filter((_, i) => i !== index);
                              updateSectionData('contact', { faqs: newFaqs });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label htmlFor={`contact_faq_${index}_question`}>Question</Label>
                            <Input
                              id={`contact_faq_${index}_question`}
                              value={faq.question || ''}
                              onChange={(e) => {
                                const newFaqs = [...(getSectionData('contact').faqs || [])];
                                newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                                updateSectionData('contact', { faqs: newFaqs });
                              }}
                              placeholder={t("How quickly do you respond?")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`contact_faq_${index}_answer`}>Answer</Label>
                            <Textarea
                              id={`contact_faq_${index}_answer`}
                              value={faq.answer || ''}
                              onChange={(e) => {
                                const newFaqs = [...(getSectionData('contact').faqs || [])];
                                newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                                updateSectionData('contact', { faqs: newFaqs });
                              }}
                              placeholder={t("We typically respond within 24 hours...")}
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newFaqs = [...(getSectionData('contact').faqs || []), { question: '', answer: '' }];
                        updateSectionData('contact', { faqs: newFaqs });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add FAQ')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Footer Section */}
            {activeSection === 'footer' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Type className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Footer Content')}</h3>
                        <p className="text-sm text-gray-500">{t('Footer description and newsletter content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Enable Section')}</Label>
                      <Switch
                        checked={data.config_sections?.section_visibility?.footer !== false}
                        onCheckedChange={(checked) => updateSectionVisibility('footer', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="footer_description">{t('Company Description')}</Label>
                      <Textarea
                        id="footer_description"
                        value={getSectionData('footer').description || ''}
                        onChange={(e) => updateSectionData('footer', { description: e.target.value })}
                        placeholder={t("Transforming professional networking...")}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="footer_newsletter_title">{t('Newsletter Title')}</Label>
                      <Input
                        id="footer_newsletter_title"
                        value={getSectionData('footer').newsletter_title || ''}
                        onChange={(e) => updateSectionData('footer', { newsletter_title: e.target.value })}
                        placeholder={t("Stay Updated with Our Latest Features")}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="footer_newsletter_subtitle">{t('Newsletter Subtitle')}</Label>
                      <Input
                        id="footer_newsletter_subtitle"
                        value={getSectionData('footer').newsletter_subtitle || ''}
                        onChange={(e) => updateSectionData('footer', { newsletter_subtitle: e.target.value })}
                        placeholder={t("Join our newsletter for product updates...")}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Social Links')}</h3>
                      <p className="text-sm text-gray-500">{t('Social media links and profiles')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(getSectionData('footer').social_links || []).map((social, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            {t('Social Link')} {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const newSocials = (getSectionData('footer').social_links || []).filter((_, i) => i !== index);
                              updateSectionData('footer', { social_links: newSocials });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <Label htmlFor={`social_${index}_name`}>{t("Name")}</Label>
                            <Input
                              id={`social_${index}_name`}
                              value={social.name || ''}
                              onChange={(e) => {
                                const newSocials = [...(getSectionData('footer').social_links || [])];
                                newSocials[index] = { ...newSocials[index], name: e.target.value };
                                updateSectionData('footer', { social_links: newSocials });
                              }}
                              placeholder={t("Facebook")}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`social_${index}_icon`}>{t("Icon")}</Label>
                            <Select
                              value={social.icon || 'Facebook'}
                              onValueChange={(value) => {
                                const newSocials = [...(getSectionData('footer').social_links || [])];
                                newSocials[index] = { ...newSocials[index], icon: value };
                                updateSectionData('footer', { social_links: newSocials });
                              }}
                            >
                              <SelectTrigger id={`social_${index}_icon`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="Twitter">Twitter</SelectItem>
                                <SelectItem value="Linkedin">LinkedIn</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-3">
                            <Label htmlFor={`social_${index}_href`}>{t("URL")}</Label>
                            <Input
                              id={`social_${index}_href`}
                              value={social.href || ''}
                              onChange={(e) => {
                                const newSocials = [...(getSectionData('footer').social_links || [])];
                                newSocials[index] = { ...newSocials[index], href: e.target.value };
                                updateSectionData('footer', { social_links: newSocials });
                              }}
                              placeholder="https://facebook.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newSocials = [...(getSectionData('footer').social_links || []), { name: '', icon: 'Facebook', href: '' }];
                        updateSectionData('footer', { social_links: newSocials });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Social Link')}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t("Footer Links")}</h3>
                      <p className="text-sm text-gray-500">{t("Footer navigation links by category")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {['product', 'company', 'support', 'legal'].map((category) => (
                      <div key={category} className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor={`${category}_title`}>{t("Section Title")}</Label>
                          <Input
                            id={`${category}_title`}
                            value={getSectionData('footer').section_titles?.[category] || ''}
                            onChange={(e) => {
                              const newTitles = { ...getSectionData('footer').section_titles };
                              newTitles[category] = e.target.value;
                              updateSectionData('footer', { section_titles: newTitles });
                            }}
                            placeholder={category.charAt(0).toUpperCase() + category.slice(1)}
                          />
                        </div>
                        <h4 className="font-medium">{getSectionData('footer').section_titles?.[category] || category.charAt(0).toUpperCase() + category.slice(1)} Links</h4>
                        {(getSectionData('footer').links?.[category] || []).map((link: any, index: number) => (
                          <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                            <div className="space-y-3">
                              <Label htmlFor={`${category}_${index}_name`}>{t("Name")}</Label>
                              <Input
                                id={`${category}_${index}_name`}
                                value={link.name || ''}
                                onChange={(e) => {
                                  const newLinks = { ...getSectionData('footer').links };
                                  if (!newLinks[category]) newLinks[category] = [];
                                  newLinks[category][index] = { ...newLinks[category][index], name: e.target.value };
                                  updateSectionData('footer', { links: newLinks });
                                }}
                                placeholder={t("Features")}
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor={`${category}_${index}_href`}>{t("URL")}</Label>
                              <div className="flex gap-2">
                                <Input
                                  id={`${category}_${index}_href`}
                                  value={link.href || ''}
                                  onChange={(e) => {
                                    const newLinks = { ...getSectionData('footer').links };
                                    if (!newLinks[category]) newLinks[category] = [];
                                    newLinks[category][index] = { ...newLinks[category][index], href: e.target.value };
                                    updateSectionData('footer', { links: newLinks });
                                  }}
                                  placeholder="#features"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => {
                                    const newLinks = { ...getSectionData('footer').links };
                                    if (newLinks[category]) {
                                      newLinks[category] = newLinks[category].filter((_: any, i: number) => i !== index);
                                      updateSectionData('footer', { links: newLinks });
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-2"
                          style={{ color: brandColor, borderColor: brandColor }}
                          onClick={() => {
                            const newLinks = { ...getSectionData('footer').links };
                            if (!newLinks[category]) newLinks[category] = [];
                            newLinks[category].push({ name: '', href: '' });
                            updateSectionData('footer', { links: newLinks });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t("Add")} {getSectionData('footer').section_titles?.[category] || category.charAt(0).toUpperCase() + category.slice(1)} {t("Link")}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Design Section */}
            {activeSection === 'design' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Colors & Theme")}</h3>
                  </div>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="primary_color">{t("Primary Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary_color"
                          type="color"
                          value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                          onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                          onChange={(e) => updateThemeData({ primary_color: e.target.value })}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="secondary_color">{t("Secondary Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary_color"
                          type="color"
                          value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                          onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                          onChange={(e) => updateThemeData({ secondary_color: e.target.value })}
                          placeholder="#8b5cf6"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="accent_color">{t("Accent Color")}</Label>
                      <div className="flex gap-2">
                        <Input
                          id="accent_color"
                          type="color"
                          value={data.config_sections?.theme?.accent_color || '#10b77f'}
                          onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={data.config_sections?.theme?.accent_color || '#10b77f'}
                          onChange={(e) => updateThemeData({ accent_color: e.target.value })}
                          placeholder="#10b77f"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Image className="h-5 w-5 mr-2 text-muted-foreground" />
                    <h3 className="text-base font-medium">{t("Images & Logos")}</h3>
                  </div>
                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <MediaPicker
                        label={t("Logo (Light)")}
                        value={getDisplayUrl(data.config_sections?.theme?.logo_light || '')}
                        onChange={(value) => {
                          updateThemeData({ logo_light: convertToRelativePath(value) });
                        }}
                        placeholder={t("Select light logo...")}
                      />
                    </div>
                    <div className="space-y-3">
                      <MediaPicker
                        label={t("Logo (Dark)")}
                        value={getDisplayUrl(data.config_sections?.theme?.logo_dark || '')}
                        onChange={(value) => {
                          updateThemeData({ logo_dark: convertToRelativePath(value) });
                        }}
                        placeholder={t("Select dark logo...")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Change Order Section */}
            {activeSection === 'order' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <ArrowUpDown className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Section Order')}</h3>
                      <p className="text-sm text-gray-500">{t('Drag and drop to reorder sections on your landing page')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {(data.config_sections?.section_order || []).map((sectionKey, index) => {
                      const sectionNames = {
                        header: t('Header'),
                        hero: t('Hero'),
                        features: t('Features'),
                        screenshots: t('Screenshots'),
                        why_choose_us: t('Why Choose Us'),
                        templates: t('Templates'),
                        about: t('About'),
                        team: t('Team'),
                        testimonials: t('Testimonials'),
                        active_campaigns: t('Active Campaigns'),
                        plans: t('Plans'),
                        faq: t('FAQ'),
                        newsletter: t('Newsletter'),
                        contact: t('Contact'),
                        footer: t('Footer')
                      };
                      
                      const isEnabled = data.config_sections?.section_visibility?.[sectionKey] !== false;
                      
                      return (
                        <div
                          key={sectionKey}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          className={`flex items-center gap-3 p-4 border rounded-lg cursor-move transition-all hover:shadow-md ${
                            isEnabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300 opacity-60'
                          }`}
                        >
                          <GripVertical className="h-5 w-5 text-gray-400" />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="font-medium text-gray-900">{sectionNames[sectionKey] || sectionKey}</h4>
                                <p className="text-sm text-gray-500">
                                  {isEnabled ? t('Enabled') : t('Disabled')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">{t('Enable')}</Label>
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => updateSectionVisibility(sectionKey, checked)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">{t('How to reorder')}</h4>
                        <p className="text-sm text-blue-700">
                          {t('Click and drag any section to change its position. Disabled sections will still appear in the order but won\'t be visible on the landing page.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Advanced Section */}
            {activeSection === 'advanced' && (
              <div className="space-y-6">
                {/* SEO Settings Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("SEO Settings")}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Optimize your landing page for search engines")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="meta_title">{t("Meta Title")}</Label>
                      <Input
                        id="meta_title"
                        value={data.config_sections?.seo?.meta_title || ''}
                        onChange={(e) => updateSeoData({ meta_title: e.target.value })}
                        placeholder={t("Landing Page Title")}
                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('The title that appears in search engine results')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="meta_description">{t("Meta Description")}</Label>
                      <Textarea
                        id="meta_description"
                        value={data.config_sections?.seo?.meta_description || ''}
                        onChange={(e) => updateSeoData({ meta_description: e.target.value })}
                        placeholder={t("Landing page description for search engines")}
                        rows={3}
                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Brief description shown in search results (150-160 characters recommended)')}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="meta_keywords">{t("Meta Keywords")}</Label>
                      <Input
                        id="meta_keywords"
                        value={data.config_sections?.seo?.meta_keywords || ''}
                        onChange={(e) => updateSeoData({ meta_keywords: e.target.value })}
                        placeholder={t("vcard, digital business card, networking")}
                        className="border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t('Comma-separated keywords related to your business')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom CSS Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("Custom CSS")}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Add custom styles to your landing page")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="custom_css">{t("CSS Code")}</Label>
                    <Textarea
                      id="custom_css"
                      value={data.config_sections?.custom_css || ''}
                      onChange={(e) => setData('config_sections', { ...data.config_sections, custom_css: e.target.value })}
                      placeholder={t("/* Add your custom CSS here */\n.my-custom-class {\n  color: #333;\n}")}
                      rows={8}
                      className="font-mono text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('Add custom CSS to override default styles. Changes will be applied to your landing page.')}
                    </p>
                  </div>
                </div>
                
                {/* Custom JavaScript Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('Custom JavaScript')}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t("Add custom functionality to your landing page")}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="custom_js">{t('JavaScript Code')}</Label>
                    <Textarea
                      id="custom_js"
                      value={data.config_sections?.custom_js || ''}
                      onChange={(e) => setData('config_sections', { ...data.config_sections, custom_js: e.target.value })}
                      placeholder={t("// Add your custom JavaScript here\nconsole.log('Custom JS loaded');")}
                      rows={8}
                      className="font-mono text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('Add custom JavaScript for advanced functionality. Code will be executed on your landing page.')}
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 mb-1">{t('Warning')}</h4>
                        <p className="text-xs text-yellow-700 dark:text-yellow-500">
                          {t('Be careful when adding custom JavaScript. Incorrect code may break your landing page functionality.')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - Privacy Policy */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Privacy Policy Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure privacy policy page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('privacy').active !== false}
                        onCheckedChange={(checked) => updateSectionData('privacy', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="privacy_title">{t('Page Title')}</Label>
                      <Input
                        id="privacy_title"
                        value={getSectionData('privacy').title || t('Privacy Policy')}
                        onChange={(e) => updateSectionData('privacy', { title: e.target.value })}
                        placeholder={t('Privacy Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_description">{t('Page Description')}</Label>
                      <Textarea
                        id="privacy_description"
                        value={getSectionData('privacy').description || t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
                        onChange={(e) => updateSectionData('privacy', { description: e.target.value })}
                        placeholder={t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - Terms of Service */}
            {activeSection === 'terms' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Terms of Service Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure terms of service page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('terms').active !== false}
                        onCheckedChange={(checked) => updateSectionData('terms', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="terms_title">{t('Page Title')}</Label>
                      <Input
                        id="terms_title"
                        value={getSectionData('terms').title || t('Terms of Service')}
                        onChange={(e) => updateSectionData('terms', { title: e.target.value })}
                        placeholder={t('Terms of Service')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_description">{t('Page Description')}</Label>
                      <Textarea
                        id="terms_description"
                        value={getSectionData('terms').description || t('Please read these terms carefully before using our services.')}
                        onChange={(e) => updateSectionData('terms', { description: e.target.value })}
                        placeholder={t('Please read these terms carefully before using our services.')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - Refund Policy */}
            {activeSection === 'refund' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <CreditCard className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Refund Policy Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure refund policy page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('refund').active !== false}
                        onCheckedChange={(checked) => updateSectionData('refund', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="refund_title">{t('Page Title')}</Label>
                      <Input
                        id="refund_title"
                        value={getSectionData('refund').title || t('Refund Policy')}
                        onChange={(e) => updateSectionData('refund', { title: e.target.value })}
                        placeholder={t('Refund Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_description">{t('Page Description')}</Label>
                      <Textarea
                        id="refund_description"
                        value={getSectionData('refund').description || t('We stand behind our service with a satisfaction guarantee. Here\'s everything you need to know about our refund policy.')}
                        onChange={(e) => updateSectionData('refund', { description: e.target.value })}
                        placeholder={t('We stand behind our service with a satisfaction guarantee. Here\'s everything you need to know about our refund policy.')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - FAQ Page */}
            {activeSection === 'faq-page' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <HelpCircle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Configure FAQ page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('faq-page').active !== false}
                        onCheckedChange={(checked) => updateSectionData('faq-page', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_title">{t('Page Title')}</Label>
                      <Input
                        id="faq_page_title"
                        value={getSectionData('faq-page').title || t('Frequently Asked Questions')}
                        onChange={(e) => updateSectionData('faq-page', { title: e.target.value })}
                        placeholder={t('Frequently Asked Questions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_description">{t('Page Description')}</Label>
                      <Textarea
                        id="faq_page_description"
                        value={getSectionData('faq-page').description || t('Find quick answers to the most common questions')}
                        onChange={(e) => updateSectionData('faq-page', { description: e.target.value })}
                        placeholder={t('Find quick answers to the most common questions')}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Pages Section - Custom Pages Management */}
            {activeSection === 'pages' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FileText className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('Custom Pages')}</h3>
                        <p className="text-sm text-gray-500">{t('Manage custom pages for your website')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(data.config_sections?.custom_pages || []).map((page, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{page.name}</h4>
                              <p className="text-sm text-gray-500">/{page.slug}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">{t('Active')}</Label>
                            <Switch
                              checked={page.active !== false}
                              onCheckedChange={(checked) => {
                                const newPages = [...(data.config_sections?.custom_pages || [])];
                                newPages[index] = { ...newPages[index], active: checked };
                                setData('config_sections', {
                                  ...data.config_sections,
                                  custom_pages: newPages
                                });
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() => {
                                setPageToDelete(page.key);
                                setShowDeletePageDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <Label>{t('Page Name')}</Label>
                            <Input
                              value={page.name || ''}
                              onChange={(e) => {
                                const newPages = [...(data.config_sections?.custom_pages || [])];
                                newPages[index] = { ...newPages[index], name: e.target.value };
                                setData('config_sections', {
                                  ...data.config_sections,
                                  custom_pages: newPages
                                });
                              }}
                              placeholder={t('Page Name')}
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <Label>{t('URL Slug')}</Label>
                            <Input
                              value={page.slug || ''}
                              onChange={(e) => {
                                const newPages = [...(data.config_sections?.custom_pages || [])];
                                newPages[index] = { ...newPages[index], slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') };
                                setData('config_sections', {
                                  ...data.config_sections,
                                  custom_pages: newPages
                                });
                              }}
                              placeholder={t('page-url')}
                            />
                          </div>
                          
                          <div className="space-y-3 md:col-span-2">
                            <Label>{t('Page Title')}</Label>
                            <Input
                              value={page.title || ''}
                              onChange={(e) => {
                                const newPages = [...(data.config_sections?.custom_pages || [])];
                                newPages[index] = { ...newPages[index], title: e.target.value };
                                setData('config_sections', {
                                  ...data.config_sections,
                                  custom_pages: newPages
                                });
                              }}
                              placeholder={t('Page Title for SEO')}
                            />
                          </div>
                          
                          <div className="space-y-3 md:col-span-2">
                            <Label>{t('Page Description')}</Label>
                            <Textarea
                              value={page.description || ''}
                              onChange={(e) => {
                                const newPages = [...(data.config_sections?.custom_pages || [])];
                                newPages[index] = { ...newPages[index], description: e.target.value };
                                setData('config_sections', {
                                  ...data.config_sections,
                                  custom_pages: newPages
                                });
                              }}
                              placeholder={t('Page description for SEO')}
                              rows={2}
                            />
                          </div>
                          
                          <div className="space-y-3 md:col-span-2">
                            <Label>{t('Page Content')}</Label>
                            <Textarea
                              value={page.content || ''}
                              onChange={(e) => {
                                const newPages = [...(data.config_sections?.custom_pages || [])];
                                newPages[index] = { ...newPages[index], content: e.target.value };
                                setData('config_sections', {
                                  ...data.config_sections,
                                  custom_pages: newPages
                                });
                              }}
                              placeholder={t('Enter your page content here...')}
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {(!data.config_sections?.custom_pages || data.config_sections.custom_pages.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>{t('No custom pages yet. Click "Add Page" to create your first custom page.')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Pages Section - About Us */}
            {activeSection === 'about-page' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t('About Us Page')}</h3>
                        <p className="text-sm text-gray-500">{t('Customize your About Us page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData('about-page').active !== false}
                        onCheckedChange={(checked) => updateSectionData('about-page', { active: checked })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="about_page_title">{t('Page Title')}</Label>
                      <Input
                        id="about_page_title"
                        value={getSectionData('about-page').title || 'About vCard'}
                        onChange={(e) => updateSectionData('about-page', { title: e.target.value })}
                        placeholder={t('About Us')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="about_page_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="about_page_subtitle"
                        value={getSectionData('about-page').subtitle || 'Revolutionizing digital networking with innovative business card solutions'}
                        onChange={(e) => updateSectionData('about-page', { subtitle: e.target.value })}
                        placeholder={t('Learn more about our company')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="about_page_story_title">{t('Story Title')}</Label>
                      <Input
                        id="about_page_story_title"
                        value={getSectionData('about-page').story_title || 'Empowering Professional Connections Since 2020'}
                        onChange={(e) => updateSectionData('about-page', { story_title: e.target.value })}
                        placeholder={t('Empowering Professional Connections Since 2020')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="about_page_content">{t('Story Content')}</Label>
                      <RichTextField
                        value={getSectionData('about-page').content || '<p>vCard SaaS is a leading digital business card platform that helps businesses create professional online presence. Our mission is to revolutionize how businesses connect and share information in the digital age.</p><p>Founded with the vision of making networking seamless and efficient, we provide cutting-edge solutions for modern businesses. We believe that every connection matters and every interaction should leave a lasting impression.</p>'}
                        onChange={(value) => updateSectionData('about-page', { content: value })}
                        placeholder={t('Write your about us story here...')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Stats Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Statistics')}</h3>
                      <p className="text-sm text-gray-500">{t('Add key statistics')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {((getSectionData('about-page').stats && getSectionData('about-page').stats.length > 0) ? getSectionData('about-page').stats : [
                      { value: '4+ Years', label: 'Experience' },
                      { value: '10K+', label: 'Happy Users' },
                      { value: '50+', label: 'Countries' }
                    ]).map((stat: any, index: number) => (
                      <div key={index} className="grid grid-cols-10 gap-4 p-4 border rounded-lg">
                        <div className="col-span-3 space-y-3">
                          <Label>{t('Value')}</Label>
                          <Input
                            value={stat.value || ''}
                            onChange={(e) => {
                              const currentStats = getSectionData('about-page').stats || [
                                { value: '4+ Years', label: 'Experience', color: 'blue' },
                                { value: '10K+', label: 'Happy Users', color: 'green' },
                                { value: '50+', label: 'Countries', color: 'purple' }
                              ];
                              const newStats = [...currentStats];
                              newStats[index] = { ...newStats[index], value: e.target.value };
                              updateSectionData('about-page', { stats: newStats });
                            }}
                            placeholder="4+ Years"
                          />
                        </div>
                        <div className="col-span-3 space-y-3">
                          <Label>{t('Label')}</Label>
                          <Input
                            value={stat.label || ''}
                            onChange={(e) => {
                              const currentStats = getSectionData('about-page').stats || [
                                { value: '4+ Years', label: 'Experience', color: 'blue' },
                                { value: '10K+', label: 'Happy Users', color: 'green' },
                                { value: '50+', label: 'Countries', color: 'purple' }
                              ];
                              const newStats = [...currentStats];
                              newStats[index] = { ...newStats[index], label: e.target.value };
                              updateSectionData('about-page', { stats: newStats });
                            }}
                            placeholder={t('Experience')}
                          />
                        </div>
                        <div className="col-span-3 space-y-3">
                          <Label>{t('Color')}</Label>
                          <Select
                            value={stat.color || 'blue'}
                            onValueChange={(value) => {
                              const currentStats = getSectionData('about-page').stats || [
                                { value: '4+ Years', label: 'Experience', color: 'blue' },
                                { value: '10K+', label: 'Happy Users', color: 'green' },
                                { value: '50+', label: 'Countries', color: 'purple' }
                              ];
                              const newStats = [...currentStats];
                              newStats[index] = { ...newStats[index], color: value };
                              updateSectionData('about-page', { stats: newStats });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="black">Black</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                              <SelectItem value="yellow">Yellow</SelectItem>
                              <SelectItem value="indigo">Indigo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentStats = getSectionData('about-page').stats || [
                                { value: '4+ Years', label: 'Experience', color: 'blue' },
                                { value: '10K+', label: 'Happy Users', color: 'green' },
                                { value: '50+', label: 'Countries', color: 'purple' }
                              ];
                              const newStats = currentStats.filter((_: any, i: number) => i !== index);
                              updateSectionData('about-page', { stats: newStats });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newStats = [...(getSectionData('about-page').stats || []), { value: '', label: '', color: 'blue' }];
                        updateSectionData('about-page', { stats: newStats });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Statistic')}
                    </Button>
                  </div>
                </div>
                
                {/* Values Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Target className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Values Cards')}</h3>
                      <p className="text-sm text-gray-500">{t('Add company values with icons')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {((getSectionData('about-page').values && getSectionData('about-page').values.length > 0) ? getSectionData('about-page').values : [
                      { icon: 'target', title: 'Our Mission', description: 'To revolutionize professional networking by making digital business cards accessible, efficient, and environmentally friendly.' },
                      { icon: 'heart', title: 'Our Values', description: 'We believe in innovation, sustainability, and building genuine connections that drive business success.' },
                      { icon: 'award', title: 'Our Commitment', description: 'Delivering exceptional user experience with cutting-edge technology and unparalleled customer support.' },
                      { icon: 'lightbulb', title: 'Our Vision', description: 'A world where every professional interaction is seamless, memorable, and leads to meaningful business relationships.' }
                    ]).map((value: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{t('Card')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentValues = getSectionData('about-page').values || [
                                { icon: 'target', title: 'Our Mission', description: 'To revolutionize professional networking by making digital business cards accessible, efficient, and environmentally friendly.' },
                                { icon: 'heart', title: 'Our Values', description: 'We believe in innovation, sustainability, and building genuine connections that drive business success.' },
                                { icon: 'award', title: 'Our Commitment', description: 'Delivering exceptional user experience with cutting-edge technology and unparalleled customer support.' },
                                { icon: 'lightbulb', title: 'Our Vision', description: 'A world where every professional interaction is seamless, memorable, and leads to meaningful business relationships.' }
                              ];
                              const newValues = currentValues.filter((_: any, i: number) => i !== index);
                              updateSectionData('about-page', { values: newValues });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-3">
                            <Label>{t('Icon')}</Label>
                            <Select
                              value={value.icon || 'target'}
                              onValueChange={(value) => {
                                const currentValues = getSectionData('about-page').values || [
                                  { icon: 'target', title: 'Our Mission', description: 'To revolutionize professional networking by making digital business cards accessible, efficient, and environmentally friendly.' },
                                  { icon: 'heart', title: 'Our Values', description: 'We believe in innovation, sustainability, and building genuine connections that drive business success.' },
                                  { icon: 'award', title: 'Our Commitment', description: 'Delivering exceptional user experience with cutting-edge technology and unparalleled customer support.' },
                                  { icon: 'lightbulb', title: 'Our Vision', description: 'A world where every professional interaction is seamless, memorable, and leads to meaningful business relationships.' }
                                ];
                                const newValues = [...currentValues];
                                newValues[index] = { ...newValues[index], icon: value };
                                updateSectionData('about-page', { values: newValues });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="target">Target</SelectItem>
                                <SelectItem value="heart">Heart</SelectItem>
                                <SelectItem value="award">Award</SelectItem>
                                <SelectItem value="lightbulb">Lightbulb</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3 md:col-span-2">
                            <Label>{t('Title')}</Label>
                            <Input
                              value={value.title || ''}
                              onChange={(e) => {
                                const currentValues = getSectionData('about-page').values || [
                                  { icon: 'target', title: 'Our Mission', description: 'To revolutionize professional networking by making digital business cards accessible, efficient, and environmentally friendly.' },
                                  { icon: 'heart', title: 'Our Values', description: 'We believe in innovation, sustainability, and building genuine connections that drive business success.' },
                                  { icon: 'award', title: 'Our Commitment', description: 'Delivering exceptional user experience with cutting-edge technology and unparalleled customer support.' },
                                  { icon: 'lightbulb', title: 'Our Vision', description: 'A world where every professional interaction is seamless, memorable, and leads to meaningful business relationships.' }
                                ];
                                const newValues = [...currentValues];
                                newValues[index] = { ...newValues[index], title: e.target.value };
                                updateSectionData('about-page', { values: newValues });
                              }}
                              placeholder={t('Our Mission')}
                            />
                          </div>
                          <div className="space-y-3 md:col-span-3">
                            <Label>{t('Description')}</Label>
                            <Textarea
                              value={value.description || ''}
                              onChange={(e) => {
                                const currentValues = getSectionData('about-page').values || [
                                  { icon: 'target', title: 'Our Mission', description: 'To revolutionize professional networking by making digital business cards accessible, efficient, and environmentally friendly.' },
                                  { icon: 'heart', title: 'Our Values', description: 'We believe in innovation, sustainability, and building genuine connections that drive business success.' },
                                  { icon: 'award', title: 'Our Commitment', description: 'Delivering exceptional user experience with cutting-edge technology and unparalleled customer support.' },
                                  { icon: 'lightbulb', title: 'Our Vision', description: 'A world where every professional interaction is seamless, memorable, and leads to meaningful business relationships.' }
                                ];
                                const newValues = [...currentValues];
                                newValues[index] = { ...newValues[index], description: e.target.value };
                                updateSectionData('about-page', { values: newValues });
                              }}
                              placeholder={t('To revolutionize professional networking...')}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newValues = [...(getSectionData('about-page').values || []), { icon: 'target', title: '', description: '' }];
                        updateSectionData('about-page', { values: newValues });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Value Card')}
                    </Button>
                  </div>
                </div>
                
                {/* Image Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Image className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Image Section')}</h3>
                      <p className="text-sm text-gray-500">{t('Image with icon and text')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-3">
                      <Label>{t('Upload Image')}</Label>
                      <MediaPicker
                        value={getSectionData('about-page').image || ''}
                        onChange={(url) => updateSectionData('about-page', { image: url })}
                        accept="image/*"
                        maxSize={5}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>{t('Icon Emoji')} ({t('Shows when no image')})</Label>
                      <Input
                        value={getSectionData('about-page').image_icon || '🚀'}
                        onChange={(e) => updateSectionData('about-page', { image_icon: e.target.value })}
                        placeholder="🚀"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label>{t('Image Title')}</Label>
                      <Input
                        value={getSectionData('about-page').image_title || 'Innovation Driven'}
                        onChange={(e) => updateSectionData('about-page', { image_title: e.target.value })}
                        placeholder={t('Innovation Driven')}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>{t('Image Subtitle')}</Label>
                      <Input
                        value={getSectionData('about-page').image_subtitle || 'Building the future of networking'}
                        onChange={(e) => updateSectionData('about-page', { image_subtitle: e.target.value })}
                        placeholder={t('Building the future')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact Page Settings */}
            {activeSection === 'contact-page' && (
              <ContactPageSettings 
                data={data} 
                setData={setData} 
                errors={errors} 
                handleInputChange={handleInputChange}
                getSectionData={getSectionData}
                updateSectionData={updateSectionData}
                t={t}
              />
            )}
            
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Privacy Policy Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your Privacy Policy page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="privacy_title">{t('Page Title')}</Label>
                      <Input
                        id="privacy_title"
                        value={getSectionData('privacy').title || 'Privacy Policy'}
                        onChange={(e) => updateSectionData('privacy', { title: e.target.value })}
                        placeholder={t('Privacy Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="privacy_subtitle"
                        value={getSectionData('privacy').subtitle || 'Your privacy is important to us. This policy explains how we collect, use, and protect your information.'}
                        onChange={(e) => updateSectionData('privacy', { subtitle: e.target.value })}
                        placeholder={t('Your privacy is important to us. This policy explains how we collect, use, and protect your information.')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_story_title">{t('Story Title')}</Label>
                      <Input
                        id="privacy_story_title"
                        value={getSectionData('privacy').story_title || 'How We Protect Your Information'}
                        onChange={(e) => updateSectionData('privacy', { story_title: e.target.value })}
                        placeholder={t('How We Protect Your Information')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="privacy_content">{t('Privacy Policy Content')}</Label>
                      <RichTextField
                        value={getSectionData('privacy').content || '<p>We are committed to protecting your privacy and ensuring the security of your personal information.</p>'}
                        onChange={(value) => updateSectionData('privacy', { content: value })}
                        placeholder={t('Write your privacy policy content here...')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Privacy Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Privacy Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add sections with colored borders and bullet points')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {((getSectionData('privacy').sections && getSectionData('privacy').sections.length > 0) ? getSectionData('privacy').sections : [
                      { title: 'Information We Collect', content: 'We collect information you provide directly to us, including:', color: 'blue', items: ['Account registration information', 'Profile and business card details'] },
                      { title: 'How We Use Your Information', content: 'We use the information we collect to:', color: 'green', items: ['Provide and maintain our services', 'Process transactions'] },
                      { title: 'Information Sharing', content: 'We do not sell your personal information.', color: 'purple', items: [] },
                      { title: 'Data Security', content: 'We implement security measures to protect your information.', color: 'red', items: [] }
                    ]).map((section: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{t('Section')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentSections = getSectionData('privacy').sections || [];
                              const newSections = currentSections.filter((_: any, i: number) => i !== index);
                              updateSectionData('privacy', { sections: newSections });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-3">
                            <Label>{t('Section Title')}</Label>
                            <Input
                              value={section?.title || ''}
                              onChange={(e) => {
                                const currentSections = getSectionData('privacy').sections || [
                                  { title: 'Information We Collect', content: 'We collect information you provide directly to us, including:', color: 'blue', items: ['Account registration information', 'Profile and business card details'] },
                                  { title: 'How We Use Your Information', content: 'We use the information we collect to:', color: 'green', items: ['Provide and maintain our services', 'Process transactions'] },
                                  { title: 'Information Sharing', content: 'We do not sell your personal information.', color: 'purple', items: [] },
                                  { title: 'Data Security', content: 'We implement security measures to protect your information.', color: 'red', items: [] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], title: e.target.value };
                                updateSectionData('privacy', { sections: newSections });
                              }}
                              placeholder={t('Section Title')}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>{t('Color')}</Label>
                            <Select
                              value={section?.color || 'blue'}
                              onValueChange={(value) => {
                                const currentSections = getSectionData('privacy').sections || [
                                  { title: 'Information We Collect', content: 'We collect information you provide directly to us, including:', color: 'blue', items: ['Account registration information', 'Profile and business card details'] },
                                  { title: 'How We Use Your Information', content: 'We use the information we collect to:', color: 'green', items: ['Provide and maintain our services', 'Process transactions'] },
                                  { title: 'Information Sharing', content: 'We do not sell your personal information.', color: 'purple', items: [] },
                                  { title: 'Data Security', content: 'We implement security measures to protect your information.', color: 'red', items: [] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], color: value };
                                updateSectionData('privacy', { sections: newSections });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="indigo">Indigo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          <Label>{t('Section Content')}</Label>
                          <Textarea
                            value={section?.content || ''}
                            onChange={(e) => {
                              const currentSections = getSectionData('privacy').sections || [
                                { title: 'Information We Collect', content: 'We collect information you provide directly to us, including:', color: 'blue', items: ['Account registration information', 'Profile and business card details'] },
                                { title: 'How We Use Your Information', content: 'We use the information we collect to:', color: 'green', items: ['Provide and maintain our services', 'Process transactions'] },
                                { title: 'Information Sharing', content: 'We do not sell your personal information.', color: 'purple', items: [] },
                                { title: 'Data Security', content: 'We implement security measures to protect your information.', color: 'red', items: [] }
                              ];
                              const newSections = [...currentSections];
                              newSections[index] = { ...newSections[index], content: e.target.value };
                              updateSectionData('privacy', { sections: newSections });
                            }}
                            placeholder={t('Section content...')}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>{t('Bullet Points')} ({t('One per line')})</Label>
                          <Textarea
                            value={(section?.items || []).join('\n')}
                            onChange={(e) => {
                              const currentSections = getSectionData('privacy').sections || [
                                { title: 'Information We Collect', content: 'We collect information you provide directly to us, including:', color: 'blue', items: ['Account registration information', 'Profile and business card details'] },
                                { title: 'How We Use Your Information', content: 'We use the information we collect to:', color: 'green', items: ['Provide and maintain our services', 'Process transactions'] },
                                { title: 'Information Sharing', content: 'We do not sell your personal information.', color: 'purple', items: [] },
                                { title: 'Data Security', content: 'We implement security measures to protect your information.', color: 'red', items: [] }
                              ];
                              const newSections = [...currentSections];
                              const items = e.target.value.split('\n').filter(item => item.trim());
                              newSections[index] = { ...newSections[index], items };
                              updateSectionData('privacy', { sections: newSections });
                            }}
                            placeholder={t('Enter bullet points, one per line...')}
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newSections = [...(getSectionData('privacy').sections || []), { title: '', content: '', color: 'blue', items: [] }];
                        updateSectionData('privacy', { sections: newSections });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Section')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Terms of Service Section */}
            {activeSection === 'terms' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Terms of Service Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your Terms of Service page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="terms_title">{t('Page Title')}</Label>
                      <Input
                        id="terms_title"
                        value={getSectionData('terms').title || 'Terms of Service'}
                        onChange={(e) => updateSectionData('terms', { title: e.target.value })}
                        placeholder={t('Terms of Service')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="terms_subtitle"
                        value={getSectionData('terms').subtitle || 'Please read these terms carefully before using our services.'}
                        onChange={(e) => updateSectionData('terms', { subtitle: e.target.value })}
                        placeholder={t('Please read these terms carefully before using our services.')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_story_title">{t('Story Title')}</Label>
                      <Input
                        id="terms_story_title"
                        value={getSectionData('terms').story_title || 'Terms and Conditions'}
                        onChange={(e) => updateSectionData('terms', { story_title: e.target.value })}
                        placeholder={t('Terms and Conditions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="terms_content">{t('Terms of Service Content')}</Label>
                      <RichTextField
                        value={getSectionData('terms').content || '<p>By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement.</p>'}
                        onChange={(value) => updateSectionData('terms', { content: value })}
                        placeholder={t('Write your terms of service content here...')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Terms Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Terms Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add sections with colored borders and bullet points')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {((getSectionData('terms').sections && getSectionData('terms').sections.length > 0) ? getSectionData('terms').sections : [
                      { title: 'Acceptance of Terms', content: 'By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.', color: 'blue', items: [] },
                      { title: 'Service Description', content: 'vCard provides digital business card creation and sharing services, including:', color: 'green', items: ['Custom business card design tools', 'QR code generation and management', 'Analytics and contact management', 'Integration with third-party services'] },
                      { title: 'User Responsibilities', content: 'You are responsible for:', color: 'purple', items: ['Maintaining the confidentiality of your account', 'All activities that occur under your account', 'Ensuring your content complies with applicable laws', 'Respecting intellectual property rights'] },
                      { title: 'Limitation of Liability', content: 'vCard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.', color: 'red', items: [] }
                    ]).map((section: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{t('Section')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentSections = getSectionData('terms').sections || [];
                              const newSections = currentSections.filter((_: any, i: number) => i !== index);
                              updateSectionData('terms', { sections: newSections });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-3">
                            <Label>{t('Section Title')}</Label>
                            <Input
                              value={section?.title || ''}
                              onChange={(e) => {
                                const currentSections = getSectionData('terms').sections || [
                                  { title: 'Acceptance of Terms', content: 'By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.', color: 'blue', items: [] },
                                  { title: 'Service Description', content: 'vCard provides digital business card creation and sharing services, including:', color: 'green', items: ['Custom business card design tools', 'QR code generation and management', 'Analytics and contact management', 'Integration with third-party services'] },
                                  { title: 'User Responsibilities', content: 'You are responsible for:', color: 'purple', items: ['Maintaining the confidentiality of your account', 'All activities that occur under your account', 'Ensuring your content complies with applicable laws', 'Respecting intellectual property rights'] },
                                  { title: 'Limitation of Liability', content: 'vCard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.', color: 'red', items: [] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], title: e.target.value };
                                updateSectionData('terms', { sections: newSections });
                              }}
                              placeholder={t('Section Title')}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>{t('Color')}</Label>
                            <Select
                              value={section?.color || 'blue'}
                              onValueChange={(value) => {
                                const currentSections = getSectionData('terms').sections || [
                                  { title: 'Acceptance of Terms', content: 'By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.', color: 'blue', items: [] },
                                  { title: 'Service Description', content: 'vCard provides digital business card creation and sharing services, including:', color: 'green', items: ['Custom business card design tools', 'QR code generation and management', 'Analytics and contact management', 'Integration with third-party services'] },
                                  { title: 'User Responsibilities', content: 'You are responsible for:', color: 'purple', items: ['Maintaining the confidentiality of your account', 'All activities that occur under your account', 'Ensuring your content complies with applicable laws', 'Respecting intellectual property rights'] },
                                  { title: 'Limitation of Liability', content: 'vCard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.', color: 'red', items: [] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], color: value };
                                updateSectionData('terms', { sections: newSections });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="indigo">Indigo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          <Label>{t('Section Content')}</Label>
                          <Textarea
                            value={section?.content || ''}
                            onChange={(e) => {
                              const currentSections = getSectionData('terms').sections || [
                                { title: 'Acceptance of Terms', content: 'By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.', color: 'blue', items: [] },
                                { title: 'Service Description', content: 'vCard provides digital business card creation and sharing services, including:', color: 'green', items: ['Custom business card design tools', 'QR code generation and management', 'Analytics and contact management', 'Integration with third-party services'] },
                                { title: 'User Responsibilities', content: 'You are responsible for:', color: 'purple', items: ['Maintaining the confidentiality of your account', 'All activities that occur under your account', 'Ensuring your content complies with applicable laws', 'Respecting intellectual property rights'] },
                                { title: 'Limitation of Liability', content: 'vCard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.', color: 'red', items: [] }
                              ];
                              const newSections = [...currentSections];
                              newSections[index] = { ...newSections[index], content: e.target.value };
                              updateSectionData('terms', { sections: newSections });
                            }}
                            placeholder={t('Section content...')}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>{t('Bullet Points')} ({t('One per line')})</Label>
                          <Textarea
                            value={(section?.items || []).join('\n')}
                            onChange={(e) => {
                              const currentSections = getSectionData('terms').sections || [
                                { title: 'Acceptance of Terms', content: 'By accessing and using vCard, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.', color: 'blue', items: [] },
                                { title: 'Service Description', content: 'vCard provides digital business card creation and sharing services, including:', color: 'green', items: ['Custom business card design tools', 'QR code generation and management', 'Analytics and contact management', 'Integration with third-party services'] },
                                { title: 'User Responsibilities', content: 'You are responsible for:', color: 'purple', items: ['Maintaining the confidentiality of your account', 'All activities that occur under your account', 'Ensuring your content complies with applicable laws', 'Respecting intellectual property rights'] },
                                { title: 'Limitation of Liability', content: 'vCard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.', color: 'red', items: [] }
                              ];
                              const newSections = [...currentSections];
                              const items = e.target.value.split('\n').filter(item => item.trim());
                              newSections[index] = { ...newSections[index], items };
                              updateSectionData('terms', { sections: newSections });
                            }}
                            placeholder={t('Enter bullet points, one per line...')}
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newSections = [...(getSectionData('terms').sections || []), { title: '', content: '', color: 'blue', items: [] }];
                        updateSectionData('terms', { sections: newSections });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Section')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* FAQ Page Section */}
            {activeSection === 'faq-page' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your FAQ page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_title">{t('Page Title')}</Label>
                      <Input
                        id="faq_page_title"
                        value={getSectionData('faq-page').title || 'Frequently Asked Questions'}
                        onChange={(e) => updateSectionData('faq-page', { title: e.target.value })}
                        placeholder={t('Frequently Asked Questions')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="faq_page_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="faq_page_subtitle"
                        value={getSectionData('faq-page').subtitle || 'Find quick answers to the most common questions'}
                        onChange={(e) => updateSectionData('faq-page', { subtitle: e.target.value })}
                        placeholder={t('Find quick answers to the most common questions')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* FAQ Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('FAQ Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add FAQ sections with questions and answers')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(getSectionData('faq-page').sections || [
                      { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                      { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                      { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                    ]).map((section: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{t('Section')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentSections = getSectionData('faq-page').sections || [];
                              const newSections = currentSections.filter((_: any, i: number) => i !== index);
                              updateSectionData('faq-page', { sections: newSections });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <Label>{t('Section Title')}</Label>
                            <Input
                              value={section?.title || ''}
                              onChange={(e) => {
                                const currentSections = getSectionData('faq-page').sections || [
                                  { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                  { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                  { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], title: e.target.value };
                                updateSectionData('faq-page', { sections: newSections });
                              }}
                              placeholder={t('Section Title')}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>{t('Icon Color')}</Label>
                            <Select
                              value={section?.icon_color || 'blue'}
                              onValueChange={(value) => {
                                const currentSections = getSectionData('faq-page').sections || [
                                  { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                  { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                  { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], icon_color: value };
                                updateSectionData('faq-page', { sections: newSections });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="indigo">Indigo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label>{t('FAQs')}</Label>
                          {(section?.faqs || []).map((faq: any, faqIndex: number) => (
                            <div key={faqIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h5 className="font-medium text-gray-900">{t('FAQ')} {faqIndex + 1}</h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                  onClick={() => {
                                    const currentSections = getSectionData('faq-page').sections || [
                                      { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                      { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                      { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                    ];
                                    const newSections = [...currentSections];
                                    const newFaqs = ((newSections[index] && newSections[index].faqs) || []).filter((_: any, i: number) => i !== faqIndex);
                                    newSections[index] = { ...newSections[index], faqs: newFaqs };
                                    updateSectionData('faq-page', { sections: newSections });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <Label>{t('Question')}</Label>
                                  <Input
                                    value={faq.question || ''}
                                    onChange={(e) => {
                                      const currentSections = getSectionData('faq-page').sections || [
                                        { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                        { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                        { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                      ];
                                      const newSections = [...currentSections];
                                      const newFaqs = [...((newSections[index] && newSections[index].faqs) || [])];
                                      newFaqs[faqIndex] = { ...newFaqs[faqIndex], question: e.target.value };
                                      newSections[index] = { ...newSections[index], faqs: newFaqs };
                                      updateSectionData('faq-page', { sections: newSections });
                                    }}
                                    placeholder={t('Enter question...')}
                                  />
                                </div>
                                <div>
                                  <Label>{t('Answer')}</Label>
                                  <Textarea
                                    value={faq.answer || ''}
                                    onChange={(e) => {
                                      const currentSections = getSectionData('faq-page').sections || [
                                        { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                        { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                        { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                                      ];
                                      const newSections = [...currentSections];
                                      const newFaqs = [...((newSections[index] && newSections[index].faqs) || [])];
                                      newFaqs[faqIndex] = { ...newFaqs[faqIndex], answer: e.target.value };
                                      newSections[index] = { ...newSections[index], faqs: newFaqs };
                                      updateSectionData('faq-page', { sections: newSections });
                                    }}
                                    placeholder={t('Enter answer...')}
                                    rows={3}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-2"
                            style={{ color: brandColor, borderColor: brandColor }}
                            onClick={() => {
                              const currentSections = getSectionData('faq-page').sections || [
                                { title: 'Getting Started', icon_color: 'blue', faqs: [{ question: 'What is vCard?', answer: 'vCard is a comprehensive digital business card platform.' }] },
                                { title: 'Features & Plans', icon_color: 'purple', faqs: [{ question: 'Can I use my own domain?', answer: 'Yes! Premium plans include custom domain support.' }] },
                                { title: 'Analytics & Support', icon_color: 'green', faqs: [{ question: 'How do I track performance?', answer: 'Our analytics dashboard shows detailed insights.' }] }
                              ];
                              const newSections = [...currentSections];
                              const newFaqs = [...((newSections[index] && newSections[index].faqs) || []), { question: '', answer: '' }];
                              newSections[index] = { ...newSections[index], faqs: newFaqs };
                              updateSectionData('faq-page', { sections: newSections });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('Add FAQ')}
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newSections = [...(getSectionData('faq-page').sections || []), { title: '', icon_color: 'blue', faqs: [] }];
                        updateSectionData('faq-page', { sections: newSections });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Section')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Refund Policy Section */}
            {activeSection === 'refund' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Refund Policy Page')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize your Refund Policy page content')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="refund_title">{t('Page Title')}</Label>
                      <Input
                        id="refund_title"
                        value={getSectionData('refund').title || 'Refund Policy'}
                        onChange={(e) => updateSectionData('refund', { title: e.target.value })}
                        placeholder={t('Refund Policy')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_subtitle">{t('Page Subtitle')}</Label>
                      <Input
                        id="refund_subtitle"
                        value={getSectionData('refund').subtitle || 'We stand behind our service with a satisfaction guarantee.'}
                        onChange={(e) => updateSectionData('refund', { subtitle: e.target.value })}
                        placeholder={t('We stand behind our service with a satisfaction guarantee.')}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Refund Sections */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Refund Sections')}</h3>
                      <p className="text-sm text-gray-500">{t('Add sections with colored borders and bullet points')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(getSectionData('refund').sections || [
                      { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                      { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                      { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                    ]).map((section: any, index: number) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">{t('Section')} {index + 1}</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => {
                              const currentSections = getSectionData('refund').sections || [
                                { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                                { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                                { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                              ];
                              const newSections = currentSections.filter((_: any, i: number) => i !== index);
                              updateSectionData('refund', { sections: newSections });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-3">
                            <Label>{t('Section Title')}</Label>
                            <Input
                              value={section?.title || ''}
                              onChange={(e) => {
                                const currentSections = getSectionData('refund').sections || [
                                  { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                                  { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                                  { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], title: e.target.value };
                                updateSectionData('refund', { sections: newSections });
                              }}
                              placeholder={t('Section Title')}
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>{t('Color')}</Label>
                            <Select
                              value={section?.color || 'blue'}
                              onValueChange={(value) => {
                                const currentSections = getSectionData('refund').sections || [
                                  { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                                  { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                                  { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                                ];
                                const newSections = [...currentSections];
                                newSections[index] = { ...newSections[index], color: value };
                                updateSectionData('refund', { sections: newSections });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="indigo">Indigo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-3 mb-4">
                          <Label>{t('Section Content')}</Label>
                          <Textarea
                            value={section?.content || ''}
                            onChange={(e) => {
                              const currentSections = getSectionData('refund').sections || [
                                { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                                { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                                { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                              ];
                              const newSections = [...currentSections];
                              newSections[index] = { ...newSections[index], content: e.target.value };
                              updateSectionData('refund', { sections: newSections });
                            }}
                            placeholder={t('Section content...')}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label>{t('Bullet Points')} ({t('One per line')})</Label>
                          <Textarea
                            value={(section?.items || []).join('\n')}
                            onChange={(e) => {
                              const currentSections = getSectionData('refund').sections || [
                                { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                                { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                                { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                              ];
                              const newSections = [...currentSections];
                              const items = e.target.value.split('\n').filter(item => item.trim());
                              newSections[index] = { ...newSections[index], items };
                              updateSectionData('refund', { sections: newSections });
                            }}
                            placeholder={t('Enter bullet points, one per line...')}
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-2"
                      style={{ color: brandColor, borderColor: brandColor }}
                      onClick={() => {
                        const newSections = [...(getSectionData('refund').sections || [
                          { title: 'Eligible Refunds', content: 'Refunds are available for:', color: 'blue', items: ['Monthly and annual subscription plans', 'One-time premium features'] },
                          { title: 'Refund Process', content: 'To request a refund:', color: 'purple', items: ['Contact our support team within 30 days', 'Provide your account details'] },
                          { title: 'Non-Refundable Items', content: 'The following items are non-refundable:', color: 'green', items: ['Custom development work', 'Domain registration fees'] }
                        ]), { title: '', content: '', color: 'blue', items: [] }];
                        updateSectionData('refund', { sections: newSections });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('Add Section')}
                    </Button>
                  </div>
                </div>
                
                {/* Contact Support Section */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Contact Support Section')}</h3>
                      <p className="text-sm text-gray-500">{t('Customize the contact support section')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="refund_cta_text">{t('CTA Text')}</Label>
                      <Input
                        id="refund_cta_text"
                        value={getSectionData('refund').cta_text || 'Questions?'}
                        onChange={(e) => updateSectionData('refund', { cta_text: e.target.value })}
                        placeholder={t('Questions?')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_cta_description">{t('CTA Description')}</Label>
                      <Input
                        id="refund_cta_description"
                        value={getSectionData('refund').cta_description || 'If you have any questions about our refund policy, please contact our support team.'}
                        onChange={(e) => updateSectionData('refund', { cta_description: e.target.value })}
                        placeholder={t('If you have any questions about our refund policy, please contact our support team.')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="refund_button_text">{t('Button Text')}</Label>
                      <Input
                        id="refund_button_text"
                        value={getSectionData('refund').button_text || 'Contact Support'}
                        onChange={(e) => updateSectionData('refund', { button_text: e.target.value })}
                        placeholder={t('Contact Support')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other Pages Section */}
            {(data.config_sections?.custom_pages || []).some((p: { key: string; name: string }) => p.key === activeSection) && (
              <div key={activeSection} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {t('Edit')} {activeSection === 'about-page' ? t('About Us') : activeSection === 'privacy' ? t('Privacy Policy') : activeSection === 'terms' ? t('Terms of Service') : activeSection === 'refund' ? t('Refund Policy') : activeSection === 'faq-page' ? t('FAQ Page') : (data.config_sections?.custom_pages || []).find((p: { key: string; name: string }) => p.key === activeSection)?.name || activeSection}
                        </h3>
                        <p className="text-sm text-gray-500">{t('Update page content')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">{t('Active')}</Label>
                      <Switch
                        checked={getSectionData(activeSection).active !== false}
                        onCheckedChange={(checked) => updateSectionData(activeSection, { active: checked })}
                      />
                      {(data.config_sections?.custom_pages || []).some((p: { key: string; name: string }) => p.key === activeSection) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ml-2"
                          onClick={() => {
                            setPageToDelete(activeSection);
                            setShowDeletePageDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor={`${activeSection}_title`}>{t('Page Title')}</Label>
                      <Input
                        id={`${activeSection}_title`}
                        value={getSectionData(activeSection).title || ''}
                        onChange={(e) => updateSectionData(activeSection, { title: e.target.value })}
                        placeholder={t('Enter page title')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor={`${activeSection}_subtitle`}>{t('Page Subtitle')}</Label>
                      <Input
                        id={`${activeSection}_subtitle`}
                        value={getSectionData(activeSection).subtitle || ''}
                        onChange={(e) => updateSectionData(activeSection, { subtitle: e.target.value })}
                        placeholder={t('Enter page subtitle')}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor={`${activeSection}_content`}>{t('Page Content')}</Label>
                      <RichTextField
                        id={`${activeSection}_content`}
                        value={getSectionData(activeSection).content || ''}
                        onChange={(value) => updateSectionData(activeSection, { content: value })}
                        placeholder={t('Enter page content')}
                        rows={10}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SettingsSection>
      
      {/* Add Page Dialog */}
      <Dialog open={showAddPageDialog} onOpenChange={setShowAddPageDialog} modal={!isChatGptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Add Custom Page')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="new_page_name">{t('Page Name')}</Label>
              <Input
                id="new_page_name"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder={t('About Us')}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="new_page_slug">{t('Page Slug')}</Label>
              <Input
                id="new_page_slug"
                value={newPageName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')}
                readOnly
                placeholder={t('about-us')}
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">{t('Auto-generated from page name')}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddPageDialog(false);
              setNewPageName('');
            }}>
              {t('Cancel')}
            </Button>
            <Button 
              onClick={() => {
                if (newPageName.trim()) {
                  const slug = newPageName.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
                  const newPage = {
                    key: `custom-${Date.now()}`,
                    name: newPageName.trim(),
                    slug: slug,
                    title: newPageName.trim(),
                    description: '',
                    content: '',
                    active: true
                  };
                  const newPages = [...(data.config_sections?.custom_pages || []), newPage];
                  setData('config_sections', {
                    ...data.config_sections,
                    custom_pages: newPages
                  });
                  setShowAddPageDialog(false);
                  setNewPageName('');
                }
              }}
              style={{ backgroundColor: brandColor, color: 'white' }}
            >
              {t('Add Page')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Page Dialog */}
      <Dialog open={showDeletePageDialog} onOpenChange={setShowDeletePageDialog} modal={!isChatGptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete Page')}</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">{t('Are you sure you want to delete this page? This action cannot be undone.')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDeletePageDialog(false);
              setPageToDelete('');
            }}>
              {t('Cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                const newPages = (data.config_sections?.custom_pages || []).filter(page => page.key !== pageToDelete);
                setData('config_sections', {
                  ...data.config_sections,
                  custom_pages: newPages
                });
                setShowDeletePageDialog(false);
                setPageToDelete('');
              }}
            >
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </PageTemplate>
  );
}