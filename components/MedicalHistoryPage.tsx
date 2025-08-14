"use client";

import { useEffect, useState } from "react";
import {
  appointmentsAPI,
  prescriptionsAPI,
  type Appointment,
  type Prescription,
} from "@/lib/api";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface MedicalHistoryPageProps {
  patientId: string;
}

export default function MedicalHistoryPage({
  patientId,
}: MedicalHistoryPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const appts = await appointmentsAPI.getByUser(patientId, "patient");
        setAppointments(appts);

        const prescPromises = appts.map((a) =>
          prescriptionsAPI.getByAppointment(a.id)
        );
        const prescResults = await Promise.all(prescPromises);
        setPrescriptions(prescResults.flat());
      } catch (err: any) {
        setError(err.message || "Failed to load medical history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  if (loading) return <p>Loading medical history...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (appointments.length === 0) return <p>No appointments found.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Back Button */}
      <Button
        onClick={() => router.push("/doctor/patient-history")}
        size="sm"
        className="mb-6 flex items-center gap-1 bg-white shadow hover:bg-gray-100"
      >
        <StepBack className="w-4 h-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Medical History
      </h1>

      <div className="space-y-6 max-w-4xl mx-auto">
        {appointments.map((appt) => {
          const apptPrescriptions = prescriptions.filter(
            (p) => p.appointmentId === appt.id
          );

          return (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {appt.specialty} with {appt.doctorName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Date:</strong> {format(new Date(appt.date), "PPP")}{" "}
                    | <strong>Time:</strong> {appt.time}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">{appt.status}</span>
                  </p>

                  {apptPrescriptions.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mt-2">Prescriptions:</h3>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {apptPrescriptions.map((p) =>
                          p.medications.map((m, idx) => (
                            <li key={idx}>
                              <strong>{m.name}</strong> - {m.dosage},{" "}
                              {m.instructions}{" "}
                              {m.duration ? `(Duration: ${m.duration})` : ""}
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-2 italic text-gray-500">
                      No prescriptions for this appointment.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
