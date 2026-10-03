export type Vendor = {
  id: number;
  /** Store name, shown as the storefront title. */
  name: string;
  /** One-line summary shown on cards and banners. */
  tagline: string;
  /** Full store description shown on the storefront. */
  description: string;
  /** Short mark shown in place of a store logo until vendors upload one. */
  initials: string;
  category: string;
  location: string;
  verified: boolean;
  /** Average rating out of 5. */
  rating: number;
  reviewCount: number;
  /** ISO date the store joined. */
  joined: string;
};
