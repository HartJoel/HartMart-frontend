import Icon from "@/components/Icon";
import { cn } from "@/lib/cn";

type RatingProps = {
  /** Out of 5. Rounded to the nearest whole star for display. */
  value: number;
  /** Star width and height in px. */
  size?: number;
  className?: string;
};

export default function Rating({ value, size = 16, className }: RatingProps) {
  const filled = Math.round(value);

  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className={cn("inline-flex gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, index) => (
        <Icon
          key={index}
          name="star"
          size={size}
          className={index < filled ? "fill-current" : "text-hm-border"}
        />
      ))}
    </span>
  );
}
