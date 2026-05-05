"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Result = { totalLandedCost: number; breakdown: Record<string, number> };

export default function LandedCostPage() {
  const [form, setForm] = useState({ productValue: "10000", quantity: "1", destination: "Germany", freight: "800", insurance: "50", gspPlus: true });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function calculate() {
    setLoading(true);
    const response = await fetch("/api/landed-cost/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = (await response.json()) as { success: boolean; data?: Result; error?: string };
    setLoading(false);
    if (!json.success || !json.data) return toast.error(json.error ?? "Calculation failed");
    setResult(json.data);
  }

  async function saveCalculation() {
    setSaving(true);
    const response = await fetch("/api/landed-cost/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = (await response.json()) as { success: boolean; data?: Result; error?: string };
    setSaving(false);
    if (!json.success || !json.data) return toast.error(json.error ?? "Save failed");
    setResult(json.data);
    toast.success("Calculation saved");
  }

  const fieldLabels: Record<"productValue" | "quantity" | "freight" | "insurance", string> = {
    productValue: "Product value (USD)",
    quantity: "Quantity",
    freight: "Freight cost (USD)",
    insurance: "Insurance cost (USD)",
  };

  const breakdownLabels: Record<string, string> = {
    productValue: "Product value",
    freight: "Freight",
    insurance: "Insurance",
    dutyRate: "Duty rate",
    duty: "Duty",
    vatRate: "VAT rate",
    vat: "VAT",
    gspPlusSavings: "GSP+ savings",
  };

  return (
    <div className="container-editorial pb-16 pt-36">
      <h1 className="text-5xl">Landed Cost Calculator</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="space-y-4">
          {(["productValue", "quantity", "freight", "insurance"] as const).map((field) => (
            <label key={field} className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">{fieldLabels[field]}</span>
              <input className="input-editorial min-h-[44px]" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={fieldLabels[field]} inputMode="decimal" />
            </label>
          ))}
          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Destination country</span>
            <select className="input-editorial min-h-[44px]" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })}><option>Germany</option><option>UAE</option><option>USA</option><option>UK</option></select>
          </label>
          <label className="flex min-h-[44px] items-center gap-2"><input type="checkbox" checked={form.gspPlus} onChange={(event) => setForm({ ...form, gspPlus: event.target.checked })} /> Apply Pakistan GSP+ benefit</label>
          <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={calculate}>{loading ? "Calculating..." : "Calculate"}</button>
          <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={saveCalculation}>{saving ? "Saving..." : "Save Calculation"}</button>
        </section>
        <section className="border border-[rgba(26,26,24,0.16)] p-5">
          <h2 className="text-3xl">Breakdown</h2>
          {!result && <p className="mt-4 text-[#5a5a54]">Run a calculation to see duty, VAT, GSP+ savings, and total landed cost.</p>}
          {result && <table className="mt-4 w-full text-sm"><tbody>{Object.entries(result.breakdown).map(([key, value]) => <tr className="border-b" key={key}><th className="p-2 text-start">{breakdownLabels[key] ?? key}</th><td className="metric-numeral p-2 text-end">${value.toFixed(2)}</td></tr>)}<tr><th className="p-2 text-start">Total landed cost</th><td className="metric-numeral p-2 text-end">${result.totalLandedCost.toFixed(2)}</td></tr></tbody></table>}
        </section>
      </div>
    </div>
  );
}
