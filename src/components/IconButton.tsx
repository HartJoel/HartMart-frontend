import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Neutral tones are for dismiss and quantity controls; danger is reserved for destructive removal.
type Tone = "field" | "raised" | "danger";

const tones: Record<Tone, string> = {
  field: "bg-hm-field text-hm-text not-disabled:hover:bg-hm-border",
  raised: "bg-hm-surface text-hm-text not-disabled:hover:bg-hm-border",
  danger: "bg-transparent text-hm-muted not-disabled:hover:bg-hm-error-soft not-disabled:hover:text-hm-error",
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Required because an icon-only control has no visible text for assistive tech. */
  label: string;
  tone?: Tone;
};

/** Round icon-only control with a visible surface, hover tint and press feedback. */
export default function IconButton({ label, tone = "field", className, type = "button", children, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-0 transition-[background-color,color,transform] duration-200 not-disabled:active:scale-90 disabled:cursor-not-allowed disabled:opacity-50",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
