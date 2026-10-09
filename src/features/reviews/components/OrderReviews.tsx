import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Rating from "@/components/Rating";
import { useAuthStore } from "@/features/auth/store";
import ReviewForm from "@/features/reviews/components/ReviewForm";
import { useCreateReview, useProductReviews, useUpdateReview } from "@/features/reviews/api";
import type { OrderItem } from "@/types/order";
import type { ReviewInput } from "@/types/review";

/** Lets the shopper rate each item in a delivered order, against the real Review API. */
export default function OrderReviews({ orderId, items }: { orderId: string; items: OrderItem[] }) {
  const [reviewing, setReviewing] = useState<OrderItem | null>(null);

  return (
    <section>
      <h3 className="m-0 text-[13px] font-[650]">Rate your items</h3>
      <p className="m-0 mt-1 mb-4 text-[12px] text-hm-muted">Your feedback helps independent vendors grow.</p>

      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <ReviewRow key={item.id} item={item} onReview={() => setReviewing(item)} />
        ))}
      </ul>

      <AnimatePresence>
        {reviewing && (
          <Modal title={reviewing.name} eyebrow="LEAVE A REVIEW" onClose={() => setReviewing(null)}>
            <ReviewEditor orderId={orderId} item={reviewing} onDone={() => setReviewing(null)} />
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewRow({ item, onReview }: { item: OrderItem; onReview: () => void }) {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: reviews } = useProductReviews(item.productId);
  const own = reviews?.find((review) => review.userId === userId);

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 border-t border-hm-border py-4">
      <div className="min-w-0">
        <p className="m-0 truncate text-[13px] font-[600]">{item.name}</p>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-hm-muted">
          {own ? (
            <>
              <Rating value={own.rating} size={12} />
              <span>Reviewed</span>
            </>
          ) : (
            <span>Not reviewed yet</span>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onReview}>
        {own ? "Edit review" : "Leave a review"}
      </Button>
    </li>
  );
}

function ReviewEditor({ orderId, item, onDone }: { orderId: string; item: OrderItem; onDone: () => void }) {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: reviews } = useProductReviews(item.productId);
  const own = reviews?.find((review) => review.userId === userId);
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();

  function handleSubmit(input: ReviewInput) {
    if (own) {
      updateReview.mutate({ id: own.id, input }, { onSuccess: onDone });
    } else {
      createReview.mutate({ productId: item.productId, orderId, ...input }, { onSuccess: onDone });
    }
  }

  return (
    <ReviewForm
      initial={own ? { rating: own.rating, comment: own.comment } : undefined}
      submitting={createReview.isPending || updateReview.isPending}
      onSubmit={handleSubmit}
      onCancel={onDone}
    />
  );
}
