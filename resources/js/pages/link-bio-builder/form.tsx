import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import DomainConfig from '@/components/DomainConfig';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import MediaPicker from '@/components/MediaPicker';
import BioLinkPreview from './components/BioLinkPreview';
import SEOSection from './form-seo-section';
import AnalyticsSection from './form-analytics-section';
import SocialSection from './form-social-section';
import BackgroundSection from './form-background-section';
import ThemeSelector from './form-theme-selector';
import { getTheme } from './themes';
import { getDefaultThemeImageUrl, isUserUploadedImage } from '../../utils/themeImageResolver';
import ProfileSection from './form-profile-section';

import axios from 'axios';
import './theme-fonts.css'; // Import theme fonts
import { bioLinkTypes } from '@/pages/link-bio-builder/themes';


interface BioLink {
  id: number;
  name: string;
  slug: string;
  link_type: string;
  config: any;
  custom_domain?: string;
  url_prefix?: string;
  password?: string;
  password_enabled?: boolean;
}

interface Props {
  bioLink?: BioLink;
  userPlan?: {
    themes?: string[];
    enable_custdomain?: string;
    enable_custsubdomain?: string;
  };
  planFeatures?: {
    business_template_sections?: string[];
    [key: string]: any;
  };
  userRole?: string;
}

