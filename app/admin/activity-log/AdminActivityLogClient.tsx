"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { ActivityLogEntry } from "./page";

type AdminActivityLogClientProps = {
  initialLogs: ActivityLogEntry[];
};

const entityOptions = ["all", "payment", "sanctions", "role", "document", "api", "order", "supplier"];
const severityOptions = ["all", "info", "warning", "critical"];

export default function AdminActivityLogClient({ initialLogs }: AdminActivityLogClientProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [selectedLog, setSelectedLog] = useState<ActivityLogEntry | null>(null);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchable = `${log.id} ${log.actor} ${log.action} ${log.entity_type} ${log.entity_id}`.toLowerCase();
      const matchesQuery = !query || searchable.includes(query.toLowerCase());
      const matchesEntity = entity === "all" || log.entity_type === entity;
      const matchesSeverity = severity === "all" || log.severity === severity;
      return matchesQuery && matchesEntity && matchesSeverity;
    });
  }, [entity, logs, query, severity]);

  const criticalCount = logs.filter((log) => log.severity === "critical").length;
  const warningCount = logs.filter((log) => log.severity === "warning").length;
  const systemCount = logs.filter((log) => log.role === "system").length;

  function markReviewed(logId: string) {
    setReviewedIds((ids) => ids.includes(logId) ? ids : [...ids, logId]);
    toast.success("Activity log marked reviewed");
  }

  function exportLogs() {
    toast.success(`${filteredLogs.length} activity logs prepared for export`);
  }

  function resetFilters() {
    setQuery("");
    setEntity("all");
    setSeverity("all");
    setLogs(initialLogs);
    toast.success("Activity filters reset");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Admin Audit Trail</span>
          <h1 className="mt-4 text-4xl">Activity Log</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">
            Immutable admin audit trail for payments, sanctions checks, role changes, document vault actions, order events, and API activity.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5 text-center">
          <div>
            <p className="metric-numeral text-3xl">{criticalCount}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[#5a5a54]">Critical</p>
          </div>
          <div>
            <p className="metric-numeral text-3xl">{warningCount}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[#5a5a54]">Warnings</p>
          </div>
          <div>
            <p className="metric-numeral text-3xl">{systemCount}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[#5a5a54]">System</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-[1fr_220px_220px_auto_auto]">
        <input
          className="input-editorial"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search actor, action, entity, or log id"
        />
        <select className="input-editorial" value={entity} onChange={(event) => setEntity(event.target.value)}>
          {entityOptions.map((option) => <option key={option} value={option}>{option === "all" ? "All entities" : option}</option>)}
        </select>
        <select className="input-editorial" value={severity} onChange={(event) => setSeverity(event.target.value)}>
          {severityOptions.map((option) => <option key={option} value={option}>{option === "all" ? "All severities" : option}</option>)}
        </select>
        <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={exportLogs}>Export</button>
        <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={resetFilters}>Reset</button>
      </div>

      <div className="mt-8 overflow-x-auto border border-[#e2ddd8]">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-[#f7f3ee] text-left">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Severity</th>
              <th className="p-4">IP</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr className="border-t border-[#e2ddd8] align-top" key={log.id}>
                <td className="p-4">
                  <p className="font-semibold">{new Date(log.created_at).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-[#6b6b68]">{log.id}</p>
                </td>
                <td className="p-4">
                  <p className="font-semibold">{log.actor}</p>
                  <span className="badge-patch mt-2">{log.role}</span>
                </td>
                <td className="max-w-md p-4">{log.action}</td>
                <td className="p-4">
                  <p className="font-semibold">{log.entity_type}</p>
                  <p className="mt-1 text-xs text-[#6b6b68]">{log.entity_id}</p>
                </td>
                <td className="p-4">
                  <span className={log.severity === "critical" ? "badge-patch text-[#c0623a]" : "badge-patch"}>{log.severity}</span>
                  {reviewedIds.includes(log.id) && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">Reviewed</p>}
                </td>
                <td className="p-4 font-mono text-xs">{log.ip_address}</td>
                <td className="p-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setSelectedLog(log)}>Details</button>
                    <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => markReviewed(log.id)} disabled={reviewedIds.includes(log.id)}>
                      {reviewedIds.includes(log.id) ? "Reviewed" : "Mark Reviewed"}
                    </button>
                    <Link className="btn-pill btn-pill-forest min-h-[44px]" href={log.href}>Open Entity</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="mt-6 border border-dashed border-[#c8c3bc] p-6 text-sm text-[#5a5a54]">No activity logs match this filter.</div>
      )}

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-2xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="badge-patch">Audit Event</span>
                <h2 className="mt-4 text-3xl">{selectedLog.action}</h2>
                <p className="mt-2 text-sm text-[#5a5a54]">{selectedLog.id} · {new Date(selectedLog.created_at).toLocaleString()}</p>
              </div>
              <span className={selectedLog.severity === "critical" ? "badge-patch text-[#c0623a]" : "badge-patch"}>{selectedLog.severity}</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="border border-[#e2ddd8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Actor</p>
                <p className="mt-2 font-semibold">{selectedLog.actor}</p>
                <p className="mt-1 text-sm text-[#5a5a54]">{selectedLog.role} · {selectedLog.ip_address}</p>
              </div>
              <div className="border border-[#e2ddd8] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Entity</p>
                <p className="mt-2 font-semibold">{selectedLog.entity_type}</p>
                <p className="mt-1 text-sm text-[#5a5a54]">{selectedLog.entity_id}</p>
              </div>
            </div>
            <div className="mt-5 border border-[#e2ddd8] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Metadata</p>
              <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                {Object.entries(selectedLog.metadata).map(([key, value]) => (
                  <div className="flex justify-between gap-4 border-b border-[#e2ddd8] py-2" key={key}>
                    <span className="text-[#6b6b68]">{key}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setSelectedLog(null)}>Close</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => { markReviewed(selectedLog.id); setSelectedLog(null); }}>Mark Reviewed</button>
              <Link className="btn-pill btn-pill-forest min-h-[44px]" href={selectedLog.href}>Open Entity</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
