import React, { useState } from "react";
import { PrintExportCalendar } from "@/components/ui/print-export-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

// Sample appointments data for demo
const demoAppointments = [
  {
    id: 1,
    patientId: 1,
    patient: "Emma Wilson",
    date: "2024-01-20",
    time: "09:00",
    reason: "Annual Checkup",
    status: "confirmed",
    notes: "Complete physical examination including blood work",
  },
  {
    id: 2,
    patientId: 2,
    patient: "Michael Chen",
    date: "2024-01-20",
    time: "11:00",
    reason: "Blood Pressure Check",
    status: "confirmed",
    notes: "Follow-up on hypertension medication",
  },
  {
    id: 3,
    patientId: 3,
    patient: "Sarah Davis",
    date: "2024-01-22",
    time: "14:00",
    reason: "Consultation",
    status: "pending",
    notes: "New patient consultation for chronic pain",
  },
  {
    id: 4,
    patientId: 1,
    patient: "Emma Wilson",
    date: "2024-01-25",
    time: "10:30",
    reason: "Follow-up",
    status: "confirmed",
    notes: "Review test results and discuss treatment plan",
  },
];

export default function PrintExportDemo() {
  const [currentDate] = useState(new Date(2024, 0, 20)); // January 20, 2024
  const [viewType] = useState<"day" | "week" | "month">("month");

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link
            to="/calendar"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Link>
          <h1 className="text-4xl font-bold text-foreground">
            Print/Export Calendar Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive demonstration of the calendar print and export
            functionality
          </p>
        </div>

        {/* Component Demo */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Demo Controls */}
          <Card className="shadow-lg xl:col-span-1">
            <CardHeader>
              <CardTitle>Demo Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-medical-50 to-medical-100/30 rounded-xl border border-medical-200/50">
                  <Calendar className="w-8 h-8 text-medical-600 mx-auto mb-2" />
                  <p className="text-sm text-medical-700 font-medium">
                    Current View: <strong>Month</strong>
                  </p>
                  <p className="text-xs text-medical-600 mt-1">January 2024</p>
                </div>

                <PrintExportCalendar
                  appointments={demoAppointments}
                  currentDate={currentDate}
                  viewType={viewType}
                />

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">
                    📋 Sample Data
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    The demo uses {demoAppointments.length} sample appointments
                    from January 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Appointments */}
          <Card className="shadow-lg xl:col-span-2">
            <CardHeader>
              <CardTitle>Sample Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-background/50 border border-border/50 rounded-xl appointment-item"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-medical-100 to-medical-200 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-medical-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {apt.patient}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {apt.reason}
                          </p>
                        </div>
                      </div>
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

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(apt.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        {apt.time}
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Notes:</strong> {apt.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">🖨️ Print Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Opens the browser's native print dialog with optimized styles
                  for printing.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Hides navigation and sidebar</li>
                  <li>Print-friendly colors</li>
                  <li>Optimized calendar layout</li>
                  <li>Appointment details included</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">📄 Export PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Generates a professional PDF document with appointment
                  details.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Formatted appointment list</li>
                  <li>Medical theme colors</li>
                  <li>Auto-paginated content</li>
                  <li>Generated timestamp</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">📊 Export CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Downloads appointment data as a CSV file for spreadsheet
                  analysis.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Structured data format</li>
                  <li>Compatible with Excel</li>
                  <li>Includes all appointment fields</li>
                  <li>Easy data analysis</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">🔧 Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>React component with TypeScript</li>
                  <li>Responsive design (mobile/desktop)</li>
                  <li>Medical theme integration</li>
                  <li>View-specific filtering</li>
                  <li>Error handling and user feedback</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">
                  📚 Dependencies
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>jsPDF for PDF generation</li>
                  <li>Browser Print API</li>
                  <li>Tailwind CSS for styling</li>
                  <li>Lucide React for icons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
