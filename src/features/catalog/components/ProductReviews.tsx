import { useState } from "react";
import Button from "@/components/Button";
import Rating from "@/components/Rating";
import StatusBadge from "@/components/StatusBadge";
import { useAuthStore } from "@/features/auth/store";
import { useMarkReviewHelpful, useProductReviews, useRespondToReview } from "@/features/reviews/api";
import { sectionHeadClass } from "@/features/catalog/styles";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/review";

const stars = [5, 4, 3, 2, 1] as const;

/** Average, count and per-star distribution, computed from the live review list. */
function summarize(reviews: Review[]) {
  const count = reviews.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  let total = 0;
  for (const review of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(review.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star] += 1;
    total += review.rating;
  }
  return { average: count ? total / count : 0, count, distribution };
}

type ProductReviewsProps = {
  productId: string;
  /** The `userId` behind this product's vendor — if it matches the signed-in user, they can respond to reviews. */
  vendorUserId?: string;
};

export default function ProductReviews({ productId, vendorUserId }: ProductReviewsProps) {
  const { data: reviews, isPending, isError, refetch } = useProductReviews(productId);
  const isOwnerVendor = useAuthStore((state) => !!vendorUserId && state.user?.id === vendorUserId);
  const { average, count, distribution } = summarize(reviews ?? []);

  return (
    <section className="pt-[100px]">
      <div className={sectionHeadClass}>
        <div>
          <small className="block text-[10px] font-[750] tracking-[0.15em] text-hm-muted">REVIEWS</small>
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">What buyers say</h2>
          <p className="m-0 mt-2 text-[13px] text-hm-muted">Real feedback from verified HartMart purchases.</p>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-7 rounded-hm-md border border-hm-border bg-hm-surface p-6 max-[600px]:w-full max-[600px]:grid-cols-1">
          <div>
            <p className="m-0 text-[52px] leading-none font-[700] tracking-[-0.05em]">{average.toFixed(1)}</p>
            <Rating value={average} size={14} className="mt-3" />
            <p className="m-0 mt-2 text-[12px] text-hm-muted">{count} verified reviews</p>
          </div>

          <ul className="m-0 grid min-w-[200px] list-none gap-1.5 p-0">
            {stars.map((star) => {
              const share = count ? (distribution[star] / count) * 100 : 0;
              return (
                <li key={star} className="grid grid-cols-[12px_1fr_32px] items-center gap-2.5 text-[11px] text-hm-muted">
                  <span>{star}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-hm-field">
                    <span className="block h-full rounded-full bg-hm-text" style={{ width: `${share}%` }} />
                  </span>
                  <span className="text-right">{distribution[star]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {isPending ? (
        <div className="grid gap-3 border-t border-hm-border py-7">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-hm-sm bg-hm-field" />
          ))}
        </div>
      ) : isError ? (
        <div className="grid place-items-center gap-4 border-t border-hm-border py-10 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load reviews. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <p className="m-0 border-t border-hm-border py-7 text-[13px] text-hm-muted">
          No reviews yet. Purchase this product to be the first to review it.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} canRespond={isOwnerVendor && !review.vendorResponse} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewItem({ review, canRespond }: { review: Review; canRespond: boolean }) {
  const [voted, setVoted] = useState(false);
  const [responding, setResponding] = useState(false);
  const [response, setResponse] = useState("");
  const markHelpful = useMarkReviewHelpful();
  const respond = useRespondToReview();

  function toggleHelpful() {
    const nextLiked = !voted;
    markHelpful.mutate({
      id: review.id,
      productId: review.productId,
      liked: nextLiked,
      helpful: review.helpful + (nextLiked ? 1 : -1),
    });
    setVoted(nextLiked);
  }

  function submitResponse() {
    if (!response.trim()) return;
    respond.mutate(
      { id: review.id, response: response.trim() },
      { onSuccess: () => setResponding(false) },
    );
  }

  return (
    <li className="grid grid-cols-[160px_1fr] gap-6 border-t border-hm-border py-7 max-[600px]:grid-cols-1 max-[600px]:gap-3">
      <div className="flex flex-col gap-2">
        <Rating value={review.rating} size={14} />
        <strong className="text-[13px] font-[650]">{review.user?.name ?? "Verified buyer"}</strong>
        <small className="text-[11px] text-hm-muted">{formatDate(review.createdAt)}</small>
      </div>
      <div className="flex flex-col gap-2.5">
        <p className="m-0 max-w-[620px] text-[13px] leading-[1.7] text-hm-muted">{review.comment}</p>
        {review.isVerified && <StatusBadge tone="success">Verified purchase</StatusBadge>}

        {review.vendorResponse && (
          <div className="mt-2 max-w-[560px] rounded-hm-sm bg-hm-field p-4">
            <p className="m-0 text-[10px] font-[650] text-hm-muted">Store response</p>
            <p className="m-0 mt-1.5 text-[12px] leading-[1.6] text-hm-text">{review.vendorResponse}</p>
          </div>
        )}

        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            disabled={markHelpful.isPending}
            onClick={toggleHelpful}
            className="border-0 bg-transparent p-0 text-[11px] text-hm-muted underline-offset-2 hover:underline"
          >
            Helpful{review.helpful + (voted ? 1 : 0) > 0 ? ` (${review.helpful + (voted ? 1 : 0)})` : ""}
          </button>

          {canRespond && !responding && (
            <button
              type="button"
              onClick={() => setResponding(true)}
              className="border-0 bg-transparent p-0 text-[11px] text-hm-accent underline-offset-2 hover:underline"
            >
              Respond as store
            </button>
          )}
        </div>

        {responding && (
          <div className="mt-2 max-w-[560px]">
            <textarea
              rows={3}
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Thank the buyer or address their feedback…"
              className="w-full resize-y rounded-hm-sm border-0 bg-hm-field p-3 text-[12px] leading-[1.6] text-hm-text"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="quiet" size="sm" onClick={() => setResponding(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={!response.trim() || respond.isPending} onClick={submitResponse}>
                {respond.isPending ? "Posting…" : "Post response"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
