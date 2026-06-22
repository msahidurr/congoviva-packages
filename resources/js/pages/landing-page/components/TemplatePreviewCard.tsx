import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { getBusinessTemplate } from '@/pages/vcard-builder/business-templates';


interface TemplatePreviewCardProps {
  template: {
    name: string;
    category: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
  previewButtonText?: string;
}

export default function TemplatePreviewCard({ 
  template, 
  isSelected = false, 
  onClick,
  previewButtonText = 'Preview Template'
}: TemplatePreviewCardProps) {
  const templateData = getBusinessTemplate(template.name);

  
  // Format template name for display
  const displayName = template.name ? template.name.replace(/-/g, ' ') : '';
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
  
  return (
    <>
      <div 
        className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-green-500' : 'hover:border-gray-400'}`}
        onClick={onClick}
      >
        <div className="relative pt-[80%] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
             onClick={() => {
               localStorage.setItem('vcard_preview_data', JSON.stringify({
                 business_type: template.name,
                 name: templateData?.defaultData?.header?.name || 'Business Name',
                 slug: 'preview',
                 config_sections: templateData?.defaultData || {}
               }));
               window.open(route('vcard.preview'), '_blank');
             }}>
          <img 
            src={`${(window as any).baseUrl || window.location.origin}/storage/images/business-template/${template.name}.png`}
            alt={`${template.name} template`}
            className="absolute inset-0 w-full h-full object-top object-cover hover:object-bottom transition-all duration-4000"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
            <div className="text-center p-2">
              <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-white shadow-sm flex items-center justify-center">
                <span className="text-base font-semibold" style={{ color: '#10b77f' }}>{template.name.charAt(0).toUpperCase()}</span>
              </div>
              <h4 className="text-xs font-medium capitalize mb-1 truncate">{template.name.replace(/-/g, ' ')}</h4>
              <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] capitalize" 
                    style={{ backgroundColor: '#10b77f15', color: '#10b77f' }}>
                {template.category}
              </span>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium capitalize">{capitalizedName}</h4>
            {isSelected && (
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 capitalize">{template.category}</p>
        </div>
      </div>
    </>
  );
}