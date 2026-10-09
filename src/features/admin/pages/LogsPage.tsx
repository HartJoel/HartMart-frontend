import { useEffect, useState, type ChangeEvent } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import { useActivityLogs } from "@/features/admin/api";
import { formatDateTime } from "@/lib/format";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { cn } from "@/lib/cn";

const fieldClass = "min-h-[46px] rounded-hm-sm border-0 bg-hm-surface px-3 text-[10px] outline-0";

const PAGE_SIZE = 20;

export default function LogsPage() {
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const debouncedAction = useDebouncedValue(action, 400);
  const debouncedResource = useDebouncedValue(resource, 400);
  useEffect(() => setPage(1), [debouncedAction, debouncedResource, startDate, endDate]);

  const { data, isPending, isError, refetch } = useActivityLogs({
    action: debouncedAction || undefined,
    resource: debouncedResource || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const rows = data?.data ?? [];

  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/admin" }, { label: "Logs" }]} />
      <PageHeader
        eyebrow="AUDIT TRAIL"
        title="System logs"
        description="A dense, chronological record of administrative and platform activity."
      />

      <div className="mb-5 grid grid-cols-[1fr_1fr_160px_160px_auto] gap-3 max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
        <input
          aria-label="Filter by action"
          className={fieldClass}
          type="text"
          placeholder="Filter by action, e.g. LOGIN"
          value={action}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setAction(event.target.value)}
        />
        <input
          aria-label="Filter by resource"
          className={fieldClass}
          type="text"
          placeholder="Filter by resource, e.g. product"
          value={resource}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setResource(event.target.value)}
        />
        <input
          aria-label="From date"
          className={fieldClass}
          type="date"
          value={startDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setStartDate(event.target.value)}
        />
        <input
          aria-label="To date"
          className={fieldClass}
          type="date"
          value={endDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEndDate(event.target.value)}
        />
        <span className="self-center text-[9px] text-hm-muted max-[900px]:col-span-2 max-[900px]:justify-self-end max-[480px]:col-span-1 max-[480px]:justify-self-start">
          {data ? `${data.pagination.total} entr${data.pagination.total === 1 ? "y" : "ies"}` : "—"}
        </span>
      </div>

      {isError ? (
        <div className="grid place-items-center gap-4 rounded-hm-md bg-hm-surface px-6 py-16 text-center">
          <p className="m-0 text-[13px] text-hm-muted">Couldn&apos;t load logs. Please try again.</p>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <DataTable minWidth={900} className="rounded-[10px] [font-variant-numeric:tabular-nums]">
          <thead>
            <tr>
              <th className={cn(tableHeadCell, "py-3")}>Timestamp</th>
              <th className={cn(tableHeadCell, "py-3")}>Action</th>
              <th className={cn(tableHeadCell, "py-3")}>Description</th>
              <th className={cn(tableHeadCell, "py-3")}>Resource</th>
              <th className={cn(tableHeadCell, "py-3")}>IP address</th>
            </tr>
          </thead>
          <tbody>
            {isPending
              ? Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index}>
                    <td className={cn(tableCell, "h-11 py-2")} colSpan={5}>
                      <div className="h-4 animate-pulse rounded-hm-sm bg-hm-field" />
                    </td>
                  </tr>
                ))
              : rows.length === 0
                ? (
                    <tr>
                      <td className={cn(tableCell, "h-11 py-2")} colSpan={5}>
                        No log entries match these filters.
                      </td>
                    </tr>
                  )
                : rows.map((log) => (
                    <tr key={log.id}>
                      <td className={cn(tableCell, "h-11 py-2 text-[9px]")}>{formatDateTime(log.createdAt)}</td>
                      <td className={cn(tableCell, "h-11 py-2 text-[9px]")}>
                        <span className="rounded-[5px] bg-hm-field px-1.5 py-1 font-mono text-[8px] font-[650] text-[#4b4b54]">
                          {log.action}
                        </span>
                      </td>
                      <td className={cn(tableCell, "h-11 py-2 text-[9px] font-[650] text-hm-text")}>
                        {log.description}
                      </td>
                      <td className={cn(tableCell, "h-11 py-2 text-[9px] capitalize")}>{log.resource}</td>
                      <td className={cn(tableCell, "h-11 py-2 text-[9px]")}>{log.ipAddress}</td>
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
    </>
  );
}
