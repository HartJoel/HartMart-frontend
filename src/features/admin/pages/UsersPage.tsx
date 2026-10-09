import { useEffect, useState, type ChangeEvent } from "react";
import { AnimatePresence } from "framer-motion";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import Icon from "@/components/Icon";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import UserDrawer from "@/features/admin/components/UserDrawer";
import { useUsers } from "@/features/admin/api";
import { getInitials } from "@/lib/format";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { cn } from "@/lib/cn";

const selectClass = "min-h-[46px] rounded-hm-sm border-0 bg-hm-surface px-3 text-[10px] outline-0";

const PAGE_SIZE = 10;

const roleOptions = [
  { label: "All roles", value: undefined },
  { label: "Customer", value: "CUSTOMER" },
  { label: "Vendor", value: "VENDOR" },
  { label: "Admin", value: "ADMIN" },
];

const statusOptions = [
  { label: "All statuses", value: undefined },
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);
  useEffect(() => setPage(1), [debouncedSearch]);

  const { data, isPending, isError, refetch } = useUsers({
    role,
    status,
    search: debouncedSearch || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const rows = data?.data ?? [];

  function updateRole(event: ChangeEvent<HTMLSelectElement>) {
    setRole(event.target.value || undefined);
    setPage(1);
  }

  function updateStatus(event: ChangeEvent<HTMLSelectElement>) {
    setStatus(event.target.value || undefined);
    setPage(1);
  }

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/admin" }, { label: "Users" }]} />
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
            placeholder="Search by name or email"
            value={search}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          />
        </div>
        <select aria-label="Filter by role" className={selectClass} value={role ?? ""} onChange={updateRole}>
          {roleOptions.map((option) => (
            <option key={option.label} value={option.value ?? ""}>
              {option.label}
            </option>
          ))}
        </select>
        <select aria-label="Filter by status" className={selectClass} value={status ?? ""} onChange={updateStatus}>
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value ?? ""}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="self-center text-[9px] text-hm-muted max-[760px]:justify-self-end max-[480px]:justify-self-start">
          {data ? `${data.pagination.total} result${data.pagination.total === 1 ? "" : "s"}` : "—"}
        </span>
      </div>

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load users. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DataTable>
          <thead>
            <tr>
              <th className={tableHeadCell}>User</th>
              <th className={tableHeadCell}>Role</th>
              <th className={tableHeadCell}>Status</th>
            </tr>
          </thead>
          <tbody>
            {isPending
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className={tableCell} colSpan={3}>
                      <div className="h-5 animate-pulse rounded-hm-sm bg-hm-field" />
                    </td>
                  </tr>
                ))
              : rows.length === 0
                ? (
                    <tr>
                      <td className={tableCell} colSpan={3}>
                        No users match these filters.
                      </td>
                    </tr>
                  )
                : rows.map((user) => (
                    <tr
                      key={user.id}
                      tabIndex={0}
                      onClick={() => setSelectedId(user.id)}
                      className="cursor-pointer focus-visible:outline-[3px] focus-visible:outline-[rgba(79,70,229,0.24)] focus-visible:outline-offset-[3px]"
                    >
                      <td className={tableCell}>
                        <div className="flex items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-hm-field text-[9px] font-[700] text-hm-text">
                            {user.avatar ? (
                              <img src={user.avatar.url} alt="" className="size-full object-cover" />
                            ) : (
                              getInitials(user.name)
                            )}
                          </span>
                          <div>
                            <div className="font-[650] text-hm-text">{user.name}</div>
                            <div className="mt-[3px] text-[8px]">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={cn(tableCell, "capitalize")}>{user.role.toLowerCase()}</td>
                      <td className={tableCell}>
                        <StatusBadge tone={user.status === "ACTIVE" ? "success" : "danger"} className="capitalize">
                          {user.status.toLowerCase()}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
          </tbody>
        </DataTable>
      )}

      {data && data.pagination.pages > 1 && (
        <div className="mt-5 flex items-center justify-end gap-3">
          <span className="text-[9px] text-hm-muted">
            Page {data.pagination.page} of {data.pagination.pages}
          </span>
          <Button variant="quiet" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button
            variant="quiet"
            size="sm"
            disabled={page >= data.pagination.pages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <AnimatePresence>
        {selectedId && <UserDrawer userId={selectedId} onClose={() => setSelectedId(null)} />}
      </AnimatePresence>
    </>
  );
}
