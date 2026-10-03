import { useId, useRef, type ReactNode } from "react";
import Icon from "@/components/Icon";
import { useDialog } from "@/lib/useDialog";
import { cn } from "@/lib/cn";

type ModalProps = {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

/** Centred dialog for short, focused tasks such as a form or a confirmation. */
export default function Modal({ title, eyebrow, onClose, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(dialogRef, onClose);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(20,20,22,0.35)] p-6 backdrop-blur-[5px]"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          "max-h-full w-[min(100%,540px)] overflow-y-auto rounded-hm-md bg-hm-surface p-10 outline-0 max-[480px]:p-6",
          className,
        )}
      >
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            {eyebrow && (
              <span className="mb-3 block text-[10px] font-[750] tracking-[0.14em] text-hm-muted">{eyebrow}</span>
            )}
            <h2 id={titleId} className="m-0 text-[26px] font-[650] tracking-[-0.04em]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-hm-field"
          >
            <Icon name="close" size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
