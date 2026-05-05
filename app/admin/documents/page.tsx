"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type DocumentStatus = "pending" | "verified" | "rejected" | "expired";

type SupplierDocument = {
  id: string;
  supplier: string;
  document: string;
  expires: string;
  status: DocumentStatus;
  note?: string;
};

const initialDocuments: SupplierDocument[] = [
  { id: "doc-1", supplier: "Crescent Surgical Works", document: "ISO 13485 Certificate", expires: "2026-05-20", status: "expired" },
  { id: "doc-2", supplier: "Nishat Weaves Faisalabad", document: "OEKO-TEX Certificate", expires: "2027-01-15", status: "pending" },
  { id: "doc-3", supplier: "Karachi Agro Foods", document: "Halal Certificate", expires: "2026-11-30", status: "verified" },
  { id: "doc-4", supplier: "Lahore Leather Company", document: "SECP Registration", expires: "Permanent", status: "pending" },
];

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [status, setStatus] = useState<"all" | DocumentStatus>("all");
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const visibleDocuments = useMemo(
    () => documents.filter((document) => status === "all" || document.status === status),
    [documents, status],
  );

  const reviewDocument = documents.find((document) => document.id === reviewId);

  function updateStatus(id: string, nextStatus: DocumentStatus) {
    setDocuments((current) =>
      current.map((document) => (document.id === id ? { ...document, status: nextStatus, note: note.trim() || document.note } : document)),
    );
    setReviewId(null);
    setNote("");
    toast.success(`Document ${nextStatus}.`);
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Verification vault</span>
          <h1>Documents</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Verify supplier NTN, SECP, ISO, CE, FDA, GSP+, and expiry evidence before public trust badges change.
          </p>
        </div>
        <select className="input-editorial min-h-11 max-w-xs" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="expired">Expired</option>
          <option value="rejected">Rejected</option>
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {(["pending", "verified", "expired", "rejected"] as DocumentStatus[]).map((item) => (
          <div className="border p-5" key={item}>
            <p className="metric-text text-3xl">{documents.filter((document) => document.status === item).length}</p>
            <p className="mt-2 capitalize text-ink-soft">{item}</p>
          </div>
        ))}
      </section>

      <section className="border">
        <div className="grid gap-3 border-b bg-cream p-4 font-semibold md:grid-cols-[1fr_1fr_auto_auto]">
          <span>Supplier</span>
          <span>Document</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y">
          {visibleDocuments.map((document) => (
            <div className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto_auto]" key={document.id}>
              <div>
                <strong>{document.supplier}</strong>
                <p className="text-sm text-ink-muted">Expires {document.expires}</p>
              </div>
              <span>{document.document}</span>
              <span className="badge-patch">{document.status}</span>
              <div className="flex flex-wrap gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setReviewId(document.id)}>
                  Review
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateStatus(document.id, "verified")}>
                  Verify
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateStatus(document.id, "rejected")}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {reviewDocument ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.55)] p-4">
          <div className="modal-surface w-full max-w-2xl">
            <span className="section-kicker">Document review</span>
            <h2 className="mt-4 text-3xl">{reviewDocument.document}</h2>
            <p className="mt-2 text-ink-soft">{reviewDocument.supplier}</p>
            <textarea
              className="input-editorial mt-5 min-h-32"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Admin verification note"
            />
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => setReviewId(null)}>
                Close
              </button>
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateStatus(reviewDocument.id, "rejected")}>
                Reject
              </button>
              <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateStatus(reviewDocument.id, "verified")}>
                Verify
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
