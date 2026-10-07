export type AuthScreen = "login" | "register" | "forgot";

/** Switches screens within the auth card, optionally carrying a one-line notice to show next. */
export type AuthNavigate = (screen: AuthScreen, notice?: string) => void;
