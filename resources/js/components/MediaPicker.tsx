import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import MediaLibraryModal from './MediaLibraryModal';
import { Image as ImageIcon, X } from 'lucide-react';
import { getImageDisplayUrl, convertUrlToRelativePath } from '@/utils/imageUrlHelper';

interface MediaPickerProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  multiple?: boolean;
  placeholder?: string;
  showPreview?: boolean;
}

export default function MediaPicker({ 
  label, 
  value = '', 
  onChange, 
  multiple = false,
  placeholder = 'Select image...',
  showPreview = true
}: MediaPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = (selectedUrl: string) => {
    onChange(convertUrlToRelativePath(selectedUrl));
  };

  const handleClear = () => {
    onChange('');
  };
  
  // Ensure value is always a string, never null
  const safeValue = value || '';
  
  const imageUrls = safeValue ? [getImageDisplayUrl(safeValue)] : [];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      
      <div className="flex gap-2">
        <Input
          value={convertUrlToRelativePath(safeValue)}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          readOnly={multiple}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsModalOpen(true)}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Browse
        </Button>
        {safeValue && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview */}
      {showPreview && imageUrls.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            </div>
          ))}
        </div>
      )}

      <MediaLibraryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelect}
        multiple={multiple}
      />
    </div>
  );
}