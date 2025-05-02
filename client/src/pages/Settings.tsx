import { useState } from "react";
import { useLocation } from "wouter";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdBlocker } from "@/hooks/useAdBlocker";
import WhitelistManager from "@/components/WhitelistManager";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    adBlockingEnabled, 
    setAdBlockingEnabled,
    blockingLevel,
    setBlockingLevel,
    adStats,
    resetAdStats,
    settings,
    updateSettings
  } = useAdBlocker();

  const handleBlockingLevelChange = (value: number[]) => {
    setBlockingLevel(value[0] as 1 | 2 | 3);
  };

  const handleResetStats = async () => {
    try {
      await resetAdStats();
      toast({
        title: "Success",
        description: "Ad blocking statistics have been reset",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset statistics",
        variant: "destructive",
      });
    }
  };

  const handleClearBrowsingData = () => {
    // Implementation would clear local storage/cookies etc.
    toast({
      title: "Success",
      description: "Browsing data has been cleared",
    });
  };

  const blockingLevelLabels = ["Basic", "Balanced", "Aggressive"];

  return (
    <div className="h-full w-full bg-neutral-100 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium text-neutral-900">Browser Settings</h1>
          <Button
            variant="outline"
            className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900 border-0"
            onClick={() => setLocation("/")}
          >
            <span className="material-icons mr-2">arrow_back</span>
            Back to Browser
          </Button>
        </div>
        
        {/* Ad Blocking Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Ad Blocking</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-neutral-900">Enable Ad Blocking</p>
              <p className="text-sm text-neutral-500">Block known ad networks and trackers</p>
            </div>
            <Switch
              checked={adBlockingEnabled}
              onCheckedChange={setAdBlockingEnabled}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-neutral-900">Blocking Level</p>
              <span className="text-sm font-medium text-primary">
                {blockingLevelLabels[blockingLevel - 1]}
              </span>
            </div>
            <Slider
              defaultValue={[blockingLevel]}
              min={1}
              max={3}
              step={1}
              onValueChange={handleBlockingLevelChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>Basic</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>
          </div>
          
          <div className="bg-neutral-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-neutral-900 font-medium">Ad Blocking Statistics</p>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={handleResetStats}
              >
                Reset
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-500 text-sm">Ads Blocked Today</p>
                <p className="text-neutral-900 text-xl font-medium">{adStats.adsBlocked}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-sm">Trackers Blocked Today</p>
                <p className="text-neutral-900 text-xl font-medium">{adStats.trackersBlocked}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Whitelist Settings */}
        <WhitelistManager />
        
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Browser Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-900">Clear browsing data on exit</p>
                <p className="text-sm text-neutral-500">Automatically clear history when browser closes</p>
              </div>
              <Switch
                checked={settings.clearDataOnExit}
                onCheckedChange={(checked) => updateSettings({ ...settings, clearDataOnExit: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-900">Block popups</p>
                <p className="text-sm text-neutral-500">Prevent websites from opening popup windows</p>
              </div>
              <Switch
                checked={settings.blockPopups}
                onCheckedChange={(checked) => updateSettings({ ...settings, blockPopups: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-900">Do Not Track</p>
                <p className="text-sm text-neutral-500">Request websites not to track browsing behavior</p>
              </div>
              <Switch
                checked={settings.doNotTrack}
                onCheckedChange={(checked) => updateSettings({ ...settings, doNotTrack: checked })}
              />
            </div>
            
            <div className="pt-4 border-t border-neutral-200">
              <Button
                className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900"
                onClick={handleClearBrowsingData}
              >
                Clear Browsing Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
