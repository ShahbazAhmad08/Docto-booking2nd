"use client";

import { useEffect, useState } from "react";
import {
  prescriptionsAPI,
  appointmentsAPI,
  type Prescription,
  type Appointment,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Search, StepBack } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrescriptionManager({
  doctorId,
}: {
  doctorId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const allPrescriptions = await prescriptionsAPI.getByDoctorId(doctorId);
        const allAppointments = await appointmentsAPI.getByUser(
          doctorId,
          "doctor"
        );

        setPrescriptions(allPrescriptions);
        setAppointments(allAppointments);
      } catch (err: any) {
        toast({
          title: "Error loading data",
          description: err.message || "Something went wrong",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [doctorId, toast]);

  const deletePrescription = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await prescriptionsAPI.delete(id);
      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Prescription deleted" });
    } catch (err: any) {
      toast({
        title: "Error deleting",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getPatientName = (p: Prescription) => {
    const appt = appointments.find((a) => a.id === p.appointmentId);
    return appt?.patientName || `Patient #${p.patientId}`;
  };

  const getDoctorName = (p: Prescription) => {
    const appt = appointments.find((a) => a.id === p.appointmentId);
    return appt?.doctorName || `Doctor #${p.doctorId}`;
  };

  const getAppointmentInfo = (appointmentId: string) => {
    const appt = appointments.find((a) => a.id === appointmentId);
    return appt
      ? `${appt.patientName} (${appt.date} ${appt.time})`
      : `Appointment #${appointmentId}`;
  };

  const filteredPrescriptions = prescriptions.filter((p) => {
    const patientName = getPatientName(p).toLowerCase();
    const doctorName = getDoctorName(p).toLowerCase();
    const notes = p.notes.toLowerCase();
    const medMatch = p.medications.some((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      patientName.includes(search.toLowerCase()) ||
      doctorName.includes(search.toLowerCase()) ||
      notes.includes(search.toLowerCase()) ||
      medMatch
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Prescription Management</h2>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search prescriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Prescription list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrescriptions.map((p) => (
          <Card key={p.id} className="shadow hover:shadow-lg transition">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle className="font-bold">{getPatientName(p)}</CardTitle>
                <p className="text-sm text-gray-500">
                  {getAppointmentInfo(p.appointmentId)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    router.push(`/doctor/prescriptions/form/${p.id}`)
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => deletePrescription(p.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {p.medications.map((m, idx) => (
                <div key={idx} className="mb-2 text-sm">
                  <p>
                    <b>Medicine:</b> {m.name}
                  </p>
                  <p>
                    <b>Dosage:</b> {m.dosage}
                  </p>
                  <p>
                    <b>Instructions:</b> {m.instructions}
                  </p>
                  {m.duration && (
                    <p>
                      <b>Duration:</b> {m.duration}
                    </p>
                  )}
                </div>
              ))}
              <p>
                <b>Notes:</b> {p.notes}
              </p>
              <p className="text-xs text-gray-400 mt-2">Date: {p.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
