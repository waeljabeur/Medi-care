import "./global.css";
import React from "react";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import AddEditPatient from "./pages/AddEditPatient";
import Appointments from "./pages/Appointments";
import CalendarView from "./pages/CalendarView";
import AddEditAppointment from "./pages/AddEditAppointment";
import ViewToggleDemo from "./pages/ViewToggleDemo";
import PrintExportDemo from "./pages/PrintExportDemo";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DoctorProvider } from "./contexts/DoctorContext-simple";

const queryClient = new QueryClient();

const App = () => {
  // Add global bypass functions and navigation loop detection
  React.useEffect(() => {
    // Detect navigation loops
    let navigationCount = 0;
    const resetNavigationCount = () => {
      navigationCount = 0;
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      navigationCount++;
      if (navigationCount > 5) {
        console.log("🚨 Navigation loop detected, clearing auth state");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      setTimeout(resetNavigationCount, 1000);
      return originalPushState.apply(this, args);
    };

    (window as any).bypassAuth = () => {
      console.log("🚨 BYPASS: Setting manual auth state");
      localStorage.setItem("last-login-time", Date.now().toString());
      localStorage.setItem(
        "demo-session",
        JSON.stringify({
          id: "bypass-user",
          email: "bypass@test.com",
          user_metadata: { name: "Bypass User" },
        }),
      );
      window.location.href = "/dashboard";
    };

    (window as any).clearAuth = () => {
      console.log("🚨 BYPASS: Clearing all auth state");
      localStorage.removeItem("last-login-time");
      localStorage.removeItem("demo-session");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("sb-")) {
          localStorage.removeItem(key);
        }
      });
      window.location.href = "/login";
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DoctorProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Patients />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/new"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AddEditPatient />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PatientProfile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:patientId/edit"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AddEditPatient />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Appointments />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CalendarView />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AddEditAppointment />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:appointmentId/edit"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AddEditAppointment />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/demo/view-toggle" element={<ViewToggleDemo />} />
              <Route path="/demo/print-export" element={<PrintExportDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DoctorProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
