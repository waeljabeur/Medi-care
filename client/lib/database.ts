import { supabase, authHelpers } from "./supabase";

// Database types based on Supabase schema
export interface Doctor {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Patient {
  id: string;
  doctor_id: string;
  name: string;
  dob: string | null;
  phone: string | null;
  email: string | null;
  medical_history: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  date: string;
  time: string;
  reason: string;
  notes: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

// Extended types for UI components that include patient info
export interface AppointmentWithPatient extends Appointment {
  patient: Patient;
}

export interface PatientFormData {
  name: string;
  dob?: string;
  phone?: string;
  email?: string;
  medical_history?: string;
}

export interface AppointmentFormData {
  patient_id: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
}

// Demo doctor profile
const getDemoDoctorProfile = (): Doctor => {
  const storedProfile = localStorage.getItem("demo-user-profile");
  if (storedProfile) {
    try {
      const profile = JSON.parse(storedProfile);
      return {
        id: profile.id || "demo-user-123",
        name: profile.name || "Dr. Demo User",
        email: profile.email || "demo@doctor.com",
        created_at: profile.created_at || new Date().toISOString(),
      };
    } catch (e) {
      console.warn("Failed to parse stored demo profile");
    }
  }

  return {
    id: "demo-user-123",
    name: "Dr. Demo User",
    email: "demo@doctor.com",
    created_at: new Date().toISOString(),
  };
};

// Demo data for when Supabase is not available
const DEMO_PATIENTS: Patient[] = [
  {
    id: "demo-patient-1",
    doctor_id: "demo-user-123",
    name: "John Smith",
    dob: "1985-03-15",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    medical_history:
      "Hypertension, managed with medication. Regular checkups every 6 months.",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "demo-patient-2",
    doctor_id: "demo-user-123",
    name: "Sarah Johnson",
    dob: "1990-07-22",
    phone: "(555) 987-6543",
    email: "sarah.johnson@email.com",
    medical_history: "Asthma, uses inhaler as needed. Allergic to penicillin.",
    created_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "demo-patient-3",
    doctor_id: "demo-user-123",
    name: "Michael Brown",
    dob: "1978-11-08",
    phone: "(555) 456-7890",
    email: "michael.brown@email.com",
    medical_history:
      "Diabetes Type 2, controlled with diet and exercise. Regular HbA1c monitoring.",
    created_at: "2024-01-03T00:00:00Z",
  },
];

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "demo-appointment-1",
    doctor_id: "demo-user-123",
    patient_id: "demo-patient-1",
    date: "2024-12-20",
    time: "09:00:00",
    reason: "Routine checkup",
    notes: "Blood pressure check, medication review",
    status: "confirmed",
    created_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "demo-appointment-2",
    doctor_id: "demo-user-123",
    patient_id: "demo-patient-2",
    date: "2024-12-20",
    time: "10:30:00",
    reason: "Asthma follow-up",
    notes: "Lung function test, inhaler technique review",
    status: "confirmed",
    created_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "demo-appointment-3",
    doctor_id: "demo-user-123",
    patient_id: "demo-patient-3",
    date: "2024-12-21",
    time: "14:00:00",
    reason: "Diabetes consultation",
    notes: "HbA1c results review, diet counseling",
    status: "pending",
    created_at: "2024-12-15T00:00:00Z",
  },
  {
    id: "demo-appointment-4",
    doctor_id: "demo-user-123",
    patient_id: "demo-patient-1",
    date: "2024-12-22",
    time: "11:15:00",
    reason: "Follow-up visit",
    notes: "Review test results",
    status: "pending",
    created_at: "2024-12-15T00:00:00Z",
  },
];

// Database service class
export class DatabaseService {
  private isDemoMode: boolean;

  constructor() {
    this.isDemoMode = authHelpers.isDemoMode();

    if (!this.isDemoMode) {
      console.log("🔧 Database Service initialized in LIVE mode");
    } else {
      console.log("🔧 Database Service initialized in DEMO mode");
    }
  }

