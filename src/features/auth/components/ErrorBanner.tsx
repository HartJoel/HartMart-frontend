import type { ReactNode } from "react";

export default function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-hm-sm border border-[rgba(200,62,77,0.14)] bg-hm-error-soft px-4 py-3 text-[#82313b]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-[18px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]"
      >
        <circle cx="10" cy="10" r="8.25" />
        <path d="M10 6.5v4.2M10 13.6v.1" />
      </svg>
      <p className="text-[12px] leading-[1.5]">{children}</p>
    </div>
  );
}
