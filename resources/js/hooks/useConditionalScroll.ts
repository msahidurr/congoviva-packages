import { useMemo } from 'react';

interface UseConditionalScrollOptions {
  itemCount: number;
  threshold?: number;
  maxHeight?: string;
  columns?: number;
}

interface ConditionalScrollConfig {
  shouldScroll: boolean;
  maxHeight: string;
  scrollIndicatorText: string;
  gridCols: string;
}

export function useConditionalScroll({
  itemCount,
  threshold = 12,
  maxHeight = "h-96",
  columns = 6
}: UseConditionalScrollOptions): ConditionalScrollConfig {
  return useMemo(() => {
    const shouldScroll = itemCount > threshold;
    const rowsVisible = Math.ceil(threshold / columns);
    
    return {
      shouldScroll,
      maxHeight,
      scrollIndicatorText: shouldScroll 
        ? `Scroll to see more items (${itemCount} total, showing ${threshold} per view)`
        : '',
      gridCols: `grid-cols-${columns}`
    };
  }, [itemCount, threshold, maxHeight, columns]);
}