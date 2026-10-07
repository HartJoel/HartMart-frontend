import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from "@/types/auth";

/** Auth lives under `/api/v1`, unlike every other module (plain `/v1`) — see API doc §3. */
const AUTH_PREFIX = "/api/v1/auth";

/** Session is an httpOnly cookie the backend sets on the response — nothing to store client-side. */
export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiRequest<LoginResponse>(`${AUTH_PREFIX}/login`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
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
