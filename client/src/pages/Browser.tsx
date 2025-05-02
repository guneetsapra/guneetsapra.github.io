import { useState } from "react";
import TabBar from "@/components/TabBar";
import NavigationBar from "@/components/NavigationBar";
import BrowserContent from "@/components/BrowserContent";
import StatusBar from "@/components/StatusBar";
import AdBlockingStats from "@/components/AdBlockingStats";
import { useBrowser } from "@/hooks/useBrowser";
import { useAdBlocker } from "@/hooks/useAdBlocker";
import { useLocation } from "wouter";

export default function Browser() {
  const [location, setLocation] = useLocation();
  const [showAdBlockStats, setShowAdBlockStats] = useState(false);
  
  const {
    tabs,
    activeTab,
    currentUrl,
    setCurrentUrl,
    addTab,
    closeTab,
    activateTab,
    handleGoBack,
    handleGoForward,
    handleRefresh,
    navigationHistory,
    handleNavigate
  } = useBrowser();
  
  const {
    adBlockingEnabled,
    blockingLevel,
    adStats,
    checkUrlAgainstWhitelist,
    whitelistedSites
  } = useAdBlocker();
  
  const handleUrlSubmit = async (url: string) => {
    // Prepend http:// if it's not present
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `http://${formattedUrl}`;
    }
    
    try {
      // Extract domain from URL
      const urlObj = new URL(formattedUrl);
      const domain = urlObj.hostname;
      
      // Check if domain is whitelisted
      const isWhitelisted = await checkUrlAgainstWhitelist(domain);
      
      if (isWhitelisted) {
        setCurrentUrl(formattedUrl);
        handleNavigate(formattedUrl);
      } else {
        // Navigate to blocked page with the attempted URL as state
        setLocation(`/blocked?url=${encodeURIComponent(formattedUrl)}`);
      }
    } catch (error) {
      console.error("Invalid URL:", error);
    }
  };
  
  return (
    <>
      <TabBar 
        tabs={tabs}
        onAddTab={addTab}
        onCloseTab={closeTab}
        onActivateTab={activateTab}
        onOpenSettings={() => setLocation("/settings")}
      />
      
      <NavigationBar 
        currentUrl={currentUrl}
        onUrlSubmit={handleUrlSubmit}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        onRefresh={handleRefresh}
        canGoBack={navigationHistory.canGoBack}
        canGoForward={navigationHistory.canGoForward}
        blockedAdsCount={adStats.adsBlocked + adStats.trackersBlocked}
        onToggleAdBlockStats={() => setShowAdBlockStats(true)}
      />
      
      <BrowserContent 
        currentUrl={currentUrl}
        tabs={tabs}
        activeTab={activeTab}
      />
      
      <StatusBar 
        adBlockerActive={adBlockingEnabled}
        blockedAdsCount={adStats.adsBlocked + adStats.trackersBlocked}
        currentDomain={activeTab && activeTab.url ? new URL(activeTab.url).hostname : ""}
        isWhitelisted={activeTab && activeTab.url ? whitelistedSites.some(site => 
          site.domain === new URL(activeTab.url).hostname
        ) : false}
      />
      
      {showAdBlockStats && (
        <AdBlockingStats 
          statistics={adStats}
          onClose={() => setShowAdBlockStats(false)}
        />
      )}
    </>
  );
}
