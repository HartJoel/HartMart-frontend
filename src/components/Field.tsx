import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Labelled form control. The label wraps the control, so no id wiring is needed. */
export default function Field({ label, children, className }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-2 text-[13px] font-[600]", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}
