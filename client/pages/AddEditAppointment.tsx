import { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  Save,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Loader2,
} from "lucide-react";
import {
  db,
  type Patient,
  type AppointmentWithPatient,
  type AppointmentFormData,
} from "@/lib/database";

interface FormData {
  patient_id: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface FormErrors {
  patient_id?: string;
  date?: string;
  time?: string;
  reason?: string;
}

export default function AddEditAppointment() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditing = Boolean(appointmentId);
  const preSelectedPatientId = searchParams.get("patientId");

  const [formData, setFormData] = useState<FormData>({
    patient_id: preSelectedPatientId || "",
    date: "",
    time: "",
    reason: "",
    notes: "",
    status: "pending",
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointment, setAppointment] = useState<AppointmentWithPatient | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Load patients and appointment data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load patients
        const { data: patientsData, error: patientsError } =
          await db.getPatients();
        if (patientsError) {
          console.error("Error loading patients:", patientsError);
          setSubmitStatus({
            type: "error",
            message: "Failed to load patients",
          });
        } else {
          setPatients(patientsData || []);
        }

        // Load appointment data for editing
        if (isEditing && appointmentId) {
          const { data: appointmentData, error: appointmentError } =
            await db.getAppointment(appointmentId);
          if (appointmentError) {
            console.error("Error loading appointment:", appointmentError);
            setSubmitStatus({
              type: "error",
              message: "Failed to load appointment",
            });
          } else if (appointmentData) {
            setAppointment(appointmentData);
            setFormData({
              patient_id: appointmentData.patient_id,
              date: appointmentData.date,
              time: appointmentData.time,
              reason: appointmentData.reason,
              notes: appointmentData.notes || "",
              status: appointmentData.status,
            });
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setSubmitStatus({ type: "error", message: "Failed to load data" });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isEditing, appointmentId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Patient validation
    if (!formData.patient_id) {
      newErrors.patient_id = "Please select a patient";
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = "Appointment date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Appointment date cannot be in the past";
      }
    }

    // Time validation
    if (!formData.time) {
      newErrors.time = "Appointment time is required";
    } else if (formData.date) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      const now = new Date();
      if (selectedDateTime < now) {
        newErrors.time = "Appointment time cannot be in the past";
      }
    }

    // Reason validation
    if (!formData.reason.trim()) {
      newErrors.reason = "Appointment reason is required";
    } else if (formData.reason.trim().length < 3) {
      newErrors.reason = "Reason must be at least 3 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear submit status when user modifies form
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors below before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const appointmentData: AppointmentFormData = {
        patient_id: formData.patient_id,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        notes: formData.notes || undefined,
        status: formData.status,
      };

      let result;
      if (isEditing && appointmentId) {
        // Update existing appointment
        result = await db.updateAppointment(appointmentId, appointmentData);
      } else {
        // Create new appointment
        result = await db.createAppointment(appointmentData);
      }

      if (result.error) {
        throw new Error(result.error.message || "Failed to save appointment");
      }

      const selectedPatient = patients.find(
        (p) => p.id === formData.patient_id,
      );

      setSubmitStatus({
        type: "success",
        message: isEditing
          ? `Appointment updated successfully for ${selectedPatient?.name}!`
          : `Appointment scheduled successfully for ${selectedPatient?.name}!`,
      });

      // Redirect after success
      setTimeout(() => {
        if (preSelectedPatientId) {
          navigate(`/patients/${preSelectedPatientId}`);
        } else {
          navigate("/appointments");
        }
      }, 2000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = patients.find((p) => p.id === formData.patient_id);

  // Generate time slots (every 30 minutes from 8:00 AM to 6:00 PM)
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const displayTime = new Date(
        `2000-01-01T${timeString}`,
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      timeSlots.push({ value: timeString, label: displayTime });
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <Link
            to={
              preSelectedPatientId
                ? `/patients/${preSelectedPatientId}`
                : "/appointments"
            }
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {preSelectedPatientId
              ? "Back to Patient Profile"
              : "Back to Appointments"}
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              {isEditing ? "Edit Appointment" : "Schedule Appointment"}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {isEditing
              ? "Update appointment details and time"
              : "Book a new appointment for your patient"}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <div className="text-muted-foreground">Loading...</div>
        </div>
      ) : (
        <>
          {/* Status Messages */}
          {submitStatus.type && (
            <Alert
              className={`border-0 ${
                submitStatus.type === "success"
                  ? "bg-success/15 text-success border-success/20"
                  : "bg-destructive/15 text-destructive border-destructive/20"
              }`}
            >
              {submitStatus.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className="font-medium">
                {submitStatus.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Appointment Details */}
              <div className="lg:col-span-2">
                <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center text-xl font-bold">
                      <div className="p-2 bg-primary/20 rounded-lg mr-3">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      Appointment Details
                    </CardTitle>
                    <CardDescription className="text-base">
                      Select patient, date, time, and appointment details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Patient Selection */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="patient"
                        className="text-sm font-semibold flex items-center"
                      >
                        <User className="w-4 h-4 mr-2 text-primary" />
                        Patient *
                      </Label>
                      <Select
                        value={formData.patient_id}
                        onValueChange={(value) =>
                          handleInputChange("patient_id", value)
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                            errors.patient_id
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem
                              key={patient.id}
                              value={patient.id}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-primary">
                                    {patient.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {patient.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {patient.email}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.patient_id && (
                        <p className="text-sm text-destructive flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.patient_id}
                        </p>
                      )}
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="date"
                          className="text-sm font-semibold flex items-center"
                        >
                          <Calendar className="w-4 h-4 mr-2 text-primary" />
                          Date *
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            handleInputChange("date", e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                            errors.date
                              ? "border-destructive focus:border-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors.date && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="time"
                          className="text-sm font-semibold flex items-center"
                        >
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          Time *
                        </Label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) =>
                            handleInputChange("time", value)
                          }
                          disabled={isSubmitting}
                        >
                          <SelectTrigger
                            className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                              errors.time
                                ? "border-destructive focus:border-destructive"
                                : ""
                            }`}
                          >
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem
                                key={slot.value}
                                value={slot.value}
                                className="cursor-pointer"
                              >
                                {slot.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.time && (
                          <p className="text-sm text-destructive flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.time}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="reason"
                        className="text-sm font-semibold flex items-center"
                      >
                        <Stethoscope className="w-4 h-4 mr-2 text-primary" />
                        Reason for Visit *
                      </Label>
                      <Input
                        id="reason"
                        type="text"
                        placeholder="e.g., Annual Checkup, Follow-up, Consultation"
                        value={formData.reason}
                        onChange={(e) =>
                          handleInputChange("reason", e.target.value)
                        }
                        className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                          errors.reason
                            ? "border-destructive focus:border-destructive"
                            : ""
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.reason && (
                        <p className="text-sm text-destructive flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.reason}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="notes"
                        className="text-sm font-semibold flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-2 text-primary" />
                        Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes, instructions, or special requirements for this appointment..."
                        value={formData.notes}
                        onChange={(e) =>
                          handleInputChange("notes", e.target.value)
                        }
                        className="min-h-[120px] rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all resize-none"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional additional information about the appointment
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Form Actions */}
                <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold">Actions</CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Update appointment details"
                        : "Schedule new appointment"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full shadow-sm hover:shadow-md transition-shadow"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isEditing ? "Updating..." : "Scheduling..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {isEditing
                            ? "Update Appointment"
                            : "Schedule Appointment"}
                        </>
                      )}
                    </Button>
                    <Link
                      to={
                        preSelectedPatientId
                          ? `/patients/${preSelectedPatientId}`
                          : "/appointments"
                      }
                      className="block"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        className="w-full shadow-sm hover:shadow-md transition-shadow"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Selected Patient Info */}
                {selectedPatient && (
                  <Card className="shadow-md border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <div className="p-2 bg-primary/20 rounded-lg mr-3">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        Selected Patient
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {selectedPatient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {selectedPatient.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedPatient.email}
                          </div>
                          <Link
                            to={`/patients/${selectedPatient.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View patient profile
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Appointment Summary */}
                {formData.date && formData.time && (
                  <Card className="shadow-md border-0 bg-gradient-to-br from-success/5 to-success/10">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-bold flex items-center">
                        <div className="p-2 bg-success/20 rounded-lg mr-3">
                          <Calendar className="w-4 h-4 text-success" />
                        </div>
                        Appointment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">
                          {new Date(formData.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">
                          {new Date(
                            `2000-01-01T${formData.time}`,
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      {formData.reason && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="font-medium text-right max-w-32">
                            {formData.reason}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Tips */}
                <Card className="shadow-md border-0 bg-gradient-to-br from-info/5 to-info/10">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold flex items-center">
                      <div className="p-2 bg-info/20 rounded-lg mr-3">
                        <AlertCircle className="w-4 h-4 text-info" />
                      </div>
                      Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>• Select patients from your active patient list</p>
                      <p>• Choose appropriate time slots during office hours</p>
                      <p>• Be specific about the reason for the visit</p>
                      <p>
                        • Use notes for special instructions or preparations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
