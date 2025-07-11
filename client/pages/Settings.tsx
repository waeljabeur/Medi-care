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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Sarah"
                    defaultValue="Sarah"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Johnson"
                    defaultValue="Johnson"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah.johnson@medicalpractice.com"
                  defaultValue="sarah.johnson@medicalpractice.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  defaultValue="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">Medical License Number</Label>
                <Input
                  id="license"
                  placeholder="MD123456789"
                  defaultValue="MD123456789"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance
              </CardTitle>
              <CardDescription>Customize your interface</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Data Management
              </CardTitle>
              <CardDescription>Manage your data and backups</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
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
