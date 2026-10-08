import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { VendorApplicationInput, VendorProfile } from "@/types/vendor";

const VENDOR_PREFIX = "/api/v1/vendor";

/** A single vendor's public profile, e.g. for the "sold by" card on a product. */
export function useVendor(id: string | undefined) {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => apiRequest<VendorProfile>(`${VENDOR_PREFIX}/${id}`),
    enabled: id !== undefined,
  });
}

/** The full public vendor list, for the vendor directory. */
export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: () => apiRequest<VendorProfile[]>(VENDOR_PREFIX),
  });
}

/** Top 10 vendors, for home page discovery. */
export function useTopVendors() {
  return useQuery({
    queryKey: ["vendors", "top"],
    queryFn: () => apiRequest<VendorProfile[]>(`${VENDOR_PREFIX}/top`),
  });
}

/**
 * Submits a customer's vendor application. The account's role only changes on the next sign-in
 * (the API message says as much), so the caller is responsible for prompting a re-login.
 */
export function useApplyVendor() {
  return useMutation({
    mutationFn: (input: VendorApplicationInput) =>
      apiRequest<VendorProfile>(`${VENDOR_PREFIX}/apply`, { method: "POST", body: JSON.stringify(input) }),
  });
}
