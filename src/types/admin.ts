/** `GET /admin/dashboard` — platform-wide KPI summary for the admin command centre. */
export type AdminDashboardStats = {
  totalUsers: number;
  totalVendors: number;
  totalRevenue: number;
  totalOrders: number;
  todaySales: number;
  pendingVerifications: number;
};

/** A row from `GET /admin/logs` — one audit/activity trail entry. */
export type AuditLog = {
  id: string;
  userId: string;
  vendorId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
};
