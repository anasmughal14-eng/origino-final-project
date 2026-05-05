"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type BuyerRecord = {
  id: string;
  name: string;
  company: string;
  country: string;
  industry: string;
  intentScore: number;
  status: "pending" | "verified" | "premium" | "blocked";
  inquiries: number;
  rfqs: number;
  notes: string;
};

const seedBuyers: BuyerRecord[] = [
  { id: "buyer-1", name: "Marta Klein", company: "Hansa Medical Imports GmbH", country: "Germany", industry: "Medical distribution", intentScore: 88, status: "verified", inquiries: 3, rfqs: 1, notes: "Verified importer profile complete; active surgical instrument sourcing." },
  { id: "buyer-2", name: "Omar Haddad", company: "Marina Trading LLC", country: "UAE", industry: "Hospitality supplies", intentScore: 76, status: "pending", inquiries: 2, rfqs: 1, notes: "VAT certificate pending before premium lead upgrade." },
  { id: "buyer-3", name: "Sarah Collins", company: "Northstar Home Retail", country: "United Kingdom", industry: "Home textiles", intentScore: 64, status: "pending", inquiries: 1, rfqs: 0, notes: "Company website reviewed; needs DUNS or VAT evidence." },
];

function statusClass(statusValue: BuyerRecord["status"]) {
  if (statusValue === "verified") return "border-[var(--forest)] bg-[var(--forest-pale)] text-[var(--forest)]";
  if (statusValue === "premium") return "border-[var(--gold)] bg-[var(--gold-pale)] text-[var(--gold)]";
  if (statusValue === "blocked") return "border-[var(--terracotta)] bg-[var(--terracotta-pale)] text-[var(--terracotta)]";
  return "border-[var(--border-strong)] bg-[var(--cream)] text-[var(--ink-soft)]";
}

function intentClass(score: number) {
  if (score >= 80) return "text-[var(--forest)]";
  if (score >= 60) return "text-[var(--gold)]";
  return "text-[var(--terracotta)]";
}

