import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Rating from "@/components/Rating";
import ReviewForm from "@/features/reviews/components/ReviewForm";
import { useReviews } from "@/features/reviews/ReviewsContext";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

/** Lets the shopper rate each item in a delivered order. */
export default function OrderReviews({ order }: { order: Order }) {
  const { getReview, submitReview } = useReviews();
  const [reviewing, setReviewing] = useState<Product | null>(null);

  return (
    <section>
      <h3 className="m-0 text-[13px] font-[650]">Rate your items</h3>
      <p className="m-0 mt-1 mb-4 text-[12px] text-hm-muted">Your feedback helps independent vendors grow.</p>

      <ul className="m-0 list-none p-0">
        {order.items.map((product) => {
          const review = getReview(order.id, product.id);

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
              initial={getReview(order.id, reviewing.id)}
              onSubmit={(input) => {
                submitReview(order.id, reviewing.id, input);
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
