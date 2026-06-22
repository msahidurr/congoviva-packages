import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import VCardPreview from '@/pages/vcard-builder/components/VCardPreview';
import VCardSectionManager from '@/components/VCardSectionManager';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';
import { useTranslation } from 'react-i18next';

interface VCardBuilderProps {
  mode: 'create' | 'edit';
  businessType: string;
  template: any;
  businessCategories: any[];
  data: any;
  setData: (key: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  processing: boolean;
  errors: any;
  business?: any;
}

export default function VCardBuilder({
  mode,
  businessType,
  template,
  businessCategories,
  data,
  setData,
  onSubmit,
  processing,
  errors,
  business
}: VCardBuilderProps) {
  const { t } = useTranslation();
  const updateTemplateConfig = (section: string, field: string, value: any) => {
    setData('config_sections', {
      ...data.config_sections,
      [section]: {
        ...data.config_sections[section],
        [field]: value
      }
    });
  };

  const updateColors = (colors: any) => {
    setData('config_sections', {
      ...data.config_sections,
      colors: colors
    });
  };

  const updateFont = (font: string) => {
    setData('config_sections', {
      ...data.config_sections,
      font: font
    });
  };

  const handleToggleSection = (sectionKey: string, enabled: boolean) => {
    setData('config_sections', {
      ...data.config_sections,
      [sectionKey]: {
        ...data.config_sections[sectionKey],
        enabled
      }
    });
  };

  const handleReorderSections = (sections: any[]) => {
    const sectionSettings = {};
    sections.forEach((section) => {
      sectionSettings[section.key] = {
        ...data.template_config.sectionSettings?.[section.key],
        enabled: section.enabled,
        order: section.order
      };
    });
    
    setData('template_config', {
      ...data.template_config,
      sectionSettings
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-screen">
      {/* Left Side - Configuration */}
      <div className="space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'create' ? `Create ${template.name} vCard` : `Edit ${business?.name}`}
            </h1>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{template.name}</Badge>
              {business?.category && (
                <Badge variant="outline">{business.category.name}</Badge>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Basic Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === 'create' && (
                <div className="space-y-2">
                  <Label>{t("Business Type")}</Label>
                  <select
                    value={businessType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const defaultData = {
                        freelancer: { header: { name: 'John Doe', title: 'Professional Freelancer' }, contact: { phone: '+1 (555) 123-4567', email: 'john@example.com' }, about: { description: 'Experienced freelancer' }, services: { enabled: true } },
                        restaurant: { header: { name: 'Delicious Bistro', title: 'Fine Dining Restaurant' }, contact: { phone: '+1 (555) 123-4567', email: 'info@bistro.com' }, about: { description: 'Award-winning restaurant' }, menu: { enabled: true } },
                        doctor: { header: { name: 'Dr. Smith', title: 'Family Medicine' }, contact: { phone: '+1 (555) 123-4567', email: 'dr.smith@clinic.com' }, about: { description: 'Experienced family doctor' }, appointments: { enabled: true } }
                      };
                      setData('config_sections', { ...data.config_sections, ...defaultData[newType] });
                    }}
                    className="w-full p-2 border rounded"
                  >
                    <option value="freelancer">Freelancer</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="doctor">Doctor/Medical</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="fitness-trainer">Fitness Trainer</option>
                    <option value="social-influencer">Social Influencer</option>
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">{t("Business Name")} *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Color Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Color Theme")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className="p-3 border rounded cursor-pointer hover:border-primary"
                  onClick={() => updateColors({ primary: '#3B82F6', secondary: '#1E40AF', accent: '#F59E0B' })}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-700"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                  </div>
                  <p className="text-xs font-medium">Blue</p>
                </div>
                <div 
                  className="p-3 border rounded cursor-pointer hover:border-primary"
                  onClick={() => updateColors({ primary: '#059669', secondary: '#047857', accent: '#6EE7B7' })}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-green-600"></div>
                    <div className="w-4 h-4 rounded-full bg-green-700"></div>
                    <div className="w-4 h-4 rounded-full bg-green-300"></div>
                  </div>
                  <p className="text-xs font-medium">Green</p>
                </div>
                <div 
                  className="p-3 border rounded cursor-pointer hover:border-primary"
                  onClick={() => updateColors({ primary: '#DC2626', secondary: '#B91C1C', accent: '#FCA5A5' })}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-600"></div>
                    <div className="w-4 h-4 rounded-full bg-red-700"></div>
                    <div className="w-4 h-4 rounded-full bg-red-300"></div>
                  </div>
                  <p className="text-xs font-medium">Red</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("Font Family")}</Label>
                <select
                  value={data.config_sections?.font || 'Inter, sans-serif'}
                  onChange={(e) => updateFont(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Template Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>{t("vCard Configuration")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">

                <VCardSectionManager
                  sections={getBusinessTemplate(businessType)?.sections || []}
                  templateConfig={{ sections: data.config_sections, sectionSettings: data.config_sections }}
                  onUpdateSection={updateTemplateConfig}
                  onToggleSection={handleToggleSection}
                  onReorderSections={handleReorderSections}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              {t("Save Draft")}
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create vCard' : 'Update vCard')}
            </Button>
          </div>
        </form>
      </div>

      {/* Right Side - Live Preview */}
      <div className="bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
        <div className="sticky top-0">
          <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            {t("Live Preview")}
          </h2>
          <VCardPreview
            businessType={businessType}
            data={{ ...data, template_config: { sections: data.config_sections, sectionSettings: data.config_sections } }}
            template={template}
          />
        </div>
      </div>
    </div>
  );
}