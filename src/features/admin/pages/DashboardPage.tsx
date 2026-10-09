import { Link } from "react-router";
import Button, { buttonClasses } from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import RevealGroup from "@/components/RevealGroup";
import { RevealItem } from "@/components/Reveal";
import { useAdminDashboard } from "@/features/admin/api";
import { formatNaira } from "@/lib/format";

export default function DashboardPage() {
  const { data, isPending, isError, refetch } = useAdminDashboard();

  const metrics = [
    { label: "Total Users", value: data ? data.totalUsers.toLocaleString("en-NG") : null },
    { label: "Total Vendors", value: data ? data.totalVendors.toLocaleString("en-NG") : null },
    { label: "Total Orders", value: data ? data.totalOrders.toLocaleString("en-NG") : null },
    { label: "Total Revenue", value: data ? formatNaira(data.totalRevenue) : null },
  ];

  return (
    <>
      <PageHeader
        eyebrow="PLATFORM OVERVIEW"
        title="Command centre."
        description="A clear view of marketplace growth, activity and operations."
      />

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load dashboard analytics. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          <RevealGroup className="grid grid-cols-4 gap-5 max-[1100px]:grid-cols-2 max-[480px]:grid-cols-1">
            {metrics.map((metric) => (
              <RevealItem key={metric.label} className="flex">
                <article className="flex min-h-[190px] flex-1 flex-col rounded-hm-md bg-hm-surface p-8">
                  {isPending || metric.value === null ? (
                    <>
                      <div className="h-3 w-24 animate-pulse rounded-hm-sm bg-hm-field" />
                      <div className="mt-auto h-9 w-28 animate-pulse rounded-hm-sm bg-hm-field" />
                    </>
                  ) : (
                    <>
                      <div className="text-[10px] font-[650] text-hm-muted">{metric.label}</div>
                      <div className="mt-auto text-[36px] font-[650] tracking-[-0.05em]">{metric.value}</div>
                    </>
                  )}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className="mt-8 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
            <RevealItem className="flex">
              <section className="flex min-h-[310px] flex-1 flex-col rounded-hm-md bg-hm-text p-8 text-white">
                <div className="text-[9px] font-[750] tracking-[0.12em] text-hm-accent">TODAY</div>
                <div className="mt-3 text-[24px] font-[650] tracking-[-0.04em]">
                  {data ? formatNaira(data.todaySales) : "—"}
                </div>
                <p className="mt-4 max-w-[320px] text-[11px] leading-[1.6] text-[#a1a1aa]">Gross sales recorded today.</p>
              </section>
            </RevealItem>

            <RevealItem className="flex">
              <section className="flex min-h-[310px] flex-1 flex-col rounded-hm-md bg-hm-surface p-8">
                <div className="text-[9px] font-[750] tracking-[0.12em] text-hm-accent">NEEDS ATTENTION</div>
                <div className="mt-3 text-[24px] font-[650] tracking-[-0.04em]">
                  {!data
                    ? "—"
                    : data.pendingVerifications === 0
                      ? "All caught up"
                      : `${data.pendingVerifications} pending verification${data.pendingVerifications === 1 ? "" : "s"}`}
                </div>
                <p className="mt-2 text-[11px] leading-[1.6] text-hm-muted">
                  {data &&
                    (data.pendingVerifications === 0
                      ? "No vendor applications are waiting on review."
                      : "Vendor applications are waiting on your review.")}
                </p>
                {data && data.pendingVerifications > 0 && (
                  <Link to="/admin/vendors" className={buttonClasses({ size: "sm", className: "mt-auto w-max" })}>
                    Review vendors
                  </Link>
                )}
              </section>
            </RevealItem>
          </RevealGroup>
        </>
      )}
    </>
  );
}
