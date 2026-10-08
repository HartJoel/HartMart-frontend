import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { VendorProfile } from "@/types/vendor";

const VENDOR_PREFIX = "/api/v1/vendor";

/** A single vendor's public profile, e.g. for the "sold by" card on a product. */
export function useVendor(id: string | undefined) {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => apiRequest<VendorProfile>(`${VENDOR_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}
