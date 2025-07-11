import { useParams, Link } from "react-router-dom";
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
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  Phone,
  User,
  FileText,
  Plus,
  MapPin,
  Activity,
  CheckCircle,
  AlertCircle,
  History,
} from "lucide-react";

// Mock patient data - in real app this would come from API based on patientId
const mockPatientData = {
  1: {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1990-03-15",
    address: "123 Main St, Anytown, ST 12345",
    emergencyContact: "John Wilson - (555) 123-4568",
    status: "active",
    medicalHistory: `Patient has a history of seasonal allergies and mild asthma. No known drug allergies. Previous surgeries include appendectomy in 2018. Family history includes diabetes (father) and hypertension (mother). Patient is generally healthy and maintains regular exercise routine.

Recent concerns include occasional headaches and difficulty sleeping. Recommended stress management techniques and sleep hygiene improvements.

Last blood work (January 2024) showed normal ranges for all markers. Blood pressure consistently normal. Recommended annual wellness check and routine vaccinations up to date.`,
    insurance: "Blue Cross Blue Shield",
    doctorNotes:
      "Patient is compliant with treatment plans and communicates well about symptoms.",
    createdAt: "2023-01-15",
  },
  2: {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1982-07-22",
    address: "456 Oak Ave, Somewhere, ST 67890",
    emergencyContact: "Lisa Chen - (555) 234-5679",
    status: "active",
    medicalHistory: `Patient presents with hypertension diagnosed in 2020. Currently managed with ACE inhibitor (Lisinopril 10mg daily). Blood pressure readings have been stable over the past 6 months.

No known allergies. Previous medical history includes broken wrist in 2019, healed without complications. Family history significant for cardiovascular disease.

Patient reports good adherence to medications and dietary modifications. Regular exercise routine established. Occasional stress-related symptoms managed with relaxation techniques.`,
    insurance: "Aetna",
    doctorNotes:
      "Excellent patient compliance. Hypertension well-controlled with current medication regimen.",
    createdAt: "2023-03-20",
  },
  3: {
    id: 3,
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1996-11-08",
    address: "789 Pine Rd, Elsewhere, ST 13579",
    emergencyContact: "Tom Davis - (555) 345-6790",
    status: "pending",
    medicalHistory: `New patient with history of anxiety and depression. Currently taking sertraline 50mg daily with good response. No adverse reactions reported.

Patient reports significant improvement in mood and anxiety levels over the past 3 months. Sleep patterns have normalized. No current concerns with medication.

Recommended continued psychiatric follow-up and therapy. Patient is motivated and engaged in treatment. Family history includes anxiety disorders.`,
    insurance: "Kaiser Permanente",
    doctorNotes:
      "New patient showing excellent progress with current treatment plan. Continue monitoring.",
    createdAt: "2024-01-10",
  },
};

const mockAppointments = {
  1: [
    {
      id: 1,
      date: "2024-01-25",
      time: "9:00 AM",
      reason: "Follow-up Consultation",
      status: "upcoming",
      type: "follow-up",
      notes: "Review recent lab results and discuss treatment plan.",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "2:00 PM",
      reason: "Annual Checkup",
      status: "completed",
      type: "routine",
      notes:
        "Complete physical examination. All vitals normal. Recommended routine blood work.",
    },
    {
      id: 3,
      date: "2023-12-10",
      time: "10:30 AM",
      reason: "Blood Test Review",
      status: "completed",
      type: "consultation",
      notes: "Blood work results discussed. All markers within normal range.",
    },
    {
      id: 4,
      date: "2023-11-15",
      time: "3:30 PM",
      reason: "Headache Consultation",
      status: "completed",
      type: "consultation",
      notes:
        "Discussed tension headaches. Recommended stress management and improved sleep hygiene.",
    },
  ],
  2: [
    {
      id: 5,
      date: "2024-01-28",
      time: "11:00 AM",
      reason: "Blood Pressure Check",
      status: "upcoming",
      type: "follow-up",
      notes: "Regular BP monitoring appointment.",
    },
    {
      id: 6,
      date: "2024-01-12",
      time: "10:30 AM",
      reason: "Medication Review",
      status: "completed",
      type: "follow-up",
      notes:
        "Reviewed hypertension medication. Patient reports good compliance. BP stable.",
    },
  ],
  3: [
    {
      id: 7,
      date: "2024-02-01",
      time: "2:00 PM",
      reason: "Initial Consultation",
      status: "upcoming",
      type: "consultation",
      notes: "New patient intake and assessment.",
    },
  ],
};

