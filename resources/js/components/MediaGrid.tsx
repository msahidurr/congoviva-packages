import React from 'react';
import { Check } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { useConditionalScroll } from '@/hooks/useConditionalScroll';

interface MediaItem {
  id: number;
  name: string;
  file_name: string;
  url: string;
  thumb_url: string;
  size: number;
  mime_type: string;
  created_at: string;
}

interface MediaGridProps {
  media: MediaItem[];
  selectedItems: string[];
  onSelect: (url: string) => void;
  scrollThreshold?: number; // Number of items before showing scroll
  maxHeight?: string; // Maximum height when scrolling
  columns?: number; // Number of columns in grid
}

export default function MediaGrid({ 
  media, 
  selectedItems, 
  onSelect, 
  scrollThreshold = 12, // Default: 2 rows of 6 items
  maxHeight = "h-96", // Default: 24rem (384px)
  columns = 6 // Default: 6 columns
}: MediaGridProps) {
  const { shouldScroll, maxHeight: scrollMaxHeight, scrollIndicatorText, gridCols } = useConditionalScroll({
    itemCount: media.length,
    threshold: scrollThreshold,
    maxHeight,
    columns
  });

  const GridContent = () => (
    <div className={`grid ${gridCols} gap-3 p-4`}>
      {media.map((item) => (
        <div
          key={item.id}
          className={`relative group cursor-pointer rounded-lg overflow-hidden transition-all hover:scale-105 ${
            selectedItems.includes(item.url) 
              ? 'ring-2 ring-primary shadow-lg' 
              : 'hover:shadow-md border border-border hover:border-primary/50'
          }`}
          onClick={() => onSelect(item.url)}
        >
          <div className="relative aspect-square bg-muted">
            <img
              src={item.thumb_url}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = item.url;
              }}
            />
            
            {/* Selection Indicator */}
            {selectedItems.includes(item.url) && (
              <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                  <Check className="h-4 w-4" />
                </div>
              </div>
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            
            {/* File Name Tooltip */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate" title={item.name}>
                {item.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="border rounded-lg bg-muted/10 flex flex-col">
      {shouldScroll ? (
        <ScrollArea className={scrollMaxHeight}>
          <GridContent />
        </ScrollArea>
      ) : (
        <GridContent />
      )}
      {shouldScroll && scrollIndicatorText && (
        <div className="px-4 py-2 text-xs text-muted-foreground bg-muted/20 border-t">
          {scrollIndicatorText}
        </div>
      )}
    </div>
  );
}