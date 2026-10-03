import PageHeader from "@/components/PageHeader";
import { vendorReviews } from "@/features/vendor-dashboard/mock";

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="CUSTOMER FEEDBACK"
        title="Reviews"
        description="Learn what buyers value and where your products can improve."
      />
      <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
        {vendorReviews.map((review) => (
          <article key={review.text} className="flex min-h-[220px] flex-col rounded-hm-md bg-hm-surface p-7">
            <b className="text-hm-accent">★ {review.rating}</b>
            <p className="mt-10 leading-[1.7]">{review.text}</p>
            <small className="mt-auto text-hm-muted">Verified buyer</small>
          </article>
        ))}
      </div>
    </>
  );
}
