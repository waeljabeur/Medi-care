import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { CheckCircle, AlertCircle, User } from "lucide-react";

export default function CreateDoctorProfile() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      setStatus({ type: "error", message: "Please enter your name" });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      // Get current user
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setStatus({
          type: "error",
          message: "You must be logged in to create a profile",
        });
        return;
      }

      // Create doctor profile
      const { data, error } = await supabase
        .from("doctors")
        .insert({
          id: userData.user.id,
          name: name.trim(),
          email: userData.user.email,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          setStatus({
            type: "error",
            message: "Doctor profile already exists for this user",
          });
        } else {
          setStatus({
            type: "error",
            message: `Failed to create profile: ${error.message}`,
          });
        }
        return;
      }

      setStatus({
        type: "success",
        message: "Doctor profile created successfully!",
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setStatus({ type: "error", message: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Doctor Profile</CardTitle>
          <p className="text-muted-foreground">
            Complete your profile setup to access the dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {status.type && (
            <Alert
              className={
                status.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }
            >
              {status.type === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={
                  status.type === "success" ? "text-green-800" : "text-red-800"
                }
              >
                {status.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Dr. John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={handleCreateProfile}
            disabled={isLoading || !name.trim()}
            className="w-full"
          >
            {isLoading ? "Creating Profile..." : "Create Profile"}
          </Button>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
