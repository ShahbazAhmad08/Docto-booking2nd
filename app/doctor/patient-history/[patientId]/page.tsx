"use client";

import { useParams } from "next/navigation";
import MedicalHistoryPage from "@/components/MedicalHistoryPage";

export default function PatientHistory() {
  const params = useParams();
  const { patientId } = params;

  if (!patientId) return <p>No patient selected</p>;

  const patientIdStr = Array.isArray(patientId) ? patientId[0] : patientId;
  return <MedicalHistoryPage patientId={patientIdStr} />;
}
