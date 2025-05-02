import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AdBlockingStatistics } from "@shared/schema";

interface AdBlockingStatsProps {
  statistics: AdBlockingStatistics;
  onClose: () => void;
}

export default function AdBlockingStats({ statistics, onClose }: AdBlockingStatsProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ad Blocking Statistics</DialogTitle>
          <DialogDescription>
            Summary of ads and trackers blocked by the browser
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-[#34a853] bg-opacity-10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#34a853]">{statistics.totalBlocked}</div>
                <div className="text-sm text-neutral-500">Total Blocked</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-100 p-3 rounded-lg">
              <p className="text-neutral-500 text-sm">Ads</p>
              <p className="text-neutral-900 text-xl font-medium">{statistics.adsBlocked}</p>
            </div>
            <div className="bg-neutral-100 p-3 rounded-lg">
              <p className="text-neutral-500 text-sm">Trackers</p>
              <p className="text-neutral-900 text-xl font-medium">{statistics.trackersBlocked}</p>
            </div>
          </div>
          
          <div className="border border-neutral-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-neutral-100 px-3 py-2 text-sm font-medium">Top Blocked Domains</div>
            
            <ScrollArea className="max-h-40">
              {statistics.topBlockedDomains.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {statistics.topBlockedDomains.map((item, index) => (
                    <div key={index} className="px-3 py-2 flex justify-between">
                      <span className="text-neutral-900">{item.domain}</span>
                      <span className="text-neutral-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-neutral-500">
                  No domains blocked yet
                </div>
              )}
            </ScrollArea>
          </div>
          
          <Button
            className="w-full bg-primary text-white hover:bg-secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
