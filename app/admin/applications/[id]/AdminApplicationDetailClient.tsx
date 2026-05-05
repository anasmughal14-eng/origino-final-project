"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Application } from "@/types/database";

const readinessRows = [
  ["Logo", "has_logo"],
  ["Website", "has_website"],
  ["Social presence", "has_social"],
  ["Product photography", "has_photography"],
  ["Export packaging", "has_packaging"],
  ["Export history", "has_exported"],
] as const;

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function statusClass(status: Application["status"]) {
  if (status === "approved") return "stamp-approve";
  if (status === "rejected") return "stamp-reject";
  return "stamp-pending";
}

export default function AdminApplicationDetailClient({ application }: { application: Application }) {
  const [status, setStatus] = useState<Application["status"]>(application.status);
  const [loading, setLoading] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [stamp, setStamp] = useState("");

  async function approve() {
    setLoading("approve");
    try {
      const response = await fetch(`/api/admin/applications/${application.id}/approve`, { method: "POST" });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Approval failed");
      setStatus("approved");
      setStamp("APPROVED");
      toast.success("Application approved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Approval failed");
    } finally {
      setLoading("");
    }
  }

  async function reject() {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    setLoading("reject");
    try {
      const response = await fetch(`/api/admin/applications/${application.id}/reject`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Rejection failed");
      setStatus("rejected");
      setStamp("REJECTED");
      setRejecting(false);
      toast.success("Application rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rejection failed");
    } finally {
      setLoading("");
    }
  }

  return (
    <div>
      <Link className="btn-pill btn-pill-outline min-h-[44px] px-5" href="/admin/applications">Back to Applications</Link>

      <section className="mt-8 border-b pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className={`badge-patch ${statusClass(status)}`}>{status}</span>
            <h1 className="mt-4 text-4xl">{application.company_name}</h1>
            <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">{application.product_description}</p>
          </div>
          <div className="text-right">
            <p className="metric-numeral text-5xl">{application.audit_score ?? "N/A"}</p>
            <p className="small-caps text-sm">AI audit score</p>
            {stamp && <div className={`badge-patch mt-4 rotate-[-3deg] text-lg ${stamp === "APPROVED" ? "stamp-approve" : "stamp-reject"}`}>{stamp}</div>}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border p-5">
          <h2 className="text-2xl">Submitted Data</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div><dt className="small-caps text-[var(--ink-muted)]">Contact</dt><dd>{application.full_name} · {application.email} · {application.phone}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Location</dt><dd>{application.city}, {application.province}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Category</dt><dd>{application.product_category}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Years in business</dt><dd>{application.years_in_business ?? "Not supplied"}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Target markets</dt><dd>{application.target_markets}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Production capacity</dt><dd>{application.production_capacity}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">HS code</dt><dd className="metric-numeral">{application.hs_code}</dd></div>
          </dl>
        </div>

        <div className="border p-5">
          <h2 className="text-2xl">Compliance Review</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div><dt className="small-caps text-[var(--ink-muted)]">Sanctions screening</dt><dd>{application.sanctions_check_passed ? "OFAC / UN / EU / HMT cleared" : "Review required"}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Checked at</dt><dd>{formatDate(application.sanctions_checked_at)}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Certifications</dt><dd>{application.certifications}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Export countries</dt><dd>{application.export_countries || "No confirmed exports yet"}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Marketing package</dt><dd>{application.marketing_package_purchased ?? "None"}</dd></div>
            <div><dt className="small-caps text-[var(--ink-muted)]">Submitted</dt><dd>{formatDate(application.submitted_at)}</dd></div>
          </dl>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-3xl">Audit Score Breakdown</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {Object.entries(application.audit_breakdown ?? {}).map(([key, value]) => (
            <div className="border p-4" key={key}>
              <p className="small-caps text-[var(--ink-muted)]">{key}</p>
              <p className="metric-numeral mt-2 text-3xl">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border p-5">
          <h3 className="text-2xl">AI Feedback</h3>
          <p className="mt-2 text-[var(--ink-soft)]">{application.audit_ai_feedback}</p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border p-5">
          <h2 className="text-3xl">Readiness Checklist</h2>
          <div className="mt-4 grid gap-2">
            {readinessRows.map(([label, key]) => (
              <div className="flex items-center justify-between border p-3" key={key}>
                <span>{label}</span>
                <span className={`badge-patch ${application[key] ? "stamp-approve" : "stamp-pending"}`}>{application[key] ? "Yes" : "Missing"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border p-5">
          <h2 className="text-3xl">Document List</h2>
          <div className="mt-4 grid gap-2">
            {["NTN Certificate", "Company Registration", "ISO / CE Certificate", "Certificate of Origin", "GSP+ Evidence"].map((doc, index) => (
              <div className="flex items-center justify-between border p-3" key={doc}>
                <span>{doc}</span>
                <span className={`badge-patch ${index < 2 || application.certifications?.toLowerCase().includes(doc.split(" ")[0].toLowerCase()) ? "stamp-approve" : "stamp-pending"}`}>{index < 2 ? "Verified" : "Pending review"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 border border-[var(--forest)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl">Final Admin Decision</h2>
            <p className="mt-2 text-[var(--ink-soft)]">Approval requires clear sanctions status and enough audit evidence for an ORIGINO marketplace listing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-pill btn-pill-forest min-h-[44px] disabled:cursor-not-allowed disabled:opacity-50" onClick={approve} disabled={status === "approved" || loading === "approve"}>{status === "approved" ? "Approved" : loading === "approve" ? "Approving..." : "Approve"}</button>
            <button className="btn-pill btn-pill-outline min-h-[44px] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => setRejecting(true)} disabled={status === "rejected"}>{status === "rejected" ? "Rejected" : "Reject"}</button>
          </div>
        </div>
      </section>

      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-xl">
            <span className="badge-patch stamp-reject">Rejection Reason Required</span>
            <h2 className="mt-4 text-3xl">Reject {application.company_name}</h2>
            <textarea className="input-editorial mt-4 min-h-[130px]" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Add the reason and required improvements" />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setRejecting(false)}>Cancel</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={reject} disabled={loading === "reject"}>{loading === "reject" ? "Rejecting..." : "Submit Rejection"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
