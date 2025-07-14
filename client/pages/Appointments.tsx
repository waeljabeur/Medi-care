import { useState, useEffect } from "react";
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
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db, type AppointmentWithPatient } from "@/lib/database";

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load appointments from database
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const { data, error } = await db.getAppointments();

        if (error) {
          console.error("Error loading appointments:", error);
          setError("Failed to load appointments");
          setAppointments([]);
        } else {
          setAppointments(data || []);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading appointments:", err);
        setError("Failed to load appointments");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // Helper function to format time from 24h to 12h format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Calculate stats from appointments
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today);
  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending",
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );

  // Get start and end of current week
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
  const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  const weekStartStr = weekStart.toISOString().split("T")[0];
  const weekEndStr = weekEnd.toISOString().split("T")[0];
  const thisWeekAppointments = appointments.filter(
    (apt) => apt.date >= weekStartStr && apt.date <= weekEndStr,
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Appointments
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Schedule and manage patient appointments
          </p>
        </div>
        <Link to="/appointments/new">
          <Button
            size="default"
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </Link>
      </div>

      {/* Calendar Navigation and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">January 2024</span>
            </div>
          </Card>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              Today
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              className="pl-10 w-full sm:w-60"
            />
          </div>
          <Link to="/calendar">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md border-0 bg-gradient-to-br from-primary/5 to-primary/10 group hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                  Today
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {todayAppointments.length}
                </p>
              </div>
              <div className="p-3 bg-primary/20 rounded-2xl group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 bg-gradient-to-br from-info/5 to-info/10 group hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                  This Week
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {thisWeekAppointments.length}
                </p>
              </div>
              <div className="p-3 bg-info/20 rounded-2xl group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 bg-gradient-to-br from-warning/5 to-warning/10 group hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-3xl font-bold text-foreground">1</p>
              </div>
              <div className="p-3 bg-warning/20 rounded-2xl group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md border-0 bg-gradient-to-br from-success/5 to-success/10 group hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-3xl font-bold text-foreground">45</p>
              </div>
              <div className="p-3 bg-success/20 rounded-2xl group-hover:scale-110 transition-transform">
                <Calendar className="w-8 h-8 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold">
            Upcoming Appointments
          </CardTitle>
          <CardDescription className="text-base">
            View and manage your scheduled appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-6 bg-background/50 border border-border/50 rounded-xl hover:bg-background hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg">
                      {appointment.patient}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium mb-2">
                      {appointment.reason}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-muted-foreground font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground font-medium">
                        <Clock className="w-4 h-4 mr-2" />
                        {appointment.time} ({appointment.duration})
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold px-3 py-1 bg-muted/30"
                  >
                    {appointment.type}
                  </Badge>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      appointment.status === "confirmed"
                        ? "bg-success/15 text-success hover:bg-success/25 border-success/20 px-3 py-1"
                        : appointment.status === "pending"
                          ? "bg-warning/15 text-warning hover:bg-warning/25 border-warning/20 px-3 py-1"
                          : "px-3 py-1"
                    }
                  >
                    {appointment.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
