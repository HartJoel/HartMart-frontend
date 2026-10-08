import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useRejectVendor } from "@/features/admin/api";
import ErrorBanner from "@/features/auth/components/ErrorBanner";
import { ApiError } from "@/lib/api/client";
import type { VendorProfile } from "@/types/vendor";

type RejectApplicationModalProps = {
  vendor: VendorProfile;
  onClose: () => void;
};

/** Confirms a vendor rejection with a reason, which the applicant sees on their application. */
export default function RejectApplicationModal({ vendor, onClose }: RejectApplicationModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const rejectVendor = useRejectVendor();

  async function handleReject() {
    if (!reason.trim()) {
      setError("Explain what needs to be corrected before they reapply.");
      return;
    }
    setError("");
    try {
      await rejectVendor.mutateAsync({ id: vendor.id, reason: reason.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't reject this application. Please try again.");
    }
  }

  return (
    <Modal title={vendor.storeName} eyebrow="REJECT APPLICATION" onClose={onClose}>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      <label htmlFor="reject-reason" className="mt-4 block text-[10px] font-[650]">
        Reason for rejection
      </label>
      <textarea
        id="reject-reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Explain what needs to be corrected before they reapply"
        className="mt-2 min-h-[130px] w-full resize-y rounded-hm-sm border-0 bg-hm-field p-4 text-[11px] leading-[1.6] outline-0"
      />
      <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button
          variant="quiet"
          size="sm"
          className="max-[480px]:w-full"
          onClick={onClose}
          disabled={rejectVendor.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="max-[480px]:w-full"
          onClick={handleReject}
          disabled={rejectVendor.isPending}
        >
          {rejectVendor.isPending ? "Rejecting…" : "Reject application"}
        </Button>
      </div>
    </Modal>
  );
}
