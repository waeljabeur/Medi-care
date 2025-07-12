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
} from "lucide-react";

// Mock data - in real app this would come from API
const mockData = {
  stats: {
    totalPatients: 147,
    todaysAppointments: 8,
    thisMonthPatients: 12,
    pendingTasks: 3,
  },
  upcomingAppointments: [
    {
      id: 1,
      patient: "Emma Wilson",
      patientId: 1,
      time: "9:00 AM",
      date: "Today",
      reason: "Annual Checkup",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Michael Chen",
      patientId: 2,
      time: "10:30 AM",
      date: "Today",
      reason: "Follow-up",
      status: "confirmed",
    },
    {
      id: 3,
      patient: "Sarah Davis",
      patientId: 3,
      time: "2:00 PM",
      date: "Today",
      reason: "Consultation",
      status: "pending",
    },
    {
      id: 4,
      patient: "Robert Johnson",
      patientId: 4,
      time: "9:00 AM",
      date: "Tomorrow",
      reason: "Blood Test Review",
      status: "confirmed",
    },
    {
      id: 5,
      patient: "Lisa Anderson",
      patientId: 5,
      time: "11:00 AM",
      date: "Tomorrow",
      reason: "Physical Exam",
      status: "confirmed",
    },
  ],
  recentActivity: [
    {
      id: 1,
      action: "Added new patient",
      subject: "John Smith",
      time: "2 hours ago",
      type: "patient",
    },
    {
      id: 2,
      action: "Completed appointment",
      subject: "Maria Garcia",
      time: "4 hours ago",
      type: "appointment",
    },
    {
      id: 3,
      action: "Updated medical history",
      subject: "David Wilson",
      time: "6 hours ago",
      type: "update",
    },
    {
      id: 4,
      action: "Scheduled appointment",
      subject: "Anna Thompson",
      time: "1 day ago",
      type: "appointment",
    },
  ],
};

export default function Dashboard() {
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
              View Calendar
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
                  {mockData.stats.totalPatients}
                </div>
                <div className="flex items-center text-success text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />+
                  {mockData.stats.thisMonthPatients} this month
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
                  {mockData.stats.todaysAppointments}
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
                  {mockData.stats.thisMonthPatients}
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
                  {mockData.stats.pendingTasks}
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
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
