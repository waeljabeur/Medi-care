import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
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

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const { error } = await authHelpers.signOut();

      if (error) {
        toast.error("Failed to sign out. Please try again.");
        console.error("Logout error:", error);
        return;
      }

      // Clean up demo session if in demo mode
      if (authHelpers.isDemoMode()) {
        localStorage.removeItem("demo-session");
      }

      toast.success("Signed out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Unexpected logout error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
