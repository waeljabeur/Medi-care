import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  FileText,
  MoreHorizontal,
} from "lucide-react";

// Mock patients data
const mockPatients = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "(555) 123-4567",
    age: 34,
    lastVisit: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "(555) 234-5678",
    age: 42,
    lastVisit: "2024-01-12",
    status: "active",
  },
  {
    id: 3,
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    phone: "(555) 345-6789",
    age: 28,
    lastVisit: "2024-01-10",
    status: "pending",
  },
];

export default function Patients() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your patient information and medical records
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {mockPatients.length} Total Patients
              </span>
            </div>
          </Card>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>
            View and manage all your patients' information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Patient
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Contact
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Age
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Last Visit
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {patient.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Patient ID: #
                            {patient.id.toString().padStart(4, "0")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-2 text-muted-foreground" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-2 text-muted-foreground" />
                          {patient.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-foreground">
                      {patient.age} years
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-2 text-muted-foreground" />
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <Badge
                        variant={
                          patient.status === "active" ? "default" : "secondary"
                        }
                        className={
                          patient.status === "active"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : ""
                        }
                      >
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
