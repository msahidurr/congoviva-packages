import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface AnalyticsSectionProps {
  analytics?: {
    google_analytics?: string;
    facebook_pixel?: string;
    custom_code?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function AnalyticsSection({ analytics, onUpdate }: AnalyticsSectionProps) {
  const { t } = useTranslation();
  
  // Ensure all analytics values are strings, not null
  const safeAnalytics = {
    google_analytics: analytics?.google_analytics || '',
    facebook_pixel: analytics?.facebook_pixel || '',
    custom_code: analytics?.custom_code || ''
  };
  
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm mb-1 block">{t("Google Analytics ID")}</Label>
        <Input
          value={safeAnalytics.google_analytics}
          onChange={(e) => onUpdate('google_analytics', e.target.value)}
          className="h-9 text-sm"
          placeholder={t("Enter Google Analytics ID (e.g. G-XXXXXXXXXX)")}
        />
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">{t("Facebook Pixel ID")}</Label>
        <Input
          value={safeAnalytics.facebook_pixel}
          onChange={(e) => onUpdate('facebook_pixel', e.target.value)}
          className="h-9 text-sm"
          placeholder={t("Enter Facebook Pixel ID")}
        />
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">{t("Custom Code")}</Label>
        <Textarea
          value={safeAnalytics.custom_code}
          onChange={(e) => onUpdate('custom_code', e.target.value)}
          className="min-h-[120px] text-sm font-mono"
          placeholder={t("Enter custom HTML/JavaScript code")}
        />
        <p className="text-xs text-muted-foreground mt-1">{t("This code will be added to the <head> section of your bio link page.")}</p>
      </div>
    </div>
  );
}