export default function BioLinkForm({ bioLink, userPlan, planFeatures, userRole }: Props) {
  const { t } = useTranslation();
  const isEdit = !!bioLink;
  const [linkType, setLinkType] = React.useState(bioLink?.link_type || 'personal');
  const [slugStatus, setSlugStatus] = React.useState({ available: true, checking: false });
  
  // Check if user is superadmin (no restrictions)
  const isSuperAdmin = userRole === 'superadmin';
  
  // Get allowed bio link types based on plan
  const allowedBioLinkTypes = React.useMemo(() => {
    if (isSuperAdmin) {
      return bioLinkTypes;
    }
    
    if (!userPlan) {
      return bioLinkTypes;
    }
    
    if (!userPlan.bio_links_themes) {
      return bioLinkTypes;
    }
    
    if (!Array.isArray(userPlan.bio_links_themes)) {
      return bioLinkTypes;
    }
    
    if (userPlan.bio_links_themes.length === 0) {
      return bioLinkTypes;
    }
    
    const filtered = bioLinkTypes.filter(option => {
      const included = userPlan.bio_links_themes.includes(option.value);
      return included;
    });
    
    return filtered;
  }, [userPlan, isSuperAdmin]);
  
  // Check feature permissions
  const canUseCustomDomain = isSuperAdmin || (planFeatures?.custom_domain === true);
  const canUseSubdomain = isSuperAdmin || (planFeatures?.custom_subdomain === true);
  const canUsePasswordProtection = isSuperAdmin || (planFeatures?.password_protection === true);
  // Get theme based on link type
  const theme = getTheme(linkType);

  const fontOptions = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' }
  ];

  const { data, setData, post, put, processing, errors } = useForm({
    name: bioLink?.name || 'My Bio Link',
    slug: bioLink?.slug || '',
    link_type: linkType,
    custom_domain: bioLink?.custom_domain || '',
    url_prefix: bioLink?.url_prefix || 'bio',
    password: '',
    password_enabled: bioLink?.password_enabled || false,
    domain_type: bioLink?.custom_domain ? 'domain' : 'slug',
    config: bioLink?.config || {
      theme: linkType,
      preset: 0,
      background: {
        type: 'image',
        color: theme.colorPresets[0].background.color,
        gradient: theme.colorPresets[0].background.gradient,
        image: getDefaultThemeImageUrl(linkType, 0)
      },
      buttonColor: theme.colorPresets[0].buttonColor,
      buttonTextColor: theme.colorPresets[0].buttonTextColor,
      textColor: theme.colorPresets[0].textColor,
      font: theme.font,
      header: bioLink?.config?.header || (() => {
        const header: any = { profile_image: '' };
        theme.profileFields?.forEach(field => {
          if (field.defaultValue) {
            header[field.name] = field.defaultValue;
          }
        });
        return header;
      })(),
      links: [
        { text: 'My Website', url: 'https://example.com', description: 'Check out my website', icon: '' },
        { text: 'Instagram', url: 'https://instagram.com', description: 'Follow me on Instagram', icon: '' }
      ],
      social: {
        items: [
          { platform: 'facebook', url: '', icon: 'facebook' },
          { platform: 'x', url: '', icon: 'x' },
          { platform: 'instagram', url: '', icon: 'instagram' }
        ],
        display: true
      },
      copyright: {
        enabled: true,
        text: `© ${new Date().getFullYear()} ${linkType === 'business' ? 'YourBrand' : 'YourName'}. All rights reserved.`
      },
      seo: {
        title: '',
        description: '',
        keywords: '',
        og_image: ''
      },
      analytics: {
        google_analytics: '',
        facebook_pixel: '',
        custom_code: ''
      }
    }
  });
  
  // Initialize form with default values for new bio links
  React.useEffect(() => {
    if (!isEdit && theme.profileFields) {
      const updatedHeader = { ...data.config.header };
      let hasUpdates = false;
      
      theme.profileFields.forEach(field => {
        if (field.defaultValue && !updatedHeader[field.name]) {
          updatedHeader[field.name] = field.defaultValue;
          hasUpdates = true;
        }
      });
      
      if (hasUpdates) {
        setData('config', {
          ...data.config,
          header: updatedHeader
        });
      }
    }
  }, [linkType, isEdit, theme]);

  // Display validation errors as toast messages
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
      });
    }
  }, [errors]);

  const generateSlugFromName = async (name: string) => {
    if (!name) return;
    try {
      const response = await axios.post(route('bio-link.generate-slug'), { 
        name,
        bio_link_id: bioLink?.id,
        url_prefix: data.url_prefix || 'bio'
      });
      setData('slug', response.data.slug);
      checkSlugAvailability(response.data.slug);
    } catch (error) {
      console.error('Error generating slug:', error);
    }
  };

  const checkSlugAvailability = async (slug: string, urlPrefix?: string) => {
    if (!slug) {
      setSlugStatus({ available: true, checking: false });
      return;
    }
    
    setSlugStatus({ available: true, checking: true });
    try {
      const response = await axios.post(route('bio-link.check-slug'), { 
        slug, 
        bio_link_id: bioLink?.id,
        url_prefix: urlPrefix || data.url_prefix 
      });
      setSlugStatus({ available: response.data.available, checking: false });
    } catch (error) {
      setSlugStatus({ available: false, checking: false });
    }
  };

  const handleNameChange = (name: string) => {
    setData('name', name);
    if (!isEdit && !data.slug) {
      generateSlugFromName(name);
    }
  };

  const handleSlugChange = (slug: string) => {
    setData('slug', slug);
    checkSlugAvailability(slug);
  };

  const handlePrefixChange = (prefix: string) => {
    if (data.slug) {
      checkSlugAvailability(data.slug, prefix);
    }
  };

  const handleLinkTypeChange = (newType: string) => {
    setLinkType(newType);
    const theme = getTheme(newType);
    const preset = theme.colorPresets[theme.defaultPreset];
    const currentBackgroundImage = data.config.background?.image || '';
    
    // Check if current image is a user-uploaded image (not a default theme image)
    const isCustomImage = isUserUploadedImage(currentBackgroundImage);
    
    // Preserve user-uploaded image when changing themes, otherwise use default
    const backgroundImage = isCustomImage ? currentBackgroundImage : getDefaultThemeImageUrl(newType, theme.defaultPreset);
    
    setData({
      ...data,
      link_type: newType,
      config: {
        ...data.config,
        theme: newType,
        preset: theme.defaultPreset,
        background: {
          type: 'image',
          color: preset.background.color,
          gradient: preset.background.gradient,
          image: backgroundImage
        },
        buttonColor: preset.buttonColor,
        buttonTextColor: preset.buttonTextColor,
        textColor: preset.textColor,
        font: theme.font,
        header: {
          ...data.config.header,
          name: theme.profileFields?.find(f => f.name === 'name')?.defaultValue || data.config.header.name,
          tagline: theme.profileFields?.find(f => f.name === 'tagline')?.defaultValue || data.config.header.tagline,
          email: theme.profileFields?.find(f => f.name === 'email')?.defaultValue || data.config.header.email,
          phone: theme.profileFields?.find(f => f.name === 'phone')?.defaultValue || data.config.header.phone,
          description: theme.profileFields?.find(f => f.name === 'description')?.defaultValue || data.config.header.description
        }
      }
    });
  };
  
  const handlePresetChange = (presetIndex: number) => {
    const theme = getTheme(data.link_type);
    const preset = theme.colorPresets[presetIndex];
    const currentBackgroundType = data.config.background?.type || 'image';
    const currentBackgroundImage = data.config.background?.image || '';
    
    // Check if current image is a user-uploaded image (not a default theme image)
    const isCustomImage = isUserUploadedImage(currentBackgroundImage);
    
    let backgroundImage = '';
    if (currentBackgroundType === 'image') {
      // If user has uploaded a custom image, preserve it across all color variations
      if (isCustomImage) {
        backgroundImage = currentBackgroundImage;
      } else {
        // Otherwise, use the default theme image for this preset
        backgroundImage = getDefaultThemeImageUrl(data.link_type, presetIndex);
      }
    }
    
    setData({
      ...data,
      config: {
        ...data.config,
        preset: presetIndex,
        background: {
          type: currentBackgroundType,
          color: preset.background.color,
          gradient: preset.background.gradient,
          image: backgroundImage
        },
        buttonColor: preset.buttonColor,
        buttonTextColor: preset.buttonTextColor,
        textColor: preset.textColor
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!data.slug) {
      toast.error(t('Slug is required'));
      return;
    }
    
    if (isEdit) {
      put(route('bio-link.update', bioLink.id));
    } else {
      post(route('bio-link.store'));
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Bio Link'), href: route('link-bio-builder.index') },
    { title: isEdit ? t('Edit Bio Link') : t('Create New Bio Link') }
  ];

  const pageTitle = isEdit ? 'Edit Bio Link' : 'Create New Bio Link';
  const pageUrl = isEdit ? route('link-bio-builder.edit', bioLink.id) : route('link-bio-builder.create');

  return (
      <PageWrapper title={pageTitle} url={pageUrl} breadcrumbs={breadcrumbs}>
        <Head title={pageTitle} />
      
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6">
        <div className="flex items-center justify-between py-3 px-1">
          <div className="flex items-center space-x-2">
            {!slugStatus.available && data.slug && (
              <span className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">{t('Slug not available')}</span>
            )}
            {processing && (
              <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {isEdit ? t('Updating...') : t('Creating...')}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              className="px-4 h-9 flex items-center gap-1"
              onClick={() => {
                // Store the current form data in localStorage for the preview page to use
                localStorage.setItem('biolink_preview_data', JSON.stringify({
                  link_type: linkType,
                  name: data.name,
                  slug: data.slug || 'preview',
                  config: data.config
                }));
                
                // Open the preview in a new tab
                window.open(route('bio-link.preview'), '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {t("Preview")}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={processing || (!slugStatus.available && data.slug)} 
              className="px-6 h-9"
            >
              {processing ? (isEdit ? t('Updating...') : t('Creating...')) : (isEdit ? t('Update Bio Link') : t('Create Bio Link'))}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">1</span>{t("Bio Link Setup")}</h3>
            </div>
            <div className="p-3 space-y-3">
              {/* Link Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-1 block flex items-center justify-between">
                    <div className="flex items-center">
                      {t("Link Type")}
                      {(window as any).isDemo && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary text-white">
                          New
                        </span>
                      )}
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      {allowedBioLinkTypes.length} layouts
                    </span>
                  </Label>
                  <Select value={data.link_type} onValueChange={handleLinkTypeChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedBioLinkTypes.map((option, index) => (
                        <SelectItem key={option.value} value={option.value}>Theme {index + 1}: {option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isSuperAdmin && allowedBioLinkTypes.length < bioLinkTypes.length && (
                    <p className="text-xs text-amber-600 mt-1">
                      {t('Some themes are restricted by your plan. Upgrade to access all themes.')}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm mb-1 block">{t("Link Name")}</Label>
                  <Input
                    value={data.name}
                    onChange={(e) => isEdit ? setData('name', e.target.value) : handleNameChange(e.target.value)}
                    className="h-9 text-sm"
                    placeholder={t("Enter link name")}
                    required
                  />
                </div>
              </div>

              {/* Theme Settings */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-sm">{t("Color Theme")}</Label>
                  <div className="flex space-x-1">
                    {theme.colorPresets.slice(0, 5).map((preset, index) => (
                      <div 
                        key={index}
                        className="w-5 h-5 rounded-full cursor-pointer border hover:scale-110 transition-transform flex items-center justify-center"
                        style={{ 
                          background: preset.background.type === 'gradient' ? preset.background.gradient : preset.background.color,
                          boxShadow: data.config.preset === index ? '0 0 0 2px white, 0 0 0 4px ' + preset.buttonColor : 'none'
                        }}
                        onClick={() => handlePresetChange(index)}
                      >
                        {data.config.preset === index && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Custom Color Pickers */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div>
                    <Label className="text-sm mb-1 block">{t("Button Color")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config.buttonColor}
                        onChange={(e) => {
                          setData('config', {
                            ...data.config,
                            buttonColor: e.target.value
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config.buttonColor?.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("Button Text Color")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config.buttonTextColor}
                        onChange={(e) => {
                          setData('config', {
                            ...data.config,
                            buttonTextColor: e.target.value
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config.buttonTextColor?.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-1 block">{t("Text Color")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config.textColor}
                        onChange={(e) => {
                          setData('config', {
                            ...data.config,
                            textColor: e.target.value
                          });
                        }}
                        className="h-6 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-1 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config.textColor?.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Label className="text-sm mb-2 block">{t("Background Settings")}</Label>
                  <BackgroundSection 
                    background={data.config.background}
                    theme={data.link_type}
                    onUpdate={(field, value) => {
                      setData('config', {
                        ...data.config,
                        background: {
                          ...data.config.background,
                          [field]: value
                        }
                      });
                    }}
                  />
                </div>
              </div>
              
              {/* Font Family */}
              <div>
                <Label className="text-sm mb-1 block">{t("Font Family")}</Label>
                <Select 
                  value={data.config.font || 'Inter, sans-serif'} 
                  onValueChange={(value) => {
                    setData('config', {
                      ...data.config,
                      font: value
                    });
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <DomainConfig
            data={{
              slug: data.slug,
              custom_domain: data.custom_domain,
              url_prefix: data.url_prefix,
              password: data.password,
              password_enabled: data.password_enabled,
              domain_type: data.domain_type
            }}
            onUpdate={(field, value) => setData(field as any, value)}
            slugStatus={slugStatus}
            onSlugChange={handleSlugChange}
            onPrefixChange={handlePrefixChange}
            businessId={bioLink?.id}
            canUseCustomDomain={canUseCustomDomain}
            canUseSubdomain={canUseSubdomain}
            canUsePasswordProtection={canUsePasswordProtection}
            type="biolink"
          />

          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">3</span>{t("Profile Information")}</h3>
            </div>
            <div className="p-3 space-y-4">
              <ProfileSection 
                header={data.config.header}
                onUpdate={(field, value) => {
                  setData('config', {
                    ...data.config,
                    header: { ...data.config.header, [field]: value }
                  });
                }}
                profileFields={theme.profileFields || [
                  {
                    name: 'name',
                    label: t('Name'),
                    type: 'text',
                    placeholder: t('Enter your name'),
                    required: true,
                    section: t('Basic Information'),
                    cols: 1
                  },
                  {
                    name: 'tagline',
                    label: t('Tagline'),
                    type: 'text',
                    placeholder: t('Enter a short description'),
                    required: false,
                    section: t('Basic Information'),
                    cols: 1
                  },
                  {
                    name: 'profile_image',
                    label: t('Profile Picture'),
                    type: 'image',
                    placeholder: t('Select profile picture'),
                    required: false,
                    section: t('Basic Information'),
                    cols: 2
                  }
                ]}
              />
            </div>
          </Card>
          
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">4</span>{t("Links")}</h3>
            </div>
            <div className="p-3 space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">{t("Bio Links")}</Label>
              </div>
              
              <div className="space-y-3">
                {data.config.links.map((link, index) => (
                  <Card key={index} className="p-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Link #{index + 1}</span>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-7 w-7 p-0"
                          onClick={() => {
                            const links = [...data.config.links];
                            links.splice(index, 1);
                            setData('config', {
                              ...data.config,
                              links
                            });
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </Button>
                      </div>
                      
                      <div>
                        <Label className="text-xs mb-1 block">{t("Link Text")}</Label>
                        <Input
                          value={link.text}
                          onChange={(e) => {
                            const links = [...data.config.links];
                            links[index].text = e.target.value;
                            setData('config', {
                              ...data.config,
                              links
                            });
                          }}
                          className="h-8 text-sm"
                          placeholder={t("Enter link text")}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs mb-1 block">{t("URL")}</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const links = [...data.config.links];
                            links[index].url = e.target.value;
                            setData('config', {
                              ...data.config,
                              links
                            });
                          }}
                          className="h-8 text-sm"
                          placeholder={t("https://example.com")}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs mb-1 block">{t("Description")}</Label>
                        <Input
                          value={link.description}
                          onChange={(e) => {
                            const links = [...data.config.links];
                            links[index].description = e.target.value;
                            setData('config', {
                              ...data.config,
                              links
                            });
                          }}
                          className="h-8 text-sm"
                          placeholder={t("Enter description (optional)")}
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs mb-1 block">{t("Icon URL (optional)")}</Label>
                        <MediaPicker
                          value={link.icon}
                          onChange={(url) => {
                            const links = [...data.config.links];
                            links[index].icon = url;
                            setData('config', {
                              ...data.config,
                              links
                            });
                          }}
                          placeholder={t("Select icon")}
                          showPreview={true}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
                 <Button 
                  type="button" 
                  className="w-full"
                  onClick={() => {
                    const links = [...data.config.links];
                    links.push({ text: '', url: '', description: '', icon: '' });
                    setData('config', {
                      ...data.config,
                      links
                    });
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                  {t("Add Link")}
                </Button>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">5</span>{t("Social Media")}</h3>
            </div>
            <div className="p-3">
              <SocialSection 
                social={data.config.social} 
                onUpdate={(field, value) => {
                  setData('config', {
                    ...data.config,
                    social: {
                      ...data.config.social,
                      [field]: value
                    }
                  });
                }} 
              />
            </div>
          </Card>
          
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">6</span>{t("SEO Settings")}</h3>
            </div>
            <div className="p-3">
              <SEOSection 
                seo={data.config.seo} 
                onUpdate={(field, value) => {
                  setData('config', {
                    ...data.config,
                    seo: {
                      ...data.config.seo,
                      [field]: value
                    }
                  });
                }} 
              />
            </div>
          </Card>
          
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">7</span>{t("Copyright")}</h3>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">{t("Show Copyright")}</Label>
                <Switch
                  checked={data.config.copyright?.enabled !== false}
                  onCheckedChange={(checked) => {
                    setData('config', {
                      ...data.config,
                      copyright: {
                        ...data.config.copyright,
                        enabled: checked
                      }
                    });
                  }}
                />
              </div>
              
              {data.config.copyright?.enabled !== false && (
                <div>
                  <Label className="text-sm mb-1 block">{t("Copyright Text")}</Label>
                  <Input
                    value={data.config.copyright?.text || `© ${new Date().getFullYear()} All rights reserved.`}
                    onChange={(e) => {
                      setData('config', {
                        ...data.config,
                        copyright: {
                          ...data.config.copyright,
                          text: e.target.value
                        }
                      });
                    }}
                    className="h-9 text-sm"
                    placeholder={t("© 2025 All rights reserved.")}
                  />
                </div>
              )}
            </div>
          </Card>
          
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">8</span>{t("Analytics")}</h3>
            </div>
            <div className="p-3">
              <AnalyticsSection 
                analytics={data.config.analytics} 
                onUpdate={(field, value) => {
                  setData('config', {
                    ...data.config,
                    analytics: {
                      ...data.config.analytics,
                      [field]: value
                    }
                  });
                }} 
              />
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4 h-[calc(100vh-2rem)] overflow-hidden">
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium">{t("Live Preview")}</h3>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg overflow-hidden h-[calc(100%-3.5rem)]">
              <div className="flex justify-center h-full">
                <div className="w-full max-w-[400px] overflow-y-auto h-full shadow-lg rounded-lg" style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <BioLinkPreview data={data} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      </PageWrapper>
  );
}