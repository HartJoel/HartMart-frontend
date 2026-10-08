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

/** Shape returned by the real `GET /vendor/:id`. Distinct from the mock `Vendor` above. */
export type VendorProfile = {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogo: string | null;
  storeBanner: string | null;
  storeCategory: string;
  status: string;
  rejectionReason: string | null;
  verifiedAt: string | null;
  businessRegistration: string | null;
  taxId: string | null;
  businessAddress: string | null;
  businessPhone: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  bankCode: string | null;
  bankVerified: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
