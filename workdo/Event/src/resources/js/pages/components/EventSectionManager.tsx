import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MediaPicker from '@/components/MediaPicker';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult 
} from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Edit,
  Plus,
  Trash2
} from 'lucide-react';
import { Repeater } from '@/components/ui/repeater';
import { useTranslation } from 'react-i18next';

interface Section {
  key: string;
  name: string;
  fields: Field[];
  required: boolean;
}

interface Field {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  fields?: Field[];
}

interface SectionConfig {
  key: string;
  name: string;
  enabled: boolean;
  order: number;
  fields: any[];
  required: boolean;
}

interface Props {
  sections: Section[];
  templateConfig: {
    sections: any;
    sectionSettings: any;
  };
  onUpdateSection: (section: string, field: string, value: any) => void;
  onToggleSection: (sectionKey: string, enabled: boolean) => void;
  onReorderSections: (sections: any[]) => void;
  planFeatures?: any;
  isSuperAdmin?: boolean;
}

export default function EventSectionManager({
  sections,
  templateConfig,
  onUpdateSection,
  onToggleSection,
  onReorderSections,
  planFeatures,
  isSuperAdmin
}: Props) {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['event_info']));
  const [sectionConfigs, setSectionConfigs] = useState<SectionConfig[]>(() => {
    return sections.map((section, index) => ({
      key: section.key,
      name: section.name,
      enabled: templateConfig.sectionSettings?.[section.key]?.enabled ?? true,
      order: templateConfig.sectionSettings?.[section.key]?.order ?? index,
      fields: section.fields,
      required: section.required
    })).sort((a, b) => a.order - b.order);
  });

  React.useEffect(() => {
    setSectionConfigs(sections.map((section, index) => ({
      key: section.key,
      name: section.name,
      enabled: templateConfig.sectionSettings?.[section.key]?.enabled ?? true,
      order: templateConfig.sectionSettings?.[section.key]?.order ?? index,
      fields: section.fields,
      required: section.required
    })).sort((a, b) => a.order - b.order));
  }, [templateConfig.sectionSettings, sections]);

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
    onToggleSection(sectionKey, enabled);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sectionConfigs.filter(c => c.enabled));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setSectionConfigs(prev => {
      const disabled = prev.filter(c => !c.enabled);
      return [...updatedItems, ...disabled].sort((a, b) => {
        if (a.enabled && !b.enabled) return -1;
        if (!a.enabled && b.enabled) return 1;
        return a.order - b.order;
      });
    });

    onReorderSections(updatedItems);
  };

  const renderField = (field: Field, sectionKey: string, value: any) => {
    const fieldValue = value || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            type={field.type}
            value={fieldValue}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="h-8 text-sm"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={fieldValue}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="text-sm"
            rows={3}
          />
        );
      
      case 'date':
      case 'time':
        return (
          <Input
            type={field.type}
            value={fieldValue}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            className="h-8 text-sm"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={fieldValue}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="h-8 text-sm"
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={fieldValue || false}
              onCheckedChange={(checked) => onUpdateSection(sectionKey, field.name, checked)}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      
      case 'select':
        return (
          <select
            value={fieldValue || ''}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'file':
        return (
          <MediaPicker
            value={fieldValue}
            onChange={(url) => onUpdateSection(sectionKey, field.name, url)}
            placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
            showPreview={true}
          />
        );
      
      case 'repeater': {
        const repeaterFields = field.fields?.map((subField: any) => ({
          ...subField,
          type: subField.type === 'checkbox' ? 'switch' : subField.type,
          placeholder: subField.placeholder || `Enter ${subField.label.toLowerCase()}`
        })) || [];
        return (
          <Repeater
            fields={repeaterFields}
            value={Array.isArray(fieldValue) ? fieldValue : []}
            onChange={(newValue) => onUpdateSection(sectionKey, field.name, newValue)}
            addButtonText={`${t('Add')} ${field.label}`}
            maxItems={-1}
            removeButtonText=""
          />
        );
      }
      
      default:
        return (
          <Input
            value={fieldValue}
            onChange={(e) => onUpdateSection(sectionKey, field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="h-8 text-sm"
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
              {sectionConfigs.filter(c => c.enabled).map((config, index) => {
                const isExpanded = expandedSections.has(config.key);
                const sectionData = templateConfig.sections[config.key] || {};

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
                            <span className="text-sm font-medium">{config.name}</span>
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
                                <div key={field.name} className={field.type === 'textarea' || field.type === 'repeater' ? 'md:col-span-2' : ''}>
                                  <Label className="text-sm mb-1 block">{field.label}</Label>
                                  {renderField(field, config.key, sectionData[field.name])}
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
                {config.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}