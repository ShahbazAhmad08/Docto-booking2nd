"use client";

import PrescriptionManager from "@/components/PrescriptionManager";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DoctorPrescriptionsPage() {
  const { user, role, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
        🔒 Please log in to access prescriptions.
      </p>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            onClick={() => router.push("/doctor/dashboard")}
            size="sm"
            className="flex items-center gap-1 bg-gray-800 text-white hover:bg-gray-700"
          >
            <StepBack className="w-4 h-4" /> Back to Dashboard
          </Button>

          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-white dark:text-white"
          >
            Doctor Prescriptions
          </motion.h1>

          {/* Prescription Manager */}
          {user && role === "doctor" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-4"
            >
              <PrescriptionManager doctorId={user.id} />
            </motion.div>
          ) : (
            <p className="text-center mt-10 text-red-500">
              ❌ Access denied. Doctors only.
            </p>
          )}
        </div>
      </motion.div>
    </ProtectedRoute>
  );
}
