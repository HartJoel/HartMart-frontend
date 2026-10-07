export type AuthScreen = "login" | "register" | "forgot";

export type AuthNoticeTone = "success" | "info";

/** Switches screens within the auth card, optionally carrying a one-line notice to show next. */
export type AuthNavigate = (screen: AuthScreen, notice?: string, tone?: AuthNoticeTone) => void;
