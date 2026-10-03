import Rating from "@/components/Rating";
import StatusBadge from "@/components/StatusBadge";
import { sectionHeadClass } from "@/features/catalog/styles";
import { formatReviewDate } from "@/lib/format";
import { productReviews, reviewSummary } from "@/lib/mock/reviews";
import type { Review } from "@/types/review";

const stars = [5, 4, 3, 2, 1] as const;

export default function ProductReviews() {
  const { average, count, distribution } = reviewSummary;

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

      {productReviews.length ? (
        <ul className="m-0 list-none p-0">
          {productReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      ) : (
        <p className="m-0 border-t border-hm-border py-7 text-[13px] text-hm-muted">
          No reviews yet. Purchase this product to be the first to review it.
        </p>
      )}
    </section>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="grid grid-cols-[160px_1fr] gap-6 border-t border-hm-border py-7 max-[600px]:grid-cols-1 max-[600px]:gap-3">
      <div className="flex flex-col gap-2">
        <Rating value={review.rating} size={14} />
        <strong className="text-[13px] font-[650]">{review.author}</strong>
        <small className="text-[11px] text-hm-muted">{formatReviewDate(review.date)}</small>
      </div>
      <div className="flex flex-col gap-2.5">
        <h3 className="m-0 text-[15px] font-[650]">{review.title}</h3>
        <p className="m-0 max-w-[620px] text-[13px] leading-[1.7] text-hm-muted">{review.body}</p>
        {review.verified && <StatusBadge tone="success">Verified purchase</StatusBadge>}
      </div>
    </li>
  );
}
