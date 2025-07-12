import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import AddEditPatient from "./pages/AddEditPatient";
import Appointments from "./pages/Appointments";
import AddEditAppointment from "./pages/AddEditAppointment";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/patients"
            element={
              <DashboardLayout>
                <Patients />
              </DashboardLayout>
            }
          />
          <Route
            path="/patients/new"
            element={
              <DashboardLayout>
                <AddEditPatient />
              </DashboardLayout>
            }
          />
          <Route
            path="/patients/:patientId"
            element={
              <DashboardLayout>
                <PatientProfile />
              </DashboardLayout>
            }
          />
          <Route
            path="/patients/:patientId/edit"
            element={
              <DashboardLayout>
                <AddEditPatient />
              </DashboardLayout>
            }
          />
          <Route
            path="/appointments"
            element={
              <DashboardLayout>
                <Appointments />
              </DashboardLayout>
            }
          />
          <Route
            path="/appointments/new"
            element={
              <DashboardLayout>
                <AddEditAppointment />
              </DashboardLayout>
            }
          />
          <Route
            path="/appointments/:appointmentId/edit"
            element={
              <DashboardLayout>
                <AddEditAppointment />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
