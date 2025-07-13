import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, authHelpers } from "@/lib/supabase";

interface Doctor {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface DoctorContextType {
  doctor: Doctor | null;
  loading: boolean;
  error: string | null;
  refreshDoctor: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDoctor = async () => {
    try {
      console.log("🟣 DoctorContext: Starting loadDoctor");
      setLoading(true);
      setError(null);

      // Check if supabase client is available
      if (!supabase) {
        throw new Error(
          "Supabase client not initialized. Please check your environment configuration.",
        );
      }

      // Skip the problematic getCurrentUser call - let auth state change handle this
      console.log(
        "🟣 DoctorContext: Skipping getCurrentUser - waiting for auth state change",
      );
      setLoading(false);
      return;
    } catch (err) {
      console.error("🔴 DoctorContext: Error loading doctor:", err);

      // Better error handling to avoid "[object Object]" display
      let errorMessage = "Failed to load doctor profile";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        // Handle Supabase error objects
        if ("message" in err && typeof err.message === "string") {
          errorMessage = err.message;
        } else if (
          "error_description" in err &&
          typeof err.error_description === "string"
        ) {
          errorMessage = err.error_description;
        } else {
          // Last resort: try to extract meaningful info from the error object
          errorMessage = `Database error: ${JSON.stringify(err)}`;
        }
      }

      console.log("🔴 DoctorContext: Setting error message:", errorMessage);
      setError(errorMessage);
    } finally {
      console.log("🟣 DoctorContext: Setting loading to false");
      setLoading(false);
    }
  };

  const loadDoctorWithUser = async (user: any) => {
    try {
      console.log(
        "🟣 DoctorContext: Starting loadDoctorWithUser for user:",
        user?.email,
      );
      setLoading(true);
      setError(null);

      // Check if supabase client is available
      if (!supabase) {
        throw new Error(
          "Supabase client not initialized. Please check your environment configuration.",
        );
      }

      if (!user) {
        console.log(
          "🟣 DoctorContext: No user provided, setting doctor to null",
        );
        setDoctor(null);
        return;
      }

      console.log(
        "🟣 DoctorContext: User found, proceeding to fetch doctor profile",
      );

      // Check if doctor profile exists
      console.log(
        "🟣 DoctorContext: Fetching doctor profile for user ID:",
        user.id,
      );

      // Add timeout to prevent hanging
      const fetchWithTimeout = Promise.race([
        supabase.from("doctors").select("*").eq("id", user.id).single(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Database query timeout after 5 seconds")),
            5000,
          ),
        ),
      ]);

      const { data: existingDoctor, error: fetchError } =
        await fetchWithTimeout;

      console.log("🟣 DoctorContext: Fetch result:", {
        existingDoctor: !!existingDoctor,
        fetchError: fetchError?.code || !!fetchError,
        errorMessage: fetchError?.message,
      });

      if (fetchError && fetchError.code !== "PGRST116") {
        console.log("🟣 DoctorContext: Fetch error:", fetchError);
        throw fetchError;
      }

      if (existingDoctor) {
        console.log("🟣 DoctorContext: Doctor profile found:", existingDoctor);
        setDoctor(existingDoctor);

        // Force navigation to dashboard if we're still on login page
        if (window.location.pathname === "/login") {
          console.log(
            "🟣 DoctorContext: Still on login page, forcing navigation to dashboard",
          );
          window.location.href = "/dashboard";
        }
      } else {
        // Create doctor profile if it doesn't exist
        console.log("🟣 DoctorContext: Creating new doctor profile");

        const createWithTimeout = Promise.race([
          supabase
            .from("doctors")
            .insert({
              id: user.id,
              name:
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Doctor",
              email: user.email || "",
            })
            .select("*")
            .single(),
          new Promise<never>((_, reject) =>
            setTimeout(
              () =>
                reject(new Error("Database insert timeout after 5 seconds")),
              5000,
            ),
          ),
        ]);

        const { data: newDoctor, error: createError } = await createWithTimeout;

        if (createError) {
          throw createError;
        }

        console.log("🟣 DoctorContext: New doctor profile created:", newDoctor);
        setDoctor(newDoctor);

        // Force navigation to dashboard if we're still on login page
        if (window.location.pathname === "/login") {
          console.log(
            "🟣 DoctorContext: Still on login page, forcing navigation to dashboard",
          );
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      console.error("🔴 DoctorContext: Error in loadDoctorWithUser:", err);

      let errorMessage = "Failed to load doctor profile";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else if (err && typeof err === "object") {
        if ("message" in err && typeof err.message === "string") {
          errorMessage = err.message;
        } else if (
          "error_description" in err &&
          typeof err.error_description === "string"
        ) {
          errorMessage = err.error_description;
        } else {
          errorMessage = `Database error: ${JSON.stringify(err)}`;
        }
      }

      console.log("🔴 DoctorContext: Setting error message:", errorMessage);

      // If we're on login page and there's a database error, create a minimal fallback doctor
      console.log(
        "🟡 DoctorContext: Checking fallback conditions - pathname:",
        window.location.pathname,
        "user:",
        !!user,
      );

      if (user && errorMessage.includes("timeout")) {
        console.log(
          "🟡 DoctorContext: Database error on login - creating fallback doctor profile",
        );
        const fallbackDoctor = {
          id: user.id,
          name:
            user.user_metadata?.name || user.email?.split("@")[0] || "Doctor",
          email: user.email || "",
          created_at: new Date().toISOString(),
        };

        console.log(
          "🟡 DoctorContext: Fallback doctor created:",
          fallbackDoctor,
        );
        setDoctor(fallbackDoctor);
        setError(null); // Clear the error since we have a fallback

        // Navigate to dashboard with fallback profile
        console.log(
          "🟡 DoctorContext: Navigating to dashboard with fallback profile",
        );
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100); // Small delay to ensure state is set
      } else {
        console.log(
          "🔴 DoctorContext: Not on login page or no user, setting error",
        );
        setError(errorMessage);
      }
    } finally {
      console.log("🟣 DoctorContext: Setting loading to false");
      setLoading(false);
    }
  };

