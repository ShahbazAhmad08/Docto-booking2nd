"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { ModernFooter } from "@/components/ModernFooter";
import { reviewsAPI, patientsAPI, Review, Patient } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Star } from "lucide-react";

// Chart imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DoctorReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  const loadReviews = async () => {
    if (!user?.id || user.role !== "doctor") return;

    setLoading(true);
    setError(null);

    try {
      const data = await reviewsAPI.getByDoctorId(user.id);

      // Fetch patient details
      const patientIds = Array.from(new Set(data.map((r) => r.patientId)));
      const patientsData: Record<string, Patient> = {};

      await Promise.all(
        patientIds.map(async (pid) => {
          try {
            const patient = await patientsAPI.getByIds(pid);
            patientsData[pid] = patient;
          } catch (err) {
            console.error(`Failed to fetch patient ${pid}:`, err);
          }
        })
      );
      console.log("Fetched patients:", patientsData);

      setPatients(patientsData);
      setReviews(data);

      // Calculate average rating
      if (data.length) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Number(avg.toFixed(1)));
      } else {
        setAverageRating(0);
      }
    } catch (err: any) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [user]);

  // Chart data
  const ratingDistribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Patient Reviews
          </h1>

          {loading && (
            <p className="text-gray-500 dark:text-gray-300">
              Loading reviews...
            </p>
          )}
          {error && (
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          )}

          {!loading && reviews.length > 0 && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                Average Rating: {averageRating}{" "}
                <Star className="w-5 h-5 text-yellow-400" />
              </h2>

              <div className="w-full h-48 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <XAxis dataKey="star" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#facc15" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300">
              No reviews yet from patients.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => {
              const patientName =
                patients[review.patientId]?.name || "john Doe";

              return (
                <Card
                  key={review.id}
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{patientName}</span>
                      <span className="flex items-center gap-1 text-yellow-400">
                        {review.rating} <Star className="w-4 h-4" />
                      </span>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-200">
                      {review.reviewText}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <ModernFooter />
      </div>
    </ProtectedRoute>
  );
}
