import { useEffect } from 'react';

/**
 * Custom hook to remove third-party branding elements from the application.
 * This hook monitors the DOM and removes any elements containing branding patterns.
 * 
 * @example
 * ```tsx
 * function App() {
 *   useRemoveBranding();
 *   return <div>Your app content</div>;
 * }
 * ```
 */
export const useRemoveBranding = () => {
  useEffect(() => {
    const removeBranding = () => {
      // Patterns to search for in branding elements
      const patterns = [
        'lovable',
        'built with',
        'powered by'
      ];
      
      // Specific selectors to target branding elements
      const selectors = [
        '[class*="lovable"]',
        '[class*="Lovable"]',
        '[id*="lovable"]',
        '[id*="Lovable"]',
        'div[style*="z-index: 9999"]',
        'iframe[title*="lovable" i]',
        'iframe[src*="lovable" i]',
        'div[class^="built-with"]',
        'div[data-lovable]'
      ];
      
      // Remove elements matching selectors
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            const element = el as HTMLElement;
            element.style.display = 'none';
            element.remove();
          });
        } catch (error) {
          // Silently fail if selector is invalid
        }
      });
      
      // Check all divs and iframes for pattern matches
      document.querySelectorAll('div, iframe').forEach(el => {
        const element = el as HTMLElement;
        const text = element.innerText?.toLowerCase() || '';
        const title = element.getAttribute('title')?.toLowerCase() || '';
        const className = element.className?.toLowerCase() || '';
        const id = element.id?.toLowerCase() || '';
        
        const shouldRemove = patterns.some(pattern => 
          text.includes(pattern) || 
          title.includes(pattern) || 
          className.includes(pattern) ||
          id.includes(pattern)
        );
        
        if (shouldRemove) {
          element.style.display = 'none';
          element.remove();
        }
      });
    };

    // Run immediately on mount
    removeBranding();

    // Monitor DOM changes using MutationObserver
    const observer = new MutationObserver(removeBranding);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id', 'style']
    });

    // Periodic check as fallback (every 500ms)
    const interval = setInterval(removeBranding, 500);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);
};
