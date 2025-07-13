import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authHelpers } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔷 ProtectedRoute: Checking auth state");

    // Don't call getCurrentUser - just wait for auth state changes
    // In demo mode, check localStorage
    if (authHelpers.isDemoMode()) {
      const demoSession = localStorage.getItem("demo-session");
      if (demoSession) {
        console.log("🔷 ProtectedRoute: Demo session found");
        setIsAuthenticated(true);
      } else {
        console.log("🔷 ProtectedRoute: No demo session");
        setIsAuthenticated(false);
      }
      setLoading(false);
    } else {
      console.log(
        "🔷 ProtectedRoute: Live mode - waiting for auth state change",
      );
      // In live mode, start as not authenticated and wait for auth state change
      setIsAuthenticated(false);
      setLoading(true);

      // Timeout after 3 seconds if no auth state change
      setTimeout(() => {
        if (loading) {
          console.log(
            "🔷 ProtectedRoute: No auth state change, assuming not authenticated",
          );
          setLoading(false);
          setIsAuthenticated(false);
        }
      }, 3000);
    }

    // Listen for auth changes
    const authResult = authHelpers.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    return () => {
      if ("unsubscribe" in authResult) {
        authResult.unsubscribe();
      } else if (authResult.data?.subscription?.unsubscribe) {
        authResult.data.subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
