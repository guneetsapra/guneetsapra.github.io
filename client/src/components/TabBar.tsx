import { useState } from "react";
import { Tab } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TabBarProps {
  tabs: Tab[];
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onActivateTab: (id: string) => void;
  onOpenSettings: () => void;
}

export default function TabBar({ tabs, onAddTab, onCloseTab, onActivateTab, onOpenSettings }: TabBarProps) {
  return (
    <div className="bg-neutral-100 border-b border-neutral-300 pl-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-grow overflow-x-auto tab-scroll">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              className={`tab py-2 px-3 flex items-center min-w-[180px] max-w-[240px] rounded-t-lg mr-1 cursor-pointer
                ${tab.active ? 'bg-white shadow-sm' : 'bg-neutral-200'}`}
              onClick={() => onActivateTab(tab.id)}
            >
              <span className="material-icons text-neutral-500 text-sm">
                {tab.favIcon ? 'public' : 'public'}
              </span>
              <span className={`ml-2 text-sm ${tab.active ? 'text-neutral-900 font-medium' : 'text-neutral-500'} truncate`}>
                {tab.title || 'New Tab'}
              </span>
              <button 
                className="ml-auto text-neutral-500 text-sm hover:text-neutral-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
          ))}
          
          <div 
            className="flex items-center justify-center w-8 h-8 ml-1 cursor-pointer hover:bg-neutral-200 rounded-full"
            onClick={onAddTab}
          >
            <span className="material-icons text-neutral-500">add</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-2 hover:bg-neutral-200 rounded-full"
                  onClick={onOpenSettings}
                >
                  <span className="material-icons text-neutral-500">settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="p-2 hover:bg-neutral-200 rounded-full"
                >
                  <span className="material-icons text-neutral-500">more_vert</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
