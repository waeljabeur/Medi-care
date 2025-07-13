import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { authHelpers, supabase } from "@/lib/supabase";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  FileText,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";

// Mock patients data
const mockPatients = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "(555) 123-4567",
    age: 34,
    lastVisit: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 234-5678",
    age: 42,
    lastVisit: "2024-01-12",
    status: "active",
  },
  {
    id: 3,
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "(555) 345-6789",
    age: 28,
    lastVisit: "2024-01-10",
    status: "pending",
  },
];

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  created_at: string;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        if (authHelpers.isDemoMode()) {
          // Demo mode: use mock data
          const demoPatients = mockPatients.map((p) => ({
            id: p.id.toString(),
            name: p.name,
            email: p.email,
            phone: p.phone,
            dob: "1990-01-01", // Default DOB for demo
            created_at: new Date().toISOString(),
          }));
          setPatients(demoPatients);
          setLoading(false);
          return;
        }

        // Real Supabase implementation
        const { user } = await authHelpers.getCurrentUser();
        if (!user) {
          setError("You must be logged in to view patients.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase!
          .from("patients")
          .select("id, name, email, phone, dob, created_at")
          .eq("doctor_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setPatients(data || []);
      } catch (err) {
        console.error("Error loading patients:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load patients",
        );
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Patients
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your patient information and medical records
          </p>
        </div>
        <Link to="/patients/new">
          <Button
            size="default"
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Card className="px-6 py-3 shadow-sm border-0 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-semibold">
                {patients.length} Total Patients
              </span>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10 w-full sm:w-80 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
          />
        </div>
      </div>

      {/* Patients Table */}
      <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">Patient List</CardTitle>
          <CardDescription className="text-base">
            View and manage all your patients' information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-4 px-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Patient
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Contact
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Age
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Last Visit
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Status
                  </th>
                  <th className="text-left py-4 px-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-border/30 hover:bg-background/50 transition-all duration-200 group cursor-pointer"
                  >
                    <td className="py-5 px-3">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="flex items-center space-x-4 w-full"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                          <span className="text-sm font-bold text-primary">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-base flex items-center">
                            {patient.name}
                            <ExternalLink className="w-3 h-3 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-sm text-muted-foreground font-medium">
                            Patient ID: #{patient.id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-5 px-3">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm font-medium">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm font-medium">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-3 text-foreground font-semibold">
                      {calculateAge(patient.dob)} years
                    </td>
                    <td className="py-5 px-3">
                      <div className="flex items-center text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(patient.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-5 px-3">
                      <Badge
                        variant="default"
                        className="bg-success/15 text-success hover:bg-success/25 border-success/20 px-3 py-1"
                      >
                        Active
                      </Badge>
                    </td>
                    <td className="py-5 px-3">
                      <div className="flex items-center space-x-2">
                        <Link to={`/patients/${patient.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-accent transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
