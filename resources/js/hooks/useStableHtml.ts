import { useMemo, useRef, useEffect } from 'react';

/**
 * Custom hook to prevent iframe reloading in custom HTML content
 * This hook memoizes HTML content and only updates when the actual content changes
 */
export const useStableHtml = (htmlContent: string) => {
  const previousContent = useRef<string>('');
  const stableContent = useRef<string>('');
  
  // Only update the stable content if the HTML actually changed
  const memoizedContent = useMemo(() => {
    if (htmlContent !== previousContent.current) {
      previousContent.current = htmlContent;
      stableContent.current = htmlContent;
    }
    return stableContent.current;
  }, [htmlContent]);
  
  return memoizedContent;
};

/**
 * Custom hook to create a stable iframe container that doesn't reload
 */
export const useStableIframe = (htmlContent: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<string>('');
  
  useEffect(() => {
    if (!containerRef.current || htmlContent === lastContentRef.current) {
      return;
    }
    
    // Only update if content actually changed
    if (htmlContent !== lastContentRef.current) {
      containerRef.current.innerHTML = htmlContent;
      lastContentRef.current = htmlContent;
    }
  }, [htmlContent]);
  
  return containerRef;
};