import { Tab } from "@shared/schema";
import WebView from "./WebView";

interface BrowserContentProps {
  currentUrl: string;
  tabs: Tab[];
  activeTab: Tab | null;
}

export default function BrowserContent({ currentUrl, tabs, activeTab }: BrowserContentProps) {
  if (!activeTab) {
    return (
      <div className="flex-grow bg-white flex flex-col items-center justify-center p-8 text-center">
        <span className="material-icons text-neutral-500 text-6xl mb-4">public</span>
        <h1 className="text-xl font-medium text-neutral-900 mb-2">Welcome to the AdBlocker Browser</h1>
        <p className="text-neutral-500 max-w-md">
          Enter a URL in the address bar above to start browsing with ad blocking protection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-hidden relative">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`h-full w-full ${tab.active ? '' : 'hidden'}`}
        >
          <WebView url={tab.url} />
        </div>
      ))}
    </div>
  );
}
