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

interface Props {
  sections: any[];
  configSections: any;
  onConfigChange: (config: any) => void;
}

export default function MenuSectionManager({
  sections,
  configSections,
  onConfigChange
}: Props) {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['menu_info']));
  const [sectionConfigs, setSectionConfigs] = useState(() => {
    return sections.map((section, index) => ({
      key: section.key,
      name: section.name,
      enabled: configSections?.[section.key]?.enabled ?? true,
      order: configSections?.[section.key]?.order ?? index,
      fields: section.fields,
      required: section.required
    })).sort((a, b) => a.order - b.order);
  });

  React.useEffect(() => {
    setSectionConfigs(sections.map((section, index) => ({
      key: section.key,
      name: section.name,
      enabled: configSections?.[section.key]?.enabled ?? true,
      order: configSections?.[section.key]?.order ?? index,
      fields: section.fields,
      required: section.required
    })).sort((a, b) => a.order - b.order));
  }, [configSections, sections]);

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
    
    const newConfig = {
      ...configSections,
      [sectionKey]: {
        ...configSections[sectionKey],
        enabled,
        order: configSections[sectionKey]?.order || 0
      }
    };
    onConfigChange(newConfig);
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

    const newConfig = { ...configSections };
    updatedItems.forEach((item, index) => {
      newConfig[item.key] = {
        ...newConfig[item.key],
        order: index
      };
    });
    onConfigChange(newConfig);
  };

  const updateSectionData = (sectionKey: string, fieldKey: string, value: any) => {
    const newConfig = {
      ...configSections,
      [sectionKey]: {
        ...configSections[sectionKey],
        [fieldKey]: value
      }
    };
    onConfigChange(newConfig);
  };

  const addArrayItem = (sectionKey: string, fieldKey: string) => {
    const currentArray = configSections[sectionKey]?.[fieldKey] || [];
    updateSectionData(sectionKey, fieldKey, [...currentArray, {}]);
  };

  const removeArrayItem = (sectionKey: string, fieldKey: string, index: number) => {
    const currentArray = configSections[sectionKey]?.[fieldKey] || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    updateSectionData(sectionKey, fieldKey, newArray);
  };

  const updateArrayItem = (sectionKey: string, fieldKey: string, index: number, itemKey: string, value: any) => {
    const currentArray = configSections[sectionKey]?.[fieldKey] || [];
    const newArray = [...currentArray];
    newArray[index] = { ...newArray[index], [itemKey]: value };
    updateSectionData(sectionKey, fieldKey, newArray);
  };

  const renderField = (field: any, sectionKey: string, value: any) => {
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
            onChange={(e) => updateSectionData(sectionKey, field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="h-8 text-sm"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={fieldValue}
            onChange={(e) => updateSectionData(sectionKey, field.name, e.target.value)}
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
            onChange={(e) => updateSectionData(sectionKey, field.name, e.target.value)}
            className="h-8 text-sm"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={fieldValue}
            onChange={(e) => updateSectionData(sectionKey, field.name, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="h-8 text-sm"
          />
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={fieldValue || false}
              onCheckedChange={(checked) => updateSectionData(sectionKey, field.name, checked)}
            />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      
      case 'select':
        return (
          <select
            value={fieldValue || ''}
            onChange={(e) => updateSectionData(sectionKey, field.name, e.target.value)}
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
            onChange={(url) => updateSectionData(sectionKey, field.name, url)}
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
            onChange={(newValue) => updateSectionData(sectionKey, field.name, newValue)}
            addButtonText={`${t('Add')} ${field.label}`}
            maxItems={-1}
            removeButtonText=""
          />
        );
      }

      case 'array':
        const arrayValue = fieldValue || [];
        return (
          <div className="space-y-3">
            {arrayValue.map((item: any, index: number) => (
              <Card key={index} className="p-3">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{field.label} #{index + 1}</span>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-7 w-7 p-0"
                      onClick={() => removeArrayItem(sectionKey, field.name, index)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </Button>
                  </div>
                  
                  {field.fields?.map((subField: any) => (
                    <div key={subField.name}>
                      <Label className="text-xs mb-1 block">{subField.label}</Label>
                      {subField.type === 'textarea' ? (
                        <Textarea
                          value={item[subField.name] || ''}
                          onChange={(e) => updateArrayItem(sectionKey, field.name, index, subField.name, e.target.value)}
                          placeholder={subField.placeholder || `Enter ${subField.label.toLowerCase()}`}
                          className="text-sm"
                          rows={2}
                        />
                      ) : subField.type === 'checkbox' ? (
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={item[subField.name] || false}
                            onCheckedChange={(checked) => updateArrayItem(sectionKey, field.name, index, subField.name, checked)}
                          />
                          <span className="text-sm">{subField.label}</span>
                        </div>
                      ) : subField.type === 'file' ? (
                        <MediaPicker
                          value={item[subField.name] || ''}
                          onChange={(url) => updateArrayItem(sectionKey, field.name, index, subField.name, url)}
                          placeholder={subField.placeholder || `Select ${subField.label.toLowerCase()}`}
                          showPreview={true}
                        />
                      ) : (
                        <Input
                          type={subField.type || 'text'}
                          value={item[subField.name] || ''}
                          onChange={(e) => updateArrayItem(sectionKey, field.name, index, subField.name, e.target.value)}
                          className="h-8 text-sm"
                          placeholder={subField.placeholder || `Enter ${subField.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            <Button 
              type="button" 
              className="w-full"
              onClick={() => addArrayItem(sectionKey, field.name)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              {t('Add')} {field.label}
            </Button>
          </div>
        );
      
      default:
        return (
          <Input
            value={fieldValue}
            onChange={(e) => updateSectionData(sectionKey, field.name, e.target.value)}
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
                const sectionData = configSections[config.key] || {};

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
                                <div key={field.name}>
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