import React, { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { useConditionalScroll } from '@/hooks/useConditionalScroll';

interface MediaItem {
  id: number;
  name: string;
  url: string;
  thumb_url: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  onItemClick?: (item: MediaItem) => void;
  scrollThreshold?: number;
  columns?: number;
  showScrollIndicator?: boolean;
}

export default function MediaGallery({
  items,
  onItemClick,
  scrollThreshold = 8, // Show scroll after 8 items for gallery view
  columns = 4, // 4 columns for gallery
  showScrollIndicator = true
}: MediaGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  const { shouldScroll, maxHeight, scrollIndicatorText, gridCols } = useConditionalScroll({
    itemCount: items.length,
    threshold: scrollThreshold,
    maxHeight: "h-80", // Smaller height for gallery
    columns
  });

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item.id);
    onItemClick?.(item);
  };

  const GalleryContent = () => (
    <div className={`grid ${gridCols} gap-4 p-4`}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
            selectedItem === item.id 
              ? 'ring-2 ring-blue-500 shadow-lg' 
              : 'hover:shadow-md border border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => handleItemClick(item)}
        >
          <div className="relative aspect-square bg-gray-100">
            <img
              src={item.thumb_url || item.url}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            
            {/* Image Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <p className="text-sm text-white truncate font-medium" title={item.name}>
                {item.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500">No media items to display</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {shouldScroll ? (
        <ScrollArea className={maxHeight}>
          <GalleryContent />
        </ScrollArea>
      ) : (
        <GalleryContent />
      )}
      
      {shouldScroll && showScrollIndicator && (
        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t flex items-center justify-between">
          <span>{scrollIndicatorText}</span>
          <span className="text-blue-600">↕ Scroll for more</span>
        </div>
      )}
    </div>
  );
}