import { useState } from "react";
import { Tab } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface TabBarProps {
  tabs: Tab[];
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onActivateTab: (id: string) => void;
  onOpenSettings: () => void;
}

export default function TabBar({ tabs, onAddTab, onCloseTab, onActivateTab, onOpenSettings }: TabBarProps) {
  const { currentUser, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.photoURL || undefined} alt="User avatar" />
                  <AvatarFallback>{currentUser?.displayName?.substring(0, 2) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {currentUser && (
                <>
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{currentUser.displayName}</div>
                    <div className="text-xs text-muted-foreground truncate">{currentUser.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={onOpenSettings}>
                <span className="material-icons mr-2 text-sm">settings</span>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <span className="material-icons mr-2 text-sm">logout</span>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
