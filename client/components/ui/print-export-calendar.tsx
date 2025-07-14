import React from "react";
import { Button } from "./button";
import { Printer, Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { type AppointmentWithPatient } from "@/lib/database";

interface PrintExportCalendarProps {
  appointments: AppointmentWithPatient[];
  currentDate: Date;
  viewType: "day" | "week" | "month";
  className?: string;
}

export function PrintExportCalendar({
  appointments,
  currentDate,
  viewType,
  className,
}: PrintExportCalendarProps) {
  const handlePrint = () => {
    window.print();
  };

  const generatePDF = async () => {
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const jsPDFModule = await import("jspdf");
      const doc = new jsPDFModule.default();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(20, 184, 166); // medical teal color
      doc.text("Doctor's Calendar", 20, 30);

      // Date range
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const dateText = formatDateRange(currentDate, viewType);
      doc.text(dateText, 20, 45);

      // View type
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${viewType.charAt(0).toUpperCase() + viewType.slice(1)} View`,
        20,
        55,
      );

      // Filter appointments for current view
      const filteredAppointments = filterAppointmentsByView(
        appointments,
        currentDate,
        viewType,
      );

      // Appointments list
      if (filteredAppointments.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("Appointments:", 20, 75);

        let yPosition = 90;
        filteredAppointments.forEach((apt, index) => {
          if (yPosition > 270) {
            (doc as any).addPage();
            yPosition = 30;
          }

          // Date
          doc.setFontSize(10);
          doc.setTextColor(20, 184, 166);
          doc.text(`${new Date(apt.date).toLocaleDateString()}`, 20, yPosition);

          // Time and Patient
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          doc.text(`${apt.time} - ${apt.patient}`, 20, yPosition + 10);

          // Reason
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Reason: ${apt.reason}`, 20, yPosition + 20);

          // Status
          const statusColor =
            apt.status === "confirmed" ? [34, 197, 94] : [249, 115, 22];
          doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
          doc.text(`Status: ${apt.status.toUpperCase()}`, 20, yPosition + 30);

          // Notes
          if (apt.notes) {
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            const notesLines = (doc as any).splitTextToSize(
              `Notes: ${apt.notes}`,
              170,
            );
            doc.text(notesLines, 20, yPosition + 40);
            yPosition += 10 * notesLines.length;
          }

          yPosition += 50;
        });
      } else {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("No appointments found for this period.", 20, 90);
      }

      // Footer
      const pageCount = (doc as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        (doc as any).setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
          20,
          (doc as any).internal.pageSize.height - 10,
        );
      }

      // Download
      const fileName = `calendar-${viewType}-${formatDateForFilename(currentDate)}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const exportToCSV = () => {
    const filteredAppointments = filterAppointmentsByView(
      appointments,
      currentDate,
      viewType,
    );

    if (filteredAppointments.length === 0) {
      alert("No appointments to export for the selected period.");
      return;
    }

    // CSV headers
    const headers = [
      "Date",
      "Time",
      "Patient",
      "Reason",
      "Status",
      "Notes",
      "Patient ID",
    ];

    // CSV rows
    const csvRows = [
      headers.join(","),
      ...filteredAppointments.map((apt) =>
        [
          apt.date,
          apt.time,
          `"${apt.patient}"`,
          `"${apt.reason}"`,
          apt.status,
          `"${apt.notes.replace(/"/g, '""')}"`,
          apt.patientId,
        ].join(","),
      ),
    ];

    // Create and download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `appointments-${viewType}-${formatDateForFilename(currentDate)}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={cn("flex flex-col items-stretch space-y-3", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="h-10 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-medical-50 to-medical-100/50 hover:from-medical-100 hover:to-medical-200/50 text-medical-700 border-medical-200/50 w-full justify-start"
      >
        <Printer className="w-4 h-4 mr-3" />
        Print Calendar
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={generatePDF}
        className="h-10 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-medical-50 to-medical-100/50 hover:from-medical-100 hover:to-medical-200/50 text-medical-700 border-medical-200/50 w-full justify-start"
      >
        <Download className="w-4 h-4 mr-3" />
        Export as PDF
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        className="h-10 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-r from-medical-50 to-medical-100/50 hover:from-medical-100 hover:to-medical-200/50 text-medical-700 border-medical-200/50 w-full justify-start"
      >
        <FileText className="w-4 h-4 mr-3" />
        Export as CSV
      </Button>
    </div>
  );
}

// Helper functions
function formatDateRange(
  date: Date,
  viewType: "day" | "week" | "month",
): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  switch (viewType) {
    case "day":
      return date.toLocaleDateString("en-US", options);
    case "week":
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString("en-US", options)} - ${endOfWeek.toLocaleDateString("en-US", options)}`;
    case "month":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    default:
      return date.toLocaleDateString("en-US", options);
  }
}

function formatDateForFilename(date: Date): string {
  return date.toISOString().split("T")[0];
}

function filterAppointmentsByView(
  appointments: Appointment[],
  currentDate: Date,
  viewType: "day" | "week" | "month",
): Appointment[] {
  switch (viewType) {
    case "day":
      const dayString = currentDate.toISOString().split("T")[0];
      return appointments.filter((apt) => apt.date === dayString);

    case "week":
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate >= startOfWeek && aptDate <= endOfWeek;
      });

    case "month":
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      return appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        return (
          aptDate.getMonth() === currentMonth &&
          aptDate.getFullYear() === currentYear
        );
      });

    default:
      return appointments;
  }
}
