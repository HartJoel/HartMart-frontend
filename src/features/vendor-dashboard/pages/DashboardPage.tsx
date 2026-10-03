import PageHeader from "@/components/PageHeader";
import OrdersTable from "@/features/vendor-dashboard/components/OrdersTable";

const metrics = [
  { label: "Total Sales", value: "₦2.48m", note: "+12.4% this month" },
  { label: "Orders This Month", value: "186", note: "24 awaiting fulfilment" },
  { label: "Average Rating", value: "4.8", note: "From 342 reviews" },
  { label: "Active Products", value: "42", note: "3 drafts" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW"
        title="Good morning, Ayo."
        description="Here’s what’s happening with your store today."
      />

      <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[700px]:grid-cols-1">
        {metrics.map((metric) => (
          <article key={metric.label} className="flex min-h-[180px] flex-col rounded-hm-md bg-hm-surface p-[26px]">
            <span className="text-[9px] text-hm-muted">{metric.label}</span>
            <b className="mt-auto text-[34px] tracking-[-0.05em]">{metric.value}</b>
            <small className="text-[8px] text-hm-muted">{metric.note}</small>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-[12px] border-l-[3px] border-[#c18a25] bg-[#fbf5e9] p-[22px]">
        <b className="block text-[10px]">Two products are running low</b>
        <span className="mt-[5px] block text-[10px] text-[#77684f]">Pulse Sport Earbuds · 5 left &nbsp; Pods Mini · 3 left</span>
      </div>

      <section className="mt-20">
        <h2 className="text-[26px]">Recent orders</h2>
        <OrdersTable />
      </section>
    </>
  );
}
