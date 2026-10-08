import { useState } from "react";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useSuspendVendor, useVerifyVendor } from "@/features/admin/api";
import ErrorBanner from "@/features/auth/components/ErrorBanner";
import { ApiError } from "@/lib/api/client";
import type { VendorProfile } from "@/types/vendor";

type Action = "verify" | "suspend";

type ConfirmVendorActionModalProps = {
  vendor: VendorProfile;
  action: Action;
  onClose: () => void;
};

const copy: Record<
  Action,
  { eyebrow: string; title: string; description: string; confirmLabel: string; pendingLabel: string }
> = {
  verify: {
    eyebrow: "VERIFY VENDOR",
    title: "Verify this store?",
    description: "will be marked verified and can start selling publicly.",
    confirmLabel: "Verify vendor",
    pendingLabel: "Verifying…",
  },
  suspend: {
    eyebrow: "SUSPEND VENDOR",
    title: "Suspend this store?",
    description: "'s storefront and listings will be hidden until reinstated.",
    confirmLabel: "Suspend vendor",
    pendingLabel: "Suspending…",
  },
};

/** Shared confirmation for the two one-click moderation actions — verify and suspend. */
export default function ConfirmVendorActionModal({ vendor, action, onClose }: ConfirmVendorActionModalProps) {
  const [error, setError] = useState("");
  const verifyVendor = useVerifyVendor();
  const suspendVendor = useSuspendVendor();
  const mutation = action === "verify" ? verifyVendor : suspendVendor;
  const text = copy[action];

  async function handleConfirm() {
    setError("");
    try {
      await mutation.mutateAsync(vendor.id);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "That didn't go through. Please try again.");
    }
  }

  return (
    <Modal title={text.title} eyebrow={text.eyebrow} onClose={onClose}>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      <p className="m-0 mt-4 text-[13px] leading-[1.6] text-hm-muted">
        <b className="text-hm-text">{vendor.storeName}</b> {text.description}
      </p>
      <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button
          variant="quiet"
          size="sm"
          className="max-[480px]:w-full"
          onClick={onClose}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button size="sm" className="max-[480px]:w-full" onClick={handleConfirm} disabled={mutation.isPending}>
          {mutation.isPending ? text.pendingLabel : text.confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
