import DataTable, { tableCell, tableHeadCell } from "@/components/DataTable";
import PageHeader from "@/components/PageHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cn } from "@/lib/cn";
import { auditLogs } from "@/features/admin/mock";

export default function LogsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Dashboard", to: "/admin" }, { label: "Logs" }]} />
      <PageHeader
        eyebrow="AUDIT TRAIL"
        title="System logs"
        description="A dense, chronological record of administrative and platform activity."
      />

      <DataTable minWidth={900} className="rounded-[10px] [font-variant-numeric:tabular-nums]">
        <thead>
          <tr>
            <th className={cn(tableHeadCell, "py-3")}>Timestamp</th>
            <th className={cn(tableHeadCell, "py-3")}>Actor</th>
            <th className={cn(tableHeadCell, "py-3")}>Action</th>
            <th className={cn(tableHeadCell, "py-3")}>Resource</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log) => (
            <tr key={`${log.timestamp}-${log.action}`}>
              <td className={cn(tableCell, "h-11 py-2 text-[9px]")}>{log.timestamp}</td>
              <td className={cn(tableCell, "h-11 py-2 text-[9px] font-[650] text-hm-text")}>{log.actor}</td>
              <td className={cn(tableCell, "h-11 py-2 text-[9px]")}>
                <span className="rounded-[5px] bg-hm-field px-1.5 py-1 font-mono text-[8px] font-[650] text-[#4b4b54]">
                  {log.action}
                </span>
              </td>
              <td className={cn(tableCell, "h-11 py-2 text-[9px]")}>{log.resource}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </>
  );
}
