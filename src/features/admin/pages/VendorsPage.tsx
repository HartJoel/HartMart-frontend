import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import StatusBadge, { type StatusTone } from "@/components/StatusBadge";
import ConfirmVendorActionModal from "@/features/admin/components/ConfirmVendorActionModal";
import RejectApplicationModal from "@/features/admin/components/RejectApplicationModal";
import { useVendorMetrics } from "@/features/admin/api";
import { useVendors } from "@/features/vendor-storefront/api";
import { formatDate, getInitials } from "@/lib/format";
import type { VendorProfile } from "@/types/vendor";

const selectClass = "min-h-[46px] rounded-hm-sm border-0 bg-hm-surface px-3 text-[10px] outline-0";

const statusOptions = [
  { label: "All statuses", value: "" },
  { label: "Pending verification", value: "PENDING_VERIFICATION" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
];

const statusTone: Record<string, StatusTone> = {
  VERIFIED: "success",
  PENDING_VERIFICATION: "warning",
  REJECTED: "danger",
  SUSPENDED: "danger",
};

export default function VendorsPage() {
  const { data: vendors, isPending, isError, refetch } = useVendors();
  const [status, setStatus] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<VendorProfile | null>(null);
  const [confirming, setConfirming] = useState<{ vendor: VendorProfile; action: "verify" | "suspend" } | null>(null);

  const filtered = (vendors ?? []).filter((vendor) => !status || vendor.status === status);
  const pendingCount = (vendors ?? []).filter((vendor) => vendor.status === "PENDING_VERIFICATION").length;

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/admin" }, { label: "Vendors" }]} />
      <PageHeader
        eyebrow="TRUST & SAFETY"
        title="Vendor moderation"
        description={
          isPending
            ? "Loading vendors…"
            : `${pendingCount} application${pendingCount === 1 ? "" : "s"} need review before they can start selling.`
        }
      />

      <div className="mb-5 flex justify-end">
        <select
          aria-label="Filter by status"
          className={selectClass}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load vendors. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isPending ? (
        <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[410px] animate-pulse rounded-hm-md bg-hm-field" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-[12px] text-hm-muted">
          <Icon name="check" size={30} />
          <div>No vendors match this filter.</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
          {filtered.map((vendor) => (
            <article key={vendor.id} className="flex min-h-[410px] flex-col rounded-hm-md bg-hm-surface p-8">
              <div className="flex items-start justify-between gap-3">
                {vendor.storeLogo ? (
                  <img src={vendor.storeLogo} alt="" className="size-13 shrink-0 rounded-full object-cover" />
                ) : (
                  <div className="grid size-13 shrink-0 place-items-center rounded-full bg-hm-text text-[11px] font-[700] text-white">
                    {getInitials(vendor.storeName)}
                  </div>
                )}
                <StatusBadge tone={statusTone[vendor.status] ?? "neutral"} className="shrink-0 capitalize">
                  {vendor.status.replace(/_/g, " ").toLowerCase()}
                </StatusBadge>
              </div>
              <div className="mt-12 truncate text-[20px] font-[650] tracking-[-0.035em]">{vendor.storeName}</div>
              <div className="mt-1 text-[10px] text-hm-muted">Applied {formatDate(vendor.createdAt)}</div>

              <div className="mt-5 flex flex-col">
                {[
                  ["Category", vendor.storeCategory],
                  ["Registration", vendor.businessRegistration ?? "—"],
                  ["Location", vendor.businessAddress ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 border-t border-hm-border py-2 text-[9px]">
                    <span className="text-hm-muted">{label}</span>
                    <span className="truncate">{value}</span>
                  </div>
                ))}
              </div>

              {vendor.status === "REJECTED" && vendor.rejectionReason && (
                <p className="m-0 mt-3 text-[9px] text-hm-error">Rejected: {vendor.rejectionReason}</p>
              )}

              <button
                type="button"
                className="mt-4 w-max border-0 bg-transparent p-0 text-[9px] font-[650] text-hm-accent underline-offset-2 hover:underline"
                onClick={() => setExpandedId(expandedId === vendor.id ? null : vendor.id)}
              >
                {expandedId === vendor.id ? "Hide metrics" : "View metrics"}
              </button>
              {expandedId === vendor.id && <VendorMetricsPanel vendorId={vendor.id} />}

              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {vendor.status !== "VERIFIED" && (
                  <Button size="sm" onClick={() => setConfirming({ vendor, action: "verify" })}>
                    Verify
                  </Button>
                )}
                {vendor.status === "PENDING_VERIFICATION" && (
                  <Button variant="ghost" size="sm" onClick={() => setRejecting(vendor)}>
                    Reject
                  </Button>
                )}
                {vendor.status !== "SUSPENDED" && vendor.status !== "REJECTED" && (
                  <Button variant="quiet" size="sm" onClick={() => setConfirming({ vendor, action: "suspend" })}>
                    Suspend
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {rejecting && <RejectApplicationModal vendor={rejecting} onClose={() => setRejecting(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {confirming && (
          <ConfirmVendorActionModal
            vendor={confirming.vendor}
            action={confirming.action}
            onClose={() => setConfirming(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Lazily fetches `GET /vendor/:id/metrics` only once a card's metrics are expanded. */
function VendorMetricsPanel({ vendorId }: { vendorId: string }) {
  const { data: metrics, isPending, isError } = useVendorMetrics(vendorId);

  if (isPending) return <div className="mt-3 h-14 animate-pulse rounded-hm-sm bg-hm-field" />;
  if (isError || !metrics) return <p className="m-0 mt-3 text-[9px] text-hm-error">Couldn&apos;t load metrics.</p>;

  return (
    <div className="mt-3 grid grid-cols-2 gap-3 rounded-hm-sm bg-hm-field p-3 text-[9px]">
      <div>
        <span className="text-hm-muted">Rating</span>
        <div className="mt-1 font-[650]">
          {metrics.averageRating.toFixed(1)} · {metrics.totalReviews} {metrics.totalReviews === 1 ? "review" : "reviews"}
        </div>
      </div>
      <div>
        <span className="text-hm-muted">Verified</span>
        <div className="mt-1 font-[650]">{metrics.verifiedAt ? formatDate(metrics.verifiedAt) : "Not yet"}</div>
      </div>
    </div>
  );
}
