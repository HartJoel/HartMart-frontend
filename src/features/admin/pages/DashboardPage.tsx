import PageHeader from "@/components/PageHeader";

const metrics = [
  { label: "Total Users", value: "48,294", note: "+8.2% this month" },
  { label: "Active Vendors", value: "1,248", note: "32 awaiting review" },
  { label: "Total Revenue", value: "₦184.6m", note: "+14.7% this month" },
  { label: "Orders Today", value: "1,084", note: "₦12.4m gross value" },
];

const activity = [
  { label: "New users", value: "284" },
  { label: "Vendor applications", value: "12" },
  { label: "Completed orders", value: "892" },
  { label: "Open disputes", value: "7" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="PLATFORM OVERVIEW"
        title="Command centre."
        description="A clear view of marketplace growth, activity and operations."
      />

      <div className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[480px]:grid-cols-1">
        {metrics.map((metric) => (
          <article key={metric.label} className="flex min-h-[190px] flex-col rounded-hm-md bg-hm-surface p-8">
            <div className="text-[10px] font-[650] text-hm-muted">{metric.label}</div>
            <div className="mt-auto text-[36px] font-[650] tracking-[-0.05em]">{metric.value}</div>
            <div className="mt-2 text-[9px] text-hm-muted">{metric.note}</div>
          </article>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
        <section className="min-h-[310px] rounded-hm-md bg-hm-surface p-8">
          <div className="text-[9px] font-[750] tracking-[0.12em] text-hm-accent">TODAY</div>
          <div className="mt-3 text-[24px] font-[650] tracking-[-0.04em]">Platform activity</div>
          <div className="mt-8 flex flex-col">
            {activity.map((row) => (
              <div key={row.label} className="flex justify-between border-t border-hm-border py-3 text-[11px]">
                <span>{row.label}</span>
                <b>{row.value}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[310px] flex-col rounded-hm-md bg-hm-text p-8 text-white">
          <div className="text-[9px] font-[750] tracking-[0.12em] text-hm-accent">HEALTH</div>
          <div className="mt-3 text-[24px] font-[650] tracking-[-0.04em]">Everything is running smoothly.</div>
          <p className="mt-4 max-w-[400px] text-[11px] leading-[1.6] text-[#a1a1aa]">
            Payments, orders, search and vendor services are all operational.
          </p>
          <div className="mt-auto flex items-center gap-2 text-[10px] font-[650] text-[#b5dac8]">
            <span className="size-[7px] rounded-full bg-[#4daa7c]" />
            All systems operational
          </div>
        </section>
      </div>
    </>
  );
}
