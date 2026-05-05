"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type FinanceApplication = {
  id: string;
  type: string;
  amount: string;
  orderValue: string;
  status: string;
};

const eligibility = [
  "Seller health score above 60",
  "Confirmed order or purchase order attached",
  "Buyer is verified or premium intent",
  "Requested finance does not exceed 80% of order value",
];

export default function TradeFinanceClient() {
  const [type, setType] = useState("invoice_factoring");
  const [amount, setAmount] = useState("");
  const [orderValue, setOrderValue] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applications, setApplications] = useState<FinanceApplication[]>([
    { id: "finance-seed-1", type: "PO financing", amount: "$18,000", orderValue: "$24,500", status: "Under review" },
  ]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid requested amount.");
      return;
    }
    if (!orderValue || Number(orderValue) <= 0) {
      setError("Enter a valid confirmed order value.");
      return;
    }
    if (Number(amount) > Number(orderValue) * 0.8) {
      setError("Requested finance cannot exceed 80% of the order value.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/trade-finance/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId: "sup-1", applicationType: type, amountRequested: Number(amount), orderValueUsd: Number(orderValue), notes }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok || !payload.success) {
      setError(payload.error ?? "Finance application failed.");
      return;
    }
    setApplications((current) => [
      { id: payload.data.applicationId, type: type.replace("_", " "), amount: `$${Number(amount).toLocaleString()}`, orderValue: `$${Number(orderValue).toLocaleString()}`, status: "Pending admin review" },
      ...current,
    ]);
    setAmount("");
    setOrderValue("");
    setNotes("");
    toast.success("Finance application submitted");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Trade Finance</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">Apply for invoice factoring, PO financing, export credit, or working capital against verified ORIGINO orders.</p>
        </div>
        <span className="badge-patch tier-certified">SBP EFS ready</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {eligibility.map((item) => (
          <div className="border border-[#e2ddd8] p-4 text-sm" key={item}>{item}</div>
        ))}
      </div>

      <form className="mt-6 border border-[#e2ddd8] p-5" onSubmit={submit}>
        <h2 className="text-2xl">New finance application</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Product</span>
            <select className="input-editorial" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="invoice_factoring">Invoice factoring</option>
              <option value="po_financing">PO financing</option>
              <option value="export_credit">Export credit</option>
              <option value="working_capital">Working capital</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Requested amount USD</span>
            <input className="input-editorial" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="12000" />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Order value USD</span>
            <input className="input-editorial" inputMode="numeric" value={orderValue} onChange={(event) => setOrderValue(event.target.value)} placeholder="20000" />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Notes</span>
          <textarea className="input-editorial min-h-[100px]" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Buyer, order reference, repayment context" />
        </label>
        {error && <p className="mt-3 text-sm text-[#c0623a]">{error}</p>}
        <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" disabled={loading}>{loading ? "Submitting..." : "Submit Application"}</button>
      </form>

      <div className="mt-6 space-y-3">
        {applications.map((application) => (
          <div className="flex flex-wrap items-center justify-between gap-3 border border-[#e2ddd8] p-4" key={application.id}>
            <div>
              <p className="font-semibold capitalize">{application.type}</p>
              <p className="mt-1 text-sm text-[#5a5a54]">{application.amount} requested against {application.orderValue}</p>
            </div>
            <span className="badge-patch">{application.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
