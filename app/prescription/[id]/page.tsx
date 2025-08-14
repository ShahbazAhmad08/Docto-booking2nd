"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  prescriptionsAPI,
  patientsAPI,
  doctorsAPI,
  type Prescription,
  type Doctor,
  type Patient,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { Navbar } from "@/components/Navbar";

export default function PrescriptionDetailPage() {
  const params = useParams();
  const prescriptionId = params?.id as string;

  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPrescription = async () => {
      if (!prescriptionId) return;
      setLoading(true);
      try {
        const presc = await prescriptionsAPI.getById(prescriptionId);

        if (!presc.doctor?.name && presc.doctorId) {
          const doctor: Doctor = await doctorsAPI.getById(presc.doctorId);
          presc.doctor = { name: doctor.name, specialty: doctor.specialty };
        }

        if (!presc.patient?.name && presc.patientId) {
          const patient: Patient = await patientsAPI.getById(presc.patientId);
          presc.patient = { name: patient.name, age: patient.age };
        }

        setPrescription(presc);
      } catch (err) {
        console.error("Failed to fetch prescription", err);
      } finally {
        setLoading(false);
      }
    };

    loadPrescription();
  }, [prescriptionId]);

  const handleDownloadPDF = () => {
    if (!prescription) return;

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(" Prescription", 105, y, { align: "center" });

    y += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Patient: ${prescription.patient?.name || "Unknown"}`, 10, y);
    y += 8;
    doc.text(
      `Doctor: ${prescription.doctor?.name || "Unknown"} (${
        prescription.doctor?.specialty || "N/A"
      })`,
      10,
      y
    );
    y += 8;
    doc.text(`Date: ${prescription.date}`, 10, y);

    y += 12;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Medications:", 10, y);

    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    prescription.medications.forEach((med, idx) => {
      doc.text(`• ${med.name} - ${med.dosage}`, 12, y);
      y += 6;
      doc.text(`  Duration: ${med.duration}`, 14, y);
      y += 6;
      doc.text(`  Instructions: ${med.instructions}`, 14, y);
      y += 10;
    });

    if (prescription.notes) {
      doc.setFont("helvetica", "italic");
      doc.text(`Notes: ${prescription.notes}`, 10, y);
    }

    doc.save(`Prescription-${prescription.id}.pdf`);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (!prescription)
    return <p className="text-center mt-20">Prescription not found.</p>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h2 className="text-3xl font-bold text-center mb-6">
          Prescription Detail
        </h2>

        <div className="space-y-2 mb-6">
          <p>
            <span className="font-semibold">Patient:</span>{" "}
            {prescription.patient?.name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Doctor:</span>{" "}
            {prescription.doctor?.name || "Unknown"} (
            {prescription.doctor?.specialty || "N/A"})
          </p>
          <p>
            <span className="font-semibold">Date:</span> {prescription.date}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Medications:</h3>
          {prescription.medications.map((m, idx) => (
            <div
              key={idx}
              className="border-l-4 border-blue-500 pl-3 mb-3 p-2 bg-gray-50 rounded"
            >
              <p>
                <span className="font-semibold">Name:</span> {m.name}
              </p>
              <p>
                <span className="font-semibold">Dosage:</span> {m.dosage}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {m.duration}
              </p>
              <p>
                <span className="font-semibold">Instructions:</span>{" "}
                {m.instructions}
              </p>
            </div>
          ))}
        </div>

        {prescription.notes && (
          <div className="mb-6 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p>
              <span className="font-semibold">Notes:</span> {prescription.notes}
            </p>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={handleDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
