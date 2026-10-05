import type { Crumb } from "@/components/Breadcrumbs";

/**
 * Router state attached to links into a storefront. `origin` is the trail the shopper came from
 * (for example Products > product name), so the storefront breadcrumb starts from where they were.
 */
export type VendorOriginState = { origin: Crumb[] };
