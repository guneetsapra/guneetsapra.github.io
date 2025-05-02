import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Browser from "@/pages/Browser";
import Settings from "@/pages/Settings";
import BlockedSite from "@/pages/BlockedSite";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";

// Protected route component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!currentUser) {
      setLocation('/login');
    }
  }, [currentUser, setLocation]);

  return currentUser ? <Component /> : null;
}

// Main app content
function AppContent() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-neutral-100">
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/">
          <ProtectedRoute component={Browser} />
        </Route>
        <Route path="/settings">
          <ProtectedRoute component={Settings} />
        </Route>
        <Route path="/blocked">
          <ProtectedRoute component={BlockedSite} />
        </Route>
        <Route>
          <ProtectedRoute component={NotFound} />
        </Route>
      </Switch>
    </div>
  );
}

// Main App with Auth Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
