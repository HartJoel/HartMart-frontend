import { useParams } from "react-router";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { formatNaira } from "@/lib/format";
import { products } from "@/lib/mock/products";

const timeline = ["Order Placed", "Payment Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrderDetailPage() {
  const { id } = useParams();

  return (
    <>
      <PageHeader
        variant="storefront"
        eyebrow="ORDER DETAIL"
        title={`Order ${id}`}
        description="Placed on 18 June 2025"
      />

      <div className="grid grid-cols-[1fr_360px] items-start gap-[6vw] max-[900px]:grid-cols-1">
        <section>
          <h2 className="mt-[50px] mb-5 text-[16px] font-normal">Items in this order</h2>
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="flex items-center gap-3.5 border-t border-hm-border py-[18px]">
              <img className="size-[70px] rounded-[10px] object-cover" src={product.image} alt="" />
              <span className="flex-1">
                {product.name}
                <small className="mt-[5px] block text-hm-muted">{product.vendor}</small>
              </span>
              <b>{formatNaira(product.price)}</b>
            </div>
          ))}

          <h2 className="mt-[50px] mb-5 text-[16px] font-normal">Delivery timeline</h2>
          {timeline.map((step) => (
            <div key={step} className="grid min-h-[70px] grid-cols-[30px_1fr]">
              <span className="row-span-2 grid size-[18px] place-items-center rounded-full bg-hm-text text-[9px] text-white">
                ✓
              </span>
              <strong>{step}</strong>
              <small className="text-hm-muted">18 Jun · 10:42 AM</small>
            </div>
          ))}

          <article className="mt-[50px] flex items-center justify-between rounded-hm-md bg-hm-text p-7 text-white">
            <div>
              <h2 className="m-0 text-[16px] font-normal">How was your order?</h2>
              <p className="text-[#aaa]">Your feedback helps independent vendors grow.</p>
            </div>
            <Button>Leave a Review</Button>
          </article>
        </section>

        <aside className="sticky top-5 rounded-hm-md bg-hm-surface p-[30px] max-[900px]:static">
          <h2 className="m-0 text-[32px] tracking-[-0.045em]">Payment</h2>
          <p className="mt-10 block text-[10px] leading-[1.6] text-hm-muted">Visa ending in 4024</p>
          <b>₦61,800</b>
          <small className="mt-3 block text-[10px] leading-[1.6] text-hm-muted">Reference PAY-8T2N-4L9Q</small>
        </aside>
      </div>
    </>
  );
}
