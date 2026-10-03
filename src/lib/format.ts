const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number) {
  return naira.format(amount);
}

const reviewDate = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Formats an ISO date string for review timestamps, e.g. "12 Sep 2026". */
export function formatReviewDate(iso: string) {
  return reviewDate.format(new Date(iso));
}
