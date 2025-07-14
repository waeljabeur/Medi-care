import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ViewToggle, type ViewType } from "@/components/ui/view-toggle";
import { PrintExportCalendar } from "@/components/ui/print-export-calendar";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Grid3X3,
  ArrowLeft,
  Stethoscope,
  FileText,
} from "lucide-react";
import { db, type AppointmentWithPatient } from "@/lib/database";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  // Get current month/year for display
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setViewType("day");
    setCurrentDate(date);
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === dateString);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === currentMonth;
      const isToday =
        date.toDateString() === today.toDateString() && isCurrentMonth;
      const appointments = getAppointmentsForDate(date);

      days.push({
        date,
        isCurrentMonth,
        isToday,
        appointments,
        dayNumber: date.getDate(),
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-8 print-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Calendar View
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            View and manage your appointment schedule
          </p>
        </div>
        <div className="flex items-center space-x-3 no-print">
          <Link to="/appointments/new">
            <Button
              size="default"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {monthNames[currentMonth]} {currentYear}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Your appointment schedule overview
                    </CardDescription>
                  </div>
                </div>

                {/* Controls Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* View Type Selector */}
                    <ViewToggle
                      currentView={viewType}
                      onViewChange={setViewType}
                    />

                    {/* Navigation Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousDay}
                        className="h-9 w-9 p-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToToday}
                        className="h-9 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-medical-50 to-medical-100/50 hover:from-medical-100 hover:to-medical-200/50 text-medical-700 border-medical-200/50"
                      >
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextDay}
                        className="h-9 w-9 p-0 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {viewType === "month" && (
                <div className="space-y-4">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 gap-px">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-sm font-semibold text-muted-foreground bg-muted/30 rounded-lg"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden calendar-grid">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[120px] bg-background p-2 transition-colors hover:bg-muted/20 cursor-pointer calendar-day ${
                          !day.isCurrentMonth ? "opacity-30" : ""
                        } ${
                          day.isToday
                            ? "bg-primary/5 border-2 border-primary/20"
                            : ""
                        }`}
                        onClick={() => handleDayClick(day.date)}
                      >
                        <div className="space-y-2">
                          {/* Date Number */}
                          <div
                            className={`text-sm font-medium ${
                              day.isToday
                                ? "w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center"
                                : day.isCurrentMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {day.dayNumber}
                          </div>

                          {/* Appointments */}
                          <div className="space-y-1">
                            {day.appointments.slice(0, 2).map((apt) => (
                              <Link
                                key={apt.id}
                                to={`/patients/${apt.patient_id}`}
                                className="block"
                              >
                                <div
                                  className={`p-1 px-2 rounded text-xs font-medium cursor-pointer transition-colors appointment-item ${
                                    apt.status === "confirmed"
                                      ? "bg-success/15 text-success hover:bg-success/25"
                                      : "bg-warning/15 text-warning hover:bg-warning/25"
                                  }`}
                                >
                                  <div className="truncate">
                                    {apt.time} {apt.patient.name}
                                  </div>
                                  <div className="truncate text-xs opacity-80">
                                    {apt.reason}
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {day.appointments.length > 2 && (
                              <div className="text-xs text-muted-foreground px-2">
                                +{day.appointments.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Week View Placeholder */}
              {viewType === "week" && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Week View
                  </h3>
                  <p className="text-muted-foreground">
                    Week view will display appointments for the current week
                  </p>
                </div>
              )}

              {/* Day View */}
              {viewType === "day" && selectedDate && (
                <div className="space-y-6">
                  {/* Day Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-border/50">
                    <div className="text-center flex-1">
                      <h2 className="text-2xl font-bold text-foreground">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Detailed schedule for this day
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewType("month")}
                      className="ml-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-medical-50 to-medical-100/50 hover:from-medical-100 hover:to-medical-200/50 text-medical-700 border-medical-200/50"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Month View
                    </Button>
                  </div>

                  {(() => {
                    const dayAppointments =
                      getAppointmentsForDate(selectedDate);

                    if (dayAppointments.length === 0) {
                      return (
                        <div className="text-center py-12">
                          <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            No Appointments
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            No appointments scheduled for this day
                          </p>
                          <Link to="/appointments/new">
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Schedule Appointment
                            </Button>
                          </Link>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            {dayAppointments.length} Appointment
                            {dayAppointments.length !== 1 ? "s" : ""}
                          </h3>
                          <Link to="/appointments/new">
                            <Button size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Appointment
                            </Button>
                          </Link>
                        </div>

                        <div className="space-y-3">
                          {dayAppointments
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map((apt) => (
                              <Link
                                key={apt.id}
                                to={`/patients/${apt.patient_id}`}
                                className="block"
                              >
                                <div className="p-6 bg-background/50 border border-border/50 rounded-xl hover:bg-background hover:shadow-md transition-all duration-200 group">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4">
                                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <User className="w-6 h-6 text-primary" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                          <h4 className="font-bold text-foreground text-lg">
                                            {apt.patient.name}
                                          </h4>
                                          <Badge
                                            variant="outline"
                                            className={`text-xs ${
                                              apt.status === "confirmed"
                                                ? "bg-success/15 text-success border-success/20"
                                                : "bg-warning/15 text-warning border-warning/20"
                                            }`}
                                          >
                                            {apt.status}
                                          </Badge>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {new Date(
                                              `2000-01-01T${apt.time}`,
                                            ).toLocaleTimeString("en-US", {
                                              hour: "numeric",
                                              minute: "2-digit",
                                              hour12: true,
                                            })}
                                          </div>
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Stethoscope className="w-4 h-4 mr-2" />
                                            {apt.reason}
                                          </div>
                                          {apt.notes && (
                                            <div className="flex items-start text-sm text-muted-foreground">
                                              <FileText className="w-4 h-4 mr-2 mt-0.5" />
                                              <span className="flex-1">
                                                {apt.notes}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8 no-print">
          {/* Print/Export Calendar */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-medical-50 to-medical-100/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center">
                <div className="p-2 bg-medical-500/20 rounded-lg mr-3">
                  <FileText className="w-4 h-4 text-medical-600" />
                </div>
                Export & Print
              </CardTitle>
              <CardDescription>Download or print your calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <PrintExportCalendar
                appointments={appointments}
                currentDate={currentDate}
                viewType={viewType}
              />
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                Today's Schedule
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const todayString = new Date().toISOString().split("T")[0];
                const todayAppointments = appointments.filter(
                  (apt) => apt.date === todayString,
                );

                if (todayAppointments.length === 0) {
                  return (
                    <div className="text-center py-6">
                      <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No appointments today
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3">
                    {todayAppointments.map((apt) => (
                      <Link
                        key={apt.id}
                        to={`/patients/${apt.patient_id}`}
                        className="block"
                      >
                        <div className="p-3 bg-background/50 border border-border/50 rounded-xl hover:bg-background transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-foreground text-sm">
                              {apt.patient}
                            </h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                apt.status === "confirmed"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-warning/10 text-warning border-warning/20"
                              }`}
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {apt.time}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {apt.reason}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <User className="w-4 h-4 text-primary" />
                </div>
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Appointments
                </span>
                <span className="font-semibold">{mockAppointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Confirmed</span>
                <span className="font-semibold text-success">
                  {
                    mockAppointments.filter((apt) => apt.status === "confirmed")
                      .length
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-semibold text-warning">
                  {
                    mockAppointments.filter((apt) => apt.status === "pending")
                      .length
                  }
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-md border-0 bg-gradient-to-br from-info/5 to-info/10">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/appointments/new" className="block">
                <Button variant="outline" className="w-full h-16 flex-col">
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-xs leading-tight">
                    Schedule
                    <br />
                    Appointment
                  </span>
                </Button>
              </Link>
              <Link to="/patients" className="block">
                <Button variant="outline" className="w-full h-16 flex-col">
                  <User className="w-5 h-5 mb-1" />
                  <span className="text-xs leading-tight">
                    View
                    <br />
                    Patients
                  </span>
                </Button>
              </Link>
              <Link to="/appointments" className="block">
                <Button variant="outline" className="w-full h-16 flex-col">
                  <Calendar className="w-5 h-5 mb-1" />
                  <span className="text-xs leading-tight">
                    Appointments
                    <br />
                    List
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
