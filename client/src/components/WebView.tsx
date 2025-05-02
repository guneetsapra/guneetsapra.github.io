import { useEffect, useRef } from "react";
import { useAdBlocker } from "@/hooks/useAdBlocker";

interface WebViewProps {
  url: string;
}

export default function WebView({ url }: WebViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { adBlockingEnabled, blockingLevel } = useAdBlocker();
  
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !url) return;
    
    // Only update the src if it's different to prevent unnecessary reloads
    if (iframe.src !== url && url !== "") {
      iframe.src = url;
    }
    
    // Apply ad blocking if enabled
    if (adBlockingEnabled && iframe.contentWindow) {
      try {
        const handleIframeLoad = () => {
          if (iframe.contentDocument) {
            // Example of a very simple ad blocker implementation
            const adElements = iframe.contentDocument.querySelectorAll(
              '[id*="ad"],[class*="ad"],[id*="banner"],[class*="banner"]'
            );
            
            adElements.forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
          }
        };
        
        iframe.addEventListener('load', handleIframeLoad);
        
        return () => {
          iframe.removeEventListener('load', handleIframeLoad);
        };
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
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-presentation"
      referrerPolicy="no-referrer"
      allow="autoplay; camera; microphone; fullscreen; encrypted-media; picture-in-picture; web-share; midi; geolocation"
    />
  );
}
