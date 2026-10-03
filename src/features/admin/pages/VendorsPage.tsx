import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";
import RejectApplicationModal from "@/features/admin/components/RejectApplicationModal";
import { initialApplications, type VendorApplication } from "@/features/admin/mock";

export default function VendorsPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [rejecting, setRejecting] = useState<VendorApplication | null>(null);

  function removeApplication(id: number) {
    setApplications((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <PageHeader
        eyebrow="TRUST & SAFETY"
        title="Vendor moderation"
        description={`${applications.length} applications need review before they can start selling.`}
      />

      <div className="grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        {applications.map((app) => (
          <article key={app.id} className="flex min-h-[410px] flex-col rounded-hm-md bg-hm-surface p-8">
            <div className="flex items-start justify-between">
              <div className="grid size-13 place-items-center rounded-full bg-hm-text text-[11px] font-[700] text-white">
                {app.store.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-[8px] text-hm-muted">Applied {app.date}</div>
            </div>
            <div className="mt-12 text-[20px] font-[650] tracking-[-0.035em]">{app.store}</div>
            <div className="mt-1 text-[10px] text-hm-muted">{app.owner}</div>
            <div className="mt-5 flex flex-col">
              {[
                ["Category", app.category],
                ["Registration", app.rc],
                ["Location", app.location],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-t border-hm-border py-2 text-[9px]">
                  <span className="text-hm-muted">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Button size="sm" onClick={() => removeApplication(app.id)}>
                Verify
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setRejecting(app)}>
                Reject
              </Button>
              <Button variant="quiet" size="sm" onClick={() => removeApplication(app.id)}>
                Suspend
              </Button>
            </div>
          </article>
        ))}
      </div>

      {!applications.length && (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-[12px] text-hm-muted">
          <Icon name="check" size={30} />
          <div>No applications waiting for review.</div>
        </div>
      )}

      <AnimatePresence>
        {rejecting && (
          <RejectApplicationModal
            store={rejecting.store}
            onClose={() => setRejecting(null)}
            onReject={() => {
              removeApplication(rejecting.id);
              setRejecting(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
