import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import { toast } from '@/components/custom-toast';
import MediaPicker from '@/components/MediaPicker';
import { eventTemplates, eventTypeOptions, getEventTemplate } from './event-templates';
import EventPreview from './components/EventPreview';
import EventSectionManager from './components/EventSectionManager';

interface Event {
  id: number;
  name: string;
  slug: string;
  event_type: string;
  config_sections: any;
}

interface Props {
  event?: Event;
  userPlan?: any;
  planFeatures?: any;
  userRole?: string;
}

export default function EventQrCodeForm({ event, userPlan, planFeatures, userRole }: Props) {
  const { t } = useTranslation();
  const isEdit = !!event;
  const [eventType, setEventType] = React.useState(event?.event_type || 'conference');

  const template = getEventTemplate(eventType);
  const isSuperAdmin = userRole === 'superadmin';

  const { data, setData, post, put, processing, errors } = useForm({
    name: event?.name || 'My Event',
    event_type: eventType,
    config_sections: event?.config_sections || {
      ...template?.defaultData || {},
      colors: template?.defaultColors || {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#dbeafe',
        background: '#ffffff',
        text: '#1f2937'
      }
    }
  });

  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        toast.error(`${field}: ${message}`);
      });
    }
  }, [errors]);

  const handleEventTypeChange = (newType: string) => {
    setEventType(newType);
    const newTemplate = getEventTemplate(newType);
    
    setData({
      ...data,
      event_type: newType,
      config_sections: {
        ...newTemplate?.defaultData || {},
        colors: newTemplate?.defaultColors || {
          primary: '#1e40af',
          secondary: '#3b82f6',
          accent: '#dbeafe',
          background: '#ffffff',
          text: '#1f2937'
        }
      }
    });
  };

  const updateTemplateConfig = (section: string, field: string, value: any) => {
    setData('config_sections', {
      ...data.config_sections,
      [section]: {
        ...data.config_sections[section],
        [field]: value
      }
    });
  };

  const handleToggleSection = (sectionKey: string, enabled: boolean) => {
    setData('config_sections', {
      ...data.config_sections,
      [sectionKey]: {
        ...data.config_sections[sectionKey],
        enabled,
        order: data.config_sections[sectionKey]?.order || 0
      }
    });
  };

  const handleReorderSections = (sections: any[]) => {
    const updatedSections = { ...data.config_sections };
    sections.forEach((section, index) => {
      if (updatedSections[section.key]) {
        updatedSections[section.key] = {
          ...updatedSections[section.key],
          order: index
        };
      }
    });
    setData('config_sections', updatedSections);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit) {
      put(route('event-qr-code.update', event.id));
    } else {
      post(route('event-qr-code.store'));
    }
  };

  const breadcrumbs = [
    { title: t('Dashboard'), href: route('dashboard') },
    { title: t('Event QR Code'), href: route('event-qr-code.index') },
    { title: isEdit ? event.name : t('Create Event') }
  ];

  const pageTitle = isEdit ? `Edit ${event?.name}` : 'Create Event';
  const pageUrl = isEdit ? route('event-qr-code.edit', event.id) : route('event-qr-code.create');

  return (
    <PageWrapper title={pageTitle} url={pageUrl} breadcrumbs={breadcrumbs}>
      <Head title={pageTitle} />
    
      {/* Sticky Save Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6">
        <div className="flex items-center justify-between py-3 px-1">
          <div className="flex items-center space-x-2">
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
                const baseUrl = (window as any).page?.props?.base_url || (window as any).appSettings?.baseUrl || window.location.origin;
                const imageUrl = (window as any).page?.props?.image_url || (window as any).appSettings?.imageUrl || baseUrl;
                const storageType = (window as any).page?.props?.globalSettings?.storage_type || (window as any).page?.props?.storage_type || 'local';

                localStorage.setItem('event_qr_preview_data', JSON.stringify({
                  name: data.name,
                  event_type: data.event_type,
                  config_sections: data.config_sections,
                  base_url: baseUrl,
                  image_url: imageUrl,
                  storage_type: storageType
                }));
                window.open(route('event-qr.preview'), '_blank');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              {t("Preview")}
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={processing} 
              className="px-6 h-9"
            >
              {processing ? (isEdit ? t('Updating...') : t('Creating...')) : (isEdit ? t('Update Event') : t('Create Event'))}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">1</span>{t("Event Setup")}</h3>
            </div>
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-1 block">{t("Event Type")}</Label>
                  <Select value={data.event_type} onValueChange={handleEventTypeChange}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm mb-1 block">{t("Event Name")}</Label>
                  <Input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="h-9 text-sm"
                    placeholder={t("Enter event name")}
                    required
                  />
                </div>
              </div>
              
              {/* Color Theme */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-sm">{t("Color Theme")}</Label>
                  <div className="flex space-x-1">
                    {(template?.colorPresets || []).slice(0, 5).map((preset: any, index: number) => (
                      <div 
                        key={index}
                        className="w-5 h-5 rounded-full cursor-pointer border hover:scale-110 transition-transform flex items-center justify-center"
                        style={{ backgroundColor: preset.primary }}
                        onClick={() => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: preset
                          });
                        }}
                      >
                        {data.config_sections?.colors?.primary === preset.primary && (
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
                    <Label className="text-xs mb-1 block">{t("Primary")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.primary || '#1e40af'}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, primary: e.target.value }
                          });
                        }}
                        className="h-8 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-2 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.primary?.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">{t("Secondary")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.secondary || '#3b82f6'}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, secondary: e.target.value }
                          });
                        }}
                        className="h-8 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-2 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.secondary?.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">{t("Text")}</Label>
                    <div className="flex">
                      <Input
                        type="color"
                        value={data.config_sections?.colors?.text || '#1f2937'}
                        onChange={(e) => {
                          setData('config_sections', {
                            ...data.config_sections,
                            colors: { ...data.config_sections?.colors, text: e.target.value }
                          });
                        }}
                        className="h-8 p-0 w-full rounded-r-none"
                      />
                      <div className="bg-gray-100 dark:bg-gray-700 px-2 flex items-center rounded-r-md border border-l-0 border-input text-xs">
                        {data.config_sections?.colors?.text?.substring(0, 7)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm mb-2 block">{t("Background Settings")}</Label>
                <div>
                  <Label className="text-xs mb-1 block">{t("Background Image")}</Label>
                  <MediaPicker
                    value={data.config_sections.design?.background_image || ''}
                    onChange={(url) => {
                      setData('config_sections', {
                        ...data.config_sections,
                        design: {
                          ...data.config_sections.design,
                          background_image: url
                        }
                      });
                    }}
                    placeholder={t("Select background image")}
                    showPreview={true}
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium"><span className="bg-gray-100 dark:bg-gray-700 text-xs rounded-full h-5 w-5 inline-flex items-center justify-center mr-1.5">2</span>{t("Event Sections")}</h3>
            </div>
            <div className="p-3">
              <EventSectionManager
                sections={template?.sections || []}
                templateConfig={{ sections: data.config_sections, sectionSettings: data.config_sections }}
                onUpdateSection={updateTemplateConfig}
                onToggleSection={handleToggleSection}
                onReorderSections={handleReorderSections}
                planFeatures={planFeatures}
                isSuperAdmin={isSuperAdmin}
              />
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-4 h-[calc(100vh-2rem)]">
            <div className="p-3 border-b bg-muted/30">
              <h3 className="text-base font-medium">{t("Live Preview")}</h3>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg overflow-hidden h-[calc(100%-3.5rem)]">
              <div className="flex justify-center h-full">
                <div className="w-full max-w-[400px] overflow-y-auto h-full shadow-lg rounded-lg">
                  <EventPreview data={data} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
