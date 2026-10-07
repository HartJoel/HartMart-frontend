// Placeholder account data until GET /users/me is wired.
export const savedProfile = {
  name: "Amara Okafor",
  /** Read-only here: the email is tied to sign-in. */
  email: "amara.okafor@example.com",
  /** Null until the shopper uploads a photo, in which case initials are shown. */
  avatarUrl: null as string | null,
};
