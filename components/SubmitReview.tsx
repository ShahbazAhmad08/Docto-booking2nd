import { useEffect, useState } from "react";
import { reviewsAPI, ReviewInput, Review } from "../lib/api";

interface Props {
  appointmentId: string;
  doctorId: string;
  patientId: string;
  onSuccess?: () => void;
  existingReview?: Review; // For editing
}

export default function SubmitReview({
  appointmentId,
  doctorId,
  patientId,
  onSuccess,
  existingReview,
}: Props) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill values if editing
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.reviewText);
    }
  }, [existingReview]);

  const handleSubmit = async () => {
    if (!rating || !reviewText.trim()) {
      return alert("Please fill all fields.");
    }
    setLoading(true);

    try {
      if (existingReview) {
        // Update existing review
        await reviewsAPI.update(existingReview.id, { rating, reviewText });
        alert("Review updated!");
      } else {
        // Create new review
        const review: ReviewInput = {
          appointmentId,
          doctorId,
          patientId,
          rating,
          reviewText,
        };
        await reviewsAPI.create(review);
        alert("Review submitted!");
      }

      setRating(0);
      setReviewText("");
      onSuccess?.();
    } catch (err: any) {
      alert(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">
        {existingReview ? "Edit Review" : "Submit Review"}
      </h3>

      <div className="mb-2">
        <label className="block mb-1">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-1 rounded w-full"
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ★
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="block mb-1">Review:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="border p-1 rounded w-full"
          rows={4}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"}
      </button>
    </div>
  );
}
