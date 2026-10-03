import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ReviewInput } from "@/types/review";

type ReviewsValue = {
  /** The shopper's review of one item in one order, if they have written one. */
  getReview: (orderId: string, productId: number) => ReviewInput | undefined;
  submitReview: (orderId: string, productId: number, input: ReviewInput) => void;
};

const ReviewsContext = createContext<ReviewsValue | null>(null);

function reviewKey(orderId: string, productId: number) {
  return `${orderId}:${productId}`;
}

/** Holds the shopper's reviews of delivered items until POST /reviews is wired. */
export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Record<string, ReviewInput>>({});

  const getReview = useCallback(
    (orderId: string, productId: number) => reviews[reviewKey(orderId, productId)],
    [reviews],
  );

  const submitReview = useCallback((orderId: string, productId: number, input: ReviewInput) => {
    setReviews((current) => ({ ...current, [reviewKey(orderId, productId)]: input }));
  }, []);

  const value = useMemo(() => ({ getReview, submitReview }), [getReview, submitReview]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const value = useContext(ReviewsContext);
  if (!value) throw new Error("useReviews must be used inside ReviewsProvider");
  return value;
}
