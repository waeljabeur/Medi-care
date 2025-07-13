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

      // Get current user with timeout
      console.log("🟣 DoctorContext: Getting current user");

      const getUserWithTimeout = () => {
        return Promise.race([
          supabase.auth.getUser(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("getUser timeout after 5 seconds")),
              5000,
            ),
          ),
        ]);
      };

      const {
        data: { user },
      } = await getUserWithTimeout();
      console.log("🟣 DoctorContext: Current user:", user?.email || "none");
      if (!user) {
        setDoctor(null);
        return;
      }

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
      console.error("Error loading doctor:", err);

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

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshDoctor = async () => {
    await loadDoctor();
  };

  useEffect(() => {
    loadDoctor();

    // Listen for auth state changes using authHelpers
    const authResult = authHelpers.onAuthStateChange(async (event, session) => {
      console.log("🟣 DoctorContext auth state change:", {
        event,
        session: !!session,
      });
      if (event === "SIGNED_IN" && session) {
        await loadDoctor();
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
