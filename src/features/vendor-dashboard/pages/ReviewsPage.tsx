import { useMemo, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import Rating from "@/components/Rating";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import StatusBadge from "@/components/StatusBadge";
import { useRespondToReview, useReviewsForProducts } from "@/features/reviews/api";
import { useVendorProducts } from "@/features/vendor-dashboard/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Review } from "@/types/review";
import type { VendorProduct } from "@/types/product";

const PRODUCTS_LIMIT = 100;

type Filter = "all" | "unanswered";

export default function ReviewsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data: productsPage, isPending: productsPending, isError: productsError, refetch: refetchProducts } =
    useVendorProducts({ limit: PRODUCTS_LIMIT });
  const products = productsPage?.data ?? [];
  const productIds = useMemo(() => products.map((product) => product.id), [products]);
  const { reviews, isPending: reviewsPending, isError: reviewsError, refetch: refetchReviews } =
    useReviewsForProducts(productIds);
  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const isPending = productsPending || (productIds.length > 0 && reviewsPending);
  const isError = productsError || reviewsError;

  const sorted = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const unanswered = sorted.filter((review) => !review.vendorResponse);
  const visible = filter === "unanswered" ? unanswered : sorted;

  const average = sorted.length ? sorted.reduce((sum, review) => sum + review.rating, 0) / sorted.length : 0;

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/vendor/dashboard" }, { label: "Reviews" }]} />
      <PageHeader
        eyebrow="CUSTOMER FEEDBACK"
        title="Reviews"
        description="Learn what buyers value, where your products can improve, and reply to anyone waiting on you."
      />

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your reviews. Please try again.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              refetchProducts();
              refetchReviews();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <RevealGroup className="grid grid-cols-3 gap-5 max-[760px]:grid-cols-1">
            {[
              { label: "Average rating", value: isPending ? null : average.toFixed(1) },
              { label: "Total reviews", value: isPending ? null : String(sorted.length) },
              { label: "Awaiting your reply", value: isPending ? null : String(unanswered.length) },
            ].map((metric) => (
              <RevealItem key={metric.label} className="flex">
                <article className="flex min-h-[140px] flex-1 flex-col rounded-hm-md bg-hm-surface p-[26px]">
                  <span className="text-[9px] text-hm-muted">{metric.label}</span>
                  {metric.value === null ? (
                    <div className="mt-auto h-9 w-20 animate-pulse rounded-hm-sm bg-hm-field" />
                  ) : (
                    <b className="mt-auto text-[34px] tracking-[-0.05em]">{metric.value}</b>
                  )}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-6 flex gap-2">
            {(["all", "unanswered"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={cn(
                  "rounded-full px-4 py-2 text-[10px] font-[650] transition-colors duration-200",
                  filter === option ? "bg-hm-text text-white" : "bg-hm-field text-hm-muted hover:text-hm-text",
                )}
              >
                {option === "all" ? "All reviews" : `Needs reply${unanswered.length ? ` (${unanswered.length})` : ""}`}
              </button>
            ))}
          </div>

          {isPending ? (
            <div className="mt-5 grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-hm-md bg-hm-field" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-5 flex min-h-[220px] flex-col items-center justify-center gap-3 text-[12px] text-hm-muted">
              <Icon name="star" size={28} />
              <div>{filter === "unanswered" ? "You're all caught up — no replies waiting." : "No reviews yet."}</div>
            </div>
          ) : (
            <ul className="mt-5 m-0 list-none p-0">
              {visible.map((review) => (
                <VendorReviewRow key={review.id} review={review} product={productById.get(review.productId)} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

function VendorReviewRow({ review, product }: { review: Review; product: VendorProduct | undefined }) {
  const [editing, setEditing] = useState(false);
  const [response, setResponse] = useState(review.vendorResponse ?? "");
  const respond = useRespondToReview();

  function submit() {
    if (!response.trim()) return;
    respond.mutate({ id: review.id, response: response.trim() }, { onSuccess: () => setEditing(false) });
  }

  return (
    <li className="grid grid-cols-[64px_1fr] gap-4 rounded-hm-md bg-hm-surface p-6">
      {product?.images[0] ? (
        <img className="size-16 rounded-[10px] bg-hm-field object-cover" src={product.images[0].url} alt="" />
      ) : (
        <div className="size-16 rounded-[10px] bg-hm-field" />
      )}

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <strong className="truncate text-[13px] font-[650]">{product?.name ?? "Product"}</strong>
          <small className="text-[10px] text-hm-muted">{formatDate(review.createdAt)}</small>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <Rating value={review.rating} size={13} />
          {review.isVerified && <StatusBadge tone="success">Verified purchase</StatusBadge>}
        </div>
        <p className="m-0 mt-2.5 max-w-[620px] text-[12px] leading-[1.7] text-hm-muted">{review.comment}</p>

        {review.vendorResponse && !editing && (
          <div className="mt-3 max-w-[560px] rounded-hm-sm bg-hm-field p-4">
            <p className="m-0 text-[10px] font-[650] text-hm-muted">Your response</p>
            <p className="m-0 mt-1.5 text-[12px] leading-[1.6] text-hm-text">{review.vendorResponse}</p>
          </div>
        )}

        {editing ? (
          <div className="mt-3 max-w-[560px]">
            <textarea
              rows={3}
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Thank the buyer or address their feedback…"
              className="w-full resize-y rounded-hm-sm border-0 bg-hm-field p-3 text-[12px] leading-[1.6] text-hm-text"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="quiet" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" disabled={!response.trim() || respond.isPending} onClick={submit}>
                {respond.isPending ? "Posting…" : "Post response"}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => setEditing(true)}>
            {review.vendorResponse ? "Edit response" : "Respond"}
          </Button>
        )}
      </div>
    </li>
  );
}
