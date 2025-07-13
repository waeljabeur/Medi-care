import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/ui/logout-button";
import { useDoctor } from "@/contexts/DoctorContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarDays,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Stethoscope,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { doctor, error: doctorError } = useDoctor();

  // Debug logging for doctor info in layout
  React.useEffect(() => {
    if (doctor) {
      console.log("🔷 DashboardLayout - Doctor info loaded:", doctor);
    }
  }, [doctor]);

  // Show error state if doctor loading failed
  if (doctorError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Error Loading Doctor Profile
          </h2>
          <p className="text-muted-foreground mb-6">{doctorError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-5 border-b border-sidebar-border/50">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-primary rounded-xl shadow-lg">
                <Stethoscope className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">
                  MedDash
                </h1>
                <p className="text-xs text-sidebar-foreground/60 font-medium">
                  Doctor Portal
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? location.pathname === "/dashboard"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 mr-3 transition-transform group-hover:scale-110",
                      isActive
                        ? "text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border/50">
            <div className="flex items-center px-3 py-3 rounded-xl bg-sidebar-accent/30">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-primary-foreground">
                  {(doctor?.name || "Dr")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {doctor?.name || "Loading..."}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {doctor?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-accent"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search patients, appointments..."
                  className="pl-10 pr-4 py-2.5 w-80 text-sm border border-input rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:bg-background"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-accent transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse"></span>
              </Button>

              <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-xl bg-accent/30">
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {doctor?.name || "Loading..."}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    Doctor
                  </p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold text-primary-foreground">
                    {(doctor?.name || "Dr")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
              </div>

              <LogoutButton
                variant="ghost"
                size="sm"
                showIcon={true}
                showText={false}
                className="hover:bg-destructive/10 hover:text-destructive"
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background to-muted/20 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
