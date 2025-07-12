import React from "react";
import { Button } from "./button";
import { Calendar, Grid3X3, LayoutGrid, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewType = "day" | "week" | "month";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  className?: string;
}

export function ViewToggle({
  currentView,
  onViewChange,
  className,
}: ViewToggleProps) {
  const views = [
    {
      value: "day" as const,
      label: "Day",
      icon: CalendarDays,
    },
    {
      value: "week" as const,
      label: "Week",
      icon: LayoutGrid,
    },
    {
      value: "month" as const,
      label: "Month",
      icon: Grid3X3,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-1 bg-gradient-to-r from-medical-50 to-medical-100/50 dark:from-medical-900/20 dark:to-medical-800/20 rounded-xl p-1.5 shadow-sm border border-medical-200/30 dark:border-medical-700/30",
        className,
      )}
    >
      {views.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={currentView === value ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(value)}
          className={cn(
            "h-9 px-4 flex items-center space-x-2 text-sm font-medium transition-all duration-200 flex-1 sm:flex-none min-w-0",
            currentView === value
              ? "bg-gradient-to-r from-medical-500 to-medical-600 text-white shadow-md hover:from-medical-600 hover:to-medical-700 transform scale-105"
              : "text-medical-700 dark:text-medical-300 hover:bg-medical-100/60 dark:hover:bg-medical-800/40 hover:text-medical-800 dark:hover:text-medical-200",
          )}
        >
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{label}</span>
        </Button>
      ))}
    </div>
  );
}
