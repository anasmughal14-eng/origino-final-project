"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Breakdown = {
  productValue: number;
  freight: number;
  insurance: number;
  dutyRate: number;
  duty: number;
  vatRate: number;
  vat: number;
  gspPlusSavings: number;
};

export default function BuyerLandedCostPage() {
  const [form, setForm] = useState({ destination: "Germany", productValue: "12000", quantity: "1000", freight: "750", insurance: "120", gspPlus: true });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ totalLandedCost: number; costPerUnit: number; breakdown: Breakdown } | null>(null);
  const [saved, setSaved] = useState<Array<{ id: string; destination: string; total: number }>>([
    { id: "LC-2401", destination: "Germany", total: 15120 },
    { id: "LC-2402", destination: "UAE", total: 9870 },
  ]);

  async function calculate() {
    setLoading(true);
    try {
      const response = await fetch("/api/landed-cost/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, productValue: Number(form.productValue), quantity: Number(form.quantity), freight: Number(form.freight), insurance: Number(form.insurance) }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Calculation failed");
      setResult(json.data);
      toast.success("Landed cost calculated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  }

  function saveCalculation() {
    if (!result) {
      toast.error("Run a calculation first");
      return;
    }
    setSaved((items) => [{ id: `LC-${Date.now()}`, destination: form.destination, total: result.totalLandedCost }, ...items]);
    toast.success("Calculation saved");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">BUYER COST DESK</span>
          <h1 className="mt-4 text-4xl">Landed Cost</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">Calculate duties, VAT, freight, insurance, and Pakistan GSP+ savings before placing an RFQ.</p>
        </div>
        <button className="btn-pill btn-pill-outline" onClick={saveCalculation}>Save Calculation</button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border border-[#e2ddd8] p-5">
          <label className="label-editorial">Destination</label>
          <select className="input-editorial" value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })}>
            <option>Germany</option>
            <option>United Kingdom</option>
            <option>UAE</option>
            <option>Saudi Arabia</option>
          </select>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label>
              <span className="label-editorial">Product Value</span>
              <input className="input-editorial" value={form.productValue} onChange={(event) => setForm({ ...form, productValue: event.target.value })} type="number" min="1" />
            </label>
            <label>
              <span className="label-editorial">Quantity</span>
              <input className="input-editorial" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} type="number" min="1" />
            </label>
            <label>
              <span className="label-editorial">Freight</span>
              <input className="input-editorial" value={form.freight} onChange={(event) => setForm({ ...form, freight: event.target.value })} type="number" min="0" />
            </label>
            <label>
              <span className="label-editorial">Insurance</span>
              <input className="input-editorial" value={form.insurance} onChange={(event) => setForm({ ...form, insurance: event.target.value })} type="number" min="0" />
            </label>
          </div>
          <label className="mt-4 flex min-h-[44px] items-center gap-3">
            <input checked={form.gspPlus} onChange={(event) => setForm({ ...form, gspPlus: event.target.checked })} type="checkbox" />
            Apply Pakistan GSP+ where eligible
          </label>
          <button className="btn-pill btn-pill-forest mt-5" disabled={loading} onClick={calculate}>{loading ? "Calculating..." : "Calculate"}</button>
        </div>

        <div className="border border-[#e2ddd8] p-5">
          <h2 className="text-2xl">Breakdown</h2>
          {result ? (
            <div className="mt-4 space-y-3">
              {Object.entries(result.breakdown).map(([key, value]) => (
                <div className="flex justify-between border-b border-[#e2ddd8] py-2" key={key}>
                  <span>{key}</span>
                  <span className="metric-numeral">{typeof value === "number" ? `$${value.toFixed(2)}` : value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 text-xl">
                <strong>Total</strong>
                <strong className="metric-numeral">${result.totalLandedCost.toFixed(2)}</strong>
              </div>
            </div>
          ) : <p className="mt-4 text-[#5a5a54]">Run the calculator to see a full cost table.</p>}
        </div>
      </div>

      <div className="mt-8 border border-[#e2ddd8]">
        {saved.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2ddd8] p-4" key={item.id}>
            <div>
              <h3 className="font-semibold">{item.id}</h3>
              <p className="text-sm text-[#5a5a54]">{item.destination}</p>
            </div>
            <span className="metric-numeral">${item.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
