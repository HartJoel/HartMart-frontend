const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNaira(amount: number) {
  return naira.format(amount);
}

const shortDate = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Formats an ISO date string for display, e.g. "12 Sep 2026". */
export function formatDate(iso: string) {
  return shortDate.format(new Date(iso));
}

const relative = new Intl.RelativeTimeFormat("en-NG", { numeric: "auto" });

/** Formats an ISO timestamp relative to now, e.g. "2 hours ago". */
export function formatRelativeTime(iso: string, now = Date.now()) {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
  }

  return "just now";
}

/** Up to two initials from a name, e.g. "Amara Okafor" becomes "AO". */
export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
