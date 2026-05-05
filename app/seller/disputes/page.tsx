"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type DisputeStatus = "open" | "evidence_requested" | "seller_responded" | "resolved";

type Dispute = {
  id: string;
  order: string;
  buyer: string;
  reason: string;
  status: DisputeStatus;
  escrowHeld: number;
  response?: string;
};

const initialDisputes: Dispute[] = [
  {
    id: "disp-1",
    order: "ORD-2026-006",
    buyer: "Marina Trading LLC",
    reason: "Buyer reported inspection evidence mismatch.",
    status: "evidence_requested",
    escrowHeld: 27200,
  },
  {
    id: "disp-2",
    order: "ORD-2026-003",
    buyer: "Hansa Medical Imports",
    reason: "Packing list quantity clarification before delivery milestone release.",
    status: "open",
    escrowHeld: 18400,
  },
];

export default function SellerDisputesPage() {
  const [disputes, setDisputes] = useState(initialDisputes);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [evidenceFile, setEvidenceFile] = useState("");

  function submitResponse() {
    if (!activeId || !response.trim()) {
      toast.error("Write a seller response before submitting.");
      return;
    }
    setDisputes((current) =>
      current.map((dispute) =>
        dispute.id === activeId ? { ...dispute, status: "seller_responded", response: response.trim() } : dispute,
      ),
    );
    setActiveId(null);
    setResponse("");
    setEvidenceFile("");
    toast.success("Dispute response submitted for admin mediation.");
  }

  function resolveLocally(id: string) {
    setDisputes((current) => current.map((dispute) => (dispute.id === id ? { ...dispute, status: "resolved" } : dispute)));
    toast.success("Dispute marked resolved.");
  }

  return (
    <div className="space-y-8">
      <section>
        <span className="section-kicker">Escrow mediation</span>
        <h1>Disputes</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Respond to buyer disputes with notes and evidence so ORIGINO can mediate escrow decisions.
        </p>
      </section>

      <section className="space-y-4">
        {disputes.map((dispute) => (
          <div className="border p-5" key={dispute.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-3">
                  <span className="badge-patch">{dispute.status}</span>
                  <span className="badge-patch">Escrow ${dispute.escrowHeld.toLocaleString()}</span>
                </div>
                <h2 className="mt-3 text-2xl">{dispute.order}</h2>
                <p className="mt-2 text-ink-soft">{dispute.buyer}</p>
                <p className="mt-3">{dispute.reason}</p>
                {dispute.response ? <p className="mt-3 border bg-cream p-3">Seller response: {dispute.response}</p> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(dispute.id)}>
                  Respond
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => resolveLocally(dispute.id)}>
                  Mark Resolved
                </button>
              </div>
            </div>
            {activeId === dispute.id ? (
              <div className="mt-5 border bg-warm-white p-4">
                <label className="block text-xs uppercase tracking-[0.24em] text-ink-muted">Seller response</label>
                <textarea className="input-editorial mt-2 min-h-32" value={response} onChange={(event) => setResponse(event.target.value)} />
                <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">Evidence upload</label>
                <input
                  className="input-editorial mt-2"
                  type="file"
                  onChange={(event) => setEvidenceFile(event.target.files?.[0]?.name ?? "")}
                />
                {evidenceFile ? <p className="mt-2 text-sm text-forest">Selected: {evidenceFile}</p> : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="btn-pill btn-pill-forest" type="button" onClick={submitResponse}>
                    Submit Response
                  </button>
                  <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </section>
    </div>
  );
}
