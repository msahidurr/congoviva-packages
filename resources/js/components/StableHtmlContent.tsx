import React, { useRef, useEffect } from 'react';

interface StableHtmlContentProps {
  htmlContent: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A component that renders HTML content without causing iframe reloads
 * This component uses direct DOM manipulation to update content only when necessary
 */
export const StableHtmlContent: React.FC<StableHtmlContentProps> = ({
  htmlContent,
  className = '',
  style = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<string>('');

  useEffect(() => {
    if (!containerRef.current) return;

    // Only update DOM if content actually changed
    if (htmlContent !== lastContentRef.current) {
      containerRef.current.innerHTML = htmlContent;
      lastContentRef.current = htmlContent;
    }
  }, [htmlContent]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default StableHtmlContent;