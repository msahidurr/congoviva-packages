import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { PageTemplate } from '@/components/page-template';
import { SettingsSection } from '@/components/settings-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Save, Plus, Trash2, Type, Star, BarChart3, Layout, Palette, Eye, Info, Image, Monitor, GripVertical, ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MediaPicker from '@/components/MediaPicker';
import { toast } from '@/components/custom-toast';
import { Toaster } from '@/components/ui/toaster';
import { useBrand } from '@/contexts/BrandContext';
import { THEME_COLORS } from '@/hooks/use-appearance';

interface MarketplaceData {
  title: string;
  subtitle: string;
  demo_button_text: string;
  get_started_button_text: string;
  demo_button_link?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  background_image?: string;
  use_background_image?: boolean;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  stats: Array<{
    value: string;
    label: string;
  }>;
  screenshots: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  screenshots_title?: string;
  screenshots_subtitle?: string;
  features_title?: string;
  features_subtitle?: string;
  features_show_icons?: boolean;
  features_layout?: string;
  features_columns?: number;
  features_background_color?: string;
  features_icon_color?: string;
  config_sections?: {
    section_order?: string[];
    section_visibility?: {
      [key: string]: boolean;
    };
    sections?: Array<{
      key: string;
      [key: string]: any;
    }>;
  };
}

interface PageProps {
  marketplaceData: MarketplaceData;
  flash?: {
    success?: string;
    error?: string;
  };
}

