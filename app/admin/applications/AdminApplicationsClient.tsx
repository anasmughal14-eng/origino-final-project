"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Application } from "@/types/database";

function formatDate(value: string | null) {
  if (!value) return "Not reviewed";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function statusClass(status: Application["status"]) {
  if (status === "approved") return "stamp-approve";
  if (status === "rejected") return "stamp-reject";
  return "stamp-pending";
}

function applicationCategory(application: Application) {
  if (application.product_category) return application.product_category;
  const raw = application as unknown as { category?: string; form_data?: unknown };
  if (raw.category) return raw.category;
  if (raw.form_data && typeof raw.form_data === "object" && "product_category" in raw.form_data) {
    const value = (raw.form_data as { product_category?: unknown }).product_category;
    if (typeof value === "string" && value.trim()) return value;
  }
  return "Not supplied";
}

function sanctionsLabel(application: Application) {
  if (application.sanctions_check_passed) return "Cleared";
  const raw = application as unknown as { form_data?: unknown };
  if (raw.form_data && typeof raw.form_data === "object" && "sanctions_check_passed" in raw.form_data) {
    return (raw.form_data as { sanctions_check_passed?: boolean }).sanctions_check_passed ? "Cleared" : "Review required";
  }
  return "Schema pending";
}

export default function AdminApplicationsClient({ applications }: { applications: Application[] }) {
  const [items, setItems] = useState(applications);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [rejectingId, setRejectingId] = useState("");
  const [reason, setReason] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const [stampId, setStampId] = useState("");
  const filtered = useMemo(() => items.filter((item) => {
    const search = `${item.company_name} ${item.city ?? ""} ${applicationCategory(item)}`.toLowerCase();
    return (!query || search.includes(query.toLowerCase())) && (status === "all" || item.status === status);
  }), [items, query, status]);

  async function approve(id: string) {
    setLoadingId(`approve-${id}`);
    try {
      const response = await fetch(`/api/admin/applications/${id}/approve`, { method: "POST" });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Approval failed");
      setItems((list) => list.map((item) => item.id === id ? { ...item, status: "approved", reviewed_at: new Date().toISOString() } : item));
      setStampId(id);
      toast.success("Application approved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Approval failed");
    } finally {
      setLoadingId("");
    }
  }

  async function reject(id: string) {
    if (!reason.trim()) return toast.error("Rejection reason is required");
    setLoadingId(`reject-${id}`);
    try {
      const response = await fetch(`/api/admin/applications/${id}/reject`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Rejection failed");
      setItems((list) => list.map((item) => item.id === id ? { ...item, status: "rejected", reviewer_notes: reason, reviewed_at: new Date().toISOString() } : item));
      setRejectingId("");
      setReason("");
      setStampId(id);
      toast.success("Application rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rejection failed");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Admin Review Queue</span>
          <h1 className="mt-4 text-4xl">Applications</h1>
          <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">Search, review, approve, or reject seller audit applications. Actions call the same API routes that will later write to Supabase.</p>
        </div>
        <div className="metric-numeral text-3xl">{filtered.length}</div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company, city, or category" />
        <select className="input-editorial" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewing">Reviewing</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="mt-8 overflow-x-auto border">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead className="border-b bg-[var(--cream)] text-left">
            <tr>
              <th className="p-4">Company</th>
              <th className="p-4">Cluster</th>
              <th className="p-4">Category</th>
              <th className="p-4">Score</th>
              <th className="p-4">Sanctions</th>
              <th className="p-4">Submitted</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => {
              const isApproved = app.status === "approved";
              const isRejected = app.status === "rejected";
              return (
                <tr className="border-b align-top" key={app.id}>
                  <td className="p-4">
                    <p className="font-semibold">{app.company_name}</p>
                    <span className={`badge-patch mt-2 ${statusClass(app.status)} ${stampId === app.id ? "animate-pulse" : ""}`}>{app.status}</span>
                    {stampId === app.id && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Decision saved</p>}
                  </td>
                  <td className="p-4">{app.city ?? "Not supplied"}</td>
                  <td className="p-4">{applicationCategory(app)}</td>
                  <td className="p-4 metric-numeral">{app.audit_score ?? "N/A"}</td>
                  <td className="p-4">{sanctionsLabel(app)}</td>
                  <td className="p-4">{formatDate(app.submitted_at)}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link className="btn-pill btn-pill-outline min-h-[44px] px-5" href={`/admin/applications/${app.id}`}>View</Link>
                      <button className="btn-pill btn-pill-forest min-h-[44px] px-5 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => approve(app.id)} disabled={isApproved || loadingId === `approve-${app.id}`}>
                        {isApproved ? "Approved" : loadingId === `approve-${app.id}` ? "Approving..." : "Approve"}
                      </button>
                      <button className="btn-pill btn-pill-outline min-h-[44px] px-5 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setRejectingId(app.id); setReason(""); }} disabled={isRejected || loadingId === `reject-${app.id}`}>
                        {isRejected ? "Rejected" : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <div className="mt-6 border p-6 text-center">No applications match this search.</div>}

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-xl">
            <span className="badge-patch stamp-reject">Rejection Reason Required</span>
            <h2 className="mt-4 text-3xl">Reject Application</h2>
            <p className="mt-2 text-[var(--ink-soft)]">The original prompt requires an admin reason before rejection so the applicant receives useful feedback.</p>
            <textarea className="input-editorial mt-4 min-h-[130px]" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain exactly what must improve before approval" />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setRejectingId("")}>Cancel</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => reject(rejectingId)} disabled={loadingId === `reject-${rejectingId}`}>{loadingId === `reject-${rejectingId}` ? "Rejecting..." : "Submit Rejection"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
