import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface DashboardStats {
  totalPatients: number;
  todaysAppointments: number;
  thisMonthPatients: number;
  pendingTasks: number;
}

interface UpcomingAppointment {
  id: string;
  patient_name: string;
  patient_id: string;
  appointment_time: string;
  appointment_date: string;
  reason?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todaysAppointments: 0,
    thisMonthPatients: 0,
    pendingTasks: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    UpcomingAppointment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const {
          data: { user },
        } = await supabase!.auth.getUser();
        if (!user) {
          setError("Please log in to view dashboard");
          return;
        }

        // Ensure doctor profile exists
        const { data: existingDoctor } = await supabase
          .from("doctors")
          .select("id")
          .eq("user_id", user.id)
          .single();

        let doctorId = existingDoctor?.id;

        // If no profile exists, create one
        if (!existingDoctor) {
          const { data: newDoctor, error: createError } = await supabase
            .from("doctors")
            .insert({
              user_id: user.id,
              name:
                user.user_metadata?.name ||
                user.email?.split("@")[0] ||
                "Doctor",
              email: user.email || "",
            })
            .select("id")
            .single();

          if (createError) {
            console.error(
              "Failed to create doctor profile:",
              createError.message,
            );
            setError("Failed to setup doctor profile");
            return;
          }
          doctorId = newDoctor.id;
        }

        // Load patients count
        const { count: totalPatients } = await supabase
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", doctorId);

        // Load today's appointments
        const today = new Date().toISOString().split("T")[0];
        const { count: todaysAppointments } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("appointment_date", today)
          .in("status", ["scheduled"]);

        // Load this month's new patients
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: thisMonthPatients } = await supabase
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", doctorId)
          .gte("created_at", startOfMonth.toISOString());

        // Load upcoming appointments with patient names
        const { data: appointments } = await supabase
          .from("appointments")
          .select(
            `
            id,
            patient_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            patients!inner(name)
          `,
          )
          .eq("status", "scheduled")
          .gte("appointment_date", today)
          .order("appointment_date", { ascending: true })
          .order("appointment_time", { ascending: true })
          .limit(5);

        setStats({
          totalPatients: totalPatients || 0,
          todaysAppointments: todaysAppointments || 0,
          thisMonthPatients: thisMonthPatients || 0,
          pendingTasks: 0, // We can calculate this later based on business logic
        });

        setUpcomingAppointments(
          (appointments || []).map((apt) => ({
            id: apt.id,
            patient_name: apt.patients?.name || "Unknown Patient",
            patient_id: apt.patient_id,
            appointment_time: apt.appointment_time,
            appointment_date: apt.appointment_date,
            reason: apt.reason,
            status: apt.status,
          })),
        );
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
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
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Welcome back, Dr. Johnson. Here's what's happening today.
          </p>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/appointments">
            <Button
              size="default"
              variant="outline"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Appointments
            </Button>
          </Link>
          <Link to="/patients/new">
            <Button
              size="default"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Quick Add
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stats.totalPatients}
                </div>
                <div className="flex items-center text-success text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />+
                  {stats.thisMonthPatients} this month
                </div>
              </div>
              <div className="p-4 bg-primary/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <Users className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12"></div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-gradient-to-br from-info/5 to-info/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stats.todaysAppointments}
                </div>
                <div className="text-sm text-muted-foreground">
                  3 confirmed, 1 pending
                </div>
              </div>
              <div className="p-4 bg-info/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <Calendar className="w-7 h-7 text-info" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-info/5 rounded-full -translate-y-12 translate-x-12"></div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stats.thisMonthPatients}
                </div>
                <div className="text-sm text-muted-foreground">
                  New patients added
                </div>
              </div>
              <div className="p-4 bg-success/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <Activity className="w-7 h-7 text-success" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -translate-y-12 translate-x-12"></div>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stats.pendingTasks}
                </div>
                <div className="text-sm text-muted-foreground">
                  Require attention
                </div>
              </div>
              <div className="p-4 bg-warning/20 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                <Clock className="w-7 h-7 text-warning" />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-24 h-24 bg-warning/5 rounded-full -translate-y-12 translate-x-12"></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2 shadow-md border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground">
                Upcoming Appointments
              </CardTitle>
              <Link to="/appointments">
                <Button
                  variant="outline"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-shadow"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <CardDescription className="text-base">
              Your next 5 scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockData.upcomingAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  to={`/patients/${appointment.patientId}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-5 bg-background/50 border border-border/50 rounded-xl hover:bg-background hover:shadow-md transition-all duration-200 group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-base">
                          {appointment.patient}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {appointment.reason}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.date} at {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant={
                          appointment.status === "confirmed"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          appointment.status === "confirmed"
                            ? "bg-success/15 text-success hover:bg-success/25 border-success/20 px-3 py-1"
                            : "bg-warning/15 text-warning hover:bg-warning/25 border-warning/20 px-3 py-1"
                        }
                      >
                        {appointment.status === "confirmed" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-base">
              Latest updates and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity, index) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {activity.type === "patient" && (
                        <Users className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === "appointment" && (
                        <Calendar className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === "update" && (
                        <Activity className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    {index < mockData.recentActivity.length - 1 && (
                      <div className="absolute top-10 left-1/2 w-px h-6 bg-border -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="text-sm text-foreground font-medium">
                      {activity.action}{" "}
                      <span className="font-semibold text-primary">
                        {activity.subject}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-1">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
