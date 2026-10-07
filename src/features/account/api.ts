import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { Address, AddressInput } from "@/types/address";

const ADDRESSES_PREFIX = "/api/v1/addresses";
const ADDRESSES_KEY = ["addresses"] as const;

type AddressesParams = { page?: number; limit?: number };

function addressesQuery(params?: AddressesParams) {
  if (!params) return "";
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.limit !== undefined) query.set("limit", String(params.limit));
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function useAddresses(params?: AddressesParams) {
  return useQuery({
    queryKey: [...ADDRESSES_KEY, params ?? {}],
    queryFn: () => apiRequest<Address[]>(`${ADDRESSES_PREFIX}${addressesQuery(params)}`),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressInput) =>
      apiRequest<Address>(ADDRESSES_PREFIX, { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AddressInput }) =>
      apiRequest<Address>(`${ADDRESSES_PREFIX}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiRequest<void>(`${ADDRESSES_PREFIX}/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
}
