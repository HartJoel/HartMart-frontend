import { useEffect } from "react";
import { useMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

/** Hydrates the auth store from `GET /users/me` once on app load. Mount near the app root. */
export function useAuthBootstrap() {
  const { data, isPending, isSuccess, isError } = useMe();
  const setUser = useAuthStore((state) => state.setUser);
  const setStatus = useAuthStore((state) => state.setStatus);
  const clear = useAuthStore((state) => state.clear);

  useEffect(() => {
    if (isPending) setStatus("loading");
  }, [isPending, setStatus]);

  useEffect(() => {
    if (isSuccess && data) setUser(data.user);
  }, [isSuccess, data, setUser]);

  useEffect(() => {
    if (isError) clear();
  }, [isError, clear]);
}
