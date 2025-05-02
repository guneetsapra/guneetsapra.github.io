import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BlockedSite() {
  const [, setLocation] = useLocation();
  const [blockedUrl, setBlockedUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [isAddingToWhitelist, setIsAddingToWhitelist] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get("url");
    if (url) {
      setBlockedUrl(url);
      try {
        const urlObj = new URL(url);
        setDomain(urlObj.hostname);
      } catch (error) {
        console.error("Invalid URL:", error);
        setDomain(url);
      }
    }
  }, []);

  const addToWhitelist = async () => {
    if (!domain) return;
    
    setIsAddingToWhitelist(true);
    try {
      await apiRequest("POST", "/api/whitelist", {
        domain,
        enabled: true
      });
      
      // Invalidate the whitelist cache
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist'] });
      
      toast({
        title: "Success",
        description: `${domain} has been added to your whitelist`,
        variant: "default",
      });
      
      // Go back to browser with the URL
      setTimeout(() => {
        setLocation("/");
        window.location.href = blockedUrl;
      }, 1000);
    } catch (error) {
      console.error("Failed to add to whitelist:", error);
      toast({
        title: "Error",
        description: "Failed to add site to whitelist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToWhitelist(false);
    }
  };

  const goBack = () => {
    setLocation("/");
  };

  return (
    <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8 text-center">
      <span className="material-icons text-destructive text-6xl mb-4">block</span>
      <h1 className="text-xl font-medium text-neutral-900 mb-2">Site Blocked</h1>
      <p className="text-neutral-500 mb-6 max-w-md">
        {domain ? (
          <>
            <strong className="text-neutral-900">{domain}</strong> is not on your allowed sites list. 
            You can add it to your whitelist to access it.
          </>
        ) : (
          "This website is not on your allowed sites list. You can add it to your whitelist in settings."
        )}
      </p>
      <div className="flex space-x-3">
        <Button 
          className="bg-primary hover:bg-secondary text-white"
          onClick={addToWhitelist}
          disabled={isAddingToWhitelist}
        >
          {isAddingToWhitelist ? (
            <>
              <span className="material-icons animate-spin mr-2">refresh</span>
              Adding...
            </>
          ) : (
            "Add to whitelist"
          )}
        </Button>
        <Button 
          variant="outline"
          className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900 border-0"
          onClick={goBack}
        >
          Go back
        </Button>
      </div>
    </div>
  );
}
