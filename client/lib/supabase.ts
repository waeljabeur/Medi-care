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

console.log("🔧 Supabase mode:", isDemoMode ? "DEMO" : "LIVE");

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
    console.log("🟡 authHelpers.signIn called, isDemoMode:", isDemoMode);

    if (isDemoMode) {
      console.log("🟡 Demo mode - simulating login");
      // Demo mode: accept any email/password combination
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

      if (email === "error@test.com") {
        console.log("🟡 Demo mode - returning error for test email");
        return {
          data: null,
          error: { message: "Invalid email or password" },
        };
      }

      // Check if we have a stored demo user profile
      const storedProfile = localStorage.getItem("demo-user-profile");
      let userProfile = DEMO_USER;

      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          userProfile = {
            ...DEMO_USER,
            email: profile.email,
            user_metadata: { name: profile.name },
          };
        } catch (e) {
          console.warn("Failed to parse stored demo profile");
        }
      }

      console.log("🟡 Demo mode - returning success");
      return {
        data: {
          user: { ...userProfile, email },
          session: {
            access_token: "demo-token",
            user: { ...userProfile, email },
          },
        },
        error: null,
      };
    }

    if (!supabase) {
      console.log("🟡 Supabase client not initialized");
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    console.log("🟡 Calling supabase.auth.signInWithPassword");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("🟡 Supabase signIn result:", { data: !!data, error: !!error });
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

      // Store demo user data for later login
      const demoUser = {
        ...DEMO_USER,
        email,
        user_metadata: { name: metadata?.name || "Demo User" },
      };

      // Store in localStorage for demo mode persistence
      localStorage.setItem(
        "demo-user-profile",
        JSON.stringify({
          id: DEMO_USER.id,
          name: metadata?.name || "Demo User",
          email: email,
          created_at: new Date().toISOString(),
        }),
      );

      return {
        data: {
          user: demoUser,
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
    console.log("🟡 authHelpers.signOut called, isDemoMode:", isDemoMode);

    if (isDemoMode) {
      console.log("🟡 Demo mode - simulating signout");
      // Demo mode: simulate successful signout
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("🟡 Demo mode signout complete");
      return { error: null };
    }

    if (!supabase) {
      console.log("🟡 Supabase client not initialized");
      return { error: { message: "Supabase client not initialized" } };
    }

    console.log("🟡 Calling supabase.auth.signOut()");
    const { error } = await supabase.auth.signOut();
    console.log("🟡 Supabase signOut result:", { error });
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

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  async getCurrentUser() {
    console.log(
      "🟡 authHelpers.getCurrentUser called, isDemoMode:",
      isDemoMode,
    );

    if (isDemoMode) {
      // Demo mode: return demo user if logged in (check localStorage)
      const demoSession = localStorage.getItem("demo-session");
      if (demoSession) {
        console.log("🟡 Demo mode - returning stored session");
        return { user: JSON.parse(demoSession), error: null };
      }
      console.log("🟡 Demo mode - no session found");
      return { user: null, error: null };
    }

    if (!supabase) {
      console.log("🟡 getCurrentUser - Supabase client not initialized");
      return {
        user: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    console.log(
      "🟡 getCurrentUser - calling supabase.auth.getUser with timeout",
    );

    try {
      // Add timeout to prevent hanging
      const getUserWithTimeout = Promise.race([
        supabase.auth.getUser(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("getCurrentUser timeout after 3 seconds")),
            3000,
          ),
        ),
      ]);

      const {
        data: { user },
        error,
      } = await getUserWithTimeout;

      console.log("🟡 getCurrentUser result:", {
        user: !!user,
        error: !!error,
      });
      return { user, error };
    } catch (err) {
      console.error("🟡 getCurrentUser error:", err);
      return {
        user: null,
        error: {
          message:
            err instanceof Error ? err.message : "Failed to get current user",
        },
      };
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (isDemoMode) {
      // Demo mode: simulate auth state changes
      return {
        data: { subscription: null },
        unsubscribe: () => {},
      };
    }

    if (!supabase) {
      return {
        data: { subscription: null },
        unsubscribe: () => {},
      };
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  // Helper to check if we're in demo mode
  isDemoMode() {
    return isDemoMode;
  },
};
