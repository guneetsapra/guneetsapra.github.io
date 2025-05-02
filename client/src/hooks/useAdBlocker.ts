import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { WhitelistedSite, BrowserSettings, AdBlockingStatistics } from "@shared/schema";
import { isAdDomain } from "@/lib/adBlocker";

const DEFAULT_SETTINGS: BrowserSettings = {
  adBlockingEnabled: true,
  blockingLevel: 2,
  clearDataOnExit: false,
  blockPopups: true,
  doNotTrack: true,
};

export function useAdBlocker() {
  const [adBlockingEnabled, setAdBlockingEnabled] = useState(
    localStorage.getItem("adBlockingEnabled") === "false" ? false : true
  );
  
  const [blockingLevel, setBlockingLevel] = useState<1 | 2 | 3>(
    Number(localStorage.getItem("blockingLevel") || "2") as 1 | 2 | 3
  );
  
  const [settings, setSettings] = useState<BrowserSettings>(() => {
    const savedSettings = localStorage.getItem("browserSettings");
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [adStats, setAdStats] = useState<AdBlockingStatistics>({
    adsBlocked: 0,
    trackersBlocked: 0,
    totalBlocked: 0,
    topBlockedDomains: [],
  });
  
  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("browserSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("adBlockingEnabled", String(adBlockingEnabled));
    localStorage.setItem("blockingLevel", String(blockingLevel));
    localStorage.setItem("browserSettings", JSON.stringify(settings));
  }, [adBlockingEnabled, blockingLevel, settings]);
  
  // Fetch whitelist from API
  const { data: whitelistedSites = [] } = useQuery<WhitelistedSite[]>({
    queryKey: ['/api/whitelist'],
  });
  
  // Fetch ad stats from API
  const { data: fetchedAdStats } = useQuery<AdBlockingStatistics>({
    queryKey: ['/api/adstats'],
    enabled: adBlockingEnabled,
  });
  
  // Update local ad stats when fetched data changes
  useEffect(() => {
    if (fetchedAdStats) {
      setAdStats(fetchedAdStats);
    }
  }, [fetchedAdStats]);
  
  // Reset ad stats mutation
  const resetStatsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/adstats/reset", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/adstats'] });
      setAdStats({
        adsBlocked: 0,
        trackersBlocked: 0,
        totalBlocked: 0,
        topBlockedDomains: [],
      });
    },
  });
  
  // Function to check if a URL is whitelisted
  const checkUrlAgainstWhitelist = async (domain: string): Promise<boolean> => {
    try {
      // Check if domain or any of its parent domains are in the whitelist
      const domainParts = domain.split('.');
      
      for (let i = 0; i < domainParts.length - 1; i++) {
        const testDomain = domainParts.slice(i).join('.');
        if (whitelistedSites.some(site => site.domain === testDomain)) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error checking whitelist:", error);
      return false;
    }
  };
  
  // Function to check if a domain is an ad domain
  const checkIfAdDomain = (domain: string): boolean => {
    if (!adBlockingEnabled) return false;
    
    // Use the isAdDomain function imported from adBlocker.ts
    const isAd = isAdDomain(domain, blockingLevel);
    
    if (isAd) {
      // Track blocked ad
      const updatedStats = { ...adStats };
      updatedStats.adsBlocked += 1;
      updatedStats.totalBlocked += 1;
      
      // Update top blocked domains
      const existingDomain = updatedStats.topBlockedDomains.find(item => item.domain === domain);
      if (existingDomain) {
        existingDomain.count += 1;
      } else {
        updatedStats.topBlockedDomains.push({ domain, count: 1 });
      }
      
      // Sort top domains by count
      updatedStats.topBlockedDomains.sort((a, b) => b.count - a.count);
      
      setAdStats(updatedStats);
    }
    
    return isAd;
  };
  
  // Function to update browser settings
  const updateSettings = (newSettings: BrowserSettings) => {
    setSettings(newSettings);
    localStorage.setItem("browserSettings", JSON.stringify(newSettings));
  };
  
  // Function to reset ad stats
  const resetAdStats = async () => {
    return resetStatsMutation.mutateAsync();
  };
  
  return {
    adBlockingEnabled,
    setAdBlockingEnabled,
    blockingLevel,
    setBlockingLevel,
    settings,
    updateSettings,
    adStats,
    resetAdStats,
    checkUrlAgainstWhitelist,
    checkIfAdDomain,
    whitelistedSites
  };
}
