// Placeholder platform data until the admin API is wired.

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "Customer" | "Vendor" | "Admin";
  status: "Active" | "Suspended";
  joined: string;
  orders: number;
  spent: string;
};

export const users: AdminUser[] = [
  { id: 1, name: "Amara Okafor", email: "amara@example.com", role: "Customer", status: "Active", joined: "18 Jun 2025", orders: 12, spent: "₦284,500" },
  { id: 2, name: "Ayo Balogun", email: "ayo@ajotech.ng", role: "Vendor", status: "Active", joined: "06 Jun 2025", orders: 0, spent: "₦0" },
  { id: 3, name: "Tolu Adeyemi", email: "tolu@example.com", role: "Customer", status: "Active", joined: "28 May 2025", orders: 8, spent: "₦162,800" },
  { id: 4, name: "Nneka Okoro", email: "nneka@example.com", role: "Customer", status: "Suspended", joined: "14 May 2025", orders: 3, spent: "₦48,200" },
  { id: 5, name: "Kemi Adebayo", email: "kemi@hartmart.ng", role: "Admin", status: "Active", joined: "02 Apr 2025", orders: 0, spent: "₦0" },
  { id: 6, name: "Chidi Eze", email: "chidi@example.com", role: "Customer", status: "Active", joined: "22 Mar 2025", orders: 19, spent: "₦510,400" },
];

export type VendorApplication = {
  id: number;
  store: string;
  owner: string;
  date: string;
  category: string;
  rc: string;
  location: string;
};

export const initialApplications: VendorApplication[] = [
  { id: 1, store: "Ìbàdàn Loom", owner: "Funmi Akinola", date: "19 Jun 2025", category: "Home & Living", rc: "RC 8291042", location: "Ibadan, Oyo" },
  { id: 2, store: "Mainland Kicks", owner: "Femi Lawal", date: "18 Jun 2025", category: "Fashion & Apparel", rc: "RC 7128920", location: "Yaba, Lagos" },
  { id: 3, store: "Scent House Lagos", owner: "Dara Phillips", date: "17 Jun 2025", category: "Beauty", rc: "RC 9401288", location: "Ikoyi, Lagos" },
];

/** A top-level category has no parent. Subcategories point at one top-level category. */
export type Category = { id: number; name: string; parentId: number | null; products: number };

export const initialCategories: Category[] = [
  { id: 1, name: "Electronics", parentId: null, products: 2840 },
  { id: 2, name: "Audio", parentId: 1, products: 640 },
  { id: 3, name: "Computers", parentId: 1, products: 812 },
  { id: 4, name: "Fashion & Apparel", parentId: null, products: 4128 },
  { id: 5, name: "Women’s Fashion", parentId: 4, products: 1840 },
  { id: 6, name: "Men’s Fashion", parentId: 4, products: 1612 },
  { id: 7, name: "Home & Living", parentId: null, products: 1950 },
  { id: 8, name: "Kitchenware", parentId: 7, products: 720 },
  { id: 9, name: "Beauty", parentId: null, products: 1104 },
];

export const auditLogs = [
  { timestamp: "20 Jun 2025 · 14:32:08", actor: "kemi@hartmart.ng", action: "VENDOR_VERIFIED", resource: "Vendor · AjoTech Gadgets" },
  { timestamp: "20 Jun 2025 · 14:18:42", actor: "system", action: "PAYMENT_CONFIRMED", resource: "Order · HM-2148" },
  { timestamp: "20 Jun 2025 · 13:54:11", actor: "admin@hartmart.ng", action: "USER_UPDATED", resource: "User · Amara Okafor" },
  { timestamp: "20 Jun 2025 · 13:21:06", actor: "ayo@ajotech.ng", action: "PRODUCT_UPDATED", resource: "Product · Wireless Earbuds Pro" },
  { timestamp: "20 Jun 2025 · 12:48:33", actor: "system", action: "ORDER_CREATED", resource: "Order · HM-2147" },
  { timestamp: "20 Jun 2025 · 11:16:27", actor: "kemi@hartmart.ng", action: "CATEGORY_CREATED", resource: "Category · Smart Home" },
  { timestamp: "20 Jun 2025 · 10:42:19", actor: "system", action: "PAYOUT_QUEUED", resource: "Payout · PO-8821" },
  { timestamp: "20 Jun 2025 · 09:38:04", actor: "support@hartmart.ng", action: "USER_SUSPENDED", resource: "User · Nneka Okoro" },
  { timestamp: "20 Jun 2025 · 09:02:51", actor: "ayo@ajotech.ng", action: "STOCK_UPDATED", resource: "Product · Pods Mini" },
  { timestamp: "20 Jun 2025 · 08:44:16", actor: "system", action: "REPORT_GENERATED", resource: "Report · Daily Revenue" },
];

export const revenueBars = [42, 58, 48, 72, 64, 80, 68, 91, 76, 100, 84, 94];

/** Initials for an avatar, e.g. "Amara Okafor" -> "AO". */
export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}
