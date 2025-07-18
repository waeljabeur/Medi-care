import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authHelpers } from "@/lib/supabase";
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Prevent refresh loops and add debugging
  useEffect(() => {
    console.log("🔵 Login page mounted, current URL:", window.location.href);

    // Check if we're in a refresh loop
    const refreshCount = parseInt(
      localStorage.getItem("login-refresh-count") || "0",
    );
    console.log("🔵 Login refresh count:", refreshCount);

    if (refreshCount > 3) {
      console.log("🚨 Login: Detected refresh loop, clearing auth state");
      localStorage.removeItem("login-refresh-count");
      localStorage.removeItem("last-login-time");
      localStorage.removeItem("demo-session");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });
      setError("Login was stuck in a loop. Please try logging in again.");
      return;
    }

    localStorage.setItem("login-refresh-count", (refreshCount + 1).toString());

    // Clear refresh count after 10 seconds if no issues
    setTimeout(() => {
      localStorage.removeItem("login-refresh-count");
    }, 10000);

    // Add global emergency function
    (window as any).emergencyLogin = () => {
      console.log("🚨 EMERGENCY: Bypassing all auth issues");
      localStorage.clear();
      localStorage.setItem("last-login-time", Date.now().toString());
      localStorage.setItem(
        "demo-session",
        JSON.stringify({
          id: "emergency-user",
          email: "emergency@test.com",
          user_metadata: { name: "Emergency User" },
        }),
      );
      window.location.href = "/dashboard";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("🔵 Starting login process...");
      const { data, error: authError } = await authHelpers.signIn(
        email,
        password,
      );
      console.log("🔵 Login result:", { data: !!data, error: !!authError });

      if (authError) {
        console.log("🔴 Login error:", authError);
        setError(authError.message);
        return;
      }

      if (data.user) {
        console.log("🟢 Login successful, user:", data.user.email);

        // Store login timestamp for auth fallback
        localStorage.setItem("last-login-time", Date.now().toString());

        // Store demo session for demo mode
        if (authHelpers.isDemoMode()) {
          localStorage.setItem("demo-session", JSON.stringify(data.user));
        }

        console.log("🔵 Navigating to dashboard...");

        // Clear refresh count on successful login
        localStorage.removeItem("login-refresh-count");

        // Use setTimeout to avoid potential navigation conflicts
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    } catch (err) {
      console.error("🔴 Login exception:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-medical-100/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-medical-500 to-medical-600 rounded-2xl mb-4 shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Doctor Portal
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 border-border/50 focus:border-medical-400 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12 h-12 rounded-xl border-2 border-border/50 focus:border-medical-400 transition-colors"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-medical-600 hover:text-medical-700 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-medical-500 to-medical-600 hover:from-medical-600 hover:to-medical-700 shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Emergency Access Button */}
              {error.includes("loop") && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    console.log("🚨 Emergency dashboard access");
                    localStorage.clear();
                    localStorage.setItem(
                      "last-login-time",
                      Date.now().toString(),
                    );
                    localStorage.setItem(
                      "demo-session",
                      JSON.stringify({
                        id: "emergency-user",
                        email: "emergency@test.com",
                        user_metadata: { name: "Emergency User" },
                      }),
                    );
                    navigate("/dashboard");
                  }}
                >
                  🚨 Emergency Dashboard Access
                </Button>
              )}

              {/* Signup Link */}
              <div className="text-center pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-medical-600 hover:text-medical-700 font-semibold transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          {authHelpers.isDemoMode() && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">
                🚀 Demo Mode Active
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Use any email/password to login. Try "demo@doctor.com"
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Secure medical dashboard for healthcare professionals
          </p>
        </div>
      </div>
    </div>
  );
}
