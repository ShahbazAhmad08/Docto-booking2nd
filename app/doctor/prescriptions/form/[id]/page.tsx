"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  prescriptionsAPI,
  appointmentsAPI,
  type Prescription,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Plus, StepBack, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MedicationForm {
  name: string;
  dosage: string;
  instructions: string;
  duration?: string;
}

export default function PrescriptionEditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const prescriptionId = params?.id as string;

  const [form, setForm] = useState<
    Omit<Prescription, "id" | "date" | "patient" | "doctor">
  >({
    appointmentId: "",
    doctorId: "",
    patientId: "",
    medications: [] as MedicationForm[],
    notes: "",
  });

  const [appointmentInfo, setAppointmentInfo] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const p = await prescriptionsAPI.getById(prescriptionId);

        setForm({
          appointmentId: p.appointmentId,
          doctorId: p.doctorId,
          patientId: p.patientId,
          medications: p.medications.map((m) => ({
            name: m.name,
            dosage: m.dosage,
            instructions: m.instructions,
            duration: m.duration,
          })),
          notes: p.notes,
        });

        const appts = await appointmentsAPI.getByUser(p.doctorId, "doctor");
        const appt = appts.find((a) => a.id === p.appointmentId);
        if (appt)
          setAppointmentInfo(
            `Patient: ${appt.patientName}, Date: ${appt.date}, Time: ${appt.time}`
          );
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [prescriptionId, toast]);

  const handleMedicationChange = (
    index: number,
    field: keyof MedicationForm,
    value: string
  ) => {
    const newMedications = [...form.medications];
    newMedications[index][field] = value;
    setForm({ ...form, medications: newMedications });
  };

  const addMedication = () => {
    setForm({
      ...form,
      medications: [
        ...form.medications,
        { name: "", dosage: "", instructions: "", duration: "" },
      ],
    });
  };

  const removeMedication = (index: number) => {
    const newMedications = [...form.medications];
    newMedications.splice(index, 1);
    setForm({ ...form, medications: newMedications });
  };

  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, notes: e.target.value });
  };

  const handleSave = async () => {
    if (form.medications.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one medication is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      await prescriptionsAPI.update(prescriptionId, form);
      toast({
        title: "Updated",
        description: "Prescription updated successfully.",
      });
      router.push("/doctor/prescriptions");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Button
          onClick={() => router.push("/doctor/prescriptions")}
          size="sm"
          className="mb-6 flex items-center gap-1 bg-white shadow hover:bg-gray-50"
        >
          <StepBack className="w-4 h-4" /> Back
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white rounded-lg shadow p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Edit Prescription
              </CardTitle>
              {appointmentInfo && (
                <p className="text-sm text-gray-500 mt-1">{appointmentInfo}</p>
              )}
            </CardHeader>

            <CardContent className="space-y-5">
              <AnimatePresence>
                {form.medications.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative p-4 border rounded-lg border-gray-200 bg-gray-50 space-y-3 shadow-sm"
                  >
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeMedication(idx)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Input
                      placeholder="Medicine Name"
                      value={m.name}
                      onChange={(e) =>
                        handleMedicationChange(idx, "name", e.target.value)
                      }
                      className="max-w-full"
                    />
                    <Input
                      placeholder="Dosage"
                      value={m.dosage}
                      onChange={(e) =>
                        handleMedicationChange(idx, "dosage", e.target.value)
                      }
                      className="max-w-full"
                    />
                    <Input
                      placeholder="Instructions"
                      value={m.instructions}
                      onChange={(e) =>
                        handleMedicationChange(
                          idx,
                          "instructions",
                          e.target.value
                        )
                      }
                      className="max-w-full"
                    />
                    <Input
                      placeholder="Duration (optional)"
                      value={m.duration}
                      onChange={(e) =>
                        handleMedicationChange(idx, "duration", e.target.value)
                      }
                      className="max-w-full"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              <Button
                onClick={addMedication}
                size="sm"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4" /> Add Medication
              </Button>

              <textarea
                name="notes"
                placeholder="Notes"
                value={form.notes}
                onChange={handleNotesChange}
                className="w-full p-3 border rounded-lg resize-none border-gray-300 bg-white text-gray-900"
              />

              <Button
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
              >
                Update Prescription
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
