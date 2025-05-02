import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { WhitelistedSite } from "@shared/schema";

export default function WhitelistManager() {
  const [newSite, setNewSite] = useState("");
  const { toast } = useToast();

  // Fetch whitelist
  const { data: whitelist = [], isLoading, error } = useQuery<WhitelistedSite[]>({
    queryKey: ['/api/whitelist'],
  });

  // Add site mutation
  const addMutation = useMutation({
    mutationFn: async (domain: string) => {
      await apiRequest("POST", "/api/whitelist", { domain, enabled: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist'] });
      setNewSite("");
      toast({
        title: "Success",
        description: "Website added to whitelist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add website",
        variant: "destructive",
      });
    }
  });

  // Remove site mutation
  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/whitelist/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whitelist'] });
      toast({
        title: "Success",
        description: "Website removed from whitelist",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove website",
        variant: "destructive",
      });
    }
  });

  const handleAddSite = () => {
    if (!newSite.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid domain",
        variant: "destructive",
      });
      return;
    }

    // Extract domain from URL if user entered a full URL
    let domain = newSite.trim();
    try {
      if (domain.startsWith('http')) {
        domain = new URL(domain).hostname;
      }
      addMutation.mutate(domain);
    } catch (error) {
      toast({
        title: "Error",
        description: "Please enter a valid domain or URL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-medium text-neutral-900 mb-4">Allowed Websites</h2>
      <p className="text-neutral-500 mb-4">Only websites on this list can be accessed through this browser.</p>
      
      <div className="mb-4">
        <div className="flex">
          <Input
            type="text"
            className="flex-grow rounded-l-lg"
            placeholder="Enter website URL (e.g., example.com)"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSite()}
          />
          <Button
            className="bg-primary text-white hover:bg-secondary rounded-l-none"
            onClick={handleAddSite}
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <span className="material-icons animate-spin mr-1">refresh</span>
            ) : (
              "Add"
            )}
          </Button>
        </div>
      </div>
      
      <div className="border border-neutral-300 rounded-lg overflow-hidden">
        <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-300 flex font-medium">
          <div className="w-8"></div>
          <div className="flex-grow">Website</div>
          <div className="w-20 text-right">Actions</div>
        </div>
        
        <ScrollArea className="max-h-80">
          {isLoading ? (
            <div className="p-4 text-center">
              <span className="material-icons animate-spin mr-2">refresh</span>
              Loading...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-destructive">
              Failed to load whitelist
            </div>
          ) : whitelist.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">
              No websites added to whitelist yet
            </div>
          ) : (
            whitelist.map((site) => (
              <div key={site.id} className="px-4 py-3 border-b border-neutral-200 flex items-center hover:bg-neutral-50">
                <div className="w-8 flex items-center justify-center">
                  <span className="material-icons text-[#34a853] text-sm">check_circle</span>
                </div>
                <div className="flex-grow text-neutral-900">{site.domain}</div>
                <div className="w-20 text-right">
                  <button
                    className="text-neutral-500 hover:text-destructive"
                    onClick={() => removeMutation.mutate(site.id)}
                    disabled={removeMutation.isPending}
                  >
                    <span className="material-icons">
                      {removeMutation.isPending ? 'hourglass_empty' : 'delete'}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
        
        <div className="bg-neutral-100 px-4 py-3 text-neutral-500 text-sm">
          {whitelist.length} {whitelist.length === 1 ? 'website' : 'websites'} on whitelist
        </div>
      </div>
    </div>
  );
}
