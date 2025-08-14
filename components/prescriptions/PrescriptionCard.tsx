"use client";
import { Button } from "@/components/ui/button";

export default function PrescriptionCard({ data, onEdit, onDelete }: any) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
      <h3 className="text-lg font-bold">{data.medicineName}</h3>
      <p>
        <b>Dosage:</b> {data.dosage}
      </p>
      <p>
        <b>Duration:</b> {data.duration}
      </p>
      <p>
        <b>Notes:</b> {data.notes}
      </p>
      <p className="text-xs text-gray-500">📅 {data.date}</p>

      <div className="mt-3 flex gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
