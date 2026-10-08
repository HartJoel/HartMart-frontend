// Placeholder platform data until the admin API is wired.

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
