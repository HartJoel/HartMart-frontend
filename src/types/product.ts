import type { ProductImage } from "@/lib/images";

export type Product = {
  id: number;
  name: string;
  /** Price in naira. Format for display with `formatNaira`. */
  price: number;
  /** Store name, shown on cards. */
  vendor: string;
  /** Links the product to its vendor storefront. */
  vendorId: number;
  image: string;
};

/**
 * Shape returned by the real Products API (`GET/PATCH /products/:id`, `/products/vendor/me`).
 * Distinct from the mock `Product` above, which still backs the unwired catalog pages.
 * `basePrice`/`discountPrice`/`costPrice` come back as decimal strings, not numbers.
 */
export type VendorProduct = {
  id: string;
  vendorId: string;
  categoryId: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  basePrice: string;
  discountPrice: string | null;
  costPrice: string | null;
  currency: string;
  totalStock: number;
  availableStock: number;
  reservedStock: number;
  reorderLevel: number;
  images: ProductImage[];
  weight: string | null;
  dimensions: string | null;
  /** Seen as an object, a JSON-encoded string, and `{}` across existing records — not rendered anywhere yet. */
  attributes: unknown;
  averageRating: number;
  reviewCount: number;
  status: string;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  deletedAt: string | null;
};

/** Body for `POST /products` (multipart, plus an optional `image` file) and `PATCH /products/:id`. */
export type VendorProductInput = {
  name: string;
  description: string;
  categorySlug: string;
  basePrice: number;
  discountPrice?: number;
  totalStock: number;
  reorderLevel: number;
};

/** Body for the dedicated `PATCH /products/:id/stock` endpoint. */
export type ProductStockInput = {
  totalStock: number;
  reservedStock: number;
};

/** The lean projection returned by the public `GET /products` catalog/search endpoint. */
export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  basePrice: string;
  discountPrice: string | null;
  currency: string;
  images: ProductImage[];
  averageRating: number;
  status: string;
  availableStock: number;
  vendorId: string;
  categoryId: string;
};
