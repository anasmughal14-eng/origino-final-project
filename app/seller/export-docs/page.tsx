"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type SellerDocument = {
  title: string;
  guide: string;
  relevance: string;
  status: "verified" | "pending" | "expired" | "missing";
  requiredFor: string;
  expiry?: string;
};

const initialDocs: SellerDocument[] = [
  { title: "Form-E", guide: "/export-docs/form-e-pakistan", relevance: "Required for bank remittance on every export shipment.", status: "verified", requiredFor: "All exports" },
  { title: "Certificate of Origin", guide: "/export-docs/certificate-of-origin", relevance: "Needed by EU and GCC buyers to prove Pakistani origin.", status: "pending", requiredFor: "EU / GCC buyers" },
  { title: "ISO 13485 Certificate", guide: "/export-docs/ce-marking-pakistan", relevance: "Critical for surgical instruments from Sialkot.", status: "expired", requiredFor: "Medical instruments", expiry: "2026-05-20" },
  { title: "GSP+ Certificate", guide: "/export-docs/gsp-plus-certificate", relevance: "Can reduce EU landed duty when rules of origin are met.", status: "missing", requiredFor: "EU buyers" },
  { title: "CE Technical File", guide: "/export-docs/ce-marking-pakistan", relevance: "Required before claiming CE readiness on buyer-facing profiles.", status: "pending", requiredFor: "EU medical buyers" },
];

function statusClass(status: SellerDocument["status"]) {
  if (status === "verified") return "stamp-approve";
  if (status === "expired") return "stamp-reject";
  if (status === "pending") return "stamp-pending";
  return "";
}

export default function SellerExportDocsPage() {
  const [docs, setDocs] = useState(initialDocs);
  const [filter, setFilter] = useState<SellerDocument["status"] | "all">("all");
  const [uploading, setUploading] = useState("");

  const visibleDocs = useMemo(() => docs.filter((doc) => filter === "all" || doc.status === filter), [docs, filter]);
  const verified = docs.filter((doc) => doc.status === "verified").length;
  const progress = Math.round((verified / docs.length) * 100);

  function upload(title: string) {
    setUploading(title);
    window.setTimeout(() => {
      setDocs((items) => items.map((item) => item.title === title ? { ...item, status: "pending" } : item));
      setUploading("");
      toast.success(`${title} uploaded for admin verification`);
    }, 600);
  }

  function markComplete(title: string) {
    setDocs((items) => items.map((item) => item.title === title ? { ...item, status: "verified" } : item));
    toast.success(`${title} marked verified in local vault`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Seller Document Vault</span>
          <h1 className="mt-4 text-4xl">Export Docs Checklist</h1>
          <p className="mt-3 max-w-3xl text-[var(--ink-soft)]">Personalized for Crescent Surgical Works: Sialkot, surgical instruments, EU/GCC buyers, and GSP+ eligibility.</p>
        </div>
        <Link className="btn-pill btn-pill-forest min-h-[44px]" href="/export-docs">Open Public Guides</Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="border border-[var(--border)] p-5">
          <p className="metric-numeral text-3xl">{progress}%</p>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">Profile document readiness</p>
          <div className="mt-4 h-2 bg-[var(--cream-dark)]"><div className="h-full bg-[var(--forest)]" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="border border-[var(--border)] p-5"><p className="metric-numeral text-3xl">{verified}/{docs.length}</p><p className="mt-2 text-sm text-[var(--ink-muted)]">Verified documents</p></div>
        <div className="border border-[var(--border)] p-5"><p className="metric-numeral text-3xl">{docs.filter((doc) => doc.status === "expired").length}</p><p className="mt-2 text-sm text-[var(--ink-muted)]">Expiry alerts</p></div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "verified", "pending", "expired", "missing"] as const).map((item) => (
          <button className="btn-pill btn-pill-outline min-h-[44px]" key={item} onClick={() => setFilter(item)}>{filter === item ? `${item} selected` : item}</button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {visibleDocs.map((doc) => (
          <div className="flex flex-wrap items-start justify-between gap-4 border border-[var(--border)] p-5" key={doc.title}>
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl">{doc.title}</h2>
                <span className={`badge-patch ${statusClass(doc.status)}`}>{doc.status}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">{doc.relevance}</p>
              <p className="mt-2 text-sm"><span className="small-caps text-[var(--ink-muted)]">Required for</span> {doc.requiredFor}</p>
              {doc.expiry && <p className="mt-1 text-sm text-[var(--terracotta)]">Expires {doc.expiry}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn-pill btn-pill-outline min-h-[44px]" href={doc.guide}>Guide</Link>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => upload(doc.title)} disabled={uploading === doc.title}>{uploading === doc.title ? "Uploading..." : doc.status === "expired" ? "Re-upload" : "Upload"}</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => markComplete(doc.title)}>Mark Verified</button>
            </div>
          </div>
        ))}
        {visibleDocs.length === 0 && <div className="border border-dashed border-[var(--border-strong)] p-6 text-sm text-[var(--ink-muted)]">No documents match this filter.</div>}
      </div>
    </div>
  );
}
