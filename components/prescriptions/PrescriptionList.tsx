"use client";
import PrescriptionCard from "./PrescriptionCard";

export default function PrescriptionList({
  prescriptions,
  onEdit,
  onDelete,
}: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prescriptions.map((p: any) => (
        <PrescriptionCard
          key={p.id}
          data={p}
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p.id)}
        />
      ))}
    </div>
  );
}
