import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Globe, Save } from 'lucide-react';
import { SettingsSection } from '@/components/settings-section';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { toast } from '@/components/custom-toast';
import { getImageDisplayUrl } from '@/utils/imageUrlHelper';
import MediaPicker from '@/components/MediaPicker';

interface SeoSettingsProps {
  settings?: Record<string, string>;
}

interface SeoSettingsState {
  metaTitle: string;
  metaKeywords: string;
  metaDescription: string;
  metaImage: string;
}

export default function SeoSettings({ settings = {} }: SeoSettingsProps) {
  const { t } = useTranslation();
  const pageProps = usePage().props as any;
  
  // Combine settings from props and page props
  const settingsData = Object.keys(settings).length > 0
    ? settings
    : (pageProps.settings || {});

  const [seoSettings, setSeoSettings] = useState<SeoSettingsState>({
    metaTitle: settingsData.metaTitle || '',
    metaKeywords: settingsData.metaKeywords || '',
    metaDescription: settingsData.metaDescription || '',
    metaImage: settingsData.metaImage || '',
  });

  useEffect(() => {
    if (Object.keys(settingsData).length > 0) {
      setSeoSettings({
        metaTitle: settingsData.metaTitle || '',
        metaKeywords: settingsData.metaKeywords || '',
        metaDescription: settingsData.metaDescription || '',
        metaImage: settingsData.metaImage || '',
      });
    }
  }, [settingsData]);

  const handleSeoSettingsChange = (field: string, value: string) => {
    setSeoSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleMediaSelect = (url: string | string[]) => {
    const urlString = Array.isArray(url) ? url[0] || '' : url;
    setSeoSettings(prev => ({ ...prev, metaImage: urlString }));
  };

  const getDescriptionStatus = () => {
    const length = seoSettings.metaDescription.length;
    if (length === 0) return { color: 'text-muted-foreground', icon: AlertCircle };
    if (length < 120) return { color: 'text-orange-500', icon: AlertCircle };
    if (length <= 160) return { color: 'text-green-500', icon: CheckCircle2 };
    return { color: 'text-red-500', icon: AlertCircle };
  };

  const getKeywordsCount = () => {
    return seoSettings.metaKeywords.split(',').filter(keyword => keyword.trim()).length;
  };

  const submitSeoSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (!seoSettings.metaTitle.trim()) {
      toast.error(t('Meta Title is required'));
      return;
    }

    if (!seoSettings.metaDescription.trim()) {
      toast.error(t('Meta Description is required'));
      return;
    }

    router.post(route('settings.seo.update'), seoSettings, {
      preserveScroll: true,
      onSuccess: (page) => {
        const successMessage = (page.props as any).flash?.success;
        const errorMessage = (page.props as any).flash?.error;
        if (successMessage) toast.success(successMessage);
        else if (errorMessage) toast.error(errorMessage);
      },
      onError: (errors) => {
        toast.error(Object.values(errors).join(', ') || t('Failed to update SEO settings'));
      }
    });
  };

  return (
    <SettingsSection
      title={t("SEO Settings")}
      description={t("Configure SEO settings to improve your website's search engine visibility")}
      action={
        <Button type="submit" form="seo-settings-form" size="sm">
          <Save className="h-4 w-4 mr-2" />
          {t("Save Changes")}
        </Button>
      }
    >
      <form id="seo-settings-form" onSubmit={submitSeoSettings} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">

            {/* Meta Title */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaTitle" required>{t('Meta Title')}</Label>
                <span className={`text-sm ${
                  seoSettings.metaTitle.length > 60 ? 'text-red-500' :
                  seoSettings.metaTitle.length > 50 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {seoSettings.metaTitle.length}/60
                </span>
              </div>
              <Input
                id="metaTitle"
                value={seoSettings.metaTitle}
                onChange={(e) => handleSeoSettingsChange('metaTitle', e.target.value)}
                placeholder={t('Enter page title for search engines')}
                maxLength={60}
                required
              />
              <p className="text-xs text-muted-foreground">
                {t('Appears as the clickable headline in search results')}
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="metaDescription" required>{t('Meta Description')}</Label>
                <div className="flex items-center gap-1">
                  {(() => {
                    const { color, icon: Icon } = getDescriptionStatus();
                    return (
                      <>
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className={`text-sm ${color}`}>
                          {seoSettings.metaDescription.length}/160
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
              <Textarea
                id="metaDescription"
                value={seoSettings.metaDescription}
                onChange={(e) => handleSeoSettingsChange('metaDescription', e.target.value)}
                placeholder={t('Write a compelling description that summarizes your page content...')}
                maxLength={160}
                rows={3}
                required
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {t('Appears below the title in search results. Optimal length: 120-160 characters')}
              </p>
            </div>

            {/* Meta Keywords */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="metaKeywords">{t('Meta Keywords')}</Label>
                <Badge variant="outline">{getKeywordsCount()} {t('keywords')}</Badge>
              </div>
              <Input
                id="metaKeywords"
                type="text"
                value={seoSettings.metaKeywords}
                onChange={(e) => handleSeoSettingsChange('metaKeywords', e.target.value)}
                placeholder={t('seo, optimization, website, keywords')}
              />
              <p className="text-xs text-muted-foreground">
                {t('Comma-separated keywords relevant to your content')}
              </p>
            </div>

            {/* Meta Image */}
            <div className="space-y-2">
              <Label>{t('Meta Image')}</Label>
              <MediaPicker
                value={seoSettings.metaImage}
                onChange={handleMediaSelect}
                placeholder={t('Select image for social media sharing...')}
                showPreview={false}
              />
              <p className="text-xs text-muted-foreground">
                {t('Image displayed when sharing on social media. Recommended: 1200x630px')}
              </p>
            </div>

          </div>

          {/* Preview Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-medium">{t('SEO Preview')}</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-md border bg-white p-3">
                      <div className="mb-1 text-xs text-green-600">example.com</div>
                      <div className="line-clamp-1 text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                        {seoSettings.metaTitle || t('Your page title will appear here')}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {seoSettings.metaDescription || t('Your meta description will appear here in search results...')}
                      </div>
                    </div>

                    {seoSettings.metaImage && (
                      <div className="rounded-md border bg-white p-3">
                        <div className="mb-2 text-xs text-muted-foreground">{t('Social Media Preview')}</div>
                        <img
                          src={getImageDisplayUrl(seoSettings.metaImage)}
                          alt="Social preview"
                          className="mb-2 h-24 w-full rounded bg-gray-100 object-contain"
                        />
                        <div className="space-y-1">
                          <div className="line-clamp-1 text-sm font-medium text-gray-900">
                            {seoSettings.metaTitle || t('Your page title')}
                          </div>
                          <div className="line-clamp-2 text-xs text-gray-500">
                            {seoSettings.metaDescription || t('Your description...')}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="rounded-md border bg-blue-50 p-3">
                      <div className="mb-2 text-xs font-medium text-blue-900">{t('SEO Tips')}</div>
                      <ul className="space-y-1 text-xs text-blue-700">
                        <li>• {t('Title: 50-60 characters optimal')}</li>
                        <li>• {t('Description: 150-160 characters')}</li>
                        <li>• {t('Include target keywords early')}</li>
                        <li>• {t('Image: 1200x630px works well')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </SettingsSection>
  );
}
