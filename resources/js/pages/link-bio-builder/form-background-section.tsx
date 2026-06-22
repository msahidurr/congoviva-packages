import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MediaPicker from '@/components/MediaPicker';
import { useTranslation } from 'react-i18next';
import { useThemeImages } from '@/hooks/useThemeImages';

interface BackgroundSectionProps {
  background?: {
    type?: 'color' | 'gradient' | 'image';
    color?: string;
    gradient?: string;
    image?: string;
  };
  onUpdate: (field: string, value: string) => void;
  theme?: string;
}

export default function BackgroundSection({ background, onUpdate, theme = 'personal' }: BackgroundSectionProps) {
  const { t } = useTranslation();
  const { getThemeImages } = useThemeImages();
  
  // Ensure background values are never null
  const safeBackground = {
    type: background?.type || 'color',
    color: background?.color || '#ffffff',
    gradient: background?.gradient || 'linear-gradient(135deg, #667eea, #764ba2)',
    image: background?.image || ''
  };
  
  // Get theme-specific images
  const themeImages = getThemeImages(theme);
  
  return (
    <div className="space-y-4">
      <RadioGroup 
        value={safeBackground.type} 
        onValueChange={(value) => onUpdate('type', value)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="color" id="bg-color" />
          <Label htmlFor="bg-color">{t("Solid Color")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="gradient" id="bg-gradient" />
          <Label htmlFor="bg-gradient">{t("Gradient")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="image" id="bg-image" />
          <Label htmlFor="bg-image">{t("Image")}</Label>
        </div>
      </RadioGroup>
      
      {safeBackground.type === 'color' && (
        <div>
          <Label className="text-sm mb-1 block">{t("Background Color")}</Label>
          <div className="flex">
            <Input
              type="color"
              value={safeBackground.color}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="h-9 p-1 w-16 rounded-l-md"
            />
            <Input
              type="text"
              value={safeBackground.color}
              onChange={(e) => onUpdate('color', e.target.value)}
              className="h-9 rounded-l-none flex-1"
            />
          </div>
        </div>
      )}
      
      {safeBackground.type === 'gradient' && (
        <div>
          <Label className="text-sm mb-1 block">{t("Gradient")}</Label>
          <Input
            type="text"
            value={safeBackground.gradient}
            onChange={(e) => onUpdate('gradient', e.target.value)}
            className="h-9"
            placeholder="linear-gradient(135deg, #667eea, #764ba2)"
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <button 
              type="button" 
              className="h-8 rounded-md border" 
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              onClick={() => onUpdate('gradient', 'linear-gradient(135deg, #667eea, #764ba2)')}
            />
            <button 
              type="button" 
              className="h-8 rounded-md border" 
              style={{ background: 'linear-gradient(135deg, #13547a, #80d0c7)' }}
              onClick={() => onUpdate('gradient', 'linear-gradient(135deg, #13547a, #80d0c7)')}
            />
            <button 
              type="button" 
              className="h-8 rounded-md border" 
              style={{ background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)' }}
              onClick={() => onUpdate('gradient', 'linear-gradient(135deg, #ff9a9e, #fad0c4)')}
            />
          </div>
        </div>
      )}
      
      {safeBackground.type === 'image' && (
        <div>
          <Label className="text-sm mb-1 block">{t("Background Image")}</Label>
          <MediaPicker
            value={safeBackground.image}
            onChange={(url) => onUpdate('image', url)}
            placeholder={t("Select background image")}
            showPreview={true}
          />
        </div>
      )}
    </div>
  );
}