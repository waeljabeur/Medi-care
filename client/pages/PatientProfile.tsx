import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { supabase, isDemoMode } from "@/lib/supabase";

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dob?: string;
  medical_history?: string;
  created_at: string;
  doctor_id: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  reason?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

// Mock patient data - used when in demo mode
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
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPatientData() {
      if (!patientId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (isDemoMode()) {
          // Use mock data in demo mode
          const mockPatient =
            mockPatientData[
              parseInt(patientId) as keyof typeof mockPatientData
            ];
          if (mockPatient) {
            // Convert mock data to match Patient interface
            setPatient({
              id: patientId,
              name: mockPatient.name,
              email: mockPatient.email,
              phone: mockPatient.phone,
              dob: mockPatient.dateOfBirth,
              medical_history: mockPatient.medicalHistory,
              created_at: mockPatient.createdAt,
              doctor_id: "demo-doctor",
            });

            // Convert mock appointments
            const mockAppts =
              mockAppointments[
                parseInt(patientId) as keyof typeof mockAppointments
              ] || [];
            setAppointments(
              mockAppts.map((apt) => ({
                id: apt.id.toString(),
                patient_id: patientId,
                appointment_date: apt.date,
                appointment_time: apt.time,
                reason: apt.reason,
                status: apt.status === "upcoming" ? "scheduled" : "completed",
                notes: apt.notes,
              })),
            );
          }
        } else {
          // Load from Supabase
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            setError("Please log in to view patient profiles");
            return;
          }

          // First get the doctor profile
          const { data: doctorData } = await supabase
            .from("doctors")
            .select("id")
            .eq("user_id", user.id)
            .single();

          if (!doctorData) {
            setError("Doctor profile not found");
            return;
          }

          // Load patient data
          const { data: patientData, error: patientError } = await supabase
            .from("patients")
            .select("*")
            .eq("id", patientId)
            .eq("doctor_id", doctorData.id)
            .single();

          if (patientError) {
            console.error("Error loading patient:", patientError);
            if (patientError.code === "PGRST116") {
              setError(
                "Patient not found or you don't have access to view this patient",
              );
            } else {
              setError("Failed to load patient data");
            }
            return;
          }

          setPatient(patientData);

          // Load appointments
          const { data: appointmentsData, error: appointmentsError } =
            await supabase
              .from("appointments")
              .select("*")
              .eq("patient_id", patientId)
              .order("appointment_date", { ascending: false });

          if (appointmentsError) {
            console.error("Error loading appointments:", appointmentsError);
            // Don't fail if appointments can't be loaded
            setAppointments([]);
          } else {
            setAppointments(appointmentsData || []);
          }
        }
      } catch (err) {
        console.error("Error in loadPatientData:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadPatientData();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading patient...</span>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Patient Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            {error ||
              "The patient you're looking for doesn't exist or you don't have access to view their profile."}
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
    (apt) => apt.status === "scheduled",
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );
  const age = patient.dob
    ? new Date().getFullYear() - new Date(patient.dob).getFullYear()
    : null;

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
              variant="default"
              className="bg-success/15 text-success hover:bg-success/25 border-success/20 px-3 py-1"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <span className="text-muted-foreground text-sm">
              Patient since {new Date(patient.created_at).toLocaleDateString()}
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
                        {patient.dob
                          ? `${new Date(patient.dob).toLocaleDateString()}${age ? ` (${age} years old)` : ""}`
                          : "Not provided"}
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
                        {patient.email || "Not provided"}
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
                        {patient.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Patient ID
                  </p>
                  <p className="font-semibold text-foreground text-xs">
                    {patient.id}
                  </p>
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