export default function AdminBuyersPage() {
  const [buyers, setBuyers] = useState(seedBuyers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BuyerRecord["status"] | "all">("all");
  const [active, setActive] = useState<BuyerRecord | null>(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(() => buyers.filter((buyer) => {
    const haystack = `${buyer.name} ${buyer.company} ${buyer.country} ${buyer.industry}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (status === "all" || buyer.status === status);
  }), [buyers, query, status]);

  function updateBuyer(id: string, update: Partial<BuyerRecord>, message: string) {
    setBuyers((list) => list.map((buyer) => buyer.id === id ? { ...buyer, ...update } : buyer));
    toast.success(message);
  }

  function openReview(buyer: BuyerRecord) {
    setActive(buyer);
    setNote(buyer.notes);
  }

  function saveReview(statusValue: BuyerRecord["status"]) {
    if (!active) return;
    if (!note.trim()) {
      toast.error("Admin note is required");
      return;
    }
    updateBuyer(active.id, { status: statusValue, notes: note }, `Buyer ${statusValue}`);
    setActive(null);
  }

  return (
    <div>
      <div className="panel-soft flex flex-wrap items-end justify-between gap-6 p-6 md:p-8">
        <div>
          <span className="section-kicker">Buyer Trust</span>
          <h1 className="mt-5 text-5xl leading-none md:text-7xl">Buyers</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-soft)]">Review buyer company profiles, intent scores, verified importer status, and premium lead quality.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <div><p className="metric-numeral text-3xl">{buyers.length}</p><p className="small-caps text-sm">Buyers</p></div>
          <div><p className="metric-numeral text-3xl">{buyers.filter((buyer) => buyer.status === "verified" || buyer.status === "premium").length}</p><p className="small-caps text-sm">Verified</p></div>
          <div><p className="metric-numeral text-3xl">{buyers.filter((buyer) => buyer.status === "pending").length}</p><p className="small-caps text-sm">Pending</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_240px]">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search buyer, company, country" />
        <select className="input-editorial" value={status} onChange={(event) => setStatus(event.target.value as BuyerRecord["status"] | "all")}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="premium">Premium</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="mt-8 overflow-x-auto border">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead className="border-b bg-[var(--cream)] text-left">
            <tr>
              <th className="p-4">Buyer</th>
              <th className="p-4">Company</th>
              <th className="p-4">Intent</th>
              <th className="p-4">Activity</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((buyer) => (
              <tr className="border-b align-top" key={buyer.id}>
                <td className="p-4"><p className="font-semibold">{buyer.name}</p><p className="text-xs text-[var(--ink-muted)]">{buyer.country}</p></td>
                <td className="p-4"><p>{buyer.company}</p><p className="text-xs text-[var(--ink-muted)]">{buyer.industry}</p></td>
                <td className="p-4"><span className={`metric-numeral text-xl ${intentClass(buyer.intentScore)}`}>{buyer.intentScore}</span><p className="text-xs text-[var(--ink-muted)]">{buyer.intentScore >= 80 ? "High intent" : buyer.intentScore >= 60 ? "Medium intent" : "Low intent"}</p></td>
                <td className="p-4">{buyer.inquiries} inquiries · {buyer.rfqs} RFQs</td>
                <td className="p-4"><span className={`badge-patch ${statusClass(buyer.status)}`}>{buyer.status}</span></td>
                <td className="p-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => openReview(buyer)}>Review</button>
                    <button className="btn-pill btn-pill-outline min-h-[44px] border-[var(--gold)] text-[var(--gold)]" onClick={() => updateBuyer(buyer.id, { status: "premium" }, "Buyer upgraded to premium")}>Premium</button>
                    <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => updateBuyer(buyer.id, { status: "verified" }, "Buyer verified")}>Verify</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <div className="mt-6 border p-6 text-center">No buyers match this filter.</div>}

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.62)] p-4">
          <div className="modal-surface w-full max-w-2xl overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[#f7f3ee] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="badge-patch border-[var(--forest)] bg-[var(--forest-pale)] text-[var(--forest)]">Company Review</span>
                  <h2 className="mt-4 text-3xl">{active.company}</h2>
                </div>
                <span className={`badge-patch ${statusClass(active.status)}`}>{active.status}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="border border-[var(--border)] bg-[#fdfbf8] p-4">
                  <p className="small-caps text-xs text-[var(--ink-muted)]">Contact</p>
                  <p className="mt-2 font-semibold">{active.name}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{active.country}</p>
                </div>
                <div className="border border-[var(--border)] bg-[#fdfbf8] p-4">
                  <p className="small-caps text-xs text-[var(--ink-muted)]">Buyer Intent</p>
                  <p className={`metric-numeral mt-2 text-3xl ${intentClass(active.intentScore)}`}>{active.intentScore}</p>
                  <p className="text-sm text-[var(--ink-muted)]">{active.inquiries} inquiries · {active.rfqs} RFQs</p>
                </div>
                <div className="border border-[var(--border)] bg-[#fdfbf8] p-4 md:col-span-2">
                  <p className="small-caps text-xs text-[var(--ink-muted)]">Industry</p>
                  <p className="mt-2 font-semibold">{active.industry}</p>
                  <p className="mt-1 text-sm text-[var(--ink-muted)]">Supplier-facing trust decision for verified importer and premium lead quality.</p>
                </div>
              </div>
              <label className="mt-4 block">
                <span className="small-caps mb-2 block text-xs text-[var(--ink-muted)]">Admin verification note</span>
                <textarea className="input-editorial min-h-[130px] bg-[#fdfbf8]" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Admin verification note" />
              </label>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setActive(null)}>Cancel</button>
                <button className="btn-pill btn-pill-outline min-h-[44px] border-[var(--terracotta)] text-[var(--terracotta)]" onClick={() => saveReview("blocked")}>Block</button>
                <button className="btn-pill btn-pill-outline min-h-[44px] border-[var(--gold)] text-[var(--gold)]" onClick={() => saveReview("premium")}>Premium</button>
                <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => saveReview("verified")}>Verify Buyer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
