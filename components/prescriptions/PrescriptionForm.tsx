"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PrescriptionForm({ onSubmit, initialData }: any) {
  const [form, setForm] = useState(
    initialData || {
      medicineName: "",
      dosage: "",
      duration: "",
      notes: "",
    }
  );

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded shadow"
    >
      <Input
        name="medicineName"
        placeholder="Medicine Name"
        value={form.medicineName}
        onChange={handleChange}
      />
      <Input
        name="dosage"
        placeholder="Dosage"
        value={form.dosage}
        onChange={handleChange}
      />
      <Input
        name="duration"
        placeholder="Duration"
        value={form.duration}
        onChange={handleChange}
      />
      <Textarea
        name="notes"
        placeholder="Notes/Instructions"
        value={form.notes}
        onChange={handleChange}
      />
      <Button type="submit" className="w-full">
        Save Prescription
      </Button>
    </form>
  );
}
