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
import React, { useEffect, useState } from "react";
import { useDoctor } from "@/contexts/DoctorContext-simple";
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
  time: string;
  date: string;
  reason?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function Dashboard() {
  const { doctor, loading: doctorLoading, error: doctorError } = useDoctor();
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
      if (!doctor) return; // Wait for doctor to be loaded

      try {
        setLoading(true);
        setError(null);

        // Load patients count
        const { count: totalPatients } = await supabase
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", doctor.id);

        // Load today's appointments
        const today = new Date().toISOString().split("T")[0];
        const { count: todaysAppointments } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("date", today)
          .eq("doctor_id", doctor.id)
          .in("status", ["confirmed", "pending"]);

        // Load this month's new patients
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count: thisMonthPatients } = await supabase
          .from("patients")
          .select("*", { count: "exact", head: true })
          .eq("doctor_id", doctor.id)
          .gte("created_at", startOfMonth.toISOString());

        // Load upcoming appointments with patient names
        const { data: appointments } = await supabase
          .from("appointments")
          .select(
            `
            id,
            patient_id,
            date,
            time,
            reason,
            status,
            patients!inner(name)
          `,
          )
          .in("status", ["confirmed", "pending"])
          .eq("doctor_id", doctor.id)
          .gte("date", today)
          .order("date", { ascending: true })
          .order("time", { ascending: true })
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
            patient_name: (apt.patients as any)?.name || "Unknown Patient",
            patient_id: apt.patient_id,
            time: apt.time,
            date: apt.date,
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
  }, [doctor]);

  if (loading || doctorLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">
          {doctorLoading ? "Loading doctor profile..." : "Loading dashboard..."}
        </span>
      </div>
    );
  }

  if (doctorError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">
          Error loading doctor: {doctorError}
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
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
            Welcome back, {doctor?.name ? `Dr. ${doctor.name}` : "Doctor"}.
            Here's what's happening today.
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
              {upcomingAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  to={`/patients/${appointment.patient_id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-5 bg-background/50 border border-border/50 rounded-xl hover:bg-background hover:shadow-md transition-all duration-200 group cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-base">
                          {appointment.patient_name}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {appointment.reason || "Appointment"}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(
                            appointment.date,
                          ).toLocaleDateString()} at {appointment.time}
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

        {/* Quick Actions */}
        <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-base">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/patients/new">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Patient
                </Button>
              </Link>
              <Link to="/appointments/new">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </Link>
              <Link to="/calendar">
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
