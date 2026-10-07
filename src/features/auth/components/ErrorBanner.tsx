import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ErrorBannerProps = {
  children: ReactNode;
  tone?: "error" | "success";
};

export default function ErrorBanner({ children, tone = "error" }: ErrorBannerProps) {
  const success = tone === "success";

  return (
    <div
      role={success ? "status" : "alert"}
      className={cn(
        "flex items-start gap-3 rounded-hm-sm border px-4 py-3",
        success
          ? "border-[rgba(35,131,90,0.14)] bg-[#f3fbf7] text-hm-success"
          : "border-[rgba(200,62,77,0.14)] bg-hm-error-soft text-[#82313b]",
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="size-[18px] shrink-0 fill-none stroke-current [stroke-linecap:round] [stroke-width:1.5]"
      >
        {success ? (
          <path d="M5.5 10.5l3 3 6-6.5" />
        ) : (
          <>
            <circle cx="10" cy="10" r="8.25" />
            <path d="M10 6.5v4.2M10 13.6v.1" />
          </>
        )}
      </svg>
      <p className="text-[12px] leading-[1.5]">{children}</p>
    </div>
  );
}