export default function PatientProfile() {
  const { patientId } = useParams<{ patientId: string }>();

  // In real app, fetch patient data based on patientId and verify doctor ownership
  const patient = patientId
    ? mockPatientData[parseInt(patientId) as keyof typeof mockPatientData]
    : null;
  const appointments = patientId
    ? mockAppointments[parseInt(patientId) as keyof typeof mockAppointments] ||
      []
    : [];

  if (!patient) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Patient Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The patient you're looking for doesn't exist or you don't have
            access to view their profile.
          </p>
          <Link to="/patients">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming",
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );
  const age =
    new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <Link
            to="/patients"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Patients
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              {patient.name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant={patient.status === "active" ? "default" : "secondary"}
              className={
                patient.status === "active"
                  ? "bg-success/15 text-success hover:bg-success/25 border-success/20 px-3 py-1"
                  : "bg-warning/15 text-warning hover:bg-warning/25 border-warning/20 px-3 py-1"
              }
            >
              {patient.status === "active" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {patient.status}
            </Badge>
            <span className="text-muted-foreground text-sm">
              Patient since {new Date(patient.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link to={`/appointments/new?patientId=${patient.id}`}>
            <Button
              size="default"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Appointment
            </Button>
          </Link>
          <Link to={`/patients/${patient.id}/edit`}>
            <Button
              variant="outline"
              size="default"
              className="shadow-sm hover:shadow-md transition-shadow"
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Details */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <User className="w-5 h-5 text-primary" />
                </div>
                Patient Details
              </CardTitle>
              <CardDescription className="text-base">
                Personal and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </p>
                      <p className="font-semibold text-foreground">
                        {patient.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-info/10 to-info/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-semibold text-foreground">
                        {new Date(patient.dateOfBirth).toLocaleDateString()} (
                        {age} years old)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-success/10 to-success/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Email
                      </p>
                      <p className="font-semibold text-foreground">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-warning/10 to-warning/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p className="font-semibold text-foreground">
                        {patient.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Address
                      </p>
                      <p className="font-semibold text-foreground">
                        {patient.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500/10 to-rose-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Emergency Contact
                      </p>
                      <p className="font-semibold text-foreground">
                        {patient.emergencyContact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Insurance
                    </p>
                    <p className="font-semibold text-foreground">
                      {patient.insurance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Patient ID
                    </p>
                    <p className="font-semibold text-foreground">
                      #P{patient.id.toString().padStart(4, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                Medical History
              </CardTitle>
              <CardDescription className="text-base">
                Patient's medical background and notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="bg-background/50 rounded-xl p-6 border border-border/50">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {patient.medicalHistory}
                  </p>
                </div>
              </div>
              {patient.doctorNotes && (
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-primary" />
                    Doctor's Notes
                  </h4>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <p className="text-foreground text-sm">
                      {patient.doctorNotes}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointments Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Appointments */}
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <div className="p-2 bg-info/20 rounded-lg mr-3">
                  <Calendar className="w-4 h-4 text-info" />
                </div>
                Upcoming Appointments
              </CardTitle>
              <CardDescription>
                {upcomingAppointments.length} scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-background/50 border border-border/50 rounded-xl hover:bg-background transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground text-sm">
                          {appointment.reason}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs bg-info/10 text-info border-info/20"
                        >
                          {appointment.type}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No upcoming appointments
                  </p>
                  <Link to={`/appointments/new?patientId=${patient.id}`}>
                    <Button size="sm" className="mt-3">
                      <Plus className="w-3 h-3 mr-1" />
                      Schedule
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Appointments */}
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <div className="p-2 bg-success/20 rounded-lg mr-3">
                  <History className="w-4 h-4 text-success" />
                </div>
                Past Appointments
              </CardTitle>
              <CardDescription>
                {pastAppointments.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length > 0 ? (
                <div className="space-y-3">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 bg-background/30 border border-border/30 rounded-xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground text-sm">
                          {appointment.reason}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-xs bg-success/10 text-success border-success/20"
                        >
                          completed
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                  {pastAppointments.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All ({pastAppointments.length - 5} more)
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No past appointments
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
