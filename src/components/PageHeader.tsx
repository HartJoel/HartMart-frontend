import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  /** `storefront` = large editorial heading for shopper pages; `workspace` = compact heading for admin/vendor tools. */
  variant?: "storefront" | "workspace";
};

export default function PageHeader({ eyebrow, title, description, action, variant = "workspace" }: PageHeaderProps) {
  if (variant === "storefront") {
    return (
      <div className="pt-[70px] pb-[50px]">
        <span className="text-[10px] font-[750] tracking-[0.14em] text-hm-accent">{eyebrow}</span>
        <h1 className="my-3.5 max-w-[850px] text-[clamp(48px,7vw,80px)] leading-[0.98] tracking-[-0.06em]">{title}</h1>
        <p className="max-w-[620px] leading-[1.6] text-hm-muted">{description}</p>
      </div>
    );
  }

  return (
    <div className="mb-16 flex items-end justify-between gap-8 max-[760px]:flex-col max-[760px]:items-start">
      <div>
        <span className="mb-3 block text-[10px] font-[750] tracking-[0.14em] text-hm-accent">{eyebrow}</span>
        <h1 className="text-[clamp(46px,5vw,68px)] leading-none font-[600] tracking-[-0.06em] max-[480px]:text-[46px]">
          {title}
        </h1>
        <p className="mt-4 max-w-[580px] text-[12px] leading-[1.6] text-hm-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
