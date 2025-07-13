import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { useDoctor } from "@/contexts/DoctorContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { authHelpers } from "@/lib/supabase";
import { LogOut, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export function LogoutButton({
  variant = "ghost",
  size = "sm",
  showIcon = true,
  showText = true,
  className = "",
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshDoctor } = useDoctor();

  const handleLogout = async () => {
    console.log("🔴 Logout initiated");
    setIsLoading(true);

    try {
      console.log("🔴 Calling authHelpers.signOut()");
      const { error } = await authHelpers.signOut();
      console.log("🔴 Sign out result:", { error });

      if (error) {
        console.error("🔴 Logout error:", error);
        toast.error(
          `Failed to sign out: ${error.message || "Please try again."}`,
        );
        setIsLoading(false);
        return;
      }

      console.log("🔴 Sign out successful, cleaning up...");

      // Clean up demo session if in demo mode
      if (authHelpers.isDemoMode()) {
        console.log("🔴 Demo mode - removing demo session");
        localStorage.removeItem("demo-session");
      }

      // Clear all auth-related storage
      console.log("🔴 Clearing all auth storage...");
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("sb-ywkcdnczxqbqmpvfghdr-auth-token"); // Supabase project-specific token
      localStorage.removeItem("last-login-time"); // Clear login timestamp

      // Clear all localStorage items that start with 'sb-' (Supabase)
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });

      // Force refresh doctor context
      console.log("🔴 Refreshing doctor context...");
      await refreshDoctor();

      console.log("🔴 Navigating to login...");
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (err) {
      console.error("🔴 Unexpected logout error:", err);
      toast.error("An unexpected error occurred during logout");
      setIsLoading(false);
    }
  };

  // Expose logout function globally for debugging
  React.useEffect(() => {
    (window as any).forceLogout = handleLogout;
    return () => {
      delete (window as any).forceLogout;
    };
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`transition-colors hover:bg-destructive/10 hover:text-destructive ${className}`}
          disabled={isLoading}
        >
          {showIcon && <LogOut className="w-4 h-4" />}
          {showText && showIcon && <span className="ml-2">Logout</span>}
          {showText && !showIcon && <span>Logout</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>Confirm Logout</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out? You'll need to log in again to
            access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing out...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
