import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { useAuthStore } from "@/features/auth/store";
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";

/** Auth lives under `/api/v1`, unlike every other module (plain `/v1`) — see API doc §3. */
const AUTH_PREFIX = "/api/v1/auth";
const USERS_PREFIX = "/api/v1/users";

/** Session is an httpOnly cookie the backend sets on the response — nothing to store client-side. */
export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiRequest<LoginResponse>(`${AUTH_PREFIX}/login`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: ({ user }) => setUser(user),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      apiRequest<RegisterResponse>(`${AUTH_PREFIX}/register`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}

/** The signed-in user's profile. Queried once on app load to hydrate the auth store. */
export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiRequest<MeResponse>(`${USERS_PREFIX}/me`),
    retry: false,
  });
}

/** Clears the session cookies server-side, then clears the store and drops the cached profile. */
export function useLogout() {
  const clear = useAuthStore((state) => state.clear);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiRequest<void>(`${AUTH_PREFIX}/logout`, { method: "POST" }),
    onSuccess: () => {
      clear();
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
}
