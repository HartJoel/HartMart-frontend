import Button from "@/components/Button";
import Modal from "@/components/Modal";

type ConfirmLogoutModalProps = {
  onConfirm: () => void;
  onClose: () => void;
  isPending?: boolean;
};

/** Confirms the user wants to end their session before signing them out. */
export default function ConfirmLogoutModal({ onConfirm, onClose, isPending }: ConfirmLogoutModalProps) {
  return (
    <Modal title="Sign out of HartMart?" eyebrow="LOGOUT" onClose={onClose} className="max-w-[440px]">
      <p className="m-0 text-[13px] leading-[1.7] text-hm-muted">
        You&rsquo;ll need to sign in again to view your orders, saved items and account details.
      </p>
      <div className="mt-8 flex justify-end gap-3 max-[480px]:flex-col-reverse">
        <Button variant="quiet" size="sm" onClick={onClose} disabled={isPending} className="max-[480px]:w-full">
          Cancel
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={onConfirm}
          className="text-hm-error hover:bg-hm-error-soft max-[480px]:w-full"
        >
          {isPending ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </Modal>
  );
}
