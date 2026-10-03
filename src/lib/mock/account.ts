import type { Address } from "@/types/address";

// Placeholder account data until GET /users/me and GET /addresses are wired.
export const savedProfile = {
  name: "Amara Okafor",
  /** Read-only here: the email is tied to sign-in. */
  email: "amara.okafor@example.com",
  /** Null until the shopper uploads a photo, in which case initials are shown. */
  avatarUrl: null as string | null,
};

export const savedAddresses: Address[] = [
  {
    id: 1,
    label: "Home",
    fullName: "Amara Okafor",
    phone: "+234 803 456 7890",
    line1: "18 Adebayo Doherty Road",
    city: "Lagos",
    state: "Lagos",
    isDefault: true,
  },
  {
    id: 2,
    label: "Office",
    fullName: "Amara Okafor",
    phone: "+234 809 221 1043",
    line1: "4 Adeola Odeku Street, Victoria Island",
    city: "Lagos",
    state: "Lagos",
    isDefault: false,
  },
  {
    id: 3,
    label: "Family",
    fullName: "Chidi Okafor",
    phone: "+234 812 555 0198",
    line1: "12 Bodija Crescent",
    city: "Ibadan",
    state: "Oyo",
    isDefault: false,
  },
];
