import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      time: "9:00 AM",
      date: "Today",
      reason: "Annual Checkup",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "10:30 AM",
      date: "Today",
      reason: "Follow-up",
      status: "confirmed",
    },
    {
      id: 3,
      patient: "Sarah Davis",
      time: "2:00 PM",
      date: "Today",
      reason: "Consultation",
      status: "pending",
    },
    {
      id: 4,
      patient: "Robert Johnson",
      time: "9:00 AM",
      date: "Tomorrow",
      reason: "Blood Test Review",
      status: "confirmed",
    },
    {
      id: 5,
      patient: "Lisa Anderson",
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Dr. Johnson. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button size="sm" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mockData.stats.totalPatients}
                </div>
                <div className="flex items-center text-success text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />+
                  {mockData.stats.thisMonthPatients} this month
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-info">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mockData.stats.todaysAppointments}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  3 confirmed, 1 pending
                </div>
              </div>
              <div className="p-3 bg-info/10 rounded-full">
                <Calendar className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mockData.stats.thisMonthPatients}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  New patients added
                </div>
              </div>
              <div className="p-3 bg-success/10 rounded-full">
                <Activity className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mockData.stats.pendingTasks}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Require attention
                </div>
              </div>
              <div className="p-3 bg-warning/10 rounded-full">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Upcoming Appointments
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <CardDescription>
              Your next 5 scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {appointment.patient}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.reason}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        appointment.status === "confirmed"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        appointment.status === "confirmed"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : ""
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    {activity.type === "patient" && (
                      <Users className="w-4 h-4 text-primary" />
                    )}
                    {activity.type === "appointment" && (
                      <Calendar className="w-4 h-4 text-primary" />
                    )}
                    {activity.type === "update" && (
                      <Activity className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">
                      {activity.action}{" "}
                      <span className="font-medium">{activity.subject}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
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
