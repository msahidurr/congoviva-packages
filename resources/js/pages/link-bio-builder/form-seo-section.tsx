import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';

interface SEOSectionProps {
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    og_image?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function SEOSection({ seo, onUpdate }: SEOSectionProps) {
  const { t } = useTranslation();
  
  // Ensure all SEO values are strings, not null
  const safeSeo = {
    title: seo?.title || '',
    description: seo?.description || '',
    keywords: seo?.keywords || '',
    og_image: seo?.og_image || ''
  };
  
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm mb-1 block">{t("Meta Title")}</Label>
        <Input
          value={safeSeo.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          className="h-9 text-sm"
          placeholder={t("Enter meta title")}
        />
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">{t("Meta Description")}</Label>
        <Textarea
          value={safeSeo.description}
          onChange={(e) => onUpdate('description', e.target.value)}
          className="min-h-[80px] text-sm"
          placeholder={t("Enter meta description")}
        />
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">{t("Keywords")}</Label>
        <Input
          value={safeSeo.keywords}
          onChange={(e) => onUpdate('keywords', e.target.value)}
          className="h-9 text-sm"
          placeholder={t("Enter keywords (comma separated)")}
        />
      </div>
      
      <div>
        <Label className="text-sm mb-1 block">{t("OG Image")}</Label>
        <MediaPicker
          value={safeSeo.og_image}
          onChange={(url) => onUpdate('og_image', url)}
          placeholder={t("Select OG image")}
          showPreview={true}
        />
      </div>
    </div>
  );
}