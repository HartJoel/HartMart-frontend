import type { Review, ReviewSummary } from "@/types/review";

// Placeholder reviews until GET /reviews/:productId is wired.
export const reviewSummary: ReviewSummary = {
  average: 4.8,
  count: 126,
  distribution: { 5: 102, 4: 14, 3: 6, 2: 2, 1: 2 },
};

export const productReviews: Review[] = [
  {
    id: 1,
    author: "Adaeze O.",
    rating: 5,
    title: "Clean sound, excellent fit.",
    body: "The product arrived quickly and performs beautifully. Noise cancelling is strong on my commute.",
    date: "2026-09-12",
    verified: true,
  },
  {
    id: 2,
    author: "Tunde A.",
    rating: 5,
    title: "Great for my daily commute.",
    body: "Battery lasts more than a full week of heavy use. Charging case feels solid.",
    date: "2026-08-30",
    verified: true,
  },
  {
    id: 3,
    author: "Ngozi E.",
    rating: 4,
    title: "Worth every naira.",
    body: "Sound is rich and the fit is secure for workouts. Touch controls take a day to get used to.",
    date: "2026-08-04",
    verified: true,
  },
];
