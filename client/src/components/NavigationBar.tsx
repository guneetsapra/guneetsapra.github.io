import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavigationBarProps {
  currentUrl: string;
  onUrlSubmit: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  blockedAdsCount: number;
  onToggleAdBlockStats: () => void;
}

export default function NavigationBar({
  currentUrl,
  onUrlSubmit,
  onGoBack,
  onGoForward,
  onRefresh,
  canGoBack,
  canGoForward,
  blockedAdsCount,
  onToggleAdBlockStats
}: NavigationBarProps) {
  const [inputUrl, setInputUrl] = useState(currentUrl);

  // Update input when currentUrl changes externally
  if (currentUrl !== inputUrl && currentUrl) {
    setInputUrl(currentUrl);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onUrlSubmit(inputUrl);
    }
  };

  const handleClearUrl = () => {
    setInputUrl('');
  };

  return (
    <div className="bg-white border-b border-neutral-300 px-4 py-2 flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 rounded-full hover:bg-neutral-200"
              onClick={onGoBack}
              disabled={!canGoBack}
            >
              <span className="material-icons text-neutral-500">arrow_back</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Back</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 rounded-full hover:bg-neutral-200"
              onClick={onGoForward}
              disabled={!canGoForward}
            >
              <span className="material-icons text-neutral-500">arrow_forward</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Forward</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 rounded-full hover:bg-neutral-200"
              onClick={onRefresh}
            >
              <span className="material-icons text-neutral-500">refresh</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex-grow">
        <div className="relative">
          <div className="flex items-center bg-neutral-100 hover:bg-neutral-200 rounded-full pl-4 pr-2 py-1.5">
            <span className="material-icons text-neutral-500 text-sm mr-2">https</span>
            <input 
              type="text" 
              className="bg-transparent w-full focus:outline-none text-sm"
              placeholder="Enter URL" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {inputUrl && (
              <button 
                className="p-1 rounded-full hover:bg-neutral-300"
                onClick={handleClearUrl}
              >
                <span className="material-icons text-neutral-500 text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 rounded-full hover:bg-neutral-200"
              onClick={onToggleAdBlockStats}
            >
              <div className="relative">
                <span className="material-icons text-[#34a853]">shield</span>
                <span className="absolute -top-1 -right-1 bg-[#34a853] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {blockedAdsCount}
                </span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ad blocking statistics</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
