"use client";

import { useEffect, useState } from "react";
import { appointmentsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";

interface Patient {
  id: string;
  name: string;
}

export default function PatientHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (!user) return;

    async function fetchPatients() {
      const appointments = await appointmentsAPI.getByUser(user.id, "doctor");

      const uniquePatientsMap: Record<string, Patient> = {};
      appointments.forEach((a: any) => {
        if (!uniquePatientsMap[a.patientId]) {
          uniquePatientsMap[a.patientId] = {
            id: a.patientId,
            name: a.patientName,
          };
        }
      });

      setPatients(Object.values(uniquePatientsMap));
    }

    fetchPatients();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <Button
        onClick={() => router.push("/doctor/dashboard")}
        size="sm"
        className="mb-6 flex items-center gap-1 bg-white shadow hover:bg-gray-50"
      >
        <StepBack className="w-4 h-4" /> Back
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
        Patient History
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer"
          >
            <Card className="bg-white rounded-lg shadow-md hover:shadow-lg p-5">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {p.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mt-1">Patient ID: {p.id}</p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push(`/doctor/patient-history/${p.id}`)}
                >
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {patients.length === 0 && (
          <p className="text-center col-span-full text-gray-500 mt-10">
            No patients found.
          </p>
        )}
      </div>
    </div>
  );
}
