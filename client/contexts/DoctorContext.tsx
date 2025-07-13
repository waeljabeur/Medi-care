import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Doctor {
  id: string;
  user_id: string;
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
      setLoading(true);
      setError(null);

      // Get current user
      const {
        data: { user },
      } = await supabase!.auth.getUser();
      if (!user) {
        setDoctor(null);
        return;
      }

      // Check if doctor profile exists
      const { data: existingDoctor, error: fetchError } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", user.id)
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
            user_id: user.id,
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
      setError(
        err instanceof Error ? err.message : "Failed to load doctor profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshDoctor = async () => {
    await loadDoctor();
  };

  useEffect(() => {
    loadDoctor();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await loadDoctor();
      } else if (event === "SIGNED_OUT") {
        setDoctor(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
