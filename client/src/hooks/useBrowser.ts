import { useState, useEffect } from "react";
import { Tab } from "@shared/schema";
import { v4 as uuid } from "uuid";

type NavigationHistory = {
  canGoBack: boolean;
  canGoForward: boolean;
  history: string[];
  currentIndex: number;
};

export function useBrowser() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistory>({
    canGoBack: false,
    canGoForward: false,
    history: [],
    currentIndex: -1,
  });

  // Initialize with a default tab
  useEffect(() => {
    if (tabs.length === 0) {
      const defaultTab: Tab = {
        id: uuid(),
        title: "New Tab",
        url: "",
        active: true,
      };
      setTabs([defaultTab]);
      setActiveTab(defaultTab);
    }
  }, []);

  // Update tab title based on document title when URL changes
  useEffect(() => {
    if (activeTab && currentUrl) {
      // Extract domain from URL for tab title
      try {
        const domain = new URL(currentUrl).hostname.replace(/^www\./, "");
        updateTabTitle(activeTab.id, domain || "New Tab");
      } catch (error) {
        console.error("Invalid URL:", error);
      }
    }
  }, [currentUrl, activeTab]);

  const addTab = () => {
    const newTab: Tab = {
      id: uuid(),
      title: "New Tab",
      url: "",
      active: true,
    };

    setTabs(prevTabs => 
      prevTabs.map(tab => ({ ...tab, active: false })).concat(newTab)
    );
    setActiveTab(newTab);
    setCurrentUrl("");
    // Reset navigation history for new tab
    setNavigationHistory({
      canGoBack: false,
      canGoForward: false,
      history: [],
      currentIndex: -1,
    });
  };

  const closeTab = (id: string) => {
    if (tabs.length <= 1) {
      // Don't close the last tab, create a new empty one instead
      setTabs([{ id: uuid(), title: "New Tab", url: "", active: true }]);
      setCurrentUrl("");
      setNavigationHistory({
        canGoBack: false,
        canGoForward: false,
        history: [],
        currentIndex: -1,
      });
      return;
    }

    const tabToClose = tabs.find(tab => tab.id === id);
    const isActiveTab = tabToClose?.active || false;
    
    // Remove the tab
    const newTabs = tabs.filter(tab => tab.id !== id);
    
    // If we're closing the active tab, activate another one
    if (isActiveTab && newTabs.length > 0) {
      // Find the index of the closed tab
      const closedIndex = tabs.findIndex(tab => tab.id === id);
      // Activate the tab to the left, or the first tab if it was the leftmost
      const newActiveIndex = Math.max(0, closedIndex - 1);
      newTabs[newActiveIndex].active = true;
      setActiveTab(newTabs[newActiveIndex]);
      setCurrentUrl(newTabs[newActiveIndex].url);
    }
    
    setTabs(newTabs);
  };

  const activateTab = (id: string) => {
    const newTabs = tabs.map(tab => ({
      ...tab,
      active: tab.id === id,
    }));
    
    setTabs(newTabs);
    const newActiveTab = newTabs.find(tab => tab.id === id) || null;
    setActiveTab(newActiveTab);
    
    if (newActiveTab) {
      setCurrentUrl(newActiveTab.url);
    }
  };

  const updateTabTitle = (id: string, title: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === id ? { ...tab, title } : tab
      )
    );
  };

  const updateTabUrl = (id: string, url: string) => {
    setTabs(prevTabs => 
      prevTabs.map(tab => 
        tab.id === id ? { ...tab, url } : tab
      )
    );
  };

  const handleNavigate = (url: string) => {
    if (!activeTab) return;

    // Update the active tab URL
    updateTabUrl(activeTab.id, url);

    // Update navigation history
    const { history, currentIndex } = navigationHistory;
    const newHistory = [...history.slice(0, currentIndex + 1), url];
    
    setNavigationHistory({
      history: newHistory,
      currentIndex: newHistory.length - 1,
      canGoBack: newHistory.length > 1,
      canGoForward: false,
    });
  };

  const handleGoBack = () => {
    const { history, currentIndex } = navigationHistory;
    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;
    const url = history[newIndex];
    
    setCurrentUrl(url);
    if (activeTab) {
      updateTabUrl(activeTab.id, url);
    }
    
    setNavigationHistory({
      ...navigationHistory,
      currentIndex: newIndex,
      canGoBack: newIndex > 0,
      canGoForward: true,
    });
  };

  const handleGoForward = () => {
    const { history, currentIndex } = navigationHistory;
    if (currentIndex >= history.length - 1) return;

    const newIndex = currentIndex + 1;
    const url = history[newIndex];
    
    setCurrentUrl(url);
    if (activeTab) {
      updateTabUrl(activeTab.id, url);
    }
    
    setNavigationHistory({
      ...navigationHistory,
      currentIndex: newIndex,
      canGoBack: true,
      canGoForward: newIndex < history.length - 1,
    });
  };

  const handleRefresh = () => {
    // Just trigger a re-render of the iframe
    if (activeTab) {
      const currentUrl = activeTab.url;
      updateTabUrl(activeTab.id, "");
      setTimeout(() => {
        updateTabUrl(activeTab.id, currentUrl);
      }, 100);
    }
  };

  return {
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
  };
}
