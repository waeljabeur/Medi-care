import React, { createContext, useContext, useState, useEffect } from "react";
import { authHelpers } from "@/lib/supabase";

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
  refreshDoctor: () => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createFallbackDoctor = (user: any) => {
    console.log("🟣 Simple DoctorContext: Creating fallback doctor");
    const fallbackDoctor = {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Doctor",
      email: user.email || "",
      created_at: new Date().toISOString(),
    };

    setDoctor(fallbackDoctor);
    setError(null);
    setLoading(false);
  };

  const refreshDoctor = () => {
    console.log("🟣 Simple DoctorContext: Refresh requested");
    // Just keep the current doctor to avoid issues
  };

  useEffect(() => {
    console.log("🟣 Simple DoctorContext: Initializing");

    // Check for demo session first
    const demoSession = localStorage.getItem("demo-session");
    if (demoSession) {
      try {
        const user = JSON.parse(demoSession);
        createFallbackDoctor(user);
        return;
      } catch (err) {
        console.error("🔴 Error parsing demo session:", err);
      }
    }

    // Listen for auth state changes
    const authResult = authHelpers.onAuthStateChange(async (event, session) => {
      console.log("🟣 Simple DoctorContext auth state change:", {
        event,
        session: !!session,
      });

      if (event === "SIGNED_IN" && session?.user) {
        createFallbackDoctor(session.user);
      } else if (event === "SIGNED_OUT") {
        setDoctor(null);
        setLoading(false);
        setError(null);
      }
    });

    // Set timeout to prevent infinite loading
    setTimeout(() => {
      if (loading) {
        console.log("🟣 Simple DoctorContext: Timeout - stopping loading");
        setLoading(false);
        setError("Please try logging in again");
      }
    }, 3000);

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
