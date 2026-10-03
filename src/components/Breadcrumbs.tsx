import { Link } from "react-router";
import { cn } from "@/lib/cn";

export type Crumb = {
  label: string;
  /** Omit on the last item: it is the current page and is not a link. */
  to?: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
  className?: string;
};

/** Trail from the top-level section down to the current page. */
export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
      <ol className="m-0 flex flex-wrap items-center gap-2 p-0 text-[11px] text-hm-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${index}-${item.label}`} className="flex items-center gap-2">
              {isCurrent || !item.to ? (
                <span aria-current={isCurrent ? "page" : undefined} className={cn(isCurrent && "font-[650] text-hm-text")}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="text-hm-muted no-underline hover:text-hm-text hover:underline">
                  {item.label}
                </Link>
              )}
              {!isCurrent && (
                <span aria-hidden="true" className="text-hm-border">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
