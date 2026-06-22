import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';
import { ProfileField } from './themes';

interface ProfileSectionProps {
  header: any;
  onUpdate: (field: string, value: any) => void;
  profileFields: ProfileField[];
}

export default function ProfileSection({ header, onUpdate, profileFields }: ProfileSectionProps) {
  const { t } = useTranslation();
  
  // Group fields by section
  const sections = profileFields.reduce((acc, field) => {
    const section = field.section || 'General';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(field);
    return acc;
  }, {});
  
  const renderField = (field: ProfileField) => {
    switch (field.type) {
      case 'image':
        return (
          <MediaPicker
            value={header[field.name] || ''}
            onChange={(url) => onUpdate(field.name, url)}
            placeholder={t(field.placeholder || '')}
            showPreview={true}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={header[field.name] || ''}
            onChange={(e) => onUpdate(field.name, e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={field.defaultValue || t(field.placeholder || '')}
            rows={field.rows || 4}
          />
        );
      default:
        return (
          <Input
            value={header[field.name] || ''}
            onChange={(e) => onUpdate(field.name, e.target.value)}
            className="h-9 text-sm"
            placeholder={field.defaultValue || t(field.placeholder || '')}
            type={field.type}
          />
        );
    }
  };
  
  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([sectionName, fields]) => (
        <div key={sectionName} className="space-y-3">
          <Label className="text-sm font-medium mb-3 block">{t(sectionName)}</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(fields as ProfileField[]).map((field) => (
              <div key={field.name} className={`${field.cols === 2 ? 'md:col-span-2' : ''}`}>
                <Label className="text-sm mb-1 block">{t(field.label)}</Label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}