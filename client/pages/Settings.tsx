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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  Palette,
  Database,
  Download,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Manage your account preferences and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <User className="w-5 h-5 text-primary" />
                </div>
                Profile Information
              </CardTitle>
              <CardDescription className="text-base">
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="firstName" className="text-sm font-semibold">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Sarah"
                    defaultValue="Sarah"
                    className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="lastName" className="text-sm font-semibold">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Johnson"
                    defaultValue="Johnson"
                    className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah.johnson@medicalpractice.com"
                  defaultValue="sarah.johnson@medicalpractice.com"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  defaultValue="(555) 123-4567"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="license" className="text-sm font-semibold">
                  Medical License Number
                </Label>
                <Input
                  id="license"
                  placeholder="MD123456789"
                  defaultValue="MD123456789"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                />
              </div>
              <Button
                size="default"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                Security Settings
              </CardTitle>
              <CardDescription className="text-base">
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-semibold"
                >
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="newPassword" className="text-sm font-semibold">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                />
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background"
                />
              </div>
              <Button
                size="default"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming appointments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Patient Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications when patients update their information
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Important system updates and maintenance notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                Appearance
              </CardTitle>
              <CardDescription className="text-base">
                Customize your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Theme Color</Label>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-md"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg mr-3">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                Data Management
              </CardTitle>
              <CardDescription className="text-base">
                Manage your data and backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Patient Data
              </Button>
              <Button variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Backup Settings
              </Button>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>Last backup: January 15, 2024</p>
                <p>Next scheduled: January 22, 2024</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold">
                Account Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Patients</span>
                <span className="font-medium">147</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Appointments</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Account Created</span>
                <span className="font-medium">Jan 2023</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
