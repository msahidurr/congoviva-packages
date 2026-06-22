import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MediaPicker from '@/components/MediaPicker';
import { getImageDisplayUrl, convertUrlToRelativePath } from '@/utils/imageUrlHelper';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult 
} from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Edit,
  Plus,
  Settings,
  Trash2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SectionConfig {
  key: string;
  name: string;
  enabled: boolean;
  order: number;
  fields: any[];
  required: boolean;
}

interface VCardSectionManagerProps {
  sections: any[];
  templateConfig: any;
  onUpdateSection: (sectionKey: string, field: string, value: any) => void;
  onToggleSection: (sectionKey: string, enabled: boolean) => void;
  onReorderSections: (sections: SectionConfig[]) => void;
  planFeatures?: { business_template_sections?: string[] };
  isSuperAdmin?: boolean;
}

export default function VCardSectionManager({
  sections,
  templateConfig,
  onUpdateSection,
  onToggleSection,
  onReorderSections,
  planFeatures,
  isSuperAdmin
}: VCardSectionManagerProps) {
  const { t, i18n } = useTranslation();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['header', 'contact']));
  const [sectionConfigs, setSectionConfigs] = useState<SectionConfig[]>(() => {
    // Filter sections based on plan features    
    let allowedSections = sections;
    
    // If planFeatures is undefined or empty, use default restrictions for non-superadmin
    if (!isSuperAdmin) {
      if (planFeatures?.business_template_sections && planFeatures.business_template_sections.length > 0) {
        // Always include essential sections
        const essentialSections = ['header', 'about', 'contact', 'social', 'business_hours', 'featured_products', 'menu_highlights', 'daily_specials', 'specials'];
        const allAllowedSections = [...new Set([...planFeatures.business_template_sections, ...essentialSections])];
        allowedSections = sections.filter(section => allAllowedSections.includes(section.key));
      } else {
        // Default basic sections for users without plan features - include menu sections
        const basicSections = ['header', 'about', 'contact', 'social', 'featured_products', 'menu_highlights', 'daily_specials', 'specials'];
        allowedSections = sections.filter(section => basicSections.includes(section.key));
      }
      
      // Filter out pixels section if custom CSS/JS feature is not enabled
      if (!planFeatures?.custom_css_js) {
        allowedSections = allowedSections.filter(section => section.key !== 'pixels');
      }
    }
    
    return allowedSections.map((section, index) => ({
      key: section.key,
      name: section.name,
      enabled: templateConfig.sectionSettings?.[section.key]?.enabled ?? true,
      order: templateConfig.sectionSettings?.[section.key]?.order ?? index,
      fields: section.fields,
      required: section.required
    })).sort((a, b) => a.order - b.order);
  });

  // Update sectionConfigs when templateConfig changes
  React.useEffect(() => {
    // Filter sections based on plan features
    let allowedSections = sections;
    
    if (!isSuperAdmin) {
      if (planFeatures?.business_template_sections && planFeatures.business_template_sections.length > 0) {
        // Always include essential sections
        const essentialSections = ['header', 'about', 'contact', 'social', 'business_hours', 'featured_products', 'menu_highlights', 'daily_specials', 'specials'];
        const allAllowedSections = [...new Set([...planFeatures.business_template_sections, ...essentialSections])];
        allowedSections = sections.filter(section => allAllowedSections.includes(section.key));
      } else {
        // Default basic sections for users without plan features - include menu sections
        const basicSections = ['header', 'about', 'contact', 'social', 'featured_products', 'menu_highlights', 'daily_specials', 'specials'];
        allowedSections = sections.filter(section => basicSections.includes(section.key));
      }
      
      // Filter out pixels section if custom CSS/JS feature is not enabled
      if (!planFeatures?.custom_css_js) {
        allowedSections = allowedSections.filter(section => section.key !== 'pixels');
      }
    }
    
    setSectionConfigs(allowedSections.map((section, index) => ({
      key: section.key,
      name: section.name,
      enabled: templateConfig.sectionSettings?.[section.key]?.enabled ?? true,
      order: templateConfig.sectionSettings?.[section.key]?.order ?? index,
      fields: section.fields,
      required: section.required
    })).sort((a, b) => a.order - b.order));
  }, [templateConfig.sectionSettings, sections, planFeatures, isSuperAdmin]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  };

  const handleSectionToggle = (sectionKey: string, enabled: boolean) => {
    setSectionConfigs(prev => 
      prev.map(config => 
        config.key === sectionKey ? { ...config, enabled } : config
      )
    );
    // Immediately call the parent callback
    onToggleSection(sectionKey, enabled);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sectionConfigs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setSectionConfigs(updatedItems);
    // Immediately call the parent callback
    onReorderSections(updatedItems);
  };

  const renderField = (sectionKey: string, field: any) => {
    const value = templateConfig.sections?.[sectionKey]?.[field.name] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            placeholder={t('Enter') + ' ' + t(field.label)}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            className="min-h-[80px]"
          />
        );
      case 'tags':
        return (
          <Input
            placeholder={t('Enter') + ' ' + t(field.label) + ' (' + t('comma separated') + ')'}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value || false}
              onCheckedChange={(checked) => onUpdateSection(sectionKey, field.name, checked)}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      case 'select':
        let selectOptions = field.options;
        if (field.options === 'dynamic_categories') {
          const categories = templateConfig.sections?.[sectionKey]?.categories || [];
          selectOptions = categories.map((cat: any) => ({ value: cat.value, label: t(cat.label) }));
        }
        return (
          <select
            value={value || ''}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">{t('Select') + ' ' + t(field.label)}</option>
            {selectOptions?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        );
      case 'repeater':
        return (
          <div className="space-y-3">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {Array.isArray(value) && value.map((item: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    {field.fields?.map((subField: any) => (
                      <div key={subField.name} className="space-y-1">
                        <Label className="text-xs font-medium">{t(subField.label)}</Label>
                        {subField.type === 'textarea' ? (
                        <Textarea
                          value={item[subField.name] || ''}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index][subField.name] = e.target.value;
                            onUpdateSection(sectionKey, field.name, newItems);
                          }}
                          className="min-h-[60px]"
                        />
                      ) : subField.type === 'select' ? (
                        <select
                          value={item[subField.name] || ''}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index][subField.name] = e.target.value;
                            onUpdateSection(sectionKey, field.name, newItems);
                          }}
                          className="w-full p-2 border rounded-md bg-background"
                        >
                          <option value="">{t('Select') + ' ' + t(subField.label)}</option>
                          {(() => {
                            let options = subField.options;
                            if (subField.options === 'dynamic_categories') {
                              const categories = templateConfig.sections?.[sectionKey]?.categories || [];
                              options = categories.map((cat: any) => ({ value: cat.value, label: t(cat.label) }));
                            }
                            return options?.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {t(option.label)}
                              </option>
                            ));
                          })()}
                        </select>
                      ) : subField.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item[subField.name] || false}
                            onCheckedChange={(checked) => {
                              const newItems = [...value];
                              newItems[index][subField.name] = checked;
                              onUpdateSection(sectionKey, field.name, newItems);
                            }}
                          />
                          <span className="text-sm">{subField.label}</span>
                        </div>
                      ) : subField.type === 'file' ? (
                        <MediaPicker
                          value={getImageDisplayUrl(item[subField.name] || '')}
                          onChange={(url) => {
                            const newItems = [...value];
                            newItems[index][subField.name] = convertUrlToRelativePath(url);
                            onUpdateSection(sectionKey, field.name, newItems);
                          }}
                          placeholder={t('Select') + ' ' + t(subField.label) + '...'}
                          showPreview={true}
                        />
                      ) : (
                        <Input
                          type={subField.type}
                          value={item[subField.name] || ''}
                          onChange={(e) => {
                            const newItems = [...value];
                            newItems[index][subField.name] = e.target.value;
                            onUpdateSection(sectionKey, field.name, newItems);
                          }}
                        />
                      )}
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => {
                        const newItems = value.filter((_: any, i: number) => i !== index);
                        onUpdateSection(sectionKey, field.name, newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Button 
              type="button"
              className="w-full"
              onClick={() => {
                const items = Array.isArray(value) ? value : [];
                const newItem = {};
                field.fields?.forEach((f: any) => newItem[f.name] = '');
                onUpdateSection(sectionKey, field.name, [...items, newItem]);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("Add")} {field.label}
            </Button>
          </div>
        );
      case 'multiselect':
        return (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 mb-2">{t("Select multiple options (comma-separated values will be stored)")}:</div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {field.options?.map((option: any) => {
                const selectedValues = (value || '').split(',').map((v: string) => v.trim());
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Switch
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        let newValues = selectedValues.filter(v => v !== option.value);
                        if (checked) {
                          newValues.push(option.value);
                        }
                        onUpdateSection(sectionKey, field.name, newValues.filter(v => v).join(','));
                      }}
                    />
                    <span className="text-xs">{t(option.label)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'file':
        return (
          <MediaPicker
            value={getImageDisplayUrl(value)}
            onChange={(url) => onUpdateSection(sectionKey, field.name, convertUrlToRelativePath(url))}
            placeholder={t('Select') + ' ' + t(field.label) + '...'}
            showPreview={true}
          />
        );
      case 'time':
        return (
          <Input
            type="time"
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={t('Enter') + ' ' + t(field.label)}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'email':
        return (
          <Input
            type="email"
            placeholder={t('Enter') + ' ' + t(field.label)}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'tel':
        return (
          <Input
            type="tel"
            placeholder={t('Enter') + ' ' + t(field.label)}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            placeholder={t('Enter') + ' ' + t(field.label)}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
      case 'color':
        return (
          <div className="flex space-x-2">
            <Input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
              className="w-16 h-8"
            />
            <Input
              type="text"
              value={value || ''}
              onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
              placeholder="#000000"
            />
          </div>
        );
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              value={value || field.min || 0}
              onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">{value || field.min || 0}</div>
          </div>
        );
      default:
        return (
          <Input
            type={field.type || 'text'}
            placeholder={t('Enter') + ' ' + t(field.label)}
            value={value}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {/* Draggable Active Sections */}
              {sectionConfigs.filter(c => c.enabled && !['pixels', 'seo'].includes(c.key)).map((config, index) => {
                const isExpanded = expandedSections.has(config.key);

                return (
                  <Draggable key={config.key} draggableId={config.key} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-md ${snapshot.isDragging ? 'shadow-md' : ''}`}
                      >
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50">
                          <div className="flex items-center">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing p-1 mr-1"
                            >
                              <GripVertical className="h-3 w-3 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium">{t(config.name)}</span>
                            {config.required && (
                              <span className="text-xs text-red-500 ml-1">*</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0" 
                              onClick={() => toggleSection(config.key)}
                            >
                              <Edit className="h-3 w-3 text-blue-500" />
                            </Button>
                            
                            {!config.required && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0" 
                                onClick={() => handleSectionToggle(config.key, false)}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-2 space-y-2 border-t">
                            <div className="space-y-3">
                              {config.fields.map((field: any) => (
                                <div key={field.name} className={`space-y-1 ${field.type === 'repeater' ? 'col-span-full' : ''}`}>
                                  <div className="flex items-center">
                                    <Label htmlFor={field.name} className="text-sm font-medium">
                                      {t(field.label)}
                                    </Label>
                                    {field.required && (
                                      <span className="text-xs text-red-500 ml-1">*</span>
                                    )}
                                  </div>
                                  {renderField(config.key, field)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Fixed Sections (pixels, seo) - Always at the end */}
      {sectionConfigs.filter(c => c.enabled && ['pixels', 'seo'].includes(c.key)).map((config) => {
        const isExpanded = expandedSections.has(config.key);

        return (
          <div key={config.key} className="border rounded-md">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center">
                <div className="p-1 mr-1">
                  <GripVertical className="h-3 w-3 text-gray-300 opacity-50" />
                </div>
                <span className="text-sm font-medium">{t(config.name)}</span>
                {config.required && (
                  <span className="text-xs text-red-500 ml-1">*</span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => toggleSection(config.key)}
                >
                  <Edit className="h-3 w-3 text-blue-500" />
                </Button>
                
                {!config.required && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => handleSectionToggle(config.key, false)}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="p-2 space-y-2 border-t">
                <div className="space-y-3">
                  {config.fields.map((field: any) => (
                    <div key={field.name} className={`space-y-1 ${field.type === 'repeater' ? 'col-span-full' : ''}`}>
                      <div className="flex items-center">
                        <Label htmlFor={field.name} className="text-sm font-medium">
                          {t(field.label)}
                        </Label>
                        {field.required && (
                          <span className="text-xs text-red-500 ml-1">*</span>
                        )}
                      </div>
                      {renderField(config.key, field)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Disabled Sections */}
      {sectionConfigs.filter(c => !c.enabled).length > 0 && (
        <div className="mt-3">
          <div className="flex items-center mb-1">
            <Badge variant="outline" className="text-xs py-0 px-1 h-5 mr-2">
              {sectionConfigs.filter(c => !c.enabled).length}
            </Badge>
            <span className="text-sm text-gray-500">{t("Disabled sections")}</span>
          </div>
          <div className="flex flex-wrap gap-1 border-t pt-2">
            {sectionConfigs.filter(c => !c.enabled).map((config) => (
              <Button
                key={config.key}
                variant="outline"
                size="sm"
                className="h-7 text-sm flex items-center gap-1 px-2"
                onClick={() => handleSectionToggle(config.key, true)}
              >
                <Plus className="h-3 w-3" />
                {t(config.name)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}