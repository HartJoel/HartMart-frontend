import { useQueries, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { CreateReviewInput, Review, ReviewInput } from "@/types/review";

const REVIEWS_PREFIX = "/api/v1/reviews";

function reviewsKey(productId: string) {
  return ["reviews", productId] as const;
}

function productReviewsQuery(productId: string) {
  return { queryKey: reviewsKey(productId), queryFn: () => apiRequest<Review[]>(`${REVIEWS_PREFIX}/${productId}`) };
}

/** All reviews for a product. Seen as a plain array — no pagination documented for this endpoint. */
export function useProductReviews(productId: string | undefined) {
  return useQuery({ ...productReviewsQuery(productId ?? ""), enabled: productId !== undefined });
}

/**
 * Every review across a set of products, for a vendor's "all my reviews" inbox. There's no
 * vendor-scoped review endpoint, so this fires one `GET /reviews/:productId` per product (shares
 * its cache entry with `useProductReviews`, so a reply posted here shows up instantly on the
 * product page too) and flattens the results.
 */
export function useReviewsForProducts(productIds: string[]) {
  const results = useQueries({ queries: productIds.map(productReviewsQuery) });

  return {
    reviews: results.flatMap((result) => result.data ?? []),
    isPending: results.some((result) => result.isPending),
    isError: results.some((result) => result.isError),
    refetch: () => results.forEach((result) => result.refetch()),
  };
}

/** Posts a review. The API requires `orderId` — only a verified purchaser can review a product. */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      apiRequest<Review>(REVIEWS_PREFIX, { method: "POST", body: JSON.stringify(input) }),
    onSuccess: (review) => queryClient.invalidateQueries({ queryKey: reviewsKey(review.productId) }),
  });
}

/** Edits the signed-in user's own review. */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReviewInput }) =>
      apiRequest<Review>(`${REVIEWS_PREFIX}/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
    onSuccess: (review) => queryClient.invalidateQueries({ queryKey: reviewsKey(review.productId) }),
  });
}

/** Deletes the signed-in user's own review. Callers pass `productId` for cache invalidation since the API returns no body. */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; productId: string }) =>
      apiRequest<void>(`${REVIEWS_PREFIX}/${id}`, { method: "DELETE" }),
    onSuccess: (_data, { productId }) => queryClient.invalidateQueries({ queryKey: reviewsKey(productId) }),
  });
}

/** A vendor's reply to a review on their own product. */
export function useRespondToReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) =>
      apiRequest<Review>(`${REVIEWS_PREFIX}/${id}/response`, { method: "POST", body: JSON.stringify({ response }) }),
    onSuccess: (review) => queryClient.invalidateQueries({ queryKey: reviewsKey(review.productId) }),
  });
}

/**
 * Toggles the signed-in user's "helpful" vote. The API returns no body, so callers compute and
 * pass the next count themselves (current `helpful` ± 1) and `productId` drives invalidation.
 */
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, liked, helpful }: { id: string; productId: string; liked: boolean; helpful: number }) =>
      apiRequest<void>(`${REVIEWS_PREFIX}/${id}/helpful`, { method: "POST", body: JSON.stringify({ liked, helpful }) }),
    onSuccess: (_data, { productId }) => queryClient.invalidateQueries({ queryKey: reviewsKey(productId) }),
  });
}
