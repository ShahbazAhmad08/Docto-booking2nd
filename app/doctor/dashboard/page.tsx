"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appointmentsAPI, type Appointment } from "@/lib/api";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadAppointments();
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      const appointmentsData = await appointmentsAPI.getByUser(
        user.id,
        "doctor"
      );
      setAppointments(appointmentsData);

      // Calculate stats
      const stats = {
        total: appointmentsData.length,
        pending: appointmentsData.filter((a) => a.status === "pending").length,
        confirmed: appointmentsData.filter((a) => a.status === "confirmed")
          .length,
        completed: appointmentsData.filter((a) => a.status === "completed")
          .length,
      };
      setStats(stats);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === new Date().toISOString().split("T")[0]
  );

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Format today's date
  const getTodayDate = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status icon
  const getStatusIcon = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Get appointment type (mock data for now)
  const getAppointmentType = (appointment: Appointment) => {
    // This would come from your actual data
    const types = ["CONSULTATION", "FIRST VISIT", "EMERGENCY", "FOLLOW-UP"];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Mock patient avatars (in real app, these would come from patient data)
  const getPatientAvatar = (patientName: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-green-100 text-green-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
      "bg-yellow-100 text-yellow-700",
      "bg-red-100 text-red-700",
    ];
    const colorIndex = patientName.length % colors.length;
    return colors[colorIndex];
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section with Greeting and Date */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {getGreeting()} {user?.name || "Doctor"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                You have{" "}
                <span className="font-bold">
                  {todayAppointments.length} patients
                </span>{" "}
                remaining today!
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Remember to check documentation before call
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                {getTodayDate()}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Appointments
                </CardTitle>
                <Calendar className="h-4 w-4 text-gray-500 dark:text-teal-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  All time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-gray-500 dark:text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                <Users className="h-4 w-4 text-gray-500 dark:text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.confirmed}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ready to see
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500 dark:text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading appointments...</div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No appointments scheduled for today
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Patient Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${getPatientAvatar(
                            appointment.patientName
                          )}`}
                        >
                          <span className="text-sm font-bold">
                            {appointment.patientName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>

                        {/* Patient Info */}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getAppointmentType(appointment)}
                          </p>
                        </div>
                      </div>

                      {/* Status and Time */}
                      <div className="flex items-center space-x-3">
                        {/* Status Icon */}
                        {getStatusIcon(appointment.status)}

                        {/* Time */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.time}
                          </p>
                        </div>

                        {/* Dropdown Arrow */}
                        <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
