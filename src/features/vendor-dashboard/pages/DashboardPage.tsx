import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import OrdersTable from "@/features/vendor-dashboard/components/OrdersTable";
import { useVendorAnalytics, useVendorProfile } from "@/features/vendor-dashboard/api";
import { formatNaira } from "@/lib/format";

export default function DashboardPage() {
  const { data: vendor } = useVendorProfile();
  const { data: analytics, isPending, isError, refetch } = useVendorAnalytics();

  const metrics = analytics
    ? [
        { label: "Total Revenue", value: formatNaira(analytics.totalRevenue), note: `${analytics.totalSales} sales` },
        { label: "Average Order Value", value: formatNaira(analytics.averageOrderValue), note: "Per order" },
        { label: "Fulfillment Rate", value: `${analytics.fulfillmentRate.toFixed(1)}%`, note: "Of all orders" },
        { label: "Cancellation Rate", value: `${analytics.cancellationRate.toFixed(1)}%`, note: `${analytics.returnRate.toFixed(1)}% returned` },
      ]
    : [];

  return (
    <>
      <PageHeader
        eyebrow="OVERVIEW"
        title={`Good morning${vendor ? `, ${vendor.storeName}` : ""}.`}
        description="Here’s what’s happening with your store today."
      />

      {isError ? (
        <div className="grid min-h-[180px] place-items-center gap-4 rounded-hm-md border border-dashed border-hm-border px-6 py-10 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load your store&apos;s performance.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[700px]:grid-cols-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[180px] animate-pulse rounded-hm-md bg-hm-field" />
          ))}
        </div>
      ) : (
        <RevealGroup className="grid grid-cols-4 gap-5 max-[900px]:grid-cols-2 max-[700px]:grid-cols-1">
          {metrics.map((metric) => (
            <RevealItem key={metric.label} className="flex">
              <article className="flex min-h-[180px] flex-1 flex-col rounded-hm-md bg-hm-surface p-[26px]">
                <span className="text-[9px] text-hm-muted">{metric.label}</span>
                <b className="mt-auto text-[34px] tracking-[-0.05em]">{metric.value}</b>
                <small className="text-[8px] text-hm-muted">{metric.note}</small>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

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
