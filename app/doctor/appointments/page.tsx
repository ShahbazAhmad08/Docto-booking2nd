"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  appointmentsAPI,
  type Appointment,
  prescriptionsAPI,
  type Prescription,
} from "@/lib/api";
import {
  Calendar,
  Clock,
  User,
  CalendarDays,
  ListOrdered,
  StepBack,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCalendar } from "@/components/ui/appointment-calendar";
import { ModernFooter } from "@/components/ModernFooter";
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorAppointmentsPage() {
  const { user, role, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [isCalendarView, setIsCalendarView] = useState(false);

  // ---------------- Load Appointments & Prescriptions ----------------
  const loadAppointments = useCallback(async () => {
    if (!isAuthenticated || !user?.id || role !== "doctor") {
      setIsLoading(false);
      return;
    }
    try {
      const [apts, prescs] = await Promise.all([
        appointmentsAPI.getByDoctorId(user.id),
        prescriptionsAPI.getByDoctorId(user.id),
      ]);

      setAppointments(
        apts.sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      setPrescriptions(prescs);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load appointments or prescriptions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated, role, toast]);

  useEffect(() => {
    if (isAuthenticated && role === "doctor") {
      loadAppointments();
    } else {
      setIsLoading(false);
    }
  }, [loadAppointments, isAuthenticated, role]);

  // ---------------- Update Appointment Status ----------------
  const updateAppointmentStatus = async (
    id: string,
    status: Appointment["status"]
  ) => {
    try {
      await appointmentsAPI.updateStatus(id, status);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
      toast({
        title: "Success",
        description: `Appointment ${status} successfully!`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  // ---------------- Helper Functions ----------------
  const isUpcoming = (a: Appointment) => {
    if (!a.date || !a.time) return false;
    const aptDateTime = new Date(`${a.date}T${a.time}`);
    return aptDateTime >= new Date();
  };

  const canTakeAction = (apt: Appointment) =>
    ["pending", "confirmed", "rescheduled"].includes(apt.status) &&
    (isUpcoming(apt) || apt.status === "rescheduled");

  const groupAppointmentsByDate = (apts: Appointment[]) =>
    apts.reduce((acc, a) => {
      (acc[a.date] = acc[a.date] || []).push(a);
      return acc;
    }, {} as Record<string, Appointment[]>);

  const filteredAppointments = appointments.filter((a) =>
    activeTab === "upcoming"
      ? !["cancelled", "completed"].includes(a.status) && isUpcoming(a)
      : ["cancelled", "completed"].includes(a.status) || !isUpcoming(a)
  );

  const groupedAppointments = groupAppointmentsByDate(filteredAppointments);

  const goToPrescription = (apt: Appointment) => {
    router.push(
      `/doctor/prescriptions/new?appointmentId=${apt.id}&patientId=${apt.patientId}&doctorId=${apt.doctorId}`
    );
  };

  const getStatusBadgeClass = (status: string) =>
    ({
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      completed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      rescheduled:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    }[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300");

  // ---------------- Render ----------------
  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Button
          onClick={() => router.push("/doctor/dashboard")}
          size="sm"
          className="m-4"
        >
          <StepBack className="w-4 h-4 mr-1" /> Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Appointments
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage and track all patient appointments
            </p>
          </div>

          {/* Tabs & View Toggle */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
              {["upcoming", "past"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as "upcoming" | "past");
                    setIsCalendarView(false);
                  }}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsCalendarView((p) => !p)}
              className="px-3 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2"
            >
              {isCalendarView ? (
                <ListOrdered className="w-4 h-4" />
              ) : (
                <CalendarDays className="w-4 h-4" />
              )}
              {isCalendarView ? "List View" : "Calendar View"}
            </button>
          </div>

          {/* Appointment Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}
            </div>
          ) : appointments.length === 0 ? (
            <Card className="text-center py-10">
              <CardContent>
                <Calendar className="w-14 h-14 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  No Appointments
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  You have no scheduled appointments yet.
                </p>
              </CardContent>
            </Card>
          ) : isCalendarView ? (
            <AppointmentCalendar
              appointments={appointments}
              onAppointmentUpdate={(updated) =>
                setAppointments((prev) =>
                  prev.map((a) => (a.id === updated.id ? updated : a))
                )
              }
            />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAppointments).length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {activeTab === "upcoming"
                    ? "No upcoming appointments."
                    : "No past appointments."}
                </p>
              ) : (
                Object.entries(groupedAppointments).map(([date, dayApts]) => (
                  <div key={date}>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {dayApts.map((apt) => {
                        const prescription = prescriptions.find(
                          (p) => p.appointmentId === apt.id
                        );

                        return (
                          <Card
                            key={apt.id}
                            className="hover:shadow-lg transition"
                          >
                            <CardHeader>
                              <div className="flex justify-between items-center">
                                <CardTitle className="flex flex-col text-base">
                                  <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />{" "}
                                    {prescription?.patient?.name ||
                                      apt.patientName}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Age: {prescription?.patient?.age || "-"}
                                  </span>
                                </CardTitle>
                                <Badge
                                  className={`${getStatusBadgeClass(
                                    apt.status
                                  )} capitalize`}
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <CardDescription className="flex items-center gap-1 pt-1">
                                <Clock className="w-4 h-4" /> {apt.time}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {/* Medications */}
                              {prescription?.medications?.length ? (
                                <ul className="mb-2">
                                  {prescription.medications.map((m, idx) => (
                                    <li key={idx} className="text-sm">
                                      <strong>{m.name}</strong> - {m.dosage} |{" "}
                                      {m.instructions}{" "}
                                      {m.duration ? `(${m.duration})` : ""}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  No medications yet.
                                </p>
                              )}

                              {/* Cancel / Complete Buttons */}
                              {canTakeAction(apt) && (
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        apt.id,
                                        "cancelled"
                                      )
                                    }
                                    className="flex-1 border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 bg-green-600 text-white hover:bg-green-700"
                                    onClick={() => goToPrescription(apt)}
                                  >
                                    Complete
                                  </Button>
                                </div>
                              )}

                              {/* View / Add Prescription Button */}
                              {apt.status === "confirmed" &&
                                !canTakeAction(apt) && (
                                  <Button
                                    size="sm"
                                    className={`w-full mt-2 ${
                                      prescription
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-purple-600 hover:bg-purple-700 text-white"
                                    }`}
                                    onClick={() =>
                                      prescription
                                        ? router.push(
                                            `/doctor/prescriptions/${prescription.id}`
                                          )
                                        : goToPrescription(apt)
                                    }
                                  >
                                    {prescription
                                      ? "View Prescription"
                                      : "+ Add Prescription"}
                                  </Button>
                                )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}
