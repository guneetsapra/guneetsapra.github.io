import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusBarProps {
  adBlockerActive: boolean;
  blockedAdsCount: number;
  currentDomain: string;
  isWhitelisted: boolean;
}

export default function StatusBar({ 
  adBlockerActive, 
  blockedAdsCount, 
  currentDomain,
  isWhitelisted
}: StatusBarProps) {
  return (
    <div className="bg-white border-t border-neutral-300 px-4 py-2 flex items-center text-sm text-neutral-500">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-help">
            <span className={`material-icons text-sm mr-1 ${adBlockerActive ? 'text-[#34a853]' : 'text-neutral-500'}`}>
              shield
            </span>
            <span>
              Ad Blocker: <span className={adBlockerActive ? 'text-[#34a853] font-medium' : 'text-neutral-500'}>
                {adBlockerActive ? 'Active' : 'Inactive'}
              </span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{adBlockerActive ? 'Ad blocking is enabled' : 'Ad blocking is disabled'}</p>
        </TooltipContent>
      </Tooltip>
      
      {adBlockerActive && blockedAdsCount > 0 && (
        <>
          <div className="mx-3">|</div>
          <div>
            <span>{blockedAdsCount}</span> {blockedAdsCount === 1 ? 'item' : 'items'} blocked on this page
          </div>
        </>
      )}
      
      {currentDomain && (
        <div className="ml-auto flex items-center">
          <span className={`material-icons text-sm mr-1 ${isWhitelisted ? 'text-[#34a853]' : 'text-neutral-500'}`}>
            {isWhitelisted ? 'check_circle' : 'info'}
          </span>
          <span>
            Website {isWhitelisted ? 'allowed' : 'status'}: <span className={isWhitelisted ? 'text-[#34a853] font-medium' : 'text-neutral-500'}>
              {currentDomain}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
