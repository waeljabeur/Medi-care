import React, { useState } from "react";
import { ViewToggle, type ViewType } from "@/components/ui/view-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ViewToggleDemo() {
  const [currentView, setCurrentView] = useState<ViewType>("month");

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link
            to="/calendar"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Link>
          <h1 className="text-4xl font-bold text-foreground">
            View Toggle Component Demo
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive demonstration of the calendar view toggle component
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Current view: <strong>{currentView}</strong>
                </p>

                <ViewToggle
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />

                <div className="w-full p-6 bg-gradient-to-br from-medical-50 to-medical-100/30 rounded-xl border border-medical-200/50">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-medical-800 mb-2">
                      {currentView.charAt(0).toUpperCase() +
                        currentView.slice(1)}{" "}
                      View Active
                    </h3>
                    <p className="text-medical-600">
                      Calendar would display in {currentView} mode
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    ✨ Design Features
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Medical theme colors (teal/light blue)</li>
                    <li>Rounded buttons with subtle shadows</li>
                    <li>Gradient backgrounds and borders</li>
                    <li>Smooth animations and transitions</li>
                    <li>Active state highlighting</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    📱 Responsive
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>Stacks vertically on mobile</li>
                    <li>Horizontal row on desktop</li>
                    <li>Consistent spacing and sizing</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    🔧 Technical
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                    <li>TypeScript with proper types</li>
                    <li>Reusable React component</li>
                    <li>Tailwind CSS styling</li>
                    <li>Accessible button implementation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-4">
              <pre className="text-sm text-foreground">
                {`import { ViewToggle, type ViewType } from "@/components/ui/view-toggle";

function MyCalendar() {
  const [view, setView] = useState<ViewType>("month");
  
  return (
    <div>
      <ViewToggle
        currentView={view}
        onViewChange={setView}
      />
      <div className="calendar-content">
        Calendar displays here based on selected view
      </div>
    </div>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
