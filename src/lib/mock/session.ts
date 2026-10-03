export type Role = "CUSTOMER" | "VENDOR" | "ADMIN";

export type Session = {
  name: string;
  email: string;
  /** Roles this account can switch between. The customer role is always held. */
  roles: Role[];
  /** Store the account sells under, when it holds the vendor role. */
  storeName: string;
};

// Placeholder session until GET /users/me and the auth flow are wired.
export const sessionUser: Session = {
  name: "Amara Okafor",
  email: "amara.okafor@example.com",
  roles: ["CUSTOMER", "VENDOR", "ADMIN"],
  storeName: "AjoTech Gadgets",
};
