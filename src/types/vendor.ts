/** Shape returned by `GET /vendor/:id`, `GET /vendor`, `GET /vendor/top`, `GET /vendor/me` and `POST /vendor/apply`. */
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

/** Body for `POST /vendor/apply`. */
export type VendorApplicationInput = {
  storeName: string;
  storeDescription: string;
  storeCategory: string;
  businessRegistration: string;
  taxId: string;
  businessAddress: string;
  businessPhone: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankCode: string;
};

/** Body for `PATCH /vendor/me`. `storeLogo`/`storeBanner` are uploaded as files, not URLs. */
export type VendorProfileInput = {
  storeDescription: string;
  storeLogo?: File;
  storeBanner?: File;
};

/** Shape returned by the admin-only `GET /vendor/:id/metrics` — a leaner projection of `VendorProfile`. */
export type VendorMetrics = {
  averageRating: number;
  totalReviews: number;
  status: string;
  verifiedAt: string | null;
  createdAt: string;
};

/** Shape returned by `GET /vendor/me/analytics`, for the vendor dashboard home. */
export type VendorAnalytics = {
  vendorId: string;
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  /** Percentage points (0–100), assumed — only seen as 0 so far, so the scale isn't confirmed. */
  fulfillmentRate: number;
  cancellationRate: number;
  returnRate: number;
  /** Seen only as `[]` so far — item shape unconfirmed. Not rendered yet. */
  monthlyData: unknown[];
};
