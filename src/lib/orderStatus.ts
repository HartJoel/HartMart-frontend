import type { StatusTone } from "@/components/StatusBadge";

const toneByStatus: Record<string, StatusTone> = {
  delivered: "success",
  shipped: "info",
  processing: "accent",
  pending: "warning",
};

/** Maps an order status from the API to its badge colour. */
export function orderStatusTone(status: string): StatusTone {
  return toneByStatus[status.toLowerCase()] ?? "neutral";
}
