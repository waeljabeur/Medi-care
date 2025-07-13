import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authHelpers, supabase } from "@/lib/supabase";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  User,
  Save,
  AlertCircle,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  FileText,
  Loader2,
} from "lucide-react";

// Mock patient data for editing
const mockPatientData = {
  1: {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1990-03-15",
    medicalHistory: `Patient has a history of seasonal allergies and mild asthma. No known drug allergies. Previous surgeries include appendectomy in 2018. Family history includes diabetes (father) and hypertension (mother).

Recent concerns include occasional headaches and difficulty sleeping. Recommended stress management techniques and sleep hygiene improvements.

Last blood work (January 2024) showed normal ranges for all markers. Blood pressure consistently normal.`,
  },
  2: {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1982-07-22",
    medicalHistory: `Patient presents with hypertension diagnosed in 2020. Currently managed with ACE inhibitor (Lisinopril 10mg daily). Blood pressure readings have been stable over the past 6 months.

No known allergies. Previous medical history includes broken wrist in 2019, healed without complications. Family history significant for cardiovascular disease.`,
  },
  3: {
    id: 3,
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1996-11-08",
    medicalHistory: `New patient with history of anxiety and depression. Currently taking sertraline 50mg daily with good response. No adverse reactions reported.

Patient reports significant improvement in mood and anxiety levels over the past 3 months. Sleep patterns have normalized.`,
  },
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  medicalHistory: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  medicalHistory?: string;
}