  // Doctor methods
  async getDoctorProfile(): Promise<{ data: Doctor | null; error: any }> {
    if (this.isDemoMode) {
      return { data: getDemoDoctorProfile(), error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", user.user.id)
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async createDoctorProfile(doctorData: {
    name: string;
    email: string;
  }): Promise<{ data: Doctor | null; error: any }> {
    if (this.isDemoMode) {
      const profile = {
        id: "demo-user-123",
        ...doctorData,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem("demo-user-profile", JSON.stringify(profile));
      return { data: profile, error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from("doctors")
        .insert({
          id: user.user.id,
          ...doctorData,
        })
        .select()
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  // Patient methods
  async getPatients(): Promise<{ data: Patient[] | null; error: any }> {
    if (this.isDemoMode) {
      return { data: DEMO_PATIENTS, error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async getPatient(id: string): Promise<{ data: Patient | null; error: any }> {
    if (this.isDemoMode) {
      const patient = DEMO_PATIENTS.find((p) => p.id === id);
      return {
        data: patient || null,
        error: patient ? null : { message: "Patient not found" },
      };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async createPatient(
    patientData: PatientFormData,
  ): Promise<{ data: Patient | null; error: any }> {
    if (this.isDemoMode) {
      const newPatient: Patient = {
        id: `demo-patient-${Date.now()}`,
        doctor_id: "demo-user-123",
        ...patientData,
        dob: patientData.dob || null,
        phone: patientData.phone || null,
        email: patientData.email || null,
        medical_history: patientData.medical_history || null,
        created_at: new Date().toISOString(),
      };
      DEMO_PATIENTS.push(newPatient);
      return { data: newPatient, error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from("patients")
        .insert({
          doctor_id: user.user.id,
          ...patientData,
        })
        .select()
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async updatePatient(
    id: string,
    patientData: Partial<PatientFormData>,
  ): Promise<{ data: Patient | null; error: any }> {
    if (this.isDemoMode) {
      const patientIndex = DEMO_PATIENTS.findIndex((p) => p.id === id);
      if (patientIndex === -1) {
        return { data: null, error: { message: "Patient not found" } };
      }

      DEMO_PATIENTS[patientIndex] = {
        ...DEMO_PATIENTS[patientIndex],
        ...patientData,
      };
      return { data: DEMO_PATIENTS[patientIndex], error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data, error } = await supabase
        .from("patients")
        .update(patientData)
        .eq("id", id)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async deletePatient(id: string): Promise<{ error: any }> {
    if (this.isDemoMode) {
      const patientIndex = DEMO_PATIENTS.findIndex((p) => p.id === id);
      if (patientIndex === -1) {
        return { error: { message: "Patient not found" } };
      }

      DEMO_PATIENTS.splice(patientIndex, 1);
      // Also remove related appointments
      for (let i = DEMO_APPOINTMENTS.length - 1; i >= 0; i--) {
        if (DEMO_APPOINTMENTS[i].patient_id === id) {
          DEMO_APPOINTMENTS.splice(i, 1);
        }
      }
      return { error: null };
    }

    if (!supabase) {
      return { error: { message: "Supabase client not initialized" } };
    }

    try {
      const { error } = await supabase.from("patients").delete().eq("id", id);

      return { error };
    } catch (err) {
      return { error: err };
    }
  }

  // Appointment methods
  async getAppointments(): Promise<{
    data: AppointmentWithPatient[] | null;
    error: any;
  }> {
    if (this.isDemoMode) {
      const appointmentsWithPatients = DEMO_APPOINTMENTS.map((appointment) => ({
        ...appointment,
        patient: DEMO_PATIENTS.find((p) => p.id === appointment.patient_id)!,
      }));

      return { data: appointmentsWithPatients, error: null };
    }

    if (!supabase) {
      console.log("🔍 Supabase client not initialized");
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      console.log("🔍 Querying Supabase for appointments...");
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          patient:patients(*)
        `,
        )
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      console.log("🔍 Supabase query result:", { data, error });
      return { data, error };
    } catch (err) {
      console.log("🔍 Supabase query caught error:", err);
      return { data: null, error: err };
    }
  }

  async getAppointment(
    id: string,
  ): Promise<{ data: AppointmentWithPatient | null; error: any }> {
    if (this.isDemoMode) {
      const appointment = DEMO_APPOINTMENTS.find((a) => a.id === id);
      if (!appointment) {
        return { data: null, error: { message: "Appointment not found" } };
      }

      const patient = DEMO_PATIENTS.find(
        (p) => p.id === appointment.patient_id,
      );
      return {
        data: { ...appointment, patient: patient! },
        error: null,
      };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          patient:patients(*)
        `,
        )
        .eq("id", id)
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async createAppointment(
    appointmentData: AppointmentFormData,
  ): Promise<{ data: Appointment | null; error: any }> {
    if (this.isDemoMode) {
      const newAppointment: Appointment = {
        id: `demo-appointment-${Date.now()}`,
        doctor_id: "demo-user-123",
        ...appointmentData,
        notes: appointmentData.notes || null,
        status: appointmentData.status || "pending",
        created_at: new Date().toISOString(),
      };
      DEMO_APPOINTMENTS.push(newAppointment);
      return { data: newAppointment, error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from("appointments")
        .insert({
          doctor_id: user.user.id,
          ...appointmentData,
          status: appointmentData.status || "pending",
        })
        .select()
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async updateAppointment(
    id: string,
    appointmentData: Partial<AppointmentFormData>,
  ): Promise<{ data: Appointment | null; error: any }> {
    if (this.isDemoMode) {
      const appointmentIndex = DEMO_APPOINTMENTS.findIndex((a) => a.id === id);
      if (appointmentIndex === -1) {
        return { data: null, error: { message: "Appointment not found" } };
      }

      DEMO_APPOINTMENTS[appointmentIndex] = {
        ...DEMO_APPOINTMENTS[appointmentIndex],
        ...appointmentData,
      };
      return { data: DEMO_APPOINTMENTS[appointmentIndex], error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update(appointmentData)
        .eq("id", id)
        .select()
        .single();

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  async deleteAppointment(id: string): Promise<{ error: any }> {
    if (this.isDemoMode) {
      const appointmentIndex = DEMO_APPOINTMENTS.findIndex((a) => a.id === id);
      if (appointmentIndex === -1) {
        return { error: { message: "Appointment not found" } };
      }

      DEMO_APPOINTMENTS.splice(appointmentIndex, 1);
      return { error: null };
    }

    if (!supabase) {
      return { error: { message: "Supabase client not initialized" } };
    }

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      return { error };
    } catch (err) {
      return { error: err };
    }
  }

  // Utility methods
  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<{ data: AppointmentWithPatient[] | null; error: any }> {
    if (this.isDemoMode) {
      const filteredAppointments = DEMO_APPOINTMENTS.filter(
        (appointment) =>
          appointment.date >= startDate && appointment.date <= endDate,
      ).map((appointment) => ({
        ...appointment,
        patient: DEMO_PATIENTS.find((p) => p.id === appointment.patient_id)!,
      }));
      return { data: filteredAppointments, error: null };
    }

    if (!supabase) {
      return {
        data: null,
        error: { message: "Supabase client not initialized" },
      };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          patient:patients(*)
        `,
        )
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  }
}

// Export singleton instance
export const db = new DatabaseService();
