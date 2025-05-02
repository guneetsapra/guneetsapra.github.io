import { useEffect, useRef } from "react";
import { useAdBlocker } from "@/hooks/useAdBlocker";

interface WebViewProps {
  url: string;
}

export default function WebView({ url }: WebViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { adBlockingEnabled, blockingLevel } = useAdBlocker();
  
  useEffect(() => {
    // Real implementation would inject content scripts or use a more
    // sophisticated approach for ad-blocking in the iframe content
    const iframe = iframeRef.current;
    if (!iframe || !url) return;
    
    // Update iframe src when URL changes
    iframe.src = url;
    
    // Apply ad blocking if enabled
    if (adBlockingEnabled && iframe.contentWindow) {
      // This is just for illustration - in a real implementation
      // you would use a more robust approach to inject ad-blocking code
      // into the iframe content
      try {
        iframe.addEventListener('load', () => {
          if (iframe.contentDocument) {
            // Example of a very simple ad blocker implementation
            // In a real app, this would be much more sophisticated
            const adElements = iframe.contentDocument.querySelectorAll(
              '[id*="ad"],[class*="ad"],[id*="banner"],[class*="banner"]'
            );
            
            adElements.forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
          }
        });
      } catch (error) {
        console.error("Error applying ad blocking:", error);
      }
    }
  }, [url, adBlockingEnabled, blockingLevel]);
  
  if (!url) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center">
        <p className="text-neutral-500">Enter a URL to start browsing</p>
      </div>
    );
  }
  
  return (
    <iframe
      ref={iframeRef}
      src={url}
      className="h-full w-full border-none"
      title="Web content"
      sandbox="allow-same-origin allow-scripts allow-forms"
      referrerPolicy="no-referrer"
    />
  );
}