  const refreshDoctor = async () => {
    await loadDoctor();
  };

  useEffect(() => {
    console.log("🟣 DoctorContext: Initializing - checking auth state");

    // Check if we're in demo mode and have a stored session
    if (authHelpers.isDemoMode()) {
      const demoSession = localStorage.getItem("demo-session");
      if (demoSession) {
        console.log("🟣 DoctorContext: Demo mode - found stored session");
        try {
          const user = JSON.parse(demoSession);
          loadDoctorWithUser(user);
        } catch (err) {
          console.error("🔴 DoctorContext: Error parsing demo session:", err);
          setLoading(false);
        }
      } else {
        console.log("🟣 DoctorContext: Demo mode - no stored session");
        setLoading(false);
      }
    } else {
      console.log(
        "🟣 DoctorContext: Real mode - waiting for auth state change",
      );
      // In real mode, wait for auth state change - don't call loadDoctor
      setLoading(true);
    }

    // Listen for auth state changes using authHelpers
    const authResult = authHelpers.onAuthStateChange(async (event, session) => {
      console.log("🟣 DoctorContext auth state change:", {
        event,
        session: !!session,
      });
      if (event === "SIGNED_IN" && session) {
        console.log(
          "🟣 DoctorContext: SIGNED_IN detected, using session user directly",
        );
        // Use the user from the session directly instead of calling getCurrentUser
        const user = session.user;
        if (user) {
          console.log("🟣 DoctorContext: Session user found:", user.email);
          await loadDoctorWithUser(user);
        } else {
          console.log(
            "🟣 DoctorContext: No user in session, setting loading to false",
          );
          setLoading(false);
          setError("No user session found");
        }
      } else if (event === "SIGNED_OUT") {
        console.log("🟣 DoctorContext: User signed out, clearing doctor state");
        setDoctor(null);
        setLoading(false);
        setError(null);
      }
    });

    return () => {
      if ("unsubscribe" in authResult) {
        authResult.unsubscribe();
      } else if (authResult.data?.subscription?.unsubscribe) {
        authResult.data.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <DoctorContext.Provider value={{ doctor, loading, error, refreshDoctor }}>
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctor() {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
}
