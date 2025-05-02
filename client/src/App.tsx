import { Switch, Route } from "wouter";
import Browser from "./pages/Browser";
import Settings from "./pages/Settings";
import BlockedSite from "./pages/BlockedSite";
import NotFound from "./pages/not-found";
import Homepage from "./pages/Homepage";

export default function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-neutral-100">
      <Switch>
        <Route path="/" component={Homepage} />
        <Route path="/browser" component={Browser} />
        <Route path="/settings" component={Settings} />
        <Route path="/blocked" component={BlockedSite} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
