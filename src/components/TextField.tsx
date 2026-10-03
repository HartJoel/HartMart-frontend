import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Shown under the field in place of the hint while the value is invalid. */
  error?: string;
  hint?: string;
};

/** Labelled text input with an inline error. Errors are announced via aria-describedby. */
export default function TextField({ id, label, error, hint, className, ...input }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const message = error ?? hint;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-[13px] font-[600]">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className="h-12 w-full rounded-hm-sm border-0 bg-hm-field px-4 text-[13px] text-hm-text aria-invalid:ring-1 aria-invalid:ring-hm-error"
        {...input}
      />
      {message && (
        <p id={messageId} className={cn("m-0 text-[11px]", error ? "text-hm-error" : "text-hm-muted")}>
          {message}
        </p>
      )}
    </div>
  );
}
