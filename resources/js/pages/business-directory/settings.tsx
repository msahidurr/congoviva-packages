import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Eye, Settings as SettingsIcon, Type, ArrowUpDown, Info, GripVertical, Plus, Trash2, Building2, Palette, Image as ImageIcon, BadgeCheck, GalleryVerticalEnd, Share2, Link2, LayoutList } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { toast } from '@/components/custom-toast';
import { Toaster } from '@/components/ui/toaster';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';
import MediaPicker from '@/components/MediaPicker';
import { getImageDisplayUrl, convertUrlToRelativePath } from '@/utils/imageUrlHelper';

interface DirectorySettings {
  id?: number;
  title: string;
  description: string;
  config_sections: {
    theme: {
      primary_color: string;
      secondary_color: string;
      accent_color: string;
    };
    background_image?: string;
    use_background_image?: boolean;
    company?: {
      name: string;
      contact_email?: string;
      contact_phone?: string;
      contact_address?: string;
      description?: string;
    };
    hero?: {
      trust_badge: string;
      main_title: string;
      subtitle: string;
      features: Array<{
        icon: string;
        text: string;
      }>;
    };
    footer?: {
      description?: string;
      newsletter_title?: string;
      newsletter_subtitle?: string;
      links?: Record<string, Array<{ name: string; href: string }>>;
      social_links?: Array<{
        name: string;
        icon: string;
        href: string;
      }>;
      section_titles?: {
        product: string;
        company: string;
        support: string;
        legal: string;
      };
    };
    section_order?: string[];
    section_visibility?: Record<string, boolean>;
  };
}

interface PageProps {
  settings: DirectorySettings;
  flash?: {
    success?: string;
    error?: string;
  };
}

type ActiveSection = 'content' | 'hero' | 'footer' | 'order';

