import { createContext, useContext, type ReactNode } from "react";
import { sessionUser, type Session } from "@/lib/mock/session";

const SessionContext = createContext<Session | null>(null);

/** Holds the signed-in account and its roles. Backed by mock data until auth is wired. */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <SessionContext.Provider value={sessionUser}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}
