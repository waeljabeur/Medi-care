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

      console.log(
        "🟣 DoctorContext: User found, proceeding to fetch doctor profile",
      );

      // Check if doctor profile exists
      console.log(
        "🟣 DoctorContext: Fetching doctor profile for user ID:",
        user.id,
      );
      const { data: existingDoctor, error: fetchError } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingDoctor) {
        setDoctor(existingDoctor);
      } else {
        // Create doctor profile if it doesn't exist
        const { data: newDoctor, error: createError } = await supabase
          .from("doctors")
          .insert({
            id: user.id,
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "Doctor",
            email: user.email || "",
          })
          .select("*")
          .single();

        if (createError) {
          throw createError;
        }

        setDoctor(newDoctor);
      }
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
      const { data: existingDoctor, error: fetchError } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("🟣 DoctorContext: Fetch result:", {
        existingDoctor: !!existingDoctor,
        fetchError: !!fetchError,
      });

      if (fetchError && fetchError.code !== "PGRST116") {
        console.log("🟣 DoctorContext: Fetch error:", fetchError);
        throw fetchError;
      }

      if (existingDoctor) {
        console.log("🟣 DoctorContext: Doctor profile found:", existingDoctor);
        setDoctor(existingDoctor);
      } else {
        // Create doctor profile if it doesn't exist
        console.log("🟣 DoctorContext: Creating new doctor profile");
        const { data: newDoctor, error: createError } = await supabase
          .from("doctors")
          .insert({
            id: user.id,
            name:
              user.user_metadata?.name || user.email?.split("@")[0] || "Doctor",
            email: user.email || "",
          })
          .select("*")
          .single();

        if (createError) {
          throw createError;
        }

        console.log("🟣 DoctorContext: New doctor profile created:", newDoctor);
        setDoctor(newDoctor);
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
      setError(errorMessage);
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
            "🟣 DoctorContext: No user in session, falling back to loadDoctor",
          );
          await loadDoctor();
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