function DirectorySettingsCard({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        {header}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default function BusinessDirectorySettings() {
  const { t } = useTranslation();
  const { settings, flash, directoryGlobalSettings } = usePage<PageProps>().props;

  // Handle flash messages
  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);
  const { themeColor, customColor } = useBrand();
  const brandColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('content');
  const [directoryEnabled, setDirectoryEnabled] = useState(directoryGlobalSettings?.is_enabled === true);

  const handleDirectoryToggle = (enabled: boolean) => {
    setDirectoryEnabled(enabled);

    router.post(route('directory.toggle-global'), {
      is_enabled: enabled
    }, {
      preserveState: false,
      replace: true,
      onError: () => {
        setDirectoryEnabled(!enabled);
      }
    });
  };

  const { data, setData } = useForm<DirectorySettings>({
    title: settings.title || 'Business Directory',
    description: settings.description || '',
    config_sections: settings.config_sections || {
      theme: {
        primary_color: '#3b82f6',
        secondary_color: '#8b5cf6',
        accent_color: '#10b77f'
      },
      background_image: '',
      use_background_image: false,
      company: {
        name: settings.config_sections?.company?.name || '',
        description: settings.config_sections?.company?.description || ''
      },
      hero: {
        trust_badge: 'Trusted by 10,000+ Businesses',
        main_title: 'Discover Amazing Businesses',
        subtitle: 'Connect with professionals, explore services, and grow your network in our comprehensive business directory',
        features: [
          { icon: 'verified', text: 'Verified Businesses' },
          { icon: 'location', text: 'Local & Global' },
          { icon: 'contact', text: 'Instant Contact' }
        ]
      },
      footer: {
        description: 'Transforming professional networking with innovative digital business cards. Connect, share, and grow your network effortlessly.',
        newsletter_title: 'Stay Updated with Our Latest Features',
        newsletter_subtitle: 'Join our newsletter for product updates and networking tips',
        links: {
          product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'Templates', href: '#' },
            { name: 'Integrations', href: '#' }
          ],
          company: [
            { name: 'About Us', href: '#about' },
            { name: 'Careers', href: '#' },
            { name: 'Press', href: '#' },
            { name: 'Contact', href: route('custom-page.show', 'contact-us') }
          ],
          support: [
            { name: 'Help Center', href: '#' },
            { name: 'Documentation', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Status', href: '#' }
          ],
          legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'GDPR', href: '#' }
          ]
        },
        social_links: [
          { name: 'Facebook', icon: 'Facebook', href: '#' },
          { name: 'Twitter', icon: 'Twitter', href: '#' },
          { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
          { name: 'Instagram', icon: 'Instagram', href: '#' }
        ],
        section_titles: {
          product: 'Product',
          company: 'Company',
          support: 'Support',
          legal: 'Legal'
        }
      },
      section_order: ['hero', 'search', 'categories', 'filters', 'businesses'],
      section_visibility: {
        hero: true,
        search: true,
        categories: true,
        filters: true,
        businesses: true
      }
    }
  });





  const saveSettings = () => {
    setIsLoading(true);

    router.post(route('directory.settings.update'), data, {
      preserveScroll: true,
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: (errors) => {
        setIsLoading(false);
        const errorMessage = Object.values(errors).join(', ') || t('Failed to save directory settings');
        toast.error(errorMessage);
      }
    });
  };
  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Business Directory') },
    { title: t('Directory Settings') }
  ];

  const sections: Array<{ key: ActiveSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'content', label: t('Content'), icon: Type },
    { key: 'hero', label: t('Hero'), icon: SettingsIcon },
    { key: 'footer', label: t('Footer'), icon: Type },
    { key: 'order', label: t('Order'), icon: ArrowUpDown }
  ];

  const renderSectionHeader = (
    title: string,
    description: string,
    Icon: React.ComponentType<{ className?: string }>,
    wrapperClassName: string,
    iconClassName: string,
  ) => (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${wrapperClassName}`}>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <PageTemplate
      title={t("Directory Settings")}
      breadcrumbs={breadcrumbs}
      url="/directory/settings"
      action={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('Enable Business Directory')}</span>
            <Switch
              checked={directoryEnabled}
              onCheckedChange={handleDirectoryToggle}
              size="sm"
            />
          </div>
          <Link
            href={route('directory.index')}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            <Eye className="w-4 h-4" />
            {t("View Directory")}
          </Link>
          <Button onClick={saveSettings} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? t('Saving...') : t('Save Changes')}
          </Button>
        </div>
      }
    >
      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-6">
            <div className="space-y-1 mb-6">
              {sections.map(section => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeSection === section.key
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                  <section.icon className="h-5 w-5" />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>

            {/* Save Button in Sidebar */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={directoryEnabled}
                  onCheckedChange={handleDirectoryToggle}
                  size="sm"
                />
                <Label className="text-xs text-muted-foreground cursor-pointer" onClick={() => handleDirectoryToggle(!directoryEnabled)}>
                  {t('Enable Directory')}
                </Label>
              </div>
              <Button onClick={saveSettings} disabled={isLoading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? t('Saving...') : t('Save Changes')}
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeSection === 'content' && (
            <div className="space-y-8">
              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Basic Information'),
                  t('Configure main directory content'),
                  Type,
                  'bg-sky-100 dark:bg-sky-900/40',
                  'text-sky-600 dark:text-sky-400',
                )}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">{t('Directory Title')}</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder={t('Business Directory')}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">{t('Directory Description')}</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder={t('Discover amazing businesses and connect with professionals')}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </DirectorySettingsCard>

              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Company Information'),
                  t('Separate company information for business directory'),
                  Building2,
                  'bg-emerald-100 dark:bg-emerald-900/40',
                  'text-emerald-600 dark:text-emerald-400',
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name" className="text-sm font-medium">{t('Company Name')}</Label>
                    <Input
                      id="company_name"
                      value={data.config_sections?.company?.name || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        company: { ...data.config_sections?.company, name: e.target.value }
                      })}
                      placeholder={t('Directory Company Name')}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_email" className="text-sm font-medium">{t('Contact Email')}</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={data.config_sections?.company?.contact_email || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        company: { ...data.config_sections?.company, contact_email: e.target.value }
                      })}
                      placeholder={t('support@company.com')}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_phone" className="text-sm font-medium">{t('Contact Phone')}</Label>
                    <Input
                      id="company_phone"
                      value={data.config_sections?.company?.contact_phone || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        company: { ...data.config_sections?.company, contact_phone: e.target.value }
                      })}
                      placeholder={t('+1 (555) 123-4567')}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company_address" className="text-sm font-medium">{t('Contact Address')}</Label>
                    <Input
                      id="company_address"
                      value={data.config_sections?.company?.contact_address || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        company: { ...data.config_sections?.company, contact_address: e.target.value }
                      })}
                      placeholder={t('123 Business Ave, City, State')}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </DirectorySettingsCard>

              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Theme Colors'),
                  t('Customize the color scheme for your directory'),
                  Palette,
                  'bg-violet-100 dark:bg-violet-900/40',
                  'text-violet-600 dark:text-violet-400',
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary_color" className="text-sm font-medium">{t('Primary Color')}</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="primary_color"
                        type="color"
                        value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                        onChange={(e) => setData('config_sections', {
                          ...data.config_sections,
                          theme: { ...data.config_sections?.theme, primary_color: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.config_sections?.theme?.primary_color || '#3b82f6'}
                        onChange={(e) => setData('config_sections', {
                          ...data.config_sections,
                          theme: { ...data.config_sections?.theme, primary_color: e.target.value }
                        })}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary_color" className="text-sm font-medium">{t('Secondary Color')}</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                        onChange={(e) => setData('config_sections', {
                          ...data.config_sections,
                          theme: { ...data.config_sections?.theme, secondary_color: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.config_sections?.theme?.secondary_color || '#8b5cf6'}
                        onChange={(e) => setData('config_sections', {
                          ...data.config_sections,
                          theme: { ...data.config_sections?.theme, secondary_color: e.target.value }
                        })}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent_color" className="text-sm font-medium">{t('Accent Color')}</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="accent_color"
                        type="color"
                        value={data.config_sections?.theme?.accent_color || '#10b77f'}
                        onChange={(e) => setData('config_sections', {
                          ...data.config_sections,
                          theme: { ...data.config_sections?.theme, accent_color: e.target.value }
                        })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.config_sections?.theme?.accent_color || '#10b77f'}
                        onChange={(e) => setData('config_sections', {
                          ...data.config_sections,
                          theme: { ...data.config_sections?.theme, accent_color: e.target.value }
                        })}
                        placeholder="#10b77f"
                      />
                    </div>
                  </div>
                </div>
              </DirectorySettingsCard>

              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Background Options'),
                  t('Choose between solid colors or background image'),
                  ImageIcon,
                  'bg-amber-100 dark:bg-amber-900/40',
                  'text-amber-600 dark:text-amber-400',
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="use_background_image"
                      checked={data.config_sections?.use_background_image || false}
                      onCheckedChange={(checked) => setData('config_sections', {
                        ...data.config_sections,
                        use_background_image: checked
                      })}
                    />
                    <Label htmlFor="use_background_image" className="text-sm font-medium cursor-pointer">
                      {t('Use Background Image')}
                    </Label>
                  </div>

                  {data.config_sections?.use_background_image && (
                    <div className="">
                      <MediaPicker
                        label={t('Background Image')}
                        value={getImageDisplayUrl(data.config_sections?.background_image || '')}
                        onChange={(value) => setData('config_sections', {
                          ...data.config_sections,
                          background_image: convertUrlToRelativePath(value)
                        })}
                        placeholder={t('Select background image...')}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t('Recommended size: 1920x1080px or larger. The image will be used as the directory background.')}
                      </p>
                    </div>
                  )}
                </div>
              </DirectorySettingsCard>
            </div>
          )}

          {activeSection === 'hero' && (
            <div className="space-y-8">
              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Hero Section Content'),
                  t('Configure the main hero section content'),
                  BadgeCheck,
                  'bg-rose-100 dark:bg-rose-900/40',
                  'text-rose-600 dark:text-rose-400',
                )}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trust_badge" className="text-sm font-medium">{t('Trust Badge Text')}</Label>
                    <Input
                      id="trust_badge"
                      value={data.config_sections.hero?.trust_badge || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        hero: { ...data.config_sections.hero, trust_badge: e.target.value }
                      })}
                      placeholder={t('Trusted by 10,000+ Businesses')}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="main_title" className="text-sm font-medium">{t('Main Title')}</Label>
                    <Input
                      id="main_title"
                      value={data.config_sections.hero?.main_title || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        hero: { ...data.config_sections.hero, main_title: e.target.value }
                      })}
                      placeholder={t('Discover Amazing Businesses')}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle" className="text-sm font-medium">{t('Subtitle')}</Label>
                    <Textarea
                      id="subtitle"
                      value={data.config_sections.hero?.subtitle || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        hero: { ...data.config_sections.hero, subtitle: e.target.value }
                      })}
                      placeholder={t('Connect with professionals, explore services, and grow your network')}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </DirectorySettingsCard>

              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Feature Highlights'),
                  t('Add feature highlights to display on the hero section'),
                  GalleryVerticalEnd,
                  'bg-cyan-100 dark:bg-cyan-900/40',
                  'text-cyan-600 dark:text-cyan-400',
                )}
              >
                <div className="space-y-3">
                  {(data.config_sections.hero?.features || []).map((feature, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor={`feature_${index}_icon`}>{t('Icon')}</Label>
                          <Select
                            value={feature.icon}
                            onValueChange={(value) => {
                              const newFeatures = [...(data.config_sections.hero?.features || [])];
                              newFeatures[index] = { ...feature, icon: value };
                              setData('config_sections', {
                                ...data.config_sections,
                                hero: { ...data.config_sections.hero, features: newFeatures }
                              });
                            }}
                          >
                            <SelectTrigger id={`feature_${index}_icon`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="verified">{t('Verified')}</SelectItem>
                              <SelectItem value="location">{t('Location')}</SelectItem>
                              <SelectItem value="contact">{t('Contact')}</SelectItem>
                              <SelectItem value="star">{t('Star')}</SelectItem>
                              <SelectItem value="shield">{t('Shield')}</SelectItem>
                              <SelectItem value="globe">{t('Globe')}</SelectItem>
                              <SelectItem value="users">{t('Users')}</SelectItem>
                              <SelectItem value="zap">{t('Zap')}</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor={`feature_${index}_text`}>{t('Text')}</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`feature_${index}_text`}
                            value={feature.text}
                            onChange={(e) => {
                              const newFeatures = [...(data.config_sections.hero?.features || [])];
                              newFeatures[index] = { ...feature, text: e.target.value };
                              setData('config_sections', {
                                ...data.config_sections,
                                hero: { ...data.config_sections.hero, features: newFeatures }
                              });
                            }}
                            placeholder={t('Feature text')}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:hover:bg-red-950/40"
                            onClick={() => {
                              const newFeatures = (data.config_sections.hero?.features || []).filter((_, i) => i !== index);
                              setData('config_sections', {
                                ...data.config_sections,
                                hero: { ...data.config_sections.hero, features: newFeatures }
                              });
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
                      const newFeatures = [...(data.config_sections.hero?.features || []), { icon: 'verified', text: '' }];
                      setData('config_sections', {
                        ...data.config_sections,
                        hero: { ...data.config_sections.hero, features: newFeatures }
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Feature')}
                  </Button>
                </div>
              </DirectorySettingsCard>
            </div>
          )}

          {activeSection === 'footer' && (
            <div className="space-y-8">
              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Footer Content'),
                  t('Footer description and newsletter content'),
                  Type,
                  'bg-fuchsia-100 dark:bg-fuchsia-900/40',
                  'text-fuchsia-600 dark:text-fuchsia-400',
                )}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="footer_description" className="text-sm font-medium">{t('Company Description')}</Label>
                    <Textarea
                      id="footer_description"
                      value={data.config_sections?.footer?.description || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        footer: { ...data.config_sections?.footer, description: e.target.value }
                      })}
                      placeholder={t('Transforming professional networking...')}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="footer_newsletter_title" className="text-sm font-medium">{t('Newsletter Title')}</Label>
                    <Input
                      id="footer_newsletter_title"
                      value={data.config_sections?.footer?.newsletter_title || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        footer: { ...data.config_sections?.footer, newsletter_title: e.target.value }
                      })}
                      placeholder={t('Stay Updated with Our Latest Features')}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="footer_newsletter_subtitle" className="text-sm font-medium">{t('Newsletter Subtitle')}</Label>
                    <Input
                      id="footer_newsletter_subtitle"
                      value={data.config_sections?.footer?.newsletter_subtitle || ''}
                      onChange={(e) => setData('config_sections', {
                        ...data.config_sections,
                        footer: { ...data.config_sections?.footer, newsletter_subtitle: e.target.value }
                      })}
                      placeholder={t('Join our newsletter for product updates...')}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </DirectorySettingsCard>

              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Social Links'),
                  t('Social media links and profiles'),
                  Share2,
                  'bg-blue-100 dark:bg-blue-900/40',
                  'text-blue-600 dark:text-blue-400',
                )}
              >
                <div className="space-y-4">
                  {(data.config_sections?.footer?.social_links || []).map((social, index) => (
                    <div key={index} className="rounded-xl border bg-muted/30 p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-semibold text-foreground">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                            {index + 1}
                          </span>
                          {t('Social Link')} {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:hover:bg-red-950/40"
                          onClick={() => {
                            const newSocials = (data.config_sections?.footer?.social_links || []).filter((_, i) => i !== index);
                            setData('config_sections', {
                              ...data.config_sections,
                              footer: { ...data.config_sections?.footer, social_links: newSocials }
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-3">
                          <Label htmlFor={`social_${index}_name`}>{t('Name')}</Label>
                          <Input
                            id={`social_${index}_name`}
                            value={social.name || ''}
                            onChange={(e) => {
                              const newSocials = [...(data.config_sections?.footer?.social_links || [])];
                              newSocials[index] = { ...newSocials[index], name: e.target.value };
                              setData('config_sections', {
                                ...data.config_sections,
                                footer: { ...data.config_sections?.footer, social_links: newSocials }
                              });
                            }}
                            placeholder={t('Facebook')}
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor={`social_${index}_icon`}>{t('Icon')}</Label>
                          <Select
                            value={social.icon || 'Facebook'}
                            onValueChange={(value) => {
                              const newSocials = [...(data.config_sections?.footer?.social_links || [])];
                              newSocials[index] = { ...newSocials[index], icon: value };
                              setData('config_sections', {
                                ...data.config_sections,
                                footer: { ...data.config_sections?.footer, social_links: newSocials }
                              });
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
                          <Label htmlFor={`social_${index}_href`}>{t('URL')}</Label>
                          <Input
                            id={`social_${index}_href`}
                            value={social.href || ''}
                            onChange={(e) => {
                              const newSocials = [...(data.config_sections?.footer?.social_links || [])];
                              newSocials[index] = { ...newSocials[index], href: e.target.value };
                              setData('config_sections', {
                                ...data.config_sections,
                                footer: { ...data.config_sections?.footer, social_links: newSocials }
                              });
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
                      const newSocials = [...(data.config_sections?.footer?.social_links || []), { name: '', icon: 'Facebook', href: '' }];
                      setData('config_sections', {
                        ...data.config_sections,
                        footer: { ...data.config_sections?.footer, social_links: newSocials }
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Social Link')}
                  </Button>
                </div>
              </DirectorySettingsCard>

              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Footer Links'),
                  t('Footer navigation links by category'),
                  Link2,
                  'bg-orange-100 dark:bg-orange-900/40',
                  'text-orange-600 dark:text-orange-400',
                )}
              >
                <div className="space-y-6">
                  {['product', 'company', 'support', 'legal'].map((category) => (
                    <div key={category} className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor={`${category}_title`}>{t('Section Title')}</Label>
                        <Input
                          id={`${category}_title`}
                          value={data.config_sections?.footer?.section_titles?.[category] || ''}
                          onChange={(e) => {
                            const newTitles = { ...data.config_sections?.footer?.section_titles };
                            newTitles[category] = e.target.value;
                            setData('config_sections', {
                              ...data.config_sections,
                              footer: { ...data.config_sections?.footer, section_titles: newTitles }
                            });
                          }}
                          placeholder={category.charAt(0).toUpperCase() + category.slice(1)}
                        />
                      </div>
                      <h4 className="font-medium text-foreground">
                        {data.config_sections?.footer?.section_titles?.[category] || category.charAt(0).toUpperCase() + category.slice(1)} {t('Links')}
                      </h4>

                      <div className="space-y-2">
                        {(data.config_sections?.footer?.links?.[category] || []).map((link: { name: string; href: string }, index: number) => (
                          <div key={index} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <Label htmlFor={`${category}_${index}_name`}>{t('Name')}</Label>
                              <Input
                                id={`${category}_${index}_name`}
                                value={link.name || ''}
                                onChange={(e) => {
                                  const newLinks = { ...data.config_sections?.footer?.links };
                                  if (!newLinks[category]) newLinks[category] = [];
                                  newLinks[category][index] = { ...newLinks[category][index], name: e.target.value };
                                  setData('config_sections', {
                                    ...data.config_sections,
                                    footer: { ...data.config_sections?.footer, links: newLinks }
                                  });
                                }}
                                placeholder={t('Features')}
                              />
                            </div>
                            <div className="space-y-3">
                              <Label htmlFor={`${category}_${index}_href`}>{t('URL')}</Label>
                              <div className="flex gap-2">
                                <Input
                                  id={`${category}_${index}_href`}
                                  value={link.href || ''}
                                  onChange={(e) => {
                                    const newLinks = { ...data.config_sections?.footer?.links };
                                    if (!newLinks[category]) newLinks[category] = [];
                                    newLinks[category][index] = { ...newLinks[category][index], href: e.target.value };
                                    setData('config_sections', {
                                      ...data.config_sections,
                                      footer: { ...data.config_sections?.footer, links: newLinks }
                                    });
                                  }}
                                  placeholder="#features"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:hover:bg-red-950/40"
                                  onClick={() => {
                                    const newLinks = { ...data.config_sections?.footer?.links };
                                    if (newLinks[category]) {
                                      newLinks[category] = newLinks[category].filter((_: { name: string; href: string }, i: number) => i !== index);
                                      setData('config_sections', {
                                        ...data.config_sections,
                                        footer: { ...data.config_sections?.footer, links: newLinks }
                                      });
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
                            const newLinks = { ...data.config_sections?.footer?.links };
                            if (!newLinks[category]) newLinks[category] = [];
                            newLinks[category].push({ name: '', href: '' });
                            setData('config_sections', {
                              ...data.config_sections,
                              footer: { ...data.config_sections?.footer, links: newLinks }
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {t('Add')} {data.config_sections?.footer?.section_titles?.[category] || category.charAt(0).toUpperCase() + category.slice(1)} {t('Link')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DirectorySettingsCard>
            </div>
          )}

          {activeSection === 'order' && (
            <div className="space-y-6">
              <DirectorySettingsCard
                header={renderSectionHeader(
                  t('Section Order'),
                  t('Drag and drop to reorder sections on your directory page'),
                  LayoutList,
                  'bg-indigo-100 dark:bg-indigo-900/40',
                  'text-indigo-600 dark:text-indigo-400',
                )}
              >
                <div className="space-y-4">
                  {(() => {
                    const defaultOrder = ['hero', 'search', 'categories', 'filters', 'businesses'];
                    const currentOrder = data.config_sections.section_order || [];
                    const mergedOrder = [...new Set([...currentOrder, ...defaultOrder])];
                    return mergedOrder;
                  })().map((sectionKey, index) => {
                    const sectionNames: Record<string, string> = {
                      hero: t('Hero Section'),
                      search: t('Search Bar'),
                      categories: t('Business Categories'),
                      filters: t('Filters'),
                      businesses: t('Business Listings')
                    };

                    const isEnabled = data.config_sections.section_visibility?.[sectionKey] !== false;

                    return (
                      <div
                        key={sectionKey}
                        draggable={sectionKey !== 'search' && sectionKey !== 'filters'}
                        onDragStart={sectionKey !== 'search' && sectionKey !== 'filters' ? (e) => {
                          e.dataTransfer.setData('text/plain', index.toString());
                        } : undefined}
                        onDragOver={sectionKey !== 'search' && sectionKey !== 'filters' ? (e) => {
                          e.preventDefault();
                        } : undefined}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                          const currentOrder = [...(data.config_sections.section_order || [])];
                          const draggedItem = currentOrder[dragIndex];

                          if (sectionKey === 'search' || sectionKey === 'filters') return;
                          if (draggedItem === 'search' || draggedItem === 'filters') return;

                          currentOrder.splice(dragIndex, 1);
                          currentOrder.splice(index, 0, draggedItem);
                          setData('config_sections', {
                            ...data.config_sections,
                            section_order: currentOrder
                          });
                        }}
                        className={`rounded-lg border p-4 transition-all ${sectionKey !== 'search' && sectionKey !== 'filters' ? 'cursor-move hover:border-muted-foreground' : 'cursor-default'
                          } ${isEnabled ? 'bg-card' : 'bg-muted/50 opacity-60'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-medium text-foreground">{sectionNames[sectionKey] || sectionKey}</h4>
                              <p className="text-sm text-muted-foreground">
                                {isEnabled ? t('Enabled') : t('Disabled')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">{t('Enable')}</Label>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => {
                                const newVisibility = {
                                  ...data.config_sections.section_visibility,
                                  [sectionKey]: checked
                                };

                                if (sectionKey === 'search' && !checked) {
                                  newVisibility.filters = false;
                                }

                                setData('config_sections', {
                                  ...data.config_sections,
                                  section_visibility: newVisibility
                                });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                    <div className="flex items-start">
                      <Info className="mr-2 mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h4 className="mb-1 text-sm font-medium text-blue-900 dark:text-blue-200">{t('How to reorder')}</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {t("Click and drag any section to change its position. Disabled sections will still appear in the order but won't be visible on the directory page.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DirectorySettingsCard>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </PageTemplate>
  );
}
