import React from 'react';
import { Label } from '@/components/ui/label';
import { getTheme } from './themes';
import { useTranslation } from 'react-i18next';

interface ThemeSelectorProps {
  themeType: string;
  currentPreset: number;
  onPresetChange: (preset: number) => void;
}

export default function ThemeSelector({ themeType, currentPreset, onPresetChange }: ThemeSelectorProps) {
  const { t } = useTranslation();
  const theme = getTheme(themeType);
  
  return (
    <div className="space-y-3">
      <Label className="text-sm mb-1 block">{t("Color Presets")}</Label>
      <div className="grid grid-cols-5 gap-2">
        {theme.colorPresets.map((preset, index) => {
          // Create a preview of the preset
          const previewStyle = {
            background: preset.background.type === 'gradient' 
              ? preset.background.gradient 
              : preset.background.color,
            border: currentPreset === index ? '2px solid #3B82F6' : '1px solid #E2E8F0'
          };
          
          return (
            <button
              key={index}
              type="button"
              className="h-12 rounded-md overflow-hidden relative"
              style={previewStyle}
              onClick={() => onPresetChange(index)}
            >
              {/* Button preview */}
              <div 
                className="absolute bottom-1 left-1 right-1 h-4 rounded-sm"
                style={{ 
                  backgroundColor: preset.buttonColor,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              />
              
              {/* Selection indicator */}
              {currentPreset === index && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}