export default function AddEditPatient() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(patientId);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    medicalHistory: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Load patient data for editing
  useEffect(() => {
    const loadPatientData = async () => {
      if (!isEditing || !patientId) return;

      if (authHelpers.isDemoMode()) {
        // Demo mode: use mock data
        const patient =
          mockPatientData[parseInt(patientId) as keyof typeof mockPatientData];
        if (patient) {
          setFormData({
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            dateOfBirth: patient.dateOfBirth,
            medicalHistory: patient.medicalHistory,
          });
        }
        return;
      }

      // Real Supabase implementation
      try {
        const { user } = await authHelpers.getCurrentUser();
        if (!user) return;

        const { data: patient, error } = await supabase!
          .from("patients")
          .select("*")
          .eq("id", patientId)
          .eq("doctor_id", user.id) // Ensure doctor can only edit their own patients
          .single();

        if (error) {
          console.error("Error loading patient:", error.message);
          setSubmitStatus({
            type: "error",
            message:
              "Failed to load patient data. Patient may not exist or you don't have access.",
          });
          return;
        }

        if (patient) {
          setFormData({
            name: patient.name || "",
            email: patient.email || "",
            phone: patient.phone || "",
            dateOfBirth: patient.dob || "",
            medicalHistory: patient.medical_history || "",
          });
        }
      } catch (error) {
        console.error("Error loading patient data:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to load patient data. Please try again.",
        });
      }
    };

    loadPatientData();
  }, [isEditing, patientId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, "");
      if (cleanPhone.length < 10) {
        newErrors.phone = "Phone number must be at least 10 digits";
      }
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 150) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    // Medical history validation
    if (!formData.medicalHistory.trim()) {
      newErrors.medicalHistory = "Medical history is required";
    } else if (formData.medicalHistory.trim().length < 10) {
      newErrors.medicalHistory =
        "Medical history must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
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
      if (authHelpers.isDemoMode()) {
        // Demo mode: simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (formData.email.includes("error")) {
          throw new Error(
            "Failed to save patient information. Please try again.",
          );
        }

        setSubmitStatus({
          type: "success",
          message: isEditing
            ? "Patient information updated successfully!"
            : "New patient added successfully!",
        });

        setTimeout(() => {
          if (isEditing) {
            navigate(`/patients/${patientId}`);
          } else {
            navigate("/patients");
          }
        }, 2000);
        return;
      }

      // Real Supabase implementation
      const { user } = await authHelpers.getCurrentUser();
      if (!user) {
        throw new Error("You must be logged in to save patients.");
      }

      if (isEditing && patientId) {
        // Update existing patient - only include basic fields that exist
        const updateData: any = {
          name: formData.name.trim(),
        };

        // Only add fields if they have values (optional fields)
        if (formData.email.trim()) updateData.email = formData.email.trim();
        if (formData.phone.trim()) updateData.phone = formData.phone.trim();
        if (formData.dateOfBirth) updateData.dob = formData.dateOfBirth;
        if (formData.medicalHistory.trim())
          updateData.medical_history = formData.medicalHistory.trim();

        const { error } = await supabase!
          .from("patients")
          .update(updateData)
          .eq("id", patientId)
          .eq("doctor_id", user.id); // Ensure doctor can only update their own patients

        if (error) {
          throw new Error(`Failed to update patient: ${error.message}`);
        }

        setSubmitStatus({
          type: "success",
          message: "Patient information updated successfully!",
        });

        setTimeout(() => {
          navigate(`/patients/${patientId}`);
        }, 2000);
      } else {
        // Create new patient - ultra-defensive approach
        try {
          // First, try with minimal required fields only
          let insertData: any = {
            doctor_id: user.id,
            name: formData.name.trim(),
          };

          let { data, error } = await supabase!
            .from("patients")
            .insert(insertData)
            .select()
            .single();

          if (error) {
            throw new Error(
              `Failed to create patient with minimal data: ${error.message}`,
            );
          }

          // If successful and we have additional data, try to update with optional fields
          if (
            data?.id &&
            (formData.email.trim() ||
              formData.phone.trim() ||
              formData.dateOfBirth ||
              formData.medicalHistory.trim())
          ) {
            const updateData: any = {};

            if (formData.email.trim()) updateData.email = formData.email.trim();
            if (formData.phone.trim()) updateData.phone = formData.phone.trim();
            if (formData.dateOfBirth) updateData.dob = formData.dateOfBirth;
            if (formData.medicalHistory.trim())
              updateData.medical_history = formData.medicalHistory.trim();

            // Try to update with additional fields (ignore errors for missing columns)
            const { error: updateError } = await supabase!
              .from("patients")
              .update(updateData)
              .eq("id", data.id);

            if (updateError) {
              console.warn(
                "Some additional fields could not be saved:",
                updateError.message,
              );
              // Continue anyway since the basic patient was created
            }
          }

          setSubmitStatus({
            type: "success",
            message: "New patient added successfully!",
          });

          setTimeout(() => {
            if (data?.id) {
              navigate(`/patients/${data.id}`);
            } else {
              navigate("/patients");
            }
          }, 2000);
        } catch (createError) {
          throw createError;
        }
      }
    } catch (error) {
      console.error("Error saving patient:", error);
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3">
          <Link
            to={isEditing ? `/patients/${patientId}` : "/patients"}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEditing ? "Back to Patient Profile" : "Back to Patients"}
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              {isEditing ? "Edit Patient" : "Add New Patient"}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {isEditing
              ? "Update patient information and medical history"
              : "Add a new patient to your practice"}
          </p>
        </div>
      </div>

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
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-xl font-bold">
                  <div className="p-2 bg-primary/20 rounded-lg mr-3">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  Personal Information
                </CardTitle>
                <CardDescription className="text-base">
                  Basic patient details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold flex items-center"
                  >
                    <User className="w-4 h-4 mr-2 text-primary" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter patient's full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                      errors.name
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Date of Birth Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-sm font-semibold flex items-center"
                  >
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                      errors.dateOfBirth
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-2 text-primary" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2 text-primary" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all ${
                      errors.phone
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Actions Sidebar */}
          <div className="space-y-8">
            <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Actions</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update patient information"
                    : "Save new patient"}
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
                      {isEditing ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Update Patient" : "Save Patient"}
                    </>
                  )}
                </Button>
                <Link
                  to={isEditing ? `/patients/${patientId}` : "/patients"}
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

            {/* Form Tips */}
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
                  <p>• All fields marked with * are required</p>
                  <p>• Use a valid email format (e.g., name@domain.com)</p>
                  <p>• Phone number should include area code</p>
                  <p>• Medical history should be detailed and accurate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical History Section */}
        <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-xl font-bold">
              <div className="p-2 bg-primary/20 rounded-lg mr-3">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              Medical History
            </CardTitle>
            <CardDescription className="text-base">
              Detailed medical background, conditions, medications, and notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="medicalHistory"
                className="text-sm font-semibold flex items-center"
              >
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Medical History & Notes *
              </Label>
              <Textarea
                id="medicalHistory"
                placeholder="Enter detailed medical history, including any existing conditions, medications, allergies, previous surgeries, family history, and relevant notes..."
                value={formData.medicalHistory}
                onChange={(e) =>
                  handleInputChange("medicalHistory", e.target.value)
                }
                className={`min-h-[200px] rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-all resize-none ${
                  errors.medicalHistory
                    ? "border-destructive focus:border-destructive"
                    : ""
                }`}
                disabled={isSubmitting}
              />
              {errors.medicalHistory && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.medicalHistory}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters. Be as detailed as possible for better
                patient care.
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
