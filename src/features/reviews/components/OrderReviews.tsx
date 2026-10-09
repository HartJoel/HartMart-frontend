import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Rating from "@/components/Rating";
import ReviewForm from "@/features/reviews/components/ReviewForm";
import { useReviews } from "@/features/reviews/ReviewsContext";
import type { Product } from "@/types/product";

/**
 * Lets the shopper rate each item in a delivered order. Takes `orderId`/`items` directly rather
 * than an `Order` — the real Orders API doesn't return line items yet, so callers need their own
 * source for `items` until that's confirmed.
 */
export default function OrderReviews({ orderId, items }: { orderId: string; items: Product[] }) {
  const { getReview, submitReview } = useReviews();
  const [reviewing, setReviewing] = useState<Product | null>(null);

  return (
    <section>
      <h3 className="m-0 text-[13px] font-[650]">Rate your items</h3>
      <p className="m-0 mt-1 mb-4 text-[12px] text-hm-muted">Your feedback helps independent vendors grow.</p>

      <ul className="m-0 list-none p-0">
        {items.map((product) => {
          const review = getReview(orderId, product.id);

          return (
            <li
              key={product.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-hm-border py-4"
            >
              <div className="min-w-0">
                <p className="m-0 truncate text-[13px] font-[600]">{product.name}</p>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-hm-muted">
                  {review ? (
                    <>
                      <Rating value={review.rating} size={12} />
                      <span>Reviewed</span>
                    </>
                  ) : (
                    <span>Not reviewed yet</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setReviewing(product)}>
                {review ? "Edit review" : "Leave a review"}
              </Button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {reviewing && (
          <Modal title={reviewing.name} eyebrow="LEAVE A REVIEW" onClose={() => setReviewing(null)}>
            <ReviewForm
              initial={getReview(orderId, reviewing.id)}
              onSubmit={(input) => {
                submitReview(orderId, reviewing.id, input);
                setReviewing(null);
              }}
              onCancel={() => setReviewing(null)}
            />
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}