export default function MarketplaceSettings() {
  const { t } = useTranslation();
  const { marketplaceData, flash } = usePage<PageProps>().props;
  const { themeColor, customColor } = useBrand();
  const brandColor = themeColor === 'custom' ? customColor : THEME_COLORS[themeColor as keyof typeof THEME_COLORS];
  
  const { data, setData, post, processing, errors } = useForm(marketplaceData || {
    title: '',
    subtitle: '',
    demo_button_text: '',
    get_started_button_text: '',
    demo_button_link: '',
    primary_color: '#10b77f',
    secondary_color: '#3b82f6',
    accent_color: '#8b5cf6',
    background_image: '',
    use_background_image: false,
    features: [],
    stats: [],
    screenshots: [],
    screenshots_title: '',
    screenshots_subtitle: '',
    features_title: '',
    features_subtitle: '',
    features_show_icons: true,
    features_layout: 'grid',
    features_columns: 4,
    features_background_color: '#ffffff',
    features_icon_color: '#10b77f',
    config_sections: marketplaceData?.config_sections || {
      section_order: ['hero', 'features', 'stats', 'screenshots'],
      section_visibility: {
        hero: true,
        features: true,
        stats: true,
        screenshots: true
      }
    }
  });
  
  const [activeSection, setActiveSection] = useState<'content' | 'features' | 'stats' | 'screenshots' | 'order'>('content');
  const [isLoading, setIsLoading] = useState(false);

  const convertToRelativePath = (url: string): string => {
    if (!url) return url;
    if (!url.startsWith('http')) return url;
    const storageIndex = url.indexOf('/storage/');
    return storageIndex !== -1 ? url.substring(storageIndex) : url;
  };
  
  const getDisplayUrl = (path: string): string => {
    if (!path) return path;
    if (path.startsWith('http')) return path;
    return `${window.appSettings.imageUrl}${path}`;
  };

  const updateSectionOrder = (newOrder: string[]) => {
    setData('config_sections', {
      ...data.config_sections,
      section_order: newOrder
    });
  };

  const updateSectionVisibility = (sectionKey: string, visible: boolean) => {
    setData('config_sections', {
      ...data.config_sections,
      section_visibility: { ...data.config_sections?.section_visibility, [sectionKey]: visible }
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
    const currentOrder = [...(data.config_sections?.section_order || ['hero', 'features', 'stats', 'screenshots'])];
    const draggedItem = currentOrder[dragIndex];
    currentOrder.splice(dragIndex, 1);
    currentOrder.splice(dropIndex, 0, draggedItem);
    updateSectionOrder(currentOrder);
  };

  const saveSettings = () => {
    setIsLoading(true);
        
    router.post(route('event.marketplace.settings.update'), data, {
      preserveScroll: true,
      onSuccess: (page) => {
        setIsLoading(false);
        const successMessage = page.props.flash?.success || t('Marketplace settings saved successfully');
        const errorMessage = page.props.flash?.error;
        
        if (successMessage && !errorMessage) {
          toast.success(successMessage);
        } else if (errorMessage) {
          toast.error(errorMessage);
        }
      },
      onError: (errors) => {
        setIsLoading(false);
        const errorMessage = errors.error || Object.values(errors).join(', ') || t('Failed to save marketplace settings');
        toast.error(errorMessage);
      }
    });
  };

  const addFeature = () => {
    setData('features', [...data.features, { title: '', description: '', icon: 'calendar' }]);
  };

  const removeFeature = (index: number) => {
    setData('features', data.features.filter((_, i) => i !== index));
  };

  const addStat = () => {
    setData('stats', [...data.stats, { value: '', label: '' }]);
  };

  const removeStat = (index: number) => {
    setData('stats', data.stats.filter((_, i) => i !== index));
  };

  const addScreenshot = () => {
    setData('screenshots', [...(data.screenshots || []), { title: '', description: '', image: '' }]);
  };

  const removeScreenshot = (index: number) => {
    setData('screenshots', (data.screenshots || []).filter((_, i) => i !== index));
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Addons'), href: route('addons.index') },
    { title: t('Event Marketplace Settings') }
  ];

  return (
    <PageTemplate 
      title={t("Event Marketplace Settings")} 
      url="/event-qr-code/marketplace/settings"
      breadcrumbs={breadcrumbs}
      action={
        <div className="flex gap-2">
          <Button
            onClick={() => window.open(route('event-qr-code.marketplace'), '_blank')}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: brandColor }}
          >
            <Eye className="w-4 h-4" />
            {t("View Marketplace")}
          </Button>
        </div>
      }
    >
      <SettingsSection
        title={t('Event Marketplace Settings')}
        description={t('Customize your marketplace content and appearance')}
        action={
          <Button onClick={saveSettings} disabled={isLoading} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? t('Saving...') : t('Save Changes')}
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'content', label: t('Content'), icon: Type },
              { key: 'features', label: t('Features'), icon: Star },
              { key: 'stats', label: t('Statistics'), icon: BarChart3 },
              { key: 'screenshots', label: t('Screenshots'), icon: Monitor },
              { key: 'order', label: t('Order'), icon: ArrowUpDown }
            ].map(section => (
              <Button
                key={section.key}
                variant={activeSection === section.key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.key as any)}
                className={`flex items-center gap-2 ${
                  activeSection === section.key 
                    ? 'text-white dark:text-white border-0' 
                    : 'dark:text-gray-300 dark:border-gray-700'
                }`}
                style={activeSection === section.key ? {
                  backgroundColor: brandColor
                } : {}}
              >
                <section.icon className="h-4 w-4" />
                {section.label}
              </Button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {activeSection === 'content' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Type className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Basic Information')}</h3>
                      <p className="text-sm text-gray-500">{t('Configure main content and call-to-action buttons')}</p>
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
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="title">{t('Title')}</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Event QR Code Add-on"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">{t('Subtitle')}</Label>
                    <Textarea
                      id="subtitle"
                      value={data.subtitle}
                      onChange={(e) => setData('subtitle', e.target.value)}
                      rows={3}
                      placeholder="Create professional event experiences with QR codes"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="demo_button_text">{t('Demo Button Text')}</Label>
                      <Input
                        id="demo_button_text"
                        value={data.demo_button_text}
                        onChange={(e) => setData('demo_button_text', e.target.value)}
                        placeholder="View Demo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="demo_button_link">{t('Demo Button Link')}</Label>
                      <Input
                        id="demo_button_link"
                        value={data.demo_button_link || ''}
                        onChange={(e) => setData('demo_button_link', e.target.value)}
                        placeholder="https://demo.example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="get_started_button_text">{t('Get Started Button Text')}</Label>
                      <Input
                        id="get_started_button_text"
                        value={data.get_started_button_text}
                        onChange={(e) => setData('get_started_button_text', e.target.value)}
                        placeholder="Get Started"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Theme Colors')}</h3>
                    <p className="text-sm text-gray-500">{t('Customize the color scheme for your marketplace')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="primary_color">{t('Primary Color')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={data.primary_color || '#10b77f'}
                        onChange={(e) => setData('primary_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.primary_color || '#10b77f'}
                        onChange={(e) => setData('primary_color', e.target.value)}
                        placeholder="#10b77f"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="secondary_color">{t('Secondary Color')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={data.secondary_color || '#3b82f6'}
                        onChange={(e) => setData('secondary_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.secondary_color || '#3b82f6'}
                        onChange={(e) => setData('secondary_color', e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="accent_color">{t('Accent Color')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent_color"
                        type="color"
                        value={data.accent_color || '#8b5cf6'}
                        onChange={(e) => setData('accent_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.accent_color || '#8b5cf6'}
                        onChange={(e) => setData('accent_color', e.target.value)}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Image className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Background Options')}</h3>
                    <p className="text-sm text-gray-500">{t('Choose between solid colors or background image')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="use_background_image"
                      checked={data.use_background_image || false}
                      onCheckedChange={(checked) => setData('use_background_image', checked)}
                    />
                    <Label htmlFor="use_background_image" className="text-sm font-medium">
                      {t('Use Background Image')}
                    </Label>
                  </div>
                  
                  {data.use_background_image && (
                    <div className="space-y-3">
                      <MediaPicker
                        label={t('Background Image')}
                        value={getDisplayUrl(data.background_image || '')}
                        onChange={(value) => setData('background_image', convertToRelativePath(value))}
                        placeholder={t('Select background image...')}
                      />
                      <p className="text-xs text-gray-500">
                        {t('Recommended size: 1920x1080px or larger. The image will be used as the hero section background.')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {activeSection === 'features' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Layout className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t('Features Layout')}</h3>
                      <p className="text-sm text-gray-500">{t('Configure layout and display options')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">{t('Enable Section')}</Label>
                    <Switch
                      checked={data.config_sections?.section_visibility?.features !== false}
                      onCheckedChange={(checked) => updateSectionVisibility('features', checked)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="features_layout">{t('Layout Style')}</Label>
                    <select
                      id="features_layout"
                      value={data.features_layout || 'grid'}
                      onChange={(e) => setData('features_layout', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                      <option value="carousel">Carousel</option>
                      <option value="centered">Centered</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="features_columns">{t('Number of Columns')}</Label>
                    <select
                      id="features_columns"
                      value={data.features_columns || 4}
                      onChange={(e) => setData('features_columns', parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value={1}>1 Column</option>
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns</option>
                      <option value={4}>4 Columns</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Features Section Content')}</h3>
                    <p className="text-sm text-gray-500">{t('Section title and description')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="features_title">{t('Section Title')}</Label>
                    <Input
                      id="features_title"
                      value={data.features_title || ''}
                      onChange={(e) => setData('features_title', e.target.value)}
                      placeholder={t('Powerful Features')}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="features_subtitle">{t('Section Subtitle')}</Label>
                    <Textarea
                      id="features_subtitle"
                      value={data.features_subtitle || ''}
                      onChange={(e) => setData('features_subtitle', e.target.value)}
                      placeholder={t('Everything you need for professional event QR code management')}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="features_show_icons">{t('Show Icons')}</Label>
                      <Switch
                        id="features_show_icons"
                        checked={data.features_show_icons !== false}
                        onCheckedChange={(checked) => setData('features_show_icons', checked)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {t('Display icons for each feature item')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Palette className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Features Style')}</h3>
                    <p className="text-sm text-gray-500">{t('Customize appearance and colors')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="features_background_color">{t('Background Color')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="features_background_color"
                        type="color"
                        value={data.features_background_color || '#ffffff'}
                        onChange={(e) => setData('features_background_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.features_background_color || '#ffffff'}
                        onChange={(e) => setData('features_background_color', e.target.value)}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="features_icon_color">{t('Icon Color')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="features_icon_color"
                        type="color"
                        value={data.features_icon_color || '#10b77f'}
                        onChange={(e) => setData('features_icon_color', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={data.features_icon_color || '#10b77f'}
                        onChange={(e) => setData('features_icon_color', e.target.value)}
                        placeholder="#10b77f"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Feature Items')}</h3>
                    <p className="text-sm text-gray-500">{t('Add and manage feature items')}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {(data.features || []).map((feature, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                          {t('Feature')} {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <Label htmlFor={`feature_${index}_title`}>{t('Title')}</Label>
                          <Input
                            id={`feature_${index}_title`}
                            value={feature.title || ''}
                            onChange={(e) => {
                              const newFeatures = [...data.features];
                              newFeatures[index].title = e.target.value;
                              setData('features', newFeatures);
                            }}
                            placeholder={t('Easy to Use')}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor={`feature_${index}_icon`}>{t('Icon')}</Label>
                          <select
                            id={`feature_${index}_icon`}
                            value={feature.icon || 'calendar'}
                            onChange={(e) => {
                              const newFeatures = [...data.features];
                              newFeatures[index].icon = e.target.value;
                              setData('features', newFeatures);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                              <option value="calendar">Calendar</option>
                              <option value="qr-code">QR Code</option>
                              <option value="users">Users</option>
                              <option value="bar-chart">Analytics</option>
                              <option value="globe">Globe</option>
                              <option value="shield">Shield</option>
                              <option value="star">Star</option>
                              <option value="zap">Zap</option>
                              <option value="smartphone">Smartphone</option>
                              <option value="share">Share</option>
                              <option value="lock">Lock</option>
                              <option value="wifi">Wifi</option>
                              <option value="heart">Heart</option>
                          </select>
                        </div>
                        
                        <div className="space-y-3 md:col-span-1">
                          <Label htmlFor={`feature_${index}_description`}>{t('Description')}</Label>
                          <Textarea
                            id={`feature_${index}_description`}
                            value={feature.description || ''}
                            onChange={(e) => {
                              const newFeatures = [...data.features];
                              newFeatures[index].description = e.target.value;
                              setData('features', newFeatures);
                            }}
                            placeholder={t('Create event QR codes with our intuitive interface')}
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
                    onClick={addFeature}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Feature')}
                  </Button>
                </div>
              </div>
            </div>
            )}

            {activeSection === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Hero Statistics')}</h3>
                    <p className="text-sm text-gray-500">{t('Add compelling statistics to your hero section')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">{t('Enable Section')}</Label>
                  <Switch
                    checked={data.config_sections?.section_visibility?.stats !== false}
                    onCheckedChange={(checked) => updateSectionVisibility('stats', checked)}
                  />
                </div>
              </div>
                
                <div className="space-y-4">
                  {(data.stats || []).map((stat, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div className="space-y-3">
                        <Label htmlFor={`hero_stats_${index}_value`}>{t('Value')}</Label>
                        <Input
                          id={`hero_stats_${index}_value`}
                          value={stat.value || ''}
                          onChange={(e) => {
                            const newStats = [...(data.stats || [])];
                            newStats[index] = { ...newStats[index], value: e.target.value };
                            setData('stats', newStats);
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
                              const newStats = [...(data.stats || [])];
                              newStats[index] = { ...newStats[index], label: e.target.value };
                              setData('stats', newStats);
                            }}
                            placeholder={t('Active Users')}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => removeStat(index)}
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
                    onClick={addStat}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Statistic')}
                  </Button>
                </div>
            </div>
            )}

            {activeSection === 'screenshots' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Type className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Screenshots Section')}</h3>
                    <p className="text-sm text-gray-500">{t('Configure screenshots section content and gallery')}</p>
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
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="space-y-3">
                    <Label htmlFor="screenshots_title">{t('Section Title')}</Label>
                    <Input
                      id="screenshots_title"
                      value={data.screenshots_title || ''}
                      onChange={(e) => setData('screenshots_title', e.target.value)}
                      placeholder={t('See Event QR Code in Action')}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="screenshots_subtitle">{t('Section Subtitle')}</Label>
                    <Textarea
                      id="screenshots_subtitle"
                      value={data.screenshots_subtitle || ''}
                      onChange={(e) => setData('screenshots_subtitle', e.target.value)}
                      placeholder={t('Discover how easy it is to create and manage event QR codes with our intuitive interface and powerful features.')}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {(data.screenshots || []).map((screenshot, index) => (
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
                          onClick={() => removeScreenshot(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-3">
                          <MediaPicker
                            label={t('Screenshot Image')}
                            value={getDisplayUrl(screenshot.image || '')}
                            onChange={(value) => {
                              const newScreenshots = [...(data.screenshots || [])];
                              newScreenshots[index].image = convertToRelativePath(value);
                              setData('screenshots', newScreenshots);
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
                                const newScreenshots = [...(data.screenshots || [])];
                                newScreenshots[index].title = e.target.value;
                                setData('screenshots', newScreenshots);
                              }}
                              placeholder={t('Event QR Code Page')}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <Label htmlFor={`screenshot_${index}_description`}>{t('Description')}</Label>
                          <Textarea
                            id={`screenshot_${index}_description`}
                            value={screenshot.description || ''}
                            onChange={(e) => {
                              const newScreenshots = [...(data.screenshots || [])];
                              newScreenshots[index].description = e.target.value;
                              setData('screenshots', newScreenshots);
                            }}
                            placeholder={t('Create and manage event QR codes with our intuitive interface')}
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
                    onClick={addScreenshot}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('Add Screenshot')}
                  </Button>
                </div>
            </div>
            )}

            {activeSection === 'order' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ArrowUpDown className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('Section Order')}</h3>
                    <p className="text-sm text-gray-500">{t('Drag and drop to reorder sections on your marketplace page')}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {(data.config_sections?.section_order || ['hero', 'features', 'stats', 'screenshots']).map((sectionKey, index) => {
                    const sectionNames = {
                      hero: t('Hero Section'),
                      features: t('Features'),
                      stats: t('Statistics'),
                      screenshots: t('Screenshots')
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
                        {t('Click and drag any section to change its position. Disabled sections will still appear in the order but won\'t be visible on the marketplace page.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </SettingsSection>
      <Toaster />
    </PageTemplate>
  );
}