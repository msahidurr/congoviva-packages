/**
 * Utility functions for calculating optimal scroll thresholds and layouts
 * for media display components
 */

export interface LayoutConfig {
  columns: number;
  scrollThreshold: number;
  maxHeight: string;
  description: string;
}

export const LAYOUT_PRESETS: Record<string, LayoutConfig> = {
  // Standard grid layouts
  compact: {
    columns: 8,
    scrollThreshold: 16, // 2 rows
    maxHeight: 'h-64',
    description: 'Compact view with 8 columns'
  },
  
  standard: {
    columns: 6,
    scrollThreshold: 12, // 2 rows
    maxHeight: 'h-96',
    description: 'Standard grid with 6 columns'
  },
  
  gallery: {
    columns: 4,
    scrollThreshold: 8, // 2 rows
    maxHeight: 'h-80',
    description: 'Gallery view with 4 columns'
  },
  
  large: {
    columns: 3,
    scrollThreshold: 6, // 2 rows
    maxHeight: 'h-96',
    description: 'Large thumbnails with 3 columns'
  },
  
  // Mobile-friendly layouts
  mobile: {
    columns: 2,
    scrollThreshold: 4, // 2 rows
    maxHeight: 'h-64',
    description: 'Mobile view with 2 columns'
  }
};

/**
 * Calculate optimal scroll threshold based on columns and desired visible rows
 */
export function calculateScrollThreshold(columns: number, visibleRows: number = 2): number {
  return columns * visibleRows;
}

/**
 * Get layout configuration based on screen size or preference
 */
export function getLayoutConfig(
  screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop',
  preference: 'compact' | 'standard' | 'large' = 'standard'
): LayoutConfig {
  if (screenSize === 'mobile') {
    return LAYOUT_PRESETS.mobile;
  }
  
  if (screenSize === 'tablet') {
    return LAYOUT_PRESETS.gallery;
  }
  
  // Desktop layouts
  switch (preference) {
    case 'compact':
      return LAYOUT_PRESETS.compact;
    case 'large':
      return LAYOUT_PRESETS.large;
    default:
      return LAYOUT_PRESETS.standard;
  }
}

/**
 * Determine if scrolling should be enabled based on item count and threshold
 */
export function shouldEnableScroll(itemCount: number, threshold: number): boolean {
  return itemCount > threshold;
}

/**
 * Calculate grid classes for Tailwind CSS
 */
export function getGridClasses(columns: number): string {
  const gridColsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12'
  };
  
  return gridColsMap[columns] || 'grid-cols-6';
}

/**
 * Generate scroll indicator text
 */
export function getScrollIndicatorText(
  totalItems: number, 
  visibleItems: number,
  showDetails: boolean = true
): string {
  if (!showDetails) {
    return 'Scroll to see more items';
  }
  
  return `Scroll to see more items (${totalItems} total, showing ${visibleItems} per view)`;
}

/**
 * Responsive layout hook helper
 */
export function getResponsiveLayout(width: number): LayoutConfig {
  if (width < 640) { // Mobile
    return LAYOUT_PRESETS.mobile;
  } else if (width < 1024) { // Tablet
    return LAYOUT_PRESETS.gallery;
  } else if (width < 1280) { // Desktop
    return LAYOUT_PRESETS.standard;
  } else { // Large desktop
    return LAYOUT_PRESETS.compact;
  }
}

/**
 * Calculate optimal item size based on container width and columns
 */
export function calculateItemSize(
  containerWidth: number, 
  columns: number, 
  gap: number = 12
): number {
  const totalGapWidth = (columns - 1) * gap;
  const availableWidth = containerWidth - totalGapWidth;
  return Math.floor(availableWidth / columns);
}

/**
 * Validate layout configuration
 */
export function validateLayoutConfig(config: Partial<LayoutConfig>): LayoutConfig {
  const defaults = LAYOUT_PRESETS.standard;
  
  return {
    columns: Math.max(1, Math.min(12, config.columns || defaults.columns)),
    scrollThreshold: Math.max(1, config.scrollThreshold || defaults.scrollThreshold),
    maxHeight: config.maxHeight || defaults.maxHeight,
    description: config.description || defaults.description
  };
}