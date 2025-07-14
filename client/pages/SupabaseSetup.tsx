import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  Copy,
  ExternalLink,
} from "lucide-react";
import { supabase, authHelpers } from "@/lib/supabase";

export default function SupabaseSetup() {
  const [connectionStatus, setConnectionStatus] = useState<
    "checking" | "connected" | "disconnected" | "error"
  >("checking");
  const [envVars, setEnvVars] = useState({
    url: import.meta.env.VITE_SUPABASE_URL || "",
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  });
  const [testResults, setTestResults] = useState<{
    connection: boolean;
    auth: boolean;
    database: boolean;
    tables: string[];
  }>({
    connection: false,
    auth: false,
    database: false,
    tables: [],
  });

  const testConnection = async () => {
    setConnectionStatus("checking");

    try {
      if (!supabase) {
        setConnectionStatus("disconnected");
        return;
      }

      // Test basic connection
      const { data: healthCheck, error: healthError } = await supabase
        .from("doctors")
        .select("count")
        .limit(1);

      if (healthError) {
        console.error("Health check error:", healthError);
        setConnectionStatus("error");
        return;
      }

      // Test auth
      const { data: authData, error: authError } =
        await supabase.auth.getSession();

      // Test database tables
      const { data: tablesData, error: tablesError } = await supabase.rpc(
        "get_table_names",
        {},
      );

      setTestResults({
        connection: !healthError,
        auth: !authError,
        database: !tablesError,
        tables: tablesData || [],
      });

      setConnectionStatus("connected");
    } catch (error) {
      console.error("Connection test failed:", error);
      setConnectionStatus("error");
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isDemoMode = authHelpers.isDemoMode();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Supabase Setup</h1>
          <p className="text-muted-foreground">
            Configure your Supabase connection for the doctor dashboard
          </p>
        </div>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={isDemoMode ? "secondary" : "default"}>
                {isDemoMode ? "Demo Mode" : "Live Mode"}
              </Badge>
              {connectionStatus === "connected" && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
              {connectionStatus === "disconnected" && (
                <Badge variant="destructive">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              {connectionStatus === "error" && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>

            <Button
              onClick={testConnection}
              disabled={connectionStatus === "checking"}
            >
              {connectionStatus === "checking"
                ? "Testing..."
                : "Test Connection"}
            </Button>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supabase-url">VITE_SUPABASE_URL</Label>
              <div className="flex gap-2">
                <Input
                  id="supabase-url"
                  value={envVars.url}
                  placeholder="https://your-project-id.supabase.co"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(envVars.url)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supabase-key">VITE_SUPABASE_ANON_KEY</Label>
              <div className="flex gap-2">
                <Input
                  id="supabase-key"
                  value={
                    envVars.key ? `${envVars.key.substring(0, 20)}...` : ""
                  }
                  placeholder="your-anon-key-here"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(envVars.key)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {isDemoMode && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You're currently in demo mode. To use real Supabase:
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>
                      Create a Supabase project at{" "}
                      <a
                        href="https://supabase.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        supabase.com
                      </a>
                    </li>
                    <li>Copy your project URL and anon key</li>
                    <li>Update your .env file with the real values</li>
                    <li>Restart your development server</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Database Schema */}
        <Card>
          <CardHeader>
            <CardTitle>Database Schema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Run this SQL in your Supabase SQL Editor to create the required
                tables:
              </p>

              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {`-- Create doctors table
CREATE TABLE public.doctors (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create patients table
CREATE TABLE public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dob DATE,
    phone TEXT,
    email TEXT,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create appointments table
CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Doctors can view their own profile" ON public.doctors FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Doctors can update their own profile" ON public.doctors FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Doctors can insert their own profile" ON public.doctors FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Doctors can view their own patients" ON public.patients FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can insert patients" ON public.patients FOR INSERT WITH CHECK (auth.uid() = doctor_id);
CREATE POLICY "Doctors can update their own patients" ON public.patients FOR UPDATE USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can delete their own patients" ON public.patients FOR DELETE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can view their own appointments" ON public.appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can insert appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = doctor_id);
CREATE POLICY "Doctors can update their own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = doctor_id);
CREATE POLICY "Doctors can delete their own appointments" ON public.appointments FOR DELETE USING (auth.uid() = doctor_id);

-- Auto-create doctor profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.doctors (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.user_metadata->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create doctor profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`}
                </pre>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  copyToClipboard(
                    document.querySelector("pre")?.textContent || "",
                  )
                }
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy SQL
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {!isDemoMode && (
          <Card>
            <CardHeader>
              <CardTitle>Connection Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {testResults.connection ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Database Connection</span>
                </div>
                <div className="flex items-center gap-2">
                  {testResults.auth ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Authentication Service</span>
                </div>
                <div className="flex items-center gap-2">
                  {testResults.database ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span>Database Schema</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
