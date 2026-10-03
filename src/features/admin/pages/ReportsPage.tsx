import { useState, type ChangeEvent } from "react";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { revenueBars } from "@/features/admin/mock";

const metrics = [
  { label: "Gross revenue", value: "₦48.2m", delta: "+12.8%" },
  { label: "Orders", value: "18,420", delta: "+9.4%" },
  { label: "Average order", value: "₦26,170", delta: "+3.1%" },
];

export default function ReportsPage() {
  const [from, setFrom] = useState("2025-06-01");
  const [to, setTo] = useState("2025-06-20");

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/admin" }, { label: "Reports" }]} />
      <PageHeader
        eyebrow="ANALYTICS"
        title="Reports"
        description="Marketplace performance for the selected reporting period."
      />

      <div className="mb-8 flex w-max items-end gap-3 rounded-hm-sm bg-hm-surface p-2 max-[480px]:w-full max-[480px]:flex-col max-[480px]:items-stretch">
        <div className="flex flex-col gap-[3px]">
          <label htmlFor="date-from" className="pl-3 text-[8px] text-hm-muted">
            From
          </label>
          <input
            id="date-from"
            type="date"
            value={from}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFrom(event.target.value)}
            className="min-h-[46px] rounded-hm-sm border-0 bg-hm-field px-3 text-[10px] outline-0"
          />
        </div>
        <span className="pb-4 text-[9px] text-hm-muted max-[480px]:hidden">to</span>
        <div className="flex flex-col gap-[3px]">
          <label htmlFor="date-to" className="pl-3 text-[8px] text-hm-muted">
            To
          </label>
          <input
            id="date-to"
            type="date"
            value={to}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setTo(event.target.value)}
            className="min-h-[46px] rounded-hm-sm border-0 bg-hm-field px-3 text-[10px] outline-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 max-[760px]:grid-cols-1">
        {metrics.map((metric) => (
          <article key={metric.label} className="flex min-h-[150px] flex-col rounded-hm-md bg-hm-surface p-6">
            <div className="text-[9px] text-hm-muted">{metric.label}</div>
            <div className="mt-auto text-[28px] font-[650] tracking-[-0.04em]">{metric.value}</div>
            <div className="mt-1 text-[8px] text-[#267452]">{metric.delta}</div>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-hm-md bg-hm-surface p-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="mt-3 text-[24px] font-[650] tracking-[-0.04em]">Revenue over time</div>
            <div className="mt-2 text-[9px] text-hm-muted">Daily gross marketplace revenue</div>
          </div>
          <div className="text-[22px] font-bold">₦48.2m</div>
        </div>
        <div
          aria-label="Revenue bar chart"
          className="mt-12 flex h-70 items-end gap-[clamp(6px,2vw,22px)] border-b border-hm-border bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_69px,#f0f0f2_70px)] px-3"
        >
          {revenueBars.map((height, index) => (
            <div
              key={index}
              className="max-w-11 flex-1 rounded-t-[6px] bg-hm-accent opacity-[0.82]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[8px] text-hm-muted">
          <div>1 Jun</div>
          <div>10 Jun</div>
          <div>20 Jun</div>
        </div>
      </section>
    </>
  );
}
