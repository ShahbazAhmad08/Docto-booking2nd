"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  prescriptionsAPI,
  appointmentsAPI,
  type Prescription,
  type Appointment,
} from "@/lib/api";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Nav } from "react-day-picker";
import { Navbar } from "@/components/Navbar";

export default function PatientPrescriptionPage() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "";

  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!patientId) return;

    const loadData = async () => {
      try {
        const prescs = await prescriptionsAPI.getAll();
        const appts = await appointmentsAPI.getByUser(patientId, "patient");

        setPrescriptions(prescs.filter((p) => p.patientId === patientId));
        setAppointments(appts);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Cannot fetch data",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [patientId, toast]);

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.medications?.some((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const getAppointmentInfo = (appointmentId: string) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    return appt
      ? `${appt.date} | Dr. ${appt.doctorName}`
      : "Unknown Appointment";
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <Navbar />
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        My Prescriptions & Medical History
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search by medicine name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Prescription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrescriptions.map((p) => (
          <Link key={p.id} href={`/prescription/${p.id}`}>
            <Card className="shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform cursor-pointer rounded-lg border border-gray-200">
              <CardHeader className="bg-indigo-50 rounded-t-lg p-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {p.medications?.map((m) => m.name).join(", ") ||
                      "Prescription"}
                  </CardTitle>
                  <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-200 rounded-full">
                    {p.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {getAppointmentInfo(p.appointmentId)}
                </p>
              </CardHeader>

              <CardContent className="p-4 bg-white rounded-b-lg">
                <ul className="space-y-2">
                  {p.medications?.map((m, idx) => (
                    <li
                      key={idx}
                      className="p-2 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <p>
                        <span className="font-semibold">Dosage:</span>{" "}
                        {m.dosage}
                      </p>
                      <p>
                        <span className="font-semibold">Duration:</span>{" "}
                        {m.duration}
                      </p>
                      <p>
                        <span className="font-semibold">Instructions:</span>{" "}
                        {m.instructions}
                      </p>
                    </li>
                  ))}
                </ul>

                {p.notes && (
                  <p className="mt-3 text-sm text-gray-700">
                    <span className="font-semibold">Notes:</span> {p.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
