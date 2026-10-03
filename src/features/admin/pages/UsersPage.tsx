import { useMemo, useState, type ChangeEvent } from "react";
import { AnimatePresence } from "framer-motion";
import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/cn";
import Icon from "@/components/Icon";
import UserDrawer from "@/features/admin/components/UserDrawer";
import { initialsOf, users, type AdminUser } from "@/features/admin/mock";

const selectClass = "min-h-[46px] rounded-hm-sm border-0 bg-hm-surface px-3 text-[10px] outline-0";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All roles");
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        const query = search.toLowerCase();
        return (
          (!query || `${user.name} ${user.email}`.toLowerCase().includes(query)) &&
          (role === "All roles" || user.role === role) &&
          (status === "All statuses" || user.status === status)
        );
      }),
    [search, role, status],
  );

  return (
    <>
      <PageHeader
        eyebrow="ACCESS & IDENTITY"
        title="Users"
        description="Search, review and manage every account on the platform."
      />

      <div className="mb-5 grid grid-cols-[minmax(240px,1fr)_160px_160px_auto] gap-3 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1">
        <div className="flex h-[46px] items-center gap-3 rounded-hm-sm bg-hm-surface px-4 max-[760px]:col-[1/-1]">
          <Icon name="search" size={17} className="text-hm-muted" />
          <input
            aria-label="Search users"
            className="w-full border-0 bg-transparent text-[11px] outline-0"
            type="search"
            placeholder="Search name or email"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          />
        </div>
        <select aria-label="Filter by role" className={selectClass} value={role} onChange={(event) => setRole(event.target.value)}>
          <option>All roles</option>
          <option>Customer</option>
          <option>Vendor</option>
          <option>Admin</option>
        </select>
        <select aria-label="Filter by status" className={selectClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option>All statuses</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
        <span className="self-center text-[9px] text-hm-muted max-[760px]:justify-self-end max-[480px]:justify-self-start">
          {filtered.length} results
        </span>
      </div>

      <DataTable>
        <thead>
          <tr>
            <th className={tableHeadCell}>User</th>
            <th className={tableHeadCell}>Role</th>
            <th className={tableHeadCell}>Status</th>
            <th className={tableHeadCell}>Joined</th>
            <th className={tableHeadCell}>Orders</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr
              key={user.id}
              tabIndex={0}
              onClick={() => setSelected(user)}
              className="cursor-pointer hover:bg-[#fbfbfc] focus-visible:outline-[3px] focus-visible:outline-[rgba(79,70,229,0.24)] focus-visible:outline-offset-[3px]"
            >
              <td className={tableCell}>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-hm-field text-[9px] font-[700] text-hm-text">
                    {initialsOf(user.name)}
                  </span>
                  <div>
                    <div className="font-[650] text-hm-text">{user.name}</div>
                    <div className="mt-[3px] text-[8px]">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className={tableCell}>{user.role}</td>
              <td className={tableCell}>
                <StatusBadge tone={user.status === "Active" ? "success" : "danger"}>{user.status}</StatusBadge>
              </td>
              <td className={tableCell}>{user.joined}</td>
              <td className={cn(tableCell, "font-[650] text-hm-text")}>{user.orders}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      <AnimatePresence>
        {selected && <UserDrawer user={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
