"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent } from "react";
import { prescriptionsAPI, type Prescription } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MedicationForm {
  name: string;
  dosage: string;
  instructions: string;
  duration?: string;
}

interface PrescriptionForm {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  medications: MedicationForm[];
  notes: string;
}

export default function NewPrescriptionPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const appointmentId = params.get("appointmentId") || "";
  const doctorId = params.get("doctorId") || "";
  const patientId = params.get("patientId") || "";

  const [form, setForm] = useState<PrescriptionForm>({
    appointmentId,
    doctorId,
    patientId,
    medications: [{ name: "", dosage: "", instructions: "", duration: "" }],
    notes: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  // Check if prescription already exists
  useEffect(() => {
    const checkExisting = async () => {
      if (!appointmentId) return;
      try {
        const existing: Prescription[] =
          await prescriptionsAPI.getByAppointment(appointmentId);
        if (existing.length > 0) {
          setAlreadyExists(true);
          toast({
            title: "Notice",
            description: "Prescription already exists for this appointment.",
          });
          router.replace("/doctor/prescriptions");
        }
      } catch (err) {
        console.error("Error checking existing prescriptions", err);
      }
    };
    checkExisting();
  }, [appointmentId, toast, router]);

  const handleMedicationChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedMeds = [...form.medications];
    updatedMeds[index] = {
      ...updatedMeds[index],
      [e.target.name]: e.target.value,
    };
    setForm({ ...form, medications: updatedMeds });
  };

  const addMedication = () => {
    setForm((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", instructions: "", duration: "" },
      ],
    }));
  };

  const validateForm = () => {
    if (
      !form.medications[0].name.trim() ||
      !form.medications[0].dosage.trim()
    ) {
      toast({
        title: "Validation Error",
        description:
          "At least one medication with name and dosage is required.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      await prescriptionsAPI.create(form);
      toast({
        title: "Success",
        description: "Prescription created successfully.",
      });
      router.push("/doctor/prescriptions");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to create prescription.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white rounded-lg shadow p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Prescription
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Appointment ID: <b>{appointmentId}</b> | Patient ID:{" "}
                <b>{patientId}</b>
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <AnimatePresence>
                {form.medications.map((med, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative p-4 border rounded-lg border-gray-200 bg-gray-50 space-y-3 shadow-sm"
                  >
                    <Input
                      name="name"
                      placeholder="Medicine Name"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(idx, e)}
                      className="max-w-full"
                    />
                    <Input
                      name="dosage"
                      placeholder="Dosage (e.g. 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(idx, e)}
                      className="max-w-full"
                    />
                    <Input
                      name="instructions"
                      placeholder="Instructions"
                      value={med.instructions}
                      onChange={(e) => handleMedicationChange(idx, e)}
                      className="max-w-full"
                    />
                    <Input
                      name="duration"
                      placeholder="Duration (e.g. 5 days)"
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(idx, e)}
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
                <Plus className="w-4 h-4" /> Add Another Medication
              </Button>

              <textarea
                name="notes"
                placeholder="Notes"
                value={form.notes}
                className="w-full p-3 border rounded-lg resize-none border-gray-300 bg-white text-gray-900"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
              />

              <Button
                disabled={isSaving || alreadyExists}
                onClick={handleSave}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
              >
                {isSaving ? "Saving..." : "Save Prescription"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
