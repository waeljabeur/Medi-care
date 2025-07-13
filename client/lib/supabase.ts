import { createClient } from "@supabase/supabase-js";

// Check if we have valid Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Determine if we're in demo mode (no real Supabase credentials)
const isDemoMode =
  !supabaseUrl ||
  !supabaseKey ||
  supabaseUrl.includes("your-project") ||
  supabaseKey.includes("your-anon-key");

// Create Supabase client (only if we have real credentials)
export const supabase = isDemoMode
  ? null
  : createClient(supabaseUrl, supabaseKey);

// Demo user data for development
const DEMO_USER = {
  id: "demo-user-123",
  email: "demo@doctor.com",
  user_metadata: { name: "Dr. Demo User" },
  created_at: new Date().toISOString(),
};

// Auth helper functions with demo mode fallback
export const authHelpers = {
  async signIn(email: string, password: string) {
    if (isDemoMode) {
      // Demo mode: accept any email/password combination
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      if (email === "error@test.com") {
        return {
          data: null,
          error: { message: "Invalid email or password" },
        };
      }

      return {
        data: {
          user: { ...DEMO_USER, email },
          session: {
            access_token: "demo-token",
            user: { ...DEMO_USER, email },
          },
        },
        error: null,
      };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signUp(email: string, password: string, metadata?: { name?: string }) {
    if (isDemoMode) {
      // Demo mode: simulate successful signup
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      if (email === "existing@test.com") {
        return {
          data: null,
          error: { message: "User already registered" },
        };
      }

      return {
        data: {
          user: {
            ...DEMO_USER,
            email,
            user_metadata: { name: metadata?.name || "Demo User" },
          },
          session: null, // In real Supabase, user needs to verify email first
        },
        error: null,
      };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  async signOut() {
    if (isDemoMode) {
      // Demo mode: simulate successful signout
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { error: null };
    }

    if (!supabase) {
      return { error: { message: "Supabase client not initialized" } };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    if (isDemoMode) {
      // Demo mode: simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "notfound@test.com") {
        return {
          data: null,
          error: { message: "Email not found" },
        };
      }

      return { data: {}, error: null };
    }

    const { data, error } = await supabase!.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  async getCurrentUser() {
    if (isDemoMode) {
      // Demo mode: return demo user if logged in (check localStorage)
      const demoSession = localStorage.getItem("demo-session");
      if (demoSession) {
        return { user: JSON.parse(demoSession), error: null };
      }
      return { user: null, error: null };
    }

    const {
      data: { user },
      error,
    } = await supabase!.auth.getUser();
    return { user, error };
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (isDemoMode) {
      // Demo mode: simulate auth state changes
      return {
        data: { subscription: null },
        unsubscribe: () => {},
      };
    }

    return supabase!.auth.onAuthStateChange(callback);
  },

  // Helper to check if we're in demo mode
  isDemoMode() {
    return isDemoMode;
  },
};
