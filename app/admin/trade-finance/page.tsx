"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type FinanceStatus = "pending" | "under_review" | "approved" | "rejected" | "funded";

type FinanceApplication = {
  id: string;
  supplier: string;
  type: string;
  amount: number;
  riskScore: number;
  status: FinanceStatus;
  tenure: string;
  rate?: string;
};

const initialApplications: FinanceApplication[] = [
  { id: "fin-1", supplier: "Crescent Surgical Works", type: "Invoice factoring", amount: 18400, riskScore: 82, status: "under_review", tenure: "45 days" },
  { id: "fin-2", supplier: "Nishat Weaves Faisalabad", type: "PO financing", amount: 32000, riskScore: 74, status: "pending", tenure: "60 days" },
  { id: "fin-3", supplier: "Karachi Agro Foods", type: "Working capital", amount: 12000, riskScore: 66, status: "approved", tenure: "30 days", rate: "11.5%" },
];

export default function AdminTradeFinancePage() {
  const [applications, setApplications] = useState(initialApplications);
  const [status, setStatus] = useState<"all" | FinanceStatus>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");

  const visibleApplications = useMemo(
    () => applications.filter((application) => status === "all" || application.status === status),
    [applications, status],
  );

  const activeApplication = applications.find((application) => application.id === activeId);

  function patchApplication(id: string, updates: Partial<FinanceApplication>) {
    setApplications((current) => current.map((application) => (application.id === id ? { ...application, ...updates } : application)));
  }

  function approveApplication() {
    if (!activeApplication) return;
    if (!rate.trim() || !tenure.trim()) {
      toast.error("Interest rate and tenure are required.");
      return;
    }
    patchApplication(activeApplication.id, { status: "approved", rate: rate.trim(), tenure: tenure.trim() });
    setActiveId(null);
    setRate("");
    setTenure("");
    toast.success("Finance application approved.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Finance review</span>
          <h1>Trade Finance</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Review invoice factoring, PO financing, export credit, and working capital requests with risk scoring.
          </p>
        </div>
        <select className="input-editorial min-h-11 max-w-xs" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under review</option>
          <option value="approved">Approved</option>
          <option value="funded">Funded</option>
          <option value="rejected">Rejected</option>
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border p-5">
          <p className="metric-text text-3xl">${applications.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
          <p className="mt-2 text-ink-soft">Requested capital</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{applications.filter((item) => item.status === "approved").length}</p>
          <p className="mt-2 text-ink-soft">Approved</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">74</p>
          <p className="mt-2 text-ink-soft">Average risk score</p>
        </div>
      </section>

      <section className="space-y-4">
        {visibleApplications.map((application) => (
          <div className="border p-5" key={application.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap gap-3">
                  <span className="badge-patch">{application.type}</span>
                  <span className="badge-patch">{application.status}</span>
                </div>
                <h2 className="mt-3 text-2xl">{application.supplier}</h2>
                <p className="mt-2 metric-text">${application.amount.toLocaleString()} / risk {application.riskScore}</p>
                <p className="mt-2 text-ink-soft">
                  Tenure {application.tenure}
                  {application.rate ? ` / Rate ${application.rate}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(application.id)}>
                  Set Terms
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => patchApplication(application.id, { status: "rejected" })}>
                  Reject
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => patchApplication(application.id, { status: "funded" })}>
                  Mark Funded
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {activeApplication ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.55)] p-4">
          <div className="modal-surface w-full max-w-xl">
            <span className="section-kicker">Set finance terms</span>
            <h2 className="mt-4 text-3xl">{activeApplication.supplier}</h2>
            <label className="mt-5 block text-xs uppercase tracking-[0.24em] text-ink-muted">Interest rate</label>
            <input className="input-editorial mt-2" value={rate} onChange={(event) => setRate(event.target.value)} placeholder="11.5%" />
            <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">Tenure</label>
            <input className="input-editorial mt-2" value={tenure} onChange={(event) => setTenure(event.target.value)} placeholder="45 days" />
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(null)}>
                Cancel
              </button>
              <button className="btn-pill btn-pill-forest" type="button" onClick={approveApplication}>
                Approve
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
